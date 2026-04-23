// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
// import { Trophy, Star } from "lucide-react";
// import { WRC_WINNERS_RANKING } from "../../constants/roboclubLandingData";
// import { WRC_CLUB_LOGO_BY_WINNER_ID } from "../../constants/wrcClubLogos";

// /** flagcdn.com — lowercase ISO 3166-1 alpha-2 */
// const FLAG_CDN = "https://flagcdn.com";

// function mod(n, m) {
//   return ((n % m) + m) % m;
// }

// function WinnerHeroFlag({ countryCode, label, className = "" }) {
//   const code = (countryCode || "").toLowerCase().trim();
//   const [failed, setFailed] = useState(false);

//   if (!code || failed) {
//     return (
//       <div
//         className={`flex items-center justify-center bg-slate-800 text-slate-500 text-sm font-medium ${className}`}
//         title={label}
//       >
//         —
//       </div>
//     );
//   }

//   return (
//     <img
//       src={`${FLAG_CDN}/w640/${code}.png`}
//       alt=""
//       className={`w-full h-full object-cover ${className}`}
//       loading="lazy"
//       decoding="async"
//       onError={() => setFailed(true)}
//     />
//   );
// }

// /** Club mark when bundled; otherwise country flag hero. */
// function WinnerHeroVisual({ clubLogoSrc, countryCode, label, className = "" }) {
//   const [logoFailed, setLogoFailed] = useState(false);

//   if (clubLogoSrc && !logoFailed) {
//     return (
//       <img
//         src={clubLogoSrc}
//         alt=""
//         className={`w-full h-full object-contain object-center bg-slate-900/95  ${className}`}
//         loading="lazy"
//         decoding="async"
//         onError={() => setLogoFailed(true)}
//       />
//     );
//   }

//   return <WinnerHeroFlag countryCode={countryCode} label={label} className={className} />;
// }

// function WinnerCard({ winner, slot }) {
//   const rankLabel = winner.rank === 1 ? "Grand Champion" : `Rank ${winner.rank}`;
//   const clubLogoSrc = WRC_CLUB_LOGO_BY_WINNER_ID[winner.id];

//   if (slot === 2) {
//     return (
//       <>
//         <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 ease-out" />
//         <div className="relative bg-slate-900 border border-yellow-500/30 p-6 rounded-2xl shadow-2xl">
//           <div className="flex justify-center -mt-14 mb-6">
//             <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
//               <Trophy className="w-9 h-9 text-white fill-current" />
//             </div>
//           </div>
//           <div className="h-44 mb-6 overflow-hidden rounded-xl relative">
//             <WinnerHeroVisual
//               clubLogoSrc={clubLogoSrc}
//               countryCode={winner.countryCode}
//               label={winner.country}
//             />
//             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
//               <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase">{rankLabel}</p>
//             </div>
//           </div>
//           <div className="text-center">
//             <h3 className="text-2xl font-black text-white">{winner.name}</h3>
//             <p className="text-slate-400 mt-1">{winner.country}</p>
//             <p className="text-slate-500 text-sm mt-1">World Robotics Championship</p>
//             <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-400 font-bold">
//               <Star size={16} fill="currentColor" /> #{winner.rank}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const isInner = slot === 1 || slot === 3;
//   const paddingClass = isInner ? "p-6" : "p-5";
//   const imageHeightClass = isInner ? "h-44" : "h-36";
//   const nameClass = isInner ? "text-2xl" : "text-xl";
//   const metaTextClass = isInner ? "text-sm" : "text-xs";

//   const overlayClass =
//     slot === 0
//       ? "absolute inset-0 bg-slate-800 transform rotate-2 rounded-2xl opacity-50 group-hover:rotate-3 transition-transform duration-500 ease-out"
//       : slot === 1
//         ? "absolute inset-0 bg-slate-800 transform rotate-1 rounded-2xl opacity-50 group-hover:rotate-2 transition-transform duration-500 ease-out"
//         : slot === 3
//           ? "absolute inset-0 bg-slate-800 transform -rotate-1 rounded-2xl opacity-50 group-hover:-rotate-2 transition-transform duration-500 ease-out"
//           : "absolute inset-0 bg-slate-800 transform -rotate-2 rounded-2xl opacity-50 group-hover:-rotate-3 transition-transform duration-500 ease-out";

