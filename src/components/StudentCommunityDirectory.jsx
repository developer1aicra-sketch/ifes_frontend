import React, { useEffect, useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const DEFAULT_ACCENT = {
  title: 'text-white',
  badge: 'bg-white/10 border-white/20 text-slate-200',
  iconBg: 'bg-white/10 border-white/20 text-slate-200',
  borderLeft: 'border-l-white/30',
};

const PAGE_SIZE = 10;

/**
 * Mask email: local part (before @) hidden as "xxxx", domain (paaki) visible.
 * e.g. sifattupul@gmail.com → xxxx@gmail.com
 */
function maskEmail(email) {
  if (!email || typeof email !== 'string') return '—';
  const at = email.indexOf('@');
  if (at === -1) return 'xxxx';
  return `xxxx@${email.slice(at + 1)}`;
}

/**
 * Mask mobile: last 4 digits as "xxxx", rest visible.
 * e.g. 1811762188 → 181176xxxx
 */
function maskMobile(mobile) {
  if (!mobile || typeof mobile !== 'string') return '—';
  const digits = mobile.replace(/\D/g, '');
  if (digits.length <= 4) return 'xxxx';
  return `${digits.slice(0, -4)}xxxx`;
}

/** Normalize API response: support { data: [] }, { data: { data: [] } }, or array */
function normalizeUsersResponse(response) {
  const res = response?.data ?? response;
  if (Array.isArray(res)) return res;
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
  return [];
}

/** Match search query against user fields (fullName, institute, city, state, country, role) */
function matchSearch(user, query) {
  if (!query || typeof query !== 'string') return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const fullName = (user.fullName || '').toLowerCase();
  const email = (user.email || '').toLowerCase();
  const institute = (user.affiliation?.instituteName || '').toLowerCase();
  const city = (user.personalAndShippingAddress?.city || '').toLowerCase();
  const state = (user.personalAndShippingAddress?.state || '').toLowerCase();
  const country = (user.personalAndShippingAddress?.country || '').toLowerCase();
  const role = (user.role || '').toLowerCase();
  return (
    fullName.includes(q) ||
    email.includes(q) ||
    institute.includes(q) ||
    city.includes(q) ||
    state.includes(q) ||
    country.includes(q) ||
    role.includes(q)
  );
}

export function StudentCommunityDirectory({ themeAccent }) {
  const accent = themeAccent || DEFAULT_ACCENT;
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    axiosInstance
      .get(endpoints.directory.allUsers)
      .then((response) => {
        if (!isMounted) return;
        const list = normalizeUsersResponse(response);
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load community directory');
        setUsers([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    return users.filter((u) => matchSearch(u, searchQuery));
  }, [users, searchQuery]);

  const totalFiltered = filteredUsers.length;
  const totalPagesComputed = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPagesComputed);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedList = useMemo(
    () => filteredUsers.slice(start, start + PAGE_SIZE),
    [filteredUsers, start]
  );

  useEffect(() => {
    if (page > totalPagesComputed && totalPagesComputed >= 1) setPage(totalPagesComputed);
  }, [totalPagesComputed, page]);

  const goToPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPagesComputed)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${accent.title}`}>
            Student Community Directory
          </h1>
          <p className="text-sm text-slate-400">
            Explore the wider Technoxian student community directory across schools, clubs, and regions.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 flex items-center">
          <div className={`absolute left-0 top-0 bottom-0 w-10 rounded-l-xl flex items-center justify-center border border-r-0 border-slate-600/80 ${accent.iconBg}`} aria-hidden>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, institute, city, country, role..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/5 border border-slate-600/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 focus:border-white/30"
            aria-label="Search directory"
          />
        </div>
      </div>

      {loading && (
        <div className={`rounded-2xl border p-8 text-center bg-white/5 border-slate-700/80 ${accent.borderLeft} border-l-4 text-slate-400`}>
          Loading community directory…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-6 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className={`rounded-2xl border border-slate-700/80 overflow-hidden bg-white/5 ${accent.borderLeft} border-l-4`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b border-slate-700/80 ${accent.badge}`}>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Mobile</th>
                    <th className="px-4 py-3 font-semibold">Institute</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-slate-800/80 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-200 font-medium">
                          {user.fullName || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">
                          {maskEmail(user.email)}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono">
                          {maskMobile(user.mobile)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {user.affiliation?.instituteName || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {[user.personalAndShippingAddress?.city, user.personalAndShippingAddress?.state, user.personalAndShippingAddress?.country]
                            .filter(Boolean)
                            .join(', ') || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.badge}`}>
                            {user.role || '—'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPagesComputed > 1 && (
              <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-700/80 bg-white/5 ${accent.borderLeft} border-l-4`}>
                <p className="text-xs text-slate-500">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, totalFiltered)} of {totalFiltered}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${accent.badge} hover:opacity-90 disabled:hover:opacity-50`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className={`text-sm ${accent.title} opacity-90`}>
                    Page {currentPage} of {totalPagesComputed}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPagesComputed}
                    className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${accent.badge} hover:opacity-90 disabled:hover:opacity-50`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default StudentCommunityDirectory;
