#!/usr/bin/env python3
"""Validate a chapter JSON and render its SVGs into a contact sheet."""
import json, sys, os, subprocess, tempfile, xml.dom.minidom
from PIL import Image, ImageDraw

p = sys.argv[1]
d = json.load(open(p, encoding="utf-8"))
errs = []
for k in ["ch", "title_el", "title_en", "intro_el", "intro_en", "opener_svg", "skills"]:
    if not d.get(k):
        errs.append(f"missing chapter field {k}")
need = ["id", "title_el", "title_en", "level", "why_el", "why_en", "need_el", "need_en",
        "steps_el", "steps_en", "fig_el", "fig_en", "svg", "warn_el", "warn_en", "time_el", "time_en"]
svgs = [("opener", d.get("opener_svg", ""))]
ids = set()
for s in d.get("skills", []):
    sid = s.get("id", "?")
    if sid in ids: errs.append(f"duplicate id {sid}")
    ids.add(sid)
    for k in need:
        if k not in s or s[k] in (None, [], ""):
            if k in ("warn_el", "warn_en") and k in s: continue
            errs.append(f"{sid}: missing {k}")
    if len(s.get("steps_el", [])) != len(s.get("steps_en", [])):
        errs.append(f"{sid}: steps_el/en count differ")
    if len(s.get("need_el", [])) != len(s.get("need_en", [])):
        errs.append(f"{sid}: need_el/en count differ")
    words = sum(len(str(x).split()) for k in ["why_el", "tip_el", "warn_el"] for x in [s.get(k, "")])
    words += sum(len(x.split()) for k in ["steps_el", "need_el"] for x in s.get(k, []))
    if words > 330: errs.append(f"{sid}: Greek text too long ({words} words) – shorten")
    svgs.append((sid, s.get("svg", "")))
tmp = tempfile.mkdtemp()
thumbs = []
for sid, svg in svgs:
    try:
        xml.dom.minidom.parseString(svg)
    except Exception as e:
        errs.append(f"{sid}: SVG not valid XML: {e}"); continue
    for bad in ["<image", "<script", "<style", "filter=", "href=\"http"]:
        if bad in svg: errs.append(f"{sid}: SVG contains {bad}")
    if len(svg) > 9000: errs.append(f"{sid}: SVG too big ({len(svg)} bytes)")
    f = os.path.join(tmp, sid + ".svg"); open(f, "w").write(svg)
    png = f[:-4] + ".png"
    r = subprocess.run(["rsvg-convert", "-w", "400", "-b", "white", f, "-o", png], capture_output=True)
    if r.returncode: errs.append(f"{sid}: render failed {r.stderr[:200]}"); continue
    thumbs.append((sid, png))
if thumbs:
    W, H = 400, 300; cols = 4; rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (W * cols, (H + 22) * rows), "white"); dr = ImageDraw.Draw(sheet)
    for i, (sid, png) in enumerate(thumbs):
        im = Image.open(png).convert("RGB"); im.thumbnail((W, H))
        x, y = (i % cols) * W, (i // cols) * (H + 22)
        sheet.paste(im, (x, y + 20)); dr.text((x + 4, y + 4), sid, fill="red")
        dr.rectangle([x, y, x + W - 1, y + H + 21], outline="#999")
    out = os.path.splitext(p)[0] + "_sheet.png"; sheet.save(out)
    print("contact sheet:", out)
print(f"{len(d.get('skills', []))} skills")
print("ERRORS:\n" + "\n".join(errs) if errs else "OK – no errors")
