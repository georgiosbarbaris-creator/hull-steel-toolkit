/* ===== Overland Habit — Φάση 4: Ράλι Tripmaster & Roadbook ===== */
const RLD={tot:0,par:0,fac:1,run:0,dir:1,v:40,stT:0,stD:0,box:0,beep:1,big:0};
const RL=()=>Object.assign({},RLD,LS.g('rl',{}));
let RT={w:null,last:null,spd:0,cap:null,save:0,ticker:null,warned:-1};
function rlSave(s){LS.s('rl',s)}
function rlStart(){const s=RL();if(RT.w!==null)return;if(!navigator.geolocation)return alert('Δεν υπάρχει GPS.');s.run=1;rlSave(s);wake(1);RT.last=null;
 RT.w=navigator.geolocation.watchPosition(rlFix,()=>{},{enableHighAccuracy:true,maximumAge:0,timeout:30000});if(!RT.ticker)RT.ticker=setInterval(rlShow,500)}
function rlPause(){if(RT.w!==null)navigator.geolocation.clearWatch(RT.w);RT.w=null;const s=RL();s.run=0;rlSave(s);rlShow()}
function rlFix(p){const c=p.coords,f={lat:c.latitude,lon:c.longitude,acc:c.accuracy,t:p.timestamp};RT.spd=c.speed!=null&&c.speed>=0?c.speed*3.6:RT.spd;if(c.heading!=null&&!isNaN(c.heading)&&RT.spd>3)RT.cap=c.heading;
 if(f.acc>35){return}const L=RT.last;if(!L){RT.last=f;return}const d=dist(L,f),dt=Math.max(.2,(f.t-L.t)/1000),v=d/dt*3.6;
 if(v>250){RT.last=f;return}
 if(d<Math.max(3,f.acc*.25)&&(c.speed==null||c.speed<0.8))return;
 if(c.speed==null)RT.spd=v;if(RT.cap==null||RT.spd>3){if(d>8)RT.cap=brg(L,f)}
 const s=RL(),k=d/1000*s.fac;s.tot=Math.max(0,s.tot+k*s.dir);s.par=Math.max(0,s.par+k*s.dir);RT.last=f;
 if(Date.now()-RT.save>2000){RT.save=Date.now();rlSave(s)}else LS.s('rl',s);rlBoxCheck(s)}
function rlAdj(k,m){const s=RL();s[k]=Math.max(0,s[k]+m/1000);rlSave(s);vib(30);rlShow()}
function rlResetPar(){const s=RL();s.par=0;rlSave(s);vib([40,40,40]);rlShow()}
function rlStage(){const s=RL();s.stT=Date.now();s.stD=s.tot;rlSave(s);vib(80);rlShow()}
function rlStageOff(){const s=RL();s.stT=0;rlSave(s);rlShow()}
function rlRB(){return LS.g('rlrb',[])}
function rlBoxCheck(s){const B=rlRB();if(!B.length)return;let i=s.box||0;while(i<B.length-1&&s.tot>=B[i].d-0.005)i++;if(i!==s.box){s.box=i;rlSave(s)}
 const nx=B[i],to=nx?nx.d-s.tot:null;if(to!=null&&to<=0.1&&to>0&&RT.warned!==i){RT.warned=i;if(s.beep)try{beep(1200,150,1,'square');setTimeout(()=>beep(1200,150,1,'square'),220)}catch(e){}vib([100,60,100])}}
