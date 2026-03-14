import { useEffect, useState } from 'react';
import { Award, Download, LayoutDashboard, Zap, ChevronDown, ChevronUp, Briefcase, Users, Calendar, CalendarClock } from 'lucide-react';
import { getMyClub } from '../app/club/clubApi';
import { getMyMembership } from '../app/membership/membershipApi';
import { useTheme } from '../contexts/ThemeContext';
import { DiyOffers } from '../components/DiyOffers';
import { CareerGrowth } from '../components/CareerGrowth';
import { GlobalYoungInnovatorsDirectory } from '../components/GlobalYoungInnovatorsDirectory';
import { StudentCommunityDirectory } from '../components/StudentCommunityDirectory';
import { EventsPage } from '../components/EventsPage';
import { TechConferences } from '../components/TechConferences';

// Theme-based accent classes for membership card (matches app theme)
const THEME_ACCENT = {
  blue: {
    cardBg: 'bg-[#0f172a]',
    badge: 'bg-blue-500/10 border-blue-400/60 text-blue-300',
    badgeDot: 'bg-blue-400',
    title: 'text-blue-300',
    statusText: 'text-blue-300',
    ring: 'from-blue-400/30 via-blue-500/20 to-blue-600/10',
    sidebarActive: 'bg-white/15 border-blue-400',
    borderLeft: 'border-blue-500',
    iconBg: 'bg-blue-500/15 border-blue-400/40 text-blue-300',
  },
  emerald: {
    cardBg: 'bg-[#022c22]',
    badge: 'bg-emerald-500/10 border-emerald-400/60 text-emerald-300',
    badgeDot: 'bg-emerald-400',
    title: 'text-emerald-300',
    statusText: 'text-emerald-300',
    ring: 'from-emerald-400/30 via-emerald-500/20 to-emerald-600/10',
    sidebarActive: 'bg-white/15 border-emerald-400',
    borderLeft: 'border-emerald-500',
    iconBg: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
  },
  red: {
    cardBg: 'bg-[#7f1d1d]',
    badge: 'bg-red-500/10 border-red-400/60 text-red-300',
    badgeDot: 'bg-red-400',
    title: 'text-red-300',
    statusText: 'text-red-300',
    ring: 'from-red-400/30 via-red-500/20 to-red-600/10',
    sidebarActive: 'bg-white/15 border-red-400',
    borderLeft: 'border-red-500',
    iconBg: 'bg-red-500/15 border-red-400/40 text-red-300',
  },
  purple: {
    cardBg: 'bg-[#3b0764]',
    badge: 'bg-purple-500/10 border-purple-400/60 text-purple-300',
    badgeDot: 'bg-purple-400',
    title: 'text-purple-300',
    statusText: 'text-purple-300',
    ring: 'from-purple-400/30 via-purple-500/20 to-purple-600/10',
    sidebarActive: 'bg-white/15 border-purple-400',
    borderLeft: 'border-purple-500',
    iconBg: 'bg-purple-500/15 border-purple-400/40 text-purple-300',
  },
  orange: {
    cardBg: 'bg-[#7c2d12]',
    badge: 'bg-orange-500/10 border-orange-400/60 text-orange-300',
    badgeDot: 'bg-orange-400',
    title: 'text-orange-300',
    statusText: 'text-orange-300',
    ring: 'from-orange-400/30 via-orange-500/20 to-orange-600/10',
    sidebarActive: 'bg-white/15 border-orange-400',
    borderLeft: 'border-orange-500',
    iconBg: 'bg-orange-500/15 border-orange-400/40 text-orange-300',
  },
  yellow: {
    cardBg: 'bg-[#713f12]',
    badge: 'bg-yellow-500/10 border-yellow-400/60 text-yellow-300',
    badgeDot: 'bg-yellow-400',
    title: 'text-yellow-300',
    statusText: 'text-yellow-300',
    ring: 'from-yellow-400/30 via-yellow-500/20 to-yellow-600/10',
    sidebarActive: 'bg-white/15 border-yellow-400',
    borderLeft: 'border-yellow-500',
    iconBg: 'bg-yellow-500/15 border-yellow-400/40 text-yellow-300',
  },
};

/**
 * Derive display name: user (from login) > club name > fallback.
 * Initials: first 2 letters of display name, or "M" for Member.
 */
