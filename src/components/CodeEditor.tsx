import React from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import type { Language } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language | null;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = "Enter your code here...",
  readOnly = false,
  height = "400px"
}) => {
  const { theme } = useTheme();
  
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  return (
    <div className="editor-container">
      <Editor
        height={height}
        language={language?.monacoId || 'plaintext'}
        value={value}
        onChange={handleEditorChange}
        theme={editorTheme}
        options={{
          // Core editor features
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          lineNumbers: 'on',
          renderLineHighlight: 'gutter',
          selectOnLineNumbers: true,
          automaticLayout: true,
          
          // Code formatting
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          formatOnPaste: !readOnly,
          formatOnType: !readOnly,
          
          // IDE-like features
          bracketPairColorization: { enabled: true },
          autoIndent: 'full',
          autoClosingBrackets: readOnly ? 'never' : 'always',
          autoClosingQuotes: readOnly ? 'never' : 'always',
          autoSurround: readOnly ? 'never' : 'languageDefined',
          matchBrackets: 'always',
          
          // Suggestions and intellisense
          suggestOnTriggerCharacters: !readOnly,
          quickSuggestions: !readOnly,
          parameterHints: { enabled: !readOnly },
          hover: { enabled: true },
          
          // Visual enhancements
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          renderWhitespace: 'boundary',
          renderControlCharacters: false,
          
          // Interaction
          contextmenu: true,
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          
          // Layout
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },
          
          // Disable placeholder in Monaco (we'll handle it ourselves)
          readOnly,
        }}
        beforeMount={(monaco) => {
          // Configure theme colors for better dark mode
          monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
              'editor.background': '#0a0a0a',
              'editor.foreground': '#ffffff',
              'editorLineNumber.foreground': '#636366',
              'editorLineNumber.activeForeground': '#a1a1a6',
              'editor.selectionBackground': '#0a84ff40',
              'editor.inactiveSelectionBackground': '#0a84ff20',
            }
          });
        }}
        onMount={(editor, monaco) => {
          // Set custom theme for dark mode
          if (theme === 'dark') {
            monaco.editor.setTheme('custom-dark');
          }
          
          // Add custom placeholder functionality
          let placeholderWidget: any = null;
          
          const showPlaceholder = () => {
            if (!editor.getValue() && !readOnly && !placeholderWidget) {
              placeholderWidget = {
                getId: () => 'placeholder-widget',
                getDomNode: () => {
                  const node = document.createElement('div');
                  node.style.cssText = `
                    position: absolute;
                    top: 18px;
                    left: 70px;
                    color: var(--text-tertiary);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 14px;
                    opacity: 0.6;
                    pointer-events: none;
                    z-index: 1;
                    user-select: none;
                  `;
                  node.textContent = placeholder;
                  return node;
                },
                getPosition: () => null
              };
              editor.addOverlayWidget(placeholderWidget);
            }
          };
          
          const hidePlaceholder = () => {
            if (placeholderWidget) {
              editor.removeOverlayWidget(placeholderWidget);
              placeholderWidget = null;
            }
          };
          
          // Show placeholder initially if empty
          showPlaceholder();
          
          // Handle placeholder visibility on content changes
          editor.onDidChangeModelContent(() => {
            if (editor.getValue()) {
              hidePlaceholder();
            } else {
              showPlaceholder();
            }
          });
          
          // Handle focus events to ensure placeholder behaves correctly
          editor.onDidFocusEditorWidget(() => {
            if (!editor.getValue()) {
              showPlaceholder();
            }
          });
          
          editor.onDidBlurEditorWidget(() => {
            if (!editor.getValue()) {
              showPlaceholder();
            }
          });
        }}
      />
    </div>
  );
};