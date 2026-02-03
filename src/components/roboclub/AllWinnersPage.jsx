import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Trophy, Globe } from 'lucide-react';

const ALL_WINNERS = [
  { id: 1, name: "Team Iron Giants", country: "India", category: "Robo Soccer", image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=300&h=300", points: "12,500" },
  { id: 2, name: "Cyber Strikers", country: "Iran", category: "Bot Combat", image: "https://images.unsplash.com/photo-1535378437323-95288ac9dd5c?auto=format&fit=crop&q=80&w=300&h=300", points: "8,900" },
  { id: 3, name: "Mech Warriors", country: "USA", category: "Drone Race", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=300&h=300", points: "7,200" },
  { id: 4, name: "Solaris Bot", country: "Germany", category: "Solar Challenge", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=300", points: "6,800" },
  { id: 5, name: "AquaForce", country: "Japan", category: "Water Rocket", image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=300", points: "6,500" },
  { id: 6, name: "Terra Rovers", country: "Australia", category: "Innovator", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300", points: "6,100" },
  { id: 7, name: "Sky High", country: "China", category: "Drone Race", image: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=300", points: "5,900" },
  { id: 8, name: "Pixel Dust", country: "UK", category: "Pixel Art Bot", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300", points: "5,500" },
];

const AllWinnersPage = ({ onBack }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-slate-950 to-slate-950"></div>
       
      <div className=" mx-auto px-6 relative z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="text-yellow-400 font-bold tracking-wider text-sm uppercase mb-2">Technoxian Archives</div>
            <h1 className="text-5xl font-black text-white">CHAMPIONS GALLERY</h1>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-4 py-2 outline-none">
              <option>Season 2025</option>
              <option>Season 2024</option>
              <option>Season 2023</option>
            </select>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-4 py-2 outline-none">
              <option>All Categories</option>
              <option>Robo Soccer</option>
              <option>Bot Combat</option>
              <option>Drone Race</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_WINNERS.map((winner, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={winner.id}
              className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-yellow-500/40 transition-all group"
            >
              <div className="relative h-48">
                <img src={winner.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={winner.name} />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Trophy size={12} /> {idx < 3 ? `#${idx + 1}` : 'Finalist'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1">{winner.name}</h3>
                <p className="text-cyan-400 text-sm font-medium mb-3">{winner.category}</p>
                <div className="flex justify-between items-center text-sm text-slate-500 border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1"><Globe size={14}/> {winner.country}</span>
                  <span>{winner.points} pts</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllWinnersPage;