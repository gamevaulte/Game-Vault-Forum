import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { CompatibilityCheckResult } from '../../types/pcBuilder';

interface CompatibilityBadgeProps {
  compatibility: CompatibilityCheckResult;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({ compatibility }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
      compatibility.isCompatible
        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
        : 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/30'
    }`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${
            compatibility.isCompatible
              ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-400'
              : 'bg-rose-900/50 border-rose-500/50 text-rose-400'
          }`}>
            {compatibility.isCompatible ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                {compatibility.isCompatible ? 'Build Fully Compatible' : 'Compatibility Issue Detected'}
              </h3>
              <span className={`text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                compatibility.isCompatible
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {compatibility.isCompatible ? 'Verified' : 'Action Required'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-['Inter'] mt-0.5">
              {compatibility.isCompatible
                ? 'All sockets, memory standards, clearances, and power delivery requirements pass validation.'
                : 'One or more physical or architectural mismatches need resolution.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Diagnostics' : `View 10-Point Check (${compatibility.passedChecks.length} Passed)`}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Diagnostics Checklist */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          {compatibility.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider text-rose-400">
                Issues Requiring Attention
              </h4>
              {compatibility.issues.map((issue, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs font-['Inter'] space-y-1">
                  <div className="font-bold text-rose-200">{issue.title}</div>
                  <div className="text-rose-300/90">{issue.description}</div>
                  <div className="text-slate-300 mt-1 font-mono text-[11px]">Resolution: {issue.resolution}</div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider text-emerald-400">
              Verified Hardware Checks
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {compatibility.passedChecks.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-black/30 px-3 py-2 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
