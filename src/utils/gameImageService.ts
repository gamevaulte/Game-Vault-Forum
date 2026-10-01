/**
 * Game Vault Forum - Title-Specific Game Artwork & Asset Resolver
 * Replaces generic, unrelated imagery with authentic, title-specific game art and AI-generated assets.
 */

// Primary high-fidelity AI-generated game assets
export const AI_GAME_ASSETS = {
  ELDEN_RING: '/src/assets/images/elden_ring_cover_1790767174737.jpg',
  CYBERPUNK_2077: '/src/assets/images/cyberpunk_phantom_liberty_1790767191132.jpg',
  WORLD_OF_WARSHIPS: '/src/assets/images/world_of_warships_cover_1790767205719.jpg',
  PUBG_MOBILE: '/src/assets/images/pubg_mobile_cover_1790767220593.jpg',
  HELLDIVERS_2: '/src/assets/images/helldivers_tactical_cover_1790767233421.jpg',
  BALDURS_GATE_3: '/src/assets/images/bg3_honour_hero_1790442560266.jpg',
  GTA_VI: '/src/assets/images/gta_vi_cover_1790767363671.jpg',
  BLACK_MYTH_WUKONG: '/src/assets/images/wukong_cover_1790767376883.jpg',
  MONSTER_HUNTER_WILDS: '/src/assets/images/mon_hunter_cover_1790767391220.jpg',
  SILKSONG: '/src/assets/images/silksong_cover_1790767404702.jpg',
  WITCHER_3: '/src/assets/images/witcher_cover_1790767418987.jpg',
  COUNTER_STRIKE_2: '/src/assets/images/cs2_cover_1790767431722.jpg',
  SPACE_INVADERS: '/src/assets/images/space_invaders_1790767444888.jpg',
  NEON_SNAKE: '/src/assets/images/neon_snake_1790767458205.jpg',
  BRICK_BREAKER: '/src/assets/images/brick_breaker_1790767470830.jpg',
  TACTICAL_CHESS: '/src/assets/images/tactical_chess_1790767484254.jpg',
  NAVAL_COMMAND: '/src/assets/images/naval_command_1790767497972.jpg',
  FORZA_HORIZON_5: '/src/assets/images/forza_horizon_1790767537063.jpg',
  MINECRAFT: '/src/assets/images/minecraft_cover_1790767549987.jpg',
  DOOM_DARK_AGES: '/src/assets/images/doom_dark_ages_1790767563600.jpg',
  CIVILIZATION_VII: '/src/assets/images/civ_seven_cover_1790767580239.jpg',
  STARFIELD: '/src/assets/images/starfield_hero_1790845838611.jpg',
  THE_LAST_OF_US: '/src/assets/images/tlou_hero_1790845808902.jpg',
  RESIDENT_EVIL_4: '/src/assets/images/re4_hero_1790845821039.jpg',
  RED_DEAD_REDEMPTION_2: '/src/assets/images/rdr2_hero_1790845852299.jpg',
  SILENT_HILL_2: '/src/assets/images/silent_hill_hero_1790845870975.jpg',
  GOD_OF_WAR_RAGNAROK: '/src/assets/images/god_of_war_hero_1790845884311.jpg',
  ALAN_WAKE_2: '/src/assets/images/alan_wake_hero_1790845897329.jpg',
  FINAL_FANTASY_VII_REBIRTH: '/src/assets/images/ff7_rebirth_hero_1790845910054.jpg',
  HADES_2: '/src/assets/images/hades_two_hero_1790846096295.jpg',
  STALKER_2: '/src/assets/images/stalker_two_hero_1790846106441.jpg',
  DEATH_STRANDING_2: '/src/assets/images/death_stranding_two_hero_1790846116765.jpg',
  VALORANT: '/src/assets/images/valorant_hero_1790846127818.jpg',
  APEX_LEGENDS: '/src/assets/images/apex_legends_hero_1790846139361.jpg',
  FORTNITE: '/src/assets/images/fortnite_hero_1790846149967.jpg',
  CALL_OF_DUTY: '/src/assets/images/call_of_duty_hero_1790846159699.jpg',
  HOGWARTS_LEGACY: '/src/assets/images/hogwarts_legacy_hero_1790846170160.jpg',
  KINGDOM_COME_2: '/src/assets/images/kingdom_come_hero_1790846180698.jpg',
  EXPEDITION_33: '/src/assets/images/expedition_hero_1790846192200.jpg',
};

