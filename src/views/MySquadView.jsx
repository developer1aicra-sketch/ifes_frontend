import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Crown,
  Cpu,
  Trophy,
  Wallet,
  Loader2,
  AlertCircle,
  ChevronDown,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  FileEdit,
  Edit2,
  Trash2,
  ArrowLeft,
  User,
  Search,
  Lock,
} from 'lucide-react';
import { getSquadsByClub, getSquadById } from '../../api/squadApi';
import { getClubMembers } from '../../api/clubApi';
import { SquadPagination } from './SquadPagination';
import SquadPaymentModal from './SquadPaymentModal';

const DEFAULT_PAGE_SIZE = 6;
const PAGE_SIZE_OPTIONS = [6, 9, 12, 24];

const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: FileEdit },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCircle },
  PAID: { label: 'Paid', color: 'bg-green-500/20 text-green-400 border-green-500/40', icon: CheckCircle },
};

function getLineupMemberIds(squad) {
  if (!squad) return [];
  const raw = squad.lineup?.members ?? squad.members ?? [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m) => {
      if (m == null) return null;
      if (typeof m === 'object') return m.user_id?._id ?? m._id ?? m.id ?? m.user_id ?? m.user;
      return m;
    })
    .filter((id) => id != null)
    .map((id) => String(id));
}

function resolveMemberName(memberId, clubMembers) {
  if (!memberId) return '—';
  const sid = String(memberId);
  const m = (clubMembers || []).find(
    (c) =>
      String(c.user_id?._id ?? c.user_id ?? c._id ?? c.id ?? '') === sid ||
      String(c._id ?? c.id ?? '') === sid
  );
  if (!m) return sid;
  return m.user?.fullName ?? m.fullname ?? m.user_id?.fullname ?? m.user_id?.name ?? m.name ?? m.user?.email ?? m.emailId ?? m.user_id?.email ?? sid;
}

