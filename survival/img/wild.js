/* Επιβίωση 72+ – σχέδια κατηγορίας «wild» (5_wild.txt) – Created by George Barbaris */
/* τοπικά βοηθητικά */
const wild_drop=(x,y,s,c)=>`<path transform="translate(${x},${y}) scale(${s||1})" d="M0,-24 C8,-12 14,-4 14,4 A14,14 0 0 1 -14,4 C-14,-4 -8,-12 0,-24 Z" fill="${c||IC.bl}"/>`;
const wild_bread=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M-22,10 L-22,-4 C-22,-18 22,-18 22,-4 L22,10 Z" fill="${IC.yl}" stroke="${IC.wd}" stroke-width="2"/><path d="M-10,-10 l-4,8 M0,-11 l-4,8 M10,-10 l-4,8" stroke="${IC.wd}" stroke-width="2" stroke-linecap="round"/></g>`;
const wild_wind=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s||1})" fill="none" stroke="${c||'#9cc3d6'}" stroke-width="3" stroke-linecap="round"><path d="M-20,-10 H8 a6,6 0 1 0 -6,-6"/><path d="M-24,0 H14 a7,7 0 1 1 -7,7"/><path d="M-18,10 H0"/></g>`;
const wild_tree=(x,yb,h,r)=>`<rect x="${x-4}" y="${yb-h}" width="8" height="${h}" fill="${IC.wd}"/><circle cx="${x}" cy="${yb-h-r*.5}" r="${r}" fill="${IC.gn}"/>`;
const wild_pot=(x,y,w,h,lid)=>`<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" rx="3" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(x-w/2-6,y-h+6,x-w/2,y-h+6,IC.ln,3)+iL(x+w/2,y-h+6,x+w/2+6,y-h+6,IC.ln,3)+(lid?`<rect x="${x-w/2-3}" y="${y-h-5}" width="${w+6}" height="5" rx="2" fill="${IC.ln}"/><rect x="${x-4}" y="${y-h-9}" width="8" height="4" fill="${IC.ln}"/>`:'');
const wild_bottle=(x,y,s,c,t)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M-12,0 L-12,-38 Q-12,-46 -5,-48 L-5,-56 L5,-56 L5,-48 Q12,-46 12,-38 L12,0 Z" fill="${c||'#9cc3d6'}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="-6" y="-61" width="12" height="6" fill="${IC.ln}"/>${t?iT(0,-18,t,{s:9,b:1,c:IC.dk}):''}</g>`;
const wild_rock=(x,y,w,h,c)=>`<path d="M${x-w/2},${y} Q${x-w/2},${y-h*.7} ${x-w*.2},${y-h} Q${x+w*.2},${y-h*1.05} ${x+w/2},${y-h*.4} L${x+w/2},${y} Z" fill="${c||IC.gr}"/>`;
const wild_mush=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M-6,0 Q-8,-14 -5,-22 L5,-22 Q8,-14 6,0 Z" fill="${IC.sn}"/><path d="M-8,-12 Q0,-9 8,-12" stroke="${IC.gr}" stroke-width="2" fill="none"/><path d="M-24,-22 Q-24,-44 0,-44 Q24,-44 24,-22 Z" fill="${c||'#c9d6a3'}" stroke="${IC.dk}" stroke-width="1.2"/></g>`;
const wild_star=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c||IC.sn}"/>`;
/* σχοινί με περίγραμμα (για κόμπους) */
const wild_rope=(d,c)=>`<path d="${d}" fill="none" stroke="${IC.dk}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c||IC.yl}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;

Object.assign(SIMG,{
/* ===== Κανόνας των 3 ===== */
w_rule3:[{at:-1,c:['Η σειρά του κινδύνου: 3 λεπτά χωρίς αέρα, 3 ώρες χωρίς προστασία σε σκληρό καιρό, 3 μέρες χωρίς νερό, 3 εβδομάδες χωρίς φαγητό.','The order of danger: 3 minutes without air, 3 hours without shelter in harsh weather, 3 days without water, 3 weeks without food.'],f:()=>{
 let h=iPanels(4);
 const col=[[40,IC.rd,L2('ΛΕΠΤΑ','MINUTES'),L2('αέρας','air')],[120,IC.or,L2('ΩΡΕΣ','HOURS'),L2('καταφύγιο','shelter')],[200,IC.bl,L2('ΜΕΡΕΣ','DAYS'),L2('νερό','water')],[280,IC.gn,L2('ΕΒΔΟΜΑΔΕΣ','WEEKS'),L2('φαγητό','food')]];
 h+=wild_wind(44,66,1.2)+iTent(120,72,1)+wild_drop(200,58,1.4)+wild_bread(280,58,1.3);
 col.forEach(([x,c,u,t])=>{h+=iT(x,22,t,{s:12,c:IC.gr})+iT(x,132,'3',{s:40,b:1,c})+iT(x,156,u,{s:12,b:1,c})});
 return h}}],

/* ===== Μυαλό ===== */
w_mind:[{at:-1,c:['Ανάσα 4-4-4-4: εισπνοή 4, κράτα 4, εκπνοή 4, κράτα 4 – γύρω-γύρω σαν τετράγωνο. Τρεις φορές.','Box breathing: in 4, hold 4, out 4, hold 4 – around the square. Three times.'],f:()=>{
 const x1=110,x2=200,y1=45,y2=135;let h=`<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" fill="none" stroke="${IC.sk}" stroke-width="6" rx="4"/>`;
 h+=iA(x1,y2-8,x1,y1+10,IC.bl,4)+iA(x1+8,y1,x2-10,y1,IC.yl,4)+iA(x2,y1+8,x2,y2-10,IC.gn,4)+iA(x2-8,y2,x1+10,y2,IC.yl,4);
 h+=iT(x1-8,y1+(y2-y1)/2+5,L2('ΕΙΣΠΝΟΗ 4','IN 4'),{a:'end',b:1,s:13,c:IC.bl});
 h+=iT((x1+x2)/2,y1-10,L2('ΚΡΑΤΑ 4','HOLD 4'),{b:1,s:13,c:IC.yl});
 h+=iT(x2+8,y1+(y2-y1)/2+5,L2('ΕΚΠΝΟΗ 4','OUT 4'),{a:'start',b:1,s:13,c:IC.gn});
 h+=iT((x1+x2)/2,y2+22,L2('ΚΡΑΤΑ 4','HOLD 4'),{b:1,s:13,c:IC.yl});
 // ήρεμο πρόσωπο
 const cx=155,cy=90;h+=`<circle cx="${cx}" cy="${cy}" r="22" fill="${IC.sk2}"/><path d="M${cx-11},${cy-4} q4,4 8,0 M${cx+3},${cy-4} q4,4 8,0 M${cx-8},${cy+8} q8,7 16,0" stroke="${IC.dk}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
 h+=iT(290,165,'×3',{s:24,b:1,c:IC.or});
 return h}}],

/* ===== Καταφύγιο ===== */
w_shelter:[
{at:0,c:['Στήσε το καταφύγιο σε σημείο προστατευμένο από τον αέρα (π.χ. πίσω από βράχο). ΟΧΙ σε ρέμα ή κοίτη, ΟΧΙ κάτω από ξερά κλαδιά, ΟΧΙ σε κορυφή.','Put the shelter where it is sheltered from the wind (e.g. behind a rock). NOT in a stream or dry riverbed, NOT under dead branches, NOT on a summit.'],f:()=>{
 let h=iPanels(4);const g=140;
 // 1 πίσω από βράχο
 h+=iGround(g)+iPanels(4);
 h+=wild_rock(60,g,36,46)+iTent(30,g,.65)+wild_wind(64,72,.7)+iOK(40,26,11);
 // 2 κοίτη
 h+=`<path d="M82,${g} L98,${g} L112,${g+22} L128,${g+22} L142,${g} L158,${g} L158,180 L82,180 Z" fill="${IC.bg}"/>`+iWater(100,140,g+12,g+22)+iTent(120,g+22,.5)+iA(100,104,112,118,IC.bl,3)+iA(140,104,128,118,IC.bl,3)+iNO(120,26,11);
 // 3 ξερά κλαδιά
 h+=`<rect x="210" y="${g-80}" width="8" height="80" fill="${IC.wd}"/><path d="M214,${g-60} L248,${g-74} M232,${g-67} L238,${g-82} M214,${g-40} L182,${g-56} M196,${g-49} L188,${g-64}" stroke="${IC.wd}" stroke-width="4" stroke-linecap="round"/><path d="M236,${g-50} l2,10 M226,${g-46} l-2,10" stroke="${IC.yl}" stroke-width="2" stroke-dasharray="3 3"/>`+iTent(212,g,.6)+iNO(200,26,11);
 // 4 κορυφή
 h+=`<path d="M244,${g} L282,${g-62} L320,${g} Z" fill="${IC.sm}"/>`+iTent(282,g-62,.45)+wild_wind(300,56,.6)+iNO(280,26,11);
 return h}},
{at:1,c:['Σχοινί ανάμεσα σε 2 δέντρα, το νάιλον από πάνω σαν «Α». Πρώτα μόνωση από το έδαφος, 20–30 cm κλαδιά και φύλλα. Η κλειστή πλευρά προς τον αέρα, η είσοδος αντίθετα.','Rope between 2 trees, sheet over it like an “A”. First insulate from the ground with 20–30 cm of branches and leaves. Closed side to the wind, entrance facing away.'],f:()=>{
 let h=iGround(124);
 const A1=[110,78],L1=[72,150],R1=[148,150],dx=110,dy=-14,A2=[A1[0]+dx,A1[1]+dy],L2p=[L1[0]+dx,L1[1]+dy],R2=[R1[0]+dx,R1[1]+dy];
 const P=a=>a.map(p=>p.join(',')).join(' ');
 const ry=x=>A1[1]+(x-A1[0])*dy/dx;
 h+=wild_tree(300,138,96,22);
 // πίσω κλειστή πλευρά, εσωτερικό, μόνωση
 h+=`<polygon points="${P([A2,L2p,R2])}" fill="#a85a00"/>`;
 h+=`<polygon points="${P([A1,A2,L2p,L1])}" fill="#7a4300"/>`;
 h+=`<polygon points="${P([[L1[0]+6,L1[1]-2],[R1[0]-6,R1[1]-2],[R2[0]-6,R2[1]-2],[L2p[0]+6,L2p[1]-2]])}" fill="#4f7a3a"/>`;
 h+=`<rect x="${L1[0]+6}" y="${L1[1]-12}" width="${R1[0]-L1[0]-12}" height="12" fill="#5d8a45" stroke="${IC.wd}" stroke-width="2"/>`;
 for(let x=L1[0]+10;x<R1[0]-8;x+=9)h+=iL(x,L1[1]-10,x+5,L1[1]-3,IC.wd,1.6);
 // δεξιά πλευρά (μπροστινή)
 h+=`<polygon points="${P([A1,A2,R2,R1])}" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 // σχοινί
 h+=iL(34,ry(34),300,ry(300),IC.ln,2.5)+wild_tree(34,156,70,20).replace(/^/,'');
 h+=iL(34,ry(34),A1[0],A1[1],IC.ln,2.5);
 // αέρας στην κλειστή πλευρά
 h+=iA(316,60,272,78,'#9cc3d6',3)+iA(316,84,276,98,'#9cc3d6',3)+iT(234,42,L2('ΑΕΡΑΣ','WIND'),{b:1,s:12,c:'#9cc3d6'});
 // ετικέτες
 h+=iA(66,160,84,151,IC.yl,2.5)+iT(40,174,L2('ΕΙΣΟΔΟΣ','ENTRANCE'),{b:1,s:10,c:IC.yl});
 h+=iA(146,164,126,150,IC.yl,2.5)+iT(150,174,L2('ΜΟΝΩΣΗ 20–30 cm','INSULATION 20–30 cm'),{b:1,s:10,c:IC.yl,a:'start'});
 h+=iT(180,24,L2('ΣΧΟΙΝΙ','ROPE'),{s:10,c:IC.ln})+iL(180,28,180,ry(180)-3,IC.ln,1);
 return h}}],

