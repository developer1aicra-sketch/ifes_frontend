import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
import { Trophy, Star } from "lucide-react";

/** Placeholder Hall of Fame entries — swap for API data when ready */
const WINNERS_PLACEHOLDER = [
  {
    id: "w1",
    name: "Team Iron Giants",
    country: "India",
    category: "Robo Soccer",
    image:
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=300&h=300",
    points: "12,500",
    season: "WRC 2025",
  },
  {
    id: "w2",
    name: "Cyber Strikers",
    country: "Iran",
    category: "Bot Combat",
    image:
      "https://images.unsplash.com/photo-1535378437323-95288ac9dd5c?auto=format&fit=crop&q=80&w=300&h=300",
    points: "8,900",
    season: "WRC 2025",
  },
  {
    id: "w3",
    name: "Mech Warriors",
    country: "USA",
    category: "Drone Race",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=300&h=300",
    points: "7,200",
    season: "WRC 2025",
  },
  {
    id: "w4",
    name: "Neon Titans",
    country: "Germany",
    category: "Autonomous Arena",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91f4f3f6a4?auto=format&fit=crop&q=80&w=300&h=300",
    points: "10,250",
    season: "WRC 2024",
  },
  {
    id: "w5",
    name: "Quantum Chevrons",
    country: "Japan",
    category: "Line Follower",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=300&h=300",
    points: "9,600",
    season: "WRC 2024",
  },
  {
    id: "w6",
    name: "Atlas Circuit",
    country: "Brazil",
    category: "Maze Runner",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300&h=300",
    points: "6,850",
    season: "WRC 2023",
  },
  {
    id: "w7",
    name: "Helix Hunters",
    country: "UK",
    category: "Obstacle Course",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0957?auto=format&fit=crop&q=80&w=300&h=300",
    points: "7,990",
    season: "WRC 2023",
  },
  {
    id: "w8",
    name: "Solar Sabers",
    country: "Canada",
    category: "Sumo Robotics",
    image:
      "https://images.unsplash.com/photo-1581093458791-9d5b1f1b6c45?auto=format&fit=crop&q=80&w=300&h=300",
    points: "8,430",
    season: "WRC 2022",
  },
  {
    id: "w9",
    name: "Aero Falcons",
    country: "France",
    category: "Drone Soccer",
    image:
      "https://images.unsplash.com/photo-1520975698519-6bfbd2f9d0f3?auto=format&fit=crop&q=80&w=300&h=300",
    points: "11,050",
    season: "WRC 2022",
  },
  {
    id: "w10",
    name: "Vortex Vanguards",
    country: "Spain",
    category: "Tech Challenge",
    image:
      "https://images.unsplash.com/photo-1544383835-bb079d2dc8e1?auto=format&fit=crop&q=80&w=300&h=300",
    points: "5,750",
    season: "WRC 2021",
  },
];

function mod(n, m) {
  return ((n % m) + m) % m;
}

