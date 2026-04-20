// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Hexagon, Cpu, ChevronRight } from 'lucide-react';
// import { FloatingElement } from './AnimationComponents';
// import MakersSocialProof from './MakersSocialProof';
// import ClubRegistrationModal from '../modals/ClubRegistrationModal';
// import { HERO_AUDIENCE_TAGS } from '../../constants/roboclubLandingData';
// import heroTeamImage from '../../assets/b12.jpg.jpeg';

// const HeroSection = ({setPage}) => {
//   const [showInvitationModal, setShowInvitationModal] = useState(false);

//   const handleInvitationSuccess = () => {
//     setPage('dashboard');
//   };
//   return (
//     <section className="relative box-border flex min-h-[100dvh] flex-col overflow-hidden bg-slate-950 pt-24 pb-4 sm:pb-6">
//       {/* Intrinsic-size photo: natural dimensions when they fit; scale down only to stay inside hero (no cover crop) */}
//       <div
//         className="absolute inset-0 flex items-center justify-center overflow-auto bg-slate-950"
//         aria-hidden
//       >
//         <img
//           src={heroTeamImage}
//           alt="Robotics competition and teams at Technoxian"
//           className="block h-auto w-auto max-h-full max-w-full"
//           loading="eager"
//           decoding="async"
//           fetchPriority="high"
//         />
//       </div>
//       {/* Readability: directional scrim + vignette */}
//       <div
//         className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/35 sm:to-slate-950/25 lg:to-transparent"
//         aria-hidden
//       />
//       <div
//         className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/70"
//         aria-hidden
//       />
//       <div
//         className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_50%,transparent_20%,rgb(2,6,23)_75%)] opacity-90 sm:opacity-100"
//         aria-hidden
//       />

//       {/* Background Grid & Glow */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 mix-blend-overlay"></div>
     
//       {/* Dynamic Background Orbs */}
//       <FloatingElement delay={0} duration={8} xRange={50} yRange={50} className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
//       <FloatingElement delay={1} duration={10} xRange={-40} yRange={60} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen" />

//       {/* 3D Floating Tech Particles */}
//       <FloatingElement delay={0.5} duration={4} xRange={10} yRange={15} className="absolute top-32 right-[20%] text-slate-800 opacity-20 hidden lg:block">
//         <Hexagon size={120} strokeWidth={1} />
//       </FloatingElement>
//       <FloatingElement delay={2} duration={5} xRange={-10} yRange={-20} className="absolute bottom-32 left-[10%] text-cyan-900 opacity-20 hidden lg:block">
//         <Cpu size={80} strokeWidth={1} />
//       </FloatingElement>

//       {/* Fills space below fixed nav; min-h-0 allows shrink + optional scroll on very short viewports */}
//       <div className="relative z-10 flex min-h-0 w-full flex-1 items-center overflow-y-auto overscroll-y-contain">
//         <div className="hero-main-section mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-2 sm:gap-10 sm:py-0 lg:grid-cols-2 lg:gap-12 xl:gap-16">
//           <div className="relative space-y-4 sm:space-y-5 lg:space-y-8">
//           {/* Decorative Line */}
//           <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent hidden lg:block"></div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 lg:mb-6">
//               <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
//               Technoxian 2026
//             </div>
//             <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_32px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-6xl xl:text-7xl">
//               WHERE <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
//                 LEGENDS ARE FORGED.
//               </span>
//             </h1>
//             <p className="mt-4 max-w-lg border-l-2 border-white/20 pl-4 text-base leading-relaxed text-slate-200/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)] sm:pl-6 sm:text-lg lg:mt-6">
//               Join the elite league of robotics. Connect, compete, and claim your glory in the world's largest robotics championship ecosystem.
//             </p>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="space-y-4 sm:space-y-5"
//           >
//             <div>
             
