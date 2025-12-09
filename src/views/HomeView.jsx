import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, MapPin, Calendar, ArrowRight, Users, Globe, Building, ChevronRight, Network, ServerCog, LayoutDashboard } from 'lucide-react';
import LogoTicker from '../components/LogoTicker';
import { NEWS_ITEMS } from '../constants/data';

const HomeView = ({ setView, siteConfig }) => {
  const [latestNewsIndex, setLatestNewsIndex] = useState(0);
  const [mostReadIndex, setMostReadIndex] = useState(0);

  useEffect(() => {
    const latestInterval = setInterval(() => {
      setLatestNewsIndex((prev) => (prev + 1) % (NEWS_ITEMS.length - 1));
    }, 4000);
    return () => clearInterval(latestInterval);
  }, []);

  useEffect(() => {
    const mostReadInterval = setInterval(() => {
      setMostReadIndex((prev) => (prev + 1) % (NEWS_ITEMS.length - 1));
    }, 4500);
    return () => clearInterval(mostReadInterval);
  }, []);

  const FALLBACK_TROPHY_URL = 'https://worso.org/images/25-Trophy.png';
  const TROPHY_IMAGES = Array.from({ length: 11 }, () => FALLBACK_TROPHY_URL);
  const trophyScrollRef = useRef(null);

  useEffect(() => {
    const el = trophyScrollRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 1;
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  return (
  <div className="animate-fadeIn bg-slate-50">
    <div className={`relative min-h-[600px] flex items-center ${siteConfig.colors.gradient} text-white overflow-hidden`}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            {!siteConfig.is_partner && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                <Shield size={12} /> Global Regulatory Body
              </div>
            )}
            <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
              {siteConfig.is_partner ? 'Federated Control for' : 'Federated Control of'} <br />
              <span className={siteConfig.is_partner ? 'text-emerald-400' : 'text-blue-400'}>The Sport of Robotics</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              {siteConfig.is_partner
                ? `Technoxian ${siteConfig.name.split(' ')[1]} runs autonomous qualifiers on a protected WORSO shell—local language, local sponsors, global rulebook.`
                : 'WORSO sets the root rules, partners operate subdomains, and every chapter inherits the global brand without losing local context.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <button
                onClick={() => setView('technoxian')}
                className={`${siteConfig.colors.primary} px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg flex items-center gap-2 hover:-translate-y-1`}
              >
                {siteConfig.is_partner ? 'View Local Events' : 'Explore Technoxian'} <ArrowRight size={18} />
              </button>
              <button onClick={() => setView('teams')} className="bg-transparent border border-white/20 hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2">
                <Users size={18} /> Teams & Rankings
              </button>
            </div>
          </div>

          <div className="md:col-span-5 relative perspective-1000">
            <div
              className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative z-20 transform transition-all duration-500 hover:scale-105 hover:shadow-blue-900/20 group cursor-pointer"
              onClick={() => setView('technoxian')}
            >
              <div
                className={`rounded-xl p-6 mb-4 bg-gradient-to-r ${
                  siteConfig.is_partner ? 'from-emerald-600 to-teal-600' : 'from-blue-600 to-indigo-600'
                } relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-2 text-white/80">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      {siteConfig.is_partner ? 'Next Local Event' : 'Upcoming Championship'}
                    </div>
                    <h2 className="text-2xl font-bold text-white">Technoxian World Cup '26</h2>
                  </div>
                  <Trophy size={32} className="text-white/30 group-hover:text-yellow-400 transition-colors" />
                </div>
                <div className="flex gap-4 text-xs font-bold text-white/90 relative z-10">
                  <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                    <MapPin size={12} /> Dubai, UAE
                  </div>
                  <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded">
                    <Calendar size={12} /> Oct 12-15
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-white/5 hover:bg-slate-800 transition-colors cursor-pointer group/item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">R</div>
                  <div>
                    <div className="font-bold text-white text-sm">Register Team</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Visitor & Exhibitor Passes</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover/item:text-blue-400 group-hover/item:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white border-b border-slate-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
          {[{ label: 'Member Nations', val: '95+' }, { label: 'Registered Teams', val: '120k+' }, { label: 'Global Spectators', val: '2.5M' }, { label: 'Prize Pool', val: '$250k' }].map((stat, i) => (
            <div key={i}>
              <div className={`text-4xl font-extrabold ${siteConfig.is_partner ? 'text-emerald-600' : 'text-blue-600'}`}>{stat.val}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {!siteConfig.is_partner && (
      <section className="py-20 bg-slate-50 container mx-auto px-4">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Global Reach</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4">A Federated Network</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              WORSO operates through a federated network of national partners who host local chapters of the TechnoXian World Cup.
            </p>
            <button onClick={() => setView('partners')} className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
              Explore Partner Directory <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-slate-100 p-6 rounded-2xl">
              <Globe className="text-slate-400 mb-4" size={32} />
              <div className="font-bold text-slate-900">95+ Nations</div>
              <div className="text-sm text-slate-500">Active Chapters</div>
            </div>
            <div className="bg-slate-100 p-6 rounded-2xl">
              <Building className="text-slate-400 mb-4" size={32} />
              <div className="font-bold text-slate-900">300+ Cities</div>
              <div className="text-sm text-slate-500">Zonal Events</div>
            </div>
          </div>
        </div>
      </section>
    )}

    {!siteConfig.is_partner && <LogoTicker />}

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

    <section className="py-20 bg-[#0f172a] trophy-grid">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white">Technoxian Trophies</h2>
            <ChevronRight size={20} className="text-white/40" />
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#0f172a] to-transparent"></div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#0f172a] to-transparent"></div>
          <div ref={trophyScrollRef} className="overflow-x-auto scrollbar-hide pb-0" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-8 snap-x snap-mandatory">
              {Array.from({ length: 11 }, (_, i) => 2025 - i).map((year, idx) => (
                <motion.div
                  key={year}
                  whileHover={{ y: -6, scale: 1.02, rotateX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="snap-start min-w-[300px] md:min-w-[360px] text-center"
                >
                  <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl flex flex-col items-center card-shine">
                    <div className="relative w-full h-80 md:h-96 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20 trophy-bg" />
                      <img
                        src={TROPHY_IMAGES[idx % TROPHY_IMAGES.length]}
                        alt={`Technoxian World Cup ${year}`}
                        className="max-h-[18rem] md:max-h-[22rem] object-contain drop-shadow-2xl"
                        onError={(e) => (e.currentTarget.src = FALLBACK_TROPHY_URL)}
                      />
                    </div>
                    <div
                      className={`${
                        siteConfig.is_partner
                          ? 'bg-emerald-600/20 text-emerald-200 ring-1 ring-emerald-500/30'
                          : 'bg-blue-600/20 text-blue-200 ring-1 ring-blue-500/30'
                      } px-5 py-2 rounded-xl font-bold tracking-wider uppercase text-xs -mt-2`}
                    >
                      {year}
                    </div>
                  </div>
                  <div className="mt-3 text-white font-bold text-sm">{`Technoxian World Cup '${String(year).slice(2)}`}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
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
              {NEWS_ITEMS.slice(0, 1).map((news) => (
                <article key={news.id} className="flex flex-col h-full space-y-3">
                  {news.featuredImage && (
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img
                        src={news.featuredImage}
                        alt={news.title}
                        className="w-full h-[180px] object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 uppercase">{news.category}</span>
                    <span className="text-xs text-slate-400">{news.date}</span>
                  </div>
                  <h3
                    className="text-xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                    onClick={() => setView(`news-${news.id}`)}
                  >
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow line-clamp-3">{news.body || news.desc}</p>
                  <div>
                    <button
                      onClick={() => setView(`news-${news.id}`)}
                      className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1 self-start"
                    >
                      Continue Reading
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
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
              <motion.div
                key={latestNewsIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-3"
              >
                {(() => {
                  const items = NEWS_ITEMS.slice(1);
                  const extended = [...items, ...items];
                  const start = latestNewsIndex % items.length;
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
              <motion.div
                key={mostReadIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-3"
              >
                {(() => {
                  const items = NEWS_ITEMS.slice(1).reverse();
                  const extended = [...items, ...items];
                  const start = mostReadIndex % items.length;
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
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default HomeView;

