package gr.barbaris.survival72;

// Επιβίωση 72+ – Μηνύματα χωρίς δίκτυο μέσω Bluetooth (BLE). © 2026 Γεώργιος Μπαρμπαρής
//
// Ίδιο πρωτόκολλο με το iPhone (MeshBLE.swift) → μιλάνε iPhone ↔ Android.
// Το κινητό είναι ΚΑΙ «πομπός» (GATT server + διαφήμιση) ΚΑΙ «δέκτης» (σάρωση + σύνδεση).
// Εδώ είναι μόνο ο «σωλήνας»: στέλνει κείμενο σε ΟΛΟΥΣ τους γείτονες, παραδίδει ό,τι έρχεται.
// Η λογική του δικτύου (αλυσίδα, TTL, διπλότυπα, αποθήκευση-προώθηση) είναι στη σελίδα.
//
// Πλαίσιο (frame): [0xA7][msgId 4 byte][index][total][κομμάτι μηνύματος]
// Το Android θέλει ΜΙΑ εντολή GATT τη φορά ανά σύνδεση → ουρές.

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattServerCallback;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelUuid;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@SuppressLint("MissingPermission")
final class MeshBLE {
    static final UUID SVC = UUID.fromString("6e1a0001-72a2-4b5e-9c3d-5a7e2b1f0c72");
    static final UUID CHR = UUID.fromString("6e1a0002-72a2-4b5e-9c3d-5a7e2b1f0c72");
    static final UUID CCCD = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
    static final int MAX_PEERS = 8;

    interface Cb { void message(String text, String from); void state(String s, int n); void peer(); }

    private final Context ctx;
    private final Cb cb;
    private final Handler h = new Handler(Looper.getMainLooper());
    private final SecureRandom rnd = new SecureRandom();

    private BluetoothManager bm;
    private BluetoothAdapter ad;
    private BluetoothGattServer gs;
    private BluetoothGattCharacteristic sch;
    private BluetoothLeAdvertiser adv;
    private BluetoothLeScanner sc;
    private boolean running, advertising, scanning;

    // ως central (εμείς συνδεόμαστε σε άλλους)
    private final Map<String, BluetoothGatt> gatts = new HashMap<>();
    private final Map<String, BluetoothGattCharacteristic> ready = new HashMap<>();
    private final Map<String, Integer> mtu = new HashMap<>();
    private final Map<String, ArrayDeque<byte[]>> wq = new HashMap<>();
    private final Set<String> wbusy = new HashSet<>();
    private final Map<String, Integer> wfail = new HashMap<>();
    // ως peripheral (άλλοι συνδέονται σε εμάς)
    private final Map<String, BluetoothDevice> subs = new HashMap<>();
    private final Map<String, Integer> subMtu = new HashMap<>();
    private final Map<String, ArrayDeque<byte[]>> nq = new HashMap<>();
    private final Set<String> nbusy = new HashSet<>();

    private static final class Asm { int total; byte[][] parts; int got; long t; }
    private final Map<String, Asm> asm = new HashMap<>();

    MeshBLE(Context c, Cb cb) {
        this.ctx = c.getApplicationContext();
        this.cb = cb;
        bm = (BluetoothManager) ctx.getSystemService(Context.BLUETOOTH_SERVICE);
        ad = bm != null ? bm.getAdapter() : null;
    }

    boolean enabled() { return ad != null && ad.isEnabled(); }

    void start() {
        h.post(() -> {
            running = true;
            if (ad == null) { state(); return; }
            if (!ad.isEnabled()) { state(); return; }
            try { startServer(); } catch (Exception ignored) {}
            try { startAdvertising(); } catch (Exception ignored) {}
            try { startScan(); } catch (Exception ignored) {}
            state();
        });
    }

    void stop() {
        h.post(() -> {
            running = false;
            try { if (sc != null && scanning) sc.stopScan(scanCb); } catch (Exception ignored) {}
            scanning = false;
            try { if (adv != null && advertising) adv.stopAdvertising(advCb); } catch (Exception ignored) {}
            advertising = false;
            for (BluetoothGatt g : gatts.values()) { try { g.disconnect(); g.close(); } catch (Exception ignored) {} }
            gatts.clear(); ready.clear(); mtu.clear(); wq.clear(); wbusy.clear();
            try { if (gs != null) gs.close(); } catch (Exception ignored) {}
            gs = null; sch = null;
            subs.clear(); subMtu.clear(); nq.clear(); nbusy.clear(); asm.clear();
            state();
        });
    }

