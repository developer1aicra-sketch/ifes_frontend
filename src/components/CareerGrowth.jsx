import React, { useMemo } from 'react';
import { Briefcase, Star, Lock } from 'lucide-react';

const DEFAULT_ACCENT = {
  badge: 'bg-violet-500/15 border-violet-400/40 text-violet-300',
  title: 'text-violet-300',
};

export function CareerGrowth({ activeSection = 'internships', membershipPlanName, themeAccent }) {
  const accent = themeAccent || DEFAULT_ACCENT;
  const sectionFlags = useMemo(
    () => ({
      internships: activeSection === 'internships',
      priority: activeSection === 'priority',
    }),
    [activeSection]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${accent.badge}`}>
          <Briefcase size={20} />
        </div>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${accent.title}`}>Career Growth</h1>
          <p className="text-sm text-slate-400">
            Internship opportunities for students. Basic members can access standard listings, while
            premium members unlock priority internships.
          </p>
        </div>
      </div>

      {sectionFlags.internships && (
        <section className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.18em]">
                Internship Listings
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Available for <span className="text-slate-200">Student Basic</span> membership.
              </p>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] bg-slate-800 border border-slate-600 text-slate-300">
              Basic Access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'intern-1',
                role: 'Robotics Intern',
                company: 'Partner Lab (Remote)',
                meta: '4 weeks • Project-based',
              },
              {
                id: 'intern-2',
                role: 'Electronics Intern',
                company: 'Innovation Hub',
                meta: '6 weeks • Hybrid',
              },
              {
                id: 'intern-3',
                role: 'CAD / Design Intern',
                company: 'Maker Studio',
                meta: '3 weeks • On-site',
              },
            ].map((job) => (
              <div
                key={job.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-700/80 p-4"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-violet-300/80">
                  Internship
                </p>
                <h3 className="mt-1 text-sm font-semibold text-slate-50">{job.role}</h3>
                <p className="text-xs text-slate-400 mt-1">{job.company}</p>
                <p className="text-xs text-slate-300/80 mt-3">{job.meta}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionFlags.priority && (
        <section className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-[0.18em]">
                Priority Internships
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Reserved for <span className="text-slate-100">Student Premium</span> membership.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] bg-amber-500/15 border border-amber-400/50 text-amber-200">
              <Star className="w-3 h-3" />
              Premium Only
            </span>
          </div>

          {membershipPlanName === 'Student Premium' ? (
            <>
              <div className="rounded-2xl border border-amber-400/50 bg-amber-500/10 p-5 flex items-start gap-3">
                <div className="mt-0.5">
                  <Lock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-200 uppercase tracking-[0.18em]">
                    Priority queue access
                  </p>
                  <p className="mt-1 text-sm text-slate-50">
                    As a Student Premium member, you will be queued ahead for high-signal internships and
                    mentor referrals.
                  </p>
                  <p className="mt-1 text-xs text-amber-100/80">
                    Upcoming listings will appear here with early-application windows.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'p-1',
                    role: 'AI / Vision Intern (Priority)',
                    company: 'Robotics R&D Team',
                    meta: '8 weeks • Mentor-led',
                  },
                  {
                    id: 'p-2',
                    role: 'Competition Robotics Intern (Priority)',
                    company: 'Championship Squad',
                    meta: '6 weeks • On-site',
                  },
                ].map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl bg-slate-900/80 border border-amber-400/30 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/90">
                      Priority
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-50">{job.role}</h3>
                    <p className="text-xs text-slate-300/80 mt-1">{job.company}</p>
                    <p className="text-xs text-slate-200/80 mt-3">{job.meta}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-amber-400/40 bg-slate-900/95 p-5 flex items-start gap-3">
              <div className="mt-0.5">
                <Lock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-200 uppercase tracking-[0.18em]">
                  Upgrade required
                </p>
                <p className="mt-1 text-sm text-slate-50">
                  Priority internships are unlocked only for Student Premium members.
                </p>
                <p className="mt-1 text-xs text-amber-100/80">
                  If your plan is <span className="font-semibold">Student Basic</span>, upgrade to{' '}
                  <span className="font-semibold">Student Premium</span> to access fast-track internship
                  opportunities and mentor referrals.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default CareerGrowth;
