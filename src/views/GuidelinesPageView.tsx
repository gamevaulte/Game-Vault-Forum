import React from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Users, Award } from 'lucide-react';
import { PageTab } from '../types';

interface GuidelinesPageViewProps {
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onNavigateLegal?: (page: 'guidelines' | 'privacy' | 'terms' | 'cookies') => void;
}

export const GuidelinesPageView: React.FC<GuidelinesPageViewProps> = ({ onBack, onNavigateTab, onNavigateLegal }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Vault</span>
        </button>

        {/* Legal Hub Navigation Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-['Rajdhani'] uppercase tracking-wider font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30">
            Guidelines
          </span>
          <button
            onClick={() => onNavigateLegal?.('privacy') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigateLegal?.('terms') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onNavigateLegal?.('cookies') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Cookie Policy
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="border-b border-white/10 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <span>Official Code of Conduct</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Game Vault Community Guidelines
          </h1>
          <p className="text-sm text-gray-400">
            Founded by Joel Ayuba, Game Vault Forum is dedicated to civil, high-level tactical gaming analysis.
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
          <section className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>1. Civil Tactical Discourse</span>
            </h2>
            <p>
              Critique strategies, mechanics, and design philosophies with intellectual rigor. Attack the argument, never the person. Toxicity, personal insults, or harassment will result in immediate vault suspension.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>2. No Spoilers Without Clear Tags</span>
            </h2>
            <p>
              Protect the experience of other operatives. When discussing recent campaigns, plot twists, or endings, clearly flag your post with [SPOILER] in the topic title.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>3. Authentic Contributions & Verification</span>
            </h2>
            <p>
              Only registered and verified users can like posts, publish comments, and initiate new forum discussions. We value depth of insight over spam or low-effort banter.
            </p>
          </section>

          <section className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>4. Respect Intellectual Property & Content Creators</span>
            </h2>
            <p>
              Credit video creators, writers, and dataminers when referencing third-party findings. Respect all game developers, independent studios, and community contributors.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
