/* Overland’s Habit v0.38
   1) 🛞 Υπενθύμιση φουσκώματος: «🔻 Ξεφούσκωσα» στο εργαλείο πίεσης. Όσο είσαι ξεφουσκωμένος:
      λωρίδα πάνω σε όλες τις σελίδες, GPS ανοιχτό, και συναγερμός (ήχος, δόνηση, οθόνη) αν τρέχεις
      πάνω από το όριο (προεπιλογή 50 km/h) για 10 δευτερόλεπτα. LS: ov_air {t,ter,f,r}, ov_airlim.
   2) 🔙 Point of No Return (#t/pnr): πόσο ακόμα μπορείς να προχωρήσεις και να γυρίσεις στο ασφαλές σημείο
      με το καύσιμο, το νερό και το φως που έχεις. Ο αυστηρότερος περιορισμός κερδίζει. LS: ov_pnr. */

/* ===================== ΥΠΕΝΘΥΜΙΣΗ ΦΟΥΣΚΩΜΑΤΟΣ ===================== */
const AIR={over:0,snooze:0,last:null,shown:0};
function airOn(){return LS.g('air',null)}
function airLim(){return LS.g('airlim',null)||50}
function airDown(ter,f,r){LS.s('air',{t:Date.now(),ter,f,r});AIR.over=0;AIR.snooze=0;startGeo();if(!keepOn&&confirm(L2('Να μένει η οθόνη ανοιχτή; Το iPhone δεν δίνει GPS όταν κλειδώνει η οθόνη, άρα ο συναγερμός δουλεύει μόνο με την εφαρμογή ανοιχτή.','Keep the screen on? iPhone gives no GPS while the screen is locked, so the alarm only works with the app open.'))){keepOn=true;LS.s('keepon',true);wake(1)}airBanner();if(location.hash.slice(1)==='t/tyre')tTyre()}
function airUp(){LS.s('air',null);AIR.over=0;airOff();airBanner();const r=location.hash.slice(1);if(r==='t/tyre')tTyre();else if(r==='home'||!r)home()}
function airAgo(t){const m=Math.round((Date.now()-t)/6e4);return m<60?m+' '+L2('λεπτά','min'):Math.floor(m/60)+' '+L2('ώρ.','h')+' '+(m%60)+' '+L2('λ.','min')}
function airBanner(){let b=$('#airb');if(!b){b=document.createElement('div');b.id='airb';$('header').after(b)}const a=airOn();
 if(!a){b.innerHTML='';b.style.display='none';return}b.style.display='block';
 b.innerHTML=`<div onclick="go('t/tyre')">🛞 <b>${L2('Ξεφουσκωμένα','Aired down')}</b> ${a.f?esc(a.f)+'/'+esc(a.r)+' psi':''} · ${airAgo(a.t)} · ${L2('συναγερμός','alarm')} &gt;${airLim()} km/h</div><button onclick="event.stopPropagation();airUp()">✅ ${L2('Φούσκωσα','Aired up')}</button>`}
function airBox(t,f,r){const a=airOn();
 if(a)return`<div class="box" style="border-color:var(--yel)"><b>🔻 ${L2('Είσαι ξεφουσκωμένος','You are aired down')}</b><div class="muted">${L2('από πριν','for')} ${airAgo(a.t)}${a.f?' · '+esc(a.f)+' / '+esc(a.r)+' psi':''}</div>
 <label>${L2('Συναγερμός όταν τρέχεις πάνω από (km/h)','Alarm when faster than (km/h)')}</label><input type="number" inputmode="numeric" value="${airLim()}" onchange="LS.s('airlim',Math.max(20,n(this.value)||50));airBanner()">
 <button class="big grn" onclick="airUp()">✅ ${L2('Φούσκωσα, όλα στην πίεση δρόμου','Aired up, back to road pressure')}</button></div>`;
 if(t.id==='road')return'';
 return`<button class="big org" onclick="airDown('${t.id}','${f}','${r}')">🔻 ${L2('Ξεφούσκωσα τώρα','I\'ve aired down now')}<small>${L2('θα σου θυμίσω να φουσκώσεις πριν την άσφαλτο','I\'ll remind you to air up before the tarmac')}</small></button>`}
