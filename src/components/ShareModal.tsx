import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink,
  MessageCircle,
  Twitter,
  Facebook,
  Send,
  Linkedin,
  Globe
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
  onCopiedToast?: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  description,
  onCopiedToast
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareText = encodeURIComponent(`${title} — Game Vault Forum\n${url}`);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if (onCopiedToast) {
        onCopiedToast('Link copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url
        });
        onClose();
      } catch (err) {
        // User aborted or unfulfilled
      }
    }
  };

  const socialChannels = [
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: 'bg-black hover:bg-neutral-900 text-white border-white/20',
      shareUrl: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border-[#25D366]/40',
      shareUrl: `https://api.whatsapp.com/send?text=${shareText}`
    },
    {
      name: 'Reddit',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.25a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .688.56 1.25 1.25 1.25.688 0 1.25-.56 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.412a.48.48 0 0 0-.07.674c.48.653 1.572 1.134 2.785 1.134 1.213 0 2.305-.481 2.785-1.134a.48.48 0 0 0-.74-.616c-.328.447-1.183.82-2.045.82-.863 0-1.717-.373-2.045-.82a.478.478 0 0 0-.67-.058z" />
        </svg>
      ),
      color: 'bg-[#FF4500]/20 hover:bg-[#FF4500]/30 text-[#FF4500] border-[#FF4500]/40',
      shareUrl: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      color: 'bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] border-[#1877F2]/40',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'Telegram',
      icon: <Send className="w-4 h-4" />,
      color: 'bg-[#229ED9]/20 hover:bg-[#229ED9]/30 text-[#229ED9] border-[#229ED9]/40',
      shareUrl: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      color: 'bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] border-[#0A66C2]/40',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0c0e18] border border-purple-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
              <Share2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Share Content
              </h3>
              <p className="text-xs text-gray-400">
                Share with fellow gamers and communities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Preview Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-mono text-purple-400 font-semibold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>gamevault.forum</span>
          </div>
          <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-gray-400 line-clamp-1">
              {description}
            </p>
          )}
        </div>

        {/* Major Social Networks Grid */}
        <div className="space-y-3 relative z-10">
          <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-400">
            Share to Social Networks
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {socialChannels.map((channel) => (
              <a
                key={channel.name}
                href={channel.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:scale-[1.03] active:scale-[0.98] ${channel.color}`}
              >
                <div className="mb-1">{channel.icon}</div>
                <span className="text-[11px] font-medium font-['Inter'] truncate max-w-full">
                  {channel.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Native Web Share Button (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-purple-400" />
            <span>Share via Device System Menu</span>
          </button>
        )}

        {/* Copy Link Section */}
        <div className="space-y-2 relative z-10">
          <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-400 block">
            Or Copy Link
          </label>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-black/60 border border-white/15 focus-within:border-purple-500/80 transition-all">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-gray-300 font-mono w-full focus:outline-none select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                copied
                  ? 'bg-green-600 text-white shadow-lg shadow-green-950/50'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
