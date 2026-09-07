import React, { useState, useMemo } from 'react';
import { Gamepad2, Search, Filter, Star, Tag, Monitor, Layers } from 'lucide-react';
import { Game, GameGenre, Platform } from '../types';

interface GamesViewProps {
  games: Game[];
  onSelectGame: (g: Game) => void;
}

const GamesViewComponent: React.FC<GamesViewProps> = ({ games, onSelectGame }) => {
  const [selectedGenre, setSelectedGenre] = useState<GameGenre>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const genres: GameGenre[] = [
    'All',
    'Action',
    'Adventure',
    'RPG',
    'Strategy',
    'Simulation',
    'Multiplayer',
    'FPS',
    'Sports',
    'Racing'
  ];

  const platforms: Platform[] = ['All', 'PC', 'PS5', 'Xbox', 'Switch'];

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;
      const matchesPlatform = selectedPlatform === 'All' || game.platforms.includes(selectedPlatform);
      const matchesSearch =
        !searchQuery ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesGenre && matchesPlatform && matchesSearch;
    });
  }, [games, selectedGenre, selectedPlatform, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
          <Gamepad2 className="w-3.5 h-3.5" />
          Game Vault Catalog
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          Explore the Game Vault
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl font-['Inter']">
          Curated records, tactical overviews, platform requirements, and mechanical ratings for the defining titles in modern gaming.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-[#0e101a] border border-[#20253b] space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search games by title, developer, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141726] border border-[#252b45] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Genre buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 block">
            Filter by Genre:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors ${
                  selectedGenre === genre
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-[#141726] text-slate-400 hover:text-white border border-[#232840]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Platform buttons */}
        <div className="space-y-2 pt-2 border-t border-[#1a1f33]">
          <span className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 block">
            Filter by Platform:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors ${
                  selectedPlatform === plat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[#141726] text-slate-400 hover:text-white border border-[#232840]'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Result Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 font-['Space_Grotesk']">
          <span>Displaying {filteredGames.length} Games in the Vault</span>
          {(selectedGenre !== 'All' || selectedPlatform !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedPlatform('All');
                setSearchQuery('');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-[#0e101a] rounded-2xl border border-[#20253b] space-y-2">
            <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 font-bold font-['Space_Grotesk'] text-lg">No games found</p>
            <p className="text-slate-500 text-xs">Try selecting another genre or clearing the search bar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="group bg-[#10121d] border border-[#1e2335] hover:border-cyan-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-950/20 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-black shrink-0">
                  <img
                    src={game.artwork}
                    alt={game.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10121d] via-transparent to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#0e101a]/90 backdrop-blur-md border border-cyan-500/40 rounded text-xs font-mono text-cyan-300 font-bold">
                    ★ {game.rating}
                  </div>

                  <span className="absolute bottom-2 left-2.5 px-2 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/80 text-purple-200 rounded">
                    {game.genre}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors truncate">
                      {game.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 block">
                      {game.developer} • {game.releaseYear}
                    </span>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-['Inter']">
                      {game.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#1a1f30]">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Platforms:</span>
                      <span className="text-cyan-300 font-medium truncate">{game.platforms.join(', ')}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGame(game);
                      }}
                      className="w-full py-1.5 px-3 bg-[#151928] hover:bg-cyan-600 text-slate-200 hover:text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-[#232a42] hover:border-cyan-500 transition-all text-center"
                    >
                      Explore Game
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const GamesView = React.memo(GamesViewComponent);
