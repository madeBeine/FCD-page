import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { PlayCircle, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const Academy = () => {
  const { config } = useConfig();
  const content = config.content[config.language].academy as any;

  return (
    <section id="academy" className="py-24 relative bg-transparent transition-colors duration-300 overflow-hidden">
      <AdminToolbar sectionId="academy" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Visual/Video Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-2xl mx-auto lg:max-w-none order-2 lg:order-1 relative"
          >
            {/* Background glow for the video cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 blur-3xl -z-10 rounded-[3rem] transform scale-95" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.tutorials?.map((tutorial: any, index: number) => {
                if (tutorial.isVisible === false && !config.isAdminMode) return null;
                return (
                  <div key={index} className={`relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 dark:border-slate-700/50 group cursor-pointer ${tutorial.isVisible === false ? 'opacity-50 grayscale' : ''} ${index === 0 ? 'sm:col-span-2' : ''}`}>
                    <ArrayItemToolbar section="academy" arrayKey="tutorials" index={index} item={tutorial} array={content.tutorials} />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors z-10" />
                    <img 
                      src={tutorial.videoThumbnail} 
                      alt={`${tutorial.title} - تطبيق فاست كوماند`} 
                      className="w-full h-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Play Button */}
                    <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <PlayCircle size={48} className="text-white drop-shadow-lg" fill="currentColor" />
                      </div>
                    </a>
                    
                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent z-20 pointer-events-none">
                      <div className="flex items-center gap-2 text-brand-orange font-bold text-sm mb-2 drop-shadow-md">
                        <BookOpen size={16} />
                        {tutorial.description}
                      </div>
                      <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-md">
                        {tutorial.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-start order-1 lg:order-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 text-brand-blue mb-8">
              <GraduationCap size={32} />
            </div>
            
            <EditableText 
              as="h2"
              section="academy"
              contentKey="title"
              value={content.title}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6"
            />
            
            <EditableText 
              as="p"
              section="academy"
              contentKey="description"
              value={content.description}
              className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            />
            
            <a href={content.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_8px_30px_rgb(255,85,0,0.3)] hover:shadow-[0_8px_40px_rgb(255,85,0,0.5)] flex items-center justify-center gap-2 group mx-auto lg:mx-0 inline-flex active:scale-95">
              <PlayCircle size={20} />
              <EditableText section="academy" contentKey="cta" value={content.cta} />
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
};
