/* ===== Overland’s Habit: Χάρτης «Πού είμαι» (απλός, βοηθητικός), δικά μου στίγματα, διαδρομές GPX για προβολή =====
   Η πλοήγηση γίνεται σε άλλη εφαρμογή (Organic Maps / OsmAnd / Google) με συντεταγμένες.
   Η λίστα «Καταφύγια & camper stops Ελλάδας» είναι στο huts.js. Δεδομένα σημείων © OpenStreetMap contributors (ODbL). */

/* ---------- IndexedDB (v2: + huts) ---------- */
const DB={db:null,open(){return this.db?Promise.resolve(this.db):new Promise((ok,no)=>{const r=indexedDB.open('ov_db',2);
 r.onupgradeneeded=()=>{const d=r.result;['poi','spots','routes','huts'].forEach(s=>{if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:(s==='poi'||s==='huts')?'k':'id'})})};
 r.onsuccess=()=>{this.db=r.result;this.db.onversionchange=()=>{this.db.close();this.db=null};ok(this.db)};r.onerror=()=>no(r.error)})},
 tx(s,m,f){return this.open().then(d=>new Promise((ok,no)=>{const t=d.transaction(s,m),st=t.objectStore(s),q=f(st);t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error)}))},
 all(s){return this.tx(s,'readonly',st=>st.getAll())},get(s,k){return this.tx(s,'readonly',st=>st.get(k))},
 put(s,v){return this.tx(s,'readwrite',st=>st.put(v))},del(s,k){return this.tx(s,'readwrite',st=>st.delete(k))},
 putMany(s,arr){return this.open().then(d=>new Promise((ok,no)=>{const t=d.transaction(s,'readwrite'),st=t.objectStore(s);arr.forEach(v=>st.put(v));t.oncomplete=()=>ok();t.onerror=()=>no(t.error)}))},
 clear(s){return this.tx(s,'readwrite',st=>st.clear())}};

/* ---------- Ετικέτες OSM (για τα στοιχεία των καταφυγίων) ---------- */
const KEEP=['name','name:en','opening_hours','fee','charge','phone','contact:phone','website','contact:website','drinking_water','toilets','shower','power_supply','capacity','tents','caravans','motorhome','description','ele','access','operator','amenity','tourism','reservation','internet_access','dog','sanitary_dump_station:water_point','water_point','seasonal','shelter_type','beds','fireplace','natural','drinking_water:legal'];
const TAGL={opening_hours:'Ωράριο',fee:'Χρέωση',charge:'Τιμή',phone:'Τηλέφωνο','contact:phone':'Τηλέφωνο',website:'Ιστοσελίδα','contact:website':'Ιστοσελίδα',drinking_water:'Πόσιμο νερό',toilets:'WC',shower:'Ντους',power_supply:'Ρεύμα',capacity:'Θέσεις',tents:'Σκηνές',caravans:'Τροχόσπιτα',motorhome:'Αυτοκινούμενα',description:'Περιγραφή',access:'Πρόσβαση',operator:'Διαχειριστής',reservation:'Κράτηση',internet_access:'Internet',dog:'Σκύλοι',seasonal:'Εποχιακό',shelter_type:'Τύπος',beds:'Κρεβάτια',fireplace:'Τζάκι'};
const YN=v=>({yes:'ναι',no:'όχι',customers:'μόνο πελάτες',private:'ιδιωτικό',permissive:'επιτρέπεται',wlan:'Wi-Fi',required:'απαιτείται',basic_hut:'απλό καταφύγιο',weather_shelter:'στέγαστρο καιρού',lean_to:'υπόστεγο',rock_shelter:'βραχοσκεπή'}[v]||v);
const OVP=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://maps.mail.ru/osm/tools/overpass/api/interpreter'];

