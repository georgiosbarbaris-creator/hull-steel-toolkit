/* ===== Overland’s Habit · 🏗️ Βάρος στην οροφή & πλευρική κλίση (Created by George Barbaris) =====
   Στατικό μοντέλο: το όχημα ανατρέπεται όταν η κατακόρυφος από το κέντρο βάρους (ΚΒ) περάσει έξω από τον κάτω τροχό.
   Γωνία ανατροπής = atan( (μετατρόχιο/2) / ύψος ΚΒ ). Ύψος ΚΒ άδειου ≈ 0,42 × ύψος οχήματος (ίδιο με το sideLim).
   Φορτίο οροφής στο ύψος: ύψος οχήματος + ύψος σχάρας + μισό ύψος φορτίου. Φορτίο καμπίνας ≈ στο ύψος του ΚΒ.
   Ασφαλές όριο = γωνία ανατροπής − 15° (ίδιο περιθώριο με το υπόλοιπο app), ή όριο κατασκευαστή μείον την απώλεια. */
const RFSAFE=15;
function rfTip(track,cg){return Math.atan(track/(2*cg))/SR}
/* m0 = μάζα χωρίς οροφή, cg0 = ΚΒ (m), mr = οροφή kg, hr = ύψος ΚΒ φορτίου οροφής (m) */
function rfCg(m0,cg0,mr,hr){return (m0*cg0+mr*hr)/(m0+mr)}
function rfCalc(o){/* o: track,h,curb,cab,roof,rack(cm),ch(cm),side */
 const cg0=o.h*0.42,m0=o.curb+o.cab,hr=o.h+o.rack/100+o.ch/200,cg1=rfCg(m0,cg0,o.roof,hr);
 const t0=rfTip(o.track,cg0),t1=rfTip(o.track,cg1),loss=t0-t1,base=o.side?+o.side:t0-RFSAFE;
 return{cg0,cg1,hr,t0,t1,loss,base,lim:base-loss}}
function rfSt(){const v=veh()||{},d={cab:250,roof:100,rack:10,ch:30,use:0,all:0};const st=LS.g('rf',null)||d;
 for(const k in d)if(st[k]==null)st[k]=d[k];
 if(st.track==null||st.vid!==(v.id||'')){st.vid=v.id||'';st.track=+v.track||1.6;st.h=+v.h||1.85;st.curb=+v.curb||Math.round((+v.gvw||2800)*0.72)}
 return st}
/* όριο πλευρικής κλίσης με το φορτίο οροφής, όταν ο Καπετάνιος το έχει ενεργοποιήσει */
function sideLimL(v){const b=sideLim(v);const st=LS.g('rf',null);if(!st||!st.use||!st.roof||!v||!v.track||!v.h)return b;
 const r=rfCalc({track:+v.track,h:+v.h,curb:+v.curb||Math.round((+v.gvw||2800)*0.72),cab:st.cab,roof:st.roof,rack:st.rack,ch:st.ch,side:v.side});return Math.max(5,Math.round(b-r.loss))}
