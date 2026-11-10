/* Overland’s Habit v0.40
   1) 🧰 Το γκαράζ μου #garage: ο εξοπλισμός που έχεις, με βάρος και θέση (μέσα / οροφή). Τα «📦 παίρνω» περνάνε
      με ένα κουμπί στο GVM (LS pl.items / pl.roof) και στο Βάρος οροφής (LS rf.roof). LS: ov_gar [{id,n,kg,q,w:'in'|'roof',on}].
   2) 🔧 Συντήρηση #maint: χιλιόμετρα, service intervals ανά όχημα, OK / σύντομα / εκπρόθεσμο. LS: ov_mt_<vehId> {odo,odoT,items:[{k,n,km,mo,lk,ld}]}.
   3) 📔 Ημερολόγιο εκδρομής #log: σημειώσεις, καύσιμο, διανυκτερεύσεις, φωτογραφίες (χαμηλή ανάλυση, IndexedDB ov_log),
      στίγμα GPS σε κάθε εγγραφή, κατανάλωση από τα γεμίσματα, GPX, PDF. LS: ov_logs [{id,n,d1,act,e:[…]}]. */

/* ===================== ΓΚΑΡΑΖ ===================== */
const GPRE=[[L2('Σκηνή οροφής hard shell','Hard shell rooftop tent'),65,'roof'],[L2('Σκηνή οροφής soft shell','Soft shell rooftop tent'),55,'roof'],[L2('Σχάρα πλατφόρμα','Platform roof rack'),33,'roof'],[L2('Τέντα πλαϊνή','Side awning'),20,'roof'],
 [L2('Traction boards (ζεύγος)','Traction boards (pair)'),8,'roof'],[L2('Μπιτόνι 20 L γεμάτο','Jerrycan 20 L full'),18,'roof'],[L2('Ψυγείο 40 L γεμάτο','Fridge 40 L full'),35,'in'],[L2('Power station 1 kWh','Power station 1 kWh'),12,'in'],
 [L2('2η μπαταρία LiFePO4 100 Ah','2nd battery LiFePO4 100 Ah'),12,'in'],[L2('Νερό 20 L','Water 20 L'),20,'in'],[L2('Recovery kit (ιμάντες, shackles)','Recovery kit (straps, shackles)'),25,'in'],[L2('Εργάτης','Winch'),35,'in'],
 [L2('Κουζίνα & γκαζάκι','Kitchen & stove'),15,'in'],[L2('Τραπέζι & καρέκλες','Table & chairs'),10,'in'],[L2('Εργαλεία & ανταλλακτικά','Tools & spares'),20,'in'],[L2('Φτυάρι','Shovel'),3,'in'],
 [L2('Σκηνή εδάφους','Ground tent'),8,'in'],[L2('Υπνόσακοι & στρώματα','Sleeping bags & mats'),12,'in'],[L2('Ρούχα','Clothes'),10,'in'],[L2('Συρτάρια','Drawer system'),45,'in'],[L2('Κομπρεσέρ','Compressor'),7,'in']];
