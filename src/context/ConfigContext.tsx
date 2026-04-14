import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppConfig, ConfigContextType, Language } from '../types';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '../components/LoadingScreen';
import { cn } from '../lib/utils';

const initialSections = [
  { id: 'hero', isVisible: true, order: 1 },
  { id: 'ads', isVisible: true, order: 1.5 },
  { id: 'storeWall', isVisible: true, order: 2 },
  { id: 'howItWorks', isVisible: true, order: 3 },
  { id: 'services', isVisible: true, order: 4 },
  { id: 'testimonials', isVisible: true, order: 5 },
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
        { id: 'home', label: 'الصفحة الرئيسية', isPage: true },
        { id: 'howItWorks', label: 'كيف نعمل' },
        { id: 'services', label: 'خدماتنا' },
        { id: 'academy', label: 'الأكاديمية', isPage: true },
        { id: 'faq', label: 'الأسئلة الشائعة' },
      ],
      downloadCta: 'حمل التطبيق',
    },
    loadingScreen: {
      title: 'فاست كوماند',
      subtitle: 'طلبيتك بين يديك بسرعة وأمان',
    },
    announcement: {
      isVisible: true,
      text: '🔥 خصم 20% على أول طلب باستخدام الكود FAST20 🔥',
      linkText: 'تسوق الآن',
      linkUrl: '#',
    },
    promos: {
      isVisible: true,
      title: 'عروض وخصومات',
      items: [
        { id: 'promo-1', code: 'FAST20', description: 'خصم 20% على أول طلب', discount: '20%' },
        { id: 'promo-2', code: 'FREESHIP', description: 'شحن مجاني للطلبات فوق 10,000 أوقية', discount: 'مجاني' }
      ]
    },
    hero: {
      headline: 'تطبيق فاست كوماند: شحن من أمازون لموريتانيا',
      subheadline: 'وسيط تسوق دولي نواكشوط الأسرع والأكثر أماناً للتسوق من متاجرك العالمية المفضلة وتوصيلها إلى باب منزلك في موريتانيا.',
      primaryCta: 'حمل التطبيق الآن',
      secondaryCta: 'اكتشف خدماتنا',
      tabletImage: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&fm=webp&fit=crop',
      phoneImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&fm=webp&fit=crop',
      phoneVideo: '',
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
    ads: {
      banners: [
        { id: 'ad-1', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&fm=webp&fit=crop', linkUrl: '#', isVisible: true },
        { id: 'ad-2', imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76ba?q=80&w=2015&fm=webp&fit=crop', linkUrl: '#', isVisible: true }
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
      title: 'كيف تعمل فاست كوماند - شحن شي إن وتيمو موريتانيا',
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
      cta: 'انضم كبائع محلي',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&fm=webp&fit=crop'
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
          videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&fm=webp&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    testimonials: {
      title: 'آراء عملائنا',
      description: 'نفخر بثقة آلاف العملاء في موريتانيا. شاهد تجاربهم وصور طرودهم المستلمة.',
      reviews: [
        {
          id: 'rev-1',
          name: 'أحمد محمد',
          rating: 5,
          text: 'تجربة ممتازة! وصلت شحنتي من أمازون في وقت قياسي وبحالة ممتازة. تطبيق سهل الاستخدام وخدمة عملاء راقية.',
          date: 'منذ يومين',
          packageImage: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?q=80&w=800&fm=webp&fit=crop'
        },
        {
          id: 'rev-2',
          name: 'فاطمة سيدي',
          rating: 5,
          text: 'أفضل وسيط تسوق في نواكشوط بلا منازع. طلبت ملابس من شي إن ووصلتني لباب البيت. شكراً فاست كوماند!',
          date: 'منذ أسبوع',
          packageImage: 'https://images.unsplash.com/photo-1580828369019-2238f6cb827c?q=80&w=800&fm=webp&fit=crop'
        },
        {
          id: 'rev-3',
          name: 'سيدي عالي',
          rating: 4,
          text: 'خدمة موثوقة جداً. الأسعار واضحة من البداية ولا توجد رسوم خفية. أنصح الجميع بتجربته.',
          date: 'منذ أسبوعين',
          packageImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&fm=webp&fit=crop'
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
      youtubeUrl: '#',
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
        { id: 'home', label: 'Home', isPage: true },
        { id: 'howItWorks', label: 'How it Works' },
        { id: 'services', label: 'Services' },
        { id: 'academy', label: 'Academy', isPage: true },
        { id: 'faq', label: 'FAQ' },
      ],
      downloadCta: 'Download App',
    },
    loadingScreen: {
      title: 'Fast Comand',
      subtitle: 'Your order in your hands, fast and secure',
    },
    announcement: {
      isVisible: true,
      text: '🔥 20% OFF your first order with code FAST20 🔥',
      linkText: 'Shop Now',
      linkUrl: '#',
    },
    promos: {
      isVisible: true,
      title: 'Offers & Discounts',
      items: [
        { id: 'promo-1', code: 'FAST20', description: '20% off your first order', discount: '20%' },
        { id: 'promo-2', code: 'FREESHIP', description: 'Free shipping on orders over 10,000 MRU', discount: 'Free' }
      ]
    },
    hero: {
      headline: 'Shop Globally, Receive Locally',
      subheadline: 'The fastest and most secure way to shop from your favorite global stores and get them delivered to your doorstep in Mauritania.',
      primaryCta: 'Download App Now',
      secondaryCta: 'Explore Services',
      tabletImage: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&fm=webp&fit=crop',
      phoneImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&fm=webp&fit=crop',
      phoneVideo: '',
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
    ads: {
      banners: [
        { id: 'ad-1', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&fm=webp&fit=crop', linkUrl: '#', isVisible: true },
        { id: 'ad-2', imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76ba?q=80&w=2015&fm=webp&fit=crop', linkUrl: '#', isVisible: true }
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
      cta: 'Join as a Local Vendor',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&fm=webp&fit=crop'
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
          videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&fm=webp&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    },
    testimonials: {
      title: 'Customer Reviews',
      description: 'We are proud of the trust of thousands of customers in Mauritania. See their experiences and photos of their received packages.',
      reviews: [
        {
          id: 'rev-1',
          name: 'Ahmed Mohamed',
          rating: 5,
          text: 'Excellent experience! My shipment from Amazon arrived in record time and in excellent condition. Easy to use app and classy customer service.',
          date: '2 days ago',
          packageImage: 'https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?q=80&w=800&fm=webp&fit=crop'
        },
        {
          id: 'rev-2',
          name: 'Fatima Sidi',
          rating: 5,
          text: 'The best shopping broker in Nouakchott without a doubt. I ordered clothes from Shein and they arrived at my door. Thank you Fast Comand!',
          date: '1 week ago',
          packageImage: 'https://images.unsplash.com/photo-1580828369019-2238f6cb827c?q=80&w=800&fm=webp&fit=crop'
        },
        {
          id: 'rev-3',
          name: 'Sidi Aly',
          rating: 4,
          text: 'Very reliable service. Prices are clear from the beginning and there are no hidden fees. I advise everyone to try it.',
          date: '2 weeks ago',
          packageImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&fm=webp&fit=crop'
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
      youtubeUrl: '#',
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
        { id: 'home', label: 'Accueil', isPage: true },
        { id: 'howItWorks', label: 'Comment ça marche' },
        { id: 'services', label: 'Services' },
        { id: 'academy', label: 'Académie', isPage: true },
        { id: 'faq', label: 'FAQ' },
      ],
      downloadCta: 'Télécharger',
    },
    loadingScreen: {
      title: 'Fast Comand',
      subtitle: 'Votre commande entre vos mains, rapidement et en toute sécurité',
    },
    announcement: {
      isVisible: true,
      text: '🔥 20% de réduction sur votre première commande avec le code FAST20 🔥',
      linkText: 'Acheter',
      linkUrl: '#',
    },
    promos: {
      isVisible: true,
      title: 'Offres et réductions',
      items: [
        { id: 'promo-1', code: 'FAST20', description: '20% de réduction sur votre première commande', discount: '20%' },
        { id: 'promo-2', code: 'FREESHIP', description: 'Livraison gratuite pour les commandes de plus de 10 000 MRU', discount: 'Gratuit' }
      ]
    },
    hero: {
      headline: 'Achetez mondialement, recevez localement',
      subheadline: 'Le moyen le plus rapide et le plus sûr d\'acheter dans vos magasins mondiaux préférés et de vous faire livrer à votre porte en Mauritanie.',
      primaryCta: 'Télécharger l\'application',
      secondaryCta: 'Découvrir nos services',
      tabletImage: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2064&fm=webp&fit=crop',
      phoneImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&fm=webp&fit=crop',
      phoneVideo: '',
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
    ads: {
      banners: [
        { id: 'ad-1', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&fm=webp&fit=crop', linkUrl: '#', isVisible: true },
        { id: 'ad-2', imageUrl: 'https://images.unsplash.com/photo-1607083206968-13611e3d76ba?q=80&w=2015&fm=webp&fit=crop', linkUrl: '#', isVisible: true }
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
      cta: 'Rejoindre comme vendeur local',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&fm=webp&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070&fm=webp&fit=crop'
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
          videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&fm=webp&fit=crop',
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
      youtubeUrl: '#',
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

const initialMapCities = [
  { name: "Nouadhibou", coordinates: [-17.0347, 20.9309], dx: 10, dy: 3, anchor: "start" },
  { name: "Zouérat", coordinates: [-12.4833, 22.7167], dx: 5, dy: 3, anchor: "start" },
  { name: "Atar", coordinates: [-13.0500, 20.5169], dx: -5, dy: 3, anchor: "end" },
  { name: "Akjoujt", coordinates: [-14.3833, 19.6969], dx: 5, dy: 10, anchor: "start" },
  { name: "Nouakchott", coordinates: [-15.9582, 18.0735], dx: 8, dy: 3, anchor: "start", isBold: true },
  { name: "Boutilimit", coordinates: [-14.6919, 17.5469], dx: -5, dy: 3, anchor: "end" },
  { name: "Rosso", coordinates: [-15.8050, 16.5138], dx: 0, dy: -8, anchor: "middle" },
  { name: "Aleg", coordinates: [-13.9167, 17.0500], dx: 5, dy: 3, anchor: "start" },
  { name: "Bogué", coordinates: [-14.2667, 16.5833], dx: 5, dy: 3, anchor: "start" },
  { name: "Kaédi", coordinates: [-13.5000, 16.1500], dx: 5, dy: 3, anchor: "start" },
  { name: "Kiffa", coordinates: [-11.4000, 16.6167], dx: -5, dy: 3, anchor: "end" },
  { name: "Hamoud", coordinates: [-11.3300, 15.6500], dx: 0, dy: -8, anchor: "middle" },
  { name: "Néma", coordinates: [-7.2500, 16.6167], dx: 0, dy: -8, anchor: "middle" },
  { name: "Boû Gâdoûm", coordinates: [-7.6167, 16.1833], dx: 0, dy: -8, anchor: "middle" },
  { name: "Adel Bagrou", coordinates: [-7.1500, 15.5667], dx: -5, dy: 3, anchor: "end" }
];

const initialConfig: AppConfig = {
  language: 'ar',
  isAdminMode: false,
  adminCode: 'M@27562254@m',
  sections: initialSections,
  content: initialContent as any,
  mapCities: initialMapCities as any,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [isLoading, setIsLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedConfig, setLastSavedConfig] = useState<AppConfig | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const hasUnsavedChanges = useMemo(() => {
    if (!lastSavedConfig) return false;
    
    // Compare essential parts that are saved to DB
    return JSON.stringify(config.sections) !== JSON.stringify(lastSavedConfig.sections) ||
           JSON.stringify(config.content) !== JSON.stringify(lastSavedConfig.content) ||
           config.adminCode !== lastSavedConfig.adminCode ||
           JSON.stringify(config.mapCities) !== JSON.stringify(lastSavedConfig.mapCities);
  }, [config, lastSavedConfig]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

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
      
      // Ensure academy link exists in arContent
      if (arContent.navbar && arContent.navbar.links) {
        const academyLink = arContent.navbar.links.find((link: any) => link.id === 'academy');
        if (!academyLink) {
          // Insert before faq or at the end
          const faqIndex = arContent.navbar.links.findIndex((link: any) => link.id === 'faq');
          const insertIndex = faqIndex !== -1 ? faqIndex : arContent.navbar.links.length;
          arContent.navbar.links.splice(insertIndex, 0, { id: 'academy', label: 'الأكاديمية', isPage: true, isVisible: true });
        } else {
          // Ensure isPage is true if it already exists
          academyLink.isPage = true;
          academyLink.isVisible = true;
        }
      }
      
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
            let defaultLabel = '';
            if (arLink.id === 'academy') {
              defaultLabel = lang === 'en' ? 'Academy' : 'Académie';
            }
            const langLink = langContent.navbar.links?.[i] || { id: arLink.id, label: defaultLabel };
            return { ...langLink, id: arLink.id, isPage: arLink.isPage, isVisible: arLink.isVisible };
          });
        }
        
        // Sync localMarket images
        if (arContent.localMarket?.images) {
          langContent.localMarket.images = [...arContent.localMarket.images];
        }

        // Sync testimonials
        if (arContent.testimonials?.reviews) {
          if (!langContent.testimonials) {
            langContent.testimonials = { title: '', description: '', reviews: [] };
          }
          langContent.testimonials.reviews = arContent.testimonials.reviews.map((arReview: any, i: number) => {
            const langReview = langContent.testimonials.reviews?.[i] || { id: arReview.id, name: '', rating: 5, text: '', date: '' };
            return { ...langReview, id: arReview.id, rating: arReview.rating, packageImage: arReview.packageImage };
          });
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
      const startTime = Date.now();
      
      if (!supabase) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1200 - elapsedTime);
        setTimeout(() => setIsLoading(false), remainingTime);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('app_config')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (data) {
          const syncedContent = syncContentAcrossLanguages(data.content || initialConfig.content);
          let loadedSections = data.sections || initialConfig.sections;
          const academySection = loadedSections.find((s: any) => s.id === 'academy');
          if (!academySection) {
            loadedSections = [...loadedSections, { id: 'academy', isVisible: true, order: 7 }];
          } else {
            academySection.isVisible = true;
          }

          const testimonialsSection = loadedSections.find((s: any) => s.id === 'testimonials');
          if (!testimonialsSection) {
            loadedSections = [...loadedSections, { id: 'testimonials', isVisible: true, order: 5 }];
          }

          const loadedConfig = {
            ...initialConfig,
            sections: loadedSections,
            content: syncedContent,
            adminCode: data.admin_code !== undefined && data.admin_code !== null ? data.admin_code : initialConfig.adminCode,
            mapCities: data.map_cities || initialConfig.mapCities,
          };
          setConfig(loadedConfig);
          setLastSavedConfig(loadedConfig);
        } else if (error && (error.code === 'PGRST116' || error.message?.includes('JSON object'))) {
          // No rows returned or schema mismatch, insert initial config
          const initialData = {
            id: 1,
            sections: initialConfig.sections,
            content: initialConfig.content,
            admin_code: initialConfig.adminCode,
            map_cities: initialConfig.mapCities
          };
          await supabase.from('app_config').upsert(initialData);
          setLastSavedConfig(initialConfig);
        }
      } catch (err) {
        console.error('Error fetching config from Supabase:', err);
        setError(config.language === 'ar' ? 'تعذر الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.' : 'Failed to connect to the database. Please check your internet connection and try again.');
        // Fallback to initial config so the app doesn't crash completely
        setConfig(initialConfig);
        setLastSavedConfig(initialConfig);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1200 - elapsedTime);
        setTimeout(() => setIsLoading(false), remainingTime);
      }
    };
    
    fetchConfig();
  }, []);

  const saveConfig = async () => {
    if (!supabase) {
      showNotification('Supabase is not configured. Changes are only saved locally.', 'error');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('app_config')
        .upsert({
          id: 1,
          sections: config.sections,
          content: config.content,
          admin_code: config.adminCode,
          map_cities: config.mapCities,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      setLastSavedConfig({ ...config });
      showNotification(config.language === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully', 'success');
    } catch (err) {
      console.error('Error saving config to Supabase:', err);
      showNotification(config.language === 'ar' ? 'فشل في حفظ التغييرات' : 'Failed to save changes', 'error');
    }
  };

  const discardChanges = () => {
    if (lastSavedConfig) {
      setConfig({ ...lastSavedConfig, isAdminMode: config.isAdminMode, language: config.language });
      showNotification(config.language === 'ar' ? 'تم تجاهل التغييرات' : 'Changes discarded', 'info');
    }
  };

  const updateAdminCode = (newCode: string) => {
    setConfig(prev => ({
      ...prev,
      adminCode: newCode
    }));
  };

  const updateMapCities = (newCities: any[]) => {
    setConfig(prev => ({
      ...prev,
      mapCities: newCities
    }));
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

  const openDownloadModal = () => setIsDownloadModalOpen(true);
  const closeDownloadModal = () => setIsDownloadModalOpen(false);

  return (
    <ConfigContext.Provider value={{
      config,
      isLoading,
      error,
      setLanguage,
      toggleAdminMode,
      updateContent,
      updateAdminCode,
      toggleSectionVisibility,
      moveSection,
      isDarkMode,
      toggleDarkMode,
      saveConfig,
      updateMapCities,
      hasUnsavedChanges,
      discardChanges,
      showNotification,
      notification,
      isDownloadModalOpen,
      openDownloadModal,
      closeDownloadModal
    }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <>
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex flex-col"
            >
              {children}
            </motion.div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="fixed top-0 left-0 right-0 z-[300] bg-red-500 text-white px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  {error}
                  <button onClick={() => setError(null)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-red-600 rounded-full transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: 50, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 50, x: '-50%' }}
                  className={cn(
                    "fixed bottom-24 left-1/2 z-[200] px-6 py-3 rounded-xl shadow-2xl text-white font-medium flex items-center gap-2 min-w-[300px] justify-center",
                    notification.type === 'success' ? "bg-green-500" : 
                    notification.type === 'error' ? "bg-red-500" : "bg-brand-blue"
                  )}
                >
                  {notification.message}
                </motion.div>
              )}
            </AnimatePresence>
          </>
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