function tRoof(){T('🏗️ '+L2('Βάρος στην οροφή','Roof load'));const v=veh(),st=rfSt();LS.s('rf',st);
 M.innerHTML=vehBar()+`<div class="muted">${L2('Πόσες μοίρες πλευρικής κλίσης χάνεις όταν φορτώνεις ψηλά (σκηνή οροφής, σχάρα, μπιτόνια, ρεζέρβα). Τα στοιχεία έρχονται από το όχημα, μπορείς να τα αλλάξεις.','How many degrees of side slope you lose when you load high (rooftop tent, rack, jerrycans, spare). Values come from your vehicle; you can change them.')}</div>
 <div class="grid"><div>${inp('rft',L2('Μετατρόχιο (m)','Track (m)'),st.track,'rfC()')}</div><div>${inp('rfh',L2('Ύψος οχήματος (m)','Vehicle height (m)'),st.h,'rfC()')}</div>
 <div>${inp('rfm',L2('Απόβαρο (kg)','Kerb weight (kg)'),st.curb,'rfC()')}</div><div>${inp('rfc',L2('Μέσα: άτομα & φορτίο (kg)','Inside: people & cargo (kg)'),st.cab,'rfC()')}</div></div>
 <div class="box" style="border-color:var(--org)">${inp('rfr',L2('Βάρος στην οροφή (kg), σχάρα + ό,τι έχει πάνω','Weight on the roof (kg), rack + everything on it'),st.roof,'rfC()')}
 <input id="rfrs" type="range" min="0" max="400" step="5" value="${st.roof}" oninput="$('#rfr').value=this.value;rfC()" style="width:100%">
 <div class="grid"><div>${inp('rfk',L2('Ύψος σχάρας πάνω από την οροφή (cm)','Rack height above roof (cm)'),st.rack,'rfC()')}</div><div>${inp('rfch',L2('Ύψος φορτίου πάνω στη σχάρα (cm)','Height of the load on the rack (cm)'),st.ch,'rfC()')}</div></div>
 <div class="muted">${L2('Σκηνή οροφής κλειστή ≈ 30 cm, μπαγκαζιέρα ≈ 40 cm, μπιτόνια όρθια ≈ 45 cm.','Closed rooftop tent ≈ 30 cm, roof box ≈ 40 cm, upright jerrycans ≈ 45 cm.')}</div></div>
 <div id="rfo"></div>
 <div class="box"><b>${L2('Τι ΔΕΝ μετράει ο υπολογισμός','What the calculation does NOT include')}</b>
 <div class="li">${L2('Είναι <b>στατικός</b>: όχημα ακίνητο, σε σκληρό έδαφος. Η ανάρτηση και τα ελαστικά γέρνουν το αμάξωμα 2–4° ακόμα προς την κατηφόρα, περισσότερο με μαλακά ελατήρια και χαμηλή πίεση.','It is <b>static</b>: vehicle still, on hard ground. Suspension and tyres lean the body another 2–4° downhill, more with soft springs and low pressure.')}</div>
 <div class="li">${L2('Πέτρα κάτω από τον πάνω τροχό ή λακκούβα κάτω από τον κάτω προσθέτουν μοίρες απότομα. Γι’ αυτό το περιθώριο 15°.','A rock under the upper wheel or a hole under the lower one adds degrees suddenly. That is why the 15° margin.')}</div>
 <div class="li">${L2('Το ύψος του κέντρου βάρους του άδειου οχήματος είναι εκτίμηση (0,42 × ύψος). Αν ο κατασκευαστής δίνει όριο πλευρικής κλίσης, μετράει αυτό.','The empty centre-of-gravity height is an estimate (0.42 × height). If the maker gives a side-slope limit, that one is used.')}</div>
 <div class="li">${L2('Το όριο της σχάρας «εν κινήσει» (δυναμικό) είναι άλλο θέμα: δες το εγχειρίδιο του αυτοκινήτου και της σχάρας.','The rack\'s “driving” (dynamic) limit is a separate matter: check the vehicle and rack manuals.')}</div>
 <div class="tools"><button class="btn" onclick="go('t/incl')">📐 ${L2('Κλισιόμετρο','Inclinometer')}</button><button class="btn" onclick="go('t/payload')">⚖️ ${L2('Βάρος & φορτίο','Weight & payload')}</button><button class="btn" onclick="go('learn/side')">🎓 ${L2('Μάθημα: Πλευρική κλίση','Lesson: Side slope')}</button></div></div>
 <div id="rfall"></div>`;
 calc=rfC;rfC()}
function rfIn(){const st=rfSt();Object.assign(st,{track:n($('#rft').value),h:n($('#rfh').value),curb:n($('#rfm').value),cab:n($('#rfc').value),roof:n($('#rfr').value),rack:n($('#rfk').value),ch:n($('#rfch').value)});
 if($('#rfrs'))$('#rfrs').value=st.roof;LS.s('rf',st);return st}
