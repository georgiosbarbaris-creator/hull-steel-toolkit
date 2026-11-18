#!/usr/bin/env python3
"""Build «Οι Δεξιότητες του Παππού Διαμαντή» – app data JSON + EL/EN A4 PDFs."""
import json, os, re, sys, html, asyncio
from playwright.async_api import async_playwright

SK = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SK, "..", "..", "docs", "survival")
ORDER = ["water", "fire", "preserve", "kitchen", "garden", "animals", "herbs", "tools", "house"]
ICON = {"water": "💧", "fire": "🔥", "preserve": "🫙", "kitchen": "🍞", "garden": "🌱",
        "animals": "🐓", "herbs": "🌿", "tools": "🪢", "house": "🏡"}
VER = sys.argv[1] if len(sys.argv) > 1 else "41"
DATE = sys.argv[2] if len(sys.argv) > 2 else "18/11/2026"

chs = []
for c in ORDER:
    p = f"{SK}/{c}.json"
    if os.path.exists(p):
        d = json.load(open(p, encoding="utf-8")); d["icon"] = ICON[c]; chs.append(d)
N = sum(len(c["skills"]) for c in chs)

# ---------- app data (compact) ----------
def clean_svg(s):
    s = re.sub(r">\s+<", "><", s.strip()); return re.sub(r"\s{2,}", " ", s)
app = {"v": VER, "chapters": []}
for c in chs:
    cc = {k: c[k] for k in ["ch", "icon", "title_el", "title_en", "intro_el", "intro_en"]}
    cc["opener_svg"] = clean_svg(c["opener_svg"]); cc["skills"] = []
    for s in c["skills"]:
        s2 = dict(s); s2["svg"] = clean_svg(s["svg"]); cc["skills"].append(s2)
    app["chapters"].append(cc)