    void send(String text) {
        h.post(() -> {
            if (!running || text == null || text.isEmpty()) return;
            byte[] data = text.getBytes(StandardCharsets.UTF_8);
            int id = rnd.nextInt();
            if (id == 0) id = 1;
            for (String a : new ArrayList<>(ready.keySet())) {
                int m = mtu.containsKey(a) ? mtu.get(a) : 23;
                for (byte[] f : frames(data, id, Math.min(180, m - 3))) q(wq, a).add(f);
                pumpW(a);
            }
            for (String a : new ArrayList<>(subs.keySet())) {
                int m = subMtu.containsKey(a) ? subMtu.get(a) : 23;
                for (byte[] f : frames(data, id, Math.min(180, m - 3))) q(nq, a).add(f);
                pumpN(a);
            }
        });
    }

    private static ArrayDeque<byte[]> q(Map<String, ArrayDeque<byte[]>> m, String a) {
        ArrayDeque<byte[]> d = m.get(a);
        if (d == null) { d = new ArrayDeque<>(); m.put(a, d); }
        return d;
    }

    // ---------------------------------------------------------------- πλαίσια
    private static List<byte[]> frames(byte[] d, int id, int payload) {
        int chunk = Math.max(8, payload - 7);
        int total = (d.length + chunk - 1) / chunk;
        List<byte[]> out = new ArrayList<>();
        if (total <= 0 || total > 255) return out;
        for (int i = 0; i < total; i++) {
            int s = i * chunk, e = Math.min(d.length, s + chunk);
            byte[] f = new byte[7 + e - s];
            f[0] = (byte) 0xA7;
            f[1] = (byte) (id >>> 24); f[2] = (byte) (id >>> 16); f[3] = (byte) (id >>> 8); f[4] = (byte) id;
            f[5] = (byte) i; f[6] = (byte) total;
            System.arraycopy(d, s, f, 7, e - s);
            out.add(f);
        }
        return out;
    }

    private void recv(byte[] f, String from) {
        if (f == null || f.length <= 7 || (f[0] & 0xFF) != 0xA7) return;
        int id = ((f[1] & 0xFF) << 24) | ((f[2] & 0xFF) << 16) | ((f[3] & 0xFF) << 8) | (f[4] & 0xFF);
        int idx = f[5] & 0xFF, total = f[6] & 0xFF;
        if (total == 0 || idx >= total) return;
        long now = System.currentTimeMillis();
        for (Iterator<Map.Entry<String, Asm>> it = asm.entrySet().iterator(); it.hasNext(); ) {
            if (now - it.next().getValue().t > 30000) it.remove();
        }
        String key = from + ":" + id;
        Asm a = asm.get(key);
        if (a == null || a.total != total) { a = new Asm(); a.total = total; a.parts = new byte[total][]; asm.put(key, a); }
        a.t = now;
        if (a.parts[idx] == null) { a.parts[idx] = Arrays.copyOfRange(f, 7, f.length); a.got++; }
        if (a.got < a.total) return;
        asm.remove(key);
        int len = 0;
        for (byte[] p : a.parts) len += p.length;
        byte[] full = new byte[len];
        int o = 0;
        for (byte[] p : a.parts) { System.arraycopy(p, 0, full, o, p.length); o += p.length; }
        cb.message(new String(full, StandardCharsets.UTF_8), from);
    }

    private void state() {
        String s;
        if (ad == null) s = "unsupported";
        else if (!ad.isEnabled()) s = "off";
        else s = running ? "on" : "stopped";
        Set<String> ids = new HashSet<>(ready.keySet());
        ids.addAll(subs.keySet());
        cb.state(s, ids.size());
    }

    // ---------------------------------------------------------------- peripheral: GATT server + διαφήμιση
    private void startServer() {
        if (gs != null) return;
        gs = bm.openGattServer(ctx, serverCb);
        if (gs == null) return;
        BluetoothGattService s = new BluetoothGattService(SVC, BluetoothGattService.SERVICE_TYPE_PRIMARY);
        sch = new BluetoothGattCharacteristic(CHR,
                BluetoothGattCharacteristic.PROPERTY_WRITE | BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE | BluetoothGattCharacteristic.PROPERTY_NOTIFY,
                BluetoothGattCharacteristic.PERMISSION_WRITE);
        sch.addDescriptor(new BluetoothGattDescriptor(CCCD, BluetoothGattDescriptor.PERMISSION_READ | BluetoothGattDescriptor.PERMISSION_WRITE));
        s.addCharacteristic(sch);
        gs.addService(s);
    }

