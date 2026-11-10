/* Overland’s Habit v0.40
   1) Αρχική σε 4 φάσεις: 🧳 Πριν · 🚙 Στη διαδρομή · ⛺ Στο camp · 🏠 Μετά. Η φάση διαλέγεται μόνη της
      (σχέδιο εκδρομής ή ξεφουσκωμένα → διαδρομή, μετά τη δύση → camp), αλλιώς ό,τι πάτησε ο χρήστης (6 ώρες). LS: ov_ph {p,t}.
   2) 🚗 Λειτουργία οδήγησης #drive: μεγάλα νούμερα (ταχύτητα, υψόμετρο, πορεία, φως), μεγάλα κουμπιά για γάντια,
      οθόνη πάντα ανοιχτή, landscape χωρίς κάτω μπάρα.
   3) 🏠 Μετά την εκδρομή #after: έλεγχος οχήματος και εξοπλισμού. LS: ov_ck_after. */
const PH=[['pre','🧳',L2('Πριν','Before')],['road','🚙',L2('Διαδρομή','On the road')],['camp','⛺',L2('Camp','At camp')],['post','🏠',L2('Μετά','After')]];
function phSun(){const p=(typeof pos!=='undefined'&&pos)||LS.g('sungps',null)||{lat:37.98,lon:23.73},d=new Date();try{return sunT(d.getFullYear(),d.getMonth(),d.getDate(),p.lat,p.lon)}catch(e){return{}}}
function phAuto(){const m=LS.g('ph',null);if(m&&Date.now()-m.t<6*36e5)return m.p;
 if((typeof fpActive==='function'&&fpActive())||(typeof airOn==='function'&&airOn())||(typeof cvMe==='function'&&cvMe()))return'road';
 const s=phSun(),now=Date.now();if(s.set&&s.rise&&(now>s.set-36e5||now<s.rise))return'camp';return'pre'}