const RSYM=['⬆️','↗️','➡️','↘️','⤵️','↙️','⬅️','↖️','🔄','🔀','⚠️','❗','‼️','⛽','🏁','🚩','🅿️','🌊','⛰️','🌉','🏘️','🛑','🚧','✳️'];
const fk=x=>x.toFixed(2).replace('.',',');
function rally(sub){if(sub==='rb')return rlRBPage();if(sub==='set')return rlSet();T('🏁 Tripmaster');const s=RL();
 M.innerHTML=`<style>
 .rlg{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rlc{background:#141312;border:1px solid var(--line);border-radius:14px;padding:8px;text-align:center}
 .rlc .k{color:var(--mut);font-size:.72em;font-weight:700;letter-spacing:.5px}.rlc .n{font-weight:900;font-variant-numeric:tabular-nums;line-height:1.05;font-family:ui-monospace,Menlo,monospace}
 .rlbig .n{font-size:3.3em}.rlmid .n{font-size:2em}.rlb{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.rlb button{font-size:1.05em;padding:14px 4px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--tx);font-weight:900}
 @media (orientation:landscape){.rlg{grid-template-columns:1.2fr 1.2fr 1fr 1fr}.rlbig{grid-row:span 2}.rlbig .n{font-size:4.6em}.rlmid .n{font-size:1.7em}}
 </style>
 <div class="rlg"><div class="rlc rlbig" style="grid-column:span 2"><div class="k">PARTIAL km</div><div class="n" id="rpar" style="color:var(--yel)">—</div></div>
 <div class="rlc rlmid"><div class="k">TOTAL km</div><div class="n" id="rtot">—</div></div><div class="rlc rlmid"><div class="k">ΤΑΧΥΤΗΤΑ km/h</div><div class="n" id="rspd">—</div></div>
 <div class="rlc rlmid"><div class="k">CAP</div><div class="n" id="rcap">—</div></div><div class="rlc rlmid"><div class="k">ΜΕΣΗ km/h</div><div class="n" id="ravg">—</div></div></div>
 <div class="rlc" id="rreg" style="margin-top:8px"></div><div class="rlc" id="rbox" style="margin-top:8px"></div>
 <div class="rlb"><button onclick="rlAdj('par',-100)">−100</button><button onclick="rlAdj('par',-10)">−10 m</button><button onclick="rlAdj('par',10)">+10 m</button><button onclick="rlAdj('par',100)">+100</button></div>
 <div class="rlb"><button style="grid-column:span 2;background:var(--org);color:#fff" onclick="rlResetPar()">⟲ PARTIAL 0</button><button onclick="rlDir()" id="rdir">${s.dir>0?'▲ +':'▼ −'}</button><button id="rrun" onclick="RT.w!==null?rlPause():rlStart();rally()">${RT.w!==null?'⏸':'▶'}</button></div>
 <div class="tools" style="margin-top:10px"><button class="btn" onclick="go('rally/rb')">📒 Roadbook</button><button class="btn" onclick="go('rally/set')">⚙️ Calibration & ρυθμίσεις</button><button class="btn" onclick="tNight();go('rally')">🌙</button></div>
 <div class="muted">Bluetooth χειριστήριο (σαν πληκτρολόγιο): ↑/PgUp +10 m · ↓/PgDn −10 m · Enter/Space = Partial 0 · → / ← επόμενο/προηγούμενο κουτί. Γύρνα το κινητό οριζόντια για μεγαλύτερα ψηφία.</div>`;
 if(s.run&&RT.w===null)rlStart();if(!RT.ticker)RT.ticker=setInterval(rlShow,500);wake(1);rlShow()}
function rlDir(){const s=RL();s.dir=-s.dir;rlSave(s);$('#rdir').textContent=s.dir>0?'▲ +':'▼ −'}
function rlShow(){const e=$('#rpar');if(!e)return;const s=RL(),B=rlRB();e.textContent=fk(s.par);$('#rtot').textContent=fk(s.tot);$('#rspd').textContent=RT.w!==null?Math.round(RT.spd||0):'—';
 $('#rcap').textContent=RT.cap!=null?String(Math.round(RT.cap)).padStart(3,'0')+'°':'—';
 const el=s.stT?(Date.now()-s.stT)/1000:0,dd=s.tot-s.stD;$('#ravg').textContent=s.stT&&el>5?Math.round(dd/el*3600):'—';
 const r=$('#rreg');if(s.stT){const ideal=s.v*el/3600,dt=(dd-ideal)/s.v*3600,a=Math.abs(dt),hh=Math.floor(el/3600),mm=Math.floor(el/60)%60,ss=Math.floor(el%60);
  r.innerHTML=`<div class="k">REGULARITY · στόχος ${s.v} km/h · χρόνος ${hh?hh+':':''}${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}</div><div class="n" style="font-size:2.4em;color:${a<2?'#8fd19e':dt>0?'#e8b86d':'#ff8a7a'}">${a<1?'✓ 0':(dt>0?'+':'−')+(a>=60?Math.floor(a/60)+'′'+String(Math.round(a%60)).padStart(2,'0'):Math.round(a))+'″'}</div><div class="muted">${a<1?'στον χρόνο':dt>0?'ΜΠΡΟΣΤΑ — κόψε':'ΠΙΣΩ — πάτα'} · ιδανικά ${fk(ideal)} km</div><button class="btn" onclick="rlStageOff()">⏹ Τέλος ειδικής</button>`}
 else r.innerHTML=`<div class="k">REGULARITY</div><div class="tools" style="justify-content:center;margin:4px 0"><input type="number" inputmode="numeric" value="${s.v}" style="width:90px;margin:0" onchange="const s=RL();s.v=Math.max(1,n(this.value));rlSave(s)"> km/h <button class="btn p" onclick="rlStage()">▶ Έναρξη ειδικής</button></div>`;
 const b=$('#rbox');if(!B.length){b.innerHTML='<div class="muted">Χωρίς roadbook — πρόσθεσε κουτιά από το 📒</div>';return}
 const i=Math.min(s.box||0,B.length-1),c=B[i],nx=B[i+1],to=c.d-s.tot;
 b.innerHTML=`<div class="k">ΚΟΥΤΙ ${i+1}/${B.length}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center"><span style="font-size:3em">${c.s||'⬆️'}</span><div style="text-align:left"><div class="n" style="font-size:1.8em;color:${to<0.1?'#ff8a7a':'var(--tx)'}">${to>0?fk(to):'0,00'} <small style="font-size:.5em">km</small></div><div class="muted">στα ${fk(c.d)}${c.cap!=null&&c.cap!==''?' · CAP '+c.cap+'°':''}</div></div></div>${c.t?`<div style="font-weight:700">${esc(c.t)}</div>`:''}${nx?`<div class="muted">μετά: ${nx.s||''} ${fk(nx.d)}${nx.t?' · '+esc(nx.t):''}</div>`:''}`}
