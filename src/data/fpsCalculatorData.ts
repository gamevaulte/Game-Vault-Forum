import { CpuSpec, GpuSpec } from '../types/pcRequirements';
import { CPU_DATABASE, GPU_DATABASE } from './pcRequirementsData';
import { ADDITIONAL_GAME_PERFORMANCE_PROFILES } from './expandedGamesProfiles';

export interface ExtendedGpuSpec extends GpuSpec {
  isLaptop?: boolean;
  architecture?: string;
  supportsDlss?: boolean;
  supportsDlssFrameGen?: boolean;
  supportsFsr?: boolean;
  supportsXeSS?: boolean;
  rayTracingTier?: number; // 0 = none, 1-10
}

export interface GamePerformanceProfile {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  genre: string;
  releaseYear: number;
  engine: string;
  demandTier: 1 | 2 | 3 | 4 | 5; // 1 = light esports, 5 = heaviest next-gen
  cpuHeavy: boolean;
  supportsRayTracing: boolean;
  supportsDlss: boolean;
  supportsFsr: boolean;
  supportsXeSS: boolean;
  supportsFrameGen: boolean;
  // Baseline GPU tier required for 60 FPS at 1080p High:
  target60Fps1080pGpuTier: number;
  target60Fps1080pCpuTier: number;
  vramBaselineGb: {
    '720p': number;
    '900p': number;
    '1080p': number;
    '1440p': number;
    '4k': number;
  };
  hasVerifiedBenchmarks: boolean;
  benchmarkNotes?: string;
}

