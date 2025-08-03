import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';

interface FormatButtonProps {
  code: string;
  language: string;
  onFormatted: (formattedCode: string) => void;
  className?: string;
}

export const FormatButton: React.FC<FormatButtonProps> = ({ 
  code, 
  language, 
  onFormatted, 
  className = '' 
}) => {
  const [isFormatting, setIsFormatting] = useState(false);

  const formatCode = async () => {
    if (!code.trim()) return;
    
    setIsFormatting(true);
    
    try {
      // Simple code formatting logic
      let formattedCode = code;
      
      // Basic formatting based on language
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
        case 'jsx':
        case 'tsx':
          formattedCode = formatJavaScriptLike(code);
          break;
        case 'python':
          formattedCode = formatPython(code);
          break;
        case 'json':
          try {
            const parsed = JSON.parse(code);
            formattedCode = JSON.stringify(parsed, null, 2);
          } catch {
            formattedCode = code; // Keep original if parsing fails
          }
          break;
        case 'css':
          formattedCode = formatCSS(code);
          break;
        default:
          formattedCode = formatGeneric(code);
      }
      
      onFormatted(formattedCode);
    } catch (error) {
      console.error('Formatting error:', error);
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <button
      onClick={formatCode}
      className={`format-button ${className}`}
      title="Format and beautify code"
      disabled={!code.trim() || isFormatting}
    >
      {isFormatting ? (
        <>
          <Loader2 size={16} className="spinner" />
          <span>Formatting...</span>
        </>
      ) : (
        <>
          <Wand2 size={16} />
          <span>Format</span>
        </>
      )}
    </button>
  );
};

// Formatting functions
function formatJavaScriptLike(code: string): string {
  return code
    .replace(/;\s*}/g, ';\n}')
    .replace(/{\s*/g, ' {\n  ')
    .replace(/;\s*(?=\w)/g, ';\n')
    .replace(/,\s*(?=\w)/g, ',\n  ')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((line, index, array) => {
      const depth = getIndentDepth(line, array, index);
      return '  '.repeat(depth) + line;
    })
    .join('\n');
}

function formatPython(code: string): string {
  return code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((line, index, array) => {
      const depth = getPythonIndentDepth(line, array, index);
      return '    '.repeat(depth) + line;
    })
    .join('\n');
}

function formatCSS(code: string): string {
  return code
    .replace(/{\s*/g, ' {\n  ')
    .replace(/;\s*}/g, ';\n}')
    .replace(/;\s*(?=[\w-])/g, ';\n  ')
    .replace(/,\s*(?=[\w.])/g, ',\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

function formatGeneric(code: string): string {
  return code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
}

function getIndentDepth(line: string, lines: string[], index: number): number {
  let depth = 0;
  
  for (let i = 0; i < index; i++) {
    const prevLine = lines[i];
    if (prevLine.includes('{')) depth++;
    if (prevLine.includes('}')) depth--;
  }
  
  if (line.includes('}')) depth = Math.max(0, depth - 1);
  
  return Math.max(0, depth);
}

function getPythonIndentDepth(line: string, lines: string[], index: number): number {
  let depth = 0;
  
  for (let i = 0; i < index; i++) {
    const prevLine = lines[i];
    if (prevLine.endsWith(':')) depth++;
    if (prevLine.match(/^(return|break|continue|pass)\s/)) {
      // These might indicate end of block, but it's complex to determine
    }
  }
  
  return Math.max(0, depth);
}