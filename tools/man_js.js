/* ---------- 📘 Manuals (shared by RISQ and RISQ Crew; inserted by the build scripts) ---------- */
const MAN=/*MAN*/;
function manPack(){try{const j=JSON.parse(localStorage.getItem(PACKK)||"null");return j&&j.kind==="risq-shippack"?j:null;}catch(e){return null;}}
const mGr={A:"#c0392b",B:"#c88a12",C:"#5b8f6f"};
const mBadge=g=>`<span class="mg" style="background:${mGr[g]}">${g}</span>`;
function mPFN(k,st,en){const v=st&&st[k]||"";return `<span class="pfn" data-mk="${k}">${[["p","P"],["f","F"],["n","N/A"]].map(([x,l])=>`<button class="${v===x?"on "+x:""}" data-v="${x}" ${en?"":"disabled"}>${l}</button>`).join("")}</span>`;}
function mYN(k,st,en){const v=st&&st[k]||"";return `<span class="pfn" data-mk="${k}">${[["y","YES"],["f","NO"],["u","?"]].map(([x,l])=>`<button class="${v===x?"on "+(x==="y"?"p":x):""}" data-v="${x}" ${en?"":"disabled"}>${l}</button>`).join("")}</span>`;}
const mDet=(sum,body)=>`<details class="card mdet"><summary>${sum}</summary><div style="margin-top:8px">${body}</div></details>`;
const mQ=(qs,ins)=>ins&&qs&&qs.length?`<div class="row" style="margin-top:6px">${qs.filter(q=>QM[q]).map(q=>`<button class="pgo" data-goq="${q}">→ ${q}</button>`).join("")}</div>`:"";
function MANR(pg,ins){if(pg==="trn")return TRR(ins);const P=manPack();let h="";
 if(pg==="man"){
  h=`<div class="card"><h2 style="margin-top:0">📘 ${esc(MAN.fm.t)}</h2><p class="note">${esc(MAN.fm.v)}</p><p>${ML.fmX}</p><button class="btn p" data-open="fm">${ML.open}</button></div>
   <div class="card"><h2 style="margin-top:0">🇨🇦 ${esc(MAN.ca.t)}</h2><p class="note">${esc(MAN.ca.v)}</p><p>${ML.caX}</p><button class="btn p" data-open="ca">${ML.open}</button></div>
   <div class="card"><h2 style="margin-top:0">🎓 Training & Familiarization</h2><p>${ML.trX}</p><button class="btn p" data-open="trn">${ML.open}</button></div>
   <div class="card"><h2 style="margin-top:0">🔒 ${ML.packT}</h2><p class="note">${ML.packX}</p>${P?`<p>✅ <b>${esc(P.ship)}</b> · ${Object.keys(P.n||{}).length} ◆ · ${esc(P.made||"")}</p>`:`<p class="note">${ML.packNo}</p>`}
   <div class="row"><label class="btn p">📥 ${ML.packIn}<input type="file" id="packIn" accept=".json,application/json" style="display:none"></label>${P?`<button class="btn d" id="packDel">${ML.del}</button>`:""}</div></div>
   ${ins?"":`<p class="note">${ML.openIns}</p>`}`;}
 else if(pg==="fm"){const F=MAN.fm,st=ins?(ins.mf=ins.mf||{}):null;let np=0,nf=0,nn=0,tot=0;
  F.ch.forEach(c=>c.i.forEach((x,j)=>{tot++;const v=st&&st[c.k+"_"+j];if(v==="p")np++;else if(v==="f")nf++;else if(v==="n")nn++;}));
  h=`<div class="card" style="margin-top:0"><h2 style="margin-top:0">${esc(F.t)}</h2><p class="note">${esc(F.v)}</p><div class="flt">⚠ ${esc(LG(F.note))}</div><p class="note">${esc(F.grade)}</p>
   ${ins?`<div class="tiles" style="grid-template-columns:repeat(4,1fr)"><div class="tile"><b style="color:#5b8f6f">${np}</b><span class="note">PASS</span></div><div class="tile"><b style="color:#c0392b">${nf}</b><span class="note">FAIL</span></div><div class="tile"><b>${nn}</b><span class="note">N/A</span></div><div class="tile"><b>${tot-np-nf-nn}</b><span class="note">${ML.open2}</span></div></div>
   <div class="row" style="margin-top:8px"><button class="btn" id="fmSh">📤 ${ML.shFail}</button></div>`:`<p class="note">${ML.openIns}</p>`}</div>
   <div class="card"><b>${esc(F.rule)}</b></div>`+
   mDet("🔟 "+ML.dec,`<ol>${F.dec.map(d=>`<li><b>${esc(d[0])}</b> — ${esc(d[1])}</li>`).join("")}</ol>`)+
   mDet("📅 "+ML.camp,F.camp.map(c=>`<p><b>${esc(c[0])}</b><br>${esc(c[1])}</p>`).join("")+`<div class="flt">${esc(F.m2s)}</div>`)+
   mDet("🪜 "+ML.ladder,F.ladder.map(l=>`<p><b>${esc(l[0])}</b> — ${esc(l[1])}<br><span class="note">${esc(l[2])}</span></p>`).join(""))+
   mDet("🗂 "+ML.ev,`<ul>${F.ev.map(e=>`<li>${esc(e)}</li>`).join("")}</ul><div class="flt">${esc(F.ext)}</div>`)+
   F.ch.map(c=>{const n=c.i.length,d=st?c.i.filter((x,j)=>st[c.k+"_"+j]).length:0,ff=st?c.i.filter((x,j)=>st[c.k+"_"+j]==="f").length:0;
    return mDet(`${c.k} · ${esc(LG([c.t,c.tf]))} <span class="note">${st?d+"/"+n:n}${ff?` · <b style="color:#c0392b">${ff} F</b>`:""}</span>`,
     `<div class="stopb">⛔ STOP / ESCALATE: ${esc(c.stop)}</div>`+
     c.i.map((x,j)=>`<div class="mi">${mBadge(x[0])}<div style="flex:1"><div>${esc(x[1])}</div><div class="note">✔ ${esc(x[2])}</div></div>${mPFN(c.k+"_"+j,st,!!st)}</div>`).join("")+
     `<div class="lk" style="margin-top:8px"><b>${ML.how}</b></div><ul>${c.how.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`+mQ(c.q,ins));}).join("")+
   mDet("🚦 "+ML.tree,F.tree.map((t,i)=>`<p><b>${i+1}.</b> ${esc(t[0])}<br><span class="note">${esc(t[1])}</span></p>`).join(""))+
   mDet("📂 "+ML.cases,F.cases.map(c=>`<p><b>${esc(c[0])}</b><br>${esc(c[1])}<br><span class="note">${esc(c[2])}</span></p>`).join(""))+
   mDet("🧭 "+ML.itin,F.itin.map(c=>`<p><b>${esc(c[0])}</b> · ${esc(c[1])}<br><span class="note">${esc(c[2])}</span></p>`).join(""))+
   mDet("🛑 "+ML.nogo,`<p class="note">${ML.nogoX}</p>`+F.nogo.map((q,i)=>`<div class="mi"><div style="flex:1"><b>${i+1}.</b> ${esc(q)}</div>${mYN("ng_"+i,st,!!st)}</div>`).join(""))+
   `<div class="card"><b>${esc(F.ethic)}</b></div>`+
   mDet("📚 "+ML.src,`<div class="psrc">${F.src.map(s=>`<p><b>${s[0]}</b> <a href="${s[2]}" target="_blank" rel="noopener">${esc(s[1])}</a></p>`).join("")}</div>`);}
 else if(pg==="ca"){const C=MAN.ca,st=ins?(ins.mc=ins.mc||{}):null;let tot=0,dn=0;C.sec.forEach(s=>s.i.forEach(x=>{tot++;if(st&&st[x[0]])dn++;}));
  h=`<div class="card" style="margin-top:0"><h2 style="margin-top:0">${esc(C.t)}</h2><p class="note">${esc(C.v)}</p><div class="flt">${esc(LG(C.rule))}</div><p class="note">${esc(C.flags)}</p>
   <div class="row"><button class="btn" data-open="psc" data-reg="canada">🛂 ${ML.caRules}</button></div>
   ${ins?`<p style="margin:8px 0 0"><b>${dn}/${tot}</b> ✔ <button class="btn" id="caSh" style="margin-left:6px">📤 ${ML.shOpen}</button></p>`:`<p class="note">${ML.openIns}</p>`}</div>`+
   (P?`<div class="card" style="border-left:4px solid var(--acc)"><b>◆ ${esc(P.ship)}</b><p class="note" style="margin:4px 0 0">${esc(P.hdr||"")}</p></div>`:"")+
   mDet("🔁 "+ML.rounds,C.rounds.map(r=>`<p><b>${esc(r[0])}</b> · ${esc(r[1])} · ${esc(r[2])}<br><span class="note">${esc(r[3])}</span></p>`).join(""))+
   mDet("📋 "+ML.pre,C.pre.concat(P&&P.pre||[]).map((r,i)=>`<label class="chk pchk"><input type="checkbox" data-mc="pre_${i}" ${st&&st["pre_"+i]?"checked":""} ${st?"":"disabled"}><span style="flex:1"><b>${esc(r[0])}</b> · ${esc(r[1])}</span></label>`).join(""))+
   C.sec.map(s=>{const d=st?s.i.filter(x=>st[x[0]]).length:0;
    return mDet(`${s.k} · ${esc(LG(s.t))} <span class="note">${st?d+"/"+s.i.length:s.i.length}</span>`,
     `<p class="note" style="margin-top:0">Lead: ${esc(s.lead)}</p>${s.why[0]?`<div class="flt">${esc(LG(s.why))}</div>`:""}`+
     s.i.map(x=>{const pn=P&&P.n&&P.n[x[0]];return `<label class="chk pchk"><input type="checkbox" data-mc="${x[0]}" ${st&&st[x[0]]?"checked":""} ${st?"":"disabled"}><span style="flex:1"><b>${x[0]}</b> ${x[1]?`<span class="mfl">${esc(x[1])}</span> `:""}<b>${esc(LG([x[2],x[6]]))}</b> — ${esc(LG([x[3],x[7]]))} <span class="note">· ${esc(x[4])}</span>${pn?`<span class="pk">◆ ${esc(pn)}</span>`:""}</span>${ins&&QM[x[5]]?`<button class="pgo" data-goq="${x[5]}">→</button>`:""}</label>`;}).join(""));}).join("")+
   mDet("🔥 "+ML.drills,C.drills.map((d,i)=>`<label class="chk pchk"><input type="checkbox" data-mc="dr_${i}" ${st&&st["dr_"+i]?"checked":""} ${st?"":"disabled"}><span style="flex:1"><b>${esc(LG([d[0],d[3]]))}</b> — ${esc(LG([d[1],d[4]]))}<br><span class="note">${esc(d[2])}</span></span></label>`).join(""))+
   mDet("⭐ "+ML.golden,`<ol>${C.golden.map(g=>`<li>${esc(LG(g))}</li>`).join("")}</ol>`)+
   mDet("📚 "+ML.src,`<div class="psrc">${C.src.map(s=>`<p><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a></p>`).join("")}</div>`);}
 return h;}