function rfC(){const st=rfIn(),v=veh()||{},o=$('#rfo');
 if(!(st.track>0.8&&st.h>1&&st.curb>300)){o.innerHTML=`<div class="note">${L2('Γράψε μετατρόχιο (m), ύψος (m) και απόβαρο (kg).','Enter track (m), height (m) and kerb weight (kg).')}</div>`;return}
 const side=(v.id&&v.id===st.vid&&v.side&&+v.track===st.track&&+v.h===st.h)?+v.side:0;
 const R=rfCalc({track:st.track,h:st.h,curb:st.curb,cab:st.cab,roof:st.roof,rack:st.rack,ch:st.ch,side});
 const pct=R.base>0?R.loss/R.base*100:0,per50=st.roof>0?R.loss/st.roof*50:0,col=R.lim>=25?'ok':R.lim>=20?'mid':'bad';
 const rows=[0,50,100,150,200,300].map(kg=>{const x=rfCalc({track:st.track,h:st.h,curb:st.curb,cab:st.cab,roof:kg,rack:st.rack,ch:st.ch,side});
  return`<tr${kg===Math.round(st.roof)?' style="background:#3a2a20"':''}><td>${kg} kg</td><td>${f0(x.cg1*100)} cm</td><td>${f1(x.t1)}°</td><td><b class="${x.base-x.loss>=25?'ok':x.base-x.loss>=20?'mid':'bad'}">${f0(x.base-x.loss)}°</b></td><td>−${f1(x.loss)}°</td></tr>`}).join('');
 o.innerHTML=`<div class="res"><div class="muted">${L2('Ασφαλές όριο πλευρικής κλίσης','Safe side-slope limit')}${side?` (${L2('από το όριο κατασκευαστή','from the maker\'s limit')} ${side}°)`:''}</div>
 <div class="grid" style="margin-top:6px"><div><div class="muted">${L2('Χωρίς οροφή','No roof load')}</div><div class="v" style="font-size:1.7em">${f0(R.base)}°</div></div><div><div class="muted">${L2('Με','With')} ${f0(st.roof)} kg ${L2('πάνω','on top')}</div><div class="v ${col}" style="font-size:1.7em">${f0(R.lim)}°</div></div></div>
 <div style="margin-top:8px">${L2('Χάνεις','You lose')} <b class="${R.loss<2?'ok':R.loss<4?'mid':'bad'}">${f1(R.loss)}°</b> (${f0(pct)}%) · ${L2('κάθε 50 kg στην οροφή ≈','every 50 kg on the roof ≈')} <b>${f1(per50)}°</b></div>
 <div class="muted">${L2('Κέντρο βάρους','Centre of gravity')}: ${f0(R.cg0*100)} → <b>${f0(R.cg1*100)} cm</b> ${L2('από το έδαφος','above ground')} (+${f0((R.cg1-R.cg0)*100)} cm) · ${L2('ανατροπή','tip-over')} ${f1(R.t0)}° → ${f1(R.t1)}°</div></div>
 ${rfSvg(st,R)}
 <div class="box"><b>${L2('Πίνακας για αυτό το όχημα','Table for this vehicle')}</b><table class="t" style="font-size:.88em;white-space:nowrap"><tr><th>${L2('Οροφή','Roof')}</th><th>${L2('Ύψος ΚΒ','CG height')}</th><th>${L2('Ανατροπή','Tip-over')}</th><th>${L2('Ασφαλές','Safe')}</th><th>${L2('Απώλεια','Loss')}</th></tr>${rows}</table>
 <div class="muted">${L2('Ασφαλές = ανατροπή − 15°. Πράσινο ≥ 25°, κίτρινο 20–24°, κόκκινο κάτω από 20°.','Safe = tip-over − 15°. Green ≥ 25°, yellow 20–24°, red below 20°.')}</div></div>
 ${v.id?`<div class="box"><label style="display:flex;gap:8px;align-items:center;margin:0"><input type="checkbox" style="width:auto;margin:0" ${st.use?'checked':''} onchange="const s=LS.g('rf',{});s.use=this.checked?1:0;LS.s('rf',s)"> <span>${L2('Χρησιμοποίησε το όριο <b>με το φορτίο οροφής</b> στο κλισιόμετρο και στο «Θα περάσω;»','Use the limit <b>with the roof load</b> in the inclinometer and in “Will I make it?”')}</span></label></div>`:''}
 <button class="btn" style="width:100%" onclick="const s=LS.g('rf',{});s.all=s.all?0:1;LS.s('rf',s);rfAll()">🚙 ${L2('Σύγκριση: όλα τα οχήματα της βάσης με το ίδιο φορτίο','Compare: every vehicle in the database with the same load')}</button>`;
 rfAll()}
