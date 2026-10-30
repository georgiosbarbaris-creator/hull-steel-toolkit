plugins { id("com.android.application") }
android {
    namespace = "gr.barbaris.hst"
    compileSdk = 34
    defaultConfig {
        applicationId = "gr.barbaris.hst"
        minSdk = 26
        targetSdk = 34
        versionCode = 3
        versionName = "1.2"
    }
    buildTypes { release { isMinifyEnabled = false } }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies {
    implementation("androidx.webkit:webkit:1.11.0")
    implementation("androidx.core:core:1.13.1")
}
