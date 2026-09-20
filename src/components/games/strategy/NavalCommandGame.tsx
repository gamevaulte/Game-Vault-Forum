import React, { useState } from 'react';
import { RotateCcw, Crosshair, ShieldAlert, Award } from 'lucide-react';

interface CellState {
  hasShip: boolean;
  hit: boolean;
}

export const NavalCommandGame: React.FC = () => {
  const [playerGrid, setPlayerGrid] = useState<CellState[][]>(() => createInitialGrid(true));
  const [enemyGrid, setEnemyGrid] = useState<CellState[][]>(() => createInitialGrid(false));
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [playerHits, setPlayerHits] = useState(0);
  const [enemyHits, setEnemyHits] = useState(0);
  const [totalShipSegments] = useState(10); // 3 ships: lengths 4, 3, 3
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

  function createInitialGrid(isPlayer: boolean): CellState[][] {
    const grid: CellState[][] = Array(7)
      .fill(null)
      .map(() => Array(7).fill(null).map(() => ({ hasShip: false, hit: false })));

    // Place 3 ships: Carrier (4), Cruiser (3), Destroyer (3)
    const shipLengths = [4, 3, 3];
    shipLengths.forEach((len) => {
      let placed = false;
      let tries = 0;
      while (!placed && tries < 100) {
        tries++;
        const horiz = Math.random() > 0.5;
        const r = Math.floor(Math.random() * (horiz ? 7 : 7 - len));
        const c = Math.floor(Math.random() * (horiz ? 7 - len : 7));

        // Check clear
        let clear = true;
        for (let i = 0; i < len; i++) {
          const checkR = horiz ? r : r + i;
          const checkC = horiz ? c + i : c;
          if (grid[checkR][checkC].hasShip) {
            clear = false;
            break;
          }
        }

        if (clear) {
          for (let i = 0; i < len; i++) {
            const placeR = horiz ? r : r + i;
            const placeC = horiz ? c + i : c;
            grid[placeR][placeC].hasShip = true;
          }
          placed = true;
        }
      }
    });

    return grid;
  }

  const fireAtEnemy = (r: number, c: number) => {
    if (turn !== 'player' || gameState !== 'playing') return;
    if (enemyGrid[r][c].hit) return; // already targeted

    const nextEnemy = enemyGrid.map((row) => row.map((cell) => ({ ...cell })));
    nextEnemy[r][c].hit = true;
    setEnemyGrid(nextEnemy);

    let nextHits = playerHits;
    if (nextEnemy[r][c].hasShip) {
      nextHits = playerHits + 1;
      setPlayerHits(nextHits);
      if (nextHits >= totalShipSegments) {
        setGameState('won');
        return;
      }
    }

    // AI Turn after small delay
    setTurn('enemy');
    setTimeout(() => makeEnemyMove(), 500);
  };

  const makeEnemyMove = () => {
    const nextPlayer = playerGrid.map((row) => row.map((cell) => ({ ...cell })));
    const unhitCells: [number, number][] = [];

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (!nextPlayer[r][c].hit) unhitCells.push([r, c]);
      }
    }

    if (unhitCells.length === 0) return;

    // Pick random unhit cell
    const [er, ec] = unhitCells[Math.floor(Math.random() * unhitCells.length)];
    nextPlayer[er][ec].hit = true;
    setPlayerGrid(nextPlayer);

    if (nextPlayer[er][ec].hasShip) {
      const nextEnemyHits = enemyHits + 1;
      setEnemyHits(nextEnemyHits);
      if (nextEnemyHits >= totalShipSegments) {
        setGameState('lost');
        return;
      }
    }

    setTurn('player');
  };

  const restartNaval = () => {
    setPlayerGrid(createInitialGrid(true));
    setEnemyGrid(createInitialGrid(false));
    setTurn('player');
    setPlayerHits(0);
    setEnemyHits(0);
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[620px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-white/40 text-[10px] block">TACTICAL STATUS</span>
            <span className="font-bold text-cyan-400">
              {turn === 'player' ? 'Targeting System Ready' : 'Hostile Salvo Incoming...'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-white/60 font-mono">
            Hostile Ships Sunk: <span className="text-pink-400 font-bold">{playerHits}/{totalShipSegments}</span>
          </div>
          <button
            onClick={restartNaval}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redeploy</span>
          </button>
        </div>
      </div>

      {/* Duel Grids (Enemy Radar & Player Fleet) */}
      <div className="relative w-full p-4 bg-[#0A0A14] border-x border-b border-purple-500/20 rounded-b-xl flex flex-col md:flex-row gap-6 items-center justify-around shadow-2xl">
        {/* Enemy Radar (Primary clickable target) */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 mb-2">
            <Crosshair className="w-4 h-4" />
            <span>HOSTILE SECTOR (CLICK TO STRIKE)</span>
          </div>
          <div className="grid grid-cols-7 gap-1 bg-black/60 p-2 rounded-xl border border-pink-500/20">
            {enemyGrid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`enemy-${r}-${c}`}
                  onClick={() => fireAtEnemy(r, c)}
                  disabled={cell.hit || turn !== 'player' || gameState !== 'playing'}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center font-bold text-xs transition ${
                    cell.hit
                      ? cell.hasShip
                        ? 'bg-rose-600 border border-rose-400 text-white shadow-md shadow-rose-600/40 animate-pulse'
                        : 'bg-white/10 text-white/30'
                      : 'bg-white/5 hover:bg-pink-600/30 border border-white/10 active:scale-95'
                  }`}
                >
                  {cell.hit ? (cell.hasShip ? '🔥' : '•') : ''}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Player Fleet (Status view) */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>YOUR FLEET RADAR</span>
          </div>
          <div className="grid grid-cols-7 gap-1 bg-black/60 p-2 rounded-xl border border-cyan-500/20">
            {playerGrid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`player-${r}-${c}`}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center font-bold text-xs ${
                    cell.hit
                      ? cell.hasShip
                        ? 'bg-rose-900 border border-rose-500 text-rose-300'
                        : 'bg-white/10 text-white/30'
                      : cell.hasShip
                      ? 'bg-cyan-600/40 border border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border border-white/5'
                  }`}
                >
                  {cell.hit ? (cell.hasShip ? '💥' : '•') : cell.hasShip ? '■' : ''}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Victory / Defeat Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Award className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-emerald-400 mb-1">HOSTILE FLEET DESTROYED!</h2>
            <p className="text-xs text-white/70 mb-4">You sank all enemy warships.</p>
            <button
              onClick={restartNaval}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
            >
              Play Again
            </button>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-2xl font-black text-rose-500 mb-1">ALL SHIPS SUNK</h2>
            <p className="text-xs text-white/70 mb-4">Enemy missiles breached your flagship.</p>
            <button
              onClick={restartNaval}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