/* Σχέδιο: όχημα από πίσω, γερμένο στο ασφαλές όριο με φορτίο, ΚΒ άδειο και φορτωμένο */
function rfSvg(st,R){const W=320,H=190,gx=200,gy=138,sc=Math.min(42,82/st.h),tw=st.track*sc,hh=st.h*sc,a=-R.lim;
 const cg0=R.cg0*sc,cg1=R.cg1*sc,rk=st.rack/100*sc,ch=st.ch/100*sc,lw=Math.max(0,Math.min(1,st.roof/150));
 const car=`<g transform="translate(${gx},${gy}) rotate(${a.toFixed(1)}) "><rect x="${-tw/2-6}" y="${-hh*0.95}" width="${tw+12}" height="${hh*0.72}" rx="9" fill="#3a2a20" stroke="#d97757" stroke-width="2.5"/>
 <rect x="${-tw/2+4}" y="${-hh*0.88}" width="${tw-8}" height="${hh*0.26}" rx="4" fill="#141312"/>
 <rect x="${-tw/2-10}" y="${-hh*0.3}" width="20" height="${hh*0.3}" rx="5" fill="#f5f0e8"/><rect x="${tw/2-10}" y="${-hh*0.3}" width="20" height="${hh*0.3}" rx="5" fill="#f5f0e8"/>
 ${st.roof>0?`<rect x="${-tw/2}" y="${-hh*0.95-rk}" width="${tw}" height="${Math.max(2,rk)}" fill="#8a8580"/><rect x="${-tw/2*(.6+.3*lw)}" y="${-hh*0.95-rk-ch}" width="${tw*(.6+.3*lw)}" height="${ch}" rx="3" fill="#e8b86d" stroke="#1F1E1D"/>`:''}
 <circle cx="0" cy="${-cg0}" r="5" fill="#8a8580" stroke="#f5f0e8"/><circle cx="0" cy="${-cg1}" r="6" fill="#d9534f" stroke="#f5f0e8" stroke-width="1.5"/></g>`;
 /* κατακόρυφος από το φορτωμένο ΚΒ */
 const L=R.lim*Math.PI/180,sn=Math.sin(L),cs=Math.cos(L),px=gx-cg1*sn,py=gy-cg1*cs,lowx=gx-tw/2*cs,lowy=gy+tw/2*sn,tg=Math.tan(L);
 return`<figure class="acfig"><svg viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" rx="10" fill="#2a2826"/>
 <polygon points="0,${(gy+gx*tg).toFixed(1)} ${W},${(gy-(W-gx)*tg).toFixed(1)} ${W},${H} 0,${H}" fill="#4a3f35"/>
 ${car}<line x1="${px.toFixed(1)}" y1="${py.toFixed(1)}" x2="${px.toFixed(1)}" y2="${(gy+(gx-px)*tg).toFixed(1)}" stroke="#d9534f" stroke-width="1.6" stroke-dasharray="4 3"/>
 <circle cx="${lowx.toFixed(1)}" cy="${lowy.toFixed(1)}" r="4.5" fill="#5f9e7a"/>
 <text x="12" y="20" fill="#E8DCC4" font-size="12" font-family="system-ui">${L2('Γερμένο στο ασφαλές όριο','Tilted to the safe limit')}: ${f0(R.lim)}°</text>
 <text x="12" y="36" fill="#d9534f" font-size="11" font-family="system-ui">● ${L2('ΚΒ φορτωμένο','CG loaded')} ${f0(R.cg1*100)} cm</text><text x="12" y="50" fill="#a8a29e" font-size="11" font-family="system-ui">● ${L2('ΚΒ χωρίς οροφή','CG without roof')} ${f0(R.cg0*100)} cm</text></svg>
 <figcaption>${L2('Η κόκκινη διακεκομμένη πέφτει από το κέντρο βάρους. Όσο πέφτει μέσα από τον κάτω τροχό (πράσινη τελεία), το αυτοκίνητο στέκεται. Βάρος ψηλά ανεβάζει το κέντρο βάρους και φέρνει τη γραμμή πιο κοντά στον κάτω τροχό.','The red dashed line drops from the centre of gravity. While it falls inside the lower wheel (green dot), the vehicle stands. Weight up high raises the centre of gravity and brings the line closer to the lower wheel.')}</figcaption></figure>`}
function rfAll(){const st=LS.g('rf',{}),e=$('#rfall');if(!e)return;if(!st.all){e.innerHTML='';return}
 const L=VDB.filter(x=>x.geo&&x.geo.track&&x.geo.h).map(x=>{const g=x.geo,curb=+x.curb||Math.round((+x.gvw||2800)*0.72);
  const R=rfCalc({track:+g.track,h:+g.h,curb,cab:st.cab,roof:st.roof,rack:st.rack,ch:st.ch,side:g.side});return{x,R,curb,est:!x.curb}}).sort((a,b)=>b.R.lim-a.R.lim);
 e.innerHTML=`<div class="box"><b>${L2('Όλα τα οχήματα','All vehicles')}: ${f0(st.roof)} kg ${L2('στην οροφή','on the roof')}, ${f0(st.cab)} kg ${L2('μέσα','inside')}</b>
 <table class="t"><tr><th>${L2('Όχημα','Vehicle')}</th><th>${L2('Χωρίς','Without')}</th><th>${L2('Με','With')}</th><th>${L2('Απώλεια','Loss')}</th></tr>
 ${L.map(({x,R,est})=>`<tr><td style="font-size:.85em">${esc(x.name)}${est?' <span class="muted">*</span>':''}</td><td>${f0(R.base)}°</td><td><b class="${R.lim>=25?'ok':R.lim>=20?'mid':'bad'}">${f0(R.lim)}°</b></td><td>−${f1(R.loss)}°</td></tr>`).join('')}</table>
 <div class="muted">${L2('Ταξινόμηση από το πιο σταθερό. * χωρίς απόβαρο στη βάση: εκτίμηση 72% του GVM. Ελαφρύ όχημα με ψηλό ύψος χάνει τις περισσότερες μοίρες για το ίδιο βάρος.','Sorted from most stable. * no kerb weight in the database: estimated as 72% of GVM. A light, tall vehicle loses the most degrees for the same weight.')}</div></div>`}
