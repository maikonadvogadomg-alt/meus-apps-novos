// ===== TOKEN MANAGER =====
// Controla tokens para diferentes modelos de IA

class TokenManager {
  constructor() {
    this.models = {
      // Modelos gratuitos (com limites)
      "gpt-3.5-turbo": {
        name: "GPT-3.5 Turbo (Gratuito)",
        maxTokensPerRequest: 2000,
        maxTokensPerDay: 40000,
        costPer1kTokens: 0,
        isGratuito: true,
        maxCodeLines: 50
      },
      "gpt-4-turbo": {
        name: "GPT-4 Turbo (Pago)",
        maxTokensPerRequest: 4000,
        maxTokensPerDay: 100000,
        costPer1kTokens: 0.03,
        isGratuito: false,
        maxCodeLines: 200
      },
      "gpt-4": {
        name: "GPT-4 (Pago)",
        maxTokensPerRequest: 8000,
        maxTokensPerDay: 200000,
        costPer1kTokens: 0.06,
        isGratuito: false,
        maxCodeLines: 500
      },
      "claude-3-haiku": {
        name: "Claude 3 Haiku (Gratuito)",
        maxTokensPerRequest: 2000,
        maxTokensPerDay: 30000,
        costPer1kTokens: 0,
        isGratuito: true,
        maxCodeLines: 40
      },
      "claude-3-sonnet": {
        name: "Claude 3 Sonnet (Pago)",
        maxTokensPerRequest: 4000,
        maxTokensPerDay: 100000,
        costPer1kTokens: 0.015,
        isGratuito: false,
        maxCodeLines: 300
      },
      "claude-3-opus": {
        name: "Claude 3 Opus (Pago)",
        maxTokensPerRequest: 8000,
        maxTokensPerDay: 200000,
        costPer1kTokens: 0.075,
        isGratuito: false,
        maxCodeLines: 1000
      }
    };

    this.currentModel = "gpt-3.5-turbo";
    this.dailyTokensUsed = 0;
    this.sessionTokensUsed = 0;
  }

  setModel(modelName) {
    if (this.models[modelName]) {
      this.currentModel = modelName;
      return true;
    }
    return false;
  }

  getModelInfo() {
    return this.models[this.currentModel];
  }

  canMakeRequest(estimatedTokens) {
    const model = this.getModelInfo();

    if (this.dailyTokensUsed + estimatedTokens > model.maxTokensPerDay) {
      return {
        allowed: false,
        reason: "Limite diário atingido",
        remaining: model.maxTokensPerDay - this.dailyTokensUsed
      };
    }

    if (estimatedTokens > model.maxTokensPerRequest) {
      return {
        allowed: false,
        reason: "Solicitação muito grande",
        max: model.maxTokensPerRequest,
        requested: estimatedTokens
      };
    }

    return { allowed: true };
  }

  addTokens(inputTokens, outputTokens) {
    const totalTokens = inputTokens + outputTokens;
    this.dailyTokensUsed += totalTokens;
    this.sessionTokensUsed += totalTokens;

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      dailyTotal: this.dailyTokensUsed,
      sessionTotal: this.sessionTokensUsed,
      cost: this.calculateCost(totalTokens)
    };
  }

  calculateCost(tokens) {
    const model = this.getModelInfo();
    return (tokens / 1000) * model.costPer1kTokens;
  }

  estimateTokens(text) {
    // Aproximação: 1 token ≈ 4 caracteres
    return Math.ceil(text.length / 4);
  }

  getProgress() {
    const model = this.getModelInfo();
    const dailyPercent = (this.dailyTokensUsed / model.maxTokensPerDay) * 100;

    return {
      model: model.name,
      dailyUsed: this.dailyTokensUsed,
      dailyMax: model.maxTokensPerDay,
      dailyPercent: Math.min(dailyPercent, 100),
      sessionUsed: this.sessionTokensUsed,
      isGratuito: model.isGratuito,
      maxCodeLines: model.maxCodeLines
    };
  }

  reset() {
    this.sessionTokensUsed = 0;
  }
}

// Exportar para uso global
window.TokenManager = TokenManager;
