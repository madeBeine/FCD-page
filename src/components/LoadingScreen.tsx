import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../context/ConfigContext';

export const LoadingScreen: React.FC = () => {
  const [stage, setStage] = useState(0);
  const { config } = useConfig();
  const content = config.content[config.language].loadingScreen;

  useEffect(() => {
    // Stage 0: Parcel (0 - 0.6s)
    // Stage 1: Shipping (0.6s - 1.2s)
    // Stage 2: Logo (1.2s+)
    const timer1 = setTimeout(() => setStage(1), 600);
    const timer2 = setTimeout(() => setStage(2), 1200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-bg dark:bg-slate-900 transition-colors duration-500"
      style={{ perspective: 1000 }}
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

      <div className="relative flex flex-col items-center justify-center h-64">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="parcel"
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              className="absolute flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-2xl">
                <defs>
                  <linearGradient id="boxTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="boxLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="boxRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path d="M50 20 L85 35 L50 50 L15 35 Z" fill="url(#boxTop)" />
                <path d="M15 35 L50 50 L50 85 L15 70 Z" fill="url(#boxLeft)" />
                <path d="M85 35 L50 50 L50 85 L85 70 Z" fill="url(#boxRight)" />
                <path d="M32 27 L68 43" stroke="#d97706" strokeWidth="4" />
                <path d="M50 50 L50 85" stroke="#b45309" strokeWidth="2" />
                <path d="M15 35 L50 50" stroke="#fef3c7" strokeWidth="1" />
                <path d="M85 35 L50 50" stroke="#fef3c7" strokeWidth="1" />
              </svg>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: -100, y: 50, rotateZ: -20 }}
              animate={{ opacity: 1, x: 0, y: 0, rotateZ: 0 }}
              exit={{ opacity: 0, x: 100, y: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-2xl">
                <defs>
                  <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff9d3a" />
                    <stop offset="100%" stopColor="#ff5500" />
                  </linearGradient>
                </defs>
                <path d="M10 50 L90 10 L50 90 L40 60 Z" fill="url(#planeGrad)" />
                <path d="M90 10 L40 60 L30 80 L35 55 Z" fill="#cc4400" />
                <motion.path 
                  d="M5 40 L20 40 M10 60 L25 60 M15 50 L30 50" 
                  stroke="#1a3b8e" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="absolute flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ rotateY: [0, 10, -10, 0], rotateX: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
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

                <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-2xl relative z-10">
                  <defs>
                    <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4a7bf7" />
                      <stop offset="100%" stopColor="#1a3b8e" />
                    </linearGradient>
                    <linearGradient id="logoOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffb380" />
                      <stop offset="100%" stopColor="#ff5500" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <clipPath id="logoClip">
                      <path d="M 26 37 L 75 14.5 L 69 50 L 26 71 Z M 26 71 L 47.5 60 L 67.5 73.5 L 46 84.5 Z" />
                    </clipPath>
                  </defs>
                  
                  <path d="M 26 37 L 75 14.5 L 69 50 L 26 71 Z" fill="url(#logoBlue)" filter="url(#glow)" />
                  <path d="M 26 71 L 47.5 60 L 67.5 73.5 L 46 84.5 Z" fill="url(#logoOrange)" filter="url(#glow)" />
                  
                  {/* Light Sweep */}
                  <g clipPath="url(#logoClip)">
                    <motion.rect
                      x="-50"
                      y="0"
                      width="20"
                      height="100"
                      fill="rgba(255,255,255,0.6)"
                      transform="skewX(-45)"
                      initial={{ x: -100 }}
                      animate={{ x: 200 }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </g>
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Content */}
      <div className="h-24 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 font-cairo">
                {content?.title || 'فاست كوماند'}
              </h2>
              <p className="text-lg text-brand-orange font-medium">
                {content?.subtitle || 'طلبيتك بين يديك بسرعة وأمان'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
