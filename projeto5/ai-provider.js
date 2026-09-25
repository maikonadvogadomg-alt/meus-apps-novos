// ===== AI PROVIDER =====
// Suporta múltiplas IAs com interface unificada

class AIProvider {
  constructor() {
    this.providers = {
      // OpenAI
      "openai-gpt35": {
        name: "OpenAI GPT-3.5",
        type: "openai",
        model: "gpt-3.5-turbo",
        maxTokens: 2000,
        costPer1k: 0.0005,
        isGratuito: false
      },
      "openai-gpt4": {
        name: "OpenAI GPT-4",
        type: "openai",
        model: "gpt-4",
        maxTokens: 8000,
        costPer1k: 0.03,
        isGratuito: false
      },

      // Claude (Anthropic)
      "claude-haiku": {
        name: "Claude 3 Haiku",
        type: "claude",
        model: "claude-3-haiku-20240307",
        maxTokens: 2000,
        costPer1k: 0.00025,
        isGratuito: false
      },
      "claude-sonnet": {
        name: "Claude 3 Sonnet",
        type: "claude",
        model: "claude-3-sonnet-20240229",
        maxTokens: 4000,
        costPer1k: 0.003,
        isGratuito: false
      },
      "claude-opus": {
        name: "Claude 3 Opus",
        type: "claude",
        model: "claude-3-opus-20240229",
        maxTokens: 8000,
        costPer1k: 0.015,
        isGratuito: false
      },

      // Google Gemini
      "gemini-pro": {
        name: "Google Gemini Pro",
        type: "gemini",
        model: "gemini-pro",
        maxTokens: 4000,
        costPer1k: 0.0005,
        isGratuito: true
      },
      "gemini-pro-vision": {
        name: "Google Gemini Pro Vision",
        type: "gemini",
        model: "gemini-pro-vision",
        maxTokens: 4000,
        costPer1k: 0.001,
        isGratuito: false
      },

      // Ollama (Local - Gratuito)
      "ollama-mistral": {
        name: "Mistral (Local)",
        type: "ollama",
        model: "mistral",
        maxTokens: 4000,
        costPer1k: 0,
        isGratuito: true,
        endpoint: "http://localhost:11434"
      },
      "ollama-neural": {
        name: "Neural Chat (Local)",
        type: "ollama",
        model: "neural-chat",
        maxTokens: 4000,
        costPer1k: 0,
        isGratuito: true,
        endpoint: "http://localhost:11434"
      },

      // Groq (Rápido e Gratuito)
      "groq-mixtral": {
        name: "Groq Mixtral (Rápido)",
        type: "groq",
        model: "mixtral-8x7b-32768",
        maxTokens: 4000,
        costPer1k: 0,
        isGratuito: true
      },

      // HuggingFace
      "hf-mistral": {
        name: "HuggingFace Mistral",
        type: "huggingface",
        model: "mistralai/Mistral-7B-Instruct-v0.1",
        maxTokens: 2000,
        costPer1k: 0,
        isGratuito: true
      }
    };

    this.currentProvider = "openai-gpt35";
    this.apiKeys = {};
  }

  setProvider(providerKey) {
    if (this.providers[providerKey]) {
      this.currentProvider = providerKey;
      return true;
    }
    return false;
  }

  getProvider() {
    return this.providers[this.currentProvider];
  }

  setApiKey(providerKey, apiKey) {
    this.apiKeys[providerKey] = apiKey;
  }

  getApiKey(providerKey) {
    return this.apiKeys[providerKey] || localStorage.getItem(`ai_key_${providerKey}`);
  }

  async call(messages, systemPrompt = "") {
    const provider = this.getProvider();
    const apiKey = this.getApiKey(this.currentProvider);

    if (!apiKey && provider.type !== "ollama") {
      throw new Error("API Key não configurada para " + provider.name);
    }

    const fullMessages = systemPrompt
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : messages;

    switch (provider.type) {
      case "openai":
        return await this._callOpenAI(fullMessages, provider, apiKey);
      case "claude":
        return await this._callClaude(fullMessages, provider, apiKey);
      case "gemini":
        return await this._callGemini(fullMessages, provider, apiKey);
      case "ollama":
        return await this._callOllama(fullMessages, provider);
      case "groq":
        return await this._callGroq(fullMessages, provider, apiKey);
      case "huggingface":
        return await this._callHuggingFace(fullMessages, provider, apiKey);
      default:
        throw new Error("Provider não suportado");
    }
  }

  async _callOpenAI(messages, provider, apiKey) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages,
        max_tokens: provider.maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro OpenAI");
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      inputTokens: data.usage.prompt_tokens,
      outputTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    };
  }

  async _callClaude(messages, provider, apiKey) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: provider.maxTokens,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro Claude");
    }

    const data = await response.json();
    return {
      text: data.content[0].text,
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
      totalTokens: data.usage.input_tokens + data.usage.output_tokens
    };
  }

  async _callGemini(messages, provider, apiKey) {
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: provider.maxTokens }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro Gemini");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return {
      text,
      inputTokens: Math.ceil(messages.join("").length / 4),
      outputTokens: Math.ceil(text.length / 4),
      totalTokens: Math.ceil((messages.join("") + text).length / 4)
    };
  }

  async _callOllama(messages, provider) {
    const response = await fetch(`${provider.endpoint}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: provider.model,
        messages,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Erro Ollama - Certifique-se que está rodando");
    }

    const data = await response.json();
    return {
      text: data.message.content,
      inputTokens: data.prompt_eval_count || 0,
      outputTokens: data.eval_count || 0,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
    };
  }

  async _callGroq(messages, provider, apiKey) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages,
        max_tokens: provider.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro Groq");
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      inputTokens: data.usage.prompt_tokens,
      outputTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    };
  }

  async _callHuggingFace(messages, provider, apiKey) {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${provider.model}`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      throw new Error("Erro HuggingFace");
    }

    const data = await response.json();
    const text = data[0]?.generated_text || "";

    return {
      text,
      inputTokens: Math.ceil(prompt.length / 4),
      outputTokens: Math.ceil(text.length / 4),
      totalTokens: Math.ceil((prompt + text).length / 4)
    };
  }

  listProviders() {
    return Object.entries(this.providers).map(([key, value]) => ({
      key,
      ...value
    }));
  }

  listFreeProviders() {
    return this.listProviders().filter(p => p.isGratuito);
  }
}

window.AIProvider = AIProvider;