/* ===== Νερό: πού το βρίσκω ===== */
w_water:[
{at:3,c:['Βροχή: άπλωσε νάιλον ή tarp με κλίση προς ένα δοχείο. Άσε τα πρώτα λεπτά να ξεπλύνουν τη σκόνη.','Rain: spread a plastic sheet or tarp sloping down into a container. Let the first minutes wash off the dust.'],f:()=>{
 const g=160;let h=iFloor(g);
 h+=iSmoke(40,26,1.1,IC.sm)+iSmoke(150,20,1.2,IC.sm);
 for(let i=0;i<14;i++){const x=24+i*15,y=52+(i%3)*8;h+=iL(x,y,x-4,y+12,'#9cc3d6',2)}
 // tarp με κλίση
 h+=iL(40,88,40,g,IC.wd,4)+iL(210,116,210,g,IC.wd,4);
 h+=`<polygon points="34,84 228,114 216,122 30,92" fill="${IC.bl}" stroke="${IC.ln}" stroke-width="1.5"/>`;
 h+=iA(80,80,170,95,IC.yl,2.5);
 // στάλες στο δοχείο
 h+=wild_drop(226,128,.28,'#9cc3d6');
 h+=`<path d="M218,${g-24} L258,${g-24} L254,${g} L222,${g} Z" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="221" y="${g-14}" width="34" height="12" fill="${IC.wt}"/>`;
 h+=iOK(288,140,12);
 return h}},
{at:5,c:['Λάκκος 60 cm πλάτος και 50 cm βάθος, δοχείο στη μέση, πράσινα φύλλα γύρω. Νάιλον από πάνω, χώμα στις άκρες, πέτρα στο κέντρο. Οι σταγόνες στάζουν καθαρές στο δοχείο.','A pit 60 cm wide and 50 cm deep, a container in the middle, green leaves around it. Clear plastic on top, soil on the edges, a stone in the centre. Drops run down and fall clean into the container.'],f:()=>{
 const g=70;let h=`<rect x="0" y="${g}" width="320" height="${180-g}" fill="${IC.gd}"/>`;
 h+=`<circle cx="34" cy="28" r="14" fill="${IC.yl}"/>`;for(let a=0;a<8;a++){const r=a*Math.PI/4;h+=iL(34+19*Math.cos(r),28+19*Math.sin(r),34+25*Math.cos(r),28+25*Math.sin(r),IC.yl,2)}
 // λάκκος
 h+=`<path d="M80,${g} Q84,160 160,162 Q236,160 240,${g} Z" fill="#241c14"/>`;
 // φύλλα
 [[100,140],[112,152],[208,140],[220,150],[96,120],[226,118]].forEach(([x,y])=>{h+=`<ellipse cx="${x}" cy="${y}" rx="10" ry="5" fill="${IC.gn}" transform="rotate(${x<160?-25:25} ${x} ${y})"/>`});
 // δοχείο
 h+=`<path d="M144,132 L176,132 L173,160 L147,160 Z" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="147" y="148" width="26" height="11" fill="${IC.wt}"/>`;
 // νάιλον
 h+=`<path d="M66,${g} L160,112 L254,${g}" fill="none" stroke="#cfe6f5" stroke-width="3"/>`;
 h+=`<path d="M60,${g} q12,-12 24,0 Z M236,${g} q12,-12 24,0 Z" fill="${IC.gd}" stroke="${IC.wd}" stroke-width="1.5"/>`;
 h+=wild_rock(160,108,16,10,IC.sn);
 [[110,94],[132,104],[190,102],[212,92]].forEach(([x,y])=>{h+=wild_drop(x,y+6,.22,'#9cc3d6')});
 h+=wild_drop(160,124,.3,'#9cc3d6');
 h+=iA(100,86,140,106,'#9cc3d6',2)+iA(220,86,180,106,'#9cc3d6',2);
 h+=iL(80,176,240,176,IC.yl,1.5)+iT(160,174,'60 cm',{s:10,b:1,c:IC.yl});
 h+=iL(262,g+4,262,160,IC.yl,1.5)+iT(266,120,'50 cm',{s:10,b:1,c:IC.yl,a:'start'});
 return h}}],

