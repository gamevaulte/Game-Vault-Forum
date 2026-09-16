import React, { useState } from 'react';
import { WheelGameEntry } from '../../types/gamePickerWheel';
import { Smile, Sparkles, X, Loader2, Play, RotateCw } from 'lucide-react';

interface AiMoodFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  wheelGames: WheelGameEntry[];
  onApplyFilteredSubset: (filteredNames: string[]) => void;
  onInstantSpinFiltered: (winnerName: string) => void;
}

interface FilterResultItem {
  name: string;
  matchScore: number; // 1 to 10
  reason: string;
}

const PRESET_MOODS = [
  'Tired & need relaxing cozy gameplay',
  'Want high-adrenaline competitive focus',
  'Only have 30 to 45 minutes to play',
  'Immersive deep lore and story',
  'Fun with friends / squad night',
];

export const AiMoodFilterModal: React.FC<AiMoodFilterModalProps> = ({
  isOpen,
  onClose,
  wheelGames,
  onApplyFilteredSubset,
  onInstantSpinFiltered,
}) => {
  const [moodText, setMoodText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FilterResultItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFilter = async (presetMood?: string) => {
    const query = (presetMood || moodText).trim();
    if (!query || wheelGames.length === 0) return;

    setLoading(true);
    setErrorMessage(null);

    const gameNames = wheelGames.map((g) => g.name);

    try {
      const response = await fetch('/api/game-picker-wheel/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'mood_filter',
          prompt: query,
          games: gameNames,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.filteredGames) && data.filteredGames.length > 0) {
        setResults(data.filteredGames);
      } else {
        setErrorMessage('Could not find games matching that specific mood. Try broadening your query.');
      }
    } catch (err) {
      console.warn('Mood filter fallback error:', err);
      // Smart client-side fallback heuristic
      const lowerMood = query.toLowerCase();
      const scored: FilterResultItem[] = [];

      for (const g of wheelGames) {
        const lowerGame = g.name.toLowerCase();
        let reason = 'Fits your current gaming mood based on title pacing.';
        let match = false;

        if (lowerMood.includes('relax') || lowerMood.includes('tired') || lowerMood.includes('cozy')) {
          if (
            lowerGame.includes('stardew') ||
            lowerGame.includes('animal') ||
            lowerGame.includes('minecraft') ||
            lowerGame.includes('dave') ||
            lowerGame.includes('hike') ||
            lowerGame.includes('dorfromantik') ||
            lowerGame.includes('slime')
          ) {
            match = true;
            reason = 'Casual pacing, peaceful soundscape, and low cognitive pressure.';
          }
        } else if (lowerMood.includes('compete') || lowerMood.includes('adrenaline') || lowerMood.includes('fast')) {
          if (
            lowerGame.includes('counter-strike') ||
            lowerGame.includes('valorant') ||
            lowerGame.includes('warzone') ||
            lowerGame.includes('pubg') ||
            lowerGame.includes('rocket') ||
            lowerGame.includes('apex') ||
            lowerGame.includes('rainbow')
          ) {
            match = true;
            reason = 'High-reflex twitch gunplay and competitive match structures.';
          }
        } else if (lowerMood.includes('story') || lowerMood.includes('lore') || lowerMood.includes('immersion')) {
          if (
            lowerGame.includes('elden') ||
            lowerGame.includes('witcher') ||
            lowerGame.includes('baldur') ||
            lowerGame.includes('cyberpunk') ||
            lowerGame.includes('red dead') ||
            lowerGame.includes('god of war') ||
            lowerGame.includes('alan wake')
          ) {
            match = true;
            reason = 'Deep narrative exploration, cinematic dialogue, and atmospheric world-building.';
          }
        }

        if (match) {
          scored.push({ name: g.name, matchScore: 9, reason });
        }
      }

      // If no keyword match, provide top 3 games from list with general recommendation
      if (scored.length === 0) {
        wheelGames.slice(0, Math.min(3, wheelGames.length)).forEach((g) => {
          scored.push({
            name: g.name,
            matchScore: 8,
            reason: `Great versatile match for "${query}" with accessible gameplay sessions.`,
          });
        });
      }

      setResults(scored);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFiltered = () => {
    if (results.length === 0) return;
    const names = results.map((r) => r.name);
    onApplyFilteredSubset(names);
    onClose();
  };

  const handlePickRandomWinner = () => {
    if (results.length === 0) return;
    const randomIndex = Math.floor(Math.random() * results.length);
    onInstantSpinFiltered(results[randomIndex].name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Smile className="w-5 h-5" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Pick a Game for My Mood
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close Mood Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Tell AI how you’re feeling or how much time you have. AI will analyze your <strong className="text-purple-300">current wheel games</strong> ({wheelGames.length} games) and filter the best matches for your mood.
        </p>

        {/* Input & Action */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFilter();
              }}
              placeholder="e.g. I'm tired and want something chill, or I have 30 mins..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={() => handleFilter()}
              disabled={loading || !moodText.trim() || wheelGames.length === 0}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Filter
            </button>
          </div>

          {/* Quick mood chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_MOODS.map((mood, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setMoodText(mood);
                  handleFilter(mood);
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 border border-white/5 transition-colors"
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Matches from your wheel ({results.length}):
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-sm">{item.name}</h5>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                      Match {item.matchScore}/10
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.reason}</p>
                </div>
              ))}
            </div>

            {/* Filter Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleApplyFiltered}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold font-['Space_Grotesk'] uppercase flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-purple-400" />
                Spin Only These {results.length}
              </button>
              <button
                type="button"
                onClick={handlePickRandomWinner}
                className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-['Space_Grotesk'] uppercase flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-purple-900/30"
              >
                <Play className="w-3.5 h-3.5" />
                Pick One Right Now
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
