import React from 'react';
import { WheelSettings } from '../../types/gamePickerWheel';
import { Settings, X, Volume2, VolumeX, Sparkles, Clock, Trash } from 'lucide-react';

interface WheelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WheelSettings;
  onUpdateSettings: (updated: Partial<WheelSettings>) => void;
}

export const WheelSettingsModal: React.FC<WheelSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-5 text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Randomizer Settings
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting 1: Spin Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            Spin Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'short', label: 'Short (3s)' },
              { key: 'normal', label: 'Normal (5s)' },
              { key: 'long', label: 'Long (8s)' },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() =>
                  onUpdateSettings({ spinDuration: option.key as WheelSettings['spinDuration'] })
                }
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  settings.spinDuration === option.key
                    ? 'bg-purple-600 text-white border border-purple-400/50 shadow-md shadow-purple-900/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting 2: Remove Winner After Spin */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="space-y-0.5 pr-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Trash className="w-3.5 h-3.5 text-rose-400" />
              Remove Winner After Spin
            </span>
            <p className="text-[11px] text-slate-400">
              Automatically remove winning game from the wheel for sequential picks.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ removeWinnerAfterSpin: !settings.removeWinnerAfterSpin })
            }
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              settings.removeWinnerAfterSpin ? 'bg-purple-600' : 'bg-slate-800'
            }`}
            aria-label="Toggle remove winner after spin"
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.removeWinnerAfterSpin ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Setting 3: Sound Effects (Default: Off) */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="space-y-0.5 pr-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              {settings.soundEffects ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              Sound Effects
            </span>
            <p className="text-[11px] text-slate-400">
              Mechanical wheel clicks and victory audio chimes. (Off by default)
            </p>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ soundEffects: !settings.soundEffects })}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              settings.soundEffects ? 'bg-cyan-600' : 'bg-slate-800'
            }`}
            aria-label="Toggle sound effects"
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.soundEffects ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Setting 4: Celebration Animation */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5">
          <div className="space-y-0.5 pr-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Celebration Confetti
            </span>
            <p className="text-[11px] text-slate-400">
              Trigger colorful confetti bursts when the winning game is revealed.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ celebrationAnimation: !settings.celebrationAnimation })
            }
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
              settings.celebrationAnimation ? 'bg-amber-600' : 'bg-slate-800'
            }`}
            aria-label="Toggle celebration animation"
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.celebrationAnimation ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-['Space_Grotesk'] text-xs uppercase tracking-wider transition-colors"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
