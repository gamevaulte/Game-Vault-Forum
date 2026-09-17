import { 
  AvatarConfig, 
  AvatarPreset, 
  AvatarVisualStyle, 
  CharacterType, 
  SkinTone, 
  Hairstyle, 
  HairColor, 
  EyeShape, 
  EyeColor, 
  OutfitCategory, 
  AccessoryType, 
  GamingPersonality, 
  AvatarBackground,
  PredefinedColorPalette
} from '../types/avatar';

export const AVATAR_VISUAL_STYLES: Array<{ id: AvatarVisualStyle; label: string; description: string; iconName: string }> = [
  { id: 'gamer', label: 'Gamer', description: 'RGB neon ambient battle-station vibe', iconName: 'Gamepad2' },
  { id: 'cyberpunk', label: 'Cyberpunk', description: 'High-tech neo-dystopian tech-runner', iconName: 'Zap' },
  { id: 'fantasy', label: 'Fantasy', description: 'Mystic runes and arcane warrior energy', iconName: 'Sparkles' },
  { id: 'sci-fi', label: 'Sci-Fi', description: 'Quantum armor and holographic HUDs', iconName: 'Atom' },
  { id: 'anime', label: 'Anime-inspired', description: 'Vibrant cel-shaded expressive styling', iconName: 'Flame' },
  { id: 'cartoon', label: 'Cartoon', description: 'Bold comic line-art and punchy color', iconName: 'Smile' },
  { id: 'pixel-art', label: 'Pixel Art', description: 'Charming 8-bit retro arcade aesthetic', iconName: 'Grid' },
  { id: 'futuristic', label: 'Futuristic', description: 'Sleek carbon-fiber and clean laser accents', iconName: 'Shield' },
  { id: 'warrior', label: 'Warrior', description: 'Battle-hardened combatant with steel armor', iconName: 'Swords' },
  { id: 'military', label: 'Military', description: 'Tactical camo, comms and ballistic gear', iconName: 'Target' },
  { id: 'space-explorer', label: 'Space Explorer', description: 'Astronaut pressurized helmet & cosmic glow', iconName: 'Compass' },
  { id: 'medieval', label: 'Medieval', description: 'Gothic chivalry, tabard and iron filigree', iconName: 'Crown' },
  { id: 'horror', label: 'Horror', description: 'Eerie shadows, crimson eyes and dark mist', iconName: 'Ghost' },
  { id: 'racing', label: 'Racing', description: 'High-velocity stripes and aerodynamic specs', iconName: 'Gauge' },
  { id: 'esports', label: 'Esports', description: 'Pro tournament stage lighting & athletic cut', iconName: 'Trophy' },
  { id: 'casual-gamer', label: 'Casual Gamer', description: 'Warm loft lighting and comfy lounge fit', iconName: 'Coffee' },
];

export const SKIN_TONES: Array<{ id: SkinTone; label: string; hex: string; desc: string }> = [
  { id: 'fair', label: 'Fair Ivory', hex: '#ffd8be', desc: 'Light porcelain tone' },
  { id: 'warm', label: 'Warm Peach', hex: '#f7c59f', desc: 'Soft sunlit tone' },
  { id: 'tan', label: 'Golden Tan', hex: '#e09f67', desc: 'Radiant bronze' },
  { id: 'olive', label: 'Subtle Olive', hex: '#cf986c', desc: 'Earthy balanced undertone' },
  { id: 'rich-bronze', label: 'Rich Bronze', hex: '#9c5a3c', desc: 'Deep warm amber' },
  { id: 'deep-mocha', label: 'Deep Espresso', hex: '#583222', desc: 'Rich midnight chocolate' },
  { id: 'cyber-silver', label: 'Cyber Chrome', hex: '#94a3b8', desc: 'Metallic synth-skin' },
  { id: 'neon-violet', label: 'Neon Violet', hex: '#a855f7', desc: 'Bioluminescent synth' },
  { id: 'frost-blue', label: 'Frost Cyan', hex: '#38bdf8', desc: 'Glacial cryo-skin' },
  { id: 'orc-green', label: 'Mystic Emerald', hex: '#4ade80', desc: 'Arcane goblin/orc skin' },
];

export const HAIRSTYLES: Array<{ id: Hairstyle; label: string }> = [
  { id: 'short', label: 'Textured Short' },
  { id: 'fade', label: 'Clean Taper Fade' },
  { id: 'spiky', label: 'Anime Spiky' },
  { id: 'curly', label: 'Voluminous Curly' },
  { id: 'long', label: 'Flowing Locks' },
  { id: 'ponytail', label: 'High Ponytail' },
  { id: 'braided', label: 'Tactical Braids' },
  { id: 'mohawk', label: 'Cyber Mohawk' },
  { id: 'buzz-cut', label: 'Military Buzz' },
  { id: 'futuristic', label: 'Neon Cyber Undercut' },
];

