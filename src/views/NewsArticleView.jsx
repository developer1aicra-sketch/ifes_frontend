// import { motion } from 'framer-motion';
// import { useEffect, useMemo } from 'react';
// import { ArrowLeft, Calendar, Tag, ChevronRight } from 'lucide-react';
// import { usePartnerHome } from '../hooks/usePartnerHome';
// import NewsArticleBody, { stripHtml } from '../components/NewsArticleBody';

// /** Normalize partner API news item to NewsArticleView shape */
// const normalizePartnerNews = (item) => ({
//   id: item._id,
//   title: item.title,
//   body: item.description,
//   desc: item.description,
//   category: (item.type || 'GENERAL').toUpperCase(),
//   date: item.Date ? new Date(item.Date).toLocaleDateString() : new Date().toLocaleDateString(),
//   featuredImage: item.image,
// });

// const NewsArticleView = ({ articleId, setView, newsItems = [], newsLoading, newsError, locationCode = null }) => {
//   void motion;
//   const { data: partnerHomeData, loading: partnerLoading } = usePartnerHome(locationCode);

//   const safeItems = useMemo(() => newsItems.filter(Boolean), [newsItems]);
//   const partnerItems = useMemo(() => {
//     if (!partnerHomeData?.news?.length) return [];
//     return partnerHomeData.news
//       .filter((n) => n && (n.isActive !== false))
//       .map(normalizePartnerNews);
//   }, [partnerHomeData?.news]);

//   const mergedItems = useMemo(
//     () => (locationCode && partnerItems.length > 0 ? [...partnerItems, ...safeItems] : safeItems),
//     [locationCode, partnerItems, safeItems]
//   );

//   const article = useMemo(() => {
//     return mergedItems.find(
//       (item) => String(item.id) === String(articleId) || String(item._id) === String(articleId)
//     ) ?? null;
//   }, [mergedItems, articleId]);

//   const relatedNews = useMemo(
//     () => mergedItems.filter((item) => String(item.id) !== String(articleId) && String(item._id) !== String(articleId)).slice(0, 4),
//     [mergedItems, articleId]
//   );

//   useEffect(() => {
//     if (!article) return;
//     try {
//       const raw = localStorage.getItem('news_reads');
//       const counts = raw ? JSON.parse(raw) : {};
//       const id = article.id ?? article._id;
//       counts[id] = (counts[id] || 0) + 1;
//       localStorage.setItem('news_reads', JSON.stringify(counts));
//     } catch {
//       void 0;
//     }
//   }, [article?.id, article?._id]);

//   if ((newsLoading || (locationCode && partnerLoading)) && !article) {
//     return (
//       <div className="animate-fadeIn pt-20 sm:pt-24 pb-20 bg-[#0a0f1a] min-h-screen flex items-center justify-center text-slate-400">
//         Loading article…
//       </div>
//     );
//   }

//   if (!article) {
//     return (
//       <div className="animate-fadeIn pt-20 sm:pt-24 pb-20 bg-[#0a0f1a] min-h-screen flex flex-col items-center justify-center text-center">
//         <p className="text-slate-400 mb-4">{newsError || 'Article not found.'}</p>
//         <button onClick={() => setView('home')} className="text-blue-400 font-semibold hover:underline flex items-center gap-2">
//           <ArrowLeft size={16} /> Back to News
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fadeIn pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 bg-[#0a0f1a] min-h-screen">
//       <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
//         <button
//           onClick={() => setView('home')}
//           className="flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-6 sm:mb-8 transition-colors"
//         >
//           <ArrowLeft size={18} />
//           <span className="font-medium">Back to News</span>
//         </button>

//         <article className="mb-16">
//           {/* Banner Image - Full Width */}
//           {article.featuredImage && (
//             <div className="w-full mb-10 overflow-hidden rounded-2xl shadow-xl">
//               <img
//                 src={article.featuredImage}
//                 alt={article.title}
//                 className="w-full h-[250px] md:h-[450px] object-cover"
//               />
//             </div>
//           )}

//           <div className="max-w-4xl mx-auto">
//             {/* Article Meta */}
//             <div className="flex items-center gap-4 mb-6">
//               <span className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
//                 <Tag size={14} />
//                 {article.category}
//               </span>
//               <span className="flex items-center gap-2 text-xs text-slate-400">
//                 <Calendar size={14} />
//                 {article.date}
//               </span>
//             </div>

//             {/* Article Title */}
//             <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 md:mb-8 leading-tight">
//               {article.title}
//             </h1>

//             {/* Article Content */}
//             <div className="prose prose-invert prose-lg max-w-none mb-8">
//               {(() => {
//                 const content = article.contentHtml || article.body || article.desc || '';
//                 const isHtml = typeof content === 'string' && content.trim().includes('<');
//                 if (!content) return null;
//                 if (isHtml) {
//                   return <NewsArticleBody html={content} variant="article" className="text-base sm:text-lg" />;
//                 }
//                 return <p className="text-lg leading-relaxed text-slate-300">{content}</p>;
//               })()}
//             </div>

//             {/* Read More Link */}
//             {article.link && (
//               <a
//                 href={article.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-lg"
//               >
//                 Read More
//                 <ChevronRight size={16} />
//               </a>
//             )}
//           </div>
//         </article>

//         <div className="border-t border-slate-200 pt-12">
//           <div className="flex items-center gap-2 mb-8">
//             <h2 className="text-2xl font-bold text-white">Related News</h2>
//             <ChevronRight size={20} className="text-slate-400" />
//           </div>
//           <div className="grid md:grid-cols-2 gap-6">
//             {relatedNews.map((news) => (
//               <motion.article
//                 key={news.id}
//                 onClick={() => setView(`news-${news.id}`)}
//                 className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
//                 whileHover={{ y: -4 }}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <span className="text-xs font-bold text-slate-600 uppercase">{news.category}</span>
//                   <span className="text-xs text-slate-400">{news.date}</span>
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-blue-400 transition-colors">{news.title}</h3>
//                 <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">
//                   {(() => {
//                     const raw = news.body || news.desc || '';
//                     return typeof raw === 'string' && raw.includes('<') ? stripHtml(raw) : raw;
//                   })()}
//                 </p>
//                 <a
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setView(`news-${news.id}`);
//                   }}
//                   className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1"
//                 >
//                   Continue Reading
//                   <ChevronRight size={14} />
//                 </a>
//               </motion.article>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsArticleView;



// api code latest
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Tag, ChevronRight, ExternalLink } from 'lucide-react';
import { usePartnerHome } from '../hooks/usePartnerHome';
import NewsArticleBody, { stripHtml } from '../components/NewsArticleBody';
import axios from 'axios';

