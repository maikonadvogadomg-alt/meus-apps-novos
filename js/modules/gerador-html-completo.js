// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GERADOR HTML COMPLETO - Tudo em um arquivo
// ═══════════════════════════════════════════════════════════════════════════

const GeradorHTMLCompleto = {
  // ── GERAR HTML COMPLETO ──
  generateCompleteHTML(projectName, config = {}) {
    const safeName = projectName.replace(/[<>:"|?*]/g, '').replace(/\s+/g, '_');
    const appId = config.appId || 'com.app.' + safeName;
    const apiMin = config.apiMin || 21;
    const apiMax = config.apiMax || 33;
    const orientation = config.appOrientation || 'portrait';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${projectName}">
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <title>${projectName}</title>
    
    <link rel="manifest" href="./manifest.json">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect fill='%233b82f6' width='512' height='512'/><text x='256' y='300' font-size='200' font-weight='bold' text-anchor='middle' fill='white' font-family='Arial'>${projectName.substring(0, 2).toUpperCase()}</text></svg>">
    <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect fill='%233b82f6' width='512' height='512'/><text x='256' y='300' font-size='200' font-weight='bold' text-anchor='middle' fill='white' font-family='Arial'>${projectName.substring(0, 2).toUpperCase()}</text></svg>">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #3b82f6;
            --primary-dark: #1e40af;
            --bg: #0f172a;
            --card: #1e293b;
            --border: #334155;
            --text: #e2e8f0;
            --muted: #94a3b8;
            --success: #22c55e;
            --error: #ef4444;
            --warning: #f59e0b;
        }

        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            display: flex;
            flex-direction: column;
        }

        header {
            background-color: var(--card);
            border-bottom: 2px solid var(--border);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        header h1 {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary);
        }

        header .info {
            font-size: 13px;
            color: var(--muted);
        }

        main {
            flex: 1;
            display: flex;
            overflow: hidden;
        }

        .sidebar {
            width: 300px;
            background-color: var(--card);
            border-right: 2px solid var(--border);
            padding: 20px;
            overflow-y: auto;
        }

        .sidebar h2 {
            font-size: 16px;
            margin-bottom: 16px;
            color: var(--primary);
            border-bottom: 2px solid var(--border);
            padding-bottom: 8px;
        }

        .sidebar-item {
            display: block;
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            background-color: var(--bg);
            border: 2px solid var(--border);
            border-radius: 6px;
            color: var(--text);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .sidebar-item:hover {
            background-color: var(--primary);
            border-color: var(--primary);
            color: white;
        }

        .sidebar-item.active {
            background-color: var(--primary);
            border-color: var(--primary);
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .content-header {
            background-color: var(--card);
            border-bottom: 2px solid var(--border);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .content-header h2 {
            font-size: 20px;
            font-weight: bold;
        }

        .content-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .card {
            background-color: var(--card);
            border: 2px solid var(--border);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
        }

        .card h3 {
            margin-bottom: 12px;
            color: var(--primary);
            font-size: 16px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--text);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            background-color: var(--bg);
            border: 2px solid var(--border);
            border-radius: 6px;
            color: var(--text);
            font-size: 14px;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .btn {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background-color: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
        }

        .btn-success {
            background-color: var(--success);
            color: white;
        }

        .btn-success:hover {
            background-color: #16a34a;
        }

        .btn-error {
            background-color: var(--error);
            color: white;
        }

        .btn-error:hover {
            background-color: #dc2626;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
        }

        .code-block {
            background-color: var(--bg);
            border: 2px solid var(--border);
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.5;
            color: #a1a1a1;
            margin: 12px 0;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .alert-success {
            background-color: rgba(34, 197, 94, 0.1);
            border: 2px solid var(--success);
            color: var(--success);
        }

        .alert-error {
            background-color: rgba(239, 68, 68, 0.1);
            border: 2px solid var(--error);
            color: var(--error);
        }

        .alert-warning {
            background-color: rgba(245, 158, 11, 0.1);
            border: 2px solid var(--warning);
            color: var(--warning);
        }

        .alert-info {
            background-color: rgba(59, 130, 246, 0.1);
            border: 2px solid var(--primary);
            color: var(--primary);
        }

        .copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 6px 12px;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }

        .copy-btn:hover {
            background-color: var(--primary-dark);
        }

        @media (max-width: 768px) {
            main {
                flex-direction: column;
            }

            .sidebar {
                width: 100%;
                border-right: none;
                border-bottom: 2px solid var(--border);
                max-height: 200px;
            }

            header {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>🚀 ${projectName}</h1>
            <div class="info">ID: ${appId}</div>
        </div>
        <div class="info">
            API: ${apiMin} - ${apiMax} | Orientação: ${orientation}
        </div>
    </header>

    <main>
        <aside class="sidebar">
            <h2>📋 Menu</h2>
            <button class="sidebar-item active" onclick="showTab('info')">ℹ️ Informações</button>
            <button class="sidebar-item" onclick="showTab('config')">⚙️ Configurações</button>
            <button class="sidebar-item" onclick="showTab('batch')">🪟 Script Batch</button>
            <button class="sidebar-item" onclick="showTab('powershell')">💻 PowerShell</button>
            <button class="sidebar-item" onclick="showTab('bash')">🐧 Bash</button>
            <button class="sidebar-item" onclick="showTab('files')">📁 Arquivos</button>
        </aside>

        <section class="content">
            <div class="content-header">
                <h2 id="tabTitle">ℹ️ Informações do Projeto</h2>
            </div>

            <div class="content-body">
                <!-- TAB: INFO -->
                <div id="tab-info" class="tab-content">
                    <div class="card">
                        <h3>📊 Resumo do Projeto</h3>
                        <div class="grid">
                            <div>
                                <strong>Nome:</strong>
                                <p style="color: var(--muted);">${projectName}</p>
                            </div>
                            <div>
                                <strong>ID (Package):</strong>
                                <p style="color: var(--muted);">${appId}</p>
                            </div>
                            <div>
                                <strong>API Mínima:</strong>
                                <p style="color: var(--muted);">Android ${apiMin}</p>
                            </div>
                            <div>
                                <strong>API Máxima:</strong>
                                <p style="color: var(--muted);">Android ${apiMax}</p>
                            </div>
                            <div>
                                <strong>Orientação:</strong>
                                <p style="color: var(--muted);">${orientation === 'portrait' ? '📱 Retrato' : orientation === 'landscape' ? '📺 Paisagem' : '🔄 Ambos'}</p>
                            </div>
                            <div>
                                <strong>Data de Criação:</strong>
                                <p style="color: var(--muted);">${new Date().toLocaleString('pt-BR')}</p>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3>✅ O que será criado</h3>
                        <ul style="margin-left: 20px; line-height: 1.8; color: var(--muted);">
                            <li>📁 Estrutura de pastas (src, public, assets)</li>
                            <li>📄 Arquivos básicos (HTML, CSS, JS)</li>
                            <li>📦 package.json com scripts</li>
                            <li>🌐 Servidor local na porta 8000</li>
                            <li>🔧 Configurações iniciais</li>
                            <li>📝 README.md</li>
                            <li>🔐 .gitignore</li>
                        </ul>
                    </div>

                    <div class="card">
                        <h3>🎯 Próximos Passos</h3>
                        <ol style="margin-left: 20px; line-height: 1.8; color: var(--muted);">
                            <li>Escolha seu sistema operacional (Windows/Mac/Linux)</li>
                            <li>Copie o script correspondente</li>
                            <li>Cole em um arquivo de texto</li>
                            <li>Salve com a extensão correta (.bat, .ps1 ou .sh)</li>
                            <li>Execute o script</li>
                            <li>Acesse http://localhost:8000</li>
                        </ol>
                    </div>
                </div>

                <!-- TAB: CONFIG -->
                <div id="tab-config" class="tab-content" style="display: none;">
                    <div class="card">
                        <h3>⚙️ Configurações do Projeto</h3>
                        <div class="form-group">
                            <label>Nome do Aplicativo</label>
                            <input type="text" value="${projectName}" readonly>
                        </div>
                        <div class="form-group">
                            <label>ID (Package Name)</label>
                            <input type="text" value="${appId}" readonly>
                        </div>
                        <div class="form-group">
                            <label>API Android Mínima</label>
                            <input type="number" value="${apiMin}" readonly>
                        </div>
                        <div class="form-group">
                            <label>API Android Máxima</label>
                            <input type="number" value="${apiMax}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Orientação da Tela</label>
                            <input type="text" value="${orientation}" readonly>
                        </div>
                    </div>
                </div>

                <!-- TAB: BATCH -->
                <div id="tab-batch" class="tab-content" style="display: none;">
                    <div class="alert alert-info">
                        <span>💡</span>
                        <div>
                            <strong>Windows (CMD/Batch)</strong>
                            <p style="font-size: 12px; margin-top: 4px;">Copie o script abaixo, salve como <strong>setup-${safeName}.bat</strong> e clique 2x para executar</p>
                        </div>
                    </div>
                    
                    <div class="card" style="position: relative;">
                        <button class="copy-btn" onclick="copyCode('batch-code')">📋 Copiar</button>
                        <pre id="batch-code" class="code-block">${this.escapeBatch(GeradorBatch.generateBatchScript(projectName))}</pre>
                    </div>
                </div>

                <!-- TAB: POWERSHELL -->
                <div id="tab-powershell" class="tab-content" style="display: none;">
                    <div class="alert alert-info">
                        <span>💡</span>
                        <div>
                            <strong>Windows (PowerShell)</strong>
                            <p style="font-size: 12px; margin-top: 4px;">Copie o script abaixo, salve como <strong>setup-${safeName}.ps1</strong> e execute no PowerShell</p>
                        </div>
                    </div>
                    
                    <div class="card" style="position: relative;">
                        <button class="copy-btn" onclick="copyCode('powershell-code')">📋 Copiar</button>
                        <pre id="powershell-code" class="code-block">${this.escapePowerShell(GeradorBatch.generatePowerShellScript(projectName))}</pre>
                    </div>
                </div>

                <!-- TAB: BASH -->
                <div id="tab-bash" class="tab-content" style="display: none;">
                    <div class="alert alert-info">
                        <span>💡</span>
                        <div>
                            <strong>Mac/Linux (Bash)</strong>
                            <p style="font-size: 12px; margin-top: 4px;">Copie o script abaixo, salve como <strong>setup-${safeName}.sh</strong> e execute no Terminal</p>
                        </div>
                    </div>
                    
                    <div class="card" style="position: relative;">
                        <button class="copy-btn" onclick="copyCode('bash-code')">📋 Copiar</button>
                        <pre id="bash-code" class="code-block">${this.escapeBash(GeradorBatch.generateBashScript(projectName))}</pre>
                    </div>
                </div>

                <!-- TAB: FILES -->
                <div id="tab-files" class="tab-content" style="display: none;">
                    <div class="alert alert-success">
                        <span>✅</span>
                        <div>
                            <strong>Estrutura de Arquivos</strong>
                            <p style="font-size: 12px; margin-top: 4px;">Estes são os arquivos que serão criados automaticamente</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3>📁 Estrutura</h3>
                        <pre class="code-block">${safeName}/
├── index.html
├── style.css
├── script.js
├── package.json
├── README.md
├── .gitignore
├── src/
├── public/
├── assets/
│   ├── icons/
│   └── images/
└── .github/
    └── workflows/</pre>
                    </div>

                    <div class="card">
                        <h3>📄 Arquivos Principais</h3>
                        
                        <h4 style="margin-top: 16px; margin-bottom: 8px; color: var(--primary);">index.html</h4>
                        <pre class="code-block">&lt;!DOCTYPE html&gt;
&lt;html lang="pt-BR"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;${projectName}&lt;/title&gt;
    &lt;link rel="stylesheet" href="./style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div id="app"&gt;
        &lt;h1&gt;Bem-vindo ao ${projectName}&lt;/h1&gt;
    &lt;/div&gt;
    &lt;script src="./script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

                        <h4 style="margin-top: 16px; margin-bottom: 8px; color: var(--primary);">package.json</h4>
                        <pre class="code-block">{
  "name": "${safeName}",
  "version": "1.0.0",
  "description": "${projectName}",
  "scripts": {
    "dev": "npx http-server -p 8000 -c-1",
    "build": "echo Build script aqui"
  }
}</pre>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script>
        function showTab(tabName) {
            // Esconder todos os tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.style.display = 'none');

            // Mostrar tab selecionado
            const selectedTab = document.getElementById('tab-' + tabName);
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }

            // Atualizar título
            const titles = {
                'info': 'ℹ️ Informações do Projeto',
                'config': '⚙️ Configurações',
                'batch': '🪟 Script Batch (Windows)',
                'powershell': '💻 PowerShell (Windows)',
                'bash': '🐧 Bash (Mac/Linux)',
                'files': '📁 Estrutura de Arquivos'
            };

            document.getElementById('tabTitle').textContent = titles[tabName] || 'Projeto';

            // Atualizar botões ativos
            const buttons = document.querySelectorAll('.sidebar-item');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function copyCode(elementId) {
            const element = document.getElementById(elementId);
            const text = element.textContent;

            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Código copiado para a área de transferência!');
            }).catch(err => {
                alert('❌ Erro ao copiar código');
                console.error(err);
            });
        }

        // Registrar Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(err => {
                console.log('Service Worker não registrado:', err);
            });
        }
    </script>
</body>
</html>`;
  },

  escapeBatch(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  escapePowerShell(text) {
    return this.escapeBatch(text);
  },

  escapeBash(text) {
    return this.escapeBatch(text);
  },

  // ── EXIBIR HTML COMPLETO ──
  showInNewWindow(projectName, config) {
    const html = this.generateCompleteHTML(projectName, config);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  },

  // ── BAIXAR HTML ──
  downloadHTML(projectName, config) {
    const html = this.generateCompleteHTML(projectName, config);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', `${projectName.replace(/\s+/g, '_')}-setup.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};
