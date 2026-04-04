import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Cpu, ChevronRight } from 'lucide-react';
import { FloatingElement } from './AnimationComponents';
import ClubRegistrationModal from '../modals/ClubRegistrationModal';
import heroTeamImage from '../../assets/b12.jpg.jpeg';

const HeroSection = ({setPage}) => {
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  const handleInvitationSuccess = () => {
    setPage('dashboard');
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-slate-950">
      {/* Intrinsic-size photo: natural dimensions when they fit; scale down only to stay inside hero (no cover crop) */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-auto bg-slate-950"
        aria-hidden
      >
        <img
          src={heroTeamImage}
          alt="Robotics competition and teams at Technoxian"
          className="block h-auto w-auto max-h-full max-w-full"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      {/* Readability: directional scrim + vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/35 sm:to-slate-950/25 lg:to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_50%,transparent_20%,rgb(2,6,23)_75%)] opacity-90 sm:opacity-100"
        aria-hidden
      />

      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 mix-blend-overlay"></div>
     
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
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_32px_rgba(0,0,0,0.75)] lg:text-7xl">
              WHERE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                LEGENDS ARE FORGED.
              </span>
            </h1>
            <p className="mt-6 max-w-lg border-l-2 border-white/20 pl-6 text-lg leading-relaxed text-slate-200/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)]">
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
            <button  onClick={() => setShowInvitationModal(true)} className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl backdrop-blur-md transition-all flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Register Your RoboClub
            </button>
          </motion.div>

          <div className="flex items-center gap-6  border-white/10 py-8">
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="z-0 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-950 bg-slate-800 text-xs font-bold text-white ring-2 ring-white/10 transition-all hover:z-10 hover:scale-110 hover:ring-cyan-400">
                   <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
            <div className="text-sm drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              <p className="font-bold text-white">12,000+ Makers</p>
              <p className="text-slate-400">Joined this season</p>
            </div>
          </div>
        </div>
      </div>

      {/* Club Registration Modal (email → OTP → club form → /club/add) */}
      <ClubRegistrationModal
        showModal={showInvitationModal}
        setShowModal={setShowInvitationModal}
        onSuccess={handleInvitationSuccess}
      />
    </section>
  );
};

export default HeroSection;