/* ===== Καθαρισμός νερού ===== */
w_water2:[
{at:1,c:['1 Θολό νερό; πέρασέ το από πανί. 2 Δυνατός βρασμός για 1 λεπτό (πάνω από 2000 m: 3 λεπτά). 3 Άφησέ το να κρυώσει σκεπασμένο.','1 Cloudy water? Pass it through a cloth. 2 Rolling boil for 1 minute (above 2000 m: 3 minutes). 3 Let it cool covered.'],f:()=>{
 let h=iPanels(3);const g=160;
 h+=iNum(16,20,'1')+iT(62,25,L2('ΠΑΝΙ','CLOTH'),{b:1,s:12,c:IC.yl});
 h+=iNum(123,20,'2')+iT(172,25,L2('1 ΛΕΠΤΟ','1 MINUTE'),{b:1,s:12,c:IC.yl});
 h+=iNum(229,20,'3')+iT(276,25,L2('ΣΚΕΠΑΣΕ','COVER'),{b:1,s:12,c:IC.yl});
 // 1: κανάτα -> πανί -> κατσαρόλα
 h+=`<path d="M22,56 L50,56 L48,86 L24,86 Z" fill="#8a7a5a" stroke="${IC.ln}" stroke-width="1.5" transform="rotate(35 36 70)"/>`;
 h+=`<path d="M48,82 q4,10 6,14" stroke="#8a7a5a" stroke-width="4" fill="none"/>`;
 h+=`<path d="M34,100 Q53,124 72,100" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1.5"/>`;
 h+=iL(53,118,53,128,'#9cc3d6',3)+wild_pot(53,g,48,28)+`<rect x="31" y="${g-16}" width="44" height="14" fill="${IC.wt}"/>`;
 // 2: βρασμός
 h+=wild_pot(160,g-18,54,36)+`<rect x="135" y="${g-48}" width="50" height="28" fill="${IC.wt}"/>`;
 [[146,112],[160,106],[173,113],[153,100],[167,96]].forEach(([x,y])=>{h+=`<circle cx="${x}" cy="${y+10}" r="4" fill="none" stroke="${IC.sn}" stroke-width="1.5"/>`});
 h+=`<path d="M150,90 q-6,-8 0,-16 M160,88 q-6,-8 0,-16 M170,90 q-6,-8 0,-16" stroke="${IC.gr}" stroke-width="2" fill="none"/>`;
 h+=iFire(148,g,.8)+iFire(172,g,.8)+iFire(160,g+2,.9);
 h+=iClock(196,56,11);
 // 3: σκεπασμένο, κρυώνει
 h+=wild_pot(268,g,54,36,1)+`<rect x="243" y="${g-30}" width="50" height="28" fill="${IC.wt}"/>`;
 h+=iOK(296,100,11);
 return h}},
{at:2,c:['Απλή χλωρίνη χωρίς άρωμα: 2 σταγόνες σε 1 λίτρο καθαρό νερό (θολό ή πολύ κρύο: 4). Ανακάτεψε και περίμενε 30 λεπτά.','Plain unscented bleach: 2 drops in 1 litre of clear water (cloudy or very cold: 4). Stir and wait 30 minutes.'],f:()=>{
 let h=iPanels(2);const g=162;
 h+=iNum(16,20,'1')+iT(90,25,L2('2 ΣΤΑΓΟΝΕΣ','2 DROPS'),{b:1,s:13,c:IC.yl});
 h+=iNum(176,20,'2')+iT(250,25,L2('30 ΛΕΠΤΑ','30 MIN'),{b:1,s:13,c:IC.yl});
 // μπουκαλάκι χλωρίνης γερμένο
 h+=`<g transform="rotate(120 70 70)">${wild_bottle(70,94,.75,IC.sn,'')}</g>`;
 h+=wild_drop(92,92,.28,IC.yl)+wild_drop(92,108,.28,IC.yl);
 h+=wild_bottle(96,g,1.05,'#9cc3d6','1 L');
 h+=iT(40,150,'×2',{s:20,b:1,c:IC.yl});
 // 2: ρολόι
 h+=`<circle cx="250" cy="98" r="40" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="3"/><path d="M250,98 L250,58 A40,40 0 0 1 250,138 Z" fill="${IC.yl}" opacity=".8"/>`+iL(250,98,250,64,IC.dk,3)+iL(250,98,250,132,IC.dk,3)+`<circle cx="250" cy="98" r="4" fill="${IC.dk}"/>`;
 h+=iT(250,160,L2('ανακάτεψε, περίμενε','stir, wait'),{s:11,c:IC.ln});
 return h}},
{at:6,c:['DIY φίλτρο: ανάποδο μπουκάλι, από κάτω προς τα πάνω πανί, κάρβουνο, λεπτή άμμος, χοντρή άμμος, χαλίκι. Μόνο ξεθολώνει – μετά ΠΑΝΤΑ βράσιμο ή χλωρίνη.','DIY filter: an upside-down bottle, from bottom to top: cloth, charcoal, fine sand, coarse sand, gravel. It only clears the water – then ALWAYS boil it or add bleach.'],f:()=>{
 let h='';const x=80,w=56,top=20;
 const lay=[[L2('χαλίκι','gravel'),'#9a8f80',20],[L2('χοντρή άμμος','coarse sand'),'#c9a86b',22],[L2('λεπτή άμμος','fine sand'),'#e6cf9a',22],[L2('κάρβουνο','charcoal'),'#2a2a2a',18]];
 let y=top+12;h+=`<rect x="${x-w/2}" y="${top}" width="${w}" height="12" fill="#3a7bd5" opacity=".7"/>`;
 lay.forEach(([t,c,hh])=>{h+=`<rect x="${x-w/2}" y="${y}" width="${w}" height="${hh}" fill="${c}"/>`+iL(x+w/2+4,y+hh/2,x+w/2+16,y+hh/2,IC.gr,1)+iT(x+w/2+19,y+hh/2+4,t,{s:10,a:'start'});y+=hh});
 // λαιμός με πανί
 h+=`<path d="M${x-w/2},${y} L${x-8},${y+16} L${x+8},${y+16} L${x+w/2},${y} Z" fill="${IC.sn}"/>`+iL(x+w/2+4,y+8,x+w/2+16,y+8,IC.gr,1)+iT(x+w/2+19,y+12,L2('πανί','cloth'),{s:10,a:'start'});
 h+=`<path d="M${x-w/2},${top} L${x-w/2},${y} L${x-8},${y+16} L${x-8},${y+22} L${x+8},${y+22} L${x+8},${y+16} L${x+w/2},${y} L${x+w/2},${top}" fill="none" stroke="${IC.ln}" stroke-width="2"/>`;
 h+=wild_drop(x,y+34,.3,'#9cc3d6');
 h+=`<path d="M${x-18},${y+40} L${x+18},${y+40} L${x+15},170 L${x-15},170 Z" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="1.5"/>`;
 // μετά βράσιμο
 h+=iA(196,120,226,120,IC.yl,3)+wild_pot(268,158,50,30)+iFire(256,172,.6)+iFire(280,172,.6)+`<circle cx="258" cy="140" r="3" fill="none" stroke="${IC.sn}"/><circle cx="270" cy="134" r="3" fill="none" stroke="${IC.sn}"/><circle cx="280" cy="142" r="3" fill="none" stroke="${IC.sn}"/>`;
 h+=iT(268,98,L2('ΜΕΤΑ','THEN'),{b:1,s:12,c:IC.yl})+iT(268,114,L2('ΒΡΑΣΕ','BOIL'),{b:1,s:12,c:IC.yl});
 return h}}],

