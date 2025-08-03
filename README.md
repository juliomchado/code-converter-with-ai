# 🚀 CodeConverter

An intelligent AI-powered code conversion tool that transforms code between 25+ programming languages instantly. Built with modern React, TypeScript, and designed with clean, professional aesthetics.

![CodeConverter](https://img.shields.io/badge/CodeConverter-AI%20Powered-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- 🔄 **AI-Powered Conversion** - Convert between 25+ programming languages instantly
- 🎨 **Modern Interface** - Clean, intuitive design with smooth animations
- ⚡ **Professional Code Editor** - Monaco Editor with IntelliSense and syntax highlighting
- 🆓 **Multiple AI Providers** - Google Gemini (free), OpenRouter, DeepSeek, Claude, OpenAI
- 🔒 **Secure API Management** - Multiple storage options with clear security guidelines
- 📱 **Cross-Platform** - Responsive design that works everywhere
- 🌙 **Customizable Themes** - Dark and light modes for comfortable coding

## 🎯 Supported Languages

JavaScript, Python, TypeScript, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Dart, Scala, R, MATLAB, SQL, HTML, CSS, JSON, XML, YAML, Bash, PowerShell, and more!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codeconverter.git
   cd codeconverter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

5. **Add your API key in the app**
   - Click "API Configuration" → "Configure"
   - Select "Google Gemini (FREE)" 
   - Enter your API key (get one at [Google AI Studio](https://aistudio.google.com))
   - Click "Save API Keys"

## 🔑 Getting API Keys

### 🆓 Google Gemini (Recommended - FREE)
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Generate a new API key
4. **Free tier**: 15 requests/minute, 1M tokens/minute - perfect for learning and development

### 💼 Professional Providers
- **OpenRouter**: [openrouter.ai](https://openrouter.ai) - Gateway to multiple AI models
- **DeepSeek**: [platform.deepseek.com](https://platform.deepseek.com) - Specialized in code understanding
- **Claude**: [console.anthropic.com](https://console.anthropic.com) - Advanced reasoning capabilities
- **OpenAI**: [platform.openai.com](https://platform.openai.com) - Industry-standard GPT models

## 🔒 Security & Privacy

### 🛡️ Client-Side Only Architecture
This application is designed with privacy and security in mind:
- ✅ **No server-side storage** - Your API keys never touch our servers
- ✅ **Local browser storage only** - Keys stored in your browser localStorage
- ✅ **Direct API calls** - Your code goes directly to AI providers (Google, OpenAI, etc.)
- ✅ **No data collection** - We don't see, store, or analyze your code or keys
- ✅ **Open source** - Full transparency, audit the code yourself

### 🔑 How API Keys Work
1. **User enters API key** in the browser interface
2. **Stored locally** in browser localStorage only
3. **Used directly** for API calls to AI providers
4. **Never sent to our servers** - completely client-side

### 🌐 Zero-Config Deployment
- **No environment variables needed** 
- **No server setup required**
- **Just deploy and go** - users add their own keys
- **Works on any static hosting** (Vercel, Netlify, GitHub Pages, etc.)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### 🚀 Deploy to Vercel (Zero Config!)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/codeconverter)

**Super Simple Deployment:**
1. Click the deploy button above OR
2. Push to GitHub → Import in [Vercel Dashboard](https://vercel.com/dashboard)
3. **That's it!** No environment variables needed
4. Users will add their own API keys in the browser

**Why it's so easy:**
- No server-side configuration needed
- No environment variables required  
- No API key setup for you as the developer
- Users manage their own keys securely in browser

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite (Modern development stack)
- **Styling**: CSS Custom Properties, Tailwind CSS (Utility-first styling)
- **Code Editor**: Monaco Editor (Same engine that powers VS Code)
- **Icons**: Lucide React (Consistent iconography)
- **AI APIs**: Multiple provider support for flexibility and reliability

### Project Structure

```
codeconverter/
├── src/
│   ├── components/          # React components
│   │   ├── CodeEditor.tsx   # Monaco editor wrapper
│   │   ├── LanguageSelect.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ApiKeyInput.tsx
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx
│   ├── services/           # API services
│   │   └── conversionService.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.tsx           # App entry point
├── public/                # Static assets
├── .env.example          # Environment variables template
└── README.md            # This file
```

## 🎨 User Experience

### Interface Design
- **Clean, modern interface** with intuitive navigation
- **Responsive layout** that works on all screen sizes
- **Smooth animations** and transitions for better user experience
- **Accessibility focused** with proper contrast and keyboard navigation
- **Professional color scheme** suitable for extended use

### Code Editor Capabilities
- **Industry-standard editor** with Monaco (VS Code engine)
- **Full syntax highlighting** for 25+ programming languages
- **IntelliSense and auto-completion** for faster coding
- **Advanced features**: bracket matching, code folding, multi-cursor
- **Customizable themes** for different working environments

### AI Integration
- **Smart provider selection** - automatically tries free options first
- **Comprehensive error handling** with clear, actionable messages
- **Rate limiting awareness** to prevent API quota issues
- **Fallback system** ensures conversion attempts with multiple providers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contributing Guidelines

- Follow TypeScript best practices
- Maintain the existing code style
- Add proper error handling
- Test with multiple AI providers
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - VS Code editor engine
- **Google Gemini** - Free AI API
- **React Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS
- **Lucide** - Beautiful icons

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/yourusername/codeconverter/issues) to report bugs or request features.

## 🌟 Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**
