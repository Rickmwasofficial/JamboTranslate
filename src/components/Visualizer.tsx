import React from 'react';
import { motion } from 'motion/react';

export const Visualizer: React.FC<{ isActive: boolean; color?: string }> = ({ isActive, color = 'emerald' }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            height: [8, Math.random() * 32 + 8, 8],
          } : {
            height: 4,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
          className={`w-1 rounded-full bg-${color}-500/60`}
        />
      ))}
    </div>
  );
};
