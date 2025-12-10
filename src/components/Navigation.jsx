import { useState } from 'react';
import { ChevronRight, Trophy, Menu, X, User, Home, LogOut } from 'lucide-react';

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
        <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors ${siteConfig.colors.primary}`}>
          {siteConfig.is_partner ? 'T' : 'W'}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-none text-white tracking-wide">{siteConfig.logo_text}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-1">{siteConfig.sub_text}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 font-bold text-[11px] uppercase tracking-widest text-slate-300">
        {!siteConfig.is_partner && (
          <div className="relative group">
            <button className="hover:text-white transition-colors py-2 flex items-center gap-1">
              About Worso <ChevronRight size={10} className="rotate-90" />
            </button>
            <div className="absolute top-full left-0 w-48 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
              <button onClick={() => setView('about')} className="block w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5">
                Vision & Strategy
              </button>
              <button onClick={() => setView('careers')} className="block w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5">
                Careers
              </button>
              <button onClick={() => setView('associates')} className="block w-full text-left px-4 py-3 hover:bg-white/5">
                Associates
              </button>
            </div>
          </div>
        )}
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
            <div className="absolute right-0 mt-2 w-40 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl p-2 text-slate-300">
              <button onClick={goHome} className="w-full text-left px-3 py-2 rounded hover:bg-white/5 flex items-center gap-2">
                <Home size={14} /> Home
              </button>
              <button onClick={logout} className="w-full text-left px-3 py-2 rounded hover:bg-red-600/20 flex items-center gap-2 text-red-600">
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

