/* ===== Overland’s Habit · Tilt & Roof Calculator · οδηγός & λίστες ελέγχου (Created by George Barbaris) ===== */
const CHK={
roof:[['Διάβασα το όριο οροφής στο εγχειρίδιο του αυτοκινήτου (δυναμικό) και το έγραψα στο βήμα 2.','I read the roof limit in the vehicle manual (dynamic) and entered it in step 2.'],
 ['Ξέρω το όριο της σχάρας/μπαρών και της σκηνής: ισχύει το μικρότερο.','I know the rack/bars and tent limits: the lowest applies.'],
 ['Η σχάρα μετράει στο βάρος: τη ζύγισα ή βρήκα το βάρος της.','The rack counts in the weight: I weighed it or found its weight.'],
 ['Βίδες σχάρας και σκηνής σφιγμένες με τη σωστή ροπή (σημάδι με μαρκαδόρο για να βλέπω αν ξεβιδώνουν).','Rack and tent bolts torqued correctly (paint-pen mark so I can see if they loosen).'],
 ['Βαριά πράγματα (νερό, καύσιμα, εργαλεία) ΜΕΣΑ και χαμηλά, όχι στην οροφή.','Heavy things (water, fuel, tools) INSIDE and low, not on the roof.'],
 ['Ό,τι είναι πάνω είναι δεμένο με ιμάντες καστάνιας, όχι λάστιχα.','Everything up top is tied with ratchet straps, not bungees.'],
 ['Το βάρος στην οροφή είναι στη μέση, όχι όλο στη μία πλευρά ή μπροστά.','The roof weight is centred, not all on one side or at the front.'],
 ['Ξέρω το νέο ύψος του αυτοκινήτου (γέφυρες, πάρκινγκ, κλαδιά).','I know the new vehicle height (bridges, car parks, branches).'],
 ['Σε χωματόδρομο ελέγχω τις βίδες κάθε πρωί.','On dirt roads I check the bolts every morning.']],
camp:[['Παρκάρω όσο πιο επίπεδα γίνεται (κάτω από 3–5°). Χρησιμοποιώ το κλισιόμετρο.','I park as level as possible (under 3–5°). I use the inclinometer.'],
 ['Χειρόφρενο, ταχύτητα (ή P), και τάκοι αν υπάρχει κλίση.','Handbrake, in gear (or P), and chocks if there is a slope.'],
 ['Η σκάλα πατάει σε σταθερό έδαφος, με το σωστό κλίμα (συνήθως 70–75°).','The ladder stands on firm ground, at the right angle (usually 70–75°).'],
 ['Άτομα στη σκηνή μέσα στο στατικό όριο (βήμα 5).','People in the tent within the static limit (step 5).'],
 ['Κανείς δεν πηδάει μέσα στη σκηνή· μπαίνουμε ήρεμα.','No jumping in the tent; we climb in calmly.'],
 ['Με δυνατό αέρα: η μύτη του αυτοκινήτου προς τον αέρα, τέντα μαζεμένη.','In strong wind: nose into the wind, awning packed away.'],
 ['Πριν φύγουμε: σκηνή κλειστή και κλειδωμένη, κανείς και τίποτα βαρύ πάνω.','Before we leave: tent closed and locked, nobody and nothing heavy up there.']],
slope:[['Περπάτησα πρώτα την πλαγιά: πέτρες, λακκούβες, μαλακό χώμα;','I walked the slope first: rocks, holes, soft ground?'],
 ['Σιγά, σε low range, χωρίς απότομο τιμόνι ή φρένο.','Slowly, in low range, no sudden steering or braking.'],
 ['Ο πάνω τροχός ΔΕΝ ανεβαίνει σε πέτρα· ο κάτω ΔΕΝ πέφτει σε λακκούβα.','The upper wheel does NOT climb a rock; the lower one does NOT drop into a hole.'],
 ['Οι επιβάτες κάθονται από την πάνω πλευρά ή βγαίνουν από το αυτοκίνητο.','Passengers sit on the uphill side or get out.'],
 ['Αν γέρνει πολύ: τιμόνι προς την κατηφόρα και λίγο γκάζι. ΠΟΤΕ προς τα πάνω.','If it leans too much: steer downhill with a little throttle. NEVER uphill.'],
 ['Με φορτίο στην οροφή: σκέψου να το κατεβάσεις πριν την πλαγιά (σύσταση Land Rover).','With a roof load: think about taking it down before the slope (Land Rover advice).']]};
