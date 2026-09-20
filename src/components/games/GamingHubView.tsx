import React from 'react';
import { GAMING_CATEGORIES, PLAYABLE_GAMES } from '../../data/gamingData';
import { Play, Swords, Gamepad2, Sparkles, Trophy, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface GamingHubViewProps {
  onSelectCategory: (slug: string) => void;
  onSelectGame: (categorySlug: string, gameSlug: string) => void;
}

export const GamingHubView: React.FC<GamingHubViewProps> = ({
  onSelectCategory,
  onSelectGame
}) => {
  const multiplayerGames = PLAYABLE_GAMES.filter((g) => g.supportsMultiplayer);
  const popularGames = PLAYABLE_GAMES.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#131129] via-[#0D0B1C] to-[#070610] border border-purple-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow orb */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vault Arena • Instant Browser Play</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Play Classic & Tactical Games in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Game Vault</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            Jump into retro arcade classics, mind-bending puzzles, tactical strategy simulations, and live head-to-head multiplayer duels with authenticated friends.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectCategory('arcade-games')}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Explore Arcade</span>
            </button>
            <button
              onClick={() => onSelectCategory('multiplayer-games')}
              className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
            >
              <Swords className="w-4 h-4 text-pink-400" />
              <span>Multiplayer Duels</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 GAMING CATEGORIES (Strict Requirement) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Gaming Categories</h2>
            <p className="text-xs sm:text-sm text-white/60">
              Select any of the six dedicated game sectors to discover browser titles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMING_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group cursor-pointer rounded-2xl bg-[#0F0F1D] hover:bg-[#151429] border border-white/10 hover:border-purple-500/40 p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:translate-y-[-2px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-black/40 text-purple-300 border border-purple-500/20">
                    {cat.gameCount} Titles
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                <span>View Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Multiplayer Section */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black p-6 sm:p-8 border border-purple-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-400">
              <Swords className="w-4 h-4" />
              <span>Real-Time Player Duels</span>
            </div>
            <h2 className="text-2xl font-black text-white">Live Multiplayer Arena</h2>
            <p className="text-xs sm:text-sm text-white/70">
              Challenge forum members with unique invitation links, live lobby sync, and server-validated moves.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('multiplayer-games')}
            className="self-start sm:self-auto py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
          >
            All Duels
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {multiplayerGames.map((game) => (
            <div
              key={game.id}
              className="rounded-2xl bg-black/60 border border-white/10 hover:border-pink-500/40 p-5 space-y-4 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                  <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-pink-600 text-white text-[10px] font-bold">
                    PVP Match
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{game.title}</h4>
                <p className="text-xs text-white/60 line-clamp-2">{game.description}</p>
              </div>

              <button
                onClick={() => onSelectGame('multiplayer-games', game.slug)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-pink-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Enter Duel</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Instant Titles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <span>Trending Arcade & Puzzle Hits</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.categorySlug, game.slug)}
              className="group cursor-pointer rounded-2xl bg-[#0F0F1A] hover:bg-[#141424] border border-white/10 hover:border-purple-500/40 p-4 space-y-3 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition">
                    {game.title}
                  </h4>
                  <span className="text-[11px] text-white/50 line-clamp-1">{game.tagline}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-purple-400 font-semibold">
                <span>Play Now</span>
                <Play className="w-3.5 h-3.5 fill-purple-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