//   const badgeClass =
//     winner.rank <= 3 ? "bg-gradient-to-br from-amber-500 to-orange-700 text-white" : "bg-slate-400 text-slate-900";

//   return (
//     <>
//       <div className={overlayClass} />
//       <div className={`relative bg-slate-900 border border-slate-700 ${paddingClass} rounded-2xl`}>
//         <div className={`${imageHeightClass} mb-5 overflow-hidden rounded-xl relative`}>
//           <WinnerHeroVisual
//             clubLogoSrc={clubLogoSrc}
//             countryCode={winner.countryCode}
//             label={winner.country}
//             className="grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
//           />
//           <div
//             className={`absolute top-4 left-4 min-w-[2rem] h-8 px-2 ${badgeClass} font-bold rounded-full flex items-center justify-center tabular-nums`}
//           >
//             {winner.rank}
//           </div>
//         </div>
//         <h3 className={`${nameClass} font-bold text-white`}>{winner.name}</h3>
//         <p className="text-slate-400">{winner.country}</p>
//         <p className="text-slate-500 text-xs mt-1">World Robotics Championship</p>
//         <div
//           className={`mt-4 pt-4 border-t border-slate-800 flex justify-between items-center ${metaTextClass} text-slate-500`}
//         >
//           <span className="inline-flex items-center gap-2">
//             {clubLogoSrc ? (
//               <img
//                 src={clubLogoSrc}
//                 alt=""
//                 className="w-7 h-7 rounded-md object-contain bg-slate-800 border border-slate-600/50"
//                 loading="lazy"
//               />
//             ) : (
//               <img
//                 src={`${FLAG_CDN}/w40/${(winner.countryCode || "").toLowerCase()}.png`}
//                 alt=""
//                 className="w-6 h-4 rounded object-cover border border-slate-600/50"
//                 loading="lazy"
//               />
//             )}
//             {winner.country}
//           </span>
//           <span className="text-slate-300">#{winner.rank}</span>
//         </div>
//       </div>
//     </>
//   );
// }

// function WinnersSection() {
//   const [featuredIndex, setFeaturedIndex] = useState(0);
//   const [isHoveringPodium, setIsHoveringPodium] = useState(false);
//   const reduceMotion = useReducedMotion();

//   const layoutTransition = reduceMotion
//     ? { duration: 0 }
//     : { type: "spring", stiffness: 190, damping: 26, mass: 0.9 };

//   const emphasisTransition = reduceMotion
//     ? { duration: 0 }
//     : { type: "spring", stiffness: 230, damping: 24 };

//   const podiumSource = WRC_WINNERS_RANKING;
//   const total = podiumSource.length;

//   const visibleIndices = useMemo(() => {
//     return [
//       mod(featuredIndex - 2, total),
//       mod(featuredIndex - 1, total),
//       mod(featuredIndex, total),
//       mod(featuredIndex + 1, total),
//       mod(featuredIndex + 2, total),
//     ];
//   }, [featuredIndex, total]);

//   const visibleWinners = useMemo(() => {
//     return visibleIndices.map((idx) => podiumSource[idx]);
//   }, [visibleIndices, podiumSource]);

//   useEffect(() => {
//     if (reduceMotion) return;
//     if (total <= 5) return;

//     const intervalMs = 4200;
//     const id = window.setInterval(() => {
//       if (isHoveringPodium) return;
//       setFeaturedIndex((prev) => prev + 1);
//     }, intervalMs);

//     return () => window.clearInterval(id);
//   }, [reduceMotion, total, isHoveringPodium]);

//   const handleWinnerEnter = useCallback((absoluteIndex) => {
//     setFeaturedIndex(absoluteIndex);
//   }, []);

//   const slotEmphasis = useCallback((slot) => {
//     const distance = Math.abs(slot - 2);
//     if (distance === 0) return { scale: 1.02, opacity: 1 };
//     if (distance === 1) return { scale: 0.98, opacity: 0.95 };
//     return { scale: 0.94, opacity: 0.86 };
//   }, []);

