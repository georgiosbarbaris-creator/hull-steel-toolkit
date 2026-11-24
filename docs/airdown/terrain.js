/* ===== Overland’s Habit · Air Down Calculator · εδάφη, κανόνες, πηγές (έρευνα 23–24/11/2026, AIRDOWN_BRAIN.md) =====
   lo/hi = λόγος της πίεσης δρόμου (ετικέτα κολόνας, κρύα). Στόχος = ετικέτα × λόγος. Ξεκινάς ΠΑΝΤΑ από το hi.
   cap  = ανώτατη ταχύτητα εδάφους km/h (κόβει την καμπύλη ταχύτητας Toyo)
   soft = μαλακό έδαφος: +psi όταν είσαι βαρύς/φορτωμένος, υπάρχει λειτουργία «Κόλλησα»
   fl   = ελάχιστο εδάφους χωρίς beadlock (psi), αν είναι πιο ψηλά από το γενικό 15
   bl   = εύρος με beadlock [lo,hi] psi · big = με beadlock ΚΑΙ ελαστικό ≥37" · stuck = τύπος ξεκολλήματος
   ss   = SINGLE-SOURCE σημείωση · ΑΛΛΑΓΗ: άλλαξε τα νούμερα εδώ, ο υπολογισμός ακολουθεί. */
