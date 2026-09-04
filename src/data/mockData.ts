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
  likedIds: ['vid-1', 'art-1', 'rev-1']
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
    likes: 3410
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
    likes: 2150
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
    likes: 5890
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
    likes: 1940
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
    likes: 4200
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
    likes: 3820
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
    likes: 1240
  },
  {
    id: 'art-1',
    title: 'Why Some Games Keep Us Playing for Years',
    category: 'Gaming Culture',
    excerpt: 'Examining the delicate equilibrium between emergent mechanics, social connection, and progression loops that turn games into second homes.',
    content: `What separates a game you complete over a weekend from a digital world you inhabit for half a decade? When we examine titles like World of Warships, Elden Ring, or World of Warcraft, the answer is rarely just graphics or story length.

The secret lies in "emergent depth"—systems that interact in unpredictable ways, leaving room for player mastery to flourish. In rigid cinematic adventures, you are experiencing the developer's script. In systemic sandbox games, you are crafting personal folklore.

Furthermore, community friction and camaraderie amplify retention. When players gather in forums, subreddits, and voice channels to dissect strategies, share loadouts, and celebrate improbable victories, the game transcends software and transforms into a shared culture.`,
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: 'Lead Vault Editor'
    },
    publicationDate: 'Sept 2, 2026',
    readingTime: '6 min read',
    featuredImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    tags: ['Psychology', 'Design', 'Community'],
    views: '18.4K',
    likes: 842
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
    likes: 1205
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
    likes: 1890
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
        likes: 18
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
        likes: 9
      }
    ]
  },
  {
    id: 'topic-2',
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
        likes: 24
      }
    ]
  },
  {
    id: 'topic-3',
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