function SquadCard({ squad, clubId, clubMembers = [], onEditSquad, onDeleteSquad, onCardClick, onPayNow }) {
  const captainName =
    squad.captain?.fullName ||
    squad.captain?.fullname ||
    squad.captain?.name ||
    squad.captain?.email ||
    squad.captain?.emailId ||
    '—';
  const botName = squad.bot?.name || '—';
  const lineupIds = React.useMemo(() => getLineupMemberIds(squad), [squad?.lineup?.members, squad?.members]);
  const memberCount = lineupIds.length;
  const membersForDisplay = React.useMemo(
    () => lineupIds.map((id) => ({ id, name: resolveMemberName(id, clubMembers) })),
    [lineupIds, clubMembers]
  );
  const memberLabel = React.useMemo(() => {
    if (memberCount === 0) return 'No members';
    const names = membersForDisplay.map((m) => m.name);
    const maxShow = 3;
    if (names.length <= maxShow) return names.join(', ');
    return `${names.slice(0, maxShow - 1).join(', ')} & ${names.length - maxShow + 1} more`;
  }, [membersForDisplay, memberCount]);
  const isPaid = squad.payment?.isPaid === true;
  const statusKey = (squad.status || 'DRAFT').toUpperCase();
  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.DRAFT;
  const StatusIcon = statusStyle.icon;

  const handleEdit = (e) => {
    e.stopPropagation();
    if (clubId && onEditSquad) {
      onEditSquad(squad, clubId);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDeleteSquad) onDeleteSquad(squad);
  };

  const handleCardClick = () => {
    if (onCardClick) onCardClick(squad);
  };

  return (
    <div
      role={onCardClick ? 'button' : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick ? handleCardClick : undefined}
      onKeyDown={onCardClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } } : undefined}
      className={`bg-slate-900/80 border border-slate-700 rounded-xl p-5 transition-all duration-200 ${onCardClick ? 'cursor-pointer hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50 hover:ring-1 hover:ring-slate-500' : 'hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-white truncate" title={squad.teamName}>
              {squad.teamName}
            </h3>
            {squad.category && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-600 text-xs text-slate-300">
                <Trophy size={12} />
                {squad.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {clubId && onEditSquad && (
              <button
                type="button"
                onClick={handleEdit}
                className="p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-colors"
                title="Edit squad"
                aria-label="Edit squad"
              >
                <Edit2 size={18} />
              </button>
            )}
            {onDeleteSquad && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
                title="Delete squad"
                aria-label="Delete squad"
              >
                <Trash2 size={18} />
              </button>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusStyle.color}`}
            >
              <StatusIcon size={12} />
              {statusStyle.label}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-sm flex-1">
          {/* <div className="flex items-center gap-2 text-slate-400">
            <Cpu className="shrink-0 text-cyan-400" size={16} />
            <span className="truncate" title={botName}>
              {botName}
            </span>
          </div> */}
          
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="shrink-0 text-blue-400" size={16} />
            <span className="min-w-0 flex-1" title={membersForDisplay.map((m) => m.name).join(', ')}>
              <span className="text-white font-medium">{memberCount}</span>
              {' '}
              {memberCount === 1 ? 'member' : 'members'}
             
            </span>
          </div>
          {/* <div className="flex items-center gap-2 text-slate-400">
            <DollarSign className="shrink-0 text-emerald-400" size={16} />
            <span className="text-white font-medium">
              ₹{Number(squad.entry_fee ?? 0).toLocaleString()}
            </span>
            {isPaid && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle size={12} />
                Paid
              </span>
            )}
          </div> */}
          {!isPaid && typeof onPayNow === 'function' && (
            <div className="flex items-center justify-between gap-3 mt-2">
              <span className="text-xs text-amber-400">Pending</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPayNow(squad);
                }}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-colors"
              >
                <Lock size={14} className="shrink-0" />
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 animate-pulse"
        >
          <div className="h-5 bg-slate-700 rounded w-3/4 mb-3" />
          <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-4/5" />
            <div className="h-4 bg-slate-700 rounded w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SquadDetailView({
  squad,
  loading,
  error,
  onBack,
  clubId,
  onEditSquad,
  onDeleteSquad,
  onPayNow,
}) {
  const [clubMembers, setClubMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  // Fetch club members to resolve captain_id and lineup.members (ids) to names
  useEffect(() => {
    const effectiveClubId = clubId || squad?.club_id;
    if (!effectiveClubId || !squad) {
      setClubMembers([]);
      return;
    }
    let cancelled = false;
    setMembersLoading(true);
    getClubMembers(effectiveClubId)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const raw = payload?.data ?? payload ?? [];
        setClubMembers(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {
        if (!cancelled) setClubMembers([]);
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false);
      });
    return () => { cancelled = true; };
  }, [clubId, squad?.club_id, squad?._id]);

  // All hooks must run unconditionally (before any early return)
  const lineupMemberIds = useMemo(() => getLineupMemberIds(squad), [squad?.lineup?.members, squad?.members]);

  const membersForDisplay = useMemo(() => {
    return lineupMemberIds.map((id) => ({
      id,
      name: resolveMemberName(id, clubMembers),
    }));
  }, [lineupMemberIds, clubMembers]);

  if (loading) {
    return (
      <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[320px]">
        <Loader2 className="text-purple-400 animate-spin mb-4" size={40} />
        <p className="text-slate-400">Loading squad details…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[320px]">
        <AlertCircle className="text-red-400 mb-3" size={48} />
        <p className="text-slate-300 text-center mb-1">Could not load squad details</p>
        <p className="text-sm text-slate-500 text-center mb-4">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to list
        </button>
      </div>
    );
  }
  if (!squad) return null;

  const captainId = squad.lineup?.captain_id ?? squad.captain_id ?? null;
  const captainIdStr = captainId != null ? String(typeof captainId === 'object' ? (captainId._id ?? captainId.id ?? captainId.user_id?._id ?? captainId.user_id) : captainId) : null;
  const captainName =
    squad.captain?.fullName ?? squad.captain?.fullname ?? squad.captain?.email ?? squad.captain?.emailId ?? squad.captain?.name
      ? (squad.captain?.fullName || squad.captain?.fullname || squad.captain?.email || squad.captain?.emailId || squad.captain?.name)
      : captainIdStr
        ? resolveMemberName(captainIdStr, clubMembers)
        : '—';
  const botName = squad.bot?.name ?? '—';
  const isPaid = squad.payment?.isPaid === true;
  const statusKey = (squad.status || 'DRAFT').toUpperCase();
  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.DRAFT;
  const StatusIcon = statusStyle.icon;
  const createdAtText = squad.createdAt ? new Date(squad.createdAt).toLocaleString() : null;

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to squads
        </button>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusStyle.color}`}>
            <StatusIcon size={12} />
            {statusStyle.label}
          </span>
          {/* {clubId && onEditSquad && (
            <button
              type="button"
              onClick={() => onEditSquad(squad, clubId)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-colors"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )} */}
          {/* {onDeleteSquad && (
            <button
              type="button"
              onClick={() => onDeleteSquad(squad)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )} */}
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{squad.teamName}</h3>
          {squad.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-600 text-sm text-slate-300">
              <Trophy size={14} />
              {squad.category}
            </span>
          )}
          {createdAtText && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
              <Calendar size={14} />
              Created: {createdAtText}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu size={24} />
            </div>
           
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Crown size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Captain</p>
              <p className="text-white font-medium">{captainName}</p>
            </div>
          </div>
        </div>

        {(squad.event || squad.competition) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar size={14} />
                Event
              </p>
              {squad.event ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Name</span>
                    <span className="text-white font-medium text-right">{squad.event?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Type</span>
                    <span className="text-slate-200 text-right">{squad.event?.type ?? '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Zone</span>
                    <span className="text-slate-200 text-right">{squad.event?.zone ?? '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Location</span>
                    <span className="text-slate-200 text-right">{squad.event?.location ?? '—'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No event info.</p>
              )}
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Trophy size={14} />
                Competition
              </p>
              {squad.competition ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Name</span>
                    <span className="text-white font-medium text-right">{squad.competition?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Category</span>
                    <span className="text-slate-200 text-right">
                      {Array.isArray(squad.competition?.category)
                        ? squad.competition.category.join(', ')
                        : (squad.competition?.category ?? '—')}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-400">Competition ID</span>
                    <span className="text-slate-200 text-right">{squad.competition?._id ?? '—'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No competition info.</p>
              )}
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <DollarSign size={14} />
            Entry fee & payment
          </p>
          <p className="text-white font-medium">
            ₹{Number(squad.entry_fee ?? 0).toLocaleString()}
          </p>
          {isPaid ? (
            <span className="inline-flex items-center gap-1 mt-1 text-sm text-emerald-400">
              <CheckCircle size={14} />
              Paid
            </span>
          ) : (
            <div className="flex items-center justify-between gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                Pending
              </span>
              {typeof onPayNow === 'function' && (
                <button
                  type="button"
                  onClick={() => onPayNow(squad)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-colors"
                >
                  <Lock size={16} />
                  Pay Now
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users size={14} />
            Members ({membersForDisplay.length})
          </p>
          {membersLoading ? (
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Loading member names…
            </p>
          ) : (
            <ul className="space-y-2">
              {membersForDisplay.length === 0 ? (
                <li className="text-slate-500 text-sm">No members listed.</li>
              ) : (
                membersForDisplay.map((m, i) => (
                  <li key={m.id ?? i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <User size={14} className="text-slate-500 shrink-0" />
                    <span>{m.fullName}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MySquadView({
  clubId,
  clubs = [],
  onClubChange,
  onEditSquad,
  onDeleteSquad,
  squadsRefreshTrigger = 0,
  deletedSquadId,
  onDeletedSquadIdConsumed,
  className = '',
}) {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clubMembers, setClubMembers] = useState([]);
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedSquadId, setSelectedSquadId] = useState(null);
  const [detailSquad, setDetailSquad] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSquad, setPaymentSquad] = useState(null);

  const selectedClub = clubs.find((c) => (c.id || c._id) === clubId) || clubs[0];
  const effectiveClubId = clubId || selectedClub?.id || selectedClub?._id;

  useEffect(() => {
    if (!effectiveClubId) {
      setSquads([]);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getSquadsByClub(effectiveClubId)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.data;
        setSquads(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load squads');
          setSquads([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [effectiveClubId, squadsRefreshTrigger]);

  useEffect(() => {
    if (!effectiveClubId) {
      setClubMembers([]);
      return;
    }
    let cancelled = false;
    getClubMembers(effectiveClubId)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const raw = payload?.data ?? payload ?? [];
        setClubMembers(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {
        if (!cancelled) setClubMembers([]);
      });
    return () => { cancelled = true; };
  }, [effectiveClubId]);

  useEffect(() => {
    if (deletedSquadId && selectedSquadId && (selectedSquadId === deletedSquadId || String(selectedSquadId) === String(deletedSquadId))) {
      setSelectedSquadId(null);
      onDeletedSquadIdConsumed?.();
    }
  }, [deletedSquadId, selectedSquadId, onDeletedSquadIdConsumed]);

  useEffect(() => {
    if (!selectedSquadId) {
      setDetailSquad(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    setDetailSquad(null);
    getSquadById(selectedSquadId)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data?.data ?? res?.data;
        setDetailSquad(data ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setDetailError(err.response?.data?.message || err.message || 'Failed to load squad details');
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedSquadId]);

  const filteredSquads = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return squads;
    return squads.filter((s) => {
      const teamName = (s.teamName || s.name || '').toLowerCase();
      const category = (s.category || '').toLowerCase();
      const captainName = (
        s.captain?.fullName ||
        s.captain?.fullname ||
        s.captain?.name ||
        s.captain?.email ||
        s.captain?.emailId ||
        ''
      ).toLowerCase();
      const botName = (s.bot?.name || '').toLowerCase();
      return teamName.includes(q) || category.includes(q) || captainName.includes(q) || botName.includes(q);
    });
  }, [squads, searchQuery]);

  // Reset to first page when club, data set, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveClubId, squads.length, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSquads.length / pageSize));
  const paginatedSquads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSquads.slice(start, start + pageSize);
  }, [filteredSquads, currentPage, pageSize]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage((p) => Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const handleOpenPayment = useCallback((squad) => {
    if (!squad) return;
    setPaymentSquad(squad);
    setIsPaymentModalOpen(true);
  }, []);

  const handleClosePayment = useCallback(() => {
    setIsPaymentModalOpen(false);
    setPaymentSquad(null);
  }, []);

  const handlePaymentSuccess = useCallback(
    async () => {
      try {
        if (effectiveClubId) {
          setLoading(true);
          setError(null);
          try {
            const res = await getSquadsByClub(effectiveClubId);
            const data = res?.data?.data;
            setSquads(Array.isArray(data) ? data : []);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                err.message ||
                'Failed to refresh squads after payment'
            );
          }
        }
        if (selectedSquadId) {
          try {
            const detailRes = await getSquadById(selectedSquadId);
            const data = detailRes?.data?.data ?? detailRes?.data;
            setDetailSquad(data ?? null);
          } catch {
            // keep existing detail view if refresh fails
          }
        }
      } finally {
        setLoading(false);
        setIsPaymentModalOpen(false);
        setPaymentSquad(null);
      }
    },
    [effectiveClubId, selectedSquadId]
  );

  const showSearchInHeader =
    effectiveClubId && !loading && !error && squads.length > 0 && !selectedSquadId;

  return (
    <div className={className}>
      {/* Header: title + search in one line */}
      <div className="flex flex-row flex-wrap items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">My Squad</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            View and manage your registered squads for this club.
          </p>
        </div>
        {showSearchInHeader && (
          <div className="flex flex-col items-end gap-1 shrink-0 w-full sm:w-auto sm:min-w-[280px] sm:max-w-md">
            <label htmlFor="squad-search" className="sr-only">
              Search squads
            </label>
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                size={18}
                aria-hidden
              />
              <input
                id="squad-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category, captain, or bot…"
                className="w-full pl-10 pr-8 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors text-sm"
                aria-label="Search squads"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <span className="text-xs text-slate-500">
                {filteredSquads.length} {filteredSquads.length === 1 ? 'squad' : 'squads'} found
              </span>
            )}
          </div>
        )}
        {clubs.length > 1 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowClubDropdown(!showClubDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white hover:border-slate-500 transition-colors"
            >
              <Building2 size={18} />
              <span className="truncate max-w-[180px]">
                {selectedClub?.name ?? selectedClub?.clubName ?? 'Select club'}
              </span>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform ${showClubDropdown ? 'rotate-180' : ''}`}
              />
            </button>
            {showClubDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setShowClubDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1 py-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-20 min-w-[220px]">
                  {clubs.map((club) => {
                    const id = club.id || club._id;
                    const isActive = id === effectiveClubId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          onClubChange?.(id);
                          setShowClubDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                          isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/70'
                        }`}
                      >
                        <Building2 size={16} />
                        {club.name || club.clubName || id}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!effectiveClubId && clubs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/50 border border-slate-700 rounded-xl">
          <AlertCircle className="text-amber-400 mb-3" size={48} />
          <p className="text-slate-300 text-center">
            No club found. Create or join a club first to view squads.
          </p>
        </div>
      )}

      {effectiveClubId && (
        <>
          {loading && <LoadingSkeleton />}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/50 border border-slate-700 rounded-xl">
              <AlertCircle className="text-red-400 mb-3" size={48} />
              <p className="text-slate-300 text-center mb-1">Could not load squads</p>
              <p className="text-sm text-slate-500 text-center">{error}</p>
            </div>
          )}

          {!loading && !error && squads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/50 border border-slate-700 rounded-xl">
              <Users className="text-slate-500 mb-3" size={48} />
              <p className="text-slate-300 text-center">
                No squads yet for this club. Create a team in Manage to get started.
              </p>
            </div>
          )}

          {!loading && !error && squads.length > 0 && (
            <>
              {selectedSquadId ? (
                <SquadDetailView
                  squad={detailSquad}
                  loading={detailLoading}
                  error={detailError}
                  onBack={() => setSelectedSquadId(null)}
                  clubId={effectiveClubId}
                  onEditSquad={onEditSquad}
                  onDeleteSquad={onDeleteSquad}
                  onPayNow={handleOpenPayment}
                />
              ) : (
                <>
                  {filteredSquads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                      <Search className="text-slate-500 mb-3" size={40} />
                      <p className="text-slate-300 text-center">
                        No squads match &quot;{searchQuery.trim()}&quot;
                      </p>
                      <p className="text-sm text-slate-500 text-center mt-1">
                        Try a different search or clear the search box.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white text-sm transition-colors"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedSquads.map((squad) => (
                          <SquadCard
                            key={squad._id}
                            squad={squad}
                            clubId={effectiveClubId}
                            clubMembers={clubMembers}
                            onEditSquad={onEditSquad}
                            onDeleteSquad={onDeleteSquad}
                            onCardClick={(s) => setSelectedSquadId(s._id)}
                            onPayNow={handleOpenPayment}
                          />
                        ))}
                      </div>
                      <SquadPagination
                        totalItems={filteredSquads.length}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        itemLabel="squads"
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <SquadPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePayment}
        squad={paymentSquad}
        clubId={effectiveClubId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
