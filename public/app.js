const $ = s => document.querySelector(s);
let lastReply = "";
const msg = $("#message"), err = $("#error"), gen = $("#generate");
msg.addEventListener("input", () => $("#count").textContent = msg.value.length + " / 1000");
document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => { msg.value=b.dataset.prompt; msg.dispatchEvent(new Event("input")); }));
gen.addEventListener("click", async () => {
  err.hidden=true;
  if (!msg.value.trim()) { err.textContent="Enter a test viewer message first."; err.hidden=false; return; }
  gen.disabled=true; gen.textContent="Thinking…";
  try {
    const r=await fetch("/api/respond",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg.value.trim()})});
    const data=await r.json(); if(!r.ok) throw new Error(data.error||"Request failed");
    lastReply=data.reply; $("#reply").textContent=lastReply; $("#reply-state").textContent="READY";
  } catch(e) { err.textContent=e.message; err.hidden=false; $("#reply-state").textContent="ERROR"; }
  finally { gen.disabled=false; gen.textContent="Generate reply"; }
});
$("#speak").addEventListener("click",()=>{if(!lastReply)return;if(!("speechSynthesis"in window)){err.textContent="Speech is not supported by this browser.";err.hidden=false;return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lastReply);u.lang="en-US";u.rate=.96;speechSynthesis.speak(u);});
$("#stop").addEventListener("click",()=>{if("speechSynthesis"in window)speechSynthesis.cancel();});
$("#copy").addEventListener("click",async()=>{if(!lastReply)return;try{await navigator.clipboard.writeText(lastReply);$("#copy").textContent="Copied!";setTimeout(()=>$("#copy").textContent="Copy",1200);}catch{err.textContent="Clipboard unavailable; select and copy the reply manually.";err.hidden=false;}});
fetch("/api/health").then(r=>r.json()).then(d=>{$("#status").textContent=d.aiConfigured?"Server online · AI configured":"Server online · API setup needed";$("#ai-state").textContent=d.aiConfigured?"CONFIGURED":"API KEY NEEDED";}).catch(()=>{$("#status").textContent="Server status unknown";$("#ai-state").textContent="UNAVAILABLE";});
