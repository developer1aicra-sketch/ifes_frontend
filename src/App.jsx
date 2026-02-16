import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import './App.css';

import LiveTicker from './components/LiveTicker';
import Navigation from './components/Navigation';
import AIReferee from './components/AIReferee';
import Footer from './components/Footer';
import LocationRouteHandler from './components/LocationRouteHandler';
import PartnerWebsiteRedirect from './components/PartnerWebsiteRedirect';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import HomeView from './views/HomeView';
import JoinWorsoView from './views/JoinWorsoView';
import AssociationsListView from './views/AssociationsListView';
import AboutLayout from './views/AboutLayout';
import TeamsView from './views/TeamsView';
import CareersView from './views/CareersView';
import MemberLoginView from './views/MemberLoginView';
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
import LocationView from './views/LocationView';

import { DEFAULT_SITES, NEWS_ITEMS } from './constants/data';
import { styles } from './styles/inlineStyles';
import { fetchTechnoxianFeed } from './utils/rss';
import { pathWithLocationPrefix } from './utils/locationRoutes';
import { getPartnerAuth } from './utils/api';
import { useLocationPrefix } from './hooks/useLocationPrefix';
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
      return '/about';
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
    case 'news':
      return '/news';
    case 'partners':
      return '/partners';
    case 'login':
      return '/login';
    case 'staff-login':
      return '/staff-login';
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
  const [user, setUser] = useState(() => {
    const stored = getPartnerAuth();
    if (stored?.token && stored?.partner) {
      return {
        type: 'admin',
        role: 'partner',
        email: stored.partner.contactEmail ?? stored.email,
        token: stored.token,
        partner: stored.partner,
      };
    }
    return null;
  });
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
  // Used by AppContent when on a location route to prefix paths
  const setViewWithPrefix = (view, locationPrefix) => {
    const path = viewToPath(view);
    const targetPath = pathWithLocationPrefix(locationPrefix || '', path);
    navigate(targetPath);
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
    <ThemeProvider>
      <AppContent
        currentSite={currentSite}
        setView={setView}
        setViewWithPrefix={setViewWithPrefix}
        switchSite={switchSite}
        user={user}
        setUser={setUser}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        tickerText={tickerText}
        newsProps={newsProps}
        location={location}
        sites={sites}
        setSites={setSites}
      />
    </ThemeProvider>
  );
};

