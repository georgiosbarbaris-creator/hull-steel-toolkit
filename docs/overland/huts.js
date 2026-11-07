/* ===== Overland’s Habit: Καταφύγια & Camper stops Ελλάδας =====
   Όλη η Ελλάδα από το OpenStreetMap (Overpass). Κατεβαίνει μία φορά με WiFi (⬇️ Ενημέρωση λίστας) και μένει στο κινητό (IndexedDB «huts»).
   Περιοχή: η πλησιέστερη πόλη από τη λίστα HTOWN (κατά προσέγγιση). Υψόμετρο: ετικέτα ele του OSM, αλλιώς (αν το ζητήσεις) Open-Meteo (≈).
   Export όλης της λίστας (με τα φίλτρα) σε GPX / KML για Organic Maps, OsmAnd κ.λπ. Δεδομένα © OpenStreetMap contributors (ODbL). */

const HC=[
 {id:'hut',e:'🛖',n:['Καταφύγια','Mountain huts'],s:['Καταφύγιο','Mountain hut'],col:'#a0785a',om:'brown'},
 {id:'shel',e:'🏚️',n:['Στέγαστρα','Shelters'],s:['Στέγαστρο','Shelter'],col:'#8a7a6a',om:'gray'},
 {id:'caravan',e:'🚐',n:['Camper stops','Camper stops'],s:['Camper stop','Camper stop'],col:'#4f8a6a',om:'green'},
 {id:'dump',e:'🛢️',n:['Dump station','Dump stations'],s:['Dump station','Dump station'],col:'#8a6d4a',om:'orange'},
 {id:'camp',e:'⛺',n:['Κάμπινγκ','Campsites'],s:['Κάμπινγκ','Campsite'],col:'#5f9e7a',om:'teal'},
 {id:'spring',e:'💧',n:['Πηγές','Springs'],s:['Πηγή','Spring'],col:'#4a90c8',om:'blue'}];
const HCI=Object.fromEntries(HC.map(c=>[c.id,c]));
const hcN=c=>L2(c.n[0],c.n[1]),hcS=c=>L2(c.s[0],c.s[1]);
function hutCat(t){const tu=t.tourism,a=t.amenity;
 if(tu==='alpine_hut'||tu==='wilderness_hut')return'hut';if(tu==='caravan_site')return'caravan';if(a==='sanitary_dump_station')return'dump';if(tu==='camp_site')return'camp';
 if(a==='shelter')return'shel';if(t.natural==='spring')return'spring';return null}

