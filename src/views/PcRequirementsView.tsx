import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Gamepad2, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { 
  PcGameRequirements, 
  UserPcSpec, 
  CheckerResult 
} from '../types/pcRequirements';
import { 
  INITIAL_GAMES_REQUIREMENTS, 
  DEFAULT_USER_PC 
} from '../data/pcRequirementsData';
import { 
  comparePcAgainstGame 
} from '../lib/pcRequirementsChecker';
import { GameSelector } from '../components/pcRequirements/GameSelector';
import { RequirementsDisplayCards } from '../components/pcRequirements/RequirementsDisplayCards';
import { HardwareSelector } from '../components/pcRequirements/HardwareSelector';
import { ComparisonResultsView } from '../components/pcRequirements/ComparisonResultsView';
import { GamesMyPcCanRun } from '../components/pcRequirements/GamesMyPcCanRun';
import { PcRequirementsFaq } from '../components/pcRequirements/PcRequirementsFaq';
import { AdminRequirementsModal } from '../components/pcRequirements/AdminRequirementsModal';
import { UserAccount, PageTab } from '../types';

interface PcRequirementsViewProps {
  initialGameSlug?: string;
  currentUser?: UserAccount | null;
  onNavigateTab: (tab: PageTab) => void;
  onOpenVideo?: (gameTitle: string) => void;
  onOpenArticle?: (gameTitle: string) => void;
  onOpenForum?: (gameTitle: string) => void;
}

const STORAGE_KEY_USER_PC = 'gvf_saved_user_pc_v1';
const STORAGE_KEY_CUSTOM_GAMES = 'gvf_custom_pc_games_v1';

