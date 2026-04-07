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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Close Button */}
          <button 
            onClick={closeDownloadModal}
            className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors z-10`}
          >
            <X size={20} />
          </button>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone size={40} className="text-brand-blue" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isRtl ? 'اختر متجر التطبيقات' : config.language === 'fr' ? 'Choisissez votre boutique' : 'Choose App Store'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {isRtl 
                ? 'قم بتحميل تطبيق فاست كوماند الآن واستمتع بتجربة تسوق فريدة.' 
                : config.language === 'fr' 
                  ? 'Téléchargez l\'application Fast Comand maintenant et profitez d\'une expérience d\'achat unique.' 
                  : 'Download the Fast Comand app now and enjoy a unique shopping experience.'}
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleStoreClick('ios')}
                className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <Apple size={28} />
                <div className="text-start">
                  <div className="text-[10px] opacity-80 leading-none mb-1">
                    {isRtl ? 'حمل من' : 'Download on the'}
                  </div>
                  <div className="text-lg font-semibold leading-none">
                    App Store
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleStoreClick('android')}
                className="flex items-center justify-center gap-3 w-full bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-4 rounded-2xl font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186c-.131-.145-.213-.338-.213-.553V2.367c0-.214.082-.408.212-.553zM14.726 11.065l2.457-2.457-11.84-6.843 9.383 9.3zM15.66 12l3.181 3.182c.484-.28.825-.758.825-1.328 0-.57-.341-1.048-.825-1.328L15.66 12zM14.726 12.935L5.343 22.235l11.84-6.843-2.457-2.457z"/>
                </svg>
                <div className="text-start">
                  <div className="text-[10px] opacity-80 leading-none mb-1">
                    {isRtl ? 'احصل عليه من' : 'GET IT ON'}
                  </div>
                  <div className="text-lg font-semibold leading-none">
                    Google Play
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
