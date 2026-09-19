import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Sliders, 
  Cpu, 
  Monitor, 
  Zap, 
  Flame, 
  Check, 
  Layers, 
  HelpCircle,
  Gamepad2
} from 'lucide-react';
import { GamePerformanceProfile, createUniversalGameProfile } from '../../data/fpsCalculatorData';

interface CustomGameCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  onSaveGame: (profile: GamePerformanceProfile) => void;
}

export const CustomGameCalibrationModal: React.FC<CustomGameCalibrationModalProps> = ({
  isOpen,
  onClose,
  initialTitle = '',
  onSaveGame
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [genre, setGenre] = useState('Action / PC Game');
  const [demandTier, setDemandTier] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [cpuHeavy, setCpuHeavy] = useState(false);
  const [supportsRayTracing, setSupportsRayTracing] = useState(false);
  const [supportsDlss, setSupportsDlss] = useState(true);
  const [supportsFsr, setSupportsFsr] = useState(true);
  const [supportsXeSS, setSupportsXeSS] = useState(true);
  const [supportsFrameGen, setSupportsFrameGen] = useState(false);
  const [engine, setEngine] = useState('DirectX 12 Engine');

  useEffect(() => {
    if (isOpen) {
      const clean = (initialTitle || '').trim();
      setTitle(clean);
      if (clean) {
        // Auto-generate initial smart guess
        const auto = createUniversalGameProfile(clean);
        setGenre(auto.genre);
        setDemandTier(auto.demandTier);
        setCpuHeavy(auto.cpuHeavy);
        setSupportsRayTracing(auto.supportsRayTracing);
        setSupportsDlss(auto.supportsDlss);
        setSupportsFsr(auto.supportsFsr);
        setSupportsXeSS(auto.supportsXeSS);
        setSupportsFrameGen(auto.supportsFrameGen);
        setEngine(auto.engine);
      }
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const applyPreset = (preset: 'indie' | 'esports' | 'sim' | 'aaa' | 'nextgen') => {
    if (preset === 'indie') {
      setDemandTier(1);
      setCpuHeavy(false);
      setSupportsRayTracing(false);
      setSupportsFrameGen(false);
      setGenre('Indie / 2D');
      setEngine('Lightweight 2D / C#');
    } else if (preset === 'esports') {
      setDemandTier(2);
      setCpuHeavy(false);
      setSupportsRayTracing(false);
      setSupportsFrameGen(false);
      setGenre('Competitive Esports');
      setEngine('Competitive Low-Latency Engine');
    } else if (preset === 'sim') {
      setDemandTier(3);
      setCpuHeavy(true);
      setSupportsRayTracing(false);
      setSupportsFrameGen(false);
      setGenre('Simulation / 4X / Strategy');
      setEngine('Complex Simulation & AI Engine');
    } else if (preset === 'aaa') {
      setDemandTier(4);
      setCpuHeavy(false);
      setSupportsRayTracing(true);
      setSupportsFrameGen(true);
      setGenre('AAA Action / RPG');
      setEngine('Modern DirectX 12 Engine');
    } else if (preset === 'nextgen') {
      setDemandTier(5);
      setCpuHeavy(true);
      setSupportsRayTracing(true);
      setSupportsFrameGen(true);
      setGenre('Next-Gen / Path Tracing');
      setEngine('Unreal Engine 5 (Nanite & Lumen)');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const profile = createUniversalGameProfile(title.trim(), {
      genre,
      demandTier,
      cpuHeavy,
      supportsRayTracing,
      supportsDlss,
      supportsFsr,
      supportsXeSS,
      supportsFrameGen,
      engine
    });

    onSaveGame(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0e1122] border border-purple-500/30 shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Benchmark Any PC Game on Earth
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full font-mono">
                  Universal Profiler
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Calibrate engine specs to calculate real FPS and hardware bottlenecks for any game.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 text-left">
          {/* Game Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Subnautica, Civilization VII, Crysis 4, Deadlock..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-medium"
              autoFocus
            />
          </div>

          {/* Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Quick Engine Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('indie')}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  demandTier === 1 
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200' 
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🌱 Indie 2D</span>
                <span className="text-[10px] opacity-70">Tier 1</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('esports')}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  demandTier === 2 
                    ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200' 
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>⚡ Esports</span>
                <span className="text-[10px] opacity-70">Tier 2</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('sim')}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  demandTier === 3 && cpuHeavy
                    ? 'bg-amber-600/30 border-amber-500 text-amber-200' 
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🏙️ Sim / 4X</span>
                <span className="text-[10px] opacity-70">Tier 3 (CPU)</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('aaa')}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  demandTier === 4 
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200' 
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>💥 AAA Action</span>
                <span className="text-[10px] opacity-70">Tier 4</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('nextgen')}
                className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all col-span-2 sm:col-span-1 ${
                  demandTier === 5 
                    ? 'bg-rose-600/30 border-rose-500 text-rose-200' 
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🌌 UE5 Next-Gen</span>
                <span className="text-[10px] opacity-70">Tier 5</span>
              </button>
            </div>
          </div>

          {/* Demand Tier Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Graphical Demand Tier: {demandTier} / 5
              </label>
              <span className="text-xs font-mono text-slate-400">
                {demandTier === 1 && 'Lightweight (runs on iGPU/GTX 1050)'}
                {demandTier === 2 && 'Moderate 3D (GTX 1660 / RX 580)'}
                {demandTier === 3 && 'Mainstream AA/AAA (RTX 2060 / RX 6600)'}
                {demandTier === 4 && 'Heavy AAA (RTX 3060 / RX 6700 XT)'}
                {demandTier === 5 && 'Extreme Next-Gen / Path Traced (RTX 4070+)'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={demandTier}
              onChange={(e) => setDemandTier(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>1: Lightweight</span>
              <span>2: Esports</span>
              <span>3: Mainstream</span>
              <span>4: Heavy AAA</span>
              <span>5: Next-Gen UE5</span>
            </div>
          </div>

          {/* Engine & CPU Demand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Engine / Genre
              </label>
              <input
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                placeholder="e.g. Unreal Engine 5, Unity, Custom"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                CPU Bottleneck Profile
              </label>
              <div 
                onClick={() => setCpuHeavy(!cpuHeavy)}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  cpuHeavy 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Cpu className="w-4 h-4" />
                  <span>Heavy CPU Simulation (RTS/MMO/Physics)</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${cpuHeavy ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/20'}`}>
                  {cpuHeavy && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Supported Technologies */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Supported Graphics Technologies
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/10 cursor-pointer hover:border-white/20 transition-all text-xs text-white">
                <input
                  type="checkbox"
                  checked={supportsDlss}
                  onChange={(e) => setSupportsDlss(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span>DLSS 2 / 3</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/10 cursor-pointer hover:border-white/20 transition-all text-xs text-white">
                <input
                  type="checkbox"
                  checked={supportsFsr}
                  onChange={(e) => setSupportsFsr(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span>AMD FSR</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/10 cursor-pointer hover:border-white/20 transition-all text-xs text-white">
                <input
                  type="checkbox"
                  checked={supportsRayTracing}
                  onChange={(e) => setSupportsRayTracing(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span>Ray Tracing</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/10 cursor-pointer hover:border-white/20 transition-all text-xs text-white">
                <input
                  type="checkbox"
                  checked={supportsFrameGen}
                  onChange={(e) => setSupportsFrameGen(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span>Frame Gen</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Benchmark &amp; Calculate FPS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
