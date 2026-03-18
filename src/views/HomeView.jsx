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
import { PartnerVideoSection, PartnerNewsSection, PartnerSupporterSection } from '../components/partner';
import { NavLink, useParams } from 'react-router-dom';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { fetchPartnerHome } from '../utils/api';
import { useLocationPrefix } from '../hooks/useLocationPrefix';
import { PARTNER_HOME_STATIC } from '../data/partnerHomeStatic';

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

  /** ✅ FIX: parent-controlled open state (Zoom-style) */
  const [openRows, setOpenRows] = useState({});

  // Partner home data state
  const [partnerHomeData, setPartnerHomeData] = useState(null);
  const [partnerHomeLoading, setPartnerHomeLoading] = useState(false);
  const [partnerHomeError, setPartnerHomeError] = useState(null);

  // Fetch partner home data when locationCode is present
  useEffect(() => {
    if (!locationCode) return;

    const loadPartnerHome = async () => {
      setPartnerHomeLoading(true);
      setPartnerHomeError(null);
      try {
        const data = await fetchPartnerHome(locationCode);
        if (data.success) {
          setPartnerHomeData(data);
        } else {
          setPartnerHomeError('Failed to load partner home data');
        }
      } catch (error) {
        console.error('Error fetching partner home:', error);
        setPartnerHomeError(error.message || 'Failed to load partner home data');
      } finally {
        setPartnerHomeLoading(false);
      }
    };

    loadPartnerHome();
  }, [locationCode]);


  // Use partner home news if available, otherwise use props newsItems
  const newsData = useMemo(() => {
    if (partnerHomeData?.news && partnerHomeData.news.length > 0) {
      return partnerHomeData.news.filter(item => item.isActive).map(item => ({
        id: item._id,
        title: item.title,
        body: item.description,
        desc: item.description,
        category: item.type || 'GENERAL',
        date: new Date().toLocaleDateString(),
        featuredImage: item.image,
      }));
    }
    return newsItems;
  }, [partnerHomeData?.news, newsItems]);

  const preparedNews = useMemo(() => newsData.filter(Boolean), [newsData]);
  const headline = preparedNews[0];
  const latestPool = preparedNews.slice(1);
  const mostReadPool = [...preparedNews].reverse().slice(1);

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

  // Show loading state
  if (partnerHomeLoading && locationCode) {
    return (
      <div className="animate-fadeIn bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading partner home data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (partnerHomeError && locationCode) {
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
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${theme.bgPrimary || 'bg-blue-500'}/10 rounded-full blur-3xl`}></div>
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              {!siteConfig.is_partner && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                  <Shield size={12} /> Global Regulatory Body
                </div>
              )}
              {/* Banner Image */}
              {/* {partnerHomeData?.home?.bannerImage && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={partnerHomeData.home.bannerImage} 
                    alt={partnerHomeData.home.title || 'Banner'} 
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
              )} */}
              
              <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
                {partnerHomeData?.home?.title || (siteConfig.is_partner ? 'The governing body ' : 'The governing body')} <br />
                {!partnerHomeData?.home?.title && (
                  <span className={theme.textLight || (siteConfig.is_partner ? 'text-emerald-400' : 'text-blue-400')}>for sport of robotics.</span>
                )}
              </h1>
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                {partnerHomeData?.home?.subtitle || (siteConfig.is_partner
                  ? `Technoxian ${siteConfig.name.split(' ')[1]} runs autonomous qualifiers on a protected WORSO shell—local language, local sponsors, global rulebook.`
                  : 'WORSO sets the root rules, partners operate subdomains, and every chapter inherits the global brand without losing local context.')}
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                {partnerHomeData?.quickLinks && partnerHomeData.quickLinks.length > 0 ? (
                  partnerHomeData.quickLinks.slice(0, 2).map((link) => (
                    <NavLink
                      key={link._id}
                      to={buildPath(link.url)}
                      className={`${theme.bgPrimary || siteConfig.colors.primary} px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg flex items-center gap-2 hover:-translate-y-1`}
                    >
                      {link.title} <ArrowRight size={18} />
                    </NavLink>
                  ))
                ) : (
                  <>
                    <button
                      onClick={() => setView('technoxian')}
                      className={`${theme.bgPrimary || siteConfig.colors.primary} px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg flex items-center gap-2 hover:-translate-y-1`}
                    >
                      {siteConfig.is_partner ? 'View Local Events' : 'Explore WRC Challenges'} <ArrowRight size={18} />
                    </button>
                    <button onClick={() => setView('teams')} className="bg-transparent border border-white/20 hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2">
                      <Users size={18} /> Teams & Rankings
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-5 relative perspective-1000">
              <div
                className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative z-20 transform transition-all duration-500 hover:scale-105 hover:shadow-blue-900/20 group cursor-pointer"
                onClick={() => setView('technoxian')}
              >
                <div
                  className={`rounded-xl p-6 mb-4 bg-gradient-to-r ${theme.hasTheme 
                    ? `${theme.bgPrimary} to-${theme.themeName}-700` 
                    : (siteConfig.is_partner ? 'from-emerald-600 to-teal-600' : 'from-blue-600 to-indigo-600')
                  } relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2 text-white/80">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        {siteConfig.is_partner ? 'Next Local Event' : 'Upcoming Championship'}
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {partnerHomeData?.event?.title || 'Technoxian World Cup \'26'}
                      </h2>
                    </div>
                    <Trophy size={32} className="text-white/30 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <div className="flex gap-4 text-xs font-bold text-white/90 relative z-10">
                    {partnerHomeData?.event?.location && (
                      <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                        <MapPin size={12} /> {partnerHomeData.event.location}
                      </div>
                    )}
                    {partnerHomeData?.event?.date && (
                      <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                        <Calendar size={12} /> {partnerHomeData.event.date}
                      </div>
                    )}
                    {!partnerHomeData?.event && (
                      <>
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                          <MapPin size={12} /> TBD
                        </div>
                        <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                          <Calendar size={12} /> OCT 2026
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-white/5 hover:bg-slate-800 transition-colors cursor-pointer group/item">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${theme.bgPrimary || 'bg-blue-500'}/20 ${theme.textLight || 'text-blue-400'} flex items-center justify-center font-bold text-sm`}>R</div>
                    <div>
                      <div className="font-bold text-white text-sm">Register Team</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">Visitor & Exhibitor Passes</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`text-slate-500 group-hover/item:${theme.textLight || 'text-blue-400'} group-hover/item:translate-x-1 transition-all`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {partnerHomeData?.stats && (
        <div className="bg-white border-b border-slate-200 py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center place-items-center divide-x divide-slate-100">
              {[
                { label: 'Students', val: partnerHomeData.stats.studentsCount || 0 },
                { label: 'Performance Score', val: partnerHomeData.stats.performanceScore || 0 },
                { label: 'Revenue', val: `$${partnerHomeData.stats.revenue || 0}` },
                { label: 'Total Revenue', val: `$${partnerHomeData.stats.totalRevenue || 0}` },
              ].map((stat, i) => (
                <div key={i}>
                  <div className={`text-4xl font-extrabold ${theme.textPrimary || (siteConfig.is_partner ? 'text-emerald-600' : 'text-blue-600')}`}>
                    {stat.val}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!partnerHomeData?.stats && (
        <div className="bg-white border-b border-slate-200 py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center place-items-center divide-x divide-slate-100">
              {[{ label: 'Challenges', val: '15+' },{ label: 'Member', val: '50k+' }, { label: 'Registered Teams', val: '3k+' }, { label: 'Viewership', val: '100M+' }, ].map((stat, i) => (
                <div key={i}>
                  <div className={`text-4xl font-extrabold ${theme.textPrimary || (siteConfig.is_partner ? 'text-emerald-600' : 'text-blue-600')}`}>{stat.val}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!siteConfig.is_partner && (
        <section className="py-20 bg-slate-50 container mx-auto px-4">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Global Reach</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4">A Federated Network</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                WORSO operates through a federated network of national partners who host local chapters of the TechnoXian World Cup.
              </p>
              {/* <button onClick={() => setView('partners')} className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
                Explore Partner Directory <ArrowRight size={16} />
              </button> */}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-slate-100 p-6 rounded-2xl">
                <Globe className="text-slate-400 mb-4" size={32} />
                <div className="font-bold text-slate-900">25+ National</div>
                <div className="text-sm text-slate-500">Partner</div>
              </div>
              <div className="bg-slate-100 p-6 rounded-2xl">
                <Building className="text-slate-400 mb-4" size={32} />
                <div className="font-bold text-slate-900">5+ Cities</div>
                <div className="text-sm text-slate-500">Zonal Events</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!siteConfig.is_partner && <LogoTicker />}
      
      {/* Quick Links Section */}
      {partnerHomeData?.quickLinks && partnerHomeData.quickLinks.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
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
      
      <FeaturedShopSection/>
      {/* Partner route: Video, News, Supporter sections (API data with static fallback) */}
      {locationCode && (
        <>
          <PartnerVideoSection
            videos={partnerHomeData?.videos?.length ? partnerHomeData.videos : PARTNER_HOME_STATIC.videos}
            title="Latest Videos"
          />
          <PartnerNewsSection
            news={partnerHomeData?.news?.length ? partnerHomeData.news : PARTNER_HOME_STATIC.news}
            title="News"
            onNewsClick={(id) => setView(`news-${id}`)}
          />
        </>
      )}

      {/* Products Section */}
      {partnerHomeData?.products && partnerHomeData.products.length > 0 && (
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
      )}

      {/* Partner route: Supporters section */}
      {locationCode && (
        <PartnerSupporterSection
          supporters={partnerHomeData?.supporters?.length ? partnerHomeData.supporters : PARTNER_HOME_STATIC.supporters}
          title="Our Supporters"
        />
      )}

      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                <Network size={14} /> Federated Control
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Root Governance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                WORSO Global sets the laws of the sport and synchronizes updates to every partner subdomain in real time—no fragmented rulebooks.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">
                <ServerCog size={14} /> Micro-Website Shell
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Multi-tenant React</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                One codebase; many subdomains. Middleware detects `*.worso.org`, injects logos, language packs, and partner content JSON—instantly themed for UAE, India, Korea, and beyond.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">
                <LayoutDashboard size={14} /> Two-tier CMS
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">HQ vs Partner Roles</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Super Admins create partners, assign subdomains, and push global rules. Partner Admins edit welcome messages, galleries, registrations—never the core WORSO brand.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          {newsError && <div className="text-sm text-red-500 mb-4">{newsError}</div>}
          <div className="grid md:grid-cols-5 gap-6">
            {/* Headline Section */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-slate-900">Headline</h2>
                <button onClick={() => setView('news-list-headline')} className="p-1 rounded hover:bg-slate-100">
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-white via-slate-50 to-white rounded-xl shadow-lg border border-slate-200 p-5 h-[440px] flex flex-col overflow-hidden">
                {newsLoading && !headline && <div className="text-sm text-slate-500">Loading latest news…</div>}
                {!newsLoading && !headline && <div className="text-sm text-slate-500">No news available right now.</div>}
                {headline && (
                  <article key={headline.id} className="flex flex-col h-full space-y-3">
                    {headline.featuredImage && (
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src={headline.featuredImage}
                          alt={headline.title}
                          className="w-full h-[180px] object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 uppercase">{headline.category}</span>
                      <span className="text-xs text-slate-400">{headline.date}</span>
                    </div>
                    <h3
                      className="text-xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                      onClick={() => setView(`news-${headline.id}`)}
                    >
                      {headline.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed flex-grow line-clamp-3">{headline.body || headline.desc}</p>
                    <div>
                      <button
                        onClick={() => setView(`news-${headline.id}`)}
                        className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1 self-start"
                      >
                        Continue Reading
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                )}
              </div>
            </div>

            {/* Latest News Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-slate-900">Latest News</h2>
                <button onClick={() => setView('news-list-latest')} className="p-1 rounded hover:bg-slate-100">
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 h-[440px] overflow-hidden">
                {newsLoading && !latestPool.length ? (
                  <div className="text-xs text-slate-500">Loading latest news…</div>
                ) : latestPool.length === 0 ? (
                  <div className="text-xs text-slate-500">No updates yet.</div>
                ) : (
                  <motion.div
                    key={latestNewsIndex}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="space-y-3"
                  >
                    {(() => {
                      const extended = [...latestPool, ...latestPool];
                      const start = latestNewsIndex % latestPool.length;
                      const windowItems = extended.slice(start, start + 3);
                      return windowItems.map((news, i) => (
                        <article key={`${news.id}-latest-${start}-${i}`} className="border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold text-slate-600 uppercase">{news.category}</span>
                            <span className="text-[11px] text-slate-400">{news.date}</span>
                          </div>
                          <h3
                            className="text-sm font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                            onClick={() => setView(`news-${news.id}`)}
                          >
                            {news.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-3">{news.body || news.desc}</p>
                          <button
                            onClick={() => setView(`news-${news.id}`)}
                            className="text-[11px] text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                          >
                            Continue Reading
                            <ArrowRight size={12} />
                          </button>
                        </article>
                      ));
                    })()}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Most Read Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-slate-900">Most Read</h2>
                <button onClick={() => setView('news-list-most')} className="p-1 rounded hover:bg-slate-100">
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 h-[440px] overflow-hidden">
                {newsLoading && !mostReadPool.length ? (
                  <div className="text-xs text-slate-500">Loading most read…</div>
                ) : mostReadPool.length === 0 ? (
                  <div className="text-xs text-slate-500">No reads yet.</div>
                ) : (
                  <motion.div
                    key={mostReadIndex}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="space-y-3"
                  >
                    {(() => {
                      const extended = [...mostReadPool, ...mostReadPool];
                      const start = mostReadIndex % mostReadPool.length;
                      const windowItems = extended.slice(start, start + 3);
                      return windowItems.map((news, i) => (
                        <article key={`${news.id}-most-${start}-${i}`} className="border border-slate-200 rounded-lg p-3 shadow-sm bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold text-slate-600 uppercase">{news.category}</span>
                            <span className="text-[11px] text-slate-400">{news.date}</span>
                          </div>
                          <h3
                            className="text-sm font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                            onClick={() => setView(`news-${news.id}`)}
                          >
                            {news.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-3">{news.body || news.desc}</p>
                          <button
                            onClick={() => setView(`news-${news.id}`)}
                            className="text-[11px] text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                          >
                            Continue Reading
                            <ArrowRight size={12} />
                          </button>
                        </article>
                      ));
                    })()}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;