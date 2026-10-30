"""Builds docs/risq/index.html from risq/template.html + risq/data.json"""
import pathlib
r=pathlib.Path(__file__).resolve().parent.parent
t=(r/'risq/template.html').read_text(encoding='utf-8');d=(r/'risq/data.json').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="RISQ">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#1d3a5c">'''
o=t.replace('/*DATA*/',d,1).replace('<!--PWA-->',pwa,1).replace('/*SW*/','if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});',1)
(r/'docs/risq/index.html').write_text(o,encoding='utf-8');print('docs/risq/index.html',len(o.encode()))