function MANB(pg,ins,box){if(pg==="trn"){TRB(ins,box);return;}
 box.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{if(b.dataset.reg){if(ins){ins.pr=b.dataset.reg;save();}try{localStorage.setItem(PSCK,b.dataset.reg);}catch(e){}}openPage(b.dataset.open,pageFrom);window.scrollTo(0,0);});
 box.querySelectorAll(".pfn button").forEach(b=>b.onclick=e=>{e.preventDefault();if(!ins)return;const k=b.parentNode.dataset.mk,st=ins.mf=ins.mf||{};st[k]=st[k]===b.dataset.v?"":b.dataset.v;save();
  const op=[...box.querySelectorAll("details")].map(d=>d.open),y=window.scrollY;rPage();[...$("#pg").querySelectorAll("details")].forEach((d,i)=>d.open=!!op[i]);window.scrollTo(0,y);});
 box.querySelectorAll("[data-mc]").forEach(c=>c.onchange=()=>{const st=ins.mc=ins.mc||{};st[c.dataset.mc]=c.checked;save();const dt=c.closest("details"),sp=dt&&dt.querySelector("summary .note");if(sp&&/^\d+\/\d+/.test(sp.textContent)){const all=dt.querySelectorAll("input[data-mc]"),n=[...all].filter(x=>x.checked).length;sp.textContent=n+"/"+all.length;}});
 box.querySelectorAll("[data-goq]").forEach(b=>b.onclick=e=>{e.preventDefault();const q=QM[b.dataset.goq];area=q.a;aflt="all";go("area");setTimeout(()=>{const x=$(`#qs [data-id="${q.id}"]`);if(x)x.scrollIntoView({block:"center"});},60);});
 const fi=$("#packIn");if(fi)fi.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(j.kind!=="risq-shippack")throw 0;localStorage.setItem(PACKK,JSON.stringify(j));toast("✔ "+(j.ship||""));rPage();}catch(x){toast(ML.bad);}};
 const pd=$("#packDel");if(pd)pd.onclick=()=>{localStorage.removeItem(PACKK);rPage();};
 const fs=$("#fmSh");if(fs)fs.onclick=()=>{const st=ins.mf||{},o=[];
  MAN.fm.ch.forEach(c=>c.i.forEach((x,j)=>{if(st[c.k+"_"+j]==="f")o.push(`☐ [${c.k} · ${x[0]}] ${x[1]}\n   Evidence needed: ${x[2]}`);}));
  MAN.fm.nogo.forEach((q,i)=>{const v=st["ng_"+i];if(v==="f"||v==="u")o.push(`⛔ NO-GO ${i+1}: ${q} → ${v==="f"?"NO":"UNKNOWN"}`);});
  shareText("PSC Field Manual – open items",`PSC FIELD MANUAL – FAIL / NO-GO ITEMS\n${ins.vessel||""}\n\n`+(o.join("\n")||"No FAIL recorded."));};
 const cs=$("#caSh");if(cs)cs.onclick=()=>{const st=ins.mc||{},P=manPack(),o=[];
  MAN.ca.sec.forEach(s=>{const op=s.i.filter(x=>!st[x[0]]);if(op.length)o.push(s.k+" · "+LG(s.t).toUpperCase()+"\n"+op.map(x=>`☐ ${x[0]} ${x[1]?"["+x[1]+"] ":""}${LG([x[2],x[6]])} — ${LG([x[3],x[7]])} (${x[4]})${P&&P.n&&P.n[x[0]]?"\n   ◆ "+P.n[x[0]]:""}`).join("\n"));});
  shareText("Zero Deficiency Canada – open items","ZERO DEFICIENCY CANADA – OPEN ITEMS\n"+(ins.vessel||"")+"\n\n"+(o.join("\n\n")||"All ticked ✔"));};
}

