import React from 'react';
import { 
  Sparkles, 
  Wrench, 
  Monitor, 
  Compass, 
  GitCompare, 
  HelpCircle, 
  ShieldCheck 
} from 'lucide-react';
import { ToolHeader } from '../components/tools/ToolHeader';
import { ToolCard } from '../components/tools/ToolCard';
import { PageTab } from '../types';

interface ToolsHubViewProps {
  onNavigateTab: (tab: PageTab) => void;
}

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({ onNavigateTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <ToolHeader
        title="Gaming Tools & Hardware Utilities"
        subtitle="Free, community-tested tools built for gamers. From synthesizing unique handles to custom PC hardware balancing and hardware spec validation."
        breadcrumbs={[{ label: 'Gaming Tools' }]}
        icon={<Wrench className="w-6 h-6" />}
      />

      {/* Featured Primary Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <ToolCard
          title="Gaming Username Generator"
          subtitle="Create your next gaming identity"
          description="Synthesize creative, memorable gamer tags tailored by theme, style, numbers, and platform constraints for Steam, Twitch, YouTube, and Discord."
          badge="New Tool"
          icon={<Sparkles className="w-6 h-6" />}
          actionText="Generate Username"
          onClick={() => onNavigateTab('gaming-username-generator' as any)}
          featured={true}
        />

        <ToolCard
          title="Gaming PC Builder"
          subtitle="Build around your budget & games"
          description="Intelligent component builder balancing CPU/GPU harmony, verified 10-point socket compatibility, estimated street pricing, and real gameplay projections."
          badge="New Tool"
          icon={<Wrench className="w-6 h-6" />}
          actionText="Build My PC"
          onClick={() => onNavigateTab('gaming-pc-builder' as any)}
          featured={true}
        />

        <ToolCard
          title="PC Game Requirements Checker"
          subtitle="Can My PC Run This Game?"
          description="Benchmark your current hardware specifications against verified minimum and recommended system requirements for modern releases."
          badge="Popular"
          icon={<Monitor className="w-6 h-6" />}
          actionText="Check PC Requirements"
          onClick={() => onNavigateTab('pc-requirements' as any)}
          featured={false}
        />

        <ToolCard
          title="Game Finder & Discovery"
          subtitle="Find your next obsession"
          description="Filter through our expansive game catalog by genre, platform, playtime, difficulty, and community ratings to find your next adventure."
          icon={<Compass className="w-6 h-6" />}
          actionText="Find Games"
          onClick={() => onNavigateTab('finder' as any)}
        />

        <ToolCard
          title="Game Comparison Tool"
          subtitle="Head-to-head title analysis"
          description="Compare graphics requirements, multiplayer features, campaign lengths, and community ratings side-by-side."
          icon={<GitCompare className="w-6 h-6" />}
          actionText="Compare Games"
          onClick={() => onNavigateTab('compare' as any)}
        />

        <ToolCard
          title="Gaming Trivia & Quiz"
          subtitle="Test your gaming mastery"
          description="Challenge yourself across questions spanning gaming lore, hardware milestones, esports history, and speedrunning records."
          icon={<HelpCircle className="w-6 h-6" />}
          actionText="Take Quiz"
          onClick={() => onNavigateTab('quiz' as any)}
        />
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-6 rounded-2xl bg-[#0f111e] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-['Inter']">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-['Space_Grotesk']">
              Game Vault Platform Standards
            </div>
            <p className="text-slate-400 mt-0.5">
              All tools run client-side with zero ads or paywalls. Hardware data is community-verified against real benchmarks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