function phSet(p){LS.s('ph',{p,t:Date.now()});home()}
const hR=(r,e,b,s,st)=>`<button class="row" onclick="go('${r}')" ${st?`style="${st}"`:''}><span class="e">${e}</span><span><b>${b}</b>${s?`<small>${s}</small>`:''}</span></button>`;
const hT=L=>`<div class="g3">${L.map(t=>`<button class="tile" onclick="go('${t[0]}')"><span class="e">${t[1]}</span>${t[2]}</button>`).join('')}</div>`;
function phBody(p){
 if(p==='pre')return hT([['t/walk','🔎','Walk-round'],['t/payload','⚖️',L2('Βάρος GVM','Weight GVM')],['t/roof','🏗️',L2('Οροφή','Roof load')],['t/fuel','⛽',L2('Καύσιμο','Fuel')],['t/water','💧',L2('Νερό','Water')],['t/power','🔋',L2('Ρεύμα','Power')]])+
  fpHomeRow()+
  hR('garage','🧰',L2('Το γκαράζ μου','My garage'),L2('ο εξοπλισμός σου με βάρη · 📦 τι παίρνεις → GVM & οροφή','your gear with weights · 📦 what you take → GVM & roof'))+
  mtRow()+
  hR('trip','🎒','Ταξίδι & λίστες εξοπλισμού',tripProg())+
  hR('t/wx','🌡️',L2('Καιρός, υψόμετρο & βαρόμετρο','Weather, altitude & barometer'),L2('πρόγνωση, τάση πίεσης','forecast, pressure trend'))+
  hR('map','🗺️',L2('Offline χάρτες για την περιοχή','Offline maps for the area'),L2('κατέβασέ τους όσο έχεις internet','download them while you have internet'))+
  bkHomeRow();
 if(p==='road')return`<button class="big org" onclick="go('drive')">🚗 ${L2('Λειτουργία οδήγησης','Driving mode')}<small>${L2('μεγάλα κουμπιά, οθόνη ανοιχτή, για τη βάση του ταμπλό','big buttons, screen on, for the dash mount')}</small></button>`+
  hT([['t/incl','📐','Κλισιόμετρο'],['t/tyre','🛞','Πίεση'],['t/pass','🚧',L2('Θα περάσω;','Will I pass?')],['t/wade','🌊','Νερό, περνάω;'],['t/winch','🪝','Ανάκτηση'],['t/compass','🧭','Πυξίδα & GPS']])+
  fpHomeRow()+
  logRow()+
  hR('t/pnr','🔙','Point of No Return',L2('πόσο ακόμα μπορείς να πας και να γυρίσεις','how much further you can go and still get back'))+
  hR('map','🗺️',L2('Χάρτης «Πού είμαι»','Map «Where am I»'),L2('θέση, υψόμετρο, στίγματα · Organic Maps / OsmAnd / Google','position, altitude, pins · Organic Maps / OsmAnd / Google'))+
  hR('convoy','🚐','Κομβόι, ζωντανά',(typeof cvMe==='function'&&cvMe())?'🟢 ενεργό · κωδικός '+cvMe().code:'όλα τα αυτοκίνητα στον χάρτη, συναγερμός αν χαθεί κάποιος, SOS')+
  hR('rally','🏁','Ράλι, Tripmaster & Roadbook',(typeof RL==='function'&&RL().run?'🟢 μετράει · ':'')+'Total/Partial, regularity, CAP, roadbook με κουτιά')+
  hR('t/radio','📻','Ασύρματοι & κομβόι','PMR446, κανόνες ασυρμάτου');
 if(p==='camp')return hT([['t/sun','🌇',L2('Ήλιος','Sun')],['t/night','🌙',L2('Οθόνη νύχτας','Night screen')],['t/knots','🪢','Κόμποι'],['t/power','🔋',L2('Ρεύμα','Power')],['t/wx','🌡️',L2('Βαρόμετρο','Barometer')],['t/morse','📡','Morse']])+
  logRow()+
  hR('map/huts','🛖',L2('Καταφύγια & camper stops Ελλάδας','Huts & camper stops of Greece'),L2('καταφύγια, στέγαστρα, camper, κάμπινγκ, πηγές · offline','huts, shelters, camper, campsites, springs · offline'))+
  hR('learn/c1011_campsite','🏕️',L2('Πού στήνω: επιλογή θέσης','Where to pitch: choosing a site'),L2('μάθημα Ακαδημίας','Academy lesson'))+
  hR('learn/c1011_fire','🔥',L2('Φωτιά με ασφάλεια','Fire, safely'),L2('μάθημα Ακαδημίας','Academy lesson'))+
  hR('gear/a_tents','⛺',L2('Η μεγάλη μάχη των σκηνών','The great tent battle'),L2('άρθρο','article'));
 return(typeof fpActive==='function'&&fpActive()?`<button class="big grn" onclick="go('plan')">✅ ${L2('Γύρισα καλά','I\'m back safe')}<small>${L2('κλείσε το σχέδιο εκδρομής','close the trip plan')}</small></button>`:'')+
  (typeof airOn==='function'&&airOn()?`<button class="big org" onclick="airUp()">🛞 ${L2('Φούσκωσα','Aired up')}</button>`:'')+
  logRow()+mtRow()+
  hR('after','🧽',L2('Μετά την εκδρομή: έλεγχος','After the trip: checks'),afProg())+
  bkHomeRow()+
  hR('trip','🎒',L2('Λίστες: τι έλειψε, τι περίσσεψε','Lists: what was missing, what was extra'),L2('πρόσθεσε δικά σου πράγματα για την επόμενη φορά','add your own items for next time'))}
function home(){T(TITLE);const p=phAuto();
 M.innerHTML=`<div class="hero">${SUN_SVG}<h2>Overland’s Habit</h2><div>ο ελληνικός οδηγός για το overlanding, από αρχάριο μέχρι expert</div></div>${vehBox()}
 <div class="seg phs">${PH.map(([k,e,n])=>`<button class="${k===p?'on':''}" onclick="phSet('${k}')"><span style="font-size:1.4em;display:block">${e}</span>${n}</button>`).join('')}</div>
 ${phBody(p)}
 <h3>${L2('Μάθε','Learn')}</h3>
 ${hR('learn','🎓','Ακαδημία',`${ALL.filter(l=>done(l.id)).length}/${ALL.length} μαθήματα · quiz · από αρχάριο μέχρι expert`)}
 ${hR('gear','🧰',L2('Εξοπλισμός του overlander','The overlander\'s gear'),L2('σκηνές, ψυγεία, ενέργεια, κουζίνα, άρθρα · τιμές, υπέρ/κατά','tents, fridges, power, kitchen, articles · prices, pros/cons'))}
 ${p!=='pre'&&bkNeed()?bkHomeRow():''}
 <footer>Overland’s Habit v0.40 · Created by George Barbaris<br><i>Adventure Is a Habit.</i><br>Τα δεδομένα μένουν μόνο στο κινητό σου.<br>Χάρτες & σημεία © OpenStreetMap contributors · OpenTopoMap · Leaflet</footer>`}

