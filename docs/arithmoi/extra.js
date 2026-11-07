// ===== Αριθμολογία Πυθαγόρα · επέκταση από το «Πλήρης Οδηγός Αριθμολογίας» =====
// Χρησιμοποιεί: BOOK (book.js), compute, red, single, N, letters, cm, people, store, $, esc, today, show
const BK=(path,d="")=>{try{const v=path.split(".").reduce((o,k)=>o==null?o:o[k],BOOK);return v==null||v===""?d:v}catch(e){return d}};
const arr=x=>Array.isArray(x)?x:(x?[x]:[]);
const para=t=>t?`<p style="margin:4px 0 8px">${esc(t)}</p>`:"";
const nmS=n=>(N[n]?N[n].a:"").replace(/^Ο /,"").replace(/ · .*/,"");

// ---------- 4 ΜΕΘΟΔΟΙ ΠΡΟΣΘΕΣΗΣ ----------
function methods(bd){
 const [Y,M,D]=bd.split("-").map(Number);
 const tr=n=>{const t=[];red(n,true,t);return t};
 const fmt=t=>t.join("→");
 const out=[];
 // 1: όλα τα ψηφία
 const dig=(String(M)+String(D)+String(Y)).split("").map(Number);const s1=dig.reduce((a,b)=>a+b,0);
 out.push({t:"1η · Όλα τα ψηφία μαζί",c:`${dig.join("+")} = ${fmt(tr(s1))}`,r:red(s1),tr:tr(s1)});
 // 2: πρώτα αναγωγή μετά πρόσθεση
 const m=red(M),d=red(D),y=red(Y);const s2=m+d+y;
 out.push({t:"2η · Πρώτα αναγωγή, μετά πρόσθεση",c:`${M}→${m} · ${D}→${d} · ${Y}→${y} ⇒ ${m}+${d}+${y} = ${fmt(tr(s2))}`,r:red(s2),tr:[...tr(D),...tr(s2)]});
 // 3: κατακόρυφη
 const s3=M+D+Y;
 out.push({t:"3η · Κατακόρυφη πρόσθεση",c:`${String(M).padStart(4," ")}\n+${String(D).padStart(4," ")}\n+${Y}\n= ${fmt(tr(s3))}`,r:red(s3),tr:tr(s3)});
 // 4: διψήφια (έτος και ημέρα ανηγμένα, μήνας όπως είναι)
 const y4=single(Y),d4=single(D),s4=y4+d4+M;
 out.push({t:"4η · Πρόσθεση διψήφιων",c:`έτος ${Y}→${y4} · ημέρα ${D}→${d4} · μήνας ${M} ⇒ ${y4}+${d4}+${M} = ${s4}${s4>9?"/"+single(s4):""}`,r:red(s4),tr:tr(s4)});
 return out;
}
function methodsHTML(bd,lp){
 const ms=methods(bd);const bk=arr(BK("core.methods",[]));
 const fin=ms.slice(0,3).map(x=>x.r);const mc={};fin.filter(n=>n>9).forEach(n=>mc[n]=(mc[n]||0)+1);
 const masters=Object.keys(mc).filter(k=>mc[k]>=2).map(Number);
 const debts=[...new Set(ms.flatMap(x=>x.tr).filter(n=>[13,14,16,19].includes(n)))];
 let h=`<details><summary>🔍 Οι 4 μέθοδοι πρόσθεσης (κρυφοί κύριοι & καρμικοί)</summary><p class="muted">Το βιβλίο προτείνει να ελέγχεις την ημερομηνία με όλους τους τρόπους: κάποιος μπορεί να φανερώσει κύριο αριθμό ή καρμικό χρέος που οι άλλοι κρύβουν.</p>`;
 ms.forEach((x,i)=>{h+=`<div class="pm"><b>${x.t}</b>${bk[i]&&bk[i].how?` <span class="muted">· ${esc(bk[i].how)}</span>`:""}</div><div class="calc" style="white-space:pre">${esc(x.c)}</div>`});
 if(masters.length&&!masters.includes(lp))h+=`<div class="hl">✨ Δύο από τις τρεις πρώτες μεθόδους δίνουν κύριο αριθμό <b>${masters.join(", ")}</b> (το βιβλίο τον δέχεται έτσι): η Πορεία σου ${lp} κουβαλά και τη δόνηση του ${masters[0]}. Ζεις κυρίως σαν ${lp}, αλλά σε στιγμές έμπνευσης ανεβαίνεις πιο ψηλά.</div>`;
 if(debts.length)h+=`<div class="hl">⚖️ Στον δρόμο της αναγωγής εμφανίζεται ${debts.length>1?"καρμικό χρέος":"το καρμικό χρέος"} <b>${debts.join(", ")}</b>.</div>`;
 return h+`</details>`;
}

// ---------- ΠΕΡΙΟΔΟΙ ΖΩΗΣ ----------
function periods(r,bd){
 const [Y,M,D]=bd.split("-").map(Number);
 const p=[red(M),red(D),red(Y)];
 const lps=single(r.lp);
 // πίνακας του βιβλίου (αν υπάρχει) αλλιώς: η 1η τελειώνει με την 1η Κορυφή (36−ΠΖ), η 2η 27 χρόνια μετά
 let ages=null;const rows=arr(BK("cycles.periodAges.rows",[]));
 const row=rows.find(x=>String(x.lifePath).split(/\D+/).map(Number).includes(r.lp))||rows.find(x=>String(x.lifePath).split(/\D+/).map(Number).includes(lps));
 if(row){const e1=parseInt(String(row.first).split(/\D+/)[1]),s3=parseInt(String(row.thirdStarts).split(/\D+/)[1]);if(e1&&s3)ages=[`0–${e1}`,`${e1+1}–${s3-1}`,`${s3}+`]}
 const parse=s=>{const m=String(s).match(/(\d+)\D+(\d+)?/);return m?[+m[1],m[2]?+m[2]:null]:[0,null]};
 return p.map((n,i)=>{const [a,b]=parse(ages[i]);return{n,lab:["1η · Διαμόρφωση (από τον μήνα)","2η · Παραγωγικότητα (από την ημέρα)","3η · Συγκομιδή (από το έτος)"][i],ages:ages[i],cur:r.age>=a&&(b==null||r.age<=b)}});
}
function periodsHTML(r,bd){
 const ps=periods(r,bd);
 let h=`<h2 style="margin:16px 4px 8px">🌗 Οι 3 Περίοδοι Ζωής</h2><div class="card"><p class="muted" style="margin-top:0">${esc(BK("cycles.periodRules.intro","Τρία μεγάλα «κεφάλαια» της ζωής: διαμόρφωση, παραγωγικότητα, συγκομιδή. Το καθένα έχει τον δικό του τόνο."))}</p>`;
 ps.forEach(x=>{const b=BK("cycles.periods."+x.n,null);
  h+=`<div class="card ${x.cur?"now":""}" style="margin-bottom:8px"><div class="ttl">${x.lab}${x.cur?'<span class="tag">ΤΩΡΑ</span>':""}</div><div class="sub">Ηλικίες ${esc(x.ages)} · αριθμός <b>${x.n}</b></div>
  <div class="arch">${esc(b&&b.title||N[x.n].a)}</div>${para(b&&b.text||N[x.n].k)}</div>`});
 return h+`</div>`;
}

