import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Shield,
  Trophy,
  MapPin,
  Calendar,
  ArrowRight,
  Users,
  Globe,
  Building,
  ChevronRight,
  Network,
  ServerCog,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import LogoTicker from '../components/LogoTicker';
import FeaturedShopSection from '../components/FeaturedShopSection';
import { PartnerVideoSection, PartnerNewsSection, PartnerSupporterSection, PartnerCompetitionSection } from '../components/partner';
import { NavLink, useParams } from 'react-router-dom';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { usePartnerHome } from '../hooks/usePartnerHome';
import { usePartnerEvent } from '../hooks/usePartnerEvent';
import { usePartnerCompetitions } from '../hooks/usePartnerCompetitions';
import { useCompetitionList } from '../hooks/useCompetitionList';
import { useLocationPrefix } from '../hooks/useLocationPrefix';
import HomeGallerySection from '../components/HomeGallerySection';
import { galleryImages } from '../assets/gallery';
import { PARTNER_HOME_STATIC } from '../data/partnerHomeStatic';
import TrophyVideo from '../assets/technoxian zrc_1.mp4';

/** Format raw stat (number or string) for display: 121 → 121, 3200 → 3.2k+, 10200000 → 10.2M+ */
function formatStatValue(raw) {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim();
  if (!s) return null;
  // Already formatted (contains k, M, +, etc.)
  if (/[kKmM+]/.test(s)) return s;
  const n = parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M+`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}k+`;
  return `${Math.round(n)}+`;
}

