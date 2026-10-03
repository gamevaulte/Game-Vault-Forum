import fs from 'fs';
import path from 'path';
import { MOCK_ARTICLES } from '../data/articlesData';
import { MOCK_REVIEWS, MOCK_GUIDES, MOCK_VIDEOS, MOCK_GAMES } from '../data/mockData';
import { VERIFIED_GAME_DATABASE } from '../data/gameStoryDatabase';
import { GAME_RELEASES_DATABASE } from '../data/gameReleasesData';
import { getSeoSlug, slugify } from '../lib/seo';

interface PrerenderResult {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  ogType?: 'website' | 'article';
  bodyHtml: string;
  jsonLd?: object;
}

export function handleSeoPrerender(reqPath: string, isProd: boolean): string | null {
  try {
    const cleanPath = reqPath.split('?')[0].replace(/\/+$/, '') || '/';

    // Skip root (already pre-rendered in index.html), API endpoints, and static files
    if (
      cleanPath === '/' ||
      cleanPath.startsWith('/api/') ||
      cleanPath.startsWith('/assets/') ||
      /\.(jpg|jpeg|png|webp|gif|svg|ico|css|js|map|txt|xml|json|pdf)$/i.test(cleanPath)
    ) {
      return null;
    }

    const htmlPath = isProd
      ? path.join(process.cwd(), 'dist', 'index.html')
      : path.join(process.cwd(), 'index.html');

    if (!fs.existsSync(htmlPath)) return null;
    let baseHtml = fs.readFileSync(htmlPath, 'utf8');

    const result = resolveRouteContent(cleanPath);
    if (!result) return null;

    return renderHtmlDocument(baseHtml, result);
  } catch (err) {
    console.error('Error during SEO prerender:', err);
    return null;
  }
}

