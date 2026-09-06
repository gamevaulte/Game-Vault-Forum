import React, { useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  Clock, 
  Lightbulb, 
  Bookmark, 
  Share2, 
  Gamepad2,
  CheckCircle2
} from 'lucide-react';
import { Guide, PageTab } from '../types';

interface GuidePageViewProps {
  guide: Guide;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const GuidePageView: React.FC<GuidePageViewProps> = ({
  guide,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onBack,
  onNavigateTab
}) => {
  const guideSlug = getSeoSlug(guide);

  useEffect(() => {
    updatePageSeo({
      title: `${guide.title} - ${guide.game} Guide`,
      description: guide.shortDescription,
      canonicalPath: `/guides/${guideSlug}`,
      ogType: 'article',
      breadcrumbs: [
        { name: 'Guides', path: '/guides' },
        { name: guide.title, path: `/guides/${guideSlug}` }
      ],
      schemaType: 'TechArticle',
      schemaData: {
        headline: guide.title,
        description: guide.shortDescription,
        proficiencyLevel: guide.difficulty,
        about: {
          '@type': 'VideoGame',
          name: guide.game
        },
        author: {
          '@type': 'Person',
          name: guide.author.name
        },
        articleBody: guide.content
      }
    });
  }, [guide.title, guide.game, guide.shortDescription, guide.difficulty, guide.author.name, guide.content, guideSlug]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Tactical Guides</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /guides/{guideSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {guide.category}
          </span>
        </div>
      </div>

      {/* Guide Card */}
      <article className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Guide Title Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600 text-white rounded-lg shadow-md shadow-purple-900/40">
              <Gamepad2 className="w-3.5 h-3.5" />
              {guide.game}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border font-mono ${getDifficultyBadge(guide.difficulty)}`}>
              {guide.difficulty} Difficulty
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {guide.estimatedReadingTime} read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-['Space_Grotesk']">
            {guide.shortDescription}
          </p>
        </div>

        {/* Guide Cover Artwork */}
        <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 relative">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between py-4 border-y border-white/10">
          <button
            onClick={onToggleBookmark}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-cyan-500/40 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Saved to Vault' : 'Save Guide to Vault'}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Share Guide</span>
          </button>
        </div>

        {/* Guide Strategic Sections */}
        <div className="space-y-8 pt-2">
          {guide.sections.map((sec, idx) => (
            <section key={idx} className="space-y-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h2 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-purple-900/80 border border-purple-500/60 text-purple-200 flex items-center justify-center text-sm font-mono font-bold shadow-md shadow-purple-950/50">
                  {idx + 1}
                </span>
                <span>{sec.heading}</span>
              </h2>

              <p className="text-base text-gray-300 leading-relaxed font-['Inter'] pl-11">
                {sec.content}
              </p>

              {sec.tip && (
                <div className="ml-11 p-4 rounded-xl bg-[#0e1726] border border-cyan-500/40 flex items-start gap-3 text-xs sm:text-sm text-cyan-200 shadow-inner">
                  <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 uppercase tracking-wider font-['Rajdhani'] block text-xs mb-0.5">
                      Vault Pro-Tip:
                    </strong>
                    {sec.tip}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
};
