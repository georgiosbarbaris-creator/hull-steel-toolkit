"use strict";
/* ShipDrop — offline phone-to-phone file transfer.
   WebRTC DataChannel over local Wi-Fi / hotspot. No server: the handshake is
   exchanged with two QR codes (offer → answer). Received files are streamed to
   the Origin Private File System so multi-GB files never sit in RAM. */

// ---------- i18n ----------
const T={el:{
 sub:"Αρχεία από κινητό σε κινητό — χωρίς internet, χωρίς δεδομένα",
 host:"Ξεκινάω εγώ (δείχνω QR)",hostS:"Πάτα το σε ΕΝΑ από τα δύο κινητά",
 join:"Σαρώνω QR",joinS:"Πάτα το στο ΑΛΛΟ κινητό",
 howT:"Πώς δουλεύει",
 how:"<li><b>Hotspot:</b> στο ένα κινητό άνοιξε το Hotspot (Προσωπικό σημείο πρόσβασης). Το άλλο συνδέεται στο Wi-Fi του. <i>(Ή και τα δύο στο ίδιο Wi-Fi.)</i></li><li>Άνοιξε το ShipDrop και στα δύο.</li><li>Κινητό Α: <b>«Ξεκινάω εγώ»</b> → βγαίνει QR.</li><li>Κινητό Β: <b>«Σαρώνω QR»</b> → σημάδεψε το QR του Α. Βγαίνει QR-απάντηση.</li><li>Γύρνα το Α και σημάδεψε με την κάμερά του το QR του Β → <b>Συνδέθηκε</b>.</li><li>Στείλε αρχεία από όποιο κινητό θέλεις, και προς τις δύο κατευθύνσεις.</li>",
 tipsT:"Συμβουλές",
 tips:"• Η μεταφορά γίνεται απευθείας μέσω Wi-Fi και <b>δεν</b> περνά από το internet, άρα δεν καταναλώνει δεδομένα.<br>• Για μηδενική κατανάλωση: Android hotspot με κλειστά δεδομένα, ή κοινό Wi-Fi/router χωρίς internet. Το iPhone hotspot θέλει ανοιχτά δεδομένα για να ανοίξει· τότε κλείσε στο άλλο κινητό τις αυτόματες ενημερώσεις ή βάλε «Λειτουργία χαμηλών δεδομένων».<br>• Κράτα την οθόνη ανοιχτή και την εφαρμογή μπροστά μέχρι να τελειώσει η μεταφορά.<br>• Μεγάλα αρχεία (GB): φρόντισε να υπάρχει ελεύθερος χώρος στο κινητό που λαμβάνει.",
 h1:"1. Δείξε αυτό το QR στο άλλο κινητό",h2:"2. Μετά σημάδεψε εδώ το QR-απάντηση του άλλου",
 j1:"Σημάδεψε το QR του άλλου κινητού",j2:"Δείξε αυτό το QR στο άλλο κινητό",
 manual:"Χωρίς κάμερα (αντιγραφή/επικόλληση κωδικού)",manH:"Στείλε τον κωδικό στο άλλο κινητό με όποιον τρόπο έχεις και επικόλλησε εδώ την απάντηση.",
 pasteAns:"Επικόλληση κωδικού απάντησης…",pasteOff:"Επικόλληση κωδικού…",connect:"Σύνδεση",next:"Συνέχεια",
 conn:"🟢 Συνδέθηκε",disc:"🔌 Αποσύνδεση",keepOn:"Κράτα την οθόνη ανοιχτή και την εφαρμογή μπροστά κατά τη μεταφορά.",
 pick:"Στείλε αρχεία",pickS:"Φωτογραφίες, βίντεο, PDF, οτιδήποτε — και GB",
 out:"📤 Αποστολή",in:"📥 Λήψη",saved:"📁 Ληφθέντα αρχεία",
 save:"💾 Αποθήκευση",share:"📤 Κοινοποίηση",del:"🗑",cancel:"✕ Άκυρο",
 preparing:"Ετοιμάζω τη σύνδεση…",camOff:"Η κάμερα δεν άνοιξε — χρησιμοποίησε τον κωδικό παρακάτω.",
 waitScan:"Περιμένω την απάντηση…",scanning:"Ψάχνω QR…",connecting:"Συνδέομαι…",
 showB:"Μόλις το σαρώσει, η σύνδεση γίνεται αυτόματα.",
 noNet:"⚠️ Δεν βρέθηκε δίκτυο. Σύνδεσε τα κινητά στο ίδιο Wi-Fi / hotspot και ξαναδοκίμασε.",
 failed:"❌ Η σύνδεση απέτυχε. Είναι και τα δύο κινητά στο ίδιο Wi-Fi/hotspot; Ξαναδοκίμασε.",
 slow:"Αργεί… Βεβαιώσου ότι και τα δύο είναι στο ίδιο Wi-Fi/hotspot.",
 lost:"Η σύνδεση χάθηκε.",wrongQR:"Αυτό είναι QR απάντησης — πάτα «Ξεκινάω εγώ» σε αυτό το κινητό.",
 queued:"Σε αναμονή",sending:"Αποστολή",waitRx:"Περιμένω το άλλο κινητό…",done:"✅ Ολοκληρώθηκε",
 rejected:"❌ Δεν υπάρχει χώρος στο άλλο κινητό",cancelled:"Ακυρώθηκε",receiving:"Λήψη",
 noSpace:"Δεν υπάρχει αρκετός ελεύθερος χώρος για",gotFile:"Ελήφθη:",missing:"Το αρχείο δεν βρέθηκε",
 confDel:"Διαγραφή του αρχείου από την εφαρμογή;",confDisc:"Αποσύνδεση;",memWarn:"Προσοχή: αυτός ο browser κρατά τα αρχεία στη μνήμη — πολύ μεγάλα αρχεία μπορεί να μην χωρέσουν.",
 left:"απομένουν",give:"Δώσε την εφαρμογή σε άλλον",giveH:"Ο άλλος σκανάρει αυτό το QR με την κάμερά του (θέλει λίγο internet μία φορά), ανοίγει το link και πατάει Share → Add to Home Screen. Μετά δουλεύει offline."
},en:{
 sub:"Phone-to-phone files — no internet, no mobile data",
 host:"I start (show QR)",hostS:"Tap this on ONE of the two phones",
 join:"Scan QR",joinS:"Tap this on the OTHER phone",
 howT:"How it works",
 how:"<li><b>Hotspot:</b> turn on Hotspot on one phone; the other joins its Wi-Fi. <i>(Or both on the same Wi-Fi.)</i></li><li>Open ShipDrop on both.</li><li>Phone A: <b>“I start”</b> → a QR appears.</li><li>Phone B: <b>“Scan QR”</b> → point at A's QR. An answer QR appears.</li><li>Turn phone A around and scan B's QR with A's camera → <b>Connected</b>.</li><li>Send files from either phone, both directions.</li>",
 tipsT:"Tips",
 tips:"• Transfer goes directly over Wi-Fi and does <b>not</b> go through the internet, so it uses no mobile data.<br>• For zero data use: Android hotspot with mobile data off, or a shared Wi-Fi/router without internet. iPhone hotspot needs mobile data on to start — then disable auto-updates on the other phone or set “Low Data Mode”.<br>• Keep the screen on and the app in front until the transfer ends.<br>• Big files (GB): make sure the receiving phone has free space.",
 h1:"1. Show this QR to the other phone",h2:"2. Then point here at the other phone's answer QR",
 j1:"Point at the other phone's QR",j2:"Show this QR to the other phone",
 manual:"No camera (copy/paste code)",manH:"Send the code to the other phone any way you can and paste its answer here.",
 pasteAns:"Paste answer code…",pasteOff:"Paste code…",connect:"Connect",next:"Continue",
 conn:"🟢 Connected",disc:"🔌 Disconnect",keepOn:"Keep the screen on and the app in front while transferring.",
 pick:"Send files",pickS:"Photos, videos, PDF, anything — even GB",
 out:"📤 Sending",in:"📥 Receiving",saved:"📁 Received files",
 save:"💾 Save",share:"📤 Share",del:"🗑",cancel:"✕ Cancel",
 preparing:"Preparing connection…",camOff:"Camera did not start — use the code below.",
 waitScan:"Waiting for the answer…",scanning:"Looking for QR…",connecting:"Connecting…",
 showB:"Once it is scanned, the connection is made automatically.",
 noNet:"⚠️ No network found. Put both phones on the same Wi-Fi / hotspot and try again.",
 failed:"❌ Connection failed. Are both phones on the same Wi-Fi/hotspot? Try again.",
 slow:"Taking long… Make sure both are on the same Wi-Fi/hotspot.",
 lost:"Connection lost.",wrongQR:"That is an answer QR — tap “I start” on this phone.",
 queued:"Queued",sending:"Sending",waitRx:"Waiting for the other phone…",done:"✅ Done",
 rejected:"❌ Not enough space on the other phone",cancelled:"Cancelled",receiving:"Receiving",
 noSpace:"Not enough free space for",gotFile:"Received:",missing:"File not found",
 confDel:"Delete this file from the app?",confDisc:"Disconnect?",memWarn:"Note: this browser keeps files in memory — very large files may not fit.",
 left:"left",give:"Give the app to someone",giveH:"The other person scans this QR with their camera (needs a little internet once), opens the link and taps Share → Add to Home Screen. Then it works offline."
}};
let lang=localStorage.getItem("drop_lang")||"el";
const t=k=>(T[lang]&&T[lang][k])||T.el[k]||k;
const $=s=>document.querySelector(s);
function applyLang(){document.documentElement.lang=lang;$("#langBtn").textContent=lang==="el"?"EN":"ΕΛ";
 document.querySelectorAll("[data-t]").forEach(e=>{if(e.hasAttribute("data-html"))e.innerHTML=t(e.dataset.t);else e.textContent=t(e.dataset.t);});
 document.querySelectorAll("[data-ph]").forEach(e=>e.placeholder=t(e.dataset.ph));renderAll();}
