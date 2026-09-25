import { Video, Game, Article, Review, Guide, ForumTopic, UserAccount, ForumCategory } from '../types';
import { YOUTUBE_CHANNEL } from '../lib/constants';

export { YOUTUBE_CHANNEL };

export const INITIAL_USER: UserAccount = {
  id: 'usr_gv_01',
  name: 'VaultOperative',
  username: '@VaultOperative',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  badge: 'Vault Pioneer',
  reputation: 0,
  joinDate: 'Jan 2025',
  bookmarks: {
    videos: [],
    games: [],
    articles: [],
    reviews: [],
    guides: [],
    topics: []
  },
  releaseWatchlist: [],
  releaseReminders: {},
  likedIds: [],
  stats: {
    likesCount: 0,
    commentsCount: 0,
    savesCount: 0,
    topicsCount: 0
  }
};

export const DEFAULT_USER = INITIAL_USER;

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'vid-pubg-morning',
    title: 'Enjoying PUBG Mobile on a Good Morning',
    shortDescription: 'Morning battle royale drops, hot loot rotations, tactical positioning, and squad survival in PUBG Mobile.',
    description: 'Starting the day with some intense battle royale action in PUBG Mobile! Dropping in hot, securing early high-tier loot, tactical circle positioning, and squad survival gunfights on the battlegrounds. Official gameplay presentation from the Game Vault channel.',
    game: 'PUBG Mobile',
    uploadDate: 'Just now',
    views: '1',
    duration: '11:45',
    youtubeId: 'O4jKXRh0HEY',
    youtubeUrl: 'https://youtu.be/O4jKXRh0HEY',
    category: 'Gameplay',
    isFeatured: true,
    thumbnail: 'https://i.ytimg.com/vi/O4jKXRh0HEY/maxresdefault.jpg',
    likes: 18,
    summary: `In this morning PUBG Mobile session, the tactical focus centers on early drop discipline, weapon recoil management with touch controls, and smart transition timing between shrinking blue zones. 

The video opens with a hot-drop into high-density military compounds, demonstrating rapid looting cycles and audio cue tracking to pinpoint hostile footsteps. From there, the gameplay shifts toward vehicle rotations, perimeter clearing, and high-ground dominance during late-circle collapses, culminating in high-stakes squad firefights where precision utility usage (smoke screens and stun grenades) makes the difference between elimination and a chicken dinner.`,
    keyTakeaways: [
      'Hot-drop survival hinges on immediate sidearm acquisition and pre-aiming corridor choke points before entering buildings.',
      'Vehicle rotation speed significantly reduces vulnerability to sniper ambushes when repositioning across open terrain.',
      'Late-circle boundary discipline: Hugging the slow side of the blue zone minimizes third-party exposure.',
      'Utility management: Deploying defensive smoke corridors enables safe revives and tactical flank resets.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'Morning Drop & Compound Looting' },
      { timestamp: '03:15', title: 'First Contact & Recoil Control' },
      { timestamp: '06:40', title: 'Vehicle Rotation to Safe Zone' },
      { timestamp: '09:10', title: 'Final Circle Firefight & Squad Finish' }
    ]
  },
  {
    id: 'vid-1',
    title: 'Elden Ring: Shadow of the Erdtree — Ultimate Deep Dive & Lore Analysis',
    shortDescription: 'Unpacking the mysterious Realm of Shadow, Messmer the Impaler, and the mechanical evolution of FromSoftware boss design.',
    description: 'Welcome back to Game Vault Forum! In this comprehensive deep dive, we break down FromSoftware’s massive expansion: dissecting map verticality, scadutree blessing mechanics, boss balance, and lore secrets hidden in the Gravesite Plain.',
    game: 'Elden Ring',
    uploadDate: '3 days ago',
    views: '0',
    duration: '24:18',
    youtubeId: 'dItxHJtIarI',
    youtubeUrl: 'https://youtu.be/dItxHJtIarI?si=EvbfQFUlA8uRQNeF',
    category: 'Deep Dive',
    thumbnail: 'https://i.ytimg.com/vi/dItxHJtIarI/maxresdefault.jpg',
    likes: 0,
    summary: `This comprehensive video deep-dive provides an exhaustive tactical and narrative deconstruction of FromSoftware's landmark expansion, "Shadow of the Erdtree". 

The analysis begins by breaking down the geographical architecture of the Land of Shadow — examining how Hidetaka Miyazaki and the design team leveraged multi-tiered vertical density to interweave subterranean grottos, soaring castle spires, and hidden precipices without traditional loading barriers. 

The video then moves directly into core mechanical progression: explaining why traditional Rune Levels yield diminished returns and demonstrating how Scadutree Fragments and Revered Spirit Ashes establish a dedicated localized leveling curve. 

Crucially, the breakdown examines high-tier boss encounters including Messmer the Impaler, Rellana Twin Moon Knight, and Promised Consort Radahn. The presenter evaluates attack telegraphs, frame delays, and stamina consumption windows, providing concrete advice on defensive talisman loadouts, deflect tear timings, and the tactical viability of new weapon archetypes like Light Greatswords, Hand-to-Hand Arts, and Backhand Blades.`,
    keyTakeaways: [
      'Scadutree Blessing scaling provides flat percentage bonuses to outgoing damage and incoming damage mitigation that far outweigh base Vigor past soft-caps.',
      'Map interconnectivity: Ancient ruins and coffin-waterfall elevators link seemingly unreachable chasms to early Gravesite Plain sectors.',
      'Defensive build synergy: Stacking holy and fire damage negation talismans (Dragoncrest Greatshield, Golden Braid) is mandatory for surviving endgame combos.',
      'New weapon archetypes like Backhand Blades offer invulnerability frames and hyper-armor that bypass traditional boss reach advantages.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'Introduction: The Shadow Realm Paradigm' },
      { timestamp: '04:12', title: 'Scadutree Blessings vs Rune Level Scaling' },
      { timestamp: '10:45', title: 'Boss Mechanics: Messmer & Rellana Patterns' },
      { timestamp: '17:30', title: 'Lore of Miquella, St. Trina & Marika’s Crusade' },
      { timestamp: '21:50', title: 'Final Verdict & Endgame Build Balance' }
    ]
  },
  {
    id: 'vid-2',
    title: 'Why World of Warships Is More Interesting Than I Expected — Tactical Analysis',
    shortDescription: 'A modern breakdown of positioning, concealment range, and shell ballistic calculations in naval warfare simulation.',
    description: 'We tested over 200 hours of high-tier naval battles to understand why World of Warships has sustained a fiercely loyal tactical player base for a decade.',
    game: 'World of Warships',
    uploadDate: '1 week ago',
    views: '0',
    duration: '18:45',
    youtubeId: 'KNl4LrsXdIc',
    youtubeUrl: 'https://youtu.be/KNl4LrsXdIc?si=fyvC0or1U1pl1kvZ',
    category: 'Gameplay',
    thumbnail: 'https://i.ytimg.com/vi/KNl4LrsXdIc/maxresdefault.jpg',
    likes: 0,
    summary: `This tactical analysis explores the surprising mathematical and strategic depth beneath World of Warships, illustrating why patient positioning and ballistic knowledge triumph over twitch reflexes.

The video dismantles the naval combat loop across three interlocking pillars: Information Warfare, Ballistic Geometry, and Fleet Synergy. The analysis showcases how concealment detection circles dictate the flow of battle, demonstrating why a stealthy destroyer providing spotting without firing its main batteries creates more team leverage than an isolated battleship chasing vanity damage numbers.

The presenter dives into the physics of naval artillery: explaining the 14.3 caliber overmatch rule, armor angling thresholds (the crucial 30° ricochet boundary), and the difference between high-explosive fires that melt superstructure health vs armor-piercing citadel penetrations that delete ships in single salvos. The video concludes with tactical map control lessons, emphasizing crossfire creation, island cover utilization, and the fatal consequences of pushing into unspotted torpedo lanes.`,
    keyTakeaways: [
      'Concealment is weapon #1: Staying undetected forces enemies to reveal their angles while allowing your team to dictate engagement range.',
      'Armor Angling: Bow-in or angled kiting (30° to 45°) bounces incoming AP shells, whereas turning broadside invites lethal citadel penetrations.',
      'The 14.3 Overmatch Rule: Dividing shell millimeter diameter by 14.3 determines whether your rounds ignore target plate angles completely.',
      'Crossfires Win Games: Two ships positioned at diverging angles force the opponent to expose their broadside to at least one attacker.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'First Impressions vs Tactical Reality' },
      { timestamp: '03:40', title: 'Concealment Circles & Vision Control' },
      { timestamp: '08:15', title: 'Ballistics, Armor Angling & Citadel Hits' },
      { timestamp: '13:00', title: 'Cruiser Survival & Destroyer Spotting' },
      { timestamp: '16:20', title: 'Establishing Winning Fleet Crossfires' }
    ]
  },
  {
    id: 'vid-3',
    title: 'Cyberpunk 2077 in 2026: The Complete Overhaul Journey & Mod Ecosystem',
    shortDescription: 'From redemption arc to gold standard — evaluating Night City after patch 2.1, Phantom Liberty, and community ray-tracing shaders.',
    description: 'Looking back at the greatest turnarounds in modern gaming history. How CD Projekt RED re-engineered character perks, police AI, and dogtown vertical combat.',
    game: 'Cyberpunk 2077',
    uploadDate: '2 weeks ago',
    views: '0',
    duration: '21:04',
    youtubeId: 'frZXZqE3xOY',
    youtubeUrl: 'https://youtu.be/frZXZqE3xOY?si=42WlmMWJ_-50Fdqm',
    category: 'Review',
    thumbnail: 'https://i.ytimg.com/vi/frZXZqE3xOY/maxresdefault.jpg',
    likes: 0,
    summary: `An insightful retrospective detailing the remarkable evolutionary journey of Cyberpunk 2077 from its troubled 2020 launch to becoming the undisputed gold standard of modern open-world RPG tech and kinetic combat.

The video conducts a thorough audit of the transformative systems introduced in Update 2.0, Update 2.1, and the Phantom Liberty expansion. The presenter breaks down the total overhaul of the cyberware capacity meter (which prevents cyberpsychosis while rewarding chrome investment), the re-engineered skill trees that enable hyper-fluid air dashing and katana bullet reflection, and the high-octane vehicular combat system complete with weaponized vehicles and mounted rocket pods.

The latter half of the video provides an in-depth graphical benchmark and modding showcase. It examines real-time Path Tracing (Full Ray Tracing) running alongside DLSS 3.7 Ray Reconstruction and AMD FSR 3.1, while highlighting essential 2026 community mods that expand Night City’s immersion, crowd AI behaviors, and audio fidelity.`,
    keyTakeaways: [
      'The 2.0 Perk Tree redesign shifted combat from passive percentage stat boosts into active kinetic mechanics like air dash, deflecting bullets, and finisher chains.',
      'Cyberware Capacity introduces tactical trade-offs, encouraging players to choose between raw armor plating and cyberdeck RAM overclocking.',
      'Phantom Liberty’s Dogtown showcases CD Projekt RED’s peak level design, featuring tight vertical layers and brutal combat gauntlets.',
      'Path Tracing visual benchmark: Full ray tracing transforms Night City into the most photorealistic architectural simulation in interactive entertainment.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'The Redemption Arc of Night City' },
      { timestamp: '04:30', title: 'Perk 2.0 Overhaul & Kinetic Combat Mechanics' },
      { timestamp: '09:50', title: 'Dogtown Level Design & Phantom Liberty Espionage' },
      { timestamp: '14:20', title: 'Path Tracing & Hardware Benchmark Breakdown' },
      { timestamp: '18:40', title: 'Top Essential Community Mods in 2026' }
    ]
  },
  {
    id: 'vid-4',
    title: 'Helldivers 2 — Galactic War Strategy & Team Mechanics Masterclass',
    shortDescription: 'Coordinated stratagem synergy, armor piercing damage tiers, and supply management for Super Helldive difficulty.',
    description: 'Galactic liberation requires precision teamwork. We examine stratagem cooldowns, staggered reload tactics, and optimal counter-measures for Automatons and Terminids.',
    game: 'Helldivers 2',
    uploadDate: '3 weeks ago',
    views: '0',
    duration: '16:30',
    youtubeId: '34vKXzQ6maU',
    youtubeUrl: 'https://youtu.be/34vKXzQ6maU?si=gxtt8Bqrqgsogb9X',
    category: 'Guide',
    thumbnail: 'https://i.ytimg.com/vi/34vKXzQ6maU/maxresdefault.jpg',
    likes: 0,
    summary: `A high-level tactical masterclass focusing on squad coordination, loadout synergy, and mechanical optimization required to conquer Super Helldive (Difficulty 10) on both the Automaton and Terminid galactic war fronts.

The video deconstructs how enemy armor classes function behind the scenes, highlighting the distinction between Light, Medium, Heavy, and Tank armor values. The presenter demonstrates why random stratagem selection causes squad wipes, and offers structured four-player loadout templates: pairing dedicated anti-tank specialists (carrying Quasar Cannons or Recoilless Rifles with crew-served team reloaders) with horde-clear crowd controllers and orbital bombardment coordinators.

Tactical movement is given deep attention: the guide demonstrates staggered bounding withdrawals under heavy fire, proper sentry turret placement along elevated sightlines to avoid friendly fire casualties, and strategic radar tower prioritization to reveal objective coordinates and hidden super uranium sample spawns before patrol alerts trigger breach loops.`,
    keyTakeaways: [
      'Crew-Assisted Reloading: When a teammate carries the ammunition backpack for a Recoilless Rifle or Autocannon, reload speed increases by over 400%.',
      'Armor Penetration Thresholds: Shots that match enemy armor deal 50% damage with deflection sparks; shots that exceed armor deal 100% full damage.',
      'Sentry Placement: Mount Autocannon and EMS mortars behind solid rock formations to prevent enemies from targeting them with direct-fire rockets.',
      'Patrol Manipulation: Triggering a bug breach or bot drop at a minor point of interest clears the primary objective site of reinforcements.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'The Anatomy of Super Helldive Difficulty' },
      { timestamp: '03:15', title: 'Armor Penetration & Damage Tier Mechanics' },
      { timestamp: '07:20', title: 'Team-Assisted Weapon Reloads & Synergy' },
      { timestamp: '11:40', title: 'Automaton vs Terminid Counter-Strategies' },
      { timestamp: '14:30', title: 'Extraction Discipline & Sample Securing' }
    ]
  },
  {
    id: 'vid-5',
    title: 'The Return of Classic RPGs: Baldur’s Gate 3 Two Years Later',
    shortDescription: 'Evaluating the lasting industry ripples of Larian Studios, CRPG turn-based depth, and player narrative freedom.',
    description: 'A deep reflection on what makes BG3 so endlessly replayable. Exploring Act 3 permutations, companion reactivities, and the bar set for future roleplaying titles.',
    game: "Baldur's Gate 3",
    uploadDate: '1 month ago',
    views: '0',
    duration: '28:12',
    youtubeId: 'xfjeRkiIqSI',
    youtubeUrl: 'https://youtu.be/xfjeRkiIqSI?si=oxkR9qGj4d94siov',
    category: 'Deep Dive',
    thumbnail: 'https://i.ytimg.com/vi/xfjeRkiIqSI/maxresdefault.jpg',
    likes: 0,
    summary: `An extensive retrospective essay exploring the enduring cultural and design legacy of Baldur’s Gate 3, analyzing how Larian Studios revitalized the classic CRPG genre and set a staggering benchmark for narrative reactivity and player agency.

The video reflects on the systemic freedom enabled by adapting Dungeons & Dragons 5th Edition rules into an interactive 3D simulation. The analysis highlights how player ingenuity with spatial physics — such as stacking crates to gain high-ground advantage, electrifying water surfaces with lightning spells, or pickpocketing quest items to trigger unforeseen story resolutions — replaces scripted quest logic with true tabletop improvisation.

Furthermore, the video analyzes the rich emotional architecture of companion story arcs (Shadowheart, Astarion, Gale, Lae'zel), contrasting Act 1's tight wilderness sandbox with the staggering computational complexity of Act 3's urban sprawl. The presenter discusses the game's commercial and artistic triumph as proof that audiences crave unapologetically deep, complex, single-player roleplaying adventures without aggressive live-service monetization.`,
    keyTakeaways: [
      'Systemic Environmental Chemistry: Water conducts electricity, grease catches fire, and ice causes prone status — turning arenas into dynamic puzzle boxes.',
      'Unprecedented Narrative Branching: Every dialogue check, failed roll, and character death reshapes dozens of hours of subsequent dialogue.',
      'Action Economy Mastery: Leveraging Bonus Actions (shove, potions, misty step) dictates combat momentum in Honor Mode far more than raw spell slots.',
      'The Larian Legacy: A triumphant repudiation of predatory monetization, proving that passion and craft yield historic commercial longevity.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'The CRPG Renaissance & Tabletop Freedom' },
      { timestamp: '05:40', title: 'Systemic Combat: Physics, Spells & Chemistry' },
      { timestamp: '12:15', title: 'Companion Writing & Moral Ambiguity' },
      { timestamp: '19:50', title: 'Act 3 Complexity & Urban Architecture' },
      { timestamp: '25:00', title: 'The Lasting Legacy for the Gaming Industry' }
    ]
  },
  {
    id: 'vid-6',
    title: 'PC Gaming Optimization: Eliminating Micro-Stutter and Frame Pacing Drops',
    shortDescription: 'Practical tweaks for NVIDIA Reflex, AMD Anti-Lag, shader cache preloading, and Windows timer resolution.',
    description: 'Step-by-step benchmark testing across 5 demanding AAA engines to unlock buttery smooth 144Hz+ gameplay without sacrificing visual fidelity.',
    game: 'PC Tech / Hardware',
    uploadDate: '1 month ago',
    views: '0',
    duration: '19:22',
    youtubeId: 'YWTZkB9rVU0',
    youtubeUrl: 'https://youtu.be/YWTZkB9rVU0?si=9z84E9flCjxAWCbO',
    category: 'Tech',
    thumbnail: 'https://i.ytimg.com/vi/YWTZkB9rVU0/maxresdefault.jpg',
    likes: 0,
    summary: `A rigorous, hardware-benchmarked engineering guide dedicated to identifying and eliminating the root causes of micro-stutter, inconsistent frame pacing, and sudden 0.1% low frame drops in modern PC gaming.

The video cuts through superstitious "snake oil" PC tweaks to focus on empirically verified technical adjustments. The presenter begins by clarifying the fundamental difference between average frame rates (FPS) and frame delivery time (measured in milliseconds), illustrating how a 120 FPS game with erratic 30ms spikes feels significantly jerkier than a consistent, flat 90 FPS line.

The guide walks viewers through:
1. NVIDIA Reflex and AMD Anti-Lag 2 low-latency implementations that align CPU draw calls directly with GPU rendering passes.
2. The critical role of shader cache sizing (setting NVIDIA Shader Cache Size to 10GB or 100GB in the control panel to eliminate DirectX 12 traversal stutters).
3. Precision framerate capping using RTSS (RivaTuner Statistics Server) or in-engine limiters set exactly 3 FPS below the monitor's G-Sync/FreeSync refresh ceiling.
4. Windows Hardware-Accelerated GPU Scheduling (HAGS) calibration, memory XMP/EXPO stability verification, and USB polling rate trade-offs.`,
    keyTakeaways: [
      'Frame Pacing vs Raw FPS: Consistent frame delivery time (e.g. 16.6ms for 60Hz or 6.94ms for 144Hz) is far more important for perceived smoothness than high average FPS.',
      'Shader Cache Size: Expanding GPU driver shader cache to 10GB+ completely eliminates shader compilation stutters when loading new game zones.',
      'G-Sync / FreeSync Cap Rule: Always cap framerate 3 FPS below native display refresh (e.g. 141 FPS for 144Hz, 162 FPS for 165Hz) to keep G-Sync actively engaged without V-Sync input lag.',
      'Windows HAGS & Game Mode: Keeping Windows Game Mode enabled ensures dedicated CPU core allocation to gaming processes.'
    ],
    chapters: [
      { timestamp: '00:00', title: 'Why Average FPS Is a Misleading Metric' },
      { timestamp: '03:10', title: 'Measuring Frame Times & 0.1% Lows' },
      { timestamp: '07:30', title: 'NVIDIA Reflex & AMD Anti-Lag Configuration' },
      { timestamp: '11:45', title: 'Shader Cache Expansion (DirectX 12 Fix)' },
      { timestamp: '15:20', title: 'G-Sync, FreeSync & Precision RTSS Capping' }
    ]
  }
];

