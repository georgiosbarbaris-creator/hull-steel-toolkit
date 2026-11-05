# -*- coding: utf-8 -*-
"""Quality gate for World Port Index ports (run last).
For every WPI port that has route gates AND a Pub.151 link, compare the app's estimate with Pub.151
to hub ports. If the estimate is clearly too short (route would cross land) or too long, its gates are removed,
so the app uses Pub.151 (or the user's own figure) for it. Ports with neither gates nor Pub.151 are dropped."""
import json, math, heapq, pathlib, statistics
r = pathlib.Path(__file__).resolve().parent.parent
J = json.loads((r/"voyage/ports.json").read_text()); PUB = json.loads((r/"voyage/pub151.json").read_text())
N, E, P, A = J["n"], J["e"], J["p"], PUB["a"]
def gc(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    return 2*math.asin(math.sqrt(min(1, math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2)))*3440.065
adj = {}
for e in E:
    w = gc(N[e[0]], N[e[1]]); adj.setdefault(e[0], []).append((e[1], w)); adj.setdefault(e[1], []).append((e[0], w))
def node_dist(gates, xy):
    dist = {g: gc(xy, N[g]) for g in gates}; pq = [(d, g) for g, d in dist.items()]; heapq.heapify(pq)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj.get(u, []):
            if d+w < dist.get(v, 1e18): dist[v] = d+w; heapq.heappush(pq, (d+w, v))
    return dist
def est(a, b, da):
    best = min((da[g]+gc(N[g], (b[2], b[3])) for g in b[4] if g in da), default=None)
    if set(a[4]) & set(b[4]): best = min(best or 1e18, gc((a[2], a[3]), (b[2], b[3])))
    return None if best is None else best+(a[5] if len(a) > 5 else 0)+(b[5] if len(b) > 5 else 0)
padj = {}
for i, j, d in PUB["e"]: padj.setdefault(i, []).append((j, d)); padj.setdefault(j, []).append((i, d))
def pub_from(i):
    dist = {i: 0}; pq = [(0, i)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in padj.get(u, []):
            if d+w < dist.get(v, 1e18): dist[v] = d+w; heapq.heappush(pq, (d+w, v))
    return dist
HUBS = [p for p in P if p[0] in ("Rotterdam", "Singapore", "Piraeus / Elefsis", "Qingdao", "Santos", "Houston / Galveston", "Richards Bay", "Port Hedland", "Vancouver", "Gibraltar") and p[0] in A]
HD = {h[0]: pub_from(A[h[0]]) for h in HUBS}
cut, ratios, kept = 0, [], []
for p in P:
    wpi = len(p) > 6 and p[6]
    if wpi and p[4] and p[0] in A:
        da = node_dist(p[4], (p[2], p[3])); rs = []
        for h in HUBS:
            pd = HD[h[0]].get(A[p[0]]); e = est(p, h, da)
            if pd and e and pd > 200: rs.append(e/pd)
        if rs:
            m = statistics.median(rs); ratios.append(m)
            if m < 0.95 or m > 1.12: p[4] = []; cut += 1
    if wpi and not p[4] and p[0] not in A: continue
    kept.append(p)
J["p"] = kept
(r/"voyage/ports.json").write_text(json.dumps(J, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
ratios.sort()
print(f"checked {len(ratios)} WPI ports vs Pub.151: median est/pub {statistics.median(ratios):.3f}, "
      f"p10 {ratios[len(ratios)//10]:.3f}, p90 {ratios[9*len(ratios)//10]:.3f}; gates removed {cut}; ports kept {len(kept)} (dropped {len(P)-len(kept)})")