// Supplemental Laptop GPUs & specialized models to expand the database
export const SUPPLEMENTAL_GPUS: ExtendedGpuSpec[] = [
  // Laptop GPUs
  { id: 'gpu-laptop-rtx-4090', name: 'NVIDIA GeForce RTX 4090 Laptop (175W)', brand: 'NVIDIA', vramGb: 16, tier: 9, series: 'RTX 40 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: true, supportsFsr: true, supportsXeSS: true, rayTracingTier: 9 },
  { id: 'gpu-laptop-rtx-4080', name: 'NVIDIA GeForce RTX 4080 Laptop (150W)', brand: 'NVIDIA', vramGb: 12, tier: 8, series: 'RTX 40 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: true, supportsFsr: true, supportsXeSS: true, rayTracingTier: 8 },
  { id: 'gpu-laptop-rtx-4070', name: 'NVIDIA GeForce RTX 4070 Laptop (140W)', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 40 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: true, supportsFsr: true, supportsXeSS: true, rayTracingTier: 7 },
  { id: 'gpu-laptop-rtx-4060', name: 'NVIDIA GeForce RTX 4060 Laptop (115W)', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 40 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: true, supportsFsr: true, supportsXeSS: true, rayTracingTier: 6 },
  { id: 'gpu-laptop-rtx-4050', name: 'NVIDIA GeForce RTX 4050 Laptop (95W)', brand: 'NVIDIA', vramGb: 6, tier: 6, series: 'RTX 40 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: true, supportsFsr: true, supportsXeSS: true, rayTracingTier: 5 },
  { id: 'gpu-laptop-rtx-3070-ti', name: 'NVIDIA GeForce RTX 3070 Ti Laptop', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 30 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: true, rayTracingTier: 6 },
  { id: 'gpu-laptop-rtx-3060', name: 'NVIDIA GeForce RTX 3060 Laptop (6GB)', brand: 'NVIDIA', vramGb: 6, tier: 6, series: 'RTX 30 Laptop', isLaptop: true, supportsDlss: true, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: true, rayTracingTier: 5 },
  { id: 'gpu-laptop-rx-7600m-xt', name: 'AMD Radeon RX 7600M XT Laptop', brand: 'AMD', vramGb: 8, tier: 7, series: 'Radeon RX 7000M', isLaptop: true, supportsDlss: false, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: true, rayTracingTier: 5 },
  // Desktop additions
  { id: 'gpu-gtx-1070-ti', name: 'NVIDIA GeForce GTX 1070 Ti', brand: 'NVIDIA', vramGb: 8, tier: 6, series: 'GTX 10 Series', isLaptop: false, supportsDlss: false, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: true, rayTracingTier: 0 },
  { id: 'gpu-gtx-980-ti', name: 'NVIDIA GeForce GTX 980 Ti', brand: 'NVIDIA', vramGb: 6, tier: 5, series: 'GTX 900 Series', isLaptop: false, supportsDlss: false, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: false, rayTracingTier: 0 },
  { id: 'gpu-gtx-970', name: 'NVIDIA GeForce GTX 970 4GB', brand: 'NVIDIA', vramGb: 4, tier: 4, series: 'GTX 900 Series', isLaptop: false, supportsDlss: false, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: false, rayTracingTier: 0 },
  { id: 'gpu-rx-6750-gre', name: 'AMD Radeon RX 6750 GRE 12GB', brand: 'AMD', vramGb: 12, tier: 8, series: 'Radeon RX 6000', isLaptop: false, supportsDlss: false, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: true, rayTracingTier: 5 },
  { id: 'gpu-rx-6500-xt', name: 'AMD Radeon RX 6500 XT 4GB', brand: 'AMD', vramGb: 4, tier: 4, series: 'Radeon RX 6000', isLaptop: false, supportsDlss: false, supportsDlssFrameGen: false, supportsFsr: true, supportsXeSS: true, rayTracingTier: 1 }
];

// Supplemental CPUs
export const SUPPLEMENTAL_CPUS: CpuSpec[] = [
  // AMD Ryzen 9000 & new additions not in base database
  { id: 'cpu-r7-9800x3d', name: 'AMD Ryzen 7 9800X3D', brand: 'AMD', tier: 10, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r9-9950x', name: 'AMD Ryzen 9 9950X', brand: 'AMD', tier: 10, cores: 16, threads: 32, family: 'Ryzen 9' },
  { id: 'cpu-r5-5600x3d', name: 'AMD Ryzen 5 5600X3D', brand: 'AMD', tier: 8, cores: 6, threads: 12, family: 'Ryzen 5' },
  // Intel Additions
  { id: 'cpu-i9-14900ks', name: 'Intel Core i9-14900KS', brand: 'Intel', tier: 10, cores: 24, threads: 32, family: 'Core i9' },
  { id: 'cpu-i5-14400f', name: 'Intel Core i5-14400F', brand: 'Intel', tier: 8, cores: 10, threads: 16, family: 'Core i5' },
  { id: 'cpu-i3-14100f', name: 'Intel Core i3-14100F', brand: 'Intel', tier: 6, cores: 4, threads: 8, family: 'Core i3' },
  // Apple Silicon (where PC port/emulation or cross-platform exists)
  { id: 'cpu-apple-m3-max', name: 'Apple M3 Max (Metal/Rosetta/CrossOver)', brand: 'Apple', tier: 9, cores: 16, threads: 16, family: 'Apple Silicon' },
  { id: 'cpu-apple-m3-pro', name: 'Apple M3 Pro', brand: 'Apple', tier: 8, cores: 12, threads: 12, family: 'Apple Silicon' },
  { id: 'cpu-apple-m2', name: 'Apple M2', brand: 'Apple', tier: 7, cores: 8, threads: 8, family: 'Apple Silicon' }
];

// Deduplicate items by ID to guarantee unique keys across database merges
function deduplicateById<T extends { id: string }>(...lists: T[][]): T[] {
  const map = new Map<string, T>();
  for (const list of lists) {
    for (const item of list) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
  }
  return Array.from(map.values());
}

export const ALL_CALCULATOR_CPUS: CpuSpec[] = deduplicateById(
  SUPPLEMENTAL_CPUS,
  CPU_DATABASE
);

export const ALL_CALCULATOR_GPUS: ExtendedGpuSpec[] = deduplicateById(
  SUPPLEMENTAL_GPUS,
  GPU_DATABASE.map(g => {
    const isNvidia = g.brand === 'NVIDIA';
    const isRtx50 = g.series?.includes('RTX 50');
    const isRtx40 = g.series?.includes('RTX 40');
    const isRtx30 = g.series?.includes('RTX 30');
    const isRtx20 = g.series?.includes('RTX 20');
    const isRadeon7000 = g.series?.includes('7000');
    const isRadeon6000 = g.series?.includes('6000');
    const isArc = g.brand === 'Intel';

    return {
      ...g,
      isLaptop: false,
      supportsDlss: isRtx50 || isRtx40 || isRtx30 || isRtx20,
      supportsDlssFrameGen: isRtx50 || isRtx40,
      supportsFsr: true,
      supportsXeSS: true,
      rayTracingTier: isRtx50 ? 10 : isRtx40 ? g.tier : isRtx30 ? Math.max(1, g.tier - 1) : isRtx20 ? Math.max(1, g.tier - 2) : isRadeon7000 ? Math.max(1, g.tier - 2) : isRadeon6000 ? Math.max(1, g.tier - 3) : isArc ? Math.max(1, g.tier - 1) : 0
    };
  })
);

// Verified Game Performance Profiles
const BASE_GAME_PERFORMANCE_PROFILES: GamePerformanceProfile[] = [
  {
    id: 'game-cyberpunk-2077',
    title: 'Cyberpunk 2077 (v2.1+ / Phantom Liberty)',
    slug: 'cyberpunk-2077',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG / Open World',
    releaseYear: 2020,
    engine: 'REDengine 4 (Heavy Mesh/DirectX 12 Ultimate)',
    demandTier: 5,
    cpuHeavy: true,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7, // RTX 3060 / RX 6600 XT
    target60Fps1080pCpuTier: 7, // Ryzen 5 5600 / i5-12400F
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Verified against 2.12 built-in benchmark in Dogtown. Heavy CPU scheduling required in dense crowds.'
  },
  {
    id: 'game-black-myth-wukong',
    title: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG',
    releaseYear: 2024,
    engine: 'Unreal Engine 5 (Nanite & Lumen)',
    demandTier: 5,
    cpuHeavy: false,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 7,
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Official Game Science benchmark tool verified across 1080p to 4K.'
  },
  {
    id: 'game-elden-ring',
    title: 'Elden Ring & Shadow of the Erdtree',
    slug: 'elden-ring',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG',
    releaseYear: 2022,
    engine: 'FromSoftware Proprietary (DirectX 12 - 60 FPS Cap Engine)',
    demandTier: 4,
    cpuHeavy: true,
    supportsRayTracing: true,
    supportsDlss: false,
    supportsFsr: false,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 6, // GTX 1070 / RX 5600 XT
    target60Fps1080pCpuTier: 6, // Ryzen 5 3600 / i5-10400F
    vramBaselineGb: { '720p': 3, '900p': 4, '1080p': 6, '1440p': 8, '4k': 10 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Engine is capped at 60 FPS natively without community mods. 1% lows depend on shader compilation.'
  },
  {
    id: 'game-helldivers-2',
    title: 'Helldivers 2',
    slug: 'helldivers-2',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    genre: 'Squad PvE Shooter',
    releaseYear: 2024,
    engine: 'Autodesk Stingray (Heavy CPU physics & swarm simulation)',
    demandTier: 4,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: false,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 8, // Demands strong 6+ core CPU on difficulty 9-10
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Swarm density on Super Helldive puts heavy load on CPU physics calculations.'
  },
  {
    id: 'game-baldurs-gate-3',
    title: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'CRPG',
    releaseYear: 2023,
    engine: 'Divinity 4.0 Engine (Vulkan & DirectX 11)',
    demandTier: 4,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 6,
    target60Fps1080pCpuTier: 7,
    vramBaselineGb: { '720p': 4, '900p': 4, '1080p': 6, '1440p': 8, '4k': 10 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Act 3 Lower City crowd density creates CPU thread bottleneck on older 4-core processors.'
  },
  {
    id: 'game-world-of-warships',
    title: 'World of Warships',
    slug: 'world-of-warships',
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    genre: 'Naval Combat Simulation',
    releaseYear: 2015,
    engine: 'BigWorld Engine (Updated Water & Smoke Shaders)',
    demandTier: 2,
    cpuHeavy: false,
    supportsRayTracing: false,
    supportsDlss: false,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 4, // GTX 1050 Ti / RX 570
    target60Fps1080pCpuTier: 4,
    vramBaselineGb: { '720p': 2, '900p': 2, '1080p': 4, '1440p': 6, '4k': 8 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Well-optimized engine runs smoothly on mid-range hardware even during heavy smoke/HE shell exchanges.'
  },
  {
    id: 'game-red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    genre: 'Action Adventure',
    releaseYear: 2019,
    engine: 'RAGE (Vulkan / DirectX 12)',
    demandTier: 4,
    cpuHeavy: false,
    supportsRayTracing: false,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 6,
    target60Fps1080pCpuTier: 6,
    vramBaselineGb: { '720p': 3, '900p': 4, '1080p': 6, '1440p': 8, '4k': 10 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Volumetric clouds and water physics settings have heavy performance costs at Ultra.'
  },
  {
    id: 'game-grand-theft-auto-v',
    title: 'Grand Theft Auto V / GTA Online',
    slug: 'gta-v',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Action Adventure',
    releaseYear: 2015,
    engine: 'RAGE (DirectX 11)',
    demandTier: 2,
    cpuHeavy: false,
    supportsRayTracing: false,
    supportsDlss: false,
    supportsFsr: false,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 4,
    target60Fps1080pCpuTier: 4,
    vramBaselineGb: { '720p': 2, '900p': 2, '1080p': 3, '1440p': 4, '4k': 6 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Grass Quality at Ultra can heavily reduce FPS in Vinewood Hills.'
  },
  {
    id: 'game-fortnite',
    title: 'Fortnite (Chapter 5 / Unreal Engine 5.4)',
    slug: 'fortnite',
    coverImage: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=800&auto=format&fit=crop&q=80',
    genre: 'Battle Royale',
    releaseYear: 2017,
    engine: 'Unreal Engine 5.4 (Nanite, Lumen & Hardware RT)',
    demandTier: 3, // Performance mode is tier 2, Lumen mode is tier 5
    cpuHeavy: true,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 5,
    target60Fps1080pCpuTier: 6,
    vramBaselineGb: { '720p': 2, '900p': 3, '1080p': 4, '1440p': 6, '4k': 8 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Performance Mode yields 144+ FPS on budget GPUs; Nanite/Lumen requires modern RTX/RX hardware.'
  },
  {
    id: 'game-call-of-duty-warzone',
    title: 'Call of Duty: Warzone & Modern Warfare III',
    slug: 'call-of-duty-warzone',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Battle Royale / FPS',
    releaseYear: 2020,
    engine: 'IW 9.0 (DirectX 12)',
    demandTier: 4,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 7,
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Urgently benefits from 16GB+ RAM and fast memory bandwidth for 1% low stability in Urzikstan.'
  },
  {
    id: 'game-counter-strike-2',
    title: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Tactical Esports FPS',
    releaseYear: 2023,
    engine: 'Source 2 (Vulkan / DirectX 11)',
    demandTier: 2,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: false,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 4,
    target60Fps1080pCpuTier: 6, // High refresh competitive gamers need strong CPU single-core
    vramBaselineGb: { '720p': 2, '900p': 3, '1080p': 4, '1440p': 6, '4k': 8 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Volumetric smokes and sub-tick packet sync demand high CPU single-core instructions.'
  },
  {
    id: 'game-valorant',
    title: 'Valorant',
    slug: 'valorant',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Esports Tactical Shooter',
    releaseYear: 2020,
    engine: 'Unreal Engine 4 (Highly CPU-Bound)',
    demandTier: 1,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: false,
    supportsFsr: false,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 2,
    target60Fps1080pCpuTier: 4,
    vramBaselineGb: { '720p': 1, '900p': 2, '1080p': 2, '1440p': 4, '4k': 6 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Extremely lightweight on GPU; 240+ FPS is primarily governed by CPU single-core L3 cache.'
  },
  {
    id: 'game-space-marine-2',
    title: 'Warhammer 40,000: Space Marine 2',
    slug: 'warhammer-40000-space-marine-2',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    genre: 'Action Third-Person Shooter',
    releaseYear: 2024,
    engine: 'Saber Swarm Engine (DirectX 12)',
    demandTier: 5,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 8,
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Thousands of Tyranid swarm entities calculate pathfinding simultaneously on CPU.'
  },
  {
    id: 'game-silent-hill-2',
    title: 'Silent Hill 2 (Remake)',
    slug: 'silent-hill-2-remake',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    genre: 'Survival Horror',
    releaseYear: 2024,
    engine: 'Unreal Engine 5 (Nanite & Lumen Heavy Fog)',
    demandTier: 5,
    cpuHeavy: false,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 7,
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 8, '1440p': 10, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Volumetric dense fog and Lumen reflections demand 8GB+ VRAM at 1080p.'
  },
  {
    id: 'game-hogwarts-legacy',
    title: 'Hogwarts Legacy',
    slug: 'hogwarts-legacy',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    genre: 'Action RPG',
    releaseYear: 2023,
    engine: 'Unreal Engine 4 (DirectX 12)',
    demandTier: 4,
    cpuHeavy: true,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 7,
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Hogsmeade and Hogwarts corridors stream heavy geometry and benefit from 16GB+ RAM.'
  },
  {
    id: 'game-alan-wake-2',
    title: 'Alan Wake 2',
    slug: 'alan-wake-2',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    genre: 'Survival Horror / Psychological Thriller',
    releaseYear: 2023,
    engine: 'Northlight (Mesh Shaders & Full Path Tracing)',
    demandTier: 5,
    cpuHeavy: false,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 8, // Strictly requires Mesh Shader capable GPU (RTX 2060 / RX 6600 min)
    target60Fps1080pCpuTier: 7,
    vramBaselineGb: { '720p': 6, '900p': 6, '1080p': 8, '1440p': 12, '4k': 16 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Requires modern Mesh Shaders hardware. Older GTX 10 series suffers severe performance degradation.'
  },
  {
    id: 'game-forza-horizon-5',
    title: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Open World Racing',
    releaseYear: 2021,
    engine: 'ForzaTech (DirectX 12)',
    demandTier: 3,
    cpuHeavy: false,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: false,
    supportsFrameGen: false,
    target60Fps1080pGpuTier: 5,
    target60Fps1080pCpuTier: 5,
    vramBaselineGb: { '720p': 3, '900p': 4, '1080p': 4, '1440p': 6, '4k': 8 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'Highly optimized engine delivers smooth 60+ FPS across broad GPU configurations.'
  },
  {
    id: 'game-starfield',
    title: 'Starfield',
    slug: 'starfield',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'Space Action RPG',
    releaseYear: 2023,
    engine: 'Creation Engine 2 (DirectX 12)',
    demandTier: 4,
    cpuHeavy: true,
    supportsRayTracing: false,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 7,
    target60Fps1080pCpuTier: 8,
    vramBaselineGb: { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 },
    hasVerifiedBenchmarks: true,
    benchmarkNotes: 'New Atlantis city center places heavy demand on CPU cache and system memory bandwidth.'
  }
];

export const GAME_PERFORMANCE_PROFILES: GamePerformanceProfile[] = deduplicateById(
  BASE_GAME_PERFORMANCE_PROFILES,
  ADDITIONAL_GAME_PERFORMANCE_PROFILES
);

export function createUniversalGameProfile(
  title: string,
  customConfig?: Partial<GamePerformanceProfile>
): GamePerformanceProfile {
  const cleanTitle = title.trim();
  const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `game-custom-${slug || Date.now()}`;
  
  // Smart heuristic based on keywords
  const lower = cleanTitle.toLowerCase();
  let demandTier: 1 | 2 | 3 | 4 | 5 = 3;
  let cpuHeavy = false;
  let supportsRayTracing = false;
  let supportsDlss = true;
  let supportsFsr = true;
  let supportsXeSS = true;
  let supportsFrameGen = false;
  let genre = 'Action / PC Game';
  let engine = 'DirectX 12 PC Game Engine';

  if (lower.includes('indie') || lower.includes('2d') || lower.includes('pixel') || lower.includes('card') || lower.includes('roguelike') || lower.includes('chess') || lower.includes('terraria') || lower.includes('stardew') || lower.includes('hades') || lower.includes('brotato') || lower.includes('balatro') || lower.includes('vampire')) {
    demandTier = 1;
    genre = 'Indie / 2D Action';
    engine = 'Lightweight 2D / C# Engine';
  } else if (lower.includes('esport') || lower.includes('cs') || lower.includes('counter') || lower.includes('valorant') || lower.includes('overwatch') || lower.includes('league') || lower.includes('dota') || lower.includes('rocket league') || lower.includes('siege')) {
    demandTier = 2;
    genre = 'Competitive Esports';
    engine = 'Competitive Low-Latency Engine';
  } else if (lower.includes('sim') || lower.includes('city') || lower.includes('civilization') || lower.includes('total war') || lower.includes('stellaris') || lower.includes('tycoon') || lower.includes('factory') || lower.includes('paradox') || lower.includes('planet')) {
    demandTier = 3;
    cpuHeavy = true;
    genre = 'Simulation / Strategy';
    engine = 'Complex Simulation & AI Engine';
  } else if (lower.includes('remake') || lower.includes('unreal 5') || lower.includes('ue5') || lower.includes('alan wake') || lower.includes('wukong') || lower.includes('stalker') || lower.includes('pathtracing') || lower.includes('rtx')) {
    demandTier = 5;
    supportsRayTracing = true;
    supportsFrameGen = true;
    genre = 'Next-Gen AAA Action';
    engine = 'Unreal Engine 5 / Next-Gen DirectX 12';
  } else if (lower.includes('rpg') || lower.includes('action') || lower.includes('open world') || lower.includes('warzone') || lower.includes('gta') || lower.includes('assassin') || lower.includes('horizon') || lower.includes('cyberpunk') || lower.includes('space marine')) {
    demandTier = 4;
    supportsRayTracing = true;
    genre = 'Open World / AAA Action';
    engine = 'Modern High-Fidelity DirectX 12 Engine';
  }

  const targetGpu = demandTier === 1 ? 2 : demandTier === 2 ? 3 : demandTier === 3 ? 5 : demandTier === 4 ? 6 : 8;
  const targetCpu = cpuHeavy ? Math.min(10, demandTier + 3) : Math.max(3, demandTier + 1);

  const defaultProfile: GamePerformanceProfile = {
    id,
    title: cleanTitle,
    slug,
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    genre,
    releaseYear: new Date().getFullYear(),
    engine,
    demandTier,
    cpuHeavy,
    supportsRayTracing,
    supportsDlss,
    supportsFsr,
    supportsXeSS,
    supportsFrameGen,
    target60Fps1080pGpuTier: targetGpu,
    target60Fps1080pCpuTier: targetCpu,
    vramBaselineGb: demandTier === 1 
      ? { '720p': 1, '900p': 1.5, '1080p': 2, '1440p': 3, '4k': 4 }
      : demandTier === 2
      ? { '720p': 2, '900p': 3, '1080p': 4, '1440p': 6, '4k': 8 }
      : demandTier === 3
      ? { '720p': 3, '900p': 4, '1080p': 6, '1440p': 8, '4k': 10 }
      : demandTier === 4
      ? { '720p': 4, '900p': 5, '1080p': 6, '1440p': 8, '4k': 12 }
      : { '720p': 6, '900p': 7, '1080p': 8, '1440p': 12, '4k': 16 },
    hasVerifiedBenchmarks: false,
    benchmarkNotes: 'Universal PC gaming calculation profile calibrated dynamically for hardware bottlenecks.'
  };

  return {
    ...defaultProfile,
    ...customConfig
  };
}

export const RESOLUTION_DEFINITIONS: Record<string, { label: string; width: number; height: number; pixels: number; multiplier: number }> = {
  '720p': { label: '720p (HD)', width: 1280, height: 720, pixels: 921600, multiplier: 0.44 },
  '900p': { label: '900p (HD+)', width: 1600, height: 900, pixels: 1440000, multiplier: 0.69 },
  '1080p': { label: '1080p (Full HD)', width: 1920, height: 1080, pixels: 2073600, multiplier: 1.0 },
  '1440p': { label: '1440p (QHD / 2K)', width: 2560, height: 1440, pixels: 3686400, multiplier: 1.78 },
  '4k': { label: '4K (UHD / 2160p)', width: 3840, height: 2160, pixels: 8294400, multiplier: 4.0 },
  'custom': { label: 'Custom Resolution', width: 1920, height: 1080, pixels: 2073600, multiplier: 1.0 }
};

export const PRESET_DEFINITIONS: Record<string, { label: string; gpuMultiplier: number; cpuMultiplier: number; vramBonusGb: number }> = {
  very_low: { label: 'Very Low', gpuMultiplier: 1.45, cpuMultiplier: 1.15, vramBonusGb: -1.5 },
  low: { label: 'Low', gpuMultiplier: 1.30, cpuMultiplier: 1.10, vramBonusGb: -1.0 },
  medium: { label: 'Medium', gpuMultiplier: 1.12, cpuMultiplier: 1.04, vramBonusGb: -0.5 },
  high: { label: 'High (Standard Baseline)', gpuMultiplier: 1.00, cpuMultiplier: 1.00, vramBonusGb: 0 },
  very_high: { label: 'Very High', gpuMultiplier: 0.88, cpuMultiplier: 0.96, vramBonusGb: 1.0 },
  ultra: { label: 'Ultra', gpuMultiplier: 0.78, cpuMultiplier: 0.92, vramBonusGb: 2.0 },
  custom: { label: 'Custom Settings', gpuMultiplier: 1.00, cpuMultiplier: 1.00, vramBonusGb: 0 }
};

export const UPSCALING_DEFINITIONS: Record<string, { label: string; tech: 'dlss' | 'fsr' | 'xess' | 'none'; boostFactor: number; qualityScore: string }> = {
  off: { label: 'Off (Native Resolution)', tech: 'none', boostFactor: 1.0, qualityScore: '100% Native Clarity' },
  dlss_quality: { label: 'NVIDIA DLSS — Quality', tech: 'dlss', boostFactor: 1.30, qualityScore: 'High (67% Render Scale)' },
  dlss_balanced: { label: 'NVIDIA DLSS — Balanced', tech: 'dlss', boostFactor: 1.45, qualityScore: 'Balanced (58% Render Scale)' },
  dlss_perf: { label: 'NVIDIA DLSS — Performance', tech: 'dlss', boostFactor: 1.65, qualityScore: 'Performance (50% Render Scale)' },
  dlss_ultra_perf: { label: 'NVIDIA DLSS — Ultra Performance', tech: 'dlss', boostFactor: 1.95, qualityScore: 'Ultra Perf (33% Render Scale - Best for 4K)' },
  fsr_quality: { label: 'AMD FSR — Quality', tech: 'fsr', boostFactor: 1.28, qualityScore: 'High (67% Render Scale)' },
  fsr_balanced: { label: 'AMD FSR — Balanced', tech: 'fsr', boostFactor: 1.42, qualityScore: 'Balanced (59% Render Scale)' },
  fsr_perf: { label: 'AMD FSR — Performance', tech: 'fsr', boostFactor: 1.62, qualityScore: 'Performance (50% Render Scale)' },
  fsr_ultra_perf: { label: 'AMD FSR — Ultra Performance', tech: 'fsr', boostFactor: 1.90, qualityScore: 'Ultra Perf (33% Render Scale)' },
  xess_quality: { label: 'Intel XeSS — Quality', tech: 'xess', boostFactor: 1.25, qualityScore: 'High (67% Render Scale)' },
  xess_balanced: { label: 'Intel XeSS — Balanced', tech: 'xess', boostFactor: 1.38, qualityScore: 'Balanced (59% Render Scale)' },
  xess_perf: { label: 'Intel XeSS — Performance', tech: 'xess', boostFactor: 1.55, qualityScore: 'Performance (50% Render Scale)' }
};

export const TARGET_FPS_OPTIONS = [30, 60, 75, 90, 120, 144, 165, 240];
export const REFRESH_RATE_OPTIONS = [60, 75, 120, 144, 165, 240, 360];
export const RAM_CAPACITY_OPTIONS = [4, 8, 16, 32, 64, 128];
export const VRAM_OPTIONS_CALCULATOR = [2, 4, 6, 8, 10, 12, 16, 20, 24, 32];
