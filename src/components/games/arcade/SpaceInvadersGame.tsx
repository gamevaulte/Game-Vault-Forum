import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Shield, Zap } from 'lucide-react';

export const SpaceInvadersGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gv_space_invaders_hi') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [muted, setMuted] = useState(false);

  // Game internal mutable state
  const stateRef = useRef<{
    playerX: number;
    playerSpeed: number;
    bullets: Array<{ x: number; y: number; vy: number }>;
    alienBullets: Array<{ x: number; y: number; vy: number }>;
    aliens: Array<{ x: number; y: number; type: number; alive: boolean; width: number; height: number }>;
    alienDir: number;
    alienStepTimer: number;
    alienStepInterval: number;
    bunkers: Array<{ x: number; y: number; hp: number }>;
    keys: { left: boolean; right: boolean; shoot: boolean };
    lastShootTime: number;
  }>({
    playerX: 300,
    playerSpeed: 5,
    bullets: [],
    alienBullets: [],
    aliens: [],
    alienDir: 1,
    alienStepTimer: 0,
    alienStepInterval: 45,
    bunkers: [],
    keys: { left: false, right: false, shoot: false },
    lastShootTime: 0
  });

  const initAliens = useCallback((waveNum: number) => {
    const aliens = [];
    const rows = 4;
    const cols = 8;
    const startX = 60;
    const startY = 60 + Math.min(waveNum * 10, 80);
    const spacingX = 55;
    const spacingY = 35;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          type: r, // 0 = boss, 1-2 = soldier, 3 = scout
          alive: true,
          width: 32,
          height: 24
        });
      }
    }
    return aliens;
  }, []);

  const initBunkers = useCallback(() => {
    const bunkers = [];
    const bunkerCount = 4;
    const spacing = 130;
    const startX = 80;
    const y = 390;

    for (let i = 0; i < bunkerCount; i++) {
      for (let bx = 0; bx < 3; bx++) {
        for (let by = 0; by < 2; by++) {
          bunkers.push({
            x: startX + i * spacing + bx * 12,
            y: y + by * 12,
            hp: 3
          });
        }
      }
    }
    return bunkers;
  }, []);

  const startGame = () => {
    const s = stateRef.current;
    s.playerX = 300;
    s.bullets = [];
    s.alienBullets = [];
    s.aliens = initAliens(1);
    s.bunkers = initBunkers();
    s.alienDir = 1;
    s.alienStepInterval = 45;
    setScore(0);
    setWave(1);
    setLives(3);
    setGameState('playing');
  };

  const nextWave = useCallback(() => {
    const s = stateRef.current;
    s.bullets = [];
    s.alienBullets = [];
    const nw = wave + 1;
    setWave(nw);
    s.aliens = initAliens(nw);
    s.alienStepInterval = Math.max(15, 45 - nw * 5);
    setGameState('playing');
  }, [wave, initAliens]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        s.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        s.keys.right = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        s.keys.shoot = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        s.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        s.keys.right = false;
      }
      if (e.code === 'Space') {
        s.keys.shoot = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Clear dark background
      ctx.fillStyle = '#06060A';
      ctx.fillRect(0, 0, 640, 480);

      // Starfield dots
      ctx.fillStyle = '#ffffff33';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97) % 640;
        const sy = (i * 71 + Date.now() * 0.02) % 480;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      if (gameState !== 'playing') {
        return;
      }

      // 1. Move Player
      if (s.keys.left) s.playerX = Math.max(30, s.playerX - s.playerSpeed);
      if (s.keys.right) s.playerX = Math.min(610, s.playerX + s.playerSpeed);

      // 2. Player shooting
      const now = Date.now();
      if (s.keys.shoot && now - s.lastShootTime > 280) {
        s.bullets.push({ x: s.playerX, y: 440, vy: -8 });
        s.lastShootTime = now;
      }

      // 3. Move bullets
      for (let i = s.bullets.length - 1; i >= 0; i--) {
        const b = s.bullets[i];
        b.y += b.vy;
        if (b.y < 10) {
          s.bullets.splice(i, 1);
        }
      }

      // 4. Move alien bullets
      for (let i = s.alienBullets.length - 1; i >= 0; i--) {
        const ab = s.alienBullets[i];
        ab.y += ab.vy;

        // Hit player check
        if (Math.abs(ab.x - s.playerX) < 18 && Math.abs(ab.y - 450) < 12) {
          s.alienBullets.splice(i, 1);
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('gameover');
            }
            return nextL;
          });
          continue;
        }

        // Hit bunkers
        let hitBunker = false;
        for (const bk of s.bunkers) {
          if (bk.hp > 0 && Math.abs(ab.x - (bk.x + 6)) < 8 && Math.abs(ab.y - (bk.y + 6)) < 8) {
            bk.hp--;
            hitBunker = true;
            break;
          }
        }
        if (hitBunker || ab.y > 480) {
          s.alienBullets.splice(i, 1);
        }
      }

      // 5. Bullet vs Bunkers
      for (let i = s.bullets.length - 1; i >= 0; i--) {
        const b = s.bullets[i];
        for (const bk of s.bunkers) {
          if (bk.hp > 0 && Math.abs(b.x - (bk.x + 6)) < 8 && Math.abs(b.y - (bk.y + 6)) < 8) {
            bk.hp--;
            s.bullets.splice(i, 1);
            break;
          }
        }
      }

      // 6. Bullet vs Aliens
      let aliveCount = 0;
      for (const alien of s.aliens) {
        if (!alien.alive) continue;
        aliveCount++;

        for (let bi = s.bullets.length - 1; bi >= 0; bi--) {
          const b = s.bullets[bi];
          if (
            b.x >= alien.x &&
            b.x <= alien.x + alien.width &&
            b.y >= alien.y &&
            b.y <= alien.y + alien.height
          ) {
            alien.alive = false;
            s.bullets.splice(bi, 1);
            const points = (4 - alien.type) * 25;
            setScore((sc) => {
              const nsc = sc + points;
              if (nsc > highScore) {
                setHighScore(nsc);
                try {
                  localStorage.setItem('gv_space_invaders_hi', nsc.toString());
                } catch {}
              }
              return nsc;
            });
            break;
          }
        }
      }

      if (aliveCount === 0) {
        nextWave();
        return;
      }

      // 7. Move Aliens
      s.alienStepTimer++;
      if (s.alienStepTimer >= s.alienStepInterval) {
        s.alienStepTimer = 0;
        let reachEdge = false;

        for (const a of s.aliens) {
          if (!a.alive) continue;
          if ((s.alienDir === 1 && a.x + a.width >= 610) || (s.alienDir === -1 && a.x <= 30)) {
            reachEdge = true;
            break;
          }
        }

        if (reachEdge) {
          s.alienDir *= -1;
          for (const a of s.aliens) {
            a.y += 18;
            // Breach check
            if (a.alive && a.y + a.height >= 430) {
              setGameState('gameover');
              return;
            }
          }
        } else {
          for (const a of s.aliens) {
            a.x += s.alienDir * 12;
          }
        }

        // Alien random shot
        const living = s.aliens.filter((a) => a.alive);
        if (living.length > 0 && Math.random() < 0.45) {
          const shooter = living[Math.floor(Math.random() * living.length)];
          s.alienBullets.push({
            x: shooter.x + shooter.width / 2,
            y: shooter.y + shooter.height,
            vy: 4 + Math.min(wave * 0.5, 3)
          });
        }
      }

      // ================= DRAWING =================
      // Draw Bunkers
      for (const bk of s.bunkers) {
        if (bk.hp <= 0) continue;
        ctx.fillStyle = bk.hp === 3 ? '#10B981' : bk.hp === 2 ? '#F59E0B' : '#EF4444';
        ctx.fillRect(bk.x, bk.y, 11, 11);
      }

      // Draw Aliens
      for (const a of s.aliens) {
        if (!a.alive) continue;
        const color = a.type === 0 ? '#EC4899' : a.type === 1 ? '#8B5CF6' : a.type === 2 ? '#3B82F6' : '#06B6D4';
        ctx.fillStyle = color;
        // Pixel alien body
        ctx.fillRect(a.x + 4, a.y + 4, a.width - 8, a.height - 8);
        ctx.fillRect(a.x + 8, a.y, a.width - 16, 4);
        ctx.fillRect(a.x + 2, a.y + a.height - 4, 6, 4);
        ctx.fillRect(a.x + a.width - 8, a.y + a.height - 4, 6, 4);
        // Eyes
        ctx.fillStyle = '#06060A';
        ctx.fillRect(a.x + 8, a.y + 8, 4, 4);
        ctx.fillRect(a.x + a.width - 12, a.y + 8, 4, 4);
      }

      // Draw Player Bullets
      ctx.fillStyle = '#06B6D4';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 6;
      for (const b of s.bullets) {
        ctx.fillRect(b.x - 2, b.y, 4, 12);
      }

      // Draw Alien Bullets
      ctx.fillStyle = '#F43F5E';
      ctx.shadowColor = '#F43F5E';
      ctx.shadowBlur = 6;
      for (const ab of s.alienBullets) {
        ctx.fillRect(ab.x - 1.5, ab.y, 3, 10);
      }
      ctx.shadowBlur = 0;

      // Draw Player Cannon
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(s.playerX - 16, 450, 32, 12);
      ctx.fillRect(s.playerX - 6, 440, 12, 10);
      ctx.fillStyle = '#C084FC';
      ctx.fillRect(s.playerX - 2, 436, 4, 4);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, wave, highScore, nextWave]);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top HUD Bar */}
      <div className="w-full max-w-[640px] flex items-center justify-between px-4 py-2.5 bg-black/60 border border-purple-500/20 rounded-t-xl text-xs text-white">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-white/50 block text-[10px]">SCORE</span>
            <span className="text-base font-bold text-cyan-300 font-mono">{score.toString().padStart(5, '0')}</span>
          </div>
          <div>
            <span className="text-white/50 block text-[10px]">WAVE</span>
            <span className="text-base font-bold text-purple-400 font-mono">{wave}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 text-[10px] mr-1">SHIELDS</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <Shield
                key={i}
                className={`w-4 h-4 ${i < lives ? 'text-purple-400 fill-purple-400' : 'text-white/20'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span className="font-bold">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative w-full max-w-[640px] aspect-[4/3] bg-black border-x border-purple-500/20 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full block"
        />

        {/* Overlay for Idle / Start Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-600/30">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
              SPACE INVADERS
            </h2>
            <p className="text-sm text-white/70 max-w-sm mb-6 leading-relaxed">
              Defend Earth from relentless alien waves. Shoot down invader fleets, use bunkers for shelter, and rack up high scores.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch Mission
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-3xl font-black text-rose-500 mb-1">MISSION FAILED</h2>
            <p className="text-sm text-white/70 mb-4">Alien forces breached planetary defenses.</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 min-w-[200px]">
              <div className="text-xs text-white/50 mb-1">FINAL SCORE</div>
              <div className="text-2xl font-bold font-mono text-cyan-300">{score}</div>
              {score >= highScore && score > 0 && (
                <div className="text-xs text-amber-400 font-semibold mt-1">★ New Personal Best!</div>
              )}
            </div>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Touch / Mobile Controls Bar */}
      <div className="w-full max-w-[640px] flex items-center justify-between p-3 bg-black/60 border border-purple-500/20 rounded-b-xl gap-2">
        <div className="flex gap-2">
          <button
            onPointerDown={() => { stateRef.current.keys.left = true; }}
            onPointerUp={() => { stateRef.current.keys.left = false; }}
            onPointerLeave={() => { stateRef.current.keys.left = false; }}
            className="w-12 h-11 rounded-lg bg-white/10 active:bg-purple-600 flex items-center justify-center text-white font-bold text-sm transition"
          >
            ←
          </button>
          <button
            onPointerDown={() => { stateRef.current.keys.right = true; }}
            onPointerUp={() => { stateRef.current.keys.right = false; }}
            onPointerLeave={() => { stateRef.current.keys.right = false; }}
            className="w-12 h-11 rounded-lg bg-white/10 active:bg-purple-600 flex items-center justify-center text-white font-bold text-sm transition"
          >
            →
          </button>
        </div>

        <button
          onPointerDown={() => { stateRef.current.keys.shoot = true; }}
          onPointerUp={() => { stateRef.current.keys.shoot = false; }}
          onPointerLeave={() => { stateRef.current.keys.shoot = false; }}
          className="flex-1 max-w-[200px] h-11 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 active:opacity-80 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider shadow-md transition"
        >
          Fire Laser (Space)
        </button>

        <button
          onClick={startGame}
          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
