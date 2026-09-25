/ ═══════════════════════════════════════════════════════════════════════════
// MÓDULO: IA - ANÁLISE E SUGESTÕES
// ═══════════════════════════════════════════════════════════════════════════

const IA = {
  render() {
    const module = document.getElementById('iaModule');
    if (!module) return;

    module.innerHTML = `
            <h1>🤖 Assistente IA</h1>
            <div style="display: flex; gap: 20px; height: calc(100% - 60px);">
                <div style="width: 300px; background-color: var(--card); border: 2px solid var(--color-base); border-radius: 8px; padding: 16px; overflow-y: auto;">
                    <h3 style="margin-bottom: 12px;">Análises</h3>
                    <div id="iaAnalysisList"></div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column;">
                    <div id="iaContent" style="flex: 1; overflow-y: auto; padding: 16px; background-color: var(--bg); border: 2px solid var(--border); border-radius: 8px; margin-bottom: 12px;"></div>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="iaInput" placeholder="Faça uma pergunta..." style="flex: 1;">
                        <button class="btn btn-base" onclick="IA.sendMessage()">Enviar</button>
                    </div>
                </div>
            </div>
        `;

    this.renderAnalysisList();
    this.setupInputListener();
  },

  setupInputListener() {
    const input = document.getElementById('iaInput');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  },

  renderAnalysisList() {
    const list = document.getElementById('iaAnalysisList');
    if (!list) return;

    if (!Base.state.activeProject) {
      list.innerHTML = '<p style="color: var(--muted); font-size: 12px;">Selecione um projeto</p>';
      return;
    }

    const analyses = [
      { id: 'validacao', label: '📋 Validação', icon: '✓' },
      { id: 'erros', label: '❌ Erros Detectados', icon: '!' },
      { id: 'sugestoes', label: '💡 Sugestões', icon: '→' },
      { id: 'config', label: '⚙️ Configurações', icon: '⚙' },
      { id: 'historico', label: '📜 Histórico', icon: '📋' }
    ];

    list.innerHTML = analyses.map(a => `
            <button class="sidebar-item" onclick="IA.showAnalysis('${a.id}')" style="margin-bottom: 8px;">
                ${a.label}
            </button>
        `).join('');
  },

  showAnalysis(type) {
    const content = document.getElementById('iaContent');
    if (!content) return;

    if (type === 'validacao') {
      this.showValidacao(content);
    } else if (type === 'erros') {
      this.showErros(content);
    } else if (type === 'sugestoes') {
      this.showSugestoes(content);
    } else if (type === 'config') {
      this.showConfig(content);
    } else if (type === 'historico') {
      this.showHistorico(content);
    }
  },

  showValidacao(container) {
    const validation = Validador.validateProject(Base.state.activeProject);

    let html = `<h2>📋 Validação do Projeto</h2>`;
    html += `<p style="margin: 16px 0;">Analisando projeto: <strong>${Base.state.activeProject.name}</strong></p>`;

    html += `<div style="display: grid; gap: 12px; margin: 16px 0;">`;

    validation.issues.forEach(issue => {
      const colors = {
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      };

      html += `
                <div style="padding: 12px; background-color: var(--card); border-left: 4px solid ${colors[issue.type]}; border-radius: 6px;">
                    <strong>${issue.file}</strong>
                    <p style="color: var(--muted); font-size: 13px; margin-top: 4px;">${issue.msg}</p>
                </div>
            `;
    });

    html += `</div>`;

    if (validation.missing.length > 0) {
      html += `<h3 style="margin-top: 20px;">Arquivos Faltando:</h3>`;
      html += `<ul style="margin-left: 20px; color: var(--muted);">`;
      validation.missing.forEach(f => {
        html += `<li>${f}</li>`;
      });
      html += `</ul>`;
    }

    container.innerHTML = html;
  },

  showErros(container) {
    const project = Base.state.activeProject;
    const errors = this.detectErrors(project);

    let html = `<h2>❌ Erros Detectados</h2>`;

    if (errors.length === 0) {
      html += `<p style="color: var(--success); margin-top: 16px;">✅ Nenhum erro detectado!</p>`;
    } else {
      errors.forEach(error => {
        html += `
                    <div style="padding: 12px; background-color: var(--card); border-left: 4px solid #ef4444; border-radius: 6px; margin-bottom: 12px;">
                        <strong>${error.type}</strong>
                        <p style="color: var(--muted); font-size: 13px; margin-top: 4px;">${error.message}</p>
                        <p style="color: #3b82f6; font-size: 12px; margin-top: 8px;">💡 Sugestão: ${error.suggestion}</p>
                    </div>
                `;
      });
    }

    container.innerHTML = html;
  },

  showSugestoes(container) {
    const project = Base.state.activeProject;
    const suggestions = this.generateSuggestions(project);

    let html = `<h2>💡 Sugestões de Melhoria</h2>`;

    suggestions.forEach(sug => {
      html += `
                <div style="padding: 12px; background-color: var(--card); border-left: 4px solid #22c55e; border-radius: 6px; margin-bottom: 12px;">
                    <strong>${sug.title}</strong>
                    <p style="color: var(--muted); font-size: 13px; margin-top: 4px;">${sug.description}</p>
                    <button class="btn btn-base" onclick="IA.applySuggestion('${sug.id}')" style="margin-top: 8px; font-size: 12px; padding: 6px 12px;">Aplicar</button>
                </div>
            `;
    });

    container.innerHTML = html;
  },

  showConfig(container) {
    const project = Base.state.activeProject;
    const config = project.iaConfig || {};

    let html = `<h2>⚙️ Configurações do Aplicativo</h2>`;
    html += `
            <form onsubmit="IA.saveConfig(event)" style="margin-top: 16px; display: grid; gap: 16px;">
                
                <div class="form-group">
                    <label>Nome do Aplicativo</label>
                    <input type="text" id="appName" value="${config.appName || project.name}" placeholder="Nome do app">
                </div>

                <div class="form-group">
                    <label>URL/Link do Repositório</label>
                    <input type="url" id="appUrl" value="${config.appUrl || ''}" placeholder="https://github.com/...">
                </div>

                <div class="form-group">
                    <label>ID Único (Package Name)</label>
                    <input type="text" id="appId" value="${config.appId || 'com.app.' + project.name.toLowerCase().replace(/\s+/g, '')}" placeholder="com.example.app">
                </div>

                <div class="form-group">
                    <label>Orientação da Tela</label>
                    <select id="appOrientation">
                        <option value="portrait" ${config.appOrientation === 'portrait' ? 'selected' : ''}>Retrato</option>
                        <option value="landscape" ${config.appOrientation === 'landscape' ? 'selected' : ''}>Paisagem</option>
                        <option value="both" ${config.appOrientation === 'both' ? 'selected' : ''}>Ambos</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>API Android Mínima</label>
                    <select id="apiMin">
                        ${this.generateAndroidAPIOptions(config.apiMin || 21)}
                    </select>
                </div>

                <div class="form-group">
                    <label>API Android Máxima</label>
                    <select id="apiMax">
                        ${this.generateAndroidAPIOptions(config.apiMax || 33)}
                    </select>
                </div>

                <div class="form-group">
                    <label>Versão do App</label>
                    <input type="text" id="appVersion" value="${config.appVersion || '1.0.0'}" placeholder="1.0.0">
                </div>

                <button type="submit" class="btn btn-base" style="width: 100%;">💾 Salvar Configurações</button>
            </form>
        `;

    container.innerHTML = html;
  },

  generateAndroidAPIOptions(selected = 21) {
    let options = '';
    for (let i = 21; i <= 58; i++) {
      options += `<option value="${i}" ${i === selected ? 'selected' : ''}>API ${i}</option>`;
    }
    return options;
  },

  showHistorico(container) {
    const project = Base.state.activeProject;
    const history = project.errorHistory || [];

    let html = `<h2>📜 Histórico de Erros</h2>`;

    if (history.length === 0) {
      html += `<p style="color: var(--muted); margin-top: 16px;">Nenhum erro registrado ainda.</p>`;
    } else {
      history.forEach((err, idx) => {
        html += `
                    <div style="padding: 12px; background-color: var(--card); border-radius: 6px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <strong>${err.type}</strong>
                            <small style="color: var(--muted);">${new Date(err.timestamp).toLocaleString('pt-BR')}</small>
                        </div>
                        <p style="color: var(--muted); font-size: 13px; margin-top: 4px;">${err.message}</p>
                        <p style="color: #3b82f6; font-size: 12px; margin-top: 8px;">💡 ${err.solution}</p>
                    </div>
                `;
      });
    }

    container.innerHTML = html;
  },

  detectErrors(project) {
    const errors = [];

    // Verificar erros comuns
    if (!project.files['index.html']) {
      errors.push({
        type: 'Arquivo Principal Faltando',
        message: 'O arquivo index.html não foi encontrado',
        suggestion: 'Crie um arquivo index.html na raiz do projeto'
      });
    }

    if (project.files['index.html'] && !project.files['index.html'].includes('<!DOCTYPE')) {
      errors.push({
        type: 'HTML Inválido',
        message: 'O arquivo HTML não começa com <!DOCTYPE>',
        suggestion: 'Adicione <!DOCTYPE html> no início do arquivo'
      });
    }

    if (!project.iaConfig?.appId) {
      errors.push({
        type: 'ID do App Não Configurado',
        message: 'Package Name não foi definido',
        suggestion: 'Configure o ID do aplicativo nas configurações'
      });
    }

    return errors;
  },

  generateSuggestions(project) {
    const suggestions = [];

    if (!project.files['manifest.json']) {
      suggestions.push({
        id: 'manifest',
        title: 'Gerar manifest.json',
        description: 'Crie um arquivo manifest.json para PWA',
        action: () => Gerador.gerarManifest()
      });
    }

    if (!project.files['sw.js']) {
      suggestions.push({
        id: 'sw',
        title: 'Gerar Service Worker',
        description: 'Crie um Service Worker para offline',
        action: () => Gerador.gerarServiceWorker()
      });
    }

    if (!Object.keys(project.files).some(f => f.includes('icon'))) {
      suggestions.push({
        id: 'icons',
        title: 'Gerar Ícones',
        description: 'Crie ícones para diferentes resoluções',
        action: () => Gerador.gerarIcones()
      });
    }

    return suggestions;
  },

  applySuggestion(id) {
    const suggestion = this.generateSuggestions(Base.state.activeProject).find(s => s.id === id);
    if (suggestion && suggestion.action) {
      suggestion.action();
      Base.saveState();
      Base.showAlert(`✅ Sugestão "${suggestion.title}" aplicada!`, 'success');
      this.showSugestoes(document.getElementById('iaContent'));
    }
  },

  saveConfig(e) {
    e.preventDefault();

    if (!Base.state.activeProject) return;

    Base.state.activeProject.iaConfig = {
      appName: document.getElementById('appName').value,
      appUrl: document.getElementById('appUrl').value,
      appId: document.getElementById('appId').value,
      appOrientation: document.getElementById('appOrientation').value,
      apiMin: parseInt(document.getElementById('apiMin').value),
      apiMax: parseInt(document.getElementById('apiMax').value),
      appVersion: document.getElementById('appVersion').value
    };

    Base.saveState();
    Base.showAlert('✅ Configurações salvas!', 'success');
    this.showConfig(document.getElementById('iaContent'));
  },

  sendMessage() {
    const input = document.getElementById('iaInput');
    const content = document.getElementById('iaContent');
    const message = input.value.trim();

    if (!message) return;

    // Adicionar mensagem do usuário
    content.innerHTML += `
            <div style="margin-bottom: 12px; padding: 12px; background-color: var(--color-base); color: white; border-radius: 8px;">
                <strong>Você:</strong> ${message}
            </div>
        `;

    // Processar com IA
    const response = this.processMessage(message);

    // Adicionar resposta da IA
    content.innerHTML += `
            <div style="margin-bottom: 12px; padding: 12px; background-color: var(--card); border-left: 4px solid var(--color-base); border-radius: 8px;">
                <strong>🤖 IA:</strong>
                <p style="margin-top: 8px; color: var(--text);">${response}</p>
            </div>
        `;

    input.value = '';
    content.scrollTop = content.scrollHeight;

    // Registrar no histórico
    this.addToHistory(message, response);
  },

  processMessage(message) {
    const msg = message.toLowerCase();

    // Respostas baseadas em palavras-chave
    if (msg.includes('erro') || msg.includes('error')) {
      return 'Detectei que você está com problemas. Verifique a aba "Erros Detectados" para mais informações. Posso ajudar a resolver qualquer erro específico!';
    }

    if (msg.includes('falta') || msg.includes('missing')) {
      return 'Verifique a aba "Validação" para ver quais arquivos estão faltando. Posso gerar automaticamente os arquivos necessários!';
    }

    if (msg.includes('configuração') || msg.includes('config')) {
      return 'Acesse a aba "Configurações" para definir o nome do app, ID, orientação da tela e versão do Android.';
    }

    if (msg.includes('ícone') || msg.includes('icon')) {
      return 'Posso gerar ícones automaticamente em diferentes tamanhos. Vá para "Sugestões" e clique em "Gerar Ícones".';
    }

    if (msg.includes('login') || msg.includes('autenticação')) {
      return 'Erros de login geralmente são causados por credenciais incorretas ou falta de permissões. Verifique suas variáveis de ambiente e tokens.';
    }

    if (msg.includes('repositório') || msg.includes('github')) {
      return 'Você pode conectar seu repositório GitHub na aba "Repositório". Isso permitirá sincronizar automaticamente suas alterações.';
    }

    return 'Desculpe, não entendi bem. Posso ajudar com: validação, erros, configurações, ícones, repositório ou sugestões de melhoria.';
  },

  addToHistory(message, response) {
    if (!Base.state.activeProject) return;

    if (!Base.state.activeProject.errorHistory) {
      Base.state.activeProject.errorHistory = [];
    }

    Base.state.activeProject.errorHistory.push({
      type: 'Consulta IA',
      message: message,
      solution: response,
      timestamp: new Date().toISOString()
    });

    Base.saveState();
  },

  // ── ANALISAR ARQUIVO AO IMPORTAR ──
  analyzeImportedProject(project) {
    const analysis = {
      timestamp: new Date().toISOString(),
      validation: Validador.validateProject(project),
      errors: this.detectErrors(project),
      suggestions: this.generateSuggestions(project)
    };

    if (!project.iaAnalysis) {
      project.iaAnalysis = [];
    }

    project.iaAnalysis.push(analysis);
    return analysis;
  }
};