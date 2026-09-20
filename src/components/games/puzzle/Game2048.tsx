import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Undo, Trophy, Sparkles } from 'lucide-react';

export const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(() => getInitialBoard());
  const [history, setHistory] = useState<{ board: number[][]; score: number }[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gv_2048_hi') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  function getInitialBoard(): number[][] {
    const b = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(b);
    addRandomTile(b);
    return b;
  }

  function addRandomTile(b: number[][]) {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return;
    const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    b[choice.r][choice.c] = Math.random() < 0.9 ? 2 : 4;
  }

  const restartGame = () => {
    const newB = getInitialBoard();
    setBoard(newB);
    setHistory([]);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  };

  const undoMove = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setGameOver(false);
  };

  const slide = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    setBoard((currentBoard) => {
      const prevBoardCopy = currentBoard.map((row) => [...row]);
      let moved = false;
      let addedPoints = 0;

      const newBoard = currentBoard.map((row) => [...row]);

      const operateRow = (row: number[]): { res: number[]; pts: number; chg: boolean } => {
        const filtered = row.filter((x) => x !== 0);
        let pts = 0;
        const res: number[] = [];
        for (let i = 0; i < filtered.length; i++) {
          if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
            const merged = filtered[i] * 2;
            res.push(merged);
            pts += merged;
            if (merged === 2048) setHasWon(true);
            i++;
          } else {
            res.push(filtered[i]);
          }
        }
        while (res.length < 4) res.push(0);
        const chg = res.some((v, idx) => v !== row[idx]);
        return { res, pts, chg };
      };

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const { res, pts, chg } = operateRow(newBoard[r]);
          if (chg) moved = true;
          addedPoints += pts;
          newBoard[r] = res;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const rev = [...newBoard[r]].reverse();
          const { res, pts, chg } = operateRow(rev);
          if (chg) moved = true;
          addedPoints += pts;
          newBoard[r] = res.reverse();
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
          const { res, pts, chg } = operateRow(col);
          if (chg) moved = true;
          addedPoints += pts;
          for (let r = 0; r < 4; r++) newBoard[r][c] = res[r];
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
          const { res, pts, chg } = operateRow(col);
          if (chg) moved = true;
          addedPoints += pts;
          newBoard[3][c] = res[0];
          newBoard[2][c] = res[1];
          newBoard[1][c] = res[2];
          newBoard[0][c] = res[3];
        }
      }

      if (moved) {
        setHistory((prev) => [...prev.slice(-10), { board: prevBoardCopy, score }]);
        addRandomTile(newBoard);

        setScore((prev) => {
          const next = prev + addedPoints;
          if (next > bestScore) {
            setBestScore(next);
            try {
              localStorage.setItem('gv_2048_hi', next.toString());
            } catch {}
          }
          return next;
        });

        // Check game over
        let canMove = false;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            if (newBoard[r][c] === 0) canMove = true;
            if (c < 3 && newBoard[r][c] === newBoard[r][c + 1]) canMove = true;
            if (r < 3 && newBoard[r][c] === newBoard[r + 1][c]) canMove = true;
          }
        }
        if (!canMove) setGameOver(true);

        return newBoard;
      }

      return currentBoard;
    });
  }, [gameOver, score, bestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        slide('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        slide('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        slide('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        slide('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slide]);

  const getTileStyles = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-purple-950/40 text-purple-200 border-purple-800/40';
      case 4:
        return 'bg-purple-900/60 text-purple-100 border-purple-600/50';
      case 8:
        return 'bg-indigo-700/80 text-white border-indigo-500 shadow-sm shadow-indigo-500/30';
      case 16:
        return 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30 font-bold';
      case 32:
        return 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/40 font-bold';
      case 64:
        return 'bg-teal-500 text-white border-teal-300 shadow-lg shadow-teal-500/40 font-bold';
      case 128:
        return 'bg-emerald-500 text-white border-emerald-300 shadow-lg shadow-emerald-500/40 font-black';
      case 256:
        return 'bg-amber-500 text-white border-amber-300 shadow-lg shadow-amber-500/40 font-black';
      case 512:
        return 'bg-orange-500 text-white border-orange-300 shadow-xl shadow-orange-500/50 font-black';
      case 1024:
        return 'bg-rose-500 text-white border-rose-300 shadow-xl shadow-rose-500/50 font-black';
      case 2048:
        return 'bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-300 shadow-2xl shadow-pink-500/60 font-black';
      default:
        return val > 2048
          ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white font-black'
          : 'bg-black/30 border-white/5 text-transparent';
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[420px] mx-auto">
      {/* Controls & Scores */}
      <div className="w-full flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-2">
          <div className="px-3 py-2 rounded-xl bg-black/60 border border-purple-500/20 text-center">
            <span className="text-[10px] text-white/50 block">SCORE</span>
            <span className="text-base font-bold font-mono text-purple-300">{score}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-black/60 border border-purple-500/20 text-center">
            <span className="text-[10px] text-white/50 block">BEST</span>
            <span className="text-base font-bold font-mono text-amber-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />
              {bestScore}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undoMove}
            disabled={history.length === 0}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white/80 transition"
            title="Undo Move"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={restartGame}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg shadow-purple-600/30"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4x4 Grid Matrix */}
      <div className="relative w-full aspect-square p-3 rounded-2xl bg-[#090910] border border-purple-500/30 shadow-2xl shadow-purple-950/40 grid grid-cols-4 gap-2.5">
        {board.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-xl border flex items-center justify-center text-xl md:text-2xl font-mono transition-all duration-100 ${getTileStyles(
                val
              )}`}
            >
              {val !== 0 ? val : ''}
            </div>
          ))
        )}

        {/* Game Over Banner */}
        {gameOver && (
          <div className="absolute inset-0 rounded-2xl bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <h3 className="text-2xl font-black text-rose-500 mb-1">NO MORE MOVES</h3>
            <p className="text-xs text-white/70 mb-4">Grid matrix fully locked.</p>
            <button
              onClick={restartGame}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              Play Again
            </button>
          </div>
        )}

        {/* 2048 Victory Banner */}
        {hasWon && (
          <div className="absolute inset-0 rounded-2xl bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Sparkles className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-300 mb-1">
              2048 ACHIEVED!
            </h3>
            <p className="text-xs text-white/70 mb-4">You solved the legendary core.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setHasWon(false)}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
              >
                Keep Playing
              </button>
              <button
                onClick={restartGame}
                className="py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition"
              >
                Restart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe / Directional Controls */}
      <div className="mt-4 flex flex-col items-center gap-1.5 w-full">
        <button
          onClick={() => slide('up')}
          className="w-14 h-10 rounded-lg bg-white/5 active:bg-purple-600 text-white font-bold text-sm"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => slide('left')}
            className="w-14 h-10 rounded-lg bg-white/5 active:bg-purple-600 text-white font-bold text-sm"
          >
            ◀
          </button>
          <button
            onClick={() => slide('down')}
            className="w-14 h-10 rounded-lg bg-white/5 active:bg-purple-600 text-white font-bold text-sm"
          >
            ▼
          </button>
          <button
            onClick={() => slide('right')}
            className="w-14 h-10 rounded-lg bg-white/5 active:bg-purple-600 text-white font-bold text-sm"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
