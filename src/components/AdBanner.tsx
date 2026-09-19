import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'in-article';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'horizontal',
  className = ''
}) => {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    try {
      if (typeof window !== 'undefined') {
        timeoutId = setTimeout(() => {
          try {
            if (adRef.current && adRef.current.clientWidth > 0) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
          } catch (err) {
            // Silently caught to avoid unhandled exceptions
          }
        }, 200);
      }
    } catch (e) {
      // Ad blocker active or script unfulfilled
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const getContainerDimensions = () => {
    switch (format) {
      case 'rectangle':
        return 'w-full max-w-[336px] min-h-[280px]';
      case 'in-article':
        return 'w-full min-h-[120px] sm:min-h-[140px]';
      case 'horizontal':
      default:
        return 'w-full min-h-[90px] sm:min-h-[100px] max-w-5xl mx-auto';
    }
  };

  const hasValidSlot = slot && slot !== '1234567890';

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      {/* Strict Google Policy Compliant Label */}
      <div className="w-full flex items-center justify-start px-2 pb-1.5 text-[10px] uppercase font-['Rajdhani'] tracking-widest text-gray-500 font-semibold select-none">
        <span>Advertisement</span>
      </div>

      {/* Responsive Ad Unit Container */}
      <div
        className={`${getContainerDimensions()} rounded-2xl bg-black/20 border border-white/5 flex flex-col items-center justify-center overflow-hidden relative`}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center' }}
          data-ad-client="ca-pub-6121667798720008"
          {...(hasValidSlot ? { 'data-ad-slot': slot } : {})}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
