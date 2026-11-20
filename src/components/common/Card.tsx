import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'dark' | 'tinted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200 overflow-hidden relative';

  const variantClasses = {
    default:
      'bg-surface-container-lowest border border-outline-variant/25 shadow-card text-on-surface',
    elevated:
      'bg-surface-container-lowest border border-outline-variant/30 shadow-elevated text-on-surface',
    interactive:
      'bg-surface-container-lowest border border-outline-variant/25 shadow-card text-on-surface hover:border-primary/50 hover:shadow-elevated active:scale-[0.99] cursor-pointer',
    dark:
      'bg-brand-navy-card border border-brand-navy-border/80 text-white shadow-card',
    tinted:
      'bg-surface-container-low border border-surface-container-high/60 text-on-surface'
  }[variant];

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5 sm:p-6'
  }[padding];

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${paddingClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
