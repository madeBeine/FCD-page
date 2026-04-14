import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, ArrayItemToolbar, EditableText } from './AdminTools';

export const AdsSection = () => {
  const { config } = useConfig();
  const content = config.content[config.language].ads;

  if (!content || !content.banners) return null;

  const visibleBanners = content.banners.filter((b: any) => b.isVisible !== false || config.isAdminMode);
  
  if (visibleBanners.length === 0) return null;

  return (
    <section id="ads" className="py-8 bg-transparent relative z-10">
      <AdminToolbar sectionId="ads" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4">
          {visibleBanners.map((banner: any, index: number) => {
            const originalIndex = content.banners.indexOf(banner);
            return (
              <div key={banner.id || originalIndex} className="relative snap-center shrink-0 w-full md:w-[80%] lg:w-[60%] aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden shadow-md group">
                <ArrayItemToolbar section="ads" arrayKey="banners" index={originalIndex} item={banner} array={content.banners} />
                <a href={banner.linkUrl || '#'} target="_blank" rel="noopener noreferrer" className={`block w-full h-full ${banner.isVisible === false ? 'opacity-50' : ''}`}>
                  <img src={banner.imageUrl} alt="إعلانات تطبيق فاست كوماند - وسيط تسوق دولي نواكشوط" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </a>
                {config.isAdminMode && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-slate-800/90 p-2 rounded text-xs flex flex-col gap-1 z-50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">Image URL:</span>
                      <EditableText section="ads" contentKey={`banners[${originalIndex}].imageUrl`} value={banner.imageUrl} className="flex-1 bg-slate-100 dark:bg-slate-700 rounded px-1 text-slate-900 dark:text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">Link URL:</span>
                      <EditableText section="ads" contentKey={`banners[${originalIndex}].linkUrl`} value={banner.linkUrl} className="flex-1 bg-slate-100 dark:bg-slate-700 rounded px-1 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
