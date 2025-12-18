
import axios from "axios";
import config from "./config.js";

const LLM_HOST = config.llm.host;

export class LlmService {
  constructor() {
    this.requestQueue = [];
    this.processing = false;
  }

  /**
   * Standard chat completion (non-streaming)
   */
  async chatCompletion(messages = [], options = {}) {
    const { model = null, temperature = null, tools = null } = options;
    const actualModel = model || config.llm.model;
    const actualTemp = temperature !== null ? temperature : config.llm.temperature;

    try {
      const requestBody = {
        model: actualModel,
        messages: messages,
        temperature: actualTemp,
        stream: false
      };

      // Add tools if provided
      if (tools && tools.length > 0) {
        requestBody.tools = tools;
        requestBody.tool_choice = 'auto';
      }

      const response = await axios.post(
        `${LLM_HOST}/v1/chat/completions`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'dummy'}`
          },
          timeout: config.llm.timeout
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Chat completion with retry logic
   */
  async chatCompletionWithRetry(messages = [], options = {}) {
    const { maxRetries = null, ...otherOptions } = options;
    const retries = maxRetries !== null ? maxRetries : config.llm.maxRetries;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`[LLM] Retry attempt ${attempt}/${retries}`);
          await this.delay(config.llm.retryDelay * Math.pow(2, attempt - 1)); // Exponential backoff
        }

        const result = await this.chatCompletion(messages, otherOptions);
        return result;
      } catch (error) {
        lastError = error;

        // Don't retry on certain errors
        if (error.type === 'invalid_request' || error.type === 'authentication') {
          throw error;
        }

        console.error(`[LLM] Attempt ${attempt + 1} failed:`, error.message);
      }
    }

    throw lastError;
  }

  /**
   * Streaming chat completion
   */
  async chatCompletionStream(messages = [], callbacks = {}) {
    const { onChunk, onComplete, onError } = callbacks;

    try {
      const response = await axios.post(
        `${LLM_HOST}/v1/chat/completions`,
        {
          model: config.llm.model,
          messages: messages,
          temperature: config.llm.temperature,
          stream: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'dummy'}`
          },
          responseType: 'stream',
          timeout: config.llm.timeout
        }
      );

      let fullContent = '';
      let buffer = '';

      response.data.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const content = data.choices?.[0]?.delta?.content;

              if (content) {
                fullContent += content;
                if (onChunk) onChunk(content, fullContent);
              }
            } catch (e) {
              console.error('[LLM] Error parsing stream chunk:', e.message);
            }
          }
        }
      });

      response.data.on('end', () => {
        if (onComplete) onComplete(fullContent);
      });

      response.data.on('error', (error) => {
        if (onError) onError(this.handleError(error));
      });

    } catch (error) {
      if (onError) onError(this.handleError(error));
      throw this.handleError(error);
    }
  }

  /**
   * Validate response against expected schema
   */
  validateResponse(response, schema) {
    try {
      const content = response.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Try to parse as JSON if schema expects object
      if (schema && schema.type === 'object') {
        const parsed = JSON.parse(content);
        return { valid: true, data: parsed };
      }

      return { valid: true, data: content };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Extract JSON from markdown code blocks
   */
  extractJSON(text) {
    // Try direct parse first
    try {
      return JSON.parse(text);
    } catch {
      // Try to extract from markdown code block
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (e) {
          throw new Error('Invalid JSON in code block');
        }
      }

      // Try to find JSON object in text
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch (e) {
          throw new Error('Invalid JSON object in text');
        }
      }

      throw new Error('No valid JSON found in response');
    }
  }

  /**
   * Handle and normalize errors
   */
  handleError(error) {
    if (error.response) {
      // HTTP error
      const status = error.response.status;
      const data = error.response.data;

      return {
        type: status === 401 ? 'authentication' :
          status === 400 ? 'invalid_request' :
            status === 429 ? 'rate_limit' :
              status >= 500 ? 'server_error' : 'unknown',
        message: data?.error?.message || error.message,
        status: status,
        original: error
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        type: 'timeout',
        message: 'Request timeout',
        original: error
      };
    } else if (error.code === 'ECONNREFUSED') {
      return {
        type: 'connection',
        message: 'Cannot connect to LLM service',
        original: error
      };
    } else {
      return {
        type: 'unknown',
        message: error.message,
        original: error
      };
    }
  }

  /**
   * Delay helper for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new LlmService();
