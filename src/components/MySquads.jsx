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
  const [page, setPage] = useState(1);

  const pageSize = 5;

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

  useEffect(() => {
    setPage(1);
  }, [data]);

  const squads = useMemo(() => {
    return (data || []).map((raw) => {
      const comp = raw.competition_id || raw.competition || {};
      const evt = raw.event_id || raw.event || {};
      const club = raw.club_id || raw.club || {};
      const lineup = raw.lineup || {};
      const captain = lineup.captain_id || null;
      const captainUser = captain?.user_id || null;
      const members = Array.isArray(lineup.members) ? lineup.members : [];

      return {
        raw,
        id: raw._id || raw.id,
        teamName: raw.teamName || raw.name || 'Unnamed Squad',
        category: raw.category || 'Senior',
        status: (raw.status || '').toUpperCase() || 'DRAFT',
        competitionName: comp.name || comp.title || 'Competition',
        eventName: evt.name || evt.title || null,
        clubName: club.clubName || club.name || null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        entryFee: raw.entry_fee ?? raw.entryFee ?? null,
        website: raw.website ?? null,
        captain: captain
          ? {
              id: captain?._id ?? null,
              role: captain?.role ?? null,
              status: captain?.status ?? null,
              fullName: captainUser?.fullName ?? null,
              email: captainUser?.email ?? null,
            }
          : null,
        members: members.map((m) => {
          const u = m?.user_id || null;
          return {
            id: m?._id ?? null,
            role: m?.role ?? null,
            status: m?.status ?? null,
            fullName: u?.fullName ?? null,
            email: u?.email ?? null,
          };
        }),
      };
    });
  }, [data]);

  const totalItems = squads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(totalItems, startIndex + pageSize);
  const pageSquads = useMemo(() => {
    return squads.slice(startIndex, endIndex);
  }, [squads, startIndex, endIndex]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const first = 1;
    const last = totalPages;
    const around = [safePage - 1, safePage, safePage + 1].filter(
      (n) => n > first && n < last
    );
    const set = new Set([first, ...around, last]);
    const sorted = Array.from(set).sort((a, b) => a - b);
    const tokens = [];
    for (let i = 0; i < sorted.length; i += 1) {
      const n = sorted[i];
      const prev = sorted[i - 1];
      if (i > 0 && n - prev > 1) tokens.push('…');
      tokens.push(n);
    }
    return tokens;
  }, [safePage, totalPages]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {loading && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="Loading your squads"
        >
          <div className="bg-slate-900/80 border border-slate-700 rounded-2xl px-6 py-5 flex items-center gap-3 shadow-xl">
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
            <p className="text-sm text-slate-200 font-medium">
              Loading...
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            My Squads
          </h1>
          <p className="text-sm text-slate-400">
          All squads you are associated .
          </p>
        </div>
      </div>

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
            {totalItems > 0 && (
              <p className="text-[11px] text-slate-400">
                Showing {startIndex + 1}–{endIndex} of {totalItems}
              </p>
            )}
          </div>
          <div className="divide-y divide-slate-800">
            {pageSquads.map((squad) => {
              const statusClass =
                STATUS_COLORS[squad.status] || STATUS_COLORS.DRAFT;
              return (
                <div
                  key={squad.id}
                  className="px-4 md:px-5 py-4 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Captain
                      </p>
                      {squad.captain ? (
                        <div className="mt-2 space-y-1 text-xs text-slate-200">
                          <p className="font-semibold text-white">
                            {squad.captain.fullName || '—'}
                          </p>
                          <p className="text-slate-300">{squad.captain.email || '—'}</p>
                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                            {squad.captain.role && <span>Role: {squad.captain.role}</span>}
                            {squad.captain.status && <span>• Status: {squad.captain.status}</span>}
                            {squad.captain.id && <span>• ID: {squad.captain.id}</span>}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-slate-400">—</p>
                      )}
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Members ({squad.members.length})
                      </p>
                      {squad.members.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {squad.members.map((m) => (
                            <div key={m.id || `${m.email}-${m.fullName}`} className="text-xs">
                              <p className="font-semibold text-white">
                                {m.fullName || '—'}
                              </p>
                              <p className="text-slate-300">{m.email || '—'}</p>
                              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                                {m.role && <span>Role: {m.role}</span>}
                                {m.status && <span>• Status: {m.status}</span>}
                                {m.id && <span>• ID: {m.id}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-slate-400">No members</p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900/60"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900/60"
                >
                  Next
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {pageNumbers.map((t, idx) => {
                  if (t === '…') {
                    return (
                      <span
                        key={`dots-${idx}`}
                        className="px-2 py-1 text-xs text-slate-500"
                      >
                        …
                      </span>
                    );
                  }
                  const n = t;
                  const active = n === safePage;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`min-w-9 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-purple-600/25 border-purple-500/60 text-purple-100'
                          : 'border-slate-700 text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MySquads;

