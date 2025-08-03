import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = '', 
  size = 'md' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'copy-button-sm';
      case 'lg':
        return 'copy-button-lg';
      default:
        return 'copy-button-md';
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${getSizeClass()} ${copied ? 'copy-button-copied' : ''} ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      disabled={!text}
    >
      {copied ? (
        <>
          <Check size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};