json.dump(app, open(f"{OUT}/dexiotites.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# ---------- PDF ----------
T = {
 "el": dict(title="Οι Δεξιότητες<br>του Παππού Διαμαντή", sub=f"Εγχειρίδιο αυτάρκειας – {N} γνώσεις του παλιού καιρού, βήμα βήμα με σχέδια",
   free="ΔΩΡΕΑΝ – για το καλό όλων", ded="Αφιερωμένο στη μνήμη του παππού μου, Διαμαντή.", ded2="Για να μη χαθεί ποτέ η γνώση των παππούδων μας – και να περάσει στα παιδιά και στα εγγόνια μας.", sign="Γιώργος Μπαρμπαρής", ded3="Και ό,τι είναι φαγητό, τροφή και δουλειές του σπιτιού – πλύσιμο, ράψιμο, πλέξιμο, σαπούνι – στη γιαγιά Μαρία και στη γιαγιά Αρετή.", app="Από την εφαρμογή «Επιβίωση 72+»",
   spons="Ευγενική χορηγία του Γιώργου Μπαρμπαρή – γιατί όσα σώζουν ζωές δεν έχουν τιμή.",
   copy="© 2026 Γεώργιος Μπαρμπαρής – Διανέμεται δωρεάν. Επιτρέπεται η εκτύπωση και η δωρεάν διανομή, όχι η πώληση.",
   how="Πώς να το χρησιμοποιήσεις", toc="Περιεχόμενα", need="Τι χρειάζεσαι", steps="Βήμα βήμα", why="Γιατί",
   tip="Συμβουλή του παππού Διαμαντή", warn="Προσοχή", fig="Το σχέδιο", lvl="Δυσκολία", time="Χρόνος", ch="Κεφάλαιο", pg="σελ.",
   howtxt=["Τύπωσέ το σε Α4 και κράτα το σε φάκελο ή ντοσιέ, μακριά από υγρασία. Το χαρτί δουλεύει και όταν δεν υπάρχει ρεύμα.",
     "Κάθε σελίδα είναι μία δεξιότητα: γιατί χρειάζεται, τι υλικά θέλει, τα βήματα και ένα σχέδιο με αριθμούς ①②③.",
     "Οι τελείες ●○○ δείχνουν τη δυσκολία: ● εύκολο για όλους, ●● θέλει λίγη εξάσκηση, ●●● θέλει υπομονή και τέχνη.",
     "Δοκίμασε τις δεξιότητες ΤΩΡΑ, όσο όλα είναι καλά. Στην ανάγκη δεν είναι η ώρα για την πρώτη φορά.",
     "Μάθε τες στα παιδιά και στα εγγόνια. Μια γνώση που περνάει από χέρι σε χέρι δεν χάνεται ποτέ."],
   disc="Οι οδηγίες είναι γενικές πληροφορίες, όχι ιατρική ή επαγγελματική συμβουλή. Διάβαζε πάντα τις προειδοποιήσεις. Για σοβαρά θέματα υγείας πήγαινε σε γιατρό ή φαρμακοποιό. Τήρησε τους νόμους της περιοχής σου (ψάρεμα, συλλογή φυτών, φωτιά στην ύπαιθρο). Ο δημιουργός δεν φέρει ευθύνη για λάθος χρήση."),
 "en": dict(title="Grandpa Diamantis'<br>Skills", sub=f"A self-reliance handbook – {N} old-time skills, step by step with drawings",
   free="FREE – for the good of all", ded="Dedicated to the memory of my grandfather, Diamantis.", ded2="So that the knowledge of our grandparents is never lost – and passes on to our children and grandchildren.", sign="Georgios Barmparis", ded3="And all that is food, cooking and the work of the home – washing, sewing, knitting, soap – to Grandma Maria and Grandma Areti.", app="From the app «Survival 72+»",
   spons="Kindly sponsored by George Barbaris – because the things that save lives are priceless.",
   copy="© 2026 Georgios Barmparis – Distributed free. Printing and free sharing allowed, selling is not.",
   how="How to use this book", toc="Contents", need="What you need", steps="Step by step", why="Why",
   tip="Grandpa Diamantis' tip", warn="Careful", fig="The drawing", lvl="Difficulty", time="Time", ch="Chapter", pg="p.",
   howtxt=["Print it on A4 and keep it in a folder, away from damp. Paper works when there is no power.",
     "Each page is one skill: why it matters, what you need, the steps and a drawing with numbers ①②③.",
     "The dots ●○○ show difficulty: ● easy for anyone, ●● needs some practice, ●●● needs patience and skill.",
     "Practise the skills NOW, while all is well. An emergency is not the time to try for the first time.",
     "Teach them to your children and grandchildren. Knowledge passed from hand to hand is never lost."],
   disc="These instructions are general information, not medical or professional advice. Always read the warnings. For serious health problems see a doctor or pharmacist. Follow your local laws (fishing, plant gathering, open fires). The author accepts no liability for misuse."),
}

CSS = """
@page{size:A4;margin:13mm 14mm 15mm 14mm}
*{box-sizing:border-box}
body{margin:0;font-family:'Fira Sans','Open Sans',sans-serif;font-size:10.6pt;line-height:1.38;color:#2a1f14}
h1,h2,h3,.serif{font-family:'GFS Baskerville','Cardo','Liberation Serif',serif}
.page{page-break-after:always;position:relative}
.cover{height:269mm;background:#f3e6c8;border:3px double #5a3e22;padding:14mm 12mm;text-align:center;display:flex;flex-direction:column;justify-content:space-between}
.cover h1{font-size:40pt;line-height:1.02;margin:0;color:#3b2a1a;letter-spacing:.5px}
.cover .sub{font-size:13.5pt;color:#5a3e22;margin:4mm 0 0;font-style:italic}
.cover .grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:6mm 0}
.cover .grid div{background:#fffaf0;border:1.5px solid #5a3e22;border-radius:2mm;padding:1.5mm}
.cover .grid svg{width:100%;height:auto;display:block}
.free{display:inline-block;background:#b23a2a;color:#fff;font-weight:800;font-size:15pt;padding:2mm 7mm;border-radius:2mm;letter-spacing:1px}
.cover .foot{font-size:9.5pt;color:#5a3e22}
h2.sec{font-size:20pt;margin:0 0 4mm;color:#3b2a1a;border-bottom:2px solid #3b2a1a;padding-bottom:1mm}
.how li{margin:0 0 2.2mm}
.disc{border:1.5px solid #b23a2a;border-radius:2mm;padding:3mm;font-size:9.5pt;margin-top:5mm}
.toc{columns:2;column-gap:8mm;font-size:9.4pt}
.toc .tch{font-weight:800;margin:2.5mm 0 1mm;break-after:avoid;font-family:'GFS Baskerville',serif;font-size:11pt}
.toc .ti{display:flex;gap:2mm}.toc .ti span:nth-child(2){flex:1;border-bottom:1px dotted #a08a6c;margin-bottom:1.2mm}
.opener{text-align:center;padding-top:8mm}
.opener .num{font-size:12pt;letter-spacing:3px;color:#8a6a45;text-transform:uppercase}
.opener h2{font-size:30pt;margin:2mm 0 5mm;color:#3b2a1a}
.opener .art{border:2px solid #3b2a1a;border-radius:2mm;padding:2mm;background:#f6ecd6;margin:0 6mm}
.opener .art svg{width:100%;height:auto;display:block}
.opener .intro{font-size:12pt;margin:6mm 10mm;font-style:italic}
.opener ol{text-align:left;columns:2;margin:4mm 10mm;font-size:10pt}
.sk .hd{display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2px solid #3b2a1a;padding-bottom:1.2mm;margin-bottom:2.5mm}
.sk .tag{font-size:8.5pt;color:#8a6a45;letter-spacing:1px;text-transform:uppercase}
.sk h3{font-size:17pt;margin:0;line-height:1.12;color:#3b2a1a}
.sk .meta{font-size:9pt;text-align:right;white-space:nowrap;color:#5a3e22}
.sk .fig{border:1.5px solid #3b2a1a;border-radius:2mm;background:#fffdf7;padding:1.5mm;margin:0 0 1mm}
.sk .fig svg{width:100%;height:auto;max-height:98mm;display:block}
.sk .cap{font-size:8.8pt;color:#4a3826;margin:0 0 2.5mm;font-style:italic}
.sk .why{margin:0 0 2.5mm}
.sk .row{display:flex;gap:5mm}
.sk .need{flex:0 0 33%;background:#f6ecd6;border-radius:2mm;padding:2mm 3mm;font-size:9.6pt}
.sk .need ul{margin:1mm 0 0;padding-left:4mm}
.sk .steps{flex:1}
.sk .steps ol{margin:1mm 0 0;padding-left:0;list-style:none;counter-reset:s}
.sk .steps li{counter-increment:s;position:relative;padding-left:7mm;margin:0 0 1.5mm}
.sk .steps li:before{content:counter(s);position:absolute;left:0;top:.2mm;width:5mm;height:5mm;border-radius:50%;background:#3b2a1a;color:#fff;font-size:8pt;font-weight:700;text-align:center;line-height:5mm}
.lbl{font-weight:800;font-size:9pt;letter-spacing:.6px;text-transform:uppercase;color:#5a3e22}
.tipb{border:1.5px dashed #6f9a52;background:#f2f7ec;border-radius:2mm;padding:1.8mm 3mm;margin:2mm 0 0;font-size:9.6pt}
.warnb{border:2px solid #b23a2a;background:#fbefec;border-radius:2mm;padding:1.8mm 3mm;margin:2mm 0 0;font-size:9.6pt}
.end{text-align:center;padding-top:40mm}
.end h2{font-size:24pt}
"""

FOOD = ("preserve", "kitchen")
GM_SKILLS = ["water-ashlye","water-laundry","tool-sewing","tool-patch","tool-darning","tool-knitting","tool-broom","herb-soap","herb-disinfect","herb-dry","herb-infusion"]
GM = {"el": ["Συμβουλή της γιαγιάς Μαρίας", "Συμβουλή της γιαγιάς Αρετής"], "en": ["Grandma Maria's tip", "Grandma Areti's tip"]}
GMDED = {"el": "Αφιερωμένο στη γιαγιά Μαρία και στη γιαγιά Αρετή", "en": "Dedicated to Grandma Maria and Grandma Areti"}
def e(x): return html.escape(str(x or ""))
def dots(n): n = int(n or 1); return "●" * n + "○" * (3 - n)

def build_html(L):
    t = T[L]; o = []
    # cover
    art = "".join(f"<div>{c['opener_svg']}</div>" for c in chs[:4])
    o.append(f"""<div class="page"><div class="cover"><div><div class="free">{t['free']}</div>
    <h1 style="margin-top:6mm">{t['title']}</h1><div class="sub">{e(t['sub'])}</div><div class="sub" style="font-size:11pt;margin-top:3mm">✝ {e(t['ded'])}</div></div>
    <div class="grid">{art}</div>
    <div class="foot"><b>{e(t['app'])}</b><br>{e(t['spons'])}<br>{e(t['copy'])}<br>v{VER} · {DATE}</div></div></div>""")
    # dedication page
    o.append(f"""<div class="page dedi"><div class="serif" style="text-align:center;padding-top:75mm">
    <div style="font-size:30pt;color:#5a3e22">✝</div><div style="font-size:20pt;font-style:italic;margin:6mm 10mm;color:#3b2a1a">{e(t['ded'])}</div>
    <div style="font-size:12.5pt;margin:4mm 20mm;color:#5a3e22">{e(t['ded2'])}</div><div style="font-size:13pt;margin:8mm 20mm 0;font-style:italic;color:#3b2a1a">♥ {e(t['ded3'])}</div><div style="font-size:12pt;margin-top:10mm">— {e(t['sign'])}</div></div></div>""")
    # how to use
    o.append(f"""<div class="page"><h2 class="sec">{t['how']}</h2><ol class="how">{''.join(f'<li>{e(x)}</li>' for x in t['howtxt'])}</ol>
    <div class="disc"><b>⚠ </b>{e(t['disc'])}</div>
    <h2 class="sec" style="margin-top:8mm">{t['toc']}</h2><div class="toc">@@TOC@@</div></div>""")
    toc_entries = []
    for i, c in enumerate(chs, 1):
        toc_entries.append(("ch", f"{i}. {c['title_' + L]}", "c_" + c["ch"]))
        items = "".join(f"<li>{e(s['title_' + L])}</li>" for s in c["skills"])
        o.append(f"""<div class="page opener" id="c_{c['ch']}"><div class="num">{t['ch']} {i}</div><h2>{e(c['title_' + L])}</h2>
        {('<div class="intro" style="margin:0 0 4mm;font-size:13pt">♥ '+GMDED[L]+'</div>') if c['ch'] in FOOD else ''}<div class="art">{c['opener_svg']}</div><div class="intro">{e(c['intro_' + L])}</div><ol>{items}</ol></div>""")
        for j, s in enumerate(c["skills"], 1):
            toc_entries.append(("sk", f"{i}.{j} {s['title_' + L]}", "s_" + s["id"]))
            need = "".join(f"<li>{e(x)}</li>" for x in s["need_" + L])
            steps = "".join(f"<li>{e(x)}</li>" for x in s["steps_" + L])
            tip = f'<div class="tipb"><span class="lbl">💡 {(GM[L][(j-1)%2] if c["ch"] in FOOD else (GM[L][GM_SKILLS.index(s["id"])%2] if s["id"] in GM_SKILLS else t["tip"]))}: </span>{e(s["tip_" + L])}</div>' if s.get("tip_" + L) else ""
            warn = f'<div class="warnb"><span class="lbl">⚠ {t["warn"]}: </span>{e(s["warn_" + L])}</div>' if s.get("warn_" + L) else ""
            o.append(f"""<div class="page sk" id="s_{s['id']}"><div class="hd"><div><div class="tag">{c['icon']} {e(c['title_' + L])} · {i}.{j}</div>
            <h3>{e(s['title_' + L])}</h3></div><div class="meta">{t['lvl']}: {dots(s.get('level'))}<br>{t['time']}: {e(s.get('time_' + L))}</div></div>
            <div class="fig">{s['svg']}</div><div class="cap">{e(s['fig_' + L])}</div>
            <div class="why"><span class="lbl">{t['why']}: </span>{e(s['why_' + L])}</div>
            <div class="row"><div class="need"><span class="lbl">{t['need']}</span><ul>{need}</ul></div>
            <div class="steps"><span class="lbl">{t['steps']}</span><ol>{steps}</ol></div></div>{tip}{warn}</div>""")
    o.append(f"""<div class="end serif"><h2>{'Καλή δύναμη – και να τα μάθεις στα παιδιά σου.' if L=='el' else 'Stay strong – and teach this to your children.'}</h2><p style="font-style:italic">✝ {e(t['ded'])}</p>
    <p>{e(t['spons'])}<br>{e(t['copy'])}<br>georgiosbarbaris-creator.github.io/hull-steel-toolkit/survival/</p></div>""")
    toc = ""
    for kind, label, anchor in toc_entries:
        if kind == "ch": toc += f'<div class="tch">{e(label)}</div>'
        else: toc += f'<div class="ti"><span>{e(label)}</span><span></span><span>@@{anchor}@@</span></div>'
    doc = f"<!doctype html><html lang='{L}'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(o)}</body></html>"
    return doc.replace("@@TOC@@", toc)

FOOT = {"el": "Οι Δεξιότητες του Παππού Διαμαντή · Επιβίωση 72+ · δωρεάν", "en": "Grandpa Diamantis' Skills · Survival 72+ · free"}

FITJS = ("""()=>{const H=269*96/25.4,mm=96/25.4,out=[];
          for(const el of document.querySelectorAll('.sk')){const sv=el.querySelector('.fig svg');let m=98;
            while(el.scrollHeight>H-2&&m>56){m-=4;sv.style.maxHeight=m+'mm'}
            let f=10.6;while(el.scrollHeight>H-2&&f>9.4){f-=.3;el.style.fontSize=f+'pt'}
            if(m<98||f<10.6)out.push(el.id+' fig'+m+' f'+f.toFixed(1))}return out}""")

async def render(L, fname):
    doc = build_html(L)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page()
        await pg.set_content(doc, wait_until="load")
        # page numbers for TOC: measure each anchor's page via offsetTop relative to page breaks
        await pg.emulate_media(media="print")
        await pg.add_style_tag(content="body{width:182mm}")
        fit = await pg.evaluate(FITJS)
        if fit: print(L, "auto-fit:", fit)
        res = await pg.evaluate("""()=>{const H=269*96/25.4;const r={},over=[];let n=1;
          for(const el of document.querySelectorAll('.page, .end')){const k=Math.max(1,Math.ceil((el.scrollHeight-2)/H));
            if(el.id)r[el.id]=n; if(k>1)over.push((el.id||'?')+':'+k); n+=k}return {r,over,n}}""")
        nums = res["r"]
        if res["over"]: print(L, "OVERFLOW pages:", res["over"])
        total = res["n"] - 1; delta = 0
        foot = f"<div style='font-size:7.5pt;width:100%;text-align:center;color:#8a6a45;font-family:sans-serif'>{FOOT[L]} · <span class='pageNumber'></span></div>"
        for it in range(3):
            doc2 = re.sub(r"@@([a-z0-9_\-]+)@@", lambda m: str(nums.get(m.group(1), 0) + delta), doc)
            await pg.set_content(doc2, wait_until="load")
            await pg.add_style_tag(content="body{width:182mm}")
            await pg.evaluate(FITJS)
            await pg.add_style_tag(content="body{width:auto}")
            await pg.pdf(path=f"{OUT}/{fname}", format="A4", print_background=True, display_header_footer=True,
                         header_template="<div></div>", footer_template=foot,
                         margin={"top": "13mm", "bottom": "15mm", "left": "14mm", "right": "14mm"})
            import pypdf
            actual = len(pypdf.PdfReader(f"{OUT}/{fname}").pages)
            if actual - total == delta: break
            delta = actual - total; print(L, "page shift", delta)
        open(f"{SK}/preview_{L}.html", "w").write(doc2)
        await b.close()

asyncio.run(render("el", "Dexiotites_Pappou_Diamanti.pdf"))
asyncio.run(render("en", "Grandpa_Diamantis_Skills.pdf"))
print("chapters", len(chs), "skills", N)