$("#langBtn").onclick=()=>{lang=lang==="el"?"en":"el";localStorage.setItem("drop_lang",lang);applyLang();};

// ---------- helpers ----------
function toast(m,ms=2600){const e=$("#toast");e.textContent=m;e.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>e.classList.remove("on"),ms);}
function fmt(b){if(b<1024)return b+" B";const u=["KB","MB","GB","TB"];let i=-1;do{b/=1024;i++}while(b>=1024&&i<3);return b.toFixed(b<10?2:b<100?1:0)+" "+u[i];}
function fmtT(s){if(!isFinite(s)||s<0)return"";s=Math.round(s);const m=Math.floor(s/60);return m?m+"′"+String(s%60).padStart(2,"0")+"″":s+"″";}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function show(id){["#sHome","#sHost","#sJoin","#sX"].forEach(s=>$(s).classList.toggle("hide",s!==id));$("#homeBtn").classList.toggle("hide",id==="#sHome");window.scrollTo(0,0);}

// ---------- compact signalling (fits in a small QR) ----------
// format: S1~o|a~setup~mid~ufrag~pwd~fingerprintB64~addr_port,addr_port
const SETUP={actpass:"x",active:"a",passive:"p"},SETUPR={x:"actpass",a:"active",p:"passive"};
function encode(sdp,type){
 const g=r=>(sdp.match(r)||[])[1];
 const fpHex=g(/a=fingerprint:sha-256 ([0-9A-Fa-f:]+)/);
 const bytes=fpHex.split(":").map(h=>parseInt(h,16));
 const fp=btoa(String.fromCharCode(...bytes));
 const cands=[];
 for(const m of sdp.matchAll(/a=candidate:(\S+) (\d) (\S+) (\d+) (\S+) (\d+) typ (\S+)/g)){
  const [,,comp,proto,,addr,port,typ]=m;
  if(comp!=="1"||proto.toLowerCase()!=="udp"||typ!=="host")continue;
  if(/^fe80/i.test(addr))continue;
  const c=addr+"_"+port;if(!cands.includes(c))cands.push(c);
 }
 return ["S1",type,SETUP[g(/a=setup:(\w+)/)]||"x",g(/a=mid:(\S+)/)||"0",g(/a=ice-ufrag:(\S+)/),g(/a=ice-pwd:(\S+)/),fp,cands.slice(0,8).join(",")].join("~");
}
function decode(code){
 const p=code.trim().split("~");if(p[0]!=="S1"||p.length<8)throw new Error("bad code");
 const [,type,su,mid,ufrag,pwd,fp,cs]=p;
 const hex=[...atob(fp)].map(c=>c.charCodeAt(0).toString(16).padStart(2,"0").toUpperCase()).join(":");
 const L=["v=0","o=- "+Date.now()+" 2 IN IP4 127.0.0.1","s=-","t=0 0","a=group:BUNDLE "+mid,"a=msid-semantic: WMS",
  "m=application 9 UDP/DTLS/SCTP webrtc-datachannel","c=IN IP4 0.0.0.0"];
 (cs?cs.split(","):[]).forEach((c,i)=>{const k=c.lastIndexOf("_");L.push("a=candidate:"+(i+1)+" 1 udp "+(2122260223-i)+" "+c.slice(0,k)+" "+c.slice(k+1)+" typ host generation 0");});
 L.push("a=end-of-candidates","a=ice-ufrag:"+ufrag,"a=ice-pwd:"+pwd,"a=ice-options:trickle","a=fingerprint:sha-256 "+hex,
  "a=setup:"+(SETUPR[su]||"actpass"),"a=mid:"+mid,"a=sctp-port:5000","a=max-message-size:262144");
 return {type:type==="o"?"offer":"answer",sdp:L.join("\r\n")+"\r\n",nCand:cs?cs.split(",").length:0};
}

