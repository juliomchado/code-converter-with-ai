import type { ConversionRequest, ConversionResponse } from "../types";

export class ConversionService {
  private static readonly CLAUDE_ENDPOINT =
    "https://api.anthropic.com/v1/messages";
  private static readonly DEEPSEEK_ENDPOINT =
    "https://api.deepseek.com/v1/chat/completions";
  private static readonly OPENAI_ENDPOINT =
    "https://api.openai.com/v1/chat/completions";
  private static readonly OPENROUTER_ENDPOINT =
    "https://openrouter.ai/api/v1/chat/completions";
  private static readonly GEMINI_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  // No server-side API keys - all keys come from user input only

  // Client-side only conversion - all API keys come from user input
  static async convertCode(
    request: ConversionRequest,
    userKeys: {
      deepseek?: string;
      claude?: string;
      openai?: string;
      openrouter?: string;
      gemini?: string;
    }
  ): Promise<ConversionResponse> {
    const deepseekKey = userKeys?.deepseek?.trim();
    const claudeKey = userKeys?.claude?.trim();
    const openaiKey = userKeys?.openai?.trim();
    const openrouterKey = userKeys?.openrouter?.trim();
    const geminiKey = userKeys?.gemini?.trim();

    // Debug logging
    console.log("Available API keys:", {
      gemini: !!geminiKey,
      openrouter: !!openrouterKey,
      deepseek: !!deepseekKey,
      claude: !!claudeKey,
      openai: !!openaiKey,
    });

    // Try Gemini first (FREE with generous limits)
    if (geminiKey) {
      console.log("Trying Google Gemini...");
      const result = await this.convertWithGemini(request, geminiKey);
      if (!result.error) return result;
    }

    // Try OpenRouter second (can access DeepSeek but paid)
    if (openrouterKey) {
      console.log("Trying OpenRouter...");
      const result = await this.convertWithOpenRouter(request, openrouterKey);
      if (!result.error) return result;
    }

    // Try DeepSeek direct (free)
    if (deepseekKey) {
      console.log("Trying DeepSeek...");
      const result = await this.convertWithDeepSeek(request, deepseekKey);
      if (!result.error) return result;
    }

    // Fallback to Claude
    if (claudeKey) {
      console.log("Trying Claude...");
      const result = await this.convertWithClaude(request, claudeKey);
      if (!result.error) return result;
    }

    // Fallback to OpenAI
    if (openaiKey) {
      console.log("Trying OpenAI...");
      const result = await this.convertWithOpenAI(request, openaiKey);
      if (!result.error) return result;
    }

    // If no API keys work, provide helpful guidance and use mock conversion
    console.log("No working API keys found, using mock conversion...");
    const mockResult = await this.mockConvertCode(request);
    return {
      ...mockResult,
      error:
        mockResult.error ||
        "⚠️ No valid API keys provided. Please add your API key in the settings above. Google Gemini offers a generous free tier!",
    };
  }