/* Περιφέρειες και πόλεις αναφοράς (για ομαδοποίηση: κάθε σημείο πάει στην πλησιέστερη πόλη) */
const HRG=[['Αττική','Attica'],['Στερεά Ελλάδα','Central Greece'],['Πελοπόννησος','Peloponnese'],['Δυτική Ελλάδα','Western Greece'],['Ιόνια Νησιά','Ionian Islands'],['Ήπειρος','Epirus'],['Θεσσαλία','Thessaly'],['Δυτική Μακεδονία','Western Macedonia'],['Κεντρική Μακεδονία','Central Macedonia'],['Ανατολική Μακεδονία & Θράκη','East Macedonia & Thrace'],['Βόρειο Αιγαίο','North Aegean'],['Νότιο Αιγαίο','South Aegean'],['Κρήτη','Crete'],['Άγιον Όρος','Mount Athos']];
const HTOWN=[
 [0,'Αθήνα',37.98,23.73],[0,'Πειραιάς',37.94,23.65],[0,'Ελευσίνα',38.04,23.54],[0,'Μαραθώνας',38.15,23.96],[0,'Λαύριο',37.71,24.05],[0,'Αίγινα',37.75,23.43],[0,'Κύθηρα',36.15,22.99],[0,'Πόρος',37.50,23.45],[0,'Πάρνηθα',38.17,23.72],
 [1,'Λαμία',38.90,22.43],[1,'Λιβαδειά',38.44,22.88],[1,'Θήβα',38.32,23.32],[1,'Χαλκίδα',38.46,23.60],[1,'Άμφισσα',38.53,22.38],[1,'Καρπενήσι',38.91,21.79],[1,'Αταλάντη',38.65,23.00],[1,'Ιστιαία',38.95,23.15],[1,'Κύμη',38.63,24.10],[1,'Κάρυστος',38.02,24.42],[1,'Σκύρος',38.90,24.56],[1,'Δελφοί',38.48,22.50],[1,'Κρίκελλο',38.85,21.60],
 [2,'Τρίπολη',37.51,22.37],[2,'Καλαμάτα',37.04,22.11],[2,'Σπάρτη',37.07,22.43],[2,'Ναύπλιο',37.57,22.80],[2,'Κόρινθος',37.94,22.93],[2,'Ξυλόκαστρο',38.08,22.63],[2,'Μολάοι',36.80,22.85],[2,'Γύθειο',36.76,22.57],[2,'Αρεόπολη',36.67,22.38],[2,'Πύλος',36.91,21.70],[2,'Κυπαρισσία',37.25,21.67],[2,'Μεγαλόπολη',37.40,22.14],[2,'Λεωνίδιο',37.17,22.86],[2,'Βυτίνα',37.67,22.20],[2,'Ερμιόνη',37.38,23.25],
 [3,'Πάτρα',38.25,21.73],[3,'Αίγιο',38.25,22.08],[3,'Καλάβρυτα',38.03,22.11],[3,'Πύργος',37.67,21.44],[3,'Αμαλιάδα',37.80,21.35],[3,'Ανδρίτσαινα',37.48,21.90],[3,'Μεσολόγγι',38.37,21.43],[3,'Αγρίνιο',38.62,21.41],[3,'Ναύπακτος',38.39,21.83],[3,'Βόνιτσα',38.92,20.89],[3,'Θέρμο',38.57,21.67],
 [4,'Κέρκυρα',39.62,19.92],[4,'Παξοί',39.20,20.18],[4,'Λευκάδα',38.83,20.70],[4,'Ιθάκη',38.37,20.72],[4,'Αργοστόλι',38.17,20.49],[4,'Ζάκυνθος',37.78,20.90],
 [5,'Ιωάννινα',39.66,20.85],[5,'Μέτσοβο',39.77,21.18],[5,'Κόνιτσα',40.04,20.75],[5,'Πάπιγκο',39.97,20.73],[5,'Άρτα',39.16,20.99],[5,'Πρέβεζα',38.96,20.75],[5,'Πάργα',39.29,20.40],[5,'Ηγουμενίτσα',39.50,20.27],[5,'Φιλιάτες',39.60,20.31],[5,'Τζουμέρκα',39.43,21.12],
 [6,'Λάρισα',39.64,22.42],[6,'Ελασσόνα',39.89,22.19],[6,'Αγιά',39.72,22.76],[6,'Βόλος',39.36,22.94],[6,'Αλμυρός',39.18,22.76],[6,'Ζαγορά',39.45,23.10],[6,'Τρίκαλα',39.55,21.77],[6,'Καλαμπάκα',39.70,21.63],[6,'Καρδίτσα',39.36,21.92],[6,'Λίμνη Πλαστήρα',39.25,21.75],[6,'Σκιάθος',39.16,23.49],[6,'Σκόπελος',39.12,23.73],[6,'Δομοκός',39.13,22.30],
 [7,'Κοζάνη',40.30,21.79],[7,'Πτολεμαΐδα',40.51,21.68],[7,'Σιάτιστα',40.26,21.55],[7,'Φλώρινα',40.78,21.41],[7,'Πρέσπες',40.80,21.10],[7,'Καστοριά',40.52,21.26],[7,'Γρεβενά',40.08,21.43],[7,'Δεσκάτη',39.92,21.80],
 [8,'Θεσσαλονίκη',40.64,22.94],[8,'Κατερίνη',40.27,22.50],[8,'Λιτόχωρο',40.10,22.50],[8,'Βέροια',40.52,22.20],[8,'Νάουσα',40.63,22.07],[8,'Έδεσσα',40.80,22.05],[8,'Αριδαία',40.97,22.06],[8,'Κιλκίς',40.99,22.87],[8,'Σέρρες',41.09,23.55],[8,'Σιδηρόκαστρο',41.24,23.39],[8,'Πολύγυρος',40.38,23.44],[8,'Αρναία',40.49,23.59],[8,'Κασσάνδρα',40.05,23.42],[8,'Σιθωνία',40.10,23.85],[8,'Σοχός',40.82,23.36],
 [13,'Καρυές',40.25,24.24],[13,'Άθως',40.16,24.33],
 [9,'Καβάλα',40.94,24.41],[9,'Δράμα',41.15,24.15],[9,'Νευροκόπι',41.34,23.86],[9,'Παρανέστι',41.27,24.50],[9,'Ξάνθη',41.14,24.89],[9,'Εχίνος',41.28,24.99],[9,'Κομοτηνή',41.12,25.41],[9,'Αλεξανδρούπολη',40.85,25.87],[9,'Σουφλί',41.20,26.30],[9,'Ορεστιάδα',41.50,26.53],[9,'Θάσος',40.68,24.65],[9,'Σαμοθράκη',40.47,25.53],
 [10,'Μυτιλήνη',39.11,26.55],[10,'Καλλονή',39.21,26.20],[10,'Μύρινα',39.87,25.06],[10,'Χίος',38.37,26.14],[10,'Σάμος',37.76,26.98],[10,'Ικαρία',37.62,26.17],
 [11,'Ρόδος',36.43,28.22],[11,'Λίνδος',36.09,28.09],[11,'Κως',36.89,27.29],[11,'Κάλυμνος',36.95,26.98],[11,'Λέρος',37.15,26.85],[11,'Κάρπαθος',35.51,27.21],[11,'Νάξος',37.10,25.38],[11,'Πάρος',37.08,25.15],[11,'Ερμούπολη',37.44,24.94],[11,'Άνδρος',37.84,24.94],[11,'Τήνος',37.54,25.16],[11,'Κέα',37.62,24.33],[11,'Σίφνος',36.97,24.71],[11,'Μήλος',36.73,24.43],[11,'Θήρα',36.42,25.43],[11,'Αμοργός',36.83,25.90],
 [12,'Ηράκλειο',35.34,25.13],[12,'Μοίρες',35.05,24.87],[12,'Χανιά',35.51,24.02],[12,'Κίσσαμος',35.49,23.66],[12,'Παλαιόχωρα',35.23,23.68],[12,'Σφακιά',35.20,24.14],[12,'Ρέθυμνο',35.37,24.47],[12,'Σπήλι',35.22,24.54],[12,'Ανώγεια',35.29,24.88],[12,'Άγιος Νικόλαος',35.19,25.72],[12,'Ιεράπετρα',35.01,25.74],[12,'Σητεία',35.21,26.10]];
