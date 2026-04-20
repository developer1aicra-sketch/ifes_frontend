// import React from 'react';
// import { motion } from 'framer-motion';
// import { BookOpen, Bot, BrainCircuit, Sparkles, Layers, Cpu } from 'lucide-react';
// import { LEARNING_TRACKS } from '../../constants/roboclubLandingData';

// /** Per-track layout + chrome so the three cards read as different “products”, not copies. */
// const trackSkin = (id) => {
//   switch (id) {
//     case 'beginner':
//       return {
//         shell:
//           'rounded-[1.75rem] border-2 border-dashed border-emerald-500/45 shadow-[0_0_48px_-18px_rgba(16,185,129,0.35)]',
//         headerIcon: BookOpen,
//         stepShape: 'circle', // rounded-full numbers
//         stepNumClass:
//           'bg-emerald-950/55 border-emerald-500/45 text-emerald-200 ring-2 ring-emerald-500/10',
//         stepLineClass: 'from-emerald-500/50',
//         topicIconMuted: 'text-emerald-500/70',
//         badge: { label: 'Foundation', className: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200' },
//         paceIcon: 'text-emerald-400',
//         primaryBtn:
//           'bg-emerald-400 text-slate-950 hover:shadow-[0_0_28px_-6px_rgba(16,185,129,0.55)] shadow-emerald-500/20',
//         secondaryBtn: 'border-emerald-500/35 hover:bg-emerald-500/10',
//         progress: { pct: 25, label: 'Getting started' },
//       };
//     case 'intermediate':
//       return {
//         shell:
//           'rounded-3xl border border-cyan-500/45 shadow-[0_0_80px_-18px_rgba(34,211,238,0.42)] ring-1 ring-cyan-500/40',
//         headerIcon: Layers,
//         stepShape: 'circle',
//         stepNumClass: 'bg-slate-800/90 border-cyan-500/40 text-cyan-200',
//         stepLineClass: 'from-cyan-500/45',
//         topicIconMuted: 'text-cyan-500/60',
//         paceIcon: 'text-cyan-400',
//         primaryBtn:
//           'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35',
//         secondaryBtn: 'border-cyan-500/40 hover:bg-cyan-500/10',
//         progress: { pct: 55, label: 'Building momentum' },
//       };
//     case 'advanced':
//       return {
//         shell:
//           'rounded-2xl border-2 border-violet-500/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_0_40px_-12px_rgba(139,92,246,0.35)]',
//         headerIcon: Cpu,
//         stepShape: 'square', // sharper step markers
//         stepNumClass:
//           'rounded-lg w-8 h-8 bg-violet-950/65 border-violet-500/50 text-violet-100 text-[11px] font-bold tracking-tight',
//         stepLineClass: 'from-violet-500/45',
//         topicIconMuted: 'text-violet-400/70',
//         paceIcon: 'text-violet-400',
//         primaryBtn:
//           'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
//         secondaryBtn: 'border-violet-500/40 hover:bg-violet-500/10',
//         progress: { pct: 80, label: 'Arena-ready systems' },
//       };
//     default:
//       return trackSkin('beginner');
//   }
// };

// const topicIcon = (i, mutedClass) => {
//   if (i === 0) return <Bot className={`w-4 h-4 shrink-0 ${mutedClass}`} />;
//   if (i === 1) return <BookOpen className={`w-4 h-4 shrink-0 ${mutedClass}`} />;
//   return <BrainCircuit className={`w-4 h-4 shrink-0 ${mutedClass}`} />;
// };

// const LearningTracksSection = () => (
//   <section id="learning-tracks" className="py-24 bg-slate-950 border-t border-slate-900">
//     <div className="max-w-6xl mx-auto px-6">
//       <div className="text-center mb-16 max-w-2xl mx-auto">
//         <span className="text-violet-400 font-bold tracking-widest text-xs uppercase">Program</span>
//         <h2 className="text-4xl font-black text-white mt-2 mb-4">Program &amp; learning track progress</h2>
//         <p className="text-slate-400">
//           Pick a track, then measure progress in milestones—not guesswork. Each path bundles robotics fundamentals,
//           hands-on builds, and AI/automation into clear steps you can complete and showcase.
//         </p>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
//         {LEARNING_TRACKS.map((track, idx) => {
//           const skin = trackSkin(track.id);
//           const HeaderIcon = skin.headerIcon;
//           const isFeatured = track.featured;
//           const stepRounded = skin.stepShape === 'square' ? 'rounded-lg' : 'rounded-full';

//           return (
//             <motion.article
//               key={track.id}
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: idx * 0.1 }}
//               className={`relative flex flex-col overflow-hidden bg-gradient-to-b ${track.accent} from-slate-900/90 to-slate-950 transition-transform will-change-transform ${
//                 skin.shell
//               } ${isFeatured ? 'p-8 lg:p-9 lg:scale-[1.02] lg:-translate-y-2 z-10' : 'p-7 lg:p-8'}`}
//             >
//               {isFeatured && (
//                 <>
//                   <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />
//                   <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-cyan-500/15 blur-[60px]" />
//                   <div className="pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-fuchsia-500/10 blur-[70px]" />
//                   <div className="absolute top-5 left-5 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-black tracking-wide">
//                     <Sparkles className="w-4 h-4" />
//                     Recommended
//                   </div>
//                 </>
//               )}

