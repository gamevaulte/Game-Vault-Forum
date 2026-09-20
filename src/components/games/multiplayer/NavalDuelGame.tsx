import React, { useState, useEffect } from 'react';
import { RotateCcw, Swords, Trophy, Crosshair, ShieldAlert } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { MultiplayerSession } from '../../../types/gaming';
import { makeSessionMove, subscribeToSession } from '../../../lib/multiplayer';

interface NavalDuelGameProps {
  session?: MultiplayerSession | null;
  currentUser?: FirebaseUser | null;
  onOpenInviteModal?: () => void;
}

interface Cell {
  hasShip: boolean;
  hit: boolean;
}

export const NavalDuelGame: React.FC<NavalDuelGameProps> = ({
  session: initialSession,
  currentUser,
  onOpenInviteModal
}) => {
  const [liveSession, setLiveSession] = useState<MultiplayerSession | null>(initialSession || null);

  // Local Dual Fleet State
  const [p1Grid, setP1Grid] = useState<Cell[][]>(() => createGrid());
  const [p2Grid, setP2Grid] = useState<Cell[][]>(() => createGrid());
  const [currentTurn, setCurrentTurn] = useState<'p1' | 'p2'>('p1');
  const [p1Hits, setP1Hits] = useState(0);
  const [p2Hits, setP2Hits] = useState(0);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function createGrid(): Cell[][] {
    const g: Cell[][] = Array(6)
      .fill(null)
      .map(() => Array(6).fill(null).map(() => ({ hasShip: false, hit: false })));

    // Place 3 ships (length 3, 2, 2)
    const lengths = [3, 2, 2];
    lengths.forEach((len) => {
      let placed = false;
      let count = 0;
      while (!placed && count < 60) {
        count++;
        const horiz = Math.random() > 0.5;
        const r = Math.floor(Math.random() * (horiz ? 6 : 6 - len));
        const c = Math.floor(Math.random() * (horiz ? 6 - len : 6));
        let clear = true;
        for (let i = 0; i < len; i++) {
          if (g[horiz ? r : r + i][horiz ? c + i : c].hasShip) {
            clear = false;
            break;
          }
        }
        if (clear) {
          for (let i = 0; i < len; i++) {
            g[horiz ? r : r + i][horiz ? c + i : c].hasShip = true;
          }
          placed = true;
        }
      }
    });
    return g;
  }

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

  const handleCellClick = async (r: number, c: number) => {
    if (winner) return;

    if (isMultiplayer) {
      if (!isMyTurn || isSubmitting || !liveSession || !currentUser) return;
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await makeSessionMove(liveSession.id, currentUser.uid, {
        row: r,
        col: c
      });

      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Move rejected by server.');
      }
      return;
    }

    // Local Pass & Play
    if (currentTurn === 'p1') {
      // P1 fires at P2 grid
      if (p2Grid[r][c].hit) return;
      const nextP2 = p2Grid.map((row) => row.map((cl) => ({ ...cl })));
      nextP2[r][c].hit = true;
      setP2Grid(nextP2);

      let nextP1Hits = p1Hits;
      if (nextP2[r][c].hasShip) {
        nextP1Hits = p1Hits + 1;
        setP1Hits(nextP1Hits);
        if (nextP1Hits >= 7) {
          setWinner('p1');
          return;
        }
      }
      setCurrentTurn('p2');
    } else {
      // P2 fires at P1 grid
      if (p1Grid[r][c].hit) return;
      const nextP1 = p1Grid.map((row) => row.map((cl) => ({ ...cl })));
      nextP1[r][c].hit = true;
      setP1Grid(nextP1);

      let nextP2Hits = p2Hits;
      if (nextP1[r][c].hasShip) {
        nextP2Hits = p2Hits + 1;
        setP2Hits(nextP2Hits);
        if (nextP2Hits >= 7) {
          setWinner('p2');
          return;
        }
      }
      setCurrentTurn('p1');
    }
  };

  const restartLocal = () => {
    setP1Grid(createGrid());
    setP2Grid(createGrid());
    setCurrentTurn('p1');
    setP1Hits(0);
    setP2Hits(0);
    setWinner(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[620px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-2">
          {isMultiplayer ? (
            <span className="font-bold text-purple-300">Multiplayer Naval Duel</span>
          ) : (
            <div className="flex items-center gap-2 font-semibold">
              <span className={currentTurn === 'p1' ? 'text-cyan-400 font-bold' : 'text-pink-400 font-bold'}>
                {currentTurn === 'p1' ? 'Commander 1 Salvo' : 'Commander 2 Salvo'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMultiplayer && (
            <button
              onClick={restartLocal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Fleets</span>
            </button>
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

      {isMultiplayer && liveSession && (
        <div className="w-full px-4 py-2 bg-purple-950/30 border-x border-purple-500/20 flex items-center justify-between text-xs text-white">
          <div className="text-cyan-400 font-semibold">{liveSession.host.displayName} (Host)</div>
          <div className="font-mono text-white/40">VS</div>
          <div className="text-pink-400 font-semibold">{liveSession.guest?.displayName || 'Awaiting Challenger...'}</div>
        </div>
      )}

      {errorMessage && (
        <div className="w-full px-4 py-2 bg-rose-950/50 border-x border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Dual Radar Matrix */}
      <div className="relative w-full p-4 bg-[#0A0A16] border-x border-b border-purple-500/20 rounded-b-xl flex flex-col md:flex-row gap-6 items-center justify-around shadow-2xl">
        {/* Target Fleet */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-pink-400 mb-2 flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5" />
            <span>ENEMY FLEET SECTOR</span>
          </div>
          <div className="grid grid-cols-6 gap-1 bg-black/60 p-2 rounded-xl border border-pink-500/20">
            {(currentTurn === 'p1' ? p2Grid : p1Grid).map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`target-${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={cell.hit || (isMultiplayer && !isMyTurn)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded flex items-center justify-center font-bold text-xs transition ${
                    cell.hit
                      ? cell.hasShip
                        ? 'bg-rose-600 border border-rose-400 text-white shadow-md shadow-rose-600/40'
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

        {/* Friendly Fleet */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-cyan-400 mb-2">YOUR BATTLESHIP DISPOSITION</div>
          <div className="grid grid-cols-6 gap-1 bg-black/60 p-2 rounded-xl border border-cyan-500/20">
            {(currentTurn === 'p1' ? p1Grid : p2Grid).map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`friendly-${r}-${c}`}
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

        {winner && (
          <div className="absolute inset-0 rounded-b-xl bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black mb-1">
              {winner === 'p1' ? 'COMMANDER 1 VICTORIOUS!' : 'COMMANDER 2 VICTORIOUS!'}
            </h2>
            <p className="text-xs text-white/70 mb-4">All hostile naval combatants eradicated.</p>
            <button
              onClick={restartLocal}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
