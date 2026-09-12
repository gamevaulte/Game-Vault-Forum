import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Laptop, 
  Layers,
  Image as ImageIcon
} from 'lucide-react';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (message: string, type: 'success' | 'info') => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onShowToast) {
      onShowToast(`Copied ${label} to clipboard`, 'success');
    }
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) {
      onShowToast(`Downloading ${filename}`, 'info');
    }
  };

  const codeSnippet = `<!-- Game Vault Forum High-Definition Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="shortcut icon" href="/favicon.ico" />`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0d0f1a] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#14182e] via-[#0e101f] to-[#17132e] border-b border-white/10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Official Brand Assets & Media Kit
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Official Brand Identity & Vector Assets
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-['Inter']">
              High-resolution vector SVG favicons, multi-size ICO files, retina PNG icons, and an animated image-only logo GIF for Game Vault Forum.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* 1. THE IMAGE-ONLY LOGO .GIF SECTION */}
          <section className="p-6 rounded-2xl bg-[#111425] border border-cyan-500/30 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Animated GIF Preview Container */}
              <div className="relative shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080911] border border-cyan-500/40 shadow-xl shadow-cyan-950/40">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <img
                    src="/game-vault-logo.gif"
                    alt="Game Vault Forum Animated Image-Only Logo GIF"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  />
                </div>
                <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Animated 24-FPS Looping GIF
                </span>
              </div>

              {/* Information & Download Actions */}
              <div className="space-y-4 flex-1 text-center lg:text-left">
                <div className="space-y-1">
                  <span className="text-xs font-bold font-['Rajdhani'] uppercase tracking-widest text-cyan-400">
                    Standalone Image-Only Brand Mark
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                    Game Vault Image-Only Logo (.GIF)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-['Inter'] leading-relaxed">
                    A pure image-only logo featuring the obsidian vault shield badge, 360-degree precision gear rotation, and pulsing cybernetic neon cyan and ultraviolet highlights. Isolated without background clutter—ready for streaming overlays, Discord server icons, forum signatures, video watermarks, or community avatars.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start pt-1">
                  <button
                    onClick={() => handleDownload('/game-vault-logo.gif', 'game-vault-logo.gif')}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Logo .GIF</span>
                  </button>

                  <button
                    onClick={() => handleDownload('/game-vault-logo.svg', 'game-vault-logo.svg')}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Logo .SVG</span>
                  </button>

                  <button
                    onClick={() => handleCopy(
                      `${window.location.origin}/game-vault-logo.gif`,
                      'gif-url',
                      'GIF URL'
                    )}
                    className="px-4 py-2.5 bg-[#1a1f38] hover:bg-[#232a4a] text-slate-200 border border-white/10 font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'gif-url' ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">URL Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy GIF Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href="/game-vault-logo.svg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <span>View SVG</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 2. THE FAVICON SHOWCASE & DOWNLOADS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Website Favicon Package
                </h3>
                <p className="text-xs text-slate-400">
                  Crisp vector SVG, multi-resolution Windows ICO, and high-density Apple Touch PNG icons.
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                Active in Browser
              </span>
            </div>

            {/* Realistic Browser Tab & Dock Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tab Bar Mockup */}
              <div className="p-4 rounded-xl bg-[#090b14] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-['Space_Grotesk']">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Laptop className="w-3.5 h-3.5 text-purple-400" />
                    Browser Tab Preview
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">16x16 / 32x32</span>
                </div>
                {/* Mock browser tab */}
                <div className="p-2 rounded-lg bg-[#141726] border border-white/10 flex items-center gap-2.5 shadow-inner">
                  <img 
                    src="/favicon.svg" 
                    alt="Game Vault Favicon Preview" 
                    className="w-4 h-4 shrink-0" 
                  />
                  <span className="text-xs text-white font-medium truncate">
                    Game Vault Forum | Gaming Videos & Reviews
                  </span>
                  <X className="w-3 h-3 text-gray-500 ml-auto shrink-0" />
                </div>
              </div>

              {/* Mobile / Bookmark Mockup */}
              <div className="p-4 rounded-xl bg-[#090b14] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400 font-['Space_Grotesk']">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    App & Retina Icon
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">180x180 / 512x512</span>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg bg-[#141726] border border-white/10">
                  <img 
                    src="/favicon.png" 
                    alt="Game Vault 512px Icon" 
                    className="w-10 h-10 rounded-xl shadow-lg border border-purple-500/30" 
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                      Game Vault
                    </span>
                    <span className="text-[10px] text-gray-400">gamevault.forum</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Format Download Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* 1. SVG Favicon */}
              <div className="p-4 rounded-2xl bg-[#0f1222] border border-purple-500/20 flex flex-col justify-between space-y-3 hover:border-purple-500/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-purple-400 uppercase">SVG Vector</span>
                    <span className="text-[10px] text-gray-500 font-mono">4.2 KB</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Scalable Favicon</h4>
                  <p className="text-[11px] text-gray-400">
                    Crisp at any resolution, Retina ready, modern browser favorite.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('/favicon.svg', 'favicon.svg')}
                  className="w-full py-2 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl border border-purple-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>

              {/* 2. ICO Multi-Size */}
              <div className="p-4 rounded-2xl bg-[#0f1222] border border-cyan-500/20 flex flex-col justify-between space-y-3 hover:border-cyan-500/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase">ICO File</span>
                    <span className="text-[10px] text-gray-500 font-mono">16/32/48px</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Classic Web ICO</h4>
                  <p className="text-[11px] text-gray-400">
                    Full cross-browser compatibility across legacy & desktop browsers.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('/favicon.ico', 'favicon.ico')}
                  className="w-full py-2 bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl border border-cyan-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ICO</span>
                </button>
              </div>

              {/* 3. 512x512 High-Res PNG */}
              <div className="p-4 rounded-2xl bg-[#0f1222] border border-blue-500/20 flex flex-col justify-between space-y-3 hover:border-blue-500/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-blue-400 uppercase">PNG 512x512</span>
                    <span className="text-[10px] text-gray-500 font-mono">HD Icon</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">High-Res Icon</h4>
                  <p className="text-[11px] text-gray-400">
                    Perfect for PWA web manifests, Android home screens, and press kits.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('/favicon.png', 'favicon-512x512.png')}
                  className="w-full py-2 bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl border border-blue-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              </div>

              {/* 4. Apple Touch Icon 180x180 */}
              <div className="p-4 rounded-2xl bg-[#0f1222] border border-pink-500/20 flex flex-col justify-between space-y-3 hover:border-pink-500/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-pink-400 uppercase">Apple Touch</span>
                    <span className="text-[10px] text-gray-500 font-mono">180x180</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">iOS Home Screen</h4>
                  <p className="text-[11px] text-gray-400">
                    Optimized for iPhone, iPad, and Safari touch bookmarks.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('/apple-touch-icon.png', 'apple-touch-icon.png')}
                  className="w-full py-2 bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl border border-pink-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download iOS</span>
                </button>
              </div>
            </div>
          </section>

          {/* 3. HTML FAVICON SNIPPET CODE BLOCK */}
          <section className="p-5 rounded-2xl bg-[#0b0d18] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                HTML Embedding Reference Code
              </span>
              <button
                onClick={() => handleCopy(codeSnippet, 'html-code', 'HTML snippet')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-semibold"
              >
                {copiedKey === 'html-code' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-black/60 text-[11px] font-mono text-cyan-300 overflow-x-auto border border-white/5 leading-relaxed">
              {codeSnippet}
            </pre>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#0a0c16] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left font-['Inter']">
            © 2026 Game Vault Forum • Designed for gaming enthusiasts, creators, and media partners.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
