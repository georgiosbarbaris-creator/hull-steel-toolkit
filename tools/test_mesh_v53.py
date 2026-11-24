"""Δοκιμή «Μηνύματα Bluetooth» (v53): 4 ψεύτικα κινητά Android σε αλυσίδα A–B–C, ο D έρχεται αργότερα δίπλα στον C.
Ελέγχει: αλυσίδα (TTL), διπλότυπα, οικογένεια κρυπτογραφημένη (ο B μεταφέρει αλλά δεν διαβάζει), SOS με μπάρα,
αποθήκευση-προώθηση στον D, web χωρίς εφαρμογή, Αγγλικά, χωρίς σφάλματα."""
import asyncio, subprocess, time, sys, os, json
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "docs")
SHIM = open(os.path.join(HERE, "..", "native", "shared", "shim.js"), encoding="utf-8").read()
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8767", "-d", ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
BASE = "http://localhost:8767/survival/"
FAKE = """window.SurvivalNative={call(cmd,j){const a=JSON.parse(j);
 if(cmd==='mesh'){window.bleCtl(a.on?'on':'off')}
 if(cmd==='meshSend'){window.bleOut(a.data)}
 if(cmd==='gps'&&a.on){setTimeout(()=>__gps({lat:37.80+Math.random()*0.001,lon:23.93,acc:5,t:Date.now(),src:'gps'},''),50)}}};"""
