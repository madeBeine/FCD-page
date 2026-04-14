import React from 'react';
import { motion } from 'motion/react';
import { useConfig } from '../context/ConfigContext';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const { config } = useConfig();
  const content = config.content[config.language].testimonials;

  if (!content || !content.reviews || content.reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-blue dark:text-white mb-6"
          >
            {content.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300"
          >
            {content.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-orange/10 rotate-180" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed line-clamp-4">
                "{review.text}"
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <h4 className="font-bold text-brand-blue dark:text-white">
                    {review.name}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {review.date}
                  </p>
                </div>
                
                {review.packageImage && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                    <img
                      src={review.packageImage}
                      alt={`طرد ${review.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
