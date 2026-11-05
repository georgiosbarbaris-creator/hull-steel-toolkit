# RISQ + RISQ Crew — regulatory watch log

Shared log for both RightShip apps (RISQ in Greek, RISQ Crew in English/Filipino). Every change goes into BOTH apps in the same run.
PSC-by-region content lives in `tools/psc_src.py` → `risq/psc.json` (one source for both apps). Edit `tools/psc_src.py`, run it, then run `tools/make_risq.py` and `tools/make_risqcrew.py`.

## Watch log
- 2026-11-05: New "🛂 PSC by region" module (All / Paris MoU / Tokyo MoU / AMSA / USCG): top detainables, current CIC, regional rules, pre-arrival items, checklist saved per inspection, links to RISQ questions, share list. → RISQ ✓ / RISQ Crew ✓
  - Sources: Paris MoU AR 2025, Tokyo MOU AR 2025 (ANN25), AMSA Inspections Report 2025 + MLC Report 2025 + Bulletin #23, USCG PSC AR 2025, CIC Cargo Securing 2026 questionnaire, 33 CFR 164.25, EPA VGP notice, DAFF MARS, BIMCO FSMC 2026, LR FuelEU timetable.

## Pending (not yet in force / needs George)
- CIC Cargo Securing ends 30 Nov 2026 → after that, move it to "past" and add the results when Paris/Tokyo publish them.
- CIC 2027 Enclosed Space Entry → add the questionnaire when published (usually ~August).
- SOLAS V/23 pilot transfer amendments from 1 Jan 2028 (MSC.576(110) performance standards).
- USCG VIDA implementing regulations → when final, replace the "2013 VGP still applies" item.
- Paris MoU / Tokyo MOU / AMSA / USCG annual reports for 2026 (published ~May–July 2027) → refresh all figures.