function gar(){return LS.g('gar',[])||[]}
function garSv(L){LS.s('gar',L)}
function garTot(){const L=gar().filter(x=>x.on),s=w=>L.filter(x=>x.w===w).reduce((a,x)=>a+(+x.kg||0)*(+x.q||1),0);return{in:s('in'),roof:s('roof')}}
function garPage(){T('🧰 '+L2('Το γκαράζ μου','My garage'));const L=gar(),t=garTot();
 const row=x=>`<div class="wp" style="flex-wrap:wrap"><button class="btn ${x.on?'g':''}" style="min-width:44px" onclick="garTg('${x.id}')">${x.on?'📦':'▫️'}</button><input style="flex:3;margin:0;min-width:120px" value="${esc(x.n)}" onchange="garSet('${x.id}','n',this.value)">
 <input style="width:64px;margin:0" type="number" inputmode="decimal" value="${x.kg}" onchange="garSet('${x.id}','kg',n(this.value))"><span class="muted">kg ×</span><input style="width:46px;margin:0" type="number" inputmode="numeric" value="${x.q||1}" onchange="garSet('${x.id}','q',n(this.value)||1)">
 <button class="btn" onclick="garSet('${x.id}','w','${x.w==='roof'?'in':'roof'}')">${x.w==='roof'?'⬆️':'🚙'}</button><button class="btn" onclick="garDel('${x.id}')">🗑</button></div>`;
 M.innerHTML=`<div class="muted">${L2('Ό,τι εξοπλισμό έχεις, μία φορά. Πριν από κάθε εκδρομή πατάς 📦 σε ό,τι παίρνεις, και τα βάρη περνάνε στο GVM και στο Βάρος οροφής. ⬆️ = στην οροφή, 🚙 = μέσα ή πίσω.','All the gear you own, entered once. Before each trip tap 📦 on what you take, and the weights go to GVM and Roof load. ⬆️ = on the roof, 🚙 = inside or in the back.')}</div>
 <div class="res"><div class="grid"><div><div class="muted">🚙 ${L2('Μέσα','Inside')}</div><div class="v">${f0(t.in)} kg</div></div><div><div class="muted">⬆️ ${L2('Οροφή','Roof')}</div><div class="v">${f0(t.roof)} kg</div></div></div><div class="muted">${L2('μόνο όσα έχουν 📦','only items marked 📦')}</div></div>
 <div class="tools"><button class="btn p" onclick="garToPl()">⚖️ ${L2('Πέρασέ τα στο GVM','Send to GVM')}</button><button class="btn p" onclick="garToRf()">🏗️ ${L2('Πέρασε την οροφή στο Βάρος οροφής','Send roof to Roof load')}</button></div>
 <h3>⬆️ ${L2('Στην οροφή','On the roof')}</h3>${L.filter(x=>x.w==='roof').map(row).join('')||`<div class="muted">${L2('τίποτα','nothing')}</div>`}
 <h3>🚙 ${L2('Μέσα & πίσω','Inside & rear')}</h3>${L.filter(x=>x.w!=='roof').map(row).join('')||`<div class="muted">${L2('τίποτα','nothing')}</div>`}
 <div class="tools" style="margin-top:8px"><button class="btn" onclick="garAdd()">➕ ${L2('Δικό μου','My own')}</button><button class="btn" onclick="garAll(1)">📦 ${L2('Όλα','All')}</button><button class="btn" onclick="garAll(0)">▫️ ${L2('Κανένα','None')}</button></div>
 <h3>${L2('Γρήγορη προσθήκη (τυπικά βάρη)','Quick add (typical weights)')}</h3><div class="tools">${GPRE.map((p,i)=>`<button class="btn" onclick="garPre(${i})">${p[2]==='roof'?'⬆️':'🚙'} ${esc(p[0])} · ${p[1]}</button>`).join('')}</div>
 <div class="muted">${L2('Τα τυπικά βάρη είναι ενδεικτικά. Ζύγισε ό,τι μπορείς: η ζυγαριά μπάνιου αρκεί.','Typical weights are indicative. Weigh what you can: a bathroom scale will do.')}</div>`}
function garAdd(n0,kg,w){const L=gar();L.push({id:'g'+Date.now()+Math.floor(Math.random()*99),n:n0||L2('Νέο','New'),kg:kg||0,q:1,w:w||'in',on:1});garSv(L);garPage()}
function garPre(i){const p=GPRE[i];garAdd(p[0],p[1],p[2])}
function garSet(id,k,v){const L=gar(),x=L.find(z=>z.id===id);if(!x)return;x[k]=v;garSv(L);if(k!=='n')garPage()}
function garTg(id){const L=gar(),x=L.find(z=>z.id===id);if(x){x.on=x.on?0:1;garSv(L);garPage()}}
function garDel(id){garSv(gar().filter(x=>x.id!==id));garPage()}
function garAll(on){garSv(gar().map(x=>Object.assign(x,{on})));garPage()}
function garToPl(){const L=gar().filter(x=>x.on);if(!L.length)return alert(L2('Πάτα 📦 σε ό,τι παίρνεις.','Tap 📦 on what you take.'));const st=LS.g('pl',null);if(!st){go('t/payload');setTimeout(garToPl,400);return}
 st.items=L.filter(x=>x.w!=='roof').map(x=>[x.n+(x.q>1?' ×'+x.q:''),(+x.kg||0)*(+x.q||1)]);st.roof=L.filter(x=>x.w==='roof').map(x=>[x.n+(x.q>1?' ×'+x.q:''),(+x.kg||0)*(+x.q||1)]);LS.s('pl',st);go('t/payload')}
function garToRf(){const t=garTot(),st=(typeof rfSt==='function')?rfSt():(LS.g('rf',{})||{});st.roof=t.roof;LS.s('rf',st);go('t/roof')}