/* ---------- 🎓 Training & Familiarization checklist (MAN.tr) ---------- */
let trF="all";
const trSecQ=sec=>DATA.q.find(q=>q.s===sec)||DATA.q.find(q=>q.s.startsWith(sec)&&/^\d+$/.test(sec));
function trRef(r,ins){if(r.includes(".")&&QM[r])return ins?`<button class="pgo" style="margin-left:0" data-goq="${r}">→ ${r}</button>`:`<span class="note"><b>${r}</b></span>`;
 const q=trSecQ(r);return q&&ins?`<button class="pgo" style="margin-left:0" data-gos="${r}">§${r}</button>`:`<span class="note">§${r}${q?"":" (N/A bulk)"}</span>`;}
function trPFN(k,st,en){const v=st&&st[k]||"";return `<span class="pfn tpfn" data-tk="${k}">${[["p","✓"],["f","✗"],["n","N/A"]].map(([x,l])=>`<button class="${v===x?"on "+x:""}" data-v="${x}" ${en?"":"disabled"}>${l}</button>`).join("")}</span>`;}
function trCnt(ins){const st=ins&&ins.tt||{},all=[...MAN.tr.a,...MAN.tr.b];let p=0,f=0,n=0;all.forEach(x=>{const v=st[x[0]];if(v==="p")p++;else if(v==="f")f++;else if(v==="n")n++;});return {p,f,n,o:all.length-p-f-n,t:all.length};}
function TRR(ins){const T=MAN.tr,st=ins?(ins.tt=ins.tt||{}):null,rm=ins?(ins.tm=ins.tm||{}):null,fv=ins?(ins.tv=ins.tv||{}):null,c=trCnt(ins);
 const show=x=>{const v=st&&st[x[0]]||"";return trF==="all"||(trF==="open"&&!v)||(trF==="f"&&v==="f");};
 const item=x=>`<div class="mi"><span class="mg" style="background:var(--navy,#1d3a5c)">${x[0]}</span><div style="flex:1;min-width:0"><b>${esc(x[1])}</b><div class="note">👥 ${esc(x[2])} · 📄 ${esc(x[3])}</div>
   <div class="row" style="margin-top:4px;gap:4px">${x[4].map(r=>trRef(r,ins)).join("")}</div>${ins?`<input class="trm" data-tm="${x[0]}" value="${esc(rm[x[0]]||"")}" placeholder="${ML.trRem}" style="margin-top:6px;width:100%">`:""}</div>${trPFN(x[0],st,!!ins)}</div>`;
 const sec=(h,l)=>{const v=l.filter(show);return v.length?`<div class="card"><h2 style="margin-top:0">${h}</h2>${v.map(item).join("")}</div>`:"";};
 return `<div class="card" style="margin-top:0"><h2 style="margin-top:0">🎓 ${esc(T.t)}</h2><p class="note">${esc(T.v)}</p><p>${ML.trX}</p>
   ${ins?`<p class="note" style="margin:0">Vessel: <b>${esc(ins.vessel||"")}</b> · IMO: ${esc(ins.imo||"-")} · ${esc(ins.date||"")}</p><label style="margin-top:6px">${ML.trBy}<input id="trBy" value="${esc(ins.tvb||ins.by||"")}"></label>
   <div class="tiles" style="grid-template-columns:repeat(4,1fr);margin-top:8px"><div class="tile"><b style="color:#5b8f6f" id="trP">${c.p}</b><span class="note">✓ Done</span></div><div class="tile"><b style="color:#c0392b" id="trFn">${c.f}</b><span class="note">✗ ${ML.trMiss}</span></div><div class="tile"><b id="trN">${c.n}</b><span class="note">N/A</span></div><div class="tile"><b id="trO">${c.o}</b><span class="note">${ML.open2}</span></div></div>`:`<p class="note">${ML.openIns}</p>`}</div>
  <div class="pscr">${[["all",ML.trAll],["open",ML.open2],["f","✗ "+ML.trMiss]].map(([k,l])=>`<button class="pchip${trF===k?" on":""}" data-trf="${k}">${l}</button>`).join("")}</div>
  <div class="row" style="margin-bottom:6px"><button class="btn p" id="trShM">📤 ${ML.trShM}</button><button class="btn" id="trShA">📤 ${ML.trShA}</button></div>
  ${sec("A. Company training / certification list (34)",T.a)}${sec("B. Additional RISQ familiarization / competence checks",T.b)}
  <div class="card"><h2 style="margin-top:0">C. Final verification</h2>${T.c.map((x,i)=>`<label class="chk pchk"><input type="checkbox" data-tv="${i}" ${fv&&fv[i]?"checked":""} ${ins?"":"disabled"}><span style="flex:1">${esc(x)}</span></label>`).join("")}</div>
  <div class="card note">${esc(T.note)}</div>`;}
