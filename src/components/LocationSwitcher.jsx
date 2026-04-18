// import { useMemo } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { getThemeConfig } from '../utils/theme';

// /** Default location route codes to always show (Delhi region) */
// const DEFAULT_LOCATION_CODES = ['RW', 'RO', 'AE', 'CL'];

// /**
//  * LocationSwitcher – "Delhi" label with route links: RW (Blue), RO, AE, CL.
//  * Clicking a code navigates to /RW, /RO, /AE, /CL and applies that location's theme.
//  */
// const LocationSwitcher = ({
//   regionLabel = 'Delhi',
//   locationCodes = DEFAULT_LOCATION_CODES,
//   locationThemeMap = {},
//   showFullNames = false,
//   className = '',
// }) => {
//   const location = useLocation();
//   const pathSegment = location.pathname.split('/').filter(Boolean)[0]?.toUpperCase();
//   const isLocationRoute = pathSegment && pathSegment.length === 2 && /^[A-Z]{2}$/.test(pathSegment);
//   const activeCode = isLocationRoute ? pathSegment : null;

//   // FIXED: Safely handle Intl.DisplayNames with error catching
//   const getRegionName = useMemo(() => {
//     if (!showFullNames) return null;
    
//     try {
//       // Check if Intl.DisplayNames is supported
//       if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
//         // Use 'en' as fallback locale to avoid issues
//         return (code) => {
//           try {
//             const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
//             return regionNames.of(code);
//           } catch (err) {
//             console.warn(`Failed to get region name for ${code}:`, err);
//             return code;
//           }
//         };
//       }
//     } catch (err) {
//       console.warn('Intl.DisplayNames not supported:', err);
//     }
//     return null;
//   }, [showFullNames]);

//   const items = useMemo(() => {
//     // Ensure locationCodes is an array
//     const safeLocationCodes = Array.isArray(locationCodes) ? locationCodes : DEFAULT_LOCATION_CODES;
    
//     return safeLocationCodes.map((code) => {
//       const themeColor = locationThemeMap[code] || 'Blue';
//       const themeConfig = getThemeConfig(themeColor);
//       const isSelected = activeCode === code;
      
//       // Safely get display name
//       let displayName = code;
//       if (showFullNames && getRegionName) {
//         try {
//           const fullName = getRegionName(code);
//           displayName = fullName && fullName !== code ? fullName : code;
//         } catch (err) {
//           console.warn(`Error getting display name for ${code}:`, err);
//           displayName = code;
//         }
//       }
      
//       return {
//         code,
//         displayName,
//         themeColor,
//         themeConfig,
//         isSelected,
//       };
//     });
//   }, [locationCodes, locationThemeMap, activeCode, showFullNames, getRegionName]);

//   // If no items, don't render
//   if (!items || items.length === 0) {
//     return null;
//   }

//   return (
//     <div className={`flex items-center gap-3 flex-col flex-wrap ${className}`}>
//       <span className="text-sm text-white font-medium">Partner</span>
//       <div className="flex flex-wrap flex-col gap-2 items-center">
//         {items.map(({ code, displayName, themeColor, themeConfig, isSelected }) => (
//           <Link
//             key={code}
//             to={`/${code}`}
//             className={`
//               text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-300 no-underline
//               ${isSelected
//                 ? `${themeConfig.colors.textLight} ${themeConfig.colors.primary} bg-opacity-20 border ${themeConfig.colors.border} shadow-sm font-bold`
//                 : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
//               }
//             `}
//             title={`Open ${displayName} (${code}) - ${themeColor} theme`}
//             aria-label={`Go to ${displayName} (${code}) route - ${themeColor} theme`}
//           >
//             {displayName}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationSwitcher;
// export { DEFAULT_LOCATION_CODES };



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
  showFullNames = false,
  className = '',
}) => {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').filter(Boolean)[0]?.toUpperCase();
  const isLocationRoute = pathSegment && pathSegment.length === 2 && /^[A-Z]{2}$/.test(pathSegment);
  const activeCode = isLocationRoute ? pathSegment : null;

  // FIXED: Safely handle Intl.DisplayNames with error catching
  const getRegionName = useMemo(() => {
    if (!showFullNames) return null;
    
    try {
      // Check if Intl.DisplayNames is supported
      if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
        // Use 'en' as fallback locale to avoid issues
        return (code) => {
          try {
            const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
            return regionNames.of(code);
          } catch (err) {
            console.warn(`Failed to get region name for ${code}:`, err);
            return code;
          }
        };
      }
    } catch (err) {
      console.warn('Intl.DisplayNames not supported:', err);
    }
    return null;
  }, [showFullNames]);

  const items = useMemo(() => {
    // Ensure locationCodes is an array
    const safeLocationCodes = Array.isArray(locationCodes) ? locationCodes : DEFAULT_LOCATION_CODES;
    
    return safeLocationCodes.map((code) => {
      const themeColor = locationThemeMap[code] || 'Blue';
      const themeConfig = getThemeConfig(themeColor);
      const isSelected = activeCode === code;
      
      // Safely get display name
      let displayName = code;
      if (showFullNames && getRegionName) {
        try {
          const fullName = getRegionName(code);
          displayName = fullName && fullName !== code ? fullName : code;
        } catch (err) {
          console.warn(`Error getting display name for ${code}:`, err);
          displayName = code;
        }
      }
      
      return {
        code,
        displayName,
        themeColor,
        themeConfig,
        isSelected,
      };
    });
  }, [locationCodes, locationThemeMap, activeCode, showFullNames, getRegionName]);

  // If no items, don't render
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 flex-col flex-wrap ${className}`}>
      <span className="text-sm text-white font-medium">Partner</span>
      <div className="flex flex-wrap flex-col gap-2 items-center">
        {items.map(({ code, displayName, themeColor, themeConfig, isSelected }) => (
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
            title={`Open ${displayName} (${code}) - ${themeColor} theme`}
            aria-label={`Go to ${displayName} (${code}) route - ${themeColor} theme`}
          >
            {displayName}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocationSwitcher;
export { DEFAULT_LOCATION_CODES };