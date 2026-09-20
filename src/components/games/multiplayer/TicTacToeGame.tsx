import React, { useState, useEffect } from 'react';
import { RotateCcw, Swords, Trophy, Sparkles, ShieldAlert } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { MultiplayerSession } from '../../../types/gaming';
import { makeSessionMove, subscribeToSession } from '../../../lib/multiplayer';

interface TicTacToeGameProps {
  session?: MultiplayerSession | null;
  currentUser?: FirebaseUser | null;
  onOpenInviteModal?: () => void;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({
  session: initialSession,
  currentUser,
  onOpenInviteModal
}) => {
  const [liveSession, setLiveSession] = useState<MultiplayerSession | null>(initialSession || null);

  // Local state
  const [localBoard, setLocalBoard] = useState<(string | null)[]>(() => Array(9).fill(null));
  const [localTurn, setLocalTurn] = useState<'X' | 'O'>('X');
  const [localWinner, setLocalWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const board: (string | null)[] = isMultiplayer && liveSession?.gameState?.board
    ? liveSession.gameState.board
    : localBoard;

  const winner = isMultiplayer ? liveSession?.winner : localWinner;

  const checkWinner = (grid: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (const [a, b, c] of lines) {
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return grid[a];
      }
    }
    if (grid.every((cell) => cell !== null)) return 'draw';
    return null;
  };

  const handleCellClick = async (idx: number) => {
    if (board[idx] || winner) return;

    if (isMultiplayer) {
      if (!isMyTurn || isSubmitting || !liveSession || !currentUser) return;
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await makeSessionMove(liveSession.id, currentUser.uid, {
        cell: idx
      });

      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Move rejected by server.');
      }
      return;
    }

    // Local / AI
    const next = [...localBoard];
    next[idx] = localTurn;
    setLocalBoard(next);

    const win = checkWinner(next);
    if (win) {
      setLocalWinner(win);
      return;
    }

    const nextTurn = localTurn === 'X' ? 'O' : 'X';
    setLocalTurn(nextTurn);

    if (gameMode === 'ai' && nextTurn === 'O') {
      setTimeout(() => makeAiMove(next), 350);
    }
  };

  const makeAiMove = (currentGrid: (string | null)[]) => {
    const emptyIndices = currentGrid
      .map((val, i) => (val === null ? i : null))
      .filter((v): v is number => v !== null);

    if (emptyIndices.length === 0) return;

    // AI logic: check win, then check block, then random
    let chosenIdx = emptyIndices[0];

    // Win check
    for (const idx of emptyIndices) {
      const copy = [...currentGrid];
      copy[idx] = 'O';
      if (checkWinner(copy) === 'O') {
        chosenIdx = idx;
        break;
      }
    }

    // Block check
    if (chosenIdx === emptyIndices[0]) {
      for (const idx of emptyIndices) {
        const copy = [...currentGrid];
        copy[idx] = 'X';
        if (checkWinner(copy) === 'X') {
          chosenIdx = idx;
          break;
        }
      }
    }

    const next = [...currentGrid];
    next[chosenIdx] = 'O';
    setLocalBoard(next);

    const win = checkWinner(next);
    if (win) {
      setLocalWinner(win);
    } else {
      setLocalTurn('X');
    }
  };

  const restartLocal = () => {
    setLocalBoard(Array(9).fill(null));
    setLocalTurn('X');
    setLocalWinner(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[420px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-2">
          {isMultiplayer ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-300">Multiplayer Session</span>
              {liveSession && (
                <span className="text-white/40 font-mono text-[11px]">
                  Turn: {liveSession.currentTurn === 'host' ? `${liveSession.host.displayName} (X)` : `${liveSession.guest?.displayName || 'Challenger'} (O)`}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-semibold">
              <span className={localTurn === 'X' ? 'text-cyan-400 font-bold' : 'text-pink-400 font-bold'}>
                Player {localTurn}
              </span>
              <span>{localTurn === 'X' ? 'Turn' : gameMode === 'ai' ? 'AI Turn...' : 'Turn'}</span>
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
                {gameMode === 'ai' ? 'vs AI' : '2 Players'}
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

      {/* Players status if online */}
      {isMultiplayer && liveSession && (
        <div className="w-full px-4 py-2 bg-purple-950/30 border-x border-purple-500/20 flex items-center justify-between text-xs text-white">
          <div className="text-cyan-400 font-semibold">{liveSession.host.displayName} (X)</div>
          <div className="text-white/40 font-mono">VS</div>
          <div className="text-pink-400 font-semibold">{liveSession.guest?.displayName || 'Waiting...'} (O)</div>
        </div>
      )}

      {errorMessage && (
        <div className="w-full px-4 py-2 bg-rose-950/50 border-x border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3x3 Grid Board */}
      <div className="relative w-full aspect-square p-4 bg-[#0B0B17] border-x border-b border-purple-500/20 rounded-b-xl shadow-2xl grid grid-cols-3 gap-3">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={!!cell || isSubmitting || (isMultiplayer && !isMyTurn)}
            className="rounded-2xl bg-[#141424] hover:bg-[#1C1C30] border border-white/10 flex items-center justify-center text-4xl sm:text-5xl font-black transition-all active:scale-95 disabled:opacity-80"
          >
            {cell === 'X' && <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">X</span>}
            {cell === 'O' && <span className="text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]">O</span>}
          </button>
        ))}

        {winner && (
          <div className="absolute inset-0 rounded-b-xl bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black mb-1">
              {winner === 'draw'
                ? 'TIE GAME / DRAW!'
                : isMultiplayer
                ? winner === (isHost ? 'host' : 'guest')
                  ? 'VICTORY! YOU WON!'
                  : 'OPPONENT WON!'
                : `PLAYER ${winner} WINS!`}
            </h2>
            <p className="text-xs text-white/70 mb-4">Three symbols aligned in a row.</p>
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
