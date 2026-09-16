import React, { useState } from 'react';
import { AiGameSuggestion } from '../../types/gamePickerWheel';
import { Sparkles, Plus, Check, X, Loader2, Wand2, Lightbulb } from 'lucide-react';

interface AiGameListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (name: string) => { success: boolean; message?: string };
  onAddMultipleGames: (names: string[]) => { addedCount: number; duplicateCount: number };
}

const EXAMPLE_PROMPTS = [
  '10 relaxing and cozy games for PC',
  '8 competitive multiplayer games with active ranked ladders',
  '10 games similar to Minecraft and Terraria',
  '7 tactical story-rich single-player RPGs',
  '6 great games for short 30-minute sessions',
];

export const AiGameListModal: React.FC<AiGameListModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
  onAddMultipleGames,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AiGameSuggestion[]>([]);
  const [addedTitles, setAddedTitles] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (queryToUse?: string) => {
    const q = (queryToUse || prompt).trim();
    if (!q) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/game-picker-wheel/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'generate_list',
          prompt: q,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.games) && data.games.length > 0) {
        setSuggestions(data.games);
        setAddedTitles(new Set());
      } else {
        setErrorMessage('No game suggestions returned. Please try a different query.');
      }
    } catch (err: any) {
      console.warn('AI Game generator fallback error:', err);
      // Client-side emergency curated fallback based on keywords
      const lower = q.toLowerCase();
      let fallbackList: AiGameSuggestion[] = [];

      if (lower.includes('relax') || lower.includes('cozy')) {
        fallbackList = [
          { title: 'Stardew Valley', genre: 'Farming Sim / RPG', reason: 'Peaceful farming, fishing, and community progression.' },
          { title: 'Dave the Diver', genre: 'Adventure / Management', reason: 'Casual ocean exploration mixed with sushi restaurant management.' },
          { title: 'A Short Hike', genre: 'Exploration / Cozy', reason: 'Delightful bite-sized mountain hike with zero stress.' },
          { title: 'Dorfromantik', genre: 'Tile Puzzle', reason: 'Peaceful hexagonal world-building with relaxing music.' },
          { title: 'Slime Rancher', genre: 'First-Person Casual', reason: 'Cute exploratory world-building with adorable creatures.' },
        ];
      } else if (lower.includes('multiplayer') || lower.includes('competitive') || lower.includes('friends')) {
        fallbackList = [
          { title: 'Helldivers 2', genre: 'Co-op Tactical Shooter', reason: 'Chaotic 4-player galactic defense against Terminids and Automatons.' },
          { title: 'Rocket League', genre: 'Vehicular Soccer', reason: 'Instant physics-based team gameplay with infinite mastery curve.' },
          { title: 'Valorant', genre: 'Tactical Hero Shooter', reason: 'High-stakes 5v5 precision gunplay and ability utility.' },
          { title: 'Apex Legends', genre: 'Battle Royale', reason: 'High-octane movement, sliding, and character synergies.' },
          { title: 'Overwatch 2', genre: 'Team Action', reason: 'Fast objective-based team comps with diverse roles.' },
        ];
      } else {
        fallbackList = [
          { title: 'Elden Ring', genre: 'Action RPG', reason: 'Unrivaled dark fantasy open-world freedom and deep combat.' },
          { title: 'Cyberpunk 2077', genre: 'Sci-Fi RPG', reason: 'Cinematic dystopian Night City with fluid first-person combat.' },
          { title: 'Baldur’s Gate 3', genre: 'Turn-Based RPG', reason: 'Tabletop D&D narrative depth where choices profoundly matter.' },
          { title: 'Hades II', genre: 'Rogue-like Action', reason: 'Addictive lightning-fast combat loops and mythological Greek lore.' },
          { title: 'The Witcher 3: Wild Hunt', genre: 'Fantasy RPG', reason: 'Masterclass storytelling, monster contracts, and rich character drama.' },
        ];
      }

      setSuggestions(fallbackList);
      setAddedTitles(new Set());
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingle = (title: string) => {
    const res = onAddGame(title);
    if (res.success) {
      setAddedTitles((prev) => new Set(prev).add(title));
    }
  };

  const handleAddAll = () => {
    const titlesToAdd = suggestions.map((s) => s.title);
    onAddMultipleGames(titlesToAdd);
    setAddedTitles(new Set(titlesToAdd));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Wand2 className="w-5 h-5" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              AI Game List Generator
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close AI modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Describe the kinds of games you want to consider (genre, vibe, platforms, or session length) and AI will recommend verified real games to spin on your wheel.
        </p>

        {/* Input & Action */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              placeholder="e.g. 10 relaxing games, 8 multiplayer games for PC..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              Generate
            </button>
          </div>

          {/* Example prompt pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Ideas:
            </span>
            {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPrompt(ex);
                  handleGenerate(ex);
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 border border-white/5 transition-colors"
              >
                {ex}
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
        {suggestions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Recommended Games ({suggestions.length})
              </span>
              <button
                type="button"
                onClick={handleAddAll}
                className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider text-[11px]"
              >
                Add All to Wheel +
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {suggestions.map((sug, idx) => {
                const isAdded = addedTitles.has(sug.title);

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 truncate">{sug.title}</span>
                        {sug.genre && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                            {sug.genre}
                          </span>
                        )}
                      </div>
                      {sug.reason && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {sug.reason}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSingle(sug.title)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                        isAdded
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" /> Add
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
