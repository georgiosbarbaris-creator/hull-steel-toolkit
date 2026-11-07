/* ===== Κόμποι με σχέδια βήμα-βήμα (SVG, offline) — Created by George Barbaris =====
   Κάθε κόμπος = μία διαδρομή σχοινιού [x,y,z]. z: +1 περνάει ΠΑΝΩ, -1 ΚΑΤΩ, -2 πίσω από κοντάρι/κρίκο.
   Τα βήματα δείχνουν την ίδια διαδρομή ως ένα σημείο (cut) + βελάκι για την επόμενη κίνηση. */
const KC={s:'#E8DCC4',w:'#D97757',o:'#1F1E1D',obj:'#8a8580',arr:'#4fa3e0'};
function kSegs(P){const S=[];for(let i=0;i<P.length-1;i++){const a=P[i-1]||P[i],b=P[i],c=P[i+1],d=P[i+2]||P[i+1];
 const c1=[b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6],c2=[c[0]-(d[0]-b[0])/6,c[1]-(d[1]-b[1])/6];
 const zb=b[2]||0,zc=c[2]||0,z=zb===zc?zb:(Math.abs(zb)>Math.abs(zc)?zb:zc)*((zb&&zc&&Math.sign(zb)!==Math.sign(zc))?0:1);
 S.push({m:`M${b[0]},${b[1]}`,c:`C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${c[0]},${c[1]}`,z})}return S}
function kRope(P,col,L,ca,cb){if(P.length<2)return;const S=kSegs(P);let run=null;
 S.forEach((s,i)=>{if(run&&run.z===s.z)run.d+=s.c;else{run={z:s.z,d:s.m+s.c,col};L.push(run)}});
 const e=(p,z)=>L.push({z:(z||0),cap:p,col});if(ca!==0)e(P[0],S[0].z);if(cb!==0)e(P[P.length-1],S[S.length-1].z)}
function kSVG(K,cut,arrs){const L=[];const sp=K.w;
 K.p.forEach((st,si)=>{const n=cut==null?st.length:(Array.isArray(cut)?cut[si]:cut);const P=st.slice(0,n);if(P.length<2)return;
  if(K.p.length===1&&sp!=null){if(P.length>sp+1){kRope(P.slice(0,sp+1),KC.s,L,1,0);kRope(P.slice(sp),KC.w,L,0,1)}else kRope(P,KC.s,L)}
  else kRope(P,(K.cols||[KC.s,KC.w,KC.s])[si],L)});
 (K.ob||[]).forEach(o=>L.push(Object.assign({obj:1},o)));
 const G=L.filter(r=>!r.obj&&!r.cap&&r.z<=-2);if(G.length)L.push({obj:1,t:'ghost',z:-1.4});
 L.sort((a,b)=>a.z-b.z);let h='';
 for(const r of L){if(r.obj){if(r.t==='pole')h+=`<rect x="${r.x}" y="${r.y||0}" width="${r.wd}" height="${r.h||140}" rx="3" fill="#6f6a64" stroke="#3b3835"/>`;
   else if(r.t==='hpole')h+=`<rect x="${r.x||0}" y="${r.y}" width="${r.wd||200}" height="${r.h}" rx="3" fill="#6f6a64" stroke="#3b3835"/>`;
   else if(r.t==='arc')h+=`<path d="${r.d}" fill="none" stroke="#3b3835" stroke-width="9" stroke-linecap="round"/><path d="${r.d}" fill="none" stroke="#a09a93" stroke-width="5" stroke-linecap="round"/>`;
   else if(r.t==='ghost')h+=G.map(g=>`<path d="${g.d}" fill="none" stroke="${g.col}" stroke-width="3" stroke-dasharray="3 3" opacity=".6"/>`).join('');
   else if(r.t==='txt')h+=`<text x="${r.x}" y="${r.y}" fill="#a09a93" font-size="10" text-anchor="middle">${r.s}</text>`;continue}
  if(r.cap){h+=`<circle cx="${r.cap[0]}" cy="${r.cap[1]}" r="5" fill="${KC.o}"/><circle cx="${r.cap[0]}" cy="${r.cap[1]}" r="3.3" fill="${r.col}"/>`;continue}
  h+=`<path d="${r.d}" fill="none" stroke="${KC.o}" stroke-width="10"/><path d="${r.d}" fill="none" stroke="${r.col}" stroke-width="6.6"/><path d="${r.d}" fill="none" stroke="rgba(0,0,0,.16)" stroke-width="6.6" stroke-dasharray="2 4"/>`}
 for(const a of arrs||[])h+=`<path d="${a}" fill="none" stroke="${KC.arr}" stroke-width="2.4" stroke-dasharray="5 3" marker-end="url(#kah)"/>`;
 return `<svg viewBox="0 0 200 140" class="ksvg" role="img"><defs><marker id="kah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="${KC.arr}"/></marker></defs>${h}</svg>`}