//               {track.id === 'advanced' && (
//                 <div
//                   className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.07]"
//                   style={{
//                     backgroundImage:
//                       'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
//                     backgroundSize: '24px 24px',
//                   }}
//                 />
//               )}

//               {!isFeatured && skin.badge && (
//                 <div
//                   className={`absolute top-5 left-5 z-20 inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${skin.badge.className}`}
//                 >
//                   {skin.badge.label}
//                 </div>
//               )}

//               <div className={`flex items-start justify-between gap-3 mb-5 ${!isFeatured && skin.badge ? 'pt-10' : isFeatured ? 'pt-10' : ''}`}>
//                 <div className="min-w-0">
//                   <p className={`text-xs font-bold uppercase tracking-wider ${track.iconColor}`}>Track {idx + 1}</p>
//                   <h3
//                     className={`font-black text-white mt-1 ${isFeatured ? 'text-3xl' : track.id === 'advanced' ? 'text-2xl tracking-tight' : 'text-2xl'}`}
//                   >
//                     {track.level}
//                   </h3>
//                   <p className="text-slate-400 text-sm mt-2 leading-relaxed">{track.tagline}</p>
//                   <div className="mt-3">
//                     {/* <div className="flex items-center justify-between gap-4 text-xs">
//                       <span className="text-slate-500 font-semibold">{skin.progress.label}</span>
//                       <span className="text-slate-400 font-black">{skin.progress.pct}%</span>
//                     </div> */}
//                     {/* <div className="mt-2 h-2 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
//                       <div
//                         className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
//                         style={{ width: `${skin.progress.pct}%` }}
//                       />
//                     </div> */}
//                   </div>
//                 </div>
//                 <div
//                   className={`p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700 ${track.iconColor} shrink-0 ${
//                     isFeatured ? 'shadow-[0_0_24px_-10px_rgba(34,211,238,0.55)]' : ''
//                   } ${track.id === 'advanced' ? 'rounded-xl border-violet-500/30' : ''}`}
//                 >
//                   <HeaderIcon size={24} strokeWidth={track.id === 'advanced' ? 2 : 1.75} />
//                 </div>
//               </div>

//               <ol className="space-y-3 flex-1 mb-6 relative z-10">
//                 {track.topics.map((topic, stepIdx) => (
//                   <li key={topic.title} className="flex gap-3">
//                     <div className="flex flex-col items-center pt-0.5">
//                       <span
//                         className={`w-8 h-8 flex items-center justify-center shrink-0 border font-mono text-xs ${stepRounded} ${skin.stepNumClass}`}
//                       >
//                         {stepIdx + 1}
//                       </span>
//                       {stepIdx < track.topics.length - 1 && (
//                         <span
//                           className={`w-px flex-1 min-h-[22px] bg-gradient-to-b mt-1 ${skin.stepLineClass} to-transparent`}
//                         />
//                       )}
//                     </div>
//                     <div className="pb-2 min-w-0">
//                       <div className="flex items-center gap-2 text-white font-semibold text-sm">
//                         {topic.emoji ? (
//                           <span className="text-base leading-none shrink-0" aria-hidden>
//                             {topic.emoji}
//                           </span>
//                         ) : (
//                           topicIcon(stepIdx, skin.topicIconMuted)
//                         )}
//                         <span>{topic.title}</span>
//                       </div>
//                       <p className="text-slate-500 text-[13px] mt-1 leading-relaxed">{topic.detail}</p>
//                     </div>
//                   </li>
//                 ))}
//               </ol>

//               {/* <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 relative z-10">
//                 <CheckCircle2 className={`w-4 h-4 shrink-0 ${skin.paceIcon}`} />
//                 <span>Typical pace: {track.durationWeeks}</span>
//               </div> */}

//               {/* <div className="flex flex-col sm:flex-row gap-3 relative z-10">
//                 <button
//                   type="button"
//                   className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${skin.primaryBtn}`}
//                 >
//                   Start learning
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//                 <button
//                   type="button"
//                   className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-600 text-slate-200 font-semibold text-sm transition-colors ${skin.secondaryBtn}`}
//                 >
//                   Explore track
//                 </button>
//               </div> */}
//             </motion.article>
//           );
//         })}
//       </div>
//     </div>
//   </section>
// );

// export default LearningTracksSection;


// update code 
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Bot, BrainCircuit, Sparkles, Layers, Cpu } from 'lucide-react';
import { LEARNING_TRACKS } from '../../constants/roboclubLandingData';

