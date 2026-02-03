import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, CheckCircle, Hexagon, Cpu, ChevronRight } from 'lucide-react';
import { FloatingElement, TiltCard } from './AnimationComponents';
import InvitationModal from '../../modals/InvitationModal';

const HeroSection = ({setPage}) => {
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  const handleInvitationSuccess = () => {
    setPage('dashboard');
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-slate-950">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>
     
      {/* Dynamic Background Orbs */}
      <FloatingElement delay={0} duration={8} xRange={50} yRange={50} className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
      <FloatingElement delay={1} duration={10} xRange={-40} yRange={60} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen" />

      {/* 3D Floating Tech Particles */}
      <FloatingElement delay={0.5} duration={4} xRange={10} yRange={15} className="absolute top-32 right-[20%] text-slate-800 opacity-20 hidden lg:block">
        <Hexagon size={120} strokeWidth={1} />
      </FloatingElement>
      <FloatingElement delay={2} duration={5} xRange={-10} yRange={-20} className="absolute bottom-32 left-[10%] text-cyan-900 opacity-20 hidden lg:block">
        <Cpu size={80} strokeWidth={1} />
      </FloatingElement>

      <div className="mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 relative">
          {/* Decorative Line */}
          <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent hidden lg:block"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Technoxian 2026
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              WHERE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                LEGENDS ARE FORGED.
              </span>
            </h1>
            <p className="text-slate-400 text-lg mt-6 max-w-lg leading-relaxed border-l-2 border-slate-800 pl-6">
              Join the elite league of robotics. Connect, compete, and claim your glory in the world's largest robotics championship ecosystem.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button onClick={() => setShowInvitationModal(true)} className="group px-8 py-4 bg-white text-slate-950 font-bold text-lg rounded-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] transition-all flex items-center gap-2">
              Start Your Journey
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl backdrop-blur-md transition-all flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Live Arena
            </button>
          </motion.div>

          <div className="flex items-center gap-6 pt-8 border-t border-white/5">
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden ring-2 ring-transparent hover:ring-cyan-400 transition-all z-0 hover:z-10 hover:scale-110">
                   <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
            <div className="text-sm">
              <p className="text-white font-bold">12,000+ Makers</p>
              <p className="text-slate-500">Joined this season</p>
            </div>
          </div>
        </div>

        {/* 3D Dashboard Preview */}
        <div className="relative perspective-1000">
          <FloatingElement duration={6} yRange={15} xRange={5}>
            <TiltCard className="hidden lg:block">
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                {/* Main Glass Card */}
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-10px_rgba(88,28,135,0.3)] overflow-hidden flex flex-col group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                 
                  {/* Fake UI Header */}
                  <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-black/20">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/60">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                      SYSTEM_ONLINE
                    </div>
                  </div>
                  
                  {/* Fake UI Body */}
                  <div className="p-6 grid grid-cols-2 gap-4 h-full relative z-10">
                    <div className="col-span-2 h-32 rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 p-5 flex items-end relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20">
                        <Trophy size={64} />
                      </div>
                      <div>
                        <div className="text-indigo-300 text-xs font-bold mb-1 tracking-wider">CURRENT GLOBAL RANK</div>
                        <div className="text-4xl font-black text-white flex items-baseline gap-2">#042 <span className="text-sm text-green-400 font-bold">▲ 3</span></div>
                      </div>
                    </div>
                    <div className="h-32 rounded-xl bg-slate-800/50 border border-white/5 p-4 hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2"><Trophy size={16}/></div>
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-xs text-slate-500">Intl. Wins</div>
                    </div>
                    <div className="h-32 rounded-xl bg-slate-800/50 border border-white/5 p-4 hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 mb-2"><Zap size={16}/></div>
                      <div className="text-2xl font-bold text-white">2.4k</div>
                      <div className="text-xs text-slate-500">Season XP</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements (Parallax) */}
                <motion.div
                  style={{ translateZ: 60, x: -20 }}
                  className="absolute -right-12 top-20 bg-slate-800/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl w-56 transform rotate-3"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">Qualifiers</div>
                      <div className="text-sm font-bold text-white">Zone A: Passed</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>SYNCING...</span>
                      <span>98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  style={{ translateZ: 100, x: 20 }}
                  className="absolute -left-16 bottom-24 bg-gradient-to-tr from-pink-600 to-rose-600 p-5 rounded-2xl shadow-[0_10px_30px_rgba(225,29,72,0.4)] w-44 text-center transform -rotate-2 border border-white/20"
                >
                  <div className="text-pink-100 text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Next Match</div>
                  <div className="text-3xl font-black text-white">14:00</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    <div className="text-white text-xs font-bold">LIVE SOON</div>
                  </div>
                </motion.div>
              </div>
            </TiltCard>
          </FloatingElement>
        </div>
      </div>

      {/* Invitation Modal */}
      <InvitationModal 
        showInvitationModal={showInvitationModal}
        setShowInvitationModal={setShowInvitationModal}
        onSuccess={handleInvitationSuccess}
      />
    </section>
  );
};

export default HeroSection;