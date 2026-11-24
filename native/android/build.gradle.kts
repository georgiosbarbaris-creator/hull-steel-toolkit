plugins { id("com.android.application") }
// Επιβίωση 72+ – Android. Η σελίδα είναι η ΙΔΙΑ με το web (docs/survival) – δεν αλλάζει τίποτα εκεί.
android {
    namespace = "gr.barbaris.survival72"
    compileSdk = 36
    defaultConfig {
        applicationId = "gr.barbaris.survival72"
        minSdk = 26
        targetSdk = 36
        versionCode = 5
        versionName = "1.4"
    }
    // Offline αντίγραφο = docs/survival (όπως είναι τη στιγμή του build) + η native γέφυρα
    sourceSets { getByName("main") { assets.setSrcDirs(listOf("../../docs/survival", "../shared")) } }
    signingConfigs {
        create("release") {
            val ks = System.getenv("SURVIVAL_KEYSTORE")
            if (ks != null && file(ks).exists()) {
                storeFile = file(ks)
                storePassword = System.getenv("SURVIVAL_KEYSTORE_PASSWORD")
                keyAlias = "survival72"
                keyPassword = System.getenv("SURVIVAL_KEYSTORE_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            val ks = System.getenv("SURVIVAL_KEYSTORE")
            signingConfig = if (ks != null && file(ks).exists()) signingConfigs.getByName("release") else signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies {
    implementation("androidx.core:core:1.13.1")
}
