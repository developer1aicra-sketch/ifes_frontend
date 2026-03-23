import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';

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
 */
const PartnerSupporterSection = ({
  supporters = [],
  title = 'Our Supporters',
  className = '',
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
        <h2
          id="partner-supporters-section-title"
          className="text-3xl font-bold text-slate-900 mb-8 text-center"
        >
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 items-stretch justify-items-center">
          {activeSupporters.map((supporter) => {
            const href = supporter.website || '#';
            const isExternal = href !== '#' && (href.startsWith('http://') || href.startsWith('https://'));

            return (
              <a
                key={supporter._id}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center justify-center p-6 w-full min-h-[180px] bg-white rounded-xl hover:shadow-md hover:border-slate-300 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
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
                {/* {isExternal && (
                  <ExternalLink
                    className="mt-2 w-4 h-4 text-slate-400 flex-shrink-0"
                    size={16}
                    aria-hidden
                  />
                )} */}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnerSupporterSection;
