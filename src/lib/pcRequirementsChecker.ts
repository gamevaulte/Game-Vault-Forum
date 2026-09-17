import {
  UserPcSpec,
  PcGameRequirements,
  CheckerResult,
  ComponentComparison,
  OverallResultLevel,
  RequirementVerdict
} from '../types/pcRequirements';
import { CPU_DATABASE, GPU_DATABASE } from '../data/pcRequirementsData';

/**
 * Evaluates a user's PC hardware specifications against a game's published minimum and recommended specs.
 */
export function comparePcAgainstGame(
  userPc: UserPcSpec,
  game: PcGameRequirements
): CheckerResult {
  const userCpu = CPU_DATABASE.find((c) => c.id === userPc.cpuId) || {
    id: userPc.cpuId,
    name: userPc.cpuName,
    tier: 6,
    cores: 6,
    threads: 12,
    brand: 'AMD' as const,
    family: 'Custom'
  };

  const userGpu = GPU_DATABASE.find((g) => g.id === userPc.gpuId) || {
    id: userPc.gpuId,
    name: userPc.gpuName,
    tier: 6,
    vramGb: userPc.vramGb || 8,
    brand: 'NVIDIA' as const,
    series: 'Custom'
  };

  const comparisons: ComponentComparison[] = [];

  // 1. CPU Comparison
  let cpuVerdict: RequirementVerdict = 'meets';
  let cpuExplanation = '';
  if (userCpu.tier < game.minimum.cpuTier) {
    cpuVerdict = 'below-min';
    cpuExplanation = `Your ${userCpu.name} falls below the game's published minimum CPU requirement (${game.minimum.cpu}). You may encounter severe CPU bottlenecks, stuttering, and frame drops.`;
  } else if (userCpu.tier < game.recommended.cpuTier) {
    cpuVerdict = 'below-rec';
    cpuExplanation = `Your ${userCpu.name} meets the minimum CPU requirement, but is below the recommended tier (${game.recommended.cpu}). Expect lower frame rates in CPU-heavy or crowded scenarios.`;
  } else {
    cpuVerdict = 'meets';
    cpuExplanation = `Your ${userCpu.name} meets or exceeds the game's recommended processor requirement (${game.recommended.cpu}). Excellent computing headroom.`;
  }

  comparisons.push({
    component: 'CPU',
    userValue: userCpu.name,
    minimum: game.minimum.cpu,
    recommended: game.recommended.cpu,
    verdict: cpuVerdict,
    explanation: cpuExplanation
  });

  // 2. GPU Comparison
  let gpuVerdict: RequirementVerdict = 'meets';
  let gpuExplanation = '';
  if (userGpu.tier < game.minimum.gpuTier) {
    gpuVerdict = 'below-min';
    gpuExplanation = `Your ${userGpu.name} does not meet the minimum graphics processing tier (${game.minimum.gpu}). The game may struggle to maintain playable frame rates even at lowest settings.`;
  } else if (userGpu.tier < game.recommended.gpuTier) {
    gpuVerdict = 'below-rec';
    gpuExplanation = `Your ${userGpu.name} meets the minimum requirement, but falls below the recommended graphics card (${game.recommended.gpu}). You may need to lower graphic presets or enable resolution scaling.`;
  } else {
    gpuVerdict = 'meets';
    gpuExplanation = `Your ${userGpu.name} meets or exceeds the recommended GPU specifications (${game.recommended.gpu}) for high-detail visuals.`;
  }

  comparisons.push({
    component: 'GPU',
    userValue: userGpu.name,
    minimum: game.minimum.gpu,
    recommended: game.recommended.gpu,
    verdict: gpuVerdict,
    explanation: gpuExplanation
  });

  // 3. RAM Comparison
  let ramVerdict: RequirementVerdict = 'meets';
  let ramExplanation = '';
  if (userPc.ramGb < game.minimum.ramGb) {
    ramVerdict = 'below-min';
    ramExplanation = `Your system has ${userPc.ramGb} GB of RAM, which is below the required ${game.minimum.ramGb} GB minimum. Insufficient memory will cause hitching, disk paging, and possible crashes.`;
  } else if (userPc.ramGb < game.recommended.ramGb) {
    ramVerdict = 'below-rec';
    ramExplanation = `Your ${userPc.ramGb} GB of RAM satisfies minimum requirements (${game.minimum.ramGb} GB) but is below the recommended ${game.recommended.ramGb} GB. Close background programs while playing.`;
  } else {
    ramVerdict = 'meets';
    ramExplanation = `Your ${userPc.ramGb} GB of RAM meets or exceeds the recommended memory specification (${game.recommended.ramGb} GB).`;
  }

  comparisons.push({
    component: 'RAM',
    userValue: `${userPc.ramGb} GB`,
    minimum: `${game.minimum.ramGb} GB`,
    recommended: `${game.recommended.ramGb} GB`,
    verdict: ramVerdict,
    explanation: ramExplanation
  });

  // 4. VRAM Comparison
  const effectiveVram = userPc.vramGb || userGpu.vramGb;
  let vramVerdict: RequirementVerdict = 'meets';
  let vramExplanation = '';
  if (effectiveVram < game.minimum.vramGb) {
    vramVerdict = 'below-min';
    vramExplanation = `Your GPU provides ${effectiveVram} GB VRAM, which is under the ${game.minimum.vramGb} GB minimum. Low video memory causes blurry textures and stuttering.`;
  } else if (effectiveVram < game.recommended.vramGb) {
    vramVerdict = 'below-rec';
    vramExplanation = `Your ${effectiveVram} GB VRAM meets minimum requirements, but high texture settings require ${game.recommended.vramGb} GB.`;
  } else {
    vramVerdict = 'meets';
    vramExplanation = `Your ${effectiveVram} GB of video memory provides plenty of buffer for high-resolution textures.`;
  }

  comparisons.push({
    component: 'VRAM',
    userValue: `${effectiveVram} GB`,
    minimum: `${game.minimum.vramGb} GB`,
    recommended: `${game.recommended.vramGb} GB`,
    verdict: vramVerdict,
    explanation: vramExplanation
  });

  // 5. Storage Comparison
  let storageVerdict: RequirementVerdict = 'meets';
  let storageExplanation = '';
  if (userPc.storageGb < game.minimum.storageGb) {
    storageVerdict = 'below-min';
    storageExplanation = `You have ${userPc.storageGb} GB of free storage space, but the game requires at least ${game.minimum.storageGb} GB. Free up additional disk space before installing.`;
  } else {
    storageVerdict = 'meets';
    const storageNote = game.minimum.storageType ? ` (${game.minimum.storageType})` : '';
    storageExplanation = `You have ${userPc.storageGb} GB of available space, meeting the game's published ${game.minimum.storageGb} GB requirement${storageNote}.`;
  }

  comparisons.push({
    component: 'Storage',
    userValue: `${userPc.storageGb} GB Free (${userPc.storageType})`,
    minimum: `${game.minimum.storageGb} GB`,
    recommended: `${game.recommended.storageGb} GB (${game.recommended.storageType || 'SSD'})`,
    verdict: storageVerdict,
    explanation: storageExplanation
  });

  // 6. Operating System Comparison
  let osVerdict: RequirementVerdict = 'meets';
  let osExplanation = '';
  const is64Bit = userPc.os.includes('64-bit') || userPc.os.includes('11') || userPc.os.includes('10');
  if (!is64Bit) {
    osVerdict = 'below-min';
    osExplanation = 'This game requires a 64-bit operating system. 32-bit Windows is not supported.';
  } else {
    osVerdict = 'meets';
    osExplanation = `Your ${userPc.os} is fully compatible with modern 64-bit game execution and security environments.`;
  }

  comparisons.push({
    component: 'OS',
    userValue: userPc.os,
    minimum: game.minimum.os,
    recommended: game.recommended.os,
    verdict: osVerdict,
    explanation: osExplanation
  });

  // Determine Overall Verdict Level
  const failCount = comparisons.filter((c) => c.verdict === 'below-min').length;
  const belowRecCount = comparisons.filter((c) => c.verdict === 'below-rec').length;

  let overallLevel: OverallResultLevel;
  let verdictStatus: 'YES' | 'PARTIALLY' | 'NO';
  let verdictTitle: string;
  let summaryBadge: string;
  let summaryExplanation: string;

  if (failCount > 0) {
    overallLevel = 'not-met';
    verdictStatus = 'NO';
    verdictTitle = 'NO — Your PC Does Not Meet Minimum Requirements';
    summaryBadge = '🔴 Minimum Requirements Not Met';
    summaryExplanation = `Your system is below the published minimum specifications on ${failCount} essential component${failCount > 1 ? 's' : ''}. Upgrading the highlighted hardware is recommended before purchasing or installing.`;
  } else if (belowRecCount === 0) {
    overallLevel = 'excellent';
    verdictStatus = 'YES';
    verdictTitle = 'YES — Your PC Meets or Exceeds Recommended Requirements';
    summaryBadge = '🟢 Excellent Match';
    summaryExplanation = `Your computer comfortably exceeds the published recommended specifications. You should be able to run ${game.title} at high visual fidelity and smooth framerates.`;
  } else if (belowRecCount <= 2 && userGpu.tier >= game.recommended.gpuTier - 1 && userCpu.tier >= game.recommended.cpuTier - 1) {
    overallLevel = 'good';
    verdictStatus = 'YES';
    verdictTitle = 'YES — Your PC Meets Requirements for Smooth Gameplay';
    summaryBadge = '🟢 Good to Play';
    summaryExplanation = `Your PC easily satisfies the minimum requirements and is very close to recommended tier. You will enjoy a solid gaming experience with modest setting adjustments.`;
  } else if (belowRecCount <= 3) {
    overallLevel = 'below-recommended';
    verdictStatus = 'PARTIALLY';
    verdictTitle = 'PARTIALLY — Your PC Meets Minimum, but Falls Below Recommended';
    summaryBadge = '🟠 Below Recommended';
    summaryExplanation = `Your PC meets the minimum specifications to launch and play, but certain components fall below recommended guidelines. Reduced visual settings are suggested for stable performance.`;
  } else {
    overallLevel = 'minimum-met';
    verdictStatus = 'PARTIALLY';
    verdictTitle = 'PARTIALLY — Minimum Requirements Met (Lower Settings Advised)';
    summaryBadge = '🟡 Minimum Requirements Met';
    summaryExplanation = `Your hardware satisfies the game's baseline minimum requirements. Plan on using low-to-medium graphics presets and resolution scaling for comfortable play.`;
  }

  // Graphics settings guidance
  const guidance = game.graphicsGuidance || {
    resolution: '1080p',
    preset: overallLevel === 'excellent' ? 'High / Ultra' : overallLevel === 'good' ? 'Medium / High' : 'Low / Medium',
    rayTracing: 'Off',
    upscaling: 'FSR / DLSS Balanced recommended',
    notes: 'Adjust volumetric effects, shadow cascades, and draw distances for optimal frametimes.'
  };

  return {
    overallLevel,
    verdictStatus,
    verdictTitle,
    summaryBadge,
    summaryExplanation,
    comparisons,
    graphicsGuidance: {
      resolution: guidance.resolution,
      preset: guidance.preset,
      rayTracing: guidance.rayTracing,
      upscaling: guidance.upscaling,
      disclaimer:
        'These are general starting recommendations. Actual FPS and visual quality depend on the game, drivers, in-game background tasks, thermal cooling, and hardware configuration.'
    },
    fpsNotice:
      'FPS: Not available — Hardware requirements alone cannot guarantee a specific FPS. Real-world frame rates depend on resolution, driver optimization, thermal throttling, and background tasks. Game Vault Forum does not invent speculative FPS numbers.'
  };
}

