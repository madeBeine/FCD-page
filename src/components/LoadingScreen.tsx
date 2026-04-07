import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const phrases = [
  "أهلاً بك في فاست كوماند...",
  "نجهز لك تجربة استثنائية...",
  "لحظات ونبدأ الإبداع...",
  "شكراً لانتظارك..."
];

export const LoadingScreen: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-bg/80 dark:bg-slate-900/80 backdrop-blur-2xl transition-colors duration-500"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%"
            }}
            animate={{ 
              opacity: [0, 0.2, 0],
              y: ["-10%", "110%"],
              x: (Math.random() * 20 - 10) + "%"
            }}
            transition={{ 
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-2 h-2 bg-brand-orange rounded-full blur-sm"
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ 
            scale: 1,
            opacity: 1,
            rotate: 0
          }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 1
          }}
          className="relative mb-10"
        >
          {/* Outer Glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 bg-brand-blue/20 rounded-full blur-2xl"
          />

          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-28 h-28 border-[3px] border-brand-orange/10 border-t-brand-orange border-r-brand-orange rounded-full"
          />
          
          {/* Logo SVG */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              filter: [
                "drop-shadow(0 0 10px rgba(26, 59, 142, 0.2))",
                "drop-shadow(0 0 20px rgba(26, 59, 142, 0.4))",
                "drop-shadow(0 0 10px rgba(26, 59, 142, 0.2))"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M 26 37 L 75 14.5 L 69 50 L 26 71 Z" fill="#1a3b8e" className="dark:fill-white" />
              <path d="M 26 71 L 47.5 60 L 67.5 73.5 L 46 84.5 Z" fill="#ff9d3a" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <div className="text-center space-y-3">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-extrabold font-cairo text-brand-blue dark:text-white tracking-tight"
          >
            فاست كوماند
          </motion.h1>
          
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-[1px] w-8 bg-brand-orange/30" />
            <p className="text-brand-orange font-bold tracking-[0.3em] uppercase text-[10px]">
              Fast Comand
            </p>
            <div className="h-[1px] w-8 bg-brand-orange/30" />
          </motion.div>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-12 w-56 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: "0%", backgroundPosition: "0% 0%" }}
            animate={{ 
              width: "100%",
              backgroundPosition: ["0% 0%", "100% 0%"]
            }}
            transition={{ 
              width: { duration: 2, ease: "easeInOut" },
              backgroundPosition: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }}
            className="h-full bg-gradient-to-r from-brand-blue via-brand-orange to-brand-blue bg-[length:200%_100%]"
          />
        </div>
        
        <div className="mt-4 h-6 relative overflow-hidden flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute text-brand-blue dark:text-brand-orange text-sm font-bold tracking-wider"
            >
              {phrases[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
