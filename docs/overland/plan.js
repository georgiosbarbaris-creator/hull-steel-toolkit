/* Overland’s Habit · 🧭 Σχέδιο εκδρομής (float plan) και 💾 Backup / επαναφορά. v0.37
   Float plan: όπως το voyage plan του πλοίου. Το στέλνεις σε κάποιον που ΔΕΝ έρχεται μαζί σου,
   με ώρα συναγερμού: αν δεν έχει νέα σου ως τότε, καλεί 112. LS: ov_fplan.
   Backup: όλα τα ov_* του localStorage + οι αποθήκες της IndexedDB ov_db σε ένα αρχείο .json. LS: ov_bk_last. */

/* ===================== ΣΧΕΔΙΟ ΕΚΔΡΟΜΗΣ ===================== */
const FP0=()=>{const tr=LS.g('trip',{})||{},v=(typeof veh==='function'&&veh())||{};return{name:tr.n||'',area:'',route:'',camp:'',start:'',ret:'',alarm:'',ppl:tr.ppl||2,names:'',veh:v.model||v.name||'',plate:'',color:'',phones:'',radio:'',sat:'',contact:'',cphone:'',notes:'',sp:null,sent:0,back:0}};
function fpG(){const p=LS.g('fplan',null);return p?Object.assign(FP0(),p):FP0()}
function fpS(k,v){const p=fpG();p[k]=v;if(k==='ret'&&v&&!p.alarmSet){p.alarm=fpAdd(v,3)}if(k==='alarm')p.alarmSet=1;LS.s('fplan',p);if(k==='ret'){const e=$('#fp_alarm');if(e)e.value=p.alarm||''}fpPrev();fpStat()}
function fpAdd(dt,h){const d=new Date(dt);if(isNaN(d))return'';d.setHours(d.getHours()+h);return fpLoc(d)}
function fpLoc(d){const z=x=>String(x).padStart(2,'0');return`${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`}
function fpD(dt){const d=new Date(dt);return isNaN(d)?'':d.toLocaleString(LOC,{weekday:'short',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})}
function fpLeft(dt){const ms=new Date(dt)-Date.now();if(isNaN(ms))return'';const a=Math.abs(ms),h=Math.floor(a/36e5),m=Math.round(a%36e5/6e4),d=Math.floor(h/24);
 const s=d>=2?`${d} ${L2('μέρες','days')}`:h?`${h} ${L2('ώρ.','h')} ${m} ${L2('λ.','min')}`:`${m} ${L2('λεπτά','min')}`;return ms>=0?L2('σε ','in ')+s:L2('πριν από ','')+s+L2('',' ago')}
function fpActive(){const p=LS.g('fplan',null);return p&&p.sent&&!p.back?p:null}
function fpHomeRow(){const p=fpActive();
 if(!p)return`<button class="row" onclick="go('plan')"><span class="e">🧭</span><span><b>${L2('Σχέδιο εκδρομής (float plan)','Trip plan (float plan)')}</b><small>${L2('ποιοι, πού, πότε γυρνάτε · το στέλνεις σε κάποιον που μένει πίσω','who, where, when you\'re back · send it to someone staying home')}</small></span></button>`;
 const late=p.alarm&&new Date(p.alarm)<Date.now();
 return`<button class="row" onclick="go('plan')" style="border-color:${late?'var(--red)':'var(--grn)'}"><span class="e">${late?'⏰':'🧭'}</span><span><b>${esc(p.name||L2('Σχέδιο εκδρομής','Trip plan'))} · ${late?L2('ΠΕΡΑΣΕ η ώρα συναγερμού!','Alarm time has PASSED!'):'🟢 '+L2('σε ισχύ','active')}</b><small>${L2('επιστροφή','return')} ${fpD(p.ret)} (${fpLeft(p.ret)}) · ${L2('πάτα «Γύρισα καλά» όταν γυρίσεις','tap «I\'m back safe» when you return')}</small></span></button>`}