// Title-specific, authentic game art catalog mapped to exact game titles and slugs
export const TITLE_SPECIFIC_GAME_ARTWORK: Record<string, string> = {
  // Flagships (AI Generated)
  'elden-ring': AI_GAME_ASSETS.ELDEN_RING,
  'elden-ring-shadow-of-the-erdtree': AI_GAME_ASSETS.ELDEN_RING,
  'shadow-of-the-erdtree': AI_GAME_ASSETS.ELDEN_RING,
  'cyberpunk-2077': AI_GAME_ASSETS.CYBERPUNK_2077,
  'cyberpunk-2077-phantom-liberty': AI_GAME_ASSETS.CYBERPUNK_2077,
  'phantom-liberty': AI_GAME_ASSETS.CYBERPUNK_2077,
  'world-of-warships': AI_GAME_ASSETS.WORLD_OF_WARSHIPS,
  'wows': AI_GAME_ASSETS.WORLD_OF_WARSHIPS,
  'pubg-mobile': AI_GAME_ASSETS.PUBG_MOBILE,
  'pubg': AI_GAME_ASSETS.PUBG_MOBILE,
  'playerunknowns-battlegrounds': AI_GAME_ASSETS.PUBG_MOBILE,
  'helldivers-2': AI_GAME_ASSETS.HELLDIVERS_2,
  'helldivers': AI_GAME_ASSETS.HELLDIVERS_2,
  'baldurs-gate-3': AI_GAME_ASSETS.BALDURS_GATE_3,
  'bg3': AI_GAME_ASSETS.BALDURS_GATE_3,

  // Grand Theft Auto & Rockstar (AI Generated GTA VI & RDR2)
  'grand-theft-auto-vi': AI_GAME_ASSETS.GTA_VI,
  'gta-vi': AI_GAME_ASSETS.GTA_VI,
  'gta-6': AI_GAME_ASSETS.GTA_VI,
  'grand-theft-auto-v': AI_GAME_ASSETS.GTA_VI,
  'gta-v': AI_GAME_ASSETS.GTA_VI,
  'gta-5': AI_GAME_ASSETS.GTA_VI,
  'red-dead-redemption-2': AI_GAME_ASSETS.RED_DEAD_REDEMPTION_2,
  'rdr2': AI_GAME_ASSETS.RED_DEAD_REDEMPTION_2,
  'red-dead': AI_GAME_ASSETS.RED_DEAD_REDEMPTION_2,

  // Major Action & RPG Hits (AI Generated)
  'black-myth-wukong': AI_GAME_ASSETS.BLACK_MYTH_WUKONG,
  'wukong': AI_GAME_ASSETS.BLACK_MYTH_WUKONG,
  'monster-hunter-wilds': AI_GAME_ASSETS.MONSTER_HUNTER_WILDS,
  'monster-hunter': AI_GAME_ASSETS.MONSTER_HUNTER_WILDS,
  'the-witcher-3-wild-hunt': AI_GAME_ASSETS.WITCHER_3,
  'the-witcher-3': AI_GAME_ASSETS.WITCHER_3,
  'witcher-3': AI_GAME_ASSETS.WITCHER_3,
  'the-last-of-us': AI_GAME_ASSETS.THE_LAST_OF_US,
  'the-last-of-us-part-i': AI_GAME_ASSETS.THE_LAST_OF_US,
  'the-last-of-us-2013': AI_GAME_ASSETS.THE_LAST_OF_US,
  'tlou': AI_GAME_ASSETS.THE_LAST_OF_US,
  'resident-evil-4': AI_GAME_ASSETS.RESIDENT_EVIL_4,
  'resident-evil': AI_GAME_ASSETS.RESIDENT_EVIL_4,
  're4': AI_GAME_ASSETS.RESIDENT_EVIL_4,
  'silent-hill-2': AI_GAME_ASSETS.SILENT_HILL_2,
  'silent-hill': AI_GAME_ASSETS.SILENT_HILL_2,
  'god-of-war-ragnarok': AI_GAME_ASSETS.GOD_OF_WAR_RAGNAROK,
  'god-of-war': AI_GAME_ASSETS.GOD_OF_WAR_RAGNAROK,
  'alan-wake-2': AI_GAME_ASSETS.ALAN_WAKE_2,
  'alan-wake': AI_GAME_ASSETS.ALAN_WAKE_2,
  'final-fantasy-vii-rebirth': AI_GAME_ASSETS.FINAL_FANTASY_VII_REBIRTH,
  'ff7-rebirth': AI_GAME_ASSETS.FINAL_FANTASY_VII_REBIRTH,
  'final-fantasy-7-rebirth': AI_GAME_ASSETS.FINAL_FANTASY_VII_REBIRTH,
  'starfield': AI_GAME_ASSETS.STARFIELD,
  'hades-2': AI_GAME_ASSETS.HADES_2,
  'hades-ii': AI_GAME_ASSETS.HADES_2,
  'hades': AI_GAME_ASSETS.HADES_2,
  'hollow-knight-silksong': AI_GAME_ASSETS.SILKSONG,
  'silksong': AI_GAME_ASSETS.SILKSONG,
  'hollow-knight': AI_GAME_ASSETS.SILKSONG,
  'forza-horizon-5': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'forza-horizon': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'forza': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'minecraft': AI_GAME_ASSETS.MINECRAFT,
  'doom-the-dark-ages': AI_GAME_ASSETS.DOOM_DARK_AGES,
  'doom-dark-ages': AI_GAME_ASSETS.DOOM_DARK_AGES,
  'doom': AI_GAME_ASSETS.DOOM_DARK_AGES,
  'civilization-vii': AI_GAME_ASSETS.CIVILIZATION_VII,
  'civ-7': AI_GAME_ASSETS.CIVILIZATION_VII,
  'civ-vii': AI_GAME_ASSETS.CIVILIZATION_VII,
  's-t-a-l-k-e-r-2-heart-of-chornobyl': AI_GAME_ASSETS.STALKER_2,
  'stalker-2': AI_GAME_ASSETS.STALKER_2,
  'stalker': AI_GAME_ASSETS.STALKER_2,
  'death-stranding-2-on-the-beach': AI_GAME_ASSETS.DEATH_STRANDING_2,
  'death-stranding-2': AI_GAME_ASSETS.DEATH_STRANDING_2,
  'death-stranding': AI_GAME_ASSETS.DEATH_STRANDING_2,
  'kingdom-come-deliverance-2': AI_GAME_ASSETS.KINGDOM_COME_2,
  'kingdom-come-2': AI_GAME_ASSETS.KINGDOM_COME_2,
  'kingdom-come': AI_GAME_ASSETS.KINGDOM_COME_2,
  'clair-obscur-expedition-33': AI_GAME_ASSETS.EXPEDITION_33,
  'expedition-33': AI_GAME_ASSETS.EXPEDITION_33,

  // Competitive Esports & Shooters (AI Generated)
  'counter-strike-2': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'cs2': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'counter-strike': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'valorant': AI_GAME_ASSETS.VALORANT,
  'apex-legends': AI_GAME_ASSETS.APEX_LEGENDS,
  'apex': AI_GAME_ASSETS.APEX_LEGENDS,
  'fortnite': AI_GAME_ASSETS.FORTNITE,
  'call-of-duty': AI_GAME_ASSETS.CALL_OF_DUTY,
  'call-of-duty-warzone': AI_GAME_ASSETS.CALL_OF_DUTY,
  'warzone': AI_GAME_ASSETS.CALL_OF_DUTY,
  'cod': AI_GAME_ASSETS.CALL_OF_DUTY,
  'hogwarts-legacy': AI_GAME_ASSETS.HOGWARTS_LEGACY,

  // Built-in Playable Arcade & Board Games (AI Generated)
  'space-invaders': AI_GAME_ASSETS.SPACE_INVADERS,
  'neon-snake': AI_GAME_ASSETS.NEON_SNAKE,
  'brick-breaker': AI_GAME_ASSETS.BRICK_BREAKER,
  'tactical-chess': AI_GAME_ASSETS.TACTICAL_CHESS,
  'chess': AI_GAME_ASSETS.TACTICAL_CHESS,
  'naval-command': AI_GAME_ASSETS.NAVAL_COMMAND,
  'naval-duel': AI_GAME_ASSETS.NAVAL_COMMAND,
};

