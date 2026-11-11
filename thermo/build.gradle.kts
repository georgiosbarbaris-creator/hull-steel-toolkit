plugins { id("com.android.application") }
android {
    namespace = "gr.barbaris.thermo"
    compileSdk = 34
    defaultConfig {
        applicationId = "gr.barbaris.thermo"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    // The page is shared with the iPhone web app: docs/thermo
    sourceSets { getByName("main") { assets.setSrcDirs(listOf("../docs/thermo")) } }
    buildTypes { release { isMinifyEnabled = false } }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
dependencies {
    implementation("androidx.webkit:webkit:1.11.0")
}
