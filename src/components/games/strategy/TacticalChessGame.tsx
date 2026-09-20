import React, { useState } from 'react';
import { RotateCcw, ArrowUpDown, Trophy, Shield } from 'lucide-react';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

const INITIAL_BOARD: (ChessPiece | null)[][] = [
  [
    { type: 'r', color: 'b' }, { type: 'n', color: 'b' }, { type: 'b', color: 'b' }, { type: 'q', color: 'b' },
    { type: 'k', color: 'b' }, { type: 'b', color: 'b' }, { type: 'n', color: 'b' }, { type: 'r', color: 'b' }
  ],
  Array(8).fill(null).map(() => ({ type: 'p', color: 'b' })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'p', color: 'w' })),
  [
    { type: 'r', color: 'w' }, { type: 'n', color: 'w' }, { type: 'b', color: 'w' }, { type: 'q', color: 'w' },
    { type: 'k', color: 'w' }, { type: 'b', color: 'w' }, { type: 'n', color: 'w' }, { type: 'r', color: 'w' }
  ]
];

const PIECE_ICONS: Record<string, string> = {
  'w-k': '♔', 'w-q': '♕', 'w-r': '♖', 'w-b': '♗', 'w-n': '♘', 'w-p': '♙',
  'b-k': '♚', 'b-q': '♛', 'b-r': '♜', 'b-b': '♝', 'b-n': '♞', 'b-p': '♟'
};

