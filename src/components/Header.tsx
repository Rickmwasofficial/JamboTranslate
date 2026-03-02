import React from 'react';
import { useApp } from '../context/AppContext';
import { Languages, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  const { mode, setMode, userLanguage, setUserLanguage } = useApp();

  return (
    <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Languages className="text-white w-5 h-5" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xl font-semibold tracking-tight text-white"
        >
          JamboTranslate
        </motion.h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setMode('translation')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === 'translation' ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg shadow-blue-500/20' : 'text-white/60 hover:text-white'
            }`}
          >
            Translate
          </button>
          <button
            onClick={() => setMode('conversation')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              mode === 'conversation' ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg shadow-blue-500/20' : 'text-white/60 hover:text-white'
            }`}
          >
            AI Chat
          </button>
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-2" />

        <select
          value={userLanguage}
          onChange={(e) => setUserLanguage(e.target.value as any)}
          className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer hover:text-emerald-400 transition-colors"
        >
          <option value="en" className="bg-zinc-900">English</option>
          <option value="sw" className="bg-zinc-900">Swahili</option>
        </select>

        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
