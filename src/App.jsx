import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

import LiveTicker from './components/LiveTicker';
import Navigation from './components/Navigation';
import AIReferee from './components/AIReferee';
import Footer from './components/Footer';

import HomeView from './views/HomeView';
import AssociatesView from './views/AssociatesView';
import AboutLayout from './views/AboutLayout';
import TeamsView from './views/TeamsView';
import CareersView from './views/CareersView';
import AdminLoginView from './views/AdminLoginView';
import MemberDashboard from './views/MemberDashboard';
import TechnoxianView from './views/TechnoxianView';
import AdminView from './views/AdminView';
import NewsArticleView from './views/NewsArticleView';
import NewsListView from './views/NewsListView';

import { DEFAULT_SITES } from './constants/data';
import { styles } from './styles/inlineStyles';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [sites, setSites] = useState(DEFAULT_SITES);
  const [currentSite, setCurrentSite] = useState(DEFAULT_SITES.global);
  const [user, setUser] = useState(null);
  const [tickerText] = useState('BREAKING: Zonal Round registrations for Asia Pacific are now OPEN!');

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const switchSite = (siteId) => {
    setCurrentSite(sites[siteId]);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setView={setCurrentView} siteConfig={currentSite} />;
      case 'teams':
        return <TeamsView />;
      case 'technoxian':
        return <TechnoxianView />;
      case 'about':
      case 'governance':
        return <AboutLayout setView={setCurrentView} />;
      case 'associates':
        return <AssociatesView />;
      case 'careers':
        return <CareersView />;
      case 'partners':
        return <HomeView setView={setCurrentView} siteConfig={currentSite} />;
      case 'login':
        return (
          <div className="animate-fadeIn pt-32 pb-20 bg-slate-50 min-h-screen flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Member Login</h2>
              <button
                onClick={() => {
                  setUser({ name: 'John Doe', type: 'member' });
                  setCurrentView('member-dashboard');
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
              >
                Login as Team/Member
              </button>
            </div>
          </div>
        );
      case 'staff-login':
        return <AdminLoginView setView={setCurrentView} setUser={setUser} />;
      case 'member-dashboard':
        return <MemberDashboard user={user} />;
      case 'admin-dashboard':
        return <AdminView setSites={setSites} sites={sites} setView={setCurrentView} />;
      default:
        if (currentView.startsWith('news-list-')) {
          const type = currentView.replace('news-list-', '');
          return <NewsListView type={type} setView={setCurrentView} />;
        }
        if (currentView.startsWith('news-')) {
          const articleId = parseInt(currentView.split('-')[1]);
          return <NewsArticleView articleId={articleId} setView={setCurrentView} />;
        }
        return <HomeView setView={setCurrentView} siteConfig={currentSite} />;
    }
  };

  return (
    <div
      className={`font-sans antialiased text-slate-900 bg-white min-h-screen flex flex-col ${
        currentSite.is_partner ? 'selection:bg-emerald-100 selection:text-emerald-900' : 'selection:bg-blue-100 selection:text-blue-900'
      }`}
    >
      <LiveTicker tickerText={tickerText} siteConfig={currentSite} />
      <Navigation
        setView={setCurrentView}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        siteConfig={currentSite}
        user={user}
      />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <AIReferee siteConfig={currentSite} />
      <Footer setView={setCurrentView} switchSite={switchSite} currentSite={currentSite} />
    </div>
  );
}

