export type ResolutionOption = '720p' | '900p' | '1080p' | '1440p' | '4k' | 'custom';

export type GraphicsPreset = 'very_low' | 'low' | 'medium' | 'high' | 'very_high' | 'ultra' | 'custom';

export type UpscalingTech = 
  | 'off'
  | 'dlss_quality'
  | 'dlss_balanced'
  | 'dlss_perf'
  | 'dlss_ultra_perf'
  | 'fsr_quality'
  | 'fsr_balanced'
  | 'fsr_perf'
  | 'fsr_ultra_perf'
  | 'xess_quality'
  | 'xess_balanced'
  | 'xess_perf';

export type RayTracingSetting = 'off' | 'low' | 'medium' | 'high' | 'ultra';

export type FrameGenerationSetting = 'off' | 'on';

export type StorageType = 'nvme_ssd' | 'sata_ssd' | 'hdd';

export type RamChannel = 'dual' | 'single';

export type CalculationMode = 'quick' | 'advanced';

export interface FpsCalculationInput {
  gameId: string;
  gameTitle: string;
  isCustomGame?: boolean;
  customGameDemand?: 'esports' | 'indie' | 'moderate_aaa' | 'heavy_aaa' | 'simulation';
  
  // GPU
  gpuId: string;
  gpuName: string;
  isLaptopGpu?: boolean;
  vramGb: number;
  
  // CPU
  cpuId: string;
  cpuName: string;
  
  // Memory & Storage
  ramGb: number;
  ramSpeedMhz?: number;
  ramChannel?: RamChannel;
  storageType?: StorageType;
  
  // Target & Display
  resolution: ResolutionOption;
  customResolution?: { width: number; height: number };
  refreshRateHz?: number;
  targetFps: number;
  vSync?: boolean;
  
  // Graphics Settings
  graphicsPreset: GraphicsPreset;
  rayTracing: RayTracingSetting;
  upscaling: UpscalingTech;
  frameGeneration: FrameGenerationSetting;
}

export interface FpsCalculationResult {
  minFps: number;
  maxFps: number;
  avgFps: number;
  onePercentLowFps: number | null;
  frameTimeMs: number;
  performanceRating: 'excellent' | 'good' | 'playable' | 'limited' | 'not_recommended';
  status: 'good' | 'playable' | 'below_target';
  meetsTarget: boolean;
  targetFps: number;
  resolutionLabel: string;
  presetLabel: string;
  
  bottleneck: {
    component: 'gpu' | 'cpu' | 'ram' | 'vram' | 'balanced' | 'insufficient_data';
    headline: string;
    explanation: string;
    confidence: 'high' | 'medium' | 'approximate';
  };
  
  hardwareCheck: {
    cpu: { meets: boolean; status: 'exceeds' | 'meets' | 'close' | 'below'; details: string };
    gpu: { meets: boolean; status: 'exceeds' | 'meets' | 'close' | 'below'; details: string };
    ram: { meets: boolean; status: 'exceeds' | 'meets' | 'close' | 'below'; details: string };
    vram: { meets: boolean; status: 'exceeds' | 'meets' | 'close' | 'below'; details: string };
    storage: { meets: boolean; status: 'exceeds' | 'meets' | 'close' | 'below'; details: string };
  };
  
  recommendedSettings: {
    resolution: string;
    preset: string;
    rayTracing: string;
    upscaling: string;
    expectedFpsRange: string;
    reasoning: string;
  };
  
  comparisons: Array<{
    name: string;
    resolution: string;
    preset: string;
    fpsRange: string;
    avgFps: number;
    badge?: string;
  }>;
  
  frameGenerationDetails?: {
    nativeFpsRange: string;
    generatedFpsRange: string;
    explanation: string;
  };
  
  vramWarning?: string | null;
  
  dataSource: {
    type: 'verified_benchmark' | 'system_requirements' | 'hardware_model' | 'manual_estimate';
    label: string;
    description: string;
    accuracyRating: 'high' | 'medium' | 'approximate';
  };
  
  hasReliableData: boolean;
  fallbackMessage?: string;
}

export interface SavedUserPc {
  cpuId: string;
  cpuName: string;
  gpuId: string;
  gpuName: string;
  ramGb: number;
  vramGb: number;
  isLaptopGpu?: boolean;
  storageType?: StorageType;
  lastUpdated?: string;
}
