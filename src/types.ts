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
  mapCities: any[];
  sections: SectionConfig[];
  content: {
    [key in Language]: {
      navbar: {
        logoText: string;
        logoImage?: string;
        faviconUrl?: string;
        links: { id: string; label: string; isVisible?: boolean; isPage?: boolean }[];
        downloadCta: string;
      };
      loadingScreen: {
        title: string;
        subtitle: string;
      };
      hero: {
        headline: string;
        subheadline: string;
        primaryCta: string;
        secondaryCta: string;
        tabletImage?: string;
        phoneImage?: string;
        phoneVideo?: string;
        floatingBadges?: {
          id: string;
          iconText: string;
          title: string;
          subtitle: string;
          colorClass: string;
          position: 'left' | 'right';
          isVisible: boolean;
        }[];
      };
      ads?: {
        banners: {
          id: string;
          imageUrl: string;
          linkUrl: string;
          isVisible?: boolean;
        }[];
      };
      storeWall: {
        title: string;
        stores: { name: string; logo: string; url: string }[];
      };
      howItWorks: {
        title: string;
        steps: { title: string; description: string; videoUrl?: string; imageUrl?: string; linkUrl?: string; mediaType?: string }[];
      };
      services: {
        title: string;
        items: { title: string; description: string; icon: string }[];
      };
      localMarket: {
        title: string;
        description: string;
        cta: string;
        images?: string[];
      };
      academy: {
        title: string;
        description: string;
        cta: string;
        tutorials?: {
          title: string;
          description: string;
          videoThumbnail: string;
          videoUrl: string;
        }[];
      };
      testimonials?: {
        title: string;
        description: string;
        reviews: {
          id: string;
          name: string;
          rating: number;
          text: string;
          date: string;
          packageImage?: string;
        }[];
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
        youtubeUrl?: string;
        contactAddress?: string;
        contactPhone?: string;
        contactEmail?: string;
        downloadAppTitle?: string;
        privacyPolicy?: string;
        termsOfService?: string;
      };
      appLinks?: {
        ios: string;
        android: string;
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
  isLoading: boolean;
  error: string | null;
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
  notification: { message: string, type: 'success' | 'error' | 'info' } | null;
  updateMapCities: (newCities: any[]) => void;
  isDownloadModalOpen: boolean;
  openDownloadModal: () => void;
  closeDownloadModal: () => void;
}
