import React from 'react';
import { useApp } from '../context/AppContext';
import { Visualizer } from './Visualizer';
import { AIFace } from './AIFace';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bot, Clock } from 'lucide-react';

export const ConversationArea: React.FC = () => {
  const { messages, isListening, isSpeaking, mode, userLanguage, targetLanguage } = useApp();

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-6 pb-32 overflow-y-auto custom-scrollbar flex flex-col">
      {/* AI Face Section */}
      <div className="flex justify-center mb-8">
        <AIFace isSpeaking={isSpeaking} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* User Side */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white/40">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">You ({userLanguage.toUpperCase()})</span>
            </div>
            {isListening && <Visualizer isActive={true} color="emerald" />}
          </div>

          <AnimatePresence mode="popLayout">
            {messages.filter(m => m.role === 'user').map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 p-4 rounded-2xl relative group"
              >
                <p className="text-white text-lg leading-relaxed">{msg.text}</p>
                <div className="flex items-center gap-2 mt-2 text-white/30">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.filter(m => m.role === 'user').length === 0 && !isListening && (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl p-12 text-center">
              <User className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm">Start speaking to see transcription</p>
            </div>
          )}
        </div>

        {/* AI / Translation Side */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white/40">
              <Bot className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {mode === 'translation' ? `Translation (${targetLanguage.toUpperCase()})` : 'Gemini AI'}
              </span>
            </div>
            {isSpeaking && <Visualizer isActive={true} color="blue" />}
          </div>

          <AnimatePresence mode="popLayout">
            {messages.filter(m => m.role === 'model').map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl relative"
              >
                <p className="text-emerald-50 text-lg leading-relaxed">{msg.text}</p>
                <div className="flex items-center gap-2 mt-2 text-emerald-500/40">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.filter(m => m.role === 'model').length === 0 && !isSpeaking && (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl p-12 text-center">
              <Bot className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm">
                {mode === 'translation' ? 'Translations will appear here' : 'AI responses will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
