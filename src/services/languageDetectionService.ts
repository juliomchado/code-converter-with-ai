interface LanguagePattern {
  id: string;
  name: string;
  patterns: RegExp[];
  keywords: string[];
  extensions: string[];
  confidence: number;
}

export class LanguageDetectionService {
  private static readonly languages: LanguagePattern[] = [
    {
      id: "javascript",
      name: "JavaScript",
      patterns: [
        /\bfunction\s+\w+\s*\(/,
        /\bconst\s+\w+\s*=/,
        /\blet\s+\w+\s*=/,
        /\bvar\s+\w+\s*=/,
        /=>\s*{/,
        /console\.log\(/,
        /require\(['"`]/,
        /import.*from\s+['"`]/,
        /export\s+(default\s+)?/,
      ],
      keywords: [
        "const",
        "let",
        "var",
        "function",
        "return",
        "if",
        "else",
        "for",
        "while",
        "class",
        "extends",
        "import",
        "export",
        "async",
        "await",
      ],
      extensions: ["js", "mjs"],
      confidence: 0,
    },
    {
      id: "typescript",
      name: "TypeScript",
      patterns: [
        /:\s*(string|number|boolean|any|void|object)\b/,
        /interface\s+\w+/,
        /type\s+\w+\s*=/,
        /\w+\s*:\s*\w+\s*[=;]/,
        /\bexport\s+interface/,
        /\bexport\s+type/,
        /\bimport\s+type/,
        /<.*>\s*\(/,
        /as\s+\w+/,
      ],
      keywords: [
        "interface",
        "type",
        "enum",
        "namespace",
        "declare",
        "readonly",
        "private",
        "public",
        "protected",
      ],
      extensions: ["ts", "tsx"],
      confidence: 0,
    },
    {
      id: "python",
      name: "Python",
      patterns: [
        /^def\s+\w+\s*\(/m,
        /^class\s+\w+/m,
        /^import\s+\w+/m,
        /^from\s+\w+\s+import/m,
        /if\s+__name__\s*==\s*['"]__main__['"]/,
        /print\s*\(/,
        /:\s*$/m,
        /\bself\b/,
        /^\s*#/m,
      ],
      keywords: [
        "def",
        "class",
        "import",
        "from",
        "if",
        "elif",
        "else",
        "for",
        "while",
        "try",
        "except",
        "finally",
        "with",
        "as",
        "lambda",
        "yield",
      ],
      extensions: ["py", "pyw"],
      confidence: 0,
    },
    {
      id: "java",
      name: "Java",
      patterns: [
        /public\s+class\s+\w+/,
        /public\s+static\s+void\s+main/,
        /\bSystem\.out\.print/,
        /\bpublic\s+(static\s+)?[\w<>]+\s+\w+\s*\(/,
        /\bprivate\s+(static\s+)?[\w<>]+\s+\w+/,
        /\bprotected\s+(static\s+)?[\w<>]+\s+\w+/,
        /\bpackage\s+[\w.]+/,
        /\bimport\s+[\w.]+/,
        /@\w+/,
      ],
      keywords: [
        "public",
        "private",
        "protected",
        "class",
        "interface",
        "extends",
        "implements",
        "package",
        "import",
        "static",
        "final",
        "abstract",
      ],
      extensions: ["java"],
      confidence: 0,
    },
    {
      id: "cpp",
      name: "C++",
      patterns: [
        /#include\s*<.*>/,
        /using\s+namespace\s+std/,
        /std::/,
        /cout\s*<<|cin\s*>>/,
        /\bclass\s+\w+\s*{/,
        /\bpublic\s*:|private\s*:|protected\s*:/,
        /\bvirtual\s+/,
        /\btemplate\s*</,
        /::/,
      ],
      keywords: [
        "class",
        "public",
        "private",
        "protected",
        "virtual",
        "template",
        "namespace",
        "using",
        "const",
        "static",
        "inline",
      ],
      extensions: ["cpp", "cxx", "cc", "c++"],
      confidence: 0,
    },
    {
      id: "c",
      name: "C",
      patterns: [
        /#include\s*<.*\.h>/,
        /\bmain\s*\(\s*(void\s*)?\)\s*{/,
        /printf\s*\(/,
        /scanf\s*\(/,
        /\bmalloc\s*\(/,
        /\bfree\s*\(/,
        /struct\s+\w+\s*{/,
        /typedef\s+(struct\s+)?\w+/,
      ],
      keywords: [
        "struct",
        "typedef",
        "static",
        "extern",
        "const",
        "volatile",
        "register",
        "auto",
        "sizeof",
      ],
      extensions: ["c", "h"],
      confidence: 0,
    },
    {
      id: "csharp",
      name: "C#",
      patterns: [
        /using\s+System/,
        /namespace\s+\w+/,
        /public\s+class\s+\w+/,
        /Console\.WriteLine/,
        /\[.*\]/,
        /\bpublic\s+(static\s+)?[\w<>]+\s+\w+\s*\(/,
        /\bvar\s+\w+\s*=/,
        /\bstring\s+\w+/,
      ],
      keywords: [
        "namespace",
        "using",
        "class",
        "interface",
        "struct",
        "enum",
        "delegate",
        "event",
        "var",
        "dynamic",
      ],
      extensions: ["cs"],
      confidence: 0,
    },
    {
      id: "php",
      name: "PHP",
      patterns: [
        /<\?php/,
        /\$\w+/,
        /echo\s+/,
        /print\s+/,
        /function\s+\w+\s*\(/,
        /class\s+\w+/,
        /\barray\s*\(/,
        /->/,
        /::/,
      ],
      keywords: [
        "echo",
        "print",
        "var",
        "function",
        "class",
        "extends",
        "implements",
        "public",
        "private",
        "protected",
        "static",
      ],
      extensions: ["php"],
      confidence: 0,
    },
    {
      id: "go",
      name: "Go",
      patterns: [
        /package\s+main/,
        /import\s+"fmt"/,
        /func\s+main\s*\(\s*\)/,
        /func\s+\w+\s*\(/,
        /fmt\.Print/,
        /:=/,
        /\bgo\s+\w+\s*\(/,
        /chan\s+\w+/,
      ],
      keywords: [
        "package",
        "import",
        "func",
        "var",
        "const",
        "type",
        "struct",
        "interface",
        "map",
        "chan",
        "go",
        "defer",
      ],
      extensions: ["go"],
      confidence: 0,
    },
    {
      id: "rust",
      name: "Rust",
      patterns: [
        /fn\s+main\s*\(\s*\)/,
        /fn\s+\w+\s*\(/,
        /let\s+(mut\s+)?\w+/,
        /println!\s*\(/,
        /use\s+std::/,
        /struct\s+\w+\s*{/,
        /impl\s+\w+/,
        /match\s+\w+\s*{/,
        /&\w+/,
      ],
      keywords: [
        "fn",
        "let",
        "mut",
        "const",
        "static",
        "struct",
        "enum",
        "impl",
        "trait",
        "match",
        "if",
        "else",
        "loop",
        "while",
        "for",
      ],
      extensions: ["rs"],
      confidence: 0,
    },
    {
      id: "ruby",
      name: "Ruby",
      patterns: [
        /def\s+\w+/,
        /class\s+\w+/,
        /puts\s+/,
        /print\s+/,
        /\bend\b/,
        /\brequire\s+['"`]/,
        /@\w+/,
        /\|\w+\|/,
        /=>/,
      ],
      keywords: [
        "def",
        "class",
        "module",
        "end",
        "if",
        "elsif",
        "else",
        "unless",
        "while",
        "until",
        "for",
        "do",
        "begin",
        "rescue",
        "ensure",
      ],
      extensions: ["rb"],
      confidence: 0,
    },
    {
      id: "swift",
      name: "Swift",
      patterns: [
        /import\s+Foundation/,
        /import\s+UIKit/,
        /func\s+\w+\s*\(/,
        /var\s+\w+:/,
        /let\s+\w+\s*=/,
        /class\s+\w+:/,
        /struct\s+\w+\s*{/,
        /print\s*\(/,
        /\?\s*\w+/,
      ],
      keywords: [
        "import",
        "class",
        "struct",
        "enum",
        "func",
        "var",
        "let",
        "if",
        "else",
        "for",
        "while",
        "switch",
        "case",
        "default",
      ],
      extensions: ["swift"],
      confidence: 0,
    },
    {
      id: "kotlin",
      name: "Kotlin",
      patterns: [
        /fun\s+main\s*\(/,
        /fun\s+\w+\s*\(/,
        /val\s+\w+/,
        /var\s+\w+/,
        /class\s+\w+/,
        /println\s*\(/,
        /package\s+[\w.]+/,
        /import\s+[\w.]+/,
        /\?\s*\w+/,
      ],
      keywords: [
        "fun",
        "val",
        "var",
        "class",
        "object",
        "interface",
        "package",
        "import",
        "if",
        "else",
        "when",
        "for",
        "while",
      ],
      extensions: ["kt", "kts"],
      confidence: 0,
    },
    {
      id: "json",
      name: "JSON",
      patterns: [
        /^\s*{[\s\S]*}\s*$/,
        /^\s*\[[\s\S]*\]\s*$/,
        /"[\w\s-]+"\s*:\s*[\{\[\"]|[\d\.\-]|true|false|null/,
        /"\w+":\s*"/,
      ],
      keywords: ["true", "false", "null"],
      extensions: ["json"],
      confidence: 0,
    },
    {
      id: "html",
      name: "HTML",
      patterns: [
        /<html.*>/i,
        /<head.*>/i,
        /<body.*>/i,
        /<div.*>/i,
        /<script.*>/i,
        /<style.*>/i,
        /<!DOCTYPE\s+html>/i,
        /<\/\w+>/,
        /<\w+[^>]*\/>/,
      ],
      keywords: [
        "html",
        "head",
        "body",
        "div",
        "span",
        "script",
        "style",
        "title",
        "meta",
        "link",
      ],
      extensions: ["html", "htm"],
      confidence: 0,
    },
    {
      id: "css",
      name: "CSS",
      patterns: [
        /\.[a-zA-Z][\w-]*\s*{/,
        /#[a-zA-Z][\w-]*\s*{/,
        /[a-zA-Z][\w-]*\s*:\s*[^;]+;/,
        /@media\s+/,
        /@import\s+/,
        /\w+\s*:\s*\w+\s*(!important)?;/,
      ],
      keywords: [
        "color",
        "background",
        "font",
        "margin",
        "padding",
        "border",
        "width",
        "height",
        "display",
        "position",
      ],
      extensions: ["css"],
      confidence: 0,
    },
    {
      id: "sql",
      name: "SQL",
      patterns: [
        /\bSELECT\s+.*\bFROM\b/i,
        /\bINSERT\s+INTO\b/i,
        /\bUPDATE\s+.*\bSET\b/i,
        /\bDELETE\s+FROM\b/i,
        /\bCREATE\s+TABLE\b/i,
        /\bALTER\s+TABLE\b/i,
        /\bWHERE\s+/i,
        /\bJOIN\s+/i,
      ],
      keywords: [
        "SELECT",
        "FROM",
        "WHERE",
        "INSERT",
        "UPDATE",
        "DELETE",
        "CREATE",
        "ALTER",
        "DROP",
        "TABLE",
        "INDEX",
        "JOIN",
      ],
      extensions: ["sql"],
      confidence: 0,
    },
  ];

  static detectLanguage(code: string): {
    language: string;
    confidence: number;
    suggestions: Array<{ name: string; confidence: number }>;
  } {
    if (!code || code.trim().length < 10) {
      return { language: "unknown", confidence: 0, suggestions: [] };
    }

    const results: Array<{ name: string; confidence: number }> = [];

    // Test each language
    for (const lang of this.languages) {
      let score = 0;
      let matches = 0;

      // Test regex patterns
      for (const pattern of lang.patterns) {
        if (pattern.test(code)) {
          score += 10;
          matches++;
        }
      }

      // Test keywords
      const words = code.toLowerCase().split(/\W+/);
      for (const keyword of lang.keywords) {
        if (words.includes(keyword.toLowerCase())) {
          score += 5;
          matches++;
        }
      }

      // Bonus for multiple matches
      if (matches > 1) {
        score += matches * 2;
      }

      // Calculate confidence as percentage
      const confidence = Math.min(100, score);

      if (confidence > 0) {
        results.push({ name: lang.name, confidence });
      }
    }

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);

    // Return best match or unknown
    const bestMatch = results[0];
    const language =
      bestMatch && bestMatch.confidence > 20 ? bestMatch.name : "unknown";
    const confidence = bestMatch ? bestMatch.confidence : 0;

    return {
      language,
      confidence,
      suggestions: results.slice(0, 3), // Top 3 suggestions
    };
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}
