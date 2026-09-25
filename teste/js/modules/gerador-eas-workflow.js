// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR EAS - APK/IOS via Expo
// ═══════════════════════════════════════════════════════════════════════════

const GeradorEASWorkflow = {
  // ── GERAR WORKFLOW GITHUB ACTIONS ──
  generateWorkflow() {
    return `name: Build EAS - APK/iOS

on:
  push:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  build-eas:
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
    
    - name: Setup EAS CLI
      run: npm install -g eas-cli
    
    - name: Build APK with EAS
      run: eas build --platform android --non-interactive
      env:
        EAS_TOKEN: \${{ secrets.EAS_TOKEN }}
    
    - name: Build iOS with EAS
      run: eas build --platform ios --non-interactive
      env:
        EAS_TOKEN: \${{ secrets.EAS_TOKEN }}
    
    - name: Download builds
      run: |
        eas build:list --limit 1
        eas build:download --id <build-id> --path ./builds
    
    - name: Upload Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: eas-builds
        path: builds/
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      if: startsWith(github.ref, 'refs/tags/')
      with:
        files: builds/*
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
  },

  // ── GERAR EAS.JSON ──
  generateEASConfig(projectName, appId) {
    return JSON.stringify({
      "cli": {
        "version": ">= 5.0.0"
      },
      "build": {
        "development": {
          "developmentClient": true,
          "distribution": "internal"
        },
        "preview": {
          "distribution": "internal"
        },
        "production": {
          "distribution": "store"
        }
      },
      "submit": {
        "production": {
          "android": {
            "serviceAccount": "google-services.json",
            "track": "production"
          },
          "ios": {
            "appleId": "seu-email@apple.com",
            "ascAppId": "seu-app-id"
          }
        }
      }
    }, null, 2);
  },

  // ── GERAR APP.JSON ──
  generateAppJSON(projectName, appId, config) {
    return JSON.stringify({
      "expo": {
        "name": projectName,
        "slug": projectName.toLowerCase().replace(/\s+/g, '-'),
        "version": config.appVersion || "1.0.0",
        "orientation": config.appOrientation || "portrait",
        "icon": "./assets/icons/icon-192.png",
        "userInterfaceStyle": "dark",
        "splash": {
          "image": "./assets/icons/icon-512.png",
          "resizeMode": "contain",
          "backgroundColor": "#0f172a"
        },
        "assetBundlePatterns": ["**/*"],
        "ios": {
          "supportsTabletMode": true,
          "bundleIdentifier": appId,
          "buildNumber": "1"
        },
        "android": {
          "adaptiveIcon": {
            "foregroundImage": "./assets/icons/icon-192.png",
            "backgroundColor": "#0f172a"
          },
          "package": appId,
          "versionCode": 1,
          "minSdkVersion": config.apiMin || 21,
          "targetSdkVersion": config.apiMax || 33
        },
        "web": {
          "favicon": "./assets/icons/favicon.png"
        },
        "plugins": [
          [
            "expo-build-properties",
            {
              "android": {
                "minSdkVersion": config.apiMin || 21,
                "targetSdkVersion": config.apiMax || 33
              }
            }
          ]
        ]
      }
    }, null, 2);
  },

  // ── GERAR GUIA DE SETUP ──
  generateSetupGuide() {
    return `# Guia: Configurar EAS

## Passo 1: Criar conta Expo

Acesse: https://expo.dev

## Passo 2: Instalar EAS CLI

\`\`\`bash
npm install -g eas-cli
\`\`\`

## Passo 3: Login

\`\`\`bash
eas login
\`\`\`

## Passo 4: Inicializar projeto

\`\`\`bash
eas build:configure
\`\`\`

## Passo 5: Gerar token

\`\`\`bash
eas token create
\`\`\`

## Passo 6: Adicionar Secret no GitHub

Settings → Secrets → EAS_TOKEN

## Passo 7: Build local

\`\`\`bash
eas build --platform android
eas build --platform ios
\`\`\`

## Passo 8: Submit para stores

\`\`\`bash
eas submit --platform android
eas submit --platform ios
\`\`\`
`;
  },

  // ── APLICAR GERADOR ──
  apply(project, config) {
    const appId = config.appId || 'com.app.' + project.name.toLowerCase().replace(/\s+/g, '');

    project.files['.github/workflows/build-eas.yml'] = this.generateWorkflow();
    project.files['eas.json'] = this.generateEASConfig(project.name, appId);
    project.files['app.json'] = this.generateAppJSON(project.name, appId, config);
    project.files['EAS_SETUP.md'] = this.generateSetupGuide();

    return {
      success: true,
      files: [
        '.github/workflows/build-eas.yml',
        'eas.json',
        'app.json',
        'EAS_SETUP.md'
      ]
    };
  }
}; 