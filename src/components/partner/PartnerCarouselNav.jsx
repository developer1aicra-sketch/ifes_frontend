import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PARTNER_CAROUSEL_SCROLL_PX = 400;

/** Button styles — keep in sync across partner home carousels (Videos, Competitions, News). */
export const partnerCarouselNavButtonClassName =
  'p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300';

/** Horizontal track — matches `PartnerVideoSection` scroll/snap behavior. */
export const partnerCarouselTrackClassName =
  'flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory gap-6 md:gap-8';

/** Fixed card width inside partner carousels. */
export const partnerCarouselCardClassName =
  'flex-shrink-0 w-full sm:w-[320px] md:w-[360px] snap-start';

export function scrollPartnerCarouselById(carouselId, direction) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById(carouselId);
  if (!container) return;
  const amount = PARTNER_CAROUSEL_SCROLL_PX;
  container.scrollBy({ left: direction === 'prev' ? -amount : amount, behavior: 'smooth' });
}

/**
 * Shared prev/next controls for partner home horizontal carousels.
 *
 * @param {object} props
 * @param {string} props.carouselId - `id` on the scrollable track element
 * @param {string} props.prevAriaLabel
 * @param {string} props.nextAriaLabel
 */
export function PartnerCarouselNav({ carouselId, prevAriaLabel, nextAriaLabel }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          scrollPartnerCarouselById(carouselId, 'prev');
        }}
        className={partnerCarouselNavButtonClassName}
        aria-label={prevAriaLabel}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          scrollPartnerCarouselById(carouselId, 'next');
        }}
        className={partnerCarouselNavButtonClassName}
        aria-label={nextAriaLabel}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
