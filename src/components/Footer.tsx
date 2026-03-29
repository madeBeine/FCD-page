import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { EditableText } from './AdminTools';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleDownload } from '../lib/utils';

export const Footer = () => {
  const { config } = useConfig();
  const content = config.content[config.language].footer;
  const isRtl = config.language === 'ar';

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 select-none">
              {config.content[config.language].navbar.logoImage ? (
                <img src={config.content[config.language].navbar.logoImage} alt={config.content[config.language].navbar.logoText} className="h-10 object-contain dark:brightness-0 dark:invert" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    FC
                  </div>
                  <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                    {config.content[config.language].navbar.logoText}
                  </span>
                </>
              )}
            </div>
            <EditableText 
              as="p"
              section="footer"
              contentKey="description"
              value={content.description}
              className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm"
            />
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue dark:hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <EditableText 
              as="h4"
              section="footer"
              contentKey="quickLinksTitle"
              value={content.quickLinksTitle}
              className="text-slate-900 dark:text-white font-bold text-lg mb-6"
            />
            <ul className="space-y-4">
              {config.content[config.language].navbar.links.map((link) => {
                const isPage = link.isPage;
                const to = isPage ? `/${link.id}` : `/#${link.id}`;
                
                return (
                  <li key={link.id}>
                    <Link to={to} className="hover:text-brand-orange transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <EditableText 
              as="h4"
              section="footer"
              contentKey="contactTitle"
              value={content.contactTitle}
              className="text-slate-900 dark:text-white font-bold text-lg mb-6"
            />
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-orange shrink-0 mt-1" />
                <span>{isRtl ? 'نواكشوط، موريتانيا' : 'Nouakchott, Mauritania'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-brand-blue shrink-0" />
                <span dir="ltr">+222 40 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-brand-orange shrink-0" />
                <span>contact@fastcomand.mr</span>
              </li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-6">
              {config.language === 'ar' ? 'حمل التطبيق الآن' : config.language === 'fr' ? 'Télécharger l\'application' : 'Download App Now'}
            </h4>
            <div className="space-y-4">
              <button onClick={() => handleDownload(config.content[config.language].appLinks)} className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-4 transition-colors shadow-sm">
                <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">A</div>
                <div className="text-start">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Download on the</div>
                  <div className="text-slate-900 dark:text-white font-bold">App Store</div>
                </div>
              </button>
              <button onClick={() => handleDownload(config.content[config.language].appLinks)} className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-4 transition-colors shadow-sm">
                <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">G</div>
                <div className="text-start">
                  <div className="text-xs text-slate-500 dark:text-slate-400">GET IT ON</div>
                  <div className="text-slate-900 dark:text-white font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <EditableText 
            as="p"
            section="footer"
            contentKey="rights"
            value={`© ${new Date().getFullYear()} ${content.rights}`}
          />
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-brand-blue dark:hover:text-white transition-colors">{config.language === 'ar' ? 'سياسة الخصوصية' : config.language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}</Link>
            <Link to="/terms" className="hover:text-brand-blue dark:hover:text-white transition-colors">{config.language === 'ar' ? 'الشروط والأحكام' : config.language === 'fr' ? 'Conditions générales' : 'Terms of Service'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