function WinnerCard({ winner, slot }) {
  if (slot === 2) {
    return (
      <>
        <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 ease-out" />
        <div className="relative bg-slate-900 border border-yellow-500/30 p-6 rounded-2xl shadow-2xl">
          <div className="flex justify-center -mt-14 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl">
              <Trophy className="w-9 h-9 text-white fill-current" />
            </div>
          </div>
          <div className="h-44 mb-6 overflow-hidden rounded-xl relative">
            <img
              src={winner.image}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              alt={winner.name}
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase">
                Grand Champion
              </p>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">{winner.name}</h3>
            <p className="text-slate-400 mt-1">{winner.category}</p>
            <p className="text-slate-500 text-sm mt-1">{winner.season}</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-400 font-bold">
              <Star size={16} fill="currentColor" /> {winner.points} pts
            </div>
          </div>
        </div>
      </>
    );
  }

  const isInner = slot === 1 || slot === 3;
  const badgeNumber = slot === 1 ? 2 : slot === 3 ? 3 : slot === 0 ? 4 : 5;
  const badgeClass = slot < 2 ? "bg-slate-400 text-slate-900" : "bg-orange-700 text-white";
  const paddingClass = isInner ? "p-6" : "p-5";
  const imageHeightClass = isInner ? "h-44" : "h-36";
  const nameClass = isInner ? "text-2xl" : "text-xl";
  const metaTextClass = isInner ? "text-sm" : "text-xs";

  const overlayClass =
    slot === 0
      ? "absolute inset-0 bg-slate-800 transform rotate-2 rounded-2xl opacity-50 group-hover:rotate-3 transition-transform duration-500 ease-out"
      : slot === 1
        ? "absolute inset-0 bg-slate-800 transform rotate-1 rounded-2xl opacity-50 group-hover:rotate-2 transition-transform duration-500 ease-out"
        : slot === 3
          ? "absolute inset-0 bg-slate-800 transform -rotate-1 rounded-2xl opacity-50 group-hover:-rotate-2 transition-transform duration-500 ease-out"
          : "absolute inset-0 bg-slate-800 transform -rotate-2 rounded-2xl opacity-50 group-hover:-rotate-3 transition-transform duration-500 ease-out";

  return (
    <>
      <div className={overlayClass} />
      <div className={`relative bg-slate-900 border border-slate-700 ${paddingClass} rounded-2xl`}>
        <div className={`${imageHeightClass} mb-5 overflow-hidden rounded-xl relative`}>
          <img
            src={winner.image}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
            alt={winner.name}
          />
          <div className={`absolute top-4 left-4 w-8 h-8 ${badgeClass} font-bold rounded-full flex items-center justify-center`}>
            {badgeNumber}
          </div>
        </div>
        <h3 className={`${nameClass} font-bold text-white`}>{winner.name}</h3>
        <p className="text-slate-400">{winner.category}</p>
        <p className="text-slate-500 text-xs mt-1">{winner.season}</p>
        <div
          className={`mt-4 pt-4 border-t border-slate-800 flex justify-between items-center ${metaTextClass} text-slate-500`}
        >
          <span>{winner.country}</span>
          <span className="text-slate-300">
            {winner.points} pts
          </span>
        </div>
      </div>
    </>
  );
}

function WinnersSection() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isHoveringPodium, setIsHoveringPodium] = useState(false);
  const reduceMotion = useReducedMotion();

  const layoutTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 190, damping: 26, mass: 0.9 };

  const emphasisTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 230, damping: 24 };

  const total = WINNERS_PLACEHOLDER.length;

  const visibleIndices = useMemo(() => {
    return [
      mod(featuredIndex - 2, total),
      mod(featuredIndex - 1, total),
      mod(featuredIndex, total),
      mod(featuredIndex + 1, total),
      mod(featuredIndex + 2, total),
    ];
  }, [featuredIndex, total]);

  const visibleWinners = useMemo(() => {
    return visibleIndices.map((idx) => WINNERS_PLACEHOLDER[idx]);
  }, [visibleIndices]);

  // Auto-advance the "featured" card so motion is always visible.
  useEffect(() => {
    if (reduceMotion) return;
    if (total <= 5) return;

    const intervalMs = 4200;
    const id = window.setInterval(() => {
      if (isHoveringPodium) return;
      setFeaturedIndex((prev) => prev + 1);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [reduceMotion, total, isHoveringPodium]);

  const handleWinnerEnter = useCallback((absoluteIndex) => {
    setFeaturedIndex(absoluteIndex);
  }, []);

  const slotEmphasis = useCallback((slot) => {
    // slot: 0..4 where 2 is featured center.
    const distance = Math.abs(slot - 2);
    if (distance === 0) return { scale: 1.02, opacity: 1 };
    if (distance === 1) return { scale: 0.98, opacity: 0.95 };
    return { scale: 0.94, opacity: 0.86 };
  }, []);

  return (
    <section id="winners" className="py-32 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto px-6 relative z-10">
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
          <p className="text-yellow-100/60 mt-4 text-xl">
            Celebrating the legends of the World Robotics Championship
          </p>
        </div>

        <LayoutGroup>
          <div
            className="grid lg:grid-cols-5 gap-8 items-end"
            onMouseEnter={() => setIsHoveringPodium(true)}
            onMouseLeave={() => setIsHoveringPodium(false)}
          >
            {visibleWinners.map((winner, slot) => (
              <motion.div
                key={winner.id}
                className={slot === 2 ? "relative group -mt-10 z-20" : "relative group"}
                animate={slotEmphasis(slot)}
                transition={emphasisTransition}
                style={{
                  zIndex: slot === 2 ? 30 : slot === 1 || slot === 3 ? 20 : 10,
                }}
              >
                <motion.div
                  layoutId={`winner-podium-${winner.id}`}
                  layout
                  transition={{ layout: layoutTransition }}
                  className="cursor-pointer"
                  onMouseEnter={() => handleWinnerEnter(visibleIndices[slot])}
                >
                  <WinnerCard winner={winner} slot={slot} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

export default WinnersSection;