//   return (
//     <section id="winners" className="py-32 relative overflow-hidden bg-slate-950">
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="mx-auto px-6 relative z-10">
//         <div className="text-center mb-20">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             className="inline-block p-4 rounded-full bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-500/30 mb-6"
//           >
//             <Trophy className="w-12 h-12 text-yellow-400" />
//           </motion.div>
//           <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-700 tracking-tight uppercase">
//             Hall of Fame
//           </h2>
//           <p className="text-yellow-100/60 mt-4 text-xl">
//             Celebrating the legends of the World Robotics Championship
//           </p>
//         </div>

//         <LayoutGroup>
//           <div
//             className="grid lg:grid-cols-5 gap-8 items-end"
//             onMouseEnter={() => setIsHoveringPodium(true)}
//             onMouseLeave={() => setIsHoveringPodium(false)}
//           >
//             {visibleWinners.map((winner, slot) => (
//               <motion.div
//                 key={winner.id}
//                 className={slot === 2 ? "relative group -mt-10 z-20" : "relative group"}
//                 animate={slotEmphasis(slot)}
//                 transition={emphasisTransition}
//                 style={{
//                   zIndex: slot === 2 ? 30 : slot === 1 || slot === 3 ? 20 : 10,
//                 }}
//               >
//                 <motion.div
//                   layoutId={`winner-podium-${winner.id}`}
//                   layout
//                   transition={{ layout: layoutTransition }}
//                   className="cursor-pointer"
//                   onMouseEnter={() => handleWinnerEnter(visibleIndices[slot])}
//                 >
//                   <WinnerCard winner={winner} slot={slot} />
//                 </motion.div>
//               </motion.div>
//             ))}
//           </div>
//         </LayoutGroup>
//       </div>
//     </section>
//   );
// }

// export default WinnersSection;

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
// import { Trophy, Star } from "lucide-react";
// import { WRC_WINNERS_RANKING } from "../../constants/roboclubLandingData";
// import { WRC_CLUB_LOGO_BY_WINNER_ID } from "../../constants/wrcClubLogos";

// /** flagcdn.com — lowercase ISO 3166-1 alpha-2 */
// const FLAG_CDN = "https://flagcdn.com";

// function mod(n, m) {
//   return ((n % m) + m) % m;
// }

// function WinnerHeroFlag({ countryCode, label, className = "" }) {
//   const code = (countryCode || "").toLowerCase().trim();
//   const [failed, setFailed] = useState(false);

//   if (!code || failed) {
//     return (
//       <div
//         className={`flex items-center justify-center bg-slate-800 text-slate-500 text-sm font-medium ${className}`}
//         title={label}
//       >
//         —
//       </div>
//     );
//   }

//   return (
//     <img
//       src={`${FLAG_CDN}/w640/${code}.png`}
//       alt=""
//       className={`w-full h-full object-cover ${className}`}
//       loading="lazy"
//       decoding="async"
//       onError={() => setFailed(true)}
//     />
//   );
// }

// /** Club mark when bundled; otherwise country flag hero. */
// function WinnerHeroVisual({ clubLogoSrc, countryCode, label, className = "" }) {
//   const [logoFailed, setLogoFailed] = useState(false);

//   if (clubLogoSrc && !logoFailed) {
//     return (
//       <img
//         src={clubLogoSrc}
//         alt=""
//         className={`w-full h-full object-contain object-center bg-slate-900/95 ${className}`}
//         loading="lazy"
//         decoding="async"
//         onError={() => setLogoFailed(true)}
//       />
//     );
//   }

//   return <WinnerHeroFlag countryCode={countryCode} label={label} className={className} />;
// }

// function WinnerCard({ winner, slot }) {
//   const rankLabel = winner.rank === 1 ? "Grand Champion" : `Rank ${winner.rank}`;
//   const clubLogoSrc = WRC_CLUB_LOGO_BY_WINNER_ID[winner.id];

