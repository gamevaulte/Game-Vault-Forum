import React, { useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  Star, 
  Check, 
  AlertCircle, 
  Bookmark, 
  Share2, 
  Calendar, 
  UserCheck 
} from 'lucide-react';
import { Review, PageTab } from '../types';

interface ReviewPageViewProps {
  review: Review;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const ReviewPageView: React.FC<ReviewPageViewProps> = ({
  review,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onBack,
  onNavigateTab
}) => {
  const reviewSlug = getSeoSlug({ id: review.id, title: `${review.gameTitle} review` });

  useEffect(() => {
    const reviewImage = review.artwork || review.thumbnail || '';
    const authorName = typeof review.author === 'string' ? review.author : review.reviewer || 'Game Vault Staff';
    const verdictText = review.shortVerdict || review.verdict || '';
    const fullContent = review.fullReview || review.content || '';

    updatePageSeo({
      title: `${review.gameTitle} Review - Score: ${review.score}/10 (${review.scoreLabel || 'Recommended'})`,
      description: verdictText,
      canonicalPath: `/reviews/${reviewSlug}`,
      ogType: 'article',
      imageUrl: reviewImage,
      breadcrumbs: [
        { name: 'Reviews', path: '/reviews' },
        { name: `${review.gameTitle} Review`, path: `/reviews/${reviewSlug}` }
      ],
      schemaType: 'Review',
      schemaData: {
        itemReviewed: {
          '@type': 'VideoGame',
          name: review.gameTitle,
          image: reviewImage
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.score,
          bestRating: 10,
          worstRating: 1
        },
        author: {
          '@type': 'Person',
          name: authorName
        },
        reviewBody: fullContent
      }
    });
  }, [review.gameTitle, review.score, review.scoreLabel, review.shortVerdict, review.verdict, reviewSlug, review.artwork, review.thumbnail, review.author, review.reviewer, review.fullReview, review.content]);

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    if (score >= 8.5) return 'text-purple-400 border-purple-500/40 bg-purple-950/30';
    if (score >= 8.0) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Reviews</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /reviews/{reviewSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {review.genre}
          </span>
        </div>
      </div>

      {/* Review Dossier Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8">
        {/* Review Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600 text-white rounded-lg shadow-md shadow-purple-900/40">
                {review.genre}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                {review.publishDate || review.date || 'Recent'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
              {review.gameTitle}
            </h1>
            <p className="text-sm font-medium text-purple-300 font-['Space_Grotesk']">
              "{review.shortVerdict || review.verdict}"
            </p>
          </div>

          {/* Big Score Box */}
          <div className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border ${getScoreColor(review.score)} min-w-[110px] shrink-0 text-center shadow-xl`}>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tighter">
                {review.score.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
              Vault Score
            </span>
          </div>
        </div>

        {/* Reviewer / Author Byline */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold font-mono">
              <UserCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-['Space_Grotesk']">{typeof review.author === 'string' ? review.author : review.reviewer || 'Game Vault Staff'}</p>
              <p className="text-xs text-gray-400">Senior Vault Tactical Critic</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className={`p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-cyan-500/40 hover:bg-white/10 hover:text-white'
              }`}
              title={isBookmarked ? 'Saved to Vault' : 'Save to Vault'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Full Review Text */}
        <div className="space-y-4 text-base text-gray-300 leading-relaxed font-['Inter']">
          <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300">
            In-Depth Tactical Critique
          </h3>
          <p className="whitespace-pre-line">{review.fullReview || review.content}</p>
        </div>

        {/* Pros & Cons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {/* Pros */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <h4 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Tactical Strengths</span>
            </h4>
            <ul className="space-y-2">
              {review.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 font-['Inter']">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <h4 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Strategic Shortcomings</span>
            </h4>
            <ul className="space-y-2">
              {review.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300 font-['Inter']">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