function airAlarm(kmh){if(AIR.shown)return;AIR.shown=1;vib([600,200,600,200,600]);try{for(let i=0;i<3;i++)setTimeout(()=>beep(880,350,.9,'square'),i*600)}catch(e){}
 let o=$('#airo');if(!o){o=document.createElement('div');o.id='airo';document.body.appendChild(o)}
 o.innerHTML=`<div class="airo-in"><div style="font-size:4em">🛞</div><div style="font-size:1.9em;font-weight:900">${L2('ΦΟΥΣΚΩΣΕ!','AIR UP!')}</div>
 <div style="margin:8px 0 16px">${L2(`Τρέχεις ${Math.round(kmh)} km/h με ξεφουσκωμένα λάστιχα. Σταμάτα σε ασφαλές σημείο και φούσκωσε πριν την άσφαλτο.`,`You are doing ${Math.round(kmh)} km/h on aired down tyres. Stop somewhere safe and air up before the tarmac.`)}</div>
 <button class="big grn" onclick="airOff();airUp()">✅ ${L2('Φούσκωσα','Aired up')}</button><button class="big" style="background:#555" onclick="airOff(5)">⏱️ ${L2('Θύμισέ μου σε 5 λεπτά','Remind me in 5 min')}</button></div>`;o.style.display='flex'}
function airOff(min){const o=$('#airo');if(o)o.style.display='none';AIR.shown=0;AIR.over=0;if(min)AIR.snooze=Date.now()+min*6e4}
/* καλείται από το GPS (port.js startGeo) σε κάθε νέα θέση */
function geoHook(){if(!airOn()||!pos)return;let v=pos.spd;
 if((v==null||isNaN(v))&&AIR.last){const dt=(pos.t-AIR.last.t)/1000;if(dt>0.5)v=dist(AIR.last,pos)/dt}AIR.last={lat:pos.lat,lon:pos.lon,t:pos.t};
 if(v==null||pos.acc>50)return;const kmh=v*3.6;
 if(kmh>airLim()){if(!AIR.over)AIR.over=pos.t;if(pos.t-AIR.over>=10000&&Date.now()>AIR.snooze)airAlarm(kmh)}else AIR.over=0}
(function(){const st=document.createElement('style');st.textContent=`#airb{display:none;position:sticky;top:0;z-index:6;background:#4a3a14;color:#fff;font-size:.86em;padding:6px 10px;border-bottom:1px solid var(--yel)}#airb>div{display:inline;cursor:pointer}#airb button{float:right;background:var(--grn);color:#fff;border:0;border-radius:8px;padding:4px 9px;font-weight:800;font-size:.95em;margin-top:-2px}
#airo{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:#a01e14;color:#fff;text-align:center;padding:20px}.airo-in{max-width:420px;width:100%}`;document.head.appendChild(st)})();
setInterval(()=>{if(airOn())airBanner()},60000);

/* ===================== POINT OF NO RETURN ===================== */
function pnrDef(){const fu=LS.g('fu',null)||{},wa=LS.g('wa',null)||{},v=veh()||{};
 const c=fu.cr?(fu.cr*(1-(fu.off||40)/100)+(fu.co||fu.cr)*(fu.off||40)/100):(v.co||16);
 return{fuel:(fu.tank||v.tank||80)+(fu.jer||0),cons:Math.round(c*10)/10,fres:20,water:20,ppl:wa.p||2,lpd:(wa.dr||3)+(wa.ck||1),back:30,spd:20,light:1,buf:60,home:null}}
