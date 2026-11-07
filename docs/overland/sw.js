const C="overland-v9",TC="ovtiles";const TH=/(tile\.openstreetmap\.org|tile\.opentopomap\.org|server\.arcgisonline\.com)$/;const FILES=["./","index.html","manifest.webmanifest","i18n.js","knots.js","en-ui.js","academy-en.js","data.js","port.js","map.js","convoy.js","rally.js","academy-data.js","academy.js","lib/leaflet.js","lib/leaflet.css","../grade/data.js","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("overland")&&x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// network first (updates when online), cache fallback (offline)
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);
 if(TH.test(u.hostname)){e.respondWith(caches.open(TC).then(c=>c.match(e.request).then(h=>h||fetch(e.request).then(r=>{if(r.ok){c.put(e.request,r.clone());trim(c)}return r}))));return}
 if(u.origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));});
let tn=0;function trim(c){if(++tn%50)return;c.keys().then(k=>{if(k.length>6000)for(let i=0;i<k.length-6000;i++)c.delete(k[i])})}
