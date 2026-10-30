package gr.barbaris.hst;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private static final int PICK = 41;
    private WebView web;
    private ValueCallback<Uri[]> pending;
    private Uri cameraUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xFF0F3A5C);

        // Serves app/src/main/assets via https://appassets.androidplatform.net/assets/
        // so the page has a stable secure origin and localStorage keeps the data.
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req) {
                return loader.shouldInterceptRequest(req.getUrl());
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if ("appassets.androidplatform.net".equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) {}
                return true;
            }
        });

        // <input type="file"> → camera or gallery
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (pending != null) pending.onReceiveValue(null);
                pending = cb;
                Intent gallery = new Intent(Intent.ACTION_GET_CONTENT);
                gallery.addCategory(Intent.CATEGORY_OPENABLE);
                gallery.setType("image/*");
                Intent chooser = Intent.createChooser(gallery, "Φωτογραφία");
                try {
                    File f = new File(getCacheDir(), "camera_" + System.currentTimeMillis() + ".jpg");
                    cameraUri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                    Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    cam.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
                    cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    cam.setClipData(ClipData.newRawUri("", cameraUri));
                    chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{cam});
                } catch (Exception e) { cameraUri = null; }
                try { startActivityForResult(chooser, PICK); }
                catch (Exception e) { pending = null; return false; }
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        setContentView(web);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req != PICK || pending == null) return;
        Uri[] out = null;
        if (res == RESULT_OK) {
            if (data != null && data.getData() != null) out = new Uri[]{data.getData()};
            else if (cameraUri != null) out = new Uri[]{cameraUri};
        }
        pending.onReceiveValue(out);
        pending = null;
    }

    /** Lets the page send reports / CSV / backups / images to Email, WhatsApp, Drive, etc. */
    public class Bridge {
        @JavascriptInterface
        public void share(final String title, final String text) {
            runOnUiThread(() -> {
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_SUBJECT, title);
                i.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(i, title));
            });
        }

        /** files = JSON [{name, mime, dataUrl}] → PDF / CSV / photos to Email, WhatsApp, Drive */
        @JavascriptInterface
        public void shareFiles(final String json, final String title) {
            runOnUiThread(() -> {
                try {
                    JSONArray a = new JSONArray(json);
                    File dir = new File(getCacheDir(), "out");
                    dir.mkdirs();
                    ArrayList<Uri> uris = new ArrayList<>();
                    String mime = null;
                    for (int i = 0; i < a.length(); i++) {
                        JSONObject o = a.getJSONObject(i);
                        String d = o.getString("dataUrl");
                        File f = new File(dir, o.getString("name").replaceAll("[\\\\/:*?\"<>|]", "_"));
                        try (FileOutputStream out = new FileOutputStream(f)) {
                            out.write(Base64.decode(d.substring(d.indexOf(',') + 1), Base64.DEFAULT));
                        }
                        uris.add(FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f));
                        String m = o.optString("mime", "*/*");
                        mime = (mime == null || mime.equals(m)) ? m : "*/*";
                    }
                    Intent i;
                    if (uris.size() == 1) {
                        i = new Intent(Intent.ACTION_SEND);
                        i.putExtra(Intent.EXTRA_STREAM, uris.get(0));
                    } else {
                        i = new Intent(Intent.ACTION_SEND_MULTIPLE);
                        i.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
                    }
                    i.setType(mime == null ? "*/*" : mime);
                    i.putExtra(Intent.EXTRA_SUBJECT, title);
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(i, title));
                } catch (Exception ignored) {}
            });
        }

        @JavascriptInterface
        public void shareImage(final String dataUrl, final String name) {
            runOnUiThread(() -> {
                try {
                    String b64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
                    File f = new File(getCacheDir(), name);
                    try (FileOutputStream o = new FileOutputStream(f)) { o.write(Base64.decode(b64, Base64.DEFAULT)); }
                    Uri u = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType("image/jpeg");
                    i.putExtra(Intent.EXTRA_STREAM, u);
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(i, "Steel area"));
                } catch (Exception ignored) {}
            });
        }
    }

    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }

    @Override public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
