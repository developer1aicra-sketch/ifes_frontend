import React, { useState, useMemo, useEffect } from 'react';
import {
  Trophy, Users, Calendar, CalendarClock, Settings, LogOut, Globe,
  Cpu, Activity, Lock, Unlock, ChevronRight, MapPin,
  Menu, X, Wallet, Shield, AlertTriangle, CheckCircle,
  FileText, Award, Zap, Download, Share2, Building2,
  BadgeCheck, UserCheck, Eye, Briefcase, GraduationCap,
  Edit2, MessageSquare, MessageCircle, Video, VideoOff, Mic, MicOff, PhoneOff, ScreenShare, Plus as PlusIcon,
  Send,
  Search,
  QrCode
} from 'lucide-react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { INITIAL_DB } from '../../src/constants/userData'
import { getMyClubs } from '../api/clubApi';
import { clearRoboclubAuthToken, getRoboclubAuthToken } from '../api/authToken';
// import { getMyMembership } from '../api/membershipApi';
import { LiveTicker } from '../components/LiveTicker';
import { StadiumHome } from '../components/StadiumHome';
import { ChampionshipDetail } from '../components/ChampionshipDetail';
import { SquadManager } from '../components/SquadManager';
import { StudentPassport } from '../components/StudentPassport';
// import MembershipPage from './MemberShip';
import { EventsPage } from '../components/EventsPage';
import { Dashboard } from '../components/Dashboard';
import { CommunityForum } from '../components/CommunityForum';
import { AdminConsole } from '../components/AdminConsole';
import MemberShipDetails from '../components/MemberShipDetails';
import MySquads from '../components/MySquads.jsx';
import StudentIdCard from '../components/StudentIdCard';
import GlobalYoungInnovatorsDirectory from '../components/GlobalYoungInnovatorsDirectory';
import StudentCommunityDirectory from '../components/StudentCommunityDirectory';
import DiyOffers from '../components/DiyOffers';
import CareerGrowth from '../components/CareerGrowth';
import TechConferences from '../components/TechConferences';
import { MakeYourBotSchedule } from '../components/MakeYourBotSchedule';

