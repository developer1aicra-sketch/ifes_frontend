import { useLocation } from 'react-router-dom';
import { getLocationPrefix, getLocationCodeFromPath } from '../utils/locationRoutes';

/**
 * Returns the current location prefix and code when the user is on a location route
 * (e.g. /AE or /AE/membership). Use for building links so all pages stay under /AE.
 */
export const useLocationPrefix = () => {
  const { pathname } = useLocation();
  const locationPrefix = getLocationPrefix(pathname);
  const locationCode = getLocationCodeFromPath(pathname);

  return {
    locationPrefix,
    locationCode,
    isLocationRoute: !!locationPrefix,
  };
};
