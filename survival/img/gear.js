/* Επιβίωση 72+ – σχέδια κατηγορίας «Εξοπλισμός» (gear) – Created by George Barbaris */
const gear_drop=(x,y,s,c)=>`<path transform="translate(${x},${y}) scale(${s||1})" d="M0,-9 C4,-4 6,-1 6,2 A6,6 0 0 1 -6,2 C-6,-1 -4,-4 0,-9 Z" fill="${c||IC.bl}"/>`;
const gear_blanket=(x,y,w,h,c,st)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${c}" stroke="${IC.dk}" stroke-width="1.5"/>`+iL(x+3,y+h/2,x+w-3,y+h/2,IC.dk,1.2)+(st?iL(x+8,y+3,x+8,y+h-3,st,3)+iL(x+w-8,y+3,x+w-8,y+h-3,st,3):'');
const gear_sun=(x,y,r)=>{let h=`<circle cx="${x}" cy="${y}" r="${r}" fill="${IC.yl}"/>`;for(let i=0;i<8;i++){const a=i*Math.PI/4;h+=iL(x+Math.cos(a)*(r+4),y+Math.sin(a)*(r+4),x+Math.cos(a)*(r+9),y+Math.sin(a)*(r+9),IC.yl,2.5)}return h};
/* υπνόσακος ξαπλωμένος: κουκούλα στο (x,y), μήκος len, closed=κεφάλι μέσα */
const gear_bag=(x,y,len,c,closed,inner)=>{let h=`<path d="M${x},${y-14} Q${x+len*0.45},${y-18} ${x+len-8},${y-6} Q${x+len},${y} ${x+len-6},${y+13} L${x},${y+13} Z" fill="${c}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 for(let i=1;i<5;i++){const xx=x+i*len/5.2;h+=iL(xx,y-12+i*1.2,xx,y+11,IC.dk,1)}
 h+=`<circle cx="${x}" cy="${y}" r="15" fill="${c}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 if(inner)h+=`<circle cx="${x}" cy="${y}" r="11" fill="${inner}"/>`;
 h+=closed?`<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="${IC.dk}" stroke-width="1"/>`:`<circle cx="${x}" cy="${y}" r="9" fill="${IC.dk}"/><circle cx="${x-1}" cy="${y}" r="7" fill="${IC.sk2}"/>`;
 return h};
