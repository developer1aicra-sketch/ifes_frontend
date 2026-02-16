/**
 * Single source of truth for the auth token used in signup flow.
 * Token is received from POST /auth/signup/verify/otp and must be sent
 * as Authorization: Bearer <token> to POST /signup and other protected APIs.
 */
const TOKEN_KEY = 'token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
