import { useState, useEffect } from 'react';
import { Users, Ticket, Building, CreditCard, MapPin, Clock3, FileText, BadgeCheck, X, Camera, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_CATEGORIES } from '../constants/data';

const TechnoxianView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [regType, setRegType] = useState('team');
  const [modalCategory, setModalCategory] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [showAllGallery, setShowAllGallery] = useState(false);

  useEffect(() => {
    if (activeGallery) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeGallery]);

  const EVENTS = [
    {
      id: 'fpv',
      title: 'Drone Racing',
      venue: 'Drone Dome',
      start: 'Oct 12',
      end: 'Oct 13',
      days: [
        {
          date: 'Oct 12 (Sun)',
          items: [
            { time: '09:00', title: 'Gate Setup & Safety Check' },
            { time: '11:00', title: 'Qualifying Runs • Round 1' },
            { time: '15:00', title: 'Neon Gates Heats • FPV' },
          ],
        },
        {
          date: 'Oct 13 (Mon)',
          items: [
            { time: '10:00', title: 'Qualifying Runs • Round 2' },
            { time: '14:00', title: 'Semi Finals' },
            { time: '17:30', title: 'Grand Final • Awards' },
          ],
        },
      ],
    },
    {
      id: 'race',
      title: 'Robo Race',
      venue: 'Arena 1',
      start: 'Oct 12',
      end: 'Oct 14',
      days: [
        {
          date: 'Oct 12 (Sun)',
          items: [
            { time: '10:00', title: 'Track Walkthrough' },
            { time: '13:00', title: 'Time Trial Heats' },
            { time: '16:30', title: 'Knockout Bracket Reveal' },
          ],
        },
        {
          date: 'Oct 13 (Mon)',
          items: [
            { time: '09:30', title: 'Knockout Stage • Rounds 1-3' },
            { time: '15:00', title: 'Quarter Finals' },
          ],
        },
        {
          date: 'Oct 14 (Tue)',
          items: [
            { time: '11:00', title: 'Semi Finals' },
            { time: '16:00', title: 'Finals • Podium Ceremony' },
          ],
        },
      ],
    },
    {
      id: 'soccer',
      title: 'Robo Soccer',
      venue: 'Hex Turf',
      start: 'Oct 13',
      end: 'Oct 14',
      days: [
        {
          date: 'Oct 13 (Mon)',
          items: [
            { time: '09:00', title: 'Group Stage • Matches A-D' },
            { time: '14:00', title: 'Group Stage • Matches E-H' },
          ],
        },
        {
          date: 'Oct 14 (Tue)',
          items: [
            { time: '12:00', title: 'Semi Finals' },
            { time: '17:00', title: 'Final • Trophy Presentation' },
          ],
        },
      ],
    },
    {
      id: 'expo',
      title: 'Innovation Expo',
      venue: 'Prototype Lab',
      start: 'Oct 12',
      end: 'Oct 14',
      days: [
        {
          date: 'Oct 12 (Sun)',
          items: [
            { time: '10:00', title: 'Booth Setup & Safety Inspection' },
            { time: '13:00', title: 'Public Showcase Window' },
          ],
        },
        {
          date: 'Oct 13 (Mon)',
          items: [
            { time: '11:00', title: 'Prototype Demos' },
            { time: '16:00', title: 'Investor Pitch Hour' },
          ],
        },
        {
          date: 'Oct 14 (Tue)',
          items: [
            { time: '10:00', title: 'Open Floor • Audience Q&A' },
            { time: '15:30', title: 'Awards • Best Innovation' },
          ],
        },
      ],
    },
  ];
  const [activeEvent, setActiveEvent] = useState(EVENTS[0]);

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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-6">
                <div className="text-xs font-bold uppercase text-slate-500 mb-3">Events</div>
                <div className="space-y-2">
                  {EVENTS.map((ev) => {
                    const active = activeEvent.id === ev.id;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setActiveEvent(ev)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                          active ? 'bg-white border-blue-600 shadow-sm text-blue-700' : 'bg-white border-slate-200 hover:border-blue-400 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold">{ev.title}</div>
                          <div className={`text-[10px] px-2 py-1 rounded-full border ${active ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>View</div>
                        </div>
                        <div className="mt-1 text-xs flex items-center gap-2 text-slate-500">
                          <Calendar size={12} className={active ? 'text-blue-600' : 'text-slate-400'} /> {ev.start} – {ev.end}
                        </div>
                        <div className="mt-1 text-xs flex items-center gap-2 text-slate-500">
                          <MapPin size={12} className={active ? 'text-blue-600' : 'text-slate-400'} /> {ev.venue}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs font-bold uppercase text-blue-600 mb-1">Event Schedule</div>
                    <h2 className="text-2xl font-bold text-slate-900">{activeEvent.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2 justify-end">
                      <Calendar size={14} className="text-blue-600" /> {activeEvent.start} – {activeEvent.end}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 justify-end">
                      <MapPin size={12} className="text-slate-400" /> {activeEvent.venue}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {activeEvent.days.map((d) => (
                    <div key={d.date} className="rounded-2xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-5 py-3 flex items-center gap-2">
                        <Clock3 size={14} className="text-blue-600" />
                        <div className="text-sm font-bold text-slate-700">{d.date}</div>
                      </div>
                      <div className="bg-white p-5 space-y-3">
                        {d.items.map((itm) => (
                          <div key={itm.time + itm.title} className="flex items-start gap-4">
                            <div className="w-20 text-right">
                              <div className="text-xs font-bold text-slate-500">{itm.time}</div>
                            </div>
                            <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
                              <div className="font-bold text-slate-900">{itm.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                      <label className="block text-sm font-bold text-slate-700 mb-2">Select Categories ($100/category)</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {GAME_CATEGORIES.map((g) => (
                          <label key={g.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 custom-checkbox" />
                            <span className="text-sm font-medium text-slate-700">{g.name}</span>
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
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{modalCategory.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Competition Zone</div>
                    <h3 className="text-2xl font-bold text-slate-900">{modalCategory.name}</h3>
                  </div>
                </div>
                <p className="text-slate-600">{modalCategory.desc}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 uppercase">Rulebook PDF</div>
                    <a className="text-blue-600 font-bold text-sm" href={modalCategory.rulebook} target="_blank" rel="noreferrer">
                      {modalCategory.rulebook}
                    </a>
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

