import { PcGameRequirements, CpuSpec, GpuSpec, UserPcSpec } from '../types/pcRequirements';
import { EXPANDED_GAMES_REQUIREMENTS } from './expandedPcGamesData';

// ==========================================
// VERIFIED PUBLISHED PC GAMES DATABASE
// ==========================================
const BASE_GAMES_REQUIREMENTS: PcGameRequirements[] = [
  {
    id: 'game-req-cyberpunk-2077',
    gameId: 'game-2',
    title: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    releaseDate: 'December 10, 2020 (Updated 2.0/Phantom Liberty)',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel Core i7-6700 or AMD Ryzen 5 1600',
      cpuTier: 5,
      ramGb: 12,
      gpu: 'NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 580 8GB or Intel Arc A380',
      gpuTier: 5,
      vramGb: 6,
      storageGb: 70,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'SSD storage is strictly required for version 2.0+ and Phantom Liberty expansion.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i7-12700 or AMD Ryzen 7 7800X3D',
      cpuTier: 8,
      ramGb: 16,
      gpu: 'NVIDIA GeForce RTX 2060 SUPER 8GB or AMD Radeon RX 5700 XT or Intel Arc A770',
      gpuTier: 7,
      vramGb: 8,
      storageGb: 70,
      storageType: 'SSD Required',
      directX: 'DirectX 12 Ultimate',
      additionalNotes: 'For ray tracing overdrive or ultra settings, an RTX 4070 or Radeon RX 7900 XT is advised.'
    },
    source: 'CD Projekt RED Official Support & Storefront Documentation (v2.1)',
    lastVerified: 'September 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Medium-High',
      rayTracing: 'Off on minimum/mid-range; DLSS/FSR recommended',
      upscaling: 'DLSS Quality or FSR Balanced recommended for 60+ FPS',
      notes: 'Cyberpunk 2077 is heavy on CPU thread scheduling in crowd-dense areas like Kabuki and Dogtown.'
    }
  },
  {
    id: 'game-req-gta-v',
    gameId: 'game-gta-v',
    title: 'Grand Theft Auto V',
    slug: 'gta-v',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    releaseDate: 'April 14, 2015',
    genre: 'Action',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X/S', 'Xbox One'],
    minimum: {
      os: 'Windows 10 64-bit / Windows 8.1 64-bit',
      cpu: 'Intel Core 2 Quad CPU Q6600 @ 2.40GHz / AMD Phenom 9850 Quad-Core @ 2.5GHz',
      cpuTier: 2,
      ramGb: 4,
      gpu: 'NVIDIA GeForce 9800 GT 1GB / AMD Radeon HD 4870 1GB',
      gpuTier: 2,
      vramGb: 1,
      storageGb: 110,
      storageType: 'HDD',
      directX: 'DirectX 10',
      additionalNotes: 'Broadband internet connection required for GTA Online authentication.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i5-3470 @ 3.2GHz / AMD FX-8350 @ 4GHz',
      cpuTier: 4,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GTX 660 2GB / AMD Radeon HD 7870 2GB',
      gpuTier: 4,
      vramGb: 2,
      storageGb: 110,
      storageType: 'SSD Recommended',
      directX: 'DirectX 11',
      additionalNotes: '8GB+ RAM significantly reduces texture popping in high-speed vehicle gameplay.'
    },
    source: 'Rockstar Games Support Official Specifications',
    lastVerified: 'August 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Very High',
      rayTracing: 'Not supported natively',
      upscaling: 'Optional MSAA or FXAA',
      notes: 'Runs easily on most modern gaming PCs. Grass Quality on Ultra causes heavy frame drops even on top GPUs.'
    }
  },
  {
    id: 'game-req-elden-ring',
    gameId: 'game-1',
    title: 'Elden Ring',
    slug: 'elden-ring',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco Entertainment',
    releaseDate: 'February 25, 2022',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series X/S', 'Xbox One'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel Core i5-8400 or AMD Ryzen 3 3300X',
      cpuTier: 5,
      ramGb: 12,
      gpu: 'NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB',
      gpuTier: 5,
      vramGb: 3,
      storageGb: 60,
      storageType: 'SSD Recommended',
      directX: 'DirectX 12 (Feature Level 12_0)',
      additionalNotes: 'Requires AVX instruction set on CPU and DirectX 12 hardware support.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i7-8700K or AMD Ryzen 5 3600X',
      cpuTier: 6,
      ramGb: 16,
      gpu: 'NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX Vega 56 8GB',
      gpuTier: 6,
      vramGb: 8,
      storageGb: 60,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'Shadow of the Erdtree DLC benefits heavily from fast NVMe storage.'
    },
    source: 'FromSoftware & Bandai Namco Official Requirements',
    lastVerified: 'June 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'High',
      rayTracing: 'Off (Very demanding ray traced shadows)',
      upscaling: 'Native or driver-level upscaling',
      notes: 'Engine locked to 60 FPS maximum on PC.'
    }
  },
  {
    id: 'game-req-rdr2',
    gameId: 'game-rdr2',
    title: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    developer: 'Rockstar Studios',
    publisher: 'Rockstar Games',
    releaseDate: 'November 5, 2019',
    genre: 'Action',
    platforms: ['PC', 'PS4', 'Xbox One'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel Core i5-2500K / AMD FX-6300',
      cpuTier: 3,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GTX 770 2GB / AMD Radeon R9 280 3GB',
      gpuTier: 4,
      vramGb: 2,
      storageGb: 150,
      storageType: 'HDD',
      directX: 'DirectX 11 / Vulkan',
      additionalNotes: 'Supports both Vulkan API and DirectX 12.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
      cpuTier: 5,
      ramGb: 12,
      gpu: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB',
      gpuTier: 5,
      vramGb: 4,
      storageGb: 150,
      storageType: 'SSD Recommended',
      directX: 'Vulkan (Recommended)',
      additionalNotes: 'Vulkan mode typically delivers smoother frame times on Windows 10/11.'
    },
    source: 'Rockstar Games Official Specifications',
    lastVerified: 'May 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Medium-High custom mix',
      rayTracing: 'Not supported',
      upscaling: 'DLSS / FSR 2.0 available',
      notes: 'Water Physics and Volumetric Lighting have exponential performance cost at Ultra.'
    }
  },
  {
    id: 'game-req-fortnite',
    gameId: 'game-fortnite',
    title: 'Fortnite',
    slug: 'fortnite',
    coverImage: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=800&auto=format&fit=crop&q=80',
    developer: 'Epic Games',
    publisher: 'Epic Games',
    releaseDate: 'July 21, 2017 (Unreal Engine 5.4 Update)',
    genre: 'Multiplayer',
    platforms: ['PC', 'PS5', 'Xbox Series X/S', 'Switch', 'Mobile'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Core i3-3225 3.3 GHz',
      cpuTier: 3,
      ramGb: 8,
      gpu: 'Intel HD 4000 on PC; AMD Radeon Vega 8',
      gpuTier: 3,
      vramGb: 1,
      storageGb: 30,
      storageType: 'HDD',
      directX: 'DirectX 11',
      additionalNotes: 'Performance Mode is available for lower-end hardware configurations.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Core i5-7300U 3.5 GHz, AMD Ryzen 3 3300U, or equivalent',
      cpuTier: 5,
      ramGb: 16,
      gpu: 'NVIDIA GeForce GTX 960, AMD Radeon R9 280, or equivalent DX11 GPU',
      gpuTier: 5,
      vramGb: 2,
      storageGb: 30,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'For Nanite geometry and Lumen software ray tracing, an RTX 3060 or better is recommended.'
    },
    source: 'Epic Games Official Fortnite System Specifications',
    lastVerified: 'August 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Performance Mode / High',
      rayTracing: 'Hardware Ray Tracing optional for high-tier GPUs',
      upscaling: 'TSR (Temporal Super Resolution) / DLSS',
      notes: 'Performance Mode enables high competitive FPS (144Hz+) on budget hardware.'
    }
  },
  {
    id: 'game-req-cod-warzone',
    gameId: 'game-cod',
    title: 'Call of Duty: Warzone',
    slug: 'call-of-duty',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    developer: 'Infinity Ward / Raven Software',
    publisher: 'Activision',
    releaseDate: 'November 16, 2022',
    genre: 'FPS',
    platforms: ['PC', 'PS5', 'Xbox Series X/S', 'PS4', 'Xbox One'],
    minimum: {
      os: 'Windows 10 64-bit (latest update)',
      cpu: 'Intel Core i5-6600 or AMD Ryzen 5 1400',
      cpuTier: 4,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GTX 960 / GTX 1650 or AMD Radeon RX 470',
      gpuTier: 4,
      vramGb: 2,
      storageGb: 125,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'Requires TPM 2.0 / secure boot and active internet connection.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit (latest update)',
      cpu: 'Intel Core i7-6700K or AMD Ryzen 5 1600X',
      cpuTier: 6,
      ramGb: 16,
      gpu: 'NVIDIA GeForce GTX 1060 or AMD Radeon RX 580',
      gpuTier: 6,
      vramGb: 4,
      storageGb: 125,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'Competitive 144 FPS setup targets RTX 3060 Ti / RX 6700 XT with 16GB dual-channel RAM.'
    },
    source: 'Activision Official Call of Duty PC Specifications',
    lastVerified: 'July 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Competitive Low-Medium',
      rayTracing: 'Off',
      upscaling: 'NVIDIA DLSS / AMD FSR 3 / FidelityFX CAS',
      notes: 'Dual-channel RAM (2x8GB minimum) is critical to eliminate stutter during Warzone drop-in.'
    }
  },
  {
    id: 'game-req-cs2',
    gameId: 'game-cs2',
    title: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: 'September 27, 2023',
    genre: 'FPS',
    platforms: ['PC'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: '4 hardware CPU threads - Intel Core i5 750 or higher',
      cpuTier: 4,
      ramGb: 8,
      gpu: 'Video card must be 1 GB or more and should be a DirectX 11-compatible with support for Shader Model 5.0',
      gpuTier: 4,
      vramGb: 1,
      storageGb: 85,
      storageType: 'SSD Recommended',
      directX: 'DirectX 11',
      additionalNotes: 'Runs on Valve Source 2 engine with volumetric smoke simulation.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i5-12400F or AMD Ryzen 5 5600',
      cpuTier: 7,
      ramGb: 16,
      gpu: 'NVIDIA GeForce RTX 2060 or AMD Radeon RX 6600',
      gpuTier: 6,
      vramGb: 6,
      storageGb: 85,
      storageType: 'SSD Required',
      directX: 'DirectX 11 / Vulkan',
      additionalNotes: 'High single-core CPU IPC delivers stable 240Hz frame rates for esports play.'
    },
    source: 'Valve Official Steam Storefront Requirements',
    lastVerified: 'August 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Medium (High Shadows & Global Illumination)',
      rayTracing: 'Not supported',
      upscaling: 'FSR disabled for lowest latency',
      notes: 'Single-core CPU clock speed dictates frame pacing in competitive matchmaking.'
    }
  },
  {
    id: 'game-req-apex-legends',
    gameId: 'game-apex',
    title: 'Apex Legends',
    slug: 'apex-legends',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    releaseDate: 'February 4, 2019',
    genre: 'Multiplayer',
    platforms: ['PC', 'PS5', 'Xbox Series X/S', 'PS4', 'Xbox One', 'Switch'],
    minimum: {
      os: '64-bit Windows 10',
      cpu: 'Intel Core i3-6300 3.8GHz / AMD FX-4350 4.2 GHz Quad-Core Processor',
      cpuTier: 3,
      ramGb: 6,
      gpu: 'NVIDIA GeForce GT 640 / Radeon HD 7730',
      gpuTier: 3,
      vramGb: 1,
      storageGb: 75,
      storageType: 'HDD',
      directX: 'DirectX 11',
      additionalNotes: 'Requires 64-bit operating system and DirectX 11.'
    },
    recommended: {
      os: '64-bit Windows 10/11',
      cpu: 'Intel i5 3570K or equivalent / AMD Ryzen 5',
      cpuTier: 5,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GTX 970 / AMD Radeon R9 290',
      gpuTier: 5,
      vramGb: 4,
      storageGb: 75,
      storageType: 'SSD Recommended',
      directX: 'DirectX 11',
      additionalNotes: 'DirectX 12 beta launcher option available for modern multi-core CPUs.'
    },
    source: 'Electronic Arts & Respawn Official System Requirements',
    lastVerified: 'June 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Low-Medium',
      rayTracing: 'Not supported',
      upscaling: 'Adaptive Resolution FPS Target',
      notes: 'Model Detail and Texture Streaming Budget can be adjusted based on GPU VRAM.'
    }
  },
  {
    id: 'game-req-minecraft',
    gameId: 'game-minecraft',
    title: 'Minecraft',
    slug: 'minecraft',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    developer: 'Mojang Studios',
    publisher: 'Xbox Game Studios',
    releaseDate: 'November 18, 2011',
    genre: 'Adventure',
    platforms: ['PC', 'Mac', 'Linux', 'Consoles', 'Mobile'],
    minimum: {
      os: 'Windows 10 version 17763.0 or higher',
      cpu: 'Intel Core i3-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz',
      cpuTier: 2,
      ramGb: 4,
      gpu: 'Intel HD Graphics 4000 / AMD Radeon R5 series / NVIDIA GeForce 400 Series',
      gpuTier: 2,
      vramGb: 1,
      storageGb: 4,
      storageType: 'HDD',
      directX: 'DirectX 11',
      additionalNotes: 'Java Edition requires 64-bit Java runtime; Bedrock supports Windows 10/11 natively.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i5-4690 3.5GHz / AMD A10-7800 APU 3.5 GHz',
      cpuTier: 4,
      ramGb: 8,
      gpu: 'NVIDIA GeForce 700 Series / AMD Radeon Rx 200 Series',
      gpuTier: 4,
      vramGb: 2,
      storageGb: 8,
      storageType: 'SSD Recommended',
      directX: 'DirectX 12 (Bedrock RTX)',
      additionalNotes: 'Ray Tracing (Bedrock RTX) requires NVIDIA GeForce RTX 2060 or higher.'
    },
    source: 'Mojang Studios Official Help Center Specs',
    lastVerified: 'September 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Fancy (16-24 Chunks Render Distance)',
      rayTracing: 'RTX only on Bedrock with RTX GPU',
      upscaling: 'DLSS on Bedrock RTX',
      notes: 'Java Edition simulation scales primarily with CPU single-core performance and allocated RAM.'
    }
  },
  {
    id: 'game-req-wows',
    gameId: 'game-4',
    title: 'World of Warships',
    slug: 'world-of-warships',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    developer: 'Wargaming',
    publisher: 'Wargaming',
    releaseDate: 'September 17, 2015',
    genre: 'Simulation',
    platforms: ['PC'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel Core i3-3210 3.2 GHz / AMD FX-4100 3.6 GHz',
      cpuTier: 3,
      ramGb: 4,
      gpu: 'NVIDIA GeForce GT 1030 2GB / AMD Radeon RX 550 2GB / Intel UHD 630',
      gpuTier: 3,
      vramGb: 2,
      storageGb: 65,
      storageType: 'HDD',
      directX: 'DirectX 11',
      additionalNotes: 'Requires constant broadband connection for multiplayer naval simulation.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i5-6400 2.7 GHz / AMD Ryzen 3 1200 3.1 GHz',
      cpuTier: 5,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GTX 1650 4GB / AMD Radeon RX 570 4GB',
      gpuTier: 5,
      vramGb: 4,
      storageGb: 65,
      storageType: 'SSD Required',
      directX: 'DirectX 11',
      additionalNotes: 'SSD significantly reduces battle countdown loading times.'
    },
    source: 'Wargaming.net Official System Requirements Portal',
    lastVerified: 'July 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'High-Maximum',
      rayTracing: 'Not supported',
      upscaling: 'FSR 1.0 supported',
      notes: 'Water reflections and shell particle physics look phenomenal at High with steady 60+ FPS.'
    }
  },
  {
    id: 'game-req-pubg',
    gameId: 'game-pubg',
    title: 'PUBG: BATTLEGROUNDS',
    slug: 'pubg',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    developer: 'KRAFTON, Inc.',
    publisher: 'KRAFTON, Inc.',
    releaseDate: 'December 21, 2017',
    genre: 'Multiplayer',
    platforms: ['PC', 'PS5', 'Xbox Series X/S', 'PS4', 'Xbox One'],
    minimum: {
      os: '64-bit Windows 10',
      cpu: 'Intel Core i5-4430 / AMD FX-6300',
      cpuTier: 3,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB',
      gpuTier: 4,
      vramGb: 2,
      storageGb: 40,
      storageType: 'HDD',
      directX: 'DirectX 11',
      additionalNotes: 'DirectX 11 feature level 11_1 required.'
    },
    recommended: {
      os: '64-bit Windows 10/11',
      cpu: 'Intel Core i5-6600K / AMD Ryzen 5 1600',
      cpuTier: 5,
      ramGb: 16,
      gpu: 'NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB',
      gpuTier: 5,
      vramGb: 3,
      storageGb: 40,
      storageType: 'SSD Required',
      directX: 'DirectX 11',
      additionalNotes: '16GB RAM is highly recommended to eliminate open-world vehicle stutter.'
    },
    source: 'KRAFTON Official Support Documentation',
    lastVerified: 'August 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Competitive (Very Low with Ultra Textures & View Distance)',
      rayTracing: 'Not supported',
      upscaling: 'DirectX 11 Enhanced mode recommended',
      notes: 'Competitive players prefer Low shadows and foliage to spot enemies faster across Erangel.'
    }
  },
  {
    id: 'game-req-hogwarts-legacy',
    gameId: 'game-hogwarts',
    title: 'Hogwarts Legacy',
    slug: 'hogwarts-legacy',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    developer: 'Avalanche Software',
    publisher: 'Warner Bros. Games',
    releaseDate: 'February 10, 2023',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox Series X/S', 'PS4', 'Xbox One', 'Switch'],
    minimum: {
      os: '64-bit Windows 10',
      cpu: 'Intel Core i5-6600 (3.3Ghz) or AMD Ryzen 5 1400 (3.2Ghz)',
      cpuTier: 4,
      ramGb: 16,
      gpu: 'NVIDIA GeForce GTX 960 4GB or AMD Radeon RX 470 4GB',
      gpuTier: 4,
      vramGb: 4,
      storageGb: 85,
      storageType: 'SSD Recommended',
      directX: 'DirectX 12',
      additionalNotes: 'Upscaling (DLSS / FSR 2.0 / XeSS) is enabled by default.'
    },
    recommended: {
      os: '64-bit Windows 10/11',
      cpu: 'Intel Core i7-8700 (3.2Ghz) or AMD Ryzen 5 3600 (3.6 Ghz)',
      cpuTier: 6,
      ramGb: 16,
      gpu: 'NVIDIA GeForce 1080 Ti or AMD Radeon RX 5700 XT or Intel Arc A770',
      gpuTier: 7,
      vramGb: 8,
      storageGb: 85,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'Requires fast SSD for seamless castle-to-highlands flight streaming.'
    },
    source: 'Warner Bros. Games Official Support Specification Matrix',
    lastVerified: 'May 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'High',
      rayTracing: 'Off on sub-8GB VRAM cards',
      upscaling: 'DLSS Quality or FSR 2.0 Quality',
      notes: 'Hogsmeade and the Grand Staircase demand significant VRAM and RAM allocation.'
    }
  },
  {
    id: 'game-req-bg3',
    gameId: 'game-3',
    title: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    releaseDate: 'August 3, 2023',
    genre: 'RPG',
    platforms: ['PC', 'Mac', 'PS5', 'Xbox Series X/S'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel I5 4690 / AMD FX 8350',
      cpuTier: 4,
      ramGb: 8,
      gpu: 'Nvidia GTX 970 / RX 480 (4GB+ of VRAM)',
      gpuTier: 5,
      vramGb: 4,
      storageGb: 150,
      storageType: 'SSD Required',
      directX: 'DirectX 11 / Vulkan',
      additionalNotes: 'SSD is strictly required. Act 3 city zones have intense CPU simulation threads.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel i7 8700K / AMD r5 3600',
      cpuTier: 6,
      ramGb: 16,
      gpu: 'Nvidia 2060 Super / RX 5700 XT (8GB+ of VRAM)',
      gpuTier: 7,
      vramGb: 8,
      storageGb: 150,
      storageType: 'SSD Required',
      directX: 'DirectX 11',
      additionalNotes: '16GB RAM prevents memory pressure during extended multi-hour play sessions.'
    },
    source: 'Larian Studios Steam Community Official Requirements',
    lastVerified: 'August 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Ultra',
      rayTracing: 'Not supported',
      upscaling: 'DLSS / FSR 2.2 available',
      notes: 'Vulkan mode offers superior multi-core scaling on AMD Ryzen processors.'
    }
  },
  {
    id: 'game-req-black-myth-wukong',
    gameId: 'game-bmw',
    title: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    developer: 'Game Science',
    publisher: 'Game Science',
    releaseDate: 'August 20, 2024',
    genre: 'Action',
    platforms: ['PC', 'PS5'],
    minimum: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel Core i5-8400 / AMD Ryzen 5 1600',
      cpuTier: 5,
      ramGb: 16,
      gpu: 'NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB',
      gpuTier: 5,
      vramGb: 6,
      storageGb: 130,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'Unreal Engine 5 title. SSD strictly required for asset streaming.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core i7-9700 / AMD Ryzen 5 5500',
      cpuTier: 7,
      ramGb: 16,
      gpu: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT / Intel Arc A750',
      gpuTier: 7,
      vramGb: 8,
      storageGb: 130,
      storageType: 'SSD Required',
      directX: 'DirectX 12',
      additionalNotes: 'Full ray tracing (Path Tracing) recommended on RTX 4070 or above.'
    },
    source: 'Game Science Official System Requirements Chart',
    lastVerified: 'August 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'Medium-High',
      rayTracing: 'Off on recommended; requires Frame Gen on 40-series for Path Tracing',
      upscaling: 'TSR / DLSS / FSR 3 / XeSS mandatory',
      notes: 'Nanite virtualized geometry requires modern DX12 shader model support.'
    }
  },
  {
    id: 'game-req-valorant',
    gameId: 'game-valorant',
    title: 'Valorant',
    slug: 'valorant',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    releaseDate: 'June 2, 2020',
    genre: 'FPS',
    platforms: ['PC'],
    minimum: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel Core 2 Duo E8400 / AMD Athlon 200GE',
      cpuTier: 2,
      ramGb: 4,
      gpu: 'Intel HD 4000 / AMD Radeon R5 200',
      gpuTier: 2,
      vramGb: 1,
      storageGb: 35,
      storageType: 'HDD',
      directX: 'DirectX 11',
      additionalNotes: 'Vanguard anti-cheat requires TPM 2.0 and Secure Boot on Windows 11.'
    },
    recommended: {
      os: 'Windows 10/11 64-bit',
      cpu: 'Intel i3-4150 / AMD Ryzen 3 1200',
      cpuTier: 4,
      ramGb: 8,
      gpu: 'NVIDIA GeForce GT 730 / AMD Radeon R7 240',
      gpuTier: 3,
      vramGb: 1,
      storageGb: 35,
      storageType: 'SSD Recommended',
      directX: 'DirectX 11',
      additionalNotes: '144+ FPS competitive tier targets Intel i5-9400F / Ryzen 5 2600 with GTX 1050 Ti.'
    },
    source: 'Riot Games Official Support Portal',
    lastVerified: 'September 2024',
    graphicsGuidance: {
      resolution: '1080p',
      preset: 'High',
      rayTracing: 'Not supported',
      upscaling: 'Native resolution',
      notes: 'Runs at high frame rates even on modest hardware configurations.'
    }
  }
];

