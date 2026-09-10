import React from 'react';
import { Gauge, Info, CheckCircle2 } from 'lucide-react';
import { BuildBalanceScore } from '../../types/pcBuilder';

interface BalanceScoreGaugeProps {
  balanceScore: BuildBalanceScore;
}

export const BalanceScoreGauge: React.FC<BalanceScoreGaugeProps> = ({ balanceScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
    if (score >= 80) return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/40';
    if (score >= 70) return 'text-purple-400 border-purple-500/50 bg-purple-950/40';
    return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/10 shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400">
              Hardware Harmony Analysis
            </div>
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
              Game Vault Forum Estimated Balance Score
            </h3>
          </div>
        </div>

        {/* Score pill */}
        <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${getScoreColor(balanceScore.score)}`}>
          <span className="text-2xl font-black font-['Space_Grotesk']">{balanceScore.score}</span>
          <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${balanceScore.score}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1.5">
          <span>Bottlenecked</span>
          <span className="text-white font-bold">{balanceScore.rating}</span>
          <span>Optimally Synced</span>
        </div>
      </div>

      {/* Rationale Notes */}
      <div className="space-y-1.5 pt-2 border-t border-white/5">
        {balanceScore.notes.map((note, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-['Inter']">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span>{note}</span>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 font-['Inter'] italic pt-1">
          *Calculated via CPU IPC, GPU compute tier ratio, memory latency and power headroom.
        </p>
      </div>
    </div>
  );
};
