import React from 'react';

interface SahaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  tagline?: string;
  variant?: 'light' | 'dark' | 'transparent';
}

const sizeMap = {
  xs: 'w-6 h-6 rounded-md',
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
  xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl',
  '2xl': 'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl',
};

export const SahaLogo: React.FC<SahaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  tagline,
  variant = 'light'
}) => {
  const bgClass =
    variant === 'light'
      ? 'bg-white border border-slate-200 shadow-sm'
      : variant === 'dark'
      ? 'bg-slate-900 border border-slate-700 shadow-md'
      : 'bg-transparent';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Strictly Square Logo Container */}
      <div
        className={`aspect-square shrink-0 overflow-hidden flex items-center justify-center p-0.5 ${sizeMap[size]} ${bgClass}`}
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src="/saha_logo.jpg"
          alt="SAHA Logo"
          className="w-full h-full object-contain rounded-[inherit]"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              SAHA
            </span>
          </div>
          {tagline && (
            <p className="text-xs text-slate-500 font-medium tracking-tight">
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
