import { useState, useEffect } from 'react';
import { getLocationCodeFromPath } from '../utils/locationRoutes';
import {
  DEFAULT_PARTNER_ABOUT_WEBSITE,
  fetchPartnerAboutPageData,
} from '../services/partnerAboutPageData';

/**
 * Partner route `/:partnerCode/about`.
 *
 * - About sections: GET /partner/about/get
 * - Advisory board: GET /advisory/board/get?website=worso&x-partner-code=<code>
 * - Referees: GET /advisory/refree/get?website=worso&x-partner-code=<code>
 */
export function usePartnerAboutPageData(isPartnerAboutRoute, pathname) {
  const [partnerAboutSections, setPartnerAboutSections] = useState([]);
  const [partnerAboutLoading, setPartnerAboutLoading] = useState(false);
  const [partnerAboutError, setPartnerAboutError] = useState('');
  const [partnerAdvisoryBoard, setPartnerAdvisoryBoard] = useState([]);
  const [partnerAdvisoryBoardLoading, setPartnerAdvisoryBoardLoading] = useState(false);
  const [partnerAdvisoryBoardError, setPartnerAdvisoryBoardError] = useState('');
  const [partnerReferees, setPartnerReferees] = useState([]);
  const [partnerRefereesLoading, setPartnerRefereesLoading] = useState(false);
  const [partnerRefereesError, setPartnerRefereesError] = useState('');

  useEffect(() => {
    if (!isPartnerAboutRoute) return;

    const partnerCode = getLocationCodeFromPath(pathname) || 'IN';
    let isMounted = true;

    const load = async () => {
      setPartnerAboutLoading(true);
      setPartnerAdvisoryBoardLoading(true);
      setPartnerRefereesLoading(true);
      setPartnerAboutError('');
      setPartnerAdvisoryBoardError('');
      setPartnerRefereesError('');

      try {
        const data = await fetchPartnerAboutPageData(DEFAULT_PARTNER_ABOUT_WEBSITE, partnerCode);
        if (!isMounted) return;
        setPartnerAboutSections(data.partnerAboutSections);
        setPartnerAboutError(data.partnerAboutError);
        setPartnerAdvisoryBoard(data.partnerAdvisoryBoard);
        setPartnerAdvisoryBoardError(data.partnerAdvisoryBoardError);
        setPartnerReferees(data.partnerReferees);
        setPartnerRefereesError(data.partnerRefereesError);
      } finally {
        if (isMounted) {
          setPartnerAboutLoading(false);
          setPartnerAdvisoryBoardLoading(false);
          setPartnerRefereesLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [isPartnerAboutRoute, pathname]);

  return {
    partnerAboutSections,
    partnerAboutLoading,
    partnerAboutError,
    partnerAdvisoryBoard,
    partnerAdvisoryBoardLoading,
    partnerAdvisoryBoardError,
    partnerReferees,
    partnerRefereesLoading,
    partnerRefereesError,
  };
}
