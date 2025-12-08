import { Shield, Trophy, MapPin, Calendar, ArrowRight, Users, Globe, Building, ChevronRight } from 'lucide-react';
import LogoTicker from '../components/LogoTicker';
import { NEWS_ITEMS } from '../constants/data';

const HomeView = ({ setView, siteConfig }) => (
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
              {siteConfig.is_partner ? 'Building the' : 'Regulating the'} <br />
              <span className={siteConfig.is_partner ? 'text-emerald-400' : 'text-blue-400'}>Sport of Robotics</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              {siteConfig.is_partner
                ? `Technoxian ${siteConfig.name.split(' ')[1]} hosts the premier regional qualifiers. Join your local club, compete in zonal events, and qualify for the World Cup.`
                : "Worso sets the standards, affiliates nations, and governs the world's largest autonomous sports ecosystem. From local clubs to the World Cup."}
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <button
                onClick={() => setView('technoxian')}
                className={`${siteConfig.colors.primary} px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg flex items-center gap-2 hover:-translate-y-1`}
              >
                {siteConfig.is_partner ? 'View Local Events' : 'Explore Technoxian'} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setView('teams')}
                className="bg-transparent border border-white/20 hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2"
              >
                <Users size={18} /> Find Teams
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

    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Latest News</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((news) => (
            <div key={news.id} className="group cursor-pointer">
              <div className="h-48 bg-slate-100 rounded-xl mb-4 relative overflow-hidden">
                <div className={`absolute top-4 left-4 text-[10px] font-bold text-white px-2 py-1 rounded uppercase ${news.tag === 'REGULATION' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {news.tag}
                </div>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{news.date}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{news.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default HomeView;

