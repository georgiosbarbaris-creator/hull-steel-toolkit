/* Επιβίωση 72+ – σχέδια για την κάρτα «Κυβερνοεπίθεση» (v34) – Created by George Barbaris */
const cy_atm=(x,y)=>`<rect x="${x-26}" y="${y-40}" width="52" height="80" rx="4" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="2"/><rect x="${x-18}" y="${y-32}" width="36" height="24" fill="${IC.dk}"/><rect x="${x-14}" y="${y+2}" width="28" height="4" fill="${IC.dk}"/>`+[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${x-14+c*10}" y="${y+12+r*8}" width="7" height="5" fill="${IC.sn}"/>`).join('')).join('');
const cy_card=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s||1})"><rect x="-22" y="-14" width="44" height="28" rx="4" fill="${IC.bl}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="-22" y="-8" width="44" height="6" fill="${IC.dk}"/><rect x="-16" y="3" width="10" height="7" rx="1" fill="${IC.yl}"/></g>`;
const cy_cash=(x,y)=>`<rect x="${x-24}" y="${y-12}" width="48" height="24" rx="2" fill="${IC.gn}" stroke="${IC.ln}" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${IC.sn}" stroke-width="2"/>`+iT(x,y+4,'€',{s:10,b:1,c:IC.sn});
const cy_stop=(x,y,r)=>{const p=[];for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;p.push((x+r*Math.cos(a)).toFixed(1)+','+(y+r*Math.sin(a)).toFixed(1))}return`<polygon points="${p.join(' ')}" fill="${IC.rd}" stroke="#fff" stroke-width="2"/>`};
const cy_lock=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M-10,-6 v-8 a10,10 0 0 1 20,0 v8" fill="none" stroke="${IC.ln}" stroke-width="4"/><rect x="-15" y="-6" width="30" height="24" rx="3" fill="${IC.yl}"/><circle cx="0" cy="5" r="3" fill="${IC.dk}"/></g>`;
const cy_plane=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M0,-20 L4,-6 L20,2 L20,6 L4,2 L3,14 L8,18 L8,21 L0,18 L-8,21 L-8,18 L-3,14 L-4,2 L-20,6 L-20,2 L-4,-6 Z" fill="${IC.sn}"/></g>`;
Object.assign(SIMG,{
cyber:[
{at:1,c:['Σημάδια μεγάλης επίθεσης: ATM και κάρτες δεν δουλεύουν, παντού «μόνο μετρητά», το κινητό χωρίς σήμα ή internet.','Signs of a big attack: ATMs and cards don\'t work, "cash only" everywhere, phone with no signal or internet.'],f:()=>{
 let h=iPanels(3);
 h+=cy_atm(53,86)+iNO(78,52,12)+iT(53,150,L2('ATM εκτός','ATM down'),{b:1,s:12,c:IC.yl});
 h+=cy_card(160,62,1.1)+iBan(160,62,30)+cy_cash(160,116)+iT(160,150,L2('ΜΟΝΟ μετρητά','CASH only'),{b:1,s:12,c:IC.yl});
 h+=iPhone(267,82,1.5,'✕')+iT(267,150,L2('χωρίς σήμα','no signal'),{b:1,s:12,c:IC.yl});
 [0,1,2,3].forEach(i=>h+=`<rect x="${292+i*5}" y="${48-i*5}" width="3" height="${6+i*5}" fill="${IC.gr}"/>`);
 return h}},
{at:3,c:['Με χάκαραν: 1) πάρε την τράπεζα, 2) λειτουργία πτήσης, 3) νέοι κωδικοί από άλλη, καθαρή συσκευή.','Hacked: 1) call your bank, 2) airplane mode, 3) new passwords from another, clean device.'],f:()=>{
 let h=iPanels(3);
 h+=iNum(20,24,'1')+cy_card(53,70,1.2)+iPhone(53,118,.8)+`<path d="M70,108 q6,6 0,12 M76,104 q10,10 0,20" stroke="${IC.yl}" stroke-width="2" fill="none"/>`+iT(53,164,L2('τράπεζα','bank'),{b:1,s:12,c:IC.yl});
 h+=iNum(127,24,'2')+cy_plane(160,84,1.6)+iT(160,164,L2('πτήση','airplane'),{b:1,s:12,c:IC.yl});
 h+=iNum(234,24,'3')+iPhone(250,92,1.3)+cy_lock(282,110,1)+iT(267,164,L2('νέοι κωδικοί','new passwords'),{b:1,s:12,c:IC.yl});
 return h}},
{at:4,c:['ΣΤΑΜΑΤΑ – ΣΚΕΨΟΥ – ΕΛΕΓΞΕ. Μην πατάς link σε SMS. Κλείσε και πάρε εσύ τον γνωστό αριθμό.','STOP – THINK – CHECK. Don\'t tap links in SMS. Hang up and call the number you know yourself.'],f:()=>{
 let h=iPanels(3);
 h+=`<rect x="22" y="40" width="64" height="40" rx="8" fill="${IC.sn}"/><path d="M34,80 l-6,10 l14,-10 Z" fill="${IC.sn}"/>`+iT(54,56,L2('Πρόστιμο!','Fine due!'),{s:10,b:1,c:IC.dk})+iT(54,72,'bit.ly/…',{s:10,c:IC.bl});
 h+=iBan(54,60,34)+iT(53,150,L2('ΟΧΙ link','NO links'),{b:1,s:12,c:IC.yl});
 h+=cy_stop(160,74,30)+iT(160,79,'STOP',{b:1,s:13,c:'#fff'})+iT(160,150,L2('ΣΚΕΨΟΥ','THINK'),{b:1,s:12,c:IC.yl});
 h+=iPhone(250,80,1.3)+iOK(286,56,13)+iT(267,138,L2('πάρε ΕΣΥ','YOU call'),{b:1,s:12,c:IC.yl})+iT(267,156,L2('τον γνωστό αριθμό','the known number'),{s:10,c:IC.gr});
 return h}}
],
});
