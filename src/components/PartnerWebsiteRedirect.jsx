import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectPartnerFromUrl } from '../utils/api';

const STORAGE_KEY = 'worso_partner_redirect_done';

/**
 * When the app is opened as a partner website (subdomain, partner URL, or ?location=CL),
 * redirect to the location route so the site opens on e.g. /CL with correct theme.
 * Runs once per session to avoid redirect loops.
 */
const PartnerWebsiteRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;

    const run = async () => {
      const path = location.pathname || '/';
      const pathSegments = path.split('/').filter(Boolean);
      const currentFirstSegment = pathSegments[0]?.toUpperCase();

      // Already on a location route (e.g. /CL, /AE) - no redirect
      if (currentFirstSegment && currentFirstSegment.length === 2 && /^[A-Z]{2}$/.test(currentFirstSegment)) {
        didRun.current = true;
        return;
      }

      // Only redirect when on home page (/) so partner website opens on location route
      if (path !== '/' && path !== '') {
        didRun.current = true;
        return;
      }

      // Optional: skip if user explicitly chose to stay on home
      if (sessionStorage.getItem(STORAGE_KEY) === 'skip') {
        didRun.current = true;
        return;
      }

      const { locationCode } = await detectPartnerFromUrl();

      if (locationCode) {
        didRun.current = true;
        sessionStorage.setItem(STORAGE_KEY, 'done');
        const targetPath = `/${locationCode}`;
        console.log(`[PartnerWebsiteRedirect] Partner website detected → opening ${targetPath}`);
        navigate(targetPath, { replace: true });
      }
    };

    run();
  }, [location.pathname, navigate]);

  return null;
};

export default PartnerWebsiteRedirect;
