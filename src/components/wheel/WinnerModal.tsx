import React, { useEffect, useRef } from 'react';
import { WheelGameEntry } from '../../types/gamePickerWheel';
import { MOCK_GAMES, MOCK_VIDEOS, MOCK_ARTICLES, MOCK_GUIDES, MOCK_REVIEWS } from '../../data/mockData';
import { INITIAL_GAMES_REQUIREMENTS } from '../../data/pcRequirementsData';
import { getSeoSlug } from '../../lib/seo';
import { RotateCw, Trash2, Check, Plus, ExternalLink, Trophy, X } from 'lucide-react';

interface WinnerModalProps {
  winner: WheelGameEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
  onRemoveWinner: (gameId: string) => void;
  onKeepWinner: () => void;
  onOpenAddGame: () => void;
  celebrationEnabled?: boolean;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  isOpen,
  onClose,
  onSpinAgain,
  onRemoveWinner,
  onKeepWinner,
  onOpenAddGame,
  celebrationEnabled = true,
}) => {
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cross-reference winner with Game Vault Database
  const matchedGame = React.useMemo(() => {
    if (!winner) return null;
    const cleanName = winner.name.trim().toLowerCase();

    // 1. Look in MOCK_GAMES
    const foundInGames = MOCK_GAMES.find(
      (g) => g.title.toLowerCase() === cleanName || cleanName.includes(g.title.toLowerCase()) || g.title.toLowerCase().includes(cleanName)
    );
    if (foundInGames) {
      return {
        title: foundInGames.title,
        genre: foundInGames.genre,
        platforms: foundInGames.platforms.join(', '),
        description: foundInGames.shortDescription,
        url: `/games/${getSeoSlug(foundInGames)}`,
        linkText: 'View Game Vault Profile',
        badge: 'Verified Game Vault Entry'
      };
    }

    // 2. Look in INITIAL_GAMES_REQUIREMENTS
    const foundInPc = INITIAL_GAMES_REQUIREMENTS.find(
      (p) => p.title.toLowerCase() === cleanName || cleanName.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(cleanName)
    );
    if (foundInPc) {
      return {
        title: foundInPc.title,
        genre: foundInPc.genre,
        platforms: 'PC (DirectX 11/12/Vulkan)',
        description: `Check full minimum and recommended PC requirements and hardware benchmarks for ${foundInPc.title} on Game Vault.`,
        url: `/tools/pc-game-requirements-checker/${foundInPc.slug}`,
        linkText: 'Check PC Hardware Specs',
        badge: 'PC Requirements Verified'
      };
    }

    // 3. Look in MOCK_VIDEOS
    const foundInVideo = MOCK_VIDEOS.find(
      (v) => v.game.toLowerCase() === cleanName || v.title.toLowerCase().includes(cleanName)
    );
    if (foundInVideo) {
      return {
        title: foundInVideo.game,
        genre: foundInVideo.category,
        platforms: 'PC / Console / Mobile',
        description: foundInVideo.shortDescription,
        url: `/videos/${getSeoSlug(foundInVideo)}`,
        linkText: 'Watch Tactical Video Briefing',
        badge: 'Video Coverage Available'
      };
    }

    // 4. Look in MOCK_GUIDES
    const foundInGuide = MOCK_GUIDES.find(
      (g) => g.game.toLowerCase() === cleanName || g.title.toLowerCase().includes(cleanName)
    );
    if (foundInGuide) {
      return {
        title: foundInGuide.game,
        genre: 'Tactical Guide',
        platforms: 'PC / Console',
        description: foundInGuide.shortDescription,
        url: `/guides/${getSeoSlug(foundInGuide)}`,
        linkText: 'Read Tactical Strategy Guide',
        badge: 'Strategy Guide Available'
      };
    }

    return null;
  }, [winner]);

  // Confetti canvas animation
  useEffect(() => {
    if (!isOpen || !celebrationEnabled) return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    const width = (canvas.width = canvas.parentElement?.clientWidth ? canvas.parentElement.clientWidth * dpr : 500 * dpr);
    const height = (canvas.height = canvas.parentElement?.clientHeight ? canvas.parentElement.clientHeight * dpr : 500 * dpr);

    const colors = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
    const particles = Array.from({ length: 65 }, () => ({
      x: width / 2,
      y: height / 2 - 40 * dpr,
      vx: (Math.random() - 0.5) * 14 * dpr,
      vy: (Math.random() - 0.8) * 14 * dpr,
      size: (Math.random() * 6 + 3) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8
    }));

    const renderConfetti = () => {
      ctx.clearRect(0, 0, width, height);
      let activeCount = 0;

      particles.forEach((p) => {
        if (p.alpha <= 0) return;
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35 * dpr; // Gravity
        p.vx *= 0.98;
        p.alpha -= 0.012;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (activeCount > 0) {
        animId = requestAnimationFrame(renderConfetti);
      }
    };

    animId = requestAnimationFrame(renderConfetti);

    return () => cancelAnimationFrame(animId);
  }, [isOpen, celebrationEnabled]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-900/50 overflow-hidden text-center p-6 sm:p-8">
        {/* Confetti Overlay Canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 pointer-events-none w-full h-full z-10"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors z-20"
          aria-label="Close Winner Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Glow Icon */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Trophy className="w-9 h-9 text-slate-950 stroke-[2.2]" />
        </div>

        {/* Celebration Title */}
        <p className="text-xs sm:text-sm font-bold font-['Rajdhani'] uppercase tracking-widest text-purple-400 mb-1">
          🎉 The Wheel Has Decided
        </p>
        <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-slate-200">
          YOU SHOULD PLAY:
        </h2>

        {/* Winning Game Title Display */}
        <div className="my-5 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-800/80 to-purple-950/60 border border-purple-500/50 shadow-inner">
          <h3 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-pink-300 break-words">
            {winner.name}
          </h3>
        </div>

        {/* Matched Game Vault Database Details */}
        {matchedGame && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-white/10 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold uppercase tracking-wider text-[10px] border border-purple-500/30">
                {matchedGame.badge}
              </span>
              <span className="text-slate-400">{matchedGame.genre}</span>
            </div>
            <p className="text-slate-300 line-clamp-2 leading-relaxed">
              {matchedGame.description}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 text-[11px]">
                <strong className="text-slate-300">Platforms:</strong> {matchedGame.platforms}
              </span>
              <a
                href={matchedGame.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
              >
                {matchedGame.linkText} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 z-20 relative">
          {/* SPIN AGAIN */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
            className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-['Space_Grotesk'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-900/40 active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            Spin Again
          </button>

          {/* KEEP WINNER */}
          <button
            type="button"
            onClick={() => {
              onKeepWinner();
              onClose();
            }}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold font-['Space_Grotesk'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            Keep Winner
          </button>

          {/* REMOVE WINNER */}
          <button
            type="button"
            onClick={() => {
              onRemoveWinner(winner.id);
              onClose();
            }}
            className="py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 font-bold font-['Space_Grotesk'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            Remove Winner
          </button>

          {/* ADD ANOTHER GAME */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAddGame();
            }}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-bold font-['Space_Grotesk'] text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            Add Game
          </button>
        </div>
      </div>
    </div>
  );
};
