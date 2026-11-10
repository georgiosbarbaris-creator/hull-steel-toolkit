/* Επιβίωση 72+ – σχέδια κατηγορίας 'now' (μέρος 2) – Created by George Barbaris */
/* ξαπλωμένος σε sleeping bag: κεφάλι στο (x,y-10), σώμα προς τα δεξιά, μήκος len, πάτωμα στο y. pad=υπόστρωμα από κάτω */
function n2_bag(x,y,len,o){o=o||{};let h='';
 if(o.pad)h+=`<rect x="${x-12}" y="${y-5}" width="${len+20}" height="6" rx="2" fill="${IC.bl}"/>`;
 const yb=o.pad?y-5:y;
 h+=`<path d="M${x+6},${yb-20} Q${x+len*0.4},${yb-24} ${x+len},${yb-14} L${x+len},${yb} L${x+6},${yb} Q${x-4},${yb-10} ${x+6},${yb-20} Z" fill="${o.c||IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 if(o.covered){h+=`<path d="M${x-2},${yb-10} Q${x-4},${yb-24} ${x+12},${yb-22} L${x+12},${yb} Q${x-4},${yb} ${x-2},${yb-10} Z" fill="${o.c||IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;}
 else{h+=`<circle cx="${x}" cy="${yb-10}" r="8" fill="${IC.sk2}"/><path d="M${x-8},${yb-12} A8,8 0 0 1 ${x+6},${yb-17} L${x+8},${yb-10}" fill="${IC.rd}"/>`+
  `<path d="M${x+4},${yb-20} Q${x-12},${yb-10} ${x+4},${yb}" fill="none" stroke="${IC.dk}" stroke-width="3"/>`;}
 return h}
/* μικρό κυματιστό βέλος ζέστης προς τα πάνω */
const n2_heat=(x,y,c)=>`<path d="M${x},${y} q-4,-5 0,-10 t0,-10" fill="none" stroke="${c||IC.or}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x-4},${y-17} L${x},${y-24} L${x+4},${y-17} Z" fill="${c||IC.or}"/>`;
const n2_flake=(x,y,s)=>{s=s||5;return`<g stroke="${IC.sn}" stroke-width="1.5" stroke-linecap="round">${iL(x-s,y,x+s,y,IC.sn,1.5)}${iL(x-s*.5,y-s*.87,x+s*.5,y+s*.87,IC.sn,1.5)}${iL(x-s*.5,y+s*.87,x+s*.5,y-s*.87,IC.sn,1.5)}</g>`};
/* γεννήτρια: κάτω αριστερά (x,y) */
const n2_gen=(x,y)=>`<rect x="${x}" y="${y-26}" width="40" height="24" rx="3" fill="${IC.yl}" stroke="${IC.dk}" stroke-width="1.5"/><rect x="${x+6}" y="${y-20}" width="14" height="12" fill="${IC.dk}"/><rect x="${x+2}" y="${y-30}" width="36" height="5" rx="2" fill="${IC.gr}"/><circle cx="${x+8}" cy="${y-1}" r="3" fill="${IC.dk}"/><circle cx="${x+32}" cy="${y-1}" r="3" fill="${IC.dk}"/>`;
/* ραδιόφωνο */
const n2_radio=(x,y)=>`<rect x="${x-26}" y="${y-18}" width="52" height="34" rx="5" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/><circle cx="${x-10}" cy="${y}" r="10" fill="${IC.dk}"/><circle cx="${x-10}" cy="${y}" r="5" fill="${IC.gr}"/><rect x="${x+4}" y="${y-10}" width="16" height="7" fill="${IC.sn}"/>${iL(x+12,y-18,x+24,y-40,IC.gr,2)}<circle cx="${x+12}" cy="${y+7}" r="3" fill="${IC.dk}"/>`;
/* τομή κτιρίου: x αριστερά, y έδαφος, n όροφοι πάνω από το έδαφος, fh ύψος ορόφου, w πλάτος, υπόγειο από κάτω (bh) */
function n2_bldg(x,y,w,n,fh,bh){let h=`<rect x="${x}" y="${y-n*fh}" width="${w}" height="${n*fh+(bh||0)}" fill="${IC.sk}" stroke="${IC.ln}" stroke-width="3"/>`;
 for(let i=1;i<n;i++)h+=iL(x,y-i*fh,x+w,y-i*fh,IC.gr,2);
 if(bh)h+=iL(x,y,x+w,y,IC.gr,2);
 return h}

