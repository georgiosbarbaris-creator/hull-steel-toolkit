# -*- coding: utf-8 -*-
"""Adds ports from NGA Pub. 150 World Port Index (US Government — public domain) to voyage/ports.json.
Source CSV (trimmed): tools/data/wpi_pub150_min.csv  (from NGA UpdatedPub150.csv).
Each new port borrows the sea 'gates' of the nearest hand-checked port in the same water body
(<= 250 nm away), so the app can estimate a route; ports flagged 1 in field [6] prefer Pub.151 chains.
Run order: voyage_ports.py -> voyage_wpi.py <Sea_Distance_Table.xlsx> -> voyage_pub151.py <xlsx>"""
import sys, re, csv, json, math, pathlib, collections, openpyxl
r = pathlib.Path(__file__).resolve().parent.parent
J = json.loads((r/"voyage/ports.json").read_text())
CUR = [p for p in J["p"] if not (len(p) > 6 and p[6])]          # hand-checked ports only
def gc(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    return 2*math.asin(math.sqrt(min(1, math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2)))*3440.065
def key(s): return re.sub(r"[^a-z0-9]", "", re.sub(r"\(.*?\)", "", str(s)).lower())
# Pub.151 names + coordinates (to reuse its spelling so its distances link up)
wb = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
def dms(s):
    m = re.findall(r"(\d+)°(\d+)'(\d+)?\"?([NSEW])", s.replace("′", "'").replace("″", '"'))
    if len(m) < 2: return None
    return [(-1 if h in "SW" else 1)*(int(d)+int(mi)/60+int(se or 0)/3600) for d, mi, se, h in m[:2]]
PUBC = collections.defaultdict(list)
for row in wb["Ports"].iter_rows(min_row=6, values_only=True):
    if row[0] and row[1]:
        c = dms(str(row[1]))
        if c: PUBC[key(str(row[0]).split(",")[0])].append((re.sub(r"\s+", " ", re.sub(r"\s*\(.*?\)\s*", " ", str(row[0]))).strip(), c))
W = list(csv.DictReader(open(r/"tools/data/wpi_pub150_min.csv", encoding="utf-8")))
iso = collections.defaultdict(collections.Counter)
for w in W:
    lc = w["UN/LOCODE"].replace(" ", "")
    if len(lc) >= 2: iso[w["Country Code"]][lc[:2].upper()] += 1
def cc(w):
    lc = w["UN/LOCODE"].replace(" ", "")
    if len(lc) >= 2: return lc[:2].upper()
    return iso[w["Country Code"]].most_common(1)[0][0] if iso[w["Country Code"]] else w["Country Code"][:12]
def depth(w):
    v = []
    for k in ("Channel Depth (m)", "Cargo Pier Depth (m)", "Anchorage Depth (m)"):
        try: v.append(float(w[k]))
        except: pass
    return max(v) if v else 0
def pos(w): return (float(w["Latitude"]), float(w["Longitude"]))
# water body of each hand-checked port = that of the nearest WPI record (<= 40 nm)
def wb_of(p):
    best = min(W, key=lambda w: gc((p[2], p[3]), pos(w)))
    return best["World Water Body"] if gc((p[2], p[3]), pos(best)) <= 40 else None
CWB = [(p, wb_of(p)) for p in CUR]
names = {key(p[0]) for p in CUR}
for p in CUR:
    for part in re.split(r"\s*/\s*", p[0]): names.add(key(part))
new, skipped = [], collections.Counter()
for w in W:
    if w["Harbor Size"] == "Very Small" and depth(w) < 7: skipped["very small / shallow"] += 1; continue
    if not w["Main Port Name"]: continue
    xy = pos(w)
    if key(w["Main Port Name"]) in names or any(gc(xy, (p[2], p[3])) < 4 for p in CUR): skipped["already in list"] += 1; continue
    # gates from nearest hand-checked port in the same water body
    c = [(gc(xy, (p[2], p[3])), p) for p, b in CWB if b and b == w["World Water Body"]]
    c = [x for x in c if x[0] <= 250]
    y = min(c, key=lambda x: x[0]) if c else None
    gates = y[1][4] if y else []
    extra = (y[1][5] if len(y[1]) > 5 else 0) if y and y[0] < 60 else 0   # same river: same river miles
    # use Pub.151 spelling if the same port is there (within 30 nm)
    nm = w["Main Port Name"].strip()
    for pn, pc in PUBC.get(key(nm), []):
        if gc(xy, pc) <= 30: nm = pn; break
    new.append([nm, cc(w), round(xy[0], 4), round(xy[1], 4), gates, extra, 1])
# unique names: add country if the same name appears twice
cnt = collections.Counter(key(p[0]) for p in new + CUR)
for p in new:
    if cnt[key(p[0])] > 1: p[0] = f"{p[0]} ({p[1]})"
seen = set(); out = []
for p in new:
    if key(p[0]) in seen: continue
    seen.add(key(p[0])); out.append(p)
J["p"] = CUR + sorted(out, key=lambda p: p[0])
J["wpi"] = "NGA Pub. 150 World Port Index (public domain)"
(r/"voyage/ports.json").write_text(json.dumps(J, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(CUR), "hand-checked +", len(out), "WPI ports;", sum(1 for p in out if p[4]), "with route gates;", dict(skipped))
