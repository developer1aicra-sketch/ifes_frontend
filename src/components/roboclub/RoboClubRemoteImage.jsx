import { useCallback, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Remote hero/thumbnail with graceful failure — several stock CDNs return 404 over time.
 * Use default cross-origin referrer (not `no-referrer`) so Unsplash/Wikimedia accept the request.
 */
export function RoboClubRemoteImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500 ${className}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <ImageOff className="w-10 h-10 opacity-40 shrink-0" strokeWidth={1.5} aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="strict-origin-when-cross-origin"
      onError={onError}
    />
  );
}
