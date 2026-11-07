/* Overland’s Habit · 🧰 Εξοπλισμός (εγκυκλοπαίδεια εξοπλισμού). Δεδομένα: equip-data.js (EQD). */
const EQL=()=>(typeof LANG!=='undefined'&&LANG==='en')?'en':'el';
const EQC=()=>(typeof EQD!=='undefined'?EQD.cats:[]);
const EQK=id=>(typeof EQD!=='undefined'?EQD.cards[id]:null);
function eqT(o){return o?(o[EQL()]||o.el):{}}
function eqPrice(c){return EQL()==='en'?(c.price_en||c.price):c.price}
function eqF(c,k){return EQL()==='en'?(c[k+'_en']||c[k]):c[k]}
function gear(b){
 if(!b)return eqHome();
 if(b==='print')return eqPrint();
 if(b.startsWith('c_'))return eqCat(b.slice(2));
 if(b.startsWith('q_'))return eqQuiz(b.slice(2));
 if(b.startsWith('x_'))return eqCmp(b.slice(2));
 if(b.startsWith('w_'))return eqWiz(b.slice(2));
 return eqCard(b)}
function eqHome(){T('🧰 '+L2('Εξοπλισμός','Gear'));const C=EQC();
 const n=C.reduce((s,c)=>s+c.order.length,0);
 M.innerHTML=`<div class="muted">${L2(`Όλος ο εξοπλισμός του overlander: ${n} κάρτες σε ${C.length} κατηγορίες. Τι είναι, πώς δουλεύει, υπέρ και κατά, τιμές, τι κοιτάς όταν αγοράζεις.`,`All the overlander's gear: ${n} cards in ${C.length} categories. What it is, how it works, pros and cons, prices, what to check when buying.`)}</div>
 <input id="eqs" type="search" placeholder="🔎 ${L2('Αναζήτηση (π.χ. hard shell, ψυγείο, LiFePO4)','Search (e.g. hard shell, fridge, LiFePO4)')}" oninput="eqSearch()" style="margin:10px 0">
 <div id="eqr"></div>
 <h3>🧭 ${L2('Βοηθοί επιλογής','Choosing helpers')}</h3>
 ${EQW.map(w=>`<button class="row" onclick="go('gear/w_${w.id}')"><span class="e">${w.e}</span><span><b>${L2(w.el,w.en)}</b><small>${L2('λίγες ερωτήσεις, πρόταση με αιτιολόγηση','a few questions, a reasoned suggestion')}</small></span></button>`).join('')}
 <h3>📚 ${L2('Κατηγορίες','Categories')}</h3>
 ${C.map(c=>{const t=eqT(c);const q=LS.g('eqq',{})[c.cat];return `<button class="row" onclick="go('gear/c_${c.cat}')"><span class="e">${c.e}</span><span style="flex:1"><b>${esc(t.n)}</b><small>${c.order.length} ${L2('κάρτες','cards')}${c.quiz&&c.quiz.length?' · quiz '+c.quiz.length:''}</small></span>${q&&q.best>=Math.ceil(c.quiz.length*2/3)?'✅':''}</button>`}).join('')}
 <button class="btn" style="width:100%;margin-top:8px" onclick="go('gear/print')">🖨️ ${L2('Όλος ο οδηγός για εκτύπωση / PDF','Whole guide for printing / PDF')}</button>
 <div class="muted" style="margin-top:8px">${L2('Οι τιμές είναι ενδεικτικές (ευρωπαϊκή αγορά, τέλη 2026). Μάρκες: παραδείγματα, όχι διαφήμιση.','Prices are indicative (European market, late 2026). Brands: examples, not endorsements.')}</div>`}
function eqSearch(){const q=norm2($('#eqs').value.trim()),e=$('#eqr');if(!q){e.innerHTML='';return}
 const R=[];for(const c of EQC())for(const id of c.order){const k=EQK(id);if(!k)continue;const t=eqT(k);if(norm2([t.n,t.s,t.what,(t.pros||[]).join(' '),(t.cons||[]).join(' '),k.brands||''].join(' ')).includes(q))R.push(k)}
 e.innerHTML=R.slice(0,40).map(eqRow).join('')||`<div class="muted">${L2('Τίποτα δεν ταιριάζει.','Nothing matches.')}</div>`}
function eqRow(k){const t=eqT(k);return `<button class="row" onclick="go('gear/${k.id}')"><span class="e">${k.e||'🧰'}</span><span style="flex:1"><b>${esc(t.n)}</b><small>${esc(t.s||'')}${k.price?' · '+esc(eqPrice(k)):''}</small></span></button>`}
function eqCat(cat){const c=EQC().find(x=>x.cat===cat);if(!c)return eqHome();const t=eqT(c);T(c.e+' '+t.n);
 M.innerHTML=`<div class="tip" style="font-weight:400">${t.intro||''}</div>`+c.order.map(id=>EQK(id)).filter(Boolean).map(eqRow).join('')+
 (c.compare&&c.compare.length?`<h3>⚖️ ${L2('Συγκρίσεις','Comparisons')}</h3>`+c.compare.map((x,i)=>`<button class="row" onclick="go('gear/x_${cat}~${i}')"><span class="e">📊</span><span><b>${esc(eqT(x).t)}</b></span></button>`).join(''):'')+
 (c.quiz&&c.quiz.length?`<button class="big grn" onclick="go('gear/q_${cat}')">📝 Quiz (${c.quiz.length})</button>`:'')}
function eqList(a){return '<ul style="margin:6px 0 0 0;padding-left:18px">'+(a||[]).map(x=>`<li style="margin:3px 0">${x}</li>`).join('')+'</ul>'}
function eqCardHTML(k,print){const t=eqT(k);
 return `${print?`<h2 style="margin:18px 0 4px">${k.e||''} ${esc(t.n)}</h2>`:''}<div class="muted">${esc(t.s||'')}</div>
 <div class="kv box">${k.price?`<span>💶 ${L2('Τιμή','Price')}</span><b>${esc(eqPrice(k))}</b>`:''}${k.weight?`<span>⚖️ ${L2('Βάρος','Weight')}</span><b>${esc(eqF(k,'weight'))}</b>`:''}${k.brands?`<span>🏷️ ${L2('Παραδείγματα','Examples')}</span><b style="font-weight:500">${esc(eqF(k,'brands'))}</b>`:''}</div>
 <div class="box"><b>📖 ${L2('Τι είναι, πώς δουλεύει','What it is, how it works')}</b><div style="margin-top:6px">${t.what||''}</div></div>
 <div class="box" style="border-color:var(--grn)"><b>👍 ${L2('Υπέρ','Pros')}</b>${eqList(t.pros)}</div>
 <div class="box" style="border-color:var(--red)"><b>👎 ${L2('Κατά','Cons')}</b>${eqList(t.cons)}</div>
 ${t.who?`<div class="box"><b>🙋 ${L2('Για ποιον είναι','Who it suits')}</b><div style="margin-top:6px">${t.who}</div></div>`:''}
 ${t.buy&&t.buy.length?`<div class="box"><b>🛒 ${L2('Τι κοιτάς όταν αγοράζεις','What to check when buying')}</b>${eqList(t.buy)}</div>`:''}
 ${t.err&&t.err.length?`<div class="note"><b>⚠️ ${L2('Συνηθισμένα λάθη','Common mistakes')}</b>${eqList(t.err)}</div>`:''}
 ${t.tip?`<div class="tip">💡 ${t.tip}</div>`:''}`}
function eqCard(id){const k=EQK(id);if(!k)return eqHome();const t=eqT(k);T((k.e||'🧰')+' '+t.n);
 const c=EQC().find(x=>x.order.includes(id)),i=c?c.order.indexOf(id):-1,nx=c&&c.order[i+1]?EQK(c.order[i+1]):null;
 M.innerHTML=(c?`<div class="muted">${c.e} ${esc(eqT(c).n)} · ${i+1}/${c.order.length}</div>`:'')+eqCardHTML(k)+
 (nx?`<button class="row" onclick="go('gear/${nx.id}')"><span class="e">➡️</span><span><b>${L2('Επόμενο','Next')}: ${esc(eqT(nx).n)}</b></span></button>`:'')+
 (c?`<button class="row" onclick="go('gear/c_${c.cat}')"><span class="e">${c.e}</span><span><b>${L2('Όλη η κατηγορία','Whole category')}</b></span></button>`:'')}
function eqTable(x){const t=eqT(x);return `<div class="box" style="overflow-x:auto"><b>${esc(t.t)}</b><table class="t" style="margin-top:6px"><tr>${t.cols.map(h=>`<th>${esc(h)}</th>`).join('')}</tr>${t.rows.map(r=>`<tr>${r.map((v,j)=>j?`<td>${esc(v)}</td>`:`<th>${esc(v)}</th>`).join('')}</tr>`).join('')}</table></div>`}
function eqCmp(s){const[cat,i]=s.split('~'),c=EQC().find(x=>x.cat===cat),x=c&&c.compare[+i];if(!x)return eqHome();T('📊 '+eqT(x).t);M.innerHTML=eqTable(x)}
let EQZ={};
function eqQuiz(cat){const c=EQC().find(x=>x.cat===cat);if(!c)return eqHome();T('📝 '+eqT(c).n);EQZ={cat,ans:{}};
 M.innerHTML=c.quiz.map((q,i)=>{const t=eqT(q);return `<div class="box" id="eqz${i}"><b>${i+1}. ${esc(t.q)}</b>${t.a.map((a,j)=>`<button class="row" style="margin:6px 0 0;padding:10px" onclick="eqAns(${i},${j})">${esc(a)}</button>`).join('')}<div class="qzw"></div></div>`}).join('')+'<div id="eqzs"></div>'}
function eqAns(i,j){if(EQZ.ans[i]!=null)return;const c=EQC().find(x=>x.cat===EQZ.cat),q=c.quiz[i],ok=j===q.c;EQZ.ans[i]=ok;const b=$('#eqz'+i).querySelectorAll('button');
 b[q.c].style.borderColor='var(--grn)';b[q.c].style.background='#24332a';if(!ok){b[j].style.borderColor='var(--red)';b[j].style.background='#4a1c18'}
 $('#eqz'+i).querySelector('.qzw').innerHTML=`<div class="${ok?'tip':'warn'}" style="font-weight:400">${ok?'✅ '+L2('Σωστό.','Correct.'):'❌ '+L2('Όχι.','No.')} ${esc(eqT(q).w||'')}</div>`;vib(ok?30:[60,40,60]);
 if(Object.keys(EQZ.ans).length===c.quiz.length){const sc=Object.values(EQZ.ans).filter(Boolean).length,Q=LS.g('eqq',{}),pr=Q[c.cat]||{best:0};Q[c.cat]={best:Math.max(pr.best,sc),last:sc,t:Date.now()};LS.s('eqq',Q);
  const pass=sc>=Math.ceil(c.quiz.length*2/3);$('#eqzs').innerHTML=`<div class="res"><div class="v">${sc}/${c.quiz.length}</div><div>${pass?'🎉 '+L2('Πέρασες!','You passed!'):L2('Ξαναδιάβασε και δοκίμασε πάλι.','Read again and retry.')}</div><button class="btn" onclick="eqQuiz('${c.cat}')">↻ ${L2('Ξανά','Again')}</button></div>`}}
function eqPrint(){T('🖨️ '+L2('Οδηγός εξοπλισμού','Gear guide'));
 M.innerHTML=`<button class="big org" onclick="window.print()">🖨️ ${L2('Εκτύπωση / Αποθήκευση ως PDF','Print / Save as PDF')}</button><div class="muted">${L2('Στο κινητό: Κοινοποίηση ή Εκτύπωση → Αποθήκευση ως PDF.','On the phone: Share or Print → Save as PDF.')}</div>
 <h1 style="margin-top:14px">🧰 Overland’s Habit · ${L2('Εξοπλισμός του overlander','The overlander\'s gear')}</h1><div class="muted">Created by George Barbaris</div>`+
 EQC().map(c=>{const t=eqT(c);return `<h1 style="margin-top:28px;page-break-before:always">${c.e} ${esc(t.n)}</h1><div class="tip" style="font-weight:400">${t.intro||''}</div>`+
  c.order.map(id=>EQK(id)).filter(Boolean).map(k=>`<div style="page-break-inside:auto">${eqCardHTML(k,1)}</div>`).join('')+(c.compare||[]).map(eqTable).join('')}).join('')}

/* ===== Βοηθοί επιλογής: ερωτήσεις → βαθμολογία καρτών ===== */
let EQW=[];/* γεμίζει από equip-data.js (EQD.wiz) */
let EQWA={};
function eqWiz(id){const w=EQW.find(x=>x.id===id);if(!w)return eqHome();T(w.e+' '+L2(w.el,w.en));EQWA={id,a:{}};eqWizR()}
function eqWizR(){const w=EQW.find(x=>x.id===EQWA.id),L=EQL();
 let h=w.q.map((q,i)=>`<div class="box"><b>${i+1}. ${esc(q[L])}</b><div class="seg" style="margin-top:6px">${q.o.map((o,j)=>`<button class="${EQWA.a[i]===j?'on':''}" onclick="EQWA.a[${i}]=${j};eqWizR()">${esc(o[L])}</button>`).join('')}</div></div>`).join('');
 if(Object.keys(EQWA.a).length===w.q.length){const S={},Y={};
  w.q.forEach((q,i)=>{const o=q.o[EQWA.a[i]];Object.entries(o.s||{}).forEach(([k,v])=>{S[k]=(S[k]||0)+v;if(v>0&&o.why)(Y[k]=Y[k]||[]).push(o.why[L])})});
  const R=Object.entries(S).filter(([k])=>EQK(k)).sort((a,b)=>b[1]-a[1]).slice(0,3);
  h+=`<h3>✅ ${L2('Η πρόταση','The suggestion')}</h3>`+R.map(([k,v],r)=>{const c=EQK(k);return `<div class="box" style="${r?'':'border-color:var(--grn)'}"><b>${r?'':'🥇 '}${c.e||''} ${esc(eqT(c).n)}</b><div class="muted">${esc(eqPrice(c)||'')}</div>${(Y[k]||[]).length?eqList([...new Set(Y[k])]):''}<button class="btn" style="margin-top:6px" onclick="go('gear/${k}')">📖 ${L2('Δες την κάρτα','Open the card')}</button></div>`}).join('')+
  `<div class="muted">${L2('Η πρόταση είναι οδηγός, όχι κανόνας. Διάβασε υπέρ/κατά πριν αγοράσεις.','This is guidance, not a rule. Read the pros/cons before you buy.')}</div>`}
 M.innerHTML=h}
