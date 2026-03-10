import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Setup', 'Assets', 'Liabilities', 'Results'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm no-print">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => {
            const step = i + 1;
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isFuture = step > currentStep;

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={[
                      'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                        : isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm shadow-emerald-200'
                        : 'bg-stone-100 text-stone-400',
                    ].join(' ')}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step}
                  </div>
                  <span
                    className={[
                      'text-xs font-medium hidden sm:block transition-colors',
                      isCurrent ? 'text-emerald-700' : isFuture ? 'text-stone-300' : 'text-stone-500',
                    ].join(' ')}
                  >
                    {stepLabels[i]}
                  </span>
                </div>

                {step < totalSteps && (
                  <div className="flex-1 h-0.5 mx-2">
                    <div
                      className={[
                        'h-full rounded-full transition-all duration-500',
                        isCompleted ? 'bg-emerald-500' : 'bg-stone-100',
                      ].join(' ')}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
