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
} from 'lucide-react';
import LogoTicker from '../components/LogoTicker';

const HomeView = ({ setView, siteConfig, newsItems = [], newsLoading, newsError }) => {
  void motion;

  const [latestNewsIndex, setLatestNewsIndex] = useState(0);
  const [mostReadIndex, setMostReadIndex] = useState(0);
  const [selectedMembership, setSelectedMembership] = useState(null);

  /** ✅ FIX: parent-controlled open state (Zoom-style) */
  const [openRows, setOpenRows] = useState({});
  
  /** ✅ NEW: Hover state for comparison rows */
  const [hoveredRow, setHoveredRow] = useState(null);

  const preparedNews = useMemo(() => newsItems.filter(Boolean), [newsItems]);
  const headline = preparedNews[0];
  const latestPool = preparedNews.slice(1);
  const mostReadPool = [...preparedNews].reverse().slice(1);

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

  /* =============================
     Comparison Row (UPDATED with hover effects)
  ============================== */
  function ComparisonRow({ row, index }) {
    const isOpen = !!openRows[index];
    const isHovered = hoveredRow === index;

    return (
      <tr 
        className="hover:bg-slate-50 transition-colors duration-200"
        onMouseEnter={() => setHoveredRow(index)}
        onMouseLeave={() => setHoveredRow(null)}
      >
        <td className="p-5 align-top relative">
          <div className="flex flex-col">
            <button
              onClick={() =>
                setOpenRows(prev => ({
                  ...prev,
                  [index]: !prev[index],
                }))
              }
              className="flex items-start gap-2 text-left w-full group"
            >
              <ChevronDown
                size={16}
                className={`mt-1 transition-transform ${isOpen ? 'rotate-180' : ''
                  }`}
              />
              <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                {row.title}
              </span>
            </button>

            {/* Hover Tooltip */}
            {(isHovered || isOpen) && (
              <div className="mt-3">
                <p className="text-sm text-slate-600 max-w-xl bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                  {row.desc}
                </p>
                {isHovered && !isOpen && (
                  <div className="text-xs text-slate-500 mt-2 italic">
                    Click to keep open
                  </div>
                )}
              </div>
            )}
          </div>
        </td>

        {row.values.map((v, i) => (
          <td key={i} className="p-5 text-center text-lg">
            {v === true && (
              <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓
              </span>
            )}
            {v === false && (
              <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                ✗
              </span>
            )}
            {v === null && (
              <span className="text-slate-400">—</span>
            )}
          </td>
        ))}
      </tr>
    );
  }

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
                  className={`rounded-xl p-6 mb-4 bg-gradient-to-r ${siteConfig.is_partner ? 'from-emerald-600 to-teal-600' : 'from-blue-600 to-indigo-600'
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
                    <path d="m15 18-6-6 6-6" />
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
                    <path d="m9 18 6-6-6-6" />
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

      <section className="bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl py-28">

          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              WORSO Membership
            </span>
            <h1 className="text-5xl font-extrabold text-slate-900 mt-4">
              Membership plans for every role
            </h1>
            <p className="text-lg text-slate-600 mt-6">
              Join the global robotics sports ecosystem — whether you're an institution,
              professional, or organization.
            </p>
            <p className="text-sm text-slate-500 mt-3">
              * All plans are billed annually
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-10">
            {[
              {
                id: 'institute',
                title: 'Institute',
                price: 'USD 200',
                subtitle: 'Schools, Colleges & Universities',
                points: [
                  'Institutional Accreditation',
                  'Robotics & STEM Lab Support',
                  'Student Competitions & Championships',
                  'CSR & Industry Collaborations'
                ]
              },
              {
                id: 'professional',
                title: 'Professional',
                price: 'USD 100',
                subtitle: 'Coaches, Trainers & Innovators',
                points: [
                  'Certified Professional Badge',
                  'Global Expert Listing',
                  'Mentorship & Jury Roles',
                  'International Visibility'
                ]
              },
              {
                id: 'corporate',
                title: 'Corporate',
                price: 'USD 500',
                subtitle: 'Companies, NGOs & Startups',
                points: [
                  'Corporate Brand Recognition',
                  'CSR & Campus Outreach',
                  'Innovation & R&D Partnerships',
                  'Talent Access & Hiring'
                ]
              }
            ].map(plan => {
              const active = selectedMembership === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedMembership(plan.id)}
                  className={`relative bg-white rounded-3xl border p-10 cursor-pointer transition-all
              ${active
                      ? 'border-blue-600 shadow-2xl scale-[1.04]'
                      : 'border-slate-200 hover:shadow-xl hover:-translate-y-1'
                    }`}
                >
                  {active && (
                    <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Selected
                    </span>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {plan.subtitle}
                  </p>

                  <div className="mt-8 mb-8">
                    <span className="text-5xl font-extrabold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-sm text-slate-500"> / year</span>
                  </div>

                  <ul className="space-y-3 mb-10">
                    {plan.points.map((p, i) => (
                      <li key={i} className="flex gap-2 text-slate-600">
                        <span className="mt-1 w-2 h-2 rounded-full bg-blue-600"></span>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl font-bold transition
                ${active
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white'
                      }`}
                  >
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl py-24">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">
              Compare all membership features
            </h2>
            <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
              Explore detailed benefits across Institute, Professional, and Corporate
              memberships. Hover over each feature to see details, or click to keep them open.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border bg-white">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-5 text-left text-sm font-bold text-slate-700">
                    Feature
                  </th>
                  <th className="p-5 text-center text-sm font-bold">Institute</th>
                  <th className="p-5 text-center text-sm font-bold">Professional</th>
                  <th className="p-5 text-center text-sm font-bold">Corporate</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {[
                  {
                    title: 'Official Membership Recognition',
                    desc:
                      'Formal recognition by WORSO with official badges, listings, and credibility across global platforms.',
                    values: [true, true, true],
                  },
                  {
                    title: 'Global Directory Listing',
                    desc:
                      'Visibility on WORSO\'s official global directories accessed by institutions, students, partners, and governments.',
                    values: [true, true, true],
                  },
                  {
                    title: 'Robotics, STEM & AI Lab Support',
                    desc:
                      'Support for setting up or accessing robotics labs, STEM labs, AI innovation centers, and RoboClubs.',
                    values: [true, false, true],
                  },
                  {
                    title: 'Training, Mentorship & Coaching Roles',
                    desc:
                      'Opportunities to train, mentor, coach, judge competitions, and lead innovation programs.',
                    values: [false, true, false],
                  },
                  {
                    title: 'Competitions & Championships Access',
                    desc:
                      'Participation and hosting rights for district, state, national, and international robotics championships.',
                    values: [true, true, true],
                  },
                  {
                    title: 'CSR & Outreach Programs',
                    desc:
                      'Participation in CSR initiatives, STEM outreach, underprivileged student programs, and community development.',
                    values: [true, true, true],
                  },
                  {
                    title: 'Industry, Research & R&D Collaboration',
                    desc:
                      'Collaboration opportunities with industry partners, research labs, universities, and innovation councils.',
                    values: [true, true, true],
                  },
                  {
                    title: 'Policy, Advisory & Leadership Roles',
                    desc:
                      'Involvement in policy discussions, advisory boards, framework development, and leadership committees.',
                    values: [true, true, true],
                  },
                  {
                    title: 'Hosting & Partnership Rights',
                    desc:
                      'Rights to host leagues, competitions, innovation labs, and become regional, technology, or event partners.',
                    values: [true, false, true],
                  },
                ].map((row, i) => (
                  <ComparisonRow
                    key={i}
                    row={row}
                    index={i}
                  />
                ))}
              </tbody>
            </table>
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