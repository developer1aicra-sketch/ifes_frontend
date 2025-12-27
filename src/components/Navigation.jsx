import { useState } from 'react';
import { Trophy, Menu, X, User, Home, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';


const Navigation = ({ setView, toggleMobileMenu, isMobileMenuOpen, siteConfig, user, setUser }) => {
  const [isDashMenuOpen, setIsDashMenuOpen] = useState(false);

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

  const logout = () => {
    setIsDashMenuOpen(false);
    setUser?.(null);
    setView('home');
  };

  return (
    <nav className="sticky top-0 z-40 transition-all duration-300 bg-[#0f172a] border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <img
            src={logo}
            alt="WORSO Logo"
            className="h-12 w-auto object-contain"
          />

          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none text-white tracking-wide">{siteConfig.logo_text}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-1">{siteConfig.sub_text}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 font-bold text-[11px] uppercase tracking-widest text-slate-300">
          {!siteConfig.is_partner && (
            <div className="relative group">
              <button onClick={() => setView('governance')} className="hover:text-white transition-colors py-2 flex items-center gap-1">
                About Worso
              </button>
            </div>
          )}
          <Link to="/shop">Shop</Link>
          <button onClick={() => setView('teams')} className="hover:text-white transition-colors">
            Teams / Players
          </button>
          <button onClick={() => setView('technoxian')} className="hover:text-white transition-colors flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            {siteConfig.is_partner ? 'Local Events' : 'Technoxian Games'}
          </button>
          {!siteConfig.is_partner && (
            <button onClick={() => setView('partners')} className="hover:text-white transition-colors">
              Partners
            </button>
          )}

          <div className="relative">
            <button
              onClick={handleDashboardClick}
              className={`${siteConfig.colors.primary} text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 normal-case tracking-normal text-sm hover:-translate-y-0.5`}
            >
              <User size={14} />
              {user ? 'My Dashboard' : 'Member Login'}
            </button>
            {user && isDashMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-3 text-slate-200 overflow-hidden">
                <div className="text-[11px] uppercase font-bold text-blue-200 mb-2 px-1">Quick Actions</div>
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

        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;