/* ===================== ΛΕΙΤΟΥΡΓΙΑ ΟΔΗΓΗΣΗΣ ===================== */
let DRV={last:null};
function drive(){T('🚗 '+L2('Οδήγηση','Driving'));startGeo();wake(1);
 const B=(r,e,n,c)=>`<button class="dbtn ${c||''}" onclick="${r}">${'<span>'+e+'</span>'}${n}</button>`;
 M.innerHTML=`<div class="dgrid">
 <div class="dro"><small>${L2('Ταχύτητα','Speed')}</small><b id="dsp">--</b><i>km/h</i></div>
 <div class="dro"><small>${L2('Υψόμετρο','Altitude')}</small><b id="dal">--</b><i>m</i></div>
 <div class="dro"><small>${L2('Πορεία','Course')}</small><b id="dcs">--</b><i id="dcc"></i></div>
 <div class="dro"><small>${L2('Φως ακόμα','Light left')}</small><b id="dli">--</b><i id="dlt"></i></div></div>
 <div id="dst"></div>
 <div class="dbg">
 ${B("go('t/incl')",'📐','Κλισιόμετρο')}${B("go('t/tyre')",'🛞','Πίεση')}${B("go('t/compass')",'🧭','Πυξίδα')}${B("go('map')",'🗺️','Χάρτης')}
 ${B("go('t/pnr')",'🔙','PNR')}${B('drvPin()','📍',L2('Στίγμα εδώ','Pin here'))}${B("go('t/wade')",'🌊','Νερό')}${B('drvNight()','🌙',L2('Νύχτα','Night'))}
 ${B("go('sos')",'🆘','SOS','red')}${B("go('home')",'✖',L2('Έξοδος','Exit'))}</div>
 <div class="muted" style="text-align:center;margin-top:6px">${L2('Η οθόνη μένει ανοιχτή όσο είσαι εδώ. Γύρνα το κινητό οριζόντια για τη βάση του ταμπλό.','The screen stays on while you are here. Turn the phone sideways for the dash mount.')}</div>`;
 drvUpd();const id=setInterval(drvUpd,1000);TS.push(()=>clearInterval(id))}
function drvUpd(){const g=id=>document.getElementById(id);if(!g('dsp'))return;
 if(pos&&Date.now()-pos.t<15000){let v=pos.spd;if((v==null||isNaN(v))&&DRV.last){const dt=(pos.t-DRV.last.t)/1000;if(dt>0.5)v=dist(DRV.last,pos)/dt}
  let c=pos.hd;if((c==null||isNaN(c))&&DRV.last&&dist(DRV.last,pos)>8)c=brg(DRV.last,pos);
  if(!DRV.last||dist(DRV.last,pos)>8||pos.t-DRV.last.t>5000)DRV.last={lat:pos.lat,lon:pos.lon,t:pos.t};
  g('dsp').textContent=v!=null&&!isNaN(v)?Math.round(v*3.6):'--';g('dal').textContent=pos.alt!=null?Math.round(pos.alt):'--';
  if(c!=null&&!isNaN(c)&&(v==null||v>1)){g('dcs').textContent=String(Math.round(c)%360).padStart(3,'0')+'°';g('dcc').textContent=card(c)}
  const a=typeof airOn==='function'&&airOn();g('dsp').parentNode.style.borderColor=a&&v*3.6>airLim()?'var(--red)':''}
 else g('dsp').textContent='--';
 const s=phSun(),last=s.dusk||s.set;if(last){const h=(last-Date.now())/36e5;g('dli').textContent=h>0?Math.floor(h)+':'+String(Math.floor((h%1)*60)).padStart(2,'0'):'🌙';g('dlt').textContent=L2('τελ. φως ','last light ')+new Date(last).toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false});g('dli').parentNode.style.borderColor=h>0&&h<1.5?'var(--yel)':''}
 const st=[],fp=typeof fpActive==='function'&&fpActive(),ai=typeof airOn==='function'&&airOn();
 if(ai)st.push(`<span>🛞 ${L2('Ξεφουσκωμένα','Aired down')} · ${L2('όριο','limit')} ${airLim()} km/h</span>`);
 if(fp)st.push(`<span onclick="go('plan')">🧭 ${L2('Επιστροφή','Return')} ${fpLeft(fp.ret)}</span>`);
 const e=g('dst');if(e)e.innerHTML=st.length?`<div class="dstl">${st.join('')}</div>`:''}
