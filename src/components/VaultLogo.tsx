import React from 'react';

interface VaultLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const VaultLogo: React.FC<VaultLogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Vault Door Hexagonal Motif */}
      <div className={`relative ${iconSize} flex items-center justify-center`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-purple-600/30 rounded-lg blur-sm group-hover:bg-purple-500/40 transition-colors" />
        
        {/* Outer Vault Hexagon border */}
        <div className="relative w-full h-full bg-[#121420] border border-purple-500/40 rounded-lg flex items-center justify-center shadow-inner group-hover:border-purple-400/70 transition-all duration-300">
          {/* Subtle vault gear notches */}
          <div className="absolute w-1.5 h-1.5 bg-cyan-400/80 rounded-full top-1 left-1" />
          <div className="absolute w-1.5 h-1.5 bg-cyan-400/80 rounded-full bottom-1 right-1" />
          
          {/* Inner Vault Door Wheel */}
          <svg
            className="w-5 h-5 text-purple-400 group-hover:text-cyan-300 transition-colors duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4v4" />
            <path d="M12 16v4" />
            <path d="M4 12h4" />
            <path d="M16 12h4" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-['Rajdhani'] font-bold tracking-wider ${titleSize} text-white uppercase`}>
            Game Vault
          </span>
          <span className={`font-['Rajdhani'] font-semibold tracking-wider ${titleSize} text-purple-400 uppercase`}>
            Forum
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-['Space_Grotesk'] font-medium -mt-1">
            Watch • Play • Discuss • Discover
          </span>
        )}
      </div>
    </div>
  );
};
