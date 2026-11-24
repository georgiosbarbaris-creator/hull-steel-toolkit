package gr.barbaris.survival72;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ContentValues;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.GnssStatus;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Handler;
import android.os.Looper;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Base64;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.widget.FrameLayout;
import androidx.core.content.FileProvider;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Επιβίωση 72+ / Survival 72+ – Android.  Created by George Barbaris
 *
 * Η εφαρμογή ανοίγει την ΙΔΙΑ σελίδα με το web (GitHub Pages, docs/survival) στη δική της διεύθυνση,
 * ώστε οι αναβαθμίσεις του site να έρχονται μόνες τους:
 *   1. Με internet: φέρνει τη νέα έκδοση (περιμένει έως 3,5″ – με αδύναμο σήμα ανοίγει αμέσως το αποθηκευμένο).
 *   2. Χωρίς internet: την τελευταία που έχει κατεβάσει.
 *   3. Πρώτη φορά χωρίς internet: το αντίγραφο που είναι μέσα στο APK.
 * Η native γέφυρα (shared/shim.js) μπαίνει μόνο εδώ, ποτέ στο site.
 */
public class MainActivity extends Activity {
    static final String HOST = "georgiosbarbaris-creator.github.io";
    static final String PREFIX = "/hull-steel-toolkit/survival/";
    static final String BASE = "https://" + HOST + PREFIX;
    static final long WAIT_MS = 3500;

    private static final int REQ_FILE = 41, REQ_GEO = 51, REQ_MEDIA = 52, REQ_GPS = 53, REQ_BLE = 54;

    private WebView web;
    private File liveDir;
    private String shim = "";
    private final ExecutorService net = Executors.newFixedThreadPool(3);
    private final Set<String> checked = Collections.synchronizedSet(new HashSet<>());
    private final Map<String, Future<?>> inflight = new HashMap<>();

    private ValueCallback<Uri[]> filePending;
    private Uri cameraUri;
    private GeolocationPermissions.Callback geoCb;
    private String geoOrigin;
    private PermissionRequest mediaReq;

    private TextToSpeech tts;
    private boolean ttsReady;
    private final List<String[]> ttsQueue = new ArrayList<>();

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        liveDir = new File(getFilesDir(), "live");
        resetCacheOnUpgrade();
        try { shim = new String(readAll(getAssets().open("shim.js")), StandardCharsets.UTF_8); } catch (Exception ignored) {}

