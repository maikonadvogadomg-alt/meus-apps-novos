// ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: GUIA INTERATIVO - Setup Automático
// ═══════════════════════════════════════════════════════════════════════════

const GuiaInterativo = {
  render() {
    const module = document.getElementById('guiaModule');
    if (!module) return;

    module.innerHTML = `
            <h1>📖 Guia Interativo - Setup Automático</h1>
            <div id="guiaContent"></div>
        `;

    this.renderGuia();
  },

  renderGuia() {
    if (!Base.state.activeProject) {
      document.getElementById('guiaContent').innerHTML = '<p style="color: var(--muted);">Selecione um projeto primeiro</p>';
      return;
    }

    const project = Base.state.activeProject;
    const container = document.getElementById('guiaContent');

    let html = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- PAINEL ESQUERDO: OPÇÕES -->
                <div style="background-color: var(--card); border: 2px solid var(--color-base); border-radius: 8px; padding: 20px;">
                    <h2 style="margin-bottom: 16px;">🎯 Escolha seu Sistema</h2>
                    
                    <button class="btn btn-base" onclick="GuiaInterativo.showBatch('${project.name}')" style="width: 100%; margin-bottom: 12px;">
                        🪟 Windows (CMD/Batch)
                    </button>
                    
                    <button class="btn btn-base" onclick="GuiaInterativo.showPowerShell('${project.name}')" style="width: 100%; margin-bottom: 12px;">
                        💻 Windows (PowerShell)
                    </button>
                    
                    <button class="btn btn-base" onclick="GuiaInterativo.showBash('${project.name}')" style="width: 100%; margin-bottom: 12px;">
                        🐧 Mac/Linux (Bash)
                    </button>
                    
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
                    
                    <h3 style="margin-bottom: 12px;">📋 Resumo do Projeto</h3>
                    <div style="font-size: 13px; color: var(--muted); line-height: 1.8;">
                        <p><strong>Nome:</strong> ${project.name}</p>
                        <p><strong>ID:</strong> ${project.iaConfig?.appId || 'Não configurado'}</p>
                        <p><strong>Orientação:</strong> ${project.iaConfig?.appOrientation || 'Não configurado'}</p>
                        <p><strong>API Min:</strong> ${project.iaConfig?.apiMin || 'Não configurado'}</p>
                        <p><strong>API Max:</strong> ${project.iaConfig?.apiMax || 'Não configurado'}</p>
                    </div>
                </div>

                <!-- PAINEL DIREITO: CONTEÚDO -->
                <div id="guiaScriptContainer" style="background-color: var(--bg); border: 2px solid var(--border); border-radius: 8px; padding: 20px; overflow-y: auto; max-height: 600px;">
                    <p style="color: var(--muted); text-align: center;">Selecione um sistema para ver o script</p>
                </div>
            </div>
        `;

    container.innerHTML = html;
  },

  showBatch(projectName) {
    this.showScript(projectName, 'batch');
  },

  showPowerShell(projectName) {
    this.showScript(projectName, 'powershell');
  },

  showBash(projectName) {
    this.showScript(projectName, 'bash');
  },

  showScript(projectName, type) {
    const container = document.getElementById('guiaScriptContainer');
    let script = '';
    let language = '';
    let filename = '';
    let instructions = '';

    if (type === 'batch') {
      script = GeradorBatch.generateBatchScript(projectName);
      language = 'batch';
      filename = `setup-${projectName.replace(/\s+/g, '_')}.bat`;
      instructions = `
                <h3 style="margin-bottom: 12px; color: var(--color-base);">📝 Instruções:</h3>
                <ol style="margin-left: 20px; color: var(--muted); font-size: 13px; line-height: 1.8;">
                    <li>Clique em "Copiar Script"</li>
                    <li>Abra o <strong>Bloco de Notas</strong></li>
                    <li>Cole o código (Ctrl+V)</li>
                    <li>Salve como: <strong>${filename}</strong></li>
                    <li>Clique 2x no arquivo para executar</li>
                    <li>Aguarde a instalação completar</li>
                    <li>Acesse: <strong>http://localhost:8000</strong></li>
                </ol>
            `;
    } else if (type === 'powershell') {
      script = GeradorBatch.generatePowerShellScript(projectName);
      language = 'powershell';
      filename = `setup-${projectName.replace(/\s+/g, '_')}.ps1`;
      instructions = `
                <h3 style="margin-bottom: 12px; color: var(--color-base);">📝 Instruções:</h3>
                <ol style="margin-left: 20px; color: var(--muted); font-size: 13px; line-height: 1.8;">
                    <li>Abra <strong>PowerShell como Administrador</strong></li>
                    <li>Execute: <code style="background-color: var(--card); padding: 4px 8px; border-radius: 4px;">Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code></li>
                    <li>Clique em "Copiar Script"</li>
                    <li>Cole no PowerShell</li>
                    <li>Pressione Enter</li>
                    <li>Aguarde a instalação completar</li>
                    <li>Acesse: <strong>http://localhost:8000</strong></li>
                </ol>
            `;
    } else if (type === 'bash') {
      script = GeradorBatch.generateBashScript(projectName);
      language = 'bash';
      filename = `setup-${projectName.replace(/\s+/g, '_')}.sh`;
      instructions = `
                <h3 style="margin-bottom: 12px; color: var(--color-base);">📝 Instruções:</h3>
                <ol style="margin-left: 20px; color: var(--muted); font-size: 13px; line-height: 1.8;">
                    <li>Abra o <strong>Terminal</strong></li>
                    <li>Clique em "Copiar Script"</li>
                    <li>Cole no Terminal (Cmd+V)</li>
                    <li>Pressione Enter</li>
                    <li>Aguarde a instalação completar</li>
                    <li>Acesse: <strong>http://localhost:8000</strong></li>
                </ol>
            `;
    }

    let html = `
            ${instructions}
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border);">
            
            <h3 style="margin-bottom: 12px; margin-top: 20px;">📄 Script:</h3>
            
            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <button class="btn btn-base" onclick="GuiaInterativo.copyScript()" style="flex: 1;">
                    📋 Copiar Script
                </button>
                <button class="btn btn-base" onclick="GuiaInterativo.downloadScript('${filename}', '${language}')" style="flex: 1;">
                    ⬇️ Baixar Arquivo
                </button>
            </div>
            
            <pre id="scriptContent" style="
                background-color: var(--card);
                border: 1px solid var(--border);
                border-radius: 6px;
                padding: 12px;
                overflow-x: auto;
                font-size: 12px;
                line-height: 1.4;
                color: #a1a1a1;
            ">${this.escapeHtml(script)}</pre>
        `;

    container.innerHTML = html;

    // Armazenar script para copiar
    window.currentScript = script;
  },

  copyScript() {
    if (!window.currentScript) return;

    navigator.clipboard.writeText(window.currentScript).then(() => {
      Base.showAlert('✅ Script copiado para a área de transferência!', 'success');
    }).catch(err => {
      Base.showAlert('❌ Erro ao copiar script', 'error');
      console.error(err);
    });
  },

  downloadScript(filename, language) {
    if (!window.currentScript) return;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(window.currentScript));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    Base.showAlert(`✅ ${filename} baixado!`, 'success');
  },

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
};
