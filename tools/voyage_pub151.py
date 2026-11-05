# -*- coding: utf-8 -*-
"""NGA Pub. 151 Distances Between Ports (11th ed. 2001, US Government — public domain),
digitised by github.com/kaklin/sea-routes, delivered to us as Sea_Distance_Table.xlsx.
Builds voyage/pub151.json: names + undirected edges (min nm) used with Dijkstra through Pub.151 junction points,
plus alias map from the app's own port list (voyage/ports.json) to Pub.151 names (nearest within 25 nm).
Usage: python3 tools/voyage_pub151.py path/to/Sea_Distance_Table.xlsx"""
import sys, re, json, math, pathlib, openpyxl
r = pathlib.Path(__file__).resolve().parent.parent
wb = openpyxl.load_workbook(sys.argv[1], read_only=True, data_only=True)
def norm(s): return re.sub(r"\s+", " ", re.sub(r"\s*\(.*?\)\s*", " ", str(s))).strip()
def key(s): return re.sub(r"[^a-z0-9]", "", norm(s).lower())
canon = {}; names = []; idx = {}
def nid(s):
    k = key(s)
    if k not in idx:
        idx[k] = len(names); names.append(norm(s))
    return idx[k]
E = {}
for row in wb["Routes"].iter_rows(min_row=6, values_only=True):
    a, b, opt, nm = row[1], row[2], row[3], row[4]
    if not a or not b or not nm: continue
    if 'corinth' in (str(row[5] or '')+str(row[8] or '')).lower(): continue
    i, j = nid(a), nid(b)
    if i == j: continue
    k = (min(i, j), max(i, j))
    if k not in E or nm < E[k]: E[k] = int(nm)
# coordinates
def dms(s):
    m = re.findall(r"(\d+)°(\d+)'(\d+)?\"?([NSEW])", s.replace("′", "'").replace("″", '"'))
    if len(m) < 2: return None
    v = []
    for d, mi, se, h in m[:2]:
        x = int(d) + int(mi)/60 + (int(se or 0))/3600
        v.append(-x if h in "SW" else x)
    return v
coord = {}
for row in wb["Ports"].iter_rows(min_row=6, values_only=True):
    if row[0] and row[1]:
        c = dms(str(row[1]))
        if c and key(row[0]) in idx: coord[idx[key(row[0])]] = c
def gc(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    return 2*math.asin(math.sqrt(math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2))*3440.065
bad = [k for k, d in E.items() if k[0] in coord and k[1] in coord and d < 0.98*gc(coord[k[0]], coord[k[1]])]
for k in bad: del E[k]
nocoord = [k for k in E if k[0] not in coord or k[1] not in coord]
for k in nocoord: del E[k]
print("dropped impossible:", len(bad), " dropped (no position to verify):", len(nocoord))
deg = {}
for (i, j) in E: deg[i] = deg.get(i, 0)+1; deg[j] = deg.get(j, 0)+1
P = json.loads((r/"voyage/ports.json").read_text())["p"]
alias = {}
byname = {}
for i, s_ in enumerate(names): byname.setdefault(key(s_.split(",")[0]), []).append(i)
for p in P:
    best = None
    for part in re.split(r"\s*/\s*", re.sub(r"\(.*?\)", "", p[0])):
        for i in byname.get(key(part), []):
            c = coord.get(i)
            if c is None or gc((p[2], p[3]), c) < 120:
                if best is None or deg.get(i, 0) > deg.get(best[1], 0): best = (0, i)
    if best: alias[p[0]] = best[1]; continue
    for i, c in coord.items():
        d = gc((p[2], p[3]), c)
        if d < 25 and (best is None or d < best[0] or (abs(d-best[0]) < 3 and deg.get(i, 0) > deg.get(best[1], 0))): best = (d, i)
    if best: alias[p[0]] = best[1]
out = {"src": "NGA Pub. 151, 11th ed. 2001 (public domain) — digitised by kaklin/sea-routes", "n": names,
       "e": [[i, j, d] for (i, j), d in sorted(E.items())], "a": alias,
       "canal": {"Suez": [i for i, s in enumerate(names) if re.search(r"port said|suez|ismailia", s, re.I)],
                 "Panama": [i for i, s in enumerate(names) if re.search(r"cristobal|balboa|panama canal|colon, panama", s, re.I)]}}
(r/"voyage/pub151.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(names), "names,", len(E), "edges,", len(coord), "coords,", len(alias), "/", len(P), "app ports aliased")
import heapq
adj = {}
for (i, j), d in E.items(): adj.setdefault(i, []).append((j, d)); adj.setdefault(j, []).append((i, d))
def sp(a, b):
    dist = {a: 0}; pq = [(0, a)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == b: return d
        if d > dist[u]: continue
        for v, w in adj.get(u, []):
            if d+w < dist.get(v, 1e18): dist[v] = d+w; heapq.heappush(pq, (d+w, v))
    return None
T = [("Las Palmas","Preveza",1995),("Preveza","Larnaca",777),("Larnaca","Thessaloniki",700),("Rotterdam","Singapore",8288),("Santos","Qingdao",11050),
     ("Newcastle (AU)","Qingdao",4600),("Port Hedland","Qingdao",3620),("Richards Bay","Rotterdam",6780),("Houston / Galveston","Rotterdam",5030),("Vancouver","Qingdao",5200),("Piraeus / Elefsis","Rotterdam",3000),("Piraeus / Elefsis","Genoa",978)]
for a, b, k in T:
    if a in alias and b in alias:
        d = sp(alias[a], alias[b]); print(f"{a:22s}->{b:18s} pub151 {d}  ref {k}  {names[alias[a]]} / {names[alias[b]]}")
    else: print("no alias", a, b)
print("not aliased:", [p[0] for p in P if p[0] not in alias])
