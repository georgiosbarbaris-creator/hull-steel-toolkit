// Document scanner — PDF Tools · Created by George Barbaris
// Offline: edge detection, perspective correction, shadow removal filters, multi-page PDF/JPG.
const $ = id => document.getElementById(id);
const PT = () => window.PT;
let PAGES = [];               // {src:Blob, sw, sh, quad:[[x,y]x4 normalized TL,TR,BR,BL], rot, filter, thumb}
let EDIT = null;              // page being edited
let CAM = null;               // camera state
const FILTERS = [["doc","📄 Έγγραφο"],["bw","⚫ Ασπρόμαυρο"],["color","🎨 Χρώμα+"],["gray","◐ Γκρι"],["orig","🖼 Πρωτότυπο"]];
const MAXSRC = 3200;

// ================================================================ geometry
function otsu(g){
  const h = new Float64Array(256); for (let i=0;i<g.length;i++) h[g[i]]++;
  let sum = 0; for (let i=0;i<256;i++) sum += i*h[i];
  let sB = 0, wB = 0, best = 0, t = 127, tot = g.length;
  for (let i=0;i<256;i++){ wB += h[i]; if (!wB) continue; const wF = tot - wB; if (!wF) break; sB += i*h[i];
    const mB = sB/wB, mF = (sum - sB)/wF, v = wB*wF*(mB-mF)*(mB-mF); if (v > best){ best = v; t = i; } }
  return t;
}
function boxBlur(g, w, h, r){
  const t = new Float32Array(w*h), o = new Uint8ClampedArray(w*h);
  for (let y=0;y<h;y++){ let s = 0, n = 0; for (let x=-r;x<w;x++){ if (x+r < w){ s += g[y*w+x+r]; n++; } if (x-r-1 >= 0){ s -= g[y*w+x-r-1]; n--; } if (x >= 0) t[y*w+x] = s/n; } }
  for (let x=0;x<w;x++){ let s = 0, n = 0; for (let y=-r;y<h;y++){ if (y+r < h){ s += t[(y+r)*w+x]; n++; } if (y-r-1 >= 0){ s -= t[(y-r-1)*w+x]; n--; } if (y >= 0) o[y*w+x] = s/n; } }
  return o;
}
function hull(pts){
  pts.sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  const cr = (o,a,b) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
  const lo = [], up = [];
  for (const p of pts){ while (lo.length >= 2 && cr(lo[lo.length-2], lo[lo.length-1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i=pts.length-1;i>=0;i--){ const p = pts[i]; while (up.length >= 2 && cr(up[up.length-2], up[up.length-1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
}
function dp(poly, eps){ // Douglas-Peucker on closed polygon
  if (poly.length < 5) return poly;
  // split at farthest pair approx: start at 0 and farthest from it
  let far = 0, fd = -1; for (let i=1;i<poly.length;i++){ const d = (poly[i][0]-poly[0][0])**2 + (poly[i][1]-poly[0][1])**2; if (d > fd){ fd = d; far = i; } }
  const seg = (a) => { if (a.length < 3) return a; const [p, q] = [a[0], a[a.length-1]]; let im = 0, dm = -1;
    const L = Math.hypot(q[0]-p[0], q[1]-p[1]) || 1;
    for (let i=1;i<a.length-1;i++){ const d = Math.abs((q[0]-p[0])*(p[1]-a[i][1]) - (p[0]-a[i][0])*(q[1]-p[1]))/L; if (d > dm){ dm = d; im = i; } }
    if (dm > eps){ const l = seg(a.slice(0, im+1)), r = seg(a.slice(im)); return l.slice(0,-1).concat(r); } return [p, q]; };
  const A = seg(poly.slice(0, far+1)), B = seg(poly.slice(far).concat([poly[0]]));
  return A.slice(0,-1).concat(B.slice(0,-1));
}
const area = q => { let s = 0; for (let i=0;i<q.length;i++){ const a = q[i], b = q[(i+1)%q.length]; s += a[0]*b[1] - b[0]*a[1]; } return Math.abs(s)/2; };
function orderQuad(q){
  const cx = q.reduce((s,p)=>s+p[0],0)/4, cy = q.reduce((s,p)=>s+p[1],0)/4;
  q = q.slice().sort((a,b) => Math.atan2(a[1]-cy, a[0]-cx) - Math.atan2(b[1]-cy, b[0]-cx));   // clockwise on screen
  let k = 0; q.forEach((p,i) => { if (p[0]+p[1] < q[k][0]+q[k][1]) k = i; });
  return q.slice(k).concat(q.slice(0,k));                                                      // TL,TR,BR,BL
}
// returns normalized quad or null
function detect(src, sw, sh){
  const S = 300/Math.max(sw, sh), w = Math.max(8, Math.round(sw*S)), h = Math.max(8, Math.round(sh*S));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d", {willReadFrequently:true}); x.drawImage(src, 0, 0, w, h);
  const d = x.getImageData(0,0,w,h).data, g0 = new Uint8ClampedArray(w*h);
  for (let i=0;i<w*h;i++) g0[i] = (d[i*4]*77 + d[i*4+1]*150 + d[i*4+2]*29) >> 8;
  const g = boxBlur(boxBlur(g0, w, h, 2), w, h, 2);
  const tries = [otsu(g)]; tries.push(tries[0] + 18, tries[0] - 14);
  let best = null;
  for (const t of tries){
    const lab = new Int32Array(w*h); let bestN = 0, bestL = 0, L = 0; const st = new Int32Array(w*h);
    for (let i=0;i<w*h;i++){ if (g[i] <= t || lab[i]) continue; L++; let sp = 0, n = 0; st[sp++] = i; lab[i] = L;
      while (sp){ const j = st[--sp]; n++; const jx = j % w, jy = (j / w) | 0;
        if (jx > 0 && !lab[j-1] && g[j-1] > t){ lab[j-1] = L; st[sp++] = j-1; }
        if (jx < w-1 && !lab[j+1] && g[j+1] > t){ lab[j+1] = L; st[sp++] = j+1; }
        if (jy > 0 && !lab[j-w] && g[j-w] > t){ lab[j-w] = L; st[sp++] = j-w; }
        if (jy < h-1 && !lab[j+w] && g[j+w] > t){ lab[j+w] = L; st[sp++] = j+w; } }
      if (n > bestN){ bestN = n; bestL = L; } }
    const frac = bestN/(w*h);
    if (frac < 0.12 || frac > 0.97) continue;
    const pts = [];
    for (let y=0;y<h;y++) for (let xx=0;xx<w;xx++){ const i = y*w+xx; if (lab[i] !== bestL) continue;
      if (xx === 0 || y === 0 || xx === w-1 || y === h-1 || lab[i-1] !== bestL || lab[i+1] !== bestL || lab[i-w] !== bestL || lab[i+w] !== bestL) pts.push([xx, y]); }
    if (pts.length < 8) continue;
    let H = hull(pts);
    let P = dp(H, 2.2); if (P.length > 24) P = dp(H, 4);
    if (P.length < 4) continue;
    let bq = null, ba = 0; const n = P.length;
    for (let a=0;a<n;a++) for (let b=a+1;b<n;b++) for (let cc=b+1;cc<n;cc++) for (let e=cc+1;e<n;e++){ const ar = area([P[a],P[b],P[cc],P[e]]); if (ar > ba){ ba = ar; bq = [P[a],P[b],P[cc],P[e]]; } }
    if (!bq) continue;
    const hullA = area(H), fill = ba / hullA;                 // how rectangular the blob is
    const score = fill * Math.min(1, ba/(w*h*0.25));
    if (fill < 0.85) continue;
    if (!best || score > best.score) best = {score, q: bq};
  }
  if (!best) return null;
  return orderQuad(best.q).map(p => [Math.min(1, Math.max(0, p[0]/w)), Math.min(1, Math.max(0, p[1]/h))]);
}
const FULLQ = () => [[0.02,0.02],[0.98,0.02],[0.98,0.98],[0.02,0.98]];

function solve(A, b){ const n = b.length; for (let i=0;i<n;i++){ let m = i; for (let r=i+1;r<n;r++) if (Math.abs(A[r][i]) > Math.abs(A[m][i])) m = r;
  [A[i],A[m]] = [A[m],A[i]]; [b[i],b[m]] = [b[m],b[i]];
  for (let r=i+1;r<n;r++){ const f = A[r][i]/A[i][i]; for (let c=i;c<n;c++) A[r][c] -= f*A[i][c]; b[r] -= f*b[i]; } }
  const x = new Array(n); for (let i=n-1;i>=0;i--){ let s = b[i]; for (let c=i+1;c<n;c++) s -= A[i][c]*x[c]; x[i] = s/A[i][i]; } return x; }
function homog(from, to){ // maps from[i] -> to[i]
  const A = [], b = [];
  for (let i=0;i<4;i++){ const [x,y] = from[i], [u,v] = to[i];
    A.push([x,y,1,0,0,0,-u*x,-u*y]); b.push(u); A.push([0,0,0,x,y,1,-v*x,-v*y]); b.push(v); }
  const h = solve(A, b); return [...h, 1];
}
function warp(srcCv, quadPx, ow, oh){
  const sw = srcCv.width, sh = srcCv.height, sd = srcCv.getContext("2d", {willReadFrequently:true}).getImageData(0,0,sw,sh).data;
  const H = homog([[0,0],[ow,0],[ow,oh],[0,oh]], quadPx);
  const out = document.createElement("canvas"); out.width = ow; out.height = oh;
  const ox = out.getContext("2d"), od = ox.createImageData(ow, oh), o = od.data;
  for (let y=0;y<oh;y++){
    const yy = y + 0.5;
    let X = H[0]*0.5 + H[1]*yy + H[2], Y = H[3]*0.5 + H[4]*yy + H[5], W = H[6]*0.5 + H[7]*yy + 1;
    for (let x=0;x<ow;x++){
      const fx = X/W - 0.5, fy = Y/W - 0.5; X += H[0]; Y += H[3]; W += H[6];
      const x0 = fx|0, y0 = fy|0, ax = fx - x0, ay = fy - y0, k = (y*ow + x)*4;
      if (x0 < 0 || y0 < 0 || x0 >= sw-1 || y0 >= sh-1){ const cx = Math.min(sw-1, Math.max(0, Math.round(fx))), cy = Math.min(sh-1, Math.max(0, Math.round(fy))), s = (cy*sw+cx)*4; o[k]=sd[s]; o[k+1]=sd[s+1]; o[k+2]=sd[s+2]; o[k+3]=255; continue; }
      const s00 = (y0*sw + x0)*4, s10 = s00 + 4, s01 = s00 + sw*4, s11 = s01 + 4;
      const w00 = (1-ax)*(1-ay), w10 = ax*(1-ay), w01 = (1-ax)*ay, w11 = ax*ay;
      o[k]   = sd[s00]*w00 + sd[s10]*w10 + sd[s01]*w01 + sd[s11]*w11;
      o[k+1] = sd[s00+1]*w00 + sd[s10+1]*w10 + sd[s01+1]*w01 + sd[s11+1]*w11;
      o[k+2] = sd[s00+2]*w00 + sd[s10+2]*w10 + sd[s01+2]*w01 + sd[s11+2]*w11;
      o[k+3] = 255;
    }
  }
  ox.putImageData(od, 0, 0); return out;
}

// ================================================================ filters
function background(cv){
  const W = cv.width, H = cv.height, sw = Math.max(24, Math.round(W/36)), sh = Math.max(24, Math.round(H/36));
  const s = document.createElement("canvas"); s.width = sw; s.height = sh;
  const x = s.getContext("2d", {willReadFrequently:true}); x.imageSmoothingQuality = "high"; x.drawImage(cv, 0, 0, sw, sh);
  const id = x.getImageData(0,0,sw,sh), d = id.data;
  const lum = []; for (let i=0;i<d.length;i+=4) lum.push((d[i]*77+d[i+1]*150+d[i+2]*29)>>8);
  const paper = lum.slice().sort((a,b)=>a-b)[Math.floor(lum.length*0.9)] || 255;
  // morphological closing (max then min): removes dark text, keeps shadow borders where they are
  const morph = (isMax, passes) => { for (let pass=0; pass<passes; pass++){ const c = new Uint8ClampedArray(d);
    for (let y=0;y<sh;y++) for (let xx=0;xx<sw;xx++) for (let ch=0;ch<3;ch++){ let m = isMax ? 0 : 255;
      for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++){ const X = Math.min(sw-1, Math.max(0, xx+dx)), Y = Math.min(sh-1, Math.max(0, y+dy)); const v = c[(Y*sw+X)*4+ch]; if (isMax ? v > m : v < m) m = v; }
      d[(y*sw+xx)*4+ch] = m; } } };
  morph(true, 3); morph(false, 3);
  for (let i=0;i<d.length;i+=4){ const l = (d[i]*77+d[i+1]*150+d[i+2]*29)>>8, floor = paper*0.62; if (l < floor){ const k = floor/Math.max(1,l); d[i]*=k; d[i+1]*=k; d[i+2]*=k; } }
  x.putImageData(id, 0, 0);
  const b = document.createElement("canvas"); b.width = W; b.height = H;
  const bx = b.getContext("2d", {willReadFrequently:true}); bx.imageSmoothingQuality = "high";
  bx.drawImage(s, 0, 0, W, H);
  return bx.getImageData(0,0,W,H).data;
}
function applyFilter(cv, f){
  if (f === "orig") return cv;
  const x = cv.getContext("2d", {willReadFrequently:true}), id = x.getImageData(0,0,cv.width,cv.height), d = id.data, n = d.length;
  const cl = v => v < 0 ? 0 : v > 255 ? 255 : v;
  if (f === "gray"){
    const hist = new Uint32Array(256); for (let i=0;i<n;i+=4){ const l = (d[i]*77+d[i+1]*150+d[i+2]*29)>>8; d[i] = l; hist[l]++; }
    let lo = 0, hi = 255, acc = 0, N = n/4; for (let i=0;i<256;i++){ acc += hist[i]; if (acc > N*0.01){ lo = i; break; } }
    acc = 0; for (let i=255;i>=0;i--){ acc += hist[i]; if (acc > N*0.01){ hi = i; break; } }
    const k = 255/Math.max(20, hi-lo); for (let i=0;i<n;i+=4){ const v = cl((d[i]-lo)*k); d[i]=d[i+1]=d[i+2]=v; }
  } else {
    const bg = background(cv);
    for (let i=0;i<n;i+=4){
      if (f === "color"){
        let r = d[i]/Math.max(1,bg[i])*245, g = d[i+1]/Math.max(1,bg[i+1])*245, b = d[i+2]/Math.max(1,bg[i+2])*245;
        r = (r-22)*1.12; g = (g-22)*1.12; b = (b-22)*1.12;
        const l = 0.3*r + 0.59*g + 0.11*b; d[i] = cl(l + (r-l)*1.3); d[i+1] = cl(l + (g-l)*1.3); d[i+2] = cl(l + (b-l)*1.3);
      } else {
        const l = (d[i]*77+d[i+1]*150+d[i+2]*29)>>8, lb = Math.max(1, (bg[i]*77+bg[i+1]*150+bg[i+2]*29)>>8);
        const v = l/lb*245;
        let o;
        if (f === "bw") o = cl((v - 150)*255/45);
        else { const t = Math.min(1, Math.max(0, (v - 70)/(226 - 70))); o = 255*Math.pow(t, 1.6); }
        d[i] = d[i+1] = d[i+2] = o;
      }
    }
  }
  x.putImageData(id, 0, 0); return cv;
}

// ================================================================ processing
async function srcCanvas(page, maxSide){
  const bmp = await createImageBitmap(page.src);
  const s = Math.min(1, (maxSide || 1e9)/Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width*s); c.height = Math.round(bmp.height*s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height); bmp.close?.();
  return c;
}
function outSize(q, W, H, longSide){
  const P = q.map(p => [p[0]*W, p[1]*H]), dist = (a,b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
  let w = (dist(P[0],P[1]) + dist(P[3],P[2]))/2, h = (dist(P[0],P[3]) + dist(P[1],P[2]))/2;
  const r = Math.max(w,h)/Math.min(w,h);
  if (Math.abs(r - 1.4142)/1.4142 < 0.07){ if (w > h) w = h*1.4142; else h = w*1.4142; }    // snap to A-series
  const k = longSide / Math.max(w, h);
  return [Math.max(10, Math.round(w*k)), Math.max(10, Math.round(h*k)), P];
}
function rotate(cv, rot){
  if (!rot) return cv;
  const c = document.createElement("canvas"), sw = rot % 180 !== 0;
  c.width = sw ? cv.height : cv.width; c.height = sw ? cv.width : cv.height;
  const x = c.getContext("2d"); x.translate(c.width/2, c.height/2); x.rotate(rot*Math.PI/180); x.drawImage(cv, -cv.width/2, -cv.height/2);
  return c;
}
async function processPage(page, longSide, src){
  src ||= await srcCanvas(page, Math.min(MAXSRC, longSide*1.6));
  const [ow, oh, P] = outSize(page.quad, src.width, src.height, longSide);
  let c = warp(src, P, ow, oh);
  c = applyFilter(c, page.filter);
  return rotate(c, page.rot);
}
async function makeThumb(page){
  const c = await processPage(page, 420);
  page.thumb = c.toDataURL("image/jpeg", 0.75);
}

// ================================================================ adding pages
async function addFromImageSource(img, w, h, autoQuad){
  const s = Math.min(1, MAXSRC/Math.max(w, h));
  const c = document.createElement("canvas"); c.width = Math.round(w*s); c.height = Math.round(h*s);
  const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.92));
  const quad = autoQuad || detect(c, c.width, c.height) || FULLQ();
  const page = {src:blob, sw:c.width, sh:c.height, quad, rot:0, filter:$("scDefFilter").value};
  PAGES.push(page);
  await makeThumb(page);
  drawPages();
  return page;
}
async function addFiles(files){
  for (const f of files){
    if (!/^image\//.test(f.type) && !/\.(jpe?g|png|heic|heif|webp)$/i.test(f.name)) continue;
    toast("⏳ " + f.name);
    try {
      const u = URL.createObjectURL(f), im = new Image();
      await new Promise((r, j) => { im.onload = r; im.onerror = j; im.src = u; });
      await addFromImageSource(im, im.naturalWidth, im.naturalHeight);
      URL.revokeObjectURL(u);
    } catch(e){ toast("Δεν διαβάζεται: " + f.name); }
  }
}

// ================================================================ pages list
function drawPages(){
  $("scPagesCard").classList.toggle("hide", !PAGES.length);
  $("scOutCard").classList.toggle("hide", !PAGES.length);
  $("scCount").textContent = PAGES.length;
  const box = $("scPages"); box.innerHTML = "";
  PAGES.forEach((p, i) => {
    const d = document.createElement("div"); d.className = "scTh";
    d.innerHTML = `<img src="${p.thumb||""}" alt=""><span class="scN">${i+1}</span>
      <div class="scBtns"><button data-a="l">◀</button><button data-a="e">✎</button><button data-a="r">▶</button><button data-a="x">✕</button></div>`;
    d.querySelector("img").onclick = () => openEdit(i);
    d.querySelectorAll("button").forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === "e") openEdit(i);
      if (a === "x") { PAGES.splice(i, 1); drawPages(); }
      if (a === "l" && i > 0) { [PAGES[i-1], PAGES[i]] = [PAGES[i], PAGES[i-1]]; drawPages(); }
      if (a === "r" && i < PAGES.length-1) { [PAGES[i+1], PAGES[i]] = [PAGES[i], PAGES[i+1]]; drawPages(); }
    });
    box.appendChild(d);
  });
}
function toast(t){ const d = document.createElement("div"); d.className = "edToast"; d.style.zIndex = 70; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1600); }

// ================================================================ camera
async function openCamera(){
  if (!navigator.mediaDevices?.getUserMedia){ toast("Η κάμερα δεν υποστηρίζεται εδώ — χρησιμοποίησε «Κάμερα κινητού»"); $("scNativeIn").click(); return; }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:{ideal:"environment"}, width:{ideal:3840}, height:{ideal:2880}}});
  } catch(e){
    try { stream = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:"environment"}}); }
    catch(e2){ alert("Δεν δόθηκε πρόσβαση στην κάμερα. Χρησιμοποίησε «📸 Κάμερα κινητού» ή άνοιξε τις ρυθμίσεις του browser."); return; }
  }
  const v = $("scVideo"); v.srcObject = stream; v.setAttribute("playsinline", ""); v.muted = true;
  $("scCam").classList.remove("hide"); document.body.style.overflow = "hidden";
  await v.play().catch(() => {});
  const track = stream.getVideoTracks()[0], caps = track.getCapabilities?.() || {};
  $("scTorch").classList.toggle("hide", !caps.torch);
  CAM = {stream, track, torch:false, quad:null, hist:[], timer:null, busy:false, auto: localStorage.getItem("scan_auto") !== "0", stableSince:0};
  $("scAuto").classList.toggle("on", CAM.auto);
  updCamCount();
  loop();
}
function closeCamera(){
  if (!CAM) return;
  clearTimeout(CAM.timer); CAM.stream.getTracks().forEach(t => t.stop()); CAM = null;
  $("scCam").classList.add("hide"); document.body.style.overflow = "";
  drawPages();
}
function updCamCount(){ $("scCamN").textContent = PAGES.length; const last = PAGES[PAGES.length-1]; $("scCamThumb").style.backgroundImage = last?.thumb ? `url(${last.thumb})` : "none"; }
function loop(){
  if (!CAM) return;
  const v = $("scVideo"), ov = $("scOv");
  if (v.videoWidth){
    const q = detect(v, v.videoWidth, v.videoHeight);
    CAM.quad = q;
    // draw overlay matching object-fit:cover
    const W = ov.clientWidth, H = ov.clientHeight; if (ov.width !== W) { ov.width = W; ov.height = H; }
    const x = ov.getContext("2d"); x.clearRect(0,0,W,H);
    const s = Math.max(W/v.videoWidth, H/v.videoHeight), dx = (W - v.videoWidth*s)/2, dy = (H - v.videoHeight*s)/2;
    let stable = false;
    if (q){
      CAM.hist.push(q); if (CAM.hist.length > 6) CAM.hist.shift();
      const mv = CAM.hist.length < 2 ? 1 : Math.max(...q.map((p,i) => Math.hypot(p[0]-CAM.hist[0][i][0], p[1]-CAM.hist[0][i][1])));
      stable = CAM.hist.length >= 5 && mv < 0.02;
      x.beginPath(); q.forEach((p,i) => { const X = dx + p[0]*v.videoWidth*s, Y = dy + p[1]*v.videoHeight*s; i ? x.lineTo(X,Y) : x.moveTo(X,Y); }); x.closePath();
      x.fillStyle = stable ? "rgba(47,180,90,.25)" : "rgba(30,136,229,.18)"; x.fill();
      x.lineWidth = 4; x.strokeStyle = stable ? "#2fd06a" : "#4fa3ff"; x.stroke();
    } else CAM.hist = [];
    if (stable && CAM.auto && !CAM.busy){
      if (!CAM.stableSince) CAM.stableSince = Date.now();
      const left = 1200 - (Date.now() - CAM.stableSince);
      $("scHint").textContent = left > 0 ? "Μην κουνιέσαι… " : "📸";
      if (left <= 0) { CAM.stableSince = 0; CAM.hist = []; shoot(true); }
    } else { CAM.stableSince = 0; $("scHint").textContent = q ? (CAM.auto ? "Κράτα σταθερά για αυτόματη λήψη" : "Πάτα τον κύκλο για λήψη") : "Βάλε το χαρτί μέσα στην εικόνα, σε πιο σκούρο φόντο"; }
  }
  CAM.timer = setTimeout(loop, 220);
}
async function shoot(auto){
  if (!CAM || CAM.busy) return;
  const v = $("scVideo"); if (!v.videoWidth) return;
  CAM.busy = true;
  const fl = $("scFlash"); fl.style.opacity = 1; setTimeout(() => fl.style.opacity = 0, 120);
  try { navigator.vibrate?.(40); } catch(e){}
  const c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
  c.getContext("2d").drawImage(v, 0, 0);
  const q = detect(c, c.width, c.height) || CAM.quad || FULLQ();
  await addFromImageSource(c, c.width, c.height, q);
  updCamCount();
  if (CAM) { CAM.busy = false; CAM.hist = []; if (auto) { CAM.busy = true; setTimeout(() => CAM && (CAM.busy = false), 2200); } }
}

