import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Coins, TrendingUp, Info, Edit3, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  ZakatState,
  ZakatAction,
  CurrencyCode,
  NisabStandard,
  CURRENCY_NAMES,
  NISAB_GOLD_GRAMS,
  NISAB_SILVER_GRAMS,
} from '../../types';
import { fetchMetalPrices } from '../../hooks/useMetalPrices';
import { formatCurrency } from '../../utils/formatters';
import { calculateNisabThreshold } from '../../utils/calculations';

const CURRENCIES: CurrencyCode[] = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD',
  'SAR', 'AED', 'NGN', 'MYR', 'PKR',
  'BDT', 'EGP', 'TRY', 'IDR', 'INR',
  'QAR', 'KWD', 'OMR', 'BHD', 'ZAR',
];

interface Step1Props {
  state: ZakatState;
  dispatch: React.Dispatch<ZakatAction>;
  addToast: (type: 'info' | 'success' | 'error', message: string, loading?: boolean) => string;
  dismissToast: (id: string) => void;
}

export const Step1Setup: React.FC<Step1Props> = ({ state, dispatch, addToast, dismissToast }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchPrices = async () => {
    setIsFetching(true);
    const toastId = addToast('info', 'Fetching live metal prices...', true);

    try {
      const prices = await fetchMetalPrices(state.currency);
      dispatch({ type: 'SET_METAL_PRICES', payload: prices });
      dispatch({ type: 'SET_USE_MANUAL_PRICES', payload: false });
      dismissToast(toastId);
      addToast('success', 'Prices updated successfully');
    } catch (err) {
      dismissToast(toastId);
      addToast('error', 'Failed to fetch prices — please enter manually');
      dispatch({ type: 'SET_USE_MANUAL_PRICES', payload: true });
      console.error('Price fetch error:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const activeMetalPrices = state.useManualPrices
    ? {
        goldPerGram: parseFloat(state.manualGoldPrice) || 0,
        silverPerGram: parseFloat(state.manualSilverPrice) || 0,
        fetchedAt: new Date().toISOString(),
        currency: state.currency,
      }
    : state.metalPrices;

  const nisabValue = activeMetalPrices
    ? calculateNisabThreshold(state.nisabStandard, activeMetalPrices)
    : null;

  const canProceed =
    activeMetalPrices &&
    activeMetalPrices.goldPerGram > 0 &&
    activeMetalPrices.silverPerGram > 0;

  const handleNext = () => {
    if (state.useManualPrices && activeMetalPrices) {
      dispatch({ type: 'SET_METAL_PRICES', payload: activeMetalPrices });
    }
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-5"
    >
      {/* Nisab Standard */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-stone-100">
        <h2 className="text-base font-semibold text-stone-800 mb-1">Nisab Standard</h2>
        <p className="text-xs text-stone-500 mb-4">
          The nisab is the minimum wealth threshold required for Zakat to be obligatory.
          Gold standard is more commonly used.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(['gold', 'silver'] as NisabStandard[]).map((std) => (
            <button
              key={std}
              type="button"
              onClick={() => dispatch({ type: 'SET_NISAB_STANDARD', payload: std })}
              className={[
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                state.nisabStandard === std
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white',
              ].join(' ')}
            >
              <span className="text-2xl">{std === 'gold' ? '🥇' : '🥈'}</span>
              <div>
                <p
                  className={`text-sm font-semibold capitalize ${
                    state.nisabStandard === std ? 'text-emerald-700' : 'text-stone-700'
                  }`}
                >
                  {std} Standard
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {std === 'gold'
                    ? `${NISAB_GOLD_GRAMS}g of gold`
                    : `${NISAB_SILVER_GRAMS}g of silver`}
                </p>
              </div>
              {state.nisabStandard === std && (
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Gold standard</strong> sets a higher threshold (fewer people pay).
            <strong> Silver standard</strong> sets a lower threshold (more people pay).
            Consult your scholar if unsure.
          </p>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-stone-100">
        <h2 className="text-base font-semibold text-stone-800 mb-1">Base Currency</h2>
        <p className="text-xs text-stone-500 mb-3">
          All values will be displayed in your chosen currency.
        </p>
        <div className="relative">
          <select
            value={state.currency}
            onChange={(e) => {
              dispatch({ type: 'SET_CURRENCY', payload: e.target.value as CurrencyCode });
              dispatch({ type: 'SET_USE_MANUAL_PRICES', payload: false });
            }}
            className="w-full rounded-xl border border-stone-200 bg-white text-stone-900 py-2.5 pl-3 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-stone-300 appearance-none transition-colors"
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code} — {CURRENCY_NAMES[code]}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronRight className="h-4 w-4 text-stone-400 rotate-90" />
          </div>
        </div>
      </div>

      {/* Metal Prices */}
      <div className="bg-white rounded-2xl shadow-md p-5 border border-stone-100">
        <h2 className="text-base font-semibold text-stone-800 mb-1">Metal Prices</h2>
        <p className="text-xs text-stone-500 mb-4">
          Fetch live gold &amp; silver spot prices, or enter them manually.
        </p>

        <Button
          onClick={handleFetchPrices}
          loading={isFetching}
          size="md"
          className="w-full mb-4"
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          {isFetching ? 'Fetching Live Prices...' : 'Fetch Live Prices'}
        </Button>

        {/* Manual Toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_USE_MANUAL_PRICES', payload: !state.useManualPrices })}
          className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium mb-4 transition-colors"
        >
          <Edit3 className="h-3 w-3" />
          {state.useManualPrices ? 'Hide manual entry' : 'Enter prices manually'}
        </button>

        {state.useManualPrices && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 gap-3 mb-4"
          >
            <Input
              label="Gold price per gram"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={state.manualGoldPrice}
              onChange={(e) => dispatch({ type: 'SET_MANUAL_GOLD_PRICE', payload: e.target.value })}
              suffix={state.currency}
            />
            <Input
              label="Silver price per gram"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={state.manualSilverPrice}
              onChange={(e) => dispatch({ type: 'SET_MANUAL_SILVER_PRICE', payload: e.target.value })}
              suffix={state.currency}
            />
          </motion.div>
        )}

        {/* Prices Display */}
        {(state.metalPrices || (state.useManualPrices && activeMetalPrices)) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="grid grid-cols-2 gap-2 min-w-0">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Coins className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-800">Gold / gram</span>
                </div>
                <p className="text-base font-bold text-amber-700 break-all">
                  {activeMetalPrices && activeMetalPrices.goldPerGram > 0
                    ? formatCurrency(activeMetalPrices.goldPerGram, state.currency)
                    : '—'}
                </p>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-stone-500" />
                  <span className="text-xs font-medium text-stone-600">Silver / gram</span>
                </div>
                <p className="text-base font-bold text-stone-700 break-all">
                  {activeMetalPrices && activeMetalPrices.silverPerGram > 0
                    ? formatCurrency(activeMetalPrices.silverPerGram, state.currency)
                    : '—'}
                </p>
              </div>
            </div>

            {nisabValue !== null && nisabValue > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"
              >
                <p className="text-xs text-emerald-700 font-medium mb-0.5">
                  Current Nisab Threshold ({state.nisabStandard} standard)
                </p>
                <p className="text-lg font-bold text-emerald-800 break-all">
                  {formatCurrency(nisabValue, state.currency)}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  {state.nisabStandard === 'gold'
                    ? `${NISAB_GOLD_GRAMS}g × ${formatCurrency(activeMetalPrices!.goldPerGram, state.currency)}/g`
                    : `${NISAB_SILVER_GRAMS}g × ${formatCurrency(activeMetalPrices!.silverPerGram, state.currency)}/g`}
                </p>
              </motion.div>
            )}

            {state.metalPrices && !state.useManualPrices && (
              <p className="text-xs text-stone-400 text-right">
                Last updated:{' '}
                {new Date(state.metalPrices.fetchedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <Button
        onClick={handleNext}
        size="lg"
        className="w-full"
        disabled={!canProceed}
        rightIcon={<ChevronRight className="h-5 w-5" />}
      >
        Continue to Assets
      </Button>
      {!canProceed && (
        <p className="text-xs text-center text-stone-400">
          Please fetch or enter metal prices to continue
        </p>
      )}
    </motion.div>
  );
};