//   if (slot === 2) {
//     return (
//       <>
//         <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 ease-out" />
//         <div className="relative bg-[#0d1f35] border border-yellow-500/30 p-6 rounded-2xl shadow-2xl">
//           <div className="flex justify-center -mt-14 mb-6">
//             <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full flex items-center justify-center border-4 border-[#0a1628] shadow-xl">
//               <Trophy className="w-9 h-9 text-white fill-current" />
//             </div>
//           </div>
//           <div className="h-44 mb-6 overflow-hidden rounded-xl relative">
//             <WinnerHeroVisual
//               clubLogoSrc={clubLogoSrc}
//               countryCode={winner.countryCode}
//               label={winner.country}
//             />
//             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#020b10]/90 to-transparent p-4">
//               <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase">{rankLabel}</p>
//             </div>
//           </div>
//           <div className="text-center">
//             <h3 className="text-2xl font-black text-white">{winner.name}</h3>
//             <p className="text-slate-400 mt-1">{winner.country}</p>
//             <p className="text-slate-500 text-sm mt-1">World Robotics Championship</p>
//             <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-400 font-bold">
//               <Star size={16} fill="currentColor" /> #{winner.rank}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const isInner = slot === 1 || slot === 3;
//   const paddingClass = isInner ? "p-6" : "p-5";
//   const imageHeightClass = isInner ? "h-44" : "h-36";
//   const nameClass = isInner ? "text-2xl" : "text-xl";
//   const metaTextClass = isInner ? "text-sm" : "text-xs";

//   const overlayClass =
//     slot === 0
//       ? "absolute inset-0 bg-[#0a1628] transform rotate-2 rounded-2xl opacity-50 group-hover:rotate-3 transition-transform duration-500 ease-out"
//       : slot === 1
//         ? "absolute inset-0 bg-[#0a1628] transform rotate-1 rounded-2xl opacity-50 group-hover:rotate-2 transition-transform duration-500 ease-out"
//         : slot === 3
//           ? "absolute inset-0 bg-[#0a1628] transform -rotate-1 rounded-2xl opacity-50 group-hover:-rotate-2 transition-transform duration-500 ease-out"
//           : "absolute inset-0 bg-[#0a1628] transform -rotate-2 rounded-2xl opacity-50 group-hover:-rotate-3 transition-transform duration-500 ease-out";

//   const badgeClass =
//     winner.rank <= 3 ? "bg-gradient-to-br from-amber-500 to-orange-700 text-white" : "bg-slate-400 text-slate-900";

//   return (
//     <>
//       <div className={overlayClass} />
//       <div className={`relative bg-[#0d1f35] border border-slate-700 ${paddingClass} rounded-2xl`}>
//         <div className={`${imageHeightClass} mb-5 overflow-hidden rounded-xl relative`}>
//           <WinnerHeroVisual
//             clubLogoSrc={clubLogoSrc}
//             countryCode={winner.countryCode}
//             label={winner.country}
//             className="grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
//           />
//           <div
//             className={`absolute top-4 left-4 min-w-[2rem] h-8 px-2 ${badgeClass} font-bold rounded-full flex items-center justify-center tabular-nums`}
//           >
//             {winner.rank}
//           </div>
//         </div>
//         <h3 className={`${nameClass} font-bold text-white`}>{winner.name}</h3>
//         <p className="text-slate-400">{winner.country}</p>
//         <p className="text-slate-500 text-xs mt-1">World Robotics Championship</p>
//         <div
//           className={`mt-4 pt-4 border-t border-slate-800 flex justify-between items-center ${metaTextClass} text-slate-500`}
//         >
//           <span className="inline-flex items-center gap-2">
//             {clubLogoSrc ? (
//               <img
//                 src={clubLogoSrc}
//                 alt=""
//                 className="w-7 h-7 rounded-md object-contain bg-[#0a1628] border border-slate-600/50"
//                 loading="lazy"
//               />
//             ) : (
//               <img
//                 src={`${FLAG_CDN}/w40/${(winner.countryCode || "").toLowerCase()}.png`}
//                 alt=""
//                 className="w-6 h-4 rounded object-cover border border-slate-600/50"
//                 loading="lazy"
//               />
//             )}
//             {winner.country}
//           </span>
//           <span className="text-slate-300">#{winner.rank}</span>
//         </div>
//       </div>
//     </>
//   );
// }

// function WinnersSection() {
//   const [featuredIndex, setFeaturedIndex] = useState(0);
//   const [isHoveringPodium, setIsHoveringPodium] = useState(false);
//   const reduceMotion = useReducedMotion();

//   const layoutTransition = reduceMotion
//     ? { duration: 0 }
//     : { type: "spring", stiffness: 190, damping: 26, mass: 0.9 };

//   const emphasisTransition = reduceMotion
//     ? { duration: 0 }
//     : { type: "spring", stiffness: 230, damping: 24 };

