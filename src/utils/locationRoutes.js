/**
 * Location-prefixed route utilities.
 * When user is on /AE, all pages should be /AE/membership, /AE/teams, etc.
 */

const KNOWN_NON_LOCATION_SEGMENTS = [
  'teams', 'technoxian', 'roboclub', 'about', 'governance',
  'associates', 'careers', 'partners', 'membership', 'login',
  'staff-login', 'login-partner-admin', 'member-dashboard',
  'admin-dashboard', 'privacy-policy', 'terms-of-use', 'news',
];

/**
 * Returns true if the first path segment is a 2-letter location code (e.g. AE, CL).
 */
export const isLocationRoute = (pathname) => {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment || segment.length !== 2) return false;
  if (!/^[A-Z]{2}$/i.test(segment)) return false;
  return !KNOWN_NON_LOCATION_SEGMENTS.includes(segment.toLowerCase());
};

/**
 * Get location prefix from pathname (e.g. "/AE" for "/AE" or "/AE/membership").
 * Returns "" when not on a location route.
 */
export const getLocationPrefix = (pathname) => {
  if (!pathname || pathname === '/') return '';
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment || segment.length !== 2) return '';
  if (!/^[A-Z]{2}$/i.test(segment)) return '';
  if (KNOWN_NON_LOCATION_SEGMENTS.includes(segment.toLowerCase())) return '';
  return `/${segment.toUpperCase()}`;
};

/**
 * Get location code from pathname (e.g. "AE" for "/AE/membership").
 */
export const getLocationCodeFromPath = (pathname) => {
  const prefix = getLocationPrefix(pathname);
  return prefix ? prefix.slice(1) : null;
};

/**
 * Build path with location prefix when applicable.
 * pathWithLocationPrefix("/AE", "/membership") => "/AE/membership"
 * pathWithLocationPrefix("", "/membership") => "/membership"
 */
export const pathWithLocationPrefix = (locationPrefix, path) => {
  if (!locationPrefix) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${locationPrefix}/${cleanPath}` : locationPrefix;
};
