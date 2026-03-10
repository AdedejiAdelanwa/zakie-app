import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CreditCard, Home, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { ZakatState, ZakatAction, Liabilities } from '../../types';
import { formatCurrency, getCurrencySymbol } from '../../utils/formatters';
import { calculateTotalAssets, calculateTotalLiabilities } from '../../utils/calculations';

interface LiabilityCategory {
  key: keyof Liabilities;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  placeholder: string;
  tooltip?: string;
}

const LIABILITY_CATEGORIES: LiabilityCategory[] = [
  {
    key: 'shortTermDebts',
    label: 'Short-term Debts',
    description: 'Debts due within the next 12 months',
    icon: CreditCard,
    placeholder: '0.00',
    tooltip:
      'Include credit card balances, personal loans, and any other debts you expect to pay within the year. Only deduct what is currently due.',
  },
  {
    key: 'longTermDebts',
    label: 'Long-term Debts (Immediate Portion)',
    description: 'Mortgages etc — only the amount due this year',
    icon: Home,
    placeholder: '0.00',
    tooltip:
      'For long-term debts like mortgages, most scholars agree you should only deduct the amount currently due or the next 12 months of payments, not the entire outstanding balance.',
  },
  {
    key: 'otherLiabilities',
    label: 'Other Liabilities',
    description: 'Other outstanding obligations',
    icon: AlertCircle,
    placeholder: '0.00',
  },
];

interface Step3Props {
  state: ZakatState;
  dispatch: React.Dispatch<ZakatAction>;
}

export const Step3Liabilities: React.FC<Step3Props> = ({ state, dispatch }) => {
  const currencySymbol = getCurrencySymbol(state.currency);
  const totalAssets = calculateTotalAssets(state.assets);
  const totalLiabilities = calculateTotalLiabilities(state.liabilities);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const handleChange = (key: keyof Liabilities, value: string) => {
    const num = parseFloat(value);
    dispatch({
      type: 'SET_LIABILITY',
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
        <h2 className="text-lg font-semibold text-stone-800">Your Liabilities</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Enter debts and obligations that can be deducted from your zakatable wealth.
        </p>
      </div>

      <div className="space-y-3">
        {LIABILITY_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const value = state.liabilities[cat.key];

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-2xl shadow-md border border-stone-100 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="bg-rose-50 rounded-xl p-2.5 shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-semibold text-stone-800">{cat.label}</h3>
                    {cat.tooltip && <Tooltip content={cat.tooltip} />}
                  </div>
                  <p className="text-xs text-stone-500 mb-3">{cat.description}</p>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-stone-500 text-sm font-medium pointer-events-none select-none">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder={cat.placeholder}
                      value={value === 0 ? '' : value}
                      onChange={(e) => handleChange(cat.key, e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-300 py-2.5 pl-8 pr-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-stone-300 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Preview */}
      <motion.div
        className="bg-white rounded-2xl shadow-md border border-stone-100 p-4 space-y-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="text-sm font-semibold text-stone-700">Preview</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600">Total Assets</span>
            <span className="font-semibold text-emerald-700">
              {formatCurrency(totalAssets, state.currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-stone-600">Total Liabilities</span>
            <span className="font-semibold text-rose-600">
              − {formatCurrency(totalLiabilities, state.currency)}
            </span>
          </div>
          <div className="h-px bg-stone-100" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-stone-800">Net Zakatable Wealth</span>
            <span className="text-base font-bold text-emerald-800 break-all">
              {formatCurrency(netWealth, state.currency)}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
          leftIcon={<ChevronLeft className="h-5 w-5" />}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}
          rightIcon={<ChevronRight className="h-5 w-5" />}
        >
          Calculate Zakat
        </Button>
      </div>
    </motion.div>
  );
};