/** Normalize partner API news item to NewsArticleView shape */
const normalizePartnerNews = (item) => ({
  id: item._id,
  title: item.title,
  body: item.description,
  desc: item.description,
  category: (item.type || 'GENERAL').toUpperCase(),
  date: item.Date ? new Date(item.Date).toLocaleDateString() : new Date().toLocaleDateString(),
  featuredImage: item.image,
  source: 'partner',
});

/** Normalize ESCOM API news item from list or single endpoint */
const normalizeEscomNews = (item) => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  body: item.content?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
  desc: item.content?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
  contentHtml: item.content || '',
  category: item.categories?.[0] || 'ESCOM',
  date: item.date,
  featuredImage: item.featured_image,
  link: item.link,
  source: 'escom',
});

const NewsArticleView = ({ articleId, setView, newsItems = [], newsLoading, newsError, locationCode = null }) => {
  void motion;
  const { data: partnerHomeData, loading: partnerLoading } = usePartnerHome(locationCode);
  
  // ESCOM state
  const [escomArticle, setEscomArticle] = useState(null);
  const [escomLoading, setEscomLoading] = useState(false);
  const [escomError, setEscomError] = useState(null);
  const [escomNewsList, setEscomNewsList] = useState([]);

  const safeItems = useMemo(() => newsItems.filter(Boolean), [newsItems]);
  const partnerItems = useMemo(() => {
    if (!partnerHomeData?.news?.length) return [];
    return partnerHomeData.news
      .filter((n) => n && (n.isActive !== false))
      .map(normalizePartnerNews);
  }, [partnerHomeData?.news]);

  // Fetch ESCOM news list on mount
  useEffect(() => {
    const fetchEscomNewsList = async () => {
      try {
        const response = await axios.get('https://app.aicra.org/api/escomapi/escom-news-feed.php');
        if (response.data && response.data.status === true && response.data.posts) {
          const normalizedList = response.data.posts.map(normalizeEscomNews);
          setEscomNewsList(normalizedList);
        }
      } catch (err) {
        console.error('Failed to fetch ESCOM news list:', err);
      }
    };
    fetchEscomNewsList();
  }, []);

  // Check if articleId belongs to ESCOM (numeric ID that exists in ESCOM list)
  const escomArticleFromList = useMemo(() => {
    if (!articleId || !escomNewsList.length) return null;
    return escomNewsList.find(item => String(item.id) === String(articleId));
  }, [articleId, escomNewsList]);

  const isEscomArticle = !!escomArticleFromList;

  // Fetch ESCOM single article using slug when needed
  useEffect(() => {
    if (!isEscomArticle || !escomArticleFromList?.slug) return;
    
    const fetchEscomArticle = async () => {
      setEscomLoading(true);
      setEscomError(null);
      try {
        const response = await axios.get('https://app.aicra.org/api/escomapi/escom-news-feed-single.php', {
          params: { slug: escomArticleFromList.slug }
        });
        
        if (response.data && response.data.status === true && response.data.post) {
          setEscomArticle(normalizeEscomNews(response.data.post));
        } else {
          throw new Error(response.data.message || 'Article not found');
        }
      } catch (err) {
        console.error('Failed to fetch ESCOM article:', err);
        setEscomError(err.message || 'Failed to load article');
      } finally {
        setEscomLoading(false);
      }
    };
    
    fetchEscomArticle();
  }, [isEscomArticle, escomArticleFromList?.slug]);

  // Merge all news items for related news
  const allNewsItems = useMemo(() => {
    const items = [...partnerItems, ...safeItems];
    if (escomNewsList.length > 0) {
      return [...items, ...escomNewsList];
    }
    return items;
  }, [partnerItems, safeItems, escomNewsList]);

  // Get article from local sources (partner or props) - for non-ESCOM articles
  const localArticle = useMemo(() => {
    if (isEscomArticle) return null;
    return allNewsItems.find(
      (item) => String(item.id) === String(articleId) || String(item._id) === String(articleId)
    ) ?? null;
  }, [allNewsItems, articleId, isEscomArticle]);

  // Final article: ESCOM API result or local article
  const article = isEscomArticle ? escomArticle : localArticle;

  // Related news from all items (excluding current article)
  const relatedNews = useMemo(() => {
    if (!article) return [];
    return allNewsItems
      .filter((item) => {
        const itemId = String(item.id || item._id);
        const currentId = isEscomArticle ? String(article.id) : String(articleId);
        return itemId !== currentId;
      })
      .slice(0, 4);
  }, [allNewsItems, article, articleId, isEscomArticle]);

  // Track read count for local articles only
  useEffect(() => {
    if (!article || isEscomArticle) return;
    try {
      const raw = localStorage.getItem('news_reads');
      const counts = raw ? JSON.parse(raw) : {};
      const id = article.id ?? article._id;
      counts[id] = (counts[id] || 0) + 1;
      localStorage.setItem('news_reads', JSON.stringify(counts));
    } catch {
      void 0;
    }
  }, [article?.id, article?._id, isEscomArticle]);

  // Loading states
  const isLoading = (newsLoading || (locationCode && partnerLoading)) && !localArticle && !isEscomArticle;
  const isEscomLoadingState = isEscomArticle && escomLoading;
  
  if ((isLoading || isEscomLoadingState) && !article) {
    return (
      <div className="animate-fadeIn pt-20 sm:pt-24 pb-20 bg-[#0a0f1a] min-h-screen flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  // Error states
  if ((!article && !isLoading && !isEscomLoadingState) || (isEscomArticle && escomError)) {
    return (
      <div className="animate-fadeIn pt-20 sm:pt-24 pb-20 bg-[#0a0f1a] min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 mb-4">{escomError || newsError || 'Article not found.'}</p>
        <button onClick={() => setView('home')} className="text-cyan-400 font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to News
        </button>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="animate-fadeIn pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 bg-[#0a0f1a] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 sm:mb-8 transition-colors"
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
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
                <Tag size={14} />
                {article.category}
              </span>
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={14} />
                {article.date}
              </span>
              {article.source === 'escom' && (
                <span className="flex items-center gap-2 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                  ESCOM News
                </span>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 md:mb-8 leading-tight">
              {article.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-8">
              {(() => {
                // Prioritize contentHtml for ESCOM articles
                const content = article.contentHtml || article.body || article.desc || '';
                const isHtml = typeof content === 'string' && (content.trim().includes('<') || content.trim().includes('&lt;'));
                if (!content) return <p className="text-slate-400 italic">No content available.</p>;
                if (isHtml) {
                  return <NewsArticleBody html={content} variant="article" className="text-base sm:text-lg" />;
                }
                return <p className="text-lg leading-relaxed text-slate-300">{content}</p>;
              })()}
            </div>

            {/* Read More Link - Only for ESCOM external articles */}
            {article.link && article.source === 'escom' && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors text-lg"
              >
                Read Full Article on FutureTech Media
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </article>

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <div className="border-t border-slate-800 pt-12">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-2xl font-bold text-white">Related News</h2>
              <ChevronRight size={20} className="text-slate-400" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedNews.map((news) => (
                <motion.article
                  key={news.id || news._id}
                  onClick={() => {
                    // Use ID for navigation (works for both ESCOM and partner)
                    // The component will detect and fetch appropriately
                    setView(`news-${news.id || news._id}`);
                  }}
                  className="border border-slate-800 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group bg-slate-900/50 backdrop-blur-sm"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs font-bold text-cyan-400 uppercase">{news.category}</span>
                    <span className="text-xs text-slate-500">{news.date}</span>
                    {news.source === 'escom' && (
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-full">ESCOM</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-2">
                    {(() => {
                      const raw = news.body || news.desc || '';
                      return typeof raw === 'string' && raw.includes('<') ? stripHtml(raw) : raw;
                    })()}
                  </p>
                  <button className="text-sm text-cyan-400 font-medium hover:underline inline-flex items-center gap-1">
                    Continue Reading
                    <ChevronRight size={14} />
                  </button>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsArticleView;