export const MOCK_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Elden Ring: Shadow of the Erdtree',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    shortDescription: 'Guided by Empyrean Miquella, players are beckoned to the Land of Shadow, a layered realm obscured by the Erdtree.',
    fullDescription: `FromSoftware's monumental expansion sets a new high-water mark for role-playing expansions, delivering a standalone-quality campaign woven seamlessly into a sprawling, vertically intricate subterranean and highland map. The Land of Shadow strips away complacency: legacy dungeons like Belurat, Tower Settlement and the towering Keep of Shadow demand methodical reconnaissance, sharp spatial awareness, and acute timing discipline.

Mechanically, the expansion introduces eight innovative weapon archetypes — including hand-to-hand martial arts, throwing blades, light greatswords, and perfume bottles — dramatically broadening build diversity. To counter late-game power creep, FromSoftware instituted the Scadutree Fragment and Revered Spirit Ash progression system, creating a regional leveling curve that rewards relentless exploration over mindless rune farming.

The artistic direction and audio composition remain unmatched in modern dark fantasy. Intricate environmental storytelling unpacks the tragic crusade of Messmer the Impaler and the mysterious ascension of Miquella, cementing Shadow of the Erdtree as one of the finest expansions in gaming history.`,
    releaseYear: '2024',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    rating: 9.8,
    artwork: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    tags: ['Soulslike', 'Open World', 'Dark Fantasy', 'Masterpiece', 'Hardcore RPG'],
    featured: true
  },
  {
    id: 'game-2',
    title: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    shortDescription: 'A gripping espionage-thriller expansion set in the lawless combat zone of Dogtown featuring Idris Elba as Solomon Reed.',
    fullDescription: `Phantom Liberty transforms CD Projekt RED’s dystopian sandbox into an intense, cinematic spy thriller. Thrust into the walled sovereign enclave of Dogtown — a militarized haven governed by warlord Kurt Hansen — mercenary V is ensnared in a web of government deception, corporate treason, and personal sacrifice alongside FIA sleeper agent Solomon Reed.

Coupled with the revolutionary Update 2.0 and 2.1 systems overhauls, Phantom Liberty introduces complete re-architectures of character progression. Static percentage buffs have been replaced with dynamic combat perks enabling mid-air dashes, katana bullet deflection, and brutal vehicular weapon combat. The introduction of the Relic skill tree further enhances cyberware abilities, granting camouflage cloaking and devastating arm-cyberware enhancements.

Visually, Night City and Dogtown stand as the premier showcase for modern graphics technology. With real-time Full Path Tracing, DLSS 3.7 Ray Reconstruction, and AMD FSR 3.1, the game achieves an unprecedented standard of architectural photorealism and atmospheric density that challenges the limits of contemporary hardware.`,
    releaseYear: '2023',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    rating: 9.2,
    artwork: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    tags: ['Cyberpunk', 'Open World', 'Sci-Fi', 'Ray Tracing', 'Story Rich'],
    featured: true
  },
  {
    id: 'game-3',
    title: "Baldur's Gate 3",
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    shortDescription: 'Gather your party and return to the Forgotten Realms in an epic tale of fellowship, betrayal, sacrifice, and survival.',
    fullDescription: `Larian Studios' magnum opus redefines what modern roleplaying games can achieve, translating Dungeons & Dragons 5th Edition tabletop rules into an endlessly reactive, cinematic 3D simulation. From the crashed Nautiloid in the wilderness to the bustling, conspiracy-ridden streets of the Lower City of Baldur’s Gate, player freedom is the central design pillar.

Every encounter can be approached through dozens of tactical avenues: negotiate through complex multi-branching dialogue checks, sneak through shadows and pickpocket key resources, or manipulate the environment by stacking explosive barrels and electrocuting flooded surfaces. The action economy system rewards deliberate planning, positioning high-ground advantage, and creative spell synergy.

The emotional depth of its companion characters — including Shadowheart, Astarion, Gale, Lae'zel, Wyll, and Karlach — elevates the narrative beyond standard fantasy tropes. Unflinching moral dilemmas and genuine narrative consequences ensure that no two playthroughs ever unfold identically, cementing Baldur's Gate 3 as an all-time genre benchmark.`,
    releaseYear: '2023',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    rating: 9.7,
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tags: ['CRPG', 'Turn-Based', 'Choice Matters', 'Fantasy', 'D&D 5e'],
    featured: true
  },
  {
    id: 'game-4',
    title: 'World of Warships',
    genre: 'Simulation',
    platforms: ['PC'],
    shortDescription: 'The pinnacle naval combat simulator featuring over 600 historically modeled warships and tactical tactical fleet warfare.',
    fullDescription: `World of Warships combines meticulous naval engineering fidelity with grand tactical positioning. Commanding historical and blueprint vessels from the golden age of naval combat, captains operate across four foundational ship disciplines: stealthy torpedo destroyers, versatile radar cruisers, formidable armor-plated battleships, and reconnaissance aircraft carriers.

Beyond raw gunnery aiming, survival and victory hinge on complex spatial calculations. Players must master concealment detection mechanics, hydroacoustic search ranges, radar corridors, and the 14.3 caliber overmatch armor angling rules. A single careless turn broadside to an enemy division can result in devastating multi-citadel penetrations.

The game's enduring appeal lies in its cerebral pacing: momentum, turning circles, and delayed ballistic arcs reward players who think two minutes ahead rather than relying on twitch reflexes. With regular competitive Clan Battles and ranked seasons, World of Warships offers one of the most rewarding tactical learning curves in online gaming.`,
    releaseYear: '2015',
    developer: 'Wargaming',
    publisher: 'Wargaming',
    rating: 8.3,
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    tags: ['Naval Combat', 'Tactical', 'Free to Play', 'Multiplayer', 'Military Strategy'],
    featured: true
  },
  {
    id: 'game-5',
    title: 'Helldivers 2',
    genre: 'Multiplayer',
    platforms: ['PC', 'PS5'],
    shortDescription: 'Join the Helldivers and fight for Managed Democracy across a hostile galaxy in a frantic, hilarious third-person squad shooter.',
    fullDescription: `Arrowhead Game Studios delivers one of the most exhilarating cooperative shooters of the decade. As elite shock troopers deployed into galactic war theaters, squads of four coordinate orbital stratagems, heavy armaments, and defensive fortifications against endless swarms of voracious Terminids and militarized Automaton legions.

The gameplay loop balances razor-sharp tactical gunplay with emergent physical comedy. Friendly fire is permanently active, meaning miscalculated 500kg bomb beacons or reckless turret placements can wipe out an entire squad in seconds. Weapon ballistics feature realistic handling, armor penetration thresholds, recoil drift, and crew-served assisted reloads that incentivize genuine teamwork over solo heroism.

Underpinning the moment-to-moment firefights is a persistent, overarching Galactic War campaign directed live by Game Master 'Joel'. Every completed operation contributes planetary liberation percentages, uniting millions of players in real-time community defense orders and strategic counter-offensives.`,
    releaseYear: '2024',
    developer: 'Arrowhead Game Studios',
    publisher: 'PlayStation Publishing',
    rating: 8.8,
    artwork: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    tags: ['Co-op', 'Shooter', 'PvE', 'Sci-Fi', 'Tactical Squad'],
    featured: true
  },
  {
    id: 'game-6',
    title: 'Forza Horizon 5',
    genre: 'Racing',
    platforms: ['PC', 'Xbox'],
    shortDescription: 'Explore the vibrant and ever-evolving open-world landscapes of Mexico with limitless, high-speed driving action.',
    fullDescription: `Playground Games’ open-world automotive showcase stands as the premier celebration of car culture. Set across a breathtaking recreation of Mexico featuring 11 distinct biomes — from dense tropical jungles and historic colonial towns to arid living deserts and a towering, active snow-capped volcano — the game delivers endless exploration and racing variety.

With a roster exceeding 800 meticulously modeled authentic vehicles, the physics engine strikes a balance between accessible arcade drift mechanics and authentic vehicle telemetry. Players can fine-tune tire pressures, suspension damping, gear ratios, and differential locks to optimize performance across tarmac circuits, dirt trails, and cross-country expeditions.

A dynamic weather engine introduces seasonal shifts, blinding dust storms, and tropical downpours that fundamentally alter track grip. Robust community creation tools via EventLab allow players to construct custom stunt arenas, races, and game modes, providing boundless replayability.`,
    releaseYear: '2021',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    rating: 9.0,
    artwork: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    tags: ['Open World', 'Driving', 'Automotive', 'Arcade Sim', 'Photorealistic'],
    featured: false
  },
  {
    id: 'game-7',
    title: 'Hollow Knight: Silksong',
    genre: 'Adventure',
    platforms: ['PC', 'Switch', 'PS5', 'Xbox'],
    shortDescription: 'Play as Hornet, princess-protector of Hallownest, and ascend through a kingdom ruled by silk and song.',
    fullDescription: `Team Cherry’s eagerly anticipated sequel shifts perspective to Hornet, the nimble protector of Hallownest captured and transported to the unknown haunted kingdom of Pharloom. In contrast to the Knight’s grounded, deliberate nail strikes, Hornet’s moveset is characterized by acrobatic aerial lunges, needle flurries, and diagonal pounces that elevate platforming momentum.

Pharloom introduces over 150 brand-new enemy types, lethal orchestral bosses, and an expansive silk crafting system. Rather than relying solely on soul energy spells, Hornet binds silk to weave offensive traps, throwing pins, and specialized healing bursts mid-air.

The visual presentation elevates traditional 2D hand-drawn animation with multi-layered parallax backgrounds, dynamic lighting, and a sweeping chamber orchestra score by Christopher Larkin. Silksong represents the pinnacle of indie metroidvania craftsmanship.`,
    releaseYear: 'Anticipated',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    rating: 9.5,
    artwork: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    tags: ['Metroidvania', 'Souls-like', 'Hand-Drawn', 'Challenging', 'Indie Gem'],
    featured: false
  },
  {
    id: 'game-8',
    title: 'Starfield',
    genre: 'RPG',
    platforms: ['PC', 'Xbox'],
    shortDescription: 'Bethesda Game Studios first new universe in 25 years: explore over 1,000 uncharted planets in the Settled Systems.',
    fullDescription: `Bethesda Game Studios takes its hallmark open-ended roleplaying formula to interstellar scale. Joining Constellation — the last organization of space explorers — players venture across the Settled Systems to uncover the cosmic origin of mysterious alien artifacts scattered across the galaxy.

The core gameplay loop integrates deep shipbuilding modularity, planetary outpost industrial networks, and responsive low-gravity combat. Players can customize every component of their starcraft: swapping reactor cores, laser turrets, cargo modules, and crew quarters before taking on Crimson Fleet pirates in dogfights.

Faction questlines — including the UC Vanguard, Freestar Rangers, Ryujin Industries corporate espionage, and the Crimson Fleet — showcase Bethesda’s signature moral flexibility. With full official creation kit modding support, Starfield continues to evolve with thousands of player-created star systems, overhauls, and gameplay expansions.`,
    releaseYear: '2023',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    rating: 7.8,
    artwork: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    tags: ['Space', 'Exploration', 'RPG', 'Ship Customization', 'Sci-Fi'],
    featured: false
  },
  {
    id: 'game-pubg-mobile',
    title: 'PUBG Mobile',
    genre: 'Multiplayer',
    platforms: ['Mobile'],
    shortDescription: 'The battle royale phenomenon on mobile: 100 players parachute onto a remote island for a winner-takes-all showdown.',
    fullDescription: `PUBG Mobile translates the unforgiving, realistic military tactical shooter that ignited the battle royale craze into a finely tuned mobile competitive arena. Dropping without equipment onto classic 8x8km terrains like Erangel, Miramar, and Sanhok, 100 players scavenge weaponry, military armor, and medical supplies while navigating a progressively constricting Blue Zone.

What sets PUBG Mobile apart from arcade mobile shooters is its uncompromising commitment to physical ballistics: bullet velocity, aerodynamic drag, distance-based drop, and horizontal/vertical recoil demand disciplined weapon handling. Mastering high-level play requires full gyroscope aiming integration, micro-positional ridge control, and split-second vehicular rotations.

Supported by massive global esports tournaments and frequent seasonal game mode updates, PUBG Mobile remains the definitive mobile competitive shooter, offering authentic squad tactical depth to hundreds of millions of players worldwide.`,
    releaseYear: '2018',
    developer: 'LightSpeed & Quantum Studio',
    publisher: 'Krafton / Level Infinite',
    rating: 8.8,
    artwork: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    tags: ['Battle Royale', 'Shooter', 'PvP', 'Tactical', 'Competitive Mobile'],
    featured: true
  }
];