function hutWhere(lat,lon){let b=null,bd=1e9;const k=Math.cos(lat*Math.PI/180);for(const t of HTOWN){const dy=t[2]-lat,dx=(t[3]-lon)*k,d=dx*dx+dy*dy;if(d<bd){bd=d;b=t}}return[b[0],b[1]]}
const hrN=i=>HRG[i]?L2(HRG[i][0],HRG[i][1]):'';

/* ---------- Ενημέρωση λίστας από OSM ---------- */
const HQ=`[out:json][timeout:240];area["ISO3166-1"="GR"]["admin_level"="2"]->.gr;(
nwr["tourism"~"^(alpine_hut|wilderness_hut)$"](area.gr);
nwr["amenity"="shelter"]["shelter_type"!~"^(public_transport|sun_shelter|picnic_shelter|field_shelter|changing_rooms|smoking_shelter)$"](area.gr);
nwr["tourism"="caravan_site"](area.gr);
nwr["amenity"="sanitary_dump_station"](area.gr);
nwr["tourism"="camp_site"](area.gr);
nwr["natural"="spring"](area.gr););out center tags qt;`;
async function hutUpdate(){const o=$('#hto');if(!o)return;
 if(navigator.connection&&navigator.connection.type==='cellular'&&!confirm(L2('Είσαι με δεδομένα κινητού. Το κατέβασμα είναι περίπου 3–8 MB. Συνέχεια;','You are on mobile data. The download is about 3–8 MB. Continue?')))return;
 o.innerHTML=`<div class="note">⏳ ${L2('Κατεβάζω όλη την Ελλάδα από το OpenStreetMap… (1–3 λεπτά, άφησε την οθόνη ανοιχτή)','Downloading all of Greece from OpenStreetMap… (1–3 minutes, keep the screen on)')}</div>`;wake(1);
 let js=null,err='';
 for(const u of OVP){try{const ac=new AbortController(),to=setTimeout(()=>ac.abort(),260000);const res=await fetch(u,{method:'POST',body:'data='+encodeURIComponent(HQ),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:ac.signal});clearTimeout(to);
  if(!res.ok){err='HTTP '+res.status;continue}const j=await res.json();if(j.remark&&/runtime error|timed out/i.test(j.remark)&&!(j.elements||[]).length){err=j.remark.slice(0,80);continue}js=j;break}catch(e){err=e.name==='AbortError'?'timeout':e.message}}
 wake(0);if(!js){o.innerHTML=`<div class="warn">${L2('Δεν κατέβηκε','Download failed')} (${esc(err)}). ${L2('Δοκίμασε ξανά σε λίγο, με WiFi. Η παλιά λίστα μένει όπως ήταν.','Try again in a while, on WiFi. The old list stays as it was.')}</div>`;return}
 const old=new Map((await DB.all('huts').catch(()=>[])).map(h=>[h.k,h])),arr=[],now=Date.now();
 for(const el of js.elements||[]){const t=el.tags||{},c=hutCat(t);if(!c)continue;const la=el.lat!=null?el.lat:el.center&&el.center.lat,lo=el.lon!=null?el.lon:el.center&&el.center.lon;if(la==null)continue;
  const k=el.type[0]+el.id,tg={};KEEP.forEach(x=>{if(t[x]!=null)tg[x]=t[x]});const[rg,town]=hutWhere(la,lo);
  let ele=parseFloat(String(t.ele||'').replace(',','.')),ed=0;if(!isFinite(ele)){ele=null;const p=old.get(k);if(p&&p.ed&&p.ele!=null){ele=p.ele;ed=1}}else ele=Math.round(ele);
  arr.push({k,c,n:t.name||t['name:el']||t['name:en']||'',lat:+la.toFixed(6),lon:+lo.toFixed(6),ele,ed,rg,town,t:tg,d:now})}
 if(!arr.length){o.innerHTML=`<div class="warn">${L2('Ήρθε κενή απάντηση. Δοκίμασε ξανά αργότερα.','Got an empty answer. Try again later.')}</div>`;return}
 await DB.clear('huts');await DB.putMany('huts',arr);LS.s('hutm',{t:now,n:arr.length});HUT.A=null;hutPage()}

