import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import './App.css';

import LiveTicker from './components/LiveTicker';
import Navigation from './components/Navigation';
import AIReferee from './components/AIReferee';
import Footer from './components/Footer';

import HomeView from './views/HomeView';
import JoinWorsoView from './views/JoinWorsoView';
import AssociationsListView from './views/AssociationsListView';
import AboutLayout from './views/AboutLayout';
import TeamsView from './views/TeamsView';
import CareersView from './views/CareersView';
import MemberLoginView from './views/MemberLoginView';
import SuperAdminLoginView from './views/SuperAdminLoginView';
import PartnerAdminLoginView from './views/PartnerAdminLoginView';
import MemberDashboard from './views/MemberDashboard';
import AdminLoginView from './views/AdminLoginView';
import TechnoxianView from './views/TechnoxianView';
import AdminView from './views/AdminView';
import NewsArticleView from './views/NewsArticleView';
import NewsListView from './views/NewsListView';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import TermsOfUseView from './views/TermsOfUseView';
import MembershipView from './views/MembershipView'; // ✅ NEW

import { DEFAULT_SITES, NEWS_ITEMS } from './constants/data';
import { styles } from './styles/inlineStyles';
import { fetchTechnoxianFeed } from './utils/rss';
import { StoreView } from './views/StoreView';
import RoboClubView from './views/RoboClubView';

const viewToPath = (view) => {
  if (!view) return '/';

  if (view.startsWith('news-list-')) {
    const type = view.replace('news-list-', '');
    if (type === 'headline') return '/news/headline';
    if (type === 'latest') return '/news/latest';
    if (type === 'most') return '/news/most';
  }

  if (view.startsWith('news-')) {
    const id = view.replace('news-', '');
    return `/news/${id}`;
  }

  switch (view) {
    case 'home':
      return '/';
    case 'teams':
      return '/teams';
    case 'technoxian':
      return '/technoxian';
    case 'about':
    case 'governance':
      return '/governance';
    case 'associates':
      return '/associates';
    case 'join-worso':
      return '/associates/join-worso';
    case 'associations-list':
      return '/associates/list';
    case 'careers':
      return '/careers';
    case 'partners':
      return '/partners';
    case 'login':
      return '/login';
    case 'staff-login':
      return '/staff-login';
    case 'login-super-admin':
      return '/login-super-admin';
    case 'login-partner-admin':
      return '/login-partner-admin';
    case 'member-dashboard':
      return '/member-dashboard';
    case 'admin-dashboard':
      return '/admin-dashboard';
    case 'privacy-policy':
      return '/privacy-policy';
    case 'terms-of-use':
      return '/terms-of-use';
    case 'compare-membership': // ✅ NEW
      return '/compare-membership';
    default:
      return '/';
  }
};

const NewsArticleRoute = (props) => {
  const { id } = useParams();
  return <NewsArticleView articleId={id} {...props} />;
};

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sites, setSites] = useState(DEFAULT_SITES);
  const [currentSite, setCurrentSite] = useState(DEFAULT_SITES.global);
  const [user, setUser] = useState(null);
  const [tickerText] = useState(
    'BREAKING: Zonal Round registrations for Asia Pacific are now OPEN!'
  );
  const [newsItems, setNewsItems] = useState(NEWS_ITEMS);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const switchSite = (siteId) => {
    setCurrentSite(sites[siteId]);
    navigate('/');
    window.scrollTo(0, 0);
  };

  const setView = (view) => {
    const path = viewToPath(view);
    navigate(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    let mounted = true;

    const loadFeed = async () => {
      setNewsLoading(true);
      try {
        const latest = await fetchTechnoxianFeed();
        if (mounted && latest.length > 0) {
          setNewsItems(latest);
          setNewsError('');
        }
      } catch {
        if (mounted) {
          setNewsError('Unable to load latest Technoxian news right now.');
        }
      } finally {
        if (mounted) {
          setNewsLoading(false);
        }
      }
    };

    loadFeed();
    const interval = setInterval(loadFeed, 60_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const newsProps = useMemo(
    () => ({
      newsItems,
      newsLoading,
      newsError,
      setView,
    }),
    [newsItems, newsLoading, newsError]
  );

  return (
    (void motion),
    <div
      className={`font-sans antialiased text-slate-900 bg-white min-h-screen flex flex-col ${
        currentSite.is_partner
          ? 'selection:bg-emerald-100 selection:text-emerald-900'
          : 'selection:bg-blue-100 selection:text-blue-900'
      }`}
    >
      <LiveTicker tickerText={tickerText} siteConfig={currentSite} />
      <Navigation
        setView={setView}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        siteConfig={currentSite}
        user={user}
        setUser={setUser}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full"
          >
            <Routes location={location}>
              <Route path="/" element={<HomeView setView={setView} siteConfig={currentSite} {...newsProps} />} />
              <Route path="/teams" element={<TeamsView />} />
              <Route path="/technoxian" element={<TechnoxianView />} />
              <Route path="/roboclub" element={<RoboClubView />} />

              <Route path="/governance" element={<AboutLayout setView={setView} />} />
              <Route path="/associates/join-worso" element={<JoinWorsoView />} />
              <Route path="/associates/list" element={<AssociationsListView />} />
              <Route path="/careers" element={<CareersView />} />
              <Route path="/partners" element={<HomeView setView={setView} siteConfig={currentSite} {...newsProps} />} />
        {/* <Route path="/shop" element={<StoreView />} /> */}
        

              <Route path="/membership" element={<MembershipView setView={setView} />} /> {/* ✅ NEW */}

              <Route path="/login" element={<MemberLoginView setView={setView} setUser={setUser} siteConfig={currentSite} />} />
              <Route path="/staff-login" element={<AdminLoginView setView={setView} setUser={setUser} />} />
              <Route path="/login-super-admin" element={<SuperAdminLoginView setView={setView} setUser={setUser} siteConfig={currentSite} />} />
              <Route path="/login-partner-admin" element={<PartnerAdminLoginView setView={setView} setUser={setUser} siteConfig={currentSite} />} />

              <Route path="/member-dashboard" element={<MemberDashboard currentSite={currentSite} setView={setView} />} />
              <Route path="/admin-dashboard" element={<AdminView setSites={setSites} sites={sites} setView={setView} defaultMode={user?.role} />} />

              <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
              <Route path="/terms-of-use" element={<TermsOfUseView />} />

              <Route path="/news" element={<NewsListView type="latest" {...newsProps} />} />
              <Route path="/news/headline" element={<NewsListView type="headline" {...newsProps} />} />
              <Route path="/news/latest" element={<NewsListView type="latest" {...newsProps} />} />
              <Route path="/news/most" element={<NewsListView type="most" {...newsProps} />} />
              <Route path="/news/:id" element={<NewsArticleRoute {...newsProps} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <AIReferee siteConfig={currentSite} />
      <Footer setView={setView} switchSite={switchSite} currentSite={currentSite} />
    </div>
  );
};

export default App;
