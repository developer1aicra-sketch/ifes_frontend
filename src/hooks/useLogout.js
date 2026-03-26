import { useCallback } from 'react';
import { partnerLogout, clearPartnerAuth, getPartnerAuth } from '../utils/api';
import { clearAuthToken } from '../api/authToken';

/**
 * Shared logout hook for Partner/Admin and Member portals.
 * Clears local auth state and optionally calls server logout API.
 *
 * @param {Object} options
 * @param {Function} [options.setUser] - Callback to clear user state (e.g. setUser(null))
 * @param {Function} [options.setView] - Callback to navigate after logout (e.g. setView('partner-login'))
 * @param {'partner'|'member'} [options.type='partner'] - Auth type: partner calls API, member clears local only
 * @param {string} [options.redirectView] - View to navigate after logout (default: 'home' for member, 'partner-login' for partner)
 * @returns {{ logout: Function }}
 */
export const useLogout = ({ setUser, setView, type = 'partner', redirectView } = {}) => {
  const defaultRedirect = type === 'partner' ? 'partner-login' : 'home';
  const targetView = redirectView ?? defaultRedirect;

  const logout = useCallback(async () => {
    const session = getPartnerAuth();
    const token = session?.token;

    try {
      if (type === 'partner' && token) {
        await partnerLogout(token);
      }
    } catch {
      // Still clear local session on API failure
    } finally {
      // Clear only the relevant panel token.
      if (type === 'member') clearAuthToken();
      if (type === 'partner') clearPartnerAuth();
      setUser?.(null);
      setView?.(targetView);
    }
  }, [setUser, setView, type, targetView]);

  return { logout };
};