/* ===== Φωτιά ===== */
w_fire:[
{at:0,c:['Μάζεψε ΠΡΙΝ ανάψεις: 1 προσάναμμα (μια χούφτα), 2 μικρά κλαδιά (πολλά – δύο αγκαλιές), 3 ξύλα για όλη τη νύχτα, και φέρε τα διπλά.','Gather BEFORE you light: 1 tinder (a handful), 2 kindling (lots – two armfuls), 3 fuel wood for the whole night, and bring double.'],f:()=>{
 let h=iPanels(3);const g=128;
 h+=iNum(16,20,'1')+iNum(123,20,'2')+iNum(229,20,'3');
 // προσάναμμα: χνούδι
 h+=`<g fill="#d9c79a">`+[[46,g-10,12],[60,g-16,14],[74,g-10,12],[60,g-6,12]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')+`</g>`;
 for(let i=0;i<10;i++){const a=i*0.63;h+=iL(60+10*Math.cos(a),g-12+7*Math.sin(a),60+20*Math.cos(a),g-12+12*Math.sin(a),'#bfa977',1.2)}
 // μικρά κλαδιά: δέμα
 for(let i=0;i<9;i++){const yy=g-6-i*4;h+=iL(130+(i%2)*4,yy,190-(i%3)*3,yy-2,'#a77b52',2.5)}
 h+=iL(150,g-42,150,g-2,IC.ln,2)+iL(172,g-42,172,g-2,IC.ln,2);
 // ξύλα: σωρός κορμών
 [[248,g-10],[274,g-10],[300,g-10],[261,g-30],[287,g-30],[274,g-50]].forEach(([x,y])=>{h+=`<circle cx="${x}" cy="${y}" r="11" fill="${IC.wd}" stroke="#5c3d26" stroke-width="2"/><circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#c9a074" stroke-width="1.5"/>`});
 h+=iT(60,g+22,L2('ΠΡΟΣΑΝΑΜΜΑ','TINDER'),{b:1,s:11,c:IC.yl})+iT(60,g+38,L2('1 χούφτα','1 handful'),{s:11});
 h+=iT(160,g+22,L2('ΜΙΚΡΑ ΚΛΑΔΙΑ','KINDLING'),{b:1,s:11,c:IC.yl})+iT(160,g+38,L2('2 αγκαλιές','2 armfuls'),{s:11});
 h+=iT(274,g+22,L2('ΞΥΛΑ','FUEL WOOD'),{b:1,s:12,c:IC.yl})+iT(274,g+38,L2('όλη νύχτα ×2','all night ×2'),{s:11});
 return h}},
{at:3,c:['Στήσιμο «σκηνή» (tipi): προσάναμμα στη μέση, μικρά κλαδιά γύρω, με «πόρτα» από την πλευρά του αέρα. Άναψε από εκεί και φύσα απαλά στη βάση. Καθαρό κύκλο 3 m γύρω.','Tipi lay: tinder in the middle, kindling around it, with a “door” on the wind side. Light it from there and blow gently at the base. A clear circle of 3 m around.'],f:()=>{
 const g=140;let h='';
 h+=`<ellipse cx="160" cy="${g}" rx="150" ry="28" fill="none" stroke="${IC.gr}" stroke-width="1.5" stroke-dasharray="5 4"/>`+iT(286,g+24,'3 m',{s:11,b:1,c:IC.gr});
 // πέτρες πίσω
 for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8;h+=`<ellipse cx="${160+64*Math.cos(a)}" cy="${g+2+14*Math.sin(a)}" rx="11" ry="7" fill="${IC.gr}" stroke="${IC.dk}"/>`}
 // κλαδιά tipi (δεξιά και πίσω)
 const ap=[160,52];
 [[150,g+8],[166,g+9],[180,g+8],[194,g+5],[206,g],[196,g-6],[176,g-8],[146,g-6]].forEach(([x,y])=>{h+=iL(x,y,ap[0]+(x-160)*.08,ap[1],'#a77b52',4)});
 // προσάναμμα και φλόγα στη «πόρτα»
 h+=`<ellipse cx="160" cy="${g}" rx="14" ry="6" fill="#d9c79a"/>`+iFire(160,g-2,1.1);
 // πέτρες μπροστά
 for(let i=0;i<9;i++){const a=i*Math.PI/8;h+=`<ellipse cx="${160+64*Math.cos(a)}" cy="${g+2+14*Math.sin(a)}" rx="11" ry="7" fill="${IC.gr}" stroke="${IC.dk}"/>`}
 // αέρας από αριστερά προς την πόρτα
 h+=iA(16,96,70,112,'#9cc3d6',3)+iA(12,120,66,128,'#9cc3d6',3)+iT(40,82,L2('ΑΕΡΑΣ','WIND'),{b:1,s:12,c:'#9cc3d6'});
 h+=iA(84,160,136,140,IC.yl,2.5)+iT(60,174,L2('ΠΟΡΤΑ','DOOR'),{b:1,s:12,c:IC.yl});
 h+=iT(232,40,L2('ΜΙΚΡΑ ΚΛΑΔΙΑ','KINDLING'),{s:11,c:IC.ln})+iL(196,44,170,62,IC.ln,1);
 return h}},
{at:5,c:['ΠΟΤΕ φωτιά, μαγκάλι, κάρβουνα ή γκαζάκι μέσα σε σκηνή, αυτοκίνητο ή κλειστό δωμάτιο. Το μονοξείδιο του άνθρακα (CO) δεν μυρίζει και σκοτώνει στον ύπνο.','NEVER a fire, brazier, charcoal or gas stove inside a tent, car or closed room. Carbon monoxide (CO) has no smell and kills in your sleep.'],f:()=>{
 let h=iPanels(2);const g=150;
 h+=iFloor(g);
 h+=iTent(80,g,2.1)+`<rect x="62" y="${g-12}" width="36" height="12" fill="#555" stroke="${IC.ln}"/>`+iFire(80,g-12,.9)+iSmoke(92,g-92,.6,IC.sm)+iT(103,g-86,'CO',{b:1,s:12,c:IC.ln});
 h+=iBan(80,g-46,58);
 h+=iCar(240,g,1.1)+`<rect x="226" y="${g-46}" width="22" height="10" fill="#555"/>`+iFire(237,g-46,.6)+iSmoke(250,g-84,.5,IC.sm)+iT(258,g-78,'CO',{b:1,s:11,c:IC.ln});
 h+=iBan(240,g-38,58);
 return h}}],

