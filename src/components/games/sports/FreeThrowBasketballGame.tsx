import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw, Trophy, Flame } from 'lucide-react';

export const FreeThrowBasketballGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gv_freethrow_hi') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [power, setPower] = useState(50);
  const [isCharging, setIsCharging] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'ready' | 'shooting' | 'scored' | 'missed'>('idle');

  const stateRef = useRef<{
    ballX: number;
    ballY: number;
    vx: number;
    vy: number;
    power: number;
    angle: number;
    gravity: number;
    chargingDir: number;
  }>({
    ballX: 120,
    ballY: 340,
    vx: 0,
    vy: 0,
    power: 50,
    angle: -58, // degrees
    gravity: 0.28,
    chargingDir: 1
  });

  const resetBall = () => {
    const s = stateRef.current;
    s.ballX = 120;
    s.ballY = 340;
    s.vx = 0;
    s.vy = 0;
    setGameState('ready');
  };

  const startShoot = () => {
    setIsCharging(true);
  };

  const releaseShoot = () => {
    if (!isCharging) return;
    setIsCharging(false);
    setGameState('shooting');

    const s = stateRef.current;
    const rad = (s.angle * Math.PI) / 180;
    const totalSpeed = (s.power / 100) * 14 + 4;
    s.vx = Math.cos(rad) * totalSpeed;
    s.vy = Math.sin(rad) * totalSpeed;
  };

  useEffect(() => {
    let interval: any;
    if (isCharging) {
      interval = setInterval(() => {
        setPower((p) => {
          let next = p + stateRef.current.chargingDir * 3;
          if (next >= 100) {
            next = 100;
            stateRef.current.chargingDir = -1;
          } else if (next <= 20) {
            next = 20;
            stateRef.current.chargingDir = 1;
          }
          stateRef.current.power = next;
          return next;
        });
      }, 20);
    }
    return () => clearInterval(interval);
  }, [isCharging]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Dark court background
      ctx.fillStyle = '#0B0B14';
      ctx.fillRect(0, 0, 600, 400);

      // Floor hardwood line
      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(0, 360, 600, 40);
      ctx.fillStyle = '#8B5CF633';
      ctx.fillRect(0, 358, 600, 2);

      // Hoop Backboard (Right: x = 500, y = 140 to 220)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(505, 140, 6, 90);

      // Rim (x = 455 to 505, y = 205)
      ctx.fillStyle = '#F97316';
      ctx.fillRect(455, 203, 50, 4);

      // Net lines
      ctx.strokeStyle = '#FFFFFF88';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(458, 207);
      ctx.lineTo(468, 235);
      ctx.lineTo(495, 235);
      ctx.lineTo(502, 207);
      ctx.stroke();

      if (gameState === 'shooting') {
        s.ballX += s.vx;
        s.ballY += s.vy;
        s.vy += s.gravity;

        // Rim collisions
        // Front rim: (455, 203)
        const distFront = Math.hypot(s.ballX - 455, s.ballY - 203);
        if (distFront < 14) {
          s.vx = -s.vx * 0.5;
          s.vy = -s.vy * 0.6;
        }

        // Backboard bounce
        if (s.ballX >= 495 && s.ballX <= 515 && s.ballY >= 140 && s.ballY <= 230) {
          s.vx = -Math.abs(s.vx) * 0.65;
        }

        // Swish / Bucket detection: passes through rim box (460 to 495, y around 205-225 moving down)
        if (s.ballX >= 460 && s.ballX <= 495 && s.ballY >= 200 && s.ballY <= 225 && s.vy > 0) {
          setGameState('scored');
          setScore((sc) => {
            const nsc = sc + 1;
            if (nsc > highScore) {
              setHighScore(nsc);
              try {
                localStorage.setItem('gv_freethrow_hi', nsc.toString());
              } catch {}
            }
            return nsc;
          });
          setStreak((st) => st + 1);
          setTimeout(resetBall, 900);
        }

        // Ground collision
        if (s.ballY > 350) {
          s.ballY = 350;
          s.vy = -s.vy * 0.5;
          if (Math.abs(s.vy) < 1) {
            if (gameState === 'shooting') {
              setGameState('missed');
              setStreak(0);
              setTimeout(resetBall, 900);
            }
          }
        }

        // Offscreen right/left
        if (s.ballX > 620 || s.ballX < -20) {
          if (gameState === 'shooting') {
            setGameState('missed');
            setStreak(0);
            setTimeout(resetBall, 900);
          }
        }
      }

      // Draw Basketball
      ctx.save();
      ctx.fillStyle = '#EA580C';
      ctx.shadowColor = '#EA580C';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 12, 0, Math.PI * 2);
      ctx.fill();
      // Seams
      ctx.strokeStyle = '#00000055';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, 12, 0.4, 3.5);
      ctx.stroke();
      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[600px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-white/50 text-[10px] block">BASKETS MADE</span>
            <span className="text-xl font-bold font-mono text-orange-400">{score}</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak} Streak!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-400 font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-bold">{highScore} High</span>
          </div>
          <button
            onClick={() => {
              setScore(0);
              setStreak(0);
              resetBall();
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Court Screen */}
      <div className="relative w-full aspect-[3/2] bg-black border-x border-purple-500/20 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={600} height={400} className="w-full h-full block" />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-white mb-2">FREE THROW CHALLENGE</h2>
            <p className="text-xs text-white/70 max-w-xs mb-6">
              Press and hold the shoot button to charge your power meter into the sweet spot, then release to sink the jumper.
            </p>
            <button
              onClick={resetBall}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 font-bold text-sm tracking-wide uppercase shadow-lg shadow-orange-600/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Step to the Line
            </button>
          </div>
        )}

        {gameState === 'scored' && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-emerald-600/90 text-white font-black text-sm tracking-wider shadow-lg animate-bounce">
            SWISH! +1 POINT
          </div>
        )}

        {gameState === 'missed' && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-rose-600/90 text-white font-bold text-xs tracking-wider shadow-lg">
            OFF THE RIM!
          </div>
        )}
      </div>

      {/* Power Gauge and Shoot Button */}
      <div className="w-full p-4 bg-black/70 border border-purple-500/20 rounded-b-xl space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-white/70">
            <span>SHOT POWER METER</span>
            <span className="font-mono text-orange-400 font-bold">{power}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                power >= 65 && power <= 85
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : 'bg-gradient-to-r from-orange-500 to-rose-500'
              }`}
              style={{ width: `${power}%` }}
            />
          </div>
        </div>

        <button
          disabled={gameState === 'shooting' || gameState === 'scored'}
          onPointerDown={startShoot}
          onPointerUp={releaseShoot}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 active:opacity-90 disabled:opacity-40 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-orange-600/30 transition"
        >
          {isCharging ? 'RELEASE TO SHOOT!' : 'HOLD TO CHARGE SHOT'}
        </button>
      </div>
    </div>
  );
};