/* ===================== ΣΥΝΤΗΡΗΣΗ ===================== */
const MTD=[['oil',L2('Λάδι μηχανής & φίλτρο','Engine oil & filter'),10000,12],['air',L2('Φίλτρο αέρα','Air filter'),20000,24],['fuelf',L2('Φίλτρο καυσίμου','Fuel filter'),20000,24],
 ['diff',L2('Λάδια διαφορικών (και μετά από βαθύ νερό)','Diff oils (and after deep water)'),40000,24],['tc',L2('Λάδι κιβωτίου μεταφοράς','Transfer case oil'),40000,24],['gb',L2('Λάδι κιβωτίου ταχυτήτων','Gearbox oil'),60000,48],
 ['grease',L2('Γρασάρισμα σταυρών & αξόνων','Grease UJs & shafts'),5000,6],['brake',L2('Υγρά φρένων','Brake fluid'),0,24],['cool',L2('Αντιψυκτικό','Coolant'),0,48],['rot',L2('Περιστροφή ελαστικών','Tyre rotation'),10000,0],
 ['winch',L2('Εργάτης: συρματόσχοινο/σχοινί, λειτουργία','Winch: rope/cable, operation'),0,6],['ktec',L2('ΚΤΕΟ','Roadworthiness test (KTEO)'),0,24],['ins',L2('Ασφάλεια οχήματος','Vehicle insurance'),0,12]];
function mtK(){const v=veh();return 'mt_'+(v?v.id:'none')}
function mtG(){const s=LS.g(mtK(),null)||{odo:0,odoT:0,items:[]};MTD.forEach(([k,nm,km,mo])=>{if(!s.items.find(x=>x.k===k))s.items.push({k,n:nm,km,mo,lk:'',ld:''})});return s}
function mtSt(x,s){let p=0;const r=[];
 if(x.km&&x.lk!==''&&s.odo){const u=(s.odo-x.lk)/x.km;p=Math.max(p,u);r.push(`${f0(Math.max(0,x.lk+x.km-s.odo))} km`)}
 if(x.mo&&x.ld){const d=(Date.now()-new Date(x.ld))/(x.mo*30.44*864e5);p=Math.max(p,d);const left=Math.round((new Date(x.ld).getTime()+x.mo*30.44*864e5-Date.now())/864e5);r.push(left>=0?`${left} ${L2('μέρες','days')}`:`${-left} ${L2('μέρες πριν','days ago')}`)}
 if(x.lk===''&&!x.ld)return{c:'mid',e:'❔',t:L2('δεν έχει μπει','not set'),p:0};
 return p>=1?{c:'bad',e:'🔴',t:L2('ΕΚΠΡΟΘΕΣΜΟ','OVERDUE')+' · '+r.join(' / '),p}:p>=.85?{c:'mid',e:'🟡',t:L2('σύντομα','soon')+' · '+r.join(' / '),p}:{c:'ok',e:'🟢',t:L2('μένουν','left')+' '+r.join(' / '),p}}
