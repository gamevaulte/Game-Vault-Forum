import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Sparkles, Pause } from 'lucide-react';

export const NeonSnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gv_neon_snake_hi') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');

  // Internal game engine state
  const stateRef = useRef<{
    snake: Array<{ x: number; y: number }>;
    dir: { x: number; y: number };
    nextDir: { x: number; y: number };
    food: { x: number; y: number };
    gridSize: number;
    tileCount: number;
    speedMs: number;
    lastTick: number;
  }>({
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    gridSize: 20,
    tileCount: 24, // 480x480 canvas
    speedMs: 110,
    lastTick: 0
  });

  const spawnFood = useCallback((snake: Array<{ x: number; y: number }>) => {
    let newFood: { x: number; y: number };
    let onSnake = true;
    while (onSnake) {
      newFood = {
        x: Math.floor(Math.random() * 24),
        y: Math.floor(Math.random() * 24)
      };
      onSnake = snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) return newFood;
    }
    return { x: 15, y: 10 };
  }, []);

  const startGame = () => {
    const s = stateRef.current;
    s.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.food = spawnFood(s.snake);
    s.speedMs = 110;
    setScore(0);
    setGameState('playing');
  };

  const changeDirection = (dx: number, dy: number) => {
    const s = stateRef.current;
    // Disallow 180-degree immediate reversal
    if (dx !== 0 && s.dir.x !== 0) return;
    if (dy !== 0 && s.dir.y !== 0) return;
    s.nextDir = { x: dx, y: dy };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        changeDirection(0, -1);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        changeDirection(0, 1);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        changeDirection(-1, 0);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        changeDirection(1, 0);
      } else if (e.code === 'Space') {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main animation frame loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (timestamp: number) => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Dark cyber canvas background
      ctx.fillStyle = '#07070D';
      ctx.fillRect(0, 0, 480, 480);

      // Subtle grid lines
      ctx.strokeStyle = '#1E1B4B22';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 24; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 20, 0);
        ctx.lineTo(i * 20, 480);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(480, i * 20);
        ctx.stroke();
      }

      if (gameState === 'playing') {
        if (timestamp - s.lastTick > s.speedMs) {
          s.lastTick = timestamp;
          s.dir = { ...s.nextDir };

          const head = {
            x: s.snake[0].x + s.dir.x,
            y: s.snake[0].y + s.dir.y
          };

          // Border collision
          if (head.x < 0 || head.x >= 24 || head.y < 0 || head.y >= 24) {
            setGameState('gameover');
            return;
          }

          // Self-collision
          if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
            setGameState('gameover');
            return;
          }

          s.snake.unshift(head);

          // Food check
          if (head.x === s.food.x && head.y === s.food.y) {
            const nextScore = score + 10;
            setScore(nextScore);
            if (nextScore > highScore) {
              setHighScore(nextScore);
              try {
                localStorage.setItem('gv_neon_snake_hi', nextScore.toString());
              } catch {}
            }
            s.food = spawnFood(s.snake);
            s.speedMs = Math.max(65, 110 - Math.floor(nextScore / 50) * 5);
          } else {
            s.snake.pop();
          }
        }
      }

      // Draw glowing food node
      ctx.save();
      ctx.shadowColor = '#EC4899';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.arc(s.food.x * 20 + 10, s.food.y * 20 + 10, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Snake body
      s.snake.forEach((seg, idx) => {
        const isHead = idx === 0;
        ctx.save();
        if (isHead) {
          ctx.fillStyle = '#A855F7';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = '#6366F1';
          ctx.shadowColor = '#6366F1';
          ctx.shadowBlur = 6;
        }
        ctx.fillRect(seg.x * 20 + 2, seg.y * 20 + 2, 16, 16);
        ctx.restore();
      });
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, highScore, spawnFood]);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full max-w-[480px] flex items-center justify-between px-4 py-2.5 bg-black/60 border border-purple-500/20 rounded-t-xl text-xs text-white">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[10px]">ENERGY CONSUMED</span>
          <span className="text-lg font-bold text-pink-400 font-mono">{score}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-mono">
          <Trophy className="w-4 h-4" />
          <span className="font-bold">{highScore}</span>
        </div>
      </div>

      {/* Screen Canvas */}
      <div className="relative w-full max-w-[480px] aspect-square bg-black border-x border-purple-500/20 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={480}
          height={480}
          className="w-full h-full block"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">NEON SNAKE</h2>
            <p className="text-xs text-white/70 max-w-xs mb-6">
              Maneuver the cyber viper through the grid. Absorb glowing energy nodes, accelerate speed, and avoid wall impact.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 font-bold text-sm tracking-wide uppercase shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Engage Grid
            </button>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h3 className="text-xl font-bold mb-4">SYSTEM PAUSED</h3>
            <button
              onClick={() => setGameState('playing')}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition"
            >
              Resume Game
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-rose-500 mb-1">GRID COLLISION</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-4 min-w-[180px]">
              <div className="text-[10px] text-white/50 mb-1">SCORE</div>
              <div className="text-2xl font-bold font-mono text-pink-400">{score}</div>
            </div>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Direction Pad for Mobile & Casual Controls */}
      <div className="w-full max-w-[480px] p-3 bg-black/60 border border-purple-500/20 rounded-b-xl flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => changeDirection(0, -1)}
            className="w-12 h-10 rounded-lg bg-white/10 active:bg-purple-600 text-white font-bold text-sm"
          >
            ↑
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeDirection(-1, 0)}
            className="w-12 h-10 rounded-lg bg-white/10 active:bg-purple-600 text-white font-bold text-sm"
          >
            ←
          </button>
          <button
            onClick={() => changeDirection(0, 1)}
            className="w-12 h-10 rounded-lg bg-white/10 active:bg-purple-600 text-white font-bold text-sm"
          >
            ↓
          </button>
          <button
            onClick={() => changeDirection(1, 0)}
            className="w-12 h-10 rounded-lg bg-white/10 active:bg-purple-600 text-white font-bold text-sm"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