function fpTxt(p){const L=[],ln=(a,b)=>{if(b)L.push(a+' '+b)};
 L.push('🧭 '+L2('ΣΧΕΔΙΟ ΕΚΔΡΟΜΗΣ','TRIP PLAN')+(p.name?': '+p.name:''));
 ln('👥 '+L2('Ποιοι:','Who:'),(p.ppl?p.ppl+' '+L2('άτομα','people'):'')+(p.names?' ('+p.names+')':''));
 ln('🚙 '+L2('Όχημα:','Vehicle:'),[p.veh,p.color,p.plate&&L2('πιν. ','reg. ')+p.plate].filter(Boolean).join(', '));
 ln('🗺️ '+L2('Περιοχή:','Area:'),p.area);ln('🛣️ '+L2('Διαδρομή:','Route:'),p.route);ln('⛺ '+L2('Κατασκήνωση:','Camp:'),p.camp);
 ln('🚀 '+L2('Αναχώρηση:','Departure:'),fpD(p.start));ln('🏁 '+L2('Επιστροφή:','Return:'),fpD(p.ret));
 if(p.sp)L.push('📍 '+L2('Αφετηρία:','Start point:')+` ${p.sp.lat.toFixed(5)}, ${p.sp.lon.toFixed(5)} https://maps.google.com/?q=${p.sp.lat.toFixed(5)},${p.sp.lon.toFixed(5)}`);
 ln('📱 '+L2('Κινητά:','Phones:'),p.phones);ln('📻 '+L2('Ασύρματος:','Radio:'),p.radio);ln('🛰️ '+L2('Δορυφορικό / PLB:','Satellite / PLB:'),p.sat);ln('📝',p.notes);
 if(p.alarm)L.push('','⚠️ '+L2(`Αν ΔΕΝ έχεις νέα μας ως ${fpD(p.alarm)}: 1) πάρε μας τηλέφωνο, 2) αν δεν απαντάμε, κάλεσε το 112 και διάβασέ τους αυτό το μήνυμα.`,`If you have NOT heard from us by ${fpD(p.alarm)}: 1) call us, 2) if we don't answer, call 112 and read them this message.`));
 L.push('','Overland’s Habit');return L.join('\n')}
function fpPrev(){const e=$('#fpprev');if(e)e.textContent=fpTxt(fpG())}
function fpStat(){const e=$('#fpst');if(!e)return;const p=fpG();
 const miss=[!p.ret&&L2('ώρα επιστροφής','return time'),!p.alarm&&L2('ώρα συναγερμού','alarm time'),!(p.area||p.route)&&L2('περιοχή ή διαδρομή','area or route'),!p.cphone&&L2('τηλέφωνο επαφής','contact phone')].filter(Boolean);
 e.innerHTML=miss.length?`<div class="note">${L2('Λείπει:','Missing:')} <b>${miss.join(', ')}</b></div>`:`<div class="tip">✅ ${L2('Το σχέδιο είναι πλήρες. Στείλ\' το.','The plan is complete. Send it.')}</div>`}
