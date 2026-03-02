import React from 'react';
import { motion } from 'motion/react';

interface AIFaceProps {
  isSpeaking: boolean;
}

export const AIFace: React.FC<AIFaceProps> = ({ isSpeaking }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={isSpeaking ? {
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        } : {
          scale: 1,
          opacity: 0.1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl"
      />

      {/* Face Container */}
      <motion.div
        animate={isSpeaking ? {
          y: [0, -8, 0],
          rotate: [0, 1, -1, 0],
          borderColor: "rgba(16, 185, 129, 0.6)",
        } : {
          y: 0,
          rotate: 0,
          borderColor: "rgba(16, 185, 129, 0.2)",
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24 bg-zinc-900/80 backdrop-blur-sm border-2 border-dashed rounded-full flex flex-col items-center justify-center gap-3 shadow-2xl"
      >
        {/* Eyes */}
        <div className="flex gap-6">
          <motion.div
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.9, 1, 1] }}
            className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"
          />
          <motion.div
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, times: [0, 0.8, 0.9, 1, 1] }}
            className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"
          />
        </div>

        {/* Mouth */}
        <motion.div
          animate={isSpeaking ? {
            scaleX: [1, 1.1, 1],
            height: [4, 10, 4],
            opacity: 1,
          } : {
            scaleX: 1,
            height: 2,
            opacity: 0.5,
          }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="w-8 bg-emerald-400 rounded-full"
        />
      </motion.div>
    </div>
  );
};
