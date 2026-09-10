import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Cpu, 
  HardDrive, 
  Tv, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Video,
  FileText,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { CheckerResult, PcGameRequirements, UserPcSpec } from '../../types/pcRequirements';
import { generateShareLinks } from '../../lib/pcRequirementsChecker';

interface ComparisonResultsViewProps {
  result: CheckerResult;
  game: PcGameRequirements;
  userPc: UserPcSpec;
  onResetSpecs?: () => void;
  onSelectAnotherGame?: () => void;
  onOpenVideo?: (gameTitle: string) => void;
  onOpenArticle?: (gameTitle: string) => void;
  onOpenForum?: (gameTitle: string) => void;
}

export const ComparisonResultsView: React.FC<ComparisonResultsViewProps> = ({
  result,
  game,
  userPc,
  onResetSpecs,
  onSelectAnotherGame,
  onOpenVideo,
  onOpenArticle,
  onOpenForum
}) => {
  const [copied, setCopied] = useState(false);
  const shareLinks = generateShareLinks(game.title, result);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareLinks.shareText} ${shareLinks.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Badge background & color determination
  const isPass = result.verdictStatus === 'YES';
  const isPartial = result.verdictStatus === 'PARTIALLY';
  const isFail = result.verdictStatus === 'NO';

  const badgeBg = isPass
    ? 'from-emerald-950/80 via-emerald-900/40 to-black/60 border-emerald-500/50 text-emerald-300'
    : isPartial
    ? 'from-amber-950/80 via-amber-900/40 to-black/60 border-amber-500/50 text-amber-300'
    : 'from-rose-950/80 via-rose-900/40 to-black/60 border-rose-500/50 text-rose-300';

  const statusIcon = isPass ? (
    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
  ) : isPartial ? (
    <AlertTriangle className="w-10 h-10 text-amber-400" />
  ) : (
    <XCircle className="w-10 h-10 text-rose-400" />
  );

  return (
    <div id="checker-results" className="w-full space-y-8 scroll-mt-24">
      {/* 1. OVERALL STATUS BANNER */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 bg-gradient-to-br ${badgeBg} shadow-2xl backdrop-blur-xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 shrink-0">
              {statusIcon}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-widest mb-2">
                <span>{result.summaryBadge}</span>
              </div>
              <h3 className="font-['Rajdhani'] font-bold text-2xl sm:text-3xl text-white tracking-wide uppercase">
                {result.verdictTitle}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                {result.summaryExplanation}
              </p>
            </div>
          </div>

          {/* Quick game thumbnail & title */}
          <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-3 shrink-0 self-start md:self-auto">
            <img
              src={game.coverImage}
              alt={game.title}
              className="w-14 h-14 rounded-lg object-cover border border-purple-400/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-['Space_Grotesk'] font-bold">
                Tested Game
              </div>
              <div className="font-['Rajdhani'] font-bold text-white text-lg">
                {game.title}
              </div>
              <div className="text-xs text-purple-300 font-medium">
                {game.developer}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY COMPARISON TABLE */}
      <div className="bg-[#121422]/90 border border-purple-500/20 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Specifications Comparison Table</span>
          </h4>
          <span className="text-xs text-gray-400 font-['Space_Grotesk']">
            Your PC vs. Official Published Requirements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider font-['Space_Grotesk'] text-gray-400">
                <th className="py-3 px-3">Component</th>
                <th className="py-3 px-3">Your PC Spec</th>
                <th className="py-3 px-3">Minimum Required</th>
                <th className="py-3 px-3">Recommended</th>
                <th className="py-3 px-3 text-right">Compatibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {result.comparisons.map((row) => {
                const verdictClass =
                  row.verdict === 'meets'
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40'
                    : row.verdict === 'below-rec'
                    ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
                    : 'text-rose-400 bg-rose-950/40 border-rose-500/40';

                const verdictLabel =
                  row.verdict === 'meets'
                    ? 'Meets / Exceeds'
                    : row.verdict === 'below-rec'
                    ? 'Below Rec'
                    : 'Below Minimum';

                return (
                  <tr key={row.component} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-bold font-['Rajdhani'] text-white">
                      {row.component}
                    </td>
                    <td className="py-3.5 px-3 text-cyan-300 font-medium">
                      {row.userValue}
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 max-w-xs">
                      {row.minimum}
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 max-w-xs">
                      {row.recommended}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider border ${verdictClass}`}>
                        {row.verdict === 'meets' && <Check className="w-3 h-3" />}
                        {row.verdict === 'below-rec' && <AlertTriangle className="w-3 h-3" />}
                        {row.verdict === 'below-min' && <XCircle className="w-3 h-3" />}
                        <span>{verdictLabel}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. COMPONENT-BY-COMPONENT IN-DEPTH ANALYSIS */}
      <div className="space-y-4">
        <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span>In-Depth Component Analysis</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.comparisons.map((c) => {
            const isOk = c.verdict === 'meets';
            const isWarn = c.verdict === 'below-rec';
            const isBad = c.verdict === 'below-min';

            const cardBorder = isOk
              ? 'border-emerald-500/30 bg-emerald-950/10'
              : isWarn
              ? 'border-amber-500/30 bg-amber-950/10'
              : 'border-rose-500/30 bg-rose-950/10';

            return (
              <div
                key={c.component}
                className={`p-5 rounded-2xl border ${cardBorder} backdrop-blur-md space-y-3 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Rajdhani'] font-bold text-lg text-white uppercase tracking-wide flex items-center gap-2">
                    {c.component === 'CPU' && <Cpu className="w-4 h-4 text-cyan-400" />}
                    {c.component === 'GPU' && <Tv className="w-4 h-4 text-purple-400" />}
                    {c.component === 'RAM' && <HardDrive className="w-4 h-4 text-emerald-400" />}
                    {c.component === 'VRAM' && <Tv className="w-4 h-4 text-pink-400" />}
                    {c.component === 'Storage' && <HardDrive className="w-4 h-4 text-indigo-400" />}
                    {c.component === 'OS' && <Layers className="w-4 h-4 text-yellow-400" />}
                    <span>{c.component} Verdict</span>
                  </span>

                  <span
                    className={`text-xs font-['Rajdhani'] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isOk
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isWarn
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {isOk ? 'Compatible' : isWarn ? 'Below Recommended' : 'Below Minimum'}
                  </span>
                </div>

                <div className="text-xs text-gray-300">
                  <span className="text-gray-400">Your Spec:</span>{' '}
                  <strong className="text-white">{c.userValue}</strong>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                  {c.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. GRAPHICS SETTINGS GUIDANCE & ESTIMATES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suggested Starting Settings */}
        <div className="bg-[#121422]/90 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wide">
              Suggested Starting Settings
            </h4>
          </div>

          <div className="space-y-3 mb-4 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-xs uppercase font-['Space_Grotesk'] font-semibold">
                Target Resolution:
              </span>
              <span className="text-white font-bold font-['Rajdhani'] text-base">
                {result.graphicsGuidance.resolution}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-xs uppercase font-['Space_Grotesk'] font-semibold">
                Graphics Preset:
              </span>
              <span className="text-cyan-300 font-bold font-['Rajdhani'] text-base">
                {result.graphicsGuidance.preset}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-xs uppercase font-['Space_Grotesk'] font-semibold">
                Ray Tracing:
              </span>
              <span className="text-purple-300 font-bold font-['Rajdhani'] text-sm">
                {result.graphicsGuidance.rayTracing}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-gray-400 text-xs uppercase font-['Space_Grotesk'] font-semibold">
                Upscaling / Resolution Scaling:
              </span>
              <span className="text-emerald-300 font-bold font-['Rajdhani'] text-sm">
                {result.graphicsGuidance.upscaling}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 italic bg-white/[0.02] p-3 rounded-xl border border-white/5 leading-relaxed">
            {result.graphicsGuidance.disclaimer}
          </p>
        </div>

        {/* Real-world FPS Guidance & Hardware Notice */}
        <div className="bg-[#121422]/90 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wide">
                FPS Notice & Thermal Factoring
              </h4>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed mb-4">
              <p className="font-semibold mb-2 text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Honest Benchmarking Disclosure</span>
              </p>
              {result.fpsNotice}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Tip from Game Vault Forum: To maximize frame stability, ensure your graphics drivers (NVIDIA GeForce Experience or AMD Adrenalin) are updated to the latest Game Ready releases and close memory-heavy browser tabs prior to launching.
            </p>
          </div>

          {/* Share My Result */}
          <div className="border-t border-white/10 pt-4">
            <div className="text-xs text-gray-300 font-bold uppercase font-['Space_Grotesk'] tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                Share My Result:
              </span>
              {copied && <span className="text-emerald-400 text-xs lowercase">copied to clipboard!</span>}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Summary</span>
              </button>

              <a
                href={shareLinks.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                WhatsApp
              </a>

              <a
                href={shareLinks.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                X / Twitter
              </a>

              <a
                href={shareLinks.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CONNECTED GAME VAULT FORUM CONTENT */}
      <div className="bg-gradient-to-r from-purple-950/40 via-[#121422] to-cyan-950/40 border border-purple-500/30 rounded-2xl p-6 sm:p-7 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h4 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wider">
              Explore More for {game.title}
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm">
              Watch gameplay analysis, read our reviews, or discuss hardware optimizations with fellow gamers on Game Vault Forum.
            </p>
          </div>
          <span className="text-xs text-purple-300 font-bold uppercase font-['Space_Grotesk'] tracking-widest">
            Game Vault Forum Hub
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onOpenVideo?.(game.title)}
            className="flex items-center gap-3 p-4 rounded-xl bg-black/40 hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-['Space_Grotesk'] uppercase font-bold">
                YouTube Media
              </div>
              <div className="font-['Rajdhani'] font-bold text-white text-base">
                Watch Gameplay Videos
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenArticle?.(game.title)}
            className="flex items-center gap-3 p-4 rounded-xl bg-black/40 hover:bg-cyan-900/20 border border-white/5 hover:border-cyan-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-['Space_Grotesk'] uppercase font-bold">
                Editorials & Guides
              </div>
              <div className="font-['Rajdhani'] font-bold text-white text-base">
                Read Deep Dive Reviews
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenForum?.(game.title)}
            className="flex items-center gap-3 p-4 rounded-xl bg-black/40 hover:bg-indigo-900/20 border border-white/5 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-['Space_Grotesk'] uppercase font-bold">
                Community Forum
              </div>
              <div className="font-['Rajdhani'] font-bold text-white text-base">
                Join Discussion Topic
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
