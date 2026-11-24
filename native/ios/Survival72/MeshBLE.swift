// Επιβίωση 72+ – Μηνύματα χωρίς δίκτυο μέσω Bluetooth (BLE). © 2026 Γεώργιος Μπαρμπαρής
//
// Το κινητό είναι ΚΑΙ «πομπός» (peripheral: διαφημίζει την υπηρεσία μας και δέχεται εγγραφές)
// ΚΑΙ «δέκτης» (central: ψάχνει άλλα κινητά με την υπηρεσία μας, συνδέεται και γράφει).
// Ίδιο πρωτόκολλο με το Android → μιλάνε iPhone ↔ Android.
//
// Εδώ είναι μόνο ο «σωλήνας»: στέλνει ένα κείμενο σε ΟΛΟΥΣ τους γείτονες και παραδίδει ό,τι έρχεται.
// Η λογική του δικτύου (αλυσίδα / TTL / διπλότυπα / αποθήκευση-προώθηση) είναι στη σελίδα (index.html),
// κοινή για iOS και Android.
//
// Πλαίσιο (frame): [0xA7][msgId 4 byte][index][total][κομμάτι μηνύματος]

import Foundation
import CoreBluetooth

final class MeshBLE: NSObject, CBCentralManagerDelegate, CBPeripheralManagerDelegate, CBPeripheralDelegate {
    static let svc = CBUUID(string: "6E1A0001-72A2-4B5E-9C3D-5A7E2B1F0C72")
    static let chr = CBUUID(string: "6E1A0002-72A2-4B5E-9C3D-5A7E2B1F0C72")
    static let maxPeers = 8

    var onMessage: ((String, String) -> Void)?   // (κείμενο, από)
    var onState: ((String, Int) -> Void)?        // (κατάσταση, πλήθος γειτόνων)
    var onPeer: (() -> Void)?                    // νέος γείτονας → η σελίδα ξαναστέλνει τα πρόσφατα

    private var cm: CBCentralManager?
    private var pm: CBPeripheralManager?
    private var char: CBMutableCharacteristic?
    private var serviceAdded = false
    private var running = false

    private var peers: [UUID: CBPeripheral] = [:]
    private var peerChar: [UUID: CBCharacteristic] = [:]
    private var subs: [UUID: CBCentral] = [:]
    private var notifyQueue: [Data] = []

    private struct Asm { var total: Int; var parts: [Int: Data]; var t: Date }
    private var asm: [String: Asm] = [:]

    // MARK: έλεγχος
    func start() {
        running = true
        if cm == nil { cm = CBCentralManager(delegate: self, queue: nil) } else { scan() }
        if pm == nil { pm = CBPeripheralManager(delegate: self, queue: nil) } else { advertise() }
        state()
    }

    func stop() {
        running = false
        cm?.stopScan()
        for p in peers.values { cm?.cancelPeripheralConnection(p) }
        peers.removeAll(); peerChar.removeAll()
        pm?.stopAdvertising()
        pm?.removeAllServices()
        serviceAdded = false; char = nil
        subs.removeAll(); notifyQueue.removeAll(); asm.removeAll()
        state()
    }

    func send(_ text: String) {
        guard running, let data = text.data(using: .utf8), !data.isEmpty else { return }
        let id = UInt32.random(in: 1...UInt32.max)
        // ως central: γράφουμε σε κάθε συνδεδεμένο γείτονα
        for (uid, p) in peers {
            guard let c = peerChar[uid], p.state == .connected else { continue }
            let mx = min(180, p.maximumWriteValueLength(for: .withoutResponse))
            for f in frames(data, id, mx) { p.writeValue(f, for: c, type: .withResponse) }
        }
        // ως peripheral: ειδοποίηση (notify) σε όσους έχουν εγγραφεί
        if let pm = pm, let c = char, !subs.isEmpty {
            let mx = min(180, subs.values.map { $0.maximumUpdateValueLength }.min() ?? 20)
            for f in frames(data, id, mx) {
                if !notifyQueue.isEmpty || !pm.updateValue(f, for: c, onSubscribedCentrals: nil) { notifyQueue.append(f) }
            }
        }
    }

    // MARK: πλαίσια
    private func frames(_ d: Data, _ id: UInt32, _ mtuPayload: Int) -> [Data] {
        let chunk = max(8, mtuPayload - 7)
        let total = (d.count + chunk - 1) / chunk
        guard total > 0, total <= 255 else { return [] }
        var out: [Data] = []
        for i in 0..<total {
            var f = Data([0xA7, UInt8((id >> 24) & 0xFF), UInt8((id >> 16) & 0xFF), UInt8((id >> 8) & 0xFF), UInt8(id & 0xFF), UInt8(i), UInt8(total)])
            let s = i * chunk
            f.append(d.subdata(in: s..<min(d.count, s + chunk)))
            out.append(f)
        }
        return out
    }

    private func recv(_ f: Data, from: String) {
        let b = [UInt8](f)
        guard b.count > 7, b[0] == 0xA7 else { return }
        let id = (UInt32(b[1]) << 24) | (UInt32(b[2]) << 16) | (UInt32(b[3]) << 8) | UInt32(b[4])
        let idx = Int(b[5]), total = Int(b[6])
        guard total > 0, idx < total else { return }
        let key = from + ":" + String(id)
        let now = Date()
        asm = asm.filter { now.timeIntervalSince($0.value.t) < 30 }
        var a = asm[key] ?? Asm(total: total, parts: [:], t: now)
        a.parts[idx] = Data(b[7...])
        a.t = now
        if a.parts.count == a.total {
            asm[key] = nil
            var full = Data()
            for i in 0..<a.total { guard let p = a.parts[i] else { return }; full.append(p) }
            if let s = String(data: full, encoding: .utf8) { onMessage?(s, from) }
        } else {
            asm[key] = a
        }
    }