/* ---------- Οι κόμποι ---------- */
const KNOTS2=[
{id:'f8',cat:'stop',w:3,
 p:[[[8,90],[30,90],[50,90],[75,90],[96,90,-1],[122,88],[140,72,1],[146,55],[132,36],[108,32],[90,46],[84,64,-1],[96,90,1],[104,112],[84,124],[58,118],[50,90,-1],[54,70],[70,64],[84,64,1],[104,62],[124,68],[140,72,-1],[156,88],[178,100]]],
 st:[{c:16,a:['M100,118 C70,132 44,122 46,96']},{c:20,a:['M56,68 C80,58 110,58 132,70']},{}],
 el:{n:'Οκτάρι (κόμπος-στοπ)',u:'Στην άκρη του σχοινιού, για να μη φύγει από τροχαλία, κρίκο ή σφιγκτήρα. Δεν μαγκώνει και λύνεται εύκολα.',s:['Κάνε μια θηλιά: η άκρη περνάει ΠΑΝΩ από το σχοινί.','Φέρε την άκρη γύρω από το σχοινί, από ΠΙΣΩ.','Πέρασε την άκρη μέσα στη θηλιά από μπροστά και σφίξε. Σχηματίζει «8».']},
 en:{n:'Figure eight (stopper)',u:'At the end of a rope so it can’t run out of a pulley, ring or clamp. Doesn’t jam and unties easily.',s:['Make a loop: the end crosses OVER the rope.','Take the end around BEHIND the rope.','Pass the end through the loop from the front and tighten. It forms an “8”.']}},
{id:'bowline',cat:'loop',w:12,
 p:[[[100,4],[100,26,1],[100,52,-1],[114,58,-1],[120,74],[112,88,1],[100,93],[88,88,1],[80,74],[86,58,-1],[100,52,1],[113,46,-1],[132,44],[148,62],[150,96],[132,124],[100,134],[66,124],[54,100],[70,94],[88,88,-1],[94,72],[86,58,1],[84,38],[100,26,-1],[114,34],[113,46,1],[114,58,1],[110,74],[112,88,-1],[118,106]]],
 st:[{c:14,a:['M150,100 C140,140 60,136 56,104']},{c:24,a:['M84,36 C88,14 114,16 114,32']},{}],
 el:{n:'Αγκύλη (Bowline)',u:'Σταθερή θηλιά που δεν σφίγγει και λύνεται εύκολα ακόμα και μετά από φορτίο. Για δέσιμο σε δέντρο, κρίκο ή γύρω από άνθρωπο σε διάσωση. Χωρίς φορτίο μπορεί να χαλαρώσει — άφησε μακριά άκρη.',s:['Κάνε μικρή θηλιά στο σχοινί — το κομμάτι προς την άκρη να περνάει ΠΑΝΩ. Άφησε αρκετό σχοινί για τη μεγάλη θηλιά.','«Ο λαγός βγαίνει από τη φωλιά»: η άκρη ανεβαίνει μέσα από τη μικρή θηλιά από κάτω.','«Γύρω από το δέντρο και πίσω στη φωλιά»: η άκρη περνάει πίσω από το σχοινί και ξανακατεβαίνει στη μικρή θηλιά. Σφίξε τραβώντας το σχοινί.']},
 en:{n:'Bowline',u:'A fixed loop that won’t tighten and unties easily even after a load. For tying to a tree or ring, or around a person in a rescue. Can loosen when unloaded — leave a long tail.',s:['Make a small loop in the rope — the end side lies ON TOP. Leave enough rope for the big loop.','“The rabbit comes out of the hole”: the end comes up through the small loop from underneath.','“Around the tree and back down the hole”: the end goes behind the rope and back down through the small loop. Tighten by pulling the rope.']}},
{id:'clove',cat:'hitch',w:3,ob:[{t:'pole',x:85,wd:30,z:-1.5}],
 p:[[[6,40],[50,40],[82,40],[100,40,-1],[118,40],[100,58,-2],[82,76],[100,54,1],[118,32],[100,45,-2],[82,58],[100,58,-1],[118,58],[150,58],[194,58]]],
 st:[{c:7,a:['M76,80 C92,70 112,44 122,30']},{c:11,a:['M76,60 C100,60 140,60 170,60']},{}],
 el:{n:'Ψαλιδιά (Clove hitch)',u:'Γρήγορο δέσιμο σε κοντάρι, πάσσαλο ή σωλήνα σχάρας. Ρυθμίζεται εύκολα. Σε κάτι που γυρίζει μπορεί να γλιστρήσει — κλείδωσέ τη με έναν μισό κόμπο.',s:['Τύλιξε μία φορά γύρω από το κοντάρι.','Πέρασε ΠΑΝΩ από το σχοινί σου (χιαστί) και τύλιξε δεύτερη φορά.','Βάλε την άκρη ΚΑΤΩ από το χιαστί και τράβα και τις δύο άκρες.']},
 en:{n:'Clove hitch',u:'Quick tie to a pole, stake or roof-rack bar. Easy to adjust. On anything that rotates it can slip — lock it with a half hitch.',s:['Wrap once around the pole.','Cross OVER your rope (an X) and wrap a second time.','Tuck the end UNDER the X and pull both ends tight.']}},
{id:'rt2hh',cat:'hitch',w:8,ob:[{t:'pole',x:128,wd:26,z:-1.5}],
 p:[[[4,50],[40,50],[52,50,1],[64,50,-1],[76,50],[86,50,1],[98,50,-1],[114,50],[126,50],[141,48],[156,52],[141,57,-2],[126,62],[141,61],[156,65],[141,70,-2],[126,75],[112,82],[100,64,1],[98,50,1],[94,36],[86,38],[86,50,-1],[88,62],[100,64,-1],[84,76],[78,78],[66,64,1],[64,50,1],[60,36],[52,38],[52,50,-1],[54,62],[66,64,-1],[52,76],[40,84]]],
 st:[{c:17,a:['M112,86 C104,78 100,62 100,40']},{c:26,a:['M78,80 C70,74 66,60 66,40']},{}],
 el:{n:'Στροφή και δύο μισοί κόμποι',u:'Το πιο σίγουρο δέσιμο σε δέντρο, κρίκο ή σχάρα που θα κρατήσει φορτίο πολλή ώρα (τέντα, ρυμούλκηση ελαφριού φορτίου, βάρκα). Η διπλή στροφή κρατάει το φορτίο — οι κόμποι μόνο κλειδώνουν.',s:['Κάνε δύο ολόκληρες στροφές γύρω από το κοντάρι (round turn).','Πρώτος μισός κόμπος: η άκρη γύρω από το σχοινί και μέσα από τον εαυτό της.','Δεύτερος μισός κόμπος, ίδια φορά, και σφίξε τον πάνω στον πρώτο.']},
 en:{n:'Round turn & two half hitches',u:'The most secure tie to a tree, ring or rack that must hold a load for a long time (tarp, light towing, a boat). The round turn holds the load — the hitches only lock it.',s:['Make two full turns around the pole (round turn).','First half hitch: the end goes around the rope and through itself.','Second half hitch, same direction, snugged up against the first.']}},
{id:'taut',cat:'hitch',w:10,ob:[{t:'pole',x:18,wd:14,z:-1.5}],
 p:[[[196,50],[170,50],[148,50,1],[140,50,-1],[130,50],[120,50,-1],[112,50,1],[104,50,-1],[96,50,1],[70,50],[34,49],[24,54,-2],[14,62],[24,72],[40,80],[90,80],[118,82],[122,67,-1],[120,50,1],[116,38],[109,40],[112,50,-1],[109,64,-1],[104,50,1],[100,38],[93,40],[96,50,-1],[98,62],[109,64,1],[122,67,1],[136,64],[139,58,1],[140,50,1],[144,38],[151,40],[148,50,-1],[150,62],[139,58,-1],[132,56]]],
 st:[{c:17,a:['M118,84 C126,70 124,52 116,40']},{c:28,a:['M98,64 C110,68 130,68 140,46']},{}],
 el:{n:'Ρυθμιζόμενος (Taut-line hitch)',u:'Για τα σχοινιά της σκηνής και της τέντας: σέρνεις τον κόμπο και ρυθμίζεις την τάση χωρίς να λύσεις τίποτα. Κρατάει μόνος του όταν τεντώσει.',s:['Πέρασε το σχοινί γύρω από τον πάσσαλο και φέρ’ το πίσω δίπλα στο σχοινί.','Δύο τυλίγματα γύρω από το σχοινί, ΜΕΣΑ στη θηλιά (προς τον πάσσαλο).','Ένα τύλιγμα ΕΞΩ από τη θηλιά, πέρασε την άκρη κάτω από τον εαυτό της και σφίξε. Σύρε τον κόμπο για να τεντώσεις.']},
 en:{n:'Taut-line hitch',u:'For tent and tarp guy lines: slide the knot to adjust tension without untying anything. Holds by itself once loaded.',s:['Pass the line around the stake and bring it back alongside the line.','Two wraps around the line, INSIDE the loop (towards the stake).','One wrap OUTSIDE the loop, tuck the end under itself and tighten. Slide the knot to tension.']}},
{id:'sheet',cat:'bend',p:[
  [[4,50],[40,50],[78,50,1],[92,50],[104,50,-1],[126,50],[146,64],[126,78],[110,78,1],[96,78,-1],[78,78,1],[40,78],[4,78]],
  [[112,136],[110,104],[110,78,-1],[108,66],[106,58,1],[104,50,1],[98,34],[84,30],[76,40],[78,50,-1],[78,78,-1],[80,94],[92,96],[96,78,1],[100,68],[106,58,-1],[118,54]]],
 st:[{c:[13,6],a:['M100,36 C86,26 72,34 76,60']},{c:[13,13],a:['M92,98 C98,86 102,72 112,56']},{}],
 el:{n:'Ενωτικός (Sheet bend)',u:'Ενώνεις δύο σχοινιά, ακόμα και διαφορετικού πάχους ή υλικού. Το χοντρό κάνει το «U».',s:['Κάνε «U» με το χοντρό σχοινί. Το λεπτό ανεβαίνει μέσα από το U από κάτω.','Το λεπτό τυλίγει από ΠΙΣΩ και τα δύο σκέλη του U.','Πέρασε την άκρη του λεπτού ΚΑΤΩ από τον εαυτό του (όχι μέσα στο U) και σφίξε. Οι δύο άκρες να βγαίνουν από την ίδια πλευρά.']},
 en:{n:'Sheet bend',u:'Joins two ropes, even of different thickness or material. The thicker one makes the “U”.',s:['Make a “U” with the thicker rope. The thin one comes up through the U from underneath.','The thin rope wraps BEHIND both legs of the U.','Tuck the thin end UNDER itself (not into the U) and tighten. Both short ends should be on the same side.']}},
{id:'timber',cat:'hitch',w:9,ob:[{t:'hpole',y:54,h:35,z:-1.5}],
 p:[[[196,22],[170,22],[135,22],[103,28],[100,44,1],[98,57,-1],[97,76],[100,108],[81,108],[71,73,-2],[62,47],[55,38],[62,39,-1],[74,41,1],[87,42,-1],[100,44,-1],[113,54],[98,57,1],[90,57],[87,42,1],[81,28],[74,41,-1],[68,54],[62,39,1],[55,25]]],
 st:[{c:12,a:['M55,34 C84,28 116,38 113,57']},{c:18,a:['M90,60 C84,38 71,28 55,28']},{}],
 el:{n:'Ξυλοκόπου (Timber hitch)',u:'Για να σύρεις κορμό ή να δέσεις γρήγορα σε δέντρο. Σφίγγει όσο τραβάς και λύνεται αμέσως μόλις χαλαρώσει. Για σύρσιμο, πρόσθεσε έναν μισό κόμπο πιο μπροστά στον κορμό.',s:['Πέρασε το σχοινί γύρω από τον κορμό.','Η άκρη γύρω από το σχοινί σου (προς τη μεριά του κορμού).','Στρίψε την άκρη 3 φορές γύρω από τον εαυτό της, πάνω στον κορμό, και τράβα.']},
 en:{n:'Timber hitch',u:'For dragging a log or a quick tie to a tree. Tightens as you pull and falls apart once slack. For dragging, add a half hitch further along the log.',s:['Pass the rope around the log.','Take the end around your rope (on the log side).','Twist the end 3 times around itself, against the log, and pull.']}},
{id:'prusik',cat:'stop',cols:[KC.s,KC.w],ob:[{t:'arc',d:'M92,122 a10,10 0 1,0 16,0',z:1.5}],
 p:[[[100,0],[100,30],[100,46,-1],[100,62,-1],[100,78,-1],[100,100],[100,140]],
  [[94,126],[96,100],[88,90],[86,84],[100,78,1],[114,74],[100,70,-2],[86,66],[100,62,1],[114,58],[100,54,-2],[86,50],[100,46,1],[114,42],[104,32,-2],[92,30],[118,30],[124,60],[118,92],[106,104],[106,126]]],
 st:[{c:[7,12]},{}],
 el:{n:'Prusik (κόμπος τριβής)',u:'Κορδόνι κλεισμένο σε κύκλο, πάνω σε χοντρότερο σχοινί: κρατάει όταν φορτίσει, γλιστράει όταν το σπρώχνεις με το χέρι. Για ανάβαση σε σχοινί, «φρένο» ασφαλείας, ή για να κρατήσεις το φορτίο του εργάτη με χειροκίνητο σχοινί. Το κορδόνι πρέπει να είναι πιο λεπτό από το σχοινί.',s:['Τύλιξε τον κύκλο του κορδονιού γύρω από το σχοινί, περνώντας τον κάθε φορά μέσα από τον εαυτό του.','Τρία τυλίγματα (περισσότερα σε γλιστερό σχοινί), ίσια και χωρίς μπερδέματα. Φόρτισε από κάτω.']},
 en:{n:'Prusik (friction hitch)',u:'A cord tied into a loop, on a thicker rope: it grips when loaded and slides when you push it by hand. For climbing a rope, a safety brake, or holding a load while you re-rig. The cord must be thinner than the rope.',s:['Wrap the cord loop around the rope, passing it through itself each time.','Three wraps (more on slippery rope), neat and untwisted. Load it from below.']}},
{id:'trucker',cat:'hitch',w:20,ob:[{t:'hpole',y:2,h:10,z:-1.5},{t:'arc',d:'M136,128 a12,12 0 1,0 24,0',z:-1}],
 p:[[[60,12],[60,30],[60,50,-1],[70,60],[76,72,1],[68,82],[56,78],[52,64],[60,50,1],[70,44],[84,52],[90,80],[100,104],[130,122],[148,126,-2],[160,122],[156,112],[140,104],[120,94],[96,82],[76,72,-1],[64,66],[52,64,1],[42,74],[40,96],[44,120]]],
 st:[{c:12},{c:26,a:['M44,122 C46,132 52,134 56,128']}],
 el:{n:'Φορτηγατζή (Trucker’s hitch)',u:'Δένεις φορτίο ή τέντα πολύ σφιχτά: η θηλιά δουλεύει σαν τροχαλία και σου δίνει διπλή δύναμη. Λύνεται εύκολα μετά.',s:['Κάνε μια θηλιά στη μέση του σχοινιού (η πιο εύκολη: συρόμενη θηλιά).','Πέρασε την άκρη από τον γάντζο/κρίκο, ανέβασέ τη μέσα από τη θηλιά και τράβα προς τα κάτω — διπλή δύναμη.','Κράτα το τεντωμένο και κλείδωσε με δύο μισούς κόμπους γύρω από τα δύο σχοινιά κάτω από τη θηλιά.']},
 en:{n:'Trucker’s hitch',u:'Ties down a load or tarp really tight: the loop works like a pulley and doubles your pull. Unties easily afterwards.',s:['Make a loop in the middle of the rope (easiest: a slipped loop).','Pass the end round the hook/ring, up through the loop and pull down — double the force.','Hold it tight and lock it with two half hitches around both lines below the loop.']}},
{id:'reef',cat:'bend',
 el:{n:'Ψαθί / Ναυτικός (Reef knot)',u:'ΜΟΝΟ για να δέσεις δέμα, σακούλα ή επίδεσμο. ΠΟΤΕ για να ενώσεις σχοινιά που θα φορτίσουν — λύνεται μόνο του. Για ένωση σχοινιών: Ενωτικός ή Διπλός ψαράδικος.',s:['Δεξί πάνω από αριστερό και στρίψε.','Αριστερό πάνω από δεξί και στρίψε. Οι άκρες να βγαίνουν από την ίδια μεριά — αλλιώς είναι «γιαγιάς» και γλιστράει.']},
 en:{n:'Reef knot',u:'ONLY for tying a parcel, bag or bandage. NEVER to join ropes that will be loaded — it can spill. To join ropes: sheet bend or double fisherman’s.',s:['Right over left and twist.','Left over right and twist. The ends must come out on the same side — otherwise it’s a “granny” and slips.']}},
{id:'dfish',cat:'bend',
 el:{n:'Διπλός ψαράδικος (Double fisherman’s)',u:'Ενώνει μόνιμα δύο σχοινιά ή κλείνει κορδόνι σε κύκλο (π.χ. για Prusik). Πολύ γερός· μετά από φορτίο δύσκολα λύνεται.',s:['Βάλε τα δύο σχοινιά παράλληλα, με τις άκρες αντίθετα.','Η άκρη του πρώτου κάνει δύο στροφές γύρω από το δεύτερο και περνάει μέσα από τις στροφές (διπλός απλός κόμπος).','Το ίδιο με την άκρη του δεύτερου, προς την άλλη μεριά. Τράβα τα σχοινιά — οι δύο κόμποι κολλάνε ο ένας στον άλλο. Άκρες τουλάχιστον 5 cm.']},
 en:{n:'Double fisherman’s',u:'Permanently joins two ropes or closes a cord into a loop (e.g. for a Prusik). Very strong; hard to untie after loading.',s:['Lay the two ropes side by side, ends pointing opposite ways.','The end of the first makes two turns around the second and goes back through the turns (a double overhand).','Same with the second end, the other way. Pull the ropes — the two knots slide together. Tails at least 5 cm.']}},
{id:'fig8loop',cat:'loop',
 el:{n:'Οκτάρι θηλιά (Figure-eight loop)',u:'Η πιο σίγουρη σταθερή θηλιά, ελέγχεται με μια ματιά. Για κρίκο ασφαλείας, σημείο ανάκτησης με σχοινί, ή να δέσεις άνθρωπο. Μετά από βαρύ φορτίο λύνεται δύσκολα.',s:['Κάνε Οκτάρι (δες πάνω) αφήνοντας μακριά άκρη.','Πέρασε την άκρη γύρω από το δέντρο/κρίκο αν χρειάζεται.','Ακολούθησε με την άκρη την ίδια διαδρομή του 8 ανάποδα, παράλληλα με το πρώτο σχοινί. Σφίξε όλα τα σκέλη.']},
 en:{n:'Figure-eight loop',u:'The most secure fixed loop, easy to check at a glance. For a safety ring, a rope recovery point, or tying in a person. Hard to untie after a heavy load.',s:['Tie a figure eight (above) with a long tail.','Pass the end around the tree/ring if needed.','Follow the same path of the 8 back with the end, parallel to the first rope. Tighten every strand.']}},
{id:'butterfly',cat:'loop',
 el:{n:'Πεταλούδα (Alpine butterfly)',u:'Θηλιά στη ΜΕΣΗ του σχοινιού, που αντέχει τράβηγμα προς κάθε κατεύθυνση. Για σημείο πιασίματος σε σχοινί, ή για να απομονώσεις φθαρμένο κομμάτι.',s:['Τύλιξε το σχοινί δύο φορές γύρω από την παλάμη σου.','Πάρε το τύλιγμα που είναι πιο κοντά στα δάχτυλα, φέρ’ το πάνω από τα άλλα δύο και πέρασέ το κάτω από αυτά.','Τράβα τη θηλιά και τις δύο άκρες προς αντίθετες μεριές.']},
 en:{n:'Alpine butterfly',u:'A loop in the MIDDLE of a rope that takes a pull in any direction. For a handhold on a line, or to isolate a damaged section.',s:['Wrap the rope twice around your palm.','Take the wrap nearest your fingertips, bring it over the other two and pass it under them.','Pull the loop and the two ends in opposite directions.']}}
];
const KCAT={loop:['Θηλιές','Loops'],hitch:['Δεσίματα σε κοντάρι, δέντρο, κρίκο','Hitches to a pole, tree or ring'],bend:['Ενώσεις σχοινιών','Joining ropes'],stop:['Στοπ και τριβής','Stoppers and friction']};
function kCard(K,i){const t=K[LANG==='en'?'en':'el'];const st=K.p?(K.st||[{}]):[];
 return `<div class="box" data-nt id="kn_${K.id}"><b>${t.n}</b><div class="muted" style="margin:2px 0 8px">${t.u}</div>`+
  (st.length?`<div class="kgrid">`+st.map((s,j)=>`<figure class="kfig" onclick="this.classList.toggle('big')">${kSVG(K,s.c,s.a)}<figcaption><b>${j+1}</b> ${t.s[j]||''}</figcaption></figure>`).join('')+'</div>':'')+
  (t.s.length>st.length?'<ol start="'+(st.length+1)+'" class="ksteps">'+t.s.slice(st.length).map(x=>`<li>${x}</li>`).join('')+'</ol>':'')+'</div>'}
