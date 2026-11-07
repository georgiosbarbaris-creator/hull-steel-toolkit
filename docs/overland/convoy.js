/* ===== Overland Habit, Φάση 3: Κομβόι ζωντανά =====
   Χωρίς λογαριασμό: μηνύματα μέσω δημόσιου MQTT broker (WebSocket), κρυπτογραφημένα AES-GCM με κλειδί από τον κωδικό ομάδας.
   Ο broker βλέπει μόνο ακατανόητα bytes σε ένα τυχαίο topic. */

/* ---------- Mini MQTT 3.1.1 client (QoS 0) ---------- */
const BROKERS=[['HiveMQ','wss://broker.hivemq.com:8884/mqtt'],['EMQX','wss://broker.emqx.io:8084/mqtt'],['Mosquitto','wss://test.mosquitto.org:8081']];
class MQ{constructor(url,onMsg,onState){this.url=url;this.onMsg=onMsg;this.onState=onState;this.buf=new Uint8Array(0);this.subs=[];this.pid=1;this.ok=false;this.closed=false;this.connect()}
 connect(){if(this.closed)return;this.onState('connecting');let ws;try{ws=new WebSocket(this.url,'mqtt')}catch(e){return this.retry()}this.ws=ws;ws.binaryType='arraybuffer';
  ws.onopen=()=>{const cid='ovh'+Math.random().toString(36).slice(2,12);ws.send(this.pkt(0x10,[...this.str('MQTT'),4,0x02,0,30],this.str(cid)))};
  ws.onmessage=e=>{const a=new Uint8Array(e.data),b=new Uint8Array(this.buf.length+a.length);b.set(this.buf);b.set(a,this.buf.length);this.buf=b;this.parse()};
  ws.onclose=()=>{this.ok=false;clearInterval(this.pt);this.onState('down');this.retry()};ws.onerror=()=>{try{ws.close()}catch(e){}}}
 retry(){if(this.closed)return;clearTimeout(this.rt);this.rt=setTimeout(()=>this.connect(),4000)}
 str(s){const u=new TextEncoder().encode(s);return[u.length>>8,u.length&255,...u]}
 pkt(h,vh,pl){const body=new Uint8Array(vh.length+pl.length);body.set(vh);body.set(pl,vh.length);let L=body.length;const len=[];do{let d=L%128;L=Math.floor(L/128);if(L>0)d|=128;len.push(d)}while(L>0);
  const o=new Uint8Array(1+len.length+body.length);o[0]=h;o.set(len,1);o.set(body,1+len.length);return o}
 parse(){for(;;){const b=this.buf;if(b.length<2)return;let m=1,L=0,i=1,d;do{if(i>=b.length)return;d=b[i++];L+=(d&127)*m;m*=128}while(d&128);if(b.length<i+L)return;
  const t=b[0]>>4,body=b.slice(i,i+L);this.buf=b.slice(i+L);
  if(t===2){this.ok=true;this.onState('up');this.subs.forEach(s=>this.sub1(s));clearInterval(this.pt);this.pt=setInterval(()=>this.send(new Uint8Array([0xC0,0])),25000)}
  else if(t===3){const tl=(body[0]<<8)|body[1],topic=new TextDecoder().decode(body.slice(2,2+tl)),q=(b[0]>>1)&3,off=2+tl+(q?2:0);this.onMsg(topic,body.slice(off))}}}
 send(p){if(this.ws&&this.ws.readyState===1)this.ws.send(p)}
 sub(t){this.subs.push(t);if(this.ok)this.sub1(t)}
 sub1(t){this.pid=(this.pid%65000)+1;this.send(this.pkt(0x82,[this.pid>>8,this.pid&255],[...this.str(t),0]))}
 pub(t,payload,retain){this.send(this.pkt(0x30|(retain?1:0),this.str(t),payload))}
 close(){this.closed=true;clearInterval(this.pt);clearTimeout(this.rt);try{this.send(new Uint8Array([0xE0,0]));this.ws&&this.ws.close()}catch(e){}}}

