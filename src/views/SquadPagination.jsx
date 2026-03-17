import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_PAGE_SIZES = [6, 9, 12, 24];

/**
 * Reusable pagination for list views (e.g. My Squad).
 * Supports page navigation and optional page-size selector.
 *
 * @param {number} totalItems - Total number of items
 * @param {number} pageSize - Items per page
 * @param {number} currentPage - 1-based current page
 * @param {function(number)} onPageChange - Called with new page (1-based)
 * @param {string} [itemLabel='squads'] - Label for "X squads"
 * @param {number[]} [pageSizeOptions] - Options for items per page (e.g. [6, 9, 12])
 * @param {function(number)} [onPageSizeChange] - Called when page size changes (resets to page 1 upstream)
 */
export function SquadPagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  itemLabel = 'squads',
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  onPageSizeChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handlePrev = () => {
    if (safePage > 1) onPageChange(safePage - 1);
  };

  const handleNext = () => {
    if (safePage < totalPages) onPageChange(safePage + 1);
  };

  const showPageNum = (page) =>
    page === 1 ||
    page === totalPages ||
    (page >= safePage - 1 && page <= safePage + 1);

  const showEllipsis = (page) =>
    (page === safePage - 2 || page === safePage + 2) && totalPages > 5;

  if (totalItems === 0) return null;

  return (
    <div
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 "
      role="navigation"
      aria-label={`Pagination for ${itemLabel}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-400">
          Showing{' '}
          <span className="text-white font-medium">{startIndex + 1}</span>
          {' – '}
          <span className="text-white font-medium">{endIndex}</span>
          {' of '}
          <span className="text-white font-medium">{totalItems}</span>{' '}
          {itemLabel}
        </span>
        {onPageSizeChange && pageSizeOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="squad-page-size" className="text-sm text-slate-400">
              Per page
            </label>
            <select
              id="squad-page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 outline-none"
              aria-label="Items per page"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={safePage <= 1}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-400"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1" role="group" aria-label="Page numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (showEllipsis(page)) {
                return (
                  <span key={`ellipsis-${page}`} className="px-2 text-slate-500" aria-hidden>
                    …
                  </span>
                );
              }
              if (!showPageNum(page)) return null;

              const isActive = page === safePage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`min-w-[2.25rem] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white border border-purple-500'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-purple-500'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={safePage >= totalPages}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-400"
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SquadPagination;
