import React, { useEffect, useRef, useState } from 'react';
import {
  Globe,
  ChevronRight,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Menu,
  X,
  ArrowRight,
  Award,
  Shield,
  Gamepad2,
  CreditCard,
  Ticket,
  Download,
  Layout,
  Building,
  LogOut,
  User,
  Plus,
  Clock,
  Sparkles,
  Send,
  Bot,
  Heart,
  Cpu,
} from 'lucide-react';
import './App.css';

// --- GEMINI API CONFIGURATION ---
const apiKey = ''; // API Key provided by environment

// --- STYLES ---
const styles = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    display: flex;
    animation: marquee 40s linear infinite;
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
  .custom-checkbox:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  .typing-dot {
    animation: typing 1.4s infinite ease-in-out both;
  }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

// --- MOCK DATA ---
const MOCK_TEAMS = [
  {
    id: 't1',
    name: 'RoboTitans India',
    country: 'India',
    rank: 1,
    points: 2450,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RoboTitans',
    wins: 42,
    losses: 5,
    earnings: '$120,000',
    history: 'Founded in 2018, RoboTitans have dominated the Asian circuit.',
    players: [
      {
        id: 1,
        name: 'Aarav Patel',
        role: 'Captain / Pilot',
        matches: 45,
        winRate: '88%',
        image:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        role: 'Lead Programmer',
        matches: 42,
        winRate: '85%',
        image:
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      },
    ],
  },
  {
    id: 't2',
    name: 'Cyber United UK',
    country: 'UK',
    rank: 2,
    points: 2380,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CyberUK',
    wins: 38,
    losses: 8,
    earnings: '$95,000',
    history: 'European Champions 2024.',
    players: [
      {
        id: 4,
        name: 'Sarah Jenkins',
        role: 'Captain',
        matches: 30,
        winRate: '70%',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      },
    ],
  },
];

const THINK_TANK_LOGOS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nvidia_logo.svg/2560px-Nvidia_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/2560px-Cisco_logo_blue_2016.svg.png',
];

const CAREERS = [
  { id: 1, title: 'Global Events Manager', location: 'Dubai / Hybrid', type: 'Full-time' },
  { id: 2, title: 'Technical Rulebook Author', location: 'Remote', type: 'Contract' },
  { id: 3, title: 'Regional Partner Coordinator', location: 'Singapore', type: 'Full-time' },
];

const GAME_CATEGORIES = [
  { id: 'roborace', name: 'Robo Race', desc: 'High speed autonomous racing on variable terrain.', players: '12k+', prize: '$50,000', icon: '🏎️' },
  { id: 'robosoccer', name: 'Robo Soccer', desc: 'Tactical team sport. 3v3 autonomous bots.', players: '8k+', prize: '$35,000', icon: '⚽' },
  { id: 'droneracing', name: 'Drone Racing', desc: 'FPV obstacle course racing at 100mph.', players: '15k+', prize: '$60,000', icon: '🚁' },
  { id: 'sumobot', name: 'Sumo Bot', desc: 'Strength and strategy combat in the ring.', players: '25k+', prize: '$25,000', icon: '🥋' },
  { id: 'water', name: 'Water Rocket', desc: 'Precision and distance challenges.', players: '10k+', prize: '$15,000', icon: '🚀' },
  { id: 'innov', name: 'Innovation Challenge', desc: 'Solving real world problems with tech.', players: '5k+', prize: '$75,000', icon: '💡' },
];

const NEWS_ITEMS = [
  { id: 1, tag: 'REGULATION', date: 'NOV 27, 2025', title: 'New Autonomous Drone Regulations (ADR-25) Released', desc: 'The board has officially ratified the new guidelines for autonomous flight.' },
  { id: 2, tag: 'EVENT', date: 'NOV 26, 2025', title: 'Technoxian World Cup Venue Finalized: Dubai Exhibition Centre', desc: 'The largest robotics arena in history will be constructed at DEC.' },
  { id: 3, tag: 'PARTNERSHIP', date: 'NOV 25, 2025', title: 'Worso Welcomes South Korea as Strategic Partner', desc: 'The KRA officially joins the federation.' },
];