function pnrG(){return Object.assign(pnrDef(),LS.g('pnr',null)||{})}
function tPnr(){T('🔙 Point of No Return');const s=pnrG();startGeo();
 const I=(id,l,v)=>`<div><label>${l}</label><input id="pn_${id}" type="number" inputmode="decimal" step="any" value="${esc(v)}" oninput="pnrC()"></div>`;
 M.innerHTML=vehBar()+`<div class="muted">${L2('Όπως στη ναυσιπλοΐα: το σημείο μετά το οποίο δεν φτάνουν τα αποθέματα για να γυρίσεις. Βάλε τι έχεις τώρα, η εφαρμογή λέει πόσο ακόμα μπορείς να πας και τι σε περιορίζει.','As in navigation: the point beyond which your reserves won\'t get you back. Enter what you have now; the app tells you how much further you can go and what limits you.')}</div>
 <div class="box" style="border-color:var(--org)"><b>🏠 ${L2('Ασφαλές σημείο','Safe point')}</b><div class="muted">${L2('Χωριό, πρατήριο ή άσφαλτος όπου όλα λύνονται.','A village, fuel station or tarmac where everything is solved.')}</div>
 <div class="grid">${I('back',L2('Απόσταση πίσω (km)','Distance back (km)'),s.back)}${I('spd',L2('Μέση ταχύτητα εκτός δρόμου (km/h)','Average off-road speed (km/h)'),s.spd)}</div>
 <div class="tools"><button class="btn" onclick="pnrHome()">📍 ${L2('Ασφαλές σημείο = εδώ','Safe point = here')}</button>${s.home?`<button class="btn p" onclick="pnrGps()">📏 ${L2('Απόσταση από GPS','Distance from GPS')}</button>`:''}</div>
 <div class="muted" id="pnhm">${s.home?L2('Ασφαλές σημείο: ','Safe point: ')+s.home.lat.toFixed(4)+', '+s.home.lon.toFixed(4)+' · '+L2('η απόσταση από GPS είναι ευθεία × 1,5 για τις στροφές του χωματόδρομου','GPS distance is straight line × 1.5 for the winding track'):''}</div></div>
 <div class="box"><b>⛽ ${L2('Καύσιμο','Fuel')}</b><div class="grid">${I('fuel',L2('Έχεις τώρα (L, μαζί με μπιτόνια)','You have now (L, incl. jerry cans)'),s.fuel)}${I('cons',L2('Κατανάλωση εκτός δρόμου (L/100km)','Off-road consumption (L/100km)'),s.cons)}${I('fres',L2('Αποθεματικό που δεν αγγίζεις (%)','Reserve you never touch (%)'),s.fres)}</div></div>
 <div class="box"><b>💧 ${L2('Νερό','Water')}</b><div class="grid">${I('water',L2('Έχεις τώρα (L)','You have now (L)'),s.water)}${I('ppl',L2('Άτομα','People'),s.ppl)}${I('lpd',L2('L ανά άτομο τη μέρα','L per person per day'),s.lpd)}</div><div class="muted">${L2('Κρατάμε πάντα 1 μέρα νερό αποθεματικό.','We always keep 1 day of water in reserve.')}</div></div>
 <div class="box"><b>🌇 ${L2('Φως','Daylight')}</b>${seg('light',[[1,L2('Γυρνάω πριν νυχτώσει','Back before dark')],[0,L2('Κατασκηνώνω μπροστά','I\'ll camp ahead')]],s.light,'pnrL')}
 <div class="grid">${I('buf',L2('Περιθώριο πριν το τελευταίο φως (λεπτά)','Margin before last light (min)'),s.buf)}</div><div class="muted" id="pnsun"></div></div>
 <div id="pno"></div>
 <div class="box"><b>${L2('Κανόνες','Rules')}</b><div class="li">${L2('Ο κανόνας των τρίτων: 1/3 για να πας, 1/3 για να γυρίσεις, 1/3 για τα απρόοπτα. Το αποθεματικό εδώ είναι το «τρίτο τρίτο».','The rule of thirds: 1/3 to go, 1/3 to come back, 1/3 for the unexpected. The reserve here is that last third.')}</div><div class="li">${L2('Η επιστροφή είναι συχνά πιο αργή: κούραση, σκοτάδι, αλλαγή καιρού.','The way back is often slower: fatigue, darkness, weather change.')}</div><div class="li">${L2('Πες την ώρα επιστροφής σε όλη την ομάδα πριν ξεκινήσεις, και σεβάσου την.','Tell the whole group the turn-back time before you start, and respect it.')}</div><div class="li">${L2('Αν κάποιο νούμερο δεν το ξέρεις, βάλε το χειρότερο.','If you don\'t know a figure, enter the worst case.')}</div></div>`;
 calc=pnrC;pnrC()}
