import fs from 'fs';
import path from 'path';
import { 
  MOCK_GAMES, 
  MOCK_VIDEOS, 
  MOCK_ARTICLES, 
  MOCK_REVIEWS, 
  MOCK_GUIDES, 
  MOCK_FORUM_TOPICS, 
  MOCK_FORUM_CATEGORIES 
} from '../src/data/mockData';
import { INITIAL_GAMES_REQUIREMENTS } from '../src/data/pcRequirementsData';
import { GAMING_CATEGORIES, PLAYABLE_GAMES } from '../src/data/gamingData';
import { GAME_PERFORMANCE_PROFILES } from '../src/data/fpsCalculatorData';
import { getSeoSlug } from '../src/lib/seo';

interface SitemapEntry {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

const currentDate = '2026-09-21';

const entries: SitemapEntry[] = [
  // 1. Core Section Hubs
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/videos', priority: '0.9', changefreq: 'daily' },
  { url: '/articles', priority: '0.9', changefreq: 'daily' },
  { url: '/reviews', priority: '0.9', changefreq: 'weekly' },
  { url: '/guides', priority: '0.9', changefreq: 'weekly' },
  { url: '/games', priority: '0.9', changefreq: 'weekly' },
  { url: '/forum', priority: '0.9', changefreq: 'daily' },
  { url: '/play-games', priority: '0.95', changefreq: 'daily' },

  // 2. Play Games Category Hubs
  ...GAMING_CATEGORIES.map(cat => ({
    url: `/play-games/${cat.slug}`,
    priority: '0.9',
    changefreq: 'weekly'
  })),

  // 3. Playable Browser Games (18 games)
  ...PLAYABLE_GAMES.map(game => ({
    url: `/play-games/${game.categorySlug}/${game.slug}`,
    priority: '0.88',
    changefreq: 'weekly'
  })),

  // 4. Articles Category Hubs
  ...[
    'hardware-guides',
    'tactical-analysis',
    'gaming-culture',
    'opinions',
    'tips',
    'features',
    'gaming-news',
    'industry',
    'gaming-stories'
  ].map(slug => ({
    url: `/articles/category/${slug}`,
    priority: '0.85',
    changefreq: 'weekly'
  })),

  // 5. Guides Category Hubs
  ...[
    'beginner-guides',
    'strategy',
    'builds',
    'walkthroughs',
    'tips-tricks',
    'settings',
    'game-mechanics'
  ].map(slug => ({
    url: `/guides/category/${slug}`,
    priority: '0.85',
    changefreq: 'weekly'
  })),

  // 6. Forum Category Hubs
  ...MOCK_FORUM_CATEGORIES.map(cat => ({
    url: `/forum/category/${cat.id}`,
    priority: '0.85',
    changefreq: 'daily'
  })),

  // 7. Games Catalog Genre Hubs
  ...[
    'action',
    'adventure',
    'rpg',
    'strategy',
    'simulation',
    'multiplayer',
    'fps',
    'sports',
    'racing'
  ].map(slug => ({
    url: `/games/category/${slug}`,
    priority: '0.85',
    changefreq: 'weekly'
  })),

  // 8. Videos Category Hubs
  ...[
    'deep-dive',
    'gameplay',
    'review',
    'guide',
    'tech'
  ].map(slug => ({
    url: `/videos/category/${slug}`,
    priority: '0.85',
    changefreq: 'weekly'
  })),

  // 9. Interactive Tools Suite
  { url: '/tools', priority: '0.9', changefreq: 'weekly' },
  { url: '/tools/fps-calculator', priority: '0.95', changefreq: 'daily' },
  { url: '/fps-performance-calculator', priority: '0.9', changefreq: 'daily' },
  { url: '/tools/fps-performance-calculator', priority: '0.9', changefreq: 'daily' },
  { url: '/tools/vault-ai', priority: '0.9', changefreq: 'daily' },
  { url: '/tools/pc-game-requirements-checker', priority: '0.9', changefreq: 'weekly' },
  { url: '/tools/gaming-pc-builder', priority: '0.9', changefreq: 'weekly' },
  { url: '/tools/gaming-username-generator', priority: '0.8', changefreq: 'monthly' },
  { url: '/game-picker-wheel', priority: '0.9', changefreq: 'weekly' },
  { url: '/game-avatar-generator', priority: '0.9', changefreq: 'weekly' },

  // 10. PC Requirements Individual Game Checkers (50 Games)
  ...(() => {
    const seen = new Set<string>();
    const list: SitemapEntry[] = [];
    INITIAL_GAMES_REQUIREMENTS.forEach(req => {
      const slug = req.slug || getSeoSlug(req);
      if (seen.has(slug)) return;
      seen.add(slug);
      list.push({
        url: `/tools/pc-game-requirements-checker/${slug}`,
        priority: '0.8',
        changefreq: 'weekly'
      });
    });
    return list;
  })(),

  // 11. FPS Calculator Game Benchmark Profiles (50 Games)
  ...(() => {
    const seen = new Set<string>();
    const list: SitemapEntry[] = [];
    GAME_PERFORMANCE_PROFILES.forEach(profile => {
      if (seen.has(profile.slug)) return;
      seen.add(profile.slug);
      list.push({
        url: `/tools/fps-calculator/${profile.slug}`,
        priority: '0.82',
        changefreq: 'weekly'
      });
    });
    return list;
  })(),

  // 12. Games Catalog Detail Pages
  ...MOCK_GAMES.map(game => ({
    url: `/games/${getSeoSlug(game)}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),

  // 13. Video Deep Dives & Gameplay Pages
  ...MOCK_VIDEOS.map(video => ({
    url: `/videos/${getSeoSlug(video)}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),

  // 14. Articles & Editorial Analysis Pages
  ...MOCK_ARTICLES.map(article => ({
    url: `/articles/${getSeoSlug(article)}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),

  // 15. Game Reviews
  ...MOCK_REVIEWS.map(review => ({
    url: `/reviews/${getSeoSlug(review)}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),

  // 16. Technical Game Guides
  ...MOCK_GUIDES.map(guide => ({
    url: `/guides/${getSeoSlug(guide)}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),

  // 17. Community Forum Discussion Topics
  ...MOCK_FORUM_TOPICS.map(topic => ({
    url: `/forum/${getSeoSlug(topic)}`,
    priority: '0.8',
    changefreq: 'daily'
  })),
  { url: '/forum/new', priority: '0.7', changefreq: 'daily' },

  // 18. Author, Profile & Membership
  { url: '/authors/joel-ayuba', priority: '0.8', changefreq: 'weekly' },
  { url: '/profile', priority: '0.6', changefreq: 'weekly' },
  { url: '/login', priority: '0.5', changefreq: 'monthly' },
  { url: '/register', priority: '0.6', changefreq: 'monthly' },

  // 19. Information, Policies & Legal
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/guidelines', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.6', changefreq: 'monthly' },
  { url: '/terms', priority: '0.6', changefreq: 'monthly' },
  { url: '/cookies', priority: '0.6', changefreq: 'monthly' },
  { url: '/sitemap', priority: '0.7', changefreq: 'weekly' }
];

// Deduplicate entries by url
const uniqueMap = new Map<string, SitemapEntry>();
for (const entry of entries) {
  if (!uniqueMap.has(entry.url)) {
    uniqueMap.set(entry.url, entry);
  }
}

const uniqueEntries = Array.from(uniqueMap.values());

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

for (const entry of uniqueEntries) {
  xmlLines.push('  <url>');
  xmlLines.push(`    <loc>https://www.gamevault.forum${entry.url}</loc>`);
  xmlLines.push(`    <lastmod>${entry.lastmod || currentDate}</lastmod>`);
  xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${entry.priority}</priority>`);
  xmlLines.push('  </url>');
}

xmlLines.push('</urlset>');
xmlLines.push('');

const sitemapPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(sitemapPath, xmlLines.join('\n'), 'utf8');

console.log(`Successfully generated public/sitemap.xml with ${uniqueEntries.length} canonical URLs.`);
