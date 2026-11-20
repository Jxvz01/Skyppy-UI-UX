import React from 'react';
import { motion } from 'framer-motion';

export interface SegmentedControlOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'p-0.5 text-xs h-8',
    md: 'p-1 text-xs sm:text-sm h-10',
    lg: 'p-1.5 text-sm sm:text-base h-12'
  };

  const itemPadding = {
    sm: 'px-2.5 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2'
  };

  return (
    <div
      className={`relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl select-none ${
        sizeClasses[size]
      } ${fullWidth ? 'w-full' : 'inline-flex'} ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(opt.id)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 font-medium transition-colors duration-150 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
              itemPadding[size]
            } ${
              isSelected
                ? 'text-brand-navy font-semibold dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-control-active"
                className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700/50 z-[-1]"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            {opt.icon && <span className="shrink-0 flex items-center">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-brand-primary text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedControl;
