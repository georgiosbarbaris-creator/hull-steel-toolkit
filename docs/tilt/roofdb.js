/* ===== Overland’s Habit · Tilt & Roof Calculator · όρια οροφής ανά οικογένεια οχημάτων (έρευνα Nov 2026) =====
   re = ταιριάζει με το όνομα στη λίστα του Crawl (case-insensitive) · πρώτο ταίριασμα κερδίζει, άρα τα ειδικά πάνω από τα γενικά
   dyn = δυναμικό όριο οροφής kg (εν κινήσει, άσφαλτος) · stat = στατικό kg (μόνο αν δίνεται από πηγή) · ss = πηγή στατικού
   v:1 = νούμερο με πηγή (κατασκευαστής οχήματος ή σχάρας / εγχειρίδιο όπως το παραθέτουν) · v:0 = εκτίμηση, ο χρήστης ελέγχει το εγχειρίδιο
   track/h/wb (mm), kerb/gvw (kg): χρησιμοποιούνται μόνο όταν το όχημα της λίστας δεν έχει δική του γεωμετρία · side = όριο πλευρικής κατασκευαστή (°)
   add:1 = προστίθεται ως νέο όχημα στη λίστα (δεν υπάρχει στο Crawl)
   ΠΡΟΣΘΗΚΗ: αντίγραψε μια γραμμή, άλλαξε re/n/νούμερα/src. */