export const HAIR_COLORS: Array<{ id: HairColor; label: string; hex: string }> = [
  { id: 'black', label: 'Obsidian Black', hex: '#18181b' },
  { id: 'brown', label: 'Chestnut Brown', hex: '#451a03' },
  { id: 'blonde', label: 'Nordic Blonde', hex: '#facc15' },
  { id: 'red', label: 'Crimson Ember', hex: '#dc2626' },
  { id: 'white', label: 'Pure Platinum', hex: '#f8fafc' },
  { id: 'silver', label: 'Steel Silver', hex: '#94a3b8' },
  { id: 'blue', label: 'Electric Cyan', hex: '#06b6d4' },
  { id: 'purple', label: 'Neon Violet', hex: '#a855f7' },
  { id: 'green', label: 'Toxic Lime', hex: '#22c55e' },
  { id: 'custom', label: 'Custom Hex', hex: '#ec4899' },
];

export const EYE_SHAPES: Array<{ id: EyeShape; label: string }> = [
  { id: 'focused', label: 'Focused Gamer' },
  { id: 'intense', label: 'Intense Competitor' },
  { id: 'calm', label: 'Calm & Stoic' },
  { id: 'cyber-hud', label: 'Cybernetic Optical HUD' },
  { id: 'glowing-slit', label: 'Mystic Slit Iris' },
  { id: 'anime-spark', label: 'Anime Star Spark' },
];

export const EYE_COLORS: Array<{ id: EyeColor; label: string; hex: string }> = [
  { id: 'brown', label: 'Warm Hazel Brown', hex: '#78350f' },
  { id: 'blue', label: 'Sapphire Blue', hex: '#2563eb' },
  { id: 'green', label: 'Emerald Green', hex: '#16a34a' },
  { id: 'gray', label: 'Steel Gray', hex: '#64748b' },
  { id: 'amber', label: 'Glowing Amber', hex: '#d97706' },
  { id: 'purple', label: 'Amethyst Violet', hex: '#9333ea' },
  { id: 'cybernetic', label: 'Cyan Cyber Target', hex: '#06b6d4' },
  { id: 'glowing', label: 'Bioluminescent Gold', hex: '#eab308' },
  { id: 'crimson', label: 'Vampiric Crimson', hex: '#e11d48' },
];

export const OUTFIT_CATEGORIES: Array<{ id: OutfitCategory; label: string; desc: string }> = [
  { id: 'gaming-hoodie', label: 'Gamer Tech Hoodie', desc: 'Heavy oversized hoodie with drawstrings & crest' },
  { id: 'tactical-outfit', label: 'Tactical Operator Rig', desc: 'Plate harness with radio comms and pouches' },
  { id: 'cyberpunk-jacket', label: 'Cyberpunk LED Jacket', desc: 'High asymmetrical collar with neon piping' },
  { id: 'fantasy-armor', label: 'Fantasy Knight Cuirass', desc: 'Engraved steel plates with dragon motif' },
  { id: 'sci-fi-armor', label: 'Nanosuit Exo-Armor', desc: 'Composite carbon plating with power conduit' },
  { id: 'streetwear', label: 'Urban Streetwear Bomber', desc: 'Layered streetwear with utility lanyard' },
  { id: 'esports-jersey', label: 'Pro Esports Jersey', desc: 'Athletic moisture-wicking championship cut' },
  { id: 'military-outfit', label: 'Field Fatigue Harness', desc: 'Reinforced collar with rank dog-tags' },
  { id: 'space-suit', label: 'Deep Space Pressure Suit', desc: 'Airlock collar seal with bio-metric screen' },
  { id: 'casual-clothing', label: 'Chill Crewneck Sweater', desc: 'Clean, relaxed minimalist gamer fit' },
  { id: 'futuristic-suit', label: 'Neo-Tokyo Tailored Coat', desc: 'Formal trench coat with fiber-optic lapels' },
  { id: 'fantasy-robe', label: 'Arcane Mage Vestments', desc: 'Hooded cowl lined with runic inscriptions' },
];

