import React, { useMemo, useState } from 'react';
import { Zap, Gift, Wrench, Lock, Copy, Check } from 'lucide-react';

const ROBOTICS_KITS = [
  {
    id: 'starter',
    title: 'Starter Robotics Kit',
    level: 'Beginner • Grades 6–8',
    description: 'Everything you need to assemble your first autonomous robot and learn core electronics.',
    couponCode: 'TX-STARTER-10',
    discountLabel: 'Flat 10% OFF',
    maxDiscount: 10,
  },
  {
    id: 'advance',
    title: 'Advanced Robotics Kit',
    level: 'Intermediate • Grades 8–10',
    description: 'High-torque motors, sensor pack, and controller board for competition-ready builds.',
    couponCode: 'TX-ROBO-15',
    discountLabel: 'Up to 15% OFF',
    maxDiscount: 15,
  },
  {
    id: 'ai',
    title: 'AI Vision Robotics Kit',
    level: 'Pro • Grades 10+',
    description: 'Camera + edge AI module to experiment with computer vision and autonomous navigation.',
    couponCode: 'TX-AI-20',
    discountLabel: 'Premium Member Offer',
    maxDiscount: 25,
  },
];

/** Red ribbon offer tag: "UP TO" stacked small + "X% OFF" bold, with curled/folded 3D effect */
function OfferRibbon({ maxDiscount }) {
  return (
    <div
      className="absolute top-0 right-0 z-10 flex items-center gap-1 pr-2 pl-3 py-1.5 rounded-bl-lg rounded-tr-2xl overflow-visible"
      style={{
        background: 'linear-gradient(180deg, #e04550 0%, #dc3545 45%, #c92a38 100%)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.2), 2px 2px 6px rgba(0,0,0,0.35), 0 4px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Left fold (shadow under fold) */}
      <div
        className="absolute left-0 bottom-0 w-2 h-full rounded-r-sm opacity-90"
        style={{
          background: 'linear-gradient(90deg, #8b1a28 0%, transparent 100%)',
          transform: 'skewY(6deg) translateX(-2px)',
        }}
        aria-hidden
      />
      <div className="flex flex-col items-center justify-center leading-tight" style={{ fontSize: '9px' }}>
        <span className="font-medium text-white uppercase tracking-wider">Up</span>
        <span className="font-medium text-white uppercase tracking-wider">To</span>
      </div>
      <span
        className="font-bold text-white uppercase tracking-wide whitespace-nowrap"
        style={{ fontSize: '14px', lineHeight: 1.1, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
      >
        {maxDiscount}% OFF
      </span>
      {/* Curled right edge (fold) */}
      <div
        className="absolute -right-1 top-0 w-4 h-full rounded-l-md"
        style={{
          background: 'linear-gradient(135deg, #a02030 0%, #8b1a28 100%)',
          transform: 'skewY(-8deg) translateX(2px)',
          boxShadow: '2px 0 4px rgba(0,0,0,0.25)',
        }}
        aria-hidden
      />
    </div>
  );
}

function RoboticsKitCard({ kit }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText(kit.couponCode).then(() => {
      setCopiedId(kit.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="relative overflow-visible rounded-2xl border border-slate-700/80 flex flex-col justify-between min-h-[200px]">
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-900/80">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_0_0,rgba(251,191,36,0.2),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(96,165,250,0.18),transparent_55%)]" />
      </div>
      <OfferRibbon maxDiscount={kit.maxDiscount} />
      <div className="relative p-4 space-y-2 pr-20">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80">{kit.level}</p>
        <h3 className="text-sm font-semibold text-slate-50">{kit.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{kit.description}</p>
      </div>

      <div className="relative px-4 pb-4 mt-0 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Coupon code available
        </p>
        <div className="inline-flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-amber-400/50">
            <span className="font-mono text-xs text-amber-200 tracking-[0.22em]">
              {kit.couponCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-0.5 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-700/50 transition-colors"
              title="Copy coupon code"
              aria-label={`Copy ${kit.couponCode}`}
            >
              {copiedId === kit.id ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
          <span className="text-[10px] text-amber-300/90 uppercase tracking-[0.18em]">
            {kit.discountLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_ACCENT = {
  badge: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
  title: 'text-amber-300',
};

export function DiyOffers({ activeSection = 'kits', membershipPlanName, themeAccent }) {
  const accent = themeAccent || DEFAULT_ACCENT;
  const sectionFlags = useMemo(
    () => ({
      kits: activeSection === 'kits',
      tools: activeSection === 'tools',
      workshops: activeSection === 'workshops',
    }),
    [activeSection]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${accent.badge}`}>
          <Zap size={20} />
        </div>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${accent.title}`}>DIY Offers</h1>
          <p className="text-sm text-slate-400">
            Exclusive Technoxian DIY benefits: discounted robotics kits, upcoming advanced tools, and
            premium-only workshops.
          </p>
        </div>
      </div>

      {/* Robotics Kits with coupon cards (only when Robotics Kits is selected) */}
      {sectionFlags.kits && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.18em]">
                Robotics Kits
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Apply your member coupon at checkout on partner stores to unlock these offers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROBOTICS_KITS.map((kit) => (
              <RoboticsKitCard key={kit.id} kit={kit} />
            ))}
          </div>
        </section>
      )}

      {/* Advanced tools - coming soon (only when Access Advanced Tools is selected) */}
      {sectionFlags.tools && (
        <section>
          <div
            className="rounded-2xl border border-sky-400/70 bg-slate-900/90 p-5 flex items-start gap-3 transition-colors duration-200"
          >
            <div className="mt-0.5">
              <Wrench className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-300 uppercase tracking-[0.18em]">
                Access Advanced Tools
              </p>
              <p className="mt-1 text-sm text-slate-100">
                Cloud simulators, code templates, and AI-assisted build helpers.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                These advanced tools will be available soon for all active student and club members.
              </p>
              <span className="inline-flex mt-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] bg-slate-800 border border-slate-600 text-slate-300">
                Coming Soon
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Workshops - premium only (only when Premium Workshops is selected) */}
      {sectionFlags.workshops && (
        <section>
          {membershipPlanName === 'Student Premium' ? (
            <div
              className="rounded-2xl border border-emerald-400/80 bg-emerald-500/20 p-5 flex items-start gap-3 transition-colors duration-200"
            >
              <div className="mt-0.5">
                <Gift className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300 uppercase tracking-[0.18em]">
                  Premium Workshops
                </p>
                <p className="mt-1 text-sm text-slate-50">
                  Hands-on robotics and AI workshops curated for serious young innovators.
                </p>
                <p className="mt-1 text-xs text-emerald-100/80">
                  You have full access as a Student Premium member. Upcoming cohorts will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-400/50 bg-slate-900/90 p-5 flex items-start gap-3">
              <div className="mt-0.5">
                <Lock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.18em]">
                  Premium Workshops (Locked)
                </p>
                <p className="mt-1 text-sm text-slate-100">
                  Mentor-led workshops, lab time, and advanced project reviews are reserved for Student
                  Premium members.
                </p>
                <p className="mt-1 text-xs text-emerald-100/80">
                  Upgrade from <span className="font-semibold">Student Basic</span> to{' '}
                  <span className="font-semibold">Student Premium</span> to unlock this section.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default DiyOffers;