// ---------- QR draw / scan ----------
function drawQR(canvas,text){
 const q=qrcode(0,"L");q.addData(text);q.make();const n=q.getModuleCount(),qz=4,sc=8,sz=(n+qz*2)*sc;
 canvas.width=canvas.height=sz;const c=canvas.getContext("2d");c.fillStyle="#fff";c.fillRect(0,0,sz,sz);c.fillStyle="#000";
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))c.fillRect((x+qz)*sc,(y+qz)*sc,sc,sc);
}
let stream=null,scanStop=null;
async function startCam(video){
 if(!stream){stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:false});}
 video.srcObject=stream;try{await video.play();}catch(_){}
}
function stopCam(){if(scanStop)scanStop();if(stream){stream.getTracks().forEach(x=>x.stop());stream=null;}document.querySelectorAll("video").forEach(v=>v.srcObject=null);}
function scan(video,onCode){
 if(scanStop)scanStop();let on=true;const cv=document.createElement("canvas"),cx=cv.getContext("2d",{willReadFrequently:true});
 scanStop=()=>{on=false;scanStop=null;};
 (function tick(){if(!on)return;
  if(video.readyState>=2&&video.videoWidth){const s=Math.min(1,720/Math.max(video.videoWidth,video.videoHeight));
   cv.width=Math.round(video.videoWidth*s);cv.height=Math.round(video.videoHeight*s);cx.drawImage(video,0,0,cv.width,cv.height);
   const r=jsQR(cx.getImageData(0,0,cv.width,cv.height).data,cv.width,cv.height,{inversionAttempts:"attemptBoth"});
   if(r&&r.data&&r.data.startsWith("S1~")){if(onCode(r.data)===false){}else return;}}
  setTimeout(tick,180);})();
}

