import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { ConversationArea } from './components/ConversationArea';
import { ControlPanel } from './components/ControlPanel';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-emerald-500/30">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <Header />
        <ConversationArea />
        <ControlPanel />
      </div>
    </AppProvider>
  );
}
