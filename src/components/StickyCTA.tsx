import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StickyCTA = () => {
  const { config, openDownloadModal } = useConfig();
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);
  const content = config.content[config.language].navbar as any;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show after scrolling past the hero section (approx 500px)
      // AND only if scrolling UP (currentScrollY < lastScrollY.current)
      if (currentScrollY > 500) {
        if (currentScrollY < lastScrollY.current) {
          setIsVisible(true); // Scrolling UP -> Show
        } else {
          setIsVisible(false); // Scrolling DOWN -> Hide
        }
      } else {
        setIsVisible(false); // Top of page -> Hide
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 md:hidden pointer-events-none"
        >
          <button
            onClick={openDownloadModal}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white shadow-[0_8px_30px_rgb(255,85,0,0.3)] px-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 pointer-events-auto transition-transform active:scale-95"
          >
            <Download size={20} className="animate-bounce" />
            {content.downloadCta}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