// ---------- ΗΛΙΚΙΑΚΗ ΔΟΝΗΣΗ & ΠΡΙΝ 9 ΧΡΟΝΙΑ ----------
function ageVib(r){const a2=r.RY-r.Y;return r.M===1?single(a2):single((a2-1)+a2)}
function ageVibHTML(r){
 const av=ageVib(r);const m=BK("cycles.ageVibration.meaning","");
 const harm=av===r.py;
 return `<div class="card"><div class="num"><div class="badge" style="background:linear-gradient(135deg,#0b4a4a,#1d7a6a)">${av}</div><div style="flex:1"><div class="ttl">Ηλικιακή Δόνηση</div><div class="sub">${r.M===1?`Ηλικία ${r.RY-r.Y} φέτος`:`Οι δύο ηλικίες του ${r.RY}: ${r.RY-r.Y-1} + ${r.RY-r.Y} = ${2*(r.RY-r.Y)-1}`} → ${av}</div>
 <p style="margin:6px 0">${harm?"Η ηλικία σου και η χρονιά σου <b>συντονίζονται</b>: ό,τι κάνεις φέτος έχει διπλή δύναμη.":`Η ηλικία σου φέτος δονείται στο <b>${av}</b> («${nmS(av)}»), ενώ η χρονιά ζητά <b>${r.py}</b>. ${cm(av,r.py)>=4?"Ταιριάζουν, οπότε η χρονιά κυλά πιο εύκολα.":"Θέλει συνειδητή ισορροπία ανάμεσα στα δύο."}`}</p>
 ${m?`<p class="muted" style="margin:4px 0">${esc(m)}</p>`:""}</div></div></div>`;
}
function lookBackHTML(r){
 const y=r.RY-9;
 return `<div class="card"><div class="ttl">🔁 Πριν από 9 χρόνια · ${y}</div><p style="margin:6px 0">Το ${y} ήσουν επίσης σε Προσωπικό Έτος <b>${r.py}</b>. Θυμήσου τι ξεκίνησε, τι έκλεισε και τι έμαθες τότε: τα ίδια θέματα επιστρέφουν φέτος σε ψηλότερη σκάλα.</p>${BK("cycles.lookBack")?`<p class="muted" style="margin:4px 0">${esc(BK("cycles.lookBack"))}</p>`:""}</div>`;
}

// ---------- ΠΑΓΚΟΣΜΙΟΣ ΧΡΟΝΟΣ ----------
function universal(Y,M,D){const uy=single(Y),um=single(uy+M),ud=single(um+D);return{uy,um,ud}}

// ---------- ΜΙΚΡΟ ΟΝΟΜΑ ----------
function firstNameNum(fn){const L=letters(fn);return L.length?red(L.reduce((a,b)=>a+b.v,0)):null}

// ---------- ΕΜΠΛΟΥΤΙΣΜΟΣ ΤΗΣ ΚΑΡΤΑΣ ΠΡΟΦΙΛ ----------
const FIVEKEY={lp:"lp",ex:"destiny",su:"soul",pe:"personality",ma:"maturity"};
function bookFor(kind,n){const b=BK("five."+kind+"."+n,null);if(!b)return"";
 return `<div class="hl"><b>📖 ${esc(b.title||"")}</b>${para(b.text)}${b.work?`<div class="pm"><b>Δουλειά:</b> ${esc(b.work)}</div>`:""}${b.tip?`<div class="pm"><b>Συμβουλή:</b> ${esc(b.tip)}</div>`:""}</div>`}
