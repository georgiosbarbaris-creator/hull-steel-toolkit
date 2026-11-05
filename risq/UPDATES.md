# RISQ + RISQ Crew — regulatory watch log

Shared log for both RightShip apps (RISQ in Greek, RISQ Crew in English/Filipino). Every change goes into BOTH apps in the same run.
PSC-by-region content lives in `tools/psc_src.py` → `risq/psc.json`; manuals (📘 PSC Field Manual + Zero Deficiency Canada, generic part) in `tools/manuals_src.py` → `risq/manuals.json`; manuals UI in `tools/man_js.js`. One source for both apps. Edit, run the src script, then `tools/make_risq.py` and `tools/make_risqcrew.py`. Ship-specific ◆ items are NEVER in the repo — they come from a private ship pack (.json, kind `risq-shippack`) imported on the phone.

## Watch log
- 2026-11-05: New "🛂 PSC by region" module (All / Paris MoU / Tokyo MoU / AMSA / USCG): top detainables, current CIC, regional rules, pre-arrival items, checklist saved per inspection, links to RISQ questions, share list. → RISQ ✓ / RISQ Crew ✓
  - Sources: Paris MoU AR 2025, Tokyo MOU AR 2025 (ANN25), AMSA Inspections Report 2025 + MLC Report 2025 + Bulletin #23, USCG PSC AR 2025, CIC Cargo Securing 2026 questionnaire, 33 CFR 164.25, EPA VGP notice, DAFF MARS, BIMCO FSMC 2026, LR FuelEU timetable.

- 2026-11-05: Added the two manuals without duplicating existing content: 📘 Manuals page (Field Manual P/F/N/A audit of 14 chapters, stop conditions, 15 No-Go, decision tree, case files, itinerary; Zero Deficiency Canada walk-round A–L, rounds, pre-arrival, drills, golden rules), 🇨🇦 Canada regime in PSC (rules + real 2025 Canadian detentions), new regime facts from the manual merged into Paris/Tokyo/AMSA/USCG, 9 new interview questions added to the existing 🎤 drill, private ship-pack import. → RISQ ✓ / RISQ Crew ✓

## Pending (not yet in force / needs George)
- Whale measures: NARW Gulf of St. Lawrence season ends 15 Nov 2026, ECHO Haro Strait 30 Nov 2026 → update Canada regime/manual for the 2027 season.
- CIC Cargo Securing ends 30 Nov 2026 → after that, move it to "past" and add the results when Paris/Tokyo publish them.
- CIC 2027 Enclosed Space Entry → add the questionnaire when published (usually ~August).
- SOLAS V/23 pilot transfer amendments from 1 Jan 2028 (MSC.576(110) performance standards).
- USCG VIDA implementing regulations → when final, replace the "2013 VGP still applies" item.
- Paris MoU / Tokyo MOU / AMSA / USCG annual reports for 2026 (published ~May–July 2027) → refresh all figures.
