/* ===== Overland Habit, Φάση 2: Χάρτης, camper stops (OpenStreetMap), δικά μου σημεία, διαδρομές ===== */
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
/* Γρήγοροι χάρτες σε CDN (φορτώνουν και με αδύναμο 4G). Ο παλιός OpenTopoMap μένει ως επιλογή. */
const LAYERS={carto:['Απλός (γρήγορος)','https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',19,'© OpenStreetMap contributors © CARTO','🗺️'],
 topo:['Τοπογραφικός','https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',18,'Tiles © Esri, HERE, Garmin, © OpenStreetMap contributors','⛰️'],
 sat:['Δορυφόρος','https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',19,'Tiles © Esri, Esri, Maxar, Earthstar Geographics','🛰️'],
 osm:['Δρόμοι (OSM)','https://tile.openstreetmap.org/{z}/{x}/{y}.png',19,'© OpenStreetMap contributors','🛣️'],
 mapy:['Mapy.com τουριστικός','https://api.mapy.com/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey={k}',18,'<a href="https://api.mapy.com/copyright" target="_blank">© Seznam.cz a.s. a další</a> · <a href="https://mapy.com/" target="_blank"><b>Mapy.com</b></a>','🥾'],
 otm:['Ισοϋψείς (OpenTopoMap, αργός)','https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',17,'© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)','〰️']};