// ---------- WebRTC ----------
let pc=null,dc=null,connected=false,slowT=null;
function newPC(){
 closePC();pc=new RTCPeerConnection({iceServers:[]});
 dc=pc.createDataChannel("f",{negotiated:true,id:0,ordered:true});dc.binaryType="arraybuffer";
 dc.bufferedAmountLowThreshold=1<<20;
 dc.onopen=onOpen;dc.onclose=onClose;dc.onmessage=onMsg;
 pc.onconnectionstatechange=()=>{if(pc&&pc.connectionState==="failed")setStatus(t("failed"),"err");};
 pc.oniceconnectionstatechange=()=>{if(pc&&pc.iceConnectionState==="failed")setStatus(t("failed"),"err");};
}
function closePC(){try{dc&&dc.close()}catch(_){}try{pc&&pc.close()}catch(_){}pc=dc=null;connected=false;clearTimeout(slowT);}
function gather(){return new Promise(res=>{if(pc.iceGatheringState==="complete")return res();
 const h=()=>{if(pc.iceGatheringState==="complete")res();};pc.addEventListener("icegatheringstatechange",h);setTimeout(res,5000);});}
let statusEl=null;function setStatus(m,c){if(!statusEl)return;statusEl.textContent=m;statusEl.className="status "+(c||"");}
function armSlow(){clearTimeout(slowT);slowT=setTimeout(()=>{if(!connected)setStatus(t("slow"),"err");},15000);}

