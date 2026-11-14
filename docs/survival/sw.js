const C="survival-v34";const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","jsqr.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("survival")&&x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// v26: network first ΜΕ ΟΡΙΟ 3,5″ – με αδύναμο σήμα ανοίγει αμέσως από την αποθήκη (πριν έμενε κενή οθόνη μέχρι να αποτύχει το δίκτυο).
// Αποθηκεύει μόνο σωστές απαντήσεις (όχι σελίδες σφάλματος 404/503) και μόνο αρχεία της εφαρμογής (όχι άλλα sites).
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;const u=new URL(q.url);
 if(u.origin!==location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 let put=null;
 const net=fetch(q).then(r=>{if(r.ok&&r.type==="basic"){const cp=r.clone();put=caches.open(C).then(c=>c.put(q,cp)).catch(()=>{})}return r});
 e.waitUntil(net.then(()=>put,()=>{}));
 const hit=caches.match(q,{ignoreSearch:true,cacheName:C}).then(r=>r||(q.mode==="navigate"?caches.match("index.html",{cacheName:C}):null));
 e.respondWith(hit.then(c=>{if(!c)return net;
  return new Promise(ok=>{let done=false;const fin=r=>{if(!done){done=true;ok(r)}};const t=setTimeout(()=>fin(c),3500);
   net.then(r=>{clearTimeout(t);fin(r.ok?r:c)},()=>{clearTimeout(t);fin(c)})})}));});
