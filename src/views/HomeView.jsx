import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, MapPin, Calendar, ArrowRight, Users, Globe, Building, ChevronRight, Network, ServerCog, LayoutDashboard } from 'lucide-react';
import LogoTicker from '../components/LogoTicker';

const HomeView = ({ setView, siteConfig, newsItems = [], newsLoading, newsError }) => {
  void motion;
  const [latestNewsIndex, setLatestNewsIndex] = useState(0);
  const [mostReadIndex, setMostReadIndex] = useState(0);
  const [selectedMembership, setSelectedMembership] = useState(null);


  const preparedNews = useMemo(() => newsItems.filter(Boolean), [newsItems]);
  const headline = preparedNews[0];
  const latestPool = preparedNews.slice(1);
  const mostReadPool = [...preparedNews].reverse().slice(1);

  useEffect(() => {
    if (latestPool.length < 2) return undefined;
    const latestInterval = setInterval(() => {
      setLatestNewsIndex((prev) => (prev + 1) % latestPool.length);
    }, 4000);
    return () => clearInterval(latestInterval);
  }, [latestPool.length]);

  useEffect(() => {
    if (mostReadPool.length < 2) return undefined;
    const mostReadInterval = setInterval(() => {
      setMostReadIndex((prev) => (prev + 1) % mostReadPool.length);
    }, 4500);
    return () => clearInterval(mostReadInterval);
  }, [mostReadPool.length]);

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
              {siteConfig.is_partner ? 'The governing body ' : 'The governing body'} <br />
              <span className={siteConfig.is_partner ? 'text-emerald-400' : 'text-blue-400'}>for sport of robotics.</span>
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

    {/* Video Section */}
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Latest Videos</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('videos')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              See More
              <ChevronRight size={18} />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const container = document.getElementById('video-carousel');
                  container.scrollBy({ left: -400, behavior: 'smooth' });
                }}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Previous videos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const container = document.getElementById('video-carousel');
                  container.scrollBy({ left: 400, behavior: 'smooth' });
                }}
                className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Next videos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div id="video-carousel" className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
            <div className="flex space-x-8">
              {[
                {
                  id: 1,
                  title: 'Championship Finals 2023 Highlights',
                  date: 'Mar 15, 2023',
                  description: 'Watch the most exciting moments from the championship finals.',
                  duration: '12:45'
                },
                {
                  id: 2,
                  title: 'Behind the Scenes: Team Preparations',
                  date: 'Feb 28, 2023',
                  description: 'Exclusive look at how teams prepare for the big competition.',
                  duration: '8:22'
                },
                {
                  id: 3,
                  title: 'Robot Showcase: Best of 2023',
                  date: 'Feb 15, 2023',
                  description: 'See the most innovative robot designs from this year\'s competition.',
                  duration: '15:30'
                },
                {
                  id: 4,
                  title: 'Interview with the Champions',
                  date: 'Feb 1, 2023',
                  description: 'Hear from the winning team about their journey to victory.',
                  duration: '9:45'
                },
                {
                  id: 5,
                  title: 'Judges Panel Discussion',
                  date: 'Jan 20, 2023',
                  description: 'Our judges discuss what makes a winning performance.',
                  duration: '18:15'
                },
                {
                  id: 6,
                  title: 'Future of Robotics Competition',
                  date: 'Jan 5, 2023',
                  description: 'Experts discuss emerging trends in competitive robotics.',
                  duration: '22:10'
                }
              ].map((video) => (
                <div key={video.id} className="flex-shrink-0 w-[320px] snap-start bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="relative pt-[56.25%] bg-slate-100 overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 ml-1">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-sm text-slate-500 mb-2 font-medium">{video.date}</div>
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 mb-3 leading-tight">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

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

    <section className="py-20 bg-slate-50 border-t border-slate-200">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="text-center mb-14">
      <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
        WORSO Membership
      </span>
      <h2 className="text-4xl font-extrabold text-slate-900 mt-3">
        Choose Your Membership Plan
      </h2>
      <p className="text-slate-600 max-w-3xl mx-auto mt-4">
        Become a part of the global robotics sports ecosystem with institutional,
        professional, or corporate membership privileges.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          id: 'institute',
          title: 'Institute Membership',
          price: 'USD 200/year',
          audience: 'Schools / Colleges / Universities / Vocational Institutes',
          icon: Shield,
          highlights: [
            'Accredited as a WORSO Robotics Sports Institution',
            'Official WORSO Institutional Member Badge for branding & promotions',
            'Recognition on the global WORSO website & partner directories',
            'Support to set up Robotics Labs, STEM Labs & AI Labs and RoboClubs',
            'Eligibility to become a WORSO Authorized Training & Competition Center',
            'Access to a global network of mentors, trainers & industry leaders',
            'Participation in WORSO talent drives & internship fairs',
            'Opportunities for scholarships, international contests & innovation grants',
            'Access to WORSO Championships including Technoxian (Entries via RoboClub)',
            'Hosting opportunities (District Championships / Bootcamps / Events)',
            'Discounts on event registrations, booths & travel packages',
            'Collaboration opportunities with CSR partners for student outreach',
            'Opportunity to run CSR-funded STEM sessions led by WORSO experts',
            'Industry partnerships for innovation, research & technology adoption',
            'Opportunity to co-create robotics competitions or STEM programs',
            'Business linkage support for robotics procurement & facility setup',
            'Collaboration with industry, research labs & universities',
            'Opportunities for funding / discounts on showcasing innovations',
            'Invitations to global panel discussions, seminars & B2B meets',
            'Participation in international collaboration & exchange programs',
            'Connection with global robotics sports federations & teams',
            'Student & faculty discounts on WORSO certifications',
            'Year-round training in robotics, AI, drones, IoT & prototyping',
            'Structured modules for curricular & extracurricular integration',
            'Participation in STEM education policy roundtables',
            'Opportunity to join WORSO Academic Advisory Board',
            'Eligibility to become District / State WORSO Partner Institution',
            'Rights to host district/state-level robotics competitions'
          ]
        },
        {
          id: 'professional',
          title: 'Professional Membership',
          price: 'USD 100/year',
          audience: 'Coaches / Trainers / Innovators / High Value Partners',
          icon: Users,
          highlights: [
            'WORSO Certified Professional Member Badge',
            'Global listing in the WORSO Certified Experts Directory',
            'Use of WORSO branding for personal workshops & training programs',
            'Authorized Trainer status for WORSO-certified training centers',
            'Priority selection to set up Robotics Clubs & Training Labs',
            'Visibility among schools & colleges seeking mentors',
            'Participation in WORSO talent drives',
            'Opportunity to build high-performing robotics teams & portfolios',
            'Mentorship opportunities in national & international competitions',
            'Priority access to WORSO & Partner events',
            'Invitations for speaker slots, panel discussions & jury roles',
            'Discounted or free passes to events & conferences',
            'Paid or volunteer CSR STEM program opportunities',
            'Priority involvement in government & NGO-backed initiatives',
            'Access to coaching & training opportunities',
            'Opportunity to become WORSO Certified Trainer',
            'Ability to create & publish modules on WORSO Learning Platform',
            'Eligibility to register projects under WORSO Innovation Network',
            'Access to industry connections & technology hubs',
            'Opportunity to submit whitepapers or research',
            'Invitations to global seminars & B2B meets',
            'Connection with global robotics coaches & innovators',
            'International visibility & representation opportunities',
            'Collaborations with startups, institutions & corporates',
            'Discounted WORSO & partner certification programs',
            'Free access to selected webinars & career sessions',
            'Access to exclusive knowledge hubs & research papers',
            'Contribution to global robotics sports framework',
            'Eligibility to become District / State WORSO Partner',
            'Recognition as WORSO Ambassador for your region'
          ]
        },
        {
          id: 'corporate',
          title: 'Corporate Membership',
          price: 'USD 500/year',
          audience: 'Companies / NGOs / Startups',
          icon: Building,
          highlights: [
            'Official WORSO Corporate Member Badge for brand credibility',
            'Listing on WORSO Global Directory as recognized partner',
            'Brand exposure across WORSO social media & press releases',
            'Priority access to Robotics Labs, STEM Labs & AI Centers',
            'Ability to co-establish WORSO-branded Maker Spaces',
            'Priority access to top student innovators from WORSO leagues',
            'Campus outreach programs coordinated by WORSO',
            'Internship & placement support through robotics institutions',
            'Priority invitations to Technoxian & global tournaments',
            'Discounted exhibition booths & sponsorship packages',
            'Live product demos & technology showcases',
            'Ready-to-deploy STEM labs & robotics programs for CSR',
            'Opportunities to sponsor underprivileged students & teams',
            'Access to high-quality network of institutions & startups',
            'Partnership opportunities for innovation labs & R&D',
            'B2B matchmaking with robotics manufacturers & solution providers',
            'Joint R&D programs with universities & labs',
            'Opportunity to submit whitepapers & research',
            'Exclusive access to global forums with industry leaders',
            'Participation in international delegations & trade missions',
            'Networking with policymakers & academic experts',
            'Corporate discounts on WORSO certifications & training',
            'Priority access to executive-level workshops',
            'Access to WORSO policy discussions & industry standards',
            'Eligibility to become WORSO Technology / Event / Regional Partner',
            'Opportunity to host state & district robotics leagues'
          ]
        }
      ].map((plan) => {
        const Icon = plan.icon;
        const isSelected = selectedMembership === plan.id;

        return (
          <div
            key={plan.id}
            onClick={() => setSelectedMembership(plan.id)}
            className={`relative cursor-pointer rounded-3xl border transition-all duration-300 p-8 bg-white
              ${isSelected
                ? 'border-blue-600 shadow-xl scale-[1.03]'
                : 'border-slate-200 hover:shadow-lg hover:-translate-y-1'
              }`}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">
                Selected
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
                <p className="text-xs text-slate-500">{plan.audience}</p>
              </div>
            </div>

            <div className="text-3xl font-extrabold text-slate-900 mb-6">
              {plan.price}
            </div>

            <ul className="space-y-2 mb-8 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
              {plan.highlights.map((item, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-xl font-bold transition-all
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                }`}
            >
              Select Plan
            </button>
          </div>
        );
      })}
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