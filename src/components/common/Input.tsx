import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  error?: string;
  helperText?: string;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  rightIcon,
  error,
  helperText,
  onClear,
  value,
  className = '',
  disabled,
  ...props
}) => {
  const renderIcon = (icon: React.ReactNode | string) => {
    if (typeof icon === 'string') {
      return <span className="material-symbols-outlined text-[19px] text-tertiary shrink-0">{icon}</span>;
    }
    return icon;
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold text-on-surface tracking-tight">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center w-full h-12 px-3.5 rounded-xl bg-surface-container-lowest border transition-all duration-150 ${
          error
            ? 'border-error ring-1 ring-error/30'
            : 'border-outline-variant/30 hover:border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-container-low' : ''}`}
      >
        {leftIcon && <div className="mr-2.5 flex items-center shrink-0">{renderIcon(leftIcon)}</div>}

        <input
          value={value}
          disabled={disabled}
          className={`flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline font-medium outline-none min-w-0 ${className}`}
          {...props}
        />

        {value && onClear && !disabled && (
          <button
            type="button"
            aria-label="Clear input"
            onClick={onClear}
            className="p-1 rounded-full text-tertiary hover:text-on-surface hover:bg-surface-container transition-colors ml-1 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">close</span>
          </button>
        )}

        {rightIcon && <div className="ml-2 flex items-center shrink-0">{renderIcon(rightIcon)}</div>}
      </div>

      {error ? (
        <span className="text-[11px] font-semibold text-error tracking-tight">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-tertiary">{helperText}</span>
      ) : null}
    </div>
  );
};
