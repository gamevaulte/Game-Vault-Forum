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
  slot = '1234567890',
  format = 'horizontal',
  className = ''
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // Ad blocker active or script unfulfilled
      setHasError(true);
    }
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

  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
      {/* Required Google Policy Label */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 text-[10px] uppercase font-['Rajdhani'] tracking-widest text-gray-400 font-semibold select-none">
        <span>Advertisement</span>
        <span className="font-mono text-[9px] text-purple-400/60">Google AdSense</span>
      </div>

      {/* Responsive Ad Placement Wrapper */}
      <div
        className={`${getContainerDimensions()} rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center overflow-hidden relative shadow-inner`}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center' }}
          data-ad-client="ca-pub-6121667798720008"
          data-ad-slot={slot}
          data-ad-format={format === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />

        {/* AdSense Verification Placement Indicator (Shown when pending AdSense approval or in dev) */}
        {!adLoaded || hasError ? (
          <div className="p-4 text-center space-y-1.5 select-none pointer-events-none opacity-40">
            <span className="text-xs font-['Rajdhani'] uppercase tracking-wider text-purple-300 font-bold block">
              Google AdSense Placement
            </span>
            <p className="text-[11px] text-gray-500 font-mono">
              Publisher ID: ca-pub-6121667798720008 • Responsive Banner
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
