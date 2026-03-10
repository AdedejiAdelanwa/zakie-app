import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  prefix,
  suffix,
  error,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-stone-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div
        className={[
          'flex items-center rounded-xl border bg-white transition-all duration-150',
          error
            ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-rose-400'
            : 'border-stone-200 hover:border-stone-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500',
        ].join(' ')}
      >
        {prefix && (
          <span className="pl-3 pr-1 text-stone-500 text-base font-medium pointer-events-none select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          {...props}
          className={[
            'flex-1 min-w-0 bg-transparent text-stone-900 placeholder-stone-400 focus:outline-none',
            prefix ? 'pl-1' : 'pl-3',
            suffix ? 'pr-1' : 'pr-3',
            'py-2.5 text-base',
            className,
          ].join(' ')}
        />
        {suffix && (
          <span className="pr-3 pl-1 text-stone-400 text-sm pointer-events-none select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
};