function rlKey(e){if(!location.hash.startsWith('#rally')||location.hash.includes('/')||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||''))return;const k=e.key;
 if(k==='ArrowUp'||k==='PageUp'||k==='AudioVolumeUp'){rlAdj('par',10);e.preventDefault()}else if(k==='ArrowDown'||k==='PageDown'||k==='AudioVolumeDown'){rlAdj('par',-10);e.preventDefault()}
 else if(k==='Enter'||k===' '){rlResetPar();e.preventDefault()}else if(k==='ArrowRight'||k==='ArrowLeft'){const s=RL(),B=rlRB();s.box=Math.max(0,Math.min(B.length-1,(s.box||0)+(k==='ArrowRight'?1:-1)));rlSave(s);rlShow();e.preventDefault()}}
document.addEventListener('keydown',rlKey);

/* ---------- Calibration & ρυθμίσεις ---------- */
function rlSet(){T('⚙️ Tripmaster');const s=RL();
 M.innerHTML=`<div class="box"><b>📏 Calibration</b><div class="muted">Οδήγησε μια γνωστή απόσταση (π.χ. από κουτί σε κουτί του roadbook ή από χιλιομετρικό σε χιλιομετρικό), με Partial από 0. Γράψε τι λέει το roadbook και τι μέτρησε η εφαρμογή.</div>
 <div class="grid"><div><label>Roadbook (km)</label><input id="ccr" type="number" inputmode="decimal" step="0.01"></div><div><label>Η εφαρμογή μέτρησε (km)</label><input id="ccm" type="number" inputmode="decimal" step="0.01" value="${s.par.toFixed(2)}"></div></div>
 <button class="btn p" onclick="rlCal()">✔ Υπολόγισε συντελεστή</button><label style="margin-top:10px;display:block">Συντελεστής (factor)</label><input id="cfac" type="number" step="0.001" inputmode="decimal" value="${s.fac.toFixed(4)}" onchange="const s=RL();s.fac=n(this.value)||1;rlSave(s)">
 <div class="muted">1,0000 = χωρίς διόρθωση. Ισχύει για τις επόμενες μετρήσεις.</div></div>
 <div class="box"><b>Μετρητές</b><div class="grid"><div><label>Total (km)</label><input id="ctot" type="number" step="0.01" inputmode="decimal" value="${s.tot.toFixed(2)}"></div><div><label>Partial (km)</label><input id="cpar" type="number" step="0.01" inputmode="decimal" value="${s.par.toFixed(2)}"></div></div>
 <div class="tools"><button class="btn p" onclick="const s=RL();s.tot=n($('#ctot').value);s.par=n($('#cpar').value);rlSave(s);go('rally')">💾 Ορισμός</button><button class="btn r" onclick="if(confirm('Μηδενισμός Total & Partial και επιστροφή στο 1ο κουτί;')){const s=RL();s.tot=0;s.par=0;s.box=0;s.stT=0;rlSave(s);go('rally')}">⟲ Μηδενισμός όλων</button></div></div>
 <div class="box"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto;margin:0" ${s.beep?'checked':''} onchange="const s=RL();s.beep=this.checked?1:0;rlSave(s)"> Ήχος 100 m πριν από κάθε κουτί</label></div>
 <div class="note">Ακρίβεια: το GPS του κινητού δίνει περίπου 1–2% (καλύτερα με calibration, σε ανοιχτό ουρανό). Σε κλειστές στροφές και φαράγγια χάνει λίγα μέτρα — εκεί διορθώνεις με ±10 m στα σημεία αναφοράς του roadbook. Για αγώνες με επίσημη χρονομέτρηση, ελέγξτε τον κανονισμό: πολλές κατηγορίες απαιτούν tripmaster με αισθητήρα τροχού.</div>`}
