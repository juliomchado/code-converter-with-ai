import React, { useState } from 'react';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  provider: 'gemini' | 'openrouter' | 'deepseek' | 'claude' | 'openai';
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  apiKey,
  onApiKeyChange,
  provider
}) => {
  const [showKey, setShowKey] = useState(false);

  const providerInfo = {
    gemini: {
      name: 'Google Gemini',
      url: 'https://aistudio.google.com',
      free: true,
      description: 'Generous free tier - 15 requests/minute, best free option!'
    },
    openrouter: {
      name: 'OpenRouter',
      url: 'https://openrouter.ai',
      free: false,
      description: 'Access DeepSeek and other models with pay-per-use pricing'
    },
    deepseek: {
      name: 'DeepSeek',
      url: 'https://platform.deepseek.com',
      free: true,
      description: 'Free API with generous limits'
    },
    claude: {
      name: 'Claude',
      url: 'https://console.anthropic.com',
      free: false,
      description: 'High-quality AI (paid)'
    },
    openai: {
      name: 'OpenAI',
      url: 'https://platform.openai.com',
      free: false,
      description: 'GPT models (paid)'
    }
  };

  const info = providerInfo[provider];

  return (
    <div className="api-key-input">
      <div className="api-key-header">
        <div className="api-key-title">
          <Key size={16} />
          <span>{info.name} API Key</span>
          {info.free && <span className="free-badge">FREE</span>}
        </div>
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="api-key-link"
        >
          Get Key <ExternalLink size={14} />
        </a>
      </div>
      
      <div className="api-key-field">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={`Enter your ${info.name} API key...`}
          className="api-key-input-field"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="api-key-toggle"
        >
          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      <p className="api-key-description">{info.description}</p>
    </div>
  );
};