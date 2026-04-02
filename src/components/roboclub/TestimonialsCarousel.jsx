import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Medal } from 'lucide-react';
import { TESTIMONIALS } from '../../constants/roboclubLandingData';

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);
  const n = TESTIMONIALS.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const active = TESTIMONIALS[index];

  return (
    <section id="testimonials" className="py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="text-amber-400/90 font-bold tracking-widest text-xs uppercase">Voices from the league</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-3">Success stories &amp; testimonials</h2>
          <p className="text-slate-400">Real outcomes from captains, members, and mentors in the RoboClub network.</p>
        </div>

        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-8 md:p-12 min-h-[320px] flex flex-col">
          <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-700" />

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col items-center text-center"
            >
              <img
                src={active.image}
                alt=""
                className="w-20 h-20 rounded-full border-4 border-slate-800 object-cover shadow-xl mb-6"
              />
              <blockquote className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mb-6">
                &ldquo;{active.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-white font-bold">{active.name}</p>
                <p className="text-slate-500 text-sm">{active.role}</p>
              </div>
              <ul className="mt-8 flex flex-wrap justify-center gap-2">
                {active.achievements.map((a) => (
                  <li
                    key={a}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-200/90"
                  >
                    <Medal className="w-3.5 h-3.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              type="button"
              onClick={prev}
              className="p-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === index ? 'bg-cyan-400 w-8' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="p-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
