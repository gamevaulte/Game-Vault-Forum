import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Gamepad2, 
  Cpu, 
  Monitor, 
  Sparkles, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Share2, 
  Bookmark, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Layers, 
  Gauge, 
  Laptop, 
  HardDrive, 
  Copy, 
  Check, 
  ArrowRight,
  Info,
  SlidersHorizontal,
  Bot,
  Plus,
  Trash2,
  Wand2,
  Globe
} from 'lucide-react';
import { 
  FpsCalculationInput, 
  FpsCalculationResult, 
  ResolutionOption, 
  GraphicsPreset, 
  UpscalingTech, 
  RayTracingSetting, 
  FrameGenerationSetting, 
  StorageType, 
  RamChannel,
  SavedUserPc
} from '../types/fpsCalculator';
import { 
  GAME_PERFORMANCE_PROFILES, 
  ALL_CALCULATOR_CPUS, 
  ALL_CALCULATOR_GPUS, 
  RESOLUTION_DEFINITIONS, 
  PRESET_DEFINITIONS, 
  UPSCALING_DEFINITIONS,
  TARGET_FPS_OPTIONS,
  RAM_CAPACITY_OPTIONS,
  VRAM_OPTIONS_CALCULATOR,
  GamePerformanceProfile,
  createUniversalGameProfile
} from '../data/fpsCalculatorData';
import { CustomGameCalibrationModal } from '../components/fps/CustomGameCalibrationModal';
import { 
  calculateGamingPerformance, 
  generateLocalAiExplanation, 
  generateLocalUpgradeAdvice 
} from '../services/fpsCalculationEngine';
import { PageTab, UserAccount } from '../types';

interface FpsCalculatorViewProps {
  currentUser?: UserAccount | null;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  onNavigateTab?: (tab: PageTab) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
  initialGameId?: string;
  initialGameSlug?: string;
  onShare?: (title: string, customPath?: string, description?: string) => void;
}

const STORAGE_SAVED_PC_KEY = 'gv_fps_calc_saved_pc_v1';