const getMemberDisplayName = (user, club) => {
  const name = user?.fullName || user?.name || user?.email || club?.name || '';
  return name.trim() || 'Member';
};

const getMemberInitials = (user, club) => {
  const name = getMemberDisplayName(user, club);
  if (name === 'Member') return 'M';
  const parts = name.replace(/\s+/g, ' ').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase() || 'M';
};

/** Normalize mobile for display: exactly 10 digits (strip country code/whitespace). */
const formatMobileDisplay = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return null;
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 10) return mobile.trim() || null;
  return digits.slice(-10);
};

const MemberDashboard = ({ user, currentSite, setView }) => {
  const { themeConfig } = useTheme();
  const themeKey = themeConfig?.theme || 'blue';
  const accent = THEME_ACCENT[themeKey] || THEME_ACCENT.blue;
  const cardBg = themeConfig?.colors?.gradient || accent.cardBg;
  const [activeTab, setActiveTab] = useState('overview');
  const [diyOpen, setDiyOpen] = useState(false);
  const [diySection, setDiySection] = useState('kits'); // 'kits' | 'tools' | 'workshops'
  const [careerOpen, setCareerOpen] = useState(false);
  const [careerSection, setCareerSection] = useState('internships'); // 'internships' | 'priority'
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [directorySection, setDirectorySection] = useState('global'); // 'global' | 'community'
  const [eventsOpen, setEventsOpen] = useState(false);
  const [eventsSection, setEventsSection] = useState('competitions'); // 'competitions' | 'conferences'
  const [club, setClub] = useState(null);
  const [clubLoading, setClubLoading] = useState(false);
  const [clubError, setClubError] = useState('');
  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipError, setMembershipError] = useState('');

  const memberName = getMemberDisplayName(user, club);
  const memberInitials = getMemberInitials(user, club);
  // Sidebar: show name only (never email); fall back to "Member" if no name available
  const sidebarDisplayName = membership?.user?.fullName || user?.fullName || user?.name || club?.name?.trim() || 'Member';
  const sidebarInitials = (() => {
    const name = membership?.user?.fullName || user?.fullName || user?.name || club?.name?.trim() || '';
    if (!name) return 'M';
    const parts = name.replace(/\s+/g, ' ').trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
    return name.slice(0, 2).toUpperCase() || 'M';
  })();

  useEffect(() => {
    if (activeTab === 'diy-offers') setDiyOpen(true);
    if (activeTab === 'career-growth') setCareerOpen(true);
    if (activeTab === 'contact-directory') setDirectoryOpen(true);
    if (activeTab === 'national-events') setEventsOpen(true);
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;

    const fetchClub = async () => {
      setClubLoading(true);
      setClubError('');
      try {
        const res = await getMyClub();
        const data = res?.data;
        // API shape: { success: true, data: [ { ...club } ] }
        const clubItem = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : null;
        if (isMounted) {
          setClub(clubItem || null);
        }
      } catch (err) {
        if (isMounted) {
          setClubError(err?.response?.data?.message || err?.message || 'Unable to load club details');
        }
      } finally {
        if (isMounted) {
          setClubLoading(false);
        }
      }
    };

    fetchClub();

    const fetchMembership = async () => {
      setMembershipLoading(true);
      setMembershipError('');
      try {
        const res = await getMyMembership();
        const data = res?.data;
        // API shape: { success: true, data: { publicMembershipId, category, planName, ... } }
        const membershipData = data?.data ?? data ?? null;
        if (isMounted) {
          setMembership(membershipData || null);
        }
      } catch (err) {
        if (isMounted) {
          setMembershipError(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to load membership details'
          );
        }
      } finally {
        if (isMounted) {
          setMembershipLoading(false);
        }
      }
    };

    fetchMembership();

    return () => {
      isMounted = false;
    };
  }, []);

  // Refetch membership when user opens Membership or Overview tab (e.g. after login or for fresh data)
  const refetchMembership = (force = false) => {
    if (membershipLoading && !force) return;
    setMembershipError('');
    setMembershipLoading(true);
    getMyMembership()
      .then((res) => {
        const data = res?.data;
        const membershipData = data?.data ?? data ?? null;
        setMembership(membershipData || null);
      })
      .catch((err) => {
        setMembershipError(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to load membership details'
        );
      })
      .finally(() => setMembershipLoading(false));
  };

  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-1 pb-16 pt-24">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-full min-h-[75vh] max-h-[calc(100vh-8rem)]">
          {/* Sidebar – theme gradient, scrollable nav (frontend architecture) */}
          <aside className={`relative w-72 flex-shrink-0 flex flex-col min-h-0 ${cardBg} text-white border-r border-white/10`}>
            {/* Decorative background */}
            <div className={`absolute inset-0 w-72 ${cardBg} pointer-events-none`} aria-hidden />
            {/* Profile header – fixed at top */}
            <div className="relative flex-shrink-0 p-6 pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${themeConfig?.colors?.primary || 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-xl font-bold`}>{sidebarInitials}</div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase text-white/70">Member</div>
                  <div className="font-extrabold truncate" title={sidebarDisplayName}>{sidebarDisplayName}</div>
                </div>
              </div>
            </div>
            {/* Nav list – scrollable when content overflows */}
            <nav
              className="relative flex-1 min-h-0 overflow-y-auto px-6 pb-6 pt-2"
              style={{ scrollbarColor: 'rgba(255,255,255,0.3) #0f172a', scrollbarWidth: 'thin' }}
              aria-label="Member dashboard navigation"
            >
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    refetchMembership(true);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${
                    activeTab === 'overview'
                      ? `${accent.sidebarActive} text-white`
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                  }`}
                >
                  <LayoutDashboard size={18} /> Overview
                </button>
              
                <button
                  onClick={() => {
                    setActiveTab('membership');
                    refetchMembership();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${
                    activeTab === 'membership'
                      ? `${accent.sidebarActive} text-white`
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                  }`}
                >
                  <LayoutDashboard size={18} /> Membership
                </button>

                {/* Class Schedule – coming soon */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTab('class-schedule')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 ${
                      activeTab === 'class-schedule'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <CalendarClock size={18} className={`flex-shrink-0 ${activeTab === 'class-schedule' ? accent.title : 'text-white/70'}`} />
                      <span className="truncate">Class Schedule</span>
                    </span>
                    <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded">
                      Coming soon
                    </span>
                  </button>
                </div>

                {/* DIY Offers – expandable section (theme-aligned) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDiyOpen((prev) => !prev);
                      if (!diyOpen) {
                        setActiveTab('diy-offers');
                        setDiySection('kits');
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 ${
                      activeTab === 'diy-offers'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Zap size={18} className={`flex-shrink-0 ${activeTab === 'diy-offers' ? accent.title : 'text-white/70'}`} />
                      <span>Offers</span>
                    </span>
                    {diyOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {diyOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-white/20 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('diy-offers');
                          setDiySection('kits');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'diy-offers' && diySection === 'kits'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                       DIY Robotics Kits
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('diy-offers');
                          setDiySection('tools');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'diy-offers' && diySection === 'tools'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Access Advanced Tools
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('diy-offers');
                          setDiySection('workshops');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'diy-offers' && diySection === 'workshops'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Premium Workshops
                      </button>
                    </div>
                  )}
                </div>

                {/* Career Growth – expandable section (theme-aligned) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCareerOpen((prev) => !prev);
                      if (!careerOpen) {
                        setActiveTab('career-growth');
                        setCareerSection('internships');
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 ${
                      activeTab === 'career-growth'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Briefcase size={18} className={`flex-shrink-0 ${activeTab === 'career-growth' ? accent.title : 'text-white/70'}`} />
                      <span>Career Growth</span>
                    </span>
                    {careerOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {careerOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-white/20 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('career-growth');
                          setCareerSection('internships');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'career-growth' && careerSection === 'internships'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Internship Listings
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('career-growth');
                          setCareerSection('priority');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'career-growth' && careerSection === 'priority'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Priority Internships
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact Directory – expandable section (theme-aligned) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryOpen((prev) => !prev);
                      if (!directoryOpen) {
                        setActiveTab('contact-directory');
                        setDirectorySection('global');
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 ${
                      activeTab === 'contact-directory'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Users size={18} className={`flex-shrink-0 ${activeTab === 'contact-directory' ? accent.title : 'text-white/70'}`} />
                      <span>Contact Directory</span>
                    </span>
                    {directoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {directoryOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-white/20 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('contact-directory');
                          setDirectorySection('global');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'contact-directory' && directorySection === 'global'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Global Young Innovators
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('contact-directory');
                          setDirectorySection('community');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'contact-directory' && directorySection === 'community'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Student Community Directory
                      </button>
                    </div>
                  )}
                </div>

                {/* National & Global Events – expandable section */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEventsOpen((prev) => !prev);
                      if (!eventsOpen) {
                        setActiveTab('national-events');
                        setEventsSection('competitions');
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 ${
                      activeTab === 'national-events'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Calendar size={18} className={`flex-shrink-0 ${activeTab === 'national-events' ? accent.title : 'text-white/70'}`} />
                      <span>National & Global Events</span>
                    </span>
                    {eventsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {eventsOpen && (
                    <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-white/20 ml-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('national-events');
                          setEventsSection('competitions');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'national-events' && eventsSection === 'competitions'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Upcoming Competitions
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('national-events');
                          setEventsSection('conferences');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'national-events' && eventsSection === 'conferences'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Tech Conferences
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main
            className="flex-1 min-h-0 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'membership' && 'Membership Card'}
                  {activeTab === 'class-schedule' && 'Class Schedule'}
                  {activeTab === 'diy-offers' && 'DIY Offers'}
                  {activeTab === 'career-growth' && 'Career Growth'}
                  {activeTab === 'contact-directory' && 'Contact Directory'}
                  {activeTab === 'national-events' && 'National & Global Events'}
                </h1>
                {/* <div className="text-slate-500">Team: RoboTitans India | ID: W-IND-001</div> */}
              </div>
              <div className="text-sm text-slate-500">Member Portal</div>
            </div>

            <div
              className="flex-1 px-4 py-6 sm:p-8 lg:p-10 overflow-y-auto"
              style={{ scrollbarColor: '#1d4ed8 #f8fafc', scrollbarWidth: 'thin' }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Profile & Membership from GET /membership/my/get */}
                  {membershipLoading && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-500">
                      Loading profile and membership…
                    </div>
                  )}

                  {membershipError && !membershipLoading && (
                    <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm text-sm text-red-600 font-semibold">
                      {membershipError}
                    </div>
                  )}

                  {!membershipLoading && !membershipError && (membership?.user || membership) && (
                    <>
                      {/* Profile card – from API data.user */}
                      {membership?.user && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h2 className="text-lg font-bold text-slate-900 mb-4">Profile</h2>
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-shrink-0">
                              {membership.user.logo ? (
                                <img
                                  src={membership.user.logo}
                                  alt=""
                                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                                />
                              ) : (
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white ${themeConfig?.colors?.primary || 'bg-blue-600'}`}>
                                  {getMemberInitials(membership.user, club)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                              <div>
                                <dt className="text-slate-500">Full name</dt>
                                <dd className="font-semibold text-slate-900">{membership.user.fullName || membership.user.email || '—'}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500">Email</dt>
                                <dd className="font-semibold text-slate-900 break-all">{membership.user.email || '—'}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500">Mobile</dt>
                                <dd className="font-semibold text-slate-900">{formatMobileDisplay(membership.user.mobile) || '—'}</dd>
                              </div>
                              <div>
                                <dt className="text-slate-500">Designation</dt>
                                <dd className="font-semibold text-slate-900 capitalize">{membership.user.designation || '—'}</dd>
                              </div>
                              {membership.user.personalAndShippingAddress && (
                                <>
                                  <div>
                                    <dt className="text-slate-500">City</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.personalAndShippingAddress.city || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-slate-500">State</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.personalAndShippingAddress.state || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-slate-500">Country</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.personalAndShippingAddress.country || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-slate-500">Date of birth</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.personalAndShippingAddress.dob || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-slate-500">Gender</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.personalAndShippingAddress.gender || '—'}</dd>
                                  </div>
                                </>
                              )}
                              {membership.user.affiliation && (membership.user.affiliation.schoolOrCollege || membership.user.affiliation.classOrGrade) && (
                                <>
                                  <div>
                                    <dt className="text-slate-500">School / College</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.affiliation.schoolOrCollege || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-slate-500">Class / Grade</dt>
                                    <dd className="font-semibold text-slate-900">{membership.user.affiliation.classOrGrade || '—'}</dd>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${membership.user.isProfileCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              Profile {membership.user.isProfileCompleted ? 'Completed' : 'Incomplete'}
                            </span>
                            {/* <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${membership.user.hasActiveMembership ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                              {membership.user.hasActiveMembership ? 'Active membership' : 'No active membership'}
                            </span> */}
                            {membership.user.role && (
                              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                                {membership.user.role}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Membership summary – from API data (top-level) */}
                    
                    </>
                  )}

                  {!membershipLoading && !membershipError && !membership?.user && !membership?.publicMembershipId && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-500">
                      No profile or membership data found. Complete signup or contact support.
                    </div>
                  )}

              
                </div>
              )}

            

              {activeTab === 'membership' && (
                <div className="space-y-6">
                  <section className={`${cardBg} text-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-xl relative`}>
                    <div className="absolute inset-0 pointer-events-none" aria-hidden />
                    <div className={`absolute -right-20 -top-32 w-80 h-80 rounded-full bg-gradient-to-br ${accent.ring} blur-3xl pointer-events-none`} aria-hidden />
                    <div className={`absolute -left-10 -bottom-24 w-72 h-72 rounded-full bg-gradient-to-tr ${accent.ring} opacity-60 blur-3xl pointer-events-none`} aria-hidden />

                    <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 space-y-5 sm:space-y-6 min-w-0">
                      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] ${accent.title} uppercase mb-0.5`}>
                            WORSO Membership Card
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400">
                            Digital card with QR verification and membership status.
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full ${accent.badge} px-2.5 sm:px-3 py-1 sm:py-1.5 border text-[10px] sm:text-[11px] font-semibold tracking-wide shrink-0 w-fit`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${accent.badgeDot} animate-pulse`} />
                          {membership?.status || 'VERIFIED'}
                        </span>
                      </header>

                      <div className="grid grid-cols-1 lg:grid-cols-[2.1fr,1fr] gap-5 sm:gap-6 lg:gap-8 items-stretch">
                        <div className="space-y-4 sm:space-y-5 min-w-0">
                          <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] sm:tracking-[0.18em] text-slate-400 uppercase">
                            Technoxian Federation • Digital Card
                          </div>

                          {/* Member photo + name row — stacks cleanly on mobile */}
                          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                            <div className="relative flex-shrink-0">
                              <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${accent.ring} opacity-80`} aria-hidden />
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/30 bg-black/40 flex items-center justify-center overflow-hidden shadow-lg">
                                {membership?.user?.logo ? (
                                  <img
                                    src={membership.user.logo}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xl sm:text-2xl font-bold tracking-wide text-white">
                                    {getMemberInitials(membership?.user || user, club)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-50 truncate" title={membership?.user?.fullName || memberName}>
                                {membership?.user?.fullName || memberName}
                              </h2>
                              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                                {membership?.category || 'Student'}
                              </p>
                              {(membership?.user?.mobile || user?.mobile) && (() => {
                                const raw = membership?.user?.mobile || user?.mobile;
                                const display = formatMobileDisplay(raw);
                                const telDigits = (raw || '').replace(/\D/g, '');
                                return display ? (
                                  <p className="mt-1.5 text-[10px] sm:text-[11px]">
                                    <span className="text-slate-400 uppercase tracking-wide">Mobile</span>
                                    <a
                                      href={`tel:${telDigits}`}
                                      className="ml-1.5 font-mono text-slate-200 break-all hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
                                      title="Tap to call"
                                    >
                                      {display}
                                    </a>
                                  </p>
                                ) : null;
                              })()}
                              <div className="mt-2 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-wide text-slate-200">
                                {membership?.planName || 'Student Basic'}
                              </div>
                            </div>
                          </div>

                          {/* Stat cards — vertical stack on mobile, justified row from sm */}
                          <div className="flex flex-col gap-3 pt-1 sm:pt-2">
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between gap-3 w-full text-xs">
                              <div className="rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 w-full sm:w-auto sm:min-w-[8rem] shrink-0">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                                  Member ID
                                </div>
                                <div className="mt-1 font-mono text-[11px] break-all text-slate-200">
                                  {membership?.publicMembershipId || '—'}
                                </div>
                              </div>
                              <div className="rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 w-full sm:w-auto sm:min-w-[8rem] shrink-0">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                                  Duration
                                </div>
                                <div className="mt-1 font-mono text-[11px] text-slate-200">
                                  {membership?.duration
                                    ? `${membership.duration.value} ${membership.duration.unit}`
                                    : '—'}
                                </div>
                              </div>
                              {/* <div className="rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 w-full sm:w-auto sm:min-w-[8rem] shrink-0">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                                  Price
                                </div>
                                <div className="mt-1 text-[11px] text-slate-200">
                                  {membership?.price
                                    ? `${membership.price.amount} ${membership.price.currency}`
                                    : '—'}
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <aside className="relative bg-black/30 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-w-0 min-h-[10rem]">
                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-slate-400 min-w-0">
                                Since
                                <div className="mt-1 text-[11px] sm:text-xs text-slate-200">
                                  {membership?.startDate
                                    ? new Date(membership.startDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                      })
                                    : '—'}
                                </div>
                              </div>
                              <div className="rounded-xl bg-black/40 border border-white/10 p-2 flex flex-col items-center justify-center gap-0.5 shrink-0">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-black/50 flex items-center justify-center text-[9px] sm:text-[10px] text-white/80">
                                  QR
                                </div>
                                <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wide">
                                  Scan to Verify
                                </div>
                              </div>
                            </div>

                            <div className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
                              Scan the QR code to verify this membership in real time
                              and view linked certificates.
                            </div>

                            <div>
                              <div className="text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-slate-500">
                                Digital Membership
                              </div>
                              <div className="mt-1 text-[10px] sm:text-[11px] text-slate-300">
                                Status:{' '}
                                <span className={`${accent.statusText} font-semibold`}>
                                  {membership?.status || 'Active'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-[9px] sm:text-[10px] text-slate-400">
                            <span className="shrink-0">{membership?.category || 'Student'} Member</span>
                            <span className="text-slate-400 min-w-0 break-words">
                              Valid{' '}
                              <span className="text-slate-200">
                                {membership?.startDate
                                  ? new Date(membership.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : '—'}
                              </span>
                              {' – '}
                              <span className="text-slate-200">
                                {membership?.endDate
                                  ? new Date(membership.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : '—'}
                              </span>
                            </span>
                          </div>
                        </aside>
                      </div>
                    </div>
                  </section>

                  {membershipLoading && (
                    <div className="text-sm text-slate-500">Loading membership details…</div>
                  )}

                  {membershipError && !membershipLoading && (
                    <div className="text-sm text-red-600 font-semibold">
                      {membershipError}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'class-schedule' && (
                <div className={`rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[320px] flex flex-col items-center justify-center p-8 sm:p-12`}>
                  <div className="flex flex-col items-center justify-center text-center max-w-sm">
                    <div className={`w-16 h-16 rounded-2xl ${accent.iconBg} flex items-center justify-center mb-4`}>
                      <CalendarClock size={32} className={accent.title} aria-hidden />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">Class Schedule</h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    Classes will start on 1 March.
                    </p>
                    {/* <span className="mt-5 inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Coming soon
                    </span> */}
                  </div>
                </div>
              )}

              {activeTab === 'diy-offers' && (
                <div className={`rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[400px]`}>
                  <div className="p-6 sm:p-8 lg:p-10">
                    <DiyOffers
                      activeSection={diySection}
                      membershipPlanName={membership?.planName}
                      themeAccent={accent}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'career-growth' && (
                <div className={`rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[400px]`}>
                  <div className="p-6 sm:p-8 lg:p-10">
                    <CareerGrowth
                      activeSection={careerSection}
                      membershipPlanName={membership?.planName}
                      themeAccent={accent}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'contact-directory' && (
                <div className={`rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[400px]`}>
                  <div className="p-6 sm:p-8 lg:p-10">
                    {directorySection === 'global' && (
                      <GlobalYoungInnovatorsDirectory
                        membershipPlanName={membership?.planName}
                        themeAccent={accent}
                      />
                    )}
                    {directorySection === 'community' && (
                      <StudentCommunityDirectory themeAccent={accent} />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'national-events' && (
                <div className={`rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[400px]`}>
                  <div className="p-6 sm:p-8 lg:p-10">
                    {eventsSection === 'competitions' && (
                      <EventsPage themeAccent={accent} />
                    )}
                    {eventsSection === 'conferences' && (
                      <TechConferences themeAccent={accent} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

