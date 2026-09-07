import React, { useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  ArrowRight,
  Star, 
  Bookmark, 
  Share2, 
  Layers, 
  Monitor, 
  Calendar, 
  Building2, 
  Tag, 
  MessageSquare,
  ShieldCheck,
  Compass,
  Play,
  Gamepad2
} from 'lucide-react';
import { Game, Guide, Video, Review, PageTab } from '../types';

interface GamePageViewProps {
  game: Game;
  allGames?: Game[];
  allGuides?: Guide[];
  allVideos?: Video[];
  allReviews?: Review[];
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onFilterForumByGame: (gameTitle: string) => void;
  onSelectGame?: (game: Game) => void;
  onSelectGuide?: (guide: Guide) => void;
  onSelectVideo?: (video: Video) => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const GamePageView: React.FC<GamePageViewProps> = ({
  game,
  allGames,
  allGuides,
  allVideos,
  allReviews,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onFilterForumByGame,
  onSelectGame,
  onSelectGuide,
  onSelectVideo,
  onBack,
  onNavigateTab
}) => {
  const gameSlug = getSeoSlug(game);

  // Safely find companion guides for this game
  const companionGuides = (allGuides || []).filter((g) => {
    const guideGame = g.game.toLowerCase();
    const currentTitle = game.title.toLowerCase();
    return guideGame.includes(currentTitle) || currentTitle.includes(guideGame);
  });

  // Safely find companion video briefings for this game
  const companionVideos = (allVideos || []).filter((v) => {
    const videoGame = (v.game || '').toLowerCase();
    const currentTitle = game.title.toLowerCase();
    return videoGame.includes(currentTitle) || currentTitle.includes(videoGame);
  });

  // Other games in the vault to explore
  const otherGames = (allGames || []).filter((g) => g.id !== game.id).slice(0, 3);

  useEffect(() => {
    updatePageSeo({
      title: `${game.title} - Overview & Tactical Specs`,
      description: game.shortDescription,
      canonicalPath: `/games/${gameSlug}`,
      ogType: 'website',
      imageUrl: game.artwork,
      breadcrumbs: [
        { name: 'Games', path: '/games' },
        { name: game.title, path: `/games/${gameSlug}` }
      ],
      schemaType: 'WebPage',
      schemaData: {
        name: `${game.title} - Game Dossier`,
        description: game.shortDescription,
        about: {
          '@type': 'VideoGame',
          name: game.title,
          image: game.artwork,
          genre: game.genre,
          operatingSystem: (game.platforms || []).join(', ') || 'PC, Console',
          publisher: game.publisher
        }
      }
    });
  }, [game.title, game.shortDescription, game.artwork, game.genre, game.platforms, game.publisher, gameSlug]);

  const ratingScore = typeof game.rating === 'number' ? game.rating : 9.0;
  const ratingLabel = ratingScore >= 9.5 ? 'Masterpiece' : ratingScore >= 9.0 ? 'Exceptional' : ratingScore >= 8.5 ? 'Great' : 'Solid';

  // Fallback tactical highlights
  const tacticalHighlights = [
    `Genre Archetype: ${game.genre} with advanced mechanics`,
    `Platform Availability: ${(game.platforms || []).join(', ') || 'PC & Modern Consoles'}`,
    `Production Studio: ${game.developer}`,
    `Publishing Label: ${game.publisher}`,
    `Vault Rating: ${ratingScore.toFixed(1)}/10 (${ratingLabel})`,
    ...((game.tags || []).slice(0, 3).map((t) => `Core Focus: ${t}`))
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Games Database</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="hidden sm:inline">URL: /games/{gameSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {game.genre}
          </span>
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden">
        {/* Banner Artwork */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-black">
          <img
            src={game.artwork}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e101a] via-[#0e101a]/60 to-transparent" />

          {/* Title and Rating on Banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600 text-white rounded-lg shadow-md shadow-purple-900/50">
                  {game.genre}
                </span>
                <span className="px-2.5 py-1 text-xs font-mono bg-black/60 text-gray-200 rounded-lg border border-white/15 backdrop-blur-md">
                  {game.releaseYear}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-700/40 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Vault Verified
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white drop-shadow-md">
                {game.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-black/80 backdrop-blur-md rounded-2xl border border-amber-500/40 text-amber-400 self-start sm:self-auto shadow-xl">
              <Star className="w-5 h-5 fill-amber-400" />
              <div className="leading-tight">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-white">{ratingScore.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">/ 10</span>
                </div>
                <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-400 block">
                  {ratingLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Developer</span>
              </div>
              <p className="text-sm font-semibold text-white font-['Space_Grotesk'] truncate">
                {game.developer}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Publisher</span>
              </div>
              <p className="text-sm font-semibold text-white font-['Space_Grotesk'] truncate">
                {game.publisher}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Release Year</span>
              </div>
              <p className="text-sm font-semibold text-white font-['Space_Grotesk']">
                {game.releaseYear}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Platforms</span>
              </div>
              <p className="text-sm font-semibold text-white font-['Space_Grotesk'] truncate">
                {(game.platforms || []).join(', ')}
              </p>
            </div>
          </div>

          {/* Tactical Dossier & In-Depth Overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Tactical Dossier & Synopsis</span>
            </h3>
            <div className="space-y-3 text-base text-gray-300 leading-relaxed font-['Inter']">
              <p className="text-white font-medium">
                {game.shortDescription}
              </p>
              {game.fullDescription && (
                <p className="text-gray-300 leading-relaxed">
                  {game.fullDescription}
                </p>
              )}
            </div>
          </div>

          {/* Key Features & Tactical Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Vault Analysis Highlights & Specs</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tacticalHighlights.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-gray-200 font-['Inter']"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-sm shadow-cyan-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-400">
                Categorical Tags:
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                {game.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs bg-white/5 text-gray-300 border border-white/10 rounded-lg font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Associated Tactical Content in Vault */}
          {(companionGuides.length > 0 || companionVideos.length > 0) && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-white">
                Associated Vault Content for {game.title}
              </h3>

              {companionGuides.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 block font-['Rajdhani'] uppercase tracking-wider">
                    Available Guides:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {companionGuides.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          if (onSelectGuide) {
                            onSelectGuide(g);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:bg-emerald-950/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-emerald-300 font-mono font-bold uppercase">
                            {g.difficulty} • {g.estimatedReadingTime}
                          </span>
                          <h4 className="text-xs font-bold font-['Space_Grotesk'] text-white line-clamp-1">
                            {g.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {companionVideos.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-purple-400 block font-['Rajdhani'] uppercase tracking-wider">
                    Video Briefings:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {companionVideos.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          if (onSelectVideo) {
                            onSelectVideo(v);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 hover:bg-purple-950/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-purple-300 font-mono font-bold uppercase">
                            {v.category} • {v.duration}
                          </span>
                          <h4 className="text-xs font-bold font-['Space_Grotesk'] text-white line-clamp-1">
                            {v.title}
                          </h4>
                        </div>
                        <Play className="w-4 h-4 text-purple-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
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
                <span>{isBookmarked ? 'Saved in Vault' : 'Save to Vault'}</span>
              </button>

              <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-purple-400" />
                <span>Share Link</span>
              </button>
            </div>

            <button
              onClick={() => onFilterForumByGame(game.title)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Explore {game.title} Discussions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Other Games in Vault */}
      {otherGames.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Discover More Verified Games in the Vault
            </h3>
            <button
              onClick={() => onNavigateTab('games')}
              className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherGames.map((og) => (
              <div
                key={og.id}
                onClick={() => {
                  if (onSelectGame) {
                    onSelectGame(og);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="group p-4 rounded-2xl bg-[#0e101a] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative h-32 rounded-xl overflow-hidden bg-black">
                    <img
                      src={og.artwork}
                      alt={og.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono bg-black/80 text-amber-400 font-bold rounded border border-amber-500/30">
                      ★ {og.rating}
                    </span>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[9px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/80 text-purple-300 rounded border border-purple-500/30">
                      {og.genre}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {og.title}
                  </h4>

                  <p className="text-xs text-gray-400 line-clamp-2 font-['Inter']">
                    {og.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-cyan-300">
                  <span>View Dossier</span>
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
