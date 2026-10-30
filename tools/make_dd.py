"""Builds docs/dd/index.html (installable, offline) from dd/DD_Daily_Report_App_1.1.html"""
import pathlib
r=pathlib.Path(__file__).resolve().parent.parent
s=(r/'dd/DD_Daily_Report_App_1.1.html').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="DD Report">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'''
i=s.index('</title>')+len('</title>');s=s[:i]+'\n'+pwa+s[i:]
j=s.rindex('</body>');s=s[:j]+'<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script>\n'+s[j:]
(r/'docs/dd/index.html').write_text(s,encoding='utf-8');print('docs/dd/index.html',len(s.encode()))