/* Υψόμετρα που λείπουν: Open-Meteo (μοντέλο εδάφους ~90 m), 100 σημεία ανά αίτημα */
async function hutEle(){const H=await DB.all('huts'),miss=H.filter(h=>h.ele==null),o=$('#hto');if(!miss.length||!o)return;
 if(!confirm(L2(`Να βρω υψόμετρο για ${miss.length} σημεία; Θέλει internet, περίπου ${Math.ceil(miss.length/100/2)} λεπτά. Το υψόμετρο είναι από μοντέλο εδάφους (≈).`,`Find the altitude of ${miss.length} places? Needs internet, about ${Math.ceil(miss.length/100/2)} min. Altitude comes from a terrain model (≈).`)))return;
 wake(1);let done=0,bad=0;
 for(let i=0;i<miss.length;i+=100){const B=miss.slice(i,i+100);
  try{const u=`https://api.open-meteo.com/v1/elevation?latitude=${B.map(h=>h.lat.toFixed(5)).join(',')}&longitude=${B.map(h=>h.lon.toFixed(5)).join(',')}`;const r=await fetch(u);if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(!j.elevation)throw new Error('?');
   B.forEach((h,x)=>{const e=j.elevation[x];if(e!=null&&isFinite(e)){h.ele=Math.round(e);h.ed=1}});await DB.putMany('huts',B);done+=B.length;o.innerHTML=`<div class="note">⛰️ ${done} / ${miss.length}</div>`}
  catch(e){if(++bad>=3){o.innerHTML=`<div class="warn">${L2('Σταμάτησε','Stopped')} (${esc(e.message)}). ${L2('Ό,τι βρέθηκε σώθηκε. Ξαναπάτα αργότερα για τα υπόλοιπα.','What was found is saved. Tap again later for the rest.')}</div>`;wake(0);return}i-=100}
  await new Promise(r=>setTimeout(r,bad?3000:400))}
 wake(0);HUT.A=null;hutPage()}

