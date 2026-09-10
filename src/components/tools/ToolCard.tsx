import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ToolCardProps {
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
  actionText: string;
  onClick: () => void;
  featured?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  subtitle,
  description,
  badge,
  icon,
  actionText,
  onClick,
  featured = false
}) => {
  return (
    <div
      className={`group relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
        featured
          ? 'bg-gradient-to-b from-[#181b2e] to-[#101221] border-purple-500/40 shadow-xl shadow-purple-950/30'
          : 'bg-[#0f111e] border-white/10 hover:border-purple-500/30 hover:bg-[#131627]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:text-cyan-400 transition-all">
            {icon}
          </div>
          {badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 border border-purple-700/40">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{badge}</span>
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs font-semibold text-purple-400 mt-0.5 mb-2.5">
          {subtitle}
        </p>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-['Inter'] mb-6">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-lg shadow-purple-950/40 transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
      >
        <span>{actionText}</span>
        <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
