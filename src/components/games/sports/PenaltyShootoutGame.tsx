import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Target } from 'lucide-react';

export const PenaltyShootoutGame: React.FC = () => {
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [shotsTaken, setShotsTaken] = useState<('goal' | 'miss')[]>([]);
  const [keeperDive, setKeeperDive] = useState<'left' | 'center' | 'right' | null>(null);
  const [ballPosition, setBallPosition] = useState<{ x: number; y: number } | null>(null);
  const [shotResult, setShotResult] = useState<'goal' | 'saved' | null>(null);
  const [isKicking, setIsKicking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const targets = [
    { id: 'top-left', label: 'Top Left', x: 22, y: 20, diveTarget: 'left' },
    { id: 'top-center', label: 'Top Bar', x: 50, y: 15, diveTarget: 'center' },
    { id: 'top-right', label: 'Top Right', x: 78, y: 20, diveTarget: 'right' },
    { id: 'bottom-left', label: 'Low Left', x: 25, y: 65, diveTarget: 'left' },
    { id: 'bottom-right', label: 'Low Right', x: 75, y: 65, diveTarget: 'right' }
  ];

  const handleShoot = (target: typeof targets[0]) => {
    if (isKicking || gameOver) return;
    setIsKicking(true);
    setShotResult(null);

    // Randomize Keeper Dive (AI reaction)
    const options: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
    const aiDive = options[Math.floor(Math.random() * options.length)];
    setKeeperDive(aiDive);
    setBallPosition({ x: target.x, y: target.y });

    setTimeout(() => {
      const isSaved = aiDive === target.diveTarget && Math.random() < 0.75;
      if (isSaved) {
        setShotResult('saved');
        setShotsTaken((prev) => [...prev, 'miss']);
      } else {
        setShotResult('goal');
        setPlayerScore((p) => p + 1);
        setShotsTaken((prev) => [...prev, 'goal']);
      }

      setTimeout(() => {
        setIsKicking(false);
        setBallPosition(null);
        setKeeperDive(null);
        setShotResult(null);

        if (shotsTaken.length + 1 >= 5) {
          setGameOver(true);
        } else {
          setRound((r) => r + 1);
        }
      }, 1200);
    }, 600);
  };

  const restartShootout = () => {
    setRound(1);
    setPlayerScore(0);
    setShotsTaken([]);
    setKeeperDive(null);
    setBallPosition(null);
    setShotResult(null);
    setIsKicking(false);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[600px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-[10px]">PENALTY ROUND</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {shotsTaken.length} / 5
          </span>
        </div>

        {/* 5-Shot Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => {
            const res = shotsTaken[i];
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                  res === 'goal'
                    ? 'bg-emerald-500 border-emerald-400 text-black'
                    : res === 'miss'
                    ? 'bg-rose-500 border-rose-400 text-white'
                    : 'bg-white/10 border-white/20 text-transparent'
                }`}
              >
                {res === 'goal' ? '✓' : res === 'miss' ? '✕' : ''}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[10px]">SCORE</span>
          <span className="text-base font-bold font-mono text-amber-400">{playerScore}</span>
        </div>
      </div>

      {/* Goal Post & Pitch Screen */}
      <div className="relative w-full aspect-[3/2] bg-gradient-to-b from-[#080816] via-[#0F172A] to-[#064E3B] border-x border-purple-500/20 overflow-hidden flex flex-col justify-end p-4 shadow-2xl">
        {/* Goal Frame Structure */}
        <div className="relative w-4/5 max-w-[460px] h-[190px] mx-auto border-4 border-white/90 rounded-t-lg bg-black/20 backdrop-blur-xs flex items-center justify-center">
          {/* Goal Net Cross-Hatch */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Goalkeeper Avatar */}
          <div
            className={`absolute bottom-0 transition-all duration-500 ease-out flex flex-col items-center ${
              keeperDive === 'left'
                ? 'left-8 -rotate-45'
                : keeperDive === 'right'
                ? 'right-8 rotate-45'
                : 'left-1/2 -translate-x-1/2'
            }`}
          >
            {/* Goalkeeper Silhouette */}
            <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-xs font-bold text-black shadow-lg">
              GK
            </div>
            <div className="w-8 h-12 bg-amber-600 rounded-t-md mt-0.5" />
          </div>

          {/* Interactive Target Zones (when ready to shoot) */}
          {!isKicking && !gameOver && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-3">
              {targets.map((tgt) => (
                <button
                  key={tgt.id}
                  onClick={() => handleShoot(tgt)}
                  className="rounded-lg border border-white/20 hover:border-emerald-400 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition group"
                >
                  <Target className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                  <span className="hidden sm:inline">{tgt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Animated Soccer Ball Flight */}
          {ballPosition && (
            <div
              className="absolute w-8 h-8 rounded-full bg-white border-2 border-black shadow-2xl transition-all duration-500 ease-out flex items-center justify-center text-xs"
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              ⚽
            </div>
          )}
        </div>

        {/* Penalty Spot and Ball */}
        <div className="w-full flex justify-center pt-6 pb-2">
          {!ballPosition && (
            <div className="w-8 h-8 rounded-full bg-white border-2 border-black shadow-lg flex items-center justify-center text-sm animate-pulse">
              ⚽
            </div>
          )}
        </div>

        {/* Goal / Saved Splash Banner */}
        {shotResult === 'goal' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h2 className="text-4xl font-black text-emerald-400 tracking-wider animate-bounce">
              GOAAAL!
            </h2>
          </div>
        )}

        {shotResult === 'saved' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h2 className="text-3xl font-black text-rose-500 tracking-wider animate-pulse">
              SAVED BY KEEPER!
            </h2>
          </div>
        )}

        {/* Game Over Outcome Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Trophy className="w-12 h-12 text-amber-400 mb-2" />
            <h2 className="text-2xl font-black mb-1 text-white">SHOOTOUT COMPLETE</h2>
            <p className="text-sm text-white/70 mb-4">
              You converted {playerScore} of 5 spot kicks!
            </p>
            <button
              onClick={restartShootout}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Shootout
            </button>
          </div>
        )}
      </div>

      {/* Target Guide Instructions */}
      <div className="w-full p-3 bg-black/70 border border-purple-500/20 rounded-b-xl text-center text-xs text-white/60">
        Click any of the 5 targeting zones in the goal frame to place your kick!
      </div>
    </div>
  );
};
