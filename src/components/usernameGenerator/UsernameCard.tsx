import React, { useState } from 'react';
import { Copy, Check, Heart, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { GeneratedUsername } from '../../types/usernameGenerator';
import { SUPPORTED_PLATFORMS } from '../../lib/usernameGenerator';

interface UsernameCardProps {
  username: GeneratedUsername;
  onCopy: (name: string) => void;
  onRegenerate: (id: string) => void;
  onToggleFavorite: (username: GeneratedUsername) => void;
  isFavorited: boolean;
}

export const UsernameCard: React.FC<UsernameCardProps> = ({
  username,
  onCopy,
  onRegenerate,
  onToggleFavorite,
  isFavorited
}) => {
  const [copied, setCopied] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);

  const handleCopy = () => {
    onCopy(username.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl bg-[#111322] border border-[#232742] hover:border-purple-500/40 p-4 transition-all duration-200 flex flex-col justify-between group shadow-lg shadow-black/40">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
            {username.style}
          </span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
            {username.theme}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {username.length} chars
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={() => onToggleFavorite(username)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isFavorited
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
          }`}
          title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Main Username Display */}
      <div className="my-2 select-all">
        <div className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white tracking-wide group-hover:text-purple-300 transition-colors break-all">
          {username.name}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Regenerate Item Button */}
          <button
            type="button"
            onClick={() => onRegenerate(username.id)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Regenerate this slot"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Platform Availability Check Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPlatformMenu(!showPlatformMenu)}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 px-2 py-1 rounded bg-black/40 hover:bg-black/60 border border-white/5 transition-colors cursor-pointer"
            title="Check handle on platforms"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Check</span>
          </button>

          {showPlatformMenu && (
            <div className="absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-[#141729] border border-purple-500/40 shadow-2xl p-2 z-30 text-xs">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-white/10 mb-1">
                Lookup on platforms (Availability varies):
              </div>
              <div className="space-y-1">
                {SUPPORTED_PLATFORMS.map(p => (
                  <a
                    key={p.id}
                    href={p.checkUrlTemplate(username.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/10 text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{p.name}</span>
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                  </a>
                ))}
              </div>
              <div className="mt-2 pt-1 border-t border-white/10 text-[9px] text-slate-400 px-1 italic">
                Direct lookup link. Availability depends on the platform you want to use this name on.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
