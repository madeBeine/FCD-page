import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { AdminToolbar, EditableText, ArrayItemToolbar } from './AdminTools';
import { Plane, Ship, Truck, PackageSearch } from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, React.ElementType> = {
  Plane,
  Ship,
  Truck,
  PackageSearch
};

export const Services = () => {
  const { config } = useConfig();
  const content = config.content[config.language].services;

  return (
    <section id="services" className="py-24 relative bg-white dark:bg-slate-900 transition-colors duration-300">
      <AdminToolbar sectionId="services" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <EditableText 
              as="h2"
              section="services"
              contentKey="title"
              value={content.title}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
            />
            <div className="w-24 h-1 bg-brand-blue rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.items.map((service: any, index: number) => {
            if (service.isVisible === false && !config.isAdminMode) return null;
            const Icon = iconMap[service.icon] || Plane;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-brand-blue/5 dark:hover:shadow-brand-blue/10 transition-all duration-300 overflow-hidden ${service.isVisible === false ? 'opacity-50 grayscale' : ''}`}
              >
                <ArrayItemToolbar section="services" arrayKey="items" index={index} item={service} array={content.items} />
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 dark:from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center mb-6 text-brand-blue dark:text-brand-orange group-hover:scale-110 group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white dark:group-hover:bg-brand-orange dark:group-hover:border-brand-orange dark:group-hover:text-white transition-all duration-300">
                    <Icon size={28} />
                  </div>
                  
                  <EditableText 
                    as="h3"
                    section="services"
                    contentKey={`items[${index}].title`}
                    value={service.title}
                    className="text-xl font-bold text-slate-900 dark:text-white mb-3"
                  />
                  
                  <EditableText 
                    as="p"
                    section="services"
                    contentKey={`items[${index}].description`}
                    value={service.description}
                    className="text-slate-600 dark:text-slate-300 leading-relaxed"
                  />
                </div>
                
                {/* Decorative Element */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-orange/10 dark:bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/20 dark:group-hover:bg-brand-orange/10 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
