import { 
  FpsCalculationInput, 
  FpsCalculationResult, 
  ResolutionOption, 
  GraphicsPreset 
} from '../types/fpsCalculator';
import { 
  GAME_PERFORMANCE_PROFILES, 
  ALL_CALCULATOR_CPUS, 
  ALL_CALCULATOR_GPUS,
  RESOLUTION_DEFINITIONS,
  PRESET_DEFINITIONS,
  UPSCALING_DEFINITIONS,
  GamePerformanceProfile
} from '../data/fpsCalculatorData';
import { EXPANDED_GAMES_REQUIREMENTS } from '../data/expandedPcGamesData';
import { PcGameRequirements } from '../types/pcRequirements';

// Helper to look up or construct game profile
export function getGameProfileOrFallback(gameId: string, gameTitle: string): {
  profile: GamePerformanceProfile;
  requirements?: PcGameRequirements;
  isCustom: boolean;
} {
  const profile = GAME_PERFORMANCE_PROFILES.find(g => g.id === gameId || g.slug === gameId || g.title.toLowerCase() === gameTitle.toLowerCase());
  const req = EXPANDED_GAMES_REQUIREMENTS.find(r => r.id === gameId || r.slug === gameId || r.title.toLowerCase() === gameTitle.toLowerCase());

  if (profile) {
    return { profile, requirements: req, isCustom: false };
  }

  // Fallback profile if user chose an unlisted game or custom input
  const defaultProfile: GamePerformanceProfile = {
    id: gameId || 'custom-game',
    title: gameTitle || 'Custom PC Game',
    slug: 'custom-game',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    genre: 'General PC Title',
    releaseYear: 2024,
    engine: 'DirectX 12 / Modern Engine',
    demandTier: 3,
    cpuHeavy: false,
    supportsRayTracing: true,
    supportsDlss: true,
    supportsFsr: true,
    supportsXeSS: true,
    supportsFrameGen: true,
    target60Fps1080pGpuTier: 6,
    target60Fps1080pCpuTier: 6,
    vramBaselineGb: { '720p': 3, '900p': 4, '1080p': 6, '1440p': 8, '4k': 10 },
    hasVerifiedBenchmarks: false,
    benchmarkNotes: 'Calculated using architectural baseline simulation.'
  };

  return { profile: defaultProfile, requirements: req, isCustom: true };
}

