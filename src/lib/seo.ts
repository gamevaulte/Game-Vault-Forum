/**
 * SEO & URL Slug Optimization Utilities for Game Vault Forum
 */

/**
 * Converts a text title into an SEO-friendly URL slug:
 * - Converts to lowercase
 * - Replaces ampersands, colons, em-dashes, and special characters with clean hyphens
 * - Removes accents and non-alphanumeric characters
 * - Collapses consecutive hyphens
 * - Trims leading and trailing hyphens
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .normalize('NFD') // normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-') // replace & with and
    .replace(/['’"]/g, '') // drop quotes and apostrophes
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '') // remove leading/trailing hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}

/**
 * Generates an SEO-optimized slug for an item based on its title or game title
 */
export function getSeoSlug(item: { id: string; title?: string; gameTitle?: string; name?: string; slug?: string }): string {
  if (item.slug) return item.slug;
  const rawTitle = item.title || item.gameTitle || item.name || item.id;
  const slug = slugify(rawTitle);
  return slug || item.id;
}

/**
 * Helper to find an item by either its slug or its raw ID.
 * Ensures backwards-compatibility with old IDs while supporting rich SEO slugs.
 */
export function findItemBySlugOrId<T extends { id: string; title?: string; gameTitle?: string; name?: string }>(
  items: T[],
  identifier: string
): T | undefined {
  if (!identifier) return undefined;
  const cleanId = decodeURIComponent(identifier).trim().toLowerCase();

  // 1. Direct ID match (case-insensitive)
  const exactIdMatch = items.find((item) => item.id.toLowerCase() === cleanId);
  if (exactIdMatch) return exactIdMatch;

  // 2. Exact slug match
  const exactSlugMatch = items.find((item) => {
    const itemSlug = getSeoSlug(item);
    return itemSlug === cleanId;
  });
  if (exactSlugMatch) return exactSlugMatch;

  // 3. Slug contains ID or ends with ID (e.g. `topic-title-topic-1` or `art-wows`)
  const idEndingMatch = items.find((item) => {
    const itemId = item.id.toLowerCase();
    return cleanId.endsWith(`-${itemId}`) || cleanId.includes(itemId);
  });
  if (idEndingMatch) return idEndingMatch;

  // 4. Fuzzy slug matching (prefix or partial match)
  const partialSlugMatch = items.find((item) => {
    const itemSlug = getSeoSlug(item);
    return itemSlug.startsWith(cleanId) || cleanId.startsWith(itemSlug);
  });
  if (partialSlugMatch) return partialSlugMatch;

  return undefined;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PageSeoOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'video.other' | 'profile';
  imageUrl?: string;
  imageAlt?: string;
  breadcrumbs?: BreadcrumbItem[];
  schemaType?: 'Article' | 'TechArticle' | 'Review' | 'VideoObject' | 'DiscussionForumPosting' | 'WebPage';
  schemaData?: Record<string, any>;
  noIndex?: boolean;
}

export const CANONICAL_BASE_URL = 'https://www.gamevault.forum';

/**
 * Updates dynamic browser metadata and JSON-LD structured data for search engine crawlers and social cards
 */
export function updatePageSeo(meta: PageSeoOptions) {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  const siteSuffix = ' | Game Vault Forum';
  const fullTitle = meta.title.includes('Game Vault') ? meta.title : `${meta.title}${siteSuffix}`;
  document.title = fullTitle;

  // 2. Update Meta Description
  let descriptionTag = document.querySelector('meta[name="description"]');
  if (meta.description) {
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', meta.description);
  }

  // 3. Robots / Directives
  let robotsTag = document.querySelector('meta[name="robots"]');
  if (!robotsTag) {
    robotsTag = document.createElement('meta');
    robotsTag.setAttribute('name', 'robots');
    document.head.appendChild(robotsTag);
  }
  robotsTag.setAttribute(
    'content',
    meta.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // 4. Update Open Graph & Twitter Titles
  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  if (ogTitleTag) ogTitleTag.setAttribute('content', fullTitle);

  const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitleTag) twitterTitleTag.setAttribute('content', fullTitle);

  // 5. Update Open Graph & Twitter Descriptions
  if (meta.description) {
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) ogDescTag.setAttribute('content', meta.description);

    const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescTag) twitterDescTag.setAttribute('content', meta.description);
  }

  // 6. Update Open Graph Type
  const ogTypeTag = document.querySelector('meta[property="og:type"]');
  if (ogTypeTag && meta.ogType) {
    ogTypeTag.setAttribute('content', meta.ogType);
  }

  // 7. Update Images for Open Graph & Twitter
  const defaultImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=630&auto=format&fit=crop&q=80';
  const resolvedImage = meta.imageUrl || defaultImage;

  const ogImageTag = document.querySelector('meta[property="og:image"]');
  if (ogImageTag) ogImageTag.setAttribute('content', resolvedImage);

  const twitterImageTag = document.querySelector('meta[name="twitter:image"]');
  if (twitterImageTag) twitterImageTag.setAttribute('content', resolvedImage);

  // 8. Update Canonical Link & Open Graph URL (Ensures every single page has its own canonical URL)
  // Strips any www prefix, cleans double slashes, and formats root vs subpages properly
  const rawPath = meta.canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  let cleanPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.replace(/\/+$/, '');
  }
  const canonicalUrl = cleanPath === '/' ? `${CANONICAL_BASE_URL}/` : `${CANONICAL_BASE_URL}${cleanPath}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  let ogUrlTag = document.querySelector('meta[property="og:url"]');
  if (!ogUrlTag) {
    ogUrlTag = document.createElement('meta');
    ogUrlTag.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrlTag);
  }
  ogUrlTag.setAttribute('content', canonicalUrl);

  // 9. Structured Data (JSON-LD) injection for Google Search Console & Rich Snippets
  let schemaScript = document.getElementById('gv-dynamic-seo-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'gv-dynamic-seo-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const schemas: any[] = [];

  // BreadcrumbList Schema
  if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${CANONICAL_BASE_URL}/`
        },
        ...meta.breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 2,
          name: b.name,
          item: b.path.startsWith('http') ? b.path : `${CANONICAL_BASE_URL}${b.path.startsWith('/') ? b.path : `/${b.path}`}`
        }))
      ]
    });
  }

  // Content-specific schema
  if (meta.schemaType && meta.schemaData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': meta.schemaType,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      publisher: {
        '@type': 'Organization',
        name: 'Game Vault Forum',
        url: CANONICAL_BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: defaultImage
        }
      },
      ...meta.schemaData
    });
  }

  if (schemas.length > 0) {
    schemaScript.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
  } else {
    schemaScript.textContent = '';
  }
}
