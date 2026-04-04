import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, LayoutGroup, useReducedMotion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { WRC_WINNERS_RANKING } from "../../constants/roboclubLandingData";
import { WRC_CLUB_LOGO_BY_WINNER_ID } from "../../constants/wrcClubLogos";

/** flagcdn.com — lowercase ISO 3166-1 alpha-2 */
const FLAG_CDN = "https://flagcdn.com";

function mod(n, m) {
  return ((n % m) + m) % m;
}

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

/** Club mark when bundled; otherwise country flag hero. */
function WinnerHeroVisual({ clubLogoSrc, countryCode, label, className = "" }) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (clubLogoSrc && !logoFailed) {
    return (
      <img
        src={clubLogoSrc}
        alt=""
        className={`w-full h-full object-contain object-center bg-slate-900/95  ${className}`}
        loading="lazy"
        decoding="async"
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return <WinnerHeroFlag countryCode={countryCode} label={label} className={className} />;
}

function WinnerCard({ winner, slot }) {
  const rankLabel = winner.rank === 1 ? "Grand Champion" : `Rank ${winner.rank}`;
  const clubLogoSrc = WRC_CLUB_LOGO_BY_WINNER_ID[winner.id];

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
            <WinnerHeroVisual
              clubLogoSrc={clubLogoSrc}
              countryCode={winner.countryCode}
              label={winner.country}
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-yellow-400 font-bold text-sm tracking-wider uppercase">{rankLabel}</p>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">{winner.name}</h3>
            <p className="text-slate-400 mt-1">{winner.country}</p>
            <p className="text-slate-500 text-sm mt-1">World Robotics Championship</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 text-yellow-400 font-bold">
              <Star size={16} fill="currentColor" /> #{winner.rank}
            </div>
          </div>
        </div>
      </>
    );
  }

  const isInner = slot === 1 || slot === 3;
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

  const badgeClass =
    winner.rank <= 3 ? "bg-gradient-to-br from-amber-500 to-orange-700 text-white" : "bg-slate-400 text-slate-900";

  return (
    <>
      <div className={overlayClass} />
      <div className={`relative bg-slate-900 border border-slate-700 ${paddingClass} rounded-2xl`}>
        <div className={`${imageHeightClass} mb-5 overflow-hidden rounded-xl relative`}>
          <WinnerHeroVisual
            clubLogoSrc={clubLogoSrc}
            countryCode={winner.countryCode}
            label={winner.country}
            className="grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
          />
          <div
            className={`absolute top-4 left-4 min-w-[2rem] h-8 px-2 ${badgeClass} font-bold rounded-full flex items-center justify-center tabular-nums`}
          >
            {winner.rank}
          </div>
        </div>
        <h3 className={`${nameClass} font-bold text-white`}>{winner.name}</h3>
        <p className="text-slate-400">{winner.country}</p>
        <p className="text-slate-500 text-xs mt-1">World Robotics Championship</p>
        <div
          className={`mt-4 pt-4 border-t border-slate-800 flex justify-between items-center ${metaTextClass} text-slate-500`}
        >
          <span className="inline-flex items-center gap-2">
            {clubLogoSrc ? (
              <img
                src={clubLogoSrc}
                alt=""
                className="w-7 h-7 rounded-md object-contain bg-slate-800 border border-slate-600/50"
                loading="lazy"
              />
            ) : (
              <img
                src={`${FLAG_CDN}/w40/${(winner.countryCode || "").toLowerCase()}.png`}
                alt=""
                className="w-6 h-4 rounded object-cover border border-slate-600/50"
                loading="lazy"
              />
            )}
            {winner.country}
          </span>
          <span className="text-slate-300">#{winner.rank}</span>
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

  const podiumSource = WRC_WINNERS_RANKING;
  const total = podiumSource.length;

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
    return visibleIndices.map((idx) => podiumSource[idx]);
  }, [visibleIndices, podiumSource]);

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
