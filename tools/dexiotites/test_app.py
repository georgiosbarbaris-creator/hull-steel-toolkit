import asyncio, json, subprocess, time, sys
from playwright.async_api import async_playwright
import os; ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "docs")
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8765", "-d", ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
BASE = "http://localhost:8765/survival/"
data = json.load(open(ROOT + "/survival/dexiotites.json"))

async def main():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(**p.devices["iPhone 13"], locale="el-GR")
        pg = await ctx.new_page()
        pg.on("pageerror", lambda e: errs.append("pageerror " + str(e)))
        pg.on("console", lambda m: errs.append("console " + m.text) if m.type == "error" else None)
        await pg.goto(BASE); await pg.wait_for_timeout(800)
        await pg.evaluate("LS.s('terms_ok',{v:TERMS_V,t:Date.now()})"); await pg.reload(); await pg.wait_for_timeout(1500)
        await pg.screenshot(path="/tmp/t_home.png", full_page=True)
        assert await pg.locator("button[onclick=\"go('dx')\"]").count() == 1, "home tile missing"
        ver = await pg.evaluate("APP_V"); print("version", ver)
        await pg.click("button[onclick=\"go('dx')\"]"); await pg.wait_for_timeout(800)
        await pg.screenshot(path="/tmp/t_dx.png", full_page=True)
        n = 0
        for c in data["chapters"]:
            await pg.evaluate(f"go('dx/{c['ch']}')"); await pg.wait_for_timeout(60)
            cnt = await pg.locator("#m button.row, main button.row").count()
            for s in c["skills"]:
                await pg.evaluate(f"go('dx/{s['id']}')"); await pg.wait_for_timeout(30)
                ok = await pg.evaluate("""()=>{const a=document.querySelector('.dxart svg');if(!a)return 'nosvg';const r=a.getBoundingClientRect();return r.width>200&&r.height>100?'ok':'small '+r.width+'x'+r.height}""")
                st = await pg.locator(".dxst").count()
                if ok != "ok" or st != len(s["steps_el"]): errs.append(f"{s['id']}: svg {ok}, steps {st}")
                n += 1
        print("skills opened", n)
        await pg.evaluate("go('dx/fire-charcloth')"); await pg.wait_for_timeout(300)
        await pg.screenshot(path="/tmp/t_skill.png", full_page=True)
        await pg.click("text=Το έμαθα"); await pg.wait_for_timeout(200)
        done = await pg.evaluate("LS.g('dx_done',{})"); assert "fire-charcloth" in done, "mark failed"
        # search
        await pg.evaluate("go('search')"); await pg.wait_for_timeout(300)
        await pg.fill("#q", "προζύμι"); await pg.wait_for_timeout(600)
        hits = await pg.locator("#sr button[onclick*=\"dx/\"]").count(); print("search hits προζύμι", hits)
        if hits == 0: errs.append("search no dx hits")
        # PDF link reachable
        for f in ["Dexiotites_Pappou_Diamanti.pdf", "Grandpa_Diamantis_Skills.pdf"]:
            r = await pg.request.get(BASE + f); print(f, r.status, r.headers.get("content-length"))
        # existing pages still work
        for r in ["home", "cat/now", "cat/aid", "phones", "sos", "kit", "keep", "t/print", "comm", "panic", "me", "tools", "about", "legal"]:
            await pg.evaluate(f"go('{r}')"); await pg.wait_for_timeout(120)
            t = await pg.evaluate("document.querySelector('#ttl').textContent")
            if not t: errs.append("empty title " + r)
        # English
        await pg.evaluate("go('home')"); await pg.wait_for_timeout(200)
        await pg.click("#lgb"); await pg.wait_for_timeout(1200)
        await pg.evaluate("go('dx/kit-paximadi')"); await pg.wait_for_timeout(400)
        await pg.screenshot(path="/tmp/t_skill_en.png", full_page=True)
        h2 = await pg.evaluate("document.querySelector('#m h2, h2').textContent"); print("EN title:", h2)
        # offline: wait SW, then go offline and reload
        await pg.evaluate("navigator.serviceWorker.ready.then(()=>1)"); await pg.wait_for_timeout(4000)
        await ctx.set_offline(True)
        await pg.goto(BASE + "#dx/water-sodis"); await pg.wait_for_timeout(2500)
        off = await pg.evaluate("!!document.querySelector('.dxart svg')"); print("offline skill page:", off)
        if not off: errs.append("offline failed")
        await b.close()
    srv.terminate()
    print("ERRORS:", errs if errs else "none")
asyncio.run(main())
