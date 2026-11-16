/* Ship Certs Check — 📅 Surveys & windows: calculator + guide + service intervals
   Rules: SOLAS I/10, I/14 (HSSC, Res. A.1186(33) Survey Guidelines), ICLL, MARPOL, ISM 13, ISPS A/19, MLC 5.1.3, IACS UR Z3/Z7/Z10.2/Z18, ESP Code.
   Created by George Barbaris */
(function(){
const T=(en,el)=>(window.L_||"el")==="en"?en:el;
const e=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const D=s=>{if(!s)return null;const d=new Date(s+"T00:00:00");return isNaN(d)?null:d;};
const addM=(d,m)=>{const x=new Date(d);const day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+m);const last=new Date(x.getFullYear(),x.getMonth()+1,0).getDate();x.setDate(Math.min(day,last));return x;};
const p2=n=>String(n).padStart(2,"0");
const f=d=>d?`${p2(d.getDate())}.${p2(d.getMonth()+1)}.${d.getFullYear()}`:"–";
const today=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate());};
function st(a,b){const t=today();if(t<a)return{c:"pk",t:T("upcoming","έρχεται"),k:0,d:Math.round((a-t)/864e5)};if(t<=b)return{c:"pw",t:T("WINDOW OPEN NOW","ΠΑΡΑΘΥΡΟ ΑΝΟΙΧΤΟ ΤΩΡΑ"),k:1,d:Math.round((b-t)/864e5)};return{c:"pna",t:T("past – check the endorsement exists","πέρασε – έλεγξε ότι υπάρχει endorsement"),k:2};}
function row(name,a,b,note,showSt){const s=st(a,b);return `<tr><td><b>${e(name)}</b>${note?`<div class="note">${e(note)}</div>`:""}</td><td style="white-space:nowrap">${f(a)}<br>${f(b)}</td><td>${showSt===false?"":`<span class="due ${s.c}">${s.t}${s.k===0?` · ${s.d}${T("d","μ")}`:s.k===1?` · ${T("closes in","κλείνει σε")} ${s.d}${T("d","μ")}`:""}</span>`}</td></tr>`;}