LINKS = {"A": ["B"], "B": ["A", "C"], "C": ["B"], "D": []}
pages, on, errs, sent = {}, {}, [], []

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        async def deliver(dst, data, frm):
            if on.get(dst):
                await pages[dst].evaluate("([d,f])=>__mesh(d,f)", [data, frm])

        async def mk(name):
            ctx = await b.new_context(**p.devices["Pixel 7"], locale="el-GR", permissions=["geolocation"])
            await ctx.add_init_script(FAKE + "\n" + SHIM)
            pg = await ctx.new_page()
            pages[name] = pg
            pg.on("pageerror", lambda e: errs.append(name + " pageerror " + str(e)))
            pg.on("console", lambda m: errs.append(name + " console " + m.text) if m.type == "error" else None)
            pg.on("dialog", lambda d: asyncio.ensure_future(d.accept("χρειαζόμαστε νερό" if d.type == "prompt" else None)))

            async def out(source, data):
                sent.append((name, data))
                for n in LINKS[name]:
                    await deliver(n, data, name)

            async def ctl(source, s):
                on[name] = s == "on"
                if s == "on":
                    n = len([x for x in LINKS[name] if on.get(x)])
                    await pg.evaluate("n=>{__meshState('on',n);__meshPeer()}", n)
            await pg.expose_binding("bleOut", out)
            await pg.expose_binding("bleCtl", ctl)
            await pg.goto(BASE); await pg.wait_for_timeout(500)
            await pg.evaluate(f"LS.s('terms_ok',{{v:TERMS_V,t:Date.now()}});LS.s('msname','Κινητό {name}')")
            await pg.reload(); await pg.wait_for_timeout(900)
            return pg

        for n in "ABC":
            await mk(n)
        A, B, C = pages["A"], pages["B"], pages["C"]
        print("tile on home (A):", await A.locator("button[onclick=\"go('mesh')\"]").count())
        for n in "ABC":
            await pages[n].evaluate("go('mesh')"); await pages[n].wait_for_timeout(300)
            await pages[n].click("#mstg button"); await pages[n].wait_for_timeout(300)
        await A.wait_for_timeout(2500)
        print("A state:", await A.inner_text("#msst"))
        # 1. αλυσίδα
        await A.fill("#mstxt", "Γεια από τον A – δοκιμή αλυσίδας")
        await A.click("text=📤 Στείλε"); await A.wait_for_timeout(1500)
        hc = await C.evaluate("LS.g('mshist',[]).map(m=>[m.n,m.x,m.h])"); print("C history:", hc)
        if not any(x[1] and "αλυσίδας" in x[1] and x[2] == 2 for x in hc): errs.append("chain A→B→C failed")
        cnt = await C.evaluate("LS.g('mshist',[]).filter(m=>m.x&&m.x.includes('αλυσίδας')).length")
        if cnt != 1: errs.append(f"duplicate at C: {cnt}")
        # 2. οικογένεια: A και C έχουν κωδικό, B όχι
        for n in "AC":
            await pages[n].evaluate("LS.s('mscode','Σπίτι-Λαγονήσι-1985');msKeys(()=>msCh('fam'))"); await pages[n].wait_for_timeout(600)
        await A.fill("#mstxt", "Μυστικό οικογένειας: είμαστε στο πάρκο")
        await A.click("text=📤 Στείλε"); await A.wait_for_timeout(1500)
        cf = await C.evaluate("LS.g('mshist',[]).filter(m=>m.ch==='fam').map(m=>m.x)")
        bf = await B.evaluate("JSON.stringify(LS.g('mshist',[]))")
        bfw = await B.evaluate("JSON.stringify(LS.g('msfwd',[]))")
        print("C family:", cf, "| B can read:", "πάρκο" in bf, "| B carries encrypted:", '"g":' in bfw)
        if not any("πάρκο" in (x or "") for x in cf): errs.append("family msg not decrypted at C")
        if "πάρκο" in bf or "πάρκο" in bfw: errs.append("B could read family msg!")
        # 3. SOS από C → μπάρα στον A
        await C.evaluate("msCh('all')")
        await C.click("text=🆘 SOS"); await C.wait_for_timeout(2500)
        al = await A.locator("#msalarm").count(); print("A SOS banner:", al, (await A.inner_text("#msalarm")).replace("\n", " ")[:160] if al else "")
        if not al: errs.append("SOS banner missing at A")
        await A.screenshot(path="/tmp/m_A.png", full_page=True)
        # 4. ο D έρχεται αργότερα δίπλα στον C → παίρνει τα πρόσφατα
        D = await mk("D"); LINKS["D"] = ["C"]; LINKS["C"] = ["B", "D"]
        await D.evaluate("go('mesh')"); await D.wait_for_timeout(300); await D.click("#mstg button"); await D.wait_for_timeout(500)
        await C.evaluate("__meshPeer()"); await D.wait_for_timeout(4000)
        hd = await D.evaluate("LS.g('mshist',[]).map(m=>m.k+':'+(m.x||''))"); print("D got (store&forward):", hd)
        if not any(x.startswith("sos") for x in hd): errs.append("D did not get SOS via store&forward")
        if not any("αλυσίδας" in x for x in hd): errs.append("D did not get old message")
        print("D SOS banner:", await D.locator("#msalarm").count())
        # 5. Είμαι καλά + Αγγλικά
        await B.evaluate("document.querySelectorAll('#msalarm').forEach(x=>x.remove())")
        await B.click("text=✅ Είμαι καλά"); await B.wait_for_timeout(1200)
        await B.evaluate("go('home')"); await B.wait_for_timeout(300); await B.click("#lgb"); await B.wait_for_timeout(800)
        await B.evaluate("go('mesh')"); await B.wait_for_timeout(800)
        print("EN title:", await B.evaluate("document.querySelector('#ttl').textContent"))
        await B.screenshot(path="/tmp/m_B_en.png", full_page=True)
        await C.screenshot(path="/tmp/m_C.png", full_page=True)
        print("frames sent:", len(sent))
        # 6. web χωρίς εφαρμογή
        ctx = await b.new_context(**p.devices["iPhone 13"], locale="el-GR")
        w = await ctx.new_page(); w.on("pageerror", lambda e: errs.append("web pageerror " + str(e)))
        await w.goto(BASE); await w.wait_for_timeout(400); await w.evaluate("LS.s('terms_ok',{v:TERMS_V,t:Date.now()})"); await w.reload(); await w.wait_for_timeout(900)
        print("web tile:", await w.locator("button[onclick=\"go('mesh')\"]").count())
        for r in ["home", "comm", "tools", "mesh", "gps", "sos", "compass"]:
            await w.evaluate(f"go('{r}')"); await w.wait_for_timeout(200)
        await b.close()
    srv.terminate()
    print("ERRORS:", errs if errs else "none")

asyncio.run(main())
