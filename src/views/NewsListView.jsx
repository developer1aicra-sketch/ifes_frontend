import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Calendar, Tag } from 'lucide-react';

const sortByDateDesc = (items) => {
  return [...items].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};

const getReadCounts = () => {
  try {
    const raw = localStorage.getItem('news_reads');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const NewsListView = ({ type, setView, newsItems = [], newsLoading, newsError }) => {
  const safeItems = useMemo(() => newsItems.filter(Boolean), [newsItems]);

  const items = useMemo(() => {
    if (safeItems.length === 0) return [];
    if (type === 'headline') {
      return safeItems.slice(0, 5);
    }
    if (type === 'latest') {
      return sortByDateDesc(safeItems);
    }
    if (type === 'most') {
      const counts = getReadCounts();
      const withCounts = safeItems.map((n) => ({ ...n, _reads: counts[n.id] || 0 }));
      const sorted = withCounts.sort((a, b) => b._reads - a._reads);
      return sorted;
    }
    return safeItems;
  }, [type, safeItems]);

  const title = type === 'headline' ? 'Headline' : type === 'latest' ? 'Latest News' : type === 'most' ? 'Most Read' : 'News';

  return (
    <div className="animate-fadeIn pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to News</span>
        </button>

        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
          <ChevronRight size={20} className="text-slate-400" />
        </div>

        {newsLoading && <div className="text-sm text-slate-500 mb-4">Loading fresh stories…</div>}
        {newsError && <div className="text-sm text-red-500 mb-4">{newsError}</div>}

        <div className="grid md:grid-cols-2 gap-6">
          {items.length === 0 && !newsLoading && <div className="text-sm text-slate-500">No news to show right now.</div>}
          {items.map((news) => (
            <motion.article
              key={`${type}-${news.id}`}
              onClick={() => setView(`news-${news.id}`)}
              className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group bg-white"
              whileHover={{ y: -4 }}
            >
              {news.featuredImage && (
                <div className="rounded-lg overflow-hidden shadow-sm mb-4">
                  <img src={news.featuredImage} alt={news.title} className="w-full h-40 object-cover" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                  <Tag size={14} /> {news.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={14} /> {news.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {news.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">{news.body || news.desc}</p>
              <button
                onClick={() => setView(`news-${news.id}`)}
                className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
              >
                Continue Reading
                <ChevronRight size={14} />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsListView;