function calc(sv){let h="";const ex=D(sv.exp);
 if(ex){const iss=addM(ex,-60);
  h+=`<h2>📜 ${T("Statutory (HSSC) & Class – windows","Καταστατικά (HSSC) & Class – παράθυρα")}</h2>
  <p class="note">${T("Anniversary date = day & month of the certificate expiry","Anniversary date = ημέρα & μήνας της λήξης του πιστοποιητικού")}: <b>${f(ex).slice(0,5)}</b> · ${T("certificate period","περίοδος")} ${f(iss)} → ${f(ex)}</p>
  <table class="sv"><tr><th>${T("Survey","Survey")}</th><th>${T("Window from / to","Παράθυρο από / έως")}</th><th></th></tr>`;
  for(let k=1;k<=4;k++){const an=addM(iss,12*k);const nm=k===2||k===3?`${k}${T(k===2?"nd":"rd","η")} ${T("Annual – or INTERMEDIATE","Annual – ή INTERMEDIATE")}`:`${k}${T(k===1?"st":"th","η")} ${T("Annual","Annual")}`;
   h+=row(nm,addM(an,-3),addM(an,3),`${T("anniversary","anniversary")} ${f(an)}`+(k===2?` · ${T("intermediate here OR at the 3rd","intermediate εδώ Ή στην 3η")}`:"")+(k===4?` · ${T("class Special Survey may start (15 months before expiry)","μπορεί να ξεκινήσει το class Special Survey (15 μήνες πριν τη λήξη)")}`:""));}
  h+=row(T("RENEWAL (statutory) – new certificate runs 5 yrs from old expiry","RENEWAL (καταστατικά) – το νέο cert τρέχει 5 χρόνια από την παλιά λήξη"),addM(ex,-3),ex,T("Done earlier than 3 months before expiry → new certificate 5 yrs from completion date (you lose time)","Αν γίνει νωρίτερα από 3 μήνες πριν → νέο cert 5 χρόνια από την ημερομηνία ολοκλήρωσης (χάνεις χρόνο)"));
  h+=row(T("CLASS SPECIAL SURVEY (renewal) – may be started & progressed","CLASS SPECIAL SURVEY (renewal) – μπορεί να ξεκινήσει & να προχωρά"),addM(ex,-15),ex,T("Start from 4th annual (15 months before), complete by expiry; extension max 3 months only by class in exceptional cases","Από την 4η annual (15 μήνες πριν), ολοκλήρωση έως τη λήξη· παράταση max 3 μήνες μόνο από class σε εξαιρετικές περιπτώσεις"));
  h+=`</table>`;}
 const dd=D(sv.dd);
 if(dd){const max=addM(dd,36);h+=`<h2>⚓ ${T("Bottom survey / Dry dock","Bottom survey / Δεξαμενισμός")}</h2><table class="sv">`;
  h+=row(T("Next bottom inspection – must be done by (max 36 months from the last)","Επόμενη επιθεώρηση πυθμένα – πρέπει να γίνει έως (max 36 μήνες από την προηγούμενη)"),dd,max,T("2 bottom inspections in every 5-yr period, one with the renewal survey","2 επιθεωρήσεις πυθμένα σε κάθε 5ετία, η μία μαζί με το renewal"));
  if(ex){h+=row(T("Bottom inspection with RENEWAL (in dry dock for bulk carriers)","Επιθεώρηση πυθμένα με το RENEWAL (σε δεξαμενή για bulk)"),addM(ex,-15),ex,T("Plan the DD to fall inside the special survey window","Βάλε τη δεξαμενή μέσα στο παράθυρο του special survey"));}
  h+=`</table>`;
  const age=sv.built?(today().getFullYear()-(+sv.built)):null;
  h+=`<p class="note">${age!=null?`${T("Ship age","Ηλικία πλοίου")}: <b>${age}</b> ${T("years","χρόνια")} · `:""}${age!=null&&age>=15?T("⚠️ 15 years or older: intermediate bottom survey of a bulk carrier under ESP must be in DRY DOCK (in-water survey in lieu not accepted) – confirm with class.","⚠️ 15 χρόνια και πάνω: το intermediate bottom survey bulk carrier (ESP) πρέπει να γίνει σε ΔΕΞΑΜΕΝΗ (δεν δέχεται in-water survey) – επιβεβαίωσε με class."):T("Under 15 years: intermediate bottom survey may be an In-Water Survey (UWILD) if class accepts it.","Κάτω από 15 χρόνια: το intermediate bottom survey μπορεί να γίνει In-Water Survey (UWILD) αν το δεχτεί το class.")}</p>`;}
 const ism=D(sv.ism);
 if(ism){const iss=addM(ism,-60);h+=`<h2>🛡️ ISM SMC · ISPS ISSC · MLC</h2><table class="sv">`;
  h+=row(T("INTERMEDIATE audit / verification / inspection","INTERMEDIATE audit / verification / inspection"),addM(iss,24),addM(iss,36),T("Between the 2nd and 3rd anniversary date (one only)","Μεταξύ 2ης και 3ης επετείου (μόνο μία)"));
  h+=row(T("RENEWAL","RENEWAL"),addM(ism,-3),ism,T("Within 3 months before expiry","Μέσα σε 3 μήνες πριν τη λήξη"));h+=`</table>`;}
 const doc=D(sv.doc);
 if(doc){const iss=addM(doc,-60);h+=`<h2>🏢 DOC (${T("company","εταιρεία")})</h2><table class="sv">`;
  for(let k=1;k<=4;k++){const an=addM(iss,12*k);h+=row(`${T("Annual verification","Annual verification")} ${k}`,addM(an,-3),addM(an,3),"");}
  h+=`</table><p class="note">${T("If the company misses the DOC annual verification, the DOC – and all SMCs of the fleet – become invalid. Check the endorsement on the copy on board.","Αν η εταιρεία χάσει την annual verification του DOC, ακυρώνεται το DOC – και όλα τα SMC του στόλου. Έλεγξε το endorsement στο αντίγραφο του πλοίου.")}</p>`;}
 const pi=D(sv.pi);
 return h||`<p class="note">${T("Enter the dates above to see all windows.","Βάλε τις ημερομηνίες πάνω για να δεις όλα τα παράθυρα.")}</p>`;}

