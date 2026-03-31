import React, { createContext, useState, useContext, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppConfig, ConfigContextType, Language } from '../types';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '../components/LoadingScreen';

const initialSections = [
  { id: 'hero', isVisible: true, order: 1 },
  { id: 'storeWall', isVisible: true, order: 2 },
  { id: 'howItWorks', isVisible: true, order: 3 },
  { id: 'services', isVisible: true, order: 4 },
  { id: 'localMarket', isVisible: true, order: 6 },
  { id: 'academy', isVisible: true, order: 7 },
  { id: 'faq', isVisible: true, order: 8 },
];

const initialContent = {
  ar: {
    navbar: {
      logoText: 'فاست كوماند',
      logoImage: '',
      faviconUrl: '/favicon.svg',
      links: [
        { id: 'howItWorks', label: 'كيف نعمل' },
        { id: 'services', label: 'خدماتنا' },
        { id: 'academy', label: 'الأكاديمية', isPage: true },
        { id: 'faq', label: 'الأسئلة الشائعة' },
      ],
      downloadCta: 'حمل التطبيق',
    },
    hero: {
      headline: 'تسوق عالمياً، واستلم محلياً',
      subheadline: 'أسرع وأكثر الطرق أماناً للتسوق من متاجرك العالمية المفضلة وتوصيلها إلى باب منزلك في موريتانيا.',
      primaryCta: 'حمل التطبيق الآن',
      secondaryCta: 'اكتشف خدماتنا',
      tabletImage: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&auto=format&fit=crop',
      phoneImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop',
      floatingBadges: [
        {
          id: 'badge-1',
          iconText: 'A',
          title: 'Amazon US',
          subtitle: 'تم الشراء',
          colorClass: 'bg-brand-orange',
          position: 'left',
          isVisible: true
        },
        {
          id: 'badge-2',
          iconText: '🛍️',
          title: 'نواكشوط',
          subtitle: 'تم التوصيل',
          colorClass: 'bg-brand-blue',
          position: 'right',
          isVisible: true
        }
      ]
    },
    storeWall: {
      title: 'تسوق من أشهر المتاجر العالمية',
      stores: [
        { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', url: 'https://amazon.com' },
        { name: 'AliExpress', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Aliexpress_logo.svg', url: 'https://aliexpress.com' },
        { name: 'Shein', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Shein_logo.png', url: 'https://shein.com' },
        { name: 'Zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg', url: 'https://zara.com' },
        { name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg', url: 'https://ebay.com' },
        { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', url: 'https://nike.com' },
        { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', url: 'https://apple.com' },
        { name: 'IKEA', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg', url: 'https://ikea.com' },
      ]
    },
    howItWorks: {
      title: 'كيف تعمل فاست كوماند',
      steps: [
        { title: 'انسخ الرابط', description: 'ابحث عن منتجك المفضل في أي متجر عالمي وانسخ رابطه.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-shopping-online-on-a-tablet-39766-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
        { title: 'الصق في التطبيق', description: 'افتح تطبيق فاست كوماند والصق الرابط لطلب المنتج.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-43004-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
        { title: 'استلم طلبك', description: 'سنتكفل بالشراء والشحن حتى يصل إلى باب منزلك.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-delivery-man-delivering-a-package-40035-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
      ],
    },
    services: {
      title: 'خدماتنا المميزة',
      items: [
        { title: 'الشحن الجوي', description: 'شحن سريع وآمن لطلباتك المستعجلة.', icon: 'Plane' },
        { title: 'الشحن البحري', description: 'حلول اقتصادية للشحنات الكبيرة والثقيلة.', icon: 'Ship' },
        { title: 'التوصيل المحلي', description: 'توصيل سريع وموثوق داخل موريتانيا.', icon: 'Truck' },
        { title: 'خدمة التوريد', description: 'نساعدك في البحث عن أفضل الموردين لعملك.', icon: 'PackageSearch' },
      ],
    },
    localMarket: {
      title: 'السوق المحلي',
      description: 'ادعم المنتجات المحلية واشترِ من أفضل البائعين في موريتانيا مباشرة عبر منصتنا.',
      cta: 'تصفح السوق المحلي',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    academy: {
      title: 'أكاديمية فاست كوماند',
      description: 'تعلم كيف تتسوق بذكاء من المتاجر العالمية، وتعرف على أفضل العروض وكيفية تجنب الاحتيال.',
      cta: 'شاهد الشروحات',
      tutorials: [
        {
          title: 'كيف تشتري من أمازون خطوة بخطوة',
          description: 'دليل المبتدئين',
          videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    faq: {
      title: 'الأسئلة الشائعة',
      items: [
        { question: 'كم يستغرق الشحن؟', answer: 'يعتمد وقت الشحن على المصدر وطريقة الشحن. الشحن الجوي يستغرق عادة 7-14 يوماً.' },
        { question: 'كيف يمكنني تتبع طلبي؟', answer: 'يمكنك تتبع طلبك مباشرة من خلال تطبيق فاست كوماند باستخدام رقم التتبع الخاص بك.' },
        { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل الدفع عبر التطبيقات البنكية المحلية، الدفع عند الاستلام، والبطاقات البنكية.' },
      ],
    },
    footer: {
      description: 'شريكك الموثوق للتسوق العالمي والخدمات اللوجستية في موريتانيا.',
      quickLinksTitle: 'روابط سريعة',
      contactTitle: 'تواصل معنا',
      rights: 'جميع الحقوق محفوظة لشركة فاست كوماند',
      facebookUrl: '#',
      instagramUrl: '#',
      twitterUrl: '#',
      contactAddress: 'نواكشوط، موريتانيا',
      contactPhone: '+222 40 00 00 00',
      contactEmail: 'contact@fastcomand.mr',
      downloadAppTitle: 'حمل التطبيق الآن',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'الشروط والأحكام',
    },
    appLinks: {
      ios: 'https://apps.apple.com/app/fast-comand/id123456789',
      android: 'https://play.google.com/store/apps/details?id=com.fastcomand.app',
    },
    terms: {
      title: 'الشروط والأحكام',
      content: 'هنا يمكنك كتابة الشروط والأحكام الخاصة بتطبيق فاست كوماند. يمكنك تعديل هذا النص كما تشاء من خلال وضع التعديل.',
    },
    privacy: {
      title: 'سياسة الخصوصية',
      content: 'هنا يمكنك كتابة سياسة الخصوصية الخاصة بتطبيق فاست كوماند. يمكنك تعديل هذا النص كما تشاء من خلال وضع التعديل.',
    }
  },
  en: {
    navbar: {
      logoText: 'Fast Comand',
      logoImage: '',
      links: [
        { id: 'howItWorks', label: 'How it Works' },
        { id: 'services', label: 'Services' },
        { id: 'academy', label: 'Academy', isPage: true },
        { id: 'faq', label: 'FAQ' },
      ],
      downloadCta: 'Download App',
    },
    hero: {
      headline: 'Shop Globally, Receive Locally',
      subheadline: 'The fastest and most secure way to shop from your favorite global stores and get them delivered to your doorstep in Mauritania.',
      primaryCta: 'Download App Now',
      secondaryCta: 'Explore Services',
      tabletImage: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&auto=format&fit=crop',
      phoneImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop',
      floatingBadges: [
        {
          id: 'badge-1',
          iconText: 'A',
          title: 'Amazon US',
          subtitle: 'Purchased',
          colorClass: 'bg-brand-orange',
          position: 'left',
          isVisible: true
        },
        {
          id: 'badge-2',
          iconText: '🛍️',
          title: 'Nouakchott',
          subtitle: 'Delivered',
          colorClass: 'bg-brand-blue',
          position: 'right',
          isVisible: true
        }
      ]
    },
    storeWall: {
      title: 'Shop from Top Global Stores',
      stores: [
        { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', url: 'https://amazon.com' },
        { name: 'AliExpress', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Aliexpress_logo.svg', url: 'https://aliexpress.com' },
        { name: 'Shein', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Shein_logo.png', url: 'https://shein.com' },
        { name: 'Zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg', url: 'https://zara.com' },
        { name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg', url: 'https://ebay.com' },
        { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', url: 'https://nike.com' },
        { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', url: 'https://apple.com' },
        { name: 'IKEA', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg', url: 'https://ikea.com' },
      ]
    },
    howItWorks: {
      title: 'How Fast Comand Works',
      steps: [
        { title: 'Copy Link', description: 'Find your desired product on any global store and copy its link.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-shopping-online-on-a-tablet-39766-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
        { title: 'Paste in App', description: 'Open the Fast Comand app and paste the link to order.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-43004-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
        { title: 'Receive Order', description: 'We handle the purchase and shipping right to your door.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-delivery-man-delivering-a-package-40035-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
      ],
    },
    services: {
      title: 'Our Premium Services',
      items: [
        { title: 'Air Freight', description: 'Fast and secure shipping for your urgent orders.', icon: 'Plane' },
        { title: 'Sea Freight', description: 'Economical solutions for large and heavy shipments.', icon: 'Ship' },
        { title: 'Local Delivery', description: 'Fast and reliable delivery within Mauritania.', icon: 'Truck' },
        { title: 'Sourcing', description: 'We help you find the best suppliers for your business.', icon: 'PackageSearch' },
      ],
    },
    localMarket: {
      title: 'Local Market',
      description: 'Support local products and buy from the best vendors in Mauritania directly through our platform.',
      cta: 'Browse Local Market',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    academy: {
      title: 'Fast Comand Academy',
      description: 'Learn how to shop smart from global stores, discover the best deals, and avoid scams.',
      cta: 'Watch Tutorials',
      tutorials: [
        {
          title: 'How to buy from Amazon step by step',
          description: 'Beginner Guide',
          videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { question: 'How long does shipping take?', answer: 'Shipping time depends on the origin and method. Air freight usually takes 7-14 days.' },
        { question: 'How can I track my order?', answer: 'You can track your order directly through the Fast Comand app using your tracking number.' },
        { question: 'What payment methods are available?', answer: 'We accept local banking apps, cash on delivery, and credit cards.' },
      ],
    },
    footer: {
      description: 'Your trusted partner for global shopping and logistics in Mauritania.',
      quickLinksTitle: 'Quick Links',
      contactTitle: 'Contact Us',
      rights: 'All rights reserved to Fast Comand',
      facebookUrl: '#',
      instagramUrl: '#',
      twitterUrl: '#',
      contactAddress: 'Nouakchott, Mauritania',
      contactPhone: '+222 40 00 00 00',
      contactEmail: 'contact@fastcomand.mr',
      downloadAppTitle: 'Download App Now',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
    appLinks: {
      ios: 'https://apps.apple.com/app/fast-comand/id123456789',
      android: 'https://play.google.com/store/apps/details?id=com.fastcomand.app',
    },
    terms: {
      title: 'Terms and Conditions',
      content: 'Here you can write the terms and conditions for the Fast Comand app. You can edit this text as you wish through the edit mode.',
    },
    privacy: {
      title: 'Privacy Policy',
      content: 'Here you can write the privacy policy for the Fast Comand app. You can edit this text as you wish through the edit mode.',
    }
  },
  fr: {
    navbar: {
      logoText: 'Fast Comand',
      logoImage: '',
      links: [
        { id: 'howItWorks', label: 'Comment ça marche' },
        { id: 'services', label: 'Services' },
        { id: 'academy', label: 'Académie', isPage: true },
        { id: 'faq', label: 'FAQ' },
      ],
      downloadCta: 'Télécharger',
    },
    hero: {
      headline: 'Achetez mondialement, recevez localement',
      subheadline: 'Le moyen le plus rapide et le plus sûr d\'acheter dans vos magasins mondiaux préférés et de vous faire livrer à votre porte en Mauritanie.',
      primaryCta: 'Télécharger l\'application',
      secondaryCta: 'Découvrir nos services',
      tabletImage: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&auto=format&fit=crop',
      phoneImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop',
      floatingBadges: [
        {
          id: 'badge-1',
          iconText: 'A',
          title: 'Amazon US',
          subtitle: 'Acheté',
          colorClass: 'bg-brand-orange',
          position: 'left',
          isVisible: true
        },
        {
          id: 'badge-2',
          iconText: '🛍️',
          title: 'Nouakchott',
          subtitle: 'Livré',
          colorClass: 'bg-brand-blue',
          position: 'right',
          isVisible: true
        }
      ]
    },
    storeWall: {
      title: 'Achetez dans les meilleurs magasins mondiaux',
      stores: [
        { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', url: 'https://amazon.com' },
        { name: 'AliExpress', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Aliexpress_logo.svg', url: 'https://aliexpress.com' },
        { name: 'Shein', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Shein_logo.png', url: 'https://shein.com' },
        { name: 'Zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg', url: 'https://zara.com' },
        { name: 'eBay', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg', url: 'https://ebay.com' },
        { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', url: 'https://nike.com' },
        { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', url: 'https://apple.com' },
        { name: 'IKEA', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg', url: 'https://ikea.com' },
      ]
    },
    howItWorks: {
      title: 'Comment fonctionne Fast Comand',
      steps: [
        { title: 'Copiez le lien', description: 'Trouvez votre produit souhaité sur n\'importe quel magasin mondial et copiez son lien.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-shopping-online-on-a-tablet-39766-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
        { title: 'Collez dans l\'application', description: 'Ouvrez l\'application Fast Comand et collez le lien pour commander.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-43004-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
        { title: 'Recevez votre commande', description: 'Nous nous occupons de l\'achat et de l\'expédition jusqu\'à votre porte.', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-delivery-man-delivering-a-package-40035-large.mp4', imageUrl: '', linkUrl: '', mediaType: 'video' },
      ],
    },
    services: {
      title: 'Nos services premium',
      items: [
        { title: 'Fret aérien', description: 'Expédition rapide et sécurisée pour vos commandes urgentes.', icon: 'Plane' },
        { title: 'Fret maritime', description: 'Solutions économiques pour les envois volumineux et lourds.', icon: 'Ship' },
        { title: 'Livraison locale', description: 'Livraison rapide et fiable en Mauritanie.', icon: 'Truck' },
        { title: 'Sourcing', description: 'Nous vous aidons à trouver les meilleurs fournisseurs pour votre entreprise.', icon: 'PackageSearch' },
      ],
    },
    localMarket: {
      title: 'Marché local',
      description: 'Soutenez les produits locaux et achetez directement auprès des meilleurs vendeurs en Mauritanie via notre plateforme.',
      cta: 'Parcourir le marché local',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    academy: {
      title: 'Académie Fast Comand',
      description: 'Apprenez à acheter intelligemment dans les magasins mondiaux, découvrez les meilleures offres et évitez les arnaques.',
      cta: 'Regarder les tutoriels',
      tutorials: [
        {
          title: 'Comment acheter sur Amazon étape par étape',
          description: 'Guide du débutant',
          videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    faq: {
      title: 'Foire aux questions',
      items: [
        { question: 'Combien de temps prend l\'expédition ?', answer: 'Le délai d\'expédition dépend de l\'origine et de la méthode. Le fret aérien prend généralement 7 à 14 jours.' },
        { question: 'Comment puis-je suivre ma commande ?', answer: 'Vous pouvez suivre votre commande directement via l\'application Fast Comand en utilisant votre numéro de suivi.' },
        { question: 'Quels sont les modes de paiement disponibles ?', answer: 'Nous acceptons les applications bancaires locales, le paiement à la livraison et les cartes de crédit.' },
      ],
    },
    footer: {
      description: 'Votre partenaire de confiance pour les achats mondiaux et la logistique en Mauritanie.',
      quickLinksTitle: 'Liens rapides',
      contactTitle: 'Contactez-nous',
      rights: 'Tous droits réservés à Fast Comand',
      facebookUrl: '#',
      instagramUrl: '#',
      twitterUrl: '#',
      contactAddress: 'Nouakchott, Mauritanie',
      contactPhone: '+222 40 00 00 00',
      contactEmail: 'contact@fastcomand.mr',
      downloadAppTitle: 'Télécharger l\'application',
      privacyPolicy: 'Politique de confidentialité',
      termsOfService: 'Conditions générales',
    },
    appLinks: {
      ios: 'https://apps.apple.com/app/fast-comand/id123456789',
      android: 'https://play.google.com/store/apps/details?id=com.fastcomand.app',
    },
    terms: {
      title: 'Conditions générales',
      content: 'Ici, vous pouvez écrire les conditions générales de l\'application Fast Comand. Vous pouvez modifier ce texte comme vous le souhaitez via le mode édition.',
    },
    privacy: {
      title: 'Politique de confidentialité',
      content: 'Ici, vous pouvez écrire la politique de confidentialité de l\'application Fast Comand. Vous pouvez modifier ce texte comme vous le souhaitez via le mode édition.',
    }
  }
};

const initialConfig: AppConfig = {
  language: 'ar',
  isAdminMode: false,
  sections: initialSections,
  content: initialContent,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [isLoading, setIsLoading] = useState(!!supabase);
  
  // Initialize dark mode based on system preference or localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class immediately on initial render to prevent flash
  if (typeof window !== 'undefined') {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.dir = config.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = config.language;
    
    // Apply font family based on language
    if (config.language === 'ar') {
      document.body.style.fontFamily = 'var(--font-cairo)';
    } else {
      document.body.style.fontFamily = 'var(--font-inter)';
    }
  }, [config.language]);

  // Fetch config from Supabase
  useEffect(() => {
    const syncContentAcrossLanguages = (content: any) => {
      if (!content || !content.ar) return content;
      
      const syncedContent = JSON.parse(JSON.stringify(content));
      
      // Ensure all languages, sections, and fields exist
      (['ar', 'en', 'fr'] as const).forEach(lang => {
        if (!syncedContent[lang]) {
          syncedContent[lang] = JSON.parse(JSON.stringify(initialContent[lang]));
        } else {
          Object.keys(initialContent[lang]).forEach(section => {
            if (!syncedContent[lang][section]) {
              syncedContent[lang][section] = JSON.parse(JSON.stringify(initialContent[lang][section as keyof typeof initialContent.ar]));
            } else {
              // Ensure all fields within the section exist (e.g., floatingBadges)
              Object.keys(initialContent[lang][section as keyof typeof initialContent.ar]).forEach(field => {
                if (syncedContent[lang][section][field] === undefined) {
                  syncedContent[lang][section][field] = JSON.parse(JSON.stringify((initialContent[lang][section as keyof typeof initialContent.ar] as any)[field]));
                }
              });
            }
          });
        }
      });

      const arContent = syncedContent.ar;
      
      (['en', 'fr'] as const).forEach(lang => {
        const langContent = syncedContent[lang];
        
        // Sync storeWall
        if (arContent.storeWall?.stores) {
          langContent.storeWall.stores = arContent.storeWall.stores.map((arStore: any, i: number) => {
            const langStore = langContent.storeWall.stores?.[i] || { name: '', logo: '', url: '' };
            return { ...langStore, logo: arStore.logo, url: arStore.url, name: arStore.name };
          });
        }
        
        // Sync howItWorks
        if (arContent.howItWorks?.steps) {
          langContent.howItWorks.steps = arContent.howItWorks.steps.map((arStep: any, i: number) => {
            const langStep = langContent.howItWorks.steps?.[i] || { title: '', description: '', videoUrl: '' };
            return { ...langStep, videoUrl: arStep.videoUrl };
          });
        }
        
        // Sync services
        if (arContent.services?.items) {
          langContent.services.items = arContent.services.items.map((arItem: any, i: number) => {
            const langItem = langContent.services.items?.[i] || { title: '', description: '', icon: '' };
            return { ...langItem, icon: arItem.icon };
          });
        }
        
        // Sync academy
        if (arContent.academy?.tutorials) {
          langContent.academy.tutorials = arContent.academy.tutorials.map((arTutorial: any, i: number) => {
            const langTutorial = langContent.academy.tutorials?.[i] || { title: '', description: '', videoThumbnail: '', videoUrl: '' };
            return { ...langTutorial, videoThumbnail: arTutorial.videoThumbnail, videoUrl: arTutorial.videoUrl };
          });
        }
        
        // Sync faq
        if (arContent.faq?.items) {
          langContent.faq.items = arContent.faq.items.map((arItem: any, i: number) => {
            const langItem = langContent.faq.items?.[i] || { question: '', answer: '' };
            return langItem;
          });
        }
        
        // Sync navbar links
        if (arContent.navbar?.links) {
          langContent.navbar.links = arContent.navbar.links.map((arLink: any, i: number) => {
            const langLink = langContent.navbar.links?.[i] || { id: '', label: '' };
            return { ...langLink, id: arLink.id, isPage: arLink.isPage };
          });
        }
        
        // Sync localMarket images
        if (arContent.localMarket?.images) {
          langContent.localMarket.images = [...arContent.localMarket.images];
        }
        
        // Sync shared object keys
        if (arContent.appLinks) {
          langContent.appLinks = { ...arContent.appLinks };
        }
        
        if (arContent.hero) {
          langContent.hero.tabletImage = arContent.hero.tabletImage;
          langContent.hero.phoneImage = arContent.hero.phoneImage;
        }
        
        if (arContent.navbar) {
          langContent.navbar.logoImage = arContent.navbar.logoImage;
        }
      });
      
      return syncedContent;
    };

    const fetchConfig = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('app_config')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (data) {
          setConfig(prev => {
            const syncedContent = syncContentAcrossLanguages(data.content || prev.content);
            return {
              ...prev,
              sections: data.sections || prev.sections,
              content: syncedContent,
            };
          });
        } else if (error && error.code === 'PGRST116') {
          // No rows returned, insert initial config
          await supabase.from('app_config').insert([{
            id: 1,
            sections: initialConfig.sections,
            content: initialConfig.content
          }]);
        }
      } catch (err) {
        console.error('Error fetching config from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  const saveConfig = async () => {
    if (!supabase) {
      console.warn('Supabase is not configured. Changes are only saved locally.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('app_config')
        .upsert({
          id: 1,
          sections: config.sections,
          content: config.content,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      console.log('Configuration saved to Supabase successfully!');
    } catch (err) {
      console.error('Error saving config to Supabase:', err);
      alert('Failed to save configuration to database.');
    }
  };

  const setLanguage = (lang: Language) => {
    setConfig(prev => ({ ...prev, language: lang }));
  };

  const toggleAdminMode = () => {
    setConfig(prev => ({ ...prev, isAdminMode: !prev.isAdminMode }));
  };

  const updateContent = (lang: Language, section: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [section]: {
            ...prev.content[lang][section as keyof typeof prev.content.ar],
            [key]: value
          }
        }
      }
    }));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s
      )
    }));
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const newSections = [...prev.sections];
      const index = newSections.findIndex(s => s.id === sectionId);
      if (index === -1) return prev;
      
      if (direction === 'up' && index > 0) {
        // Swap with previous
        const temp = newSections[index].order;
        newSections[index].order = newSections[index - 1].order;
        newSections[index - 1].order = temp;
      } else if (direction === 'down' && index < newSections.length - 1) {
        // Swap with next
        const temp = newSections[index].order;
        newSections[index].order = newSections[index + 1].order;
        newSections[index + 1].order = temp;
      }
      
      return {
        ...prev,
        sections: newSections.sort((a, b) => a.order - b.order)
      };
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  return (
    <ConfigContext.Provider value={{
      config,
      setLanguage,
      toggleAdminMode,
      updateContent,
      toggleSectionVisibility,
      moveSection,
      isDarkMode,
      toggleDarkMode,
      saveConfig
    }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
