/* ===== Επιβίωση 72+: σχέδια για λίστες (list) και συμβουλές (tips) – Created by George Barbaris ===== */
/* τοπικά βοηθητικά: lists_g = ομάδα σε (x,y) με κλίμακα, lists_I = εικονίδια στο (0,0), περίπου ±18 */
const lists_g=(x,y,s,inner)=>`<g transform="translate(${x},${y}) scale(${s||1})">${inner}</g>`;
const lists_R=(x,y,w,h,f,o)=>{o=o||{};return`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r||0}" fill="${f}"${o.s?` stroke="${o.s}" stroke-width="${o.sw||1.2}"`:''}${o.op?` opacity="${o.op}"`:''}/>`};
const lists_C=(x,y,r,f,o)=>{o=o||{};return`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${o.s?` stroke="${o.s}" stroke-width="${o.sw||1.2}"`:''}/>`};
const lists_Pt=(d,f,o)=>{o=o||{};return`<path d="${d}" fill="${f||'none'}"${o.s?` stroke="${o.s}" stroke-width="${o.sw||1.5}" stroke-linecap="round" stroke-linejoin="round"`:''}${o.op?` opacity="${o.op}"`:''}/>`};
const lists_cross=(x,y,a,c)=>lists_R(x-a*.3,y-a,a*.6,a*2,c||'#fff')+lists_R(x-a,y-a*.3,a*2,a*.6,c||'#fff');
const lists_bottle=(dx,h)=>{h=h||28;return lists_R(dx-6,14-h,12,h,IC.bl,{r:4,s:IC.ln,sw:1})+lists_R(dx-3,9-h,6,6,IC.ln,{r:1})+lists_R(dx-6,2-h/3,12,7,'#9cc3d6')};
const lists_I={
 water:()=>lists_bottle(-8)+lists_bottle(8),
 jug:()=>lists_Pt('M-16,-12 L8,-12 L16,-4 L16,18 L-16,18 Z',IC.bl,{s:IC.ln,sw:1.2})+lists_R(-10,-18,10,6,IC.ln,{r:2})+lists_R(4,-17,8,5,IC.ln,{r:1})+lists_Pt('M-12,4 h24',null,{s:'#9cc3d6',sw:2}),
 can:(dx)=>{dx=dx||0;return lists_R(dx-9,-10,18,24,IC.gr,{r:2})+`<ellipse cx="${dx}" cy="-10" rx="9" ry="3" fill="#c5d0dc"/>`+lists_R(dx-9,-2,18,9,IC.or)},
 bar:()=>`<g transform="rotate(-18)">`+lists_R(-15,-5,30,10,IC.yl,{r:2})+lists_Pt('M-15,-5 l-3,2.5 l3,2.5 l-3,2.5 l3,2.5 M15,-5 l3,2.5 l-3,2.5 l3,2.5 l-3,2.5',null,{s:IC.yl,sw:1.2})+lists_R(-6,-5,12,10,IC.or)+`</g>`,
 food:()=>lists_g(-8,2,.85,lists_I.can())+lists_g(9,10,.65,lists_I.bar()),
 cans:()=>lists_I.can(-9)+lists_g(0,0,1,lists_I.can(9)),
 torch:()=>lists_Pt('M10,-6 L28,-14 L28,14 L10,6 Z',IC.yl,{op:.45})+lists_R(-18,-4,22,8,IC.gr,{r:2})+lists_Pt('M4,-4 L10,-7 L10,7 L4,4 Z',IC.ln)+lists_R(-10,-6,4,2,IC.or),
 radio:()=>iL(10,-10,18,-21,IC.ln,1.6)+lists_R(-17,-10,34,23,IC.or,{r:3,s:IC.dk,sw:1})+lists_C(-7,2,6.5,IC.dk)+lists_C(-7,2,2.5,IC.gr)+lists_R(3,-5,10,5,IC.yl)+lists_C(8,7,3,IC.dk),
 aid:()=>lists_Pt('M-6,-12 v-4 h12 v4',null,{s:IC.ln,sw:2})+lists_R(-16,-12,32,25,IC.gn,{r:3,s:IC.ln,sw:1})+lists_cross(0,0.5,8),
 doc:(c)=>lists_Pt('M-11,-16 h14 l8,8 v24 h-22 Z',c||IC.sn)+lists_Pt('M3,-16 v8 h8',null,{s:IC.gr,sw:1})+lists_Pt('M-7,-4 h12 M-7,1 h14 M-7,6 h14 M-7,11 h9',null,{s:IC.gr,sw:1.4}),
 cash:()=>lists_R(-18,-11,30,17,'#7cc47f',{r:2,s:'#2f6f3a'})+lists_C(-3,-2.5,4.5,'none',{s:'#2f6f3a',sw:1.4})+lists_C(9,11,6,IC.yl,{s:'#a87a12'})+lists_C(-6,13,5,IC.yl,{s:'#a87a12'}),
 whistle:()=>lists_Pt('M-6,-12 C-14,-12 -16,-2 -10,-1',null,{s:IC.ln,sw:1.4})+lists_R(-12,-4,20,9,IC.or,{r:2})+lists_C(8,5,9,IC.or)+lists_C(8,5,3,IC.dk)+lists_Pt('M18,-8 q4,4 0,8 M22,-11 q6,7 0,14',null,{s:IC.yl,sw:1.4}),
 blanket:()=>lists_R(-16,-12,32,24,'#c9d3dc',{r:1,s:IC.ln,sw:1})+lists_Pt('M-16,12 L16,-12 L16,12 Z','#e0b84a')+lists_Pt('M-16,0 h32 M0,-12 v24',null,{s:'#8a9bb0',sw:.8}),
 wool:()=>lists_R(-17,-10,34,22,IC.wd,{r:3})+lists_Pt('M-17,-3 h34 M-17,5 h34',null,{s:'#c49a6c',sw:2})+lists_R(-17,-10,34,4,'#a67449',{r:2}),
 pills:()=>lists_R(-12,-6,15,21,IC.or,{r:3,op:.95})+lists_R(-13,-12,17,7,IC.sn,{r:2})+lists_R(-10,1,11,8,IC.sn)+`<g transform="translate(10,6) rotate(-35)">`+lists_R(-4,-9,8,18,IC.sn,{r:4})+lists_R(-4,0,8,9,IC.rd,{r:0})+`</g>`,
 stove:()=>iFire(0,-9,.55)+lists_Pt('M-12,-9 h24 M-9,-9 l3,6 M9,-9 l-3,6',null,{s:IC.gr,sw:2})+lists_R(-3,-6,6,5,IC.gr)+lists_R(-10,-1,20,16,IC.bl,{r:5,s:IC.ln,sw:1}),
 lantern:()=>lists_Pt('M-7,-13 Q0,-22 7,-13',null,{s:IC.ln,sw:1.6})+lists_R(-8,-13,16,4,IC.gr,{r:1})+lists_R(-9,-9,18,19,IC.yl,{r:3})+lists_R(-3,-6,6,13,'#fff',{r:2,op:.8})+lists_R(-10,10,20,5,IC.gr,{r:1}),
 batt:()=>{let h='';[-11,0].forEach(dx=>{h+=lists_R(dx-4,-12,9,24,IC.dk,{r:1.5,s:IC.ln,sw:1})+lists_R(dx-1.5,-14.5,4,3,IC.ln)+lists_R(dx-4,-12,9,8,IC.or,{r:1.5})});return h+lists_R(9,-10,10,22,IC.gr,{r:2,s:IC.ln,sw:1})+lists_R(11,-6,6,3,IC.gn)+lists_R(11,-1,6,3,IC.gn)+lists_R(11,4,6,3,IC.gn)},
 bucket:(nw)=>lists_Pt('M-13,-10 Q0,-22 13,-10',null,{s:IC.ln,sw:1.4})+lists_Pt('M-13,-8 L13,-8 L10,16 L-10,16 Z',IC.gr,{s:IC.ln,sw:1})+lists_R(-15,-11,30,4,IC.sm,{r:2})+(nw?'':iT(0,8,'WC',{s:8,b:1,c:IC.dk})),
 gauze:()=>lists_R(-14,-6,22,18,IC.sn,{r:1,s:IC.gr})+lists_R(-9,-11,22,18,IC.sn,{r:1,s:IC.gr})+lists_Pt('M-4,-2 h12 M2,-8 v12',null,{s:'#c5d0dc',sw:1}),
 plaster:()=>`<g transform="rotate(-25)">`+lists_R(-17,-5,34,10,IC.sk2,{r:5})+lists_R(-5,-5,10,10,'#f5e6d0')+`</g>`+`<g transform="translate(2,10) rotate(15) scale(.7)">`+lists_R(-17,-5,34,10,IC.sk2,{r:5})+lists_R(-5,-5,10,10,'#f5e6d0')+`</g>`,
 roll:()=>lists_Pt('M2,8 Q14,14 18,6',null,{s:IC.sn,sw:5})+`<ellipse cx="-4" cy="0" rx="11" ry="12" fill="${IC.sn}" stroke="${IC.gr}" stroke-width="1"/>`+`<ellipse cx="-4" cy="0" rx="4" ry="4.5" fill="${IC.gr}"/>`,
 tq:()=>lists_R(-17,-4,34,8,IC.dk,{r:3,s:IC.ln,sw:1})+lists_R(-3,-13,6,26,IC.gr,{r:2,s:IC.ln,sw:.8})+lists_R(11,-6,7,12,IC.rd,{r:1}),
 glove:()=>`<g fill="${IC.bl}">`+lists_R(-9,-4,18,18,IC.bl,{r:4})+lists_R(-9,-16,4,14,IC.bl,{r:2})+lists_R(-4,-18,4,16,IC.bl,{r:2})+lists_R(1,-17,4,15,IC.bl,{r:2})+lists_R(6,-14,4,13,IC.bl,{r:2})+`<path d="M-9,4 L-17,-4 L-14,-7 L-6,0 Z"/></g>`,
 scissors:()=>lists_C(-10,8,5,'none',{s:IC.or,sw:2.5})+lists_C(2,10,5,'none',{s:IC.or,sw:2.5})+lists_Pt('M-7,4 L14,-15 M0,6 L12,-16',null,{s:IC.ln,sw:2.5}),
 thermo:()=>`<g transform="rotate(30)">`+lists_R(-3,-17,6,28,IC.sn,{r:3,s:IC.gr,sw:1})+lists_C(0,13,5,IC.rd)+lists_R(-1,-4,2,15,IC.rd)+`</g>`,
 mask:(t)=>lists_Pt('M-15,-4 L-21,-9 M15,-4 L21,-9 M-14,6 L-21,10 M14,6 L21,10',null,{s:IC.ln,sw:1.4})+lists_Pt('M-15,-6 Q0,-17 15,-6 L13,8 Q0,16 -13,8 Z',IC.sn,{s:IC.gr,sw:1})+lists_Pt('M0,-12 V12',null,{s:IC.gr,sw:1})+(t?iT(0,6,t,{s:7,b:1,c:IC.dk}):''),
 triangle:()=>lists_Pt('M0,-16 L17,13 L-17,13 Z',IC.rd)+lists_Pt('M0,-7 L9,8 L-9,8 Z',IC.bg),
 ext:()=>lists_R(-7,-10,14,26,IC.rd,{r:5})+lists_R(-3,-15,6,5,IC.dk)+lists_Pt('M3,-14 h8 M-3,-13 Q-14,-12 -12,4',null,{s:IC.dk,sw:2})+lists_R(-5,-2,10,8,IC.sn),
 hammer:()=>`<g transform="rotate(-35)">`+lists_R(-3,-4,6,22,IC.rd,{r:2})+lists_Pt('M-12,-10 L10,-10 L14,-6 L10,-2 L-12,-2 Z',IC.gr,{s:IC.ln,sw:.8})+`</g>`,
 shovel:()=>`<g transform="rotate(30)">`+lists_R(-1.8,-18,3.6,22,IC.wd)+lists_R(-6,-20,12,4,IC.wd,{r:2})+lists_Pt('M-7,4 h14 v8 Q0,20 -7,12 Z',IC.gr,{s:IC.ln,sw:.8})+`</g>`,
 babybottle:()=>lists_Pt('M-3,-17 Q0,-21 3,-17 L4,-12 L-4,-12 Z',IC.yl)+lists_R(-7,-12,14,4,IC.bl,{r:1})+lists_R(-7,-8,14,24,IC.sn,{r:4,s:IC.gr,sw:1})+lists_Pt('M-7,0 h4 M-7,6 h4 M-7,12 h4',null,{s:IC.gr,sw:1}),
 nappy:()=>lists_Pt('M-17,-10 H17 L17,-6 Q6,-2 4,14 H-4 Q-6,-2 -17,-6 Z',IC.sn,{s:IC.gr,sw:1})+lists_R(-17,-10,6,5,IC.bl)+lists_R(11,-10,6,5,IC.bl),
 tag:()=>lists_R(-16,-11,32,22,IC.yl,{r:3})+lists_C(-11,-6,2,IC.bg)+lists_Pt('M-6,-4 h16 M-6,1 h16 M-6,6 h10',null,{s:IC.dk,sw:1.4})+lists_Pt('M-11,-6 Q-18,-14 -10,-18',null,{s:IC.ln,sw:1}),
 photo:()=>lists_R(-15,-12,30,24,IC.sn,{r:1})+lists_R(-12,-9,24,15,IC.sk)+lists_C(0,-3,3.5,IC.sk2)+lists_Pt('M-6,6 Q0,-2 6,6 Z',IC.sk2),
 teddy:()=>lists_C(-7,-12,4,IC.wd)+lists_C(7,-12,4,IC.wd)+lists_C(0,-6,8,IC.wd)+lists_C(0,9,10,IC.wd)+lists_C(0,-4,3,'#c49a6c')+lists_C(-3,-8,1.2,IC.dk)+lists_C(3,-8,1.2,IC.dk)+lists_C(0,9,5,'#c49a6c'),
 crayons:()=>{let h='';[[IC.rd,-10],[IC.yl,-3],[IC.bl,4],[IC.gn,11]].forEach(([c,x])=>{h+=lists_R(x-2.5,-10,5,24,c,{r:1})+lists_Pt(`M${x-2.5},-10 L${x},-16 L${x+2.5},-10 Z`,c)});return h},
 clothes:()=>lists_Pt('M-6,-14 L-17,-8 L-13,0 L-9,-3 L-9,15 L9,15 L9,-3 L13,0 L17,-8 L6,-14 Q0,-9 -6,-14 Z',IC.or,{s:IC.dk,sw:1}),
 glasses:()=>lists_C(-8,2,7,'#9cc3d6',{s:IC.ln,sw:2})+lists_C(8,2,7,'#9cc3d6',{s:IC.ln,sw:2})+lists_Pt('M-1,1 Q0,-2 1,1 M-15,0 L-19,-5 M15,0 L19,-5',null,{s:IC.ln,sw:2}),
 hear:()=>lists_Pt('M-4,12 C-14,10 -14,-12 0,-14 C12,-15 14,0 4,2 C0,3 0,8 -4,12 Z',IC.sk2,{s:IC.ln,sw:1})+lists_Pt('M2,-4 Q6,-4 6,0',null,{s:IC.dk,sw:1.4})+lists_R(8,8,8,6,IC.dk,{r:1})+lists_Pt('M16,10 h3',null,{s:IC.ln,sw:1}),
 chair:()=>lists_C(-2,8,10,'none',{s:IC.ln,sw:2.5})+lists_C(12,15,3,IC.ln)+lists_Pt('M-8,-16 L-8,2 L10,2 L12,15 M-8,-6 L6,-6',null,{s:IC.ln,sw:2.5}),
 cooler:()=>lists_R(-16,-7,32,22,IC.bl,{r:3,s:IC.ln,sw:1})+lists_R(-17,-11,34,6,IC.sn,{r:2})+lists_Pt('M-6,-11 Q0,-18 6,-11',null,{s:IC.ln,sw:1.6})+lists_cross(0,4,5,IC.sn),
 card:()=>lists_R(-17,-11,34,22,IC.sn,{r:3})+lists_R(-17,-11,34,6,IC.gn,{r:2})+lists_cross(-9,3,4,IC.gn)+lists_Pt('M-2,0 h14 M-2,5 h10',null,{s:IC.gr,sw:1.4}),
 neigh:()=>lists_g(-7,16,.42,iP({h:[0,-54],n:[0,-44],p:[0,-22],e1:[-8,-34],a1:[-10,-24],e2:[10,-38],a2:[18,-42],k1:[-4,-11],f1:[-6,0],k2:[4,-11],f2:[6,0]},{w:6,r:8}))+lists_g(9,16,.42,iP({h:[0,-54],n:[0,-44],p:[0,-22],e1:[-10,-38],a1:[-18,-42],e2:[8,-34],a2:[10,-24],k1:[-4,-11],f1:[-6,0],k2:[4,-11],f2:[6,0]},{w:6,r:8,c:IC.yl})),
 dogfood:()=>lists_Pt('M-12,-14 L12,-14 L14,15 L-14,15 Z',IC.or,{s:IC.dk,sw:1})+lists_Pt('M-12,-14 l4,-3 l4,3 l4,-3 l4,3 l4,-3 l4,3',null,{s:IC.dk,sw:1})+lists_C(-3,3,4,IC.sn)+lists_C(-6,-1,1.8,IC.sn)+lists_C(-3,-2.5,1.8,IC.sn)+lists_C(0.5,-1,1.8,IC.sn),
 bowl:()=>lists_Pt('M-16,0 L16,0 L11,12 L-11,12 Z',IC.rd)+`<ellipse cx="0" cy="0" rx="16" ry="4" fill="${IC.wt}"/>`,
 leash:()=>lists_Pt('M-14,-12 C6,-20 16,-6 4,4 C-4,10 -8,12 -6,14',null,{s:IC.rd,sw:3})+lists_C(-14,-12,5,'none',{s:IC.rd,sw:3})+lists_C(-5,16,4,IC.yl),
 crate:()=>lists_R(-17,-12,34,26,IC.gr,{r:6,s:IC.ln,sw:1})+lists_Pt('M-4,-8 v18 M2,-8 v18 M8,-8 v18 M14,-8 v18',null,{s:IC.dk,sw:1.6})+lists_Pt('M-10,-12 Q0,-20 10,-12',null,{s:IC.ln,sw:2}),
 book:(c)=>lists_R(-13,-15,26,30,c||IC.bl,{r:2})+lists_R(-10,-15,3,30,IC.dk,{op:.35})+lists_R(-4,-9,13,7,IC.sn,{r:1}),
 dogpic:()=>lists_R(-15,-12,30,24,IC.sn,{r:1})+lists_R(-12,-9,24,15,IC.sk)+lists_C(-4,-4,3,IC.sk2)+lists_Pt('M-9,6 Q-4,-2 1,6 Z',IC.sk2)+lists_R(3,0,7,4,IC.wd,{r:2})+lists_C(10,-1,2.5,IC.wd),
 idcard:()=>lists_R(-17,-11,34,22,'#9cc3d6',{r:3})+lists_R(-13,-6,10,12,IC.sn)+lists_C(-8,-2,2.5,IC.gr)+lists_Pt('M0,-3 h12 M0,2 h12 M0,7 h8',null,{s:IC.dk,sw:1.4}),
 passport:()=>lists_R(-11,-15,22,30,'#7b2d3b',{r:2})+lists_C(0,-3,5,'none',{s:IC.yl,sw:1.2})+lists_Pt('M-6,8 h12',null,{s:IC.yl,sw:1.2}),
 licence:()=>lists_R(-17,-11,34,22,'#f2c6d0',{r:3})+lists_R(-14,-6,10,12,IC.sn)+lists_C(-9,-2,2.5,IC.gr)+lists_Pt('M0,-3 h12 M0,2 h12',null,{s:IC.dk,sw:1.4})+lists_R(2,5,10,4,IC.bl),
 med:()=>lists_I.doc()+lists_cross(-1,-8,3.5,IC.gn),
 contract:()=>lists_I.doc()+lists_Pt('M-7,13 q3,-4 5,0 q3,4 6,-2',null,{s:IC.bl,sw:1.4}),
 phonelist:()=>lists_I.doc()+iT(-1,-6,'☎',{s:9,c:IC.dk}),
 housepic:()=>lists_R(-15,-12,30,24,IC.sn,{r:1})+lists_R(-12,-9,24,15,IC.sk)+lists_R(-6,-1,12,7,IC.yl)+lists_Pt('M-8,-1 L0,-7 L8,-1 Z',IC.rd),
 usb:()=>lists_g(-6,4,1,lists_R(-5,-6,10,16,IC.bl,{r:2})+lists_R(-3,-12,6,6,IC.gr)+lists_R(-1.5,-10,1,2,IC.dk)+lists_R(.5,-10,1,2,IC.dk))+lists_g(8,-6,.8,iSmoke(-10,4,.45,IC.ln)),
 plastic:()=>lists_R(-16,-13,24,26,'#9cc3d6',{op:.55,s:IC.ln,sw:1})+lists_Pt('M-12,-8 l8,8 M-8,-11 l12,12',null,{s:IC.ln,sw:.8})+lists_C(10,6,9,IC.gr)+lists_C(10,6,4,IC.bg)+lists_Pt('M10,15 h8',null,{s:IC.gr,sw:3}),
 sbag:()=>lists_Pt('M-17,-6 Q-17,-13 -10,-13 L14,-13 Q18,-13 18,-6 L18,10 Q18,14 14,14 L-10,14 Q-17,14 -17,7 Z',IC.or,{s:IC.dk,sw:1})+lists_C(-10,0,5,IC.sk2)+lists_Pt('M-3,-13 V14 M5,-13 V14',null,{s:IC.dk,sw:1}),
 mat:()=>lists_R(-12,-6,30,14,IC.gn,{r:3})+`<ellipse cx="-12" cy="1" rx="5" ry="7" fill="#3fbfae" stroke="${IC.dk}" stroke-width="1"/>`+lists_C(-12,1,2.5,IC.dk),
 hat:()=>lists_Pt('M-16,2 Q-16,-14 -4,-14 Q8,-14 8,2 Z',IC.rd)+lists_R(-17,0,26,5,IC.sn,{r:2})+lists_C(-4,-15,3,IC.sn)+lists_g(11,6,.55,lists_I.glove()),
 hwb:()=>lists_R(-12,-10,24,26,IC.rd,{r:8})+lists_R(-4,-16,8,7,IC.rd,{r:1})+lists_R(-5,-18,10,4,IC.dk,{r:1})+lists_Pt('M-6,-2 h12 M-6,3 h12 M-6,8 h12',null,{s:'#a01e1e',sw:1.5}),
 thermos:()=>lists_R(-7,-12,14,28,IC.gr,{r:4,s:IC.ln,sw:1})+lists_R(-6,-17,12,6,IC.dk,{r:2})+lists_R(-7,-2,14,4,IC.sm)+lists_Pt('M10,-14 q2,-4 0,-6 M14,-12 q2,-4 0,-6',null,{s:IC.ln,sw:1}),
 co:()=>lists_C(0,0,15,IC.sn,{s:IC.gr,sw:1})+iT(0,4,'CO',{s:11,b:1,c:IC.dk})+lists_C(9,-8,2.5,IC.rd),
 goggles:()=>lists_Pt('M-18,-2 C-18,-10 18,-10 18,-2 C18,8 4,8 0,3 C-4,8 -18,8 -18,-2 Z','#9cc3d6',{s:IC.ln,sw:1.6})+lists_Pt('M-18,-2 h-0 M18,-2',null,{s:IC.ln,sw:1}),
 shirt:()=>lists_Pt('M-6,-14 L-17,-8 L-19,8 L-13,9 L-11,-3 L-10,15 L10,15 L11,-3 L13,9 L19,8 L17,-8 L6,-14 Q0,-9 -6,-14 Z','#d9cbb0',{s:IC.dk,sw:1}),
 boot:()=>lists_Pt('M-12,-16 L2,-16 L2,2 L16,6 Q18,9 16,12 L-12,12 Z',IC.wd,{s:IC.dk,sw:1})+lists_R(-13,10,30,5,IC.dk,{r:1})+lists_Pt('M-2,-12 h4 M-2,-7 h4 M-2,-2 h4',null,{s:IC.yl,sw:1}),
 hose:()=>lists_C(-4,0,11,'none',{s:IC.gn,sw:4})+lists_C(-4,0,5,'none',{s:IC.gn,sw:3})+lists_Pt('M7,2 Q14,8 14,14',null,{s:IC.gn,sw:4})+lists_Pt('M14,16 l-3,3 M15,16 l0,4 M16,16 l3,3',null,{s:IC.bl,sw:1.5}),
 gbag:()=>lists_R(-16,-10,32,26,IC.yl,{r:5,s:IC.dk,sw:1})+lists_Pt('M-16,-6 Q0,-20 16,-6',null,{s:IC.dk,sw:1})+lists_R(-16,-3,32,4,'#e8eef5',{op:.8}),
 epirb:()=>lists_R(-7,-8,14,24,IC.yl,{r:3,s:IC.dk,sw:1})+lists_R(-2,-18,4,10,IC.dk)+lists_R(-5,-2,10,8,IC.dk)+lists_Pt('M8,-16 q5,4 0,8 M12,-19 q8,7 0,14 M-8,-16 q-5,4 0,8',null,{s:IC.yl,sw:1.3}),
 vhf:()=>lists_R(-1,-19,3,10,IC.dk,{s:IC.ln,sw:.8})+lists_R(-8,-10,16,27,IC.dk,{r:3,s:IC.ln,sw:1})+lists_R(-5,-6,10,6,'#9cc3d6')+lists_Pt('M-4,4 h8 M-4,8 h8 M-4,12 h8',null,{s:IC.gr,sw:1.5}),
 flare:()=>`<g transform="rotate(25)">`+lists_R(-3,-8,6,24,IC.rd,{r:1})+lists_R(-4,-11,8,4,IC.dk)+`</g>`+lists_C(-2,-15,4,IC.yl)+lists_Pt('M-2,-15 l-8,-3 M-2,-15 l-6,6 M-2,-15 l2,-6',null,{s:IC.yl,sw:1.5})+iSmoke(4,-14,.3,IC.or),
 mirror:()=>lists_R(-16,-12,22,22,'#c9d3dc',{r:2,s:IC.ln,sw:1.4})+lists_C(-5,-1,3,IC.dk)+lists_Pt('M8,-4 L19,-12 M8,2 L20,2 M8,8 L19,15',null,{s:IC.yl,sw:1.6}),
 vest:()=>lists_Pt('M-6,-16 L-15,-10 L-15,14 L-2,14 L-2,-6 L2,-6 L2,14 L15,14 L15,-10 L6,-16 L4,-8 L-4,-8 Z',IC.or,{s:IC.dk,sw:1})+lists_R(-15,4,13,3,'#c9d3dc')+lists_R(2,4,13,3,'#c9d3dc')+lists_C(10,-6,2,IC.yl),
 phonebag:()=>lists_R(-13,-17,26,34,'#9cc3d6',{r:6,op:.5,s:IC.ln,sw:1.2})+lists_R(-7,-12,14,25,IC.dk,{r:2})+lists_R(-5,-9,10,18,IC.bl)+lists_Pt('M-13,-11 h26',null,{s:IC.ln,sw:1.5}),
};
/* ετικέτα 1–2 γραμμών */
const lists_lab=(x,y,t,o)=>{o=o||{};const a=Array.isArray(t)?t:[t];return a.map((s,i)=>iT(x,y+i*10,s,{s:o.s||8.5,c:o.c||IC.ln,b:o.b})).join('')};
/* διάταξη: μεγάλο «ήρωας» αριστερά (στο 45,~88) + 4×2 πλέγμα αντικειμένων δεξιά */
function lists_lay(hero,heroLab,items){
 let h=iL(88,14,88,166,IC.sk,2)+hero+lists_lab(45,143,heroLab,{s:9.5,b:1,c:IC.yl});
 items.forEach(([ic,lab],i)=>{const cx=119.75+55.5*(i%4),row=i<4?0:1,cy=row?122:44;h+=lists_g(cx,cy,1,lists_I[ic]?lists_I[ic]():ic)+lists_lab(cx,cy+(row?36:36),lab)});
 return h}
