import { Video, Game, Article, Review, Guide, ForumTopic, UserAccount, ForumCategory } from '../types';
import { YOUTUBE_CHANNEL } from '../lib/constants';

export { YOUTUBE_CHANNEL };

export const INITIAL_USER: UserAccount = {
  id: 'usr_gv_01',
  name: 'VaultOperative',
  username: '@VaultOperative',
  avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  badge: 'Vault Pioneer',
  reputation: 1420,
  joinDate: 'Jan 2025',
  bookmarks: {
    videos: ['vid-1'],
    games: ['game-1', 'game-3'],
    articles: ['art-1'],
    reviews: ['rev-1'],
    guides: ['guide-1'],
    topics: ['topic-1']
  },
  likedIds: []
};

export const DEFAULT_USER = INITIAL_USER;

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'vid-1',
    title: 'Elden Ring: Shadow of the Erdtree — Ultimate Deep Dive & Lore Analysis',
    shortDescription: 'Unpacking the mysterious Realm of Shadow, Messmer the Impaler, and the mechanical evolution of FromSoftware boss design.',
    description: 'Welcome back to Game Vault Forum! In this comprehensive deep dive, we break down FromSoftware’s massive expansion: dissecting map verticality, scadutree blessing mechanics, boss balance, and lore secrets hidden in the Gravesite Plain.',
    game: 'Elden Ring',
    uploadDate: '3 days ago',
    views: '48.2K',
    duration: '24:18',
    youtubeId: 'K_03fnT8j0A',
    category: 'Deep Dive',
    isFeatured: true,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    likes: 0
  },
  {
    id: 'vid-2',
    title: 'Why World of Warships Is More Interesting Than I Expected — Tactical Analysis',
    shortDescription: 'A modern breakdown of positioning, concealment range, and shell ballistic calculations in naval warfare simulation.',
    description: 'We tested over 200 hours of high-tier naval battles to understand why World of Warships has sustained a fiercely loyal tactical player base for a decade.',
    game: 'World of Warships',
    uploadDate: '1 week ago',
    views: '32.1K',
    duration: '18:45',
    youtubeId: 'q73K94x2P6M',
    category: 'Gameplay',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    likes: 0
  },
  {
    id: 'vid-3',
    title: 'Cyberpunk 2077 in 2026: The Complete Overhaul Journey & Mod Ecosystem',
    shortDescription: 'From redemption arc to gold standard — evaluating Night City after patch 2.1, Phantom Liberty, and community ray-tracing shaders.',
    description: 'Looking back at the greatest turnarounds in modern gaming history. How CD Projekt RED re-engineered character perks, police AI, and dogtown vertical combat.',
    game: 'Cyberpunk 2077',
    uploadDate: '2 weeks ago',
    views: '64.9K',
    duration: '21:04',
    youtubeId: 'UnA7tepsc7s',
    category: 'Review',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    likes: 0
  },
  {
    id: 'vid-4',
    title: 'Helldivers 2 — Galactic War Strategy & Team Mechanics Masterclass',
    shortDescription: 'Coordinated stratagem synergy, armor piercing damage tiers, and supply management for Super Helldive difficulty.',
    description: 'Galactic liberation requires precision teamwork. We examine stratagem cooldowns, staggered reload tactics, and optimal counter-measures for Automatons and Terminids.',
    game: 'Helldivers 2',
    uploadDate: '3 weeks ago',
    views: '27.5K',
    duration: '16:30',
    youtubeId: 'lP_8hPq2VnQ',
    category: 'Guide',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    likes: 0
  },
  {
    id: 'vid-5',
    title: 'The Return of Classic RPGs: Baldur’s Gate 3 Two Years Later',
    shortDescription: 'Evaluating the lasting industry ripples of Larian Studios, CRPG turn-based depth, and player narrative freedom.',
    description: 'A deep reflection on what makes BG3 so endlessly replayable. Exploring Act 3 permutations, companion reactivities, and the bar set for future roleplaying titles.',
    game: "Baldur's Gate 3",
    uploadDate: '1 month ago',
    views: '51.0K',
    duration: '28:12',
    youtubeId: '1T22wN1jl4w',
    category: 'Deep Dive',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    likes: 0
  },
  {
    id: 'vid-6',
    title: 'PC Gaming Optimization: Eliminating Micro-Stutter and Frame Pacing Drops',
    shortDescription: 'Practical tweaks for NVIDIA Reflex, AMD Anti-Lag, shader cache preloading, and Windows timer resolution.',
    description: 'Step-by-step benchmark testing across 5 demanding AAA engines to unlock buttery smooth 144Hz+ gameplay without sacrificing visual fidelity.',
    game: 'PC Tech / Hardware',
    uploadDate: '1 month ago',
    views: '44.8K',
    duration: '19:22',
    youtubeId: '0sOnhD3n3gM',
    category: 'Tech',
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    likes: 0
  }
];

