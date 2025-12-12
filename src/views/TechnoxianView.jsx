import { useState, useEffect } from 'react';
import { Users, Ticket, Building, CreditCard, MapPin, Clock3, FileText, BadgeCheck, X, Camera, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_CATEGORIES } from '../constants/data';

const TechnoxianView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [regType, setRegType] = useState('team');
  const [modalCategory, setModalCategory] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [trophyIndex, setTrophyIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  
  // Schedule navigation states
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarLevel, setSidebarLevel] = useState('championship'); // 'championship', 'event', 'game'

  useEffect(() => {
    if (activeGallery) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeGallery]);

  // Define the 11 games
  const GAMES_LIST = [
    { id: 'innovation-jr', name: 'Innovation Jr.' },
    { id: 'innovation-open', name: 'Innovation Open' },
    { id: 'robo-soccer', name: 'Robo Soccer' },
    { id: 'robo-race', name: 'Robo Race' },
    { id: 'sumo-bot', name: 'Sumo Bot' },
    { id: 'flf-jr', name: 'FLF Jr.' },
    { id: 'flf-sr', name: 'FLF Sr.' },
    { id: 'water-rocket', name: 'Water Rocket' },
    { id: 'maze-solver', name: 'Maze Solver' },
    { id: 'rc-craft', name: 'Rc Craft' },
    { id: 'drone-rescue', name: 'Drone Rescue' },
    { id: 'rc-electric', name: 'Rc Electric' },
    { id: 'robo-hockey', name: 'Robo Hockey' }
  ];

  // Define zonal categories
  const ZONAL_CATEGORIES = [
    { id: 'zonal-west', name: 'Zonal West' },
    { id: 'zonal-east', name: 'Zonal East' },
    { id: 'zonal-south', name: 'Zonal South' },
    { id: 'zonal-north', name: 'Zonal North' },
    { id: 'zonal-center', name: 'Zonal Center' }
  ];

  // Generate games with schedules
  const generateGameSchedule = (gameId, gameName, zone) => {
    const startDate = new Date(2025, 5, 10);
    const endDate = new Date(2025, 5, 11);
    return {
      id: gameId,
      name: gameName,
      zone: zone,
      venue: `Arena ${Math.floor(Math.random() * 5) + 1}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      schedule: [
        { date: startDate.toISOString().split('T')[0], time: '09:00', title: 'Setup & Safety Check' },
        { date: startDate.toISOString().split('T')[0], time: '11:00', title: 'Qualifying Rounds' },
        { date: endDate.toISOString().split('T')[0], time: '14:00', title: 'Finals & Awards' },
      ],
      description: `${gameName} competition in the ${zone} zone. Showcase your skills and compete for the championship title.`,
      registrationLink: `/register/${gameId}`
    };
  };

  // Generate zonal events with all games
  const generateZonalEvents = () => {
    return ZONAL_CATEGORIES.map(zone => ({
      id: zone.id,
      name: zone.name,
      games: GAMES_LIST.map(game => 
        generateGameSchedule(`${zone.id}-${game.id}`, game.name, zone.name)
      )
    }));
  };

  // Generate national events
  const generateNationalEvents = (startYear = 2025, endYear = 2015) => {
    return Array.from({ length: startYear - endYear + 1 }, (_, idx) => {
      const year = startYear - idx;
      return {
        id: `national-${year}`,
        name: `National Championship ${year}`,
        games: GAMES_LIST.slice(0, 5).map(game => 
          generateGameSchedule(`nat-${year}-${game.id}`, game.name, `National ${year}`)
        )
      };
    });
  };

  // Generate world cup events
  const generateWorldCupEvents = (startYear = 2025, endYear = 2015) => {
    return Array.from({ length: startYear - endYear + 1 }, (_, idx) => {
      const year = startYear - idx;
      return {
        id: `worldcup-${year}`,
        name: `Technoxian World Cup ${year}`,
        games: GAMES_LIST.map(game => 
          generateGameSchedule(`wc-${year}-${game.id}`, game.name, `World Cup ${year}`)
        )
      };
    });
  };

  // Updated schedule data structure
  const SCHEDULE_DATA = [
    {
      id: 'zonals',
      name: 'Zonals',
      events: generateZonalEvents(),
    },
    {
      id: 'national',
      name: 'National',
      events: generateNationalEvents(),
    },
    {
      id: 'worldcup',
      name: 'World Cup',
      events: generateWorldCupEvents(),
    },
  ];

  // Ensure sidebar starts at the championship level
  useEffect(() => {
    setSidebarLevel('championship');
  }, []);

  // Trophy data for years 2025-2015 (decreasing order)
  const trophies = Array.from({ length: 11 }, (_, i) => {
    const year = 2025 - i;
    return {
      year,
      name: `Technoxian World Cup ${year}`,
      image: `/trophies/trophy-${year}.png`,
    };
  });

  // Create a data URI placeholder image (SVG)
  const createPlaceholderImage = (year) => {
    const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#f1f5f9"/><text x="50%" y="40%" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#64748b" text-anchor="middle" dominant-baseline="middle">🏆</text><text x="50%" y="65%" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="middle" dominant-baseline="middle">${year}</text></svg>`;
    // Use URL encoding for better compatibility
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const handleImageError = (year) => {
    setImageErrors((prev) => ({ ...prev, [year]: true }));
  };

  const nextTrophy = () => {
    setTrophyIndex((prev) => {
      const maxIndex = Math.max(0, Math.ceil(trophies.length / 4) - 1) * 4;
      return prev >= maxIndex ? 0 : prev + 4;
    });
  };

  const prevTrophy = () => {
    setTrophyIndex((prev) => {
      const maxIndex = Math.max(0, Math.ceil(trophies.length / 4) - 1) * 4;
      return prev <= 0 ? maxIndex : prev - 4;
    });
  };

  const gallery = [
    {
      id: 'fpv',
      title: 'Drone Racing',
      tag: 'FPV • Neon Gates',
      cover: 'https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1471710371017-654b1b43eaa2?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop',
      ],
    },
    {
      id: 'race',
      title: 'Robo Race',
      tag: 'Canyon Sprint',
      cover: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508614999368-9260051291ea?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop',
      ],
    },
    {
      id: 'soccer',
      title: 'Robo Soccer',
      tag: 'Hex Turf Finals',
      cover: 'https://images.unsplash.com/photo-1521417531039-75e91486ccae?w=900&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1521417531039-75e91486ccae?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511918984145-48de785d4c4d?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop',
      ],
    },
    {
      id: 'sumo',
      title: 'Sumo Bot',
      tag: 'Steel Ring',
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508614999368-9260051291ea?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop',
      ],
    },
    {
      id: 'expo',
      title: 'Innovation Expo',
      tag: 'Prototype Lab',
      cover: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=900&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop',
      ],
    },
  ];

  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 sticky top-[56px] z-30 shadow-sm">
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

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="container mx-auto px-4 py-12"
          >
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

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1">Countdown</div>
              <div className="text-3xl font-extrabold text-slate-900">280d : 12h : 35m</div>
              <p className="text-sm text-slate-500 mt-2">Opening ceremony — Dubai Exhibition Centre</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-2">
                <MapPin size={14} /> Venue Map
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">Arena zones: Competition halls, Innovation Expo, Visitor concourse, Exhibitor docks.</p>
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-2">
                <Clock3 size={14} /> Live Status
              </div>
              <p className="text-sm text-green-600 font-bold">Registrations open • Rulebook v2.0 active</p>
              <p className="text-xs text-slate-500 mt-1">Realtime updates federated to partner subdomains.</p>
            </div>
          </div>

          {/* Trophies Section */}
          <div className="mt-10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-4">
              <BadgeCheck size={14} className="text-blue-600" /> Trophies
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden rounded-xl">
                  <motion.div
                    className="flex"
                    animate={{ x: `-${trophyIndex * (100 / 4)}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {trophies.map((trophy) => (
                      <div key={trophy.year} className="min-w-[25%] flex flex-col items-center justify-center px-3">
                        <div className="w-full max-w-[200px] mb-4">
                          <img
                            src={imageErrors[trophy.year] ? createPlaceholderImage(trophy.year) : trophy.image}
                            alt={trophy.name}
                            className="w-full h-auto object-contain rounded-lg bg-slate-50 border border-slate-200"
                            onError={() => handleImageError(trophy.year)}
                            loading="lazy"
                          />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 text-center leading-tight">{trophy.name}</h3>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevTrophy}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white border border-slate-200 rounded-full p-2 shadow-sm hover:bg-slate-50 hover:border-blue-400 transition-colors z-10"
                  aria-label="Previous trophy"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                <button
                  onClick={nextTrophy}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white border border-slate-200 rounded-full p-2 shadow-sm hover:bg-slate-50 hover:border-blue-400 transition-colors z-10"
                  aria-label="Next trophy"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.ceil(trophies.length / 4) }).map((_, index) => {
                    const startIndex = index * 4;
                    const isActive = trophyIndex >= startIndex && trophyIndex < startIndex + 4;
                    return (
                      <button
                        key={index}
                        onClick={() => setTrophyIndex(startIndex)}
                        className={`h-1.5 rounded-full transition-all ${
                          isActive ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Go to trophy group ${index + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {activeTab === 'disciplines' && (
          <motion.div
            key="disciplines"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="container mx-auto px-4 py-12"
          >
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
                <button
                  onClick={() => setModalCategory(g)}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  Register for Game
                </button>
              </div>
            ))}
          </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="container mx-auto px-4 py-12"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[640px]">
              {/* Schedule sidebar */}
              <div className="w-72 bg-[#0f172a] text-white relative overflow-hidden border-r border-slate-800">
                <div className="relative h-full">
                  <AnimatePresence initial={false} mode="wait">
                    {sidebarLevel === 'championship' && (
                      <motion.div
                        key="championship"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="relative p-6 space-y-4 overflow-y-auto"
                        style={{ scrollbarColor: '#1d4ed8 #0f172a', scrollbarWidth: 'thin' }}
                      >
                        <div className="mb-4">
                          <div className="text-[11px] font-bold uppercase text-blue-200">Schedule</div>
                          <div className="text-xl font-extrabold">Championship Levels</div>
                        </div>
                        <div className="space-y-2">
                          {SCHEDULE_DATA.map((champ) => (
                            <button
                              key={champ.id}
                              onClick={() => {
                                setSelectedChampionship(champ.id);
                                setSidebarLevel('event');
                              }}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between ${
                                selectedChampionship === champ.id
                                  ? 'bg-white/15 border-blue-400 text-white'
                                  : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                              }`}
                            >
                              <span className="font-semibold text-sm">{champ.name}</span>
                              <ChevronRight size={14} className="text-blue-200" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {sidebarLevel === 'event' && selectedChampionship && (
                      <motion.div
                        key="event"
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -30, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute inset-0 z-20 bg-[#0f172a] p-6 space-y-4 overflow-y-auto"
                        style={{ scrollbarColor: '#1d4ed8 #0f172a', scrollbarWidth: 'thin' }}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSidebarLevel('championship');
                              setSelectedEvent(null);
                              setSelectedGame(null);
                            }}
                            className="flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
                          >
                            <ChevronLeft size={16} />
                            <span>Back</span>
                          </button>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase text-blue-200 mb-1">Events</div>
                          <div className="text-lg font-extrabold text-white">
                            {SCHEDULE_DATA.find((c) => c.id === selectedChampionship)?.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {SCHEDULE_DATA.find((c) => c.id === selectedChampionship)?.events.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => {
                                setSelectedEvent(event.id);
                                setSelectedGame(null);
                                setSidebarLevel('game');
                              }}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between ${
                                selectedEvent === event.id
                                  ? 'bg-white/15 border-blue-400 text-white'
                                  : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                              }`}
                            >
                              <div className="flex items-center gap-8 justify-between">
                                <span className="font-semibold text-sm text-white">{event.name}</span>
                                <div className="flex items-center gap-2 text-blue-200 text-[11px]">
                                  <span className="uppercase tracking-wide">{event.games.length} games</span>
                                  <ChevronRight size={14} />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {sidebarLevel === 'game' && selectedChampionship && selectedEvent && (
                      <motion.div
                        key="game"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute inset-0 bg-[#0f172a] p-6 space-y-4 overflow-y-auto"
                        style={{ scrollbarColor: '#1d4ed8 #0f172a', scrollbarWidth: 'thin' }}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSidebarLevel('event');
                              setSelectedGame(null);
                            }}
                            className="flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
                          >
                            <ChevronLeft size={16} />
                            <span>Back</span>
                          </button>
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase text-blue-200 mb-1">Games</div>
                          <div className="text-lg font-extrabold text-white">
                            {SCHEDULE_DATA.find((c) => c.id === selectedChampionship)
                              ?.events.find((e) => e.id === selectedEvent)?.name}
                          </div>
                        </div>
                        <div className="space-y-3">
                          {SCHEDULE_DATA.find((c) => c.id === selectedChampionship)
                            ?.events.find((e) => e.id === selectedEvent)
                            ?.games.map((game) => {
                              const isActive = selectedGame === game.id;
                              return (
                                <button
                                  key={game.id}
                                  onClick={() => setSelectedGame(game.id)}
                                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm ${
                                    isActive
                                      ? 'bg-white/15 border-blue-400 text-white'
                                      : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                                  }`}
                                >
                                  <div className="font-semibold text-sm">{game.name}</div>
                                  <div className="text-xs text-blue-100 mt-1 flex items-center gap-2">
                                    <MapPin size={10} /> {game.venue}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Main Content Area - Game Details */}
              <div className="flex-1 overflow-y-auto p-8">
                {selectedChampionship && selectedEvent && selectedGame ? (
                  (() => {
                    const championship = SCHEDULE_DATA.find(c => c.id === selectedChampionship);
                    const event = championship?.events.find(e => e.id === selectedEvent);
                    const game = event?.games.find(g => g.id === selectedGame);
                    
                    if (!game) return null;

                    const formatDate = (dateStr) => {
                      const date = new Date(dateStr);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    };

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                          <div>
                            <div className="text-xs font-bold uppercase text-blue-600 mb-1">Game Schedule</div>
                            <h2 className="text-3xl font-bold text-slate-900">{game.name}</h2>
                            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-blue-600" />
                                {formatDate(game.startDate)} – {formatDate(game.endDate)}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-blue-600" />
                                {game.venue}
                              </div>
                              {game.zone && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-green-600" />
                                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                    {game.zone}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => window.open(game.registrationLink, '_blank')}
                              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
                            >
                              Register to Game
                            </button>
                            <button
                              onClick={() => setActiveTab('register')}
                              className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm"
                            >
                              View Registration
                            </button>
                          </div>
                        </div>

                        {game.description && (
                          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-slate-700 leading-relaxed">{game.description}</p>
                          </div>
                        )}

                        <h3 className="text-xl font-bold text-slate-900 mb-4">Schedule Details</h3>
                        <div className="space-y-4 mb-8">
                          {game.schedule.map((item, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                              <div className="bg-slate-50 px-5 py-3 flex items-center gap-3">
                                <Calendar size={14} className="text-blue-600" />
                                <div className="text-sm font-bold text-slate-700">{formatDate(item.date)}</div>
                                <div className="ml-auto flex items-center gap-2">
                                  <Clock3 size={14} className="text-blue-600" />
                                  <div className="text-sm font-bold text-slate-700">{item.time}</div>
                                </div>
                              </div>
                              <div className="bg-white p-5">
                                <div className="font-bold text-slate-900">{item.title}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="text-sm font-bold text-slate-900 mb-4">Event Information</div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Championship:</span>
                                <span className="text-sm font-medium text-slate-900">{championship?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Event:</span>
                                <span className="text-sm font-medium text-slate-900">{event?.name}</span>
                              </div>
                              {game.zone && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">Zone:</span>
                                  <span className="text-sm font-medium text-slate-900">{game.zone}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Venue:</span>
                                <span className="text-sm font-medium text-slate-900">{game.venue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Duration:</span>
                                <span className="text-sm font-medium text-slate-900">
                                  {formatDate(game.startDate)} to {formatDate(game.endDate)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-sm font-bold text-slate-900 mb-4">Registration</div>
                            <p className="text-sm text-slate-600 mb-4">
                              Ready to compete in {game.name}? Register now to secure your spot in the competition.
                            </p>
                            <button
                              onClick={() => window.open(game.registrationLink, '_blank')}
                              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                              Register Now
                            </button>
                            <p className="text-xs text-slate-500 mt-3 text-center">
                              Early registration discounts available until March 31, 2025
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-bold mb-2">Select a Game</div>
                      <div className="text-sm">Choose a championship level, event, and game to view the schedule</div>
                      <div className="mt-4 text-xs text-slate-500">
                        <div>• Zonals: West, East, South, North, Center zones</div>
                        <div>• National: Yearly national championships</div>
                        <div>• World Cup: International championships</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="container mx-auto px-4 py-12"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {gallery.map((cat, idx) => (
                <motion.button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveGallery(cat)}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-900 text-left"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url(${cat.cover})` }}
                  />
                  <div className="p-4 flex items-center justify-between text-white">
                    <div>
                      <div className="text-xs uppercase font-bold text-emerald-200 flex items-center gap-1">
                        <Camera size={14} /> {cat.tag}
                      </div>
                      <div className="text-lg font-extrabold">{cat.title}</div>
                    </div>
                    <div className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">View</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="container mx-auto px-4 py-12"
          >
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            <div className="md:w-64 bg-[#0f172a] p-6 text-white">
              <h3 className="font-bold text-white mb-6">Registration Type</h3>
              <div className="space-y-2">
                {['Team Registration', 'Visitor Pass', 'Exhibitor Space'].map((type) => {
                  const id = type.split(' ')[0].toLowerCase();
                  return (
                    <button
                      key={id}
                      onClick={() => setRegType(id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center justify-between ${
                        regType === id
                          ? 'bg-white/15 border-blue-400 text-white'
                          : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                      }`}
                    >
                      <span className="font-semibold text-sm">{type}</span>
                      {regType === id && <ChevronRight size={14} className="text-blue-200" />}
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
                {regType.charAt(0).toUpperCase() + regType.slice(1)} Path
              </h2>
              <div className="space-y-6 max-w-3xl">
                {regType === 'team' && (
                  <>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <BadgeCheck className="text-blue-600" size={18} />
                      <div>
                        <div className="font-bold text-slate-900">Path A: Team</div>
                        <p className="text-sm text-slate-600">Create team profile → add players → choose 9 competition categories → pay unified entry.</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Team Name</label>
                        <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. RoboTitans" />
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
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Zonal Category</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {ZONAL_CATEGORIES.map((zone) => (
                          <label key={zone.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                            <input type="radio" name="zone" className="w-5 h-5 text-blue-600 rounded-full border-slate-300 focus:ring-blue-500" />
                            <span className="text-sm font-medium text-slate-700">{zone.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Games ($100/game)</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {GAMES_LIST.map((game) => (
                          <label key={game.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 custom-checkbox" />
                            <span className="text-sm font-medium text-slate-700">{game.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {regType === 'visitor' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <BadgeCheck className="text-blue-600" size={18} />
                      <div>
                        <div className="font-bold text-slate-900">Path B: Visitor</div>
                        <p className="text-sm text-slate-600">Choose day pass → pay → instant QR ticket.</p>
                      </div>
                    </div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Day</label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option>Day 1 - Oct 12</option>
                      <option>Day 2 - Oct 13</option>
                      <option>Day 3 - Oct 14</option>
                    </select>
                  </div>
                )}

                {regType === 'exhibitor' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <BadgeCheck className="text-blue-600" size={18} />
                      <div>
                        <div className="font-bold text-slate-900">Path C: Exhibitor</div>
                        <p className="text-sm text-slate-600">Upload booth design → select floor space → pay deposit.</p>
                      </div>
                    </div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Booth Design</label>
                    <input type="file" className="w-full" />
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Floor Space</label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option>6m x 6m</option>
                      <option>9m x 9m</option>
                      <option>Custom (request)</option>
                    </select>
                  </div>
                )}

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                  <div>
                    <div className="text-sm text-slate-500">Unified Payment Gateway</div>
                    <div className="text-2xl font-bold text-slate-900">$200.00 USD</div>
                    <div className="text-xs text-slate-500">Applies to all paths; receipts shared to partner portals.</div>
                  </div>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <CreditCard size={18} /> Proceed to Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalCategory && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button onClick={() => setModalCategory(null)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                <X size={18} />
              </button>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="text-3xl">{modalCategory.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Competition Zone</div>
                    <h3 className="text-2xl font-bold text-slate-900">{modalCategory.name}</h3>
                  </div>
                </div>
                <p className="text-slate-600">{modalCategory.desc}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Rulebook</span>
                      <a 
                        href={modalCategory.rulebook} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        title="Download Rulebook"
                        download
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down">
                          <path d="M12 5v14"/>
                          <path d="m19 12-7 7-7-7"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Arena 3D Model</div>
                    <div className="font-bold text-slate-900 text-sm">{modalCategory.model}</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 uppercase">Scoring Criteria</div>
                  <div className="font-bold text-slate-900 text-sm">{modalCategory.scoring}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGallery && (
          <motion.div
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => e.stopPropagation()}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <div className="text-xs uppercase font-bold text-blue-600">{activeGallery.tag}</div>
                  <div className="text-2xl font-extrabold text-slate-900">{activeGallery.title} Gallery</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAllGallery((p) => !p)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {showAllGallery ? 'Show Less' : 'Show More'}
                  </button>
                  <button onClick={() => { setActiveGallery(null); setShowAllGallery(false); }} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto overscroll-contain">
                <div className="grid md:grid-cols-3 gap-4">
                  {(showAllGallery ? activeGallery.images : activeGallery.images.slice(0, 6)).map((img) => (
                    <div key={img} className="relative overflow-hidden rounded-2xl border border-slate-100 h-48">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnoxianView;