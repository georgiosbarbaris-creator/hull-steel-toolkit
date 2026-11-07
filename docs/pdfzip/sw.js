const C="pdfzip-v8";const FILES=["scanner.js","qrcode.js","i18n.js","editor.js","fontkit.umd.min.js","fonts/DejaVuSans.ttf","fonts/DejaVuSans-Bold.ttf","fonts/DejaVuSerif.ttf","mammoth.browser.min.js","xlsx.full.min.js","html2canvas.min.js","./","index.html","manifest.webmanifest","pdf.min.mjs","pdf.worker.min.mjs","pdf-lib.min.js","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("pdfzip")&&x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));});