export const MOCK_GAMES: Game[] = [
  {
    id: 'game-1',
    title: 'Elden Ring: Shadow of the Erdtree',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    shortDescription: 'Guided by Empyrean Miquella, players are beckoned to the Land of Shadow, a place obscured by the Erdtree.',
    fullDescription: 'FromSoftware’s magnum opus expansion features an expansive new map seamlessly woven with towering legacy dungeons, punishing boss encounters, and innovative weapon classes. The Scadutree fragment leveling mechanic introduces a fresh progression curve tailored for veteran Tarnished.',
    releaseYear: '2024',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    rating: 9.8,
    artwork: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    tags: ['Soulslike', 'Open World', 'Dark Fantasy', 'Masterpiece'],
    featured: true
  },
  {
    id: 'game-2',
    title: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    shortDescription: 'A high-stakes spy-thriller expansion set in the dangerous district of Dogtown with Idris Elba.',
    fullDescription: 'In the walled combat zone of Dogtown, mercenary V is contracted to save the President of the NUSA. Featuring overhauled perk systems, vehicular combat, dynamic enemy AI, and state-of-the-art ray tracing overdrive visuals.',
    releaseYear: '2023',
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    rating: 9.2,
    artwork: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    tags: ['Cyberpunk', 'Open World', 'Sci-Fi', 'Ray Tracing'],
    featured: true
  },
  {
    id: 'game-3',
    title: "Baldur's Gate 3",
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    shortDescription: 'Gather your party and return to the Forgotten Realms in a tale of fellowship, betrayal, sacrifice, and survival.',
    fullDescription: 'Powered by the D&D 5th edition ruleset, Larian Studios delivers unprecedented player agency. Every choice, dialogue option, and combat action organically reshapes the world and destiny of your companions.',
    releaseYear: '2023',
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    rating: 9.7,
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    tags: ['CRPG', 'Turn-Based', 'Choice Matters', 'Fantasy'],
    featured: true
  },
  {
    id: 'game-4',
    title: 'World of Warships',
    genre: 'Simulation',
    platforms: ['PC'],
    shortDescription: 'The pinnacle naval combat simulator featuring over 600 historically modeled warships and tactical warfare.',
    fullDescription: 'Experience grand naval strategy across legendary battleships, agile destroyers, stealthy cruisers, and aircraft carriers. Master concealment detection circles, armor angling thresholds, and ballistic trajectories.',
    releaseYear: '2015',
    developer: 'Wargaming',
    publisher: 'Wargaming',
    rating: 8.3,
    artwork: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    tags: ['Naval Combat', 'Tactical', 'Free to Play', 'Multiplayer'],
    featured: true
  },
  {
    id: 'game-5',
    title: 'Helldivers 2',
    genre: 'Multiplayer',
    platforms: ['PC', 'PS5'],
    shortDescription: 'Join the Helldivers and fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.',
    fullDescription: 'Squad up with up to four players to deploy catastrophic ordinance against relentless Automaton legions and Terminid swarms. Features emergent ragdoll physics, friendly fire chaos, and a real-time community galactic war effort.',
    releaseYear: '2024',
    developer: 'Arrowhead Game Studios',
    publisher: 'PlayStation Publishing',
    rating: 8.8,
    artwork: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    tags: ['Co-op', 'Shooter', 'PvE', 'Sci-Fi'],
    featured: true
  },
  {
    id: 'game-6',
    title: 'Forza Horizon 5',
    genre: 'Racing',
    platforms: ['PC', 'Xbox'],
    shortDescription: 'Explore the vibrant and ever-evolving open-world landscapes of Mexico with limitless, fun driving action.',
    fullDescription: 'Lead breathtaking expeditions across hundreds of the world’s greatest cars. Race through living deserts, lush rainforests, historic cities, hidden ruins, pristine beaches, and a towering snow-capped volcano.',
    releaseYear: '2021',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    rating: 9.0,
    artwork: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    tags: ['Open World', 'Driving', 'Beautiful', 'Arcade Sim'],
    featured: false
  },
  {
    id: 'game-7',
    title: 'Hollow Knight: Silksong',
    genre: 'Adventure',
    platforms: ['PC', 'Switch', 'PS5', 'Xbox'],
    shortDescription: 'Play as Hornet, princess-protector of Hallownest, and adventure through an all-new kingdom ruled by silk and song.',
    fullDescription: 'The highly anticipated sequel from Team Cherry expands on acrobatic combat, lethal bosses, and exquisite hand-drawn subterranean environments with brand new crafting and trap mechanics.',
    releaseYear: 'Anticipated',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    rating: 9.5,
    artwork: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    tags: ['Metroidvania', 'Souls-like', 'Hand-Drawn', 'Challenging'],
    featured: false
  },
  {
    id: 'game-8',
    title: 'Starfield',
    genre: 'RPG',
    platforms: ['PC', 'Xbox'],
    shortDescription: 'Bethesda Game Studios first new universe in over 25 years — explore over 1,000 uncharted planets in the Settled Systems.',
    fullDescription: 'Embark on an epic journey to answer humanity’s greatest mystery with the space explorer group Constellation. Build custom starships, craft outposts, and customize your character across multiple factions.',
    releaseYear: '2023',
    developer: 'Bethesda Game Studios',
    publisher: 'Bethesda Softworks',
    rating: 7.8,
    artwork: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    tags: ['Space', 'Exploration', 'RPG', 'Customization'],
    featured: false
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-wows',
    title: 'Why World of Warships Is More Interesting Than I Expected — A Tactical Analysis',
    category: 'Tactical Analysis',
    excerpt: 'The more you look at World of Warships through a tactical lens, the less it feels like a conventional shooting game and the more it resembles a constant exercise in positioning, timing, information, risk management, and decision making.',
    content: `There are games that make you feel busy, and then there are games that make you think. Those two things aren't always the same.

At first glance, World of Warships can look like a fairly straightforward naval combat game. You choose a ship, sail toward the opposing team, aim your guns, and try to sink whatever gets in your way. That description isn't exactly wrong, but it misses the part that makes the game surprisingly interesting: the shooting is only one piece of the puzzle.

A battleship can have enormous firepower and still spend most of a match being ineffective. A destroyer with comparatively limited health can influence an entire flank without constantly firing its guns. A cruiser can appear to be in a strong position one minute and become an easy target the next simply because it pushed too far forward. Even a player who has excellent aim can make a terrible decision several minutes before the shot is ever fired.

That's what caught my attention about the game's design.

The more you look at World of Warships through a tactical lens, the less it feels like a conventional shooting game and the more it resembles a constant exercise in positioning, timing, information, risk management, and decision making. The interesting question isn't simply, "Can I hit that ship?" It's also, "Should I be here? What does the enemy know? What happens if I fire now? Which ship should I pressure? When should I retreat?"

That extra layer is what makes a world of warships tactical analysis worthwhile. The game rewards mechanical skill, but it also rewards players who understand situations.

And that's a much more interesting proposition than I initially expected.

## The Shooting Is Important, But It's Not the Whole Game

One of the easiest mistakes to make when looking at World of Warships is to treat it primarily as a game about dealing damage.

Damage obviously matters. Ships need to be damaged or destroyed, and effective gunnery can make a huge difference. But raw damage numbers don't always tell the full story of a battle.

Imagine two players.

The first player spends much of the match firing at whatever enemy ship is easiest to hit. They rack up respectable damage but remain in a predictable position and contribute little to controlling important areas of the map.

The second player may deal less damage, but they pressure an enemy cruiser away from a capture area, discourage a destroyer from approaching, and force a battleship to turn away from a vulnerable flank.

Which player had more influence?

That's where World of Warships becomes interesting. The value of an action isn't always immediately visible on the scoreboard.

Sometimes forcing an enemy to change position is more important than landing another salvo. Sometimes surviving is more valuable than taking an unnecessary shot. Sometimes simply being in a threatening position prevents an opponent from making the move they wanted to make.

This is one of the central ideas behind World of Warships tactics: you're constantly trying to create situations that are favorable to your team while avoiding situations that give the opposing team an easy advantage.

## Positioning Can Matter More Than Firepower

If there's one part of World of Warships positioning that new players can underestimate, it's how difficult it can be to recover from a bad position.

Ships aren't cars. You can't instantly turn around, accelerate away, or disappear behind the nearest obstacle. Once you've committed to a direction, your options can become limited.

That makes positioning a form of preparation.

Consider a battleship moving aggressively toward an enemy flank. At first, the decision may look reasonable. There's an enemy ship ahead, your guns are ready, and you want to get involved.

But what happens if several enemy ships are positioned behind that target?

Suddenly, the battleship has a problem. Turning away may expose vulnerable armor. Continuing forward may result in concentrated fire. The player may still have plenty of health, but their tactical options have disappeared.

This is why good World of Warships ship tactics aren't necessarily about constantly moving forward. Sometimes the strongest position is one that gives you several possible responses.

You want room to disengage.

You want useful firing angles.

You want to avoid being isolated.

You want to understand where the opposing ships are likely to appear.

And, perhaps most importantly, you don't want your next decision to be forced by a mistake you made two minutes earlier.

### The difference between cover and safety

Maps also add another layer to positioning.

Islands and terrain can provide opportunities to break line of sight, create ambush situations, or limit the angles from which you can be attacked. But cover isn't automatically safety.

A player can hide behind an island and still be in a terrible strategic position if their team loses control of the surrounding area.

This is where World of Warships map strategy becomes more nuanced than simply memorizing where the islands are.

You have to think about what the map is allowing both teams to do.

An island might protect you from one enemy ship while leaving you vulnerable to another. A narrow passage might look attractive but become dangerous if the opposing team controls the exits. A capture area might be valuable, but entering it at the wrong moment can turn a potentially useful objective into a trap.

Good positioning is therefore contextual.

There isn't one universally "best" place to stand.

## Different Ships Create Different Tactical Problems

One of the game's strengths is that different ship types encourage different approaches to combat.

You can't approach every ship in exactly the same way and expect the same results.

### Battleships: patience and punishment

Battleships naturally encourage players to think about firepower.

Their large guns can punish exposed opponents, but their size and maneuverability limitations mean that positioning matters enormously. A battleship player who constantly chases targets can find themselves separated from friendly support and surrounded by threats.

Patience becomes part of the strategy.

Sometimes you don't need to fire immediately. Waiting for an enemy cruiser to expose a vulnerable angle can be more valuable than taking a mediocre shot at a heavily angled target.

This is a good example of World of Warships combat strategy being connected to timing. The strongest shot isn't necessarily the first available shot.

### Cruisers: pressure without overcommitting

Cruisers often sit in an interesting tactical middle ground.

They can contribute damage, support teammates, pressure objectives, and punish mistakes, but they can also become vulnerable if caught in an unfavorable position.

That creates a balancing act.

Push too aggressively and you may become an easy target. Stay too far back and you may struggle to influence the battle.

The challenge is finding positions where you can apply pressure without giving the enemy an easy opportunity to punish you.

### Destroyers: information and influence

Destroyers introduce another interesting dimension because their value isn't limited to direct damage.

Information can be incredibly important in a team-based battle.

Knowing where an enemy destroyer is, understanding which flank is under pressure, and detecting threats before they become immediate problems can influence decisions across the team.

A destroyer that survives and provides useful information can remain strategically relevant even without constantly producing spectacular damage numbers.

That makes destroyer gameplay particularly interesting from a tactical perspective.

## Information Changes the Way You Play

One reason the game can feel surprisingly strategic is that you rarely have perfect information.

You know some things.

You don't know everything.

You may know that an enemy ship was recently detected, but you don't necessarily know exactly where it will be thirty seconds from now. You may see several enemy ships on one side of the map while having limited information about another area.

This uncertainty changes decision making.

Suppose an enemy destroyer disappears from detection near an important objective.

Do you assume it retreated?

Do you assume it's approaching?

Do you change direction?

Do you continue forward and accept the risk?

None of these decisions can be made purely through aiming skill.

You're making a judgment based on incomplete information.

That is one of the reasons World of Warships decision making is so important. The game constantly asks you to make choices before you have all the information you'd ideally like to have.

And sometimes the correct decision is simply the one that limits how badly things can go if you're wrong.

## Why Timing Is So Important

A good tactical decision made at the wrong time can still be a bad decision.

This is especially obvious when teams begin contesting objectives.

Moving into an important area can be useful. Moving into it while several enemy ships have a positional advantage is something else entirely.

The difference isn't necessarily the location.

It's the timing.

This is one of the most important concepts in World of Warships battle tactics. You aren't just deciding what to do; you're deciding when to do it.

For example, a coordinated push can work because several friendly ships apply pressure simultaneously. The same push attempted by one isolated ship may end very differently.

Likewise, retreating isn't always a sign that you've lost control of the battle. Sometimes backing away temporarily creates a better opportunity to re-engage.

That can be difficult for new players to accept.

There's a natural instinct in competitive games to believe that progress always means moving forward. In World of Warships, that isn't necessarily true.

Sometimes giving ground gives you better options.

## The Game Rewards Thinking Ahead

The most interesting part of World of Warships tactical gameplay may be that many decisions have delayed consequences.

You might make a positioning mistake now and only realize its importance a minute later.

You might choose to preserve your health early in the battle and find that decision extremely valuable during the final stages.

You might focus on an enemy ship that looks vulnerable while ignoring another opponent who represents a much bigger strategic threat.

This makes the game less about isolated moments and more about chains of decisions.

One decision influences the next.

A bad turn can expose you.

That exposure can force you to retreat.

The retreat can cost you map control.

Losing map control can put pressure on your teammates.

Suddenly, what looked like a small positioning error has become a much bigger problem.

That's why World of Warships gameplay analysis can be more revealing than simply watching the final score.

The important question isn't only, "What happened?"

It's also, "What decision caused it to happen?"

## Why the Learning Curve Is Part of the Appeal

There is a downside to all of this: the learning curve can be frustrating.

New players have a lot to absorb. Ship characteristics, aiming, positioning, map awareness, ammunition choices, spotting, objectives, enemy behavior, and team coordination all interact with one another.

You can lose a battle without immediately understanding what you did wrong.

That's not always comfortable.

But it's also part of what gives the game depth.

When a game has a relatively simple set of basic controls but a complicated set of decisions surrounding those controls, improvement can become surprisingly satisfying.

You start noticing things you didn't notice before.

You recognize when you've overextended.

You become more cautious about turning in open water.

You start paying attention to where friendly ships are positioned rather than treating them as background decoration.

You begin asking whether a target is actually worth pursuing.

That gradual change in awareness is a big part of how to improve at World of Warships.

Improvement isn't only about becoming more accurate. It's about making fewer bad decisions.

## A Better Beginner Strategy: Stop Thinking About Every Enemy

For someone developing a World of Warships strategy for beginners, one of the most useful changes is learning not to treat every visible enemy as an immediate target.

Seeing an enemy ship can trigger an instinctive response: shoot it.

But sometimes the better question is, "What does shooting this ship accomplish?"

Maybe it's already heavily angled.

Maybe another enemy is exposing a much more valuable target.

Maybe firing would reveal your position at an inconvenient moment.

Maybe your ship needs to reposition first.

This doesn't mean you should hesitate before every shot. That would create its own problems.

It means you should gradually connect actions to consequences.

Before pushing forward, consider what can punish you.

Before firing, consider whether the target is worth the attention.

Before turning, consider what you're exposing.

Before chasing, consider where the chase will take you.

Those small questions can dramatically change the way you approach World of Warships gameplay.

## Team Strategy Is More Than Staying Together

Because World of Warships is team-based, it's tempting to assume that good teamwork simply means staying close to your teammates.

That's only partly true.

A group of ships can still make poor tactical decisions.

If several ships all move into the same area while abandoning another important part of the map, they may create a local numerical advantage while losing the larger battle.

Good World of Warships team strategy is about complementary pressure.

A destroyer can provide information and contest objectives.

A cruiser can support that destroyer and punish exposed opponents.

A battleship can apply long-range pressure and discourage enemy ships from taking certain positions.

When those roles interact effectively, the team becomes more difficult to deal with than a collection of individual players.

That doesn't require everyone to communicate perfectly.

Sometimes simply understanding what your teammates are likely trying to accomplish is enough to make better decisions.

## Not Every Battle Is Won by the Most Aggressive Team

Aggression gets rewarded in plenty of games.

In World of Warships, uncontrolled aggression can be expensive.

There's a difference between applying pressure and throwing your ship into danger.

A strong tactical player is often looking for opportunities rather than forcing them.

If an enemy makes a mistake, punish it.

If the opposing flank is weak, exploit it.

If your position becomes dangerous, disengage before the situation becomes irreversible.

This approach can feel slower than simply charging forward, but naval combat naturally creates situations where patience has value.

The player who survives longer often has more opportunities to influence what happens next.

That doesn't mean passive play is automatically good. Sitting at maximum range and refusing to participate can be just as harmful to a team.

The interesting middle ground is controlled aggression: taking risks when the potential reward justifies them and avoiding risks simply because you feel like you need to do something.

## What Makes World of Warships Different From Other Games?

For me, the most interesting answer isn't that it is a naval game.

It's that the game's combat creates unusually strong connections between distance, positioning, timing, information, and consequences.

A mistake doesn't always produce an immediate explosion.

Sometimes it creates a disadvantage that becomes obvious several decisions later.

That makes World of Warships tactical gameplay analysis particularly interesting. You can look at a battle almost like a sequence of problems.

Where should I be?

What information do I have?

What information don't I have?

Which enemy is actually dangerous?

What happens if I move?

What happens if I stay?

What can my teammates do from their current positions?

And perhaps the most important question: what options will I have after I make this decision?

That last question separates reactive play from genuinely thoughtful play.

## The Strategy Behind the Fun

So, why is World of Warships so interesting once you look beyond the surface?

Because the game gives you plenty of room to make meaningful decisions.

You can enjoy the visual spectacle of naval combat, the satisfaction of landing a powerful salvo, and the excitement of winning a close engagement. But underneath those moments is a strategic layer that asks you to manage space, information, timing, risk, and resources.

That's also why why World of Warships is fun to play can have different answers for different players.

Some players will enjoy mastering particular ships.

Others will enjoy competitive matches and teamwork.

Some will become fascinated by positioning and map control.

And some will simply enjoy the feeling of making a clever decision that works exactly as intended.

The game doesn't guarantee that every decision will be rewarding. Sometimes a match can feel frustrating, especially when your team collapses or a mistake gets punished quickly. There are also situations where factors outside an individual player's control can heavily influence the outcome.

But that doesn't diminish the tactical depth.

If anything, it gives the game something to study.

## The Real Appeal Is Learning to See the Battle Differently

The biggest change comes when you stop seeing World of Warships as a series of individual firefights.

A battle starts to look more like a constantly changing tactical problem.

An enemy ship moving left can affect where you can safely move. A destroyer disappearing can change how aggressively you approach an objective. A teammate retreating can leave a flank exposed. A successful push can create new opportunities somewhere else.

Everything is connected.

That's why World of Warships strategy becomes more interesting with experience. You're not simply learning which buttons to press. You're building a mental model of the battle.

And that model gets better every time you understand a mistake.

Maybe you pushed too early.

Maybe you stayed too long.

Maybe you focused on damage instead of map control.

Maybe you didn't consider what would happen after your next turn.

Those lessons are more valuable than memorizing a list of "best tactics," because they can be applied to situations you've never seen before.

## A game that rewards better questions

Ultimately, my world of warships tactical analysis comes down to one observation: the game becomes much more interesting when you stop asking only how to win an engagement and start asking why an engagement happened in the first place.

Why was that cruiser exposed?

Why did that flank collapse?

Why was the enemy able to take that position?

Why did your attack succeed?

Why did your retreat fail?

Those questions turn individual matches into opportunities to learn.

And that's what gives World of Warships more staying power than its surface-level description suggests.

It's a game about ships, guns, and naval combat, certainly. But underneath all of that is a game about choices.

Good positioning creates opportunities.

Good timing turns opportunities into advantages.

Good decision making prevents small mistakes from becoming disasters.

And when those three things come together, a battle can feel less like a random exchange of gunfire and more like a tactical contest where every move matters.

That, more than anything, is what makes World of Warships more interesting than I expected.`,
    author: {
      name: 'Joel Ayuba',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'Founder of Game Vault Forum'
    },
    publicationDate: 'Sept 4, 2026',
    readingTime: '11 min read',
    featuredImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    tags: ['World of Warships', 'Tactics', 'Analysis', 'PC Gaming', 'Strategy'],
    views: '19.8K',
    likes: 0
  },
  {
    id: 'art-1',
    title: 'Why Some Games Keep Us Playing for Years',
    category: 'Gaming Culture',
    excerpt: 'A game can have relatively simple mechanics and somehow remain enjoyable long after the novelty has disappeared. An in-depth analysis of mastery, competition, routine, and what truly creates video game longevity.',
    content: `There’s a strange moment that happens with certain video games. You finish the latest release, put hundreds of hours into it, and eventually move on. Then, months or even years later, you find yourself opening an older game again.

Nothing about it should feel new anymore. You know the maps. You recognize the menus. You’ve probably seen most of what the game has to offer.

And yet, you’re back.

Maybe it’s a familiar multiplayer match with friends. Maybe you want to improve a skill you never quite mastered. Maybe there’s a character you still enjoy playing, a world you like returning to, or simply something about the way the game feels that newer titles haven't managed to replace.

This is one of the most interesting things about gaming. Some games are enjoyable once and then forgotten. Others become part of a player's routine for years.

So why some games keep us playing for years isn't really about graphics, marketing budgets, or how much content a game contains. A game can be enormous and still become boring quickly. Another can have relatively simple mechanics and somehow remain enjoyable long after the novelty has disappeared.

The difference usually comes down to something deeper: the game keeps giving the player a reason to care about what happens next.

Sometimes that reason is competition. Sometimes it's mastery. Sometimes it's friendship. Sometimes it's progression, exploration, creativity, or the simple satisfaction of getting better.

And sometimes, the best long-lasting games manage to combine several of these things without making the player feel like they're working a second job.

## A Game Doesn't Need Endless Content to Have Long-Term Appeal

There's a common assumption that games with long-term replayability need to constantly add new content.

That certainly helps, particularly for games designed around ongoing multiplayer communities. New maps, characters, challenges, seasonal events, balance changes, and other additions can give players fresh reasons to return.

But content alone doesn't create game longevity.

Think about two games. One contains hundreds of hours of missions, collectibles, and side activities. The other has a smaller amount of content but a combat system that is difficult to master.

The first game might keep you occupied for a long time.

The second might keep you interested.

Those are different things.

Being occupied means there is always something left to complete. Being interested means you actually want to discover what happens when you play again.

That's why video game replayability often comes from the underlying systems rather than the amount of content sitting on top of them.

A good game can make the same basic activity feel different because your decisions change the experience.

## Mastery Gives Players a Reason to Come Back

One of the strongest explanations for why do some video games keep players for years is mastery.

The first time you play a difficult game, you're mostly trying to understand what's happening. You're learning controls, enemy behavior, maps, timing, movement, weapons, abilities, or whatever systems the game uses.

Eventually, something changes.

You stop asking, "What am I supposed to do?"

You start asking, "How well can I do it?"

That shift is incredibly important.

A racing game becomes different when you stop simply trying to finish a track and start trying to improve your lines through difficult corners.

A fighting game becomes different when you understand spacing, timing, matchups, and the habits of your opponent.

A strategy game becomes different when you begin thinking several moves ahead rather than reacting to whatever is happening on screen.

The mechanics haven't necessarily changed.

You have.

That's one reason games with high replay value can remain compelling even after you've learned their basic systems. There's still room between knowing how something works and mastering it.

### The satisfaction of getting better

Progress doesn't always need to come from an experience bar.

Sometimes the most satisfying progression is invisible.

You react faster.

You make fewer mistakes.

You understand situations more quickly.

You begin recognizing patterns that previously seemed random.

A player might spend dozens of hours wondering why they keep losing, only to eventually understand that their positioning, timing, or decision-making was the real problem.

That realization can be more rewarding than unlocking another digital item.

It creates a feeling that the player is developing alongside the game.

## Competition Changes Everything

Competition is another major reason why people play games for years.

When there are other human players involved, the experience can become much less predictable.

A computer-controlled opponent can provide a challenge, but human beings are wonderfully inconsistent. Players develop habits. They make surprising decisions. They adapt. They learn from previous encounters.

That creates an environment where the same match can feel different even when the rules haven't changed.

This is particularly important for multiplayer game longevity.

A multiplayer game doesn't necessarily need to reinvent itself every time you play because the players provide some of the variation.

You might understand a particular map completely, but you don't know exactly how the next opponent will approach it.

You might know your character inside out, but the person you're facing may use an unusual strategy.

You might have won ten matches using the same approach, only to discover that someone has found a way to counter it.

Suddenly, you have something new to figure out.

### Competition isn't for everyone

It's worth mentioning the other side of this.

Competition can make a game more engaging, but it can also make it exhausting.

Ranked systems, losing streaks, toxic behavior, pressure to perform, and constant comparison with other players can turn something enjoyable into a source of frustration.

So when asking what makes a game addictive, it's important not to assume that stronger competition automatically means a better experience.

For some players, competition creates motivation.

For others, cooperation, creativity, or exploration is what keeps the game enjoyable.

Long-term appeal is personal.

## Friends Can Give an Old Game New Life

Sometimes the reason people return to a game has very little to do with the game itself.

It's the people inside it.

A game you've stopped playing regularly can suddenly become interesting again when a group of friends decides to return. A familiar map becomes the setting for new conversations, jokes, mistakes, and unexpected moments.

This explains part of why gamers keep coming back to the same games.

The memories associated with a game can become almost as important as its mechanics.

A particular multiplayer game might remind someone of late-night sessions with friends. Another might be connected to a period of life when they had more free time. Someone else might remember finally defeating a difficult boss after countless attempts.

The game becomes more than software.

It becomes a place where things happened.

That's one reason what makes a game memorable isn't necessarily its visual quality. A technically impressive game can disappear from your memory while a relatively simple one stays with you because of what you did inside it.

## Good Progression Gives Players a Sense of Direction

Progression systems are another major part of successful game design.

People generally like seeing evidence that their effort is producing something.

Unlocking a new ability, improving a character, completing a collection, reaching another rank, building something bigger, or mastering another part of a game can provide that sense of movement.

But progression has a delicate balance.

If progress feels meaningful, it can encourage continued play.

If it feels like an endless checklist designed primarily to keep you logging in, the effect can be completely different.

This is where how progression systems keep gamers playing becomes an interesting design question.

A good progression system answers a simple question:

"What am I working toward?"

The answer doesn't have to be complicated.

Maybe you're trying to unlock a new character because their playstyle looks interesting.

Maybe you're trying to improve your equipment.

Maybe you're working toward a difficult achievement.

Maybe you're simply trying to become good enough to beat a challenge that previously defeated you.

The important part is that the goal means something to you.

## Variety Matters, but Not the Way People Think

Variety is often treated as a solution to boredom.

Add more weapons. Add more maps. Add more enemies. Add more characters.

But variety without meaningful differences can become noise.

What matters is whether the new option changes how you think or play.

A new weapon is interesting when it encourages a different approach.

A new character is interesting when their abilities create different decisions.

A new map is interesting when its layout changes positioning and strategy.

This is why what makes games so engaging and replayable isn't necessarily the number of available options. It's whether those options create interesting choices.

A game with ten meaningful possibilities can sometimes be more replayable than a game with a hundred shallow ones.

The player needs to feel that experimenting is worthwhile.

## The Best Games Leave Room for Experimentation

There are games where the developer seems to have anticipated almost everything the player will do.

Then there are games that give players systems and let them figure out what to do with them.

The second type can have remarkable staying power.

When players can experiment, they start creating their own challenges.

They might discover an unusual strategy.

They might attempt a difficult build.

They might try to complete a level without using a particular ability.

They might create something simply because they want to see whether it works.

That sense of possibility is powerful.

It answers another part of what makes a video game worth playing for years: the feeling that you haven't exhausted all the ways you can interact with it.

This is particularly obvious in games built around creativity, strategy, simulation, or complex systems. Players aren't simply consuming content. They're generating experiences from the tools the game gives them.

## Familiarity Doesn't Always Mean Boredom

There's an interesting contradiction in long-lasting games.

We usually associate novelty with excitement. If something is familiar, we assume it should eventually become boring.

But familiar things can also be comforting.

Returning to a game you understand means you don't have to spend an hour learning how everything works again. You can simply play.

That's part of why do people play the same games for years.

The game becomes easy to enter but difficult to completely master.

You already know the fundamentals, so you can focus on the parts you enjoy.

It's similar to revisiting a favorite film, listening to an album you've heard many times, or returning to a familiar sport. The absence of surprise doesn't necessarily eliminate enjoyment.

Sometimes familiarity lets you appreciate details you missed before.

## Games Can Become Part of a Routine

Long-term gaming isn't always driven by intense excitement.

Sometimes it's habit.

A player might finish work, sit down, and play a few matches because that particular game has become part of their evening routine.

This doesn't automatically mean the game is manipulative or unhealthy. Routines can be perfectly normal ways of relaxing.

But there's an important distinction between choosing to play because you enjoy it and feeling unable to stop.

Discussions around gaming psychology sometimes focus heavily on the word "addictive," but that word can oversimplify a complicated subject.

Games can use rewards, progression, social interaction, competition, and uncertainty to encourage continued engagement. Yet people respond to those systems differently.

One player might love daily challenges.

Another might ignore them completely.

One player might enjoy grinding for rare items.

Another might find the same process tedious.

So why are some games more addictive than others doesn't have one universal answer. Game design matters, but personal preferences, circumstances, habits, and the social environment around the game matter too.

## Live-Service Games Have a Different Kind of Longevity

Modern live-service games provide an interesting example of player retention in video games.

Instead of being a product you finish and leave behind, a live-service game is designed to remain active over a long period. Developers can introduce new content, adjust existing systems, run events, and respond to changes in the player community.

That creates a moving target.

The game you return to later may not feel exactly like the game you played previously.

This can be a strength.

It can also be a weakness.

Constant updates can keep a game feeling fresh, but they can also make players feel pressured to keep up. Missing content, changing metas, recurring events, and progression systems can turn leisure into something that feels strangely scheduled.

So why live-service games keep players coming back isn't simply because they have more content.

It's because they can combine ongoing change with existing familiarity.

The player knows the basic game, but there's always the possibility that something has changed since the last time they played.

## Why Some Games Never Seem to Get Old

The phrase why some video games never get boring makes it sound as though those games have discovered a secret formula.

They haven't.

Eventually, almost any game can become boring to a particular person.

That's important.

A game can have excellent mechanics and still lose its appeal because the player has simply had enough. Someone can spend thousands of hours enjoying a game and then suddenly have no interest in opening it again.

That doesn't mean the game failed.

It means enjoyment changes.

Still, the games with remarkable longevity tend to share certain qualities:

• Their basic mechanics remain satisfying.
• Players can improve through practice.
• Different decisions produce different outcomes.
• There is enough uncertainty to prevent every session from feeling identical.
• Progression gives players meaningful goals.
• Social interaction adds another layer of experience.
• The game provides room for experimentation.
• Returning to it doesn't require relearning everything.

Not every long-lasting game needs all of these.

But when several come together, something special can happen.

## The Difference Between Habit and Genuine Enjoyment

There's another distinction worth making.

A game can keep someone playing without necessarily being a game they genuinely enjoy.

Daily rewards, limited-time events, progression requirements, competitive rankings, and other systems can encourage players to return because they don't want to miss something.

That's different from wanting to return because the activity itself is enjoyable.

This matters when discussing game design and player retention.

Retention is useful from a developer's perspective, but from a player's perspective, the more interesting question is whether the time spent playing feels worthwhile.

A game doesn't need to maximize the number of hours you spend with it to be successful.

Sometimes a game that you play for thirty minutes every few days can be more meaningful than one that demands several hours of your attention every day.

Long-term appeal isn't necessarily about quantity.

It's about quality.

## What Makes a Game Have Lasting Appeal?

If I had to reduce the answer to one idea, it would be this:

A long-lasting game gives players reasons to return without making every return feel exactly the same.

That might happen through mastery.

It might happen through friends.

It might happen through competition.

It might happen through exploration, creativity, strategy, progression, or simply the pleasure of interacting with well-designed mechanics.

The strongest long-lasting video games often understand that players don't need to be constantly surprised.

They need to remain curious.

Curious about whether they can win.

Curious about whether a different strategy will work.

Curious about what happens if they approach a familiar problem differently.

Curious about whether they can finally master something they've struggled with.

That's a very different kind of engagement from simply asking players to consume more content.

## Why We Keep Returning

So, why some games keep us playing for years comes down to more than addictive mechanics or endless updates.

We return because something about the experience still matters to us.

Sometimes we're chasing mastery. Sometimes we're chasing competition. Sometimes we're playing with people we enjoy spending time with. Sometimes we simply like the feeling of being in that particular world.

The most enduring games give us enough structure to understand what we're doing and enough freedom to make our own stories within that structure.

That's why a game can remain interesting even after you've seen most of it.

The content may be familiar.

Your experience of it isn't necessarily the same.

You play differently. You understand more. You make different decisions. Your friends change. Your goals change. Your expectations change.

And suddenly, that old game you thought you'd left behind doesn't feel old at all.

Maybe that's the real secret behind video game longevity.

The best games don't necessarily give us something completely new every time we return. They give us enough room to discover something new about the game, or about the way we play it.`,
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'Lead Vault Editor'
    },
    publicationDate: 'Sept 2, 2026',
    readingTime: '8 min read',
    featuredImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    tags: ['Game Longevity', 'Game Design', 'Replayability', 'Mastery', 'Psychology'],
    views: '18.4K',
    likes: 0
  },
  {
    id: 'art-2',
    title: '5 Things Every New Gamer Should Know',
    category: 'Tips',
    excerpt: 'From calibrating your display settings to ignoring toxic metagaming, here is essential foundational wisdom for anyone stepping into gaming.',
    content: `Gaming has evolved from a niche basement hobby into the premier storytelling medium of our century. But diving in today can feel overwhelming.

1. Frame Pacing Matters More Than Peak FPS: A rock-solid 60 FPS frame time chart delivers far better immersion than an erratic 140 FPS with stutter spikes.
2. Play What Draws You, Not What Trends: Do not feel pressured to sink 400 hours into competitive ranked grinds if you find peace in isometric puzzle adventures.
3. Ergonomics Is Not Optional: A supportive chair, correct wrist angles, and a 20-20-20 screen break protocol will protect your passion for decades.
4. Back Up Your Local Saves: Cloud syncing can glitch; keeping manual archive folders of your beloved 100-hour playthroughs is true peace of mind.
5. Join a Kind Community: Platforms like Game Vault Forum thrive because civil discussion elevates the gaming experience far beyond algorithmic social media shouting.`,
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      role: 'Community Specialist'
    },
    publicationDate: 'Aug 28, 2026',
    readingTime: '4 min read',
    featuredImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    tags: ['Beginner', 'Advice', 'Hardware'],
    views: '24.1K',
    likes: 0
  },
  {
    id: 'art-4',
    title: 'The Games That Defined a Generation',
    category: 'Features',
    excerpt: 'A retrospective on the industry milestones that challenged narrative boundaries and revolutionized world architecture over the past decade.',
    content: `Every decade, a handful of releases establish new grammars for interactive entertainment. In the 2010s, Dark Souls re-introduced mystery and consequence, Witcher 3 elevated side-quest storytelling, and Breath of the Wild redefined open-world curiosity.

In the 2020s, Elden Ring proved that player trust outperforms intrusive UI markers, while Baldur’s Gate 3 reminded the world that intricate branching dialogue is an unmatched emotional engine.

At Game Vault Forum, our archive honors these touchstones not just as entertainment products, but as cultural masterworks crafted by passionate engineering and artistic teams.`,
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'Lead Vault Editor'
    },
    publicationDate: 'Aug 12, 2026',
    readingTime: '9 min read',
    featuredImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    tags: ['History', 'Retrospective', 'Masterpieces'],
    views: '31.2K',
    likes: 0
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    gameTitle: 'Elden Ring: Shadow of the Erdtree',
    artwork: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    score: 9.8,
    scoreLabel: 'Masterpiece',
    genre: 'Action RPG',
    platform: 'PC, PS5, Xbox',
    shortVerdict: 'An astronomical achievement that rivals full-length standalone RPGs in scale, artistry, and punishing boss choreography.',
    fullReview: 'Shadow of the Erdtree is FromSoftware operating at the absolute peak of its atmospheric and architectural powers. The vertical layering of the Land of Shadow is a masterclass in exploratory geography. While certain late-game encounters test the boundaries of reaction speed, the Scadutree blessing progression ensures that inquisitive players are generously rewarded for patient exploration.',
    author: 'Vault Editorial Team',
    publishDate: 'Aug 2026',
    pros: [
      'Breathtaking vertical level design and hidden interconnectivity',
      'Memorable boss fights with intricate phase shifts',
      'Scadutree fragment leveling system revitalizes power progression',
      'Haunting, orchestral soundtrack by Yuka Kitamura and team'
    ],
    cons: [
      'Visual performance dips during dense alpha effects in late boss arenas',
      'Certain camera angles struggle on towering multi-legged adversaries'
    ]
  },
  {
    id: 'rev-2',
    gameTitle: "Baldur's Gate 3",
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    score: 9.6,
    scoreLabel: 'Masterpiece',
    genre: 'CRPG',
    platform: 'PC, PS5, Xbox',
    shortVerdict: 'A landmark roleplaying triumph offering unmatched systemic freedom, unforgettable companion arcs, and stellar writing.',
    fullReview: 'Larian Studios gave gamers what mainstream publishers spent a decade insisting was obsolete: a colossal, unapologetic, turn-based CRPG with deep philosophical depth and cinematic production value. The sheer number of permutations and consequences turns each campaign into an unrepeatable personal odyssey.',
    author: 'Elena Rostova',
    publishDate: 'Jul 2026',
    pros: [
      'Unrivaled storytelling and companion relationship writing',
      'Limitless tactical flexibility using environmental spells and barrels',
      'Full cinematic motion capture for hundreds of hours of dialogue'
    ],
    cons: [
      'Act 3 urban inventory management can feel tedious without UI mods',
      'Occasional companion pathfinding hiccups near steep elevations'
    ]
  },
  {
    id: 'rev-3',
    gameTitle: 'Cyberpunk 2077: Phantom Liberty',
    artwork: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    score: 9.0,
    scoreLabel: 'Excellent',
    genre: 'Sci-Fi RPG / Action',
    platform: 'PC, PS5, Xbox',
    shortVerdict: 'A gritty espionage masterstroke that delivers the definitive Night City experience we always dreamed of.',
    fullReview: 'Dogtown is dense, claustrophobic, and pulsating with corruption. The 2.0 system overhaul combined with Idris Elba’s charismatic turn as Solomon Reed creates a relentless espionage drama with gut-wrenching moral conclusions.',
    author: 'David K.',
    publishDate: 'Jun 2026',
    pros: [
      'Deeply emotional spy narrative with high-stakes branching endings',
      'Dogtown district is packed with vertical exploration and combat density',
      'Overhauled cyberware and combat relic skill trees provide fluid builds'
    ],
    cons: [
      'Demands high-end PC hardware to experience path-traced visual glory',
      'Car handling still requires fine-tuning'
    ]
  },
  {
    id: 'rev-4',
    gameTitle: 'Helldivers 2',
    artwork: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    score: 8.8,
    scoreLabel: 'Very Good',
    genre: 'Co-op Shooter',
    platform: 'PC, PS5',
    shortVerdict: 'Hilarious, chaotic, and relentlessly intense co-op gaming that proves fair live-service models can triumph.',
    fullReview: 'Arrowhead Game Studios struck lightning in a bottle. The game blends satirical Starship Troopers humor with bone-crunching military extraction gameplay. Every orbital barrage and airstrike has tactile weight, and the live galactic war narrative feels genuinely dynamic.',
    author: 'Vault Editorial Team',
    publishDate: 'May 2026',
    pros: [
      'Exhilarating emergent chaos and satisfying gunplay feedback',
      'Creative community-driven galactic narrative driven by Game Master "Joel"',
      'Fair, non-predatory Warbond battle pass system'
    ],
    cons: [
      'Periodic server synchronization drops during peak global events',
      'Weapon balance patches occasionally overtune popular loadouts'
    ]
  }
];

