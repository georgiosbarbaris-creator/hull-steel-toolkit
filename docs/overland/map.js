/* ===== Overland Habit — Φάση 2: Χάρτης, camper stops (OpenStreetMap), δικά μου σημεία, διαδρομές ===== */
/* Δεδομένα σημείων © OpenStreetMap contributors (ODbL), μέσω Overpass API. */

/* ---------- IndexedDB ---------- */
const DB={db:null,open(){return this.db?Promise.resolve(this.db):new Promise((ok,no)=>{const r=indexedDB.open('ov_db',1);
 r.onupgradeneeded=()=>{const d=r.result;['poi','spots','routes'].forEach(s=>{if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:s==='poi'?'k':'id'})})};
 r.onsuccess=()=>{this.db=r.result;ok(this.db)};r.onerror=()=>no(r.error)})},
 tx(s,m,f){return this.open().then(d=>new Promise((ok,no)=>{const t=d.transaction(s,m),st=t.objectStore(s),q=f(st);t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error)}))},
 all(s){return this.tx(s,'readonly',st=>st.getAll())},get(s,k){return this.tx(s,'readonly',st=>st.get(k))},
 put(s,v){return this.tx(s,'readwrite',st=>st.put(v))},del(s,k){return this.tx(s,'readwrite',st=>st.delete(k))},
 putMany(s,arr){return this.open().then(d=>new Promise((ok,no)=>{const t=d.transaction(s,'readwrite'),st=t.objectStore(s);arr.forEach(v=>st.put(v));t.oncomplete=()=>ok();t.onerror=()=>no(t.error)}))},
 clear(s){return this.tx(s,'readwrite',st=>st.clear())}};

/* ---------- Κατηγορίες σημείων (OSM) ---------- */
const PC=[
 {id:'camp',e:'⛺',n:'Κάμπινγκ',q:['nwr["tourism"="camp_site"]'],on:1},
 {id:'caravan',e:'🚐',n:'Χώροι για camper',q:['nwr["tourism"="caravan_site"]'],on:1},
 {id:'water',e:'🚰',n:'Νερό & πηγές',q:['nwr["amenity"~"^(drinking_water|water_point)$"]','nwr["natural"="spring"]','nwr["man_made"="water_tap"]'],on:1},
 {id:'dump',e:'🛢️',n:'Dump station',q:['nwr["amenity"="sanitary_dump_station"]'],on:1},
 {id:'shower',e:'🚿',n:'Ντους',q:['nwr["amenity"="shower"]'],on:1},
 {id:'wc',e:'🚻',n:'WC',q:['nwr["amenity"="toilets"]'],on:1},
 {id:'fuel',e:'⛽',n:'Καύσιμα / LPG',q:['nwr["amenity"="fuel"]'],on:1},
 {id:'hut',e:'🛖',n:'Καταφύγια',q:['nwr["tourism"~"^(alpine_hut|wilderness_hut)$"]','nwr["amenity"="shelter"]'],on:1},
 {id:'view',e:'🏞️',n:'Θέα',q:['nwr["tourism"="viewpoint"]'],on:1},
 {id:'picnic',e:'🧺',n:'Πικνίκ',q:['nwr["tourism"="picnic_site"]'],on:0},
 {id:'health',e:'🏥',n:'Νοσοκομείο & φαρμακείο',q:['nwr["amenity"~"^(hospital|clinic|pharmacy)$"]'],on:1},
 {id:'repair',e:'🔧',n:'Συνεργεία & ελαστικά',q:['nwr["shop"~"^(car_repair|tyres)$"]'],on:0},
 {id:'laundry',e:'👕',n:'Πλυντήριο',q:['nwr["shop"="laundry"]'],on:0}];
const PCI=Object.fromEntries(PC.map(c=>[c.id,c]));
function poiCat(t){const a=t.amenity,tu=t.tourism;
 if(tu==='camp_site')return'camp';if(tu==='caravan_site')return'caravan';if(a==='drinking_water'||a==='water_point'||t.natural==='spring'||t.man_made==='water_tap')return'water';
 if(a==='sanitary_dump_station')return'dump';if(a==='shower')return'shower';if(a==='toilets')return'wc';if(a==='fuel')return'fuel';if(tu==='alpine_hut'||tu==='wilderness_hut'||a==='shelter')return'hut';
 if(tu==='viewpoint')return'view';if(tu==='picnic_site')return'picnic';if(a==='hospital'||a==='clinic'||a==='pharmacy')return'health';if(t.shop==='car_repair'||t.shop==='tyres')return'repair';if(t.shop==='laundry')return'laundry';return null}
const KEEP=['name','name:en','opening_hours','fee','charge','phone','contact:phone','website','contact:website','drinking_water','toilets','shower','power_supply','capacity','tents','caravans','motorhome','fuel:lpg','fuel:diesel','description','ele','access','operator','amenity','healthcare','backcountry','tourism','reservation','internet_access','dog','sanitary_dump_station:water_point','water_point','seasonal'];
const TAGL={opening_hours:'Ωράριο',fee:'Χρέωση',charge:'Τιμή',phone:'Τηλέφωνο','contact:phone':'Τηλέφωνο',website:'Ιστοσελίδα','contact:website':'Ιστοσελίδα',drinking_water:'Πόσιμο νερό',toilets:'WC',shower:'Ντους',power_supply:'Ρεύμα',capacity:'Θέσεις',tents:'Σκηνές',caravans:'Τροχόσπιτα',motorhome:'Αυτοκινούμενα','fuel:lpg':'LPG','fuel:diesel':'Diesel',description:'Περιγραφή',ele:'Υψόμετρο (m)',access:'Πρόσβαση',operator:'Διαχειριστής',reservation:'Κράτηση',internet_access:'Internet',dog:'Σκύλοι',seasonal:'Εποχιακό'};
const YN=v=>({yes:'ναι',no:'όχι',customers:'μόνο πελάτες',private:'ιδιωτικό',permissive:'επιτρέπεται',wlan:'Wi-Fi',required:'απαιτείται'}[v]||v);

/* ---------- Χάρτες ---------- */
const LAYERS={osm:['Δρόμοι (OSM)','https://tile.openstreetmap.org/{z}/{x}/{y}.png',19,'© OpenStreetMap contributors'],
 topo:['Τοπογραφικός','https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',17,'© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)'],
 sat:['Δορυφόρος','https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',19,'Tiles © Esri — Esri, Maxar, Earthstar Geographics']};
