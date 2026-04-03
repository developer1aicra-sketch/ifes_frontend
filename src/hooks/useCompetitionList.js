import { useState, useEffect, useCallback, useMemo } from 'react';
import { listCompetitions } from '../utils/api';

function normalizeCompetitionName(name) {
  if (name == null) return '';
  const s = String(name).trim().toLowerCase().replace(/\s+/g, ' ');
  return s;
}

/**
 * Deduplicate API competition rows by display name (case-insensitive).
 * The list endpoint returns the same challenge many times for different events.
 *
 * @param {Array} competitions
 * @returns {Array}
 */
export function dedupeCompetitionsByName(competitions) {
  const seen = new Set();
  const out = [];
  for (const c of competitions || []) {
    if (!c) continue;
    if (c.isActive === false) continue;
    const key = normalizeCompetitionName(c.name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

/**
 * Fetches GET /api/competition/list and returns deduplicated, active competitions.
 */
export function useCompetitionList() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCompetitions();
      const arr = res?.data ?? [];
      setRaw(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error('[useCompetitionList]', e);
      setError(e?.message || 'Failed to load competitions');
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const competitions = useMemo(() => dedupeCompetitionsByName(raw), [raw]);

  return { competitions, loading, error, refetch };
}
