plugins { id("com.android.application") }
android {
    namespace = "gr.barbaris.hst"
    compileSdk = 34
    defaultConfig {
        applicationId = "gr.barbaris.hst"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    buildTypes { release { isMinifyEnabled = false } }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies { implementation("androidx.webkit:webkit:1.11.0") }
