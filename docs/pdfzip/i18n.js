// EL -> EN translation layer for PDF Tools (Greek is the source language).
// Exact matches first; then phrase-level replacement for dynamic text (counters, sizes, …).
const EXACT = {
"Συμπίεση · μετατροπές · resize φωτό — offline, τίποτα δεν ανεβαίνει πουθενά":"Compress · convert · edit · resize photos — offline, nothing is uploaded",
"Συμπίεση · μετατροπές · επεξεργασία · resize φωτό — offline, τίποτα δεν ανεβαίνει πουθενά":"Compress · convert · edit · resize photos — offline, nothing is uploaded",
"✏️ Επεξεργασία PDF":"✏️ Edit PDF","🗜 Συμπίεση PDF":"🗜 Compress PDF","🖼→📄 Φωτό σε PDF":"🖼→📄 Photos to PDF","📄→🖼 PDF σε φωτό":"📄→🖼 PDF to photos",
"📝 Word/Excel→PDF":"📝 Word/Excel→PDF","📐 Resize φωτό":"📐 Resize photos",
"✏️ Άνοιξε PDF ή φωτογραφία για επεξεργασία":"✏️ Open a PDF or photo to edit","και σκαναρισμένα / PDF από φωτογραφίες":"scanned PDFs / PDFs made of photos too",
"Εργαλεία":"Tools","Επιλογή":"Select","Διόρθωση κειμένου":"Edit text","Κείμενο":"Text","Σβήστρα":"Eraser","Κόψε & μετακίνησε":"Cut & move",
"— μετακίνηση, αλλαγή μεγέθους (λαβή κάτω δεξιά), ξαναπάτημα σε κείμενο = διόρθωση":"— move, resize (handle bottom-right), tap text again = edit",
"— πατάς πάνω σε λέξη/γραμμή του PDF: σβήνεται και τη γράφεις από την αρχή":"— tap a word/line of the PDF: it is erased and you retype it",
"— γράφεις οπουδήποτε (ελληνικά/αγγλικά, Sans/Bold/Serif)":"— type anywhere (Greek/English, Sans/Bold/Serif)",
"— καλύπτει με το ίδιο χρώμα του φόντου (ιδανικό για σκαναρισμένα)":"— covers with the page's own background colour (ideal for scans)",
"— κόβεις λέξεις/σφραγίδα/περιοχή και τη βάζεις αλλού":"— cut words/a stamp/an area and place it elsewhere",
"🖍 Μαρκαδόρος · ✏ Στυλό/υπογραφή · ▭ Πλαίσιο · 🖼 Εικόνα/σφραγίδα · ⛶ Crop σελίδας":"🖍 Highlighter · ✏ Pen/signature · ▭ Box · 🖼 Image/stamp · ⛶ Crop page",
"📄 Σελίδες: περιστροφή ↻, διαγραφή, μετακίνηση ◀ ▶ · ↶ Undo / ↷ Redo · ⧉ αντίγραφο · 📑 σε όλες τις σελίδες":"📄 Pages: rotate ↻, delete, move ◀ ▶ · ↶ Undo / ↷ Redo · ⧉ duplicate · 📑 on all pages",
"Σε σκαναρισμένα δεν υπάρχει «κείμενο» να διορθωθεί: κάνε ⬜ πάνω στη λέξη και 🔤 γράψε τη νέα.":"Scanned pages have no real text to edit: use ⬜ over the word and 🔤 type the new one.",
"Η Σβήστρα καλύπτει οπτικά — δεν είναι redaction: σε PDF με κείμενο, το παλιό κείμενο μένει από κάτω (αναζήτηση/αντιγραφή). Για εμπιστευτικά, μετά κάνε 🗜 Συμπίεση (γίνεται εικόνα).":"The eraser covers visually — it is not redaction: in text PDFs the old text stays underneath (search/copy). For confidential data, run 🗜 Compress afterwards (pages become images).",
"📂 Διάλεξε PDF":"📂 Choose PDF","ή σύρε το εδώ (desktop) — έως ~300MB":"or drag it here (desktop) — up to ~300MB","⚙ Ρυθμίσεις":"⚙ Settings",
"Μέγιστο μέγεθος (MB)":"Max size (MB)","Τρόπος":"Mode","Ένα αρχείο κάτω από το όριο":"One file under the limit","Κομμάτια κάτω από το όριο (καλύτερη ποιότητα)":"Parts under the limit (better quality)",
"Ποιότητα":"Quality","Αυτόματη (η καλύτερη που χωράει)":"Automatic (best that fits)","Υψηλή — σχέδια (200 dpi)":"High — drawings (200 dpi)","Κανονική — έγγραφα (150 dpi)":"Normal — documents (150 dpi)",
"Χαμηλή — μόνο ανάγνωση (100 dpi)":"Low — reading only (100 dpi)","Ασπρόμαυρο (μικρότερο)":"Black & white (smaller)",
"Gmail δέχεται 25MB, Outlook/εταιρικά συνήθως 10–20MB. Με «Κομμάτια» στέλνεις π.χ. 3 email αλλά τα σχέδια διαβάζονται καθαρά.":"Gmail accepts 25MB, Outlook/company mail usually 10–20MB. With “Parts” you send e.g. 3 emails but drawings stay sharp.",
"🗜 Συμπίεση":"🗜 Compress","📷 Διάλεξε φωτογραφίες":"📷 Choose photos","πολλές μαζί — μπαίνουν με τη σειρά της λίστας":"many at once — they go in list order",
"🔤 Ταξινόμηση κατά όνομα":"🔤 Sort by name","🧹 Καθαρισμός":"🧹 Clear","Σελίδα":"Page","A4 (όρθια/πλάγια αυτόματα)":"A4 (portrait/landscape auto)","Μέγεθος φωτογραφίας":"Photo size",
"Ανάλυση φωτό":"Photo resolution","Υψηλή (2000 px)":"High (2000 px)","Κανονική (1600 px)":"Normal (1600 px)","Ελαφριά (1200 px)":"Light (1200 px)","Όνομα αρχείου":"File name","Μέγιστο (MB)":"Max (MB)",
"Αν δεν χωράει στο όριο, η εφαρμογή ρίχνει μόνη της την ποιότητα.":"If it doesn't fit the limit, the app lowers the quality by itself.","📄 Φτιάξε PDF":"📄 Make PDF",
"κάθε σελίδα γίνεται μία εικόνα JPG":"every page becomes one JPG image","Ανάλυση":"Resolution","Ελαφριά (100 dpi)":"Light (100 dpi)","Κανονική (150 dpi)":"Normal (150 dpi)","Υψηλή (220 dpi)":"High (220 dpi)",
"Σελίδες (π.χ. 1-3,7 — κενό = όλες)":"Pages (e.g. 1-3,7 — empty = all)","όλες":"all","🖼 Μετατροπή σε φωτό":"🖼 Convert to photos",
"📝 Διάλεξε Word ή Excel":"📝 Choose Word or Excel",".docx · .xlsx · .xls · .csv — ένα ή περισσότερα":".docx · .xlsx · .xls · .csv — one or more","Προσανατολισμός":"Orientation",
"Αυτόματα (Excel πλάγια αν είναι φαρδύ)":"Automatic (Excel landscape if wide)","Όρθια":"Portrait","Πλάγια":"Landscape","Excel: γραμμές πλέγματος":"Excel: gridlines",
"Offline μετατροπή: κείμενο, πίνακες, εικόνες και φύλλα Excel περνάνε σωστά. Headers/footers, πλαίσια κειμένου και ακριβής διάταξη σελίδας του Word δεν περνάνε. Για παλιό .doc: άνοιξέ το και κάνε «Αποθήκευση ως .docx».":"Offline conversion: text, tables, images and Excel sheets come through correctly. Word headers/footers, text boxes and exact page layout do not. For old .doc: open it and “Save as .docx”.",
"📄 Μετατροπή σε PDF":"📄 Convert to PDF","όσες θέλεις μαζί — μικραίνουν όλες με μία κίνηση":"as many as you like — all shrink in one go","Μέγιστη πλευρά":"Longest side",
"2560 px (πολύ καλή)":"2560 px (very good)","1600 px (email — προτείνεται)":"1600 px (email — recommended)","1024 px (αναφορές)":"1024 px (reports)","800 px (πολύ ελαφριά)":"800 px (very light)",
"Ποιότητα JPG":"JPG quality","Υψηλή":"High","Κανονική":"Normal","Χαμηλή":"Low","Όλες μαζί κάτω από":"All together under",
"Με το «όλες μαζί κάτω από 14MB» χωράνε σε ένα email. Βγαίνουν ως JPG (όνομα_s.jpg) — στείλ' τες όλες ή κατέβασέ τες σε ZIP.":"With “all together under 14MB” they fit in one email. Output is JPG (name_s.jpg) — send them all or download as ZIP.",
"📐 Resize όλων":"📐 Resize all","✋ Ακύρωση":"✋ Cancel","✅ Έτοιμο":"✅ Done",
"Στο iPhone: «📤» → Mail ή «Αποθήκευση στα Αρχεία». Στο PC: «💾» ή «📦 ZIP».":"On iPhone: “📤” → Mail or “Save to Files”. On PC: “💾” or “📦 ZIP”.",
"❓ Οδηγίες":"❓ Instructions",
"— βάζεις PDF (και 200MB), βγαίνει κάτω από 14MB. «Ένα αρχείο»: ρίχνει ποιότητα όσο χρειάζεται. «Κομμάτια»: κρατά καλή ποιότητα και σπάει σε part1, part2…":"— put in a PDF (even 200MB), get it under 14MB. “One file”: lowers quality as needed. “Parts”: keeps good quality and splits into part1, part2…",
"— διαλέγεις πολλές φωτό, τις βάζεις σε σειρά (↑) και βγαίνει ένα PDF, μία φωτό ανά σελίδα.":"— choose many photos, order them (↑) and get one PDF, one photo per page.",
"— κάθε σελίδα γίνεται JPG. Μπορείς να διαλέξεις σελίδες (π.χ. 1-3,7).":"— every page becomes a JPG. You can pick pages (e.g. 1-3,7).",
"— .docx και .xlsx/.xls/.csv σε PDF. Κάθε φύλλο Excel στη σειρά του, με το όνομά του.":"— .docx and .xlsx/.xls/.csv to PDF. Each Excel sheet in order, with its name.",
"— μικραίνει όλες τις φωτό μαζί, ώστε να χωρούν σε email.":"— shrinks all photos at once so they fit in an email.",
"— ανοίγεις PDF ή φωτό, διορθώνεις/σβήνεις/γράφεις/κόβεις/υπογράφεις και αποθηκεύεις.":"— open a PDF or photo, edit/erase/type/cut/sign and save.",
"Στη συμπίεση/μετατροπή PDF οι σελίδες γίνονται εικόνες: το κείμενο διαβάζεται αλλά δεν επιλέγεται/αναζητείται. Όλα γίνονται μέσα στη συσκευή — δουλεύει offline. Κράτα την οθόνη ανοιχτή σε μεγάλα αρχεία.":"In compress/convert the pages become images: text is readable but not selectable/searchable. Everything runs on your device — works offline. Keep the screen on for big files.",
"Κλείσιμο":"Close","💾 Αποθήκευση":"💾 Save","Διόρθωση":"Edit","Κόψε":"Cut","Μαρκαδ.":"Highlight","Στυλό":"Pen","Πλαίσιο":"Box","Εικόνα":"Image",
"Περιστροφή σελίδας":"Rotate page","Σελίδα αριστερά":"Move page left","Σελίδα δεξιά":"Move page right","Διαγραφή σελίδας":"Delete page","Αντίγραφο":"Duplicate","Σε όλες τις σελίδες":"On all pages",
"Χρώμα":"Colour","Μέγεθος":"Size","✎ Διόρθωση":"✎ Edit","📑 Όλες":"📑 All","✂ Crop σελίδας":"✂ Page crop","✕ Ακύρωση crop":"✕ Undo crop",
"🧹 Νέα εργασία":"🧹 New task","Νέα εργασία":"New task",
"Πάτα αντικείμενο για επιλογή · σύρε για μετακίνηση · ξαναπάτα κείμενο για διόρθωση":"Tap an object to select · drag to move · tap text again to edit",
"Πάτα πάνω σε λέξη/γραμμή του PDF για να τη διορθώσεις (μόνο σε PDF με κείμενο — σε σκαναρισμένο χρησιμοποίησε ⬜ + 🔤)":"Tap a word/line of the PDF to edit it (text PDFs only — on scans use ⬜ + 🔤)",
"Πάτα όπου θέλεις να γράψεις":"Tap where you want to type","Σύρε πάνω σε ό,τι θέλεις να σβήσεις — παίρνει μόνο του το χρώμα του φόντου":"Drag over what you want to erase — it picks the background colour by itself",
"Σύρε γύρω από λέξεις/περιοχή — κόβεται και μετακινείται όπου θέλεις":"Drag around words/an area — it is cut out and you can move it anywhere","Σύρε για μαρκάρισμα":"Drag to highlight",
"Ζωγράφισε / υπέγραψε με το δάχτυλο":"Draw / sign with your finger","Σύρε για πλαίσιο":"Drag to draw a box","Σύρε την περιοχή της σελίδας που θα μείνει":"Drag the part of the page to keep",
"Σύρε το κομμάτι όπου θέλεις":"Drag the piece wherever you want","Δεν βρέθηκε κείμενο εδώ — αν είναι σκαναρισμένο, χρησιμοποίησε ⬜ Σβήστρα + 🔤 Κείμενο":"No text found here — if it's a scan, use ⬜ Eraser + 🔤 Text",
"Δεν γίνεται να σβήσεις τη μοναδική σελίδα":"You can't delete the only page","Κλείσιμο χωρίς αποθήκευση; Οι αλλαγές θα χαθούν.":"Close without saving? Changes will be lost.",
"Να μπει το ίδιο αντικείμενο σε όλες τις άλλες σελίδες (ίδια θέση);":"Put the same object on all other pages (same position)?",
"Το PDF είναι κλειδωμένο (encrypted). Άνοιξέ το και κάνε «Εκτύπωση → PDF» και ξαναδοκίμασε.":"The PDF is locked (encrypted). Open it, “Print → PDF”, and try again.",
"Δεν φόρτωσε ο editor — άνοιξε την εφαρμογή μία φορά με internet.":"The editor didn't load — open the app once with internet.",
"Η αποστολή όλων μαζί δεν υποστηρίζεται εδώ — πάτα «📦 ZIP».":"Sending all at once isn't supported here — tap “📦 ZIP”.",
"📤 Αποστολή όλων":"📤 Send all","✏️ Συνέχεια επεξεργασίας":"✏️ Keep editing","🗜 Συμπίεση αυτού":"🗜 Compress this",
"Δεν είναι PDF.":"Not a PDF.","Άνοιγμα PDF…":"Opening PDF…","Δημιουργία PDF…":"Building PDF…","Φωτογραφίες…":"Photos…","Μετατροπή…":"Converting…","Resize…":"Resize…",
"Ακύρωση…":"Cancelling…","📅 Ημερομηνία κάτω δεξιά σε όλες":"📅 Date bottom-right on all","Ποια ημερομηνία":"Which date","Λήψης φωτογραφίας":"When the photo was taken",
"Σημερινή":"Today","Δική μου":"My own","Ημερομηνία":"Date","Μικρό":"Small","Κανονικό":"Normal","Μεγάλο":"Large","+ ώρα":"+ time","Ακυρώθηκε.":"Cancelled.","(κενό έγγραφο)":"(empty document)","(κενό αρχείο)":"(empty file)","Created by George Barbaris":"Created by George Barbaris"
};
// phrase-level (longest first) for dynamic strings
const PHRASES = [
["Δεν φόρτωσε το fontkit — άνοιξε μία φορά με internet.","fontkit didn't load — open once with internet."],
[" — άνοιξε την εφαρμογή μία φορά με internet."," — open the app once with internet."],
["χωράνε σε ένα email","fits in one email"],["είναι ήδη κάτω από το όριο","already under the limit"],["πάνω από το όριο","over the limit"],
["Δεν υποστηρίζεται:","Not supported:"],["σώσε το .doc ως .docx","save the .doc as .docx"],["Λάθος σελίδες (το PDF έχει","Wrong pages (the PDF has"],
["Πολλές σελίδες","Too many pages"],["διάλεξε «Κομμάτια»","choose “Parts”"],["Δεν διαβάζεται η εικόνα","Can't read the image"],["Δεν άνοιξε το αρχείο","Couldn't open the file"],
["Σφάλμα αποθήκευσης","Save error"],["Διαγραφή σελίδας","Delete page"],["Αποθηκεύτηκε","Saved"],["Δεν φόρτωσε το","Failed to load"],["Δεν άνοιξε το PDF","Couldn't open the PDF"],
["μέχρι τώρα","so far"],["απομένουν","remaining"],["Ανάγνωση","Reading"],["Μπήκε σε","Added to"],["κομμάτι","part"],["αρχείο","file"],["αρχεία","files"],
["σελίδες","pages"],["σελίδα","page"],["Σελίδα","Page"],["σελ.","pp."],["εικόνες","images"],["Φωτό","Photo"],["φωτό","photos"],["λεπτά","min"],["δευτ.","sec"]
].sort((a,b) => b[0].length - a[0].length);

