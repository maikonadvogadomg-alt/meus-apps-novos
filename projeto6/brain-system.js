// ===== BRAIN SYSTEM =====
// Mantém contexto mesmo com limite de tokens

class BrainSystem {
  constructor(supabase, sessionId) {
    this.supabase = supabase;
    this.sessionId = sessionId;
    this.maxMemories = 10; // Manter últimas 10 interações
    this.memories = [];
    this.codeFragments = [];
  }

  async loadMemories() {
    if (!this.supabase || !this.sessionId) return;

    const { data } = await this.supabase
      .from("brain_history")
      .select("*")
      .eq("session_id", this.sessionId)
      .order("iteration", { ascending: false })
      .limit(this.maxMemories);

    this.memories = (data || []).reverse();
  }

  async loadCodeFragments() {
    if (!this.supabase || !this.sessionId) return;

    const { data } = await this.supabase
      .from("code_fragments")
      .select("*")
      .eq("session_id", this.sessionId)
      .order("fragment_order", { ascending: true });

    this.codeFragments = data || [];
  }

  // Criar resumo do contexto para enviar à IA
  buildContextPrompt() {
    if (this.memories.length === 0) return "";

    let context = "## CONTEXTO ANTERIOR\n\n";

    this.memories.forEach((mem, idx) => {
      context += `### Interação ${idx + 1}\n`;
      context += `**Pergunta:** ${mem.context}\n`;
      context += `**Pontos-chave:** ${mem.key_points}\n\n`;
    });

    if (this.codeFragments.length > 0) {
      context += "## CÓDIGO ANTERIOR\n\n";
      this.codeFragments.forEach((frag, idx) => {
        context += `### Parte ${idx + 1} (${frag.language})\n`;
        context += "```" + frag.language + "\n";
        context += frag.code + "\n";
        context += "```\n\n";
      });
    }

    return context;
  }

  // Salvar nova memória
  async saveMemory(userMessage, aiResponse, codeBlocks = []) {
    if (!this.supabase || !this.sessionId) return;

    const iteration = this.memories.length + 1;

    // Salvar memória
    await this.supabase.from("brain_history").insert({
      session_id: this.sessionId,
      iteration,
      context: userMessage.substring(0, 500),
      code_snippets: codeBlocks.length > 0 ? JSON.stringify(codeBlocks) : null,
      key_points: aiResponse.substring(0, 500)
    });

    // Salvar fragmentos de código
    for (let i = 0; i < codeBlocks.length; i++) {
      await this.supabase.from("code_fragments").insert({
        session_id: this.sessionId,
        fragment_order: this.codeFragments.length + i + 1,
        language: codeBlocks[i].language || "javascript",
        code: codeBlocks[i].code,
        description: codeBlocks[i].description || ""
      });
    }

    await this.loadMemories();
    await this.loadCodeFragments();
  }

  // Extrair blocos de código da resposta da IA
  extractCodeBlocks(text) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || "javascript",
        code: match[2].trim()
      });
    }

    return blocks;
  }

  // Fragmentar código grande em partes menores
  fragmentCode(code, maxLines = 50) {
    const lines = code.split("\n");
    const fragments = [];

    for (let i = 0; i < lines.length; i += maxLines) {
      fragments.push(lines.slice(i, i + maxLines).join("\n"));
    }

    return fragments;
  }

  // Gerar prompt para continuar código
  buildContinuationPrompt(userMessage, tokenManager) {
    const model = tokenManager.getModelInfo();
    let prompt = userMessage;

    // Se é IA pequena, incluir contexto anterior
    if (model.isGratuito || model.maxCodeLines < 100) {
      const context = this.buildContextPrompt();
      if (context) {
        prompt = context + "\n\n## NOVA SOLICITAÇÃO\n" + userMessage;
      }
    }

    return prompt;
  }

  // Gerar instruções para fragmentar código
  buildFragmentationInstructions(maxLines) {
    return `

IMPORTANTE: Seu código será usado em um ambiente com limite de tokens.
Se o código for maior que ${maxLines} linhas, divida em partes com comentários claros:

// ===== PARTE 1 =====
// [descrição]
[código]

// ===== PARTE 2 =====
// [descrição]
[código]

Cada parte deve funcionar independentemente ou ser facilmente combinada.`;
  }

  // Resetar cérebro (nova sessão)
  reset() {
    this.memories = [];
    this.codeFragments = [];
  }
}

window.BrainSystem = BrainSystem;
