/* Επιβίωση 72+ – native γέφυρα (iOS + Android). Created by George Barbaris
   Μπαίνει πρώτο μέσα στο index.html ΜΟΝΟ όταν η σελίδα τρέχει μέσα στην εφαρμογή iOS/Android.
   Η web έκδοση (GitHub Pages) δεν το βλέπει ποτέ.
   Δίνει στη σελίδα ό,τι δεν έχει το WebView: κοινοποίηση, αποθήκευση αρχείων, εκτύπωση,
   οθόνη ανοιχτή, ανάγνωση (Android), βαρόμετρο. */
(function () {
  if (window.NATIVE_APP) return;
  var AND = !!window.SurvivalNative;
  var IOS = !AND && !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.native);
  if (!AND && !IOS) return;
  window.NATIVE_APP = AND ? 'android' : 'ios';

  function N(cmd, a) {
    var j = JSON.stringify(a || {});
    try { if (AND) window.SurvivalNative.call(cmd, j); else window.webkit.messageHandlers.native.postMessage({ cmd: cmd, a: j }); } catch (e) {}
  }
  function b64(blob) {
    return new Promise(function (ok, no) {
      var r = new FileReader();
      r.onload = function () { var s = String(r.result); ok(s.slice(s.indexOf(',') + 1)); };
      r.onerror = no; r.readAsDataURL(blob);
    });
  }
  function sameOrigin(h) { try { return new URL(h, location.href).origin === location.origin; } catch (e) { return false; } }

  /* «Είναι στην αρχική οθόνη» – η εφαρμογή είναι πάντα εγκατεστημένη */
  try { Object.defineProperty(navigator, 'standalone', { value: true, configurable: true }); } catch (e) {}

  /* ---- Κοινοποίηση (κείμενο + αρχεία) ---- */
  navigator.canShare = function () { return true; };
  navigator.share = function (d) {
    d = d || {};
    var fs = Array.prototype.slice.call(d.files || []);
    return Promise.all(fs.map(function (f) {
      return b64(f).then(function (x) { return { name: f.name || 'file', mime: f.type || 'application/octet-stream', data: x }; });
    })).then(function (files) {
      N('share', { title: d.title || '', text: [d.text, d.url].filter(Boolean).join('\n'), files: files });
    });
  };

  /* ---- Αποθήκευση αρχείων (<a download>) ---- */
  function save(a) {
    var h = a.href, name = a.getAttribute('download') || decodeURIComponent((h.split('?')[0].split('/').pop()) || 'file');
    if (sameOrigin(h) && !/^blob:/.test(h)) { N('saveUrl', { name: name, url: new URL(h, location.href).href }); return; }
    fetch(h).then(function (r) { return r.blob(); }).then(function (b) {
      return b64(b).then(function (x) { N('save', { name: name, mime: b.type || '', data: x }); });
    }).catch(function () {});
  }
  var origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.hasAttribute('download')) { save(this); return; }
    return origClick.apply(this, arguments);
  };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[download]');
    if (a) { e.preventDefault(); e.stopImmediatePropagation(); save(a); }
  }, true);

  /* ---- Εκτύπωση / PDF ---- */
  window.print = function () { N('print', { title: document.title }); };

  /* ---- Οθόνη ανοιχτή (Wake Lock) ---- */
  var locks = 0;
  try {
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: {
      request: function () {
        locks++; N('wake', { on: true });
        var l = document.createElement('span');
        l.type = 'screen'; l.released = false;
        l.release = function () {
          if (l.released) return Promise.resolve();
          l.released = true; locks = Math.max(0, locks - 1);
          if (!locks) N('wake', { on: false });
          l.dispatchEvent(new Event('release'));
          return Promise.resolve();
        };
        return Promise.resolve(l);
      }
    } });
  } catch (e) {}


  /* ---- Βαρόμετρο (αισθητήρας πίεσης) – από την έκδοση Android 1.2 / iOS 1.1 ----
     Η σελίδα καλεί nativeBaro.start()/stop() και ακούει το event «nativebaro» {hPa, err}.
     err: 'none' = το κινητό δεν έχει βαρόμετρο, 'denied' = δεν δόθηκε άδεια (iOS Κίνηση). */
  window.nativeBaro = {
    start: function () { N('baro', { on: true }); },
    stop: function () { N('baro', { on: false }); }
  };
  window.__baro = function (hPa, err) {
    try { document.dispatchEvent(new CustomEvent('nativebaro', { detail: { hPa: hPa, err: err || '' } })); } catch (e) {}
  };

  /* ---- Ανάγνωση κειμένου (μόνο Android – στο iOS δουλεύει μόνο του) ---- */
  if (AND) {
    var q = {}, n = 0;
    window.SpeechSynthesisUtterance = function (t) { this.text = t || ''; this.lang = ''; this.rate = 1; this.pitch = 1; this.voice = null; this.onend = null; this.onerror = null; };
    var ss = {
      speaking: false, pending: false, paused: false,
      speak: function (u) { var i = 'u' + (++n); q[i] = u; ss.speaking = true; N('tts', { id: i, text: String(u.text), lang: u.lang || '', rate: u.rate || 1 }); },
      cancel: function () { q = {}; ss.speaking = false; N('ttsStop', {}); },
      pause: function () {}, resume: function () {},
      getVoices: function () { return []; },
      addEventListener: function () {}, removeEventListener: function () {}
    };
    try { Object.defineProperty(window, 'speechSynthesis', { value: ss, configurable: true }); } catch (e) { window.speechSynthesis = ss; }
    window.__ttsEnd = function (i, err) {
      var u = q[i]; delete q[i];
      if (!Object.keys(q).length) ss.speaking = false;
      if (u) { try { (err ? (u.onerror || u.onend) : u.onend) && (err ? (u.onerror || u.onend) : u.onend)({}); } catch (e) {} }
    };
  }
})();
