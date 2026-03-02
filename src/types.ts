export type Language = 'sw' | 'en';
export type AppMode = 'translation' | 'conversation';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  translation?: string;
  timestamp: number;
  audioData?: string; // base64
}

export interface AppState {
  mode: AppMode;
  userLanguage: Language;
  targetLanguage: Language;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isConnected: boolean;
  messages: Message[];
}