function mtDue(){const v=veh();if(!v)return 0;const s=mtG();return s.items.filter(x=>mtSt(x,s).p>=.85).length}
function mtRow(){const v=veh();if(!v)return'';const d=mtDue();return`<button class="row" onclick="go('maint')" ${d?'style="border-color:var(--yel)"':''}><span class="e">🔧</span><span><b>${L2('Συντήρηση','Maintenance')}: ${esc(v.name||v.model)}</b><small>${d?'🟡 '+d+' '+L2('θέλουν προσοχή','need attention'):L2('service, λάδια, φίλτρα, ΚΤΕΟ, ασφάλεια','service, oils, filters, KTEO, insurance')}</small></span></button>`}
function maintPage(){T('🔧 '+L2('Συντήρηση','Maintenance'));const v=veh();if(!v){M.innerHTML=vehBar();return}const s=mtG();LS.s(mtK(),s);
 const L=s.items.map((x,i)=>({x,i,st:mtSt(x,s)})).sort((a,b)=>b.st.p-a.st.p);
 M.innerHTML=vehBar()+`<div class="box"><label>${L2('Χιλιόμετρα τώρα (οδόμετρο)','Odometer now (km)')}</label><div class="tools" style="align-items:center"><input id="mto" type="number" inputmode="numeric" value="${s.odo||''}" style="flex:1;margin:0"><button class="btn p" onclick="mtOdo()">💾</button></div>
 <div class="muted">${s.odoT?L2('ενημερώθηκε ','updated ')+new Date(s.odoT).toLocaleDateString(LOC):L2('γράψ\' τα για να υπολογίζονται τα km','enter them so km can be calculated')}</div></div>`+
 L.map(({x,i,st})=>`<div class="box" style="padding:10px 12px"><div style="display:flex;gap:8px;align-items:center"><span>${st.e}</span><b style="flex:1">${esc(x.n)}</b><button class="btn g" onclick="mtDone(${i})">✅ ${L2('Έγινε','Done')}</button></div>
 <div class="${st.c}" style="font-size:.88em;margin:4px 0">${st.t}</div>
 <details><summary class="muted">${L2('τελευταία φορά & διάστημα','last time & interval')}${x.lk!==''||x.ld?': '+[x.lk!==''?f0(x.lk)+' km':'',x.ld?new Date(x.ld).toLocaleDateString(LOC):''].filter(Boolean).join(' · '):''}</summary>
 <div class="grid"><div><label>${L2('Τελευταία (km)','Last (km)')}</label><input type="number" inputmode="numeric" value="${x.lk}" onchange="mtSet(${i},'lk',this.value===''?'':n(this.value))"></div><div><label>${L2('Τελευταία (ημερομηνία)','Last (date)')}</label><input type="date" value="${x.ld||''}" onchange="mtSet(${i},'ld',this.value)"></div>
 <div><label>${L2('Κάθε (km, 0 = όχι)','Every (km, 0 = no)')}</label><input type="number" inputmode="numeric" value="${x.km}" onchange="mtSet(${i},'km',n(this.value))"></div><div><label>${L2('Κάθε (μήνες, 0 = όχι)','Every (months, 0 = no)')}</label><input type="number" inputmode="numeric" value="${x.mo}" onchange="mtSet(${i},'mo',n(this.value))"></div></div>
 ${x.custom?`<button class="btn" onclick="mtDel(${i})">🗑</button>`:''}</details></div>`).join('')+
 `<div class="tools"><button class="btn" onclick="mtAdd()">➕ ${L2('Δικό μου','My own')}</button><button class="btn" onclick="mtShare()">📤 ${L2('Στείλε στο συνεργείο','Send to the garage')}</button></div>
 <div class="note" style="font-weight:400">${L2('Τα διαστήματα είναι ενδεικτικά για χρήση εκτός δρόμου. Ακολούθησε το εγχειρίδιο του αυτοκινήτου σου: σε σκόνη, νερό και ρυμούλκηση ισχύει το «βαρύ» πρόγραμμα (severe service).','Intervals are indicative for off-road use. Follow your vehicle\'s manual: dust, water and towing call for the severe service schedule.')}</div>`}
function mtOdo(){const s=mtG();s.odo=n($('#mto').value);s.odoT=Date.now();LS.s(mtK(),s);maintPage()}
function mtSet(i,k,v){const s=mtG();s.items[i][k]=v;LS.s(mtK(),s);maintPage()}
function mtDone(i){const s=mtG(),x=s.items[i];let km=s.odo;const a=prompt(L2(`«${x.n}»: σε πόσα km έγινε;`,`«${x.n}»: at what km?`),km||'');if(a===null)return;x.lk=a===''?'':n(a);if(x.lk!==''&&x.lk>s.odo){s.odo=x.lk;s.odoT=Date.now()}x.ld=new Date().toISOString().slice(0,10);LS.s(mtK(),s);maintPage()}
function mtAdd(){const nm=prompt(L2('Τι; (π.χ. Ιμάντας χρονισμού)','What? (e.g. Timing belt)'));if(!nm)return;const s=mtG();s.items.push({k:'c'+Date.now(),n:nm,km:0,mo:12,lk:'',ld:'',custom:1});LS.s(mtK(),s);maintPage()}
function mtDel(i){const s=mtG();s.items.splice(i,1);LS.s(mtK(),s);maintPage()}
function mtShare(){const v=veh(),s=mtG();const t=`🔧 ${v.name||v.model} ${v.model&&v.name?'('+v.model+')':''}\n${L2('Χιλιόμετρα','Odometer')}: ${f0(s.odo)} km\n\n`+s.items.map(x=>{const st=mtSt(x,s);return`${st.e} ${x.n}: ${st.t}`}).join('\n');
 if(navigator.share)navigator.share({text:t}).catch(()=>{});else(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert(L2('Αντιγράφηκε.','Copied.')),()=>{})}