const HomeView = ({ setView, siteConfig, newsItems = [], newsLoading, newsError, locationCode: locationCodeProp }) => {
  const theme = useThemeClasses();
  const { locationPrefix, locationCode: locationCodeFromPath } = useLocationPrefix();
  const { locationCode: locationCodeFromParams } = useParams();
  // Partner content: prefer prop (LocationView), then URL param, then path-derived code
  const locationCode = locationCodeProp ?? locationCodeFromParams ?? locationCodeFromPath ?? null;
  void motion;

  const [latestNewsIndex, setLatestNewsIndex] = useState(0);
  const [mostReadIndex, setMostReadIndex] = useState(0);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  /** ✅ FIX: parent-controlled open state (Zoom-style) */
  const [openRows, setOpenRows] = useState({});

  // Partner home data: fetch from https://worso-backend-amber.vercel.app/api/partners/home/{countryCode}
  const defaultPartnerCode = import.meta.env.VITE_DEFAULT_PARTNER_CODE || null;
  const { data: partnerHomeData, loading: partnerHomeLoading, error: partnerHomeError } = usePartnerHome(locationCode, {
    defaultCode: defaultPartnerCode,
  });

  // Event API: fetch single event from /api/event/get?website=worso&partnerCode=XX (first item only)
  const effectivePartnerCode = locationCode || defaultPartnerCode || null;
  const { data: partnerEvent } = usePartnerEvent(effectivePartnerCode);
  const {
    data: partnerCompetitions,
    loading: partnerCompetitionsLoading,
    error: partnerCompetitionsError,
  } = usePartnerCompetitions(effectivePartnerCode);

  const {
    competitions: homeCompetitionList,
    loading: homeCompetitionsLoading,
    error: homeCompetitionsError,
  } = useCompetitionList();

  const competitionsForCarousel = useMemo(() => {
    if (homeCompetitionList.length > 0) return homeCompetitionList;
    return (partnerCompetitions || []).filter((c) => c && c.isActive !== false);
  }, [homeCompetitionList, partnerCompetitions]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(Boolean(media.matches));
    onChange();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }
    // Safari < 14
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);


  // Use partner home news if available, otherwise use props newsItems
  const newsData = useMemo(() => {
    if (partnerHomeData?.news && partnerHomeData.news.length > 0) {
      return partnerHomeData.news.filter(item => item.isActive).map(item => ({
        id: item._id,
        title: item.title,
        body: item.description,
        desc: item.description,
        category: item.type || 'GENERAL',
        date: item.Date ? new Date(item.Date).toLocaleDateString() : new Date().toLocaleDateString(),
        featuredImage: item.image,
      }));
    }
    return newsItems;
  }, [partnerHomeData?.news, newsItems]);

  const preparedNews = useMemo(() => newsData.filter(Boolean), [newsData]);
  const headline = preparedNews[0];
  const latestPool = preparedNews.slice(1);
  const mostReadPool = [...preparedNews].reverse().slice(1);

  // Featured YouTube videos from home.youtubeVideo or top-level youtubeVideo (array of URL strings)
  const featuredVideos = useMemo(() => {
    const arr = partnerHomeData?.home?.youtubeVideo ?? partnerHomeData?.youtubeVideo ?? [];
    if (!Array.isArray(arr)) return [];
    return arr.filter((u) => typeof u === 'string' && u.trim());
  }, [partnerHomeData?.home?.youtubeVideo, partnerHomeData?.youtubeVideo]);

  // Helper function to build paths with location prefix
  const buildPath = (path) => {
    if (locationPrefix && path) {
      return `${locationPrefix}${path.startsWith('/') ? path : `/${path}`}`;
    }
    return path || '#';
  };

  useEffect(() => {
    if (latestPool.length < 2) return;
    const i = setInterval(() => {
      setLatestNewsIndex(p => (p + 1) % latestPool.length);
    }, 4000);
    return () => clearInterval(i);
  }, [latestPool.length]);

  useEffect(() => {
    if (mostReadPool.length < 2) return;
    const i = setInterval(() => {
      setMostReadIndex(p => (p + 1) % mostReadPool.length);
    }, 4500);
    return () => clearInterval(i);
  }, [mostReadPool.length]);

  // Show loading state when fetching partner home (location route or default code)
  if (partnerHomeLoading) {
    return (
      <div className="animate-fadeIn bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state when partner home fetch failed
  if (partnerHomeError) {
    return (
      <div className="animate-fadeIn bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <Shield size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Content</h2>
          <p className="text-slate-600 mb-4">{partnerHomeError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn bg-slate-50">
      <div className={`relative min-h-[600px] flex items-center ${theme.bgGradient || siteConfig.colors.gradient} text-white overflow-hidden`}>
        {/* Banner background video */}
        <div className="absolute inset-0 z-0">
          <video
            className="h-full w-full object-cover opacity-40"
            src={TrophyVideo}
            poster={partnerHomeData?.home?.bannerImage || undefined}
            autoPlay={!prefersReducedMotion}
            muted
            loop={!prefersReducedMotion}
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
        </div>

        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${theme.bgPrimary || 'bg-blue-500'}/10 rounded-full blur-3xl`}></div>
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              {!siteConfig.is_partner && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                  <Shield size={12} />Unite. Compete. Triumph
                </div>
              )}

              <h1 className="text-6xl md:text-4xl font-bold leading-tight tracking-tight">
                {partnerHomeData?.home?.title || (siteConfig.is_partner ? 'International Federation of eSports' : 'International Federation of eSports')} <br />
                {/* {!partnerHomeData?.home?.title && (
                  <span className={theme.textLight || (siteConfig.is_partner ? 'text-emerald-400' : 'text-blue-400')}>adipiscing elit Lorem ipsum dolor sit amet consectur eiusmod</span>
                )} */}
              </h1>
              {/* <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                {partnerHomeData?.home?.subtitle || (siteConfig.is_partner
                  ? `Technoxian ${siteConfig.name.split(' ')[1]} runs autonomous qualifiers on a protected WORSO shell—local language, local sponsors, global rulebook.`
                  : 'WORSO sets the root rules, partners operate subdomains, and every chapter inherits the global brand without losing local context.')}
              </p> */}

              <div className="flex flex-wrap gap-4 pt-6">

                <>
               <button
  onClick={() => setView('technoxian')}
  className="px-8 py-4 rounded-lg font-bold text-base text-white 
  bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500
  shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)]
  hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.9)]
  hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
>
  {siteConfig.is_partner ? 'View Local Events' : 'Explore WRC Challenges'}
  <ArrowRight size={18} />
</button>
                  <button onClick={() => setView('teams')} className="bg-transparent border border-white/20 hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2">
                    <Users size={18} /> Teams & Rankings
                  </button>
                </>

              </div>
            </div>



{/* hero section comment code 

<div className="md:col-span-5 relative perspective-1000">
  <div
    className="bg-[#0a0a0c] backdrop-blur-2xl border border-white/5 rounded-2xl p-6 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] relative z-20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-indigo-500/20 group cursor-pointer overflow-hidden"
    onClick={() => setView('technoxian')}
  >
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[100px] rounded-full group-hover:bg-indigo-600/20 transition-all duration-700"></div>

    <div
      className={`rounded-xl p-6 mb-4 bg-gradient-to-br ${
        theme.hasTheme
          ? `from-slate-900 via-${theme.themeName}-900 to-black`
          : 'from-gray-900 via-indigo-950 to-black'
      } relative overflow-hidden border border-white/10 shadow-inner`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-400">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping shadow-[0_0_10px_#dc2626]"></span>
            {siteConfig.is_partner ? 'Next Local Event' : 'Upcoming Championship'}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            {partnerEvent?.name || partnerHomeData?.event?.title || 'Technoxian World Cup'}
          </h2>
        </div>
        <Trophy size={32} className="text-white/20 group-hover:text-yellow-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-500" />
      </div>

      <div className="flex gap-4 text-[11px] font-bold text-slate-300 relative z-10">
        {(partnerEvent?.venue || partnerHomeData?.event?.location) && (
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
            <MapPin size={12} className="text-indigo-400" /> {partnerEvent?.venue || partnerHomeData?.event?.location}
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
          <Calendar size={12} className="text-indigo-400" />
          {partnerEvent?.start_date
            ? new Date(partnerEvent.start_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : partnerHomeData?.event?.date || '2027'}
        </div>
      </div>
    </div>

    <div className="bg-white/[0.03] rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 cursor-pointer group/item relative overflow-hidden">
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">
          R
        </div>
        <div>
          <div className="font-bold text-white text-sm group-hover/item:text-indigo-300 transition-colors">
            Register Team
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
            Visitor & Exhibitor Passes
          </div>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-600 group-hover/item:text-white group-hover/item:translate-x-1 transition-all" />

      <div className="absolute inset-0 translate-y-full group-hover/item:translate-y-0 bg-gradient-to-t from-indigo-500/5 to-transparent transition-transform duration-500"></div>
    </div>
  </div>
</div>
 */}
          </div>
        </div>
      </div>

      {/* Stats Section — challenges, teams, club, member, viewership (from API top-level) */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center place-items-center divide-x divide-slate-100">
            {[
              { key: 'challenges', label: 'CHALLENGES', fallback: '15+' },
              { key: 'teams', label: 'TEAMS', fallback: '3k+' },
              { key: 'club', label: 'CLUB', fallback: '3.2k+' },
              { key: 'member', label: 'MEMBER', fallback: '10.2M+' },
              { key: 'viewership', label: 'VIEWERSHIP', fallback: '150M+' },
            ].map((stat) => {
              const raw = partnerHomeData?.[stat.key];
              const val = formatStatValue(raw) ?? stat.fallback;
              return (
                <div key={stat.key}>
                  <div className={`text-4xl font-extrabold ${theme.textPrimary || (siteConfig.is_partner ? 'text-emerald-600' : 'text-blue-600')}`}>{val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

<div className="container mx-auto px-6 lg:px-10 mt-16">

  <div className="grid md:grid-cols-12 gap-10 items-center">

    {/* LEFT SIDE CONTENT */}
    <div className="md:col-span-7 space-y-6 max-w-2xl">

      {/* Tagline */}
      <div className="text-xs uppercase tracking-[0.35em] text-indigo-400 font-semibold">
        Global eSports Championship
      </div>


      {/* Description */}
      <p className="text-slate-400 text-base md:text-lg leading-relaxed">
        Step into the future of robotics & esports at{" "}
        <span className="text-indigo-400 font-semibold">
          Technoxian World Cup
        </span>.
        Compete with global innovators, showcase your talent, and be part of the
        world’s biggest robotics championship platform powered by IFES.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => setView('technoxian')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300"
        >
          🚀 Explore Event
        </button>

        <button className="px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300">
          Learn More
        </button>
      </div>
    </div>

    {/* RIGHT SIDE CARD */}
    <div className="md:col-span-5 relative">

      <div
        className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-indigo-500/40 via-blue-500/20 to-transparent group cursor-pointer"
        onClick={() => setView('technoxian')}
      >
        <div className="relative bg-[#07070a]/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/5 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.35)] transition-all duration-500 hover:scale-[1.03] overflow-hidden">

          {/* Glow */}
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>

          {/* EVENT */}
          <div className="relative rounded-2xl p-6 mb-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-black border border-white/10 overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  Upcoming Championship
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {partnerEvent?.name || 'Technoxian World Cup'}
                </h2>
              </div>

              <Trophy className="text-white/20 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-500" size={28} />
            </div>

            <div className="flex gap-3 mt-4 text-[11px] text-slate-300 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                <MapPin size={12} className="text-indigo-400" />
                {partnerEvent?.venue || 'India'}
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10">
                <Calendar size={12} className="text-indigo-400" />
                {partnerEvent?.start_date
                  ? new Date(partnerEvent.start_date).toLocaleDateString()
                  : '2027'}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black">
                R
              </div>

              <div>
                <div className="text-white font-semibold text-sm">
                  Register Team
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Visitor & Exhibitor Passes
                </div>
              </div>
            </div>

            <ChevronRight className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

    </div>

  </div>
</div>


{/* dusara code  */}
      {!siteConfig.is_partner && (
   <section className="py-20 container mx-auto px-4">
  <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[2rem] p-8 md:p-14 shadow-2xl border border-white/5 flex flex-col md:flex-row items-center gap-12 transition-all duration-500 hover:border-cyan-400/30 overflow-hidden">

    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.08),transparent_40%)]" />

    {/* LEFT CONTENT */}
    <div className="flex-1 relative z-10">
      
      {/* Label */}
      <span className="text-cyan-400/80 font-semibold tracking-[0.35em] text-[11px] uppercase block mb-4">
        Global Reach
      </span>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
        A{" "}
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
            Federated
          </span>
          <span className="absolute left-0 bottom-0 w-full h-[6px] bg-gradient-to-r from-cyan-400/40 to-purple-500/40 blur-sm"></span>
        </span>{" "}
        Network
      </h2>

      {/* Paragraph */}
      <p className="text-slate-400 text-[17px] leading-relaxed mb-8 max-w-xl">
        IFES operates through a federated network of{" "}
        <span className="text-cyan-300 font-medium">
          national partners
        </span>{" "}
        who host local chapters of the{" "}
        <span className="text-purple-400 italic font-medium">
          TechnoXian World Cup
        </span>.
      </p>

      {/* Button */}
      <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-95">
        <span className="relative z-10 flex items-center gap-2 tracking-wide">
          Explore Partner Directory
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full relative z-10">

      {/* Box 1 */}
      <div className="group bg-slate-900/60 backdrop-blur-lg p-8 rounded-3xl border border-white/5 transition-all duration-500 hover:bg-slate-800/70 hover:-translate-y-2">
        <div className="mb-4 inline-block p-3 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20 transition">
          <Globe className="text-cyan-400 transition-transform group-hover:rotate-6" size={32} />
        </div>

        <div className="text-4xl font-extrabold text-white tracking-tight">
          25+
        </div>

        <div className="text-xs font-semibold text-cyan-400/70 uppercase mt-2 tracking-widest">
          National Partners
        </div>
      </div>

      {/* Box 2 */}
      <div className="group bg-slate-900/60 backdrop-blur-lg p-8 rounded-3xl border border-white/5 transition-all duration-500 hover:bg-slate-800/70 hover:-translate-y-2">
        <div className="mb-4 inline-block p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition">
          <Building className="text-purple-400 transition-transform group-hover:-rotate-6" size={32} />
        </div>

        <div className="text-4xl font-extrabold text-white tracking-tight">
          82+
        </div>

        <div className="text-xs font-semibold text-purple-400/70 uppercase mt-2 tracking-widest">
          Cities & Events
        </div>
      </div>

    </div>
  </div>
</section>
      )}

       <HomeGallerySection images={galleryImages} title="Gallery" carouselId="home-gallery-carousel" />

  {/* updated code */}
    <section className="py-20 mt-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-700">
  <div className="container mx-auto px-4">
    
    {/* Cards Grid */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="group relative p-[1.5px] rounded-2xl bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-transparent">
        <div className="relative p-7 bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden">

          {/* Soft Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />

          {/* Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 px-3 py-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/20 group-hover:border-cyan-400/40 transition">
              <Network size={16} className="group-hover:rotate-6 transition duration-300" />
              Federated Control
            </div>

            <h3 className="font-semibold text-xl text-white mb-3 group-hover:text-cyan-300 transition">
              Root Governance
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition">
              IFES Global sets the laws of the sport and synchronizes updates to every partner subdomain in real time—no fragmented rulebooks.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="group relative p-[1.5px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-transparent">
        <div className="relative p-7 bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />

          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-pink-500 opacity-70" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 px-3 py-1.5 bg-purple-500/10 rounded-md border border-purple-500/20 group-hover:border-purple-400/40 transition">
              <ServerCog size={16} className="group-hover:rotate-6 transition duration-300" />
              Micro-Website Shell
            </div>

            <h3 className="font-semibold text-xl text-white mb-3 group-hover:text-purple-300 transition">
              Multi-tenant React
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition">
              One codebase; many subdomains. Middleware detects `*.ifes.org`, injects logos, language packs, and partner content JSON—instantly themed for UAE, India, Korea, and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="group relative p-[1.5px] rounded-2xl bg-gradient-to-r from-pink-500/40 via-rose-500/30 to-transparent">
        <div className="relative p-7 bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10 overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl" />

          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-400 to-rose-500 opacity-70" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-pink-400 mb-4 px-3 py-1.5 bg-pink-500/10 rounded-md border border-pink-500/20 group-hover:border-pink-400/40 transition">
              <LayoutDashboard size={16} className="group-hover:rotate-6 transition duration-300" />
              Two-tier CMS
            </div>

            <h3 className="font-semibold text-xl text-white mb-3 group-hover:text-pink-300 transition">
              HQ vs Partner Roles
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition">
              Super Admins create partners, assign subdomains, and push global rules. Partner Admins edit welcome messages, galleries, registrations—never the core IFES brand.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


      {/* Supporting Organizations & Think Tanks: global home only, not partner home */}
      {!siteConfig.is_partner && !locationCode && <LogoTicker />}


      {/* Quick Links Section */}
      {partnerHomeData?.quickLinks && partnerHomeData.quickLinks.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-100 hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Quick Links</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partnerHomeData.quickLinks.map((link) => (
                <NavLink
                  key={link._id}
                  to={buildPath(link.url)}
                  className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {link.title}
                    </span>
                    <ChevronRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <FeaturedShopSection />

      {/* Global competition list (deduped by name) + carousel nav */}
      {homeCompetitionsLoading && competitionsForCarousel.length === 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">Loading competitions…</div>
        </section>
      )}
      {competitionsForCarousel.length > 0 && (
        <PartnerCompetitionSection
          competitions={competitionsForCarousel}
          title="Competitions"
          carouselId="home-competition-carousel"
        />
      )}
      {homeCompetitionsError &&
        competitionsForCarousel.length === 0 &&
        !partnerCompetitionsLoading &&
        (!partnerCompetitions || partnerCompetitions.length === 0) && (
          <div className="container mx-auto px-4 py-6">
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Unable to load competitions right now.
            </p>
          </div>
        )}
     

      {(locationCode || partnerHomeData) && (
        <>
          {featuredVideos.length > 0 && (
            <PartnerVideoSection
              videos={featuredVideos}
              title="Videos"
              carouselId="featured-video-carousel"
            />
          )}
          {/* <PartnerVideoSection
            videos={partnerHomeData?.videos?.length ? partnerHomeData.videos : PARTNER_HOME_STATIC.videos}
            title="Latest Videos"
          /> */}
          <PartnerNewsSection
            news={partnerHomeData?.news?.length ? partnerHomeData.news : PARTNER_HOME_STATIC.news}
            title="News"
            buildNewsPath={(id) => buildPath(`/news/${id}`)}
          />
        </>
      )}

      {/* Products Section */}
      {/* {partnerHomeData?.products && partnerHomeData.products.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {partnerHomeData.products
                .filter(product => product.isActive)
                .map((product) => (
                  <NavLink
                    key={product._id}
                    to={buildPath(product.buyLink)}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    {product.image && (
                      <div className="relative pt-[56.25%] bg-slate-100 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {product.currency || 'USD'} {product.price}
                        </span>
                        <ExternalLink className="text-slate-400" size={20} />
                      </div>
                    </div>
                  </NavLink>
                ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Partner route: Supporters section */}
      {(locationCode || partnerHomeData) && (
        <PartnerSupporterSection
          supporters={partnerHomeData?.supporters?.length ? partnerHomeData.supporters : PARTNER_HOME_STATIC.supporters}
          title="Our Supporters"
        />
      )}
{/* 
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                <Network size={14} /> Federated Control
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Root Governance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                IFES Global sets the laws of the sport and synchronizes updates to every partner subdomain in real time—no fragmented rulebooks.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
                <ServerCog size={14} /> Micro-Website Shell
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Multi-tenant React</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                One codebase; many subdomains. Middleware detects `*.ifes.org`, injects logos, language packs, and partner content JSON—instantly themed for UAE, India, Korea, and beyond.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">
                <LayoutDashboard size={14} /> Two-tier CMS
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">HQ vs Partner Roles</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Super Admins create partners, assign subdomains, and push global rules. Partner Admins edit welcome messages, galleries, registrations—never the core IFES brand.
              </p>
            </div>
          </div>
        </div>
      </section> */}

    


      {/* Headline / Latest News / Most Read - global home only, hidden on partner pages */}
      {!(locationCode || partnerHomeData) && (
        // <section className="py-20 bg-white border-t border-slate-100">
        //   <div className="container mx-auto px-4 max-w-7xl">
        //     {newsError && <div className="text-sm text-red-500 mb-4">{newsError}</div>}
        //     <div className="grid md:grid-cols-5 gap-6">
        //       {/* Headline Section */}
        //       <div className="md:col-span-3">
        //         <div className="flex items-center gap-2 mb-4">
        //           <h2 className="text-xl font-bold text-slate-900">Headline</h2>
        //           <button onClick={() => setView('news-list-headline')} className="p-1 rounded hover:bg-slate-100">
        //             <ChevronRight size={18} className="text-slate-400" />
        //           </button>
        //         </div>
        //         <div className="bg-gradient-to-br from-white via-slate-50 to-white rounded-xl shadow-lg border border-slate-200 p-5 h-[440px] flex flex-col overflow-hidden">
        //           {newsLoading && !headline && <div className="text-sm text-slate-500">Loading latest news…</div>}
        //           {!newsLoading && !headline && <div className="text-sm text-slate-500">No news available right now.</div>}
        //           {headline && (
        //             <article key={headline.id} className="flex flex-col h-full space-y-3">
        //               {headline.featuredImage && (
        //                 <div className="rounded-lg overflow-hidden shadow-md">
        //                   <img
        //                     src={headline.featuredImage}
        //                     alt={headline.title}
        //                     className="w-full h-[180px] object-cover"
        //                   />
        //                 </div>
        //               )}
        //               <div className="flex items-center gap-3">
        //                 <span className="text-xs font-bold text-slate-600 uppercase">{headline.category}</span>
        //                 <span className="text-xs text-slate-400">{headline.date}</span>
        //               </div>
        //               <h3
        //                 className="text-xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-2"
        //                 onClick={() => setView(`news-${headline.id}`)}
        //               >
        //                 {headline.title}
        //               </h3>
        //               <p className="text-sm text-slate-600 leading-relaxed flex-grow line-clamp-3">{headline.body || headline.desc}</p>
        //               <div>
        //                 <button
        //                   onClick={() => setView(`news-${headline.id}`)}
        //                   className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1 self-start"
        //                 >
        //                   Continue Reading
        //                   <ArrowRight size={14} />
        //                 </button>
        //               </div>
        //             </article>
        //           )}
        //         </div>
        //       </div>

        //       {/* Latest News Section */}
        //       <div className="md:col-span-1">
        //         <div className="flex items-center gap-2 mb-4">
        //           <h2 className="text-xl font-bold text-slate-900">Latest News</h2>
        //           <button onClick={() => setView('news-list-latest')} className="p-1 rounded hover:bg-slate-100">
        //             <ChevronRight size={18} className="text-slate-400" />
        //           </button>
        //         </div>
        //         <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 h-[440px] overflow-hidden">
        //           {newsLoading && !latestPool.length ? (
        //             <div className="text-xs text-slate-500">Loading latest news…</div>
        //           ) : latestPool.length === 0 ? (
        //             <div className="text-xs text-slate-500">No updates yet.</div>
        //           ) : (
        //             <motion.div
        //               key={latestNewsIndex}
        //               initial={{ opacity: 0, y: 24 }}
        //               animate={{ opacity: 1, y: 0 }}
        //               exit={{ opacity: 0, y: -24 }}
        //               transition={{ duration: 0.45, ease: 'easeOut' }}
        //               className="space-y-3"
        //             >
        //               {(() => {
        //                 const extended = [...latestPool, ...latestPool];
        //                 const start = latestNewsIndex % latestPool.length;
        //                 const windowItems = extended.slice(start, start + 3);
        //                 return windowItems.map((news, i) => (
        //                   <article key={`${news.id}-latest-${start}-${i}`} className="border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
        //                     <div className="flex items-center gap-2 mb-2">
        //                       <span className="text-[11px] font-bold text-slate-600 uppercase">{news.category}</span>
        //                       <span className="text-[11px] text-slate-400">{news.date}</span>
        //                     </div>
        //                     <h3
        //                       className="text-sm font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
        //                       onClick={() => setView(`news-${news.id}`)}
        //                     >
        //                       {news.title}
        //                     </h3>
        //                     <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-3">{news.body || news.desc}</p>
        //                     <button
        //                       onClick={() => setView(`news-${news.id}`)}
        //                       className="text-[11px] text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
        //                     >
        //                       Continue Reading
        //                       <ArrowRight size={12} />
        //                     </button>
        //                   </article>
        //                 ));
        //               })()}
        //             </motion.div>
        //           )}
        //         </div>
        //       </div>

        //       {/* Most Read Section */}
        //       <div className="md:col-span-1">
        //         <div className="flex items-center gap-2 mb-4">
        //           <h2 className="text-xl font-bold text-slate-900">Most Read</h2>
        //           <button onClick={() => setView('news-list-most')} className="p-1 rounded hover:bg-slate-100">
        //             <ChevronRight size={18} className="text-slate-400" />
        //           </button>
        //         </div>
        //         <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 h-[440px] overflow-hidden">
        //           {newsLoading && !mostReadPool.length ? (
        //             <div className="text-xs text-slate-500">Loading most read…</div>
        //           ) : mostReadPool.length === 0 ? (
        //             <div className="text-xs text-slate-500">No reads yet.</div>
        //           ) : (
        //             <motion.div
        //               key={mostReadIndex}
        //               initial={{ opacity: 0, y: 24 }}
        //               animate={{ opacity: 1, y: 0 }}
        //               exit={{ opacity: 0, y: -24 }}
        //               transition={{ duration: 0.45, ease: 'easeOut' }}
        //               className="space-y-3"
        //             >
        //               {(() => {
        //                 const extended = [...mostReadPool, ...mostReadPool];
        //                 const start = mostReadIndex % mostReadPool.length;
        //                 const windowItems = extended.slice(start, start + 3);
        //                 return windowItems.map((news, i) => (
        //                   <article key={`${news.id}-most-${start}-${i}`} className="border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
        //                     <div className="flex items-center gap-2 mb-2">
        //                       <span className="text-[11px] font-bold text-slate-600 uppercase">{news.category}</span>
        //                       <span className="text-[11px] text-slate-400">{news.date}</span>
        //                     </div>
        //                     <h3
        //                       className="text-sm font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
        //                       onClick={() => setView(`news-${news.id}`)}
        //                     >
        //                       {news.title}
        //                     </h3>
        //                     <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-3">{news.body || news.desc}</p>
        //                     <button
        //                       onClick={() => setView(`news-${news.id}`)}
        //                       className="text-[11px] text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
        //                     >
        //                       Continue Reading
        //                       <ArrowRight size={12} />
        //                     </button>
        //                   </article>
        //                 ));
        //               })()}
        //             </motion.div>
        //           )}
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </section>


        // update code 
        <section className="py-20 mt-10 bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-white/5">
  <div className="container mx-auto px-4 max-w-7xl">

    {newsError && <div className="text-sm text-red-400 mb-4">{newsError}</div>}

    <div className="grid md:grid-cols-5 gap-6">

      {/* Headline */}
      <div className="md:col-span-3">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white tracking-wide">Headline</h2>
          <button onClick={() => setView('news-list-headline')} className="p-1 rounded hover:bg-white/10">
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-xl border border-white/5 p-5 h-[440px] flex flex-col overflow-hidden hover:shadow-cyan-500/10 transition">

          {headline && (
            <article key={headline.id} className="flex flex-col h-full space-y-3">

              {headline.featuredImage && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={headline.featuredImage}
                    alt={headline.title}
                    className="w-full h-[180px] object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase">{headline.category}</span>
                <span className="text-xs text-slate-500">{headline.date}</span>
              </div>

              <h3
                className="text-xl font-extrabold text-white hover:text-cyan-300 transition cursor-pointer leading-snug line-clamp-2"
                onClick={() => setView(`news-${headline.id}`)}
              >
                {headline.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed flex-grow line-clamp-3">
                {headline.body || headline.desc}
              </p>

              <button
                onClick={() => setView(`news-${headline.id}`)}
                className="text-sm text-cyan-400 font-medium hover:text-cyan-300 inline-flex items-center gap-1"
              >
                Continue Reading <ArrowRight size={14} />
              </button>
            </article>
          )}
        </div>
      </div>

      {/* Latest News */}
      <div className="md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">Latest</h2>
          <button onClick={() => setView('news-list-latest')} className="p-1 rounded hover:bg-white/10">
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-xl border border-white/5 p-4 h-[440px] overflow-hidden">

          <motion.div
            key={latestNewsIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {latestPool.slice(0, 3).map((news) => (
              <article key={news.id} className="rounded-lg p-3 border border-white/5 bg-slate-800/60 hover:bg-slate-800 transition">

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase">{news.category}</span>
                  <span className="text-[11px] text-slate-500">{news.date}</span>
                </div>

                <h3
                  className="text-sm font-bold text-white mb-2 hover:text-purple-300 transition cursor-pointer line-clamp-2"
                  onClick={() => setView(`news-${news.id}`)}
                >
                  {news.title}
                </h3>

                <button
                  onClick={() => setView(`news-${news.id}`)}
                  className="text-[11px] text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                >
                  Read <ArrowRight size={12} />
                </button>
              </article>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Most Read */}
      <div className="md:col-span-1">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">Popular</h2>
          <button onClick={() => setView('news-list-most')} className="p-1 rounded hover:bg-white/10">
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-xl border border-white/5 p-4 h-[440px] overflow-hidden">

          <motion.div
            key={mostReadIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {mostReadPool.slice(0, 3).map((news) => (
              <article key={news.id} className="rounded-lg p-3 border border-white/5 bg-slate-800/60 hover:bg-slate-800 transition">

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-pink-400 uppercase">{news.category}</span>
                  <span className="text-[11px] text-slate-500">{news.date}</span>
                </div>

                <h3
                  className="text-sm font-bold text-white mb-2 hover:text-pink-300 transition cursor-pointer line-clamp-2"
                  onClick={() => setView(`news-${news.id}`)}
                >
                  {news.title}
                </h3>

                <button
                  onClick={() => setView(`news-${news.id}`)}
                  className="text-[11px] text-pink-400 hover:text-pink-300 inline-flex items-center gap-1"
                >
                  Read <ArrowRight size={12} />
                </button>
              </article>
            ))}
          </motion.div>

        </div>
      </div>

    </div>
  </div>
</section>
      )}
    </div>
  );
};

export default HomeView;