/* ===== Τρόποι φωτιάς ===== */
w_fire2:[
{at:2,c:['Ράβδος πυρίτη: η άκρη της ράβδου ΜΕΣΑ στο προσάναμμα, το ξέστρο ακίνητο, και ΤΡΑΒΑΣ τη ράβδο προς τα πίσω. Οι σπίθες πέφτουν στο προσάναμμα.','Ferro rod: rod tip IN the tinder, scraper held still, and you PULL the rod back. The sparks fall onto the tinder.'],f:()=>{
 const g=150;let h=iFloor(g);
 // προσάναμμα
 h+=`<g fill="#d9c79a"><circle cx="110" cy="${g-10}" r="14"/><circle cx="128" cy="${g-14}" r="16"/><circle cx="146" cy="${g-9}" r="13"/><rect x="100" y="${g-10}" width="56" height="10"/></g>`;
 // ράβδος από το προσάναμμα προς τα πάνω-δεξιά
 const a=[130,g-14],b=[236,g-82];
 h+=iL(a[0],a[1],b[0],b[1],'#4a4f57',9)+iL(b[0],b[1],b[0]+22,b[1]-14,IC.or,14);
 // ξέστρο ακίνητο
 const s=[180,g-36];
 h+=`<rect x="${s[0]-26}" y="${s[1]-26}" width="34" height="9" rx="2" fill="${IC.sn}" stroke="${IC.dk}" transform="rotate(-57 ${s[0]} ${s[1]})"/>`;
 h+=`<rect x="${s[0]-46}" y="${s[1]-34}" width="22" height="14" rx="4" fill="${IC.wd}" transform="rotate(-57 ${s[0]} ${s[1]})"/>`;
 // σπίθες
 [[150,g-32],[142,g-26],[156,g-22],[138,g-36],[160,g-30]].forEach(([x,y],i)=>{h+=iL(x,y,x-4-i,y+6,IC.yl,2)});
 h+=`<circle cx="${s[0]-4}" cy="${s[1]+2}" r="5" fill="${IC.yl}"/>`;
 // βέλος τράβα
 h+=iA(210,52,262,20,IC.yl,4)+iT(282,48,L2('ΤΡΑΒΑ','PULL'),{b:1,s:14,c:IC.yl});
 h+=iT(70,70,L2('ΑΚΙΝΗΤΟ','STILL'),{b:1,s:13,c:IC.sn})+iA(96,74,138,96,IC.sn,2);
 return h}},
{at:4,c:['Φακός και ήλιος: κράτα τον φακό ώστε η φωτεινή κουκκίδα να γίνει όσο πιο μικρή γίνεται, και ακίνητη, πάνω σε σκούρο ξερό προσάναμμα.','Lens and sun: hold the lens so the bright dot is as SMALL as possible, and still, on dark dry tinder.'],f:()=>{
 const g=150;let h=iFloor(g);
 h+=`<circle cx="40" cy="34" r="18" fill="${IC.yl}"/>`;for(let i=0;i<8;i++){const r=i*Math.PI/4;h+=iL(40+23*Math.cos(r),34+23*Math.sin(r),40+30*Math.cos(r),34+30*Math.sin(r),IC.yl,2)}
 // ακτίνες προς τον φακό
 h+=`<polygon points="120,40 196,40 160,${g-12}" fill="${IC.yl}" opacity=".18"/>`;
 [[120,40],[140,40],[176,40],[196,40]].forEach(([x,y])=>{h+=iL(x-34,y-26,x,y+28,IC.yl,1.5)+iL(x,y+28,160,g-12,IC.yl,1.5)});
 h+=`<ellipse cx="158" cy="68" rx="44" ry="7" fill="#cfe6f5" opacity=".9" stroke="${IC.ln}" stroke-width="2"/>`+iL(202,68,232,60,IC.wd,6);
 // προσάναμμα και καπνός
 h+=`<ellipse cx="160" cy="${g-6}" rx="34" ry="8" fill="#3b2d22"/><circle cx="160" cy="${g-12}" r="3" fill="${IC.rd}"/><circle cx="160" cy="${g-12}" r="6" fill="none" stroke="${IC.yl}"/>`;
 h+=`<path d="M164,${g-18} q8,-8 0,-16 q-8,-8 2,-16" stroke="${IC.gr}" stroke-width="2" fill="none"/>`;
 h+=iT(262,116,L2('ΜΙΚΡΗ','SMALL'),{b:1,s:13,c:IC.yl})+iT(262,132,L2('ΚΟΥΚΚΙΔΑ','DOT'),{b:1,s:13,c:IC.yl})+iA(226,128,172,g-14,IC.yl,2);
 return h}}],

/* ===== Ύπνος στο αυτοκίνητο ===== */
w_car:[
{at:-1,c:['ΠΟΤΕ ύπνος με τη μηχανή αναμμένη. Το μονοξείδιο (CO) μπαίνει στην καμπίνα, ειδικά αν το χιόνι κλείσει την εξάτμιση. Δεν μυρίζει και δεν ξυπνάς.','NEVER sleep with the engine running. Carbon monoxide (CO) gets into the cabin, especially if snow blocks the exhaust. It has no smell and you do not wake up.'],f:()=>{
 const g=150;let h=`<rect x="0" y="${g-8}" width="320" height="${180-g+8}" fill="${IC.sn}" opacity=".9"/>`;
 h+=iCar(196,g,1.15,0,IC.or);
 // χιόνι στην εξάτμιση (πίσω αριστερά)
 h+=`<path d="M110,${g-2} q12,-20 28,-6 q6,-5 12,4 Z" fill="${IC.sn}"/>`;
 h+=iSmoke(80,g-26,.8,IC.sm)+iSmoke(70,g-62,.55,IC.sm)+iT(94,g-20,'CO',{b:1,s:14,c:IC.ln})+`<path d="M96,${g-62} Q130,${g-108} 176,${g-80}" fill="none" stroke="${IC.gr}" stroke-width="3" stroke-dasharray="5 4"/>`;
 // ζζζ
 h+=iT(200,g-50,'z',{s:11,b:1,c:IC.dk})+iT(208,g-55,'z',{s:13,b:1,c:IC.dk});
 // κλειδί μηχανής ΟΝ
 h+=iT(282,32,L2('ΜΗΧΑΝΗ','ENGINE'),{b:1,s:12,c:IC.yl})+iT(282,48,'ON',{b:1,s:14,c:IC.rd});
 h+=iBan(196,g-44,64);
 return h}},
{at:1,c:['Μόνωσε τα ΤΖΑΜΙΑ: εκεί χάνεται η περισσότερη ζέστη. Πάνελ από reflectix ή αφρώδες υπόστρωμα, κομμένα στο σχήμα κάθε παραθύρου, σφηνώνουν χωρίς κόλλα.','Insulate the WINDOWS: that is where most heat escapes. Panels of reflectix or foam underlay, cut to the shape of each window, press-fit with no glue.'],f:()=>{
 const g=164;let h=iFloor(g);
 const s=2.1,x=160;
 h+=iCar(x,g,s,0,IC.or);
 // πάνελ πάνω στα τζάμια
 h+=`<g transform="translate(${x},${g}) scale(${s})"><path d="M-18,-56 L-27,-42 L-3,-42 L-3,-56 Z M2,-56 L2,-42 L28,-42 L19,-56 Z" fill="#c9d3dc" stroke="#7f8c99" stroke-width=".8"/>`;
  h+=`</g>`;
 // ένα πάνελ έξω, σαν να μπαίνει
 h+=`<path d="M246,28 L270,28 L286,54 L246,54 Z" fill="#c9d3dc" stroke="#7f8c99" stroke-width="1.5"/>`+iA(262,60,214,58,IC.yl,2.5);
 h+=iT(64,30,L2('ΜΟΝΩΣΗ','INSULATE'),{b:1,s:13,c:IC.yl})+iT(64,46,L2('ΤΖΑΜΙΩΝ','WINDOWS'),{b:1,s:13,c:IC.yl});
 return h}},
{at:2,c:['Άφησε 1–2 παράθυρα ανοιχτά 1–2 cm. Χωρίς αερισμό η ανάσα σου γίνεται νερό και πάγος στα τζάμια και στον υπνόσακο.','Leave 1–2 windows open 1–2 cm. Without ventilation your breath turns to water and ice on the windows and sleeping bag.'],f:()=>{
 let h='';
 // πόρτα αυτοκινήτου από κοντά
 h+=`<path d="M40,170 L40,92 L84,30 L260,30 L280,92 L280,170 Z" fill="${IC.or}" stroke="${IC.dk}" stroke-width="2"/>`;
 h+=`<path d="M64,92 L96,44 L248,44 L262,92 Z" fill="${IC.dk}"/>`;
 // τζάμι κατεβασμένο λίγο: κενό στην κορυφή
 h+=`<path d="M70,92 L96,56 L248,56 L258,92 Z" fill="#9cc3d6"/>`;
 h+=iL(98,50,246,50,IC.yl,1.5);
 h+=iT(172,23,'1–2 cm',{b:1,s:13,c:IC.yl})+iL(172,26,172,48,IC.yl,1);
 // αέρας μέσα-έξω
 h+=iA(300,40,214,50,'#9cc3d6',2.5)+iA(130,50,30,40,IC.gr,2.5);
 h+=iL(150,120,200,120,IC.dk,4)+iOK(240,136,14);
 return h}}],

