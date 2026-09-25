// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR CAPACITOR - APK via GitHub Actions
// ═══════════════════════════════════════════════════════════════════════════

const GeradorCapacitor = {
  // ── GERAR WORKFLOW GITHUB ACTIONS ──
  generateWorkflow() {
    return `name: Build APK - Capacitor

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build web
      run: npm run build
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
        cache: gradle
    
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    
    - name: Install Capacitor CLI
      run: npm install -g @capacitor/cli
    
    - name: Add Android platform
      run: npx cap add android
    
    - name: Build Android
      run: npx cap build android
    
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleRelease
    
    - name: Sign APK
      uses: r0adkll/sign-android-release@v1
      with:
        releaseDirectory: android/app/build/outputs/apk/release
        signingKeyBase64: \${{ secrets.ANDROID_SIGNING_KEY }}
        alias: \${{ secrets.ANDROID_ALIAS }}
        keyStorePassword: \${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
        keyPassword: \${{ secrets.ANDROID_KEY_PASSWORD }}
    
    - name: Upload APK Artifact
      uses: actions/upload-artifact@v3
      with:
        name: app-release.apk
        path: android/app/build/outputs/apk/release/app-release-signed.apk
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      if: startsWith(github.ref, 'refs/tags/')
      with:
        files: android/app/build/outputs/apk/release/app-release-signed.apk
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
  },

  // ── GERAR CAPACITOR.JSON ──
  generateCapacitorConfig(projectName, appId) {
    return JSON.stringify({
      "appId": appId,
      "appName": projectName,
      "webDir": "dist",
      "bundledWebRuntime": false,
      "plugins": {
        "SplashScreen": {
          "launchShowDuration": 0
        }
      },
      "server": {
        "androidScheme": "https"
      }
    }, null, 2);
  },

  // ── GERAR ANDROID GRADLE ──
  generateAndroidGradle(apiMin = 21, apiMax = 33) {
    return `android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.example.app"
        minSdkVersion ${apiMin}
        targetSdkVersion ${apiMax}
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'com.getcapacitor:android:5.0.0'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
`;
  },

  // ── GERAR SECRETS PARA GITHUB ──
  generateSecretsGuide() {
    return `# Guia: Configurar Secrets no GitHub

## Passo 1: Gerar Keystore

\`\`\`bash
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
\`\`\`

## Passo 2: Converter para Base64

\`\`\`bash
base64 my-release-key.keystore > keystore.txt
\`\`\`

## Passo 3: Adicionar Secrets no GitHub

Vá para: Settings → Secrets and variables → Actions

Adicione:
- **ANDROID_SIGNING_KEY**: (conteúdo do keystore.txt)
- **ANDROID_ALIAS**: my-key-alias
- **ANDROID_KEYSTORE_PASSWORD**: sua-senha
- **ANDROID_KEY_PASSWORD**: sua-senha

## Passo 4: Push para ativar

\`\`\`bash
git push origin main
\`\`\`
`;
  },

  // ── GERAR PACKAGE.JSON COM SCRIPTS ──
  generatePackageJSON() {
    return JSON.stringify({
      "name": "app-capacitor",
      "version": "1.0.0",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "cap:add:android": "npx cap add android",
        "cap:build:android": "npx cap build android",
        "cap:sync": "npx cap sync",
        "cap:open:android": "npx cap open android"
      },
      "dependencies": {
        "@capacitor/core": "^5.0.0",
        "@capacitor/android": "^5.0.0"
      },
      "devDependencies": {
        "@capacitor/cli": "^5.0.0",
        "vite": "^4.0.0"
      }
    }, null, 2);
  },

  // ── APLICAR GERADOR ──
  apply(project, config) {
    const appId = config.appId || 'com.app.' + project.name.toLowerCase().replace(/\s+/g, '');

    project.files['.github/workflows/build-capacitor.yml'] = this.generateWorkflow();
    project.files['capacitor.config.json'] = this.generateCapacitorConfig(project.name, appId);
    project.files['android/app/build.gradle'] = this.generateAndroidGradle(config.apiMin || 21, config.apiMax || 33);
    project.files['CAPACITOR_SETUP.md'] = this.generateSecretsGuide();

    return {
      success: true,
      files: [
        '.github/workflows/build-capacitor.yml',
        'capacitor.config.json',
        'android/app/build.gradle',
        'CAPACITOR_SETUP.md'
      ]
    };
  }
};
