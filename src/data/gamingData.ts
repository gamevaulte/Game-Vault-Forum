import { GamingCategory, PlayableGameMeta } from '../types/gaming';

export const GAMING_CATEGORIES: GamingCategory[] = [
  {
    id: 'arcade-games',
    slug: 'arcade-games',
    title: 'Arcade Games',
    shortTitle: 'Arcade',
    tagline: 'High-octane retro classics, reflex shooters, and neon action',
    description: 'Relive golden era arcade excitement rebuilt for modern browsers with fluid 60 FPS gameplay, synthwave aesthetics, and responsive controls.',
    icon: 'Gamepad2',
    color: '#8B5CF6',
    gradient: 'from-purple-600/30 via-indigo-600/20 to-transparent',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    gameCount: 3
  },
  {
    id: 'puzzle-games',
    slug: 'puzzle-games',
    title: 'Puzzle Games',
    shortTitle: 'Puzzle',
    tagline: 'Brainteasers, logic matrices, and tactical spatial challenges',
    description: 'Sharpen your mental acuity and pattern recognition with captivating puzzle mechanics ranging from mathematical merges to tactical mine detection.',
    icon: 'Brain',
    color: '#3B82F6',
    gradient: 'from-blue-600/30 via-cyan-600/20 to-transparent',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    gameCount: 3
  },
  {
    id: 'sports-games',
    slug: 'sports-games',
    title: 'Sports Games',
    shortTitle: 'Sports',
    tagline: 'Precision physics, clutch buzzer beaters, and penalty showdowns',
    description: 'Step onto the virtual pitch, court, and arena with physics-driven sports simulations tailored for quick competitive gaming sessions.',
    icon: 'Trophy',
    color: '#10B981',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    bannerImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&auto=format&fit=crop&q=80',
    gameCount: 3
  },
  {
    id: 'strategy-games',
    slug: 'strategy-games',
    title: 'Strategy Games',
    shortTitle: 'Strategy',
    tagline: 'Deep tactical warfare, tower defenses, and grandmaster maneuvers',
    description: 'Outthink opponents through resource allocation, tactical grid positioning, defensive turret mazes, and classic board game supremacy.',
    icon: 'Shield',
    color: '#F59E0B',
    gradient: 'from-amber-600/30 via-orange-600/20 to-transparent',
    bannerImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&auto=format&fit=crop&q=80',
    gameCount: 3
  },
  {
    id: 'multiplayer-games',
    slug: 'multiplayer-games',
    title: 'Multiplayer Games',
    shortTitle: 'Multiplayer',
    tagline: 'Head-to-head live online duels, friend invites, and lobbies',
    description: 'Challenge fellow Game Vault operatives in real-time online matches using unique invite links, synchronized turn engines, and live game states.',
    icon: 'Users',
    color: '#EC4899',
    gradient: 'from-pink-600/30 via-purple-600/20 to-transparent',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    gameCount: 3
  },
  {
    id: 'card-and-board-games',
    slug: 'card-and-board-games',
    title: 'Card and Board Games',
    shortTitle: 'Card & Board',
    tagline: 'Timeless table games, deck building, solitaire, and 21',
    description: 'Experience refined tabletop simulations from classic Klondike Solitaire and Blackjack to strategic Draughts checkers with authentic rules.',
    icon: 'Layers',
    color: '#06B6D4',
    gradient: 'from-cyan-600/30 via-sky-600/20 to-transparent',
    bannerImage: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1200&auto=format&fit=crop&q=80',
    gameCount: 3
  }
];