export const FpsCalculatorView: React.FC<FpsCalculatorViewProps> = ({
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onNavigateTab,
  onShowToast,
  initialGameId,
  initialGameSlug,
  onShare
}) => {
  // Mode selection: Quick Check vs Advanced Check
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');

  // Custom User-Created Games (persisted locally)
  const [customGames, setCustomGames] = useState<GamePerformanceProfile[]>(() => {
    try {
      const saved = localStorage.getItem('gv_custom_pc_games_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal for adding any PC game on earth
  const [isCustomGameModalOpen, setIsCustomGameModalOpen] = useState(false);
  const [modalInitialTitle, setModalInitialTitle] = useState('');

  // Combined games catalog
  const allAvailableGames = useMemo(() => {
    const map = new Map<string, GamePerformanceProfile>();
    for (const g of customGames) {
      map.set(g.id, g);
    }
    for (const g of GAME_PERFORMANCE_PROFILES) {
      if (!map.has(g.id)) {
        map.set(g.id, g);
      }
    }
    return Array.from(map.values());
  }, [customGames]);

  // Input states
  const [selectedGameId, setSelectedGameId] = useState<string>(() => {
    if (initialGameSlug) {
      const match = GAME_PERFORMANCE_PROFILES.find(g => g.id === initialGameSlug || g.title.toLowerCase().includes(initialGameSlug.toLowerCase()));
      if (match) return match.id;
    }
    return initialGameId || GAME_PERFORMANCE_PROFILES[0].id;
  });
  const [gameSearchQuery, setGameSearchQuery] = useState('');
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);

  // GPU states
  const [selectedGpuId, setSelectedGpuId] = useState<string>(() => {
    return ALL_CALCULATOR_GPUS.find(g => g.name.includes('RTX 4060'))?.id || ALL_CALCULATOR_GPUS[0].id;
  });
  const [gpuSearchQuery, setGpuSearchQuery] = useState('');
  const [isGpuDropdownOpen, setIsGpuDropdownOpen] = useState(false);
  const [gpuBrandFilter, setGpuBrandFilter] = useState<'ALL' | 'NVIDIA' | 'AMD' | 'Intel'>('ALL');
  const [isLaptopGpu, setIsLaptopGpu] = useState(false);
  const [vramGb, setVramGb] = useState<number>(8);

  // CPU states
  const [selectedCpuId, setSelectedCpuId] = useState<string>(() => {
    return ALL_CALCULATOR_CPUS.find(c => c.name.includes('Ryzen 5 7600') || c.name.includes('Ryzen 5 5600'))?.id || ALL_CALCULATOR_CPUS[0].id;
  });
  const [cpuSearchQuery, setCpuSearchQuery] = useState('');
  const [isCpuDropdownOpen, setIsCpuDropdownOpen] = useState(false);
  const [cpuBrandFilter, setCpuBrandFilter] = useState<'ALL' | 'AMD' | 'Intel' | 'Apple'>('ALL');

  // RAM & Storage states
  const [ramGb, setRamGb] = useState<number>(16);
  const [ramSpeedMhz, setRamSpeedMhz] = useState<number>(3200);
  const [ramChannel, setRamChannel] = useState<RamChannel>('dual');
  const [storageType, setStorageType] = useState<StorageType>('nvme_ssd');

  // Resolution & Quality states
  const [resolution, setResolution] = useState<ResolutionOption>('1080p');
  const [graphicsPreset, setGraphicsPreset] = useState<GraphicsPreset>('high');
  const [targetFps, setTargetFps] = useState<number>(60);
  const [refreshRateHz, setRefreshRateHz] = useState<number>(144);
  const [vSync, setVSync] = useState<boolean>(false);

  // Upscaling, Ray Tracing, Frame Gen
  const [upscaling, setUpscaling] = useState<UpscalingTech>('off');
  const [rayTracing, setRayTracing] = useState<RayTracingSetting>('off');
  const [frameGeneration, setFrameGeneration] = useState<FrameGenerationSetting>('off');

  // Calculation Results
  const [result, setResult] = useState<FpsCalculationResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // AI Insights State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [upgradeAdvice, setUpgradeAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);

  // Saved PC state
  const [savedPc, setSavedPc] = useState<SavedUserPc | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // FAQ open/close state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Refs for dropdown click-outs
  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const gpuDropdownRef = useRef<HTMLDivElement>(null);
  const cpuDropdownRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load Saved PC on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_PC_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSavedPc(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse saved PC specs', e);
    }
  }, []);

  // Update VRAM when GPU changes if not manually overridden
  useEffect(() => {
    const gpu = ALL_CALCULATOR_GPUS.find(g => g.id === selectedGpuId);
    if (gpu) {
      setVramGb(gpu.vramGb);
      if (gpu.isLaptop) {
        setIsLaptopGpu(true);
      }
    }
  }, [selectedGpuId]);

  // Selected game object
  const activeGame: GamePerformanceProfile = useMemo(() => {
    return allAvailableGames.find(g => g.id === selectedGameId) || allAvailableGames[0];
  }, [allAvailableGames, selectedGameId]);

  // Filtered games list
  const filteredGames = useMemo(() => {
    if (!gameSearchQuery.trim()) return allAvailableGames;
    const q = gameSearchQuery.toLowerCase();
    return allAvailableGames.filter(g => 
      g.title.toLowerCase().includes(q) || 
      g.genre.toLowerCase().includes(q) ||
      g.engine.toLowerCase().includes(q)
    );
  }, [allAvailableGames, gameSearchQuery]);

  const handleCreateInstantCustomGame = (title: string) => {
    const newProfile = createUniversalGameProfile(title);
    const updated = [newProfile, ...customGames.filter(g => g.id !== newProfile.id)];
    setCustomGames(updated);
    try {
      localStorage.setItem('gv_custom_pc_games_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedGameId(newProfile.id);
    setIsGameDropdownOpen(false);
    setGameSearchQuery('');
    onShowToast?.(`Loaded & benchmarked "${newProfile.title}"`, 'success');
  };

  const handleSaveCalibratedCustomGame = (profile: GamePerformanceProfile) => {
    if (!isSignedIn) {
      onOpenSignIn?.();
      return;
    }
    const updated = [profile, ...customGames.filter(g => g.id !== profile.id)];
    setCustomGames(updated);
    try {
      localStorage.setItem('gv_custom_pc_games_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedGameId(profile.id);
    setIsCustomGameModalOpen(false);
    setIsGameDropdownOpen(false);
    setGameSearchQuery('');
    onShowToast?.(`Saved & calibrated "${profile.title}" profile`, 'success');
  };

  const handleDeleteCustomGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customGames.filter(g => g.id !== id);
    setCustomGames(updated);
    try {
      localStorage.setItem('gv_custom_pc_games_v1', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (selectedGameId === id) {
      setSelectedGameId(GAME_PERFORMANCE_PROFILES[0].id);
    }
    onShowToast?.('Removed custom game profile', 'info');
  };

  const openCustomModalWithTitle = (title: string) => {
    setModalInitialTitle(title);
    setIsCustomGameModalOpen(true);
    setIsGameDropdownOpen(false);
  };

  // Filtered GPUs
  const filteredGpus = useMemo(() => {
    return ALL_CALCULATOR_GPUS.filter(g => {
      const matchesBrand = gpuBrandFilter === 'ALL' || g.brand.toUpperCase() === gpuBrandFilter;
      const matchesQuery = !gpuSearchQuery.trim() || g.name.toLowerCase().includes(gpuSearchQuery.toLowerCase()) || g.series?.toLowerCase().includes(gpuSearchQuery.toLowerCase());
      return matchesBrand && matchesQuery;
    });
  }, [gpuBrandFilter, gpuSearchQuery]);

  // Filtered CPUs
  const filteredCpus = useMemo(() => {
    return ALL_CALCULATOR_CPUS.filter(c => {
      const matchesBrand = cpuBrandFilter === 'ALL' || c.brand.toUpperCase() === cpuBrandFilter;
      const matchesQuery = !cpuSearchQuery.trim() || c.name.toLowerCase().includes(cpuSearchQuery.toLowerCase()) || c.family?.toLowerCase().includes(cpuSearchQuery.toLowerCase());
      return matchesBrand && matchesQuery;
    });
  }, [cpuBrandFilter, cpuSearchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (gameDropdownRef.current && !gameDropdownRef.current.contains(e.target as Node)) {
        setIsGameDropdownOpen(false);
      }
      if (gpuDropdownRef.current && !gpuDropdownRef.current.contains(e.target as Node)) {
        setIsGpuDropdownOpen(false);
      }
      if (cpuDropdownRef.current && !cpuDropdownRef.current.contains(e.target as Node)) {
        setIsCpuDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute calculation input
  const currentCalculationInput: FpsCalculationInput = useMemo(() => {
    const gpu = ALL_CALCULATOR_GPUS.find(g => g.id === selectedGpuId);
    const cpu = ALL_CALCULATOR_CPUS.find(c => c.id === selectedCpuId);

    return {
      gameId: activeGame.id,
      gameTitle: activeGame.title,
      gpuId: selectedGpuId,
      gpuName: gpu?.name || 'Graphics Card',
      isLaptopGpu,
      vramGb,
      cpuId: selectedCpuId,
      cpuName: cpu?.name || 'Processor',
      ramGb,
      ramSpeedMhz,
      ramChannel,
      storageType,
      resolution,
      graphicsPreset,
      targetFps,
      refreshRateHz,
      vSync,
      upscaling,
      rayTracing,
      frameGeneration
    };
  }, [
    activeGame,
    selectedGpuId,
    isLaptopGpu,
    vramGb,
    selectedCpuId,
    ramGb,
    ramSpeedMhz,
    ramChannel,
    storageType,
    resolution,
    graphicsPreset,
    targetFps,
    refreshRateHz,
    vSync,
    upscaling,
    rayTracing,
    frameGeneration
  ]);

  // Perform Calculation Function
  const handleCalculate = (scroll = true) => {
    setIsCalculating(true);
    // Instant mathematical modeling with micro-tick for natural responsiveness
    setTimeout(() => {
      const calcResult = calculateGamingPerformance(currentCalculationInput);
      setResult(calcResult);
      setHasCalculated(true);
      setIsCalculating(false);
      setAiExplanation(null);
      setUpgradeAdvice(null);

      if (scroll && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  // Live "What If" adjustment recalculation if results are already visible
  const handleWhatIfChange = (updates: Partial<FpsCalculationInput>) => {
    if (updates.resolution !== undefined) setResolution(updates.resolution);
    if (updates.graphicsPreset !== undefined) setGraphicsPreset(updates.graphicsPreset);
    if (updates.rayTracing !== undefined) setRayTracing(updates.rayTracing);
    if (updates.upscaling !== undefined) setUpscaling(updates.upscaling);
    if (updates.frameGeneration !== undefined) setFrameGeneration(updates.frameGeneration);

    const mergedInput: FpsCalculationInput = {
      ...currentCalculationInput,
      ...updates
    };

    const calcResult = calculateGamingPerformance(mergedInput);
    setResult(calcResult);
  };

  // Save "My PC"
  const handleSaveMyPc = () => {
    if (!isSignedIn) {
      onOpenSignIn?.();
      return;
    }

    const gpu = ALL_CALCULATOR_GPUS.find(g => g.id === selectedGpuId);
    const cpu = ALL_CALCULATOR_CPUS.find(c => c.id === selectedCpuId);

    const pcData: SavedUserPc = {
      cpuId: selectedCpuId,
      cpuName: cpu?.name || 'Processor',
      gpuId: selectedGpuId,
      gpuName: gpu?.name || 'Graphics Card',
      ramGb,
      vramGb,
      isLaptopGpu,
      storageType,
      lastUpdated: new Date().toLocaleDateString()
    };

    localStorage.setItem(STORAGE_SAVED_PC_KEY, JSON.stringify(pcData));
    setSavedPc(pcData);
    if (onShowToast) {
      onShowToast('Your PC hardware profile has been saved successfully!', 'success');
    }
  };

  // Load "My PC"
  const handleLoadMyPc = () => {
    if (!savedPc) return;
    setSelectedCpuId(savedPc.cpuId);
    setSelectedGpuId(savedPc.gpuId);
    setRamGb(savedPc.ramGb);
    setVramGb(savedPc.vramGb);
    if (savedPc.isLaptopGpu !== undefined) setIsLaptopGpu(savedPc.isLaptopGpu);
    if (savedPc.storageType) setStorageType(savedPc.storageType);

    if (onShowToast) {
      onShowToast(`Loaded your saved PC profile (${savedPc.gpuName})!`, 'info');
    }
  };

  // AI Explain Result handler
  const handleExplainResult = async () => {
    if (!result) return;
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/vault-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Explain this FPS calculator result objectively for a PC gamer:
Game: ${activeGame.title}
Hardware: CPU ${currentCalculationInput.cpuName}, GPU ${currentCalculationInput.gpuName} (${vramGb}GB VRAM), ${ramGb}GB RAM
Settings: ${result.resolutionLabel} at ${result.presetLabel} preset, Ray Tracing: ${rayTracing}, Upscaling: ${upscaling}, Frame Gen: ${frameGeneration}
Estimated FPS Range: ${result.minFps}–${result.maxFps} FPS (Average: ${result.avgFps} FPS, 1% Low: ${result.onePercentLowFps} FPS)
Bottleneck: ${result.bottleneck.headline} - ${result.bottleneck.explanation}
Target FPS: ${targetFps} (Meets target: ${result.meetsTarget})

Give a clear, 3-sentence conversational breakdown explaining what this means for their gameplay smoothness. Do not invent any fake benchmark numbers.`,
          history: []
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setAiExplanation(data.reply);
          setIsAiLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI explain route unavailable, using local analytical engine', e);
    }

    // Local analytical engine fallback
    const localText = generateLocalAiExplanation(result, currentCalculationInput);
    setAiExplanation(localText);
    setIsAiLoading(false);
  };

  // AI Upgrade Advice handler
  const handleUpgradeAdvice = async () => {
    if (!result) return;
    setIsUpgradeLoading(true);

    try {
      const res = await fetch('/api/vault-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide objective PC hardware upgrade advice based strictly on this calculated bottleneck:
Game: ${activeGame.title}
Current Hardware: CPU ${currentCalculationInput.cpuName}, GPU ${currentCalculationInput.gpuName} (${vramGb}GB VRAM), ${ramGb}GB RAM
Resolution: ${result.resolutionLabel}
Identified Bottleneck: ${result.bottleneck.headline} (${result.bottleneck.component})
Explanation: ${result.bottleneck.explanation}

Provide a concise, practical upgrade path explaining which component to upgrade first, why, and a budget tip. Keep it grounded in real PC hardware.`,
          history: []
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setUpgradeAdvice(data.reply);
          setIsUpgradeLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI upgrade route unavailable, using local analytical advice', e);
    }

    // Local analytical engine fallback
    const localUpgrade = generateLocalUpgradeAdvice(result, currentCalculationInput);
    setUpgradeAdvice(localUpgrade);
    setIsUpgradeLoading(false);
  };

  // Share results text generator
  const handleShareResults = () => {
    if (!result) return;
    const shareText = `🎮 Game Vault FPS Calculator Results:
Game: ${activeGame.title}
Hardware: ${currentCalculationInput.cpuName} + ${currentCalculationInput.gpuName} (${ramGb}GB RAM)
Settings: ${result.resolutionLabel} • ${result.presetLabel}
Estimated FPS: ${result.minFps}–${result.maxFps} FPS (${result.status === 'good' ? '🟢 Good' : result.status === 'playable' ? '🟡 Playable' : '🔴 Below Target'})
1% Low: ${result.onePercentLowFps ? `${result.onePercentLowFps} FPS` : 'N/A'}
Calculate your PC performance at: ${window.location.origin}/tools/fps-calculator`;

    navigator.clipboard.writeText(shareText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
    if (onShowToast) {
      onShowToast('Performance summary copied to clipboard!', 'success');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#070913] text-slate-200 pb-20 font-['Inter',sans-serif]">
      {/* Top Banner Header */}
      <div className="relative border-b border-purple-500/20 bg-gradient-to-b from-purple-950/40 via-[#0a0c1b] to-[#070913] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-mono">
            <button 
              onClick={() => onNavigateTab ? onNavigateTab('tools') : null}
              className="hover:text-purple-400 transition-colors"
            >
              Tools Hub
            </button>
            <span>/</span>
            <span className="text-purple-300">FPS Performance Calculator</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
                <Gauge className="w-3.5 h-3.5 text-purple-400" />
                <span>Interactive Hardware Utility</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight flex items-center gap-3">
                <span>🎮</span> FPS / Performance Calculator
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-300 mt-2 font-['Space_Grotesk']">
                Check your PC&apos;s estimated gaming performance before you play.
              </p>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                Enter your PC hardware, choose a game and select your preferred resolution and graphics settings to get an estimated FPS range.
              </p>
            </div>

            {/* Saved PC Bar & Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {savedPc ? (
                <button
                  id="btn-use-my-pc"
                  onClick={handleLoadMyPc}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:text-purple-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                  title={`Load saved ${savedPc.gpuName}`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                  <span>Use My PC ({savedPc.gpuName.split(' ').slice(-2).join(' ')})</span>
                </button>
              ) : null}

              <button
                id="btn-save-my-pc"
                onClick={handleSaveMyPc}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
                title="Save current hardware specs to browser storage"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Save Hardware</span>
              </button>

              <div className="inline-flex rounded-xl bg-slate-900 border border-white/10 p-1">
                <button
                  id="tab-mode-quick"
                  onClick={() => setMode('quick')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'quick' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Quick Check
                </button>
                <button
                  id="tab-mode-advanced"
                  onClick={() => setMode('advanced')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    mode === 'advanced' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Advanced Check</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Form Card */}
        <div className="rounded-2xl bg-[#0e1122] border border-white/10 p-6 sm:p-8 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Game & Hardware Selection (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Game Selection */}
              <div className="space-y-2 relative" ref={gameDropdownRef}>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-purple-400" />
                    Select Game Title
                  </span>
                  {activeGame.hasVerifiedBenchmarks && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                      ✓ Verified Engine Data
                    </span>
                  )}
                </label>

                <div className="relative">
                  <div 
                    onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                    className="w-full p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-purple-500/50 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <img 
                        src={activeGame.coverImage} 
                        alt={activeGame.title}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0" 
                      />
                      <div className="truncate text-left">
                        <div className="text-sm font-bold text-white truncate">{activeGame.title}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>{activeGame.genre}</span>
                          <span>•</span>
                          <span>{activeGame.engine.split('(')[0]}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  </div>

                  {/* Dropdown Menu */}
                  {isGameDropdownOpen && (
                    <div className="absolute z-30 top-full left-0 right-0 mt-2 rounded-xl bg-[#121528] border border-purple-500/30 shadow-2xl overflow-hidden max-h-96 flex flex-col">
                      <div className="p-2 border-b border-white/5 bg-slate-950/80 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Search or type ANY game title (e.g. Subnautica, Civ VII, Crysis...)"
                          value={gameSearchQuery}
                          onChange={(e) => setGameSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          autoFocus
                        />
                      </div>

                      {/* Instant Universal Benchmark Prompt for ANY Game */}
                      {gameSearchQuery.trim().length > 0 && !filteredGames.some(g => g.title.toLowerCase() === gameSearchQuery.trim().toLowerCase()) && (
                        <div
                          onClick={() => handleCreateInstantCustomGame(gameSearchQuery.trim())}
                          className="p-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/80 hover:to-indigo-900/80 border-b border-purple-500/30 cursor-pointer flex items-center justify-between transition-all"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="truncate text-left">
                              <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                                <span>Benchmark &ldquo;{gameSearchQuery.trim()}&rdquo;</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 font-mono">
                                  Universal Engine
                                </span>
                              </div>
                              <div className="text-[10px] text-purple-200/70 truncate">
                                Click for instant calculation, or calibrate engine specs
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCustomModalWithTitle(gameSearchQuery.trim());
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold shrink-0 ml-2 shadow"
                          >
                            Calibrate
                          </button>
                        </div>
                      )}

                      <div className="overflow-y-auto divide-y divide-white/5 flex-1">
                        {filteredGames.map(game => {
                          const isCustom = customGames.some(cg => cg.id === game.id);
                          return (
                            <div
                              key={game.id}
                              onClick={() => {
                                setSelectedGameId(game.id);
                                setIsGameDropdownOpen(false);
                              }}
                              className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors hover:bg-purple-600/20 ${
                                game.id === selectedGameId ? 'bg-purple-600/30' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <img 
                                  src={game.coverImage} 
                                  alt={game.title}
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded object-cover shrink-0 border border-white/10" 
                                />
                                <div className="truncate text-left">
                                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                    <span>{game.title}</span>
                                    {isCustom && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                                        Custom
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {game.genre} • {game.releaseYear} • Tier {game.demandTier}/5
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {game.supportsRayTracing && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">RT</span>
                                )}
                                {isCustom && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteCustomGame(game.id, e)}
                                    title="Delete custom game"
                                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom action: Add Any Game */}
                      <div className="p-2.5 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-purple-400" />
                          <span>{allAvailableGames.length} PC Games available</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => openCustomModalWithTitle(gameSearchQuery.trim())}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Any Game on Earth</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Feature Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                  <span className="text-slate-500">Supported Technologies:</span>
                  {activeGame.supportsDlss && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">DLSS</span>}
                  {activeGame.supportsFsr && <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 font-mono">FSR</span>}
                  {activeGame.supportsXeSS && <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">XeSS</span>}
                  {activeGame.supportsRayTracing && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">Ray Tracing</span>}
                  {activeGame.supportsFrameGen && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">Frame Gen</span>}
                </div>
              </div>

              {/* 2. GPU Selection */}
              <div className="space-y-2 relative" ref={gpuDropdownRef}>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    Graphics Card (GPU)
                  </span>
                  
                  {/* Laptop GPU Toggle */}
                  <label className="flex items-center gap-1.5 cursor-pointer select-none normal-case font-normal text-slate-300 hover:text-white text-xs">
                    <input
                      type="checkbox"
                      checked={isLaptopGpu}
                      onChange={(e) => setIsLaptopGpu(e.target.checked)}
                      className="rounded border-white/20 bg-slate-900 text-purple-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Laptop / Mobile GPU</span>
                  </label>
                </div>

                <div 
                  onClick={() => setIsGpuDropdownOpen(!isGpuDropdownOpen)}
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="truncate">
                    <div className="text-sm font-bold text-white truncate">
                      {ALL_CALCULATOR_GPUS.find(g => g.id === selectedGpuId)?.name || 'Select GPU'}
                      {isLaptopGpu && !ALL_CALCULATOR_GPUS.find(g => g.id === selectedGpuId)?.isLaptop ? ' (Laptop Mode)' : ''}
                    </div>
                    <div className="text-xs text-slate-400">
                      {vramGb} GB VRAM • Tier {ALL_CALCULATOR_GPUS.find(g => g.id === selectedGpuId)?.tier || 6}/10
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </div>

                {/* GPU Dropdown */}
                {isGpuDropdownOpen && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-2 rounded-xl bg-[#121528] border border-cyan-500/30 shadow-2xl overflow-hidden max-h-80 flex flex-col">
                    <div className="p-2 border-b border-white/5 bg-slate-950/80 space-y-2">
                      <input
                        type="text"
                        placeholder="Search GPU model (e.g. RTX 4070, RX 7800 XT, Arc A770)..."
                        value={gpuSearchQuery}
                        onChange={(e) => setGpuSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        autoFocus
                      />
                      <div className="flex items-center gap-1 text-[10px]">
                        {(['ALL', 'NVIDIA', 'AMD', 'Intel'] as const).map(b => (
                          <button
                            key={b}
                            onClick={() => setGpuBrandFilter(b)}
                            className={`px-2 py-0.5 rounded transition-colors ${
                              gpuBrandFilter === b ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-y-auto divide-y divide-white/5">
                      {filteredGpus.map(gpu => (
                        <div
                          key={gpu.id}
                          onClick={() => {
                            setSelectedGpuId(gpu.id);
                            setIsGpuDropdownOpen(false);
                          }}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-cyan-600/20 ${
                            gpu.id === selectedGpuId ? 'bg-cyan-600/30' : ''
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{gpu.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {gpu.brand} • {gpu.vramGb} GB VRAM • Tier {gpu.tier}
                            </div>
                          </div>
                          {gpu.isLaptop && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                              Mobile
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. CPU Selection */}
              <div className="space-y-2 relative" ref={cpuDropdownRef}>
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Processor (CPU)
                </label>

                <div 
                  onClick={() => setIsCpuDropdownOpen(!isCpuDropdownOpen)}
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="truncate">
                    <div className="text-sm font-bold text-white truncate">
                      {ALL_CALCULATOR_CPUS.find(c => c.id === selectedCpuId)?.name || 'Select CPU'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {ALL_CALCULATOR_CPUS.find(c => c.id === selectedCpuId)?.cores || 6} Cores / {ALL_CALCULATOR_CPUS.find(c => c.id === selectedCpuId)?.threads || 12} Threads • Tier {ALL_CALCULATOR_CPUS.find(c => c.id === selectedCpuId)?.tier || 6}/10
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </div>

                {/* CPU Dropdown */}
                {isCpuDropdownOpen && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-2 rounded-xl bg-[#121528] border border-emerald-500/30 shadow-2xl overflow-hidden max-h-80 flex flex-col">
                    <div className="p-2 border-b border-white/5 bg-slate-950/80 space-y-2">
                      <input
                        type="text"
                        placeholder="Search CPU (Ryzen 7 7800X3D, Core i5-13600K, Ryzen 5 5600)..."
                        value={cpuSearchQuery}
                        onChange={(e) => setCpuSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        autoFocus
                      />
                      <div className="flex items-center gap-1 text-[10px]">
                        {(['ALL', 'AMD', 'Intel', 'Apple'] as const).map(b => (
                          <button
                            key={b}
                            onClick={() => setCpuBrandFilter(b)}
                            className={`px-2 py-0.5 rounded transition-colors ${
                              cpuBrandFilter === b ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-y-auto divide-y divide-white/5">
                      {filteredCpus.map(cpu => (
                        <div
                          key={cpu.id}
                          onClick={() => {
                            setSelectedCpuId(cpu.id);
                            setIsCpuDropdownOpen(false);
                          }}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors hover:bg-emerald-600/20 ${
                            cpu.id === selectedCpuId ? 'bg-emerald-600/30' : ''
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{cpu.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {cpu.brand} • {cpu.cores}C/{cpu.threads}T • Tier {cpu.tier}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. RAM Capacity */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    System RAM Capacity
                  </span>
                  <span className="text-xs font-mono text-slate-400">{ramGb} GB</span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {RAM_CAPACITY_OPTIONS.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setRamGb(size)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        ramGb === size 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md' 
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                      }`}
                    >
                      {size}GB
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Hardware Options (When in Advanced Mode) */}
              {mode === 'advanced' && (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 space-y-4 animate-in fade-in duration-200">
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Detailed Hardware Parameters
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* VRAM Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300">GPU VRAM</label>
                      <select
                        value={vramGb}
                        onChange={(e) => setVramGb(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 text-white focus:border-purple-500"
                      >
                        {VRAM_OPTIONS_CALCULATOR.map(v => (
                          <option key={v} value={v}>{v} GB VRAM</option>
                        ))}
                      </select>
                    </div>

                    {/* RAM Channel */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300">Memory Channel</label>
                      <select
                        value={ramChannel}
                        onChange={(e) => setRamChannel(e.target.value as RamChannel)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 text-white focus:border-purple-500"
                      >
                        <option value="dual">Dual Channel (Recommended)</option>
                        <option value="single">Single Channel (Bandwidth Penalty)</option>
                      </select>
                    </div>

                    {/* Storage Type */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-300">Storage Drive</label>
                      <select
                        value={storageType}
                        onChange={(e) => setStorageType(e.target.value as StorageType)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/10 text-white focus:border-purple-500"
                      >
                        <option value="nvme_ssd">NVMe M.2 SSD (Fastest)</option>
                        <option value="sata_ssd">SATA 2.5&quot; SSD</option>
                        <option value="hdd">Mechanical HDD (Prone to stutter)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Resolution, Presets & Graphics Settings (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* 1. Resolution */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Display Resolution</span>
                  <span className="text-xs font-mono text-purple-400">Default: 1080p</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['720p', '900p', '1080p', '1440p', '4k'] as ResolutionOption[]).map(res => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        resolution === res
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-md'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                      }`}
                    >
                      {res === '4k' ? '4K / 2160p' : res}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Graphics Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Graphics Quality Preset</span>
                  <span className="text-xs font-mono text-slate-400">{PRESET_DEFINITIONS[graphicsPreset]?.label}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high', 'ultra'] as GraphicsPreset[]).map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGraphicsPreset(preset)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                        graphicsPreset === preset
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200 shadow-md'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Target FPS */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Your Target FPS Goal</span>
                  <span className="text-xs font-mono text-emerald-400">{targetFps} FPS</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 60, 120, 144].map(fps => (
                    <button
                      key={fps}
                      type="button"
                      onClick={() => setTargetFps(fps)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        targetFps === fps
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-md'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Upscaling Technology (DLSS / FSR / XeSS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                  <span>Upscaling (DLSS / FSR / XeSS)</span>
                  <span className="text-[10px] text-slate-400">Contextual to Game</span>
                </div>
                <select
                  value={upscaling}
                  onChange={(e) => setUpscaling(e.target.value as UpscalingTech)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="off">Off (Native Resolution)</option>
                  {activeGame.supportsDlss && (
                    <>
                      <option value="dlss_quality">NVIDIA DLSS — Quality (+30% FPS)</option>
                      <option value="dlss_balanced">NVIDIA DLSS — Balanced (+45% FPS)</option>
                      <option value="dlss_perf">NVIDIA DLSS — Performance (+65% FPS)</option>
                    </>
                  )}
                  {activeGame.supportsFsr && (
                    <>
                      <option value="fsr_quality">AMD FSR — Quality (+28% FPS)</option>
                      <option value="fsr_balanced">AMD FSR — Balanced (+42% FPS)</option>
                      <option value="fsr_perf">AMD FSR — Performance (+62% FPS)</option>
                    </>
                  )}
                  {activeGame.supportsXeSS && (
                    <>
                      <option value="xess_quality">Intel XeSS — Quality (+25% FPS)</option>
                      <option value="xess_balanced">Intel XeSS — Balanced (+38% FPS)</option>
                    </>
                  )}
                </select>
              </div>

              {/* 5. Ray Tracing (if game supports it) */}
              {activeGame.supportsRayTracing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
                    <span className="flex items-center gap-1">
                      <span>Ray Tracing</span>
                      <span className="text-[10px] text-amber-400 font-normal">(Heavy FPS Impact)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(['off', 'low', 'medium', 'ultra'] as RayTracingSetting[]).map(rt => (
                      <button
                        key={rt}
                        type="button"
                        onClick={() => setRayTracing(rt)}
                        className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                          rayTracing === rt
                            ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Frame Generation (if game supports it) */}
              {activeGame.supportsFrameGen && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                    <span>Frame Generation (DLSS 3 / FSR 3)</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={frameGeneration === 'on'}
                        onChange={(e) => setFrameGeneration(e.target.checked ? 'on' : 'off')}
                        className="rounded border-white/20 bg-slate-900 text-purple-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-white font-mono">Enable</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Generates interpolated visual frames to increase smoothness. Latency remains governed by your base native render rate.
                  </p>
                </div>
              )}

              {/* Big "CHECK PERFORMANCE" Button */}
              <div className="pt-2">
                <button
                  id="btn-check-performance"
                  type="button"
                  onClick={() => handleCalculate(true)}
                  disabled={isCalculating}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] cursor-pointer"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Analyzing Hardware & Engine Data...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                      <span>CHECK PERFORMANCE</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* RESULTS SECTION */}
        {hasCalculated && result && (
          <div ref={resultsRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
            
            {/* Primary Result Hero Card */}
            <div className={`rounded-2xl border p-6 sm:p-8 shadow-2xl relative overflow-hidden ${
              result.status === 'good'
                ? 'bg-gradient-to-br from-[#0c1626] via-[#0d1222] to-[#070913] border-emerald-500/40 shadow-emerald-950/30'
                : result.status === 'playable'
                  ? 'bg-gradient-to-br from-[#1b1910] via-[#0d1222] to-[#070913] border-amber-500/40 shadow-amber-950/30'
                  : 'bg-gradient-to-br from-[#1d1012] via-[#0d1222] to-[#070913] border-red-500/40 shadow-red-950/30'
            }`}>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <span>{activeGame.title}</span>
                    <span>•</span>
                    <span className="text-slate-300">{result.resolutionLabel}</span>
                    <span>•</span>
                    <span className="text-slate-300">{result.presetLabel}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-baseline gap-4 mt-2">
                    <span className="text-4xl sm:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                      {result.minFps}–{result.maxFps}
                      <span className="text-xl sm:text-2xl font-bold text-slate-400 ml-2">FPS</span>
                    </span>

                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 font-mono ${
                      result.status === 'good'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : result.status === 'playable'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      <span className={`w-2 h-2 rounded-full animate-pulse ${
                        result.status === 'good' ? 'bg-emerald-400' : result.status === 'playable' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      <span>{result.status === 'good' ? '🟢 Good Performance' : result.status === 'playable' ? '🟡 Playable' : '🔴 Below Target'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    {result.meetsTarget 
                      ? `Meets your ${result.targetFps} FPS target with good stability.` 
                      : `Falls below your ${result.targetFps} FPS goal. Consider recommended settings below.`
                    }
                  </p>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-3 shrink-0">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Average</div>
                    <div className="text-xl font-black text-white font-mono mt-0.5">{result.avgFps}</div>
                    <div className="text-[10px] text-slate-500">FPS</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">1% Low</div>
                    <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                      {result.onePercentLowFps || '~'}
                    </div>
                    <div className="text-[10px] text-slate-500">FPS</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Frame Time</div>
                    <div className="text-xl font-black text-purple-300 font-mono mt-0.5">{result.frameTimeMs}</div>
                    <div className="text-[10px] text-slate-500">ms</div>
                  </div>
                </div>
              </div>

              {/* 1% Lows & Frame Time Note */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <em>&quot;1% lows can help show how smooth gameplay may feel during heavier moments.&quot;</em>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareResults}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Summary' : 'Share Results'}</span>
                  </button>
                </div>
              </div>

              {/* Frame Generation Split Disclosure */}
              {result.frameGenerationDetails && (
                <div className="mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1.5">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Frame Generation Transparency Breakdown</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-slate-300">Native Render Rate: <strong className="text-white">{result.frameGenerationDetails.nativeFpsRange}</strong></span>
                    <span className="text-slate-500">|</span>
                    <span className="text-purple-300">Generated Frame Rate: <strong className="text-purple-200">{result.frameGenerationDetails.generatedFpsRange}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {result.frameGenerationDetails.explanation}
                  </p>
                </div>
              )}

              {/* VRAM Warning Alert */}
              {result.vramWarning && (
                <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{result.vramWarning}</span>
                </div>
              )}
            </div>

            {/* Hardware Bottleneck & Compatibility Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Bottleneck Assessment */}
              <div className="p-6 rounded-2xl bg-[#0e1122] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Hardware Bottleneck Analysis
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {result.bottleneck.confidence.toUpperCase()} CONFIDENCE
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
                  <div className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    {result.bottleneck.component === 'balanced' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{result.bottleneck.headline}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.bottleneck.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleUpgradeAdvice}
                    disabled={isUpgradeLoading}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{isUpgradeLoading ? 'Analyzing Parts...' : '🤖 What Should I Upgrade?'}</span>
                  </button>

                  <button
                    onClick={handleExplainResult}
                    disabled={isAiLoading}
                    className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiLoading ? 'Explaining...' : '🤖 Explain My Result'}</span>
                  </button>
                </div>

                {/* AI Upgrade Output */}
                {upgradeAdvice && (
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span>Upgrade Advisor Insight</span>
                    </div>
                    <div className="whitespace-pre-line leading-relaxed text-slate-300 text-[11px]">
                      {upgradeAdvice}
                    </div>
                  </div>
                )}

                {/* AI Explanation Output */}
                {aiExplanation && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>AI Analysis Summary</span>
                    </div>
                    <p className="leading-relaxed text-slate-300 text-[11px]">
                      {aiExplanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Hardware Requirements Compatibility */}
              <div className="p-6 rounded-2xl bg-[#0e1122] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  Hardware Compatibility Check
                </h3>

                <div className="space-y-2.5">
                  {/* CPU Check */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      Processor (CPU)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.hardwareCheck.cpu.status === 'exceeds' ? 'bg-emerald-500/20 text-emerald-300' :
                      result.hardwareCheck.cpu.status === 'meets' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {result.hardwareCheck.cpu.status === 'exceeds' ? '✅ Exceeds Recommended' : result.hardwareCheck.cpu.status === 'meets' ? '✅ Meets Minimum' : '⚠️ Below Recommended'}
                    </span>
                  </div>

                  {/* GPU Check */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                      Graphics Card (GPU)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.hardwareCheck.gpu.status === 'exceeds' ? 'bg-emerald-500/20 text-emerald-300' :
                      result.hardwareCheck.gpu.status === 'meets' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {result.hardwareCheck.gpu.status === 'exceeds' ? '✅ Exceeds Recommended' : result.hardwareCheck.gpu.status === 'meets' ? '✅ Meets Minimum' : '⚠️ Below Recommended'}
                    </span>
                  </div>

                  {/* RAM Check */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      System RAM ({ramGb} GB)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.hardwareCheck.ram.status === 'exceeds' ? 'bg-emerald-500/20 text-emerald-300' :
                      result.hardwareCheck.ram.status === 'meets' ? 'bg-cyan-500/20 text-cyan-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {result.hardwareCheck.ram.status === 'exceeds' ? '✅ Exceeds' : result.hardwareCheck.ram.status === 'meets' ? '✅ Meets' : '⚠️ Low'}
                    </span>
                  </div>

                  {/* VRAM Check */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-purple-400" />
                      VRAM ({vramGb} GB)
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.hardwareCheck.vram.status === 'exceeds' ? 'bg-emerald-500/20 text-emerald-300' :
                      result.hardwareCheck.vram.status === 'close' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {result.hardwareCheck.vram.status === 'exceeds' ? '✅ Ample Headroom' : result.hardwareCheck.vram.status === 'close' ? '⚠️ Near Capacity' : '❌ Constrained'}
                    </span>
                  </div>

                  {/* Storage Check */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      Drive Type ({storageType === 'nvme_ssd' ? 'NVMe SSD' : storageType === 'sata_ssd' ? 'SATA SSD' : 'HDD'})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      result.hardwareCheck.storage.status === 'exceeds' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {result.hardwareCheck.storage.status === 'exceeds' ? '✅ Optimal NVMe' : '⚠️ Asset Streaming'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Recommended Settings Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0e1122] to-cyan-950/40 border border-purple-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Recommended Settings Sweet Spot (60+ FPS Stable)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tuned specifically for your {currentCalculationInput.gpuName} to balance sharpness and fluid frame pacing.
                  </p>
                </div>
                <div className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 self-start sm:self-auto">
                  Expected: {result.recommendedSettings.expectedFpsRange}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Resolution</div>
                  <div className="text-sm font-bold text-white mt-1">{result.recommendedSettings.resolution}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Preset</div>
                  <div className="text-sm font-bold text-white mt-1">{result.recommendedSettings.preset}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Ray Tracing</div>
                  <div className="text-sm font-bold text-white mt-1">{result.recommendedSettings.rayTracing}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Upscaling</div>
                  <div className="text-sm font-bold text-white mt-1">{result.recommendedSettings.upscaling}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic pt-1">
                &quot;{result.recommendedSettings.reasoning}&quot;
              </p>
            </div>

            {/* Performance Comparison Across Configurations */}
            <div className="p-6 rounded-2xl bg-[#0e1122] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Performance Across Configurations
              </h3>
              <p className="text-xs text-slate-400">
                How your PC scales across common resolutions and presets in {activeGame.title}:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {result.comparisons.map((comp, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      comp.badge === 'Selected'
                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-950/40'
                        : 'bg-slate-900/80 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">{comp.name}</span>
                      {comp.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-mono">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-black text-white font-mono mt-2">
                      {comp.fpsRange}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      ~{comp.avgFps} Average FPS
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* "What If?" Interactive Sandbox */}
            <div className="p-6 rounded-2xl bg-[#0e1122] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                    &quot;What If?&quot; Instant Settings Sandbox
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adjust graphics parameters in real time to immediately test estimated performance deltas:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* What If Resolution */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">Target Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => handleWhatIfChange({ resolution: e.target.value as ResolutionOption })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  >
                    <option value="720p">720p (HD)</option>
                    <option value="900p">900p (HD+)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="1440p">1440p (QHD)</option>
                    <option value="4k">4K (2160p)</option>
                  </select>
                </div>

                {/* What If Preset */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">Graphics Quality</label>
                  <select
                    value={graphicsPreset}
                    onChange={(e) => handleWhatIfChange({ graphicsPreset: e.target.value as GraphicsPreset })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  >
                    <option value="low">Low Settings</option>
                    <option value="medium">Medium Settings</option>
                    <option value="high">High Settings</option>
                    <option value="ultra">Ultra Settings</option>
                  </select>
                </div>

                {/* What If Upscaling */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">Upscaling Mode</label>
                  <select
                    value={upscaling}
                    onChange={(e) => handleWhatIfChange({ upscaling: e.target.value as UpscalingTech })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 text-white focus:border-purple-500"
                  >
                    <option value="off">Off (Native)</option>
                    <option value="dlss_quality">DLSS Quality (+30%)</option>
                    <option value="dlss_perf">DLSS Performance (+65%)</option>
                    <option value="fsr_quality">FSR Quality (+28%)</option>
                    <option value="fsr_perf">FSR Performance (+62%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data Source & Accuracy Transparency Disclaimer */}
            <div className="p-6 rounded-2xl bg-[#090b16] border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {result.dataSource.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    {result.dataSource.description}
                  </span>
                </div>
              </div>

              {/* Strict Required Performance Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-xs text-slate-400 leading-relaxed font-['Inter']">
                <strong className="text-slate-200">Accuracy & Performance Disclaimer:</strong> FPS estimates are approximate. Actual performance can vary depending on game updates, drivers, operating system, background applications, temperatures, power limits, hardware configuration, graphics settings and other factors. This calculator is intended as a general performance estimate and should not be treated as a guaranteed benchmark for your exact system.
              </div>
            </div>

          </div>
        )}

        {/* Educational Content & FAQ Section */}
        <div className="rounded-2xl bg-[#0e1122] border border-white/10 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
              Understanding PC Gaming Performance & FPS Metrics
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              A transparent guide to reading frame rates, resolving bottlenecks, and configuring graphics presets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
              <div className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-400" />
                <span>Average FPS vs 1% Lows</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Average FPS shows overall speed, but 1% lows reveal frame-time spikes. If your average is 80 FPS but your 1% low is 35 FPS, you will experience stuttering during intense combat.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
              <div className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>CPU vs GPU Bottlenecks</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                At 1080p, your CPU frequently limits maximum frame rates in esports or crowded cities. At 1440p and 4K, pixel rasterization shifts the primary load onto the GPU shader pipelines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
              <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Frame Gen vs Native Frames</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Frame Generation (DLSS 3 / FSR 3) inserts AI-interpolated frames. While motion appears smoother, mouse input latency is tied to the base native render rate.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="pt-4 space-y-3">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Frequently Asked Questions
            </h3>

            {[
              {
                q: 'How accurate is the Game Vault FPS Calculator?',
                a: 'Our calculator utilizes verified in-engine benchmark telemetry from major gaming engines, cross-referenced with standardized GPU compute tiers and CPU single/multi-core throughput. While actual in-game performance varies by driver version, thermal throttling, and background software, our estimates provide an accurate, non-hyped performance envelope.'
              },
              {
                q: 'Why does the calculator show an FPS range instead of a single number?',
                a: 'Real games never run at a fixed single frame rate. In-game performance fluctuates continuously depending on camera angle, explosions, crowd density, weather effects, and map location. Displaying a range (e.g. 72–88 FPS) accurately reflects real-world variability.'
              },
              {
                q: 'What should I do if my GPU has limited VRAM?',
                a: 'If your VRAM is close to full capacity, lower Texture Quality, Shadows, and Volumetric Fog by one step. These settings use significant video memory without dramatically degrading visual geometry.'
              },
              {
                q: 'Can I check an unlisted PC game?',
                a: 'Yes! Select the closest engine or genre profile in the game dropdown, or use the general modern title profile to simulate architectural performance.'
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="rounded-xl bg-slate-900/80 border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-purple-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Cross-Links to other tools */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Explore more Game Vault tools:</span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab ? onNavigateTab('pc-requirements') : null}
                className="hover:text-purple-300 transition-colors underline underline-offset-4"
              >
                PC Game Requirements Checker
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab ? onNavigateTab('gaming-pc-builder') : null}
                className="hover:text-purple-300 transition-colors underline underline-offset-4"
              >
                Gaming PC Builder
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab ? onNavigateTab('vault-ai') : null}
                className="hover:text-purple-300 transition-colors underline underline-offset-4"
              >
                Vault AI Assistant
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Custom Game Calibration Modal */}
      <CustomGameCalibrationModal
        isOpen={isCustomGameModalOpen}
        onClose={() => setIsCustomGameModalOpen(false)}
        initialTitle={modalInitialTitle}
        onSaveGame={handleSaveCalibratedCustomGame}
      />
    </div>
  );
};