/* ---------- Κρυπτογράφηση ---------- */
const CV_ALPH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function cvCode(){const r=crypto.getRandomValues(new Uint8Array(8));return[...r].map(x=>CV_ALPH[x%CV_ALPH.length]).join('')}
async function cvKeys(code){const te=new TextEncoder(),h=await crypto.subtle.digest('SHA-256',te.encode('ovh-topic|'+code)),topic='ovh/'+[...new Uint8Array(h)].slice(0,12).map(x=>x.toString(16).padStart(2,'0')).join('');
 const base=await crypto.subtle.importKey('raw',te.encode(code),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:te.encode('overland-habit-convoy'),iterations:60000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);return{topic,key}}
async function cvEnc(o){const iv=crypto.getRandomValues(new Uint8Array(12)),c=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},CV.key,new TextEncoder().encode(JSON.stringify(o)))),r=new Uint8Array(12+c.length);r.set(iv);r.set(c,12);return r}
async function cvDec(b){if(b.length<13)return null;try{const p=await crypto.subtle.decrypt({name:'AES-GCM',iv:b.slice(0,12)},CV.key,b.slice(12));return JSON.parse(new TextDecoder().decode(p))}catch(e){return null}}

/* ---------- Κατάσταση ---------- */
const CV_COL=['#d97757','#6a9fb5','#5f9e7a','#e8b86d','#b07cc6','#e5735a','#4fb3bf','#c9a227','#8fd19e','#f08fb0'];
const CV_MSG=['⛔ ΣΤΟΠ, σταματήστε όλοι','⏸️ Στάση 5 λεπτά','⛽ Στάση για καύσιμα','⚠️ Εμπόδιο μπροστά, αργά','✅ Συνεχίζουμε','🔁 Γυρνάμε πίσω','📻 Ανοίξτε τον ασύρματο','👍 Όλα καλά'];
let CV={mq:null,key:null,topic:'',mem:{},st:'off',iv:null,map:null,mk:{},lay:null,lastSent:0,lastPos:null,alarms:{},ack:{},cmd0:0,beepT:null};
const cvMe=()=>LS.g('cvme',null);// {code,b,id,n,col,lead,maxKm,lostMin}
async function cvStart(){const me=cvMe();if(!me||CV.mq)return;const k=await cvKeys(me.code);CV.key=k.key;CV.topic=k.topic;CV.cmd0=Date.now();
 CV.mq=new MQ(BROKERS[me.b||0][1],cvOnMsg,s=>{CV.st=s;cvStatus();if(s==='up')cvSend(true)});CV.mq.sub(CV.topic+'/#');
 startGeo();wake(1);CV.iv=setInterval(cvTick,2000)}
function cvStop(){if(CV.mq)CV.mq.close();CV.mq=null;clearInterval(CV.iv);CV.iv=null;CV.mem={};CV.st='off';CV.alarms={};CV.ack={}}
async function cvOnMsg(topic,payload){const me=cvMe();if(!me)return;const sub=topic.slice(CV.topic.length+1);
 if(sub.startsWith('m/')){const id=sub.slice(2);if(!payload.length){delete CV.mem[id];cvRender();return}const o=await cvDec(payload);if(!o||o.id!==id)return;o.rx=Date.now();
  const prev=CV.mem[id];CV.mem[id]=o;if(o.sos&&(!prev||!prev.sos)&&id!==me.id)cvAlarm('sos'+id,`🆘 SOS από ${o.n}!`,o);if(!o.sos)delete CV.ack['sos'+id];cvRender()}
 else if(sub==='c'){const o=await cvDec(payload);if(!o||o.t<CV.cmd0-60000||o.t<Date.now()-5*60000)return;if(o.from===me.id)return;
  if(o.end){cvAlarm('end','🏁 Ο αρχηγός τελείωσε την εκδρομή.',null,true);cvLeave(true);return}
  cvAlarm('msg'+o.t,`📢 ${o.fn}: ${o.m}`,null,true)}}
function cvMyObj(){const me=cvMe(),p=pos;return{id:me.id,n:me.n,col:me.col,lead:me.lead?1:0,veh:me.veh||'',lat:p?+p.lat.toFixed(6):null,lon:p?+p.lon.toFixed(6):null,acc:p?Math.round(p.acc):null,spd:p&&p.spd!=null?+(p.spd*3.6).toFixed(1):null,hd:p&&p.hd!=null?Math.round(p.hd):null,sos:LS.g('cvsos',0),t:Date.now()}}
async function cvSend(force){const me=cvMe();if(!CV.mq||!CV.mq.ok||!me)return;const now=Date.now(),moved=pos&&CV.lastPos?dist(pos,CV.lastPos):999;
 if(!force&&now-CV.lastSent<10000&&moved<40)return;if(!force&&now-CV.lastSent<4000)return;CV.lastSent=now;if(pos)CV.lastPos={lat:pos.lat,lon:pos.lon};
 const o=cvMyObj();CV.mem[me.id]=Object.assign(o,{rx:now});CV.mq.pub(CV.topic+'/m/'+me.id,await cvEnc(o),true)}
