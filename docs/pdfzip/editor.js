// PDF Editor — PDF Tools · Created by George Barbaris
// Objects are stored in PDF user space (points), so page rotation / zoom never moves them.
import * as pdfjsLib from "./pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.mjs";

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const MAXPX = 9e6;
const ASC = 0.946, LH = 1.2;           // DejaVu: baseline offset in a 1.2 line box
const FONTS = {sans:"DejaVuSans.ttf", bold:"DejaVuSans-Bold.ttf", serif:"DejaVuSerif.ttf"};
const FFAM = {sans:"EdSans", bold:"EdBold", serif:"EdSerif"};
const rad = a => a*Math.PI/180;
const down = a => [Math.sin(rad(a)), -Math.cos(rad(a))];   // screen-down in user space for text angle a
const add = (p, v, k=1) => [p[0]+v[0]*k, p[1]+v[1]*k];

let ED = null;          // editor state
let CUR = null;         // {page, R, VP, z}
let IMGS = {};          // id -> {d:dataURL, k:'png'|'jpg'}
let TEXTS = {};         // src index -> textContent items
let renderTask = null, imgSeq = 0;

// ---------------------------------------------------------------- open
export async function openEditor(file){
  let bytes = new Uint8Array(await file.arrayBuffer()), name = file.name;
  if (!/pdf$/i.test(file.type) && !/\.pdf$/i.test(file.name)) {        // a photo -> 1-page PDF
    bytes = await imageToPdf(file); name = file.name.replace(/\.[^.]+$/, "") + ".pdf";
  }
  const pdf = await pdfjsLib.getDocument({data: bytes.slice(), isEvalSupported:false}).promise;
  ED = {bytes, name, pdf, pages:[...Array(pdf.numPages)].map((_,i) => ({src:i, extra:0, objs:[], crop:null})),
        cur:0, tool:"sel", color:"#c00000", size:14, font:"sans", pen:2, zoom:1, sel:-1, editing:false, undo:[], redo:[]};
  IMGS = {}; TEXTS = {};
  $("ed").classList.remove("hide"); document.body.style.overflow = "hidden";
  $("edName").textContent = name;
  setTool("sel"); await render();
}
async function imageToPdf(file){
  const u = URL.createObjectURL(file), im = new Image();
  await new Promise((r, j) => { im.onload = r; im.onerror = () => j(new Error("Δεν διαβάζεται η εικόνα.")); im.src = u; });
  let w = im.naturalWidth, h = im.naturalHeight, s = Math.min(1, 2400/Math.max(w,h));
  const c = document.createElement("canvas"); c.width = Math.round(w*s); c.height = Math.round(h*s);
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,c.width,c.height); x.drawImage(im, 0, 0, c.width, c.height);
  URL.revokeObjectURL(u);
  const jpg = new Uint8Array(await (await new Promise(r => c.toBlob(r, "image/jpeg", 0.9))).arrayBuffer());
  const doc = await PDFLib.PDFDocument.create(), img = await doc.embedJpg(jpg);
  const k = 72/150, pg = doc.addPage([c.width*k, c.height*k]);
  pg.drawImage(img, {x:0, y:0, width:c.width*k, height:c.height*k});
  return await doc.save();
}
function close(){
  if (ED && ED.undo.length && !confirm("Κλείσιμο χωρίς αποθήκευση; Οι αλλαγές θα χαθούν.")) return;
  ED?.pdf?.destroy(); ED = null; IMGS = {};
  $("ed").classList.add("hide"); document.body.style.overflow = "";
}

// ---------------------------------------------------------------- undo
const snap = () => JSON.stringify(ED.pages);
function commit(before){ if (before !== snap()) { ED.undo.push(before); if (ED.undo.length > 80) ED.undo.shift(); ED.redo = []; } updBar(); }
function undo(){ if (!ED.undo.length) return; ED.redo.push(snap()); ED.pages = JSON.parse(ED.undo.pop()); ED.cur = Math.min(ED.cur, ED.pages.length-1); ED.sel = -1; render(); }
function redo(){ if (!ED.redo.length) return; ED.undo.push(snap()); ED.pages = JSON.parse(ED.redo.pop()); ED.cur = Math.min(ED.cur, ED.pages.length-1); ED.sel = -1; render(); }

