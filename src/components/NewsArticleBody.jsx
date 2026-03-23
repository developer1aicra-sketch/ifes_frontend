/**
 * Renders news article HTML content with professional typography.
 * Handles h1–h3, paragraphs, lists, blockquotes, links, and bold/italic.
 */
const NewsArticleBody = ({
  html,
  variant = 'article', // 'article' | 'card'
  className = '',
}) => {
  if (!html || typeof html !== 'string') return null;

  // Strip duplicate h1 (article title is shown separately), and stray images
  let sanitized = html
    .replace(/<img[^>]*>/gi, '')
    .replace(/<h1[^>]*>.*?<\/h1>/gi, '');

  const isCard = variant === 'card';

  const articleClasses =
    'text-slate-300 leading-relaxed [&_strong]:font-semibold [&_strong]:text-white/95 [&_em]:italic ' +
    '[&_p]:mb-4 [&_p]:leading-[1.75] [&_p:last-child]:mb-0 ' +
    '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:first:mt-0 ' +
    '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-3 ' +
    '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2 ' +
    '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2 ' +
    '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-2 ' +
    '[&_li]:leading-relaxed [&_li_p]:mb-0 [&_li_p]:inline ' +
    '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/60 [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:bg-slate-800/40 [&_blockquote]:rounded-r-lg ' +
    '[&_a]:text-blue-400 [&_a]:hover:text-blue-300 [&_a]:underline [&_a]:break-words ' +
    '[&_br]:block [&_br]:content-[""] [&_br]:mb-2';

  const cardClasses =
    'text-sm text-slate-600 [&_p]:my-0.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_a]:text-blue-600 [&_a]:hover:underline [&_blockquote]:border-l-2 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:my-1 [&_blockquote]:italic [&_blockquote]:text-slate-500';

  const classes = isCard ? cardClasses : articleClasses;

  return (
    <div
      className={`${classes} ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

/** Strip HTML tags for plain-text preview (e.g. related news cards) */
export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

export default NewsArticleBody;
