import React, { useState } from 'react';
import { Search, Gamepad2, ChevronRight, Sparkles, Check, Globe, Loader2, Plus, ExternalLink, ShieldCheck } from 'lucide-react';
import { PcGameRequirements } from '../../types/pcRequirements';
import { getGameTitleArtwork } from '../../utils/gameImageService';

interface GameSelectorProps {
  games: PcGameRequirements[];
  selectedGame: PcGameRequirements;
  onSelectGame: (game: PcGameRequirements) => void;
  onAddGame?: (game: PcGameRequirements) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  games,
  selectedGame,
  onSelectGame,
  onAddGame
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);
  const [lastDiscoveredGame, setLastDiscoveredGame] = useState<PcGameRequirements | null>(null);

  // Popular quick game list mentioned in user prompt
  const popularSlugs = [
    'gta-v',
    'cyberpunk-2077',
    'elden-ring',
    'red-dead-redemption-2',
    'fortnite',
    'call-of-duty',
    'counter-strike-2',
    'apex-legends',
    'minecraft',
    'world-of-warships',
    'pubg',
    'hogwarts-legacy'
  ];

  const genres = ['All', 'Action', 'RPG', 'FPS', 'Multiplayer', 'Simulation', 'Adventure'];

  const handleSearchAndAddFromInternet = async (customQuery?: string) => {
    const q = (customQuery || searchQuery).trim();
    if (!q || q.length < 2) return;

    setIsAiSearching(true);
    setAiSearchError(null);

    try {
      const response = await fetch('/api/pc-requirements/ai-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.game) {
        setLastDiscoveredGame(data.game);
        if (onAddGame) {
          onAddGame(data.game);
        }
        onSelectGame(data.game);
        setIsDropdownOpen(false);
      } else {
        setAiSearchError(data.error || 'Could not verify official system requirements for this game.');
      }
    } catch (err: any) {
      setAiSearchError(err?.message || 'Failed to search live internet.');
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || game.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="w-full bg-[#121422]/90 border border-purple-500/20 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-xl shadow-purple-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-['Rajdhani'] font-bold text-xl sm:text-2xl text-white tracking-wide uppercase">
              Select a Game
            </h3>
          </div>
          <p className="text-gray-400 text-sm">
            Search our verified specifications database or choose from popular benchmark titles.
          </p>
        </div>

        {/* Selected Game Quick Card */}
        <div className="flex items-center gap-3.5 bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 max-w-sm">
          <img
            src={getGameTitleArtwork(selectedGame.title, selectedGame.genre, selectedGame.coverImage)}
            alt={selectedGame.title}
            className="w-11 h-11 rounded-lg object-cover border border-purple-400/40"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <div className="text-[10px] text-purple-400 font-bold tracking-widest uppercase font-['Space_Grotesk']">
              Active Game
            </div>
            <div className="text-white font-bold font-['Rajdhani'] text-base truncate">
              {selectedGame.title}
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
            setAiSearchError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim().length >= 2 && filteredGames.length === 0) {
              handleSearchAndAddFromInternet();
            }
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Type to search any game on earth (e.g., Monster Hunter Wilds, GTA VI, Clair Obscur, Elden Ring...)"
          className="w-full pl-12 pr-28 py-3.5 bg-black/50 border border-white/10 focus:border-cyan-400/80 rounded-xl text-white placeholder-gray-500 text-sm sm:text-base transition-colors outline-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setAiSearchError(null);
              }}
              className="text-xs text-gray-400 hover:text-white uppercase font-bold px-2 py-1 bg-white/5 rounded"
            >
              Clear
            </button>
          )}
          {searchQuery.trim().length >= 2 && (
            <button
              onClick={() => handleSearchAndAddFromInternet()}
              disabled={isAiSearching}
              title="Search Google with AI Grounding for official system requirements"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-purple-950/40"
            >
              {isAiSearching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              )}
              <span className="hidden sm:inline">AI Search</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Live Internet Search Banner & Status */}
      {searchQuery.trim().length >= 2 && (
        <div className="mb-4 p-3 rounded-xl bg-purple-950/25 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-xs text-gray-300">
              <span className="font-semibold text-white">Search any video game on the internet:</span> AI Google Grounding retrieves verified Steam & publisher requirements.
            </div>
          </div>
          <button
            onClick={() => handleSearchAndAddFromInternet()}
            disabled={isAiSearching}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isAiSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Searching Google...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Add "{searchQuery.slice(0, 16)}" via AI</span>
              </>
            )}
          </button>
        </div>
      )}

      {aiSearchError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
          <span>{aiSearchError}</span>
          <button onClick={() => setAiSearchError(null)} className="text-red-400 hover:text-white font-bold text-xs uppercase ml-2">Dismiss</button>
        </div>
      )}

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap mr-1 font-['Space_Grotesk']">
          Genre:
        </span>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedGenre === genre
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/40'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Quick Picks for Popular Games */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2.5 font-['Space_Grotesk'] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Popular Benchmarks & Competitive Titles:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {games
            .filter((g) => popularSlugs.includes(g.slug))
            .map((game) => {
              const isSelected = selectedGame.id === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => {
                    onSelectGame(game);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-['Rajdhani'] font-bold tracking-wide transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white border border-purple-400 shadow-md shadow-purple-950/50'
                      : 'bg-black/40 text-gray-300 hover:text-white hover:bg-purple-900/20 border border-white/10 hover:border-purple-500/40'
                  }`}
                >
                  <img
                    src={getGameTitleArtwork(game.title, game.genre, game.coverImage)}
                    alt={game.title}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span>{game.title}</span>
                  {isSelected && <Check className="w-3 h-3 text-cyan-300" />}
                </button>
              );
            })}
        </div>
      </div>

      {/* Search Filter Dropdown Grid */}
      {(searchQuery.trim().length > 0 || isDropdownOpen) && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">
            <span>Search Results ({filteredGames.length})</span>
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="text-gray-400 hover:text-white text-xs underline cursor-pointer"
            >
              Hide Results
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {filteredGames.length === 0 ? (
              <div className="col-span-full py-8 px-4 text-center bg-black/30 rounded-xl border border-dashed border-purple-500/30 flex flex-col items-center">
                <Globe className="w-8 h-8 text-cyan-400 mb-2 opacity-80" />
                <div className="text-white font-['Rajdhani'] font-bold text-base mb-1">
                  "{searchQuery}" is not yet in the local catalog
                </div>
                <p className="text-gray-400 text-xs max-w-md mb-4">
                  Game Vault AI can search Google for the official minimum and recommended PC requirements directly from official publisher specifications and storefront records, and automatically add this game to the database.
                </p>
                <button
                  onClick={() => handleSearchAndAddFromInternet()}
                  disabled={isAiSearching}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-['Rajdhani'] font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  {isAiSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching Google for Official Specs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Search & Add "{searchQuery}" via AI</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              filteredGames.map((game) => {
                const isSelected = selectedGame.id === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => {
                      onSelectGame(game);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/30 border border-purple-500 text-white shadow-lg shadow-purple-950/40'
                        : 'bg-black/30 hover:bg-white/5 border border-white/5 hover:border-white/15 text-gray-300'
                    }`}
                  >
                    <img
                      src={getGameTitleArtwork(game.title, game.genre, game.coverImage)}
                      alt={game.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-['Rajdhani'] font-bold text-sm text-white truncate">
                        {game.title}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {game.developer} • {game.genre}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-medium tracking-wider mt-0.5">
                        Min: {game.minimum.ramGb}GB RAM | {game.minimum.storageGb}GB Disk
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