export default function TechnoXianApp({ mode = 'public' }) {
  const [page, setPage] = useState('home');
  const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [membershipPlanName, setMembershipPlanName] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingEditSquad, setPendingEditSquad] = useState(null);
  const [pendingCompetitionId, setPendingCompetitionId] = useState(null);
  const [pendingEventType, setPendingEventType] = useState(null);
  const [sidebarDisplayName, setSidebarDisplayName] = useState(INITIAL_DB.currentUser.full_name);
  const [sidebarSecondaryId, setSidebarSecondaryId] = useState(INITIAL_DB.currentUser.tx_id);
  const [clubProfile, setClubProfile] = useState(null);
  const [isContactDirectoryOpen, setIsContactDirectoryOpen] = useState(false);
  const [isDiyOffersOpen, setIsDiyOffersOpen] = useState(false);
  const [diyOffersSection, setDiyOffersSection] = useState('kits');
  const [isCareerGrowthOpen, setIsCareerGrowthOpen] = useState(false);
  const [careerGrowthSection, setCareerGrowthSection] = useState('internships');
  const [isNationalGlobalEventsOpen, setIsNationalGlobalEventsOpen] = useState(false);
  const [nationalGlobalEventsSection, setNationalGlobalEventsSection] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    try {
      const raw = localStorage.getItem('roboclub.desktopSidebarOpen');
      return raw == null ? true : raw === 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('roboclub.desktopSidebarOpen', String(isDesktopSidebarOpen));
    } catch {
      // ignore storage write failures (private mode / blocked storage)
    }
  }, [isDesktopSidebarOpen]);

  const isAuthenticated = !!getRoboclubAuthToken();
  const isDashboardMode = mode === 'dashboard';

  // When navigated with state.editSquad (e.g. from /squad ClubDetail Edit), open Squad Manager in edit mode
  useEffect(() => {
    const editSquad = location.state?.editSquad;
    if (editSquad?.clubId && editSquad?.teamId) {
      setPendingEditSquad(editSquad);
      setPendingCompetitionId(null);
      setPendingEventType(null);
      setPage('squad_manager');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.editSquad?.clubId, location.state?.editSquad?.teamId]);

  // From EventsPage: open Apply Championship with selected competition and/or event type.
  // Consume both in one effect to avoid them clobbering each other.
  useEffect(() => {
    const registerCompetitionId = location.state?.registerCompetitionId;
    const registerEventType = location.state?.registerEventType;
    if (!registerCompetitionId && !registerEventType) return;

    setPendingEditSquad(null);
    if (registerCompetitionId) {
      setPendingCompetitionId(registerCompetitionId);
    }
    if (registerEventType) {
      setPendingEventType(String(registerEventType).toUpperCase());
    }
    // If only eventType is provided, ensure competitionId is cleared.
    if (!registerCompetitionId && registerEventType) {
      setPendingCompetitionId(null);
    }

    setPage('squad_manager');
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state?.registerCompetitionId, location.state?.registerEventType]);

  useEffect(() => {
    if (isDashboardMode && !isAuthenticated) {
      // If the user is not authenticated while in dashboard mode,
      // always send them back to the public home experience.
      navigate('/', { replace: true });
    }
  }, [isDashboardMode, isAuthenticated, navigate]);

  // Decode JWT token (if present) to extract user role
  useEffect(() => {
    if (!isAuthenticated) {
      setUserRole(null);
      setMembershipPlanName(null);
      return;
    }

    try {
      const token = getRoboclubAuthToken();
      if (!token) {
        setUserRole(null);
        setMembershipPlanName(null);
        return;
      }

      const parts = token.split('.');
      if (parts.length < 2) {
        setUserRole(null);
        return;
      }

      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = atob(base64);
      const payload = JSON.parse(payloadJson);

      const roleFromToken = payload.role || payload.user?.role || null;
      setUserRole(roleFromToken);
    } catch (err) {
      console.error('Failed to decode JWT for role:', err);
      setUserRole(null);
    }
  }, [isAuthenticated]);

  // Load current user's membership plan for gating premium-only features
  useEffect(() => {
    if (!isDashboardMode || !isAuthenticated) {
      setMembershipPlanName(null);
      return;
    }

    let cancelled = false;

    // getMyMembership()
    //   .then((res) => {
    //     if (cancelled) return;
    //     const payload = res?.data;
    //     const membership = payload?.data ?? payload;
    //     const planName = membership?.planName || null;
    //     setMembershipPlanName(planName);
    //   })
    //   .catch((err) => {
    //     console.error('Failed to load membership for dashboard gating:', err);
    //     setMembershipPlanName(null);
    //   });

    return () => {
      cancelled = true;
    };
  }, [isDashboardMode, isAuthenticated]);

  // Load sidebar profile info from /club/my/get when authenticated dashboard is active
  useEffect(() => {
    if (!isDashboardMode || !isAuthenticated) return;

    let cancelled = false;

    getMyClubs()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data?.data ?? res?.data ?? [];
        const primaryClub = Array.isArray(list) ? list[0] : null;
        if (!primaryClub) return;

        setClubProfile(primaryClub);

        const displayNameFromApi =
          primaryClub?.owner?.fullName ||
          primaryClub?.member?.user?.fullName ||
          primaryClub?.member?.fullName ||
          primaryClub?.fullName ||
          primaryClub?.clubName ||
          primaryClub?.club_name ||
          primaryClub?.name;

        if (displayNameFromApi) {
          setSidebarDisplayName(displayNameFromApi);
        }

        const secondaryIdFromApi =
          primaryClub?.clubCode ||
          primaryClub?.club_code ||
          primaryClub?.tx_id;

        if (secondaryIdFromApi) {
          setSidebarSecondaryId(secondaryIdFromApi);
        }
      })
      .catch((err) => {
        console.error('Failed to load sidebar profile from /club/my/get:', err);
      });

    return () => {
      cancelled = true; 
    };
  }, [isDashboardMode, isAuthenticated]);

  const captainName =
    clubProfile?.owner?.fullName ||
    clubProfile?.member?.user?.fullName ||
    clubProfile?.member?.fullName ||
    clubProfile?.fullName ||
    sidebarDisplayName ||
    'Captain';

  const sidebarName = captainName;
  const sidebarId =
    clubProfile?.clubCode ||
    clubProfile?.club_code ||
    clubProfile?.tx_id ||
    sidebarSecondaryId;
  const clubName = clubProfile?.clubName || clubProfile?.club_name || clubProfile?.club || clubProfile?.name || INITIAL_DB.club.name;

  const menuItems = useMemo(() => {
    const items = [
      { id: 'dashboard', icon: Activity, label: 'Dashboard' },
      { id: 'make_your_bot', icon: CalendarClock, label: 'Make Your Bot' },
      { id: 'national_global_events', icon: Calendar, label: 'Events & Games', isSection: true },
      { id: 'Add Members', icon: Award, label: 'Add Members' },
      { id: 'squad_manager', icon: Users, label: 'Squad Manager' },
      // { id: 'student_id', icon: QrCode, label: 'Student Card' },
      { id: 'diy_offers', icon: Zap, label: 'Offers', isSection: true },
      { id: 'career_growth', icon: Briefcase, label: 'Career Growth', isSection: true },
      { id: 'contact_directory', icon: Globe, label: 'Contact Directory', isSection: true },
      // { id: 'my_squads', icon: Users, label: 'My Squads' },
      { id: 'user', icon: UserCheck, label: 'Club Profile', action: () => setPage('user') },
      // { id: 'community', icon: MessageSquare, label: 'Community' },
    ];
    if (viewMode === 'admin') {
      items.push({ id: 'admin', icon: Shield, label: 'Admin Console' });
    }

    // Restrict certain sections for MEMBER role
    if (userRole === 'MEMBER') {
      return items.filter(
        (item) => item.id !== 'Add Members' && item.id !== 'squad_manager'
      );
    }

    return items;
  }, [viewMode, userRole]);

  const handleLogout = () => {
    clearRoboclubAuthToken();
    setPage('home');
    // Ensure the URL also returns to the public home route
    navigate('/', { replace: true });
  };

  const handleVerify = (claimId) => {
    alert("Verification Successful! Team is now eligible for NRC.");
  };

  // --- Public layout: always for /roboclub ---
  if (!isDashboardMode) {
    return (
      <div className="min-h-screen bg-black text-slate-200 font-sans">
        {page === 'championship_detail' ? (
          <ChampionshipDetail setPage={setPage} />
        ) : (
          <StadiumHome setPage={setPage} isAuthenticated={isAuthenticated} />
        )}
      </div>
    );
  }

  // If trying to access dashboard without auth, redirect handled above
  // and render nothing here to avoid flicker
  if (!isAuthenticated) {
    return null;
  }

  // --- Private layout: sidebar + dashboard section (only after successful login) ---
  const baseActivePage = page === 'home' || page === 'championship_detail' ? 'dashboard' : page;

  // Prevent MEMBER role from landing on restricted pages even via direct navigation
  const restrictedForMember = new Set(['Add Members', 'squad_manager']);
  const activePage =
    userRole === 'MEMBER' && restrictedForMember.has(baseActivePage)
      ? 'dashboard'
      : baseActivePage;

  const activePageTitle =
    menuItems.find((item) => item.id === activePage)?.label ??
    activePage.replace(/_/g, ' ');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <div
        className={`bg-slate-900 hidden md:flex flex-col overflow-hidden transition-[width] duration-300 ${
          isDesktopSidebarOpen
            ? 'w-64 border-r border-slate-800'
            : 'w-0 border-r-0'
        }`}
      >
        {isDesktopSidebarOpen && (
          <>
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-3">
              <div>
                <NavLink to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic">
                  TECHNOXIAN
                </NavLink>
                <p className="text-slate-500 text-xs tracking-widest mt-1">FEDERATION PORTAL</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDesktopSidebarOpen(false)}
                className="p-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 focus:outline-none"
                aria-label="Hide sidebar"
                title="Hide sidebar"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                if (item.id === 'diy_offers') {
                  const isChildActive =
                    activePage === 'diy_offers' &&
                    (diyOffersSection === 'kits' ||
                      diyOffersSection === 'tools' ||
                      diyOffersSection === 'workshops');
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => setIsDiyOffersOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                          isChildActive || isDiyOffersOpen
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center space-x-3">
                          <item.icon size={18} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            isDiyOffersOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isDiyOffersOpen && (
                        <div className="pl-8 space-y-1">
                          <button
                            onClick={() => {
                              setPage('diy_offers');
                              setDiyOffersSection('kits');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'diy_offers' && diyOffersSection === 'kits'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Robotics Kits
                          </button>
                          <button
                            onClick={() => {
                              setPage('diy_offers');
                              setDiyOffersSection('tools');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'diy_offers' && diyOffersSection === 'tools'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Access Advanced Tools
                          </button>
                          <button
                            onClick={() => {
                              setPage('diy_offers');
                              setDiyOffersSection('workshops');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'diy_offers' && diyOffersSection === 'workshops'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Premium Workshops
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.id === 'career_growth') {
                  const isChildActive =
                    activePage === 'career_growth' &&
                    (careerGrowthSection === 'internships' ||
                      careerGrowthSection === 'priority');
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => setIsCareerGrowthOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                          isChildActive || isCareerGrowthOpen
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center space-x-3">
                          <item.icon size={18} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            isCareerGrowthOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isCareerGrowthOpen && (
                        <div className="pl-8 space-y-1">
                          <button
                            onClick={() => {
                              setPage('career_growth');
                              setCareerGrowthSection('internships');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'career_growth' && careerGrowthSection === 'internships'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Internship Listings
                          </button>
                          <button
                            onClick={() => {
                              setPage('career_growth');
                              setCareerGrowthSection('priority');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'career_growth' && careerGrowthSection === 'priority'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Priority Internships
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.id === 'national_global_events') {
                  const isChildActive =
                    activePage === 'national_global_events' &&
                    (nationalGlobalEventsSection === 'all' ||
                      nationalGlobalEventsSection === 'conferences');

                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => setIsNationalGlobalEventsOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                          isChildActive || isNationalGlobalEventsOpen
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center space-x-3">
                          <item.icon size={18} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            isNationalGlobalEventsOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {isNationalGlobalEventsOpen && (
                        <div className="pl-8 space-y-1">
                          <button
                            onClick={() => {
                              setPage('national_global_events');
                              setNationalGlobalEventsSection('all');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'national_global_events' && nationalGlobalEventsSection === 'all'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            All Events & Competitions
                          </button>
                          {/* <button
                            onClick={() => {
                              setPage('national_global_events');
                              setNationalGlobalEventsSection('conferences');
                            }}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'national_global_events' && nationalGlobalEventsSection === 'conferences'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Tech Conferences
                          </button> */}
                        </div>
                      )}
                    </div>
                  );
                }

                if (item.id === 'contact_directory') {
                  const isChildActive =
                    activePage === 'global_young_innovators' ||
                    activePage === 'student_community';
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => setIsContactDirectoryOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                          isChildActive || isContactDirectoryOpen
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center space-x-3">
                          <item.icon size={18} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </span>
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${
                            isContactDirectoryOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isContactDirectoryOpen && (
                        <div className="pl-8 space-y-1">
                          <button
                            onClick={() => setPage('global_young_innovators')}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'global_young_innovators'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Global Young Innovators Directory
                          </button>
                          <button
                            onClick={() => setPage('student_community')}
                            className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all duration-200 ${
                              activePage === 'student_community'
                                ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            Student Community Directory
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => (item.action ? item.action() : setPage(item.id))}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activePage === item.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Role Switcher */}
            <div className="p-4 border-t border-slate-800 space-y-2 hidden">
              {/* <p className="text-[10px] text-slate-500 uppercase font-bold px-2">Role Switcher</p> */}
              <div className="space-x-1 bg-slate-800 p-1 rounded hidden">
                {/* <button
                  onClick={() => setViewMode('user')}
                  className={`flex-1 py-1 text-xs rounded ${viewMode === 'user' ? 'bg-slate-600 text-white' : 'text-slate-400'}`}
                >
                  User
                </button> */}
                {/* <button
                  onClick={() => { setViewMode('admin'); setPage('admin') }}
                  className={`flex-1 py-1 text-xs rounded ${viewMode === 'admin' ? 'bg-red-600 text-white' : 'text-slate-400'}`}
                >
                  Admin
                </button> */}
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <img src={INITIAL_DB.currentUser.avatar} alt="User" className="w-10 h-10 rounded-full bg-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{sidebarName}</p>
                  <p className="text-xs text-slate-500 truncate">{sidebarId}</p>
                </div>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300" title="Log out">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 focus:outline-none"
            >
              <Menu size={18} />
            </button>
            <NavLink
              to="/"
              className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic"
            >
              TECHNOXIAN
            </NavLink>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 font-medium"
          >
            Logout
          </button>
        </header>

        {/* Live ticker just below top bar */}
        <LiveTicker news={INITIAL_DB.ticker_news} />

        {/* Desktop header */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 items-center justify-between px-6 sticky top-0 z-40 hidden md:flex">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            {!isDesktopSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsDesktopSidebarOpen(true)}
                className="p-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 focus:outline-none"
                aria-label="Show sidebar"
                title="Show sidebar"
              >
                <Menu size={18} />
              </button>
            )}
            {/* <span className="uppercase font-bold tracking-wider">{clubName}</span> */}
            <span className="text-white">{activePageTitle}</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* <span className="text-slate-300 text-xs font-semibold truncate max-w-[320px]" title={`Captain ${captainName}`}>
               {captainName}
            </span> */}
            {/* {viewMode === 'admin' && (
              <span className="text-red-500 text-xs font-bold animate-pulse">ADMIN MODE ACTIVE</span>
            )} */}
          </div>
        </header> 

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activePage === 'dashboard' && <Dashboard setPage={setPage} clubProfile={clubProfile} />}
          {activePage === 'squad_manager' && (
            <SquadManager
              setPage={setPage}
              user={INITIAL_DB.currentUser}
              initialEditSquad={pendingEditSquad || location.state?.editSquad}
              onInitialEditSquadConsumed={() => setPendingEditSquad(null)}
              initialCompetitionId={pendingCompetitionId}
              onInitialCompetitionConsumed={() => setPendingCompetitionId(null)}
              initialEventType={pendingEventType}
              onInitialEventTypeConsumed={() => setPendingEventType(null)}
            />
          )}
          {activePage === 'user' && <StudentPassport setPage={setPage} />}
          {activePage === 'Add Members' && <MemberShipDetails setPage={setPage}/>}
          {activePage === 'student_id' && <StudentIdCard />}
          {activePage === 'diy_offers' && (
            <DiyOffers
              activeSection={diyOffersSection}
              membershipPlanName={membershipPlanName}
            />
          )}
          {activePage === 'career_growth' && (
            <CareerGrowth
              activeSection={careerGrowthSection}
              membershipPlanName={membershipPlanName}
            />
          )}
          {activePage === 'my_squads' && <MySquads />}
          {activePage === 'global_young_innovators' && (
            <GlobalYoungInnovatorsDirectory membershipPlanName={membershipPlanName} />
          )}
          {activePage === 'student_community' && (
            <StudentCommunityDirectory />
          )}
          {activePage === 'national_global_events' && (
            nationalGlobalEventsSection === 'conferences'
              ? <TechConferences />
              : <EventsPage events={INITIAL_DB.events} />
          )}
          {activePage === 'make_your_bot' && (
            <MakeYourBotSchedule surfaceClassName="bg-slate-900/70" />
          )}
          {activePage === 'admin' && <AdminConsole onVerify={handleVerify} />}
          {/* {activePage === 'community' && <CommunityForum />} */}
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative h-full w-72 max-w-full bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <NavLink
                  to="/"
                  className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  TECHNOXIAN
                </NavLink>
                <p className="text-slate-500 text-[10px] tracking-widest mt-1">FEDERATION PORTAL</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setPage(item.id);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activePage === item.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <img
                  src={INITIAL_DB.currentUser.avatar}
                  alt="User"
                  className="w-9 h-9 rounded-full bg-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {sidebarName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{sidebarId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}