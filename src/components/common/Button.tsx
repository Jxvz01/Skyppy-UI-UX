import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive' | 'lime';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes for crisp typography, tactile press, and consistent transition
  const baseClasses =
    'inline-flex items-center justify-center font-bold tracking-tight select-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1';

  // Variant styles
  const variantClasses = {
    primary:
      'bg-primary hover:bg-brand-primary-hover text-white shadow-card border border-primary/20',
    secondary:
      'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30',
    tertiary:
      'bg-surface-container-low hover:bg-surface-container text-tertiary hover:text-on-surface border border-transparent',
    outline:
      'bg-transparent hover:bg-surface-container text-primary border border-primary/30',
    ghost:
      'bg-transparent hover:bg-surface-container text-on-surface hover:text-primary',
    destructive:
      'bg-red-600 hover:bg-red-700 text-white shadow-card border border-red-700/20',
    lime:
      'bg-brand-secondary hover:bg-brand-secondary-hover text-slate-950 font-extrabold shadow-sm border border-brand-secondary-dark/30'
  }[variant];

  // Size styles
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-11 px-4 text-sm rounded-xl gap-2',
    lg: 'h-13 px-6 text-base rounded-2xl gap-2.5',
    icon: 'w-10 h-10 p-0 rounded-full flex items-center justify-center'
  }[size];

  const renderIcon = (icon: React.ReactNode | string) => {
    if (typeof icon === 'string') {
      return <span className="material-symbols-outlined text-[18px] shrink-0 leading-none">{icon}</span>;
    }
    return icon;
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon && renderIcon(leftIcon)
      )}
      {children && <span className="truncate">{children}</span>}
      {!isLoading && rightIcon && renderIcon(rightIcon)}
    </button>
  );
};
