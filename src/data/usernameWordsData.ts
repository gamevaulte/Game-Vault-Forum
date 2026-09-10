import { UsernameStyle, GamingTheme } from '../types/usernameGenerator';

export const STYLE_WORDS: Record<UsernameStyle, { prefixes: string[]; roots: string[]; suffixes: string[] }> = {
  Cool: {
    prefixes: ['Apex', 'Vortex', 'Pulse', 'Hyper', 'Nova', 'Echo', 'Shift', 'Zenith', 'Phantom', 'Prism', 'Rogue', 'Titan'],
    roots: ['Striker', 'Blaze', 'Surge', 'Drift', 'Specter', 'Viper', 'Shade', 'Flash', 'Rider', 'Razor', 'Flux', 'Havoc'],
    suffixes: ['X', 'V', 'Prime', 'Zero', 'Wave', 'Core', 'Edge', 'Mode', 'Zone', 'Sync']
  },
  Funny: {
    prefixes: ['Sir', 'Captain', 'Lord', 'Dr', 'Master', 'Sneaky', 'Clumsy', 'Salty', 'Sleepy', 'Fuzzy', 'Potato', 'Wobbly'],
    roots: ['Pickle', 'Waffle', 'Nugget', 'Noob', 'Banana', 'Muffin', 'Biscuit', 'Duck', 'Penguin', 'Toaster', 'Llama', 'Taco'],
    suffixes: ['McSwag', 'Pants', 'Boi', 'XD', 'LOL', 'TheThird', '9000', 'Junior', 'Sauce']
  },
  Competitive: {
    prefixes: ['Aim', 'Frag', 'Clutch', 'Ace', 'Spray', 'Meta', 'Rank', 'Focus', 'Peak', 'Lethal', 'Grid', 'Tempo'],
    roots: ['God', 'Demon', 'Carry', 'Duo', 'Solo', 'Entry', 'Anchor', 'Flex', 'Igl', 'Duelist', 'Sniper', 'DPS'],
    suffixes: ['FPS', 'GG', 'T1', 'Pro', 'God', 'Diff', 'VOD', 'Top1', 'Win', 'Zone']
  },
  'Pro Gamer': {
    prefixes: ['Team', 'Vault', 'Major', 'Elite', 'Alpha', 'Pro', 'Apex', 'Next', 'Prime', 'True', 'Grand', 'Omni'],
    roots: ['Shift', 'Flow', 'Reign', 'Reflex', 'Sense', 'Sync', 'Optic', 'Faze', 'Cloud', 'Pulse', 'Core', 'Form'],
    suffixes: ['CS', 'VL', 'VAL', 'GG', 'Official', 'TV', 'Live', 'HQ', 'Sense']
  },
  Dark: {
    prefixes: ['Night', 'Shadow', 'Abyss', 'Grim', 'Void', 'Dusk', 'Bleak', 'Hollow', 'Obsidian', 'Raven', 'Onyx', 'Eclipse'],
    roots: ['Reaper', 'Specter', 'Wraith', 'Phantom', 'Stalker', 'Bane', 'Grave', 'Hex', 'Scythe', 'Soul', 'Gloom', 'Cinder'],
    suffixes: ['Dark', 'Dusk', 'Void', 'Grim', 'Nocturne', 'Veil', 'Bane', 'Shade']
  },
  Mysterious: {
    prefixes: ['Enigma', 'Cipher', 'Rune', 'Secret', 'Silent', 'Mirage', 'Veil', 'Mist', 'Zero', 'Unknown', 'Obscure', 'Whisper'],
    roots: ['Nomad', 'Oracle', 'Drifter', 'Riddle', 'Echo', 'Chronos', 'Gaze', 'Mask', 'Trace', 'Omen', 'Vanish', 'Ghost'],
    suffixes: ['Occult', 'Cipher', 'Arcane', 'Mist', 'Veil', 'Blank', 'None']
  },
  Fantasy: {
    prefixes: ['Rune', 'Arcane', 'Dragon', 'Mythic', 'Elder', 'Astral', 'Silver', 'Iron', 'Moon', 'Storm', 'Shadow', 'Frost'],
    roots: ['Knight', 'Mage', 'Paladin', 'Slayer', 'Druid', 'Warlock', 'Ranger', 'Blade', 'Crown', 'Spell', 'Cleric', 'Drake'],
    suffixes: ['Heart', 'Born', 'Fang', 'Guard', 'Weaver', 'Bane', 'Spire', 'Song']
  },
  Futuristic: {
    prefixes: ['Cyber', 'Neo', 'Quantum', 'Synapse', 'Nano', 'Mecha', 'Vector', 'Matrix', 'Binary', 'Aero', 'Chrono', 'Helix'],
    roots: ['Drive', 'Protocol', 'Byte', 'Node', 'Grid', 'Circuit', 'Glitch', 'Warp', 'Proxy', 'Synth', 'Bot', 'Nexus'],
    suffixes: ['2099', 'OS', 'Net', 'Exe', 'Link', 'Core', 'V2', 'AI', 'Matrix']
  },
  Minimal: {
    prefixes: ['Kai', 'Ren', 'Zen', 'Jax', 'Sol', 'Lux', 'Nyx', 'Leo', 'Pax', 'Sky', 'Rae', 'Kip'],
    roots: ['Nova', 'Apex', 'Echo', 'Mist', 'Shade', 'Dawn', 'Flow', 'Glow', 'Dusk', 'Rune', 'Veil', 'Arch'],
    suffixes: ['', '_', '.', '0', '1', '7', 'x']
  },
  Cute: {
    prefixes: ['Mochi', 'Boba', 'Honey', 'Cosmic', 'Pixel', 'Peachy', 'Sugar', 'Bunny', 'Starry', 'Cotton', 'Berry', 'Sunny'],
    roots: ['Kitten', 'Panda', 'Cloud', 'Bloom', 'Puff', 'Sprout', 'Fox', 'Fairy', 'Petal', 'Charm', 'Blossom', 'Cookie'],
    suffixes: ['Chan', 'Puff', 'Pie', 'Bby', 'Chu', 'UwU', 'Joy', 'Bun']
  },
  Savage: {
    prefixes: ['Brutal', 'Vicious', 'Ravage', 'Ruthless', 'Wild', 'Rampage', 'Fierce', 'Chaos', 'Vandal', 'Fury', 'Dire', 'Bavage'],
    roots: ['Beast', 'Cleaver', 'Crusher', 'Slayer', 'Carnage', 'Havoc', 'Biter', 'Wreck', 'Venom', 'Hunter', 'Claw', 'Fang'],
    suffixes: ['Raw', 'Max', 'Fury', 'Rage', 'Riot', 'Wrath', 'Smash']
  },
  Creative: {
    prefixes: ['Prism', 'Canvas', 'Chroma', 'Velvet', 'Kaleido', 'Sonic', 'Aura', 'Solar', 'Quirk', 'Vivid', 'Pixel', 'Tempo'],
    roots: ['Weaver', 'Crafter', 'Poet', 'Spark', 'Fusion', 'Echo', 'Tonic', 'Forge', 'Palette', 'Quirk', 'Bloom', 'Rhythm'],
    suffixes: ['Mind', 'Arts', 'Lab', 'Flow', 'Craft', 'Muse', 'Vision']
  },
  Random: {
    prefixes: ['Vortex', 'Mochi', 'Quantum', 'Aim', 'Night', 'Enigma', 'Sir', 'Brutal', 'Dragon', 'Pixel', 'Sonic', 'Rune'],
    roots: ['Striker', 'Panda', 'Node', 'Demon', 'Reaper', 'Oracle', 'Pickle', 'Beast', 'Knight', 'Crafter', 'Ghost', 'Blade'],
    suffixes: ['Prime', 'Zero', 'Pro', 'Void', 'FPS', 'GG', 'Boi', 'Craft', 'X']
  }
};

