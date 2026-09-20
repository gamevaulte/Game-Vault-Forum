import React, { useState } from 'react';
import { PlayableGame, GamingCategory, MultiplayerSession } from '../../types/gaming';
import { User as FirebaseUser } from 'firebase/auth';
import { Maximize2, Minimize2, Info, Swords, ArrowLeft, Sparkles, Shield, Heart } from 'lucide-react';

// Games
import { SpaceInvadersGame } from './arcade/SpaceInvadersGame';
import { NeonSnakeGame } from './arcade/NeonSnakeGame';
import { BrickBreakerGame } from './arcade/BrickBreakerGame';
import { Game2048 } from './puzzle/Game2048';
import { MinesweeperGame } from './puzzle/MinesweeperGame';
import { MemoryMatchGame } from './puzzle/MemoryMatchGame';
import { CyberPongGame } from './sports/CyberPongGame';
import { FreeThrowBasketballGame } from './sports/FreeThrowBasketballGame';
import { PenaltyShootoutGame } from './sports/PenaltyShootoutGame';
import { TacticalChessGame } from './strategy/TacticalChessGame';
import { TowerDefenseGame } from './strategy/TowerDefenseGame';
import { NavalCommandGame } from './strategy/NavalCommandGame';
import { ConnectFourGame } from './multiplayer/ConnectFourGame';
import { TicTacToeGame } from './multiplayer/TicTacToeGame';
import { NavalDuelGame } from './multiplayer/NavalDuelGame';
import { BlackjackGame } from './cards/BlackjackGame';
import { SolitaireGame } from './cards/SolitaireGame';
import { CheckersGame } from './cards/CheckersGame';

interface GamePlayerContainerProps {
  game: PlayableGame;
  category: GamingCategory;
  currentUser: FirebaseUser | null;
  session: MultiplayerSession | null;
  onOpenInviteModal: () => void;
  onOpenSignIn: () => void;
  onBackToCategory: () => void;
  onSelectGame: (slug: string) => void;
}

export const GamePlayerContainer: React.FC<GamePlayerContainerProps> = ({
  game,
  category,
  currentUser,
  session,
  onOpenInviteModal,
  onOpenSignIn,
  onBackToCategory,
  onSelectGame
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'controls' | 'rules'>('game');

  const renderGameComponent = () => {
    switch (game.slug) {
      case 'space-invaders':
        return <SpaceInvadersGame />;
      case 'neon-snake':
        return <NeonSnakeGame />;
      case 'brick-breaker':
        return <BrickBreakerGame />;
      case '2048':
        return <Game2048 />;
      case 'minesweeper':
        return <MinesweeperGame />;
      case 'memory-match':
        return <MemoryMatchGame />;
      case 'cyber-pong':
        return <CyberPongGame />;
      case 'free-throw-basketball':
        return <FreeThrowBasketballGame />;
      case 'penalty-shootout':
        return <PenaltyShootoutGame />;
      case 'tactical-chess':
        return <TacticalChessGame />;
      case 'tower-defense':
        return <TowerDefenseGame />;
      case 'naval-command':
        return <NavalCommandGame />;
      case 'connect-four':
        return (
          <ConnectFourGame
            session={session}
            currentUser={currentUser}
            onOpenInviteModal={onOpenInviteModal}
          />
        );
      case 'tic-tac-toe':
        return (
          <TicTacToeGame
            session={session}
            currentUser={currentUser}
            onOpenInviteModal={onOpenInviteModal}
          />
        );
      case 'naval-duel':
        return (
          <NavalDuelGame
            session={session}
            currentUser={currentUser}
            onOpenInviteModal={onOpenInviteModal}
          />
        );
      case 'blackjack':
        return <BlackjackGame />;
      case 'solitaire':
        return <SolitaireGame />;
      case 'checkers':
        return <CheckersGame />;
      default:
        return (
          <div className="p-12 text-center text-white space-y-4">
            <h3 className="text-xl font-bold">Coming Soon</h3>
            <p className="text-sm text-white/60">This title is currently being prepped for the Vault.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCategory}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            title={`Back to ${category.title}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                {category.title}
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs text-white/50">{game.difficulty} Difficulty</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{game.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {game.supportsMultiplayer && (
            <button
              onClick={currentUser ? onOpenInviteModal : onOpenSignIn}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-white text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
            >
              <Swords className="w-4 h-4" />
              <span>{currentUser ? 'Invite Challenger' : 'Sign In to Duel'}</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            title={isFullscreen ? 'Exit Theater Mode' : 'Theater Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Game Stage Frame */}
      <div
        className={`w-full rounded-2xl bg-[#090912] border border-purple-500/20 p-4 md:p-6 shadow-2xl transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto bg-black/95 border-purple-500/40' : ''
        }`}
      >
        {isFullscreen && (
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">{game.title} - Theater View</h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="py-1 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              Close Theater Mode (Esc)
            </button>
          </div>
        )}

        {/* Dynamic Game Component Rendering */}
        <div className="w-full flex justify-center">{renderGameComponent()}</div>
      </div>

      {/* Game Details, Controls & Instructions Tabs */}
      <div className="rounded-2xl bg-[#0F0F1A] border border-white/10 p-6 space-y-6">
        <div className="flex gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'game'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'controls'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            How to Play
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Rules & Mechanics
          </button>
        </div>

        {activeTab === 'game' && (
          <div className="space-y-4">
            <p className="text-sm text-white/80 leading-relaxed">{game.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-white/40 block">Category</span>
                <span className="text-sm font-semibold text-purple-300">{category.title}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-white/40 block">Input Mode</span>
                <span className="text-sm font-semibold text-white">Keyboard / Mouse / Touch</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[11px] text-white/40 block">Multiplayer Support</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {game.supportsMultiplayer ? 'Real-Time Duel Supported' : 'Solo & Local Pass-Play'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-3 text-sm text-white/80 leading-relaxed">
            <h4 className="font-bold text-white text-base">Key Bindings & Controls</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-white/70 text-xs sm:text-sm">
              <li>
                <strong className="text-white">Desktop / Laptop:</strong> Use Arrow Keys, WASD, Spacebar, or your mouse pointer depending on the game type.
              </li>
              <li>
                <strong className="text-white">Mobile / Touchscreen:</strong> Integrated on-screen direction pads, touch targets, and charging buttons are provided under the game stage.
              </li>
              <li>
                <strong className="text-white">Score Saving:</strong> Your personal best high score is cached automatically for your current browser profile.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3 text-sm text-white/80 leading-relaxed">
            <h4 className="font-bold text-white text-base">System Rules & Fairness</h4>
            <p className="text-xs sm:text-sm text-white/70">
              In multiplayer duels, turn validation is verified server-side via the Game Vault authoritative engine.
              Invitations expire after 24 hours. Once both players submit their moves, victory badges and stats are recorded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
