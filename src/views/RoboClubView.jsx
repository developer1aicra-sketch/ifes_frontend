import React, { useState } from 'react';
import {
  Trophy, Users, Calendar, Settings, LogOut, Globe,
  Cpu, Activity, Lock, Unlock, ChevronRight, MapPin,
  Menu, X, Wallet, Shield, AlertTriangle, CheckCircle,
  FileText, Award, Zap, Download, Share2, Building2,
  BadgeCheck, UserCheck, Eye, Briefcase, GraduationCap,
  Edit2, MessageSquare, MessageCircle, Video, VideoOff, Mic, MicOff, PhoneOff, ScreenShare, Plus as PlusIcon,
  Send,
  Search
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import {INITIAL_DB} from '../../src/constants/userData'
import  LiveTicker  from '../components/LiveTicker';
import { StadiumHomeView } from '../views/StadiumHomeView';
import { ChampionshipDetail } from '../components/ChampionshipDetail';
import { SquadManager } from '../components/SquadManager';
import { StudentPassport } from '../components/StudentPassport';
// import MembershipPage from './MemberShip';
import { EventsPage } from '../components/EventsPage';
import { Dashboard } from '../components/Dashboard';
import { CommunityForum } from '../components/CommunityForum';
import { AdminConsole } from '../components/AdminConsole';
import MemberShipDetails from '../components/MemberShipDetails';

export default function RoboClubView() {
  const [page, setPage] = useState('home');
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Simulated Verify Action
  const handleVerify = (claimId) => {
    alert("Verification Successful! Team is now eligible for NRC.");
  };

  const menuItems = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'membership', icon: Award, label: 'Membership' },
    { id: 'events', icon: Calendar, label: 'Events & Games' },
    { id: 'squad_manager', icon: Users, label: 'Squad Manager' },
    { id: 'user', icon: UserCheck, label: 'User', action: () => setPage('user') },
    { id: 'community', icon: MessageSquare, label: 'Community' },
  ];

  if (viewMode === 'admin') {
    menuItems.push({ id: 'admin', icon: Shield, label: 'Admin Console' });
  }

  // --- Public Layout (Home & Championship Detail) ---
  if (page === 'home' || page === 'championship_detail') {
    return (
      <div className="min-h-screen bg-black text-slate-200 font-sans">
        {/* <LiveTicker news={INITIAL_DB.ticker_news} /> */}

        {page === 'home' && <StadiumHomeView setPage={setPage} />}
        {page === 'championship_detail' && <ChampionshipDetail setPage={setPage} />}
      </div>
    );
  }

  // --- Private Layout (Dashboard & Admin) ---
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <NavLink to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic">
            TECHNOXIAN
          </NavLink>
          <p className="text-slate-500 text-xs tracking-widest mt-1">FEDERATION PORTAL</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.action ? item.action() : setPage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${page === item.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Role Switcher */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <p className="text-[10px] text-slate-500 uppercase font-bold px-2">Role Switcher</p>
          <div className="flex space-x-1 bg-slate-800 p-1 rounded">
            <button
              onClick={() => setViewMode('user')}
              className={`flex-1 py-1 text-xs rounded ${viewMode === 'user' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
            >
              User
            </button>
            <button
              onClick={() => { setViewMode('admin'); setPage('admin') }}
              className={`flex-1 py-1 text-xs rounded ${viewMode === 'admin' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <img src={INITIAL_DB.currentUser.avatar} alt="User" className="w-10 h-10 rounded-full bg-slate-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{INITIAL_DB.currentUser.full_name}</p>
              <p className="text-xs text-slate-500 truncate">{INITIAL_DB.currentUser.tx_id}</p>
            </div>
            <button onClick={() => setPage('home')} className="text-red-400 hover:text-red-300">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <LiveTicker news={INITIAL_DB.ticker_news} />

        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span className="uppercase font-bold tracking-wider">{INITIAL_DB.club.name}</span>
            <ChevronRight size={14} />
            <span className="text-white capitalize">{page.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-4">
            {viewMode === 'admin' && (
              <span className="text-red-500 text-xs font-bold animate-pulse">ADMIN MODE ACTIVE</span>
            )}
          </div>
        </header> 

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {page === 'dashboard' && <Dashboard setPage={setPage} />}
          {page === 'squad_manager' && <SquadManager setPage={setPage} user={INITIAL_DB.currentUser} />}
          {page === 'user' && <StudentPassport setPage={setPage} />}
          {page === 'membership' && <MemberShipDetails setPage={setPage}/>}
          {page === 'events' && <EventsPage events={INITIAL_DB.events} />}
          {page === 'admin' && <AdminConsole onVerify={handleVerify} />}
          {page === 'community' && <CommunityForum />}
        </div>
      </main>
    </div>
  );
}