/** Per-track layout + chrome - Cleaned up with High-Tech aesthetic */
const trackSkin = (id) => {
  switch (id) {
    case 'beginner':
      return {
        shell: 'rounded-[1.75rem] border border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_40px_-15px_rgba(16,185,129,0.2)]',
        headerIcon: BookOpen,
        stepShape: 'circle',
        stepNumClass: 'bg-emerald-950/55 border-emerald-500/40 text-emerald-400',
        stepLineClass: 'from-emerald-500/40',
        topicIconMuted: 'text-emerald-400',
        badge: { label: 'Foundation', className: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
      };
    case 'intermediate':
      return {
        shell: 'rounded-3xl border border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_60px_-15px_rgba(34,211,238,0.3)] ring-1 ring-cyan-500/20',
        headerIcon: Layers,
        stepShape: 'circle',
        stepNumClass: 'bg-slate-900 border-cyan-500/50 text-cyan-400',
        stepLineClass: 'from-cyan-500/40',
        topicIconMuted: 'text-cyan-400',
        badge: { label: 'Pro Track', className: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
      };
    case 'advanced':
      return {
        shell: 'rounded-2xl border border-violet-500/40 bg-violet-500/5 shadow-[0_0_40px_-15px_rgba(139,92,246,0.2)]',
        headerIcon: Cpu,
        stepShape: 'square',
        stepNumClass: 'rounded-lg bg-violet-950 border-violet-500/50 text-violet-400',
        stepLineClass: 'from-violet-500/40',
        topicIconMuted: 'text-violet-400',
        badge: { label: 'Elite', className: 'bg-violet-500/10 border-violet-500/20 text-violet-400' },
      };
    default:
      return trackSkin('beginner');
  }
};

const topicIcon = (i, mutedClass) => {
  if (i === 0) return <Bot className={`w-4 h-4 shrink-0 ${mutedClass}`} />;
  if (i === 1) return <BookOpen className={`w-4 h-4 shrink-0 ${mutedClass}`} />;
  return <BrainCircuit className={`w-4 h-4 shrink-0 ${mutedClass}`} />;
};

const LearningTracksSection = () => (
  <section id="learning-tracks" className="py-24 bg-[#020b10] border-t border-white/5 relative overflow-hidden">
    
    {/* Background Tech Overlays */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d408_1px,transparent_1px),linear-gradient(to_bottom,#06b6d408_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

    <div className="max-w-6xl mx-auto px-6 relative z-10">
      
      {/* 🎯 Header Section */}
      <div className="text-center mb-20 max-w-2xl mx-auto">
        <span className="text-cyan-400 font-black tracking-[0.4em] text-[10px] uppercase px-4 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 inline-block mb-4">
          Learning Paths
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mt-2 mb-6 tracking-tighter">
          Program & learning track progress
        </h2>
        <p className="text-slate-400 text-base leading-relaxed font-medium">
          Pick a track, then measure progress in milestones—not guesswork. Each path bundles robotics fundamentals into clear steps you can showcase.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-stretch">
        {LEARNING_TRACKS.map((track, idx) => {
          const skin = trackSkin(track.id);
          const HeaderIcon = skin.headerIcon;
          const isFeatured = track.featured;
          const stepRounded = skin.stepShape === 'square' ? 'rounded-lg' : 'rounded-full';

          return (
            <motion.article
              key={track.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${
                skin.shell
              } ${isFeatured ? 'p-8 lg:p-9 lg:scale-[1.05] z-10' : 'p-7 lg:p-8'}`}
            >
              {/* Badge for Track Level */}
              <div className="mb-6">
                 <span className={`inline-flex px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${skin.badge.className}`}>
                    {skin.badge.label}
                 </span>
              </div>

              <div className="flex items-start justify-between gap-3 mb-8">
                <div className="min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-widest opacity-60 text-white`}>Track 0{idx + 1}</p>
                  <h3 className={`font-black text-white mt-1 leading-none ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>
                    {track.level}
                  </h3>
                  <p className="text-slate-400 text-[13px] mt-3 leading-relaxed font-medium">{track.tagline}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 shrink-0 shadow-inner`}>
                  <HeaderIcon size={24} strokeWidth={1.5} />
                </div>
              </div>

              {/* Milestones List */}
              <ol className="space-y-5 flex-1 mb-6 relative z-10">
                {track.topics.map((topic, stepIdx) => (
                  <li key={topic.title} className="flex gap-4 group/item">
                    <div className="flex flex-col items-center pt-1">
                      <span className={`w-7 h-7 flex items-center justify-center shrink-0 border font-bold text-[10px] ${stepRounded} ${skin.stepNumClass} transition-colors group-hover/item:bg-white group-hover/item:text-black`}>
                        {stepIdx + 1}
                      </span>
                      {stepIdx < track.topics.length - 1 && (
                        <span className={`w-[1px] flex-1 min-h-[24px] bg-gradient-to-b mt-2 ${skin.stepLineClass} to-transparent`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-white font-black text-[13px] uppercase tracking-wide">
                        {topic.emoji ? (
                          <span className="text-base leading-none shrink-0">{topic.emoji}</span>
                        ) : (
                          topicIcon(stepIdx, skin.topicIconMuted)
                        )}
                        <span>{topic.title}</span>
                      </div>
                      <p className="text-slate-500 text-[12px] mt-1.5 leading-relaxed font-medium group-hover/item:text-slate-300 transition-colors">
                        {topic.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export default LearningTracksSection;
