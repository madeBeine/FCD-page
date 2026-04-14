import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Menu, X, Globe, Download, Settings, LayoutDashboard, Moon, Sun, Search, LogOut } from 'lucide-react';
import { cn, handleDownload } from '../lib/utils';
import { ArrayItemToolbar } from './AdminTools';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { trackEvent } from '../hooks/useAnalytics';

export const Navbar = () => {
  const { config, setLanguage, toggleAdminMode, isDarkMode, toggleDarkMode, saveConfig, hasUnsavedChanges, discardChanges, openDownloadModal } = useConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const content = config.content[config.language].navbar as any;
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic favicon update
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && content.faviconUrl) {
      favicon.setAttribute('href', content.faviconUrl);
    }
  }, [content.faviconUrl]);

  useEffect(() => {
    let lastIsScrolled = false;
    const handleScroll = () => {
      const currentIsScrolled = window.scrollY > 20;
      if (currentIsScrolled !== lastIsScrolled) {
        setIsScrolled(currentIsScrolled);
        lastIsScrolled = currentIsScrolled;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = config.language === 'ar' ? 'en' : config.language === 'en' ? 'fr' : 'ar';
    setLanguage(nextLang);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = searchQuery;
      const isCorrectCode = value === config.adminCode;
      
      // Track attempt with exact location if possible
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            trackEvent('admin_login_attempt', { 
              code: value, 
              success: isCorrectCode,
              exact_location: { lat: pos.coords.latitude, lon: pos.coords.longitude }
            });
          },
          (err) => {
            trackEvent('admin_login_attempt', { code: value, success: isCorrectCode });
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        trackEvent('admin_login_attempt', { code: value, success: isCorrectCode });
      }

      if (isCorrectCode) {
        if (window.innerWidth < 768) {
          setAdminError(
            config.language === 'ar' 
              ? 'لا يمكن الدخول إلى وضع التعديل من الهاتف' 
              : config.language === 'fr' 
                ? 'Le mode édition n\'est pas accessible sur mobile' 
                : 'Admin mode cannot be accessed from mobile'
          );
          setSearchQuery('');
          setTimeout(() => setAdminError(''), 3000);
          return;
        }

        if (!config.isAdminMode) {
          toggleAdminMode();
        }
        setSearchQuery('');
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      } else {
        setSearchQuery('');
      }
    }
  };

  const handleExitConfirm = async () => {
    if (hasUnsavedChanges) {
      setIsSaving(true);
      await saveConfig();
      setIsSaving(false);
    }
    toggleAdminMode();
    setShowExitConfirm(false);
    if (location.pathname === '/admin') {
      navigate('/');
    }
  };

  const handleDiscardExit = () => {
    if (hasUnsavedChanges) {
      discardChanges();
    }
    toggleAdminMode();
    setShowExitConfirm(false);
    if (location.pathname === '/admin') {
      navigate('/');
    }
  };

  const announcement = (config.content[config.language] as any).announcement;
  const showAnnouncement = announcement?.isVisible || config.isAdminMode;

  return (
    <>
      {/* Top Announcement Bar */}
      {showAnnouncement && (
        <div className={cn(
          "bg-brand-blue text-white text-xs sm:text-sm py-2 px-4 text-center relative z-[60] transition-all duration-300",
          !announcement.isVisible && "opacity-50 grayscale",
          isScrolled ? "-translate-y-full absolute w-full" : "translate-y-0"
        )}>
          <div className="container mx-auto flex items-center justify-center gap-2">
            <span className="font-medium">{announcement.text}</span>
            {announcement.linkText && (
              <a href={announcement.linkUrl} className="font-bold underline hover:text-brand-orange transition-colors">
                {announcement.linkText}
              </a>
            )}
          </div>
        </div>
      )}

      <header 
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "top-0 py-3 glass shadow-md dark:glass-dark" : cn("py-5 bg-transparent", showAnnouncement ? "top-8 sm:top-9" : "top-0")
        )}
      >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/"
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          {content.logoImage ? (
            <img src={content.logoImage} alt={`${content.logoText} - وسيط تسوق دولي نواكشوط`} className="h-10 object-contain dark:brightness-0 dark:invert" />
          ) : (
            <>
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <path d="M 26 37 L 75 14.5 L 69 50 L 26 71 Z" fill="#1a3b8e" className="dark:fill-white" />
                  <path d="M 26 71 L 47.5 60 L 67.5 73.5 L 46 84.5 Z" fill="#ff9d3a" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-brand-blue dark:text-white">
                {content.logoText}
              </span>
            </>
          )}
          {config.isAdminMode && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full flex items-center gap-1">
              <Settings size={12} /> Admin
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {content.links.map((link: any, index: number) => {
            if (link.isVisible === false && !config.isAdminMode) return null;
            const isPage = link.isPage;
            const to = link.id === 'home' ? '/' : (isPage ? `/${link.id}` : `/#${link.id}`);
            const isActive = link.id === 'home' ? location.pathname === '/' : (isPage ? location.pathname === `/${link.id}` : false);
            
            return (
              <div key={link.id} className="relative group">
                <ArrayItemToolbar section="navbar" arrayKey="links" index={index} item={link} array={content.links} />
                <Link 
                  to={to}
                  className={cn(
                    "text-sm font-medium transition-colors relative group block",
                    isActive ? "text-brand-blue dark:text-brand-orange" : "text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange",
                    link.isVisible === false ? "opacity-50 grayscale" : ""
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-brand-orange transition-all",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )}></span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {config.isAdminMode && (
            <>
              <Link 
                to="/admin"
                className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <LayoutDashboard size={16} />
                {config.language === 'ar' ? 'لوحة التحكم' : config.language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
              </Link>
              <button
                onClick={() => setShowExitConfirm(true)}
                className="text-sm font-medium text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <LogOut size={16} />
                {config.language === 'ar' ? 'خروج' : config.language === 'fr' ? 'Quitter' : 'Exit'}
              </button>
            </>
          )}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden mx-2"
                >
                  <input
                    type="text"
                    placeholder={config.language === 'ar' ? 'بحث...' : config.language === 'fr' ? 'Recherche...' : 'Search...'}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full px-4 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Search"
            >
              <Search size={18} />
            </button>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange transition-colors"
          >
            <Globe size={18} />
            {config.language === 'ar' ? 'English' : config.language === 'en' ? 'Français' : 'العربية'}
          </button>
          <button 
            onClick={openDownloadModal}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all hover:shadow-lg hover:shadow-brand-blue/30 flex items-center gap-2 active:scale-95"
          >
            <Download size={18} />
            {content.downloadCta}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {content.links.map((link: any, index: number) => {
                if (link.isVisible === false && !config.isAdminMode) return null;
                const isPage = link.isPage;
                const to = link.id === 'home' ? '/' : (isPage ? `/${link.id}` : `/#${link.id}`);
                const isActive = link.id === 'home' ? location.pathname === '/' : (isPage ? location.pathname === `/${link.id}` : false);
                
                return (
                  <div key={link.id} className="relative group">
                    <ArrayItemToolbar section="navbar" arrayKey="links" index={index} item={link} array={content.links} />
                    <Link 
                      to={to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-medium py-2 border-b border-slate-100 block",
                        isActive ? "text-brand-blue" : "text-slate-700",
                        link.isVisible === false ? "opacity-50 grayscale" : ""
                      )}
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              })}
              <div className="flex flex-col gap-3 pt-2">
                {config.isAdminMode && (
                  <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 mb-1">
                    <Link 
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 text-base font-medium text-red-500 py-2 bg-red-50 rounded-lg"
                    >
                      <LayoutDashboard size={18} />
                      {config.language === 'ar' ? 'لوحة التحكم' : config.language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setShowExitConfirm(true);
                      }}
                      className="flex items-center justify-center gap-2 text-base font-medium text-slate-600 hover:text-red-500 py-2 bg-slate-50 rounded-lg"
                    >
                      <LogOut size={18} />
                      {config.language === 'ar' ? 'الخروج من وضع التعديل' : config.language === 'fr' ? 'Quitter le mode édition' : 'Exit Edit Mode'}
                    </button>
                  </div>
                )}
                <div className="relative flex items-center w-full mb-2">
                  <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={config.language === 'ar' ? 'بحث...' : config.language === 'fr' ? 'Recherche...' : 'Search...'}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full ps-10 pe-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  />
                </div>
                <button 
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 text-base font-medium text-slate-700 py-2 bg-slate-100 rounded-lg"
                >
                  <Globe size={18} />
                  {config.language === 'ar' ? 'Switch to English' : config.language === 'en' ? 'Passer au Français' : 'التبديل للعربية'}
                </button>
                <button 
                  onClick={() => {
                    openDownloadModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-brand-blue text-white px-5 py-3 rounded-lg font-medium text-base flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  {content.downloadCta}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Mobile Error Toast */}
      <AnimatePresence>
        {adminError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium text-center w-[90%] max-w-sm"
          >
            {adminError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Admin Mode Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              dir={config.language === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {config.language === 'ar' ? 'الخروج من وضع التعديل' : config.language === 'fr' ? 'Quitter le mode édition' : 'Exit Edit Mode'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {hasUnsavedChanges 
                    ? (config.language === 'ar' ? 'لديك تغييرات غير محفوظة. هل تريد حفظها قبل الخروج؟' : config.language === 'fr' ? 'Vous avez des modifications non enregistrées. Voulez-vous les enregistrer avant de quitter ?' : 'You have unsaved changes. Would you like to save them before exiting?')
                    : (config.language === 'ar' ? 'هل أنت متأكد من رغبتك في الخروج؟' : config.language === 'fr' ? 'Êtes-vous sûr de vouloir quitter ?' : 'Are you sure you want to exit?')
                  }
                </p>
                <div className="flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {config.language === 'ar' ? 'إلغاء' : config.language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                  
                  {hasUnsavedChanges && (
                    <button
                      onClick={handleDiscardExit}
                      className="px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      {config.language === 'ar' ? 'تجاهل التغييرات' : config.language === 'fr' ? 'Ignorer' : 'Discard'}
                    </button>
                  )}

                  <button
                    onClick={handleExitConfirm}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl font-medium bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {config.language === 'ar' ? 'جاري الحفظ...' : config.language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                      </>
                    ) : (
                      hasUnsavedChanges
                        ? (config.language === 'ar' ? 'حفظ وخروج' : config.language === 'fr' ? 'Enregistrer et quitter' : 'Save & Exit')
                        : (config.language === 'ar' ? 'خروج' : config.language === 'fr' ? 'Quitter' : 'Exit')
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};
