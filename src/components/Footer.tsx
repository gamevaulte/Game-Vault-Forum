import React, { useState } from 'react';
import { Youtube, Twitter, Disc as Discord, Shield, Check, Send, ChevronRight, Lock } from 'lucide-react';
import { PageTab } from '../types';
import { VaultLogo } from './VaultLogo';
import { YOUTUBE_CHANNEL } from '../lib/constants';

interface FooterProps {
  onSelectTab: (tab: PageTab) => void;
  onSubscribeNewsletter: (email: string) => void;
  onOpenGuidelines: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onSubscribeNewsletter,
  onOpenGuidelines,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies,
  onOpenContact
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    onSubscribeNewsletter(email);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          {/* Col 1: Brand & Mission (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <VaultLogo size="lg" />
            <p className="text-purple-300/90 font-['Space_Grotesk'] text-sm italic font-medium">
              "Your Vault for Everything Gaming."
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Game Vault Forum is a dedicated gaming media hub, YouTube production house, and civil community forum where gamers discover new titles, analyze deep gameplay mechanics, read honest reviews, and engage in civil discussions.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
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
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/60 hover:bg-white/10 hover:text-indigo-400 text-gray-300 flex items-center justify-center backdrop-blur-md transition-colors"
                title="Discord Community"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/60 hover:bg-white/10 hover:text-cyan-400 text-gray-300 flex items-center justify-center backdrop-blur-md transition-colors"
                title="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>www.gamevault.forum</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
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

          {/* Col 3: Community & Policies */}
          <div>
            <h3 className="font-['Rajdhani'] font-bold text-base uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              Community
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/forum"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab('forum');
                  }}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
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
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
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
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Community Guidelines</span>
                </a>
              </li>
              <li>
                <a
                  href={YOUTUBE_CHANNEL.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  <span>YouTube Channel ({YOUTUBE_CHANNEL.handle})</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
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

          {/* Col 4: Newsletter "Stay in the Vault" */}
          <div>
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
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
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
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Game Vault Forum • Founded by Joel Ayuba. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a 
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenContact) onOpenContact();
                else onSelectTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-gray-300 transition-colors cursor-pointer"
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