    private void startAdvertising() {
        if (advertising) return;
        adv = ad.getBluetoothLeAdvertiser();
        if (adv == null) return;
        AdvertiseSettings st = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(true).build();
        AdvertiseData d = new AdvertiseData.Builder().addServiceUuid(new ParcelUuid(SVC)).setIncludeDeviceName(false).build();
        adv.startAdvertising(st, d, advCb);
        advertising = true;
    }

    private final AdvertiseCallback advCb = new AdvertiseCallback() {
        @Override public void onStartFailure(int errorCode) { h.post(() -> advertising = false); }
    };

    private final BluetoothGattServerCallback serverCb = new BluetoothGattServerCallback() {
        @Override public void onConnectionStateChange(BluetoothDevice d, int status, int newState) {
            if (newState == BluetoothProfile.STATE_DISCONNECTED) h.post(() -> {
                String a = d.getAddress();
                subs.remove(a); subMtu.remove(a); nq.remove(a); nbusy.remove(a);
                state();
            });
        }
        @Override public void onMtuChanged(BluetoothDevice d, int m) { h.post(() -> subMtu.put(d.getAddress(), m)); }
        @Override public void onCharacteristicWriteRequest(BluetoothDevice d, int req, BluetoothGattCharacteristic c,
                                                           boolean prepared, boolean needResp, int offset, byte[] value) {
            try { if (needResp && gs != null) gs.sendResponse(d, req, BluetoothGatt.GATT_SUCCESS, 0, null); } catch (Exception ignored) {}
            final byte[] v = value;
            h.post(() -> recv(v, d.getAddress()));
        }
        @Override public void onDescriptorWriteRequest(BluetoothDevice d, int req, BluetoothGattDescriptor desc,
                                                       boolean prepared, boolean needResp, int offset, byte[] value) {
            try { if (needResp && gs != null) gs.sendResponse(d, req, BluetoothGatt.GATT_SUCCESS, 0, null); } catch (Exception ignored) {}
            final boolean on = value != null && value.length > 0 && value[0] != 0;
            h.post(() -> {
                String a = d.getAddress();
                if (on) { subs.put(a, d); cb.peer(); } else { subs.remove(a); nq.remove(a); nbusy.remove(a); }
                state();
            });
        }
        @Override public void onDescriptorReadRequest(BluetoothDevice d, int req, int offset, BluetoothGattDescriptor desc) {
            try { if (gs != null) gs.sendResponse(d, req, BluetoothGatt.GATT_SUCCESS, 0, new byte[]{0, 0}); } catch (Exception ignored) {}
        }
        @Override public void onNotificationSent(BluetoothDevice d, int status) {
            h.post(() -> { nbusy.remove(d.getAddress()); pumpN(d.getAddress()); });
        }
    };

    @SuppressWarnings("deprecation")
    private void pumpN(String a) {
        if (nbusy.contains(a) || gs == null || sch == null) return;
        ArrayDeque<byte[]> d = nq.get(a);
        BluetoothDevice dev = subs.get(a);
        if (d == null || d.isEmpty() || dev == null) return;
        byte[] f = d.poll();
        boolean ok;
        try {
            if (Build.VERSION.SDK_INT >= 33) ok = gs.notifyCharacteristicChanged(dev, sch, false, f) == BluetoothGatt.GATT_SUCCESS;
            else { sch.setValue(f); ok = gs.notifyCharacteristicChanged(dev, sch, false); }
        } catch (Exception e) { ok = false; }
        if (ok) nbusy.add(a); else h.postDelayed(() -> pumpN(a), 30);
    }

    // ---------------------------------------------------------------- central: σάρωση + σύνδεση
    private void startScan() {
        if (scanning) return;
        sc = ad.getBluetoothLeScanner();
        if (sc == null) return;
        List<ScanFilter> f = new ArrayList<>();
        f.add(new ScanFilter.Builder().setServiceUuid(new ParcelUuid(SVC)).build());
        ScanSettings st = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();
        sc.startScan(f, st, scanCb);
        scanning = true;
    }

    private final ScanCallback scanCb = new ScanCallback() {
        @Override public void onScanResult(int type, ScanResult r) {
            final BluetoothDevice d = r.getDevice();
            h.post(() -> {
                String a = d.getAddress();
                if (!running || gatts.containsKey(a) || gatts.size() >= MAX_PEERS) return;
                try {
                    BluetoothGatt g = Build.VERSION.SDK_INT >= 23
                            ? d.connectGatt(ctx, false, gattCb, BluetoothDevice.TRANSPORT_LE)
                            : d.connectGatt(ctx, false, gattCb);
                    if (g != null) gatts.put(a, g);
                } catch (Exception ignored) {}
            });
        }
        @Override public void onScanFailed(int errorCode) { h.post(() -> scanning = false); }
    };

