# Hull Steel Toolkit (Android)

Offline εφαρμογή: UT gauging assessment (OK / Substantial / Renew) + Steel weight calculator.
Η εφαρμογή είναι το `app/src/main/assets/index.html` — για αλλαγές, αλλάζεις μόνο αυτό και ξαναχτίζεις.

## Build με Android Studio
1. Άνοιξε Android Studio → Open → αυτός ο φάκελος. Περίμενε το Gradle sync (κατεβάζει μόνο του ό,τι χρειάζεται).
2. Build → Build App Bundle(s) / APK(s) → Build APK(s).
3. Το APK: `app/build/outputs/apk/debug/app-debug.apk`.

## Build με GitHub (χωρίς Android Studio)
1. Νέο repository στο GitHub → Upload files → ανέβασε όλα τα αρχεία του φακέλου (και τον `.github`).
2. Actions → "Build APK" τρέχει μόνο του (~4 λεπτά).
3. Άνοιξε το run → Artifacts → HullSteel-apk → κατέβασε, unzip → app-debug.apk.

## Εγκατάσταση στο κινητό
Στείλε το APK στο κινητό, άνοιξέ το, επίτρεψε "Install unknown apps" για τα Files/Chrome.
