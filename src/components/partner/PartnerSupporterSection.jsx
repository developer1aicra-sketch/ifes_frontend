import React, { useMemo } from 'react';
import {
  PartnerCarouselNav,
  partnerCarouselTrackClassName,
  partnerCarouselCardClassName,
} from './PartnerCarouselNav';

/** Logo dimensions (96x96) – centralised for consistent layout. */
const LOGO_SIZE = 96;

/**
 * Reusable Supporter section for Partner home.
 * Showcases supporters with name, logo, and clickable link to website.
 *
 * @param {object} props
 * @param {Array<{ _id: string, name: string, logo?: string, website?: string, isActive?: boolean }>} props.supporters - List of supporters
 * @param {string} [props.title] - Section heading
 * @param {string} [props.className] - Optional section wrapper class
 * @param {string} [props.carouselId] - Scroll container id for prev/next controls
 */
const PartnerSupporterSection = ({
  supporters = [],
  title = 'Our Supporters',
  className = '',
  carouselId = 'partner-supporters-carousel',
}) => {
  const activeSupporters = useMemo(
    () => (supporters || []).filter((s) => s && (s.isActive !== false)),
    [supporters]
  );

  if (activeSupporters.length === 0) return null;

  return (
    <section
      className={`py-16 bg-white border-t border-slate-100 ${className}`}
      aria-labelledby="partner-supporters-section-title"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 id="partner-supporters-section-title" className="text-3xl font-bold text-slate-900">
            {title}
          </h2>
          <PartnerCarouselNav
            carouselId={carouselId}
            prevAriaLabel="Previous supporters"
            nextAriaLabel="Next supporters"
          />
        </div>

        <div className="relative">
          <div id={carouselId} className={partnerCarouselTrackClassName}>
            {activeSupporters.map((supporter) => {
              const href = supporter.website || '#';
              const isExternal = href !== '#' && (href.startsWith('http://') || href.startsWith('https://'));

              return (
                <a
                  key={supporter._id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`${partnerCarouselCardClassName} flex flex-col items-center justify-center p-6 min-h-[180px] bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2`}
                  title={supporter.name}
                >
                  {supporter.logo ? (
                    <img
                      src={supporter.logo}
                      alt={supporter.name}
                      width={LOGO_SIZE}
                      height={LOGO_SIZE}
                      className="object-contain flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-slate-600 font-medium text-center line-clamp-2">
                      {supporter.name}
                    </span>
                  )}
                  {supporter.name && supporter.logo && (
                    <span className="mt-2 text-xs text-slate-500 line-clamp-1 text-center">
                      {supporter.name}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSupporterSection;
