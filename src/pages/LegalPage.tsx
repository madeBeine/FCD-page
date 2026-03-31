import React, { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { EditableText } from '../components/AdminTools';

interface LegalPageProps {
  type: 'terms' | 'privacy';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { config } = useConfig();
  const content = config.content[config.language][type];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <main className="flex-grow pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          <EditableText 
            as="h1"
            section={type}
            contentKey="title"
            value={content.title}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 pb-6 border-b border-slate-200 dark:border-slate-700"
          />
          
          <div className="prose dark:prose-invert max-w-none">
            <EditableText 
              as="div"
              section={type}
              contentKey="content"
              value={content.content}
              className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
            />
          </div>
        </div>
      </div>
    </main>
  );
};
