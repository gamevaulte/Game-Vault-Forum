export type UsernameStyle =
  | 'Cool'
  | 'Funny'
  | 'Competitive'
  | 'Pro Gamer'
  | 'Dark'
  | 'Mysterious'
  | 'Fantasy'
  | 'Futuristic'
  | 'Minimal'
  | 'Cute'
  | 'Savage'
  | 'Creative'
  | 'Random';

export type GamingTheme =
  | 'Military'
  | 'Space'
  | 'Cyberpunk'
  | 'Fantasy'
  | 'Animals'
  | 'Fire'
  | 'Ice'
  | 'Technology'
  | 'Mythology'
  | 'Horror'
  | 'Adventure'
  | 'Random';

export type UsernameLengthPreference = 'short' | 'medium' | 'long';

export interface GeneratorPreferences {
  selectedStyles: UsernameStyle[];
  selectedTheme: GamingTheme;
  keyword: string;
  lengthPreference: UsernameLengthPreference;
  maxCharacters?: number;
  addNumbers: boolean;
  addSymbols: boolean;
  useCapitalLetters: boolean;
  batchSize: 5 | 10;
}

export interface GeneratedUsername {
  id: string;
  name: string;
  style: UsernameStyle;
  theme: GamingTheme;
  length: number;
  hasNumbers: boolean;
  hasSymbols: boolean;
  createdAt: number;
  isFavorited?: boolean;
}

export interface SupportedPlatform {
  name: string;
  id: 'discord' | 'twitch' | 'youtube' | 'x' | 'reddit' | 'steam' | 'epic';
  icon: string;
  checkUrlTemplate: (name: string) => string;
  signUpUrlTemplate?: (name: string) => string;
  guidance: string;
}