export { MOCK_ARTICLES } from './articlesData';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    gameTitle: 'Elden Ring: Shadow of the Erdtree',
    artwork: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    score: 9.8,
    scoreLabel: 'Masterpiece',
    genre: 'Action RPG',
    platform: 'PC, PS5, Xbox Series X|S',
    shortVerdict: 'An astronomical achievement that rivals standalone GOTY contenders in scope, world architecture, and boss choreography.',
    fullReview: `Shadow of the Erdtree represents FromSoftware operating at the absolute zenith of their architectural, atmospheric, and mechanical capabilities. Rather than offering a standard collection of isolated dungeons, director Hidetaka Miyazaki delivered a fully realized, vertically stacked continent that bends exploratory geography back upon itself in staggering ways. The Land of Shadow is denser and far more labyrinthine than the base Lands Between, with subterranean ravines, hidden finger ruins, and volcanic crags interconnected through discreet cliffside pathways and ancient stone coffins.

Combat in the expansion is intentionally calibrated for battle-hardened Tarnished. The new Scadutree Fragment and Revered Spirit Ash progression curves solve the universal RPG dilemma of endgame stat bloat: incoming damage from standard knights and grotesque omen creatures remains lethal unless players actively scour the map for blessings. This elevates exploration from a completionist checkbox into an urgent survival necessity. Furthermore, the introduction of eight distinct weapon categories — such as martial arts hand-to-hand combat, throwing weapons, and the rhythmically fluid Light Greatswords — injects fresh dynamism into the Souls combat sandbox.

Boss encounters in the expansion are among the most visually breathtaking and punishing FromSoftware has ever conceived. Confrontations against Messmer the Impaler, Midra Lord of Frenzied Flame, and the dancing divine beasts feature multi-phase transitions backed by sweeping choral compositions. While certain late-game visual effects can push screen readability and hardware frame rates during climactic alpha-heavy spells, Shadow of the Erdtree stands as an indisputable masterpiece that sets a benchmark for what game expansions can achieve.`,
    author: 'Marcus Vance',
    reviewer: 'Marcus Vance',
    publishDate: 'Aug 2026',
    pros: [
      'Stunning, vertically layered world design that rewards curious exploration',
      'Eight new weapon archetypes provide immense build variety and combat fluidity',
      'Scadutree Fragment regional leveling solves late-game RPG power inflation',
      'Unforgettable, multi-phase boss encounters with haunting musical themes',
      'Atmospheric dark fantasy lore that enriches the overarching Elden Ring tapestry'
    ],
    cons: [
      'Dense particle and alpha effects can cause frame drops during chaotic boss phases',
      'Lock-on camera still struggles against massive, erratic multi-legged adversaries'
    ]
  },
  {
    id: 'rev-2',
    gameTitle: "Baldur's Gate 3",
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    score: 9.7,
    scoreLabel: 'Masterpiece',
    genre: 'CRPG / Turn-Based',
    platform: 'PC, PS5, Xbox Series X|S',
    shortVerdict: 'A generational roleplaying triumph providing unmatched player agency, systemic world reactivity, and companion writing.',
    fullReview: `Larian Studios achieved what the broader video game industry had long dismissed as commercially impossible: delivering a lavishly funded, uncompromisingly complex turn-based CRPG with full cinematic motion capture for every line of dialogue. Baldur’s Gate 3 breathes genuine tabletop spontaneity into digital form. The adaptation of Dungeons & Dragons 5th Edition rules provides a rigorous framework, yet the game's greatest triumphs emerge when players discard conventional rules to manipulate the physical environment.

Whether shoving arrogant villains off dizzying chasms, utilizing wild shape to infiltrate mouse burrows, or electrifying water puddles with lightning arrows to stun enemy ranks, the tactical problem-solving is virtually limitless. Combat rewards thoughtful positioning and action economy mastery above all else. Every encounter feels hand-tailored, free from the procedural filler that plagues modern open-world design.

Yet it is the emotional resonance of the companions that cements Baldur’s Gate 3 in the gaming pantheon. The personal odysseys of Astarion, Shadowheart, Lae'zel, Gale, Wyll, and Karlach are written with profound vulnerability and moral nuance. Major questlines ripple across tens of hours, meaning that casual dialogue decisions or failed saving throws permanently reshape the geopolitical landscape of the Sword Coast. Even two years following its release, it remains the gold standard against which all future roleplaying games will be measured.`,
    author: 'Elena Rostova',
    reviewer: 'Elena Rostova',
    publishDate: 'Jul 2026',
    pros: [
      'Unprecedented narrative branching and dialogue reactivity across all three acts',
      'Tactical turn-based combat driven by physical environmental chemistry',
      'Masterclass companion writing with world-class voice acting and motion capture',
      'Honor Mode delivers a thrilling, high-stakes tactical challenge for veterans',
      'Complete absence of predatory microtransactions, battle passes, or DRM lockouts'
    ],
    cons: [
      'Dense urban zones in Act 3 demand hefty CPU power and can strain memory',
      'Party inventory management can become cumbersome during prolonged campaigns'
    ]
  },
  {
    id: 'rev-3',
    gameTitle: 'Cyberpunk 2077: Phantom Liberty',
    artwork: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    score: 9.3,
    scoreLabel: 'Masterpiece',
    genre: 'Sci-Fi RPG / Action',
    platform: 'PC, PS5, Xbox Series X|S',
    shortVerdict: 'A tense, morally gray espionage thriller that showcases Night City at the absolute peak of visual tech and kinetic combat.',
    fullReview: `Phantom Liberty represents the definitive redemption and artistic realization of CD Projekt RED’s ambitious cyberpunk vision. Transporting mercenary V into Dogtown — an anarchic, militarized combat district carved out of Pacifica — the narrative crafts an intimate, pulse-pounding spy thriller. Idris Elba delivers an exceptional performance as Solomon Reed, an FIA veteran whose allegiance to duty creates complex ethical quandaries alongside secretive netrunner Songbird and President Rosalind Myers.

Paired with the foundational gameplay redesigns of Update 2.0 and 2.1, Phantom Liberty transforms combat into a ballet of kinetic violence. Gone are the passive percentage stat boosts of the original release; in their place stands an intuitive perk matrix enabling mid-air dashes, katana bullet deflection, and brutal vehicular mounted weaponry. The cyberware capacity threshold forces meaningful build choices between chrome tank resilience and overclocked netrunner RAM loops.

On a visual and technical level, Phantom Liberty is an unrivaled technological showcase. Running Night City with Path Tracing, DLSS 3.7 Ray Reconstruction, and Frame Generation produces lighting, reflections, and shadow realism that genuinely redefine graphical fidelity. Combined with tight vertical level design that makes every corner of Dogtown feel lived-in and hostile, this expansion is essential gaming.`,
    author: 'David K.',
    reviewer: 'David K.',
    publishDate: 'Jun 2026',
    pros: [
      'Grips from start to finish with an exceptional espionage storyline and multiple brutal endings',
      'Dogtown level design is remarkably dense, vertically layered, and visually spectacular',
      'Overhauled perk and cyberware systems make combat fluid, kinetic, and endlessly satisfying',
      'Path Tracing visual benchmark stands as the pinnacle of modern PC rendering technology',
      'Idris Elba and Minji Chang deliver powerhouse vocal and motion capture performances'
    ],
    cons: [
      'Achieving full ray-traced glory requires top-tier enthusiast PC hardware',
      'Occasional minor NPC physics glitches persist in crowded district plazas'
    ]
  },
  {
    id: 'rev-4',
    gameTitle: 'Helldivers 2',
    artwork: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    score: 8.9,
    scoreLabel: 'Very Good',
    genre: 'Co-op Tactical Shooter',
    platform: 'PC, PS5',
    shortVerdict: 'An electrifying, chaotic masterclass in cooperative gameplay that pairs brutal tactical mechanics with comedic brilliance.',
    fullReview: `Arrowhead Game Studios struck lightning with Helldivers 2, crafting a game that manages to be simultaneously a brutally punishing tactical shooter and an uproariously funny social experience. Dropping onto war-torn alien planets as expendable shock troops of Super Earth, squads of four must coordinate heavy firepower, aerial stratagems, and defensive fortifications against relentless robotic Automaton forces and organic Terminid swarms.

The core shooting mechanics are deeply satisfying. Weapons possess real physical weight, recoil kick, and realistic armor penetration thresholds. What makes Helldivers 2 truly sing, however, is its unwavering commitment to active friendly fire. An improperly calibrated orbital laser, a stray grenade ricocheting off heavy carapace, or an automated mortar sentry firing on an incoming berserker can instantly obliterate your entire squad. Surviving high difficulties requires genuine communication, bounding withdrawals, and crew-assisted reloading partnerships.

The overarching Galactic War campaign — orchestrated behind the scenes by Arrowhead’s live Game Master — provides a compelling reason to log in daily. Community-wide Major Orders unite hundreds of thousands of players in planetary defense campaigns, while the consumer-friendly Warbond system respects player time by never expiring. Helldivers 2 is modern cooperative gaming at its finest.`,
    author: 'Vault Editorial Team',
    reviewer: 'Vault Editorial Team',
    publishDate: 'May 2026',
    pros: [
      'Exhilarating combat loop blending tight gunplay, ragdoll physics, and chaotic explosions',
      'Brilliant community-driven Galactic War meta with real-time Game Master interventions',
      'Fair, non-expiring Warbond progression that completely respects player time and investment',
      'Teamwork and crew-assisted reloading feel deeply rewarding on higher difficulty operations',
      'Superb audio design: from deafening orbital strikes to the heroic orchestral brass soundtrack'
    ],
    cons: [
      'Heavy crossplay sessions occasionally suffer network desynchronization drops',
      'Rapid weapon balance adjustments can intermittently disrupt established player loadouts'
    ]
  },
  {
    id: 'rev-5',
    gameTitle: 'World of Warships',
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    score: 8.4,
    scoreLabel: 'Very Good',
    genre: 'Naval Combat / Tactical Simulation',
    platform: 'PC',
    shortVerdict: 'A cerebral, deliberate naval combat simulator where map awareness, armor angling, and patience trump twitch reflexes.',
    fullReview: `World of Warships occupies a unique, revered space in the multiplayer combat landscape. Rather than catering to instantaneous twitch reflexes, Wargaming's naval simulator is a game of prolonged suspense, positional chess, and spatial anticipation. Commanding historic dreadnoughts, agile destroyers, versatile cruisers, and aircraft carriers across vast oceanic archipelagos, every volley requires precise ballistic calculations and mental foresight.

The depth of the game's armor and penetration model is astonishing. Shell velocity, impact angles, and the 14.3 caliber overmatch rule mean that survival depends on presenting an angled bow rather than exposing vulnerable broadside citadels. Furthermore, the concealment and spotting mechanics create a tense cat-and-mouse dynamic where silent destroyers hold the keys to vision control while radar-equipped cruisers ambush unsuspecting opponents behind island cover.

While the free-to-play economy and high-tier credit grinds require careful management, the core combat loop remains profoundly rewarding for dedicated tacticians. Landing a devastating salvo across 18 kilometers against a maneuvering battleship offers a level of visceral satisfaction unmatched in military simulation gaming.`,
    author: 'Joel Ayuba',
    reviewer: 'Joel Ayuba',
    publishDate: 'Aug 2026',
    pros: [
      'Unmatched historical naval modeling with over 600 authentic vessels and blueprints',
      'Cerebral, positioning-based tactical combat that rewards anticipation and spatial awareness',
      'Deep mechanical systems including concealment circles, armor angling, and ballistics',
      'Thriving competitive community with structured Clan Battles and ranked divisions',
      'Regular visual updates, water rendering overhauls, and detailed audio acoustics'
    ],
    cons: [
      'High-tier economic upkeep costs can feel punitive for non-premium accounts',
      'Steep learning curve with many critical mechanics unexplained in early player tutorials'
    ]
  },
  {
    id: 'rev-6',
    gameTitle: 'Forza Horizon 5',
    artwork: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    score: 9.1,
    scoreLabel: 'Excellent',
    genre: 'Open World Racing / Sim-Cade',
    platform: 'PC, Xbox Series X|S, Xbox One',
    shortVerdict: 'The quintessential open-world automotive celebration, offering sublime driving dynamics and a visually stunning Mexico map.',
    fullReview: `Forza Horizon 5 remains the undisputed king of open-world racing. Playground Games took their refined sim-cade handling model and dropped it into their largest, most diverse canvas yet: a vibrant recreation of Mexico featuring dense rainforests, arid canyonlands, historic Guanajuato alleyways, and the summit of the Gran Caldera volcano.

The handling physics strike a miraculous equilibrium between accessible high-speed drift thrills and authentic telemetry feedback. Whether tearing across rugged dirt trails in a Ford Bronco Baja truck or carving through asphalt hairpins in a Ferrari SF90 Stradale, every vehicle communicates weight transfer, suspension compression, and tire adhesion with supreme clarity. The customization suite allows petrolheads to tune differential ratios, camber angles, and aero balance to suit any discipline.

A dynamic weather model brings tropical storms and blinding haboobs that dynamically reshape track conditions. Backed by the EventLab toolset — which allows players to design custom obstacle courses and minigames — Forza Horizon 5 is an irresistible, joyful sandbox that honors the spirit of driving.`,
    author: 'Marcus Vance',
    reviewer: 'Marcus Vance',
    publishDate: 'Jul 2026',
    pros: [
      'Magnificent recreation of Mexico with 11 distinct biomes and dynamic seasonal weather',
      'Peerless driving model balancing approachable arcade fun with authentic telemetry depth',
      'Massive car roster exceeding 800 accurately recorded and modeled vehicles',
      'EventLab creation suite provides virtually endless community-generated race modes',
      'Flawless PC performance optimization with comprehensive graphics configuration'
    ],
    cons: [
      'Festival playlist progression structure can sometimes feel repetitive after dozens of hours',
      'Online convoy matchmaking can occasionally glitch during cross-platform sessions'
    ]
  },
  {
    id: 'rev-7',
    gameTitle: 'PUBG Mobile',
    artwork: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    score: 8.7,
    scoreLabel: 'Very Good',
    genre: 'Tactical Battle Royale / Competitive Mobile',
    platform: 'Android, iOS',
    shortVerdict: 'A triumphant mobile adaptation of the battle royale originator, boasting authentic ballistic depth and rigorous esports pedigree.',
    fullReview: `Transferring the deliberate, tension-filled military simulation of PlayerUnknown's Battlegrounds to touchscreen devices seemed like an insurmountable engineering hurdle in 2018. Yet LightSpeed & Quantum Studio delivered what remains the premier competitive mobile shooter in the world. Dropping onto classic battlefields like Erangel and Miramar, 100 combatants must scavenge gear, control vehicle rotations, and outthink rivals as the circle collapses.

What gives PUBG Mobile its staying power is its uncompromising weapon ballistics. Guns kick with significant vertical and horizontal recoil; bullets travel at authentic muzzle velocities and drop over distance. By incorporating precision gyroscope aiming controls alongside customizable four-finger "claw" HUD layouts, high-tier competitive mobile play achieves mechanical precision that rivals keyboard-and-mouse tournaments.

The mobile client is packed with tactical options: vehicle tire mechanics, smoke grenade screen physics, and spatial directional audio that lets players pinpoint footsteps across multi-story buildings. Despite aggressive cosmetic monetization in the menus, the core gameplay balance remains strictly skill-based, making PUBG Mobile an enduring powerhouse of competitive mobile gaming.`,
    author: 'Elena Rostova',
    reviewer: 'Elena Rostova',
    publishDate: 'Jun 2026',
    pros: [
      'Authentic military ballistics with genuine bullet velocity, recoil, and drop modeling',
      'Highly responsive gyroscope aiming and customizable touch interface configurations',
      'Tense, tactical pacing that rewards positioning and zone rotation strategy over run-and-gun spam',
      'Massive global competitive ecosystem with seamless ranked matchmaking',
      'Optimized performance that scales cleanly from budget handsets to 120 FPS flagship devices'
    ],
    cons: [
      'Main menu UI is heavily cluttered with aggressive seasonal lucky draws and cosmetic ads',
      'Casual public matches occasionally populate with beginner bot opponents to speed queue times'
    ]
  },
  {
    id: 'rev-8',
    gameTitle: 'Starfield',
    artwork: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    score: 8.0,
    scoreLabel: 'Good',
    genre: 'Space Action RPG',
    platform: 'PC, Xbox Series X|S',
    shortVerdict: 'An ambitious interstellar sandbox with brilliant shipbuilding and rich faction quests, held back by segmented exploration.',
    fullReview: `Starfield represents Bethesda Game Studios stepping into its first original universe in a quarter-century. Embarking on a quest with the explorer group Constellation to discover the origins of enigmatic alien artifacts, players roam through the Settled Systems. When Starfield shines, it captures the optimistic, wonder-filled spirit of classic hard sci-fi.

The modular starship builder is arguably the game’s greatest triumph. Piecing together cockpits, reactor drives, hab units, and weapons to pilot across dogfights and boarding operations feels endlessly inventive. Furthermore, the handcrafted faction questlines — particularly the undercover infiltration of the Crimson Fleet on behalf of the UC Vanguard — rank among the best narratives Bethesda has ever penned, offering genuine moral complexity and memorable set pieces.

Where Starfield falters is in its exploration pacing. By breaking space travel into menus and loading screens rather than seamless planetary transitions, the sense of continuous organic discovery that defined Skyrim or Fallout 3 is somewhat muted. However, with the official Creation Kit now enabling deep community overhauls and expansions, Starfield continues to blossom into a compelling interstellar roleplaying platform.`,
    author: 'David K.',
    reviewer: 'David K.',
    publishDate: 'May 2026',
    pros: [
      'Magnificent modular starship construction and interior customization system',
      'Outstanding faction storylines, especially the UC Vanguard and Crimson Fleet undercover arcs',
      'Low-gravity combat mechanics and zero-G firefights feel punchy and dynamic',
      'Vast modding ecosystem that continually expands planetary exploration and mechanics',
      'Atmospheric orchestral soundtrack by Inon Zur captures interstellar wonder'
    ],
    cons: [
      'Heavy reliance on menu-based fast travel and loading screens fragments space immersion',
      'Procedural planetary points of interest can repeat identical interior layouts'
    ]
  }
];

