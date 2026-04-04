import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ShoppingBag, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { SHOWCASE_PROJECTS, SHOWCASE_KITS } from '../../constants/roboclubLandingData';

const PER_PAGE = 2;

const ProjectCard = ({ p }) => (
  <article className="group h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 hover:border-fuchsia-500/35 transition-colors flex flex-col">
    <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
      <img
        src={p.image}
        alt=""
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span
            key={t}
            className="text-[10px] uppercase font-bold tracking-wide px-2 py-1 rounded-md bg-black/50 border border-white/10 text-cyan-200"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
    <div className="p-5 md:p-6 flex flex-col flex-1 min-h-0">
      <h3 className="text-lg font-black text-white mb-2 line-clamp-2">{p.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-2 line-clamp-3 flex-1">{p.description}</p>
      <p className="text-xs text-slate-500 mb-4">{p.author}</p>
      {/* <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-bold text-fuchsia-400 hover:text-fuchsia-300 mt-auto"
      >
        View details
        <ExternalLink className="w-4 h-4" />
      </button> */}
    </div>
  </article>
);

const KitCard = ({ k }) => (
  <div className="group h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 hover:border-cyan-500/45 transition-all flex flex-col">
    <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
      <img
        src={k.image}
        alt=""
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-cyan-500 text-slate-950">
        {k.badge}
      </span>
      <button
        type="button"
        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"
        aria-label="Add to bag"
      >
        <ShoppingBag size={18} />
      </button>
    </div>
    <div className="p-5 md:p-6 flex flex-col flex-1 min-h-0">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="text-white font-black text-base md:text-lg line-clamp-2">{k.name}</h3>
        <span className="text-cyan-400 font-black text-sm shrink-0">{k.price}</span>
      </div>
      <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{k.blurb}</p>
      <NavLink
        to="/shop"
        className="text-cyan-400 text-sm font-bold hover:text-cyan-300 inline-flex items-center gap-1 mt-auto"
      >
        Open store
        <ExternalLink className="w-3.5 h-3.5" />
      </NavLink>
    </div>
  </div>
);

const ProjectShowcaseSection = () => {
  const [tab, setTab] = useState('projects');
  const [page, setPage] = useState(0);

  const items = useMemo(() => (tab === 'projects' ? SHOWCASE_PROJECTS : SHOWCASE_KITS), [tab]);
  const n = items.length;
  const pageCount = Math.max(1, Math.ceil(n / PER_PAGE));

  useEffect(() => {
    setPage(0);
  }, [tab]);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const next = useCallback(() => setPage((p) => (p + 1) % pageCount), [pageCount]);
  const prev = useCallback(() => setPage((p) => (p - 1 + pageCount) % pageCount), [pageCount]);

  useEffect(() => {
    if (pageCount <= 1) return undefined;
    const t = setInterval(next, 9000);
    return () => clearInterval(t);
  }, [next, pageCount]);

  const visible = useMemo(() => {
    const start = page * PER_PAGE;
    return items.slice(start, start + PER_PAGE);
  }, [items, page]);

  return (
    <section id="project-showcase" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-fuchsia-400 font-bold tracking-widest text-xs uppercase">Showcase</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Project showcase </h2>
            <p className="text-slate-400 mt-2 max-w-xl">
              Member-built robots and curated kits—explore what squads ship, then gear up with trusted bundles.
            </p>
          </div>
          <div className="flex rounded-xl border border-slate-700 bg-slate-900/80 p-1 w-fit">
            <button
              type="button"
              onClick={() => setTab('projects')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'projects'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Member projects
            </button>
            <button
              type="button"
              onClick={() => setTab('kits')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'kits' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Kits &amp; products
            </button>
          </div>
        </div>

        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-5 md:p-8 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

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
              key={`${tab}-${page}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 gap-3 sm:gap-6"
            >
              {tab === 'projects'
                ? visible.map((p) => (
                    <div
                      key={p.id}
                      className={visible.length === 1 ? 'col-span-2 flex justify-center' : 'min-w-0'}
                    >
                      <div className={visible.length === 1 ? 'w-full max-w-lg' : 'w-full'}>
                        <ProjectCard p={p} />
                      </div>
                    </div>
                  ))
                : visible.map((k) => (
                    <div
                      key={k.id}
                      className={visible.length === 1 ? 'col-span-2 flex justify-center' : 'min-w-0'}
                    >
                      <div className={visible.length === 1 ? 'w-full max-w-lg' : 'w-full'}>
                        <KitCard k={k} />
                      </div>
                    </div>
                  ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcaseSection;
