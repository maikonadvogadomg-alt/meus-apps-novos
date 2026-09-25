// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR ELECTRON - Desktop (Windows/Mac/Linux)
// ═══════════════════════════════════════════════════════════════════════════

const GeradorElectronWorkflow = {
  // ── GERAR WORKFLOW GITHUB ACTIONS ──
  generateWorkflow() {
    return `name: Build Electron - Desktop

on:
  push:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    
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
    
    - name: Build app
      run: npm run build
    
    - name: Build Electron (Linux)
      if: runner.os == 'Linux'
      run: npm run build:electron:linux
    
    - name: Build Electron (macOS)
      if: runner.os == 'macOS'
      run: npm run build:electron:mac
    
    - name: Build Electron (Windows)
      if: runner.os == 'Windows'
      run: npm run build:electron:win
    
    - name: Upload artifacts (Linux)
      if: runner.os == 'Linux'
      uses: actions/upload-artifact@v3
      with:
        name: app-linux
        path: dist/app-*.AppImage
    
    - name: Upload artifacts (macOS)
      if: runner.os == 'macOS'
      uses: actions/upload-artifact@v3
      with:
        name: app-macos
        path: dist/app-*.dmg
    
    - name: Upload artifacts (Windows)
      if: runner.os == 'Windows'
      uses: actions/upload-artifact@v3
      with:
        name: app-windows
        path: dist/app-*.exe
    
    - name: Create Release
      uses: softprops/action-gh-release@v1
      if: startsWith(github.ref, 'refs/tags/')
      with:
        files: dist/app-*
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
  },

  // ── GERAR ELECTRON.JS ──
  generateElectronMain() {
    return `const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets/icons/icon-256.png')
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : \`file://\${path.join(__dirname, '../dist/index.html')}\`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: 'Cortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Ferramentas do Dev', accelerator: 'F12', role: 'toggleDevTools' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
`;
  },

  // ── GERAR PRELOAD.JS ──
  generatePreload() {
    return `const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    }
  }
});
`;
  },

  // ── GERAR ELECTRON BUILDER CONFIG ──
  generateElectronBuilder() {
    return JSON.stringify({
      "build": {
        "appId": "com.app.desktop",
        "productName": "Meu App",
        "files": [
          "dist/**/*",
          "node_modules/**/*",
          "package.json"
        ],
        "directories": {
          "buildResources": "assets/icons"
        },
        "win": {
          "target": ["nsis", "portable"],
          "certificateFile": null,
          "certificatePassword": null
        },
        "nsis": {
          "oneClick": false,
          "allowToChangeInstallationDirectory": true
        },
        "mac": {
          "target": ["dmg", "zip"],
          "category": "public.app-category.utilities"
        },
        "linux": {
          "target": ["AppImage", "deb"],
          "category": "Utility"
        }
      }
    }, null, 2);
  },

  // ── GERAR PACKAGE.JSON ELECTRON ──
  generatePackageJSON(projectName) {
    return JSON.stringify({
      "name": projectName.toLowerCase().replace(/\s+/g, '-'),
      "version": "1.0.0",
      "description": projectName,
      "main": "public/electron.js",
      "homepage": "./",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "electron-dev": "wait-on http://localhost:5173 && electron .",
        "electron-build": "npm run build && electron-builder",
        "start": "concurrently \\"npm run dev\\" \\"npm run electron- dev\\"",
      "build:electron:win": "npm run build && electron-builder --win",
      "build:electron:mac": "npm run build && electron-builder --mac",
      "build:electron:linux": "npm run build && electron-builder --linux"
    },
      "dependencies": {
      "react": "^18.0.0",
      "react-dom": "^18.0.0"
    },
      "devDependencies": {
      "electron": "^latest",
      "electron-builder": "^latest",
      "concurrently": "^latest",
      "wait-on": "^latest"
    }
        }, null, 2);
    },

// ── GERAR GUIA ──
generateSetupGuide() {
  return `# Guia: Build Electron

## Instalação Local

\`\`\`bash
npm install
npm start
\`\`\`

## Build para Desktop

### Windows
\`\`\`bash
npm run build:electron:win
\`\`\`

### macOS
\`\`\`bash
npm run build:electron:mac
\`\`\`

### Linux
\`\`\`bash
npm run build:electron:linux
\`\`\`

## Configurar Certificado (Opcional)

Para assinar o app no macOS:
1. Obtenha certificado no Apple Developer
2. Adicione em electron-builder.json

## Distribuição

Os arquivos compilados estarão em: \`dist/\`
`;
},

// ── APLICAR GERADOR ──
apply(project, config) {
  project.files['.github/workflows/build-electron.yml'] = this.generateWorkflow();
  project.files['public/electron.js'] = this.generateElectronMain();
  project.files['public/preload.js'] = this.generatePreload();
  project.files['electron-builder.json'] = this.generateElectronBuilder();
  project.files['ELECTRON_SETUP.md'] = this.generateSetupGuide();

  return {
    success: true,
    files: [
      '.github/workflows/build-electron.yml',
      'public/electron.js',
      'public/preload.js',
      'electron-builder.json',
      'ELECTRON_SETUP.md'
    ]
  };
}
};