function fpIn(k,lbl,ph,type){const p=fpG();return`<label>${lbl}</label><input id="fp_${k}" type="${type||'text'}" value="${esc(p[k]||'')}" placeholder="${esc(ph||'')}" onchange="fpS('${k}',this.value)" ${type==='tel'?'inputmode="tel"':type==='number'?'inputmode="numeric"':''}>`}
function planPage(){T('🧭 '+L2('Σχέδιο εκδρομής','Trip plan'));const p=fpG(),act=fpActive();
 const late=act&&act.alarm&&new Date(act.alarm)<Date.now();
 M.innerHTML=(act?`<div class="res" style="border-color:${late?'var(--red)':'var(--grn)'}"><div class="muted">${L2('Σε ισχύ από','Active since')} ${fpD(new Date(act.sent))}</div>
  <div class="v" style="font-size:1.4em;margin:6px 0">${late?'⏰ '+L2('ΠΕΡΑΣΕ η ώρα συναγερμού','Alarm time has PASSED'):'🏁 '+L2('Επιστροφή','Return')+' '+fpLeft(act.ret)}</div>
  <div class="muted">${L2('Συναγερμός στην επαφή:','Contact alarm:')} ${fpD(act.alarm)} (${fpLeft(act.alarm)})</div>
  <button class="big grn" style="margin-top:10px" onclick="fpBack()">✅ ${L2('Γύρισα καλά','I\'m back safe')}<small>${L2('στέλνει μήνυμα στην επαφή και κλείνει το σχέδιο','messages your contact and closes the plan')}</small></button>
  <div class="tools" style="justify-content:center"><button class="btn" onclick="fpCheck()">📍 ${L2('Στείλε θέση (check-in)','Send position (check-in)')}</button><button class="btn" onclick="fpLater(2)">⏩ +2 ${L2('ώρες','hours')}</button><button class="btn" onclick="fpLater(24)">⏩ +1 ${L2('μέρα','day')}</button></div></div>`:'')+
 `<div class="muted">${L2('Όπως το voyage plan στο πλοίο: κάποιος στη στεριά ξέρει πού είσαι και πότε γυρνάς. Αν δεν έχει νέα σου ως την ώρα συναγερμού, ξέρει τι να κάνει και τι να πει στο 112.','Like a ship\'s voyage plan: someone ashore knows where you are and when you\'re back. If they haven\'t heard from you by the alarm time, they know what to do and what to tell 112.')}</div>
 <div class="box"><div style="margin-bottom:6px"><b>👥 ${L2('Ποιοι & όχημα','Who & vehicle')}</b></div>
 ${fpIn('name',L2('Όνομα εκδρομής','Trip name'),L2('π.χ. Άγραφα, Νοέμβριος','e.g. Agrafa, November'))}
 <div class="grid"><div>${fpIn('ppl',L2('Άτομα','People'),'2','number')}</div><div>${fpIn('names',L2('Ονόματα','Names'),L2('Γιώργος, Νίκος','George, Nick'))}</div></div>
 ${fpIn('veh',L2('Όχημα (μοντέλο)','Vehicle (model)'),'Toyota Land Cruiser 120')}
 <div class="grid"><div>${fpIn('color',L2('Χρώμα','Colour'),L2('λευκό','white'))}</div><div>${fpIn('plate',L2('Πινακίδα','Registration'),'ΧΧΧ-0000')}</div></div></div>
 <div class="box"><div style="margin-bottom:6px"><b>🗺️ ${L2('Πού','Where')}</b></div>
 ${fpIn('area',L2('Περιοχή','Area'),L2('π.χ. Άγραφα, Καρπενήσι προς Βραγκιανά','e.g. Agrafa, Karpenisi to Vragkiana'))}
 ${fpIn('route',L2('Διαδρομή (χωριά, δρόμοι, GPX)','Route (villages, tracks, GPX)'),L2('π.χ. Καρπενήσι, Κρίκελο, Βραγκιανά, Πετρίλο','e.g. Karpenisi, Krikelo, Vragkiana, Petrilo'))}
 ${fpIn('camp',L2('Πού θα κοιμηθείτε','Where you\'ll camp'),L2('π.χ. ελεύθερο κάμπινγκ κοντά στο καταφύγιο','e.g. wild camp near the refuge'))}
 <label>📍 ${L2('Αφετηρία (στίγμα)','Start point (position)')}</label><div class="tools" style="align-items:center"><span id="fpsp" class="mono" style="flex:1">${p.sp?p.sp.lat.toFixed(5)+', '+p.sp.lon.toFixed(5):L2('δεν έχει μπει','not set')}</span><button class="btn" onclick="fpPos()">📍 ${L2('Η θέση μου τώρα','My position now')}</button>${p.sp?`<button class="btn" onclick="fpS('sp',null);planPage()">🗑</button>`:''}</div></div>
 <div class="box"><div style="margin-bottom:6px"><b>⏱️ ${L2('Πότε','When')}</b></div>
 ${fpIn('start',L2('Αναχώρηση','Departure'),'','datetime-local')}
 ${fpIn('ret',L2('Αναμενόμενη επιστροφή','Expected return'),'','datetime-local')}
 ${fpIn('alarm',L2('⚠️ Ώρα συναγερμού: αν δεν έχει νέα σου ως τότε, καλεί 112','⚠️ Alarm time: if no word from you by then, they call 112'),'','datetime-local')}
 <div class="muted">${L2('Μπαίνει μόνη της 3 ώρες μετά την επιστροφή. Άλλαξέ τη αν θέλεις περισσότερο περιθώριο (π.χ. το επόμενο πρωί).','Set automatically 3 hours after the return. Change it if you want more margin (e.g. next morning).')}</div></div>
 <div class="box"><div style="margin-bottom:6px"><b>📡 ${L2('Επικοινωνία','Communications')}</b></div>
 ${fpIn('phones',L2('Κινητά της ομάδας','Group phones'),'69xxxxxxxx, 69xxxxxxxx','tel')}
 ${fpIn('radio',L2('Ασύρματος','Radio'),L2('π.χ. PMR446 κανάλι 3, CB 19','e.g. PMR446 channel 3, CB 19'))}
 ${fpIn('sat',L2('Δορυφορικό / PLB / inReach','Satellite / PLB / inReach'),L2('π.χ. inReach, στο ίδιο κινητό','e.g. inReach, same phone'))}
 ${fpIn('notes',L2('Σημειώσεις (φάρμακα, ιδιαιτερότητες)','Notes (medication, special needs)'),'')}</div>
 <div class="box" style="border-color:var(--org)"><div style="margin-bottom:6px"><b>🏠 ${L2('Η επαφή στη στεριά','Your shore contact')}</b></div><div class="muted">${L2('Κάποιος που ΔΕΝ έρχεται μαζί σας και θα έχει το κινητό ανοιχτό.','Someone who is NOT coming with you and will keep their phone on.')}</div>
 <div class="grid"><div>${fpIn('contact',L2('Όνομα','Name'),'')}</div><div>${fpIn('cphone',L2('Κινητό','Mobile'),'69xxxxxxxx','tel')}</div></div></div>
 <div id="fpst"></div>
 <h3>📨 ${L2('Το μήνυμα','The message')}</h3><pre id="fpprev" class="box" style="white-space:pre-wrap;font-family:inherit;font-size:.9em;margin:6px 0" data-nt></pre>
 <div class="grid"><button class="big grn" style="font-size:1.05em" onclick="fpSend('wa')">💬 WhatsApp</button><button class="big blu" style="font-size:1.05em" onclick="fpSend('sms')">✉️ SMS</button></div>
 <div class="tools"><button class="btn" onclick="fpSend('share')">📤 ${L2('Άλλη εφαρμογή','Other app')}</button><button class="btn" onclick="fpSend('copy')">📋 ${L2('Αντιγραφή','Copy')}</button><button class="btn" onclick="fpIcs()">📅 ${L2('Υπενθύμιση επιστροφής στο ημερολόγιο','Return reminder in calendar')}</button><button class="btn r" onclick="fpNew()">🆕 ${L2('Νέο σχέδιο','New plan')}</button></div>
 <div class="tip" style="font-weight:400"><b>${L2('Τι λες στην επαφή σου:','What to tell your contact:')}</b><div class="li">${L2('Να ΜΗΝ καλέσει 112 πριν την ώρα συναγερμού, αν δεν υπάρχει άλλος λόγος.','NOT to call 112 before the alarm time unless there is another reason.')}</div><div class="li">${L2('Στα βουνά συχνά δεν έχει σήμα: η σιωπή μέχρι την ώρα συναγερμού είναι φυσιολογική.','In the mountains there is often no signal: silence until the alarm time is normal.')}</div><div class="li">${L2('Στο 112 διαβάζει ολόκληρο το μήνυμα: όχημα, πινακίδα, διαδρομή, στίγμα.','On the phone to 112 they read the whole message: vehicle, plate, route, position.')}</div><div class="li">${L2('Αν αλλάξει το πρόγραμμα, στείλε ενημέρωση (⏩ +2 ώρες / +1 μέρα).','If the plan changes, send an update (⏩ +2 hours / +1 day).')}</div></div>`;
 fpPrev();fpStat()}