const DEFAULT_SITES = {
  global: {
    id: 'global',
    name: 'WORSO Global',
    logo_text: 'WORSO',
    sub_text: 'WORLD ROBOTICS SOCIETY',
    theme: 'blue',
    colors: {
      primary: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      gradient: 'bg-[#0f172a]',
    },
    is_partner: false,
    local_events: [],
  },
  uae: {
    id: 'uae',
    name: 'TECHNOXIAN UAE',
    logo_text: 'TECHNOXIAN UAE',
    sub_text: 'OFFICIAL REGIONAL CHAPTER',
    theme: 'emerald',
    colors: {
      primary: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      text: 'text-emerald-500',
      gradient: 'bg-[#022c22]',
    },
    is_partner: true,
    local_events: [
      { id: 1, title: 'Dubai Schools Challenge', date: 'Jan 15, 2026', location: 'GEMS Academy', status: 'Open' },
      { id: 2, title: 'Abu Dhabi Zonal Qualifier', date: 'Feb 20, 2026', location: 'ADNEC', status: 'Upcoming' },
    ],
  },
};

// --- GEMINI API HELPER ---
const callGemini = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );
    if (!response.ok) throw new Error('API Call Failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error('Gemini Error:', error);
    return "I'm having trouble connecting to the AI services right now. Please try again later.";
  }
};

// --- COMPONENTS ---
const LiveTicker = ({ tickerText, siteConfig }) => (
  <div className="bg-[#0b1120] text-white text-[10px] font-bold py-2 overflow-hidden relative z-50 border-b border-white/5">
    <div className="container mx-auto px-4 flex items-center">
      <span className={`px-2 py-0.5 rounded text-white text-[9px] font-bold mr-4 uppercase tracking-wider ${siteConfig.is_partner ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`}>
        {siteConfig.is_partner ? 'UAE CHAPTER' : 'LIVE'}
      </span>
      <div className="whitespace-nowrap overflow-hidden flex-1 relative h-4">
        <div className="absolute top-0 left-0 whitespace-nowrap animate-marquee">
          {tickerText}
        </div>
      </div>
    </div>
  </div>
);

