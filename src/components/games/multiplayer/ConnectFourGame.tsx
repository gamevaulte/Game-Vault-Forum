import React, { useState, useEffect } from 'react';
import { RotateCcw, Swords, Trophy, Users, ShieldAlert, CheckCircle, Sparkles } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { MultiplayerSession } from '../../../types/gaming';
import { makeSessionMove, subscribeToSession } from '../../../lib/multiplayer';

interface ConnectFourGameProps {
  session?: MultiplayerSession | null;
  currentUser?: FirebaseUser | null;
  onOpenInviteModal?: () => void;
}

export const ConnectFourGame: React.FC<ConnectFourGameProps> = ({
  session: initialSession,
  currentUser,
  onOpenInviteModal
}) => {
  const [liveSession, setLiveSession] = useState<MultiplayerSession | null>(initialSession || null);

  // Local state for Offline / Pass & Play / AI mode
  const [localBoard, setLocalBoard] = useState<(string | null)[][]>(() =>
    Array(6).fill(null).map(() => Array(7).fill(null))
  );
  const [localTurn, setLocalTurn] = useState<'red' | 'yellow'>('red');
  const [localWinner, setLocalWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subscribe to real-time session if in multiplayer mode
  useEffect(() => {
    if (!initialSession?.id) return;
    setLiveSession(initialSession);

    const unsubscribe = subscribeToSession(initialSession.id, (updated) => {
      setLiveSession(updated);
    });

    return () => unsubscribe();
  }, [initialSession?.id]);

  const isMultiplayer = !!liveSession;
  const isHost = liveSession?.hostId === currentUser?.uid;
  const isMyTurn = isMultiplayer && currentUser
    ? liveSession.status === 'in_progress' && (isHost ? liveSession.currentTurn === 'host' : liveSession.currentTurn === 'guest')
    : true;

  const board: (string | null)[][] = isMultiplayer && liveSession?.gameState?.grid
    ? liveSession.gameState.grid.map((r: number[]) =>
        r.map((val: number) => (val === 1 ? 'red' : val === 2 ? 'yellow' : null))
      )
    : localBoard;

  const winner = isMultiplayer ? liveSession?.winner : localWinner;

  // Check 4 in a row win condition for local play
  const checkWin = (grid: (string | null)[][], row: number, col: number, player: string) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diag down-right
      [1, -1] // diag down-left
    ];

    for (const [dr, dc] of directions) {
      let count = 1;
      for (let step = 1; step < 4; step++) {
        const r = row + dr * step;
        const c = col + dc * step;
        if (r >= 0 && r < 6 && c >= 0 && c < 7 && grid[r][c] === player) count++;
        else break;
      }
      for (let step = 1; step < 4; step++) {
        const r = row - dr * step;
        const c = col - dc * step;
        if (r >= 0 && r < 6 && c >= 0 && c < 7 && grid[r][c] === player) count++;
        else break;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const handleDropPiece = async (col: number) => {
    if (winner) return;

    if (isMultiplayer) {
      if (!isMyTurn || isSubmitting || !liveSession || !currentUser) return;

      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await makeSessionMove(liveSession.id, currentUser.uid, {
        col
      });

      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Move rejected by server.');
      }
      return;
    }

    // Local / AI Mode
    // Find lowest empty row in column
    let targetRow = -1;
    for (let r = 5; r >= 0; r--) {
      if (!localBoard[r][col]) {
        targetRow = r;
        break;
      }
    }
    if (targetRow === -1) return; // Column full

    const next = localBoard.map((row) => [...row]);
    next[targetRow][col] = localTurn;
    setLocalBoard(next);

    if (checkWin(next, targetRow, col, localTurn)) {
      setLocalWinner(localTurn);
      return;
    }

    // Check draw
    const isFull = next.every((row) => row.every((c) => c !== null));
    if (isFull) {
      setLocalWinner('draw');
      return;
    }

    const nextTurn = localTurn === 'red' ? 'yellow' : 'red';
    setLocalTurn(nextTurn);

    if (gameMode === 'ai' && nextTurn === 'yellow') {
      setTimeout(() => makeAiDrop(next), 400);
    }
  };

  const makeAiDrop = (currentBoard: (string | null)[][]) => {
    // Find valid columns
    const validCols: number[] = [];
    for (let c = 0; c < 7; c++) {
      if (!currentBoard[0][c]) validCols.push(c);
    }
    if (validCols.length === 0) return;

    // Check if AI can win immediately or block player
    let chosenCol = validCols[Math.floor(Math.random() * validCols.length)];

    for (const c of validCols) {
      let r = -1;
      for (let row = 5; row >= 0; row--) {
        if (!currentBoard[row][c]) {
          r = row;
          break;
        }
      }
      if (r !== -1 && checkWin(currentBoard, r, c, 'yellow')) {
        chosenCol = c;
        break;
      }
    }

    let targetRow = -1;
    for (let r = 5; r >= 0; r--) {
      if (!currentBoard[r][chosenCol]) {
        targetRow = r;
        break;
      }
    }

    if (targetRow !== -1) {
      const next = currentBoard.map((row) => [...row]);
      next[targetRow][chosenCol] = 'yellow';
      setLocalBoard(next);

      if (checkWin(next, targetRow, chosenCol, 'yellow')) {
        setLocalWinner('yellow');
      } else {
        setLocalTurn('red');
      }
    }
  };

  const restartLocal = () => {
    setLocalBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setLocalTurn('red');
    setLocalWinner(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[560px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-3">
          {isMultiplayer ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-purple-300">Live Match Session</span>
              {liveSession && (
                <span className="text-white/40 font-mono text-[11px]">
                  Turn: {liveSession.currentTurn === 'host' ? liveSession.host.displayName : (liveSession.guest?.displayName || 'Challenger')}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  localTurn === 'red' ? 'bg-rose-500 shadow-md shadow-rose-500/50' : 'bg-amber-400 shadow-md shadow-amber-400/50'
                }`}
              />
              <span className="font-bold">
                {localTurn === 'red' ? 'Red Player Turn' : gameMode === 'ai' ? 'AI Turn...' : 'Yellow Player Turn'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMultiplayer && (
            <>
              <button
                onClick={() => setGameMode((m) => (m === 'ai' ? 'pvp' : 'ai'))}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-[11px] font-medium transition"
              >
                {gameMode === 'ai' ? 'Mode: vs AI' : 'Mode: 2 Players'}
              </button>
              <button
                onClick={restartLocal}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {onOpenInviteModal && !isMultiplayer && (
            <button
              onClick={onOpenInviteModal}
              className="py-1 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white text-[11px] flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Invite Player</span>
            </button>
          )}
        </div>
      </div>

      {/* Multiplayer Players Bar */}
      {isMultiplayer && liveSession && (
        <div className="w-full px-4 py-2 bg-purple-950/30 border-x border-purple-500/20 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="font-semibold text-rose-300">{liveSession.host.displayName} (Host)</span>
          </div>
          <div className="font-mono text-purple-400 text-xs">VS</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-300">
              {liveSession.guest?.displayName || 'Waiting for challenger...'}
            </span>
            <span className="w-3 h-3 rounded-full bg-amber-400" />
          </div>
        </div>
      )}

      {/* Error alert if any */}
      {errorMessage && (
        <div className="w-full px-4 py-2 bg-rose-950/50 border-x border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 7x6 Connect Four Grid */}
      <div className="relative w-full p-4 bg-[#101026] border-x border-b border-purple-500/20 rounded-b-xl shadow-2xl flex flex-col items-center">
        {/* Column Drop Buttons */}
        <div className="grid grid-cols-7 gap-2.5 w-full max-w-[460px] mb-2">
          {Array.from({ length: 7 }).map((_, c) => (
            <button
              key={`drop-${c}`}
              onClick={() => handleDropPiece(c)}
              disabled={isSubmitting || (isMultiplayer && !isMyTurn)}
              className="py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/40 text-purple-300 font-bold text-xs transition disabled:opacity-30 active:scale-95"
            >
              ▼
            </button>
          ))}
        </div>

        {/* Board Holes Matrix */}
        <div className="grid grid-cols-7 gap-2.5 w-full max-w-[460px] bg-blue-950/80 p-4 rounded-2xl border-4 border-blue-900 shadow-inner">
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleDropPiece(c)}
                className="aspect-square rounded-full bg-[#070712] border-2 border-blue-900/60 flex items-center justify-center transition-all duration-200 overflow-hidden"
              >
                {cell && (
                  <div
                    className={`w-full h-full rounded-full transition-transform duration-300 transform scale-95 shadow-md ${
                      cell === 'red' || cell === (isMultiplayer ? liveSession?.hostId : '')
                        ? 'bg-rose-500 shadow-rose-500/50'
                        : 'bg-amber-400 shadow-amber-400/50'
                    }`}
                  />
                )}
              </button>
            ))
          )}
        </div>

        {/* Victory Modal */}
        {winner && (
          <div className="absolute inset-0 rounded-b-xl bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black mb-1">
              {winner === 'draw'
                ? 'STALEMATE / DRAW!'
                : isMultiplayer
                ? winner === (isHost ? 'host' : 'guest')
                  ? 'VICTORY! YOU WON!'
                  : 'OPPONENT WON!'
                : winner === 'red'
                ? 'RED PLAYER WINS!'
                : 'YELLOW PLAYER WINS!'}
            </h2>
            <p className="text-xs text-white/70 mb-4">Four discs aligned in sequence.</p>
            {!isMultiplayer && (
              <button
                onClick={restartLocal}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
              >
                Play Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
