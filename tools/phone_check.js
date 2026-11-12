#!/usr/bin/env node
// Έλεγχος εφαρμογών σε "κινητό" (εξομοίωση Android + iPhone με Chromium/Playwright).
// Χρήση:
//   node tools/phone_check.js                 -> όλες οι εφαρμογές του docs/ (τοπικά)
//   node tools/phone_check.js survival voyage -> μόνο αυτές
//   node tools/phone_check.js --live          -> τη δημοσιευμένη έκδοση (GitHub Pages)
//   node tools/phone_check.js --out <φάκελος> -> πού γράφονται report + screenshots
// Ελέγχει: φόρτωση, σφάλματα JS, αρχεία που λείπουν (404), οριζόντιο scroll,
// manifest/εικονίδια (εγκατάσταση PWA), service worker, άνοιγμα χωρίς internet (offline).
'use strict';
const { chromium, devices } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'docs');
const LIVE = 'https://georgiosbarbaris-creator.github.io/hull-steel-toolkit/';
const PHONES = [
  { name: 'Android', dev: devices['Pixel 7'] },
  { name: 'iPhone', dev: devices['iPhone 15'] },
];
const args = process.argv.slice(2);
const live = args.includes('--live');
const oi = args.indexOf('--out');
const OUT = path.resolve(oi >= 0 ? args[oi + 1] : 'phone-check');
const picked = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');

const apps = ['.', ...fs.readdirSync(ROOT).filter(d =>
  fs.existsSync(path.join(ROOT, d, 'index.html')))].filter(a =>
  !picked.length || picked.includes(a === '.' ? 'home' : a));

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.otf': 'font/otf', '.woff': 'font/woff', '.webp': 'image/webp', '.gif': 'image/gif', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.css': 'text/css', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

function serve() {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      let f = path.join(ROOT, p);
      if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!fs.existsSync(f)) { r.writeHead(404); return r.end('404'); }
      r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(r);
    }).listen(0, '127.0.0.1', () => res(s));
  });
}

