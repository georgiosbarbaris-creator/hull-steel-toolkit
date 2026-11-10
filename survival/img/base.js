Object.assign(SIMG,{
quake:[{at:0,c:['1 Σκύψε στα γόνατα · 2 Κάλυψε κεφάλι και λαιμό κάτω από γερό τραπέζι · 3 Κρατήσου από το πόδι του τραπεζιού μέχρι να σταματήσει.','1 Drop to your knees · 2 Cover head and neck under a strong table · 3 Hold on to the table leg until it stops.'],f:()=>{
 const fl=150;let h=iPanels(3)+iFloor(fl);
 // ζιγκ-ζαγκ σεισμού
 [[8,40],[115,150],[222,260]].forEach(([a,b])=>{h+=`<path d="M${a},${fl+10} l6,-6 l6,6 l6,-6 l6,6 l6,-6" stroke="${IC.or}" stroke-width="2" fill="none"/>`});
 h+=iNum(18,20,'1')+iT(62,25,L2('ΣΚΥΨΕ','DROP'),{b:1,s:14,c:IC.yl});
 h+=iNum(125,20,'2')+iT(170,25,L2('ΚΑΛΥΨΕ','COVER'),{b:1,s:14,c:IC.yl});
 h+=iNum(230,20,'3')+iT(280,25,L2('ΚΡΑΤΗΣΟΥ','HOLD ON'),{b:1,s:13,c:IC.yl});
 h+=iP({h:[62,84],n:[58,97],p:[52,124],e1:[62,110],a1:[70,124],e2:[56,111],a2:[64,126],k1:[66,fl],f1:[38,fl],k2:[70,fl-2],f2:[42,fl-2]});
 h+=iTable(122,fl,82,52)+iP({h:[146,124],n:[156,118],p:[182,124],e1:[150,108],a1:[143,116],e2:[160,108],a2:[150,114],k1:[170,fl],f1:[194,fl],k2:[174,fl-1],f2:[198,fl-1]});
 h+=iTable(222,fl,82,52)+iP({h:[248,124],n:[258,118],p:[284,124],e1:[244,124],a1:[230,124],e2:[262,108],a2:[252,114],k1:[272,fl],f1:[296,fl],k2:[276,fl-1],f2:[300,fl-1]});
 return h}}],
});
Object.assign(SIMG,{
cpr:[{at:-1,c:['Βάση της παλάμης στο ΚΕΝΤΡΟ του στήθους, το άλλο χέρι από πάνω, χέρια ίσια, ώμοι ακριβώς από πάνω. Πίεσε 5–6 cm, 100–120 φορές το λεπτό.','Heel of the hand in the CENTRE of the chest, other hand on top, arms straight, shoulders right above. Push 5–6 cm, 100–120 times a minute.'],f:()=>{
 const fl=152;let h=iFloor(fl);
 h+=iP({h:[118,62],n:[110,76],p:[150,100],e1:[108,100],a1:[106,128],e2:[112,100],a2:[108,128],k1:[148,138],f1:[180,138],k2:[152,140],f2:[184,140]},{});
 h+=iP({h:[52,142],n:[68,143],p:[150,144],e1:[90,150],a1:[112,150],e2:[84,150],a2:[104,150],k1:[190,144],f1:[236,146],k2:[192,146],f2:[238,148]},{c:'#6f8196'});
 h+=`<rect x="96" y="128" width="22" height="7" rx="3" fill="${IC.or}"/>`;
 h+=iA(78,96,78,128,IC.yl)+iT(62,92,'5–6 cm',{b:1,s:13,c:IC.yl,a:'middle'});
 h+=iT(250,40,'100–120',{b:1,s:22,c:IC.rd})+iT(250,58,L2('φορές / λεπτό','per minute'),{s:12})+`<path d="M222,74 h16 l6,-10 l8,20 l6,-10 h22" stroke="${IC.rd}" stroke-width="3" fill="none"/>`;
 return h}}],
recovery:[{at:-1,c:['Στο πλάι, το επάνω γόνατο λυγισμένο μπροστά για στήριγμα, το χέρι κάτω από το μάγουλο, το κεφάλι λίγο πίσω και το στόμα προς τα κάτω.','On the side, top knee bent forward for support, hand under the cheek, head tilted back and mouth facing down.'],f:()=>{
 const fl=150;let h=iFloor(fl);
 h+=iP({h:[78,130],n:[96,134],p:[176,136],e1:[100,118],a1:[80,140],e2:[84,148],a2:[58,148],k1:[204,112],f1:[228,140],k2:[214,142],f2:[256,146]});
 h+=iA(64,104,72,124,IC.yl)+iT(60,98,L2('αεραγωγός ανοιχτός','airway open'),{s:11,c:IC.yl});
 h+=iA(232,92,210,108,IC.yl)+iT(250,86,L2('γόνατο μπροστά','knee forward'),{s:11,c:IC.yl});
 h+=iOK(290,30,12);
 return h}}],
});
