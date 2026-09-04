import React from 'react';
import { X, Star, Bookmark, Share2, Layers, Monitor, Calendar, Building2, Tag } from 'lucide-react';
import { Game } from '../types';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onShare: (title: string) => void;
  onFilterForumByGame: (gameTitle: string) => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  game,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onFilterForumByGame
}) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Banner with artwork */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={game.artwork}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e101a] via-[#0e101a]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-[#0a0c14]/80 backdrop-blur-md hover:bg-[#1b1f32] rounded-xl border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & score positioned on the banner gradient */}
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600/90 text-white rounded">
                  {game.genre}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono bg-black/60 text-slate-300 rounded border border-white/10">
                  {game.releaseYear}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-white drop-shadow-md">
                {game.title}
              </h1>
            </div>

            {/* Score rating */}
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#131625]/90 border border-purple-500/40 text-purple-300 shadow-xl shrink-0">
              <span className="text-[10px] text-slate-400 font-['Rajdhani'] font-bold uppercase">Rating</span>
              <span className="text-lg font-bold font-mono text-cyan-300">{game.rating}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#131625] border border-[#21273e] rounded-xl">
              <span className="text-[10px] text-slate-400 font-['Rajdhani'] font-bold uppercase tracking-wider block mb-1">
                Developer
              </span>
              <span className="text-xs font-semibold text-slate-200">{game.developer}</span>
            </div>
            <div className="p-3 bg-[#131625] border border-[#21273e] rounded-xl">
              <span className="text-[10px] text-slate-400 font-['Rajdhani'] font-bold uppercase tracking-wider block mb-1">
                Publisher
              </span>
              <span className="text-xs font-semibold text-slate-200">{game.publisher}</span>
            </div>
            <div className="p-3 bg-[#131625] border border-[#21273e] rounded-xl">
              <span className="text-[10px] text-slate-400 font-['Rajdhani'] font-bold uppercase tracking-wider block mb-1">
                Platforms
              </span>
              <span className="text-xs font-semibold text-cyan-300">{game.platforms.join(', ')}</span>
            </div>
            <div className="p-3 bg-[#131625] border border-[#21273e] rounded-xl">
              <span className="text-[10px] text-slate-400 font-['Rajdhani'] font-bold uppercase tracking-wider block mb-1">
                Vault Status
              </span>
              <span className="text-xs font-semibold text-emerald-400">Archived & Curated</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-400">
              Vault Overview & Analysis
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {game.fullDescription}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1b1f32]">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {game.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs bg-[#141727] text-slate-300 border border-[#242942] rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom Action bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1b1f32]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(game.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  isBookmarked
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-[#141725] text-slate-300 border-[#262c45] hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved in Vault' : 'Save to Vault'}</span>
              </button>

              <button
                onClick={() => onShare(game.title)}
                className="p-2 bg-[#141725] text-slate-300 border border-[#262c45] hover:border-purple-500/40 hover:text-white rounded-lg transition-all"
                title="Share Game"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onFilterForumByGame(game.title);
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-md shadow-purple-900/30"
            >
              Discuss in Forum →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
