import React from 'react';
import { X, Star, Check, AlertCircle, Bookmark, Share2, Calendar, UserCheck } from 'lucide-react';
import { Review } from '../types';

interface ReviewModalProps {
  review: Review | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShare: (title: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  review,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare
}) => {
  if (!review) return null;

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    if (score >= 8.5) return 'text-purple-400 border-purple-500/40 bg-purple-950/30';
    if (score >= 8.0) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2438] bg-[#121524]">
          <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400">
            Game Vault Official Review
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#1a1d2e] hover:bg-[#23273e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Review Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Top Score Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-[#131625] border border-[#232942] gap-5">
            <div className="flex items-center gap-4">
              <img
                src={review.artwork}
                alt={review.gameTitle}
                className="w-20 h-24 object-cover rounded-xl border border-[#2c3352]"
              />
              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                  {review.genre} • {review.platform}
                </span>
                <h2 className="text-2xl font-['Space_Grotesk'] font-bold text-white">
                  {review.gameTitle}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    {review.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {review.publishDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Big Score Badge */}
            <div className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl border ${getScoreColor(review.score)} shrink-0`}>
              <span className="text-3xl font-extrabold font-mono">{review.score}</span>
              <span className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider mt-0.5">
                {review.scoreLabel}
              </span>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
            <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-300 mb-1">
              Vault Verdict
            </h4>
            <p className="text-slate-200 text-sm font-['Space_Grotesk'] font-medium italic">
              "{review.shortVerdict}"
            </p>
          </div>

          {/* Pros and Cons Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pros */}
            <div className="p-4 rounded-xl bg-[#111822] border border-emerald-900/40 space-y-2.5">
              <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-emerald-400">
                <Check className="w-4 h-4 text-emerald-400" />
                The High Points
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {review.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="p-4 rounded-xl bg-[#1d1217] border border-rose-900/40 space-y-2.5">
              <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-rose-400">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                The Drawbacks
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {review.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Review Analysis */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-white">
              Full Editorial Breakdown
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-['Inter']">
              {review.fullReview}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1f2438]">
            <button
              onClick={() => onToggleBookmark(review.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isBookmarked
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-[#141725] text-slate-300 border-[#262c45] hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved in Vault' : 'Save Review'}</span>
            </button>

            <button
              onClick={() => onShare(`${review.gameTitle} Review`)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#141725] hover:bg-[#1a1f33] text-slate-200 rounded-lg text-xs font-medium border border-[#262c45] transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