    private void drop(BluetoothGatt g) {
        String a = g.getDevice().getAddress();
        try { g.close(); } catch (Exception ignored) {}
        gatts.remove(a); ready.remove(a); mtu.remove(a); wq.remove(a); wbusy.remove(a); wfail.remove(a);
        state();
    }

    private final BluetoothGattCallback gattCb = new BluetoothGattCallback() {
        @Override public void onConnectionStateChange(BluetoothGatt g, int status, int newState) {
            h.post(() -> {
                if (newState == BluetoothProfile.STATE_CONNECTED && status == BluetoothGatt.GATT_SUCCESS) {
                    try { if (!g.requestMtu(247)) g.discoverServices(); } catch (Exception e) { drop(g); }
                } else if (newState == BluetoothProfile.STATE_DISCONNECTED || status != BluetoothGatt.GATT_SUCCESS) {
                    drop(g);
                }
            });
        }
        @Override public void onMtuChanged(BluetoothGatt g, int m, int status) {
            h.post(() -> {
                if (status == BluetoothGatt.GATT_SUCCESS) mtu.put(g.getDevice().getAddress(), m);
                try { g.discoverServices(); } catch (Exception e) { drop(g); }
            });
        }
        @SuppressWarnings("deprecation")
        @Override public void onServicesDiscovered(BluetoothGatt g, int status) {
            h.post(() -> {
                BluetoothGattService s = g.getService(SVC);
                BluetoothGattCharacteristic c = s != null ? s.getCharacteristic(CHR) : null;
                if (c == null) { try { g.disconnect(); } catch (Exception ignored) {} drop(g); return; }
                String a = g.getDevice().getAddress();
                try {
                    g.setCharacteristicNotification(c, true);
                    BluetoothGattDescriptor d = c.getDescriptor(CCCD);
                    if (d != null) {
                        wbusy.add(a);
                        if (Build.VERSION.SDK_INT >= 33) g.writeDescriptor(d, BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                        else { d.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE); g.writeDescriptor(d); }
                    }
                } catch (Exception ignored) { wbusy.remove(a); }
                ready.put(a, c);
                state();
                cb.peer();
                if (!wbusy.contains(a)) pumpW(a);
            });
        }
        @Override public void onDescriptorWrite(BluetoothGatt g, BluetoothGattDescriptor d, int status) {
            h.post(() -> { String a = g.getDevice().getAddress(); wbusy.remove(a); pumpW(a); });
        }
        @Override public void onCharacteristicWrite(BluetoothGatt g, BluetoothGattCharacteristic c, int status) {
            h.post(() -> { String a = g.getDevice().getAddress(); wbusy.remove(a); pumpW(a); });
        }
        @Override public void onCharacteristicChanged(BluetoothGatt g, BluetoothGattCharacteristic c, byte[] value) {
            final String a = g.getDevice().getAddress();
            final byte[] v = value;
            h.post(() -> recv(v, a));
        }
        @SuppressWarnings("deprecation")
        @Override public void onCharacteristicChanged(BluetoothGatt g, BluetoothGattCharacteristic c) {
            if (Build.VERSION.SDK_INT >= 33) return;   // στο Android 13+ έρχεται από την από πάνω
            final String a = g.getDevice().getAddress();
            final byte[] v = c.getValue();
            h.post(() -> recv(v, a));
        }
    };

    @SuppressWarnings("deprecation")
    private void pumpW(String a) {
        if (wbusy.contains(a)) return;
        BluetoothGatt g = gatts.get(a);
        BluetoothGattCharacteristic c = ready.get(a);
        ArrayDeque<byte[]> d = wq.get(a);
        if (g == null || c == null || d == null || d.isEmpty()) return;
        byte[] f = d.poll();
        boolean ok;
        try {
            if (Build.VERSION.SDK_INT >= 33) ok = g.writeCharacteristic(c, f, BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT) == BluetoothGatt.GATT_SUCCESS;
            else { c.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT); c.setValue(f); ok = g.writeCharacteristic(c); }
        } catch (Exception e) { ok = false; }
        if (ok) { wbusy.add(a); wfail.remove(a); return; }
        int n = wfail.containsKey(a) ? wfail.get(a) + 1 : 1;
        wfail.put(a, n);
        if (n > 40) { d.clear(); wfail.remove(a); return; }   // η σύνδεση δεν γράφει – δεν κολλάμε
        d.addFirst(f);
        h.postDelayed(() -> pumpW(a), 50);
    }
}