/* ===================== ΗΜΕΡΟΛΟΓΙΟ ΕΚΔΡΟΜΗΣ ===================== */
const LDB={db:null,open(){return this.db?Promise.resolve(this.db):new Promise((ok,no)=>{const r=indexedDB.open('ov_log',1);r.onupgradeneeded=()=>{r.result.createObjectStore('ph',{keyPath:'id'})};r.onsuccess=()=>{this.db=r.result;ok(this.db)};r.onerror=()=>no(r.error)})},
 tx(m,f){return this.open().then(d=>new Promise((ok,no)=>{const t=d.transaction('ph',m),q=f(t.objectStore('ph'));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error)}))},
 get(id){return this.tx('readonly',s=>s.get(id))},put(v){return this.tx('readwrite',s=>s.put(v))},del(id){return this.tx('readwrite',s=>s.delete(id))},all(){return this.tx('readonly',s=>s.getAll())}};
const LTY={note:['📝',L2('Σημείωση','Note')],fuel:['⛽',L2('Καύσιμο','Fuel')],camp:['⛺',L2('Διανυκτέρευση','Night camp')],photo:['📷',L2('Φωτογραφία','Photo')],pin:['📍',L2('Στίγμα','Pin')]};
function logs(){return LS.g('logs',[])||[]}
function logSv(L){LS.s('logs',L)}
function logAct(){return logs().find(x=>x.act)||null}
function logRow(){const a=logAct();return`<button class="row" onclick="go('log')" ${a?'style="border-color:var(--grn)"':''}><span class="e">📔</span><span><b>${L2('Ημερολόγιο εκδρομής','Trip log')}${a?': '+esc(a.n):''}</b><small>${a?'🟢 '+a.e.length+' '+L2('εγγραφές · πάτα για νέα','entries · tap to add'):L2('σημειώσεις, καύσιμο, διανυκτερεύσεις, φωτογραφίες, με στίγμα','notes, fuel, camps, photos, with position')}</small></span></button>`}
function logPage(id){if(id)return logTrip(id);T('📔 '+L2('Ημερολόγιο εκδρομής','Trip log'));const L=logs();
 M.innerHTML=`<button class="big org" onclick="logNew()">🆕 ${L2('Νέα εκδρομή','New trip')}</button>`+
 (L.length?L.slice().reverse().map(x=>`<button class="row" onclick="go('log/${x.id}')" ${x.act?'style="border-color:var(--grn)"':''}><span class="e">${x.act?'🟢':'📔'}</span><span><b>${esc(x.n)}</b><small>${new Date(x.d1).toLocaleDateString(LOC)} · ${x.e.length} ${L2('εγγραφές','entries')}</small></span></button>`).join(''):`<div class="muted">${L2('Κάθε εκδρομή σε ένα ημερολόγιο: τι είδες, πού κοιμήθηκες, πόσο έβαλες καύσιμο. Κάθε εγγραφή κρατάει και το στίγμα GPS.','Each trip in one log: what you saw, where you slept, how much fuel you put in. Every entry also keeps the GPS position.')}</div>`)}
function logNew(){const tp=(LS.g('fplan',null)||{}).name||(LS.g('trip',{})||{}).n||'';const nm=prompt(L2('Όνομα εκδρομής:','Trip name:'),tp||L2('Εκδρομή ','Trip ')+new Date().toLocaleDateString(LOC));if(!nm)return;
 const L=logs().map(x=>Object.assign(x,{act:0}));const id='l'+Date.now();L.push({id,n:nm,d1:Date.now(),act:1,e:[]});logSv(L);go('log/'+id)}
