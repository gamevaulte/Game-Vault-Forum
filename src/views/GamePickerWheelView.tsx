import React, { useState, useEffect, useCallback } from 'react';
import { WheelGameEntry, WheelSettings, SpinHistoryItem, SavedWheel, WheelPreset } from '../types/gamePickerWheel';
import { WheelCanvas } from '../components/wheel/WheelCanvas';
import { GameListManager } from '../components/wheel/GameListManager';
import { WinnerModal } from '../components/wheel/WinnerModal';
import { WheelSettingsModal } from '../components/wheel/WheelSettingsModal';
import { SpinHistoryModal } from '../components/wheel/SpinHistoryModal';
import { SaveWheelsModal } from '../components/wheel/SaveWheelsModal';
import { ShareWheelModal } from '../components/wheel/ShareWheelModal';
import { AiGameListModal } from '../components/wheel/AiGameListModal';
import { AiMoodFilterModal } from '../components/wheel/AiMoodFilterModal';
import { WHEEL_PRESETS, WHEEL_COLOR_PALETTE } from '../lib/wheelPresets';
import { playWinnerFanfare } from '../lib/wheelSound';
import {
  Volume2,
  VolumeX,
  Settings,
  History,
  Bookmark,
  Share2,
  Wand2,
  Smile,
  HelpCircle,
  Cpu,
  User,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Dices,
  AlertCircle
} from 'lucide-react';
import { UserAccount, PageTab } from '../types';

interface GamePickerWheelViewProps {
  currentUser?: UserAccount;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  onNavigateTab?: (tab: PageTab) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  initialSharedGames?: string[];
}

const DEFAULT_GAMES: string[] = [
  'World of Warships',
  'PUBG Mobile',
  'Minecraft',
  'Fortnite',
  'Grand Theft Auto V',
  'Call of Duty',
  'EA Sports FC',
  'Counter-Strike 2',
];

