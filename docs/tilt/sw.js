const C="tilt-v2";const FILES=["./","index.html","manifest.webmanifest","roofdb.js","guide.js","legal.js","icon-192.png","icon-512.png","apple-touch-icon.png","../crawl/data.js","../crawl/vehicles2.js","../crawl/extra.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("tilt-")&&x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// network first (gets updates when online), cache fallback (offline on the trail)
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));});
