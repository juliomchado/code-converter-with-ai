import { useEffect, useState } from "react";
import {
  Code2,
  Loader2,
  AlertCircle,
  FileCode,
  Terminal,
  Sparkles,
  Zap,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LanguageSelect } from "./components/LanguageSelect";
import { CodeEditor } from "./components/CodeEditor";
import { ThemeToggle } from "./components/ThemeToggle";
import { ApiKeyInput } from "./components/ApiKeyInput";
import { ConvertingProgress } from "./components/ConvertingProgress";
import { NotificationContainer } from "./components/Notification";
import type { NotificationProps } from "./components/Notification";
import { CopyButton } from "./components/CopyButton";
import { FormatButton } from "./components/FormatButton";
import { ConversionService } from "./services/conversionService";
import { ApiValidationService } from "./services/apiValidationService";
import { ThemeProvider } from "./contexts/ThemeContext";
import type { Language } from "./types";

function App() {
  const [sourceCode, setSourceCode] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState<Language | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>("gemini");
  const [error, setError] = useState<string | null>(null);

  // Notification system
  const [notifications, setNotifications] = useState<
    Array<NotificationProps & { id: string }>
  >([]);

  // API Key states
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [activeApiProvider, setActiveApiProvider] = useState<
    "gemini" | "openrouter" | "deepseek" | "claude" | "openai"
  >("gemini");
  const [apiKeys, setApiKeys] = useState(() => {
    // Load API keys from localStorage on init
    const saved = localStorage.getItem("codeconverter-api-keys");
    const defaultKeys = {
      gemini: "",
      openrouter: "",
      deepseek: "",
      claude: "",
      openai: "",
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all values are strings
      return {
        gemini: parsed.gemini || "",
        openrouter: parsed.openrouter || "",
        deepseek: parsed.deepseek || "",
        claude: parsed.claude || "",
        openai: parsed.openai || "",
      };
    }
    return defaultKeys;
  });

  useEffect(() => {
    console.log("Alguém entrou");
  }, []);

  const handleConvert = async () => {
    if (!sourceCode.trim() || !sourceLanguage || !targetLanguage) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message:
          "Please enter code and select both source and target languages",
      });
      return;
    }

    if (sourceLanguage.id === targetLanguage.id) {
      addNotification({
        type: "error",
        title: "Invalid Selection",
        message: "Source and target languages cannot be the same",
      });
      return;
    }

    // Determine which provider to use based on available keys
    const availableProvider =
      Object.entries(apiKeys).find(([value]) => value.trim())?.[0] || "gemini";
    setCurrentProvider(availableProvider);

    setError(null);
    setIsConverting(true);
    setConvertedCode("");

    try {
      const result = await ConversionService.convertCode(
        {
          sourceCode,
          fromLanguage: sourceLanguage.name,
          toLanguage: targetLanguage.name,
        },
        apiKeys
      );

      if (result.error) {
        setError(result.error);
        addNotification({
          type: "error",
          title: "Conversion Failed",
          message: result.error,
        });
      } else {
        setConvertedCode(result.convertedCode);
        addNotification({
          type: "success",
          title: "Conversion Complete",
          message: `Successfully converted ${sourceLanguage.name} to ${targetLanguage.name}`,
        });
      }
    } catch (err) {
      const errorMessage = "Failed to convert code. Please try again.";
      setError(errorMessage);
      addNotification({
        type: "error",
        title: "Conversion Error",
        message: errorMessage,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const clearError = () => setError(null);

  const updateApiKey = (
    provider: "gemini" | "openrouter" | "deepseek" | "claude" | "openai",
    key: string
  ) => {
    const newKeys = { ...apiKeys, [provider]: key };
    setApiKeys(newKeys);
    // Save to localStorage immediately
    localStorage.setItem("codeconverter-api-keys", JSON.stringify(newKeys));
  };

  // Notification functions
  const addNotification = (
    notification: Omit<NotificationProps, "onClose">
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [
      ...prev,
      { ...notification, id, onClose: () => {} },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const saveApiKeys = async () => {
    const currentKey = apiKeys[activeApiProvider];

    if (!currentKey.trim()) {
      addNotification({
        type: "error",
        title: "Validation Failed",
        message: "Please enter an API key before saving.",
      });
      return;
    }

    // Validate API key
    addNotification({
      type: "info",
      title: "Validating API Key",
      message: "Checking your API key...",
    });

    try {
      const validation = await ApiValidationService.validateApiKey(
        activeApiProvider,
        currentKey
      );

      if (validation.isValid) {
        localStorage.setItem("codeconverter-api-keys", JSON.stringify(apiKeys));
        setError(null);

        addNotification({
          type: "success",
          title: "API Key Validated",
          message: `${validation.providerInfo?.name} API key is valid and ready to use!`,
        });
      } else {
        addNotification({
          type: "error",
          title: "Invalid API Key",
          message: validation.error || "API key validation failed",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message:
          "Unable to validate API key. Please check your internet connection.",
      });
    }
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <div className="noise-overlay"></div>

        <div className="container">
          <header className="header">
            <nav className="header-nav">
              <a href="#" className="brand">
                <div className="logo-wrapper">
                  <div className="logo">
                    <Code2 size={24} />
                  </div>
                </div>
                <span className="brand-name">CodeConverter</span>
              </a>
              <ThemeToggle />
            </nav>

            <div className="hero-section">
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>AI Code Translation</span>
              </div>

              <h1 className="hero-title">Code Converter</h1>

              <p className="hero-subtitle">
                Convert between 25+ languages instantly with AI
              </p>
            </div>
          </header>

          {/* API Settings */}
          <div className="api-settings">
            <div className="api-settings-header">
              <div className="api-settings-title">
                <Settings size={18} />
                <span>API Configuration</span>
              </div>
              <button
                onClick={() => setShowApiSettings(!showApiSettings)}
                className="api-toggle"
              >
                {showApiSettings ? (
                  <>
                    Hide <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Configure <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>

            {showApiSettings && (
              <>
                <div className="api-tabs">
                  <button
                    onClick={() => setActiveApiProvider("gemini")}
                    className={`api-tab ${
                      activeApiProvider === "gemini" ? "active" : ""
                    }`}
                  >
                    Google Gemini (FREE) ⭐
                  </button>
                  <button
                    onClick={() => setActiveApiProvider("openrouter")}
                    className={`api-tab ${
                      activeApiProvider === "openrouter" ? "active" : ""
                    }`}
                  >
                    OpenRouter
                  </button>
                  <button
                    onClick={() => setActiveApiProvider("deepseek")}
                    className={`api-tab ${
                      activeApiProvider === "deepseek" ? "active" : ""
                    }`}
                  >
                    DeepSeek
                  </button>
                  <button
                    onClick={() => setActiveApiProvider("claude")}
                    className={`api-tab ${
                      activeApiProvider === "claude" ? "active" : ""
                    }`}
                  >
                    Claude
                  </button>
                  <button
                    onClick={() => setActiveApiProvider("openai")}
                    className={`api-tab ${
                      activeApiProvider === "openai" ? "active" : ""
                    }`}
                  >
                    OpenAI
                  </button>
                </div>

                <ApiKeyInput
                  apiKey={apiKeys[activeApiProvider]}
                  onApiKeyChange={(key) => updateApiKey(activeApiProvider, key)}
                  provider={activeApiProvider}
                />

                <div className="api-save-section">
                  <button onClick={saveApiKeys} className="api-save-button">
                    Save API Keys
                  </button>
                  <div className="api-security-info">
                    <p className="api-save-description">
                      🔒 Keys are saved locally in your browser only
                    </p>
                    <p className="api-security-warning">
                      ℹ️ Privacy: Your API keys never leave your browser. All AI
                      requests go directly to the providers.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="error-container">
              <div className="error-message">
                <AlertCircle size={20} />
                <div className="error-text">
                  <p>{error}</p>
                </div>
                <button onClick={clearError} className="error-close">
                  ×
                </button>
              </div>
            </div>
          )}

          <main className="workspace fade-in-up">
            <div className="main-grid">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-icon">
                    <FileCode size={18} />
                  </div>
                  <div>
                    <div className="panel-title">Source</div>
                  </div>
                </div>

                <div>
                  <LanguageSelect
                    selectedLanguage={sourceLanguage}
                    onLanguageChange={setSourceLanguage}
                    placeholder="From"
                  />
                </div>

                <div>
                  <div className="code-actions">
                    <div className="code-actions-left">
                      <span className="panel-subtitle">
                        {sourceLanguage?.name || "Select language"}
                      </span>
                    </div>
                    <div className="code-actions-right">
                      <FormatButton
                        code={sourceCode}
                        language={sourceLanguage?.name || ""}
                        onFormatted={setSourceCode}
                      />
                      <CopyButton text={sourceCode} size="sm" />
                    </div>
                  </div>
                  <CodeEditor
                    value={sourceCode}
                    onChange={setSourceCode}
                    language={sourceLanguage}
                    placeholder="Paste your code..."
                    height="24rem"
                  />
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-icon">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <div className="panel-title">Result</div>
                  </div>
                </div>

                <div>
                  <LanguageSelect
                    selectedLanguage={targetLanguage}
                    onLanguageChange={setTargetLanguage}
                    placeholder="To"
                  />
                </div>

                <div>
                  <div className="code-actions">
                    <div className="code-actions-left">
                      <span className="panel-subtitle">
                        {targetLanguage?.name || "Select language"}
                      </span>
                    </div>
                    <div className="code-actions-right">
                      <FormatButton
                        code={convertedCode}
                        language={targetLanguage?.name || ""}
                        onFormatted={setConvertedCode}
                      />
                      <CopyButton text={convertedCode} size="sm" />
                    </div>
                  </div>
                  <CodeEditor
                    value={convertedCode}
                    onChange={() => {}}
                    language={targetLanguage}
                    placeholder="Converted code..."
                    readOnly
                    height="24rem"
                  />
                </div>
              </div>
            </div>

            <div className="convert-section">
              <button
                onClick={handleConvert}
                disabled={
                  isConverting ||
                  !sourceCode.trim() ||
                  !sourceLanguage ||
                  !targetLanguage
                }
                className="convert-button"
              >
                {isConverting ? (
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Zap size={18} />
                )}
                <span>{isConverting ? "Converting..." : "Convert"}</span>
              </button>
            </div>
          </main>

          <footer className="footer">
            <p>Built with React, TypeScript, and powered by AI</p>
          </footer>
        </div>

        {/* Converting Progress Overlay */}
        <ConvertingProgress
          isConverting={isConverting}
          currentProvider={currentProvider}
        />

        {/* Notification System */}
        <NotificationContainer
          notifications={notifications}
          removeNotification={removeNotification}
        />
      </div>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
