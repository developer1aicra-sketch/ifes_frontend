import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Scale } from 'lucide-react';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import NewsArticleBody from '../NewsArticleBody';
import { PartnerCarouselNav, partnerCarouselTrackClassName, partnerCarouselCardClassName } from './PartnerCarouselNav';

const CATEGORY_CONFIG = {
  GENERAL: { label: 'General', icon: FileText, color: 'text-slate-600 bg-slate-100' },
  EVENT: { label: 'Event', icon: Calendar, color: 'text-blue-700 bg-blue-100' },
  REGULATION: { label: 'Regulation', icon: Scale, color: 'text-amber-700 bg-amber-100' },
  default: { label: 'General', icon: FileText, color: 'text-slate-600 bg-slate-100' },
};

/**
 * Reusable News section for Partner home.
 * Displays news items with title, description, image, and category in a card layout.
 *
 * @param {object} props
 * @param {Array<{ _id: string, title: string, description?: string, image?: string, type?: string, isActive?: boolean }>} props.news - List of news items
 * @param {string} [props.title] - Section heading
 * @param {(id: string) => void} [props.onNewsClick] - Callback when user clicks (legacy, use buildNewsPath for URL-based nav)
 * @param {(id: string) => string} [props.buildNewsPath] - Returns path for news detail (e.g. /news/:id or /AE/news/:id). When provided, uses NavLink for proper routing.
 * @param {string} [props.className] - Optional section wrapper class
 * @param {string} [props.carouselId] - Scroll container id for prev/next controls
 */
const PartnerNewsSection = ({
  news = [],
  title = 'News',
  onNewsClick,
  buildNewsPath,
  className = '',
  carouselId = 'partner-news-carousel',
}) => {
  const theme = useThemeClasses();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const activeNews = useMemo(
    () => (news || []).filter((n) => n && (n.isActive !== false)),
    [news]
  );

  const categories = useMemo(() => {
    const set = new Set(['ALL']);
    activeNews.forEach((n) => {
      const type = (n.type || 'GENERAL').toUpperCase();
      set.add(type);
    });
    return Array.from(set);
  }, [activeNews]);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'ALL') return activeNews;
    return activeNews.filter((n) => (n.type || 'GENERAL').toUpperCase() === activeCategory);
  }, [activeNews, activeCategory]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(carouselId);
    if (el) el.scrollTo({ left: 0, behavior: 'smooth' });
  }, [activeCategory, carouselId]);

  const getCategoryMeta = (type) => {
    const key = (type || 'GENERAL').toUpperCase();
    return CATEGORY_CONFIG[key] || CATEGORY_CONFIG.default;
  };

  if (activeNews.length === 0) return null;

  return (
    <section
      className={`py-16 bg-slate-50 border-t border-slate-100 ${className}`}
      aria-labelledby="partner-news-section-title"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 id="partner-news-section-title" className="text-3xl font-bold text-slate-900">
            {title}
          </h2>
          <PartnerCarouselNav
            carouselId={carouselId}
            prevAriaLabel="Previous news"
            nextAriaLabel="Next news"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isAll = cat === 'ALL';
            const label = isAll ? 'All' : (CATEGORY_CONFIG[cat]?.label ?? cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? theme.bgPrimary
                      ? `${theme.bgPrimary} text-white focus:ring-slate-400`
                      : 'bg-blue-600 text-white focus:ring-blue-400'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 focus:ring-slate-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <div id={carouselId} className={partnerCarouselTrackClassName}>
          {filteredNews.map((item) => {
            const meta = getCategoryMeta(item.type);
            const Icon = meta.icon;

            return (
              <article
                key={item._id}
                className={`${partnerCarouselCardClassName} bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col`}
              >
                {item.image && (
                  <div className="relative pt-[56.25%] bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}
                    >
                      <Icon size={12} />
                      {meta.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <div className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-grow overflow-hidden">
                      <NewsArticleBody html={item.description} variant="card" />
                    </div>
                  )}
                  {(buildNewsPath || onNewsClick) && (
                    buildNewsPath ? (
                      <NavLink
                        to={buildNewsPath(item._id)}
                        className={`mt-4 text-sm font-medium inline-flex items-center gap-1 self-start ${
                          theme.textPrimary ? `${theme.textPrimary} hover:underline` : 'text-blue-600 hover:underline'
                        }`}
                      >
                        Read more
                        <ArrowRight size={14} />
                      </NavLink>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNewsClick(item._id)}
                        className={`mt-4 text-sm font-medium inline-flex items-center gap-1 self-start ${
                          theme.textPrimary ? `${theme.textPrimary} hover:underline` : 'text-blue-600 hover:underline'
                        }`}
                      >
                        Read more
                        <ArrowRight size={14} />
                      </button>
                    )
                  )}
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerNewsSection;