const GUIDE=[
["🗓️","The 'window' in simple words","Το «παράθυρο» με απλά λόγια",
 "Every statutory certificate has an anniversary date = the day & month it expires. Each year the survey must be done inside a window: from 3 months BEFORE to 3 months AFTER that date (6 months in total). Inside the window = certificate stays valid. Outside = the certificate is INVALID (SOLAS I/14(i)) and the ship can be detained.",
 "Κάθε καταστατικό πιστοποιητικό έχει anniversary date = την ημέρα και τον μήνα που λήγει. Κάθε χρόνο το survey πρέπει να γίνει μέσα σε ένα παράθυρο: από 3 μήνες ΠΡΙΝ έως 3 μήνες ΜΕΤΑ από αυτή την ημερομηνία (σύνολο 6 μήνες). Μέσα στο παράθυρο = το cert ισχύει. Έξω = το cert είναι ΑΚΥΡΟ (SOLAS I/14(i)) και το πλοίο μπορεί να κρατηθεί."],
["🔁","Annual survey","Annual survey",
 "Every year, ±3 months around the anniversary date. Applies to: Safety Construction, Safety Equipment (annual), Safety Radio (periodical every year), Load Line, IOPP, IAPP, BWM, and class annual survey. The surveyor endorses the back of each certificate – no endorsement = no survey.",
 "Κάθε χρόνο, ±3 μήνες γύρω από το anniversary date. Ισχύει για: Safety Construction, Safety Equipment (annual), Safety Radio (periodical κάθε χρόνο), Load Line, IOPP, IAPP, BWM και class annual survey. Ο surveyor κάνει endorsement πίσω σε κάθε cert – χωρίς endorsement = δεν έγινε survey."],
["🔍","Intermediate / Periodical survey","Intermediate / Periodical survey",
 "Once in the 5 years, in the window of the 2nd OR the 3rd anniversary (±3 months). It replaces that year's annual and is deeper (e.g. ballast tanks of bulk carriers under ESP, Safety Equipment periodical). Applies to SC, SE (periodical), IOPP, IAPP, BWM and class. You choose 2nd or 3rd – plan it with the dry dock.",
 "Μία φορά στην 5ετία, στο παράθυρο της 2ης Ή της 3ης επετείου (±3 μήνες). Αντικαθιστά το annual εκείνης της χρονιάς και είναι πιο βαθύ (π.χ. δεξαμενές έρματος bulk με ESP, periodical του Safety Equipment). Ισχύει για SC, SE, IOPP, IAPP, BWM και class. Διαλέγεις 2η ή 3η – σχεδίασέ το μαζί με τη δεξαμενή."],
["♻️","Renewal survey (new 5-year certificate)","Renewal survey (νέο 5ετές cert)",
 "Done in the last 3 months before expiry → new certificate valid 5 years from the OLD expiry date (you lose nothing). Done earlier → new certificate 5 years from the completion date (you lose months). Done after expiry → 5 years from the old expiry. Flag may extend max 3 months only to let the ship reach the port of survey (SOLAS I/14(e)), or 1 month for short voyages.",
 "Αν γίνει στους τελευταίους 3 μήνες πριν τη λήξη → νέο cert 5 χρόνια από την ΠΑΛΙΑ λήξη (δεν χάνεις τίποτα). Αν γίνει νωρίτερα → 5 χρόνια από την ημερομηνία ολοκλήρωσης (χάνεις μήνες). Αν γίνει μετά τη λήξη → 5 χρόνια από την παλιά λήξη. Η σημαία μπορεί να δώσει παράταση max 3 μήνες μόνο για να φτάσει το πλοίο στο λιμάνι του survey (SOLAS I/14(e)), ή 1 μήνα για σύντομα ταξίδια."],
["🏛️","Class Special Survey (Renewal) & Continuous Survey","Class Special Survey (Renewal) & Continuous Survey",
 "Class certificate = 5 years. The Special Survey may START at the 4th annual survey (15 months before) and be progressed, so that it is completed by the expiry date. Close-up surveys and thickness measurements (ESP) are part of it. Machinery is often on Continuous Survey (CSM): each item surveyed at least once in 5 years. Ask class for the 'survey status' every 3 months and plan.",
 "Class certificate = 5 χρόνια. Το Special Survey μπορεί να ΞΕΚΙΝΗΣΕΙ από την 4η annual (15 μήνες πριν) και να προχωρά, ώστε να τελειώσει έως τη λήξη. Μέσα είναι close-up surveys και παχυμετρήσεις (ESP). Οι μηχανές συχνά είναι σε Continuous Survey (CSM): κάθε item τουλάχιστον μία φορά στην 5ετία. Ζήτα από το class «survey status» κάθε 3 μήνες και σχεδίασε."],
["⚓","Bottom survey / Dry dock / In-water survey (UWILD)","Bottom survey / Δεξαμενή / In-water survey (UWILD)",
 "SOLAS: at least TWO inspections of the outside of the bottom in every 5 years; one must be with the renewal survey; never more than 36 months between two. For bulk carriers the renewal one is in DRY DOCK. The intermediate one may be an In-Water Survey (UWILD / IWS) by a class-approved diving company if the ship is under 15 years and class accepts it; from 15 years of age bulk carriers under ESP go to dry dock. For UWILD: call class early, approved divers, clear water, hull marks, CCTV/photos.",
 "SOLAS: τουλάχιστον ΔΥΟ επιθεωρήσεις εξωτερικά του πυθμένα σε κάθε 5ετία· η μία μαζί με το renewal· ποτέ πάνω από 36 μήνες ανάμεσα σε δύο. Για bulk το renewal γίνεται σε ΔΕΞΑΜΕΝΗ. Το intermediate μπορεί να γίνει In-Water Survey (UWILD / IWS) από εγκεκριμένους δύτες του class αν το πλοίο είναι κάτω από 15 χρόνια και το δεχτεί το class· από 15 χρόνια τα bulk με ESP πάνε δεξαμενή. Για UWILD: ειδοποίησε το class νωρίς, εγκεκριμένοι δύτες, καθαρά νερά, σημάδια γάστρας, CCTV/φωτογραφίες."],
["🔩","Tailshaft, boilers, other class items","Άξονας, λέβητες, άλλα class items",
 "Tailshaft: normally every 5 years (longer with oil-lubricated shaft & Tailshaft Condition Monitoring – oil analysis every 6 months per class). Boilers: internal examination twice in every 5 years, max 36 months between (IACS UR Z18). Also: anchor & chain, steering gear, emergency generator, fire systems – all in class continuous survey. Always check the class status for 'due' and 'overdue'.",
 "Άξονας: κανονικά κάθε 5 χρόνια (περισσότερο με oil-lubricated άξονα & TCM – ανάλυση λαδιού ανά 6 μήνες κατά class). Λέβητες: εσωτερική επιθεώρηση δύο φορές σε κάθε 5ετία, max 36 μήνες ανάμεσα (IACS UR Z18). Επίσης: άγκυρες & αλυσίδες, πηδάλιο, emergency generator, πυροσβεστικά – όλα στο continuous survey. Έλεγχε πάντα το class status για 'due' και 'overdue'."],
["🛡️","ISM / ISPS / MLC","ISM / ISPS / MLC",
 "SMC, ISSC and MLC certificate: 5 years, ONE intermediate between the 2nd and 3rd anniversary date (not ±3 months!), renewal within 3 months before expiry. DOC (company): annual verification ±3 months each year – check the endorsement on the copy on board. Company internal audits every 12 months.",
 "SMC, ISSC και MLC: 5 χρόνια, ΕΝΑ intermediate μεταξύ 2ης και 3ης επετείου (όχι ±3 μήνες!), renewal μέσα σε 3 μήνες πριν τη λήξη. DOC (εταιρεία): annual verification ±3 μήνες κάθε χρόνο – έλεγξε το endorsement στο αντίγραφο. Εσωτερικά audits εταιρείας κάθε 12 μήνες."],
["⚠️","Practical rules for the Superintendent","Πρακτικοί κανόνες για τον Superintendent",
 "1) Book surveys in the FIRST half of the window – never the last week (delays, weather, port). 2) Plan intermediate + bottom survey + class items together (one attendance). 3) Before the surveyor: close all Conditions of Class, have the 'what to check' list of this app done. 4) Check every endorsement after the survey (signature, stamp, date, place). 5) Extensions only from flag/class in writing – before expiry.",
 "1) Κλείνε survey στο ΠΡΩΤΟ μισό του παραθύρου – ποτέ την τελευταία εβδομάδα (καθυστερήσεις, καιρός, λιμάνι). 2) Σχεδίαζε μαζί intermediate + bottom survey + class items (μία επίσκεψη). 3) Πριν έρθει ο surveyor: κλείσε τα Conditions of Class και κάνε τη λίστα ελέγχου της εφαρμογής. 4) Μετά το survey έλεγξε κάθε endorsement (υπογραφή, σφραγίδα, ημερομηνία, τόπος). 5) Παρατάσεις μόνο γραπτώς από σημαία/class – πριν τη λήξη."]
];

