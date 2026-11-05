"""Builds docs/risq/index.html from risq/template.html + risq/data.json"""
import pathlib
r=pathlib.Path(__file__).resolve().parent.parent
t=(r/'risq/template.html').read_text(encoding='utf-8');d=(r/'risq/data.json').read_text(encoding='utf-8');x=(r/'risq/extra.json').read_text(encoding='utf-8')
import json
P=json.loads((r/'risq/psc.json').read_text(encoding='utf-8'))
for R in P['r']:
  for k in ('n','a','c','p'):
    if isinstance(R[k],list):R[k]=R[k][:2]
  for S in R['s']:
    S['t']=S['t'][:2];S['i']=[i[:3] for i in S['i']]
psc=json.dumps(P,ensure_ascii=False,separators=(',',':'))
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="RISQ">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#1d3a5c">'''
o=t.replace('/*DATA*/',d,1).replace('/*EXTRA*/',x,1).replace('/*PSC*/',psc,1).replace('<!--PWA-->',pwa,1).replace('/*SW*/','if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});',1)
(r/'docs/risq/index.html').write_text(o,encoding='utf-8');print('docs/risq/index.html',len(o.encode()))