//   const podiumSource = WRC_WINNERS_RANKING;
//   const total = podiumSource.length;

//   const visibleIndices = useMemo(() => {
//     return [
//       mod(featuredIndex - 2, total),
//       mod(featuredIndex - 1, total),
//       mod(featuredIndex, total),
//       mod(featuredIndex + 1, total),
//       mod(featuredIndex + 2, total),
//     ];
//   }, [featuredIndex, total]);

//   const visibleWinners = useMemo(() => {
//     return visibleIndices.map((idx) => podiumSource[idx]);
//   }, [visibleIndices, podiumSource]);

//   useEffect(() => {
//     if (reduceMotion) return;
//     if (total <= 5) return;

//     const intervalMs = 4200;
//     const id = window.setInterval(() => {
//       if (isHoveringPodium) return;
//       setFeaturedIndex((prev) => prev + 1);
//     }, intervalMs);

//     return () => window.clearInterval(id);
//   }, [reduceMotion, total, isHoveringPodium]);

//   const handleWinnerEnter = useCallback((absoluteIndex) => {
//     setFeaturedIndex(absoluteIndex);
//   }, []);

//   const slotEmphasis = useCallback((slot) => {
//     const distance = Math.abs(slot - 2);
//     if (distance === 0) return { scale: 1.02, opacity: 1 };
//     if (distance === 1) return { scale: 0.98, opacity: 0.95 };
//     return { scale: 0.94, opacity: 0.86 };
//   }, []);

//   // Section background style matching RoboClubEventsSection
//   const sectionStyle = {
//     backgroundColor: '#020b10',
//   };

//   return (
//     <section
//       id="winners"
//       className="py-32 relative overflow-hidden border-t border-white/5"
//       style={sectionStyle}
//     >
//       {/* Subtle cyan grid — same as reference screenshot */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)`,
//           backgroundSize: '60px 60px',
//         }}
//       />

//       {/* Glow orbs */}
//       <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />
//       <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-700/10 rounded-full blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />

//       <div className="max-w-6xl mx-auto px-6 relative z-10">
//         <div className="text-center mb-20">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             className="inline-block p-4 rounded-full bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-500/30 mb-6"
//           >
//             <Trophy className="w-12 h-12 text-yellow-400" />
//           </motion.div>
//           <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-700 tracking-tight uppercase">
//             Hall of Fame
//           </h2>
//           <p className="text-yellow-100/60 mt-4 text-xl italic">
//             Celebrating the legends of the World Robotics Championship
//           </p>
//         </div>

//         <LayoutGroup>
//           <div
//             className="grid lg:grid-cols-5 gap-8 items-end"
//             onMouseEnter={() => setIsHoveringPodium(true)}
//             onMouseLeave={() => setIsHoveringPodium(false)}
//           >
//             {visibleWinners.map((winner, slot) => (
//               <motion.div
//                 key={winner.id}
//                 className={slot === 2 ? "relative group -mt-10 z-20" : "relative group"}
//                 animate={slotEmphasis(slot)}
//                 transition={emphasisTransition}
//                 style={{
//                   zIndex: slot === 2 ? 30 : slot === 1 || slot === 3 ? 20 : 10,
//                 }}
//               >
//                 <motion.div
//                   layoutId={`winner-podium-${winner.id}`}
//                   layout
//                   transition={{ layout: layoutTransition }}
//                   className="cursor-pointer"
//                   onMouseEnter={() => handleWinnerEnter(visibleIndices[slot])}
//                 >
//                   <WinnerCard winner={winner} slot={slot} />
//                 </motion.div>
//               </motion.div>
//             ))}
//           </div>
//         </LayoutGroup>
//       </div>
//     </section>
//   );
// }

// export default WinnersSection;