export const MOCK_GUIDES: Guide[] = [
  {
    id: 'guide-1',
    title: 'Elden Ring: Shadow of the Erdtree — Scadutree Fragment Optimization Route',
    game: 'Elden Ring',
    difficulty: 'Intermediate',
    estimatedReadingTime: '9 min',
    shortDescription: 'The definitive early-game exploration blueprint to acquire 12 Scadutree blessings before facing Divine Beast Dancing Lion and Rellana.',
    category: 'Strategy',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. Scadutree Blessing Math: Multiplicative Defense vs Flat Runes',
        content: 'Your traditional rune levels, vigor soft-caps (60 Vigor), and heavy armor poise are fundamentally recalibrated within the Land of Shadow. Scadutree Blessings grant flat percentage scaling bonuses: each tier confers approximately +5% outgoing physical and elemental damage and ~4.5% incoming damage mitigation. At Blessing Level 10, your character deals 1.5x damage and takes nearly 35% less damage across all damage types. Entering legacy dungeons with sub-level 4 blessings effectively exposes even level 200 endgame builds to instantaneous one-shot mechanics.',
        tip: 'Never enter Belurat or Castle Ensis until you have accumulated at least Blessing Tier 6.'
      },
      {
        heading: '2. The Gravesite Plain Perimeter Route',
        content: 'Upon emerging into Gravesite Plain, do not charge toward the Main Gate. Instead, veer northwest to the Church of Consolation to retrieve two Scadutree Fragments resting directly at the base of the statue. Next, pivot southeast along the cliff edge past the sleeping Ghostflame Dragon. Ascend toward the Cliffroad Cross to acquire your third fragment, then cross the Ellac Greatbridge to grab the fourth fragment beside the bridge cross checkpoint before engaging the armored Blackgaol Knight.',
        tip: 'You can bypass the Blackgaol Knight entirely during early scavenging; focus purely on cross checkpoints.'
      },
      {
        heading: '3. Navigating the Lower Ravine to the Cerulean Coast',
        content: 'Before stepping foot inside Castle Ensis, locate the secluded ravine pathway descending under the bridge near Castle Front. Follow the poison marsh southward into the Ellac River basin. Navigating downstream leads past giant Miranda sprouts and along the river stones down to the breathtaking Cerulean Coast. Along this scenic corridor, you will secure three additional fragments without fighting a single major boss.',
        tip: 'Equip the Spelldrake Talisman +3 and Flamedrake Talisman +3 found in nearby cave chests to survive environmental traps.'
      },
      {
        heading: '4. Scavenging Shadow Keep Exterior & Hidden Altars',
        content: 'Utilizing Spiritspring jumps around the southern cliffs of Scadu Altus grants access to the Moorth Ruins cross and the Church of Crusade. Each site provides essential blessings and Revered Spirit Ashes for summon resilience. Ensure you defeat the pot-carrying shadow wanderers: they do not respawn, but each carries a guaranteed Scadutree Fragment directly into your inventory upon death.',
        tip: 'Watch for glowing golden jars carried on the heads of fleeing shadow enemies; dispatch them quickly before they vanish.'
      },
      {
        heading: '5. Recommended Stat & Talisman Matrix for Early Bosses',
        content: 'Pair your collected blessings with defensive negation talismans. Combining the Dragoncrest Greatshield Talisman (20% physical mitigation) with the Pearl Drake Talisman +3 and Opaline Hardtear in your Flask of Wondrous Physick stacks multiplicatively with Scadutree blessings, allowing you to withstand Divine Beast Dancing Lion’s lightning storms and Rellana’s dual twin-blade combos with comfortable poise margins.',
        tip: 'Remember that Scadutree Blessings only apply within the Land of Shadow; your stats automatically normalize when returning to the base Lands Between.'
      }
    ]
  },
  {
    id: 'guide-2',
    title: 'World of Warships: Tactical Armor Angling, Shell Ballistics & Citadel Penetration',
    game: 'World of Warships',
    difficulty: 'Advanced',
    estimatedReadingTime: '11 min',
    shortDescription: 'Master shell velocity, ricochet angles, the 14.3 caliber overmatch formula, and defensive kiting postures in high-tier fleet battles.',
    category: 'Game Mechanics',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. The 14.3 Caliber Overmatch Rule Explained',
        content: 'The cornerstone of high-tier naval armor interaction is the 14.3 overmatch equation: Shell Diameter (in mm) ÷ 14.3. If the resulting caliber value exceeds the nominal thickness of the target armor plate, the shell completely bypasses all ricochet angle checks and penetrates regardless of how sharply angled the target is. For example, a 406mm shell overmatches up to 28.39mm of plating, allowing battleships like Iowa and Montana to punch directly through the 27mm bow plating of standard heavy cruisers like Des Moines or Baltimore.',
        tip: 'Yamato and Shikishima with 460mm+ artillery overmatch 32mm plating, ignoring the bow armor of all standard tier X battleships.'
      },
      {
        heading: '2. Ricochet Thresholds & Auto-Bounce Angles',
        content: 'When overmatch is not applicable, armor piercing (AP) shells undergo ricochet calculations based on the angle of incidence. Standard AP shells ricochet automatically when impacting armor at angles greater than 60 degrees from normal (0 to 30 degrees relative to the ship centerline). Between 45 and 60 degrees, a random probability check occurs. Certain naval lines (notably American heavy cruisers and British light cruisers) enjoy enhanced bounce angles that only begin ricochet calculations at 60 to 67.5 degrees.',
        tip: 'Always observe the target angle before firing: if they are angled steeper than 60 degrees, switch to High Explosive (HE) to set fires and strip external modules.'
      },
      {
        heading: '3. Defensive Bow Angling vs Tactical Kiting (Stern-Away)',
        content: 'While nose-in bow angling protects against non-overmatching artillery, it severely immobilizes your vessel and makes you vulnerable to crossfires and torpedo sweeps. The superior high-level survival technique is kiting: angling your stern away from approaching enemies at 35 degrees. This enables you to utilize all rear gun turrets, throttle down to bait salvos into the water, and instantly accelerate forward away from torpedo spreads while presenting minimal broadside target area.',
        tip: 'Throttle juking (cycling between 1/2 speed and full reverse while turning) ruins enemy lead calculations at ranges exceeding 14 km.'
      },
      {
        heading: '4. Citadel Protection & Turtleback Armor Schemes',
        content: 'The citadel is the heavily armored internal machinery and magazine compartment of the warship. Penetrations inside this zone yield 100% shell alpha damage and can sink vessels in a single coordinated salvo. German battleships and cruisers utilize a sloped internal "turtleback" armor deck that deflects close-range flat-trajectory shells upward into the upper deck, making them nearly immune to close-quarters citadels while remaining vulnerable to plunging long-range deck penetrations.',
        tip: 'Aim at the waterline directly below the enemy smokestacks and main battery turrets when a target exposes broadside.'
      },
      {
        heading: '5. Concealment Resetting & Vision Management',
        content: 'Firing your main guns blooms your ship detection radius to your maximum firing range for precisely 20 seconds. If taking heavy focus fire while kiting, cease firing immediately. Break line of sight behind island geometry or allow your detection timer to expire if hostile spotting destroyers are eliminated. Re-entering concealment allows your Repair Party consumable to restore citadel and fire damage safely.',
        tip: 'Always equip Concealment Expert on your ship commanders to shrink your detection buffer and dictate engagement terms.'
      }
    ]
  },
  {
    id: 'guide-3',
    title: 'Cyberpunk 2077 (Update 2.1+): Netrunner / Sandevistan Kinetic Hybrid Build Guide',
    game: 'Cyberpunk 2077',
    difficulty: 'Intermediate',
    estimatedReadingTime: '8 min',
    shortDescription: 'How to combine cyberware capacity, overclock RAM loops, and dash kinetic mobility for unstoppable combat tempo in Night City.',
    category: 'Builds',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. Attribute Allocation & Core Perk Milestones',
        content: 'To construct an invincible kinetic hybrid, allocate 20 points into Intelligence, 20 into Reflexes, and 20 into Technical Ability. Intelligence unlocks the Overclock ability alongside smart weapon tracking perks. Reflexes grants the indispensable Air Dash and Dash Mitigation skills. Technical Ability provides the foundational "Edgerunner" perk, allowing you to exceed your default cyberware threshold by up to 50 points in exchange for a slight maximum health reduction.',
        tip: 'Take the "Tailor-Made Engine" perk under Tech to gain bonus armor and movement speed per equipped cyberware piece.'
      },
      {
        heading: '2. The Overclock Health-to-RAM Synergy Loop',
        content: 'Activating Overclock allows you to upload high-tier quickhacks using your current health pool when RAM runs dry. To sustain this loop indefinitely, combine the "Blood Demon" perk (restoring 25 HP per queued quickhack kill) with the "Adrenaline Rush" perk in the Body tree. This creates an infinite resource engine where every uploaded cyberware malfunction or synapse burnout automatically refills your health bar faster than Overclock consumes it.',
        tip: 'Queue "Cyberware Malfunction" twice followed by "Short Circuit" for an explosive EMP burst that one-shots elite MaxTac officers.'
      },
      {
        heading: '3. Essential Cyberware Loadout Matrix',
        content: 'Equip the Militech Paraline or Tetratronic Rippler Cyberdeck in your OS slot for amplified weapon damage against hacked targets. In the nervous system, slot the Kerenzikov system to slow time whenever you aim while sliding or dashing. For skeletal reinforcement, choose Titanium Bones and Epimorphic Skeleton to maximize your armor rating to over 1,100 points, rendering standard ballistic fire harmless.',
        tip: 'Loot Dogtown airdrops regularly: they contain permanent Cyberware Capacity Shards to expand your chrome headroom.'
      },
      {
        heading: '4. Kinetic Mobility: Slide-Dash Stacking & Aerial Repositioning',
        content: 'Combat tempo in Update 2.1 relies on fluid movement chaining. Initiate a sprint, tap crouch to slide, and immediately cancel the slide into an Air Dash. This maintains momentum, triggers 100% mitigation chance via the "Can\'t Touch This" perk, and closes distances against sniper emplacements in milliseconds. Follow up with an aerial mantis blade leap or an automatic smart SMG burst while airborne.',
        tip: 'Map dash to an easily accessible mouse thumb button or bumper to perform seamless dash-jump chains.'
      },
      {
        heading: '5. End-Game Boss Strategy (Kurt Hansen & Chimera)',
        content: 'Against heavily armored boss encounters, rely on the Relic tree "Vulnerability Analytics" perk. Scanning targets highlights structural weak points on their cyberware. Firing smart projectiles or sniper rounds into these illuminated zones triggers a 100% critical hit EMP detonation that staggers bosses out of their ultimate attack animations.',
        tip: 'Keep Memory Wipe in your quickhack deck to reset boss aggro and break lock-on missiles instantly.'
      }
    ]
  },
  {
    id: 'guide-4',
    title: 'PC Gaming Hardware Tuning: Eliminating Micro-Stutter, Frame Pacing & 0.1% Lows',
    game: 'PC Tech / Hardware',
    difficulty: 'Beginner',
    estimatedReadingTime: '7 min',
    shortDescription: 'The four graphics and system settings that drain 40% of your GPU budget with zero perceptible visual gain, plus optimal G-Sync setup.',
    category: 'Settings',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. G-Sync, FreeSync & The 3-FPS Refresh Rate Cap',
        content: 'Variable Refresh Rate (VRR) monitors eliminate tearing only when frame rates stay strictly within the display module’s active frequency window. If your GPU outputs frames exceeding your refresh ceiling (e.g. 145 FPS on a 144Hz monitor), VRR disengages, introducing abrupt V-Sync input lag or tearing artifacts. The golden setup: Enable G-Sync/FreeSync in driver settings, enable V-Sync in the global graphics control panel, and cap your maximum frame rate 3 to 4 FPS below your display refresh ceiling (e.g. 141 FPS on 144Hz, 236 FPS on 240Hz) using RivaTuner Statistics Server (RTSS).',
        tip: 'Never enable in-game V-Sync when driver-level V-Sync and VRR are active; let the display driver manage synchronization.'
      },
      {
        heading: '2. Volumetric Clouds, Fog & Subsurface Scattering Optimization',
        content: 'Modern game engines use ray-marched volumetric buffers for clouds and ambient fog. Running these settings on "Ultra" forces the GPU to calculate dense particle lighting across full screen resolution, consuming 15% to 22% of your GPU rendering budget. Reducing Volumetric Fog from Ultra to Medium or High restores double-digit frame rates while retaining virtually 98% of scene atmospheric depth. Similarly, reduce Subsurface Scattering to Medium: the subtle skin light transmission difference is imperceptible during real-time action.',
        tip: 'Check your games settings for "SSR" (Screen Space Reflections); lowering it one step can free up substantial VRAM bandwidth.'
      },
      {
        heading: '3. Shadow Resolution vs Contact Ambient Occlusion',
        content: 'Cascaded shadow maps on Ultra generate massive 4K shadow atlases that bottleneck memory bandwidth and trigger micro-stutter during rapid camera panning. Drop overall shadow resolution to High. To maintain sharp visual contrast and ground objects realistically, ensure Screen Space Contact Shadows and Ambient Occlusion (SSAO or GTAO) remain enabled.',
        tip: 'Contact shadows are computationally inexpensive and preserve fine details around character feet and foliage.'
      },
      {
        heading: '4. Windows Game Mode, HAGS & Shader Cache Management',
        content: 'Ensure Hardware-Accelerated GPU Scheduling (HAGS) is enabled in Windows Graphics Settings to unlock DLSS Frame Generation and lower CPU draw call overhead. In NVIDIA Control Panel, increase your Shader Cache Size from the default 4GB to 10GB or 100GB. This prevents modern DirectX 12 titles from constantly compiling shaders on-the-fly, eliminating shader compilation stutter during new asset loads.',
        tip: 'Disable background game recording or Xbox Game Bar capture if you already utilize NVIDIA ShadowPlay or AMD ReLive.'
      },
      {
        heading: '5. Frame Time Consistency Over Raw Average FPS',
        content: 'A stable 90 FPS with a flat 11.1ms frame time line feels infinitely smoother to play than an unstable 140 FPS that spikes wildly between 8ms and 24ms. Always benchmark games using 1% low and 0.1% low metrics rather than average FPS. If your 1% lows drop below 60% of your average frame rate, lower CPU-heavy settings such as NPC crowd density, traffic volume, and draw distance.',
        tip: 'Use MSI Afterburner with RTSS to overlay a real-time frame time graph and catch micro-stutters during testing.'
      }
    ]
  },
  {
    id: 'guide-5',
    title: "Baldur's Gate 3: Honor Mode Survival Blueprint & Action Economy Optimization",
    game: "Baldur's Gate 3",
    difficulty: 'Advanced',
    estimatedReadingTime: '12 min',
    shortDescription: 'How to conquer single-save Honor Mode: mitigating boss Legendary Actions, optimizing initiative, and establishing emergency retreat protocols.',
    category: 'Walkthroughs',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. The Golden Rule: Initiative Priority & The Alert Feat',
        content: 'In Baldur\'s Gate 3, initiative is rolled on a D4 die rather than the tabletop D20. This means every flat initiative bonus is four times more impactful. Rolling higher on initiative allows your squad to eliminate or hard crowd-control major enemy damage dealers before they take a single turn. At Level 4, picking the "Alert" feat (+5 initiative and immunity to surprise) on your primary spellcaster and burst martial character is virtually mandatory for surviving Honor Mode encounters.',
        tip: 'High dexterity characters (16+ DEX) naturally roll near the top of turn order; distribute gear like the Bow of Awareness for early initiative boosts.'
      },
      {
        heading: '2. Countering Boss Legendary Actions',
        content: 'Honor Mode equips every major boss with devastating Legendary Actions that trigger on your party\'s turns. For instance, the Owlbear summons a second mate when threatened, and Grym gains immense temporary health and retaliates with thunderous shockwaves. Never attack an Honor Mode boss blindly: open their character sheet, examine their Legendary Action condition, and deliberately bait the reaction using disposable summons or spiritual weapons before committing your primary damage dealers.',
        tip: 'Use minor illusions or shovel summons to safely trigger enemy reaction spells before moving your squad into melee range.'
      },
      {
        heading: '3. Action Economy Maximization: Haste, Elixirs & Extra Attacks',
        content: 'Action economy dictates combat supremacy. Prioritize consumables and abilities that multiply your actions per turn. The Elixir of Bloodlust grants an additional full action whenever a character delivers a killing blow, while Potions of Speed grant Haste without requiring wizard spell concentration. Distribute strength and dexterity elixirs after every long rest to ensure your martial fighters land four to six attacks per round.',
        tip: 'Beware the Haste lethargy penalty: when Haste ends, your character loses an entire turn. Always plan encounters to finish within the 3-turn window.'
      },
      {
        heading: '4. Camp Buffing Protocol & Long Rest Economy',
        content: 'Before venturing out from camp, utilize companion clerics remaining at camp to cast non-concentration all-day buffs on your active party members: Aid (increasing max HP), Death Ward (preventing fatal blows), Longstrider (+3m movement speed), and Heroes\' Feast. Because these buffs persist until the next long rest, your active combatants venture into danger with massive defensive buffers at zero spell slot cost to the active party.',
        tip: 'Hire a hireling from Withers specifically dedicated as your designated camp cleric buffer.'
      },
      {
        heading: '5. The Emergency Sanctuary & Invisibility Retreat Protocol',
        content: 'A single wipe ends your Honor Mode run permanently. To safeguard against catastrophic dice rolls, designate one companion as the survival anchor. Keep Potions of Invisibility or the Sanctuary spell equipped on them. If an encounter turns deadly, have the designated anchor drink an invisibility potion, disengage, sprint out of combat range, and flee back to camp to resurrect fallen comrades through Withers.',
        tip: 'Never group all four companions tightly together when entering unexplored chambers to avoid whole-party wipeouts from surprise traps.'
      }
    ]
  },
  {
    id: 'guide-6',
    title: 'Helldivers 2: Super Helldive (Difficulty 10) Squad Synergy & Stratagem Meta',
    game: 'Helldivers 2',
    difficulty: 'Advanced',
    estimatedReadingTime: '10 min',
    shortDescription: 'Coordinate team roles, anti-tank rotations, crowd control stun grenades, and perimeter extraction defense on max difficulty.',
    category: 'Strategy',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. Squad Role Specialization: Anti-Armor vs Chaff Clear',
        content: 'On Super Helldive, uncoordinated squads will be overrun within three minutes. A balanced four-diver composition requires strict division of labor: two Anti-Tank Specialists carrying heavy ordinance (Quasar Cannon, Recoilless Rifle, or Spear) to instantly dispatch Bile Titans, Factory Striders, and Chargers; one Crowd-Control Chaff Specialist running Stalwart or Flamethrower with a Supply Pack; and one Recon Scout using scout armor to sneak ahead, eliminate Automaton jammers, and trigger primary objectives.',
        tip: 'Crew-assisted reloading with the Recoilless Rifle enables you to fire a rocket every 1.5 seconds, erasing multiple heavy armor targets back-to-back.'
      },
      {
        heading: '2. Staggering Stratagem Cooldowns & Orbital Coordination',
        content: 'Never deploy redundant heavy stratagems simultaneously. Coordinate through voice or ping comms: when Diver 1 drops an Orbital Precision Strike on an incoming Hulk, Diver 2 reserves their Eagle 500kg Bomb for the next reinforcement wave. Staggering cooldowns ensures the squad is never caught defenseless during the 2-minute Eagle rearm window.',
        tip: 'The Orbital EMS Strike and Stun Grenades freeze entire groups of Berserkers and Hulks in place, making headshot weak-point hits effortless.'
      },
      {
        heading: '3. Eliminating Automaton Detector Towers & Jammer Stations',
        content: 'On the Automaton front, Stratagem Jammer stations are lethal priority threats that disable all orbital call-ins within a 150m radius. Approach stealthily from downwind in light scout armor. Look for an attached fabricator vent adjacent to the jammer structure: tossing a grenade into the vent automatically detonates the entire jammer complex without needing to interact with the manual hacking terminal.',
        tip: 'Use the SEAF Artillery mini-nuke shell if available: it destroys jammers from across the map outside the electronic suppression zone.'
      },
      {
        heading: '4. Continuous Movement & Fighting on the Retreat',
        content: 'The most fatal mistake beginner Helldivers make is digging in and attempting to kill every enemy in sight. On Difficulty 10, enemy spawns are infinite and yield zero XP. The moment a bug breach or bot drop flare is triggered, drop an EMS mortar or smoke strike to break line of sight and immediately initiate a bounding withdrawal toward the next objective while firing backward.',
        tip: 'Light armor with the Stamina Enhancement booster allows your squad to effortlessly outrun Hunter packs and Automaton patrols.'
      },
      {
        heading: '5. Extraction Perimeter Defense Protocol',
        content: 'When calling the Pelican extraction shuttle, do not crowd the beacon. Set up overlapping fields of fire 40 meters away using Autocannon Sentries placed on elevated rock formations where chargers cannot trample them. Divert approaching swarms toward choke points seeded with Incendiary Mines, and board the shuttle the exact moment the landing ramp touches down.',
        tip: 'The Helldiver holding the super uranium samples should always board first to secure sample extraction for the whole team.'
      }
    ]
  },
  {
    id: 'guide-7',
    title: 'PUBG Mobile: Precision Gyroscope Recoil Control & Competitive Zone Rotations',
    game: 'PUBG Mobile',
    difficulty: 'Intermediate',
    estimatedReadingTime: '8 min',
    shortDescription: 'Calibrate ADS gyroscope sensitivity, master four-finger claw ergonomics, and execute clean vehicular compound rotations.',
    category: 'Tips & Tricks',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. Gyroscope Aiming Calibration: Separating ADS from Camera Movement',
        content: 'Top competitive esports players utilize full-time Gyroscope ("Always On"). This decouples macro aiming (handled by thumb swipes on the glass) from micro-recoil compensation (handled by physically tilting the device). Set your Red Dot and 2x ADS Gyroscope sensitivity between 280% and 340%, allowing slight wrist tilts to cleanly counteract the upward recoil climb of the M416 or Beryl M762 without requiring continuous finger dragging down the screen.',
        tip: 'Practice in the Cheer Park training grounds: pull down with your wrists in a slow, smooth arc while holding full-auto spray at 50m targets.'
      },
      {
        heading: '2. Four-Finger Claw Layout Ergonomics',
        content: 'Two-thumb controls restrict you to performing only two actions simultaneously (e.g. moving and aiming), preventing you from jumping, crouching, or leaning while shooting. Transitioning to a 4-finger claw layout moves the Shoot button to the top-left index finger and the Aim/Jump/Crouch buttons to the top-right index finger. This enables simultaneous peek-and-fire maneuvers, allowing you to slice corners with minimal body exposure.',
        tip: 'Enable "Peek & Open Scope" in basic settings to streamline your target acquisition speed by 200 milliseconds.'
      },
      {
        heading: '3. Early Game Vehicle Acquisition & Hard Compound Priority',
        content: 'In ranked matches on Erangel or Miramar, dropping on a vehicle spawn along main roadways is more vital than landing directly at high-tier loot compounds. Securing a Dacia or UAZ within the first 60 seconds lets your squad loot uncontested remote complexes and rotate into center-circle fortified two-story buildings before rival squads finish parachuting.',
        tip: 'Always park vehicles indoors or behind brick walls, and burst the outer tires to prevent enemies from shooting under the chassis at your feet.'
      },
      {
        heading: '4. Zone Rotation Strategy: Center-Camping vs Edge-Playing',
        content: 'In Phase 1 and 2, center-circle positioning in a defensible concrete compound provides safety and minimizes fuel consumption. However, from Phase 4 onward, edge-playing along the weak side of the Blue Zone (the side with the smallest distance between the white and blue borders) prevents enemies from attacking your rear, allowing your squad to gatekeep retreating squads as the zone closes.',
        tip: 'Carry at least 4 smoke grenades per player: smokes create emergency visual walls for reviving teammates and crossing open wheat fields.'
      },
      {
        heading: '5. Bullet Drop & Velocity Compensation on Sniper Rifles',
        content: 'The AWM, M24, and Kar98k feature distinct muzzle velocities. The Kar98k fires a heavier 7.62mm round at 760 m/s with noticeable drop past 200 meters, requiring you to aim approximately half a head above the target. In contrast, 5.56mm DMRs like the Mini-14 travel at 990 m/s with virtually laser-flat trajectory, making them vastly superior for tagging moving vehicle drivers across long distances.',
        tip: 'Equip an angled foregrip on spraying assault rifles to cut horizontal recoil bounce, which cannot be reliably compensated with gyroscope alone.'
      }
    ]
  }
];