  // OpenRouter API (can access DeepSeek and other models)
  static async convertWithOpenRouter(
    request: ConversionRequest,
    apiKey: string
  ): Promise<ConversionResponse> {
    try {
      const prompt = `Convert the following ${request.fromLanguage} code to ${request.toLanguage}. 
Only return the converted code without any explanations, comments, or markdown formatting. 
Return just the raw code that can be copied and used directly.

Source code:
${request.sourceCode}`;

      const response = await fetch(this.OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "CodeConverter",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-coder", // Use DeepSeek through OpenRouter
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 4000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `OpenRouter API failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          convertedCode: data.choices[0].message.content.trim(),
        };
      } else {
        throw new Error("Unexpected response format from OpenRouter API");
      }
    } catch (error) {
      console.error("OpenRouter conversion error:", error);
      let errorMessage = "OpenRouter conversion failed";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "OpenRouter API key is invalid or expired";
        } else if (error.message.includes("402")) {
          errorMessage =
            "OpenRouter: Insufficient credits. Please add credits to your account.";
        } else if (error.message.includes("429")) {
          errorMessage =
            "OpenRouter: Rate limit exceeded. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        convertedCode: "",
        error: errorMessage,
      };
    }
  }

  // Google Gemini API (FREE with generous limits)
  static async convertWithGemini(
    request: ConversionRequest,
    apiKey: string
  ): Promise<ConversionResponse> {
    try {
      const prompt = `Convert the following ${request.fromLanguage} code to ${request.toLanguage}. 
Only return the converted code without any explanations, comments, or markdown formatting. 
Return just the raw code that can be copied and used directly.

Source code:
${request.sourceCode}`;

      console.log(
        "Gemini API URL:",
        `${this.GEMINI_ENDPOINT}?key=${apiKey.substring(0, 10)}...`
      );

      const response = await fetch(`${this.GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error response:", errorText);
        throw new Error(
          `Gemini API failed: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        return {
          convertedCode: data.candidates[0].content.parts[0].text.trim(),
        };
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini conversion error:", error);
      let errorMessage = "Gemini conversion failed";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Gemini API key is invalid or expired";
        } else if (error.message.includes("403")) {
          errorMessage =
            "Gemini API key does not have permission or quota exceeded";
        } else if (error.message.includes("429")) {
          errorMessage = "Gemini: Rate limit exceeded. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      return {
        convertedCode: "",
        error: errorMessage,
      };
    }
  }

  // DeepSeek API (Free tier available)
  static async convertWithDeepSeek(
    request: ConversionRequest,
    apiKey: string
  ): Promise<ConversionResponse> {
    try {
      const prompt = `Convert the following ${request.fromLanguage} code to ${request.toLanguage}. 
Only return the converted code without any explanations, comments, or markdown formatting. 
Return just the raw code that can be copied and used directly.

Source code:
${request.sourceCode}`;

      const response = await fetch(this.DEEPSEEK_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-coder",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 4000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `DeepSeek API failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          convertedCode: data.choices[0].message.content.trim(),
        };
      } else {
        throw new Error("Unexpected response format from DeepSeek API");
      }
    } catch (error) {
      console.error("DeepSeek conversion error:", error);
      return {
        convertedCode: "",
        error:
          error instanceof Error ? error.message : "DeepSeek conversion failed",
      };
    }
  }

  // Claude API
  static async convertWithClaude(
    request: ConversionRequest,
    apiKey: string
  ): Promise<ConversionResponse> {
    try {
      const prompt = `Convert the following ${request.fromLanguage} code to ${request.toLanguage}. 
Only return the converted code without any explanations or markdown formatting:

\`\`\`${request.fromLanguage}
${request.sourceCode}
\`\`\``;

      const response = await fetch(this.CLAUDE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Claude API failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.content && data.content[0] && data.content[0].text) {
        return {
          convertedCode: data.content[0].text.trim(),
        };
      } else {
        throw new Error("Unexpected response format from Claude API");
      }
    } catch (error) {
      console.error("Claude conversion error:", error);
      return {
        convertedCode: "",
        error:
          error instanceof Error ? error.message : "Claude conversion failed",
      };
    }
  }

  // OpenAI API
  static async convertWithOpenAI(
    request: ConversionRequest,
    apiKey: string
  ): Promise<ConversionResponse> {
    try {
      const prompt = `Convert the following ${request.fromLanguage} code to ${request.toLanguage}. 
Only return the converted code without any explanations, comments, or markdown formatting. 
Return just the raw code that can be copied and used directly.

Source code:
${request.sourceCode}`;

      const response = await fetch(this.OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 4000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          convertedCode: data.choices[0].message.content.trim(),
        };
      } else {
        throw new Error("Unexpected response format from OpenAI API");
      }
    } catch (error) {
      console.error("OpenAI conversion error:", error);
      return {
        convertedCode: "",
        error:
          error instanceof Error ? error.message : "OpenAI conversion failed",
      };
    }
  }

  static async mockConvertCode(
    request: ConversionRequest
  ): Promise<ConversionResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockConversions: Record<string, string> = {
      "python-javascript": `function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      "javascript-python": `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
    };

    const key = `${request.fromLanguage}-${request.toLanguage}`;
    const convertedCode =
      mockConversions[key] ||
      `// MOCK CONVERSION - This is not a real AI conversion
// From: ${request.fromLanguage} → To: ${request.toLanguage}
// 
// Original code (commented out):
// ${request.sourceCode.split("\n").join("\n// ")}

// For real AI-powered code conversion, try these FREE options:
// 1. Groq: https://groq.com (free tier with limits)
// 2. Google AI Studio: https://aistudio.google.com (free Gemini API)
// 3. Cohere: https://cohere.com (free tier available)
// 4. Hugging Face: https://huggingface.co/inference-api
// 5. GitHub Copilot (if you have student access)
// 
// OR add credits to your OpenRouter account

console.log("This is a mock conversion - get a real API key for actual AI conversion!");`;

    return {
      convertedCode,
    };
  }
}
