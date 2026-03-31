import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, ArrayItemToolbar } from './AdminTools';
import { motion } from 'motion/react';

export const StoreWall = () => {
  const { config } = useConfig();
  const content = config.content[config.language].storeWall;
  
  return (
    <section id="storeWall" className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 overflow-hidden relative transition-colors duration-300">
      <AdminToolbar sectionId="storeWall" />
      
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {content.title}
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 md:gap-24 px-6 md:px-12">
          {content.stores.map((store: any, index: number) => {
            if (store.isVisible === false && !config.isAdminMode) return null;
            return (
              <div key={`store-1-${index}`} className="relative group">
                <ArrayItemToolbar section="storeWall" arrayKey="stores" index={index} item={store} array={content.stores} />
                <a href={store.url} target="_blank" rel="noopener noreferrer" className={`flex-none w-24 md:w-32 h-12 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${store.isVisible === false ? 'opacity-20 hover:opacity-20' : ''}`}>
                  <img src={store.logo} alt={store.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </a>
              </div>
            );
          })}
        </div>
        
        {/* Duplicate for seamless loop */}
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-12 md:gap-24 px-6 md:px-12">
          {content.stores.map((store: any, index: number) => {
            if (store.isVisible === false && !config.isAdminMode) return null;
            return (
              <div key={`store-2-${index}`} className="relative group">
                <ArrayItemToolbar section="storeWall" arrayKey="stores" index={index} item={store} array={content.stores} />
                <a href={store.url} target="_blank" rel="noopener noreferrer" className={`flex-none w-24 md:w-32 h-12 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${store.isVisible === false ? 'opacity-20 hover:opacity-20' : ''}`}>
                  <img src={store.logo} alt={store.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Gradient Masks */}
      <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-colors duration-300" />
    </section>
  );
};
