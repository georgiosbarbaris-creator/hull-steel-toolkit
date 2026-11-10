/* Επιβίωση 72+ – σχέδια για κάρτες «Τώρα» (μέρος 1) – Created by George Barbaris */
/* τοπικά βοηθητικά (n1_) */
const n1_shoe=(x,y,s,c)=>`<g transform="translate(${x},${y}) scale(${s||1})"><path d="M0,0 L0,-14 L10,-16 L16,-8 L34,-4 Q38,-2 38,0 Z" fill="${c||IC.or}" stroke="${IC.dk}" stroke-width="1.5"/><rect x="0" y="-2" width="38" height="3" fill="${IC.dk}"/></g>`;
/* τρέχων άνθρωπος προς τα δεξιά, μπροστινό πόδι στο (x+12s, y) */
const n1_run=(x,y,s,c)=>{s=s||1;const P=(a,b)=>[x+a*s,y+b*s];return iP({h:P(10,-56),n:P(6,-45),p:P(0,-24),e1:P(-6,-35),a1:P(-14,-28),e2:P(14,-38),a2:P(20,-46),k1:P(-8,-8),f1:P(-24,-4),k2:P(16,-14),f2:P(12,0)},{c,w:5*s,r:7*s})};
/* σκούφος πάνω σε κεφάλι κέντρο (x,y) ακτίνα r */
const n1_hat=(x,y,r,c)=>`<path d="M${x-r-1},${y-2} A${r+1},${r+1} 0 0 1 ${x+r+1},${y-2} Z" fill="${c||IC.rd}"/><rect x="${x-r-2}" y="${y-4}" width="${2*r+4}" height="4" rx="2" fill="${IC.sn}"/><circle cx="${x}" cy="${y-r-2}" r="3" fill="${IC.sn}"/>`;
const n1_bag=(x,y)=>`<path d="M${x-7},${y-36} q7,-10 14,0" fill="none" stroke="${IC.dk}" stroke-width="3"/><rect x="${x-14}" y="${y-36}" width="28" height="36" rx="7" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/><path d="M${x-14},${y-24} h28" stroke="${IC.dk}" stroke-width="2"/><rect x="${x-8}" y="${y-14}" width="16" height="9" rx="2" fill="#c96600"/>`;
const n1_pills=(x,y)=>`<rect x="${x-7}" y="${y-22}" width="14" height="22" rx="2" fill="${IC.sn}" stroke="${IC.dk}" stroke-width="1.2"/><rect x="${x-8}" y="${y-28}" width="16" height="6" rx="1.5" fill="${IC.rd}"/><path d="M${x},${y-16} v8 M${x-4},${y-12} h8" stroke="${IC.gn}" stroke-width="2.5"/>`;
const n1_bottle=(x,y)=>`<rect x="${x-3}" y="${y-44}" width="6" height="6" fill="${IC.sn}"/><path d="M${x-3},${y-38} L${x-7},${y-32} L${x-7},${y} L${x+7},${y} L${x+7},${y-32} L${x+3},${y-38} Z" fill="${IC.bl}" stroke="${IC.ln}" stroke-width="1.2"/>`;
const n1_jacket=(x,y,c)=>`<path d="M${x-9},${y-34} L${x-18},${y-28} L${x-21},${y-6} L${x-15},${y-6} L${x-12},${y-22} L${x-12},${y} L${x+12},${y} L${x+12},${y-22} L${x+15},${y-6} L${x+21},${y-6} L${x+18},${y-28} L${x+9},${y-34} L${x+4},${y-30} L${x-4},${y-30} Z" fill="${c||IC.rd}" stroke="${IC.dk}" stroke-width="1.3"/><path d="M${x},${y-30} V${y}" stroke="${IC.dk}" stroke-width="1.5"/>`;
const n1_moon=(x,y,r,bg)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.yl}"/><circle cx="${x+r*.45}" cy="${y-r*.4}" r="${r*.9}" fill="${bg||IC.bg}"/>`;
const n1_sun=(x,y,r)=>{let h='';for(let i=0;i<8;i++){const a=i*Math.PI/4;h+=iL((x+Math.cos(a)*(r+4)).toFixed(1),(y+Math.sin(a)*(r+4)).toFixed(1),(x+Math.cos(a)*(r+9)).toFixed(1),(y+Math.sin(a)*(r+9)).toFixed(1),IC.yl,2.5)}return h+`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.yl}"/>`};
const n1_zig=(x,y,c)=>`<path d="M${x},${y} l4,-5 l4,5 l4,-5 l4,5" stroke="${c||IC.or}" stroke-width="2" fill="none"/>`;
const n1_shutter=(x,y,w,h)=>{let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7a8796" stroke="${IC.ln}" stroke-width="1.2"/>`;for(let yy=y+4;yy<y+h;yy+=4)s+=iL(x+1,yy,x+w-1,yy,'#5a6574',1);return s};

Object.assign(SIMG,{
quake_night:[
{at:0,c:['Στο κρεβάτι: μείνε εκεί, γύρνα μπρούμυτα και σκέπασε κεφάλι και σβέρκο με το μαξιλάρι.','In bed: stay there, turn face down and cover your head and neck with the pillow.'],f:()=>{
 const fl=152;let h=iFloor(fl)+n1_moon(292,30,13);
 h+=`<rect x="30" y="76" width="8" height="${fl-76}" fill="${IC.wd}"/><rect x="38" y="116" width="156" height="12" fill="${IC.wd}"/><rect x="190" y="100" width="8" height="${fl-100}" fill="${IC.wd}"/>`;
 h+=`<rect x="44" y="128" width="6" height="${fl-128}" fill="${IC.wd}"/><rect x="180" y="128" width="6" height="${fl-128}" fill="${IC.wd}"/>`;
 h+=`<rect x="38" y="106" width="152" height="10" rx="3" fill="#c9d6e3"/>`;
 const J={h:[62,98],n:[74,102],p:[100,102],k1:[122,102],f1:[146,102],k2:[122,103],f2:[146,103],e1:[70,90],a1:[60,86],e2:[80,90],a2:[72,84]};
 h+=iP(J);
 h+=`<rect x="46" y="80" width="40" height="13" rx="6" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1.5"/>`;
 h+=iP({n:J.n,e1:J.e1,a1:J.a1,e2:J.e2,a2:J.a2});
 h+=iT(66,72,L2('ΜΑΞΙΛΑΡΙ','PILLOW'),{s:10,c:IC.yl,b:1});
 h+=n1_zig(26,fl+12)+n1_zig(176,fl+12)+n1_zig(100,fl+12);
 h+=iT(256,74,L2('ΜΕΙΝΕ ΣΤΟ','STAY IN'),{b:1,s:14,c:IC.yl})+iT(256,92,L2('ΚΡΕΒΑΤΙ','BED'),{b:1,s:14,c:IC.yl});
 h+=iT(256,114,L2('μπρούμυτα','face down'),{s:11});
 h+=iOK(256,134,10);
 return h}},
{at:1,c:['Μόλις σταματήσει: 1 φόρεσε παπούτσια πρώτα (σπασμένα γυαλιά) · 2 φακός – ΟΧΙ αναπτήρας, σπίρτο ή κερί.','When it stops: 1 put shoes on first (broken glass) · 2 use a torch – NO lighter, match or candle.'],f:()=>{
 const fl=148;let h=iPanels(2)+iL(8,fl,152,fl,IC.gr,3)+iL(168,fl,312,fl,IC.gr,3);
 h+=iNum(20,22,'1')+iT(86,27,L2('ΠΑΠΟΥΤΣΙΑ','SHOES'),{b:1,s:14,c:IC.yl});
 h+=iNum(180,22,'2')+iT(246,27,L2('ΦΑΚΟΣ','TORCH'),{b:1,s:14,c:IC.yl});
 // σπασμένα γυαλιά
 [[22,fl],[40,fl],[118,fl],[136,fl]].forEach(([x,y],i)=>{h+=`<polygon points="${x},${y} ${x+5},${y-8-i%2*3} ${x+9},${y}" fill="#9cc3d6"/>`});
 h+=n1_shoe(44,fl-2,1.3)+n1_shoe(78,fl-14,1.1,'#d06a00');
 h+=iOK(130,68,11);
 // φακός με δέσμη
 h+=`<polygon points="214,96 262,78 262,114" fill="${IC.yl}" opacity=".35"/>`;
 h+=`<rect x="180" y="90" width="28" height="12" rx="3" fill="${IC.gr}" stroke="${IC.dk}" stroke-width="1.2"/><polygon points="208,88 216,84 216,108 208,104" fill="${IC.ln}"/>`;
 h+=iOK(190,66,11);
 // αναπτήρας απαγορεύεται
 h+=`<rect x="284" y="128" width="12" height="18" rx="2" fill="${IC.bl}"/><rect x="284" y="124" width="12" height="5" fill="${IC.gr}"/>`+iFire(290,124,.6);
 h+=iBan(290,130,17);
 return h}}],

trapped:[
{at:1,c:['Ύφασμα στη μύτη και στο στόμα. Χτύπα σωλήνα ή κολόνα: 3 χτυπήματα, παύση, πάλι 3. Καμία φλόγα (γκάζι, σκόνη).','Cloth over nose and mouth. Tap a pipe or column: 3 knocks, pause, 3 again. No flame (gas, dust).'],f:()=>{
 const fl=160;let h=iFloor(fl);
 h+=`<polygon points="0,30 210,62 210,74 0,44" fill="#6b7787" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=`<polygon points="6,${fl} 14,140 30,136 40,${fl}" fill="#5a6574"/><polygon points="150,${fl} 160,146 178,150 186,${fl}" fill="#5a6574"/><polygon points="190,${fl} 196,150 204,${fl}" fill="#5a6574"/>`;
 h+=`<rect x="110" y="60" width="8" height="${fl-60}" fill="#9aa5b1" stroke="${IC.dk}" stroke-width="1"/>`;
 h+=iP({h:[80,120],n:[78,132],p:[70,156],e1:[90,140],a1:[88,126],e2:[92,124],a2:[107,116],k1:[92,142],f1:[110,158],k2:[95,144],f2:[113,158]});
 h+=`<rect x="80" y="121" width="12" height="8" rx="2" fill="${IC.or}"/>`;
 h+=`<circle cx="106" cy="113" r="4" fill="${IC.gr}" stroke="${IC.dk}"/>`;
 [0,1,2].forEach(i=>{h+=`<path d="M${126+i*7},${96-i*4} q${6+i*2},${12+i*4} 0,${24+i*8}" stroke="${IC.yl}" stroke-width="2" fill="none"/>`});
 h+=iT(46,104,L2('ΥΦΑΣΜΑ','CLOTH'),{s:10,c:IC.yl,b:1})+iA(48,108,78,124,IC.yl,2);
 h+=iT(250,100,L2('ΧΤΥΠΑ','KNOCK'),{b:1,s:16,c:IC.yl});
 [196,208,220,262,274,286].forEach(x=>{h+=`<circle cx="${x}" cy="118" r="5" fill="${IC.yl}"/>`});
 h+=iL(234,118,248,118,IC.ln,2)+iT(241,136,L2('παύση','pause'),{s:10});
 h+=iT(208,136,'3×',{s:10,b:1})+iT(274,136,'3×',{s:10,b:1});
 h+=iFire(282,48,1)+`<rect x="276" y="48" width="12" height="14" rx="2" fill="${IC.bl}"/>`+iBan(282,42,17);
 h+=iT(282,74,L2('ΟΧΙ ΦΛΟΓΑ','NO FLAME'),{s:10,b:1});
 return h}}],

evac10:[
{at:-1,c:['Η σειρά: άνθρωποι και παπούτσια → σακίδιο, φάρμακα, έγγραφα → νερό και ζεστά ρούχα → φεύγεις.','The order: people and shoes → go-bag, medicines, documents → water and warm clothes → leave.'],f:()=>{
 let h=iPanels(4);const C=[40,120,200,280],T=['0–1′','1–3′','3–5′','8–10′'];
 C.forEach((cx,i)=>{h+=iNum(cx-22,22,String(i+1))+iT(cx+12,27,T[i],{b:1,s:12,c:IC.yl})+iL(cx-32,140,cx+32,140,IC.gr,2)});
 h+=iMan(30,140,1)+iKid(56,140,1);
 h+=n1_bag(110,140)+n1_pills(138,140);
 h+=n1_bottle(184,140)+n1_jacket(214,140);
 h+=`<rect x="250" y="84" width="28" height="56" fill="${IC.wd}" stroke="${IC.ln}" stroke-width="1.5"/><circle cx="273" cy="114" r="2.5" fill="${IC.yl}"/>`;
 h+=n1_run(290,140,.85)+iA(256,72,306,72,IC.yl,3);
 h+=iT(40,160,L2('ΑΝΘΡΩΠΟΙ','PEOPLE'),{b:1,s:10})+iT(40,172,L2('παπούτσια','shoes'),{s:10});
 h+=iT(120,160,L2('ΣΑΚΙΔΙΟ','GO-BAG'),{b:1,s:10})+iT(120,172,L2('φάρμακα','medicines'),{s:10});
 h+=iT(200,160,L2('ΝΕΡΟ','WATER'),{b:1,s:10})+iT(200,172,L2('ζεστά ρούχα','warm clothes'),{s:10});
 h+=iT(280,160,L2('ΦΥΓΕ','LEAVE'),{b:1,s:10})+iT(280,172,L2('μαζί','together'),{s:10});
 return h}}],

tsunami:[
{at:0,c:['Η θάλασσα τραβιέται ξαφνικά και φαίνεται ο βυθός: ΜΗΝ πας να δεις. Τρέξε αμέσως ψηλά.','The sea suddenly pulls back and the seabed shows: do NOT go to look. Run uphill at once.'],f:()=>{
 const G=x=>x<=190?(x<=90?166-x*8/90:(x<=150?158-(x-90)*12/60:146-(x-150)*8/40)):138-(x-190)*.4;
 let h=iWater(0,96,156)+`<polygon points="0,166 90,158 150,146 190,138 320,86 320,180 0,180" fill="#b89a6a"/>`;
 h+=iL(0,126,220,126,IC.bl,2,1);
 h+=`<ellipse cx="108" cy="${G(108)+1}" rx="7" ry="3" fill="#7d8b99"/><ellipse cx="168" cy="${G(168)+1}" rx="9" ry="3.5" fill="#7d8b99"/><path d="M128,${G(128)-3} q6,-5 12,0 q-6,5 -12,0 l-4,-3 v6 Z" fill="${IC.or}"/>`;
 h+=iT(86,28,L2('Η ΘΑΛΑΣΣΑ ΤΡΑΒΙΕΤΑΙ','SEA PULLS BACK'),{b:1,s:12,c:IC.yl})+iA(150,46,30,46,IC.bl,3);
 h+=iMan(112,G(112),.8)+iNO(112,G(112)-60,9);
 h+=n1_run(256,G(268),1)+iA(282,G(282)-14,312,G(312)-14,IC.yl,3);
 h+=iT(262,30,L2('ΦΥΓΕ ΨΗΛΑ','GO HIGH'),{b:1,s:14,c:IC.yl})+iOK(226,58,10);
 return h}},
{at:1,c:['Πήγαινε σε λόφο. Αν δεν προλαβαίνεις, ανέβα σε γερό κτίριο από μπετό, 3ο όροφο και πάνω. Μείνε ψηλά για ώρες.','Go up a hill. If there is no time, climb a strong concrete building, 3rd floor or higher. Stay high for hours.'],f:()=>{
 let h=iPanels(2);
 h+=`<polygon points="6,172 52,76 100,64 152,172" fill="#4c7a45"/>`+iMan(80,67,.8);
 h+=iWater(6,150,142,172)+iOK(128,40,11)+iT(40,30,L2('ΛΟΦΟΣ','HILL'),{b:1,s:14,c:IC.yl});
 h+=`<rect x="190" y="52" width="60" height="120" fill="#8a96a3" stroke="${IC.ln}" stroke-width="1.5"/>`;
 [76,100,124,148].forEach(y=>{h+=iL(190,y,250,y,IC.ln,1.2)});
 [52,76,100,124,148].forEach(y=>{h+=`<rect x="198" y="${y+7}" width="12" height="11" fill="${IC.dk}"/><rect x="230" y="${y+7}" width="12" height="11" fill="${IC.dk}"/>`});
 h+=`<rect x="190" y="52" width="60" height="48" fill="${IC.yl}" opacity=".25"/>`;
 h+=iMan(245,52,.7);
 h+=iWater(166,310,132,172);
 h+=`<path d="M260,52 h8 v48 h-8" stroke="${IC.yl}" stroke-width="2.5" fill="none"/>`;
 h+=iT(292,78,'3+',{b:1,s:18,c:IC.yl})+iT(292,94,L2('όροφος','floor'),{s:10});
 h+=iOK(292,40,11)+iT(166,30,L2('ΜΠΕΤΟ','CONCRETE'),{b:1,s:11,c:IC.yl,a:'start'});
 return h}}],

housefire:[
{at:0,c:['Ο καπνός μαζεύεται ψηλά. Σκύψε και μπουσούλα προς την έξοδο – ο καθαρός αέρας είναι χαμηλά.','Smoke collects up high. Get down and crawl to the exit – the clean air is low.'],f:()=>{
 const fl=150;let h=iFloor(fl);
 h+=`<rect x="284" y="96" width="26" height="${fl-96}" fill="${IC.wd}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="288" y="84" width="18" height="9" rx="2" fill="${IC.gn}"/>`;
 h+=iMan(70,fl,1);
 h+=iP({h:[236,120],n:[226,126],p:[200,128],e1:[228,138],a1:[230,149],e2:[224,138],a2:[226,149],k1:[198,149],f1:[176,149],k2:[202,149],f2:[180,149]});
 h+=`<rect x="6" y="10" width="308" height="82" fill="${IC.sm}" opacity=".93"/>`;
 for(let x=14;x<314;x+=26)h+=`<circle cx="${x}" cy="92" r="11" fill="${IC.sm}" opacity=".93"/>`;
 h+=iT(160,40,L2('ΚΑΠΝΟΣ','SMOKE'),{b:1,s:14})+iNO(70,62,11);
 h+=iOK(260,122,9)+iT(200,168,L2('ΚΑΘΑΡΟΣ ΑΕΡΑΣ ΧΑΜΗΛΑ','CLEAN AIR IS LOW'),{s:11,c:IC.yl,b:1});
 h+=iA(150,140,170,140,IC.yl,2);
 return h}},
{at:0,c:['Πριν ανοίξεις πόρτα, ακούμπησέ τη με την ανάποδη του χεριού. Αν καίει, ΜΗΝ την ανοίξεις – βρες άλλη έξοδο.','Before opening a door, touch it with the back of your hand. If it is hot, do NOT open it – find another way out.'],f:()=>{
 const fl=150;let h=iPanels(2)+iL(8,fl,152,fl,IC.gr,3)+iL(168,fl,312,fl,IC.gr,3);
 h+=iNum(18,20,'1')+iT(88,25,L2('ΑΝΑΠΟΔΗ ΧΕΡΙΟΥ','BACK OF HAND'),{b:1,s:11,c:IC.yl});
 h+=`<rect x="88" y="48" width="50" height="${fl-48}" fill="${IC.wd}" stroke="${IC.ln}" stroke-width="1.5"/><circle cx="96" cy="100" r="3" fill="${IC.yl}"/>`;
 h+=iP({h:[60,96],n:[60,106],p:[60,128],e1:[55,116],a1:[54,128],e2:[73,100],a2:[85,96],k1:[57,139],f1:[55,fl],k2:[63,139],f2:[65,fl]});
 h+=`<circle cx="86" cy="96" r="8" fill="none" stroke="${IC.yl}" stroke-width="2"/>`;
 h+=iNum(178,20,'2')+iT(246,25,L2('ΚΑΙΕΙ;','HOT?'),{b:1,s:12,c:IC.yl})+iT(246,40,L2('ΜΗΝ ΑΝΟΙΓΕΙΣ','DON’T OPEN'),{b:1,s:12,c:IC.yl});
 h+=`<rect x="214" y="48" width="50" height="${fl-48}" fill="#9c3b22" stroke="${IC.or}" stroke-width="2.5"/><circle cx="222" cy="100" r="3" fill="${IC.yl}"/>`;
 h+=iFire(226,fl,.5)+iFire(240,fl,.6)+iFire(254,fl,.5);
 [196,280,292].forEach(x=>{h+=`<path d="M${x},132 q5,-6 0,-12 t0,-12 t0,-12 t0,-12" stroke="${IC.or}" stroke-width="2" fill="none"/>`});
 h+=iNO(239,88,15);
 return h}},
{at:2,c:['Αν πιάσουν φωτιά τα ρούχα: 1 ΣΤΑΜΑΤΑ (μην τρέχεις) · 2 ΠΕΣΕ κάτω · 3 ΚΥΛΗΣΟΥ με τα χέρια στο πρόσωπο.','If your clothes catch fire: 1 STOP (don’t run) · 2 DROP to the ground · 3 ROLL with hands over your face.'],f:()=>{
 const fl=150;let h=iPanels(3)+iFloor(fl);
 h+=iNum(16,20,'1')+iT(62,25,L2('ΣΤΑΜΑΤΑ','STOP'),{b:1,s:13,c:IC.yl});
 h+=iNum(123,20,'2')+iT(166,25,L2('ΠΕΣΕ','DROP'),{b:1,s:13,c:IC.yl});
 h+=iNum(230,20,'3')+iT(276,25,L2('ΚΥΛΗΣΟΥ','ROLL'),{b:1,s:13,c:IC.yl});
 h+=iMan(53,fl,1)+iFire(46,fl-6,.7)+iFire(60,fl-14,.6);
 h+=iP({h:[172,98],n:[166,108],p:[154,128],e1:[170,120],a1:[176,134],e2:[166,121],a2:[172,135],k1:[160,fl],f1:[138,fl],k2:[156,fl],f2:[134,fl]})+iFire(150,fl-12,.5);
 h+=iA(200,82,200,124,IC.yl,3);
 h+=iP({h:[234,141],n:[246,143],p:[270,143],e1:[242,131],a1:[234,135],e2:[246,132],a2:[238,138],k1:[290,143],f1:[310,143],k2:[290,144],f2:[310,145]});
 h+=`<path d="M246,118 A30,14 0 0 1 300,122" stroke="${IC.yl}" stroke-width="3" fill="none"/>`+iA(298,116,302,128,IC.yl,3);
 h+=`<path d="M300,164 A30,10 0 0 1 246,164" stroke="${IC.yl}" stroke-width="3" fill="none"/>`+iA(250,160,244,166,IC.yl,3);
 return h}}],

wildfire:[
{at:1,c:['Σταμάτα σε σημείο χωρίς βλάστηση, κλείσε παράθυρα, φώτα αναμμένα. Ξάπλωσε στο πάτωμα του αυτοκινήτου κάτω από μάλλινη κουβέρτα.','Stop where there is no vegetation, close the windows, lights on. Lie on the car floor under a wool blanket.'],f:()=>{
 let h=iGround(150)+`<rect x="64" y="150" width="194" height="12" fill="#555f6b"/>`;
 h+=iSmoke(176,26,1.1)+iSmoke(250,46,.9)+iSmoke(150,58,.7,'#4a5867');
 h+=iTree(294,150,.8,'#2f4f2f')+iFire(286,118,1.5)+iFire(302,112,1.2)+iFire(262,150,.9);
 h+=`<polygon points="212,124 252,114 252,140" fill="${IC.yl}" opacity=".45"/>`;
 h+=iCar(160,154,.9);
 h+=`<rect x="8" y="8" width="132" height="66" rx="8" fill="${IC.dk}" stroke="${IC.yl}" stroke-width="1.5"/>`;
 h+=iT(74,24,L2('ΞΑΠΛΩΣΕ + ΚΟΥΒΕΡΤΑ','LIE DOWN + BLANKET'),{s:10,b:1,c:IC.yl});
 h+=iL(16,64,132,64,IC.gr,2);
 h+=iP({h:[24,56],n:[36,58],p:[62,59],k1:[86,59],f1:[110,59]},{w:5,r:6})+`<path d="M30,62 Q30,42 50,42 L112,46 Q124,48 126,62 Z" fill="#b5651d" stroke="${IC.dk}" stroke-width="1.2"/><path d="M40,46 v14 M60,44 v16 M80,45 v15 M100,46 v14" stroke="#8f4e15" stroke-width="1.5"/>`;
  h+=iL(110,74,150,104,IC.yl,1.5,1);
 h+=iT(160,174,L2('ΧΩΡΙΣ ΒΛΑΣΤΗΣΗ','NO VEGETATION'),{s:10,b:1});
 h+=iOK(30,126,10);
 return h}},
{at:2,c:['Μείνε σε γερό σπίτι: ρολά κάτω, πόρτες και παράθυρα κλειστά, νερό σε μπανιέρες και κουβάδες, σε δωμάτιο μακριά από τη φωτιά.','Stay in a strong house: shutters down, doors and windows shut, water in baths and buckets, in a room away from the fire.'],f:()=>{
 const fl=150;let h=iGround(fl);
 h+=iSmoke(240,26,1)+iSmoke(196,40,.7);
 h+=iHouse(60,fl,160,72);
 h+=n1_shutter(76,94,30,30)+n1_shutter(174,94,30,30);
 h+=iMan(126,fl,.85)+`<path d="M146,128 L164,128 L161,${fl} L149,${fl} Z" fill="${IC.gr}"/><rect x="147" y="128" width="16" height="4" fill="${IC.bl}"/>`;
 h+=iTree(270,fl,.7,'#2f4f2f')+iFire(262,118,1.5)+iFire(282,114,1.3)+iFire(300,fl,1.6)+iFire(244,fl,1.1);
 h+=iA(200,86,146,86,IC.yl,2.5);
 h+=iT(140,170,L2('ΡΟΛΑ ΚΛΕΙΣΤΑ · ΝΕΡΟ','SHUTTERS DOWN · WATER'),{b:1,s:10});
 return h}}],

flood:[
{at:0,c:['Νερό που τρέχει: 15 cm ρίχνουν άνθρωπο, 30 cm σηκώνουν αυτοκίνητο, 60 cm το παρασύρουν. Μην περπατάς ή οδηγείς μέσα.','Moving water: 15 cm knocks a person over, 30 cm floats a car, 60 cm sweeps it away. Don’t walk or drive in it.'],f:()=>{
 let h=iPanels(3)+iGround(160);
 h+=iT(53,26,'15 cm',{b:1,s:16,c:IC.yl})+iT(53,42,L2('ρίχνει άνθρωπο','knocks you over'),{s:10});
 h+=iT(160,26,'30 cm',{b:1,s:16,c:IC.yl})+iT(160,42,L2('σηκώνει αμάξι','floats a car'),{s:10});
 h+=iT(267,26,'60 cm',{b:1,s:16,c:IC.yl})+iT(267,42,L2('το παρασύρει','sweeps it away'),{s:10});
 h+=iP({h:[30,104],n:[38,112],p:[54,128],e1:[28,104],a1:[22,94],e2:[48,100],a2:[56,92],k1:[74,128],f1:[84,148],k2:[72,134],f2:[90,150]});
 h+=iWater(6,102,146,160)+iA(14,153,36,153,IC.ln,2)+iA(70,156,96,156,IC.ln,2);
 h+=iCar(160,150,.55,-6);
 h+=iWater(112,208,134,160)+iA(122,130,122,112,IC.yl,2.5)+iA(200,130,200,112,IC.yl,2.5);
 h+=iCar(266,132,.55,14);
 h+=iWater(216,312,118,160)+iA(226,148,256,148,IC.ln,2)+iA(272,152,302,152,IC.ln,2);
 return h}}],

flood_road:[
{at:0,c:['Βλέπεις νερό στον δρόμο; ΓΥΡΝΑ ΠΙΣΩ. Δεν ξέρεις πόσο βαθύ είναι ούτε αν ο δρόμος υπάρχει από κάτω.','Water on the road? TURN AROUND. You can’t tell how deep it is or whether the road is still there.'],f:()=>{
 let h=iGround(140)+`<rect x="0" y="140" width="320" height="18" fill="#555f6b"/>`;
 for(let x=10;x<170;x+=30)h+=`<rect x="${x}" y="148" width="16" height="3" fill="${IC.sn}"/>`;
 h+=`<path d="M200,140 L214,140 L222,158 L196,158 Z" fill="${IC.gd}"/><ellipse cx="262" cy="150" rx="14" ry="4" fill="${IC.dk}"/>`;
 h+=iWater(170,320,126,170);
 h+=iT(262,146,'?',{b:1,s:16,c:IC.yl});
 h+=iCar(90,152,.8);
 h+=`<path d="M128,88 C128,40 52,40 52,82" stroke="${IC.yl}" stroke-width="4" fill="none"/>`+iA(52,80,52,98,IC.yl,4);
 h+=iT(90,26,L2('ΓΥΡΝΑ ΠΙΣΩ','TURN AROUND'),{b:1,s:14,c:IC.yl});
 h+=iNO(244,98,13)+iT(244,70,L2('ΜΗΝ ΠΕΡΝΑΣ','DON’T CROSS'),{b:1,s:11});
 return h}},
{at:2,c:['Αυτοκίνητο στο νερό: 1 λύσε ζώνη · 2 άνοιξε ή σπάσε το ΠΛΑΪΝΟ παράθυρο (στη γωνία) · 3 βγες αμέσως · 4 παιδιά: μεγαλύτερα πρώτα, μικρά μαζί σου.','Car in water: 1 unbuckle · 2 open or break the SIDE window (at the corner) · 3 get out at once · 4 children: older first, small ones with you.'],f:()=>{
 let h=iPanels(4);const C=[40,120,200,280],T=[L2('ΖΩΝΗ','BELT'),L2('ΠΑΡΑΘΥΡΟ','WINDOW'),L2('ΒΓΕΣ','OUT'),L2('ΠΑΙΔΙΑ','CHILDREN')];
 C.forEach((cx,i)=>{h+=iNum(cx,20,String(i+1))+iT(cx,46,T[i],{b:1,s:11,c:IC.yl})});
 // 1 ζώνη
 h+=`<rect x="12" y="76" width="9" height="74" rx="3" fill="${IC.gr}"/><rect x="12" y="142" width="50" height="9" rx="3" fill="${IC.gr}"/>`;
 h+=iP({h:[34,92],n:[30,104],p:[28,136],k1:[52,134],f1:[54,162],e1:[40,116],a1:[48,130]});
 h+=iL(24,104,46,134,IC.rd,4)+`<rect x="42" y="131" width="9" height="6" fill="${IC.sn}"/>`+iA(54,128,70,112,IC.yl,2.5);
 // 2 παράθυρο
 const win=(x)=>`<rect x="${x}" y="98" width="64" height="62" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=win(88)+`<polygon points="94,98 104,68 146,68 146,98" fill="#9cc3d6" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=`<path d="M140,92 l-10,-6 M140,92 l-4,-12 M140,92 l-12,2" stroke="${IC.ln}" stroke-width="1.3"/>`;
 h+=iL(156,118,144,98,IC.wd,4)+`<rect x="138" y="88" width="14" height="8" rx="1" transform="rotate(-58 145 92)" fill="${IC.rd}"/>`;
 h+=`<circle cx="140" cy="92" r="9" fill="none" stroke="${IC.yl}" stroke-width="2"/>`;
 h+=iWater(80,160,128,172);
 // 3 βγες
 h+=iP({h:[222,60],n:[214,70],p:[200,94],e1:[226,78],a1:[236,86],e2:[222,80],a2:[232,90]});
 h+=win(168)+`<polygon points="174,98 184,68 226,68 226,98" fill="none" stroke="${IC.dk}" stroke-width="2"/>`;
 h+=iWater(160,240,128,172)+iA(226,58,236,48,IC.yl,2.5);
 // 4 παιδιά
 h+=iL(244,150,316,150,IC.gr,2);
 h+=iKid(258,150,1.1)+iT(258,88,'1',{b:1,s:12,c:IC.yl});
 h+=iP({h:[294,96],n:[294,106],p:[294,128],e1:[284,114],a1:[284,122],e2:[302,116],a2:[306,124],k1:[290,139],f1:[288,150],k2:[298,139],f2:[300,150]});
 h+=iP({h:[282,112],n:[282,118],p:[284,130],k1:[290,134],f1:[290,140]},{w:3.5,r:5,c:IC.sn});
 h+=iT(294,82,'2',{b:1,s:12,c:IC.yl});
 return h}}],

heat:[
{at:1,c:['Θερμοπληξία: κάλεσε 166/112, βάλ’ τον στη σκιά, βρέξε όλο το σώμα και κάνε αέρα, πάγος σε λαιμό, μασχάλες, βουβώνες.','Heat stroke: call 166/112, move them to shade, wet the whole body and fan, ice on neck, armpits and groin.'],f:()=>{
 const fl=150;let h=iFloor(fl)+n1_sun(292,26,11);
 h+=`<ellipse cx="140" cy="${fl+2}" rx="92" ry="5" fill="#0d1a28"/>`;
 h+=iL(150,58,150,fl,IC.gr,3)+`<path d="M60,66 Q150,14 240,66 Z" fill="${IC.or}"/>`;
 h+=iT(150,56,L2('ΣΚΙΑ','SHADE'),{b:1,s:12,c:'#000'});
 h+=iP({h:[60,140],n:[72,144],p:[100,144],e1:[84,147],a1:[96,147],k1:[122,144],f1:[146,144],k2:[122,145],f2:[146,146]},{c:'#6f8196'});
 h+=iP({h:[160,94],n:[166,104],p:[174,128],e1:[156,110],a1:[144,112],e2:[160,114],a2:[150,118],k1:[176,149],f1:[198,149],k2:[180,149],f2:[202,149]});
 h+=`<rect x="134" y="104" width="10" height="20" rx="2" transform="rotate(-60 139 114)" fill="${IC.bl}" stroke="${IC.ln}" stroke-width="1"/>`;
 [[124,122],[118,130],[128,132],[112,124]].forEach(([x,y])=>{h+=`<path d="M${x},${y} q-2,4 0,5 q2,-1 0,-5 Z" fill="#8ec5ff" stroke="#8ec5ff" stroke-width="1.5"/>`});
 const ice=[[71,134],[82,134],[100,134]];
 ice.forEach(([x,y])=>{h+=`<rect x="${x-4}" y="${y-4}" width="8" height="8" rx="1.5" fill="#d8f0ff" stroke="${IC.bl}" stroke-width="1"/>`;h+=iL(36,112,x,y-5,'#bfe3ff',1)});
 h+=iT(30,106,L2('ΠΑΓΟΣ','ICE'),{b:1,s:11,c:'#bfe3ff'});
 h+=iT(112,90,L2('ΝΕΡΟ','WATER'),{b:1,s:10,c:'#8ec5ff'});
 h+=iPhone(276,116,.85,'166');
 return h}}],

heat_nopower:[
{at:0,c:['ΜΕΡΑ: παντζούρια και κουρτίνες κλειστά, να μην μπαίνει ήλιος. ΝΥΧΤΑ: άνοιξε παράθυρα σε αντίθετες πλευρές για ρεύμα αέρα.','DAY: shutters and curtains closed, keep the sun out. NIGHT: open windows on opposite sides for a cross-breeze.'],f:()=>{
 let h=`<rect x="160" y="0" width="160" height="180" fill="#0d1a28"/>`+iPanels(2);
 h+=`<rect x="6" y="150" width="148" height="24" fill="${IC.gd}"/><rect x="166" y="150" width="148" height="24" fill="${IC.gd}"/>`;
 h+=n1_sun(24,30,10);
 h+=iHouse(40,150,90,64)+n1_shutter(40,98,10,26)+n1_shutter(120,98,10,26)+iA(24,52,36,100,IC.yl,2.5);
 h+=iT(85,168,L2('ΜΕΡΑ: ΚΛΕΙΣΤΑ','DAY: CLOSED'),{b:1,s:11,c:IC.yl})+iOK(146,30,10);
 h+=n1_moon(296,28,11,'#0d1a28');
 h+=iHouse(196,150,90,64)+`<rect x="194" y="98" width="6" height="26" fill="#0d1a28"/><rect x="282" y="98" width="6" height="26" fill="#0d1a28"/>`;
 h+=iA(170,104,312,104,'#8ec5ff',2.5)+iA(170,118,312,118,'#8ec5ff',2.5);
 h+=iT(240,168,L2('ΝΥΧΤΑ: ΑΝΟΙΧΤΑ','NIGHT: OPEN'),{b:1,s:11,c:IC.yl});
 return h}}],

cold:[
{at:0,c:['Όλοι μαζί σε ΕΝΑ μικρό δωμάτιο, ρούχα σε στρώσεις και σκούφο, κουβέρτες. ΠΟΤΕ μαγκάλι, ψησταριά ή γεννήτρια μέσα – το CO σκοτώνει.','Everyone together in ONE small room, layers and a hat, blankets. NEVER a brazier, barbecue or generator indoors – CO kills.'],f:()=>{
 let h=iL(200,8,200,172,IC.sk,2);
 h+=`<rect x="14" y="34" width="176" height="116" fill="#1d3550" stroke="${IC.ln}" stroke-width="2"/>`;
 h+=`<rect x="26" y="52" width="34" height="38" fill="#9cc3d6"/><rect x="24" y="48" width="38" height="46" rx="2" fill="#8b5e3c" opacity=".92"/><path d="M34,50 v42 M44,50 v42 M54,50 v42" stroke="#6e4a2e" stroke-width="1.5"/>`;
 h+=`<rect x="160" y="80" width="26" height="70" fill="${IC.wd}" stroke="${IC.ln}" stroke-width="1.2"/><rect x="156" y="144" width="32" height="6" rx="2" fill="${IC.sn}"/>`;
 [[86,104,9,IC.rd],[112,100,9,IC.bl],[134,112,7,IC.yl]].forEach(([x,y,r,c])=>{h+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.ln}"/>`+n1_hat(x,y,r,c)});
 h+=`<path d="M68,150 Q70,114 92,112 L138,112 Q152,114 154,150 Z" fill="#7b5ea7" stroke="${IC.dk}" stroke-width="1.2"/><path d="M90,116 v32 M112,114 v34 M134,116 v32" stroke="#62498a" stroke-width="1.5"/>`;
 h+=iT(102,24,L2('ΕΝΑ ΜΙΚΡΟ ΔΩΜΑΤΙΟ','ONE SMALL ROOM'),{b:1,s:12,c:IC.yl})+iOK(176,52,10);
 h+=iL(206,138,314,138,IC.gr,2);
 h+=iL(222,122,216,138,'#444',2.5)+iL(242,122,248,138,'#444',2.5)+`<path d="M212,108 L252,108 L244,124 L220,124 Z" fill="#555"/>`;
 h+=`<circle cx="222" cy="107" r="3" fill="${IC.rd}"/><circle cx="232" cy="106" r="3" fill="${IC.or}"/><circle cx="242" cy="107" r="3" fill="${IC.rd}"/>`+iFire(232,104,.6);
 h+=`<rect x="268" y="104" width="38" height="30" rx="3" fill="${IC.yl}" stroke="${IC.dk}" stroke-width="1.5"/><rect x="274" y="112" width="16" height="14" fill="#555"/><path d="M266,138 V100 H308 V138" stroke="${IC.dk}" stroke-width="2" fill="none"/>`;
 h+=iBan(232,114,24)+iBan(287,118,24);
 h+=iT(260,44,'CO',{b:1,s:20,c:IC.rd})+iT(260,62,L2('μονοξείδιο','carbon monoxide'),{s:10});
 h+=iT(260,160,L2('ΟΧΙ ΜΕΣΑ','NEVER INDOORS'),{b:1,s:11,c:IC.yl});
 return h}}],
});
