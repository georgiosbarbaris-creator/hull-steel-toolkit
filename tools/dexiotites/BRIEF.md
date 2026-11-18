# Brief: «Οι Δεξιότητες των Παππούδων» — free illustrated self-reliance handbook

A free, printable, illustrated handbook inside the free Greek app «Επιβίωση 72+» (Survival 72+).
Goal: ordinary people (Greece first, but useful anywhere) can be self-sufficient even if the
modern world does not come back as we know it — reviving old skills our grandparents had.
Readers are NOT experts. Many are visual. They will print it on A4 and keep it at home.

## Your job
Write ONE chapter = exactly the skills listed for you (15), in BOTH Greek and English,
each with ONE original hand-drawn-style SVG illustration. Plus one chapter-opener SVG.
All content must be ORIGINAL (written by you), practical, correct and SAFE.

## Output
Write a single JSON file to the path given to you. Format:

```json
{
  "ch": "water",
  "title_el": "Νερό & Υγιεινή",
  "title_en": "Water & Hygiene",
  "intro_el": "2–3 sentences introducing the chapter.",
  "intro_en": "...",
  "opener_svg": "<svg ...>...</svg>",
  "skills": [
    {
      "id": "water-rain",
      "title_el": "Μάζεμα βρόχινου νερού από τη στέγη",
      "title_en": "Collecting rainwater from the roof",
      "level": 1,
      "time_el": "1 απόγευμα", "time_en": "1 afternoon",
      "why_el": "1–2 sentences: why this matters when shops/power/water mains are gone.",
      "why_en": "...",
      "need_el": ["item", "item"],   "need_en": ["item", "item"],
      "steps_el": ["step 1", "step 2", "..."],   "steps_en": ["...", "..."],
      "tip_el": "one practical old-timer tip (optional, may be empty string)",
      "tip_en": "...",
      "warn_el": "safety warning (empty string only if truly none)",
      "warn_en": "...",
      "fig_el": "Caption explaining the numbers in the drawing: ① gutter ② first-flush pipe ③ ...",
      "fig_en": "...",
      "svg": "<svg ...>...</svg>"
    }
  ]
}
```

Rules for text:
- MOST IMPORTANT: SIMPLE and CLEAR. The same text is shown inside the phone app and in the PDF.
  Write for a 12-year-old or a grandmother: short sentences (max ~15 words), everyday words,
  no jargon (if a technical word is needed, explain it in brackets once). One action per step.
- level: 1 = easy (anyone), 2 = some practice, 3 = needs skill/patience.
- 5–9 steps, each one short sentence or two, imperative ("Βάλε…", "Put…"). Real quantities,
  temperatures, times, ratios where they matter (e.g. salt %, minutes of boiling).
- Greek: natural, warm, simple everyday Greek (like a grandfather explaining), correct accents,
  use Greek traditional names where they exist (π.χ. προζύμι, παξιμάδι, καβουρμάς, ασβέστωμα,
  βαλσαμόλαδο, τραχανάς). English: plain international English.
- Steps EL and EN must say the same thing and have the same count.
- Safety first: botulism, CO poisoning, toxic look-alike plants, burns, knife safety, lye,
  drug interactions etc. must be in warn_*. Never give dangerous or illegal advice
  (no snares/traps for wild animals, no distilling alcohol, no explosives, no firearms).
  Herbal/home remedies: traditional use only, "not a substitute for a doctor".
- Keep each skill compact: it must fit on ONE A4 page together with its drawing
  (≈ 180–260 words per language total for why+need+steps+tip+warn).
- Do not copy text from any book or website. Do not mention brands.

## Rules for the SVG drawings (very important — they are what makes the book)
- Style: old engraved handbook / grandfather's notebook: clean line art in sepia ink,
  with a few flat soft tints. Clear, simple, instructive — like a good technical sketch.
- `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">` for skills;
  opener: `viewBox="0 0 400 300"`.
- Ink: stroke `#3b2a1a`, stroke-width 1.5–2.5, `stroke-linecap="round" stroke-linejoin="round"`.
- Tint palette (fills only, soft): paper `#f6ecd6`, wood `#d9b77e`, earth `#c8a27a`,
  water `#bcd9e3`, fire `#f2a65a`/`#e2603a`, plant `#a9c98b`/`#6f9a52`, metal `#c9ccd1`,
  clay `#d98e5c`, stone `#bdb5a6`, white `#ffffff`. Arrows/flows: `#b23a2a`.
- NO words inside the SVG (it is shared by both languages). Only numbered callouts:
  a circle r=10 fill `#3b2a1a` with a white bold number (font-family="Georgia, serif",
  font-size 13, text-anchor="middle") + a thin leader line to the part. The numbers are
  explained in fig_el / fig_en. Numbers like ①②③ in captions.
- Show the thing so a person can BUILD/DO it: cross-sections, side views, a 2–3 panel
  sequence (panels separated by thin lines) when steps matter. Hatching for ground/earth.
- No `<image>`, no external refs, no scripts, no `<style>` blocks, no filters, no fonts other
  than the Georgia/serif numbers. Use plain shapes/paths. Keep each SVG under ~7 KB.
- Must be valid XML (escape nothing weird; no `&` except `&amp;`).
- Draw carefully: things must be recognisable (a jar looks like a jar, a hand like a hand,
  a pot like a pot). Prefer simple and clear over complex and messy.

## Quality check (do this before you finish)
Run: `python3 tools/dexiotites/check.py <your json path>`
It validates the JSON and renders all drawings into a contact sheet PNG it prints the path of.
Open that PNG with the Read tool, look at every drawing, and redraw any that is unclear,
broken, overlapping, or ugly. Run the check again until it passes and looks good.
Finish by replying with just: the file path, number of skills, and any concern.
