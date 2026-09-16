import React, { useState } from 'react';
import { SavedWheel, WheelGameEntry } from '../../types/gamePickerWheel';
import { Bookmark, Trash2, Download, Plus, X, Cloud, HardDrive } from 'lucide-react';

interface SaveWheelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGames: WheelGameEntry[];
  savedWheels: SavedWheel[];
  onSaveCurrentWheel: (name: string) => void;
  onLoadWheel: (wheel: SavedWheel) => void;
  onDeleteWheel: (wheelId: string) => void;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
}

export const SaveWheelsModal: React.FC<SaveWheelsModalProps> = ({
  isOpen,
  onClose,
  currentGames,
  savedWheels,
  onSaveCurrentWheel,
  onLoadWheel,
  onDeleteWheel,
  isSignedIn,
  onOpenSignIn,
}) => {
  const [newWheelName, setNewWheelName] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWheelName.trim() || currentGames.length === 0) return;
    onSaveCurrentWheel(newWheelName.trim());
    setNewWheelName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-5 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Bookmark className="w-5 h-5" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              My Saved Wheels
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close saved wheels modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="text-slate-300">
              {isSignedIn ? 'Cloud Sync (Firestore Enabled)' : 'Local Storage (Browser Device)'}
            </span>
          </div>
          {!isSignedIn && (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="text-purple-400 hover:text-purple-300 font-semibold underline text-[11px]"
            >
              Sign In to Sync
            </button>
          )}
        </div>

        {/* Save Current Wheel Input */}
        <form onSubmit={handleSave} className="space-y-2">
          <label className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-slate-300">
            Save Current Wheel ({currentGames.length} games)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newWheelName}
              onChange={(e) => setNewWheelName(e.target.value)}
              placeholder="e.g. Weekend Squad Games, Co-op..."
              maxLength={40}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={!newWheelName.trim() || currentGames.length === 0}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </form>

        {/* Saved Wheels List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {savedWheels.length === 0 ? (
            <div className="py-6 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
              <p className="text-xs font-semibold">No saved wheels yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Save your favorite custom game lists for quick one-click loading.
              </p>
            </div>
          ) : (
            savedWheels.map((wheel) => (
              <div
                key={wheel.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-white/5 hover:border-purple-500/30 transition-all text-xs"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="font-bold text-slate-200 truncate">{wheel.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {wheel.games.length} games • {wheel.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadWheel(wheel);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 font-semibold flex items-center gap-1 transition-colors text-[11px]"
                  >
                    <Download className="w-3 h-3" />
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteWheel(wheel.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                    aria-label={`Delete ${wheel.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
