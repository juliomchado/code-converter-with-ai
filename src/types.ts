export interface Language {
  id: string;
  name: string;
  extension: string;
  monacoId: string;
}

export interface ConversionRequest {
  sourceCode: string;
  fromLanguage: string;
  toLanguage: string;
}

export interface ConversionResponse {
  convertedCode: string;
  error?: string;
}