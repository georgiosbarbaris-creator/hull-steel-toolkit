/* ===== Επιβίωση 72+: βοηθητικά για τα σχέδια (SVG, offline) – Created by George Barbaris =====
   Κάθε αρχείο survival/img/<κατηγορία>.js γράφει: Object.assign(SIMG,{ cardId:[{at, c:['ελληνικά','English'], f:()=>'<svg inner>'}] })
   at = σε ποια ενότητα ## μπαίνει, ακριβώς κάτω από τον τίτλο της (0 = 1η ενότητα, 1 = 2η…). -1 = στην αρχή, πριν από όλα.
   f() επιστρέφει το ΕΣΩΤΕΡΙΚΟ ενός SVG με viewBox 0 0 320 180. Κείμενο μέσα στο σχέδιο ΜΟΝΟ με L2('ελ','en'), λίγες λέξεις. */
const SIMG={};
const L2=(el,en)=>(typeof LANG!=='undefined'&&LANG==='en')?en:el;
const IC={bg:'#16283d',ln:'#e8eef5',dk:'#0a1522',or:'#f77f00',rd:'#d62828',yl:'#fcbf49',gn:'#2a9d8f',bl:'#3a86ff',wt:'#2b6cb0',gr:'#8a9bb0',sk:'#24405f',sm:'#5c6b7a',sn:'#f2f6fa',gd:'#3d3226',wd:'#8b5e3c',sk2:'#e0ac69'};
/* κείμενο: o={c:χρώμα,s:μέγεθος,a:'start|middle|end',b:bold} */
const iT=(x,y,t,o)=>{o=o||{};return`<text x="${x}" y="${y}" fill="${o.c||IC.ln}" font-size="${o.s||11}" text-anchor="${o.a||'middle'}" font-weight="${o.b?700:400}" font-family="system-ui,-apple-system,sans-serif">${t}</text>`};
const iL=(x1,y1,x2,y2,c,w,d)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c||IC.ln}" stroke-width="${w||2}" stroke-linecap="round"${d?' stroke-dasharray="5 4"':''}/>`;
/* βέλος από (x1,y1) σε (x2,y2) */
function iA(x1,y1,x2,y2,c,w){c=c||IC.yl;w=w||3;const a=Math.atan2(y2-y1,x2-x1),h=9,p1=[x2-h*Math.cos(a-.5),y2-h*Math.sin(a-.5)],p2=[x2-h*Math.cos(a+.5),y2-h*Math.sin(a+.5)];
 return iL(x1,y1,x2-4*Math.cos(a),y2-4*Math.sin(a),c,w)+`<polygon points="${x2},${y2} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}" fill="${c}"/>`}