// ---------------------------------------------------------------- render page
const P = () => ED.pages[ED.cur];
async function render(){
  const p = P(); if (!p) return;
  const page = await ED.pdf.getPage(p.src + 1);
  const R = (page.rotate + p.extra) % 360;
  const base = page.getViewport({scale:1, rotation:R});
  const avail = Math.max(200, $("edScroll").clientWidth - 20);
  const z = avail / base.width * ED.zoom;
  const VP = page.getViewport({scale:z, rotation:R});
  CUR = {page, R, VP, z};
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  let k = dpr; if (VP.width*k * VP.height*k > MAXPX) k = Math.sqrt(MAXPX/(VP.width*VP.height));
  const cv = $("edCv");
  cv.width = Math.floor(VP.width*k); cv.height = Math.floor(VP.height*k);
  cv.style.width = VP.width + "px"; cv.style.height = VP.height + "px";
  $("edPage").style.width = VP.width + "px"; $("edPage").style.height = VP.height + "px";
  const ctx = cv.getContext("2d", {alpha:false, willReadFrequently:true});
  ctx.setTransform(1,0,0,1,0,0); ctx.fillStyle = "#fff"; ctx.fillRect(0,0,cv.width,cv.height);
  try { renderTask?.cancel(); } catch(e){}
  renderTask = page.render({canvasContext:ctx, viewport:VP, transform:[k,0,0,k,0,0]});
  draw(); updBar();
  try { await renderTask.promise; } catch(e){ /* cancelled */ }
}
const toScr = pt => CUR.VP.convertToViewportPoint(pt[0], pt[1]);
const toPdf = s => CUR.VP.convertToPdfPoint(s[0], s[1]);
function scrRect(r){ const v = CUR.VP.convertToViewportRectangle(r); return [Math.min(v[0],v[2]), Math.min(v[1],v[3]), Math.abs(v[2]-v[0]), Math.abs(v[3]-v[1])]; }
function pdfRect(x, y, w, h){ const a = toPdf([x,y]), b = toPdf([x+w,y+h]); return [Math.min(a[0],b[0]), Math.min(a[1],b[1]), Math.max(a[0],b[0]), Math.max(a[1],b[1])]; }

