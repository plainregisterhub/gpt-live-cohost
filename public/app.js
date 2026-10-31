const $ = s => document.querySelector(s);
let lastReply = "";
const msg = $("#message"), err = $("#error"), gen = $("#generate");
function setIfPresent(selector, value) { const el = $(selector); if (el) el.textContent = value; }
msg.addEventListener("input", () => setIfPresent("#count", msg.value.length + " / 1000"));
document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => { msg.value=b.dataset.prompt; msg.dispatchEvent(new Event("input")); }));
gen.addEventListener("click", async () => {
  err.hidden = true;
  if (!msg.value.trim()) { err.textContent="Enter a test viewer message first."; err.hidden=false; return; }
  gen.disabled=true; gen.textContent="Thinking…"; setIfPresent("#reply-state","GENERATING");
  try {
    const r=await fetch("/api/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg.value.trim()})});
    const data=await r.json(); if(!r.ok) throw new Error(data.error||"Request failed");
    lastReply=data.reply; $("#reply").textContent=lastReply; setIfPresent("#reply-state","READY");
  } catch(e) { err.textContent=e.message; err.hidden=false; setIfPresent("#reply-state","ERROR"); }
  finally { gen.disabled=false; gen.textContent="Generate reply"; }
});
$("#speak").addEventListener("click",()=>{if(!lastReply)return;if(!("speechSynthesis"in window)){err.textContent="Speech is not supported by this browser.";err.hidden=false;return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lastReply);u.lang="en-US";u.rate=.96;speechSynthesis.speak(u);});
$("#stop").addEventListener("click",()=>{if("speechSynthesis"in window)speechSynthesis.cancel();});
$("#copy").addEventListener("click",async()=>{if(!lastReply)return;try{await navigator.clipboard.writeText(lastReply);$("#copy").textContent="Copied!";setTimeout(()=>$("#copy").textContent="Copy",1200);}catch{err.textContent="Clipboard unavailable; select and copy the reply manually.";err.hidden=false;}});
fetch("/api/health").then(r=>r.json()).then(d=>{setIfPresent("#status",d.aiConfigured?"Server online · AI configured":"Server online · API setup needed");setIfPresent("#ai-state",d.aiConfigured?"CONFIGURED":"API KEY NEEDED");}).catch(()=>{setIfPresent("#status","Server status unknown");setIfPresent("#ai-state","UNAVAILABLE");});