async function cvCmd(m,end){const me=cvMe();if(!CV.mq||!CV.mq.ok)return alert('Δεν υπάρχει σύνδεση τώρα. Δοκίμασε σε λίγο ή με τον ασύρματο.');CV.mq.pub(CV.topic+'/c',await cvEnc({from:me.id,fn:me.n,m,end:end?1:0,t:Date.now()}),false);if(!end)cvToast('📤 Στάλθηκε: '+m)}
function cvTick(){cvSend(false);cvCheck();cvRender()}
function cvLeader(){return Object.values(CV.mem).find(m=>m.lead)}
function cvCheck(){const me=cvMe();if(!me)return;const L=cvLeader(),now=Date.now(),maxM=(me.maxKm||3)*1000,lostMs=(me.lostMin||3)*60000;
 for(const m of Object.values(CV.mem)){if(m.id===me.id)continue;const age=now-(m.t||0);
  if(age>lostMs&&age<6*3600e3)cvAlarm('lost'+m.id,`📡 Δεν έχουμε θέση από ${m.n} εδώ και ${Math.round(age/60000)}′`,m);else delete CV.ack['lost'+m.id];
  if(me.lead&&L&&L.id===me.id&&m.lat!=null&&pos){const d=dist(pos,m);if(d>maxM)cvAlarm('far'+m.id,`⚠️ ${m.n} είναι ${fmD(d)} μακριά σου`,m);else if(d<maxM*.8)delete CV.ack['far'+m.id]}}
 if(!me.lead&&L&&L.lat!=null&&pos){const d=dist(pos,L);if(d>maxM)cvAlarm('farme',`⚠️ Είσαι ${fmD(d)} μακριά από τον αρχηγό (${L.n})`,L);else if(d<maxM*.8)delete CV.ack.farme}}
function cvAlarm(k,txt,m,once){if(CV.ack[k])return;CV.ack[k]=once?2:1;CV.alarms[k]={txt,m,t:Date.now()};vib([300,150,300]);try{beep(880,350,1,'square');setTimeout(()=>beep(660,350,1,'square'),420)}catch(e){}cvBanner()}
function cvBanner(){let d=$('#cval');const A=Object.entries(CV.alarms);if(!A.length){if(d)d.remove();return}if(!d){d=document.createElement('div');d.id='cval';d.style.cssText='position:fixed;left:8px;right:8px;top:calc(env(safe-area-inset-top) + 64px);z-index:80';document.body.appendChild(d)}
 d.innerHTML=A.map(([k,a])=>`<div class="warn" style="display:flex;gap:8px;align-items:center;box-shadow:0 4px 14px #000"><span style="flex:1">${esc(a.txt)}</span>${a.m&&a.m.lat!=null?`<button class="btn" onclick="mGoTo(${a.m.lat},${a.m.lon},'${esc(a.m.n.replace(/'/g,''))}')">➡️</button>`:''}<button class="btn p" onclick="cvAck('${k}')">OK</button></div>`).join('')}
function cvAck(k){delete CV.alarms[k];cvBanner()}
function cvToast(t){const e=$('#cvst2');if(e){e.textContent=t;setTimeout(()=>{if(e.textContent===t)e.textContent=''},4000)}}
function cvStatus(){const e=$('#cvst');if(!e)return;const me=cvMe();e.innerHTML={up:'🟢 Συνδεδεμένο',connecting:'🟡 Σύνδεση…',down:'🔴 Χωρίς σύνδεση, ξαναδοκιμάζω',off:'⚪'}[CV.st]+` · ${BROKERS[(me&&me.b)||0][0]}`}

/* ---------- Σελίδες ---------- */
function convoy(sub,arg){if(sub==='join'&&arg){const[c,b]=arg.split('.');LS.s('cvjoin',{code:c.toUpperCase(),b:+b||0});location.replace('#convoy');return}
 const me=cvMe();if(!me)return cvSetup();cvStart();cvPage()}
