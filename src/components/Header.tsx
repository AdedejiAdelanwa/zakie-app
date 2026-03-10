import React from 'react';
import { Moon } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white no-print">
      <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-3">
        <div className="bg-amber-400 rounded-xl p-2 shadow-lg shadow-emerald-900/30 shrink-0">
          <Moon className="h-6 w-6 text-emerald-900 fill-emerald-900" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">Zakat Calculator</h1>
          <p className="text-emerald-200 text-xs mt-0.5">
            Calculate your annual obligation with live metal prices
          </p>
        </div>
      </div>
    </header>
  );
};
