import React from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Volume2, VolumeX, Trash2, Download } from 'lucide-react';
import { motion } from 'motion/react';

export const ControlPanel: React.FC = () => {
  const { isListening, toggleListening, isConnected, isSpeaking, clearHistory } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={clearHistory}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
            title="Clear History"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          {isListening && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl"
            />
          )}
          <button
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isListening 
                ? 'bg-red-500 shadow-red-500/40' 
                : 'bg-emerald-500 shadow-emerald-500/40 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
              isListening ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {isListening ? (isConnected ? 'Listening...' : 'Connecting...') : 'Tap to Start'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
            {isSpeaking ? (
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
            <span className="text-xs font-medium text-white/60">
              {isSpeaking ? 'AI Speaking' : 'Silent'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
