interface ValidationResult {
  isValid: boolean;
  error?: string;
  providerInfo?: {
    name: string;
    model?: string;
    quotaInfo?: string;
  };
}

export class ApiValidationService {
  // Validate Google Gemini API key
  static async validateGeminiKey(apiKey: string): Promise<ValidationResult> {
    if (!apiKey || !apiKey.trim()) {
      return { isValid: false, error: "API key is required" };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          providerInfo: {
            name: "Google Gemini",
            model: "gemini-1.5-flash",
            quotaInfo: `${data.models?.length || "Multiple"} models available`,
          },
        };
      } else if (response.status === 400) {
        return { isValid: false, error: "Invalid API key format" };
      } else if (response.status === 403) {
        return {
          isValid: false,
          error: "API key is invalid or has no permissions",
        };
      } else {
        return {
          isValid: false,
          error: `API validation failed: ${response.status}`,
        };
      }
    } catch (error) {
      return { isValid: false, error: "Network error during validation" };
    }
  }

  // Validate OpenRouter API key
  static async validateOpenRouterKey(
    apiKey: string
  ): Promise<ValidationResult> {
    if (!apiKey || !apiKey.trim()) {
      return { isValid: false, error: "API key is required" };
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          providerInfo: {
            name: "OpenRouter",
            quotaInfo: data.data?.label || "API key validated",
          },
        };
      } else if (response.status === 401) {
        return { isValid: false, error: "Invalid API key" };
      } else {
        return {
          isValid: false,
          error: `Validation failed: ${response.status}`,
        };
      }
    } catch (error) {
      return { isValid: false, error: "Network error during validation" };
    }
  }

  // Validate DeepSeek API key
  static async validateDeepSeekKey(apiKey: string): Promise<ValidationResult> {
    if (!apiKey || !apiKey.trim()) {
      return { isValid: false, error: "API key is required" };
    }

    try {
      const response = await fetch("https://api.deepseek.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return {
          isValid: true,
          providerInfo: {
            name: "DeepSeek",
            model: "deepseek-coder",
            quotaInfo: "API key validated",
          },
        };
      } else if (response.status === 401) {
        return { isValid: false, error: "Invalid API key" };
      } else {
        return {
          isValid: false,
          error: `Validation failed: ${response.status}`,
        };
      }
    } catch (error) {
      return { isValid: false, error: "Network error during validation" };
    }
  }

  // Validate Claude API key
  static async validateClaudeKey(apiKey: string): Promise<ValidationResult> {
    if (!apiKey || !apiKey.trim()) {
      return { isValid: false, error: "API key is required" };
    }

    // Simple format validation for Claude keys
    if (!apiKey.startsWith("sk-ant-")) {
      return {
        isValid: false,
        error: "Invalid Claude API key format (should start with sk-ant-)",
      };
    }

    return {
      isValid: true,
      providerInfo: {
        name: "Claude",
        quotaInfo:
          "Key format is valid (verification requires actual API call)",
      },
    };
  }

  // Validate OpenAI API key
  static async validateOpenAIKey(apiKey: string): Promise<ValidationResult> {
    if (!apiKey || !apiKey.trim()) {
      return { isValid: false, error: "API key is required" };
    }

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          providerInfo: {
            name: "OpenAI",
            quotaInfo: `${data.data?.length || "Multiple"} models available`,
          },
        };
      } else if (response.status === 401) {
        return { isValid: false, error: "Invalid API key" };
      } else {
        return {
          isValid: false,
          error: `Validation failed: ${response.status}`,
        };
      }
    } catch (error) {
      return { isValid: false, error: "Network error during validation" };
    }
  }

  // Main validation function
  static async validateApiKey(
    provider: string,
    apiKey: string
  ): Promise<ValidationResult> {
    switch (provider) {
      case "gemini":
        return this.validateGeminiKey(apiKey);
      case "openrouter":
        return this.validateOpenRouterKey(apiKey);
      case "deepseek":
        return this.validateDeepSeekKey(apiKey);
      case "claude":
        return this.validateClaudeKey(apiKey);
      case "openai":
        return this.validateOpenAIKey(apiKey);
      default:
        return { isValid: false, error: "Unknown provider" };
    }
  }
}
