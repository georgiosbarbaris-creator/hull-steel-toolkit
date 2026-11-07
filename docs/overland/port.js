/* Ported from Επιβίωση 72+ (Created by George Barbaris): sound, Morse, sun, sensors perms, barometer/altitude, wake lock, compass & GPS */
let AC=null;function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function beep(f,ms,vol=.9,type='square'){const c=ac(),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.value=vol;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+ms/1000)}
const MO_LAT={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const MO_GR={'Α':'.-','Β':'-...','Γ':'--.','Δ':'-..','Ε':'.','Ζ':'--..','Η':'....','Θ':'-.-.','Ι':'..','Κ':'-.-','Λ':'.-..','Μ':'--','Ν':'-.','Ξ':'-..-','Ο':'---','Π':'.--.','Ρ':'.-.','Σ':'...','Τ':'-','Υ':'-.--','Φ':'..-.','Χ':'----','Ψ':'--.-','Ω':'.--'};
const MO_NUM={'0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.'};
const MO_PUN={'.':'.-.-.-',',':'--..--','?':'..--..',"'":'.----.','!':'-.-.--','/':'-..-.','(':'-.--.',')':'-.--.-','&':'.-...',':':'---...',';':'-.-.-.','=':'-...-','+':'.-.-.','-':'-....-','_':'..--.-','"':'.-..-.','$':'...-..-','@':'.--.-.'};
const MO_PRO=[['SOS','...---...','Κίνδυνος – ζητώ βοήθεια (στέλνεται ενωμένο)'],['AR','.-.-.','Τέλος μηνύματος'],['SK','...-.-','Τέλος επικοινωνίας'],['BT','-...-','Αλλαγή θέματος / παύση (=)'],['KN','-.--.','Πάρε μόνο εσύ (μόνο ο σταθμός που καλώ)'],['AS','.-...','Περίμενε'],['K','-.-','Πάρε / σειρά σου να μιλήσεις'],['R','.-.','Ελήφθη'],['ΛΑΘΟΣ','........','8 τελείες = λάθος, ξαναρχίζω τη λέξη'],['CT / KA','-.-.-','Αρχή μηνύματος'],['VE / SN','...-.','Κατάλαβα']];
const MO_ABR=[['CQ','Καλώ όλους τους σταθμούς'],['DE','Από (π.χ. «CQ DE SV1ABC»)'],['MAYDAY','Κίνδυνος ζωής (φωνή)'],['PAN PAN','Επείγον, όχι κίνδυνος ζωής'],['SECURITE','Μήνυμα ασφαλείας'],['QTH','Η θέση μου είναι… / Ποια είναι η θέση σου;'],['QRZ','Ποιος με καλεί;'],['QSL','Επιβεβαιώνω λήψη'],['QRM / QRN','Παρεμβολές / παράσιτα'],['QRS / QRQ','Στείλε πιο αργά / πιο γρήγορα'],['QRT','Σταματώ την εκπομπή'],['QRV','Είμαι έτοιμος'],['QSO','Επικοινωνία με σταθμό'],['RST','Αναφορά ποιότητας σήματος'],['TNX / TU','Ευχαριστώ'],['PSE','Παρακαλώ'],['WX','Καιρός'],['HR','Εδώ'],['UR','Δικό σου'],['ES','Και'],['OK','Εντάξει'],['GM / GA / GE / GN','Καλημέρα / Καλό απόγευμα / Καλησπέρα / Καληνύχτα'],['73','Χαιρετισμούς'],['88','Αγάπη και φιλιά'],['HELP','Βοήθεια'],['MED','Χρειάζομαι γιατρό']];
const ICS=[['A','Έχω δύτη κάτω – μείνε μακριά, αργή ταχύτητα'],['B','Φορτώνω/εκφορτώνω/μεταφέρω επικίνδυνο φορτίο'],['C','Ναι (καταφατικό)'],['D','Μείνε μακριά – κάνω δύσκολους χειρισμούς'],['E','Αλλάζω πορεία δεξιά'],['F','Έχω βλάβη – επικοινωνήστε μαζί μου'],['G','Χρειάζομαι πιλότο'],['H','Έχω πιλότο επί του σκάφους'],['I','Αλλάζω πορεία αριστερά'],['J','Έχω φωτιά και επικίνδυνο φορτίο – μείνε μακριά'],['K','Θέλω να επικοινωνήσω μαζί σου'],['L','Σταμάτα αμέσως το σκάφος σου'],['M','Το σκάφος μου έχει σταματήσει'],['N','Όχι (αρνητικό)'],['O','Άνθρωπος στη θάλασσα'],['P','Στο λιμάνι: όλοι επί του σκάφους, αναχωρούμε'],['Q','Το σκάφος μου είναι υγιές – ζητώ ελεύθερη πρατική'],['R','(Λήψη μηνύματος)'],['S','Οι μηχανές μου κινούνται ανάποδα'],['T','Μείνε μακριά – κάνω ζευγαρωτή αλιεία (τράτα)'],['U','Οδεύεις προς κίνδυνο'],['V','Χρειάζομαι βοήθεια'],['W','Χρειάζομαι ιατρική βοήθεια'],['X','Σταμάτα και πρόσεχε τα σήματά μου'],['Y','Σέρνω την άγκυρα'],['Z','Χρειάζομαι ρυμουλκό']];
const MO_ALL=Object.assign({},MO_LAT,MO_GR,MO_NUM,MO_PUN);
const moSym=c=>c.replace(/\./g,'·').replace(/-/g,'−');
function moNorm(t){return t.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ς/g,'Σ').replace(/Σ/g,'Σ')}
function moEnc(t){return moNorm(t).split(/\s+/).filter(Boolean).map(w=>w==='SOS'?[['SOS','...---...']]:[...w].filter(c=>MO_ALL[c]).map(c=>[c,MO_ALL[c]]))}
let moT=null,moOn=false,moTorch=null;
function morse(){T('Morse');const m=LS.g('mo',{t:'SOS',w:8,s:1,l:1,f:0,r:0});
 const tab=(o)=>`<div class="grid" style="grid-template-columns:repeat(3,1fr);gap:6px">${Object.entries(o).map(([k,v])=>`<button class="btn" style="padding:8px 4px" onclick="moPlay('${k.replace(/'/g,"\\'")}')"><b style="font-size:1.2em">${esc(k)}</b><br><span class="mono">${moSym(v)}</span></button>`).join('')}</div>`;
 M.innerHTML=`<div class="box"><label>Γράψε λέξεις (ελληνικά ή λατινικά)</label><textarea id="mot" rows="2" oninput="moShow()">${esc(m.t)}</textarea>
 <div id="mov" class="mono" style="font-size:1.15em;word-break:break-word;margin:4px 0 10px"></div>
 <div class="tools"><button class="btn ${m.s?'p':''}" id="mo_s" onclick="moOpt('s')">🔊 Ήχος</button><button class="btn ${m.l?'p':''}" id="mo_l" onclick="moOpt('l')">⬜ Φως οθόνης</button><button class="btn ${m.f?'p':''}" id="mo_f" onclick="moOpt('f')">💡 Φακός (Android)</button><button class="btn ${m.r?'p':''}" id="mo_r" onclick="moOpt('r')">🔁 Επανάληψη</button></div>
 <label>Ταχύτητα: <span id="mow">${m.w}</span> λέξεις/λεπτό</label><input type="range" min="4" max="25" value="${m.w}" oninput="moSet('w',+this.value);$('#mow').textContent=this.value">
 <button class="big red" id="mob" onclick="moGo()">▶ ΠΑΙΞΕ</button>
 <div class="tools"><button class="btn" onclick="$('#mot').value='SOS';moShow()">SOS</button><button class="btn" onclick="$('#mot').value='ΒΟΗΘΕΙΑ';moShow()">ΒΟΗΘΕΙΑ</button><button class="btn" onclick="$('#mot').value='HELP';moShow()">HELP</button><button class="btn" onclick="$('#mot').value='MED';moShow()">MED (γιατρός)</button><button class="btn" onclick="$('#mot').value='OK';moShow()">OK</button></div>
 <div class="muted">· = σύντομο, − = μακρύ (3 φορές το σύντομο). Κενό ανάμεσα σε γράμματα = 3, ανάμεσα σε λέξεις = 7. Το SOS στέλνεται ενωμένο, χωρίς κενά.</div></div>
 <div class="tip">Πάτα οποιοδήποτε γράμμα στους πίνακες για να το ακούσεις.</div>
 <h3>Ελληνικό αλφάβητο</h3>${tab(MO_GR)}
 <h3>Λατινικό αλφάβητο</h3>${tab(MO_LAT)}
 <h3>Αριθμοί</h3>${tab(MO_NUM)}
 <h3>Σημεία στίξης</h3>${tab(MO_PUN)}
 <h3>Ειδικά σήματα (prosigns)</h3>${MO_PRO.map(p=>`<button class="row" onclick="moRaw('${p[1]}')"><span class="e mono" style="width:auto;font-size:1em;min-width:5.5em">${moSym(p[1])}</span><span><b>${p[0]}</b><small>${p[2]}</small></span></button>`).join('')}
 <h3>Συντομογραφίες και Q-codes</h3>${MO_ABR.map(p=>`<div class="wp"><b style="flex:none;min-width:6em">${p[0]}</b><span>${p[1]}</span></div>`).join('')}
 <h3>⚓ Μονογραμματικά σήματα ICS (με φως, ήχο ή σημαία)</h3><div class="muted">International Code of Signals – ισχύουν διεθνώς στη θάλασσα.</div>${ICS.map(p=>`<button class="row" onclick="moPlay('${p[0]}')"><span class="e"><b>${p[0]}</b></span><span><b class="mono">${moSym(MO_LAT[p[0]])}</b><small>${p[1]}</small></span></button>`).join('')}
 <div class="tip">Μάθε πρώτα το SOS: <b>··· −−− ···</b>. Για να θυμάσαι τα γράμματα, άκουσέ τα (ρυθμός), μη μετράς τελείες. Με φακό στη νύχτα το σήμα φαίνεται χιλιόμετρα μακριά.</div>`;
 moShow()}
