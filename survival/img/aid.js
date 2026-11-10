/* Επιβίωση 72+ – σχέδια Πρώτων Βοηθειών (κατηγορία aid) – Created by George Barbaris */
const aid_CAS='#6f8196';
/* χοντρό «μέλος» (χέρι/πόδι κοντινό πλάνο) */
const aid_limb=(x1,y1,x2,y2,w,c)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c||IC.ln}" stroke-width="${w}" stroke-linecap="round"/>`;
/* αντιβράχιο οριζόντιο από x0 μέχρι x1 στο ύψος y, με παλάμη (κοντινό) */
const aid_arm=(x0,x1,y)=>aid_limb(x0,y,x1,y-3,22)+`<rect x="${x1-6}" y="${y-16}" width="34" height="24" rx="11" fill="${IC.ln}"/><path d="M${x1+6},${y-14} q8,-10 16,-6" stroke="${IC.ln}" stroke-width="8" stroke-linecap="round" fill="none"/>`+[0,6,12].map(d=>iL(x1+28,y-10+d,x1+36,y-10+d,IC.ln,5)).join('');
/* κουταλάκι: (x,y)=κέντρο κουταλιού, fill=τι έχει μέσα (ή κενό) */
const aid_spoon=(x,y,fill,half)=>`<line x1="${x-14}" y1="${y+2}" x2="${x}" y2="${y}" stroke="${IC.gr}" stroke-width="3" stroke-linecap="round"/><ellipse cx="${x+6}" cy="${y}" rx="8" ry="5" fill="${IC.gr}"/>`+(fill?`<ellipse cx="${x+(half?8:6)}" cy="${y-2}" rx="${half?4:7}" ry="${half?2.5:3.5}" fill="${fill}"/>`:'');
/* κεραυνός (ρεύμα) */
const aid_bolt=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s||1})"><polygon points="3,-22 -9,2 0,2 -4,22 10,-4 1,-4 6,-22" fill="${IC.yl}"/></g>`;
/* παγάκι */
const aid_ice=(x,y)=>`<rect x="${x-14}" y="${y-14}" width="28" height="28" rx="5" fill="#bfe3f5" stroke="#fff" stroke-width="1.5"/><path d="M${x-8},${y-8} l6,0 M${x-8},${y-8} l0,6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
/* μπουκάλι νερού όρθιο, (x,y)=κάτω κέντρο */
const aid_bottle=(x,y,h,lbl,col)=>{h=h||50;return`<rect x="${x-13}" y="${y-h}" width="26" height="${h}" rx="7" fill="${col||'#9cc3d6'}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="${x-6}" y="${y-h-10}" width="12" height="11" fill="${IC.ln}" stroke="${IC.dk}" stroke-width="1"/><rect x="${x-7}" y="${y-h-14}" width="14" height="5" rx="1" fill="${IC.bl}"/>`+(lbl?iT(x,y-h/2+5,lbl,{b:1,s:12,c:IC.dk}):'')};

/* μπουκάλι που αδειάζει: στόμιο στο (x,y), σώμα προς τη γωνία ang (μοίρες, -135 = πάνω-δεξιά) */
const aid_pour=(x,y,ang,h)=>`<g transform="translate(${x},${y}) rotate(${ang})">${aid_bottle(0,h+14,h)}</g>`;

