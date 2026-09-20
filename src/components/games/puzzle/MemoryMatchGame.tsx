import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Clock, Sparkles } from 'lucide-react';

interface CardItem {
  id: number;
  icon: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS = [
  { icon: '⚔️', label: 'Blades' },
  { icon: '🛡️', label: 'Shield' },
  { icon: '🎮', label: 'Gamepad' },
  { icon: '⚡', label: 'Lightning' },
  { icon: '💎', label: 'Diamond' },
  { icon: '👑', label: 'Crown' },
  { icon: '🚀', label: 'Rocket' },
  { icon: '🎯', label: 'Target' }
];

export const MemoryMatchGame: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [bestMoves, setBestMoves] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gv_memory_best_moves') || '0', 10);
    } catch {
      return 0;
    }
  });

  const initGame = () => {
    const deck: CardItem[] = [];
    let id = 0;
    SYMBOLS.forEach((sym) => {
      // Add two of each
      deck.push({ id: id++, icon: sym.icon, label: sym.label, flipped: false, matched: false });
      deck.push({ id: id++, icon: sym.icon, label: sym.label, flipped: false, matched: false });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setTimer(0);
    setIsActive(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && matchedPairs < SYMBOLS.length) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, matchedPairs]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (cards[index].flipped || cards[index].matched) return;

    if (!isActive) setIsActive(true);

    const nextCards = [...cards];
    nextCards[index].flipped = true;
    setCards(nextCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const first = nextCards[firstIdx];
      const second = nextCards[secondIdx];

      if (first.icon === second.icon) {
        // Match!
        setTimeout(() => {
          nextCards[firstIdx].matched = true;
          nextCards[secondIdx].matched = true;
          setCards([...nextCards]);
          setFlippedIndices([]);
          setMatchedPairs((p) => {
            const nextP = p + 1;
            if (nextP === SYMBOLS.length) {
              const currentMoves = moves + 1;
              if (bestMoves === 0 || currentMoves < bestMoves) {
                setBestMoves(currentMoves);
                try {
                  localStorage.setItem('gv_memory_best_moves', currentMoves.toString());
                } catch {}
              }
            }
            return nextP;
          });
        }, 400);
      } else {
        // No match -> flip back
        setTimeout(() => {
          nextCards[firstIdx].flipped = false;
          nextCards[secondIdx].flipped = false;
          setCards([...nextCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const isComplete = matchedPairs === SYMBOLS.length;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[460px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-white/50 text-[10px] block">MOVES</span>
            <span className="text-base font-bold font-mono text-purple-300">{moves}</span>
          </div>
          <div>
            <span className="text-white/50 text-[10px] block">MATCHES</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {matchedPairs} / {SYMBOLS.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{timer}s</span>
          </div>
          {bestMoves > 0 && (
            <div className="flex items-center gap-1 text-amber-400 font-mono text-xs">
              <Trophy className="w-3.5 h-3.5" />
              <span>{bestMoves} Best</span>
            </div>
          )}
          <button
            onClick={initGame}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
            title="Shuffle & Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4x4 Card Matrix Grid */}
      <div className="relative w-full p-4 bg-[#0A0A12] border-x border-b border-purple-500/20 rounded-b-xl shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5">
          {cards.map((card, idx) => {
            const isShown = card.flipped || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 transform ${
                  isShown
                    ? card.matched
                      ? 'bg-emerald-950/60 border border-emerald-500/50 scale-95 shadow-md shadow-emerald-500/20'
                      : 'bg-purple-900/60 border border-purple-500/60 shadow-lg shadow-purple-500/30 rotate-y-180'
                    : 'bg-[#151522] hover:bg-[#1E1E30] border border-white/10 hover:border-purple-500/40'
                }`}
              >
                {isShown ? card.icon : '❖'}
              </button>
            );
          })}
        </div>

        {/* Victory Celebration */}
        {isComplete && (
          <div className="absolute inset-0 rounded-b-xl bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <Sparkles className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 mb-1">
              MATRIX SYNCHRONIZED!
            </h3>
            <p className="text-xs text-white/70 mb-4">
              All 8 holographic pairs matched in {moves} moves and {timer} seconds.
            </p>
            <button
              onClick={initGame}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