export const MOCK_GUIDES: Guide[] = [
  {
    id: 'guide-1',
    title: 'Elden Ring: Shadow of the Erdtree — Scadutree Fragment Optimization Route',
    game: 'Elden Ring',
    difficulty: 'Intermediate',
    estimatedReadingTime: '8 min',
    shortDescription: 'How to efficiently collect the initial 12 Scadutree blessings before tackling divine dancing lion and Rellana.',
    category: 'Strategy',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: '1. Understanding Blessing Scaling vs Base Rune Levels',
        content: 'Your traditional rune level and Vigor stat are heavily attenuated in the Land of Shadow. Scadutree Fragments provide flat percentage multipliers to your overall outgoing damage (+5% per tier) and incoming damage mitigation (~4.5% per tier). Without them, even level 200 characters will be two-shot.',
        tip: 'Prioritize exploring non-boss cross checkpoints before entering Legacy Dungeons.'
      },
      {
        heading: '2. The Gravesite Plain Route',
        content: 'Immediately upon descending into the Gravesite Plain, head northwest towards the church ruins. A fragment sits directly in front of the alter. Next, ride east along the cliffside past the sleeping ghostflame dragon to locate two Miquella Crosses.',
        tip: 'Equip the Spelldrake Talisman +3 to resist divine and magic damage early.'
      },
      {
        heading: '3. Castle Ensis Approach & Hidden Gorge Paths',
        content: 'Do not rush Rellana without checking the lower marsh grotto beneath the suspension bridge. You can acquire 4 additional fragments by navigating around the southern plateau without triggering major boss barriers.'
      }
    ]
  },
  {
    id: 'guide-2',
    title: 'World of Warships: Armor Angling & Citadel Penetration Mechanics',
    game: 'World of Warships',
    difficulty: 'Advanced',
    estimatedReadingTime: '10 min',
    shortDescription: 'Master shell velocity, ricochet angles, overmatch calculations, and citadel protection in high-tier battles.',
    category: 'Game Mechanics',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: 'The 14.3 Caliber Overmatch Rule',
        content: 'Divide your armor piercing shell millimeter diameter by 14.3. If the resulting value is greater than the target plate thickness, your shell bypasses ricochet calculations completely and penetrates directly into internal bulkheads regardless of impact angle.',
        tip: 'A 406mm shell overmatches up to 28mm of bow plating.'
      },
      {
        heading: 'Active Bow Angling vs Turning Away (Kiting)',
        content: 'Presenting a 30 to 45 degree angle bounces most standard AP rounds. When facing multiple broadside threats, transition to an angled kiting posture, allowing your rear turrets to maintain firing arcs while accelerating away from torpedo corridors.'
      }
    ]
  },
  {
    id: 'guide-3',
    title: 'Cyberpunk 2077: 2.0+ Netrunner / Sandevistan Hybrid Build Guide',
    game: 'Cyberpunk 2077',
    difficulty: 'Intermediate',
    estimatedReadingTime: '6 min',
    shortDescription: 'How to balance cyberware capacity, overclock RAM management, and dash mobility for unstoppable combat tempo.',
    category: 'Builds',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: 'Core Attribute Allocation',
        content: 'Invest 20 points in Intelligence and 20 in Reflexes. This unlocks the "Overclock" ultimate queue capability and the "Air Dash" movement suite, transforming combat into a hyper-kinetic dance.',
        tip: 'Combine Synapse Burnout with Memory Wipe to neutralize high-threat targets silently.'
      },
      {
        heading: 'Cyberware Capacity Shard Optimization',
        content: 'Prioritize looting cyberware shards from Dogtown airdrops to elevate your chrome threshold beyond 320 points without triggering severe health drains.'
      }
    ]
  },
  {
    id: 'guide-4',
    title: 'PC Gaming Graphics Tuning: Optimize Frame Times Without Losing Quality',
    game: 'PC Tech / Hardware',
    difficulty: 'Beginner',
    estimatedReadingTime: '7 min',
    shortDescription: 'The 4 graphics settings that drain 40% of your GPU budget with almost zero perceptible visual difference.',
    category: 'Settings',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    sections: [
      {
        heading: 'Volumetric Clouds & Fog',
        content: 'Drop Volumetric Fog from Ultra to Medium or High. In 95% of modern titles (like Cyberpunk or Horizon), this recovers 12-18% of your GPU rendering budget with virtually indistinguishable visual fidelity.',
        tip: 'Always cap frame rates 3 FPS below your monitors G-Sync / FreeSync refresh ceiling.'
      },
      {
        heading: 'Shadow Quality vs Contact Shadows',
        content: 'Keep Screen Space Contact Shadows enabled for crisp silhouettes, but reduce cascaded shadow resolution down to High. Ultra shadow maps demand enormous VRAM bandwidth.'
      }
    ]
  }
];

