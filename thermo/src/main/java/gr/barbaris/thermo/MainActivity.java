package gr.barbaris.thermo;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(0xFF14263A);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
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
        web.addJavascriptInterface(new Bridge(), "ThermoBridge");
        setContentView(web);
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    private static String readLine(File f) {
        try (BufferedReader r = new BufferedReader(new FileReader(f))) {
            String l = r.readLine();
            return l == null ? null : l.trim();
        } catch (Exception e) { return null; }
    }

    class Bridge {
        @JavascriptInterface
        public String read() {
            JSONObject o = new JSONObject();
            try {
                Intent b = registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
                if (b != null) {
                    o.put("battTemp", b.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) / 10.0);
                    o.put("voltage", b.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0));
                    int lvl = b.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
                    int sc = b.getIntExtra(BatteryManager.EXTRA_SCALE, 100);
                    o.put("level", lvl < 0 ? -1 : Math.round(lvl * 100f / sc));
                    o.put("charging", b.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0) != 0);
                }
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                int thermal = -1;
                if (Build.VERSION.SDK_INT >= 29 && pm != null) thermal = pm.getCurrentThermalStatus();
                o.put("thermal", thermal);
                if (Build.VERSION.SDK_INT >= 30 && pm != null) {
                    float h = pm.getThermalHeadroom(10);
                    if (!Float.isNaN(h)) o.put("headroom", (double) h);
                }
                JSONArray zones = new JSONArray();
                File[] dirs = new File("/sys/class/thermal").listFiles();
                if (dirs != null) {
                    for (File d : dirs) {
                        if (!d.getName().startsWith("thermal_zone")) continue;
                        String type = readLine(new File(d, "type"));
                        String t = readLine(new File(d, "temp"));
                        if (type == null || t == null) continue;
                        try {
                            double v = Double.parseDouble(t);
                            if (Math.abs(v) > 500) v = v / 1000.0;
                            if (v < 5 || v > 120) continue;
                            String tl = type.toLowerCase();
                            if (tl.contains("cpu") || tl.contains("soc") || tl.contains("skin") || tl.contains("gpu") || tl.contains("ap")) {
                                JSONObject z = new JSONObject();
                                z.put("type", type); z.put("temp", v);
                                zones.put(z);
                                if (zones.length() >= 6) break;
                            }
                        } catch (Exception ignored) {}
                    }
                }
                o.put("zones", zones);
            } catch (Exception e) {
                try { o.put("error", e.toString()); } catch (Exception ignored) {}
            }
            return o.toString();
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            try {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null) v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void keepScreenOn(final boolean on) {
            runOnUiThread(() -> {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            });
        }
    }
}