function fpPos(){const done=c=>{fpS('sp',{lat:c.lat,lon:c.lon});planPage()};
 if(typeof pos!=='undefined'&&pos&&Date.now()-pos.t<120000)return done(pos);
 if(!navigator.geolocation)return alert(L2('Το κινητό δεν δίνει GPS.','No GPS available.'));
 $('#fpsp').textContent=L2('Αναζήτηση GPS…','Finding GPS…');
 navigator.geolocation.getCurrentPosition(p=>done({lat:p.coords.latitude,lon:p.coords.longitude}),()=>{$('#fpsp').textContent=L2('Δεν βρέθηκε θέση.','No position found.')},{enableHighAccuracy:true,timeout:20000})}
function fpWa(ph){let d=String(ph||'').split(/[,;]/)[0].replace(/[^\d+]/g,'');if(d.startsWith('+'))d=d.slice(1);else if(d.startsWith('00'))d=d.slice(2);else if(/^(69|2)\d{8}$/.test(d))d='30'+d;return d}
function fpOut(t,how){const p=fpG(),ph=String(p.cphone||'').split(/[,;]/)[0].trim();
 if(how==='wa'){location.href='https://wa.me/'+fpWa(ph)+'?text='+encodeURIComponent(t);return}
 if(how==='sms'){location.href='sms:'+encodeURIComponent(ph)+'&body='+encodeURIComponent(t);return}
 if(how==='share'&&navigator.share){navigator.share({text:t}).catch(()=>{});return}
 (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert(L2('Αντιγράφηκε.','Copied.')),()=>prompt(L2('Αντέγραψε:','Copy:'),t))}
