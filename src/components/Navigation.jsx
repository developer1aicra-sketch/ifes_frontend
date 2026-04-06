import { useState, useEffect } from 'react';
import { Trophy, Menu, X, User, LogOut, Star, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { pathWithLocationPrefix } from '../utils/locationRoutes';
import { useEffectiveLocationPrefix } from '../hooks/useEffectiveLocationPrefix';
import { usePartnerAboutMegaMenuItems } from '../hooks/usePartnerAboutMegaMenuItems';
import { partnerLogout, clearPartnerAuth, getPartnerAuth } from '../utils/api';
import { clearAuthToken, getAuthToken } from '../api/authToken';
import { AboutWorsoDesktopMegaMenu, AboutWorsoMobileLinks } from './AboutWorsoMegaMenu';

const Navigation = ({ setView, toggleMobileMenu, isMobileMenuOpen, siteConfig, user, setUser }) => {
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false);
  const theme = useThemeClasses();
  const location = useLocation();
  const effectiveLocationPrefix = useEffectiveLocationPrefix(siteConfig);
  const path = (p) => pathWithLocationPrefix(effectiveLocationPrefix, p);
  const { isRegionalChapter, partnerTabs, loading: partnerAboutNavLoading } =
    usePartnerAboutMegaMenuItems(effectiveLocationPrefix);
  const partnerSession = getPartnerAuth();
  const isPartnerAuthenticated = Boolean(partnerSession?.token && partnerSession?.partner);
  /** Member portal: when member token exists */
  const isMemberAuthenticated = Boolean(getAuthToken());
  const isMemberPortalActive =
    location.pathname === '/member/portal' || location.pathname.endsWith('/member/portal');
  const isPartnerPortalActive =
    location.pathname === '/partner/portal' || location.pathname.endsWith('/partner/portal');
  const activePortalButtonClass = 'bg-blue-600 ring-2 ring-blue-300/80 border-blue-300/70';

  const openMemberPortal = () => {
    if (!isMemberAuthenticated) {
      setView('member-login');
      return;
    } 
    setUser?.((prev) => (prev?.type === 'member' ? prev : { type: 'member', email: prev?.email }));
    setView('member-dashboard');
  };

  const openPartnerPortal = () => {
    if (!isPartnerAuthenticated) {
      setView('partner-login');
      return;
    }
    setUser?.({
      type: 'admin',
      role: 'partner',
      email: partnerSession.partner.contactEmail ?? partnerSession.email,
      token: partnerSession.token,
      partner: partnerSession.partner,
    });
    setView('partner-dashboard');
  };

  const logout = async () => {
    const shouldLogoutPartner = Boolean(partnerSession?.token) && user?.type !== 'member';
    const shouldLogoutMember = Boolean(getAuthToken()) && !shouldLogoutPartner;
    try {
      if (shouldLogoutPartner && partnerSession?.token) {
        await partnerLogout(partnerSession.token);
      }
    } catch {
      // still clear local session on logout API failure
    } finally {
      if (shouldLogoutMember) clearAuthToken();
      if (shouldLogoutPartner) clearPartnerAuth();
      setUser?.(null);
      setView('home');
    }
  };
  if (
    location.pathname === '/roboclub' ||
    location.pathname === '/login' ||
    location.pathname.endsWith('/roboclub') ||
    location.pathname.endsWith('/login')
  ) {
    return null;
  }
  const closeAnd = (fn) => () => {
    toggleMobileMenu?.();
    fn?.();
  };

  useEffect(() => {
    if (!isMobileMenuOpen) setAboutMobileOpen(false);
  }, [isMobileMenuOpen]);

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.bgGradient || 'bg-[#0a0f1a]'} border-b border-white/10`}>
      <div className="container mx-auto px-4 sm:px-6 py-2 md:py-2.5 flex justify-between items-center max-w-[1600px]">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0" onClick={() => setView('home')}>
          <img
            src={logo}
            alt="WORSO Logo"
            className="h-10 w-auto object-contain sm:h-12"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base sm:text-xl leading-none text-white tracking-wide truncate">{siteConfig.logo_text}</span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-0.5 sm:mt-1">{siteConfig.sub_text}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-[11px] uppercase tracking-widest text-slate-300">
          <div className="relative group/about">
            <button
              type="button"
              onClick={() => setView('about')}
              className="hover:text-white transition-colors py-2 flex items-center gap-1 text-inherit"
            >
              {(effectiveLocationPrefix || siteConfig.is_partner) ? 'About' : 'About Worso'}
              <ChevronDown
                size={14}
                className="opacity-70 shrink-0 transition-transform duration-200 group-hover/about:rotate-180"
                aria-hidden
              />
            </button>
            <AboutWorsoDesktopMegaMenu
              pathWithPrefix={path}
              pathname={location.pathname}
              search={location.search}
              siteConfig={siteConfig}
              isRegionalChapter={isRegionalChapter}
              partnerTabs={partnerTabs}
              partnerNavLoading={partnerAboutNavLoading}
            />
          </div>
         
          <Link to={path('/membership')}>Membership</Link>
          <Link to={path('/roboclub')} className="flex gap-2 items-center">
            <Star size={14} className={location.pathname.endsWith('/roboclub') ? 'text-yellow-400' : 'text-yellow-500'} /> roboclub
          </Link>

          {/* <button onClick={() => setView('teams')} className="hover:text-white transition-colors">
            Teams / Players
          </button> */}
          
          <Link to={path('/challenges')} className="hover:text-white transition-colors flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            {siteConfig.is_partner ? 'Local Events' : 'Challenges'}
          </Link>
          <Link to={path('/partner-with-us')} className="hover:text-white transition-colors">
            Become a Partner
          </Link>
          {/* {!siteConfig.is_partner && (
            <button onClick={() => setView('partners')} className="hover:text-white transition-colors">
              Partners
            </button>
          )} */}

          <div className="flex items-center gap-2">
            <button
              onClick={openMemberPortal}
              className={`flex items-center gap-1.5 text-[10px] py-2 px-2.5 rounded transition-colors hover:text-white ${
                isMemberPortalActive
                  ? `text-white ${activePortalButtonClass}`
                  : 'text-slate-300'
              }`}
            >
              <User size={12} />
              {isMemberAuthenticated ? 'Member Portal' : 'Member Login'}
            </button>
            <button
              onClick={openPartnerPortal}
              className={`flex items-center gap-1.5 text-[10px] py-2 px-2.5 rounded transition-colors hover:text-white ${
                isPartnerPortalActive
                  ? `text-white ${activePortalButtonClass}`
                  : 'text-slate-300'
              }`}
            >
              <User size={12} />
              {isPartnerAuthenticated ? 'Partner Portal' : 'Partner Login'}
            </button>
          </div>
        </div>

        <button className="md:hidden text-white p-2 -m-2 touch-manipulation" onClick={toggleMobileMenu} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu overlay + panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleMobileMenu} aria-hidden="true" />
          <div className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-sm ${theme.bgGradient || 'bg-[#0a0f1a]'} border-l border-white/10 shadow-2xl overflow-y-auto`}>
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <span className="text-white font-bold text-sm uppercase">Menu</span>
              <button className="text-white p-2 -m-2" onClick={toggleMobileMenu} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col py-4 font-bold text-[11px] uppercase tracking-widest text-slate-300">
              <button
                type="button"
                onClick={() => setAboutMobileOpen((o) => !o)}
                className={`text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between gap-2 ${
                  aboutMobileOpen ? 'bg-white/5 text-white' : ''
                }`}
                aria-expanded={aboutMobileOpen}
              >
                <span>{(effectiveLocationPrefix || siteConfig.is_partner) ? 'About' : 'About Worso'}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 opacity-80 transition-transform ${aboutMobileOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {aboutMobileOpen && (
                <div className="px-4 pb-2">
                  <AboutWorsoMobileLinks
                    pathWithPrefix={path}
                    pathname={location.pathname}
                    search={location.search}
                    siteConfig={siteConfig}
                    isRegionalChapter={isRegionalChapter}
                    partnerTabs={partnerTabs}
                    onNavigate={closeAnd()}
                  />
                </div>
              )}
              <Link to={path('/membership')} onClick={closeAnd()} className="px-6 py-4 hover:bg-white/5 hover:text-white transition-colors">
                Membership
              </Link>
              <button onClick={closeAnd(() => setView('teams'))} className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors">
                Teams / Players
              </button>
              <Link
                to={path('/challenges')}
                onClick={closeAnd()}
                className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
              >
                <Trophy className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                {siteConfig.is_partner ? 'Local Events' : 'WRC Challenges'}
              </Link>
              <Link to={path('/partner-with-us')} onClick={closeAnd()} className="px-6 py-4 hover:bg-white/5 hover:text-white transition-colors">
                Become a Partner
              </Link>
              <div className="mt-4 pt-4 border-t border-white/10 px-6">
                <button
                  onClick={closeAnd(openMemberPortal)}
                  className={`text-white w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 ${
                    isMemberPortalActive
                      ? activePortalButtonClass
                      : `${theme.bgPrimary || siteConfig.colors.primary}`
                  }`}
                >
                  <User size={16} />
                  {isMemberAuthenticated ? 'Member Portal' : 'Member Login'}
                </button>
                <button
                  onClick={closeAnd(openPartnerPortal)}
                  className={`text-white w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 mt-3 border ${
                    isPartnerPortalActive
                      ? activePortalButtonClass
                      : 'bg-slate-700/70 border-slate-500/50'
                  }`}
                >
                  <User size={16} />
                  {isPartnerAuthenticated ? 'Partner Portal' : 'Partner Login'}
                </button>
                {(isMemberAuthenticated || isPartnerAuthenticated) && (
                  <div className="mt-3 space-y-1">
                    <button onClick={closeAnd(logout)} className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-600/15 text-red-400 flex items-center gap-2 text-sm">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

