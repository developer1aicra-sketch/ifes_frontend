import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getThemeConfig } from '../utils/theme';

/** Default location route codes to always show (Delhi region) */
const DEFAULT_LOCATION_CODES = ['RW', 'RO', 'AE', 'CL'];

/**
 * LocationSwitcher – "Delhi" label with route links: RW (Blue), RO, AE, CL.
 * Clicking a code navigates to /RW, /RO, /AE, /CL and applies that location's theme.
 */
const LocationSwitcher = ({
  regionLabel = 'Delhi',
  locationCodes = DEFAULT_LOCATION_CODES,
  locationThemeMap = {},
  className = '',
}) => {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').filter(Boolean)[0]?.toUpperCase();
  const isLocationRoute = pathSegment && pathSegment.length === 2 && /^[A-Z]{2}$/.test(pathSegment);
  const activeCode = isLocationRoute ? pathSegment : null;

  const items = useMemo(() => {
    return locationCodes.map((code) => {
      const themeColor = locationThemeMap[code] || 'Blue';
      const themeConfig = getThemeConfig(themeColor);
      const isSelected = activeCode === code;
      return {
        code,
        themeColor,
        themeConfig,
        isSelected,
      };
    });
  }, [locationCodes, locationThemeMap, activeCode]);

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      <span className="text-sm text-white font-medium">{regionLabel}</span>
      <div className="flex flex-wrap gap-2 items-center">
        {items.map(({ code, themeColor, themeConfig, isSelected }) => (
          <Link
            key={code}
            to={`/${code}`}
            className={`
              text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-300 no-underline
              ${isSelected
                ? `${themeConfig.colors.textLight} ${themeConfig.colors.primary} bg-opacity-20 border ${themeConfig.colors.border} shadow-sm font-bold`
                : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
              }
            `}
            title={`Open ${code} (${themeColor} theme)`}
            aria-label={`Go to ${code} route - ${themeColor} theme`}
          >
            {isSelected ? `${code} ` : code}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocationSwitcher;
export { DEFAULT_LOCATION_CODES };
