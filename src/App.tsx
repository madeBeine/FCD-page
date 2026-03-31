/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StoreWall } from './components/StoreWall';
import { HowItWorks } from './components/HowItWorks';
import { Services } from './components/Services';
import { LocalMarket } from './components/LocalMarket';
import { Academy } from './components/Academy';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalPage } from './pages/LegalPage';

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const HomePage = () => {
  const { config } = useConfig();
  
  const sectionComponents: Record<string, React.FC> = {
    hero: Hero,
    storeWall: StoreWall,
    howItWorks: HowItWorks,
    services: Services,
    localMarket: LocalMarket,
    faq: FAQ,
  };

  return (
    <main className="flex-grow">
      {config.sections
        .filter(section => section.id !== 'academy' && (section.isVisible || config.isAdminMode))
        .map(section => {
          const Component = sectionComponents[section.id];
          if (!Component) return null;
          
          return (
            <div key={section.id} className={!section.isVisible ? "opacity-50 grayscale" : ""}>
              <Component />
            </div>
          );
        })}
    </main>
  );
};

const AcademyPage = () => {
  const { config } = useConfig();
  const section = config.sections.find(s => s.id === 'academy');
  
  if (!section?.isVisible && !config.isAdminMode) return null;

  return (
    <main className="flex-grow pt-20">
      <div className={!section?.isVisible ? "opacity-50 grayscale" : ""}>
        <Academy />
      </div>
    </main>
  );
};

const MainContent = () => {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <ConfigProvider>
      <MainContent />
    </ConfigProvider>
  );
}