const lists_backpack=()=>lists_Pt('M-12,-34 Q0,-46 12,-34',null,{s:IC.ln,sw:3})+lists_R(-26,-34,52,66,IC.or,{r:14,s:IC.dk,sw:1.5})+lists_Pt('M-26,-14 Q0,-26 26,-14 L26,-8 Q0,-20 -26,-8 Z','#c96400')+lists_R(-17,4,34,22,'#c96400',{r:6})+lists_Pt('M-12,10 h24',null,{s:IC.dk,sw:1.4})+lists_C(0,-12,2.5,IC.yl);
const lists_bigaid=()=>lists_Pt('M-10,-30 v-6 h20 v6',null,{s:IC.ln,sw:3})+lists_R(-34,-30,68,52,IC.gn,{r:6,s:IC.ln,sw:1.5})+lists_cross(0,-4,15)+lists_Pt('M-34,-14 h68',null,{s:'#1f7a70',sw:2});
const lists_pouch=()=>lists_R(-28,-22,56,42,IC.rd,{r:12,s:IC.ln,sw:1.5})+lists_Pt('M-24,-14 Q0,-22 24,-14',null,{s:IC.yl,sw:2})+lists_R(-11,-4,22,22,IC.sn,{r:3})+lists_cross(0,7,7,IC.gn)+lists_Pt('M22,-16 l6,-8',null,{s:IC.yl,sw:2});
const lists_gauge=(x,y)=>lists_Pt(`M${x-16},${y} A16,16 0 0 1 ${x+16},${y}`,null,{s:IC.ln,sw:3})+lists_Pt(`M${x-16},${y} A16,16 0 0 1 ${x-11.3},${y-11.3}`,null,{s:IC.rd,sw:3})+iL(x,y,x+9,y-12,IC.yl,2.5)+lists_C(x,y,2.5,IC.ln)+iT(x-18,y+9,'E',{s:7})+iT(x+18,y+9,'F',{s:7});

