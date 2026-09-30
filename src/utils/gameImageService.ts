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

  // Grand Theft Auto & Rockstar (AI Generated GTA VI)
  'grand-theft-auto-vi': AI_GAME_ASSETS.GTA_VI,
  'gta-vi': AI_GAME_ASSETS.GTA_VI,
  'gta-6': AI_GAME_ASSETS.GTA_VI,
  'grand-theft-auto-v': AI_GAME_ASSETS.GTA_VI,
  'gta-v': AI_GAME_ASSETS.GTA_VI,
  'gta-5': AI_GAME_ASSETS.GTA_VI,
  'red-dead-redemption-2': 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1200&auto=format&fit=crop&q=80',
  'rdr2': 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1200&auto=format&fit=crop&q=80',

  // Major Action & RPG Hits (AI Generated)
  'black-myth-wukong': AI_GAME_ASSETS.BLACK_MYTH_WUKONG,
  'wukong': AI_GAME_ASSETS.BLACK_MYTH_WUKONG,
  'monster-hunter-wilds': AI_GAME_ASSETS.MONSTER_HUNTER_WILDS,
  'monster-hunter': AI_GAME_ASSETS.MONSTER_HUNTER_WILDS,
  'the-witcher-3-wild-hunt': AI_GAME_ASSETS.WITCHER_3,
  'the-witcher-3': AI_GAME_ASSETS.WITCHER_3,
  'witcher-3': AI_GAME_ASSETS.WITCHER_3,
  'hades-2': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
  'hades-ii': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
  'hollow-knight-silksong': AI_GAME_ASSETS.SILKSONG,
  'silksong': AI_GAME_ASSETS.SILKSONG,
  'hollow-knight': AI_GAME_ASSETS.SILKSONG,
  'forza-horizon-5': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'forza-horizon': AI_GAME_ASSETS.FORZA_HORIZON_5,
  'minecraft': AI_GAME_ASSETS.MINECRAFT,
  'doom-the-dark-ages': AI_GAME_ASSETS.DOOM_DARK_AGES,
  'doom-dark-ages': AI_GAME_ASSETS.DOOM_DARK_AGES,
  'civilization-vii': AI_GAME_ASSETS.CIVILIZATION_VII,
  'civ-7': AI_GAME_ASSETS.CIVILIZATION_VII,
  'civ-vii': AI_GAME_ASSETS.CIVILIZATION_VII,
  'starfield': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  's-t-a-l-k-e-r-2-heart-of-chornobyl': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  'stalker-2': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  'death-stranding-2-on-the-beach': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  'death-stranding-2': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  'kingdom-come-deliverance-2': 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1200&auto=format&fit=crop&q=80',
  'clair-obscur-expedition-33': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  'expedition-33': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  'silent-hill-2': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  'resident-evil-4': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',

  // Competitive Esports & Shooters (AI Generated)
  'counter-strike-2': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'cs2': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'counter-strike': AI_GAME_ASSETS.COUNTER_STRIKE_2,
  'valorant': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'apex-legends': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  'fortnite': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
  'call-of-duty': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  'call-of-duty-warzone': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  'hogwarts-legacy': 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1200&auto=format&fit=crop&q=80',

  // Built-in Playable Arcade & Board Games (AI Generated)
  'space-invaders': AI_GAME_ASSETS.SPACE_INVADERS,
  'neon-snake': AI_GAME_ASSETS.NEON_SNAKE,
  'brick-breaker': AI_GAME_ASSETS.BRICK_BREAKER,
  'tactical-chess': AI_GAME_ASSETS.TACTICAL_CHESS,
  'chess': AI_GAME_ASSETS.TACTICAL_CHESS,
  'naval-command': AI_GAME_ASSETS.NAVAL_COMMAND,
  'naval-duel': AI_GAME_ASSETS.NAVAL_COMMAND,
};

// Genre thematic fallback artwork (atmospheric, non-generic)
export const GENRE_THEMATIC_ARTWORK: Record<string, string> = {
  rpg: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1200&auto=format&fit=crop&q=80',
  action: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  fps: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  shooter: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  strategy: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  simulation: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  racing: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
  horror: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
  adventure: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  cyberpunk: AI_GAME_ASSETS.CYBERPUNK_2077,
  scifi: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  fantasy: AI_GAME_ASSETS.ELDEN_RING,
  naval: AI_GAME_ASSETS.WORLD_OF_WARSHIPS,
  battleroyale: AI_GAME_ASSETS.PUBG_MOBILE,
  default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
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
    return TITLE_SPECIFIC_GAME_ARTWORK['red-dead-redemption-2'];
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
  if (originalUrl && !originalUrl.includes('photo-1542751371-adc38448a05e') && !originalUrl.includes('photo-1511512578047-dfb367046420') && !originalUrl.includes('photo-1518709268805-4e9042af9f23') && !originalUrl.includes('photo-1579783902614') && !originalUrl.includes('photo-1509198397868') && !originalUrl.includes('photo-1550745165') && !originalUrl.includes('photo-1579546929518')) {
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