function rlCal(){const r=n($('#ccr').value),m=n($('#ccm').value);if(!r||!m)return alert('Γράψε και τις δύο αποστάσεις.');const s=RL(),f=s.fac*r/m;s.fac=f;rlSave(s);$('#cfac').value=f.toFixed(4);alert('Νέος συντελεστής: '+f.toFixed(4))}

/* ---------- Roadbook ---------- */
function rlRBPage(){T('📒 Roadbook');const B=rlRB(),s=RL();
 M.innerHTML=`<div class="tools"><button class="btn p" onclick="rlBoxAdd(true)">➕ Κουτί εδώ (τώρα: ${fk(s.tot)} km)</button><button class="btn" onclick="rlBoxAdd(false)">➕ Κενό κουτί</button><button class="btn" onclick="rlCsv()">📋 Επικόλληση CSV</button><button class="btn" onclick="rlExp()">📤 Export</button>${B.length?`<button class="btn r" onclick="if(confirm('Σβήσιμο όλου του roadbook;')){LS.s('rlrb',[]);rlRBPage()}">🗑</button>`:''}</div>
 ${rlMem()}<div class="muted">«Κουτί εδώ» κρατάει το Total και το CAP της στιγμής — φτιάχνεις roadbook οδηγώντας την αναγνώριση. CSV: απόσταση;σύμβολο;CAP;σημείωση (μία γραμμή ανά κουτί).</div>`+
 (B.length?B.map((b,i)=>`<div class="box" style="padding:10px"><div style="display:flex;gap:8px;align-items:center"><b style="min-width:2em">${i+1}</b>
 <select style="width:auto;margin:0;font-size:1.4em;padding:4px" onchange="rlBx(${i},'s',this.value)">${RSYM.map(x=>`<option ${x===b.s?'selected':''}>${x}</option>`).join('')}</select>
 <input type="number" step="0.01" inputmode="decimal" style="margin:0" value="${b.d.toFixed(2)}" onchange="rlBx(${i},'d',n(this.value))" title="km"><input type="number" inputmode="numeric" style="margin:0;width:80px" placeholder="CAP" value="${b.cap??''}" onchange="rlBx(${i},'cap',this.value===''?'':Math.round(n(this.value)))">
 <button class="btn" onclick="rlBoxDel(${i})">🗑</button></div><input style="margin:6px 0 0" placeholder="σημείωση (π.χ. ΔΕ στη διχάλα, προσοχή λακκούβα)" value="${esc(b.t||'')}" onchange="rlBx(${i},'t',this.value)"></div>`).join(''):'<div class="note">Κενό roadbook.</div>')}
function rlSort(B){B.sort((a,b)=>a.d-b.d);return B}
function rlBoxAdd(here){const s=RL(),B=rlRB();B.push({d:here?+s.tot.toFixed(2):(B.length?B[B.length-1].d+0.5:0),s:'⬆️',cap:here&&RT.cap!=null?Math.round(RT.cap):'',t:''});LS.s('rlrb',rlSort(B));vib(60);rlRBPage()}
function rlBx(i,k,v){const B=rlRB();B[i][k]=v;LS.s('rlrb',k==='d'?rlSort(B):B);if(k==='d')rlRBPage()}
function rlBoxDel(i){const B=rlRB();B.splice(i,1);LS.s('rlrb',B);rlRBPage()}
function rlCsv(){const t=prompt('Επικόλλησε γραμμές: απόσταση;σύμβολο;CAP;σημείωση');if(!t)return;const B=rlRB();t.split(/\n/).forEach(l=>{const p=l.split(/[;\t]/);const d=n(p[0]);if(!p[0]||isNaN(parseFloat(String(p[0]).replace(',','.'))))return;B.push({d,s:(p[1]||'⬆️').trim()||'⬆️',cap:p[2]?Math.round(n(p[2])):'',t:(p[3]||'').trim()})});LS.s('rlrb',rlSort(B));rlRBPage()}
function rlExp(){const t=rlRB().map(b=>[b.d.toFixed(2),b.s,b.cap,b.t].join(';')).join('\n');if(navigator.share)navigator.share({text:t}).catch(()=>{});else(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert('Αντιγράφηκε.'),()=>prompt('Αντέγραψε:',t))}

