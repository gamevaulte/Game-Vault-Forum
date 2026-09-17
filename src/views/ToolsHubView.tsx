import React from 'react';
import { 
  Sparkles, 
  Wrench, 
  Monitor, 
  ShieldCheck,
  Bot,
  Dices
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
        subtitle="Free, community-tested tools built for gamers. From random game decision wheels to synthesizing unique handles, custom PC balancing, and hardware spec validation."
        breadcrumbs={[{ label: 'Gaming Tools' }]}
        icon={<Wrench className="w-6 h-6" />}
      />

      {/* Featured Primary Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <ToolCard
          title="Game Avatar Generator"
          subtitle="Create your unique gaming avatar"
          description="Design custom gaming profile pictures with customizable hairstyles, cyberpunk armor, tactical headsets, RGB ambient lighting, dynamic backgrounds, and high-res PNG/WebP exports."
          badge="New Tool"
          icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
          actionText="Create Avatar"
          onClick={() => onNavigateTab('game-avatar-generator')}
          featured={true}
        />

        <ToolCard
          title="Game Picker Wheel"
          subtitle="Can't decide what to play?"
          description="Add your games, spin the interactive virtual wheel with physics & audio, and let Game Vault Forum randomly pick your next game."
          badge="Interactive"
          icon={<Dices className="w-6 h-6 text-purple-400" />}
          actionText="Spin the Wheel"
          onClick={() => onNavigateTab('game-picker-wheel')}
          featured={true}
        />

        <ToolCard
          title="Vault AI Gaming Assistant"
          subtitle="Your intelligent gaming companion"
          description="Ask questions, discover games, compare titles, troubleshoot low FPS, configure custom PC builds, and get deep gameplay advice."
          badge="Flagship AI"
          icon={<Bot className="w-6 h-6 text-purple-400" />}
          actionText="Ask Vault AI"
          onClick={() => onNavigateTab('vault-ai')}
          featured={true}
        />

        <ToolCard
          title="Gaming Username Generator"
          subtitle="Create your next gaming identity"
          description="Synthesize creative, memorable gamer tags tailored by theme, style, numbers, and platform constraints for Steam, Twitch, YouTube, and Discord."
          badge="New Tool"
          icon={<Sparkles className="w-6 h-6 text-cyan-400" />}
          actionText="Generate Username"
          onClick={() => onNavigateTab('gaming-username-generator')}
          featured={false}
        />

        <ToolCard
          title="Gaming PC Builder"
          subtitle="Build around your budget & games"
          description="Intelligent component builder balancing CPU/GPU harmony, verified 10-point socket compatibility, estimated street pricing, and real gameplay projections."
          badge="PC Builder"
          icon={<Wrench className="w-6 h-6 text-emerald-400" />}
          actionText="Build My PC"
          onClick={() => onNavigateTab('gaming-pc-builder')}
          featured={false}
        />

        <ToolCard
          title="PC Game Requirements Checker"
          subtitle="Can My PC Run This Game?"
          description="Benchmark your current hardware specifications against verified minimum and recommended system requirements for modern releases."
          badge="Popular"
          icon={<Monitor className="w-6 h-6 text-amber-400" />}
          actionText="Check PC Requirements"
          onClick={() => onNavigateTab('pc-requirements')}
          featured={false}
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
