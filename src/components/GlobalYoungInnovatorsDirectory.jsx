import React from 'react';
import { BadgeCheck, Lock } from 'lucide-react';

const DEFAULT_ACCENT = {
  title: 'text-white',
};

export function GlobalYoungInnovatorsDirectory({ membershipPlanName, themeAccent }) {
  const accent = themeAccent || DEFAULT_ACCENT;
  const isPremium = membershipPlanName === 'Student Premium';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${accent.title}`}>
            Global Young Innovators Directory
          </h1>
          <p className="text-sm text-slate-400">
            Discover and connect with young innovators participating in WORSO & Technoxian programs worldwide.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] border ${
              isPremium ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200' : 'bg-slate-800 border-slate-600 text-slate-300'
            }`}
          >
            {isPremium ? (
              <>
                <BadgeCheck className="w-3.5 h-3.5" />
                Premium Access
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Premium Only
              </>
            )}
          </span>
        </div>
      </div>

      {isPremium ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300">
          <p>
            As a <span className="font-semibold text-slate-100">Student Premium</span> member, you&apos;ll
            soon see a curated list of young innovators across clubs, regions, and championships here.
          </p>
          <p className="mt-2 text-slate-400 text-xs">
            API integration hooks are ready—this block can be wired to your backend directory endpoint
            with filters, search, and profile detail views.
          </p>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 flex items-start gap-3">
          <Lock className="w-5 h-5 text-slate-300 mt-0.5" />
          <div>
            <p className="text-slate-100 font-semibold text-sm">
              Upgrade to Student Premium to unlock the global directory.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              The Global Young Innovators Directory is a premium benefit. If your plan is{' '}
              <span className="font-semibold">Student Basic</span>, upgrade to{' '}
              <span className="font-semibold">Student Premium</span> to get featured and discover peers
              worldwide.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GlobalYoungInnovatorsDirectory;