export const ACCESSORIES: Array<{ id: AccessoryType; label: string; iconName: string }> = [
  { id: 'gaming-headset', label: 'RGB Gaming Headset', iconName: 'Headphones' },
  { id: 'sunglasses', label: 'Cyber Sunglasses', iconName: 'Glasses' },
  { id: 'face-mask', label: 'Tactical Face Mask', iconName: 'Shield' },
  { id: 'cap', label: 'Snapback Cap', iconName: 'Tag' },
  { id: 'beanie', label: 'Slouchy Beanie', iconName: 'Smile' },
  { id: 'helmet', label: 'Cyber Visor Helmet', iconName: 'HardHat' },
  { id: 'visor', label: 'Holographic Eye HUD', iconName: 'Scan' },
  { id: 'backpack', label: 'Tactical Harness / Pack', iconName: 'Package' },
  { id: 'shoulder-armor', label: 'Pauldron Shoulder Armor', iconName: 'ShieldAlert' },
  { id: 'cybernetic-implant', label: 'Neural Jack Implant', iconName: 'Cpu' },
  { id: 'gaming-controller', label: 'Floating Game Controller', iconName: 'Gamepad2' },
  { id: 'microphone', label: 'Studio Boom Condenser Mic', iconName: 'Mic' },
  { id: 'fantasy-prop', label: 'Floating Arcane Rune', iconName: 'Sparkles' },
  { id: 'futuristic-gadget', label: 'Companion Bot Drone', iconName: 'Bot' },
];

export const GAMING_PERSONALITIES: Array<{ 
  id: GamingPersonality; 
  label: string; 
  desc: string; 
  badgeIcon: string;
  favoredColor: string;
}> = [
  { id: 'competitive', label: 'Competitive Ranked', desc: 'Aiming for the highest tier, laser-focused', badgeIcon: 'Trophy', favoredColor: '#eab308' },
  { id: 'casual', label: 'Cozy & Casual', desc: 'Gaming for fun, relaxation, and laughs', badgeIcon: 'Coffee', favoredColor: '#38bdf8' },
  { id: 'strategic', label: 'Tactical Strategist', desc: 'Mastering mechanics, builds, and timing', badgeIcon: 'Brain', favoredColor: '#a855f7' },
  { id: 'explorer', label: 'Open-World Explorer', desc: 'Climbing every peak and uncovering lore', badgeIcon: 'Compass', favoredColor: '#10b981' },
  { id: 'story-lover', label: 'Narrative & Story', desc: 'Immersion, rich characters, and epic quests', badgeIcon: 'BookOpen', favoredColor: '#f97316' },
  { id: 'rpg-fan', label: 'RPG Enthusiast', desc: 'Stat min-maxing, branching dialogues, gear', badgeIcon: 'Shield', favoredColor: '#8b5cf6' },
  { id: 'horror-fan', label: 'Survival Horror', desc: 'Adrenaline junkie in dark eerie corridors', badgeIcon: 'Ghost', favoredColor: '#ef4444' },
  { id: 'racing-fan', label: 'Apex Speed Racer', desc: 'Clean apexes, manual clutches, and tuning', badgeIcon: 'Gauge', favoredColor: '#06b6d4' },
  { id: 'shooter-fan', label: 'Tactical FPS Gunner', desc: 'Headshots, recoil control, flick shots', badgeIcon: 'Crosshair', favoredColor: '#e11d48' },
  { id: 'sports-gamer', label: 'Sports Champion', desc: 'Team manager, dynasty builder, clutch plays', badgeIcon: 'Award', favoredColor: '#22c55e' },
  { id: 'strategy-gamer', label: 'Grand Strategy Mind', desc: 'Economy, army logistics, 4X domination', badgeIcon: 'Crown', favoredColor: '#fbbf24' },
  { id: 'multiplayer-gamer', label: 'Co-op Squad Mate', desc: 'Callouts, teamwork, reviving fallen allies', badgeIcon: 'Users', favoredColor: '#3b82f6' },
  { id: 'achievement-hunter', label: 'Trophy & 100%', desc: 'Unlocking every secret, badge, and trophy', badgeIcon: 'Star', favoredColor: '#ec4899' },
  { id: 'completionist', label: 'The Completionist', desc: '100% map cleared, all side quests done', badgeIcon: 'CheckCircle', favoredColor: '#14b8a6' },
  { id: 'retro-gamer', label: 'Classic Retro Arcade', desc: 'CRT scanlines, chiptunes, pixel perfection', badgeIcon: 'Gamepad', favoredColor: '#f43f5e' },
];