function logTrip(id){const L=logs(),x=L.find(z=>z.id===id);if(!x)return logPage();T('📔 '+x.n);startGeo();const sm=logSum(x);
 M.innerHTML=`<div class="g3">${['note','fuel','camp','photo','pin'].map(k=>`<button class="tile" onclick="logAdd('${id}','${k}')"><span class="e">${LTY[k][0]}</span>${LTY[k][1]}</button>`).join('')}<button class="tile" onclick="go('drive')"><span class="e">🚗</span>${L2('Οδήγηση','Driving')}</button></div>
 <input id="lgph" type="file" accept="image/*" capture="environment" style="display:none" onchange="logPhoto('${id}',this.files[0])">
 <div class="box"><div class="kv"><span>📅 ${L2('Μέρες','Days')}</span><b>${sm.days}</b><span>⛺ ${L2('Νύχτες','Nights')}</span><b>${sm.camps}</b><span>⛽ ${L2('Καύσιμο','Fuel')}</span><b>${f1(sm.L)} L · ${f0(sm.eur)} €</b>${sm.cons?`<span>📉 ${L2('Κατανάλωση','Consumption')}</span><b>${f1(sm.cons)} L/100km</b>`:''}${sm.km?`<span>🛣️ ${L2('Χιλιόμετρα (οδόμετρο)','Distance (odometer)')}</span><b>${f0(sm.km)} km</b>`:''}</div>
 ${sm.cons?`<button class="btn" style="margin-top:6px" onclick="logCons(${sm.cons.toFixed(1)})">🚙 ${L2('Βάλε την κατανάλωση στο όχημα','Save consumption to vehicle')}</button>`:`<div class="muted" style="margin-top:4px">${L2('Η κατανάλωση βγαίνει όταν γεμίζεις φουλ και γράφεις τα km του οδομέτρου.','Consumption appears when you fill to full and enter the odometer km.')}</div>`}</div>
 <div id="lge">${x.e.slice().reverse().map(e=>logE(id,e)).join('')||`<div class="muted">${L2('Καμία εγγραφή ακόμα. Πάτα ένα κουμπί πάνω.','No entries yet. Tap a button above.')}</div>`}</div>
 <div class="tools" style="margin-top:10px"><button class="btn" onclick="logGpx('${id}')">🛣️ GPX</button><button class="btn" onclick="logPrint('${id}')">🖨️ PDF</button><button class="btn" onclick="logShare('${id}')">📤 ${L2('Κείμενο','Text')}</button>
 ${x.act?`<button class="btn" onclick="logEnd('${id}')">🏁 ${L2('Τέλος εκδρομής','End trip')}</button>`:`<button class="btn" onclick="logEnd('${id}',1)">🟢 ${L2('Ενεργή','Make active')}</button>`}<button class="btn r" onclick="logDelT('${id}')">🗑</button></div>`;
 x.e.filter(e=>e.ph).forEach(e=>LDB.get(e.ph).then(p=>{const im=document.getElementById('im_'+e.ph);if(p&&im)im.src=p.d}).catch(()=>{}))}
function logE(id,e){const ty=LTY[e.k]||LTY.note,d=new Date(e.t);
 return`<div class="box" style="padding:10px 12px"><div style="display:flex;gap:8px;align-items:center"><span style="font-size:1.3em">${ty[0]}</span><b style="flex:1">${ty[1]}${e.r?' '+'⭐'.repeat(e.r):''}</b><small class="muted">${d.toLocaleDateString(LOC,{day:'numeric',month:'numeric'})} ${d.toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false})}</small><button class="btn" style="padding:4px 8px" onclick="logDelE('${id}','${e.id}')">🗑</button></div>
 ${e.k==='fuel'?`<div>${f1(e.L||0)} L${e.eur?' · '+f1(e.eur)+' €':''}${e.odo?' · '+f0(e.odo)+' km':''}${e.full?' · '+L2('φουλ','full'):''}</div>`:''}
 ${e.tx?`<div style="white-space:pre-wrap">${esc(e.tx)}</div>`:''}${e.ph?`<img id="im_${e.ph}" style="width:100%;border-radius:10px;margin-top:6px" alt="">`:''}
 ${e.lat!=null?`<div class="muted mono" style="font-size:.8em">📍 ${e.lat.toFixed(5)}, ${e.lon.toFixed(5)}${e.alt!=null?' · '+Math.round(e.alt)+' m':''} <a style="color:var(--yel)" href="https://maps.google.com/?q=${e.lat.toFixed(5)},${e.lon.toFixed(5)}" target="_blank">↗</a></div>`:''}</div>`}
