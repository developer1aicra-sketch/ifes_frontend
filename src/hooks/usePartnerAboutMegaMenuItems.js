import { useState, useEffect } from 'react';
import { fetchPartnerAboutPageData, DEFAULT_PARTNER_ABOUT_WEBSITE } from '../services/partnerAboutPageData';
import { buildPartnerAboutTabsList } from '../utils/partnerAboutTabs';

/**
 * Loads partner About tab labels for regional chapter mega menu (`/:XX/about?tab=…`).
 * @param {string} effectiveLocationPrefix e.g. `/AE` or ``
 */
export function usePartnerAboutMegaMenuItems(effectiveLocationPrefix) {
  const [tabs, setTabs] = useState(() => buildPartnerAboutTabsList([]));
  const [loading, setLoading] = useState(false);

  const partnerCode = effectiveLocationPrefix
    ? String(effectiveLocationPrefix).replace(/^\//, '').toUpperCase().trim()
    : '';
  const isRegionalChapter = Boolean(partnerCode && /^[A-Z]{2}$/.test(partnerCode));

  useEffect(() => {
    if (!isRegionalChapter) {
      setTabs(buildPartnerAboutTabsList([]));
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchPartnerAboutPageData(DEFAULT_PARTNER_ABOUT_WEBSITE, partnerCode)
      .then((data) => {
        if (cancelled) return;
        setTabs(buildPartnerAboutTabsList(data.partnerAboutSections || []));
      })
      .catch(() => {
        if (!cancelled) setTabs(buildPartnerAboutTabsList([]));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isRegionalChapter, partnerCode]);

  return { isRegionalChapter, partnerTabs: tabs, loading };
}
