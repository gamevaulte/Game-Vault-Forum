import React from 'react';
import { ChevronRight, Home, ShieldCheck } from 'lucide-react';
import { PageTab } from '../../types';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ToolHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  badgeText?: string;
  icon?: React.ReactNode;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  badgeText = 'Game Vault Official Utility',
  icon
}) => {
  return (
    <div className="relative mb-8 pb-6 border-b border-white/10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 flex-wrap">
        <a 
          href="/" 
          onClick={(e) => {
            const first = breadcrumbs[0];
            if (first?.onClick) {
              e.preventDefault();
              first.onClick();
            }
          }}
          className="hover:text-white flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-purple-400" />
          <span>Game Vault</span>
        </a>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            {crumb.onClick ? (
              <button
                type="button"
                onClick={crumb.onClick}
                className="hover:text-purple-300 transition-colors cursor-pointer"
              >
                {crumb.label}
              </button>
            ) : crumb.href ? (
              <a href={crumb.href} className="hover:text-purple-300 transition-colors">
                {crumb.label}
              </a>
            ) : (
              <span className="text-purple-400 font-medium">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{badgeText}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Space_Grotesk'] text-white tracking-tight flex items-center gap-3">
            {icon && <span className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-400">{icon}</span>}
            <span>{title}</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-['Inter']">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
