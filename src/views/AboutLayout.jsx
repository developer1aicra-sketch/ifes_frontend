import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Cpu, Shield, Users, Globe2, Map, ClipboardList, Lock, Layers, ArrowRight, Building, Trophy, FileText, Mail, Phone, Calendar, BookOpen, Code, GraduationCap, Megaphone, Target, Rocket, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutLayout = ({ setView }) => {
  const [activeSection, setActiveSection] = useState('governance');
  const navigate = useNavigate();
  void motion;

  const renderContent = () => {
    switch (activeSection) {
      case 'governance':
        return (
          <div className="space-y-8">
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
                    <div className="text-xs font-bold uppercase text-slate-200">Associations</div>
                    <div className="text-lg font-extrabold text-emerald-200">95+ Nations</div>
                  </div>
                </div>
              </div>
            </div>
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

      case 'board':
        return (
          <div className="space-y-8">
            {/* Board Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Board of Directors</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                The Executive Committee of the World Robotics Sports Organization (WORSO) is composed of esteemed leaders in the esports industry, tasked with guiding the federation's strategic vision and policies. They oversee global initiatives, drive the growth of competitive gaming, and ensure fair, inclusive practices. By fostering collaboration with national organizations, governments, and stakeholders, the committee plays a pivotal role in shaping the future of esports worldwide and ensuring its sustainable development.
              </p>
            </div>

            {/* Board Members Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Raj Kumar Sharma',
                  role: 'President, World Robotics Sports Organization (WORSO)',
                  img: 'https://worso.org/images/executive-committee/rajkumar.png',
                  email: 'raj.sharma@worso.org',
                  phone: '+1 (555) 123-4567'
                },
                {
                  name: 'Ajay Pratap Singh',
                  role: 'Director Marketing',
                  img: 'https://worso.org/images/executive-committee/AjayPratapSingh.png',
                  email: 'ajay.singh@worso.org',
                  phone: '+1 (555) 123-4568'
                },
                {
                  name: 'Navin Chhabra',
                  role: 'Director Operations',
                  img: 'https://worso.org/images/executive-committee/navin.png',
                  email: 'navin.chhabra@worso.org',
                  phone: '+1 (555) 123-4569'
                },
                {
                  name: 'Rahul Chakraborty',
                  role: 'Director - Esports Startups',
                  img: 'https://worso.org/images/executive-committee/rahul.png',
                  email: 'rahul.chakraborty@worso.org',
                  phone: '+1 (555) 123-4570'
                },
                {
                  name: 'Homa Siddiqui',
                  role: 'Strategy Manager- Tech Sports',
                  img: 'https://worso.org/images/executive-committee/homa.png',
                  email: 'homa.siddiqui@worso.org',
                  phone: '+1 (555) 123-4571'
                },
              ].map((member, index) => (
                <div
                  key={member.name}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center hover:border-blue-200"
                >
                  {/* Circular Image Container */}
                  <div className="relative w-48 h-48 mb-6">
                    <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-100 transition-colors duration-300">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                              <rect width="400" height="400" fill="#f1f5f9"/>
                              <circle cx="200" cy="150" r="80" fill="#9da8ab"/>
                              <circle cx="200" cy="380" r="120" fill="#9da8ab"/>
                            </svg>
                          `)}`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {member.role}
                    </p>

                    {/* Contact Info */}
                    <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                          <Mail size={14} />
                          <span className="truncate">{member.email}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                          <Phone size={14} />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors duration-200 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    onClick={() => console.log(`View ${member.name}'s profile`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Meeting Info */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="text-blue-600" size={24} />
                    <h3 className="text-xl font-bold text-slate-900">Board Meetings</h3>
                  </div>
                  <p className="text-slate-600 mb-4">
                    The Board of Directors convenes quarterly to review progress, set strategic direction, and make key decisions for WORSO's global operations.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <Calendar size={16} />
                    <span>Next Meeting: March 15, 2024</span>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-slate-600" size={24} />
                    <h3 className="text-xl font-bold text-slate-900">Key Responsibilities</h3>
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Strategic planning and policy development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Financial oversight and budget approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Global partnership and stakeholder management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Esports development and growth initiatives</span>
                    </li>
                  </ul>
                </div>
              </div>
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
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLiUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjEwOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+'
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
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLiUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjEwOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+'
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

      case 'federation-services':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe2 className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Federation Services</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                The World Robotics Sports Organization (WORSO) plays a multifaceted role in fostering the growth and development of esports on a global scale. Here's a breakdown of potential services the IFES could offer to its members.
              </p>
            </div>

            {/* Services Grid */}
            <div className="space-y-12">
              {/* Development and Standardization */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Code className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Development and Standardization</h3>
                    <p className="text-slate-600 mt-2">Establishing global standards and ethical frameworks</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Competitive Guidelines</h4>
                    <p className="text-sm text-slate-600">Establish standardized rules and regulations for different esports genres, ensuring fair play and consistency across tournaments.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Discipline Development</h4>
                    <p className="text-sm text-slate-600">Define and recognize new esports disciplines, potentially in collaboration with game developers and publishers.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Ethical Conduct</h4>
                    <p className="text-sm text-slate-600">Implement and enforce anti-doping rules, anti-cheating measures, and ethical guidelines for players, teams, and organizers.</p>
                  </div>
                </div>
              </div>

              {/* Education and Support */}
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <GraduationCap className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Education and Support</h3>
                    <p className="text-slate-600 mt-2">Empowering the esports community through education</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Educational Programs</h4>
                    <p className="text-sm text-slate-600">Create educational programs and resources for players, coaches, administrators, and the general public to raise awareness and understanding of esports.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Professional Training</h4>
                    <p className="text-sm text-slate-600">Offer training and certification programs for esports professionals, such as referees, coaches, and event organizers.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Grassroots Support</h4>
                    <p className="text-sm text-slate-600">Support and empower local and regional esports organizations through funding, knowledge sharing, and networking opportunities.</p>
                  </div>
                </div>
              </div>

              {/* Advocacy and Representation */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Megaphone className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Advocacy and Representation</h3>
                    <p className="text-slate-600 mt-2">Championing esports on the global stage</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Government Recognition</h4>
                    <p className="text-sm text-slate-600">Advocate for the recognition of esports as a legitimate sport by governments and international sports organizations.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Stakeholder Collaboration</h4>
                    <p className="text-sm text-slate-600">Partner with game developers, publishers, technology companies, and other stakeholders to improve the esports ecosystem.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Social Impact</h4>
                    <p className="text-sm text-slate-600">Highlight the positive benefits of esports, such as its potential to promote inclusivity, diversity, and development.</p>
                  </div>
                </div>
              </div>

              {/* Competition and Events */}
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <Trophy className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Competition and Events</h3>
                    <p className="text-slate-600 mt-2">Organizing and supporting world-class esports competitions</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">International Championships</h4>
                    <p className="text-sm text-slate-600">Host major international esports tournaments and events, potentially including regional qualifiers and culminating in a global championship.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Tournament Support</h4>
                    <p className="text-sm text-slate-600">Partner and support existing major esports tournaments and leagues to ensure alignment with international standards and regulations.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Sustainable Development</h4>
                    <p className="text-sm text-slate-600">Encourage game developers and publishers to implement practices that promote the long-term health and sustainability of esports ecosystems.</p>
                  </div>
                </div>
              </div>

              {/* Research and Development */}
              <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <BarChart className="text-cyan-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Research and Development</h3>
                    <p className="text-slate-600 mt-2">Advancing the esports industry through innovation</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Industry Research</h4>
                    <p className="text-sm text-slate-600">Invest in research on the economic, social, and cultural impact of esports to inform future development strategies.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Technology Innovation</h4>
                    <p className="text-sm text-slate-600">Explore and develop new technologies and tools that can benefit the esports industry, such as anti-doping measures, spectator engagement platforms, and training tools.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3">Knowledge Sharing</h4>
                    <p className="text-sm text-slate-600">Facilitate knowledge sharing and the exchange of best practices within the esports community through conferences, workshops, and online resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'associates':
        return (
          <div className="space-y-8">
            {/* Associates Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Associates & Partners</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                WORSO collaborates with sports associations and federations worldwide to build a global ecosystem for robotics and esports. Our network includes international, continental, and national bodies that promote competitive gaming, fairness, and growth.
              </p>
            </div>

            {/* Two Main Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Sports Associations/Federations Card */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <Award className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Sports Associations/Federations</h3>
                    <p className="text-slate-600">
                      Sports associations promoting competitive gaming, fairness, and growth can apply to join WORSO for global recognition.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/associates/join-worso')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-all"
                  >
                    Join WORSO
                  </button>
                  <button
                    onClick={() => navigate('/associates/list')}
                    className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-all flex items-center gap-2"
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* National Esports Partner Card */}
              {/* <div className="bg-[#0f172a] rounded-2xl p-8 text-white hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <Trophy className="text-purple-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">National Esports Partner</h3>
                    <p className="text-slate-400">
                      NEP plays a key role in fostering and organizing Esports in respective countries in collaboration with WORSO and Gaming Associations.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:bg-purple-700 transition-all">
                    Apply for NEP
                  </button>
                  <button className="bg-transparent border border-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                    View All <ArrowRight size={16} />
                  </button>
                </div>
              </div> */}
            </div>

            {/* Quick Application Info */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Join WORSO?</h3>
                  <p className="text-slate-600">
                    Start your application process today and become part of our global network.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/associates/join-worso')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                >
                  Start Application
                </button>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Benefits of Partnership</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <Globe2 className="text-blue-600" size={24} />,
                    title: 'Global Recognition',
                    description: 'Get recognized as an official WORSO partner with international credibility and visibility.'
                  },
                  {
                    icon: <Shield className="text-green-600" size={24} />,
                    title: 'Standardized Rules',
                    description: 'Access and implement standardized competition rules and safety protocols.'
                  },
                  {
                    icon: <Users className="text-purple-600" size={24} />,
                    title: 'Community Access',
                    description: 'Connect with a global network of associations, teams, and industry experts.'
                  },
                  {
                    icon: <Award className="text-amber-600" size={24} />,
                    title: 'Event Support',
                    description: 'Receive support for organizing and promoting local and international events.'
                  },
                  {
                    icon: <Cpu className="text-cyan-600" size={24} />,
                    title: 'Tech Infrastructure',
                    description: 'Access to WORSOs technical platforms for registration, ranking, and management.'
                  },
                  {
                    icon: <Map className="text-emerald-600" size={24} />,
                    title: 'Market Expansion',
                    description: 'Expand your reach and grow esports participation in your region.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      {benefit.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-slate-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Global Network</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '95+', label: 'Member Nations' },
                  { value: '120k+', label: 'Registered Teams' },
                  { value: '2.5M', label: 'Global Spectators' },
                  { value: '$250k', label: 'Prize Pool' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-600 mt-2">{stat.label}</div>
                  </div>
                ))}
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
            { id: 'board', label: 'Board of Directors' },
            { id: 'federation-services', label: 'Federation Services' },
            { id: 'associates', label: 'Associates & Partners' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeSection === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
            >
              {item.label}
            </button>
          ))}
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