function pnrL(v){const s=pnrG();s.light=+v;LS.s('pnr',s);tPnr()}
function pnrHome(){const set=c=>{const s=pnrG();s.home={lat:c.lat,lon:c.lon};s.back=0;LS.s('pnr',s);tPnr()};
 if(pos&&Date.now()-pos.t<120000)return set(pos);navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>set({lat:p.coords.latitude,lon:p.coords.longitude}),()=>alert(L2('Δεν βρέθηκε θέση.','No position found.')),{enableHighAccuracy:true,timeout:20000}):alert(L2('Δεν υπάρχει GPS.','No GPS.'))}
function pnrGps(){const s=pnrG();if(!s.home)return;if(!pos)return alert(L2('Περίμενε το GPS.','Wait for GPS.'));const km=dist(s.home,pos)/1000*1.5;$('#pn_back').value=Math.round(km*10)/10;pnrC()}
function pnrSun(){const p=(pos&&{lat:pos.lat,lon:pos.lon})||LS.g('sungps',null)||{lat:37.98,lon:23.73},d=new Date();return Object.assign(sunT(d.getFullYear(),d.getMonth(),d.getDate(),p.lat,p.lon),{src:pos?L2('GPS','GPS'):L2('κατά προσέγγιση (Αθήνα ή τελευταία θέση)','approximate (Athens or last position)')})}
function pnrC(){const g=k=>n(($('#pn_'+k)||{}).value),s=pnrG();['back','spd','fuel','cons','fres','water','ppl','lpd','buf'].forEach(k=>{if($('#pn_'+k))s[k]=g(k)});LS.s('pnr',s);
 const hm=(h)=>{h=Math.max(0,h);const H=Math.floor(h),m=Math.round((h-H)*60);return H?`${H} ${L2('ώρ.','h')} ${m} ${L2('λ.','min')}`:`${m} ${L2('λεπτά','min')}`};
 const spd=Math.max(1,s.spd),tBack=s.back/spd,R=[];
 /* καύσιμο: προχωράς x και γυρνάς back+x → back+2x ≤ εμβέλεια */
 const range=s.cons>0?s.fuel*(1-s.fres/100)/s.cons*100:0;R.push({k:'fuel',e:'⛽',n:L2('Καύσιμο','Fuel'),x:(range-s.back)/2,d:L2(`εμβέλεια ${f0(range)} km με ${s.fres}% αποθεματικό`,`range ${f0(range)} km keeping ${s.fres}% reserve`)});
 /* νερό: ώρες νερού μείον 1 μέρα αποθεματικό */
 const perH=s.ppl*s.lpd/24,wh=perH>0?s.water/perH-24:0;R.push({k:'water',e:'💧',n:L2('Νερό','Water'),x:(wh-tBack)/2*spd,d:L2(`νερό για ${f1(s.water/(s.ppl*s.lpd||1))} μέρες, κρατάμε 1`,`water for ${f1(s.water/(s.ppl*s.lpd||1))} days, keeping 1`)});
 /* φως */
 const su=pnrSun(),last=su.dusk||su.set,sEl=$('#pnsun');
 if(sEl)sEl.innerHTML=last?`${L2('Σήμερα: δύση','Today: sunset')} <b>${new Date(su.set).toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false})}</b>, ${L2('τελευταίο φως','last light')} <b>${new Date(last).toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false})}</b> · ${su.src}`:'';
 let hl=null;if(s.light&&last){hl=(last-Date.now())/36e5-s.buf/60;R.push({k:'light',e:'🌇',n:L2('Φως','Daylight'),x:(hl-tBack)/2*spd,d:L2(`${hm(Math.max(0,hl))} μέχρι το τελευταίο φως μείον περιθώριο`,`${hm(Math.max(0,hl))} to last light minus margin`)})}
 R.forEach(r=>{if(!isFinite(r.x))r.x=0});const lim=R.reduce((a,b)=>b.x<a.x?b:a),x=lim.x,tx=x/spd;
 const turnAt=new Date(Date.now()+Math.max(0,tx)*36e5),ts=turnAt.toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false});
 const col=x<=0?'var(--red)':x<10?'var(--yel)':'var(--grn)';
 const W=300,tot=Math.max(1,s.back+Math.max(0,x)),hx=10,mx=hx+(s.back/tot)*W*.9,px=hx+((s.back+Math.max(0,x))/tot)*W*.9;
 $('#pno').innerHTML=`<div class="res" style="border-color:${col}">${x<=0?`<div class="v bad">↩️ ${L2('ΓΥΡΝΑ ΤΩΡΑ','TURN BACK NOW')}</div><div style="margin-top:6px">${L2('Έχεις περάσει το Point of No Return για','You are past the Point of No Return for')} ${lim.e} <b>${lim.n}</b>.</div>`:
 `<div class="muted">${L2('Μπορείς να προχωρήσεις ακόμα','You can go on for another')}</div><div class="v">${f1(x)} km</div><div class="muted">≈ ${hm(tx)} · ${L2('γύρνα το αργότερο στις','turn back by')} <b style="color:var(--tx)">${ts}</b></div>`}
 <svg viewBox="0 0 320 70" style="width:100%;margin-top:10px"><line x1="${hx}" y1="40" x2="${px}" y2="40" stroke="#5f9e7a" stroke-width="5" stroke-linecap="round"/><line x1="${hx}" y1="40" x2="${mx}" y2="40" stroke="#a8a29e" stroke-width="5" stroke-linecap="round"/>
 <text x="${hx}" y="26" font-size="18">🏠</text><circle cx="${mx}" cy="40" r="8" fill="#d97757"/><text x="${mx}" y="64" font-size="11" fill="#f5f0e8" text-anchor="middle">${L2('εσύ','you')}</text>
 ${x>0?`<text x="${px-6}" y="30" font-size="18">🚩</text><text x="${px}" y="64" font-size="11" fill="#f5f0e8" text-anchor="middle">PNR</text>`:''}<text x="${hx+4}" y="64" font-size="11" fill="#a8a29e">${f1(s.back)} km</text></svg>
 <div style="margin-top:4px">${L2('Περιορίζει:','Limiting factor:')} ${lim.e} <b>${lim.n}</b></div></div>
 <div class="box"><table class="t"><tr><th></th><th>${L2('ακόμα','further')}</th><th></th></tr>${R.map(r=>`<tr ${r===lim?'style="color:var(--yel);font-weight:700"':''}><td>${r.e} ${r.n}</td><td>${r.x<=0?'<span class="bad">0</span>':f1(r.x)+' km'}</td><td class="muted" style="font-size:.85em">${r.d}</td></tr>`).join('')}</table>
 <div class="muted">${L2('Επιστροφή στο ασφαλές σημείο από εδώ:','Return to the safe point from here:')} ${hm(tBack)}</div></div>`}