const LAYK=()=>{const k=LS.g('mlay2',null);return LAYERS[k]?k:'carto'};
let MP={map:null,tl:null,poiL:null,myL:null,rtL:null,hiL:null,cv:null,meM:null,acc:null,follow:true,add:false,plan:null,card:null,iv:null,dt:null,P:[],S:[],tick:0,trkN:0};
const filt=()=>LS.g('mfilt',Object.fromEntries(PC.map(c=>[c.id,!!c.on])));
const PCOL={camp:'#5f9e7a',caravan:'#4f8a6a',water:'#4a90c8',dump:'#8a6d4a',shower:'#6aa9d0',wc:'#7a8a9a',fuel:'#e8b86d',hut:'#a0785a',view:'#b07ac0',picnic:'#8fae5a',health:'#d9534f',repair:'#9a9a9a',laundry:'#6a9fb5'};
function mapIcon(e,bg,sz){sz=sz||30;return L.divIcon({className:'',html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${bg||'#262422'};border:2px solid #f5f0e8;display:flex;align-items:center;justify-content:center;font-size:${sz*.55}px;box-shadow:0 1px 4px #000a">${e}</div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]})}
const ACC=[['2wd','🚗','Κάθε αυτοκίνητο','#5f9e7a'],['awd','🚙','SUV / AWD','#6a9fb5'],['4x4','🛻','4×4 με κοντά','#e8b86d'],['hard','⛰️','4×4 + μπλοκέ / δύσκολο','#d9534f']];
const SPC=[['wild','🌲','Ελεύθερο κάμπινγκ'],['camp','⛺','Κάμπινγκ'],['water','🚰','Νερό / πηγή'],['view','🏞️','Θέα'],['obst','🚧','Δύσκολο πέρασμα'],['fuel','⛽','Καύσιμα'],['food','🍽️','Φαγητό / ταβέρνα'],['other','📌','Άλλο']];
function mCss(){if($('#mcss'))return;const st=document.createElement('style');st.id='mcss';st.textContent=`
.msh{background:#1f1e1df2;border:1px solid var(--line);border-radius:16px;padding:10px;box-shadow:0 4px 16px #000a}
.msh .mg{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:8px}
.msh .mg button,.msh .mg a{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:12px;padding:9px 4px;font-size:.82em;font-weight:700;text-align:center;text-decoration:none;line-height:1.2}
.msh .mg .o{background:var(--org);border-color:var(--org);color:#1f1e1d}
.mfab{display:flex;gap:8px}.mfab button{flex:1;background:var(--org);color:#1f1e1d;border:0;border-radius:14px;padding:13px 6px;font-weight:800;font-size:.95em;box-shadow:0 3px 10px #000a}
.mfab button.b{background:#6a9fb5}
.mchip{display:flex;gap:5px;overflow-x:auto;margin-top:6px}.mchip button{flex:0 0 auto;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:7px 9px;font-size:1.15em}.mchip button.on{background:var(--org);border-color:var(--org)}
#mcross{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;z-index:450;pointer-events:none;display:none}
#msr{position:absolute;left:8px;right:60px;top:8px;z-index:600}
#msr .r{display:block;width:100%;text-align:left;background:#1f1e1df2;color:var(--tx);border:1px solid var(--line);border-radius:10px;padding:9px;margin-bottom:3px;font-size:.9em}
@keyframes mpul{0%{transform:scale(.6);opacity:1}100%{transform:scale(2.2);opacity:0}}
.mpul{width:40px;height:40px;border-radius:50%;border:4px solid #d97757;animation:mpul 1.4s ease-out infinite}`;document.head.appendChild(st)}

/* ---------- Σελίδα χάρτη ---------- */
async function mapPage(sub,arg){if(sub==='list')return mList();if(sub==='dl')return mDl();if(sub==='p')return mPoi(arg);if(sub==='my')return mMy();if(sub==='edit')return mEdit(arg);if(sub==='routes')return mRoutes();if(sub==='r')return mRoute(arg);
 T('🗺️ '+L2('Χάρτης','Map'));mCss();const f=filt(),lay=LAYK();
 M.innerHTML=`<div style="display:flex;gap:6px;margin:0 0 6px"><input id="mq" placeholder="🔎 ${L2('Βρες σημείο…','Find a place…')}" oninput="mSearch()" style="flex:1;margin:0;min-width:0">
 <button class="hb" onclick="go('map/dl')" title="${L2('Κατέβασε σημεία','Download places')}">⬇️</button><button class="hb" onclick="go('map/list')" title="${L2('Λίστα','List')}">📋</button><button class="hb" onclick="go('map/my')" title="${L2('Δικά μου','My places')}">⭐</button><button class="hb" onclick="go('map/routes')" title="${L2('Διαδρομές','Routes')}">🛣️</button></div>
 <div class="tools mtb" style="margin:0 0 6px;flex-wrap:nowrap;overflow-x:auto">${PC.map(c=>`<button class="btn ${f[c.id]?'p':''}" style="padding:6px 9px;white-space:nowrap" onclick="mFilt('${c.id}',this)" title="${c.n}">${c.e}</button>`).join('')}</div>
 <div style="position:relative"><div id="map" style="height:60vh;border-radius:14px;border:1px solid var(--line)"></div>
 <div id="mcross"><svg viewBox="0 0 46 46" width="46" height="46"><circle cx="23" cy="23" r="9" fill="none" stroke="#d97757" stroke-width="3"/><path d="M23 0v14M23 32v14M0 23h14M32 23h14" stroke="#d97757" stroke-width="3"/><circle cx="23" cy="23" r="2" fill="#d97757"/></svg></div>
 <div id="msr"></div><div id="mld" style="display:none;position:absolute;left:50%;transform:translateX(-50%);top:46px;z-index:480;background:#1f1e1dcc;border-radius:10px;padding:3px 10px;font-size:.75em;pointer-events:none">⏳ ${L2('φορτώνει ο χάρτης…','loading map…')}</div>
 <div style="position:absolute;right:8px;top:8px;z-index:500;display:flex;flex-direction:column;gap:6px">
  <button class="hb" onclick="mLayer()" title="${L2('Είδος χάρτη','Map type')}">🗂️</button><button class="hb" id="mfol" onclick="mFollow()" title="${L2('Η θέση μου','My location')}">📍</button><button class="hb" onclick="mFitRoute()" title="${L2('Διαδρομή','Route')}">🛣️</button><button class="hb" onclick="mGoogle()" title="Google Maps" style="font-size:.75em;font-weight:900">G</button>
  <button class="hb" onclick="MP.map.zoomIn()" style="font-size:1.3em">+</button><button class="hb" onclick="MP.map.zoomOut()" style="font-size:1.3em">−</button></div>
 <div id="mrb" style="position:absolute;left:8px;top:8px;right:60px;z-index:490;pointer-events:none"></div>
 <div id="mbar" style="position:absolute;left:8px;right:8px;bottom:10px;z-index:500"></div></div>
 <div class="muted" id="minfo" style="margin-top:6px"></div>`;
 const h=window.innerHeight-$('#map').getBoundingClientRect().top-($('#nv').offsetHeight||70)-30;$('#map').style.height=Math.max(320,h)+'px';
 const c=LS.g('mview',{lat:38.6,lon:22.6,z:7}),fo=LS.g('mfocus',null);LS.s('mfocus',null);
 MP.cv=L.canvas({padding:.3});
 MP.map=L.map('map',{zoomControl:false,attributionControl:true,preferCanvas:false,tapTolerance:20}).setView(fo?[fo.lat,fo.lon]:[c.lat,c.lon],fo?Math.max(c.z||0,15):c.z);
 mSetLayer(lay);MP.poiL=L.layerGroup().addTo(MP.map);MP.myL=L.layerGroup().addTo(MP.map);MP.rtL=L.layerGroup().addTo(MP.map);MP.hiL=L.layerGroup().addTo(MP.map);
 MP.map.on('moveend',()=>{const ce=MP.map.getCenter();LS.s('mview',{lat:ce.lat,lon:ce.lng,z:MP.map.getZoom()});clearTimeout(MP.dt);MP.dt=setTimeout(mDrawPoi,150)});
 MP.map.on('dragstart',()=>{MP.follow=false;const b=$('#mfol');if(b)b.style.background='';$('#msr').innerHTML=''});
 MP.map.on('click',mClick);MP.map.on('contextmenu',e=>{if(!MP.plan)mQuick(e.latlng.lat,e.latlng.lng)});
 TS.push(()=>{if(MP.iv)clearInterval(MP.iv);clearTimeout(MP.dt);MP.iv=null;if(MP.map){MP.map.remove();MP.map=null}MP.add=false;MP.plan=null;MP.card=null;MP.meM=null;MP.acc=null});
 MP.follow=false;startGeo();MP.iv=setInterval(mPos,1000);
 [MP.P,MP.S]=await Promise.all([DB.all('poi').catch(()=>[]),DB.all('spots').catch(()=>[])]);if(!MP.map)return;
 await mDrawRoute();mDrawMy();mDrawPoi();
 if(LS.g('mplan',null))mPlanStart();else if(fo)mCard(fo.k,fo.id);else mBarHome();if(LS.g('maddon',0)){LS.s('maddon',0);mAddOn()}
 if(!MP.P.length&&!fo)mToast(L2('Για κάμπινγκ, νερό, καύσιμα κ.λπ. πάτα <b>⬇️</b> πάνω δεξιά (θέλει internet μία φορά). Για δικό σου σημείο: <b>➕ Σημείο</b> ή κράτα το δάχτυλο πατημένο στον χάρτη.','For campsites, water, fuel etc. tap <b>⬇️</b> at the top (needs internet once). For your own place: <b>➕ Place</b> or long-press the map.'))}
function mSetLayer(k){const l=LAYERS[k]||LAYERS.carto,mk=LS.g('mapykey','');if(k==='mapy'&&!mk){mMapyKey();return 0}if(MP.tl)MP.map.removeLayer(MP.tl);
 MP.tl=L.tileLayer(l[1],{k:mk,maxZoom:19,maxNativeZoom:l[2],attribution:l[3],crossOrigin:'anonymous',keepBuffer:4,updateWhenIdle:true,updateWhenZooming:false}).addTo(MP.map);MP.map.setMaxZoom(19);LS.s('mlay2',k);LS.s('mlay',k);
 MP.te=0;MP.ok=0;
 MP.tl.on('tileerror',e=>{const t=e.tile,u=t.src;MP.te++;if((t._r||0)<2){t._r=(t._r||0)+1;setTimeout(()=>{if(MP.map){t.src='';t.src=u}},1200*t._r)}
  if(MP.te===8&&!MP.ok)mToast('📶 '+L2('Αδύναμο σήμα: ο χάρτης φορτώνει αργά, ξαναδοκιμάζω μόνος μου. Τα σημεία σου δουλεύουν κανονικά. Ό,τι έχεις δει με σήμα μένει αποθηκευμένο.','Weak signal: the map loads slowly, I keep retrying. Your places still work. Anything viewed with signal stays saved.'))});
 MP.tl.on('tileload',()=>{MP.ok=1});MP.tl.on('loading',()=>{const e=$('#mld');if(e)e.style.display='block'});MP.tl.on('load',()=>{MP.te=0;const e=$('#mld');if(e)e.style.display='none'});
 if(k!=='carto')setTimeout(()=>{if(MP.map&&!MP.ok&&MP.te>=4&&LAYK()===k){mSetLayer('carto');mToast('🗂️ '+L2('Ο χάρτης δεν φόρτωνε, άλλαξα στον «Απλό (γρήγορο)».','The map wasn\'t loading, switched to “Simple (fast)”.'))}},10000)}
function mMapyKey(){$('#mbar').innerHTML=`<div class="msh"><b>🥾 Mapy.com</b><div style="font-size:.82em;margin-top:4px">${L2('Θέλει δικό σου δωρεάν κλειδί: 1) Γράψου στο developer.mapy.com 2) Πάρε «API key» 3) Επικόλλησέ το εδώ. Μένει μόνο στο κινητό σου.','Needs your own free key: 1) Sign up at developer.mapy.com 2) Get an “API key” 3) Paste it here. It stays only on your phone.')}</div>
 <input id="mpk" placeholder="API key" value="${esc(LS.g('mapykey',''))}" style="margin:6px 0 0"><div class="mg"><a href="https://developer.mapy.com/" target="_blank">🔗 developer.mapy.com</a><button class="o" onclick="const v=$('#mpk').value.trim();if(!v)return;LS.s('mapykey',v);mSetLayer('mapy');mBarHome()">💾 ${L2('Αποθήκευση','Save')}</button><button onclick="MP.plan?mPlanUI():mBarHome()">✖</button></div></div>`}
function mLayer(){const cur=LAYK();$('#mbar').innerHTML=`<div class="msh"><b>🗂️ ${L2('Είδος χάρτη','Map type')}</b><div class="mg" style="grid-template-columns:1fr 1fr">${Object.entries(LAYERS).map(([k,l])=>`<button class="${k===cur?'o':''}" onclick="if(mSetLayer('${k}')!==0)(MP.plan?mPlanUI():mBarHome())">${l[4]} ${l[0]}</button>`).join('')}</div><div class="mg"><button onclick="MP.plan?mPlanUI():mBarHome()">✖ ${L2('Κλείσε','Close')}</button>${LS.g('mapykey','')?`<button onclick="mMapyKey()">🔑 Mapy key</button>`:''}</div></div>`}
function mToast(t){const i=$('#minfo');if(i)i.innerHTML=t}
function mFilt(id,b){const f=filt();f[id]=!f[id];LS.s('mfilt',f);b.classList.toggle('p',f[id]);mDrawPoi()}
function mFollow(){MP.follow=true;$('#mfol').style.background='var(--org)';if(pos)MP.map.setView([pos.lat,pos.lon],Math.max(MP.map.getZoom(),14));else mToast('📡 '+L2('Περιμένω GPS…','Waiting for GPS…'))}
function mPos(){if(!MP.map)return;MP.tick++;
 if(trk.length!==MP.trkN&&MP.tick%10===0)mDrawMy();if(!pos)return;const ll=[pos.lat,pos.lon];
 if(!MP.meM){MP.acc=L.circle(ll,{radius:pos.acc||20,color:'#6a9fb5',weight:1,fillOpacity:.15,interactive:false}).addTo(MP.map);MP.meM=L.marker(ll,{interactive:false,icon:L.divIcon({className:'',html:'<div style="width:22px;height:22px;border-radius:50%;background:#6a9fb5;border:3px solid #fff;box-shadow:0 0 6px #000"></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:1000}).addTo(MP.map)}
 else{MP.meM.setLatLng(ll);MP.acc.setLatLng(ll).setRadius(pos.acc||20)}
 if(MP.follow)MP.map.panTo(ll,{animate:true});if(MP.tick%3===0)mRouteBar()}
/* Σημεία OSM: όταν είναι πολλά, ενώνονται σε «φούσκες» με αριθμό (πάτημα = ζουμ εκεί). Από κοντά, εικονίδια. */
function mDrawPoi(){if(!MP.map)return;MP.poiL.clearLayers();const f=filt(),b=MP.map.getBounds().pad(.1),z=MP.map.getZoom(),A=[];
 if(z>=6)for(const p of MP.P)if(f[p.c]&&b.contains([p.lat,p.lon]))A.push(p);const inb=A.length;let shown=0;
 const one=p=>{const m=z>=13?L.marker([p.lat,p.lon],{icon:mapIcon(PCI[p.c].e,'#262422',30)}):L.circleMarker([p.lat,p.lon],{renderer:MP.cv,radius:7,color:'#f5f0e8',weight:1.5,fillColor:PCOL[p.c]||'#888',fillOpacity:.95});
  m.on('click',ev=>{L.DomEvent.stop(ev);mTap('p',p.k,p.lat,p.lon)}).addTo(MP.poiL);shown++};
 if(z>=16||inb<=40){A.slice(0,300).forEach(one)}
 else{const cs=z>=14?70:z>=11?90:100,G=new Map();
  for(const p of A){const q=MP.map.project([p.lat,p.lon],z),k=Math.floor(q.x/cs)+':'+Math.floor(q.y/cs);let g=G.get(k);if(!g){g={n:0,la:0,lo:0,c:{},p};G.set(k,g)}g.n++;g.la+=p.lat;g.lo+=p.lon;g.c[p.c]=(g.c[p.c]||0)+1}
  G.forEach(g=>{if(g.n===1)return one(g.p);const la=g.la/g.n,lo=g.lo/g.n,top=Object.entries(g.c).sort((x,y)=>y[1]-x[1])[0][0],sz=g.n<10?34:g.n<50?40:g.n<200?46:52;
   L.marker([la,lo],{icon:L.divIcon({className:'',html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:#262422ee;border:3px solid ${PCOL[top]||'#d97757'};display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;box-shadow:0 1px 5px #000a"><span style="font-size:${sz*.32}px">${PCI[top].e}</span><b style="font-size:${sz*.3}px;color:#f5f0e8">${g.n}</b></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]})})
   .on('click',ev=>{L.DomEvent.stop(ev);MP.map.setView([la,lo],Math.min(z+2,16))}).addTo(MP.poiL);shown++})}
 if(!MP.add&&!MP.plan&&!MP.card)mToast(z<6&&MP.P.length?L2(`Ζούμαρε πιο κοντά για να δεις τα σημεία (${MP.P.length} κατεβασμένα).`,`Zoom in to see the places (${MP.P.length} downloaded).`):MP.P.length?`${inb} ${L2('σημεία εδώ','places here')}${inb>40&&z<16?' · '+L2('πάτα μια φούσκα για ζουμ','tap a bubble to zoom'):''} · ${MP.S.length} ${L2('δικά μου','mine')}`:'')}
function mDrawMy(){if(!MP.map)return;MP.myL.clearLayers();
 MP.S.forEach(s=>{const a=ACC.find(x=>x[0]===s.acc)||ACC[0],c=SPC.find(x=>x[0]===s.cat)||SPC[7];L.marker([s.lat,s.lon],{icon:mapIcon(c[1],a[3],36),zIndexOffset:500}).on('click',ev=>{L.DomEvent.stop(ev);mTap('s',s.id,s.lat,s.lon)}).addTo(MP.myL)});
 LS.g('wps',[]).forEach((p,i)=>L.marker([p.lat,p.lon],{icon:mapIcon('⭐','#3a2c1c',28),zIndexOffset:400}).on('click',ev=>{L.DomEvent.stop(ev);mTap('w',i,p.lat,p.lon)}).addTo(MP.myL));
 MP.trkN=trk.length;if(trk.length>1)L.polyline(trk.map(p=>[p.lat,p.lon]),{color:'#e8b86d',weight:4,opacity:.9,interactive:false}).addTo(MP.myL)}
function mDraw(){mDrawMy();mDrawPoi()}
/* Πάτημα σε σημείο: στη σχεδίαση το προσθέτει στη διαδρομή, αλλιώς ανοίγει καρτέλα */
function mTap(k,id,lat,lon){if(MP.plan)return mPlanAdd({lat,lng:lon});if(MP.add){mAddOff()}mCard(k,id)}
function mHi(lat,lon){MP.hiL.clearLayers();L.marker([lat,lon],{interactive:false,zIndexOffset:-10,icon:L.divIcon({className:'',html:'<div class="mpul"></div>',iconSize:[40,40],iconAnchor:[20,20]})}).addTo(MP.hiL)}
function mFocus(k,id,lat,lon){LS.s('mfocus',{k,id,lat,lon});go('map')}
function mItem(k,id){if(k==='s'){const s=MP.S.find(x=>x.id===id);if(!s)return null;const c=SPC.find(x=>x[0]===s.cat)||SPC[7],a=ACC.find(x=>x[0]===s.acc)||ACC[0];return{lat:s.lat,lon:s.lon,e:c[1],n:s.n||c[2],sub:`${c[2]} · ${a[1]} ${a[2]}${s.r?' · '+'★'.repeat(s.r):''}`,note:s.note,ph:s.ph}}
 if(k==='p'){const p=MP.P.find(x=>x.k===id);if(!p)return null;const c=PCI[p.c];return{lat:p.lat,lon:p.lon,e:c.e,n:p.n||c.n,sub:c.n+(p.t.fee?' · '+L2('χρέωση','fee')+': '+YN(p.t.fee):'')+(p.t.opening_hours?' · '+p.t.opening_hours:'')}}
 if(k==='w'){const w=LS.g('wps',[])[id];if(!w)return null;return{lat:w.lat,lon:w.lon,e:'⭐',n:w.n||L2('Σημείο πυξίδας','Compass point'),sub:L2('σημείο της πυξίδας','compass point')}}return null}
function mCard(k,id){const it=mItem(k,id),b=$('#mbar');if(!it||!b)return mBarHome();MP.card={k,id};mHi(it.lat,it.lon);const ref=pos||LS.g('lastfix',null),nm=esc(it.n.replace(/'/g,''));
 const img=it.ph?`<img src="${URL.createObjectURL(it.ph)}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">`:`<span style="font-size:2em">${it.e}</span>`;
 b.innerHTML=`<div class="msh"><div style="display:flex;gap:10px;align-items:center">${img}<div style="flex:1;min-width:0"><b style="font-size:1.05em">${esc(it.n)}</b><div class="muted" style="font-size:.8em">${esc(it.sub)}${ref?' · '+fmD(dist(ref,it))+' '+L2('σε ευθεία','straight line'):''}</div>${it.note?`<div style="font-size:.8em;margin-top:2px">${esc(it.note).slice(0,120)}</div>`:''}</div><button class="hb" onclick="mBarHome()">✖</button></div>
 <div class="mg"><button class="o" onclick="mGoTo(${it.lat},${it.lon},'${nm}')">➡️ ${L2('Πάμε','Go')}</button>
 <button onclick="mRouteTo(${it.lat},${it.lon})">🛣️ ${L2('Διαδρομή ως εδώ','Route here')}</button>
 <a href="https://www.google.com/maps/dir/?api=1&destination=${it.lat},${it.lon}" target="_blank">🧭 Google</a>
 ${k==='s'?`<button onclick="go('map/edit/${id}')">✏️ ${L2('Αλλαγή','Edit')}</button>`:k==='p'?`<button onclick="go('map/p/${encodeURIComponent(id)}')">ℹ️ ${L2('Στοιχεία','Details')}</button>`:`<button onclick="mQuick(${it.lat},${it.lon},'${nm}')">⭐ ${L2('Κράτα το','Keep it')}</button>`}</div></div>`}
function mBarHome(){MP.card=null;MP.hiL&&MP.hiL.clearLayers();const b=$('#mbar');if(!b)return;
 b.innerHTML=`<div class="mfab"><button onclick="mAddOn()">➕ ${L2('Σημείο','Place')}</button><button class="b" onclick="mPlanNew()">✏️ ${L2('Διαδρομή','Route')}</button></div>`;mDrawPoi()}

/* ---------- Αναζήτηση στον χάρτη ---------- */
function mSearch(){const q=norm2($('#mq').value.trim()),o=$('#msr');if(!o)return;if(q.length<2){o.innerHTML='';return}const ref=MP.map.getCenter(),R=[];
 MP.S.forEach(s=>{const c=SPC.find(x=>x[0]===s.cat)||SPC[7];if(norm2((s.n||'')+' '+c[2]).includes(q))R.push(['s',s.id,s,c[1]+' '+(s.n||c[2])+' ⭐'])});
 LS.g('wps',[]).forEach((w,i)=>{if(norm2(w.n||'').includes(q))R.push(['w',i,w,'⭐ '+w.n])});
 MP.P.forEach(p=>{if(p.n&&norm2(p.n+' '+PCI[p.c].n).includes(q))R.push(['p',p.k,p,PCI[p.c].e+' '+p.n])});
 R.forEach(r=>r.d=dist({lat:ref.lat,lon:ref.lng},r[2]));R.sort((a,b)=>(a[0]==='p')-(b[0]==='p')||a.d-b.d);
 o.innerHTML=R.length?R.slice(0,8).map((r,i)=>`<button class="r" onclick="mSearchGo(${i})">${esc(r[3])} <span class="muted" style="float:right">${fmD(r.d)}</span></button>`).join(''):`<div class="r">${L2('Δεν βρέθηκε. Ψάχνω στα δικά σου και στα κατεβασμένα σημεία.','Nothing found. I search your places and downloaded places.')}</div>`;mSearch.R=R}
function mSearchGo(i){const r=mSearch.R[i];$('#msr').innerHTML='';$('#mq').value='';$('#mq').blur();MP.follow=false;MP.map.setView([r[2].lat,r[2].lon],Math.max(MP.map.getZoom(),15));mCard(r[0],r[1])}

/* ---------- Νέο σημείο: σταυρός στο κέντρο, πάτημα ή παρατεταμένο πάτημα ---------- */
function mAddOn(){MP.add=true;MP.card=null;MP.hiL.clearLayers();$('#mcross').style.display='block';
 $('#mbar').innerHTML=`<div class="msh"><div style="font-size:.88em">🎯 ${L2('Σύρε τον χάρτη ώστε ο σταυρός να πέσει στο σημείο, ή πάτα κατευθείαν πάνω του.','Drag the map so the cross sits on the spot, or tap right on it.')}</div>
 <div class="mg"><button class="o" onclick="const c=MP.map.getCenter();mQuick(c.lat,c.lng)">✅ ${L2('Εδώ','Here')}</button><button onclick="mAddHere()">📍 ${L2('Η θέση μου','My location')}</button><button onclick="mBarHome2()">✖ ${L2('Άκυρο','Cancel')}</button></div></div>`}
function mAddOff(){MP.add=false;const c=$('#mcross');if(c)c.style.display='none'}
function mBarHome2(){mAddOff();mBarHome()}
function mAddMode(){mAddOn()}
function mAddHere(){if(!pos)return alert(L2('Περιμένω GPS…','Waiting for GPS…'));mQuick(pos.lat,pos.lon)}
function mClick(e){$('#msr').innerHTML='';if(MP.plan)return mPlanAdd(e.latlng);if(MP.add)return mQuick(e.latlng.lat,e.latlng.lng);if(MP.card)mBarHome()}
/* Γρήγορη αποθήκευση πάνω στον χάρτη, χωρίς να φύγεις από αυτόν */
function mQuick(lat,lon,nm){mAddOff();MP.card=null;mHi(lat,lon);MP.q={id:'s'+Date.now(),lat:+(+lat).toFixed(6),lon:+(+lon).toFixed(6),n:nm||'',cat:'wild',acc:'2wd',r:0,note:'',t:Date.now()};
 $('#mbar').innerHTML=`<div class="msh"><b>⭐ ${L2('Νέο δικό μου σημείο','New place of mine')}</b> <span class="mono muted" style="font-size:.75em">${MP.q.lat.toFixed(5)}, ${MP.q.lon.toFixed(5)}</span>
 <input id="qn" value="${esc(nm||'')}" placeholder="${L2('Όνομα (π.χ. Πλάτωμα στα έλατα)','Name (e.g. Clearing by the firs)')}" style="margin:6px 0 0">
 <div class="mchip" id="qc">${SPC.map(c=>`<button class="${c[0]==='wild'?'on':''}" title="${c[2]}" onclick="MP.q.cat='${c[0]}';[...this.parentNode.children].forEach(x=>x.classList.toggle('on',x===this))">${c[1]}</button>`).join('')}</div>
 <div class="mchip">${ACC.map(a=>`<button class="${a[0]==='2wd'?'on':''}" title="${a[2]}" onclick="MP.q.acc='${a[0]}';[...this.parentNode.children].forEach(x=>x.classList.toggle('on',x===this))">${a[1]}</button>`).join('')}</div>
 <div class="mg"><button class="o" onclick="mQuickSave()">💾 ${L2('Αποθήκευση','Save')}</button><button onclick="mQuickMore()">📷 ${L2('Περισσότερα','More')}</button><button onclick="mBarHome()">✖</button></div></div>`}
async function mQuickSave(){const s=MP.q;s.n=$('#qn').value.trim();await DB.put('spots',s);MP.S.push(s);mDrawMy();mCard('s',s.id);mToast('✅ '+L2('Αποθηκεύτηκε στα «Δικά μου».','Saved to «My places».'))}
function mQuickMore(){const s=MP.q;s.n=$('#qn').value.trim();s.new=1;LS.s('spdraft',s);go('map/edit/'+s.id)}
function mNewSpot(lat,lon){mQuick(lat,lon)}
function mRouteTo(lat,lon){const st=pos?[+pos.lat.toFixed(6),+pos.lon.toFixed(6)]:null;if(!st)mToast(L2('Χωρίς GPS: πάτα στον χάρτη από πού ξεκινάς.','No GPS: tap the map where you start.'));
 LS.s('mplan',{pts:st?[st,[+lat,+lon]]:[[+lat,+lon]],snap:true});mPlanStart()}

/* ---------- Κατέβασμα σημείων (Overpass) ---------- */
const OVP=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];
function mDl(){T('⬇️ Κατέβασε σημεία');const f=filt(),v=LS.g('mview',{lat:38.6,lon:22.6,z:7}),rt=LS.g('ract',null);
 M.innerHTML=`<div class="note">Θέλει internet <b>μία φορά</b>. Μετά τα σημεία μένουν στο κινητό και δουλεύουν offline. Πηγή: OpenStreetMap, ό,τι έχουν καταγράψει εθελοντές· στα ορεινά λείπουν πράγματα, γι' αυτό υπάρχουν και τα «Δικά μου».</div>
 <h3>Τι να κατεβάσω</h3>${PC.map(c=>`<div class="chk ${f[c.id]?'on':''}" onclick="mFilt('${c.id}',{classList:{toggle:()=>{}}});this.classList.toggle('on');this.querySelector('.bx').textContent=this.classList.contains('on')?'✓':''"><div class="bx">${f[c.id]?'✓':''}</div><span>${c.e} ${c.n}</span></div>`).join('')}
 <h3>Πού</h3>
 <button class="row" onclick="mDlGo('view')"><span class="e">🗺️</span><span><b>Η περιοχή που βλέπω στον χάρτη</b><small>${v.z<8?'⚠️ πολύ μεγάλη, ζούμαρε λίγο πρώτα':'κέντρο '+v.lat.toFixed(2)+', '+v.lon.toFixed(2)}</small></span></button>
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
 M.innerHTML=`<div class="muted">${L2('Πάτα ένα σημείο για να το δεις στον χάρτη.','Tap a place to see it on the map.')} Απόσταση σε ευθεία από ${pos?'τη θέση σου':'το κέντρο του χάρτη'}. Φίλτρα κατηγοριών: από τα κουμπιά του χάρτη.</div><input id="mlq" placeholder="🔎 Αναζήτηση ονόματος…" oninput="mListF()">`+
 (A.length?`<div id="mll">${A.map(({p,d,my})=>{const c=my?(SPC.find(x=>x[0]===p.cat)||SPC[7]):[0,PCI[p.c].e,PCI[p.c].n];return`<button class="row" data-q="${esc(norm2((p.n||'')+' '+c[2]))}" onclick="mFocus('${my?'s':'p'}','${esc(my?p.id:p.k)}',${p.lat},${p.lon})"><span class="e">${c[1]}</span><span style="flex:1"><b>${esc(p.n||c[2])}${my?' ⭐':''}</b><small>${c[2]}${!my&&p.t.fee?' · χρέωση: '+esc(YN(p.t.fee)):''}</small></span><b class="mono">${fmD(d)}</b></button>`}).join('')}</div>`:'<div class="note">Κανένα σημείο. Πάτα ⬇️ Κατέβασε στον χάρτη.</div>')}
const norm2=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function mListF(){const q=norm2($('#mlq').value.trim());document.querySelectorAll('#mll .row').forEach(r=>r.style.display=!q||r.dataset.q.includes(q)?'':'none')}

/* ---------- Λεπτομέρειες σημείου OSM ---------- */
async function mPoi(k){k=decodeURIComponent(k);const p=await DB.get('poi',k);if(!p)return go('map');const c=PCI[p.c];T(c.e+' '+(p.n||c.n));const ref=pos||LS.g('lastfix',null);
 const rows=Object.entries(p.t).filter(([k])=>TAGL[k]).map(([k,v])=>`<span>${TAGL[k]}</span><b>${/website/.test(k)?`<a href="${esc(v)}" target="_blank" style="color:var(--yel)">άνοιγμα</a>`:/phone/.test(k)?`<a href="tel:${esc(v)}" style="color:var(--yel)">${esc(v)}</a>`:esc(YN(v))}</b>`).join('');
 M.innerHTML=`<div class="box"><b style="font-size:1.15em">${esc(p.n||c.n)}</b><div class="muted">${c.n}${ref?' · '+fmD(dist(ref,p))+' σε ευθεία':''}</div><div class="mono muted" style="margin-top:4px">${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</div>
 ${rows?`<div class="kv" style="margin-top:8px">${rows}</div>`:''}</div>
 <div class="grid"><button class="big org" style="font-size:1em" onclick="mGoTo(${p.lat},${p.lon},'${esc((p.n||c.n).replace(/'/g,''))}')">➡️ Πάμε<small>βέλος πυξίδας</small></button><a class="big blu" style="font-size:1em" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank">🧭 Google Maps<small>οδηγίες δρόμου</small></a></div>
 <div class="tools"><button class="btn" onclick="mFocus('p','${esc(k)}',${p.lat},${p.lon})">🗺️ Στον χάρτη</button><button class="btn" onclick="mToSpot('${esc(k)}')">⭐ Κράτα το στα δικά μου</button><a class="btn" href="https://www.openstreetmap.org/${{n:'node',w:'way',r:'relation'}[k[0]]}/${k.slice(1)}" target="_blank">OSM ↗</a></div>
 <div class="muted">Τα στοιχεία είναι από το OpenStreetMap και μπορεί να μην είναι ενημερωμένα. Αν κάτι είναι λάθος, μπορείς να το διορθώσεις στο openstreetmap.org.</div>`}
function mGoTo(lat,lon,nm){const w=LS.g('wps',[]);let i=w.findIndex(p=>Math.abs(p.lat-lat)<1e-5&&Math.abs(p.lon-lon)<1e-5);if(i<0){w.push({n:nm,lat,lon,t:Date.now()});LS.s('wps',w);i=w.length-1}tgt=i;LS.s('tgt',i);go('t/compass')}
async function mToSpot(k){const p=await DB.get('poi',k),c=PCI[p.c],cat={camp:'camp',caravan:'camp',water:'water',view:'view',fuel:'fuel'}[p.c]||'other';LS.s('spdraft',{id:'s'+Date.now(),lat:p.lat,lon:p.lon,n:p.n||c.n,cat,acc:'2wd',r:0,note:'',t:Date.now(),new:1});go('map/edit/new')}

/* ---------- Δικά μου σημεία ---------- */
async function mMy(){T('⭐ Τα δικά μου σημεία');const S=(await DB.all('spots').catch(()=>[])).sort((a,b)=>b.t-a.t),ref=pos||LS.g('lastfix',null);
 M.innerHTML=`<div class="tools"><button class="btn p" onclick="LS.s('maddon',1);go('map')">➕ Νέο σημείο</button><button class="btn" onclick="mExport()">📤 Στείλε / export</button><label class="btn" style="color:var(--tx);font-size:.92em">📥 Import<input type="file" accept=".json,.gpx,application/json,application/gpx+xml" style="display:none" onchange="mImport(this.files[0])"></label></div>
 <div class="muted">Export: αρχείο που ανοίγει κάθε Overland Habit (με φωτογραφίες), έτσι ανταλλάσσετε σημεία στην παρέα. Import δέχεται και GPX (waypoints).</div>`+
 (S.length?S.map(s=>{const c=SPC.find(x=>x[0]===s.cat)||SPC[7],a=ACC.find(x=>x[0]===s.acc)||ACC[0];return`<button class="row" onclick="mFocus('s','${s.id}',${s.lat},${s.lon})"><span class="e">${c[1]}</span><span style="flex:1"><b>${esc(s.n||c[2])}</b><small>${'★'.repeat(s.r||0)}${'☆'.repeat(5-(s.r||0))} · ${a[1]} ${a[2]}${s.ph?' · 📷':''}</small></span>${ref?`<b class="mono">${fmD(dist(ref,s))}</b>`:''}</button>`}).join(''):'<div class="note">Κανένα δικό σου σημείο ακόμα. Κράτα εδώ τα καλά σημεία για ελεύθερο κάμπινγκ, πηγές, δύσκολα περάσματα.</div>')}
async function mEdit(id){const dr=LS.g('spdraft',null);let s=(id==='new'||(dr&&dr.id===id))?dr:await DB.get('spots',id).catch(()=>null);if(!s)return go('map/my');T(s.new?'➕ Νέο σημείο':'✏️ '+(s.n||'Σημείο'));let ph='';
 if(s.ph){const u=URL.createObjectURL(s.ph);ph=`<img src="${u}" style="width:100%;border-radius:12px;margin:6px 0">`}
 M.innerHTML=`<div class="mono muted">${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}</div><label>Όνομα</label><input id="spn" value="${esc(s.n)}" placeholder="π.χ. Πλάτωμα κάτω από τα έλατα">
 <label>Τι είναι</label><div class="seg">${SPC.map(c=>`<button class="${c[0]===s.cat?'on':''}" onclick="spSet('cat','${c[0]}',this)">${c[1]} ${c[2]}</button>`).join('')}</div>
 <label>Πρόσβαση</label><div class="seg">${ACC.map(a=>`<button class="${a[0]===s.acc?'on':''}" onclick="spSet('acc','${a[0]}',this)">${a[1]} ${a[2]}</button>`).join('')}</div>
 <label>Βαθμολογία</label><div class="seg">${[1,2,3,4,5].map(r=>`<button class="${r<=(s.r||0)?'on':''}" onclick="spRate(${r})">★</button>`).join('')}</div>
 <label>Σημειώσεις</label><textarea id="spt" rows="3" placeholder="νερό κοντά; σήμα κινητού; επίπεδο; σκιά; ησυχία;">${esc(s.note)}</textarea>
 ${ph}<label class="btn" style="display:block;text-align:center;color:var(--tx)">📷 ${s.ph?'Άλλαξε':'Πρόσθεσε'} φωτογραφία<input type="file" accept="image/*" capture="environment" style="display:none" onchange="spPhoto(this.files[0])"></label>
 <button class="big org" style="margin-top:12px" onclick="spSave()">💾 Αποθήκευση</button>
 ${s.new?'':`<div class="tools"><button class="btn" onclick="mGoTo(${s.lat},${s.lon},'${esc((s.n||'Σημείο').replace(/'/g,''))}')">➡️ Πάμε</button><button class="btn" onclick="mFocus('s','${s.id}',${s.lat},${s.lon})">🗺️ Στον χάρτη</button><button class="btn r" onclick="spDel('${s.id}')">🗑 Διαγραφή</button></div>`}`;
 mEdit.s=s}
function spSet(k,v,b){mEdit.s[k]=v;b.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')}
function spRate(r){mEdit.s.r=r;document.querySelectorAll('.seg')[2].querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i<r))}
function shrinkImg(file,max=1280,q=0.7){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?ok(b):no(),'image/jpeg',q)};im.onerror=no;im.src=u})}
async function spPhoto(f){if(!f)return;try{mEdit.s.ph=await shrinkImg(f);const s=mEdit.s;s.n=$('#spn').value;s.note=$('#spt').value;if(s.new)LS.s('spdraft',Object.assign({},s,{ph:null}));await (s.new?Promise.resolve():DB.put('spots',s));const keep=s;mEdit.s=keep;
 const img=document.createElement('img');img.src=URL.createObjectURL(s.ph);img.style.cssText='width:100%;border-radius:12px;margin:6px 0';const old=M.querySelector('img');old?old.replaceWith(img):$('#spt').after(img)}catch(e){alert('Η φωτογραφία δεν φορτώθηκε.')}}
async function spSave(){const s=mEdit.s;s.n=$('#spn').value.trim();s.note=$('#spt').value.trim();delete s.new;await DB.put('spots',s);LS.s('spdraft',null);mFocus('s',s.id,s.lat,s.lon)}
async function spDel(id){if(!confirm('Διαγραφή του σημείου;'))return;await DB.del('spots',id);go('map/my')}
const b2d=b=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.readAsDataURL(b)});
async function mExport(){const S=await DB.all('spots');if(!S.length)return alert('Δεν έχεις σημεία.');const out=[];for(const s of S){const o=Object.assign({},s);if(s.ph)o.ph=await b2d(s.ph);out.push(o)}
 const f=new File([JSON.stringify({app:'overland-habit',v:1,spots:out})],'overland-spots-'+new Date().toISOString().slice(0,10)+'.json',{type:'application/json'});
 if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'Overland Habit, σημεία'}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
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
 <div class="tools"><button class="btn" onclick="LS.s('ract','${id}');go('map/dl')">⬇️ Σημεία κατά μήκος</button><button class="btn" onclick="const f=LS.g('fu',{});f.trip=${Math.round(r.km)};LS.s('fu',f);go('t/fuel')">⛽ Φτάνει το καύσιμο;</button><button class="btn" onclick="rEdit('${id}')">✏️ ${L2('Άλλαξε τη διαδρομή','Edit the route')}</button><button class="btn" onclick="rGpx('${id}')">📤 GPX</button><button class="btn" onclick="rRen('${id}')">✏️ Όνομα</button>${act?`<button class="btn" onclick="LS.s('ract',null);mRoute('${id}')">⏹ Απενεργοποίηση</button>`:''}<button class="btn r" onclick="rDel('${id}')">🗑</button></div>
 ${r.wps&&r.wps.length?`<h3>Waypoints</h3>${r.wps.map(w=>`<div class="wp"><b>${esc(w.n)}</b><button class="btn" onclick="mGoTo(${w.lat},${w.lon},'${esc(w.n.replace(/'/g,''))}')">➡️</button></div>`).join('')}`:''}`}
async function rRen(id){const r=await DB.get('routes',id),n=prompt('Όνομα διαδρομής:',r.n);if(!n)return;r.n=n;await DB.put('routes',r);mRoute(id)}
async function rDel(id){if(!confirm('Διαγραφή διαδρομής;'))return;await DB.del('routes',id);if(LS.g('ract',null)===id)LS.s('ract',null);go('map/routes')}
async function rGpx(id){const r=await DB.get('routes',id);let g=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Overland Habit" xmlns="http://www.topografix.com/GPX/1/1">\n`;(r.wps||[]).forEach(w=>g+=`<wpt lat="${w.lat}" lon="${w.lon}"><name>${esc(w.n)}</name></wpt>\n`);
 g+=`<trk><name>${esc(r.n)}</name><trkseg>\n${r.pts.map(p=>`<trkpt lat="${p[0]}" lon="${p[1]}">${p[2]!=null?`<ele>${p[2]}</ele>`:''}</trkpt>`).join('\n')}\n</trkseg></trk>\n</gpx>`;
 const f=new File([g],r.n.replace(/[^\wΑ-Ωα-ωά-ώ -]/g,'')+'.gpx',{type:'application/gpx+xml'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f]}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
let RC=null;
async function mDrawRoute(){MP.rtL.clearLayers();RC=null;const id=LS.g('ract',null);if(!id)return;const r=await DB.get('routes',id).catch(()=>null);if(!r||!MP.map)return;
 const ll=r.pts.map(p=>[p[0],p[1]]);L.polyline(ll,{color:'#141312',weight:8,opacity:.6,interactive:false}).addTo(MP.rtL);L.polyline(ll,{color:'#d97757',weight:5,interactive:false}).addTo(MP.rtL);
 L.marker(ll[0],{icon:mapIcon('🟢','#262422',24),interactive:false}).addTo(MP.rtL);L.marker(ll[ll.length-1],{icon:mapIcon('🏁','#262422',26),interactive:false}).addTo(MP.rtL);(r.wps||[]).forEach(w=>L.marker([w.lat,w.lon],{icon:mapIcon('📍','#262422',24)}).bindPopup(esc(w.n)).addTo(MP.rtL));
 const cum=[0];for(let i=1;i<r.pts.length;i++)cum.push(cum[i-1]+dist({lat:r.pts[i-1][0],lon:r.pts[i-1][1]},{lat:r.pts[i][0],lon:r.pts[i][1]}));RC={r,cum,ll};
 if(LS.g('mfit',0)){LS.s('mfit',0);MP.map.fitBounds(L.latLngBounds(ll).pad(.1))}}
function mFitRoute(){if(MP.plan&&MP.plan.pts.length>1)return MP.map.fitBounds(L.latLngBounds(MP.plan.geo||MP.plan.pts).pad(.15));if(RC)MP.map.fitBounds(L.latLngBounds(RC.ll).pad(.1));else go('map/routes')}
function mRouteBar(){const b=$('#mrb');if(!b)return;if(MP.plan||!RC||!pos){b.innerHTML='';return}let bi=0,bd=1e12;const P=RC.r.pts,st=Math.max(1,Math.floor(P.length/1500));
 for(let i=0;i<P.length;i+=st){const d=dist(pos,{lat:P[i][0],lon:P[i][1]});if(d<bd){bd=d;bi=i}}const left=RC.cum[RC.cum.length-1]-RC.cum[bi],off=bd>150;
 b.innerHTML=`<div style="display:inline-block;background:${off?'#4a1c18':'#1f1e1dee'};border:1px solid ${off?'var(--red)':'var(--line)'};border-radius:12px;padding:5px 10px;font-size:.85em"><b>🏁 ${fmD(left)}</b> ${L2('μέχρι το τέλος','to the end')}${off?` · <b>⚠️ ${fmD(bd)} ${L2('εκτός διαδρομής','off route')}</b>`:''}</div>`}

/* ---------- Σχεδίαση διαδρομής ----------
   Πάτημα στον χάρτη = νέα στάση · πάτημα σε σημείο (δικό σου/OSM) = στάση εκεί
   Σύρσιμο αριθμού = μετακίνηση · πάτημα αριθμού = διαγραφή · ↶ αναιρεί οτιδήποτε */
function mPlanSaveLS(){const p=MP.plan;LS.s('mplan',{pts:p.pts,snap:p.snap,rid:p.rid||null,n:p.n||''})}
function mPlanNew(){LS.s('mplan',{pts:pos?[[+pos.lat.toFixed(6),+pos.lon.toFixed(6)]]:[],snap:true});mPlanStart()}
function mPlanStart(){mAddOff();MP.card=null;MP.hiL&&MP.hiL.clearLayers();const s=LS.g('mplan',{pts:[],snap:true});MP.plan=Object.assign({hist:[],geo:null,km:0,busy:0},s);mPlanUI();mPlanDraw();mPlanRoute();$('#mrb').innerHTML=''}
function mPlanPush(){const p=MP.plan;p.hist.push(JSON.stringify(p.pts));if(p.hist.length>50)p.hist.shift()}
function mPlanUI(){const b=$('#mbar');if(!b||!MP.plan)return;const p=MP.plan;
 b.innerHTML=`<div class="msh" style="border-color:var(--org)"><div style="display:flex;justify-content:space-between;align-items:center"><b>✏️ ${p.rid?L2('Αλλαγή διαδρομής','Edit route'):L2('Νέα διαδρομή','New route')}</b><b id="pkm" class="mono" style="font-size:1.1em">—</b></div>
 <div class="muted" id="phint" style="font-size:.8em;margin-top:3px"></div>
 <div class="mg"><button class="${p.snap?'o':''}" onclick="mPlanSnap()">${p.snap?'🛣️ '+L2('Με δρόμους','Follow roads'):'📏 '+L2('Ευθείες','Straight')}</button><button onclick="mPlanMe()">📍 ${L2('Θέση μου','My spot')}</button><button onclick="mPlanUndo()">↶ ${L2('Πίσω','Undo')}</button><button onclick="mPlanClear()">🗑 ${L2('Όλα','Clear')}</button></div>
 <div class="mg" style="grid-template-columns:2fr 1fr"><button class="o" style="padding:12px" onclick="mPlanSave()">💾 ${L2('Αποθήκευση','Save')}</button><button onclick="mPlanExit()">✖ ${L2('Έξοδος','Exit')}</button></div></div>`;mPlanHint()}
function mPlanHint(t){const e=$('#phint');if(!e||!MP.plan)return;const n=MP.plan.pts.length;
 e.innerHTML=t||(n===0?L2('👆 Πάτα στον χάρτη από πού ξεκινάς.','👆 Tap the map where you start.'):n===1?L2('👆 Τώρα πάτα πού πας. Μπορείς να πατήσεις και σε ⭐ ή ⛺.','👆 Now tap where you go. You can also tap a ⭐ or ⛺.'):L2(`${n} στάσεις · πάτα για άλλη · σύρε έναν αριθμό για μετακίνηση · πάτα τον για διαγραφή`,`${n} stops · tap for another · drag a number to move it · tap it to delete`))}
function mPlanSnap(){MP.plan.snap=!MP.plan.snap;mPlanSaveLS();mPlanUI();mPlanRoute()}
function mPlanMe(){if(!pos)return mPlanHint('📡 '+L2('Περιμένω GPS…','Waiting for GPS…'));mPlanAdd({lat:pos.lat,lng:pos.lon})}
function mPlanAdd(ll){const p=MP.plan;mPlanPush();p.pts.push([+(+ll.lat).toFixed(6),+(+ll.lng).toFixed(6)]);mPlanSaveLS();mPlanDraw();mPlanRoute();mPlanHint()}
function mPlanUndo(){const p=MP.plan;if(!p.hist.length)return mPlanHint(L2('Τίποτα για αναίρεση.','Nothing to undo.'));p.pts=JSON.parse(p.hist.pop());mPlanSaveLS();mPlanDraw();mPlanRoute();mPlanHint()}
function mPlanClear(){const p=MP.plan;if(!p.pts.length)return;mPlanPush();p.pts=[];mPlanSaveLS();mPlanDraw();mPlanRoute();mPlanHint(L2('Καθάρισε. ↶ για να τα φέρεις πίσω.','Cleared. ↶ brings them back.'))}
function mPlanExit(){if(MP.plan&&MP.plan.pts.length>1&&!confirm(L2('Έξοδος χωρίς αποθήκευση;','Exit without saving?')))return;LS.s('mplan',null);MP.plan=null;mDrawRoute();mBarHome()}
function mPlanDraw(){if(!MP.map||!MP.plan)return;MP.rtL.clearLayers();const p=MP.plan,line=p.geo||p.pts;
 if(line.length>1){L.polyline(line,{color:'#141312',weight:8,opacity:.5,interactive:false}).addTo(MP.rtL);L.polyline(line,{color:'#d97757',weight:5,dashArray:p.geo?null:'8 6',interactive:false}).addTo(MP.rtL)}
 p.pts.forEach((q,i)=>{const last=i===p.pts.length-1&&i>0,m=L.marker(q,{draggable:true,autoPan:true,zIndexOffset:900,icon:mapIcon(i===0?'🟢':last?'🏁':String(i+1),i===0?'#262422':'#d97757',30)}).addTo(MP.rtL);
  m.on('dragstart',()=>mPlanPush());m.on('dragend',e=>{const l=e.target.getLatLng();p.pts[i]=[+l.lat.toFixed(6),+l.lng.toFixed(6)];mPlanSaveLS();mPlanRoute()});
  m.on('click',ev=>{L.DomEvent.stop(ev);mPlanPush();p.pts.splice(i,1);mPlanSaveLS();mPlanDraw();mPlanRoute();mPlanHint(L2(`Σβήστηκε η στάση ${i+1}. ↶ για επαναφορά.`,`Stop ${i+1} deleted. ↶ to restore.`))})});
 let km=0;for(let i=1;i<line.length;i++)km+=dist({lat:line[i-1][0],lon:line[i-1][1]},{lat:line[i][0],lon:line[i][1]})/1000;p.km=km;const e=$('#pkm');if(e)e.textContent=line.length>1?f1(km)+' km':'—'}
let planT=null,planN=0;function mPlanRoute(){clearTimeout(planT);const p=MP.plan;if(!p)return;p.geo=null;mPlanDraw();if(!p.snap||p.pts.length<2)return;const my=++planN;
 planT=setTimeout(async()=>{mPlanHint('⏳ '+L2('Βρίσκω τον δρόμο…','Finding the road…'));try{const ac=new AbortController(),to=setTimeout(()=>ac.abort(),12000);
  const u=`https://router.project-osrm.org/route/v1/driving/${p.pts.map(q=>q[1]+','+q[0]).join(';')}?overview=full&geometries=geojson`;const j=await (await fetch(u,{signal:ac.signal})).json();clearTimeout(to);
  if(my!==planN||MP.plan!==p)return;if(j.routes&&j.routes[0]){p.geo=j.routes[0].geometry.coordinates.map(c=>[+c[1].toFixed(6),+c[0].toFixed(6)]);mPlanDraw();mPlanHint()}else mPlanHint(L2('Δεν βρέθηκε δρόμος εδώ, δείχνω ευθείες.','No road found here, showing straight lines.'))}
  catch(e){if(my===planN)mPlanHint(L2('Χωρίς internet: δείχνω ευθείες (σώζεται κανονικά).','No internet: showing straight lines (saves fine).'))}},500)}
async function mPlanSave(){const p=MP.plan;const line=p.geo||p.pts;if(line.length<2)return alert(L2('Βάλε τουλάχιστον 2 σημεία.','Add at least 2 points.'));
 const n=prompt(L2('Όνομα διαδρομής:','Route name:'),p.n||(L2('Διαδρομή ','Route ')+new Date().toLocaleDateString(LOC)));if(!n)return;
 const P=line.map(q=>[q[0],q[1],null]),s=rStats(P),old=p.rid?await DB.get('routes',p.rid).catch(()=>null):null;
 const r={id:p.rid||('r'+Date.now()),n,pts:P,wps:old&&old.wps||[],km:s.km,up:0,dn:0,t:Date.now(),plan:{pts:p.pts,snap:p.snap}};await DB.put('routes',r);LS.s('ract',r.id);LS.s('mplan',null);MP.plan=null;go('map/r/'+r.id)}
function rEdit(id){DB.get('routes',id).then(r=>{const pl=r.plan||{pts:simplify(r.pts.map(q=>[q[0],q[1]]),25),snap:false};LS.s('mplan',{pts:pl.pts,snap:pl.snap,rid:r.id,n:r.n});LS.s('mfit',0);go('map')})}

/* ---------- Google Maps (άνοιγμα της εφαρμογής) ---------- */
async function mGoogle(){const c=MP.map.getCenter(),z=MP.map.getZoom(),r=RC&&RC.r;
 const opts=[['📍 Αυτό που βλέπω',`https://www.google.com/maps/@?api=1&map_action=map&center=${c.lat.toFixed(5)},${c.lng.toFixed(5)}&zoom=${z}&basemap=satellite`]];
 if(pos)opts.push(['🧍 Η θέση μου',`https://www.google.com/maps/search/?api=1&query=${pos.lat.toFixed(5)},${pos.lon.toFixed(5)}`]);
 if(r){const P=r.pts,k=Math.min(8,Math.max(0,Math.floor(P.length/50))),W=[];for(let i=1;i<=k;i++){const q=P[Math.floor(i*P.length/(k+1))];W.push(q[0].toFixed(5)+','+q[1].toFixed(5))}const e=P[P.length-1];
  opts.push(['🛣️ Η διαδρομή μου (οδηγίες)',`https://www.google.com/maps/dir/?api=1&destination=${e[0].toFixed(5)},${e[1].toFixed(5)}${W.length?'&waypoints='+encodeURIComponent(W.join('|')):''}&travelmode=driving`])}
 const b=$('#mbar');b.innerHTML=`<div class="msh"><div style="font-size:.85em;margin-bottom:6px"><b>Άνοιγμα στο Google Maps</b></div>${opts.map(o=>`<a class="btn" style="display:block;margin:4px 0" href="${o[1]}" target="_blank">${o[0]}</a>`).join('')}<button class="btn" onclick="MP.plan?mPlanUI():mBarHome()">✖ Κλείσε</button></div>`}
