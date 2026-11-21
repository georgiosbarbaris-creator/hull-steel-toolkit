// Επιβίωση 72+ – iOS.  Created by George Barbaris
// Σερβίρει τη σελίδα στη διεύθυνση app://survival/ με τη σειρά:
//   1. Με internet: τη νέα έκδοση από το site (περιμένει έως 3,5″ αν υπάρχει ήδη αποθηκευμένη)
//   2. Χωρίς internet: την τελευταία που έχει κατεβάσει
//   3. Πρώτη φορά χωρίς internet: το αντίγραφο που είναι μέσα στην εφαρμογή
// Η native γέφυρα (shim.js) μπαίνει μόνο εδώ, ποτέ στο site.
import Foundation
import WebKit

final class AppScheme: NSObject, WKURLSchemeHandler {
    static let scheme = "app"
    static let host = "survival"
    static let start = URL(string: "app://survival/index.html")!
    static let site = URL(string: "https://georgiosbarbaris-creator.github.io/hull-steel-toolkit/survival/")!
    static let waitWithCopy: TimeInterval = 3.5

    let liveDir: URL
    let bundleDir: URL?
    let shim: String
    private let lock = NSLock()
    private var checked = Set<String>()
    private var stopped = Set<ObjectIdentifier>()
    private let session: URLSession = {
        let c = URLSessionConfiguration.default
        c.requestCachePolicy = .reloadIgnoringLocalCacheData
        c.timeoutIntervalForRequest = 20
        return URLSession(configuration: c)
    }()

    override init() {
        let fm = FileManager.default
        let support = fm.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        liveDir = support.appendingPathComponent("live", isDirectory: true)
        bundleDir = Bundle.main.url(forResource: "survival", withExtension: nil)
        shim = (Bundle.main.url(forResource: "shim", withExtension: "js")).flatMap { try? String(contentsOf: $0, encoding: .utf8) } ?? ""
        super.init()
        // νέα έκδοση της εφαρμογής → καθαρή αρχή από το νέο αντίγραφο
        let ver = (Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "") + (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "")
        if UserDefaults.standard.string(forKey: "liveVer") != ver {
            try? fm.removeItem(at: liveDir)
            UserDefaults.standard.set(ver, forKey: "liveVer")
        }
        try? fm.createDirectory(at: liveDir, withIntermediateDirectories: true)
        var u = liveDir
        var rv = URLResourceValues(); rv.isExcludedFromBackup = true
        try? u.setResourceValues(rv)
    }

    static func rel(of url: URL) -> String {
        var p = url.path
        if p.hasPrefix("/") { p.removeFirst() }
        if p.isEmpty || p.hasSuffix("/") { p += "index.html" }
        return p.removingPercentEncoding ?? p
    }

    func liveFile(_ rel: String) -> URL? { rel.contains("..") ? nil : liveDir.appendingPathComponent(rel) }
    func bundleFile(_ rel: String) -> URL? { rel.contains("..") ? nil : bundleDir?.appendingPathComponent(rel) }

    func data(for rel: String) -> Data? {
        if let l = liveFile(rel), let d = try? Data(contentsOf: l) { return d }
        if let b = bundleFile(rel), let d = try? Data(contentsOf: b) { return d }
        return nil
    }

    private func isChecked(_ rel: String) -> Bool { lock.lock(); defer { lock.unlock() }; return checked.contains(rel) }

    /// Κατεβάζει από το site. 200 → αποθηκεύει, 304 → ισχύει το αποθηκευμένο.
    private func fetch(_ rel: String, done: @escaping () -> Void) {
        guard let file = liveFile(rel) else { done(); return }
        let tag = file.appendingPathExtension("etag")
        var req = URLRequest(url: AppScheme.site.appendingPathComponent(rel))
        req.setValue("no-cache", forHTTPHeaderField: "Cache-Control")
        if FileManager.default.fileExists(atPath: file.path), let et = try? String(contentsOf: tag, encoding: .utf8) {
            req.setValue(et, forHTTPHeaderField: "If-None-Match")
        }
        session.dataTask(with: req) { [weak self] data, resp, _ in
            defer { done() }
            guard let self = self, let h = resp as? HTTPURLResponse else { return }
            if h.statusCode == 200, let data = data {
                try? FileManager.default.createDirectory(at: file.deletingLastPathComponent(), withIntermediateDirectories: true)
                if (try? data.write(to: file, options: .atomic)) != nil {
                    if let et = h.value(forHTTPHeaderField: "ETag") { try? et.write(to: tag, atomically: true, encoding: .utf8) }
                    else { try? FileManager.default.removeItem(at: tag) }
                }
            }
            if h.statusCode == 200 || h.statusCode == 304 {
                self.lock.lock(); self.checked.insert(rel); self.lock.unlock()
            }
        }.resume()
    }

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url else { return }
        let rel = AppScheme.rel(of: url)
        let id = ObjectIdentifier(task)
        DispatchQueue.global(qos: .userInitiated).async {
            if rel != "sw.js" && !self.isChecked(rel) {
                let have = (self.liveFile(rel).map { FileManager.default.fileExists(atPath: $0.path) } ?? false)
                    || (self.bundleFile(rel).map { FileManager.default.fileExists(atPath: $0.path) } ?? false)
                let sem = DispatchSemaphore(value: 0)
                self.fetch(rel) { sem.signal() }
                _ = sem.wait(timeout: .now() + (have ? AppScheme.waitWithCopy : 60))
            }
            var body = rel == "sw.js" ? nil : self.data(for: rel)   // η εφαρμογή κάνει μόνη της το offline
            if rel == "index.html", let b = body, !self.shim.isEmpty, var html = String(data: b, encoding: .utf8) {
                let tag = "<script>" + self.shim + "</script>"
                if let r = html.range(of: "<head>", options: .caseInsensitive) { html.insert(contentsOf: tag, at: r.upperBound) } else { html = tag + html }
                body = html.data(using: .utf8)
            }
            DispatchQueue.main.async {
                self.lock.lock(); let gone = self.stopped.remove(id) != nil; self.lock.unlock()
                if gone { return }
                let mime = AppScheme.mime(rel)
                let ok = body != nil
                let headers = ["Content-Type": mime + (mime.hasPrefix("text/") || mime.contains("json") || mime.contains("javascript") ? "; charset=utf-8" : ""),
                               "Content-Length": String(body?.count ?? 0),
                               "Cache-Control": "no-store",
                               "Access-Control-Allow-Origin": "*"]
                let r = HTTPURLResponse(url: url, statusCode: ok ? 200 : 404, httpVersion: "HTTP/1.1", headerFields: headers)!
                task.didReceive(r)
                task.didReceive(body ?? Data())
                task.didFinish()
            }
        }
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {
        lock.lock(); stopped.insert(ObjectIdentifier(task)); lock.unlock()
    }

    static func mime(_ name: String) -> String {
        switch (name as NSString).pathExtension.lowercased() {
        case "html", "htm": return "text/html"
        case "js": return "application/javascript"
        case "json": return "application/json"
        case "webmanifest": return "application/manifest+json"
        case "css": return "text/css"
        case "pdf": return "application/pdf"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "svg": return "image/svg+xml"
        case "ics": return "text/calendar"
        case "txt": return "text/plain"
        default: return "application/octet-stream"
        }
    }
}
