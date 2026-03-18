import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Users, AlertTriangle, Calendar, Trophy, Cpu } from 'lucide-react';
import { getMySquads } from '../api/squadApi';

const STATUS_COLORS = {
  DRAFT: 'bg-slate-500/20 text-slate-200 border-slate-500/50',
  PENDING: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  VERIFIED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  REGISTERED: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  DISQUALIFIED: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

// Fallback static example squad when API returns no data
const FALLBACK_SQUADS = [
  {
    lineup: {
      bot_id: {
        _id: '6985ae33b8840d66856780ab',
      },
      captain_id: '6996fa5bc45800dca0df8eee',
      members: ['69b2fa31ec6bf94bdda60cf0', '6998265826166b090c91eff1'],
    },
    _id: '69b30c24d185edfb32552e41',
    club_id: '69b1212265d0b37a9f0b004a',
    teamName: 'Team Alpha',
    category: 'Senior',
    event_id: null,
    competition_id: null,
    entry_fee: 500,
    status: 'DRAFT',
    website: 'worso',
    partnerId: null,
    partnerCode: 'TH',
    createdAt: '2026-03-12T18:55:32.964Z',
    updatedAt: '2026-03-12T18:55:32.964Z',
    __v: 0,
  },
];

function formatDate(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function MySquads() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMySquads();
        const payload = res?.data;
        const squads = payload?.data ?? payload ?? [];
        if (!cancelled) {
          if (Array.isArray(squads) && squads.length > 0) {
            setData(squads);
          } else {
            // When API returns no squads, show a static example
            setData(FALLBACK_SQUADS);
          }
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load squads.';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const squads = useMemo(() => {
    return (data || []).map((raw) => {
      const comp = raw.competition_id || raw.competition || {};
      const evt = raw.event_id || raw.event || {};
      const club = raw.club_id || raw.club || {};

      return {
        id: raw._id || raw.id,
        teamName: raw.teamName || raw.name || 'Unnamed Squad',
        category: raw.category || 'Senior',
        status: (raw.status || '').toUpperCase() || 'DRAFT',
        competitionName: comp.name || comp.title || 'Competition',
        eventName: evt.name || evt.title || null,
        clubName: club.clubName || club.name || null,
        createdAt: raw.createdAt,
      };
    });
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            My Squads
          </h1>
          <p className="text-sm text-slate-400">
            All squads you have created or are associated with in Technoxian.
          </p>
        </div>
      </div>

      {loading && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          <p className="text-sm text-slate-300">Loading your squads...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-rose-950/40 border border-rose-700/70 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />
          <div>
            <p className="text-sm text-rose-100 font-semibold">
              Unable to fetch squads
            </p>
            <p className="text-xs text-rose-200/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && squads.length === 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col gap-2">
          <p className="text-sm text-slate-200 font-semibold">
            No squads found for this account.
          </p>
          <p className="text-xs text-slate-400">
            Create a squad from the Squad Manager. Once created, it will appear here
            with its competition, category, and status.
          </p>
        </div>
      )}

      {!loading && !error && squads.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              SQUADS ({squads.length})
            </p>
          </div>
          <div className="divide-y divide-slate-800">
            {squads.map((squad) => {
              const statusClass =
                STATUS_COLORS[squad.status] || STATUS_COLORS.DRAFT;
              return (
                <div
                  key={squad.id}
                  className="px-4 md:px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">
                        {squad.teamName}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 border border-slate-700/80 text-slate-200">
                        <Cpu className="w-3 h-3" />
                        {squad.category}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {squad.competitionName}
                      </span>
                      {squad.eventName && (
                        <span className="inline-flex items-center gap-1">
                          • {squad.eventName}
                        </span>
                      )}
                      {squad.clubName && (
                        <span className="inline-flex items-center gap-1">
                          • {squad.clubName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end md:items-center gap-3 md:gap-4">
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(squad.createdAt)}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${statusClass}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {squad.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MySquads;

