import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Bot, 
  Cpu, 
  Gamepad2, 
  Video as VideoIcon, 
  FileText, 
  Star, 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Layers,
  Code,
  CheckCircle2
} from 'lucide-react';
import { MOCK_GAMES, MOCK_VIDEOS, MOCK_ARTICLES, MOCK_REVIEWS, MOCK_GUIDES, MOCK_FORUM_TOPICS } from '../data/mockData';
import { getSeoSlug } from '../lib/seo';

interface SitemapItem {
  id: string;
  title: string;
  url: string;
  category: 'tools' | 'games' | 'articles' | 'reviews' | 'guides' | 'videos' | 'forum' | 'legal';
  badge: string;
  badgeColor: string;
  description: string;
  priority: string;
  changefreq: string;
  isNew?: boolean;
}

interface SitemapViewProps {
  onNavigate: (path: string) => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Compile all pages with full metadata
  const sitemapItems: SitemapItem[] = useMemo(() => {
    const items: SitemapItem[] = [
      // 1. Core Hubs
      {
        id: 'home',
        title: 'Home — Game Vault Hub & Featured Showcase',
        url: '/',
        category: 'legal',
        badge: 'Main Hub',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        description: 'The homepage of Game Vault Forum featuring trending videos, featured games, latest articles, and forum activity.',
        priority: '1.0',
        changefreq: 'Daily'
      },
      {
        id: 'videos-hub',
        title: 'Videos Hub — Gameplay Deep Dives & Walkthroughs',
        url: '/videos',
        category: 'videos',
        badge: 'Media Hub',
        badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
        description: 'Complete video catalog of high-definition gameplay breakdowns, tactical masterclasses, and optimization guides.',
        priority: '0.9',
        changefreq: 'Daily'
      },
      {
        id: 'games-hub',
        title: 'Games Catalog — Database & System Benchmarks',
        url: '/games',
        category: 'games',
        badge: 'Games Hub',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        description: 'Browse the entire library of tactical games, RPGs, shooters, and simulations with detailed hardware benchmarks.',
        priority: '0.9',
        changefreq: 'Weekly'
      },
      {
        id: 'articles-hub',
        title: 'Articles & Editorial Analysis',
        url: '/articles',
        category: 'articles',
        badge: 'Editorial Hub',
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        description: 'Deep gaming journalism, design critiques, long-term replayability essays, and industry analysis.',
        priority: '0.9',
        changefreq: 'Daily'
      },
      {
        id: 'reviews-hub',
        title: 'Reviews & Performance Verdicts',
        url: '/reviews',
        category: 'reviews',
        badge: 'Reviews Hub',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        description: 'Objective, comprehensive score breakdowns evaluating gameplay mechanics, graphical fidelity, and stability.',
        priority: '0.9',
        changefreq: 'Weekly'
      },
      {
        id: 'guides-hub',
        title: 'Tactical Playbooks & Build Guides',
        url: '/guides',
        category: 'guides',
        badge: 'Guides Hub',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        description: 'Step-by-step strategy routes, character stat builds, armor penetration formulas, and framerate tuning.',
        priority: '0.9',
        changefreq: 'Weekly'
      },
      {
        id: 'forum-hub',
        title: 'Community Forum & Discussion Hub',
        url: '/forum',
        category: 'forum',
        badge: 'Community Hub',
        badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        description: 'Player discussions, hardware upgrade debates, co-op squad recruitment, and feedback channels.',
        priority: '0.9',
        changefreq: 'Daily'
      },

      // 2. Gamer Tools & AI Suite (NEW)
      {
        id: 'tools-hub',
        title: 'Gaming Tools Hub — Complete Suite',
        url: '/tools',
        category: 'tools',
        badge: 'Tools Suite',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        description: 'Central portal for all interactive gamer utilities, AI assistants, PC builders, and performance tools.',
        priority: '0.9',
        changefreq: 'Weekly',
        isNew: true
      },
      {
        id: 'vault-ai',
        title: 'Vault AI — Intelligent Gaming Assistant',
        url: '/tools/vault-ai',
        category: 'tools',
        badge: 'AI Assistant',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        description: 'Server-side AI conversational companion answering gaming questions, build queries, hardware advice, and low-FPS troubleshooting.',
        priority: '0.9',
        changefreq: 'Daily',
        isNew: true
      },
      {
        id: 'pc-requirements-checker',
        title: 'PC Game System Requirements Checker',
        url: '/tools/pc-game-requirements-checker',
        category: 'tools',
        badge: 'Benchmark Tool',
        badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        description: 'Evaluate minimum, recommended, and 4K ultra hardware requirements with GPU/CPU tier comparisons.',
        priority: '0.9',
        changefreq: 'Weekly',
        isNew: true
      },
      {
        id: 'gaming-pc-builder',
        title: 'Gaming PC Builder & Compatibility Checker',
        url: '/tools/gaming-pc-builder',
        category: 'tools',
        badge: 'PC Hardware',
        badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        description: 'Interactive custom PC configurator with multi-currency pricing (USD $ / NGN ₦), wattage calculations, and bottleneck scoring.',
        priority: '0.8',
        changefreq: 'Weekly',
        isNew: true
      },
      {
        id: 'gaming-username-generator',
        title: 'Gaming Username & Gamertag Generator',
        url: '/tools/gaming-username-generator',
        category: 'tools',
        badge: 'Gamer Tool',
        badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        description: 'Generate personalized gaming handles filtered by genre, playstyle, prefix, and platform availability.',
        priority: '0.8',
        changefreq: 'Monthly',
        isNew: true
      },
      {
        id: 'game-picker-wheel',
        title: 'Game Picker Wheel — Random Game Decision Spinner',
        url: '/game-picker-wheel',
        category: 'tools',
        badge: 'Interactive Spinner',
        badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        description: 'Interactive virtual wheel to randomly select what game to play next with custom entries, quick presets, audio toggles, and result actions.',
        priority: '0.9',
        changefreq: 'Weekly',
        isNew: true
      },

      // 3. PC Requirements Direct Game Checkers (NEW)
      ...MOCK_GAMES.map((game) => {
        const slug = getSeoSlug(game);
        return {
          id: `req-${game.id}`,
          title: `${game.title} — PC System Requirements & Can You Run It?`,
          url: `/tools/pc-game-requirements-checker/${slug}`,
          category: 'tools' as const,
          badge: 'Game Specs',
          badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          description: `Direct hardware requirement analysis, minimum & recommended PC specs, and frame-rate estimates for ${game.title}.`,
          priority: '0.8',
          changefreq: 'Weekly',
          isNew: true
        };
      }),

      // 4. Games Catalog Detail Pages
      ...MOCK_GAMES.map((game) => {
        const slug = getSeoSlug(game);
        return {
          id: `game-${game.id}`,
          title: `${game.title} — Game Overview & Hub`,
          url: `/games/${slug}`,
          category: 'games' as const,
          badge: game.genre,
          badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          description: game.shortDescription || `Comprehensive game overview, system requirements, linked guides, and review scores for ${game.title}.`,
          priority: '0.8',
          changefreq: 'Weekly'
        };
      }),

      // 5. Video Deep Dives & Gameplay
      ...MOCK_VIDEOS.map((video) => {
        const slug = getSeoSlug(video);
        return {
          id: `video-${video.id}`,
          title: `${video.title} (${video.duration})`,
          url: `/videos/${slug}`,
          category: 'videos' as const,
          badge: video.game || 'Gameplay',
          badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
          description: video.description || `In-depth video analysis covering ${video.game} with high-definition YouTube gameplay and timestamps.`,
          priority: '0.8',
          changefreq: 'Weekly'
        };
      }),

      // 6. Articles & Editorial Analysis
      ...MOCK_ARTICLES.map((article) => {
        const slug = getSeoSlug(article);
        return {
          id: `article-${article.id}`,
          title: article.title,
          url: `/articles/${slug}`,
          category: 'articles' as const,
          badge: article.category,
          badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          description: article.excerpt || `In-depth editorial commentary and tactical insight on ${article.title}.`,
          priority: '0.8',
          changefreq: 'Weekly'
        };
      }),

      // 7. Reviews & Benchmarks
      ...MOCK_REVIEWS.map((review) => {
        const slug = getSeoSlug(review);
        return {
          id: `review-${review.id}`,
          title: `${review.gameTitle} Review (${review.score}/10 — ${review.scoreLabel})`,
          url: `/reviews/${slug}`,
          category: 'reviews' as const,
          badge: `${review.score}/10 ${review.scoreLabel}`,
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          description: review.shortVerdict || `Full scored review for ${review.gameTitle} detailing gameplay, visuals, audio, and technical performance.`,
          priority: '0.8',
          changefreq: 'Weekly'
        };
      }),

      // 8. Tactical Guides
      ...MOCK_GUIDES.map((guide) => {
        const slug = getSeoSlug(guide);
        return {
          id: `guide-${guide.id}`,
          title: guide.title,
          url: `/guides/${slug}`,
          category: 'guides' as const,
          badge: `${guide.game} Guide`,
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          description: guide.shortDescription || `Essential tactical strategies, formulas, and walkthrough steps for ${guide.title}.`,
          priority: '0.8',
          changefreq: 'Weekly'
        };
      }),

      // 9. Community Forum Discussions
      ...MOCK_FORUM_TOPICS.map((topic) => {
        const slug = getSeoSlug(topic);
        const count = Array.isArray(topic.replies) ? topic.replies.length : 0;
        const authorHandle = topic.author.username || topic.author.name.toLowerCase().replace(/\s+/g, '');
        return {
          id: `forum-${topic.id}`,
          title: topic.title,
          url: `/forum/${slug}`,
          category: 'forum' as const,
          badge: `${count} ${count === 1 ? 'Reply' : 'Replies'}`,
          badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          description: `Community discussion thread started by @${authorHandle} with active gamer opinions and commentary.`,
          priority: '0.8',
          changefreq: 'Daily'
        };
      }),

      // 10. Information, Policies & Legal
      {
        id: 'sitemap',
        title: 'Website Sitemap — Complete URL Index',
        url: '/sitemap',
        category: 'legal',
        badge: 'Index',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        description: 'Interactive HTML directory of every public page, tool, article, guide, and discussion on Game Vault Forum.',
        priority: '0.7',
        changefreq: 'Weekly',
        isNew: true
      },
      {
        id: 'about',
        title: 'About Game Vault Forum — Mission & Editorial Philosophy',
        url: '/about',
        category: 'legal',
        badge: 'Company Info',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        description: 'Learn about the creators, high-standard editorial standards, and gaming community roots behind Game Vault.',
        priority: '0.7',
        changefreq: 'Monthly'
      },
      {
        id: 'contact',
        title: 'Contact Editorial Desk & Feedback Desk',
        url: '/contact',
        category: 'legal',
        badge: 'Support',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        description: 'Reach our editorial writers, technical analysts, or report platform bugs directly.',
        priority: '0.7',
        changefreq: 'Monthly'
      },
      {
        id: 'guidelines',
        title: 'Community Code of Conduct & Posting Guidelines',
        url: '/guidelines',
        category: 'legal',
        badge: 'Policy',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        description: 'Standards for respectful discussion, constructive feedback, anti-toxicity rules, and moderation policies.',
        priority: '0.5',
        changefreq: 'Monthly'
      },
      {
        id: 'privacy',
        title: 'Privacy Policy & Data Security Standards',
        url: '/privacy',
        category: 'legal',
        badge: 'GDPR / Legal',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        description: 'Clear documentation of user privacy rights, zero sale of personal data, and browser storage guidelines.',
        priority: '0.4',
        changefreq: 'Monthly'
      },
      {
        id: 'terms',
        title: 'Terms of Service & Platform Usage Agreement',
        url: '/terms',
        category: 'legal',
        badge: 'Legal',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        description: 'Terms governing account creation, comment submissions, intellectual property, and community guidelines.',
        priority: '0.4',
        changefreq: 'Monthly'
      },
      {
        id: 'cookies',
        title: 'Cookie Policy & Consent Settings',
        url: '/cookies',
        category: 'legal',
        badge: 'Legal',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        description: 'Explanation of essential local storage preferences, session authentication cookies, and analytics handling.',
        priority: '0.4',
        changefreq: 'Monthly'
      }
    ];

    return items;
  }, []);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return sitemapItems.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    });
  }, [sitemapItems, activeCategory, searchQuery]);

  // Count by category
  const counts = useMemo(() => {
    return {
      all: sitemapItems.length,
      tools: sitemapItems.filter(i => i.category === 'tools').length,
      games: sitemapItems.filter(i => i.category === 'games').length,
      articles: sitemapItems.filter(i => i.category === 'articles').length,
      reviews: sitemapItems.filter(i => i.category === 'reviews').length,
      guides: sitemapItems.filter(i => i.category === 'guides').length,
      videos: sitemapItems.filter(i => i.category === 'videos').length,
      forum: sitemapItems.filter(i => i.category === 'forum').length,
      legal: sitemapItems.filter(i => i.category === 'legal').length,
    };
  }, [sitemapItems]);

  const handleCopy = (url: string) => {
    const fullUrl = `https://www.gamevault.forum${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Header Banner */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Network className="w-3.5 h-3.5" />
                <span>Search Engine & Navigation Index</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Website Sitemap
              </h1>
              <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
                Complete directory of all {sitemapItems.length} public pages, interactive gamer tools, AI assistant features, game catalog entries, editorial reviews, technical guides, video walkthroughs, and community discussions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/20 group"
              >
                <Code className="w-4 h-4" />
                <span>View XML Sitemap</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white font-medium text-sm transition-all"
              >
                <span>robots.txt</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-8 pt-8 border-t border-white/5">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-zinc-400 font-medium block">Total Pages</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{sitemapItems.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-purple-400 font-medium block">Gamer Tools</span>
              <span className="text-xl font-bold text-purple-300 mt-0.5 block">{counts.tools}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-cyan-400 font-medium block">Games Catalog</span>
              <span className="text-xl font-bold text-cyan-300 mt-0.5 block">{counts.games}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-red-400 font-medium block">Videos</span>
              <span className="text-xl font-bold text-red-300 mt-0.5 block">{counts.videos}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-blue-400 font-medium block">Articles</span>
              <span className="text-xl font-bold text-blue-300 mt-0.5 block">{counts.articles}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-amber-400 font-medium block">Reviews</span>
              <span className="text-xl font-bold text-amber-300 mt-0.5 block">{counts.reviews}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
              <span className="text-xs text-emerald-400 font-medium block">Guides & Forum</span>
              <span className="text-xl font-bold text-emerald-300 mt-0.5 block">{counts.guides + counts.forum}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body & Interactive Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls: Search + Categories */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter sitemap by title, URL or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white bg-zinc-800 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Pages', count: counts.all },
              { id: 'tools', label: 'Tools & AI', count: counts.tools },
              { id: 'games', label: 'Games', count: counts.games },
              { id: 'videos', label: 'Videos', count: counts.videos },
              { id: 'articles', label: 'Articles', count: counts.articles },
              { id: 'reviews', label: 'Reviews', count: counts.reviews },
              { id: 'guides', label: 'Guides', count: counts.guides },
              { id: 'forum', label: 'Forum', count: counts.forum },
              { id: 'legal', label: 'Legal & Info', count: counts.legal },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategory === cat.id ? 'bg-purple-800 text-purple-200' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 pb-2 border-b border-white/5">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> of{' '}
            <strong className="text-white">{sitemapItems.length}</strong> pages
          </span>
          <span className="hidden sm:inline">
            All URLs are canonical and declared in <code className="text-purple-400 font-mono text-[11px]">/sitemap.xml</code>
          </span>
        </div>

        {/* Sitemap Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-zinc-900/40 border border-white/10">
            <Search className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No sitemap pages found</h3>
            <p className="text-sm text-zinc-400 mt-1">
              No indexed URLs matched &ldquo;{searchQuery}&rdquo;. Try another search term or reset category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-purple-500/40 hover:bg-zinc-900/90 transition-all duration-200 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>

                    <div className="flex items-center gap-1">
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-zinc-500">
                        P: {item.priority}
                      </span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => onNavigate(item.url)}
                    className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[170px] sm:max-w-[200px]">
                    {item.url}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url)}
                      title="Copy full URL to clipboard"
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                      {copiedUrl === item.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate(item.url)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold transition-all group-hover:translate-x-0.5"
                    >
                      <span>Visit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Engine Submission & Crawling Information */}
        <section className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Search Engine Console Verified</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Automated Search Engine Discovery
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Game Vault Forum publishes an automated XML sitemap adhering to the Sitemaps.org 0.9 protocol. All newly published tactical playbooks, hardware requirement tools, benchmark databases, and community discussions are refreshed daily with valid <code className="text-purple-300">lastmod</code> and canonical URL declarations for Googlebot, Bingbot, and modern web crawlers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                <span>Open Raw XML Sitemap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => handleCopy('/sitemap.xml')}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-2"
              >
                {copiedUrl === '/sitemap.xml' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied XML URL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Sitemap URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
