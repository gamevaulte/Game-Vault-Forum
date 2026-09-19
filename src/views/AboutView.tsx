import React from 'react';
import { 
  Shield, 
  Youtube, 
  Gamepad2, 
  MessageSquare, 
  Star, 
  Compass, 
  BookOpen, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Download
} from 'lucide-react';
import { VaultLogo } from '../components/VaultLogo';
import { YOUTUBE_CHANNEL } from '../lib/constants';

interface AboutViewProps {
  onNavigateTab: (tab: any) => void;
  onOpenBrandKit?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab, onOpenBrandKit }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Brand Hero Introduction */}
      <div className="text-center space-y-6">
        <div className="inline-flex justify-center mb-2">
          <VaultLogo size="lg" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          Welcome to Game Vault Forum
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-cyan-300 font-['Space_Grotesk']">
          Watch. Play. Discuss. Discover.
        </p>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-['Inter'] leading-relaxed">
          Game Vault Forum was built around a singular philosophy: gaming media should be crafted by passionate players who actually spend hundreds of hours mastering games, analyzing mechanics, and valuing civil, thoughtful community dialogue.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 bg-red-600 hover:bg-red-500 text-white font-['Rajdhani'] font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-red-950/60 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Youtube className="w-5 h-5 fill-current" />
            <span>Watch {YOUTUBE_CHANNEL.handle} on YouTube</span>
          </a>

          <button
            onClick={() => onNavigateTab('forum')}
            className="px-7 py-3 bg-[#131627] hover:bg-[#1a1f33] text-slate-200 font-['Rajdhani'] font-bold text-sm tracking-wider uppercase rounded-xl border border-[#272d47] transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Enter The Forum</span>
          </button>
        </div>
      </div>

      {/* The Core Mission */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#121528] via-[#0f1220] to-[#141224] border border-[#252c48] space-y-6 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          The Two Pillars: Channel & Community
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-['Inter']">
          Game Vault Forum bridges the gap between high-production YouTube video essays and a real-time, troll-free digital home. While our YouTube channel brings deep tactical showcases, technical benchmarks, and gameplay retrospectives to your screen, our website provides a permanent home for gamers to dissect lore, debate builds, and share discoveries without toxic algorithm bait.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#0b0d17] border border-[#1e2338] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-bold font-['Rajdhani'] uppercase text-base">
                <Youtube className="w-5 h-5 fill-current" />
                The YouTube Channel
              </div>
              <span className="text-xs font-mono text-gray-400">{YOUTUBE_CHANNEL.handle}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              4K mechanical breakdowns, zero-hype honest reviews, boss walkthroughs, and deep lore retrospectives exploring why great games succeed.
            </p>
            <a
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors pt-1"
            >
              <span>Visit {YOUTUBE_CHANNEL.handle}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b0d17] border border-[#1e2338] space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold font-['Rajdhani'] uppercase text-base">
              <MessageSquare className="w-5 h-5" />
              The Discussion Forum
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Categorized sub-forums across PC, PlayStation, Xbox, Nintendo, and Game Help where every operative’s voice and gameplay experience is valued.
            </p>
          </div>
        </div>
      </div>

      {/* What We Cover */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-cyan-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
            What You'll Find in the Vault
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Gamepad2,
              title: 'Comprehensive Gameplay',
              desc: 'High-level tactical showcases and mechanically focused gameplay without fluff.'
            },
            {
              icon: MessageSquare,
              title: 'Civil Gaming Discussions',
              desc: 'Moderated community boards dedicated to constructive discourse, strategy, and mutual help.'
            },
            {
              icon: Star,
              title: 'Uncompromising Reviews',
              desc: 'Objective verdicts scored out of 10 with clear pros, cons, and performance caveats.'
            },
            {
              icon: BookOpen,
              title: 'Gaming Stories & News',
              desc: 'Exploration of game development history, emergent player stories, and industry movements.'
            },
            {
              icon: Compass,
              title: 'Tactical Guides & Builds',
              desc: 'Step-by-step masterclasses, boss walkthroughs, and hardware configurations.'
            },
            {
              icon: Users,
              title: 'Community First',
              desc: 'Member reputation, verified contributor badges, and direct collaboration with creators.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#101322] border border-[#1f243b] space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-300 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Values Banner */}
      <div className="p-8 rounded-3xl bg-[#0c0e18] border border-cyan-500/20 space-y-4">
        <h3 className="text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-cyan-400">
          The Vault Protocol: Integrity in Gaming & Editorial Standards
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-['Inter']">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>No Paid Review Scores:</strong> We never accept payment, hardware embargo bribes, or publisher deals to inflate a review score. All verdicts are 100% independent.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Zero Clickbait:</strong> Our titles, thumbnails, and articles accurately reflect what you are about to watch or read with genuine technical substance.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Transparent Advertising Disclosure:</strong> We utilize Google AdSense and authorized digital advertising to support our independent media operations. All advertisements are clearly marked as "Advertisement" or "Sponsored" and have zero influence on our editorial ratings or critique.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span><strong>Fact-Checking & Corrections:</strong> If an error in frame rates, mechanical details, or game lore is identified, we log and publish public corrections within 24 hours.</span>
          </li>
        </ul>
      </div>

      {/* Editorial Leadership & Contact Box */}
      <div className="p-8 rounded-3xl bg-[#101324] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-purple-400">
            Editorial Leadership & Publisher Verification
          </span>
          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Lead Publisher & Founder: Joel Ayuba
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
            Leading editorial direction, game testing, hardware benchmarks, and community moderation across Game Vault Forum and YouTube (@GameVaultForum).
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
            <span>Direct Publisher Email: <a href="mailto:joelotis40@gmail.com" className="text-purple-400 hover:underline">joelotis40@gmail.com</a> / <a href="mailto:contact@gamevault.forum" className="text-purple-400 hover:underline">contact@gamevault.forum</a></span>
            <span className="text-gray-500">•</span>
            <span>AdSense Publisher ID: <strong className="text-cyan-400">pub-6121667798720008</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('contact')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Contact Editorial Office</span>
          </button>
        </div>
      </div>
    </div>
  );
};
