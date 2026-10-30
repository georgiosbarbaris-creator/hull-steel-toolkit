"""Builds docs/index.html (iPhone/web version) from the Android app page."""
import pathlib
root=pathlib.Path(__file__).resolve().parent.parent
src=(root/'app/src/main/assets/index.html').read_text(encoding='utf-8')
head='''<title>Hull Steel Toolkit</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Hull Steel">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#0F3A5C">'''
out=src.replace('<title>Hull Steel Toolkit</title>',head,1)
out=out.replace('renderAll();\n</script>','renderAll();\nif("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});\n</script>',1)
assert 'serviceWorker' in out and 'manifest' in out
(root/'docs/index.html').write_text(out,encoding='utf-8')
print('docs/index.html updated')
