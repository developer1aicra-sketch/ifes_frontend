import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import './App.css';

import { LiveTicker } from './components/LiveTicker';
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
import { ABOUT_PAGE_ROUTES } from './views/about/aboutPageRoutes';
import TeamsView from './views/TeamsView';
// import CareersView from './views/CareersView';
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
import BecomePartnerView from './views/BecomePartnerView';
import PartnersView from './views/PartnersView';

import { DEFAULT_SITES, NEWS_ITEMS } from './constants/data';
import { styles } from './styles/inlineStyles';
import { fetchTechnoxianFeed } from './utils/rss';
import { pathWithLocationPrefix, getPartnerPortalPath } from './utils/locationRoutes';
import { getPartnerAuth } from './utils/api';
import { getAuthToken, clearAuthToken } from './api/authToken';
import { getMyMembership } from './app/membership/membershipApi';
import { useLocationPrefix } from './hooks/useLocationPrefix';
import { useEffectiveLocationPrefix } from './hooks/useEffectiveLocationPrefix';
import { StoreView } from './views/StoreView';
import RoboClubAuth from './views/RoboClubAuth';
import RoboClubDashboard from './views/RoboClub';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay';

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
    // Canonical route for the Technoxian/Challenges page.
    // Some UI parts still use the legacy "technoxian" view key.
    case 'challenges':
      return '/challenges';
    case 'technoxian':
      return '/challenges';
    case 'about':
      return '/about';
    case 'governance':
      return '/about/mission-vision';
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
    case 'partner-with-us':
      return '/partner-with-us';
    case 'login':
    case 'member-login':
      return '/member/login';
    case 'staff-login':
      return '/staff-login';
    case 'login-partner-admin':
    case 'partner-login':
      return '/partner/login';
    case 'member-dashboard':
      return '/member/portal';
    case 'admin-dashboard':
    case 'partner-dashboard':
      return '/partner/portal';
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
  const { id, locationCode } = useParams();
  return <NewsArticleView articleId={id} locationCode={locationCode || null} {...props} />;
};

const GovernanceLocationRedirect = () => {
  const { locationCode } = useParams();
  return <Navigate to={`/${locationCode}/about/mission-vision`} replace />;
};

const getPartnerSession = () => {
  const stored = getPartnerAuth();
  if (!stored?.token || !stored?.partner) return null;
  return stored;
};
const isPartnerAuthenticated = () => Boolean(getPartnerSession());
/** Member portal: only when member token exists */
const isMemberAuthenticated = () => {
  return Boolean(getAuthToken());
};

const MemberLoginRoute = ({ user, setView, setUser, currentSite, locationPrefix }) => {
  const portalPath = pathWithLocationPrefix(locationPrefix || '', '/member/portal');
  return isMemberAuthenticated()
    ? <Navigate to={portalPath} replace />
    : <MemberLoginView setView={setView} setUser={setUser} siteConfig={currentSite} user={user} />;
};

const PartnerLoginRoute = ({ user, setView, setUser, currentSite, locationPrefix }) => {
  const session = getPartnerSession();
  const portalPath = session?.partner?.partnerCode
    ? getPartnerPortalPath(session.partner.partnerCode)
    : pathWithLocationPrefix(locationPrefix || '', '/partner/portal');
  return isPartnerAuthenticated()
    ? <Navigate to={portalPath} replace />
    : <PartnerAdminLoginView setView={setView} setUser={setUser} siteConfig={currentSite} user={user} />;
};

/** Bare /partner/portal: redirect to /:partnerCode/partner/portal when authenticated, else /partner/login */
const PartnerPortalBareRoute = () => {
  const session = getPartnerSession();
  const partnerCode = session?.partner?.partnerCode;
  if (partnerCode) {
    return <Navigate to={getPartnerPortalPath(partnerCode)} replace />;
  }
  return <Navigate to="/partner/login" replace />;
};

const MemberPortalRoute = ({ user, currentSite, setView, setUser, locationPrefix }) => {
  if (!isMemberAuthenticated()) {
    const loginPath = pathWithLocationPrefix(locationPrefix || '', '/member/login');
    return <Navigate to={loginPath} replace />;
  }
  const memberUser = user?.type === 'member' ? user : { type: 'member', email: user?.email };
  return <MemberDashboard user={memberUser} currentSite={currentSite} setView={setView} setUser={setUser} />;
};

