// Επιβίωση 72+ – iOS.  Created by George Barbaris
import UIKit
import WebKit
import CoreMotion

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ app: UIApplication, didFinishLaunchingWithOptions o: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let w = UIWindow(frame: UIScreen.main.bounds)
        w.rootViewController = WebViewController()
        w.makeKeyAndVisible()
        window = w
        return true
    }
}

final class WebViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
    private var web: WKWebView!
    private let scheme = AppScheme()
    private lazy var altimeter = CMAltimeter()
    private var baroSum = 0.0, baroN = 0, baroLast = Date.distantPast
    private static let bg = UIColor(red: 0.039, green: 0.082, blue: 0.133, alpha: 1)

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }

    override func loadView() {
        let cfg = WKWebViewConfiguration()
        cfg.setURLSchemeHandler(scheme, forURLScheme: AppScheme.scheme)
        cfg.websiteDataStore = .default()
        cfg.allowsInlineMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []
        cfg.userContentController.add(WeakHandler(self), name: "native")
        cfg.applicationNameForUserAgent = "Survival72App/iOS"

        web = WKWebView(frame: .zero, configuration: cfg)
        web.navigationDelegate = self
        web.uiDelegate = self
        web.allowsBackForwardNavigationGestures = true
        web.isOpaque = false
        web.backgroundColor = Self.bg
        web.scrollView.backgroundColor = Self.bg
        web.scrollView.contentInsetAdjustmentBehavior = .never   // η σελίδα χειρίζεται μόνη της το safe area (viewport-fit=cover)
        view = web
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        web.load(URLRequest(url: AppScheme.start))
    }

    // MARK: πλοήγηση – ό,τι δεν είναι της εφαρμογής (τηλέφωνο, SMS, χάρτες, sites) ανοίγει έξω
    func webView(_ w: WKWebView, decidePolicyFor a: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = a.request.url, let s = url.scheme?.lowercased() else { decisionHandler(.cancel); return }
        if s == AppScheme.scheme || s == "about" || s == "blob" || s == "data" { decisionHandler(.allow); return }
        decisionHandler(.cancel)
        UIApplication.shared.open(url)
    }

    func webView(_ w: WKWebView, createWebViewWith c: WKWebViewConfiguration, for a: WKNavigationAction, windowFeatures f: WKWindowFeatures) -> WKWebView? {
        if let url = a.request.url {
            if url.scheme == AppScheme.scheme { w.load(a.request) } else { UIApplication.shared.open(url) }
        }
        return nil
    }

    func webViewWebContentProcessDidTerminate(_ w: WKWebView) { w.reload() }

    // MARK: άδειες κάμερας/μικροφώνου/κίνησης – το iOS ρωτάει τον χρήστη μία φορά
    @available(iOS 15.0, *)
    func webView(_ w: WKWebView, requestMediaCapturePermissionFor o: WKSecurityOrigin, initiatedByFrame f: WKFrameInfo, type: WKMediaCaptureType, decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        decisionHandler(.grant)
    }

    @available(iOS 15.0, *)
    func webView(_ w: WKWebView, requestDeviceOrientationAndMotionPermissionFor o: WKSecurityOrigin, initiatedByFrame f: WKFrameInfo, decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        decisionHandler(.grant)
    }

    // MARK: alert / confirm / prompt της σελίδας
    func webView(_ w: WKWebView, runJavaScriptAlertPanelWithMessage m: String, initiatedByFrame f: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let a = UIAlertController(title: nil, message: m, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(a, completionHandler: nil) ?? completionHandler()
    }

    func webView(_ w: WKWebView, runJavaScriptConfirmPanelWithMessage m: String, initiatedByFrame f: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let a = UIAlertController(title: nil, message: m, preferredStyle: .alert)
        a.addAction(UIAlertAction(title: cancelText, style: .cancel) { _ in completionHandler(false) })
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        present(a, completionHandler: nil) ?? completionHandler(false)
    }

    func webView(_ w: WKWebView, runJavaScriptTextInputPanelWithPrompt p: String, defaultText d: String?, initiatedByFrame f: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        let a = UIAlertController(title: nil, message: p, preferredStyle: .alert)
        a.addTextField { $0.text = d }
        a.addAction(UIAlertAction(title: cancelText, style: .cancel) { _ in completionHandler(nil) })
        a.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(a.textFields?.first?.text ?? "") })
        present(a, completionHandler: nil) ?? completionHandler(nil)
    }

    private var cancelText: String { Locale.preferredLanguages.first?.hasPrefix("el") == true ? "Άκυρο" : "Cancel" }

    /// Αν υπάρχει ήδη παράθυρο ανοιχτό, δεν δείχνει δεύτερο (επιστρέφει nil για να απαντήσει αμέσως).
    private func present(_ vc: UIViewController, completionHandler: (() -> Void)?) -> Void? {
        guard presentedViewController == nil, view.window != nil else { return nil }
        super.present(vc, animated: true, completion: completionHandler)
        return ()
    }

    // MARK: γέφυρα από τη σελίδα (shim.js)
    func userContentController(_ uc: WKUserContentController, didReceive m: WKScriptMessage) {
        guard let body = m.body as? [String: Any], let cmd = body["cmd"] as? String else { return }
        let a = ((body["a"] as? String)?.data(using: .utf8)).flatMap { try? JSONSerialization.jsonObject(with: $0) as? [String: Any] } ?? [:]
        switch cmd {
        case "share":
            var items: [Any] = []
            if let t = a["text"] as? String, !t.isEmpty { items.append(t) }
            for f in (a["files"] as? [[String: Any]]) ?? [] {
                if let d = (f["data"] as? String).flatMap({ Data(base64Encoded: $0) }), let u = tmpFile(f["name"] as? String, d) { items.append(u) }
            }
            if !items.isEmpty { shareSheet(items) }
        case "save":
            if let d = (a["data"] as? String).flatMap({ Data(base64Encoded: $0) }), let u = tmpFile(a["name"] as? String, d) { shareSheet([u]) }
        case "saveUrl":
            if let s = a["url"] as? String, let url = URL(string: s), url.scheme == AppScheme.scheme {
                let rel = AppScheme.rel(of: url)
                if let d = scheme.data(for: rel), let u = tmpFile((a["name"] as? String) ?? (rel as NSString).lastPathComponent, d) { shareSheet([u]) }
            }
        case "print":
            let p = UIPrintInteractionController.shared
            let info = UIPrintInfo(dictionary: nil)
            info.outputType = .general
            info.jobName = (a["title"] as? String) ?? "Survival 72+"
            p.printInfo = info
            p.printFormatter = web.viewPrintFormatter()
            p.present(animated: true)
        case "baro":
            baro((a["on"] as? Bool) ?? false)
        case "wake":
            UIApplication.shared.isIdleTimerDisabled = (a["on"] as? Bool) ?? false
        default: break
        }
    }

    // MARK: βαρόμετρο (CMAltimeter – πίεση σε kPa → hPa)
    private func baro(_ on: Bool) {
        guard on else { altimeter.stopRelativeAltitudeUpdates(); return }
        guard CMAltimeter.isRelativeAltitudeAvailable() else { sendBaro(nil, "none"); return }
        let st = CMAltimeter.authorizationStatus()
        if st == .denied || st == .restricted { sendBaro(nil, "denied"); return }
        baroSum = 0; baroN = 0; baroLast = .distantPast
        altimeter.stopRelativeAltitudeUpdates()
        altimeter.startRelativeAltitudeUpdates(to: .main) { [weak self] d, err in
            guard let self = self else { return }
            if err != nil {
                let st = CMAltimeter.authorizationStatus()
                self.sendBaro(nil, (st == .denied || st == .restricted) ? "denied" : "none"); return
            }
            guard let d = d else { return }
            self.baroSum += d.pressure.doubleValue * 10; self.baroN += 1
            if Date().timeIntervalSince(self.baroLast) >= 2, self.baroN > 0 {   // μέσος όρος κάθε 2″
                let v = self.baroSum / Double(self.baroN); self.baroSum = 0; self.baroN = 0; self.baroLast = Date()
                self.sendBaro(v, "")
            }
        }
    }

    private func sendBaro(_ v: Double?, _ err: String) {
        let val = v.map { String(format: "%.2f", locale: Locale(identifier: "en_US_POSIX"), $0) } ?? "null"
        web.evaluateJavaScript("window.__baro&&__baro(\(val),'\(err)')", completionHandler: nil)
    }

    private func tmpFile(_ name: String?, _ d: Data) -> URL? {
        let dir = FileManager.default.temporaryDirectory.appendingPathComponent("out", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        let clean = (name?.isEmpty == false ? name! : "file").components(separatedBy: CharacterSet(charactersIn: "/\\:*?\"<>|")).joined(separator: "_")
        let u = dir.appendingPathComponent(clean)
        return (try? d.write(to: u, options: .atomic)) != nil ? u : nil
    }

    private func shareSheet(_ items: [Any]) {
        let vc = UIActivityViewController(activityItems: items, applicationActivities: nil)
        if let pop = vc.popoverPresentationController {   // iPad
            pop.sourceView = view
            pop.sourceRect = CGRect(x: view.bounds.midX, y: view.bounds.maxY - 40, width: 1, height: 1)
        }
        _ = present(vc, completionHandler: nil)
    }
}

/// Αποφεύγει τον κύκλο μνήμης WKUserContentController → controller.
final class WeakHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ t: WKScriptMessageHandler) { target = t }
    func userContentController(_ uc: WKUserContentController, didReceive m: WKScriptMessage) { target?.userContentController(uc, didReceive: m) }
}
