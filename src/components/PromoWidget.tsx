import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Copy, CheckCircle2 } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { EditableText, ArrayItemToolbar } from './AdminTools';

export const PromoWidget = () => {
  const { config } = useConfig();
  const content = (config.content[config.language] as any).promos;
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!content || (!content.isVisible && !config.isAdminMode)) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      {/* Floating Gift Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 left-4 md:bottom-8 md:left-8 z-40 w-14 h-14 bg-gradient-to-r from-brand-orange to-amber-500 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer ${!content.isVisible ? 'opacity-50 grayscale' : ''}`}
      >
        <Gift size={24} className="animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      </motion.button>

      {/* Promo Modal / Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md bg-white dark:bg-slate-900 rounded-t-[2rem] md:rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Mobile Drag Handle */}
              <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <Gift size={20} />
                  </div>
                  <EditableText 
                    as="h3"
                    section="promos"
                    contentKey="title"
                    value={content.title}
                    className="font-bold text-lg text-slate-900 dark:text-white"
                  />
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  {content.items.map((promo: any, index: number) => (
                    <div key={promo.id || index} className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-4 group">
                      {config.isAdminMode && (
                        <ArrayItemToolbar section="promos" arrayKey="items" index={index} item={promo} array={content.items} />
                      )}
                      
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        <EditableText 
                          as="span"
                          section="promos"
                          contentKey={`items[${index}].discount`}
                          value={promo.discount}
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <EditableText 
                          as="p"
                          section="promos"
                          contentKey={`items[${index}].description`}
                          value={promo.description}
                          className="text-sm text-slate-600 dark:text-slate-300 mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-600 rounded text-brand-orange font-mono font-bold text-sm tracking-wider">
                            <EditableText 
                              as="span"
                              section="promos"
                              contentKey={`items[${index}].code`}
                              value={promo.code}
                            />
                          </div>
                          <button 
                            onClick={() => handleCopy(promo.code)}
                            className="p-1.5 text-slate-400 hover:text-brand-blue transition-colors"
                            title="نسخ الكود"
                          >
                            {copiedCode === promo.code ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