function moSet(k,v){const m=LS.g('mo',{t:'SOS',w:8,s:1,l:1,f:0,r:0});m[k]=v;LS.s('mo',m)}
function moOpt(k){const m=LS.g('mo',{t:'SOS',w:8,s:1,l:1,f:0,r:0});m[k]=m[k]?0:1;LS.s('mo',m);$('#mo_'+k).classList.toggle('p',!!m[k])}
function moShow(){const t=$('#mot').value;moSet('t',t);const w=moEnc(t);$('#mov').innerHTML=w.map(x=>x.map(([c,v],i)=>`<span data-i="${i}">${esc(c)} <b>${moSym(v)}</b></span>`).join('&nbsp;&nbsp; ')).join('<span style="color:var(--org)"> / </span>')||'<span class="muted">—</span>'}
async function moTorchSet(on){try{if(!moTorch){const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});const t=s.getVideoTracks()[0];if(!(t.getCapabilities&&t.getCapabilities().torch)){t.stop();return false}moTorch=t}await moTorch.applyConstraints({advanced:[{torch:on}]});return true}catch(e){return false}}
function moStop(){if(moT){clearTimeout(moT);moT=null}moOn=false;if(moTorch){try{moTorch.applyConstraints({advanced:[{torch:false}]})}catch(e){}moTorch.stop();moTorch=null}
 const o=$('#ov');if(o&&o.dataset.mo){o.style.display='none';delete o.dataset.mo}const b=$('#mob');if(b)b.textContent='▶ ΠΑΙΞΕ';document.querySelectorAll('#mov span.hl').forEach(e=>e.classList.remove('hl'));wake(0)}
async function moRun(seq,label){moStop();const m=LS.g('mo',{t:'SOS',w:8,s:1,l:1,f:0,r:0});const u=1200/(m.w||8);moOn=true;wake(1);
 if(m.f&&!(await moTorchSet(false))){alert('Ο φακός δεν ελέγχεται σε αυτό το κινητό (π.χ. iPhone). Χρησιμοποιώ φως οθόνης.');m.l=1}
 const o=$('#ov');if(m.l){o.dataset.mo=1;o.style.display='flex';o.style.background='#000';$('#ovt').textContent=(label||'')+' – πάτα για στοπ'}
 const b=$('#mob');if(b)b.textContent='⏹ ΣΤΟΠ';let i=0;
 const stp=()=>{if(!moOn)return;if(m.l&&o.style.display==='none')return moStop();
  if(i>=seq.length){if(m.r){i=0;moT=setTimeout(stp,u*7);return}return moStop()}
  const [on,d]=seq[i++];if(on){if(m.s)beep(650,d*u,.8,'sine');if(m.l)o.style.background='#fff';if(m.f)moTorchSet(true)}else{if(m.l)o.style.background='#000';if(m.f&&moTorch)moTorchSet(false)}
  moT=setTimeout(stp,d*u)};stp()}