function drvPin(){if(!pos)return alert(L2('Περίμενε το GPS.','Wait for GPS.'));const w=LS.g('wps',[]);const n=L2('Στίγμα ','Pin ')+new Date().toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false});w.push({n,lat:pos.lat,lon:pos.lon,t:Date.now()});LS.s('wps',w);vib(150);if(typeof logAct==='function'&&logAct()){const Lg=logs(),a=Lg.find(z=>z.act);a.e.push(Object.assign({id:'e'+Date.now(),t:Date.now(),k:'pin',tx:''},logPos()));logSv(Lg)}
 const b=document.createElement('div');b.className='dtoast';b.textContent='📍 '+n+L2(' σώθηκε (Πυξίδα → σημεία)',' saved (Compass → points)');document.body.appendChild(b);setTimeout(()=>b.remove(),2500)}
function drvNight(){night=!night;LS.s('night',night);document.documentElement.classList.toggle('night',night)}

/* ===================== ΜΕΤΑ ΤΗΝ ΕΚΔΡΟΜΗ ===================== */
const AFTER=[[L2('🚙 Όχημα','🚙 Vehicle'),[
 L2('Πέρασες νερό; Λάδια διαφορικών, κιβωτίου και κιβωτίου μεταφοράς: αν είναι γαλακτώδη, μπήκε νερό, αλλαγή.','Crossed water? Diff, gearbox and transfer case oils: if milky, water got in, change them.'),
 L2('Φίλτρο αέρα: σκόνη ή υγρασία. Τίναξε ή άλλαξε.','Air filter: dust or moisture. Clean or replace.'),
 L2('Πλύσιμο σασί, θόλων και ψυγείου (λάσπη, άμμος, αλάτι παραλίας).','Wash the chassis, wheel arches and radiator (mud, sand, beach salt).'),
 L2('Φρένα: πέτρες ή λάσπη στους δίσκους, φθορά τακακιών.','Brakes: stones or mud on the discs, pad wear.'),
 L2('Ελαστικά: σκισίματα στα πλαϊνά, πέτρες στο πέλμα, πίεση δρόμου.','Tyres: sidewall cuts, stones in the tread, road pressure.'),
 L2('Ανάρτηση, μπάρες, ποδιές προστασίας: χτυπήματα, λυμένες βίδες.','Suspension, arms, skid plates: impacts, loose bolts.'),
 L2('Διαρροές κάτω από το αυτοκίνητο μετά από μία νύχτα παρκαρισμένο.','Leaks under the car after one night parked.'),
 L2('Σχάρα, βάσεις σκηνής οροφής, εργάτης: σφίξιμο και έλεγχος.','Roof rack, rooftop tent mounts, winch: tighten and check.')]],
 [L2('⛺ Εξοπλισμός','⛺ Gear'),[
 L2('Σκηνή, swag, τέντα: άνοιξέ τα να στεγνώσουν τελείως, αλλιώς μούχλα.','Tent, swag, awning: open them to dry completely, or mould follows.'),
 L2('Υπνόσακοι: αερισμός, αποθήκευση χαλαροί, όχι συμπιεσμένοι.','Sleeping bags: air them, store loose, not compressed.'),
 L2('Ψυγείο: άδειασμα, καθάρισμα, καπάκι ανοιχτό.','Fridge: empty, clean, leave the lid open.'),
 L2('Δοχεία νερού: άδειασμα και στέγνωμα.','Water containers: empty and dry.'),
 L2('Ιμάντες ανάκτησης: ξέπλυμα, στέγνωμα στη σκιά, έλεγχος για φθορές.','Recovery straps: rinse, dry in the shade, check for damage.'),
 L2('Μπαταρίες, power station, φακοί, ασύρματοι: φόρτιση.','Batteries, power station, torches, radios: charge.'),
 L2('Φαρμακείο, πυροσβεστήρας: αναπλήρωση ό,τι χρησιμοποιήθηκε.','First aid kit, extinguisher: replace whatever was used.'),
 L2('Γκαζάκια, καύσιμο, μπιτόνια: τι λείπει για την επόμενη φορά.','Gas cartridges, fuel, jerry cans: what is missing for next time.')]],
 [L2('📱 Εφαρμογή','📱 App'),[
 L2('Σχέδιο εκδρομής: «Γύρισα καλά».','Trip plan: «I\'m back safe».'),
 L2('Backup: νέα στίγματα και GPX.','Backup: new pins and GPX.'),
 L2('Λίστες: πρόσθεσε ό,τι έλειψε, σημείωσε ό,τι περίσσεψε.','Lists: add what was missing, note what was extra.')]]];