function enrich(r,bd,fn){
 // βιβλίο κάτω από κάθε βασικό αριθμό
 const cards=[...document.querySelectorAll("#out > .card")].filter(c=>c.querySelector(".badge"));
 const order=[["lp",r.lp],["ex",r.ex.n],["su",r.su.n],["pe",r.pe.n],["ma",r.ma]];
 order.forEach(([k,n],i)=>{const c=cards[i];if(!c)return;const box=c.querySelector("details");if(!box)return;
  const extra=bookFor(FIVEKEY[k],n);
  const btn=`<div class="row" style="margin-top:6px"><button class="ghost" style="padding:6px 10px;font-size:13px" data-num="${n}">🌀 Το πορτρέτο του ${n}</button></div>`;
  box.insertAdjacentHTML("beforeend",extra+btn);
  if(k==="lp")box.insertAdjacentHTML("afterend",methodsHTML(bd,r.lp));
 });
 // μικρό όνομα + παγκόσμιος χρόνος + ηλικιακή δόνηση + πριν 9 χρόνια + περίοδοι
 const fnn=firstNameNum(fn);const U=universal(r.RY,r.RM,r.RD);
 const now=[...document.querySelectorAll("#out h2")].find(h=>h.textContent.startsWith("②"));
 const nowCard=now&&now.nextElementSibling;
 if(nowCard){nowCard.insertAdjacentHTML("afterend",ageVibHTML(r)+lookBackHTML(r)+`<div class="card"><div class="ttl">🌍 Παγκόσμιος χρόνος</div><div class="grid3" style="margin-top:6px"><div class="mini"><div class="n">${U.uy}</div><div class="l">Παγκόσμιο Έτος ${r.RY}</div></div><div class="mini"><div class="n">${U.um}</div><div class="l">Παγκόσμιος Μήνας</div></div><div class="mini"><div class="n">${U.ud}</div><div class="l">Παγκόσμια Ημέρα</div></div></div><p class="muted" style="margin:8px 0 0">Ο «καιρός» για όλο τον κόσμο. Το ${r.RY} κουβαλά τον τόνο του ${U.uy} («${nmS(U.uy)}»)· η δική σου χρονιά (${r.py}) είναι ο προσωπικός σου καιρός μέσα σε αυτόν.</p></div>`)}
 const bdCard=[...document.querySelectorAll("#out .card")].find(c=>c.textContent.includes("+ Αριθμός Γενεθλίων"));
 if(bdCard&&fnn){const fb=BK("relations.names.first","");bdCard.insertAdjacentHTML("afterend",`<div class="card"><div class="num"><div class="badge" style="background:linear-gradient(135deg,#4a1a3a,#9e3a7a)">${fnn}</div><div style="flex:1"><div class="ttl">+ Αριθμός Μικρού Ονόματος</div><div class="sub">Το «${esc(fn)}» μόνο του · πώς σε νιώθουν οι κοντινοί σου</div><p style="margin:6px 0">${N[fnn].a}: ${N[fnn].k.toLowerCase()}. ${single(fnn)===single(r.lp)?"Ίδιο με την Πορεία σου: το όνομα που σε φωνάζουν σε σπρώχνει στον δρόμο σου.":cm(fnn,r.lp)>=4?"Ταιριάζει με την Πορεία σου και τη στηρίζει.":"Διαφέρει από την Πορεία σου: το καθημερινό σου όνομα σού δίνει κάτι που ο δρόμος σου δεν έχει."}</p>${fb?`<p class="muted" style="margin:4px 0">${esc(fb)}</p>`:""}</div></div></div>`)}
 // Ωριμότητα σε σχέση
 const mc=BK("five.maturityCombos",null);
 const maCard=cards[4];if(maCard&&mc){const rel=(a,b)=>single(a)===single(b)?"ίδιος":cm(a,b)>=4?"ταιριάζει":cm(a,b)===3?"ουδέτερος":"θέλει δουλειά";
  maCard.querySelector("details").insertAdjacentHTML("beforeend",`<h3>Η Ολοκλήρωση σε σχέση με τους άλλους αριθμούς</h3>
  <div class="pm">με Ψυχή ${r.su.n}: <b>${rel(r.ma,r.su.n)}</b>${mc.withSoul?` · <span class="muted">${esc(mc.withSoul)}</span>`:""}</div>
  <div class="pm">με Προσωπικότητα ${r.pe.n}: <b>${rel(r.ma,r.pe.n)}</b>${mc.withPersonality?` · <span class="muted">${esc(mc.withPersonality)}</span>`:""}</div>
  <div class="pm">με Πεπρωμένο ${r.ex.n}: <b>${rel(r.ma,r.ex.n)}</b>${mc.withDestiny?` · <span class="muted">${esc(mc.withDestiny)}</span>`:""}</div>
  <div class="pm">με Πορεία ${r.lp}: <b>${rel(r.ma,r.lp)}</b>${mc.withLifePath?` · <span class="muted">${esc(mc.withLifePath)}</span>`:""}</div>
  ${single(r.py)===single(r.ma)?`<div class="hl">Φέτος το Προσωπικό Έτος (${r.py}) ίδιο με την Ολοκλήρωση: χρονιά-κλειδί για τον μεγάλο σου σκοπό.${mc.samePY?" "+esc(mc.samePY):""}</div>`:""}`)}
 // Κορυφές & προκλήσεις από το βιβλίο
 document.querySelectorAll("#out .pm").forEach(pm=>{const m=pm.textContent.match(/^🏔 Κορυφή (\d+)/);if(m){const b=BK("cycles.pinnacles."+m[1],null);if(b&&b.text)pm.insertAdjacentHTML("beforeend",`<div class="muted">${esc(b.text)}</div>`)}
  const c=pm.textContent.match(/^⚓ Πρόκληση (\d+)/);if(c){const b=BK("cycles.challenges."+c[1],null);if(b&&b.text)pm.insertAdjacentHTML("beforeend",`<div class="muted">${esc(b.text)}</div>`)}});
 // καρμικά από το βιβλίο
 document.querySelectorAll("#out .pm").forEach(pm=>{const m=pm.textContent.match(/^• (\d+)\/\d+:/);if(m){const b=BK("core.karmicDebt."+m[1],null);if(b&&b.advice)pm.insertAdjacentHTML("beforeend",`<div class="muted">👉 ${esc(b.advice)}</div>`)}
  const k=pm.textContent.match(/^• (\d): /);if(k){const b=BK("core.karmicLessons."+k[1],null);if(b&&b.advice)pm.insertAdjacentHTML("beforeend",`<div class="muted">👉 ${esc(b.advice)}</div>`)}});
 // Προσωπικό έτος από το βιβλίο
 const pyB=BK("cycles.py."+r.py,null);
 if(pyB&&nowCard){const h3=nowCard.querySelector("h3");if(h3)h3.nextElementSibling.insertAdjacentHTML("afterend",`${pyB.text?`<p class="muted" style="margin:2px 0 6px">${esc(pyB.text)}</p>`:""}${arr(pyB.do).length?`<div class="pm"><b>✅ Κάνε:</b> ${arr(pyB.do).map(esc).join(" · ")}</div>`:""}${arr(pyB.avoid).length?`<div class="pm"><i>⛔ Απόφυγε:</i> ${arr(pyB.avoid).map(esc).join(" · ")}</div>`:""}`)}
 // περίοδοι ζωής στο τέλος (πριν από τη σύνθεση)
 ($("synth")||$("out")).insertAdjacentHTML($("synth")?"beforebegin":"beforeend",periodsHTML(r,bd));
}