function moSeq(codes){const s=[];codes.forEach((c,ci)=>{if(c===' '){s.push([0,4]);return}[...c].forEach((x,j)=>{s.push([1,x==='.'?1:3]);s.push([0,j<c.length-1?1:3])})});return s}
function moGo(){if(moOn)return moStop();const w=moEnc($('#mot').value);if(!w.length)return;const codes=[];w.forEach((x,wi)=>{if(wi)codes.push(' ');x.forEach(([c,v])=>codes.push(v))});moRun(moSeq(codes),$('#mot').value.trim().slice(0,20))}
function moPlay(k){const v=MO_ALL[k];if(v)moRun(moSeq([v]),k)}
function moRaw(v){moRun(moSeq([v]),moSym(v))}
const SUNP=[['Αθήνα',37.98,23.73],['Θεσσαλονίκη',40.64,22.94],['Πάτρα',38.25,21.73],['Ηράκλειο',35.34,25.13],['Χανιά',35.51,24.02],['Λάρισα',39.64,22.42],['Βόλος',39.36,22.94],['Ιωάννινα',39.66,20.85],['Κέρκυρα',39.62,19.92],['Καλαμάτα',37.04,22.11],['Τρίπολη',37.51,22.37],['Καβάλα',40.94,24.41],['Αλεξανδρούπολη',40.85,25.87],['Κοζάνη',40.30,21.79],['Φλώρινα',40.78,21.41],['Μυτιλήνη',39.11,26.55],['Χίος',38.37,26.14],['Σύρος',37.44,24.94],['Ρόδος',36.43,28.22],['Σητεία',35.21,26.10]];
const SR=Math.PI/180;
function sunT(y,m,d,lat,lon){const J=Date.UTC(y,m,d,12)/864e5-0.5+2440588-2451545,lw=-lon*SR,ph=lat*SR,J0=0.0009,
 n=Math.round(J-J0-lw/(2*Math.PI)),ds=J0+lw/(2*Math.PI)+n,M=SR*(357.5291+0.98560028*ds),
 L=M+SR*(1.9148*Math.sin(M)+0.02*Math.sin(2*M)+0.0003*Math.sin(3*M))+SR*102.9372+Math.PI,
 dec=Math.asin(Math.sin(SR*23.4397)*Math.sin(L)),Jn=2451545+ds+0.0053*Math.sin(M)-0.0069*Math.sin(2*L),
 ms=j=>(j+0.5-2440588)*864e5,r={noon:ms(Jn),dec};
 for(const [h,a,b] of [[-0.833,'rise','set'],[-6,'dawn','dusk']]){const c=(Math.sin(h*SR)-Math.sin(ph)*Math.sin(dec))/(Math.cos(ph)*Math.cos(dec));
  if(c<-1||c>1){r[a]=r[b]=null;continue}const w=Math.acos(c),Js=2451545+J0+(w+lw)/(2*Math.PI)+n+0.0053*Math.sin(M)-0.0069*Math.sin(2*L);r[b]=ms(Js);r[a]=ms(Jn-(Js-Jn))}
 r.az=Math.acos(Math.max(-1,Math.min(1,Math.sin(dec)/Math.cos(ph))))/SR;return r}