const gear_panel=(x1,y1,x2,y2,w)=>iL(x1,y1,x2,y2,'#1f4f9a',w||8)+iL(x1,y1,x2,y2,'#6fa8ff',1);
const gear_bat=(x,y,w,h,lv)=>{let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#3a4656" stroke="${IC.ln}" stroke-width="1.5"/><rect x="${x+w}" y="${y+h/2-4}" width="4" height="8" fill="${IC.ln}"/>`;const n=lv==null?3:lv;for(let i=0;i<n;i++)s+=`<rect x="${x+4+i*(w-8)/4}" y="${y+4}" width="${(w-8)/4-2}" height="${h-8}" fill="${IC.gn}"/>`;return s};
const gear_bulb=(x,y)=>`<circle cx="${x}" cy="${y}" r="16" fill="${IC.yl}" opacity=".25"/><circle cx="${x}" cy="${y}" r="8" fill="${IC.yl}"/><rect x="${x-4}" y="${y+7}" width="8" height="6" fill="${IC.gr}"/>`;
const gear_stove=(x,y)=>`<rect x="${x-8}" y="${y-14}" width="16" height="14" rx="3" fill="${IC.rd}"/><rect x="${x-6}" y="${y-18}" width="12" height="4" fill="${IC.gr}"/>`+iL(x-6,y-18,x-13,y-24,IC.gr,1.5)+iL(x+6,y-18,x+13,y-24,IC.gr,1.5)+iFire(x,y-18,.3)+`<rect x="${x-15}" y="${y-37}" width="30" height="13" rx="2" fill="${IC.gr}"/><rect x="${x-16}" y="${y-40}" width="32" height="3" fill="${IC.sm}"/><rect x="${x-3}" y="${y-43}" width="6" height="3" fill="${IC.sm}"/>`;
const gear_pot=(x,y,lid)=>`<rect x="${x-20}" y="${y-22}" width="40" height="22" rx="3" fill="${IC.gr}"/>`+iL(x-24,y-18,x-20,y-18,IC.gr,3)+iL(x+20,y-18,x+24,y-18,IC.gr,3)+(lid?`<rect x="${x-22}" y="${y-26}" width="44" height="4" rx="2" fill="${IC.sm}"/><rect x="${x-4}" y="${y-30}" width="8" height="4" fill="${IC.sm}"/>`:'')+iFire(x-8,y+16,.55)+iFire(x+8,y+16,.55);
const gear_shirt=(x,y,c,hood)=>(hood?`<path d="M${x-13},${y+2} Q${x},${y-20} ${x+13},${y+2} Z" fill="${c}" stroke="${IC.dk}" stroke-width="1.5"/>`:'')+`<path d="M${x-11},${y} L${x-24},${y+6} L${x-32},${y+42} L${x-24},${y+44} L${x-18},${y+18} L${x-18},${y+54} L${x+18},${y+54} L${x+18},${y+18} L${x+24},${y+44} L${x+32},${y+42} L${x+24},${y+6} L${x+11},${y} Q${x},${y+8} ${x-11},${y} Z" fill="${c}" stroke="${IC.dk}" stroke-width="1.5"/>`;
const gear_can=(x,y,d)=>`<rect x="${x-14}" y="${y-40}" width="28" height="40" rx="3" fill="${IC.gr}" stroke="${IC.dk}" stroke-width="1.2"/><rect x="${x-14}" y="${y-28}" width="28" height="15" fill="${IC.sn}"/>`+iT(x,y-17,d,{s:9,c:'#000',b:1});

Object.assign(SIMG,{
g_sleep:[
{at:1,c:['Μάλλινη κουβέρτα: ζεσταίνει και βρεγμένη. Fleece: λιώνει στη φωτιά. Βαμβακερή: βρεγμένη δεν ζεσταίνει. Κουβέρτα αλουμινίου: μόνο για έκτακτη ανάγκη.','Wool blanket: warm even when wet. Fleece: melts in fire. Cotton: no warmth when wet. Foil blanket: emergencies only.'],f:()=>{
 let h=iPanels(4);const C=[40,120,200,280];
 const nm=[L2('Μάλλινη','Wool'),'Fleece',L2('Βαμβακερή','Cotton'),L2('Αλουμινίου','Foil')];
 const col=['#9b3b2e',IC.bl,'#d9d4c7','#c9ced6'],st=['#f2e3c0',null,'#9cc3d6',IC.yl];
 C.forEach((x,i)=>{h+=iT(x,26,nm[i],{b:1,s:12});h+=gear_blanket(x-30,40,60,22,col[i],st[i])+gear_blanket(x-30,62,60,22,col[i],st[i])});
 h+=`<path d="M255,50 l8,8 l10,-6 l8,10 M258,72 l10,-4 l9,8" stroke="#8a919c" stroke-width="1.2" fill="none"/>`;
 h+=gear_drop(C[0]-12,116,1.4)+iOK(C[0]+14,112,11);
 h+=iFire(C[1]-12,124,.9)+iNO(C[1]+14,112,11);
 h+=gear_drop(C[2]-12,116,1.4)+iNO(C[2]+14,112,11);
 h+=iT(C[3],118,'60 g',{b:1,s:15,c:IC.yl});
 const l1=[L2('ζεσταίνει','warm'),L2('λιώνει','melts'),L2('βρεγμένη','wet ='),L2('μόνο για','emergency')],l2=[L2('και βρεγμένη','even wet'),L2('στη φωτιά','in fire'),L2('= κρύο','cold'),L2('έκτακτη ανάγκη','only')];
 C.forEach((x,i)=>{h+=iT(x,150,l1[i],{s:10})+iT(x,164,l2[i],{s:10})});
 return h}},
{at:2,c:['Κοίτα τη θερμοκρασία COMFORT: εκεί κοιμάσαι άνετα. Το LIMIT σημαίνει «αντέχεις αλλά κρυώνεις». Το EXTREME αγνόησέ το.','Look at the COMFORT temperature: you sleep well at it. LIMIT means "you survive but you are cold". Ignore EXTREME.'],f:()=>{
 let h=`<defs><linearGradient id="gsl_t" x1="0" x2="1"><stop offset="0" stop-color="${IC.or}"/><stop offset=".45" stop-color="${IC.yl}"/><stop offset="1" stop-color="#3a86ff"/></linearGradient></defs>`;
 h+=`<rect x="20" y="72" width="280" height="16" rx="8" fill="url(#gsl_t)"/>`;
 h+=iT(28,104,L2('ζέστη','warm'),{s:10,a:'start',c:IC.or})+iT(292,104,L2('κρύο','cold'),{s:10,a:'end',c:'#9cc3ff'});
 const M=[[95,'COMFORT',IC.gn],[175,'LIMIT',IC.yl],[255,'EXTREME',IC.rd]];
 M.forEach(([x,t,c])=>{h+=`<polygon points="${x-7},58 ${x+7},58 ${x},70" fill="${c}"/>`+iT(x,48,t,{b:1,s:12,c})+iL(x,70,x,90,IC.dk,2)});
 h+=iOK(95,124,12)+iT(95,152,L2('κοιμάσαι','you sleep'),{s:10})+iT(95,165,L2('άνετα','well'),{s:10});
 h+=`<g transform="translate(175,124)">${iL(-8,-8,8,8,'#9cc3ff',2)+iL(-8,8,8,-8,'#9cc3ff',2)+iL(0,-11,0,11,'#9cc3ff',2)+iL(-11,0,11,0,'#9cc3ff',2)}</g>`+iT(175,152,L2('αντέχεις','you survive'),{s:10})+iT(175,165,L2('με κρύο','but cold'),{s:10});
 h+=iNO(255,124,12)+iT(255,152,L2('αγνόησέ το','ignore it'),{s:10});
 return h}},
{at:3,c:['Μύτη και στόμα ΕΞΩ από τον υπνόσακο, κουκούλα σφιχτά γύρω από το πρόσωπο, υπόστρωμα από κάτω. Η ανάσα μέσα βρέχει τη γέμιση και κρυώνεις.','Nose and mouth OUTSIDE the sleeping bag, hood tight around the face, a pad underneath. Breathing inside wets the filling and you get cold.'],f:()=>{
 let h=iPanels(2);
 [0,160].forEach((o,i)=>{h+=iL(o+8,140,o+152,140,IC.gr,3)+`<rect x="${o+20}" y="131" width="128" height="8" rx="3" fill="${IC.yl}"/>`+gear_bag(o+42,118,104,IC.or,i===1)});
 h+=`<g fill="${IC.gr}" opacity=".8"><circle cx="20" cy="110" r="4"/><circle cx="13" cy="101" r="5"/><circle cx="19" cy="92" r="4"/></g>`;
 h+=iT(80,26,L2('Πρόσωπο έξω','Face out'),{b:1,s:13,c:IC.yl})+iOK(80,58,13);
 h+=iT(80,160,L2('υπόστρωμα R 4+','pad R 4+'),{s:10,c:IC.yl});
 h+=iT(240,26,L2('Κεφάλι μέσα','Head inside'),{b:1,s:13,c:IC.yl})+iNO(240,58,13);
 [[214,112],[232,120],[252,108],[272,118]].forEach(([x,y])=>{h+=gear_drop(x,y,.9)});
 h+=iT(240,160,L2('υγρασία = κρύο','damp = cold'),{s:10,c:'#9cc3ff'});
 return h}}],

g_swag:[
{at:-1,c:['SWAG: αδιάβροχο πανί με στρώμα αφρού και μικρό τόξο πάνω από το κεφάλι, ανοίγει σε 1 λεπτό. BIVY: αδιάβροχος σάκος πάνω από τον υπνόσακο, κόβει τον αέρα (+3–5 °C).','SWAG: waterproof canvas with a foam mattress and a small hoop over the head, opens in 1 minute. BIVY: a waterproof bag over the sleeping bag, blocks the wind (+3–5 °C).'],f:()=>{
 let h=iPanels(2)+iL(8,150,152,150,IC.gr,3)+iL(168,150,312,150,IC.gr,3);
 h+=`<rect x="14" y="136" width="134" height="12" rx="3" fill="${IC.yl}"/>`;
 h+=`<path d="M12,136 L12,116 Q12,92 38,92 Q64,92 68,118 L144,124 Q150,128 148,136 Z" fill="#4f6f3c" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=`<ellipse cx="38" cy="116" rx="17" ry="13" fill="${IC.dk}" opacity=".75"/>`+`<circle cx="36" cy="122" r="7" fill="${IC.sk2}"/>`;
 h+=`<path d="M14,118 Q14,88 38,86 Q64,88 66,118" stroke="${IC.ln}" stroke-width="2" fill="none"/>`;
 h+=iT(80,28,'SWAG',{b:1,s:15,c:IC.yl})+iClock(122,58,10)+iT(122,82,L2('1 λεπτό','1 minute'),{s:10});
 h+=iT(80,168,L2('στρώμα αφρού','foam mattress'),{s:10,c:IC.yl});
 h+=gear_bag(192,128,108,'#55705a',false,IC.or)+`<path d="M178,128 Q178,104 196,104 Q212,106 214,124" stroke="${IC.ln}" stroke-width="2" fill="none"/>`;
 h+=iT(240,28,'BIVY',{b:1,s:15,c:IC.yl})+iT(240,56,'+3–5 °C',{b:1,s:14,c:IC.or});
 h+=iA(306,76,284,100,IC.gr,2.5)+iA(306,94,290,110,IC.gr,2.5);
 h+=iT(240,168,L2('πάνω από τον σάκο','over the bag'),{s:10,c:IC.yl});
 return h}},
{at:0,c:['Όλα μαζί στο κρύο (όπως φαίνεται από τη μεριά του κεφαλιού): ασημοκουβέρτα και υπόστρωμα κάτω, υπνόσακος με liner, bivy ή swag απέξω, σκούφος και πρόσωπο έξω.','All together in the cold (seen from the head end): foil blanket and pad underneath, sleeping bag with liner, bivy or swag outside, beanie and face out.'],f:()=>{
 let h=iGround(150);
 h+=`<rect x="12" y="146" width="146" height="4" fill="#c9ced6"/><rect x="12" y="134" width="146" height="12" rx="3" fill="${IC.yl}"/>`;
 h+=`<ellipse cx="85" cy="97" rx="66" ry="37" fill="#55705a" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=`<ellipse cx="85" cy="101" rx="51" ry="29" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=`<ellipse cx="85" cy="105" rx="37" ry="22" fill="#e9d8a6"/>`;
 h+=`<circle cx="85" cy="108" r="14" fill="${IC.sk2}"/><path d="M70,106 A15,15 0 0 1 100,106 Z" fill="${IC.rd}"/><circle cx="85" cy="90" r="4" fill="${IC.rd}"/>`;
 h+=iT(85,40,'−15 °C',{b:1,s:14,c:'#9cc3ff'});
 const R=[[1,IC.yl,L2('Υπόστρωμα','Pad')],[2,IC.or,L2('Υπνόσακος','Sleeping bag')],[3,'#e9d8a6','Liner'],[4,'#55705a','Bivy / swag'],[5,'#c9ced6',L2('Αλουμίνιο','Foil blanket')],[6,IC.rd,L2('Σκούφος','Beanie')]];
 R.forEach(([n,c,t],i)=>{const y=22+i*22;h+=iNum(186,y,n)+`<rect x="202" y="${y-6}" width="14" height="12" rx="2" fill="${c}" stroke="${IC.dk}"/>`+iT(222,y+4,t,{s:11,a:'start'})});
 return h}}],

g_tent:[
{at:-1,c:['Στήνεις σε ψηλότερο σημείο από το νερό. ΠΟΤΕ σε ξερό ρέμα (πλημμύρα) και ΠΟΤΕ κάτω από ξερό κλαδί.','Pitch higher than the water. NEVER in a dry stream bed (flood) and NEVER under a dead branch.'],f:()=>{
 let h=`<path d="M0,110 L95,110 Q112,112 122,148 L182,150 Q192,140 206,138 L320,138 L320,180 L0,180 Z" fill="${IC.gd}"/>`;
 h+=`<g fill="${IC.sm}"><ellipse cx="138" cy="150" rx="5" ry="3"/><ellipse cx="160" cy="151" rx="6" ry="3"/><ellipse cx="174" cy="150" rx="4" ry="2.5"/></g>`;
 h+=iL(118,132,192,132,IC.bl,2.5,1)+iA(126,124,180,124,IC.bl,2);
 h+=iTent(52,110,.8)+iOK(52,62,12)+iT(52,132,L2('ψηλά','high ground'),{s:10,b:1});
 h+=iTent(152,149,.7)+iNO(152,98,12)+iT(152,172,L2('ξερό ρέμα','dry stream bed'),{s:10,b:1});
 h+=iTree(272,138,1.1);
 h+=`<path d="M270,100 L246,94 L226,92 M246,94 L238,82 M232,92 L222,84" stroke="#9a8a78" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
 h+=iTent(232,138,.7)+iNO(300,112,12)+iT(255,160,L2('ξερό κλαδί','dead branch'),{s:10,b:1});
 return h}},
{at:1,c:['Tarp (μουσαμάς) 3×3 m: σχοινί ανάμεσα σε δύο δέντρα, το πανί από πάνω και οι άκρες στερεωμένες με πασσαλάκια.','Tarp 3×3 m: a rope between two trees, the sheet over it and the edges fixed with pegs.'],f:()=>{
 let h=iGround(150)+iTree(40,150,1.6)+iTree(280,150,1.6);
 h+=iL(46,104,274,104,IC.sn,2);
 h+=`<polygon points="160,104 96,150 224,150" fill="#3f7cc4" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=iL(96,150,92,158,IC.ln,3)+iL(224,150,228,158,IC.ln,3);
 h+=iT(160,140,'3×3 m',{b:1,s:12,c:'#fff'});
 h+=iT(160,72,L2('σχοινί','rope'),{s:11,b:1,c:IC.yl})+iA(160,78,160,100,IC.yl,2);
 h+=iT(160,175,L2('πασσαλάκια','pegs'),{s:11,b:1,c:IC.yl})+iA(122,171,100,159,IC.yl,2)+iA(198,171,220,159,IC.yl,2);
 return h}}],

g_light:[
{at:-1,c:['Φακός κεφαλής για κάθε μέλος: φως εκεί που κοιτάς και ελεύθερα χέρια. Φανάρι LED για το τραπέζι, γερός φακός χειρός με μπαταρίες AA/AAA.','A headlamp for each member: light where you look and hands free. An LED lantern for the table, a sturdy hand torch with AA/AAA batteries.'],f:()=>{
 let h=iFloor(150);
 h+=`<polygon points="66,93 84,150 128,150" fill="${IC.yl}" opacity=".3"/>`;
 h+=iP({h:[60,96],n:[60,107],p:[60,129],e1:[68,116],a1:[80,122],e2:[70,119],a2:[82,125],k1:[56,140],f1:[54,150],k2:[64,140],f2:[66,150]});
 h+=`<rect x="64" y="91" width="6" height="5" fill="${IC.yl}"/>`+iL(53,92,66,92,IC.dk,2);
 h+=`<rect x="76" y="114" width="20" height="14" rx="2" fill="${IC.wd}"/>`;
 h+=iT(60,26,L2('Φακός κεφαλής','Headlamp'),{b:1,s:11,c:IC.yl})+iT(60,40,L2('ελεύθερα χέρια','hands free'),{s:10});
 h+=iTable(150,150,50,34)+`<circle cx="175" cy="102" r="26" fill="${IC.yl}" opacity=".2"/><rect x="166" y="90" width="18" height="26" rx="3" fill="${IC.yl}" stroke="${IC.dk}" stroke-width="1.5"/><path d="M168,90 Q175,78 182,90" stroke="${IC.ln}" stroke-width="2" fill="none"/>`;
 h+=iT(175,26,L2('Φανάρι LED','LED lantern'),{b:1,s:11,c:IC.yl});
 h+=`<rect x="236" y="96" width="34" height="12" rx="3" fill="${IC.sm}" stroke="${IC.ln}" stroke-width="1.2"/><path d="M270,93 L282,90 L282,114 L270,111 Z" fill="${IC.gr}" stroke="${IC.ln}" stroke-width="1.2"/><polygon points="282,92 312,80 312,124 282,112" fill="${IC.yl}" opacity=".3"/>`;
 [248,264].forEach(x=>{h+=`<rect x="${x}" y="122" width="10" height="26" rx="2" fill="${IC.or}"/><rect x="${x+3}" y="119" width="4" height="3" fill="${IC.ln}"/>`});
 h+=iT(286,140,'AA',{b:1,s:12,a:'start'});
 h+=iT(272,26,L2('Φακός χειρός','Hand torch'),{b:1,s:11,c:IC.yl});
 return h}},
{at:1,c:['Κερί μόνο σε σταθερή βάση, μακριά από κουρτίνες, ποτέ στον ύπνο. Καλύτερα: δέσε τον φακό κεφαλής σε μπουκάλι νερό με το φως προς το μπουκάλι = φανάρι για όλο το δωμάτιο.','A candle only on a stable base, away from curtains, never while sleeping. Better: strap a headlamp onto a water bottle with the light facing the bottle = a lantern for the whole room.'],f:()=>{
 let h=iPanels(2)+iL(8,150,152,150,IC.gr,3)+iL(168,150,312,150,IC.gr,3);
 h+=`<path d="M92,30 Q100,60 92,90 Q100,120 92,150 L120,150 Q128,120 120,90 Q128,60 120,30 Z" fill="#8e3b6e"/>`;
 h+=`<rect x="56" y="112" width="12" height="38" fill="${IC.sn}"/>`+iFire(62,112,.7);
 h+=iBan(70,112,36)+iT(106,24,L2('κουρτίνα','curtain'),{s:10});
 h+=`<circle cx="240" cy="100" r="50" fill="${IC.yl}" opacity=".18"/><circle cx="240" cy="104" r="30" fill="${IC.yl}" opacity=".25"/>`;
 h+=`<rect x="226" y="86" width="28" height="64" rx="8" fill="#9cc3ff" opacity=".75" stroke="${IC.ln}" stroke-width="1.5"/><rect x="233" y="76" width="14" height="12" fill="#9cc3ff" opacity=".75" stroke="${IC.ln}" stroke-width="1.5"/>`;
 h+=`<rect x="231" y="66" width="18" height="10" rx="2" fill="${IC.dk}" stroke="${IC.ln}"/><rect x="235" y="73" width="10" height="4" fill="${IC.yl}"/>`+iL(229,72,226,86,IC.dk,3)+iL(251,72,254,86,IC.dk,3);
 h+=iOK(296,40,12)+iT(240,24,L2('φακός + μπουκάλι','lamp + bottle'),{b:1,s:11,c:IC.yl})+iT(240,170,L2('= φανάρι','= lantern'),{b:1,s:11,c:IC.yl});
 return h}}],

g_power:[
{at:-1,c:['Powerbank 10.000 mAh ≈ 2 φορτίσεις κινητού. Πτυσσόμενο ηλιακό 20–30 W φορτίζει τη μέρα, μόνο με ήλιο. Power station 300–1000 Wh: ασφαλής μέσα στο σπίτι.','Power bank 10,000 mAh ≈ 2 phone charges. A foldable 20–30 W solar panel charges by day, only in sun. Power station 300–1000 Wh: safe inside the house.'],f:()=>{
 let h=iPanels(3);
 h+=iT(53,24,'Powerbank',{b:1,s:11,c:IC.yl})+iT(160,24,L2('Ηλιακό πάνελ','Solar panel'),{b:1,s:11,c:IC.yl})+iT(267,24,'Power station',{b:1,s:11,c:IC.yl});
 h+=`<rect x="16" y="68" width="30" height="56" rx="5" fill="#3a4656" stroke="${IC.ln}" stroke-width="1.5"/>`;[0,1,2,3].forEach(i=>{h+=`<circle cx="${23+i*5}" cy="76" r="1.8" fill="${IC.gn}"/>`});
 h+=iA(50,96,66,96,IC.yl,2.5)+iPhone(84,96,.8);
 h+=iT(53,148,L2('≈ 2 φορτίσεις','≈ 2 charges'),{s:10})+iT(53,166,'10.000 mAh',{b:1,s:11,c:IC.or});
 h+=gear_sun(128,56,10)+iL(114,130,206,130,IC.gr,2);
 h+=`<polygon points="136,128 152,80 196,80 180,128" fill="#1f4f9a" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(158,128,174,80,IC.ln,1.2)+iL(144,104,188,104,IC.ln,1.2)+iL(190,94,196,128,IC.gr,2);
 h+=iT(160,148,L2('μόνο με ήλιο','sun only'),{s:10})+iT(160,166,'20–30 W',{b:1,s:11,c:IC.or});
 h+=`<rect x="250" y="66" width="34" height="8" rx="3" fill="${IC.gr}"/><rect x="236" y="72" width="62" height="54" rx="7" fill="#3a4656" stroke="${IC.ln}" stroke-width="1.5"/><rect x="244" y="82" width="24" height="14" rx="2" fill="${IC.gn}"/>`;
 [254,268,282].forEach(x=>{h+=`<circle cx="${x}" cy="112" r="4" fill="${IC.dk}" stroke="${IC.gr}"/>`});
 h+=iT(267,148,L2('ασφαλές μέσα','safe indoors'),{s:10})+iT(267,166,'300–1000 Wh',{b:1,s:11,c:IC.or});
 return h}},
{at:-1,c:['Γεννήτρια βενζίνης ΜΟΝΟ έξω, μακριά από πόρτες και παράθυρα. Μέσα στο σπίτι ή στο γκαράζ το μονοξείδιο (CO) σκοτώνει.','A petrol generator ONLY outdoors, away from doors and windows. Inside the house or garage, carbon monoxide (CO) kills.'],f:()=>{
 const gen=(x,y)=>`<rect x="${x-16}" y="${y-22}" width="32" height="18" rx="3" fill="${IC.or}" stroke="${IC.dk}" stroke-width="1.5"/>`+`<path d="M${x-19},${y} L${x-19},${y-25} L${x+19},${y-25} L${x+19},${y}" stroke="${IC.ln}" stroke-width="2" fill="none"/>`+`<circle cx="${x-10}" cy="${y-3}" r="3" fill="${IC.dk}"/><circle cx="${x+10}" cy="${y-3}" r="3" fill="${IC.dk}"/>`;
 let h=iPanels(2);
 h+=iHouse(14,150,132,96)+iSmoke(42,82,1,'#6c7a88')+iSmoke(86,88,.8,'#6c7a88')+gen(80,148);
 h+=iT(40,114,'CO',{b:1,s:16,c:IC.rd})+iBan(80,128,28);
 h+=iT(80,170,L2('μέσα: ΟΧΙ','inside: NO'),{b:1,s:11,c:IC.rd});
 h+=iHouse(176,150,66,64)+`<rect x="226" y="104" width="12" height="16" fill="#9cc3d6"/>`+iL(166,150,312,150,IC.gr,3);
 h+=gen(290,148)+iSmoke(278,96,.55)+iOK(290,42,12);
 h+=iA(250,140,268,140,IC.yl,2)+iT(240,170,L2('ΜΟΝΟ έξω','ONLY outside'),{b:1,s:11,c:IC.gn});
 return h}}],

g_solar:[
{at:0,c:['Σαν βρύση και ντεπόζιτο: τα W λένε πόσο ανοιχτή είναι η βρύση (πόσο δυνατό τώρα), τα Wh πόσο νερό έχει το ντεπόζιτο (πόση ενέργεια χωράει).','Like a tap and a tank: W says how far the tap is open (how strong right now), Wh how much water is in the tank (how much energy it holds).'],f:()=>{
 let h=`<rect x="12" y="36" width="76" height="10" fill="${IC.gr}"/><rect x="82" y="36" width="10" height="22" fill="${IC.gr}"/>`+iL(64,36,64,24,IC.gr,4)+iL(54,24,74,24,IC.rd,5);
 h+=`<rect x="84" y="60" width="6" height="56" fill="#6fa8ff" opacity=".9"/>`;
 h+=`<rect x="52" y="100" width="72" height="64" rx="3" fill="none" stroke="${IC.ln}" stroke-width="2.5"/>`+`<rect x="54" y="118" width="68" height="44" fill="${IC.wt}"/>`;
 h+=iT(112,52,'W',{b:1,s:26,c:IC.yl,a:'start'})+iT(112,70,L2('= βρύση','= tap'),{s:11,a:'start'});
 h+=iT(136,138,'Wh',{b:1,s:26,c:IC.yl,a:'start'})+iT(136,156,L2('= ντεπόζιτο','= tank'),{s:11,a:'start'});
 h+=iL(206,14,206,166,IC.sk,2);
 h+=`<polygon points="228,62 240,30 288,30 276,62" fill="#1f4f9a" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(252,62,264,30,IC.ln,1)+iL(234,46,282,46,IC.ln,1);
 h+=iT(258,82,L2('πάνελ 100 W','panel 100 W'),{b:1,s:11});
 h+=gear_bat(232,108,48,26,3)+iT(258,154,L2('μπαταρία 500 Wh','battery 500 Wh'),{b:1,s:11});
 return h}},
{at:3,c:['Πάνελ ΕΞΩ, προς τον ΝΟΤΟ, με κλίση (χειμώνα ~55°). Πίσω από τζάμι χάνει 30–60%. Λίγη σκιά σε ένα κομμάτι ρίχνει ΟΛΟ το πάνελ.','Panel OUTSIDE, facing SOUTH, tilted (winter ~55°). Behind glass it loses 30–60%. A little shade on one part drops the WHOLE panel.'],f:()=>{
 let h=iPanels(3);
 h+=gear_sun(24,36,9)+iL(8,148,100,148,IC.gr,2)+gear_panel(46,146,78,100)+iL(78,100,86,146,IC.gr,2);
 h+=`<path d="M64,146 A18,18 0 0 0 56,132" stroke="${IC.yl}" stroke-width="1.5" fill="none"/>`+iT(70,138,'55°',{s:10,c:IC.yl,a:'start'});
 h+=iOK(90,24,11)+iT(53,168,L2('← ΝΟΤΟΣ','← SOUTH'),{b:1,s:10,c:IC.yl});
 h+=gear_sun(132,36,9)+iL(115,148,206,148,IC.gr,2);
 h+=`<rect x="140" y="50" width="12" height="98" fill="#9cc3d6" opacity=".55" stroke="${IC.ln}" stroke-width="1.5"/>`+gear_panel(168,146,196,104);
 h+=iNO(196,24,11)+iT(160,168,L2('τζάμι −30–60%','glass −30–60%'),{b:1,s:10,c:IC.rd});
 h+=gear_sun(238,36,9)+iL(222,148,312,148,IC.gr,2)+gear_panel(252,146,284,100);
 h+=`<path d="M314,64 L262,74" stroke="${IC.wd}" stroke-width="4" stroke-linecap="round"/><circle cx="266" cy="72" r="7" fill="${IC.gn}"/><circle cx="280" cy="68" r="6" fill="${IC.gn}"/>`;
 h+=iL(270,120,284,100,'#000',10).replace('stroke-linecap','opacity=".6" stroke-linecap');
 h+=iNO(304,24,11)+iT(267,168,L2('σκιά','shade'),{b:1,s:10,c:IC.rd});
 return h}},
{at:4,c:['Τη μέρα: πάνελ → μπαταρία (powerbank ή power station). Το βράδυ: μπαταρία → κινητό, φως, ραδιόφωνο.','By day: panel → battery (powerbank or power station). At night: battery → phone, light, radio.'],f:()=>{
 let h=iPanels(2);
 h+=iT(80,24,L2('ΜΕΡΑ','DAY'),{b:1,s:13,c:IC.yl})+gear_sun(28,52,10);
 h+=`<polygon points="14,132 28,88 66,88 52,132" fill="#1f4f9a" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(33,132,47,88,IC.ln,1)+iL(21,110,59,110,IC.ln,1);
 h+=iA(72,110,96,110,IC.yl,3)+gear_bat(100,96,44,28,1);
 h+=iT(240,24,L2('ΝΥΧΤΑ','NIGHT'),{b:1,s:13,c:'#9cc3ff'})+`<circle cx="186" cy="52" r="11" fill="${IC.yl}"/><circle cx="192" cy="47" r="10" fill="${IC.bg}"/>`;
 h+=gear_bat(176,96,44,28,4)+iA(228,100,252,80,IC.yl,3)+iA(228,120,252,140,IC.yl,3);
 h+=iPhone(272,72,.75)+gear_bulb(276,140);
 return h}}],

g_radio:[
{at:-1,c:['Ραδιόφωνο FM + AM (και SW αν γίνεται) με 3 τρόπους φόρτισης: 1 μανιβέλα, 2 ηλιακό, 3 μπαταρίες AA.','FM + AM radio (and SW if possible) with 3 ways to charge: 1 hand crank, 2 solar, 3 AA batteries.'],f:()=>{
 let h=iL(216,62,252,16,IC.ln,3)+`<circle cx="252" cy="16" r="3" fill="${IC.ln}"/>`;
 h+=`<rect x="90" y="60" width="140" height="84" rx="12" fill="${IC.or}" stroke="${IC.dk}" stroke-width="2"/>`;
 h+=`<rect x="110" y="52" width="60" height="9" fill="#1f4f9a" stroke="${IC.ln}" stroke-width="1"/>`;
 h+=`<circle cx="128" cy="104" r="24" fill="${IC.dk}"/>`;for(let i=-2;i<=2;i++)h+=iL(110,104+i*8,146,104+i*8,IC.sm,2);
 h+=`<rect x="164" y="76" width="54" height="22" rx="3" fill="#cfe8c0"/>`+iT(191,91,'FM · AM',{s:10,c:'#000',b:1});
 h+=`<circle cx="180" cy="122" r="7" fill="${IC.dk}"/><circle cx="204" cy="122" r="7" fill="${IC.dk}"/>`;
 h+=`<circle cx="236" cy="104" r="5" fill="${IC.dk}"/>`+iL(236,104,256,120,IC.gr,4)+`<rect x="252" y="116" width="8" height="14" rx="3" fill="${IC.dk}" stroke="${IC.ln}"/>`;
 h+=iNum(280,92,'1')+iT(282,146,L2('μανιβέλα','crank'),{s:11,b:1});
 h+=iNum(98,34,'2')+iT(114,38,L2('ηλιακό','solar'),{s:11,b:1,a:'start'});
 [24,40].forEach(x=>{h+=`<rect x="${x}" y="94" width="12" height="32" rx="2" fill="${IC.yl}"/><rect x="${x+4}" y="91" width="4" height="3" fill="${IC.ln}"/>`});
 h+=iNum(42,72,'3')+iT(42,146,'AA',{s:12,b:1});
 h+=iT(160,170,'FM · AM · SW',{s:11,c:IC.yl,b:1});
 return h}}],

g_cook:[
{at:-1,c:['Καμία εστία με φλόγα μέσα σε σπίτι, σκηνή ή κλειστό χώρο: μονοξείδιο (CO) και φωτιά. Μαγειρεύεις ΜΟΝΟ έξω.','No flame stove inside a house, tent or closed space: carbon monoxide (CO) and fire. Cook ONLY outdoors.'],f:()=>{
 let h=iPanels(2)+iL(8,150,152,150,IC.gr,3)+iL(168,150,312,150,IC.gr,3);
 h+=iTent(80,150,1.9)+gear_stove(80,150)+iBan(80,128,28)+iT(132,72,'CO',{b:1,s:15,c:IC.rd});
 h+=iT(80,26,L2('μέσα: ΟΧΙ','inside: NO'),{b:1,s:12,c:IC.rd});
 h+=iTent(204,150,1.2)+gear_stove(280,150)+iOK(296,62,12);
 h+=iT(240,26,L2('ΜΟΝΟ έξω','ONLY outside'),{b:1,s:12,c:IC.gn});
 return h}},
{at:0,c:['Το καπάκι κάνει το βράσιμο 2 φορές πιο γρήγορο, με λιγότερο καύσιμο. Ο θερμός κρατάει το νερό ζεστό.','A lid makes boiling 2 times faster, with less fuel. A thermos keeps water hot.'],f:()=>{
 let h=iPanels(3);
 h+=gear_pot(53,120,0);for(let i=0;i<3;i++)h+=`<path d="M${43+i*10},92 q-5,-8 0,-16 q5,-8 0,-16" stroke="${IC.gr}" stroke-width="2.5" fill="none"/>`;
 h+=iT(53,26,L2('χωρίς καπάκι','no lid'),{b:1,s:11})+iT(53,166,L2('αργά','slow'),{s:11,c:IC.gr});
 h+=gear_pot(160,120,1)+iT(160,26,L2('με καπάκι','with lid'),{b:1,s:11,c:IC.yl})+iT(160,70,'2×',{b:1,s:24,c:IC.yl})+iOK(196,56,10);
 h+=iT(160,166,L2('πιο γρήγορα','faster'),{s:11,c:IC.yl});
 h+=`<rect x="254" y="64" width="26" height="78" rx="6" fill="${IC.sm}" stroke="${IC.ln}" stroke-width="1.5"/><rect x="256" y="52" width="22" height="14" rx="3" fill="${IC.rd}"/>`+iL(258,96,276,96,IC.gr,2)+`<path d="M262,48 q-4,-6 0,-12 M272,48 q-4,-6 0,-12" stroke="${IC.gr}" stroke-width="2" fill="none"/>`;
 h+=iT(267,26,L2('θερμός','thermos'),{b:1,s:11})+iT(267,166,L2('λιγότερο καύσιμο','less fuel'),{s:10});
 return h}}],

g_water:[
{at:-1,c:['Φίλτρο 0,1–0,2 μm: σταματά βακτήρια και παράσιτα, ΟΧΙ ιούς. Purifier 0,02 μm (ή με χημικό): σταματά και ιούς.','Filter 0.1–0.2 μm: stops bacteria and parasites, NOT viruses. Purifier 0.02 μm (or with chemical): stops viruses too.'],f:()=>{
 const germs=(y)=>`<ellipse cx="38" cy="${y-8}" rx="15" ry="7" fill="${IC.gn}"/><rect x="62" y="${y-20}" width="16" height="6" rx="3" fill="${IC.or}"/><rect x="74" y="${y+2}" width="16" height="6" rx="3" fill="${IC.or}"/><rect x="40" y="${y+8}" width="16" height="6" rx="3" fill="${IC.or}"/>`+[[96,y-14],[60,y-2],[100,y+12],[22,y+12],[84,y-26]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="2.4" fill="${IC.rd}"/>`).join('');
 let h=`<rect x="8" y="16" width="304" height="68" rx="6" fill="${IC.wt}" opacity=".25"/><rect x="8" y="98" width="304" height="68" rx="6" fill="${IC.wt}" opacity=".25"/>`;
 h+=germs(50)+`<line x1="118" y1="18" x2="118" y2="82" stroke="${IC.ln}" stroke-width="5" stroke-dasharray="7 3"/>`;
 [[136,40],[150,58],[140,70]].forEach(([a,b])=>{h+=`<circle cx="${a}" cy="${b}" r="2.4" fill="${IC.rd}"/>`});
 h+=iT(228,42,L2('Φίλτρο 0,1 μm','Filter 0.1 μm'),{b:1,s:12})+iT(228,62,L2('οι ιοί περνούν','viruses pass'),{s:11,c:IC.rd})+iNO(298,50,11);
 h+=germs(132)+iL(118,100,118,164,IC.ln,7);
 h+=gear_drop(144,136,1.6,'#9cc3ff');
 h+=iT(228,124,L2('Purifier 0,02 μm','Purifier 0.02 μm'),{b:1,s:12})+iT(228,144,L2('σταματά και ιούς','stops viruses too'),{s:11,c:IC.gn})+iOK(298,132,11);
 h+=iT(64,176,L2('παράσιτα · βακτήρια · ιοί','parasites · bacteria · viruses'),{s:9,c:IC.gr});
 return h}},
{at:-1,c:['Καλύτερος συνδυασμός: 1 προφιλτράρισμα με πανί, 2 φίλτρο (π.χ. σακούλα βαρύτητας που κρέμεται), 3 χλώριο ή βράσιμο.','Best combination: 1 pre-filter with a cloth, 2 filter (e.g. a hanging gravity bag), 3 chlorine or boiling.'],f:()=>{
 let h=iPanels(3)+iNum(18,20,'1')+iNum(125,20,'2')+iNum(232,20,'3');
 h+=`<rect x="64" y="40" width="22" height="30" rx="4" fill="#8b6b3c" transform="rotate(35 75 55)"/>`+`<path d="M60,78 q2,20 -2,40" stroke="#8b6b3c" stroke-width="5" fill="none"/>`;
 h+=`<rect x="24" y="104" width="64" height="46" rx="3" fill="none" stroke="${IC.ln}" stroke-width="2.5"/>`+`<rect x="26" y="128" width="60" height="20" fill="${IC.wt}"/>`;
 h+=`<path d="M20,104 Q56,132 92,104" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1"/>`;
 h+=iT(53,170,L2('πανί','cloth'),{b:1,s:11,c:IC.yl});
 h+=iL(124,36,200,36,IC.wd,4)+iL(160,36,160,46,IC.ln,1.5);
 h+=`<path d="M146,46 L174,46 L178,84 Q160,92 142,84 Z" fill="${IC.bl}" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(160,88,160,104,IC.ln,2.5);
 h+=`<rect x="153" y="104" width="14" height="22" rx="3" fill="${IC.sn}"/>`+iL(160,126,160,132,IC.ln,2.5);
 h+=`<rect x="148" y="132" width="24" height="20" rx="3" fill="#9cc3ff" opacity=".8" stroke="${IC.ln}"/>`;
 h+=iT(160,170,L2('φίλτρο','filter'),{b:1,s:11,c:IC.yl});
 [[246,64],[262,60],[254,76]].forEach(([a,b])=>{h+=`<circle cx="${a}" cy="${b}" r="7" fill="${IC.sn}" stroke="${IC.gr}"/>`});
 h+=iT(254,94,'Cl',{b:1,s:11,c:'#9cc3ff'})+iT(288,72,L2('ή','or'),{b:1,s:12});
 h+=gear_pot(270,128,0)+`<path d="M262,102 q-4,-6 0,-12 M278,102 q-4,-6 0,-12" stroke="${IC.gr}" stroke-width="2" fill="none"/>`;
 h+=iT(267,170,L2('χλώριο ή βράσιμο','chlorine or boil'),{b:1,s:10,c:IC.yl});
 return h}}],

g_tools:[
{at:-1,c:['Τα απαραίτητα: μαχαίρι σταθερής λάμας 10–12 cm, πολυεργαλείο, πτυσσόμενο πριόνι, paracord, duct tape, πτυσσόμενο φτυάρι και λοστός για πόρτες μετά από σεισμό.','The essentials: fixed-blade knife 10–12 cm, multitool, folding saw, paracord, duct tape, folding shovel and a crowbar for doors after an earthquake.'],f:()=>{
 let h=iL(10,92,310,92,IC.sk,2);
 h+=`<rect x="14" y="40" width="22" height="11" rx="3" fill="${IC.wd}"/><path d="M36,39 L62,39 Q72,44 62,52 L36,52 Z" fill="#c9ced6" stroke="${IC.dk}"/>`;
 h+=iT(40,72,L2('Μαχαίρι','Knife'),{s:10,b:1})+iT(40,85,'10–12 cm',{s:9,c:IC.gr});
 h+=iL(108,64,118,38,IC.rd,6)+iL(132,64,122,38,IC.rd,6)+`<path d="M118,38 L117,22 L121,30 Z M122,38 L123,22 L119,30 Z" fill="#c9ced6" stroke="#c9ced6" stroke-width="3"/>`;
 h+=iT(120,80,L2('Πολυεργαλείο','Multitool'),{s:10,b:1});
 h+=`<rect x="168" y="40" width="16" height="13" rx="3" fill="${IC.or}"/><path d="M184,42 L226,38 L226,48 L184,51 Z" fill="#c9ced6"/><path d="M186,51 l3,4 l3,-4 l3,4 l3,-4 l3,4 l3,-4 l3,4 l3,-4 l3,4 l3,-4 l3,4 l3,-4 l3,3" stroke="#c9ced6" stroke-width="1.5" fill="none"/>`;
 h+=iT(200,80,L2('Πριόνι','Folding saw'),{s:10,b:1});
 [0,1,2,3].forEach(i=>{h+=`<ellipse cx="${280+i}" cy="${46-i}" rx="${22-i*3}" ry="${12-i*2}" fill="none" stroke="${IC.or}" stroke-width="3"/>`});
 h+=iT(280,80,'Paracord 550',{s:10,b:1});
 h+=`<circle cx="60" cy="124" r="20" fill="${IC.gr}"/><circle cx="60" cy="124" r="9" fill="${IC.bg}"/><path d="M78,132 L104,136 L104,146 L74,140 Z" fill="${IC.gr}"/>`;
 h+=iT(60,166,'Duct tape',{s:10,b:1});
 h+=iL(140,108,180,140,IC.wd,4)+`<rect x="132" y="100" width="14" height="8" rx="2" fill="${IC.dk}" stroke="${IC.ln}" transform="rotate(40 139 104)"/><path d="M174,130 L194,126 L198,146 L186,156 L170,148 Z" fill="${IC.gr}" stroke="${IC.dk}"/>`;
 h+=iT(160,170,L2('Φτυάρι','Shovel'),{s:10,b:1});
 h+=`<path d="M232,148 L282,110 Q292,102 296,112 L292,118" stroke="${IC.rd}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`+iL(232,148,226,146,IC.rd,6);
 h+=iT(262,170,L2('Λοστός','Crowbar'),{s:10,b:1});
 return h}}],

g_fire:[
{at:-1,c:['Πάντα 3 τρόποι για φωτιά: 1 αναπτήρες (πάρε 3), 2 αδιάβροχα αντιανεμικά σπίρτα, 3 ράβδος σιδηροκερίου που δουλεύει και βρεγμένη, με έτοιμο προσάναμμα (βαμβάκι με βαζελίνη).','Always 3 ways to make fire: 1 lighters (take 3), 2 waterproof storm matches, 3 a ferro rod that works even wet, with ready tinder (cotton with petroleum jelly).'],f:()=>{
 let h=iPanels(3)+iNum(18,20,'1')+iNum(125,20,'2')+iNum(232,20,'3');
 [[30,IC.rd],[52,IC.bl],[74,IC.yl]].forEach(([x,c],i)=>{h+=`<rect x="${x-8}" y="88" width="16" height="44" rx="3" fill="${c}"/><rect x="${x-8}" y="78" width="16" height="10" fill="#c9ced6"/><circle cx="${x-3}" cy="76" r="3" fill="${IC.gr}"/>`});
 h+=iFire(57,74,.6)+iT(53,160,L2('Αναπτήρες ×3','Lighters ×3'),{b:1,s:11});
 [[140,0],[152,0],[164,0]].forEach(([x])=>{h+=iL(x,136,x,96,'#c8a46a',3)+`<rect x="${x-3}" y="74" width="6" height="22" rx="3" fill="${IC.rd}"/>`});
 h+=iL(186,136,192,96,'#c8a46a',3)+`<rect x="189" y="74" width="6" height="22" rx="3" fill="${IC.rd}" transform="rotate(8 192 85)"/>`+iFire(194,72,.75);
 h+=iA(116,60,140,60,IC.gr,2)+iA(112,48,136,48,IC.gr,2);
 h+=iT(160,152,L2('Σπίρτα','Storm'),{b:1,s:11})+iT(160,166,L2('θύελλας','matches'),{b:1,s:11});
 h+=`<g transform="rotate(-30 250 90)"><rect x="216" y="86" width="20" height="10" rx="3" fill="${IC.wd}"/><rect x="236" y="88" width="46" height="6" rx="3" fill="${IC.sm}"/></g>`;
 h+=`<rect x="258" y="68" width="24" height="6" rx="2" fill="${IC.ln}" transform="rotate(60 270 71)"/>`;
 [[276,96],[284,104],[270,108],[290,114],[280,118],[292,98]].forEach(([a,b])=>{h+=`<circle cx="${a}" cy="${b}" r="2" fill="${IC.yl}"/>`});
 h+=`<g fill="${IC.sn}"><circle cx="276" cy="134" r="8"/><circle cx="288" cy="132" r="7"/><circle cx="282" cy="126" r="6"/></g>`;
 h+=iT(267,160,'Ferro rod',{b:1,s:11})+iT(267,174,L2('+ προσάναμμα','+ tinder'),{s:10,c:IC.gr});
 return h}}],

g_clothes:[
{at:-1,c:['Σύστημα 3 στρώσεων: 1 βάση στο δέρμα (merino ή συνθετικό), 2 μόνωση (fleece ή μπουφάν), 3 αδιάβροχο αντιανεμικό με κουκούλα. Βαμβάκι ΟΧΙ στο κρύο.','3-layer system: 1 base on the skin (merino or synthetic), 2 insulation (fleece or puffer jacket), 3 waterproof windproof shell with hood. NO cotton in the cold.'],f:()=>{
 let h=iL(244,14,244,166,IC.sk,2);
 const C=[[42,IC.gn,0,L2('Βάση','Base'),'merino'],[122,IC.or,0,L2('Μόνωση','Insulation'),'fleece'],[202,IC.bl,1,L2('Εξωτερικό','Shell'),L2('αδιάβροχο','waterproof')]];
 C.forEach(([x,c,hd,t1,t2],i)=>{h+=iNum(x,20,String(i+1))+gear_shirt(x,46,c,hd)+iT(x,128,t1,{b:1,s:11})+iT(x,143,t2,{s:10,c:IC.gr})});
 h+=iT(82,78,'+',{b:1,s:18,c:IC.yl})+iT(162,78,'+',{b:1,s:18,c:IC.yl});
 h+=`<path d="M271,48 L260,54 L255,66 L264,69 L266,62 L266,98 L298,98 L298,62 L300,69 L309,66 L304,54 L293,48 Q282,56 271,48 Z" fill="#e6e1d3" stroke="${IC.dk}" stroke-width="1.5"/>`;
 h+=gear_drop(282,78,1.1)+iBan(282,72,30);
 h+=iT(282,128,L2('Βαμβάκι','Cotton'),{b:1,s:11,c:IC.rd})+iT(282,143,L2('όχι στο κρύο','not in cold'),{s:10,c:IC.rd});
 return h}},
{at:0,c:['Παπούτσια πεζοπορίας φορεμένα, μάλλινες κάλτσες και ένα εφεδρικό ζευγάρι πάντα στεγνό σε σακουλάκι. Ο σκούφος είναι ο φθηνότερος τρόπος να ζεσταθείς.','Worn-in hiking boots, wool socks and a spare pair always dry in a zip bag. A beanie is the cheapest way to stay warm.'],f:()=>{
 let h=iPanels(3);
 h+=`<path d="M24,118 L24,56 L54,56 L56,90 L84,98 Q92,104 90,118 Z" fill="${IC.wd}" stroke="${IC.dk}" stroke-width="1.5"/><rect x="22" y="118" width="70" height="8" rx="2" fill="${IC.dk}"/>`;
 [66,74,82].forEach(y=>{h+=iL(42,y,56,y-2,IC.yl,2)});
 h+=iT(53,152,L2('Μποτάκια','Hiking boots'),{b:1,s:11});
 const sock=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 L18,0 L18,40 Q18,48 28,48 L38,48 Q46,52 40,62 L10,62 Q0,62 0,50 Z" fill="#c9b38a" stroke="${IC.dk}" stroke-width="1.5"/>${iL(0,8,18,8,'#8b6b3c',3)}</g>`;
 h+=sock(118,52,1);
 h+=`<rect x="168" y="66" width="40" height="52" rx="4" fill="#cfe3ff" opacity=".35" stroke="${IC.ln}" stroke-width="1.5"/>`+iL(168,74,208,74,IC.rd,3)+sock(176,80,.55);
 h+=iT(160,148,L2('Μάλλινες κάλτσες','Wool socks'),{b:1,s:10})+iT(160,164,L2('+ εφεδρικές στεγνές','+ dry spare pair'),{s:10,c:IC.gr});
 h+=`<path d="M237,106 Q237,62 267,62 Q297,62 297,106 Z" fill="${IC.rd}" stroke="${IC.dk}" stroke-width="1.5"/>`;
 [249,261,273,285].forEach(x=>{h+=iL(x,72,x,100,'#a01e1e',2)});
 h+=`<rect x="234" y="100" width="66" height="16" rx="4" fill="#a01e1e" stroke="${IC.dk}" stroke-width="1.5"/><circle cx="267" cy="58" r="8" fill="${IC.sn}"/>`;
 h+=iT(267,152,L2('Σκούφος','Beanie'),{b:1,s:11});
 return h}}],

g_masks:[
{at:-1,c:['Η FFP2 σταματά σωματίδια (σκόνη, καπνό, ιούς) αλλά ΟΧΙ αέρια. Για αέρια και ατμούς χρειάζεται μάσκα με φίλτρα (π.χ. A2B2E2K2-P3). Καμία μάσκα σωματιδίων δεν προστατεύει από μονοξείδιο.','FFP2 stops particles (dust, smoke, viruses) but NOT gases. For gases and vapours you need a respirator with filters (e.g. A2B2E2K2-P3). No particle mask protects against carbon monoxide.'],f:()=>{
 let h=iL(8,92,312,92,IC.sk,2)+iL(8,130,312,130,IC.sk,2)+iL(100,14,100,168,IC.sk,2)+iL(206,14,206,168,IC.sk,2);
 h+=`<circle cx="153" cy="44" r="22" fill="${IC.sk2}"/><circle cx="145" cy="38" r="2.5" fill="${IC.dk}"/><circle cx="161" cy="38" r="2.5" fill="${IC.dk}"/>`;
 h+=`<path d="M133,46 Q153,40 173,46 L170,58 Q153,72 136,58 Z" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1.2"/>`+iL(133,47,131,40,IC.sn,1.5)+iL(173,47,175,40,IC.sn,1.5);
 h+=iT(153,84,'FFP2',{b:1,s:12,c:IC.yl});
 h+=`<circle cx="259" cy="44" r="22" fill="${IC.sk2}"/><circle cx="251" cy="38" r="2.5" fill="${IC.dk}"/><circle cx="267" cy="38" r="2.5" fill="${IC.dk}"/>`;
 h+=`<path d="M243,46 Q259,40 275,46 L272,58 Q259,70 246,58 Z" fill="${IC.sm}" stroke="${IC.dk}" stroke-width="1.2"/><circle cx="240" cy="60" r="9" fill="${IC.or}" stroke="${IC.dk}"/><circle cx="278" cy="60" r="9" fill="${IC.or}" stroke="${IC.dk}"/>`;
 h+=iT(259,84,L2('Μάσκα φίλτρων','Filter mask'),{b:1,s:12,c:IC.yl});
 [[18,104],[26,110],[16,116],[30,102],[24,120]].forEach(([a,b])=>{h+=`<circle cx="${a}" cy="${b}" r="2.6" fill="${IC.gr}"/>`});
 h+=iT(40,108,L2('καπνός,','smoke,'),{s:10,a:'start'})+iT(40,121,L2('σκόνη','dust'),{s:10,a:'start'});
 h+=`<path d="M12,142 q4,-4 8,0 t8,0 M12,150 q4,-4 8,0 t8,0 M12,158 q4,-4 8,0 t8,0" stroke="#7bd88f" stroke-width="2" fill="none"/>`;
 h+=iT(40,146,L2('αέρια,','gases,'),{s:10,a:'start'})+iT(40,159,L2('ατμοί','vapours'),{s:10,a:'start'});
 h+=iOK(153,111,11)+iNO(153,149,11)+iOK(259,111,11)+iOK(259,149,11);
 return h}}],

g_nav:[
{at:-1,c:['Χάρτινος χάρτης με τις διαδρομές διαφυγής και πυξίδα με πλάκα: δεν θέλουν μπαταρία. Στο κινητό κατέβασε από πριν offline χάρτες – το GPS δουλεύει χωρίς internet.','A paper map with your escape routes and a baseplate compass: no battery needed. On the phone, download offline maps in advance – GPS works without internet.'],f:()=>{
 let h=`<rect x="14" y="34" width="56" height="112" fill="#e9e2c8"/><rect x="70" y="34" width="56" height="112" fill="#d8d0b2"/><rect x="126" y="34" width="56" height="112" fill="#e9e2c8"/>`;
 h+=`<path d="M14,120 Q60,110 90,80 T182,60" stroke="${IC.gr}" stroke-width="4" fill="none"/><path d="M40,34 Q50,90 30,146" stroke="${IC.bl}" stroke-width="3" fill="none"/>`;
 h+=`<path d="M30,128 Q70,118 96,90 T160,64" stroke="${IC.rd}" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/>`+iL(160,64,160,46,IC.dk,2)+`<polygon points="160,46 172,50 160,54" fill="${IC.rd}"/>`;
 h+=`<g transform="translate(120,108) rotate(-20)"><rect x="-20" y="-36" width="40" height="72" rx="4" fill="#cfe8ff" opacity=".7" stroke="${IC.dk}" stroke-width="1.5"/><polygon points="0,-34 -5,-24 5,-24" fill="${IC.dk}"/><circle cx="0" cy="8" r="15" fill="${IC.sk}" stroke="${IC.dk}" stroke-width="1.5"/><polygon points="0,-6 4,8 -4,8" fill="${IC.rd}"/><polygon points="0,22 4,8 -4,8" fill="${IC.sn}"/></g>`;
 h+=iT(98,24,L2('Χάρτης + πυξίδα','Map + compass'),{b:1,s:12,c:IC.yl})+iT(98,166,L2('χωρίς μπαταρία','no battery'),{s:11});
 h+=iPhone(256,88,1.4,'GPS')+iT(256,148,L2('offline χάρτες','offline maps'),{b:1,s:11,c:IC.yl})+iT(256,164,L2('χωρίς internet','no internet'),{s:10});
 return h}}],

g_store:[
{at:-1,c:['«Πρώτα μπαίνει, πρώτα φεύγει»: τα νέα μπαίνουν πίσω, τρως πρώτα τα παλιά από μπροστά. Υπενθύμιση στο κινητό 1η Μαρτίου και 1η Σεπτεμβρίου: έλεγχος κιτ.','"First in, first out": new items go in at the back, you eat the old ones from the front first. Phone reminder on 1 March and 1 September: kit check.'],f:()=>{
 let h=`<rect x="70" y="100" width="184" height="8" fill="${IC.wd}"/>`+iL(80,108,80,124,IC.wd,4)+iL(244,108,244,124,IC.wd,4);
 const D=['01/27','04/27','08/27','11/27'];[96,138,180,222].forEach((x,i)=>{h+=gear_can(x,100,D[i])});
 h+=iA(66,78,14,78,IC.or,3)+iT(40,66,L2('ΠΑΛΙΑ έξω','OLD out'),{b:1,s:10,c:IC.or});
 h+=iA(306,78,258,78,IC.gn,3)+iT(282,66,L2('ΝΕΑ μέσα','NEW in'),{b:1,s:10,c:IC.gn});
 h+=iT(160,34,L2('πρώτα μπαίνει → πρώτα φεύγει','first in → first out'),{b:1,s:11,c:IC.yl});
 h+=`<rect x="92" y="134" width="44" height="38" rx="4" fill="${IC.sn}"/><rect x="92" y="134" width="44" height="11" rx="3" fill="${IC.rd}"/>`+iT(114,166,L2('1/3','1 Mar'),{b:1,s:13,c:'#000'});
 h+=`<rect x="146" y="134" width="44" height="38" rx="4" fill="${IC.sn}"/><rect x="146" y="134" width="44" height="11" rx="3" fill="${IC.rd}"/>`+iT(168,166,L2('1/9','1 Sep'),{b:1,s:13,c:'#000'});
 h+=iT(200,158,L2('έλεγχος κιτ','kit check'),{b:1,s:11,a:'start'});
 return h}}],
});