function fpSend(how){const p=fpG();if(!p.ret||!p.alarm){if(!confirm(L2('Δεν έχεις βάλει ώρα επιστροφής και συναγερμού. Να σταλεί έτσι;','No return and alarm time set. Send anyway?')))return}
 if((how==='wa'||how==='sms')&&!p.cphone){alert(L2('Γράψε πρώτα το κινητό της επαφής σου.','Enter your contact\'s mobile first.'));return}
 p.sent=Date.now();p.back=0;LS.s('fplan',p);fpOut(fpTxt(p),how);setTimeout(planPage,600)}
function fpBack(){const p=fpG();const t='✅ '+L2(`Γυρίσαμε καλά${p.name?' από '+p.name:''}. Ευχαριστώ! Το σχέδιο εκδρομής έκλεισε.`,`We're back safe${p.name?' from '+p.name:''}. Thank you! The trip plan is closed.`);
 p.back=Date.now();LS.s('fplan',p);fpOut(t,p.cphone?'wa':'share');setTimeout(planPage,600)}
function fpCheck(){const go2=c=>{const t='📍 '+L2('Check-in: όλα καλά.','Check-in: all good.')+` ${c.lat.toFixed(5)}, ${c.lon.toFixed(5)} https://maps.google.com/?q=${c.lat.toFixed(5)},${c.lon.toFixed(5)} · ${new Date().toLocaleTimeString(LOC,{hour:'2-digit',minute:'2-digit',hour12:false})}`;fpOut(t,fpG().cphone?'wa':'share')};
 if(typeof pos!=='undefined'&&pos&&Date.now()-pos.t<120000)return go2(pos);
 if(!navigator.geolocation)return alert(L2('Το κινητό δεν δίνει GPS.','No GPS available.'));
 navigator.geolocation.getCurrentPosition(p=>go2({lat:p.coords.latitude,lon:p.coords.longitude}),()=>alert(L2('Δεν βρέθηκε θέση. Δοκίμασε σε ανοιχτό χώρο.','No position found. Try in the open.')),{enableHighAccuracy:true,timeout:20000})}
function fpLater(h){const p=fpG();if(!p.ret)return;p.ret=fpAdd(p.ret,h);p.alarm=fpAdd(p.alarm||p.ret,h);LS.s('fplan',p);
 const t='⏩ '+L2(`Αλλαγή προγράμματος: όλα καλά, επιστρέφουμε ${fpD(p.ret)}. Νέα ώρα συναγερμού: ${fpD(p.alarm)}.`,`Change of plan: all good, back ${fpD(p.ret)}. New alarm time: ${fpD(p.alarm)}.`);fpOut(t,p.cphone?'wa':'share');setTimeout(planPage,600)}