const SERV=[
["📻 RADIO & NAVIGATION","📻 RADIO & ΝΑΥΣΙΠΛΟΪΑ"],
["Radio survey (GMDSS) – SR certificate","Radio survey (GMDSS) – SR certificate","Every year ±3 months of anniversary (periodical)","Κάθε χρόνο ±3 μήνες από την επέτειο (periodical)","RO radio surveyor","Radio surveyor του RO","Without it the Safety Radio Certificate is invalid; ship cannot sail.","Χωρίς αυτό το Safety Radio Cert είναι άκυρο· το πλοίο δεν ταξιδεύει."],
["GMDSS daily / weekly / monthly tests","GMDSS ημερήσια / εβδομαδιαία / μηνιαία tests","Daily DSC test · weekly · monthly EPIRB/SART/batteries – in GMDSS log","Ημερήσιο DSC · εβδομαδιαίο · μηνιαίο EPIRB/SART/μπαταρίες – στο GMDSS log","Officers (GMDSS)","Αξιωματικοί (GMDSS)","PSC checks the log first.","Το PSC κοιτά πρώτα το log."],
["EPIRB","EPIRB","Annual test · shore-based maintenance ≤ 5 years · battery & HRU expiry","Ετήσιο test · shore-based maintenance ≤ 5 χρόνια · λήξη μπαταρίας & HRU","Radio company","Εταιρεία ραδιο","If it does not transmit, nobody finds you.","Αν δεν εκπέμψει, δεν σε βρίσκει κανείς."],
["VDR / S-VDR","VDR / S-VDR","Annual Performance Test","Ετήσιο APT","Maker-approved company","Εγκεκριμένη εταιρεία","Evidence after an accident; mandatory yearly.","Απόδειξη μετά από ατύχημα· υποχρεωτικό ετησίως."],
["AIS","AIS","Annual test","Ετήσιο test","Radio company","Εταιρεία ραδιο","Wrong AIS data confuses VTS & other ships.","Λάθος AIS μπερδεύει VTS & πλοία."],
["LRIT","LRIT","Conformance test on installation / change","Conformance test σε εγκατάσταση / αλλαγή","ASP / radio company","ASP / εταιρεία ραδιο","Flag must receive the position every 6 h.","Η σημαία πρέπει να παίρνει θέση κάθε 6 ώρες."],
["Gyro compass","Gyro","Error checked every watch (azimuth/transit) · maker service per maker (often yearly / by running hours)","Σφάλμα σε κάθε βάρδια (azimuth/transit) · service κατασκευαστή (συνήθως ετήσιο / κατά ώρες)","Officers · maker","Αξιωματικοί · κατασκευαστής","Gyro feeds radar, ECDIS, autopilot – an error moves everything.","Το gyro τροφοδοτεί radar, ECDIS, autopilot – ένα σφάλμα τα μετακινεί όλα."],
["Magnetic compass & deviation card","Μαγνητική πυξίδα & deviation card","Error checked every watch · re-adjusted and new deviation card after dry dock/steel work, when errors grow (e.g. > 5°) or at the interval set by flag/company (commonly ≤ 2 years)","Σφάλμα σε κάθε βάρδια · νέα ρύθμιση & νέα deviation card μετά από δεξαμενή/λαμαρινοδουλειές, όταν μεγαλώσουν τα σφάλματα (π.χ. > 5°) ή στο διάστημα σημαίας/εταιρείας (συνήθως ≤ 2 χρόνια)","Licensed compass adjuster","Αδειούχος compass adjuster","The back-up when gyro fails; old card = PSC finding.","Η εφεδρεία όταν χαλάσει το gyro· παλιά κάρτα = PSC finding."],
["Radars, ECDIS, echo sounder, speed log, BNWAS","Radar, ECDIS, echo sounder, speed log, BNWAS","Maker service per PMS (often yearly) · ECDIS charts/permits weekly · ECDIS software per IHO","Service κατασκευαστή κατά PMS (συνήθως ετήσιο) · ECDIS χάρτες/permits εβδομαδιαία · software κατά IHO","Maker / crew","Κατασκευαστής / πλήρωμα","SOLAS V/19 equipment must work; PSC tests them.","Ο εξοπλισμός SOLAS V/19 πρέπει να δουλεύει· το PSC τα δοκιμάζει."],
["Charts & publications corrections","Διορθώσεις χαρτών & εκδόσεων","Weekly (Notices to Mariners)","Εβδομαδιαία (NtM)","2nd Officer","Ανθυποπλοίαρχος","Most common PSC deficiency.","Το πιο συχνό PSC finding."],
["🛟 LSA","🛟 LSA"],
["Liferafts & HRU","Liferafts & HRU","12 months (≤17 with flag approval)","12 μήνες (≤17 με έγκριση σημαίας)","Approved service station","Εγκεκριμένος σταθμός","Life-saving; expired service = detention.","Σωστικά· ληγμένο service = κράτηση."],
["Disposable HRU","HRU μιας χρήσης","Replace at expiry (2 years)","Αλλαγή στη λήξη (2 χρόνια)","Crew / station","Πλήρωμα / σταθμός","",""],
["Lifeboats, rescue boat, davits, winches, release gear","Σωσίβιες, rescue boat, davits, βαρούλκα, release gear","Annual thorough exam · 5-yearly overhaul + dynamic brake test","Ετήσια εξέταση · 5ετές overhaul + δυναμική δοκιμή φρένου","Maker-authorised provider (MSC.402(96))","Εξουσιοδοτημένος provider (MSC.402(96))","Release gear accidents kill crew – only authorised people.","Τα ατυχήματα release gear σκοτώνουν – μόνο εξουσιοδοτημένοι."],
["Davit falls (φάρκες)","Falls (φάρκες) davits","Renew ≤ 5 years (end-for-end per flag)","Αλλαγή ≤ 5 χρόνια (γύρισμα κατά σημαία)","Provider / class","Provider / class","",""],
["Inflatable lifejackets","Φουσκωτά σωσίβια","12 months","12 μήνες","Approved station","Εγκεκριμένος σταθμός","",""],
["Immersion suits","Στολές εμβάπτισης","Air test every 3 years (> 10 yrs more often)","Air test κάθε 3 χρόνια (> 10 ετών συχνότερα)","Station / crew","Σταθμός / πλήρωμα","",""],
["Lifeboat launch drill","Καθαίρεση σωσίβιας","Every 3 months (launched & manoeuvred) · rescue boat monthly","Κάθε 3 μήνες · rescue boat μηνιαίως","Crew","Πλήρωμα","",""],
["Pyrotechnics, SART/VHF batteries","Pyrotechnics, μπαταρίες SART/VHF","Before expiry","Πριν τη λήξη","Supplier","Προμηθευτής","",""],
["🧯 FFE","🧯 FFE"],
["Fire extinguishers","Πυροσβεστήρες","Annual · 5-yr discharge per type · 10-yr hydro","Ετήσιο · 5ετής εκκένωση · 10ετής υδραυλική","Competent company","Εγκεκριμένη εταιρεία","",""],
["Fixed CO2","Σταθερό CO2","Annual (quantity, alarms, delay) · hoses & 10% cylinders at 10 yrs","Ετήσιο · hoses & 10% φιαλών στα 10 χρόνια","Approved company","Εγκεκριμένη εταιρεία","",""],
["SCBA / EEBD / breathing air","SCBA / EEBD / αέρας","Annual service · cylinders hydro 5 yrs · compressor air test annual","Ετήσιο service · υδραυλική 5 χρόνια · ετήσιο test αέρα","Company / lab","Εταιρεία / εργαστήριο","",""],
["Fire detection","Πυρανίχνευση","Annual test of all detectors","Ετήσιο test όλων","Competent person","Competent person","",""],
["Foam","Αφρός","Annual analysis","Ετήσια ανάλυση","Lab","Εργαστήριο","",""],
["Emergency fire pump & emergency generator","Emergency fire pump & emergency generator","Weekly run · monthly fuel check · yearly capacity test","Εβδομαδιαία λειτουργία · μηνιαίος έλεγχος καυσίμου · ετήσιο test παροχής","Engineers","Μηχανικοί","PSC always starts them.","Το PSC πάντα τα ξεκινά."],
["🌊 ENVIRONMENT","🌊 ΠΕΡΙΒΑΛΛΟΝ"],
["BWMS – why we have it","BWMS – γιατί το έχουμε","Mandatory D-2 for all ships since 8 Sep 2024 (BWM Convention): ballast must be treated so it does not carry living organisms to another sea","Υποχρεωτικό D-2 για όλα τα πλοία από 8/9/2024 (BWM Convention): το έρμα επεξεργάζεται για να μη μεταφέρει ζωντανούς οργανισμούς σε άλλη θάλασσα","—","—","Invasive species destroy local fisheries & ecosystems; ports (USA, AU, China) sample & fine.","Ξενικά είδη καταστρέφουν αλιεία & οικοσυστήματα· λιμάνια (ΗΠΑ, AU, Κίνα) παίρνουν δείγματα & επιβάλλουν πρόστιμα."],
["BWMS sensors (UV intensity, TRO, flow) calibration & maintenance","BWMS αισθητήρες (UV, TRO, flow) καλιμπράρισμα & συντήρηση","Per maker (typically annual) · UV lamps by running hours · filters cleaned","Κατά κατασκευαστή (συνήθως ετήσιο) · λάμπες UV κατά ώρες · φίλτρα","Maker service","Service κατασκευαστή","A system that 'runs' with bad sensors does not treat – PSC checks the alarm log.","Σύστημα που «δουλεύει» με κακούς αισθητήρες δεν επεξεργάζεται – το PSC κοιτά το alarm log."],
["BWMS sampling / test","BWMS δείγματα / test","Commissioning test once (BWM.2/Circ.70) · then indicative sampling only if port/company requires (USA, AU, China may sample)","Commissioning test μία φορά (BWM.2/Circ.70) · μετά δείγματα μόνο αν το ζητά λιμάνι/εταιρεία (ΗΠΑ, AU, Κίνα μπορεί να δειγματίσουν)","Approved lab","Εγκεκριμένο εργαστήριο","Shows the system actually kills organisms.","Δείχνει ότι το σύστημα πράγματι σκοτώνει οργανισμούς."],
["15 ppm bilge alarm","15 ppm alarm","Calibration certificate per maker (≤ 5 years) · crew test monthly · seals logged","Cert καλιμπραρίσματος κατά κατασκευαστή (≤ 5 χρόνια) · μηνιαίο test · σφραγίδες στο log","Maker / service","Κατασκευαστής / service","Stops illegal oily discharge; USCG/Paris MoU check closely.","Σταματά παράνομη απόρριψη· η USCG/Paris MoU το ελέγχουν αυστηρά."],
["OWS","OWS","Per PMS · test with clean water · overboard valve sealed","Κατά PMS · δοκιμή με καθαρό νερό · overboard valve σφραγισμένη","Engineers","Μηχανικοί","",""],
["Sewage plant (STP)","Βιολογικός (STP)","Daily checks · effluent test if flag/port requires","Ημερήσιοι έλεγχοι · test εκροής αν το ζητά σημαία/λιμάνι","Engineers / lab","Μηχανικοί / εργαστήριο","",""],
["Incinerator","Αποτεφρωτήρας","Per maker / PMS","Κατά κατασκευαστή / PMS","Engineers","Μηχανικοί","",""],
["Fuel: bunker samples & analysis","Καύσιμα: δείγματα & ανάλυση","Each bunker: MARPOL sample kept 12 months · lab analysis before use · BDN 3 years","Κάθε bunker: MARPOL sample 12 μήνες · ανάλυση πριν τη χρήση · BDN 3 χρόνια","Lab","Εργαστήριο","",""],
["💧 WATER & HEALTH","💧 ΝΕΡΟ & ΥΓΕΙΑ"],
["Potable water – lab analysis","Πόσιμο νερό – ανάλυση εργαστηρίου","YES needed: bacteriological typically every 6 months, chemical yearly (WHO Guide / flag / company) · chlorine & pH onboard daily–weekly","ΝΑΙ χρειάζεται: μικροβιολογική συνήθως ανά 6 μήνες, χημική ετήσια (WHO / σημαία / εταιρεία) · χλώριο & pH στο πλοίο ημερήσια–εβδομαδιαία","Shore lab · C/O","Εργαστήριο · Ύπαρχος","Crew drink it – MLC & flag inspectors ask for the last report.","Το πίνει το πλήρωμα – MLC & flag inspectors ζητούν την τελευταία ανάλυση."],
["Fresh water tanks","Δεξαμενές πόσιμου","Cleaned & disinfected at each dry dock or ~2 years · hoses disinfected 6-monthly (Liberia)","Καθαρισμός & απολύμανση σε κάθε δεξαμενή ή ~2 χρόνια · μάνικες απολύμανση ανά 6 μήνες (Liberia)","Crew / contractor","Πλήρωμα / συνεργείο","",""],
["Medicine chest","Φαρμακείο","≤ 12 months","≤ 12 μήνες","Pharmacist / approved","Φαρμακοποιός","",""],
["Ship Sanitation Certificate","Ship Sanitation Certificate","6 months","6 μήνες","Port health","Υγειονομική αρχή","",""],
["Seafarer medicals","Ιατρικά ναυτικών","≤ 2 years (colour vision 6 years)","≤ 2 χρόνια (αχρωματοψία 6 χρόνια)","Approved doctor","Εγκεκριμένος γιατρός","",""],
["⚙️ MACHINERY & OVERHAULS","⚙️ ΜΗΧΑΝΕΣ & OVERHAULS"],
["Main engine & generators overhauls","Overhauls κύριας & ηλεκτρομηχανών","By running hours per maker (PMS) – pistons, injectors, turbochargers, bearings","Κατά ώρες λειτουργίας κατασκευαστή (PMS) – πιστόνια, μπεκ, turbo, κουζινέτα","Engineers / maker","Μηχανικοί / κατασκευαστής","Overdue PMS jobs are RightShip & PSC findings.","Ληξιπρόθεσμες εργασίες PMS = findings RightShip & PSC."],
["Lube oil analysis ME/AE","Ανάλυση λαδιού ME/AE","≈ 3 months","≈ 3 μήνες","Lab","Εργαστήριο","",""],
["Stern tube oil (TCM)","Λάδι χοάνης (TCM)","Per class TCM (typically 3–6 months)","Κατά class TCM (συνήθως 3–6 μήνες)","Lab → class","Εργαστήριο → class","",""],
["Hydraulic oils (steering, cranes, hatch covers)","Υδραυλικά λάδια (πηδάλιο, γερανοί, καπάκια)","6–12 months","6–12 μήνες","Lab","Εργαστήριο","",""],
["Steering gear","Πηδάλιο","Test 12 h before departure · emergency steering drill every 3 months","Δοκιμή 12 ώρες πριν τον απόπλου · drill ανά 3 μήνες","Officers / engineers","Αξιωματικοί / μηχανικοί","",""],
["Quick-closing valves, remote stops","Quick-closing valves, remote stops","Test per PMS (often 3-monthly)","Δοκιμή κατά PMS (συνήθως τρίμηνο)","Engineers","Μηχανικοί","",""],
["Boilers, air receivers, safety valves","Λέβητες, δοχεία αέρα, ασφαλιστικές","Class: boiler internal 2× in 5 yrs (≤ 36 months apart)","Class: εσωτερικός λέβητα 2× στην 5ετία (≤ 36 μήνες)","Class","Class","",""],
["Insulation (megger) & emergency batteries","Μόνωση (megger) & μπαταρίες έκτακτης","Monthly/per PMS","Μηνιαία / κατά PMS","Electrician","Ηλεκτρολόγος","",""],
["🏗️ CRANES & ACCESS","🏗️ ΓΕΡΑΝΟΙ & ΠΡΟΣΒΑΣΗ"],
["Cargo cranes & loose gear","Γερανοί & loose gear","Annual thorough exam · 5-yearly load test","Ετήσια εξέταση · 5ετές load test","Competent person / class","Competent person / class","",""],
["Accommodation ladder & gangway","Σκάλα & gangway","Annual thorough exam · load test ≤ 5 years","Ετήσια εξέταση · load test ≤ 5 χρόνια","Competent person","Competent person","",""],
["Pilot ladder","Pilot ladder","Monthly check · from 2028: out of service 36 months from manufacture / 30 months in use","Μηνιαίος έλεγχος · από 2028: απόσυρση 36 μήνες από κατασκευή / 30 μήνες χρήσης","Crew / maker","Πλήρωμα / κατασκευαστής","",""],
["Gas detectors","Ανιχνευτές αερίων","Calibration per maker (6–12 months) · bump test before use","Καλιμπράρισμα (6–12 μήνες) · bump test πριν τη χρήση","Maker / service","Κατασκευαστής","",""],
["💼 INSURANCE & COMPANY","💼 ΑΣΦΑΛΕΙΕΣ & ΕΤΑΙΡΕΙΑ"],
["P&I, Bunker, WRC, MLC financial security","P&I, Bunker, WRC, MLC financial security","Renewed every 20 February – new certificates on board before that date","Ανανέωση κάθε 20 Φεβρουαρίου – νέα certs στο πλοίο πριν από αυτή","P&I club / Flag","P&I club / Σημαία","Expired = ports refuse entry.","Ληγμένα = άρνηση εισόδου σε λιμάνια."],
["Hull & Machinery","Hull & Machinery","Annual (per policy date)","Ετήσιο (κατά πολιτική)","Owners / brokers","Πλοιοκτήτες / brokers","",""],
["COFR (USA)","COFR (ΗΠΑ)","≤ 3 years","≤ 3 χρόνια","USCG","USCG","",""],
["Company DOC annual verification","DOC εταιρείας – annual verification","Every year ±3 months","Κάθε χρόνο ±3 μήνες","Flag / RO","Σημαία / RO","Missed = all SMCs invalid.","Αν χαθεί = άκυρα όλα τα SMC."],
["ISM internal audit (ship)","ISM εσωτερικό audit (πλοίο)","Every 12 months","Κάθε 12 μήνες","Company auditor","Auditor εταιρείας","",""],
["Master's Review / Management Review","Master's Review / Management Review","Yearly (company SMS)","Ετήσια (SMS)","Master / company","Πλοίαρχος / εταιρεία","",""],
["SSO drills / security exercise","Security drills / exercise","Drill every 3 months · exercise yearly","Drill ανά 3 μήνες · exercise ετήσια","SSO / CSO","SSO / CSO","",""],
["IMO DCS · EU MRV · FuelEU","IMO DCS · EU MRV · FuelEU","Data by end Jan/Mar · DCS SoC by 1 June · MRV & FuelEU DoC by 30 June","Στοιχεία έως τέλος Ιαν/Μαρ · DCS SoC έως 1 Ιουνίου · MRV & FuelEU DoC έως 30 Ιουνίου","Company · Flag/RO · verifier","Εταιρεία · Σημαία/RO · verifier","",""],
["Flag annual safety inspection (LR/MH/PA)","Annual safety inspection σημαίας (LR/MH/PA)","Every 12 months","Κάθε 12 μήνες","Flag nautical inspector","Flag inspector","",""]
];