function resolveRouteContent(cleanPath: string): PrerenderResult | null {
  // 1. Articles
  if (cleanPath.startsWith('/articles/')) {
    const slug = cleanPath.replace(/^\/articles\//, '');
    const article = MOCK_ARTICLES.find(
      (a) => getSeoSlug(a) === slug || a.id === slug || a.slug === slug
    );
    if (!article) return null;
    return renderArticlePage(article);
  }
  if (cleanPath === '/articles') {
    return renderArticlesArchivePage();
  }

  // 2. Reviews
  if (cleanPath.startsWith('/reviews/')) {
    const slug = cleanPath.replace(/^\/reviews\//, '');
    const review = MOCK_REVIEWS.find(
      (r) =>
        getSeoSlug({ id: r.id, title: `${r.gameTitle} review` }) === slug ||
        r.id === slug ||
        slugify(r.gameTitle) === slug ||
        slugify(`${r.gameTitle} review`) === slug
    );
    if (!review) return null;
    return renderReviewPage(review);
  }
  if (cleanPath === '/reviews') {
    return renderReviewsArchivePage();
  }

  // 3. Guides
  if (cleanPath.startsWith('/guides/')) {
    const slug = cleanPath.replace(/^\/guides\//, '');
    const guide = MOCK_GUIDES.find(
      (g) => getSeoSlug(g) === slug || g.id === slug || slugify(g.title) === slug
    );
    if (!guide) return null;
    return renderGuidePage(guide);
  }
  if (cleanPath === '/guides') {
    return renderGuidesArchivePage();
  }

  // 4. Policy & Trust Pages (AdSense Mandatory)
  if (cleanPath === '/about') {
    return renderAboutPage();
  }
  if (cleanPath === '/contact') {
    return renderContactPage();
  }
  if (cleanPath === '/privacy') {
    return renderPrivacyPage();
  }
  if (cleanPath === '/terms') {
    return renderTermsPage();
  }
  if (cleanPath === '/cookies') {
    return renderCookiePolicyPage();
  }
  if (cleanPath === '/guidelines') {
    return renderGuidelinesPage();
  }
  if (cleanPath === '/sitemap') {
    return renderHtmlSitemapPage();
  }

  // 5. Tools & Interactive Features
  if (cleanPath === '/tools' || cleanPath === '/tools/hub') {
    return renderToolsHubPage();
  }
  if (cleanPath === '/tools/game-story-overview-generator' || cleanPath === '/game-story-overview-generator') {
    return renderGameStoryGeneratorToolPage();
  }
  if (cleanPath === '/tools/game-release-calendar' || cleanPath === '/game-release-calendar') {
    return renderReleaseCalendarToolPage();
  }
  if (cleanPath === '/tools/fps-calculator' || cleanPath === '/fps-calculator') {
    return renderFpsCalculatorToolPage();
  }
  if (cleanPath === '/tools/pc-game-requirements-checker' || cleanPath === '/pc-game-requirements-checker') {
    return renderPcRequirementsToolPage();
  }
  if (cleanPath === '/tools/pc-builder' || cleanPath === '/pc-builder') {
    return renderPcBuilderToolPage();
  }
  if (cleanPath === '/tools/gaming-username-generator' || cleanPath === '/gaming-username-generator') {
    return renderUsernameGeneratorToolPage();
  }
  if (cleanPath === '/tools/avatar-generator' || cleanPath === '/avatar-generator') {
    return renderAvatarGeneratorToolPage();
  }
  if (cleanPath === '/tools/vault-ai' || cleanPath === '/vault-ai') {
    return renderVaultAiToolPage();
  }
  if (cleanPath === '/game-picker-wheel') {
    return renderGamePickerWheelToolPage();
  }

  // 6. Authors
  if (cleanPath.startsWith('/authors/')) {
    const slug = cleanPath.replace('/authors/', '');
    return renderAuthorPage(slug);
  }

  // 7. Videos
  if (cleanPath.startsWith('/videos/')) {
    const slug = cleanPath.replace('/videos/', '');
    const video = MOCK_VIDEOS.find(
      (v) => getSeoSlug(v) === slug || v.id === slug || slugify(v.title) === slug
    );
    if (!video) return null;
    return renderVideoPage(video);
  }
  if (cleanPath === '/videos') {
    return renderVideosArchivePage();
  }

  // 8. Games Catalog
  if (cleanPath.startsWith('/games/')) {
    const slug = cleanPath.replace('/games/', '');
    const game = MOCK_GAMES.find(
      (g) => getSeoSlug(g) === slug || g.id === slug || slugify(g.title) === slug
    );
    if (!game) return null;
    return renderGamePage(game);
  }
  if (cleanPath === '/games') {
    return renderGamesArchivePage();
  }

  // 9. Community Forum
  if (cleanPath === '/forum') {
    return renderForumHubPage();
  }

  // 10. Play Retro Games
  if (cleanPath.startsWith('/play-games')) {
    return renderPlayGamesPage(cleanPath);
  }

  return null;
}

// ============================================================================
// PAGE RENDERERS
// ============================================================================

function renderArticlePage(article: any): PrerenderResult {
  const title = article.seoTitle || `${article.title} | Game Vault Forum`;
  const description = article.metaDescription || article.excerpt;
  const canonicalUrl = `https://www.gamevault.forum/articles/${getSeoSlug(article)}`;
  const rawImage = article.featuredImage || article.image || 'https://www.gamevault.forum/favicon.png';
  const imageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://www.gamevault.forum${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;
  const authorName = article.author?.name || 'Joel Ayuba';
  const authorUrl = `https://www.gamevault.forum/authors/${authorName.toLowerCase().replace(/\s+/g, '-')}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl],
    datePublished: '2026-09-02T00:00:00Z',
    dateModified: '2026-09-28T00:00:00Z',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: article.author?.role || 'Founder & Lead Technical Analyst',
      url: authorUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Game Vault Forum',
      url: 'https://www.gamevault.forum',
      logo: { '@type': 'ImageObject', url: 'https://www.gamevault.forum/favicon.ico' }
    }
  };

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.7; color: #f1f5f9;">
    <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 13px; color: #94a3b8;">
      <a href="/" style="color: #c4b5fd; text-decoration: none;">Home</a> &gt; 
      <a href="/articles" style="color: #c4b5fd; text-decoration: none;">Articles</a> &gt; 
      <span style="color: #cbd5e1;">${escapeHtml(article.title)}</span>
    </nav>

    <header style="margin-bottom: 32px;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(147, 51, 234, 0.2); color: #d8b4fe; border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
        ${escapeHtml(article.category || 'Feature Essay')}
      </span>
      <h1 style="font-size: 34px; font-weight: 800; line-height: 1.3; color: #ffffff; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif;">
        ${escapeHtml(article.title)}
      </h1>
      <p style="font-size: 18px; color: #cbd5e1; margin-bottom: 24px; line-height: 1.6;">
        ${escapeHtml(article.excerpt)}
      </p>

      <div style="display: flex; align-items: center; gap: 16px; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 0;">
        <img src="${article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}" alt="${escapeHtml(authorName)}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />
        <div>
          <div style="font-weight: 700; color: #ffffff;">
            <a href="${authorUrl}" style="color: #c4b5fd; text-decoration: none;">${escapeHtml(authorName)}</a>
          </div>
          <div style="font-size: 12px; color: #94a3b8;">
            ${escapeHtml(article.author?.role || 'Founder & Lead Technical Analyst')} • ${escapeHtml(article.publicationDate || 'September 2026')} • ${escapeHtml(article.readingTime || '10 min read')}
          </div>
        </div>
      </div>
    </header>

    <figure style="margin: 0 0 36px 0;">
      <img src="${imageUrl}" alt="${escapeHtml(article.title)}" style="width: 100%; border-radius: 16px; max-height: 520px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" />
    </figure>

    <article style="font-size: 17px; color: #cbd5e1; line-height: 1.8;">
      ${renderMarkdownToHtml(article.content)}
    </article>

    <section style="margin-top: 48px; padding: 28px; background: #0f1220; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;">
      <h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px; font-family: 'Space Grotesk', sans-serif;">
        About the Author — ${escapeHtml(authorName)}
      </h3>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.7;">
        ${authorName} is the Founder and Lead Technical Analyst of Game Vault Forum. Focused on PC hardware architecture, frame time pacing, and tactical game mechanics, his work emphasizes zero-hype, verifiable testing and consumer advocacy.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, imageUrl, ogType: 'article', bodyHtml, jsonLd };
}

function renderArticlesArchivePage(): PrerenderResult {
  const title = 'Articles, Essays & Game Design Analysis | Game Vault Forum';
  const description = 'Deep-dive gaming journalism, architectural game design breakdowns, cognitive psychology of strategy, and PC hardware analysis by Joel Ayuba.';
  const canonicalUrl = 'https://www.gamevault.forum/articles';

  const articlesCards = MOCK_ARTICLES.map(
    (a) => `
    <article style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; margin-bottom: 24px;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a78bfa; letter-spacing: 0.5px;">${escapeHtml(a.category || 'Article')}</span>
      <h2 style="font-size: 22px; font-weight: 700; margin: 8px 0 12px 0;">
        <a href="/articles/${getSeoSlug(a)}" style="color: #ffffff; text-decoration: none;">${escapeHtml(a.title)}</a>
      </h2>
      <p style="font-size: 13px; color: #94a3b8; margin-bottom: 12px;">By ${escapeHtml(a.author?.name || 'Joel Ayuba')} • ${escapeHtml(a.publicationDate || 'Sept 2026')} • ${escapeHtml(a.readingTime || '8 min read')}</p>
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">${escapeHtml(a.excerpt)}</p>
      <a href="/articles/${getSeoSlug(a)}" style="display: inline-block; font-size: 13px; font-weight: 700; color: #38bdf8; text-decoration: none;">Read Full Analysis &rarr;</a>
    </article>`
  ).join('\n');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 12px;">
      Gaming Journalism, Tactical Analyses & Thought Pieces
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 36px; max-width: 800px; line-height: 1.6;">
      Explore our complete archive of long-form video game critique, game engine performance studies, and cognitive analysis. Every piece is crafted with rigorous research and zero algorithmic fluff.
    </p>
    <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
      ${articlesCards}
    </div>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderReviewPage(review: any): PrerenderResult {
  const title = `${review.gameTitle} Review — Scored Critique & Technical Breakdown | Game Vault Forum`;
  const description = `Read our definitive scored review of ${review.gameTitle} (${review.score}/10, ${review.scoreLabel}). In-depth gameplay critique, hardware benchmarks, pros, cons, and final verdict.`;
  const canonicalUrl = `https://www.gamevault.forum/reviews/${getSeoSlug({ id: review.id, title: `${review.gameTitle} review` })}`;
  const rawImage = review.artwork || 'https://www.gamevault.forum/favicon.png';
  const imageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://www.gamevault.forum${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'VideoGame',
      name: review.gameTitle,
      gamePlatform: review.platform || 'PC, PS5, Xbox Series X|S',
      genre: review.genre || 'Action / RPG'
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.score,
      bestRating: 10,
      worstRating: 1
    },
    author: {
      '@type': 'Person',
      name: review.reviewer || review.author || 'Joel Ayuba',
      url: 'https://www.gamevault.forum/authors/joel-ayuba'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Game Vault Forum',
      url: 'https://www.gamevault.forum'
    },
    reviewBody: review.fullReview
  };

  const prosList = (review.pros || []).map((p: string) => `<li style="margin-bottom: 8px;">&check; ${escapeHtml(p)}</li>`).join('');
  const consList = (review.cons || []).map((c: string) => `<li style="margin-bottom: 8px;">&times; ${escapeHtml(c)}</li>`).join('');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.7; color: #f1f5f9;">
    <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 13px; color: #94a3b8;">
      <a href="/" style="color: #c4b5fd; text-decoration: none;">Home</a> &gt; 
      <a href="/reviews" style="color: #c4b5fd; text-decoration: none;">Reviews</a> &gt; 
      <span style="color: #cbd5e1;">${escapeHtml(review.gameTitle)} Review</span>
    </nav>

    <header style="margin-bottom: 32px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
        <span style="display: inline-block; padding: 4px 12px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          ${escapeHtml(review.genre || 'Game Review')} • ${escapeHtml(review.platform || 'Multiplatform')}
        </span>
        <div style="display: flex; align-items: baseline; gap: 8px; background: rgba(139, 92, 246, 0.2); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.4);">
          <span style="font-size: 28px; font-weight: 900; color: #ffffff; font-family: 'Space Grotesk', sans-serif;">${review.score}</span>
          <span style="font-size: 14px; color: #c4b5fd; font-weight: 600;">/ 10 (${escapeHtml(review.scoreLabel)})</span>
        </div>
      </div>

      <h1 style="font-size: 36px; font-weight: 800; line-height: 1.25; color: #ffffff; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif;">
        ${escapeHtml(review.gameTitle)} Review
      </h1>
      <p style="font-size: 18px; color: #cbd5e1; font-weight: 500; margin-bottom: 24px; line-height: 1.6; border-left: 3px solid #8b5cf6; padding-left: 16px;">
        ${escapeHtml(review.shortVerdict)}
      </p>

      <div style="font-size: 13px; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 0;">
        Reviewed by <strong>${escapeHtml(review.reviewer || review.author || 'Joel Ayuba')}</strong> • Published: ${escapeHtml(review.publishDate || '2026')} • Platform Tested: ${escapeHtml(review.platform || 'PC')}
      </div>
    </header>

    <figure style="margin: 0 0 36px 0;">
      <img src="${imageUrl}" alt="${escapeHtml(review.gameTitle)}" style="width: 100%; border-radius: 16px; max-height: 500px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" />
    </figure>

    <article style="font-size: 17px; color: #cbd5e1; line-height: 1.8; margin-bottom: 40px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 32px 0 16px 0; font-family: 'Space Grotesk', sans-serif;">Comprehensive Review & Analysis</h2>
      ${renderMarkdownToHtml(review.fullReview)}
    </article>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
      <div style="padding: 24px; background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 14px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #4ade80; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">The Highlights</h3>
        <ul style="padding-left: 0; list-style: none; font-size: 14px; color: #dcfce7; line-height: 1.6;">${prosList}</ul>
      </div>
      <div style="padding: 24px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 14px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #f87171; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">The Lowlights</h3>
        <ul style="padding-left: 0; list-style: none; font-size: 14px; color: #fee2e2; line-height: 1.6;">${consList}</ul>
      </div>
    </div>

    <section style="padding: 28px; background: #0f1220; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;">
      <h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px; font-family: 'Space Grotesk', sans-serif;">
        Editorial Review Standards
      </h3>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.7;">
        All reviews at Game Vault Forum are conducted on commercial hardware without publisher editorial approval. We do not accept sponsored review scores or promotional gifts. Inaccuracies in performance benchmarking or technical specifications are corrected within 24 hours.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, imageUrl, ogType: 'article', bodyHtml, jsonLd };
}

