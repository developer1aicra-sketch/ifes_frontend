import { useMemo } from 'react';
import { useLocationPrefix } from './useLocationPrefix';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Prefix for links on regional partner sites (`/AE/...`, `/TH/...`).
 * When the URL has no location segment yet (e.g. brief load state), falls back to
 * `selectedLocation` from theme so About mega menu and nav still point at `/XX/about/...`.
 */
export function useEffectiveLocationPrefix(siteConfig) {
  const { locationPrefix } = useLocationPrefix();
  const { selectedLocation } = useTheme();

  return useMemo(() => {
    if (locationPrefix) return locationPrefix;
    if (siteConfig?.is_partner && selectedLocation) {
      const code = String(selectedLocation).toUpperCase().trim();
      if (code.length === 2 && /^[A-Z]{2}$/.test(code)) {
        return `/${code}`;
      }
    }
    return '';
  }, [locationPrefix, siteConfig?.is_partner, selectedLocation]);
}
