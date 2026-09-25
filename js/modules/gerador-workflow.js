// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR DE WORKFLOWS
// ═══════════════════════════════════════════════════════════════════════════

const GeradorWorkflow = {
  // ── GERAR WORKFLOW GITHUB ACTIONS (APK) ──
  generateGitHubActionsAPK() {
    return `name: Build APK

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'adopt'
    
    - name: Build APK with Capacitor
      run: |
        npm run build
        npx cap add android
        npx cap build android
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release.apk
        path: android/app/build/outputs/apk/release/app-release.apk
`;
  },

  // ── GERAR WORKFLOW GITHUB ACTIONS (IOS) ──
  generateGitHubActionsIOS() {
    return `name: Build iOS

on:
  push:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build iOS with Capacitor
      run: |
        npm run build
        npx cap add ios
        npx cap build ios
    
    - name: Build IPA
      run: |
        cd ios/App
        pod install
        xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -derivedDataPath build
`;
  },

  // ── GERAR WORKFLOW GITHUB ACTIONS (WEB) ──
  generateGitHubActionsWeb() {
    return `name: Deploy Web

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
`;
  },

  // ── GERAR WORKFLOW GITHUB ACTIONS (DESKTOP) ──
  generateGitHubActionsDesktop() {
    return `name: Build Desktop

on:
  push:
    branches: [ main, develop ]

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build:electron
    - uses: actions/upload-artifact@v3
      with:
        name: app-windows.exe
        path: dist/app-*.exe

  build-macos:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build:electron
    - uses: actions/upload-artifact@v3
      with:
        name: app-macos.dmg
        path: dist/app-*.dmg

  build-linux:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build:electron
    - uses: actions/upload-artifact@v3
      with:
        name: app-linux.AppImage
        path: dist/app-*.AppImage
`;
  }
};