window.renderSurvey=function(){const v=(window.V_&&window.V_())||{};v.sv=v.sv||{};const sv=v.sv;
 const el=document.getElementById("v-surv");
 el.innerHTML=`<div class="card"><h2>📅 ${T("Survey windows calculator","Υπολογιστής παραθύρων surveys")}</h2>
 <p class="note">${T("Enter the expiry date of the certificates (they usually share one date – HSSC). The app shows every window and whether it is open now.","Βάλε τη λήξη των πιστοποιητικών (συνήθως έχουν κοινή ημερομηνία – HSSC). Η εφαρμογή δείχνει κάθε παράθυρο και αν είναι ανοιχτό τώρα.")}</p>
 <div class="g2">
  <label>${T("SOLAS/LL/MARPOL & Class – expiry date","SOLAS/LL/MARPOL & Class – λήξη")}<input type="date" data-sv="exp" value="${sv.exp||""}"></label>
  <label>${T("Last bottom survey (DD or UWILD)","Τελευταίο bottom survey (DD ή UWILD)")}<input type="date" data-sv="dd" value="${sv.dd||""}"></label>
  <label>${T("SMC / ISSC / MLC – expiry","SMC / ISSC / MLC – λήξη")}<input type="date" data-sv="ism" value="${sv.ism||""}"></label>
  <label>${T("Company DOC – expiry","DOC εταιρείας – λήξη")}<input type="date" data-sv="doc" value="${sv.doc||""}"></label>
 </div>
 <p class="note">${T("Year built (from 🚢 Ship)","Έτος ναυπήγησης (από 🚢 Πλοίο)")}: <b>${e(v.built||"–")}</b></p>
 <div id="svout">${calc(Object.assign({built:v.built},sv))}</div></div>
 <div class="card"><h2>📖 ${T("Guide – the rules in simple words","Οδηγός – οι κανόνες με απλά λόγια")}</h2>
 ${GUIDE.map(g=>`<details class="gd"><summary>${g[0]} <b>${e(T(g[1],g[2]))}</b></summary><p>${e(T(g[3],g[4]))}</p></details>`).join("")}
 <p class="note">${T("Refs: SOLAS I/10 & I/14, Survey Guidelines under HSSC (Res. A.1186(33)), ICLL, MARPOL, ISM 13, ISPS A/19, MLC 5.1.3, IACS UR Z7/Z10.2/Z18, ESP Code. Class rules may add their own conditions – always check the class status.","Αναφορές: SOLAS I/10 & I/14, Survey Guidelines HSSC (Res. A.1186(33)), ICLL, MARPOL, ISM 13, ISPS A/19, MLC 5.1.3, IACS UR Z7/Z10.2/Z18, ESP Code. Κάθε class μπορεί να έχει επιπλέον όρους – έλεγχε πάντα το class status.")}</p></div>
 <div class="card"><h2>🛟 ${T("Everything that is periodic on board – when, who, why","Ό,τι γίνεται περιοδικά στο πλοίο – πότε, ποιος, γιατί")}</h2>
 <table class="sv"><tr><th>${T("Item","Είδος")}</th><th>${T("How often","Πόσο συχνά")}</th><th>${T("Who","Ποιος")}</th></tr>
 ${SERV.map(s=>s.length===2?`<tr><td colspan="3" class="svh">${e(T(s[0],s[1]))}</td></tr>`:`<tr><td><b>${e(T(s[0],s[1]))}</b>${s[6]?`<div class="note">❓ ${e(T(s[6],s[7]))}</div>`:""}</td><td>${e(T(s[2],s[3]))}</td><td>${e(T(s[4],s[5]))}</td></tr>`).join("")}</table>
 <p class="note">${T("Tip: put the next-due date of each service in the ✅ Check tab – the app turns it amber at 90 and red at 30 days.","Συμβουλή: βάλε την επόμενη ημερομηνία κάθε service στην καρτέλα ✅ Έλεγχος – γίνεται κίτρινο στις 90 και κόκκινο στις 30 ημέρες.")}</p></div>`;
 el.querySelectorAll("[data-sv]").forEach(i=>i.onchange=()=>{sv[i.dataset.sv]=i.value;window.save_&&window.save_();document.getElementById("svout").innerHTML=calc(Object.assign({built:v.built},sv));});};
})();
