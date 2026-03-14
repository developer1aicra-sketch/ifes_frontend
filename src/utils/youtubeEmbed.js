/**
 * Extracts YouTube video ID from various URL formats for embedding.
 * Supports: watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 * @param {string} url - YouTube URL (e.g. https://www.youtube.com/watch?v=VIDEO_ID)
 * @returns {string|null} Video ID or null if invalid
 */
export function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  // youtu.be/ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?|$)/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/embed/ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  // youtube.com/watch?v=ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  return null;
}

/**
 * Builds YouTube embed URL for iframe src.
 * @param {string} videoId - YouTube video ID
 * @param {object} params - Optional query params (e.g. start, rel)
 * @returns {string} Embed URL
 */
export function getYouTubeEmbedUrl(videoId, params = {}) {
  if (!videoId) return '';
  const search = new URLSearchParams(params).toString();
  return `https://www.youtube.com/embed/${videoId}${search ? `?${search}` : ''}`;
}
