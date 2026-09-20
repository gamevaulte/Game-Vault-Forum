import React, { useState, useEffect } from 'react';
import { Flag, RotateCcw, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  revealed: boolean;
  flagged: boolean;
  neighborMines: number;
}

export const MinesweeperGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [flagMode, setFlagMode] = useState(false);
  const [flagsRemaining, setFlagsRemaining] = useState(10);

  const getDifficultyConfig = (diff: 'easy' | 'medium' | 'hard') => {
    switch (diff) {
      case 'medium':
        return { rows: 12, cols: 12, mines: 20 };
      case 'hard':
        return { rows: 14, cols: 14, mines: 35 };
      case 'easy':
      default:
        return { rows: 9, cols: 9, mines: 10 };
    }
  };

  const initGrid = (firstClickR?: number, firstClickC?: number) => {
    const { rows, cols, mines } = getDifficultyConfig(difficulty);
    const newGrid: Cell[][] = [];

    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          revealed: false,
          flagged: false,
          neighborMines: 0
        });
      }
      newGrid.push(row);
    }

    // Place mines avoiding first click
    let placed = 0;
    while (placed < mines) {
      const mr = Math.floor(Math.random() * rows);
      const mc = Math.floor(Math.random() * cols);

      if (
        !newGrid[mr][mc].isMine &&
        !(firstClickR !== undefined && Math.abs(mr - firstClickR) <= 1 && Math.abs(mc - firstClickC) <= 1)
      ) {
        newGrid[mr][mc].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setFlagsRemaining(mines);
    return newGrid;
  };

  useEffect(() => {
    setGrid(initGrid());
    setTimer(0);
    setGameState('ready');
    setGameActive(false);
  }, [difficulty]);

  useEffect(() => {
    let interval: any;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const revealCell = (r: number, c: number) => {
    if (gameState === 'lost' || gameState === 'won') return;

    let currentGrid = grid;
    if (gameState === 'ready') {
      currentGrid = initGrid(r, c);
      setGameState('playing');
      setGameActive(true);
    }

    const cell = currentGrid[r][c];
    if (cell.flagged || cell.revealed) return;

    const next = currentGrid.map((row) => row.map((cl) => ({ ...cl })));

    if (next[r][c].isMine) {
      // Hit mine -> Game Over
      for (let ro = 0; ro < next.length; ro++) {
        for (let co = 0; co < next[0].length; co++) {
          if (next[ro][co].isMine) next[ro][co].revealed = true;
        }
      }
      setGrid(next);
      setGameState('lost');
      return;
    }

    // Flood fill empty neighbors
    const queue: [number, number][] = [[r, c]];
    next[r][c].revealed = true;

    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      if (next[cr][cc].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (
              nr >= 0 &&
              nr < next.length &&
              nc >= 0 &&
              nc < next[0].length &&
              !next[nr][nc].revealed &&
              !next[nr][nc].flagged
            ) {
              next[nr][nc].revealed = true;
              if (next[nr][nc].neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    // Check victory
    let won = true;
    for (let ro = 0; ro < next.length; ro++) {
      for (let co = 0; co < next[0].length; co++) {
        if (!next[ro][co].isMine && !next[ro][co].revealed) {
          won = false;
          break;
        }
      }
    }

    setGrid(next);
    if (won) {
      setGameState('won');
    }
  };

  const toggleFlag = (e: React.MouseEvent | null, r: number, c: number) => {
    if (e) e.preventDefault();
    if (gameState === 'lost' || gameState === 'won') return;

    setGrid((prev) => {
      const next = prev.map((row) => row.map((cl) => ({ ...cl })));
      const cell = next[r][c];
      if (cell.revealed) return prev;

      if (cell.flagged) {
        cell.flagged = false;
        setFlagsRemaining((f) => f + 1);
      } else if (flagsRemaining > 0) {
        cell.flagged = true;
        setFlagsRemaining((f) => f - 1);
      }
      return next;
    });
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1:
        return 'text-blue-400 font-bold';
      case 2:
        return 'text-emerald-400 font-bold';
      case 3:
        return 'text-rose-400 font-bold';
      case 4:
        return 'text-purple-400 font-bold';
      case 5:
        return 'text-amber-400 font-bold';
      default:
        return 'text-cyan-400 font-bold';
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-lg mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDifficulty('easy')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              difficulty === 'easy' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Recruit
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              difficulty === 'medium' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Operative
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className={`px-2.5 py-1 rounded-lg transition font-medium ${
              difficulty === 'hard' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            Veteran
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-rose-400 font-bold">
            <Flag className="w-3.5 h-3.5" />
            <span>{flagsRemaining}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{timer}s</span>
          </div>
          <button
            onClick={() => {
              setGrid(initGrid());
              setTimer(0);
              setGameState('ready');
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Canvas Board */}
      <div className="relative w-full p-4 bg-[#0A0A12] border-x border-b border-purple-500/20 rounded-b-xl flex flex-col items-center shadow-2xl">
        <div
          className="grid gap-1 bg-black/40 p-2 rounded-xl border border-white/5 overflow-x-auto max-w-full"
          style={{
            gridTemplateColumns: `repeat(${grid[0]?.length || 9}, minmax(0, 1fr))`
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => (flagMode ? toggleFlag(null, r, c) : revealCell(r, c))}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-xs font-mono transition-colors ${
                  cell.revealed
                    ? cell.isMine
                      ? 'bg-rose-950 border border-rose-500 text-rose-300'
                      : 'bg-white/5 border border-white/5'
                    : 'bg-[#181824] hover:bg-[#232336] border border-white/10 active:scale-95'
                }`}
              >
                {cell.revealed ? (
                  cell.isMine ? (
                    '💣'
                  ) : cell.neighborMines > 0 ? (
                    <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
                  ) : (
                    ''
                  )
                ) : cell.flagged ? (
                  <Flag className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                ) : (
                  ''
                )}
              </button>
            ))
          )}
        </div>

        {/* Win / Loss Modal Notification */}
        {gameState === 'lost' && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center text-xs text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Anti-personnel mine detonated! Tactical clearance aborted.</span>
          </div>
        )}

        {gameState === 'won' && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tactical Sector Cleared! Perfect deduction in {timer} seconds.</span>
          </div>
        )}

        {/* Mobile Flag Mode Toggle */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setFlagMode(!flagMode)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              flagMode
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            {flagMode ? 'Flag Mode ON (Tap to flag)' : 'Tap to Dig (Click to switch to flag)'}
          </button>
        </div>
      </div>
    </div>
  );
};