// ================================================================ page editor (corners + filter)
async function openEdit(i){
  const page = PAGES[i];
  EDIT = {i, page, quad: page.quad.map(p => p.slice()), rot: page.rot, filter: page.filter};
  $("scEd").classList.remove("hide"); document.body.style.overflow = "hidden";
  const src = await srcCanvas(page, 1600); EDIT.src = src;
  const st = $("scStage"), cv = $("scEdCv");
  const availW = st.clientWidth - 30, availH = st.clientHeight - 30, s = Math.min(availW/src.width, availH/src.height);
  cv.width = src.width; cv.height = src.height; cv.style.width = src.width*s + "px"; cv.style.height = src.height*s + "px";
  cv.getContext("2d").drawImage(src, 0, 0);
  EDIT.scale = s;
  drawFilterChips(); drawQuad();
}
function drawFilterChips(){
  const box = $("scFilt"); box.innerHTML = "";
  FILTERS.forEach(([k, t]) => { const b = document.createElement("button"); b.textContent = t; b.className = EDIT.filter === k ? "on" : ""; b.onclick = () => { EDIT.filter = k; drawFilterChips(); }; box.appendChild(b); });
}
function drawQuad(){
  const cv = $("scEdCv"), r = cv.getBoundingClientRect(), st = $("scStage").getBoundingClientRect();
  const ox = r.left - st.left, oy = r.top - st.top, W = r.width, H = r.height;
  const svg = $("scSvg"); svg.setAttribute("width", st.width); svg.setAttribute("height", st.height);
  const P = EDIT.quad.map(p => [ox + p[0]*W, oy + p[1]*H]);
  svg.innerHTML = `<path d="M0 0H${st.width}V${st.height}H0Z M${P.map(p=>p.join(" ")).join(" L")} Z" fill="rgba(0,0,0,.45)" fill-rule="evenodd"/>
    <polygon points="${P.map(p=>p.join(",")).join(" ")}" fill="rgba(79,163,255,.12)" stroke="#4fa3ff" stroke-width="2.5"/>
    ${P.map((p,i) => `<circle data-k="${i}" cx="${p[0]}" cy="${p[1]}" r="16" fill="rgba(255,255,255,.25)" stroke="#fff" stroke-width="3"/>`).join("")}
    ${P.map((p,i) => { const q = P[(i+1)%4]; return `<circle data-m="${i}" cx="${(p[0]+q[0])/2}" cy="${(p[1]+q[1])/2}" r="10" fill="#4fa3ff" stroke="#fff" stroke-width="2"/>`; }).join("")}`;
  EDIT.geo = {ox, oy, W, H};
}
function setupEditDrag(){
  const svg = $("scSvg"); let drag = null;
  svg.addEventListener("pointerdown", e => {
    const t = e.target; if (!t.dataset.k && !t.dataset.m) return;
    e.preventDefault(); svg.setPointerCapture(e.pointerId);
    drag = t.dataset.k ? {k:+t.dataset.k} : {m:+t.dataset.m, start:[e.clientX, e.clientY], q0: EDIT.quad.map(p => p.slice())};
  });
  svg.addEventListener("pointermove", e => {
    if (!drag) return;
    const st = $("scStage").getBoundingClientRect(), g = EDIT.geo;
    if (drag.k !== undefined){
      const x = (e.clientX - st.left - g.ox)/g.W, y = (e.clientY - st.top - g.oy)/g.H;
      EDIT.quad[drag.k] = [Math.min(1, Math.max(0, x)), Math.min(1, Math.max(0, y))];
      loupe(e.clientX, e.clientY, EDIT.quad[drag.k]);
    } else {           // move a whole edge
      const dx = (e.clientX - drag.start[0])/g.W, dy = (e.clientY - drag.start[1])/g.H, a = drag.m, b = (drag.m+1)%4;
      [a, b].forEach(k => EDIT.quad[k] = [Math.min(1, Math.max(0, drag.q0[k][0] + dx)), Math.min(1, Math.max(0, drag.q0[k][1] + dy))]);
    }
    drawQuad();
  });
  const end = () => { drag = null; $("scLoupe").style.display = "none"; };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
}
function loupe(cx, cy, p){
  const L = $("scLoupe"), x = L.getContext("2d"), src = EDIT.src, R = 60, Z = 2.5 / EDIT.scale;
  L.style.display = "block"; L.style.left = (cx - R) + "px"; L.style.top = (cy - 2*R - 40) + "px";
  const sx = p[0]*src.width, sy = p[1]*src.height, half = R/Z*1;
  x.clearRect(0,0,2*R,2*R); x.save(); x.beginPath(); x.arc(R,R,R,0,7); x.clip();
  x.fillStyle = "#000"; x.fillRect(0,0,2*R,2*R);
  x.drawImage(src, sx - half, sy - half, 2*half, 2*half, 0, 0, 2*R, 2*R);
  x.restore(); x.strokeStyle = "#4fa3ff"; x.lineWidth = 2; x.beginPath(); x.moveTo(R-12,R); x.lineTo(R+12,R); x.moveTo(R,R-12); x.lineTo(R,R+12); x.stroke();
  x.strokeStyle = "#fff"; x.lineWidth = 3; x.beginPath(); x.arc(R,R,R-1.5,0,7); x.stroke();
}
async function closeEdit(apply){
  if (apply && EDIT){
    const p = EDIT.page; p.quad = EDIT.quad; p.rot = EDIT.rot; p.filter = EDIT.filter;
    await makeThumb(p); drawPages();
  }
  EDIT = null; $("scEd").classList.add("hide"); document.body.style.overflow = "";
}