const GRT=new Intl.DateTimeFormat('el-GR',{timeZone:'Europe/Athens',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const hm=t=>t==null?'—':GRT.format(new Date(t));
const dur=ms=>{const m=Math.round(ms/6e4);return Math.floor(m/60)+'ω '+String(m%60).padStart(2,'0')+'′'};
const pts16=['Β','ΒΒΑ','ΒΑ','ΑΒΑ','Α','ΑΝΑ','ΝΑ','ΝΝΑ','Ν','ΝΝΔ','ΝΔ','ΔΝΔ','Δ','ΔΒΔ','ΒΔ','ΒΒΔ'],pt16=a=>pts16[Math.round(((a%360)+360)%360/22.5)%16];
const MON=['Ιανουάριος','Φεβρουάριος','Μάρτιος','Απρίλιος','Μάιος','Ιούνιος','Ιούλιος','Αύγουστος','Σεπτέμβριος','Οκτώβριος','Νοέμβριος','Δεκέμβριος'];
let sunOpen=-1;
function sunPlace(){const k=LS.g('sunp','Αθήνα');if(k==='gps'){const g=LS.g('sungps',null);if(g)return['📍 Η θέση μου',g.lat,g.lon]}return SUNP.find(p=>p[0]===k)||SUNP[0]}
function sun(){T('☀️ Ήλιος');const k=LS.g('sunp','Αθήνα'),g=LS.g('sungps',null);
 M.innerHTML=`<label>Τόπος</label><select id="sps" onchange="sunSel(this.value)"><option value="gps">📍 Η θέση μου (GPS)${g?'':' – πάτα για εύρεση'}</option>${SUNP.map(p=>`<option ${p[0]===k?'selected':''}>${p[0]}</option>`).join('')}</select>
 <div id="snow"></div>
 <h3>📅 Όλο τον χρόνο</h3><div class="muted">Ώρα Ελλάδας (με τη θερινή ώρα). Πάτα έναν μήνα για να δεις κάθε μέρα.</div><div id="syr"></div>
 <div class="box"><b>💡 Τι σημαίνουν και πώς τα χρησιμοποιείς</b>
 <div class="li"><b>Πρώτο φως / Τελευταίο φως</b> (πολιτικό λυκόφως): ο ήλιος είναι κάτω από τον ορίζοντα αλλά βλέπεις να περπατάς και να δουλεύεις χωρίς φακό. Περίπου 25–30′ πριν την ανατολή και μετά τη δύση.</div>
 <div class="li"><b>Στήσε καταφύγιο 2 ώρες πριν τη δύση.</b> Νερό, ξύλα και κρεβάτι θέλουν φως. Στο σκοτάδι όλα γίνονται αργά και επικίνδυνα.</div>
 <div class="li"><b>Πόσο φως μένει – με το χέρι:</b> τέντωσε το χέρι, παλάμη οριζόντια κάτω από τον ήλιο. Κάθε δάχτυλο ανάμεσα στον ήλιο και τον ορίζοντα ≈ 15 λεπτά. 4 δάχτυλα ≈ 1 ώρα.</div>
 <div class="li"><b>Προσανατολισμός:</b> ο ήλιος ανατέλλει ακριβώς Ανατολικά και δύει ακριβώς Δυτικά μόνο στις ισημερίες (~21 Μαρτίου, ~23 Σεπτεμβρίου). Το καλοκαίρι ανατέλλει πιο βόρεια (ΒΑ), τον χειμώνα πιο νότια (ΝΑ). Το μεσημέρι (ηλιακό) ο ήλιος είναι ακριβώς Νότια.</div>
 <div class="li"><b>Αλλαγή ώρας:</b> τελευταία Κυριακή Μαρτίου +1 ώρα (θερινή), τελευταία Κυριακή Οκτωβρίου −1 ώρα (χειμερινή). Ο πίνακας τη λογαριάζει ήδη.</div>
 <div class="tip">Σε βουνό ή φαράγγι ο ήλιος «χάνεται» πίσω από την κορυφή πολύ πριν τη δύση. Λογάριασε ακόμα 30–60′ λιγότερο φως.</div></div>`;
 if(k==='gps'&&!g)sunGps();sunNow();sunYear()}
function sunSel(v){LS.s('sunp',v);if(v==='gps')sunGps();else{sunNow();sunYear()}}
function sunGps(){const e=$('#snow');if(e)e.innerHTML='<div class="box muted">📡 Βρίσκω τη θέση σου… βγες σε ανοιχτό χώρο.</div>';
 if(!navigator.geolocation){if(e)e.innerHTML='<div class="warn">Δεν υπάρχει GPS. Διάλεξε πόλη.</div>';return}
 navigator.geolocation.getCurrentPosition(p=>{LS.s('sungps',{lat:+p.coords.latitude.toFixed(4),lon:+p.coords.longitude.toFixed(4)});if($('#sps')){sunNow();sunYear()}},
  er=>{const e2=$('#snow');if(e2)e2.innerHTML='<div class="warn">'+(er.code===1?'Δεν δόθηκε άδεια τοποθεσίας. Διάλεξε την πιο κοντινή πόλη.':'Δεν βρέθηκε θέση. Διάλεξε την πιο κοντινή πόλη.')+'</div>'},{enableHighAccuracy:true,timeout:30000,maximumAge:600000})}
function grDate(t){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Athens',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t)).split('-').map(Number);return[p[0],p[1]-1,p[2]]}
function sunNow(){const e=$('#snow');if(!e)return;if(LS.g('sunp','Αθήνα')==='gps'&&!LS.g('sungps',null))return;
 const [nm,la,lo]=sunPlace(),now=Date.now(),[y,m,d]=grDate(now),s=sunT(y,m,d,la,lo);
 let st='';if(now<s.dawn)st=`🌙 Νύχτα. Πρώτο φως σε <b>${dur(s.dawn-now)}</b>.`;
 else if(now<s.rise)st=`🌅 Χαράζει. Ο ήλιος βγαίνει σε <b>${dur(s.rise-now)}</b>.`;
 else if(now<s.set){const left=s.set-now;st=`☀️ Μένει φως ήλιου <b>${dur(left)}</b> (+ ~${Math.round((s.dusk-s.set)/6e4)}′ λυκόφως).`+(left<2*36e5?`<div class="warn" style="margin-top:8px">Λιγότερο από 2 ώρες φως! Στήσε τώρα καταφύγιο, μάζεψε νερό και ξύλα.</div>`:'')}
 else if(now<s.dusk)st=`🌇 Σουρουπώνει. Σκοτάδι σε <b>${dur(s.dusk-now)}</b>. Άναψε φακό, μην κινείσαι μακριά.`;
 else{const t=sunT(...grDate(now+864e5),la,lo);st=`🌙 Νύχτα. Πρώτο φως σε <b>${dur(t.dawn-now)}</b>.`}
 e.innerHTML=`<div class="box"><b>Σήμερα – ${esc(nm)}</b> <span class="muted">${la.toFixed(2)}°, ${lo.toFixed(2)}°</span>
 <div class="grid" style="margin-top:8px;text-align:center">
  <div><div class="muted">🌄 Ανατολή</div><div class="hd" style="font-size:2em">${hm(s.rise)}</div><div class="muted">προς ${Math.round(s.az)}° (${pt16(s.az)})</div></div>
  <div><div class="muted">🌇 Δύση</div><div class="hd" style="font-size:2em">${hm(s.set)}</div><div class="muted">προς ${Math.round(360-s.az)}° (${pt16(360-s.az)})</div></div></div>
 <div style="text-align:center;margin-top:6px">Πρώτο φως <b>${hm(s.dawn)}</b> · Τελευταίο φως <b>${hm(s.dusk)}</b><br>Μέρα <b>${dur(s.set-s.rise)}</b> · Μεσημέρι ήλιου (ήλιος στον Νότο) <b>${hm(s.noon)}</b></div>
 <div class="tip" style="margin-top:10px">${st}</div></div>`}
function sunYear(){const e=$('#syr');if(!e)return;if(LS.g('sunp','Αθήνα')==='gps'&&!LS.g('sungps',null)){e.innerHTML='';return}
 const [,la,lo]=sunPlace(),[Y,CM,CD]=grDate(Date.now());
 const row=(y,m,d,b)=>{const s=sunT(y,m,d,la,lo);return`<tr${b?' style="background:#3d3935"':''}><td>${d}/${m+1}</td><td>${hm(s.dawn)}</td><td><b>${hm(s.rise)}</b></td><td><b>${hm(s.set)}</b></td><td>${hm(s.dusk)}</td><td>${dur(s.set-s.rise)}</td></tr>`};
 let h=`<table class="sunt"><thead><tr><th>Ημ/νία</th><th>Πρώτο<br>φως</th><th>🌄<br>Ανατ.</th><th>🌇<br>Δύση</th><th>Τελ.<br>φως</th><th>Μέρα</th></tr></thead>`;
 for(let i=0;i<12;i++){const m=(CM+i)%12,y=Y+(CM+i>11?1:0),nd=new Date(Date.UTC(y,m+1,0)).getUTCDate(),op=sunOpen===m;
  h+=`<tbody><tr class="smh${m===CM?' cur':''}" onclick="sunOpen=sunOpen===${m}?-1:${m};sunYear()"><td colspan="6">${op?'▼':'▶'} ${MON[m]} ${y}</td></tr>`;
  const days=op?[...Array(nd)].map((_,j)=>j+1):[1,15];days.forEach(d=>h+=row(y,m,d,y===Y&&m===CM&&d===CD));h+='</tbody>'}
 e.innerHTML=h+'</table>'}

/* ================= 🧰 PHONE TOOLS ================= */
async function motionPerm(){if(typeof DeviceMotionEvent!=='undefined'&&typeof DeviceMotionEvent.requestPermission==='function'){try{return(await DeviceMotionEvent.requestPermission())==='granted'}catch(e){return false}}return true}
async function orientPerm(){if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){try{return(await DeviceOrientationEvent.requestPermission())==='granted'}catch(e){return false}}return true}
const qnh=(p,h)=>p*Math.pow(1-0.0065*h/288.15,-5.255);
function wx(){T('Καιρός & Υψόμετρο');const L=LS.g('baro',[]);
 M.innerHTML=`<div class="box"><b>⛰️ Υψόμετρο (από GPS – χωρίς internet)</b><div class="hd" id="alt">—</div><div class="muted" style="text-align:center" id="alta">Αναζήτηση δορυφόρων… βγες σε ανοιχτό χώρο</div><div id="alts" class="muted" style="text-align:center;margin-top:6px"></div>
 <div class="tools" style="justify-content:center"><button class="btn" onclick="LS.s('alt',null);wxAlt()">↺ Μηδένισε min/max/ανάβαση</button></div>
 <div class="muted">Το GPS δίνει υψόμετρο με ακρίβεια ±10–30 m. Περίμενε 1–2 λεπτά σε ανοιχτό ουρανό για καλύτερη τιμή. Για ακρίβεια μέτρου: η εφαρμογή «Πυξίδα» του iPhone και τα ρολόγια με αλτίμετρο χρησιμοποιούν το βαρόμετρο της συσκευής.</div></div>
 <div class="box"><b>🌡️ Βαρόμετρο – πρόγνωση καιρού</b>
 <div class="warn" style="font-weight:400">Το Safari/Chrome δεν επιτρέπουν σε καμία web εφαρμογή να διαβάσει τον αισθητήρα πίεσης του κινητού. Γράφεις εδώ τις ενδείξεις από βαρόμετρο, ρολόι, σταθμό ή VHF/NAVTEX, και η εφαρμογή βγάζει την τάση και την πρόγνωση.</div>
 <div class="grid"><div><label>Πίεση (hPa)</label><input id="bp" type="number" step="0.1" inputmode="decimal" placeholder="π.χ. 1013.2"></div><div><label>Υψόμετρο (m)</label><input id="bh" type="number" step="1" inputmode="numeric" value="${LS.g('bh',0)}"></div></div>
 <label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="bs" style="width:auto;margin:0" ${LS.g('bs',1)?'checked':''} onchange="LS.s('bs',this.checked?1:0)"> Η ένδειξη είναι στο ύψος όπου βρίσκομαι (station). Να γίνει αναγωγή στη θάλασσα (QNH).</label>
 <button class="big org" style="margin-top:10px" onclick="wxAdd()">➕ Κατέγραψε τώρα</button>
 <div id="wxr"></div><div id="wxl"></div></div>
 <div class="box"><b>📖 Κανόνες βαρομέτρου (τάση 3 ωρών)</b>
 <div class="li"><b>Σταθερή</b> (±1 hPa): ο καιρός δεν αλλάζει.</div>
 <div class="li"><b>Αργή πτώση</b> (1–3,5 hPa): πιθανή επιδείνωση, βροχή σε 12–24 ώρες.</div>
 <div class="li"><b>Γρήγορη πτώση</b> (3,6–6 hPa): δυνατός άνεμος, μπόρες σε λίγες ώρες.</div>
 <div class="li"><b>Πολύ γρήγορη πτώση</b> (πάνω από 6 hPa): θύελλα πλησιάζει – καταφύγιο τώρα!</div>
 <div class="li"><b>Αργή άνοδος</b>: βελτίωση, σταθερός καιρός.</div>
 <div class="li"><b>Γρήγορη άνοδος</b> μετά από χαμηλό: καθαρίζει, αλλά δυνατός και ριπαίος άνεμος.</div>
 <div class="li"><b>Πάνω από 1020 hPa</b>: συνήθως καλοκαιρία. <b>Κάτω από 1000 hPa</b>: άστατος καιρός.</div>
 <div class="tip">«Long foretold, long last – short notice, soon past»: αργή αλλαγή = μεγάλη διάρκεια, απότομη αλλαγή = περνάει γρήγορα. Κανόνας Buys Ballot: με την πλάτη στον άνεμο, το χαμηλό είναι αριστερά σου (βόρειο ημισφαίριο).</div></div>`;
 startGeo();wxAlt();wxList()}
function wxAdd(){const p=+$('#bp').value,h=+$('#bh').value||0;if(!(p>850&&p<1090)){alert('Γράψε πίεση σε hPa (π.χ. 1013.2).');return}LS.s('bh',h);
 const st=$('#bs').checked,q=st?qnh(p,h):p;const L=LS.g('baro',[]);L.push({t:Date.now(),p,h,q:+q.toFixed(1)});while(L.length>200)L.shift();LS.s('baro',L);$('#bp').value='';wxList()}
function wxDel(i){const L=LS.g('baro',[]);L.splice(i,1);LS.s('baro',L);wxList()}
function wxList(){const L=LS.g('baro',[]),r=$('#wxr'),l=$('#wxl');if(!r)return;
 if(!L.length){r.innerHTML='<div class="muted" style="margin-top:8px">Καμία ένδειξη ακόμα. Κατέγραφε κάθε 1–3 ώρες για να φανεί η τάση.</div>';l.innerHTML='';return}
 const last=L[L.length-1];let ref=null;for(let i=L.length-2;i>=0;i--){if(last.t-L[i].t>=50*60000){ref=L[i];break}}
 let h=`<div class="hd" style="font-size:2em;margin-top:8px">${last.q.toFixed(1)} hPa</div>`;
 if(ref){const hrs=(last.t-ref.t)/3600000,d3=(last.q-ref.q)/hrs*3,a=Math.abs(d3);
  const tr=a<=1?'Σταθερή':(d3<0?(a<=3.5?'Αργή πτώση':a<=6?'Γρήγορη πτώση':'Πολύ γρήγορη πτώση'):(a<=3.5?'Αργή άνοδος':a<=6?'Γρήγορη άνοδος':'Πολύ γρήγορη άνοδος'));
  let f;if(d3<-6)f='⛈️ Θύελλα / πολύ δυνατός άνεμος πλησιάζει. Βρες καταφύγιο ΤΩΡΑ, ασφάλισε σκάφος και πράγματα.';
  else if(d3<-3.5)f='🌬️ Δυνατός άνεμος και μπόρες τις επόμενες ώρες. Μην ξεκινάς πορεία στο βουνό ή στη θάλασσα.';
  else if(d3<-1)f=last.q<1005?'🌧️ Βροχή και άνεμος, επιδείνωση.':'🌥️ Πιθανή επιδείνωση σε 12–24 ώρες.';
  else if(d3<=1)f=last.q>=1020?'☀️ Σταθερός καλός καιρός.':last.q<1000?'🌦️ Άστατος καιρός, χωρίς μεγάλη αλλαγή.':'⛅ Χωρίς σημαντική αλλαγή.';
  else if(d3<=3.5)f='🌤️ Βελτίωση, ο καιρός σταθεροποιείται.';
  else f='🌬️ Καθαρίζει, αλλά δυνατός και ριπαίος άνεμος για λίγο.';
  h+=`<div style="text-align:center"><b>${tr}</b>: ${d3>0?'+':''}${d3.toFixed(1)} hPa / 3 ώρες<div class="tip" style="text-align:left">${f}</div></div>`}
 else h+=`<div class="muted" style="text-align:center">Χρειάζεται δεύτερη ένδειξη τουλάχιστον 1 ώρα μετά για τάση.</div>`;
 r.innerHTML=h;
 const sp=L.slice(-24);if(sp.length>1){const mn=Math.min(...sp.map(x=>x.q)),mx=Math.max(...sp.map(x=>x.q)),rg=Math.max(4,mx-mn),t0=sp[0].t,tr=Math.max(1,sp[sp.length-1].t-t0);
  l.innerHTML=`<svg viewBox="0 0 300 90" style="width:100%;background:#141312;border-radius:10px;margin:6px 0"><polyline fill="none" stroke="#e8b86d" stroke-width="2.5" points="${sp.map(x=>`${10+280*(x.t-t0)/tr},${80-70*(x.q-(mn+mx-rg)/2)/rg}`).join(' ')}"/><text x="6" y="12" font-size="10" fill="#a8a29e">${mx.toFixed(1)}</text><text x="6" y="88" font-size="10" fill="#a8a29e">${mn.toFixed(1)}</text></svg>`}
 l.innerHTML+=L.map((x,i)=>[x,i]).reverse().slice(0,12).map(([x,i])=>`<div class="wp"><b>${new Date(x.t).toLocaleString('el',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</b><span class="mono">${x.q.toFixed(1)}${x.q!==x.p?` <small class="muted">(${x.p} @${x.h}m)</small>`:''}</span><button class="btn" onclick="wxDel(${i})">🗑</button></div>`).join('')}
function wxAlt(){const e=$('#alt');if(!e)return;if(!pos||pos.alt==null){if(pos)$('#alta').textContent='Το GPS δεν έδωσε ακόμα υψόμετρο – περίμενε λίγο σε ανοιχτό χώρο.';return}
 const a=pos.alt,acc=pos.altAcc;let s=LS.g('alt',null);
 if(!s)s={min:a,max:a,gain:0,last:a};else{s.min=Math.min(s.min,a);s.max=Math.max(s.max,a);if(acc==null||acc<25){const d=a-s.last;if(Math.abs(d)>=5){if(d>0)s.gain+=d;s.last=a}}}
 LS.s('alt',s);e.textContent=Math.round(a)+' m';$('#alta').textContent=acc!=null?`Ακρίβεια ±${Math.round(acc)} m (πάνω από τη θάλασσα)`:'πάνω από τη θάλασσα';
 $('#alts').innerHTML=`Ελάχ. <b>${Math.round(s.min)} m</b> · Μέγ. <b>${Math.round(s.max)} m</b> · Ανάβαση <b>${Math.round(s.gain)} m</b>`;
 const bh=$('#bh');if(bh&&!bh.dataset.set&&(acc==null||acc<30)){bh.value=Math.round(a);bh.dataset.set=1}}

/* ---- wake lock ---- */
let WL=null;async function wake(on){try{if(on&&'wakeLock'in navigator&&!WL)WL=await navigator.wakeLock.request('screen');if(!on&&WL){WL.release();WL=null}}catch(e){}}
let hdg=null,pos=null,geoW=null,trk=LS.g('trk',[]),rec=LS.g('rec',false),tgt=LS.g('tgt',null),orientOn=false;
const DEC=()=>+LS.g('dec',0);
const R=6371000,rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
function dist(a,b){const dl=rad(b.lat-a.lat),dn=rad(b.lon-a.lon),h=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function brg(a,b){const y=Math.sin(rad(b.lon-a.lon))*Math.cos(rad(b.lat)),x=Math.cos(rad(a.lat))*Math.sin(rad(b.lat))-Math.sin(rad(a.lat))*Math.cos(rad(b.lat))*Math.cos(rad(b.lon-a.lon));return (deg(Math.atan2(y,x))+360)%360}
const card=h=>['Β','ΒΑ','Α','ΝΑ','Ν','ΝΔ','Δ','ΒΔ'][Math.round(h/45)%8];
const fmD=m=>m<1000?Math.round(m)+' m':(m/1000).toFixed(m<10000?2:1)+' km';
function ddm(v,p,n){const s=v<0?n:p,a=Math.abs(v),d=Math.floor(a),m=(a-d)*60;return `${d}°${m.toFixed(3).padStart(6,'0')}′${s}`}
function dms(v,p,n){const s=v<0?n:p,a=Math.abs(v),d=Math.floor(a),mm=(a-d)*60,m=Math.floor(mm),ss=((mm-m)*60).toFixed(1);return `${d}°${m}′${ss}″${s}`}
function compass(){T('Πυξίδα & GPS');const wps=LS.g('wps',[]);
 M.innerHTML=`<div class="tools" id="cbtns"><button class="btn p" onclick="startOrient()">🧭 Ενεργοποίηση πυξίδας</button></div>
 <div class="comp"><svg viewBox="-150 -150 300 300"><circle r="146" fill="#141312" stroke="#3d3935" stroke-width="3"/>
 <g id="rose">${Array.from({length:72},(_,i)=>{const a=i*5,l=a%30===0?18:a%10===0?11:6;return `<line x1="0" y1="-140" x2="0" y2="${-140+l}" stroke="#a8a29e" stroke-width="${a%30===0?3:1.5}" transform="rotate(${a})"/>`}).join('')}
 ${[['Β',0,'#e5735a'],['Α',90,'#fff'],['Ν',180,'#fff'],['Δ',270,'#fff']].map(c=>`<text transform="rotate(${c[1]}) translate(0,-100)" text-anchor="middle" dominant-baseline="middle" font-size="30" font-weight="900" fill="${c[2]}">${c[0]}</text>`).join('')}
 ${[30,60,120,150,210,240,300,330].map(a=>`<text transform="rotate(${a}) translate(0,-112)" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#a8a29e">${a}</text>`).join('')}</g>
 <g id="tarr" style="display:none"><path d="M0,-135 L14,-108 L-14,-108 Z" fill="#e8b86d"/></g>
 <path d="M0,-80 L12,0 L0,-12 L-12,0 Z" fill="#d9534f"/><path d="M0,80 L12,0 L0,12 L-12,0 Z" fill="#a8a29e"/><circle r="6" fill="#fff"/>
 <line x1="0" y1="-150" x2="0" y2="-128" stroke="#fff" stroke-width="5"/></svg></div>
 <div class="hd" id="hd">—</div><div class="muted" style="text-align:center" id="hdn">Πάτα «Ενεργοποίηση πυξίδας» και κράτα το κινητό οριζόντια</div>
 <div class="box" id="nav" style="display:none"></div>
 <div class="box"><b>📍 Η θέση μου (GPS – δουλεύει χωρίς internet)</b><div id="gps" class="coord" style="margin-top:8px">Αναζήτηση δορυφόρων…</div>
 <div class="tools" style="justify-content:center"><button class="btn g" onclick="saveWp()">➕ Αποθήκευσε αυτό το σημείο</button><button class="btn r" onclick="sendPos()">✉️ Στείλε τη θέση μου (SMS)</button><button class="btn" onclick="copyPos()">📋 Αντιγραφή</button></div></div>
 <div class="box"><b>⭐ Τα σημεία μου</b> <span class="muted">(σπίτι, αυτοκίνητο, σημείο συνάντησης)</span><div id="wps">${wpsHtml(wps)}</div><button class="btn" style="margin-top:8px" onclick="addWpMan()">⌨️ Πρόσθεσε με συντεταγμένες</button></div>
 <div class="box"><b>🗺️ Χάρτης σημείων και διαδρομής</b><div class="tools" style="margin-top:6px"><button class="btn ${rec?'r':''}" id="recb" onclick="togRec()">${rec?'⏹ Σταμάτα καταγραφή':'⏺ Κατέγραφε τη διαδρομή μου'}</button><button class="btn" onclick="clrTrk()">🧹 Σβήσε διαδρομή</button></div>
 <canvas id="cv" width="700" height="700"></canvas><div class="muted">Ο Βορράς είναι πάνω. 🔵 εσύ · ⭐ σημεία · κίτρινη γραμμή η διαδρομή σου (για να γυρίσεις από τον ίδιο δρόμο).</div></div>
 <div class="box"><label>Απόκλιση πυξίδας (declination, ° Ανατολικά +)</label><input type="number" step="0.5" value="${DEC()}" onchange="LS.s('dec',+this.value)"><div class="muted">Για κανονική χρήση άφησέ το 0. Στην Ελλάδα η μαγνητική απόκλιση είναι περίπου +5° E. Αν η πυξίδα κάνει λάθος, κάνε «οκτάρια» με το κινητό στον αέρα και κράτα το μακριά από μέταλλα, ηχεία, μαγνήτες.</div></div>
`;
 startGeo();if(orientOn)$('#cbtns').style.display='none';draw();upd()}
function wpsHtml(w){if(!w.length)return '<div class="muted">Κανένα σημείο ακόμα. Πάτα «Αποθήκευσε αυτό το σημείο» όταν είσαι σπίτι, στο αυτοκίνητο κ.λπ.</div>';
 return w.map((p,i)=>`<div class="wp ${tgt===i?'sel':''}"><b>${esc(p.n)}<br><small class="muted mono">${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</small></b><button class="btn ${tgt===i?'p':''}" onclick="setTgt(${i})">${tgt===i?'✓ Πάω':'➡️ Πάμε'}</button><button class="btn" onclick="delWp(${i})">🗑</button></div>`).join('')}
function refWps(){const e=$('#wps');if(e)e.innerHTML=wpsHtml(LS.g('wps',[]))}
function setTgt(i){tgt=tgt===i?null:i;LS.s('tgt',tgt);refWps();upd();draw()}
function delWp(i){const w=LS.g('wps',[]);if(!confirm('Διαγραφή «'+w[i].n+'»;'))return;w.splice(i,1);LS.s('wps',w);if(tgt===i)tgt=null;else if(tgt>i)tgt--;LS.s('tgt',tgt);refWps();upd();draw()}
function saveWp(){if(!pos){alert('Περίμενε να βρεθεί η θέση σου (GPS).');return}const n=prompt('Όνομα σημείου (π.χ. Σπίτι, Αυτοκίνητο, Συνάντηση):','Σημείο '+(LS.g('wps',[]).length+1));if(!n)return;const w=LS.g('wps',[]);w.push({n,lat:pos.lat,lon:pos.lon,t:Date.now()});LS.s('wps',w);refWps();draw()}
function addWpMan(){const n=prompt('Όνομα σημείου:');if(!n)return;const s=prompt('Συντεταγμένες σε δεκαδικό (π.χ. 37.97510, 23.73480):');if(!s)return;const m=s.replace(/,/g,' ').split(/\s+/).filter(Boolean).map(Number);if(m.length<2||m.some(isNaN)||Math.abs(m[0])>90||Math.abs(m[1])>180){alert('Λάθος μορφή. Γράψε: 37.97510, 23.73480');return}const w=LS.g('wps',[]);w.push({n,lat:m[0],lon:m[1],t:Date.now()});LS.s('wps',w);refWps();draw()}
function posTxt(){return `Η θέση μου: ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)} (${ddm(pos.lat,'N','S')} ${ddm(pos.lon,'E','W')}) ±${Math.round(pos.acc)} m. https://maps.google.com/?q=${pos.lat.toFixed(5)},${pos.lon.toFixed(5)}`}
function sendPos(){if(!pos){alert('Περίμενε να βρεθεί η θέση σου (GPS).');return}const me=LS.g('me',{});location.href='sms:?&body='+encodeURIComponent('ΧΡΕΙΑΖΟΜΑΙ ΒΟΗΘΕΙΑ. '+(me.name?me.name+'. ':'')+posTxt())}
function copyPos(){if(!pos)return alert('Περίμενε το GPS.');const t=posTxt();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert('Αντιγράφηκε.'),()=>prompt('Αντέγραψε:',t))}
function startGeo(){if(geoW!==null)return;if(!navigator.geolocation){$('#gps').textContent='Το κινητό δεν έχει GPS διαθέσιμο.';return}
 geoW=navigator.geolocation.watchPosition(p=>{const c=p.coords;pos={lat:c.latitude,lon:c.longitude,acc:c.accuracy,alt:c.altitude,altAcc:c.altitudeAccuracy,spd:c.speed,hd:c.heading,t:p.timestamp};
  if(rec&&c.accuracy<60){const l=trk[trk.length-1];if(!l||dist(l,pos)>15){trk.push({lat:+pos.lat.toFixed(6),lon:+pos.lon.toFixed(6)});if(trk.length>3000)trk.shift();LS.s('trk',trk)}}
  upd();draw();wxAlt()},e=>{const g=$('#gps');if(g)g.innerHTML=e.code===1?'❌ Δεν δόθηκε άδεια τοποθεσίας.<br><small class="muted">iPhone: Ρυθμίσεις → Απόρρητο → Υπηρεσίες τοποθεσίας → Safari → «Κατά τη χρήση».</small>':'Δεν βρέθηκε ακόμα θέση. Βγες σε ανοιχτό χώρο με θέα στον ουρανό.'},{enableHighAccuracy:true,maximumAge:2000,timeout:60000})}
function stopGeo(){if(geoW!==null){navigator.geolocation.clearWatch(geoW);geoW=null}}
function startOrient(){const go2=()=>{orientOn=true;const b=$('#cbtns');if(b)b.style.display='none';wake(1)};
 if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){DeviceOrientationEvent.requestPermission().then(r=>{if(r==='granted'){window.addEventListener('deviceorientation',onOr,true);go2()}else alert('Δεν δόθηκε άδεια για την πυξίδα.')}).catch(()=>alert('Η πυξίδα δεν ενεργοποιήθηκε.'))}
 else{if('ondeviceorientationabsolute' in window)window.addEventListener('deviceorientationabsolute',onOr,true);else window.addEventListener('deviceorientation',onOr,true);go2();setTimeout(()=>{if(hdg===null){const n=$('#hdn');if(n)n.textContent='Η συσκευή δεν δίνει πυξίδα (π.χ. υπολογιστής). Το GPS δουλεύει κανονικά.'}},2500)}}
function onOr(e){let h=null;if(typeof e.webkitCompassHeading==='number')h=e.webkitCompassHeading;else if(e.absolute!==false&&e.alpha!=null)h=(360-e.alpha)%360;if(h==null)return;
 const so=(screen.orientation&&screen.orientation.angle)||window.orientation||0;h=(h+so+DEC()+360)%360;hdg=hdg==null?h:hdg+((((h-hdg)%360)+540)%360-180)*.25;hdg=(hdg+360)%360;upd(1)}
let lastU=0;
function upd(fast){const r=$('#rose');if(!r)return;const now=Date.now();
 if(hdg!=null){r.setAttribute('transform',`rotate(${-hdg})`);$('#hd').textContent=`${Math.round(hdg).toString().padStart(3,'0')}° ${card(hdg)}`;const n=$('#hdn');if(n)n.textContent='Η κόκκινη μύτη δείχνει πάντα Βορρά. Η λευκή γραμμή πάνω = προς τα πού κοιτάς.'}
 const w=LS.g('wps',[]),t=tgt!=null?w[tgt]:null,ta=$('#tarr'),nv=$('#nav');
 if(t&&pos){const b=brg(pos,t),d=dist(pos,t);ta.style.display='';ta.setAttribute('transform',`rotate(${hdg!=null?b-hdg:b})`);
  if(!fast||now-lastU>500){nv.style.display='';nv.innerHTML=`<div style="text-align:center"><b>➡️ ${esc(t.n)}</b><div class="hd" style="font-size:2em">${fmD(d)}</div>Πορεία <b>${Math.round(b).toString().padStart(3,'0')}° ${card(b)}</b>${hdg!=null?`<br>${turnTxt(b-hdg)}`:''}<div class="muted">Ακολούθα το κίτρινο βέλος. Απόσταση σε ευθεία γραμμή.</div></div>`}}
 else{ta.style.display='none';nv.style.display='none'}
 if(fast&&now-lastU<500)return;lastU=now;
 const g=$('#gps');if(g&&pos)g.innerHTML=`<div class="mono">${ddm(pos.lat,'N','S')}<br>${ddm(pos.lon,'E','W')}</div><div class="mono muted" style="font-size:.85em">${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)} · ${dms(pos.lat,'N','S')} ${dms(pos.lon,'E','W')}</div><div class="muted">Ακρίβεια ±${Math.round(pos.acc)} m${pos.alt!=null?` · Υψόμετρο ${Math.round(pos.alt)} m`:''}${pos.spd!=null&&pos.spd>0.3?` · Ταχύτητα ${(pos.spd*3.6).toFixed(1)} km/h`:''}</div>`}
function turnTxt(d){d=((d%360)+540)%360-180;const a=Math.abs(Math.round(d));return a<10?'✅ Ευθεία μπροστά':(d>0?`↪️ Στρίψε ΔΕΞΙΑ ${a}°`:`↩️ Στρίψε ΑΡΙΣΤΕΡΑ ${a}°`)}
function togRec(){rec=!rec;LS.s('rec',rec);const b=$('#recb');b.className='btn '+(rec?'r':'');b.textContent=rec?'⏹ Σταμάτα καταγραφή':'⏺ Κατέγραφε τη διαδρομή μου';if(rec)wake(1)}
function clrTrk(){if(!confirm('Σβήσιμο της καταγεγραμμένης διαδρομής;'))return;trk=[];LS.s('trk',trk);draw()}
function draw(){const cv=$('#cv');if(!cv)return;const x=cv.getContext('2d'),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
 const w=LS.g('wps',[]),pts=[...trk,...w];if(pos)pts.push(pos);
 if(!pts.length){x.fillStyle='#a8a29e';x.font='28px sans-serif';x.textAlign='center';x.fillText('Δεν υπάρχουν ακόμα σημεία',W/2,H/2);return}
 const c=pos||pts[pts.length-1],k=Math.cos(rad(c.lat));let mx=50;pts.forEach(p=>{mx=Math.max(mx,Math.abs((p.lon-c.lon)*k*111320),Math.abs((p.lat-c.lat)*110540))});
 const sc=(W/2-50)/mx,P=p=>[W/2+(p.lon-c.lon)*k*111320*sc,H/2-(p.lat-c.lat)*110540*sc];
 // grid rings
 x.strokeStyle='#3d3935';x.lineWidth=2;x.fillStyle='#a8a29e';x.font='22px sans-serif';x.textAlign='left';
 const ring=[10,25,50,100,250,500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1e6,2.5e6,5e6].find(r=>r*sc>W/6)||mx;
 for(let i=1;i<=3;i++){x.beginPath();x.arc(W/2,H/2,ring*i*sc,0,7);x.stroke();x.fillText(fmD(ring*i),W/2+ring*i*sc*.71+4,H/2-ring*i*sc*.71)}
 x.fillStyle='#e5735a';x.font='bold 30px sans-serif';x.textAlign='center';x.fillText('Β ▲',W/2,34);
 if(trk.length>1){x.strokeStyle='#e8b86d';x.lineWidth=4;x.beginPath();trk.forEach((p,i)=>{const [a,b]=P(p);i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke()}
 w.forEach((p,i)=>{const [a,b]=P(p);x.font='34px sans-serif';x.fillText('⭐',a,b+12);x.fillStyle=tgt===i?'#e8b86d':'#fff';x.font='bold 22px sans-serif';x.fillText(p.n,a,b-22);x.fillStyle='#e5735a'});
 if(pos){const [a,b]=P(pos);x.fillStyle='rgba(106,159,181,.25)';x.beginPath();x.arc(a,b,Math.max(10,pos.acc*sc),0,7);x.fill();x.fillStyle='#6a9fb5';x.strokeStyle='#fff';x.lineWidth=4;x.beginPath();x.arc(a,b,13,0,7);x.fill();x.stroke()}}
