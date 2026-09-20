import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles, Trophy } from 'lucide-react';

interface Card {
  id: string;
  suit: '♠' | '♥' | '♦' | '♣';
  val: string;
  num: number;
  faceUp: boolean;
}

export const SolitaireGame: React.FC = () => {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], []]); // 5 columns for responsive layout
  const [moves, setMoves] = useState(0);
  const [selectedCard, setSelectedCard] = useState<{ source: string; card: Card; colIdx?: number } | null>(null);

  const initGame = () => {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
    const ranks = [
      { v: 'A', n: 1 }, { v: '2', n: 2 }, { v: '3', n: 3 }, { v: '4', n: 4 },
      { v: '5', n: 5 }, { v: '6', n: 6 }, { v: '7', n: 7 }, { v: '8', n: 8 },
      { v: '9', n: 9 }, { v: '10', n: 10 }, { v: 'J', n: 11 }, { v: 'Q', n: 12 }, { v: 'K', n: 13 }
    ];

    const deck: Card[] = [];
    suits.forEach((s) => {
      ranks.forEach((r) => {
        deck.push({ id: `${s}-${r.v}`, suit: s, val: r.v, num: r.n, faceUp: false });
      });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal to 5 columns
    const cols: Card[][] = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j <= i; j++) {
        const c = deck.pop()!;
        if (j === i) c.faceUp = true;
        cols[i].push(c);
      }
    }

    setTableau(cols);
    setFoundations([[], [], [], []]);
    setWaste([]);
    setStock(deck);
    setMoves(0);
    setSelectedCard(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  const drawFromStock = () => {
    if (stock.length === 0) {
      // Recycle waste back to stock
      const recycled = [...waste].reverse().map((c) => ({ ...c, faceUp: false }));
      setStock(recycled);
      setWaste([]);
      return;
    }

    const curStock = [...stock];
    const drawn = curStock.pop()!;
    drawn.faceUp = true;
    setStock(curStock);
    setWaste((w) => [...w, drawn]);
    setMoves((m) => m + 1);
    setSelectedCard(null);
  };

  const isRed = (s: string) => s === '♥' || s === '♦';

  const handleWasteClick = () => {
    if (waste.length === 0) return;
    const top = waste[waste.length - 1];
    setSelectedCard({ source: 'waste', card: top });
  };

  const handleFoundationClick = (fIdx: number) => {
    if (!selectedCard) return;
    const fPile = foundations[fIdx];
    const topF = fPile[fPile.length - 1];
    const c = selectedCard.card;

    // Must be Ace if empty, or same suit and num + 1
    const canPlace =
      (!topF && c.num === 1) || (topF && topF.suit === c.suit && c.num === topF.num + 1);

    if (canPlace) {
      // Move to foundation
      const nextFoundations = foundations.map((f, i) => (i === fIdx ? [...f, c] : [...f]));
      setFoundations(nextFoundations);
      removeCardFromSource(selectedCard);
      setSelectedCard(null);
      setMoves((m) => m + 1);
    }
  };

  const handleTableauClick = (colIdx: number) => {
    const col = tableau[colIdx];
    const top = col[col.length - 1];

    if (!selectedCard) {
      if (top && top.faceUp) {
        setSelectedCard({ source: 'tableau', card: top, colIdx });
      }
      return;
    }

    const c = selectedCard.card;
    // Standard Solitaire tableau rule: descending order & alternating colors
    const canPlace =
      (!top && c.num === 13) ||
      (top && top.faceUp && top.num === c.num + 1 && isRed(top.suit) !== isRed(c.suit));

    if (canPlace) {
      const nextTableau = tableau.map((cl, i) => (i === colIdx ? [...cl, c] : [...cl]));
      setTableau(nextTableau);
      removeCardFromSource(selectedCard);
      setSelectedCard(null);
      setMoves((m) => m + 1);
    }
  };

  const removeCardFromSource = (sel: typeof selectedCard) => {
    if (!sel) return;
    if (sel.source === 'waste') {
      setWaste((w) => w.slice(0, w.length - 1));
    } else if (sel.source === 'tableau' && sel.colIdx !== undefined) {
      setTableau((prev) => {
        const next = prev.map((col, idx) => {
          if (idx === sel.colIdx) {
            const copy = [...col];
            copy.pop();
            // Reveal top card if hidden
            if (copy.length > 0 && !copy[copy.length - 1].faceUp) {
              copy[copy.length - 1].faceUp = true;
            }
            return copy;
          }
          return col;
        });
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[560px] mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between p-3 rounded-t-xl bg-black/70 border border-purple-500/20 text-xs text-white">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-[10px]">MOVES</span>
          <span className="font-mono text-purple-300 font-bold">{moves}</span>
        </div>

        <button
          onClick={initGame}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* Table Green Felt */}
      <div className="relative w-full p-4 bg-gradient-to-b from-[#063020] to-[#041F14] border-x border-b border-purple-500/20 rounded-b-xl shadow-2xl space-y-4">
        {/* Top Decks (Stock, Waste & 4 Foundations) */}
        <div className="flex justify-between items-center gap-2">
          {/* Stock & Waste */}
          <div className="flex gap-2">
            <button
              onClick={drawFromStock}
              className="w-12 sm:w-14 h-16 sm:h-20 rounded-lg bg-purple-900/80 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xs shadow-md"
            >
              {stock.length > 0 ? stock.length : '↺'}
            </button>

            <button
              onClick={handleWasteClick}
              className={`w-12 sm:w-14 h-16 sm:h-20 rounded-lg border flex flex-col justify-between p-1 text-xs shadow-md ${
                waste.length > 0
                  ? selectedCard?.card.id === waste[waste.length - 1].id
                    ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-400'
                    : 'bg-white border-slate-300'
                  : 'bg-black/30 border-white/10'
              } ${isRed(waste[waste.length - 1]?.suit || '') ? 'text-rose-600' : 'text-slate-900'}`}
            >
              {waste.length > 0 ? (
                <>
                  <div className="font-bold text-[10px] leading-none">{waste[waste.length - 1].val}</div>
                  <div className="text-base self-center leading-none">{waste[waste.length - 1].suit}</div>
                  <div className="font-bold text-[10px] leading-none self-end">{waste[waste.length - 1].val}</div>
                </>
              ) : null}
            </button>
          </div>

          {/* 4 Foundations */}
          <div className="flex gap-1.5 sm:gap-2">
            {foundations.map((f, i) => {
              const top = f[f.length - 1];
              return (
                <button
                  key={i}
                  onClick={() => handleFoundationClick(i)}
                  className={`w-12 sm:w-14 h-16 sm:h-20 rounded-lg border flex flex-col justify-between p-1 text-xs shadow-md ${
                    top ? 'bg-white border-slate-300' : 'bg-black/30 border-white/10 text-white/30'
                  } ${top && isRed(top.suit) ? 'text-rose-600' : 'text-slate-900'}`}
                >
                  {top ? (
                    <>
                      <div className="font-bold text-[10px] leading-none">{top.val}</div>
                      <div className="text-base self-center leading-none">{top.suit}</div>
                      <div className="font-bold text-[10px] leading-none self-end">{top.val}</div>
                    </>
                  ) : (
                    <span className="m-auto text-sm">♠♥</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tableau Columns */}
        <div className="grid grid-cols-5 gap-2 min-h-[220px]">
          {tableau.map((col, colIdx) => (
            <div
              key={colIdx}
              onClick={() => handleTableauClick(colIdx)}
              className="flex flex-col items-center gap-1 min-h-[180px] rounded-lg bg-black/20 p-1 border border-white/5 cursor-pointer"
            >
              {col.map((card, cardIdx) => {
                const isSelected = selectedCard?.card.id === card.id;
                return (
                  <div
                    key={card.id}
                    className={`w-full h-14 sm:h-16 rounded-md border flex flex-col justify-between p-1 text-xs shadow-md transition ${
                      card.faceUp
                        ? isSelected
                          ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-400'
                          : 'bg-white border-slate-300'
                        : 'bg-purple-950 border-purple-700/50'
                    } ${isRed(card.suit) ? 'text-rose-600' : 'text-slate-900'}`}
                  >
                    {card.faceUp && (
                      <>
                        <div className="font-bold text-[10px] leading-none">{card.val}</div>
                        <div className="text-sm self-center leading-none">{card.suit}</div>
                        <div className="font-bold text-[10px] leading-none self-end">{card.val}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