function trTxt(ins,onlyOpen){const T=MAN.tr,st=ins&&ins.tt||{},rm=ins&&ins.tm||{},L2={p:"DONE",f:"MISSING",n:"N/A"},o=[];
 [["A. COMPANY TRAINING / CERTIFICATION LIST",T.a],["B. ADDITIONAL RISQ FAMILIARIZATION / COMPETENCE CHECKS",T.b]].forEach(([h,l])=>{const v=l.filter(x=>!onlyOpen||st[x[0]]!=="p"&&st[x[0]]!=="n");
  if(v.length)o.push(h+"\n"+v.map(x=>`${st[x[0]]==="p"?"☑":st[x[0]]==="f"?"✗":st[x[0]]==="n"?"–":"☐"} ${x[0]}. ${x[1]} — ${x[2]} — ${x[3]} — RISQ ${x[4].join(" / ")}${st[x[0]]?" ["+L2[st[x[0]]]+"]":""}${rm[x[0]]?"\n   Remarks: "+rm[x[0]]:""}`).join("\n"));});
 const c=trCnt(ins);return `RIGHTSHIP TRAINING & FAMILIARIZATION – ${onlyOpen?"MISSING / OPEN ITEMS":"MASTER CHECKLIST"}\n${T.v}\nVessel: ${ins&&ins.vessel||"________"}  IMO: ${ins&&ins.imo||"______"}  Date: ${ins&&ins.date||"______"}  Verified by: ${ins&&(ins.tvb||ins.by)||"______"}\nDone ${c.p} · Missing ${c.f} · N/A ${c.n} · Open ${c.o} / ${c.t}\n\n`+(o.join("\n\n")||"All items done ✔")+
  (onlyOpen?"":"\n\nC. FINAL VERIFICATION\n"+T.c.map((x,i)=>`${ins&&ins.tv&&ins.tv[i]?"☑":"☐"} ${x}`).join("\n"))+"\n\n"+T.note;}