export const PcRequirementsView: React.FC<PcRequirementsViewProps> = ({
  initialGameSlug,
  currentUser,
  onNavigateTab,
  onOpenVideo,
  onOpenArticle,
  onOpenForum
}) => {
  // Load games from localStorage if customized, or use INITIAL_GAMES_REQUIREMENTS
  const [games, setGames] = useState<PcGameRequirements[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_GAMES);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Error loading saved game requirements:', e);
      }
    }
    return INITIAL_GAMES_REQUIREMENTS;
  });

  // Selected Game
  const [selectedGame, setSelectedGame] = useState<PcGameRequirements>(() => {
    if (initialGameSlug) {
      const match = games.find((g) => g.slug.toLowerCase() === initialGameSlug.toLowerCase());
      if (match) return match;
    }
    // Default to Cyberpunk 2077 or first game
    return games.find((g) => g.slug === 'cyberpunk-2077') || games[0];
  });

  // User PC state
  const [userPc, setUserPc] = useState<UserPcSpec>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_USER_PC);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.cpuName && parsed.gpuName) return parsed;
        }
      } catch (e) {
        console.error('Error loading user PC specs:', e);
      }
    }
    return DEFAULT_USER_PC;
  });

  const [isSaved, setIsSaved] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [checkerResult, setCheckerResult] = useState<CheckerResult | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Check if current user is admin
  const isAdmin = currentUser?.email === 'contact@gamevault.forum' || currentUser?.role === 'admin';

  // React to initialGameSlug change if route updates
  useEffect(() => {
    if (initialGameSlug) {
      const match = games.find((g) => g.slug.toLowerCase() === initialGameSlug.toLowerCase());
      if (match) {
        setSelectedGame(match);
      }
    }
  }, [initialGameSlug, games]);

  // Handle Save PC
  const handleSavePc = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_USER_PC, JSON.stringify(userPc));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

  // Run Check
  const handleCheckMyPc = () => {
    const res = comparePcAgainstGame(userPc, selectedGame);
    setCheckerResult(res);
    setHasChecked(true);

    // Smooth scroll to results
    setTimeout(() => {
      const element = document.getElementById('checker-results');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Game selection handler
  const handleSelectGame = (game: PcGameRequirements) => {
    setSelectedGame(game);
    // If already checked before, re-calculate for newly selected game
    if (hasChecked) {
      const res = comparePcAgainstGame(userPc, game);
      setCheckerResult(res);
    }
  };

  // Admin save/delete handlers
  const handleAdminSaveGame = (savedGame: PcGameRequirements) => {
    const existingIndex = games.findIndex((g) => g.id === savedGame.id);
    let updated: PcGameRequirements[];
    if (existingIndex >= 0) {
      updated = [...games];
      updated[existingIndex] = savedGame;
    } else {
      updated = [savedGame, ...games];
    }
    setGames(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CUSTOM_GAMES, JSON.stringify(updated));
    }
    if (selectedGame.id === savedGame.id) {
      setSelectedGame(savedGame);
      if (hasChecked) {
        setCheckerResult(comparePcAgainstGame(userPc, savedGame));
      }
    }
  };

  const handleAdminDeleteGame = (gameId: string) => {
    const updated = games.filter((g) => g.id !== gameId);
    setGames(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CUSTOM_GAMES, JSON.stringify(updated));
    }
    if (selectedGame.id === gameId) {
      setSelectedGame(updated[0] || INITIAL_GAMES_REQUIREMENTS[0]);
      setHasChecked(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080912] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-96 bg-purple-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-60 right-10 w-80 h-80 bg-cyan-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-['Space_Grotesk'] uppercase tracking-wider">
          <button
            onClick={() => onNavigateTab('home')}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-500">Gaming Utilities</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-purple-300 font-semibold">PC Game Requirements Checker</span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-purple-950/40 via-[#121422] to-cyan-950/40 border border-purple-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-widest">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Game Vault Forum • Official Hardware Utility</span>
            </div>

            <h1 className="font-['Rajdhani'] font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
              Can My PC Run This Game?
            </h1>

            <p className="text-purple-200/90 font-['Space_Grotesk'] text-base sm:text-lg font-medium leading-snug">
              Check whether your PC meets the minimum and recommended requirements for your favorite games.
            </p>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pt-1">
              Select a game and enter your PC specifications to see how your system compares with the game's requirements. Powered by verified official studio specifications — no fabricated FPS or synthetic marketing claims.
            </p>
          </div>

          {/* Admin Tools Trigger */}
          {isAdmin && (
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-purple-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Privileges Active (contact@gamevault.forum)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Requirements Database</span>
              </button>
            </div>
          )}
        </div>

        {/* STEP 1: SELECT A GAME */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-400/50 flex items-center justify-center font-['Rajdhani'] font-bold text-sm text-purple-300">
              1
            </span>
            <h2 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wide">
              Select Your Target Game
            </h2>
          </div>

          <GameSelector
            games={games}
            selectedGame={selectedGame}
            onSelectGame={handleSelectGame}
          />
        </section>

        {/* STEP 2: OFFICIAL GAME REQUIREMENTS DISPLAY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center font-['Rajdhani'] font-bold text-sm text-cyan-300">
                2
              </span>
              <h2 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wide">
                Official Requirements for {selectedGame.title}
              </h2>
            </div>
          </div>

          <RequirementsDisplayCards game={selectedGame} />
        </section>

        {/* STEP 3: ENTER YOUR PC SPECIFICATIONS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center font-['Rajdhani'] font-bold text-sm text-indigo-300">
              3
            </span>
            <h2 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wide">
              Configure Your PC Hardware
            </h2>
          </div>

          <HardwareSelector
            userPc={userPc}
            onChangeUserPc={setUserPc}
            onCheckMyPc={handleCheckMyPc}
            onSavePc={handleSavePc}
            isSaved={isSaved}
          />
        </section>

        {/* STEP 4: RESULTS VIEW */}
        {hasChecked && checkerResult && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center font-['Rajdhani'] font-bold text-sm text-emerald-300">
                  4
                </span>
                <h2 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wide">
                  Compatibility Analysis & Verdict
                </h2>
              </div>
            </div>

            <ComparisonResultsView
              result={checkerResult}
              game={selectedGame}
              userPc={userPc}
              onOpenVideo={onOpenVideo}
              onOpenArticle={onOpenArticle}
              onOpenForum={onOpenForum}
            />
          </section>
        )}

        {/* STEP 5: FIND GAMES MY PC CAN RUN */}
        <section className="space-y-4 pt-6">
          <GamesMyPcCanRun
            userPc={userPc}
            games={games}
            onSelectGame={(g) => {
              handleSelectGame(g);
              // scroll to top of selector
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
          />
        </section>

        {/* STEP 6: FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-4 pt-4">
          <PcRequirementsFaq />
        </section>
      </div>

      {/* Admin Modal */}
      {isAdmin && (
        <AdminRequirementsModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          games={games}
          onSaveGame={handleAdminSaveGame}
          onDeleteGame={handleAdminDeleteGame}
        />
      )}
    </div>
  );
};
