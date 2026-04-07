export type Language = 'ar' | 'en' | 'fr';

export interface SectionConfig {
  id: string;
  isVisible: boolean;
  order: number;
}

export interface AppConfig {
  language: Language;
  isAdminMode: boolean;
  adminCode?: string;
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
        facebookUrl?: string;
        instagramUrl?: string;
        twitterUrl?: string;
        contactAddress?: string;
        contactPhone?: string;
        contactEmail?: string;
        downloadAppTitle?: string;
        privacyPolicy?: string;
        termsOfService?: string;
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
  updateAdminCode: (newCode: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  saveConfig: () => Promise<void>;
  hasUnsavedChanges: boolean;
  discardChanges: () => void;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  isDownloadModalOpen: boolean;
  openDownloadModal: () => void;
  closeDownloadModal: () => void;
}
