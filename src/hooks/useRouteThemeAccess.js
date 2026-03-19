import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeClasses } from './useThemeClasses';

// Re-export for convenience
export { useTheme, useThemeClasses };

/**
 * Hook to access theme based on current route
 * Automatically detects location codes from route and provides theme access
 * 
 * @example
 * ```jsx
 * const MyComponent = () => {
 *   const { theme, locationCode, isLocationRoute } = useRouteThemeAccess();
 *   
 *   return (
 *     <div className={theme.bgGradient}>
 *       <h1>Location: {locationCode}</h1>
 *       <button className={theme.bgPrimary}>Themed Button</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useRouteThemeAccess = () => {
  const location = useLocation();
  const { themeConfig, themeColor, selectedLocation } = useTheme();
  const themeClasses = useThemeClasses();

  // Extract location code from route
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const routeLocationCode = pathSegments[0]?.toUpperCase();
  
  // Check if current route is a location route
  const isLocationRoute = routeLocationCode && 
    routeLocationCode.length === 2 && 
    /^[A-Z]{2}$/.test(routeLocationCode) &&
    !['teams', 'technoxian', 'roboclub', 'about', 'governance', 
      'associates', 'careers', 'partners', 'membership', 'login', 'member',
      'partner', 'portal', 'staff-login', 'login-partner-admin', 'member-dashboard', 
      'admin-dashboard', 'privacy-policy', 'terms-of-use', 'news']
      .includes(routeLocationCode.toLowerCase());

  return {
    // Theme classes for easy styling
    theme: themeClasses,
    
    // Theme config for advanced usage
    themeConfig,
    
    // Current theme color name
    themeColor,
    
    // Location code from route
    locationCode: isLocationRoute ? routeLocationCode : null,
    
    // Selected location (from theme context)
    selectedLocation,
    
    // Whether current route is a location route
    isLocationRoute,
    
    // Current route path
    currentPath: location.pathname,
  };
};
