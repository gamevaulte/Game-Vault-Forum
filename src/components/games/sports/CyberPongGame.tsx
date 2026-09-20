import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export const CyberPongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'player_won' | 'ai_won'>('idle');

  const stateRef = useRef<{
    pY: number; // Player Y
    aiY: number; // AI Y
    paddleH: number;
    paddleW: number;
    bX: number; // Ball X
    bY: number; // Ball Y
    bVx: number;
    bVy: number;
    bR: number;
    keys: { up: boolean; down: boolean };
  }>({
    pY: 180,
    aiY: 180,
    paddleH: 75,
    paddleW: 10,
    bX: 300,
    bY: 200,
    bVx: 5,
    bVy: 3,
    bR: 6,
    keys: { up: false, down: false }
  });

  const resetBall = (towardsAi: boolean) => {
    const s = stateRef.current;
    s.bX = 300;
    s.bY = 200;
    s.bVx = (towardsAi ? 5 : -5);
    s.bVy = (Math.random() - 0.5) * 6;
  };

  const startGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    resetBall(true);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) stateRef.current.keys.up = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) stateRef.current.keys.down = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) stateRef.current.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) stateRef.current.keys.down = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Clear dark stadium
      ctx.fillStyle = '#06060D';
      ctx.fillRect(0, 0, 600, 400);

      // Center court dashed line
      ctx.strokeStyle = '#3B82F633';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(300, 400);
      ctx.stroke();
      ctx.setLineDash([]);

      if (gameState === 'playing') {
        // Move player paddle
        if (s.keys.up) s.pY = Math.max(10, s.pY - 6);
        if (s.keys.down) s.pY = Math.min(400 - s.paddleH - 10, s.pY + 6);

        // Simple smooth AI opponent tracking
        const aiCenter = s.aiY + s.paddleH / 2;
        if (aiCenter < s.bY - 15) {
          s.aiY = Math.min(400 - s.paddleH - 10, s.aiY + 4.2);
        } else if (aiCenter > s.bY + 15) {
          s.aiY = Math.max(10, s.aiY - 4.2);
        }

        // Move ball
        s.bX += s.bVx;
        s.bY += s.bVy;

        // Top and bottom boundary bounce
        if (s.bY - s.bR < 0) {
          s.bY = s.bR;
          s.bVy *= -1;
        } else if (s.bY + s.bR > 400) {
          s.bY = 400 - s.bR;
          s.bVy *= -1;
        }

        // Player paddle bounce (Left side: x = 20)
        if (
          s.bX - s.bR <= 20 + s.paddleW &&
          s.bX + s.bR >= 20 &&
          s.bY >= s.pY &&
          s.bY <= s.pY + s.paddleH
        ) {
          s.bVx = Math.abs(s.bVx) * 1.05; // speed up slightly
          const hitDelta = (s.bY - (s.pY + s.paddleH / 2)) / (s.paddleH / 2);
          s.bVy = hitDelta * 5.5;
        }

        // AI paddle bounce (Right side: x = 570)
        if (
          s.bX + s.bR >= 570 &&
          s.bX - s.bR <= 570 + s.paddleW &&
          s.bY >= s.aiY &&
          s.bY <= s.aiY + s.paddleH
        ) {
          s.bVx = -Math.abs(s.bVx) * 1.05;
          const hitDelta = (s.bY - (s.aiY + s.paddleH / 2)) / (s.paddleH / 2);
          s.bVy = hitDelta * 5.5;
        }

        // Left goal (AI scores)
        if (s.bX < 0) {
          setAiScore((prev) => {
            const next = prev + 1;
            if (next >= 7) setGameState('ai_won');
            else resetBall(true);
            return next;
          });
        }

        // Right goal (Player scores)
        if (s.bX > 600) {
          setPlayerScore((prev) => {
            const next = prev + 1;
            if (next >= 7) setGameState('player_won');
            else resetBall(false);
            return next;
          });
        }
      }

      // Draw Player Paddle (Cyan)
      ctx.save();
      ctx.fillStyle = '#06B6D4';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 10;
      ctx.fillRect(20, s.pY, s.paddleW, s.paddleH);
      ctx.restore();

      // Draw AI Paddle (Pink)
      ctx.save();
      ctx.fillStyle = '#EC4899';
      ctx.shadowColor = '#EC4899';
      ctx.shadowBlur = 10;
      ctx.fillRect(570, s.aiY, s.paddleW, s.paddleH);
      ctx.restore();

      // Draw Ball (Purple)
      ctx.save();
      ctx.fillStyle = '#C084FC';
      ctx.shadowColor = '#C084FC';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(s.bX, s.bY, s.bR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[600px] mx-auto">
      {/* Top HUD Scoreboard */}
      <div className="w-full flex items-center justify-between px-6 py-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-white">
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-400 font-semibold uppercase">YOU (PLAYER)</span>
          <span className="text-2xl font-bold font-mono text-cyan-300">{playerScore}</span>
        </div>
        <div className="text-xs text-white/40 font-mono">FIRST TO 7 WINS</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-mono text-pink-400">{aiScore}</span>
          <span className="text-xs text-pink-400 font-semibold uppercase">AI OPPONENT</span>
        </div>
      </div>

      {/* Arena Canvas */}
      <div className="relative w-full aspect-[3/2] bg-black border-x border-purple-500/20 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-full block cursor-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relY = ((e.clientY - rect.top) / rect.height) * 400;
            stateRef.current.pY = Math.max(10, Math.min(400 - stateRef.current.paddleH - 10, relY - stateRef.current.paddleH / 2));
          }}
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">CYBER PONG</h2>
            <p className="text-xs text-white/70 max-w-xs mb-6">
              Face off against the adaptive AI. Deflect the plasma orb, curve your returns, and score 7 points to win.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-bold text-sm tracking-wide uppercase shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Match
            </button>
          </div>
        )}

        {(gameState === 'player_won' || gameState === 'ai_won') && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className={`text-2xl font-black mb-1 ${gameState === 'player_won' ? 'text-cyan-400' : 'text-pink-500'}`}>
              {gameState === 'player_won' ? 'MATCH VICTORY!' : 'AI WINS THE MATCH'}
            </h2>
            <p className="text-xs text-white/70 mb-4">
              Final Score: You {playerScore} - {aiScore} AI
            </p>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Rematch
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="w-full p-3 bg-black/60 border border-purple-500/20 rounded-b-xl flex items-center justify-between gap-3">
        <button
          onPointerDown={() => { stateRef.current.keys.up = true; }}
          onPointerUp={() => { stateRef.current.keys.up = false; }}
          className="flex-1 py-2.5 rounded-lg bg-white/10 active:bg-cyan-600 text-white font-bold text-sm"
        >
          ▲ Move Up
        </button>
        <button
          onPointerDown={() => { stateRef.current.keys.down = true; }}
          onPointerUp={() => { stateRef.current.keys.down = false; }}
          className="flex-1 py-2.5 rounded-lg bg-white/10 active:bg-cyan-600 text-white font-bold text-sm"
        >
          ▼ Move Down
        </button>
      </div>
    </div>
  );
};
