export class UniversalAIAdapter {
  constructor(apiKey, provider) {
    this.apiKey = apiKey;
    this.provider = provider.toLowerCase();
    
    if (this.provider === 'openai') {
      this.baseUrl = 'https://api.openai.com/v1/chat/completions';
      this.model = 'gpt-4o-mini';
    } else if (this.provider === 'groq') {
      this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
      this.model = 'llama-3.1-70b-versatile'; // Model Llama 3.1 70B terbaru (Sangat pintar & cepat)
    } else if (this.provider === 'anthropic') {
      this.baseUrl = 'https://api.anthropic.com/v1/messages';
      this.model = 'claude-3-5-sonnet-20240620';
    } else {
      this.baseUrl = provider;
      this.model = 'default';
    }
    
    this.messages = [];
  }

  startChat(systemInstruction) {
    this.messages = [];
    if (systemInstruction && this.provider !== 'anthropic') {
      this.messages.push({ role: 'system', content: systemInstruction });
    }
    this.systemInstruction = systemInstruction;
    return this;
  }

  async sendMessage(messageText) {
    this.messages.push({ role: 'user', content: messageText });

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    if (this.provider === 'anthropic') {
      headers['x-api-key'] = this.apiKey;
      delete headers['Authorization'];
      headers['anthropic-version'] = '2023-06-01';
      headers['anthropic-dangerously-allow-browser'] = 'true';
    }

    try {
      let body;
      
      if (this.provider === 'anthropic') {
        body = JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          system: this.systemInstruction,
          messages: this.messages.filter(m => m.role !== 'system')
        });
      } else {
        body = JSON.stringify({
          model: this.model,
          messages: this.messages,
          temperature: 0.8,
          max_tokens: 1024
        });
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'API Request Failed');
      }

      const data = await response.json();
      let replyText = '';

      if (this.provider === 'anthropic') {
        replyText = data.content[0].text;
      } else {
        replyText = data.choices[0].message.content;
      }

      this.messages.push({ role: 'assistant', content: replyText });

      // Duck-type to match the expected return structure in aiController.js
      return { response: { text: () => replyText } };
    } catch (error) {
      console.error(`[AI Adapter] Error with ${this.provider}:`, error);
      throw error;
    }
  }
}