function cvSetup(){T('🚐 Κομβόι');const j=LS.g('cvjoin',null),v=veh(),last=LS.g('cvlast',{n:'',col:CV_COL[0]});
 M.innerHTML=`<div class="tip">Όλα τα αυτοκίνητα στον χάρτη, ζωντανά. Ο αρχηγός φτιάχνει ομάδα και στέλνει link στους άλλους (WhatsApp / SMS). Δεν θέλει λογαριασμό. Τα μηνύματα είναι κρυπτογραφημένα με τον κωδικό της ομάδας.</div>
 <label>Το όνομά σου στο κομβόι</label><input id="cvn" value="${esc(last.n)}" placeholder="π.χ. Γιώργος"><label>Αυτοκίνητο</label><input id="cvv" value="${esc(last.veh||(v?v.name||v.model:''))}" placeholder="π.χ. LC120 λευκό">
 <label>Χρώμα</label><div class="seg">${CV_COL.map(c=>`<button style="background:${c};min-width:16%;height:38px" class="${c===last.col?'on':''}" onclick="LS.s('cvlast',Object.assign(LS.g('cvlast',{}),{col:'${c}'}));this.parentNode.querySelectorAll('button').forEach(x=>x.style.outline='');this.style.outline='3px solid #fff'">${c===last.col?'✓':''}</button>`).join('')}</div>
 <h3>🤝 Μπες σε ομάδα</h3><label>Κωδικός ομάδας</label><input id="cvc" value="${j?esc(j.code):''}" placeholder="8 γράμματα" style="text-transform:uppercase;font-family:ui-monospace,monospace;font-size:1.3em;letter-spacing:3px">
 <button class="big org" onclick="cvJoin()">🤝 Μπες στο κομβόι</button>
 <h3>👑 Είσαι αρχηγός;</h3><button class="big blu" onclick="cvCreate()">👑 Φτιάξε νέο κομβόι</button>
 <div class="box"><b>Καλό να ξέρεις</b><div class="li">Θέλει <b>σήμα κινητού</b> και την εφαρμογή <b>ανοιχτή στην οθόνη</b> (βάση στο ταμπλό, φορτιστής). Το iPhone δεν στέλνει θέση από web app με κλειστή οθόνη.</div><div class="li">Χωρίς σήμα: βλέπεις την <b>τελευταία γνωστή θέση</b> και συνεχίζετε με τον <a href="#t/radio" style="color:var(--yel)">ασύρματο</a>.</div><div class="li">Για βουνά χωρίς σήμα: συσκευές <b>Meshtastic (LoRa)</b> δείχνουν θέσεις 5–15 km χωρίς κεραία κινητής, με τη δική τους εφαρμογή.</div><div class="li">Ο διακομιστής μηνυμάτων είναι δημόσιος και δωρεάν· βλέπει μόνο κρυπτογραφημένα δεδομένα. Αν δεν συνδέεται, ο αρχηγός διαλέγει άλλον από τις ρυθμίσεις και ξαναστέλνει το link.</div></div>`}
function cvBase(){const n=$('#cvn').value.trim(),veh=$('#cvv').value.trim(),last=LS.g('cvlast',{col:CV_COL[0]});if(!n){alert('Γράψε το όνομά σου.');return null}LS.s('cvlast',Object.assign(last,{n,veh}));return{n,veh,col:last.col||CV_COL[0],id:'u'+Math.random().toString(36).slice(2,10),maxKm:3,lostMin:3}}
function cvJoin(){const b=cvBase();if(!b)return;const c=$('#cvc').value.trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(c.length<6)return alert('Γράψε τον κωδικό της ομάδας (τον στέλνει ο αρχηγός).');const j=LS.g('cvjoin',null);
 LS.s('cvme',Object.assign(b,{code:c,b:j&&j.code===c?j.b:0,lead:0}));LS.s('cvjoin',null);convoy()}
