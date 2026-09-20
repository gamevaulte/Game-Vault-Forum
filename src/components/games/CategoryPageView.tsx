import React from 'react';
import { GamingCategory, PlayableGame } from '../../types/gaming';
import { GAMING_CATEGORIES } from '../../data/gamingData';
import { Play, Users, Sparkles, ArrowLeft, ArrowRight, Gamepad2, Swords, Trophy } from 'lucide-react';

interface CategoryPageViewProps {
  category: GamingCategory;
  games: PlayableGame[];
  onSelectGame: (gameSlug: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onBackToHub: () => void;
}

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  category,
  games,
  onSelectGame,
  onSelectCategory,
  onBackToHub
}) => {
  return (
    <div className="space-y-10">
      {/* Category Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#121124] via-[#0E0D1B] to-[#07060E] border border-purple-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHub}
              className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </button>
            <span className="text-xs uppercase tracking-wider font-bold text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/20">
              Vault Collection
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl shadow-purple-600/30">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {category.title}
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-2xl mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Playable Titles</span>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-500/20">
              {games.length} Games
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-2xl bg-[#0F0F1A] hover:bg-[#141424] border border-white/10 hover:border-purple-500/40 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Thumbnail with overlay badge */}
              <div className="relative aspect-[16/9] overflow-hidden bg-black/40">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-black/30" />

                {game.supportsMultiplayer && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-pink-600/90 text-white text-[11px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-xs">
                    <Swords className="w-3 h-3" />
                    Multiplayer
                  </span>
                )}

                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white/80 text-[10px] font-mono border border-white/10">
                  {game.difficulty}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                    {game.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                    {game.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-white/40">
                    {game.supportsMultiplayer ? '⚔️ Online Duel' : '🎮 Browser Ready'}
                  </span>
                  <button
                    onClick={() => onSelectGame(game.slug)}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition group-hover:translate-x-0.5"
                  >
                    <span>Play Game</span>
                    <Play className="w-3 h-3 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Other Categories Strip */}
      <div className="pt-8 border-t border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white/90">Browse Other Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GAMING_CATEGORIES.filter((c) => c.slug !== category.slug).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="p-3.5 rounded-xl bg-[#0D0D17] hover:bg-[#151524] border border-white/10 hover:border-purple-500/30 text-left transition group space-y-1"
            >
              <div className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                {cat.title}
              </div>
              <div className="text-[11px] text-white/50">{cat.gameCount} Games</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
