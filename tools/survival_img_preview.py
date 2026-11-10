"""Προεπισκόπηση σχεδίων Επιβίωση 72+: python3 tools/survival_img_preview.py survival/img/now.js [--en] [--out file.png]
Φορτώνει _lib.js + το αρχείο, ζωγραφίζει όλα τα σχέδια με λεζάντα σε μια σελίδα και βγάζει PNG. Αναφέρει σφάλματα JS και άκυρα cardId/at."""
import sys,json,pathlib,asyncio,re
from playwright.async_api import async_playwright
r=pathlib.Path(__file__).resolve().parent.parent
args=[a for a in sys.argv[1:] if not a.startswith('--')];en='--en' in sys.argv
out=sys.argv[sys.argv.index('--out')+1] if '--out' in sys.argv else '/tmp/simg_preview.png'
if out in args:args.remove(out)
# κάρτες: id -> πλήθος ενοτήτων ##
H={};cur=None
for f in sorted((r/'survival/content').glob('*.txt')):
    for line in f.read_text(encoding='utf-8').splitlines():
        s=line.strip()
        if s.startswith('@@'):cur=s.split('|')[1];H[cur]=0
        elif s.startswith('## ') and cur:H[cur]+=1
js=(r/'survival/img/_lib.js').read_text(encoding='utf-8')+'\n'+'\n'.join(pathlib.Path(a).read_text(encoding='utf-8') for a in args)
html=f"""<html><body style="margin:0;background:#0d1b2a;color:#f4f6f8;font:14px system-ui;width:700px"><div id=o></div><script>const LANG={'"en"' if en else '"el"'};
window.onerror=(m,s,l)=>{{document.title='ERR '+m+' line '+l}};
{js}
const H={json.dumps(H)};let h='',bad=[];
for(const [id,L] of Object.entries(SIMG)){{if(!(id in H))bad.push('unknown card '+id);
 L.forEach((x,i)=>{{if(x.at<-1||x.at>Math.max(0,H[id]-1))bad.push(id+'#'+i+' at='+x.at+' (sections '+H[id]+')');let s='';try{{s=x.f()}}catch(e){{bad.push(id+'#'+i+' '+e.message)}}
 h+=`<div style="margin:10px;padding:8px;background:#16283d;border-radius:12px"><b>${{id}} #${{i}} (at ${{x.at}})</b><svg viewBox="0 0 320 180" style="width:100%;display:block;background:#16283d;border-radius:10px">${{s}}</svg><div style="color:#a9b8c8">${{x.c[LANG==='en'?1:0]}}</div></div>`}})}}
document.getElementById('o').innerHTML=h;document.title=bad.length?'BAD '+JSON.stringify(bad):'OK '+Object.values(SIMG).reduce((a,b)=>a+b.length,0);
</script></body></html>"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':700,'height':400});errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content(html);await pg.wait_for_timeout(300)
        print(await pg.title(),errs)
        await pg.screenshot(path=out,full_page=True);print('PNG:',out)
        await b.close()
asyncio.run(main())