// ---------------------------------------------------------------- draw overlay
function draw(){
  const ov = $("edOv"), p = P(), z = CUR.z, R = CUR.R;
  ov.innerHTML = "";
  ov.style.touchAction = ED.tool === "sel" ? "pan-x pan-y" : "none";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg"); svg.setAttribute("class", "edSvg");
  svg.setAttribute("width", CUR.VP.width); svg.setAttribute("height", CUR.VP.height);
  ov.appendChild(svg);
  p.objs.forEach((o, i) => {
    let el;
    if (o.t === "wo" || o.t === "hl" || o.t === "rc"){
      const [x,y,w,h] = scrRect(o.r);
      el = document.createElement("div"); el.className = "obj";
      Object.assign(el.style, {left:x+"px", top:y+"px", width:w+"px", height:h+"px"});
      if (o.t === "wo") el.style.background = o.c;
      if (o.t === "hl") { el.style.background = o.c; el.style.opacity = .38; }
      if (o.t === "rc") el.style.border = `${Math.max(1, o.w*z)}px solid ${o.c}`;
    } else if (o.t === "tx"){
      const s = toScr(o.p);
      el = document.createElement("div"); el.className = "obj tx";
      Object.assign(el.style, {left:s[0]+"px", top:s[1]+"px", fontSize:(o.s*z)+"px", color:o.c, fontFamily:FFAM[o.f]||FFAM.sans, transform:`rotate(${R - o.a}deg)`});
      el.textContent = o.v || "";
      if (ED.sel === i && ED.editing){
        try { el.contentEditable = "plaintext-only"; } catch(_) {} if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
        el.classList.add("editing");
        el.oninput = () => { o.v = el.innerText.replace(/\n$/, ""); };
        el.onblur = () => { if (ED && ED.editing) { ED.editing = false; if (!o.v.trim()) { p.objs.splice(i,1); ED.sel = -1; } commit(ED._editBefore); draw(); } };
      }
    } else if (o.t === "im"){
      const s = toScr(o.p);
      el = document.createElement("img"); el.className = "obj"; el.draggable = false;
      el.src = IMGS[o.id]?.d || "";
      Object.assign(el.style, {left:s[0]+"px", top:s[1]+"px", width:(o.w*z)+"px", height:(o.h*z)+"px", transform:`rotate(${R - o.a}deg)`, transformOrigin:"0 0"});
    } else if (o.t === "pn"){
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", o.pts.map((q,k) => { const s = toScr(q); return (k?"L":"M") + s[0].toFixed(1) + " " + s[1].toFixed(1); }).join(" "));
      Object.assign(path.style, {fill:"none", stroke:o.c, strokeWidth:Math.max(1, o.w*z), strokeLinecap:"round", strokeLinejoin:"round", opacity:o.o||1});
      path.dataset.i = i; svg.appendChild(path);
      if (ED.sel === i) { const bb = penBox(o); el = document.createElement("div"); el.className = "obj ghost"; Object.assign(el.style, {left:bb[0]+"px", top:bb[1]+"px", width:bb[2]+"px", height:bb[3]+"px"}); }
    }
    if (!el) return;
    el.dataset.i = i;
    if (ED.sel === i) {
      el.classList.add("sel");
      if (o.t !== "tx" && o.t !== "pn") { const hd = document.createElement("div"); hd.className = "hd"; hd.dataset.i = i; hd.dataset.h = "1"; el.appendChild(hd); }
    }
    ov.appendChild(el);
  });
  if (p.crop){
    const [x,y,w,h] = scrRect(p.crop);
    const m = document.createElement("div"); m.className = "cropmask"; Object.assign(m.style, {left:x+"px", top:y+"px", width:w+"px", height:h+"px"}); ov.appendChild(m);
  }
  if (ED.editing){ const e = ov.querySelector(".editing"); if (e && document.activeElement !== e){ e.focus(); const r = document.createRange(); r.selectNodeContents(e); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
  props();
}
function penBox(o){ const pts = o.pts.map(toScr), xs = pts.map(q=>q[0]), ys = pts.map(q=>q[1]), m = 4;
  return [Math.min(...xs)-m, Math.min(...ys)-m, Math.max(...xs)-Math.min(...xs)+2*m, Math.max(...ys)-Math.min(...ys)+2*m]; }

// ---------------------------------------------------------------- toolbar / props
function setTool(t){
  if (ED.editing) document.activeElement?.blur?.();
  ED.tool = t; ED.sel = -1;
  document.querySelectorAll("#edTools [data-tool]").forEach(b => b.classList.toggle("on", b.dataset.tool === t));
  const hint = {sel:"Πάτα αντικείμενο για επιλογή · σύρε για μετακίνηση · ξαναπάτα κείμενο για διόρθωση",
    et:"Πάτα πάνω σε λέξη/γραμμή του PDF για να τη διορθώσεις (μόνο σε PDF με κείμενο — σε σκαναρισμένο χρησιμοποίησε ⬜ + 🔤)",
    tx:"Πάτα όπου θέλεις να γράψεις", wo:"Σύρε πάνω σε ό,τι θέλεις να σβήσεις — παίρνει μόνο του το χρώμα του φόντου",
    cut:"Σύρε γύρω από λέξεις/περιοχή — κόβεται και μετακινείται όπου θέλεις", hl:"Σύρε για μαρκάρισμα", pn:"Ζωγράφισε / υπέγραψε με το δάχτυλο",
    rc:"Σύρε για πλαίσιο", crop:"Σύρε την περιοχή της σελίδας που θα μείνει"}[t] || "";
  $("edHint").textContent = hint;
  if (CUR) draw();
}
function props(){
  const box = $("edProps"), o = ED.sel >= 0 ? P().objs[ED.sel] : null;
  const crop = P().crop;
  if (!o && !crop) { box.innerHTML = `<span class="note">Χρώμα</span><input type="color" id="pCol" value="${ED.color}"><span class="note">Μέγεθος</span><button class="btn s" id="pSm">−</button><b>${ED.tool==="pn"||ED.tool==="rc" ? ED.pen : ED.size}</b><button class="btn s" id="pBg">+</button>`;
    $("pCol").oninput = e => ED.color = e.target.value;
    const ch = d => { if (ED.tool==="pn"||ED.tool==="rc") ED.pen = Math.max(0.5, Math.min(20, ED.pen + d*(ED.pen<3?0.5:1))); else ED.size = Math.max(5, Math.min(96, ED.size + d)); props(); };
    $("pSm").onclick = () => ch(-1); $("pBg").onclick = () => ch(1);
    return; }
  let h = "";
  if (o){
    if (o.t === "tx") h += `<button class="btn s" id="pEd">✎ Διόρθωση</button><button class="btn s" id="pSm">A−</button><b>${o.s.toFixed(1)}</b><button class="btn s" id="pBg">A+</button>
      <select id="pFont" style="width:auto;padding:5px"><option value="sans">Sans</option><option value="bold">Bold</option><option value="serif">Serif</option></select>`;
    if (o.t !== "im") h += `<input type="color" id="pCol" value="${o.c}">`;
    if (o.t === "rc" || o.t === "pn") h += `<button class="btn s" id="pSm">−</button><b>${o.w}</b><button class="btn s" id="pBg">+</button>`;
    h += `<button class="btn s" id="pDup" title="Αντίγραφο">⧉</button><button class="btn s" id="pAll" title="Σε όλες τις σελίδες">📑 Όλες</button><button class="btn s d" id="pDel">🗑</button>`;
  }
  if (crop && !o) h += `<span class="note">✂ Crop σελίδας</span><button class="btn s d" id="pUncrop">✕ Ακύρωση crop</button>`;
  box.innerHTML = h;
  const ch = fn => () => { const b = snap(); fn(); commit(b); draw(); };
  if (o){
    if (o.t === "tx"){
      $("pFont").value = o.f || "sans";
      $("pFont").onchange = ch(() => o.f = $("pFont").value);
      $("pEd").onclick = () => startEdit(ED.sel);
      $("pSm").onclick = ch(() => o.s = Math.max(3, +(o.s - (o.s > 12 ? 1 : 0.5)).toFixed(1)));
      $("pBg").onclick = ch(() => o.s = Math.min(120, +(o.s + (o.s >= 12 ? 1 : 0.5)).toFixed(1)));
    }
    if (o.t === "rc" || o.t === "pn"){
      $("pSm").onclick = ch(() => o.w = Math.max(0.5, +(o.w - 0.5).toFixed(1)));
      $("pBg").onclick = ch(() => o.w = Math.min(30, +(o.w + 0.5).toFixed(1)));
    }
    if ($("pCol")) { let b0 = null; $("pCol").onfocus = () => b0 = snap(); $("pCol").oninput = e => { o.c = e.target.value; ED.color = o.c; draw(); }; $("pCol").onchange = () => { if (b0) commit(b0); }; }
    $("pDel").onclick = ch(() => { P().objs.splice(ED.sel, 1); ED.sel = -1; });
    $("pDup").onclick = ch(() => { const c = JSON.parse(JSON.stringify(o)); shift(c, 14, 14); P().objs.push(c); ED.sel = P().objs.length - 1; });
    $("pAll").onclick = () => { if (!confirm("Να μπει το ίδιο αντικείμενο σε όλες τις άλλες σελίδες (ίδια θέση);")) return;
      const b = snap(); ED.pages.forEach((pg, k) => { if (k !== ED.cur) pg.objs.push(JSON.parse(JSON.stringify(o))); }); commit(b); toast("Μπήκε σε " + (ED.pages.length-1) + " σελίδες"); };
  }
  if ($("pUncrop")) $("pUncrop").onclick = ch(() => P().crop = null);
}
function updBar(){
  if (!ED) return;
  $("edPg").textContent = `${ED.cur+1} / ${ED.pages.length}`;
  $("edUndo").disabled = !ED.undo.length; $("edRedo").disabled = !ED.redo.length;
  $("edZoom").textContent = Math.round(ED.zoom*100) + "%";
}
function toast(t){ const d = document.createElement("div"); d.className = "edToast"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1800); }

// ---------------------------------------------------------------- geometry helpers
function shift(o, dx, dy){   // move object by screen delta (dx,dy)
  const d0 = toPdf([0,0]), d1 = toPdf([dx,dy]), v = [d1[0]-d0[0], d1[1]-d0[1]];
  if (o.r) { o.r = [o.r[0]+v[0], o.r[1]+v[1], o.r[2]+v[0], o.r[3]+v[1]]; }
  if (o.p) o.p = add(o.p, v);
  if (o.pts) o.pts = o.pts.map(q => add(q, v));
}
function sampleBg(x, y, w, h, wantInk){
  // colour of the page around a screen rect (median of a 3px ring); optional ink colour inside
  const cv = $("edCv"), k = cv.width / CUR.VP.width, ctx = cv.getContext("2d", {willReadFrequently:true});
  const X = Math.max(0, Math.floor((x-3)*k)), Y = Math.max(0, Math.floor((y-3)*k));
  const W = Math.min(cv.width - X, Math.ceil((w+6)*k)), H = Math.min(cv.height - Y, Math.ceil((h+6)*k));
  if (W < 2 || H < 2) return {bg:"#ffffff", ink:"#000000"};
  const d = ctx.getImageData(X, Y, W, H).data, ring = [], inner = [], b = Math.max(1, Math.round(3*k));
  for (let j=0; j<H; j++) for (let i=0; i<W; i++){
    const o = (j*W + i)*4, px = [d[o], d[o+1], d[o+2]];
    if (i < b || j < b || i >= W-b || j >= H-b) ring.push(px); else if (wantInk && (i+j) % 2 === 0) inner.push(px);
  }
  const med = a => { const s = [0,1,2].map(c => a.map(p => p[c]).sort((m,n)=>m-n)[a.length>>1]); return s; };
  const hex = c => "#" + c.map(v => Math.round(v).toString(16).padStart(2,"0")).join("");
  const bg = med(ring.length ? ring : [[255,255,255]]);
  let ink = [0,0,0];
  if (wantInk && inner.length){
    const dist = p => Math.abs(p[0]-bg[0]) + Math.abs(p[1]-bg[1]) + Math.abs(p[2]-bg[2]);
    const far = inner.map(p => [dist(p), p]).sort((a,b) => b[0]-a[0]).slice(0, Math.max(3, inner.length*0.06|0)).map(q => q[1]);
    if (far.length && dist(far[0]) > 60) ink = med(far);
  }
  return {bg:hex(bg), ink:hex(ink)};
}
async function clipRegion(x, y, w, h){
  const S = Math.max(2.5, CUR.z * Math.min(3, devicePixelRatio || 1)), k = S / CUR.z;
  const vp = CUR.page.getViewport({scale:S, rotation:CUR.R, offsetX:-x*k, offsetY:-y*k});
  const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w*k)); c.height = Math.max(1, Math.round(h*k));
  const ctx = c.getContext("2d", {alpha:false}); ctx.fillStyle = "#fff"; ctx.fillRect(0,0,c.width,c.height);
  await CUR.page.render({canvasContext:ctx, viewport:vp}).promise;
  const id = "i" + (++imgSeq) + "_" + Date.now();
  IMGS[id] = {d: c.toDataURL("image/png"), k:"png"};
  return id;
}

