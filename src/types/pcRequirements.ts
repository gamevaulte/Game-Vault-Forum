export interface GameRequirementSpec {
  os: string;
  cpu: string;
  cpuTier: number; // 1 to 10 rating
  ramGb: number;
  gpu: string;
  gpuTier: number; // 1 to 10 rating
  vramGb: number;
  storageGb: number;
  storageType?: 'SSD' | 'HDD' | 'SSD Recommended' | 'SSD Required' | (string & {});
  directX: string;
  additionalNotes?: string;
}

export interface PcGameRequirements {
  id: string;
  gameId?: string;
  title: string;
  slug: string;
  coverImage: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genre: string;
  platforms: string[];
  minimum: GameRequirementSpec;
  recommended: GameRequirementSpec;
  source: string;
  lastVerified: string;
  graphicsGuidance?: {
    resolution: string;
    preset: string;
    rayTracing: string;
    upscaling: string;
    notes?: string;
  };
}

export interface CpuSpec {
  id: string;
  name: string;
  brand: 'Intel' | 'AMD' | 'Apple';
  tier: number; // 1 to 10
  cores: number;
  threads: number;
  family: string; // e.g. "Core i5", "Ryzen 5"
}

export interface GpuSpec {
  id: string;
  name: string;
  brand: 'NVIDIA' | 'AMD' | 'Intel';
  vramGb: number;
  tier: number; // 1 to 10
  series: string; // e.g. "RTX 30 Series", "Radeon RX 6000"
}

export interface UserPcSpec {
  cpuId: string;
  cpuName: string;
  gpuId: string;
  gpuName: string;
  ramGb: number;
  vramGb: number;
  storageGb: number; // available free storage in GB
  os: string;
  storageType: 'SSD' | 'HDD';
}

export type RequirementVerdict = 'meets' | 'below-rec' | 'below-min';

export interface ComponentComparison {
  component: 'CPU' | 'GPU' | 'RAM' | 'Storage' | 'OS' | 'VRAM';
  userValue: string;
  minimum: string;
  recommended: string;
  verdict: RequirementVerdict;
  explanation: string;
}

export type OverallResultLevel =
  | 'excellent'          // 🟢 Meets or exceeds recommended
  | 'good'               // 🟢 Meets min and reasonably close to rec
  | 'minimum-met'        // 🟡 Meets min but may require reduced settings
  | 'below-recommended'  // 🟠 Meets min, but one or more below recommended
  | 'not-met';           // 🔴 One or more components below minimum

export interface CheckerResult {
  overallLevel: OverallResultLevel;
  verdictTitle: string;
  verdictStatus: 'YES' | 'PARTIALLY' | 'NO';
  summaryBadge: string;
  summaryExplanation: string;
  comparisons: ComponentComparison[];
  graphicsGuidance: {
    resolution: string;
    preset: string;
    rayTracing: string;
    upscaling: string;
    disclaimer: string;
  };
  fpsNotice: string;
}
