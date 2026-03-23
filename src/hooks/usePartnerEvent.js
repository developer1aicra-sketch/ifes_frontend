import { useState, useEffect, useCallback } from 'react';
import { listEventsGet } from '../utils/api';

/**
 * Fetches a single (first) event for the partner from the events API.
 * Endpoint: GET /api/event/get?website=worso&partnerCode={partnerCode}
 *
 * @param {string|null} partnerCode - Partner code (e.g. "EG", "TH"). When null, no fetch runs.
 * @param {Object} [options]
 * @param {string} [options.defaultCode] - Optional. When partnerCode is null, use this to fetch.
 * @returns {{ data: object|null, loading: boolean, error: string|null, refetch: function }}
 */
export function usePartnerEvent(partnerCode, options = {}) {
  const { defaultCode } = options;
  const effectiveCode = partnerCode || defaultCode || null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!effectiveCode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await listEventsGet(effectiveCode);
      const events = res?.data ?? res?.events ?? [];
      const firstEvent = Array.isArray(events) && events.length > 0 ? events[0] : null;
      setData(firstEvent);
    } catch (err) {
      console.error('[usePartnerEvent] Error:', err);
      setError(err?.message || 'Failed to load event');
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
