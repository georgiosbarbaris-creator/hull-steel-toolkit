"""Builds docs/voyage/index.html from voyage/template.html + voyage/ports.json (run tools/voyage_ports.py first)"""
import pathlib,shutil
r=pathlib.Path(__file__).resolve().parent.parent
t=(r/'voyage/template.html').read_text(encoding='utf-8');p=(r/'voyage/ports.json').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Voyage Calc">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#123d5e">'''
o=t.replace('/*PORTS*/',p,1).replace('<!--PWA-->',pwa,1).replace('/*SW*/','if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});',1)
d=r/'docs/voyage';d.mkdir(exist_ok=True);(d/'index.html').write_text(o,encoding='utf-8')
if not (d/'exceljs.min.js').exists():shutil.copy(r/'docs/ddbudget/exceljs.min.js',d/'exceljs.min.js')
print('docs/voyage/index.html',len(o.encode()))
