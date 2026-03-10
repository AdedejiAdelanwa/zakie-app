import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Landmark, Gem, ShoppingBag, TrendingUp, HandCoins, PiggyBank, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { ZakatState, ZakatAction, Assets } from '../../types';
import { formatCurrency, getCurrencySymbol } from '../../utils/formatters';
import { calculateTotalAssets } from '../../utils/calculations';

interface AssetCategory {
  key: keyof Assets;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  placeholder: string;
  tooltip?: string;
}

const ASSET_CATEGORIES: AssetCategory[] = [
  {
    key: 'cash',
    label: 'Cash & Bank Savings',
    description: 'Cash on hand, checking & savings accounts',
    icon: Landmark,
    placeholder: '0.00',
  },
  {
    key: 'goldSilver',
    label: 'Gold & Silver',
    description: 'Physical gold and silver (enter current market value)',
    icon: Gem,
    placeholder: '0.00',
  },
  {
    key: 'businessInventory',
    label: 'Business Inventory',
    description: 'Goods held for trade or sale',
    icon: ShoppingBag,
    placeholder: '0.00',
  },
  {
    key: 'investments',
    label: 'Investments',
    description: 'Stocks, mutual funds, ETFs, cryptocurrency',
    icon: TrendingUp,
    placeholder: '0.00',
  },
  {
    key: 'receivables',
    label: 'Money Owed to You',
    description: 'Loans you gave, outstanding receivables',
    icon: HandCoins,
    placeholder: '0.00',
  },
  {
    key: 'pension',
    label: 'Pension & Retirement',
    description: 'Only the accessible/withdrawable portion',
    icon: PiggyBank,
    placeholder: '0.00',
    tooltip:
      'Only include the portion you can currently access or withdraw. Future, locked-in pension funds are generally not included in Zakat calculations.',
  },
  {
    key: 'realEstate',
    label: 'Real Estate (Investment)',
    description: 'Rental or trade properties — NOT your primary home',
    icon: Building2,
    placeholder: '0.00',
    tooltip:
      'Your primary home is NOT zakatable. Only include properties held for investment purposes (rental income, properties held for resale). Estimate current market value.',
  },
];

interface Step2Props {
  state: ZakatState;
  dispatch: React.Dispatch<ZakatAction>;
}

export const Step2Assets: React.FC<Step2Props> = ({ state, dispatch }) => {
  const currencySymbol = getCurrencySymbol(state.currency);
  const totalAssets = calculateTotalAssets(state.assets);

  const handleChange = (key: keyof Assets, value: string) => {
    const num = parseFloat(value);
    dispatch({
      type: 'SET_ASSET',
      payload: { key, value: isNaN(num) || num < 0 ? 0 : num },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-4"
    >
      <div className="px-1">
        <h2 className="text-lg font-semibold text-stone-800">Your Assets</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Enter the current value of each asset in {state.currency}.
          Leave blank or enter 0 if not applicable.
        </p>
      </div>

      <div className="space-y-3">
        {ASSET_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const value = state.assets[cat.key];

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-md border border-stone-100 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 rounded-xl p-2.5 shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-semibold text-stone-800">{cat.label}</h3>
                    {cat.tooltip && <Tooltip content={cat.tooltip} />}
                  </div>
                  <p className="text-xs text-stone-500 mb-3">{cat.description}</p>
                  <div className="flex items-center rounded-xl border border-stone-200 bg-white hover:border-stone-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors">
                    <span className="pl-3 pr-1 text-stone-500 text-base font-medium pointer-events-none select-none shrink-0">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder={cat.placeholder}
                      value={value === 0 ? '' : value}
                      onChange={(e) => handleChange(cat.key, e.target.value)}
                      className="flex-1 min-w-0 bg-transparent text-stone-900 placeholder-stone-300 py-2.5 pr-3 text-base focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total Assets */}
      <motion.div
        className="bg-emerald-700 rounded-2xl p-3 sm:p-4 text-white sticky bottom-4 shadow-xl shadow-emerald-900/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-200 text-xs font-medium">Total Assets</p>
            <p className="text-xl font-bold mt-0.5 break-all">
              {formatCurrency(totalAssets, state.currency)}
            </p>
          </div>
          <div className="text-right text-xs text-emerald-300">
            {ASSET_CATEGORIES.filter((c) => state.assets[c.key] > 0).length} of{' '}
            {ASSET_CATEGORIES.length} filled
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
          leftIcon={<ChevronLeft className="h-5 w-5" />}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};