// 3rd latest updated code
import React, { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** flagcdn.com — lowercase ISO 3166-1 alpha-2 */
const FLAG_CDN = "https://flagcdn.com";

// Sample data - replace with your actual WRC_WINNERS_RANKING
const HALL_OF_FAME_WINNERS = [
  {
    id: 1,
    name: "ATOM",
    country: "Russia",
    countryCode: "ru",
    rank: "#7 · Elite Strategist",
    medal: "Silver Excellence · Precision Award",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Master of robotics algorithms, 3x national champion.",
    achievements: "World Finals Top 8, Most Innovative Design",
    isWinner: false,
  },
  {
    id: 2,
    name: "Team Xenon",
    country: "India",
    countryCode: "in",
    rank: "#8 · Rising Phenom",
    medal: "Rising Star · Best Newcomer",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Youngest team to reach semifinals, known for aggressive tactics.",
    achievements: "Golden Bot Award 2025",
    isWinner: false,
  },
  {
    id: 3,
    name: "Sama Al-Iraq School",
    country: "Iraq",
    countryCode: "iq",
    rank: "🥇 WORLD CHAMPION",
    medal: "Grand Gold · Undisputed Winner",
    image: "https://flagcdn.com/w320/iq.png",
    bio: "Perfect season, historic victory with zero defeats.",
    achievements: "World Cup Trophy, Best Engineering Excellence",
    isWinner: true,
  },
  {
    id: 4,
    name: "Harimohan Science Club",
    country: "Bangladesh",
    countryCode: "bd",
    rank: "#10 · Strategic Masters",
    medal: "Bronze Achievement · Innovation Prize",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Revolutionary AI integration, crowd favorite.",
    achievements: "Best Rookie Team 2025",
    isWinner: false,
  },
  {
    id: 5,
    name: "ROBO ODISHA",
    country: "India",
    countryCode: "in",
    rank: "#1 LEGEND",
    medal: "Hall of Fame Inductee",
    image: "https://randomuser.me/api/portraits/men/89.jpg",
    bio: "Five-time world finalist, pioneer of modular robotics.",
    achievements: "Legacy Award, 10+ international medals",
    isWinner: false,
  },
  {
    id: 6,
    name: "Cyber Knights",
    country: "Germany",
    countryCode: "de",
    rank: "#5 · Tech Giants",
    medal: "Golden Tactics Award",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    bio: "Known for unmatched defensive strategies.",
    achievements: "Most Valuable Team 2024",
    isWinner: false,
  },
  {
    id: 7,
    name: "Nova Titans",
    country: "Japan",
    countryCode: "jp",
    rank: "#3 · Speed Demons",
    medal: "Innovation & Speed",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Record for fastest solve, precision masters.",
    achievements: "Fastest Robot Design Award",
    isWinner: false,
  },
];

function WinnerHeroFlag({ countryCode, label, className = "" }) {
  const code = (countryCode || "").toLowerCase().trim();
  const [failed, setFailed] = useState(false);

  if (!code || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800 text-slate-500 text-sm font-medium ${className}`}
        title={label}
      >
        —
      </div>
    );
  }

  return (
    <img
      src={`${FLAG_CDN}/w640/${code}.png`}
      alt=""
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function ChampionCard({ champion, type, onClick }) {
  const isCenter = type === "center";
  const isWinner = champion.isWinner;

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${
        isCenter
          ? "z-20 scale-110 shadow-[0_0_35px_rgba(251,191,36,0.4)]"
          : "scale-85 opacity-75 hover:scale-90 hover:opacity-100"
      }`}
      onClick={onClick}
    >
      <div
        className={`
          backdrop-blur-xl rounded-[2.2rem] text-center relative
          ${
            isCenter
              ? "bg-gradient-to-br from-[#102a3e] to-[#07131f] border-2 border-yellow-400 p-7"
              : "bg-[#081624]/85 border border-yellow-500/35 p-5"
          }
        `}
      >
        {/* Crown for winner */}
        {(isWinner || champion.rank === 1) && (
          <div
            className={`absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg z-10
            ${isCenter ? "w-12 h-12 text-2xl" : "w-9 h-9 text-lg"}
          `}
          >
            👑
          </div>
        )}

        {/* Rank Badge */}
        <div className="inline-block bg-[#1f2f3c] rounded-full font-orbitron font-extrabold text-xs px-3 py-1 mb-4 text-yellow-400">
          {champion.rank}
        </div>

        {/* Avatar Area */}
        <div
          className={`mx-auto mb-4 relative ${isCenter ? "w-[110px] h-[110px]" : "w-[85px] h-[85px]"}`}
        >
          <img
            src={champion.image}
            alt={champion.name}
            className={`w-full h-full object-cover rounded-full border-3 ${isCenter ? "border-yellow-400" : "border-yellow-500"} bg-[#0e1e2a]`}
            onError={(e) => {
              e.target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#0a121c] rounded-full border-2 border-yellow-400 overflow-hidden">
            <WinnerHeroFlag
              countryCode={champion.countryCode}
              label={champion.country}
            />
          </div>
        </div>

        {/* Name */}
        <h3
          className={`font-orbitron font-extrabold bg-gradient-to-r ${isCenter ? "from-[#FFF2B2] to-[#FFD966] text-xl" : "from-white to-gray-300 text-base"} bg-clip-text text-transparent mt-1`}
        >
          {champion.name}
        </h3>

        {/* Country */}
        <p className="text-sm text-[#a0bbd4] flex justify-center items-center gap-1.5 mt-1">
          <i className="fas fa-map-marker-alt text-xs"></i> {champion.country}
        </p>

        {/* Tournament Label */}
        <p className="text-xs text-[#7c9bc2] mt-2">
          World Robotics Championship • Season 2026
        </p>

        {/* Medal */}
        <div className="flex justify-center gap-2 mt-3 text-xs text-yellow-400">
          <i
            className={`fas ${champion.isWinner ? "fa-trophy" : "fa-award"}`}
          ></i>{" "}
          {champion.medal}
        </div>

        {/* Center Click Hint */}
        {isCenter && (
          <div className="mt-3 text-[0.65rem] text-yellow-400">
            <i className="fas fa-hand-pointer"></i> Click for full profile
          </div>
        )}
      </div>
    </div>
  );
}

function SpotlightPanel({ champion, onClose }) {
  if (!champion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="mt-12 bg-[#000f19]/70 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-8"
    >
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-transparent border border-yellow-400 text-yellow-400 px-5 py-1.5 rounded-full cursor-pointer transition-all hover:bg-yellow-400 hover:text-black"
        >
          <i className="fas fa-times"></i> Close
        </button>
      </div>

      <div className="flex flex-wrap gap-8 items-center justify-center">
        {/* Avatar */}
        <div className="flex-0 min-w-[180px] text-center">
          <img
            src={champion.image}
            alt={champion.name}
            className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover mx-auto"
            onError={(e) => {
              e.target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
            }}
          />
          <div className="mt-3">
            <span className="inline-block bg-yellow-400 rounded-full font-orbitron font-extrabold text-xs px-3 py-1 text-black">
              {champion.rank}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-[240px]">
          <div className="font-orbitron text-3xl bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent font-black">
            {champion.name}
          </div>

          <div className="flex flex-wrap gap-4 my-4">
            <div className="bg-[#0e1e2c] px-3 py-1.5 rounded-full text-sm border-l-2 border-yellow-400">
              <i className="fas fa-flag-checkered"></i> {champion.country}
            </div>
            <div className="bg-[#0e1e2c] px-3 py-1.5 rounded-full text-sm border-l-2 border-yellow-400">
              <i className="fas fa-medal"></i> {champion.medal}
            </div>
            <div className="bg-[#0e1e2c] px-3 py-1.5 rounded-full text-sm border-l-2 border-yellow-400">
              <i className="fas fa-trophy"></i> Global Rank
            </div>
          </div>

          <p className="my-4 leading-relaxed text-[#ccdeee]">
            <strong>Biography:</strong> {champion.bio}
          </p>

          <p className="text-yellow-400">
            <i className="fas fa-star"></i> Achievements:{" "}
            {champion.achievements}
          </p>

          <div className="mt-5 flex gap-3 flex-wrap">
            <span className="bg-[#10202c] px-3 py-1.5 rounded-full text-sm">
              <i className="fas fa-chart-line"></i> Win Rate: 89%
            </span>
            <span className="bg-[#10202c] px-3 py-1.5 rounded-full text-sm">
              <i className="fas fa-calendar-alt"></i> Champion Since 2025
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WinnersSection() {
  const [currentCenterIndex, setCurrentCenterIndex] = useState(2);
  const [selectedChampion, setSelectedChampion] = useState(null);
  const total = HALL_OF_FAME_WINNERS.length;

  const getVisibleChampions = () => {
    const leftIdx = (currentCenterIndex - 1 + total) % total;
    const rightIdx = (currentCenterIndex + 1) % total;
    return { left: leftIdx, center: currentCenterIndex, right: rightIdx };
  };

  const nextChampion = () => {
    setCurrentCenterIndex((prev) => (prev + 1) % total);
    setSelectedChampion(null);
  };

  const prevChampion = () => {
    setCurrentCenterIndex((prev) => (prev - 1 + total) % total);
    setSelectedChampion(null);
  };

  const openSpotlight = (champion) => {
    setSelectedChampion(champion);
  };

  const closeSpotlight = () => {
    setSelectedChampion(null);
  };

  const { left, center, right } = getVisibleChampions();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevChampion();
      if (e.key === "ArrowRight") nextChampion();
      if (e.key === "Escape" && selectedChampion) closeSpotlight();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedChampion]);

  return (
    <section className="relative py-20 px-4 md:py-28 overflow-hidden bg-[#01070c]">
      {/* Glow Orbs */}
      <div className="absolute rounded-full blur-[110px] opacity-35 pointer-events-none bg-cyan-500 w-[400px] h-[400px] -top-[120px] -left-[80px]" />
      <div className="absolute rounded-full blur-[110px] opacity-35 pointer-events-none bg-amber-500 w-[450px] h-[450px] -bottom-[100px] -right-[70px]" />
      <div className="absolute rounded-full blur-[110px] opacity-35 pointer-events-none bg-purple-500 w-[300px] h-[300px] top-1/2 left-1/5" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)`,
          backgroundSize: "55px 55px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-orange-500/10 p-4 rounded-full border border-yellow-500/50 backdrop-blur-sm mb-5">
            <i className="fas fa-trophy text-5xl bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent"></i>
          </div>
          <h1 className="font-orbitron text-5xl md:text-6xl font-black uppercase bg-gradient-to-br from-[#FFF5C4] via-[#FFD966] to-[#D4AF37] bg-clip-text text-transparent tracking-wide">
            Hall of Fame
          </h1>
          <p className="text-[#ffdc96]/80 text-lg mt-2 tracking-wide">
            Click any champion — center stage spotlight & legendary details
          </p>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-5" />
        </div>

        {/* Carousel Arena */}
        <div className="relative flex items-center justify-center my-12 min-h-[560px]">
          {/* Previous Button */}
          <button
            onClick={prevChampion}
            className="bg-gradient-to-br from-yellow-400 to-amber-500 
  border-2 border-yellow-200 
  w-12 h-12 rounded-full flex items-center justify-center 
  cursor-pointer transition-all duration-300 
  text-black text-2xl font-black mx-2 z-30
  shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(251,191,36,0.8)]"
          >
            ←
          </button>

          {/* Carousel Stage */}
          <div className="flex items-center justify-center gap-6 transition-all duration-500">
            <ChampionCard
              champion={HALL_OF_FAME_WINNERS[left]}
              type="side"
              onClick={() => setCurrentCenterIndex(left)}
            />
            <ChampionCard
              champion={HALL_OF_FAME_WINNERS[center]}
              type="center"
              onClick={() => openSpotlight(HALL_OF_FAME_WINNERS[center])}
            />
            <ChampionCard
              champion={HALL_OF_FAME_WINNERS[right]}
              type="side"
              onClick={() => setCurrentCenterIndex(right)}
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextChampion}
            className="bg-gradient-to-br from-yellow-400 to-amber-500 
  border-2 border-yellow-200 
  w-12 h-12 rounded-full flex items-center justify-center 
  cursor-pointer transition-all duration-300 
  text-black text-2xl font-black mx-2 z-30
  shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(251,191,36,0.8)]"
          >
            →
          </button>
        </div>

        {/* Hint */}
        <div className="flex justify-center gap-5 mt-4">
          <span className="text-[#aac8ff] text-sm">
            <i className="fas fa-hand-pointer"></i> Tap card to view full
            profile
          </span>
        </div>

        {/* Spotlight Panel */}
        <AnimatePresence>
          {selectedChampion && (
            <SpotlightPanel
              champion={selectedChampion}
              onClose={closeSpotlight}
            />
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-3 rounded-full font-bold text-black font-orbitron inline-block hover:scale-105 transition-transform"
          >
            <i className="fas fa-crown"></i> EXPLORE FULL LEGENDS ARCHIVE
          </a>
        </div>
      </div>
    </section>
  );
}

export default WinnersSection;