    private func state() {
        var s = "on"
        if #available(iOS 13.1, *) {
            switch CBManager.authorization {
            case .denied, .restricted: s = "denied"
            default: break
            }
        }
        if s == "on" {
            if let c = cm {
                switch c.state {
                case .poweredOff: s = "off"
                case .unsupported: s = "unsupported"
                case .unauthorized: s = "denied"
                case .poweredOn: s = running ? "on" : "stopped"
                default: s = "starting"
                }
            } else { s = running ? "starting" : "stopped" }
        }
        var ids = Set(peerChar.keys)
        for k in subs.keys { ids.insert(k) }
        onState?(s, ids.count)
    }

    // MARK: central (ψάχνει / συνδέεται)
    private func scan() {
        guard running, let c = cm, c.state == .poweredOn else { return }
        c.stopScan()
        c.scanForPeripherals(withServices: [Self.svc], options: [CBCentralManagerScanOptionAllowDuplicatesKey: false])
    }

    func centralManagerDidUpdateState(_ c: CBCentralManager) {
        if c.state == .poweredOn { scan() } else { peers.removeAll(); peerChar.removeAll() }
        state()
    }

    func centralManager(_ c: CBCentralManager, didDiscover p: CBPeripheral, advertisementData: [String: Any], rssi: NSNumber) {
        guard running, peers[p.identifier] == nil, peers.count < Self.maxPeers else { return }
        peers[p.identifier] = p
        p.delegate = self
        c.connect(p, options: nil)
    }

    func centralManager(_ c: CBCentralManager, didConnect p: CBPeripheral) {
        p.discoverServices([Self.svc])
    }

    func centralManager(_ c: CBCentralManager, didFailToConnect p: CBPeripheral, error: Error?) {
        peers[p.identifier] = nil; peerChar[p.identifier] = nil
        state(); scan()
    }

    func centralManager(_ c: CBCentralManager, didDisconnectPeripheral p: CBPeripheral, error: Error?) {
        peers[p.identifier] = nil; peerChar[p.identifier] = nil
        state(); scan()
    }

    func peripheral(_ p: CBPeripheral, didDiscoverServices error: Error?) {
        guard let s = p.services?.first(where: { $0.uuid == Self.svc }) else { cm?.cancelPeripheralConnection(p); return }
        p.discoverCharacteristics([Self.chr], for: s)
    }

    func peripheral(_ p: CBPeripheral, didDiscoverCharacteristicsFor s: CBService, error: Error?) {
        guard let c = s.characteristics?.first(where: { $0.uuid == Self.chr }) else { cm?.cancelPeripheralConnection(p); return }
        peerChar[p.identifier] = c
        p.setNotifyValue(true, for: c)
        state()
        onPeer?()
    }

    func peripheral(_ p: CBPeripheral, didUpdateValueFor c: CBCharacteristic, error: Error?) {
        if let v = c.value { recv(v, from: p.identifier.uuidString) }
    }

    // MARK: peripheral (διαφημίζει / δέχεται)
    private func advertise() {
        guard running, let pm = pm, pm.state == .poweredOn else { return }
        if !serviceAdded {
            let c = CBMutableCharacteristic(type: Self.chr, properties: [.write, .writeWithoutResponse, .notify], value: nil, permissions: [.writeable])
            let s = CBMutableService(type: Self.svc, primary: true)
            s.characteristics = [c]
            char = c
            serviceAdded = true
            pm.add(s)   // η διαφήμιση ξεκινά στο didAdd
            return
        }
        if !pm.isAdvertising { pm.startAdvertising([CBAdvertisementDataServiceUUIDsKey: [Self.svc]]) }
    }

    func peripheralManagerDidUpdateState(_ p: CBPeripheralManager) {
        if p.state == .poweredOn { advertise() } else { serviceAdded = false; char = nil; subs.removeAll() }
        state()
    }

    func peripheralManager(_ p: CBPeripheralManager, didAdd service: CBService, error: Error?) {
        if error != nil { serviceAdded = false; char = nil; return }
        advertise()
    }

    func peripheralManager(_ p: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]) {
        for r in requests { if let v = r.value { recv(v, from: r.central.identifier.uuidString) } }
        if let first = requests.first { p.respond(to: first, withResult: .success) }
    }

    func peripheralManager(_ p: CBPeripheralManager, central: CBCentral, didSubscribeTo c: CBCharacteristic) {
        subs[central.identifier] = central
        state()
        onPeer?()
    }

    func peripheralManager(_ p: CBPeripheralManager, central: CBCentral, didUnsubscribeFrom c: CBCharacteristic) {
        subs[central.identifier] = nil
        state()
    }

    func peripheralManagerIsReady(toUpdateSubscribers p: CBPeripheralManager) {
        guard let c = char else { notifyQueue.removeAll(); return }
        while let f = notifyQueue.first {
            if p.updateValue(f, for: c, onSubscribedCentrals: nil) { notifyQueue.removeFirst() } else { return }
        }
    }
}
