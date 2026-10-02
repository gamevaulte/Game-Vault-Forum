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
  ZELDA_TOTK: '/src/assets/images/zelda_totk_hero_1790931936695.jpg',
  DARK_SOULS_3: '/src/assets/images/dark_souls_hero_1790931948803.jpg',
  BLOODBORNE: '/src/assets/images/bloodborne_hero_1790931961410.jpg',
  SEKIRO: '/src/assets/images/sekiro_hero_1790931975993.jpg',
  GHOST_OF_TSUSHIMA: '/src/assets/images/ghost_of_tsushima_hero_1790931988319.jpg',
  METAPHOR_REFANTAZIO: '/src/assets/images/metaphor_hero_1790932001199.jpg',
  PERSONA_5: '/src/assets/images/persona_five_hero_1790932013970.jpg',
  SKYRIM: '/src/assets/images/skyrim_hero_1790932027549.jpg',
  FALLOUT_NEW_VEGAS: '/src/assets/images/fallout_nv_hero_1790932039977.jpg',
  PORTAL_2: '/src/assets/images/portal_two_hero_1790932053477.jpg',
  HALF_LIFE_2: '/src/assets/images/half_life_two_hero_1790932548578.jpg',
  DIABLO_4: '/src/assets/images/diablo_four_hero_1790932570864.jpg',
  SPACE_MARINE_2: '/src/assets/images/space_marine_hero_1790932584093.jpg',
  HORIZON_FORBIDDEN_WEST: '/src/assets/images/horizon_hero_1790932596311.jpg',
  STARDEW_VALLEY: '/src/assets/images/stardew_valley_hero_1790932609739.jpg',
  MOBA_LEGENDS: '/src/assets/images/moba_legends_hero_1790932621917.jpg',
  SUPERHERO_ACTION: '/src/assets/images/superhero_patrol_hero_1790932634138.jpg',
  FLIGHT_SIMULATOR: '/src/assets/images/flight_simulator_hero_1790932647032.jpg',
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

  // RPG & Action Classics (AI Generated)
  'the-legend-of-zelda-tears-of-the-kingdom': AI_GAME_ASSETS.ZELDA_TOTK,
  'tears-of-the-kingdom': AI_GAME_ASSETS.ZELDA_TOTK,
  'zelda-totk': AI_GAME_ASSETS.ZELDA_TOTK,
  'zelda': AI_GAME_ASSETS.ZELDA_TOTK,
  'dark-souls-iii': AI_GAME_ASSETS.DARK_SOULS_3,
  'dark-souls-3': AI_GAME_ASSETS.DARK_SOULS_3,
  'dark-souls': AI_GAME_ASSETS.DARK_SOULS_3,
  'bloodborne': AI_GAME_ASSETS.BLOODBORNE,
  'sekiro-shadows-die-twice': AI_GAME_ASSETS.SEKIRO,
  'sekiro': AI_GAME_ASSETS.SEKIRO,
  'ghost-of-tsushima': AI_GAME_ASSETS.GHOST_OF_TSUSHIMA,
  'ghost-of-tsushima-directors-cut': AI_GAME_ASSETS.GHOST_OF_TSUSHIMA,
  'metaphor-refantazio': AI_GAME_ASSETS.METAPHOR_REFANTAZIO,
  'metaphor': AI_GAME_ASSETS.METAPHOR_REFANTAZIO,
  'persona-5-royal': AI_GAME_ASSETS.PERSONA_5,
  'persona-5': AI_GAME_ASSETS.PERSONA_5,
  'p5r': AI_GAME_ASSETS.PERSONA_5,
  'the-elder-scrolls-v-skyrim': AI_GAME_ASSETS.SKYRIM,
  'skyrim': AI_GAME_ASSETS.SKYRIM,
  'the-elder-scrolls-v-skyrim-special-edition': AI_GAME_ASSETS.SKYRIM,
  'fallout-new-vegas': AI_GAME_ASSETS.FALLOUT_NEW_VEGAS,
  'new-vegas': AI_GAME_ASSETS.FALLOUT_NEW_VEGAS,
  'portal-2': AI_GAME_ASSETS.PORTAL_2,
  'portal': AI_GAME_ASSETS.PORTAL_2,
  'half-life-2': AI_GAME_ASSETS.HALF_LIFE_2,
  'half-life': AI_GAME_ASSETS.HALF_LIFE_2,
  'hl2': AI_GAME_ASSETS.HALF_LIFE_2,

  // Additional Popular PC & Console Hits (AI Generated)
  'spiderman': AI_GAME_ASSETS.SUPERHERO_ACTION,
  'marvels-spider-man': AI_GAME_ASSETS.SUPERHERO_ACTION,
  'marvels-spider-man-remastered': AI_GAME_ASSETS.SUPERHERO_ACTION,
  'spider-man-remastered': AI_GAME_ASSETS.SUPERHERO_ACTION,
  'diablo-4': AI_GAME_ASSETS.DIABLO_4,
  'diablo-iv': AI_GAME_ASSETS.DIABLO_4,
  'diablo': AI_GAME_ASSETS.DIABLO_4,
  'horizon-forbidden-west': AI_GAME_ASSETS.HORIZON_FORBIDDEN_WEST,
  'horizon-zero-dawn': AI_GAME_ASSETS.HORIZON_FORBIDDEN_WEST,
  'horizon': AI_GAME_ASSETS.HORIZON_FORBIDDEN_WEST,
  'warhammer-40000-space-marine-2': AI_GAME_ASSETS.SPACE_MARINE_2,
  'space-marine-2': AI_GAME_ASSETS.SPACE_MARINE_2,
  'space-marine': AI_GAME_ASSETS.SPACE_MARINE_2,
  'warhammer': AI_GAME_ASSETS.SPACE_MARINE_2,
  'escape-from-tarkov': AI_GAME_ASSETS.STALKER_2,
  'tarkov': AI_GAME_ASSETS.STALKER_2,
  'rust': AI_GAME_ASSETS.STALKER_2,
  'sea-of-thieves': AI_GAME_ASSETS.NAVAL_COMMAND,
  'destiny-2': AI_GAME_ASSETS.STARFIELD,
  'destiny': AI_GAME_ASSETS.STARFIELD,
  'warframe': AI_GAME_ASSETS.STARFIELD,
  'final-fantasy-xiv': AI_GAME_ASSETS.FINAL_FANTASY_VII_REBIRTH,
  'ffxiv': AI_GAME_ASSETS.FINAL_FANTASY_VII_REBIRTH,
  'rainbow-six-siege': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'rainbow-six': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'overwatch-2': AI_GAME_ASSETS.VALORANT,
  'overwatch': AI_GAME_ASSETS.VALORANT,
  'dota-2': AI_GAME_ASSETS.MOBA_LEGENDS,
  'dota': AI_GAME_ASSETS.MOBA_LEGENDS,
  'league-of-legends': AI_GAME_ASSETS.MOBA_LEGENDS,
  'lol': AI_GAME_ASSETS.MOBA_LEGENDS,
  'palworld': AI_GAME_ASSETS.STARDEW_VALLEY,
  'stardew-valley': AI_GAME_ASSETS.STARDEW_VALLEY,
  'terraria': AI_GAME_ASSETS.STARDEW_VALLEY,
  'rocket-league': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'ea-sports-fc-25': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'ea-sports-fc': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'tekken-8': AI_GAME_ASSETS.SEKIRO,
  'tekken': AI_GAME_ASSETS.SEKIRO,
  'microsoft-flight-simulator': AI_GAME_ASSETS.FLIGHT_SIMULATOR,
  'microsoft-flight-simulator-2024': AI_GAME_ASSETS.FLIGHT_SIMULATOR,

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
  if (key.includes('zelda') || key.includes('hyrule') || key.includes('tears-of-the-kingdom')) {
    return AI_GAME_ASSETS.ZELDA_TOTK;
  }
  if (key.includes('dark-souls') || key.includes('darksouls')) {
    return AI_GAME_ASSETS.DARK_SOULS_3;
  }
  if (key.includes('bloodborne') || key.includes('yharnam')) {
    return AI_GAME_ASSETS.BLOODBORNE;
  }
  if (key.includes('sekiro')) {
    return AI_GAME_ASSETS.SEKIRO;
  }
  if (key.includes('ghost-of-tsushima') || key.includes('tsushima')) {
    return AI_GAME_ASSETS.GHOST_OF_TSUSHIMA;
  }
  if (key.includes('metaphor')) {
    return AI_GAME_ASSETS.METAPHOR_REFANTAZIO;
  }
  if (key.includes('persona')) {
    return AI_GAME_ASSETS.PERSONA_5;
  }
  if (key.includes('skyrim') || key.includes('elder-scrolls') || key.includes('dovahkiin')) {
    return AI_GAME_ASSETS.SKYRIM;
  }
  if (key.includes('fallout') || key.includes('new-vegas')) {
    return AI_GAME_ASSETS.FALLOUT_NEW_VEGAS;
  }
  if (key.includes('portal') || key.includes('glados')) {
    return AI_GAME_ASSETS.PORTAL_2;
  }
  if (key.includes('half-life') || key.includes('freeman') || key.includes('black-mesa') || key.includes('city-17')) {
    return AI_GAME_ASSETS.HALF_LIFE_2;
  }
  if (key.includes('spider-man') || key.includes('spiderman') || key.includes('marvel') || key.includes('superhero')) {
    return AI_GAME_ASSETS.SUPERHERO_ACTION;
  }
  if (key.includes('diablo')) {
    return AI_GAME_ASSETS.DIABLO_4;
  }
  if (key.includes('horizon') && (key.includes('forbidden') || key.includes('dawn') || key.includes('west'))) {
    return AI_GAME_ASSETS.HORIZON_FORBIDDEN_WEST;
  }
  if (key.includes('warhammer') || key.includes('space-marine')) {
    return AI_GAME_ASSETS.SPACE_MARINE_2;
  }
  if (key.includes('tarkov')) {
    return AI_GAME_ASSETS.STALKER_2;
  }
  if (key.includes('rust')) {
    return AI_GAME_ASSETS.STALKER_2;
  }
  if (key.includes('sea-of-thieves') || key.includes('thieves')) {
    return AI_GAME_ASSETS.NAVAL_COMMAND;
  }
  if (key.includes('destiny')) {
    return AI_GAME_ASSETS.STARFIELD;
  }
  if (key.includes('warframe')) {
    return AI_GAME_ASSETS.STARFIELD;
  }
  if (key.includes('rainbow-six') || key.includes('siege')) {
    return AI_GAME_ASSETS.COUNTER_STRIKE_2;
  }
  if (key.includes('overwatch')) {
    return AI_GAME_ASSETS.VALORANT;
  }
  if (key.includes('dota') || key.includes('league-of-legends') || key.includes('moba')) {
    return AI_GAME_ASSETS.MOBA_LEGENDS;
  }
  if (key.includes('palworld') || key.includes('stardew') || key.includes('terraria') || key.includes('farm')) {
    return AI_GAME_ASSETS.STARDEW_VALLEY;
  }
  if (key.includes('tekken') || key.includes('mortal-kombat') || key.includes('street-fighter')) {
    return AI_GAME_ASSETS.SEKIRO;
  }
  if (key.includes('flight-sim') || key.includes('flight-simulator') || key.includes('aviation')) {
    return AI_GAME_ASSETS.FLIGHT_SIMULATOR;
  }
  if (key.includes('rocket-league') || key.includes('fifa') || key.includes('ea-sports')) {
    return AI_GAME_ASSETS.FORZA_HORIZON_5;
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