export function calculateGamingPerformance(input: FpsCalculationInput): FpsCalculationResult {
  const { profile, requirements, isCustom } = getGameProfileOrFallback(input.gameId, input.gameTitle);

  // 1. Locate GPU spec
  const gpuSpec = ALL_CALCULATOR_GPUS.find(g => g.id === input.gpuId || g.name.toLowerCase() === input.gpuName.toLowerCase()) || {
    id: input.gpuId,
    name: input.gpuName || 'Generic Modern GPU',
    brand: 'NVIDIA',
    tier: 6,
    vramGb: input.vramGb || 8,
    supportsDlss: true,
    supportsDlssFrameGen: false,
    supportsFsr: true,
    supportsXeSS: true,
    rayTracingTier: 4,
    isLaptop: false
  };

  // 2. Locate CPU spec
  const cpuSpec = ALL_CALCULATOR_CPUS.find(c => c.id === input.cpuId || c.name.toLowerCase() === input.cpuName.toLowerCase()) || {
    id: input.cpuId,
    name: input.cpuName || 'Generic Modern CPU',
    brand: 'AMD',
    tier: 6,
    cores: 6,
    threads: 12,
    family: 'Mainstream'
  };

  const isLaptop = input.isLaptopGpu ?? (gpuSpec.isLaptop || false);
  const userVram = input.vramGb || gpuSpec.vramGb || 8;
  const userRam = input.ramGb || 16;
  const userTargetFps = input.targetFps || 60;

  // 3. Resolution scaling factor
  const resKey = input.resolution;
  const resDef = RESOLUTION_DEFINITIONS[resKey] || RESOLUTION_DEFINITIONS['1080p'];
  
  // Pixel multiplier (1080p = 1.0, 1440p = 1.78, 4K = 4.0)
  // Real games don't drop strictly linear with pixel count because geometry & physics remain constant.
  // Real world GPU FPS scaling curve:
  let resolutionGpuFactor = 1.0;
  if (resKey === '720p') resolutionGpuFactor = 1.45;
  else if (resKey === '900p') resolutionGpuFactor = 1.25;
  else if (resKey === '1080p') resolutionGpuFactor = 1.00;
  else if (resKey === '1440p') resolutionGpuFactor = 0.68;
  else if (resKey === '4k') resolutionGpuFactor = 0.40;
  else if (resKey === 'custom' && input.customResolution) {
    const customPixels = input.customResolution.width * input.customResolution.height;
    const ratio = customPixels / 2073600; // relative to 1080p
    resolutionGpuFactor = Math.max(0.25, Math.min(1.8, Math.pow(1 / ratio, 0.65)));
  }

  // At lower resolutions (720p/1080p), the CPU exerts far higher relative bottleneck on high-end GPUs:
  let cpuResolutionSensitivity = 1.0;
  if (resKey === '720p') cpuResolutionSensitivity = 1.35;
  else if (resKey === '900p') cpuResolutionSensitivity = 1.18;
  else if (resKey === '1080p') cpuResolutionSensitivity = 1.00;
  else if (resKey === '1440p') cpuResolutionSensitivity = 0.85;
  else if (resKey === '4k') cpuResolutionSensitivity = 0.70;

  // 4. Preset scaling factor
  const presetDef = PRESET_DEFINITIONS[input.graphicsPreset] || PRESET_DEFINITIONS['high'];
  const presetGpuFactor = presetDef.gpuMultiplier;
  const presetCpuFactor = presetDef.cpuMultiplier;

  // 5. Baseline GPU FPS calculation
  // Tier 7 GPU on Tier 7 Game at 1080p High = ~65-75 FPS baseline
  // Each GPU tier step represents approximately ~20-25% relative raster performance
  const gpuTierDelta = gpuSpec.tier - profile.target60Fps1080pGpuTier;
  const gpuBaseFps = 65 * Math.pow(1.24, gpuTierDelta);

  // Apply laptop thermal/power limit factor if applicable
  const laptopFactor = isLaptop ? 0.84 : 1.0;

  // 6. Ray Tracing Impact
  let rayTracingFactor = 1.0;
  if (input.rayTracing !== 'off') {
    const rtTier = gpuSpec.rayTracingTier ?? (gpuSpec.tier >= 8 ? 7 : gpuSpec.tier >= 6 ? 4 : 1);
    const rtPenaltyByPreset: Record<string, number> = {
      low: 0.80,
      medium: 0.70,
      high: 0.58,
      ultra: 0.48
    };
    const basePenalty = rtPenaltyByPreset[input.rayTracing] || 0.65;
    
    // Hardware acceleration efficiency: RTX 40 & 30 series handle BVH traversal better than older/budget GPUs
    const rtEfficiency = Math.min(1.15, Math.max(0.65, 0.7 + (rtTier * 0.05)));
    rayTracingFactor = Math.max(0.25, basePenalty * rtEfficiency);
  }

  // 7. Upscaling Boost Factor
  const upscalerDef = UPSCALING_DEFINITIONS[input.upscaling] || UPSCALING_DEFINITIONS['off'];
  const upscalingBoost = upscalerDef.boostFactor;

  // Net GPU-projected frame rate:
  let gpuProjectedFps = gpuBaseFps * resolutionGpuFactor * presetGpuFactor * laptopFactor * rayTracingFactor * upscalingBoost;

  // 8. CPU Headroom & Frame Rate Ceiling
  // High-tier CPU (Tier 8-10) can deliver 140-240+ FPS, while budget CPU (Tier 4-5) may cap around 55-80 FPS in heavy games.
  const cpuTierDelta = cpuSpec.tier - profile.target60Fps1080pCpuTier;
  const cpuBaseCeiling = (profile.cpuHeavy ? 70 : 95) * Math.pow(1.22, cpuTierDelta);
  const cpuProjectedFps = (cpuBaseCeiling * presetCpuFactor) / cpuResolutionSensitivity;

  // 9. RAM & Channel Impact
  let ramFactor = 1.0;
  let ramStutterPenalty = 0.0;
  if (userRam < 8) {
    ramFactor = 0.70; // Severe memory starvation
    ramStutterPenalty = 0.35;
  } else if (userRam < 16 && (profile.demandTier >= 4 || resKey === '1440p' || resKey === '4k')) {
    ramFactor = 0.88; // Micro-stutters during asset loading
    ramStutterPenalty = 0.18;
  }

  // Single-channel RAM impacts CPU memory bandwidth significantly
  if (input.ramChannel === 'single') {
    ramFactor *= 0.92;
    ramStutterPenalty += 0.10;
  }

  // Storage factor on modern open worlds
  let storagePenalty = 0.0;
  if (input.storageType === 'hdd' && profile.demandTier >= 4) {
    storagePenalty = 0.12; // Asset streaming hitches on mechanical drives
  }

  // 10. Harmonize GPU and CPU constraints (The true render bottleneck)
  // FPS is governed by whichever component is slower, with slight blending
  const rawRenderFps = Math.min(gpuProjectedFps, cpuProjectedFps) * ramFactor;

  // 11. VRAM Headroom & Spillover Check
  const baselineVram = profile.vramBaselineGb[resKey === 'custom' ? '1080p' : resKey] || 6;
  const requiredVram = baselineVram + presetDef.vramBonusGb + (input.rayTracing !== 'off' ? 1.5 : 0);
  let vramWarning: string | null = null;
  let vramThrottling = 1.0;

  if (userVram < requiredVram) {
    const deficit = requiredVram - userVram;
    if (deficit >= 3) {
      vramThrottling = 0.65;
      vramWarning = `Severe VRAM Exhaustion: Settings require ~${requiredVram.toFixed(0)} GB VRAM, but your GPU has ${userVram} GB. Textures will spill into system RAM, creating major stuttering and low FPS.`;
    } else {
      vramThrottling = 0.82;
      vramWarning = `VRAM Headroom Alert: Estimated requirement is ~${requiredVram.toFixed(0)} GB VRAM vs ${userVram} GB available. You may experience texture pop-in or occasional frame drops during intense scenes.`;
    }
  }

  const effectiveNativeAvg = Math.max(12, Math.round(rawRenderFps * vramThrottling));

  // 12. Frame Generation Handling
  let finalAvgFps = effectiveNativeAvg;
  let frameGenDetails: FpsCalculationResult['frameGenerationDetails'] | undefined = undefined;

  if (input.frameGeneration === 'on') {
    const frameGenMultiplier = 1.68; // ~68% displayed frame increase via optical flow interpolation
    const displayedAvg = Math.round(effectiveNativeAvg * frameGenMultiplier);
    finalAvgFps = displayedAvg;

    frameGenDetails = {
      nativeFpsRange: `${Math.round(effectiveNativeAvg * 0.90)}–${Math.round(effectiveNativeAvg * 1.10)} FPS`,
      generatedFpsRange: `${Math.round(displayedAvg * 0.92)}–${Math.round(displayedAvg * 1.08)} FPS`,
      explanation: `Frame Generation produces interpolated frames to smooth motion on high-refresh displays. Input latency and responsiveness remain bound to your base render rate of ~${effectiveNativeAvg} FPS.`
    };
  }

  // 13. Realistic FPS Range Calculation (Reflecting Uncertainty & Scene Variance)
  // Indoor scenes run higher, explosive outdoor combat runs lower
  const spreadFactor = 0.12; // +/- 12% standard variance
  const minFps = Math.max(10, Math.round(finalAvgFps * (1 - spreadFactor)));
  const maxFps = Math.max(minFps + 4, Math.round(finalAvgFps * (1 + spreadFactor)));
  const avgFps = Math.round((minFps + maxFps) / 2);

  // 14. 1% Low FPS Estimation
  // 1% lows reflect the worst 1% of frame times (stutters during explosions, crowd density, asset streaming)
  const baseLowRatio = profile.cpuHeavy ? 0.68 : 0.74;
  const lowRatioPenalty = (ramStutterPenalty + storagePenalty + (vramThrottling < 1.0 ? 0.15 : 0));
  const effectiveLowRatio = Math.max(0.40, baseLowRatio - lowRatioPenalty);
  const onePercentLowFps = Math.max(8, Math.round(effectiveNativeAvg * effectiveLowRatio));

  // 15. Frame Time in Milliseconds
  const frameTimeMs = parseFloat((1000 / Math.max(1, avgFps)).toFixed(1));

  // 16. Performance Rating & Status
  let performanceRating: FpsCalculationResult['performanceRating'] = 'good';
  let status: FpsCalculationResult['status'] = 'good';
  const meetsTarget = avgFps >= userTargetFps;

  if (avgFps >= 100 && meetsTarget) {
    performanceRating = 'excellent';
    status = 'good';
  } else if (avgFps >= 60 && meetsTarget) {
    performanceRating = 'good';
    status = 'good';
  } else if (avgFps >= 45) {
    performanceRating = 'playable';
    status = meetsTarget ? 'good' : 'playable';
  } else if (avgFps >= 30) {
    performanceRating = 'limited';
    status = meetsTarget ? 'playable' : 'below_target';
  } else {
    performanceRating = 'not_recommended';
    status = 'below_target';
  }

  // 17. Bottleneck Analysis
  let bottleneck: FpsCalculationResult['bottleneck'];
  const gpuVsCpuRatio = gpuProjectedFps / Math.max(1, cpuProjectedFps);

  if (vramThrottling < 0.80) {
    bottleneck = {
      component: 'vram',
      headline: 'Possible VRAM Limitation',
      explanation: `Your graphics card's ${userVram} GB VRAM capacity is actively exceeding memory limits at ${resDef.label} ${presetDef.label}. Lowering textures or shadows will significantly stabilize performance.`,
      confidence: 'high'
    };
  } else if (gpuVsCpuRatio < 0.82) {
    bottleneck = {
      component: 'gpu',
      headline: 'Possible GPU Bottleneck',
      explanation: `Your graphics card (${gpuSpec.name}) is likely to be the main performance limitation at ${resDef.label} with ${presetDef.label}. Your processor has additional headroom.`,
      confidence: 'high'
    };
  } else if (gpuVsCpuRatio > 1.25) {
    bottleneck = {
      component: 'cpu',
      headline: 'Possible CPU Bottleneck',
      explanation: `Your GPU is capable of higher framerates, but your processor (${cpuSpec.name}) is likely to limit performance in CPU-heavy sequences or crowded scenes.`,
      confidence: profile.cpuHeavy ? 'high' : 'medium'
    };
  } else if (userRam < 12 && profile.demandTier >= 4) {
    bottleneck = {
      component: 'ram',
      headline: 'Possible System RAM Limitation',
      explanation: `With ${userRam} GB of RAM, modern background tasks and game caches may trigger memory paging to disk, producing periodic frame drops.`,
      confidence: 'medium'
    };
  } else {
    bottleneck = {
      component: 'balanced',
      headline: 'Hardware Harmony Detected',
      explanation: `Your CPU (${cpuSpec.name}) and GPU (${gpuSpec.name}) are well-matched for ${profile.title} at ${resDef.label}. Neither component introduces an extreme bottleneck.`,
      confidence: 'high'
    };
  }

  // 18. Hardware Compatibility Check against official game requirements
  const minCpuTier = requirements?.minimum.cpuTier || Math.max(3, profile.target60Fps1080pCpuTier - 2);
  const recCpuTier = requirements?.recommended.cpuTier || profile.target60Fps1080pCpuTier;
  const minGpuTier = requirements?.minimum.gpuTier || Math.max(3, profile.target60Fps1080pGpuTier - 2);
  const recGpuTier = requirements?.recommended.gpuTier || profile.target60Fps1080pGpuTier;
  const minRamGb = requirements?.minimum.ramGb || 8;
  const recRamGb = requirements?.recommended.ramGb || 16;
  const minVramGb = requirements?.minimum.vramGb || 4;

  const hardwareCheck: FpsCalculationResult['hardwareCheck'] = {
    cpu: {
      meets: cpuSpec.tier >= minCpuTier,
      status: cpuSpec.tier >= recCpuTier ? 'exceeds' : cpuSpec.tier >= minCpuTier ? 'meets' : 'below',
      details: cpuSpec.tier >= recCpuTier 
        ? 'Exceeds recommended processor requirements'
        : cpuSpec.tier >= minCpuTier 
          ? 'Meets minimum processor requirements'
          : 'Below recommended processor tier for this title'
    },
    gpu: {
      meets: gpuSpec.tier >= minGpuTier,
      status: gpuSpec.tier >= recGpuTier ? 'exceeds' : gpuSpec.tier >= minGpuTier ? 'meets' : 'below',
      details: gpuSpec.tier >= recGpuTier
        ? 'Exceeds recommended graphics card requirements'
        : gpuSpec.tier >= minGpuTier
          ? 'Meets minimum graphics card requirements'
          : 'Below recommended graphics card tier'
    },
    ram: {
      meets: userRam >= minRamGb,
      status: userRam >= recRamGb ? 'exceeds' : userRam >= minRamGb ? 'meets' : 'below',
      details: userRam >= recRamGb
        ? `${userRam} GB comfortably covers recommended RAM (${recRamGb} GB)`
        : userRam >= minRamGb
          ? `${userRam} GB meets minimum RAM requirements (${minRamGb} GB)`
          : `${userRam} GB is below the minimum RAM required (${minRamGb} GB)`
    },
    vram: {
      meets: userVram >= minVramGb,
      status: userVram >= requiredVram ? 'exceeds' : userVram >= minVramGb ? 'close' : 'below',
      details: userVram >= requiredVram
        ? `${userVram} GB VRAM exceeds the estimated need (~${requiredVram.toFixed(0)} GB)`
        : userVram >= minVramGb
          ? `${userVram} GB VRAM is near the threshold for these quality settings`
          : `${userVram} GB VRAM is below recommended threshold`
    },
    storage: {
      meets: true,
      status: input.storageType === 'nvme_ssd' ? 'exceeds' : input.storageType === 'sata_ssd' ? 'meets' : 'close',
      details: input.storageType === 'hdd'
        ? 'Mechanical HDD may cause texture streaming pauses in modern titles'
        : 'Solid State Drive provides fast asset streaming'
    }
  };

  // 19. Recommended Settings for optimal 60+ FPS
  let recRes = '1080p';
  let recPreset = 'High';
  let recRt = 'Off';
  let recUpscaler = 'Off';
  let recFpsRange = '65–80 FPS';
  let recReason = '';

  if (gpuSpec.tier >= 9) {
    recRes = '1440p';
    recPreset = 'Ultra';
    recRt = profile.supportsRayTracing && gpuSpec.rayTracingTier && gpuSpec.rayTracingTier >= 7 ? 'Medium' : 'Off';
    recUpscaler = gpuSpec.supportsDlss ? 'DLSS Quality' : gpuSpec.supportsFsr ? 'FSR Quality' : 'Off';
    recFpsRange = '85–110 FPS';
    recReason = 'Your GPU has substantial headroom for pristine 1440p visuals while maintaining high fluidity.';
  } else if (gpuSpec.tier >= 7) {
    recRes = '1080p';
    recPreset = 'High';
    recRt = 'Off';
    recUpscaler = gpuSpec.supportsDlss ? 'DLSS Quality' : gpuSpec.supportsFsr ? 'FSR Quality' : 'Off';
    recFpsRange = '70–90 FPS';
    recReason = 'A balanced sweet spot delivering crisp image clarity and competitive frame stability without thermal throttling.';
  } else if (gpuSpec.tier >= 5) {
    recRes = '1080p';
    recPreset = 'Medium';
    recRt = 'Off';
    recUpscaler = gpuSpec.supportsFsr ? 'FSR Balanced' : 'Off';
    recFpsRange = '55–70 FPS';
    recReason = 'Medium presets reduce shader overhead and preserve smooth 60 FPS gameplay on mid-range hardware.';
  } else {
    recRes = '900p / 1080p';
    recPreset = 'Low';
    recRt = 'Off';
    recUpscaler = gpuSpec.supportsFsr ? 'FSR Performance' : 'Off';
    recFpsRange = '45–60 FPS';
    recReason = 'Prioritizing responsive frame pacing by minimizing volumetric lighting and heavy post-processing.';
  }

  const recommendedSettings: FpsCalculationResult['recommendedSettings'] = {
    resolution: recRes,
    preset: recPreset,
    rayTracing: recRt,
    upscaling: recUpscaler,
    expectedFpsRange: recFpsRange,
    reasoning: recReason
  };

  // 20. Performance Comparison matrix
  const compareConfigs: Array<{ res: ResolutionOption; preset: GraphicsPreset; label: string }> = [
    { res: '1080p', preset: 'low', label: '1080p Low' },
    { res: '1080p', preset: 'high', label: '1080p High' },
    { res: '1440p', preset: 'high', label: '1440p High' },
    { res: '4k', preset: 'ultra', label: '4K Ultra' }
  ];

  const comparisons = compareConfigs.map(c => {
    const rDef = RESOLUTION_DEFINITIONS[c.res];
    const pDef = PRESET_DEFINITIONS[c.preset];
    let resMult = 1.0;
    if (c.res === '1080p') resMult = 1.0;
    else if (c.res === '1440p') resMult = 0.68;
    else if (c.res === '4k') resMult = 0.40;

    let cpuSens = 1.0;
    if (c.res === '1080p') cpuSens = 1.0;
    else if (c.res === '1440p') cpuSens = 0.85;
    else if (c.res === '4k') cpuSens = 0.70;

    const gFps = gpuBaseFps * resMult * pDef.gpuMultiplier * laptopFactor;
    const cFps = (cpuBaseCeiling * pDef.cpuMultiplier) / cpuSens;
    const compAvg = Math.max(12, Math.round(Math.min(gFps, cFps) * ramFactor));
    const compMin = Math.round(compAvg * 0.88);
    const compMax = Math.round(compAvg * 1.12);

    const isCurrent = c.res === input.resolution && c.preset === input.graphicsPreset;

    return {
      name: c.label,
      resolution: rDef.label,
      preset: pDef.label,
      fpsRange: `${compMin}–${compMax} FPS`,
      avgFps: compAvg,
      badge: isCurrent ? 'Selected' : undefined
    };
  });

  // 21. Data Source Attribution
  const dataSource: FpsCalculationResult['dataSource'] = {
    type: profile.hasVerifiedBenchmarks ? 'verified_benchmark' : 'hardware_model',
    label: profile.hasVerifiedBenchmarks ? 'Game Vault Verified Benchmarks' : 'Architectural Estimation Model',
    description: profile.hasVerifiedBenchmarks
      ? `Calibrated against verified in-engine performance passes on PC (${profile.engine}).`
      : 'Calculated using standardized GPU compute tier, CPU instruction throughput, and memory bandwidth modeling.',
    accuracyRating: profile.hasVerifiedBenchmarks ? 'high' : 'medium'
  };

  return {
    minFps,
    maxFps,
    avgFps,
    onePercentLowFps,
    frameTimeMs,
    performanceRating,
    status,
    meetsTarget,
    targetFps: userTargetFps,
    resolutionLabel: resDef.label,
    presetLabel: presetDef.label,
    bottleneck,
    hardwareCheck,
    recommendedSettings,
    comparisons,
    frameGenerationDetails: frameGenDetails,
    vramWarning,
    dataSource,
    hasReliableData: true
  };
}