// ---------- ΑΡΙΘΜΟΙ (ΒΙΒΛΙΟ) ----------
const PICK=[1,2,3,4,5,6,7,8,9,11,22,33,10,13,14,16,19];
function drawPick(sel){$("numPick").innerHTML=PICK.map(n=>`${n===11?"<small>Κύριοι αριθμοί</small>":n===10?"<small>Καρμικοί αριθμοί</small>":""}<button class="${n===sel?"on":""}" data-n="${n}">${n}</button>`).join("")}
function sec(t,x){return x?`<h3>${t}</h3>${para(x)}`:""}
function numPage(n){
 drawPick(n);let h="";
 if(n<=9){const b=BK("numbers."+n,{});const x=N[n];
  h=`<div class="card"><div class="num"><div class="badge">${n}</div><div style="flex:1"><div class="ttl">${x.a}</div><div class="sub">${x.k}</div>${BK("core.quick."+n)?`<div class="arch">${esc(BK("core.quick."+n))}</div>`:""}</div></div>
  ${sec("⚡ Η ενέργεια",b.energy)}${sec("⏱ Ο χρόνος του "+n,b.time)}${sec("🌱 Η ζωή με το "+n,b.life)}${sec("🎁 Η ευλογία",b.blessing)}${sec("⛰ Η πρόκληση",b.challenge)}${sec("📘 Το μάθημα",b.lesson)}${sec("💞 Οι σχέσεις",b.relations)}${sec("⭐ Τι είναι σημαντικό",b.important)}
  ${b.cosmic?`<h3>🌌 Κοσμική σύνδεση</h3><p style="margin:4px 0 8px">${esc(b.cosmic).split(" · ").map(s=>`<span class="pill">${s}</span>`).join("")}</p>`:""}
  ${sec("🕊 Η πνευματική ουσία",b.spiritual)}${sec("🔆 Ανώτερο επίπεδο",b.higher)}
  ${arr(b.raise).length?`<h3>⬆️ Ανέβασε τη δόνηση του ${n}</h3><ul style="margin:4px 0 8px;padding-left:20px">${arr(b.raise).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}
  ${sec("🧩 Στο προφίλ σου",b.inProfile)}
  ${arr(b.famous).length?`<h3>👤 Γνωστοί άνθρωποι</h3><p class="muted">${arr(b.famous).map(esc).join(", ")}</p>`:""}
  <div class="pm"><b>＋</b> ${x.p}</div><div class="pm"><i>－</i> ${x.m}</div></div>`;
  if(b.meditation)h+=mediCard(n,b.meditation);
 }else if([11,22,33].includes(n)){const b=BK("core.masters."+n,{});const x=N[n];
  h=`<div class="card"><div class="num"><div class="badge">${n}<small>κύριος</small></div><div style="flex:1"><div class="ttl">${esc(b.title||x.a)}</div><div class="sub">${x.k}</div></div></div>
  ${sec("🛤 Ο δρόμος του "+n+"/"+single(n),b.path)}${sec("🔆 Η ανώτερη δόνηση",b.higher)}${sec("🌑 Η κατώτερη δόνηση",b.lower)}
  ${arr(b.tips).length?`<h3>🧭 Συμβουλές</h3><ul style="margin:4px 0 8px;padding-left:20px">${arr(b.tips).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}
  ${arr(b.famous).length?`<h3>👤 Γνωστοί ${n}/${single(n)}</h3><p class="muted">${arr(b.famous).map(esc).join(", ")}</p>`:""}
  <p class="muted">Ζεις σαν ${single(n)} όταν η τάση είναι βαριά, και σαν ${n} όταν την αντέχεις. Δες και το <a href="#" data-num="${single(n)}">${single(n)}</a>.</p>
  ${BK("core.masters.other")?`<h3>Οι σπανιότεροι κύριοι (44, 55…)</h3>${para(BK("core.masters.other"))}`:""}</div>`;
 }else{const b=BK("core.karmicDebt."+n,{});
  h=`<div class="card"><div class="num"><div class="badge" style="background:linear-gradient(135deg,#4a1a1a,#9e3a3a)">${n}<small>καρμικός</small></div><div style="flex:1"><div class="ttl">${esc(b.title||("Καρμικός αριθμός "+n))}</div><div class="sub">ανάγεται σε ${single(n)}</div>${BK("core.quick."+n)?`<div class="arch">${esc(BK("core.quick."+n))}</div>`:""}</div></div>
  ${sec("Τι σημαίνει",b.meaning)}${sec("Πώς το καταλαβαίνεις",b.signs)}${sec("Τι να κάνεις",b.advice)}
  ${BK("core.karmicHow")?`<h3>Πού εμφανίζεται</h3>${para(BK("core.karmicHow"))}`:""}${n===10?"":`<p class="muted">Το χρέος φαίνεται όταν το ${n} εμφανίζεται ως ενδιάμεσο άθροισμα στην Πορεία Ζωής, στο Πεπρωμένο, στην Ψυχή, στην Προσωπικότητα ή ως ημέρα γέννησης.</p>`}</div>`;
 }
 $("numOut").innerHTML=h;
 const st=$("medStart");if(st)st.onclick=()=>meditate(n);
 const sp=$("medSpeak");if(sp)sp.onclick=()=>speak($("medText").innerText);
}
function mediCard(n,t){return `<div class="card medi"><div class="ttl" style="color:#ffd27a">🧘 Διαλογισμός για τον αριθμό ${n}</div><p id="medText">${esc(t)}</p>
 <div class="row"><button class="acc" id="medStart">⏳ 3 λεπτά σιωπή</button><button class="ghost" style="color:#fff;border-color:#6a5a9a" id="medSpeak">🔊 Διάβασέ το</button></div><div id="medTimer" style="font-size:30px;font-weight:800;text-align:center;color:#ffd27a"></div></div>`}
let medT=null;
function bell(){try{const a=new (window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.frequency.value=528;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.35,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+4);o.start();o.stop(a.currentTime+4)}catch(e){}}
function meditate(){clearInterval(medT);let s=180;bell();const t=$("medTimer");const tick=()=>{t.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;if(s--<=0){clearInterval(medT);t.textContent="🙏";bell()}};tick();medT=setInterval(tick,1000)}
function speak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="el-GR";u.rate=.85;const v=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.startsWith("el"));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
$("numPick").onclick=e=>{const b=e.target.closest("[data-n]");if(b)numPage(+b.dataset.n)};
document.addEventListener("click",e=>{const b=e.target.closest("[data-num]");if(b){e.preventDefault();show("book");numPage(+b.dataset.num)}});

