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
export function getSeoSlug(item: { id: string; title?: string; gameTitle?: string; name?: string }): string {
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

/**
 * Updates dynamic browser metadata for optimal SEO & social sharing
 */
export function updatePageSeo(meta: {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'video.other';
  imageUrl?: string;
}) {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  const siteSuffix = ' | Game Vault Forum';
  const fullTitle = meta.title.includes('Game Vault') ? meta.title : `${meta.title}${siteSuffix}`;
  document.title = fullTitle;

  // 2. Update Meta Description
  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag && meta.description) {
    descriptionTag.setAttribute('content', meta.description);
  }

  // 3. Update Open Graph Title
  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  if (ogTitleTag) {
    ogTitleTag.setAttribute('content', fullTitle);
  }

  // 4. Update Open Graph Description
  const ogDescTag = document.querySelector('meta[property="og:description"]');
  if (ogDescTag && meta.description) {
    ogDescTag.setAttribute('content', meta.description);
  }

  // 5. Update Open Graph Type
  const ogTypeTag = document.querySelector('meta[property="og:type"]');
  if (ogTypeTag && meta.ogType) {
    ogTypeTag.setAttribute('content', meta.ogType);
  }

  // 6. Update Canonical Link & Open Graph URL
  if (meta.canonicalPath && typeof window !== 'undefined') {
    const canonicalUrl = `${window.location.origin}${meta.canonicalPath}`;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute('content', canonicalUrl);
    }
  }
}
