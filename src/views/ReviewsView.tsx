import React, { useState } from 'react';
import { Star, Check, AlertCircle, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Review } from '../types';

interface ReviewsViewProps {
  reviews: Review[];
  onSelectReview: (r: Review) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ reviews, onSelectReview }) => {
  const [scoreFilter, setScoreFilter] = useState<string>('All');

  const filteredReviews = reviews.filter((r) => {
    if (scoreFilter === 'All') return true;
    if (scoreFilter === 'Masterpiece') return r.score >= 9.5;
    if (scoreFilter === 'Excellent') return r.score >= 9.0 && r.score < 9.5;
    if (scoreFilter === 'Very Good') return r.score >= 8.0 && r.score < 9.0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/40 border border-amber-800/40 text-amber-400 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-current" />
          Game Vault Official Reviews
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          Honest Scoring & Critical Verdicts
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl font-['Inter']">
          We hold games to rigorous standards. Unbiased evaluations focusing on gameplay mechanics, engine stability, progression curves, and artistic vision.
        </p>
      </div>

      {/* Score Tier Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1c2032]">
        {[
          { id: 'All', label: 'All Reviews' },
          { id: 'Masterpiece', label: '★ Masterpiece (9.5+)' },
          { id: 'Excellent', label: '★ Excellent (9.0 - 9.4)' },
          { id: 'Very Good', label: '★ Very Good (8.0 - 8.9)' }
        ].map((tier) => (
          <button
            key={tier.id}
            onClick={() => setScoreFilter(tier.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              scoreFilter === tier.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#121524] text-slate-400 hover:text-white border border-[#21263c]'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            onClick={() => onSelectReview(rev)}
            className="group bg-[#10121d] border border-[#1e2335] hover:border-amber-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-amber-950/20 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={rev.artwork}
                    alt={rev.gameTitle}
                    className="w-18 h-22 object-cover rounded-xl border border-[#262c45] shrink-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                      {rev.genre} • {rev.platform}
                    </span>
                    <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-amber-300 transition-colors">
                      {rev.gameTitle}
                    </h2>
                    <span className="text-xs text-slate-500 block mt-1 font-['Inter']">
                      Reviewed by {rev.author} • {rev.publishDate}
                    </span>
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 shrink-0 shadow-lg">
                  <span className="text-2xl font-black font-mono">{rev.score}</span>
                  <span className="text-[9px] font-['Rajdhani'] font-bold uppercase tracking-wider">
                    {rev.scoreLabel}
                  </span>
                </div>
              </div>

              {/* Short Verdict */}
              <div className="p-3 bg-[#131626] border-l-2 border-amber-500 rounded-r-lg text-xs sm:text-sm text-slate-300 italic font-['Space_Grotesk']">
                "{rev.shortVerdict}"
              </div>

              {/* Pros & Cons Sneak Peek */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="space-y-1">
                  <span className="text-emerald-400 font-semibold font-['Rajdhani'] uppercase tracking-wider block">
                    Pros:
                  </span>
                  <p className="text-slate-400 line-clamp-1 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{rev.pros[0]}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-rose-400 font-semibold font-['Rajdhani'] uppercase tracking-wider block">
                    Cons:
                  </span>
                  <p className="text-slate-400 line-clamp-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{rev.cons[0]}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1f30] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Read Complete Review Breakdown</span>
              <div className="flex items-center gap-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>View Full Review</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
