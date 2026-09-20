import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Shield, Coins, Zap } from 'lucide-react';

interface Tower {
  x: number;
  y: number;
  type: 'laser' | 'plasma' | 'tesla';
  range: number;
  damage: number;
  fireRate: number;
  lastFired: number;
}

interface Enemy {
  x: number;
  y: number;
  pathIndex: number;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  alive: boolean;
}

export const TowerDefenseGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gold, setGold] = useState(150);
  const [lives, setLives] = useState(20);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [selectedTowerType, setSelectedTowerType] = useState<'laser' | 'plasma'>('laser');

  // Defined waypoint path for enemies
  const path = [
    { x: 0, y: 120 },
    { x: 180, y: 120 },
    { x: 180, y: 300 },
    { x: 380, y: 300 },
    { x: 380, y: 150 },
    { x: 600, y: 150 }
  ];

  const stateRef = useRef<{
    towers: Tower[];
    enemies: Enemy[];
    projectiles: Array<{ x: number; y: number; tx: number; ty: number; color: string; life: number }>;
    spawnTimer: number;
    enemiesSpawned: number;
    waveEnemyCount: number;
  }>({
    towers: [],
    enemies: [],
    projectiles: [],
    spawnTimer: 0,
    enemiesSpawned: 0,
    waveEnemyCount: 10
  });

  const startWave = useCallback((w: number) => {
    const s = stateRef.current;
    s.enemies = [];
    s.spawnTimer = 0;
    s.enemiesSpawned = 0;
    s.waveEnemyCount = 8 + w * 3;
    setGameState('playing');
  }, []);

  const startGame = () => {
    stateRef.current.towers = [
      { x: 120, y: 70, type: 'laser', range: 110, damage: 14, fireRate: 400, lastFired: 0 }
    ];
    setGold(140);
    setLives(20);
    setWave(1);
    startWave(1);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 600;
    const clickY = ((e.clientY - rect.top) / rect.height) * 400;

    const cost = selectedTowerType === 'laser' ? 60 : 100;
    if (gold < cost) return;

    // Check not on road
    // Disallow placing towers directly over path segments
    let onRoad = false;
    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const minX = Math.min(p1.x, p2.x) - 25;
      const maxX = Math.max(p1.x, p2.x) + 25;
      const minY = Math.min(p1.y, p2.y) - 25;
      const maxY = Math.max(p1.y, p2.y) + 25;
      if (clickX >= minX && clickX <= maxX && clickY >= minY && clickY <= maxY) {
        onRoad = true;
        break;
      }
    }
    if (onRoad) return;

    // Check distance to other towers
    const tooClose = stateRef.current.towers.some(
      (t) => Math.hypot(t.x - clickX, t.y - clickY) < 32
    );
    if (tooClose) return;

    // Build tower
    const newTower: Tower = {
      x: clickX,
      y: clickY,
      type: selectedTowerType,
      range: selectedTowerType === 'laser' ? 120 : 160,
      damage: selectedTowerType === 'laser' ? 16 : 38,
      fireRate: selectedTowerType === 'laser' ? 380 : 850,
      lastFired: 0
    };

    stateRef.current.towers.push(newTower);
    setGold((g) => g - cost);
  };

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (timestamp: number) => {
      animId = requestAnimationFrame(loop);
      const s = stateRef.current;

      // Dark sci-fi terrain
      ctx.fillStyle = '#080811';
      ctx.fillRect(0, 0, 600, 400);

      // Draw Pathway
      ctx.strokeStyle = '#1E1B4B';
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();

      // Pathway center neon guide
      ctx.strokeStyle = '#6366F133';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (gameState === 'playing') {
        // 1. Spawning
        s.spawnTimer++;
        if (s.spawnTimer > 60 && s.enemiesSpawned < s.waveEnemyCount) {
          s.spawnTimer = 0;
          s.enemiesSpawned++;
          s.enemies.push({
            x: path[0].x,
            y: path[0].y,
            pathIndex: 0,
            hp: 40 + wave * 25,
            maxHp: 40 + wave * 25,
            speed: 1.2 + Math.min(wave * 0.1, 1),
            reward: 15,
            alive: true
          });
        }

        // 2. Move Enemies
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i];
          if (!e.alive) continue;

          const target = path[e.pathIndex + 1];
          if (!target) {
            // Reached base!
            e.alive = false;
            setLives((l) => {
              const nl = l - 1;
              if (nl <= 0) setGameState('gameover');
              return nl;
            });
            continue;
          }

          const dx = target.x - e.x;
          const dy = target.y - e.y;
          const dist = Math.hypot(dx, dy);

          if (dist < e.speed) {
            e.x = target.x;
            e.y = target.y;
            e.pathIndex++;
          } else {
            e.x += (dx / dist) * e.speed;
            e.y += (dy / dist) * e.speed;
          }
        }

        // 3. Towers Fire
        s.towers.forEach((tower) => {
          if (timestamp - tower.lastFired < tower.fireRate) return;

          // Find first enemy in range
          const target = s.enemies.find(
            (e) => e.alive && Math.hypot(e.x - tower.x, e.y - tower.y) <= tower.range
          );

          if (target) {
            tower.lastFired = timestamp;
            target.hp -= tower.damage;
            s.projectiles.push({
              x: tower.x,
              y: tower.y,
              tx: target.x,
              ty: target.y,
              color: tower.type === 'laser' ? '#06B6D4' : '#EC4899',
              life: 5
            });

            if (target.hp <= 0) {
              target.alive = false;
              setGold((g) => g + target.reward);
            }
          }
        });

        // 4. Clean dead enemies
        s.enemies = s.enemies.filter((e) => e.alive);

        // Check wave complete
        if (s.enemiesSpawned >= s.waveEnemyCount && s.enemies.length === 0) {
          if (wave >= 5) {
            setGameState('victory');
          } else {
            setWave((w) => {
              const nw = w + 1;
              startWave(nw);
              return nw;
            });
            setGold((g) => g + 40); // Wave clear bonus
          }
        }
      }

      // Draw Towers
      s.towers.forEach((t) => {
        ctx.save();
        ctx.fillStyle = t.type === 'laser' ? '#06B6D4' : '#EC4899';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#06060D';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Enemies
      s.enemies.forEach((e) => {
        if (!e.alive) return;
        ctx.save();
        ctx.fillStyle = '#F43F5E';
        ctx.shadowColor = '#F43F5E';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 9, 0, Math.PI * 2);
        ctx.fill();
        // HP Bar
        const hpPct = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#000000';
        ctx.fillRect(e.x - 12, e.y - 15, 24, 4);
        ctx.fillStyle = '#10B981';
        ctx.fillRect(e.x - 12, e.y - 15, 24 * hpPct, 4);
        ctx.restore();
      });

      // Draw Projectile Beams
      for (let i = s.projectiles.length - 1; i >= 0; i--) {
        const p = s.projectiles[i];
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.tx, p.ty);
        ctx.stroke();
        p.life--;
        if (p.life <= 0) s.projectiles.splice(i, 1);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, wave, startWave]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[600px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
            <Coins className="w-4 h-4" />
            <span>{gold} Gold</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold">
            <Shield className="w-4 h-4" />
            <span>{lives} HP</span>
          </div>
          <div className="text-purple-300 font-mono">Wave {wave} / 5</div>
        </div>

        <button
          onClick={startGame}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Battlefield Screen */}
      <div className="relative w-full aspect-[3/2] bg-black border-x border-purple-500/20 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-full block cursor-crosshair"
          onClick={handleCanvasClick}
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-white mb-2">NEO DEFENSE MATRIX</h2>
            <p className="text-xs text-white/70 max-w-xs mb-6">
              Construct laser turrets and heavy plasma batteries along the approach vector to vaporize cyber intruders.
            </p>
            <button
              onClick={startGame}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-sm tracking-wide uppercase shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Deploy Defenses
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-rose-500 mb-2">PERIMETER BREACHED</h2>
            <p className="text-xs text-white/70 mb-4">You held out until Wave {wave}.</p>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              Try Again
            </button>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-emerald-400 mb-2">CORE SECURED!</h2>
            <p className="text-xs text-white/70 mb-4">All 5 hostile waves successfully neutralized.</p>
            <button
              onClick={startGame}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Tower Selector Bar */}
      <div className="w-full p-3 bg-black/70 border border-purple-500/20 rounded-b-xl flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTowerType('laser')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              selectedTowerType === 'laser'
                ? 'bg-cyan-600/30 border border-cyan-400 text-cyan-300'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pulse Laser (60g)</span>
          </button>
          <button
            onClick={() => setSelectedTowerType('plasma')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              selectedTowerType === 'plasma'
                ? 'bg-pink-600/30 border border-pink-400 text-pink-300'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-pink-400" />
            <span>Heavy Plasma (100g)</span>
          </button>
        </div>

        <span className="text-[11px] text-white/40 hidden sm:inline">Click ground to place</span>
      </div>
    </div>
  );
};
