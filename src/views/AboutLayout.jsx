import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Cpu, Shield, Users, Globe2, Map, ClipboardList, Lock, Layers, ArrowRight, Building, Trophy, FileText, Mail, Phone, Calendar, BookOpen, Code, GraduationCap, Megaphone, Target, Rocket, BarChart, Briefcase, ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';
import { getLocationPrefix } from '../utils/locationRoutes';
import { ABOUT_PARTNER_STATIC } from '../data/aboutPartnerStatic';
import { EXECUTIVE_MEMBERS, ADVISORY_BOARD, REFEREES } from '../data/aboutPeople';
import PersonCard from '../components/partner/PersonCard';

const AboutLayout = ({ setView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Partner route: /:locationCode/about — show single "About" page with static data, no sections
  const locationPrefix = getLocationPrefix(location.pathname);
  const isPartnerAboutRoute = Boolean(locationPrefix) && (location.pathname.endsWith('/about') || location.pathname.endsWith('/about/'));
  
  // Initialize activeSection from URL hash or default to 'about-worso'
  const getInitialSection = () => {
    const hash = location.hash.replace('#', '');
    const validSections = ['about-worso', 'governance', 'strategy', 'president', 'advisory', 'board', 'federation-services', 'associates', 'tech-for-good', 'referees', 'working-at-worso'];
    return validSections.includes(hash) ? hash : 'about-worso';
  };
  
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});

  // Advisory Board state
  const [advisoryMembers, setAdvisoryMembers] = useState([]);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);
  const [advisoryError, setAdvisoryError] = useState(null);

  // Executive Committee state
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [boardError, setBoardError] = useState(null);
  
  // Update activeSection when URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const validSections = ['about-worso', 'governance', 'strategy', 'president', 'advisory', 'board', 'federation-services', 'associates', 'tech-for-good', 'referees', 'working-at-worso'];
    if (validSections.includes(hash)) {
      setActiveSection(hash);
      // Scroll to top when section changes via hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  // Scroll active tab into view when it changes
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeSection];
    if (activeTabElement && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Check if tab is outside the visible area
      if (tabRect.left < containerRect.left) {
        // Tab is to the left, scroll it into view
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      } else if (tabRect.right > containerRect.right) {
        // Tab is to the right, scroll it into view
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
      }
    }
  }, [activeSection]);

  // Fetch Advisory Board members when advisory tab is active
  useEffect(() => {
    if (activeSection !== 'advisory' || advisoryMembers.length > 0 || advisoryLoading) {
      return;
    }

    const fetchAdvisoryBoard = async () => {
      setAdvisoryLoading(true);
      setAdvisoryError(null);
      try {
        const response = await axiosInstance.get(endpoints.about.people('ADVISORY_BOARD'));
        const data = Array.isArray(response?.data?.data) ? response.data.data : [];

        // Sort by display_order if available
        const sorted = [...data].sort((a, b) => {
          const aOrder = typeof a.display_order === 'number' ? a.display_order : 0;
          const bOrder = typeof b.display_order === 'number' ? b.display_order : 0;
          return aOrder - bOrder;
        });

        setAdvisoryMembers(sorted);
      } catch (error) {
        console.error('Failed to load advisory board members', error);
        setAdvisoryError('Unable to load Advisory Board at the moment.');
      } finally {
        setAdvisoryLoading(false);
      }
    };

    fetchAdvisoryBoard();
  }, [activeSection, advisoryMembers.length, advisoryLoading]);
  
  // Fetch Executive Committee when board tab is active
  useEffect(() => {
    if (activeSection !== 'board' || boardMembers.length > 0 || boardLoading) {
      return;
    }

    const fetchBoardMembers = async () => {
      setBoardLoading(true);
      setBoardError(null);
      try {
        const response = await axiosInstance.get(endpoints.about.people('BOARD_OF_DIRECTORS'));
        const data = Array.isArray(response?.data?.data) ? response.data.data : [];

        // Sort by display_order if available
        const sorted = [...data].sort((a, b) => {
          const aOrder = typeof a.display_order === 'number' ? a.display_order : 0;
          const bOrder = typeof b.display_order === 'number' ? b.display_order : 0;
          return aOrder - bOrder;
        });

        setBoardMembers(sorted);
      } catch (error) {
        console.error('Failed to load board of directors members', error);
        setBoardError('Unable to load Executive Committee at the moment.');
      } finally {
        setBoardLoading(false);
      }
    };

    fetchBoardMembers();
  }, [activeSection, boardMembers.length, boardLoading]);
  
  // Update URL hash when activeSection changes
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`${location.pathname}#${sectionId}`, { replace: true });
    // Scroll to top when tab is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tab navigation items
  const tabs = [
    { id: 'about-worso', label: 'About WORSO' },
    { id: 'governance', label: 'Mission & Vision' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'president', label: "President's Message" },
    { id: 'advisory', label: 'Advisory Board' },
    { id: 'board', label: 'Executive Committee' },
    { id: 'federation-services', label: 'Federation Services' },
    // { id: 'associates', label: 'Associates & Partners' },
    { id: 'tech-for-good', label: 'Tech for Good' },
    { id: 'working-at-worso', label: 'Working at WORSO' },
    { id: 'referees', label: 'Referees' },
  ];

  // Get current tab index
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeSection);
  
  // Navigate to next tab
  const handleNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      handleSectionChange(tabs[currentTabIndex + 1].id);
    }
  };

  // Navigate to previous tab
  const handlePreviousTab = () => {
    if (currentTabIndex > 0) {
      handleSectionChange(tabs[currentTabIndex - 1].id);
    }
  };

  const canGoPrevious = currentTabIndex > 0;
  const canGoNext = currentTabIndex < tabs.length - 1;
  
  void motion;

  /* ------------------ Partner route: single About page, static data, no sections ------------------ */
  if (isPartnerAboutRoute) {
    const data = ABOUT_PARTNER_STATIC;
    return (
      <div className="animate-fadeIn min-h-screen flex flex-col">
        {/* Page header: matches main site "About Worso" style — partner shows "About" */}
        <section className="bg-[#0f172a] border-b border-white/10">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <h1 className="text-center font-bold text-xl md:text-2xl tracking-wide text-cyan-200/95">
              About
            </h1>
            <div className="mt-3 h-px w-full max-w-md mx-auto bg-white/20" aria-hidden="true" />
          </div>
        </section>

        <div className="flex-grow bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="space-y-10">
                <div className="bg-[#0f172a] rounded-3xl text-white p-10 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-3">{data.hero.eyebrow}</div>
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">{data.hero.heading}</h2>
                  <p className="text-slate-200 text-lg max-w-2xl">{data.hero.tagline}</p>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed">{data.intro}</p>

                {data.sections.map((section) => (
                  <div key={section.id} className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <Target className="text-blue-600 flex-shrink-0" size={20} />
                      <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
                    </div>
                    {section.content && <p className="text-slate-600 leading-relaxed pl-8">{section.content}</p>}
                    {section.points && (
                      <ul className="list-disc list-inside space-y-2 text-slate-600 pl-8">
                        {section.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-100">
                  <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Join the movement</h3>
                    <p className="text-slate-600">Participate in events, become a member, or get in touch to learn how you can be part of our community.</p>
                  </div>
                </div>

                {/* Advisory Board */}
                <div className="pt-10 border-t border-slate-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <Award className="text-blue-600 flex-shrink-0" size={20} />
                    <h2 className="text-xl font-bold text-slate-900">Advisory Board</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Global leaders and experts guiding WORSO&apos;s mission, governance, and long-term strategy.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ADVISORY_BOARD.map((person) => (
                      <PersonCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        designation={person.designation}
                        image={person.image}
                      />
                    ))}
                  </div>
                </div>

                {/* Executive Committee */}
                <div className="pt-10 border-t border-slate-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-600 flex-shrink-0" size={20} />
                    <h2 className="text-xl font-bold text-slate-900">Executive Committee</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    The Executive Committee guides WORSO&apos;s strategic vision and policies, overseeing global initiatives and ensuring fair, inclusive practices.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EXECUTIVE_MEMBERS.map((person) => (
                      <PersonCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        designation={person.designation}
                        image={person.image}
                      />
                    ))}
                  </div>
                </div>

                {/* Referees & Judges */}
                <div className="pt-10 border-t border-slate-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="text-blue-600 flex-shrink-0" size={20} />
                    <h2 className="text-xl font-bold text-slate-900">Official Referees & Judges</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Certified referees and judges appointed by WORSO to ensure fair play and professional evaluation across all robotics competitions.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {REFEREES.map((person) => (
                      <PersonCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        designation={person.designation}
                        image={person.image}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'about-worso':
        return (
          <div className="space-y-10">
            <div className="container mx-auto px-4 py-4">
              <div className="bg-[#0f172a] rounded-3xl text-white p-12 md:p-14 shadow-2xl relative overflow-hidden">
                <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">About WORSO</div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">The World Robotics Sports Organization</h1>
                <p className="text-slate-200 text-lg max-w-3xl">
                  Championing the Future of Competitive Gaming
                </p>
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">
              The world of eSports has exploded in popularity in recent years, evolving from a niche hobby to a global phenomenon. At the forefront of this exciting evolution stands the World Robotics Sports Organization (WORSO), the governing body for competitive tech-sports, dedicated to promoting and developing eSports on a global scale.
            </p>

            {/* WORSO's Mission */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Target className="text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">WORSO&apos;s Mission: Unifying the eSports Community</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Founded in 2023, WORSO serves as the unifying force for eSports organizations and stakeholders worldwide. Its mission is to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
                <li>Promote and develop eSports globally</li>
                <li>Ensure fair and competitive play</li>
                <li>Organize and sanction international eSports tournaments</li>
                <li>Support the growth and development of national eSports federations</li>
                <li>Advocate for the recognition of eSports as a legitimate sport</li>
              </ul>
            </div>

            {/* WORSO's Impact */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Globe2 className="text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">WORSO&apos;s Impact: Connecting the World Through eSports</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                WORSO&apos;s impact on the eSports landscape is undeniable. The organization boasts over 43 member countries, each with its own national eSports association or federation. This global network fosters collaboration and knowledge sharing, promoting the development of eSports at the grassroots level.
              </p>
              <p className="text-slate-600 leading-relaxed">
                One of WORSO&apos;s crown jewels is the World Championship, a prestigious annual event that brings together the best eSports players from around the world to compete in various game titles. The World Championship is a testament to the skill, dedication, and athleticism of professional gamers, showcasing eSports to a wider audience and further solidifying its position as a legitimate sport.
              </p>
            </div>

            {/* Beyond Tournaments */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Layers className="text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Beyond Tournaments: WORSO&apos;s Holistic Approach</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                WORSO&apos;s commitment extends beyond organizing tournaments. The organization actively works on several fronts:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                    <GraduationCap size={18} /> Education and Training
                  </div>
                  <p className="text-sm text-slate-600">WORSO provides educational resources and training programs for aspiring eSports athletes, coaches, and administrators.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                    <Shield size={18} /> Anti-Doping
                  </div>
                  <p className="text-sm text-slate-600">WORSO implements a strict anti-doping policy to ensure fair play and protect the integrity of eSports.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                    <Users size={18} /> Gender Equality
                  </div>
                  <p className="text-sm text-slate-600">WORSO champions gender equality in eSports and encourages the participation of women in all aspects of the industry.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                    <Globe2 size={18} /> Sustainability
                  </div>
                  <p className="text-sm text-slate-600">WORSO promotes sustainable practices within the eSports industry, focusing on environmental and social responsibility.</p>
                </div>
              </div>
            </div>

            {/* The Future of eSports */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Rocket className="text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">The Future of eSports: WORSO Leading the Way</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                With the eSports industry projected to cross a global market size of over $1.5 billion in 2023, the future of competitive gaming looks bright. WORSO is well-positioned to lead the way, continuing to promote the growth and development of eSports on a global scale. By fostering collaboration, advocating for recognition, and addressing key challenges, WORSO is ensuring that eSports reaches its full potential as a sport, entertainment medium, and cultural phenomenon.
              </p>
            </div>

            {/* Join the Movement */}
            <div className="pt-6 border-t border-slate-100">
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Join the Movement!</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Whether you&apos;re a passionate gamer, a dedicated eSports fan, or simply curious about the future of competitive gaming, WORSO invites you to join the movement. Visit the WORSO website to learn more about its initiatives, upcoming events, and how you can get involved in shaping the future of eSports.
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Together, we can make eSports a force for good in the world, connecting communities, promoting fair play, and inspiring the next generation of champions.
                </p>
                <p className="text-lg font-bold text-blue-600">Let the games begin!</p>
              </div>
            </div>
          </div>
        );

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

      case 'strategy':
        return (
          <div className="space-y-8">
            <div className="container mx-auto px-4 pb-6">
              <div className="flex items-center gap-3">
                <Target className="text-blue-600" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Strategy</h1>
              </div>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              The World Robotics Sports Organization (WORSO) stands at the forefront of competitive tech-sports, aiming to foster its development and recognition as a legitimate sport on a global stage. To achieve this ambitious goal, the WORSO has outlined a comprehensive strategy for global growth, focusing on several key pillars:
            </p>

            {/* 1. Expanding Membership and Reach */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">1</span>
                Expanding Membership and Reach
              </h2>
              <ul className="space-y-2 text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Strengthening National eSports Federations:</span> WORSO actively supports existing National eSports Federations or Associations and encourages the formation of new ones in countries where eSports is gaining traction. This network of local organizations provides crucial infrastructure for grassroots development and talent identification.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Strategic Partnerships:</span> Collaborating with major stakeholders like game publishers, event organizers, and educational institutions can amplify WORSO's reach and influence. Partnerships can involve hosting joint tournaments, developing educational programs, and promoting ethical practices within the industry.
                </li>
              </ul>
            </div>

            {/* 2. Building a Sustainable Competitive Ecosystem */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">2</span>
                Building a Sustainable Competitive Ecosystem
              </h2>
              <ul className="space-y-2 text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Standardized Regulations and Tournaments:</span> Establishing clear and consistent rules for competitive play ensures fair competition and fosters trust among players and organizers. WORSO's World Championship serves as a prime example of a high-caliber event adhering to rigorous standards.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Anti-Doping and Integrity:</span> Protecting the integrity of eSports is paramount. WORSO implements a strict anti-doping policy and advocates for ethical conduct within the community.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Talent Development and Training:</span> Investing in training programs and initiatives for players, coaches, and administrators is crucial for long-term success. WORSO provides resources and expertise to empower the next generation of eSports professionals.
                </li>
              </ul>
            </div>

            {/* 3. Promoting eSports as a Sport */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">3</span>
                Promoting eSports as a Sport
              </h2>
              <ul className="space-y-2 text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Gaining Recognition from Traditional Sports Bodies:</span> WORSO actively engages with the International Robotics Committees and other major eSports organizations to advocate for the inclusion of eSports in prestigious events like other sports.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Highlighting the Physical and Mental Demands of eSports:</span> Educating the public about the athleticism, strategic thinking, and mental fortitude required for competitive gaming is essential for gaining wider recognition as a legitimate sport.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Showcasing the Positive Impact of eSports:</span> eSports can be a powerful tool for promoting social good, fostering community engagement, and encouraging inclusivity. WORSO champions initiatives that leverage the power of gaming for positive social impact.
                </li>
              </ul>
            </div>

            {/* 4. Embracing Innovation and Technology */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">4</span>
                Embracing Innovation and Technology
              </h2>
              <ul className="space-y-2 text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Exploring New Formats and Platforms:</span> WORSO is constantly seeking ways to innovate and adapt to the evolving landscape of eSports. This includes exploring new game titles, formats, and platforms to cater to diverse audiences and preferences.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Leveraging Technology for Enhanced Experiences:</span> Utilizing cutting-edge technologies like virtual reality, augmented reality, and artificial intelligence can enhance the viewing experience for fans and further elevate the overall spectacle of eSports events.
                </li>
              </ul>
            </div>

            {/* 5. Fostering a Strong Community */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">5</span>
                Fostering a Strong Community
              </h2>
              <ul className="space-y-2 text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Engaging with Players and Fans:</span> WORSO prioritizes open communication and engagement with the eSports community. This includes hosting online forums, organizing fan events, and actively listening to the needs and concerns of players and fans.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-slate-700">Promoting Diversity and Inclusion:</span> WORSO champions inclusivity and diversity within the eSports community, ensuring that everyone has the opportunity to participate and thrive in the competitive gaming scene.
                </li>
              </ul>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mt-8">
              <p className="text-slate-600 leading-relaxed">
                By implementing these strategic initiatives, the WORSO can solidify its position as the leading organization driving the global growth of eSports. By fostering a sustainable ecosystem, promoting its sporting legitimacy, and embracing innovation, WORSO can pave the way for a future where competitive gaming flourishes on a global stage.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Remember, this is just a starting point, and the specific strategies WORSO implements will need to adapt and evolve based on the ever-changing landscape of eSports. However, by focusing on these core principles, the WORSO can ensure that eSports continues to grow and thrive in the years to come.
              </p>
            </div>
          </div>
        );

        case 'referees':
        return (
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">
                  Official Referees & Judges
                </h2>
              </div>
              <p className="text-lg text-slate-600 max-w-3xl">
                Certified referees and judges appointed by WORSO to ensure fair play,
                rule compliance, and professional evaluation across all robotics competitions.
              </p>
            </div>

            {/* Referees Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {REFEREES.map((person) => (
                <PersonCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  designation={person.designation}
                  image={person.image}
                />
              ))}
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
                <h2 className="text-3xl font-bold text-slate-900">Executive Committee</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                The Executive Committee of the World Robotics Sports Organization (WORSO) is composed of esteemed leaders in the esports industry, tasked with guiding the federation's strategic vision and policies. They oversee global initiatives, drive the growth of competitive gaming, and ensure fair, inclusive practices. By fostering collaboration with national organizations, governments, and stakeholders, the committee plays a pivotal role in shaping the future of esports worldwide and ensuring its sustainable development.
              </p>
            </div>

            {/* Board Members */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {EXECUTIVE_MEMBERS.map((person) => (
                <PersonCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  designation={person.designation}
                  image={person.image}
                />
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
                    The Executive Committee convenes quarterly to review progress, set strategic direction, and make key decisions for WORSO's global operations.
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
                    src={EXECUTIVE_MEMBERS[0]?.image}
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

      case 'advisory': {
        const displayAdvisoryMembers = advisoryMembers.length > 0
          ? advisoryMembers.map((m) => ({
              id: m._id || m.id,
              name: m.name,
              designation: m.role || m.designation || 'Advisory Board Member',
              image: m.image || m.avatar,
            }))
          : ADVISORY_BOARD;
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Advisory Board</h2>
            <p className="text-slate-600 mb-8 max-w-2xl">
              Global leaders and experts guiding WORSO&apos;s mission, governance, and long-term strategy.
            </p>

            {advisoryLoading && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center animate-pulse">
                    <div className="w-40 h-40 rounded-lg bg-slate-200 mb-6" />
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {!advisoryLoading && advisoryError && (
              <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                {advisoryError} Showing static advisory board.
              </div>
            )}

            {!advisoryLoading && displayAdvisoryMembers.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayAdvisoryMembers.map((person) => (
                  <PersonCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    designation={person.designation}
                    image={person.image}
                  />
                ))}
              </div>
            )}

            {!advisoryLoading && displayAdvisoryMembers.length === 0 && (
              <p className="text-slate-500 text-sm">Advisory Board members will be announced soon.</p>
            )}
          </div>
        );
      }

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
          <div className="space-y-8 hidden">
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

      case 'tech-for-good':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Tech for Good</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                The world of eSports has exploded onto the global stage, captivating audiences and fostering communities like never before. But beyond the thrill of competition and the roar of packed arenas, a powerful potential lies dormant: the ability to harness the power of gaming for positive change. This is the realm of Technology Sports for Good, where eSports becomes a platform for social impact and a force for good in the world.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Bridging the Divide: Connecting Through Play</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                eSports transcends geographical and cultural barriers. A shared love for gaming unites players from diverse backgrounds, fostering communication and understanding. Imagine online tournaments where teams from war-torn regions compete alongside players from conflict-free zones, forging bonds of friendship and empathy. This is the power of Technology Sports for Good, bridging divides and promoting peacebuilding through shared experiences.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Empowering the Next Generation: Education and Skill Development</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                eSports aren't just about quick reflexes and twitch skills. Strategic thinking, critical problem-solving, and teamwork are essential ingredients for success. Technology Sports for Good initiatives can leverage the engaging nature of games to develop these crucial skills in youth, particularly in underserved communities. Educational programs focused on game design, coding, and esports management can equip the next generation with valuable skills for the digital economy.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Promoting Health and Well-being: eSports for a Healthy Mind and Body</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                The stereotype of the sedentary gamer is outdated. Competitive gaming demands high levels of physical and mental fitness. Technology Sports for Good initiatives can promote healthy lifestyles by encouraging physical activity through gaming-inspired exercise programs and raising awareness about nutrition and mental health within the esports community.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Championing Sustainability: Gaming for a Greener Future</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                The esports industry has a significant environmental footprint. Technology Sports for Good initiatives can address this by promoting sustainable practices within the industry. This includes initiatives like carbon offsetting for tournaments, eco-friendly merchandise, and awareness campaigns about the impact of technology on the environment.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Beyond the Game: Driving Social Change through Advocacy</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                eSports can be a powerful platform for advocacy. Technology Sports for Good initiatives can utilize the reach and influence of the esports community to raise awareness about important social issues like gender equality, disability rights, and access to education. Imagine professional players using their platforms to champion causes close to their hearts, inspiring millions to take action.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">The World Robotics Sports Organization (WORSO) at the Forefront</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                The WORSO recognizes the immense potential of Technology Sports for Good and is actively leading the charge. Through initiatives like the TechnoXian World Championship for Development, the organization promotes sustainable development and social impact through esports. WORSO also collaborates with NGOs and educational institutions to leverage the power of gaming for positive change.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">A Call to Action: Join the Movement</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Technology Sports for Good is not just a slogan, it's a call to action. Players, organizers, fans, and everyone in the esports ecosystem can contribute to this movement. Share your stories of how gaming has impacted you positively, support initiatives that promote good, and advocate for the responsible and ethical development of esports.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Together, we can harness the power of Technology Sports for Good to create a more inclusive, sustainable, and just world. Let's make esports a force for good, one game, one player, one challenge at a time.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Remember, this is just a starting point. The possibilities for Technology Sports for Good are endless. Let's work together to unlock them and create a world where esports truly makes a difference.
              </p>
            </div>
          </div>
        );

      case 'working-at-worso':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Working at WORSO</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                Do you dream of shaping the future of competitive gaming? Do you crave a career that combines passion, purpose, and cutting-edge technology? Look no further than the World Robotics Sports Organization (WORSO), the leading force driving the global growth and recognition of eSports.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">Here&apos;s why working for WORSO is more than just a job:</h3>
              <ul className="space-y-6">
                {[
                  { title: 'Be a Changemaker', desc: "You'll be part of a dynamic team dedicated to promoting eSports as a legitimate sport, fostering a sustainable ecosystem, and advocating for ethical practices within the industry.", icon: Target },
                  { title: 'Global Impact', desc: 'Your work will transcend borders, impacting millions of players and fans across the globe. Witness firsthand the power of eSports to connect communities, bridge divides, and champion social good.', icon: Globe2 },
                  { title: 'Innovation Playground', desc: 'Immerse yourself in the ever-evolving world of eSports, where cutting-edge technology meets athleticism and strategic brilliance. Be at the forefront of shaping the future of competitive gaming.', icon: Rocket },
                  { title: 'Diverse Opportunities', desc: 'From event management and athlete relations to anti-doping and game development initiatives, WORSO offers a diverse range of career paths to suit your skills and passion.', icon: Layers },
                  { title: 'Work with the Best', desc: 'Collaborate with industry leaders, renowned players, and passionate esports enthusiasts. Learn from the best and contribute to a supportive and collaborative work environment.', icon: Users },
                ].map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-blue-50">
                      <item.icon className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
              <p className="text-lg text-slate-600 leading-relaxed">
                WORSO is more than just an organization; it&apos;s a movement. A movement that celebrates the power of gaming, champions fair play, and empowers the next generation of athletes and leaders. By joining WORSO, you become an integral part of this movement, shaping the future of eSports and contributing to a more inclusive and impactful world.
              </p>
            </div>
          </div>
        );

      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="animate-fadeIn bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 shadow-sm  z-30">
        <div className="container mx-auto px-4 flex items-center gap-2">
          {/* Left Arrow */}
          <button
            onClick={handlePreviousTab}
            disabled={!canGoPrevious}
            className={`p-2 rounded-lg transition-all ${
              canGoPrevious
                ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Previous tab"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Tabs Container */}
          <div ref={tabsContainerRef} className="flex gap-8 overflow-x-auto scrollbar-hide flex-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                ref={(el) => (tabRefs.current[item.id] = el)}
                onClick={() => handleSectionChange(item.id)}
                className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextTab}
            disabled={!canGoNext}
            className={`p-2 rounded-lg transition-all ${
              canGoNext
                ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Next tab"
          >
            <ChevronRight size={20} />
          </button>
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