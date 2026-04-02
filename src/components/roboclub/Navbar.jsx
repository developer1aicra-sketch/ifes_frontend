import React from 'react';
import { Zap, Award } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLocationPrefix } from '../../hooks/useLocationPrefix';
import { pathWithLocationPrefix } from '../../utils/locationRoutes';

const Navbar = ({ onOpenCertificate, onNavigateHome, isAuthenticated }) => {
  const { locationPrefix } = useLocationPrefix();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
    <NavLink to={pathWithLocationPrefix(locationPrefix, '/')} className="flex items-center gap-2 cursor-pointer">
      <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-violet-600 rounded-lg flex items-center justify-center">
        <Zap className="text-white w-5 h-5 fill-current" />
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
        ROBOCLUB<span className="text-cyan-400">.</span>
      </span>
    </NavLink>
   
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
      <button onClick={onNavigateHome} className="hover:text-cyan-400 transition-colors">Home</button>
      <a href="#community" className="hover:text-cyan-400 transition-colors">Community</a>
      <a href="#shop" className="hover:text-cyan-400 transition-colors">Shop</a>
      <a href="#winners" className="hover:text-cyan-400 transition-colors">Champions</a>
    </div>

    <div className="flex items-center gap-4">
      <button
        onClick={onOpenCertificate}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
      >
        <Award className="w-4 h-4 text-yellow-400" />
        <span>Certificate</span>
      </button>

      {isAuthenticated ? (
        <Link
          to={pathWithLocationPrefix(locationPrefix, '/roboclub-dashboard')}
          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all text-sm"
        >
          Open Dashboard
        </Link>
      ) : (
        <Link
          to={pathWithLocationPrefix(locationPrefix, '/roboclub-login')}
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-sm"
        >
          Login
        </Link>
      )}
    </div>
  </nav>
  );
};

export default Navbar;