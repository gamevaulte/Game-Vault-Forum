import { 
  UsernameStyle, 
  GamingTheme, 
  GeneratorPreferences, 
  GeneratedUsername, 
  SupportedPlatform 
} from '../types/usernameGenerator';
import { STYLE_WORDS, THEME_WORDS, POPULAR_SYMBOLS, isSafeUsername } from '../data/usernameWordsData';

export const SUPPORTED_PLATFORMS: SupportedPlatform[] = [
  {
    name: 'Twitch',
    id: 'twitch',
    icon: 'twitch',
    checkUrlTemplate: (name: string) => `https://www.twitch.tv/signup`,
    signUpUrlTemplate: (name: string) => `https://www.twitch.tv/signup`,
    guidance: 'Twitch usernames must be 4–25 alphanumeric characters. Open signup page to register.'
  },
  {
    name: 'X (Twitter)',
    id: 'x',
    icon: 'twitter',
    checkUrlTemplate: (name: string) => `https://x.com/i/flow/signup`,
    signUpUrlTemplate: (name: string) => `https://x.com/i/flow/signup`,
    guidance: 'X handles can be up to 15 alphanumeric characters plus underscores.'
  },
  {
    name: 'Discord',
    id: 'discord',
    icon: 'message-square',
    checkUrlTemplate: (name: string) => `https://discord.com/register`,
    signUpUrlTemplate: (name: string) => `https://discord.com/register`,
    guidance: 'Discord global unique handles are 2–32 lowercase letters, numbers, underscores, and periods.'
  },
  {
    name: 'Steam',
    id: 'steam',
    icon: 'gamepad-2',
    checkUrlTemplate: (name: string) => `https://store.steampowered.com/join/`,
    signUpUrlTemplate: (name: string) => `https://store.steampowered.com/join/`,
    guidance: 'Steam accounts let you pick your account name and custom profile URL.'
  },
  {
    name: 'YouTube',
    id: 'youtube',
    icon: 'youtube',
    checkUrlTemplate: (name: string) => `https://accounts.google.com/SignUp`,
    signUpUrlTemplate: (name: string) => `https://accounts.google.com/SignUp`,
    guidance: 'YouTube handles require a Google account. Open sign up to create your channel handle.'
  },
  {
    name: 'Reddit',
    id: 'reddit',
    icon: 'globe',
    checkUrlTemplate: (name: string) => `https://www.reddit.com/register/`,
    signUpUrlTemplate: (name: string) => `https://www.reddit.com/register/`,
    guidance: 'Reddit usernames allow 3–20 characters with underscores and dashes.'
  },
  {
    name: 'Epic Games',
    id: 'epic',
    icon: 'gamepad-2',
    checkUrlTemplate: (name: string) => `https://www.epicgames.com/id/register`,
    signUpUrlTemplate: (name: string) => `https://www.epicgames.com/id/register`,
    guidance: 'Epic Games display names require 3–16 characters.'
  }
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function cleanKeyword(kw: string): string {
  return kw.trim().replace(/[^a-zA-Z0-9]/g, '');
}

export function generateSingleUsername(prefs: GeneratorPreferences, styleOverride?: UsernameStyle): GeneratedUsername {
  const chosenStyle = styleOverride || (prefs.selectedStyles.length > 0 ? getRandomItem(prefs.selectedStyles) : 'Cool');
  const chosenTheme = prefs.selectedTheme === 'Random' ? getRandomItem(['Military', 'Space', 'Cyberpunk', 'Fantasy', 'Fire', 'Ice', 'Technology'] as GamingTheme[]) : prefs.selectedTheme;

  const stylePool = STYLE_WORDS[chosenStyle] || STYLE_WORDS.Cool;
  const themePool = THEME_WORDS[chosenTheme] || THEME_WORDS.Cyberpunk;

  const kw = cleanKeyword(prefs.keyword);
  let baseParts: string[] = [];

  // Patterns
  // 1: Keyword + Style Root
  // 2: Theme Prefix + Keyword
  // 3: Style Prefix + Theme Root
  // 4: Theme Prefix + Style Root + Suffix
  // 5: Minimal single word or paired
  const patternType = Math.floor(Math.random() * 5);

  if (kw) {
    if (patternType % 2 === 0) {
      baseParts = [kw, getRandomItem(stylePool.roots)];
    } else {
      const prefix = Math.random() > 0.5 ? getRandomItem(stylePool.prefixes) : getRandomItem(themePool.prefixes);
      baseParts = [prefix, kw];
    }
  } else {
    if (prefs.lengthPreference === 'short') {
      if (Math.random() > 0.5) {
        baseParts = [getRandomItem(STYLE_WORDS.Minimal.roots)];
      } else {
        baseParts = [getRandomItem(STYLE_WORDS.Minimal.prefixes), getRandomItem(STYLE_WORDS.Minimal.roots)];
      }
    } else if (prefs.lengthPreference === 'long') {
      const p = getRandomItem(themePool.prefixes);
      const r = getRandomItem(stylePool.roots);
      const s = getRandomItem(stylePool.suffixes.filter(Boolean));
      baseParts = [p, r, s];
    } else {
      // Medium
      const p = Math.random() > 0.5 ? getRandomItem(stylePool.prefixes) : getRandomItem(themePool.prefixes);
      const r = Math.random() > 0.5 ? getRandomItem(stylePool.roots) : getRandomItem(themePool.roots);
      baseParts = [p, r];
    }
  }

  // Formatting casing
  let combined = '';
  if (prefs.useCapitalLetters) {
    // PascalCase
    combined = baseParts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('');
  } else {
    // lowercase
    combined = baseParts.join('').toLowerCase();
  }

  // Symbol addition
  let hasSym = false;
  if (prefs.addSymbols && Math.random() > 0.3) {
    const sym = getRandomItem(POPULAR_SYMBOLS);
    if (Math.random() > 0.5 && baseParts.length >= 2) {
      combined = baseParts.join(sym);
    } else {
      combined = `${sym}${combined}`;
    }
    hasSym = true;
  }

  // Number addition
  let hasNum = false;
  if (prefs.addNumbers) {
    const luckyNums = ['7', '07', '99', '23', '42', '88', '360', '01', 'X'];
    const chosenNum = getRandomItem(luckyNums);
    combined = `${combined}${chosenNum}`;
    hasNum = true;
  }

  // Enforce length preference if bounds specified
  if (prefs.lengthPreference === 'short' && combined.length > 8) {
    combined = combined.slice(0, 8);
  }

  // Enforce safety
  if (!isSafeUsername(combined)) {
    combined = 'VortexPulse';
  }

  return {
    id: `usr-gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: combined,
    style: chosenStyle,
    theme: chosenTheme,
    length: combined.length,
    hasNumbers: hasNum,
    hasSymbols: hasSym,
    createdAt: Date.now()
  };
}

export function generateBatchUsernames(prefs: GeneratorPreferences): GeneratedUsername[] {
  const count = prefs.batchSize || 10;
  const list: GeneratedUsername[] = [];
  const set = new Set<string>();

  let attempts = 0;
  while (list.length < count && attempts < 50) {
    attempts++;
    const item = generateSingleUsername(prefs);
    if (!set.has(item.name)) {
      set.add(item.name);
      list.push(item);
    }
  }

  return list;
}