/* ===== Σήματα ===== */
w_signal:[
{at:-1,c:['ΤΡΙΑ από οτιδήποτε = SOS, π.χ. 3 φωτιές σε τρίγωνο. Με καθρέφτη ή CD στείλε λάμψεις προς αεροπλάνο – σημάδεψε με τα δάχτυλα σε σχήμα V.','THREE of anything = SOS, e.g. 3 fires in a triangle. With a mirror or CD, flash toward an aircraft – aim with your fingers in a V shape.'],f:()=>{
 const g=150;let h=iGround(130)+iPanels(2);
 // 3 φωτιές τρίγωνο
 h+=`<polygon points="80,104 36,156 124,156" fill="none" stroke="${IC.yl}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
 h+=iFire(80,108,1.2)+iFire(36,160,1.2)+iFire(124,160,1.2);
 h+=iT(80,30,'3 = SOS',{b:1,s:16,c:IC.yl});
 // καθρέφτης προς αεροπλάνο
 const pl=`<g transform="translate(262,34)" fill="${IC.ln}"><rect x="-22" y="-3" width="44" height="6" rx="3"/><path d="M-4,-2 L-14,-16 L-8,-16 L6,-2 Z M-4,2 L-14,16 L-8,16 L6,2 Z M16,-2 L22,-10 L25,-10 L22,0 Z"/></g>`;
 h+=pl;
 const man=[200,g];
 h+=iP({h:[200,g-54],n:[200,g-44],p:[200,g-22],e1:[212,g-46],a1:[222,g-56],e2:[210,g-40],a2:[219,g-50],k1:[196,g-11],f1:[192,g],k2:[204,g-11],f2:[208,g]});
 h+=`<rect x="219" y="${g-62}" width="10" height="7" fill="#cfe6f5" stroke="${IC.ln}" transform="rotate(-30 224 ${g-58})"/>`;
 h+=`<polygon points="226,${g-62} 246,34 256,40" fill="${IC.yl}" opacity=".5"/>`+iL(226,g-62,250,37,IC.yl,2);
 [[250,28],[244,44],[258,48]].forEach(([x,y])=>{h+=iL(x-6,y,x+6,y,IC.yl,2)});
 return h}},
{at:0,c:['Σήματα στο έδαφος προς αεροσκάφος, μεγάλα (3 m+), με πέτρες, κλαδιά ή πανιά: V βοήθεια, X ιατρική βοήθεια, Y ναι, N όχι, βέλος = πάω προς τα εκεί.','Ground-to-air signals, large (3 m+), with stones, branches or cloth: V help, X medical help, Y yes, N no, arrow = I am going this way.'],f:()=>{
 let h=iGround(46);const c=IC.yl,w=8,y1=70,y2=122;
 const cols=[32,96,160,224,288];
 h+=iL(cols[0]-16,y1,cols[0],y2,c,w)+iL(cols[0],y2,cols[0]+16,y1,c,w);
 h+=iL(cols[1]-16,y1,cols[1]+16,y2,c,w)+iL(cols[1]+16,y1,cols[1]-16,y2,c,w);
 h+=iL(cols[2]-16,y1,cols[2],y1+24,c,w)+iL(cols[2]+16,y1,cols[2],y1+24,c,w)+iL(cols[2],y1+24,cols[2],y2,c,w);
 h+=iL(cols[3]-14,y2,cols[3]-14,y1,c,w)+iL(cols[3]-14,y1,cols[3]+14,y2,c,w)+iL(cols[3]+14,y2,cols[3]+14,y1,c,w);
 h+=iL(cols[4]-20,96,cols[4]+16,96,c,w)+`<polygon points="${cols[4]+26},96 ${cols[4]+8},80 ${cols[4]+8},112" fill="${c}"/>`;
 const lab=[L2('ΒΟΗΘΕΙΑ','HELP'),L2('ΓΙΑΤΡΟΣ','MEDICAL'),L2('ΝΑΙ','YES'),L2('ΟΧΙ','NO'),L2('ΠΑΩ ΕΚΕΙ','GOING')];
 cols.forEach((x,i)=>{h+=iT(x,148,lab[i],{b:1,s:11,c:IC.ln})});
 h+=`<g transform="translate(160,22)" fill="${IC.ln}"><rect x="-20" y="-3" width="40" height="6" rx="3"/><path d="M-4,-2 L-12,-14 L-6,-14 L6,-2 Z M-4,2 L-12,14 L-6,14 L6,2 Z M14,-2 L20,-9 L23,-9 L20,0 Z"/></g>`;
 h+=iT(286,170,'3 m+',{b:1,s:11,c:IC.gr});
 return h}},
{at:1,c:['Και τα δύο χέρια ψηλά σε V = «Χρειάζομαι βοήθεια». Ένα χέρι πάνω, ένα κάτω = «Δεν χρειάζομαι βοήθεια».','Both arms up in a V = “I need help”. One arm up, one down = “I do not need help”.'],f:()=>{
 const g=140;let h=iPanels(2)+iFloor(g);
 h+=iP({h:[80,g-58],n:[80,g-44],p:[80,g-22],e1:[68,g-56],a1:[58,g-68],e2:[92,g-56],a2:[102,g-68],k1:[76,g-11],f1:[72,g],k2:[84,g-11],f2:[88,g]});
 h+=iP({h:[240,g-58],n:[240,g-44],p:[240,g-22],e1:[252,g-56],a1:[262,g-68],e2:[234,g-33],a2:[230,g-22],k1:[236,g-11],f1:[232,g],k2:[244,g-11],f2:[248,g]});
 h+=iT(80,g+20,L2('ΘΕΛΩ ΒΟΗΘΕΙΑ','NEED HELP'),{b:1,s:12,c:IC.yl})+iT(240,g+20,L2('ΟΧΙ ΒΟΗΘΕΙΑ','NO HELP NEEDED'),{b:1,s:12,c:IC.ln});
 h+=iT(80,22,'V',{b:1,s:18,c:IC.yl});
 return h}}],

/* ===== Προσανατολισμός ===== */
w_navi:[
{at:1,c:['Ραβδί στο έδαφος. Πέτρα 1 στην άκρη της σκιάς, μετά από 15–20 λεπτά πέτρα 2 στη νέα άκρη. Η γραμμή 1→2 δείχνει ΔΥΣΗ→ΑΝΑΤΟΛΗ. Με την 1 αριστερά και τη 2 δεξιά κοιτάς ΒΟΡΡΑ.','Stick in the ground. Pebble 1 at the tip of the shadow, after 15–20 minutes pebble 2 at the new tip. The line 1→2 points WEST→EAST. With 1 on your left and 2 on your right you face NORTH.'],f:()=>{
 let h=`<rect x="0" y="40" width="320" height="140" fill="${IC.gd}"/>`;
 const b=[160,160],s1=[96,106],s2=[214,106];
 h+=iL(b[0],b[1],s1[0],s1[1],'#0d0a07',6)+iL(b[0],b[1],s2[0],s2[1],'#0d0a07',6)+iT(108,146,L2('σκιά','shadow'),{s:10,c:IC.gr});
 h+=iL(s1[0],s1[1],s2[0],s2[1],IC.yl,3,1);
 h+=iL(b[0],b[1],b[0],b[1]-22,IC.wd,5)+`<circle cx="${b[0]}" cy="${b[1]}" r="3" fill="${IC.wd}"/>`;
 h+=`<ellipse cx="${s1[0]}" cy="${s1[1]}" rx="8" ry="5" fill="${IC.sn}"/><ellipse cx="${s2[0]}" cy="${s2[1]}" rx="8" ry="5" fill="${IC.sn}"/>`;
 h+=iT(s1[0],s1[1]+22,'1',{b:1,s:14})+iT(s2[0],s2[1]+22,'2',{b:1,s:14})+iT(s2[0]+34,s2[1]+30,'15–20′',{s:11,c:IC.gr});
 h+=iT(s1[0]-24,s1[1]+5,L2('Δ','W'),{b:1,s:18,c:IC.yl})+iT(s2[0]+26,s2[1]+5,L2('Α','E'),{b:1,s:18,c:IC.yl});
 h+=iA(155,104,155,52,IC.rd,4)+iT(155,32,L2('ΒΟΡΡΑΣ','NORTH'),{b:1,s:14,c:IC.rd});
  return h}},
{at:3,c:['Βρες τη Μεγάλη Άρκτο («κατσαρόλα»). Τα δύο αστέρια της άκρης δείχνουν τον Πολικό, περίπου 5 φορές την απόστασή τους. Ο Πολικός = ΒΟΡΡΑΣ.','Find the Big Dipper (the “saucepan”). The two stars at its end point to Polaris, about 5 times the distance between them. Polaris = NORTH.'],f:()=>{
 let h=`<rect x="0" y="0" width="320" height="160" fill="#0b1626"/>`+`<path d="M0,160 L40,150 L90,156 L150,146 L210,154 L270,148 L320,156 L320,180 L0,180 Z" fill="${IC.dk}"/>`;
 [[20,20],[60,40],[250,30],[290,70],[230,110],[270,130],[40,140],[140,30],[300,20],[210,60]].forEach(([x,y])=>{h+=wild_star(x,y,1.2,IC.gr)});
 const M=[110,140],D=[122,122],Me=[96,112],Ph=[84,132],Al=[74,98],Mi=[58,92],Ak=[38,98];
 const P=[182,32];
 h+=`<path d="M${D} L${Me} L${Al} L${Mi} L${Ak} M${Me} L${Ph} L${M} L${D}" stroke="${IC.gr}" stroke-width="1.2" fill="none"/>`;
 h+=iL(D[0],D[1],P[0]-4,P[1]+6,IC.yl,2,1);
 [M,D,Me,Ph,Al,Mi,Ak].forEach(p=>{h+=wild_star(p[0],p[1],3.2)});
 h+=wild_star(M[0],M[1],4,IC.yl)+wild_star(D[0],D[1],4,IC.yl);
 h+=`<circle cx="${P[0]}" cy="${P[1]}" r="9" fill="${IC.yl}" opacity=".25"/>`+wild_star(P[0],P[1],5,IC.yl);
 h+=iT(142,80,'×5',{b:1,s:14,c:IC.yl,a:'end'});
 h+=iT(P[0]+12,P[1]+5,L2('ΠΟΛΙΚΟΣ','POLARIS'),{b:1,s:12,c:IC.yl,a:'start'});
 h+=iT(66,70,L2('ΜΕΓΑΛΗ ΑΡΚΤΟΣ','BIG DIPPER'),{s:11,c:IC.ln});
 h+=iL(P[0],P[1]+12,P[0],140,IC.rd,1.5,1)+iA(P[0],120,P[0],146,IC.rd,3)+iT(P[0],172,L2('ΒΟΡΡΑΣ','NORTH'),{b:1,s:13,c:IC.rd});
 return h}}],

/* ===== Φαγητό ===== */
w_food:[{at:0,c:['Ψάρι καλά μαγειρεμένο και γνωστά φρούτα που ξέρεις 100% (π.χ. σύκα, βατόμουρα): ναι. ΠΟΤΕ άγνωστα φυτά, μούρα ή μανιτάρια.','Well-cooked fish and known fruit you are 100% sure of (e.g. figs, blackberries): yes. NEVER unknown plants, berries or mushrooms.'],f:()=>{
 let h=iPanels(4);
 // ψάρι
 h+=`<path d="M14,90 Q38,66 62,90 Q38,114 14,90 Z" fill="${IC.gr}"/><path d="M60,90 L74,78 L74,102 Z" fill="${IC.gr}"/><circle cx="26" cy="87" r="2.5" fill="${IC.dk}"/>`;
 h+=iFire(40,140,.8)+iOK(40,30,11)+iT(40,166,L2('ψάρι','fish'),{s:11});
 // σύκο + βατόμουρο
 h+=`<path d="M120,72 Q102,96 112,108 Q120,116 128,108 Q138,96 120,72 Z" fill="#6b3a6b"/><rect x="118" y="66" width="4" height="8" fill="${IC.gn}"/>`;
 [[102,124],[108,130],[114,124],[108,118],[102,132],[114,132]].forEach(([x,y])=>{h+=`<circle cx="${x+30}" cy="${y}" r="4" fill="#2b1633" stroke="#5a3a66"/>`});
 h+=iOK(120,30,11)+iT(120,166,L2('γνωστά 100%','known 100%'),{s:11});
 // άγνωστα μούρα
 [[188,96],[198,100],[208,94],[194,110],[204,112],[214,106]].forEach(([x,y])=>{h+=`<circle cx="${x}" cy="${y}" r="5" fill="${IC.rd}"/>`});
 h+=`<path d="M200,70 Q196,84 200,94" stroke="${IC.gn}" stroke-width="2" fill="none"/><ellipse cx="214" cy="80" rx="10" ry="5" fill="${IC.gn}"/>`+iT(200,146,'?',{b:1,s:26,c:IC.yl})+iNO(200,30,11)+iT(200,166,L2('άγνωστα','unknown'),{s:11});
 // μανιτάρι
 h+=wild_mush(280,124,1.2)+iNO(280,30,11)+iT(280,166,L2('μανιτάρια','mushrooms'),{s:11});
 return h}}],

/* ===== Μανιτάρια ===== */
w_mush:[
{at:-1,c:['Σε κατάσταση επιβίωσης ΔΕΝ τρώμε άγρια μανιτάρια – ποτέ με βάση φωτογραφία, εφαρμογή ή «μοιάζει». Το μαγείρεμα δεν τα κάνει ασφαλή.','In a survival situation we DO NOT eat wild mushrooms – never based on a photo, an app or “it looks like”. Cooking does not make them safe.'],f:()=>{
 let h=iFloor(150);
 h+=wild_mush(110,150,2.2)+wild_mush(64,150,1.1,'#e0d8b0');
 h+=iBan(100,104,58);
 h+=iT(240,82,L2('ΜΗΝ ΤΑ','DO NOT'),{b:1,s:18,c:IC.rd})+iT(240,106,L2('ΤΡΩΣ','EAT'),{b:1,s:18,c:IC.rd});
 h+=iPhone(240,150,.5)+iNO(256,142,7);
 return h}},
{at:1,c:['1 Κάλεσε ΑΜΕΣΩΣ Κέντρο Δηλητηριάσεων 210 7793777 ή 166, ακόμα κι αν νιώθει καλά. 2 Κράτα τα μανιτάρια που περίσσεψαν. 3 Σημείωσε την ώρα και ποιοι έφαγαν.','1 Call the Poison Centre 210 7793777 or 166 IMMEDIATELY, even if they feel fine. 2 Keep the remaining mushrooms. 3 Note the time and who ate them.'],f:()=>{
 let h=iPanels(3);
 h+=iNum(16,20,'1')+iNum(123,20,'2')+iNum(229,20,'3');
 h+=iPhone(53,96,1.5,'166')+iT(53,160,'210 7793777',{s:11,b:1,c:IC.yl});
 h+=`<path d="M136,80 L184,80 L188,150 L132,150 Z" fill="#cfe6f5" opacity=".85" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(132,88,188,88,IC.bl,3)+wild_mush(150,140,.6)+wild_mush(170,144,.5);
 h+=iT(160,166,L2('κράτα τα','keep them'),{s:11});
 h+=iClock(266,90,24)+iT(266,140,L2('ώρα + ποιοι','time + who'),{s:11,b:1,c:IC.yl});
 return h}}],

