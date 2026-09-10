export type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'NGN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateFromUsd: number; // For approximate local estimation
}

export type BudgetTier = 'Entry Level' | 'Budget Gaming' | 'Mid-Range' | 'High-End' | 'Enthusiast';

export interface BudgetRange {
  id: BudgetTier;
  label: string;
  subtitle: string;
  minUsd: number;
  maxUsd: number;
  iconName: string;
}

export type ResolutionTarget = '1080p' | '1440p' | '4K';
export type FpsTarget = '60 FPS' | '75 FPS' | '120 FPS' | '144 FPS' | '165 FPS' | '240 FPS';

export type CpuBrandPreference = 'AMD' | 'Intel' | 'No Preference';
export type GpuBrandPreference = 'NVIDIA' | 'AMD' | 'Intel' | 'No Preference';
export type StoragePreference = '500GB' | '1TB' | '2TB' | '4TB+';
export type RamPreference = '16GB' | '32GB' | '64GB';
export type WifiPreference = 'Required' | 'Not Required';
export type RgbPreference = 'Yes' | 'No' | 'No Preference';

export interface PcBuilderPreferences {
  budgetUsd: number;
  budgetTier?: BudgetTier;
  currency: CurrencyCode;
  selectedGameIds: string[];
  noSpecificGames: boolean;
  resolution: ResolutionTarget;
  fpsTarget: FpsTarget;
  cpuPreference: CpuBrandPreference;
  gpuPreference: GpuBrandPreference;
  storagePreference: StoragePreference;
  ramPreference: RamPreference;
  wifiPreference: WifiPreference;
  rgbPreference: RgbPreference;
}

export type ComponentCategory =
  | 'cpu'
  | 'gpu'
  | 'motherboard'
  | 'ram'
  | 'storage'
  | 'psu'
  | 'cooler'
  | 'case'
  | 'os';

export interface PcComponent {
  id: string;
  category: ComponentCategory;
  manufacturer: string;
  model: string;
  specifications: string;
  socketOrInterface?: string; // e.g. AM5, LGA1700, PCIe 4.0 x16, M.2 NVMe, DDR5
  powerRequirementWatts?: number; // TDP or required wattage
  dimensions?: {
    lengthMm?: number; // for GPU
    heightMm?: number; // for cooler
    maxGpuLengthMm?: number; // for case
    maxCoolerHeightMm?: number; // for case
  };
  priceUsd: number;
  currency: CurrencyCode;
  retailer: string;
  productUrl?: string;
  dateUpdated: string;
  isAvailable: boolean;
  tierScore: number; // 1-10 relative tier
  ramType?: 'DDR4' | 'DDR5';
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX';
  hasWifi?: boolean;
  hasRgb?: boolean;
  whySelected?: string;
}

export interface CompatibilityIssue {
  componentA: string;
  componentB: string;
  severity: 'error' | 'warning';
  title: string;
  description: string;
  resolution: string;
}

export interface CompatibilityCheckResult {
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  passedChecks: string[];
}

export interface BuildBalanceScore {
  score: number; // 0-100
  rating: 'Bottlenecked' | 'Fair Balance' | 'Good Balance' | 'Well Balanced' | 'Optimally Synced';
  cpuGpuRatio: number;
  notes: string[];
}

export interface UpgradeRecommendation {
  title: string;
  benefit: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedCostUsd: number;
  category: ComponentCategory;
}

export interface SavedPcBuild {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  preferences: PcBuilderPreferences;
  components: {
    cpu: PcComponent;
    gpu: PcComponent;
    motherboard: PcComponent;
    ram: PcComponent;
    storage: PcComponent;
    psu: PcComponent;
    cooler: PcComponent;
    case: PcComponent;
    os?: PcComponent;
  };
  totalEstimatedPriceUsd: number;
  compatibility: CompatibilityCheckResult;
  balanceScore: BuildBalanceScore;
  performanceSummary: string;
  upgradeRecommendations: UpgradeRecommendation[];
}
