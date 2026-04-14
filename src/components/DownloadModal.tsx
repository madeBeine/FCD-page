import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../context/ConfigContext';
import { X, Smartphone, Apple } from 'lucide-react';
import { trackEvent } from '../hooks/useAnalytics';

export const DownloadModal = () => {
  const { config, isDownloadModalOpen, closeDownloadModal } = useConfig();
  const content = config.content[config.language];
  const isRtl = config.language === 'ar';

  if (!isDownloadModalOpen) return null;

  const handleStoreClick = (store: 'ios' | 'android') => {
    trackEvent('app_download', { store });
    
    const link = store === 'ios' 
      ? (content.appLinks?.ios || 'https://apps.apple.com/app/fast-comand/id123456789')
      : (content.appLinks?.android || 'https://play.google.com/store/apps/details?id=com.fastcomand.app');
    
    window.open(link, '_blank');
    closeDownloadModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/50 backdrop-blur-sm" onClick={closeDownloadModal}>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-slate-900 rounded-t-[2rem] md:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative mt-auto md:mt-0"
          dir={isRtl ? 'rtl' : 'ltr'}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Drag Handle */}
          <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>

          {/* Close Button */}
          <button 
            onClick={closeDownloadModal}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors z-10 hidden md:flex`}
          >
            <X size={20} />
          </button>

          <div className="p-6 md:p-8 text-center pb-10 md:pb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Smartphone size={32} className="text-brand-blue md:w-10 md:h-10" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isRtl ? 'اختر متجر التطبيقات' : config.language === 'fr' ? 'Choisissez votre boutique' : 'Choose App Store'}
            </h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mb-6 md:mb-8">
              {isRtl 
                ? 'قم بتحميل تطبيق فاست كوماند الآن واستمتع بتجربة تسوق فريدة.' 
                : config.language === 'fr' 
                  ? 'Téléchargez l\'application Fast Comand maintenant et profitez d\'une expérience d\'achat unique.' 
                  : 'Download the Fast Comand app now and enjoy a unique shopping experience.'}
            </p>

            <div className="flex flex-col gap-3 md:gap-4">
              <button
                onClick={() => handleStoreClick('ios')}
                className="w-full transition-transform hover:scale-105 active:scale-95"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-14 mx-auto" />
              </button>

              <button
                onClick={() => handleStoreClick('android')}
                className="w-full transition-transform hover:scale-105 active:scale-95"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-14 mx-auto" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