// Genre thematic fallback artwork (always authentic game-rendered art, never generic stock photography)
export const GENRE_THEMATIC_ARTWORK: Record<string, string> = {
  rpg: AI_GAME_ASSETS.ELDEN_RING,
  action: AI_GAME_ASSETS.BLACK_MYTH_WUKONG,
  fps: AI_GAME_ASSETS.COUNTER_STRIKE_2,
  shooter: AI_GAME_ASSETS.CALL_OF_DUTY,
  strategy: AI_GAME_ASSETS.CIVILIZATION_VII,
  simulation: AI_GAME_ASSETS.WORLD_OF_WARSHIPS,
  racing: AI_GAME_ASSETS.FORZA_HORIZON_5,
  horror: AI_GAME_ASSETS.SILENT_HILL_2,
  adventure: AI_GAME_ASSETS.THE_LAST_OF_US,
  cyberpunk: AI_GAME_ASSETS.CYBERPUNK_2077,
  scifi: AI_GAME_ASSETS.STARFIELD,
  fantasy: AI_GAME_ASSETS.WITCHER_3,
  naval: AI_GAME_ASSETS.WORLD_OF_WARSHIPS,
  battleroyale: AI_GAME_ASSETS.PUBG_MOBILE,
  roguelike: AI_GAME_ASSETS.HADES_2,
  default: AI_GAME_ASSETS.ELDEN_RING,
};

