/* ===================== v41/v42: 📜 «Οι Δεξιότητες του Παππού Διαμαντή» (αφιερωμένο στη μνήμη του παππού Διαμαντή) – εγχειρίδιο αυτάρκειας με σχέδια, μέσα στην εφαρμογή + PDF EL/EN – © 2026 Γεώργιος Μπαρμπαρής ===================== */
const DX_PDF={el:'Dexiotites_Pappou_Diamanti.pdf',en:'Grandpa_Diamantis_Skills.pdf'};let DX=null,DXp=null;const DX_FOOD=['preserve','kitchen'],DX_GM=['water-ashlye','water-laundry','tool-sewing','tool-patch','tool-darning','tool-knitting','tool-broom','herb-soap','herb-disinfect','herb-dry','herb-infusion'];
document.head.insertAdjacentHTML('beforeend',`<style>
.dxart{background:#f6ecd6;border-radius:14px;padding:6px;margin:8px 0 4px}.dxart svg{width:100%;height:auto;display:block}
.dxcap{color:var(--mut);font-size:.86em;line-height:1.35;margin:0 2px 10px;font-style:italic}
.dxst{display:flex;gap:10px;margin:8px 0;line-height:1.4}.dxst b{flex:0 0 28px;height:28px;border-radius:50%;background:#d9b77e;color:#2a1f14;text-align:center;line-height:28px;font-size:.95em}
.dxnd{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px;margin:8px 0}.dxnd label{display:flex;gap:10px;align-items:center;padding:4px 0}.dxnd input{width:22px;height:22px;flex:0 0 auto}
.dxmeta{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0}.dxmeta span{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:4px 10px;font-size:.85em}
.dxok{color:#7bd389;font-weight:900}
</style>`);
function dxLoad(){if(DX)return Promise.resolve(DX);if(!DXp)DXp=fetch('dexiotites.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>(DX=j)).catch(e=>{DXp=null;throw e});return DXp}
const dxF=(o,k)=>o[k+'_'+(LANG==='en'?'en':'el')]||o[k+'_el']||'';
const dxDone=()=>LS.g('dx_done',{});
const dxDots=n=>'●'.repeat(n||1)+'○'.repeat(3-(n||1));
function dxFind(id){for(const c of DX.chapters){const i=c.skills.findIndex(s=>s.id===id);if(i>=0)return {c,i,s:c.skills[i]}}return null}
function dx(b){T('📜 '+L2('Δεξιότητες του Παππού Διαμαντή','Grandpa Diamantis\' Skills'));
 if(!DX){M.innerHTML=`<div class="notr box" style="text-align:center">⏳ ${L2('Φορτώνει…','Loading…')}</div>`;
  dxLoad().then(()=>{if(location.hash.slice(1).split('/')[0]==='dx')dx(b)}).catch(()=>{M.innerHTML=`<div class="notr warn">${L2('Δεν φορτώθηκε. Άνοιξε την εφαρμογή μία φορά με internet για να αποθηκευτεί για πάντα.','Could not load. Open the app once with internet so it is saved for good.')}</div>`});return}
 if(!b)return dxHome();
 const c=DX.chapters.find(x=>x.ch===b);if(c)return dxCh(c);
 const f=dxFind(b);if(f)return dxSk(f);dxHome()}
function dxHome(){const D2=dxDone(),tot=DX.chapters.reduce((a,c)=>a+c.skills.length,0),dn=Object.keys(D2).length,E=LANG==='en';
 M.innerHTML=`<div class="notr"><div class="box" style="text-align:center"><div style="font-size:2.4em">📜</div><b style="font-size:1.15em">${L2('Όσα ήξεραν οι παππούδες μας','What our grandparents knew')}</b><div style="font-style:italic;color:#d9b77e;margin-top:6px">✝ ${L2('Αφιερωμένο στη μνήμη του παππού μου, Διαμαντή.','Dedicated to the memory of my grandfather, Diamantis.')}<br><small>${L2('Και ό,τι είναι φαγητό, τροφή και δουλειές του σπιτιού – πλύσιμο, ράψιμο, πλέξιμο, σαπούνι – στη γιαγιά Μαρία ♥ και στη μνήμη της γιαγιάς Αρετής ✝.','And all that is food, cooking and the work of the home – washing, sewing, knitting, soap – to Grandma Maria ♥ and to the memory of Grandma Areti ✝.')}</small><br><small>— ${L2('Γιώργος Μπαρμπαρής','Georgios Barmparis')}</small></div>
 <div class="muted" style="margin-top:6px">${L2(`${tot} παλιές δεξιότητες για να ζήσεις και να ξαναχτίσεις τη ζωή σου χωρίς ρεύμα, μαγαζιά και internet. Απλά βήματα και ένα σχέδιο σε κάθε μία.`,`${tot} old skills to live and rebuild your life without power, shops or internet. Simple steps and a drawing for each one.`)}</div>
 <div class="bar" style="margin-top:10px"><i style="width:${Math.round(100*dn/tot)}%"></i></div><div class="muted">${L2('Τις έμαθα','Learned')}: <b>${dn}</b> / ${tot}</div></div>
 <div class="grid">${DX.chapters.map(c=>{const n=c.skills.filter(s=>D2[s.id]).length;return `<button class="tile" onclick="go('dx/${c.ch}')"><span class="e">${c.icon}</span>${esc(dxF(c,'title'))}<small>${c.skills.length} ${L2('δεξιότητες','skills')}${n?` · <span class="dxok">✔ ${n}</span>`:''}</small></button>`}).join('')}</div>
 <a class="big grn" href="${E?DX_PDF.en:DX_PDF.el}" download style="display:block;text-decoration:none;text-align:center;margin-top:14px">📥 ${L2('Κατέβασε όλο το βιβλίο σε PDF','Download the whole book as PDF')}<small>${L2('για εκτύπωση Α4 · κράτα το στο σπίτι σε ντοσιέ','to print on A4 · keep it at home in a folder')}</small></a>
 <a class="btn" href="${E?DX_PDF.el:DX_PDF.en}" download style="display:block;text-align:center;text-decoration:none;margin:6px 0 12px">${L2('📥 English edition','📥 Ελληνική έκδοση')}</a>
 <div class="tip">💡 ${L2('Μάθε τες τώρα, όσο όλα είναι καλά – και δείξ\' τες στα παιδιά σου. Πάτα «✔ Το έμαθα» σε όσες δοκιμάσεις.','Learn them now, while all is well – and show your children. Tap «✔ I learned it» on those you try.')}</div>
 <div class="warn" style="font-weight:400;font-size:.9em">⚠️ ${L2('Γενικές πληροφορίες, όχι ιατρική ή επαγγελματική συμβουλή. Διάβαζε πάντα την «Προσοχή». Τήρησε τους νόμους της περιοχής σου.','General information, not medical or professional advice. Always read «Careful». Follow your local laws.')}</div></div>`}
function dxCh(c){const D2=dxDone();T(c.icon+' '+dxF(c,'title'));
 M.innerHTML=`<div class="notr">${DX_FOOD.includes(c.ch)?`<div style="text-align:center;font-style:italic;color:#d9b77e;margin:4px 0">${L2('Αφιερωμένο στη γιαγιά Μαρία ♥ και στη μνήμη της γιαγιάς Αρετής ✝','Dedicated to Grandma Maria ♥ and to the memory of Grandma Areti ✝')}</div>`:''}<div class="dxart">${c.opener_svg}</div><p>${esc(dxF(c,'intro'))}</p>
 ${c.skills.map((s,i)=>`<button class="row" onclick="go('dx/${s.id}')"><span class="e" style="font-size:1em;min-width:28px">${D2[s.id]?'<span class="dxok">✔</span>':(i+1)}</span><span><b>${esc(dxF(s,'title'))}</b><small>${dxDots(s.level)} · ${esc(dxF(s,'time'))}</small></span></button>`).join('')}
 <button class="btn" style="width:100%;margin-top:10px" onclick="go('dx')">📜 ${L2('Όλα τα κεφάλαια','All chapters')}</button></div>`}
function dxSk(f){const {c,i,s}=f,D2=dxDone(),ok=!!D2[s.id];T(c.icon+' '+dxF(c,'title'));
 const need=s['need_'+(LANG==='en'?'en':'el')]||s.need_el,steps=s['steps_'+(LANG==='en'?'en':'el')]||s.steps_el,pv=c.skills[i-1],nx=c.skills[i+1];
 M.innerHTML=`<div class="notr"><h2 style="margin:4px 0 2px">${esc(dxF(s,'title'))}</h2>
 <div class="dxmeta"><span>${L2('Δυσκολία','Difficulty')} ${dxDots(s.level)}</span><span>⏱ ${esc(dxF(s,'time'))}</span><span>${i+1} / ${c.skills.length}</span></div>
 <div class="dxart">${s.svg}</div><div class="dxcap">${esc(dxF(s,'fig'))}</div>
 <div class="box" style="margin-top:0"><b>${L2('Γιατί;','Why?')}</b> ${esc(dxF(s,'why'))}</div>
 <h3>🧺 ${L2('Τι χρειάζεσαι','What you need')}</h3><div class="dxnd">${need.map(x=>`<label><input type="checkbox"> ${esc(x)}</label>`).join('')}</div>
 <h3>👣 ${L2('Βήμα βήμα','Step by step')}</h3>${steps.map((x,k)=>`<div class="dxst"><b>${k+1}</b><span>${esc(x)}</span></div>`).join('')}
 ${dxF(s,'tip')?`<div class="tip">💡 <b>${(DX_FOOD.includes(c.ch)||DX_GM.includes(s.id))?((DX_FOOD.includes(c.ch)?i:DX_GM.indexOf(s.id))%2?L2('Συμβουλή της γιαγιάς Αρετής','Grandma Areti\'s tip'):L2('Συμβουλή της γιαγιάς Μαρίας','Grandma Maria\'s tip')):L2('Συμβουλή του παππού Διαμαντή','Grandpa Diamantis\' tip')}:</b> ${esc(dxF(s,'tip'))}</div>`:''}
 ${dxF(s,'warn')?`<div class="warn">⚠️ ${L2('Προσοχή','Careful')}: ${esc(dxF(s,'warn'))}</div>`:''}
 <button class="big ${ok?'grn':'blu'}" onclick="dxMark('${s.id}')">${ok?'✔ '+L2('Το έμαθα!','I learned it!'):'☐ '+L2('Το έμαθα','I learned it')}<small>${ok?L2('πάτα ξανά για να το βγάλεις','tap again to undo'):L2('σημείωσέ το όταν το δοκιμάσεις','mark it when you have tried it')}</small></button>
 <div class="grid">${pv?`<button class="btn" onclick="go('dx/${pv.id}')">◀ ${L2('Προηγούμενη','Previous')}</button>`:`<span></span>`}${nx?`<button class="btn p" onclick="go('dx/${nx.id}')">${L2('Επόμενη','Next')} ▶</button>`:`<button class="btn" onclick="go('dx/${c.ch}')">${c.icon} ${L2('Κεφάλαιο','Chapter')}</button>`}</div>
 <button class="btn" style="width:100%;margin-top:8px" onclick="go('dx/${c.ch}')">${c.icon} ${esc(dxF(c,'title'))}</button></div>`}
function dxMark(id){const D2=dxDone();if(D2[id])delete D2[id];else{D2[id]=Date.now();vib(40)}LS.s('dx_done',D2);dx(id)}
{const _r=render;render=function(r){const [a,b]=r.split('/');if(a==='dx')return dx(b);return _r(r)}}
{const _h=home;home=function(){_h();const p=M.querySelector(`button[onclick="go('t/print')"]`)||M.querySelector(`button[onclick="go('tools')"]`);if(!p)return;
 p.insertAdjacentHTML('beforebegin',`<button class="tile notr" onclick="go('dx')" style="grid-column:1/-1;min-height:84px;background:#3b2a1a;border-color:#d9b77e"><span class="e" style="font-size:1.6em">📜</span>${L2('Οι Δεξιότητες του Παππού Διαμαντή','Grandpa Diamantis\' Skills')}<small>${L2('νερό · φωτιά · ψωμί · συντήρηση · κήπος · ζώα · βότανα · εργαλεία · σπίτι – με σχέδια & PDF','water · fire · bread · preserving · garden · animals · herbs · tools · home – with drawings & PDF')}</small></button>`)}}
{const _s=sq;sq=function(){_s();const q=norm(($('#q')||{}).value||'').trim();if(q.length<2)return;
 if(!DX){dxLoad().then(()=>{if($('#q'))sq()}).catch(()=>{});return}
 const r=[];for(const c of DX.chapters)for(const s of c.skills){const t=norm(s.title_el+' '+s.title_en),x=norm((s.steps_el||[]).join(' ')+' '+(s.steps_en||[]).join(' '));const sc=(t.includes(q)?10:0)+(x.includes(q)?1:0);if(sc)r.push({c,s,sc})}
 r.sort((a,b)=>b.sc-a.sc);if(r.length)$('#sr').insertAdjacentHTML('beforeend',`<div class="notr"><h3>📜 ${L2('Δεξιότητες του Παππού Διαμαντή','Grandpa Diamantis\' Skills')}</h3>${r.slice(0,15).map(x=>`<button class="row" onclick="go('dx/${x.s.id}')"><span class="e">${x.c.icon}</span><span><b>${esc(dxF(x.s,'title'))}</b><small>${esc(dxF(x.c,'title'))}</small></span></button>`).join('')}</div>`)}}

