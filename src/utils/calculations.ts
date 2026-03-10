import {
  Assets,
  Liabilities,
  MetalPrices,
  NisabStandard,
  ZakatResults,
  NISAB_GOLD_GRAMS,
  NISAB_SILVER_GRAMS,
  ZAKAT_RATE,
} from '../types';

export function calculateNisabThreshold(
  standard: NisabStandard,
  metalPrices: MetalPrices
): number {
  if (standard === 'gold') {
    return NISAB_GOLD_GRAMS * metalPrices.goldPerGram;
  }
  return NISAB_SILVER_GRAMS * metalPrices.silverPerGram;
}

export function calculateTotalAssets(assets: Assets): number {
  return Object.values(assets).reduce((sum, val) => sum + (val || 0), 0);
}

export function calculateTotalLiabilities(liabilities: Liabilities): number {
  return Object.values(liabilities).reduce((sum, val) => sum + (val || 0), 0);
}

export function calculateZakat(
  assets: Assets,
  liabilities: Liabilities,
  nisabStandard: NisabStandard,
  metalPrices: MetalPrices
): ZakatResults {
  const nisabThreshold = calculateNisabThreshold(nisabStandard, metalPrices);
  const totalAssets = calculateTotalAssets(assets);
  const totalLiabilities = calculateTotalLiabilities(liabilities);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const isZakatDue = netZakatableWealth >= nisabThreshold;
  const zakatDue = isZakatDue ? netZakatableWealth * ZAKAT_RATE : 0;

  return {
    nisabThreshold,
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    zakatDue,
    isZakatDue,
  };
}

export function getAssetBreakdown(assets: Assets, totalAssets: number) {
  const labels: Record<keyof Assets, string> = {
    cash: 'Cash & Savings',
    goldSilver: 'Gold & Silver',
    businessInventory: 'Business Inventory',
    investments: 'Investments',
    receivables: 'Receivables',
    pension: 'Pension',
    realEstate: 'Real Estate',
  };

  const colors: Record<keyof Assets, string> = {
    cash: 'bg-emerald-500',
    goldSilver: 'bg-amber-400',
    businessInventory: 'bg-blue-500',
    investments: 'bg-purple-500',
    receivables: 'bg-teal-500',
    pension: 'bg-orange-500',
    realEstate: 'bg-rose-500',
  };

  return (Object.keys(assets) as (keyof Assets)[])
    .filter((key) => assets[key] > 0)
    .map((key) => ({
      label: labels[key],
      value: assets[key],
      percentage: totalAssets > 0 ? (assets[key] / totalAssets) * 100 : 0,
      color: colors[key],
    }));
}
