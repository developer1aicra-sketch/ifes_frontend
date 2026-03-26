// Lightweight frontend FX helper with simple in-memory caching.
// Used to update displayed totals immediately when user changes currency.

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache = {
  base: null,
  fetchedAt: 0,
  rates: null,
};

async function fetchRatesForBase(base) {
  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`FX rate request failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data || data.result !== "success" || !data.rates) {
    throw new Error("FX rate response invalid");
  }
  return data.rates;
}

export async function getFxRate(baseCurrency, targetCurrency) {
  const base = String(baseCurrency || "").toUpperCase();
  const target = String(targetCurrency || "").toUpperCase();
  if (!base || !target) throw new Error("Invalid currency codes");
  if (base === target) return 1;

  const now = Date.now();
  const canUseCache =
    cache.base === base && cache.rates && now - cache.fetchedAt < CACHE_TTL_MS;

  if (!canUseCache) {
    const rates = await fetchRatesForBase(base);
    cache = { base, fetchedAt: now, rates };
  }

  const rate = cache.rates?.[target];
  const numericRate = rate != null ? Number(rate) : null;
  if (!numericRate || Number.isNaN(numericRate)) {
    throw new Error(`FX rate missing for ${base}->${target}`);
  }

  return numericRate;
}

