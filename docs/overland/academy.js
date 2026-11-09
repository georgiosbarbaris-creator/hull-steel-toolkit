/* ===== Overland’s Habit, Ακαδημία (μαθήματα, quiz, badges, ευρετήριο «Έξω από τους Τοίχους») ===== */
const ACD=(typeof ACAD!=='undefined'?ACAD:{lessons:[],lists:{},coverage:[]});
const ALL=LESSONS.map(l=>Object.assign({src:'Overland’s Habit'},l)).concat(ACD.lessons||[]);
const ABYID=Object.fromEntries(ALL.map(l=>[l.id,l]));
/* πρόσθεσε στις λίστες εξοπλισμού ό,τι αναφέρουν τα βιβλία */
(function(){const nm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-zα-ω0-9]/g,'');
 Object.entries(ACD.lists||{}).forEach(([id,items])=>{const l=LISTS.find(x=>x.id===id);if(!l)return;const have=new Set(l.i.map(nm));items.forEach(x=>{const k=nm(x);if(k&&!have.has(k)){l.i.push(x);have.add(k)}})})})();
const SRCS=[['all','Όλα'],['o','🌄 Overland’s Habit'],['x','📗 Έξω από τους Τοίχους']];
const srcK=l=>/Έξω|Outside the Walls/.test(l.src)?'x':'o';
const done=id=>{const r=LS.g('read',{})[id],q=LS.g('quiz',{})[id],L=ABYID[id];return !!r&&(!L||!L.q||!L.q.length||(q&&q.best>=Math.ceil(L.q.length*2/3)))};
function learn(id){if(id==='index')return acIndex();if(id)return lesson(id);T('🎓 Ακαδημία');const f=LS.g('acf',{lv:'all',s:'all'}),dn=ALL.filter(l=>done(l.id)).length;
 const badges=LEVELS.map(([lv,e,nm])=>{const L=ALL.filter(x=>x.lv===lv),d=L.filter(x=>done(x.id)).length;return`<div style="text-align:center;opacity:${d===L.length&&L.length?1:.45}"><div style="font-size:1.8em">${d===L.length&&L.length?'🏅':e}</div><div class="muted" style="font-size:.75em">${nm}<br>${d}/${L.length}</div></div>`}).join('');
 M.innerHTML=`<div class="box"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="muted">Πρόοδος</div><div class="hd" style="font-size:2em;text-align:left">${dn}/${ALL.length}</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">${badges}</div></div>
 <div class="bar"><i style="width:${dn/ALL.length*100}%;background:var(--org)"></i></div><div class="muted">✅ = διάβασες το μάθημα και πέρασες το quiz (2/3 σωστά). 🏅 = όλο το επίπεδο.</div></div>
 <input id="acq" placeholder="🔎 Ψάξε (π.χ. λάσπη, υπνόσακος, εργάτης, ΕΓΣΑ)…" oninput="acList()">
 <div class="seg">${[['all','Όλα']].concat(LEVELS.map(l=>[l[0],l[1]+' '+l[2]])).map(([v,t])=>`<button class="${f.lv===v?'on':''}" onclick="acF('lv','${v}')">${t}</button>`).join('')}</div>
 <div class="seg">${SRCS.map(([v,t])=>`<button class="${f.s===v?'on':''}" onclick="acF('s','${v}')">${t}</button>`).join('')}</div>
 <button class="row" onclick="go('learn/index')"><span class="e">📑</span><span><b>${L2('Ευρετήριο «Έξω από τους Τοίχους»','Index of “Outside the Walls”')}</b><small>${L2('κάθε κεφάλαιο του βιβλίου → σε ποιο μάθημα είναι','each chapter of the book → which lesson covers it')}</small></span></button><button class="row" onclick="acReset()"><span class="e">🧹</span><span><b>${L2('Καθαρισμός προόδου','Reset progress')}</b><small>${L2('σβήνει όλα τα «διάβασα», τα quiz και τα 🏅, ξεκινάς από την αρχή','clears all “read”, quiz scores and 🏅, start fresh')}</small></span></button>
 <div id="acl"></div>`;acList()}