const iOK=(x,y,r)=>{r=r||10;return`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.gn}"/><path d="M${x-r*.45},${y} l${r*.32},${r*.38} l${r*.6},-${r*.75}" fill="none" stroke="#fff" stroke-width="${r*.27}" stroke-linecap="round" stroke-linejoin="round"/>`};
const iNO=(x,y,r)=>{r=r||10;return`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.rd}"/><path d="M${x-r*.38},${y-r*.38} l${r*.76},${r*.76} M${x+r*.38},${y-r*.38} l-${r*.76},${r*.76}" stroke="#fff" stroke-width="${r*.27}" stroke-linecap="round"/>`};
/* «απαγορεύεται»: κόκκινος κύκλος με διαγώνια πάνω από ό,τι βρίσκεται στο (x,y) με ακτίνα r */
const iBan=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${IC.rd}" stroke-width="${r/7}"/><line x1="${x-r*.7}" y1="${y-r*.7}" x2="${x+r*.7}" y2="${y+r*.7}" stroke="${IC.rd}" stroke-width="${r/7}"/>`;
/* αριθμός βήματος σε πορτοκαλί κύκλο */
const iNum=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="10" fill="${IC.or}"/>`+iT(x,y+4.5,n,{c:'#000',b:1,s:13});
const iGround=(y,c)=>`<rect x="0" y="${y}" width="320" height="${180-y}" fill="${c||IC.gd}"/>`;
const iFloor=(y)=>iL(0,y,320,y,IC.gr,3);
/* ΑΝΘΡΩΠΟΣ σε οποιαδήποτε στάση. Δίνεις σημεία: h=κεφάλι, n=λαιμός/ώμοι, p=λεκάνη, e1/a1=αγκώνας/χέρι, e2/a2, k1/f1=γόνατο/πόδι, k2/f2.
   Όλα [x,y]. Παραλείπεις ό,τι δεν φαίνεται. o={c:χρώμα,w:πάχος,r:ακτίνα κεφαλιού} */
function iP(j,o){o=o||{};const c=o.c||IC.ln,w=o.w||6,r=o.r||8,seg=(a,b)=>a&&b?`M${a[0]},${a[1]} L${b[0]},${b[1]} `:'';
 let d=seg(j.n,j.p)+seg(j.n,j.e1)+seg(j.e1,j.a1)+seg(j.n,j.e2)+seg(j.e2,j.a2)+seg(j.p,j.k1)+seg(j.k1,j.f1)+seg(j.p,j.k2)+seg(j.k2,j.f2);
 return`<path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`+(j.h?`<circle cx="${j.h[0]}" cy="${j.h[1]}" r="${r}" fill="${c}"/>`:'')}
/* όρθιος άνθρωπος, πόδια στο (x,y), ύψος ~60·s */
const iMan=(x,y,s,c)=>{s=s||1;const P=(a,b)=>[x+a*s,y+b*s];return iP({h:P(0,-54),n:P(0,-44),p:P(0,-22),e1:P(-8,-34),a1:P(-10,-24),e2:P(8,-34),a2:P(10,-24),k1:P(-4,-11),f1:P(-6,0),k2:P(4,-11),f2:P(6,0)},{c,w:5*s,r:7*s})};
/* παιδί */
const iKid=(x,y,s,c)=>iMan(x,y,(s||1)*.65,c);
function iCar(x,y,s,r,col,flip){s=s||1;col=col||IC.or;const w=(cx)=>`<circle cx="${cx}" cy="-12" r="12" fill="${IC.dk}" stroke="${IC.ln}" stroke-width="1.6"/><circle cx="${cx}" cy="-12" r="5" fill="${IC.gr}"/>`;
 return`<g transform="translate(${x},${y}) rotate(${r||0}) scale(${flip?-s:s},${s})"><path d="M-55,-18 L-55,-40 L-32,-41 L-22,-60 L22,-60 L34,-41 L56,-38 L58,-18 Z" fill="${col}" stroke="${IC.dk}" stroke-width="1.5"/><path d="M-18,-56 L-27,-42 L-3,-42 L-3,-56 Z M2,-56 L2,-42 L28,-42 L19,-56 Z" fill="#9cc3d6"/>${w(-34)}${w(36)}</g>`}
const iTree=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s||1})"><rect x="-4" y="-30" width="8" height="30" fill="${IC.wd}"/><circle cx="0" cy="-44" r="20" fill="${c||IC.gn}"/><circle cx="-12" cy="-34" r="12" fill="${c||IC.gn}"/><circle cx="12" cy="-34" r="12" fill="${c||IC.gn}"/></g>`;
const iFire=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M0,-22 C10,-12 10,-5 6,0 L-6,0 C-10,-5 -10,-12 0,-22 Z" fill="${IC.or}"/><path d="M0,-12 C5,-7 4,-2 2.5,0 L-2.5,0 C-4,-2 -5,-7 0,-12 Z" fill="${IC.yl}"/></g>`;
const iTent=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M-30,0 Q-5,-46 0,-46 Q5,-46 30,0 Z" fill="${c||IC.yl}" stroke="${IC.dk}" stroke-width="1.5"/><path d="M-7,0 L0,-25 L7,0 Z" fill="${IC.dk}"/></g>`;
/* σπίτι: (x,y)=κάτω αριστερά, w πλάτος, h ύψος τοίχου */
const iHouse=(x,y,w,h,c)=>`<rect x="${x}" y="${y-h}" width="${w}" height="${h}" fill="${c||IC.sk}" stroke="${IC.ln}" stroke-width="2"/><path d="M${x-8},${y-h} L${x+w/2},${y-h-w*.38} L${x+w+8},${y-h} Z" fill="${IC.rd}" stroke="${IC.ln}" stroke-width="2"/>`;
/* τραπέζι: (x,y)=πόδια στο πάτωμα αριστερά, w πλάτος, h ύψος */
const iTable=(x,y,w,h)=>`<rect x="${x-4}" y="${y-h}" width="${w+8}" height="7" rx="2" fill="${IC.wd}"/><rect x="${x}" y="${y-h+7}" width="6" height="${h-7}" fill="${IC.wd}"/><rect x="${x+w-6}" y="${y-h+7}" width="6" height="${h-7}" fill="${IC.wd}"/>`;
/* νερό: ορθογώνιο με κυματάκια στην επιφάνεια y, από x1 έως x2, μέχρι κάτω */
const iWater=(x1,x2,y,yb)=>{yb=yb||180;let d=`M${x1},${y}`;for(let x=x1;x<x2;x+=16)d+=` q4,-4 8,0 t8,0`;return`<path d="${d} L${x2},${yb} L${x1},${yb} Z" fill="${IC.wt}" opacity=".85"/>`};
/* σύννεφο καπνού/στάχτης */
const iSmoke=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s||1})" fill="${c||IC.sm}"><circle cx="0" cy="0" r="14"/><circle cx="16" cy="-6" r="16"/><circle cx="34" cy="0" r="13"/><rect x="0" y="0" width="34" height="13"/></g>`;
const iBox=(x,y,w,h,t,c,tc)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c||IC.sk}" stroke="${IC.ln}" stroke-width="1.2"/>`+(t?iT(x+w/2,y+h/2+4,t,{s:10,c:tc||IC.ln,b:1}):'');
/* κινητό τηλέφωνο με κείμενο στην οθόνη */
const iPhone=(x,y,s,t)=>`<g transform="translate(${x},${y}) scale(${s||1})"><rect x="-14" y="-26" width="28" height="52" rx="5" fill="${IC.dk}" stroke="${IC.ln}" stroke-width="2"/><rect x="-11" y="-20" width="22" height="38" fill="${IC.bl}"/>${t?iT(0,3,t,{s:9,b:1,c:'#fff'}):''}</g>`;
/* ρολόι (για «σημείωσε την ώρα») */
const iClock=(x,y,r)=>{r=r||12;return`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="2"/>`+iL(x,y,x,y-r*.65,IC.dk,2)+iL(x,y,x+r*.5,y,IC.dk,2)};
/* φορέας για καρέ: χωρίζει το 320×180 σε n καρέ με λεπτές γραμμές */
const iPanels=(n)=>{let h='';for(let i=1;i<n;i++)h+=iL(320*i/n,8,320*i/n,172,IC.sk,2);return h};