function fpNew(){if(!confirm(L2('Νέο σχέδιο; Κρατάω όχημα, κινητά και επαφή, σβήνω διαδρομή και ώρες.','New plan? Vehicle, phones and contact are kept; route and times are cleared.')))return;const p=fpG(),q=FP0();['ppl','names','veh','plate','color','phones','radio','sat','contact','cphone'].forEach(k=>q[k]=p[k]);LS.s('fplan',q);planPage()}
function fpIcs(){const p=fpG();if(!p.ret)return alert(L2('Βάλε πρώτα ώρα επιστροφής.','Set a return time first.'));
 const f=d=>{const x=new Date(d);return x.toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'')},e=new Date(new Date(p.ret).getTime()+30*60000);
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Overland’s Habit//EN','BEGIN:VEVENT','UID:fp'+Date.now()+'@overlandshabit','DTSTAMP:'+f(Date.now()),'DTSTART:'+f(p.ret),'DTEND:'+f(e),
  'SUMMARY:'+L2('Επιστροφή: ','Return: ')+(p.name||'Overland’s Habit'),'DESCRIPTION:'+L2('Στείλε «Γύρισα καλά» από την εφαρμογή. Συναγερμός επαφής: ','Send «I\'m back safe» from the app. Contact alarm: ')+fpD(p.alarm),
  'BEGIN:VALARM','TRIGGER:-PT30M','ACTION:DISPLAY','DESCRIPTION:Overland’s Habit','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='return.ics';document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),1000)}

/* ===================== BACKUP / ΕΠΑΝΑΦΟΡΑ ===================== */
const BK_STORES=['spots','routes','huts'];
async function bkCollect(){const ls={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('ov_'))ls[k]=localStorage.getItem(k)}
 const idb={};if(typeof DB!=='undefined')for(const s of BK_STORES){try{idb[s]=await DB.all(s)||[]}catch(e){idb[s]=[]}}
 let ph=[];try{if(typeof LDB!=='undefined')ph=await LDB.all()||[]}catch(e){}
 return{app:'overlands-habit-backup',v:1,date:new Date().toISOString(),ls,idb,ph}}
function bkAgo(){const t=LS.g('bk_last',0);if(!t)return L2('ποτέ','never');const d=Math.floor((Date.now()-t)/864e5);return d<1?L2('σήμερα','today'):d===1?L2('χθες','yesterday'):d+' '+L2('μέρες πριν','days ago')}
function bkNeed(){const t=LS.g('bk_last',0);return (vehs().length||Object.keys(LS.g('read',{})||{}).length>3)&&(!t||Date.now()-t>30*864e5)}
function bkHomeRow(){return`<button class="row" onclick="go('backup')" ${bkNeed()?'style="border-color:var(--yel)"':''}><span class="e">💾</span><span><b>${L2('Backup & επαναφορά','Backup & restore')}</b><small>${bkNeed()?'⚠️ ':''}${L2('τελευταίο backup:','last backup:')} ${bkAgo()} · ${L2('όχημα, στίγματα, GPX, λίστες, πρόοδος','vehicle, pins, GPX, lists, progress')}</small></span></button>`}
async function backupPage(){T('💾 '+L2('Backup & επαναφορά','Backup & restore'));
 M.innerHTML=`<div class="muted">${L2('Όλα τα δεδομένα σου μένουν μόνο σε αυτό το κινητό. Αν σβηστεί η εφαρμογή από την αρχική οθόνη, αν αλλάξεις κινητό ή αν το iPhone καθαρίσει χώρο, χάνονται. Κράτα ένα αρχείο backup στα Αρχεία, στο iCloud ή στο email σου.','All your data lives only on this phone. If the app is removed from the home screen, you change phone or iOS clears space, it is lost. Keep a backup file in Files, iCloud or your email.')}</div>
 <div class="box" id="bkinfo">${L2('Μέτρηση…','Counting…')}</div>
 <button class="big org" onclick="bkMake()">💾 ${L2('Φτιάξε backup τώρα','Make a backup now')}<small>${L2('τελευταίο:','last:')} ${bkAgo()}</small></button>
 <button class="big blu" onclick="$('#bkf').click()">📥 ${L2('Επαναφορά από αρχείο','Restore from file')}<small>${L2('αντικαθιστά τα τωρινά δεδομένα','replaces the current data')}</small></button>
 <input id="bkf" type="file" accept=".json,application/json" style="display:none" onchange="bkLoad(this.files[0])">
 <div class="note" style="font-weight:400"><b>${L2('Τι ΔΕΝ μπαίνει στο backup:','What is NOT in the backup:')}</b><div class="li">${L2('Οι offline χάρτες (είναι μεγάλοι). Κράτα τους με 📤 ως αρχεία .ohmap από τον Χάρτη.','Offline maps (they are large). Keep them as .ohmap files with 📤 in the Map.')}</div><div class="li">${L2('Τα δεδομένα της εφαρμογής Off-Road Gradeability.','Data of the Off-Road Gradeability app.')}</div></div>
 <div class="tip" style="font-weight:400">${L2('Συμβουλή: κάνε backup πριν από κάθε μεγάλη εκδρομή και μετά, όταν έχεις νέα στίγματα και GPX.','Tip: back up before and after every big trip, when you have new pins and GPX tracks.')}</div>`;
 const b=await bkCollect(),kb=Math.round(JSON.stringify(b).length/1024),c=s=>(b.idb[s]||[]).length;const e=$('#bkinfo');if(!e)return;
 e.innerHTML=`<div class="kv"><span>🚙 ${L2('Οχήματα','Vehicles')}</span><b>${vehs().length}</b><span>⭐ ${L2('Στίγματα','Pins')}</span><b>${c('spots')}</b><span>🛣️ GPX</span><b>${c('routes')}</b><span>🛖 ${L2('Καταφύγια (λίστα)','Huts (list)')}</span><b>${c('huts')}</b><span>⚙️ ${L2('Ρυθμίσεις, λίστες, πρόοδος','Settings, lists, progress')}</span><b>${Object.keys(b.ls).length}</b><span>📷 ${L2('Φωτογραφίες ημερολογίου','Log photos')}</span><b>${(b.ph||[]).length}</b><span>📦 ${L2('Μέγεθος αρχείου','File size')}</span><b>${kb>1024?(kb/1024).toFixed(1)+' MB':kb+' KB'}</b></div>`}