/* ===== Υγιεινή ===== */
w_hyg:[{at:-1,c:['Τουαλέτα στη φύση: λάκκος 15–20 cm βάθος, 60+ m μακριά από νερό και από το καταφύγιο. Μετά σκέπασέ τον με χώμα. Πλύσιμο χεριών ΠΑΝΤΑ.','Toilet in the wild: a hole 15–20 cm deep, 60+ m away from water and from the shelter. Then cover it with soil. ALWAYS wash your hands.'],f:()=>{
 const g=120;let h=iGround(g);
 h+=iWater(0,52,g-2,180);
 h+=iTent(286,g,.9);
 // λάκκος
 h+=`<path d="M146,${g} L150,${g+26} L174,${g+26} L178,${g} Z" fill="#1b140e"/>`+`<path d="M180,${g} q10,-10 22,0 Z" fill="#5a4632"/>`;
 h+=iL(206,g-36,196,g+2,IC.gr,3)+`<path d="M190,${g-2} l10,4 l-2,8 l-10,-4 Z" fill="${IC.gr}"/>`;
 h+=iL(140,g+2,140,g+26,IC.yl,1.5)+iT(136,g+40,'15–20 cm',{s:10,b:1,c:IC.yl,a:'end'});
 // αποστάσεις
 h+=iA(140,70,58,70,IC.yl,2.5)+iA(186,70,262,70,IC.yl,2.5)+iT(100,62,'60+ m',{b:1,s:13,c:IC.yl})+iT(224,62,'60+ m',{b:1,s:13,c:IC.yl});
 h+=iT(26,g+30,L2('νερό','water'),{s:11,b:1});
 h+=iT(162,96,L2('ΤΟΥΑΛΕΤΑ','TOILET'),{b:1,s:12,c:IC.ln});
 return h}}],