function afProg(){const c=LS.g('ck_after',{})||{},n=AFTER.reduce((s,g)=>s+g[1].length,0),k=Object.keys(c).length;return `${k}/${n} ${L2('έγιναν','done')}`}
function afterPage(){T('🧽 '+L2('Μετά την εκδρομή','After the trip'));const c=LS.g('ck_after',{})||{};let i=0;
 M.innerHTML=`<div class="muted">${L2('Όπως το after-voyage στο πλοίο: ό,τι δεν ελέγξεις σήμερα, θα το βρεις μπροστά σου στην επόμενη εκδρομή.','Like an after-voyage check on a ship: what you don\'t check today, you will meet on the next trip.')}</div>`+
 AFTER.map(([g,L])=>`<h3>${g}</h3>`+L.map(x=>{const k='a'+(i++);return`<div class="chk ${c[k]?'on':''}" onclick="afT('${k}',this)"><div class="bx">${c[k]?'✓':''}</div><span>${esc(x)}</span></div>`}).join('')).join('')+
 `<div class="tools" style="margin-top:12px"><button class="btn" onclick="go('plan')">🧭 ${L2('Σχέδιο εκδρομής','Trip plan')}</button><button class="btn" onclick="go('maint')">🔧 ${L2('Συντήρηση','Maintenance')}</button><button class="btn" onclick="go('backup')">💾 Backup</button><button class="btn r" onclick="afNew()">🆕 ${L2('Καθάρισμα ✓','Clear ✓')}</button></div>`}
function afT(k,el){const c=LS.g('ck_after',{})||{};c[k]=!c[k];if(!c[k])delete c[k];LS.s('ck_after',c);el.classList.toggle('on',!!c[k]);el.querySelector('.bx').textContent=c[k]?'✓':''}
function afNew(){if(!confirm(L2('Να καθαρίσουν όλα τα ✓;','Clear all ✓?')))return;LS.s('ck_after',{});afterPage()}

(function(){const st=document.createElement('style');st.textContent=`.phs button{padding:8px 2px;font-size:.82em;min-width:0}
.dgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dro{background:#141312;border:2px solid var(--line);border-radius:16px;padding:8px;text-align:center}.dro small{display:block;color:var(--mut);font-size:.75em}.dro b{display:block;font-size:2.6em;line-height:1.05;font-variant-numeric:tabular-nums}.dro i{font-style:normal;color:var(--mut);font-size:.8em}
.dstl{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.dstl span{background:#4a3a14;border:1px solid var(--yel);border-radius:10px;padding:6px 10px;font-weight:700;font-size:.9em}
.dbg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.dbtn{background:var(--card);border:2px solid var(--line);color:var(--tx);border-radius:18px;min-height:86px;font-size:1.05em;font-weight:800;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}.dbtn span{font-size:1.9em;line-height:1}.dbtn.red{background:var(--red);border-color:var(--red);color:#fff}
.dtoast{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:var(--grn);color:#fff;padding:10px 16px;border-radius:12px;font-weight:800;z-index:70}
@media (orientation:landscape){.dgrid{grid-template-columns:repeat(4,1fr)}.dbg{grid-template-columns:repeat(5,1fr)}.dbtn{min-height:70px}}`;document.head.appendChild(st)})();