const TERR=[
{k:'road',ic:'🛣️',el:'Άσφαλτος',en:'Tarmac',lo:1,hi:1,cap:0,
 d:['Η πίεση της ετικέτας (κολόνα πόρτας ή καπάκι ρεζερβουάρ), μετρημένη με κρύα ελαστικά. Φορτωμένο: η «φορτωμένη» τιμή της ετικέτας, συνήθως ψηλότερη πίσω.','The placard pressure (door pillar or fuel flap), measured cold. Loaded: the placard’s “laden” value, usually higher at the rear.'],
 t:[['Μετράς κρύα: σταματημένο ≥3 ώρες ή <3 km αργά.','Measure cold: parked ≥3 h or driven <3 km slowly.'],['Ζεστό ελαστικό δείχνει +4 psi (επιβατικό) έως +6 psi (LT). Είναι φυσιολογικό. Ποτέ μη βγάζεις αέρα από ζεστό για να «πέσει» στην ετικέτα.','A hot tyre reads +4 psi (passenger) to +6 psi (LT). That is normal. Never bleed a hot tyre down to the placard.'],['Κανόνας 4–6 psi: φούσκωσε κρύο, οδήγησε 20–30′, ξαναμέτρα. Ανέβηκε ~4 (P) / ~6 (LT); σωστό. Πολύ περισσότερο; ήταν χαμηλή για το φορτίο.','4–6 psi rule: set cold, drive 20–30 min, re-measure. Rose ~4 (P) / ~6 (LT)? Right. Much more? Too low for the load.']],
 src:'Bridgestone AU · Cooper AU · Land Rover workshop data (+0,41 bar ζεστό) · NHTSA'},
{k:'gravel',ic:'🪨',el:'Γρήγορο χαλίκι',en:'Fast gravel',lo:.78,hi:.82,cap:80,
 d:['«Κανόνας 20%»: −20% πίεση ΚΑΙ −20% ταχύτητα. π.χ. 36→29 psi, 100→80 km/h. Το πιο συνηθισμένο ελληνικό έδαφος.','“20% rule”: −20% pressure AND −20% speed. e.g. 36→29 psi, 100→80 km/h. The most common Greek terrain.'],
 t:[['Ποτέ πάνω από 80 km/h στο χώμα.','Never above 80 km/h on dirt.'],['Στο χώμα οι περισσότερες ζημιές έρχονται από ΠΟΛΥ αέρα: σκληρό ελαστικό, σπασμένα τακάκια πέλματος, τρύπες.','On dirt most tyre damage comes from TOO MUCH air: hard tyre, chipped tread blocks, punctures.'],['Μεγαλύτερη απόσταση φρεναρίσματος. Ομαλό τιμόνι.','Longer braking distance. Smooth steering.']],
 src:'Toyo Tires AU «The 20 per cent rule» (D. Wilson) · WhichCar / 4X4 Australia · Cooper AU · Unsealed 4X4'},
{k:'corr',ic:'〰️',el:'Κυματισμοί (washboard)',en:'Corrugations (washboard)',lo:.70,hi:.80,cap:70,
 d:['−20 έως −30%. Η Bridgestone υπολογίζει το −30% πάνω στη ΖΕΣΤΗ πίεση λειτουργίας. ~25 psi → 60–70 km/h (Toyo).','−20 to −30%. Bridgestone takes the −30% from the HOT working pressure. ~25 psi → 60–70 km/h (Toyo).'],
 t:[['Οι κυματισμοί σκοτώνουν ελαστικά με θερμότητα, όχι με κοψίματα. Κόψε ταχύτητα.','Corrugations kill tyres through heat, not cuts. Slow down.'],['Το μαλακό ελαστικό απορροφά τα χτυπήματα και ξεκουράζει την ανάρτηση.','A softer tyre soaks up the hits and spares the suspension.'],['Ο κανόνας 4–6 psi δεν δουλεύει σε κυματισμούς (ζεσταίνονται πολύ πιο γρήγορα).','The 4–6 psi rule does not work on corrugations (they heat much faster).']],
 src:'Bridgestone AU · Cooper AU · Toyo AU · 4 Wheel Parts (−25%)'},
{k:'dirt',ic:'🌲',el:'Χωματόδρομος / δασικός αργός',en:'Slow dirt / forest track',lo:.60,hi:.75,cap:50,
 d:['18–28 psi σε μεσαίο 4x4 (−25 έως −40%). Toyo: 18 psi ≈ 50 km/h, 15 psi ≈ 40 km/h.','18–28 psi on a mid-size 4x4 (−25 to −40%). Toyo: 18 psi ≈ 50 km/h, 15 psi ≈ 40 km/h.'],
 t:[['Πέλμα πάνω στις πέτρες, ποτέ το πλαϊνό σε κλαδιά, ρίζες, κοφτερές άκρες.','Tread on the rocks, never the sidewall against sticks, roots, sharp edges.'],['Στην Ελλάδα: ΜΟΝΟ σε υπάρχοντες δρόμους. Ημέρες υψηλού κινδύνου πυρκαγιάς τα δάση κλείνουν.','In Greece: ONLY on existing roads. On high fire-risk days forests are closed.']],
 src:'CarAdvice · Toyo AU · Ironman 4x4 · Unsealed 4X4 (−40% «rocks & forest»)'},
{k:'mud',ic:'🟫',el:'Λάσπη',en:'Mud',lo:.62,hi:.78,cap:30,fl:20,soft:1,stuck:'mud',
 d:['Μέτρια πτώση μόνο: 22–28 psi (−20 έως −30%). Η λάσπη κρύβει αιχμηρά και το πλαϊνό εκτίθεται. Το εύρος της Cooper σταματά στα 22.','Moderate drop only: 22–28 psi (−20 to −30%). Mud hides sharp objects and exposes the sidewall. Cooper’s range stops at 22.'],
 t:[['Ορμή, όχι ταχύτητα. Σταθερό γκάζι, χωρίς σπινάρισμα που σκάβει.','Momentum, not speed. Steady throttle, no digging wheelspin.'],['Λάσπη μέσα στο bead = αργή διαρροή. Έλεγχος στις στάσεις.','Mud in the bead = slow leak. Check at every stop.']],
 src:'Cooper AU (22–28, «22 practical minimum») · 4X4 Australia (Mellor) · CarAdvice',ss:['Το −25% για λάσπη είναι από μία πηγή (νοτιοαφρικανικός οδηγός). Η «σχολή» που κρατά ψηλή πίεση στη λάσπη υπάρχει μόνο σε φόρουμ.','The −25% for mud is single-source (South African guide). The “keep pressure high in mud” school exists only on forums.']},
{k:'rock',ic:'🧗',el:'Πέτρα / crawling (λεία)',en:'Rock / crawling (smooth)',lo:.58,hi:.72,cap:10,bl:[5,10],
 d:['LT: αρχή 22 psi, εύρος 22–28 (−30 έως −40%). Το μαλακό ελαστικό «αγκαλιάζει» την πέτρα αντί να κάθεται πάνω της. Με beadlock: 5–8 psi είναι συνηθισμένο.','LT: start at 22 psi, range 22–28 (−30 to −40%). A soft tyre wraps the rock instead of sitting on it. With beadlocks: 5–8 psi is common.'],
 t:[['Low range, βήμα ανθρώπου, με καθοδηγητή (spotter).','Low range, walking pace, with a spotter.'],['Πέλμα πάνω στην πέτρα, ποτέ πλαϊνό ή ζάντα πάνω σε κόψη.','Tread on the rock, never the sidewall or rim on an edge.'],['Πολύ χαμηλά = η ζάντα χτυπά στην πέτρα (pinch cut).','Too low = the rim hits the rock (pinch cut).']],
 src:'Cooper AU (22–28) · 4X4 Australia (Mellor, 22 start) · 4 Wheel Parts (−35%) · Unsealed 4X4 (−40%) · OVR / DrivingLine (beadlock 5–8)'},
{k:'sharp',ic:'🔪',el:'Κοφτερή πέτρα / σάρα',en:'Sharp rock / scree',lo:.75,hi:.88,cap:15,
 d:['Μικρή πτώση μόνο. Εδώ το φουσκωμένο πλαϊνό κόβεται πιο εύκολα: κρατάς περισσότερο αέρα και πας πολύ αργά.','Small drop only. A bulging sidewall cuts more easily here: keep more air and go very slowly.'],
 t:[['Βήμα ανθρώπου. Διάλεξε γραμμή, πέλμα στο πάνω μέρος της πέτρας.','Walking pace. Pick a line, tread on top of the rock.'],['Έλεγχος πλαϊνών σε κάθε στάση: ο αισθητήρας TPMS ΔΕΝ βλέπει κόψιμο.','Check sidewalls at every stop: TPMS does NOT see a cut.']],
 src:'Cooper AU · Bridgestone AU · Expedition Portal (Brady)',ss:['Το «κοφτερή πέτρα μόνο −10 έως −15%» είναι από μία πηγή (νοτιοαφρικανικός οδηγός).','“Sharp rock only −10 to −15%” is single-source (South African guide).']},
{k:'beach',ic:'🏖️',el:'Σφιχτή / βρεγμένη άμμος',en:'Firm / wet sand',lo:.50,hi:.65,cap:35,soft:1,stuck:'sand',
 d:['15–25 psi. Τα πάρκα των ΗΠΑ ζητούν 15–25 (Cape Lookout 20–25, Assateague 15–20, Cape Hatteras <20).','15–25 psi. US parks ask for 15–25 (Cape Lookout 20–25, Assateague 15–20, Cape Hatteras <20).'],
 t:[['Φαρδιές, ομαλές στροφές. Η παλίρροια αλλάζει τα πάντα.','Wide, smooth turns. The tide changes everything.'],['Στην Ελλάδα ο αιγιαλός είναι απαγορευμένος για οχήματα (ν. 3937/2011).','In Greece the foreshore is off-limits to vehicles (Law 3937/2011).']],
 src:'NPS Cape Lookout / Assateague / Hatteras · Outer Banks · Bridgestone AU · 4X4 Australia'},
{k:'sand',ic:'🏜️',el:'Μαλακή άμμος / αμμόλοφοι',en:'Soft sand / dunes',lo:.45,hi:.55,cap:35,soft:1,stuck:'sand',bl:[10,15],
 d:['~50% της πίεσης δρόμου (ο καλύτερα τεκμηριωμένος κανόνας, ≥4 πηγές). Γραμμή Overland’s Habit: 16–18 psi, 20–35 km/h. Στον Κόλπο ~15 psi ≈ 1 bar.','~50% of road pressure (the best-documented rule, ≥4 sources). Overland’s Habit line: 16–18 psi, 20–35 km/h. In the Gulf ~15 psi ≈ 1 bar.'],
 t:[['Αν παλεύει αλλά δεν κόλλησες: σταμάτα σε σκληρό σημείο, κατέβα 2 psi, ξαναδοκίμασε, ως το κάτω όριο.','If it struggles but you are not stuck: stop on a firm spot, drop 2 psi, retry, down to the lower limit.'],['Ορμή και ομαλό γκάζι. Φαρδιές στροφές, ΠΟΤΕ απότομο τιμόνι (εκεί φεύγει το bead, συνήθως μπροστά).','Momentum and smooth throttle. Wide turns, NEVER sharp steering (that is where the bead goes, usually a front).'],['Αποτυχημένη ανάβαση αμμόλοφου: όπισθεν ΙΣΙΑ κάτω, όχι στροφή στην πλαγιά.','Failed dune climb: reverse STRAIGHT back down, never turn on the slope.'],['Σταματάς σε επίπεδο ή με τη μύτη στην κατηφόρα, χωρίς φρενάρισμα που σκάβει.','Stop on the flat or nose downhill, without braking that digs in.']],
 src:'Bridgestone AU (αρχή 18 psi, 20–35 km/h) · Unsealed 4X4 · WhichCar (Collard) · OVR · The National / Gulf News (UAE 15 psi) · Toyo AU'},
{k:'vsoft',ic:'🔥',el:'Πολύ μαλακή άμμος',en:'Very soft sand',lo:.40,hi:.45,cap:25,soft:1,stuck:'sand',bl:[8,12],
 d:['Γραμμή Overland’s Habit: ~15 psi, κάτω από ~25 km/h, χωρίς απότομα τιμόνια. Οι έμπειροι πάνε 12–15, αλλά η Toyo θεωρεί τα 12 ήδη πίεση έκτακτης ανάγκης.','Overland’s Habit line: ~15 psi, under ~25 km/h, no sharp steering. Experienced drivers go 12–15, but Toyo already calls 12 an emergency pressure.'],
 t:[['Κάτω από 15 χωρίς beadlock = ΜΟΝΟ για ξεκόλλημα. Πάτα «Κόλλησα».','Below 15 without beadlocks = ONLY to get unstuck. Tap “I’m stuck”.'],['Νωρίς το πρωί η άμμος είναι πιο σφιχτή (υγρασία).','Early morning sand is firmer (moisture).']],
 src:'Toyo AU (12 psi = έκτακτη, ≤25 km/h) · Bridgestone AU · Pitstop Arabia · Arrive Alive (SA)'},
{k:'snowp',ic:'❄️',el:'Χιόνι πατημένο',en:'Packed snow',lo:.85,hi:.95,cap:60,
 d:['Μικρή πτώση μόνο. Τα χειμερινά ελαστικά και οι αλυσίδες μετράνε πολύ περισσότερο από την πίεση.','Small drop only. Winter tyres and chains matter far more than pressure.'],
 t:[['Αλυσίδες στην Ελλάδα: έχε τις μαζί σε ορεινό δρόμο τον χειμώνα.','Chains: carry them on mountain roads in winter.']],
 src:'Tyre Reviews (J. Benson) μέσω Jalopnik / The Autopian',ss:['Μία δοκιμή, ένα χειμερινό ελαστικό επιβατικού (όχι 4x4).','One test, one passenger winter tyre (not 4x4).']},
{k:'snows',ic:'🌨️',el:'Λίγο / ρηχό χιόνι',en:'Shallow snow',lo:.90,hi:1,cap:50,
 d:['Σχεδόν πίεση δρόμου. Ο Στρατός ΗΠΑ (CRREL 1990) βρήκε ότι στο ρηχό χιόνι η χαμηλή πίεση ΑΝΕΒΑΖΕΙ την αντίσταση κύλισης σε κάθε δοκιμή, και η πρόσφυση άλλαξε ελάχιστα.','Almost road pressure. The US Army (CRREL 1990) found that in shallow snow lower pressure RAISED rolling resistance in every test, and traction barely changed.'],
 t:[['Το ξεφούσκωμα είναι εργαλείο επίπλευσης, όχι «μαγικό κράτημα».','Airing down is a flotation tool, not magic grip.']],
 src:'US Army CRREL Report 90-9 · CRREL SR 92-7'},
{k:'snowd',ic:'🏔️',el:'Βαθύ χιόνι',en:'Deep snow',lo:.42,hi:.50,cap:15,soft:1,stuck:'snow',bl:[6,10],big:[2,7],
 d:['Εδώ το ξεφούσκωμα κάνει θαύματα (επίπλευση). ~60 cm χιόνι: 12–15 psi σε κανονικό 4x4 (GearJunkie). Μονοψήφια μόνο σε γίγαντες 38–44" με συγκράτηση bead (Ισλανδία, Αρκτική: 2–5 psi).','Here airing down works wonders (flotation). ~60 cm snow: 12–15 psi on a normal 4x4 (GearJunkie). Single digits only on 38–44" giants with bead retention (Iceland, Arctic: 2–5 psi).'],
 t:[['Πολύ αργά, σταθερά. Ακολούθα τα δικά σου ίχνη πίσω αν χρειαστεί.','Very slow, steady. Follow your own tracks back if needed.'],['Κάτω από ~10 psi: μόνο με beadlock / συγκράτηση bead.','Below ~10 psi: only with beadlocks / bead retention.']],
 src:'GearJunkie (Evans) · Arctic Trucks · 4X4 Australia · carsales · CRREL 83-27'},
{k:'ice',ic:'🧊',el:'Πάγος',en:'Ice',lo:1,hi:1,cap:30,noair:1,
 d:['ΜΗΝ ξεφουσκώνεις. Ο Στρατός ΗΠΑ (CRREL 1983) βρήκε ότι στον πάγο η πρόσφυση ΠΕΦΤΕΙ όσο πέφτει η πίεση. Καρφιά και αλυσίδες κάνουν τη διαφορά.','DO NOT air down. The US Army (CRREL 1983) found that on ice traction DROPS as pressure drops. Studs and chains make the difference.'],
 t:[['Αλυσίδες ή χειμερινά/καρφωτά. Πολύ αργά, χωρίς απότομες κινήσεις.','Chains or winter/studded tyres. Very slow, no sudden inputs.']],
 src:'US Army CRREL Report 83-27',ss:['Το «μείνε κοντά στην πίεση δρόμου» είναι σύνθεση της έρευνας. Μία δοκιμή (Tyre Reviews) βρήκε μικρό κέρδος ως 20 psi, αλλά χειρότερα στα 10.','“Stay near road pressure” is the research’s synthesis. One test (Tyre Reviews) found a small gain down to 20 psi, but worse at 10.']}
];