// Local Analytical Fallback for AI Performance Explanation
export function generateLocalAiExplanation(result: FpsCalculationResult, input: FpsCalculationInput): string {
  const isGood = result.status === 'good';
  const bottleneckWord = result.bottleneck.component === 'gpu' ? 'graphics card' : result.bottleneck.component === 'cpu' ? 'processor' : 'hardware memory';

  let text = `Based on our performance analysis, your PC is estimated to deliver ${result.minFps}–${result.maxFps} FPS in ${input.gameTitle} at ${result.resolutionLabel} with ${result.presetLabel}. `;

  if (isGood) {
    text += `Your configuration easily meets the performance envelope for a smooth, stable experience. `;
  } else {
    text += `While playable, higher frame rates may require toning down demanding volumetric shadows or adjusting anti-aliasing. `;
  }

  if (result.bottleneck.component === 'gpu') {
    text += `At ${result.resolutionLabel}, your graphics card (${input.gpuName}) is likely the primary factor limiting peak frame rates. `;
  } else if (result.bottleneck.component === 'cpu') {
    text += `Your GPU has headroom, but high-density scenes or multiplayer physics will place the heaviest workload on your processor (${input.cpuName}). `;
  } else if (result.bottleneck.component === 'vram') {
    text += `VRAM allocation is close to full capacity; lowering texture resolution will prevent micro-stuttering. `;
  }

  if (input.upscaling !== 'off') {
    text += `Upscaling technology is actively boosting your frame pacing while maintaining sharp image reconstruction.`;
  } else {
    text += `Enabling Quality DLSS or FSR could provide an additional 25–35% frame rate buffer with minimal loss in visual clarity.`;
  }

  return text;
}