function cvCreate(){const b=cvBase();if(!b)return;LS.s('cvme',Object.assign(b,{code:cvCode(),b:0,lead:1}));convoy()}
function cvLink(){const me=cvMe();return location.origin+location.pathname+'#convoy/join/'+me.code+'.'+(me.b||0)}
function cvInvite(){const me=cvMe(),t=`🚐 Κομβόι Overland Habit\nΜπες από εδώ: ${cvLink()}\nΚωδικός: ${me.code}`;if(navigator.share)navigator.share({text:t}).catch(()=>{});else(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>alert('Αντιγράφηκε, στείλ\' το στην παρέα.'),()=>prompt('Αντέγραψε:',t))}
function cvPage(){const me=cvMe();T('🚐 Κομβόι'+(me.lead?' 👑':''));
 M.innerHTML=`<div class="box" style="display:flex;gap:10px;align-items:center;padding:10px"><div style="flex:1"><div class="muted">Κωδικός ομάδας</div><div class="mono" style="font-size:1.4em;font-weight:900;letter-spacing:3px">${me.code}</div><div class="muted" id="cvst"></div></div><button class="btn p" onclick="cvInvite()">📤 Κάλεσε</button></div>
 <div style="position:relative"><div id="cvmap" style="height:42vh;border-radius:14px;border:1px solid var(--line)"></div><button class="hb" style="position:absolute;right:8px;top:8px;z-index:500" onclick="cvFit()">🔍</button></div>
 <div id="cvst2" class="muted" style="min-height:1.2em"></div><div id="cvl"></div>
 <h3>📢 ${me.lead?'Εντολές αρχηγού':'Μήνυμα σε όλους'}</h3><div class="grid">${CV_MSG.map((m,i)=>`<button class="btn${i===0?' r':''}" onclick="cvCmd(CV_MSG[${i}])">${m}</button>`).join('')}</div>
 <button class="big ${LS.g('cvsos',0)?'grn':'red'}" style="margin-top:12px" onclick="cvSos()">${LS.g('cvsos',0)?'✅ Ακύρωσε το SOS':'🆘 SOS, χρειάζομαι βοήθεια'}<small>${LS.g('cvsos',0)?'όλοι βλέπουν ότι έχεις πρόβλημα':'ειδοποιεί όλο το κομβόι με τη θέση σου'}</small></button>
 <div class="box"><b>⚙️ Ρυθμίσεις</b><div class="grid"><div><label>Συναγερμός απόστασης (km)</label><input type="number" inputmode="decimal" value="${me.maxKm||3}" onchange="cvSet('maxKm',Math.max(.2,n(this.value)))"></div><div><label>Χαμένο σήμα μετά από (λεπτά)</label><input type="number" inputmode="decimal" value="${me.lostMin||3}" onchange="cvSet('lostMin',Math.max(1,n(this.value)))"></div></div>
 ${me.lead?`<label>Διακομιστής μηνυμάτων</label><select onchange="cvBroker(+this.value)">${BROKERS.map((b,i)=>`<option value="${i}" ${i===(me.b||0)?'selected':''}>${b[0]}</option>`).join('')}</select><div class="muted">Αν αλλάξεις, ξαναστείλε το link, όλοι πρέπει να είναι στον ίδιο.</div>`:''}</div>
 <div class="tools">${me.lead?`<button class="btn r" onclick="cvEnd()">🏁 Τέλος εκδρομής (για όλους)</button>`:''}<button class="btn" onclick="cvLeave()">🚪 Βγες από το κομβόι</button></div>`;
 cvStatus();cvMap();cvRender();TS.push(()=>{if(CV.map){CV.map.remove();CV.map=null;CV.mk={}}})}
function cvSet(k,v){const me=cvMe();me[k]=v;LS.s('cvme',me)}
function cvBroker(b){const me=cvMe();me.b=b;LS.s('cvme',me);cvStop();convoy()}
function cvSos(){const on=LS.g('cvsos',0)?0:1;if(on&&!confirm('Να σταλεί SOS σε όλο το κομβόι με τη θέση σου;'))return;LS.s('cvsos',on);cvSend(true);cvPage()}
async function cvEnd(){if(!confirm('Τέλος εκδρομής; Θα βγουν όλοι από το κομβόι και θα σβηστούν οι θέσεις.'))return;await cvCmd('Τέλος',true);for(const id of Object.keys(CV.mem))CV.mq&&CV.mq.pub(CV.topic+'/m/'+id,new Uint8Array(0),true);setTimeout(()=>cvLeave(true),600)}
function cvLeave(silent){if(!silent&&!confirm('Να βγεις από το κομβόι;'))return;const me=cvMe();if(me&&CV.mq)CV.mq.pub(CV.topic+'/m/'+me.id,new Uint8Array(0),true);LS.s('cvsos',0);setTimeout(()=>{cvStop();LS.s('cvme',null);CV.alarms={};cvBanner();if(location.hash.startsWith('#convoy'))convoy()},300)}
function cvMap(){const c=LS.g('mview',{lat:38.6,lon:22.6,z:7});CV.map=L.map('cvmap',{zoomControl:false}).setView([c.lat,c.lon],Math.max(c.z,10));const l=LAYERS[LAYK()];
 L.tileLayer(l[1],{maxZoom:19,maxNativeZoom:l[2],attribution:l[3],crossOrigin:'anonymous'}).addTo(CV.map);CV.lay=L.layerGroup().addTo(CV.map);CV.fitted=false}
