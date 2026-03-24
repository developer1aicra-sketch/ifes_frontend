import { useState, useEffect, useCallback } from 'react';
import { listCompetitionsGet } from '../utils/api';

/**
 * Fetches competitions for the partner from competitions API.
 * Endpoint: GET /api/competitions/get?partnerCode={partnerCode}
 *
 * @param {string|null} partnerCode - Partner code (e.g. "IN", "TH"). When null, no fetch runs.
 * @param {Object} [options]
 * @param {string} [options.defaultCode] - Optional. When partnerCode is null, use this to fetch.
 * @returns {{ data: Array, loading: boolean, error: string|null, refetch: function }}
 */
export function usePartnerCompetitions(partnerCode, options = {}) {
  const { defaultCode } = options;
  const effectiveCode = partnerCode || defaultCode || null;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!effectiveCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listCompetitionsGet(effectiveCode);
      const competitions = res?.data ?? res?.competitions ?? [];
      setData(Array.isArray(competitions) ? competitions : []);
    } catch (err) {
      console.error('[usePartnerCompetitions] Error:', err);
      setError(err?.message || 'Failed to load competitions');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveCode]);

  useEffect(() => {
    if (!effectiveCode) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }
    refetch();
  }, [effectiveCode, refetch]);

  return { data, loading, error, refetch };
}