Object.assign(SIMG,{
bag72:[{at:-1,c:['Ένα σακίδιο για κάθε άτομο, έτοιμο δίπλα στην πόρτα: νερό, τροφή, φακός, ραδιόφωνο, φαρμακείο, έγγραφα, μετρητά, σφυρίχτρα. Βάρος όχι πάνω από ~20% του βάρους σου.','One bag per person, ready by the door: water, food, torch, radio, first-aid kit, documents, cash, whistle. Weight no more than ~20% of your body weight.'],f:()=>
 lists_lay(lists_g(45,74,1,lists_backpack()),[L2('≤ 20%','≤ 20%'),L2('του βάρους σου','of body weight')],
 [['water',L2('Νερό 3 L','Water 3 L')],['food',L2('Τροφή','Food')],['torch',L2('Φακός','Torch')],['radio',L2('Ραδιόφωνο','Radio')],
  ['aid',L2('Φαρμακείο','First aid')],['doc',L2('Έγγραφα','Documents')],['cash',L2('Μετρητά','Cash')],['whistle',L2('Σφυρίχτρα','Whistle')]])}],
home72:[{at:-1,c:['Στο σπίτι: 4 λίτρα νερό ανά άτομο τη μέρα, τρόφιμα χωρίς ψυγείο, φως, ραδιόφωνο, μπαταρίες, τουαλέτα έκτακτης ανάγκης, φάρμακα και μετρητά. Το γκαζάκι μόνο σε εξωτερικό χώρο.','At home: 4 litres of water per person per day, food that needs no fridge, light, radio, batteries, emergency toilet, medicines and cash. Camping stove outdoors only.'],f:()=>
 lists_lay(lists_g(45,80,1.9,lists_I.jug()),['4 L',L2('άτομο / μέρα','person / day')],
 [['cans',L2('Κονσέρβες','Tins')],['stove',[L2('Γκαζάκι','Stove'),L2('μόνο έξω','outdoors only')]],['lantern',L2('Φανάρι','Lantern')],['radio',L2('Ραδιόφωνο','Radio')],
  ['batt',L2('Μπαταρίες','Batteries')],['bucket',L2('Τουαλέτα','Toilet')],['pills',L2('Φάρμακα','Medicines')],['cash',L2('Μετρητά','Cash')]])}],
medhome:[{at:-1,c:['Το οικιακό φαρμακείο: γάζες, τσιρότα, επίδεσμοι, tourniquet, γάντια, ψαλίδι, θερμόμετρο και φάρμακα. Έλεγξε τις λήξεις 2 φορές τον χρόνο.','The home first-aid kit: gauze, plasters, bandages, tourniquet, gloves, scissors, thermometer and medicines. Check expiry dates twice a year.'],f:()=>
 lists_lay(lists_g(45,80,1,lists_bigaid()),[L2('Λήξεις:','Expiry:'),L2('2 φορές/χρόνο','2× a year')],
 [['gauze',L2('Γάζες','Gauze')],['plaster',L2('Τσιρότα','Plasters')],['roll',L2('Επίδεσμοι','Bandages')],['tq','Tourniquet'],
  ['glove',L2('Γάντια','Gloves')],['scissors',L2('Ψαλίδι','Scissors')],['thermo',L2('Θερμόμετρο','Thermometer')],['pills',L2('Φάρμακα','Medicines')]])}],
medbag:[{at:-1,c:['Μικρό, ελαφρύ φαρμακείο για σακίδιο ή αυτοκίνητο: γάντια, tourniquet, επίδεσμος πίεσης, γάζες, τσιρότα, ορός, κουβέρτα αλουμινίου, μάσκα ΚΑΡΠΑ.','Small, light kit for the bag or car: gloves, tourniquet, pressure bandage, gauze, plasters, saline, foil blanket, CPR mask.'],f:()=>
 lists_lay(lists_g(45,82,1,lists_pouch()),[L2('Μικρό','Small'),L2('και ελαφρύ','and light')],
 [['glove',L2('Γάντια ×4','Gloves ×4')],['tq','Tourniquet'],['roll',[L2('Επίδεσμος','Pressure'),L2('πίεσης','bandage')]],['gauze',L2('Γάζες ×10','Gauze ×10')],
  ['plaster',L2('Τσιρότα ×20','Plasters ×20')],[lists_R(-14,-4,6,18,IC.sn,{r:2})+lists_R(-4,-4,6,18,IC.sn,{r:2})+lists_R(6,-4,6,18,IC.sn,{r:2})+lists_R(-13,-9,4,5,IC.bl)+lists_R(-3,-9,4,5,IC.bl)+lists_R(7,-9,4,5,IC.bl),L2('Ορός','Saline')],
  ['blanket',[L2('Κουβέρτα','Foil'),L2('αλουμινίου','blanket')]],[lists_I.mask()+lists_C(0,0,3,IC.bl),L2('Μάσκα ΚΑΡΠΑ','CPR mask')]])}],
car:[{at:-1,c:['Κιτ αυτοκινήτου: τρίγωνο, πυροσβεστήρας, φαρμακείο, σφυράκι θραύσης τζαμιών κοντά στον οδηγό, νερό, κουβέρτα, φακός, φτυάρι. Ντεπόζιτο πάντα πάνω από τη μέση.','Car kit: warning triangle, extinguisher, first-aid kit, glass-breaking hammer near the driver, water, blanket, torch, shovel. Fuel tank always above half.'],f:()=>
 lists_lay(lists_g(45,72,.68,iCar(0,10,1))+lists_gauge(45,112),[L2('Ντεπόζιτο','Tank'),L2('πάνω από ½','above ½')],
 [['triangle',L2('Τρίγωνο','Triangle')],['aid',L2('Φαρμακείο','First aid')],['hammer',[L2('Σφυράκι','Glass'),L2('τζαμιών','hammer')]],['ext',L2(['Πυροσβε-','στήρας'],'Extinguisher')],
  ['water',L2('Νερό 6 L','Water 6 L')],['wool',L2('Κουβέρτα','Blanket')],['torch',L2('Φακός','Torch')],['shovel',L2('Φτυάρι','Shovel')]])}],
kids:[{at:-1,c:['Για παιδιά και μωρά: γάλα, πάνες, μάρσιπος, καρτελάκι με όνομα και τηλέφωνα, πρόσφατη φωτογραφία, σφυρίχτρα στο μπουφάν, αγαπημένο παιχνίδι.','For children and babies: milk, nappies, baby carrier, ID tag with name and phone numbers, recent photo, whistle on the jacket, favourite toy.'],f:()=>{
 const kid=iP({h:[45,58],n:[45,70],p:[45,96],e1:[36,82],a1:[32,96],e2:[54,82],a2:[60,94],k1:[41,111],f1:[38,126],k2:[49,111],f2:[52,126]},{w:6,r:9,c:IC.ln})+lists_R(46,74,10,7,IC.yl,{r:1})+lists_C(39,79,3,IC.or);
 return lists_lay(kid+iA(70,78,58,78,IC.yl,2),[L2('Καρτελάκι +','ID tag +'),L2('σφυρίχτρα','whistle')],
 [['babybottle',L2('Γάλα','Milk')],['nappy',L2('Πάνες','Nappies')],[lists_Pt('M-12,-6 L-8,-18 M12,-6 L8,-18 M-13,4 L-18,10 M13,4 L18,10',null,{s:IC.bl,sw:3})+lists_C(0,-9,6,IC.sk2)+lists_Pt('M-13,-5 H13 L10,14 Q0,18 -10,14 Z',IC.bl,{s:IC.ln,sw:1}),L2('Μάρσιπος','Carrier')],['tag',L2('Καρτελάκι','ID tag')],
  ['photo',L2('Φωτογραφία','Photo')],['teddy',L2('Παιχνίδι','Toy')],['crayons',L2('Μπογιές','Crayons')],['thermo',L2('Θερμόμετρο','Thermometer')]])}}],
elder:[{at:-1,c:['Για ηλικιωμένους και ΑμεΑ: φάρμακα για 2 εβδομάδες με λίστα, εφεδρικά γυαλιά, ακουστικά, αμαξίδιο, ψυγειάκι για ινσουλίνη, κάρτα με ιστορικό, ένας γείτονας που βοηθά, σφυρίχτρα.','For elderly and disabled people: medicines for 2 weeks with a list, spare glasses, hearing aid, wheelchair, insulin cool bag, medical history card, a neighbour who helps, whistle.'],f:()=>{
 const el=iP({h:[40,52],n:[43,64],p:[42,92],e1:[50,76],a1:[60,86],e2:[38,78],a2:[34,90],k1:[40,108],f1:[38,126],k2:[48,108],f2:[50,126]},{w:6,r:8,c:IC.ln})+iL(60,84,64,127,IC.wd,3)+lists_Pt('M56,84 Q60,79 64,84',null,{s:IC.wd,sw:3});
 return lists_lay(el,[L2('Φάρμακα','Medicines'),L2('2 εβδομάδες','2 weeks')],
 [['pills',L2('Φάρμακα','Medicines')],['glasses',L2('Γυαλιά','Glasses')],['hear',L2('Ακουστικά','Hearing aid')],['chair',L2('Αμαξίδιο','Wheelchair')],
  ['cooler',L2('Ινσουλίνη','Insulin')],['card',L2('Ιστορικό','Med. history')],['neigh',L2('Γείτονας','Neighbour')],['whistle',L2('Σφυρίχτρα','Whistle')]])}}],
pets:[{at:-1,c:['Για το κατοικίδιο: τροφή για 1–2 εβδομάδες, νερό, μπολ, λουρί και περιλαίμιο με τηλέφωνο, κλουβί μεταφοράς, βιβλιάριο υγείας, φάρμακα και φωτογραφία με σένα.','For your pet: food for 1–2 weeks, water, bowl, leash and collar with phone number, carrier, health booklet, medicines and a photo of you together.'],f:()=>{
 const dog=lists_Pt('M18,100 L18,124 M26,104 L27,124 M52,104 L52,124 M60,100 L61,124',null,{s:IC.wd,sw:5})+lists_R(14,90,52,18,IC.wd,{r:9})+lists_Pt('M64,94 Q74,84 72,76',null,{s:IC.wd,sw:4})+lists_C(18,80,11,IC.wd)+lists_Pt('M10,74 Q4,86 12,88 Z','#6b4429')+lists_C(14,77,1.8,IC.dk)+lists_C(8,83,2.5,IC.dk)+lists_R(20,86,8,4,IC.rd,{r:1})+lists_C(24,93,3,IC.yl);
 return lists_lay(dog,[L2('Περιλαίμιο με','Collar with'),L2('τηλέφωνο','phone no.')],
 [['dogfood',L2('Τροφή','Food')],['water',L2('Νερό','Water')],['bowl',L2('Μπολ','Bowl')],['leash',L2('Λουρί','Leash')],
  ['crate',L2('Κλουβί','Carrier')],['book',L2('Βιβλιάριο','Health book')],['pills',L2('Φάρμακα','Medicines')],['dogpic',L2('Φωτογραφία','Photo')]])}}],
docs:[{at:-1,c:['Αντίγραφα των σημαντικών εγγράφων σε αδιάβροχη θήκη, και ψηφιακά σε USB ή cloud: ταυτότητες, διαβατήρια, διπλώματα, ιατρικά, συμβόλαια, τηλέφωνα, φωτογραφίες του σπιτιού.','Copies of important documents in a waterproof pouch, and digital copies on USB or cloud: IDs, passports, licences, medical papers, contracts, phone list, photos of the house.'],f:()=>{
 const pouch=lists_g(38,74,1.5,lists_I.doc())+lists_g(52,80,1.3,lists_I.idcard())+lists_R(12,40,66,66,'#9cc3d6',{r:6,op:.35,s:IC.ln,sw:2})+lists_Pt('M12,50 h66',null,{s:IC.ln,sw:2})+lists_Pt('M30,30 q-4,6 0,8 q4,-2 0,-8 Z',IC.bl)+lists_Pt('M45,26 q-4,6 0,8 q4,-2 0,-8 Z',IC.bl)+lists_Pt('M60,30 q-4,6 0,8 q4,-2 0,-8 Z',IC.bl);
 return lists_lay(pouch,[L2('Αδιάβροχη','Waterproof'),L2('θήκη','pouch')],
 [['idcard',L2('Ταυτότητα','ID card')],['passport',L2('Διαβατήριο','Passport')],['licence',L2('Δίπλωμα','Licence')],['med',L2('Ιατρικά','Medical')],
  ['contract',L2('Συμβόλαια','Contracts')],['phonelist',L2('Τηλέφωνα','Phone list')],['housepic',[L2('Φωτό','Photos of'),L2('σπιτιού','the house')]],['usb',['USB /','cloud']]])}}],
nuclearkit:[{at:-1,c:['Καταφύγιο για 2 εβδομάδες: δωμάτιο στο υπόγειο ή στο κέντρο του κτιρίου χωρίς παράθυρα, με νερό 4 L/άτομο/μέρα, τρόφιμα, ραδιόφωνο, φως, τουαλέτα-κουβά, νάιλον και ταινία, μάσκες FFP3, κουβέρτες.','Shelter for 2 weeks: a room in the basement or the centre of the building with no windows, with water 4 L/person/day, food, radio, light, bucket toilet, plastic sheet and tape, FFP3 masks, blankets.'],f:()=>{
 let b=lists_R(12,30,66,96,IC.sk,{s:IC.ln,sw:1.5})+lists_Pt('M8,30 L45,14 L82,30 Z',IC.sm,{s:IC.ln,sw:1.5});
 [54,78].forEach(y=>b+=lists_Pt(`M12,${y} h66`,null,{s:IC.ln,sw:1}));b+=lists_Pt('M2,102 h86',null,{s:IC.gd,sw:3});
 [[18,36],[60,36],[18,60],[60,60],[18,84],[60,84]].forEach(([x,y])=>b+=lists_R(x,y,12,10,'#9cc3d6'));
 b+=lists_R(13,103,64,22,IC.or,{op:.9})+lists_g(45,124,.33,iMan(0,0,1,IC.dk));
 return lists_lay(b,[L2('Υπόγειο ή','Basement or'),L2('κέντρο κτιρίου','building centre')],
 [['jug',[L2('Νερό','Water'),L2('4 L/μέρα','4 L/day')]],['cans',[L2('Τρόφιμα','Food'),L2('14 μέρες','14 days')]],['radio',L2('Ραδιόφωνο','Radio')],['lantern',L2('Φως','Light')],
  ['bucket',L2('Τουαλέτα','Toilet')],['plastic',[L2('Νάιλον','Plastic'),L2('+ ταινία','+ tape')]],[lists_I.mask('FFP3'),L2('Μάσκες','Masks')],['wool',L2('Κουβέρτες','Blankets')]])}}],
winter:[{at:-1,c:['Χειμερινό κιτ για κρύο χωρίς θέρμανση: υπνόσακος για χαμηλές θερμοκρασίες, σκηνή μέσα στο σπίτι, ασημοκουβέρτα, κουβέρτες, υπόστρωμα, σκούφος και γάντια, θερμοφόρα, θερμός, ανιχνευτής CO.','Winter kit for cold without heating: a sleeping bag for low temperatures, a tent set up indoors, foil blanket, blankets, sleeping mat, hat and gloves, hot-water bottle, thermos, CO alarm.'],f:()=>{
 const sb=lists_g(45,78,2,lists_I.sbag())+`<g fill="${IC.sn}">`+[[20,34],[44,26],[68,36]].map(([x,y])=>lists_Pt(`M${x-6},${y} h12 M${x},${y-6} v12 M${x-4},${y-4} l8,8 M${x+4},${y-4} l-8,8`,null,{s:IC.sn,sw:1.6})).join('')+`</g>`;
 return lists_lay(sb,[L2('Υπνόσακος','Sleeping bag'),'−15 … −20 °C'],
 [[iTent(0,14,.6,IC.or),[L2('Σκηνή','Tent'),L2('μέσα','indoors')]],['blanket',[L2('Κουβέρτα','Foil'),L2('αλουμινίου','blanket')]],['wool',L2('Κουβέρτες','Blankets')],['mat',L2('Υπόστρωμα','Sleeping mat')],
  ['hat',[L2('Σκούφος,','Hat,'),L2('γάντια','gloves')]],['hwb',[L2('Θερμοφόρα','Hot-water'),L2('νερού','bottle')]],['thermos',L2('Θερμός','Thermos')],['co',[L2('Ανιχνευτής','CO alarm'),L2('CO','')]]])}}],
summer:[{at:-1,c:['Για καύσωνα και πυρκαγιά: ξερά χόρτα κομμένα 10 m γύρω από το σπίτι, μάσκα FFP2, γυαλιά, ρούχα βαμβακερά ή μάλλινα που καλύπτουν όλο το σώμα, γερά παπούτσια, λάστιχο, κουβάδες, μάλλινη κουβέρτα, πολύ νερό.','For heatwave and wildfire: dry grass cut 10 m around the house, FFP2 mask, goggles, cotton or wool clothes that cover the whole body, sturdy shoes, garden hose, buckets, wool blanket, plenty of water.'],f:()=>{
 let s=lists_C(45,86,36,IC.gn,{op:.5})+iHouse(33,96,24,18)+iA(45,104,80,104,IC.yl,2)+iT(64,118,'10 m',{s:9,b:1,c:IC.yl});
 s+=lists_Pt('M8,70 l2,-8 l2,8 M14,72 l2,-9 l2,9 M76,66 l2,-8 l2,8 M80,74 l2,-9 l2,9',null,{s:IC.yl,sw:1.4})+lists_C(70,32,9,IC.yl)+iFire(14,48,.8);
 return lists_lay(s,[L2('Χωρίς ξερά','No dry grass'),L2('χόρτα 10 m','for 10 m')],
 [[lists_I.mask('FFP2'),L2('Μάσκα','Mask')],['goggles',L2('Γυαλιά','Goggles')],['shirt',L2('Βαμβακερά','Cotton/wool')],['boot',L2('Παπούτσια','Sturdy shoes')],
  ['hose',L2('Λάστιχο','Hose')],[lists_I.bucket(1),L2('Κουβάδες','Buckets')],['wool',[L2('Μάλλινη','Wool'),L2('κουβέρτα','blanket')]],['water',L2('Νερό','Water')]])}}],
boat:[{at:-1,c:['Grab bag σκάφους: EPIRB/PLB, φορητό VHF, φωτοβολίδες, καθρέφτης σήματος, νερό σε δοχεία γεμάτα 3/4 για να επιπλέουν, φάρμακα ναυτίας, σωσίβια για όλους, κινητό σε αδιάβροχη θήκη.','Boat grab bag: EPIRB/PLB, handheld VHF, flares, signal mirror, water in containers filled 3/4 so they float, seasickness tablets, lifejackets for everyone, phone in a waterproof pouch.'],f:()=>{
 const g=iWater(6,84,112,128)+lists_g(45,86,2,lists_I.gbag())+iT(45,92,'GRAB BAG',{s:8,b:1,c:IC.dk});
 return lists_lay(g,[L2('Επιπλέει,','Floats,'),L2('δίπλα στην έξοδο','by the exit')],
 [['epirb','EPIRB / PLB'],['vhf','VHF'],['flare',L2('Φωτοβολίδες','Flares')],['mirror',L2('Καθρέφτης','Mirror')],
  [lists_bottle(-8,24)+lists_R(-14,-10,12,8,IC.bg,{op:.7})+lists_bottle(8,24)+lists_R(2,-10,12,8,IC.bg,{op:.7}),L2('Νερό ¾','Water ¾')],['pills',L2('Ναυτία','Seasickness')],['vest',L2('Σωσίβια','Lifejackets')],['phonebag',L2('Κινητό','Phone')]])}}],
plan:[{at:-1,c:['Συμφωνήστε από πριν: σημείο συνάντησης 1 κοντά στο σπίτι, σημείο 2 έξω από τη γειτονιά/πόλη, και έναν συγγενή σε άλλη πόλη ως «κέντρο επικοινωνίας». Όλοι ξέρουν το 112.','Agree in advance: meeting point 1 near home, point 2 outside the neighbourhood/town, and a relative in another town as the «contact centre». Everyone knows 112.'],f:()=>{
 const flag=(x,y,n,c)=>iL(x,y,x,y-26,IC.ln,2)+lists_Pt(`M${x},${y-26} h16 l-4,6 l4,6 h-16 Z`,c)+iT(x+7,y-17,n,{s:9,b:1,c:IC.dk});
 let h=lists_R(8,40,168,128,IC.sk,{r:20,s:IC.gr,sw:1.5})+iT(92,160,L2('η πόλη σου','your town'),{s:9,c:IC.gr});
 h+=iHouse(38,124,34,24)+lists_R(50,108,10,16,IC.yl)+iT(55,138,L2('σπίτι','home'),{s:9,b:1});
 h+=iTree(120,116,.55)+flag(132,118,'1',IC.yl)+lists_Pt('M74,112 Q96,98 118,112',null,{s:IC.yl,sw:2})+iT(130,138,L2('κοντά','near home'),{s:9,b:1,c:IC.yl});
 h+=lists_Pt('M150,100 Q190,70 222,82',null,{s:IC.or,sw:2})+flag(226,110,'2',IC.or)+iT(234,126,L2('έξω από','outside'),{s:9,b:1,c:IC.or})+iT(234,137,L2('την πόλη','town'),{s:9,b:1,c:IC.or});
 h+=lists_R(240,16,72,52,IC.sk,{r:10,s:IC.gr,sw:1})+lists_g(258,46,.55,iMan(0,20,1,IC.yl))+iPhone(288,40,.5,'')+iT(276,80,L2('συγγενής σε','relative in'),{s:9,b:1})+iT(276,91,L2('άλλη πόλη','other town'),{s:9,b:1});
 h+=lists_Pt('M66,70 Q150,10 238,38',null,{s:IC.ln,sw:1.5})+`<path d="M66,70 Q150,10 238,38" fill="none" stroke="${IC.bg}" stroke-width="1.6" stroke-dasharray="3 5"/>`+iPhone(60,78,.45,'')+iBox(14,10,60,22,'112',IC.rd,'#fff');
 return h}}],
t_top:[{at:-1,c:['Το καλύτερο κιτ είναι αυτό που έχεις μαζί σου: μικρό στην τσάντα, μεσαίο στο αυτοκίνητο, μεγάλο στο σπίτι.','The best kit is the one you have with you: small in your bag, medium in the car, large at home.'],f:()=>{
 let h=iPanels(3);
 h+=lists_g(53,78,1.3,lists_pouch())+iT(53,140,L2('ΜΙΚΡΟ','SMALL'),{b:1,s:13,c:IC.yl})+iT(53,156,L2('στην τσάντα','in your bag'),{s:10});
 h+=iCar(160,100,.75)+lists_g(178,82,.7,lists_I.aid())+iT(160,140,L2('ΜΕΣΑΙΟ','MEDIUM'),{b:1,s:13,c:IC.yl})+iT(160,156,L2('στο αυτοκίνητο','in the car'),{s:10});
 h+=iHouse(236,112,52,46)+lists_g(248,98,.6,lists_I.jug())+lists_g(272,98,.55,lists_I.aid())+lists_g(262,76,.5,lists_I.cans())+iT(267,140,L2('ΜΕΓΑΛΟ','LARGE'),{b:1,s:13,c:IC.yl})+iT(267,156,L2('στο σπίτι','at home'),{s:10});
 return h}},
 {at:-1,c:['Δίπλα στο κρεβάτι: παπούτσια και φακός. Σεισμός τη νύχτα σημαίνει σπασμένα γυαλιά στο πάτωμα.','Next to the bed: shoes and a torch. An earthquake at night means broken glass on the floor.'],f:()=>{
 const fl=150;let h=iFloor(fl);
 h+=lists_R(40,108,140,22,IC.sn,{r:4})+lists_R(36,92,10,58,IC.wd,{r:2})+lists_R(176,112,8,38,IC.wd,{r:2})+lists_R(46,100,30,10,'#c9d3dc',{r:5})+lists_R(46,104,130,8,IC.bl,{r:3});
 h+=iP({h:[64,96],n:[78,103],p:[110,104],e1:[90,100],a1:[100,102],k1:[134,102],f1:[160,104],k2:[134,106],f2:[160,106]},{w:6,r:8});
 h+=lists_R(44,130,132,6,IC.wd);h+=lists_R(222,120,40,30,IC.wd,{r:2})+lists_g(240,112,.6,lists_I.torch());
 h+=lists_g(196,143,.45,lists_I.boot())+lists_g(208,143,.45,lists_I.boot());
 h+=lists_Pt('M276,150 l6,-8 l4,5 l6,-9 l3,12 Z M300,150 l4,-6 l5,6 Z',IC.sn,{op:.8})+lists_Pt('M292,104 L304,124 L280,124 Z',IC.yl)+iT(292,121,'!',{b:1,s:12,c:IC.dk});
 h+=iA(214,46,214,98,IC.yl)+iT(214,36,L2('παπούτσια + φακός','shoes + torch'),{b:1,s:11,c:IC.yl})+iOK(140,36,10);
 return h}}],
t_more:[{at:1,c:['Μην ανοίγεις το ψυγείο. Κλειστό κρατάει ~4 ώρες, γεμάτος καταψύκτης ~48 ώρες, μισογεμάτος ~24.','Do not open the fridge. Closed it stays cold ~4 hours, a full freezer ~48 hours, half full ~24.'],f:()=>{
 const fr=(x,w,h,c)=>lists_R(x,166-h,w,h,c,{r:6,s:IC.ln,sw:1.5});
 let h=iFloor(166);
 h+=fr(26,64,120,IC.sn)+lists_R(80,60,4,30,IC.gr,{r:2})+lists_Pt('M34,40 h48',null,{s:IC.gr,sw:1})+iBan(58,104,24)+lists_Pt('M58,126 v0',null);
 h+=iT(58,34,L2('ΚΛΕΙΣΤΟ','KEEP SHUT'),{b:1,s:11,c:IC.yl});
 h+=lists_R(120,60,50,24,IC.dk,{r:6})+iT(145,77,'~4 h',{b:1,s:13,c:IC.yl})+iT(145,98,L2('ψυγείο','fridge'),{s:10});
 h+=lists_R(186,46,62,66,'#cfe3f5',{r:6,s:IC.ln,sw:1.5})+[0,1,2].map(r=>[0,1,2].map(c=>lists_R(190+c*19,50+r*20,17,18,IC.bl,{r:2})).join('')).join('')+iT(217,128,L2('γεμάτος','full'),{s:10})+iT(217,146,'~48 h',{b:1,s:13,c:IC.yl});
 h+=lists_R(258,46,56,66,'#cfe3f5',{r:6,s:IC.ln,sw:1.5})+[0,1].map(c=>lists_R(262+c*24,90,22,18,IC.bl,{r:2})).join('')+iT(286,128,L2('μισός','half'),{s:10})+iT(286,146,'~24 h',{b:1,s:13,c:IC.yl});
 h+=iT(250,30,L2('καταψύκτης','freezer'),{s:10,b:1});
 return h}},
 {at:2,c:['Θερμομαγείρεμα: βράζεις 5–10 λεπτά, κλείνεις το καπάκι και τυλίγεις την κατσαρόλα σε sleeping bag ή κουβέρτες. Μαγειρεύεται μόνο του σε 1–2 ώρες.','Retained-heat cooking: boil 5–10 minutes, put the lid on and wrap the pot in a sleeping bag or blankets. It cooks by itself in 1–2 hours.'],f:()=>{
 const pot=(x,y)=>lists_R(x-22,y-24,44,26,IC.gr,{r:4,s:IC.ln,sw:1.2})+lists_R(x-25,y-28,50,5,IC.sm,{r:2})+lists_R(x-4,y-32,8,4,IC.dk,{r:1})+lists_Pt(`M${x-22},${y-18} h-5 M${x+22},${y-18} h5`,null,{s:IC.ln,sw:2.5});
 let h=iPanels(2)+iNum(18,20,'1')+iNum(178,20,'2');
 h+=lists_g(80,128,1,iFire(0,-12,.6)+iFire(-9,-12,.45)+iFire(9,-12,.45)+lists_R(-16,-12,32,6,IC.gr,{r:2}))+lists_R(62,122,36,24,IC.bl,{r:5,s:IC.ln,sw:1})+pot(80,104);
 h+=lists_Pt('M70,70 q-4,-5 0,-10 M80,68 q-4,-5 0,-10 M90,70 q-4,-5 0,-10',null,{s:IC.ln,sw:1.5});
 h+=iT(80,44,L2('5–10 λεπτά','5–10 min'),{b:1,s:13,c:IC.yl})+iClock(130,110,12);
 h+=lists_Pt('M196,148 Q186,90 214,72 Q240,60 266,72 Q294,90 284,148 Z',IC.or,{s:IC.dk,sw:1.5})+lists_Pt('M206,100 Q240,88 274,100 M200,124 Q240,112 280,124',null,{s:'#c96400',sw:2})+lists_R(226,58,28,8,IC.sm,{r:3});
 h+=iT(240,48,L2('1–2 ώρες','1–2 hours'),{b:1,s:13,c:IC.yl})+iT(240,166,L2('τυλιγμένη, χωρίς φωτιά','wrapped, no flame'),{s:10});
 h+=iA(146,110,174,110,IC.yl);
 return h}},
 {at:6,c:['3 σφυρίγματα, 3 λάμψεις ή 3 φωτιές σημαίνουν «ΒΟΗΘΕΙΑ» σε όλο τον κόσμο.','3 whistle blasts, 3 flashes or 3 fires mean «HELP» all over the world.'],f:()=>{
 let h=iPanels(3);
 h+=lists_g(46,82,1.6,lists_I.whistle())+[0,1,2].map(i=>lists_R(26+i*14,118,10,6,IC.yl,{r:3})).join('');
 h+=lists_g(146,84,1.5,lists_I.torch())+[0,1,2].map(i=>lists_C(140+i*14,121,5,IC.yl)).join('');
 h+=[0,1,2].map(i=>iFire(240+i*30,116,1.1)).join('');
 h+=lists_Pt('M222,120 h96',null,{s:IC.gd,sw:3});
 h+=iT(160,36,L2('3 × = ΒΟΗΘΕΙΑ','3 × = HELP'),{b:1,s:16,c:IC.rd});
 h+=iT(53,150,L2('σφύριγμα','whistle'),{s:10})+iT(160,150,L2('λάμψη','flash'),{s:10})+iT(267,150,L2('φωτιά','fire'),{s:10});
 return h}}],
t_kids:[{at:-1,c:['Σεισμός: κάτω από το τραπέζι και κρατιέμαι. Καπνός: πάω χαμηλά, μπουσουλώντας. Χάθηκα: μένω εκεί, αγκαλιάζω ένα δέντρο, σφυρίζω 3 φορές.','Earthquake: under the table and hold on. Smoke: I go low, on hands and knees. Lost: I stay put, hug a tree, whistle 3 times.'],f:()=>{
 const fl=150;let h=iPanels(3)+iFloor(fl);
 h+=iNum(16,20,'1')+iT(62,25,L2('ΣΕΙΣΜΟΣ','QUAKE'),{b:1,s:12,c:IC.yl});
 h+=iTable(14,fl,80,46)+iP({h:[34,128],n:[44,124],p:[66,130],e1:[40,114],a1:[34,121],e2:[50,114],a2:[36,124],k1:[58,fl],f1:[76,fl],k2:[62,fl-1],f2:[80,fl-1]},{w:5,r:7});
 h+=lists_Pt('M10,74 l5,-5 l5,5 l5,-5 l5,5',null,{s:IC.or,sw:2})+lists_Pt('M70,74 l5,-5 l5,5 l5,-5 l5,5',null,{s:IC.or,sw:2});
 h+=iNum(122,20,'2')+iT(168,25,L2('ΚΑΠΝΟΣ','SMOKE'),{b:1,s:12,c:IC.yl});
 h+=iSmoke(126,52,.9)+iSmoke(164,54,.85)+lists_R(112,54,92,18,IC.sm,{op:.6});
 h+=iP({h:[134,124],n:[144,128],p:[170,130],e1:[140,138],a1:[138,fl],e2:[146,138],a2:[144,fl],k1:[176,fl],f1:[194,fl],k2:[180,fl-1],f2:[198,fl-1]},{w:5,r:7})+iA(150,104,130,104,IC.yl,2.5);
 h+=iNum(228,20,'3')+iT(276,25,L2('ΧΑΘΗΚΑ','LOST'),{b:1,s:12,c:IC.yl});
 h+=iTree(270,fl,1.15)+iP({h:[252,100],n:[254,110],p:[254,130],e1:[264,112],a1:[268,116],e2:[262,118],a2:[268,120],k1:[252,140],f1:[250,fl],k2:[258,140],f2:[258,fl]},{w:5,r:7});
 h+=lists_g(244,114,.5,lists_I.whistle().replace(/M-6,-12 C-14,-12 -16,-2 -10,-1/,''))+iT(232,70,'×3',{b:1,s:13,c:IC.yl})+lists_Pt('M248,62 q6,6 0,12 M254,58 q9,10 0,20',null,{s:IC.yl,sw:1.6});
 return h}},
 {at:-1,c:['Αν πάρουν φωτιά τα ρούχα: σταματάω – πέφτω – κυλάω, με τα χέρια στο πρόσωπο.','If your clothes catch fire: stop – drop – roll, with hands over your face.'],f:()=>{
 const fl=150;let h=iPanels(3)+iFloor(fl);
 h+=iNum(16,20,'1')+iT(66,25,L2('ΣΤΑΜΑΤΑΩ','STOP'),{b:1,s:11,c:IC.yl});
 h+=iP({h:[53,90],n:[53,100],p:[53,122],e1:[45,110],a1:[43,122],e2:[61,110],a2:[63,122],k1:[49,136],f1:[47,fl],k2:[57,136],f2:[59,fl]},{w:5,r:7})+iFire(62,124,.7);
 h+=iT(53,170,L2('μην τρέχεις','don\'t run'),{s:10,c:IC.ln});
 h+=iNum(122,20,'2')+iT(168,25,L2('ΠΕΦΤΩ','DROP'),{b:1,s:12,c:IC.yl});
 h+=iP({h:[132,138],n:[140,132],p:[164,140],e1:[132,128],a1:[130,136],e2:[136,130],a2:[134,138],k1:[178,fl],f1:[198,fl],k2:[182,fl-1],f2:[200,fl-1]},{w:5,r:7})+iA(160,88,160,118,IC.yl);
 h+=iNum(228,20,'3')+iT(276,25,L2('ΚΥΛΑΩ','ROLL'),{b:1,s:12,c:IC.yl});
 h+=iP({h:[236,141],n:[246,143],p:[272,143],e1:[244,134],a1:[238,140],e2:[246,136],a2:[240,143],k1:[288,143],f1:[306,144],k2:[288,145],f2:[306,146]},{w:5,r:7});
 h+=lists_Pt('M246,110 A28,14 0 1 1 296,116',null,{s:IC.yl,sw:2.5})+lists_Pt('M296,116 l-1,-9 M296,116 l-9,-2',null,{s:IC.yl,sw:2.5});
 h+=iT(268,170,L2('χέρια στο πρόσωπο','hands on face'),{s:10});
 return h}}],
t_books:[{at:-1,c:['Μάθε περισσότερα από επίσημες πηγές (Πολιτική Προστασία, 112), σεμινάρια πρώτων βοηθειών και καλά βιβλία επιβίωσης.','Learn more from official sources (Civil Protection, 112), first-aid courses and good survival books.'],f:()=>{
 const fl=150;let h=lists_R(30,fl,160,6,IC.wd,{r:2});
  [[44,28,IC.rd],[40,24,IC.bl],[48,22,IC.gn],[38,26,IC.or],[46,20,IC.yl]].forEach(([w,t,c],i)=>{const y=fl-(i+1)*20;h+=lists_R(110-w-i*3+(i%2)*8,y,2*w+10,18,c,{r:2,s:IC.dk,sw:1})+lists_Pt(`M${110-w-i*3+(i%2)*8+8},${y+6} h${w} M${110-w-i*3+(i%2)*8+8},${y+12} h${w*.6}`,null,{s:IC.dk,sw:1.4,op:.5})});
 h+=lists_g(110,42,1.1,lists_I.aid());
 h+=iPhone(240,92,1.1,'112')+iT(240,150,L2('επίσημες πηγές','official sources'),{s:10,b:1,c:IC.yl})+iT(110,172,L2('βιβλία, σεμινάρια','books, courses'),{s:10,b:1,c:IC.yl});
 return h}}],
});