const LogoTicker = () => (
  <div className="bg-slate-50 border-t border-slate-200 py-8 overflow-hidden">
    <div className="container mx-auto px-4 mb-6 text-center">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supporting Organizations & Think Tanks</span>
    </div>
    <div className="flex gap-16 animate-marquee whitespace-nowrap items-center w-[200%]">
      {[...THINK_TANK_LOGOS, ...THINK_TANK_LOGOS, ...THINK_TANK_LOGOS].map((logo, i) => (
        <img
          key={i}
          src={logo}
          alt="Partner"
          className="h-8 md:h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      ))}
    </div>
  </div>
);

const Navigation = ({ currentView, setView, toggleMobileMenu, isMobileMenuOpen, siteConfig, user }) => (
  <nav className="sticky top-0 z-40 transition-all duration-300 bg-[#0f172a] border-b border-white/10">
    <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
        <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xl shadow-lg transition-colors ${siteConfig.colors.primary}`}>
          {siteConfig.is_partner ? 'T' : 'W'}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl leading-none text-white tracking-wide">{siteConfig.logo_text}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mt-1">{siteConfig.sub_text}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 font-bold text-[11px] uppercase tracking-widest text-slate-300">
        {!siteConfig.is_partner && (
          <div className="relative group">
            <button className="hover:text-white transition-colors py-2 flex items-center gap-1">
              About Worso <ChevronRight size={10} className="rotate-90" />
            </button>
            <div className="absolute top-full left-0 w-48 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50">
              <button onClick={() => setView('about')} className="block w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5">
                Vision & Strategy
              </button>
              <button onClick={() => setView('careers')} className="block w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5">
                Careers
              </button>
              <button onClick={() => setView('associates')} className="block w-full text-left px-4 py-3 hover:bg-white/5">
                Associates
              </button>
            </div>
          </div>
        )}
        <button onClick={() => setView('teams')} className="hover:text-white transition-colors">
          Teams / Players
        </button>
        <button onClick={() => setView('technoxian')} className="hover:text-white transition-colors flex items-center gap-1">
          <Trophy className="w-3 h-3 text-yellow-500" />
          {siteConfig.is_partner ? 'Local Events' : 'Technoxian Games'}
        </button>
        {!siteConfig.is_partner && (
          <button onClick={() => setView('partners')} className="hover:text-white transition-colors">
            Partners
          </button>
        )}

        <button
          onClick={() => setView('login')}
          className={`${siteConfig.colors.primary} text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 normal-case tracking-normal text-sm hover:-translate-y-0.5`}
        >
          <User size={14} />
          {user ? 'My Dashboard' : 'Member Login'}
        </button>
      </div>

      <button className="md:hidden text-white" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>
  </nav>
);

const AIReferee = ({ siteConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Referee. Ask me anything about Technoxian rules, arena dimensions, or scoring criteria.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const systemPrompt = `You are an expert AI Referee for the Technoxian World Robotics Championship.
    Answer questions about rules for games like Robo Race, Robo Soccer, Drone Racing, Sumo Bot, etc.
    Be concise, professional, and authoritative but helpful.
    Current Context: The user is asking about: "${userMsg}"`;

    const aiResponse = await callGemini(systemPrompt);
    setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 ${siteConfig.colors.primary} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2`}
      >
        <Bot size={24} />
        <span className="font-bold text-sm hidden md:inline">Ask AI Referee</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fadeIn">
          <div className={`${siteConfig.colors.primary} p-4 flex justify-between items-center text-white`}>
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">AI Referee Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about rules..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- VIEWS ---
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

// --- ASSOCIATES VIEW ---
const AssociatesView = () => (
  <div className="animate-fadeIn pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Associates & Partners</h1>
        <p className="text-xl text-slate-500">Building the global ecosystem for robotics and esports.</p>
      </div>

      <div className="bg-slate-50 rounded-3xl p-12 border border-slate-200 mb-12 flex flex-col md:flex-row gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
          <Award size={48} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sports Associations/Federations</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Sports associations promoting competitive gaming, fairness, and growth can apply to join WORSO for global recognition.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
              Join WORSO
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
              List of Associations <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-3xl p-12 text-white flex flex-col md:flex-row gap-8">
        <div className="bg-white/10 p-6 rounded-2xl h-fit border border-white/10">
          <Gamepad2 size={48} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">National Esports Partner</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            NEP plays a key role in fostering and organizing Esports in respective countries in collaboration with WORSO and Gaming Associations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-purple-700 transition-all">
              Apply for NEP
            </button>
            <button className="bg-transparent border border-white/20 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              List of NEP <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AboutLayout = ({ setView }) => {
  const [activeSection, setActiveSection] = useState('vision');
  const Content = () => {
    switch (activeSection) {
      case 'vision':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Vision & Values</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">To create a unified regulatory framework for autonomous sports. We value Integrity, Innovation, and Inclusivity.</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Shield className="text-blue-600 mb-2" />
                <h4 className="font-bold">Integrity</h4>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Award className="text-blue-600 mb-2" />
                <h4 className="font-bold">Excellence</h4>
              </div>
            </div>
          </div>
        );
      case 'structure':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Leadership Structure</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-lg">Dr. Richard H. Vance</h4>
                  <div className="text-blue-600 font-bold text-sm">PRESIDENT</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-bold">Executive Committee</h4>
                  <p className="text-sm text-slate-500">Daily Operations</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-bold">Advisory Board</h4>
                  <p className="text-sm text-slate-500">Strategic Guidance</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'strategy':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Strategic Roadmap</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Our 5-year plan focuses on expanding the Technoxian footprint to 150 nations, standardizing robotic kits for accessibility, and launching the professional "Pro-League".
            </p>
            <div className="p-6 bg-slate-50 rounded-xl border-l-4 border-blue-600">
              <h4 className="font-bold mb-2">2026 Goal</h4>
              <p className="text-sm text-slate-500">Launch the first inter-continental autonomous drone racing league.</p>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Tech for Good</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We believe competition drives innovation that solves real-world problems. Our "Innovation Challenge" category has produced patents for agricultural drones and disaster relief bots.
            </p>
            <div className="mt-6 flex gap-4">
              <Cpu size={32} className="text-emerald-600" />
              <Heart size={32} className="text-red-600" />
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
      case 'referees':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Referees Board</h2>
            <p className="text-slate-600 mb-6">The Referees Board ensures fair play and technical compliance across all global events.</p>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-bold">Certification Program</h4>
              <p className="text-sm text-slate-500">Apply to become an accredited WORSO official.</p>
            </div>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };
  return (
    <div className="animate-fadeIn pt-20 bg-slate-50 min-h-screen">
      <div className="bg-[#0f172a] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold">About WORSO</h1>
          <p className="text-slate-400 mt-2">The governing body for the sport of robotics.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-3">
          <div className="sticky top-24 space-y-1">
            {['Vision & Values', 'Structure', 'Strategy', 'Tech for Good', 'Working at WORSO', 'Referees'].map((item) => {
              const id = item.split(' ')[0].toLowerCase();
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    activeSection === id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-9 bg-white p-12 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
          <Content />
        </div>
      </div>
    </div>
  );
};

const TeamsView = () => {
  const [viewLevel, setViewLevel] = useState('list');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setViewLevel('team');
  };
  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setViewLevel('player');
  };
  return (
    <div className="animate-fadeIn pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => setViewLevel('list')}>
            Teams
          </span>
          {viewLevel !== 'list' && (
            <>
              <ChevronRight size={14} />{' '}
              <span className="cursor-pointer hover:text-blue-600" onClick={() => setViewLevel('team')}>
                {selectedTeam.name}
              </span>
            </>
          )}
          {viewLevel === 'player' && (
            <>
              <ChevronRight size={14} /> <span className="font-bold text-slate-900">{selectedPlayer.name}</span>
            </>
          )}
        </div>
        {viewLevel === 'list' && (
          <>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Worso Clubs & Teams</h1>
            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_TEAMS.map((team) => (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team)}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={team.logo} className="w-16 h-16 rounded bg-slate-100" alt={team.name} />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">{team.name}</h3>
                      <div className="text-sm text-slate-500">{team.country}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                    <span className="text-sm font-bold text-slate-500">Global Rank #{team.rank}</span>
                    <span className="text-sm font-bold text-blue-600">View Roster →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {viewLevel === 'team' && selectedTeam && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex items-center gap-6">
              <img src={selectedTeam.logo} className="w-24 h-24 bg-white rounded-xl p-2" alt={selectedTeam.name} />
              <div>
                <h1 className="text-4xl font-bold">{selectedTeam.name}</h1>
                <p className="text-slate-400">{selectedTeam.history}</p>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Team Roster</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {selectedTeam.players.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePlayerClick(p)}
                    className="border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
                  >
                    <img src={p.image} className="w-full h-48 object-cover" alt={p.name} />
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900">{p.name}</h3>
                      <p className="text-sm text-slate-500">{p.role}</p>
                      <button className="mt-3 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">More Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {viewLevel === 'player' && selectedPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden relative animate-fadeIn">
              <button
                onClick={() => setViewLevel('team')}
                className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200"
              >
                <X size={20} />
              </button>
              <div className="grid md:grid-cols-2">
                <img src={selectedPlayer.image} className="w-full h-full object-cover" alt={selectedPlayer.name} />
                <div className="p-8">
                  <div className="text-blue-600 font-bold text-sm uppercase mb-1">{selectedPlayer.role}</div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{selectedPlayer.name}</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Matches</span>
                      <span className="font-bold text-slate-900">{selectedPlayer.matches}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Win Rate</span>
                      <span className="font-bold text-green-600">{selectedPlayer.winRate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Team</span>
                      <span className="font-bold text-slate-900">{selectedTeam.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CareersView = () => (
  <div className="animate-fadeIn pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Careers at WORSO</h1>
      <p className="text-slate-500 mb-12">Join us in shaping the future of competitive robotics.</p>
      <div className="space-y-4">
        {CAREERS.map((job) => (
          <div
            key={job.id}
            className="border border-slate-200 p-6 rounded-xl flex justify-between items-center hover:border-blue-500 transition-colors cursor-pointer group"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600">{job.title}</h3>
              <div className="flex gap-4 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {job.type}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminLoginView = ({ setView, setUser }) => (
  <div className="animate-fadeIn pt-32 pb-20 bg-slate-900 min-h-screen flex justify-center items-center">
    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
      <div className="flex justify-center mb-6">
        <Shield size={48} className="text-slate-900" />
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Staff Portal</h2>
      <p className="text-center text-slate-500 text-sm mb-8">Authorized Personnel Only</p>
      <button
        onClick={() => {
          setUser({ type: 'admin', role: 'super' });
          setView('admin-dashboard');
        }}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mb-3 hover:bg-blue-700"
      >
        Super Admin Login
      </button>
      <button
        onClick={() => {
          setUser({ type: 'admin', role: 'partner' });
          setView('admin-dashboard');
        }}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700"
      >
        Partner Admin Login
      </button>
    </div>
  </div>
);

const MemberDashboard = () => (
  <div className="animate-fadeIn pt-24 pb-20 bg-slate-50 min-h-screen">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">JD</div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, John Doe</h1>
          <div className="text-slate-500">Team: RoboTitans India | ID: W-IND-001</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="text-blue-600" /> Certificates
          </h3>
          <div className="p-4 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
            <div>
              <div className="font-bold text-sm">Participation 2024</div>
              <div className="text-xs text-slate-500">Technoxian World Cup</div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <Download size={20} />
            </button>
          </div>
          <button className="w-full mt-4 text-sm font-bold text-blue-600 border border-blue-200 rounded py-2 hover:bg-blue-50">
            Verify A Certificate
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TechnoxianView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [regType, setRegType] = useState('team');
  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen pt-20">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
          {['overview', 'disciplines', 'schedule', 'gallery', 'register'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'overview' && (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-[#0f172a] rounded-3xl text-white p-12 mb-12 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">Official Championship</div>
              <h1 className="text-5xl font-extrabold mb-6">Technoxian World Cup '26</h1>
              <button onClick={() => setActiveTab('register')} className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Register Now
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[{ l: 'Prize Pool', v: '$250k' }, { l: 'Teams', v: '120k+' }, { l: 'Countries', v: '95+' }, { l: 'Spectators', v: '2.5M' }].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div className="text-4xl font-extrabold text-blue-600 mb-2">{s.v}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'disciplines' && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {GAME_CATEGORIES.map((g) => (
              <div key={g.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="text-5xl mb-6 bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center">{g.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{g.name}</h3>
                <p className="text-slate-500 mb-6 text-sm h-12 leading-relaxed">{g.desc}</p>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 mb-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Players</div>
                    <div className="font-bold text-slate-900">{g.players}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Prize</div>
                    <div className="font-bold text-green-600">{g.prize}</div>
                  </div>
                </div>
                <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                  Register for Game
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'register' && (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            <div className="md:w-64 bg-slate-50 border-r border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-6">Registration Type</h3>
              <div className="space-y-2">
                {['Team Registration', 'Visitor Pass', 'Exhibitor Space'].map((type) => {
                  const id = type.split(' ')[0].toLowerCase();
                  return (
                    <button
                      key={id}
                      onClick={() => setRegType(id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        regType === id ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                {regType === 'team' && <Users className="text-blue-600" />}
                {regType === 'visitor' && <Ticket className="text-blue-600" />}
                {regType === 'exhibitor' && <Building className="text-blue-600" />}
                {regType.charAt(0).toUpperCase() + regType.slice(1)} Registration
              </h2>
              <div className="space-y-6 max-w-3xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{regType === 'team' ? 'Team Name' : 'Full Name'}</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={regType === 'team' ? 'e.g. RoboTitans' : 'John Doe'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option>Select Country</option>
                      <option>India</option>
                      <option>UAE</option>
                      <option>USA</option>
                    </select>
                  </div>
                </div>
                {regType === 'team' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Categories ($100/category)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {GAME_CATEGORIES.map((g) => (
                        <label
                          key={g.id}
                          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        >
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 custom-checkbox" />
                          <span className="text-sm font-medium text-slate-700">{g.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                  <div>
                    <div className="text-sm text-slate-500">Total Payable Amount</div>
                    <div className="text-2xl font-bold text-slate-900">$200.00 USD</div>
                  </div>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <CreditCard size={18} /> Proceed to Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// FOOTER
const Footer = ({ setView, switchSite, currentSite }) => (
  <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-800">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold ${currentSite.colors.primary}`}>
              {currentSite.is_partner ? 'T' : 'W'}
            </div>
            <span className="text-white font-bold text-xl tracking-tight">{currentSite.is_partner ? 'TECHNOXIAN' : 'WORSO'}</span>
          </div>
          <p className="max-w-sm mb-6 leading-relaxed text-sm">
            {currentSite.is_partner ? 'The official regional chapter of the World Robotics Championship.' : 'The World Robotics Society is the global regulatory body.'}
          </p>
        </div>
        <div>
          {!currentSite.is_partner && (
            <>
              <h4 className="text-white font-bold mb-6">Governance</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => setView('about')} className="hover:text-white">
                    Board of Directors
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('about')} className="hover:text-white">
                    Constitution
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('about')} className="hover:text-white">
                    Ethics Committee
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button onClick={() => setView('technoxian')} className="hover:text-white">
                Technoxian Games
              </button>
            </li>
            <li>
              <button onClick={() => setView('teams')} className="hover:text-white">
                Teams & Rankings
              </button>
            </li>
            <li>
              <button onClick={() => setView('login')} className="hover:text-white">
                Verify Certificates
              </button>
            </li>
            <li>
              <button onClick={() => setView('careers')} className="hover:text-white">
                Careers at Worso
              </button>
            </li>
            <li className="pt-2 border-t border-slate-800">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex items-center justify-between">
        <div className="text-xs text-slate-600">© 2025. All Rights Reserved.</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setView('staff-login')} className="text-[10px] text-slate-800 hover:text-slate-600 font-bold uppercase">
            Staff Access
          </button>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase">View As:</span>
          <button onClick={() => switchSite('global')} className={`text-[10px] font-bold ${currentSite.id === 'global' ? 'text-blue-500' : 'text-slate-500'}`}>
            Global
          </button>
          <button onClick={() => switchSite('uae')} className={`text-[10px] font-bold ${currentSite.id === 'uae' ? 'text-emerald-500' : 'text-slate-500'}`}>
            UAE
          </button>
        </div>
      </div>
    </div>
  </footer>
);

// ADMIN
const AdminView = ({ setSites, sites, currentSite, setView }) => {
  const [isAdminMode, setIsAdminMode] = useState('super');
  const [activeTab, setActiveTab] = useState('overview');
  const [newPartner, setNewPartner] = useState({ country: '', theme: 'blue', subdomain: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState('');

  const handleCreatePartner = () => {
    const id = newPartner.country.toLowerCase().replace(/\s+/g, '');
    const newSite = {
      id,
      name: `TECHNOXIAN ${newPartner.country}`,
      logo_text: `TECHNOXIAN ${newPartner.country.toUpperCase()}`,
      sub_text: 'OFFICIAL PARTNER',
      theme: newPartner.theme,
      colors: newPartner.theme === 'emerald' ? DEFAULT_SITES.uae.colors : DEFAULT_SITES.global.colors,
      is_partner: true,
      local_events: [],
    };
    setSites({ ...sites, [id]: newSite });
    alert(`Partner site for ${newPartner.country} created!`);
    setNewPartner({ country: '', theme: 'blue', subdomain: '' });
  };

  const handleCreateEvent = () => {
    const targetSiteId = 'uae';
    const updatedSite = {
      ...sites[targetSiteId],
      local_events: [...sites[targetSiteId].local_events, { id: Date.now(), ...newEvent, status: 'Upcoming' }],
    };
    setSites({ ...sites, [targetSiteId]: updatedSite });
    alert('Local Event Created!');
    setNewEvent({ title: '', date: '', location: '' });
  };

  const generatePressRelease = async (event) => {
    setGenLoading(true);
    const prompt = `Write a short, exciting press release (max 100 words) for a robotics event titled "${event.title}" happening at "${event.location}" on "${event.date}". Use professional but energetic tone.`;
    const result = await callGemini(prompt);
    setGenResult(result);
    setGenLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 animate-fadeIn pt-16">
      <div className="w-64 bg-slate-900 text-white fixed h-full pt-6 flex flex-col">
        <div className="px-6 mb-8">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Console</div>
          <div className="font-bold text-xl">{isAdminMode === 'super' ? 'WORSO HQ' : 'Partner Portal'}</div>
        </div>
        <div className="px-4 space-y-2 flex-1">
          <div className="bg-slate-800 rounded-lg p-1 mb-6 flex text-xs font-bold">
            <button onClick={() => setIsAdminMode('super')} className={`flex-1 py-2 rounded ${isAdminMode === 'super' ? 'bg-blue-600' : 'hover:bg-slate-700'}`}>
              Super
            </button>
            <button
              onClick={() => setIsAdminMode('partner')}
              className={`flex-1 py-2 rounded ${isAdminMode === 'partner' ? 'bg-emerald-600' : 'hover:bg-slate-700'}`}
            >
              Partner
            </button>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-2 text-slate-400 hover:text-white font-medium flex items-center gap-3 ${activeTab === 'overview' ? 'text-white' : ''}`}
          >
            <Layout size={18} /> Overview
          </button>

          {isAdminMode === 'super' ? (
            <button
              onClick={() => setActiveTab('partners')}
              className={`w-full text-left px-4 py-2 text-slate-400 hover:text-white font-medium flex items-center gap-3 ${activeTab === 'partners' ? 'text-white' : ''}`}
            >
              <Building size={18} /> Manage Partners
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full text-left px-4 py-2 text-slate-400 hover:text-white font-medium flex items-center gap-3 ${activeTab === 'events' ? 'text-white' : ''}`}
            >
              <Calendar size={18} /> My Events
            </button>
          )}

          <button
            onClick={() => setView('home')}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 font-medium flex items-center gap-3 mt-8"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
      <div className="ml-64 flex-1 p-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {activeTab === 'overview' && 'Dashboard Overview'}
          {activeTab === 'partners' && 'Partner Management'}
          {activeTab === 'events' && 'Local Event Manager'}
        </h1>
        <p className="text-slate-500 mb-8">{isAdminMode === 'super' ? 'Global Control Panel' : `Managing: ${sites.uae.name}`}</p>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Revenue</div>
              <div className="text-3xl font-bold text-slate-900">{isAdminMode === 'super' ? '$2.4M' : '$45,000'}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">{isAdminMode === 'super' ? 'Partners' : 'Registrations'}</div>
              <div className="text-3xl font-bold text-slate-900">{isAdminMode === 'super' ? Object.keys(sites).length - 1 : '128'}</div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Plus size={20} /> Add New Partner Nation
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Country Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. South Korea"
                  value={newPartner.country}
                  onChange={(e) => setNewPartner({ ...newPartner, country: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Theme Color</label>
                <select
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newPartner.theme}
                  onChange={(e) => setNewPartner({ ...newPartner, theme: e.target.value })}
                >
                  <option value="blue">Worso Blue</option>
                  <option value="emerald">Emerald Green</option>
                  <option value="red">Crimson Red</option>
                </select>
              </div>
              <button onClick={handleCreatePartner} className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 w-full">
                Generate Micro-Site & Credentials
              </button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} /> Create Local Event
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Dubai Zonal Qualifier"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <button onClick={handleCreateEvent} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 w-full">
                  Publish Event
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-600">
                <Sparkles size={20} /> AI Press Generator
              </h3>
              <p className="text-sm text-slate-500 mb-4">Generate instant press releases for your local events using Gemini AI.</p>
              {sites.uae.local_events.map((evt) => (
                <div key={evt.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg mb-2">
                  <div>
                    <div className="font-bold">{evt.title}</div>
                    <div className="text-xs text-slate-500">{evt.date}</div>
                  </div>
                  <button
                    onClick={() => generatePressRelease(evt)}
                    disabled={genLoading}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded font-bold hover:bg-purple-200"
                  >
                    {genLoading ? 'Generating...' : '✨ Generate'}
                  </button>
                </div>
              ))}
              {genResult && <div className="mt-4 p-4 bg-purple-50 rounded-lg text-sm border border-purple-100 italic">{genResult}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// MAIN APP
export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [sites, setSites] = useState(DEFAULT_SITES);
  const [currentSite, setCurrentSite] = useState(DEFAULT_SITES.global);
  const [user, setUser] = useState(null);
  const [tickerText] = useState('BREAKING: Zonal Round registrations for Asia Pacific are now OPEN!');

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const switchSite = (siteId) => {
    setCurrentSite(sites[siteId]);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setView={setCurrentView} siteConfig={currentSite} />;
      case 'teams':
        return <TeamsView />;
      case 'technoxian':
        return <TechnoxianView />;
      case 'about':
        return <AboutLayout setView={setCurrentView} />;
      case 'governance':
        return <AboutLayout setView={setCurrentView} />;
      case 'associates':
        return <AssociatesView />;
      case 'careers':
        return <CareersView />;
      case 'partners':
        return <HomeView setView={setCurrentView} siteConfig={currentSite} />;
      case 'login':
        return (
          <div className="animate-fadeIn pt-32 pb-20 bg-slate-50 min-h-screen flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Member Login</h2>
              <button
                onClick={() => {
                  setUser({ name: 'John Doe', type: 'member' });
                  setCurrentView('member-dashboard');
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
              >
                Login as Team/Member
              </button>
            </div>
          </div>
        );
      case 'staff-login':
        return <AdminLoginView setView={setCurrentView} setUser={setUser} />;
      case 'member-dashboard':
        return <MemberDashboard user={user} />;
      case 'admin-dashboard':
        return <AdminView setSites={setSites} sites={sites} currentSite={currentSite} setView={setCurrentView} />;
      default:
        return <HomeView setView={setCurrentView} siteConfig={currentSite} />;
    }
  };

  return (
    <div
      className={`font-sans antialiased text-slate-900 bg-white min-h-screen flex flex-col ${
        currentSite.is_partner ? 'selection:bg-emerald-100 selection:text-emerald-900' : 'selection:bg-blue-100 selection:text-blue-900'
      }`}
    >
      <LiveTicker tickerText={tickerText} siteConfig={currentSite} />
      <Navigation
        currentView={currentView}
        setView={setCurrentView}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        siteConfig={currentSite}
        user={user}
      />
      <main className="flex-grow">{renderView()}</main>
      <AIReferee siteConfig={currentSite} />
      <Footer setView={setCurrentView} switchSite={switchSite} currentSite={currentSite} />
    </div>
  );
}
