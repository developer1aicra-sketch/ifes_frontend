import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '../../utils/youtubeEmbed';
import { useThemeClasses } from '../../hooks/useThemeClasses';

/**
 * Reusable Video section for Partner home.
 * Displays videos with title and embedded YouTube player in a responsive layout.
 *
 * @param {object} props
 * @param {Array<{ _id: string, title: string, youtubeUrl: string, thumbnail?: string, isActive?: boolean }>} props.videos - List of video items
 * @param {string} [props.title] - Section heading
 * @param {string} [props.className] - Optional section wrapper class
 * @param {string} [props.carouselId] - Optional carousel container id (for multiple sections)
 */
const PartnerVideoSection = ({ videos = [], title = 'Latest Videos', className = '', carouselId = 'partner-video-carousel' }) => {
  const theme = useThemeClasses();

  const activeVideos = useMemo(() => {
    const list = (videos || []).filter(
      (v) => v && (typeof v === 'string' ? v.trim() : v.isActive !== false)
    );
    return list.map((v, i) =>
      typeof v === 'string'
        ? { youtubeUrl: v.trim(), title: '', _id: `yt-${i}` }
        : { ...v, _id: v._id || v.youtubeUrl || `yt-${i}` }
    );
  }, [videos]);

  const scrollCarousel = (direction) => {
    const container = document.getElementById(carouselId);
    if (!container) return;
    const amount = 400;
    container.scrollBy({ left: direction === 'prev' ? -amount : amount, behavior: 'smooth' });
  };

  if (activeVideos.length === 0) return null;

  return (
    <section
      className={`py-16 bg-white border-t border-slate-100 ${className}`}
      aria-labelledby="partner-video-section-title"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 id="partner-video-section-title" className="text-3xl font-bold text-slate-900">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollCarousel('prev');
              }}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
              aria-label="Previous videos"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                scrollCarousel('next');
              }}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
              aria-label="Next videos"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            id={carouselId}
            className="flex overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory gap-6 md:gap-8"
          >
            {activeVideos.map((video) => {
              const videoId = getYouTubeVideoId(video.youtubeUrl);
              const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null;

              return (
                <article
                  key={video._id}
                  className="flex-shrink-0 w-full sm:w-[320px] md:w-[360px] snap-start bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative pt-[56.25%] bg-slate-100 overflow-hidden">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={video.title || 'Video'}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <a
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-600 group"
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                            <Play className={`ml-1 ${theme.textPrimary || 'text-blue-600'}`} size={28} fill="currentColor" />
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                  {/* <div className="p-5">
                    <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 leading-tight">
                      {video.title}
                    </h3>
                  </div> */}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerVideoSection;