const GUIDE={el:[
['sd','⚖️','Δυναμικό και στατικό φορτίο: τι σημαίνουν;',`<div class="s10"><b>Σ10:</b> <b>Δυναμικό</b> = όσο κουβαλάει η οροφή <b>όταν το αυτοκίνητο τρέχει</b>. Κάθε λακκούβα κάνει τα πράγματα «να πηδάνε» και να χτυπάνε 2–3 φορές πιο βαριά. <b>Στατικό</b> = όσο κρατάει η οροφή <b>όταν είναι ακίνητη</b>, π.χ. όταν κοιμάστε στη σκηνή. Είναι πολύ περισσότερο, γιατί δεν υπάρχουν χτυπήματα.</div>
<h4>Πού τα βρίσκω</h4><ul><li><b>Δυναμικό</b>: στο εγχειρίδιο του αυτοκινήτου («μέγιστο φορτίο οροφής», συνήθως 30–100 kg, μερικά 150–200 kg). Αν δεν γράφει, πάρε το νούμερο της σχάρας ή ρώτα την αντιπροσωπεία.</li>
<li><b>Στατικό</b>: λίγοι κατασκευαστές αυτοκινήτων το δίνουν (Ford Ranger 2022+: 350 kg, Defender L663: 300 kg). Οι κατασκευαστές σχαρών το δίνουν πιο συχνά. Αλλιώς η εφαρμογή βάζει <b>3 × δυναμικό</b> (κανόνας Yakima). Μερικοί λένε 5×, αλλά τα πραγματικά νούμερα κατασκευαστών βγαίνουν 2–4×, οπότε το 3× είναι το πιο ασφαλές.</li>
<li><b>Εκτός δρόμου</b>: οι κατασκευαστές σχαρών μειώνουν το όριο κατά 25–50% (συνήθως −33%). Γι’ αυτό η εφαρμογή δείχνει και «όριο σε χώμα».</li></ul>
<h4>Ισχύει πάντα το μικρότερο</h4><p>Αυτοκίνητο, σχάρα, πόδια, σκηνή: <b>το πιο αδύναμο κρίκο</b> της αλυσίδας. Η σχάρα και η σκηνή <b>μετράνε μέσα</b> στο όριο (π.χ. Dacia Duster: 80 kg μαζί με τη σχάρα).</p>`],
['load','🎒','Πώς φορτώνω σωστά',`<div class="s10"><b>Σ10:</b> Βαριά κάτω, ελαφριά πάνω. Σαν σακίδιο: τα βαριά κοντά στην πλάτη και χαμηλά.</div>
<ul><li><b>100 kg στα 2 m ύψος</b> επηρεάζουν την ευστάθεια σαν <b>200 kg στο 1 m</b> (club4x4).</li>
<li>Στην οροφή: ελαφριά και ογκώδη (καρέκλες, τραπέζι, σκηνή, ξύλα, άδεια δοχεία).</li>
<li>Μέσα, χαμηλά, ανάμεσα στους άξονες: νερό, καύσιμα, ψυγείο, εργαλεία, ανταλλακτικά.</li>
<li>Μπιτόνια καυσίμου στην οροφή: <b>όχι</b> αν γίνεται. 4 μπιτόνια = 84 kg ψηλά.</li>
<li>Κράτα το βάρος στο κέντρο της σχάρας, ανάμεσα στα πόδια.</li>
<li>Πρόσεξε και το <b>μικτό βάρος (GVW)</b>: η εφαρμογή το ελέγχει στο βήμα 4.</li></ul>CHK:roof`],
['tip','📐','Γιατί χάνω μοίρες κλίσης',`<div class="s10"><b>Σ10:</b> Φαντάσου μια τελεία μέσα στο αυτοκίνητο: το <b>κέντρο βάρους</b>. Όταν γέρνεις, αν αυτή η τελεία βγει έξω από τον κάτω τροχό, το αυτοκίνητο πέφτει. Όσο πιο ψηλά είναι η τελεία, τόσο πιο γρήγορα βγαίνει έξω. Το βάρος στην οροφή ανεβάζει την τελεία.</div>
<h4>Τα νούμερα</h4><ul><li>Γωνία ανατροπής = atan(μετατρόχιο ÷ 2 ÷ ύψος κέντρου βάρους).</li>
<li>Τα αληθινά αυτοκίνητα «κάθονται» στην ανάρτηση και στα λάστιχα, οπότε γέρνουν περίπου <b>15% νωρίτερα</b> (TRB/NAS). Η εφαρμογή το μετράει (0,85).</li>
<li>Κρατάμε <b>περιθώριο 15°</b>, γιατί μια πέτρα ή λακκούβα προσθέτει 5–10° σε μια στιγμή.</li>
<li>Land Rover: όχι συνεχώς πάνω από <b>30° πλάγια</b> και 35° μπρος–πίσω.</li>
<li>Πρακτικά: στις 20° οι αρχάριοι αγχώνονται, στις 25° προσέχεις πολύ, πάνω από 30° μπορεί να αρχίσει να γλιστράει πλάγια (Overland Journal).</li></ul>
<h4>Δείκτης SSF</h4><p>SSF = μετατρόχιο ÷ (2 × ύψος ΚΒ). Λέει πόσα «g» πλάγια χρειάζονται για ανατροπή. Τα SUV/pickup έχουν περίπου 1,05–1,25. Η LVVTA (Νέα Ζηλανδία) ζητάει τουλάχιστον 1,1.</p>CHK:slope`],
['camp','⛺','Σκηνή οροφής: το βράδυ',`<div class="s10"><b>Σ10:</b> Όταν το αυτοκίνητο είναι ακίνητο, η οροφή κρατάει πολύ περισσότερο. Αλλά μόνο αν είναι ίσιο, φρεναρισμένο και δεν πηδάτε.</div>
<ul><li>Υπολογίζουμε ~80 kg ανά ενήλικα + υπνόσακοι.</li>
<li>Στις σκηνές που ανοίγουν «βιβλίο» (fold-out) η σκάλα σηκώνει περίπου το 1/3 του βάρους· στις pop-up όχι.</li>
<li>Γέρνει το αυτοκίνητο; Βάλε πέτρες/τάκους κάτω από τις ρόδες και ξαναμέτρα με το κλισιόμετρο.</li></ul>CHK:camp`],
['incl','📱','Κλισιόμετρο: βάση και μηδενισμός',`<div class="s10"><b>Σ10:</b> Το κινητό καταλαβαίνει πού είναι το «κάτω». Αν το βάλεις στραβά στη βάση, θα δείχνει στραβά. Γι’ αυτό το μηδενίζεις πάνω σε ίσιο έδαφος.</div>
<ol><li>Βάλε το κινητό <b>σταθερά</b> στη βάση (όρθιο ή ξαπλωμένο). Να μην κουνιέται.</li>
<li>Πάτα <b>«Ξεκίνα»</b> και δώσε άδεια στους αισθητήρες (iPhone: «Επιτρέπεται»).</li>
<li><b>Μηδενισμός</b>: σε ίσιο σημείο πάτα «Μηδένισε».</li>
<li><b>Καλύτερος μηδενισμός (2 φορών)</b>: πάτα «Μηδενισμός 2 φορών», γύρνα το αυτοκίνητο ανάποδα (180°) στο ίδιο σημείο και ξαναπάτα. Ο μέσος όρος σβήνει και την κλίση του εδάφους και το στραβό της βάσης.</li>
<li>Δοκίμασε: γείρε το κινητό δεξιά. Αν το αυτοκινητάκι γέρνει αριστερά, πάτα «Αντιστροφή».</li></ol>
<ul><li>Ακρίβεια μετά τον μηδενισμό περίπου <b>±0,5–1°</b>. Στα χτυπήματα πηδάει, γι’ αυτό η ένδειξη είναι εξομαλυμένη και κρατάει τα μέγιστα.</li>
<li>Ο συναγερμός παίρνει όρια από το <b>δικό σου φόρτωμα</b> (ή «Χωρίς οροφή»).</li>
<li>Ο οδηγός δεν πειράζει το κινητό. Τον χειρίζεται ο συνοδηγός.</li></ul>`],
['src','📚','Πηγές και τύποι',`<ul><li>NHTSA / TRB-NAS: SSF = T ÷ 2h, ανάρτηση ≈ −15%.</li>
<li>Νέο ΚΒ = (M·h + m·h_οροφής) ÷ (M + m).</li>
<li>Yakima: στατικό ≈ 3 × δυναμικό, εκτός δρόμου −33% (συνήθως).</li>
<li>TentBox (5×), Off Road Tents (3–5×): άλλοι κανόνες· η εφαρμογή κρατάει το πιο συντηρητικό.</li>
<li>Ford (Ranger 2022+: 85/350 kg), Dacia (Duster 80 kg με σχάρα), Mercedes (G: 150 kg), Offroad Animal, Rhino-Rack, club4x4.com.au, Overland Journal, Land Rover handbook, LVVTA.</li>
<li>Τα όρια με ✅ έχουν πηγή. Με ⚠️ είναι εκτίμηση: γράψε το δικό σου από το εγχειρίδιο.</li></ul>`]],
en:[
['sd','⚖️','Dynamic and static load: what do they mean?',`<div class="s10"><b>Like you are 10:</b> <b>Dynamic</b> = what the roof carries <b>while the car is moving</b>. Every bump makes things “jump” and hit 2–3 times heavier. <b>Static</b> = what the roof holds <b>when standing still</b>, e.g. when you sleep in the tent. It is much more, because there are no hits.</div>
<h4>Where do I find them</h4><ul><li><b>Dynamic</b>: in the vehicle manual (“maximum roof load”, usually 30–100 kg, some 150–200 kg). If it is not there, use the rack figure or ask the dealer.</li>
<li><b>Static</b>: few car makers give it (Ford Ranger 2022+: 350 kg, Defender L663: 300 kg). Rack makers give it more often. Otherwise the app uses <b>3 × dynamic</b> (Yakima rule). Some say 5×, but real maker figures work out at 2–4×, so 3× is the safer choice.</li>
<li><b>Off-road</b>: rack makers cut the limit by 25–50% (usually −33%). That is why the app also shows an “off-road limit”.</li></ul>
<h4>The lowest always applies</h4><p>Vehicle, rack, feet, tent: <b>the weakest link</b> of the chain. The rack and tent <b>count inside</b> the limit (e.g. Dacia Duster: 80 kg including the rack).</p>`],
['load','🎒','How to load correctly',`<div class="s10"><b>Like you are 10:</b> Heavy low, light high. Like a backpack: heavy things close to your back and low.</div>
<ul><li><b>100 kg at 2 m</b> affects stability like <b>200 kg at 1 m</b> (club4x4).</li>
<li>On the roof: light and bulky (chairs, table, tent, firewood, empty cans).</li>
<li>Inside, low, between the axles: water, fuel, fridge, tools, spares.</li>
<li>Fuel jerrycans on the roof: <b>no</b> if possible. 4 cans = 84 kg up high.</li>
<li>Keep the weight in the middle of the rack, between the feet.</li>
<li>Also watch the <b>gross weight (GVW)</b>: the app checks it in step 4.</li></ul>CHK:roof`],
['tip','📐','Why I lose degrees of slope',`<div class="s10"><b>Like you are 10:</b> Imagine a dot inside the car: the <b>centre of gravity</b>. When you lean, if that dot goes outside the lower wheel, the car falls. The higher the dot, the sooner it goes outside. Weight on the roof lifts the dot.</div>
<h4>The numbers</h4><ul><li>Tip-over angle = atan(track ÷ 2 ÷ CG height).</li>
<li>Real cars “squat” on their suspension and tyres, so they tip about <b>15% earlier</b> (TRB/NAS). The app accounts for it (0.85).</li>
<li>We keep a <b>15° margin</b>, because a rock or hole adds 5–10° in an instant.</li>
<li>Land Rover: not continuously above <b>30° sideways</b> and 35° front–back.</li>
<li>In practice: at 20° beginners get nervous, at 25° you watch closely, above 30° it may start to slide sideways (Overland Journal).</li></ul>
<h4>SSF</h4><p>SSF = track ÷ (2 × CG height). It tells how many sideways “g” it takes to roll. SUVs/pickups are about 1.05–1.25. LVVTA (New Zealand) requires at least 1.1.</p>CHK:slope`],
['camp','⛺','Rooftop tent: at night',`<div class="s10"><b>Like you are 10:</b> When the car stands still the roof holds much more. But only if it is level, braked and nobody jumps.</div>
<ul><li>We count ~80 kg per adult + sleeping bags.</li>
<li>On fold-out tents the ladder carries about 1/3 of the weight; on pop-ups it does not.</li>
<li>Is the car leaning? Put stones/levelling blocks under the wheels and measure again with the inclinometer.</li></ul>CHK:camp`],
['incl','📱','Inclinometer: mount and zeroing',`<div class="s10"><b>Like you are 10:</b> The phone knows where “down” is. If it sits crooked in the mount, it shows crooked. That is why you zero it on level ground.</div>
<ol><li>Fix the phone <b>firmly</b> in its mount (upright or flat). It must not wobble.</li>
<li>Tap <b>“Start”</b> and allow the sensors (iPhone: “Allow”).</li>
<li><b>Zero</b>: on a level spot tap “Zero”.</li>
<li><b>Better zero (2-way)</b>: tap “2-way zero”, turn the car around (180°) on the same spot and tap again. The average cancels both the ground slope and the crooked mount.</li>
<li>Test: tilt the phone right. If the little car leans left, tap “Flip”.</li></ol>
<ul><li>Accuracy after zeroing about <b>±0.5–1°</b>. It jumps on bumps, so the reading is smoothed and keeps the peaks.</li>
<li>The alarm takes its limits from <b>your own load</b> (or “Without roof load”).</li>
<li>The driver does not touch the phone. The passenger handles it.</li></ul>`],
['src','📚','Sources and formulas',`<ul><li>NHTSA / TRB-NAS: SSF = T ÷ 2h, suspension ≈ −15%.</li>
<li>New CG = (M·h + m·h_roof) ÷ (M + m).</li>
<li>Yakima: static ≈ 3 × dynamic, off-road −33% (typical).</li>
<li>TentBox (5×), Off Road Tents (3–5×): other rules; the app keeps the most conservative.</li>
<li>Ford (Ranger 2022+: 85/350 kg), Dacia (Duster 80 kg incl. rack), Mercedes (G: 150 kg), Offroad Animal, Rhino-Rack, club4x4.com.au, Overland Journal, Land Rover handbook, LVVTA.</li>
<li>Limits marked ✅ have a source. ⚠️ means estimate: enter your own from the manual.</li></ul>`]]};