function TRB(ins,box){
 box.querySelectorAll("[data-trf]").forEach(b=>b.onclick=()=>{trF=b.dataset.trf;rPage();});
 box.querySelectorAll(".tpfn button").forEach(b=>b.onclick=e=>{e.preventDefault();if(!ins)return;const sp=b.parentNode,k=sp.dataset.tk,st=ins.tt=ins.tt||{};st[k]=st[k]===b.dataset.v?"":b.dataset.v;save();
  sp.querySelectorAll("button").forEach(x=>x.className=st[k]===x.dataset.v?"on "+x.dataset.v:"");const c=trCnt(ins);[["trP","p"],["trFn","f"],["trN","n"],["trO","o"]].forEach(([i,f])=>{const e2=document.getElementById(i);if(e2)e2.textContent=c[f];});});
 box.querySelectorAll("[data-tm]").forEach(i=>i.onchange=()=>{ins.tm[i.dataset.tm]=i.value.trim();save();});
 box.querySelectorAll("[data-tv]").forEach(c=>c.onchange=()=>{ins.tv[c.dataset.tv]=c.checked;save();});
 const by=$("#trBy");if(by)by.onchange=()=>{ins.tvb=by.value.trim();save();};
 box.querySelectorAll("[data-gos]").forEach(b=>b.onclick=e=>{e.preventDefault();const q=trSecQ(b.dataset.gos);if(!q)return;area=q.a;aflt="all";go("area");setTimeout(()=>{const x=$(`#qs [data-id="${q.id}"]`);if(x)x.scrollIntoView({block:"start"});},60);});
 box.querySelectorAll("[data-goq]").forEach(b=>b.onclick=e=>{e.preventDefault();const q=QM[b.dataset.goq];area=q.a;aflt="all";go("area");setTimeout(()=>{const x=$(`#qs [data-id="${q.id}"]`);if(x)x.scrollIntoView({block:"center"});},60);});
 const m=$("#trShM");if(m)m.onclick=()=>shareText("RightShip training – missing/open",trTxt(ins,true));
 const a=$("#trShA");if(a)a.onclick=()=>shareText("RightShip training checklist",trTxt(ins,false));}
