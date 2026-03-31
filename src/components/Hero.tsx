import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { Download, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { handleDownload } from '../lib/utils';
import { MauritaniaMap } from './MauritaniaMap';

export const Hero = () => {
  const { config, isAdminMode } = useConfig();
  const content = config.content[config.language].hero;
  const isRtl = config.language === 'ar';

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
      <AdminToolbar sectionId="hero" />
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-brand-blue/10 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Top Section: Text & Mockups */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-start flex flex-col items-center lg:items-start w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 text-brand-blue text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
              Fast Comand App
            </div>
            
            <EditableText 
              as="h1"
              section="hero"
              contentKey="headline"
              value={content.headline}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-4 sm:mb-6"
            />
            
            <EditableText 
              as="p"
              section="hero"
              contentKey="subheadline"
              value={content.subheadline}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            />
          </motion.div>

          {/* Right Column: Mockups & Download Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col items-center mt-8 lg:mt-0"
          >
            {/* Mockups Container - Responsive Aspect Ratio */}
            <div className="relative w-full max-w-[280px] sm:max-w-[380px] md:max-w-[450px] aspect-[4/5] mx-auto">
              {/* Tablet Mockup (Back) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[5%] right-0 w-[80%] aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 md:border-8 border-slate-800 bg-slate-900 z-10"
              >
                <img 
                  src={content.tabletImage} 
                  alt="Tablet App View" 
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Phone Mockup (Front) */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[5%] left-0 w-[45%] aspect-[9/19] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-slate-900 bg-slate-900 z-20"
              >
                <img 
                  src={content.phoneImage} 
                  alt="Phone App View" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              {/* Floating Elements */}
              {content.floatingBadges?.map((badge: any, index: number) => {
                if (!badge.isVisible && !isAdminMode) return null;
                
                const isLeft = badge.position === 'left';
                const positionClass = isLeft 
                  ? "absolute top-[20%] -left-4 sm:-left-8"
                  : "absolute bottom-[20%] -right-4 sm:-right-8";
                
                return (
                  <motion.div 
                    key={badge.id}
                    animate={isLeft ? { y: [0, -8, 0] } : { y: [0, 8, 0] }}
                    transition={isLeft 
                      ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                    }
                    className={`${positionClass} glass px-2.5 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-2 sm:gap-3 z-30 ${!badge.isVisible ? 'opacity-50 grayscale' : ''}`}
                  >
                    {isAdminMode && (
                      <div className="absolute -top-3 -right-3 z-50">
                        <ArrayItemToolbar 
                          section="hero"
                          arrayKey="floatingBadges"
                          index={index}
                          item={badge}
                          array={content.floatingBadges}
                        />
                      </div>
                    )}
                    <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full ${badge.colorClass || 'bg-brand-blue'} text-white flex items-center justify-center font-bold text-xs sm:text-base`}>
                      {badge.iconText === '🛍️' ? (
                        <ShoppingBag size={14} className="sm:w-[18px] sm:h-[18px]" />
                      ) : (
                        <EditableText 
                          as="span"
                          section="hero"
                          contentKey={`floatingBadges[${index}].iconText`}
                          value={badge.iconText}
                        />
                      )}
                    </div>
                    <div>
                      <EditableText 
                        as="div"
                        section="hero"
                        contentKey={`floatingBadges[${index}].title`}
                        value={badge.title}
                        className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight"
                      />
                      <EditableText 
                        as="div"
                        section="hero"
                        contentKey={`floatingBadges[${index}].subtitle`}
                        value={badge.subtitle}
                        className="text-xs sm:text-sm font-bold text-slate-800 leading-tight"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Download Button - Strictly under the mockups */}
            <div className="mt-8 sm:mt-12 w-full flex justify-center z-30 relative px-4">
              <button 
                onClick={() => handleDownload(config.content[config.language].appLinks)}
                className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-4 sm:px-12 sm:py-5 rounded-full font-bold text-lg sm:text-xl transition-all hover:shadow-2xl hover:shadow-brand-blue/40 flex items-center justify-center gap-3 group transform hover:-translate-y-1"
              >
                <Download size={24} className="animate-bounce" />
                <EditableText section="hero" contentKey="primaryCta" value={content.primaryCta} />
              </button>
            </div>
          </motion.div>
          
        </div>

        {/* Bottom Section: Map & Delivery Guarantees */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-20 lg:mt-32 w-full flex flex-col items-center"
        >
          {/* Realistic Mauritania Map */}
          <div className="w-full max-w-5xl mx-auto mb-8 relative z-0">
            <MauritaniaMap />
          </div>

          <div className="flex flex-col items-center justify-center z-30 relative px-4">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-blue mb-6 text-center">
              {isRtl ? 'أينما كنت في موريتانيا' : 'Wherever you are in Mauritania'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</div>
                {isRtl ? 'توصيل سريع' : 'Fast Delivery'}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">✓</div>
                {isRtl ? 'دفع آمن' : 'Secure Payment'}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
