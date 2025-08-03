# CodeConverter

A premium React application for converting code between programming languages using AI-powered precision.

## Features

- **Dual-Panel Interface**: Side-by-side code editors for source and target code
- **25+ Programming Languages**: Support for all major programming languages including Python, JavaScript, TypeScript, Java, C++, Go, Rust, and more
- **Smart Language Selection**: Searchable dropdown with autocomplete functionality
- **AI-Powered Conversion**: Integration with Claude AI for accurate code translation
- **Premium Design**: Apple and Stripe-inspired design system with smooth animations
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Real-time Error Handling**: Clear error messages and validation

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for premium styling
- **Monaco Editor** for code editing (VS Code editor)
- **Lucide React** for beautiful icons
- **Claude AI API** for code conversion

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd codeconverter
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Claude API:
```bash
cp .env.example .env
# Add your Claude API key to .env file
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. **Select Source Language**: Choose the programming language of your existing code
2. **Enter Code**: Paste or type your source code in the left editor
3. **Select Target Language**: Choose the language you want to convert to
4. **Convert**: Click "Convert Code" to transform your code
5. **Review**: The converted code will appear in the right editor

## API Configuration

The application currently uses a mock conversion service for demonstration. To use the real Claude AI API:

1. Get an API key from [Anthropic](https://console.anthropic.com/)
2. Add it to your `.env` file:
```
VITE_CLAUDE_API_KEY=your_api_key_here
```
3. Update the conversion service to use `ConversionService.convertCode()` instead of `mockConvertCode()`

## Supported Languages

- JavaScript / TypeScript
- Python
- Java / Kotlin / Scala
- C / C++ / C#
- Go / Rust
- Swift / Objective-C
- PHP / Ruby
- R / MATLAB
- Perl / Lua
- Dart / Elixir
- Haskell / Clojure
- Erlang / F#

## Build

```bash
npm run build
```