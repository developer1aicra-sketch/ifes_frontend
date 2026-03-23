import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { ArrowLeft, Calendar, Tag, ChevronRight } from 'lucide-react';
import { usePartnerHome } from '../hooks/usePartnerHome';

/** Normalize partner API news item to NewsArticleView shape */
const normalizePartnerNews = (item) => ({
  id: item._id,
  title: item.title,
  body: item.description,
  desc: item.description,
  category: (item.type || 'GENERAL').toUpperCase(),
  date: item.Date ? new Date(item.Date).toLocaleDateString() : new Date().toLocaleDateString(),
  featuredImage: item.image,
});

const NewsArticleView = ({ articleId, setView, newsItems = [], newsLoading, newsError, locationCode = null }) => {
  void motion;
  const { data: partnerHomeData, loading: partnerLoading } = usePartnerHome(locationCode);

  const safeItems = useMemo(() => newsItems.filter(Boolean), [newsItems]);
  const partnerItems = useMemo(() => {
    if (!partnerHomeData?.news?.length) return [];
    return partnerHomeData.news
      .filter((n) => n && (n.isActive !== false))
      .map(normalizePartnerNews);
  }, [partnerHomeData?.news]);

  const mergedItems = useMemo(
    () => (locationCode && partnerItems.length > 0 ? [...partnerItems, ...safeItems] : safeItems),
    [locationCode, partnerItems, safeItems]
  );

  const article = useMemo(() => {
    return mergedItems.find(
      (item) => String(item.id) === String(articleId) || String(item._id) === String(articleId)
    ) ?? null;
  }, [mergedItems, articleId]);

  const relatedNews = useMemo(
    () => mergedItems.filter((item) => String(item.id) !== String(articleId) && String(item._id) !== String(articleId)).slice(0, 4),
    [mergedItems, articleId]
  );

  useEffect(() => {
    if (!article) return;
    try {
      const raw = localStorage.getItem('news_reads');
      const counts = raw ? JSON.parse(raw) : {};
      const id = article.id ?? article._id;
      counts[id] = (counts[id] || 0) + 1;
      localStorage.setItem('news_reads', JSON.stringify(counts));
    } catch {
      void 0;
    }
  }, [article?.id, article?._id]);

  if ((newsLoading || (locationCode && partnerLoading)) && !article) {
    return (
      <div className="animate-fadeIn pt-20 sm:pt-24 pb-20 bg-[#0a0f1a] min-h-screen flex items-center justify-center text-slate-400">
        Loading article…
      </div>
    );
  }

  if (!article) {
    return (
      <div className="animate-fadeIn pt-20 sm:pt-24 pb-20 bg-[#0a0f1a] min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 mb-4">{newsError || 'Article not found.'}</p>
        <button onClick={() => setView('home')} className="text-blue-400 font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to News
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 bg-[#0a0f1a] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to News</span>
        </button>

        <article className="mb-16">
          {/* Banner Image - Full Width */}
          {article.featuredImage && (
            <div className="w-full mb-10 overflow-hidden rounded-2xl shadow-xl">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-[250px] md:h-[450px] object-cover"
              />
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
                <Tag size={14} />
                {article.category}
              </span>
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={14} />
                {article.date}
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 md:mb-8 leading-tight">
              {article.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 mb-8">
              {article.contentHtml ? (
                <div 
                  className="prose prose-lg max-w-none" 
                  dangerouslySetInnerHTML={{ 
                    __html: article.contentHtml 
                      .replace(/<img[^>]*>/g, '') // Remove any remaining images
                      .replace(/<h1[^>]*>.*<\/h1>/g, '') // Remove any h1 tags
                  }} 
                />
              ) : (
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">{article.body || article.desc}</p>
                </div>
              )}
            </div>

            {/* Read More Link */}
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-lg"
              >
                Read More
                <ChevronRight size={16} />
              </a>
            )}
          </div>
        </article>

        <div className="border-t border-slate-200 pt-12">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold text-white">Related News</h2>
            <ChevronRight size={20} className="text-slate-400" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedNews.map((news) => (
              <motion.article
                key={news.id}
                onClick={() => setView(`news-${news.id}`)}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-slate-600 uppercase">{news.category}</span>
                  <span className="text-xs text-slate-400">{news.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-blue-400 transition-colors">{news.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{news.body || news.desc}</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setView(`news-${news.id}`);
                  }}
                  className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
                >
                  Continue Reading
                  <ChevronRight size={14} />
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsArticleView;

