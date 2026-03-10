import { CurrencyCode, MetalPrices, TROY_OZ_TO_GRAMS } from '../types';

// @fawazahmed0/currency-api — completely free, no API key, CORS-friendly, CDN-hosted.
// Returns all currencies + precious metals (XAU = gold, XAG = silver) relative to USD.
// Rates mean: 1 USD = {rate} troy oz of XAU/XAG
// → price per troy oz in USD = 1 / rate
//
// Primary:  jsDelivr CDN
// Fallback: Cloudflare Pages mirror

const ENDPOINTS = [
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
  'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
];

interface CurrencyApiResponse {
  date: string;
  usd: Record<string, number>;
}

async function fetchRates(): Promise<Record<string, number>> {
  let lastError: Error = new Error('All endpoints failed');

  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CurrencyApiResponse = await res.json();
      if (!data.usd) throw new Error('Unexpected response shape');
      return data.usd; // keys are lowercase: "xau", "xag", "eur", "gbp", "ngn" …
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError;
}

export async function fetchMetalPrices(currency: CurrencyCode): Promise<MetalPrices> {
  const rates = await fetchRates();

  const xau = rates['xau'];
  const xag = rates['xag'];

  if (!xau || !xag) throw new Error('Metal prices (XAU/XAG) not found in response');

  // 1 / xau_rate = gold price per troy oz in USD
  const goldPerOzUSD = 1 / xau;
  const silverPerOzUSD = 1 / xag;

  // Convert to user's chosen currency (rates[currency] = how many units of currency per 1 USD)
  const currencyKey = currency.toLowerCase();
  const fxRate = currency === 'USD' ? 1 : rates[currencyKey];
  if (!fxRate) throw new Error(`No exchange rate found for ${currency}`);

  return {
    goldPerGram: (goldPerOzUSD * fxRate) / TROY_OZ_TO_GRAMS,
    silverPerGram: (silverPerOzUSD * fxRate) / TROY_OZ_TO_GRAMS,
    fetchedAt: new Date().toISOString(),
    currency,
  };
}
