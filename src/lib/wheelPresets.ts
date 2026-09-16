import { WheelPreset } from '../types/gamePickerWheel';

export const WHEEL_PRESETS: WheelPreset[] = [
  {
    id: 'popular-games',
    title: 'Popular Games',
    category: 'Trending',
    description: 'The most played games worldwide across PC and consoles.',
    games: [
      'Grand Theft Auto V',
      'Fortnite',
      'Minecraft',
      'Counter-Strike 2',
      'Cyberpunk 2077',
      'Valorant',
      'Call of Duty: Warzone',
      'EA Sports FC 24'
    ]
  },
  {
    id: 'pc-games',
    title: 'PC Games',
    category: 'Platform',
    description: 'PC master-race staples with dedicated keyboard & mouse depth.',
    games: [
      'World of Warships',
      'Baldur’s Gate 3',
      'Counter-Strike 2',
      'Helldivers 2',
      'Rust',
      'The Witcher 3: Wild Hunt',
      'Dota 2',
      'Black Myth: Wukong'
    ]
  },
  {
    id: 'console-games',
    title: 'Console Games',
    category: 'Platform',
    description: 'Cinematic console triumphs and couch gaming masterpieces.',
    games: [
      'God of War Ragnarök',
      'Ghost of Tsushima',
      'Marvel’s Spider-Man 2',
      'Elden Ring',
      'Forza Horizon 5',
      'Halo Infinite',
      'The Last of Us Part I'
    ]
  },
  {
    id: 'multiplayer-games',
    title: 'Multiplayer Games',
    category: 'Social',
    description: 'Squad up with friends or test your reflexes against online players.',
    games: [
      'Helldivers 2',
      'PUBG Mobile',
      'Valorant',
      'Fortnite',
      'Apex Legends',
      'Rocket League',
      'Rainbow Six Siege',
      'Overwatch 2'
    ]
  },
  {
    id: 'single-player-games',
    title: 'Single-Player Games',
    category: 'Solo',
    description: 'Deep narrative journeys, rich lore, and solo campaign immersion.',
    games: [
      'Elden Ring: Shadow of the Erdtree',
      'Cyberpunk 2077: Phantom Liberty',
      'Red Dead Redemption 2',
      'The Witcher 3: Wild Hunt',
      'Alan Wake 2',
      'Hades II',
      'Hogwarts Legacy'
    ]
  },
  {
    id: 'my-backlog',
    title: 'My Backlog',
    category: 'Goal',
    description: 'Critically acclaimed blockbusters waiting in your library to be finished.',
    games: [
      'Starfield',
      'Black Myth: Wukong',
      'Baldur’s Gate 3',
      'Resident Evil 4 Remake',
      'Final Fantasy VII Rebirth',
      'Armored Core VI',
      'Dragon’s Dogma 2'
    ]
  },
  {
    id: 'relaxing-cozy',
    title: 'Relaxing & Cozy',
    category: 'Vibe',
    description: 'Low-stress, comforting games to unwind after a long day.',
    games: [
      'Stardew Valley',
      'Animal Crossing',
      'Dave the Diver',
      'Minecraft',
      'A Short Hike',
      'Slime Rancher',
      'Dorfromantik'
    ]
  }
];

export const WHEEL_COLOR_PALETTE = [
  '#7c3aed', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f43f5e', // Rose
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#eab308', // Yellow
  '#6366f1', // Indigo
  '#ef4444', // Red
];
