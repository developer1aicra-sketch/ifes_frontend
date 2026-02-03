import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Globe } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const WINNERS_HIGHLIGHT = [
  { id: 1, name: "Team Iron Giants", country: "India", category: "Robo Soccer", image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=300&h=300", points: "12,500" },
  { id: 2, name: "Cyber Strikers", country: "Iran", category: "Bot Combat", image: "https://images.unsplash.com/photo-1535378437323-95288ac9dd5c?auto=format&fit=crop&q=80&w=300&h=300", points: "8,900" },
  { id: 3, name: "Mech Warriors", country: "USA", category: "Drone Race", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=300&h=300", points: "7,200" },
];

const WinnersSection = ({ onViewAll }) => (
  <section id="winners" className="py-32 relative overflow-hidden bg-slate-950">
    {/* Golden Glow Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div className=" mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block p-4 rounded-full bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-500/30 mb-6"
        >
          <Trophy className="w-12 h-12 text-yellow-400" />
        </motion.div>
        <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-700 tracking-tight uppercase">
          Hall of Fame
        </h2>
        <p className="text-yellow-100/60 mt-4 text-xl">Celebrating the legends of the World Robotics Championship</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-end">
        {/* 2nd Place */}
        <div className="order-2 lg:order-1 relative group">
          <div className="absolute inset-0 bg-slate-800 transform rotate-1 rounded-2xl opacity-50 group-hover:rotate-2 transition-transform"></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 rounded-2xl">
            <div className="h-48 mb-6 overflow-hidden rounded-xl relative">
              <img src={WINNERS_HIGHLIGHT[1].image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Winner" />
              <div className="absolute top-4 left-4 w-8 h-8 bg-slate-400 text-slate-900 font-bold rounded-full flex items-center justify-center">2</div>
            </div>
            <h3 className="text-2xl font-bold text-white">{WINNERS_HIGHLIGHT[1].name}</h3>
            <p className="text-slate-400">{WINNERS_HIGHLIGHT[1].category}</p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-500">
              <span>{WINNERS_HIGHLIGHT[1].country}</span>
              <span className="text-slate-300">{WINNERS_HIGHLIGHT[1].points} pts</span>
            </div>
          </div>
        </div>

        {/* 1st Place - Featured */}
        <div className="order-1 lg:order-2 relative group -mt-12 z-20">
          <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-slate-900 border border-yellow-500/30 p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
                <Trophy className="w-10 h-10 text-white fill-current" />
              </div>
            </div>
            <div className="h-56 mb-6 overflow-hidden rounded-xl relative">
              <img src={WINNERS_HIGHLIGHT[0].image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Winner" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase">Grand Champion</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-black text-white">{WINNERS_HIGHLIGHT[0].name}</h3>
              <p className="text-slate-400 mt-1">{WINNERS_HIGHLIGHT[0].category}</p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-400 font-bold">
                <Star size={16} fill="currentColor" /> {WINNERS_HIGHLIGHT[0].points} pts
              </div>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="order-3 relative group">
          <div className="absolute inset-0 bg-slate-800 transform -rotate-1 rounded-2xl opacity-50 group-hover:-rotate-2 transition-transform"></div>
          <div className="relative bg-slate-900 border border-slate-700 p-6 rounded-2xl">
            <div className="h-48 mb-6 overflow-hidden rounded-xl relative">
              <img src={WINNERS_HIGHLIGHT[2].image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Winner" />
              <div className="absolute top-4 left-4 w-8 h-8 bg-orange-700 text-white font-bold rounded-full flex items-center justify-center">3</div>
            </div>
            <h3 className="text-2xl font-bold text-white">{WINNERS_HIGHLIGHT[2].name}</h3>
            <p className="text-slate-400">{WINNERS_HIGHLIGHT[2].category}</p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-sm text-slate-500">
              <span>{WINNERS_HIGHLIGHT[2].country}</span>
              <span className="text-slate-300">{WINNERS_HIGHLIGHT[2].points} pts</span>
            </div>
          </div>
        </div>
      </div>
     
      <div className="mt-16 text-center">
        <NavLink
          to="/all-winners"
          className="px-8 py-3 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-white transition-colors"
        >
          View All Previous Winners
        </NavLink>
      </div>
    </div>
  </section>
);

export default WinnersSection;