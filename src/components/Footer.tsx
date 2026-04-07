import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { EditableText } from './AdminTools';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleDownload } from '../lib/utils';
import { trackEvent } from '../hooks/useAnalytics';

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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <a href={content.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue dark:hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href={content.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange dark:hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href={content.twitterUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-blue dark:hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href={`https://wa.me/${(content.contactPhone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
              
              {config.isAdminMode && (
                <div className="flex flex-col gap-2 mt-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-500 mb-1">{isRtl ? 'روابط التواصل الاجتماعي:' : 'Social Links:'}</div>
                  <div className="flex items-center gap-2">
                    <Facebook size={14} className="text-slate-400 shrink-0" />
                    <EditableText section="footer" contentKey="facebookUrl" value={content.facebookUrl || ''} className="text-xs text-slate-600 dark:text-slate-400 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram size={14} className="text-slate-400 shrink-0" />
                    <EditableText section="footer" contentKey="instagramUrl" value={content.instagramUrl || ''} className="text-xs text-slate-600 dark:text-slate-400 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter size={14} className="text-slate-400 shrink-0" />
                    <EditableText section="footer" contentKey="twitterUrl" value={content.twitterUrl || ''} className="text-xs text-slate-600 dark:text-slate-400 w-full" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <EditableText 
              as="p"
              section="footer"
              contentKey="quickLinksTitle"
              value={content.quickLinksTitle}
              className="text-slate-900 dark:text-white font-bold text-lg mb-6"
            />
            <ul className="space-y-4">
              {config.content[config.language].navbar.links.map((link: any) => {
                if (link.isVisible === false && !config.isAdminMode) return null;
                const isPage = link.isPage;
                const to = isPage ? `/${link.id}` : `/#${link.id}`;
                
                return (
                  <li key={link.id} className={link.isVisible === false ? "opacity-50 grayscale" : ""}>
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
              as="p"
              section="footer"
              contentKey="contactTitle"
              value={content.contactTitle}
              className="text-slate-900 dark:text-white font-bold text-lg mb-6"
            />
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-orange shrink-0 mt-1" />
                <EditableText 
                  as="span"
                  section="footer"
                  contentKey="contactAddress"
                  value={content.contactAddress || ''}
                />
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-brand-blue shrink-0" />
                <EditableText 
                  as="span"
                  section="footer"
                  contentKey="contactPhone"
                  value={content.contactPhone || ''}
                  className="dir-ltr"
                />
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-brand-orange shrink-0" />
                <EditableText 
                  as="span"
                  section="footer"
                  contentKey="contactEmail"
                  value={content.contactEmail || ''}
                />
              </li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <EditableText 
              as="p"
              section="footer"
              contentKey="downloadAppTitle"
              value={content.downloadAppTitle || (config.language === 'ar' ? 'حمل التطبيق الآن' : config.language === 'fr' ? 'Télécharger l\'application' : 'Download App Now')}
              className="text-slate-900 dark:text-white font-bold text-lg mb-6"
            />
            <div className="space-y-4">
              <a href={config.content[config.language].appLinks?.ios} onClick={() => trackEvent('download', { platform: 'ios' })} target="_blank" rel="noopener noreferrer" className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-4 transition-colors shadow-sm">
                <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">A</div>
                <div className="text-start">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Download on the</div>
                  <div className="text-slate-900 dark:text-white font-bold">App Store</div>
                </div>
              </a>
              <a href={config.content[config.language].appLinks.android} onClick={() => trackEvent('download', { platform: 'android' })} target="_blank" rel="noopener noreferrer" className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-4 transition-colors shadow-sm">
                <div className="w-8 h-8 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold">G</div>
                <div className="text-start">
                  <div className="text-xs text-slate-500 dark:text-slate-400">GET IT ON</div>
                  <div className="text-slate-900 dark:text-white font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()}</span>
            <EditableText 
              as="span"
              section="footer"
              contentKey="rights"
              value={content.rights || ''}
            />
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-brand-blue dark:hover:text-white transition-colors">
              <EditableText 
                as="span"
                section="footer"
                contentKey="privacyPolicy"
                value={content.privacyPolicy || (config.language === 'ar' ? 'سياسة الخصوصية' : config.language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy')}
              />
            </Link>
            <Link to="/terms" className="hover:text-brand-blue dark:hover:text-white transition-colors">
              <EditableText 
                as="span"
                section="footer"
                contentKey="termsOfService"
                value={content.termsOfService || (config.language === 'ar' ? 'الشروط والأحكام' : config.language === 'fr' ? 'Conditions générales' : 'Terms of Service')}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
