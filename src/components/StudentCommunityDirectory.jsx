import React, { useEffect, useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCommunityDirectoryUsers } from '../api/directoryApi';

const DEFAULT_ACCENT = {
  title: 'text-white',
  badge: 'bg-white/10 border-white/20 text-slate-200',
  iconBg: 'bg-white/10 border-white/20 text-slate-200',
  borderLeft: 'border-l-white/30',
};

const PAGE_SIZE = 10;

/** Flag CDN base (flagcdn.com): use lowercase ISO 3166-1 alpha-2. */
const FLAG_CDN = 'https://flagcdn.com';
const FLAG_SIZE = 24;

/** Country name → ISO 3166-1 alpha-2 (lowercase for CDN). Comprehensive map for reliable resolution. */
const COUNTRY_TO_CODE = {
  bangladesh: 'bd',
  india: 'in',
  pakistan: 'pk',
  nepal: 'np',
  'sri lanka': 'lk',
  'united states': 'us',
  'united states of america': 'us',
  usa: 'us',
  uk: 'gb',
  'united kingdom': 'gb',
  'great britain': 'gb',
  canada: 'ca',
  australia: 'au',
  germany: 'de',
  france: 'fr',
  japan: 'jp',
  china: 'cn',
  singapore: 'sg',
  malaysia: 'my',
  uae: 'ae',
  'united arab emirates': 'ae',
  'saudi arabia': 'sa',
  egypt: 'eg',
  'south africa': 'za',
  nigeria: 'ng',
  kenya: 'ke',
  brazil: 'br',
  mexico: 'mx',
  indonesia: 'id',
  vietnam: 'vn',
  thailand: 'th',
  philippines: 'ph',
  'south korea': 'kr',
  'korea, republic of': 'kr',
  'republic of korea': 'kr',
  russia: 'ru',
  turkey: 'tr',
  italy: 'it',
  spain: 'es',
  netherlands: 'nl',
  sweden: 'se',
  poland: 'pl',
  ukraine: 'ua',
  argentina: 'ar',
  colombia: 'co',
  chile: 'cl',
  peru: 'pe',
  'hong kong': 'hk',
  'new zealand': 'nz',
  ireland: 'ie',
  belgium: 'be',
  austria: 'at',
  switzerland: 'ch',
  portugal: 'pt',
  greece: 'gr',
  israel: 'il',
  qatar: 'qa',
  kuwait: 'kw',
  oman: 'om',
  bahrain: 'bh',
  jordan: 'jo',
  lebanon: 'lb',
  sydney: 'au',
  'united kingdom of great britain and northern ireland': 'gb',
};

/** Resolve country string to ISO 3166-1 alpha-2 lowercase for flag CDN. */
function getCountryCode(country) {
  if (!country || typeof country !== 'string') return null;
  const normalized = country.trim().toLowerCase();
  if (normalized.length === 2 && /^[a-z]{2}$/.test(normalized)) return normalized;
  return COUNTRY_TO_CODE[normalized] || null;
}

/** Renders country flag from CDN; fallback to placeholder if code missing or image fails. */
function CountryFlag({ country, size = FLAG_SIZE, className = '' }) {
  const code = getCountryCode(country);
  const [error, setError] = React.useState(false);

  if (!code || error) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-sm bg-slate-600/50 text-slate-500 shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.6) }}
        title={country || 'Unknown'}
        aria-hidden
      >
        —
      </span>
    );
  }

  const src = `${FLAG_CDN}/w80/${code}.png`;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`rounded-sm object-cover shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={country}
      onError={() => setError(true)}
    />
  );
}

/** Normalize API response for /all-users-data?page&limit&search */
function normalizeUsersResponse(response) {
  const res = response?.data ?? response;
  // Expected: { success, page, limit, total, totalPages, data: [...] }
  const data = res?.data;
  return {
    users: Array.isArray(data) ? data : [],
    page: Number(res?.page) || 1,
    limit: Number(res?.limit) || PAGE_SIZE,
    total: Number(res?.total) || 0,
    totalPages: Number(res?.totalPages) || 1,
  };
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
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    const p = Math.max(1, Number(page) || 1);
    const search = searchQuery.trim();

    getCommunityDirectoryUsers({ page: p, limit: PAGE_SIZE, search })
      .then((response) => {
        if (!isMounted) return;
        const normalized = normalizeUsersResponse(response);
        setUsers(Array.isArray(normalized.users) ? normalized.users : []);
        setTotal(normalized.total || 0);
        setTotalPages(Math.max(1, normalized.totalPages || 1));
        // Keep local page aligned with backend's returned page (safety).
        setPage(Math.max(1, normalized.page || p));
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load community directory');
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [page, searchQuery]);

  // Sort within current page for stable UX.
  const sortedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return [...users].sort((a, b) => {
      const nameA = (a.fullName || '').toLowerCase().trim();
      const nameB = (b.fullName || '').toLowerCase().trim();
      if (nameA && nameB) return nameA.localeCompare(nameB);
      if (nameA && !nameB) return -1;
      if (!nameA && nameB) return 1;
      return 0;
    });
  }, [users]);

  const currentPage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const paginatedList = sortedUsers;

  const goToPage = (p) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${accent.title}`}>
            Worso Community Directory
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
                    <th className="px-4 py-3 font-semibold">Institute</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map((user) => {
                      const country = user.personalAndShippingAddress?.country;
                      const locationParts = [user.personalAndShippingAddress?.city, user.personalAndShippingAddress?.state, country].filter(Boolean);
                      const locationText = locationParts.length ? locationParts.join(', ') : '—';
                      return (
                        <tr
                          key={user._id}
                          className="border-b border-slate-800/80 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-slate-200 font-medium">
                            {user.fullName || '—'}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {user.affiliation?.instituteName || '—'}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            <span className="inline-flex items-center gap-2 min-w-0">
                              <CountryFlag country={country} size={FLAG_SIZE} className="flex-shrink-0" />
                              <span className="truncate" title={locationText}>{locationText}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.badge}`}>
                              {user.role || '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-700/80 bg-white/5 ${accent.borderLeft} border-l-4`}>
                <p className="text-xs text-slate-500">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(((currentPage - 1) * PAGE_SIZE) + paginatedList.length, total)} of {total}
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
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
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