async function startHost(){
 show("#sHost");statusEl=$("#hostSt");setStatus(t("preparing"));
 const v=$("#vidH");let cam=true;
 try{await startCam(v);}catch(e){cam=false;}
 newPC();
 await pc.setLocalDescription(await pc.createOffer());await gather();
 const code=encode(pc.localDescription.sdp,"o");
 drawQR($("#qrOffer"),code);$("#txOffer").value=code;
 if(!decode(code).nCand){setStatus(t("noNet"),"err");}
 else setStatus(cam?t("waitScan"):t("camOff"),cam?"":"err");
 if(cam)scan(v,c=>{if(c.startsWith("S1~a~")){applyAnswer(c);return true;}return false;});
}
async function applyAnswer(code){
 try{const d=decode(code);if(d.type!=="answer")throw 0;setStatus(t("connecting"));armSlow();
  if(scanStop)scanStop();await pc.setRemoteDescription({type:"answer",sdp:d.sdp});}
 catch(e){setStatus(t("failed")+" ("+(e&&e.message||e)+")","err");}
}
async function startJoin(){
 show("#sJoin");$("#joinScan").classList.remove("hide");$("#joinAns").classList.add("hide");statusEl=$("#joinSt");
 const v=$("#vidJ");
 try{await startCam(v);setStatus(t("scanning"));
  scan(v,c=>{if(c.startsWith("S1~o~")){handleOffer(c);return true;}setStatus(t("wrongQR"),"err");return false;});}
 catch(e){setStatus(t("camOff"),"err");$("#sJoin details").open=true;}
}
async function handleOffer(code){
 try{const d=decode(code);if(d.type!=="offer")throw new Error(t("wrongQR"));
  setStatus(t("preparing"));newPC();
  await pc.setRemoteDescription({type:"offer",sdp:d.sdp});
  await pc.setLocalDescription(await pc.createAnswer());await gather();
  const ans=encode(pc.localDescription.sdp,"a");
  $("#joinScan").classList.add("hide");$("#joinAns").classList.remove("hide");
  drawQR($("#qrAnswer"),ans);$("#txAnswer").value=ans;statusEl=$("#joinSt2");
  setStatus(decode(ans).nCand?t("showB"):t("noNet"),decode(ans).nCand?"":"err");armSlow();
 }catch(e){setStatus(String(e&&e.message||e),"err");}
}
function onOpen(){connected=true;clearTimeout(slowT);stopCam();show("#sX");wake();toast(t("conn"));renderAll();pumpOut();}
function onClose(){if(!connected)return;connected=false;
 if(rxCur){abortRx(rxCur);rxCur=null;}
 outQ.forEach(o=>{if(o.st==="sending"||o.st==="queued"||o.st==="wait")o.st="lost";});
 outBusy=false;renderAll();toast(t("lost"),4000);
 $("#connPill").textContent="🔴 "+t("lost");}
function disconnect(){closePC();stopCam();outQ=[];outBusy=false;inDone=[];relWake();show("#sHome");renderAll();}

// ---------- wake lock ----------
let wl=null;async function wake(){try{if("wakeLock"in navigator&&!wl){wl=await navigator.wakeLock.request("screen");wl.addEventListener("release",()=>wl=null);}}catch(_){}}
function relWake(){try{wl&&wl.release()}catch(_){}wl=null;}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&connected)wake();});

// ---------- storage (OPFS via worker) ----------
let writer=null,opfsOK=false;const closedCb={};
try{writer=new Worker("writer.js");writer.onmessage=e=>{const m=e.data;
 if(m.ok==="probe")opfsOK=true;
 else if(m.ok==="closed"&&closedCb[m.f]){closedCb[m.f]();delete closedCb[m.f];}
 else if(m.err){console.warn("writer",m);if(m.cmd!=="probe"&&rxCur&&rxCur.f===m.f){rxCur.err=m.err;}}};
 writer.postMessage({cmd:"probe"});}catch(_){}
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
const mem={};// fallback in-memory files (non-OPFS browsers)
let saved=JSON.parse(localStorage.getItem("drop_rx")||"[]");
const persist=()=>localStorage.setItem("drop_rx",JSON.stringify(saved));
async function getFile(it){
 if(mem[it.f])return mem[it.f];
 const root=await navigator.storage.getDirectory();const fh=await root.getFileHandle(it.f);const f=await fh.getFile();
 return new File([f],it.name,{type:it.mime||"application/octet-stream"});
}

