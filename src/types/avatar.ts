export type AvatarVisualStyle =
  | 'gamer'
  | 'cyberpunk'
  | 'fantasy'
  | 'sci-fi'
  | 'anime'
  | 'cartoon'
  | 'pixel-art'
  | 'futuristic'
  | 'warrior'
  | 'military'
  | 'space-explorer'
  | 'medieval'
  | 'horror'
  | 'racing'
  | 'esports'
  | 'casual-gamer';

export type CharacterType = 'male' | 'female' | 'androgynous';

export type SkinTone =
  | 'fair'
  | 'warm'
  | 'tan'
  | 'olive'
  | 'rich-bronze'
  | 'deep-mocha'
  | 'cyber-silver'
  | 'neon-violet'
  | 'frost-blue'
  | 'orc-green';

export type Hairstyle =
  | 'short'
  | 'long'
  | 'curly'
  | 'braided'
  | 'mohawk'
  | 'fade'
  | 'ponytail'
  | 'spiky'
  | 'buzz-cut'
  | 'futuristic';

export type HairColor =
  | 'black'
  | 'brown'
  | 'blonde'
  | 'red'
  | 'white'
  | 'silver'
  | 'blue'
  | 'purple'
  | 'green'
  | 'custom';

export type EyeShape =
  | 'focused'
  | 'intense'
  | 'calm'
  | 'cyber-hud'
  | 'glowing-slit'
  | 'anime-spark';

export type EyeColor =
  | 'brown'
  | 'blue'
  | 'green'
  | 'gray'
  | 'amber'
  | 'purple'
  | 'cybernetic'
  | 'glowing'
  | 'crimson';

export type OutfitCategory =
  | 'gaming-hoodie'
  | 'tactical-outfit'
  | 'cyberpunk-jacket'
  | 'fantasy-armor'
  | 'sci-fi-armor'
  | 'streetwear'
  | 'esports-jersey'
  | 'military-outfit'
  | 'space-suit'
  | 'casual-clothing'
  | 'futuristic-suit'
  | 'fantasy-robe';

export type AccessoryType =
  | 'gaming-headset'
  | 'sunglasses'
  | 'face-mask'
  | 'cap'
  | 'beanie'
  | 'helmet'
  | 'visor'
  | 'backpack'
  | 'shoulder-armor'
  | 'cybernetic-implant'
  | 'gaming-controller'
  | 'microphone'
  | 'fantasy-prop'
  | 'futuristic-gadget';

export type GamingPersonality =
  | 'competitive'
  | 'casual'
  | 'strategic'
  | 'explorer'
  | 'story-lover'
  | 'rpg-fan'
  | 'horror-fan'
  | 'racing-fan'
  | 'shooter-fan'
  | 'sports-gamer'
  | 'strategy-gamer'
  | 'multiplayer-gamer'
  | 'achievement-hunter'
  | 'completionist'
  | 'retro-gamer';

export type AvatarBackground =
  | 'gaming-room'
  | 'neon-city'
  | 'space-station'
  | 'fantasy-kingdom'
  | 'dark-forest'
  | 'futuristic-battlefield'
  | 'cyberpunk-street'
  | 'esports-arena'
  | 'desert-landscape'
  | 'snowy-mountain'
  | 'sci-fi-laboratory'
  | 'arcade'
  | 'abstract'
  | 'solid'
  | 'transparent';

export type PredefinedColorPalette =
  | 'neon-blue'
  | 'cyber-purple'
  | 'electric-green'
  | 'fire-red'
  | 'golden'
  | 'ice-blue'
  | 'dark-mode'
  | 'rainbow';

export interface AvatarConfig {
  id?: string;
  name?: string;
  style: AvatarVisualStyle;
  characterType: CharacterType;
  skinTone: SkinTone;
  hairstyle: Hairstyle;
  hairColor: HairColor;
  customHairColor?: string;
  eyeShape: EyeShape;
  eyeColor: EyeColor;
  outfit: OutfitCategory;
  outfitPrimaryColor: string;
  outfitSecondaryColor: string;
  accessories: AccessoryType[];
  gamingPersonality: GamingPersonality;
  background: AvatarBackground;
  customBackgroundColor?: string;
  lightingColor: string;
  enableAura: boolean;
  isTransparentBg: boolean;
  previewMode: 'square' | 'circle';
  filterStyle?: string;
  createdAt?: string;
}

export interface SavedAvatar {
  id: string;
  name: string;
  genre?: string;
  config: AvatarConfig;
  previewDataUrl?: string;
  createdAt: string;
  userId?: string;
  authorName?: string;
}

export interface AvatarPreset {
  id: string;
  name: string;
  genre?: string;
  tagline: string;
  description: string;
  badge: string;
  config: AvatarConfig;
}
