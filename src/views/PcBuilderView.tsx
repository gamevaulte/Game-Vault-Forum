import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Cpu, 
  HardDrive, 
  Zap, 
  Wind, 
  Box, 
  Share2, 
  Bookmark, 
  Copy, 
  Check, 
  RotateCcw, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  Tv, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  Download,
  Info
} from 'lucide-react';
import { 
  PcBuilderPreferences, 
  SavedPcBuild, 
  CurrencyCode, 
  BudgetTier, 
  ResolutionTarget, 
  FpsTarget, 
  CpuBrandPreference, 
  GpuBrandPreference, 
  StoragePreference, 
  RamPreference, 
  WifiPreference, 
  RgbPreference, 
  PcComponent 
} from '../types/pcBuilder';
import { 
  BUDGET_RANGES, 
  CURRENCY_CONFIGS, 
  INITIAL_COMPONENTS 
} from '../data/pcComponentsData';
import { 
  buildRecommendedPc, 
  formatPrice 
} from '../lib/pcBuilderEngine';
import { ComponentRow } from '../components/pcBuilder/ComponentRow';
import { CompatibilityBadge } from '../components/pcBuilder/CompatibilityBadge';
import { BalanceScoreGauge } from '../components/pcBuilder/BalanceScoreGauge';
import { AdminComponentModal } from '../components/pcBuilder/AdminComponentModal';
import { ToolHeader } from '../components/tools/ToolHeader';
import { ToolFaq, FaqItem } from '../components/tools/ToolFaq';
import { MOCK_GAMES } from '../data/mockData';
import { UserAccount, PageTab } from '../types';

interface PcBuilderViewProps {
  currentUser?: UserAccount | null;
  initialBuildId?: string;
  onNavigateTab: (tab: PageTab) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info') => void;
  onShare?: (title: string, customPath?: string, description?: string) => void;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does the Game Vault PC Builder select components?',
    answer: 'Our algorithmic builder evaluates your target budget, selected games, resolution, and refresh rate targets. It calculates the necessary GPU compute tier, balances CPU single-core and multi-core throughput, verifies physical clearance and socket standards, and reserves 25-30% PSU headroom.'
  },
  {
    question: 'Are the prices updated in real time?',
    answer: 'Hardware prices represent estimated median street prices across major authorized retailers (Amazon, Newegg, Best Buy, B&H) and are verified regularly. Actual prices and instant sales fluctuate depending on retailer promotions and regional inventory.'
  },
  {
    question: 'How accurate is the 10-point compatibility checker?',
    answer: 'Our checker enforces strict architectural rules: motherboard sockets (AM4, AM5, LGA1700), RAM generation standards (DDR4 vs DDR5), physical GPU card lengths vs chassis clearances, CPU cooler heights vs case width, and power supply peak wattages.'
  },
  {
    question: 'Can I customize individual parts after building?',
    answer: 'Yes. You can adjust your budget, select alternative component brand preferences, and immediately regenerate the build while preserving your game and resolution targets.'
  },
  {
    question: 'What is the Game Vault Forum estimated balance score?',
    answer: 'The balance score rates the synergy between your processor, graphics card, memory latency, and motherboard. Scores of 85+ indicate negligible bottlenecking where neither CPU nor GPU unnecessarily starves the other in gaming workloads.'
  },
  {
    question: 'Can I save and share my custom build with friends?',
    answer: 'Yes! Click "Share Build" to copy a direct permalink to your configuration, or export a formatted Markdown summary ready to paste into Discord, Reddit, or the Game Vault Forum.'
  }
];

const STORAGE_SAVED_BUILDS_KEY = 'gvf_saved_pc_builds_v1';
const STORAGE_COMPONENTS_KEY = 'gvf_pc_builder_custom_components_v1';