export const MOCK_FORUM_CATEGORIES: ForumCategory[] = [
  { id: 'all', name: 'All Discussions', description: 'Browse all active conversations across Game Vault Forum', topicCount: 248 },
  { id: 'general', name: 'General Gaming', description: 'Gaming discussions, industry opinions, trends and casual conversations', topicCount: 84 },
  { id: 'pc', name: 'PC Gaming', description: 'PC games, hardware builds, settings, modding and performance optimization', topicCount: 62 },
  { id: 'playstation', name: 'PlayStation', description: 'PS5, PS VR2, PlayStation Studios releases and platform discussions', topicCount: 45 },
  { id: 'xbox', name: 'Xbox', description: 'Xbox Series X|S, Game Pass, backward compatibility and first-party titles', topicCount: 38 },
  { id: 'nintendo', name: 'Nintendo', description: 'Nintendo Switch, upcoming hardware, Zelda, Mario and handheld favorites', topicCount: 31 },
  { id: 'mobile', name: 'Mobile Gaming', description: 'Android and iOS high-end gaming, emulation, and controller accessories', topicCount: 19 },
  { id: 'multiplayer', name: 'Multiplayer', description: 'Online games, clans, squad recruitment and co-op tactical play', topicCount: 29 },
  { id: 'help', name: 'Gaming Help', description: 'Troubleshooting errors, build advice, technical support and boss tips', topicCount: 52 },
  { id: 'community', name: 'Game Vault Forum Community', description: 'YouTube channel updates, video suggestions, site feedback & announcements', topicCount: 18 }
];

