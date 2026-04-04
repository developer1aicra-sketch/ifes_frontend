import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { ROBOCLUB_EVENTS } from '../../constants/roboclubLandingData';
import { FamousPlaceDetail } from './FamousPlaceDetail';
import { FamousPlaceGallery } from './FamousPlaceGallery';
import { RoboClubRemoteImage } from './RoboClubRemoteImage';

/** Bottom gradient caption on the card hero: `famousPlace` wins; else `heroBanner`. */
function EventHeroCaption({ ev }) {
  const fp = ev.famousPlace;
  if (fp?.name) {
    const heroKicker = fp.theme || 'Famous place';
    return (
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-3 pt-12 bg-gradient-to-t from-slate-950 via-slate-950/88 to-transparent border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90 mb-1">
          {heroKicker}
        </p>
        <p className="text-base font-black text-white leading-snug drop-shadow-sm">{fp.name}</p>
        {fp.region ? (
          <p className="text-xs text-slate-300 mt-1 font-medium">{fp.region}</p>
        ) : null}
      </div>
    );
  }
  const hb = ev.heroBanner;
  if (hb?.title) {
    return (
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-3 pt-12 bg-gradient-to-t from-slate-950 via-slate-950/88 to-transparent border-t border-white/5">
        {hb.kicker ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/90 mb-1">
            {hb.kicker}
          </p>
        ) : null}
        <p className="text-base font-black text-white leading-snug drop-shadow-sm">{hb.title}</p>
        {hb.subtitle ? (
          <p className="text-xs text-slate-300 mt-1 font-medium">{hb.subtitle}</p>
        ) : null}
      </div>
    );
  }
  return null;
}

const PER_PAGE = 2;

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'past', label: 'Past' },
];

const statusStyles = {
  upcoming: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  ongoing: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  past: 'bg-slate-700/50 text-slate-400 border-slate-600',
};

const partnerBadgeClass =
  'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/35';

const RoboClubEventsSection = () => {
  const [filter, setFilter] = useState('upcoming');
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => ROBOCLUB_EVENTS.filter((e) => e.status === filter),
    [filter]
  );

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PER_PAGE)),
    [filtered.length]
  );

  useEffect(() => {
    setPage(0);
  }, [filter]);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const next = useCallback(() => setPage((p) => (p + 1) % pageCount), [pageCount]);
  const prev = useCallback(() => setPage((p) => (p - 1 + pageCount) % pageCount), [pageCount]);

  useEffect(() => {
    if (pageCount <= 1) return undefined;
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next, pageCount]);

  const visible = useMemo(() => {
    const start = page * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  return (
    <section id="competitions-events" className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div>
            <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Arena calendar</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-3">Competitions &amp; events</h2>
            <p className="text-slate-400 max-w-xl">
            Participate in exciting robotics competitions and events, showcase innovations, compete globally, and gain recognition through TechnoXian platforms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  filter === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-slate-500 text-center py-16 border border-dashed border-slate-800 rounded-2xl">
            No events in this filter yet.
          </div>
        ) : (
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-5 md:p-8 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-5">
              <button
                type="button"
                onClick={prev}
                className="p-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
                aria-label="Previous slide"
                disabled={pageCount <= 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-wrap justify-center gap-2 max-w-[60%] sm:max-w-none">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === page ? 'bg-cyan-400 w-8' : 'bg-slate-700 w-2.5 hover:bg-slate-600'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="p-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
                aria-label="Next slide"
                disabled={pageCount <= 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${page}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {visible.map((ev) => (
                  <div
                    key={ev.id}
                    className={visible.length === 1 ? 'md:col-span-2 flex justify-center' : 'min-w-0'}
                  >
                    <div className={visible.length === 1 ? 'w-full max-w-2xl' : 'w-full'}>
                      <div className="group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 hover:border-cyan-500/35 transition-colors h-full flex flex-col">
                        <div className="relative h-52 overflow-hidden shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
                          <RoboClubRemoteImage
                            src={ev.image}
                            alt={ev.imageAlt ?? `${ev.name} — event`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-2rem)]">
                            <span
                              className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyles[ev.status]}`}
                            >
                              {ev.status}
                            </span>
                            {ev.partnerEvent ? (
                              <span
                                className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${partnerBadgeClass}`}
                              >
                                Partner event
                              </span>
                            ) : null}
                          </div>
                          <EventHeroCaption ev={ev} />
                        </div>

                        {ev.famousPlace?.name ? (
                          <>
                            <FamousPlaceDetail
                              theme={ev.famousPlace.theme}
                              name={ev.famousPlace.name}
                              region={ev.famousPlace.region}
                              image={ev.famousPlace.image ?? ev.image}
                              imageAlt={ev.famousPlace.imageAlt ?? ev.imageAlt}
                            />
                            {(ev.famousPlace.galleries?.length
                              ? ev.famousPlace.galleries
                              : ev.famousPlace.gallery?.length
                                ? [
                                    {
                                      heading: ev.famousPlace.galleryHeading ?? 'Image highlights',
                                      items: ev.famousPlace.gallery,
                                    },
                                  ]
                                : []
                            ).map((block, idx) => (
                              <FamousPlaceGallery
                                key={`${ev.id}-fp-gal-${idx}`}
                                heading={block.heading}
                                items={block.items}
                              />
                            ))}
                          </>
                        ) : null}

                        <div className="p-6 flex flex-col flex-1 min-h-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-black text-white leading-snug">{ev.name}</h3>
                            {/* <button
                              type="button"
                              className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all"
                            >
                              Register
                            </button> */}
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed mb-5">{ev.summary}</p>

                          <div className="grid gap-3 text-sm text-slate-400 mt-auto">
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                              <span>{ev.dateLabel}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                              <span>{ev.location}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{ev.participation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoboClubEventsSection;