/* ---------- Χάρτες: OpenTopoMap (απόφαση Καπετάνιου) + δορυφόρος ---------- */
/* Απόφαση Καπετάνιου (7 Nov): ΜΟΝΟ ορεινός χάρτης (μονοπάτια, ισοϋψείς), χωρίς δορυφόρο. Κατεβαίνει ανά περιοχή για offline. */
const LAYERS={topo:['Ορεινός χάρτης','https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',17,'© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)','⛰️']};
const LAYK=()=>'topo';
let MP={map:null,tl:null,hL:null,myL:null,rtL:null,hiL:null,meM:null,acc:null,follow:false,add:false,card:null,iv:null,S:[],H:[],tick:0,trkN:0};
function mapIcon(e,bg,sz){sz=sz||30;return L.divIcon({className:'',html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${bg||'#262422'};border:2px solid #f5f0e8;display:flex;align-items:center;justify-content:center;font-size:${sz*.55}px;box-shadow:0 1px 4px #000a">${e}</div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]})}
const ACC=[['2wd','🚗','Κάθε αυτοκίνητο','#5f9e7a'],['awd','🚙','SUV / AWD','#6a9fb5'],['4x4','🛻','4×4 με κοντά','#e8b86d'],['hard','⛰️','4×4 + μπλοκέ / δύσκολο','#d9534f']];
const SPC=[['wild','🌲','Ελεύθερο κάμπινγκ'],['camp','⛺','Κάμπινγκ'],['water','🚰','Νερό / πηγή'],['view','🏞️','Θέα'],['obst','🚧','Δύσκολο πέρασμα'],['fuel','⛽','Καύσιμα'],['food','🍽️','Φαγητό / ταβέρνα'],['hut','🛖','Καταφύγιο'],['other','📌','Άλλο']];
function mCss(){if($('#mcss'))return;const st=document.createElement('style');st.id='mcss';st.textContent=`
.msh{background:#1f1e1df2;border:1px solid var(--line);border-radius:16px;padding:10px;box-shadow:0 4px 16px #000a}
.msh .mg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.msh .mg button,.msh .mg a{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:12px;padding:9px 4px;font-size:.82em;font-weight:700;text-align:center;text-decoration:none;line-height:1.2}
.msh .mg .o{background:var(--org);border-color:var(--org);color:#1f1e1d}
.mfab{display:flex;gap:8px}.mfab button{flex:1;background:var(--org);color:#1f1e1d;border:0;border-radius:14px;padding:13px 6px;font-weight:800;font-size:.95em;box-shadow:0 3px 10px #000a}
.mfab button.b{background:#6a9fb5}
.mchip{display:flex;gap:5px;overflow-x:auto;margin-top:6px}.mchip button{flex:0 0 auto;background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:10px;padding:7px 9px;font-size:1.15em}.mchip button.on{background:var(--org);border-color:var(--org);color:#1f1e1d}
#mcross{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;z-index:450;pointer-events:none;display:none}
#mpos{position:absolute;left:8px;top:8px;right:60px;z-index:500;background:#1f1e1dee;border:1px solid var(--line);border-radius:12px;padding:6px 10px;color:var(--tx);font-size:.82em;text-align:left;line-height:1.35}
@keyframes mpul{0%{transform:scale(.6);opacity:1}100%{transform:scale(2.2);opacity:0}}
.mpul{width:40px;height:40px;border-radius:50%;border:4px solid #d97757;animation:mpul 1.4s ease-out infinite}`;document.head.appendChild(st)}

/* ---------- Σελίδα χάρτη ---------- */
async function mapPage(sub,arg){if(sub==='huts'||sub==='list'||sub==='dl'||sub==='p')return hutPage();if(sub==='h')return hutInfo(arg);if(sub==='my')return mMy();if(sub==='edit')return mEdit(arg);if(sub==='routes')return mRoutes();if(sub==='r')return mRoute(arg);
 T('🗺️ '+L2('Πού είμαι','Where am I'));mCss();const lay=LAYK();
 M.innerHTML=`<div class="tools" style="margin:0 0 6px;flex-wrap:nowrap"><button class="btn" style="flex:1" onclick="go('map/huts')">🛖 ${L2('Καταφύγια','Huts')}</button><button class="btn" style="flex:1" onclick="go('map/my')">⭐ ${L2('Δικά μου','Mine')}</button><button class="btn" style="flex:1" onclick="go('map/routes')">🛣️ GPX</button></div>
 <div style="position:relative"><div id="map" style="height:60vh;border-radius:14px;border:1px solid var(--line)"></div>
 <div id="mcross"><svg viewBox="0 0 46 46" width="46" height="46"><circle cx="23" cy="23" r="9" fill="none" stroke="#d97757" stroke-width="3"/><path d="M23 0v14M23 32v14M0 23h14M32 23h14" stroke="#d97757" stroke-width="3"/><circle cx="23" cy="23" r="2" fill="#d97757"/></svg></div>
 <button id="mpos" onclick="mMe()">📡 ${L2('Περιμένω GPS…','Waiting for GPS…')}</button>
 <div id="mld" style="display:none;position:absolute;left:50%;transform:translateX(-50%);bottom:84px;z-index:480;background:#1f1e1dcc;border-radius:10px;padding:3px 10px;font-size:.75em;pointer-events:none">⏳ ${L2('φορτώνει ο χάρτης…','loading map…')}</div>
 <div style="position:absolute;right:8px;top:8px;z-index:500;display:flex;flex-direction:column;gap:6px">
  <button class="hb" onclick="offPanel()" title="${L2('Offline περιοχές','Offline areas')}">⬇️</button><button class="hb" id="mfol" onclick="mFollow()" title="${L2('Η θέση μου','My location')}">📍</button><button class="hb" onclick="MP.map.zoomIn()" style="font-size:1.3em">+</button><button class="hb" onclick="MP.map.zoomOut()" style="font-size:1.3em">−</button></div>
 <div id="mrb" style="position:absolute;left:8px;top:62px;right:60px;z-index:490;pointer-events:none"></div>
 <div id="mbar" style="position:absolute;left:8px;right:8px;bottom:10px;z-index:500"></div></div>
 <div class="muted" id="minfo" style="margin-top:6px"></div>`;
 const h=window.innerHeight-$('#map').getBoundingClientRect().top-($('#nv').offsetHeight||70)-30;$('#map').style.height=Math.max(320,h)+'px';
 const c0=LS.g('mview',null),c=c0||{lat:38.6,lon:22.6,z:7},fo=LS.g('mfocus',null);LS.s('mfocus',null);
 MP.map=L.map('map',{zoomControl:false,attributionControl:true,tapTolerance:20}).setView(fo?[fo.lat,fo.lon]:[c.lat,c.lon],fo?Math.max(c.z||0,14):c.z);
 mSetLayer(lay);MP.hL=L.layerGroup().addTo(MP.map);MP.myL=L.layerGroup().addTo(MP.map);MP.rtL=L.layerGroup().addTo(MP.map);MP.hiL=L.layerGroup().addTo(MP.map);
 MP.map.on('moveend',()=>{const ce=MP.map.getCenter();LS.s('mview',{lat:ce.lat,lon:ce.lng,z:MP.map.getZoom()})});
 MP.map.on('dragstart',()=>{MP.follow=false;const b=$('#mfol');if(b)b.style.background=''});
 MP.map.on('click',mClick);MP.map.on('contextmenu',e=>mQuick(e.latlng.lat,e.latlng.lng));
 TS.push(()=>{if(MP.iv)clearInterval(MP.iv);MP.iv=null;if(MP.map){MP.map.remove();MP.map=null}MP.offL=null;OFFRUN&&(OFFRUN.stop=1);MP.add=false;MP.card=null;MP.meM=null;MP.acc=null});
 MP.follow=false;MP.H=[];startGeo();MP.iv=setInterval(mPos,1000);mPos();
 MP.S=await DB.all('spots').catch(()=>[]);if(fo&&fo.k==='h'){const x=await DB.get('huts',fo.id).catch(()=>null);if(x)MP.H=[x]}if(!MP.map)return;
 await mDrawRoute();mDrawMy();mDrawH();offDraw();
 if(fo)mCard(fo.k,fo.id);else mBarHome();if(LS.g('maddon',0)){LS.s('maddon',0);mAddOn()}
 if(!fo&&!c0)mFollow()}
function mSetLayer(k){const l=LAYERS[k]||LAYERS.topo;if(MP.tl)MP.map.removeLayer(MP.tl);
 MP.tl=L.tileLayer(l[1],{maxZoom:19,maxNativeZoom:l[2],attribution:l[3],crossOrigin:'anonymous',keepBuffer:4,updateWhenIdle:true,updateWhenZooming:false}).addTo(MP.map);MP.map.setMaxZoom(19);LS.s('mlay3',k);LS.s('mlay',k);MP.te=0;
 MP.tl.on('tileerror',e=>{const t=e.tile,u=t.src;MP.te++;if((t._r||0)<2){t._r=(t._r||0)+1;setTimeout(()=>{if(MP.map){t.src='';t.src=u}},1500*t._r)}
  if(MP.te===8)mToast('📶 '+L2('Αδύναμο σήμα: ο χάρτης φορτώνει αργά, ξαναδοκιμάζω μόνος μου. Ό,τι έχεις δει με σήμα μένει αποθηκευμένο.','Weak signal: the map loads slowly, I keep retrying. Anything viewed with signal stays saved.'))});
 MP.tl.on('loading',()=>{const e=$('#mld');if(e)e.style.display='block'});MP.tl.on('load',()=>{MP.te=0;const e=$('#mld');if(e)e.style.display='none'})}
function mToast(t){const i=$('#minfo');if(i)i.innerHTML=t}
function mFollow(){MP.follow=true;const b=$('#mfol');if(b)b.style.background='var(--org)';if(pos)MP.map.setView([pos.lat,pos.lon],Math.max(MP.map.getZoom(),14));else mToast('📡 '+L2('Περιμένω GPS…','Waiting for GPS…'))}
const norm2=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const fmAlt=a=>a==null||isNaN(a)?'':Math.round(a)+' m';
function mPos(){if(!MP.map)return;MP.tick++;
 if(trk.length!==MP.trkN&&MP.tick%10===0)mDrawMy();const pb=$('#mpos');
 if(!pos){if(pb)pb.innerHTML='📡 '+L2('Περιμένω GPS… (βγες σε ανοιχτό χώρο)','Waiting for GPS… (get into the open)');return}
 if(pb)pb.innerHTML=`<b class="mono">📍 ${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}</b><br><span class="muted">${pos.alt!=null?'⛰️ '+fmAlt(pos.alt)+' · ':''}±${Math.round(pos.acc||0)} m · ${L2('πάτα για αντιγραφή & άλλους χάρτες','tap to copy & other maps')}</span>`;
 const ll=[pos.lat,pos.lon];
 if(!MP.meM){MP.acc=L.circle(ll,{radius:pos.acc||20,color:'#6a9fb5',weight:1,fillOpacity:.15,interactive:false}).addTo(MP.map);MP.meM=L.marker(ll,{interactive:false,icon:L.divIcon({className:'',html:'<div style="width:22px;height:22px;border-radius:50%;background:#6a9fb5;border:3px solid #fff;box-shadow:0 0 6px #000"></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:1000}).addTo(MP.map)}
 else{MP.meM.setLatLng(ll);MP.acc.setLatLng(ll).setRadius(pos.acc||20)}
 if(MP.follow)MP.map.panTo(ll,{animate:true});if(MP.tick%3===0)mRouteBar();if(MP.card&&MP.card.k==='me'&&MP.tick%5===0)mCard('me')}
function mDrawH(){if(!MP.map||typeof HCI==='undefined')return;MP.hL.clearLayers();MP.H.forEach(h=>{const c=HCI[h.c]||HC[0];L.marker([h.lat,h.lon],{icon:mapIcon(c.e,c.col,34),zIndexOffset:600}).on('click',ev=>{L.DomEvent.stop(ev);mTap('h',h.k)}).addTo(MP.hL)})}
function mDrawMy(){if(!MP.map)return;MP.myL.clearLayers();
 MP.S.forEach(s=>{const a=ACC.find(x=>x[0]===s.acc)||ACC[0],c=SPC.find(x=>x[0]===s.cat)||SPC.find(x=>x[0]==='other');L.marker([s.lat,s.lon],{icon:mapIcon(c[1],a[3],36),zIndexOffset:500}).on('click',ev=>{L.DomEvent.stop(ev);mTap('s',s.id)}).addTo(MP.myL)});
 LS.g('wps',[]).forEach((p,i)=>L.marker([p.lat,p.lon],{icon:mapIcon('⭐','#3a2c1c',28),zIndexOffset:400}).on('click',ev=>{L.DomEvent.stop(ev);mTap('w',i)}).addTo(MP.myL));
 MP.trkN=trk.length;if(trk.length>1)L.polyline(trk.map(p=>[p.lat,p.lon]),{color:'#e8b86d',weight:4,opacity:.9,interactive:false}).addTo(MP.myL)}
function mDraw(){mDrawMy();mDrawH()}
function mTap(k,id){if(MP.add)mAddOff();mCard(k,id)}
function mHi(lat,lon){MP.hiL.clearLayers();L.marker([lat,lon],{interactive:false,zIndexOffset:-10,icon:L.divIcon({className:'',html:'<div class="mpul"></div>',iconSize:[40,40],iconAnchor:[20,20]})}).addTo(MP.hiL)}
function mFocus(k,id,lat,lon){LS.s('mfocus',{k,id,lat,lon});go('map')}
function mMe(){if(!pos)return mToast('📡 '+L2('Περιμένω GPS…','Waiting for GPS…'));mCard('me')}
function mItem(k,id){if(k==='s'){const s=MP.S.find(x=>x.id===id);if(!s)return null;const c=SPC.find(x=>x[0]===s.cat)||SPC.find(x=>x[0]==='other'),a=ACC.find(x=>x[0]===s.acc)||ACC[0];return{lat:s.lat,lon:s.lon,e:c[1],n:s.n||c[2],sub:`${c[2]} · ${a[1]} ${a[2]}${s.r?' · '+'★'.repeat(s.r):''}`,note:s.note,ph:s.ph}}
 if(k==='h'){const h=MP.H.find(x=>x.k===id);if(!h)return null;const c=HCI[h.c]||HC[0];return{lat:h.lat,lon:h.lon,e:c.e,n:h.n||hcS(c),ele:h.ele,eleA:h.ed,sub:hcS(c)+(h.town?' · '+h.town:'')}}
 if(k==='me'){if(!pos)return null;return{lat:pos.lat,lon:pos.lon,e:'🧍',n:L2('Εδώ είμαι','I am here'),ele:pos.alt!=null?Math.round(pos.alt):null,sub:'GPS ±'+Math.round(pos.acc||0)+' m',me:1}}
 if(k==='w'){const w=LS.g('wps',[])[id];if(!w)return null;return{lat:w.lat,lon:w.lon,e:'⭐',n:w.n||L2('Σημείο πυξίδας','Compass point'),sub:L2('σημείο της πυξίδας','compass point')}}return null}
/* Κουμπιά «άνοιξε σε άλλη εφαρμογή»: εκεί γίνεται η πλοήγηση */
function mApps(lat,lon,nm){const q=(+lat).toFixed(6)+','+(+lon).toFixed(6),e=encodeURIComponent(nm||'');
 return `<a href="https://www.google.com/maps/dir/?api=1&destination=${q}" target="_blank">🧭 Google</a><a href="om://map?v=1&ll=${q}&n=${e}">🟢 Organic</a><a href="https://osmand.net/map?pin=${q}#15/${(+lat).toFixed(5)}/${(+lon).toFixed(5)}" target="_blank">🔶 OsmAnd</a>`}
function mCopy(lat,lon){const t=(+lat).toFixed(6)+', '+(+lon).toFixed(6),ok=()=>{mToast('📋 '+L2('Αντιγράφηκε','Copied')+': <b class="mono">'+t+'</b> · '+L2('επικόλλησέ το στην αναζήτηση του Organic Maps / OsmAnd / Google.','paste it into the search of Organic Maps / OsmAnd / Google.'))};
 (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(ok,()=>prompt(L2('Αντέγραψε:','Copy:'),t))}
function mCard(k,id){const it=mItem(k,id),b=$('#mbar');if(!it||!b)return mBarHome();MP.card={k,id};mHi(it.lat,it.lon);const ref=pos||LS.g('lastfix',null),nm=esc(it.n.replace(/'/g,''));
 const img=it.ph?`<img src="${URL.createObjectURL(it.ph)}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">`:`<span style="font-size:2em">${it.e}</span>`;
 const third=k==='w'?`<button onclick="mWpDel(${id})">🗑 ${L2('Σβήσε','Delete')}</button>`:k==='s'?`<button onclick="go('map/edit/${id}')">✏️ ${L2('Αλλαγή','Edit')}</button>`:k==='h'?`<button onclick="go('map/h/${encodeURIComponent(id)}')">ℹ️ ${L2('Στοιχεία','Details')}</button>`:`<button onclick="mQuick(${it.lat},${it.lon},'${it.me?'':nm}')">➕ ${L2('Στίγμα','Pin')}</button>`;
 b.innerHTML=`<div class="msh"><div style="display:flex;gap:10px;align-items:center">${img}<div style="flex:1;min-width:0"><b style="font-size:1.05em">${esc(it.n)}</b><div class="muted" style="font-size:.8em">${esc(it.sub)}${ref&&!it.me?' · '+fmD(dist(ref,it))+' '+L2('σε ευθεία','straight line'):''}</div>
 <div class="mono" style="font-size:.85em">${it.lat.toFixed(5)}, ${it.lon.toFixed(5)}${it.ele!=null?' · ⛰️ '+(it.eleA?'≈':'')+it.ele+' m':''}</div>${it.note?`<div style="font-size:.8em;margin-top:2px">${esc(it.note).slice(0,120)}</div>`:''}</div><button class="hb" onclick="mBarHome()">✖</button></div>
 <div class="mg">${it.me?'':`<button class="o" onclick="mGoTo(${it.lat},${it.lon},'${nm}')">➡️ ${L2('Πάμε','Go')}</button>`}<button ${it.me?'class="o"':''} onclick="mCopy(${it.lat},${it.lon})">📋 ${L2('Συντεταγμένες','Coordinates')}</button>${third}${mApps(it.lat,it.lon,it.n)}${k==='s'?`<button style="grid-column:span 3;color:var(--red)" onclick="mSpotDel('${id}')">🗑 ${L2('Σβήσε το στίγμα','Delete the pin')}</button>`:k==='h'?`<button style="grid-column:span 3" onclick="mHutHide('${id}')">✖ ${L2('Βγάλ\'το από τον χάρτη','Remove it from the map')}</button>`:''}</div></div>`}
function mWpDel(i){const w=LS.g('wps',[]);if(!w[i]||!confirm(L2('Να σβηστεί το ⭐ «','Delete the ⭐ «')+w[i].n+'»;'))return;w.splice(i,1);LS.s('wps',w);
 if(tgt===i)tgt=null;else if(tgt!=null&&tgt>i)tgt--;LS.s('tgt',tgt);if(MP.map){mDrawMy();mBarHome();mToast('🗑 '+L2('Σβήστηκε.','Deleted.'))}else mMy()}
async function mSpotDel(id){const x=MP.S.find(q=>q.id===id);if(!x||!confirm(L2('Να σβηστεί το στίγμα «','Delete the pin «')+(x.n||'📌')+'»;'))return;await DB.del('spots',id);MP.S=MP.S.filter(q=>q.id!==id);mDrawMy();mBarHome();mToast('🗑 '+L2('Σβήστηκε.','Deleted.'))}
async function mSpotDel2(id){const x=await DB.get('spots',id).catch(()=>null);if(!x||!confirm(L2('Να σβηστεί το στίγμα «','Delete the pin «')+(x.n||'📌')+'»;'))return;await DB.del('spots',id);mMy()}
function mHutHide(k){MP.H=MP.H.filter(h=>h.k!==k);mDrawH();mBarHome()}
function mBarHome(){MP.card=null;MP.hiL&&MP.hiL.clearLayers();const b=$('#mbar');if(!b)return;
 b.innerHTML=`<div class="mfab"><button onclick="mAddOn()">➕ ${L2('Στίγμα','Pin')}</button><button class="b" onclick="mMe()">🧍 ${L2('Εδώ είμαι','I am here')}</button></div>`;
 mToast(L2(`${MP.S.length} δικά μου στίγματα. Κράτα το δάχτυλο πατημένο στον χάρτη για νέο στίγμα. Για καταφύγια & camper stops: 🛖.`,`${MP.S.length} pins of mine. Long-press the map for a new pin. For huts & camper stops: 🛖.`))}

/* ---------- Νέο στίγμα: σταυρός στο κέντρο, πάτημα ή παρατεταμένο πάτημα ---------- */
function mAddOn(){MP.add=true;MP.card=null;MP.hiL.clearLayers();$('#mcross').style.display='block';
 $('#mbar').innerHTML=`<div class="msh"><div style="font-size:.88em">🎯 ${L2('Σύρε τον χάρτη ώστε ο σταυρός να πέσει στο σημείο, ή πάτα κατευθείαν πάνω του.','Drag the map so the cross sits on the spot, or tap right on it.')}</div>
 <div class="mg"><button class="o" onclick="const c=MP.map.getCenter();mQuick(c.lat,c.lng)">✅ ${L2('Εδώ','Here')}</button><button onclick="mAddHere()">📍 ${L2('Η θέση μου','My location')}</button><button onclick="mBarHome2()">✖ ${L2('Άκυρο','Cancel')}</button></div></div>`}
function mAddOff(){MP.add=false;const c=$('#mcross');if(c)c.style.display='none'}
function mBarHome2(){mAddOff();mBarHome()}
function mAddHere(){if(!pos)return alert(L2('Περιμένω GPS…','Waiting for GPS…'));mQuick(pos.lat,pos.lon)}
function mClick(e){if(MP.add)return mQuick(e.latlng.lat,e.latlng.lng);if(MP.card)mBarHome()}
/* Γρήγορη αποθήκευση πάνω στον χάρτη, χωρίς να φύγεις από αυτόν */
function mQuick(lat,lon,nm){mAddOff();MP.card=null;mHi(lat,lon);MP.q={id:'s'+Date.now(),lat:+(+lat).toFixed(6),lon:+(+lon).toFixed(6),n:nm||'',cat:'wild',acc:'2wd',r:0,note:'',t:Date.now()};
 $('#mbar').innerHTML=`<div class="msh"><b>⭐ ${L2('Νέο στίγμα','New pin')}</b> <span class="mono muted" style="font-size:.75em">${MP.q.lat.toFixed(5)}, ${MP.q.lon.toFixed(5)}</span>
 <input id="qn" value="${esc(nm||'')}" placeholder="${L2('Όνομα (π.χ. Πλάτωμα στα έλατα)','Name (e.g. Clearing by the firs)')}" style="margin:6px 0 0">
 <div class="mchip" id="qc">${SPC.map(c=>`<button class="${c[0]==='wild'?'on':''}" title="${c[2]}" onclick="MP.q.cat='${c[0]}';[...this.parentNode.children].forEach(x=>x.classList.toggle('on',x===this))">${c[1]}</button>`).join('')}</div>
 <div class="mchip">${ACC.map(a=>`<button class="${a[0]==='2wd'?'on':''}" title="${a[2]}" onclick="MP.q.acc='${a[0]}';[...this.parentNode.children].forEach(x=>x.classList.toggle('on',x===this))">${a[1]}</button>`).join('')}</div>
 <div class="mg"><button class="o" onclick="mQuickSave()">💾 ${L2('Αποθήκευση','Save')}</button><button onclick="mQuickMore()">📷 ${L2('Περισσότερα','More')}</button><button onclick="mBarHome()">✖</button></div></div>`}
async function mQuickSave(){const s=MP.q;s.n=$('#qn').value.trim();await DB.put('spots',s);MP.S.push(s);mDrawMy();mCard('s',s.id);mToast('✅ '+L2('Αποθηκεύτηκε στα «Δικά μου».','Saved to «My places».'))}
function mQuickMore(){const s=MP.q;s.n=$('#qn').value.trim();s.new=1;LS.s('spdraft',s);go('map/edit/'+s.id)}
function mNewSpot(lat,lon){mQuick(lat,lon)}
function mGoTo(lat,lon,nm){const w=LS.g('wps',[]);let i=w.findIndex(p=>Math.abs(p.lat-lat)<1e-5&&Math.abs(p.lon-lon)<1e-5);if(i<0){w.push({n:nm,lat,lon,t:Date.now()});LS.s('wps',w);i=w.length-1}tgt=i;LS.s('tgt',i);go('t/compass')}

/* ---------- Δικά μου στίγματα ---------- */
/* ---------- Δικά μου σημεία ---------- */
async function mMy(){T('⭐ Τα δικά μου σημεία');const S=(await DB.all('spots').catch(()=>[])).sort((a,b)=>b.t-a.t),ref=pos||LS.g('lastfix',null);
 M.innerHTML=`<div class="tools"><button class="btn p" onclick="LS.s('maddon',1);go('map')">➕ Νέο σημείο</button><button class="btn" onclick="mExport()">📤 Στείλε / export</button><label class="btn" style="color:var(--tx);font-size:.92em">📥 Import<input type="file" accept=".json,.gpx,application/json,application/gpx+xml" style="display:none" onchange="mImport(this.files[0])"></label></div>
 <div class="muted">Export: αρχείο που ανοίγει κάθε Overland’s Habit (με φωτογραφίες), έτσι ανταλλάσσετε σημεία στην παρέα. Import δέχεται και GPX (waypoints).</div>`+
 (S.length?S.map(s=>{const c=SPC.find(x=>x[0]===s.cat)||SPC.find(x=>x[0]==='other'),a=ACC.find(x=>x[0]===s.acc)||ACC[0];return`<div style="display:flex;gap:6px;align-items:center"><button class="row" style="flex:1;min-width:0" onclick="mFocus('s','${s.id}',${s.lat},${s.lon})"><span class="e">${c[1]}</span><span style="flex:1"><b>${esc(s.n||c[2])}</b><small>${'★'.repeat(s.r||0)}${'☆'.repeat(5-(s.r||0))} · ${a[1]} ${a[2]}${s.ph?' · 📷':''}</small></span>${ref?`<b class="mono">${fmD(dist(ref,s))}</b>`:''}</button><button class="btn r" style="margin:0" onclick="mSpotDel2('${s.id}')">🗑</button></div>`}).join(''):'<div class="note">Κανένα δικό σου σημείο ακόμα. Κράτα εδώ τα καλά σημεία για ελεύθερο κάμπινγκ, πηγές, δύσκολα περάσματα.</div>')+mWpHtml()}
function mWpHtml(){const w=LS.g('wps',[]);if(!w.length)return'';
 return `<h3>⭐ ${L2('Σημεία πυξίδας («Πάμε»)','Compass points («Go»)')}</h3><div class="muted">${L2('Μπαίνουν μόνα τους όταν πατάς ➡️ Πάμε. Σβήσε όσα δεν χρειάζεσαι.','Added automatically when you tap ➡️ Go. Delete the ones you don\'t need.')}</div>`+
 w.map((p,i)=>`<div class="wp"><b style="flex:1">${esc(p.n||'⭐')}<br><small class="muted mono">${(+p.lat).toFixed(5)}, ${(+p.lon).toFixed(5)}</small></b><button class="btn" onclick="mFocus('w',${i},${p.lat},${p.lon})">🗺️</button><button class="btn r" onclick="mWpDel(${i})">🗑</button></div>`).join('')+
 `<button class="btn r" style="margin-top:6px" onclick="if(confirm(L2('Να σβηστούν όλα τα ⭐ πυξίδας;','Delete all compass ⭐?'))){LS.s('wps',[]);tgt=null;LS.s('tgt',null);mMy()}">🗑 ${L2('Σβήσε όλα τα ⭐','Delete all ⭐')}</button>`}
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
 if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'Overland’s Habit, σημεία'}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
async function mImport(file){if(!file)return;const t=await file.text();let n=0;
 try{if(/^\s*</.test(t)){const g=parseGpx(t);for(const w of g.wps){await DB.put('spots',{id:'s'+Date.now()+'_'+n,lat:w.lat,lon:w.lon,n:w.n,cat:'other',acc:'2wd',r:0,note:'από GPX',t:Date.now()});n++}}
 else{const o=JSON.parse(t);for(const s of o.spots||[]){if(s.ph&&typeof s.ph==='string'){s.ph=await (await fetch(s.ph)).blob()}await DB.put('spots',s);n++}}
 alert(`Μπήκαν ${n} σημεία.`);mMy()}catch(e){alert('Το αρχείο δεν διαβάστηκε.')}}

/* ---------- Διαδρομές GPX (μόνο προβολή) ---------- */
/* ---------- Διαδρομές ---------- */
function parseGpx(txt){const d=new DOMParser().parseFromString(txt,'application/xml'),num=(e,a)=>parseFloat(e.getAttribute(a));let pts=[...d.getElementsByTagName('trkpt')];if(!pts.length)pts=[...d.getElementsByTagName('rtept')];
 const P=pts.map(e=>{const el=e.getElementsByTagName('ele')[0];return[num(e,'lat'),num(e,'lon'),el?parseFloat(el.textContent):null]}).filter(p=>!isNaN(p[0]));
 const W=[...d.getElementsByTagName('wpt')].map(e=>({lat:num(e,'lat'),lon:num(e,'lon'),n:(e.getElementsByTagName('name')[0]||{}).textContent||'Σημείο'}));
 const nm=(d.querySelector('trk>name,rte>name,metadata>name')||{}).textContent||'';return{pts:P,wps:W,n:nm}}
function rStats(P){let km=0,up=0,dn=0;for(let i=1;i<P.length;i++){km+=dist({lat:P[i-1][0],lon:P[i-1][1]},{lat:P[i][0],lon:P[i][1]})/1000;if(P[i][2]!=null&&P[i-1][2]!=null){const d=P[i][2]-P[i-1][2];if(d>0)up+=d;else dn-=d}}return{km,up,dn}}
async function mRoutes(){T('🛣️ '+L2('Διαδρομές GPX','GPX routes'));const R=(await DB.all('routes').catch(()=>[])).sort((a,b)=>b.t-a.t),act=LS.g('ract',null);
 M.innerHTML=`<label class="big org" style="font-size:1em;cursor:pointer;display:block">📥 ${L2('Φόρτωσε GPX','Load GPX')}<small>Wikiloc, OsmAnd, Organic Maps, Garmin, ${L2('φίλοι','friends')}</small><input type="file" accept=".gpx,application/gpx+xml,application/xml,text/xml" style="display:none" onchange="rImport(this.files[0])"></label>`+
 (R.length?R.map(r=>`<button class="row" onclick="go('map/r/${r.id}')"><span class="e">${r.id===act?'✅':'🛣️'}</span><span style="flex:1"><b>${esc(r.n)}</b><small>${f1(r.km)} km${r.up?' · ↗ '+f0(r.up)+' m':''}${r.id===act?' · '+L2('φαίνεται στον χάρτη','shown on the map'):''}</small></span></button>`).join(''):`<div class="note">${L2('Καμία διαδρομή ακόμα. Φόρτωσε ένα GPX για να το βλέπεις πάνω στον χάρτη.','No routes yet. Load a GPX to see it on the map.')}</div>`)+
 `<div class="muted">${L2('Οι διαδρομές είναι μόνο για προβολή: τις βλέπεις στον χάρτη, offline, με «πόσο μένει» και «εκτός διαδρομής». Η πλοήγηση γίνεται σε Organic Maps / OsmAnd.','Routes are view-only: you see them on the map, offline, with distance left and off-route warning. Navigate in Organic Maps / OsmAnd.')}</div>`}
async function rImport(f){if(!f)return;try{const g=parseGpx(await f.text());if(g.pts.length<2&&!g.wps.length)throw 0;let P=g.pts.length>=2?g.pts:g.wps.map(w=>[w.lat,w.lon,null]);P=simplify(P,6000);
 const s=rStats(P),r={id:'r'+Date.now(),n:g.n||f.name.replace(/\.gpx$/i,''),pts:P,wps:g.wps,km:s.km,up:s.up,dn:s.dn,t:Date.now()};await DB.put('routes',r);LS.s('ract',r.id);go('map/r/'+r.id)}catch(e){alert('Το GPX δεν διαβάστηκε.')}}
async function mRoute(id){const r=await DB.get('routes',id);if(!r)return go('map/routes');T('🛣️ '+r.n);const act=LS.g('ract',null)===id;
 const els=r.pts.filter(p=>p[2]!=null).map(p=>p[2]);let prof='';if(els.length>10){const mn=Math.min(...els),mx=Math.max(...els),st=Math.max(1,Math.floor(els.length/300)),E=els.filter((_,i)=>i%st===0);
  prof=`<div class="box"><b>Υψομετρικό</b><svg viewBox="0 0 300 80" style="width:100%;background:#141312;border-radius:10px;margin-top:6px"><polyline fill="none" stroke="#d97757" stroke-width="2" points="${E.map((e,i)=>`${(i/(E.length-1)*296+2).toFixed(1)},${(76-(e-mn)/Math.max(1,mx-mn)*70).toFixed(1)}`).join(' ')}"/><text x="4" y="12" font-size="10" fill="#a8a29e">${f0(mx)} m</text><text x="4" y="78" font-size="10" fill="#a8a29e">${f0(mn)} m</text></svg></div>`}
 M.innerHTML=`<div class="res"><div class="v">${f1(r.km)} km</div><div class="muted">${r.up?`↗ ${f0(r.up)} m · ↘ ${f0(r.dn)} m · `:''}${r.pts.length} σημεία${r.wps&&r.wps.length?' · '+r.wps.length+' waypoints':''}</div></div>${prof}
 <button class="big org" onclick="LS.s('ract','${id}');LS.s('mfit',1);go('map')">🗺️ ${act?L2('Δείξε στον χάρτη','Show on the map'):L2('Δείξε στον χάρτη','Show on the map')}</button>
 <div class="tools"><button class="btn" onclick="const f=LS.g('fu',{});f.trip=${Math.round(r.km)};LS.s('fu',f);go('t/fuel')">⛽ ${L2('Φτάνει το καύσιμο;','Enough fuel?')}</button><button class="btn" onclick="rGpx('${id}')">📤 GPX</button><button class="btn" onclick="rRen('${id}')">✏️ ${L2('Όνομα','Name')}</button>${act?`<button class="btn" onclick="LS.s('ract',null);mRoute('${id}')">⏹ ${L2('Κρύψε από τον χάρτη','Hide from the map')}</button>`:''}<button class="btn r" onclick="rDel('${id}')">🗑</button></div>
 ${r.wps&&r.wps.length?`<h3>Waypoints</h3>${r.wps.map(w=>`<div class="wp"><b>${esc(w.n)}</b><button class="btn" onclick="mGoTo(${w.lat},${w.lon},'${esc(w.n.replace(/'/g,''))}')">➡️</button></div>`).join('')}`:''}`}
async function rRen(id){const r=await DB.get('routes',id),n=prompt('Όνομα διαδρομής:',r.n);if(!n)return;r.n=n;await DB.put('routes',r);mRoute(id)}
async function rDel(id){if(!confirm('Διαγραφή διαδρομής;'))return;await DB.del('routes',id);if(LS.g('ract',null)===id)LS.s('ract',null);go('map/routes')}
async function rGpx(id){const r=await DB.get('routes',id);let g=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Overland’s Habit" xmlns="http://www.topografix.com/GPX/1/1">\n`;(r.wps||[]).forEach(w=>g+=`<wpt lat="${w.lat}" lon="${w.lon}"><name>${esc(w.n)}</name></wpt>\n`);
 g+=`<trk><name>${esc(r.n)}</name><trkseg>\n${r.pts.map(p=>`<trkpt lat="${p[0]}" lon="${p[1]}">${p[2]!=null?`<ele>${p[2]}</ele>`:''}</trkpt>`).join('\n')}\n</trkseg></trk>\n</gpx>`;
 const f=new File([g],r.n.replace(/[^\wΑ-Ωα-ωά-ώ -]/g,'')+'.gpx',{type:'application/gpx+xml'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f]}).catch(()=>{});else{const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;a.click()}}
let RC=null;
async function mDrawRoute(){MP.rtL.clearLayers();RC=null;const id=LS.g('ract',null);if(!id)return;const r=await DB.get('routes',id).catch(()=>null);if(!r||!MP.map)return;
 const ll=r.pts.map(p=>[p[0],p[1]]);L.polyline(ll,{color:'#141312',weight:8,opacity:.6,interactive:false}).addTo(MP.rtL);L.polyline(ll,{color:'#d97757',weight:5,interactive:false}).addTo(MP.rtL);
 L.marker(ll[0],{icon:mapIcon('🟢','#262422',24),interactive:false}).addTo(MP.rtL);L.marker(ll[ll.length-1],{icon:mapIcon('🏁','#262422',26),interactive:false}).addTo(MP.rtL);(r.wps||[]).forEach(w=>L.marker([w.lat,w.lon],{icon:mapIcon('📍','#262422',24)}).bindPopup(esc(w.n)).addTo(MP.rtL));
 const cum=[0];for(let i=1;i<r.pts.length;i++)cum.push(cum[i-1]+dist({lat:r.pts[i-1][0],lon:r.pts[i-1][1]},{lat:r.pts[i][0],lon:r.pts[i][1]}));RC={r,cum,ll};
 if(LS.g('mfit',0)){LS.s('mfit',0);MP.map.fitBounds(L.latLngBounds(ll).pad(.1))}}
function mRouteBar(){const b=$('#mrb');if(!b)return;if(MP.plan||!RC||!pos){b.innerHTML='';return}let bi=0,bd=1e12;const P=RC.r.pts,st=Math.max(1,Math.floor(P.length/1500));
 for(let i=0;i<P.length;i+=st){const d=dist(pos,{lat:P[i][0],lon:P[i][1]});if(d<bd){bd=d;bi=i}}const left=RC.cum[RC.cum.length-1]-RC.cum[bi],off=bd>150;
 b.innerHTML=`<div style="display:inline-block;background:${off?'#4a1c18':'#1f1e1dee'};border:1px solid ${off?'var(--red)':'var(--line)'};border-radius:12px;padding:5px 10px;font-size:.85em"><b>🏁 ${fmD(left)}</b> ${L2('μέχρι το τέλος','to the end')}${off?` · <b>⚠️ ${fmD(bd)} ${L2('εκτός διαδρομής','off route')}</b>`:''}</div>`}

/* ---------- Offline περιοχές ορεινού χάρτη ----------
   Κατεβάζει τα πλακίδια OpenTopoMap της περιοχής που βλέπεις στην cache «ovarea» (δεν σβήνεται μόνη της).
   Ο service worker τα βρίσκει με caches.match, άρα ο χάρτης και η πυξίδα δουλεύουν χωρίς σήμα. */
const OFFC='ovarea',OFFMAX=5000,OFFKB=22;
const t2x=(lon,z)=>Math.floor((lon+180)/360*2**z),t2y=(lat,z)=>{const r=lat*Math.PI/180;return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*2**z)};
function offTiles(b,z0,z1){const U=[];for(let z=z0;z<=z1;z++){const x0=t2x(b.w,z),x1=t2x(b.e,z),y0=t2y(b.n,z),y1=t2y(b.s,z);
 for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)U.push(`https://${'abc'[Math.abs(x+y)%3]}.tile.opentopomap.org/${z}/${x}/${y}.png`)}return U}
function offView(){const B=MP.map.getBounds();return{n:+B.getNorth().toFixed(4),s:+B.getSouth().toFixed(4),w:+B.getWest().toFixed(4),e:+B.getEast().toFixed(4)}}
const offMB=n=>(n*OFFKB/1024).toFixed(n*OFFKB<10240?1:0)+' MB';
function offDraw(){if(!MP.map)return;if(!MP.offL)MP.offL=L.layerGroup().addTo(MP.map);MP.offL.clearLayers();
 LS.g('offa',[]).forEach(a=>L.rectangle([[a.b.s,a.b.w],[a.b.n,a.b.e]],{color:'#5f9e7a',weight:2,dashArray:'6 6',fill:false,interactive:false}).addTo(MP.offL))}
function offPanel(){if(!MP.map)return;MP.card=null;const z=MP.map.getZoom(),b=offView(),A=LS.g('offa',[]),z0=Math.max(6,Math.min(z,14)-3);
 const opt=[15,16].map(z1=>{const n=offTiles(b,z0,z1).length;return`<button ${n>OFFMAX?'disabled style="opacity:.4"':z1===15?'class="o"':''} onclick="offGet(${z0},${z1})">⬇️ ${L2('ως ζουμ','to zoom')} ${z1}<br><small>${n} ${L2('πλακίδια','tiles')} · ~${offMB(n)}</small></button>`}).join('');
 $('#mbar').innerHTML=`<div class="msh"><div style="display:flex;justify-content:space-between;align-items:center"><b>⬇️ ${L2('Ορεινός χάρτης offline','Mountain map offline')}</b><button class="hb" onclick="mBarHome()">✖</button></div>
 <div class="muted" style="font-size:.8em">${L2('Κατεβάζει ό,τι βλέπεις τώρα στην οθόνη (μονοπάτια, χωματόδρομοι, ισοϋψείς), για χρήση χωρίς σήμα μαζί με την πυξίδα. Με WiFi. Οι περιοχές σου φαίνονται με πράσινο διακεκομμένο.','Downloads what you see on screen now (trails, dirt roads, contours) for use without signal with the compass. On WiFi. Your areas show as green dashed boxes.')}${z<9?' <b>'+L2('Ζούμαρε πιο κοντά για μικρότερη περιοχή.','Zoom in for a smaller area.')+'</b>':''}</div>
 <div class="mg" style="grid-template-columns:1fr 1fr">${opt}</div><div id="offp" style="font-size:.85em;margin-top:6px"></div>
 ${A.length?`<div style="margin-top:8px;max-height:28vh;overflow:auto">${A.map((a,i)=>`<div class="wp" style="margin:4px 0"><b style="flex:1;font-size:.85em">🟩 ${esc(a.n)}<br><small class="muted">${a.c} ${L2('πλακίδια','tiles')} · ~${offMB(a.c)} · z${a.z0}–${a.z1}</small></b><button class="btn" onclick="MP.map.fitBounds([[${a.b.s},${a.b.w}],[${a.b.n},${a.b.e}]])">🗺️</button><button class="btn r" onclick="offDel(${i})">🗑</button></div>`).join('')}</div>`:''}</div>`}
let OFFRUN=null;
async function offGet(z0,z1){if(OFFRUN)return;const b=offView(),U=offTiles(b,z0,z1),p=$('#offp');if(U.length>OFFMAX)return;
 try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
 const c=await caches.open(OFFC);let i=0,ok=0,bad=0;OFFRUN={stop:0};wake(1);
 const ui=()=>{if(p)p.innerHTML=`⏳ ${ok+bad} / ${U.length}${bad?' · ⚠️ '+bad:''} <button class="btn" style="padding:4px 10px" onclick="OFFRUN&&(OFFRUN.stop=1)">✖ ${L2('Σταμάτα','Stop')}</button>`};ui();
 const work=async()=>{while(i<U.length&&!OFFRUN.stop){const u=U[i++];try{if(await c.match(u)){ok++;continue}const r=await fetch(u,{mode:'cors'});if(r.ok){await c.put(u,r);ok++}else bad++}catch(e){bad++}if((ok+bad)%20===0)ui()}};
 await Promise.all([work(),work(),work(),work()]);const stopped=OFFRUN.stop;OFFRUN=null;wake(0);
 if(ok){const A=LS.g('offa',[]),ce=MP.map?MP.map.getCenter():{lat:(b.n+b.s)/2,lng:(b.w+b.e)/2},nm=prompt(L2('Όνομα περιοχής:','Area name:'),L2('Περιοχή ','Area ')+(A.length+1)+' ('+ce.lat.toFixed(2)+', '+ce.lng.toFixed(2)+')')||L2('Περιοχή ','Area ')+(A.length+1);
  A.push({n:nm,b,z0,z1,c:ok,t:Date.now()});LS.s('offa',A);offDraw()}
 if(MP.map){offPanel();const q=$('#offp');if(q)q.innerHTML=(stopped?'⏹ ':'✅ ')+ok+' '+L2('πλακίδια κατέβηκαν','tiles downloaded')+(bad?` · ⚠️ ${bad} ${L2('απέτυχαν (ξαναπάτα για να συμπληρωθούν)','failed (tap again to fill in)')}`:'')}}
async function offDel(i){const A=LS.g('offa',[]),a=A[i];if(!a||!confirm(L2('Να σβηστεί η offline περιοχή «','Delete offline area «')+a.n+'»;'))return;A.splice(i,1);LS.s('offa',A);
 const keep=new Set();A.forEach(x=>offTiles(x.b,x.z0,x.z1).forEach(u=>keep.add(u)));const c=await caches.open(OFFC);for(const u of offTiles(a.b,a.z0,a.z1))if(!keep.has(u))await c.delete(u);offDraw();offPanel()}