export const MOCK_FORUM_TOPICS: ForumTopic[] = [
  {
    id: 'topic-1',
    likes: 0,
    title: 'Game Vault Forum Official Announcement: YouTube Channel Road Map & 2026 Schedule',
    author: {
      name: 'Joel Ayuba',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'Founder',
      isStaff: true
    },
    category: 'Game Vault Forum Community',
    repliesCount: 42,
    views: 3820,
    lastActivity: '12 min ago',
    timestamp: 'Yesterday at 4:15 PM',
    isPinned: true,
    tags: ['Announcement', 'YouTube', 'Roadmap'],
    initialPost: `Welcome everyone to the new Game Vault Forum! 
    
Our YouTube channel is scaling up production with dedicated deep dive essays, tactical game analyses, and honest hardware comparisons. This forum is built to give our community a home away from the chaos of generic social platforms. 

Share your video requests, talk gaming with civil peers, and let us know what features you want next in the Vault!`,
    replies: [
      {
        id: 'rep-1',
        author: {
          name: 'CyberRonin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          badge: 'Vault Operative'
        },
        content: 'Love the dark vault aesthetic and typography! Looking forward to more deep dives into RPG mechanics like your Baldur’s Gate analysis.',
        timestamp: 'Yesterday at 6:40 PM',
        likes: 0
      },
      {
        id: 'rep-2',
        author: {
          name: 'TacticalDreadnought',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
          badge: 'Fleet Captain'
        },
        content: 'That World of Warships breakdown video brought me here. Glad to finally see a creator tackle high tier positioning honestly instead of just clickbait.',
        timestamp: '12 min ago',
        likes: 0
      }
    ]
  },
  {
    id: 'topic-2',
    likes: 0,
    title: 'Why do modern open-world games struggle with meaningful exploration after Elden Ring?',
    author: {
      name: 'NordicBlade',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      badge: 'Veteran'
    },
    category: 'General Gaming',
    repliesCount: 28,
    views: 1940,
    lastActivity: '34 min ago',
    timestamp: '2 days ago',
    isPinned: false,
    tags: ['Open World', 'Game Design', 'Elden Ring'],
    initialPost: `I find it almost impossible to enjoy traditional map-clearing games anymore with 500 checklist icons. Elden Ring worked because landmark silhouettes drew the eye, and subterranean surprises rewarded genuine curiosity. Why are so few major studios copying this philosophy?`,
    replies: [
      {
        id: 'rep-3',
        author: {
          name: 'VoxelWanderer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          badge: 'Vault Pioneer'
        },
        content: 'Cost and accessibility. Publishers fear that if 60% of players miss a handcrafted dungeon because there was no GPS marker, that content budget was "wasted". But the mystery is exactly what creates emotional resonance.',
        timestamp: 'Yesterday at 11:20 AM',
        likes: 0
      }
    ]
  },
  {
    id: 'topic-3',
    likes: 0,
    title: 'RTX 5000 Series vs OLED Gaming Monitors: Where should you spend your upgrade budget first?',
    author: {
      name: 'FramePacer',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
      badge: 'Hardware Sage'
    },
    category: 'PC Gaming',
    repliesCount: 35,
    views: 2480,
    lastActivity: '1 hour ago',
    timestamp: '3 days ago',
    tags: ['Hardware', 'GPU', 'OLED', 'Tech'],
    initialPost: `If you are currently on an RTX 3080 / 4070 with an IPS 1440p monitor, do NOT buy a new GPU yet. Buying a 240Hz QD-OLED monitor will transform every single game you own instantly due to infinite contrast and near-instant pixel response times. Thoughts?`,
    replies: []
  },
  {
    id: 'topic-4',
    likes: 0,
    title: 'Helldivers 2 Super Helldive Squad Coordination Tactics & Stratagem loadouts',
    author: {
      name: 'MajorVanguard',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      badge: 'Super Citizen'
    },
    category: 'Multiplayer',
    repliesCount: 19,
    views: 1120,
    lastActivity: '2 hours ago',
    timestamp: '4 days ago',
    tags: ['Helldivers 2', 'Co-op', 'Loadouts'],
    initialPost: `Looking to assemble a regular 4-player squad for Automaton level 10 operations. We run staggered EMS mortars, Spear anti-heavy armor, and shield generators. Reply with your Discord handle and preferred playstyle!`,
    replies: []
  },
  {
    id: 'topic-5',
    likes: 0,
    title: 'PlayStation State of Play reactions: What are you most excited for in 2026/2027?',
    author: {
      name: 'SonySentry',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'Member'
    },
    category: 'PlayStation',
    repliesCount: 15,
    views: 950,
    lastActivity: '5 hours ago',
    timestamp: '5 days ago',
    tags: ['PlayStation', 'State of Play', 'PS5 Pro'],
    initialPost: `Curious to hear everyone's impressions of the latest showcase. The graphical fidelity leaps are impressive, but what gameplay innovation are you most anticipating?`,
    replies: []
  }
];
