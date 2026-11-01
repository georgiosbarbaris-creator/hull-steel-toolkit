"""Builds docs/attendance/index.html (installable, offline) from attendance/Attendance_Forms_2.4.html"""
import pathlib
r=pathlib.Path(__file__).resolve().parent.parent
s=(r/'attendance/Attendance_Forms_2.4.html').read_text(encoding='utf-8')
pwa='''<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="robots" content="noindex,nofollow"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Attendance"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#123d63">'''
s=s.replace('width=device-width,initial-scale=1">','width=device-width,initial-scale=1,viewport-fit=cover">',1)
i=s.index('</title>')+len('</title>');s=s[:i]+'\n'+pwa+s[i:]
j=s.rindex('</body>');s=s[:j]+'<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script>\n'+s[j:]
(r/'docs/attendance/index.html').write_text(s,encoding='utf-8');print('ok',len(s.encode()))
