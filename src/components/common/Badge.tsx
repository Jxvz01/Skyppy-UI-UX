import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
  icon?: React.ReactNode | string;
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  pulse = false,
  className = ''
}) => {
  const baseClasses =
    'inline-flex items-center font-bold tracking-tight select-none rounded-full whitespace-nowrap';

  const variantClasses = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-brand-secondary/20 text-slate-900 border border-brand-secondary/40',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    error: 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20',
    neutral: 'bg-surface-container text-tertiary border border-outline-variant/25',
    dark: 'bg-slate-900/90 text-white backdrop-blur-md border border-white/15'
  }[variant];

  const sizeClasses = {
    sm: 'text-[9.5px] px-2 py-0.5 gap-1 leading-none',
    md: 'text-[11px] px-2.5 py-1 gap-1.5 leading-tight'
  }[size];

  const renderIcon = (i: React.ReactNode | string) => {
    if (typeof i === 'string') {
      return <span className="material-symbols-outlined text-[13px] leading-none">{i}</span>;
    }
    return i;
  };

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping shrink-0" />}
      {icon && renderIcon(icon)}
      <span>{children}</span>
    </span>
  );
};