// Local Analytical Fallback for AI Upgrade Advisor
export function generateLocalUpgradeAdvice(result: FpsCalculationResult, input: FpsCalculationInput): string {
  if (result.bottleneck.component === 'gpu') {
    return `### Hardware Upgrade Recommendation: Graphics Card (GPU)
Based on this calculation, your **GPU (${input.gpuName})** is the main limitation preventing higher frame rates at ${result.resolutionLabel}.

- **Why**: Modern titles scale heavily with shader units and rasterization pipelines at ${result.resolutionLabel}.
- **Suggested Upgrade Path**: A current-generation GPU with at least 12GB to 16GB of VRAM (such as an RTX 4070 / RX 7800 XT) would provide a significant 40–60% performance uplift without requiring a total system rebuild.
- **Budget Tip**: Avoid overspending on extreme flagship cards unless your monitor supports 144Hz+ at 1440p or 4K.`;
  }

  if (result.bottleneck.component === 'cpu') {
    return `### Hardware Upgrade Recommendation: Processor (CPU)
Your graphics card is capable of pushing more frames, but your **CPU (${input.cpuName})** is the primary factor limiting frame pacing.

- **Why**: Games with heavy crowd simulation, high-tick physics, or open-world asset streaming rely on strong single-core speed and large L3 cache.
- **Suggested Upgrade Path**: Upgrading to a processor with a high 3D V-Cache (such as the AMD Ryzen 7 7800X3D / 5700X3D) or a modern Intel Core i5/i7 (13600K / 14600K) will significantly boost your 1% low FPS and eliminate stuttering.
- **Budget Tip**: Ensure your motherboard socket (AM4, AM5, or LGA1700) supports the new CPU before purchasing to avoid motherboard replacement costs.`;
  }

  if (result.bottleneck.component === 'vram' || (input.ramGb && input.ramGb < 16)) {
    return `### Hardware Upgrade Recommendation: System RAM / VRAM Headroom
Your system is currently constrained by memory bandwidth or capacity.

- **Why**: With ${input.ramGb} GB of system RAM, background Windows services and modern game engines compete for memory pages, causing periodic hitching.
- **Suggested Upgrade Path**: Upgrading to a dual-channel 32GB RAM kit (2x16GB DDR4-3200 or DDR5-6000) is one of the most cost-effective upgrades in PC gaming, providing immediate stability for under $65–$95.`;
  }

  return `### Hardware Upgrade Recommendation: Balanced System
Your current setup demonstrates excellent component harmony for ${input.gameTitle} at ${result.resolutionLabel}.

- **Assessment**: Neither your CPU nor your GPU creates a severe bottleneck. Upgrading a single component now would yield diminishing returns without upgrading both in tandem.
- **Optimization Tip**: Instead of spending money on new parts today, optimize Windows game mode, ensure XMP/EXPO memory profiles are enabled in BIOS, and enjoy your gameplay!`;
}
