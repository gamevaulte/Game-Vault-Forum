import React, { useState } from 'react';
import { WheelGameEntry } from '../../types/gamePickerWheel';
import { Share2, Copy, Check, X, Globe } from 'lucide-react';

interface ShareWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: WheelGameEntry[];
}

export const ShareWheelModal: React.FC<ShareWheelModalProps> = ({
  isOpen,
  onClose,
  games,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate shareable URL
  const generateShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const base = `${window.location.origin}/game-picker-wheel`;
    if (games.length === 0) return base;
    const gameNames = games.map((g) => g.name).join(',');
    return `${base}?games=${encodeURIComponent(gameNames)}`;
  };

  const shareUrl = generateShareUrl();

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spin My Game Picker Wheel on Game Vault Forum!',
          text: `Can't decide what to play? Spin this wheel of ${games.length} games:`,
          url: shareUrl,
        });
      } catch {
        // User canceled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Share2 className="w-5 h-5" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Share Your Wheel
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Anyone with this link can load your exact wheel with {games.length} games and spin it directly on their device.
        </p>

        {/* Copy Link Input Box */}
        <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-700 rounded-xl">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-2 text-xs text-slate-300 outline-none select-all truncate font-mono"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-['Space_Grotesk'] uppercase flex items-center gap-1 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Native share button if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Globe className="w-4 h-4 text-purple-400" />
            Share via Apps / Socials
          </button>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
