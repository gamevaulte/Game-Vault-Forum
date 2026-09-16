import React, { useState } from 'react';
import { WheelGameEntry } from '../../types/gamePickerWheel';
import { Plus, Trash2, Edit2, Check, X, Shuffle, Layers, AlertCircle } from 'lucide-react';
import { WHEEL_COLOR_PALETTE } from '../../lib/wheelPresets';

interface GameListManagerProps {
  games: WheelGameEntry[];
  onAddGame: (name: string) => { success: boolean; message?: string };
  onAddMultipleGames: (names: string[]) => { addedCount: number; duplicateCount: number };
  onRemoveGame: (id: string) => void;
  onEditGame: (id: string, newName: string) => { success: boolean; message?: string };
  onClearAllGames: () => void;
  onShuffleGames: () => void;
  disabled?: boolean;
}

export const GameListManager: React.FC<GameListManagerProps> = ({
  games,
  onAddGame,
  onAddMultipleGames,
  onRemoveGame,
  onEditGame,
  onClearAllGames,
  onShuffleGames,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Single game add handler
  const handleSingleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const result = onAddGame(inputText.trim());
    if (result.success) {
      setInputText('');
      setFeedback(null);
    } else {
      setFeedback({ type: 'error', text: result.message || 'Could not add game' });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Bulk games add handler
  const handleBulkAddSubmit = () => {
    if (!bulkText.trim()) return;
    // Split by newlines, commas, or semicolons
    const rawNames = bulkText
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (rawNames.length === 0) return;

    const result = onAddMultipleGames(rawNames);
    setBulkText('');
    setIsBulkModalOpen(false);

    if (result.addedCount > 0) {
      setFeedback({
        type: 'success',
        text: `Added ${result.addedCount} games${
          result.duplicateCount > 0 ? ` (${result.duplicateCount} duplicates skipped)` : ''
        }!`,
      });
      setTimeout(() => setFeedback(null), 3500);
    } else if (result.duplicateCount > 0) {
      setFeedback({
        type: 'error',
        text: `All ${result.duplicateCount} entered games are already on your wheel.`,
      });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  // Inline edit handler
  const startEditing = (game: WheelGameEntry) => {
    setEditingId(game.id);
    setEditingText(game.name);
  };

  const saveEditing = (id: string) => {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }
    const result = onEditGame(id, editingText.trim());
    if (result.success) {
      setEditingId(null);
      setEditingText('');
      setFeedback(null);
    } else {
      setFeedback({ type: 'error', text: result.message || 'Duplicate name' });
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Header & Item Count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
            <span>Wheel Games</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {games.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {games.length < 2
              ? 'Add at least 2 games to spin the wheel'
              : 'Add, edit, or randomize your wheel entries'}
          </p>
        </div>

        {/* Action buttons: Bulk Add, Shuffle, Clear */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            disabled={disabled}
            className="p-2 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 rounded-lg transition-colors flex items-center gap-1"
            title="Paste multiple games at once"
            aria-label="Paste multiple games at once"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bulk Add</span>
          </button>

          {games.length > 1 && (
            <button
              type="button"
              onClick={onShuffleGames}
              disabled={disabled}
              className="p-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors flex items-center gap-1"
              title="Shuffle wheel order"
              aria-label="Shuffle wheel order"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          )}

          {games.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={disabled}
              className="p-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1"
              title="Clear all games"
              aria-label="Clear all games"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Single Input Form */}
      <form onSubmit={handleSingleAdd} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={disabled}
            maxLength={60}
            placeholder="Enter a game name (e.g. World of Warships, GTA V)..."
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 focus:border-purple-500 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !inputText.trim()}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md shadow-purple-900/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Game
        </button>
      </form>

      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn ${
            feedback.type === 'error'
              ? 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Games List */}
      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
        {games.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-700/60 rounded-xl bg-slate-950/30">
            <p className="text-sm font-semibold text-slate-400">Your wheel is empty</p>
            <p className="text-xs text-slate-500 mt-1">
              Add at least 2 games above or pick a preset below to start spinning!
            </p>
          </div>
        ) : (
          games.map((game, index) => {
            const isEditing = editingId === game.id;
            const swatchColor =
              game.color || WHEEL_COLOR_PALETTE[index % WHEEL_COLOR_PALETTE.length];

            return (
              <div
                key={game.id}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-purple-500/30 transition-all text-xs"
              >
                {/* Index + Color Swatch + Game Name */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <span className="text-[11px] font-mono text-slate-500 w-5 text-right shrink-0">
                    {index + 1}.
                  </span>
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: swatchColor }}
                  />

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing(game.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        maxLength={60}
                        autoFocus
                        className="w-full px-2 py-1 bg-slate-800 border border-purple-500 rounded text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEditing(game.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300 rounded"
                        aria-label="Save game edit"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 text-slate-400 hover:text-white rounded"
                        aria-label="Cancel game edit"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-semibold text-slate-200 truncate">{game.name}</span>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => startEditing(game)}
                      disabled={disabled}
                      className="p-1.5 text-slate-400 hover:text-purple-300 rounded hover:bg-white/5 transition-colors"
                      title="Edit name"
                      aria-label={`Edit ${game.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveGame(game.id)}
                      disabled={disabled}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-white/5 transition-colors"
                      title="Remove game"
                      aria-label={`Remove ${game.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bulk Add Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Enter Multiple Games
              </h4>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close bulk entry modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste or type your list of games below. Separate each game with a new line, comma, or semicolon.
            </p>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={7}
              placeholder={`World of Warships\nPUBG Mobile\nMinecraft\nFortnite\nGrand Theft Auto V\nCounter-Strike 2`}
              className="w-full p-3 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none resize-none font-mono"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkAddSubmit}
                disabled={!bulkText.trim()}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider transition-colors"
              >
                Add to Wheel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-['Space_Grotesk'] text-white">
              Clear All Wheel Games?
            </h4>
            <p className="text-xs text-slate-400">
              This will remove all {games.length} games from your active wheel. You can still load them back from presets or saved wheels.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAllGames();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
