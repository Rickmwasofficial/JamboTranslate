import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AppState, AppMode, Language, Message } from '../types';
import { AudioProcessor, AudioPlayer } from '../services/audioService';
import { GeminiLiveService } from '../services/geminiLiveService';

interface AppContextType extends AppState {
  setMode: (mode: AppMode) => void;
  setUserLanguage: (lang: Language) => void;
  toggleListening: () => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    mode: 'conversation',
    userLanguage: 'en',
    targetLanguage: 'sw',
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isConnected: false,
    messages: [],
  });

  const audioProcessor = useRef<AudioProcessor | null>(null);
  const audioPlayer = useRef<AudioPlayer | null>(null);
  const geminiService = useRef<GeminiLiveService | null>(null);

  const handleAudioData = useCallback((base64: string) => {
    geminiService.current?.sendAudio(base64);
  }, []);

  const handleModelAudio = useCallback((base64: string) => {
    setState(prev => ({ ...prev, isSpeaking: true }));
    audioPlayer.current?.playChunk(base64);
  }, []);

  const handleModelMessage = useCallback((text: string, role: 'user' | 'model', isInterrupted: boolean) => {
    if (isInterrupted) {
      audioPlayer.current?.stop();
      setState(prev => ({ ...prev, isSpeaking: false }));
      return;
    }

    if (text) {
      setState(prev => {
        const lastMsg = prev.messages[prev.messages.length - 1];
        
        // Only merge if it's the same role and very recent (within 2 seconds)
        // and the last message isn't too long already
        if (lastMsg && lastMsg.role === role && 
            Date.now() - lastMsg.timestamp < 2000 && 
            lastMsg.text.length < 200) {
           const updatedMessages = [...prev.messages];
           updatedMessages[updatedMessages.length - 1] = {
             ...lastMsg,
             text: lastMsg.text + (lastMsg.text.endsWith(' ') ? '' : ' ') + text
           };
           return { ...prev, messages: updatedMessages };
        }

        const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          role,
          text,
          timestamp: Date.now(),
        };
        return { ...prev, messages: [...prev.messages, newMessage] };
      });
    }
  }, []);

  const handleStatus = useCallback((status: 'connected' | 'disconnected' | 'error') => {
    setState(prev => ({ ...prev, isConnected: status === 'connected' }));
  }, []);

  useEffect(() => {
    audioPlayer.current = new AudioPlayer();
    geminiService.current = new GeminiLiveService(
      handleModelMessage,
      handleModelAudio,
      handleStatus
    );

    return () => {
      geminiService.current?.disconnect();
      audioProcessor.current?.stop();
    };
  }, [handleModelAudio, handleModelMessage, handleStatus]);

  const setMode = (mode: AppMode) => {
    setState(prev => ({ ...prev, mode }));
    if (state.isConnected) {
      geminiService.current?.disconnect();
      geminiService.current?.connect(mode, state.userLanguage);
    }
  };

  const setUserLanguage = (userLanguage: Language) => {
    const targetLanguage = userLanguage === 'en' ? 'sw' : 'en';
    setState(prev => ({ ...prev, userLanguage, targetLanguage }));
  };

  const toggleListening = async () => {
    if (state.isListening) {
      audioProcessor.current?.stop();
      geminiService.current?.disconnect();
      setState(prev => ({ ...prev, isListening: false, isConnected: false }));
    } else {
      setState(prev => ({ ...prev, isListening: true }));
      
      if (!audioProcessor.current) {
        audioProcessor.current = new AudioProcessor(handleAudioData);
      }
      
      await audioProcessor.current.start();
      await geminiService.current?.connect(state.mode, state.userLanguage);
    }
  };

  const clearHistory = () => {
    setState(prev => ({ ...prev, messages: [] }));
  };

  return (
    <AppContext.Provider value={{ ...state, setMode, setUserLanguage, toggleListening, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