// ---------------------------------------------------------------- pointer interaction
function local(e){ const r = $("edOv").getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
let DRAG = null;
let BUSYCUT = false;
function onDown(e){
  if (!ED || e.button > 0 || BUSYCUT) return;
  const ov = $("edOv"), s = local(e), tgt = e.target.closest("[data-i]");
  if (ED.editing){ if (tgt && +tgt.dataset.i === ED.sel) return; document.activeElement?.blur?.(); }
  const t = ED.tool;
  if (t === "sel"){
    if (!tgt){ if (ED.sel !== -1){ ED.sel = -1; draw(); } return; }
    e.preventDefault();
    const i = +tgt.dataset.i, o = P().objs[i];
    const wasSel = ED.sel === i;
    ED.sel = i;
    DRAG = {kind: tgt.dataset.h ? "resize" : "move", i, s0:s, o0:JSON.stringify(o), before:snap(), moved:false, wasSel};
    ov.setPointerCapture(e.pointerId);
    if (!wasSel) draw();
    return;
  }
  e.preventDefault(); ov.setPointerCapture(e.pointerId);
  if (t === "tx"){ newText(s); return; }
  if (t === "et"){ editExisting(s); return; }
  if (t === "pn"){ const before = snap(); P().objs.push({t:"pn", pts:[toPdf(s)], c:ED.color, w:ED.pen}); DRAG = {kind:"pen", before, i:P().objs.length-1}; draw(); return; }
  DRAG = {kind:"rect", s0:s, box:null};
  const b = document.createElement("div"); b.className = "rubber"; ov.appendChild(b); DRAG.box = b;
}
function onMove(e){
  if (!DRAG) return;
  const s = local(e);
  if (DRAG.kind === "pen"){ P().objs[DRAG.i].pts.push(toPdf(s)); const path = $("edOv").querySelector(`path[data-i="${DRAG.i}"]`);
    if (path) path.setAttribute("d", path.getAttribute("d") + ` L${s[0].toFixed(1)} ${s[1].toFixed(1)}`); return; }
  if (DRAG.kind === "rect"){ const [x0,y0] = DRAG.s0, x = Math.min(x0,s[0]), y = Math.min(y0,s[1]);
    Object.assign(DRAG.box.style, {left:x+"px", top:y+"px", width:Math.abs(s[0]-x0)+"px", height:Math.abs(s[1]-y0)+"px"}); return; }
  const dx = s[0]-DRAG.s0[0], dy = s[1]-DRAG.s0[1];
  if (!DRAG.moved && Math.hypot(dx,dy) < 4) return;
  DRAG.moved = true;
  const o = JSON.parse(DRAG.o0);
  if (DRAG.kind === "move") shift(o, dx, dy);
  else { // resize
    if (o.r){ const [x,y,w,h] = scrRect(o.r); o.r = pdfRect(x, y, Math.max(6, w+dx), Math.max(6, h+dy)); }
    else if (o.t === "im"){ const nw = Math.max(8, o.w*CUR.z + dx)/CUR.z; o.h = o.h*nw/o.w; o.w = nw; }
  }
  P().objs[DRAG.i] = o; draw();
}
async function onUp(e){
  if (!DRAG) return;
  const d = DRAG; DRAG = null;
  if (d.kind === "pen"){ const o = P().objs[d.i]; if (o.pts.length < 2) o.pts.push(add(o.pts[0], [0.5,0.5])); commit(d.before); draw(); return; }
  if (d.kind === "rect"){
    d.box.remove();
    const s = local(e), x = Math.min(d.s0[0], s[0]), y = Math.min(d.s0[1], s[1]), w = Math.abs(s[0]-d.s0[0]), h = Math.abs(s[1]-d.s0[1]);
    if (w < 4 || h < 4) return;
    const before = snap(), r = pdfRect(x, y, w, h), t = ED.tool;
    if (t === "wo") P().objs.push({t:"wo", r, c:sampleBg(x,y,w,h).bg});
    if (t === "hl") P().objs.push({t:"hl", r, c:ED.color === "#c00000" ? "#ffe600" : ED.color});
    if (t === "rc") P().objs.push({t:"rc", r, c:ED.color, w:ED.pen});
    if (t === "crop") P().crop = r;
    if (t === "cut"){
      BUSYCUT = true; let id; try { id = await clipRegion(x, y, w, h); } finally { BUSYCUT = false; }
      P().objs.push({t:"wo", r, c:sampleBg(x,y,w,h).bg});
      P().objs.push({t:"im", id, p:toPdf([x,y]), a:CUR.R, w:w/CUR.z, h:h/CUR.z});
      commit(before); setTool("sel"); ED.sel = P().objs.length-1; draw(); toast("Σύρε το κομμάτι όπου θέλεις"); return;
    }
    commit(before); if (t !== "crop") { ED.sel = P().objs.length-1; } draw(); return;
  }
  // move/resize
  if (d.moved) { commit(d.before); return; }
  const o = P().objs[d.i];
  if (o && o.t === "tx" && d.wasSel) startEdit(d.i);
}
function startEdit(i){ ED._editBefore = snap(); ED.sel = i; ED.editing = true; draw(); }
function newText(s){
  ED._editBefore = snap();
  P().objs.push({t:"tx", p:toPdf([s[0], s[1] - ED.size*CUR.z*0.6]), a:CUR.R, s:ED.size, c:ED.color, f:ED.font, v:""});
  ED.tool = "sel"; document.querySelectorAll("#edTools [data-tool]").forEach(b => b.classList.toggle("on", b.dataset.tool === "sel"));
  ED.sel = P().objs.length - 1; ED.editing = true; draw();
}
async function editExisting(s){
  const p = P();
  if (!TEXTS[p.src]) { const tc = await CUR.page.getTextContent(); TEXTS[p.src] = tc.items.filter(it => it.str && it.str.trim()).map(it => ({...it, fam: (tc.styles[it.fontName]||{}).fontFamily || ""})); }
  const pt = toPdf(s);
  let best = null, bestD = 1e9;
  for (const it of TEXTS[p.src]){
    const [a,b,c,d,e,f] = it.transform, th = Math.atan2(b,a), fs = Math.hypot(c,d) || Math.hypot(a,b);
    const dir = [Math.cos(th), Math.sin(th)], up = [-Math.sin(th), Math.cos(th)];
    const vx = pt[0]-e, vy = pt[1]-f, u = vx*dir[0] + vy*dir[1], v = vx*up[0] + vy*up[1];
    const wdt = it.width || it.str.length*fs*0.5;
    if (u >= -2 && u <= wdt+2 && v >= -0.35*fs && v <= 1.05*fs){ const dd = Math.abs(v - 0.35*fs); if (dd < bestD){ bestD = dd; best = {it, th, fs, dir, up, wdt, e, f}; } }
  }
  if (!best){ toast("Δεν βρέθηκε κείμενο εδώ — αν είναι σκαναρισμένο, χρησιμοποίησε ⬜ Σβήστρα + 🔤 Κείμενο"); return; }
  const {it, th, fs, dir, up, wdt, e, f} = best, before = snap();
  // whiteout over the original run
  const corner = (u, v) => [e + dir[0]*u + up[0]*v, f + dir[1]*u + up[1]*v];
  const cs = [corner(-0.5,-0.3*fs), corner(wdt+0.5,-0.3*fs), corner(wdt+0.5,1.0*fs), corner(-0.5,1.0*fs)];
  const r = [Math.min(...cs.map(q=>q[0])), Math.min(...cs.map(q=>q[1])), Math.max(...cs.map(q=>q[0])), Math.max(...cs.map(q=>q[1]))];
  const [x,y,w,h] = scrRect(r), col = sampleBg(x,y,w,h,true);
  p.objs.push({t:"wo", r, c:col.bg});
  // new text at the same baseline (DejaVu is a bit wider than most PDF fonts)
  const A = Math.round(th*180/Math.PI), size = +(fs*0.95).toFixed(1);
  const dn = down(A), tl = add([e,f], dn, -ASC*size);
  let fname = ""; try { fname = CUR.page.commonObjs.get(it.fontName)?.name || ""; } catch(_) {}
  const fam = /bold|black|heavy|semibold/i.test(fname) ? "bold" : (/sans|arial|helvet|calibri|verdana|tahoma|segoe/i.test(fname) ? "sans" : ((/^serif$/i.test(it.fam) || /times|serif|roman|georgia|garamond|cambria|book/i.test(fname)) ? "serif" : "sans"));
  p.objs.push({t:"tx", p:tl, a:A, s:size, c:col.ink, f:fam, v:it.str});
  ED._editBefore = before;
  setTool("sel"); ED.sel = p.objs.length - 1; ED.editing = true; draw();
}

// ---------------------------------------------------------------- pages
async function goPage(i){ if (!ED || i < 0 || i >= ED.pages.length) return; if (ED.editing) document.activeElement?.blur?.(); ED.cur = i; ED.sel = -1; $("edScroll").scrollTop = 0; await render(); }
function rotPage(){ const b = snap(); P().extra = (P().extra + 90) % 360; commit(b); render(); }
function delPage(){ if (ED.pages.length < 2) { toast("Δεν γίνεται να σβήσεις τη μοναδική σελίδα"); return; }
  if (!confirm(`Διαγραφή σελίδας ${ED.cur+1};`)) return; const b = snap(); ED.pages.splice(ED.cur,1); ED.cur = Math.min(ED.cur, ED.pages.length-1); commit(b); render(); }
function movePage(d){ const j = ED.cur + d; if (j < 0 || j >= ED.pages.length) return; const b = snap(); [ED.pages[ED.cur], ED.pages[j]] = [ED.pages[j], ED.pages[ED.cur]]; ED.cur = j; commit(b); render(); }

// ---------------------------------------------------------------- image / signature
async function addImage(file){
  const u = URL.createObjectURL(file), im = new Image();
  await new Promise((r, j) => { im.onload = r; im.onerror = j; im.src = u; });
  let w = im.naturalWidth, h = im.naturalHeight, s = Math.min(1, 1400/Math.max(w,h));
  const c = document.createElement("canvas"); c.width = Math.round(w*s); c.height = Math.round(h*s);
  c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
  const png = /png|gif|webp/i.test(file.type);
  const id = "i" + (++imgSeq) + "_" + Date.now();
  IMGS[id] = {d: png ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", 0.9), k: png ? "png" : "jpg"};
  const sw = Math.min(CUR.VP.width*0.4, c.width), sh = sw*c.height/c.width;
  const sc = $("edScroll"), cx = Math.max(10, Math.min(CUR.VP.width - sw - 10, sc.scrollLeft + sc.clientWidth/2 - sw/2)), cy = Math.max(10, sc.scrollTop + 60);
  const before = snap();
  P().objs.push({t:"im", id, p:toPdf([cx, cy]), a:CUR.R, w:sw/CUR.z, h:sh/CUR.z});
  commit(before); setTool("sel"); ED.sel = P().objs.length-1; draw();
}

// ---------------------------------------------------------------- save
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return PDFLib.rgb((n>>16&255)/255, (n>>8&255)/255, (n&255)/255); };
async function save(){
  if (ED.editing) document.activeElement?.blur?.();
  const btn = $("edSave"); btn.disabled = true; btn.textContent = "⏳…";
  try {
    const src = await PDFLib.PDFDocument.load(ED.bytes, {ignoreEncryption:true, updateMetadata:false});
    if (src.isEncrypted) throw new Error("Το PDF είναι κλειδωμένο (encrypted). Άνοιξέ το και κάνε «Εκτύπωση → PDF» και ξαναδοκίμασε.");
    const out = await PDFLib.PDFDocument.create();
    if (!window.fontkit) await new Promise((r, j) => { const sc = document.createElement("script"); sc.src = "fontkit.umd.min.js"; sc.onload = r; sc.onerror = () => j(new Error("Δεν φόρτωσε το fontkit — άνοιξε μία φορά με internet.")); document.head.appendChild(sc); });
    out.registerFontkit(window.fontkit);
    const fonts = {}, imgs = {};
    const font = async f => fonts[f] ||= await out.embedFont(new Uint8Array(await (await fetch("fonts/" + FONTS[f])).arrayBuffer()), {subset:false});
    const img = async id => imgs[id] ||= (IMGS[id].k === "png" ? out.embedPng(IMGS[id].d) : out.embedJpg(IMGS[id].d));
    const copied = await out.copyPages(src, ED.pages.map(p => p.src));
    for (let i=0; i<ED.pages.length; i++){
      const p = ED.pages[i], pg = out.addPage(copied[i]);
      if (p.extra) pg.setRotation(PDFLib.degrees((pg.getRotation().angle + p.extra) % 360));
      for (const o of p.objs){
        if (o.t === "wo" || o.t === "hl" || o.t === "rc"){
          const [x0,y0,x1,y1] = o.r, base = {x:x0, y:y0, width:x1-x0, height:y1-y0};
          if (o.t === "wo") pg.drawRectangle({...base, color:hexRgb(o.c), borderWidth:0});
          if (o.t === "hl") pg.drawRectangle({...base, color:hexRgb(o.c), opacity:0.38, borderWidth:0});
          if (o.t === "rc") pg.drawRectangle({...base, borderColor:hexRgb(o.c), borderWidth:o.w});
        } else if (o.t === "tx" && o.v && o.v.trim()){
          const F = await font(o.f || "sans"), cs = new Set(F.getCharacterSet()), dn = down(o.a);
          const lines = o.v.split("\n");
          lines.forEach((ln, k) => {
            const txt = [...ln].map(ch => cs.has(ch.codePointAt(0)) ? ch : "?").join("");
            if (!txt) return;
            const b = add(o.p, dn, (ASC + LH*k) * o.s);
            pg.drawText(txt, {x:b[0], y:b[1], size:o.s, font:F, color:hexRgb(o.c), rotate:PDFLib.degrees(o.a)});
          });
        } else if (o.t === "im" && IMGS[o.id]){
          const I = await img(o.id), bl = add(o.p, down(o.a), o.h);
          pg.drawImage(I, {x:bl[0], y:bl[1], width:o.w, height:o.h, rotate:PDFLib.degrees(o.a)});
        } else if (o.t === "pn"){
          for (let k=1; k<o.pts.length; k++)
            pg.drawLine({start:{x:o.pts[k-1][0], y:o.pts[k-1][1]}, end:{x:o.pts[k][0], y:o.pts[k][1]}, thickness:o.w, color:hexRgb(o.c), lineCap:PDFLib.LineCapStyle.Round, opacity:o.o||1});
        }
      }
      if (p.crop){ const [x0,y0,x1,y1] = p.crop; pg.setCropBox(x0, y0, x1-x0, y1-y0); pg.setMediaBox(x0, y0, x1-x0, y1-y0); }
    }
    out.setProducer("PDF Tools — Created by George Barbaris");
    const blob = new Blob([await out.save({useObjectStreams:true})], {type:"application/pdf"});
    const name = ED.name.replace(/\.pdf$/i, "") + "_edited.pdf";
    window.PT.show([{name, blob, note:`${ED.pages.length} σελίδες`}], `<span class="big">✏️ ${name}</span><div class="note">Αποθηκεύτηκε — ${window.PT.fmt(blob.size)}</div>`, 0, null, true);
    ED.undo = []; ED.redo = []; close();
  } catch(e){ alert("Σφάλμα αποθήκευσης: " + (e.message || e)); console.error(e); }
  finally { btn.disabled = false; btn.textContent = "💾 Αποθήκευση"; }
}

// ---------------------------------------------------------------- wire up
export function setupEditor(){
  $("edClose").onclick = close;
  $("edUndo").onclick = undo; $("edRedo").onclick = redo;
  $("edSave").onclick = save;
  document.querySelectorAll("#edTools [data-tool]").forEach(b => b.onclick = () => setTool(b.dataset.tool));
  $("edImgBtn").onclick = () => $("edImgFile").click();
  $("edImgFile").onchange = e => { const f = e.target.files[0]; e.target.value = ""; if (f) addImage(f); };
  $("edPrev").onclick = () => goPage(ED.cur - 1); $("edNext").onclick = () => goPage(ED.cur + 1);
  $("edRot").onclick = rotPage; $("edDelP").onclick = delPage;
  $("edMvL").onclick = () => movePage(-1); $("edMvR").onclick = () => movePage(1);
  $("edZin").onclick = () => { ED.zoom = Math.min(4, ED.zoom * 1.25); render(); };
  $("edZout").onclick = () => { ED.zoom = Math.max(0.5, ED.zoom / 1.25); render(); };
  const ov = $("edOv");
  ov.addEventListener("pointerdown", onDown);
  ov.addEventListener("pointermove", onMove);
  ov.addEventListener("pointerup", onUp);
  ov.addEventListener("pointercancel", () => { if (DRAG?.box) DRAG.box.remove(); DRAG = null; });
  document.addEventListener("keydown", e => {
    if (!ED || $("ed").classList.contains("hide")) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); return; }
    if (ED.editing) { if (e.key === "Escape") document.activeElement?.blur?.(); return; }
    if ((e.key === "Delete" || e.key === "Backspace") && ED.sel >= 0) { e.preventDefault(); const b = snap(); P().objs.splice(ED.sel,1); ED.sel = -1; commit(b); draw(); }
    if (e.key === "Escape") { ED.sel = -1; draw(); }
  });
  let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => ED && !$("ed").classList.contains("hide") && render(), 250); });
}
