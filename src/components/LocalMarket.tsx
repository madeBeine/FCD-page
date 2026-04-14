import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText } from './AdminTools';
import { Store, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const LocalMarket = () => {
  const { config } = useConfig();
  const content = config.content[config.language].localMarket as any;
  const isRtl = config.language === 'ar';

  return (
    <section id="localMarket" className="py-24 relative bg-transparent overflow-hidden transition-colors duration-300">
      <AdminToolbar sectionId="localMarket" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-colors duration-300">
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-start">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-orange/10 text-brand-orange mb-8">
                <Store size={32} />
              </div>
              
              <EditableText 
                as="h2"
                section="localMarket"
                contentKey="title"
                value={content.title}
                className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6"
              />
              
              <EditableText 
                as="p"
                section="localMarket"
                contentKey="description"
                value={content.description}
                className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              />
              
              <a 
                href={`https://wa.me/${(config.content[config.language].footer.contactPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(isRtl ? 'مرحباً، أود الانضمام كبائع في السوق المحلي.' : 'Hello, I would like to join as a vendor in the local market.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_8px_30px_rgb(255,85,0,0.3)] hover:shadow-[0_8px_40px_rgb(255,85,0,0.5)] flex items-center justify-center gap-2 group mx-auto lg:mx-0 active:scale-95 w-fit"
              >
                <EditableText section="localMarket" contentKey="cta" value={content.cta} />
                <ArrowRight size={20} className={isRtl ? "rotate-180 transition-transform group-hover:-translate-x-1" : "transition-transform group-hover:translate-x-1"} />
              </a>
            </div>

            {/* Visual/Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full max-w-md mx-auto lg:max-w-none relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  {content.images.filter((_, i) => i % 2 === 0).map((img, idx) => (
                    <div key={`col1-${idx}`} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-full ${['h-32', 'h-48', 'h-40'][idx % 3]} bg-slate-200 dark:bg-slate-600 rounded-xl mb-3 overflow-hidden`}>
                        <img src={img} alt="منتجات السوق المحلي - تطبيق فاست كوماند" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-600 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-600 rounded" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {content.images.filter((_, i) => i % 2 !== 0).map((img, idx) => (
                    <div key={`col2-${idx}`} className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-full ${['h-40', 'h-24', 'h-48'][idx % 3]} bg-slate-200 dark:bg-slate-600 rounded-xl mb-3 overflow-hidden relative`}>
                        {idx === 0 && (
                          <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-brand-orange flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> 4.9
                          </div>
                        )}
                        <img src={img} alt="منتجات السوق المحلي - تطبيق فاست كوماند" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="h-4 w-full bg-slate-200 dark:bg-slate-600 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-600 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
