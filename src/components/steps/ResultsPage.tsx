import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Printer, RotateCcw, CheckCircle, XCircle, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { Button } from '../ui/Button';
import { ZakatState, ZakatAction } from '../../types';
import { calculateZakat, getAssetBreakdown } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

interface ResultsPageProps {
  state: ZakatState;
  dispatch: React.Dispatch<ZakatAction>;
  addToast: (type: 'info' | 'success' | 'error', message: string) => string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ state, dispatch, addToast }) => {
  const metalPrices = state.metalPrices!;
  const results = calculateZakat(
    state.assets,
    state.liabilities,
    state.nisabStandard,
    metalPrices
  );

  const breakdown = getAssetBreakdown(state.assets, results.totalAssets);

  useEffect(() => {
    addToast('success', 'Zakat calculated successfully');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handlePrint = () => {
    window.print();
  };

  const zakatRate = results.isZakatDue
    ? ((results.zakatDue / results.netZakatableWealth) * 100).toFixed(1)
    : '0';

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-5"
    >
      {/* Zakat Due Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 text-center shadow-xl ${
          results.isZakatDue
            ? 'bg-gradient-to-br from-amber-400 via-amber-400 to-amber-500'
            : 'bg-gradient-to-br from-emerald-600 to-emerald-700'
        }`}
      >
        <div className="flex justify-center mb-3">
          {results.isZakatDue ? (
            <div className="bg-white/30 rounded-full p-3">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          ) : (
            <div className="bg-white/30 rounded-full p-3">
              <XCircle className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {results.isZakatDue ? (
          <>
            <p className="text-amber-900 text-sm font-semibold uppercase tracking-wider mb-1">
              Zakat Due
            </p>
            <p className="text-5xl font-bold text-white mb-2">
              {formatCurrency(results.zakatDue, state.currency)}
            </p>
            <p className="text-amber-800 text-xs">
              {zakatRate}% of your net zakatable wealth
            </p>
          </>
        ) : (
          <>
            <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wider mb-2">
              No Zakat Due
            </p>
            <p className="text-white text-base font-medium">
              Your net wealth is below the Nisab threshold.
            </p>
            <p className="text-emerald-200 text-xs mt-1">
              May Allah bless you with more provision.
            </p>
          </>
        )}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-md border border-stone-100 p-5"
      >
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Calculation Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-stone-50">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 rounded-lg p-1.5">
                <Scale className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-600">Nisab Threshold</p>
                <p className="text-xs text-stone-400 capitalize">{state.nisabStandard} standard</p>
              </div>
            </div>
            <p className="text-sm font-bold text-stone-800">
              {formatCurrency(results.nisabThreshold, state.currency)}
            </p>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-stone-50">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 rounded-lg p-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <p className="text-xs font-medium text-stone-600">Total Assets</p>
            </div>
            <p className="text-sm font-bold text-emerald-700">
              {formatCurrency(results.totalAssets, state.currency)}
            </p>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-stone-50">
            <div className="flex items-center gap-2">
              <div className="bg-rose-100 rounded-lg p-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
              </div>
              <p className="text-xs font-medium text-stone-600">Total Liabilities</p>
            </div>
            <p className="text-sm font-bold text-rose-600">
              − {formatCurrency(results.totalLiabilities, state.currency)}
            </p>
          </div>

          <div className="flex items-center justify-between py-3 bg-stone-50 rounded-xl px-3">
            <p className="text-sm font-semibold text-stone-800">Net Zakatable Wealth</p>
            <p className="text-base font-bold text-stone-900">
              {formatCurrency(results.netZakatableWealth, state.currency)}
            </p>
          </div>

          {/* Nisab check */}
          <div
            className={`flex items-center gap-2 text-xs p-3 rounded-xl ${
              results.isZakatDue
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-stone-50 text-stone-600 border border-stone-200'
            }`}
          >
            {results.isZakatDue ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>
                  Net wealth ({formatCurrency(results.netZakatableWealth, state.currency)}) exceeds
                  Nisab ({formatCurrency(results.nisabThreshold, state.currency)}) → Zakat is
                  obligatory
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <span>
                  Net wealth ({formatCurrency(results.netZakatableWealth, state.currency)}) is
                  below Nisab ({formatCurrency(results.nisabThreshold, state.currency)}) → No Zakat
                  due
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Asset Breakdown */}
      {breakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-stone-100 p-5"
        >
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Asset Composition</h3>

          {/* Stacked Bar */}
          <div className="flex h-4 w-full rounded-full overflow-hidden mb-4 bg-stone-100">
            {breakdown.map((item) => (
              <div
                key={item.label}
                className={`${item.color} transition-all duration-700`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.label}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="text-xs text-stone-600">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400">{item.percentage.toFixed(1)}%</span>
                  <span className="text-xs font-semibold text-stone-700">
                    {formatCurrency(item.value, state.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Metal Prices Reference */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4"
      >
        <h3 className="text-xs font-semibold text-emerald-800 mb-2">Prices Used</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-emerald-600">Gold / gram</p>
            <p className="font-bold text-emerald-900">
              {formatCurrency(metalPrices.goldPerGram, state.currency)}
            </p>
          </div>
          <div>
            <p className="text-emerald-600">Silver / gram</p>
            <p className="font-bold text-emerald-900">
              {formatCurrency(metalPrices.silverPerGram, state.currency)}
            </p>
          </div>
        </div>
        <p className="text-xs text-emerald-600 mt-2">
          Prices as of:{' '}
          {new Date(metalPrices.fetchedAt).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={handleReset}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Recalculate
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 no-print"
          onClick={handlePrint}
          leftIcon={<Printer className="h-4 w-4" />}
        >
          Print / Save
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-stone-400 text-center leading-relaxed pb-4">
        All calculations are done locally in your browser. This is a guide only — consult a
        scholar for your specific situation.
      </p>
    </motion.div>
  );
};
