// Lightweight frontend FX helper with simple in-memory caching.
// Used to update displayed totals immediately when user changes currency.

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
let cache = {
  base: null,
  fetchedAt: 0,
  rates: null,
};

let inFlight = null;

function normalizeRatesObject(obj) {
  if (!obj || typeof obj !== "object") return null;
  const rates = {};
  for (const [k, v] of Object.entries(obj)) {
    const code = String(k || "").toUpperCase();
    const num = v != null ? Number(v) : NaN;
    if (code && Number.isFinite(num) && num > 0) rates[code] = num;
  }
  return Object.keys(rates).length ? rates : null;
}

async function fetchRatesOpenErApi(base) {
  // Can be blocked by CORS/network in some environments.
  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`open.er-api.com failed: ${res.status}`);
  const data = await res.json();
  if (!data || data.result !== "success" || !data.rates) {
    throw new Error("open.er-api.com response invalid");
  }
  const normalized = normalizeRatesObject(data.rates);
  if (!normalized) throw new Error("open.er-api.com rates empty");
  return normalized;
}

async function fetchRatesFawaz(base) {
  // CORS-friendly mirror of fawazahmed0/currency-api via jsdelivr.
  // Example: .../latest/currencies/inr.json -> { date, inr: { usd: 0.012, ... } }
  const lower = String(base || "").toLowerCase();
  const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${encodeURIComponent(
    lower
  )}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`currency-api (jsdelivr) failed: ${res.status}`);
  const data = await res.json();
  const bucket = data?.[lower];
  const normalized = normalizeRatesObject(bucket);
  if (!normalized) throw new Error("currency-api (jsdelivr) rates empty");
  return normalized;
}

async function fetchRatesForBase(base) {
  // Try a CORS-friendly source first, then fall back.
  try {
    return await fetchRatesFawaz(base);
  } catch (e1) {
    return await fetchRatesOpenErApi(base);
  }
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
    // Deduplicate concurrent requests for the same base.
    if (!inFlight || inFlight.base !== base) {
      inFlight = {
        base,
        promise: fetchRatesForBase(base).finally(() => {
          // Only clear if we're still pointing at the same base request.
          if (inFlight?.base === base) inFlight = null;
        }),
      };
    }
    const rates = await inFlight.promise;
    cache = { base, fetchedAt: now, rates };
  }

  const rate = cache.rates?.[target];
  const numericRate = rate != null ? Number(rate) : null;
  if (!numericRate || Number.isNaN(numericRate)) {
    throw new Error(`FX rate missing for ${base}->${target}`);
  }

  return numericRate;
}

