export type NisabStandard = 'gold' | 'silver';

export type CurrencyCode =
  | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
  | 'SAR' | 'AED' | 'NGN' | 'MYR' | 'PKR'
  | 'BDT' | 'EGP' | 'TRY' | 'IDR' | 'INR'
  | 'QAR' | 'KWD' | 'OMR' | 'BHD' | 'ZAR';

export interface MetalPrices {
  goldPerGram: number;   // in user's chosen currency
  silverPerGram: number; // in user's chosen currency
  fetchedAt: string;
  currency: CurrencyCode;
}

export interface Assets {
  cash: number;
  goldSilver: number;
  businessInventory: number;
  investments: number;
  receivables: number;
  pension: number;
  realEstate: number;
}

export interface Liabilities {
  shortTermDebts: number;
  longTermDebts: number;
  otherLiabilities: number;
}

export interface ZakatState {
  currentStep: 1 | 2 | 3 | 4;
  nisabStandard: NisabStandard;
  currency: CurrencyCode;
  metalPrices: MetalPrices | null;
  manualGoldPrice: string;
  manualSilverPrice: string;
  useManualPrices: boolean;
  assets: Assets;
  liabilities: Liabilities;
}

export interface ZakatResults {
  nisabThreshold: number;
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  zakatDue: number;
  isZakatDue: boolean;
}

export type ZakatAction =
  | { type: 'SET_STEP'; payload: 1 | 2 | 3 | 4 }
  | { type: 'SET_NISAB_STANDARD'; payload: NisabStandard }
  | { type: 'SET_CURRENCY'; payload: CurrencyCode }
  | { type: 'SET_METAL_PRICES'; payload: MetalPrices }
  | { type: 'SET_MANUAL_GOLD_PRICE'; payload: string }
  | { type: 'SET_MANUAL_SILVER_PRICE'; payload: string }
  | { type: 'SET_USE_MANUAL_PRICES'; payload: boolean }
  | { type: 'SET_ASSET'; payload: { key: keyof Assets; value: number } }
  | { type: 'SET_LIABILITY'; payload: { key: keyof Liabilities; value: number } }
  | { type: 'RESET' };

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'error';
  message: string;
  loading?: boolean;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  SAR: '﷼',
  AED: 'د.إ',
  NGN: '₦',
  MYR: 'RM',
  PKR: '₨',
  BDT: '৳',
  EGP: 'E£',
  TRY: '₺',
  IDR: 'Rp',
  INR: '₹',
  QAR: 'QR',
  KWD: 'KD',
  OMR: 'OMR',
  BHD: 'BD',
  ZAR: 'R',
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  NGN: 'Nigerian Naira',
  MYR: 'Malaysian Ringgit',
  PKR: 'Pakistani Rupee',
  BDT: 'Bangladeshi Taka',
  EGP: 'Egyptian Pound',
  TRY: 'Turkish Lira',
  IDR: 'Indonesian Rupiah',
  INR: 'Indian Rupee',
  QAR: 'Qatari Riyal',
  KWD: 'Kuwaiti Dinar',
  OMR: 'Omani Rial',
  BHD: 'Bahraini Dinar',
  ZAR: 'South African Rand',
};

export const TROY_OZ_TO_GRAMS = 31.1035;
export const NISAB_GOLD_GRAMS = 85;
export const NISAB_SILVER_GRAMS = 595;
export const ZAKAT_RATE = 0.025;