export let LANG = "el";
try { LANG = localStorage.getItem("pdfzip_lang") || "el"; } catch(e){}
const ORIG = new WeakMap();
const SKIP = el => el && el.closest && el.closest("#edOv,#edName,.n,script,style,#iList .n");
export function tr(s){
  if (LANG !== "en" || !s) return s;
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/), core = m[2];
  if (EXACT[core]) return m[1] + EXACT[core] + m[3];
  if (!/[Ͱ-Ͽἀ-῿]/.test(core)) return s;
  let out = core; for (const [g, e] of PHRASES) out = out.split(g).join(e);
  return m[1] + out + m[3];
}
function doNode(n){
  if (n.nodeType === 3){
    if (SKIP(n.parentElement)) return;
    const v = n.nodeValue, t = tr(v);
    if (t !== v){ ORIG.set(n, v); n.nodeValue = t; }
  } else if (n.nodeType === 1){
    if (SKIP(n)) return;
    for (const a of ["title","placeholder"]) { const v = n.getAttribute(a); if (v){ const t = tr(v); if (t !== v){ n.dataset["o"+a] = v; n.setAttribute(a, t); } } }
    n.childNodes.forEach(doNode);
  }
}
let obs = null;
export function applyLang(lang){
  LANG = lang; try { localStorage.setItem("pdfzip_lang", lang); } catch(e){}
  document.documentElement.lang = lang;
  if (lang === "en"){
    doNode(document.body);
    if (!obs){ obs = new MutationObserver(ms => { if (LANG !== "en") return; for (const m of ms){ if (m.type === "characterData") doNode(m.target); else m.addedNodes.forEach(doNode); } });
      obs.observe(document.body, {childList:true, subtree:true, characterData:true}); }
  } else {
    const walk = n => { if (n.nodeType === 3){ if (ORIG.has(n)) { n.nodeValue = ORIG.get(n); ORIG.delete(n); } }
      else if (n.nodeType === 1){ for (const a of ["title","placeholder"]) if (n.dataset && n.dataset["o"+a]) { n.setAttribute(a, n.dataset["o"+a]); delete n.dataset["o"+a]; } n.childNodes.forEach(walk); } };
    walk(document.body);
  }
}
// dialogs
const _a = window.alert.bind(window), _c = window.confirm.bind(window);
window.alert = m => _a(tr(String(m)));
window.confirm = m => _c(tr(String(m)));
