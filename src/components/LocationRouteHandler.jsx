import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { fetchPartners, getPrimaryPartnerByLocation } from '../utils/api';
import { setPartnerCode } from '../api/partnerCode';

/**
 * Component that handles route-based theme switching
 * Detects location codes in routes (/RW, /RO, /AE, /CL) and applies theme
 */
const LocationRouteHandler = () => {
  const location = useLocation();
  const { updateTheme, selectedLocation } = useTheme();
  const [partnersCache, setPartnersCache] = useState(null);

  useEffect(() => {
    // Load partners once and cache them
    const loadPartners = async () => {
      if (!partnersCache) {
        try {
          const data = await fetchPartners();
          if (data.success && data.partners) {
            setPartnersCache(data.partners);
          }
        } catch (error) {
          console.error('[LocationRouteHandler] Error loading partners:', error);
        }
      }
    };
    loadPartners();
  }, [partnersCache]);

  useEffect(() => {
    const applyThemeFromRoute = async () => {
      // Wait for partners to be loaded first
      if (!partnersCache) {
        return; // Will retry when partnersCache is set
      }

      // Extract location code from route (e.g., /RW -> RW, /AE -> AE)
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const locationCode = pathSegments[0]?.toUpperCase();
      
      console.log(`[LocationRouteHandler] 🔍 Route: ${location.pathname} → LocationCode: ${locationCode}`);
      
      // Known routes that should NOT trigger theme change
      const knownRoutes = ['teams', 'technoxian', 'roboclub', 'about', 'governance', 
                          'associates', 'careers', 'partners', 'membership', 'login', 
                          'staff-login', 'login-partner-admin', 'member-dashboard', 
                          'admin-dashboard', 'privacy-policy', 'terms-of-use', 'news'];
      
      // Check if it's a valid 2-letter location code and not a known route
      const isValidLocationCode = locationCode && 
          locationCode.length === 2 && 
          /^[A-Z]{2}$/.test(locationCode) &&
          !knownRoutes.includes(locationCode.toLowerCase());
      
      if (isValidLocationCode) {
        // Keep current partner code in sync with route for API requests
        setPartnerCode(locationCode);
        // Always apply theme for location route (even if already selected, to ensure it's active)
        console.log(`[LocationRouteHandler] ✅ Valid location route detected: ${locationCode}`);
        
        try {
          const locationPartner = getPrimaryPartnerByLocation(partnersCache, locationCode);
          const themeToApply = locationPartner?.themeColor || 'Blue';
          if (selectedLocation !== locationCode) {
            console.log(`[LocationRouteHandler] 🎨 Applying theme: ${themeToApply} for ${locationCode}`);
            updateTheme(themeToApply, locationCode);
          }
          if (!locationPartner?.themeColor) {
            console.log(`[LocationRouteHandler] No partner for ${locationCode}, using default theme Blue`);
          }
        } catch (error) {
          console.error(`[LocationRouteHandler] ❌ Error applying theme:`, error);
          updateTheme('Blue', locationCode);
        }
      } else {
        // Clear partner code on non-location routes
        setPartnerCode('');
        // Not a location route - keep current theme if we have one
        if (selectedLocation && location.pathname !== '/') {
          console.log(`[LocationRouteHandler] 📌 Keeping theme for ${selectedLocation} on route: ${location.pathname}`);
        }
      }
    };

    applyThemeFromRoute();
  }, [location.pathname, updateTheme, selectedLocation, partnersCache]);

  return null; // This component doesn't render anything
};

export default LocationRouteHandler;
