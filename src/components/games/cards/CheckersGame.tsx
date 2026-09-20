import React, { useState } from 'react';
import { RotateCcw, Trophy, Crown } from 'lucide-react';

type PieceColor = 'red' | 'black';

interface Piece {
  color: PieceColor;
  isKing: boolean;
}

export const CheckersGame: React.FC = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(() => createInitialBoard());
  const [turn, setTurn] = useState<PieceColor>('red');
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [redCaptured, setRedCaptured] = useState(0);
  const [blackCaptured, setBlackCaptured] = useState(0);

  function createInitialBoard(): (Piece | null)[][] {
    const b: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    // Black at top (rows 0, 1, 2)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) b[r][c] = { color: 'black', isKing: false };
      }
    }
    // Red at bottom (rows 5, 6, 7)
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) b[r][c] = { color: 'red', isKing: false };
      }
    }
    return b;
  }

  const getValidMoves = (r: number, c: number, piece: Piece) => {
    const simpleMoves: [number, number][] = [];
    const jumpMoves: { to: [number, number]; jumped: [number, number] }[] = [];

    const dirs: [number, number][] = [];
    if (piece.color === 'red' || piece.isKing) dirs.push([-1, -1], [-1, 1]);
    if (piece.color === 'black' || piece.isKing) dirs.push([1, -1], [1, 1]);

    const enemy = piece.color === 'red' ? 'black' : 'red';

    dirs.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!board[nr][nc]) {
          simpleMoves.push([nr, nc]);
        } else if (board[nr][nc]?.color === enemy) {
          // Check jump
          const jr = nr + dr;
          const jc = nc + dc;
          if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !board[jr][jc]) {
            jumpMoves.push({ to: [jr, jc], jumped: [nr, nc] });
          }
        }
      }
    });

    return { simpleMoves, jumpMoves };
  };

  const handleCellClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selectedCell) {
      const selPiece = board[selectedCell.r][selectedCell.c];
      if (selPiece && selPiece.color === turn) {
        const { simpleMoves, jumpMoves } = getValidMoves(selectedCell.r, selectedCell.c, selPiece);

        const jump = jumpMoves.find((j) => j.to[0] === r && j.to[1] === c);
        const simple = simpleMoves.find(([sr, sc]) => sr === r && sc === c);

        if (jump || simple) {
          // Execute Move
          const next = board.map((row) => [...row]);
          let isKing = selPiece.isKing;
          if ((selPiece.color === 'red' && r === 0) || (selPiece.color === 'black' && r === 7)) {
            isKing = true;
          }

          next[r][c] = { color: selPiece.color, isKing };
          next[selectedCell.r][selectedCell.c] = null;

          if (jump) {
            next[jump.jumped[0]][jump.jumped[1]] = null;
            if (selPiece.color === 'red') setBlackCaptured((b) => b + 1);
            else setRedCaptured((rc) => rc + 1);
          }

          setBoard(next);
          setSelectedCell(null);

          const nextTurn = turn === 'red' ? 'black' : 'red';
          setTurn(nextTurn);

          if (nextTurn === 'black') {
            setTimeout(() => makeAiMove(next), 400);
          }
          return;
        }
      }
    }

    if (piece && piece.color === turn) {
      setSelectedCell({ r, c });
    } else {
      setSelectedCell(null);
    }
  };

  const makeAiMove = (currentBoard: (Piece | null)[][]) => {
    const allJumps: { from: [number, number]; to: [number, number]; jumped: [number, number] }[] = [];
    const allSimples: { from: [number, number]; to: [number, number] }[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p.color === 'black') {
          const { simpleMoves, jumpMoves } = getValidMoves(r, c, p);
          jumpMoves.forEach((jm) => allJumps.push({ from: [r, c], to: jm.to, jumped: jm.jumped }));
          simpleMoves.forEach((sm) => allSimples.push({ from: [r, c], to: sm }));
        }
      }
    }

    if (allJumps.length > 0) {
      const chosen = allJumps[Math.floor(Math.random() * allJumps.length)];
      const next = currentBoard.map((row) => [...row]);
      const moving = next[chosen.from[0]][chosen.from[1]]!;
      let isKing = moving.isKing || chosen.to[0] === 7;
      next[chosen.to[0]][chosen.to[1]] = { color: 'black', isKing };
      next[chosen.from[0]][chosen.from[1]] = null;
      next[chosen.jumped[0]][chosen.jumped[1]] = null;
      setRedCaptured((rc) => rc + 1);
      setBoard(next);
      setTurn('red');
    } else if (allSimples.length > 0) {
      const chosen = allSimples[Math.floor(Math.random() * allSimples.length)];
      const next = currentBoard.map((row) => [...row]);
      const moving = next[chosen.from[0]][chosen.from[1]]!;
      let isKing = moving.isKing || chosen.to[0] === 7;
      next[chosen.to[0]][chosen.to[1]] = { color: 'black', isKing };
      next[chosen.from[0]][chosen.from[1]] = null;
      setBoard(next);
      setTurn('red');
    } else {
      setWinner('red');
    }
  };

  const restartCheckers = () => {
    setBoard(createInitialBoard());
    setTurn('red');
    setSelectedCell(null);
    setWinner(null);
    setRedCaptured(0);
    setBlackCaptured(0);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[480px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-2">
          <span
            className={`w-3.5 h-3.5 rounded-full ${
              turn === 'red' ? 'bg-rose-500' : 'bg-slate-400'
            }`}
          />
          <span className="font-bold">
            {turn === 'red' ? 'Your Turn (Red)' : 'AI Calculating (Black)...'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/40 text-[10px]">CAPTURES:</span>
          <span className="text-rose-400 font-bold">{blackCaptured}</span>
          <span>-</span>
          <span className="text-slate-400 font-bold">{redCaptured}</span>
          <button
            onClick={restartCheckers}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition ml-2"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8x8 Board Matrix */}
      <div className="relative w-full aspect-square bg-[#0D0D18] border-x border-b border-purple-500/20 rounded-b-xl grid grid-cols-8 grid-rows-8 shadow-2xl overflow-hidden">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isDarkSquare = (r + c) % 2 === 1;
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`relative flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-purple-600/60 ring-2 ring-purple-400'
                    : isDarkSquare
                    ? 'bg-[#181828]'
                    : 'bg-[#2E2E42]'
                }`}
              >
                {cell && (
                  <div
                    className={`w-4/5 h-4/5 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform transform active:scale-95 ${
                      cell.color === 'red'
                        ? 'bg-gradient-to-b from-rose-500 to-rose-700 border-rose-400 shadow-rose-600/40 text-white'
                        : 'bg-gradient-to-b from-slate-700 to-slate-900 border-slate-500 shadow-black text-amber-400'
                    }`}
                  >
                    {cell.isKing && <Crown className="w-4 h-4 fill-current" />}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
