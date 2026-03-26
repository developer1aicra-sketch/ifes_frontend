import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Award, Download, LayoutDashboard, Zap, ChevronDown, ChevronUp, Briefcase, Users, Calendar, CalendarClock, Menu, X, Pencil, LogOut } from 'lucide-react';
import { getMyClub } from '../api/clubApi';
import { getMyMembership } from '../app/membership/membershipApi';
import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';
import { updateProfile as updateProfileApi } from '../api/profileApi';
import { useTheme } from '../contexts/ThemeContext';
import { DiyOffers } from '../components/DiyOffers';
import { CareerGrowth } from '../components/CareerGrowth';
import { GlobalYoungInnovatorsDirectory } from '../components/GlobalYoungInnovatorsDirectory';
import { StudentCommunityDirectory } from '../components/StudentCommunityDirectory';
import { EventsPage } from '../components/EventsPage';
import { TechConferences } from '../components/TechConferences';
import { useLogout } from '../hooks/useLogout';

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

const MemberDashboard = ({ user, currentSite, setView, setUser }) => {
  const { themeConfig } = useTheme();
  const { logout } = useLogout({ setUser, setView, type: 'member', redirectView: 'home' });
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
  const [cardDownloading, setCardDownloading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classSchedule, setClassSchedule] = useState(null);
  const [classLoading, setClassLoading] = useState(false);
  const [classError, setClassError] = useState('');
  const [registeringClassId, setRegisteringClassId] = useState(null);
  const [registerSuccessId, setRegisterSuccessId] = useState(null);
  const [registerError, setRegisterError] = useState('');
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    mobile: '',
    dob: '',
    gender: '',
    fullShipingAddress: '',
    city: '',
    state: '',
    pincode: '',
    alternateEmail: '',
    country: '',
    schoolOrCollege: '',
    classOrGrade: '',
    fatherName: '',
    motherName: '',
    skills: '',
    hobbies: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState('');
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const membershipCardRef = useRef(null);

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

  const handleDownloadCard = async () => {
    const el = membershipCardRef.current;
    if (!el || cardDownloading) return;
    setCardDownloading(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });
      const filename = `worso-membership-card-${membership?.publicMembershipId || 'card'}.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Card download failed:', err);
    } finally {
      setCardDownloading(false);
    }
  };

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

  // Initialize profile form from membership user data when available
  useEffect(() => {
    const u = membership?.user;
    if (!u) return;
    const addr = u.personalAndShippingAddress || {};
    const personal = u.personal || {};
    const additional = u.additional || {};
    setProfileForm((prev) => ({
      ...prev,
      fullName: u.fullName || '',
      mobile: u.mobile || '',
      dob: addr.dob || '',
      gender: addr.gender || '',
      fullShipingAddress: addr.fullShipingAddress || addr.addressLine1 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      alternateEmail: addr.alternateEmail || u.alternateEmail || '',
      country: addr.country || '',
      schoolOrCollege: u.affiliation?.schoolOrCollege || '',
      classOrGrade: u.affiliation?.classOrGrade || '',
      fatherName: u.fatherName || personal.fatherName || '',
      motherName: u.motherName || personal.motherName || '',
      skills: Array.isArray(u.skills)
        ? u.skills.join(', ')
        : Array.isArray(additional.skills)
          ? additional.skills.join(', ')
          : u.skills || '',
      hobbies: Array.isArray(u.hobbies)
        ? u.hobbies.join(', ')
        : Array.isArray(additional.hobbies)
          ? additional.hobbies.join(', ')
          : u.hobbies || '',
    }));
  }, [membership]);

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

  const fetchClassSchedule = async () => {
    if (classLoading) return;
    setClassError('');
    setRegisterSuccessId(null);
    setRegisterError('');
    setClassLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.classes.schedule);
      const data = res?.data;
      // Expected shape:
      // { success, todayClasses: [], upcomingClasses: [], dayWise: { ... } }
      setClassSchedule(data || null);
    } catch (err) {
      setClassError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to load class schedule'
      );
      setClassSchedule(null);
    } finally {
      setClassLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (updateProfileError || updateProfileSuccess) {
      setUpdateProfileError('');
      setUpdateProfileSuccess(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (updatingProfile) return;
    setUpdatingProfile(true);
    setUpdateProfileError('');
    setUpdateProfileSuccess(false);

    const toArray = (value) =>
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    const payload = {
      fullName: profileForm.fullName || undefined,
      mobile: profileForm.mobile || undefined,
      personalAndShippingAddress: {
        dob: profileForm.dob || undefined,
        gender: profileForm.gender || undefined,
        fullShipingAddress: profileForm.fullShipingAddress || undefined,
        city: profileForm.city || undefined,
        state: profileForm.state || undefined,
        pincode: profileForm.pincode || undefined,
        alternateEmail: profileForm.alternateEmail || undefined,
        country: profileForm.country || undefined,
      },
      affiliation: {
        schoolOrCollege: profileForm.schoolOrCollege || undefined,
        classOrGrade: profileForm.classOrGrade || undefined,
      },
      personal: {
        fatherName: profileForm.fatherName || undefined,
        motherName: profileForm.motherName || undefined,
      },
      additional: {
        skills: toArray(profileForm.skills || ''),
        hobbies: toArray(profileForm.hobbies || ''),
      },
    };

    try {
      await updateProfileApi(payload);
      setUpdateProfileSuccess(true);
      // Refresh membership/user data so UI reflects latest profile
      refetchMembership(true);
    } catch (err) {
      setUpdateProfileError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to update profile'
      );
    } finally {
      setUpdatingProfile(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'class-schedule' && !classSchedule && !classLoading) {
      fetchClassSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRegisterClass = async (classId) => {
    if (!classId || registeringClassId) return;
    setRegisterSuccessId(null);
    setRegisterError('');
    const resolvedClassId = classId;
    setRegisteringClassId(resolvedClassId);
    try {
      await axiosInstance.post(endpoints.classes.register, {
        class_id: resolvedClassId,
      });
      setRegisterSuccessId(resolvedClassId);
    } catch (err) {
      setRegisterError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to register for this class'
      );
    } finally {
      setRegisteringClassId(null);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 flex-1 pb-12 sm:pb-16 pt-20 sm:pt-24">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-8rem)]">
          {/* Backdrop for mobile/tablet drawer */}
          {sidebarOpen && (
            <button
              type="button"
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              aria-label="Close menu"
            />
          )}
          {/* Sidebar – theme gradient, drawer on mobile/tablet, inline on desktop */}
          <aside
            className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-72 max-w-[85vw] flex-shrink-0 flex flex-col min-h-0 ${cardBg} text-white border-r border-white/10 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
          >
            {/* Decorative background */}
            <div className={`absolute inset-0 w-full ${cardBg} pointer-events-none`} aria-hidden />
            {/* Profile header – fixed at top; close button on mobile/tablet */}
            <div className="relative flex-shrink-0 p-4 sm:p-6 pb-2 flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 ${themeConfig?.colors?.primary || 'bg-blue-600'} rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold`}>{sidebarInitials}</div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase text-white/70">Member</div>
                  <div className="font-extrabold truncate text-sm sm:text-base" title={sidebarDisplayName}>{sidebarDisplayName}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSidebar}
                className="lg:hidden p-2 -m-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {/* Nav list – scrollable when content overflows */}
            <nav
              className="relative flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-6 pt-2"
              style={{ scrollbarColor: 'rgba(255,255,255,0.3) #0f172a', scrollbarWidth: 'thin' }}
              aria-label="Member dashboard navigation"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    refetchMembership(true);
                    closeSidebar();
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
                    activeTab === 'overview'
                      ? `${accent.sidebarActive} text-white`
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                  }`}
                >
                  <LayoutDashboard size={18} className="flex-shrink-0" /> Profile
                </button>
              
                <button
                  onClick={() => {
                    setActiveTab('membership');
                    refetchMembership();
                    closeSidebar();
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
                    activeTab === 'membership'
                      ? `${accent.sidebarActive} text-white`
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                  }`}
                >
                  <LayoutDashboard size={18} className="flex-shrink-0" /> Membership
                </button>

                {/* Class Schedule – coming soon */}
                <div className="relative">
                  {/* <button
                    type="button"
                    onClick={() => { setActiveTab('class-schedule'); closeSidebar(); }}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 text-sm sm:text-base ${
                      activeTab === 'class-schedule'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <CalendarClock size={18} className={`flex-shrink-0 ${activeTab === 'class-schedule' ? accent.title : 'text-white/70'}`} />
                      <span className="truncate">Make Your Bot</span>
                    </span>
                   
                  </button> */}
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
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 text-sm sm:text-base ${
                      activeTab === 'diy-offers'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-2 sm:gap-3">
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
                      closeSidebar();
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
                          closeSidebar();
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
                          closeSidebar();
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
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 text-sm sm:text-base ${
                      activeTab === 'career-growth'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-2 sm:gap-3">
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
                          closeSidebar();
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
                          closeSidebar();
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
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 text-sm sm:text-base ${
                      activeTab === 'contact-directory'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-2 sm:gap-3">
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
                          setDirectorySection('community');
                          closeSidebar();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'contact-directory' && directorySection === 'community'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Student Community Directory
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('contact-directory');
                          setDirectorySection('global');
                          closeSidebar();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === 'contact-directory' && directorySection === 'global'
                            ? `${accent.sidebarActive} text-white`
                            : 'bg-white/5 text-white/80 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        Global Young Innovators
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
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-all shadow-sm flex items-center justify-between gap-2 text-sm sm:text-base ${
                      activeTab === 'national-events'
                        ? `${accent.sidebarActive} text-white`
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/90'
                    }`}
                  >
                    <span className="flex items-center gap-2 sm:gap-3">
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
                          closeSidebar();
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
                          closeSidebar();
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

                {/* Logout */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <button
                    type="button"
                    onClick={() => { logout(); closeSidebar(); }}
                    className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-white/10 hover:border-red-400/50 hover:bg-red-500/10 text-red-300 hover:text-red-200 transition-all flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                  >
                    <LogOut size={18} className="flex-shrink-0" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-h-0 bg-white flex flex-col min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 border-b border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex-shrink-0"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
                  {activeTab === 'overview' && 'Profile'}
                  {activeTab === 'membership' && 'Membership Card'}
                  {activeTab === 'class-schedule' && 'Make Your Bot'}
                  {activeTab === 'diy-offers' && 'Offers'}
                  {activeTab === 'career-growth' && 'Career Growth'}
                  {activeTab === 'contact-directory' && 'Contact Directory'}
                  {activeTab === 'national-events' && 'National & Global Events'}
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 flex-shrink-0 hidden sm:block">Member Portal</div>
            </div>

            <div
              className="flex-1 px-3 py-4 sm:px-6 sm:py-6 md:p-8 lg:p-10 overflow-y-auto min-h-0"
              style={{ scrollbarColor: '#1d4ed8 #f8fafc', scrollbarWidth: 'thin' }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-5 sm:space-y-8">
                  {/* Profile & Membership from GET /membership/my/get */}
                  {membershipLoading && (
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-500">
                      Loading profile and membership…
                    </div>
                  )}

                  {membershipError && !membershipLoading && (
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-red-200 shadow-sm text-sm text-red-600 font-semibold">
                      {membershipError}
                    </div>
                  )}

                  {!membershipLoading && !membershipError && (membership?.user || membership) && (
                    <>
                      {/* Profile card – from API data.user */}
                      {membership?.user && (
                        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                          <div className="mb-3 sm:mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                              Profile
                            </h2>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingProfile((prev) => !prev);
                                setUpdateProfileError('');
                                setUpdateProfileSuccess(false);
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex-shrink-0">
                              {membership.user.logo ? (
                                <img
                                  src={membership.user.logo}
                                  alt=""
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-200"
                                />
                              ) : (
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold text-white ${themeConfig?.colors?.primary || 'bg-blue-600'}`}>
                                  {getMemberInitials(membership.user, club)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 text-sm">
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

                          {/* Editable profile form */}
                          {isEditingProfile && (
                            <form
                              onSubmit={handleProfileSubmit}
                              className="mt-6 border-t border-slate-200 pt-4 space-y-4"
                            >
                              <h3 className="text-sm font-semibold text-slate-900">
                                Update Profile
                              </h3>
                              {updateProfileError && (
                                <p className="text-xs text-red-600 font-medium">
                                  {updateProfileError}
                                </p>
                              )}
                              {updateProfileSuccess && (
                                <p className="text-xs text-emerald-600 font-medium">
                                  Profile updated successfully.
                                </p>
                              )}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  name="fullName"
                                  value={profileForm.fullName}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Mobile
                                </label>
                                <input
                                  type="tel"
                                  name="mobile"
                                  value={profileForm.mobile}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Date of Birth
                                </label>
                                <input
                                  type="date"
                                  name="dob"
                                  value={profileForm.dob}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Gender
                                </label>
                                <select
                                  name="gender"
                                  value={profileForm.gender}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                  <option value="">Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Full Shipping Address
                                </label>
                                <textarea
                                  name="fullShipingAddress"
                                  value={profileForm.fullShipingAddress}
                                  onChange={handleProfileInputChange}
                                  rows={2}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  City
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={profileForm.city}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  State
                                </label>
                                <input
                                  type="text"
                                  name="state"
                                  value={profileForm.state}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Country
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  value={profileForm.country}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Pincode
                                </label>
                                <input
                                  type="text"
                                  name="pincode"
                                  value={profileForm.pincode}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Alternate Email
                                </label>
                                <input
                                  type="email"
                                  name="alternateEmail"
                                  value={profileForm.alternateEmail}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  School / College
                                </label>
                                <input
                                  type="text"
                                  name="schoolOrCollege"
                                  value={profileForm.schoolOrCollege}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Class / Grade
                                </label>
                                <input
                                  type="text"
                                  name="classOrGrade"
                                  value={profileForm.classOrGrade}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Father&apos;s Name
                                </label>
                                <input
                                  type="text"
                                  name="fatherName"
                                  value={profileForm.fatherName}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Mother&apos;s Name
                                </label>
                                <input
                                  type="text"
                                  name="motherName"
                                  value={profileForm.motherName}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Skills (comma separated)
                                </label>
                                <input
                                  type="text"
                                  name="skills"
                                  value={profileForm.skills}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="e.g. Coding, NodeJS, MongoDB"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                  Hobbies (comma separated)
                                </label>
                                <input
                                  type="text"
                                  name="hobbies"
                                  value={profileForm.hobbies}
                                  onChange={handleProfileInputChange}
                                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="e.g. Gaming, Cricket, Reading"
                                />
                              </div>
                              <div className="flex justify-end pt-2 sm:col-span-2">
                                <button
                                  type="submit"
                                  disabled={updatingProfile}
                                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {updatingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                              </div>
                            </div>
                            </form>
                          )}
                        </div>
                      )}

                      {/* Academic & personal details – extended student profile fields */}
                      {membership?.user && (
                        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
                            Academic & Personal Details
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 text-sm">
                            <div>
                              <dt className="text-slate-500">Stream</dt>
                              <dd className="font-semibold text-slate-900">
                                {membership.user.stream ||
                                  membership.user.affiliation?.stream ||
                                  'Not added'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-slate-500">Current Education</dt>
                              <dd className="font-semibold text-slate-900">
                                {membership.user.currentEducation ||
                                  membership.user.affiliation?.schoolOrCollege ||
                                  '—'}
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-slate-500">Subjects</dt>
                              <dd className="font-semibold text-slate-900">
                                {Array.isArray(membership.user.subjects)
                                  ? membership.user.subjects.join(', ')
                                  : membership.user.subjects || 'Not added'}
                             </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-slate-500">Skills</dt>
                              <dd className="font-semibold text-slate-900">
                                {Array.isArray(membership.user.skills)
                                  ? membership.user.skills.join(', ')
                                  : Array.isArray(membership.user.additional?.skills)
                                    ? membership.user.additional.skills.join(', ')
                                    : (profileForm.skills || 'Not added')}
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-slate-500">Hobbies / Interests</dt>
                              <dd className="font-semibold text-slate-900">
                                {Array.isArray(membership.user.hobbies)
                                  ? membership.user.hobbies.join(', ')
                                  : Array.isArray(membership.user.additional?.hobbies)
                                    ? membership.user.additional.hobbies.join(', ')
                                    : (profileForm.hobbies || 'Not added')}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-slate-500">Father&apos;s Name</dt>
                              <dd className="font-semibold text-slate-900">
                                {membership.user.fatherName ||
                                  membership.user.personal?.fatherName ||
                                  profileForm.fatherName ||
                                  'Not added'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-slate-500">Mother&apos;s Name</dt>
                              <dd className="font-semibold text-slate-900">
                                {membership.user.motherName ||
                                  membership.user.personal?.motherName ||
                                  profileForm.motherName ||
                                  'Not added'}
                              </dd>
                            </div>
                            <div className="sm:col-span-2">
                              <dt className="text-slate-500">Address</dt>
                              <dd className="font-semibold text-slate-900">
                                {(() => {
                                  const addr = membership.user.personalAndShippingAddress || {};
                                  const parts = [
                                    addr.addressLine1,
                                    addr.addressLine2,
                                    addr.city,
                                    addr.state,
                                    addr.country,
                                  ].filter(Boolean);
                                  return parts.length ? parts.join(', ') : 'Not added';
                                })()}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-slate-500">Pincode / Zipcode</dt>
                              <dd className="font-semibold text-slate-900">
                                {membership.user.personalAndShippingAddress?.pincode || 'Not added'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-slate-500">Alternate Mobile</dt>
                              <dd className="font-semibold text-slate-900">
                                {formatMobileDisplay(membership.user.alternateMobile) || 'Not added'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-slate-500">Alternate Email ID</dt>
                              <dd className="font-semibold text-slate-900 break-all">
                                {membership.user.alternateEmail || 'Not added'}
                              </dd>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Membership summary – from API data (top-level) */}
                    
                    </>
                  )}

                  {!membershipLoading && !membershipError && !membership?.user && !membership?.publicMembershipId && (
                    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-500">
                      No profile or membership data found. Complete signup or contact support.
                    </div>
                  )}

              
                </div>
              )}

            

              {activeTab === 'membership' && (
                <div className="space-y-4 sm:space-y-6 flex flex-col items-center w-full">
                  {/* Membership card — reference: credit-card layout, aspect 1.586:1, gradient + glow + overlay */}
                  <div className="w-full max-w-md flex flex-col items-center px-0 sm:px-2">
                    <div className="w-full flex justify-end mb-3">
                      {/* <button
                        type="button"
                        onClick={handleDownloadCard}
                        disabled={cardDownloading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/70 text-white font-medium text-sm px-5 py-2.5 shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
                        aria-label="Download membership card as image"
                      >
                        <Download className="w-4 h-4 shrink-0" aria-hidden />
                        {cardDownloading ? 'Preparing…' : 'Download card'}
                      </button> */}
                    </div>
                    <section
                      ref={membershipCardRef}
                      className="group relative w-full aspect-[1.5/1] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 px-4 pt-4 pb-5 sm:px-6 sm:pt-6 sm:pb-7 md:px-8 md:pt-8 md:pb-9 shadow-2xl text-white transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20"
                      aria-label="Membership card"
                    >
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" aria-hidden />
                      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-[80px] transition-all group-hover:bg-blue-400/30 pointer-events-none" aria-hidden />

                      <div className="relative flex h-full flex-col justify-between">
                        {/* Top: branding left, photo (chip-style) right — fixed aspect, object-cover for any image ratio */}
                        <div className="flex flex-shrink-0 items-start justify-between gap-3">
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-indigo-200/80">
                              {membership?.category || 'Premium'} Member
                            </p>
                            <p className="text-lg sm:text-xl md:text-2xl font-black italic tracking-tighter text-white/95">
                              WORSO<span className="text-indigo-300">CARD</span>
                            </p>
                          </div>
                          <div
                            className="relative flex-shrink-0 rounded-xl overflow-hidden border border-white/25 bg-black/50 shadow-inner ring-1 ring-white/10 flex items-center justify-center"
                            style={{ width: '4.5rem', height: '4.5rem', aspectRatio: '1' }}
                          >
                            {membership?.user?.logo ? (
                              <img
                                src={membership.user.logo}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover object-center"
                              />
                            ) : (
                              <span className="relative text-base sm:text-lg font-bold text-white/90 select-none">
                                {getMemberInitials(membership?.user || user, club)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle: membership ID as card number — can shrink so bottom (name) is never clipped in download */}
                        <div className="min-h-0 flex-shrink space-y-0.5">
                          <p className="font-mono text-sm sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.2em] text-white/90 break-all">
                            {membership?.publicMembershipId
                              ? (() => {
                                  const s = String(membership.publicMembershipId);
                                  const chunks = s.match(/.{1,4}/g) || [];
                                  return chunks.join(' • ');
                                })()
                              : '—'}
                          </p>
                        </div>

                        {/* Bottom: Card Holder left, Valid Thru right — extra margin so name stays inside bounds when html2canvas captures */}
                        <div className="flex flex-shrink-0 items-end justify-between gap-4 mt-1">
                          <div className="space-y-0.5 min-w-0 flex-1 overflow-visible">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-indigo-200/60">
                              Card Holder
                            </p>
                            <p className="font-medium tracking-wide text-white/95 break-words line-clamp-2" title={membership?.user?.fullName || memberName}>
                              {membership?.user?.fullName || memberName}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-indigo-200/70">
                              {membership?.category || 'Student'}
                              {(membership?.user?.mobile || user?.mobile) && (() => {
                                const raw = membership?.user?.mobile || user?.mobile;
                                const display = formatMobileDisplay(raw);
                                const telDigits = (raw || '').replace(/\D/g, '');
                                return display ? (
                                  <span>
                                    {' · '}
                                    <a href={`tel:${telDigits}`} className="font-mono hover:text-indigo-200 underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                                      {display}
                                    </a>x
                                  </span>
                                ) : null;
                              })()}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-indigo-200/60">
                              Valid Thru
                            </p>
                            <p className="font-mono text-xs sm:text-sm text-white/90">
                              {membership?.endDate
                                ? (() => {
                                    const d = new Date(membership.endDate);
                                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                                    const yy = String(d.getFullYear()).slice(-2);
                                    return `${mm} / ${yy}`;
                                  })()
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                 

                  {membershipError && !membershipLoading && (
                    <div className="text-sm text-red-600 font-semibold">
                      {membershipError}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'class-schedule' && (
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[260px] sm:min-h-[340px] flex flex-col items-stretch justify-start p-6 sm:p-8 md:p-10`}>
                  {classLoading && (
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed text-center">
                      Loading class schedule...
                    </p>
                  )}

                  {!classLoading && classError && (
                    <p className="text-red-300 text-sm sm:text-base leading-relaxed text-center">
                      {classError}
                    </p>
                  )}

                  {!classLoading && !classError && classSchedule && (
                    <div className="mt-6 w-full space-y-6">
                      {Array.isArray(classSchedule.todayClasses) && classSchedule.todayClasses.length > 0 && (
                        <div className="overflow-x-auto">
                          <h3 className="text-sm sm:text-base font-semibold text-slate-100 mb-2 text-left">
                            Today&apos;s Classes
                          </h3>
                          <table className="min-w-full divide-y divide-white/10 text-left text-xs sm:text-sm text-slate-100">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="px-3 py-2 font-semibold">Topic</th>
                                <th className="px-3 py-2 font-semibold">Batch</th>
                                <th className="px-3 py-2 font-semibold whitespace-nowrap">Time</th>
                                <th className="px-3 py-2 font-semibold">Status</th>
                                <th className="px-3 py-2 font-semibold text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {classSchedule.todayClasses.map((cls) => (
                                <tr key={cls._id} className="bg-white/5 hover:bg-white/10">
                                  <td className="px-3 py-2">{cls.topic}</td>
                                  <td className="px-3 py-2">{cls.batchName}</td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    {cls.startTime} – {cls.endTime}
                                  </td>
                                  <td className="px-3 py-2 capitalize">
                                    {cls.isJoined ? 'joined' : (cls.status || 'scheduled')}
                                  </td>
                                  <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
                                    { (cls.isJoined || registerSuccessId === cls._id) && cls.zoomLink && (
                                      <a
                                        href={cls.zoomLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center rounded-full bg-white/10 text-slate-50 px-3 py-1.5 text-[11px] sm:text-xs font-semibold border border-white/40 hover:bg-white/20 transition-colors"
                                      >
                                        Join via Zoom
                                      </a>
                                    )}
                                    {!cls.isJoined && registerSuccessId !== cls._id && (
                                      <button
                                        type="button"
                                        onClick={() => handleRegisterClass(cls._id)}
                                        disabled={registeringClassId === cls._id}
                                        className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-semibold shadow-md hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                      >
                                        {registeringClassId === cls._id ? 'Registering...' : 'Register'}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {Array.isArray(classSchedule.upcomingClasses) && classSchedule.upcomingClasses.length > 0 && (
                        <div className="overflow-x-auto">
                          <h3 className="text-sm sm:text-base font-semibold text-slate-100 mb-2 text-left">
                            Upcoming Classes
                          </h3>
                          <table className="min-w-full divide-y divide-white/10 text-left text-xs sm:text-sm text-slate-100">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="px-3 py-2 font-semibold">Topic</th>
                                <th className="px-3 py-2 font-semibold">Batch</th>
                                <th className="px-3 py-2 font-semibold">Date</th>
                                <th className="px-3 py-2 font-semibold whitespace-nowrap">Time</th>
                                <th className="px-3 py-2 font-semibold">Status</th>
                                <th className="px-3 py-2 font-semibold text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {classSchedule.upcomingClasses.map((cls) => (
                                <tr key={cls._id} className="bg-white/5 hover:bg-white/10">
                                  <td className="px-3 py-2">{cls.topic}</td>
                                  <td className="px-3 py-2">{cls.batchName}</td>
                                  <td className="px-3 py-2">
                                    {cls.date ? new Date(cls.date).toLocaleDateString() : ''}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    {cls.startTime} – {cls.endTime}
                                  </td>
                                  <td className="px-3 py-2 capitalize">
                                    {cls.isJoined ? 'joined' : (cls.status || 'scheduled')}
                                  </td>
                                  <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
                                    { (cls.isJoined || registerSuccessId === cls._id) && cls.zoomLink && (
                                      <a
                                        href={cls.zoomLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center rounded-full bg-white/10 text-slate-50 px-3 py-1.5 text-[11px] sm:text-xs font-semibold border border-white/40 hover:bg-white/20 transition-colors"
                                      >
                                        Join via Zoom
                                      </a>
                                    )}
                                    {!cls.isJoined && registerSuccessId !== cls._id && (
                                      <button
                                        type="button"
                                        onClick={() => handleRegisterClass(cls._id)}
                                        disabled={registeringClassId === cls._id}
                                        className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-semibold shadow-md hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                      >
                                        {registeringClassId === cls._id ? 'Registering...' : 'Register'}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {!classLoading && !classError && registerError && (
                    <div className="mt-4 text-center text-red-300 text-xs sm:text-sm">
                      {registerError}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'diy-offers' && (
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[300px] sm:min-h-[400px]`}>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <DiyOffers
                      activeSection={diySection}
                      membershipPlanName={membership?.planName}
                      themeAccent={accent}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'career-growth' && (
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[300px] sm:min-h-[400px]`}>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                    <CareerGrowth
                      activeSection={careerSection}
                      membershipPlanName={membership?.planName}
                      themeAccent={accent}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'contact-directory' && (
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[300px] sm:min-h-[400px]`}>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
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
                <div className={`rounded-xl sm:rounded-2xl overflow-hidden ${cardBg} border border-white/10 shadow-xl min-h-[300px] sm:min-h-[400px]`}>
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10">
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

