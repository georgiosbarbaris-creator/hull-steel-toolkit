"""Builds docs/risqcrew/index.html (RISQ Crew: EN/Filipino, no AI, no fleet data)
from risq/data.json (base questions) + risqcrew/tr/*.json (EN + Filipino texts) + risqcrew/extra.json + risqcrew/template.html"""
import pathlib,json,sys
r=pathlib.Path(__file__).resolve().parent.parent
base=json.loads((r/'risq/data.json').read_text(encoding='utf-8'))
tr={}
for f in sorted((r/'risqcrew/tr').glob('*.json')):tr.update(json.loads(f.read_text(encoding='utf-8')))
H={'e':['WHAT IS ASKED:','FINDING WHEN:','WHAT THE INSPECTOR DOES:','REMEMBER:'],'f':['ANO ANG HINIHINGI:','KAILAN MAY FINDING:','ANO ANG GINAGAWA NG INSPECTOR:','TANDAAN:']}
def X(a,l):
  if not a or isinstance(a,str):return a or ''
  out=[H[l][0]+'\n'+a[0]]
  for i,b in enumerate(a[1:4]):
    if b:out.append(H[l][i+1]+'\n'+'\n'.join('• '+v for v in b))
  return '\n\n'.join(out)
q=[];miss=[]
for x in base['q']:
  t=tr.get(x['id'],{})
  if not t.get('eg') or not t.get('fg'):miss.append(x['id'])
  y={k:x[k] for k in ('id','s','sn','a','h','c','o') if k in x}
  if x.get('f'):y['f']=x['f']
  y['eg']=t.get('eg') or x['o']; y['ex']=X(t.get('ex'),'e')
  if t.get('fx'):t=dict(t,fx=X(t['fx'],'f'))
  for k in ('fg','fc','fx','ff'):
    if t.get(k):y[k]=t[k]
  q.append(y)
greek=[y['id'] for y in q if any('\u0370'<=ch<='\u03ff' and ch not in '\u03a9\u03bc' for ch in json.dumps({k:v for k,v in y.items() if k not in('sn',)},ensure_ascii=False))]
if greek:print('WARNING Greek text left in:',greek[:20],len(greek))
if miss:print('missing translations:',len(miss),miss[:10])
d=json.dumps({'q':q,'s1':base['s1']},ensure_ascii=False,separators=(',',':'))
x=(r/'risqcrew/extra.json').read_text(encoding='utf-8')
P=json.loads((r/'risq/psc.json').read_text(encoding='utf-8'))
for R in P['r']:
  for k in ('a','c','p'):R[k]=R[k][1:]
  if R['id']=='all':R['n']='All'
  for S in R['s']:
    S['t']=S['t'][1:];S['i']=[[i[0]]+i[2:] for i in S['i']]
psc=json.dumps(P,ensure_ascii=False,separators=(',',':'))
mjs=(r/'tools/man_js.js').read_text(encoding='utf-8')
h24=json.dumps(json.loads((r/'risq/h24.json').read_text(encoding='utf-8')),ensure_ascii=False,separators=(',',':'))
man=json.dumps(json.loads((r/'risq/manuals.json').read_text(encoding='utf-8')),ensure_ascii=False,separators=(',',':'))
t=(r/'risqcrew/template.html').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="RISQ Crew">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#0e5a5a">'''
o=t.replace('/*DATA*/',d,1).replace('/*EXTRA*/',x,1).replace('/*H24*/',h24,1).replace('/*PSC*/',psc,1).replace('/*MANJS*/',mjs,1).replace('/*MAN*/',man,1).replace('<!--PWA-->',pwa,1).replace('/*SW*/','if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});',1)
(r/'docs/risqcrew/index.html').write_text(o,encoding='utf-8');print('docs/risqcrew/index.html',len(o.encode()))