/* ---------- Λίστα ---------- */
let HUT={A:null,lim:150};
function hutF(){const f=LS.g('hutf',null)||{},rg=LS.g('hutr',''),q=norm2(($('#htq')||{}).value||'').trim(),A=HUT.A||[];
 const ref=pos||LS.g('lastfix',null);
 const R=A.filter(h=>f[h.c]!==false&&(rg===''||rg===null||h.rg===+rg)&&(!q||norm2(h.n+' '+h.town+' '+hcN(HCI[h.c])).includes(q)));
 if(ref)R.forEach(h=>h.dd=dist(ref,h));
 R.sort(ref?(a,b)=>a.dd-b.dd:(a,b)=>a.rg-b.rg||(a.town>b.town?1:a.town<b.town?-1:0)||(!a.n)-(!b.n));return R}
const hutName=h=>h.n||(hcS(HCI[h.c])+' '+L2('(χωρίς όνομα)','(no name)'));
const hutEleTxt=h=>h.ele!=null?'⛰️ '+(h.ed?'≈':'')+h.ele+' m':'';
async function hutPage(){T('🛖 '+L2('Καταφύγια & camper stops','Huts & camper stops'));mCss();
 if(!HUT.A)HUT.A=await DB.all('huts').catch(()=>[]);const A=HUT.A,m=LS.g('hutm',null),f=LS.g('hutf',null)||{},rg=LS.g('hutr','');
 const upd=`<h3>⬇️ ${L2('Ενημέρωση','Update')}</h3><div class="box">${m?`${L2('Τελευταία ενημέρωση','Last update')}: <b>${new Date(m.t).toLocaleDateString(LOC)}</b> · ${m.n} ${L2('σημεία','places')}`:L2('Η λίστα δεν έχει κατέβει ακόμα.','The list has not been downloaded yet.')}
  <div class="tools" style="margin-top:8px"><button class="btn p" onclick="hutUpdate()">⬇️ ${L2('Ενημέρωση λίστας','Update list')}</button>${A.some(h=>h.ele==null)?`<button class="btn" onclick="hutEle()">⛰️ ${L2('Υψόμετρα που λείπουν','Missing altitudes')} (${A.filter(h=>h.ele==null).length})</button>`:''}</div>
  <div class="muted">${L2('Μία φορά με WiFi, μετά δουλεύει offline. Ξαναπάτα κάθε λίγους μήνες για νέα σημεία.','Once on WiFi, then it works offline. Tap again every few months for new places.')}</div></div><div id="hto"></div>
  <div class="muted">${L2('Πηγή: OpenStreetMap (ODbL), ό,τι έχουν καταγράψει εθελοντές. Μπορεί να λείπουν ή να έχουν κλείσει σημεία. Η «περιοχή» είναι η πλησιέστερη πόλη, κατά προσέγγιση.','Source: OpenStreetMap (ODbL), whatever volunteers have mapped. Places may be missing or closed. The «area» is the nearest town, approximately.')}</div>`;
 if(!A.length){M.innerHTML=`<div class="note">${L2('Όλα τα καταφύγια (ορειβατικά, ΕΟΣ, στέγαστρα), οι χώροι για camper, τα dump station, τα κάμπινγκ και οι πηγές της Ελλάδας, σε μία λίστα που δουλεύει χωρίς internet. Κάθε σημείο με συντεταγμένες και υψόμετρο, για να το ανοίξεις στο Organic Maps / OsmAnd / Google ή να τα περάσεις όλα με ένα αρχείο.','All the huts (mountain, club, shelters), camper areas, dump stations, campsites and springs of Greece, in one list that works offline. Each with coordinates and altitude, to open in Organic Maps / OsmAnd / Google or move them all with one file.')}</div>`+upd;return}
 const byC={},byR={};A.forEach(h=>{if(f[h.c]!==false){byR[h.rg]=(byR[h.rg]||0)+1}byC[h.c]=(byC[h.c]||0)+1});
 M.innerHTML=`<div class="mchip" style="margin:0 0 6px">${HC.map(c=>`<button class="${f[c.id]!==false?'on':''}" onclick="hutC('${c.id}')" style="font-size:.9em">${c.e} ${hcN(c)} <small>${byC[c.id]||0}</small></button>`).join('')}</div>
 <select id="htr" onchange="LS.s('hutr',this.value);HUT.lim=150;hutDraw()"><option value="">🇬🇷 ${L2('Όλη η Ελλάδα','All of Greece')}</option>${HRG.map((r,i)=>byR[i]?`<option value="${i}" ${String(rg)===String(i)?'selected':''}>${hrN(i)} (${byR[i]})</option>`:'').join('')}</select>
 <input id="htq" placeholder="🔎 ${L2('Όνομα, πόλη ή χωριό…','Name, town or village…')}" oninput="HUT.lim=150;hutDraw()">
 <div id="hts" class="muted"></div><div id="htl"></div>
 <h3>📤 ${L2('Όλη η λίστα σε άλλη εφαρμογή','The whole list to another app')}</h3><div class="tools"><button class="btn p" onclick="hutExp('kml')">📤 KML</button><button class="btn" onclick="hutExp('gpx')">📤 GPX</button></div>
 <div class="muted">${L2('Βγάζει ό,τι δείχνει η λίστα (με τα φίλτρα από πάνω). Στο Organic Maps: άνοιξε το αρχείο ή «Κοινή χρήση → Organic Maps» και μπαίνει ως λίστα σελιδοδεικτών, χρωματισμένη ανά είδος, offline. Στο OsmAnd: άνοιξε το GPX.','Exports what the list shows (with the filters above). In Organic Maps: open the file or «Share → Organic Maps» and it becomes a bookmark list, coloured by type, offline. In OsmAnd: open the GPX.')}</div>`+upd;
 hutDraw()}