export const AVATAR_BACKGROUNDS: Array<{ id: AvatarBackground; label: string; desc: string }> = [
  { id: 'gaming-room', label: 'RGB Battle-Station', desc: 'Dual ultrawide monitors and hex LED wall panels' },
  { id: 'neon-city', label: 'Neo-Tokyo Horizon', desc: 'Cyberpunk skyscrapers under glowing mist' },
  { id: 'space-station', label: 'Orbital Space Deck', desc: 'Metallic viewport gazing at starry nebula' },
  { id: 'fantasy-kingdom', label: 'Castle Spire Citadel', desc: 'Floating magical towers and crescent moon' },
  { id: 'dark-forest', label: 'Haunted Midnight Pines', desc: 'Silhouetted trees, fireflies and fog' },
  { id: 'futuristic-battlefield', label: 'Quantum Battlefield', desc: 'Laser grid, particle sparks and barrier shields' },
  { id: 'cyberpunk-street', label: 'Neon Alleyway', desc: 'Rain-soaked asphalt with holographic signs' },
  { id: 'esports-arena', label: 'Mainstage Championship', desc: 'Arena floodlights, crowd silhouette and smoke' },
  { id: 'desert-landscape', label: 'Alien Crimson Dunes', desc: 'Rolling sand dunes under dual moons' },
  { id: 'snowy-mountain', label: 'Aurora Boreal Peaks', desc: 'Jagged snowy peaks beneath green polar lights' },
  { id: 'sci-fi-laboratory', label: 'Cryo-Lab Core', desc: 'Quantum containment tubes and diagnostic HUD' },
  { id: 'arcade', label: '80s Synthwave Grid', desc: 'Retro wireframe sun and pixel starfield' },
  { id: 'abstract', label: 'Polygon Prism Flow', desc: 'Geometric neon shards and soft bokeh' },
  { id: 'solid', label: 'Clean Studio Gradient', desc: 'Customizable smooth studio color gradient' },
  { id: 'transparent', label: 'Transparent Alpha', desc: 'Alpha channel ready for clean Discord / Steam cutout' },
];

export const PREDEFINED_PALETTES: Record<PredefinedColorPalette, { name: string; primary: string; secondary: string; lighting: string }> = {
  'neon-blue': { name: 'Neon Blue', primary: '#0ea5e9', secondary: '#38bdf8', lighting: '#06b6d4' },
  'cyber-purple': { name: 'Cyber Purple', primary: '#8b5cf6', secondary: '#c084fc', lighting: '#d946ef' },
  'electric-green': { name: 'Electric Green', primary: '#10b981', secondary: '#34d399', lighting: '#22c55e' },
  'fire-red': { name: 'Fire Red', primary: '#ef4444', secondary: '#f87171', lighting: '#f97316' },
  'golden': { name: 'Royal Gold', primary: '#f59e0b', secondary: '#fbbf24', lighting: '#eab308' },
  'ice-blue': { name: 'Glacial Ice', primary: '#0284c7', secondary: '#7dd3fc', lighting: '#bae6fd' },
  'dark-mode': { name: 'Stealth Onyx', primary: '#1e293b', secondary: '#475569', lighting: '#94a3b8' },
  'rainbow': { name: 'Prism Spectrum', primary: '#ec4899', secondary: '#8b5cf6', lighting: '#06b6d4' },
};