/* ===== Καμπύλη ταχύτητας (Toyo AU), κλιμακωμένη στην πίεση δρόμου 36 psi του άρθρου: λόγος → km/h ===== */
const SPD=[[1,110],[.8,80],[.69,65],[.5,50],[.42,40],[.33,25],[.2,10]];

/* ===== Ξεκόλλημα: βήματα ανά είδος ===== */
const STUCK={
sand:[
 ['🛑','Σταμάτα το γκάζι ΑΜΕΣΩΣ μόλις νιώσεις ότι σκάβει. Κάθε σπινάρισμα σε θάβει πιο βαθιά.','Lift off IMMEDIATELY the moment you feel it digging. Every spin buries you deeper.'],
 ['↕️','Ίσιωσε τις ρόδες. Με τέρμα τιμόνι στη χαμηλή πίεση φεύγει το bead.','Straighten the wheels. Full lock at low pressure is how a bead comes off.'],
 ['🧯','Κατέβασε την πίεση και στα 4 ελαστικά στην πίεση ξεκολλήματος (πάνω). Όλα μαζί, όχι μόνο πίσω.','Drop all 4 tyres to the recovery pressure (above). All of them, not just the rear.'],
 ['⛏️','Φτυάρι: βγάλε την άμμο μπροστά από ΚΑΘΕ ρόδα (ράμπα) και κάτω από σασί/διαφορικά αν ακουμπάνε.','Shovel: clear the sand in front of EVERY wheel (a ramp) and under the chassis/diffs if they touch.'],
 ['⚙️','Low range, 1η (αυτόματο: L ή 1). Κλείδωμα διαφορικών αν έχεις.','Low range, 1st gear (automatic: L or 1). Lock the diffs if you have them.'],
 ['🪶','Γκάζι πολύ απαλά, ίσα ίσα, να κυλήσει χωρίς να σπινάρει.','Throttle very gently, just enough to roll without spinning.'],
 ['↔️','Αν δεν προχωρά: μικρές κινήσεις τιμονιού δεξιά–αριστερά για να βρουν οι ρόδες καινούργιο πάτημα. ΜΙΚΡΕΣ, όχι τέρμα.','If it won’t go: small steering movements left–right so the tyres find fresh grip. SMALL ones, not full lock.'],
 ['🔁','Δοκίμασε όπισθεν ΙΣΙΑ στα ίχνη σου (είναι ήδη πατημένα) και ξανά μπροστά, απαλά.','Try reversing STRAIGHT back in your own tracks (already packed) and forward again, gently.'],
 ['🟧','Αν δεν βγεις: πλάκες ανάκτησης (Maxtrax κ.λπ.) σφηνωμένες μπροστά από τις ρόδες που σκάβουν, ρόδες ίσιες, απαλό γκάζι. Δεν έχεις πλάκες; Ξανασκάψε και ξαναπροσπάθησε απαλά.','Still stuck: recovery boards (Maxtrax etc.) wedged in front of the digging wheels, wheels straight, gentle throttle. No boards? Dig again and retry gently.'],
 ['🪢','Τελευταίο: τράβηγμα από άλλο όχημα με ιμάντα/σχοινί ανάκτησης σε ΕΓΚΕΚΡΙΜΕΝΑ σημεία ρυμούλκησης, ή εργάτης. Κανείς κοντά στο σχοινί, damper πάνω του. (Δες το Winch Calculator του Overland’s Habit.)','Last: a pull from another vehicle with a recovery strap/rope on RATED recovery points, or a winch. Nobody near the line, a damper on it. (See the Overland’s Habit Winch Calculator.)'],
 ['⏱️','Μόλις βγεις σε σκληρό σημείο: ξαναφούσκωσε στην πίεση του εδάφους. Μην οδηγείς με πίεση ξεκολλήματος πάνω από βήμα ανθρώπου.','Once out on firm ground: re-inflate to the terrain pressure. Never drive on recovery pressure faster than walking pace.']],
mud:[
 ['🛑','Σταμάτα το σπινάρισμα. Στη λάσπη σκάβεις μέχρι το σασί σε δευτερόλεπτα.','Stop spinning. In mud you dig to the chassis in seconds.'],
 ['↔️','Στη λάσπη (ΟΧΙ στην άμμο) το τιμόνι δεξιά–αριστερά βοηθά τα πλαϊνά τακάκια να πιάσουν. Ομαλά.','In mud (NOT sand) steering left–right helps the shoulder blocks bite. Smoothly.'],
 ['🧯','Μικρή επιπλέον πτώση μόνο, όχι κάτω από την πίεση ξεκολλήματος. Τα αιχμηρά κρύβονται.','Only a small extra drop, never below the recovery pressure. Sharp things hide in mud.'],
 ['⛏️','Καθάρισε λάσπη από τις ρόδες και μπροστά τους. Κλαδιά/πέτρες κάτω από τις ρόδες ΜΟΝΟ αν επιτρέπεται.','Clear mud from and in front of the tyres. Branches/stones under the wheels ONLY where allowed.'],
 ['⚙️','Low range, 1η–2α, κλείδωμα διαφορικών, σταθερό απαλό γκάζι.','Low range, 1st–2nd, diff locks, steady gentle throttle.'],
 ['🔁','Μπρος–πίσω στα ίχνη σου, απαλά.','Rock forward–back in your tracks, gently.'],
 ['🟧','Πλάκες ανάκτησης κάτω από τις ρόδες που σκάβουν.','Recovery boards under the digging wheels.'],
 ['🪢','Τελευταίο: τράβηγμα ή εργάτης σε εγκεκριμένα σημεία, κανείς κοντά στο σχοινί.','Last: a pull or a winch on rated points, nobody near the line.'],
 ['⏱️','Βγήκες: ξαναφούσκωσε, καθάρισε τα bead, έλεγξε πλαϊνά.','Out: re-inflate, clean the beads, check the sidewalls.']],
snow:[
 ['🛑','Σταμάτα. Το σπινάρισμα λιώνει το χιόνι σε πάγο κάτω από τη ρόδα.','Stop. Wheelspin melts snow into ice under the tyre.'],
 ['↕️','Ρόδες ίσιες.','Wheels straight.'],
 ['🧯','Κατέβασε την πίεση στην πίεση ξεκολλήματος (με beadlock μπορείς χαμηλότερα).','Drop to the recovery pressure (lower with beadlocks).'],
 ['⛏️','Φτυάρι: χιόνι από μπροστά από τις ρόδες και κάτω από το σασί. Πάτησε το χιόνι μπροστά.','Shovel: snow from in front of the tyres and under the chassis. Pack the snow ahead.'],
 ['⚙️','Low range, 1η, απαλό γκάζι. Όπισθεν στα δικά σου ίχνη.','Low range, 1st, gentle throttle. Reverse in your own tracks.'],
 ['🟧','Πλάκες ανάκτησης / αλυσίδες.','Recovery boards / chains.'],
 ['🪢','Τελευταίο: τράβηγμα ή εργάτης.','Last: a pull or a winch.'],
 ['⏱️','Βγήκες: ξαναφούσκωσε όσο απαιτεί το έδαφος. Κρύο = η πίεση πέφτει κι άλλο το πρωί.','Out: re-inflate as the terrain needs. Cold = pressure drops further by morning.']]};

