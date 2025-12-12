import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Cpu, Shield, Users, Globe2, Map, ClipboardList, Lock, Layers } from 'lucide-react';

const AboutLayout = ({ setView }) => {
  const [activeSection, setActiveSection] = useState('governance');
  void motion;

  const renderContent = () => {
    switch (activeSection) {
      case 'governance':
        return (
          <div className="space-y-8">
            {/* Mission Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                WORSO is the global regulatory root for the sport of robotics—writing the laws of play, publishing safety protocols, and certifying every affiliated event. Federation over
                centralization keeps local context alive while the core stays immutable.
              </p>
            </div>

            {/* Vision Section */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To be the recognized global leader in eSport, driving its growth and development as a legitimate and respected sport, fostering a thriving professional landscape, and promoting its positive impact on society.
              </p>
            </div>

            {/* Values Section */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Our Core Values</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Shield size={16} />,
                    title: "Integrity",
                    description: "We uphold the highest standards of ethical conduct and fair play in all aspects of eSport.",
                    color: "blue"
                  },
                  {
                    icon: <Cpu size={16} />,
                    title: "Innovation",
                    description: "We embrace innovation and technological advancements to continuously improve the eSport experience for all stakeholders.",
                    color: "purple"
                  },
                  {
                    icon: <Users size={16} />,
                    title: "Inclusivity",
                    description: "We are committed to fostering a diverse and inclusive eSport community where everyone feels welcome and empowered to participate.",
                    color: "pink"
                  },
                  {
                    icon: <Award size={16} />,
                    title: "Excellence",
                    description: "We strive for excellence in all aspects of our operations, setting the highest benchmarks for professional eSport.",
                    color: "green"
                  },
                  {
                    icon: <Globe2 size={16} />,
                    title: "Sustainability",
                    description: "We advocate for responsible and sustainable practices within the eSport industry, ensuring its long-term growth and positive impact.",
                    color: "emerald"
                  },
                  {
                    icon: <Users size={16} />,
                    title: "Community",
                    description: "We are committed to building a strong and engaged eSport community where players, fans, and organizers can connect and thrive.",
                    color: "indigo"
                  }
                ].map((value, index) => (
                  <div key={index} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase text-${value.color}-600`}>
                      {value.icon} {value.title}
                    </div>
                    <p className="text-sm text-slate-600 mt-3">{value.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 italic mt-4">
                Through these core values, WORSO aims to establish eSport as a mainstream sport, recognized for its athleticism, competitive spirit, and positive impact on society.
              </p>
            </div>
          </div>
        );
      case 'president':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* President's Image and Name - Left Side */}
              <div className="md:w-1/4 space-y-4">
                <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[3/4] max-w-[280px] mx-auto">
                  <img 
                    src="https://worso.org/images/executive-committee/rajkumar.png" 
                    alt="Raj Kumar Sharma, President of International Federation of Esports"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLjUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjEwOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+'
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-900">Raj Kumar Sharma</p>
                  <p className="text-blue-600 font-medium">President, International Federation of Esports</p>
                </div>
              </div>
              
              {/* President's Message - Right Side */}
              <div className="md:w-3/4 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">WORSO Leadership</h2>
                  <div className="w-16 h-1 bg-blue-600 mb-6"></div>
                </div>
                
                
                <p className="text-lg text-slate-700 leading-relaxed">
                  Attention all esports associations, fans, players, and pioneers!
                </p>
                
                <p className="text-slate-600 leading-relaxed">
                  As we stand at the threshold of a new year, brimming with potential and possibility, I wanted to take this moment to address you, the vibrant heart of the global esports community.
                </p>
                
                <p className="text-slate-600 leading-relaxed">
                  The past year has been nothing short of extraordinary for esports. We've witnessed breathtaking moments of skill, witnessed esports break new barriers of mainstream acceptance, and experienced the power of our community coming together as one.
                </p>
                
                <p className="text-slate-600 leading-relaxed">
                  From the electrifying finals of the World Cup 7.0 - TechnoXian, where nations battled for esports glory, to the record-breaking viewership of major tournaments, to the grassroots passion evident in local communities around the world, we've seen the undeniable growth and resilience of our beloved sport.
                </p>
                
                <p className="text-slate-600 leading-relaxed">
                  But this, my friends, is just the beginning. As the International Federation of Esports (WORSO), We are committed to nurturing this momentum and propelling esports to even greater heights. In the coming year, we will strive to:
                </p>
                
                <ul className="space-y-3 list-disc pl-5 text-slate-600">
                  <li><span className="font-medium">Champion a level playing field:</span> We will continue to advocate for fair competition at all levels, ensuring everyone has the opportunity to reach their full potential.</li>
                  <li><span className="font-medium">Foster sustainable growth:</span> We will work tirelessly to support infrastructure development, empower local communities, and create pathways for aspiring players and professionals.</li>
                  <li><span className="font-medium">Bridge the digital divide:</span> We will break down barriers to entry and ensure that everyone, regardless of socioeconomic background, can access the incredible opportunities esports offers.</li>
                  <li><span className="font-medium">Promote responsible gameplay:</span> We will champion principles of sportsmanship, ethical conduct, and player well-being, ensuring that esports remains a healthy and inclusive environment for all.</li>
                  <li><span className="font-medium">Elevate esports to its rightful place:</span> We will continue to collaborate with key stakeholders, including traditional sports organizations, governments, and educational institutions, to secure esports' rightful place as a respected and recognized sport.</li>
                </ul>
                
                <p className="text-slate-600 leading-relaxed">
                  But none of this will be possible without you, the incredible esports community. We need your passion, your dedication, and your unwavering belief in the power of esports.
                </p>
                
                <p className="text-slate-600 leading-relaxed">
                  So, let's step into this new year together, united by our love for the game and our shared vision for the future. Let's strive for excellence, inspire each other, and continue to build a vibrant, inclusive, and sustainable esports landscape that benefits players, teams, organizations, and fans alike.
                </p>
                
                <p className="text-slate-700 font-medium text-lg">
                  Together, we can make esports more than just a game. We can make it a platform for connection, opportunity, and positive impact. Let's make this year the year esports truly reaches its full potential!
                </p>
                
                <p className="text-slate-800 font-medium mt-8 text-lg">
                  Onward and upward, esport family!
                </p>
                
                <p className="text-slate-600 mt-10">
                  With unwavering support,
                </p>
                <p className="text-slate-900 font-semibold">
                  Raj Kumar Sharma
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mt-8">
              <h4 className="font-bold mb-2">Global Mandate</h4>
              <p className="text-slate-600">As the International Federation of Esports, WORSO is committed to governing and promoting esports worldwide, ensuring fair play, integrity, and the continued growth of our sport.</p>
            </div>
          </div>
        );
      case 'advisory':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Advisory Board</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Dr. Sarah Chen',
                  role: 'Technology & AI Expert',
                  country: 'Singapore',
                  flag: '🇸🇬',
                  image: 'https://randomuser.me/api/portraits/women/44.jpg'
                },
                {
                  name: 'James Wilson',
                  role: 'Sports Governance',
                  country: 'United Kingdom',
                  flag: '🇬🇧',
                  image: 'https://randomuser.me/api/portraits/men/32.jpg'
                },
                {
                  name: 'Aisha Al-Mansoori',
                  role: 'Fan Engagement',
                  country: 'UAE',
                  flag: '🇦🇪',
                  image: 'https://randomuser.me/api/portraits/women/68.jpg'
                },
                {
                  name: 'Carlos Mendez',
                  role: 'Esports Integrity',
                  country: 'Brazil',
                  flag: '🇧🇷',
                  image: 'https://randomuser.me/api/portraits/men/75.jpg'
                },
                {
                  name: 'Yuki Tanaka',
                  role: 'Event Operations',
                  country: 'Japan',
                  flag: '🇯🇵',
                  image: 'https://randomuser.me/api/portraits/women/33.jpg'
                },
                {
                  name: 'Marcus Johnson',
                  role: 'Broadcast & Media',
                  country: 'USA',
                  flag: '🇺🇸',
                  image: 'https://randomuser.me/api/portraits/men/45.jpg'
                },
                {
                  name: 'Fatima Zahra',
                  role: 'Youth Development',
                  country: 'Morocco',
                  flag: '🇲🇦',
                  image: 'https://randomuser.me/api/portraits/women/52.jpg'
                },
                {
                  name: 'Andrei Petrov',
                  role: 'Technical Director',
                  country: 'Russia',
                  flag: '🇷🇺',
                  image: 'https://randomuser.me/api/portraits/men/67.jpg'
                }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative pt-[100%] bg-slate-100">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLjUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjEwOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+'
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{member.role}</p>
                    <div className="mt-3 flex items-center text-sm text-slate-500">
                      <span className="text-lg mr-2">{member.flag}</span>
                      {member.country}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'affiliation':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Affiliation Process</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Apply for a partner subdomain (e.g., uae.worso.org). On approval, you receive admin credentials, middleware keys, and field-level CMS permissions.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Globe2 size={18} className="text-blue-600" /> Steps
                </div>
                {['Submit federation charter', 'Security & safety audit', 'Assign subdomain + theme', 'Go-live with local content JSON'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600">{i + 1}</span>
                    <span className="text-sm text-slate-600">{step}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-600" /> What Partners Control
                </div>
                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                  <li>Local welcome message & language</li>
                  <li>Local event gallery and news</li>
                  <li>Team registrations & ticketing data</li>
                </ul>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mt-3">
                  <Lock size={14} /> Global brand, logo, and rulebook stay locked.
                </div>
              </div>
            </div>
          </div>
        );
      case 'working':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Working at WORSO</h2>
            <p className="text-slate-600 mb-6">Join a team of visionaries, engineers, and sports management professionals.</p>
            <button onClick={() => setView('careers')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
              View Openings
            </button>
          </div>
        );
      case 'data':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Data Layer: Teams & Rankings</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">World ranks, prize pools, rosters, and Technoxian history stay centralized and are surfaced to every micro-site.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Global Rank</div>
                <div className="text-2xl font-extrabold text-blue-600">#1 - #5000</div>
                <p className="text-sm text-slate-600 mt-2">Unified ladder feeds partner directories.</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Prize Money</div>
                <div className="text-2xl font-extrabold text-slate-900">$250k+ pool</div>
                <p className="text-sm text-slate-600 mt-2">Transparent payouts with audit-ready logs.</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Roster Cards</div>
                <div className="text-2xl font-extrabold text-emerald-600">Field-level lock</div>
                <p className="text-sm text-slate-600 mt-2">Players sync from HQ; partners can localize bios.</p>
              </div>
            </div>
          </div>
        );
      case 'partners':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Partner Network</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">Subdomains route through middleware: `*.worso.org` resolves tenant, injects theme, and serves local content.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 mb-2">
                  <Map size={16} /> Directory
                </div>
                <p className="text-sm text-slate-600">Map + list of partners with status badges (live, onboarding, prospect).</p>
                <p className="text-xs text-slate-500 mt-2">Example: uae.worso.org, india.worso.org, korea.worso.org.</p>
              </div>
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 mb-2">
                  <Layers size={16} /> Micro-Site Shell
                </div>
                <p className="text-sm text-slate-600">One React codebase, multi-tenant middleware, JSON-driven assets (logo, hero, translations, sponsors).</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="animate-fadeIn bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[56px] z-30">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
          {[
            { id: 'governance', label: 'Mission & Vision' },
            { id: 'president', label: "President's Message" },
            { id: 'advisory', label: 'Advisory Board' },
            { id: 'affiliation', label: 'Affiliation' },
            { id: 'data', label: 'Data Layer' },
            { id: 'partners', label: 'Partner Network' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                activeSection === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="bg-[#0f172a] rounded-3xl text-white p-12 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">Root Governance</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Governance</h1>
          <p className="text-slate-200 text-lg max-w-3xl mb-6">
            Mission, mandate, affiliation, data, and the federated partner network that powers the sport of robotics.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
              <div className="text-xs font-bold uppercase text-slate-200">Mode</div>
              <div className="text-lg font-extrabold text-white">Federated</div>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
              <div className="text-xs font-bold uppercase text-slate-200">Rulebook</div>
              <div className="text-lg font-extrabold text-emerald-200">v2.0</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[600px] transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AboutLayout;