async function checkApp(browser, base, app, phone) {
  const url = new URL(app === '.' ? './' : app + '/', base).href;
  const label = app === '.' ? 'home' : app;
  const ctx = await browser.newContext({ ...phone.dev, serviceWorkers: 'allow' });
  const page = await ctx.newPage();
  const r = { app: label, phone: phone.name, issues: [], notes: [] };
  const origin = new URL(base).origin;
  page.on('pageerror', e => r.issues.push('JS: ' + String(e.message).split('\n')[0].slice(0, 160)));
  page.on('console', m => { if (m.type() === 'error') {
    const t = m.text();
    if (!/Failed to load resource/.test(t)) r.issues.push('console: ' + t.slice(0, 160)); } });
  page.on('response', resp => { const u = resp.url();
    if (resp.status() >= 400 && u.startsWith(origin)) r.issues.push(`${resp.status()}: ${u.replace(origin, '')}`); });
  page.on('requestfailed', q => { const u = q.url();
    if (!u.startsWith(origin) && !/^data:|^blob:/.test(u)) r.notes.push('εξωτερικό δεν φόρτωσε: ' + new URL(u).host); });

  try {
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    r.status = resp && resp.status();
    r.loadMs = Date.now() - t0;
    await page.waitForTimeout(1200);
    const info = await page.evaluate(async () => {
      const de = document.documentElement;
      const vw = window.innerWidth;
      const wide = [...document.querySelectorAll('body *')].filter(e => {
        const b = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return b.width > 0 && b.right > vw + 2 && cs.position !== 'fixed' && !e.closest('[style*="overflow"], pre, table, .scroll');
      }).slice(0, 3).map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''));
      const man = document.querySelector('link[rel=manifest]');
      let manifest = null;
      if (man) { try { manifest = await (await fetch(man.href)).json(); } catch (e) { manifest = 'invalid'; } }
      return {
        title: document.title, overflow: de.scrollWidth - de.clientWidth, wide,
        viewport: !!document.querySelector('meta[name=viewport]'),
        hasManifest: !!man, manifest,
        textLen: (document.body && document.body.innerText || '').trim().length,
      };
    });
    r.title = info.title;
    if (r.status !== 200) r.issues.push('HTTP ' + r.status);
    if (!info.viewport) r.issues.push('λείπει meta viewport (δεν προσαρμόζεται στο κινητό)');
    if (info.textLen < 20) r.issues.push('η σελίδα φαίνεται άδεια');
    if (info.overflow > 4) r.issues.push(`βγαίνει έξω από την οθόνη ${info.overflow}px (οριζόντιο scroll) ${info.wide.join(', ')}`);
    if (!info.hasManifest) r.notes.push('χωρίς manifest (δεν μπαίνει ως εφαρμογή)');
    else if (info.manifest === 'invalid') r.issues.push('manifest χαλασμένο');
    else {
      const icons = (info.manifest.icons || []).map(i => i.src);
      for (const ic of icons) {
        const ok = await page.evaluate(async u => { try { return (await fetch(u)).ok; } catch (e) { return false; } },
          new URL(ic, new URL('manifest.webmanifest', url)).href);
        if (!ok) r.issues.push('εικονίδιο λείπει: ' + ic);
      }
    }
    // Service worker + offline
    const sw = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return 'no-api';
      const reg = await Promise.race([navigator.serviceWorker.ready.then(() => 'ok'), new Promise(s => setTimeout(() => s('none'), 6000))]);
      return reg;
    });
    r.sw = sw;
    if (sw === 'ok') {
      await page.waitForTimeout(1500);
      await page.reload({ waitUntil: 'load' }).catch(() => {});
      await ctx.setOffline(true);
      try {
        await page.reload({ waitUntil: 'load', timeout: 15000 });
        const len = await page.evaluate(() => (document.body && document.body.innerText || '').trim().length);
        r.offline = len > 20 ? 'ok' : 'άδεια σελίδα';
      } catch (e) { r.offline = 'ΔΕΝ ανοίγει'; }
      await ctx.setOffline(false);
      if (r.offline !== 'ok') r.issues.push('offline: ' + r.offline);
    } else r.notes.push('χωρίς service worker (δεν δουλεύει offline)');

    const shot = path.join(OUT, `${label}_${phone.name}.jpg`);
    await page.reload({ waitUntil: 'load' }).catch(() => {});
    await page.waitForTimeout(600);
    await page.screenshot({ path: shot, type: 'jpeg', quality: 45 });
    r.shot = path.basename(shot);
  } catch (e) {
    r.issues.push('ΔΕΝ ΦΟΡΤΩΝΕΙ: ' + String(e.message).split('\n')[0]);
  }
  r.issues = [...new Set(r.issues)]; r.notes = [...new Set(r.notes)];
  await ctx.close();
  return r;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let server, base = LIVE;
  if (!live) { server = await serve(); base = `http://127.0.0.1:${server.address().port}/`; }
  const browser = await chromium.launch();
  const results = [];
  for (const app of apps) for (const ph of PHONES) {
    const r = await checkApp(browser, base, app, ph);
    results.push(r);
    console.log(`${r.issues.length ? '✗' : '✓'} ${r.app.padEnd(10)} ${r.phone.padEnd(8)} ${r.issues.length ? r.issues.join(' | ') : 'OK'}`);
  }
  await browser.close();
  if (server) server.close();

  const rows = results.map(r => `| ${r.app} | ${r.phone} | ${r.issues.length ? '❌' : '✅'} | ${r.loadMs ?? '-'} ms | ${r.offline || (r.sw === 'ok' ? '?' : '—')} | ${r.issues.join('<br>') || '—'} | ${r.notes.join('<br>') || ''} |`);
  const md = `# Έλεγχος εφαρμογών σε κινητό\n\nΠηγή: ${live ? LIVE : 'τοπικά (docs/)'} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC\n` +
    `Εξομοίωση: Pixel 7 (Android) + iPhone 15 — μηχανή Chromium.\n\n` +
    `| App | Κινητό | Κατάσταση | Φόρτωση | Offline | Προβλήματα | Σημειώσεις |\n|---|---|---|---|---|---|---|\n${rows.join('\n')}\n`;
  fs.writeFileSync(path.join(OUT, 'report.md'), md);
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.issues.length).length;
  console.log(`\n${results.length - bad}/${results.length} OK · report: ${path.join(OUT, 'report.md')}`);
  process.exitCode = bad ? 1 : 0;
})();
