import { GameRelease, CalendarPlatform, ReleaseGenre } from '../types/releaseCalendar';

export const ALL_PLATFORMS: CalendarPlatform[] = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X/S',
  'Xbox One',
  'Nintendo Switch',
  'Nintendo Switch 2',
  'iOS',
  'Android',
  'Steam Deck',
  'Cloud Gaming'
];

export const ALL_GENRES: ReleaseGenre[] = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Horror',
  'Fighting',
  'Shooter',
  'Puzzle',
  'Platformer',
  'Survival',
  'MMO',
  'Indie'
];

export const GAME_RELEASES_DATABASE: GameRelease[] = [
  // ==================== TODAY (SEPTEMBER 24, 2026) ====================
  {
    id: 'rel-greedfall-2',
    title: 'GreedFall II: The Dying World',
    slug: 'greedfall-2-the-dying-world',
    releaseDate: '2026-09-24',
    releaseDateDisplay: 'September 24, 2026',
    releaseTime: '15:00 UTC',
    releaseRegion: 'Worldwide',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Steam Deck'],
    genre: 'RPG',
    developer: 'Spiders',
    publisher: 'Nacon',
    cover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Return to the rich narrative RPG world of Teer Fradee. Uprooted from your homeland, forge alliances and reclaim your destiny in an old world ravaged by plague and political intrigue.',
    fullDescription: `GreedFall II: The Dying World deepens the tactical narrative RPG experience pioneered by Spiders. Beginning three years before the events of the original title, you play as a native of Teer Fradee, forcibly taken to the continent of Gacane. In this war-torn old continent plagued by the Malichor epidemic and endless factional feuds, players must navigate tactical pause-and-play combat, deep companion affinities, and branching diplomatic dialogues.`,
    status: 'Releasing Today',
    isConfirmed: true,
    hypeScore: 84,
    dataSource: 'Official Publisher Announcement (Nacon)',
    lastUpdated: 'September 2026',
    officialWebsite: 'https://greedfall.com',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/1997660/GreedFall_II_The_Dying_World/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i7-4790 / AMD Ryzen 5 1500X',
      recCpu: 'Intel Core i5-10600K / AMD Ryzen 5 3600XT',
      minGpu: 'NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580',
      recGpu: 'NVIDIA GeForce RTX 2060 Super / AMD Radeon RX 6600',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '45 GB NVMe SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-ara-history-untold',
    title: 'Ara: History Untold',
    slug: 'ara-history-untold',
    releaseDate: '2026-09-24',
    releaseDateDisplay: 'September 24, 2026',
    releaseTime: '17:00 UTC',
    releaseRegion: 'Worldwide',
    platforms: ['PC', 'Steam Deck', 'Cloud Gaming'],
    genre: 'Strategy',
    developer: 'Oxide Games',
    publisher: 'Xbox Game Studios',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'An evolution in historical grand strategy featuring simultaneous turn resolution, dynamic living world simulation, and prestige-based victory systems.',
    fullDescription: `Built by industry veterans at Oxide Games and published by Xbox Game Studios, Ara: History Untold re-imagines historical turn-based grand strategy. The game abandons rigid linear victory trees in favor of a comprehensive Prestige system, where culture, military power, technology, and economic craftsmanship all contribute to your civilization's legacy.`,
    status: 'Releasing Today',
    isConfirmed: true,
    hypeScore: 88,
    dataSource: 'Xbox Games Showcase & Steam',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2021880/Ara_History_Untold/' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i5-5300U / AMD Ryzen 3 1200',
      recCpu: 'Intel Core i7-8700K / AMD Ryzen 7 3700X',
      minGpu: 'NVIDIA GeForce GTX 970 / AMD Radeon RX 480',
      recGpu: 'NVIDIA GeForce RTX 2070 / AMD Radeon RX 5700 XT',
      minRam: '8 GB',
      recRam: '16 GB',
      storage: '50 GB SSD'
    },
    isMajorHighlight: true
  },

  // ==================== THIS WEEK (SEPTEMBER 21 - 27, 2026) ====================
  {
    id: 'rel-zelda-echoes-wisdom',
    title: 'The Legend of Zelda: Echoes of Wisdom',
    slug: 'the-legend-of-zelda-echoes-of-wisdom',
    releaseDate: '2026-09-26',
    releaseDateDisplay: 'September 26, 2026',
    platforms: ['Nintendo Switch', 'Nintendo Switch 2'],
    genre: 'Adventure',
    developer: 'Nintendo EPD / Grezzo',
    publisher: 'Nintendo',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Play as Princess Zelda in a grand quest to save the kingdom of Hyrule using the Tri Rod to replicate echoes of objects and monsters.',
    fullDescription: `For the first time in mainline franchise history, Princess Zelda takes the mantle as the primary protagonist. Hyrule is vanishing into strange rifts, taking Link and the royal court with it. Zelda teams up with the mysterious fairy Tri and wields the Tri Rod to create echoes — imitation copies of tables, beds, water blocks, and captured monsters to solve physics puzzles and overcome enemies in open-ended creative solutions.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 96,
    dataSource: 'Nintendo Direct Official Announcement',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Nintendo eShop', url: 'https://www.nintendo.com/store/products/the-legend-of-zelda-echoes-of-wisdom-switch/' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-starfield-shattered-space',
    title: 'Starfield: Shattered Space',
    slug: 'starfield-shattered-space',
    releaseDate: '2026-09-27',
    releaseDateDisplay: 'September 27, 2026',
    releaseTime: '16:00 UTC',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'RPG',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Unravel the sacred mysteries and shadowy rituals of House Va’ruun on their secluded homeworld of Va’ruun’kai.',
    fullDescription: `The first major narrative expansion for Bethesda Game Studios’ Starfield. Players receive a distress signal leading them to the hidden homeworld of House Va'ruun. Unlike the procedural galaxy of the base game, Shattered Space features a bespoke, hand-crafted planetary zone filled with cosmic horror, psychological anomalies, unique stealth weapons, and religious power struggles.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 91,
    dataSource: 'Bethesda Official Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'AMD Ryzen 5 2600X / Intel Core i7-6800K',
      recCpu: 'AMD Ryzen 5 3600X / Intel Core i5-10600K',
      minGpu: 'AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070 Ti',
      recGpu: 'AMD Radeon RX 6800 XT / NVIDIA GeForce RTX 2080',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '125 GB SSD Required'
    },
    isMajorHighlight: true
  },

  // ==================== THIS MONTH (SEPTEMBER 2026 RELEASES) ====================
  {
    id: 'rel-space-marine-2',
    title: 'Warhammer 40,000: Space Marine 2',
    slug: 'warhammer-40000-space-marine-2',
    releaseDate: '2026-09-09',
    releaseDateDisplay: 'September 9, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Action',
    developer: 'Saber Interactive',
    publisher: 'Focus Entertainment',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Embody the superhuman skill and brutality of Captain Demetrian Titus against endless Tyranid swarms with proprietary Swarm Engine tech.',
    fullDescription: `The galaxy is in peril. Worlds are falling and the Imperium needs you. Embody the superhuman skill and brutality of a Space Marine, the greatest of the Emperor's warriors. Unleash deadly abilities and an arsenal of devastating weaponry to obliterate the relentless Tyranid swarms. Features 3-player co-op campaign, Operations PvE, and Eternal War 6v6 PvP.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 95,
    dataSource: 'Focus Entertainment & Steam Store',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2183900/Warhammer_40000_Space_Marine_2/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'AMD Ryzen 5 2600X / Intel Core i5-8600K',
      recCpu: 'AMD Ryzen 7 5800X / Intel Core i7-12700',
      minGpu: 'AMD Radeon RX 580 / NVIDIA GeForce GTX 1060',
      recGpu: 'AMD Radeon RX 6800 XT / NVIDIA GeForce RTX 3070',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '75 GB SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-astro-bot',
    title: 'Astro Bot',
    slug: 'astro-bot',
    releaseDate: '2026-09-06',
    releaseDateDisplay: 'September 6, 2026',
    platforms: ['PlayStation 5'],
    genre: 'Platformer',
    developer: 'Team ASOBI',
    publisher: 'Sony Interactive Entertainment',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'A colossal 3D platforming masterpiece celebrating 30 years of PlayStation heritage with over 50 planets and 150 VIP Bots.',
    fullDescription: `Join ASTRO on a supersized space adventure! When the PS5 mothership is attacked by ASTRO's longtime alien nemesis, its crew scattered across galaxies, it's up to you to explore over 50 vibrant planets. Make full creative use of the DualSense wireless controller's haptic feedback, adaptive triggers, and gyro motion.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 97,
    dataSource: 'PlayStation Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'PlayStation Store', url: 'https://store.playstation.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-god-of-war-ragnarok-pc',
    title: 'God of War Ragnarök (PC)',
    slug: 'god-of-war-ragnarok-pc',
    releaseDate: '2026-09-19',
    releaseDateDisplay: 'September 19, 2026',
    platforms: ['PC', 'Steam Deck'],
    genre: 'Action',
    developer: 'Santa Monica Studio / Jetpack Interactive',
    publisher: 'PlayStation PC LLC',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Kratos and Atreus embark on an epic and heartfelt journey across the Nine Realms on PC with unlocked framerates and ultrawide support.',
    fullDescription: `Embark on an epic Norse odyssey with Kratos and Atreus as they fight to hold on and let go. Featuring unlocked framerates, true 4K resolution options, NVIDIA DLSS 3.7 Frame Generation, AMD FSR 3.1, Intel XeSS, and native 21:9 & 32:9 panoramic ultrawide support. Includes the God of War Ragnarök: Valhalla roguelite expansion.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 96,
    dataSource: 'PlayStation PC & Steam Official',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2322010/God_of_War_Ragnarok/' },
      { store: 'Epic Games', url: 'https://store.epicgames.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel i5-4670K / AMD FX-8350',
      recCpu: 'Intel i5-8600 / AMD Ryzen 5 3600',
      minGpu: 'NVIDIA GTX 1060 (6GB) / AMD RX 5500 XT',
      recGpu: 'NVIDIA RTX 2060 Super / AMD RX 5700',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '190 GB SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-dead-rising-remaster',
    title: 'Dead Rising Deluxe Remaster',
    slug: 'dead-rising-deluxe-remaster',
    releaseDate: '2026-09-18',
    releaseDateDisplay: 'September 18, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Horror',
    developer: 'Capcom',
    publisher: 'Capcom',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Frank West returns to the Willamette Parkview Mall rebuilt in Capcom’s RE ENGINE with 4K 60fps visuals and modern quality-of-life controls.',
    fullDescription: `Dead Rising Deluxe Remaster revives the zombie sandbox that started it all. Frank West investigates the secluded town of Willamette overrun by hordes of zombies. Rebuilt from the ground up in RE ENGINE, the remaster adds autosaves, improved companion AI, modern twin-stick aiming while walking, and full 4K visual fidelity.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 85,
    dataSource: 'Capcom Next Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i7-6700 / AMD Ryzen 5 3400G',
      recCpu: 'Intel Core i7-8700 / AMD Ryzen 5 3600',
      minGpu: 'NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580',
      recGpu: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '50 GB SSD'
    }
  },

  // ==================== UPCOMING OCTOBER 2026 RELEASES ====================
  {
    id: 'rel-silent-hill-2',
    title: 'Silent Hill 2 Remake',
    slug: 'silent-hill-2-remake',
    releaseDate: '2026-10-08',
    releaseDateDisplay: 'October 8, 2026',
    releaseTime: '00:00 Local',
    releaseRegion: 'Worldwide',
    platforms: ['PC', 'PlayStation 5'],
    genre: 'Horror',
    developer: 'Bloober Team',
    publisher: 'Konami',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Having received a letter from his deceased wife, James heads to where they shared so many memories: the fog-drenched town of Silent Hill.',
    fullDescription: `Experience a masterclass in psychological survival horror. Built in Unreal Engine 5 with ray-traced shadows and spatial audio, Bloober Team reimagines the landmark 2001 classic. Explore expanded interiors, an over-the-shoulder perspective, modernized combat telegraphs, and terrifying encounters with Pyramid Head and the Nurses.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 94,
    dataSource: 'Konami Silent Hill Transmission & PlayStation Store',
    lastUpdated: 'September 2026',
    officialWebsite: 'https://www.konami.com/games/silenthill/2r/',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2124490/SILENT_HILL_2/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i7-6700K / AMD Ryzen 5 3600',
      recCpu: 'Intel Core i7-8700K / AMD Ryzen 5 3600X',
      minGpu: 'NVIDIA GeForce GTX 1080 / AMD Radeon RX 5700 XT',
      recGpu: 'NVIDIA GeForce RTX 2080 / AMD Radeon RX 6800 XT',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '50 GB NVMe SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-metaphor-refantazio',
    title: 'Metaphor: ReFantazio',
    slug: 'metaphor-refantazio',
    releaseDate: '2026-10-11',
    releaseDateDisplay: 'October 11, 2026',
    platforms: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Steam Deck'],
    genre: 'RPG',
    developer: 'Studio Zero / Atlus',
    publisher: 'Sega',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The visionary creators of Persona 3, 4, and 5 deliver an ambitious fantasy RPG where players compete for the throne in a tournament of destiny.',
    fullDescription: `From the creative minds behind the modern Persona series (director Katsura Hashino, character designer Shigenori Soejima, and composer Shoji Meguro), Metaphor: ReFantazio transports players to the United Kingdom of Euchronia. Harness Archetype transformations, pilot your armored gauntlet runner across continents, and forge bonds with election electors in a high-stakes campaign for democratic monarchy.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 94,
    dataSource: 'Atlus Official Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2622480/Metaphor_ReFantazio/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i5-3470 / AMD FX-6300',
      recCpu: 'Intel Core i7-6700 / AMD Ryzen 5 2600',
      minGpu: 'NVIDIA GeForce GTX 750 Ti / AMD Radeon HD 7870',
      recGpu: 'NVIDIA GeForce GTX 970 / AMD Radeon RX 480',
      minRam: '8 GB',
      recRam: '16 GB',
      storage: '93 GB SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-sparking-zero',
    title: 'Dragon Ball: Sparking! ZERO',
    slug: 'dragon-ball-sparking-zero',
    releaseDate: '2026-10-11',
    releaseDateDisplay: 'October 11, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Fighting',
    developer: 'Spike Chunsoft',
    publisher: 'Bandai Namco Entertainment',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The legendary Budokai Tenkaichi franchise returns with an enormous roster of over 180 fighters, destructible arenas, and Custom Battle creator modes.',
    fullDescription: `Dragon Ball: Sparking! ZERO takes the legendary gameplay of the Budokai Tenkaichi series to historic heights. Master a colossal roster of fighters spanning Dragon Ball Z, Dragon Ball Super, Dragon Ball GT, and select movie villains. Experience destructible earth-shattering arenas, beam clashes, Vanishing attacks, and branch new alternate timeline stories in Episode Battles.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 95,
    dataSource: 'Bandai Namco Entertainment Official',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/1790600/DRAGON_BALL_Sparking_ZERO/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-black-ops-6',
    title: 'Call of Duty: Black Ops 6',
    slug: 'call-of-duty-black-ops-6',
    releaseDate: '2026-10-25',
    releaseDateDisplay: 'October 25, 2026',
    platforms: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Cloud Gaming'],
    genre: 'Shooter',
    developer: 'Treyarch / Raven Software',
    publisher: 'Activision',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Signature Black Ops spy thriller campaign set in the early 1990s featuring groundbreaking Omnimovement and round-based Zombies.',
    fullDescription: `Developed by Treyarch and Raven, Black Ops 6 is a spy action thriller set in the early 90s, a period of transition and upheaval in global politics. Introducing Omnimovement allowing players to sprint, slide, and dive in any direction seamlessly. Features a dynamic blockbuster campaign, 16 brand-new multiplayer maps at launch, and the triumphant return of classic Round-Based Zombies with Terminus and Liberty Falls.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 95,
    dataSource: 'Activision & Xbox Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i5-6600 / AMD Ryzen 5 1400',
      recCpu: 'Intel Core i7-6700K / AMD Ryzen 5 1600X',
      minGpu: 'NVIDIA GeForce GTX 960 / AMD Radeon RX 470',
      recGpu: 'NVIDIA GeForce GTX 1080Ti / AMD Radeon RX 6600XT',
      minRam: '8 GB',
      recRam: '16 GB',
      storage: '102 GB SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-dragon-age-veilguard',
    title: 'Dragon Age: The Veilguard',
    slug: 'dragon-age-the-veilguard',
    releaseDate: '2026-10-31',
    releaseDateDisplay: 'October 31, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'RPG',
    developer: 'BioWare',
    publisher: 'Electronic Arts',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Enter Thedas, a vibrant world of rugged wilderness and majestic cities. Rise as Rook, recruit seven companions, and defy ancient corrupt elven gods.',
    fullDescription: `The next chapter of BioWare’s landmark fantasy role-playing franchise. As Rook, you lead the Veilguard across the glittering spires of Minrathous, the stormy coasts of Rivain, and the deep forest depths of Arlathan. Command tactical abilities in real-time with ability pause wheels, form deep companion bonds, and save Thedas from ancient elven deities unleashed upon the Fade.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 92,
    dataSource: 'BioWare & EA Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/1845910/Dragon_Age_The_Veilguard/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i5-8400 / AMD Ryzen 3 3300X',
      recCpu: 'Intel Core i9-9900K / AMD Ryzen 7 3700X',
      minGpu: 'NVIDIA GeForce GTX 970 / AMD Radeon R9 290X',
      recGpu: 'NVIDIA GeForce RTX 2070 / AMD Radeon RX 5700XT',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '100 GB SSD'
    },
    isMajorHighlight: true
  },

  // ==================== UPCOMING NOVEMBER - DECEMBER 2026 ====================
  {
    id: 'rel-mario-luigi-brothership',
    title: 'Mario & Luigi: Brothership',
    slug: 'mario-and-luigi-brothership',
    releaseDate: '2026-11-07',
    releaseDateDisplay: 'November 7, 2026',
    platforms: ['Nintendo Switch', 'Nintendo Switch 2'],
    genre: 'RPG',
    developer: 'Nintendo / Acquire',
    publisher: 'Nintendo',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The Mario brothers set sail on Shipshape Island to explore the vast high-seas world of Concordia in a brand-new turn-based comedic RPG.',
    fullDescription: `The brothers return for an all-new nautical RPG journey! Set sail with Mario and Luigi on Shipshape Island (part ship, part island) through the vast ocean world of Concordia. Launch out of Shipshape’s cannon to visit diverse drift islands, utilize Bros. Moves to bypass terrain obstacles, and execute timing-based Bros. Attacks in turn-based combat.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 89,
    dataSource: 'Nintendo Direct Announcement',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Nintendo eShop', url: 'https://www.nintendo.com' }
    ]
  },
  {
    id: 'rel-ms-flight-sim-2024',
    title: 'Microsoft Flight Simulator 2024',
    slug: 'microsoft-flight-simulator-2024',
    releaseDate: '2026-11-19',
    releaseDateDisplay: 'November 19, 2026',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'Simulation',
    developer: 'Asobo Studio',
    publisher: 'Xbox Game Studios',
    cover: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Pursue your aviation career with aerial firefighting, search & rescue, commercial transport, and the most detailed digital twin of Earth ever built.',
    fullDescription: `Explore the globe with the most complex digital twin of Earth ever created. Featuring dynamically generated 3D procedural terrain, seasonal changes, live global air traffic, authentic weather simulations, and an authentic aviation career mode spanning helicopter medevac, VIP charters, air ambulances, and precision glider towing.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 93,
    dataSource: 'Xbox Games Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i7-6800K / AMD Ryzen 5 2600X',
      recCpu: 'Intel Core i7-10700K / AMD Ryzen 7 2700X',
      minGpu: 'NVIDIA GeForce GTX 970 / AMD Radeon RX 570',
      recGpu: 'NVIDIA GeForce RTX 2080 / AMD Radeon RX 6700 XT',
      minRam: '16 GB',
      recRam: '32 GB',
      storage: '50 GB SSD (Cloud Thin Client)'
    }
  },
  {
    id: 'rel-stalker-2',
    title: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl',
    slug: 'stalker-2-heart-of-chornobyl',
    releaseDate: '2026-11-20',
    releaseDateDisplay: 'November 20, 2026',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'Survival',
    developer: 'GSC Game World',
    publisher: 'GSC Game World',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Explore the vast Chornobyl Exclusion Zone full of dangerous mutants, deadly anomalies, and conflicting stalker factions in Unreal Engine 5.',
    fullDescription: `The Chornobyl Exclusion Zone has changed dramatically after the second massive explosion in 2006. Violent mutants, lethal anomalies, and warring factions have made the Zone a very tough place to survive. Tread a non-linear path through a dark sci-fi open world powered by Unreal Engine 5 and A-Life 2.0 simulation systems.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 96,
    dataSource: 'GSC Game World Official Announcement',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/1643320/STALKER_2_Heart_of_Chornobyl/' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'AMD Ryzen 5 1600X / Intel Core i5-7600K',
      recCpu: 'AMD Ryzen 7 3700X / Intel Core i7-9700K',
      minGpu: 'AMD Radeon RX 580 8GB / NVIDIA GeForce GTX 1060 6GB',
      recGpu: 'AMD Radeon RX 6700 XT / NVIDIA GeForce RTX 2070 Super',
      minRam: '8 GB',
      recRam: '16 GB',
      storage: '150 GB NVMe SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-indiana-jones',
    title: 'Indiana Jones and the Great Circle',
    slug: 'indiana-jones-and-the-great-circle',
    releaseDate: '2026-12-09',
    releaseDateDisplay: 'December 9, 2026',
    platforms: ['PC', 'Xbox Series X/S', 'PlayStation 5', 'Cloud Gaming'],
    genre: 'Action',
    developer: 'MachineGames',
    publisher: 'Bethesda Softworks',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Uncover one of history’s greatest mysteries in a first-person, single-player adventure set between Raiders of the Lost Ark and The Last Crusade.',
    fullDescription: `Developed by MachineGames (Wolfenstein series) and executive produced by Todd Howard, Indiana Jones and the Great Circle puts you behind the fedora and whip of cinema's most iconic archaeologist. Investigate stolen artifacts leading from the halls of Marshall College to Vatican catacombs, Egyptian pyramids, and sunken Himalayan temples in an authentic first-person adventure.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 95,
    dataSource: 'Xbox Games Showcase & Gamescom Opening Night',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2677660/Indiana_Jones_and_the_Great_Circle/' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-marvel-rivals',
    title: 'Marvel Rivals',
    slug: 'marvel-rivals',
    releaseDate: '2026-12-06',
    releaseDateDisplay: 'December 6, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Shooter',
    developer: 'NetEase Games',
    publisher: 'NetEase Games / Marvel Games',
    cover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'A fast-paced 6v6 Super Hero Team-Based PVP shooter featuring dynamic destructible environments and unique Team-Up combination abilities.',
    fullDescription: `Marvel Rivals is a 6v6 Super Hero team-based PvP shooter. Assemble an all-star Marvel squad, strategize with unique superpowers, combine abilities in dynamic Team-Up skills, and fight in ever-shifting, destructible battlegrounds across the Marvel Multiverse. Free-to-play with all heroes unlocked at launch.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 90,
    dataSource: 'NetEase Games Official Announcement',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2767030/Marvel_Rivals/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ]
  },

  // ==================== 2027 MAJOR UPCOMING RELEASES ====================
  {
    id: 'rel-civ-7',
    title: "Sid Meier's Civilization VII",
    slug: 'sid-meiers-civilization-vii',
    releaseDate: '2027-02-11',
    releaseDateDisplay: 'February 11, 2027',
    platforms: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Nintendo Switch 2'],
    genre: 'Strategy',
    developer: 'Firaxis Games',
    publisher: '2K Games',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The revolutionary next installment in the definitive 4X strategy series introducing distinct Historical Ages and decoupled Leaders and Civilizations.',
    fullDescription: `The award-winning strategy game franchise returns with a revolutionary new chapter. Rule as one of many visionary leaders from throughout history. Establish your civilization, construct cities and architectural wonders, expand your territory, conquer or cooperate with rival civilizations in pursuit of prosperity, and explore the far reaches of an uncharted world across distinct Antiquity, Exploration, and Modern Ages.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 96,
    dataSource: 'Firaxis Games & 2K Games Official Announcement',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2862700/Sid_Meiers_Civilization_VII/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-avowed',
    title: 'Avowed',
    slug: 'avowed',
    releaseDate: '2027-02-18',
    releaseDateDisplay: 'February 18, 2027',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'RPG',
    developer: 'Obsidian Entertainment',
    publisher: 'Xbox Game Studios',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Set in the fantasy world of Eora, investigate a mysterious spiritual plague threatening the uncharted Living Lands.',
    fullDescription: `Welcome to the Living Lands, a mysterious island full of adventure and danger. As an envoy of Aedyr, you are sent to investigate rumors of a spreading spiritual plague. Obsidian Entertainment crafts an intimate first-person fantasy RPG featuring dual-wielding combinations of grimoires, pistols, axes, and wands alongside deep companion affinities.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 92,
    dataSource: 'Xbox Games Showcase & Obsidian Dev Update',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2457220/Avowed/' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-monster-hunter-wilds',
    title: 'Monster Hunter Wilds',
    slug: 'monster-hunter-wilds',
    releaseDate: '2027-02-28',
    releaseDateDisplay: 'February 28, 2027',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Action',
    developer: 'Capcom',
    publisher: 'Capcom',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The unbridled force of nature runs wild in seamless living ecosystems with dynamic weather, herds of monsters, and Mount Seikret riding.',
    fullDescription: `The next generation in hunting action. Set in the Forbidden Lands, Monster Hunter Wilds introduces fully seamless transitions between base camps and hunts, dynamic shifting weather climates (Fallow, Inclemency, and Plenty), dual primary weapon loadouts mounted on your Seikret companion, and cinematic Wound System targeting.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 99,
    dataSource: 'Capcom Official Announcement & Summer Game Fest',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2246340/Monster_Hunter_Wilds/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i5-10600 / AMD Ryzen 5 3600',
      recCpu: 'Intel Core i5-11600K / AMD Ryzen 5 5600X',
      minGpu: 'NVIDIA GeForce GTX 1660 Super / AMD Radeon RX 5600 XT',
      recGpu: 'NVIDIA GeForce RTX 2070 Super / AMD Radeon RX 6700 XT',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '140 GB SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-doom-dark-ages',
    title: 'DOOM: The Dark Ages',
    slug: 'doom-the-dark-ages',
    releaseDate: '2027-05-15',
    releaseDateDisplay: 'May 15, 2027',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'Shooter',
    developer: 'id Software',
    publisher: 'Bethesda Softworks',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The prequel origin story of the DOOM Slayer in a brutal, cinematic dark fantasy setting featuring the Shield Saw and Mecha Atlan brawls.',
    fullDescription: `id Software presents the origin story of the Doom Slayer’s legendary fury. Set in an apocalyptic dark fantasy medieval setting before the events of DOOM (2016) and DOOM Eternal, players wield visceral grounded weaponry including the Shield Saw, Skull Crusher, and flails while commandeering giant Atlan mechs and piloting cybernetic dragons against demonic hordes.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 97,
    dataSource: 'Xbox Games Showcase & id Software Official',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-death-stranding-2',
    title: 'Death Stranding 2: On the Beach',
    slug: 'death-stranding-2-on-the-beach',
    releaseDate: '2027-06-20',
    releaseDateDisplay: 'June 20, 2027',
    platforms: ['PlayStation 5'],
    genre: 'Adventure',
    developer: 'Kojima Productions',
    publisher: 'Sony Interactive Entertainment',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Hideo Kojima presents Sam Porter Bridges’ next mission across the globe aboard the mobile base DHV Magellan alongside Fragile and Elle Fanning.',
    fullDescription: `Embark on an inspiring mission of human connection beyond the UCA. Sam — with companions by his side — sets out on a new journey to save humanity from extinction. Follow them as they traverse a world beset by otherworldly enemies, obstacles and a haunting question: Should we have connected? Directed and written by Hideo Kojima starring Norman Reedus, Léa Seydoux, Troy Baker, and Elle Fanning.`,
    status: 'Upcoming',
    isConfirmed: true,
    hypeScore: 98,
    dataSource: 'PlayStation State of Play & Kojima Productions',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'PlayStation Store', url: 'https://store.playstation.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-ghost-of-yotei',
    title: 'Ghost of Yōtei',
    slug: 'ghost-of-yotei',
    releaseDate: '2027-09-15',
    releaseDateDisplay: 'Q3 2027',
    platforms: ['PlayStation 5'],
    genre: 'Action',
    developer: 'Sucker Punch Productions',
    publisher: 'Sony Interactive Entertainment',
    cover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Sucker Punch’s spiritual successor to Ghost of Tsushima follows new protagonist Atsu around the untamed lands surrounding Mount Yōtei in 1603.',
    fullDescription: `Set in the year 1603, more than 300 years after the events of Ghost of Tsushima, Ghost of Yōtei centers on a new hero, Atsu, in the wild frontiers of Ezo (modern-day Hokkaido) encircling Mount Yōtei. Featuring wide-open grasslands, tundra landscapes, dual-katana swordsmanship, firearm integration, and deep cinematic samurai lore.`,
    status: 'Upcoming',
    isConfirmed: true,
    isEstimated: true,
    hypeScore: 98,
    dataSource: 'PlayStation State of Play September 2024 Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'PlayStation Store', url: 'https://store.playstation.com' }
    ],
    isMajorHighlight: true
  },
  {
    id: 'rel-gta-6',
    title: 'Grand Theft Auto VI',
    slug: 'grand-theft-auto-vi',
    releaseDate: '2027-10-15',
    releaseDateDisplay: 'Fall 2027',
    platforms: ['PlayStation 5', 'Xbox Series X/S'],
    genre: 'Action',
    developer: 'Rockstar Studios',
    publisher: 'Rockstar Games',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Return to Vice City in the state of Leonida. Lucia and Jason navigate high-stakes crime in the biggest open-world evolution in gaming history.',
    fullDescription: `Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet. Follow the dual-protagonist crime story of Lucia and Jason across swamps, beachfronts, urban skylines, and underground syndicates with unprecedented crowd density and physics fidelity.`,
    status: 'Upcoming',
    isConfirmed: true,
    isEstimated: true,
    hypeScore: 100,
    dataSource: 'Rockstar Games Official Announcement & Take-Two Interactive Earnings',
    lastUpdated: 'September 2026',
    officialWebsite: 'https://www.rockstargames.com/VI',
    trailerUrl: 'https://www.youtube.com/watch?v=QdBZY2fkU-0',
    isMajorHighlight: true
  },

  // ==================== DELAYED GAMES (PRESERVING HISTORY) ====================
  {
    id: 'rel-ac-shadows',
    title: "Assassin's Creed Shadows",
    slug: 'assassins-creed-shadows',
    releaseDate: '2027-02-14',
    releaseDateDisplay: 'February 14, 2027',
    previousReleaseDate: 'November 15, 2026',
    delayReason: 'Ubisoft delayed the title to incorporate community feedback, polish the stealth sandbox, and ensure a simultaneous Day-1 Steam launch.',
    dateChanged: 'September 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'Action',
    developer: 'Ubisoft Quebec',
    publisher: 'Ubisoft',
    cover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Live the intertwined stories of Naoe, an adept shinobi Assassin, and Yasuke, a powerful legendary samurai in late Sengoku period Japan.',
    fullDescription: `Experience the intertwined stories of Naoe, an adept shinobi Assassin from the Iga Province, and Yasuke, the powerful African samurai of historical legend. Against the backdrop of the turbulent late Sengoku period, this remarkable duo will discover their common destiny as they usher in a new era for Japan. Features dynamic season changes, destructible environments, and light/shadow stealth systems.`,
    status: 'Delayed',
    isConfirmed: true,
    hypeScore: 90,
    dataSource: 'Ubisoft Official Press Release',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ]
  },
  {
    id: 'rel-bloodlines-2',
    title: 'Vampire: The Masquerade – Bloodlines 2',
    slug: 'vampire-the-masquerade-bloodlines-2',
    releaseDate: '2027-06-30',
    releaseDateDisplay: 'Q2 2027',
    previousReleaseDate: 'October 2026',
    delayReason: 'The Chinese Room and Paradox Interactive announced a delay to expand narrative endings, refine visceral clan combat, and deepen roleplay branching.',
    dateChanged: 'August 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'RPG',
    developer: 'The Chinese Room',
    publisher: 'Paradox Interactive',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Awake as an Elder vampire stalking modern winter Seattle on the brink of an open supernatural civil war.',
    fullDescription: `You are Phyre, an Elder vampire awakened in Seattle amidst a power vacuum. Choose your clan, command blood sorcery and brute strength, maintain the delicate Masquerade, and unravel the supernatural conspiracy threatening to tear the Emerald City apart.`,
    status: 'Delayed',
    isConfirmed: true,
    hypeScore: 82,
    dataSource: 'Paradox Interactive Dev Diary Update',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/532790/Vampire_The_Masquerade__Bloodlines_2/' }
    ]
  },
  {
    id: 'rel-little-nightmares-3',
    title: 'Little Nightmares III',
    slug: 'little-nightmares-iii',
    releaseDate: '2027-03-31',
    releaseDateDisplay: 'Q1 2027',
    previousReleaseDate: '2025 / Late 2026',
    delayReason: 'Supermassive Games shifted the release window to ensure the 2-player online co-op puzzle pacing matches the iconic dread of the first two installments.',
    dateChanged: 'May 2026',
    platforms: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch'],
    genre: 'Horror',
    developer: 'Supermassive Games',
    publisher: 'Bandai Namco Entertainment',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Embark on a new atmospheric horror adventure in the Spiral. Play solo with AI companion or with a friend in online co-op as Low and Alone.',
    fullDescription: `In Little Nightmares III, you follow the journey of Low & Alone, as they search for a path that could lead them out of the Nowhere. Trapped within the Spiral, a cluster of disturbing places, the two friends will have to work together to survive in a dangerous world full of delusions and escape the grasp of an even greater threat lurking in the shadows.`,
    status: 'Delayed',
    isConfirmed: true,
    hypeScore: 88,
    dataSource: 'Bandai Namco Press Release',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/1392860/Little_Nightmares_III/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' }
    ]
  },

  // ==================== TBA / ANNOUNCED (NO GUESSED DATES) ====================
  {
    id: 'rel-witcher-4',
    title: 'The Witcher 4 (Project Polaris)',
    slug: 'the-witcher-4-project-polaris',
    releaseDate: 'TBA',
    releaseDateDisplay: 'TBA (In Active Production)',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'RPG',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt RED',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The dawn of a new saga in the Witcher universe built in Unreal Engine 5 focusing on the School of the Lynx.',
    fullDescription: `Project Polaris begins a brand-new multi-game saga in the Witcher franchise. Transitioning from REDengine to Unreal Engine 5, CD Projekt RED is pushing state-of-the-art open-world worldbuilding, monster hunting ecology, and rich choice-and-consequence roleplaying. Exact release window has not been officially dated.`,
    status: 'TBA',
    isConfirmed: false,
    hypeScore: 99,
    dataSource: 'CD Projekt RED Financial Earnings & Official Teaser',
    lastUpdated: 'September 2026',
    officialWebsite: 'https://www.thewitcher.com'
  },
  {
    id: 'rel-elder-scrolls-6',
    title: 'The Elder Scrolls VI',
    slug: 'the-elder-scrolls-vi',
    releaseDate: 'TBA',
    releaseDateDisplay: 'TBA (Development Ongoing)',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'RPG',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The highly anticipated next chapter in the legendary Elder Scrolls franchise from Todd Howard and Bethesda Game Studios.',
    fullDescription: `The successor to The Elder Scrolls V: Skyrim. Following the launch of Starfield, Bethesda Game Studios transitioned its core team into active production on The Elder Scrolls VI. Built on an evolved Creation Engine with next-generation procedural landscaping and radiant AI. Confirmed as in development with no official release date announced.`,
    status: 'TBA',
    isConfirmed: false,
    hypeScore: 99,
    dataSource: 'Bethesda Softworks E3 Announcement',
    lastUpdated: 'September 2026'
  },
  {
    id: 'rel-judas',
    title: 'Judas',
    slug: 'judas',
    releaseDate: 'TBA',
    releaseDateDisplay: 'TBA (Expected 2027)',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Shooter',
    developer: 'Ghost Story Games',
    publisher: 'Take-Two Interactive',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'A single-player narrative first-person shooter from Ken Levine, creative director of System Shock 2, BioShock, and BioShock Infinite.',
    fullDescription: `A disintegrating starship. A desperate escape plan. You are the mysterious and troubled Judas. Your only hope for survival is to make or break alliances with your worst enemies. Ken Levine pioneers "narrative LEGOs" where every action dynamically adjusts character motivations, dialogue reactivity, and spaceship infrastructure.`,
    status: 'TBA',
    isConfirmed: false,
    hypeScore: 93,
    dataSource: 'The Game Awards & PlayStation State of Play',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/388880/Judas/' }
    ]
  },
  {
    id: 'rel-marvel-wolverine',
    title: "Marvel's Wolverine",
    slug: 'marvels-wolverine',
    releaseDate: 'TBA',
    releaseDateDisplay: 'TBA',
    platforms: ['PlayStation 5'],
    genre: 'Action',
    developer: 'Insomniac Games',
    publisher: 'Sony Interactive Entertainment',
    cover: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Insomniac Games crafts a standalone, mature-rated action adventure starring Marvel’s mutant weapon Logan.',
    fullDescription: `Directed by Brian Horton and Cameron Christian, Marvel’s Wolverine delivers an emotional and visceral standalone narrative centered on Logan’s bloody past in Madripoor and Canada. Features brutal melee combat, regenerative health mechanics, and acute feral tracking senses. In active development for PlayStation 5.`,
    status: 'TBA',
    isConfirmed: false,
    hypeScore: 97,
    dataSource: 'PlayStation Showcase Official Teaser',
    lastUpdated: 'September 2026'
  },
  {
    id: 'rel-metroid-prime-4',
    title: 'Metroid Prime 4: Beyond',
    slug: 'metroid-prime-4-beyond',
    releaseDate: 'TBA',
    releaseDateDisplay: 'TBA 2026/2027',
    platforms: ['Nintendo Switch', 'Nintendo Switch 2'],
    genre: 'Adventure',
    developer: 'Retro Studios',
    publisher: 'Nintendo',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Samus Aran touches down on a mysterious alien research facility confronted by Sylux in Retro Studios’ long-awaited first-person masterwork.',
    fullDescription: `The galaxy’s greatest bounty hunter Samus Aran returns. Metroid Prime 4: Beyond features expansive alien ecology scanning, precision lock-on beam combat, Morph Ball spatial puzzle solving, and a fierce confrontation against renegade bounty hunter Sylux and Space Pirate forces.`,
    status: 'TBA',
    isConfirmed: true,
    isEstimated: true,
    hypeScore: 97,
    dataSource: 'Nintendo Direct Gameplay Reveal',
    lastUpdated: 'September 2026'
  },
  {
    id: 'rel-clockwork-revolution',
    title: 'Clockwork Revolution',
    slug: 'clockwork-revolution',
    releaseDate: 'TBA',
    releaseDateDisplay: 'TBA',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'RPG',
    developer: 'inXile Entertainment',
    publisher: 'Xbox Game Studios',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'A time-bending steampunk first-person RPG set in the vibrant metropolis of Avalon from the creators of Wasteland 3.',
    fullDescription: `In the steam-powered Victorian metropolis of Avalon, the wealthy Lady Ironwood ruthlessly maintains power by altering historical timeline events. Using a device known as the Chronometer, you travel back in time, influence key events, and witness staggering butterfly-effect consequences reshape the city in real-time.`,
    status: 'TBA',
    isConfirmed: false,
    hypeScore: 89,
    dataSource: 'Xbox Games Showcase',
    lastUpdated: 'September 2026'
  },

  // ==================== RECENTLY RELEASED GAMES (LAST 30-90 DAYS) ====================
  {
    id: 'rel-black-myth-wukong',
    title: 'Black Myth: Wukong',
    slug: 'black-myth-wukong',
    releaseDate: '2026-08-20',
    releaseDateDisplay: 'August 20, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    genre: 'Action',
    developer: 'Game Science',
    publisher: 'Game Science',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Journey to the West in a landmark action RPG rooted in Chinese mythology featuring the Destined One and magical staff transformations.',
    fullDescription: `Black Myth: Wukong is an action RPG rooted in Chinese mythology. The story is based on Journey to the West, one of the Four Great Classical Novels of Chinese literature. You set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 98,
    dataSource: 'Steam & PlayStation Official Launch',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/2358720/Black_Myth_Wukong/' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' }
    ],
    systemRequirements: {
      minCpu: 'Intel Core i5-8400 / AMD Ryzen 5 1600',
      recCpu: 'Intel Core i7-9700 / AMD Ryzen 5 5500',
      minGpu: 'NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580',
      recGpu: 'NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT',
      minRam: '16 GB',
      recRam: '16 GB',
      storage: '130 GB SSD'
    },
    isMajorHighlight: true
  },
  {
    id: 'rel-star-wars-outlaws',
    title: 'Star Wars Outlaws',
    slug: 'star-wars-outlaws',
    releaseDate: '2026-08-30',
    releaseDateDisplay: 'August 30, 2026',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'Adventure',
    developer: 'Massive Entertainment',
    publisher: 'Ubisoft / Lucasfilm Games',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'The first-ever open world Star Wars game, set between The Empire Strikes Back and Return of the Jedi. Play as scoundrel Kay Vess.',
    fullDescription: `Experience the first-ever open-world Star Wars game. Play as scoundrel Kay Vess and her merqaal companion Nix as they attempt one of the greatest heists the Outer Rim has ever seen. Gamble, steal, and outwit criminal syndicates like the Pykes, Crimson Dawn, and the Hutts across Toshara, Tatooine, and Kijimi.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 89,
    dataSource: 'Ubisoft Forward & Lucasfilm Games',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Ubisoft Store' as any, url: 'https://store.ubi.com' },
      { store: 'PlayStation Store', url: 'https://store.playstation.com' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ]
  },
  {
    id: 'rel-age-of-mythology-retold',
    title: 'Age of Mythology: Retold',
    slug: 'age-of-mythology-retold',
    releaseDate: '2026-09-04',
    releaseDateDisplay: 'September 4, 2026',
    platforms: ['PC', 'Xbox Series X/S', 'Cloud Gaming'],
    genre: 'Strategy',
    developer: 'World’s Edge / Forgotten Empires',
    publisher: 'Xbox Game Studios',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    shortDescription: 'Gods, monsters, and mortals collide in a definitive remake featuring modern 3D graphics, rebalanced god powers, and 50-mission campaign.',
    fullDescription: `From the creators of the award-winning Age of Empires franchise, Age of Mythology: Retold goes beyond history into a mythical age where gods, monsters, and humans collide. Combining the best elements of the beloved Age of Mythology with modern real-time strategy design and visuals, Retold is an epic and innovative experience for players old and new alike.`,
    status: 'Released',
    isConfirmed: true,
    hypeScore: 90,
    dataSource: 'Xbox Games Showcase',
    lastUpdated: 'September 2026',
    storeLinks: [
      { store: 'Steam', url: 'https://store.steampowered.com/app/1934680/Age_of_Mythology_Retold/' },
      { store: 'Xbox Store', url: 'https://www.xbox.com' }
    ]
  }
];

export function getReleasesForDate(dateStr: string): GameRelease[] {
  return GAME_RELEASES_DATABASE.filter(r => r.releaseDate === dateStr);
}

export function getReleasesForMonth(year: number, month: number): GameRelease[] {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  return GAME_RELEASES_DATABASE.filter(r => r.releaseDate.startsWith(monthStr));
}

export function getDelayedReleases(): GameRelease[] {
  return GAME_RELEASES_DATABASE.filter(r => r.status === 'Delayed');
}

export function getTbaReleases(): GameRelease[] {
  return GAME_RELEASES_DATABASE.filter(r => r.status === 'TBA');
}

export function getReleasesToday(): GameRelease[] {
  // Current app date is 2026-09-24
  return GAME_RELEASES_DATABASE.filter(r => r.releaseDate === '2026-09-24');
}

export function getReleasesThisWeek(): GameRelease[] {
  // Current app week: 2026-09-21 to 2026-09-27
  return GAME_RELEASES_DATABASE.filter(r => {
    return r.releaseDate >= '2026-09-21' && r.releaseDate <= '2026-09-27';
  }).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
}
