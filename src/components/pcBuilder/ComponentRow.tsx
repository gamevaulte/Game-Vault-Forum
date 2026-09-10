import React from 'react';
import { ExternalLink, CheckCircle2, Cpu, HardDrive, Zap, Wind, Box, Radio } from 'lucide-react';
import { PcComponent, CurrencyCode } from '../../types/pcBuilder';
import { formatPrice } from '../../lib/pcBuilderEngine';

interface ComponentRowProps {
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  component: PcComponent;
  currency: CurrencyCode;
  onReplace?: () => void;
}

export const ComponentRow: React.FC<ComponentRowProps> = ({
  categoryLabel,
  categoryIcon,
  component,
  currency
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#111322] border border-[#222642] hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
          {categoryIcon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/40">
              {categoryLabel}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {component.manufacturer}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors truncate">
            {component.model}
          </h4>

          <p className="text-xs text-slate-400 font-['Inter'] mt-0.5 line-clamp-1">
            {component.specifications}
          </p>

          {component.whySelected && (
            <p className="text-[11px] text-cyan-300/90 font-['Inter'] mt-1 italic flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
              <span>Why selected: {component.whySelected}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right: Price & Retailer Button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
        <div className="text-left sm:text-right">
          <div className="text-base sm:text-lg font-bold font-mono text-purple-300">
            {formatPrice(component.priceUsd, currency)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {component.retailer}
          </div>
        </div>

        <a
          href={component.productUrl || `https://www.google.com/search?q=${encodeURIComponent(component.manufacturer + ' ' + component.model + ' buy')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Check Price</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
