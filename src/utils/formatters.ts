import { CurrencyCode, CURRENCY_SYMBOLS } from '../types';

// Maps ISO 3166-1 alpha-2 region codes to supported currencies
const REGION_TO_CURRENCY: Record<string, CurrencyCode> = {
  US: 'USD', CA: 'CAD', AU: 'AUD',
  GB: 'GBP',
  // Eurozone
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', IE: 'EUR', PT: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR',
  SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR', CY: 'EUR',
  MT: 'EUR',
  // Muslim-majority & Gulf
  SA: 'SAR', AE: 'AED', NG: 'NGN', MY: 'MYR', PK: 'PKR',
  BD: 'BDT', EG: 'EGP', TR: 'TRY', ID: 'IDR', IN: 'INR',
  QA: 'QAR', KW: 'KWD', OM: 'OMR', BH: 'BHD',
  // Other
  ZA: 'ZAR',
};

export function getDefaultCurrency(): CurrencyCode {
  try {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const region = locale.split('-')[1]?.toUpperCase();
    if (region && region in REGION_TO_CURRENCY) return REGION_TO_CURRENCY[region];
    // Fallback: try the language tag itself as a region (e.g. "fr" → no match → USD)
  } catch {
    // SSR or restricted environments
  }
  return 'USD';
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  compact = false
): string {
  const symbol = CURRENCY_SYMBOLS[currency];

  if (compact && value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  }
  if (compact && value >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(1)}K`;
  }

  return `${symbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function parseNumberInput(value: string): number {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency];
}