/* ===== Κομπρεσέρ: λεπτά για 4 ελαστικά, για αναφορά 255/85R16 από 15→35 psi (Overland Journal) ===== */
const COMP=[
 {k:'cheap',el:'Φτηνό μικρό κομπρεσέρ',en:'Cheap small compressor',min:20,max:30,n:['Θέλει διαλείμματα για να κρυώσει.','Needs breaks to cool down.']},
 {k:'good',el:'Καλό μονό (π.χ. ARB single)',en:'Good single (e.g. ARB single)',min:7,max:11,n:['Overland Journal: 7–11 λεπτά για 4 ελαστικά 15→35 psi.','Overland Journal: 7–11 min for 4 tyres 15→35 psi.']},
 {k:'twin',el:'Διπλό / μεγάλο (π.χ. ARB Twin)',en:'Twin / big (e.g. ARB Twin)',min:5,max:7,n:['Τραβάει έως ~50 A: μηχανή αναμμένη.','Draws up to ~50 A: keep the engine running.']},
 {k:'quad',el:'Γεμίζει και τα 4 μαζί',en:'Fills all 4 at once',min:4,max:5,n:['4X4 Australia: ~4 λεπτά 20→40 psi σε 285/60R18.','4X4 Australia: ~4 min 20→40 psi on 285/60R18.']},
 {k:'co2',el:'Φιάλη CO₂',en:'CO₂ bottle',min:2,max:4,n:['Ισχυρισμός κατασκευαστή. Παγώνει· δέσε τη φιάλη καλά.','Maker claim. It freezes; strap the bottle down.']}];
