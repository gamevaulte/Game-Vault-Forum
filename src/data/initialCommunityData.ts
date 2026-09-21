import { PostComment } from '../types';

/**
 * Initial authentic community comments and threaded replies for Game Vault articles.
 * Enables immediate discovery, engagement, and reply chains for every user and visitor.
 */
export const INITIAL_ARTICLE_COMMENTS: Record<string, PostComment[]> = {
  // Helldivers 2 Illuminate Super Helldive Loadout
  'helldivers-2-illuminate-super-helldive-loadout-by-enemy-type': [
    {
      id: 'comm-hd2-1',
      author: {
        id: 'usr_sarah_connor',
        name: 'Vanguard_Ghost',
        username: '@vanguard_ghost',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        badge: 'Helldive Veteran',
        role: 'Fleet Tactician'
      },
      content: 'The shield generator backpack recommendation for Super Helldive Illuminate missions is 100% spot-on. Those teleporting sniper attacks can one-shot you through medium armor if your overshield is down. Paired with the Sickle for wiping out tripods, this build is pure gold.',
      timestamp: '2 hours ago',
      likes: 14,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'comm-hd2-2',
      author: {
        id: 'usr_patriot_77',
        name: 'DemocracyOfficer',
        username: '@democracy_officer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        badge: 'SES Marshal',
        role: 'Orbital Specialist'
      },
      content: 'Have you tested swapping the Precision Strike for the Walking Barrage when extracting from the high plateaus? On Level 10 difficulty, the Illuminate portal clusters spawn so fast that the staggered 380mm walking barrage covers the entire escape vector.',
      timestamp: '1 hour ago',
      likes: 9,
      replyToId: 'comm-hd2-1',
      replyToAuthor: 'Vanguard_Ghost',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'comm-hd2-3',
      author: {
        id: 'usr_sarah_connor',
        name: 'Vanguard_Ghost',
        username: '@vanguard_ghost',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        badge: 'Helldive Veteran',
        role: 'Fleet Tactician'
      },
      content: 'Great call @DemocracyOfficer! We ran Walking Barrage last night on Darius II. You have to throw the beacon roughly 40 meters ahead of the extraction beacon so the first salvo doesn\'t clip Pelican-1, but once it walks through the portal spawn, it vaporizes everything.',
      timestamp: '35 mins ago',
      likes: 6,
      replyToId: 'comm-hd2-2',
      replyToAuthor: 'DemocracyOfficer',
      createdAt: new Date(Date.now() - 2100000).toISOString()
    },
    {
      id: 'comm-hd2-4',
      author: {
        id: 'usr_nova_recon',
        name: 'ShadowRecon',
        username: '@shadow_recon',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        badge: 'Scout Specialist',
        role: 'Infiltration Operative'
      },
      content: 'Don\'t sleep on Smoke Grenades against the Illuminate Councilors either. Their mind-control orbs require direct visual lock. Breaking line-of-sight gives your squad 5 precious seconds to reposition or call in reinforcements.',
      timestamp: '15 mins ago',
      likes: 5,
      createdAt: new Date(Date.now() - 900000).toISOString()
    }
  ],

  // Strategic Brain article
  'art-strategy-brain': [
    {
      id: 'comm-strat-1',
      author: {
        id: 'usr_tactical_mind',
        name: 'GrandmasterApex',
        username: '@grandmaster_apex',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        badge: 'RTS Veteran',
        role: 'Tactical Analyst'
      },
      content: 'Fascinating breakdown on neuroplasticity and real-time decision loops! In games like StarCraft II or Age of Empires, macro-cycle automation frees up cognitive bandwidth for tactical micro. You can see this directly reflected in APM metrics and peripheral awareness.',
      timestamp: '1 day ago',
      likes: 12,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'comm-strat-2',
      author: {
        id: 'usr_neural_op',
        name: 'SynapseGamer',
        username: '@synapse_gamer',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
        badge: 'Cognitive Researcher',
        role: 'Community Strategist'
      },
      content: 'The section on cognitive fatigue in high-stress clutch scenarios is especially true. Taking 5-minute hydration breaks between ranked matches noticeably improves reaction time in high-Elo lobbies.',
      timestamp: '18 hours ago',
      likes: 8,
      replyToId: 'comm-strat-1',
      replyToAuthor: 'GrandmasterApex',
      createdAt: new Date(Date.now() - 64800000).toISOString()
    }
  ],

  // GTA VI Analysis
  'art-1': [
    {
      id: 'comm-gta-1',
      author: {
        id: 'usr_vice_city_king',
        name: 'LeonidaDrifter',
        username: '@leonida_drifter',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        badge: 'Vice City Pioneer',
        role: 'Sandbox Specialist'
      },
      content: 'The dynamic water physics simulation and volumetric cloud rendering in Vice City are going to be revolutionary. What excites me most is the procedural building interior density. If even 40% of storefronts are enterable, it changes urban sandbox exploration forever.',
      timestamp: '2 days ago',
      likes: 19,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'comm-gta-2',
      author: {
        id: 'usr_rockstar_watcher',
        name: 'PaletoBayWatcher',
        username: '@paleto_watcher',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
        badge: 'Archive Lorekeeper',
        role: 'Open-World Specialist'
      },
      content: 'Agreed! And the dual-protagonist Lucia and Jason dynamic feels like a natural evolution of the character switching mechanic from GTA V, but with much tighter narrative friction.',
      timestamp: '1 day ago',
      likes: 11,
      replyToId: 'comm-gta-1',
      replyToAuthor: 'LeonidaDrifter',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],

  // Monster Hunter Wilds
  'art-2': [
    {
      id: 'comm-mhw-1',
      author: {
        id: 'usr_hunting_horn',
        name: 'DootMaster99',
        username: '@dootmaster99',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        badge: 'Hunting Horn Main',
        role: 'Field Researcher'
      },
      content: 'Focus Strike mechanics in Wilds are a monumental upgrade for heavy weapon types like Great Sword and Gunlance. Being able to aim the cone of attack while charging rewards wound-targeting instead of just swinging into empty air.',
      timestamp: '3 days ago',
      likes: 16,
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ],

  // Cloud Gaming vs PC
  'gaming-pc-vs-cloud-gaming-2026': [
    {
      id: 'comm-cloud-1',
      author: {
        id: 'usr_rig_builder',
        name: 'SiliconOverclock',
        username: '@silicon_overclock',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        badge: 'Hardware Specialist',
        role: 'System Builder'
      },
      content: 'With AV1 hardware decoding on modern smart TVs and sub-15ms regional fiber, GeForce NOW Ultimate is remarkably close to local fidelity for non-competitive single-player RPGs. Still sticking to local for twitch FPS though.',
      timestamp: '1 day ago',
      likes: 10,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

/**
 * Initial forum replies to populate threads so visitors immediately discover
 * rich community discourse and can join in replying to existing answers.
 */
export const INITIAL_FORUM_REPLIES: Record<string, Array<{
  id: string;
  author: {
    id?: string;
    name: string;
    username?: string;
    avatar: string;
    role?: string;
    badge?: string;
    isStaff?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replyToAuthor?: string;
  createdAt?: string;
}>> = {
  'topic-1': [
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
      likes: 7,
      createdAt: new Date(Date.now() - 86400000).toISOString()
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
      replyToAuthor: 'NordicBlade',
      createdAt: new Date(Date.now() - 82800000).toISOString()
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
      likes: 4,
      createdAt: new Date(Date.now() - 14400000).toISOString()
    }
  ],

  'topic-2': [
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
      likes: 15,
      createdAt: new Date(Date.now() - 86400000).toISOString()
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
      replyToAuthor: 'ChromaRanger',
      createdAt: new Date(Date.now() - 64800000).toISOString()
    }
  ],

  'topic-3': [
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
      likes: 16,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]
};
