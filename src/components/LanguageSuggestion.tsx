import React from 'react';
import { Lightbulb, Check, X } from 'lucide-react';
import type { Language } from '../types';

interface LanguageSuggestionProps {
  detectedLanguage: string;
  confidence: number;
  currentLanguage: Language | null;
  suggestions: Array<{ name: string; confidence: number }>;
  availableLanguages: Language[];
  onAccept: (language: Language) => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export const LanguageSuggestion: React.FC<LanguageSuggestionProps> = ({
  detectedLanguage,
  confidence,
  currentLanguage,
  suggestions,
  availableLanguages,
  onAccept,
  onDismiss,
  isVisible
}) => {
  if (!isVisible || detectedLanguage === 'unknown' || confidence < 30) {
    return null;
  }

  // Find the matching language object
  const matchedLanguage = availableLanguages.find(
    lang => lang.name.toLowerCase() === detectedLanguage.toLowerCase()
  );

  // Don't show if it's already selected
  if (currentLanguage && currentLanguage.name.toLowerCase() === detectedLanguage.toLowerCase()) {
    return null;
  }

  const handleAccept = () => {
    if (matchedLanguage) {
      onAccept(matchedLanguage);
      onDismiss();
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 70) return 'var(--success)';
    if (conf >= 50) return 'var(--warning)';
    return 'var(--accent)';
  };

  return (
    <div className={`language-suggestion ${isVisible ? 'language-suggestion-visible' : ''}`}>
      <div className="language-suggestion-content">
        <div className="language-suggestion-icon">
          <Lightbulb size={16} style={{ color: getConfidenceColor(confidence) }} />
        </div>
        
        <div className="language-suggestion-info">
          <div className="language-suggestion-main">
            <span className="language-suggestion-text">
              Detected: <strong>{detectedLanguage}</strong>
            </span>
            <span 
              className="language-suggestion-confidence"
              style={{ color: getConfidenceColor(confidence) }}
            >
              {confidence}% confident
            </span>
          </div>
          
          {suggestions.length > 1 && (
            <div className="language-suggestion-alternatives">
              Other possibilities: {suggestions.slice(1, 3).map(s => s.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="language-suggestion-actions">
        {matchedLanguage && (
          <button
            onClick={handleAccept}
            className="language-suggestion-accept"
            title={`Set language to ${detectedLanguage}`}
          >
            <Check size={14} />
          </button>
        )}
        <button
          onClick={onDismiss}
          className="language-suggestion-dismiss"
          title="Dismiss suggestion"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};