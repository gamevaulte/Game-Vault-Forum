import React, { useState } from 'react';
import { RotateCcw, Coins, Trophy, ShieldCheck } from 'lucide-react';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  val: string;
  num: number;
}

export const BlackjackGame: React.FC = () => {
  const [chips, setChips] = useState(500);
  const [bet, setBet] = useState(25);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer_turn' | 'p_won' | 'd_won' | 'push' | 'blackjack'>('betting');

  const createDeck = (): Card[] => {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
    const ranks = [
      { v: 'A', n: 11 }, { v: '2', n: 2 }, { v: '3', n: 3 }, { v: '4', n: 4 },
      { v: '5', n: 5 }, { v: '6', n: 6 }, { v: '7', n: 7 }, { v: '8', n: 8 },
      { v: '9', n: 9 }, { v: '10', n: 10 }, { v: 'J', n: 10 }, { v: 'Q', n: 10 }, { v: 'K', n: 10 }
    ];

    const deck: Card[] = [];
    suits.forEach((s) => {
      ranks.forEach((r) => {
        deck.push({ suit: s, val: r.v, num: r.n });
      });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const [deck, setDeck] = useState<Card[]>(() => createDeck());

  const calculateScore = (hand: Card[]): number => {
    let score = hand.reduce((acc, c) => acc + c.num, 0);
    let aces = hand.filter((c) => c.val === 'A').length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  const dealCards = () => {
    if (chips < bet) return;
    setChips((c) => c - bet);

    let curDeck = [...deck];
    if (curDeck.length < 15) {
      curDeck = createDeck();
    }

    const p1 = curDeck.pop()!;
    const d1 = curDeck.pop()!;
    const p2 = curDeck.pop()!;
    const d2 = curDeck.pop()!;

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setDeck(curDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);

    const pScore = calculateScore(pHand);
    const dScore = calculateScore(dHand);

    if (pScore === 21) {
      if (dScore === 21) {
        setGameState('push');
        setChips((c) => c + bet);
      } else {
        setGameState('blackjack');
        setChips((c) => c + Math.floor(bet * 2.5));
      }
    } else {
      setGameState('playing');
    }
  };

  const hit = () => {
    if (gameState !== 'playing') return;
    const curDeck = [...deck];
    const nextCard = curDeck.pop()!;
    const nextHand = [...playerHand, nextCard];
    setDeck(curDeck);
    setPlayerHand(nextHand);

    const score = calculateScore(nextHand);
    if (score > 21) {
      setGameState('d_won'); // Busted
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;
    setGameState('dealer_turn');

    let curDeck = [...deck];
    let curDealer = [...dealerHand];

    const runDealer = () => {
      let dScore = calculateScore(curDealer);
      while (dScore < 17) {
        const nextCard = curDeck.pop()!;
        curDealer.push(nextCard);
        dScore = calculateScore(curDealer);
      }

      setDeck(curDeck);
      setDealerHand(curDealer);

      const pScore = calculateScore(playerHand);
      if (dScore > 21) {
        setGameState('p_won');
        setChips((c) => c + bet * 2);
      } else if (pScore > dScore) {
        setGameState('p_won');
        setChips((c) => c + bet * 2);
      } else if (pScore < dScore) {
        setGameState('d_won');
      } else {
        setGameState('push');
        setChips((c) => c + bet);
      }
    };

    setTimeout(runDealer, 400);
  };

  const pScore = calculateScore(playerHand);
  const dScore = calculateScore(dealerHand);
  const isRedSuit = (s: string) => s === '♥' || s === '♦';

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[560px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
          <Coins className="w-4 h-4" />
          <span>{chips} Credits</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/40 text-[10px]">CURRENT WAGER</span>
          <span className="font-mono text-purple-300 font-bold">${bet}</span>
        </div>

        <button
          onClick={() => {
            setGameState('betting');
            setPlayerHand([]);
            setDealerHand([]);
          }}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Hand</span>
        </button>
      </div>

      {/* Casino Table Felt */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#063b27] to-[#04281a] border-x border-b border-purple-500/20 rounded-b-xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        {/* Dealer Area */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            DEALER {gameState !== 'playing' && gameState !== 'betting' && `(${dScore})`}
          </div>
          <div className="flex gap-2.5 min-h-[90px]">
            {dealerHand.map((card, idx) => {
              const hideHoleCard = idx === 1 && gameState === 'playing';
              return (
                <div
                  key={idx}
                  className={`w-14 sm:w-16 h-20 sm:h-24 rounded-lg flex flex-col justify-between p-1.5 sm:p-2 border shadow-lg ${
                    hideHoleCard
                      ? 'bg-purple-900 border-purple-600 flex items-center justify-center text-purple-300 font-bold text-xs'
                      : `bg-white border-slate-300 ${isRedSuit(card.suit) ? 'text-rose-600' : 'text-slate-900'}`
                  }`}
                >
                  {hideHoleCard ? (
                    <span>VAULT</span>
                  ) : (
                    <>
                      <div className="font-bold text-sm leading-none">{card.val}</div>
                      <div className="text-2xl self-center leading-none">{card.suit}</div>
                      <div className="font-bold text-sm leading-none self-end">{card.val}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Result Notifications */}
        {gameState !== 'betting' && gameState !== 'playing' && gameState !== 'dealer_turn' && (
          <div className="self-center px-6 py-2 rounded-xl bg-black/80 border border-white/20 text-center text-sm font-bold shadow-2xl">
            {gameState === 'blackjack' && <span className="text-amber-400">★ NATURAL BLACKJACK! 3:2 PAYOUT ★</span>}
            {gameState === 'p_won' && <span className="text-emerald-400">YOU WIN! +${bet * 2}</span>}
            {gameState === 'd_won' && (
              <span className="text-rose-400">{pScore > 21 ? 'BUSTED OVER 21!' : 'DEALER WINS'}</span>
            )}
            {gameState === 'push' && <span className="text-cyan-400">PUSH / TIE - BET RETURNED</span>}
          </div>
        )}

        {/* Player Area */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex gap-2.5 min-h-[90px]">
            {playerHand.map((card, idx) => (
              <div
                key={idx}
                className={`w-14 sm:w-16 h-20 sm:h-24 rounded-lg bg-white border border-slate-300 shadow-lg flex flex-col justify-between p-1.5 sm:p-2 ${
                  isRedSuit(card.suit) ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                <div className="font-bold text-sm leading-none">{card.val}</div>
                <div className="text-2xl self-center leading-none">{card.suit}</div>
                <div className="font-bold text-sm leading-none self-end">{card.val}</div>
              </div>
            ))}
          </div>
          <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            YOUR HAND {playerHand.length > 0 && `(${pScore})`}
          </div>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="w-full p-4 bg-black/70 border border-purple-500/20 rounded-b-xl flex items-center justify-between gap-3">
        {gameState === 'betting' || gameState === 'p_won' || gameState === 'd_won' || gameState === 'push' || gameState === 'blackjack' ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {[10, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => setBet(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    bet === val
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/40'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <button
              onClick={dealCards}
              disabled={chips < bet}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition disabled:opacity-40"
            >
              Deal Hand
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-4">
            <button
              onClick={hit}
              disabled={gameState !== 'playing'}
              className="flex-1 max-w-[160px] py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition"
            >
              Hit (+ Card)
            </button>
            <button
              onClick={stand}
              disabled={gameState !== 'playing'}
              className="flex-1 max-w-[160px] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition"
            >
              Stand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