        web = new WebView(this);
        web.setBackgroundColor(0xFF0A1522);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        s.setUserAgentString(s.getUserAgentString() + " Survival72App/Android");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (!"GET".equalsIgnoreCase(req.getMethod()) || !isApp(u)) return null;
                return serve(relOf(u));
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (isApp(u)) return false;
                openExternal(u.toString());
                return true;
            }
        });
        web.setWebChromeClient(new Chrome());
        web.setDownloadListener((url, ua, cd, mime, len) -> {
            Uri u = Uri.parse(url);
            if (isApp(u)) saveAsset(relOf(u), u.getLastPathSegment());
            else openExternal(url);
        });
        web.addJavascriptInterface(new Bridge(), "SurvivalNative");

        // Android 15+: η εφαρμογή απλώνεται κάτω από τις μπάρες – κρατάμε τη σελίδα μέσα στο ορατό κομμάτι
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF0A1522);
        root.addView(web, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowCompat.getInsetsController(getWindow(), root).setAppearanceLightStatusBars(false);
        WindowCompat.getInsetsController(getWindow(), root).setAppearanceLightNavigationBars(false);
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, wi) -> {
            Insets b = wi.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout() | WindowInsetsCompat.Type.ime());
            v.setPadding(b.left, b.top, b.right, b.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
        setContentView(root);

        // «Πίσω» (Android 13+ με predictive back): πρώτα πίσω στη σελίδα, μετά έξοδος
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                    () -> { if (web.canGoBack()) web.goBack(); else finish(); });
        }

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(BASE);
    }

    // ------------------------------------------------------------------ περιεχόμενο (online → cache → APK)

    static boolean isApp(Uri u) {
        return u != null && "https".equals(u.getScheme()) && HOST.equals(u.getHost())
                && u.getPath() != null && (u.getPath() + "/").startsWith(PREFIX);
    }

    static String relOf(Uri u) {
        String p = u.getPath() == null ? "" : u.getPath();
        String r = p.length() >= PREFIX.length() ? p.substring(PREFIX.length()) : "";
        if (r.isEmpty() || r.endsWith("/")) r += "index.html";
        return r;
    }

    private void resetCacheOnUpgrade() {
        SharedPreferences sp = getSharedPreferences("native", MODE_PRIVATE);
        long v = 0;
        try {
            v = Build.VERSION.SDK_INT >= 28 ? getPackageManager().getPackageInfo(getPackageName(), 0).getLongVersionCode()
                    : getPackageManager().getPackageInfo(getPackageName(), 0).versionCode;
        } catch (Exception ignored) {}
        if (sp.getLong("ver", -1) != v) { deleteTree(liveDir); sp.edit().putLong("ver", v).apply(); }
        liveDir.mkdirs();
    }

    private File liveFile(String rel) {
        if (rel.contains("..")) return null;
        return new File(liveDir, rel);
    }

    private boolean inApk(String rel) {
        try (InputStream in = getAssets().open(rel)) { return true; } catch (Exception e) { return false; }
    }

    /** Κατεβάζει από το site. 200 → γράφει στην cache, 304 → η cache ισχύει. */
    private void fetch(String rel) {
        File f = liveFile(rel);
        if (f == null) return;
        File tag = new File(f.getPath() + ".etag");
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) new URL(BASE + rel).openConnection();
            c.setConnectTimeout(8000);
            c.setReadTimeout(20000);
            c.setRequestProperty("Cache-Control", "no-cache");
            if (f.exists() && tag.exists()) c.setRequestProperty("If-None-Match", new String(readAll(new FileInputStream(tag)), StandardCharsets.UTF_8));
            int code = c.getResponseCode();
            if (code == 200) {
                f.getParentFile().mkdirs();
                File tmp = new File(f.getPath() + ".tmp");
                try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(tmp)) { copy(in, out); }
                if (!tmp.renameTo(f)) { f.delete(); tmp.renameTo(f); }
                String et = c.getHeaderField("ETag");
                if (et != null) try (OutputStream o = new FileOutputStream(tag)) { o.write(et.getBytes(StandardCharsets.UTF_8)); }
                else tag.delete();
            }
            if (code == 200 || code == 304) checked.add(rel);
        } catch (Exception ignored) {
        } finally { if (c != null) c.disconnect(); }
    }

    private WebResourceResponse serve(String rel) {
        if ("sw.js".equals(rel)) return resp("text/plain", 404, new byte[0]); // η εφαρμογή κάνει μόνη της το offline
        File f = liveFile(rel);
        if (f == null) return resp("text/plain", 404, new byte[0]);
        if (!checked.contains(rel)) {
            Future<?> job;
            synchronized (inflight) {
                job = inflight.get(rel);
                if (job == null || job.isDone()) { job = net.submit(() -> fetch(rel)); inflight.put(rel, job); }
            }
            boolean have = f.exists() || inApk(rel);
            try { job.get(have ? WAIT_MS : 60000, TimeUnit.MILLISECONDS); } catch (Exception ignored) {}
        }
        try {
            byte[] b = f.exists() ? readAll(new FileInputStream(f)) : readAll(getAssets().open(rel));
            if (rel.equals("index.html")) b = inject(b);
            return resp(mime(rel), 200, b);
        } catch (Exception e) {
            return resp("text/plain", 404, new byte[0]);
        }
    }

    private byte[] bytesOf(String rel) throws Exception {
        File f = liveFile(rel);
        return (f != null && f.exists()) ? readAll(new FileInputStream(f)) : readAll(getAssets().open(rel));
    }

    private byte[] inject(byte[] html) {
        if (shim.isEmpty()) return html;
        String h = new String(html, StandardCharsets.UTF_8);
        String tag = "<script>" + shim + "</script>";
        int i = h.toLowerCase(Locale.ROOT).indexOf("<head>");
        h = i >= 0 ? h.substring(0, i + 6) + tag + h.substring(i + 6) : tag + h;
        return h.getBytes(StandardCharsets.UTF_8);
    }

    private static WebResourceResponse resp(String mime, int code, byte[] b) {
        Map<String, String> hd = new HashMap<>();
        hd.put("Cache-Control", "no-store");
        hd.put("Access-Control-Allow-Origin", "*");
        boolean text = mime.startsWith("text/") || mime.contains("javascript") || mime.contains("json") || mime.contains("xml");
        return new WebResourceResponse(mime, text ? "utf-8" : null, code, code == 200 ? "OK" : "Not Found", hd, new ByteArrayInputStream(b));
    }

    static String mime(String name) {
        String n = name.toLowerCase(Locale.ROOT);
        if (n.endsWith(".html")) return "text/html";
        if (n.endsWith(".js")) return "application/javascript";
        if (n.endsWith(".json")) return "application/json";
        if (n.endsWith(".webmanifest")) return "application/manifest+json";
        if (n.endsWith(".css")) return "text/css";
        if (n.endsWith(".pdf")) return "application/pdf";
        if (n.endsWith(".ics")) return "text/calendar";
        if (n.endsWith(".svg")) return "image/svg+xml";
        if (n.endsWith(".txt")) return "text/plain";
        String g = URLConnection.guessContentTypeFromName(n);
        return g != null ? g : "application/octet-stream";
    }

    // ------------------------------------------------------------------ άδειες (θέση, κάμερα, μικρόφωνο), αρχεία

    private boolean has(String p) { return checkSelfPermission(p) == PackageManager.PERMISSION_GRANTED; }

    private class Chrome extends WebChromeClient {
        @Override
        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback cb) {
            if (has(Manifest.permission.ACCESS_FINE_LOCATION) || has(Manifest.permission.ACCESS_COARSE_LOCATION)) { cb.invoke(origin, true, false); return; }
            geoCb = cb; geoOrigin = origin;
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_GEO);
        }

        @Override
        public void onPermissionRequest(PermissionRequest r) {
            runOnUiThread(() -> {
                List<String> need = new ArrayList<>();
                for (String res : r.getResources()) {
                    if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(res) && !has(Manifest.permission.CAMERA)) need.add(Manifest.permission.CAMERA);
                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(res) && !has(Manifest.permission.RECORD_AUDIO)) need.add(Manifest.permission.RECORD_AUDIO);
                }
                if (need.isEmpty()) { r.grant(r.getResources()); return; }
                if (mediaReq != null) mediaReq.deny();
                mediaReq = r;
                requestPermissions(need.toArray(new String[0]), REQ_MEDIA);
            });
        }

        @Override
        public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
            if (filePending != null) filePending.onReceiveValue(null);
            filePending = cb;
            cameraUri = null;
            boolean image = false;
            for (String a : p.getAcceptTypes()) if (a != null && a.startsWith("image")) image = true;
            Intent pick = p.createIntent();
            pick.addCategory(Intent.CATEGORY_OPENABLE);
            if (p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) pick.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
            Intent chooser = Intent.createChooser(pick, null);
            if (image && has(Manifest.permission.CAMERA)) {
                try {
                    File dir = new File(getCacheDir(), "cam"); dir.mkdirs();
                    File f = new File(dir, "photo_" + System.currentTimeMillis() + ".jpg");
                    cameraUri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                    Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    cam.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
                    cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    cam.setClipData(ClipData.newRawUri("", cameraUri));
                    if (p.isCaptureEnabled()) chooser = cam;
                    else chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{cam});
                } catch (Exception e) { cameraUri = null; }
            }
            try { startActivityForResult(chooser, REQ_FILE); return true; }
            catch (Exception e) { filePending = null; return false; }
        }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        boolean any = false;
        for (int r : res) if (r == PackageManager.PERMISSION_GRANTED) any = true;
        if (code == REQ_GPS) { if (any) gpsOn(); else sendGpsErr("denied"); }
        if (code == REQ_BLE) { boolean all = res.length > 0; for (int r : res) if (r != PackageManager.PERMISSION_GRANTED) all = false;
            if (all) meshStart(); else meshState("denied", 0); }
        if (code == REQ_GEO && geoCb != null) { geoCb.invoke(geoOrigin, any, false); geoCb = null; }
        if (code == REQ_MEDIA && mediaReq != null) {
            List<String> ok = new ArrayList<>();
            for (String res2 : mediaReq.getResources()) {
                if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(res2) && has(Manifest.permission.CAMERA)) ok.add(res2);
                if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(res2) && has(Manifest.permission.RECORD_AUDIO)) ok.add(res2);
            }
            if (ok.isEmpty()) mediaReq.deny(); else mediaReq.grant(ok.toArray(new String[0]));
            mediaReq = null;
        }
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req != REQ_FILE || filePending == null) return;
        Uri[] out = null;
        if (res == RESULT_OK) {
            if (data != null && data.getClipData() != null) {
                ClipData cd = data.getClipData();
                out = new Uri[cd.getItemCount()];
                for (int i = 0; i < out.length; i++) out[i] = cd.getItemAt(i).getUri();
            } else if (data != null && data.getData() != null) out = new Uri[]{data.getData()};
            else if (cameraUri != null) out = new Uri[]{cameraUri};
        }
        filePending.onReceiveValue(out);
        filePending = null;
    }

    // ------------------------------------------------------------------ γέφυρα προς τη σελίδα

    public class Bridge {
        @JavascriptInterface
        public void call(final String cmd, final String json) {
            runOnUiThread(() -> {
                try {
                    JSONObject a = new JSONObject(json == null ? "{}" : json);
                    switch (cmd) {
                        case "share": share(a); break;
                        case "save": saveData(a.optString("name", "file"), a.optString("mime"), a.optString("data")); break;
                        case "saveUrl": {
                            Uri u = Uri.parse(a.optString("url"));
                            if (isApp(u)) saveAsset(relOf(u), a.optString("name", u.getLastPathSegment()));
                            break;
                        }
                        case "print": print(a.optString("title", getString(R.string.app_name))); break;
                        case "wake":
                            if (a.optBoolean("on")) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                            else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                            break;
                        case "tts": speak(a.optString("id"), a.optString("text"), a.optString("lang"), a.optDouble("rate", 1)); break;
                        case "baro": baro(a.optBoolean("on")); break;
                        case "gps": gps(a.optBoolean("on")); break;
                        case "mesh": mesh(a.optBoolean("on")); break;
                        case "meshSend": if (meshBle != null) meshBle.send(a.optString("data")); break;
                        case "ttsStop": ttsQueue.clear(); if (tts != null) tts.stop(); break;
                    }
                } catch (Exception ignored) {}
            });
        }
    }

    private File outFile(String name) {
        File dir = new File(getCacheDir(), "out"); dir.mkdirs();
        String n = name == null || name.isEmpty() ? "file" : name.replaceAll("[\\\\/:*?\"<>|]", "_");
        return new File(dir, n);
    }

    private Uri uriOf(File f) { return FileProvider.getUriForFile(this, getPackageName() + ".files", f); }

    private void share(JSONObject a) throws Exception {
        JSONArray fs = a.optJSONArray("files");
        String text = a.optString("text"), title = a.optString("title");
        Intent i;
        if (fs == null || fs.length() == 0) {
            i = new Intent(Intent.ACTION_SEND).setType("text/plain");
        } else {
            ArrayList<Uri> uris = new ArrayList<>();
            String mime = null;
            for (int k = 0; k < fs.length(); k++) {
                JSONObject o = fs.getJSONObject(k);
                File f = outFile(o.optString("name"));
                try (OutputStream out = new FileOutputStream(f)) { out.write(Base64.decode(o.optString("data"), Base64.DEFAULT)); }
                uris.add(uriOf(f));
                String m = o.optString("mime", "*/*");
                mime = (mime == null || mime.equals(m)) ? m : "*/*";
            }
            if (uris.size() == 1) { i = new Intent(Intent.ACTION_SEND); i.putExtra(Intent.EXTRA_STREAM, uris.get(0)); }
            else { i = new Intent(Intent.ACTION_SEND_MULTIPLE); i.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris); }
            i.setType(mime);
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        if (!text.isEmpty()) i.putExtra(Intent.EXTRA_TEXT, text);
        if (!title.isEmpty()) i.putExtra(Intent.EXTRA_SUBJECT, title);
        startActivity(Intent.createChooser(i, getString(R.string.share)));
    }

    private void saveAsset(String rel, String name) {
        net.submit(() -> {
            try {
                byte[] b = bytesOf(rel);
                runOnUiThread(() -> keep(name == null ? rel : name, mime(rel), b));
            } catch (Exception ignored) {}
        });
    }

    private void saveData(String name, String mime, String b64) {
        keep(name, mime == null || mime.isEmpty() ? mime(name) : mime, Base64.decode(b64, Base64.DEFAULT));
    }

    /** Γράφει το αρχείο στις Λήψεις (Android 10+) και το ανοίγει (PDF → αναγνώστης, .ics → ημερολόγιο). */
    private void keep(String name, String mime, byte[] b) {
        try {
            File f = outFile(name);
            try (OutputStream out = new FileOutputStream(f)) { out.write(b); }
            if (Build.VERSION.SDK_INT >= 29) {
                try {
                    ContentValues cv = new ContentValues();
                    cv.put(MediaStore.Downloads.DISPLAY_NAME, f.getName());
                    cv.put(MediaStore.Downloads.MIME_TYPE, mime);
                    cv.put(MediaStore.Downloads.RELATIVE_PATH, "Download/Survival72");
                    Uri d = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                    if (d != null) {
                        try (OutputStream o = getContentResolver().openOutputStream(d)) { o.write(b); }
                        Toast.makeText(this, getString(R.string.saved, "Download/Survival72/" + f.getName()), Toast.LENGTH_LONG).show();
                    }
                } catch (Exception ignored) {}
            }
            Uri u = uriOf(f);
            Intent view = new Intent(Intent.ACTION_VIEW).setDataAndType(u, mime).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            if (view.resolveActivity(getPackageManager()) != null) {
                startActivity(Intent.createChooser(view, getString(R.string.open_with)));
            } else {
                Intent send = new Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM, u).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(Intent.createChooser(send, getString(R.string.share)));
            }
        } catch (Exception ignored) {}
    }

    private void print(String title) {
        PrintManager pm = (PrintManager) getSystemService(PRINT_SERVICE);
        if (pm == null) return;
        String job = title.replaceAll("[^\\p{L}\\p{N} ]", "").trim();
        if (job.isEmpty()) job = "Survival72";
        pm.print(job, web.createPrintDocumentAdapter(job), new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
    }

    private void openExternal(String url) {
        try {
            Intent i = url.startsWith("intent:") ? Intent.parseUri(url, Intent.URI_INTENT_SCHEME) : new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            i.addCategory(Intent.CATEGORY_BROWSABLE);
            startActivity(i);
        } catch (Exception ignored) {}
    }

    // ------------------------------------------------------------------ ανάγνωση (Text-to-Speech)

    private void speak(String id, String text, String lang, double rate) {
        if (tts == null) {
            tts = new TextToSpeech(getApplicationContext(), st -> {
                ttsReady = st == TextToSpeech.SUCCESS;
                runOnUiThread(() -> {
                    List<String[]> q = new ArrayList<>(ttsQueue); ttsQueue.clear();
                    for (String[] x : q) { if (ttsReady) say(x[0], x[1], x[2], Double.parseDouble(x[3])); else done(x[0], true); }
                });
            });
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String u) {}
                @Override public void onDone(String u) { if (u.endsWith("#end")) done(u.substring(0, u.length() - 4), false); }
                @Override public void onError(String u) { if (u.endsWith("#end")) done(u.substring(0, u.length() - 4), true); }
            });
        }
        if (!ttsReady) { ttsQueue.add(new String[]{id, text, lang, String.valueOf(rate)}); return; }
        say(id, text, lang, rate);
    }

    private void say(String id, String text, String lang, double rate) {
        if (lang != null && !lang.isEmpty()) tts.setLanguage(Locale.forLanguageTag(lang));
        tts.setSpeechRate((float) rate);
        int max = Math.min(3800, TextToSpeech.getMaxSpeechInputLength() - 100);
        List<String> parts = new ArrayList<>();
        String t = text;
        while (t.length() > max) {
            int cut = Math.max(t.lastIndexOf(". ", max), t.lastIndexOf(" ", max));
            if (cut < max / 2) cut = max;
            parts.add(t.substring(0, cut + 1)); t = t.substring(cut + 1);
        }
        parts.add(t);
        for (int k = 0; k < parts.size(); k++) {
            String uid = id + (k == parts.size() - 1 ? "#end" : "#" + k);
            tts.speak(parts.get(k), TextToSpeech.QUEUE_ADD, null, uid);
        }
    }

    private void done(String id, boolean err) {
        runOnUiThread(() -> web.evaluateJavascript("window.__ttsEnd&&__ttsEnd(" + JSONObject.quote(id) + "," + err + ")", null));
    }


    // ------------------------------------------------------------------ βαρόμετρο (Sensor.TYPE_PRESSURE, hPa)

    private SensorManager sm;
    private boolean baroWanted;
    private double baroSum; private int baroN; private long baroLast;
    private final SensorEventListener baroL = new SensorEventListener() {
        @Override public void onSensorChanged(SensorEvent e) {
            baroSum += e.values[0]; baroN++;
            long now = System.currentTimeMillis();
            if (now - baroLast >= 2000 && baroN > 0) {   // μέσος όρος κάθε 2″ – λιγότερος θόρυβος
                double v = baroSum / baroN; baroSum = 0; baroN = 0; baroLast = now;
                sendBaro(String.format(Locale.ROOT, "%.2f", v), "");
            }
        }
        @Override public void onAccuracyChanged(Sensor s, int a) {}
    };

    private void baro(boolean on) {
        baroWanted = on;
        if (sm == null) sm = (SensorManager) getSystemService(SENSOR_SERVICE);
        Sensor p = sm == null ? null : sm.getDefaultSensor(Sensor.TYPE_PRESSURE);
        if (!on) { if (sm != null) sm.unregisterListener(baroL); return; }
        if (p == null) { sendBaro("null", "none"); return; }
        baroSum = 0; baroN = 0; baroLast = 0;
        sm.registerListener(baroL, p, SensorManager.SENSOR_DELAY_NORMAL);
    }

    private void sendBaro(String v, String err) {
        runOnUiThread(() -> web.evaluateJavascript("window.__baro&&__baro(" + v + "," + JSONObject.quote(err) + ")", null));
    }

    @Override protected void onPause() { super.onPause(); if (sm != null) sm.unregisterListener(baroL); gpsOff(); }
    @Override protected void onResume() { super.onResume(); if (baroWanted) baro(true); if (gpsWanted) gps(true); if (meshWanted && meshBle != null) meshBle.start(); }

    // ------------------------------------------------------------------ Μηνύματα Bluetooth (MeshBLE) – από την έκδοση 1.4
    private MeshBLE meshBle;
    private boolean meshWanted;

    private String[] blePerms() {
        if (Build.VERSION.SDK_INT >= 31) return new String[]{Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_ADVERTISE, Manifest.permission.BLUETOOTH_CONNECT};
        return new String[]{Manifest.permission.ACCESS_FINE_LOCATION};
    }

    private void mesh(boolean on) {
        meshWanted = on;
        if (!on) { if (meshBle != null) meshBle.stop(); return; }
        java.util.List<String> miss = new java.util.ArrayList<>();
        for (String p : blePerms()) if (!has(p)) miss.add(p);
        if (!miss.isEmpty()) { requestPermissions(miss.toArray(new String[0]), REQ_BLE); return; }
        meshStart();
    }

    private void meshStart() {
        if (!meshWanted) return;
        if (meshBle == null) meshBle = new MeshBLE(this, new MeshBLE.Cb() {
            @Override public void message(String text, String from) {
                runOnUiThread(() -> web.evaluateJavascript("window.__mesh&&__mesh(" + JSONObject.quote(text) + "," + JSONObject.quote(from) + ")", null));
            }
            @Override public void state(String s, int n) { meshState(s, n); }
            @Override public void peer() { runOnUiThread(() -> web.evaluateJavascript("window.__meshPeer&&__meshPeer()", null)); }
        });
        if (!meshBle.enabled()) {
            try { startActivity(new Intent(android.bluetooth.BluetoothAdapter.ACTION_REQUEST_ENABLE)); } catch (Exception ignored) {}
        }
        meshBle.start();
    }

    private void meshState(String s, int n) {
        runOnUiThread(() -> web.evaluateJavascript("window.__meshState&&__meshState(" + JSONObject.quote(s) + "," + n + ")", null));
    }

    // ------------------------------------------------------------------ GPS (δέκτης GNSS του κινητού) – από την έκδοση 1.3
    // Σαν Garmin: παίρνουμε τη θέση κατευθείαν από τον δέκτη GPS (GPS_PROVIDER), όχι από τον browser.
    // Για να μη μείνει ποτέ χωρίς θέση (π.χ. μέσα σε σπίτι για SOS), κρατάμε και τη θέση δικτύου/fused,
    // αλλά τη στέλνουμε ΜΟΝΟ όταν ο δέκτης GPS δεν έχει δώσει τίποτα τα τελευταία 10″.
    // Δορυφόροι (GnssStatus): πλήθος, συστήματα (GPS, Galileo, GLONASS, BeiDou…), σήμα, L5.

    private LocationManager lm;
    private boolean gpsWanted, gpsRunning;
    private long lastGpsFix, lastGnss;
    private final ExecutorService altEx = Executors.newSingleThreadExecutor();

    private LocationListener mkL(final boolean fromGps) {
        return new LocationListener() {
            @Override public void onLocationChanged(Location l) { onLoc(l, fromGps); }
            @Override public void onStatusChanged(String p, int st, Bundle b) {}
            @Override public void onProviderEnabled(String p) {}
            @Override public void onProviderDisabled(String p) {}
        };
    }
    private final LocationListener gpsL = mkL(true), netL = mkL(false);

    private GnssStatus.Callback gnssCb;

    private void gps(boolean on) {
        gpsWanted = on;
        if (lm == null) lm = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (!on) { gpsOff(); return; }
        if (!has(Manifest.permission.ACCESS_FINE_LOCATION) && !has(Manifest.permission.ACCESS_COARSE_LOCATION)) {
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_GPS);
            return;
        }
        gpsOn();
    }

    @SuppressWarnings("MissingPermission")
    private void gpsOn() {
        if (!gpsWanted || lm == null) return;
        gpsOff();
        boolean fine = has(Manifest.permission.ACCESS_FINE_LOCATION), any = false;
        try {
            if (fine && lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, gpsL, Looper.getMainLooper());
                any = true;
            }
        } catch (Exception ignored) {}
        String alt = (Build.VERSION.SDK_INT >= 31 && lm.getAllProviders().contains(LocationManager.FUSED_PROVIDER))
                ? LocationManager.FUSED_PROVIDER : LocationManager.NETWORK_PROVIDER;
        try {
            if (lm.getAllProviders().contains(alt) && lm.isProviderEnabled(alt)) {
                lm.requestLocationUpdates(alt, 2000, 0, netL, Looper.getMainLooper());
                any = true;
            }
        } catch (Exception ignored) {}
        if (!any) { sendGpsErr("off"); return; }
        gpsRunning = true;
        if (fine) {
            try {
                if (gnssCb == null) gnssCb = new GnssStatus.Callback() {
                    @Override public void onSatelliteStatusChanged(GnssStatus st) { sendGnss(st); }
                    @Override public void onFirstFix(int ttff) {
                        runOnUiThread(() -> web.evaluateJavascript("window.__gnssFix&&__gnssFix(" + ttff + ")", null));
                    }
                };
                lm.registerGnssStatusCallback(gnssCb, new Handler(Looper.getMainLooper()));
            } catch (Exception ignored) {}
        }
        // γρήγορη πρώτη θέση: η τελευταία γνωστή, αν είναι φρέσκια (< 1′)
        try {
            Location g = fine ? lm.getLastKnownLocation(LocationManager.GPS_PROVIDER) : null;
            if (g != null && System.currentTimeMillis() - g.getTime() < 60000) onLoc(g, true);
        } catch (Exception ignored) {}
    }

    private void gpsOff() {
        if (lm == null || !gpsRunning) return;
        gpsRunning = false;
        try { lm.removeUpdates(gpsL); } catch (Exception ignored) {}
        try { lm.removeUpdates(netL); } catch (Exception ignored) {}
        try { if (gnssCb != null) lm.unregisterGnssStatusCallback(gnssCb); } catch (Exception ignored) {}
    }

    private void onLoc(Location l, boolean fromGps) {
        long now = System.currentTimeMillis();
        if (fromGps) lastGpsFix = now;
        else if (now - lastGpsFix < 10000) return;   // ο δέκτης GPS δουλεύει – δεν χρειάζεται η θέση δικτύου
        if (Build.VERSION.SDK_INT >= 34 && l.hasAltitude() && !l.hasMslAltitude()) {
            // υψόμετρο πάνω από τη θάλασσα (το GPS δίνει ύψος πάνω από το ελλειψοειδές – στην Ελλάδα ~35–40 m διαφορά)
            final Location c = new Location(l);
            altEx.submit(() -> {
                try { new android.location.altitude.AltitudeConverter().addMslAltitudeToLocation(MainActivity.this, c); } catch (Exception ignored) {}
                sendLoc(c, fromGps);
            });
            return;
        }
        sendLoc(l, fromGps);
    }

    private void sendLoc(Location l, boolean fromGps) {
        try {
            JSONObject o = new JSONObject();
            o.put("lat", l.getLatitude()); o.put("lon", l.getLongitude());
            o.put("acc", l.hasAccuracy() ? l.getAccuracy() : 999);
            boolean msl = Build.VERSION.SDK_INT >= 34 && l.hasMslAltitude();
            if (msl) {
                o.put("alt", l.getMslAltitudeMeters());
                if (l.hasMslAltitudeAccuracy()) o.put("altAcc", l.getMslAltitudeAccuracyMeters());
            } else if (l.hasAltitude()) {
                o.put("alt", l.getAltitude()); o.put("ell", 1);
                if (l.hasVerticalAccuracy()) o.put("altAcc", l.getVerticalAccuracyMeters());
            }
            if (l.hasSpeed()) o.put("spd", l.getSpeed());
            if (l.hasBearing() && l.hasSpeed() && l.getSpeed() > 0.5f) o.put("hd", l.getBearing());
            o.put("t", l.getTime() > 0 ? l.getTime() : System.currentTimeMillis());
            o.put("src", fromGps ? "gps" : "net");
            final String js = "window.__gps&&__gps(" + o + ",'')";
            runOnUiThread(() -> web.evaluateJavascript(js, null));
        } catch (Exception ignored) {}
    }

    private void sendGnss(GnssStatus st) {
        long now = System.currentTimeMillis();
        if (now - lastGnss < 2000) return;
        lastGnss = now;
        try {
            JSONArray a = new JSONArray();
            int used = 0;
            boolean l5 = false;
            for (int i = 0; i < st.getSatelliteCount(); i++) {
                boolean u = st.usedInFix(i), f5 = false;
                if (st.hasCarrierFrequencyHz(i)) { float f = st.getCarrierFrequencyHz(i); f5 = f > 1.16e9f && f < 1.19e9f; }
                if (u) { used++; if (f5) l5 = true; }
                JSONArray s = new JSONArray();
                s.put(st.getConstellationType(i)); s.put(st.getSvid(i)); s.put(Math.round(st.getCn0DbHz(i)));
                s.put(Math.round(st.getElevationDegrees(i))); s.put(Math.round(st.getAzimuthDegrees(i))); s.put(u ? 1 : 0); s.put(f5 ? 1 : 0);
                a.put(s);
            }
            JSONObject o = new JSONObject();
            o.put("n", st.getSatelliteCount()); o.put("u", used); o.put("l5", l5); o.put("s", a);
            web.evaluateJavascript("window.__gnss&&__gnss(" + o + ")", null);
        } catch (Exception ignored) {}
    }

    private void sendGpsErr(String err) {
        runOnUiThread(() -> web.evaluateJavascript("window.__gps&&__gps(null," + JSONObject.quote(err) + ")", null));
    }

    // ------------------------------------------------------------------ βοηθητικά

    static byte[] readAll(InputStream in) throws Exception {
        try (InputStream i = in; ByteArrayOutputStream o = new ByteArrayOutputStream()) { copy(i, o); return o.toByteArray(); }
    }

    static void copy(InputStream in, OutputStream out) throws Exception {
        byte[] buf = new byte[65536]; int n;
        while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
    }

    static void deleteTree(File f) {
        if (f == null || !f.exists()) return;
        File[] k = f.listFiles();
        if (k != null) for (File c : k) deleteTree(c);
        f.delete();
    }

    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }

    @Override public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (tts != null) tts.shutdown();
        net.shutdownNow();
        altEx.shutdownNow();
        if (meshBle != null) meshBle.stop();
        gpsOff();
        super.onDestroy();
    }
}
