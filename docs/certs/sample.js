/* Ship Certs Check — illustrated SAMPLE of each document (generic, fictional, for training only)
   + user's own photos per item (IndexedDB, low resolution)
   Created by George Barbaris */
(function(){
const SHIP="MV SAMPLE STAR",IMO="9000000";
const e=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function wrap(t,n){const w=String(t).split(" "),o=[];let l="";w.forEach(x=>{if((l+" "+x).trim().length>n){o.push(l.trim());l=x}else l+=" "+x});if(l.trim())o.push(l.trim());return o;}
const OV={csr:"cert",llrec:"book",tsr:"report",boil:"report",biof:"book",potw:"report",liftsm:"report",charts:"book",vacc:"cert",pest:"report",amsa:"book",nzbio:"book",cn:"book",m_bra:"book",g_pil:"cert",g_moor:"cert",LR_sirb:"crew",MH_sirb:"crew",PA_sirb:"crew",LR_water:"report",PA_med:"report",incin:"cert",bdn:"report",rso:"report",thick:"report",audits:"report",gd_fum:"report",pressv:"report",LR_med:"report",fumig:"report",g_falls:"cert",g_hcov:"report",g_fall:"report",ca:"book",usnoa:"book",cmach:"cert"};
function typeOf(i){if(OV[i.id])return OV[i.id];const n=i.n;
 if(i.c==="post")return "poster";
 if(i.c==="ins")return /COFR|eCOFR/.test(n)?"cert":"ins";
 if(/Record Book|Log Book|log\b|Logbook|Register of Lifting|Cargo Gear Register|register\b|records?\b(?!.*certificate)/i.test(n)&&!/certificate/i.test(n.split("–")[0]))return "log";
 if(i.c==="crew"&&/CoC|Competency|GMDSS|STCW|ECDIS|Medical fitness|cook|endorsement|SIRB|Seaman|Passport/i.test(n))return "crew";
 if(/analysis|calibration|service|test|inspection certificate|thorough exam|APT|Annual Performance|weighing|air quality|load test/i.test(n))return "report";
 if(/Plan\b|Arrangement Plan|drawing|Fire Control Plan|Damage Control Plan|General Arrangement/i.test(n)&&!/Management Plan|Security Plan|Response Plan|Monitoring Plan|SOPEP|SEEMP/i.test(n))return "plan";
 if(/Manual|Booklet|Procedure|Code\b|Guide|publications|Plan|SEEMP|SOPEP|SMS|Instructions|Charts|IAMSAR|Signals|ITU|policy|Circulars|Notices|Law/i.test(n))return "book";
 if(/certificate|Certificate|Document of|Statement of|DOC|Licence|Patente|Registry|Declaration|Exemption/i.test(n))return "cert";
 if(i.c==="per"||i.c==="lsa"||i.c==="gas"||i.c==="gear")return "report";
 if(i.c==="rec")return "log";
 return "book";}
const LBL={
 name:["Ship's name / IMO / flag = same on ALL certificates","Όνομα / IMO / σημαία = ίδια σε ΟΛΑ τα certs"],
 valid:["'Valid until' date – not expired","Ημερομηνία «Valid until» – να μην έχει λήξει"],
 endo:["Annual / intermediate endorsements signed, stamped, inside the window","Annual / intermediate endorsements υπογεγραμμένα, σφραγισμένα, εντός window"],
 sign:["Issuer: Flag or RO – signature & seal","Εκδότης: Σημαία ή RO – υπογραφή & σφραγίδα"],
 supp:["Supplement / Form attached and matches the ship","Supplement / Form συνημμένο και ταιριάζει με το πλοίο"],
 appr:["Approval stamp of Flag/Class & date","Σφραγίδα έγκρισης Σημαίας/Class & ημερομηνία"],
 rev:["Latest revision & revision log","Τελευταία αναθεώρηση & revision log"],
 shipb:["Ship-specific (this ship's name, not a generic copy)","Ειδικό για το πλοίο (όχι γενικό αντίγραφο)"],
 entr:["Entries complete, correct codes, no blank lines","Εγγραφές πλήρεις, σωστοί κωδικοί, χωρίς κενά"],
 blank:["No blank lines / pages; a wrong entry struck through once, dated & signed (no correction fluid)","Χωρίς κενές γραμμές/σελίδες· λάθος εγγραφή διαγραμμένη μία φορά, με ημερομηνία & υπογραφή (όχι blanco)"],
 msig:["Signed by officer in charge & Master on each page","Υπογραφή υπευθύνου & Πλοιάρχου σε κάθε σελίδα"],
 serial:["Equipment / serial No. = item on board","Εξοπλισμός / serial No. = αυτό που είναι στο πλοίο"],
 result:["Result PASS / remarks closed","Αποτέλεσμα PASS / παρατηρήσεις κλεισμένες"],
 next:["Next due date","Επόμενη ημερομηνία"],
 comp:["Service company approved by Flag/Maker (authorisation No.)","Εταιρεία service εγκεκριμένη από Σημαία/Κατασκευαστή (αρ. έγκρισης)"],
 photo:["Photo & name = the seafarer","Φωτογραφία & όνομα = ο ναυτικός"],
 cap:["Capacity / limitations = rank on crew list","Capacity / περιορισμοί = βαθμός στη crew list"],
 exp:["Expiry date","Ημερομηνία λήξης"],
 fend:["Flag endorsement (or CRA ≤ 90 days)","Endorsement σημαίας (ή CRA ≤ 90 ημέρες)"],
 period:["Policy period 20 Feb – 20 Feb (current year)","Περίοδος 20 Φεβ – 20 Φεβ (τρέχον έτος)"],
 club:["Club / insurer & ship's name","Club / ασφαλιστής & όνομα πλοίου"],
 posted:["Posted in the right place, readable, in English","Αναρτημένο στο σωστό σημείο, ευανάγνωστο, στα αγγλικά"],
 cur:["Current / not faded / correct version","Ενημερωμένο / όχι ξεθωριασμένο / σωστή έκδοση"],
 tblock:["Title block: ship, approval, date","Title block: πλοίο, έγκριση, ημερομηνία"],
 symb:["Symbols & positions = real equipment","Σύμβολα & θέσεις = πραγματικός εξοπλισμός"]
};
function pin(x,y,n){return `<circle cx="${x}" cy="${y}" r="13" fill="#d32f2f"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">${n}</text>`;}
function bars(x,y,w,n,gap){let s="";for(let k=0;k<n;k++)s+=`<rect x="${x}" y="${y+k*gap}" width="${w*(0.6+0.4*((k*37)%10)/10)}" height="6" rx="3" fill="#cfd6de"/>`;return s;}
function title(t,y,size){return wrap(t,34).slice(0,3).map((l,k)=>`<text x="210" y="${y+k*(size+4)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="#0b2e4f">${e(l.toUpperCase())}</text>`).join("");}
function wm(){return `<text x="210" y="330" text-anchor="middle" font-size="46" font-weight="800" fill="#d32f2f" opacity=".10" transform="rotate(-28 210 330)">SAMPLE · ΔΕΙΓΜΑ</text>`;}
function frame(inner,h){return `<svg viewBox="0 0 420 ${h||560}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px;background:#fff;border:1px solid #c9d2dc;border-radius:8px;font-family:system-ui,sans-serif">${inner}${wm()}</svg>`;}
function shipBox(y){return `<rect x="30" y="${y}" width="360" height="62" fill="#f3f6f9" stroke="#c9d2dc"/>
 <text x="40" y="${y+18}" font-size="11" fill="#555">Name of ship</text><text x="140" y="${y+18}" font-size="12" font-weight="700">${SHIP}</text>
 <text x="40" y="${y+36}" font-size="11" fill="#555">IMO No.</text><text x="140" y="${y+36}" font-size="12" font-weight="700">${IMO}</text>
 <text x="230" y="${y+36}" font-size="11" fill="#555">Gross tonnage</text><text x="320" y="${y+36}" font-size="12" font-weight="700">31,000</text>
 <text x="40" y="${y+54}" font-size="11" fill="#555">Port of registry</text><text x="140" y="${y+54}" font-size="12" font-weight="700">SAMPLETOWN</text>`;}
function seal(x,y,t){return `<circle cx="${x}" cy="${y}" r="30" fill="none" stroke="#1565c0" stroke-width="3"/><circle cx="${x}" cy="${y}" r="23" fill="none" stroke="#1565c0" stroke-width="1"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="9" font-weight="700" fill="#1565c0">${e(t)}</text>`;}
const R={
cert(i){const sup=/IOPP|IAPP|Safety Equipment|Safety Radio|Form|Supplement/i.test(i.n);
 const s=`<rect x="12" y="12" width="396" height="536" fill="none" stroke="#0b2e4f" stroke-width="3"/><rect x="18" y="18" width="384" height="524" fill="none" stroke="#0b2e4f" stroke-width="1"/>
 <text x="210" y="44" text-anchor="middle" font-size="10" fill="#555">ISSUED UNDER THE PROVISIONS OF</text><text x="210" y="58" text-anchor="middle" font-size="10" font-weight="700" fill="#555">${e((i.r||"").split("·")[0].slice(0,48))}</text>
 ${title(i.n.replace(/\(.*?\)/g,"").split("–")[0],84,15)}
 <text x="210" y="134" text-anchor="middle" font-size="10" fill="#555">under the authority of the Government of SAMPLELAND by SAMPLE CLASS (RO)</text>
 ${shipBox(146)}${bars(40,224,330,5,14)}
 <rect x="40" y="300" width="340" height="26" fill="#fff8e1" stroke="#e0b100"/><text x="50" y="318" font-size="12" font-weight="700">This certificate is valid until: 31 / 12 / 2029</text>
 <text x="40" y="350" font-size="11" fill="#555">Issued at: SAMPLETOWN   Date: 01 / 01 / 2025</text>${seal(330,375,"SEAL")}<path d="M60 390 q20 -18 40 0 t40 0" stroke="#333" fill="none"/><text x="60" y="406" font-size="10" fill="#555">Authorised signature</text>
 <rect x="30" y="425" width="360" height="110" fill="#f3f6f9" stroke="#c9d2dc"/><text x="40" y="441" font-size="11" font-weight="700">ENDORSEMENT FOR ANNUAL / INTERMEDIATE SURVEYS</text>
 ${[0,1,2,3].map(k=>`<rect x="${40+k*87}" y="450" width="80" height="76" fill="#fff" stroke="#c9d2dc"/><text x="${80+k*87}" y="466" text-anchor="middle" font-size="9" fill="#555">${["1st Annual","2nd Annual / Int.","3rd Annual","4th Annual"][k]}</text>${k<2?`<path d="M${52+k*87} 500 q12 -12 24 0 t24 0" stroke="#333" fill="none"/><circle cx="${100+k*87}" cy="492" r="12" fill="none" stroke="#1565c0" stroke-width="2"/>`:""}`).join("")}
 ${pin(30,175,1)}${pin(30,313,2)}${pin(390,375,3)}${pin(30,480,4)}${sup?`<rect x="300" y="18" width="96" height="22" fill="#e3f2fd" stroke="#1565c0"/><text x="348" y="33" text-anchor="middle" font-size="10" font-weight="700" fill="#1565c0">+ SUPPLEMENT</text>${pin(290,29,5)}`:""}`;
 return {svg:frame(s),pins:["name","valid","sign","endo"].concat(sup?["supp"]:[])};},
book(i){const s=`<rect x="40" y="20" width="340" height="520" rx="6" fill="#0b2e4f"/><rect x="58" y="20" width="8" height="520" fill="#123f6b"/>
 <rect x="80" y="60" width="270" height="150" fill="#fff" rx="4"/>${wrap(i.n.split("–")[0].replace(/\(.*?\)/g,""),24).slice(0,4).map((l,k)=>`<text x="215" y="${92+k*20}" text-anchor="middle" font-size="15" font-weight="700" fill="#0b2e4f">${e(l.toUpperCase())}</text>`).join("")}
 <text x="215" y="250" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${SHIP}</text><text x="215" y="270" text-anchor="middle" font-size="12" fill="#cfe3f7">IMO ${IMO}</text>
 <rect x="80" y="300" width="270" height="70" fill="#fff" rx="4"/><text x="95" y="322" font-size="11" fill="#333">Revision No.: 7</text><text x="95" y="340" font-size="11" fill="#333">Date: 15 / 03 / 2026</text><text x="95" y="358" font-size="11" fill="#333">Ref: ${e((i.r||"").split("·")[0].slice(0,32))}</text>
 <g transform="rotate(-12 260 450)"><rect x="185" y="415" width="150" height="62" fill="none" stroke="#2e7d32" stroke-width="4" rx="6"/><text x="260" y="442" text-anchor="middle" font-size="18" font-weight="800" fill="#2e7d32">APPROVED</text><text x="260" y="462" text-anchor="middle" font-size="10" font-weight="700" fill="#2e7d32">SAMPLE CLASS · 2026</text></g>
 ${pin(370,250,1)}${pin(70,335,2)}${pin(350,440,3)}`;
 return {svg:frame(s),pins:["shipb","rev","appr"]};},
log(i){const rows=[0,1,2,3,4,5,6,7,8,9];const s=`<rect x="14" y="14" width="392" height="532" fill="#fffdf6" stroke="#bfa96a"/>
 ${title(i.n.split("–")[0].replace(/\(.*?\)/g,""),40,13)}<text x="30" y="92" font-size="11">Ship: <tspan font-weight="700">${SHIP}</tspan>   IMO: ${IMO}   Page 12</text>
 <rect x="24" y="104" width="372" height="22" fill="#e9e2c9"/>${["Date","Code","Item","Record of operations","Sign."].map((h,k)=>`<text x="${[30,92,132,170,350][k]}" y="119" font-size="10" font-weight="700">${h}</text>`).join("")}
 ${rows.map(r=>`<line x1="24" y1="${148+r*30}" x2="396" y2="${148+r*30}" stroke="#d9cfa8"/>${r<8?`<text x="30" y="${142+r*30}" font-size="10">0${r+1}.11.26</text><text x="95" y="${142+r*30}" font-size="10">${"CCDEIHCD"[r]}</text><text x="135" y="${142+r*30}" font-size="10">${[11,12,15,19,26,11,12,15][r]}.${r%3+1}</text><rect x="170" y="${134+r*30}" width="${120+((r*41)%60)}" height="6" rx="3" fill="#cfd6de"/><path d="M350 ${143+r*30} q8 -8 16 0 t16 0" stroke="#333" fill="none"/>`:""}`).join("")}
 <rect x="24" y="${148+8*30-26}" width="372" height="22" fill="#ffebee" opacity=".7"/>
 <text x="30" y="${470}" font-size="11">Signature of Master: </text><path d="M150 468 q15 -14 30 0 t30 0" stroke="#333" fill="none"/>${seal(340,500,"SHIP STAMP")}
 ${pin(400,190,1)}${pin(400,148+8*30-15,2)}${pin(235,468,3)}`;
 return {svg:frame(s),pins:["entr","blank","msig"]};},
report(i){const s=`<rect x="14" y="14" width="392" height="532" fill="#fff" stroke="#c9d2dc"/>
 <rect x="24" y="24" width="90" height="46" fill="#e3f2fd"/><text x="69" y="52" text-anchor="middle" font-size="11" font-weight="700" fill="#1565c0">SERVICE CO.</text>
 <text x="125" y="40" font-size="10" fill="#555">Approved by SAMPLE CLASS / Maker</text><text x="125" y="56" font-size="10" fill="#555">Authorisation No. SC-1234 (valid 2027)</text>
 ${title("Certificate of inspection / service – "+i.n.split("–")[0].replace(/\(.*?\)/g,""),96,12)}
 <text x="30" y="160" font-size="11">Vessel: <tspan font-weight="700">${SHIP}</tspan>  IMO ${IMO}   Port: SAMPLETOWN   Date: 10.10.2026</text>
 <rect x="24" y="172" width="372" height="22" fill="#eef2f6"/>${["Item","Make / Type","Serial No.","Result"].map((h,k)=>`<text x="${[30,110,230,330][k]}" y="187" font-size="10" font-weight="700">${h}</text>`).join("")}
 ${[0,1,2,3,4].map(r=>`<line x1="24" y1="${218+r*26}" x2="396" y2="${218+r*26}" stroke="#e1e6ec"/><text x="30" y="${212+r*26}" font-size="10">${r+1}</text><rect x="110" y="${205+r*26}" width="90" height="6" rx="3" fill="#cfd6de"/><text x="230" y="${212+r*26}" font-size="10">SN-${4810+r*7}</text><text x="330" y="${212+r*26}" font-size="10" font-weight="700" fill="#2e7d32">PASS</text>`).join("")}
 <text x="30" y="370" font-size="11" font-weight="700">Remarks:</text>${bars(30,380,330,2,14)}
 <rect x="30" y="420" width="220" height="26" fill="#fff8e1" stroke="#e0b100"/><text x="40" y="438" font-size="12" font-weight="700">Next service due: 10.10.2027</text>
 <path d="M60 495 q20 -18 40 0 t40 0" stroke="#333" fill="none"/><text x="60" y="512" font-size="10" fill="#555">Service engineer (certified)</text>${seal(330,490,"SERVICE CO.")}
 ${pin(24,47,1)}${pin(260,212,2)}${pin(390,212,3)}${pin(260,433,4)}`;
 return {svg:frame(s),pins:["comp","serial","result","next"]};},
plan(i){const s=`<rect x="14" y="14" width="392" height="532" fill="#fff" stroke="#c9d2dc"/>
 ${title(i.n.split("–")[0].replace(/\(.*?\)/g,""),40,13)}
 <path d="M40 260 L60 300 L360 300 L385 250 L330 250 L330 215 L300 215 L300 250 L40 250 Z" fill="#eef2f6" stroke="#0b2e4f" stroke-width="2"/>
 ${[0,1,2,3,4].map(k=>`<rect x="${80+k*42}" y="252" width="38" height="44" fill="none" stroke="#9aa9b8"/>`).join("")}
 ${[[95,240,"#d32f2f"],[180,240,"#d32f2f"],[310,230,"#2e7d32"],[350,270,"#d32f2f"],[70,275,"#1565c0"]].map(p=>`<rect x="${p[0]}" y="${p[1]}" width="12" height="12" fill="${p[2]}"/>`).join("")}
 <rect x="40" y="330" width="160" height="90" fill="#f8fafc" stroke="#c9d2dc"/><text x="50" y="346" font-size="10" font-weight="700">LEGEND</text>${[["#d32f2f","Fire extinguisher"],["#2e7d32","Escape / LSA"],["#1565c0","Fire hydrant"]].map((l,k)=>`<rect x="50" y="${356+k*18}" width="10" height="10" fill="${l[0]}"/><text x="66" y="${365+k*18}" font-size="10">${l[1]}</text>`).join("")}
 <rect x="230" y="440" width="166" height="96" fill="#f3f6f9" stroke="#0b2e4f"/><text x="238" y="456" font-size="10" font-weight="700">${SHIP}</text><text x="238" y="472" font-size="9">Drawing No. 100-01  Rev. C</text><text x="238" y="488" font-size="9">Date: 2026-03-15</text>
 <g transform="rotate(-10 330 510)"><rect x="280" y="494" width="100" height="30" fill="none" stroke="#2e7d32" stroke-width="3" rx="4"/><text x="330" y="514" text-anchor="middle" font-size="12" font-weight="800" fill="#2e7d32">APPROVED</text></g>
 ${pin(210,225,1)}${pin(220,470,2)}`;
 return {svg:frame(s),pins:["symb","tblock"]};},
poster(i){const s=`<rect x="14" y="14" width="392" height="532" fill="#fff" stroke="#c9d2dc"/><rect x="14" y="14" width="392" height="80" fill="#0b2e4f"/>
 ${wrap(i.n.split(":")[0].split("–")[0],30).slice(0,2).map((l,k)=>`<text x="210" y="${46+k*22}" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">${e(l.toUpperCase())}</text>`).join("")}
 ${[0,1,2,3].map(k=>`<rect x="${34+(k%2)*180}" y="${115+Math.floor(k/2)*160}" width="170" height="145" rx="8" fill="#eef2f6"/><circle cx="${119+(k%2)*180}" cy="${165+Math.floor(k/2)*160}" r="28" fill="${["#d32f2f","#2e7d32","#1565c0","#e0a100"][k]}"/>${bars(54+(k%2)*180,205+Math.floor(k/2)*160,130,3,12)}`).join("")}
 <text x="210" y="460" text-anchor="middle" font-size="11" fill="#555">English + working language of the crew</text><text x="210" y="480" text-anchor="middle" font-size="11" fill="#555">${SHIP} · posted: mess room / bridge / ER</text>
 ${pin(30,40,1)}${pin(390,460,2)}`;
 return {svg:frame(s),pins:["posted","cur"]};},
crew(i){const s=`<rect x="14" y="14" width="392" height="532" fill="#fff" stroke="#0b2e4f" stroke-width="2"/>
 <text x="210" y="44" text-anchor="middle" font-size="10" fill="#555">ADMINISTRATION OF SAMPLELAND · STCW 1978 as amended</text>
 ${title(i.n.split("+")[0].split("(")[0].split("–")[0],72,14)}
 <rect x="30" y="120" width="90" height="110" fill="#eef2f6" stroke="#c9d2dc"/><circle cx="75" cy="160" r="22" fill="#cfd6de"/><rect x="45" y="188" width="60" height="32" rx="12" fill="#cfd6de"/>
 ${[["Name","JUAN SAMPLE"],["Date of birth","01.01.1990"],["Certificate No.","SL-123456"],["Nationality","SAMPLELAND"]].map((r,k)=>`<text x="135" y="${138+k*24}" font-size="10" fill="#555">${r[0]}</text><text x="235" y="${138+k*24}" font-size="11" font-weight="700">${r[1]}</text>`).join("")}
 <rect x="30" y="248" width="360" height="80" fill="#f3f6f9" stroke="#c9d2dc"/><text x="40" y="266" font-size="10" font-weight="700">Function / Level / Capacity / Limitations</text>
 <text x="40" y="286" font-size="11">Navigation · Management · MASTER · None</text><text x="40" y="306" font-size="11">Cargo handling · Management · —</text>
 <rect x="30" y="340" width="200" height="26" fill="#fff8e1" stroke="#e0b100"/><text x="40" y="358" font-size="12" font-weight="700">Date of expiry: 30.06.2029</text>
 <rect x="30" y="384" width="360" height="70" fill="#e3f2fd" stroke="#1565c0"/><text x="40" y="402" font-size="10" font-weight="700" fill="#1565c0">FLAG STATE ENDORSEMENT (Reg. I/10)</text><text x="40" y="422" font-size="10">Endorsement No. LR-998877 · Capacity: MASTER · valid 30.06.2029</text>
 <path d="M60 500 q20 -18 40 0 t40 0" stroke="#333" fill="none"/>${seal(330,495,"OFFICIAL")}
 ${pin(30,130,1)}${pin(390,280,2)}${pin(240,353,3)}${pin(390,420,4)}`;
 return {svg:frame(s),pins:["photo","cap","exp","fend"]};},
ins(i){const s=`<rect x="14" y="14" width="392" height="532" fill="#fff" stroke="#c9d2dc"/><rect x="24" y="24" width="372" height="50" fill="#0b2e4f"/><text x="210" y="55" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">SAMPLE P&amp;I CLUB</text>
 ${title(i.n.split("(")[0].split("–")[0],104,14)}
 ${shipBox(150)}${bars(40,232,330,4,14)}
 <rect x="40" y="300" width="340" height="26" fill="#fff8e1" stroke="#e0b100"/><text x="50" y="318" font-size="12" font-weight="700">Period: 20.02.2026 (noon GMT) – 20.02.2027</text>
 ${bars(40,340,330,4,14)}<path d="M60 470 q20 -18 40 0 t40 0" stroke="#333" fill="none"/><text x="60" y="488" font-size="10" fill="#555">For the Managers</text>${seal(330,465,"P&I CLUB")}
 ${pin(30,49,1)}${pin(30,313,2)}${pin(390,465,3)}`;
 return {svg:frame(s),pins:["club","period","sign"]};}
};
window.sampleHTML=function(i){const L=(window.L_||"el")==="en"?0:1;let t=typeOf(i),r;try{r=R[t](i)}catch(x){r=R.book(i);t="book";}
 const tn={cert:["Certificate","Πιστοποιητικό"],book:["Manual / plan / publication","Manual / σχέδιο / έκδοση"],log:["Record book / log","Record book / ημερολόγιο"],report:["Service / test / analysis report","Report service / δοκιμής / ανάλυσης"],plan:["Plan / drawing","Σχέδιο / plan"],poster:["Poster / placard","Αφίσα / πινακίδα"],crew:["Personal certificate (seafarer)","Προσωπικό πιστοποιητικό ναυτικού"],ins:["Insurance certificate","Ασφαλιστικό πιστοποιητικό"]}[t];
 return `<div class="smp"><div class="note">🖼️ ${L?"Δείγμα":"Sample"}: <b>${e(tn[L])}</b> — ${L?"γενική εικόνα, φανταστικό πλοίο· κάθε σημαία/class έχει δική της φόρμα":"generic illustration, fictional ship; every flag/class has its own form"}</div>${r.svg}
 <ol class="pins">${r.pins.map((p,k)=>`<li>${e(LBL[p][L])}</li>`).join("")}</ol>${r.note?`<div class="note">${e(r.note[L])}</div>`:""}</div>`;};

/* ---------- own photos (IndexedDB, low-res) ---------- */
let dbp=null;function idb(){if(dbp)return dbp;dbp=new Promise((res,rej)=>{const q=indexedDB.open("certs_photos",1);q.onupgradeneeded=()=>q.result.createObjectStore("p");q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});return dbp;}
async function pget(id){const d=await idb();return new Promise(r=>{const q=d.transaction("p").objectStore("p").get(id);q.onsuccess=()=>r(q.result||[]);q.onerror=()=>r([]);});}
async function pset(id,v){const d=await idb();return new Promise(r=>{const t=d.transaction("p","readwrite");t.objectStore("p").put(v,id);t.oncomplete=r;});}
function shrink(file){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const m=1000,sc=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(im.src);res(c.toDataURL("image/jpeg",0.6));};im.onerror=rej;im.src=URL.createObjectURL(file);});}
window.photoBox=async function(el,id){const L=(window.L_||"el")==="en"?0:1;const a=await pget(id);
 el.innerHTML=`<div class="note">📷 ${L?"Δικές μου φωτογραφίες (αληθινό παράδειγμα από πλοίο)":"My own photos (real example from a ship)"}</div><div class="phs">${a.map((p,k)=>`<div class="ph"><img src="${p}"><button data-pd="${k}">✕</button></div>`).join("")}</div>
 <label class="btn sm" style="display:inline-flex;flex-direction:row;margin-top:6px">📷 ${L?"Πρόσθεσε φωτογραφία":"Add photo"}<input type="file" accept="image/*" capture="environment" class="hide" data-pa></label>`;
 el.querySelector("[data-pa]").onchange=async ev=>{const f=ev.target.files[0];if(!f)return;const d=await shrink(f);const b=await pget(id);b.push(d);await pset(id,b.slice(-4));photoBox(el,id);};
 el.querySelectorAll("[data-pd]").forEach(b=>b.onclick=async()=>{if(!confirm(L?"Διαγραφή φωτογραφίας;":"Delete photo?"))return;const x=await pget(id);x.splice(+b.dataset.pd,1);await pset(id,x);photoBox(el,id);});
 el.querySelectorAll(".ph img").forEach(im=>im.onclick=()=>{const w=window.open("");if(w)w.document.write(`<img src="${im.src}" style="max-width:100%">`);});};
})();
