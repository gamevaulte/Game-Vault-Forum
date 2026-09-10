import React, { useState } from 'react';
import { Sparkles, Gamepad2, CheckCircle2, ChevronRight, Filter, Zap } from 'lucide-react';
import { UserPcSpec, PcGameRequirements } from '../../types/pcRequirements';
import { findGamesPcCanRun } from '../../lib/pcRequirementsChecker';

interface GamesMyPcCanRunProps {
  userPc: UserPcSpec;
  games: PcGameRequirements[];
  onSelectGame: (game: PcGameRequirements) => void;
}

export const GamesMyPcCanRun: React.FC<GamesMyPcCanRunProps> = ({
  userPc,
  games,
  onSelectGame
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [tierFilter, setTierFilter] = useState<'all' | 'recommended_only'>('all');

  const genres = ['All', 'Action', 'RPG', 'FPS', 'Multiplayer', 'Simulation', 'Adventure'];

  const playableGames = findGamesPcCanRun(userPc, games, selectedGenre, tierFilter);

  return (
    <div className="w-full bg-[#121422]/90 border border-purple-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wider">
              Find Games My PC Can Run
            </h3>
          </div>
          <p className="text-gray-400 text-sm">
            Based on your active PC specs ({userPc.cpuName} + {userPc.gpuName}, {userPc.ramGb}GB RAM):
          </p>
        </div>

        {/* Playable Stats Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 shrink-0">
          <div className="text-right">
            <div className="text-xs text-gray-400 font-['Space_Grotesk'] uppercase font-semibold">
              Compatible Games
            </div>
            <div className="font-['Rajdhani'] font-bold text-lg text-emerald-400">
              {playableGames.length} of {games.length} Ready
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        {/* Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Tier Toggle */}
        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer ${
              tierFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Playable (Min + Rec)
          </button>
          <button
            onClick={() => setTierFilter('recommended_only')}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer ${
              tierFilter === 'recommended_only'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recommended Only (60+ FPS)
          </button>
        </div>
      </div>

      {/* Playable Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playableGames.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-black/20 rounded-2xl border border-dashed border-white/10">
            No games found matching the selected filters.
          </div>
        ) : (
          playableGames.map(({ game, evaluation }) => {
            const isRec = evaluation.overallLevel === 'excellent' || evaluation.overallLevel === 'good';
            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/40 hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer group"
              >
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 group-hover:scale-105 transition-transform shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-['Space_Grotesk'] font-semibold">
                      {game.genre}
                    </span>
                    <span
                      className={`text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isRec
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {isRec ? 'Recommended Ready' : 'Minimum Ready'}
                    </span>
                  </div>
                  <div className="font-['Rajdhani'] font-bold text-white text-base truncate mt-0.5">
                    {game.title}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {game.developer}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