function acF(k,v){const f=LS.g('acf',{lv:'all',s:'all'});f[k]=v;LS.s('acf',f);learn()}
function acList(){const f=LS.g('acf',{lv:'all',s:'all'}),q=norm2(($('#acq')||{value:''}).value.trim()),e=$('#acl');if(!e)return;
 const L=ALL.filter(l=>(f.lv==='all'||l.lv===f.lv)&&(f.s==='all'||f.s==='k'||srcK(l)===f.s)&&(!q||norm2(l.n+' '+l.p.map(x=>x[0]+' '+x[1]).join(' ')).includes(q)));
 let h='',cur='';L.forEach(l=>{const g=l.src.split(':')[0].trim();if(g!==cur){cur=g;h+=`<h3>${esc(g)}</h3>`}const lv=LEVELS.find(x=>x[0]===l.lv)||LEVELS[0];
  h+=`<button class="row" onclick="go('learn/${l.id}')"><span class="e">${l.e||'📘'}</span><span style="flex:1"><b>${esc(l.n)}</b><small>${lv[1]} ${lv[2]} · ${l.p.length} ενότητες${l.q&&l.q.length?' · quiz '+l.q.length:''}</small></span>${done(l.id)?'✅':LS.g('read',{})[l.id]?'📖':''}</button>`});
 e.innerHTML=h||'<div class="muted">Τίποτα δεν ταιριάζει.</div>'}
function lesson(id){const x=ABYID[id];if(!x)return learn();const lv=LEVELS.find(l=>l[0]===x.lv)||LEVELS[0];T((x.e||'📘')+' '+x.n);const rd=LS.g('read',{}),i=ALL.indexOf(x),nx=ALL[i+1];
 M.innerHTML=`<div class="muted">${lv[1]} ${lv[2]} · ${esc(x.src||'')}</div>`+(typeof acImg==='function'?acImg(id,-1):'')+x.p.map((p,k)=>`<div class="box"><b>${k+1}. ${p[0]}</b><div style="margin-top:6px">${p[1]}</div></div>`+(typeof acImg==='function'?acImg(id,k):'')).join('')+
 (x.q&&x.q.length?`<h3>📝 Quiz</h3><div id="acqz"></div>`:'')+
 (rd[id]?'':`<button class="big grn" onclick="lsRead('${id}')">📖 Το διάβασα</button>`)+
 (done(id)?'<div class="tip" style="text-align:center">✅ Ολοκληρώθηκε</div>':'')+((rd[id]||LS.g('quiz',{})[id])?`<button class="btn" style="width:100%;margin:6px 0" onclick="acReset('${id}')">🧹 ${L2('Καθαρισμός μαθήματος (ξανά από την αρχή)','Reset this lesson (start over)')}</button>`:'')+
 (nx?`<button class="row" onclick="go('learn/${nx.id}')"><span class="e">➡️</span><span><b>Επόμενο: ${esc(nx.n)}</b></span></button>`:'');if(x.q&&x.q.length)acQuiz(id)}
