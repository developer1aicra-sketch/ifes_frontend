import { RoboClubRemoteImage } from './RoboClubRemoteImage';

/**
 * Named “destination” strip for event cards — image + label, decoupled from hero URL
 * so copy and assets stay in CMS-shaped data (`famousPlace` on each event).
 * `theme` overrides the kicker (e.g. “Temples & Heritage”, “Beaches & Islands”).
 */
export function FamousPlaceDetail({ name, region, image, imageAlt, theme }) {
  const alt =
    imageAlt ||
    [name, region].filter(Boolean).join(' — ') ||
    'Destination highlight';

  const kicker = theme || 'Famous place';

  return (
    <div className="flex gap-3 items-stretch px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80 border-b border-slate-800/90">
      <RoboClubRemoteImage
        src={image}
        alt={alt}
        className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 ring-1 ring-white/10 shadow-lg shadow-black/30"
      />
      <div className="min-w-0 flex flex-col justify-center gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400/90">
          {kicker}
        </span>
        <span className="text-sm sm:text-base font-bold text-white leading-snug">{name}</span>
        {region ? <span className="text-xs text-slate-400">{region}</span> : null}
      </div>
    </div>
  );
}

export default FamousPlaceDetail;
