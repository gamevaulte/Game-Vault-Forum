import React, { useState } from 'react';
import { 
  Monitor, 
  Cpu, 
  Tv, 
  HardDrive, 
  Layers, 
  Save, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  Check, 
  RefreshCw,
  X
} from 'lucide-react';
import { UserPcSpec, CpuSpec, GpuSpec } from '../../types/pcRequirements';
import { 
  CPU_DATABASE, 
  GPU_DATABASE, 
  RAM_OPTIONS, 
  VRAM_OPTIONS, 
  OS_OPTIONS 
} from '../../data/pcRequirementsData';
import { detectBrowserHardware } from '../../lib/pcRequirementsChecker';

interface HardwareSelectorProps {
  userPc: UserPcSpec;
  onChangeUserPc: (updated: UserPcSpec) => void;
  onCheckMyPc: () => void;
  onSavePc: () => void;
  isSaved?: boolean;
}

export const HardwareSelector: React.FC<HardwareSelectorProps> = ({
  userPc,
  onChangeUserPc,
  onCheckMyPc,
  onSavePc,
  isSaved
}) => {
  const [showDetectModal, setShowDetectModal] = useState(false);
  const [detectResult, setDetectResult] = useState<ReturnType<typeof detectBrowserHardware> | null>(null);
  const [cpuSearch, setCpuSearch] = useState('');
  const [gpuSearch, setGpuSearch] = useState('');
  const [isCpuOpen, setIsCpuOpen] = useState(false);
  const [isGpuOpen, setIsGpuOpen] = useState(false);

  // Grouped CPUs
  const filteredCpus = CPU_DATABASE.filter(
    (c) =>
      c.name.toLowerCase().includes(cpuSearch.toLowerCase()) ||
      c.brand.toLowerCase().includes(cpuSearch.toLowerCase())
  );

  // Grouped GPUs
  const filteredGpus = GPU_DATABASE.filter(
    (g) =>
      g.name.toLowerCase().includes(gpuSearch.toLowerCase()) ||
      g.brand.toLowerCase().includes(gpuSearch.toLowerCase()) ||
      g.series.toLowerCase().includes(gpuSearch.toLowerCase())
  );

  const handleRunDetection = () => {
    const res = detectBrowserHardware();
    setDetectResult(res);
    setShowDetectModal(true);

    // Apply any detected matched values if found
    const updated: Partial<UserPcSpec> = {};
    if (res.matchedCpu) {
      updated.cpuId = res.matchedCpu.id;
      updated.cpuName = res.matchedCpu.name;
    }
    if (res.matchedGpu) {
      updated.gpuId = res.matchedGpu.id;
      updated.gpuName = res.matchedGpu.name;
      updated.vramGb = res.matchedGpu.vramGb;
    }
    if (res.detectedRamGb) {
      updated.ramGb = res.detectedRamGb;
    }
    if (Object.keys(updated).length > 0) {
      onChangeUserPc({
        ...userPc,
        ...updated
      });
    }
  };

  const handleSelectCpu = (cpu: CpuSpec) => {
    onChangeUserPc({
      ...userPc,
      cpuId: cpu.id,
      cpuName: cpu.name
    });
    setIsCpuOpen(false);
    setCpuSearch('');
  };

  const handleSelectGpu = (gpu: GpuSpec) => {
    onChangeUserPc({
      ...userPc,
      gpuId: gpu.id,
      gpuName: gpu.name,
      vramGb: gpu.vramGb // auto populate VRAM
    });
    setIsGpuOpen(false);
    setGpuSearch('');
  };

  return (
    <div className="w-full bg-[#121422]/95 border border-purple-500/25 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/20">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="w-5 h-5 text-purple-400" />
            <h3 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wider">
              Enter Your PC Specifications
            </h3>
          </div>
          <p className="text-gray-400 text-sm">
            Select your processor, graphics card, RAM, and storage to test compatibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Detect Hardware Button */}
          <button
            type="button"
            onClick={handleRunDetection}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Detect My PC</span>
          </button>

          {/* Save My PC Button */}
          <button
            type="button"
            onClick={onSavePc}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isSaved ? 'Saved to Browser' : 'Save My PC'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Spec Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 1. CPU SELECTOR */}
        <div className="relative">
          <label className="flex items-center justify-between text-xs text-gray-300 uppercase font-['Space_Grotesk'] font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Processor (CPU)
            </span>
            <span className="text-[11px] text-gray-400 font-normal normal-case">
              Intel Core / AMD Ryzen
            </span>
          </label>

          <button
            type="button"
            onClick={() => setIsCpuOpen(!isCpuOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 hover:border-cyan-400/60 text-left transition-colors cursor-pointer"
          >
            <span className="font-bold font-['Rajdhani'] text-white text-base truncate">
              {userPc.cpuName}
            </span>
            <span className="text-xs text-cyan-400 font-bold uppercase font-['Rajdhani'] ml-2 shrink-0">
              {isCpuOpen ? 'Close' : 'Change'}
            </span>
          </button>

          {isCpuOpen && (
            <div className="absolute z-30 left-0 right-0 mt-2 bg-[#161828] border border-purple-500/40 rounded-xl p-3 shadow-2xl max-h-72 flex flex-col">
              <input
                type="text"
                value={cpuSearch}
                onChange={(e) => setCpuSearch(e.target.value)}
                placeholder="Search CPU (e.g. Ryzen 5 5600, i5-12400F, i7-13700K)..."
                className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm mb-2 outline-none focus:border-cyan-400"
                autoFocus
              />
              <div className="overflow-y-auto space-y-1 flex-1 pr-1">
                {filteredCpus.map((cpu) => (
                  <button
                    key={cpu.id}
                    type="button"
                    onClick={() => handleSelectCpu(cpu)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      userPc.cpuId === cpu.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{cpu.name}</span>
                    <span className="text-[10px] text-gray-400 font-['Space_Grotesk']">
                      {cpu.cores}C / {cpu.threads}T
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. GPU SELECTOR */}
        <div className="relative">
          <label className="flex items-center justify-between text-xs text-gray-300 uppercase font-['Space_Grotesk'] font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-purple-400" />
              Graphics Card (GPU)
            </span>
            <span className="text-[11px] text-gray-400 font-normal normal-case">
              NVIDIA / AMD / Intel
            </span>
          </label>

          <button
            type="button"
            onClick={() => setIsGpuOpen(!isGpuOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 hover:border-purple-400/60 text-left transition-colors cursor-pointer"
          >
            <span className="font-bold font-['Rajdhani'] text-white text-base truncate">
              {userPc.gpuName}
            </span>
            <span className="text-xs text-purple-400 font-bold uppercase font-['Rajdhani'] ml-2 shrink-0">
              {isGpuOpen ? 'Close' : 'Change'}
            </span>
          </button>

          {isGpuOpen && (
            <div className="absolute z-30 left-0 right-0 mt-2 bg-[#161828] border border-purple-500/40 rounded-xl p-3 shadow-2xl max-h-72 flex flex-col">
              <input
                type="text"
                value={gpuSearch}
                onChange={(e) => setGpuSearch(e.target.value)}
                placeholder="Search GPU (e.g. RTX 3060, RX 6700 XT, RTX 4070, GTX 1660)..."
                className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-lg text-white text-sm mb-2 outline-none focus:border-purple-400"
                autoFocus
              />
              <div className="overflow-y-auto space-y-1 flex-1 pr-1">
                {filteredGpus.map((gpu) => (
                  <button
                    key={gpu.id}
                    type="button"
                    onClick={() => handleSelectGpu(gpu)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      userPc.gpuId === gpu.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{gpu.name}</span>
                    <span className="text-[10px] text-gray-400 font-['Space_Grotesk']">
                      {gpu.vramGb} GB VRAM
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. SYSTEM RAM (MEMORY) */}
        <div>
          <label className="flex items-center justify-between text-xs text-gray-300 uppercase font-['Space_Grotesk'] font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              System RAM (Memory)
            </span>
            <span className="text-cyan-300 font-bold font-['Rajdhani'] text-sm">
              {userPc.ramGb} GB Selected
            </span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {RAM_OPTIONS.slice(0, 6).map((ram) => (
              <button
                key={ram}
                type="button"
                onClick={() => onChangeUserPc({ ...userPc, ramGb: ram })}
                className={`py-2.5 rounded-xl font-['Rajdhani'] font-bold text-sm tracking-wider transition-all cursor-pointer ${
                  userPc.ramGb === ram
                    ? 'bg-cyan-500 text-black border border-cyan-300 shadow-md shadow-cyan-950/50'
                    : 'bg-black/40 text-gray-300 hover:text-white border border-white/5 hover:bg-white/5'
                }`}
              >
                {ram} GB
              </button>
            ))}
          </div>
        </div>

        {/* 4. DEDICATED VRAM */}
        <div>
          <label className="flex items-center justify-between text-xs text-gray-300 uppercase font-['Space_Grotesk'] font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-purple-400" />
              Dedicated Video RAM (VRAM)
            </span>
            <span className="text-purple-300 font-bold font-['Rajdhani'] text-sm">
              {userPc.vramGb} GB VRAM
            </span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {VRAM_OPTIONS.slice(2, 8).map((vram) => (
              <button
                key={vram}
                type="button"
                onClick={() => onChangeUserPc({ ...userPc, vramGb: vram })}
                className={`py-2.5 rounded-xl font-['Rajdhani'] font-bold text-sm tracking-wider transition-all cursor-pointer ${
                  userPc.vramGb === vram
                    ? 'bg-purple-600 text-white border border-purple-400 shadow-md shadow-purple-950/50'
                    : 'bg-black/40 text-gray-300 hover:text-white border border-white/5 hover:bg-white/5'
                }`}
              >
                {vram} GB
              </button>
            ))}
          </div>
        </div>

        {/* 5. STORAGE & DRIVE TYPE */}
        <div>
          <label className="flex items-center justify-between text-xs text-gray-300 uppercase font-['Space_Grotesk'] font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              Available Free Storage
            </span>
            <span className="text-gray-400 text-xs font-normal">
              Minimum 50-150 GB for modern games
            </span>
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="10"
                max="4000"
                value={userPc.storageGb}
                onChange={(e) =>
                  onChangeUserPc({
                    ...userPc,
                    storageGb: Math.max(0, parseInt(e.target.value, 10) || 0)
                  })
                }
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-['Rajdhani'] font-bold text-base outline-none focus:border-emerald-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-['Rajdhani'] font-bold text-gray-400 uppercase">
                GB FREE
              </span>
            </div>

            {/* SSD vs HDD Toggle */}
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => onChangeUserPc({ ...userPc, storageType: 'SSD' })}
                className={`px-3 py-2 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer ${
                  userPc.storageType === 'SSD'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SSD (Fast)
              </button>
              <button
                type="button"
                onClick={() => onChangeUserPc({ ...userPc, storageType: 'HDD' })}
                className={`px-3 py-2 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer ${
                  userPc.storageType === 'HDD'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                HDD
              </button>
            </div>
          </div>
        </div>

        {/* 6. OPERATING SYSTEM */}
        <div>
          <label className="flex items-center justify-between text-xs text-gray-300 uppercase font-['Space_Grotesk'] font-bold tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Operating System
            </span>
            <span className="text-gray-400 text-xs font-normal">64-bit Required</span>
          </label>
          <select
            value={userPc.os}
            onChange={(e) => onChangeUserPc({ ...userPc, os: e.target.value })}
            className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white font-['Rajdhani'] font-bold text-base outline-none focus:border-purple-400 cursor-pointer"
          >
            {OS_OPTIONS.map((os) => (
              <option key={os} value={os} className="bg-[#121422] text-white">
                {os}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary CTA Button: CHECK MY PC */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCheckMyPc}
          className="w-full sm:flex-1 py-4 px-8 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-['Rajdhani'] font-bold text-xl uppercase tracking-widest shadow-xl shadow-purple-950/60 hover:shadow-cyan-950/60 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center"
        >
          Check My PC Compatibility
        </button>
      </div>

      {/* DETECT HARDWARE MODAL */}
      {showDetectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#141628] border border-purple-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setShowDetectModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h4 className="font-['Rajdhani'] font-bold text-xl text-white uppercase tracking-wider">
                Hardware Detection Results
              </h4>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 leading-relaxed mb-5">
              <p className="font-medium">{detectResult?.disclaimer}</p>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-gray-400">Logical CPU Cores:</span>
                <span className="text-white font-bold font-['Rajdhani']">
                  {detectResult?.detectedCores ? `${detectResult.detectedCores} Threads` : 'Unavailable'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-gray-400">Detected System RAM:</span>
                <span className="text-white font-bold font-['Rajdhani']">
                  {detectResult?.detectedRamGb ? `~${detectResult.detectedRamGb} GB` : 'Protected by browser sandbox'}
                </span>
              </div>
              <div className="flex flex-col p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs">
                <span className="text-gray-400 mb-1">WebGL GPU Unmasked String:</span>
                <span className="text-cyan-300 font-mono text-[11px] break-all">
                  {detectResult?.detectedGpuRenderer || 'Standard WebGL Renderer'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetectModal(false)}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-sm cursor-pointer"
            >
              Confirm Specifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
