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
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-stone-500 text-sm font-medium">{prefix}</span>
          </span>
        )}
        <input
          id={inputId}
          {...props}
          className={[
            'w-full rounded-xl border bg-white text-stone-900 placeholder-stone-400 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            error
              ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400'
              : 'border-stone-200 hover:border-stone-300',
            prefix ? 'pl-10' : 'pl-3',
            suffix ? 'pr-16' : 'pr-3',
            'py-2.5 text-sm',
            className,
          ].join(' ')}
        />
        {suffix && (
          <span className="absolute right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-stone-400 text-xs">{suffix}</span>
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
};
