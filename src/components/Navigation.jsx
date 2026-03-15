import { useState } from 'react';
import { Trophy, Menu, X, User, Home, LogOut, Star } from 'lucide-react';
import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { pathWithLocationPrefix } from '../utils/locationRoutes';
import { partnerLogout, clearPartnerAuth } from '../utils/api';
import { clearAuthToken } from '../api/authToken';

const Navigation = ({ setView, toggleMobileMenu, isMobileMenuOpen, siteConfig, user, setUser, locationPrefix = '' }) => {
  const theme = useThemeClasses();
  const location = useLocation();
  const [isDashMenuOpen, setIsDashMenuOpen] = useState(false);
  const path = (p) => pathWithLocationPrefix(locationPrefix, p);
  const handleDashboardClick = () => {
    if (!user) {
      setView('login');
      return;
    }
    setIsDashMenuOpen((prev) => !prev);
  };

  const goHome = () => {
    setIsDashMenuOpen(false);
    setView(user?.type === 'admin' ? 'admin-dashboard' : 'member-dashboard');
  };

  const logout = async () => {
    setIsDashMenuOpen(false);
    const isMember = user?.type === 'member';
    const token = user?.token;
    try {
      if (token) {
        await partnerLogout(token);
      }
    } catch (_) {
      // still clear local session on logout API failure
    } finally {
      if (isMember) {
        clearAuthToken();
      }
      if (token) {
        clearPartnerAuth();
      }
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
          {(
            <div className="relative group">
              <button onClick={() => setView('about')} className="hover:text-white transition-colors py-2 flex items-center gap-1">
                {(locationPrefix || siteConfig.is_partner) ? 'About' : 'About Worso'}
              </button>
            </div>
          )}
         
          <Link to={path('/membership')}>Membership</Link>
          {/* <Link to={path('/roboclub')} className="flex gap-2 items-center">
            <Star size={14} className={location.pathname.endsWith('/roboclub') ? 'text-yellow-400' : 'text-yellow-500'} /> roboclub
          </Link> */}

          <button onClick={() => setView('teams')} className="hover:text-white transition-colors">
            Teams / Players
          </button>
          
          <button onClick={() => setView('technoxian')} className="hover:text-white transition-colors flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            {siteConfig.is_partner ? 'Local Events' : 'WRC Challenges'}
          </button>
          {/* {!siteConfig.is_partner && (
            <button onClick={() => setView('partners')} className="hover:text-white transition-colors">
              Partners
            </button>
          )} */}

          <div className="relative">
            <button
              onClick={handleDashboardClick}
              className={`${theme.bgPrimary || siteConfig.colors.primary} text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 normal-case tracking-normal text-sm hover:-translate-y-0.5`}
            >
              <User size={14} />
              {user ? 'My Dashboard' : 'Member Login'}
            </button>
            {user && isDashMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-3 text-slate-200 overflow-hidden">
                <div className={`text-[11px] uppercase font-bold ${theme.textLight || 'text-blue-200'} mb-2 px-1`}>Quick Actions</div>
                <button
                  onClick={goHome}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center gap-2 transition-colors"
                >
                  <Home size={14} /> Home
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-600/15 flex items-center gap-2 text-red-400 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
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
              <button onClick={closeAnd(() => setView('about'))} className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors">
                {(locationPrefix || siteConfig.is_partner) ? 'About' : 'About Worso'}
              </button>
              <Link to={path('/membership')} onClick={closeAnd()} className="px-6 py-4 hover:bg-white/5 hover:text-white transition-colors">
                Membership
              </Link>
              <button onClick={closeAnd(() => setView('teams'))} className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors">
                Teams / Players
              </button>
              <button onClick={closeAnd(() => setView('technoxian'))} className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
                <Trophy className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                {siteConfig.is_partner ? 'Local Events' : 'WRC Challenges'}
              </button>
              <div className="mt-4 pt-4 border-t border-white/10 px-6">
                <button
                  onClick={closeAnd(user ? goHome : () => setView('login'))}
                  className={`${theme.bgPrimary || siteConfig.colors.primary} text-white w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2`}
                >
                  <User size={16} />
                  {user ? 'My Dashboard' : 'Member Login'}
                </button>
                {user && (
                  <div className="mt-3 space-y-1">
                    <button onClick={closeAnd(goHome)} className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/5 text-slate-300 flex items-center gap-2 text-sm">
                      <Home size={14} /> Dashboard Home
                    </button>
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

