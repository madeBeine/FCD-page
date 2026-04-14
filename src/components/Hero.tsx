import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { Download, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { handleDownload } from '../lib/utils';

export const Hero = () => {
  const { config, openDownloadModal } = useConfig();
  const content = config.content[config.language].hero;
  const isAdminMode = config.isAdminMode;
  const isRtl = config.language === 'ar';

  return (
    <section id="hero" className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden bg-transparent">
      <AdminToolbar sectionId="hero" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Top Section: Text & Mockups */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6"
            />
            
            <EditableText 
              as="p"
              section="hero"
              contentKey="subheadline"
              value={content.subheadline}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium mb-8"
            />
          </motion.div>

          {/* Right Column: Mockups & Download Button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col items-center mt-8 lg:mt-0 relative"
          >
            {/* Realistic Phone Render */}
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] aspect-[9/19] mx-auto z-20">
              {isAdminMode && (
                <div className="absolute -top-16 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-2 rounded-lg shadow-lg z-50 text-xs border border-slate-200 dark:border-slate-700">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">رابط فيديو الهاتف (MP4):</label>
                  <EditableText section="hero" contentKey="phoneVideo" value={content.phoneVideo || ''} className="w-full bg-slate-100 dark:bg-slate-900 rounded px-2 py-1 text-slate-900 dark:text-white" />
                </div>
              )}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[6px] sm:border-[8px] border-slate-900 bg-slate-900 relative"
              >
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-900 rounded-b-xl z-30"></div>
                
                {content.phoneVideo ? (
                  <video 
                    src={content.phoneVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={content.phoneImage || "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&fm=webp&fit=crop"} 
                    alt="تطبيق فاست كوماند - شحن من أمازون لموريتانيا" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
              
              {/* Soft Shadow under phone */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/20 blur-2xl rounded-full -z-10"></div>
              
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

            {/* Download Buttons - Strictly under the mockups */}
            <div className="mt-12 sm:mt-16 w-full flex flex-col sm:flex-row justify-center gap-4 z-30 relative px-4">
              <a 
                href={config.content[config.language].appLinks?.ios || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 group transform hover:-translate-y-1 active:scale-95"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-8 sm:h-10" />
              </a>
              <a 
                href={config.content[config.language].appLinks?.android || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 group transform hover:-translate-y-1 active:scale-95"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 sm:h-10" />
              </a>
            </div>
          </motion.div>
          
        </div>

        {/* Bottom Section: Delivery Guarantees */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-12 lg:mt-16 w-full flex flex-col items-center"
        >
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
