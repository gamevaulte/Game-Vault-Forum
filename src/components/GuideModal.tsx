import React from 'react';
import { X, Clock, Compass, Lightbulb, Bookmark, Share2, Gamepad2 } from 'lucide-react';
import { Guide } from '../types';

interface GuideModalProps {
  guide: Guide | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShare: (title: string) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  guide,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare
}) => {
  if (!guide) return null;

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      case 'Intermediate':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Advanced':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
      default:
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2438] bg-[#121524]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/60 text-purple-300 rounded border border-purple-700/40">
              {guide.category}
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${getDifficultyBadge(guide.difficulty)}`}>
              {guide.difficulty}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#1a1d2e] hover:bg-[#23273e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{guide.game} Guide</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-slate-400" />
                {guide.estimatedReadingTime} read
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-white leading-snug">
              {guide.title}
            </h1>
            <p className="text-slate-300 text-sm">{guide.shortDescription}</p>
          </div>

          {/* Guide Banner Image */}
          <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-[#22273e]">
            <img
              src={guide.image}
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Guide Sections */}
          <div className="space-y-6 pt-2">
            {guide.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-lg font-['Space_Grotesk'] font-bold text-purple-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-purple-950 border border-purple-800/60 text-purple-400 flex items-center justify-center text-xs font-mono">
                    {idx + 1}
                  </span>
                  {sec.heading}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed pl-8">
                  {sec.content}
                </p>
                {sec.tip && (
                  <div className="ml-8 p-3.5 rounded-xl bg-[#111928] border border-cyan-800/40 flex items-start gap-2.5 text-xs text-cyan-200">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300 uppercase tracking-wider font-['Rajdhani']">Vault Pro-Tip: </strong>
                      {sec.tip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1f2438]">
            <button
              onClick={() => onToggleBookmark(guide.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isBookmarked
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-[#141725] text-slate-300 border-[#262c45] hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved in Vault' : 'Save Guide'}</span>
            </button>

            <button
              onClick={() => onShare(guide.title)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#141725] hover:bg-[#1a1f33] text-slate-200 rounded-lg text-xs font-medium border border-[#262c45] transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Guide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
