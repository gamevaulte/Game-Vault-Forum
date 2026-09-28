import { UserAccount } from '../types';
import { DEFAULT_USER } from '../data/mockData';

/**
 * Normalizes any UserAccount object to guarantee all required fields,
 * bookmark sub-arrays, stats, and release tracking fields exist.
 * This completely prevents "TypeError: Cannot read properties of undefined (reading 'includes')"
 * when opening profiles or checking saved bookmarks.
 */
export function normalizeUserAccount(raw?: Partial<UserAccount> | null): UserAccount {
  if (!raw) {
    return {
      ...DEFAULT_USER,
      bookmarks: {
        videos: [],
        games: [],
        articles: [],
        reviews: [],
        guides: [],
        topics: []
      },
      releaseWatchlist: [],
      releaseReminders: {},
      likedIds: [],
      stats: {
        likesCount: 0,
        commentsCount: 0,
        savesCount: 0,
        topicsCount: 0
      }
    };
  }

  const rawBookmarks = (raw.bookmarks || {}) as Partial<UserAccount['bookmarks']>;

  return {
    id: raw.id || DEFAULT_USER.id,
    name: (raw.name || DEFAULT_USER.name).trim() || 'Vault Operative',
    username: (raw.username || DEFAULT_USER.username).trim() || '@operative',
    email: raw.email || DEFAULT_USER.email,
    avatar: raw.avatar || DEFAULT_USER.avatar,
    bio: typeof raw.bio === 'string' ? raw.bio : DEFAULT_USER.bio || '',
    badge: raw.badge || DEFAULT_USER.badge || 'Vault Pioneer',
    level: raw.level ?? DEFAULT_USER.level ?? 1,
    role: raw.role || DEFAULT_USER.role || 'user',
    isStaff: Boolean(raw.isStaff ?? DEFAULT_USER.isStaff),
    reputation: typeof raw.reputation === 'number' ? raw.reputation : DEFAULT_USER.reputation ?? 0,
    joinDate: raw.joinDate || DEFAULT_USER.joinDate || 'Jan 2025',
    createdAt: raw.createdAt || DEFAULT_USER.createdAt,
    bookmarks: {
      videos: Array.isArray(rawBookmarks.videos) ? rawBookmarks.videos.filter((id): id is string => typeof id === 'string') : [],
      games: Array.isArray(rawBookmarks.games) ? rawBookmarks.games.filter((id): id is string => typeof id === 'string') : [],
      articles: Array.isArray(rawBookmarks.articles) ? rawBookmarks.articles.filter((id): id is string => typeof id === 'string') : [],
      reviews: Array.isArray(rawBookmarks.reviews) ? rawBookmarks.reviews.filter((id): id is string => typeof id === 'string') : [],
      guides: Array.isArray(rawBookmarks.guides) ? rawBookmarks.guides.filter((id): id is string => typeof id === 'string') : [],
      topics: Array.isArray(rawBookmarks.topics) ? rawBookmarks.topics.filter((id): id is string => typeof id === 'string') : []
    },
    releaseWatchlist: Array.isArray(raw.releaseWatchlist) ? raw.releaseWatchlist.filter((id): id is string => typeof id === 'string') : [],
    releaseReminders: raw.releaseReminders && typeof raw.releaseReminders === 'object' && !Array.isArray(raw.releaseReminders) ? { ...raw.releaseReminders } : {},
    likedIds: Array.isArray(raw.likedIds) ? raw.likedIds.filter((id): id is string => typeof id === 'string') : [],
    stats: {
      likesCount: typeof raw.stats?.likesCount === 'number' ? raw.stats.likesCount : 0,
      commentsCount: typeof raw.stats?.commentsCount === 'number' ? raw.stats.commentsCount : 0,
      savesCount: typeof raw.stats?.savesCount === 'number' ? raw.stats.savesCount : 0,
      topicsCount: typeof raw.stats?.topicsCount === 'number' ? raw.stats.topicsCount : 0
    }
  };
}
