"""Δοκιμή «GPS Ακριβείας» (v51) – web, προσομοίωση εφαρμογής Android (shim + ψεύτικος δέκτης), Αγγλικά, offline."""
import asyncio, subprocess, time, sys, os
from playwright.async_api import async_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs")
SHIM = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "native", "shared", "shim.js"), encoding="utf-8").read()
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8766", "-d", ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
BASE = "http://localhost:8766/survival/"

# ψεύτικο Android: κάθε 1″ θέση με θόρυβο + ένα «άλμα», βαρόμετρο που «ανεβαίνει», δορυφόροι
FAKE_ANDROID = """
window.__log=[];let gi=null,bi=null,k=0,b=0;
window.SurvivalNative={call(cmd,j){const a=JSON.parse(j);__log.push(cmd+':'+j);
 if(cmd==='gps'){if(a.on&&!gi){gi=setInterval(()=>{k++;const jump=k===6?0.01:0;
   __gps({lat:37.97151+k*0.00001+(Math.random()-.5)*0.00004+jump,lon:23.72570+(Math.random()-.5)*0.00004,acc:4+Math.random()*2,alt:120+k*0.5,altAcc:6,spd:1.2,hd:0,t:Date.now(),src:'gps'},'');
   if(k%2==0)__gnss({n:28,u:19,l5:true,s:[[1,5,38,60,45,1,1],[6,12,41,35,120,1,1],[3,7,30,20,250,1,0],[5,22,25,10,300,0,0],[1,9,33,75,200,1,0]]});
   if(k===3)__gnssFix(23000)},1000)}
  if(!a.on&&gi){clearInterval(gi);gi=null}}
 if(cmd==='baro'){if(a.on&&!bi){bi=setInterval(()=>{b++;__baro(1000-b*0.06,'')},700)}if(!a.on&&bi){clearInterval(bi);bi=null}}}};
"""