// 12 Presets from Section 19
export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'cyber-gamer',
    name: 'Cyber Gamer',
    tagline: 'High-tech neon operative',
    badge: 'Popular',
    description: 'High collar jacket with cybernetic implants, holographic HUD visor, and a neon city view.',
    config: {
      style: 'cyberpunk',
      characterType: 'androgynous',
      skinTone: 'cyber-silver',
      hairstyle: 'futuristic',
      hairColor: 'blue',
      eyeShape: 'cyber-hud',
      eyeColor: 'cybernetic',
      outfit: 'cyberpunk-jacket',
      outfitPrimaryColor: '#0f172a',
      outfitSecondaryColor: '#06b6d4',
      accessories: ['visor', 'cybernetic-implant', 'gaming-headset'],
      gamingPersonality: 'competitive',
      background: 'neon-city',
      lightingColor: '#06b6d4',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'tactical-gamer',
    name: 'Tactical Gamer',
    tagline: 'Precision field commander',
    badge: 'FPS Rig',
    description: 'Plate carrier harness, noise-canceling comms headset, focused gaze and desert battlefield.',
    config: {
      style: 'military',
      characterType: 'male',
      skinTone: 'tan',
      hairstyle: 'fade',
      hairColor: 'black',
      eyeShape: 'intense',
      eyeColor: 'amber',
      outfit: 'tactical-outfit',
      outfitPrimaryColor: '#292524',
      outfitSecondaryColor: '#78716c',
      accessories: ['gaming-headset', 'face-mask', 'sunglasses'],
      gamingPersonality: 'shooter-fan',
      background: 'futuristic-battlefield',
      lightingColor: '#f59e0b',
      enableAura: false,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'rpg-adventurer',
    name: 'RPG Adventurer',
    tagline: 'Arcane warrior with dragon armor',
    badge: 'Fantasy',
    description: 'Carved steel breastplate, floating mana crystal, mystical glowing slit eyes and citadel spires.',
    config: {
      style: 'fantasy',
      characterType: 'female',
      skinTone: 'fair',
      hairstyle: 'braided',
      hairColor: 'silver',
      eyeShape: 'glowing-slit',
      eyeColor: 'purple',
      outfit: 'fantasy-armor',
      outfitPrimaryColor: '#475569',
      outfitSecondaryColor: '#a855f7',
      accessories: ['fantasy-prop', 'shoulder-armor'],
      gamingPersonality: 'rpg-fan',
      background: 'fantasy-kingdom',
      lightingColor: '#a855f7',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'horror-gamer',
    name: 'Horror Gamer',
    tagline: 'Survivor of midnight shadows',
    badge: 'Spooky',
    description: 'Dark shadowed hoodie, crimson glowing eyes, fog-drenched midnight pine backdrop.',
    config: {
      style: 'horror',
      characterType: 'androgynous',
      skinTone: 'deep-mocha',
      hairstyle: 'short',
      hairColor: 'black',
      eyeShape: 'glowing-slit',
      eyeColor: 'crimson',
      outfit: 'gaming-hoodie',
      outfitPrimaryColor: '#18181b',
      outfitSecondaryColor: '#dc2626',
      accessories: ['face-mask'],
      gamingPersonality: 'horror-fan',
      background: 'dark-forest',
      lightingColor: '#ef4444',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'racing-gamer',
    name: 'Racing Gamer',
    tagline: 'Apex velocity enthusiast',
    badge: 'Motorsport',
    description: 'Aerodynamic streetwear jacket, polarized shades, sleek taper hair and stadium arena lighting.',
    config: {
      style: 'racing',
      characterType: 'male',
      skinTone: 'olive',
      hairstyle: 'spiky',
      hairColor: 'brown',
      eyeShape: 'focused',
      eyeColor: 'blue',
      outfit: 'streetwear',
      outfitPrimaryColor: '#0284c7',
      outfitSecondaryColor: '#facc15',
      accessories: ['sunglasses', 'gaming-headset'],
      gamingPersonality: 'racing-fan',
      background: 'esports-arena',
      lightingColor: '#38bdf8',
      enableAura: false,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'strategy-gamer',
    name: 'Strategy Gamer',
    tagline: 'Mastermind tactician',
    badge: 'Big Brain',
    description: 'Neo-Tokyo tailored trench coat, quantum glasses, companion drone and high-tech lab core.',
    config: {
      style: 'futuristic',
      characterType: 'female',
      skinTone: 'rich-bronze',
      hairstyle: 'ponytail',
      hairColor: 'black',
      eyeShape: 'calm',
      eyeColor: 'green',
      outfit: 'futuristic-suit',
      outfitPrimaryColor: '#0f172a',
      outfitSecondaryColor: '#38bdf8',
      accessories: ['futuristic-gadget', 'visor'],
      gamingPersonality: 'strategic',
      background: 'sci-fi-laboratory',
      lightingColor: '#10b981',
      enableAura: false,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'retro-gamer',
    name: 'Retro Gamer',
    tagline: '8-Bit nostalgia enthusiast',
    badge: 'Chiptune',
    description: 'Synthwave gamer hoodie, pixel glasses, floating retro controller and 80s wireframe sun.',
    config: {
      style: 'pixel-art',
      characterType: 'androgynous',
      skinTone: 'warm',
      hairstyle: 'curly',
      hairColor: 'purple',
      eyeShape: 'anime-spark',
      eyeColor: 'glowing',
      outfit: 'gaming-hoodie',
      outfitPrimaryColor: '#4c1d95',
      outfitSecondaryColor: '#ec4899',
      accessories: ['gaming-controller', 'sunglasses'],
      gamingPersonality: 'retro-gamer',
      background: 'arcade',
      lightingColor: '#f43f5e',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'space-gamer',
    name: 'Space Gamer',
    tagline: 'Interstellar explorer',
    badge: 'Cosmic',
    description: 'Pressurized EVA suit collar, tinted helmet visor, nebula starlight and space deck window.',
    config: {
      style: 'space-explorer',
      characterType: 'female',
      skinTone: 'fair',
      hairstyle: 'short',
      hairColor: 'blonde',
      eyeShape: 'focused',
      eyeColor: 'blue',
      outfit: 'space-suit',
      outfitPrimaryColor: '#e2e8f0',
      outfitSecondaryColor: '#0284c7',
      accessories: ['helmet', 'futuristic-gadget'],
      gamingPersonality: 'explorer',
      background: 'space-station',
      lightingColor: '#38bdf8',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'fantasy-warrior',
    name: 'Fantasy Warrior',
    tagline: 'Battlefield vanguard',
    badge: 'Melee',
    description: 'Forged plate pauldrons, combat-ready gaze, braided hair, and dusk-lit mountain peaks.',
    config: {
      style: 'warrior',
      characterType: 'male',
      skinTone: 'warm',
      hairstyle: 'mohawk',
      hairColor: 'red',
      eyeShape: 'intense',
      eyeColor: 'amber',
      outfit: 'fantasy-armor',
      outfitPrimaryColor: '#334155',
      outfitSecondaryColor: '#ea580c',
      accessories: ['shoulder-armor'],
      gamingPersonality: 'competitive',
      background: 'snowy-mountain',
      lightingColor: '#f97316',
      enableAura: false,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'casual-gamer',
    name: 'Casual Gamer',
    tagline: 'Relaxed couch gamer',
    badge: 'Cozy',
    description: 'Comfortable oversized tech-hoodie, RGB headset with mic, cozy warm lighting in a battlestation.',
    config: {
      style: 'casual-gamer',
      characterType: 'androgynous',
      skinTone: 'warm',
      hairstyle: 'long',
      hairColor: 'brown',
      eyeShape: 'calm',
      eyeColor: 'green',
      outfit: 'casual-clothing',
      outfitPrimaryColor: '#334155',
      outfitSecondaryColor: '#38bdf8',
      accessories: ['gaming-headset', 'beanie'],
      gamingPersonality: 'casual',
      background: 'gaming-room',
      lightingColor: '#38bdf8',
      enableAura: false,
      isTransparentBg: false,
      previewMode: 'circle'
    }
  },
  {
    id: 'esports-gamer',
    name: 'Esports Pro',
    tagline: 'Tournament stage contender',
    badge: 'Pro Circuit',
    description: 'Official athletic tournament jersey, broadcast boom microphone, high taper fade and arena spotlights.',
    config: {
      style: 'esports',
      characterType: 'male',
      skinTone: 'rich-bronze',
      hairstyle: 'fade',
      hairColor: 'black',
      eyeShape: 'intense',
      eyeColor: 'gray',
      outfit: 'esports-jersey',
      outfitPrimaryColor: '#1e1b4b',
      outfitSecondaryColor: '#06b6d4',
      accessories: ['gaming-headset', 'microphone'],
      gamingPersonality: 'competitive',
      background: 'esports-arena',
      lightingColor: '#06b6d4',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'square'
    }
  },
  {
    id: 'hardcore-gamer',
    name: 'Hardcore Gamer',
    tagline: 'Maxed-out completionist',
    badge: '100% Run',
    description: 'Nanosuit tactical chest piece, glowing dual cybernetic optical implant, custom mechanical controller.',
    config: {
      style: 'gamer',
      characterType: 'female',
      skinTone: 'frost-blue',
      hairstyle: 'futuristic',
      hairColor: 'white',
      eyeShape: 'cyber-hud',
      eyeColor: 'cybernetic',
      outfit: 'sci-fi-armor',
      outfitPrimaryColor: '#09090b',
      outfitSecondaryColor: '#8b5cf6',
      accessories: ['cybernetic-implant', 'gaming-controller', 'gaming-headset'],
      gamingPersonality: 'completionist',
      background: 'gaming-room',
      lightingColor: '#a855f7',
      enableAura: true,
      isTransparentBg: false,
      previewMode: 'circle'
    }
  }
];

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  style: 'gamer',
  characterType: 'androgynous',
  skinTone: 'warm',
  hairstyle: 'spiky',
  hairColor: 'blue',
  eyeShape: 'focused',
  eyeColor: 'cybernetic',
  outfit: 'gaming-hoodie',
  outfitPrimaryColor: '#1e1b4b',
  outfitSecondaryColor: '#06b6d4',
  accessories: ['gaming-headset'],
  gamingPersonality: 'competitive',
  background: 'gaming-room',
  lightingColor: '#06b6d4',
  enableAura: true,
  isTransparentBg: false,
  previewMode: 'square'
};

// Generates a randomized, cohesive avatar configuration without collision
let lastGeneratedSignature = '';

export function generateRandomAvatarConfig(base?: Partial<AvatarConfig>): AvatarConfig {
  const styles: AvatarVisualStyle[] = ['gamer', 'cyberpunk', 'fantasy', 'sci-fi', 'anime', 'futuristic', 'esports', 'casual-gamer', 'warrior', 'horror'];
  const characterTypes: CharacterType[] = ['male', 'female', 'androgynous'];
  const skins: SkinTone[] = ['fair', 'warm', 'tan', 'olive', 'rich-bronze', 'deep-mocha', 'cyber-silver', 'frost-blue'];
  const hairstyles: Hairstyle[] = ['short', 'fade', 'spiky', 'curly', 'long', 'ponytail', 'braided', 'mohawk', 'futuristic'];
  const hairColors: HairColor[] = ['black', 'brown', 'blonde', 'red', 'white', 'silver', 'blue', 'purple', 'green'];
  const eyeShapes: EyeShape[] = ['focused', 'intense', 'calm', 'cyber-hud', 'glowing-slit', 'anime-spark'];
  const eyeColors: EyeColor[] = ['brown', 'blue', 'green', 'gray', 'amber', 'purple', 'cybernetic', 'glowing', 'crimson'];
  const outfits: OutfitCategory[] = [
    'gaming-hoodie', 'tactical-outfit', 'cyberpunk-jacket', 'fantasy-armor', 
    'sci-fi-armor', 'streetwear', 'esports-jersey', 'casual-clothing', 'futuristic-suit'
  ];
  const allAccessories: AccessoryType[] = [
    'gaming-headset', 'sunglasses', 'face-mask', 'cap', 'beanie', 
    'visor', 'cybernetic-implant', 'gaming-controller', 'microphone', 'futuristic-gadget'
  ];
  const personalities: GamingPersonality[] = [
    'competitive', 'casual', 'strategic', 'explorer', 'story-lover', 
    'rpg-fan', 'horror-fan', 'racing-fan', 'shooter-fan', 'completionist', 'retro-gamer'
  ];
  const backgrounds: AvatarBackground[] = [
    'gaming-room', 'neon-city', 'space-station', 'fantasy-kingdom', 
    'futuristic-battlefield', 'esports-arena', 'arcade', 'abstract', 'snowy-mountain'
  ];
  const palettes = Object.values(PREDEFINED_PALETTES);

  let attempts = 0;
  let newConfig: AvatarConfig;
  let signature = '';

  do {
    const chosenPalette = palettes[Math.floor(Math.random() * palettes.length)];
    const chosenStyle = styles[Math.floor(Math.random() * styles.length)];
    const chosenChar = characterTypes[Math.floor(Math.random() * characterTypes.length)];
    const chosenSkin = skins[Math.floor(Math.random() * skins.length)];
    const chosenHair = hairstyles[Math.floor(Math.random() * hairstyles.length)];
    const chosenHairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
    const chosenEyeShape = eyeShapes[Math.floor(Math.random() * eyeShapes.length)];
    const chosenEyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
    const chosenOutfit = outfits[Math.floor(Math.random() * outfits.length)];
    
    // Pick 1 to 2 compatible accessories
    const shuffledAccessories = [...allAccessories].sort(() => 0.5 - Math.random());
    const accessoryCount = Math.floor(Math.random() * 2) + 1;
    const chosenAccessories = shuffledAccessories.slice(0, accessoryCount);

    const chosenPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    const chosenBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    newConfig = {
      style: chosenStyle,
      characterType: chosenChar,
      skinTone: chosenSkin,
      hairstyle: chosenHair,
      hairColor: chosenHairColor,
      eyeShape: chosenEyeShape,
      eyeColor: chosenEyeColor,
      outfit: chosenOutfit,
      outfitPrimaryColor: chosenPalette.primary,
      outfitSecondaryColor: chosenPalette.secondary,
      accessories: chosenAccessories,
      gamingPersonality: chosenPersonality,
      background: chosenBg,
      lightingColor: chosenPalette.lighting,
      enableAura: Math.random() > 0.35,
      isTransparentBg: false,
      previewMode: Math.random() > 0.5 ? 'square' : 'circle',
      ...base
    };

    signature = `${newConfig.style}-${newConfig.hairstyle}-${newConfig.hairColor}-${newConfig.outfit}-${newConfig.background}`;
    attempts++;
  } while (signature === lastGeneratedSignature && attempts < 10);

  lastGeneratedSignature = signature;
  return newConfig;
}

// Client-side smart natural language parser for AI Avatar Mode (instant fallback & smart pre-interpretation)
export function interpretNaturalLanguageAvatarPrompt(prompt: string): AvatarConfig {
  const p = prompt.toLowerCase();
  const config = { ...DEFAULT_AVATAR_CONFIG };

  // 1. Detect Character Type
  if (p.includes('girl') || p.includes('woman') || p.includes('female') || p.includes('she') || p.includes('her')) {
    config.characterType = 'female';
  } else if (p.includes('boy') || p.includes('man') || p.includes('male') || p.includes('guy') || p.includes('he')) {
    config.characterType = 'male';
  }

  // 2. Detect Style
  if (p.includes('cyberpunk') || p.includes('hacker') || p.includes('neon') || p.includes('cyber')) {
    config.style = 'cyberpunk';
    config.background = 'neon-city';
    config.outfit = 'cyberpunk-jacket';
    config.lightingColor = '#06b6d4';
  } else if (p.includes('fantasy') || p.includes('knight') || p.includes('mage') || p.includes('wizard') || p.includes('dragon')) {
    config.style = 'fantasy';
    config.background = 'fantasy-kingdom';
    config.outfit = 'fantasy-armor';
    config.lightingColor = '#a855f7';
  } else if (p.includes('tactical') || p.includes('soldier') || p.includes('military') || p.includes('combat') || p.includes('sniper')) {
    config.style = 'military';
    config.background = 'futuristic-battlefield';
    config.outfit = 'tactical-outfit';
    config.lightingColor = '#f59e0b';
  } else if (p.includes('horror') || p.includes('dark') || p.includes('creepy') || p.includes('shadow') || p.includes('vampire')) {
    config.style = 'horror';
    config.background = 'dark-forest';
    config.eyeColor = 'crimson';
    config.lightingColor = '#ef4444';
  } else if (p.includes('space') || p.includes('astro') || p.includes('cosmic') || p.includes('alien') || p.includes('galaxy')) {
    config.style = 'space-explorer';
    config.background = 'space-station';
    config.outfit = 'space-suit';
    config.lightingColor = '#38bdf8';
  } else if (p.includes('retro') || p.includes('pixel') || p.includes('80s') || p.includes('vintage') || p.includes('arcade')) {
    config.style = 'pixel-art';
    config.background = 'arcade';
    config.lightingColor = '#f43f5e';
  } else if (p.includes('esport') || p.includes('pro') || p.includes('tournament') || p.includes('champion')) {
    config.style = 'esports';
    config.background = 'esports-arena';
    config.outfit = 'esports-jersey';
  }

  // 3. Detect Colors
  if (p.includes('purple') || p.includes('violet')) {
    config.outfitPrimaryColor = '#4c1d95';
    config.outfitSecondaryColor = '#a855f7';
    config.lightingColor = '#c084fc';
  } else if (p.includes('blue') || p.includes('cyan')) {
    config.outfitPrimaryColor = '#0f172a';
    config.outfitSecondaryColor = '#0ea5e9';
    config.lightingColor = '#06b6d4';
  } else if (p.includes('red') || p.includes('crimson') || p.includes('ruby')) {
    config.outfitPrimaryColor = '#18181b';
    config.outfitSecondaryColor = '#dc2626';
    config.lightingColor = '#ef4444';
  } else if (p.includes('green') || p.includes('emerald') || p.includes('lime')) {
    config.outfitPrimaryColor = '#022c22';
    config.outfitSecondaryColor = '#10b981';
    config.lightingColor = '#22c55e';
  } else if (p.includes('gold') || p.includes('yellow')) {
    config.outfitPrimaryColor = '#1c1917';
    config.outfitSecondaryColor = '#f59e0b';
    config.lightingColor = '#eab308';
  } else if (p.includes('white') || p.includes('silver') || p.includes('platinum')) {
    config.outfitPrimaryColor = '#334155';
    config.outfitSecondaryColor = '#f8fafc';
    config.hairColor = 'silver';
  }

  // 4. Detect Hair
  if (p.includes('curly')) config.hairstyle = 'curly';
  if (p.includes('braid') || p.includes('dread')) config.hairstyle = 'braided';
  if (p.includes('fade')) config.hairstyle = 'fade';
  if (p.includes('long hair')) config.hairstyle = 'long';
  if (p.includes('spiky')) config.hairstyle = 'spiky';
  if (p.includes('mohawk')) config.hairstyle = 'mohawk';
  if (p.includes('ponytail')) config.hairstyle = 'ponytail';

  // Hair color
  if (p.includes('black hair')) config.hairColor = 'black';
  if (p.includes('blonde hair') || p.includes('blond hair')) config.hairColor = 'blonde';
  if (p.includes('red hair')) config.hairColor = 'red';
  if (p.includes('blue hair')) config.hairColor = 'blue';
  if (p.includes('purple hair')) config.hairColor = 'purple';
  if (p.includes('silver hair') || p.includes('white hair')) config.hairColor = 'silver';
  if (p.includes('green hair')) config.hairColor = 'green';

  // 5. Detect Accessories
  const accList: AccessoryType[] = [];
  if (p.includes('headset') || p.includes('headphones') || p.includes('head phone')) accList.push('gaming-headset');
  if (p.includes('glasses') || p.includes('shades') || p.includes('sunglasses')) accList.push('sunglasses');
  if (p.includes('mask') || p.includes('respirator')) accList.push('face-mask');
  if (p.includes('visor') || p.includes('hud') || p.includes('scouter')) accList.push('visor');
  if (p.includes('cap') || p.includes('hat') || p.includes('snapback')) accList.push('cap');
  if (p.includes('beanie')) accList.push('beanie');
  if (p.includes('controller')) accList.push('gaming-controller');
  if (p.includes('mic') || p.includes('microphone')) accList.push('microphone');
  if (p.includes('drone') || p.includes('gadget') || p.includes('bot')) accList.push('futuristic-gadget');
  if (p.includes('implant') || p.includes('cyborg')) accList.push('cybernetic-implant');
  if (p.includes('hoodie')) config.outfit = 'gaming-hoodie';

  if (accList.length > 0) {
    config.accessories = accList;
  }

  return config;
}