const ROOFDB=[
/* ---------- Suzuki ---------- */
{n:'Suzuki Jimny JB64/JB74 (2018-)',re:'jimny (2017|2018|jb64|jb74|sierra)',dyn:30,v:1,src:'Suzuki, όπως το παραθέτουν bigjimny.com / outbackjoe.com',track:1395,h:1720,wb:2250,kerb:1090,gvw:1435},
{n:'Suzuki Jimny JB43 (1998-2018)',re:'jimny (1998|1999)|jb43',dyn:40,v:0,src:'εκτίμηση (30–50 kg), έλεγξε το εγχειρίδιο',track:1355,h:1705,wb:2250,kerb:1100,gvw:1420},
{n:'Suzuki Samurai / SJ',re:'samurai|sj ?4',dyn:40,v:0,src:'εκτίμηση',track:1305,h:1665,wb:2030,kerb:985,gvw:1330},
{n:'Suzuki Grand Vitara XL-7',re:'xl-7',dyn:75,v:0,src:'εκτίμηση',track:1540,h:1740,wb:2800,kerb:1650,gvw:2220},
{n:'Suzuki Grand Vitara (1998-2015)',re:'grand vitara',dyn:75,v:0,src:'εκτίμηση (50–75 kg)',track:1540,h:1695,wb:2640,kerb:1650,gvw:2240},
{n:'Suzuki Vitara (1988-1998)',re:'suzuki vitara (auto|manual)',dyn:50,v:0,src:'εκτίμηση',track:1395,h:1665,wb:2200,kerb:1100,gvw:1550},
{n:'Suzuki Vitara (2015-) ALLGRIP',re:'^suzuki vitara allgrip',dyn:50,v:0,src:'εκτίμηση',track:1535,h:1610,wb:2500,kerb:1250,gvw:1730,add:1},
{n:'Suzuki Jeta / Ignis',re:'jeta|ignis',dyn:50,v:0,src:'εκτίμηση',track:1380,h:1600,wb:2435,kerb:950,gvw:1330},
/* ---------- Toyota ---------- */
{n:'Toyota Land Cruiser 250 (2024-)',re:'land cruiser 250|prado 250',dyn:100,stat:250,ss:'Offroad Animal (κατασκευαστής σχάρας)',v:1,src:'Offroad Animal: 100 kg δρόμος / 75 kg εκτός δρόμου / 250 kg στατικό',track:1665,h:1925,wb:2850,kerb:2450,gvw:3000},
{n:'Toyota Land Cruiser 300 (2021-)',re:'land cruiser 300',dyn:150,stat:350,ss:'Offroad Animal (Rhino-Rack: 375 kg)',v:1,src:'Offroad Animal (κατασκευαστής σχάρας)',track:1665,h:1950,wb:2850,kerb:2550,gvw:3280},
{n:'Toyota Land Cruiser 200 (2008-2021)',re:'land cruiser 200',dyn:200,v:1,src:'Offroad Animal (κατασκευαστής σχάρας): 200 kg δρόμος / 133 kg εκτός δρόμου. Η Toyota γράφει λιγότερα: έλεγξε το εγχειρίδιο',track:1640,h:1905,wb:2850,kerb:2650,gvw:3350},
{n:'Toyota Land Cruiser 70 (76/78/79)',re:'land cruiser (7\\d|76)|hzj7|lc7',dyn:150,stat:350,ss:'Offroad Animal (LC79 dual cab)',v:1,src:'Offroad Animal: 150 kg δρόμος / 100 kg εκτός δρόμου / 350 kg στατικό',track:1555,h:1940,wb:2730,kerb:2300,gvw:3300},
{n:'Toyota Land Cruiser Prado 150 (2009-2023)',re:'prado 150',dyn:80,stat:250,ss:'Rhino-Rack fitting chart (Prado 150)',v:0,src:'εκτίμηση δυναμικού (ο πίνακας Rhino-Rack δείχνει 72–100 kg ανάλογα με το σύστημα)',track:1585,h:1880,wb:2790,kerb:2250,gvw:2990},
{n:'Toyota Land Cruiser 120 (2003-2009)',re:'land cruiser 120|prado 120',dyn:80,v:0,src:'εκτίμηση (75–100 kg), έλεγξε το εγχειρίδιο',track:1540,h:1880,wb:2790,kerb:2050,gvw:2850},
{n:'Toyota Land Cruiser Prado 90 (1996-2002)',re:'prado 90',dyn:75,v:0,src:'εκτίμηση',track:1505,h:1850,wb:2675,kerb:1900,gvw:2600},
{n:'Toyota Land Cruiser 100 (1998-2007)',re:'land cruiser 100',dyn:100,v:0,src:'εκτίμηση',track:1620,h:1880,wb:2850,kerb:2450,gvw:3260},
{n:'Toyota Land Cruiser 80 (1990-1998)',re:'land cruiser 80',dyn:100,v:0,src:'εκτίμηση',track:1595,h:1890,wb:2850,kerb:2250,gvw:2960},
{n:'Toyota Land Cruiser 60 (1980-1990)',re:'land cruiser 60',dyn:100,v:0,src:'εκτίμηση',track:1475,h:1810,wb:2730,kerb:2050,gvw:2750},
{n:'Toyota FJ Cruiser',re:'fj cruiser',dyn:120,stat:320,ss:'Offroad Animal (κατασκευαστής σχάρας)',v:1,src:'Offroad Animal (κατασκευαστής σχάρας)',track:1605,h:1830,wb:2690,kerb:2000,gvw:2550},
{n:'Toyota Hilux (2005-)',re:'hilux.*\\(2005-|hilux.*2016|hilux 2\\.8',dyn:75,v:1,src:'Toyota, όπως το παραθέτει το club4x4.com.au',track:1540,h:1815,wb:3085,kerb:2100,gvw:3210},
{n:'Toyota Hilux (1989-2005)',re:'hilux',dyn:75,v:0,src:'εκτίμηση',track:1440,h:1700,wb:3085,kerb:1700,gvw:2700},
{n:'Toyota 4Runner (2010-2024)',re:'4runner',dyn:75,v:1,src:'όπως το παραθέτει το offroadtents.com',track:1585,h:1815,wb:2790,kerb:2100,gvw:2720,add:1},
{n:'Toyota Tacoma (2016-2023)',re:'tacoma',dyn:75,v:0,src:'εκτίμηση',track:1600,h:1795,wb:3235,kerb:2000,gvw:2540,add:1},
{n:'Toyota RAV4 AWD (2019-)',re:'rav4',dyn:80,v:0,src:'εκτίμηση, έλεγξε το εγχειρίδιο',track:1610,h:1690,wb:2690,kerb:1650,gvw:2200,add:1},
{n:'Daihatsu Terios / Toyota Rush',re:'terios|rush',dyn:50,v:0,src:'εκτίμηση',track:1450,h:1700,wb:2580,kerb:1150,gvw:1700},
{n:'Daihatsu Rocky / Fourtrak',re:'rocky|fourtrak',dyn:75,v:0,src:'εκτίμηση',track:1430,h:1890,wb:2530,kerb:1700,gvw:2500},
{n:'Daihatsu Feroza',re:'feroza|sportrak',dyn:50,v:0,src:'εκτίμηση',track:1310,h:1720,wb:2175,kerb:1180,gvw:1650},
/* ---------- Nissan ---------- */
{n:'Nissan Patrol Y62 (2010-)',re:'patrol y62',dyn:100,v:1,src:'όπως το παραθέτει το club4x4.com.au',track:1695,h:1940,wb:3075,kerb:2750,gvw:3500,add:1},
{n:'Nissan Patrol Y61 / GR',re:'patrol.*y61',dyn:100,v:0,src:'εκτίμηση (σε φόρουμ γράφουν ως 200 kg, αναξιόπιστο)',track:1605,h:1855,wb:2970,kerb:2550,gvw:3200},
{n:'Nissan Patrol Y60',re:'patrol y60',dyn:100,v:0,src:'εκτίμηση',track:1555,h:1840,wb:2970,kerb:2300,gvw:3000},
{n:'Nissan Navara D23 / NP300 (2015-)',re:'navara d23',dyn:80,v:0,src:'εκτίμηση (75–80 kg)',track:1570,h:1840,wb:3150,kerb:2000,gvw:2910},
{n:'Nissan Navara D40 (2005-2015)',re:'navara d40',dyn:75,v:0,src:'εκτίμηση',track:1570,h:1780,wb:3200,kerb:2050,gvw:2900},
{n:'Nissan Navara D21 / D22',re:'navara.*d2[12]',dyn:75,v:0,src:'εκτίμηση',track:1445,h:1690,wb:2950,kerb:1650,gvw:2650},
{n:'Nissan Terrano II',re:'terrano',dyn:75,v:0,src:'εκτίμηση',track:1455,h:1800,wb:2650,kerb:1750,gvw:2400},
{n:'Nissan X-Trail 4x4 (2014-)',re:'x-trail',dyn:75,v:0,src:'εκτίμηση',track:1575,h:1710,wb:2705,kerb:1600,gvw:2200,add:1},
/* ---------- Mitsubishi ---------- */
{n:'Mitsubishi Pajero Sport (2016-)',re:'pajero sport',dyn:70,v:0,src:'εκτίμηση',track:1520,h:1835,wb:2800,kerb:2050,gvw:2710},
{n:'Mitsubishi Pajero Pinin',re:'pinin',dyn:50,v:0,src:'εκτίμηση',track:1405,h:1700,wb:2280,kerb:1300,gvw:1800},
{n:'Mitsubishi Pajero V60/V70/V80',re:'pajero (v[678]0|3\\.[28]|.*2007)',dyn:75,v:1,src:'όπως το παραθέτει η Rhino-Rack (exploroz.com)· 100 kg με track kit',track:1570,h:1900,wb:2780,kerb:2250,gvw:3030},
{n:'Mitsubishi Pajero V20 (1991-2000)',re:'pajero',dyn:75,v:0,src:'εκτίμηση',track:1480,h:1880,wb:2725,kerb:2000,gvw:2700},
{n:'Mitsubishi L200 / Triton',re:'l200|triton',dyn:60,v:1,src:'όπως το παραθέτει περιοδικό (exploroz.com)',track:1520,h:1780,wb:3000,kerb:2000,gvw:2900},
{n:'Mitsubishi Outlander 4WD',re:'outlander',dyn:80,v:0,src:'εκτίμηση',track:1540,h:1710,wb:2670,kerb:1650,gvw:2300,add:1},
/* ---------- Land Rover ---------- */
{n:'Land Rover Defender 110 (L663, 2020-)',re:'defender 110 (p300|d250|.*mhev)|defender.*(2021|2023)',dyn:168,stat:300,ss:'Offroad Animal / Land Rover (300 kg στατικό)',v:1,src:'Land Rover / Offroad Animal: 168 kg δυναμικό',side:30,track:1704,h:1967,wb:3022,kerb:2350,gvw:3150},
{n:'Land Rover Defender 90 (L663, 2020-)',re:'defender 90 l663',dyn:168,stat:300,ss:'Land Rover / Offroad Animal',v:1,src:'Land Rover: 168 kg δυναμικό',side:30,track:1704,h:1969,wb:2587,kerb:2200,gvw:2840,add:1},
{n:'Land Rover Defender 90/110 (classic, 1983-2016)',re:'land-rover (defender|110|90)',dyn:150,v:0,src:'εκτίμηση (100–150 kg)· Land Rover: όχι πάνω από 30° πλάγια, κατέβασε το φορτίο οροφής πριν από πλαγιά',side:30,track:1486,h:2035,wb:2794,kerb:2100,gvw:3050},
{n:'Land Rover Discovery 5 (2017-)',re:'discovery 5',dyn:80,v:1,src:'όπως το παραθέτει το club4x4.com.au',side:30,track:1690,h:1888,wb:2923,kerb:2300,gvw:3130},
{n:'Land Rover Discovery 3/4 (2004-2016)',re:'discovery [34]',dyn:75,v:1,src:'εγχειρίδιο, όπως το παραθέτει το aulro.com',side:30,track:1605,h:1890,wb:2885,kerb:2580,gvw:3240,add:1},
{n:'Land Rover Discovery 1/2 (1989-2004)',re:'discovery',dyn:75,v:0,src:'εκτίμηση',side:30,track:1490,h:1920,wb:2540,kerb:1950,gvw:2720},
/* ---------- Jeep ---------- */
{n:'Jeep Wrangler / Gladiator',re:'wrangler|gladiator',dyn:68,v:0,src:'≈68 kg για JL (όπως το παραθέτουν offroadtents.com/φόρουμ)· η Jeep δεν θέλει φορτίο πάνω στο hardtop: σχάρα στο αμάξωμα',track:1580,h:1840,wb:3010,kerb:2050,gvw:2700},
{n:'Jeep Grand Cherokee',re:'grand cherokee',dyn:68,v:0,src:'εκτίμηση (150 lb)',track:1620,h:1790,wb:2915,kerb:2150,gvw:2850},
{n:'Jeep Cherokee',re:'cherokee',dyn:68,v:0,src:'εκτίμηση (150 lb)',track:1525,h:1760,wb:2650,kerb:1850,gvw:2540},
{n:'Jeep Renegade',re:'renegade',dyn:70,v:0,src:'εκτίμηση',track:1545,h:1690,wb:2570,kerb:1500,gvw:2000},
{n:'Ford Bronco (2021-)',re:'bronco',dyn:68,v:0,src:'εκτίμηση',track:1690,h:1850,wb:2950,kerb:2150,gvw:2900,add:1},
/* ---------- Ford / Mazda / VW ---------- */
{n:'Ford Ranger / Raptor / VW Amarok (2022-)',re:'ranger.*(2\\.0 ecoblue|3\\.0 v6|raptor 3)|amarok.*2023',dyn:85,stat:350,ss:'Ford (επίσημο δελτίο τύπου)',v:1,src:'Ford: 85 kg δυναμικό / 350 kg στατικό· το νέο Amarok είναι ίδια πλατφόρμα',track:1620,h:1885,wb:3270,kerb:2250,gvw:3200},
{n:'Ford Ranger PX (2012-2022)',re:'ranger px',dyn:80,stat:300,ss:'όπως το παραθέτει το bushbuck.co.nz',v:1,src:'όπως το παραθέτει το 4x4australia.com.au',track:1560,h:1815,wb:3220,kerb:2100,gvw:3200},
{n:'Ford Ranger / Mazda BT-50 (1999-2011)',re:'ranger|bt-50|b2500',dyn:75,v:0,src:'εκτίμηση',track:1445,h:1760,wb:3000,kerb:1850,gvw:2800},
{n:'VW Amarok (2010-2022)',re:'amarok',dyn:100,v:1,src:'όπως το παραθέτει το club4x4.com.au',track:1648,h:1834,wb:3095,kerb:2100,gvw:3080},
{n:'Ford F-150 Raptor',re:'f-150',dyn:75,v:0,src:'εκτίμηση',track:1745,h:1990,wb:3370,kerb:2650,gvw:3300},
{n:'VW Touareg',re:'touareg',dyn:100,v:0,src:'εκτίμηση',track:1650,h:1730,wb:2900,kerb:2100,gvw:2850,add:1},
/* ---------- Isuzu / Opel / Korea ---------- */
{n:'Isuzu D-Max',re:'d-max',dyn:75,v:0,src:'εκτίμηση (75–80 kg)',track:1570,h:1790,wb:3125,kerb:2000,gvw:3100},
{n:'Isuzu Trooper',re:'trooper',dyn:100,v:0,src:'εκτίμηση',track:1515,h:1840,wb:2760,kerb:1950,gvw:2650},
{n:'Opel Frontera',re:'frontera',dyn:75,v:0,src:'εκτίμηση',track:1460,h:1740,wb:2700,kerb:1800,gvw:2500},
{n:'KGM / SsangYong Rexton & Musso (2018-)',re:'(rexton|musso grand)',dyn:75,v:0,src:'εκτίμηση',track:1620,h:1835,wb:2865,kerb:2100,gvw:2850},
{n:'SsangYong Musso / Korando (1993-2006)',re:'musso|korando',dyn:75,v:0,src:'εκτίμηση',track:1510,h:1735,wb:2630,kerb:1950,gvw:2550},
{n:'Hyundai Galloper / Terracan',re:'galloper|terracan',dyn:75,v:0,src:'εκτίμηση',track:1500,h:1790,wb:2750,kerb:1950,gvw:2600},
{n:'Kia Sportage / Sorento',re:'sportage|sorento',dyn:75,v:0,src:'εκτίμηση',track:1525,h:1730,wb:2650,kerb:1800,gvw:2450},
/* ---------- Mercedes / άλλα ---------- */
{n:'Mercedes-Benz G-Class W463',re:'mercedes-benz g |g 270|g 450',dyn:150,v:1,src:'Mercedes (εγχειρίδιο 463): 150 kg με ≥3 ζεύγη ποδιών, 50 kg ανά ζεύγος· παρκαρισμένο επιτρέπεται περισσότερο (σκηνή)',track:1638,h:1970,wb:2890,kerb:2500,gvw:3200},
{n:'Mercedes-Benz ML / GLE',re:'\\bml \\d|gle',dyn:100,v:0,src:'εκτίμηση',track:1630,h:1800,wb:2915,kerb:2150,gvw:2850},
{n:'Ineos Grenadier',re:'grenadier',dyn:150,stat:420,ss:'Ineos (όπως το παρουσιάζει)',v:0,src:'Ineos 150 kg δυναμικό / 420 kg στατικό (από παρουσίαση, έλεγξε το εγχειρίδιο)',track:1645,h:2036,wb:2922,kerb:2650,gvw:3500},
{n:'Dacia Duster / Bigster',re:'duster|bigster',dyn:80,v:1,src:'Dacia, εγχειρίδιο: 80 kg ΜΑΖΙ με τη σχάρα',track:1560,h:1690,wb:2675,kerb:1400,gvw:1900},
{n:'Lada Niva',re:'niva',dyn:50,v:0,src:'εκτίμηση',track:1430,h:1640,wb:2200,kerb:1210,gvw:1610},
{n:'Fiat Panda 4x4',re:'panda',dyn:50,v:0,src:'εκτίμηση',track:1360,h:1600,wb:2300,kerb:1100,gvw:1500},
{n:'Lexus GX',re:'lexus gx',dyn:75,v:0,src:'εκτίμηση',track:1585,h:1880,wb:2790,kerb:2250,gvw:2900},
{n:'Hummer H3',re:'hummer h3',dyn:70,v:0,src:'εκτίμηση',track:1690,h:1890,wb:2840,kerb:2100,gvw:2700},
{n:'Hummer H1',re:'hummer h1',dyn:100,v:0,src:'εκτίμηση',track:1820,h:1950,wb:3300,kerb:3500,gvw:4670},
{n:'Subaru Outback / Forester Wilderness',re:'wilderness',dyn:100,stat:318,ss:'Subaru (Wilderness: 700 lb στατικό)',v:0,src:'Subaru Wilderness: 220 lb δυναμικό (έλεγξε το εγχειρίδιο του δικού σου)',track:1570,h:1740,wb:2745,kerb:1750,gvw:2300,add:1},
{n:'Subaru Forester',re:'^subaru forester$',dyn:80,v:0,src:'εκτίμηση',track:1565,h:1730,wb:2670,kerb:1600,gvw:2100,add:1}
];
