import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Tv, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  Zap,
  Flame,
  Info
} from 'lucide-react';
import { PcGameRequirements } from '../../types/pcRequirements';

interface RequirementsDisplayCardsProps {
  game: PcGameRequirements;
}

export const RequirementsDisplayCards: React.FC<RequirementsDisplayCardsProps> = ({ game }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header with Source & Verification Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-['Space_Grotesk'] font-medium">
            Requirements Source:{' '}
            <strong className="text-white font-semibold">{game.source}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>
            Last verified: <strong className="text-gray-200">{game.lastVerified}</strong>
          </span>
        </div>
      </div>

      {/* Side-by-Side Cards on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MINIMUM REQUIREMENTS CARD */}
        <div className="bg-gradient-to-b from-[#141624] to-[#0c0d17] border border-cyan-500/30 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl shadow-black/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wider">
                  Minimum Requirements
                </h4>
                <span className="text-xs text-gray-400 font-['Space_Grotesk']">
                  Baseline to launch and play
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider">
              Target: 720p - 1080p Low
            </span>
          </div>

          <div className="space-y-4">
            {/* Operating System */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Layers className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Operating System
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {game.minimum.os}
                </div>
              </div>
            </div>

            {/* CPU */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Processor / CPU
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {game.minimum.cpu}
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <HardDrive className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Memory / RAM
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  <span className="text-cyan-300 font-bold font-['Rajdhani'] text-base">
                    {game.minimum.ramGb} GB
                  </span>{' '}
                  system memory
                </div>
              </div>
            </div>

            {/* GPU & VRAM */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Tv className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Graphics / GPU & VRAM
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {game.minimum.gpu}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Minimum Video Memory: <strong className="text-cyan-300">{game.minimum.vramGb} GB VRAM</strong>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <HardDrive className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                    Free Storage Space
                  </div>
                  {game.minimum.storageType && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {game.minimum.storageType}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  <span className="text-cyan-300 font-bold font-['Rajdhani'] text-base">
                    {game.minimum.storageGb} GB
                  </span>{' '}
                  available hard drive or SSD space
                </div>
              </div>
            </div>

            {/* DirectX & Notes */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 space-y-1">
              <div>
                DirectX Version: <strong className="text-gray-200">{game.minimum.directX}</strong>
              </div>
              {game.minimum.additionalNotes && (
                <div className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{game.minimum.additionalNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECOMMENDED REQUIREMENTS CARD */}
        <div className="bg-gradient-to-b from-[#18152e] to-[#0d0a1c] border border-purple-500/40 rounded-2xl p-6 sm:p-7 relative overflow-hidden shadow-xl shadow-black/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wider">
                  Recommended Requirements
                </h4>
                <span className="text-xs text-gray-400 font-['Space_Grotesk']">
                  Optimal 60+ FPS experience
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider">
              Target: 1080p High 60+ FPS
            </span>
          </div>

          <div className="space-y-4">
            {/* Operating System */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Layers className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Operating System
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {game.recommended.os}
                </div>
              </div>
            </div>

            {/* CPU */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Cpu className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Processor / CPU
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {game.recommended.cpu}
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <HardDrive className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Memory / RAM
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  <span className="text-purple-300 font-bold font-['Rajdhani'] text-base">
                    {game.recommended.ramGb} GB
                  </span>{' '}
                  dual-channel RAM recommended
                </div>
              </div>
            </div>

            {/* GPU & VRAM */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <Tv className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                  Graphics / GPU & VRAM
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {game.recommended.gpu}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Recommended Video Memory: <strong className="text-purple-300">{game.recommended.vramGb} GB VRAM</strong>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <HardDrive className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider font-['Space_Grotesk']">
                    Free Storage Space
                  </div>
                  {game.recommended.storageType && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {game.recommended.storageType}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  <span className="text-purple-300 font-bold font-['Rajdhani'] text-base">
                    {game.recommended.storageGb} GB
                  </span>{' '}
                  fast solid-state drive (SSD)
                </div>
              </div>
            </div>

            {/* DirectX & Notes */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400 space-y-1">
              <div>
                DirectX Version: <strong className="text-gray-200">{game.recommended.directX}</strong>
              </div>
              {game.recommended.additionalNotes && (
                <div className="text-[11px] text-gray-400 italic pt-1 border-t border-white/5 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{game.recommended.additionalNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