let MP={map:null,tl:null,poiL:null,myL:null,rtL:null,meM:null,acc:null,follow:true,add:false,plan:null,iv:null,P:[],S:[],lastFix:0};
const filt=()=>LS.g('mfilt',Object.fromEntries(PC.map(c=>[c.id,!!c.on])));
function mapIcon(e,bg,sz){sz=sz||30;return L.divIcon({className:'',html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${bg||'#262422'};border:2px solid #f5f0e8;display:flex;align-items:center;justify-content:center;font-size:${sz*.55}px;box-shadow:0 1px 4px #000a">${e}</div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]})}
const ACC=[['2wd','🚗','Κάθε αυτοκίνητο','#5f9e7a'],['awd','🚙','SUV / AWD','#6a9fb5'],['4x4','🛻','4×4 με κοντά','#e8b86d'],['hard','⛰️','4×4 + μπλοκέ / δύσκολο','#d9534f']];
const SPC=[['wild','🌲','Ελεύθερο κάμπινγκ'],['camp','⛺','Κάμπινγκ'],['water','🚰','Νερό / πηγή'],['view','🏞️','Θέα'],['obst','🚧','Δύσκολο πέρασμα'],['fuel','⛽','Καύσιμα'],['food','🍽️','Φαγητό / ταβέρνα'],['other','📌','Άλλο']];

/* ---------- Σελίδα χάρτη ---------- */
async function mapPage(sub,arg){if(sub==='list')return mList();if(sub==='dl')return mDl();if(sub==='p')return mPoi(arg);if(sub==='my')return mMy();if(sub==='edit')return mEdit(arg);if(sub==='routes')return mRoutes();if(sub==='r')return mRoute(arg);
 T('🗺️ Χάρτης');const f=filt(),lay=LS.g('mlay','topo');
 M.innerHTML=`<div class="tools mtb" style="margin:0 0 6px;flex-wrap:nowrap;overflow-x:auto">
 <button class="btn p" onclick="go('map/dl')">⬇️ Κατέβασε</button><button class="btn" onclick="go('map/list')">📋 Λίστα</button><button class="btn" id="madd" onclick="mAddMode()">➕ Σημείο</button><button class="btn" onclick="go('map/routes')">🛣️ Διαδρομές</button><button class="btn" onclick="go('map/my')">⭐ Δικά μου</button></div>
 <div class="tools mtb" style="margin:0 0 6px;flex-wrap:nowrap;overflow-x:auto">${PC.map(c=>`<button class="btn ${f[c.id]?'p':''}" style="padding:6px 9px;white-space:nowrap" onclick="mFilt('${c.id}',this)">${c.e}</button>`).join('')}</div>
 <div style="position:relative"><div id="map" style="height:60vh;border-radius:14px;border:1px solid var(--line)"></div>
 <div style="position:absolute;right:8px;top:8px;z-index:500;display:flex;flex-direction:column;gap:6px">
  <button class="hb" onclick="mLayer()" title="Χάρτης">🗂️</button><button class="hb" id="mfol" onclick="mFollow()" title="Η θέση μου">📍</button><button class="hb" onclick="mFitRoute()" title="Διαδρομή">🛣️</button><button class="hb" onclick="mGoogle()" title="Google Maps" style="font-size:.75em;font-weight:900">G</button></div>
 <div id="mbar" style="position:absolute;left:8px;right:60px;bottom:30px;z-index:500"></div></div>
 <div class="muted" id="minfo" style="margin-top:6px"></div>`;
 const h=window.innerHeight-$('#map').getBoundingClientRect().top-($('#nv').offsetHeight||70)-30;$('#map').style.height=Math.max(300,h)+'px';
 const c=LS.g('mview',{lat:38.6,lon:22.6,z:7});
 MP.map=L.map('map',{zoomControl:false,attributionControl:true}).setView([c.lat,c.lon],c.z);L.control.zoom({position:'bottomright'}).addTo(MP.map);
 mSetLayer(lay);MP.poiL=L.layerGroup().addTo(MP.map);MP.myL=L.layerGroup().addTo(MP.map);MP.rtL=L.layerGroup().addTo(MP.map);
 MP.map.on('moveend',()=>{const ce=MP.map.getCenter();LS.s('mview',{lat:ce.lat,lon:ce.lng,z:MP.map.getZoom()});mDraw()});
 MP.map.on('dragstart',()=>{MP.follow=false;$('#mfol').style.background=''});
 MP.map.on('click',mClick);
 TS.push(()=>{if(MP.iv)clearInterval(MP.iv);MP.iv=null;if(MP.map){MP.map.remove();MP.map=null}MP.add=false;MP.plan=null;MP.meM=null;MP.acc=null});
 MP.follow=false;startGeo();MP.iv=setInterval(mPos,1000);
 [MP.P,MP.S]=await Promise.all([DB.all('poi').catch(()=>[]),DB.all('spots').catch(()=>[])]);
 await mDrawRoute();mDraw();
 if(LS.g('mplan',null))mPlanStart(true);
 if(!MP.P.length)$('#minfo').innerHTML='Δεν έχεις κατεβάσει ακόμα σημεία. Πάτα <b>⬇️ Κατέβασε</b> για την περιοχή που θα πας (θέλει internet μία φορά).';}
function mSetLayer(k){const l=LAYERS[k]||LAYERS.topo;if(MP.tl)MP.map.removeLayer(MP.tl);MP.tl=L.tileLayer(l[1],{maxZoom:l[2],maxNativeZoom:l[2],attribution:l[3],crossOrigin:'anonymous'}).addTo(MP.map);LS.s('mlay',k)}
function mLayer(){const ks=Object.keys(LAYERS),cur=LS.g('mlay','topo'),nx=ks[(ks.indexOf(cur)+1)%ks.length];mSetLayer(nx);mToast('🗂️ '+LAYERS[nx][0])}
function mToast(t){const i=$('#minfo');if(i)i.innerHTML=t}
function mFilt(id,b){const f=filt();f[id]=!f[id];LS.s('mfilt',f);b.classList.toggle('p',f[id]);mDraw()}
function mFollow(){MP.follow=true;$('#mfol').style.background='var(--org)';if(pos)MP.map.setView([pos.lat,pos.lon],Math.max(MP.map.getZoom(),13));else mToast('📡 Περιμένω GPS…')}
function mPos(){if(!MP.map||!pos)return;const ll=[pos.lat,pos.lon];
 if(!MP.meM){MP.acc=L.circle(ll,{radius:pos.acc||20,color:'#6a9fb5',weight:1,fillOpacity:.15}).addTo(MP.map);MP.meM=L.marker(ll,{icon:L.divIcon({className:'',html:'<div id="mearr" style="width:22px;height:22px;border-radius:50%;background:#6a9fb5;border:3px solid #fff;box-shadow:0 0 6px #000"></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:1000}).addTo(MP.map)}
 else{MP.meM.setLatLng(ll);MP.acc.setLatLng(ll).setRadius(pos.acc||20)}
 if(MP.follow)MP.map.panTo(ll,{animate:true});mRouteBar()}
function mDraw(){if(!MP.map)return;MP.poiL.clearLayers();MP.myL.clearLayers();const f=filt(),b=MP.map.getBounds().pad(.2),z=MP.map.getZoom();
 let shown=0,inb=0;if(z>=9){for(const p of MP.P){if(!f[p.c]||!b.contains([p.lat,p.lon]))continue;inb++;if(shown>=600)continue;shown++;
  L.marker([p.lat,p.lon],{icon:mapIcon(PCI[p.c].e,'#262422',z>=13?32:26)}).on('click',()=>go('map/p/'+encodeURIComponent(p.k))).addTo(MP.poiL)}}
 MP.S.forEach(s=>{const a=ACC.find(x=>x[0]===s.acc)||ACC[0],c=SPC.find(x=>x[0]===s.cat)||SPC[7];L.marker([s.lat,s.lon],{icon:mapIcon(c[1],a[3],34),zIndexOffset:500}).on('click',()=>go('map/edit/'+s.id)).addTo(MP.myL)});
 const w=LS.g('wps',[]);w.forEach(p=>L.marker([p.lat,p.lon],{icon:mapIcon('⭐','#3a2c1c',26)}).bindPopup(esc(p.n)).addTo(MP.myL));
 if(trk.length>1)L.polyline(trk.map(p=>[p.lat,p.lon]),{color:'#e8b86d',weight:4,opacity:.9}).addTo(MP.myL);
 if(!MP.add&&!MP.plan)mToast(z<9&&MP.P.length?`Ζούμαρε πιο κοντά για να δεις τα σημεία (${MP.P.length} κατεβασμένα).`:MP.P.length?`${inb} σημεία εδώ${inb>shown?` (δείχνω ${shown})`:''} · ${MP.S.length} δικά μου`:'')}

/* ---------- Πάτημα στον χάρτη: νέο σημείο / σχεδίαση ---------- */
function mAddMode(){MP.add=!MP.add;$('#madd').classList.toggle('p',MP.add);mToast(MP.add?'👆 Πάτα στον χάρτη όπου είναι το σημείο — ή <button class="btn" onclick="mAddHere()">📍 Εδώ που είμαι</button>':'')}
function mAddHere(){if(!pos)return alert('Περιμένω GPS…');MP.add=false;mNewSpot(pos.lat,pos.lon)}
function mClick(e){if(MP.plan)return mPlanAdd(e.latlng);if(MP.add){MP.add=false;mNewSpot(e.latlng.lat,e.latlng.lng)}}
function mNewSpot(lat,lon){const id='s'+Date.now();LS.s('spdraft',{id,lat:+lat.toFixed(6),lon:+lon.toFixed(6),n:'',cat:'wild',acc:'2wd',r:0,note:'',t:Date.now(),new:1});go('map/edit/'+id)}

/* ---------- Κατέβασμα σημείων (Overpass) ---------- */
const OVP=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];
function mDl(){T('⬇️ Κατέβασε σημεία');const f=filt(),v=LS.g('mview',{lat:38.6,lon:22.6,z:7}),rt=LS.g('ract',null);
 M.innerHTML=`<div class="note">Θέλει internet <b>μία φορά</b>. Μετά τα σημεία μένουν στο κινητό και δουλεύουν offline. Πηγή: OpenStreetMap — ό,τι έχουν καταγράψει εθελοντές· στα ορεινά λείπουν πράγματα, γι' αυτό υπάρχουν και τα «Δικά μου».</div>
 <h3>Τι να κατεβάσω</h3>${PC.map(c=>`<div class="chk ${f[c.id]?'on':''}" onclick="mFilt('${c.id}',{classList:{toggle:()=>{}}});this.classList.toggle('on');this.querySelector('.bx').textContent=this.classList.contains('on')?'✓':''"><div class="bx">${f[c.id]?'✓':''}</div><span>${c.e} ${c.n}</span></div>`).join('')}
 <h3>Πού</h3>
 <button class="row" onclick="mDlGo('view')"><span class="e">🗺️</span><span><b>Η περιοχή που βλέπω στον χάρτη</b><small>${v.z<8?'⚠️ πολύ μεγάλη — ζούμαρε λίγο πρώτα':'κέντρο '+v.lat.toFixed(2)+', '+v.lon.toFixed(2)}</small></span></button>
 <div class="box"><b>📍 Γύρω μου</b><div class="seg" style="margin-top:6px">${[10,25,50,100].map(r=>`<button onclick="mDlGo('me',${r})">${r} km</button>`).join('')}</div></div>
 ${rt?`<button class="row" onclick="mDlGo('route')"><span class="e">🛣️</span><span><b>Κατά μήκος της ενεργής διαδρομής</b><small>ζώνη ${LS.g('corr',5)} km δεξιά-αριστερά</small></span></button><label>Ζώνη (km)</label><input type="number" inputmode="decimal" value="${LS.g('corr',5)}" onchange="LS.s('corr',Math.max(1,Math.min(20,n(this.value))))">`:'<div class="muted">Για σημεία κατά μήκος διαδρομής, φόρτωσε ή σχεδίασε πρώτα μια διαδρομή (🛣️ Διαδρομές).</div>'}
 <div id="dlo"></div><h3>Αποθηκευμένα</h3><div id="dls" class="muted">…</div>`;mDlStats()}
async function mDlStats(){const P=await DB.all('poi').catch(()=>[]),e=$('#dls');if(!e)return;const by={};P.forEach(p=>by[p.c]=(by[p.c]||0)+1);
 e.innerHTML=P.length?`<div class="box">${PC.filter(c=>by[c.id]).map(c=>`${c.e} ${c.n}: <b>${by[c.id]}</b>`).join('<br>')}<div class="muted" style="margin-top:6px">Σύνολο ${P.length} σημεία</div></div><button class="btn r" onclick="mDlClear()">🗑 Σβήσε όλα τα κατεβασμένα</button>`:'Τίποτα ακόμα.'}
async function mDlClear(){if(!confirm('Να σβηστούν όλα τα κατεβασμένα σημεία; (τα δικά σου μένουν)'))return;await DB.clear('poi');mDlStats()}
function simplify(pts,max){if(pts.length<=max)return pts;const st=pts.length/max,o=[];for(let i=0;i<pts.length;i+=st)o.push(pts[Math.floor(i)]);o.push(pts[pts.length-1]);return o}
async function mDlGo(kind,r){const f=filt(),cats=PC.filter(c=>f[c.id]);if(!cats.length)return alert('Διάλεξε τουλάχιστον μία κατηγορία.');const o=$('#dlo');let area,label;
 if(kind==='view'){const v=LS.g('mview',{lat:38.6,lon:22.6,z:7});if(v.z<8&&!confirm('Η περιοχή είναι πολύ μεγάλη και μπορεί να αργήσει ή να αποτύχει. Συνέχεια;'))return;
  const d=180/Math.pow(2,v.z)*1.6,dl=d*1.4;area=`(${(v.lat-d).toFixed(4)},${(v.lon-dl).toFixed(4)},${(v.lat+d).toFixed(4)},${(v.lon+dl).toFixed(4)})`;label='Περιοχή χάρτη'}
 else if(kind==='me'){o.innerHTML='<div class="muted">📡 Βρίσκω τη θέση σου…</div>';const p=await new Promise(ok=>navigator.geolocation.getCurrentPosition(x=>ok(x.coords),()=>ok(null),{enableHighAccuracy:true,timeout:30000,maximumAge:60000}));if(!p){o.innerHTML='<div class="warn">Δεν βρέθηκε θέση.</div>';return}
  area=`(around:${r*1000},${p.latitude.toFixed(5)},${p.longitude.toFixed(5)})`;label=`${r} km γύρω από ${p.latitude.toFixed(2)}, ${p.longitude.toFixed(2)}`}
 else{const R=await DB.get('routes',LS.g('ract',null));if(!R)return;const pts=simplify(R.pts,120);area=`(around:${LS.g('corr',5)*1000},${pts.map(p=>p[0].toFixed(5)+','+p[1].toFixed(5)).join(',')})`;label='Διαδρομή: '+R.n}
 const q=`[out:json][timeout:90];(${cats.map(c=>c.q.map(x=>x+area+';').join('')).join('')});out center tags;`;
 o.innerHTML='<div class="note">⏳ Κατεβάζω… (μέχρι 1–2 λεπτά για μεγάλες περιοχές)</div>';let js=null,err='';
 for(const u of OVP){try{const res=await fetch(u,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'}});if(!res.ok){err='HTTP '+res.status;continue}js=await res.json();break}catch(e){err=e.message}}
 if(!js){o.innerHTML=`<div class="warn">Δεν κατέβηκαν (${esc(err)}). Έλεγξε το internet ή δοκίμασε μικρότερη περιοχή.</div>`;return}
 const now=Date.now(),arr=[];for(const el of js.elements||[]){const t=el.tags||{},c=poiCat(t);if(!c)continue;const la=el.lat!=null?el.lat:el.center&&el.center.lat,lo=el.lon!=null?el.lon:el.center&&el.center.lon;if(la==null)continue;
  const tg={};KEEP.forEach(k=>{if(t[k]!=null)tg[k]=t[k]});arr.push({k:el.type[0]+el.id,c,n:t.name||t['name:en']||'',lat:+la.toFixed(6),lon:+lo.toFixed(6),t:tg,d:now})}
 await DB.putMany('poi',arr);const by={};arr.forEach(p=>by[p.c]=(by[p.c]||0)+1);
 o.innerHTML=`<div class="tip">✅ ${esc(label)}: <b>${arr.length}</b> σημεία<br>${cats.map(c=>`${c.e} ${by[c.id]||0}`).join(' · ')}</div><button class="btn p" onclick="go('map')">🗺️ Δες τα στον χάρτη</button>`;mDlStats()}

/* ---------- Λίστα σημείων ---------- */
async function mList(){T('📋 Σημεία κοντά');const P=await DB.all('poi').catch(()=>[]),S=await DB.all('spots').catch(()=>[]),f=filt(),v=LS.g('mview',{lat:38.6,lon:22.6}),ref=pos||LS.g('lastfix',null)||{lat:v.lat,lon:v.lon};
 const L1=P.filter(p=>f[p.c]).map(p=>({p,d:dist(ref,p),my:0})),L2=S.map(p=>({p,d:dist(ref,p),my:1})),A=L1.concat(L2).sort((a,b)=>a.d-b.d).slice(0,150);
 M.innerHTML=`<div class="muted">Απόσταση σε ευθεία από ${pos?'τη θέση σου':'το κέντρο του χάρτη'}. Φίλτρα κατηγοριών: από τα κουμπιά του χάρτη.</div><input id="mlq" placeholder="🔎 Αναζήτηση ονόματος…" oninput="mListF()">`+
 (A.length?`<div id="mll">${A.map(({p,d,my})=>{const c=my?(SPC.find(x=>x[0]===p.cat)||SPC[7]):[0,PCI[p.c].e,PCI[p.c].n];return`<button class="row" data-q="${esc(norm2((p.n||'')+' '+c[2]))}" onclick="go('map/${my?'edit':'p'}/${encodeURIComponent(my?p.id:p.k)}')"><span class="e">${c[1]}</span><span style="flex:1"><b>${esc(p.n||c[2])}${my?' ⭐':''}</b><small>${c[2]}${!my&&p.t.fee?' · χρέωση: '+esc(YN(p.t.fee)):''}</small></span><b class="mono">${fmD(d)}</b></button>`}).join('')}</div>`:'<div class="note">Κανένα σημείο. Πάτα ⬇️ Κατέβασε στον χάρτη.</div>')}
const norm2=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function mListF(){const q=norm2($('#mlq').value.trim());document.querySelectorAll('#mll .row').forEach(r=>r.style.display=!q||r.dataset.q.includes(q)?'':'none')}

/* ---------- Λεπτομέρειες σημείου OSM ---------- */
async function mPoi(k){k=decodeURIComponent(k);const p=await DB.get('poi',k);if(!p)return go('map');const c=PCI[p.c];T(c.e+' '+(p.n||c.n));const ref=pos||LS.g('lastfix',null);
 const rows=Object.entries(p.t).filter(([k])=>TAGL[k]).map(([k,v])=>`<span>${TAGL[k]}</span><b>${/website/.test(k)?`<a href="${esc(v)}" target="_blank" style="color:var(--yel)">άνοιγμα</a>`:/phone/.test(k)?`<a href="tel:${esc(v)}" style="color:var(--yel)">${esc(v)}</a>`:esc(YN(v))}</b>`).join('');
 M.innerHTML=`<div class="box"><b style="font-size:1.15em">${esc(p.n||c.n)}</b><div class="muted">${c.n}${ref?' · '+fmD(dist(ref,p))+' σε ευθεία':''}</div><div class="mono muted" style="margin-top:4px">${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</div>
 ${rows?`<div class="kv" style="margin-top:8px">${rows}</div>`:''}</div>
 <div class="grid"><button class="big org" style="font-size:1em" onclick="mGoTo(${p.lat},${p.lon},'${esc((p.n||c.n).replace(/'/g,''))}')">➡️ Πάμε<small>βέλος πυξίδας</small></button><a class="big blu" style="font-size:1em" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank">🧭 Google Maps<small>οδηγίες δρόμου</small></a></div>
 <div class="tools"><button class="btn" onclick="LS.s('mview',{lat:${p.lat},lon:${p.lon},z:15});go('map')">🗺️ Στον χάρτη</button><button class="btn" onclick="mToSpot('${esc(k)}')">⭐ Κράτα το στα δικά μου</button><a class="btn" href="https://www.openstreetmap.org/${{n:'node',w:'way',r:'relation'}[k[0]]}/${k.slice(1)}" target="_blank">OSM ↗</a></div>
 <div class="muted">Τα στοιχεία είναι από το OpenStreetMap και μπορεί να μην είναι ενημερωμένα. Αν κάτι είναι λάθος, μπορείς να το διορθώσεις στο openstreetmap.org.</div>`}
function mGoTo(lat,lon,nm){const w=LS.g('wps',[]);let i=w.findIndex(p=>Math.abs(p.lat-lat)<1e-5&&Math.abs(p.lon-lon)<1e-5);if(i<0){w.push({n:nm,lat,lon,t:Date.now()});LS.s('wps',w);i=w.length-1}tgt=i;LS.s('tgt',i);go('t/compass')}
async function mToSpot(k){const p=await DB.get('poi',k),c=PCI[p.c],cat={camp:'camp',caravan:'camp',water:'water',view:'view',fuel:'fuel'}[p.c]||'other';LS.s('spdraft',{id:'s'+Date.now(),lat:p.lat,lon:p.lon,n:p.n||c.n,cat,acc:'2wd',r:0,note:'',t:Date.now(),new:1});go('map/edit/new')}

/* ---------- Δικά μου σημεία ---------- */
async function mMy(){T('⭐ Τα δικά μου σημεία');const S=(await DB.all('spots').catch(()=>[])).sort((a,b)=>b.t-a.t),ref=pos||LS.g('lastfix',null);
 M.innerHTML=`<div class="tools"><button class="btn p" onclick="go('map');setTimeout(mAddMode,400)">➕ Νέο σημείο</button><button class="btn" onclick="mExport()">📤 Στείλε / export</button><label class="btn" style="color:var(--tx);font-size:.92em">📥 Import<input type="file" accept=".json,.gpx,application/json,application/gpx+xml" style="display:none" onchange="mImport(this.files[0])"></label></div>
 <div class="muted">Export: αρχείο που ανοίγει κάθε Overland Habit (με φωτογραφίες) — έτσι ανταλλάσσετε σημεία στην παρέα. Import δέχεται και GPX (waypoints).</div>`+
 (S.length?S.map(s=>{const c=SPC.find(x=>x[0]===s.cat)||SPC[7],a=ACC.find(x=>x[0]===s.acc)||ACC[0];return`<button class="row" onclick="go('map/edit/${s.id}')"><span class="e">${c[1]}</span><span style="flex:1"><b>${esc(s.n||c[2])}</b><small>${'★'.repeat(s.r||0)}${'☆'.repeat(5-(s.r||0))} · ${a[1]} ${a[2]}${s.ph?' · 📷':''}</small></span>${ref?`<b class="mono">${fmD(dist(ref,s))}</b>`:''}</button>`}).join(''):'<div class="note">Κανένα δικό σου σημείο ακόμα. Κράτα εδώ τα καλά σημεία για ελεύθερο κάμπινγκ, πηγές, δύσκολα περάσματα.</div>')}
async function mEdit(id){let s=id==='new'||(LS.g('spdraft',{}).id===id)?LS.g('spdraft',null):await DB.get('spots',id);if(!s)return go('map/my');T(s.new?'➕ Νέο σημείο':'✏️ '+(s.n||'Σημείο'));let ph='';
 if(s.ph){const u=URL.createObjectURL(s.ph);ph=`<img src="${u}" style="width:100%;border-radius:12px;margin:6px 0">`}
 M.innerHTML=`<div class="mono muted">${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}</div><label>Όνομα</label><input id="spn" value="${esc(s.n)}" placeholder="π.χ. Πλάτωμα κάτω από τα έλατα">
 <label>Τι είναι</label><div class="seg">${SPC.map(c=>`<button class="${c[0]===s.cat?'on':''}" onclick="spSet('cat','${c[0]}',this)">${c[1]} ${c[2]}</button>`).join('')}</div>
 <label>Πρόσβαση</label><div class="seg">${ACC.map(a=>`<button class="${a[0]===s.acc?'on':''}" onclick="spSet('acc','${a[0]}',this)">${a[1]} ${a[2]}</button>`).join('')}</div>
 <label>Βαθμολογία</label><div class="seg">${[1,2,3,4,5].map(r=>`<button class="${r<=(s.r||0)?'on':''}" onclick="spRate(${r})">★</button>`).join('')}</div>
 <label>Σημειώσεις</label><textarea id="spt" rows="3" placeholder="νερό κοντά; σήμα κινητού; επίπεδο; σκιά; ησυχία;">${esc(s.note)}</textarea>
 ${ph}<label class="btn" style="display:block;text-align:center;color:var(--tx)">📷 ${s.ph?'Άλλαξε':'Πρόσθεσε'} φωτογραφία<input type="file" accept="image/*" capture="environment" style="display:none" onchange="spPhoto(this.files[0])"></label>
 <button class="big org" style="margin-top:12px" onclick="spSave()">💾 Αποθήκευση</button>
 ${s.new?'':`<div class="tools"><button class="btn" onclick="mGoTo(${s.lat},${s.lon},'${esc((s.n||'Σημείο').replace(/'/g,''))}')">➡️ Πάμε</button><button class="btn" onclick="LS.s('mview',{lat:${s.lat},lon:${s.lon},z:15});go('map')">🗺️ Στον χάρτη</button><button class="btn r" onclick="spDel('${s.id}')">🗑 Διαγραφή</button></div>`}`;
 mEdit.s=s}
function spSet(k,v,b){mEdit.s[k]=v;b.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')}
function spRate(r){mEdit.s.r=r;document.querySelectorAll('.seg')[2].querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i<r))}
function shrinkImg(file,max=1280,q=0.7){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):no(),'image/jpeg',q)};im.onerror=no;im.src=u})}
async function spPhoto(f){if(!f)return;try{mEdit.s.ph=await shrinkImg(f);const s=mEdit.s;s.n=$('#spn').value;s.note=$('#spt').value;if(s.new)LS.s('spdraft',Object.assign({},s,{ph:null}));await (s.new?Promise.resolve():DB.put('spots',s));const keep=s;mEdit.s=keep;
 const img=document.createElement('img');img.src=URL.createObjectURL(s.ph);img.style.cssText='width:100%;border-radius:12px;margin:6px 0';const old=M.querySelector('img');old?old.replaceWith(img):$('#spt').after(img)}catch(e){alert('Η φωτογραφία δεν φορτώθηκε.')}}
async function spSave(){const s=mEdit.s;s.n=$('#spn').value.trim();s.note=$('#spt').value.trim();delete s.new;await DB.put('spots',s);LS.s('spdraft',null);go('map/my')}
async function spDel(id){if(!confirm('Διαγραφή του σημείου;'))return;await DB.del('spots',id);go('map/my')}
const b2d=b=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(b)});
async function mExport(){const S=await DB.all('spots');if(!S.length)return alert('Δεν έχεις σημεία.');const out=[];for(const s of S){const o=Object.assign({},s);if(s.ph)o.ph=await b2d(s.ph);out.push(o)}
 const f=new File([JSON.stringify({app:'overland-habit',v:1,spots:out})],'overland-spots-'+new Date().toISOString().slice(0,10)+'.json',{type:'application/json'});
 if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'Overland Habit — σημεία'}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
async function mImport(file){if(!file)return;const t=await file.text();let n=0;
 try{if(/^\s*</.test(t)){const g=parseGpx(t);for(const w of g.wps){await DB.put('spots',{id:'s'+Date.now()+'_'+n,lat:w.lat,lon:w.lon,n:w.n,cat:'other',acc:'2wd',r:0,note:'από GPX',t:Date.now()});n++}}
 else{const o=JSON.parse(t);for(const s of o.spots||[]){if(s.ph&&typeof s.ph==='string'){s.ph=await (await fetch(s.ph)).blob()}await DB.put('spots',s);n++}}
 alert(`Μπήκαν ${n} σημεία.`);mMy()}catch(e){alert('Το αρχείο δεν διαβάστηκε.')}}

/* ---------- Διαδρομές ---------- */
function parseGpx(txt){const d=new DOMParser().parseFromString(txt,'application/xml'),num=(e,a)=>parseFloat(e.getAttribute(a));let pts=[...d.getElementsByTagName('trkpt')];if(!pts.length)pts=[...d.getElementsByTagName('rtept')];
 const P=pts.map(e=>{const el=e.getElementsByTagName('ele')[0];return[num(e,'lat'),num(e,'lon'),el?parseFloat(el.textContent):null]}).filter(p=>!isNaN(p[0]));
 const W=[...d.getElementsByTagName('wpt')].map(e=>({lat:num(e,'lat'),lon:num(e,'lon'),n:(e.getElementsByTagName('name')[0]||{}).textContent||'Σημείο'}));
 const nm=(d.querySelector('trk>name,rte>name,metadata>name')||{}).textContent||'';return{pts:P,wps:W,n:nm}}
function rStats(P){let km=0,up=0,dn=0;for(let i=1;i<P.length;i++){km+=dist({lat:P[i-1][0],lon:P[i-1][1]},{lat:P[i][0],lon:P[i][1]})/1000;if(P[i][2]!=null&&P[i-1][2]!=null){const d=P[i][2]-P[i-1][2];if(d>0)up+=d;else dn-=d}}return{km,up,dn}}
async function mRoutes(){T('🛣️ Διαδρομές');const R=(await DB.all('routes').catch(()=>[])).sort((a,b)=>b.t-a.t),act=LS.g('ract',null);
 M.innerHTML=`<div class="grid"><label class="big org" style="font-size:1em;cursor:pointer">📥 Φόρτωσε GPX<small>Wikiloc, OsmAnd, Garmin, φίλοι</small><input type="file" accept=".gpx,application/gpx+xml,application/xml,text/xml" style="display:none" onchange="rImport(this.files[0])"></label>
 <button class="big blu" style="font-size:1em" onclick="LS.s('mplan',{pts:[],snap:true});go('map')">✏️ Σχεδίασε<small>πατώντας στον χάρτη</small></button></div>`+
 (R.length?R.map(r=>`<button class="row" onclick="go('map/r/${r.id}')"><span class="e">${r.id===act?'✅':'🛣️'}</span><span style="flex:1"><b>${esc(r.n)}</b><small>${f1(r.km)} km${r.up?' · ↗ '+f0(r.up)+' m':''}${r.id===act?' · ενεργή':''}</small></span></button>`).join(''):'<div class="note">Καμία διαδρομή ακόμα. Φόρτωσε ένα GPX ή σχεδίασε μια δική σου.</div>')+
 `<div class="muted">Οι διαδρομές μένουν στο κινητό και φαίνονται offline. Η «σχεδίαση με δρόμους» χρειάζεται internet (OSRM, δημόσιος διακομιστής δοκιμών) και ακολουθεί κυρίως ασφαλτοστρωμένους/χωματόδρομους· για καθαρό off-road σχεδίασε με ευθείες ή φόρτωσε GPX.</div>`}
async function rImport(f){if(!f)return;try{const g=parseGpx(await f.text());if(g.pts.length<2&&!g.wps.length)throw 0;let P=g.pts.length>=2?g.pts:g.wps.map(w=>[w.lat,w.lon,null]);P=simplify(P,6000);
 const s=rStats(P),r={id:'r'+Date.now(),n:g.n||f.name.replace(/\.gpx$/i,''),pts:P,wps:g.wps,km:s.km,up:s.up,dn:s.dn,t:Date.now()};await DB.put('routes',r);LS.s('ract',r.id);go('map/r/'+r.id)}catch(e){alert('Το GPX δεν διαβάστηκε.')}}
async function mRoute(id){const r=await DB.get('routes',id);if(!r)return go('map/routes');T('🛣️ '+r.n);const act=LS.g('ract',null)===id,fu=LS.g('fu',{});
 const els=r.pts.filter(p=>p[2]!=null).map(p=>p[2]);let prof='';if(els.length>10){const mn=Math.min(...els),mx=Math.max(...els),st=Math.max(1,Math.floor(els.length/300)),E=els.filter((_,i)=>i%st===0);
  prof=`<div class="box"><b>Υψομετρικό</b><svg viewBox="0 0 300 80" style="width:100%;background:#141312;border-radius:10px;margin-top:6px"><polyline fill="none" stroke="#d97757" stroke-width="2" points="${E.map((e,i)=>`${(i/(E.length-1)*296+2).toFixed(1)},${(76-(e-mn)/Math.max(1,mx-mn)*70).toFixed(1)}`).join(' ')}"/><text x="4" y="12" font-size="10" fill="#a8a29e">${f0(mx)} m</text><text x="4" y="78" font-size="10" fill="#a8a29e">${f0(mn)} m</text></svg></div>`}
 M.innerHTML=`<div class="res"><div class="v">${f1(r.km)} km</div><div class="muted">${r.up?`↗ ${f0(r.up)} m · ↘ ${f0(r.dn)} m · `:''}${r.pts.length} σημεία${r.wps&&r.wps.length?' · '+r.wps.length+' waypoints':''}</div></div>${prof}
 <button class="big org" onclick="LS.s('ract','${id}');LS.s('mfit',1);go('map')">🗺️ ${act?'Δείξε':'Ενεργοποίησε & δείξε'} στον χάρτη</button>
 <div class="tools"><button class="btn" onclick="LS.s('ract','${id}');go('map/dl')">⬇️ Σημεία κατά μήκος</button><button class="btn" onclick="const f=LS.g('fu',{});f.trip=${Math.round(r.km)};LS.s('fu',f);go('t/fuel')">⛽ Φτάνει το καύσιμο;</button><button class="btn" onclick="rGpx('${id}')">📤 GPX</button><button class="btn" onclick="rRen('${id}')">✏️ Όνομα</button>${act?`<button class="btn" onclick="LS.s('ract',null);mRoute('${id}')">⏹ Απενεργοποίηση</button>`:''}<button class="btn r" onclick="rDel('${id}')">🗑</button></div>
 ${r.wps&&r.wps.length?`<h3>Waypoints</h3>${r.wps.map(w=>`<div class="wp"><b>${esc(w.n)}</b><button class="btn" onclick="mGoTo(${w.lat},${w.lon},'${esc(w.n.replace(/'/g,''))}')">➡️</button></div>`).join('')}`:''}`}
async function rRen(id){const r=await DB.get('routes',id),n=prompt('Όνομα διαδρομής:',r.n);if(!n)return;r.n=n;await DB.put('routes',r);mRoute(id)}
async function rDel(id){if(!confirm('Διαγραφή διαδρομής;'))return;await DB.del('routes',id);if(LS.g('ract',null)===id)LS.s('ract',null);go('map/routes')}
async function rGpx(id){const r=await DB.get('routes',id);let g=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Overland Habit" xmlns="http://www.topografix.com/GPX/1/1">\n`;(r.wps||[]).forEach(w=>g+=`<wpt lat="${w.lat}" lon="${w.lon}"><name>${esc(w.n)}</name></wpt>\n`);
 g+=`<trk><name>${esc(r.n)}</name><trkseg>\n${r.pts.map(p=>`<trkpt lat="${p[0]}" lon="${p[1]}">${p[2]!=null?`<ele>${p[2]}</ele>`:''}</trkpt>`).join('\n')}\n</trkseg></trk>\n</gpx>`;
 const f=new File([g],r.n.replace(/[^\wΑ-Ωα-ωά-ώ -]/g,'')+'.gpx',{type:'application/gpx+xml'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f]}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
let RC=null;
async function mDrawRoute(){MP.rtL.clearLayers();RC=null;const id=LS.g('ract',null);if(!id)return;const r=await DB.get('routes',id).catch(()=>null);if(!r||!MP.map)return;
 const ll=r.pts.map(p=>[p[0],p[1]]);L.polyline(ll,{color:'#141312',weight:8,opacity:.6}).addTo(MP.rtL);L.polyline(ll,{color:'#d97757',weight:5}).addTo(MP.rtL);
 L.marker(ll[0],{icon:mapIcon('🟢','#262422',24)}).addTo(MP.rtL);L.marker(ll[ll.length-1],{icon:mapIcon('🏁','#262422',26)}).addTo(MP.rtL);(r.wps||[]).forEach(w=>L.marker([w.lat,w.lon],{icon:mapIcon('📍','#262422',24)}).bindPopup(esc(w.n)).addTo(MP.rtL));
 const cum=[0];for(let i=1;i<r.pts.length;i++)cum.push(cum[i-1]+dist({lat:r.pts[i-1][0],lon:r.pts[i-1][1]},{lat:r.pts[i][0],lon:r.pts[i][1]}));RC={r,cum,ll};
 if(LS.g('mfit',0)){LS.s('mfit',0);MP.map.fitBounds(L.latLngBounds(ll).pad(.1))}}
function mFitRoute(){if(RC)MP.map.fitBounds(L.latLngBounds(RC.ll).pad(.1));else go('map/routes')}
function mRouteBar(){const b=$('#mbar');if(!b)return;if(MP.plan)return;if(!RC||!pos){b.innerHTML='';return}let bi=0,bd=1e12;const P=RC.r.pts,st=P.length>3000?2:1;
 for(let i=0;i<P.length;i+=st){const d=dist(pos,{lat:P[i][0],lon:P[i][1]});if(d<bd){bd=d;bi=i}}const left=RC.cum[RC.cum.length-1]-RC.cum[bi],off=bd>150;
 b.innerHTML=`<div style="background:${off?'#4a1c18':'#1f1e1dee'};border:1px solid ${off?'var(--red)':'var(--line)'};border-radius:12px;padding:6px 10px;font-size:.88em"><b>🏁 ${fmD(left)}</b> μέχρι το τέλος${off?` · <b>⚠️ ${fmD(bd)} εκτός διαδρομής</b>`:''}</div>`}

/* ---------- Σχεδίαση διαδρομής ---------- */
function mPlanStart(){MP.plan=LS.g('mplan',{pts:[],snap:true});MP.plan.geo=null;mPlanUI();mPlanDraw();if(MP.plan.pts.length>1)mPlanRoute()}
function mPlanUI(){const b=$('#mbar');if(!b)return;const p=MP.plan;b.innerHTML=`<div style="background:#1f1e1dee;border:1px solid var(--org);border-radius:12px;padding:8px">
 <div style="font-size:.85em;margin-bottom:6px">✏️ Πάτα στον χάρτη για σημεία · <b id="pkm">${p.km?f1(p.km)+' km':'—'}</b></div>
 <div class="tools" style="margin:0"><button class="btn ${p.snap?'p':''}" style="padding:7px 9px" onclick="MP.plan.snap=!MP.plan.snap;LS.s('mplan',{pts:MP.plan.pts,snap:MP.plan.snap});mPlanUI();mPlanRoute()">${p.snap?'🛣️ Με δρόμους':'📏 Ευθείες'}</button><button class="btn" style="padding:7px 9px" onclick="MP.plan.pts.pop();LS.s('mplan',{pts:MP.plan.pts,snap:MP.plan.snap});mPlanDraw();mPlanRoute()">↶</button><button class="btn g" style="padding:7px 9px" onclick="mPlanSave()">💾</button><button class="btn r" style="padding:7px 9px" onclick="LS.s('mplan',null);MP.plan=null;MP.rtL&&mDrawRoute();$('#mbar').innerHTML='';mDraw()">✖</button></div></div>`}
function mPlanAdd(ll){MP.plan.pts.push([+ll.lat.toFixed(6),+ll.lng.toFixed(6)]);LS.s('mplan',{pts:MP.plan.pts,snap:MP.plan.snap});mPlanDraw();mPlanRoute()}
function mPlanDraw(){if(!MP.map)return;MP.rtL.clearLayers();const p=MP.plan,line=p.geo||p.pts;if(line.length>1)L.polyline(line,{color:'#d97757',weight:5,dashArray:p.geo?null:'8 6'}).addTo(MP.rtL);
 p.pts.forEach((q,i)=>L.marker(q,{icon:mapIcon(String(i+1),'#d97757',22)}).addTo(MP.rtL));let km=0;for(let i=1;i<line.length;i++)km+=dist({lat:line[i-1][0],lon:line[i-1][1]},{lat:line[i][0],lon:line[i][1]})/1000;p.km=km;const e=$('#pkm');if(e)e.textContent=line.length>1?f1(km)+' km':'—'}
let planT=null;function mPlanRoute(){clearTimeout(planT);const p=MP.plan;if(!p)return;p.geo=null;mPlanDraw();if(!p.snap||p.pts.length<2)return;
 planT=setTimeout(async()=>{try{const u=`https://router.project-osrm.org/route/v1/driving/${p.pts.map(q=>q[1]+','+q[0]).join(';')}?overview=full&geometries=geojson`;const j=await (await fetch(u)).json();
  if(j.routes&&j.routes[0]){p.geo=j.routes[0].geometry.coordinates.map(c=>[c[1],c[0]]);mPlanDraw()}}catch(e){mToast('Χωρίς internet — σχεδιάζω με ευθείες.')}},600)}
async function mPlanSave(){const p=MP.plan;const line=p.geo||p.pts;if(line.length<2)return alert('Βάλε τουλάχιστον 2 σημεία.');const n=prompt('Όνομα διαδρομής:','Διαδρομή '+new Date().toLocaleDateString('el-GR'));if(!n)return;
 const P=line.map(q=>[q[0],q[1],null]),s=rStats(P),r={id:'r'+Date.now(),n,pts:P,wps:[],km:s.km,up:0,dn:0,t:Date.now()};await DB.put('routes',r);LS.s('ract',r.id);LS.s('mplan',null);MP.plan=null;go('map/r/'+r.id)}

/* ---------- Google Maps (άνοιγμα της εφαρμογής) ---------- */
async function mGoogle(){const c=MP.map.getCenter(),z=MP.map.getZoom(),r=RC&&RC.r;
 const opts=[['📍 Αυτό που βλέπω',`https://www.google.com/maps/@?api=1&map_action=map&center=${c.lat.toFixed(5)},${c.lng.toFixed(5)}&zoom=${z}&basemap=satellite`]];
 if(pos)opts.push(['🧍 Η θέση μου',`https://www.google.com/maps/search/?api=1&query=${pos.lat.toFixed(5)},${pos.lon.toFixed(5)}`]);
 if(r){const P=r.pts,k=Math.min(8,Math.max(0,Math.floor(P.length/50))),W=[];for(let i=1;i<=k;i++){const q=P[Math.floor(i*P.length/(k+1))];W.push(q[0].toFixed(5)+','+q[1].toFixed(5))}const e=P[P.length-1];
  opts.push(['🛣️ Η διαδρομή μου (οδηγίες)',`https://www.google.com/maps/dir/?api=1&destination=${e[0].toFixed(5)},${e[1].toFixed(5)}${W.length?'&waypoints='+encodeURIComponent(W.join('|')):''}&travelmode=driving`])}
 const b=$('#mbar');b.innerHTML=`<div style="background:#1f1e1dee;border:1px solid var(--line);border-radius:12px;padding:8px"><div style="font-size:.85em;margin-bottom:6px"><b>Άνοιγμα στο Google Maps</b></div>${opts.map(o=>`<a class="btn" style="display:block;margin:4px 0" href="${o[1]}" target="_blank">${o[0]}</a>`).join('')}<button class="btn" onclick="$('#mbar').innerHTML=''">✖ Κλείσε</button></div>`}
