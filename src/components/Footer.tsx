import React, { useState } from 'react';
import { Youtube, Twitter, Disc as Discord, Shield, Check, Send, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { PageTab } from '../types';
import { VaultLogo } from './VaultLogo';
import { YOUTUBE_CHANNEL, DISCORD_URL, TWITTER_URL } from '../lib/constants';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
  onSubscribeNewsletter: (email: string) => Promise<void> | void;
  onOpenGuidelines: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
  onOpenContact?: () => void;
  onOpenBrandKit?: () => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSubscribeNewsletter,
  onOpenGuidelines,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies,
  onOpenContact,
  onOpenBrandKit,
  onOpenSitemap
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    try {
      await onSubscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch {
      // handled upstream via toast
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks: { id: PageTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'videos', label: 'Videos' },
    { id: 'games', label: 'Games' },
    { id: 'articles', label: 'Articles' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'guides', label: 'Guides' },
    { id: 'forum', label: 'Forum' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <footer className="w-full bg-black/40 backdrop-blur-2xl border-t border-white/5 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-purple-900/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 mb-14">
          {/* Col 1: Brand & Mission */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 space-y-4">
            <VaultLogo size="lg" />
            <p className="text-purple-300/90 font-['Space_Grotesk'] text-sm italic font-medium">
              "Your Vault for Everything Gaming."
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Game Vault Forum is a dedicated gaming media hub, YouTube production house, and civil community forum where gamers discover new titles, analyze deep gameplay mechanics, read honest reviews, and engage in civil discussions.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/60 hover:bg-white/10 hover:text-red-400 text-gray-300 flex items-center justify-center backdrop-blur-md transition-colors"
                title={`Game Vault Forum on YouTube (${YOUTUBE_CHANNEL.handle})`}
              >
                <Youtube className="w-4 h-4 fill-current" />
              </a>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/60 hover:bg-white/10 hover:text-indigo-400 text-gray-300 flex items-center justify-center backdrop-blur-md transition-colors"
                title="Discord Community (discord.gg/73wDpN69)"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/60 hover:bg-white/10 hover:text-cyan-400 text-gray-300 flex items-center justify-center backdrop-blur-md transition-colors"
                title="X / Twitter (@gamevaultforum)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>gamevault.forum</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-['Rajdhani'] font-bold text-base uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {navLinks.map((link) => {
                const href = link.id === 'home' ? '/' : `/${link.id}`;
                return (
                  <li key={link.id}>
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectTab(link.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-purple-300 transition-colors flex items-center gap-1.5 group text-left"
                    >
                      <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Gaming Tools */}
          <div className="lg:col-span-2">
            <h3 className="font-['Rajdhani'] font-bold text-base uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              Gaming Tools
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/tools/vault-ai"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('vault-ai');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-300 text-purple-300 font-semibold transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span>Vault AI Assistant</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-bold">
                    AI
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/tools/gaming-username-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('gaming-username-generator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Username Generator</span>
                </a>
              </li>
              <li>
                <a
                  href="/tools/gaming-pc-builder"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('gaming-pc-builder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Gaming PC Builder</span>
                </a>
              </li>
              <li>
                <a
                  href="/tools/pc-game-requirements-checker"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('pc-requirements');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span>PC Requirements Checker</span>
                </a>
              </li>
              <li>
                <a
                  href="/tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('tools');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span>All Gaming Tools</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Community */}
          <div className="lg:col-span-2">
            <h3 className="font-['Rajdhani'] font-bold text-base uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              Community
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/forum"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('forum');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  <span>Join the Forum</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenContact) onOpenContact();
                    else onSelectTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  <span>Contact Editorial Desk</span>
                </a>
              </li>
              <li>
                <a
                  href="/guidelines"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenGuidelines();
                  }}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  <span>Community Guidelines</span>
                </a>
              </li>
              <li>
                <a
                  href={YOUTUBE_CHANNEL.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  <span>YouTube Channel ({YOUTUBE_CHANNEL.handle})</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  <span>XML Sitemap (Search Console)</span>
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-2 text-[11px] font-mono bg-white/5 text-purple-300 border border-white/10 rounded-full backdrop-blur-md">
                  <Lock className="w-3 h-3" />
                  Vault Protocol v2.6
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter "Stay in the Vault" */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3">
            <h3 className="font-['Rajdhani'] font-bold text-base uppercase tracking-wider text-white mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              Stay in the Vault
            </h3>
            <p className="text-gray-400 text-xs mb-3.5 leading-relaxed">
              Get the latest gaming articles, videos, guides, and community updates delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {submitting ? (
                  <span>Registering...</span>
                ) : subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Subscribe to Vault</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>© 2026 Game Vault Forum • Founded by Joel Ayuba. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6">
            <a 
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-purple-300 text-purple-400 font-medium transition-colors cursor-pointer"
            >
              About Us
            </a>
            <a 
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenContact) onOpenContact();
                else onSelectTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-purple-300 text-purple-400 font-medium transition-colors cursor-pointer"
            >
              Contact Us
            </a>
            <a 
              href="/guidelines"
              onClick={(e) => {
                e.preventDefault();
                onOpenGuidelines();
              }}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Community Guidelines
            </a>
            <a 
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenPrivacy) onOpenPrivacy();
                else onOpenGuidelines();
              }}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenTerms) onOpenTerms();
                else onOpenGuidelines();
              }}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
            <a 
              href="/cookies"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenCookies) onOpenCookies();
                else onOpenGuidelines();
              }}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Cookie Policy
            </a>
            <a 
              href="/sitemap"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenSitemap) onOpenSitemap();
                else onSelectTab('sitemap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-purple-300 text-purple-400/90 font-medium transition-colors cursor-pointer"
            >
              Sitemap
            </a>
            <a 
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 transition-colors cursor-pointer text-gray-500 hover:text-purple-400 font-mono text-xs"
            >
              sitemap.xml
            </a>
            <a 
              href="/ads.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors cursor-pointer text-gray-500 hover:text-purple-400 font-mono"
            >
              ads.txt
            </a>
            <a 
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors cursor-pointer text-gray-600 hover:text-gray-400"
            >
              robots.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