async function bkMake(){const b=await bkCollect(),d=new Date(),z=x=>String(x).padStart(2,'0');
 const name=`overlands-habit-backup-${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}.json`,blob=new Blob([JSON.stringify(b)],{type:'application/json'});
 let ok=false;try{const f=new File([blob],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});ok=true}}catch(e){if(e&&e.name==='AbortError')return}
 if(!ok){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),1000)}
 LS.s('bk_last',Date.now());backupPage()}
function bkLoad(f){if(!f)return;const r=new FileReader();r.onload=async()=>{let b;try{b=JSON.parse(r.result)}catch(e){return alert(L2('Το αρχείο δεν διαβάζεται.','The file cannot be read.'))}
 if(!b||b.app!=='overlands-habit-backup'||!b.ls)return alert(L2('Δεν είναι backup του Overland’s Habit.','This is not an Overland’s Habit backup.'));
 if(!confirm(L2(`Επαναφορά του backup της ${new Date(b.date).toLocaleString(LOC)};\nΤα τωρινά δεδομένα της εφαρμογής θα αντικατασταθούν.`,`Restore the backup of ${new Date(b.date).toLocaleString(LOC)}?\nThe app's current data will be replaced.`)))return;
 const lang=localStorage.getItem('ov_lang');const old=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('ov_'))old.push(k)}old.forEach(k=>localStorage.removeItem(k));
 try{Object.entries(b.ls).forEach(([k,v])=>{if(k.startsWith('ov_'))localStorage.setItem(k,v)})}catch(e){alert(L2('Δεν χώρεσαν όλα τα δεδομένα.','Not all data fitted.'))}
 if(lang)localStorage.setItem('ov_lang',lang);
 if(typeof DB!=='undefined')for(const s of BK_STORES){const arr=(b.idb&&b.idb[s])||[];try{await DB.tx(s,'readwrite',st=>st.clear());if(arr.length)await DB.putMany(s,arr)}catch(e){}}
 if(b.ph&&b.ph.length&&typeof LDB!=='undefined'){try{await LDB.tx('readwrite',st=>st.clear());for(const p of b.ph)await LDB.put(p)}catch(e){}}
 alert(L2('✅ Η επαναφορά έγινε. Η εφαρμογή ξαναφορτώνει.','✅ Restore complete. The app will reload.'));location.hash='home';location.reload()};r.readAsText(f)}