function hutC(id){const f=LS.g('hutf',null)||{};f[id]=f[id]===false;LS.s('hutf',f);HUT.lim=150;const q=($('#htq')||{}).value;hutPage().then(()=>{if(q){$('#htq').value=q;hutDraw()}})}
function hutDraw(){const e=$('#htl');if(!e)return;const R=hutF(),ref=pos||LS.g('lastfix',null);
 $('#hts').innerHTML=`<b>${R.length}</b> ${L2('σημεία','places')}${ref?' · '+L2('απόσταση σε ευθεία από τη θέση σου','straight-line distance from you'):''}`;
 e.innerHTML=R.slice(0,HUT.lim).map(h=>{const c=HCI[h.c];return`<button class="row" onclick="go('map/h/${h.k}')"><span class="e">${c.e}</span><span style="flex:1;min-width:0"><b>${esc(hutName(h))}</b><small>${esc(h.town)} · ${esc(hrN(h.rg))}${h.ele!=null?' · '+hutEleTxt(h):''}</small></span>${ref?`<b class="mono">${fmD(h.dd)}</b>`:''}</button>`}).join('')+
 (R.length>HUT.lim?`<button class="btn" style="width:100%" onclick="HUT.lim+=300;hutDraw()">${L2('Δείξε κι άλλα','Show more')} (${R.length-HUT.lim})</button>`:'')}

