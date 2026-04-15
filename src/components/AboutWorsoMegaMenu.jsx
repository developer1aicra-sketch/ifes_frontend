import { Link } from 'react-router-dom';
import { ABOUT_NAV } from '../views/about/aboutRouteConfig';
import { splitMenuItemsIntoColumns } from '../utils/partnerAboutTabs';

/** Split 10 WORSO items into 4 + 3 + 3 */
const WORSO_COLUMN_COUNTS = [4, 3, 3];

function normalizePath(p) {
  return (p || '').replace(/\/$/, '') || '/';
}

export function getAboutWorsoColumns() {
  const columns = [];
  let start = 0;
  for (const n of WORSO_COLUMN_COUNTS) {
    columns.push(ABOUT_NAV.slice(start, start + n));
    start += n;
  }
  return columns;
}

function PartnerMegaColumns({
  partnerTabs,
  pathWithPrefix,
  pathname,
  search,
}) {
  const partnerAboutBase = pathWithPrefix('/about');
  const params = new URLSearchParams(search || '');
  const currentTab = params.get('tab');
  const columns = splitMenuItemsIntoColumns(partnerTabs, 3);

  const isPartnerTabActive = (tab) => {
    if (normalizePath(pathname) !== normalizePath(partnerAboutBase)) return false;
    if (currentTab) return currentTab === tab.id;
    return partnerTabs[0]?.id === tab.id;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-1">
      {columns.map((col, colIndex) => (
        <ul key={colIndex} className="space-y-0.5">
          {col.map((tab) => {
            const href = `${partnerAboutBase}?tab=${encodeURIComponent(tab.id)}`;
            const active = isPartnerTabActive(tab);
            return (
              <li key={tab.id}>
                <Link
                  to={href}
                  className={`block py-2.5 text-[13px] md:text-sm font-semibold tracking-wide transition-colors rounded-lg px-2 -mx-2 uppercase ${
                    active
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}

/**
 * @param {(path: string) => string} pathWithPrefix
 * @param {string} pathname
 * @param {string} [search] - `location.search` for `?tab=` active state
 * @param {boolean} [isRegionalChapter] - `/:XX/...` chapter site (partner About tabs)
 * @param {{ id: string, label: string }[]} [partnerTabs] - from `usePartnerAboutMegaMenuItems`
 * @param {boolean} [partnerNavLoading]
 */
export function AboutWorsoDesktopMegaMenu({
  pathWithPrefix,
  pathname,
  search = '',
  siteConfig,
  isRegionalChapter = false,
  partnerTabs = [],
  partnerNavLoading = false,
}) {
  const worsoColumns = getAboutWorsoColumns();
  const isPartnerTheme = Boolean(siteConfig?.is_partner) || isRegionalChapter;
  const titleClass = isPartnerTheme ? 'font-serif text-emerald-700' : 'font-serif text-red-700';
  const badgeClass = isPartnerTheme ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white';
  const headingText =
    isRegionalChapter && siteConfig?.logo_text
      ? String(siteConfig.logo_text)
      : isRegionalChapter
        ? 'About'
        : 'About WORSO';

  const isActive = (segment) => {
    const href = pathWithPrefix(`/about/${segment}`);
    return pathname === href || pathname.endsWith(`/${segment}`);
  };

  if (isRegionalChapter) {
    return (
      <div
        className="absolute bg-red-500 left-1/2 -translate-x-1/2 top-full z-[100] w-[min(calc(100vw-2rem),52rem)] pt-3
        opacity-0 invisible pointer-events-none translate-y-1
        group-hover/about:opacity-100 group-hover/about:visible group-hover/about:pointer-events-auto group-hover/about:translate-y-0
        group-focus-within/about:opacity-100 group-focus-within/about:visible group-focus-within/about:pointer-events-auto group-focus-within/about:translate-y-0
        transition-all duration-200 ease-out"
      >
        <div
          className={`rounded-[1.25rem] bg-white text-slate-800 shadow-2xl shadow-black/20 border border-slate-100/80 overflow-hidden ${
            partnerNavLoading ? 'opacity-90' : ''
          }`}
        >
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 flex flex-wrap items-center gap-3">
            <h2 className={`text-lg md:text-xl font-bold tracking-tight ${titleClass}`}>{headingText}</h2>
            {/* <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md ${badgeClass}`}>
              Chapter pages
            </span> */}
          </div>
          <div className="px-6 py-5 md:px-8 md:py-7">
            {partnerNavLoading ? (
              <p className="text-sm text-slate-500 py-2">Loading sections…</p>
            ) : (
              <PartnerMegaColumns
                partnerTabs={partnerTabs}
                pathWithPrefix={pathWithPrefix}
                pathname={pathname}
                search={search}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full z-[100] md:pl-56 w-[min(calc(100vw-2rem),52rem)] pt-3
        opacity-0 invisible pointer-events-none translate-y-1
        group-hover/about:opacity-100 group-hover/about:visible group-hover/about:pointer-events-auto group-hover/about:translate-y-0
        group-focus-within/about:opacity-100 group-focus-within/about:visible group-focus-within/about:pointer-events-auto group-focus-within/about:translate-y-0
        transition-all duration-200 ease-out"
    >
      <div className="rounded-[1.25rem] bg-white text-slate-800 shadow-2xl shadow-black/20 border border-slate-100/80 overflow-hidden">
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <h2 className={`text-lg md:text-xl font-bold tracking-tight ${titleClass}`}>About WORSO</h2>
          {/* <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md ${badgeClass}`}>
            All pages
          </span> */}
        </div>
        <div className="px-6 py-5 md:px-8 md:py-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-1">
            {worsoColumns.map((col, colIndex) => (
              <ul key={colIndex} className="space-y-0.5">
                {col.map(({ segment, label }) => {
                  const href = pathWithPrefix(`/about/${segment}`);
                  const active = isActive(segment);
                  return (
                    <li key={segment}>
                      <Link
                        to={href}
                        className={`block py-2.5 text-[13px] md:text-sm font-semibold tracking-wide transition-colors rounded-lg px-2 -mx-2 uppercase ${
                          active
                            ? 'text-red-700 bg-red-50'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile accordion — regional chapter shows partner tab links; else WORSO list.
 */
export function AboutWorsoMobileLinks({
  pathWithPrefix,
  pathname,
  search = '',
  onNavigate,
  siteConfig,
  isRegionalChapter = false,
  partnerTabs = [],
}) {
  const activeClass =
    Boolean(siteConfig?.is_partner) || isRegionalChapter
      ? 'text-emerald-400 bg-white/10'
      : 'text-red-300 bg-white/10';

  const partnerAboutBase = pathWithPrefix('/about');
  const params = new URLSearchParams(search || '');
  const currentTab = params.get('tab');

  const isPartnerTabActive = (tab) => {
    if (normalizePath(pathname) !== normalizePath(partnerAboutBase)) return false;
    if (currentTab) return currentTab === tab.id;
    return partnerTabs[0]?.id === tab.id;
  };

  const isActive = (segment) => {
    const href = pathWithPrefix(`/about/${segment}`);
    return pathname === href || pathname.endsWith(`/${segment}`);
  };

  if (isRegionalChapter) {
    return (
      <ul className="mt-1 mb-2 border-l-2 border-white/15 ml-2 pl-3 space-y-0.5">
        {partnerTabs.map((tab) => {
          const href = `${partnerAboutBase}?tab=${encodeURIComponent(tab.id)}`;
          return (
            <li key={tab.id}>
              <Link
                to={href}
                onClick={onNavigate}
                className={`block text-left py-2.5 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                  isPartnerTabActive(tab) ? activeClass : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="mt-1 mb-2 border-l-2 border-white/15 ml-2 pl-3 space-y-0.5">
      {ABOUT_NAV.map(({ segment, label }) => {
        const href = pathWithPrefix(`/about/${segment}`);
        return (
          <li key={segment}>
            <Link
              to={href}
              onClick={onNavigate}
              className={`block text-left py-2.5 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                isActive(segment) ? activeClass : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