/**
 * Filter all games in database that the user's PC is capable of running
 */
export function findGamesPcCanRun(
  userPc: UserPcSpec,
  allGames: PcGameRequirements[],
  genreFilter: string = 'All',
  tierFilter: 'all' | 'recommended_only' = 'all'
) {
  return allGames
    .filter((g) => {
      if (genreFilter !== 'All' && g.genre.toLowerCase() !== genreFilter.toLowerCase()) {
        return false;
      }
      return true;
    })
    .map((game) => {
      const evaluation = comparePcAgainstGame(userPc, game);
      return {
        game,
        evaluation
      };
    })
    .filter(({ evaluation }) => {
      if (tierFilter === 'recommended_only') {
        return evaluation.overallLevel === 'excellent' || evaluation.overallLevel === 'good';
      }
      return evaluation.verdictStatus !== 'NO';
    });
}

/**
 * Browser-safe hardware detector using standard web APIs.
 * Includes complete disclosure regarding browser security sandboxing.
 */
export function detectBrowserHardware(): {
  detectedCores: number | null;
  detectedRamGb: number | null;
  detectedGpuRenderer: string | null;
  matchedCpu: typeof CPU_DATABASE[0] | null;
  matchedGpu: typeof GPU_DATABASE[0] | null;
  disclaimer: string;
} {
  let detectedCores: number | null = null;
  let detectedRamGb: number | null = null;
  let detectedGpuRenderer: string | null = null;
  let matchedCpu: typeof CPU_DATABASE[0] | null = null;
  let matchedGpu: typeof GPU_DATABASE[0] | null = null;

  if (typeof window !== 'undefined') {
    // 1. Logical Cores
    if (navigator.hardwareConcurrency) {
      detectedCores = navigator.hardwareConcurrency;
      // Try to find a reasonable CPU with this thread count
      matchedCpu =
        CPU_DATABASE.find((c) => c.threads === detectedCores) ||
        CPU_DATABASE.find((c) => c.cores === detectedCores) ||
        null;
    }

    // 2. Device Memory (Available in Chromium-based browsers)
    const nav = navigator as any;
    if (nav.deviceMemory) {
      detectedRamGb = Math.max(4, Math.round(nav.deviceMemory));
    }

    // 3. WebGL GPU Unmasked Renderer
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (typeof renderer === 'string') {
            detectedGpuRenderer = renderer;

            // Search GPU database for matches in the unmasked renderer string
            for (const gpu of GPU_DATABASE) {
              const cleanGpuName = gpu.name.toLowerCase().replace(/geforce\s+/i, '').replace(/radeon\s+/i, '');
              const parts = cleanGpuName.split(' ');
              if (parts.length >= 2 && renderer.toLowerCase().includes(parts[0]) && renderer.toLowerCase().includes(parts[1])) {
                matchedGpu = gpu;
                break;
              }
            }
          }
        }
      }
    } catch {
      // Ignore WebGL detection restrictions
    }
  }

  const disclaimer =
    'For security and privacy reasons, your web browser sandboxes hardware access and does not allow websites to inspect your detailed motherboard, BIOS, or exact drive capacities. The detected values above are high-level heuristics — please review and adjust your specifications manually for complete accuracy.';

  return {
    detectedCores,
    detectedRamGb,
    detectedGpuRenderer,
    matchedCpu,
    matchedGpu,
    disclaimer
  };
}

/**
 * Generate share text and links for results
 */
export function generateShareLinks(gameTitle: string, result: CheckerResult) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://gamevault.forum/tools/pc-game-requirements-checker';
  const shareText = `I checked whether my PC can run ${gameTitle} on the Game Vault Forum PC Game Requirements Checker. Result: ${result.summaryBadge}! Check your PC:`;

  return {
    shareText,
    url: currentUrl,
    whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`,
    twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
  };
}