export const INITIAL_GAMES_REQUIREMENTS: PcGameRequirements[] = [
  ...BASE_GAMES_REQUIREMENTS,
  ...EXPANDED_GAMES_REQUIREMENTS
];

// ==========================================
// SEARCHABLE CPU SPECIFICATIONS DATABASE
// ==========================================
export const CPU_DATABASE: CpuSpec[] = [
  // AMD Ryzen 9000 & 7000 Series (Tier 9-10)
  { id: 'cpu-r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', tier: 10, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r9-7950x3d', name: 'AMD Ryzen 9 7950X3D', brand: 'AMD', tier: 10, cores: 16, threads: 32, family: 'Ryzen 9' },
  { id: 'cpu-r9-7900x', name: 'AMD Ryzen 9 7900X', brand: 'AMD', tier: 9, cores: 12, threads: 24, family: 'Ryzen 9' },
  { id: 'cpu-r7-7700x', name: 'AMD Ryzen 7 7700X', brand: 'AMD', tier: 9, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r5-7600x', name: 'AMD Ryzen 5 7600X', brand: 'AMD', tier: 8, cores: 6, threads: 12, family: 'Ryzen 5' },
  { id: 'cpu-r5-7600', name: 'AMD Ryzen 5 7600', brand: 'AMD', tier: 8, cores: 6, threads: 12, family: 'Ryzen 5' },

  // AMD Ryzen 5000 Series (Tier 7-9)
  { id: 'cpu-r7-5800x3d', name: 'AMD Ryzen 7 5800X3D', brand: 'AMD', tier: 9, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r9-5900x', name: 'AMD Ryzen 9 5900X', brand: 'AMD', tier: 9, cores: 12, threads: 24, family: 'Ryzen 9' },
  { id: 'cpu-r7-5800x', name: 'AMD Ryzen 7 5800X', brand: 'AMD', tier: 8, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r7-5700x', name: 'AMD Ryzen 7 5700X', brand: 'AMD', tier: 8, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r5-5600x', name: 'AMD Ryzen 5 5600X', brand: 'AMD', tier: 8, cores: 6, threads: 12, family: 'Ryzen 5' },
  { id: 'cpu-r5-5600', name: 'AMD Ryzen 5 5600', brand: 'AMD', tier: 7, cores: 6, threads: 12, family: 'Ryzen 5' },
  { id: 'cpu-r5-5500', name: 'AMD Ryzen 5 5500', brand: 'AMD', tier: 6, cores: 6, threads: 12, family: 'Ryzen 5' },
  { id: 'cpu-r3-4100', name: 'AMD Ryzen 3 4100', brand: 'AMD', tier: 5, cores: 4, threads: 8, family: 'Ryzen 3' },

  // AMD Ryzen 3000 & 2000 Series (Tier 4-6)
  { id: 'cpu-r7-3700x', name: 'AMD Ryzen 7 3700X', brand: 'AMD', tier: 7, cores: 8, threads: 16, family: 'Ryzen 7' },
  { id: 'cpu-r5-3600', name: 'AMD Ryzen 5 3600', brand: 'AMD', tier: 6, cores: 6, threads: 12, family: 'Ryzen 5' },
  { id: 'cpu-r3-3300x', name: 'AMD Ryzen 3 3300X', brand: 'AMD', tier: 5, cores: 4, threads: 8, family: 'Ryzen 3' },
  { id: 'cpu-r5-2600', name: 'AMD Ryzen 5 2600', brand: 'AMD', tier: 5, cores: 6, threads: 12, family: 'Ryzen 5' },
  { id: 'cpu-r5-1600', name: 'AMD Ryzen 5 1600', brand: 'AMD', tier: 4, cores: 6, threads: 12, family: 'Ryzen 5' },

  // Intel 14th & 13th Gen (Tier 8-10)
  { id: 'cpu-i9-14900k', name: 'Intel Core i9-14900K', brand: 'Intel', tier: 10, cores: 24, threads: 32, family: 'Core i9' },
  { id: 'cpu-i7-14700k', name: 'Intel Core i7-14700K', brand: 'Intel', tier: 10, cores: 20, threads: 28, family: 'Core i7' },
  { id: 'cpu-i5-14600k', name: 'Intel Core i5-14600K', brand: 'Intel', tier: 9, cores: 14, threads: 20, family: 'Core i5' },
  { id: 'cpu-i9-13900k', name: 'Intel Core i9-13900K', brand: 'Intel', tier: 10, cores: 24, threads: 32, family: 'Core i9' },
  { id: 'cpu-i7-13700k', name: 'Intel Core i7-13700K', brand: 'Intel', tier: 9, cores: 16, threads: 24, family: 'Core i7' },
  { id: 'cpu-i5-13600k', name: 'Intel Core i5-13600K', brand: 'Intel', tier: 9, cores: 14, threads: 20, family: 'Core i5' },
  { id: 'cpu-i5-13400f', name: 'Intel Core i5-13400F', brand: 'Intel', tier: 8, cores: 10, threads: 16, family: 'Core i5' },
  { id: 'cpu-i3-13100f', name: 'Intel Core i3-13100F', brand: 'Intel', tier: 6, cores: 4, threads: 8, family: 'Core i3' },

  // Intel 12th Gen (Tier 6-9)
  { id: 'cpu-i7-12700k', name: 'Intel Core i7-12700K', brand: 'Intel', tier: 9, cores: 12, threads: 20, family: 'Core i7' },
  { id: 'cpu-i5-12600k', name: 'Intel Core i5-12600K', brand: 'Intel', tier: 8, cores: 10, threads: 16, family: 'Core i5' },
  { id: 'cpu-i5-12400f', name: 'Intel Core i5-12400F', brand: 'Intel', tier: 7, cores: 6, threads: 12, family: 'Core i5' },
  { id: 'cpu-i3-12100f', name: 'Intel Core i3-12100F', brand: 'Intel', tier: 6, cores: 4, threads: 8, family: 'Core i3' },

  // Intel 11th & 10th Gen (Tier 5-7)
  { id: 'cpu-i7-11700k', name: 'Intel Core i7-11700K', brand: 'Intel', tier: 7, cores: 8, threads: 16, family: 'Core i7' },
  { id: 'cpu-i5-11400f', name: 'Intel Core i5-11400F', brand: 'Intel', tier: 6, cores: 6, threads: 12, family: 'Core i5' },
  { id: 'cpu-i7-10700k', name: 'Intel Core i7-10700K', brand: 'Intel', tier: 7, cores: 8, threads: 16, family: 'Core i7' },
  { id: 'cpu-i5-10400f', name: 'Intel Core i5-10400F', brand: 'Intel', tier: 6, cores: 6, threads: 12, family: 'Core i5' },
  { id: 'cpu-i3-10100f', name: 'Intel Core i3-10100F', brand: 'Intel', tier: 5, cores: 4, threads: 8, family: 'Core i3' },

  // Intel 8th & 9th Gen & Older (Tier 3-5)
  { id: 'cpu-i7-9700k', name: 'Intel Core i7-9700K', brand: 'Intel', tier: 6, cores: 8, threads: 8, family: 'Core i7' },
  { id: 'cpu-i5-9400f', name: 'Intel Core i5-9400F', brand: 'Intel', tier: 5, cores: 6, threads: 6, family: 'Core i5' },
  { id: 'cpu-i7-8700k', name: 'Intel Core i7-8700K', brand: 'Intel', tier: 6, cores: 6, threads: 12, family: 'Core i7' },
  { id: 'cpu-i5-8400', name: 'Intel Core i5-8400', brand: 'Intel', tier: 5, cores: 6, threads: 6, family: 'Core i5' },
  { id: 'cpu-i7-6700k', name: 'Intel Core i7-6700K', brand: 'Intel', tier: 5, cores: 4, threads: 8, family: 'Core i7' },
  { id: 'cpu-i5-6600k', name: 'Intel Core i5-6600K', brand: 'Intel', tier: 4, cores: 4, threads: 4, family: 'Core i5' },
  { id: 'cpu-i5-4690k', name: 'Intel Core i5-4690K', brand: 'Intel', tier: 3, cores: 4, threads: 4, family: 'Core i5' },
  { id: 'cpu-i5-3470', name: 'Intel Core i5-3470', brand: 'Intel', tier: 3, cores: 4, threads: 4, family: 'Core i5' }
];

// ==========================================
// SEARCHABLE GPU SPECIFICATIONS DATABASE
// ==========================================
export const GPU_DATABASE: GpuSpec[] = [
  // NVIDIA RTX 40 Series (Tier 8-10)
  { id: 'gpu-rtx-4090', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', vramGb: 24, tier: 10, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4080-super', name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', vramGb: 16, tier: 10, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4080', name: 'NVIDIA GeForce RTX 4080', brand: 'NVIDIA', vramGb: 16, tier: 10, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4070-ti-super', name: 'NVIDIA GeForce RTX 4070 Ti Super', brand: 'NVIDIA', vramGb: 16, tier: 9, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4070-super', name: 'NVIDIA GeForce RTX 4070 Super', brand: 'NVIDIA', vramGb: 12, tier: 9, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4070', name: 'NVIDIA GeForce RTX 4070', brand: 'NVIDIA', vramGb: 12, tier: 8, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4060-ti-16', name: 'NVIDIA GeForce RTX 4060 Ti 16GB', brand: 'NVIDIA', vramGb: 16, tier: 8, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4060-ti-8', name: 'NVIDIA GeForce RTX 4060 Ti 8GB', brand: 'NVIDIA', vramGb: 8, tier: 8, series: 'RTX 40 Series' },
  { id: 'gpu-rtx-4060', name: 'NVIDIA GeForce RTX 4060', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 40 Series' },

  // NVIDIA RTX 30 Series (Tier 6-9)
  { id: 'gpu-rtx-3090-ti', name: 'NVIDIA GeForce RTX 3090 Ti', brand: 'NVIDIA', vramGb: 24, tier: 9, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3090', name: 'NVIDIA GeForce RTX 3090', brand: 'NVIDIA', vramGb: 24, tier: 9, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3080-ti', name: 'NVIDIA GeForce RTX 3080 Ti', brand: 'NVIDIA', vramGb: 12, tier: 9, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3080', name: 'NVIDIA GeForce RTX 3080', brand: 'NVIDIA', vramGb: 10, tier: 8, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3070-ti', name: 'NVIDIA GeForce RTX 3070 Ti', brand: 'NVIDIA', vramGb: 8, tier: 8, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3070', name: 'NVIDIA GeForce RTX 3070', brand: 'NVIDIA', vramGb: 8, tier: 8, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3060-ti', name: 'NVIDIA GeForce RTX 3060 Ti', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3060', name: 'NVIDIA GeForce RTX 3060 12GB', brand: 'NVIDIA', vramGb: 12, tier: 7, series: 'RTX 30 Series' },
  { id: 'gpu-rtx-3050', name: 'NVIDIA GeForce RTX 3050', brand: 'NVIDIA', vramGb: 8, tier: 6, series: 'RTX 30 Series' },

  // NVIDIA RTX 20 Series (Tier 6-8)
  { id: 'gpu-rtx-2080-ti', name: 'NVIDIA GeForce RTX 2080 Ti', brand: 'NVIDIA', vramGb: 11, tier: 8, series: 'RTX 20 Series' },
  { id: 'gpu-rtx-2080-super', name: 'NVIDIA GeForce RTX 2080 Super', brand: 'NVIDIA', vramGb: 8, tier: 8, series: 'RTX 20 Series' },
  { id: 'gpu-rtx-2070-super', name: 'NVIDIA GeForce RTX 2070 Super', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 20 Series' },
  { id: 'gpu-rtx-2060-super', name: 'NVIDIA GeForce RTX 2060 Super', brand: 'NVIDIA', vramGb: 8, tier: 7, series: 'RTX 20 Series' },
  { id: 'gpu-rtx-2060', name: 'NVIDIA GeForce RTX 2060 6GB', brand: 'NVIDIA', vramGb: 6, tier: 6, series: 'RTX 20 Series' },

  // NVIDIA GTX 16 & 10 Series (Tier 3-6)
  { id: 'gpu-gtx-1660-ti', name: 'NVIDIA GeForce GTX 1660 Ti', brand: 'NVIDIA', vramGb: 6, tier: 6, series: 'GTX 16 Series' },
  { id: 'gpu-gtx-1660-super', name: 'NVIDIA GeForce GTX 1660 Super', brand: 'NVIDIA', vramGb: 6, tier: 6, series: 'GTX 16 Series' },
  { id: 'gpu-gtx-1660', name: 'NVIDIA GeForce GTX 1660', brand: 'NVIDIA', vramGb: 6, tier: 5, series: 'GTX 16 Series' },
  { id: 'gpu-gtx-1650-super', name: 'NVIDIA GeForce GTX 1650 Super', brand: 'NVIDIA', vramGb: 4, tier: 5, series: 'GTX 16 Series' },
  { id: 'gpu-gtx-1650', name: 'NVIDIA GeForce GTX 1650 4GB', brand: 'NVIDIA', vramGb: 4, tier: 4, series: 'GTX 16 Series' },
  { id: 'gpu-gtx-1080-ti', name: 'NVIDIA GeForce GTX 1080 Ti', brand: 'NVIDIA', vramGb: 11, tier: 7, series: 'GTX 10 Series' },
  { id: 'gpu-gtx-1080', name: 'NVIDIA GeForce GTX 1080', brand: 'NVIDIA', vramGb: 8, tier: 6, series: 'GTX 10 Series' },
  { id: 'gpu-gtx-1070', name: 'NVIDIA GeForce GTX 1070', brand: 'NVIDIA', vramGb: 8, tier: 6, series: 'GTX 10 Series' },
  { id: 'gpu-gtx-1060-6', name: 'NVIDIA GeForce GTX 1060 6GB', brand: 'NVIDIA', vramGb: 6, tier: 5, series: 'GTX 10 Series' },
  { id: 'gpu-gtx-1060-3', name: 'NVIDIA GeForce GTX 1060 3GB', brand: 'NVIDIA', vramGb: 3, tier: 4, series: 'GTX 10 Series' },
  { id: 'gpu-gtx-1050-ti', name: 'NVIDIA GeForce GTX 1050 Ti', brand: 'NVIDIA', vramGb: 4, tier: 3, series: 'GTX 10 Series' },

  // AMD Radeon RX 7000 Series (Tier 7-10)
  { id: 'gpu-rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', vramGb: 24, tier: 10, series: 'Radeon RX 7000' },
  { id: 'gpu-rx-7900-xt', name: 'AMD Radeon RX 7900 XT', brand: 'AMD', vramGb: 20, tier: 9, series: 'Radeon RX 7000' },
  { id: 'gpu-rx-7800-xt', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', vramGb: 16, tier: 9, series: 'Radeon RX 7000' },
  { id: 'gpu-rx-7700-xt', name: 'AMD Radeon RX 7700 XT', brand: 'AMD', vramGb: 12, tier: 8, series: 'Radeon RX 7000' },
  { id: 'gpu-rx-7600-xt', name: 'AMD Radeon RX 7600 XT', brand: 'AMD', vramGb: 16, tier: 7, series: 'Radeon RX 7000' },
  { id: 'gpu-rx-7600', name: 'AMD Radeon RX 7600', brand: 'AMD', vramGb: 8, tier: 7, series: 'Radeon RX 7000' },

  // AMD Radeon RX 6000 Series (Tier 6-9)
  { id: 'gpu-rx-6950-xt', name: 'AMD Radeon RX 6950 XT', brand: 'AMD', vramGb: 16, tier: 9, series: 'Radeon RX 6000' },
  { id: 'gpu-rx-6900-xt', name: 'AMD Radeon RX 6900 XT', brand: 'AMD', vramGb: 16, tier: 9, series: 'Radeon RX 6000' },
  { id: 'gpu-rx-6800-xt', name: 'AMD Radeon RX 6800 XT', brand: 'AMD', vramGb: 16, tier: 8, series: 'Radeon RX 6000' },
  { id: 'gpu-rx-6700-xt', name: 'AMD Radeon RX 6700 XT', brand: 'AMD', vramGb: 12, tier: 8, series: 'Radeon RX 6000' },
  { id: 'gpu-rx-6650-xt', name: 'AMD Radeon RX 6650 XT', brand: 'AMD', vramGb: 8, tier: 7, series: 'Radeon RX 6000' },
  { id: 'gpu-rx-6600-xt', name: 'AMD Radeon RX 6600 XT', brand: 'AMD', vramGb: 8, tier: 7, series: 'Radeon RX 6000' },
  { id: 'gpu-rx-6600', name: 'AMD Radeon RX 6600', brand: 'AMD', vramGb: 8, tier: 6, series: 'Radeon RX 6000' },

  // AMD Radeon RX 5000 & 500 Series (Tier 4-6)
  { id: 'gpu-rx-5700-xt', name: 'AMD Radeon RX 5700 XT', brand: 'AMD', vramGb: 8, tier: 7, series: 'Radeon RX 5000' },
  { id: 'gpu-rx-5700', name: 'AMD Radeon RX 5700', brand: 'AMD', vramGb: 8, tier: 6, series: 'Radeon RX 5000' },
  { id: 'gpu-rx-5600-xt', name: 'AMD Radeon RX 5600 XT', brand: 'AMD', vramGb: 6, tier: 6, series: 'Radeon RX 5000' },
  { id: 'gpu-rx-590', name: 'AMD Radeon RX 590', brand: 'AMD', vramGb: 8, tier: 5, series: 'Radeon RX 500' },
  { id: 'gpu-rx-580', name: 'AMD Radeon RX 580 8GB', brand: 'AMD', vramGb: 8, tier: 5, series: 'Radeon RX 500' },
  { id: 'gpu-rx-570', name: 'AMD Radeon RX 570 4GB', brand: 'AMD', vramGb: 4, tier: 4, series: 'Radeon RX 500' },

  // Intel Arc Series (Tier 5-7)
  { id: 'gpu-arc-a770-16', name: 'Intel Arc A770 16GB', brand: 'Intel', vramGb: 16, tier: 7, series: 'Intel Arc' },
  { id: 'gpu-arc-a770-8', name: 'Intel Arc A770 8GB', brand: 'Intel', vramGb: 8, tier: 7, series: 'Intel Arc' },
  { id: 'gpu-arc-a750', name: 'Intel Arc A750 8GB', brand: 'Intel', vramGb: 8, tier: 6, series: 'Intel Arc' },
  { id: 'gpu-arc-a580', name: 'Intel Arc A580 8GB', brand: 'Intel', vramGb: 8, tier: 6, series: 'Intel Arc' },
  { id: 'gpu-arc-a380', name: 'Intel Arc A380 6GB', brand: 'Intel', vramGb: 6, tier: 4, series: 'Intel Arc' }
];

export const RAM_OPTIONS = [4, 8, 12, 16, 24, 32, 48, 64, 128];
export const VRAM_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];
export const OS_OPTIONS = [
  'Windows 11 64-bit',
  'Windows 10 64-bit',
  'Windows 8.1 64-bit',
  'Windows 7 64-bit'
];

export const DEFAULT_USER_PC: UserPcSpec = {
  cpuId: 'cpu-r5-5600',
  cpuName: 'AMD Ryzen 5 5600',
  gpuId: 'gpu-rtx-3060',
  gpuName: 'NVIDIA GeForce RTX 3060 12GB',
  ramGb: 16,
  vramGb: 12,
  storageGb: 150,
  os: 'Windows 11 64-bit',
  storageType: 'SSD'
};