/* ---------- Ένα σημείο ---------- */
async function hutInfo(k){k=decodeURIComponent(k||'');const h=await DB.get('huts',k).catch(()=>null);if(!h)return go('map/huts');const c=HCI[h.c],ref=pos||LS.g('lastfix',null),nm=hutName(h),nq=esc(nm.replace(/'/g,''));
 T(c.e+' '+nm);mCss();
 const rows=Object.entries(h.t||{}).filter(([x])=>TAGL[x]).map(([x,v])=>`<span>${TAGL[x]}</span><b>${/website/.test(x)?`<a href="${esc(v)}" target="_blank" style="color:var(--yel)">${L2('άνοιγμα','open')}</a>`:/phone/.test(x)?`<a href="tel:${esc(v)}" style="color:var(--yel)">${esc(v)}</a>`:esc(YN(v))}</b>`).join('');
 M.innerHTML=`<div class="box"><b style="font-size:1.15em">${esc(nm)}</b><div class="muted">${hcS(c)} · ${esc(h.town)}, ${esc(hrN(h.rg))}${ref?' · '+fmD(dist(ref,h))+' '+L2('σε ευθεία','straight line'):''}</div>
 <div class="mono" style="margin-top:6px;font-size:1.1em">${h.lat.toFixed(6)}, ${h.lon.toFixed(6)}</div><div class="mono muted">${ddm(h.lat,'N','S')} ${ddm(h.lon,'E','W')}</div>
 ${h.ele!=null?`<div style="margin-top:4px">${hutEleTxt(h)}${h.ed?' <small class="muted">('+L2('από μοντέλο εδάφους','from a terrain model')+')</small>':''}</div>`:''}
 ${rows?`<div class="kv" style="margin-top:8px">${rows}</div>`:''}</div>
 <div class="msh" style="box-shadow:none"><div class="mg"><button class="o" onclick="mGoTo(${h.lat},${h.lon},'${nq}')">➡️ ${L2('Πάμε','Go')}</button><button onclick="mCopy(${h.lat},${h.lon})">📋 ${L2('Συντεταγμένες','Coordinates')}</button><button onclick="mFocus('h','${h.k}',${h.lat},${h.lon})">🗺️ ${L2('Στον χάρτη','On the map')}</button>${mApps(h.lat,h.lon,nm)}</div></div>
 <div class="muted" id="minfo"></div>
 <div class="tools"><button class="btn" onclick="hutToSpot('${h.k}')">⭐ ${L2('Κράτα το στα δικά μου','Keep it in mine')}</button><a class="btn" href="https://www.openstreetmap.org/${{n:'node',w:'way',r:'relation'}[h.k[0]]}/${h.k.slice(1)}" target="_blank">OSM ↗</a></div>
 <div class="muted">${L2('Το «Organic» ανοίγει την εφαρμογή Organic Maps αν είναι εγκατεστημένη. Τα στοιχεία είναι από το OpenStreetMap και μπορεί να μην είναι ενημερωμένα.','«Organic» opens the Organic Maps app if installed. Details come from OpenStreetMap and may be out of date.')}</div>`}
async function hutToSpot(k){const h=await DB.get('huts',k);if(!h)return;const cat={hut:'hut',shel:'hut',camp:'camp',caravan:'camp',spring:'water'}[h.c]||'other';
 LS.s('spdraft',{id:'s'+Date.now(),lat:h.lat,lon:h.lon,n:hutName(h),cat,acc:'2wd',r:0,note:hcS(HCI[h.c])+', '+h.town+(h.ele!=null?', '+h.ele+' m':''),t:Date.now(),new:1});go('map/edit/new')}

/* ---------- Export GPX / KML ---------- */
function hutExp(kind){const R=hutF();if(!R.length)return alert(L2('Η λίστα είναι άδεια.','The list is empty.'));const d=new Date().toISOString().slice(0,10),x=s=>esc(s);
 const desc=h=>[hcS(HCI[h.c]),h.town+', '+hrN(h.rg),h.ele!=null?(h.ed?'≈':'')+h.ele+' m':'',h.t&&h.t.fee?L2('χρέωση','fee')+': '+YN(h.t.fee):'',h.t&&h.t.drinking_water?L2('πόσιμο νερό','drinking water')+': '+YN(h.t.drinking_water):'',h.t&&h.t.operator||''].filter(Boolean).join(' · ');
 const title=`Overland’s Habit · ${L2('Καταφύγια & camper stops','Huts & camper stops')} ${d}`;let txt,mime,ext;
 if(kind==='gpx'){txt=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Overland’s Habit" xmlns="http://www.topografix.com/GPX/1/1">\n<metadata><name>${x(title)}</name></metadata>\n`+
  R.map(h=>`<wpt lat="${h.lat}" lon="${h.lon}">${h.ele!=null?`<ele>${h.ele}</ele>`:''}<name>${x(HCI[h.c].e+' '+hutName(h))}</name><desc>${x(desc(h))}</desc><type>${x(hcS(HCI[h.c]))}</type></wpt>`).join('\n')+'\n</gpx>';mime='application/gpx+xml';ext='gpx'}
 else{txt=`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${x(title)}</name>\n`+
  HC.map(c=>`<Style id="placemark-${c.om}"><IconStyle><Icon><href>https://omaps.app/placemarks/placemark-${c.om}.png</href></Icon></IconStyle></Style>`).join('\n')+'\n'+
  R.map(h=>{const c=HCI[h.c];return`<Placemark><name>${x(c.e+' '+hutName(h))}</name><description>${x(desc(h))}</description><styleUrl>#placemark-${c.om}</styleUrl><Point><coordinates>${h.lon},${h.lat}${h.ele!=null?','+h.ele:''}</coordinates></Point></Placemark>`}).join('\n')+'\n</Document></kml>';mime='application/vnd.google-earth.kml+xml';ext='kml'}
 const f=new File([txt],`katafygia-ellada-${d}.${ext}`,{type:mime});
 if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