export const PLAYABLE_GAMES: PlayableGameMeta[] = [
  // ================= Arcade Games =================
  {
    id: 'space-invaders',
    slug: 'space-invaders',
    title: 'Space Invaders',
    categoryId: 'arcade-games',
    categoryName: 'Arcade Games',
    categorySlug: 'arcade-games',
    tagline: 'Defend Earth against advancing alien waves in this retro arcade classic',
    description: 'Pilot your laser cannon along the base perimeter to eliminate descending alien formations before they reach the ground. Dodge bombs, use defensive bunker shields, and shoot mystery UFO motherships.',
    howToPlay: [
      'Move your laser cannon horizontally along the bottom baseline.',
      'Fire laser pulses upwards to blast invading alien rows.',
      'Hide beneath protective bunkers to avoid enemy projectile fire.',
      'Clear the entire fleet to advance to faster, higher-scoring waves.'
    ],
    controls: [
      { key: 'A / D or ← / →', action: 'Move Cannon Left & Right' },
      { key: 'Spacebar', action: 'Fire Laser Pulse' },
      { key: 'P or Esc', action: 'Pause Game' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Arcade', 'Retro', 'Shooter', 'Sci-Fi'],
    playUrl: '/play-games/arcade-games/space-invaders',
    features: ['Retro Pixel Visuals', 'Shield Bunkers', 'Dynamic Wave Scaling', 'High Score Persistence']
  },
  {
    id: 'neon-snake',
    slug: 'neon-snake',
    title: 'Neon Snake',
    categoryId: 'arcade-games',
    categoryName: 'Arcade Games',
    categorySlug: 'arcade-games',
    tagline: 'Maneuver a sleek cybernetic viper through an electrified grid',
    description: 'Guide your cyber snake across an electrified grid to consume energy nodes. With each node consumed, your length and speed increase. Avoid colliding with grid boundaries or your own tail.',
    howToPlay: [
      'Direct the neon snake across the cyber grid using arrow keys or WASD.',
      'Consume glowing energy power orbs to increase your score and length.',
      'Avoid running into outer border walls or colliding into your own body.',
      'Chain rapid consumptions to activate score multipliers.'
    ],
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Change Snake Direction' },
      { key: 'Spacebar', action: 'Pause / Resume' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Easy',
    tags: ['Arcade', 'Casual', 'Cyberpunk', 'Classic'],
    playUrl: '/play-games/arcade-games/neon-snake',
    features: ['Cyberpunk Neon Trail', 'Fluid Smooth Movement', 'Dynamic Speed Tiers', 'Touch Controls']
  },
  {
    id: 'brick-breaker',
    slug: 'brick-breaker',
    title: 'Brick Breaker',
    categoryId: 'arcade-games',
    categoryName: 'Arcade Games',
    categorySlug: 'arcade-games',
    tagline: 'Shatter multi-layered prism vaults with high-velocity deflections',
    description: 'Control a high-energy paddle to bounce plasma orbs into defense bricks. Break through multiple durable tiers, collect falling powerups, and clear the vault without letting the orb drop.',
    howToPlay: [
      'Glide the paddle horizontally to intercept and deflect the plasma orb.',
      'Angle your hits: striking near the paddle edges launches sharper deflection angles.',
      'Shatter all bricks in the chamber to advance to the next level.',
      'Maintain your lives and catch special power boosts.'
    ],
    controls: [
      { key: 'Mouse or ← / →', action: 'Move Deflection Paddle' },
      { key: 'Spacebar / Click', action: 'Launch Ball' },
      { key: 'P', action: 'Pause / Resume' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Arcade', 'Breakout', 'Physics', 'Action'],
    playUrl: '/play-games/arcade-games/brick-breaker',
    features: ['Precision Angular Physics', 'Multi-Hit Bricks', 'Power-up Drops', 'Level Progression']
  },

  // ================= Puzzle Games =================
  {
    id: '2048',
    slug: '2048',
    title: '2048 Neon Edition',
    categoryId: 'puzzle-games',
    categoryName: 'Puzzle Games',
    categorySlug: 'puzzle-games',
    tagline: 'Slide and combine matching tiles to reach the legendary 2048 core',
    description: 'A stylish dark-mode adaptation of the beloved sliding tile puzzle. Merge identical numeric nodes to double their value, carefully planning each turn so the 4x4 matrix does not lock up.',
    howToPlay: [
      'Swipe or use arrow keys to slide all tiles in one of four directions.',
      'When two tiles with the same number collide, they merge into one with double value.',
      'A new tile (2 or 4) spawns randomly into an empty slot after each slide.',
      'Reach the 2048 tile to conquer the core, or keep playing for endless high scores.'
    ],
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Slide Grid Tiles' },
      { key: 'U', action: 'Undo Last Move' },
      { key: 'R', action: 'Restart Game' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Puzzle', 'Math', 'Strategy', 'Brain'],
    playUrl: '/play-games/puzzle-games/2048',
    features: ['Neon Glow Accents', 'Step-by-Step Undo', 'Score & Best Memory', 'Mobile Swipe Gestures']
  },
  {
    id: 'minesweeper',
    slug: 'minesweeper',
    title: 'Minesweeper Tactical',
    categoryId: 'puzzle-games',
    categoryName: 'Puzzle Games',
    categorySlug: 'puzzle-games',
    tagline: 'Deduce hidden explosive charges across an operative minefield',
    description: 'Deploy logical deduction to uncover safe squares across an encrypted grid while flagging hidden anti-personnel mines. Clues indicate the exact number of adjacent hazards.',
    howToPlay: [
      'Left-click on any cell to reveal it.',
      'Numbered squares indicate exactly how many mines touch that specific cell.',
      'Right-click or hold to plant warning flags on suspected mine positions.',
      'Clear all non-mine cells to complete the tactical clearance.'
    ],
    controls: [
      { key: 'Left Click', action: 'Reveal Tile' },
      { key: 'Right Click / Flag Mode', action: 'Flag / Unflag Mine' },
      { key: 'R', action: 'Reset Minefield' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Hard',
    tags: ['Puzzle', 'Logic', 'Classic', 'Tactical'],
    playUrl: '/play-games/puzzle-games/minesweeper',
    features: ['3 Difficulty Tiers (Recruit, Operative, Veteran)', 'Flagging Mode Toggle', 'Precision Timer', 'Zero-Explosion First Click']
  },
  {
    id: 'memory-match',
    slug: 'memory-match',
    title: 'Memory Matrix',
    categoryId: 'puzzle-games',
    categoryName: 'Puzzle Games',
    categorySlug: 'puzzle-games',
    tagline: 'Test your spatial recall by matching pairs of gamer insignias',
    description: 'Flip holographic cards to uncover pairs of matching gaming artifacts, weapon relics, and operative badges. Minimize moves and beat the timer to test your visual memory.',
    howToPlay: [
      'Click a card to flip it face up.',
      'Click a second card to find its matching pair.',
      'If they match, both cards stay revealed. If they differ, both flip face down.',
      'Match all pairs across the matrix in the fewest attempts possible.'
    ],
    controls: [
      { key: 'Mouse Click / Tap', action: 'Flip Target Card' },
      { key: 'R', action: 'Shuffle & Restart' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Easy',
    tags: ['Puzzle', 'Memory', 'Casual', 'Cards'],
    playUrl: '/play-games/puzzle-games/memory-match',
    features: ['Smooth 3D Card Flips', 'Combo Streak Counters', 'Timer & Move Tracker', 'Distinctive Gaming Icons']
  },

  // ================= Sports Games =================
  {
    id: 'cyber-pong',
    slug: 'cyber-pong',
    title: 'Cyber Pong',
    categoryId: 'sports-games',
    categoryName: 'Sports Games',
    categorySlug: 'sports-games',
    tagline: 'Futuristic table tennis showdown with ball curve physics and AI duel',
    description: 'Go head-to-head against an adaptive AI opponent in an electrified neon arena. Curve your returns, exploit paddle deflection velocities, and be the first to score 7 points.',
    howToPlay: [
      'Control the left player paddle to defend your goal line.',
      'Hit the ball while moving your paddle to impart angular spin and velocity.',
      'Deflect the cyber ball past the AI opponent to score points.',
      'First competitor to score 7 points claims victory in the match.'
    ],
    controls: [
      { key: 'W / S or ↑ / ↓', action: 'Move Player Paddle' },
      { key: 'Mouse / Touch Drag', action: 'Direct Paddle Control' },
      { key: 'Spacebar', action: 'Pause / Resume' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Sports', 'Retro', 'Table Tennis', 'Physics'],
    playUrl: '/play-games/sports-games/cyber-pong',
    features: ['Adaptive AI Difficulty', 'Ball Spin & Speed Boosts', 'Neon Particle FX', 'Tactile Audio Feedback']
  },
  {
    id: 'free-throw-basketball',
    slug: 'free-throw-basketball',
    title: 'Free Throw Challenge',
    categoryId: 'sports-games',
    categoryName: 'Sports Games',
    categorySlug: 'sports-games',
    tagline: 'Lock in shooting arcs and sink clutch baskets from the charity stripe',
    description: 'Step up to the free-throw line with real arc trajectory physics. Time your shooting gauge for perfect release, account for shifting basket distances, and rack up consecutive swishes.',
    howToPlay: [
      'Aim your trajectory angle towards the basketball hoop.',
      'Press and hold to charge the shot power meter into the sweet spot.',
      'Release at the apex to launch the ball towards the basket.',
      'Score consecutive baskets to earn fire-streak multipliers.'
    ],
    controls: [
      { key: 'Click & Drag', action: 'Aim Arc Trajectory' },
      { key: 'Spacebar / Release', action: 'Release Basketball Shot' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Sports', 'Basketball', 'Physics', 'Arcade'],
    playUrl: '/play-games/sports-games/free-throw-basketball',
    features: ['Realistic Parabolic Physics', 'Rim & Net Collisions', 'Hot-Hand Streak Counter', 'Wind & Distance Dynamics']
  },
  {
    id: 'penalty-shootout',
    slug: 'penalty-shootout',
    title: 'Penalty Shootout',
    categoryId: 'sports-games',
    categoryName: 'Sports Games',
    categorySlug: 'penalty-shootout',
    tagline: 'Aim for the top corner and beat the goalkeeper in sudden-death kicks',
    description: 'Face off against an acrobatic goalkeeper in a high-stakes penalty shootout. Pick your target corner, dial in curve and elevation, and convert five decisive spot kicks.',
    howToPlay: [
      'Select your shot destination inside the goal frame (corners are toughest to stop).',
      'Set shot power and curve by timing the oscillating indicator.',
      'Kick the ball and observe the goalkeeper dive reaction.',
      'Outscore the computer across a 5-round shootout to hoist the trophy.'
    ],
    controls: [
      { key: 'Mouse Click / Aim', action: 'Target Goal Spot' },
      { key: 'Spacebar / Kick', action: 'Time Power Meter' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Hard',
    tags: ['Sports', 'Soccer', 'Football', 'Shootout'],
    playUrl: '/play-games/sports-games/penalty-shootout',
    features: ['Dynamic Goalie AI Dives', 'Post & Crossbar Rebounds', 'Sudden Death Mode', 'Precision Corner Scoring']
  },

  // ================= Strategy Games =================
  {
    id: 'tactical-chess',
    slug: 'tactical-chess',
    title: 'Tactical Chess',
    categoryId: 'strategy-games',
    categoryName: 'Strategy Games',
    categorySlug: 'strategy-games',
    tagline: 'Master the ultimate 64-square battlefield with grandmaster AI',
    description: 'The definitive strategy board game with legal move highlighting, checkmate detection, pawn promotions, and versatile AI difficulty modes from novice to club player.',
    howToPlay: [
      'Click on any piece to view all legal moves highlighted on the board.',
      'Click a valid destination square to move your piece.',
      'Protect your King while placing the opposing King into inescapable Checkmate.',
      'Special rules like castling, en passant, and pawn promotions are fully supported.'
    ],
    controls: [
      { key: 'Left Click', action: 'Select Piece & Move' },
      { key: 'Flip Board', action: 'Switch White / Black Perspective' },
      { key: 'Undo', action: 'Take Back Move' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Hard',
    tags: ['Strategy', 'Chess', 'Board', 'AI'],
    playUrl: '/play-games/strategy-games/tactical-chess',
    features: ['Standard Chess Engine', 'Legal Move Guides', 'Checkmate & Stalemate Detection', 'FEN Board State Tracker']
  },
  {
    id: 'tower-defense',
    slug: 'tower-defense',
    title: 'Vault Core Defense',
    categoryId: 'strategy-games',
    categoryName: 'Strategy Games',
    categorySlug: 'strategy-games',
    tagline: 'Erect specialized defense turrets to halt incoming cyber assault waves',
    description: 'Place Gatling turrets, Tesla coils, and Cryo beam towers along the invading pathway to protect the Vault reactor core from 15 escalating waves of robotic assailants.',
    howToPlay: [
      'Select a defense tower type from the build panel on the right.',
      'Click on an open grid cell along the enemy pathway to construct the turret.',
      'Earn credits by destroying invaders and upgrade turret range and firepower.',
      'Defeat all 15 waves without letting your Core Health fall to zero.'
    ],
    controls: [
      { key: '1, 2, 3', action: 'Select Turret Type' },
      { key: 'Mouse Click', action: 'Place / Upgrade Turret' },
      { key: 'Spacebar', action: 'Start Wave / Speed Up' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Strategy', 'Tower Defense', 'Tactical', 'Sci-Fi'],
    playUrl: '/play-games/strategy-games/tower-defense',
    features: ['3 Unique Turret Types', 'Pathfinding Wave Enemies', 'Tower Upgrades & Stats', 'Reactor Health Monitor']
  },
  {
    id: 'naval-command',
    slug: 'naval-command',
    title: 'Naval Fleet Command',
    categoryId: 'strategy-games',
    categoryName: 'Strategy Games',
    categorySlug: 'strategy-games',
    tagline: 'Command warships and locate enemy vessels on a tactical sea grid',
    description: 'Secretly deploy your aircraft carrier, battleship, cruiser, submarine, and destroyer on the oceanic coordinate grid. Take alternating radar salvos to sink the enemy armada.',
    howToPlay: [
      'Position your 5 naval vessels on your 10x10 oceanic map grid.',
      'Take turns firing artillery salvos into enemy grid coordinates.',
      'Red markers indicate confirmed hits; white markers indicate sea splashes.',
      'Sink all five enemy warships before the opponent locates your armada.'
    ],
    controls: [
      { key: 'Click & Rotate', action: 'Place Warships (H / V)' },
      { key: 'Click Grid', action: 'Launch Radar Salvo' },
      { key: 'R', action: 'Rotate Ship Placement' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Strategy', 'Battleship', 'Naval', 'Turn-Based'],
    playUrl: '/play-games/strategy-games/naval-command',
    features: ['10x10 Grid Radar', '5 Authentic Fleet Classes', 'Tactical AI Targeting', 'Sonar Hit Audio']
  },

  // ================= Multiplayer Games =================
  {
    id: 'connect-four',
    slug: 'connect-four',
    title: 'Connect Four',
    categoryId: 'multiplayer-games',
    categoryName: 'Multiplayer Games',
    categorySlug: 'multiplayer-games',
    tagline: 'Drop chips into the vertical grid to connect four in a row',
    description: 'The ultimate two-player strategy game. Play locally against smart AI, or click "Invite a Friend" to generate a secure multiplayer link and battle another signed-in player live!',
    howToPlay: [
      'Players alternate dropping discs into one of seven columns.',
      'Discs fall down to the lowest unoccupied space within the column.',
      'Connect four of your color discs horizontally, vertically, or diagonally to win.',
      'Block your opponent from forming their four-in-a-row connection.'
    ],
    controls: [
      { key: 'Click Column', action: 'Drop Colored Disc' },
      { key: '1 - 7 Keys', action: 'Keyboard Column Drop' },
      { key: 'Invite a Friend', action: 'Create Live Multiplayer Session' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: true,
    difficulty: 'Easy',
    tags: ['Multiplayer', 'Board', 'Turn-Based', 'Classic'],
    playUrl: '/play-games/multiplayer-games/connect-four',
    features: ['Online Multiplayer with Token Invites', 'Real-Time Firestore Sync', 'Live Lobby & Chat Link', 'Smart AI Offline Mode']
  },
  {
    id: 'tic-tac-toe',
    slug: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Ultra',
    categoryId: 'multiplayer-games',
    categoryName: 'Multiplayer Games',
    categorySlug: 'multiplayer-games',
    tagline: 'High-energy cyber grid duel with real-time multiplayer invites',
    description: 'Quick, competitive 3x3 and 4x4 grid warfare. Play against computer AI or invite any signed-in friend to an instant online duel with synchronized turns and scoreboards.',
    howToPlay: [
      'Take turns placing your symbol (X or O) onto an open cell.',
      'Align three (or four) symbols in a horizontal, vertical, or diagonal line.',
      'If all cells are occupied without a line, the match ends in a draw.',
      'Invite a friend via unique link for live head-to-head multiplayer.'
    ],
    controls: [
      { key: 'Click Grid Cell', action: 'Place X or O' },
      { key: 'Invite a Friend', action: 'Create Live Multiplayer Session' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: true,
    difficulty: 'Casual',
    tags: ['Multiplayer', 'Logic', 'Quick Play', 'PvP'],
    playUrl: '/play-games/multiplayer-games/tic-tac-toe',
    features: ['Instant Online Invites', '3x3 & 4x4 Grid Modes', 'Real-Time Turn Notifications', 'Match Series Scoreboard']
  },
  {
    id: 'naval-duel',
    slug: 'naval-duel',
    title: 'Naval Fleet Duel',
    categoryId: 'multiplayer-games',
    categoryName: 'Multiplayer Games',
    categorySlug: 'multiplayer-games',
    tagline: 'Live 2-player naval combat duel across synchronized ocean maps',
    description: 'Engage another signed-in player in a real-time naval artillery battle. Both players deploy their armada and take turns firing radar salvos across Firestore synchronized sessions.',
    howToPlay: [
      'Create or join a session using an invitation link.',
      'Deploy your fleet secretly on your personal ocean grid.',
      'Once both players are ready, take turns calling coordinates to hit enemy ships.',
      'First commander to sink the opponent\'s entire naval armada claims victory.'
    ],
    controls: [
      { key: 'Click Ocean Grid', action: 'Launch Radar Strike' },
      { key: 'Invite a Friend', action: 'Generate Session Token' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: true,
    difficulty: 'Medium',
    tags: ['Multiplayer', 'Naval', 'Strategy', 'Real-Time'],
    playUrl: '/play-games/multiplayer-games/naval-duel',
    features: ['2-Player Real-Time Firestore Sync', 'Secret Ship Placement', 'Live Salvo Animations', 'Turn Clock']
  },

  // ================= Card and Board Games =================
  {
    id: 'blackjack',
    slug: 'blackjack',
    title: 'Classic Blackjack 21',
    categoryId: 'card-and-board-games',
    categoryName: 'Card and Board Games',
    categorySlug: 'card-and-board-games',
    tagline: 'Test your nerve against the virtual dealer with Vegas rules and chips',
    description: 'Play authentic casino blackjack with standard 52-card decks. Hit, Stand, Double Down, or Split pairs while managing your virtual bankroll and aiming for that sweet natural 21.',
    howToPlay: [
      'Place your wager using virtual chips ($5, $25, $100, $500).',
      'Receive your two face-up cards; the dealer shows one up-card.',
      'Choose to Hit (take another card) or Stand (keep your hand total).',
      'Beat the dealer\'s hand without exceeding 21 to double your bet.'
    ],
    controls: [
      { key: 'Hit (H)', action: 'Request Additional Card' },
      { key: 'Stand (S)', action: 'End Turn & Hold Total' },
      { key: 'Double (D)', action: 'Double Wager & Draw One Card' },
      { key: 'Deal (Space)', action: 'Deal New Hand' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Card', 'Casino', 'Blackjack', 'Strategy'],
    playUrl: '/play-games/card-and-board-games/blackjack',
    features: ['Vegas 3:2 Blackjack Payout', 'Double Down & Insurance', 'Realistic Chip Stacks', 'Bankroll Reset Option']
  },
  {
    id: 'solitaire',
    slug: 'solitaire',
    title: 'Klondike Solitaire',
    categoryId: 'card-and-board-games',
    categoryName: 'Card and Board Games',
    categorySlug: 'solitaire',
    tagline: 'The timeless single-player patience card game with smooth drag-and-drop',
    description: 'Build four foundation piles from Ace to King by suit while stacking alternating red and black cards in descending tableau columns. Features Draw 1 or Draw 3 modes and auto-complete.',
    howToPlay: [
      'Move Aces to the four foundation piles at the top right as they appear.',
      'Build foundation piles upwards by matching suit (A, 2, 3 ... K).',
      'In the tableau columns, stack cards in descending order with alternating colors.',
      'Draw cards from the stockpile to unlock new moves across the board.'
    ],
    controls: [
      { key: 'Click / Drag & Drop', action: 'Move Card or Column' },
      { key: 'Stockpile Click', action: 'Draw New Cards' },
      { key: 'Undo (U)', action: 'Revert Previous Move' },
      { key: 'Auto Complete', action: 'Finish Solved Foundation' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Card', 'Solitaire', 'Classic', 'Patience'],
    playUrl: '/play-games/card-and-board-games/solitaire',
    features: ['Draw 1 & Draw 3 Modes', 'Step-by-Step Undo', 'Auto-Finish Solved Boards', 'Timer & Move Scoring']
  },
  {
    id: 'checkers',
    slug: 'checkers',
    title: 'Classic Checkers',
    categoryId: 'card-and-board-games',
    categoryName: 'Card and Board Games',
    categorySlug: 'checkers',
    tagline: 'Jump and capture opposing pieces to dominate the dark checkerboard',
    description: 'Draughts played on an 8x8 checkerboard. Advance your pieces diagonally forward, jump over opponent checkers to capture them, and promote pieces to crowned Kings upon reaching the baseline.',
    howToPlay: [
      'Pieces move diagonally forward one square onto dark cells.',
      'Jump over an adjacent enemy piece into an empty square beyond to capture it.',
      'Multi-jumps are rewarded if subsequent captures are available.',
      'Reach the opposing back row to crown your piece into a multi-directional King.'
    ],
    controls: [
      { key: 'Click Piece & Destination', action: 'Make Diagonal Move' },
      { key: 'Undo Move', action: 'Step Back Move' },
      { key: 'AI / 2-Player Toggle', action: 'Switch Opponent Mode' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&auto=format&fit=crop&q=80',
    supportsMultiplayer: false,
    difficulty: 'Medium',
    tags: ['Board', 'Checkers', 'Draughts', 'Strategy'],
    playUrl: '/play-games/card-and-board-games/checkers',
    features: ['Crowned King Mechanics', 'Forced Jump Prompts', 'Smart AI Opponent', 'Pass & Play 2-Player']
  }
];

export function getCategoryById(id: string): GamingCategory | undefined {
  return GAMING_CATEGORIES.find((cat) => cat.id === id || cat.slug === id);
}

export function getCategoryBySlug(slug: string): GamingCategory | undefined {
  return GAMING_CATEGORIES.find((cat) => cat.slug === slug || cat.id === slug);
}

export function getGamesByCategory(categoryId: string): PlayableGameMeta[] {
  return PLAYABLE_GAMES.filter((g) => g.categoryId === categoryId || g.categorySlug === categoryId);
}

export function getGameBySlug(slug: string): PlayableGameMeta | undefined {
  return PLAYABLE_GAMES.find((g) => g.slug === slug || g.id === slug);
}