Object.assign(SIMG,{
car_snow:[{at:1,c:['Μείνε μέσα. Καθάρισε την εξάτμιση από το χιόνι (ξανά κάθε ώρα), άνοιξε λίγο το παράθυρο από την πλευρά που δεν φυσάει, μηχανή 10 λεπτά κάθε ώρα.','Stay inside. Clear the exhaust of snow (again every hour), open a window slightly on the side away from the wind, run the engine 10 minutes every hour.'],f:()=>{
 let h='';
 [[20,30],[60,64],[300,40],[40,100],[300,110],[180,18],[270,78]].forEach(([x,y])=>h+=n2_flake(x,y,4));
 h+=iCar(185,150,1.25,0,IC.or);
 // παράθυρο λίγο ανοιχτό (μπροστινό τζάμι)
 h+=`<rect x="${185+2*1.25}" y="${150-56*1.25}" width="${26*1.25}" height="5" fill="${IC.dk}"/>`;
 h+=iA(215,62,206,76,IC.bl,2.5);
 h+=iT(232,40,L2('παράθυρο λίγο','window open'),{s:11,c:IC.yl})+iT(232,53,L2('ανοιχτό','a little'),{s:11,c:IC.yl});
 // εξάτμιση πίσω (αριστερά)
 h+=`<rect x="104" y="${150-21*1.25}" width="18" height="6" rx="2" fill="${IC.gr}" stroke="${IC.dk}" stroke-width="1"/>`;
 h+=`<g fill="${IC.sm}" opacity=".8"><circle cx="96" cy="118" r="5"/><circle cx="86" cy="110" r="7"/><circle cx="74" cy="100" r="9"/></g>`;
 // χιόνι
 h+=`<path d="M0,180 L0,140 Q40,128 80,140 L102,140 Q110,146 126,140 Q200,134 320,142 L320,180 Z" fill="${IC.sn}"/>`;
 h+=iA(40,150,92,138,IC.rd,3)+iT(36,165,L2('ΚΑΘΑΡΗ ΕΞΑΤΜΙΣΗ','CLEAR EXHAUST'),{b:1,s:11,c:IC.rd,a:'start'});
 h+=iOK(112,122,9);
 h+=iClock(110,34,13)+iT(110,62,L2('μηχανή 10′/ώρα','engine 10 min/h'),{b:1,s:11,c:IC.yl});
 return h}}],

micro:[{at:1,c:['Σκηνή ΜΕΣΑ στο πιο μικρό δωμάτιο. Υπόστρωμα από κάτω, sleeping bag, πρόσωπο έξω. Η ζέστη του σώματος μένει μέσα στη σκηνή.','A tent INSIDE the smallest room. Pad underneath, sleeping bag, face out. Your body heat stays inside the tent.'],f:()=>{
 let h='';const fl=158;
 // δωμάτιο
 h+=`<rect x="10" y="12" width="300" height="${fl-12}" fill="#1d3550" stroke="${IC.ln}" stroke-width="3"/>`;
 // παράθυρο με κουβέρτα
 h+=`<rect x="24" y="40" width="40" height="44" fill="#9cc3d6"/><rect x="22" y="36" width="44" height="52" fill="${IC.wd}" opacity=".9"/>`+iT(44,104,L2('κουβέρτα','blanket'),{s:10,c:IC.gr});
 h+=n2_flake(44,60,6);
 h+=iT(270,38,L2('ΚΡΥΟ','COLD'),{b:1,s:13,c:IC.bl})+n2_flake(240,34,5)+n2_flake(296,56,4);
 // σκηνή (ημιδιάφανη)
 h+=`<path d="M86,${fl} Q150,40 170,40 Q190,40 254,${fl} Z" fill="${IC.yl}" fill-opacity=".22" stroke="${IC.yl}" stroke-width="3"/>`;
 h+=n2_bag(130,fl,92,{pad:1});
 // ζέστη που γυρίζει πίσω
 h+=n2_heat(150,128)+n2_heat(180,126)+n2_heat(206,130);
 h+=`<path d="M146,96 Q170,80 198,94" fill="none" stroke="${IC.or}" stroke-width="2" stroke-dasharray="4 3"/>`;
 h+=iT(170,30,L2('η ζέστη μένει μέσα','heat stays inside'),{s:11,b:1,c:IC.or});
 h+=iT(170,173,L2('υπόστρωμα','pad'),{s:10,b:1,c:IC.bl});
 return h}},
 {at:2,c:['Λάθος: μύτη και στόμα μέσα – η ανάσα βρέχει τον υπνόσακο. Σωστά: πρόσωπο έξω, κουκούλα σφιχτή γύρω του.','Wrong: nose and mouth inside – your breath makes the bag wet. Right: face out, hood pulled tight around it.'],f:()=>{
 let h=iPanels(2);const fl=120;
 h+=n2_bag(40,fl,110,{covered:1,pad:1});
 [[40,92],[54,86],[30,84]].forEach(([x,y])=>h+=`<path d="M${x},${y} q-4,6 0,9 q4,-3 0,-9 Z" fill="${IC.bl}"/>`);
 h+=iNO(80,40,14)+iT(80,150,L2('βρέχεται','gets wet'),{b:1,s:12,c:IC.rd});
 h+=n2_bag(196,fl,110,{pad:1});
 h+=iOK(240,40,14)+iT(240,150,L2('ΠΡΟΣΩΠΟ ΕΞΩ','FACE OUT'),{b:1,s:12,c:IC.gn});
 return h}}],

bodystove:[{at:0,c:['Το σώμα σου βγάζει ζέστη σαν λάμπα 80–100 W, όλη τη νύχτα. Το sleeping bag δεν ζεσταίνει – κρατάει αυτή τη ζέστη.','Your body gives off heat like an 80–100 W bulb, all night long. The sleeping bag does not heat – it keeps that heat in.'],f:()=>{
 let h='';
 // λάμπα
 h+=`<circle cx="62" cy="70" r="26" fill="${IC.yl}"/><rect x="52" y="94" width="20" height="16" rx="3" fill="${IC.gr}"/>`+iL(54,100,70,100,IC.dk,1.5)+iL(54,105,70,105,IC.dk,1.5);
 [[62,30,62,22],[24,70,16,70],[100,70,108,70],[34,42,28,36],[90,42,96,36]].forEach(([a,b,c,d])=>h+=iL(a,b,c,d,IC.yl,3));
 h+=iT(62,132,'80–100 W',{b:1,s:15,c:IC.yl});
 h+=iT(126,80,'=',{b:1,s:30,c:IC.ln});
 // άνθρωπος σε sleeping bag
 h+=n2_bag(176,126,110,{pad:1});
 h+=n2_heat(204,94)+n2_heat(234,92)+n2_heat(264,96);
 h+=`<path d="M170,104 Q170,60 230,56 Q290,60 292,104" fill="none" stroke="${IC.or}" stroke-width="2" stroke-dasharray="5 4"/>`;
 h+=iT(232,46,L2('μένει μέσα','stays inside'),{b:1,s:12,c:IC.or});
 h+=iT(232,156,L2('Η ΣΟΜΠΑ ΕΙΣΑΙ ΕΣΥ','YOU ARE THE STOVE'),{b:1,s:12});
 return h}},
 {at:3,c:['Το πάτωμα «ρουφάει» τη ζέστη. Βάλε υπόστρωμα, χαρτόνια ή κουβέρτες ΚΑΤΩ από σένα – περισσότερα από όσα βάζεις από πάνω.','The floor sucks the heat out of you. Put a pad, cardboard or blankets UNDER you – more than you put on top.'],f:()=>{
 let h=iPanels(2);
 h+=`<rect x="6" y="122" width="148" height="50" fill="${IC.gr}" opacity=".35"/><rect x="166" y="122" width="148" height="50" fill="${IC.gr}" opacity=".35"/>`;
 h+=iT(80,165,L2('κρύο πάτωμα','cold floor'),{s:10,c:IC.bl})+iT(240,165,L2('κρύο πάτωμα','cold floor'),{s:10,c:IC.bl});
 h+=n2_bag(32,122,104);
 h+=iA(60,124,60,148,IC.or,3)+iA(90,124,90,148,IC.or,3)+iA(120,124,120,148,IC.or,3);
 h+=iNO(80,40,14);
 // σωστά: παχιά στρώματα
 h+=`<rect x="180" y="114" width="128" height="8" fill="${IC.wd}"/><rect x="180" y="106" width="128" height="8" fill="${IC.bl}"/>`;
 h+=n2_bag(196,106,104);
 h+=n2_heat(226,82)+n2_heat(262,82);
 h+=iT(244,138,L2('υπόστρωμα','pad + cardboard'),{s:10,c:IC.ln});
 h+=iOK(240,40,14);
 return h}}],

power:[{at:0,c:['Γεννήτρια ΜΟΝΟ έξω, τουλάχιστον 6 m από πόρτες και παράθυρα. Ποτέ μέσα στο σπίτι, σε γκαράζ ή κλειστό μπαλκόνι – το μονοξείδιο σκοτώνει.','Generator ONLY outdoors, at least 6 m from doors and windows. Never inside the house, a garage or a closed balcony – carbon monoxide kills.'],f:()=>{
 let h='';const g=150;
 h+=iGround(g);
 // αριστερό καρέ: μέσα = όχι
 h+=`<rect x="10" y="60" width="86" height="90" fill="${IC.sk}" stroke="${IC.ln}" stroke-width="2"/>`+n2_gen(33,g);
 h+=`<g fill="${IC.sm}" opacity=".85"><circle cx="70" cy="110" r="6"/><circle cx="78" cy="98" r="8"/><circle cx="70" cy="82" r="9"/></g>`;
 h+=iBan(53,123,30)+iT(53,48,L2('ΜΕΣΑ','INSIDE'),{b:1,s:12,c:IC.rd});
 h+=iL(112,10,112,172,IC.sk,2);
 // δεξιά: σπίτι + γεννήτρια μακριά
 h+=iHouse(128,g,74,62)+`<rect x="176" y="104" width="18" height="18" fill="#9cc3d6" stroke="${IC.ln}" stroke-width="1.5"/><rect x="140" y="118" width="18" height="32" fill="${IC.wd}"/>`;
 h+=n2_gen(268,g);
 h+=`<g fill="${IC.sm}" opacity=".85"><circle cx="300" cy="112" r="5"/><circle cx="306" cy="100" r="7"/></g>`;
 h+=iA(230,136,202,136,IC.yl,2.5)+iA(240,136,266,136,IC.yl,2.5)+iT(235,128,'≥ 6 m',{b:1,s:13,c:IC.yl});
 h+=iOK(288,60,12)+iT(255,40,L2('ΕΞΩ','OUTSIDE'),{b:1,s:12,c:IC.gn});
 return h}}],

homewater:[{at:-1,c:['Μόλις ακούσεις για καταστροφή ή διακοπή νερού: γέμισε τη μπανιέρα αμέσως (150–200 λίτρα) και σκέπασέ τη – κίνδυνος πνιγμού για μικρά παιδιά.','As soon as you hear of a disaster or water cut: fill the bathtub at once (150–200 litres) and cover it – drowning risk for small children.'],f:()=>{
 let h='';const fl=150;
 h+=iFloor(fl);
 // βρύση
 h+=`<path d="M70,60 L70,46 L100,46 L100,54" fill="none" stroke="${IC.gr}" stroke-width="6" stroke-linecap="round"/>`;
 h+=`<rect x="98" y="56" width="5" height="26" fill="${IC.bl}"/>`;
 // μπανιέρα
 h+=`<path d="M40,80 L250,80 L238,138 Q236,146 226,146 L62,146 Q52,146 50,138 Z" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="2"/>`;
 h+=`<path d="M50,90 L240,90 L232,134 L58,134 Z" fill="${IC.wt}"/>`;
 h+=iL(70,146,66,fl,IC.gr,4)+iL(220,146,224,fl,IC.gr,4);
 h+=iT(145,118,'150–200 L',{b:1,s:16,c:'#fff'});
 // σκέπασμα
 h+=`<rect x="160" y="72" width="100" height="6" rx="2" fill="${IC.wd}" transform="rotate(-8 210 75)"/>`;
 h+=iT(272,60,L2('σκέπασε','cover'),{s:11,c:IC.yl,a:'end'});
 h+=iT(160,30,L2('ΓΕΜΙΣΕ ΤΩΡΑ','FILL IT NOW'),{b:1,s:15,c:IC.yl});
 h+=iKid(286,fl,1,IC.gr)+iBan(286,128,20);
 return h}},
 {at:4,c:['Κρυφό νερό στο σπίτι: θερμοσίφωνας (60–120 L, από τη βάνα κάτω, κλειστό ρεύμα), καζανάκι (6–9 L, όχι η λεκάνη), πάγος από τον καταψύκτη.','Hidden water at home: water heater (60–120 L, from the tap at the bottom, power off), toilet cistern (6–9 L, not the bowl), ice from the freezer.'],f:()=>{
 let h='';const fl=156;
 h+=iFloor(fl);
 // θερμοσίφωνας
 h+=`<rect x="26" y="36" width="56" height="90" rx="24" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="2"/>`;
 h+=iL(54,126,54,140,IC.gr,4)+`<rect x="46" y="136" width="16" height="6" fill="${IC.rd}"/>`;
 h+=`<path d="M54,144 q-4,6 0,9 q4,-3 0,-9 Z" fill="${IC.bl}"/>`;
 h+=iT(54,26,'60–120 L',{b:1,s:12,c:IC.yl});
 h+=iT(54,86,L2('θερμο-','water'),{s:9,c:IC.dk})+iT(54,97,L2('σίφωνας','heater'),{s:9,c:IC.dk});
 // καζανάκι + λεκάνη
 h+=`<rect x="128" y="74" width="50" height="30" rx="3" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="2"/><rect x="132" y="84" width="42" height="17" fill="${IC.wt}"/>`;
 h+=`<path d="M136,${fl} L140,128 L124,128 Q122,112 136,112 L176,112 Q186,112 182,128 L164,128 L168,${fl} Z" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="2"/>`;
 h+=iL(153,104,153,112,IC.gr,4);
 h+=iT(153,62,'6–9 L',{b:1,s:12,c:IC.yl});
 h+=iOK(190,80,8)+iNO(194,124,7);
 // καταψύκτης με πάγο
 h+=`<rect x="232" y="56" width="66" height="${fl-56}" rx="4" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="2"/>`+iL(232,92,298,92,IC.dk,2)+iL(288,64,288,84,IC.gr,3);
 [[246,104],[262,104],[278,104],[254,118],[270,118]].forEach(([x,y])=>h+=`<rect x="${x-6}" y="${y-6}" width="12" height="12" rx="2" fill="#bfe0ff" stroke="${IC.bl}" stroke-width="1.5"/>`);
 h+=iT(265,44,L2('πάγος','ice'),{b:1,s:12,c:IC.yl});
 return h}}],

war:[{at:0,c:['Κανόνας των «2 τοίχων»: πήγαινε σε εσωτερικό διάδρομο ή μπάνιο, ώστε να έχεις δύο τοίχους ανάμεσα σε σένα και τον δρόμο, μακριά από παράθυρα.','The "two walls" rule: go to an inner corridor or bathroom, so there are two walls between you and the street, away from windows.'],f:()=>{
 let h='';const fl=154;
 h+=iFloor(fl);
 // έκρηξη στον δρόμο
 h+=`<path d="M40,96 l8,-18 l4,14 l14,-12 l-4,16 l16,2 l-14,8 l10,12 l-16,-4 l-4,16 l-6,-14 l-12,10 l2,-16 l-14,-4 l14,-6 Z" fill="${IC.or}" stroke="${IC.yl}" stroke-width="2"/>`;
 h+=iT(44,150,L2('δρόμος','street'),{s:10,c:IC.gr});
 // τοίχος 1 με παράθυρο
 h+=`<rect x="96" y="30" width="10" height="${fl-30}" fill="${IC.gr}"/><rect x="96" y="70" width="10" height="34" fill="#9cc3d6"/>`;
 h+=iNum(101,20,'1');
 // δωμάτιο με παράθυρο
 h+=iNO(140,86,10)+iT(140,112,L2('παράθυρα','windows'),{s:10,c:IC.rd});
 // τοίχος 2
 h+=`<rect x="186" y="30" width="10" height="${fl-30}" fill="${IC.gr}"/>`;
 h+=iNum(191,20,'2');
 h+=`<rect x="300" y="30" width="10" height="${fl-30}" fill="${IC.gr}"/>`;
 // άνθρωπος καθισμένος στο πάτωμα στον διάδρομο, χέρια στο κεφάλι
 h+=iP({h:[288,111],n:[288,124],p:[286,150],e1:[276,136],a1:[264,134],e2:[278,134],a2:[266,132],k1:[264,132],f1:[256,153],k2:[266,134],f2:[260,153]});
 h+=iOK(250,74,12)+iT(250,52,L2('διάδρομος / μπάνιο','corridor / bathroom'),{s:10,c:IC.gn});
 return h}}],

nuclear:[{at:1,c:['Μπες σε γερό κτίριο από μπετό ή τούβλο. Πήγαινε στο υπόγειο ή στη ΜΕΣΗ, μακριά από ταράτσα και εξωτερικούς τοίχους. Έξω είναι ο μεγαλύτερος κίνδυνος.','Get into a solid concrete or brick building. Go to the basement or the MIDDLE, away from the roof and outer walls. Outside is the most dangerous place.'],f:()=>{
 let h='';const g=126;
 h+=iGround(g);
 // σκόνη που πέφτει
 for(let i=0;i<34;i++){const x=10+(i*37)%300,y=10+(i*23)%104;if(x>36&&x<104&&y>30&&y<74)continue;h+=`<circle cx="${x}" cy="${y}" r="2" fill="${IC.yl}" opacity=".8"/>`}
 for(let x=8;x<316;x+=14)h+=`<circle cx="${x}" cy="${g-2}" r="2" fill="${IC.yl}"/>`;
 // κτίριο 3 όροφοι + υπόγειο
 h+=n2_bldg(130,g,120,3,28,30);
 h+=`<rect x="134" y="${g+4}" width="112" height="22" fill="${IC.gn}" opacity=".55"/><rect x="160" y="${g-52}" width="60" height="20" fill="${IC.gn}" opacity=".55"/>`;
 h+=iMan(190,g-29,0.4)+iMan(170,g+27,0.4)+iMan(210,g+27,0.4);
 h+=iL(222,g-42,262,g-42,IC.gn,1.5)+iT(266,g-38,L2('μέση','middle'),{s:11,b:1,c:IC.gn,a:'start'});
 h+=iL(246,g+14,262,g+14,IC.gn,1.5)+iT(266,g+18,L2('υπόγειο','basement'),{s:11,b:1,c:IC.gn,a:'start'});
 h+=iOK(290,40,11);
 // άνθρωπος έξω
 h+=iMan(70,g,0.8,IC.ln)+iNO(70,64,11)+iT(70,46,L2('ΕΞΩ','OUTSIDE'),{b:1,s:11,c:IC.rd});
 h+=iT(160,172,L2('ΜΠΕΣ – ΜΕΙΝΕ ΜΕΣΑ','GET IN – STAY IN'),{b:1,s:12,c:IC.yl});
 return h}},
 {at:2,c:['1 Βγάλε τα εξωτερικά ρούχα πριν μπεις και βάλ\' τα σε δεμένη σακούλα. 2 Ντους με σαπούνι και σαμπουάν, χωρίς δυνατό τρίψιμο.','1 Take off your outer clothes before going in and put them in a tied bag. 2 Shower with soap and shampoo, without hard scrubbing.'],f:()=>{
 let h=iPanels(2);const fl=160;
 h+=iFloor(fl)+iNum(18,20,'1')+iNum(178,20,'2');
 // βγάζει μπουφάν
 h+=iP({h:[60,100],n:[60,112],p:[60,134],e1:[50,124],a1:[48,136],e2:[72,120],a2:[90,116],k1:[56,147],f1:[54,fl],k2:[64,147],f2:[66,fl]});
 h+=`<path d="M90,108 L112,104 L118,132 L96,136 Z" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=`<g fill="${IC.yl}"><circle cx="100" cy="116" r="1.6"/><circle cx="108" cy="122" r="1.6"/><circle cx="104" cy="128" r="1.6"/></g>`;
 h+=iA(112,138,122,146,IC.yl,2.5);
 h+=`<path d="M118,${fl} L120,140 L146,140 L148,${fl} Z" fill="${IC.dk}" stroke="${IC.gr}" stroke-width="1.5"/><path d="M128,140 l5,-8 l5,8" fill="none" stroke="${IC.gr}" stroke-width="2"/>`;
 h+=iT(92,46,L2('ρούχα σε σακούλα','clothes in a bag'),{b:1,s:11,c:IC.yl});
 // ντους
 h+=iL(270,26,270,40,IC.gr,3)+iL(270,26,236,26,IC.gr,3)+`<path d="M228,40 L244,40 L240,34 L232,34 Z" fill="${IC.gr}"/>`;
 for(let i=0;i<6;i++)h+=iL(229+i*3,46+(i%2)*6,226+i*3.4,58+(i%2)*6,IC.bl,2);
 h+=iP({h:[236,82],n:[236,94],p:[236,118],e1:[226,90],a1:[232,78],e2:[246,90],a2:[240,76],k1:[232,139],f1:[230,fl],k2:[240,139],f2:[242,fl]});
 for(let i=0;i<5;i++)h+=`<path d="M${222+i*7},${100+i*9} q-3,5 0,7 q3,-2 0,-7 Z" fill="${IC.bl}"/>`;
 h+=iT(286,110,L2('σαπούνι','soap'),{s:11,c:IC.yl})+iT(286,124,L2('σαμπουάν','shampoo'),{s:11,c:IC.yl});
 return h}}],

chem:[{at:0,c:['Τα περισσότερα χημικά αέρια είναι βαριά και μαζεύονται χαμηλά. Πήγαινε σε δωμάτιο ΨΗΛΑ και σφράγισε χαραμάδες με βρεγμένες πετσέτες ή νάιλον και ταινία.','Most chemical gases are heavy and collect low down. Go to a room HIGH up and seal the gaps with wet towels or plastic and tape.'],f:()=>{
 let h='';const g=160;
 h+=iGround(g);
 h+=n2_bldg(120,g,120,3,42,0);
 // σκάλα
 for(let i=0;i<3;i++)h+=`<path d="M210,${g-i*42} l8,-10 l8,-10 l8,-10 l0,-12" fill="none" stroke="${IC.gr}" stroke-width="2"/>`;
 // νέφος χαμηλά
 h+=`<g fill="#b5c94a" opacity=".75"><circle cx="20" cy="${g-14}" r="16"/><circle cx="50" cy="${g-20}" r="20"/><circle cx="84" cy="${g-14}" r="16"/><circle cx="110" cy="${g-10}" r="12"/><circle cx="262" cy="${g-14}" r="16"/><circle cx="292" cy="${g-18}" r="20"/><rect x="4" y="${g-14}" width="312" height="14"/></g>`;
 h+=`<rect x="122" y="${g-24}" width="116" height="22" fill="#b5c94a" opacity=".45"/>`;
 h+=iT(56,g-46,L2('αέριο','gas'),{b:1,s:12,c:'#d7e86a'})+iA(56,g-40,56,g-26,'#d7e86a',2.5);
 h+=iNO(150,g-24,8);
 // πάνω δωμάτιο
 h+=iMan(166,g-84,0.55)+iOK(150,g-112,8);
 h+=`<rect x="124" y="${g-90}" width="14" height="5" fill="${IC.bl}"/>`;
 h+=iA(196,g-30,196,g-102,IC.yl,3);
 h+=iT(286,34,L2('ΨΗΛΑ','GO UP'),{b:1,s:14,c:IC.yl});
 h+=iT(286,52,L2('σφράγισε','seal gaps'),{s:11,c:IC.ln});
 return h}}],

sea:[{at:1,c:['Στάση H.E.L.P.: γόνατα στο στήθος, χέρια σφιχτά γύρω από το σώμα, με σωσίβιο. Με άλλους: σφιχτός κύκλος, παιδιά και τραυματίες στη μέση.','H.E.L.P. position: knees to chest, arms tight around the body, wearing a lifejacket. With others: a tight huddle, children and injured in the middle.'],f:()=>{
 let h='';const w=98;
 let d=`M0,${w}`;for(let x=0;x<320;x+=16)d+=` q4,-4 8,0 t8,0`;
 h+=`<path d="${d} L320,180 L0,180 Z" fill="${IC.wt}" opacity=".6"/>`+iPanels(2);
 h+=iT(80,24,'H.E.L.P.',{b:1,s:15,c:IC.yl})+iT(240,24,L2('ΣΦΙΧΤΟΣ ΚΥΚΛΟΣ','HUDDLE'),{b:1,s:13,c:IC.yl});
 const J=(x1,y1,x2,y2)=>`<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" rx="5" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 // ένας σε H.E.L.P. (πλάγια): γόνατα στο στήθος, χέρια σταυρωτά
 h+=iP({h:[74,74],n:[76,86],p:[78,114],k1:[100,100],f1:[96,124],k2:[98,104],f2:[92,127]});
 h+=J(64,84,90,110);
 h+=iL(68,94,96,100,IC.ln,5)+iL(68,102,96,96,IC.ln,5);
 h+=iA(128,76,104,94,IC.yl,2.5)+iT(126,56,L2('γόνατα','knees'),{s:11,c:IC.yl,a:'start'})+iT(126,69,L2('στο στήθος','to chest'),{s:11,c:IC.yl,a:'start'});
 // ομάδα
 const P=(x,c,r,y0)=>iP({h:[x,y0],n:[x,y0+12],p:[x,y0+40],k1:[x-4,y0+60],f1:[x-6,y0+80],k2:[x+4,y0+60],f2:[x+6,y0+80]},{c,r})+J(x-11,y0+10,x+11,y0+32);
 h+=P(206,IC.ln,8,80)+P(274,IC.ln,8,80)+P(240,IC.yl,7,84);
 h+=iL(204,104,276,104,IC.ln,5);
 h+=`<path d="${d}" fill="none" stroke="#9cc3d6" stroke-width="2"/>`;
 return h}}],

lost:[{at:0,c:['ΣΤΟΠ: Στάσου, κάτσε, πιες νερό. Συνήθως το καλύτερο είναι να μείνεις εκεί και να σε βρουν. Σφυρίχτρα 3 φορές για να σε ακούσουν.','STOP: stop, sit down, drink water. Usually the best plan is to stay put and let them find you. Blow a whistle 3 times so they can hear you.'],f:()=>{
 let h='';const g=154;
 h+=iGround(g,'#2d3b2a');
 h+=iTree(30,g,1.1)+iTree(290,g,1.2)+iTree(252,g,0.8);
 // πινακίδα STOP
 const sx=70,sy=58,r=26;let pts='';for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;pts+=`${(sx+r*Math.cos(a)).toFixed(1)},${(sy+r*Math.sin(a)).toFixed(1)} `}
 h+=`<polygon points="${pts}" fill="${IC.rd}" stroke="#fff" stroke-width="2.5"/>`+iT(sx,sy+5,L2('ΣΤΟΠ','STOP'),{b:1,s:14,c:'#fff'});
 // πέτρα + καθισμένος
 h+=`<ellipse cx="150" cy="${g-6}" rx="26" ry="14" fill="${IC.gr}"/>`;
 h+=iP({h:[148,96],n:[148,108],p:[150,134],e1:[158,124],a1:[168,130],e2:[162,114],a2:[156,100],k1:[170,130],f1:[172,g],k2:[166,132],f2:[166,g]});
 h+=`<rect x="154" y="96" width="10" height="5" rx="2" fill="${IC.or}"/>`;
 [0,1,2].forEach(i=>h+=`<path d="M${176+i*9},88 q6,10 0,20" fill="none" stroke="${IC.yl}" stroke-width="2.5" stroke-linecap="round"/>`);
 h+=iT(214,104,'× 3',{b:1,s:16,c:IC.yl});
 h+=iT(206,40,L2('ΜΕΙΝΕ ΕΚΕΙ','STAY PUT'),{b:1,s:14,c:IC.yl});
 return h}}],

blackout_comm:[{at:0,c:['Ραδιόφωνο μπαταρίας ή μανιβέλας για ανακοινώσεις. Σύντομο SMS όταν οι κλήσεις δεν περνάνε. Σημείωμα στην πόρτα: ποιος, πότε, πού πήγε.','Battery or crank radio for announcements. A short SMS when calls do not go through. A note on the door: who, when, where you went.'],f:()=>{
 let h=iPanels(3);
 h+=n2_radio(53,96);
 [0,1].forEach(i=>h+=`<path d="M${80+i*8},62 q6,8 0,16" fill="none" stroke="${IC.yl}" stroke-width="2"/>`);
 h+=iT(53,146,'FM / AM',{b:1,s:13,c:IC.yl});
 h+=iPhone(160,90,1.3,'SMS')+iT(160,146,L2('σύντομο','short'),{b:1,s:12,c:IC.yl});
 h+=`<rect x="232" y="40" width="56" height="120" fill="${IC.wd}" stroke="${IC.ln}" stroke-width="2"/><circle cx="278" cy="102" r="3" fill="${IC.yl}"/>`;
 h+=`<rect x="240" y="60" width="38" height="34" fill="${IC.sn}" transform="rotate(-4 259 77)"/>`;
 [68,76,84].forEach(y=>h+=iL(245,y,272,y-1,IC.gr,2));
 h+=iT(260,32,L2('σημείωμα','note'),{b:1,s:12,c:IC.yl});
 return h}}],
});
