"""Builds docs/survival/ (Επιβίωση 72+) from survival/template.html + survival/content/*.txt
Content markup: '@@ cat|id|emoji|Title|subtitle', '## heading', '1. step', '- bullet', '! warning', '+ tip', '[ ] checklist item'"""
import pathlib,json,re
r=pathlib.Path(__file__).resolve().parent.parent
arts=[];cur=None;ids=set()
for f in sorted((r/'survival/content').glob('*.txt')):
    for ln,line in enumerate(f.read_text(encoding='utf-8').splitlines(),1):
        s=line.strip()
        if not s or (s.startswith('#') and not s.startswith('##')):continue
        if s.startswith('@@'):
            c,i,e,t,sub=[x.strip() for x in s[2:].split('|')]
            assert i not in ids,(f,ln,i);ids.add(i)
            cur={'cat':c,'id':i,'emoji':e,'title':t,'sub':sub,'blocks':[]};arts.append(cur);continue
        assert cur,(f,ln)
        m=re.match(r'^\d+\.\s+(.*)',s)
        if s.startswith('## '):b={'t':'h','x':s[3:]}
        elif m:b={'t':'step','x':m.group(1)}
        elif s.startswith('- '):b={'t':'li','x':s[2:]}
        elif s.startswith('! '):b={'t':'warn','x':s[2:]}
        elif s.startswith('+ '):b={'t':'tip','x':s[2:]}
        elif s.startswith('[ ] '):b={'t':'chk','x':s[4:]}
        else:raise SystemExit(f'{f.name}:{ln} unknown line: {s}')
        cur['blocks'].append(b)
t=(r/'survival/template.html').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Επιβίωση 72+">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#0a1522">'''
o=t.replace('/*DATA*/',json.dumps(arts,ensure_ascii=False,separators=(',',':')),1).replace('<!--PWA-->',pwa,1).replace('/*SW*/','if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});',1)
assert '/*DATA*/' not in o and 'serviceWorker' in o
d=r/'docs/survival';d.mkdir(exist_ok=True);(d/'index.html').write_text(o,encoding='utf-8')
from collections import Counter
print('docs/survival/index.html',len(o.encode()),'bytes,',len(arts),'cards',dict(Counter(a['cat'] for a in arts)),sum(1 for a in arts for b in a['blocks'] if b['t']=='chk'),'checklist items')
