import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const FAQ = () => {
  const { config } = useConfig();
  const content = config.content[config.language].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <AdminToolbar sectionId="faq" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/10 text-brand-orange mb-6">
            <MessageCircleQuestion size={32} />
          </div>
          <EditableText 
            as="h2"
            section="faq"
            contentKey="title"
            value={content.title}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
          />
          <div className="w-24 h-1 bg-brand-blue mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {content.items.map((item: any, index: number) => {
            if (item.isVisible === false && !config.isAdminMode) return null;
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden relative group",
                  isOpen ? "border-brand-blue shadow-md" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm",
                  item.isVisible === false ? "opacity-50 grayscale" : ""
                )}
              >
                <ArrayItemToolbar section="faq" arrayKey="items" index={index} item={item} array={content.items} />
                <button 
                  className="w-full flex items-center justify-between p-6 text-start focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <EditableText 
                    as="h3"
                    section="faq"
                    contentKey={`items[${index}].question`}
                    value={item.question}
                    className={cn(
                      "text-lg font-bold transition-colors",
                      isOpen ? "text-brand-blue" : "text-slate-800 dark:text-slate-200"
                    )}
                  />
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0",
                    isOpen ? "bg-brand-blue/10 text-brand-blue rotate-180" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  )}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 mt-2 pt-4">
                        <EditableText 
                          as="p"
                          section="faq"
                          contentKey={`items[${index}].answer`}
                          value={item.answer}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
