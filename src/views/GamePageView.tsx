import React, { useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  Star, 
  Bookmark, 
  Share2, 
  Layers, 
  Monitor, 
  Calendar, 
  Building2, 
  Tag, 
  MessageSquare
} from 'lucide-react';
import { Game, PageTab } from '../types';

interface GamePageViewProps {
  game: Game;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onFilterForumByGame: (gameTitle: string) => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const GamePageView: React.FC<GamePageViewProps> = ({
  game,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onFilterForumByGame,
  onBack,
  onNavigateTab
}) => {
  const gameSlug = getSeoSlug(game);

  useEffect(() => {
    updatePageSeo({
      title: `${game.title} - Overview & Tactical Specs`,
      description: game.shortDescription,
      canonicalPath: `/games/${gameSlug}`,
      ogType: 'website',
      imageUrl: game.coverImage,
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
          image: game.coverImage,
          genre: game.genre,
          operatingSystem: game.platforms?.join(', ') || 'PC, Console',
          publisher: game.publisher
        }
      }
    });
  }, [game.title, game.shortDescription, game.coverImage, game.genre, game.platforms, game.publisher, gameSlug]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Games Database</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /games/{gameSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {game.genre}
          </span>
        </div>
      </div>

      {/* Main Dossier Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden">
        {/* Banner Artwork */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden">
          <img
            src={game.artwork}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e101a] via-[#0e101a]/50 to-transparent" />

          {/* Title on Banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600 text-white rounded-lg shadow-md shadow-purple-900/50">
                  {game.genre}
                </span>
                <span className="px-2.5 py-1 text-xs font-mono bg-black/60 text-gray-300 rounded-lg border border-white/10 backdrop-blur-md">
                  {game.releaseYear}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white drop-shadow-md">
                {game.title}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-black/70 backdrop-blur-md rounded-2xl border border-amber-500/40 text-amber-400 self-start sm:self-auto">
              <Star className="w-5 h-5 fill-amber-400" />
              <span className="text-xl font-bold font-mono">{game.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">/ 10</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
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
                {game.platforms.join(', ')}
              </p>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300">
              Tactical Dossier & Synopsis
            </h3>
            <p className="text-base text-gray-300 leading-relaxed font-['Inter']">
              {game.synopsis}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300">
              Vault Analysis Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {game.keyFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300 font-['Inter']"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-sm shadow-cyan-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Tag className="w-4 h-4 text-purple-400" />
            {game.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs bg-white/5 text-gray-400 border border-white/10 rounded-lg font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

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
    </div>
  );
};
