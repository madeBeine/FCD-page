export type Language = 'ar' | 'en' | 'fr';

export interface SectionConfig {
  id: string;
  isVisible: boolean;
  order: number;
}

export interface AppConfig {
  language: Language;
  isAdminMode: boolean;
  sections: SectionConfig[];
  content: {
    [key in Language]: {
      navbar: {
        logoText: string;
        links: { id: string; label: string }[];
        downloadCta: string;
      };
      hero: {
        headline: string;
        subheadline: string;
        primaryCta: string;
        secondaryCta: string;
      };
      howItWorks: {
        title: string;
        steps: { title: string; description: string }[];
      };
      services: {
        title: string;
        items: { title: string; description: string; icon: string }[];
      };
      localMarket: {
        title: string;
        description: string;
        cta: string;
      };
      academy: {
        title: string;
        description: string;
        cta: string;
      };
      faq: {
        title: string;
        items: { question: string; answer: string }[];
      };
      footer: {
        description: string;
        quickLinksTitle: string;
        contactTitle: string;
        rights: string;
      };
      terms: {
        title: string;
        content: string;
      };
      privacy: {
        title: string;
        content: string;
      };
    };
  };
}

export interface ConfigContextType {
  config: AppConfig;
  setLanguage: (lang: Language) => void;
  toggleAdminMode: () => void;
  updateContent: (lang: Language, section: string, key: string, value: any) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  saveConfig: () => Promise<void>;
}