/**
 * Normalizes title or slug to match game artwork key.
 */
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/[:'’\-–—.]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Resolves authentic, title-specific artwork for ANY video game.
 * Prioritizes custom AI-generated art, followed by exact title match, then keyword matching,
 * and finally thematic genre fallback.
 */
export function getGameTitleArtwork(titleOrSlug: string, genre?: string, originalUrl?: string): string {
  if (!titleOrSlug) return GENRE_THEMATIC_ARTWORK.default;

  const key = normalizeKey(titleOrSlug);

  // 1. Direct title/slug exact match
  if (TITLE_SPECIFIC_GAME_ARTWORK[key]) {
    return TITLE_SPECIFIC_GAME_ARTWORK[key];
  }

  // 2. Keyword matching for major franchises
  if (key.includes('elden-ring') || key.includes('erdtree') || key.includes('fromsoftware')) {
    return AI_GAME_ASSETS.ELDEN_RING;
  }
  if (key.includes('cyberpunk') || key.includes('phantom-liberty') || key.includes('night-city')) {
    return AI_GAME_ASSETS.CYBERPUNK_2077;
  }
  if (key.includes('world-of-warships') || key.includes('naval') || key.includes('warship')) {
    return AI_GAME_ASSETS.WORLD_OF_WARSHIPS;
  }
  if (key.includes('pubg') || key.includes('battlegrounds')) {
    return AI_GAME_ASSETS.PUBG_MOBILE;
  }
  if (key.includes('helldivers') || key.includes('super-earth')) {
    return AI_GAME_ASSETS.HELLDIVERS_2;
  }
  if (key.includes('baldurs-gate') || key.includes('baldur') || key.includes('bg3')) {
    return AI_GAME_ASSETS.BALDURS_GATE_3;
  }
  if (key.includes('gta') || key.includes('grand-theft-auto')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['gta-v'];
  }
  if (key.includes('red-dead') || key.includes('rdr')) {
    return AI_GAME_ASSETS.RED_DEAD_REDEMPTION_2;
  }
  if (key.includes('last-of-us') || key.includes('tlou')) {
    return AI_GAME_ASSETS.THE_LAST_OF_US;
  }
  if (key.includes('resident-evil') || key.includes('re4')) {
    return AI_GAME_ASSETS.RESIDENT_EVIL_4;
  }
  if (key.includes('silent-hill')) {
    return AI_GAME_ASSETS.SILENT_HILL_2;
  }
  if (key.includes('god-of-war') || key.includes('ragnarok')) {
    return AI_GAME_ASSETS.GOD_OF_WAR_RAGNAROK;
  }
  if (key.includes('alan-wake')) {
    return AI_GAME_ASSETS.ALAN_WAKE_2;
  }
  if (key.includes('final-fantasy') || key.includes('ff7') || key.includes('rebirth')) {
    return AI_GAME_ASSETS.FINAL_FANTASY_VII_REBIRTH;
  }
  if (key.includes('wukong') || key.includes('black-myth')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['black-myth-wukong'];
  }
  if (key.includes('monster-hunter')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['monster-hunter-wilds'];
  }
  if (key.includes('witcher')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['the-witcher-3-wild-hunt'];
  }
  if (key.includes('hades')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['hades-2'];
  }
  if (key.includes('silksong') || key.includes('hollow-knight')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['hollow-knight-silksong'];
  }
  if (key.includes('forza') || key.includes('racing') || key.includes('gran-turismo')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['forza-horizon-5'];
  }
  if (key.includes('starfield') || key.includes('space') || key.includes('mass-effect')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['starfield'];
  }
  if (key.includes('counter-strike') || key.includes('cs2') || key.includes('csgo')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['counter-strike-2'];
  }
  if (key.includes('valorant')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['valorant'];
  }
  if (key.includes('apex')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['apex-legends'];
  }
  if (key.includes('fortnite')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['fortnite'];
  }
  if (key.includes('call-of-duty') || key.includes('warzone') || key.includes('cod')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['call-of-duty'];
  }
  if (key.includes('minecraft')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['minecraft'];
  }
  if (key.includes('hogwarts') || key.includes('harry-potter')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['hogwarts-legacy'];
  }
  if (key.includes('civilization') || key.includes('civ')) {
    return TITLE_SPECIFIC_GAME_ARTWORK['civilization-vii'];
  }
  if (key.includes('stalker')) {
    return AI_GAME_ASSETS.STALKER_2;
  }
  if (key.includes('death-stranding')) {
    return AI_GAME_ASSETS.DEATH_STRANDING_2;
  }
  if (key.includes('kingdom-come')) {
    return AI_GAME_ASSETS.KINGDOM_COME_2;
  }
  if (key.includes('expedition')) {
    return AI_GAME_ASSETS.EXPEDITION_33;
  }
  if (key.includes('doom')) {
    return AI_GAME_ASSETS.DOOM_DARK_AGES;
  }
  if (key.includes('space-invaders') || key.includes('invaders')) {
    return AI_GAME_ASSETS.SPACE_INVADERS;
  }
  if (key.includes('snake') || key.includes('neon-snake')) {
    return AI_GAME_ASSETS.NEON_SNAKE;
  }
  if (key.includes('brick-breaker') || key.includes('breakout')) {
    return AI_GAME_ASSETS.BRICK_BREAKER;
  }
  if (key.includes('chess')) {
    return AI_GAME_ASSETS.TACTICAL_CHESS;
  }
  if (key.includes('naval') || key.includes('battleship')) {
    return AI_GAME_ASSETS.NAVAL_COMMAND;
  }

  // 3. If originalUrl was provided and is an authentic custom asset or non-generic art, keep it
  // Strictly reject generic stock imagery hosts like unsplash and picsum
  if (
    originalUrl &&
    !originalUrl.includes('unsplash.com') &&
    !originalUrl.includes('picsum.photos') &&
    (originalUrl.startsWith('/src/assets/images/') || originalUrl.startsWith('/images/articles/'))
  ) {
    return originalUrl;
  }

  // 4. Thematic genre fallback
  if (genre) {
    const cleanGenre = genre.toLowerCase();
    for (const [gKey, url] of Object.entries(GENRE_THEMATIC_ARTWORK)) {
      if (cleanGenre.includes(gKey)) return url;
    }
  }

  return GENRE_THEMATIC_ARTWORK.default;
}