// ---------- protocol ----------
// strings = JSON control; ArrayBuffers = chunks of the current incoming file
// meta → (go|reject) → chunks… → eof → ack.  stop/cancel to abort.
let outQ=[],outBusy=false,rxCur=null,inDone=[];
const waiters={};
function send(o){try{dc&&dc.readyState==="open"&&dc.send(JSON.stringify(o));}catch(_){}}
function onMsg(e){
 if(typeof e.data!=="string"){rxChunk(e.data);return;}
 let m;try{m=JSON.parse(e.data)}catch(_){return;}
 if(m.t==="meta")rxMeta(m);
 else if(m.t==="eof")rxEof(m);
 else if(m.t==="cancel"){if(rxCur&&rxCur.id===m.id){abortRx(rxCur);rxCur.st="cancelled";inDone.unshift(rxCur);rxCur=null;renderAll();}}
 else if(["go","reject","ack","stop"].includes(m.t)){const w=waiters[m.id];if(w)w(m);
  const o=outQ.find(x=>x.id===m.id);if(o){if(m.t==="ack"){o.st="done";renderAll();}else if(m.t==="stop"){o.cancel=true;}}}
}
async function rxMeta(m){
 if(rxCur){abortRx(rxCur);rxCur=null;}
 const it={id:m.id,name:m.name,size:m.size,mime:m.mime,got:0,t0:performance.now(),st:"receiving",f:"rx_"+m.id,date:Date.now()};
 // space check
 try{const e=await navigator.storage.estimate();if(e.quota&&e.quota-e.usage<m.size+20e6){send({t:"reject",id:m.id});toast(t("noSpace")+" "+m.name+" ("+fmt(m.size)+")",5000);return;}}catch(_){}
 it.useMem=!opfsOK;
 if(it.useMem){mem[it.f]=null;it.parts=[];if(m.size>300e6)toast(t("memWarn"),5000);}
 else writer.postMessage({cmd:"open",f:it.f});
 rxCur=it;renderAll();send({t:"go",id:m.id});
}
function rxChunk(buf){const it=rxCur;if(!it||it.st!=="receiving")return;
 it.got+=buf.byteLength;
 if(it.useMem)it.parts.push(buf);else writer.postMessage({cmd:"write",f:it.f,buf},[buf]);
 tickUI();}
function rxEof(m){const it=rxCur;if(!it||it.id!==m.id)return;rxCur=null;
 const fin=()=>{if(it.err){it.st="err";inDone.unshift(it);renderAll();return;}
  it.st="done";it.t1=performance.now();inDone.unshift(it);
  saved.unshift({f:it.f,name:it.name,size:it.size,mime:it.mime,date:it.date});persist();
  send({t:"ack",id:it.id});toast(t("gotFile")+" "+it.name);renderAll();};
 if(it.useMem){mem[it.f]=new File(it.parts,it.name,{type:it.mime||"application/octet-stream"});it.parts=null;fin();}
 else{closedCb[it.f]=fin;writer.postMessage({cmd:"close",f:it.f});}
}
function abortRx(it){if(it.useMem){delete mem[it.f];it.parts=null;}else writer&&writer.postMessage({cmd:"abort",f:it.f});}
function stopRx(){if(!rxCur)return;send({t:"stop",id:rxCur.id});abortRx(rxCur);rxCur.st="cancelled";inDone.unshift(rxCur);rxCur=null;renderAll();}

