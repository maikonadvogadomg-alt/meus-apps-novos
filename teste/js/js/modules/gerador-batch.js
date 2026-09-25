// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR BATCH - Setup automático no Windows
// ═══════════════════════════════════════════════════════════════════════════

const GeradorBatch = {
  // ── GERAR BATCH SCRIPT ──
  generateBatchScript(projectName, projectPath = 'C:\\Projetos') {
    const safeName = projectName.replace(/[<>:"|?*]/g, '').replace(/\s+/g, '_');
    const fullPath = `${projectPath}\\${safeName}`;

    return `@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ═══════════════════════════════════════════════════════════════════════════
REM SETUP AUTOMÁTICO - ${projectName}
REM ═══════════════════════════════════════════════════════════════════════════

echo.
echo 🚀 Iniciando setup do projeto: ${projectName}
echo 📁 Caminho: ${fullPath}
echo.

REM Criar diretório principal
if not exist "${fullPath}" (
    mkdir "${fullPath}"
    echo ✅ Pasta criada: ${fullPath}
) else (
    echo ⚠️ Pasta já existe: ${fullPath}
)

cd /d "${fullPath}"

REM Criar estrutura de pastas
echo.
echo 📂 Criando estrutura de pastas...

mkdir src 2>nul
mkdir public 2>nul
mkdir assets 2>nul
mkdir assets\\icons 2>nul
mkdir assets\\images 2>nul
mkdir .github\\workflows 2>nul
mkdir node_modules 2>nul

echo ✅ Pastas criadas com sucesso

REM Criar arquivos básicos
echo.
echo 📄 Criando arquivos...

REM index.html
(
    echo ^<!DOCTYPE html^>
    echo ^<html lang="pt-BR"^>
    echo ^<head^>
    echo     ^<meta charset="UTF-8"^>
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
    echo     ^<title^>${projectName}^</title^>
    echo     ^<link rel="stylesheet" href="./style.css"^>
    echo ^</head^>
    echo ^<body^>
    echo     ^<div id="app"^>
    echo         ^<h1^>Bem-vindo ao ${projectName}^</h1^>
    echo         ^<p^>Projeto criado com Hub Jurídico^</p^>
    echo     ^</div^>
    echo     ^<script src="./script.js"^</script^>
    echo ^</body^>
    echo ^</html^>
) > index.html

echo ✅ index.html criado

REM style.css
(
    echo * {
    echo     margin: 0;
    echo     padding: 0;
    echo     box-sizing: border-box;
    echo }
    echo.
    echo body {
    echo     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    echo     background-color: #0f172a;
    echo     color: #e2e8f0;
    echo     padding: 20px;
    echo }
    echo.
    echo #app {
    echo     max-width: 1200px;
    echo     margin: 0 auto;
    echo     text-align: center;
    echo }
) > style.css

echo ✅ style.css criado

REM script.js
(
    echo console.log('${projectName} iniciado!');
    echo document.addEventListener('DOMContentLoaded', function(^) {
    echo     console.log('DOM carregado');
    echo });
) > script.js

echo ✅ script.js criado

REM package.json
(
    echo {
    echo   "name": "${safeName}",
    echo   "version": "1.0.0",
    echo   "description": "${projectName}",
    echo   "main": "index.js",
    echo   "scripts": {
    echo     "dev": "npx http-server -p 8000 -c-1",
    echo     "build": "echo Build script aqui"
    echo   },
    echo   "keywords": [],
    echo   "author": "",
    echo   "license": "MIT"
    echo }
) > package.json

echo ✅ package.json criado

REM .gitignore
(
    echo node_modules/
    echo dist/
    echo build/
    echo .env
    echo .DS_Store
) > .gitignore

echo ✅ .gitignore criado

REM README.md
(
    echo # ${projectName}
    echo.
    echo Projeto criado com Hub Jurídico
    echo.
    echo ## Instalação
    echo.
    echo \`\`\`bash
    echo npm install
    echo \`\`\`
    echo.
    echo ## Desenvolvimento
    echo.
    echo \`\`\`bash
    echo npm run dev
    echo \`\`\`
    echo.
    echo ## Build
    echo.
    echo \`\`\`bash
    echo npm run build
    echo \`\`\`
) > README.md

echo ✅ README.md criado

REM Instalar dependências
echo.
echo 📦 Instalando dependências...
call npm install

REM Iniciar servidor
echo.
echo 🌐 Iniciando servidor local...
echo.
echo ✅ Servidor rodando em: http://localhost:8000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm run dev

pause
`;
  },

  // ── GERAR BATCH PARA POWERSHELL ──
  generatePowerShellScript(projectName, projectPath = 'C:\\Projetos') {
    const safeName = projectName.replace(/[<>:"|?*]/g, '').replace(/\s+/g, '_');
    const fullPath = `${projectPath}\\${safeName}`;

    return `# ═══════════════════════════════════════════════════════════════════════════
# SETUP AUTOMÁTICO - ${projectName}
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "🚀 Iniciando setup do projeto: ${projectName}" -ForegroundColor Green
Write-Host "📁 Caminho: ${fullPath}" -ForegroundColor Cyan
Write-Host ""

# Criar diretório principal
if (-not (Test-Path "${fullPath}")) {
    New-Item -ItemType Directory -Path "${fullPath}" | Out-Null
    Write-Host "✅ Pasta criada: ${fullPath}" -ForegroundColor Green
} else {
    Write-Host "⚠️ Pasta já existe: ${fullPath}" -ForegroundColor Yellow
}

Set-Location "${fullPath}"

# Criar estrutura de pastas
Write-Host ""
Write-Host "📂 Criando estrutura de pastas..." -ForegroundColor Cyan

@(
    "src",
    "public",
    "assets",
    "assets\\icons",
    "assets\\images",
    ".github\\workflows"
) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

Write-Host "✅ Pastas criadas com sucesso" -ForegroundColor Green

# Criar index.html
Write-Host ""
Write-Host "📄 Criando arquivos..." -ForegroundColor Cyan

@"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div id="app">
        <h1>Bem-vindo ao ${projectName}</h1>
        <p>Projeto criado com Hub Jurídico</p>
    </div>
    <script src="./script.js"></script>
</body>
</html>
"@ | Out-File -Encoding UTF8 "index.html"
Write-Host "✅ index.html criado" -ForegroundColor Green

# Criar style.css
@"
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 20px;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}
"@ | Out-File -Encoding UTF8 "style.css"
Write-Host "✅ style.css criado" -ForegroundColor Green

# Criar script.js
@"
console.log('${projectName} iniciado!');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
});
"@ | Out-File -Encoding UTF8 "script.js"
Write-Host "✅ script.js criado" -ForegroundColor Green

# Criar package.json
@"
{
  "name": "${safeName}",
  "version": "1.0.0",
  "description": "${projectName}",
  "main": "index.js",
  "scripts": {
    "dev": "npx http-server -p 8000 -c-1",
    "build": "echo Build script aqui"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
"@ | Out-File -Encoding UTF8 "package.json"
Write-Host "✅ package.json criado" -ForegroundColor Green

# Criar .gitignore
@"
node_modules/
dist/
build/
.env
.DS_Store
"@ | Out-File -Encoding UTF8 ".gitignore"
Write-Host "✅ .gitignore criado" -ForegroundColor Green

# Criar README.md
@"
# ${projectName}

Projeto criado com Hub Jurídico

## Instalação

\`\`\`bash
npm install
\`\`\`

## Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
"@ | Out-File -Encoding UTF8 "README.md"
Write-Host "✅ README.md criado" -ForegroundColor Green

# Instalar dependências
Write-Host ""
Write-Host "📦 Instalando dependências..." -ForegroundColor Cyan
npm install

# Iniciar servidor
Write-Host ""
Write-Host "🌐 Iniciando servidor local..." -ForegroundColor Green
Write-Host ""
Write-Host "✅ Servidor rodando em: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

npm run dev

Read-Host "Pressione Enter para sair"
`;
  },

  // ── GERAR GUIA INTERATIVO ──
  generateGuide(projectName) {
    return `
# 🚀 GUIA INTERATIVO - Setup Automático

## Seu Projeto: **${projectName}**

### ✅ O que será criado:

- 📁 Estrutura de pastas (src, public, assets)
- 📄 Arquivos básicos (HTML, CSS, JS)
- 📦 package.json
- 🌐 Servidor local na porta 8000
- 🔧 Configurações iniciais

---

## 🎯 PASSO 1: Escolha seu Sistema

### Para Windows (CMD):
1. Copie o script BATCH abaixo
2. Abra o Bloco de Notas
3. Cole o código
4. Salve como: \`setup-${projectName}.bat\`
5. Clique 2x no arquivo para executar

### Para Windows (PowerShell):
1. Copie o script PowerShell abaixo
2. Abra PowerShell como Administrador
3. Execute: \`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser\`
4. Cole: \`${projectName}-setup.ps1\` (salve como arquivo .ps1)
5. Execute: \`.\\${projectName}-setup.ps1\`

### Para Mac/Linux (Bash):
1. Copie o script Bash abaixo
2. Abra Terminal
3. Cole o código
4. Pressione Enter

---

## 📋 SCRIPT BATCH (Windows CMD)

\`\`\`batch
${this.generateBatchScript(projectName)}
\`\`\`

---

## 💻 SCRIPT POWERSHELL (Windows PowerShell)

\`\`\`powershell
${this.generatePowerShellScript(projectName)}
\`\`\`

---

## 🐧 SCRIPT BASH (Mac/Linux)

\`\`\`bash
${this.generateBashScript(projectName)}
\`\`\`

---

## ⚡ Resultado Final

Após executar, você terá:

✅ Projeto em: \`C:\\Projetos\\${projectName.replace(/\s+/g, '_')}\`
✅ Servidor rodando em: \`http://localhost:8000\`
✅ Pronto para desenvolvimento!

---

## 🔗 Próximos Passos

1. Acesse: http://localhost:8000
2. Modifique os arquivos em \`src/\`
3. Veja as mudanças em tempo real
4. Quando pronto, faça upload para o repositório

`;
  },

  // ── GERAR BASH SCRIPT ──
  generateBashScript(projectName) {
    const safeName = projectName.replace(/[<>:"|?*]/g, '').replace(/\s+/g, '_');
    const fullPath = `~/Projetos/${safeName}`;

    return `#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# SETUP AUTOMÁTICO - ${projectName}
# ═══════════════════════════════════════════════════════════════════════════

echo ""
echo "🚀 Iniciando setup do projeto: ${projectName}"
echo "📁 Caminho: ${fullPath}"
echo ""

# Criar diretório principal
mkdir -p "${fullPath}"
cd "${fullPath}"

echo "✅ Pasta criada: ${fullPath}"
echo ""

# Criar estrutura de pastas
echo "📂 Criando estrutura de pastas..."

mkdir -p src
mkdir -p public
mkdir -p assets/icons
mkdir -p assets/images
mkdir -p .github/workflows

echo "✅ Pastas criadas com sucesso"
echo ""

# Criar index.html
echo "📄 Criando arquivos..."

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div id="app">
        <h1>Bem-vindo ao ${projectName}</h1>
        <p>Projeto criado com Hub Jurídico</p>
    </div>
    <script src="./script.js"></script>
</body>
</html>
EOF

echo "✅ index.html criado"

# Criar style.css
cat > style.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: #0f172a;
    color: #e2e8f0;
    padding: 20px;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}
EOF

echo "✅ style.css criado"

# Criar script.js
cat > script.js << 'EOF'
console.log('${projectName} iniciado!');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
});
EOF

echo "✅ script.js criado"

# Criar package.json
cat > package.json << 'EOF'
{
  "name": "${safeName}",
  "version": "1.0.0",
  "description": "${projectName}",
  "main": "index.js",
  "scripts": {
    "dev": "npx http-server -p 8000 -c-1",
    "build": "echo Build script aqui"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}
EOF

echo "✅ package.json criado"

# Criar .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.env
.DS_Store
EOF

echo "✅ .gitignore criado"

# Criar README.md
cat > README.md << 'EOF'
# ${projectName}

Projeto criado com Hub Jurídico

## Instalação

\`\`\`bash
npm install
\`\`\`

## Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
EOF

echo "✅ README.md criado"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

# Iniciar servidor
echo ""
echo "🌐 Iniciando servidor local..."
echo ""
echo "✅ Servidor rodando em: http://localhost:8000"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev
`;
  }
};