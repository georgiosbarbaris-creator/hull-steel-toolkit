/* ===== Overland Habit, Φάση 6: Γλώσσα EL/EN =====
   Ο κώδικας και τα δεδομένα μένουν ελληνικά (τα ✓ των λιστών, οι ρυθμίσεις κ.λπ. δεν χάνονται).
   Στα αγγλικά, ό,τι φαίνεται στην οθόνη (κείμενα, placeholder, alert/confirm/prompt, canvas, share)
   περνά από το λεξικό I18N_EN (en-ui.js). Τα μαθήματα της Ακαδημίας αλλάζουν ολόκληρα (academy-en.js). */
const LANG=(()=>{try{const s=localStorage.getItem('ov_lang');if(s)return JSON.parse(s)}catch(e){}
 return /^el/i.test(navigator.language||'el')?'el':'en'})();
const LOC=LANG==='en'?'en-GB':'el-GR';
document.documentElement.lang=LANG;
function setLang(l){try{localStorage.setItem('ov_lang',JSON.stringify(l))}catch(e){}location.reload()}
const L2=(el,en)=>LANG==='en'?en:el; /* για νέα κείμενα: L2('Ελληνικά','English') */
const GRX=/[Ͱ-Ͽἀ-῿]/;
let _trD=null,_trR=null;
function _trInit(){if(_trD)return;_trD=(typeof I18N_EN!=='undefined')?I18N_EN:{};
 const ks=Object.keys(_trD).filter(k=>k&&k.length>2&&_trD[k]!==k).sort((a,b)=>b.length-a.length);
 const e=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const LT=/^\p{L}/u,RT=/\p{L}$/u;
 try{_trR=new RegExp(ks.map(k=>(LT.test(k)?'(?<!\\p{L})':'')+e(k)+(RT.test(k)?'(?!\\p{L})':'')).join('|'),'gu')}catch(x){_trR=null}}
function tr(s){if(LANG!=='en'||s==null)return s;s=String(s);if(!GRX.test(s))return s;_trInit();
 const t=s.trim();if(_trD[t]!=null&&t.length>1){const i=s.indexOf(t);return s.slice(0,i)+_trD[t]+s.slice(i+t.length)}
 const c=t.replace(/^[^\p{L}\p{N}«(]+/u,'').replace(/[^\p{L}\p{N}».)!?]+$/u,'');if(c.length>2&&_trD[c]!=null){const i=s.indexOf(c);return s.slice(0,i)+_trD[c]+s.slice(i+c.length)}
 return _trR?s.replace(_trR,m=>_trD[m]):s}
if(LANG==='en'){
 const SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,NOSCRIPT:1};const ATTR=['placeholder','title','aria-label'];
 const tn=n=>{const v=n.nodeValue;if(!v||!GRX.test(v))return;const p=n.parentNode;if(!p||SKIP[p.nodeName]||(p.closest&&p.closest('[data-nt],[contenteditable]')))return;const w=tr(v);if(w!==v)n.nodeValue=w};
 const ta=el=>{for(const a of ATTR){const v=el.getAttribute&&el.getAttribute(a);if(v&&GRX.test(v)){const w=tr(v);if(w!==v)el.setAttribute(a,w)}}
  if(el.tagName==='INPUT'&&/^(button|submit)$/i.test(el.type)&&GRX.test(el.value))el.value=tr(el.value)};
 const walk=r=>{if(r.nodeType===3)return tn(r);if(r.nodeType!==1||SKIP[r.nodeName])return;ta(r);
  const w=document.createTreeWalker(r,5,null);let n;while(n=w.nextNode()){if(n.nodeType===3)tn(n);else ta(n)}};
 const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(walk);else if(m.type==='characterData')tn(m.target);else ta(m.target)}});
 mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});
 document.addEventListener('DOMContentLoaded',()=>walk(document.body));
 /* διάλογοι, canvas, κοινοποίηση */
 const A=window.alert,C=window.confirm,P=window.prompt;
 window.alert=m=>A.call(window,tr(m));window.confirm=m=>C.call(window,tr(m));window.prompt=(m,d)=>P.call(window,tr(m),d==null?d:tr(d));
 const CP=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
 if(CP)['fillText','strokeText','measureText'].forEach(f=>{const o=CP[f];CP[f]=function(t,...a){return o.call(this,tr(t),...a)}});
 if(navigator.share){const S=navigator.share.bind(navigator);navigator.share=d=>{const o=Object.assign({},d);if(o.title)o.title=tr(o.title);if(o.text)o.text=tr(o.text);return S(o)}}
 if(navigator.clipboard&&navigator.clipboard.writeText){const W=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=t=>W(tr(t))}
}