function addFiles(files){for(const f of files)outQ.push({id:uid(),file:f,name:f.name||"file",size:f.size,sent:0,st:"queued"});renderAll();pumpOut();}
async function pumpOut(){
 if(outBusy||!connected)return;const it=outQ.find(o=>o.st==="queued");if(!it)return;
 outBusy=true;try{await sendOne(it);}catch(e){it.st="err";it.msg=String(e&&e.message||e);}
 outBusy=false;renderAll();pumpOut();
}
async function sendOne(it){
 it.st="wait";renderAll();
 const reply=await new Promise(r=>{waiters[it.id]=r;send({t:"meta",id:it.id,name:it.name,size:it.size,mime:it.file.type||""});});
 delete waiters[it.id];
 if(reply.t==="reject"){it.st="rejected";return;}
 if(reply.t==="stop"||it.cancel){it.st="cancelled";return;}
 it.st="sending";it.t0=performance.now();renderAll();
 const max=(pc&&pc.sctp&&pc.sctp.maxMessageSize)||65536;
 const CH=Math.max(16384,Math.min(65536,max)),BLOCK=4<<20,HIGH=8<<20;
 let off=0;
 while(off<it.size){
  if(it.cancel||!connected){if(connected)send({t:"cancel",id:it.id});it.st=connected?"cancelled":"lost";return;}
  const block=await it.file.slice(off,Math.min(it.size,off+BLOCK)).arrayBuffer();
  for(let p=0;p<block.byteLength;p+=CH){
   while(dc&&dc.bufferedAmount>HIGH){await new Promise(r=>{const to=setTimeout(r,40);dc.onbufferedamountlow=()=>{clearTimeout(to);dc.onbufferedamountlow=null;r();};});}
   if(!dc||dc.readyState!=="open"){it.st="lost";return;}
   dc.send(block.slice(p,Math.min(p+CH,block.byteLength)));
  }
  off+=block.byteLength;it.sent=off;tickUI();
 }
 // wait until buffered data has left before announcing eof
 send({t:"eof",id:it.id});it.st="acking";it.sent=it.size;renderAll();
 await new Promise(r=>{waiters[it.id]=m=>{if(m.t==="ack"||m.t==="stop")r();};});
 delete waiters[it.id];if(it.st!=="cancelled")it.st="done";it.t1=performance.now();
}

// ---------- UI rendering ----------
let uiT=0;function tickUI(){const n=performance.now();if(n-uiT>250){uiT=n;renderAll();}}
function prog(done,total,t0,label){
 const pct=total?Math.min(100,done/total*100):100;const sec=(performance.now()-(t0||performance.now()))/1000;const sp=sec>0.3?done/sec:0;
 const eta=sp?(total-done)/sp:NaN;
 return `<div class="bar"><i style="width:${pct.toFixed(1)}%"></i></div><div class="muted">${label} · ${fmt(done)} / ${fmt(total)} · ${pct.toFixed(0)}%${sp?" · "+fmt(sp)+"/s":""}${isFinite(eta)&&eta>1?" · "+fmtT(eta)+" "+t("left"):""}</div>`;
}
function stLabel(s){return{queued:t("queued"),wait:t("waitRx"),acking:t("waitRx"),sending:t("sending"),done:t("done"),rejected:t("rejected"),cancelled:t("cancelled"),lost:t("lost"),err:"❌"}[s]||s;}
function renderAll(){
 // outgoing
 $("#outCard").classList.toggle("hide",!outQ.length);
 $("#outList").innerHTML=outQ.map(o=>{const active=["queued","wait","sending","acking"].includes(o.st);
  const sp=o.st==="done"&&o.t1&&o.t0?" · "+fmt(o.size/((o.t1-o.t0)/1000))+"/s":"";
  return `<div class="item ${o.st==="done"?"done":""}"><div class="row"><span class="nm grow">${esc(o.name)}</span>${active?`<button class="btn d" data-oc="${o.id}">${t("cancel")}</button>`:""}</div>
  ${o.st==="sending"||o.st==="acking"?prog(o.sent,o.size,o.t0,stLabel(o.st)):o.st==="done"?`<div class="bar"><i style="width:100%"></i></div><div class="muted">${t("done")} · ${fmt(o.size)}${sp}</div>`:`<div class="muted">${stLabel(o.st)} · ${fmt(o.size)}${o.msg?" · "+esc(o.msg):""}</div>`}</div>`;}).join("");
 // incoming
 const ins=(rxCur?[rxCur]:[]).concat(inDone.filter(x=>x.st!=="done"));
 $("#inCard").classList.toggle("hide",!ins.length);
 $("#inList").innerHTML=ins.map(i=>`<div class="item"><div class="row"><span class="nm grow">${esc(i.name)}</span>${i===rxCur?`<button class="btn d" id="bStopRx">${t("cancel")}</button>`:""}</div>
  ${i===rxCur?prog(i.got,i.size,i.t0,t("receiving")):`<div class="muted">${stLabel(i.st)}${i.err?" · "+esc(i.err):""}</div>`}</div>`).join("");
 // saved
 const html=saved.map(s=>`<div class="item done"><div class="nm">${esc(s.name)}</div><div class="muted">${fmt(s.size)} · ${new Date(s.date).toLocaleString(lang==="el"?"el-GR":"en-GB",{dateStyle:"short",timeStyle:"short"})}</div>
  <div class="row" style="margin-top:6px"><button class="btn p" data-sv="${s.f}">${t("save")}</button>${navigator.share?`<button class="btn" data-sh="${s.f}">${t("share")}</button>`:""}<span class="grow"></span><button class="btn d" data-dl="${s.f}">${t("del")}</button></div></div>`).join("");
 $("#rxList").innerHTML=html;$("#rxHome").innerHTML=html;
 $("#rxCard").classList.toggle("hide",!saved.length);$("#rxHomeCard").classList.toggle("hide",!saved.length);
}
document.addEventListener("click",async e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.dataset.oc){const o=outQ.find(x=>x.id===b.dataset.oc);if(o){o.cancel=true;if(o.st==="queued")o.st="cancelled";const w=waiters[o.id];if(o.st==="wait"&&w){send({t:"cancel",id:o.id});w({t:"stop"});}renderAll();}}
 else if(b.id==="bStopRx")stopRx();
 else if(b.dataset.sv||b.dataset.sh){const it=saved.find(s=>s.f===(b.dataset.sv||b.dataset.sh));if(!it)return;
  let f;try{f=await getFile(it);}catch(_){toast(t("missing"));return;}
  if(b.dataset.sh){try{if(navigator.canShare&&!navigator.canShare({files:[f]}))throw 0;await navigator.share({files:[f]});}catch(err){if(err&&err.name==="AbortError")return;dl(f);}}
  else dl(f);}
 else if(b.dataset.dl){if(!confirm(t("confDel")))return;const it=saved.find(s=>s.f===b.dataset.dl);
  saved=saved.filter(s=>s!==it);persist();delete mem[it.f];
  try{const root=await navigator.storage.getDirectory();await root.removeEntry(it.f);}catch(_){}renderAll();}
});
function dl(f){const u=URL.createObjectURL(f);const a=document.createElement("a");a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}