const AppContent = ({
  currentSite,
  setView,
  setViewWithPrefix,
  switchSite,
  user,
  setUser,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  tickerText,
  newsProps,
  location,
  sites,
  setSites,
}) => {
  const { themeConfig } = useTheme();
  const { locationPrefix } = useLocationPrefix();
  const setViewRespectingLocation = useCallback(
    (view) => (locationPrefix ? setViewWithPrefix(view, locationPrefix) : setView(view)),
    [locationPrefix, setViewWithPrefix, setView]
  );
  const newsPropsWithPrefix = useMemo(
    () => ({ ...newsProps, setView: setViewRespectingLocation }),
    [newsProps, setViewRespectingLocation]
  );

  // Dynamic selection colors based on theme
  const getSelectionClasses = () => {
    if (!themeConfig) {
      return currentSite.is_partner
        ? 'selection:bg-emerald-100 selection:text-emerald-900'
        : 'selection:bg-blue-100 selection:text-blue-900';
    }
    
    const themeSelectionMap = {
      emerald: 'selection:bg-emerald-100 selection:text-emerald-900',
      blue: 'selection:bg-blue-100 selection:text-blue-900',
      red: 'selection:bg-red-100 selection:text-red-900',
      purple: 'selection:bg-purple-100 selection:text-purple-900',
      orange: 'selection:bg-orange-100 selection:text-orange-900',
      yellow: 'selection:bg-yellow-100 selection:text-yellow-900',
    };
    
    return themeSelectionMap[themeConfig.theme] || themeSelectionMap.blue;
  };

  return (
    <ToastProvider>
      <div
        className={`font-sans antialiased text-slate-900 bg-white min-h-screen flex flex-col ${getSelectionClasses()}`}
      >
        <ToastContainer />
        <PartnerWebsiteRedirect />
      <LocationRouteHandler />
      <LiveTicker tickerText={tickerText} siteConfig={currentSite} />
      <Navigation
        setView={setViewRespectingLocation}
        locationPrefix={locationPrefix}
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
              <Route path="/" element={<HomeView setView={setViewRespectingLocation} siteConfig={currentSite} {...newsPropsWithPrefix} />} />
              <Route path="/teams" element={<TeamsView />} />
              <Route path="/technoxian" element={<TechnoxianView />} />
              <Route path="/roboclub" element={<RoboClubView />} />

              <Route path="/about" element={<AboutLayout setView={setViewRespectingLocation} />} />
              <Route path="/governance" element={<AboutLayout setView={setViewRespectingLocation} />} />
              <Route path="/associates/join-worso" element={<JoinWorsoView />} />
              <Route path="/associates/list" element={<AssociationsListView />} />
              <Route path="/careers" element={<CareersView />} />
              <Route path="/partners" element={<HomeView setView={setViewRespectingLocation} siteConfig={currentSite} {...newsPropsWithPrefix} />} />
        {/* <Route path="/shop" element={<StoreView />} /> */}
        

              <Route path="/membership" element={<MembershipView setView={setViewRespectingLocation} />} /> {/* ✅ NEW */}

              <Route path="/login" element={<MemberLoginView setView={setViewRespectingLocation} setUser={setUser} siteConfig={currentSite} />} />
              <Route path="/staff-login" element={<AdminLoginView setView={setViewRespectingLocation} setUser={setUser} user={user} />} />
              <Route path="/login-partner-admin" element={<PartnerAdminLoginView setView={setViewRespectingLocation} setUser={setUser} siteConfig={currentSite} user={user} />} />

              <Route path="/member-dashboard" element={<MemberDashboard currentSite={currentSite} setView={setViewRespectingLocation} />} />
              <Route path="/admin-dashboard" element={<AdminView setSites={setSites} sites={sites} setView={setViewRespectingLocation} defaultMode={user?.role} user={user} setUser={setUser} />} />

              <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
              <Route path="/terms-of-use" element={<TermsOfUseView />} />

              <Route path="/news" element={<NewsListView type="latest" {...newsPropsWithPrefix} />} />
              <Route path="/news/headline" element={<NewsListView type="headline" {...newsPropsWithPrefix} />} />
              <Route path="/news/latest" element={<NewsListView type="latest" {...newsPropsWithPrefix} />} />
              <Route path="/news/most" element={<NewsListView type="most" {...newsPropsWithPrefix} />} />
              <Route path="/news/:id" element={<NewsArticleRoute {...newsPropsWithPrefix} />} />

              {/* Location-prefixed routes: /AE/membership, /AE/teams, etc. - more specific first */}
              <Route path="/:locationCode/membership" element={<MembershipView setView={setViewRespectingLocation} />} />
              <Route path="/:locationCode/teams" element={<TeamsView />} />
              <Route path="/:locationCode/technoxian" element={<TechnoxianView />} />
              <Route path="/:locationCode/roboclub" element={<RoboClubView />} />
              <Route path="/:locationCode/about" element={<AboutLayout setView={setViewRespectingLocation} />} />
              <Route path="/:locationCode/governance" element={<AboutLayout setView={setViewRespectingLocation} />} />
              <Route path="/:locationCode/associates/join-worso" element={<JoinWorsoView />} />
              <Route path="/:locationCode/associates/list" element={<AssociationsListView />} />
              <Route path="/:locationCode/careers" element={<CareersView />} />
              <Route path="/:locationCode/partners" element={<HomeView setView={setViewRespectingLocation} siteConfig={currentSite} {...newsPropsWithPrefix} />} />
              <Route path="/:locationCode/login" element={<MemberLoginView setView={setViewRespectingLocation} setUser={setUser} siteConfig={currentSite} />} />
              <Route path="/:locationCode/staff-login" element={<AdminLoginView setView={setViewRespectingLocation} setUser={setUser} user={user} />} />
              <Route path="/:locationCode/login-partner-admin" element={<PartnerAdminLoginView setView={setViewRespectingLocation} setUser={setUser} siteConfig={currentSite} user={user} />} />
              <Route path="/:locationCode/member-dashboard" element={<MemberDashboard currentSite={currentSite} setView={setViewRespectingLocation} />} />
              <Route path="/:locationCode/admin-dashboard" element={<AdminView setSites={setSites} sites={sites} setView={setViewRespectingLocation} defaultMode={user?.role} user={user} setUser={setUser} />} />
              <Route path="/:locationCode/privacy-policy" element={<PrivacyPolicyView />} />
              <Route path="/:locationCode/terms-of-use" element={<TermsOfUseView />} />
              <Route path="/:locationCode/news" element={<NewsListView type="latest" {...newsPropsWithPrefix} />} />
              <Route path="/:locationCode/news/headline" element={<NewsListView type="headline" {...newsPropsWithPrefix} />} />
              <Route path="/:locationCode/news/latest" element={<NewsListView type="latest" {...newsPropsWithPrefix} />} />
              <Route path="/:locationCode/news/most" element={<NewsListView type="most" {...newsPropsWithPrefix} />} />
              <Route path="/:locationCode/news/:id" element={<NewsArticleRoute {...newsPropsWithPrefix} />} />

              {/* Location home - must be last among location routes */}
              <Route path="/:locationCode" element={<LocationView setView={setViewRespectingLocation} siteConfig={currentSite} {...newsPropsWithPrefix} />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <AIReferee siteConfig={currentSite} />
      <Footer setView={setViewRespectingLocation} locationPrefix={locationPrefix} switchSite={switchSite} currentSite={currentSite} />
      </div>
    </ToastProvider>
  );
};

export default App;
