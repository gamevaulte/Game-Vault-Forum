import React from 'react';
import { SpinHistoryItem } from '../../types/gamePickerWheel';
import { History, Trash2, X, Trophy } from 'lucide-react';

interface SpinHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SpinHistoryItem[];
  onClearHistory: () => void;
}

export const SpinHistoryModal: React.FC<SpinHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <History className="w-5 h-5" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Spin History
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close history modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Trophy className="w-10 h-10 mx-auto text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold">No spins recorded yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Give the wheel a spin to start generating your history!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {history.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-right font-mono text-slate-500 shrink-0">
                    {history.length - idx}.
                  </span>
                  <span className="font-bold text-slate-200 truncate">{item.gameName}</span>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                  {item.formattedTime}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
