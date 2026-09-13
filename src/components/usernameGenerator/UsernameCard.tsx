import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Heart, RefreshCw, ExternalLink, CheckCircle2, MessageSquare, Gamepad2, Twitter, Youtube } from 'lucide-react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowPlatformMenu(false);
      }
    };
    if (showPlatformMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlatformMenu]);

  const handleCopy = () => {
    onCopy(username.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformClick = (platformName: string) => {
    onCopy(username.name);
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

      {/* Main Username Display with Quick Sign Up Links */}
      <div className="my-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white tracking-wide group-hover:text-purple-300 transition-colors break-all select-all">
            {username.name}
          </div>

          {/* Quick Sign-up Platform Badges Beside Username */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href="https://www.twitch.tv/signup"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePlatformClick('Twitch')}
              className="p-1 rounded-md bg-purple-950/60 hover:bg-[#9146FF]/30 border border-purple-800/40 hover:border-[#9146FF]/60 text-purple-300 hover:text-[#9146FF] transition-all"
              title={`Sign up on Twitch (copies "${username.name}")`}
            >
              <span className="text-[10px] font-mono font-bold px-0.5">Twitch</span>
            </a>
            <a
              href="https://x.com/i/flow/signup"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePlatformClick('X')}
              className="p-1 rounded-md bg-black/60 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-all"
              title={`Sign up on X / Twitter (copies "${username.name}")`}
            >
              <span className="text-[10px] font-mono font-bold px-0.5">X</span>
            </a>
            <a
              href="https://discord.com/register"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePlatformClick('Discord')}
              className="p-1 rounded-md bg-indigo-950/60 hover:bg-[#5865F2]/30 border border-indigo-800/40 hover:border-[#5865F2]/60 text-indigo-300 hover:text-[#5865F2] transition-all"
              title={`Sign up on Discord (copies "${username.name}")`}
            >
              <span className="text-[10px] font-mono font-bold px-0.5">Discord</span>
            </a>
            <a
              href="https://store.steampowered.com/join/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePlatformClick('Steam')}
              className="p-1 rounded-md bg-sky-950/60 hover:bg-sky-500/30 border border-sky-800/40 hover:border-sky-400/60 text-sky-300 hover:text-sky-200 transition-all"
              title={`Sign up on Steam (copies "${username.name}")`}
            >
              <span className="text-[10px] font-mono font-bold px-0.5">Steam</span>
            </a>
          </div>
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

        {/* Platform Availability Check Dropdown with CheckCircle2 icon */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowPlatformMenu(!showPlatformMenu)}
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 hover:text-cyan-300 px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors cursor-pointer"
            title="Check availability and register username on all platforms"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Check & Sign Up</span>
          </button>

          {showPlatformMenu && (
            <div className="absolute right-0 bottom-full mb-2 w-80 rounded-2xl bg-[#141729] border border-purple-500/40 shadow-2xl p-3 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-cyan-300 border-b border-white/10 mb-2">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Sign Up on Platforms:
                </span>
                <span className="text-[10px] text-purple-300 font-mono font-bold truncate max-w-[120px]">
                  "{username.name}"
                </span>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {SUPPORTED_PLATFORMS.map(p => {
                  const signUpUrl = p.signUpUrlTemplate ? p.signUpUrlTemplate(username.name) : p.checkUrlTemplate(username.name);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-colors gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.guidance.split('.')[0]}</div>
                      </div>
                      <a
                        href={signUpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handlePlatformClick(p.name)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-[10px] font-mono font-bold shrink-0 transition-colors"
                        title={`Open ${p.name} sign up page`}
                      >
                        <span>Sign Up</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] text-slate-400 px-1 leading-relaxed">
                Clicking <strong className="text-purple-300">Sign Up</strong> copies <span className="font-mono text-cyan-300">"{username.name}"</span> to your clipboard and opens the platform's registration page.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