export const PcBuilderView: React.FC<PcBuilderViewProps> = ({
  currentUser,
  initialBuildId,
  onNavigateTab,
  onShowToast,
  onShare
}) => {
  // Step navigation (1 to 5, or 'results')
  const [activeStep, setActiveStep] = useState<number | 'results'>(1);

  // Components inventory
  const [componentsDb, setComponentsDb] = useState<PcComponent[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_COMPONENTS_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_COMPONENTS;
  });

  // Builder Preferences State
  const [budgetUsd, setBudgetUsd] = useState<number>(1400);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>(['cyberpunk', 'elden-ring']);
  const [noSpecificGames, setNoSpecificGames] = useState<boolean>(false);
  const [resolution, setResolution] = useState<ResolutionTarget>('1440p');
  const [fpsTarget, setFpsTarget] = useState<FpsTarget>('120 FPS');
  const [cpuPref, setCpuPref] = useState<CpuBrandPreference>('No Preference');
  const [gpuPref, setGpuPref] = useState<GpuBrandPreference>('No Preference');
  const [storagePref, setStoragePref] = useState<StoragePreference>('1TB');
  const [ramPref, setRamPref] = useState<RamPreference>('32GB');
  const [wifiPref, setWifiPref] = useState<WifiPreference>('Required');
  const [rgbPref, setRgbPref] = useState<RgbPreference>('No Preference');

  // Build Results State
  const [currentBuild, setCurrentBuild] = useState<SavedPcBuild | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<SavedPcBuild[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_SAVED_BUILDS_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const isAdmin = currentUser?.email === 'contact@gamevault.forum';

  const toast = (msg: string, type: 'success' | 'info' = 'success') => {
    if (onShowToast) onShowToast(msg, type);
  };

  // Compile preferences object
  const getPreferences = (): PcBuilderPreferences => ({
    budgetUsd,
    currency,
    selectedGameIds: noSpecificGames ? [] : selectedGameIds,
    noSpecificGames,
    resolution,
    fpsTarget,
    cpuPreference: cpuPref,
    gpuPreference: gpuPref,
    storagePreference: storagePref,
    ramPreference: ramPref,
    wifiPreference: wifiPref,
    rgbPreference: rgbPref
  });

  // Build PC handler
  const handleGenerateBuild = () => {
    const prefs = getPreferences();
    const build = buildRecommendedPc(prefs, componentsDb);
    setCurrentBuild(build);
    setActiveStep('results');
    window.scrollTo({ top: 300, behavior: 'smooth' });
    toast('Custom PC build successfully generated and verified!');
  };

  // Save Build to collection
  const handleSaveBuild = () => {
    if (!currentBuild) return;
    setSavedBuilds(prev => {
      const exists = prev.some(b => b.id === currentBuild.id);
      let updated: SavedPcBuild[];
      if (exists) {
        updated = prev.map(b => (b.id === currentBuild.id ? currentBuild : b));
      } else {
        updated = [currentBuild, ...prev];
      }
      localStorage.setItem(STORAGE_SAVED_BUILDS_KEY, JSON.stringify(updated));
      return updated;
    });
    toast('Build saved to your personal vault collection!', 'success');
  };

  // Share link copy or open standard social share modal
  const handleShareLink = () => {
    if (!currentBuild) return;
    const sharePath = `/tools/gaming-pc-builder/build/${currentBuild.id}`;
    if (onShare) {
      onShare(
        currentBuild.title, 
        sharePath, 
        `Custom PC build with ${currentBuild.components.cpu.model} and ${currentBuild.components.gpu.model} — Total: ${formatPrice(currentBuild.totalEstimatedPriceUsd, currency)}`
      );
      return;
    }
    const shareUrl = `${window.location.origin}${sharePath}`;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    toast('Direct build URL copied to clipboard!');
    setTimeout(() => setShareCopied(false), 2500);
  };

  // Export to Markdown
  const handleExportMarkdown = () => {
    if (!currentBuild) return;
    const md = `
# ${currentBuild.title}
**Estimated Total:** ${formatPrice(currentBuild.totalEstimatedPriceUsd, currency)}
**Balance Score:** ${currentBuild.balanceScore.score}/100 (${currentBuild.balanceScore.rating})
**Compatibility:** ${currentBuild.compatibility.isCompatible ? 'Verified Fully Compatible' : 'Issues Found'}

### Component Breakdown:
- **CPU:** ${currentBuild.components.cpu.manufacturer} ${currentBuild.components.cpu.model} (${formatPrice(currentBuild.components.cpu.priceUsd, currency)})
- **GPU:** ${currentBuild.components.gpu.manufacturer} ${currentBuild.components.gpu.model} (${formatPrice(currentBuild.components.gpu.priceUsd, currency)})
- **Motherboard:** ${currentBuild.components.motherboard.manufacturer} ${currentBuild.components.motherboard.model} (${formatPrice(currentBuild.components.motherboard.priceUsd, currency)})
- **RAM:** ${currentBuild.components.ram.model} (${formatPrice(currentBuild.components.ram.priceUsd, currency)})
- **Storage:** ${currentBuild.components.storage.model} (${formatPrice(currentBuild.components.storage.priceUsd, currency)})
- **Power Supply:** ${currentBuild.components.psu.model} (${formatPrice(currentBuild.components.psu.priceUsd, currency)})
- **CPU Cooler:** ${currentBuild.components.cooler.model} (${formatPrice(currentBuild.components.cooler.priceUsd, currency)})
- **Case:** ${currentBuild.components.case.model} (${formatPrice(currentBuild.components.case.priceUsd, currency)})

*Generated on Game Vault Forum: https://www.gamevault.forum/tools/gaming-pc-builder*
    `.trim();

    navigator.clipboard.writeText(md);
    toast('Build markdown copied for Discord/Reddit posting!');
  };

  // Preset Budget Click
  const handlePresetBudget = (range: typeof BUDGET_RANGES[0]) => {
    const mid = Math.round((range.minUsd + range.maxUsd) / 2);
    setBudgetUsd(mid);
  };

  // Game toggle
  const handleToggleGame = (id: string) => {
    if (noSpecificGames) setNoSpecificGames(false);
    setSelectedGameIds(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <ToolHeader
        title="Gaming PC Builder"
        subtitle="Build a gaming PC around your budget and the games you actually play. Verified hardware compatibility, balance scoring, and real-world performance targets."
        breadcrumbs={[
          { label: 'Gaming Tools', onClick: () => onNavigateTab('tools' as any) },
          { label: 'Gaming PC Builder' }
        ]}
        icon={<Wrench className="w-6 h-6" />}
      />

      {/* Admin Component Desk (contact@gamevault.forum only) */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-purple-300">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin Desk: Hardware catalog & verified price registry management active.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Manage Hardware Database
          </button>
        </div>
      )}

      {/* Affiliate Disclosure Notice */}
      <div className="mb-8 p-3.5 rounded-xl bg-[#0e101d] border border-white/5 flex items-center justify-between gap-3 text-xs text-slate-400 font-['Inter']">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Affiliate Disclosure:</strong> Some links may be affiliate links. Game Vault Forum may earn a commission at no additional cost to you.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">Currency:</span>
          <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-0.5">
            {(['USD', 'GBP', 'EUR', 'NGN'] as CurrencyCode[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  currency === cur
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Tabs Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-8">
        {[
          { step: 1, label: '1. Budget', icon: DollarSign },
          { step: 2, label: '2. Target Games', icon: Tv },
          { step: 3, label: '3. Resolution', icon: Layers },
          { step: 4, label: '4. Target FPS', icon: TrendingUp },
          { step: 5, label: '5. Preferences', icon: Settings },
          { step: 'results', label: 'Build Results', icon: Sparkles }
        ].map((item) => {
          const isActive = activeStep === item.step;
          const Icon = item.icon;
          return (
            <button
              key={String(item.step)}
              type="button"
              onClick={() => {
                if (item.step === 'results' && !currentBuild) {
                  handleGenerateBuild();
                } else {
                  setActiveStep(item.step as any);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-950/30'
                  : 'bg-[#0f111e] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: BUDGET */}
      {activeStep === 1 && (
        <div className="bg-[#0f111e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Step 1 of 5
            </div>
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-white">
              What's your PC budget?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              We allocate funds dynamically across the graphics card, processor, and platform for maximum price-to-performance.
            </p>
          </div>

          {/* Custom Budget Input */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 max-w-xl">
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-2">
              Custom Budget Target
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold font-mono text-purple-400">
                {CURRENCY_CONFIGS[currency].symbol}
              </span>
              <input
                type="number"
                min={400}
                max={6000}
                step={50}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="flex-1 px-4 py-3 rounded-xl bg-[#141729] border border-white/10 text-xl font-bold font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-xs text-slate-400 font-mono">{currency}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Slider Adjustment:</span>
              <span className="text-purple-300 font-bold">{formatPrice(budgetUsd, currency)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={4000}
              step={50}
              value={budgetUsd}
              onChange={(e) => setBudgetUsd(Number(e.target.value))}
              className="w-full mt-1 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Preset Ranges Grid */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-3">
              Or Choose a Balanced Preset Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {BUDGET_RANGES.map((range) => {
                const isCurrent = budgetUsd >= range.minUsd && budgetUsd <= range.maxUsd;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => handlePresetBudget(range)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-950/30'
                        : 'bg-[#141729] border-white/5 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold font-['Space_Grotesk'] text-white">
                        {range.label}
                      </span>
                      <span className="text-xs font-mono text-purple-300">
                        {formatPrice(range.minUsd, currency)} – {formatPrice(range.maxUsd, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-['Inter'] leading-relaxed">
                      {range.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <span>Next: Gaming Target</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: GAMING TARGET */}
      {activeStep === 2 && (
        <div className="bg-[#0f111e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Step 2 of 5
            </div>
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-white">
              What do you want to play?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select games from Game Vault's database so we can optimize CPU/GPU rendering demands.
            </p>
          </div>

          {/* Option: No specific games */}
          <label className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={noSpecificGames}
              onChange={(e) => {
                setNoSpecificGames(e.target.checked);
                if (e.target.checked) setSelectedGameIds([]);
              }}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">
                I don't have specific games (Build an all-around balanced gaming PC)
              </div>
              <div className="text-xs text-slate-400">
                Optimizes purely for optimal silicon price-to-performance across all modern genres.
              </div>
            </div>
          </label>

          {/* Game Selection Grid */}
          {!noSpecificGames && (
            <div className="space-y-3">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                Popular Game Vault Titles ({selectedGameIds.length} Selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {MOCK_GAMES.map((game) => {
                  const isSelected = selectedGameIds.includes(game.id);
                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => handleToggleGame(game.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-500 text-white shadow-md'
                          : 'bg-[#141729] border-white/5 text-slate-300 hover:border-white/15'
                      }`}
                    >
                      <img
                        src={game.artwork}
                        alt={game.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                          {game.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {game.genre}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <span>Next: Resolution</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RESOLUTION */}
      {activeStep === 3 && (
        <div className="bg-[#0f111e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Step 3 of 5
            </div>
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-white">
              Target Display Resolution
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Higher resolutions demand greater VRAM capacity and GPU shading units.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: '1080p',
                label: '1080p (Full HD)',
                desc: '1920x1080 • Standard competitive esports resolution with maximum frame rate efficiency.'
              },
              {
                id: '1440p',
                label: '1440p (Quad HD)',
                desc: '2560x1440 • The current gaming sweet spot balancing sharp pixel density and high FPS.'
              },
              {
                id: '4K',
                label: '4K (Ultra HD)',
                desc: '3840x2160 • Uncompromising visual clarity requiring high-tier 16GB+ VRAM graphics cards.'
              }
            ].map((res) => (
              <button
                key={res.id}
                type="button"
                onClick={() => setResolution(res.id as ResolutionTarget)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  resolution === res.id
                    ? 'bg-purple-950/50 border-purple-500 text-white shadow-xl shadow-purple-950/30'
                    : 'bg-[#141729] border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="text-lg font-bold font-['Space_Grotesk'] text-white mb-2">
                  {res.label}
                </div>
                <p className="text-xs text-slate-400 font-['Inter'] leading-relaxed">
                  {res.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <span>Next: Performance Target</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PERFORMANCE TARGET */}
      {activeStep === 4 && (
        <div className="bg-[#0f111e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Step 4 of 5
            </div>
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-white">
              Target Refresh & Frame Rate
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your monitor's target refresh rate.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(['60 FPS', '75 FPS', '120 FPS', '144 FPS', '165 FPS', '240 FPS'] as FpsTarget[]).map((fps) => (
              <button
                key={fps}
                type="button"
                onClick={() => setFpsTarget(fps)}
                className={`py-4 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  fpsTarget === fps
                    ? 'bg-purple-950/50 border-purple-500 text-white shadow-lg'
                    : 'bg-[#141729] border-white/5 text-slate-300 hover:border-white/15'
                }`}
              >
                <div className="text-lg font-black font-mono text-purple-300">{fps}</div>
                <div className="text-[10px] text-slate-500 uppercase mt-1">
                  {fps === '240 FPS' ? 'Ultra Esports' : fps === '144 FPS' ? 'High Refresh' : 'Smooth Target'}
                </div>
              </button>
            ))}
          </div>

          {/* Mandatory Accurate FPS Disclaimer */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-start gap-3 text-xs text-purple-200/90 font-['Inter'] leading-relaxed">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">FPS Disclaimer:</strong> Actual FPS depends on the game, graphics settings, driver updates, resolution, CPU/GPU combination, and background workloads. Never guarantee an FPS number without benchmark data.
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(5)}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <span>Next: Component Preferences</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: COMPONENT PREFERENCES */}
      {activeStep === 5 && (
        <div className="bg-[#0f111e] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Step 5 of 5
            </div>
            <h2 className="text-2xl font-black font-['Space_Grotesk'] text-white">
              Component & Brand Preferences
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tailor hardware manufacturer affinities, memory capacity, storage room, and aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CPU Brand */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                CPU Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['No Preference', 'AMD', 'Intel'] as CpuBrandPreference[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setCpuPref(b)}
                    className={`py-2 px-3 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      cpuPref === b
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#141729] text-slate-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Brand */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                GPU Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['No Preference', 'NVIDIA', 'AMD'] as GpuBrandPreference[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setGpuPref(b)}
                    className={`py-2 px-3 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      gpuPref === b
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#141729] text-slate-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Capacity */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                RAM Capacity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['16GB', '32GB', '64GB'] as RamPreference[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRamPref(r)}
                    className={`py-2 px-3 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      ramPref === r
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#141729] text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Size */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                NVMe Storage Size
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['500GB', '1TB', '2TB', '4TB+'] as StoragePreference[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStoragePref(s)}
                    className={`py-2 px-2 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      storagePref === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#141729] text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Wi-Fi & RGB */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                Motherboard Wi-Fi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Required', 'Not Required'] as WifiPreference[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWifiPref(w)}
                    className={`py-2 px-3 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      wifiPref === w
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#141729] text-slate-400 hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                RGB Aesthetics
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['No Preference', 'Yes', 'No'] as RgbPreference[]).map((rgb) => (
                  <button
                    key={rgb}
                    type="button"
                    onClick={() => setRgbPref(rgb)}
                    className={`py-2 px-3 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      rgbPref === rgb
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#141729] text-slate-400 hover:text-white'
                    }`}
                  >
                    {rgb}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleGenerateBuild}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm sm:text-base font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xl shadow-purple-950/50 transform hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>BUILD MY PC</span>
            </button>
          </div>
        </div>
      )}

      {/* RESULTS VIEW */}
      {activeStep === 'results' && currentBuild && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Summary Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#12152b] via-[#101222] to-[#16132e] border border-purple-500/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-300 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Custom Balanced Build #{currentBuild.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-white">
                {currentBuild.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-['Inter'] mt-1 max-w-2xl">
                Optimized for {currentBuild.preferences.resolution} @ {currentBuild.preferences.fpsTarget} gaming.
              </p>
            </div>

            {/* Total Build Price Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-left lg:text-right shrink-0">
              <div className="text-xs text-slate-400 uppercase font-['Rajdhani'] font-bold">
                Estimated Total Cost
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-purple-300">
                {formatPrice(currentBuild.totalEstimatedPriceUsd, currency)}
              </div>
              <div className="text-[10px] text-slate-500 font-['Inter'] mt-1 max-w-xs">
                Estimated price (hardware prices fluctuate, last verified: September 2024).
              </div>
            </div>
          </div>

          {/* Action Toolbar: Share, Save, Re-tune, Markdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0f111e] border border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSaveBuild}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save Build</span>
              </button>
              <button
                type="button"
                onClick={handleShareLink}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Build</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Markdown</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="text-xs text-purple-400 hover:text-purple-300 font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Parameters</span>
            </button>
          </div>

          {/* Real-Time 10-Point Compatibility Verification & Balance Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <CompatibilityBadge compatibility={currentBuild.compatibility} />
            </div>
            <div className="lg:col-span-5">
              <BalanceScoreGauge balanceScore={currentBuild.balanceScore} />
            </div>
          </div>

          {/* Gaming Performance Real-World Summary */}
          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/10">
            <div className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Gaming Performance Assessment</span>
            </div>
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white mb-2">
              Real-World Gameplay Projection
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-['Inter'] leading-relaxed">
              {currentBuild.performanceSummary}
            </p>
          </div>

          {/* Component-by-Component Layout */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Recommended Component Configuration
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                8 Core Components Verified
              </span>
            </div>

            <div className="space-y-3">
              <ComponentRow
                categoryLabel="Processor (CPU)"
                categoryIcon={<Cpu className="w-5 h-5" />}
                component={currentBuild.components.cpu}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="Graphics Card (GPU)"
                categoryIcon={<Tv className="w-5 h-5" />}
                component={currentBuild.components.gpu}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="Motherboard"
                categoryIcon={<Layers className="w-5 h-5" />}
                component={currentBuild.components.motherboard}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="Memory (RAM)"
                categoryIcon={<Zap className="w-5 h-5" />}
                component={currentBuild.components.ram}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="Storage (NVMe SSD)"
                categoryIcon={<HardDrive className="w-5 h-5" />}
                component={currentBuild.components.storage}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="Power Supply (PSU)"
                categoryIcon={<Zap className="w-5 h-5" />}
                component={currentBuild.components.psu}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="CPU Cooler"
                categoryIcon={<Wind className="w-5 h-5" />}
                component={currentBuild.components.cooler}
                currency={currency}
              />
              <ComponentRow
                categoryLabel="Chassis / Case"
                categoryIcon={<Box className="w-5 h-5" />}
                component={currentBuild.components.case}
                currency={currency}
              />
              {currentBuild.components.os && (
                <ComponentRow
                  categoryLabel="Operating System"
                  categoryIcon={<ShieldCheck className="w-5 h-5" />}
                  component={currentBuild.components.os}
                  currency={currency}
                />
              )}
            </div>
          </div>

          {/* Upgrade Recommendations */}
          {currentBuild.upgradeRecommendations.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#0f111e] border border-white/10 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  Possible Future Upgrades
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-['Inter']">
                When you are ready to expand your rig later, here are the most impactful upgrade paths identified for this build:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentBuild.upgradeRecommendations.map((upg, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                          {upg.title}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          upg.priority === 'High' ? 'bg-purple-950 text-purple-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {upg.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-['Inter'] leading-relaxed">
                        {upg.benefit}
                      </p>
                    </div>
                    <div className="mt-3 text-xs font-mono text-purple-400">
                      Est. +{formatPrice(upg.estimatedCostUsd, currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start New Build Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => {
                setActiveStep(1);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start a New Build</span>
            </button>
          </div>
        </div>
      )}

      {/* SEO Educational Content: How to choose parts for a gaming PC */}
      <section className="mt-16 pt-10 border-t border-white/10 font-['Inter']">
        <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white mb-3">
          How to Choose Parts for a Gaming PC
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-8">
          Building a custom gaming PC unlocks unmatched performance, customization, and cost efficiency compared to prebuilts. Follow these fundamental engineering principles to balance silicon power and longevity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              GPU Allocation Rule
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In a gaming build, roughly 40% to 50% of the entire budget should be allocated to the graphics card, as it dictates native resolution and texture rendering throughput.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              CPU & Motherboard Sockets
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Always pair matching sockets (AMD AM5 with Ryzen 7000/9000; Intel LGA1700 with 12th/13th/14th Gen). Choose AM5 if you desire future drop-in CPU upgrades through 2027+.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Memory Sweet Spot (DDR5-6000 CL30)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For contemporary AMD AM5 systems, 32GB (2x16GB) of DDR5-6000MHz with CL30 timings represents the optimal 1:1 memory controller frequency clock divider.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Power Supply Headroom & ATX 3.0
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure your PSU delivers at least 25% to 30% wattage headroom beyond total component TDP to absorb transient microsecond voltage spikes and ensure fanless idle operation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Storage: NVMe Gen4 Over SATA
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PCIe 4.0 M.2 NVMe drives deliver 5,000MB/s+ sequential speeds, unlocking Microsoft DirectStorage in titles like Ratchet & Clank and Spider-Man with near-zero load times.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Chassis Airflow & Clearance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prioritize mesh front panels over closed tempered glass faces, and double-check card length (mm) clearance against front-mounted AIO liquid radiator assemblies.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <ToolFaq
        title="Frequently Asked Questions"
        subtitle="Detailed guidance regarding PC building, compatibility testing, and price accuracy."
        items={FAQ_ITEMS}
      />

      {/* Admin Modal */}
      {isAdmin && (
        <AdminComponentModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          components={componentsDb}
          onUpdateComponents={(updated) => {
            setComponentsDb(updated);
            localStorage.setItem(STORAGE_COMPONENTS_KEY, JSON.stringify(updated));
          }}
          onShowToast={toast}
        />
      )}
    </div>
  );
};
