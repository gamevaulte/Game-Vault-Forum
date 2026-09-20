import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Heart } from 'lucide-react';

export const BrickBreakerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gv_brick_breaker_hi') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');

  const stateRef = useRef<{
    paddleX: number;
    paddleW: number;
    ballX: number;
    ballY: number;
    ballVx: number;
    ballVy: number;
    ballR: number;
    bricks: Array<{ x: number; y: number; w: number; h: number; color: string; hits: number; alive: boolean }>;
    keys: { left: boolean; right: boolean };
  }>({
    paddleX: 250,
    paddleW: 90,
    ballX: 300,
    ballY: 420,
    ballVx: 4,
    ballVy: -4,
    ballR: 6,
    bricks: [],
    keys: { left: false, right: false }
  });

  const initBricks = useCallback(() => {
    const bricks = [];
    const rows = 5;
    const cols = 8;
    const w = 62;
    const h = 20;
    const pad = 10;
    const offX = 35;
    const offY = 60;
    const colors = ['#EC4899', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offX + c * (w + pad),
          y: offY + r * (h + pad),
          w,
          h,
          color: colors[r % colors.length],
          hits: r === 0 ? 2 : 1,
          alive: true
        });
      }
    }
    return bricks;
  }, []);

  const startGame = () => {
    const s = stateRef.current;
    s.paddleX = 255;
    s.ballX = 300;
    s.ballY = 420;
    s.ballVx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
    s.ballVy = -4.5;
    s.bricks = initBricks();
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') s.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') s.keys.right = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') s.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') s.keys.right = false;
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

      // Dark canvas
      ctx.fillStyle = '#06060A';
      ctx.fillRect(0, 0, 600, 480);

      if (gameState === 'playing') {
        // Paddle movement
        if (s.keys.left) s.paddleX = Math.max(10, s.paddleX - 6);
        if (s.keys.right) s.paddleX = Math.min(600 - s.paddleW - 10, s.paddleX + 6);

        // Move ball
        s.ballX += s.ballVx;
        s.ballY += s.ballVy;

        // Side walls collision
        if (s.ballX - s.ballR < 0) {
          s.ballX = s.ballR;
          s.ballVx *= -1;
        } else if (s.ballX + s.ballR > 600) {
          s.ballX = 600 - s.ballR;
          s.ballVx *= -1;
        }

        // Top ceiling collision
        if (s.ballY - s.ballR < 0) {
          s.ballY = s.ballR;
          s.ballVy *= -1;
        }

        // Bottom border (lost life)
        if (s.ballY + s.ballR > 480) {
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('gameover');
            } else {
              s.ballX = s.paddleX + s.paddleW / 2;
              s.ballY = 420;
              s.ballVx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
              s.ballVy = -4.5;
            }
            return nextL;
          });
        }

        // Paddle bounce collision
        if (
          s.ballY + s.ballR >= 445 &&
          s.ballY - s.ballR <= 460 &&
          s.ballX >= s.paddleX &&
          s.ballX <= s.paddleX + s.paddleW
        ) {
          s.ballVy = -Math.abs(s.ballVy);
          // Angle deflection based on hit position
          const hitPos = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2);
          s.ballVx = hitPos * 5.5;
        }

        // Brick collision
        let remainingBricks = 0;
        for (const b of s.bricks) {
          if (!b.alive) continue;
          remainingBricks++;

          if (
            s.ballX + s.ballR >= b.x &&
            s.ballX - s.ballR <= b.x + b.w &&
            s.ballY + s.ballR >= b.y &&
            s.ballY - s.ballR <= b.y + b.h
          ) {
            b.hits--;
            if (b.hits <= 0) {
              b.alive = false;
              remainingBricks--;
            }
            s.ballVy *= -1;
            setScore((sc) => {
              const nsc = sc + 20;
              if (nsc > highScore) {
                setHighScore(nsc);
                try {
                  localStorage.setItem('gv_brick_breaker_hi', nsc.toString());
                } catch {}
              }
              return nsc;
            });
            break;
          }
        }

        if (remainingBricks === 0) {
          setGameState('victory');
        }
      }

      // Draw Bricks
      for (const b of s.bricks) {
        if (!b.alive) continue;
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.hits > 1 ? 12 : 5;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.restore();
      }

      // Draw Paddle
      ctx.save();
      ctx.fillStyle = '#8B5CF6';
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 10;
      ctx.fillRect(s.paddleX, 445, s.paddleW, 12);
      ctx.restore();

      // Draw Ball
      ctx.save();
      ctx.fillStyle = '#06B6D4';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, s.ballR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore]);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full max-w-[600px] flex items-center justify-between px-4 py-2.5 bg-black/60 border border-purple-500/20 rounded-t-xl text-xs text-white">
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-[10px]">VAULT SCORE</span>
          <span className="text-base font-bold text-cyan-400 font-mono">{score}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'text-rose-500 fill-rose-500' : 'text-white/20'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-bold">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Screen Canvas */}
      <div className="relative w-full max-w-[600px] aspect-[5/4] bg-black border-x border-purple-500/20 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={480}
          className="w-full h-full block cursor-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * 600;
            stateRef.current.paddleX = Math.max(10, Math.min(600 - stateRef.current.paddleW - 10, relX - stateRef.current.paddleW / 2));
          }}
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">BRICK BREAKER</h2>
            <p className="text-xs text-white/70 max-w-xs mb-6">
              Deflect plasma orbs, shatter security brick tiers, and clear the chamber.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-sm tracking-wide uppercase shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Game
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-rose-500 mb-2">VAULT BREACHED</h2>
            <div className="text-sm text-white/70 mb-4">Final Score: {score}</div>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-emerald-400 mb-2">CHAMBER CLEARED!</h2>
            <div className="text-sm text-white/70 mb-4">You shattered all security bricks! Final Score: {score}</div>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Bar */}
      <div className="w-full max-w-[600px] p-3 bg-black/60 border border-purple-500/20 rounded-b-xl flex items-center justify-between gap-3">
        <button
          onPointerDown={() => { stateRef.current.keys.left = true; }}
          onPointerUp={() => { stateRef.current.keys.left = false; }}
          className="flex-1 py-2.5 rounded-lg bg-white/10 active:bg-purple-600 text-white font-bold text-sm"
        >
          ← Slide Left
        </button>
        <button
          onPointerDown={() => { stateRef.current.keys.right = true; }}
          onPointerUp={() => { stateRef.current.keys.right = false; }}
          className="flex-1 py-2.5 rounded-lg bg-white/10 active:bg-purple-600 text-white font-bold text-sm"
        >
          Slide Right →
        </button>
      </div>
    </div>
  );
};
