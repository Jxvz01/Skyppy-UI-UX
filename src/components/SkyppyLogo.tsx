import React from 'react';

interface SkyppyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'color' | 'white' | 'dark';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

export const SkyppyEmblem: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 40,
  className = '',
  color = '#366eb6'
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Skyppy Official Emblem"
    >
      <rect width="512" height="512" rx="115" fill={color} />
      <text
        x="256"
        y="380"
        textAnchor="middle"
        fontFamily="'QurovaDEMO-Medium', 'Qurova', sans-serif"
        fontSize="400"
        fontWeight="400"
        fill="#ffffff"
      >
        S
      </text>
    </svg>
  );
};

export const SkyppyLogo: React.FC<SkyppyLogoProps> = ({
  size = 'md',
  variant = 'color',
  showWordmark = true,
  showSubtitle = true,
  subtitle = 'Urban Mobility',
  className = ''
}) => {
  const sizeMap = {
    xs: { icon: 24, text: 'text-base', sub: 'text-[8.5px]' },
    sm: { icon: 28, text: 'text-[18px]', sub: 'text-[9px]' },
    md: { icon: 40, text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 52, text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 68, text: 'text-4xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  const brandColor = variant === 'white' ? '#ffffff' : '#366eb6';
  const textColor =
    variant === 'white'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-on-surface'
      : 'text-[#366eb6] dark:text-white';

  const subColor =
    variant === 'white'
      ? 'text-white/70'
      : 'text-secondary dark:text-secondary-fixed';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <SkyppyEmblem
        size={currentSize.icon}
        color={variant === 'white' ? '#ffffff25' : '#366eb6'}
      />

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-normal tracking-tight font-['QurovaDEMO-Medium','Qurova',sans-serif] ${currentSize.text} ${textColor}`}
            style={{ fontFamily: "'QurovaDEMO-Medium', 'Qurova', sans-serif" }}
          >
            Skyppy
          </span>
          {showSubtitle && (
            <span
              className={`uppercase tracking-widest font-semibold font-sans mt-0.5 ${currentSize.sub} ${subColor}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SkyppyLogo;