/* ===== Μνήμες roadbook: αποθήκευση / άνοιγμα / σβήσιμο / νέο ===== */
const rlSv=()=>LS.g('rlsaved',[]);
function rlMem(){const S=rlSv(),cur=LS.g('rlcur',''),B=rlRB();
 return `<div class="box" style="padding:10px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>💾 ${L2('Μνήμες roadbook','Saved roadbooks')}</b><span class="muted">${cur?'📒 '+esc(cur):L2('χωρίς όνομα','unsaved')}${B.length?' · '+B.length+' '+L2('κουτιά','boxes'):''}</span></div>
 <div class="tools" style="margin-top:6px"><button class="btn p" onclick="rlMemSave()">💾 ${L2('Αποθήκευση','Save')}</button><button class="btn" onclick="rlMemNew()">🆕 ${L2('Νέο roadbook','New roadbook')}</button></div>
 ${S.length?S.map((r,i)=>`<div class="row" style="margin:6px 0 0;padding:8px"><span style="flex:1"><b>${esc(r.n)}</b><small>${r.B.length} ${L2('κουτιά','boxes')} · ${r.B.length?r.B[r.B.length-1].d.toFixed(2)+' km · ':''}${new Date(r.t).toLocaleDateString(LOC)}</small></span><button class="btn" onclick="rlMemOpen(${i})">📂</button><button class="btn r" onclick="rlMemDel(${i})">🗑</button></div>`).join(''):`<div class="muted" style="margin-top:6px">${L2('Καμία αποθηκευμένη. Αποθήκευσε το roadbook με όνομα για να το ξαναβρείς.','None saved yet. Save the roadbook with a name to find it again.')}</div>`}</div>`}
function rlMemSave(){const B=rlRB();if(!B.length)return alert(L2('Το roadbook είναι κενό.','The roadbook is empty.'));const S=rlSv(),cur=LS.g('rlcur','');
 const nm=(prompt(L2('Όνομα roadbook (ίδιο όνομα = αντικατάσταση):','Roadbook name (same name = overwrite):'),cur||(L2('Roadbook ','Roadbook ')+new Date().toLocaleDateString(LOC)))||'').trim();if(!nm)return;
 const i=S.findIndex(r=>r.n===nm);if(i>=0&&nm!==cur&&!confirm(L2('Υπάρχει ήδη «'+nm+'». Αντικατάσταση;','“'+nm+'” already exists. Overwrite?')))return;
 const r={n:nm,t:Date.now(),B:JSON.parse(JSON.stringify(B))};if(i>=0)S[i]=r;else S.unshift(r);LS.s('rlsaved',S);LS.s('rlcur',nm);vib(40);rlRBPage()}
function rlDirty(){const cur=LS.g('rlcur',''),B=rlRB();if(!B.length)return false;const r=rlSv().find(x=>x.n===cur);return !r||JSON.stringify(r.B)!==JSON.stringify(B)}
function rlMemOpen(i){const r=rlSv()[i];if(!r)return;if(rlDirty()&&!confirm(L2('Το τρέχον roadbook έχει αλλαγές που δεν αποθηκεύτηκαν. Να ανοίξει το «'+r.n+'»;','The current roadbook has unsaved changes. Open “'+r.n+'” anyway?')))return;
 LS.s('rlrb',JSON.parse(JSON.stringify(r.B)));LS.s('rlcur',r.n);const s=RL();s.box=0;rlSave(s);rlRBPage()}
function rlMemDel(i){const S=rlSv(),r=S[i];if(!r||!confirm(L2('Σβήσιμο της μνήμης «'+r.n+'»; (το τρέχον roadbook στην οθόνη δεν πειράζεται)','Delete saved “'+r.n+'”? (the roadbook on screen is not touched)')))return;S.splice(i,1);LS.s('rlsaved',S);if(LS.g('rlcur','')===r.n)LS.s('rlcur','');rlRBPage()}
function rlMemNew(){if(rlDirty()&&confirm(L2('Να αποθηκευτεί πρώτα το τρέχον roadbook;','Save the current roadbook first?')))rlMemSave();
 if(rlRB().length&&!confirm(L2('Νέο roadbook: καθαρίζουν τα κουτιά της οθόνης (οι μνήμες μένουν).','New roadbook: the boxes on screen are cleared (saved ones stay).')))return;
 LS.s('rlrb',[]);LS.s('rlcur','');const s=RL();s.box=0;if(confirm(L2('Μηδενισμός και Total/Partial του tripmaster;','Also zero the tripmaster Total/Partial?'))){s.tot=0;s.par=0}rlSave(s);rlRBPage()}
