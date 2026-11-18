# Οι Δεξιότητες των Παππούδων (Επιβίωση 72+ v41)
- Κεφάλαια: `<ch>.json` (EL/EN κείμενα + SVG σχέδια). Οδηγίες γραφής/σχεδίων: `BRIEF.md`. Έλεγχος: `python3 check.py water.json`.
- Χτίσιμο: `python3 build.py 41 18/11/2026` → γράφει `docs/survival/dexiotites.json` (για την εφαρμογή) και τα PDF `Dexiotites_Pappoudon.pdf` / `Grandparents_Skills.pdf`.
- Δοκιμή σαν iPhone: `python3 test_app.py`.
- Ο κώδικας της ενότητας μέσα στο `docs/survival/index.html` είναι ήδη μέσα (αντίγραφο: `dx_module.js`). Νέα δεξιότητα = πρόσθεσέ τη στο σωστό json → build → bump `sw.js` cache → push.
