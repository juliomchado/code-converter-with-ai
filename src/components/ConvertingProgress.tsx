import React, { useState, useEffect } from 'react';
import { Bot, Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface ConvertingProgressProps {
  isConverting: boolean;
  currentProvider?: string;
  onCancel?: () => void;
}

const conversionSteps = [
  { id: 1, text: 'Analyzing source code...', icon: '🔍' },
  { id: 2, text: 'Understanding code structure...', icon: '🧠' },
  { id: 3, text: 'AI processing conversion...', icon: '⚡' },
  { id: 4, text: 'Optimizing target syntax...', icon: '✨' },
  { id: 5, text: 'Finalizing conversion...', icon: '🎯' }
];

const providerInfo = {
  gemini: { name: 'Google Gemini', color: '#4285f4', description: 'High-quality free conversion' },
  openrouter: { name: 'OpenRouter', color: '#ff6b35', description: 'Multi-model gateway' },
  deepseek: { name: 'DeepSeek', color: '#00d4aa', description: 'Code-specialized AI' },
  claude: { name: 'Claude', color: '#d97706', description: 'Advanced reasoning' },
  openai: { name: 'OpenAI', color: '#10b981', description: 'Industry standard' }
};

export const ConvertingProgress: React.FC<ConvertingProgressProps> = ({
  isConverting,
  currentProvider = 'gemini',
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isConverting) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < conversionSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800); // Change step every 800ms

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) {
          return prev + Math.random() * 15;
        }
        return prev;
      });
    }, 200); // Update progress every 200ms

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isConverting]);

  if (!isConverting) return null;

  const provider = providerInfo[currentProvider as keyof typeof providerInfo] || providerInfo.gemini;

  return (
    <div className="converting-overlay">
      <div className="converting-modal">
        <div className="converting-header">
          <div className="converting-provider" style={{ borderColor: provider.color }}>
            <Bot size={24} style={{ color: provider.color }} />
            <div>
              <h3 className="converting-provider-name">{provider.name}</h3>
              <p className="converting-provider-desc">{provider.description}</p>
            </div>
          </div>
        </div>

        <div className="converting-progress">
          <div className="converting-progress-bar">
            <div 
              className="converting-progress-fill" 
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: provider.color 
              }}
            />
          </div>
          <span className="converting-progress-text">
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>

        <div className="converting-steps">
          {conversionSteps.map((step, index) => (
            <div 
              key={step.id} 
              className={`converting-step ${
                index <= currentStep ? 'converting-step-active' : ''
              } ${index < currentStep ? 'converting-step-completed' : ''}`}
            >
              <div className="converting-step-icon">
                {index < currentStep ? (
                  <CheckCircle size={16} style={{ color: provider.color }} />
                ) : index === currentStep ? (
                  <div 
                    className="converting-step-pulse"
                    style={{ backgroundColor: provider.color }}
                  >
                    <span>{step.icon}</span>
                  </div>
                ) : (
                  <div className="converting-step-pending">
                    <span>{step.icon}</span>
                  </div>
                )}
              </div>
              <span className="converting-step-text">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="converting-tips">
          <div className="converting-tip">
            <Zap size={14} />
            <span>AI is analyzing your code structure and syntax patterns</span>
          </div>
        </div>

        {onCancel && (
          <button onClick={onCancel} className="converting-cancel">
            Cancel Conversion
          </button>
        )}
      </div>
    </div>
  );
};