// import React from 'react';
// import { motion } from 'framer-motion';
// import { Target, Eye, Sparkles, Cpu, Users, Trophy, BadgeCheck } from 'lucide-react';
// import { ROBOCLUB_ABOUT } from '../../constants/roboclubLandingData';

// const iconMap = {
//   cpu: Cpu,
//   users: Users,
//   trophy: Trophy,
//   badge: BadgeCheck,
// };

// const AboutRoboClubSection = () => (
//   <section id="about-robo" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
//     <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
//     <div className="absolute top-20 right-0 w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
//     <div className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

//     <div className="relative z-10 max-w-6xl mx-auto px-6">
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5 }}
//         className="text-center max-w-3xl mx-auto mb-16"
//       >
//         <span className="inline-flex items-center gap-2 text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase">
//           <Sparkles className="w-4 h-4" />
//           About ExClub
//         </span>
//         <h2 className="text-4xl md:text-5xl font-black text-white mt-4 leading-tight">
//           {ROBOCLUB_ABOUT.headline}
//         </h2>
//         <p className="text-slate-400 text-lg mt-6 leading-relaxed">{ROBOCLUB_ABOUT.intro}</p>
//       </motion.div>

//       <div className="grid md:grid-cols-3 gap-6 mb-16">
//         {[
//           {
//             title: 'Mission',
//             body: ROBOCLUB_ABOUT.mission,
//             Icon: Target,
//             grad: 'from-cyan-500/20 to-transparent',
//           },
//           {
//             title: 'Vision',
//             body: ROBOCLUB_ABOUT.vision,
//             Icon: Eye,
//             grad: 'from-violet-500/20 to-transparent',
//           },
//           {
//             title: 'Who Can Join',
//             body: ROBOCLUB_ABOUT.purpose,
//             Icon: Sparkles,
//             grad: 'from-fuchsia-500/20 to-transparent',
//           },
//         ].map((card, i) => (
//           <motion.div
//             key={card.title}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.08 }}
//             className={`relative rounded-2xl border border-slate-800 bg-gradient-to-br ${card.grad} p-6 backdrop-blur-sm`}
//           >
//             <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center mb-4">
//               <card.Icon className="w-6 h-6 text-cyan-400" />
//             </div>
//             <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
//           </motion.div>
//         ))}
//       </div>

//       <div>
//         <h3 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-10">
//           What you gain by joining
//         </h3>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {ROBOCLUB_ABOUT.gains.map((item, i) => {
//             const Icon = iconMap[item.icon] || Cpu;
//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.06 }}
//                 className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/40 transition-colors"
//               >
//                 <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
//                   <Icon className="w-5 h-5" />
//                 </div>
//                 <h4 className="text-white font-bold mb-2">{item.title}</h4>
//                 <p className="text-slate-500 text-sm leading-relaxed">{item.blurb}</p>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   </section>
// );

// export default AboutRoboClubSection;



// updated code
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Sparkles, Cpu, Users, Trophy, BadgeCheck } from 'lucide-react';
import { ROBOCLUB_ABOUT } from '../../constants/roboclubLandingData';

const iconMap = {
  cpu: Cpu,
  users: Users,
  trophy: Trophy,
  badge: BadgeCheck,
};

const AboutRoboClubSection = () => (
  <section id="about-robo" className="relative py-24 bg-[#020b10] border-t border-cyan-500/10 overflow-hidden font-sans">
    
    {/* 1. Precise Cyan Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d412_1px,transparent_1px),linear-gradient(to_bottom,#06b6d412_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
    
    {/* 2. Deep Glow Orbs */}
    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />

    <div className="relative z-10 max-w-6xl mx-auto px-6">
      
      {/* 🔥 Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <span className="inline-flex items-center gap-2 text-cyan-400 font-black tracking-[0.4em] text-[10px] uppercase mb-4 px-4 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5">
          <Sparkles className="w-3 h-3" />
          About ExClub
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white mt-4 leading-tight tracking-tighter">
          {ROBOCLUB_ABOUT.headline.split(' ').map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" : ""}>
              {word}{' '}
            </span>
          ))}
        </h2>
        <p className="text-slate-400 text-lg mt-6 leading-relaxed italic">"{ROBOCLUB_ABOUT.intro}"</p>
      </motion.div>

      {/* 🏆 Mission/Vision/Purpose Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {[
          {
            title: 'Mission',
            body: ROBOCLUB_ABOUT.mission,
            Icon: Target,
            borderColor: 'group-hover:border-cyan-500/50',
            glow: 'bg-cyan-500/10',
          },
          {
            title: 'Vision',
            body: ROBOCLUB_ABOUT.vision,
            Icon: Eye,
            borderColor: 'group-hover:border-blue-500/50',
            glow: 'bg-blue-500/10',
          },
          {
            title: 'Who Can Join',
            body: ROBOCLUB_ABOUT.purpose,
            Icon: Sparkles,
            borderColor: 'group-hover:border-fuchsia-500/50',
            glow: 'bg-fuchsia-500/10',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 ${card.borderColor} hover:-translate-y-2`}
          >
            {/* Top Glow Layer */}
            <div className={`absolute inset-0 rounded-3xl ${card.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all duration-500">
                <card.Icon className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight uppercase">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{card.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ⚡ Gains Grid */}
      {/* <div className="pt-16 border-t border-white/5">
        <h3 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-14text-center text-sm font-black uppercase tracking-[0.5em] text-slate-500 mb-14">
          Benefits of Becoming an EX Club
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROBOCLUB_ABOUT.gains.map((item, i) => {
            const Icon = iconMap[item.icon] || Cpu;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative rounded-2xl border border-white/5 bg-[#0a1219]/50 p-6 hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-white font-black text-sm mb-2 uppercase tracking-wide">{item.title}</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed group-hover:text-slate-400 transition-colors">{item.blurb}</p>
              </motion.div>
            );
          })}
        </div>
      </div> */}

      {/* updated code */}
      <div className="pt-16 border-t border-white/5">
  <h3 className="text-center text-sm font-black uppercase tracking-[0.5em] text-slate-500 mb-14">
    Benefits of Becoming an EX Club
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
    {ROBOCLUB_ABOUT.gains.map((item, i) => {
      const Icon = iconMap[item.icon] || Cpu;

      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="group relative h-full min-h-[220px] rounded-2xl border border-white/5 bg-[#0a1219]/50 p-6 hover:bg-white/[0.03] hover:border-cyan-500/30 transition-all duration-300"
        >
          {/* ICON */}
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500 shadow-inner">
            <Icon className="w-6 h-6" />
          </div>

          {/* TITLE */}
          <h4 className="text-white font-black text-sm mb-3 uppercase tracking-wide">
            {item.title}
          </h4>

          {/* DESCRIPTION */}
          {Array.isArray(item.blurb) ? (
            <ul className="space-y-2 text-[13px] text-slate-400">
              {item.blurb.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 group-hover:text-slate-300 transition"
                >
                  <span className="text-cyan-400 mt-[2px]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-[13px] leading-relaxed group-hover:text-slate-400 transition-colors">
              {item.blurb}
            </p>
          )}
        </motion.div>
      );
    })}
  </div>
</div>
    </div>
  </section>
);

export default AboutRoboClubSection;