//               <ul
//                 className="flex flex-wrap gap-2 sm:gap-2.5"
//                 aria-label="Institution types RoboClub serves"
//               >
//                 {HERO_AUDIENCE_TAGS.map((label) => (
//                   <li key={label}>
//                     <span className="inline-flex items-center rounded-full border border-white/15 bg-slate-950/50 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm backdrop-blur-sm sm:text-[13px]">
//                       {label}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="flex flex-wrap gap-3 sm:gap-4">
//             <button onClick={() => setShowInvitationModal(true)} className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-slate-950 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] sm:px-8 sm:py-4 sm:text-lg">
//               Start Your Journey
//               <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
//             </button>
//             {/* <button  onClick={() => setShowInvitationModal(true)} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-800 sm:px-8 sm:py-4">
//               <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
//               Register Your RoboClub
//             </button> */}
//             </div>
//           </motion.div>
//         </div>

//         </div>
        
//       </div>

//       {/* Club Registration Modal (email → OTP → club form → /club/add) */}
//       <ClubRegistrationModal
//         showModal={showInvitationModal}
//         setShowModal={setShowInvitationModal}
//         onSuccess={handleInvitationSuccess}
//       />
//     </section>
//   );
// };

// export default HeroSection;


// updated code 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Cpu, ChevronRight } from 'lucide-react';
import { FloatingElement } from './AnimationComponents';
import ClubRegistrationModal from '../modals/ClubRegistrationModal';
import { HERO_AUDIENCE_TAGS } from '../../constants/roboclubLandingData';
import heroTeamImage from '../../assets/b12.jpg.jpeg';

const HeroSection = ({ setPage }) => {
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  const handleInvitationSuccess = () => {
    setPage('dashboard');
  };

  return (
    <section className="relative box-border flex min-h-[100dvh] flex-col overflow-hidden bg-[#020b10] pt-24 pb-4 sm:pb-6 font-sans">
      
      {/* 🖼️ Background Image Container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#020b10]" aria-hidden>
        <img
          src={heroTeamImage}
          alt="Robotics competition"
          className="block h-auto w-auto max-h-full max-w-full opacity-100 mix-blend-normal object-cover" 
          loading="eager"
        />
      </div>

      {/* Cyan Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#06b6d4 0.5px, transparent 0.5px), linear-gradient(90deg, #06b6d4 0.5px, transparent 0.5px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Scrims - text readability ke liye */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020b10]/80 via-[#020b10]/40 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020b10]/60 via-transparent to-transparent" aria-hidden />

      {/* Neon Glow Orbs */}
      <FloatingElement delay={0} duration={8} xRange={50} yRange={50} className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen opacity-60" />
      <FloatingElement delay={1} duration={10} xRange={-40} yRange={60} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen opacity-60" />

      {/* Hexagon Particle */}
      <FloatingElement delay={0.5} duration={4} xRange={10} yRange={15} className="absolute top-32 right-[20%] text-cyan-400 opacity-10 hidden lg:block">
        <Hexagon size={120} strokeWidth={1} />
      </FloatingElement>

      <div className="relative z-10 flex min-h-0 w-full flex-1 items-center overflow-y-auto overscroll-y-contain">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-2 lg:grid-cols-2 lg:gap-16">
          
          <div className="relative space-y-8">
            {/* Sidebar Neon Line */}
            <div className="absolute -left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent hidden lg:block"></div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Pulsing Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                Technoxian 2026
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl font-black leading-[1.05] tracking-tighter text-white sm:text-6xl lg:text-7xl xl:text-8xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                WHERE <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  LEGENDS ARE FORGED.
                </span>
              </h1>

              {/* ✅ UPDATED: Chhota aur subtle paragraph */}
              <p className="mt-6 max-w-md border-l-2 border-cyan-500/40 pl-5 text-sm leading-relaxed text-slate-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Join the elite league of robotics. Connect, compete, and claim your glory in the world's largest robotics championship ecosystem.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-10"
            >
              {/* Audience Tags */}
              <ul className="flex flex-wrap gap-3">
                {HERO_AUDIENCE_TAGS.map((label) => (
                  <li key={label}>
                    <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-xl hover:bg-cyan-500/10 transition-colors shadow-lg">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-5">
                {/* CTA Button */}
                <button 
                  onClick={() => setShowInvitationModal(true)} 
                  className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95"
                >
                  Start Your Journey
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ClubRegistrationModal
        showModal={showInvitationModal}
        setShowModal={setShowInvitationModal}
        onSuccess={handleInvitationSuccess}
      />
    </section>
  );
};

export default HeroSection;