/* ===== Κόμποι ===== */
w_knots:[{at:-1,c:['Καρικόμπι (bowline): θηλιά που δεν σφίγγει – «το κουνέλι βγαίνει από την τρύπα, γυρίζει γύρω από το δέντρο και ξαναμπαίνει». Σταυρόκομπος (clove hitch): δύο γύροι γύρω από στύλο, χιαστί.','Bowline: a loop that does not tighten – “the rabbit comes out of the hole, goes around the tree and goes back in”. Clove hitch: two turns around a post, crossed.'],f:()=>{
 let h=iPanels(2);
 // ΚΑΡΙΚΟΜΠΙ: πρώτα το κομμάτι της ουράς που περνά ΠΙΣΩ από το «δέντρο»
 h+=wild_rope('M76,40 C78,30 92,28 94,40',IC.or);
 h+=wild_rope('M80,12 L80,56');
 // μικρή θηλιά «τρύπα» και μεγάλη θηλιά
 h+=wild_rope('M80,56 C80,70 70,80 60,76 C48,70 52,56 64,56 C74,56 86,66 96,80 C112,104 110,150 82,154 C54,156 48,112 66,90');
 // ουρά: βγαίνει από την τρύπα, γύρω από το δέντρο, ξαναμπαίνει
 h+=wild_rope('M66,90 C68,72 72,52 76,40',IC.or);
 h+=wild_rope('M94,40 C94,56 86,70 80,104',IC.or);
 h+=iT(80,174,L2('ΚΑΡΙΚΟΜΠΙ','BOWLINE'),{b:1,s:12,c:IC.yl});
 h+=iT(116,20,L2('δέντρο','tree'),{s:10,c:IC.gr,a:'start'})+iL(114,18,86,18,IC.gr,1);
 h+=iT(14,52,L2('τρύπα','hole'),{s:10,c:IC.gr,a:'start'})+iL(30,56,50,64,IC.gr,1);
 h+=iT(126,120,L2('θηλιά','loop'),{s:10,c:IC.gr,a:'start'})+iL(124,117,108,116,IC.gr,1);
 h+=iT(126,62,L2('κουνέλι','rabbit'),{s:10,c:IC.or,a:'start'})+iL(124,60,100,46,IC.or,1);
 // ΣΤΑΥΡΟΚΟΜΠΟΣ (όψη με το Χ)
 h+=wild_rope('M172,90 L240,90');
 h+=wild_rope('M240,84 L306,84');
 h+=`<rect x="226" y="18" width="28" height="140" rx="3" fill="${IC.wd}"/>`;
 h+=wild_rope('M228,64 L252,108');
 h+=wild_rope('M228,108 L252,64');
 h+=iT(240,174,L2('ΣΤΑΥΡΟΚΟΜΠΟΣ','CLOVE HITCH'),{b:1,s:12,c:IC.yl});
 return h}}],

/* ===== Καιρός ===== */
w_weather:[{at:-1,c:['Αστραπή: μέτρα τα δευτερόλεπτα μέχρι τη βροντή και διαίρεσε με 3 = χιλιόμετρα. Κάτω από 30 δευτερόλεπτα = κάλυψη τώρα. Σύννεφα σαν πύργοι το απόγευμα = καταιγίδα.','Lightning: count the seconds until the thunder and divide by 3 = kilometres. Under 30 seconds = take cover now. Clouds building like towers in the afternoon = thunderstorm.'],f:()=>{
 let h='';
 // πύργος σύννεφου
 h+=`<g fill="${IC.sm}"><circle cx="70" cy="40" r="20"/><circle cx="52" cy="58" r="18"/><circle cx="88" cy="60" r="20"/><circle cx="40" cy="80" r="18"/><circle cx="70" cy="78" r="22"/><circle cx="102" cy="82" r="18"/><rect x="24" y="80" width="96" height="16"/></g>`;
 h+=`<path d="M70,96 L58,124 L70,124 L56,158 L84,116 L72,116 L82,96 Z" fill="${IC.yl}"/>`;
 h+=iClock(160,60,16);
 h+=iT(240,66,L2('δευτ. ÷ 3','sec ÷ 3'),{b:1,s:16,c:IC.ln})+iT(240,88,'= km',{b:1,s:16,c:IC.ln});
 h+=`<rect x="146" y="112" width="166" height="54" rx="10" fill="${IC.rd}" opacity=".9"/>`;
 h+=iT(229,134,L2('< 30 δευτ.','< 30 sec'),{b:1,s:15,c:'#fff'})+iT(229,156,L2('ΚΑΛΥΨΗ ΤΩΡΑ','TAKE COVER'),{b:1,s:14,c:'#fff'});
 return h}}],

/* ===== Μετά τις 72 ώρες ===== */
w_after:[{at:0,c:['Απογραφή: πόσο νερό, φαγητό, φάρμακα και καύσιμα έχουμε, και για πόσες μέρες φτάνουν. Μετά σχέδιο κατανάλωσης και βάρδιες.','Inventory: how much water, food, medicine and fuel we have, and for how many days. Then a consumption plan and shifts.'],f:()=>{
 let h=`<rect x="40" y="16" width="150" height="156" rx="8" fill="${IC.sn}"/><rect x="92" y="10" width="46" height="14" rx="4" fill="${IC.gr}"/>`;
 const rows=[[46,L2('νερό','water')],[78,L2('φαγητό','food')],[110,L2('φάρμακα','medicine')],[142,L2('καύσιμα','fuel')]];
 h+=wild_drop(64,rows[0][0]+4,.55);
 h+=`<rect x="54" y="${rows[1][0]-10}" width="20" height="22" rx="3" fill="${IC.or}"/><rect x="54" y="${rows[1][0]-4}" width="20" height="8" fill="${IC.yl}"/>`;
 h+=`<rect x="54" y="${rows[2][0]-5}" width="22" height="10" rx="5" fill="${IC.rd}"/><rect x="65" y="${rows[2][0]-5}" width="11" height="10" rx="0" fill="${IC.sn}" stroke="${IC.rd}"/>`;
 h+=`<path d="M54,${rows[3][0]+10} L54,${rows[3][0]-6} L60,${rows[3][0]-12} L74,${rows[3][0]-12} L74,${rows[3][0]+10} Z" fill="${IC.gn}"/>`;
 rows.forEach(([y,t])=>{h+=iT(86,y+5,t,{s:12,c:IC.dk,a:'start',b:1})+`<rect x="160" y="${y-8}" width="16" height="16" fill="none" stroke="${IC.dk}" stroke-width="2"/>`+`<path d="M163,${y} l4,5 l8,-10" stroke="${IC.gn}" stroke-width="3" fill="none" stroke-linecap="round"/>`});
 // ημερολόγιο
 h+=`<rect x="214" y="44" width="88" height="80" rx="6" fill="${IC.sn}"/><rect x="214" y="44" width="88" height="20" rx="6" fill="${IC.rd}"/>`;
 for(let r=0;r<3;r++)for(let c=0;c<5;c++)h+=`<rect x="${222+c*16}" y="${72+r*16}" width="10" height="10" fill="${IC.gr}"/>`;
 h+=iT(258,146,L2('ΠΟΣΕΣ ΜΕΡΕΣ;','HOW MANY DAYS?'),{b:1,s:12,c:IC.yl});
 return h}}],
});