async def main():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()

        async def page(ctx, tag):
            pg = await ctx.new_page()
            pg.on("pageerror", lambda e: errs.append(tag + " pageerror " + str(e)))
            pg.on("console", lambda m: errs.append(tag + " console " + m.text) if m.type == "error" else None)
            pg.on("dialog", lambda d: asyncio.ensure_future(d.accept("Αυτοκίνητο" if d.type == "prompt" else None)))
            await pg.goto(BASE); await pg.wait_for_timeout(600)
            await pg.evaluate("LS.s('terms_ok',{v:TERMS_V,t:Date.now()})"); await pg.reload(); await pg.wait_for_timeout(1200)
            return pg

        # ---------- 1. Web (iPhone Safari) ----------
        ctx = await b.new_context(**p.devices["iPhone 13"], locale="el-GR", permissions=["geolocation"],
                                  geolocation={"latitude": 37.97151, "longitude": 23.72570, "accuracy": 8})
        pg = await page(ctx, "web")
        print("version", await pg.evaluate("APP_V"))
        assert await pg.locator("button[onclick=\"go('gps')\"]").count() >= 1, "home tile missing"
        await pg.click("button.tile[onclick=\"go('gps')\"]"); await pg.wait_for_timeout(2500)
        await pg.screenshot(path="/tmp/g_web.png", full_page=True)
        st = await pg.inner_text("#gfst"); print("web status:", st.replace("\n", " | ")[:200])
        if "±" not in st: errs.append("web: no accuracy")
        for f in ["dd", "dmm", "dms", "utm", "mgrs", "egsa"]:
            await pg.evaluate(f"gfSetF('{f}')"); await pg.wait_for_timeout(150)
            print(" ", f, (await pg.inner_text("#gfpos")).replace("\n", " "))
        mg = await pg.evaluate("gfFmt('mgrs',37.97151,23.7257)"); assert mg == "34S GH 39423 06159", mg
        # σημείο με μέσο όρο
        n0 = await pg.evaluate("LS.g('wps',[]).length")
        await pg.evaluate("gfAvgStart()")
        for i in range(6):
            await ctx.set_geolocation({"latitude": 37.97151 + i * 1e-6, "longitude": 23.72570, "accuracy": 6}); await pg.wait_for_timeout(400)
        await pg.screenshot(path="/tmp/g_avg.png", full_page=True)
        await pg.evaluate("gfAvgSave()"); await pg.wait_for_timeout(500)
        w = await pg.evaluate("LS.g('wps',[])"); print("waypoints", n0, "->", len(w), w[-1] if w else None)
        if len(w) != n0 + 1: errs.append("averaging did not save")
        # go-to
        await pg.evaluate("setTgt(LS.g('wps',[]).length-1);go('gps')"); await pg.wait_for_timeout(1200)
        if "➡️" not in await pg.inner_text("#gfgo"): errs.append("goto card missing")
        await pg.evaluate("go('compass')"); await pg.wait_for_timeout(800)
        if await pg.locator("button[onclick=\"go('gps')\"]").count() != 1: errs.append("compass link missing")
        # τα παλιά δουλεύουν
        for r in ["home", "cat/now", "cat/aid", "phones", "sos", "panic", "kit", "keep", "t/print", "comm", "me", "tools", "about", "legal", "compass", "t/back", "wx", "t/gps"]:
            await pg.evaluate(f"go('{r}')"); await pg.wait_for_timeout(150)
            if not await pg.evaluate("document.querySelector('#ttl').textContent"): errs.append("empty title " + r)
        # Αγγλικά
        await pg.evaluate("go('home')"); await pg.wait_for_timeout(200)
        await pg.click("#lgb"); await pg.wait_for_timeout(1000)
        await pg.evaluate("go('gps')"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path="/tmp/g_en.png", full_page=True)
        print("EN title:", await pg.evaluate("document.querySelector('#ttl').textContent"))
        await pg.click("#lgb"); await pg.wait_for_timeout(600)
        # offline
        await pg.evaluate("navigator.serviceWorker.ready.then(()=>1)"); await pg.wait_for_timeout(3500)
        await ctx.set_offline(True); await pg.reload(); await pg.wait_for_timeout(1500)
        await pg.evaluate("go('gps')"); await pg.wait_for_timeout(1500)
        print("offline title:", await pg.evaluate("document.querySelector('#ttl').textContent"), "APP_V", await pg.evaluate("APP_V"))
        await ctx.close()

        # ---------- 2. Εφαρμογή Android (shim + ψεύτικος δέκτης) ----------
        ctx = await b.new_context(**p.devices["Pixel 7"], locale="el-GR")
        await ctx.add_init_script(FAKE_ANDROID + "\n" + SHIM)
        pg = await page(ctx, "android")
        print("NATIVE_APP", await pg.evaluate("window.NATIVE_APP"), "nativeGps", await pg.evaluate("!!window.nativeGps"))
        await pg.evaluate("go('gps')"); await pg.wait_for_timeout(9000)
        await pg.screenshot(path="/tmp/g_android.png", full_page=True)
        print("android status:", (await pg.inner_text("#gfst")).replace("\n", " | ")[:250])
        print("android alt:", (await pg.inner_text("#gfal")).replace("\n", " | "))
        print("android sat:", (await pg.inner_text("#gfsat")).replace("\n", " | ")[:250])
        print("rejected:", await pg.evaluate("GF.rej"), "baro live:", await pg.evaluate("gfBaroLive()"))
        if await pg.evaluate("GF.rej") < 1: errs.append("jump not rejected")
        if not await pg.evaluate("gfBaroLive()"): errs.append("baro fusion not live")
        if "19 / 28" not in await pg.inner_text("#gfsat"): errs.append("sats not shown")
        # SOS «Είμαι καλά» παίρνει θέση από τον ψεύτικο δέκτη
        f = await pg.evaluate("new Promise(r=>fixNow(r))"); print("fixNow via native:", f)
        if not f or abs(f["lat"] - 37.9715) > 0.01: errs.append("fixNow native failed")
        await pg.evaluate("go('home')"); await pg.wait_for_timeout(1500)
        log = await pg.evaluate("__log.slice(-4)"); print("bridge log tail:", log)
        if not any("gps:{\"on\":false}" in x for x in log): errs.append("gps not stopped after leaving page")
        # άρνηση άδειας
        await pg.evaluate("go('gps')"); await pg.wait_for_timeout(800)
        await pg.evaluate("SurvivalNative.call('gps','{\"on\":false}');__gps(null,'denied')"); await pg.wait_for_timeout(300)
        if "άδεια" not in await pg.inner_text("#gfst"): errs.append("denied msg missing")
        await pg.screenshot(path="/tmp/g_denied.png", full_page=True)
        await ctx.close(); await b.close()
    srv.terminate()
    print("ERRORS:", errs if errs else "none")
    return 1 if errs else 0

sys.exit(asyncio.run(main()))