export const THEME_WORDS: Record<GamingTheme, { prefixes: string[]; roots: string[] }> = {
  Military: {
    prefixes: ['Tactical', 'Delta', 'Bravo', 'Recon', 'SpecOps', 'Sniper', 'Squad', 'Siege', 'Ranger', 'Commando', 'Bunker', 'Vanguard'],
    roots: ['Ops', 'Trooper', 'Baron', 'General', 'Major', 'Veteran', 'Gunner', 'Scout', 'Breacher', 'Marksman', 'Captain', 'Infantry']
  },
  Space: {
    prefixes: ['Astro', 'Cosmo', 'Galactic', 'Nebula', 'Solar', 'Lunar', 'Comet', 'Meteor', 'Stellar', 'Void', 'Orbit', 'Titan'],
    roots: ['Voyager', 'Pulsar', 'Nova', 'Eclipse', 'Quasar', 'Rover', 'Horizon', 'Star', 'Gravity', 'Cosmonaut', 'Satellite', 'Zenith']
  },
  Cyberpunk: {
    prefixes: ['Neon', 'Cyber', 'Chrome', 'Glitch', 'Synth', 'Netrunner', 'Subnet', 'Grid', 'Overclock', 'Holo', 'Laser', 'Matrix'],
    roots: ['Runner', 'Hacker', 'Decker', 'Cyborg', 'Punk', 'Wire', 'Sprawl', 'Circuit', 'Byte', 'Terminal', 'Core', 'Signal']
  },
  Fantasy: {
    prefixes: ['Mystic', 'Rune', 'Elder', 'Elven', 'Astral', 'Dwarven', 'Arcane', 'Dragon', 'Sacred', 'Sorcerer', 'Paladin', 'Celestial'],
    roots: ['Slayer', 'Mage', 'Knight', 'Ranger', 'Warlock', 'Blade', 'Alchemist', 'Weaver', 'Seeker', 'Guardian', 'Lord', 'Chieftain']
  },
  Animals: {
    prefixes: ['Dire', 'Alpha', 'Arctic', 'Fierce', 'Shadow', 'Savage', 'Silver', 'Apex', 'Night', 'Swift', 'Ghost', 'Lone'],
    roots: ['Wolf', 'Tiger', 'Falcon', 'Panther', 'Viper', 'Raven', 'Bear', 'Hawk', 'Lion', 'Cobra', 'Eagle', 'Fox']
  },
  Fire: {
    prefixes: ['Infernal', 'Pyro', 'Blaze', 'Ember', 'Ignite', 'Solar', 'Flame', 'Magma', 'Volcanic', 'Sear', 'Cinder', 'Molten'],
    roots: ['Phoenix', 'Flare', 'Burn', 'Furnace', 'Torch', 'Pyre', 'Spark', 'Ashes', 'Corona', 'Brand', 'Firestorm', 'Heat']
  },
  Ice: {
    prefixes: ['Frost', 'Glacier', 'Cryo', 'Polar', 'Arctic', 'Subzero', 'Boreal', 'Chill', 'Snow', 'Icebound', 'Winter', 'Hail'],
    roots: ['Bite', 'Shard', 'Avalanche', 'Freeze', 'Spire', 'Drift', 'Tundra', 'Icicle', 'Flurry', 'Storm', 'Fang', 'Peak']
  },
  Technology: {
    prefixes: ['Binary', 'Quantum', 'Logic', 'Silicon', 'Kernel', 'Vector', 'Pixel', 'Data', 'Nano', 'Code', 'Overclock', 'Cipher'],
    roots: ['Chip', 'Node', 'Stack', 'Buffer', 'Cache', 'Compiler', 'Algorithm', 'Thread', 'Socket', 'Pipeline', 'Bus', 'Array']
  },
  Mythology: {
    prefixes: ['Odin', 'Zeus', 'Thor', 'Hades', 'Anubis', 'Ares', 'Valkyrie', 'Titan', 'Olympian', 'Ragnarok', 'Atlas', 'Apollo'],
    roots: ['God', 'Herald', 'Wrath', 'Fury', 'Champion', 'Deity', 'Scythe', 'Thunder', 'Bolt', 'Shield', 'Immortal', 'Gorgon']
  },
  Horror: {
    prefixes: ['Sinister', 'Crypt', 'Grave', 'Phantom', 'Morbid', 'Cursed', 'Haunt', 'Nightmare', 'Ghoul', 'Abyss', 'Grim', 'Blood'],
    roots: ['Specter', 'Corpse', 'Fiend', 'Demon', 'Ghoul', 'Bane', 'Stalker', 'Wraith', 'Cult', 'Horror', 'Scream', 'Skull']
  },
  Adventure: {
    prefixes: ['Pioneer', 'Wander', 'Pathfinder', 'Wild', 'Trail', 'Expedition', 'Roam', 'Nomad', 'Horizon', 'Quest', 'Vagabond', 'Brave'],
    roots: ['Explorer', 'Seeker', 'Traveler', 'Ranger', 'Voyager', 'Scout', 'Navigator', 'Pilgrim', 'Drifter', 'Tracker', 'Hunter', 'Climber']
  },
  Random: {
    prefixes: ['Apex', 'Astro', 'Neon', 'Ember', 'Frost', 'Dire', 'Odin', 'Crypt', 'Cyber', 'Vanguard', 'Mystic', 'Vector'],
    roots: ['Striker', 'Nova', 'Runner', 'Phoenix', 'Shard', 'Wolf', 'Titan', 'Specter', 'Hacker', 'Ops', 'Slayer', 'Node']
  }
};

export const POPULAR_SYMBOLS = ['_', '-', '.', 'x', 'X'];

// Comprehensive blacklist to prevent offensive, hateful, sexually explicit, or abusive usernames
export const BANNED_WORDS = [
  'nazi', 'hitler', 'racist', 'terrorist', 'suicide', 'pedophile', 'pedo',
  'rape', 'porn', 'nsfw', 'whore', 'bitch', 'cunt', 'fag', 'faggot', 'nigger',
  'nigga', 'retard', 'bastard', 'chink', 'gook', 'kike', 'spic', 'slut'
];

export function isSafeUsername(name: string): boolean {
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return !BANNED_WORDS.some(banned => lower.includes(banned));
}