// ================================================================ export
async function exportAll(){
  if (!PAGES.length) return;
  const fmt = $("scFmt").value, q = $("scQ").value, size = $("scSize").value, lim = (+$("scLim").value || 0) * 1048576;
  const longSide = {n:2200, h:3300, l:1600}[q];
  const name = ($("scName").value.trim() || ("Scan_" + new Date().toISOString().slice(0,16).replace("T","_").replace(":",""))).replace(/[\\/:*?"<>|]+/g, "_");
  const btn = $("scGo"); btn.disabled = true; $("res").classList.add("hide");
  const N = PAGES.length, outs = [], items = [];
  let used = 0; const total = lim ? lim*0.96 - 30000 - N*1500 : 0;
  try {
    for (let i=0;i<N;i++){
      btn.textContent = `⏳ ${i+1} / ${N}`;
      const c = await processPage(PAGES[i], longSide);
      const gray = PAGES[i].filter === "doc" || PAGES[i].filter === "bw" || PAGES[i].filter === "gray";
      const j = await PT().fitJpeg(c, total ? (total-used)/(N-i) : 0, gray ? 0.8 : 0.85, 500);
      used += j.bytes.length;
      if (fmt === "pdf"){
        let pw, ph, x = 0, y = 0, dw, dh;
        if (size === "fit"){ const k = 72 / (longSide/11.69); pw = j.w*k; ph = j.h*k; dw = pw; dh = ph; }
        else {
          const [A, B] = size === "letter" ? [612, 792] : [595.28, 841.89], land = j.w > j.h;
          pw = land ? B : A; ph = land ? A : B;
          const s = Math.min(pw/j.w, ph/j.h); dw = j.w*s; dh = j.h*s; x = (pw-dw)/2; y = (ph-dh)/2;
        }
        items.push({bytes:j.bytes, pw, ph, x, y, dw, dh});
      } else {
        outs.push({name: N > 1 ? `${name}_${String(i+1).padStart(2,"0")}.jpg` : `${name}.jpg`, blob:new Blob([j.bytes], {type:"image/jpeg"}), note:`${j.w}×${j.h}`});
      }
      await new Promise(r => setTimeout(r, 0));
    }
    if (fmt === "pdf"){
      btn.textContent = "⏳ PDF…";
      const blob = await PT().buildPdf(items);
      outs.push({name: name + ".pdf", blob, note:`${N} σελίδ${N>1?"ες":"α"}`});
      PT().show(outs, `<span class="big">📷 ${N} σελίδ${N>1?"ες":"α"} → ${PT().fmt(blob.size)}</span>`, lim, null, true);
    } else {
      const tot = outs.reduce((s,o) => s + o.blob.size, 0);
      PT().show(outs, `<span class="big">📷 ${N} εικόν${N>1?"ες":"α"} · ${PT().fmt(tot)}</span>`, 0, name + ".zip");
    }
  } catch(e){ alert("Σφάλμα: " + (e.message || e)); console.error(e); }
  finally { btn.disabled = false; btn.textContent = "📄 Δημιουργία"; }
}

// ================================================================ setup
export function setupScanner(){
  $("scCamBtn").onclick = openCamera;
  $("scNative").onclick = () => $("scNativeIn").click();
  $("scFiles").onclick = () => $("scFilesIn").click();
  $("scNativeIn").onchange = async e => { const f = [...e.target.files]; e.target.value = ""; await addFiles(f); if (f.length) openEdit(PAGES.length-1); };
  $("scFilesIn").onchange = async e => { const f = [...e.target.files]; e.target.value = ""; await addFiles(f); };
  $("scClose").onclick = closeCamera; $("scDone").onclick = closeCamera;
  $("scShutter").onclick = () => shoot(false);
  $("scAuto").onclick = () => { if (!CAM) return; CAM.auto = !CAM.auto; $("scAuto").classList.toggle("on", CAM.auto); try { localStorage.setItem("scan_auto", CAM.auto ? "1" : "0"); } catch(e){} };
  $("scTorch").onclick = async () => { if (!CAM) return; CAM.torch = !CAM.torch; try { await CAM.track.applyConstraints({advanced:[{torch:CAM.torch}]}); } catch(e){} $("scTorch").classList.toggle("on", CAM.torch); };
  $("scEdCancel").onclick = () => closeEdit(false);
  $("scEdOk").onclick = () => closeEdit(true);
  $("scRotL").onclick = () => { EDIT.rot = (EDIT.rot + 270) % 360; toast("↺ " + EDIT.rot + "°"); };
  $("scRotR").onclick = () => { EDIT.rot = (EDIT.rot + 90) % 360; toast("↻ " + EDIT.rot + "°"); };
  $("scAutoQ").onclick = () => { const q = detect(EDIT.src, EDIT.src.width, EDIT.src.height); if (q){ EDIT.quad = q; drawQuad(); } else toast("Δεν βρέθηκαν άκρες — σύρε τις γωνίες"); };
  $("scFullQ").onclick = () => { EDIT.quad = [[0,0],[1,0],[1,1],[0,1]]; drawQuad(); };
  $("scDel").onclick = () => { if (!confirm("Διαγραφή σελίδας;")) return; PAGES.splice(EDIT.i, 1); EDIT = null; $("scEd").classList.add("hide"); document.body.style.overflow = ""; drawPages(); };
  $("scAllFilter").onclick = async () => { const f = $("scDefFilter").value; for (const p of PAGES){ p.filter = f; await makeThumb(p); } drawPages(); };
  $("scClear").onclick = () => { if (PAGES.length && !confirm("Να σβηστούν όλες οι σελίδες;")) return; PAGES = []; drawPages(); };
  $("scGo").onclick = exportAll;
  $("scDefFilter").value = localStorage.getItem("scan_filter") || "doc";
  $("scDefFilter").onchange = () => { try { localStorage.setItem("scan_filter", $("scDefFilter").value); } catch(e){} };
  $("scFmt").onchange = () => { const pdf = $("scFmt").value === "pdf"; $("scSize").closest("label").classList.toggle("hide", !pdf); };
  setupEditDrag();
  window.addEventListener("resize", () => { if (EDIT) drawQuad(); });
}
export function resetScanner(){ PAGES = []; drawPages(); }
