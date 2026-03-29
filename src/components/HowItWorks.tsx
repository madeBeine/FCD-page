import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { motion } from 'motion/react';

export const HowItWorks = () => {
  const { config } = useConfig();
  const content = config.content[config.language].howItWorks;
  const isRtl = config.language === 'ar';

  return (
    <section id="howItWorks" className="py-24 relative bg-brand-bg dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <AdminToolbar sectionId="howItWorks" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <EditableText 
            as="h2"
            section="howItWorks"
            contentKey="title"
            value={content.title}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          />
          <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="flex flex-col gap-20 lg:gap-32">
          {content.steps.map((step: any, index: number) => {
            if (step.isVisible === false && !config.isAdminMode) return null;
            const isEven = index % 2 === 0;
            
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16 relative group ${step.isVisible === false ? 'opacity-50 grayscale' : ''}`}>
                <ArrayItemToolbar section="howItWorks" arrayKey="steps" index={index} item={step} array={content.steps} />
                
                {/* Video Container */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? (isRtl ? 50 : -50) : (isRtl ? -50 : 50) }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 group">
                    <div className="absolute inset-0 bg-brand-blue/10 dark:bg-brand-blue/20 z-10 pointer-events-none" />
                    <video 
                      src={step.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Number Badge on Video */}
                    <div className={`absolute top-6 ${isRtl ? (isEven ? 'right-6' : 'left-6') : (isEven ? 'left-6' : 'right-6')} w-12 h-12 rounded-full bg-brand-orange text-white font-bold text-xl flex items-center justify-center shadow-lg z-20`}>
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
                
                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-start"
                >
                  <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <span className="text-brand-orange font-bold text-lg tracking-wider uppercase">
                      {config.language === 'ar' ? `الخطوة ${index + 1}` : `Step ${index + 1}`}
                    </span>
                    <div className="h-px w-12 bg-brand-orange/30" />
                  </div>
                  
                  <EditableText 
                    as="h3"
                    section="howItWorks"
                    contentKey={`steps[${index}].title`}
                    value={step.title}
                    className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                  />
                  
                  <EditableText 
                    as="p"
                    section="howItWorks"
                    contentKey={`steps[${index}].description`}
                    value={step.description}
                    className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed"
                  />
                </motion.div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
