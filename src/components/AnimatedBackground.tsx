import React from 'react';
import { motion } from 'motion/react';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-brand-bg dark:bg-slate-900 transition-colors duration-300">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a3b8e08_1px,transparent_1px),linear-gradient(to_bottom,#1a3b8e08_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Animated Orbs - Brand Blue & Brand Orange Mix */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[-10%] w-[120vw] h-[120vw] md:w-[50vw] md:h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-brand-blue/30 dark:bg-brand-blue/20 blur-[80px] md:blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-5%] right-[-10%] w-[140vw] h-[140vw] md:w-[60vw] md:h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-brand-orange/20 dark:bg-brand-orange/15 blur-[90px] md:blur-[140px]"
      />
      <motion.div
        animate={{
          x: [0, 80, -100, 0],
          y: [0, 80, 100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[10%] w-[100vw] h-[100vw] md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-brand-blue/20 dark:bg-brand-blue/15 blur-[70px] md:blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -80, 100, 0],
          y: [0, -80, -100, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[15%] left-[10%] w-[90vw] h-[90vw] md:w-[35vw] md:h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-brand-orange/15 dark:bg-brand-orange/10 blur-[60px] md:blur-[90px]"
      />
      
      {/* Center subtle mix */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[30vw] md:h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 blur-[80px] md:blur-[100px]"
      />
    </div>
  );
};