function tKnots(){T(L2('🪢 Κόμποι','🪢 Knots'));const o=['loop','hitch','bend','stop'];
 M.innerHTML=`<style>.kgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.kfig{margin:0;background:rgba(0,0,0,.25);border-radius:10px;padding:5px;cursor:zoom-in}.kfig.big{grid-column:1/-1;cursor:zoom-out}.ksvg{width:100%;display:block}.kfig figcaption{font-size:.82em;line-height:1.3;margin-top:3px}.ksteps{margin:6px 0 0 18px;padding:0}</style>`+
 `<div class="tip">${L2('Πορτοκαλί = η άκρη που δουλεύεις, μπεζ = το σχοινί. Πάτα ένα σχέδιο για να μεγαλώσει. Μάθε τους στο σπίτι με ένα κορδόνι — όχι τη στιγμή που τους χρειάζεσαι.','Orange = the working end, beige = the rope. Tap a drawing to enlarge it. Learn them at home with a piece of cord — not when you need them.')}</div>`+
 o.map(c=>`<h3 style="margin:14px 0 4px">${KCAT[c][LANG==='en'?1:0]}</h3>`+KNOTS2.filter(k=>k.cat===c).map(kCard).join('')).join('')+
 `<div class="tip">⚠️ ${L2('Ιμάντα ρυμούλκησης ή απεγκλωβισμού ΠΟΤΕ δεν τον δένεις κόμπο — χάνει μέχρι και τη μισή αντοχή του. Ενώνεις ιμάντες μόνο με σακάκι (soft shackle) ή με τον έναν μέσα στο μάτι του άλλου και ένα ξύλο/τυλιγμένο πανί στη μέση.','NEVER tie a knot in a tow or recovery strap — it can lose up to half its strength. Join straps only with a soft shackle, or loop one through the other’s eye with a stick/rolled cloth in the middle.')}</div>`}