// ---------- ΗΜΕΡΕΣ ----------
const GOALS=[["any","— όλα —",[]],["start","Νέο ξεκίνημα, αίτηση, πρώτη μέρα",[1]],["deal","Συνεργασία, συμφωνία, ραντεβού",[2,6]],["talk","Παρουσίαση, γράψιμο, γιορτή",[3]],["work","Οργάνωση, χαρτιά, επισκευές",[4]],["travel","Ταξίδι, αλλαγή, πωλήσεις",[5]],["home","Σπίτι, οικογένεια, μετακόμιση",[6]],["study","Μελέτη, ξεκούραση, διαλογισμός",[7]],["money","Χρήματα, υπογραφή, διαπραγμάτευση",[8]],["close","Κλείσιμο, ξεκαθάρισμα, αποχαιρετισμός",[9]]];
const WD=["Κυρ","Δευ","Τρί","Τετ","Πέμ","Παρ","Σάβ"];
function meP(){let i=store.get("ar_me",0);return people[i]||people[0]||null}
function fillDays(){
 $("dsel").innerHTML=people.length?people.map((p,i)=>`<option value="${i}">${esc([p.fn,p.ln].join(" "))}</option>`).join(""):`<option value="">— αποθήκευσε πρώτα ένα πρόσωπο —</option>`;
 $("dsel").value=String(Math.min(store.get("ar_me",0),Math.max(people.length-1,0)));
 if(!$("dgoal").options.length)$("dgoal").innerHTML=GOALS.map(g=>`<option value="${g[0]}">${g[1]}</option>`).join("");
 if(!$("dmon").value)$("dmon").value=today().slice(0,7);
 drawToday();drawCal();
}
function pdOf(p,y,m,d){const py=single(single(+p.bd.split("-")[1])+single(+p.bd.split("-")[2])+single(y));const pm=single(py+m);return{py,pm,pd:single(pm+d)}}
function drawCal(){
 const p=people[+$("dsel").value];if(!p){$("calOut").innerHTML=`<div class="card empty">Πήγαινε στο Προφίλ, υπολόγισε τον εαυτό σου και πάτα «Αποθήκευση».</div>`;return}
 const [y,m]=$("dmon").value.split("-").map(Number);const goal=GOALS.find(g=>g[0]===$("dgoal").value)||GOALS[0];
 const first=new Date(y,m-1,1).getDay(),days=new Date(y,m,0).getDate();const td=today();
 const {py,pm}=pdOf(p,y,m,1);
 let h=`<div class="card"><div class="row" style="justify-content:space-between"><b>${MN[m-1]} ${y}</b><span class="muted">Έτος ${py} · Μήνας ${pm}</span></div><p class="muted" style="margin:4px 0 8px">${esc(BK("cycles.pm."+pm+".text",N[pm].mo))}</p><div class="cal">${WD.map(w=>`<div class="h">${w}</div>`).join("")}`;
 for(let i=0;i<first;i++)h+=`<div class="d x"></div>`;
 const best=[];
 for(let d=1;d<=days;d++){const n=pdOf(p,y,m,d).pd;const iso=`${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;const b=goal[2].includes(n);if(b)best.push(d);
  h+=`<div class="d ${b?"best":""} ${iso===td?"today":""}" data-day="${d}"><div class="dn">${d}</div><div class="pn">${n}</div><div class="pw">${PD[n]}</div></div>`}
 h+=`</div>${goal[2].length?`<p class="pm" style="margin-top:8px">⭐ Καλύτερες μέρες για «${goal[1].toLowerCase()}»: <b>${best.join(", ")||"—"}</b></p>`:""}</div><div id="dayInfo"></div>`;
 $("calOut").innerHTML=h;
}
function dayInfo(p,y,m,d){const {py,pm,pd}=pdOf(p,y,m,d);const b=BK("cycles.pd."+pd,null);const U=universal(y,m,d);
 return `<div class="card"><div class="ttl">${d} ${MNg[m-1]} ${y} · Προσωπική Ημέρα ${pd}</div><div class="arch">${esc(b&&b.title||N[pd].a)}</div>${para(b&&b.text||N[pd].mo)}<div class="muted">Έτος ${py} · Μήνας ${pm} · Παγκόσμια Ημέρα ${U.ud}</div></div>`}
function drawToday(){const p=meP();if(!p){$("todayCard").innerHTML="";return}
 const t=new Date();const y=t.getFullYear(),m=t.getMonth()+1,d=t.getDate();const {py,pm,pd}=pdOf(p,y,m,d);const b=BK("cycles.pd."+pd,null);
 $("todayCard").innerHTML=`<div class="card" style="background:linear-gradient(135deg,#2a1a4a,#5b3a9e);color:#fff;border:0"><div style="font-size:13px;opacity:.8">Σήμερα για ${esc(p.fn)} · ${WD[t.getDay()]} ${d} ${MNg[m-1]}</div>
 <div class="row" style="align-items:flex-end;gap:14px;margin-top:4px"><div style="font-size:52px;font-weight:800;color:#ffd27a;line-height:1">${pd}</div><div><div style="font-size:20px;font-weight:800">${PD[pd]}</div><div style="opacity:.85;font-size:13px">Έτος ${py} · Μήνας ${pm}</div></div></div>
 <p style="margin:8px 0 0;opacity:.95">${esc(b&&b.text||N[pd].mo)}</p></div>`}
$("calOut").onclick=e=>{const c=e.target.closest("[data-day]");if(!c)return;const p=people[+$("dsel").value];const [y,m]=$("dmon").value.split("-").map(Number);$("dayInfo").innerHTML=dayInfo(p,y,m,+c.dataset.day);$("dayInfo").scrollIntoView({behavior:"smooth",block:"nearest"})};
["dsel","dmon","dgoal"].forEach(i=>$(i).onchange=()=>{if(i==="dsel"){store.set("ar_me",+$("dsel").value)}drawToday();drawCal()});

// ---------- ΕΡΓΑΛΕΙΑ ----------
let tool="house";
function numOfText(s){let t=0;const ds=[];for(const ch of clean(s)){if(ch>="0"&&ch<="9"){t+=+ch;ds.push(ch)}else{const L=letters(ch);if(L.length){t+=L[0].v;ds.push(L[0].v+"("+L[0].c+")")}}}return{t,ds}}
function myLP(){const p=meP();return p?compute(p.fn,p.mn,p.ln,p.bd,today()):null}
function harmLine(n){const r=myLP();if(!r)return"";const c=cm(n,r.lp);return `<div class="pm">Με την Πορεία Ζωής σου (${r.lp}): <b>${LV[c][0]}</b> · ${LV[c][1]}</div>`}
function drawTool(){
 document.querySelectorAll("#toolTabs button").forEach(b=>b.classList.toggle("on",b.dataset.t===tool));
 let h="";
 if(tool==="house"){h=`<div class="card"><h2>🏠 Ο αριθμός του σπιτιού</h2><p class="muted" style="margin-top:0">${esc(BK("relations.house.rules","Σε πολυκατοικία μετράει ο αριθμός του διαμερίσματος (αν έχει), αλλιώς της πόρτας. Τα γράμματα (π.χ. 12Α) μετρούν κι αυτά."))}</p>
  <div class="g2"><div><label>Αριθμός οδού / πόρτας</label><input id="hNo" placeholder="π.χ. 12Α"></div><div><label>Διαμέρισμα (προαιρετικό)</label><input id="hAp" placeholder="π.χ. Β3"></div></div>
  <label>Οδός (προαιρετικό)</label><input id="hSt" placeholder="π.χ. Ποσειδώνος"><div class="row" style="margin-top:10px"><button class="acc" id="hGo">Υπολόγισε</button></div></div><div id="hOut"></div>`}
 if(tool==="phone"){h=`<div class="card"><h2>📞 Τηλέφωνο, πινακίδα, θυρίδα</h2><p class="muted" style="margin-top:0">Γράψε οποιονδήποτε αριθμό: κινητό, πινακίδα αυτοκινήτου, ταχυδρομική θυρίδα, ταχ. κώδικα.</p><label>Αριθμός</label><input id="phIn" inputmode="text" placeholder="π.χ. 6944 123456 ή ΙΚΒ 2345"><div class="row" style="margin-top:10px"><button class="acc" id="phGo">Υπολόγισε</button></div></div><div id="phOut"></div>`}
 if(tool==="word"){h=`<div class="card"><h2>🔤 Λέξη, εταιρεία, πλοίο, πόλη</h2><p class="muted" style="margin-top:0">Το όνομα μιας εταιρείας, ενός πλοίου, μιας πόλης ή οποιαδήποτε λέξη: βγάζει Πεπρωμένο, Ψυχή και Προσωπικότητα.</p><label>Όνομα</label><input id="wIn" placeholder="π.χ. Samios Shipping"><div class="row" style="margin-top:10px"><button class="acc" id="wGo">Υπολόγισε</button></div></div><div id="wOut"></div>`}
 if(tool==="names"){const p=meP();h=`<div class="card"><h2>👶 Επιλογή ονόματος</h2><p class="muted" style="margin-top:0">Για μωρό, για αλλαγή ονόματος ή για επωνυμία. Γράψε υποψήφια ονόματα (ένα ανά γραμμή) και δες ποιο ταιριάζει καλύτερα με την ημερομηνία γέννησης.</p>
  <label>Υποψήφια μικρά ονόματα (ένα ανά γραμμή)</label><textarea id="nmList" rows="5" style="width:100%;font:inherit;padding:11px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)" placeholder="Γεώργιος\nΑλέξανδρος\nΝικόλαος"></textarea>
  <div class="g2"><div><label>Επώνυμο</label><input id="nmLn" value="${esc(p?p.ln:"")}"></div><div><label>Ημερομηνία γέννησης</label><input id="nmBd" type="date" value="${p?p.bd:""}"></div></div>
  <div class="row" style="margin-top:10px"><button class="acc" id="nmGo">Σύγκρινε</button></div></div><div id="nmOut"></div>`}
 $("toolOut").innerHTML=h;
 if(tool==="house")$("hGo").onclick=()=>{const no=$("hNo").value.trim(),ap=$("hAp").value.trim(),st=$("hSt").value.trim();if(!no&&!ap)return;
  const key=ap||no;const x=numOfText(key);const n=single(x.t);const b=BK("relations.house."+n,null);
  let o=`<div class="card"><div class="num"><div class="badge">${n}</div><div style="flex:1"><div class="ttl">${esc(b&&b.title||("Σπίτι "+n+" · "+N[n].a))}</div><div class="sub">${ap?"διαμέρισμα":"αριθμός"} ${esc(key)}: ${x.ds.join("+")} = ${x.t}${x.t>9?" → "+n:""}</div>${para(b&&b.text||N[n].k)}${b&&b.challenge?`<div class="pm"><i>⚠️ Η πρόκληση:</i> ${esc(b.challenge)}</div>`:""}${harmLine(n)}</div></div></div>`;
  if(ap&&no){const y=numOfText(no);const nb=single(y.t);o+=`<div class="card"><div class="ttl">Η πολυκατοικία · ${esc(no)} → ${nb}</div><p class="muted" style="margin:4px 0">${esc(BK("relations.house."+nb+".title",N[nb].a))}: το «κλίμα» όλου του κτιρίου. Το διαμέρισμα (${n}) είναι ο δικός σου χώρος μέσα σε αυτό.</p></div>`}
  if(st){const s=letters(st);if(s.length){const sn=red(s.reduce((a,b)=>a+b.v,0));o+=`<div class="card"><div class="ttl">Η οδός «${esc(st)}» → ${sn}</div><p class="muted" style="margin:4px 0">${esc(N[sn].a)}: ${N[sn].k.toLowerCase()}. ${esc(BK("relations.house.street",""))}</p></div>`}}
  $("hOut").innerHTML=o};
 if(tool==="phone")$("phGo").onclick=()=>{const v=$("phIn").value.trim();if(!v)return;const x=numOfText(v);if(!x.ds.length)return;const n=red(x.t);
  $("phOut").innerHTML=`<div class="card"><div class="num"><div class="badge">${n}</div><div style="flex:1"><div class="ttl">${N[n].a}</div><div class="sub">${x.ds.join("+")} = ${x.t}</div><p style="margin:6px 0">${N[n].k}. ${esc(BK("numbers."+single(n)+".energy",""))}</p>${BK("relations.names.phone")?`<p class="muted">${esc(BK("relations.names.phone"))}</p>`:""}${harmLine(n)}</div></div></div>`};
 if(tool==="word")$("wGo").onclick=()=>{const v=$("wIn").value.trim();const parts=v.split(/\s+/).filter(Boolean);if(!parts.length||!letters(v).length)return;
  const ex=nameNum(parts,()=>true),su=nameNum(parts,x=>x.vow),pe=nameNum(parts,x=>!x.vow);
  $("wOut").innerHTML=`<div class="card"><h2>${esc(v)}</h2>${[["Πεπρωμένο · τι κάνει",ex,"ex"],["Ψυχή · τι θέλει",su,"su"],["Προσωπικότητα · πώς φαίνεται",pe,"pe"]].map(([t,o,k])=>N[o.n]?`<div class="num" style="margin-bottom:10px"><div class="badge">${o.n}</div><div style="flex:1"><div class="ttl">${t}</div><div class="arch">${N[o.n].a}</div><p style="margin:4px 0">${N[o.n].k}</p><div class="calc">${esc(o.lines.join("\n")).replace(/\n/g,"<br>")}</div></div></div>`:"").join("")}
  ${arr(BK("relations.names.business",[])).length?`<h3>Συμβουλές για επωνυμία</h3><ul style="padding-left:20px">${arr(BK("relations.names.business")).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}${harmLine(ex.n)}</div>`};
 if(tool==="names")$("nmGo").onclick=()=>{const L=$("nmList").value.split(/\n/).map(s=>s.trim()).filter(Boolean),ln=$("nmLn").value.trim(),bd=$("nmBd").value;if(!L.length||!ln||!bd)return;
  const rows=L.map(fn=>{const r=compute(fn,"",ln,bd,today());const sc=cm(r.ex.n,r.lp)*2+cm(r.su.n,r.lp)+(r.ex.n>9?1:0)-(r.debts.filter(d=>d!==single(+bd.split("-")[2])).length?1:0)-Math.max(0,r.missing.filter(k=>k!==6&&k!==9).length-2)*.5;return{fn,r,sc}}).sort((a,b)=>b.sc-a.sc);
  const lp=rows[0].r.lp;
  $("nmOut").innerHTML=`<div class="card"><h2>Κατάταξη για Πορεία Ζωής ${lp}</h2><table><tr><th>Όνομα</th><th>Πεπρ.</th><th>Ψυχή</th><th>Ταίριασμα</th></tr>${rows.map((x,i)=>`<tr ${i===0?'style="font-weight:800"':""}><td style="text-align:left">${i===0?"⭐ ":""}${esc(x.fn)}</td><td>${x.r.ex.n}</td><td>${x.r.su.n}</td><td>${LV[cm(x.r.ex.n,lp)][0]}</td></tr>`).join("")}</table>
  ${rows.map(x=>`<div class="pm" style="margin-top:8px"><b>${esc(x.fn)} ${esc(ln)}</b>: Πεπρωμένο ${x.r.ex.n} («${nmS(x.r.ex.n)}»)${x.r.debts.length?` · ⚖️ καρμικό ${x.r.debts.join(",")}`:""}${x.r.missing.filter(k=>k!==6&&k!==9).length?` · λείπουν ${x.r.missing.filter(k=>k!==6&&k!==9).join(",")}`:""}</div>`).join("")}
  ${arr(BK("relations.names.baby",[])).length?`<h3>Από το βιβλίο</h3><ul style="padding-left:20px">${[...arr(BK("relations.names.baby")),...arr(BK("relations.names.change"))].map(s=>`<li>${esc(s)}</li>`).join("")}</ul>`:""}
  <p class="muted">Το ταίριασμα βασίζεται κυρίως στο Πεπρωμένο σε σχέση με την Πορεία Ζωής, μετά στην Ψυχή.</p></div>`};
}
$("toolTabs").onclick=e=>{const b=e.target.closest("[data-t]");if(b){tool=b.dataset.t;drawTool()}};

// ---------- ΟΔΗΓΟΣ: πρόσθετα από το βιβλίο ----------
function drawGuideExtra(){
 const box=document.querySelector("#v-help");if(!box||$("guideExtra"))return;
 const ms=arr(BK("core.methods",[]));const c9=BK("core.cycle9",null);const dw=arr(BK("five.dreamWays",[]));const nr=arr(BK("five.nameRules",[]));const g=BK("relations.rel.groups",null);
 let h=`<div id="guideExtra">`;
 if(ms.length)h+=`<div class="card"><h2>Οι 4 μέθοδοι πρόσθεσης</h2>${ms.map(m=>`<h3>${esc(m.name||"")}</h3>${para(m.how)}${m.note?`<p class="muted">${esc(m.note)}</p>`:""}`).join("")}</div>`;
 if(c9&&c9.years)h+=`<div class="card"><h2>Ο εννεαετής κύκλος ανάπτυξης</h2>${para(c9.intro)}${Object.entries(c9.years).map(([k,v])=>`<div class="pm"><b>${k}</b> · ${esc(v)}</div>`).join("")}</div>`;
 if(g)h+=`<div class="card"><h2>Οι τρεις οικογένειες αριθμών</h2>${Object.entries(g).map(([k,v])=>`<h3>${k.split("").join("-")} · ${esc(v.title||"")}</h3>${para(v.text)}`).join("")}</div>`;
 if(nr.length)h+=`<div class="card"><h2>Ποιο όνομα μετράει;</h2><ul style="padding-left:20px">${nr.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`;
 if(dw.length)h+=`<div class="card"><h2>✨ Δώδεκα τρόποι να κάνεις ένα όνειρο πραγματικότητα</h2><ol style="padding-left:22px">${dw.map(s=>`<li style="margin-bottom:4px">${esc(s)}</li>`).join("")}</ol></div>`;
 const rules=arr(BK("core.rules",[]));if(rules.length)h+=`<div class="card"><h2>Κανόνες υπολογισμού</h2><ul style="padding-left:20px">${rules.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`;
 h+=`<p class="muted" style="padding:0 6px">Πηγή εμπλουτισμού: «Πλήρης Οδηγός Αριθμολογίας» (Kay Lagerquist & Lisa Lenard, εκδ. Διόπτρα), σε ελεύθερη απόδοση.</p></div>`;
 box.insertAdjacentHTML("beforeend",h);
}

// ---------- ΣΥΝΔΕΣΗ ----------
const _show=show;
show=function(v){_show(v);if(v==="days")fillDays();if(v==="tools")drawTool();if(v==="book"&&!$("numOut").innerHTML){const r=lastR;numPage(r?single(r.lp):1)}if(v==="help")drawGuideExtra()};
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>show(b.dataset.v));
const _run=run;
run=function(){_run();if(lastR){enrich(lastR,$("bd").value,$("fn").value.trim())}};
$("go").onclick=run;
// ⭐ «εγώ» στα πρόσωπα
const _drawPeople=drawPeople;
drawPeople=function(){_drawPeople();const me=store.get("ar_me",0);document.querySelectorAll("#people .list-item").forEach((it,i)=>{const r=it.querySelector(".row");if(r)r.insertAdjacentHTML("afterbegin",`<button class="ghost" style="padding:7px 9px" data-me="${i}" title="Αυτός είμαι εγώ">${i===me?"⭐":"☆"}</button>`)})};
$("people").addEventListener("click",e=>{const b=e.target.closest("[data-me]");if(b){store.set("ar_me",+b.dataset.me);drawPeople()}});

