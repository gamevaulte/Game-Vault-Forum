import { useState, useEffect } from 'react';
import { slugify } from './seo';

export type Route =
  | { type: 'home' }
  | { type: 'videos' }
  | { type: 'video'; id: string; slug?: string }
  | { type: 'games' }
  | { type: 'game'; id: string; slug?: string }
  | { type: 'articles' }
  | { type: 'article'; id: string; slug?: string }
  | { type: 'reviews' }
  | { type: 'review'; id: string; slug?: string }
  | { type: 'guides' }
  | { type: 'guide'; id: string; slug?: string }
  | { type: 'forum' }
  | { type: 'topic'; id: string; slug?: string }
  | { type: 'new-topic' }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'profile' }
  | { type: 'guidelines' }
  | { type: 'privacy' }
  | { type: 'terms' }
  | { type: 'cookies' }
  | { type: 'login' }
  | { type: 'register' };

export function parseRoute(rawPath: string): Route {
  // Support both /path and #/path formats
  let clean = rawPath.replace(/^[#?]/, '').replace(/^#\/?/, '').replace(/^\//, '');
  // Strip search params or trailing slashes
  clean = clean.split('?')[0].split('#')[0].replace(/\/$/, '');

  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { type: 'home' };
  }

  const [seg1, seg2, seg3] = parts;

  if (seg1 === 'videos') {
    if (seg2) return { type: 'video', id: seg2, slug: seg2 };
    return { type: 'videos' };
  }

  if (seg1 === 'games') {
    if (seg2) return { type: 'game', id: seg2, slug: seg2 };
    return { type: 'games' };
  }

  if (seg1 === 'articles') {
    if (seg2) return { type: 'article', id: seg2, slug: seg2 };
    return { type: 'articles' };
  }

  if (seg1 === 'reviews') {
    if (seg2) return { type: 'review', id: seg2, slug: seg2 };
    return { type: 'reviews' };
  }

  if (seg1 === 'guides') {
    if (seg2) return { type: 'guide', id: seg2, slug: seg2 };
    return { type: 'guides' };
  }

  if (seg1 === 'forum') {
    if (seg2 === 'new' || seg2 === 'new-topic') return { type: 'new-topic' };
    if (seg2 === 'topic' && seg3) return { type: 'topic', id: seg3, slug: seg3 };
    if (seg2) return { type: 'topic', id: seg2, slug: seg2 };
    return { type: 'forum' };
  }

  if (seg1 === 'about' || seg1 === 'about-game-vault') return { type: 'about' };
  if (seg1 === 'contact' || seg1 === 'contact-us') return { type: 'contact' };
  if (seg1 === 'profile') return { type: 'profile' };
  if (seg1 === 'guidelines' || seg1 === 'community-guidelines') return { type: 'guidelines' };
  if (seg1 === 'privacy' || seg1 === 'privacy-policy') return { type: 'privacy' };
  if (seg1 === 'terms' || seg1 === 'terms-of-service' || seg1 === 'tos') return { type: 'terms' };
  if (seg1 === 'cookies' || seg1 === 'cookie-policy') return { type: 'cookies' };
  if (seg1 === 'login' || seg1 === 'signin') return { type: 'login' };
  if (seg1 === 'register' || seg1 === 'signup') return { type: 'register' };

  return { type: 'home' };
}

export function routeToUrl(route: Route): string {
  switch (route.type) {
    case 'home':
      return '/';
    case 'videos':
      return '/videos';
    case 'video':
      return `/videos/${route.slug || route.id}`;
    case 'games':
      return '/games';
    case 'game':
      return `/games/${route.slug || route.id}`;
    case 'articles':
      return '/articles';
    case 'article':
      return `/articles/${route.slug || route.id}`;
    case 'reviews':
      return '/reviews';
    case 'review':
      return `/reviews/${route.slug || route.id}`;
    case 'guides':
      return '/guides';
    case 'guide':
      return `/guides/${route.slug || route.id}`;
    case 'forum':
      return '/forum';
    case 'topic':
      return `/forum/${route.slug || route.id}`;
    case 'new-topic':
      return '/forum/new';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'profile':
      return '/profile';
    case 'guidelines':
      return '/guidelines';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'cookies':
      return '/cookies';
    case 'login':
      return '/login';
    case 'register':
      return '/register';
  }
}

export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check for query parameter redirect (from SPA 404 fallback or external links, e.g. /?p=/privacy or /?redirect=/articles)
  if (window.location.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('p') || params.get('redirect');
      if (redirectPath) {
        const cleanPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
        // Clean address bar using replaceState to restore pristine URL without reload
        window.history.replaceState(null, '', cleanPath + window.location.hash);
        return cleanPath;
      }
    } catch {
      // ignore URLSearchParams errors in older environments
    }
  }

  // 2. Check hash route if present (e.g. #/articles/why-world-of-warships...)
  if (window.location.hash && window.location.hash.length > 1) {
    return window.location.hash.replace(/^#/, '');
  }

  return window.location.pathname || '/';
}

export function navigateTo(url: string) {
  if (typeof window === 'undefined') return;

  // Format url with leading slash
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  // Update browser history
  window.history.pushState({}, '', cleanUrl);

  // Dispatch custom navigation event for reactive updates
  window.dispatchEvent(new Event('gv_navigate'));

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(getCurrentPath);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('gv_navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('gv_navigate', handleLocationChange);
    };
  }, []);

  const route = parseRoute(currentPath);

  const navigate = (to: string | Route) => {
    const url = typeof to === 'string' ? to : routeToUrl(to);
    navigateTo(url);
  };

  return {
    path: currentPath,
    route,
    navigate
  };
}