const PartnerPortalRoute = ({ user, setSites, sites, setView, setUser, locationPrefix }) => {
  const session = getPartnerSession();
  if (!session) {
    const loginPath = pathWithLocationPrefix(locationPrefix || '', '/partner/login');
    return <Navigate to={loginPath} replace />;
  }
  const partnerUser = user?.role === 'partner'
    ? user
    : {
        type: 'admin',
        role: 'partner',
        email: session.partner.contactEmail ?? session.email,
        token: session.token,
        partner: session.partner,
      };
  return <AdminView setSites={setSites} sites={sites} setView={setView} defaultMode={partnerUser?.role} user={partnerUser} setUser={setUser} />;
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

  // Restore member session from token so "Member Login" stays hidden and /login redirects after refresh
  useEffect(() => {
    if (user) return;
    const token = getAuthToken();
    if (!token) return;
    let mounted = true;
    getMyMembership()
      .then((res) => {
        if (!mounted) return;
        setUser({ type: 'member', email: res?.data?.email });
      })
      .catch((err) => {
        if (!mounted) return;
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          clearAuthToken();
          setUser(null);
        }
      });
    return () => { mounted = false; };
  }, []);

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

  const setView = (view, options) => {
    let path = viewToPath(view);
    if ((view === 'admin-dashboard' || view === 'partner-dashboard') && user?.partner?.partnerCode) {
      path = getPartnerPortalPath(user.partner.partnerCode) || path;
    }
    navigate(path, options);
    window.scrollTo(0, 0);
  };
  // Used by AppContent when on a location route to prefix paths
  const setViewWithPrefix = (view, locationPrefix, options) => {
    const path = viewToPath(view);
    const targetPath = pathWithLocationPrefix(locationPrefix || '', path);
    navigate(targetPath, options);
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
          // setNewsError('Unable to load latest Technoxian news right now.');
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
  newsProps,
  location,
  sites,
  setSites,
}) => {
  const { themeConfig } = useTheme();
  const { locationPrefix } = useLocationPrefix();
  const effectiveLocationPrefix = useEffectiveLocationPrefix(currentSite);
  const hideGlobalChrome = useMemo(() => {
    const path = (location?.pathname || '').toLowerCase();
    // RoboClub and partner portal pages have their own layout;
    // member portal (MemberDashboard) is a dedicated shell — hide global chrome.
    const isMemberPortal =
      path === '/member/portal' || path.endsWith('/member/portal');
    return (
      path.includes('roboclub') ||
      path.endsWith('/partner/portal') ||
      isMemberPortal
    );
  }, [location?.pathname]);
  const setViewRespectingLocation = useCallback(
    (view, options) =>
      effectiveLocationPrefix
        ? setViewWithPrefix(view, effectiveLocationPrefix, options)
        : setView(view, options),
    [effectiveLocationPrefix, setViewWithPrefix, setView]
  );
  const newsPropsWithPrefix = useMemo(
    () => ({ ...newsProps, setView: setViewRespectingLocation }),
    [newsProps, setViewRespectingLocation]
  );

  const getSelectionClasses = () => {
    if (!themeConfig) {
      return 'selection:bg-blue-500/25 selection:text-slate-100';
    }
    const themeSelectionMap = {
      emerald: 'selection:bg-emerald-500/25 selection:text-emerald-100',
      blue: 'selection:bg-blue-500/25 selection:text-slate-100',
      red: 'selection:bg-red-500/25 selection:text-red-100',
      purple: 'selection:bg-purple-500/25 selection:text-purple-100',
      orange: 'selection:bg-orange-500/25 selection:text-orange-100',
      yellow: 'selection:bg-yellow-500/25 selection:text-yellow-100',
    };
    return themeSelectionMap[themeConfig.theme] || themeSelectionMap.blue;
  };

  return (
    <ToastProvider>
      <div
        className={`font-sans antialiased text-slate-200 bg-[#0a0f1a] min-h-screen flex flex-col ${getSelectionClasses()}`}
      >
        <ToastContainer />
        <GlobalLoadingOverlay />
        <PartnerWebsiteRedirect />
      <LocationRouteHandler />
      {/* <LiveTicker tickerText={tickerText} siteConfig={currentSite} /> */}
      {!hideGlobalChrome && (
        <Navigation
          setView={setViewRespectingLocation}
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
          siteConfig={currentSite}
          user={user}
          setUser={setUser}
        />
      )}

      <main className="flex-grow w-full overflow-x-hidden">
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
              <Route path="/challenges" element={<TechnoxianView />} />
              <Route
                path="/roboclub"
                element={
                  <RoboClubDashboard
                    setView={setViewRespectingLocation}
                    switchSite={switchSite}
                    currentSite={currentSite}
                  />
                }
              />
              <Route path="/roboclub-login" element={<RoboClubAuth />} />
              <Route path="/roboclub-dashboard" element={<RoboClubDashboard mode="dashboard" />} />

              <Route path="/about" element={<AboutLayout setView={setViewRespectingLocation} />}>
                <Route index element={<Navigate to="about-worso" replace />} />
                {ABOUT_PAGE_ROUTES.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<Navigate to="about-worso" replace />} />
              </Route>
              <Route path="/governance" element={<Navigate to="/about/mission-vision" replace />} />
              <Route path="/associates/join-worso" element={<JoinWorsoView />} />
              <Route path="/associates/list" element={<AssociationsListView />} />
              {/* <Route path="/careers" element={<CareersView />} /> */}
              <Route path="/partners" element={<PartnersView />} />
              <Route path="/partner-with-us" element={<BecomePartnerView />} />
        {/* <Route path="/shop" element={<StoreView />} /> */}
        

              <Route path="/membership" element={<MembershipView setView={setViewRespectingLocation} />} /> {/* ✅ NEW */}

              <Route path="/member/login" element={<MemberLoginRoute user={user} setView={setViewRespectingLocation} setUser={setUser} currentSite={currentSite} locationPrefix={locationPrefix} />} />
              <Route path="/login" element={<Navigate to="/member/login" replace />} />
              <Route path="/staff-login" element={<AdminLoginView setView={setViewRespectingLocation} setUser={setUser} user={user} />} />
              <Route path="/partner/login" element={<PartnerLoginRoute user={user} setView={setViewRespectingLocation} setUser={setUser} currentSite={currentSite} locationPrefix={locationPrefix} />} />
              <Route path="/login-partner-admin" element={<Navigate to="/partner/login" replace />} />

              <Route path="/member/portal" element={<MemberPortalRoute user={user} currentSite={currentSite} setView={setViewRespectingLocation} setUser={setUser} locationPrefix={locationPrefix} />} />
              <Route path="/member-dashboard" element={<Navigate to="/member/portal" replace />} />
              {/* Partner portal: bare /partner/portal redirects; canonical route is /:partnerCode/partner/portal */}
              <Route path="/partner/portal" element={<PartnerPortalBareRoute />} />
              <Route path="/admin-dashboard" element={<Navigate to="/partner/portal" replace />} />

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
              <Route path="/:locationCode/challenges" element={<TechnoxianView />} />
              <Route
                path="/:locationCode/roboclub"
                element={
                  <RoboClubDashboard
                    setView={setViewRespectingLocation}
                    switchSite={switchSite}
                    currentSite={currentSite}
                  />
                }
              />
              <Route path="/:locationCode/roboclub-dashboard" element={<RoboClubDashboard mode="dashboard" />} />
              <Route path="/:locationCode/about" element={<AboutLayout setView={setViewRespectingLocation} />}>
                <Route index element={<Navigate to="about-worso" replace />} />
                {ABOUT_PAGE_ROUTES.map(({ path, Component }) => (
                  <Route key={`loc-${path}`} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<Navigate to="about-worso" replace />} />
              </Route>
              <Route path="/:locationCode/governance" element={<GovernanceLocationRedirect />} />
              <Route path="/:locationCode/associates/join-worso" element={<JoinWorsoView />} />
              <Route path="/:locationCode/associates/list" element={<AssociationsListView />} />
              {/* <Route path="/:locationCode/careers" element={<CareersView />} /> */}
              <Route path="/:locationCode/partners" element={<PartnersView />} />
              <Route path="/:locationCode/partner-with-us" element={<BecomePartnerView />} />
              <Route path="/:locationCode/member/login" element={<MemberLoginRoute user={user} setView={setViewRespectingLocation} setUser={setUser} currentSite={currentSite} locationPrefix={locationPrefix} />} />
              <Route path="/:locationCode/login" element={<Navigate to={pathWithLocationPrefix(locationPrefix, '/member/login')} replace />} />
              <Route path="/:locationCode/staff-login" element={<AdminLoginView setView={setViewRespectingLocation} setUser={setUser} user={user} />} />
              <Route path="/:locationCode/partner/login" element={<PartnerLoginRoute user={user} setView={setViewRespectingLocation} setUser={setUser} currentSite={currentSite} locationPrefix={locationPrefix} />} />
              <Route path="/:locationCode/login-partner-admin" element={<Navigate to={pathWithLocationPrefix(locationPrefix, '/partner/login')} replace />} />
              <Route path="/:locationCode/member/portal" element={<MemberPortalRoute user={user} currentSite={currentSite} setView={setViewRespectingLocation} setUser={setUser} />} />
              <Route path="/:locationCode/member-dashboard" element={<Navigate to={pathWithLocationPrefix(locationPrefix, '/member/portal')} replace />} />
              {/* Canonical partner portal: /:partnerCode/partner/portal (partnerCode = locationCode) */}
              <Route path="/:locationCode/partner/portal" element={<PartnerPortalRoute user={user} setSites={setSites} sites={sites} setView={setViewRespectingLocation} setUser={setUser} locationPrefix={locationPrefix} />} />
              <Route path="/:locationCode/admin-dashboard" element={<Navigate to={pathWithLocationPrefix(locationPrefix, '/partner/portal')} replace />} />
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
      {!hideGlobalChrome && (
        <Footer
          setView={setViewRespectingLocation}
          locationPrefix={locationPrefix}
          switchSite={switchSite}
          currentSite={currentSite}
        />
      )}
      </div>
    </ToastProvider>
  );
};

export default App;