function logPos(){return pos&&Date.now()-pos.t<120000?{lat:+pos.lat.toFixed(6),lon:+pos.lon.toFixed(6),alt:pos.alt!=null?Math.round(pos.alt):null}:{}}
function logPush(id,e){const L=logs(),x=L.find(z=>z.id===id);if(!x)return;x.e.push(Object.assign({id:'e'+Date.now()+Math.floor(Math.random()*99),t:Date.now()},logPos(),e));logSv(L);vib(80);logTrip(id)}
function logAdd(id,k){
 if(k==='photo')return $('#lgph').click();
 if(k==='pin')return logPush(id,{k,tx:prompt(L2('Σημείωση για το στίγμα (προαιρετικό):','Note for the pin (optional):'))||''});
 if(k==='note'){const t=prompt(L2('Σημείωση:','Note:'));if(t)logPush(id,{k,tx:t});return}
 if(k==='camp'){const t=prompt(L2('Πού κοιμηθήκατε; (όνομα, πώς ήταν)','Where did you sleep? (name, what it was like)'));if(t===null)return;const r=n(prompt(L2('Βαθμός 1 έως 5:','Rating 1 to 5:'),'4'))||0;logPush(id,{k,tx:t,r:Math.max(0,Math.min(5,Math.round(r)))});return}
 if(k==='fuel'){const Lt=prompt(L2('Λίτρα:','Litres:'));if(!Lt)return;const eur=prompt(L2('Ευρώ (σύνολο):','Euros (total):'),'')||'';const odo=prompt(L2('Οδόμετρο (km), για κατανάλωση:','Odometer (km), for consumption:'),'')||'';const full=confirm(L2('Γέμισες φουλ;','Filled to full?'));
  logPush(id,{k,L:n(Lt),eur:n(eur),odo:n(odo)||0,full:full?1:0});if(n(odo)){const v=veh();if(v){const s=mtG();if(n(odo)>s.odo){s.odo=n(odo);s.odoT=Date.now();LS.s(mtK(),s)}}}}}
function logPhoto(id,f){if(!f)return;const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const W=900,sc=Math.min(1,W/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
 const d=c.toDataURL('image/jpeg',0.6),pid='p'+Date.now();LDB.put({id:pid,d}).then(()=>{const t=prompt(L2('Λεζάντα (προαιρετικό):','Caption (optional):'))||'';logPush(id,{k:'photo',ph:pid,tx:t})}).catch(()=>alert(L2('Η φωτογραφία δεν σώθηκε.','The photo was not saved.')))};im.src=u}
function logSum(x){const E=x.e,days=E.length?Math.max(1,Math.ceil((Math.max(...E.map(e=>e.t))-x.d1)/864e5)):1,F=E.filter(e=>e.k==='fuel');
 let cons=0;const fo=F.filter(e=>e.full&&e.odo).sort((a,b)=>a.odo-b.odo);if(fo.length>=2){const a=fo[0],b=fo[fo.length-1],Lb=F.filter(e=>e.t>a.t&&e.t<=b.t).reduce((s,e)=>s+(e.L||0),0);if(b.odo>a.odo)cons=Lb/(b.odo-a.odo)*100}
 const od=F.filter(e=>e.odo).map(e=>e.odo);return{days,camps:E.filter(e=>e.k==='camp').length,L:F.reduce((s,e)=>s+(e.L||0),0),eur:F.reduce((s,e)=>s+(e.eur||0),0),cons,km:od.length>1?Math.max(...od)-Math.min(...od):0}}
function logCons(c){const L=vehs(),v=veh();if(!v)return alert(L2('Δεν υπάρχει όχημα.','No vehicle.'));const x=L.find(z=>z.id===v.id);x.co=c;LS.s('vehs',L);alert(L2(`Κατανάλωση εκτός δρόμου του οχήματος: ${c} L/100km.`,`Vehicle off-road consumption: ${c} L/100km.`))}
function logDelE(id,eid){if(!confirm(L2('Να σβηστεί η εγγραφή;','Delete this entry?')))return;const L=logs(),x=L.find(z=>z.id===id),e=x.e.find(z=>z.id===eid);if(e&&e.ph)LDB.del(e.ph).catch(()=>{});x.e=x.e.filter(z=>z.id!==eid);logSv(L);logTrip(id)}
function logDelT(id){if(!confirm(L2('Να σβηστεί όλο το ημερολόγιο αυτής της εκδρομής;','Delete this whole trip log?')))return;const L=logs(),x=L.find(z=>z.id===id);(x?x.e:[]).forEach(e=>{if(e.ph)LDB.del(e.ph).catch(()=>{})});logSv(L.filter(z=>z.id!==id));go('log')}
function logEnd(id,on){const L=logs().map(z=>Object.assign(z,{act:on&&z.id===id?1:0}));logSv(L);logTrip(id)}
function logTxt(x){const sm=logSum(x);return`📔 ${x.n}\n${new Date(x.d1).toLocaleDateString(LOC)} · ${sm.days} ${L2('μέρες','days')} · ${sm.camps} ${L2('νύχτες','nights')} · ⛽ ${f1(sm.L)} L${sm.cons?' · '+f1(sm.cons)+' L/100km':''}\n\n`+
 x.e.map(e=>{const d=new Date(e.t);return`${LTY[e.k][0]} ${d.toLocaleDateString(LOC,{day:'numeric',month:'numeric'})} ${d.toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false})}${e.k==='fuel'?' '+f1(e.L)+' L':''}${e.r?' '+'⭐'.repeat(e.r):''} ${e.tx||''}${e.lat!=null?` (${e.lat.toFixed(5)}, ${e.lon.toFixed(5)})`:''}`}).join('\n')+'\n\nOverland’s Habit · Adventure Is a Habit.'}