export const GamePickerWheelView: React.FC<GamePickerWheelViewProps> = ({
  currentUser,
  isSignedIn = false,
  onOpenSignIn = () => {},
  onNavigateTab = () => {},
  onShowToast = () => {},
  initialSharedGames,
}) => {
  // 1. Wheel Games State
  const [games, setGames] = useState<WheelGameEntry[]>(() => {
    // Check URL search params for shared games
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const shared = searchParams.get('games');
      if (shared) {
        const parsed = shared.split(',').map((name, idx) => ({
          id: `game-${Date.now()}-${idx}`,
          name: name.trim(),
          color: WHEEL_COLOR_PALETTE[idx % WHEEL_COLOR_PALETTE.length],
        })).filter((g) => g.name.length > 0);
        if (parsed.length > 0) return parsed;
      }
    }

    if (initialSharedGames && initialSharedGames.length > 0) {
      return initialSharedGames.map((name, idx) => ({
        id: `game-${Date.now()}-${idx}`,
        name: name.trim(),
        color: WHEEL_COLOR_PALETTE[idx % WHEEL_COLOR_PALETTE.length],
      }));
    }

    // Try to load last active wheel from localStorage
    try {
      const saved = localStorage.getItem('gv_active_wheel_games');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    // Default 8 games from user requirements
    return DEFAULT_GAMES.map((name, idx) => ({
      id: `default-${idx}`,
      name,
      color: WHEEL_COLOR_PALETTE[idx % WHEEL_COLOR_PALETTE.length],
    }));
  });

  // Persist games to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('gv_active_wheel_games', JSON.stringify(games));
    } catch {}
  }, [games]);

  // 2. Settings State
  const [settings, setSettings] = useState<WheelSettings>(() => {
    try {
      const saved = localStorage.getItem('gv_wheel_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      spinDuration: 'normal', // 5s
      removeWinnerAfterSpin: false,
      soundEffects: false, // Requirement 10: off by default
      celebrationAnimation: true,
    };
  });

  const updateSettings = (updated: Partial<WheelSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('gv_wheel_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // 3. Spin State & Winner
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelGameEntry | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  // 4. History State
  const [history, setHistory] = useState<SpinHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gv_wheel_spin_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // 5. Saved Wheels State
  const [savedWheels, setSavedWheels] = useState<SavedWheel[]>(() => {
    try {
      const saved = localStorage.getItem('gv_saved_wheels');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'preset-popular',
        name: 'Trending Blockbusters',
        games: WHEEL_PRESETS[0].games,
        createdAt: 'Official Preset',
        updatedAt: 'Official Preset',
      },
    ];
  });

  // 6. Modals Open State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isAiMoodOpen, setIsAiMoodOpen] = useState(false);

  // Keyboard shortcut: Space or Enter to spin if not already spinning or typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' && !isSpinning && games.length >= 2 && !isWinnerModalOpen) {
        e.preventDefault();
        // Handled through button or canvas trigger
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, games.length, isWinnerModalOpen]);

  // Spin duration in milliseconds
  const getSpinDurationMs = () => {
    switch (settings.spinDuration) {
      case 'short':
        return 3000;
      case 'long':
        return 8000;
      case 'normal':
      default:
        return 5000;
    }
  };

  // Spin Handlers
  const handleSpinStart = () => {
    setIsSpinning(true);
    setWinner(null);
    setIsWinnerModalOpen(false);
  };

  const handleSpinEnd = (selectedWinner: WheelGameEntry) => {
    setIsSpinning(false);
    setWinner(selectedWinner);
    setIsWinnerModalOpen(true);

    // Audio fanfare on win
    playWinnerFanfare(settings.soundEffects);

    // Record to history
    const now = new Date();
    const historyItem: SpinHistoryItem = {
      id: `spin-${Date.now()}`,
      gameName: selectedWinner.name,
      timestamp: Date.now(),
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => {
      const updated = [historyItem, ...prev].slice(0, 50); // Keep last 50
      try {
        localStorage.setItem('gv_wheel_spin_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // If Remove Winner After Spin is enabled, automatically schedule removal
    if (settings.removeWinnerAfterSpin) {
      setTimeout(() => {
        setGames((prev) => prev.filter((g) => g.id !== selectedWinner.id));
        onShowToast(`"${selectedWinner.name}" removed from wheel for next round.`, 'info');
      }, 500);
    }
  };

  // Game Management Handlers
  const handleAddGame = (name: string): { success: boolean; message?: string } => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { success: false, message: 'Game name cannot be empty.' };
    }
    if (trimmed.length > 60) {
      return { success: false, message: 'Game name must be 60 characters or less.' };
    }

    // Duplicate check case-insensitive (Requirement 13)
    const isDuplicate = games.some(
      (g) => g.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, message: `"${trimmed}" is already on your wheel.` };
    }

    const newEntry: WheelGameEntry = {
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      color: WHEEL_COLOR_PALETTE[games.length % WHEEL_COLOR_PALETTE.length],
      addedAt: Date.now(),
    };

    setGames((prev) => [...prev, newEntry]);
    return { success: true };
  };

  const handleAddMultipleGames = (
    names: string[]
  ): { addedCount: number; duplicateCount: number } => {
    let addedCount = 0;
    let duplicateCount = 0;

    setGames((prev) => {
      const existingLower = new Set(prev.map((g) => g.name.toLowerCase()));
      const newItems: WheelGameEntry[] = [];

      names.forEach((raw) => {
        const trimmed = raw.trim();
        if (!trimmed || trimmed.length > 60) return;
        if (existingLower.has(trimmed.toLowerCase())) {
          duplicateCount++;
        } else {
          existingLower.add(trimmed.toLowerCase());
          newItems.push({
            id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: trimmed,
            color: WHEEL_COLOR_PALETTE[(prev.length + newItems.length) % WHEEL_COLOR_PALETTE.length],
            addedAt: Date.now(),
          });
          addedCount++;
        }
      });

      return [...prev, ...newItems];
    });

    return { addedCount, duplicateCount };
  };

  const handleRemoveGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleEditGame = (id: string, newName: string): { success: boolean; message?: string } => {
    const trimmed = newName.trim();
    if (!trimmed) {
      return { success: false, message: 'Game name cannot be empty.' };
    }

    const isDuplicate = games.some(
      (g) => g.id !== id && g.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      return { success: false, message: `"${trimmed}" is already on your wheel.` };
    }

    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, name: trimmed } : g))
    );
    return { success: true };
  };

  const handleClearAllGames = () => {
    setGames([]);
    onShowToast('Cleared all games from wheel.', 'info');
  };

  const handleShuffleGames = () => {
    setGames((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.map((g, idx) => ({
        ...g,
        color: WHEEL_COLOR_PALETTE[idx % WHEEL_COLOR_PALETTE.length],
      }));
    });
    onShowToast('Wheel order randomized!', 'info');
  };

  // Preset loading handler (Requirement 8)
  const handleLoadPreset = (preset: WheelPreset) => {
    const newItems: WheelGameEntry[] = preset.games.map((name, idx) => ({
      id: `preset-${preset.id}-${idx}`,
      name,
      color: WHEEL_COLOR_PALETTE[idx % WHEEL_COLOR_PALETTE.length],
    }));
    setGames(newItems);
    onShowToast(`Loaded "${preset.title}" with ${preset.games.length} games!`, 'success');
  };

  // Saved Wheels Handlers
  const handleSaveCurrentWheel = (name: string) => {
    const newWheel: SavedWheel = {
      id: `wheel-${Date.now()}`,
      name,
      games: games.map((g) => g.name),
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      userId: currentUser?.id,
    };

    setSavedWheels((prev) => {
      const updated = [newWheel, ...prev];
      try {
        localStorage.setItem('gv_saved_wheels', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    onShowToast(`Saved wheel "${name}" successfully!`, 'success');
  };

  const handleLoadSavedWheel = (saved: SavedWheel) => {
    const loadedGames: WheelGameEntry[] = saved.games.map((name, idx) => ({
      id: `loaded-${idx}-${Date.now()}`,
      name,
      color: WHEEL_COLOR_PALETTE[idx % WHEEL_COLOR_PALETTE.length],
    }));
    setGames(loadedGames);
    onShowToast(`Loaded saved wheel "${saved.name}"!`, 'success');
  };

  const handleDeleteSavedWheel = (wheelId: string) => {
    setSavedWheels((prev) => {
      const updated = prev.filter((w) => w.id !== wheelId);
      try {
        localStorage.setItem('gv_saved_wheels', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    onShowToast('Deleted saved wheel.', 'info');
  };

  // Mood Filter Handlers
  const handleApplyFilteredSubset = (filteredNames: string[]) => {
    const filteredGames = games.filter((g) =>
      filteredNames.some((fn) => fn.toLowerCase() === g.name.toLowerCase())
    );
    if (filteredGames.length > 0) {
      setGames(filteredGames);
      onShowToast(`Wheel filtered down to ${filteredGames.length} matching games!`, 'success');
    }
  };

  const handleInstantSpinFiltered = (winnerName: string) => {
    const matched = games.find(
      (g) => g.name.toLowerCase() === winnerName.toLowerCase()
    ) || {
      id: `instant-${Date.now()}`,
      name: winnerName,
    };
    handleSpinEnd(matched);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pb-20">
      {/* 1. Breadcrumb & Utility Top Bar */}
      <div className="border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <button
              type="button"
              onClick={() => onNavigateTab('home')}
              className="hover:text-purple-300 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              type="button"
              onClick={() => onNavigateTab('tools')}
              className="hover:text-purple-300 transition-colors"
            >
              Gaming Utilities
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-purple-400 font-semibold">Game Picker Wheel</span>
          </nav>

          {/* Quick Action Buttons (Sound, Settings, History, Save, Share) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                settings.soundEffects
                  ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
              title={settings.soundEffects ? 'Sound On' : 'Sound Off'}
              aria-label="Toggle Sound Effects"
            >
              {settings.soundEffects ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden md:inline text-[11px]">
                {settings.soundEffects ? 'Sound On' : 'Sound Off'}
              </span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors"
              title="Wheel Settings"
              aria-label="Open Wheel Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* History */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors relative"
              title="Spin History"
              aria-label="Open Spin History"
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-purple-600 text-white">
                  {history.length}
                </span>
              )}
            </button>

            {/* Save Wheel */}
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-colors"
              title="Save or Load Wheels"
              aria-label="Save or Load Wheels"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 transition-colors"
              title="Share This Wheel"
              aria-label="Share This Wheel"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* 2. Tool Title & Hero Description (Prompt 1) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Randomizer Utility</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
            🎮 Game Picker Wheel
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Can't decide what to play? Add your games, spin the wheel, and let Game Vault Forum choose for you!
          </p>

          {/* AI Features Bar */}
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAiGeneratorOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-800/50 hover:to-indigo-800/50 border border-purple-500/40 text-purple-200 text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Game List Generator</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAiMoodOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Smile className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pick for My Mood</span>
            </button>
          </div>
        </div>

        {/* 3. Quick Example Lists (Presets - Requirement 8) */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Presets
            </span>
            <span className="text-[11px] text-slate-500">One-click load</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {WHEEL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/60 hover:border-purple-500/40 border border-white/5 text-xs font-semibold text-slate-300 hover:text-purple-200 whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5"
                title={preset.description}
              >
                <span>{preset.title}</span>
                <span className="text-[10px] text-slate-500">({preset.games.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Minimum Validation Notice (Requirement 11 & 12) */}
        {games.length === 1 && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-2 max-w-xl mx-auto animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Add at least one more game before spinning the wheel.</span>
          </div>
        )}

        {/* 5. Main Wheel & Game Manager Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wheel Display Section (Left/Center on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center bg-slate-950/50 border border-purple-500/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <WheelCanvas
              games={games}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
              spinDurationMs={getSpinDurationMs()}
              soundEnabled={settings.soundEffects}
              disabled={games.length < 2}
            />

            {/* Quick Helper Subtext under Wheel */}
            <p className="text-[11px] text-slate-500 mt-4 text-center">
              Click the center hub or the spin button. Every game slice has fair, unbiased probability.
            </p>
          </div>

          {/* Game List Management Section (Right on Desktop, Below on Mobile) */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-4">
            <GameListManager
              games={games}
              onAddGame={handleAddGame}
              onAddMultipleGames={handleAddMultipleGames}
              onRemoveGame={handleRemoveGame}
              onEditGame={handleEditGame}
              onClearAllGames={handleClearAllGames}
              onShuffleGames={handleShuffleGames}
              disabled={isSpinning}
            />
          </div>
        </div>

        {/* 6. Deep Dive / SEO & Utility Guide Section (Requirement 23) */}
        <div className="mt-16 pt-10 border-t border-white/10 space-y-8 text-left">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Why Use the Game Picker Wheel?
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              With thousands of titles across Steam, Xbox Game Pass, PlayStation Plus, and backlog libraries, gamers regularly experience decision fatigue. The Game Vault Forum Game Picker Wheel eliminates choice paralysis by providing mathematically fair, client-side randomization wrapped in an interactive wheel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Dices className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-['Space_Grotesk']">
                100% Fair Randomization
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by browser cryptographic entropy (`crypto.getRandomValues`) guaranteeing every game segment receives equal mathematical weight.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-['Space_Grotesk']">
                Multiplayer Squad Voting
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add your squad's top games, generate a shareable wheel URL, and let the wheel impartially decide what multiplayer title to play together.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-['Space_Grotesk']">
                Cloud & Offline Storage
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save your backlog, weekend co-op, or party wheels to Firestore cloud storage or your local browser storage without requiring an account.
              </p>
            </div>
          </div>

          {/* Cross-Link Other Gaming Tools */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Explore More Game Vault Utilities
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Check hardware requirements, generate competitive gamertags, or optimize custom PC builds.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onNavigateTab('pc-requirements')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                PC Requirements
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('gaming-username-generator')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Username Generator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Modals */}
      <WinnerModal
        winner={winner}
        isOpen={isWinnerModalOpen}
        onClose={() => setIsWinnerModalOpen(false)}
        onSpinAgain={() => {
          setIsWinnerModalOpen(false);
          // Small delay then trigger next spin
          setTimeout(() => {
            const btn = document.querySelector('button[aria-label="Spin the Game Wheel"]') as HTMLButtonElement;
            if (btn) btn.click();
          }, 300);
        }}
        onRemoveWinner={(id) => {
          handleRemoveGame(id);
          onShowToast('Removed winning game from wheel.', 'info');
        }}
        onKeepWinner={() => {
          onShowToast('Winning game kept on wheel.', 'info');
        }}
        onOpenAddGame={() => {
          const input = document.querySelector('input[placeholder*="Enter a game name"]') as HTMLInputElement;
          if (input) input.focus();
        }}
        celebrationEnabled={settings.celebrationAnimation}
      />

      <WheelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <SpinHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => {
          setHistory([]);
          try {
            localStorage.removeItem('gv_wheel_spin_history');
          } catch {}
          onShowToast('Cleared spin history.', 'info');
        }}
      />

      <SaveWheelsModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentGames={games}
        savedWheels={savedWheels}
        onSaveCurrentWheel={handleSaveCurrentWheel}
        onLoadWheel={handleLoadSavedWheel}
        onDeleteWheel={handleDeleteSavedWheel}
        isSignedIn={isSignedIn}
        onOpenSignIn={onOpenSignIn}
      />

      <ShareWheelModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        games={games}
      />

      <AiGameListModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onAddGame={handleAddGame}
        onAddMultipleGames={handleAddMultipleGames}
      />

      <AiMoodFilterModal
        isOpen={isAiMoodOpen}
        onClose={() => setIsAiMoodOpen(false)}
        wheelGames={games}
        onApplyFilteredSubset={handleApplyFilteredSubset}
        onInstantSpinFiltered={handleInstantSpinFiltered}
      />
    </div>
  );
};