export const TacticalChessGame: React.FC = () => {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(() => JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [turn, setTurn] = useState<PieceColor>('w');
  const [capturedWhite, setCapturedWhite] = useState<ChessPiece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<ChessPiece[]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const getValidMoves = (r: number, c: number, piece: ChessPiece): [number, number][] => {
    const moves: [number, number][] = [];
    const color = piece.color;
    const enemy = color === 'w' ? 'b' : 'w';

    const addIfValid = (nr: number, nc: number) => {
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const dest = board[nr][nc];
        if (!dest) {
          moves.push([nr, nc]);
          return true; // continue ray
        } else if (dest.color === enemy) {
          moves.push([nr, nc]);
          return false; // capture, stop ray
        }
      }
      return false; // blocked or out
    };

    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // Single step forward
      if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        // Double step
        if (r === startRow && !board[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Diagonal captures
      [-1, 1].forEach((dc) => {
        const nr = r + dir;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc]?.color === enemy) {
          moves.push([nr, nc]);
        }
      });
    } else if (piece.type === 'n') {
      const deltas = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      deltas.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));
    } else if (piece.type === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) addIfValid(r + dr, c + dc);
        }
      }
    } else {
      // Ray pieces (r, b, q)
      const dirs: [number, number][] = [];
      if (piece.type === 'r' || piece.type === 'q') {
        dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }
      if (piece.type === 'b' || piece.type === 'q') {
        dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }

      dirs.forEach(([dr, dc]) => {
        let step = 1;
        while (step < 8) {
          const cont = addIfValid(r + dr * step, c + dc * step);
          if (!cont) break;
          step++;
        }
      });
    }

    return moves;
  };

  const handleCellClick = (r: number, c: number) => {
    const piece = board[r][c];

    // If already selected a piece
    if (selectedCell) {
      const selectedPiece = board[selectedCell.r][selectedCell.c];
      if (selectedPiece && selectedPiece.color === turn) {
        const valid = getValidMoves(selectedCell.r, selectedCell.c, selectedPiece);
        const isMoveTarget = valid.some(([vr, vc]) => vr === r && vc === c);

        if (isMoveTarget) {
          // Execute Move
          const next = board.map((row) => [...row]);
          const captured = next[r][c];

          if (captured) {
            if (captured.color === 'w') setCapturedWhite((p) => [...p, captured]);
            else setCapturedBlack((p) => [...p, captured]);
          }

          // Pawn promotion to Queen
          if (selectedPiece.type === 'p' && (r === 0 || r === 7)) {
            next[r][c] = { type: 'q', color: selectedPiece.color };
          } else {
            next[r][c] = selectedPiece;
          }

          next[selectedCell.r][selectedCell.c] = null;
          setBoard(next);
          setSelectedCell(null);
          setMoveCount((m) => m + 1);

          const nextTurn = turn === 'w' ? 'b' : 'w';
          setTurn(nextTurn);

          // Trigger AI opponent move if turn is Black
          if (nextTurn === 'b') {
            setTimeout(() => makeAiMove(next), 400);
          }
          return;
        }
      }
    }

    // Select piece if matching turn
    if (piece && piece.color === turn) {
      setSelectedCell({ r, c });
    } else {
      setSelectedCell(null);
    }
  };

  const makeAiMove = (currentBoard: (ChessPiece | null)[][]) => {
    const allMoves: { from: [number, number]; to: [number, number]; score: number }[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p && p.color === 'b') {
          const valids = getValidMoves(r, c, p);
          valids.forEach(([vr, vc]) => {
            const target = currentBoard[vr][vc];
            let score = 0;
            if (target) {
              const weights: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 50 };
              score = weights[target.type] * 10;
            }
            // slight center preference
            score += 4 - Math.abs(3.5 - vc);
            allMoves.push({ from: [r, c], to: [vr, vc], score });
          });
        }
      }
    }

    if (allMoves.length === 0) return;

    allMoves.sort((a, b) => b.score - a.score);
    // Pick from top best moves with small randomness
    const best = allMoves.slice(0, Math.min(3, allMoves.length));
    const chosen = best[Math.floor(Math.random() * best.length)];

    const next = currentBoard.map((row) => [...row]);
    const moving = next[chosen.from[0]][chosen.from[1]];
    const cap = next[chosen.to[0]][chosen.to[1]];

    if (cap) setCapturedWhite((p) => [...p, cap]);
    next[chosen.to[0]][chosen.to[1]] = moving;
    next[chosen.from[0]][chosen.from[1]] = null;

    setBoard(next);
    setTurn('w');
  };

  const restartChess = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setSelectedCell(null);
    setTurn('w');
    setCapturedWhite([]);
    setCapturedBlack([]);
    setMoveCount(0);
  };

  const validTargets = selectedCell && board[selectedCell.r][selectedCell.c]
    ? getValidMoves(selectedCell.r, selectedCell.c, board[selectedCell.r][selectedCell.c]!)
    : [];

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[500px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3 h-3 rounded-full ${
                turn === 'w' ? 'bg-white shadow-md shadow-white/50' : 'bg-purple-600'
              }`}
            />
            <span className="font-semibold text-white">
              {turn === 'w' ? 'Your Turn (White)' : 'AI Calculating (Black)...'}
            </span>
          </div>
          <span className="text-white/40 font-mono">Move {moveCount}</span>
        </div>

        <button
          onClick={restartChess}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1"
          title="Restart Match"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* 8x8 Chessboard */}
      <div className="relative w-full aspect-square bg-[#0D0D17] border-x border-purple-500/20 grid grid-cols-8 grid-rows-8 shadow-2xl">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isLight = (r + c) % 2 === 0;
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isValidTarget = validTargets.some(([vr, vc]) => vr === r && vc === c);

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`relative flex items-center justify-center text-3xl sm:text-4xl transition-colors ${
                  isSelected
                    ? 'bg-purple-600/70 border-2 border-purple-300'
                    : isValidTarget
                    ? isLight
                      ? 'bg-emerald-300/60'
                      : 'bg-emerald-700/60'
                    : isLight
                    ? 'bg-[#2A2A3D]'
                    : 'bg-[#151522]'
                }`}
              >
                {cell && (
                  <span
                    className={
                      cell.color === 'w'
                        ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                        : 'text-purple-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                    }
                  >
                    {PIECE_ICONS[`${cell.color}-${cell.type}`]}
                  </span>
                )}
                {isValidTarget && !cell && (
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Captured Pieces Bar */}
      <div className="w-full p-3 bg-black/70 border border-purple-500/20 rounded-b-xl flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/40 mr-1">CAPTURED (B):</span>
          {capturedBlack.map((p, i) => (
            <span key={i} className="text-purple-400 font-serif">
              {PIECE_ICONS[`${p.color}-${p.type}`]}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/40 mr-1">CAPTURED (W):</span>
          {capturedWhite.map((p, i) => (
            <span key={i} className="text-white font-serif">
              {PIECE_ICONS[`${p.color}-${p.type}`]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
