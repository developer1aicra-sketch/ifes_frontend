import { RoboClubRemoteImage } from './RoboClubRemoteImage';

/**
 * Image grid under FamousPlaceDetail — one block per `{ heading, items }` in `famousPlace.galleries`,
 * or a single legacy `famousPlace.gallery` (normalized in RoboClubEventsSection).
 */
export function FamousPlaceGallery({ items, heading = 'Image highlights' }) {
  if (!items?.length) return null;

  return (
    <div className="px-4 pb-3 pt-2 bg-slate-950/60 border-b border-slate-800/90">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">{heading}</p>
      <div
        className={`grid gap-2 ${
          items.length === 1
            ? 'grid-cols-1'
            : items.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
        {items.map((item, i) => (
          <div
            key={item.src ?? item.alt ?? i}
            className="relative aspect-[4/3] rounded-lg overflow-hidden ring-1 ring-white/10 shadow-md shadow-black/20"
          >
            <RoboClubRemoteImage
              src={item.src}
              alt={item.alt || 'Destination image'}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamousPlaceGallery;