export const MOCK_FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'all', name: 'All Discussions', description: 'Browse all active conversations across Game Vault Forum', topicCount: 0 },
  { id: 'general', name: 'General Gaming', description: 'Gaming discussions, industry opinions, trends and casual conversations', topicCount: 0 },
  { id: 'pc', name: 'PC Gaming', description: 'PC games, hardware builds, settings, modding and performance optimization', topicCount: 0 },
  { id: 'playstation', name: 'PlayStation', description: 'PS5, PS VR2, PlayStation Studios releases and platform discussions', topicCount: 0 },
  { id: 'xbox', name: 'Xbox', description: 'Xbox Series X|S, Game Pass, backward compatibility and first-party titles', topicCount: 0 },
  { id: 'nintendo', name: 'Nintendo', description: 'Nintendo Switch, upcoming hardware, Zelda, Mario and handheld favorites', topicCount: 0 },
  { id: 'mobile', name: 'Mobile Gaming', description: 'Android and iOS high-end gaming, emulation, and controller accessories', topicCount: 0 },
  { id: 'multiplayer', name: 'Multiplayer', description: 'Online games, clans, squad recruitment and co-op tactical play', topicCount: 0 },
  { id: 'help', name: 'Gaming Help', description: 'Troubleshooting errors, build advice, technical support and boss tips', topicCount: 0 },
  { id: 'community', name: 'Game Vault Forum Community', description: 'YouTube channel updates, video suggestions, site feedback & announcements', topicCount: 0 }
];

