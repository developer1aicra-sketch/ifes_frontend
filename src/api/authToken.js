/**
 * Auth token storage is panel-specific.
 *
 * - Member portal uses localStorage key `token` (backward compatible).
 * - RoboClub uses a separate key so member + roboclub can be logged in independently.
 */
const MEMBER_TOKEN_KEY = 'token';
export const ROBOCLUB_TOKEN_KEY = 'worso_roboclub_auth';

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

// Member token helpers (backward compatible)
export function getAuthToken() {
  const storage = getStorage();
  return storage ? storage.getItem(MEMBER_TOKEN_KEY) : null;
}

export function setAuthToken(token) {
  const storage = getStorage();
  if (!storage) return;
  if (token) storage.setItem(MEMBER_TOKEN_KEY, token);
  else storage.removeItem(MEMBER_TOKEN_KEY);
}

export function clearAuthToken() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(MEMBER_TOKEN_KEY);
}

// RoboClub token helpers
export function getRoboclubAuthToken() {
  const storage = getStorage();
  return storage ? storage.getItem(ROBOCLUB_TOKEN_KEY) : null;
}

export function setRoboclubAuthToken(token) {
  const storage = getStorage();
  if (!storage) return;
  if (token) storage.setItem(ROBOCLUB_TOKEN_KEY, token);
  else storage.removeItem(ROBOCLUB_TOKEN_KEY);
}

export function clearRoboclubAuthToken() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(ROBOCLUB_TOKEN_KEY);
}

/**
 * Returns the Authorization header object for API requests.
 * Use this in axios interceptors and fetch wrappers for consistent Bearer token injection.
 * @returns {{ Authorization?: string }} Header object; empty if no token.
 */
export function getAuthHeader() {
  // Attach correct bearer token based on the active panel route.
  const path = typeof window !== 'undefined' ? (window.location?.pathname || '').toLowerCase() : '';
  const token = path.includes('roboclub') ? getRoboclubAuthToken() : getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