function lsRead(id){const rd=LS.g('read',{});rd[id]=Date.now();LS.s('read',rd);lesson(id)}
let QZ={};
function acQuiz(id){const x=ABYID[id];QZ={id,ans:{}};$('#acqz').innerHTML=x.q.map((q,i)=>`<div class="box" id="qz${i}"><b>${i+1}. ${esc(q.q)}</b>${q.a.map((a,j)=>`<button class="row" style="margin:6px 0 0;padding:10px" onclick="acAns(${i},${j})">${esc(a)}</button>`).join('')}<div class="qzw"></div></div>`).join('')+`<div id="qzs"></div>`}
function acAns(i,j){if(QZ.ans[i]!=null)return;const x=ABYID[QZ.id],q=x.q[i],ok=j===q.c;QZ.ans[i]=ok;const b=$('#qz'+i).querySelectorAll('button');b[q.c].style.borderColor='var(--grn)';b[q.c].style.background='#24332a';if(!ok){b[j].style.borderColor='var(--red)';b[j].style.background='#4a1c18'}
 $('#qz'+i).querySelector('.qzw').innerHTML=`<div class="${ok?'tip':'warn'}" style="font-weight:400">${ok?'✅ Σωστό.':'❌ Όχι.'} ${esc(q.w||'')}</div>`;vib(ok?30:[60,40,60]);
 if(Object.keys(QZ.ans).length===x.q.length){const sc=Object.values(QZ.ans).filter(Boolean).length,Q=LS.g('quiz',{}),pr=Q[QZ.id]||{best:0};Q[QZ.id]={best:Math.max(pr.best,sc),last:sc,t:Date.now()};LS.s('quiz',Q);
  const pass=sc>=Math.ceil(x.q.length*2/3);$('#qzs').innerHTML=`<div class="res"><div class="v">${sc}/${x.q.length}</div><div>${pass?'🎉 Πέρασες!':'Ξαναδιάβασε και δοκίμασε πάλι.'}</div><button class="btn" onclick="acQuiz('${QZ.id}')">↻ Ξανά</button></div>`}}
function acIndex(){T('📑 '+L2('Ευρετήριο «Έξω από τους Τοίχους»','Index of “Outside the Walls”'));const C=ACD.coverage||[];
 M.innerHTML=`<div class="muted">${L2('Κάθε κεφάλαιο του βιβλίου «Έξω από τους Τοίχους» και σε ποιο μάθημα θα το βρεις.','Each chapter of “Outside the Walls” and the lesson where you will find it.')}</div>`+
 (C.length?C.map(c=>`<div class="box"><b>${esc(c[0])}</b><div class="muted" style="margin:4px 0">${esc(c[1])}</div>${(c[2]||[]).filter(id=>ABYID[id]).map(id=>`<button class="btn" style="margin:3px 3px 0 0" onclick="go('learn/${id}')">${ABYID[id].e||'📘'} ${esc(ABYID[id].n)}</button>`).join('')}</div>`).join(''):'<div class="note">Το ευρετήριο ετοιμάζεται.</div>')}

/* καθαρισμός προσπαθειών: όλη η Ακαδημία ή ένα μάθημα */
function acReset(id){const rd=LS.g('read',{}),Q=LS.g('quiz',{});
 if(id){if(!confirm(L2('Καθαρισμός αυτού του μαθήματος: σβήνει το «διάβασα» και το σκορ του quiz.','Reset this lesson: clears “read” and the quiz score.')))return;delete rd[id];delete Q[id];LS.s('read',rd);LS.s('quiz',Q);return lesson(id)}
 const n=Object.keys(rd).length+Object.keys(Q).length;if(!n)return alert(L2('Δεν υπάρχει πρόοδος για καθαρισμό.','No progress to reset.'));
 if(!confirm(L2('Καθαρισμός ΟΛΗΣ της προόδου της Ακαδημίας (διάβασα, quiz, 🏅);','Reset ALL Academy progress (read, quizzes, 🏅)?')))return;
 LS.s('acbak',{read:rd,quiz:Q,t:Date.now()});LS.s('read',{});LS.s('quiz',{});learn();
 setTimeout(()=>{if(confirm(L2('Έγινε καθαρισμός. Πάτα OK για να ΑΝΑΙΡΕΣΕΙΣ (επαναφορά), Άκυρο για να μείνει καθαρό.','Progress cleared. Press OK to UNDO (restore), Cancel to keep it clean.'))){const b=LS.g('acbak',null);if(b){LS.s('read',b.read);LS.s('quiz',b.quiz);learn()}}},300)}
