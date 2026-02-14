import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { fetchPartners, getPrimaryPartnerByLocation } from '../utils/api';

/**
 * Hook to automatically apply theme based on route location code
 * Detects routes like /RW, /RO, /AE, /CL and applies corresponding theme
 */
export const useRouteTheme = () => {
  const location = useLocation();
  const { updateTheme, themeConfig } = useTheme();
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract location code from route (e.g., /RW -> RW, /AE -> AE)
  const getLocationCodeFromRoute = () => {
    const path = location.pathname;
    // Match routes like /RW, /RO, /AE, /CL (2-letter uppercase codes)
    const match = path.match(/^\/([A-Z]{2})(\/|$)/);
    return match ? match[1] : null;
  };

  // Load partners on mount
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await fetchPartners();
        if (data.success && data.partners) {
          setPartners(data.partners);
        }
      } catch (error) {
        console.error('[RouteTheme] Failed to load partners:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPartners();
  }, []);

  // Apply theme based on route
  useEffect(() => {
    if (isLoading || partners.length === 0) return;

    const locationCode = getLocationCodeFromRoute();
    
    if (locationCode) {
      console.log(`[RouteTheme] Detected location code in route: ${locationCode}`);
      
      // Find partner by location code
      const locationPartner = getPrimaryPartnerByLocation(partners, locationCode);
      
      if (locationPartner?.themeColor) {
        console.log(`[RouteTheme] Applying theme ${locationPartner.themeColor} for location ${locationCode}`);
        updateTheme(locationPartner.themeColor, locationCode);
      } else {
        console.warn(`[RouteTheme] No partner found for location code: ${locationCode}`);
      }
    }
  }, [location.pathname, partners, isLoading, updateTheme]);

  return {
    locationCode: getLocationCodeFromRoute(),
    isLoading,
    hasRouteTheme: !!getLocationCodeFromRoute(),
  };
};