Object.assign(SIMG,{
/* ---------- ΠΡΩΤΑ ΑΠ' ΟΛΑ ---------- */
aid_first:[{at:-1,c:['1 Είναι ασφαλές να πλησιάσεις; · 2 Χτύπα ελαφρά στους ώμους και ρώτα δυνατά «Είσαι καλά;» · 3 Κάλεσε 112 ή 166 με ανοιχτή ακρόαση.','1 Is it safe to approach? · 2 Tap the shoulders gently and ask loudly “Are you OK?” · 3 Call 112 or 166 on speaker.'],f:()=>{
 const fl=158;let h=iPanels(3);
 h+=iNum(16,22,'1')+iT(67,27,L2('ΑΣΦΑΛΕΣ;','SAFE?'),{b:1,s:12,c:IC.yl});
 h+=`<path d="M53,48 L90,112 L16,112 Z" fill="${IC.yl}" stroke="${IC.dk}" stroke-width="2" stroke-linejoin="round"/>`+iT(53,103,'!',{b:1,s:40,c:IC.dk});
 h+=iFire(30,152,1.2)+aid_bolt(76,138,1)+iL(10,fl,96,fl,IC.gr,3);
 h+=iNum(122,22,'2')+iT(174,27,L2('ΑΠΑΝΤΑΕΙ;','RESPONDS?'),{b:1,s:12,c:IC.yl});
 h+=iL(110,fl,210,fl,IC.gr,3);
 h+=iP({h:[146,102],n:[152,114],p:[172,132],e1:[147,130],a1:[141,146],e2:[150,130],a2:[145,147],k1:[160,156],f1:[186,157],k2:[164,156],f2:[190,157]});
 h+=iP({h:[126,148],n:[137,150],p:[168,151],e1:[150,152],a1:[162,153],k1:[186,151],f1:[205,152]},{c:aid_CAS,r:8});
 h+=iP({e1:[147,130],a1:[141,146],e2:[150,130],a2:[145,147],n:[152,114]});
 h+=`<path d="M118,62 h40 a6,6 0 0 1 6,6 v16 a6,6 0 0 1 -6,6 h-22 l-8,8 l1,-8 h-11 a6,6 0 0 1 -6,-6 v-16 a6,6 0 0 1 6,-6 z" fill="${IC.sn}"/>`+iT(139,82,'?',{b:1,s:16,c:IC.dk});
 h+=`<path d="M131,136 q-6,-4 -4,-10 M136,134 q-2,-6 2,-10" stroke="${IC.yl}" stroke-width="2" fill="none"/>`;
 h+=iNum(228,22,'3')+iT(274,27,L2('ΚΑΛΕΣΕ','CALL'),{b:1,s:13,c:IC.yl});
 h+=iPhone(267,92,1.5,'112')+`<path d="M297,74 q8,8 0,16 M304,68 q14,14 0,28" stroke="${IC.yl}" stroke-width="2.5" fill="none"/>`;
 h+=iT(267,153,'112 / 166',{b:1,s:15,c:IC.yl});
 return h}}],

/* ---------- ΚΡΙΣΗ ΠΑΝΙΚΟΥ ---------- */
panic:[{at:1,c:['Κάτσε δίπλα του, στο ύψος του, και ανάπνευσε μαζί του: ΜΕΣΑ από τη μύτη μετρώντας 4, ΕΞΩ από το στόμα αργά μετρώντας 6.','Sit with them, at their level, and breathe together: IN through the nose counting 4, OUT through the mouth slowly counting 6.'],f:()=>{
 const fl=152;let h=iFloor(fl);
 h+=`<rect x="22" y="126" width="130" height="7" rx="2" fill="${IC.wd}"/><rect x="28" y="133" width="6" height="${fl-133}" fill="${IC.wd}"/><rect x="140" y="133" width="6" height="${fl-133}" fill="${IC.wd}"/>`;
 h+=iP({h:[58,86],n:[52,99],p:[46,124],e1:[56,113],a1:[66,121],e2:[54,114],a2:[64,122],k1:[68,124],f1:[69,150],k2:[71,125],f2:[73,151]},{c:aid_CAS});
 h+=iP({h:[118,84],n:[120,98],p:[124,124],e1:[110,110],a1:[98,104],e2:[116,113],a2:[104,121],k1:[101,124],f1:[100,150],k2:[98,125],f2:[96,151]});
 h+=`<path d="M72,80 q-4,-6 0,-12 M80,82 q-5,-9 0,-18" stroke="${IC.bl}" stroke-width="2" fill="none"/>`;
 // κύκλος αναπνοής: μικρή ανάβαση (4), μεγάλη κάθοδος (6)
 h+=iL(172,126,312,126,IC.sk,2);
 h+=`<path d="M176,124 L206,58" stroke="${IC.bl}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M206,58 L256,124" stroke="${IC.or}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
 h+=iT(194,36,L2('ΜΕΣΑ 4','IN 4'),{b:1,s:14,c:IC.bl})+iT(194,50,L2('μύτη','nose'),{s:11,c:IC.bl});
 h+=iT(240,84,L2('ΕΞΩ 6','OUT 6'),{b:1,s:14,c:IC.or,a:'start'})+iT(240,100,L2('στόμα, αργά','mouth, slowly'),{s:11,c:IC.or,a:'start'});
 return h}}],

/* ---------- ΠΝΙΓΜΟΝΗ ---------- */
choke:[{at:1,c:['1 Σκύψε τον μπροστά και δώσε 5 δυνατά χτυπήματα ανάμεσα στις ωμοπλάτες με τη βάση της παλάμης · 2 Από πίσω, γροθιά πάνω από τον αφαλό, το άλλο χέρι από πάνω: 5 απότομες ωθήσεις μέσα και πάνω.','1 Lean them forward and give 5 hard blows between the shoulder blades with the heel of your hand · 2 From behind, fist above the belly button, other hand on top: 5 sharp thrusts in and up.'],f:()=>{
 const fl=166;let h=iPanels(2)+iFloor(fl);
 h+=iNum(16,22,'1')+iT(86,27,L2('5× ΠΛΑΤΗ','5× BACK BLOWS'),{b:1,s:13,c:IC.yl});
 h+=iNum(176,22,'2')+iT(248,27,L2('5× ΩΘΗΣΕΙΣ','5× THRUSTS'),{b:1,s:13,c:IC.yl});
 // καρέ 1: διασώστης πίσω-πλάι, θύμα σκυμμένο μπροστά
 h+=iP({h:[80,74],n:[76,88],p:[70,122],e1:[88,106],a1:[106,116],k1:[66,145],f1:[62,166],k2:[72,144],f2:[74,166]},{r:9});
 h+=iP({h:[134,97],n:[122,100],p:[96,122],e1:[124,118],a1:[121,136],e2:[128,117],a2:[128,135],k1:[94,145],f1:[92,166],k2:[100,145],f2:[102,166]},{c:aid_CAS,r:9});
 h+=iP({n:[76,88],e2:[96,89],a2:[112,100]},{});
 h+=`<path d="M106,84 q6,-6 14,-2 M112,78 q8,-6 16,0" stroke="${IC.yl}" stroke-width="2.5" fill="none"/>`;
 // καρέ 2: κοιλιακές ωθήσεις από πίσω
 h+=iP({h:[234,74],n:[234,88],p:[230,124],k1:[238,146],f1:[242,166],k2:[226,145],f2:[220,166]},{r:9});
 h+=iP({h:[252,74],n:[250,88],p:[248,122],e1:[264,100],a1:[257,86],k1:[246,145],f1:[244,166],k2:[252,145],f2:[256,166]},{c:aid_CAS,r:9});
 h+=iP({n:[234,88],e1:[240,105],a1:[257,108]},{});
 h+=`<circle cx="259" cy="108" r="6" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=iA(290,124,268,104)+`<circle cx="253" cy="116" r="2" fill="${IC.dk}"/>`;
 return h}},
 {at:2,c:['Βρέφος: μπρούμυτα στο αντιβράχιό σου, κεφάλι χαμηλά, 5 χτυπήματα στην πλάτη. Μετά ανάσκελα, 5 πιέσεις στο στήθος με 2 δάχτυλα. ΟΧΙ κοιλιακές ωθήσεις.','Baby: face down on your forearm, head low, 5 back blows. Then on its back, 5 chest pushes with 2 fingers. NO abdominal thrusts.'],f:()=>{
 const fl=166;let h=iPanels(2);
 h+=iNum(16,22,'1')+iT(86,27,L2('5× ΠΛΑΤΗ','5× BACK'),{b:1,s:13,c:IC.yl});
 h+=iNum(176,22,'2')+iT(248,27,L2('5× ΣΤΗΘΟΣ','5× CHEST'),{b:1,s:13,c:IC.yl});
 // κοντινό: αντιβράχιο που γέρνει προς τα κάτω, βρέφος μπρούμυτα, κεφάλι στην παλάμη
 h+=aid_limb(14,78,118,122,20)+`<ellipse cx="124" cy="128" rx="13" ry="10" fill="${IC.ln}"/>`;
 h+=iP({n:[96,100],p:[56,80],e1:[98,112],a1:[102,124],k1:[46,92],f1:[56,104],k2:[42,84],f2:[38,98]},{c:aid_CAS,w:13});
 h+=`<circle cx="114" cy="110" r="12" fill="${aid_CAS}"/>`;
 h+=aid_limb(40,36,66,62,14)+`<ellipse cx="72" cy="68" rx="11" ry="8" fill="${IC.ln}" transform="rotate(40 72 68)"/>`;
 h+=`<path d="M86,58 q8,-4 12,4 M92,48 q10,-4 14,6" stroke="${IC.yl}" stroke-width="2.5" fill="none"/>`;
 h+=iT(116,164,L2('κεφάλι χαμηλά','head low'),{s:11,c:IC.yl})+iA(126,150,120,128,IC.yl,2);
 // καρέ 2: ανάσκελα σε επιφάνεια, 2 δάχτυλα στο στήθος
 h+=`<rect x="182" y="134" width="124" height="7" rx="2" fill="${IC.wd}"/>`;
 h+=iP({n:[214,121],p:[246,123],e1:[222,128],a1:[232,128],k1:[258,106],f1:[270,122]},{c:aid_CAS,w:12});
 h+=`<circle cx="200" cy="119" r="10" fill="${aid_CAS}"/>`;
 h+=aid_limb(300,52,250,92,12)+`<circle cx="246" cy="96" r="8" fill="${IC.ln}"/>`+iL(241,100,222,113,IC.ln,4)+iL(244,103,226,115,IC.ln,4);
 h+=iA(208,80,216,106,IC.yl,3);
 h+=iNO(196,158,8)+iT(208,162,L2('ΟΧΙ κοιλιά','NO belly'),{s:11,a:'start'});
 return h}}],

/* ---------- ΑΙΜΟΡΡΑΓΙΑ ---------- */
bleed:[{at:-1,c:['Πίεσε ΔΥΝΑΤΑ πάνω στην πληγή με καθαρό πανί, με όλο σου το βάρος. Μη σηκώνεις το πανί – αν ποτίσει, βάλε κι άλλο από πάνω.','Press HARD on the wound with a clean cloth, using all your weight. Do not lift the cloth – if it soaks through, add more on top.'],f:()=>{
 const fl=158;let h=iFloor(fl);
 h+=iP({h:[146,82],n:[154,96],p:[186,118],k1:[172,155],f1:[204,157],k2:[178,155],f2:[210,157]},{r:9});
 h+=iP({h:[38,140],n:[52,145],p:[116,147],e1:[78,150],a1:[100,151],k1:[166,148],f1:[214,150],k2:[166,151],f2:[214,153]},{c:aid_CAS,r:9});
 h+=`<ellipse cx="150" cy="158" rx="16" ry="3" fill="${IC.rd}"/>`;
 h+=`<rect x="136" y="134" width="28" height="10" rx="3" fill="${IC.sn}"/><path d="M140,142 h12" stroke="${IC.rd}" stroke-width="3"/>`;
 h+=iP({n:[154,96],e1:[151,116],a1:[149,134],e2:[155,116],a2:[152,134]},{});
 h+=iA(126,96,126,126);
 h+=iT(70,52,L2('ΠΙΕΣΕ ΔΥΝΑΤΑ','PRESS HARD'),{b:1,s:16,c:IC.yl});
 h+=iT(250,52,L2('μη σηκώνεις','do not lift'),{s:12})+iT(250,68,L2('το πανί','the cloth'),{s:12});
 return h}},
 {at:0,c:['Tourniquet 5–7 cm ΠΑΝΩ από την πληγή, όχι πάνω σε άρθρωση. Σφίξε μέχρι να σταματήσει το αίμα και γράψε την ΩΡΑ.','Tourniquet 5–7 cm ABOVE the wound, not on a joint. Tighten until the bleeding stops and write down the TIME.'],f:()=>{
 let h='';
 // πόδι κοντινό: μηρός οριζόντιος, γόνατο, κνήμη
 h+=aid_limb(0,92,206,98,40)+aid_limb(206,98,262,150,30)+`<path d="M250,150 l14,14 l30,0 q4,-10 -8,-14 l-18,-14 z" fill="${IC.ln}" stroke="${IC.ln}" stroke-width="6" stroke-linejoin="round"/>`;
 h+=iT(8,58,L2('← σώμα','← body'),{s:10,a:'start',c:IC.gr});
 // πληγή
 h+=`<ellipse cx="162" cy="96" rx="8" ry="5" fill="${IC.rd}"/><circle cx="174" cy="82" r="2.5" fill="${IC.rd}"/><circle cx="168" cy="76" r="2" fill="${IC.rd}"/>`;
 // tourniquet
 h+=`<rect x="113" y="70" width="12" height="46" rx="2" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`+iL(106,74,132,66,IC.wd,6);
 // απόσταση
 h+=iL(119,118,119,132,IC.yl,1.5,1)+iL(162,104,162,132,IC.yl,1.5,1)+iA(140,128,121,128,IC.yl,2)+iA(140,128,160,128,IC.yl,2)+iT(140,148,'5–7 cm',{b:1,s:14,c:IC.yl});
 // γόνατο: όχι εκεί
 h+=`<rect x="200" y="74" width="12" height="46" rx="2" fill="none" stroke="${IC.gr}" stroke-width="2" stroke-dasharray="4 3" transform="rotate(-20 206 97)"/>`+iNO(224,66,8)+iT(250,46,L2('όχι σε άρθρωση','not on a joint'),{s:11});
 // ώρα
 h+=iClock(56,30,12)+iT(74,35,L2('ΓΡΑΨΕ ΩΡΑ','WRITE TIME'),{b:1,s:12,a:'start',c:IC.yl})+iL(110,44,117,66,IC.yl,1.5,1);
 return h}}],

/* ---------- ΣΟΚ ---------- */
shock:[{at:-1,c:['Ξάπλωσέ τον ανάσκελα, σήκωσε λίγο τα πόδια (αν δεν έχουν τραυματιστεί πόδια/λεκάνη) και σκέπασέ τον, και από κάτω. Κάλεσε 166.','Lay them on their back, raise the legs a little (if legs/pelvis are not injured) and cover them, underneath too. Call 166.'],f:()=>{
 const fl=154;let h=iFloor(fl);
 h+=`<rect x="22" y="146" width="150" height="7" rx="3" fill="#9d3b3b"/>`;
 h+=`<rect x="172" y="114" width="44" height="${fl-114}" rx="5" fill="${IC.wd}"/>`;
 h+=iP({h:[38,134],n:[50,140],p:[112,142],e1:[78,143],a1:[98,144],k1:[152,128],f1:[196,112],k2:[152,132],f2:[196,114]},{c:aid_CAS,r:9});
 h+=`<path d="M54,128 Q90,122 118,128 L152,118 Q160,126 156,134 L118,148 Q84,150 52,148 Z" fill="${IC.rd}" opacity=".92"/><path d="M60,132 Q90,126 116,132" stroke="#fff" stroke-width="1" opacity=".4" fill="none"/>`;
 h+=iA(232,110,232,88)+iT(228,78,L2('ΠΟΔΙΑ ΨΗΛΑ','LEGS UP'),{b:1,s:13,c:IC.yl});
 h+=iT(100,100,L2('ΣΚΕΠΑΣΕ','COVER'),{b:1,s:13,c:IC.yl})+iA(100,106,104,124,IC.yl,2);
 h+=iPhone(292,40,.9,'166');
 return h}}],

/* ---------- ΕΓΚΑΥΜΑΤΑ ---------- */
burn:[{at:-1,c:['Δροσερό τρεχούμενο νερό για 20 λεπτά. ΟΧΙ πάγος, ΟΧΙ βούτυρο, οδοντόκρεμα ή λάδι.','Cool running water for 20 minutes. NO ice, NO butter, toothpaste or oil.'],f:()=>{
 let h='';
 // βρύση
 h+=`<rect x="10" y="22" width="80" height="12" rx="3" fill="${IC.gr}"/><rect x="78" y="22" width="16" height="30" rx="4" fill="${IC.gr}"/><rect x="40" y="12" width="26" height="8" rx="3" fill="${IC.gr}"/><rect x="50" y="18" width="6" height="6" fill="${IC.gr}"/>`;
 h+=`<rect x="80" y="52" width="12" height="44" fill="${IC.bl}" opacity=".85"/>`;
 // χέρι
 h+=aid_arm(4,96,108);
 h+=`<ellipse cx="86" cy="100" rx="11" ry="5" fill="${IC.rd}" opacity=".8"/>`;
 h+=`<path d="M70,112 q-4,10 -2,18 M86,114 q0,12 2,20 M100,114 q4,10 2,18" stroke="${IC.bl}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 h+=`<path d="M10,138 L170,138 L158,166 L22,166 Z" fill="${IC.sk}" stroke="${IC.gr}" stroke-width="2"/>`;
 h+=iClock(196,64,18)+iT(196,104,L2('20 ΛΕΠΤΑ','20 MIN'),{b:1,s:15,c:IC.yl});
 h+=iT(196,122,L2('δροσερό νερό','cool water'),{s:11,c:IC.bl});
 // ΟΧΙ πάγος, ΟΧΙ βούτυρο
 h+=iL(240,14,240,166,IC.sk,2);
 h+=aid_ice(280,56)+iNO(298,40,9)+iT(280,90,L2('πάγος','ice'),{s:11});
 h+=`<path d="M258,128 l12,-10 h34 l-12,10 z" fill="#fff1a8"/><rect x="258" y="128" width="34" height="18" fill="${IC.yl}"/><path d="M292,128 l12,-10 v18 l-12,10 z" fill="#d9a23a"/>`+iNO(302,112,9)+iT(280,162,L2('βούτυρο','butter'),{s:11});
 return h}}],

/* ---------- ΚΑΤΑΓΜΑ ---------- */
fracture:[{at:-1,c:['Μην ισιώνεις το κόκκαλο. Νάρθηκας από κάτι σκληρό (χαρτόνι, περιοδικό, κλαδί) δεμένος ΠΑΝΩ και ΚΑΤΩ από το κάταγμα.','Do not straighten the bone. A splint from something rigid (cardboard, magazine, branch) tied ABOVE and BELOW the fracture.'],f:()=>{
 let h='';
 h+=`<rect x="96" y="76" width="190" height="7" rx="2" fill="${IC.wd}"/><rect x="96" y="118" width="190" height="7" rx="2" fill="${IC.wd}"/>`;
 h+=aid_limb(-10,98,124,100,36)+aid_limb(124,100,268,102,26)+aid_limb(272,104,284,70,16);
 h+=`<circle cx="124" cy="100" r="8" fill="none" stroke="${IC.gr}" stroke-width="1.5"/>`+iT(124,148,L2('γόνατο','knee'),{s:10,c:IC.gr});
 h+=`<path d="M198,88 l-6,6 l8,4 l-7,6 l6,8" stroke="${IC.rd}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
 [140,168,228,258].forEach(x=>{h+=`<rect x="${x-4}" y="70" width="8" height="62" rx="2" fill="${IC.yl}" stroke="${IC.dk}" stroke-width="1"/>`});
 h+=iT(154,52,L2('ΠΑΝΩ','ABOVE'),{b:1,s:12,c:IC.yl})+iA(154,56,154,68,IC.yl,2);
 h+=iT(243,52,L2('ΚΑΤΩ','BELOW'),{b:1,s:12,c:IC.yl})+iA(243,56,243,68,IC.yl,2);
 h+=iT(198,30,L2('κάταγμα','fracture'),{s:11,c:IC.rd})+iA(198,34,198,84,IC.rd,2);
 h+=iT(196,160,L2('ΝΑΡΘΗΚΑΣ (σκληρό)','SPLINT (rigid)'),{b:1,s:12,c:'#d9a066'})+iA(196,148,196,128,'#d9a066',2);
 return h}}],

/* ---------- ΠΛΗΓΕΣ ---------- */
wound:[{at:-1,c:['1 Ξέπλυνε την πληγή με άφθονο καθαρό (πόσιμο) νερό · 2 Κάλυψε με αποστειρωμένη γάζα και άλλαζέ τη καθημερινά.','1 Rinse the wound with plenty of clean (drinking) water · 2 Cover with sterile gauze and change it every day.'],f:()=>{
 let h=iPanels(2);
 h+=iNum(16,22,'1')+iT(80,27,L2('ΞΕΠΛΥΝΕ','RINSE'),{b:1,s:13,c:IC.yl});
 h+=iNum(176,22,'2')+iT(240,27,L2('ΚΑΛΥΨΕ','COVER'),{b:1,s:13,c:IC.yl});
 h+=aid_arm(6,104,128)+`<path d="M62,121 l18,-3" stroke="${IC.rd}" stroke-width="3.5" stroke-linecap="round"/>`;
 h+=aid_pour(96,62,-125,40)+`<path d="M96,64 Q76,82 72,116" stroke="${IC.bl}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 h+=`<path d="M66,134 q-2,8 0,14 M78,134 q2,8 0,14" stroke="${IC.bl}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 h+=aid_arm(166,264,128)+`<rect x="208" y="110" width="34" height="18" rx="2" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1"/><path d="M212,114 h26 M212,119 h26 M212,124 h26" stroke="#c9d4df" stroke-width="1"/>`;
 h+=`<rect x="203" y="113" width="10" height="12" fill="#e9d8b4" opacity=".9"/><rect x="237" y="113" width="10" height="12" fill="#e9d8b4" opacity=".9"/>`;
 h+=iOK(296,70,11)+iT(238,160,L2('άλλαζε κάθε μέρα','change daily'),{s:11});
 return h}}],

/* ---------- ΑΛΛΕΡΓΙΑ ---------- */
allergy:[{at:-1,c:['Ένεση αδρεναλίνης (EpiPen κ.ά.) στο ΕΞΩ μέρος του μηρού – γίνεται και πάνω από το ρούχο. Μετά 166, ακόμα κι αν βελτιωθεί.','Adrenaline auto-injector (EpiPen etc.) into the OUTER thigh – it works through clothing too. Then 166, even if they get better.'],f:()=>{
 let h='';
 h+=iP({h:[50,38],n:[50,52],p:[50,96],e1:[40,72],a1:[37,92],e2:[60,72],a2:[63,92],k1:[44,125],f1:[42,154],k2:[56,125],f2:[58,154]},{c:aid_CAS,r:9});
 h+=`<circle cx="58" cy="110" r="5" fill="${IC.or}" stroke="#fff" stroke-width="1.5"/>`+iL(64,108,146,70,IC.or,1.5,1);
 // κοντινό: μηρός από μπροστά (με ρούχο), εξωτερική πλευρά δεξιά
 h+=`<path d="M146,8 L232,8 Q232,90 218,128 L214,172 L172,172 L170,128 Q150,80 146,8 Z" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="2"/><path d="M170,128 Q194,138 218,128" stroke="${IC.ln}" stroke-width="1.5" fill="none" opacity=".6"/>`;
 h+=`<rect x="236" y="56" width="66" height="16" rx="5" fill="${IC.yl}"/><rect x="230" y="58" width="9" height="12" rx="2" fill="${IC.or}"/>`;
 h+=`<rect x="254" y="48" width="30" height="30" rx="11" fill="${IC.ln}"/><path d="M256,50 q-4,8 2,12" stroke="${IC.ln}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
 h+=iA(312,96,262,96)+iT(266,120,L2('ΕΞΩ ΜΕΡΟΣ','OUTER'),{b:1,s:12,c:IC.yl})+iT(266,135,L2('ΜΗΡΟΥ','THIGH'),{b:1,s:12,c:IC.yl});
 h+=iPhone(108,140,.9,'166');
 return h}}],

/* ---------- ΕΜΦΡΑΓΜΑ – ΕΓΚΕΦΑΛΙΚΟ ---------- */
heart:[{at:0,c:['Έμφραγμα: κάλεσε 166 αμέσως και κάθισέ τον να ξεκουραστεί.','Heart attack: call 166 at once and sit them down to rest.'],f:()=>{
 const fl=160;let h=iL(0,fl,170,fl,IC.gr,3);
 h+=`<rect x="56" y="120" width="52" height="7" rx="2" fill="${IC.wd}"/><rect x="56" y="64" width="6" height="${fl-64}" fill="${IC.wd}"/><rect x="100" y="127" width="6" height="${fl-127}" fill="${IC.wd}"/>`;
 h+=iP({h:[86,62],n:[80,76],p:[74,116],e1:[94,94],a1:[84,90],e2:[88,100],a2:[104,112],k1:[110,118],f1:[112,158],k2:[114,120],f2:[117,159]},{c:aid_CAS,r:9});
 h+=`<path d="M88,82 l6,-6 M96,90 l8,-2 M92,100 l7,4" stroke="${IC.rd}" stroke-width="3" stroke-linecap="round"/>`;
 h+=iT(84,36,L2('ΚΑΘΙΣΕ ΤΟΝ','SIT DOWN'),{b:1,s:13,c:IC.yl});
 h+=iPhone(220,92,1.7,'166')+`<path d="M252,70 q8,8 0,16 M259,64 q14,14 0,28" stroke="${IC.yl}" stroke-width="2.5" fill="none"/>`+iT(220,162,L2('ΑΜΕΣΩΣ','AT ONCE'),{b:1,s:14,c:IC.rd});
 return h}},
 {at:1,c:['Τεστ εγκεφαλικού: 1 ΠΡΟΣΩΠΟ – στραβώνει; · 2 ΧΕΡΙΑ – πέφτει το ένα; · 3 ΛΟΓΙΑ – μπερδεύονται; Ένα από αυτά = 166 ΤΩΡΑ, σημείωσε την ώρα.','Stroke test: 1 FACE – drooping? · 2 ARMS – one drifts down? · 3 SPEECH – mixed up? Any one = 166 NOW, note the time.'],f:()=>{
 let h=iPanels(3);
 h+=iNum(16,22,'1')+iT(62,27,L2('ΠΡΟΣΩΠΟ','FACE'),{b:1,s:13,c:IC.yl});
 h+=iNum(122,22,'2')+iT(168,27,L2('ΧΕΡΙΑ','ARMS'),{b:1,s:13,c:IC.yl});
 h+=iNum(228,22,'3')+iT(274,27,L2('ΛΟΓΙΑ','SPEECH'),{b:1,s:13,c:IC.yl});
 // πρόσωπο που στραβώνει στη μία πλευρά
 h+=`<circle cx="53" cy="98" r="34" fill="${IC.ln}"/><circle cx="41" cy="88" r="4" fill="${IC.dk}"/><path d="M60,89 q6,3 12,0" stroke="${IC.dk}" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M53,92 l-3,12 h6" stroke="${IC.dk}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M34,110 Q44,118 54,113 Q63,112 70,124" stroke="${IC.dk}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
 h+=iA(94,104,76,120,IC.rd,2.5);
 // χέρια: το ένα πέφτει
 h+=iP({h:[160,62],n:[160,76],p:[160,118],e1:[144,74],a1:[128,72],e2:[176,82],a2:[188,94],k1:[154,142],f1:[152,166],k2:[166,142],f2:[168,166]},{c:aid_CAS,r:9});
 h+=`<path d="M176,76 L204,74" stroke="${IC.gr}" stroke-width="3" stroke-dasharray="3 3" fill="none"/>`+iA(204,84,200,106,IC.rd,2.5);
 // λόγια μπερδεμένα
 h+=`<path d="M222,142 q0,-18 22,-18 q22,0 22,18 z" fill="${aid_CAS}"/><circle cx="244" cy="104" r="15" fill="${aid_CAS}"/><circle cx="239" cy="101" r="2" fill="${IC.dk}"/><circle cx="250" cy="101" r="2" fill="${IC.dk}"/><ellipse cx="245" cy="111" rx="3.5" ry="2.5" fill="${IC.dk}"/>`;
 h+=`<path d="M258,56 h50 a6,6 0 0 1 6,6 v22 a6,6 0 0 1 -6,6 h-34 l-12,12 l2,-12 h-6 a6,6 0 0 1 -6,-6 v-22 a6,6 0 0 1 6,-6 z" fill="${IC.sn}"/>`+iT(283,78,'?#@!',{b:1,s:14,c:IC.rd});
 h+=iClock(262,152,10)+iT(298,157,'166',{b:1,s:15,c:IC.rd});
 return h}}],

/* ---------- ΣΠΑΣΜΟΙ ---------- */
seizure:[{at:-1,c:['Απομάκρυνε σκληρά αντικείμενα, βάλε κάτι μαλακό κάτω από το κεφάλι. ΜΗΝ τον κρατάς, ΤΙΠΟΤΑ στο στόμα. Μέτρα τον χρόνο: πάνω από 5 λεπτά → 166.','Move hard objects away, put something soft under the head. DO NOT hold them down, NOTHING in the mouth. Time it: over 5 minutes → 166.'],f:()=>{
 const fl=154;let h=iFloor(fl);
 h+=`<ellipse cx="40" cy="148" rx="22" ry="6" fill="${IC.bl}"/>`;
 h+=iP({h:[40,134],n:[54,141],p:[122,145],e1:[78,130],a1:[94,140],e2:[74,149],a2:[92,151],k1:[148,136],f1:[176,150],k2:[154,145],f2:[184,152]},{c:aid_CAS,r:9});
 h+=`<path d="M70,118 q4,-4 0,-8 q-4,-4 0,-8 M120,124 q4,-4 0,-8 q-4,-4 0,-8 M168,122 q4,-4 0,-8 q-4,-4 0,-8" stroke="${IC.yl}" stroke-width="2" fill="none"/>`;
 h+=iT(36,108,L2('ΜΑΛΑΚΟ','SOFT'),{b:1,s:12,c:IC.yl})+iA(28,114,32,140,IC.yl,2);
 // καρέκλα απομακρύνεται
 h+=`<g fill="${IC.wd}"><rect x="232" y="118" width="32" height="6"/><rect x="258" y="86" width="6" height="${fl-86}"/><rect x="232" y="124" width="5" height="${fl-124}"/></g>`+iA(200,104,240,104)+iT(220,96,L2('μακριά','away'),{s:11});
 // ΟΧΙ στο στόμα
 h+=`<g transform="rotate(-30 120 48)"><line x1="104" y1="48" x2="128" y2="48" stroke="${IC.gr}" stroke-width="4" stroke-linecap="round"/><ellipse cx="134" cy="48" rx="8" ry="5" fill="${IC.gr}"/></g>`+iBan(122,48,18)+iT(122,84,L2('τίποτα στο στόμα','nothing in mouth'),{s:11});
 // χρόνος
 h+=iClock(270,32,14)+iT(270,64,L2('> 5 λεπτά → 166','> 5 min → 166'),{b:1,s:11,c:IC.yl});
 return h}}],

/* ---------- ΥΠΟΓΛΥΚΑΙΜΙΑ ---------- */
diabetes:[{at:-1,c:['Δώσε 15–20 g ζάχαρη: χυμό, 4 κύβους ζάχαρη ή καραμέλες. Αν δεν βελτιωθεί σε 15 λεπτά, δώσε ξανά.','Give 15–20 g of sugar: juice, 4 sugar cubes or sweets. If no better in 15 minutes, give again.'],f:()=>{
 let h='';
 h+=`<path d="M22,46 L58,46 L53,104 L27,104 Z" fill="none" stroke="${IC.ln}" stroke-width="2"/><path d="M24,60 L56,60 L53,102 L27,102 Z" fill="${IC.or}"/>`+iT(40,124,L2('χυμός','juice'),{s:11});
 h+=iT(76,80,L2('ή','or'),{s:12,c:IC.gr});
 [[94,58],[118,58],[94,82],[118,82]].forEach(([x,y])=>{h+=`<rect x="${x}" y="${y}" width="20" height="20" rx="2" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1"/>`});
 h+=iT(116,124,L2('4 κύβοι','4 cubes'),{s:11});
 h+=iT(156,80,L2('ή','or'),{s:12,c:IC.gr});
 [[180,60,IC.rd],[200,84,IC.yl],[176,98,IC.gn]].forEach(([x,y,c])=>{h+=`<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${c}"/><path d="M${x-9},${y} l-7,-5 v10 z M${x+9},${y} l7,-5 v10 z" fill="${c}"/>`});
 h+=iT(188,124,L2('καραμέλες','sweets'),{s:11});
 h+=iT(110,160,'15–20 g',{b:1,s:22,c:IC.yl});
 h+=iL(226,14,226,166,IC.sk,2);
 h+=iClock(272,58,20)+iT(272,102,L2('15 λεπτά','15 min'),{b:1,s:14,c:IC.yl});
 h+=iT(272,124,L2('όχι καλύτερα;','no better?'),{s:11})+iT(272,142,L2('δώσε ξανά','give again'),{b:1,s:12});
 return h}}],

/* ---------- ΔΗΛΗΤΗΡΙΑΣΗ ---------- */
poison:[{at:-1,c:['Κάλεσε το Κέντρο Δηλητηριάσεων 210 7793777 ή 166 και κράτα τη συσκευασία. ΜΗΝ προκαλείς εμετό, ΜΗΝ δίνεις γάλα ή λάδι αν δεν σου πουν.','Call the Poison Centre 210 7793777 or 166 and keep the packaging. DO NOT make them vomit, DO NOT give milk or oil unless told to.'],f:()=>{
 let h='';
 h+=iPhone(56,70,1.6,'24h');
 h+=iT(56,132,'210 7793777',{b:1,s:13,c:IC.yl})+iT(56,150,L2('ή 166','or 166'),{b:1,s:12});
 h+=iL(112,14,112,166,IC.sk,2);
 h+=`<rect x="146" y="50" width="34" height="62" rx="6" fill="${IC.gn}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="154" y="36" width="18" height="15" rx="2" fill="${IC.ln}"/>`;
 h+=`<path d="M163,64 l14,14 l-14,14 l-14,-14 z" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1"/>`+iT(163,84,'!',{b:1,s:13,c:IC.dk});
 h+=iOK(190,42,9)+iT(163,134,L2('ΚΡΑΤΑ ΤΗ','KEEP THE'),{b:1,s:12,c:IC.yl})+iT(163,150,L2('ΣΥΣΚΕΥΑΣΙΑ','PACKAGING'),{b:1,s:12,c:IC.yl});
 h+=iL(214,14,214,166,IC.sk,2);
 h+=`<path d="M236,50 l10,-12 h20 l10,12 v50 h-40 z" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1.5"/><path d="M236,62 h40" stroke="${IC.bl}" stroke-width="5"/>`;
 h+=iNO(282,40,9)+iT(256,120,L2('ΟΧΙ γάλα/λάδι','NO milk/oil'),{s:11,b:1});
 h+=iNO(232,150,9)+iT(246,154,L2('ΟΧΙ εμετός','NO vomiting'),{s:11,b:1,a:'start'});
 return h}}],

/* ---------- ΔΑΓΚΩΜΑΤΑ ---------- */
bite:[{at:0,c:['Οχιά: ηρεμία, το μέλος ακίνητο, χαμηλά στο ύψος της καρδιάς, και νοσοκομείο/166. ΟΧΙ κόψιμο, ρούφηγμα, tourniquet ή πάγος.','Viper: stay calm, keep the limb still and low at heart level, and go to hospital/166. NO cutting, sucking, tourniquet or ice.'],f:()=>{
 const fl=150;let h=iFloor(fl);
 h+=iP({h:[50,92],n:[52,106],p:[56,144],e1:[44,124],a1:[38,146],e2:[64,124],a2:[78,136],k1:[96,145],f1:[136,147],k2:[82,124],f2:[102,148]},{c:IC.ln,r:9});
 h+=`<circle cx="120" cy="143" r="2.5" fill="${IC.rd}"/><circle cx="126" cy="143" r="2.5" fill="${IC.rd}"/>`;
 h+=`<path d="M150,${fl-2} q8,-8 16,0 t16,0 t16,0" stroke="${IC.gn}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="202" cy="${fl-3}" rx="6" ry="4" fill="${IC.gn}"/>`;
 h+=iT(100,40,L2('ΑΚΙΝΗΤΟ','KEEP STILL'),{b:1,s:14,c:IC.yl})+iT(100,58,L2('χαμηλά, ύψος καρδιάς','low, heart level'),{s:11})+iOK(174,34,10);
 h+=iA(124,108,122,134,IC.yl,2);
 h+=iL(214,10,214,170,IC.sk,2);
 // κόψιμο
 h+=`<path d="M226,46 L256,32 L258,38 Z" fill="${IC.sn}"/><rect x="256" y="30" width="14" height="7" rx="2" fill="${IC.wd}" transform="rotate(-25 256 34)"/>`+iNO(270,22,7)+iT(246,66,L2('κόψιμο','cut'),{s:10});
 // ρούφηγμα
 h+=`<ellipse cx="292" cy="40" rx="12" ry="7" fill="${IC.rd}"/><path d="M281,40 h22" stroke="${IC.dk}" stroke-width="2"/>`+iNO(306,26,7)+iT(292,66,L2('ρούφηγμα','suck'),{s:10});
 // tourniquet
 h+=`<rect x="234" y="96" width="24" height="14" fill="${IC.or}"/>`+iL(230,103,262,99,IC.wd,4)+iNO(266,90,7)+iT(246,130,'tourniquet',{s:10});
 // πάγος
 h+=`<rect x="282" y="92" width="22" height="22" rx="4" fill="#bfe3f5"/>`+iNO(306,90,7)+iT(292,130,L2('πάγος','ice'),{s:10});
 return h}}],

/* ---------- ΜΑΤΙ ---------- */
eye:[{at:-1,c:['Γείρε το κεφάλι προς το χτυπημένο μάτι και ξέπλενε με καθαρό νερό τουλάχιστον 15 λεπτά, από τη μύτη προς τα έξω.','Tilt the head towards the injured eye and rinse with clean water for at least 15 minutes, from the nose side outwards.'],f:()=>{
 const cx=112,cy=104,a=35*Math.PI/180,W=(x,y)=>[cx+x*Math.cos(a)-y*Math.sin(a),cy+x*Math.sin(a)+y*Math.cos(a)].map(v=>v.toFixed(1));
 let h=`<g transform="rotate(35 ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="42" ry="50" fill="${IC.ln}"/>`;
 h+=`<ellipse cx="${cx-16}" cy="${cy-10}" rx="8" ry="4.5" fill="#fff" stroke="${IC.dk}" stroke-width="1.5"/><circle cx="${cx-16}" cy="${cy-10}" r="3" fill="${IC.dk}"/>`;
 h+=`<ellipse cx="${cx+16}" cy="${cy-10}" rx="8" ry="4.5" fill="#f2c0c0" stroke="${IC.rd}" stroke-width="1.5"/><circle cx="${cx+16}" cy="${cy-10}" r="3" fill="${IC.dk}"/>`;
 h+=`<path d="M${cx},${cy-6} l-4,16 h7" stroke="${IC.dk}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${cx-12},${cy+24} q12,6 24,0" stroke="${IC.dk}" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
 const ic=W(8,-10),oc=W(26,-10),ed=W(44,-6);
 // μπουκάλι που ρίχνει νερό από πάνω, στη γωνία του ματιού δίπλα στη μύτη
 h+=`<path d="M${+ic[0]+3},${+ic[1]-22} L${ic[0]},${ic[1]}" stroke="${IC.bl}" stroke-width="5" stroke-linecap="round"/>`+aid_pour(+ic[0]+3,+ic[1]-24,-135,34);
 h+=`<path d="M${ic[0]},${ic[1]} L${oc[0]},${oc[1]} L${ed[0]},${ed[1]} L${+ed[0]+2},${+ed[1]+30}" stroke="${IC.bl}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
 h+=iA(+oc[0]+20,+oc[1]-20,+ed[0]+16,+ed[1]-4,IC.yl,2.5);
 h+=iT(196,60,L2('από τη μύτη','from the nose'),{s:11,a:'start'})+iT(196,74,L2('προς τα έξω','outwards'),{s:11,a:'start'});
 h+=iClock(262,120,16)+iT(262,156,L2('15 λεπτά','15 min'),{b:1,s:14,c:IC.yl});
 return h}}],

/* ---------- ΑΦΥΔΑΤΩΣΗ ---------- */
dehyd:[{at:-1,c:['Διάλυμα επανυδάτωσης: 1 λίτρο καθαρό νερό + 6 κουταλάκια ζάχαρη + ½ κουταλάκι αλάτι. Πίνεται γουλιά-γουλιά.','Rehydration drink: 1 litre of clean water + 6 teaspoons of sugar + ½ teaspoon of salt. Drink it in small sips.'],f:()=>{
 let h='';
 h+=aid_bottle(38,120,72,'1 L')+iT(38,148,L2('νερό','water'),{s:11});
 h+=iT(76,92,'+',{b:1,s:22,c:IC.yl});
 [[104,66],[130,66],[156,66],[104,92],[130,92],[156,92]].forEach(([x,y])=>{h+=aid_spoon(x,y,IC.sn)});
 h+=iT(130,124,'6 ×',{b:1,s:14,c:IC.yl})+iT(130,148,L2('ζάχαρη','sugar'),{s:11});
 h+=iT(186,92,'+',{b:1,s:22,c:IC.yl});
 h+=aid_spoon(214,80,'#fff',1)+iT(214,124,'½ ×',{b:1,s:14,c:IC.yl})+iT(214,148,L2('αλάτι','salt'),{s:11});
 h+=iT(244,92,'=',{b:1,s:22,c:IC.yl});
 h+=`<path d="M264,62 L298,62 L294,116 L268,116 Z" fill="none" stroke="${IC.ln}" stroke-width="2"/><path d="M266,76 L296,76 L294,114 L268,114 Z" fill="#9cc3d6"/>`;
 h+=iT(280,148,L2('γουλιά-γουλιά','small sips'),{s:10});
 return h}}],
});
