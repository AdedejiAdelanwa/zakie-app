import { useReducer, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { Toast } from './components/ui/Toast';
import { Step1Setup } from './components/steps/Step1Setup';
import { Step2Assets } from './components/steps/Step2Assets';
import { Step3Liabilities } from './components/steps/Step3Liabilities';
import { ResultsPage } from './components/steps/ResultsPage';
import {
  ZakatState,
  ZakatAction,
  ToastMessage,
} from './types';
import { getDefaultCurrency } from './utils/formatters';

const initialState: ZakatState = {
  currentStep: 1,
  nisabStandard: 'gold',
  currency: getDefaultCurrency(),
  metalPrices: null,
  manualGoldPrice: '',
  manualSilverPrice: '',
  useManualPrices: false,
  assets: {
    cash: 0,
    goldSilver: 0,
    businessInventory: 0,
    investments: 0,
    receivables: 0,
    pension: 0,
    realEstate: 0,
  },
  liabilities: {
    shortTermDebts: 0,
    longTermDebts: 0,
    otherLiabilities: 0,
  },
};

function zakatReducer(state: ZakatState, action: ZakatAction): ZakatState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_NISAB_STANDARD':
      return { ...state, nisabStandard: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload, metalPrices: null };
    case 'SET_METAL_PRICES':
      return { ...state, metalPrices: action.payload };
    case 'SET_MANUAL_GOLD_PRICE':
      return { ...state, manualGoldPrice: action.payload };
    case 'SET_MANUAL_SILVER_PRICE':
      return { ...state, manualSilverPrice: action.payload };
    case 'SET_USE_MANUAL_PRICES':
      return { ...state, useManualPrices: action.payload };
    case 'SET_ASSET':
      return {
        ...state,
        assets: { ...state.assets, [action.payload.key]: action.payload.value },
      };
    case 'SET_LIABILITY':
      return {
        ...state,
        liabilities: { ...state.liabilities, [action.payload.key]: action.payload.value },
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [state, dispatch] = useReducer(zakatReducer, initialState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: 'info' | 'success' | 'error', message: string, loading = false): string => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, type, message, loading }]);
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAddToast = useCallback(
    (type: 'info' | 'success' | 'error', message: string, loading = false): string => {
      return addToast(type, message, loading);
    },
    [addToast]
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Header />
      {state.currentStep < 4 && (
        <StepIndicator currentStep={state.currentStep} totalSteps={4} />
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {state.currentStep === 1 && (
            <Step1Setup
              key="step1"
              state={state}
              dispatch={dispatch}
              addToast={handleAddToast}
              dismissToast={dismissToast}
            />
          )}
          {state.currentStep === 2 && (
            <Step2Assets key="step2" state={state} dispatch={dispatch} />
          )}
          {state.currentStep === 3 && (
            <Step3Liabilities key="step3" state={state} dispatch={dispatch} />
          )}
          {state.currentStep === 4 && (
            <ResultsPage
              key="step4"
              state={state}
              dispatch={dispatch}
              addToast={handleAddToast}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center py-6 px-4 no-print">
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          All calculations are done locally in your browser. This is a guide only —
          consult a scholar for your specific situation.
        </p>
      </footer>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
