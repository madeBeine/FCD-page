import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { PlayCircle, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const Academy = () => {
  const { config } = useConfig();
  const content = config.content[config.language].academy as any;

  return (
    <section id="academy" className="py-24 relative bg-white dark:bg-slate-900 transition-colors duration-300">
      <AdminToolbar sectionId="academy" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Visual/Video Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-2xl mx-auto lg:max-w-none order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 gap-6">
              {content.tutorials?.map((tutorial: any, index: number) => {
                if (tutorial.isVisible === false && !config.isAdminMode) return null;
                return (
                  <div key={index} className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 group cursor-pointer ${tutorial.isVisible === false ? 'opacity-50 grayscale' : ''}`}>
                    <ArrayItemToolbar section="academy" arrayKey="tutorials" index={index} item={tutorial} array={content.tutorials} />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors z-10" />
                    <img 
                      src={tutorial.videoThumbnail} 
                      alt={tutorial.title} 
                      className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Play Button */}
                    <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle size={48} className="text-white" fill="currentColor" />
                      </div>
                    </a>
                    
                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/80 to-transparent z-20 pointer-events-none">
                      <div className="flex items-center gap-2 text-brand-orange font-bold text-sm mb-2">
                        <BookOpen size={16} />
                        {tutorial.description}
                      </div>
                      <h3 className="text-white text-xl md:text-2xl font-bold">
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
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6"
            />
            
            <EditableText 
              as="p"
              section="academy"
              contentKey="description"
              value={content.description}
              className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            />
            
            <a href={content.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 group mx-auto lg:mx-0 inline-flex">
              <PlayCircle size={20} />
              <EditableText section="academy" contentKey="cta" value={content.cta} />
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
};