// ---------- wiring ----------
$("#bHost").onclick=()=>startHost().catch(e=>{statusEl=$("#hostSt");setStatus(String(e&&e.message||e),"err");});
$("#bJoin").onclick=()=>startJoin();
$("#bGive").onclick=()=>{const c=$("#giveCard");c.classList.toggle("hide");if(!c.classList.contains("hide")){const u=new URL("./",location.href).href;drawQR($("#qrApp"),u);$("#appUrl").textContent=u;c.scrollIntoView({behavior:"smooth"});}};
$("#homeBtn").onclick=()=>{if(connected&&!confirm(t("confDisc")))return;disconnect();};
$("#bDisc").onclick=()=>{if(!confirm(t("confDisc")))return;disconnect();};
$("#bApplyAns").onclick=()=>applyAnswer($("#inAnswer").value);
$("#bApplyOff").onclick=()=>{if(scanStop)scanStop();handleOffer($("#inOffer").value);};
$("#bPick").onclick=()=>$("#fileIn").click();
$("#fileIn").onchange=e=>{addFiles([...e.target.files]);e.target.value="";};
window.addEventListener("beforeunload",e=>{if(connected&&(outBusy||rxCur)){e.preventDefault();e.returnValue="";}});
// clean OPFS leftovers not in the saved list
(async()=>{try{const root=await navigator.storage.getDirectory();const keep=new Set(saved.map(s=>s.f));
 for await(const [name] of root.entries()){if(name.startsWith("rx_")&&!keep.has(name)&&!(rxCur&&rxCur.f===name))await root.removeEntry(name).catch(()=>{});}}catch(_){}})();
// drop entries whose file vanished
(async()=>{if(!saved.length)return;try{const root=await navigator.storage.getDirectory();const ok=[];for(const s of saved){try{await root.getFileHandle(s.f);ok.push(s);}catch(_){}}if(ok.length!==saved.length){saved=ok;persist();renderAll();}}catch(_){}})();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
applyLang();
