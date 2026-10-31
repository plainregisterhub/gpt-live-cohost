const $ = selector => document.querySelector(selector);
let lastReply = "";
let recognition = null;
let isListening = false;
const msg = $("#message");
const mode = $("#mode");
const err = $("#error");
const gen = $("#generate");
const micButton = $("#mic");

function showError(message) { err.textContent = message; err.hidden = false; }
function clearError() { err.textContent = ""; err.hidden = true; }
function setText(selector, value) { const el = $(selector); if (el) el.textContent = value; }
function setListening(listening) {
  isListening = listening;
  micButton.textContent = listening ? "⏹ Stop listening" : "🎙️ Speak in Malay";
  setText("#mic-state", listening ? "LISTENING" : "MIC READY");
  micButton.classList.toggle("listening", listening);
}
function updateCount() { setText("#count", msg.value.length + " / 1000"); }
msg.addEventListener("input", updateCount);

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micButton.disabled = true;
    setText("#mic-help", "Voice input is not supported by this browser. You can still type in Malay or English.");
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "ms-MY";
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.onstart = () => { clearError(); setListening(true); setText("#mic-help", "Listening… speak naturally in Malay, then pause."); };
  recognition.onresult = event => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
    msg.value = transcript.trim();
    updateCount();
  };
  recognition.onerror = event => {
    if (event.error !== "no-speech" && event.error !== "aborted") showError("Microphone error: " + event.error + ". Check browser microphone permission.");
  };
  recognition.onend = () => {
    setListening(false);
    setText("#mic-help", "Voice input fills the text box. Check the transcript, then tap Generate reply.");
  };
}
micButton.addEventListener("click", () => {
  if (!recognition) return;
  if (isListening) { recognition.stop(); return; }
  try { recognition.start(); } catch { showError("The microphone is already starting. Wait a moment and try again."); }
});
setupSpeechRecognition();

gen.addEventListener("click", async () => {
  clearError();
  if (!msg.value.trim() && mode.value !== "topic") { showError("Type a message or use the microphone first."); return; }
  gen.disabled = true;
  gen.textContent = "Thinking…";
  setText("#reply-state", "GENERATING");
  try {
    const response = await fetch("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg.value.trim(), mode: mode.value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    lastReply = data.reply;
    $("#reply").textContent = lastReply;
    setText("#reply-state", "READY");
  } catch (error) {
    showError(error.message || "Could not reach the AI server.");
    setText("#reply-state", "ERROR");
  } finally {
    gen.disabled = false;
    gen.textContent = "Generate reply ↗";
  }
});

$("#speak").addEventListener("click", () => {
  clearError();
  if (!lastReply) { showError("Generate a reply first."); return; }
  if (!("speechSynthesis" in window)) { showError("Speech playback is not supported by this browser."); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(lastReply);
  utterance.lang = "en-US";
  utterance.rate = 0.96;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
});
$("#stop").addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (recognition && isListening) recognition.stop();
});
$("#copy").addEventListener("click", async () => {
  if (!lastReply) { showError("Generate a reply first."); return; }
  try {
    await navigator.clipboard.writeText(lastReply);
    $("#copy").textContent = "Copied!";
    setTimeout(() => { $("#copy").textContent = "Copy text"; }, 1200);
  } catch { showError("Clipboard unavailable. Select and copy the reply manually."); }
});

fetch("/api/health")
  .then(response => response.json())
  .then(data => {
    setText("#status", data.ok ? "Server online" : "Server issue");
    setText("#ai-state", data.aiConfigured ? "AI API configured" : "AI API key needed");
    $("#server-light").classList.toggle("ready", Boolean(data.ok));
  })
  .catch(() => {
    setText("#status", "Server not reachable");
    setText("#ai-state", "Check deployment");
  });
