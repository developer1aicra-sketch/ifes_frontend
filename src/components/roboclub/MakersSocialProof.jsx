import React from 'react';

const DEFAULT_AVATAR_IMG_IDS = [11, 12, 13, 14];

/**
 * Avatar stack + headline for community scale (hero or other landing sections).
 */
const MakersSocialProof = ({
  className = '',
  headline = '12,000+ Gamers',
  subheadline = 'Joined this season',
  avatarImgIds = DEFAULT_AVATAR_IMG_IDS,
}) => {
  return (
    <div
      className={`flex items-center gap-4  py-4 sm:gap-6 sm:py-6 lg:py-8 ${className}`.trim()}
    >
      <div className="flex -space-x-4">
        {avatarImgIds.map((imgId, index) => (
          <div
            key={`${imgId}-${index}`}
            className="z-0 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-slate-950 bg-slate-800 text-xs font-bold text-white ring-2 ring-white/10 transition-all hover:z-10 hover:scale-110 hover:ring-cyan-400"
          >
            <img
              src={`https://i.pravatar.cc/100?img=${imgId}`}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="text-sm drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <p className="font-bold text-white">{headline}</p>
        <p className="text-slate-400">{subheadline}</p>
      </div>
    </div>
  );
};

/** Full-width band below the hero; keeps content aligned with `max-w-7xl` + `px-6`. */
export function MakersSocialProofSection(props) {
  return (
    <section
      aria-label="Community engagement"
      className="relative z-10  bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-6">
        <MakersSocialProof {...props} />
      </div>
    </section>
  );
}

export default MakersSocialProof;
