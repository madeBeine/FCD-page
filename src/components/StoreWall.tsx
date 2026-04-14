import React, { useEffect, useRef, useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, ArrayItemToolbar } from './AdminTools';
import { motion } from 'motion/react';

export const StoreWall = () => {
  const { config } = useConfig();
  const content = (config.content[config.language] as any).storeWall;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isRtl = getComputedStyle(container).direction === 'rtl';
    
    // Initial setup: jump to the middle set so we can scroll in both directions
    setTimeout(() => {
      if (container) {
        const setWidth = container.scrollWidth / 3;
        if (container.scrollLeft === 0) {
          container.scrollLeft = isRtl ? -setWidth : setWidth;
        }
      }
    }, 100);

    let animationFrameId: number;
    let lastTimestamp: number;
    let accumulator = 0;
    const speed = 0.5; // pixels per frame
    
    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (!isPaused && deltaTime > 16) {
        accumulator += speed;
        if (accumulator >= 1) {
          const step = Math.floor(accumulator);
          
          if (isRtl) {
            container.scrollLeft -= step;
          } else {
            container.scrollLeft += step;
          }
          accumulator -= step;
        }
        lastTimestamp = timestamp;
      }
      
      // Handle looping
      const setWidth = container.scrollWidth / 3;
      if (isRtl) {
        if (Math.abs(container.scrollLeft) >= setWidth * 2) {
          container.scrollLeft += setWidth;
        } else if (Math.abs(container.scrollLeft) <= 0) {
          container.scrollLeft -= setWidth;
        }
      } else {
        if (container.scrollLeft >= setWidth * 2) {
          container.scrollLeft -= setWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += setWidth;
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    
    const isRtl = getComputedStyle(container).direction === 'rtl';
    const setWidth = container.scrollWidth / 3;

    if (isRtl) {
      if (Math.abs(container.scrollLeft) >= setWidth * 2) {
        container.scrollLeft += setWidth;
      } else if (Math.abs(container.scrollLeft) <= 0) {
        container.scrollLeft -= setWidth;
      }
    } else {
      if (container.scrollLeft >= setWidth * 2) {
        container.scrollLeft -= setWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += setWidth;
      }
    }
  };

  const visibleStores = content.stores.filter((s: any) => s.isVisible !== false || config.isAdminMode);
  // Duplicate 3 times to allow infinite scrolling in both directions
  const mobileStores = [...visibleStores, ...visibleStores, ...visibleStores];

  return (
    <section id="storeWall" className="py-12 bg-transparent border-y border-slate-100 dark:border-slate-800 overflow-hidden relative transition-colors duration-300">
      <AdminToolbar sectionId="storeWall" />

      <div className="container mx-auto px-4 mb-8 text-center relative z-10">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {content.title}
        </p>
      </div>

      {/* Mobile: Horizontal Swipe Carousel | Desktop: Marquee */}
      <div className="relative z-10">
        {/* Desktop Marquee (Hidden on mobile) */}
        <div className="hidden md:flex relative overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 md:gap-24 px-6 md:px-12">
            {content.stores.map((store: any, index: number) => {
              if (store.isVisible === false && !config.isAdminMode) return null;
              return (
                <div key={`store-1-${index}`} className="relative group">
                  <ArrayItemToolbar section="storeWall" arrayKey="stores" index={index} item={store} array={content.stores} />
                  <a href={store.url} target="_blank" rel="noopener noreferrer" className={`flex-none w-24 md:w-32 h-12 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${store.isVisible === false ? 'opacity-20 hover:opacity-20' : ''}`}>
                    <img src={store.logo} alt={`${store.name} - وسيط تسوق دولي نواكشوط`} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                  </a>
                </div>
              );
            })}
          </div>
          
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-12 md:gap-24 px-6 md:px-12">
            {content.stores.map((store: any, index: number) => {
              if (store.isVisible === false && !config.isAdminMode) return null;
              return (
                <div key={`store-2-${index}`} className="relative group">
                  <ArrayItemToolbar section="storeWall" arrayKey="stores" index={index} item={store} array={content.stores} />
                  <a href={store.url} target="_blank" rel="noopener noreferrer" className={`flex-none w-24 md:w-32 h-12 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ${store.isVisible === false ? 'opacity-20 hover:opacity-20' : ''}`}>
                    <img src={store.logo} alt={`${store.name} - وسيط تسوق دولي نواكشوط`} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Swipe (Hidden on desktop) */}
        <div 
          ref={scrollRef}
          className="md:hidden flex overflow-x-auto hide-scrollbar pb-4"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onScroll={handleScroll}
        >
          {mobileStores.map((store: any, index: number) => {
            const isFirstSet = index < visibleStores.length;
            const originalIndex = content.stores.findIndex((s: any) => s.name === store.name);
            
            return (
              <div key={`store-mobile-${index}`} className="relative shrink-0 ml-6">
                {isFirstSet && config.isAdminMode && (
                  <ArrayItemToolbar section="storeWall" arrayKey="stores" index={originalIndex} item={store} array={content.stores} />
                )}
                <a href={store.url} target="_blank" rel="noopener noreferrer" className={`w-28 h-16 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 active:scale-95 transition-transform ${store.isVisible === false ? 'opacity-50' : ''}`}>
                  <img src={store.logo} alt={`${store.name} - وسيط تسوق دولي نواكشوط`} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Gradient Masks (Desktop only) */}
      <div className="hidden md:block absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-colors duration-300" />
      <div className="hidden md:block absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-colors duration-300" />
    </section>
  );
};
