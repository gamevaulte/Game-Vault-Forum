import React, { useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  Lightbulb, 
  Bookmark, 
  Share2, 
  Gamepad2,
  CheckCircle2,
  ShieldCheck,
  Compass,
  MessageSquare
} from 'lucide-react';
import { Guide, PageTab } from '../types';

interface GuidePageViewProps {
  guide: Guide;
  allGuides?: Guide[];
  onSelectGuide?: (guide: Guide) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onFilterForumByGame?: (gameTitle: string) => void;
}

export const GuidePageView: React.FC<GuidePageViewProps> = ({
  guide,
  allGuides,
  onSelectGuide,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onBack,
  onNavigateTab,
  onFilterForumByGame
}) => {
  const guideSlug = getSeoSlug(guide);

  // Find companion / other guides to explore
  const relatedGuides = (allGuides || []).filter((g) => g.id !== guide.id).slice(0, 3);

  useEffect(() => {
    const articleText = (guide.sections || [])
      .map((s) => `${s.heading}: ${s.content}${s.tip ? ` (Pro-tip: ${s.tip})` : ''}`)
      .join('\n\n');

    updatePageSeo({
      title: `${guide.title} - ${guide.game} Guide`,
      description: guide.shortDescription,
      canonicalPath: `/guides/${guideSlug}`,
      ogType: 'article',
      imageUrl: guide.image,
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
          '@type': 'Organization',
          name: 'Game Vault Editorial & Tactics Staff'
        },
        articleBody: articleText || guide.shortDescription
      }
    });
  }, [guide.title, guide.game, guide.shortDescription, guide.difficulty, guide.image, guide.sections, guideSlug]);

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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Tactical Guides</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="hidden sm:inline">URL: /guides/{guideSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {guide.category}
          </span>
        </div>
      </div>

      {/* Main Guide Card */}
      <article className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-8">
        {/* Guide Title Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600 text-white rounded-lg shadow-md shadow-purple-900/40">
              <Gamepad2 className="w-3.5 h-3.5" />
              {guide.game}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border font-mono ${getDifficultyBadge(guide.difficulty)}`}>
              {guide.difficulty} Difficulty
            </span>
            <span className="flex items-center gap-1 text-xs text-cyan-300 font-mono bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {guide.estimatedReadingTime} read
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-300 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Playbook
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-['Inter']">
            {guide.shortDescription}
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-gray-400 font-mono border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                GV
              </div>
              <span className="text-gray-300 font-medium">Curated by Game Vault Tactical Staff</span>
            </div>
            <span>•</span>
            <span>Category: {guide.category}</span>
          </div>
        </div>

        {/* Guide Cover Artwork */}
        <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/10 relative bg-black">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e101a] via-transparent to-transparent opacity-60" />
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10">
          <div className="flex items-center gap-3">
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

          {onFilterForumByGame && (
            <button
              onClick={() => onFilterForumByGame(guide.game)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#171b2d] hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-purple-500/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss {guide.game} in Forum</span>
            </button>
          )}
        </div>

        {/* Guide Strategic Sections */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-emerald-400">
            <Compass className="w-4 h-4" />
            <span>Step-By-Step Tactical Execution</span>
          </div>

          {(guide.sections || []).map((sec, idx) => (
            <section key={idx} className="space-y-4 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-lg sm:text-xl font-['Space_Grotesk'] font-bold text-white flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-900/80 border border-purple-500/60 text-purple-200 flex items-center justify-center text-sm font-mono font-bold shrink-0 shadow-md shadow-purple-950/50">
                  {idx + 1}
                </span>
                <span>{sec.heading}</span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter'] pl-10 sm:pl-11 whitespace-pre-line">
                {sec.content}
              </p>

              {sec.tip && (
                <div className="ml-10 sm:ml-11 p-4 rounded-xl bg-[#0e1726] border border-cyan-500/40 flex items-start gap-3 text-xs sm:text-sm text-cyan-200 shadow-inner">
                  <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-300 uppercase tracking-wider font-['Rajdhani'] block text-xs mb-0.5">
                      Vault Pro-Tip:
                    </strong>
                    <span className="leading-relaxed">{sec.tip}</span>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Guide Conclusion / Checklist */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 via-[#101323] to-[#0a0d18] border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-['Rajdhani'] font-bold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>Mastery Checklist Completed</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 font-['Inter'] leading-relaxed">
            Execute these principles consistently in combat sessions. For ongoing updates on patch adjustments, armor formulas, and community routes, join fellow players in the Game Vault Forum.
          </p>
        </div>
      </article>

      {/* Suggested Other Tactical Guides */}
      {relatedGuides.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Explore More Tactical Guides & Strategies
            </h3>
            <button
              onClick={() => onNavigateTab('guides')}
              className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedGuides.map((rg) => (
              <div
                key={rg.id}
                onClick={() => {
                  if (onSelectGuide) {
                    onSelectGuide(rg);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="group p-4 rounded-2xl bg-[#0e101a] hover:bg-white/[0.05] border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative h-32 rounded-xl overflow-hidden bg-black">
                    <img
                      src={rg.image}
                      alt={rg.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/80 text-emerald-300 rounded border border-emerald-500/30">
                      {rg.difficulty}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-purple-400 block">
                    {rg.game} • {rg.category}
                  </span>

                  <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {rg.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-purple-300">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
