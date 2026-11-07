"""EL/EN: content_en/*.txt (aligned 1:1 with content/) + i18n/ui_en*.json.
Builds docs/survival/ (Επιβίωση 72+) from survival/template.html + survival/content/*.txt
Content markup: '@@ cat|id|emoji|Title|subtitle', '## heading', '1. step', '- bullet', '! warning', '+ tip', '[ ] checklist item'"""
import pathlib,json,re
r=pathlib.Path(__file__).resolve().parent.parent
def parse(folder):
    arts=[];cur=None;ids=set()
    for f in sorted((r/folder).glob('*.txt')):
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
            b['src']=f'{f.name}:{ln}';cur['blocks'].append(b)
    return arts
arts=parse('survival/content')
# English: survival/content_en/*.txt — same cards (by id), same lines/prefixes as the Greek
en={a['id']:a for a in parse('survival/content_en')} if (r/'survival/content_en').exists() else {}
miss=[]
for a in arts:
    e=en.get(a['id'])
    if not e:miss.append(a['id']);continue
    assert [b['t'] for b in a['blocks']]==[b['t'] for b in e['blocks']],('EN block mismatch',a['id'],next(((x['src'],y['src']) for x,y in zip(a['blocks'],e['blocks']) if x['t']!=y['t']),len(a['blocks'])-len(e['blocks'])))
    a['te'],a['se']=e['title'],e['sub']
    for b,c in zip(a['blocks'],e['blocks']):b['e']=c['x']
for a in arts:
    for b in a['blocks']:b.pop('src',None)
if miss:print('WARNING: no English for',miss)
# UI strings: survival/i18n/ui_en*.json  {greek fragment: english}
ui={}
for uf in sorted((r/'survival/i18n').glob('ui_en*.json')):
    ui.update({k:v for k,v in json.loads(uf.read_text(encoding='utf-8')).items() if v})
t=(r/'survival/template.html').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Επιβίωση 72+">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#0a1522">'''
o=t.replace('/*DATA*/',json.dumps(arts,ensure_ascii=False,separators=(',',':')),1).replace('/*UI_EN*/',json.dumps(ui,ensure_ascii=False,separators=(',',':')),1).replace('<!--PWA-->',pwa,1).replace('/*SW*/','if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});',1)
assert '/*DATA*/' not in o and '/*UI_EN*/' not in o and 'serviceWorker' in o
d=r/'docs/survival';d.mkdir(exist_ok=True);(d/'index.html').write_text(o,encoding='utf-8')
from collections import Counter
print('docs/survival/index.html',len(o.encode()),'bytes,',len(arts),'cards',dict(Counter(a['cat'] for a in arts)),sum(1 for a in arts for b in a['blocks'] if b['t']=='chk'),'checklist items')