// ---------- ΤΑΙΡΙΑΣΜΑ: μέθοδος του βιβλίου (Συγχορδίες + Αριθμοί Στρες) ----------
const CHORD=n=>[1,5,7].includes(n)?"157":[2,4,8].includes(n)?"248":"369";
function bookCompat(ra,rb,na,nb){
 const ba=single(ra.bdn),bb=single(rb.bdn),ca=CHORD(ba),cb=CHORD(bb);const G=BK("relations.rel.groups",{});const DM=BK("relations.rel.coefRules.differenceMeaning",{});
 const pairs=[["Ψυχή",ra.su.n,rb.su.n],["Πορεία Ζωής",ra.lp,rb.lp],["Πεπρωμένο",ra.ex.n,rb.ex.n],["Ολοκλήρωση",ra.ma,rb.ma],["Προσωπικότητα",ra.pe.n,rb.pe.n]];
 const st=pairs.map(([t,a,b])=>({t,a,b,s:Math.abs(single(a)-single(b))}));
 const cnt={};st.forEach(x=>cnt[x.s]=(cnt[x.s]||0)+1);const rep=Object.entries(cnt).filter(([,c])=>c>=2).map(([k])=>+k);
 let h=`<div class="card"><h2>📖 Η μέθοδος του βιβλίου</h2>
 <h3>🎼 Συγχορδίες (από την ημέρα γέννησης)</h3>
 <div class="pm"><b>${esc(na)}</b>: ημέρα → ${ba} · ${esc((G[ca]||{}).title||ca)}</div><div class="pm"><b>${esc(nb)}</b>: ημέρα → ${bb} · ${esc((G[cb]||{}).title||cb)}</div>
 <div class="hl">${ca===cb?`Ίδια Συγχορδία: φυσική αρμονία, ίδια νοοτροπία. ${esc((G[ca]||{}).text||"")}`:"Διαφορετικές Συγχορδίες: δεν πειράζει, υπάρχουν πολλά άλλα σημεία επαφής. Ο καθένας φέρνει στη σχέση έναν άλλο κόσμο."}</div>
 <h3>⚡ Αριθμοί Στρες (μεγαλύτερος − μικρότερος)</h3><p class="muted" style="margin:2px 0 6px">Με σειρά σπουδαιότητας. Δείχνουν πού μαζεύεται η ένταση και τι θέλει προσοχή.</p>
 ${st.map(x=>`<div class="pm"><b>${x.t}</b> ${x.a} & ${x.b} → <b style="color:var(--hi)">${x.s}</b>${DM[x.s]?` · <span class="muted">${esc(DM[x.s])}</span>`:""}</div>`).join("")}
 ${rep.length?`<p class="pm" style="margin-top:6px">🔁 Ο Αριθμός Στρες <b>${rep.join(", ")}</b> επαναλαμβάνεται: αυτό είναι το κεντρικό μάθημα της σχέσης σας.</p>`:""}
 ${BK("relations.rel.cyclesCompare.text")?`<details><summary>Σύγκρινε και τους κύκλους</summary>${para(BK("relations.rel.cyclesCompare.text"))}</details>`:""}</div>`;
 const lf=arr(BK("relations.rel.lookFor",[]));
 if(lf.length)h+=`<div class="card"><h2>🔎 Τι ψάχνεις; Κοίτα αυτόν τον αριθμό</h2>${lf.map(x=>`<div class="pm"><b>${esc(x.want)}</b> → ${esc(x.number)}</div>`).join("")}</div>`;
 return h;
}
const _cmp=$("cmp").onclick;
$("cmp").onclick=()=>{_cmp();const A=sideData("a"),B=sideData("b");if(!A.fn||!A.ln||!A.bd||!B.fn||!B.ln||!B.bd)return;
 const ra=compute(A.fn,A.mn,A.ln,A.bd,today()),rb=compute(B.fn,B.mn,B.ln,B.bd,today());
 const last=$("cmpOut").lastElementChild;last.insertAdjacentHTML("beforebegin",bookCompat(ra,rb,A.fn,B.fn))};
