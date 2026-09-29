import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, Award, Users } from 'lucide-react';
import { GameSourceCitation } from '../../types/gameStory';

interface SourcesInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  sources: GameSourceCitation[];
}

export const SourcesInspectorModal: React.FC<SourcesInspectorModalProps> = ({
  isOpen,
  onClose,
  gameTitle,
  sources
}) => {
  if (!isOpen) return null;

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1:
        return <Award className="w-5 h-5 text-amber-400" />;
      case 2:
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 3:
        return <Database className="w-5 h-5 text-purple-400" />;
      default:
        return <Users className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 2:
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 3:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] p-6 bg-[#0c0e1a] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/50 text-left flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              Factual Grounding & Source Transparency
            </div>
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] mt-1">
              Verified Sources for {gameTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every factual claim in this report is mapped to verified primary or high-confidence references.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Hierarchy Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Tier 1: Primary Source</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Tier 2: Ref Publication</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Tier 3: Database API</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Tier 4: Community Wiki</span>
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar">
          {sources.map((s, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all text-xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {getTierIcon(s.tier)}
                  <span className="font-bold text-white text-sm">{s.sourceName}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getTierBadge(s.tier)}`}>
                  {s.tierLabel}
                </span>
              </div>

              <div className="text-slate-300 font-medium mb-1">
                "{s.pageTitle}"
              </div>

              <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
                <strong>Information Verified:</strong> {s.informationUsed}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                <span className="text-slate-500">
                  Status: <span className="text-emerald-400 font-medium">Verified Ground Truth</span>
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 hover:underline font-medium"
                >
                  Inspect Citation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Game Vault Forum Zero-Hallucination Grounding Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