function cvFit(){const P=Object.values(CV.mem).filter(m=>m.lat!=null).map(m=>[m.lat,m.lon]);if(!CV.map||!P.length)return;if(P.length===1)CV.map.setView(P[0],14);else CV.map.fitBounds(L.latLngBounds(P).pad(.25))}
function cvAgeTxt(ms){const s=Math.round(ms/1000);return s<60?s+'″':Math.round(s/60)+'′'}
function cvRender(){const me=cvMe();if(!me)return;const now=Date.now(),lostMs=(me.lostMin||3)*60000,Ld=cvLeader(),ref=Ld&&Ld.lat!=null?Ld:null,A=Object.values(CV.mem).sort((a,b)=>(b.lead-a.lead)||(a.n>b.n?1:-1));
 if(CV.map){CV.lay.clearLayers();A.forEach(m=>{if(m.lat==null)return;const age=now-m.t,old=age>lostMs,ini=(m.n||'?').slice(0,2).toUpperCase();
  L.marker([m.lat,m.lon],{icon:L.divIcon({className:'',html:`<div style="position:relative;width:34px;height:34px;border-radius:50%;background:${m.col};border:3px solid ${m.sos?'#ff3b30':m.id===me.id?'#fff':'#1f1e1d'};opacity:${old?.45:1};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#1f1e1d;box-shadow:0 1px 6px #000">${m.sos?'🆘':ini}${m.lead?'<span style="position:absolute;top:-14px;font-size:14px">👑</span>':''}</div>`,iconSize:[34,34],iconAnchor:[17,17]}),zIndexOffset:m.lead?900:m.id===me.id?800:0})
  .bindTooltip(esc(m.n)+(m.spd!=null?` · ${Math.round(m.spd)} km/h`:''),{direction:'top',offset:[0,-16]}).addTo(CV.lay)});
  if(!CV.fitted&&A.some(m=>m.lat!=null)){CV.fitted=true;cvFit()}}
 const e=$('#cvl');if(!e)return;e.innerHTML=A.length?A.map(m=>{const age=now-m.t,st=age<30000?'🟢':age<lostMs?'🟡':'🔴',d=ref&&m.lat!=null&&m.id!==ref.id?dist(ref,m):null;
  return`<div class="row" style="border-left:6px solid ${m.col};${m.sos?'background:#4a1c18;':''}"><span class="e">${m.sos?'🆘':m.lead?'👑':'🚙'}</span><span style="flex:1"><b>${esc(m.n)}${m.id===me.id?' (εγώ)':''}</b><small>${esc(m.veh||'')} ${st} ${cvAgeTxt(age)} πριν${m.spd!=null?` · ${Math.round(m.spd)} km/h`:''}${m.acc?` · ±${m.acc} m`:''}</small></span>${d!=null?`<b class="mono ${d>(me.maxKm||3)*1000?'bad':''}">${fmD(d)}</b>`:''}${m.lat!=null&&m.id!==me.id?`<button class="btn" onclick="mGoTo(${m.lat},${m.lon},'${esc((m.n||'').replace(/'/g,''))}')">➡️</button>`:''}</div>`}).join('')+
  `<div class="muted">Απόσταση σε ευθεία από τον αρχηγό. 🟢 τώρα · 🟡 πριν λίγο · 🔴 χαμένο σήμα</div>`:`<div class="note">Περιμένω τους άλλους… Πάτα <b>📤 Κάλεσε</b> και στείλε το link. ${pos?'':'<br>📡 Περιμένω και το δικό σου GPS.'}</div>`}
/* το κομβόι μένει ενεργό και όταν αλλάζεις σελίδα, οι συναγερμοί έρχονται παντού */
window.addEventListener('load',()=>{if(cvMe())cvStart()});
