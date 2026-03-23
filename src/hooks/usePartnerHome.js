import { useState, useEffect, useCallback } from 'react';
import { fetchPartnerHome } from '../utils/api';

/**
 * Fetches partner home content from the API.
 * Endpoint: GET https://worso-backend-amber.vercel.app/api/partners/home/{countryCode}
 *
 * @param {string|null} countryCode - 2-letter country code (e.g. "EG", "TH"). When null, no fetch runs.
 * @param {Object} [options]
 * @param {string} [options.defaultCode] - Optional. When countryCode is null, use this to fetch (e.g. for root "/" path). Set via VITE_DEFAULT_PARTNER_CODE.
 * @returns {{ data: object|null, loading: boolean, error: string|null, refetch: function }}
 */
export function usePartnerHome(countryCode, options = {}) {
  const { defaultCode } = options;
  const effectiveCode = countryCode || defaultCode || null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!effectiveCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPartnerHome(effectiveCode);
      if (res?.success) {
        setData(res);
      } else {
        setError('Failed to load partner home data');
      }
    } catch (err) {
      console.error('[usePartnerHome] Error:', err);
      setError(err?.message || 'Failed to load partner home data');
    } finally {
      setLoading(false);
    }
  }, [effectiveCode]);

  useEffect(() => {
    if (!effectiveCode) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    refetch();
  }, [effectiveCode, refetch]);

  return { data, loading, error, refetch };
}