export const MOCK_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'topic-1',
    likes: 18,
    title: 'Game Vault Forum Official Announcement: YouTube Channel Road Map & 2026 Schedule',
    author: {
      id: 'usr_joel_ayuba',
      name: 'Joel Ayuba',
      username: '@joel_ayuba',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'Founder',
      isStaff: true
    },
    category: 'Game Vault Forum Community',
    repliesCount: 3,
    views: 142,
    lastActivity: '35 mins ago',
    timestamp: 'Yesterday at 4:15 PM',
    date: 'Sep 18, 2026',
    isPinned: true,
    tags: ['Announcement', 'YouTube', 'Roadmap'],
    initialPost: `Welcome everyone to the new Game Vault Forum! 
    
Our YouTube channel is scaling up production with dedicated deep dive essays, tactical game analyses, and honest hardware comparisons. This forum is built to give our community a home away from the chaos of generic social platforms. 

Share your video requests, talk gaming with civil peers, and let us know what features you want next in the Vault!`,
    replies: [
      {
        id: 'reply-top1-1',
        author: {
          id: 'usr_nordic_blade',
          name: 'NordicBlade',
          username: '@nordic_blade',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
          badge: 'Veteran',
          role: 'Community Strategist'
        },
        content: 'Super excited for the 2026 schedule! The tactical video breakdown on World of Warships ballistics was one of the clearest explanations of armor angling on YouTube. Would love to see a deep dive on Monster Hunter Wilds weapon motion values next!',
        timestamp: 'Yesterday at 5:30 PM',
        likes: 7
      },
      {
        id: 'reply-top1-2',
        author: {
          id: 'usr_joel_ayuba',
          name: 'Joel Ayuba',
          username: '@joel_ayuba',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          badge: 'Founder',
          isStaff: true,
          role: 'Vault Overseer'
        },
        content: '@NordicBlade Glad you enjoyed the ballistics analysis! Monster Hunter Wilds motion values and the new Focus Strike system are already on our production slate for next week. Keep an eye on the dispatch feed.',
        timestamp: 'Yesterday at 6:15 PM',
        likes: 11,
        replyToAuthor: 'NordicBlade'
      },
      {
        id: 'reply-top1-3',
        author: {
          id: 'usr_tactical_guest',
          name: 'Operative_Apex',
          username: '@operative_apex',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          badge: 'Tactical Analyst',
          role: 'Forum Contributor'
        },
        content: 'Really appreciate having a clean, dedicated forum space for long-form discussion without algorithm feed noise. The community guides are already top tier.',
        timestamp: '4 hours ago',
        likes: 4
      }
    ]
  },
  {
    id: 'topic-2',
    likes: 24,
    title: 'Why do modern open-world games struggle with meaningful exploration after Elden Ring?',
    author: {
      id: 'usr_nordic_blade',
      name: 'NordicBlade',
      username: '@nordic_blade',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      badge: 'Veteran'
    },
    category: 'General Gaming',
    repliesCount: 2,
    views: 189,
    lastActivity: '18 hours ago',
    timestamp: '2 days ago',
    date: 'Sep 17, 2026',
    isPinned: false,
    tags: ['Open World', 'Game Design', 'Elden Ring'],
    initialPost: `I find it almost impossible to enjoy traditional map-clearing games anymore with 500 checklist icons. Elden Ring worked because landmark silhouettes drew the eye, and subterranean surprises rewarded genuine curiosity. Why are so few major studios copying this philosophy?`,
    replies: [
      {
        id: 'reply-top2-1',
        author: {
          id: 'usr_shadow_walker',
          name: 'ChromaRanger',
          username: '@chroma_ranger',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          badge: 'Lore Scholar',
          role: 'Explorer'
        },
        content: 'You hit the nail on the head. Most open-world games design the map as a menu screen disguised as terrain — you look at the compass bar or mini-map 80% of the time. In Elden Ring, sightlines dictate travel. When you see a coliseum on a distant crag, you navigate by land geometry.',
        timestamp: '1 day ago',
        likes: 15
      },
      {
        id: 'reply-top2-2',
        author: {
          id: 'usr_nordic_blade',
          name: 'NordicBlade',
          username: '@nordic_blade',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
          badge: 'Veteran',
          role: 'Community Strategist'
        },
        content: 'Exactly @ChromaRanger. And studios are terrified players will miss content if they don\'t put a yellow waypoint marker over it. But finding a secret elevator down to Siofra River organically is 100x more memorable precisely because it wasn\'t promised on a checklist.',
        timestamp: '18 hours ago',
        likes: 12,
        replyToAuthor: 'ChromaRanger'
      }
    ]
  },
  {
    id: 'topic-3',
    likes: 19,
    title: 'RTX 5000 Series vs OLED Gaming Monitors: Where should you spend your upgrade budget first?',
    author: {
      id: 'usr_frame_pacer',
      name: 'FramePacer',
      username: '@frame_pacer',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
      badge: 'Hardware Sage'
    },
    category: 'PC Gaming',
    repliesCount: 1,
    views: 115,
    lastActivity: '1 hour ago',
    timestamp: '3 days ago',
    date: 'Sep 16, 2026',
    tags: ['Hardware', 'GPU', 'OLED', 'Tech'],
    initialPost: `If you are currently on an RTX 3080 / 4070 with an IPS 1440p monitor, do NOT buy a new GPU yet. Buying a 240Hz QD-OLED monitor will transform every single game you own instantly due to infinite contrast and near-instant pixel response times. Thoughts?`,
    replies: [
      {
        id: 'reply-top3-1',
        author: {
          id: 'usr_oled_fan',
          name: 'PhotonPixel',
          username: '@photon_pixel',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
          badge: 'Display Guru',
          role: 'Hardware Analyst'
        },
        content: 'Always OLED first! A 240Hz QD-OLED display improves every single frame your existing GPU produces. Perfect black levels and instantaneous 0.03ms pixel response times elevate games even running on an RTX 3070 more than a 5080 on a dull IPS panel.',
        timestamp: '2 days ago',
        likes: 16
      }
    ]
  },
  {
    id: 'topic-4',
    likes: 14,
    title: 'Helldivers 2 Super Helldive Squad Coordination Tactics & Stratagem loadouts',
    author: {
      id: 'usr_major_vanguard',
      name: 'MajorVanguard',
      username: '@major_vanguard',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      badge: 'Super Citizen'
    },
    category: 'Multiplayer',
    repliesCount: 1,
    views: 94,
    lastActivity: '2 hours ago',
    timestamp: '4 days ago',
    date: 'Sep 15, 2026',
    tags: ['Helldivers 2', 'Co-op', 'Loadouts'],
    initialPost: `Looking to assemble a regular 4-player squad for Automaton level 10 operations. We run staggered EMS mortars, Spear anti-heavy armor, and shield generators. Reply with your Discord handle and preferred playstyle!`,
    replies: [
      {
        id: 'reply-top4-1',
        author: {
          id: 'usr_dps_diver',
          name: 'SuperDestroyer_One',
          username: '@super_destroyer_one',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          badge: 'Hellpod Specialist',
          role: 'Heavy Weapons'
        },
        content: 'I run dedicated Spear + Supply Pack for continuous heavy armor stripping against Factory Striders. Count me in for Friday evening Super Helldives.',
        timestamp: '3 hours ago',
        likes: 5
      }
    ]
  },
  {
    id: 'topic-5',
    likes: 8,
    title: 'PlayStation State of Play reactions: What are you most excited for in 2026/2027?',
    author: {
      id: 'usr_sony_sentry',
      name: 'SonySentry',
      username: '@sony_sentry',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'Member'
    },
    category: 'PlayStation',
    repliesCount: 0,
    views: 78,
    lastActivity: '5 hours ago',
    timestamp: '5 days ago',
    date: 'Sep 14, 2026',
    tags: ['PlayStation', 'State of Play', 'PS5 Pro'],
    initialPost: `Curious to hear everyone's impressions of the latest showcase. The graphical fidelity leaps are impressive, but what gameplay innovation are you most anticipating?`,
    replies: []
  }
];