function logShare(id){const x=logs().find(z=>z.id===id),t=logTxt(x);if(navigator.share)navigator.share({text:t}).catch(()=>{});else(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert(L2('Αντιγράφηκε.','Copied.')),()=>{})}
function logGpx(id){const x=logs().find(z=>z.id===id),P=x.e.filter(e=>e.lat!=null);if(!P.length)return alert(L2('Καμία εγγραφή με στίγμα.','No entries with a position.'));
 const xe=s=>String(s||'').replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
 const g=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Overland’s Habit" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>${xe(x.n)}</name></metadata>\n`+P.map(e=>`<wpt lat="${e.lat}" lon="${e.lon}">${e.alt!=null?`<ele>${e.alt}</ele>`:''}<time>${new Date(e.t).toISOString()}</time><name>${xe(LTY[e.k][1]+(e.tx?': '+e.tx.slice(0,40):''))}</name><desc>${xe(e.tx)}</desc></wpt>`).join('\n')+`\n<trk><name>${xe(x.n)}</name><trkseg>${P.map(e=>`<trkpt lat="${e.lat}" lon="${e.lon}"><time>${new Date(e.t).toISOString()}</time></trkpt>`).join('')}</trkseg></trk></gpx>`;
 const f=new File([g],(x.n.replace(/[^\p{L}\p{N}]+/gu,'_')||'trip')+'.gpx',{type:'application/gpx+xml'});
 if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f]}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),1000)}}
async function logPrint(id){const x=logs().find(z=>z.id===id),sm=logSum(x);const ph={};for(const e of x.e)if(e.ph){try{const p=await LDB.get(e.ph);if(p)ph[e.ph]=p.d}catch(er){}}
 const w=window.open('','_blank');if(!w)return alert(L2('Επέτρεψε τα αναδυόμενα παράθυρα.','Allow pop-ups.'));
 w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(x.n)}</title><style>body{font-family:-apple-system,Arial,sans-serif;max-width:720px;margin:20px auto;padding:0 14px;color:#1f1e1d}h1{color:#d97757;margin:0}.e{border-bottom:1px solid #ddd;padding:10px 0;break-inside:avoid}.m{color:#777;font-size:.85em}img{max-width:100%;max-height:420px;border-radius:8px;margin-top:6px}</style></head><body>
 <h1>📔 ${esc(x.n)}</h1><div class="m">${new Date(x.d1).toLocaleDateString(LOC)} · ${sm.days} ${L2('μέρες','days')} · ${sm.camps} ${L2('νύχτες','nights')} · ⛽ ${f1(sm.L)} L · ${f0(sm.eur)} €${sm.cons?' · '+f1(sm.cons)+' L/100km':''}</div>
 ${x.e.map(e=>{const d=new Date(e.t);return`<div class="e"><b>${LTY[e.k][0]} ${LTY[e.k][1]}</b>${e.r?' '+'⭐'.repeat(e.r):''} <span class="m">${d.toLocaleString(LOC,{hour12:false})}</span>${e.k==='fuel'?`<div>${f1(e.L)} L${e.eur?' · '+f1(e.eur)+' €':''}${e.odo?' · '+f0(e.odo)+' km':''}</div>`:''}${e.tx?`<div>${esc(e.tx)}</div>`:''}${e.ph&&ph[e.ph]?`<img src="${ph[e.ph]}">`:''}${e.lat!=null?`<div class="m">📍 ${e.lat.toFixed(5)}, ${e.lon.toFixed(5)}${e.alt!=null?' · '+e.alt+' m':''}</div>`:''}</div>`}).join('')}
 <p class="m" style="text-align:center;margin-top:20px">OVERLAND’S HABIT · <i>Adventure Is a Habit.</i></p><script>setTimeout(()=>print(),600)<\/script></body></html>`);w.document.close()}