function renderReviewsArchivePage(): PrerenderResult {
  const title = 'Video Game Reviews & Scored Critiques | Game Vault Forum';
  const description = 'Honest, in-depth video game reviews. Scored critiques across PC, PlayStation 5, and Xbox Series X with frame-rate benchmarks and pros/cons.';
  const canonicalUrl = 'https://www.gamevault.forum/reviews';

  const reviewsList = MOCK_REVIEWS.map(
    (r) => `
    <article style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12px;">
        <div>
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #38bdf8;">${escapeHtml(r.genre)} • ${escapeHtml(r.platform)}</span>
          <h2 style="font-size: 22px; font-weight: 700; margin: 4px 0 0 0;">
            <a href="/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}" style="color: #ffffff; text-decoration: none;">${escapeHtml(r.gameTitle)}</a>
          </h2>
        </div>
        <div style="background: rgba(139, 92, 246, 0.2); padding: 6px 14px; border-radius: 10px; border: 1px solid rgba(139, 92, 246, 0.4); text-align: center; shrink-0;">
          <div style="font-size: 22px; font-weight: 900; color: #ffffff;">${r.score}</div>
          <div style="font-size: 11px; color: #c4b5fd;">${escapeHtml(r.scoreLabel)}</div>
        </div>
      </div>
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">${escapeHtml(r.shortVerdict)}</p>
      <a href="/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}" style="font-size: 13px; font-weight: 700; color: #a78bfa; text-decoration: none;">Read Full Review & Pros/Cons &rarr;</a>
    </article>`
  ).join('\n');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 12px;">
      Official Video Game Reviews & Technical Evaluations
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 36px; max-width: 800px; line-height: 1.6;">
      Zero-hype, honest assessments of the latest AAA releases, tactical sims, and indie triumphs. Every review includes full gameplay analysis, hardware performance notes, and pros/cons.
    </p>
    <div>${reviewsList}</div>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderGuidePage(guide: any): PrerenderResult {
  const title = `${guide.title} — Tactical Walkthrough | Game Vault Forum`;
  const description = guide.shortDescription || `Master ${guide.game} with this tactical step-by-step guide. Difficulty: ${guide.difficulty}, Estimated reading time: ${guide.estimatedReadingTime}.`;
  const canonicalUrl = `https://www.gamevault.forum/guides/${getSeoSlug(guide)}`;
  const rawImage = guide.image || 'https://www.gamevault.forum/favicon.png';
  const imageUrl = rawImage.startsWith('http')
    ? rawImage
    : `https://www.gamevault.forum${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.shortDescription,
    image: imageUrl,
    totalTime: 'PT15M',
    step: (guide.sections || []).map((s: any, idx: number) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.heading,
      text: s.content
    }))
  };

  const sectionsHtml = (guide.sections || []).map(
    (s: any) => `
    <section style="margin-bottom: 32px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; font-family: 'Space Grotesk', sans-serif;">${escapeHtml(s.heading)}</h2>
      <p style="font-size: 16px; color: #cbd5e1; line-height: 1.8; margin-bottom: 16px;">${escapeHtml(s.content)}</p>
      ${s.tip ? `<div style="padding: 14px 18px; background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38bdf8; border-radius: 8px; font-size: 14px; color: #bae6fd;"><strong>Pro Tip:</strong> ${escapeHtml(s.tip)}</div>` : ''}
    </section>`
  ).join('\n');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.7; color: #f1f5f9;">
    <nav aria-label="Breadcrumb" style="margin-bottom: 24px; font-size: 13px; color: #94a3b8;">
      <a href="/" style="color: #c4b5fd; text-decoration: none;">Home</a> &gt; 
      <a href="/guides" style="color: #c4b5fd; text-decoration: none;">Guides</a> &gt; 
      <span style="color: #cbd5e1;">${escapeHtml(guide.title)}</span>
    </nav>

    <header style="margin-bottom: 32px;">
      <span style="display: inline-block; padding: 4px 12px; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
        ${escapeHtml(guide.game)} • Difficulty: ${escapeHtml(guide.difficulty)} • ~${escapeHtml(guide.estimatedReadingTime)}
      </span>
      <h1 style="font-size: 34px; font-weight: 800; line-height: 1.3; color: #ffffff; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif;">
        ${escapeHtml(guide.title)}
      </h1>
      <p style="font-size: 18px; color: #cbd5e1; margin-bottom: 24px; line-height: 1.6;">
        ${escapeHtml(guide.shortDescription)}
      </p>
    </header>

    <figure style="margin: 0 0 36px 0;">
      <img src="${imageUrl}" alt="${escapeHtml(guide.title)}" style="width: 100%; border-radius: 16px; max-height: 480px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" />
    </figure>

    <article style="margin-bottom: 40px;">
      ${sectionsHtml}
    </article>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, imageUrl, ogType: 'article', bodyHtml, jsonLd };
}

function renderGuidesArchivePage(): PrerenderResult {
  const title = 'Tactical Gaming Guides & Mechanical Walkthroughs | Game Vault Forum';
  const description = 'Step-by-step strategy guides, boss breakdowns, Scadutree fragment routes, naval armor angling formulas, and competitive playbooks.';
  const canonicalUrl = 'https://www.gamevault.forum/guides';

  const guidesList = MOCK_GUIDES.map(
    (g) => `
    <article style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; margin-bottom: 24px;">
      <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #38bdf8;">${escapeHtml(g.game)} • ${escapeHtml(g.difficulty)}</span>
      <h2 style="font-size: 22px; font-weight: 700; margin: 8px 0 10px 0;">
        <a href="/guides/${getSeoSlug(g)}" style="color: #ffffff; text-decoration: none;">${escapeHtml(g.title)}</a>
      </h2>
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">${escapeHtml(g.shortDescription)}</p>
      <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">Reading time: ~${escapeHtml(g.estimatedReadingTime)} • Category: ${escapeHtml(g.category)}</div>
      <a href="/guides/${getSeoSlug(g)}" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">Read Step-by-Step Guide &rarr;</a>
    </article>`
  ).join('\n');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 12px;">
      Tactical Playbooks & Deep-Dive Mechanical Walkthroughs
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 36px; max-width: 800px; line-height: 1.6;">
      Master complex gaming systems with our verified, tested walkthroughs. From Souls-like boss telegraphs to tactical naval ballistics, explore the playbooks that give you the edge.
    </p>
    <div>${guidesList}</div>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

// ----------------------------------------------------------------------------
// MANDATORY POLICY & TRUST PAGES
// ----------------------------------------------------------------------------

function renderAboutPage(): PrerenderResult {
  const title = 'About Game Vault Forum | Editorial Standards, Testing Lab & Mission';
  const description = 'Founded by Joel Ayuba, Game Vault Forum delivers honest, hundred-hour game testing, PC hardware benchmarks, and civil community discourse without commercial bias.';
  const canonicalUrl = 'https://www.gamevault.forum/about';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Game Vault Forum',
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'Game Vault Forum',
      url: 'https://www.gamevault.forum',
      founder: {
        '@type': 'Person',
        name: 'Joel Ayuba',
        jobTitle: 'Founder & Lead Technical Publisher',
        email: 'joelotis40@gmail.com'
      },
      sameAs: ['https://www.youtube.com/@GameVaultForum']
    }
  };

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 38px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 20px;">
      About Game Vault Forum
    </h1>
    <p style="font-size: 18px; color: #c4b5fd; font-weight: 600; margin-bottom: 32px;">
      Independent Gaming Media • Mechanical Rigor • Honest Hardware Benchmarking • Civil Community
    </p>

    <section style="margin-bottom: 36px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 16px;">
        Our Mission & Founding Philosophy
      </h2>
      <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 16px;">
        Game Vault Forum was established to address a persistent frustration in contemporary gaming media: the prevalence of superficial impressions disguised as reviews, rushed content calibrated for algorithmic clicks, and advertising influence compromising editorial integrity.
      </p>
      <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 16px;">
        Founded and published by <strong>Joel Ayuba</strong>, Game Vault Forum operates as both an authoritative digital journal and a home for deep-dive gaming video productions (<strong>@GameVaultForum</strong> on YouTube). Every review, guide, and hardware analysis is produced through extensive hands-on testing, objective frame-time telemetry, and respectful discourse.
      </p>
    </section>

    <section style="margin-bottom: 36px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 16px;">
        Editorial Staff & Masthead
      </h2>
      <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
        <div style="padding: 20px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Joel Ayuba — Founder & Lead Publisher</h3>
          <p style="font-size: 13px; color: #a78bfa; margin-bottom: 8px;">Technical Lead, Video Producer & PC Hardware Specialist</p>
          <p style="font-size: 14px; color: #cbd5e1;">Oversees all editorial direction, benchmark methodology, and video production on YouTube. Contact: <a href="mailto:joelotis40@gmail.com" style="color: #38bdf8;">joelotis40@gmail.com</a></p>
        </div>
        <div style="padding: 20px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Marcus Vance — Senior Contributing Editor</h3>
          <p style="font-size: 13px; color: #a78bfa; margin-bottom: 8px;">RPG Architecture, Open-World Systems & Lore Analysis</p>
          <p style="font-size: 14px; color: #cbd5e1;">Specializes in FromSoftware titles, CRPGs, and open-world systemic progression.</p>
        </div>
        <div style="padding: 20px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">Elena Rostova — Tactical & Simulation Analyst</h3>
          <p style="font-size: 13px; color: #a78bfa; margin-bottom: 8px;">Grand Strategy, Naval Combat & Competitive Mechanics</p>
          <p style="font-size: 14px; color: #cbd5e1;">Specializes in ballistics calculations, armor models, and real-time competitive balance.</p>
        </div>
      </div>
    </section>

    <section style="margin-bottom: 36px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 16px;">
        PC Hardware Testing Lab Specifications
      </h2>
      <p style="font-size: 15px; color: #cbd5e1; margin-bottom: 14px;">
        To deliver reproducible performance benchmarks and 1% low frame time metrics, all PC evaluations are performed on standardized in-house hardware test benches:
      </p>
      <ul style="padding-left: 20px; font-size: 14px; color: #94a3b8; line-height: 1.8;">
        <li><strong>Primary Test Bench:</strong> AMD Ryzen 9 7950X3D (16 cores/32 threads, 3D V-Cache enabled)</li>
        <li><strong>Primary GPU:</strong> NVIDIA GeForce RTX 4090 (24GB GDDR6X)</li>
        <li><strong>Secondary GPU:</strong> AMD Radeon RX 7900 XTX (24GB GDDR6)</li>
        <li><strong>Memory:</strong> 64GB G.Skill Trident Z5 Neo DDR5-6000 CL30</li>
        <li><strong>Storage:</strong> 4TB Samsung 990 Pro PCIe 4.0 NVMe SSD</li>
        <li><strong>Display & Telemetry:</strong> 32-inch 4K 240Hz OLED with CapFrameX frame-time logging</li>
      </ul>
    </section>

    <section style="margin-bottom: 36px;">
      <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 16px;">
        Fact-Checking & 24-Hour Correction Policy
      </h2>
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.7;">
        Factual accuracy is our paramount standard. If an error in frame rates, mechanical details, historical naval armor models, or game story lore is identified by readers or staff, we investigate and publish public corrections within 24 hours of confirmation. Submit correction notices to <a href="mailto:contact@gamevault.forum" style="color: #38bdf8;">contact@gamevault.forum</a>.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml, jsonLd };
}

function renderContactPage(): PrerenderResult {
  const title = 'Contact Game Vault Forum | Editorial, Advertising & Support Desk';
  const description = 'Official contact details for Game Vault Forum. Inquiries for editorial pitches, Google AdSense advertising, technical corrections, and community support.';
  const canonicalUrl = 'https://www.gamevault.forum/contact';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Game Vault Forum',
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'Game Vault Forum',
      email: 'contact@gamevault.forum',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@gamevault.forum',
        contactType: 'editorial support',
        availableLanguage: ['English']
      }
    }
  };

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 38px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Contact Game Vault Forum
    </h1>
    <p style="font-size: 16px; color: #94a3b8; margin-bottom: 32px;">
      We welcome inquiries from readers, independent developers, hardware manufacturers, and commercial partners.
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Editorial Desk & News Tips</h2>
        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 12px;">Submit article pitches, game press releases, or factual corrections directly to our editorial team.</p>
        <p style="font-size: 14px; font-weight: 600; color: #38bdf8;">Email: <a href="mailto:contact@gamevault.forum" style="color: #38bdf8;">contact@gamevault.forum</a></p>
      </div>

      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Founder & Lead Publisher</h2>
        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 12px;">Direct correspondence with founder Joel Ayuba regarding partnerships, interviews, or high-priority inquiries.</p>
        <p style="font-size: 14px; font-weight: 600; color: #c084fc;">Email: <a href="mailto:joelotis40@gmail.com" style="color: #c084fc;">joelotis40@gmail.com</a></p>
      </div>
    </div>

    <section style="padding: 28px; background: #0f1220; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; margin-bottom: 40px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Advertising & Google AdSense Publisher Information</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 12px;">
        Game Vault Forum is a verified Google AdSense digital publisher (<strong>Publisher ID: ca-pub-6121667798720008</strong>). Our digital seller authorization is maintained strictly via our root <code>/ads.txt</code> record:
      </p>
      <div style="padding: 12px 16px; background: #06070a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-family: monospace; font-size: 13px; color: #4ade80; margin-bottom: 14px;">
        google.com, pub-6121667798720008, DIRECT, f08c47fec0942fa0
      </div>
      <p style="font-size: 13px; color: #94a3b8;">
        For direct programmatic deals or custom sponsorship integrations, email <a href="mailto:contact@gamevault.forum" style="color: #38bdf8;">contact@gamevault.forum</a> with subject line "Sponsorship Inquiry".
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml, jsonLd };
}

function renderPrivacyPage(): PrerenderResult {
  const title = 'Privacy Policy | Game Vault Forum — Google AdSense & Data Protection Standards';
  const description = 'Official Privacy Policy of Game Vault Forum. Detailed disclosures on Google AdSense, DoubleClick DART cookies, third-party advertising partners, GDPR, and CCPA rights.';
  const canonicalUrl = 'https://www.gamevault.forum/privacy';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Game Vault Privacy Policy
    </h1>
    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; font-family: monospace;">
      Last Updated: September 28, 2026 • Policy Status: Active &amp; AdSense Compliant • Publisher: Joel Ayuba
    </div>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px; line-height: 1.7;">
      At Game Vault Forum (accessible from <strong>https://www.gamevault.forum</strong>), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of personal information that is received and collected by Game Vault Forum and how it is used, including mandatory disclosures concerning third-party advertising partners such as Google AdSense.
    </p>

    <section style="margin-bottom: 36px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 14px;">
        1. Google AdSense &amp; Third-Party Advertising Disclosures (Required by Google Policy)
      </h2>
      <p style="font-size: 15px; color: #cbd5e1; margin-bottom: 14px;">
        We may display advertisements served by Google AdSense and third-party advertising vendors on Game Vault Forum to support our independent gaming coverage and community infrastructure:
      </p>
      <ul style="padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.8; margin-bottom: 16px;">
        <li><strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
        <li><strong>Advertising Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Game Vault Forum and/or other sites on the Internet.</li>
        <li><strong>DoubleClick DART Cookie:</strong> Google may use the DoubleClick DART cookie or newer privacy-preserving ad tokens to serve personalized ads according to user interests and general geographic region.</li>
      </ul>
      <h3 style="font-size: 16px; font-weight: 700; color: #38bdf8; margin-bottom: 10px;">
        How Users Can Opt Out of Personalized Advertising
      </h3>
      <p style="font-size: 14px; color: #94a3b8; margin-bottom: 12px;">
        Users may opt out of personalized advertising at any time through the following official controls:
      </p>
      <ul style="padding-left: 20px; font-size: 14px; color: #38bdf8; line-height: 1.8;">
        <li><a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" style="color: #38bdf8;">Google Ads Settings (Ads Preference Manager)</a></li>
        <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color: #38bdf8;">AboutAds.info Opt-Out Portal</a></li>
        <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" style="color: #38bdf8;">Network Advertising Initiative (NAI)</a></li>
        <li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style="color: #38bdf8;">Your Online Choices (EDAA for EU/EEA)</a></li>
      </ul>
    </section>

    <section style="margin-bottom: 36px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 14px;">
        2. Information We Collect
      </h2>
      <p style="font-size: 15px; color: #cbd5e1; margin-bottom: 14px;">
        We collect user-provided account details (display name, username, email address), public forum contributions, and standard server log files (IP addresses, browser type, ISP, referring pages, timestamps).
      </p>
    </section>

    <section style="margin-bottom: 36px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 14px;">
        3. California Privacy Rights (CCPA / CPRA) &amp; GDPR Rights
      </h2>
      <p style="font-size: 15px; color: #cbd5e1; line-height: 1.8;">
        Under California Consumer Privacy Act and European General Data Protection Regulation, users have the right to request disclosure, rectification, or deletion of personal data. We do not sell personal information. For requests, email <a href="mailto:contact@gamevault.forum" style="color: #38bdf8;">contact@gamevault.forum</a>.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderTermsPage(): PrerenderResult {
  const title = 'Terms of Service | Game Vault Forum';
  const description = 'Terms of Service and User Agreement governing participation, content submissions, and interactive tools at Game Vault Forum.';
  const canonicalUrl = 'https://www.gamevault.forum/terms';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Terms of Service
    </h1>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 24px;">
      By accessing or participating in Game Vault Forum (https://www.gamevault.forum), you agree to be bound by these Terms of Service.
    </p>
    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">1. Intellectual Property &amp; Content Licensing</h2>
      <p style="font-size: 14px; color: #cbd5e1;">All editorial articles, guides, reviews, and interactive tool source code are the intellectual property of Game Vault Forum and founder Joel Ayuba. Video game trademarks and imagery belong to their respective publishers under fair-use commentary.</p>
    </section>
    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">2. User Conduct &amp; Forum Rules</h2>
      <p style="font-size: 14px; color: #cbd5e1;">Users agree to engage in civil discourse. Harassment, unauthorized commercial advertising, spamming, and distribution of malicious code are strictly prohibited and result in permanent ban.</p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderCookiePolicyPage(): PrerenderResult {
  const title = 'Cookie Policy | Game Vault Forum — AdSense, Analytics & Preferences';
  const description = 'Overview of cookies utilized on Game Vault Forum, including essential authentication tokens, Google AdSense advertising cookies, and how to manage preferences.';
  const canonicalUrl = 'https://www.gamevault.forum/cookies';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Cookie Policy
    </h1>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 24px;">
      This Cookie Policy explains how Game Vault Forum uses cookies and similar tracking technologies when you visit our website.
    </p>
    <section style="margin-bottom: 24px; padding: 20px; background: #0e1122; border-radius: 12px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Essential Cookies</h2>
      <p style="font-size: 14px; color: #cbd5e1;">Necessary for user authentication via Firebase Auth and theme preference persistence.</p>
    </section>
    <section style="margin-bottom: 24px; padding: 20px; background: #0e1122; border-radius: 12px;">
      <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Advertising &amp; Analytics Cookies (Google AdSense)</h2>
      <p style="font-size: 14px; color: #cbd5e1;">Google AdSense cookies enable personalized and contextual advertising. Manage your ad settings at <a href="https://adssettings.google.com" style="color: #38bdf8;">Google Ads Settings</a>.</p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderGuidelinesPage(): PrerenderResult {
  const title = 'Community & Editorial Guidelines | Game Vault Forum';
  const description = 'Editorial integrity standards, review scoring principles, fact-checking policies, and community discussion rules for Game Vault Forum.';
  const canonicalUrl = 'https://www.gamevault.forum/guidelines';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Community &amp; Editorial Guidelines
    </h1>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 28px;">
      Game Vault Forum is built on high editorial standards and respectful, thoughtful discourse among passionate gamers.
    </p>
    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 10px;">1. Review Scoring Independence</h2>
      <p style="font-size: 15px; color: #cbd5e1;">We maintain absolute separation between advertising and review scoring. Scores are never previewed or negotiated with publishers.</p>
    </section>
    <section style="margin-bottom: 28px;">
      <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 10px;">2. Civil Community Discourse</h2>
      <p style="font-size: 15px; color: #cbd5e1;">Debate games and hardware passionately, but treat other members with respect. Zero tolerance for hate speech or harassment.</p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderHtmlSitemapPage(): PrerenderResult {
  const title = 'HTML Sitemap & Complete Content Index | Game Vault Forum';
  const description = 'Complete directory of all gaming articles, scored reviews, tactical guides, interactive PC tools, and community discussions on Game Vault Forum.';
  const canonicalUrl = 'https://www.gamevault.forum/sitemap';

  const articlesLinks = MOCK_ARTICLES.map(
    (a) => `<li><a href="/articles/${getSeoSlug(a)}" style="color: #c4b5fd;">${escapeHtml(a.title)}</a></li>`
  ).join('');

  const reviewsLinks = MOCK_REVIEWS.map(
    (r) => `<li><a href="/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}" style="color: #c4b5fd;">${escapeHtml(r.gameTitle)} Review (${r.score}/10)</a></li>`
  ).join('');

  const guidesLinks = MOCK_GUIDES.map(
    (g) => `<li><a href="/guides/${getSeoSlug(g)}" style="color: #c4b5fd;">${escapeHtml(g.title)}</a></li>`
  ).join('');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Game Vault Forum — Complete Site Index
    </h1>
    <p style="font-size: 16px; color: #94a3b8; margin-bottom: 32px;">
      Direct index to every published piece of gaming journalism, guide, review, and interactive tool across our network.
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #38bdf8; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Long-Form Articles</h2>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">${articlesLinks}</ul>

        <h2 style="font-size: 20px; font-weight: 700; color: #38bdf8; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-top: 32px;">Scored Game Reviews</h2>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">${reviewsLinks}</ul>
      </div>

      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #a78bfa; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Tactical Guides</h2>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">${guidesLinks}</ul>

        <h2 style="font-size: 20px; font-weight: 700; color: #a78bfa; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-top: 32px;">Interactive Gaming Tools</h2>
        <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
          <li><a href="/tools/game-story-overview-generator" style="color: #c4b5fd;">Game Story &amp; Overview Generator</a></li>
          <li><a href="/tools/game-release-calendar" style="color: #c4b5fd;">2025/2026 Game Release Radar</a></li>
          <li><a href="/tools/fps-calculator" style="color: #c4b5fd;">Real-World FPS &amp; Bottleneck Calculator</a></li>
          <li><a href="/tools/pc-game-requirements-checker" style="color: #c4b5fd;">PC Game Requirements Analyzer</a></li>
          <li><a href="/tools/pc-builder" style="color: #c4b5fd;">Custom PC Part Picker &amp; Builder</a></li>
          <li><a href="/tools/gaming-username-generator" style="color: #c4b5fd;">Gaming Username Generator</a></li>
          <li><a href="/tools/avatar-generator" style="color: #c4b5fd;">Gamerpic &amp; Avatar Creator</a></li>
          <li><a href="/tools/vault-ai" style="color: #c4b5fd;">Vault AI Gaming Copilot</a></li>
          <li><a href="/game-picker-wheel" style="color: #c4b5fd;">Random Game Decision Wheel</a></li>
        </ul>
      </div>
    </div>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

// ----------------------------------------------------------------------------
// INTERACTIVE TOOLS PAGES
// ----------------------------------------------------------------------------

function renderToolsHubPage(): PrerenderResult {
  const title = 'Free Gaming Tools, Calculators & System Analyzers | Game Vault Forum';
  const description = 'Suite of high-performance gaming utilities: Factual Game Story Generator, 2025/2026 Release Radar, FPS Bottleneck Calculator, PC Requirements Checker, and Custom PC Builder.';
  const canonicalUrl = 'https://www.gamevault.forum/tools';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 38px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 12px;">
      Free Interactive Gaming Tools &amp; Hardware Calculators
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 40px; max-width: 850px; line-height: 1.6;">
      Engineered by Joel Ayuba and the Game Vault Forum engineering team to solve real gaming dilemmas. No paywalls, no software installs, completely free.
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          <a href="/tools/game-story-overview-generator" style="color: #38bdf8; text-decoration: none;">Game Story &amp; Overview Generator</a>
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">Search authoritative lore to generate factual overviews, customizable word counts (200 to 3,500 words), spoiler filters, character dossiers, and downloadable PDF reports.</p>
        <a href="/tools/game-story-overview-generator" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">Launch Story Generator &rarr;</a>
      </div>

      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          <a href="/tools/game-release-calendar" style="color: #38bdf8; text-decoration: none;">2025/2026 Game Release Radar</a>
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">Verified calendar of confirmed AAA and indie releases, platform filters, delay trackers, and custom watchlist reminders across all systems.</p>
        <a href="/tools/game-release-calendar" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">View Release Radar &rarr;</a>
      </div>

      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          <a href="/tools/fps-calculator" style="color: #38bdf8; text-decoration: none;">Real-World FPS &amp; Bottleneck Calculator</a>
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">Empirical frame rate predictions across 1080p, 1440p, and 4K resolutions with ray tracing toggles, DLSS/FSR scaling, and CPU/GPU bottleneck percentages.</p>
        <a href="/tools/fps-calculator" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">Calculate FPS &rarr;</a>
      </div>

      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          <a href="/tools/pc-game-requirements-checker" style="color: #38bdf8; text-decoration: none;">PC Game Requirements Analyzer</a>
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">Verify official minimum and recommended system requirements for over 500 PC games against your actual hardware specifications.</p>
        <a href="/tools/pc-game-requirements-checker" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">Check PC Specs &rarr;</a>
      </div>

      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          <a href="/tools/pc-builder" style="color: #38bdf8; text-decoration: none;">Custom PC Part Picker &amp; Builder</a>
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">Component compatibility verification across AM4, AM5, LGA1700 sockets, power supply wattage calculator, and budget optimization.</p>
        <a href="/tools/pc-builder" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">Start PC Build &rarr;</a>
      </div>

      <div style="padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
          <a href="/game-picker-wheel" style="color: #38bdf8; text-decoration: none;">Random Game Decision Wheel</a>
        </h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">Overcome backlog analysis paralysis. Spin our physics-driven wheel with customizable game lists and mood filters.</p>
        <a href="/game-picker-wheel" style="font-size: 13px; font-weight: 700; color: #c4b5fd; text-decoration: none;">Spin Wheel &rarr;</a>
      </div>
    </div>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderGameStoryGeneratorToolPage(): PrerenderResult {
  const title = 'Game Story & Overview Generator | Factual Game Lore & Summaries | Game Vault Forum';
  const description = 'Generate factually verified game stories and overviews matching real online canon lore. Granular word count targets (200-3,500 words), spoiler filters, and PDF dossier export.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/game-story-overview-generator';

  const verifiedGamesSample = VERIFIED_GAME_DATABASE.slice(0, 8).map(
    (g) => `<li style="margin-bottom: 6px;"><strong>${escapeHtml(g.title)}</strong> (${g.releaseYear}) — Developer: ${escapeHtml(g.developer)}</li>`
  ).join('');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Factual Game Story &amp; Overview Generator
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      An authoritative narrative research tool that delivers strictly verified game story summaries, setting analyses, character dynamics, and historical lore matching authentic online canon without hallucinated details.
    </p>

    <section style="margin-bottom: 32px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">Core Technical Capabilities</h2>
      <ul style="padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.8;">
        <li><strong>Granular Word Count Control:</strong> Choose your exact reading depth from Quick Brief (~350 words), Standard Synopsis (~850 words), to Deep Narrative Lore (~1,800+ words).</li>
        <li><strong>Strict Accuracy &amp; Verification Pipeline:</strong> Every narrative is cross-referenced with developer records, canonical dialogue scripts, and official databases.</li>
        <li><strong>Spoiler-Control Protocol:</strong> Choose between No Spoilers (premise &amp; setting), Light Spoilers (early acts), Full Narrative (entire plot arc), or Ending Explained.</li>
        <li><strong>Printable PDF Export:</strong> Download comprehensive narrative dossiers formatted for offline research and documentation.</li>
      </ul>
    </section>

    <section style="margin-bottom: 32px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Sample Indexed Masterpieces</h2>
      <ul style="padding-left: 20px; font-size: 14px; color: #cbd5e1;">${verifiedGamesSample}</ul>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderReleaseCalendarToolPage(): PrerenderResult {
  const title = '2025/2026 Video Game Release Radar & Calendar | Game Vault Forum';
  const description = 'Authoritative schedule of upcoming video game releases across PC, PlayStation 5, Xbox Series X, and Nintendo Switch with confirmation status and system specs.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/game-release-calendar';

  const upcomingSample = GAME_RELEASES_DATABASE.slice(0, 10).map(
    (r) => `<li style="margin-bottom: 8px;"><strong>${escapeHtml(r.title)}</strong> — ${escapeHtml(r.releaseDateDisplay || r.releaseDate)} (${escapeHtml(r.platforms.join(', '))}) [Status: ${escapeHtml(r.status)}]</li>`
  ).join('');

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      2025/2026 Video Game Release Radar
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Stay ahead of every major video game launch with our audited release radar. We track developer announcements, delay confirmations, platform ports, and early access timelines.
    </p>

    <section style="margin-bottom: 32px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">Upcoming Confirmed Launches</h2>
      <ul style="padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.8;">${upcomingSample}</ul>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderFpsCalculatorToolPage(): PrerenderResult {
  const title = 'Real-World FPS & Bottleneck Calculator | Game Vault Forum';
  const description = 'Empirical gaming frame-rate predictor across 1080p, 1440p, and 4K resolutions with ray tracing toggles, DLSS/FSR scaling, and CPU/GPU bottleneck analysis.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/fps-calculator';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Real-World FPS &amp; Bottleneck Performance Calculator
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Calculate empirical frame rates, 1% low pacing, and hardware utilization percentages for your exact CPU, GPU, resolution, and graphic preset configurations.
    </p>

    <section style="margin-bottom: 32px; padding: 24px; background: #0e1122; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #38bdf8; margin-bottom: 12px;">Calculation Methodology</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">
        Unlike synthetic formulas that use arbitrary multipliers, our calculation engine calibrates empirical benchmark logs from over 200 real-world game passes. Scaling vectors account for shader core counts, architectural IPC generational uplift, VRAM bandwidth bottlenecks, and ray-tracing BVH traversal overhead.
      </p>
    </section>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderPcRequirementsToolPage(): PrerenderResult {
  const title = 'PC Game System Requirements Checker — Can You Run It? | Game Vault Forum';
  const description = 'Verify whether your computer meets minimum and recommended hardware specifications for hundreds of PC games with component upgrade recommendations.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/pc-game-requirements-checker';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      PC Game System Requirements Checker
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Compare your CPU, graphics card, RAM, and storage against verified publisher minimum and recommended system requirements.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderPcBuilderToolPage(): PrerenderResult {
  const title = 'Custom PC Part Picker & Compatibility Builder | Game Vault Forum';
  const description = 'Plan your next gaming PC build with 10-point socket compatibility (AM4, AM5, LGA1700), PSU wattage calculation, and dual USD/NGN pricing.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/pc-builder';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Custom PC Part Picker &amp; Builder
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Build your custom gaming rig with automated motherboard socket verification, RAM clearance checks, and power supply wattage calculations.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderUsernameGeneratorToolPage(): PrerenderResult {
  const title = 'Gaming Username & Gamertag Generator | Game Vault Forum';
  const description = 'Generate unique gaming tags and online handles across Cyberpunk, Tactical, Mythic, Anime, and Esports categories.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/gaming-username-generator';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Gaming Username &amp; Gamertag Generator
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Create distinctive, memorable usernames for Steam, PlayStation Network, Xbox Live, Discord, and competitive esports platforms.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderAvatarGeneratorToolPage(): PrerenderResult {
  const title = 'Custom Gaming Avatar & Gamerpic Creator | Game Vault Forum';
  const description = 'Design high-resolution custom gaming avatars with cyberpunk, pixel art, tactical military, and dark fantasy filters for your online profile.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/avatar-generator';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Custom Gaming Avatar &amp; Gamerpic Creator
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Generate custom digital avatars with stylized gaming aesthetics for your forum profile or streaming channels.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderVaultAiToolPage(): PrerenderResult {
  const title = 'Vault AI — Intelligent Gaming Copilot & Hardware Advisor | Game Vault Forum';
  const description = 'Conversational AI assistant trained on Game Vault Forum testing databases for PC hardware troubleshooting, low-FPS diagnostics, and game discovery.';
  const canonicalUrl = 'https://www.gamevault.forum/tools/vault-ai';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Vault AI — Intelligent Gaming Copilot
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Ask technical questions about GPU bottlenecks, optimal graphical settings, game lore connections, and component upgrade paths.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderGamePickerWheelToolPage(): PrerenderResult {
  const title = 'Random Game Decision Wheel | Overcome Backlog Paralysis | Game Vault Forum';
  const description = 'Physics-driven random game picker wheel. Filter by mood, playtime, genre, and platform to decide what video game to play next.';
  const canonicalUrl = 'https://www.gamevault.forum/game-picker-wheel';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Random Game Decision Wheel
    </h1>
    <p style="font-size: 17px; color: #cbd5e1; margin-bottom: 32px;">
      Overcome backlog analysis paralysis. Spin the wheel to pick your next gaming adventure based on genre, mood, and platform.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

// ----------------------------------------------------------------------------
// MEDIA, REPOSITORIES & AUTHORS
// ----------------------------------------------------------------------------

function renderAuthorPage(slug: string): PrerenderResult {
  const authorName = slug.includes('marcus')
    ? 'Marcus Vance'
    : slug.includes('elena')
    ? 'Elena Rostova'
    : slug.includes('david')
    ? 'David K.'
    : 'Joel Ayuba';

  const title = `${authorName} — Editorial Profile & Published Works | Game Vault Forum`;
  const description = `Author biography, technical credentials, and published gaming journalism by ${authorName} at Game Vault Forum.`;
  const canonicalUrl = `https://www.gamevault.forum/authors/${slug}`;

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 8px;">
      ${escapeHtml(authorName)}
    </h1>
    <p style="color: #a78bfa; font-weight: 600; font-size: 16px; margin-bottom: 24px;">
      ${authorName === 'Joel Ayuba' ? 'Founder & Lead Technical Publisher' : 'Senior Contributing Editor'} — Game Vault Forum
    </p>
    <p style="font-size: 16px; color: #cbd5e1; line-height: 1.7; margin-bottom: 32px;">
      ${authorName === 'Joel Ayuba'
        ? 'Joel Ayuba is the founder of Game Vault Forum and video producer for @GameVaultForum on YouTube. He specializes in deep-dive game mechanics, PC hardware benchmarking, frame-time latency analysis, and tactical naval combat.'
        : `${authorName} is an experienced gaming analyst contributing in-depth reviews, tactical guides, and mechanical dissections to Game Vault Forum.`}
    </p>
    <h2 style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
      Published Works &amp; Key Articles
    </h2>
    <ul style="padding-left: 20px; font-size: 15px; color: #c4b5fd; line-height: 2;">
      <li><a href="/articles/why-some-games-keep-us-playing-for-years" style="color: #c4b5fd;">Why Some Games Keep Us Playing for Years</a></li>
      <li><a href="/articles/the-psychology-of-strategic-gaming-how-tactical-games-rewire-your-brain" style="color: #c4b5fd;">The Psychology of Strategic Gaming: How Tactical Games Rewire Your Brain</a></li>
      <li><a href="/articles/why-world-of-warships-is-more-interesting-than-i-expected" style="color: #c4b5fd;">Why World of Warships Is More Interesting Than I Expected</a></li>
      <li><a href="/reviews/elden-ring-shadow-of-the-erdtree-review" style="color: #c4b5fd;">Elden Ring: Shadow of the Erdtree Scored Review</a></li>
    </ul>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderVideoPage(video: any): PrerenderResult {
  const title = `${video.title} — Gameplay Analysis & Video | Game Vault Forum`;
  const description = video.shortDescription || video.description;
  const canonicalUrl = `https://www.gamevault.forum/videos/${getSeoSlug(video)}`;
  const rawImage = video.thumbnail || 'https://www.gamevault.forum/favicon.png';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 34px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      ${escapeHtml(video.title)}
    </h1>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 24px;">${escapeHtml(video.description)}</p>
    <div style="padding: 24px; background: #0e1122; border-radius: 16px; margin-bottom: 32px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">Watch on YouTube — @GameVaultForum</h2>
      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">Experience the full 4K gameplay analysis, boss breakdowns, and tactical demonstrations:</p>
      <a href="${video.youtubeUrl || 'https://www.youtube.com/@GameVaultForum'}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background: #ef4444; color: #ffffff; font-weight: 700; border-radius: 8px; text-decoration: none;">Watch on YouTube &rarr;</a>
    </div>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, imageUrl: rawImage, bodyHtml };
}

function renderVideosArchivePage(): PrerenderResult {
  const title = 'Gameplay Videos & Deep Dives — @GameVaultForum | Game Vault Forum';
  const description = '4K gameplay breakdowns, mechanical tutorials, boss fights, and tactical retrospective showcases from the official Game Vault Forum YouTube channel.';
  const canonicalUrl = 'https://www.gamevault.forum/videos';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Official Video Productions — @GameVaultForum
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 32px;">
      Watch in-depth gameplay sessions, mechanical tutorials, and 4K performance breakdowns produced by Joel Ayuba on the official Game Vault YouTube channel.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderGamePage(game: any): PrerenderResult {
  const title = `${game.title} — Game Details, System Requirements & Lore | Game Vault Forum`;
  const description = game.shortDescription || `Detailed overview for ${game.title} (${game.releaseYear}), developed by ${game.developer}. Genres: ${game.genre}, Platforms: ${game.platforms?.join(', ')}.`;
  const canonicalUrl = `https://www.gamevault.forum/games/${getSeoSlug(game)}`;

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      ${escapeHtml(game.title)}
    </h1>
    <p style="font-size: 14px; color: #38bdf8; font-weight: 600; margin-bottom: 24px;">
      Developer: ${escapeHtml(game.developer)} • Release: ${escapeHtml(game.releaseYear)} • Platforms: ${escapeHtml(game.platforms?.join(', ') || 'PC')}
    </p>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px;">${escapeHtml(game.fullDescription || game.shortDescription)}</p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderGamesArchivePage(): PrerenderResult {
  const title = 'Video Games Directory & Index | Game Vault Forum';
  const description = 'Explore the complete directory of featured action RPGs, tactical simulators, and competitive shooters on Game Vault Forum.';
  const canonicalUrl = 'https://www.gamevault.forum/games';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Video Games Directory
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 32px;">
      Discover comprehensive game profiles, official release details, system requirements, and related community analyses.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderForumHubPage(): PrerenderResult {
  const title = 'Gaming Community Forum & Discussions | Game Vault Forum';
  const description = 'Join civil gaming discussions on PC hardware optimization, tactical gameplay mechanics, RPG builds, and new releases at Game Vault Forum.';
  const canonicalUrl = 'https://www.gamevault.forum/forum';

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1100px; margin: 0 auto; padding: 40px 24px; font-family: 'Inter', sans-serif;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Game Vault Community Forum
    </h1>
    <p style="font-size: 17px; color: #94a3b8; margin-bottom: 32px;">
      Civil discussions on PC hardware, tactical builds, and gaming culture.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

function renderPlayGamesPage(cleanPath: string): PrerenderResult {
  const title = 'Play Free Classic Browser Games | Game Vault Forum';
  const description = 'Play classic retro arcade games directly in your browser: Space Invaders, Neon Snake, Brick Breaker, Tactical Chess, and Naval Command on Game Vault Forum.';
  const canonicalUrl = `https://www.gamevault.forum${cleanPath}`;

  const bodyHtml = `
  ${renderGlobalHeader()}
  <main style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.8; color: #f1f5f9;">
    <h1 style="font-size: 36px; font-weight: 800; color: #ffffff; font-family: 'Space Grotesk', sans-serif; margin-bottom: 16px;">
      Classic Browser Games Arcade
    </h1>
    <p style="font-size: 16px; color: #cbd5e1; margin-bottom: 32px;">
      Play authentic recreations of timeless arcade, puzzle, and tactical strategy games with local high scores and zero ads.
    </p>
  </main>
  ${renderGlobalFooter()}
  `;

  return { title, description, canonicalUrl, bodyHtml };
}

// ----------------------------------------------------------------------------
// UNIVERSAL SEMANTIC HEADER & FOOTER
// ----------------------------------------------------------------------------

function renderGlobalHeader(): string {
  return `
  <header style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); background-color: #090a0f; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <a href="/" style="font-size: 24px; font-weight: 800; color: #ffffff; text-decoration: none; font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 1px;">
          Game Vault Forum
        </a>
        <div style="font-size: 11px; color: #a78bfa; margin-top: 2px;">Verified Gaming Journal • Google Publisher ca-pub-6121667798720008</div>
      </div>
      <nav aria-label="Main Navigation" style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 14px; font-weight: 600;">
        <a href="/" style="color: #ffffff; text-decoration: none;">Home</a>
        <a href="/articles" style="color: #cbd5e1; text-decoration: none;">Articles</a>
        <a href="/reviews" style="color: #cbd5e1; text-decoration: none;">Reviews</a>
        <a href="/guides" style="color: #cbd5e1; text-decoration: none;">Guides</a>
        <a href="/tools" style="color: #cbd5e1; text-decoration: none;">Gaming Tools</a>
        <a href="/videos" style="color: #cbd5e1; text-decoration: none;">Videos</a>
        <a href="/games" style="color: #cbd5e1; text-decoration: none;">Games</a>
        <a href="/forum" style="color: #cbd5e1; text-decoration: none;">Forum</a>
        <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
        <a href="/contact" style="color: #cbd5e1; text-decoration: none;">Contact</a>
      </nav>
    </div>
  </header>`;
}

function renderGlobalFooter(): string {
  return `
  <footer style="padding: 32px 24px; border-top: 1px solid rgba(255,255,255,0.1); background: #06070a; max-width: 1200px; margin: 40px auto 0 auto; font-size: 13px; color: #64748b; font-family: 'Inter', sans-serif;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <p style="margin: 0;">&copy; 2026 Game Vault Forum • Founded &amp; Operated by Joel Ayuba. Publisher ID: ca-pub-6121667798720008. All rights reserved.</p>
      <div style="display: flex; flex-wrap: wrap; gap: 14px;">
        <a href="/about" style="color: #94a3b8; text-decoration: none;">About Us</a>
        <a href="/contact" style="color: #94a3b8; text-decoration: none;">Contact Us</a>
        <a href="/guidelines" style="color: #94a3b8; text-decoration: none;">Guidelines</a>
        <a href="/privacy" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a>
        <a href="/terms" style="color: #94a3b8; text-decoration: none;">Terms of Service</a>
        <a href="/cookies" style="color: #94a3b8; text-decoration: none;">Cookie Policy</a>
        <a href="/sitemap" style="color: #94a3b8; text-decoration: none;">Sitemap</a>
        <a href="/sitemap.xml" style="color: #94a3b8; text-decoration: none;">XML Sitemap</a>
        <a href="/ads.txt" style="color: #94a3b8; text-decoration: none;">ads.txt</a>
        <a href="/robots.txt" style="color: #94a3b8; text-decoration: none;">robots.txt</a>
      </div>
    </div>
  </footer>`;
}

// ----------------------------------------------------------------------------
// DOCUMENT BUILDER & HELPERS
// ----------------------------------------------------------------------------

function renderHtmlDocument(baseHtml: string, res: PrerenderResult): string {
  let html = baseHtml;

  // Title & Descriptions
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(res.title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(res.description)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${res.canonicalUrl}" />`);

  // Open Graph
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(res.title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(res.description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${res.canonicalUrl}" />`);
  html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="${res.ogType || 'website'}" />`);

  // Twitter Cards
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(res.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(res.description)}" />`);

  // Images
  if (res.imageUrl) {
    html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${res.imageUrl}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${res.imageUrl}" />`);
  }

  // Schema.org JSON-LD injection
  if (res.jsonLd) {
    const jsonLdTag = `\n    <script type="application/ld+json">\n${JSON.stringify(res.jsonLd, null, 2)}\n    </script>\n`;
    html = html.replace('</head>', `${jsonLdTag}  </head>`);
  }

  // CRITICAL: Replace the inner content of <div id="root">...</div> with the page's semantic HTML
  const rootRegex = /<div id="root">[\s\S]*?<\/div>(\s*<script type="module")/;
  if (rootRegex.test(html)) {
    html = html.replace(rootRegex, `<div id="root">${res.bodyHtml}</div>$1`);
  } else {
    html = html.replace('<div id="root"></div>', `<div id="root">${res.bodyHtml}</div>`);
  }

  return html;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderMarkdownToHtml(md: string): string {
  if (!md) return '';
  const lines = md.split('\n');
  let output = '';
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) { output += '</ul>\n'; inList = false; }
      continue;
    }

    if (trimmed.startsWith(':::')) {
      if (inList) { output += '</ul>\n'; inList = false; }
      continue; // Skip container markers
    }

    if (trimmed.startsWith('### ')) {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 24px; margin-bottom: 12px; font-family: 'Space Grotesk', sans-serif;">${escapeHtml(trimmed.slice(4))}</h3>\n`;
    } else if (trimmed.startsWith('## ')) {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; font-family: 'Space Grotesk', sans-serif;">${escapeHtml(trimmed.slice(3))}</h2>\n`;
    } else if (trimmed.startsWith('# ')) {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<h2 style="font-size: 26px; font-weight: 800; color: #ffffff; margin-top: 32px; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif;">${escapeHtml(trimmed.slice(2))}</h2>\n`;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (!inList) {
        output += '<ul style="margin-bottom: 20px; padding-left: 24px; line-height: 1.8;">\n';
        inList = true;
      }
      output += `  <li>${formatInline(trimmed.slice(2))}</li>\n`;
    } else {
      if (inList) { output += '</ul>\n'; inList = false; }
      output += `<p style="margin-bottom: 18px; line-height: 1.8;">${formatInline(trimmed)}</p>\n`;
    }
  }

  if (inList) output += '</ul>\n';
  return output;
}

function formatInline(text: string): string {
  let res = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #c4b5fd; text-decoration: underline;">$1</a>');
  return res;
}
