import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PageTab, Video, Game, Article, Review, Guide, ForumTopic, UserAccount, PostComment } from './types';
import {
  MOCK_VIDEOS,
  MOCK_GAMES,
  MOCK_ARTICLES,
  MOCK_REVIEWS,
  MOCK_GUIDES,
  MOCK_FORUM_TOPICS,
  DEFAULT_USER
} from './data/mockData';
import { INITIAL_ARTICLE_COMMENTS } from './data/initialCommunityData';

// Router
import { useRouter, routeToUrl, Route } from './lib/router';
import { getSeoSlug, findItemBySlugOrId, updatePageSeo } from './lib/seo';

// UI Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AdBanner } from './components/AdBanner';
import { VaultAiFloatingButton } from './components/ai/VaultAiFloatingButton';

// Lazy-loaded AuthGate for minimal initial bundle weight
const AuthGate = lazy(() => import('./components/AuthGate').then(m => ({ default: m.AuthGate })));

// Route-Based Code Splitting for Latency and Performance Optimization
const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const VideosView = lazy(() => import('./views/VideosView').then(m => ({ default: m.VideosView })));
const GamesView = lazy(() => import('./views/GamesView').then(m => ({ default: m.GamesView })));
const ArticlesView = lazy(() => import('./views/ArticlesView').then(m => ({ default: m.ArticlesView })));
const ReviewsView = lazy(() => import('./views/ReviewsView').then(m => ({ default: m.ReviewsView })));
const GuidesView = lazy(() => import('./views/GuidesView').then(m => ({ default: m.GuidesView })));
const ForumView = lazy(() => import('./views/ForumView').then(m => ({ default: m.ForumView })));
const AboutView = lazy(() => import('./views/AboutView').then(m => ({ default: m.AboutView })));

// Dedicated Page Views
const ArticlePageView = lazy(() => import('./views/ArticlePageView').then(m => ({ default: m.ArticlePageView })));
const VideoPageView = lazy(() => import('./views/VideoPageView').then(m => ({ default: m.VideoPageView })));
const GamePageView = lazy(() => import('./views/GamePageView').then(m => ({ default: m.GamePageView })));
const ReviewPageView = lazy(() => import('./views/ReviewPageView').then(m => ({ default: m.ReviewPageView })));
const GuidePageView = lazy(() => import('./views/GuidePageView').then(m => ({ default: m.GuidePageView })));
const TopicPageView = lazy(() => import('./views/TopicPageView').then(m => ({ default: m.TopicPageView })));
const NewTopicPageView = lazy(() => import('./views/NewTopicPageView').then(m => ({ default: m.NewTopicPageView })));
const GuidelinesPageView = lazy(() => import('./views/GuidelinesPageView').then(m => ({ default: m.GuidelinesPageView })));
const PrivacyPolicyView = lazy(() => import('./views/PrivacyPolicyView').then(m => ({ default: m.PrivacyPolicyView })));
const TermsOfServiceView = lazy(() => import('./views/TermsOfServiceView').then(m => ({ default: m.TermsOfServiceView })));
const CookiePolicyView = lazy(() => import('./views/CookiePolicyView').then(m => ({ default: m.CookiePolicyView })));
const ContactPageView = lazy(() => import('./views/ContactPageView').then(m => ({ default: m.ContactPageView })));
const PcRequirementsView = lazy(() => import('./views/PcRequirementsView').then(m => ({ default: m.PcRequirementsView })));
const FpsCalculatorView = lazy(() => import('./views/FpsCalculatorView').then(m => ({ default: m.FpsCalculatorView })));
const UsernameGeneratorView = lazy(() => import('./views/UsernameGeneratorView').then(m => ({ default: m.UsernameGeneratorView })));
const PcBuilderView = lazy(() => import('./views/PcBuilderView').then(m => ({ default: m.PcBuilderView })));
const ToolsHubView = lazy(() => import('./views/ToolsHubView').then(m => ({ default: m.ToolsHubView })));
const AvatarGeneratorView = lazy(() => import('./views/AvatarGeneratorView').then(m => ({ default: m.AvatarGeneratorView })));
const GamePickerWheelView = lazy(() => import('./views/GamePickerWheelView').then(m => ({ default: m.GamePickerWheelView })));
const VaultAiView = lazy(() => import('./views/VaultAiView').then(m => ({ default: m.VaultAiView })));
const SitemapView = lazy(() => import('./views/SitemapView').then(m => ({ default: m.SitemapView })));
const AuthorPageView = lazy(() => import('./views/AuthorPageView').then(m => ({ default: m.AuthorPageView })));
const GamingSectionView = lazy(() => import('./views/GamingSectionView').then(m => ({ default: m.GamingSectionView })));

// Interactive Secondary Modals
const GlobalSearchModal = lazy(() => import('./components/GlobalSearchModal').then(m => ({ default: m.GlobalSearchModal })));
const AuthProfileModal = lazy(() => import('./components/AuthProfileModal').then(m => ({ default: m.AuthProfileModal })));
const ShareModal = lazy(() => import('./components/ShareModal').then(m => ({ default: m.ShareModal })));
const EmailSubscribeModal = lazy(() => import('./components/EmailSubscribeModal').then(m => ({ default: m.EmailSubscribeModal })));
const PublicUserProfileModal = lazy(() => import('./components/PublicUserProfileModal').then(m => ({ default: m.PublicUserProfileModal })));
import type { PublicUserProfileData } from './components/PublicUserProfileModal';

// Firebase Auth & Firestore Backend
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { 
  auth, 
  getUserFromFirestore, 
  addRegisteredUserToFirestore, 
  updateUserInFirestore, 
  saveTopicToFirestore, 
  saveCommentToFirestore, 
  syncLikeToFirestore, 
  saveNewsletterSubscriber,
  ensureInitialFirestoreDocuments,
  subscribeToComments,
  subscribeToLikes,
  subscribeToTopics,
  getPublicUserProfile,
  isSearchCrawler
} from './lib/firebase';

export default function App() {
  const { route, path, navigate } = useRouter();

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth Modal State (pops up when guest attempts to like or comment, or after 60s timed visitor prompt)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string>('');

  // Email Subscribe Modal State (pops up for visitors after ~10 seconds to stay in the know)
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  // Interactive Content Lists with Persistence (strictly uninflated metrics)
  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    // Purge legacy storage keys that contained outdated or inflated mock reply metrics
    try {
      localStorage.removeItem('gv_forum_topics');
      localStorage.removeItem('gv_forum_topics_v1');
      localStorage.removeItem('gv_forum_topics_v2');
    } catch {}

    const saved = localStorage.getItem('gv_forum_topics_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: ForumTopic) => {
            const cleanReplies = Array.isArray(t.replies)
              ? t.replies.filter((r) => r && typeof r.content === 'string' && r.content.trim().length > 0)
              : [];
            return {
              ...t,
              replies: cleanReplies,
              repliesCount: cleanReplies.length
            };
          });
        }
      } catch (e) {
        console.error('Failed to parse saved forum topics', e);
      }
    }
    return MOCK_FORUM_TOPICS.map((t) => ({
      ...t,
      replies: Array.isArray(t.replies) ? t.replies : [],
      repliesCount: Array.isArray(t.replies) ? t.replies.length : 0
    }));
  });

  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('gv_forum_user_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return DEFAULT_USER;
  });

  // Post Likes Map: itemId -> like count (starts at 0)
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gv_post_likes_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse likes map', e);
      }
    }
    return {};
  });

  // Set of post IDs liked by the signed-in user
  const [userLikedSet, setUserLikedSet] = useState<Set<string>>(new Set());

  // Set of post IDs liked by visitors
  const [visitorLikedSet, setVisitorLikedSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('gv_visitor_likes_v1');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set();
  });

  // Comments Map for Articles & Videos: pre-seeded with rich discussion so all visitors can see and engage immediately
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>(() => {
    const base: Record<string, PostComment[]> = {};
    Object.keys(INITIAL_ARTICLE_COMMENTS).forEach((pid) => {
      base[pid] = [...INITIAL_ARTICLE_COMMENTS[pid]];
    });

    const saved = localStorage.getItem('gv_post_comments_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach((pid) => {
          const existing = base[pid] || [];
          const map = new Map<string, PostComment>();
          existing.forEach((c) => map.set(c.id, c));
          (parsed[pid] || []).forEach((c: PostComment) => map.set(c.id, c));
          base[pid] = Array.from(map.values());
        });
      } catch (e) {
        console.error('Failed to parse comments map', e);
      }
    }
    return base;
  });

  // Modals & UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'guidelines'>('profile');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [publicProfileModal, setPublicProfileModal] = useState<{
    isOpen: boolean;
    profile: PublicUserProfileData | null;
  }>({
    isOpen: false,
    profile: null
  });
  const [shareState, setShareState] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    description?: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
    description: ''
  });

  // Synchronize with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        // Optimistic fast local sync
        setUser((prev) => ({
          ...prev,
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Vault Operative',
          username: `@${(fbUser.displayName || fbUser.email?.split('@')[0] || 'operative').toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          email: fbUser.email || undefined,
          avatar: fbUser.photoURL || prev.avatar || DEFAULT_USER.avatar
        }));

        // Fetch authoritative profile from Firestore collection 'Users'
        getUserFromFirestore(fbUser.uid)
          .then((firestoreRecord) => {
            if (firestoreRecord) {
              setUser((prev) => ({
                ...prev,
                id: firestoreRecord.uid,
                name: firestoreRecord.displayName || prev.name,
                username: firestoreRecord.username || prev.username,
                email: firestoreRecord.email || prev.email,
                avatar: firestoreRecord.photoURL || prev.avatar,
                bio: firestoreRecord.bio || prev.bio,
                badge: firestoreRecord.badge || prev.badge,
                level: firestoreRecord.level || prev.level,
                reputation: firestoreRecord.reputation ?? 0,
                bookmarks: firestoreRecord.bookmarks || {
                  videos: [],
                  games: [],
                  articles: [],
                  reviews: [],
                  guides: [],
                  topics: []
                },
                stats: firestoreRecord.stats || {
                  likesCount: 0,
                  commentsCount: 0,
                  savesCount: 0,
                  topicsCount: 0
                }
              }));
            } else {
              // Ensure doc exists in Firestore 'Users' if created externally
              addRegisteredUserToFirestore({
                uid: fbUser.uid,
                email: fbUser.email || '',
                displayName: fbUser.displayName,
                photoURL: fbUser.photoURL,
                emailVerified: fbUser.emailVerified
              }).then((createdRecord) => {
                if (createdRecord) {
                  setUser((prev) => ({
                    ...prev,
                    id: createdRecord.uid,
                    name: createdRecord.displayName || prev.name,
                    username: createdRecord.username || prev.username,
                    email: createdRecord.email || prev.email,
                    avatar: createdRecord.photoURL || prev.avatar,
                    bio: createdRecord.bio || prev.bio,
                    badge: createdRecord.badge || prev.badge,
                    level: createdRecord.level || prev.level,
                    reputation: createdRecord.reputation ?? 0
                  }));
                }
              });
            }
          })
          .catch((err) => {
            console.warn('Firestore user profile sync warning:', err);
          });

        // Load liked posts for this user
        const savedLikes = localStorage.getItem(`gv_user_liked_${fbUser.uid}`);
        if (savedLikes) {
          try {
            setUserLikedSet(new Set(JSON.parse(savedLikes)));
          } catch (e) {
            setUserLikedSet(new Set());
          }
        }
      } else {
        setUser(DEFAULT_USER);
        setUserLikedSet(new Set());
      }
    });

    const handleOpenAuth = () => {
      setAuthPromptMessage('Sign in or register to get unlimited queries and unlock full community perks.');
      setIsAuthModalOpen(true);
    };
    window.addEventListener('gv-open-auth-modal', handleOpenAuth);

    return () => {
      unsubscribe();
      window.removeEventListener('gv-open-auth-modal', handleOpenAuth);
    };
  }, []);

  // Real-time Firestore sync: Decoupled from the critical rendering path so public articles render instantly without blocking
  useEffect(() => {
    // Search engine bots and automated crawlers must never open persistent real-time streaming Listen channels
    if (isSearchCrawler()) {
      return;
    }

    let unsubLikes: () => void = () => {};
    let unsubComments: () => void = () => {};

    // Defer listener initialization slightly until after primary page content has mounted and rendered
    const timer = setTimeout(() => {
      unsubLikes = subscribeToLikes((firestoreLikes) => {
        setLikesMap((prev) => {
          const next = { ...prev, ...firestoreLikes };
          try {
            localStorage.setItem('gv_post_likes_v2', JSON.stringify(next));
          } catch {}
          return next;
        });
      });

      unsubComments = subscribeToComments((firestoreComments) => {
        setCommentsMap((prev) => {
          const next = { ...prev };
          Object.keys(firestoreComments).forEach((contentId) => {
            const incoming = firestoreComments[contentId] || [];
            const existing = next[contentId] || [];
            const map = new Map<string, PostComment>();
            existing.forEach((c) => map.set(c.id, c));
            incoming.forEach((c) => map.set(c.id, c));
            next[contentId] = Array.from(map.values()).sort((a, b) => {
              const timeA = (a as any).createdAt?.seconds || 0;
              const timeB = (b as any).createdAt?.seconds || 0;
              return timeA - timeB;
            });
          });
          try {
            localStorage.setItem('gv_post_comments_v2', JSON.stringify(next));
          } catch {}
          return next;
        });
      });
    }, 1200);

    return () => {
      clearTimeout(timer);
      unsubLikes();
      unsubComments();
    };
  }, []);

  // Dedicated forum topic listener: ONLY active when user is in the community forum!
  useEffect(() => {
    if (isSearchCrawler()) return;
    const isForumRoute = route.type === 'forum' || route.type === 'topic' || route.type === 'new-topic';
    if (!isForumRoute) return;

    const unsubTopics = subscribeToTopics((firestoreTopics) => {
      setTopics((prev) => {
        const map = new Map<string, ForumTopic>();
        prev.forEach((t) => map.set(t.id, t));
        firestoreTopics.forEach((ft) => {
          const existing = map.get(ft.id);
          if (existing) {
            const cleanReplies = Array.isArray(ft.replies) && ft.replies.length > 0 ? ft.replies : existing.replies;
            map.set(ft.id, {
              ...existing,
              ...ft,
              replies: cleanReplies,
              repliesCount: Math.max(ft.repliesCount || 0, cleanReplies.length)
            });
          } else {
            map.set(ft.id, ft);
          }
        });
        const updated = Array.from(map.values());
        try {
          localStorage.setItem('gv_forum_topics_v3', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    });

    return () => {
      unsubTopics();
    };
  }, [route.type]);

  // Idle Route Prefetching: Pre-warms popular view chunks without degrading initial render performance
  useEffect(() => {
    const idlePrefetch = () => {
      import('./views/VideosView');
      import('./views/ArticlesView');
      import('./views/GamesView');
      import('./views/ForumView');
      import('./components/GlobalSearchModal');
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(idlePrefetch, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(idlePrefetch, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Ensure initial Firestore documents when admin is active
  useEffect(() => {
    if (firebaseUser && firebaseUser.email === 'contact@gamevault.forum') {
      ensureInitialFirestoreDocuments();
    }
  }, [firebaseUser]);

  // Persist topics, user, likes, comments
  useEffect(() => {
    try {
      localStorage.setItem('gv_forum_topics_v3', JSON.stringify(topics));
    } catch {}
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('gv_forum_user_v2', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gv_post_likes_v2', JSON.stringify(likesMap));
  }, [likesMap]);

  useEffect(() => {
    localStorage.setItem('gv_post_comments_v2', JSON.stringify(commentsMap));
  }, [commentsMap]);

  // 1. Timed Newsletter Subscription Popup: Displays after ~10 seconds for new visitors to stay in the know
  useEffect(() => {
    const isSubscribed = localStorage.getItem('gv_newsletter_subscribed') === 'true';
    const isDismissed = sessionStorage.getItem('gv_newsletter_popup_closed') === 'true';

    if (isSubscribed || isDismissed) {
      return;
    }

    const timer = setTimeout(() => {
      const currentSubscribed = localStorage.getItem('gv_newsletter_subscribed') === 'true';
      const currentDismissed = sessionStorage.getItem('gv_newsletter_popup_closed') === 'true';
      if (!currentSubscribed && !currentDismissed) {
        setIsSubscribeModalOpen(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  // 2. Timed Sign In / Sign Up Popup: Displays after ~60 seconds for unauthenticated visitors / guests
  useEffect(() => {
    // If visitor is already authenticated, don't trigger the prompt
    if (firebaseUser) {
      return;
    }

    const isDismissed = sessionStorage.getItem('gv_auth_popup_closed') === 'true';
    if (isDismissed) {
      return;
    }

    const timer = setTimeout(() => {
      if (!auth.currentUser && sessionStorage.getItem('gv_auth_popup_closed') !== 'true') {
        // Dismiss subscription modal if currently open to prevent overlapping dialogs
        setIsSubscribeModalOpen(false);
        setAuthPromptMessage('Join the Game Vault community! Sign in or register for free to bookmark titles, vote on articles, join tactical discussions, and unlock personalized recommendations.');
        setIsAuthModalOpen(true);
      }
    }, 60000); // 60 seconds

    return () => clearTimeout(timer);
  }, [firebaseUser]);

  const handleCloseSubscribeModal = () => {
    try {
      sessionStorage.setItem('gv_newsletter_popup_closed', 'true');
    } catch {}
    setIsSubscribeModalOpen(false);
  };

  const handleNewsletterSubscribed = (subscribedEmail: string) => {
    try {
      localStorage.setItem('gv_newsletter_subscribed', 'true');
      sessionStorage.setItem('gv_newsletter_popup_closed', 'true');
    } catch {}
    addToast(`Subscribed ${subscribedEmail} to the Vault Dispatch!`, 'success');
  };

  const handleCloseAuthModal = () => {
    try {
      sessionStorage.setItem('gv_auth_popup_closed', 'true');
    } catch {}
    setIsAuthModalOpen(false);
  };

  // User Profile Update Handler: edits name, username, avatar, bio & syncs to Firestore database
  const handleUpdateProfile = async (updatedData: {
    name: string;
    username: string;
    avatar: string;
    bio?: string;
  }) => {
    const cleanName = updatedData.name.trim();
    let cleanUsername = updatedData.username.trim();
    if (!cleanUsername.startsWith('@')) {
      cleanUsername = `@${cleanUsername}`;
    }
    const cleanAvatar = updatedData.avatar.trim();
    const cleanBio = (updatedData.bio || '').trim();

    // 1. Update React User State & Local Storage
    setUser((prev) => {
      const updated: UserAccount = {
        ...prev,
        name: cleanName,
        username: cleanUsername,
        avatar: cleanAvatar,
        bio: cleanBio
      };
      try {
        localStorage.setItem('gv_forum_user_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Synchronize to Firestore Database ('Users' and 'users' collections) & Firebase Auth profile
    const targetUid = firebaseUser?.uid || user.id;
    try {
      await updateUserInFirestore(targetUid, {
        displayName: cleanName,
        name: cleanName,
        username: cleanUsername,
        photoURL: cleanAvatar,
        avatar: cleanAvatar,
        bio: cleanBio
      });
    } catch (err) {
      console.warn('Firestore user profile sync warning:', err);
    }

    // 3. Update active forum topics author details if authored by this user
    setTopics((prev) =>
      prev.map((t) => {
        if (t.author.name === user.name || t.author.name === cleanName) {
          return {
            ...t,
            author: {
              ...t.author,
              name: cleanName,
              avatar: cleanAvatar
            }
          };
        }
        return t;
      })
    );

    addToast('Profile changes saved and synchronized to Firestore!', 'success');
  };

  // Toast Helpers
  const addToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser(DEFAULT_USER);
      setUserLikedSet(new Set());
      addToast('Signed out of Game Vault.', 'info');
    } catch (err) {
      console.error('Sign out error', err);
      addToast('Failed to sign out. Please try again.', 'info');
    }
  };

  // Helper to get like count (starts at 0, only increases when users like them)
  const getLikeCount = (itemId: string, defaultBase: number = 0): number => {
    if (likesMap[itemId] !== undefined) {
      return likesMap[itemId];
    }
    return defaultBase || 0;
  };

  // Helper to check if current user or visitor liked item
  const isItemLiked = (itemId: string): boolean => {
    return firebaseUser ? userLikedSet.has(itemId) : visitorLikedSet.has(itemId);
  };

  // Like Toggle Handler: Works seamlessly for both registered operatives and visitors!
  const handleToggleLike = (itemId: string, itemTitle?: string, defaultBase: number = 0) => {
    const alreadyLiked = firebaseUser ? userLikedSet.has(itemId) : visitorLikedSet.has(itemId);
    const currentCount = getLikeCount(itemId, defaultBase);
    const newCount = alreadyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    // Update global like count
    setLikesMap((prev) => {
      const updated = { ...prev, [itemId]: newCount };
      try {
        localStorage.setItem('gv_post_likes_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (firebaseUser) {
      // Update registered user liked set
      setUserLikedSet((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        try {
          localStorage.setItem(`gv_user_liked_${firebaseUser.uid}`, JSON.stringify(Array.from(next)));
        } catch {}
        return next;
      });

      // Update user stats & reputation (zero-based, only increases as user acts)
      setUser((prev) => {
        const prevStats = prev.stats || { likesCount: 0, commentsCount: 0, savesCount: 0, topicsCount: 0 };
        const updatedStats = {
          ...prevStats,
          likesCount: Math.max(0, prevStats.likesCount + (alreadyLiked ? -1 : 1))
        };
        const updatedReputation = Math.max(0, (prev.reputation || 0) + (alreadyLiked ? -2 : 2));
        const updatedUser: UserAccount = {
          ...prev,
          stats: updatedStats,
          reputation: updatedReputation,
          likedIds: alreadyLiked 
            ? (prev.likedIds || []).filter((id) => id !== itemId)
            : [...(prev.likedIds || []), itemId]
        };
        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
        return updatedUser;
      });

      // Synchronize like to Firebase Firestore backend
      syncLikeToFirestore(itemId, newCount, firebaseUser.uid, !alreadyLiked);
    } else {
      // Update visitor liked set
      setVisitorLikedSet((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        try {
          localStorage.setItem('gv_visitor_likes_v1', JSON.stringify(Array.from(next)));
        } catch {}
        return next;
      });

      // Synchronize visitor like to Firebase
      syncLikeToFirestore(itemId, newCount);
    }

    if (alreadyLiked) {
      addToast(itemTitle ? `Unliked "${itemTitle}".` : 'Unliked post.', 'info');
    } else {
      addToast(itemTitle ? `Liked "${itemTitle}"!` : 'Liked post!', 'success');
    }
  };

  // Comment Handlers for Articles & Videos: Allows all visitors and registered members to participate
  const handleAddPostComment = (
    postId: string, 
    content: string, 
    options?: { replyToId?: string; replyToAuthor?: string; guestAuthorName?: string; postTitle?: string }
  ) => {
    const authorName = firebaseUser 
      ? user.name 
      : (options?.guestAuthorName?.trim() || localStorage.getItem('gv_guest_callsign') || 'Guest Operative');
    const authorAvatar = firebaseUser 
      ? user.avatar 
      : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80';
    const authorRole = firebaseUser ? (user.role || user.badge || 'Recruit Operative') : 'Guest Operative';
    const authorBadge = firebaseUser ? user.badge : 'Guest Operative';
    const authorId = firebaseUser ? firebaseUser.uid : `guest-${Date.now()}`;

    if (!firebaseUser && options?.guestAuthorName) {
      try {
        localStorage.setItem('gv_guest_callsign', options.guestAuthorName.trim());
      } catch {}
    }

    const newComment: PostComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: {
        id: authorId,
        name: authorName,
        username: firebaseUser ? user.username : `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        avatar: authorAvatar,
        role: authorRole,
        badge: authorBadge
      },
      content,
      timestamp: 'Just now',
      likes: 0,
      replyToId: options?.replyToId,
      replyToAuthor: options?.replyToAuthor,
      createdAt: new Date().toISOString()
    };

    setCommentsMap((prev) => {
      const existing = prev[postId] || [];
      const updated = { ...prev, [postId]: [newComment, ...existing] };
      try {
        localStorage.setItem('gv_post_comments_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (firebaseUser) {
      // Increment user comments stats & reputation
      setUser((prev) => {
        const prevStats = prev.stats || { likesCount: 0, commentsCount: 0, savesCount: 0, topicsCount: 0 };
        const updatedStats = {
          ...prevStats,
          commentsCount: prevStats.commentsCount + 1
        };
        const updatedReputation = (prev.reputation || 0) + 5;
        const updatedUser: UserAccount = {
          ...prev,
          stats: updatedStats,
          reputation: updatedReputation
        };
        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
        return updatedUser;
      });
    }

    // Synchronize comment to Firebase Firestore backend
    saveCommentToFirestore(postId, newComment);

    const postTitle = options?.postTitle;
    addToast(postTitle ? `Published comment on "${postTitle}"!` : 'Comment published to discussion!', 'success');
  };

  // Comment Like Handler: Works for all visitors & registered users
  const handleToggleCommentLike = (commentId: string) => {
    handleToggleLike(commentId, 'Comment', 0);
  };

  // Bookmark Toggle - Restricts saving content to registered & signed in users only!
  const handleToggleBookmark = (
    type: 'videos' | 'games' | 'articles' | 'reviews' | 'guides',
    id: string,
    itemName: string
  ) => {
    if (!firebaseUser) {
      setAuthPromptMessage('Only registered and signed in users can save content across the website. Sign in or register to build your personal Vault collection!');
      setIsAuthModalOpen(true);
      return;
    }

    setUser((prev) => {
      const currentList = prev.bookmarks[type] || [];
      const isAlreadyBookmarked = currentList.includes(id);
      const updatedList = isAlreadyBookmarked
        ? currentList.filter((item) => item !== id)
        : [...currentList, id];

      if (isAlreadyBookmarked) {
        addToast(`Removed "${itemName}" from saved Vault entries.`, 'info');
      } else {
        addToast(`Saved "${itemName}" to your Vault!`, 'success');
      }

      const updatedBookmarks = {
        ...prev.bookmarks,
        [type]: updatedList
      };

      const totalSaves =
        (updatedBookmarks.videos?.length || 0) +
        (updatedBookmarks.games?.length || 0) +
        (updatedBookmarks.articles?.length || 0) +
        (updatedBookmarks.reviews?.length || 0) +
        (updatedBookmarks.guides?.length || 0) +
        (updatedBookmarks.topics?.length || 0);

      const prevStats = prev.stats || { likesCount: 0, commentsCount: 0, savesCount: 0, topicsCount: 0 };
      const updatedStats = {
        ...prevStats,
        savesCount: totalSaves
      };
      const updatedReputation = Math.max(0, (prev.reputation || 0) + (isAlreadyBookmarked ? -1 : 1));

      // Persist to user record in Firestore Users collection
      if (firebaseUser) {
        updateUserInFirestore(firebaseUser.uid, {
          bookmarks: updatedBookmarks,
          stats: updatedStats,
          reputation: updatedReputation
        });
      }

      return {
        ...prev,
        bookmarks: updatedBookmarks,
        stats: updatedStats,
        reputation: updatedReputation
      };
    });
  };

  // Share Handler (opens standard social sharing & copy link modal)
  const handleShare = (title: string, customPath?: string, description?: string) => {
    let fullUrl = window.location.href;
    if (customPath) {
      if (customPath.startsWith('http://') || customPath.startsWith('https://')) {
        fullUrl = customPath;
      } else {
        const cleanPath = customPath.startsWith('/') ? customPath : `/${customPath}`;
        fullUrl = `${window.location.origin}${cleanPath}`;
      }
    }

    setShareState({
      isOpen: true,
      title,
      url: fullUrl,
      description
    });
  };

  // Forum Reply Handler: Allows all visitors and members to participate in discussions
  const handleAddReply = (
    topicId: string, 
    replyText: string,
    options?: { replyToAuthor?: string; guestAuthorName?: string }
  ) => {
    const authorName = firebaseUser 
      ? user.name 
      : (options?.guestAuthorName?.trim() || localStorage.getItem('gv_guest_callsign') || 'Guest Operative');
    const authorAvatar = firebaseUser 
      ? user.avatar 
      : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80';
    const authorRole = firebaseUser ? (user.role || user.badge || 'Recruit Operative') : 'Guest Operative';
    const authorBadge = firebaseUser ? user.badge : 'Guest Operative';
    const authorId = firebaseUser ? firebaseUser.uid : `guest-${Date.now()}`;

    if (!firebaseUser && options?.guestAuthorName) {
      try {
        localStorage.setItem('gv_guest_callsign', options.guestAuthorName.trim());
      } catch {}
    }

    const newReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: {
        id: authorId,
        name: authorName,
        username: firebaseUser ? user.username : `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        avatar: authorAvatar,
        role: authorRole,
        badge: authorBadge,
        isStaff: false
      },
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
      replyToAuthor: options?.replyToAuthor,
      createdAt: new Date().toISOString()
    };

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const updatedReplies = [...(Array.isArray(t.replies) ? t.replies : []), newReply];
          const updatedTopic: ForumTopic = {
            ...t,
            repliesCount: updatedReplies.length,
            lastActivity: 'Just now',
            replies: updatedReplies
          };
          // Persist updated topic thread to Firestore
          saveTopicToFirestore(updatedTopic);
          return updatedTopic;
        }
        return t;
      })
    );

    if (firebaseUser) {
      // Increment user comments/replies stats & reputation
      setUser((prev) => {
        const prevStats = prev.stats || { likesCount: 0, commentsCount: 0, savesCount: 0, topicsCount: 0 };
        const updatedStats = {
          ...prevStats,
          commentsCount: prevStats.commentsCount + 1
        };
        const updatedReputation = (prev.reputation || 0) + 5;
        const updatedUser: UserAccount = {
          ...prev,
          stats: updatedStats,
          reputation: updatedReputation
        };

        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
        return updatedUser;
      });
    }

    addToast('Your response has been published to the discussion!', 'success');
  };

  // Create Forum Topic: Allows visitors and registered users to initiate tactical discussions
  const handleCreateTopic = (newTopicData: Partial<ForumTopic>) => {
    const authorName = firebaseUser 
      ? user.name 
      : (newTopicData.author?.name?.trim() || localStorage.getItem('gv_guest_callsign') || 'Guest Operative');
    const authorAvatar = firebaseUser 
      ? user.avatar 
      : (newTopicData.author?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80');
    const authorRole = firebaseUser ? (user.role || user.badge || 'Recruit Operative') : 'Guest Operative';
    const authorBadge = firebaseUser ? user.badge : 'Guest Operative';
    const authorId = firebaseUser ? firebaseUser.uid : `guest-${Date.now()}`;

    if (!firebaseUser && newTopicData.author?.name) {
      try {
        localStorage.setItem('gv_guest_callsign', newTopicData.author.name.trim());
      } catch {}
    }

    const newId = `topic-${Date.now()}`;
    const fullTopic: ForumTopic = {
      id: newId,
      title: newTopicData.title || 'Untitled Discussion',
      category: newTopicData.category || 'General Gaming',
      tags: newTopicData.tags || ['Discussion'],
      author: {
        id: authorId,
        name: authorName,
        username: firebaseUser ? user.username : `@${authorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        avatar: authorAvatar,
        role: authorRole,
        badge: authorBadge,
        isStaff: false
      },
      repliesCount: 0,
      views: 1,
      lastActivity: 'Just now',
      timestamp: 'Just now',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      isPinned: false,
      initialPost: newTopicData.initialPost || '',
      replies: [],
      likes: 0
    };

    setTopics((prev) => [fullTopic, ...prev]);
    // Persist new topic to Firebase Firestore backend
    saveTopicToFirestore(fullTopic);

    if (firebaseUser) {
      // Increment user topics stats & reputation
      setUser((prev) => {
        const prevStats = prev.stats || { likesCount: 0, commentsCount: 0, savesCount: 0, topicsCount: 0 };
        const updatedStats = {
          ...prevStats,
          topicsCount: prevStats.topicsCount + 1
        };
        const updatedReputation = (prev.reputation || 0) + 10;
        const updatedUser: UserAccount = {
          ...prev,
          stats: updatedStats,
          reputation: updatedReputation
        };

        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
        return updatedUser;
      });
    }

    addToast(`Discussion "${fullTopic.title}" opened in ${fullTopic.category}!`, 'success');
    navigate(`/forum/${getSeoSlug(fullTopic)}`);
  };

  // Handler to open public user profile popup (dossier) for any clicked user/visitor
  const handleViewUserProfile = async (author: { id?: string; name: string; username?: string; avatar: string; role?: string; badge?: string }) => {
    if (author.name.toLowerCase().includes('joel ayuba') || (author.role && author.role.toLowerCase().includes('founder'))) {
      navigate('/authors/joel-ayuba');
      return;
    }
    const fallbackUsername = author.username || author.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const initialData: PublicUserProfileData = {
      id: author.id,
      name: author.name,
      username: fallbackUsername,
      avatar: author.avatar,
      role: author.role || author.badge || 'Recruit Operative',
      badge: author.badge,
      createdAt: 'Vault Operative',
      joinDate: 'Vault Operative',
      reputation: 25,
      stats: {
        likesCount: 0,
        commentsCount: 0,
        savesCount: 0,
        topicsCount: 0
      },
      bio: 'Active tactical operative and gaming intelligence contributor across the Game Vault Forum ecosystem.'
    };

    // If viewing own profile while signed in, populate from local state directly
    if (firebaseUser && (author.id === firebaseUser.uid || author.name === user.name)) {
      initialData.name = user.name;
      initialData.username = user.username;
      initialData.avatar = user.avatar;
      initialData.role = user.role || 'Recruit Operative';
      initialData.reputation = user.reputation;
      initialData.stats = user.stats;
      initialData.bio = user.bio;
      initialData.badge = user.badge;
      initialData.createdAt = user.createdAt || user.joinDate || 'Active Operative';
      initialData.joinDate = user.joinDate || 'Active Operative';
    }

    setPublicProfileModal({
      isOpen: true,
      profile: initialData
    });

    // If an id or name is present, fetch live public Firestore document (strictly strips email for privacy)
    if (author.id || author.name) {
      try {
        const liveProfile = await getPublicUserProfile(author.id, author.name);
        if (liveProfile) {
          setPublicProfileModal({
            isOpen: true,
            profile: {
              ...initialData,
              ...liveProfile
            }
          });
        }
      } catch (err) {
        console.warn('Could not fetch live profile:', err);
      }
    }
  };

  const handleSubscribeNewsletter = async (email: string) => {
    try {
      await saveNewsletterSubscriber(email, 'footer');
      try {
        localStorage.setItem('gv_newsletter_subscribed', 'true');
        sessionStorage.setItem('gv_newsletter_popup_closed', 'true');
      } catch {}
      addToast(`Access granted! ${email} has been registered to the Vault Dispatch in Firestore.`, 'success');
    } catch (err: any) {
      console.warn('Newsletter subscription notice:', err);
      try {
        localStorage.setItem('gv_newsletter_subscribed', 'true');
        sessionStorage.setItem('gv_newsletter_popup_closed', 'true');
      } catch {}
      addToast(`Welcome! ${email} has been registered for the Vault Dispatch.`, 'success');
    }
  };

  // Dynamic SEO optimization for top-level pages
  useEffect(() => {
    switch (route.type) {
      case 'home':
        updatePageSeo({
          title: 'Game Vault Forum | Gaming Videos, Reviews, Guides & Community Discussions',
          description: 'Explore the Game Vault: watch tactical video briefings, discover verified games, read in-depth reviews & guides, and participate in community discussions.',
          canonicalPath: '/'
        });
        break;
      case 'videos':
        updatePageSeo({
          title: 'Gameplay Videos, Briefings & Lore Breakdowns | Game Vault Forum',
          description: 'Watch tactical analysis, mechanical breakdowns, and deep lore videos from the Game Vault official YouTube hub.',
          canonicalPath: '/videos',
          breadcrumbs: [{ name: 'Videos', path: '/videos' }]
        });
        break;
      case 'games':
        updatePageSeo({
          title: 'Tactical Game Vault Catalog & Specs Database | Game Vault Forum',
          description: 'Browse the curated Game Vault library featuring tactical evaluations, hardware recommendations, and genre classifications.',
          canonicalPath: '/games',
          breadcrumbs: [{ name: 'Games', path: '/games' }]
        });
        break;
      case 'articles':
        updatePageSeo({
          title: 'Vault Editorial Magazine & Gaming Analyses | Game Vault Forum',
          description: 'In-depth long-form journalism, game mechanics theory, and analytical retrospectives.',
          canonicalPath: '/articles',
          breadcrumbs: [{ name: 'Articles', path: '/articles' }]
        });
        break;
      case 'reviews':
        updatePageSeo({
          title: 'Tactical Game Reviews & Technical Verdicts | Game Vault Forum',
          description: 'Uncompromising, data-driven game reviews analyzing gameplay loop, mechanical depth, optimization, and replay value.',
          canonicalPath: '/reviews',
          breadcrumbs: [{ name: 'Reviews', path: '/reviews' }]
        });
        break;
      case 'guides':
        updatePageSeo({
          title: 'Tactical Game Guides, Builds & Walkthroughs | Game Vault Forum',
          description: 'Master your favorite tactical games with detailed routes, character builds, and strategic combat playbooks.',
          canonicalPath: '/guides',
          breadcrumbs: [{ name: 'Guides', path: '/guides' }]
        });
        break;
      case 'forum':
        updatePageSeo({
          title: 'Game Vault Community Discussions & Forum | Game Vault Forum',
          description: 'Connect with tactical gamers, share strategies, get troubleshooting help, and debate mechanics.',
          canonicalPath: '/forum',
          breadcrumbs: [{ name: 'Forum', path: '/forum' }]
        });
        break;
      case 'new-topic':
        updatePageSeo({
          title: 'Create a New Discussion Topic | Game Vault Forum',
          description: 'Start a new civil tactical discussion in the Game Vault community.',
          canonicalPath: '/forum/new',
          noIndex: true
        });
        break;
      case 'guidelines':
        updatePageSeo({
          title: 'Community Code of Conduct & Guidelines | Game Vault Forum',
          description: 'Rules of engagement and standards for civil, high-quality discussion on Game Vault Forum.',
          canonicalPath: '/guidelines',
          breadcrumbs: [{ name: 'Community Guidelines', path: '/guidelines' }]
        });
        break;
      case 'privacy':
        updatePageSeo({
          title: 'Privacy Policy & Google AdSense Disclosures | Game Vault Forum',
          description: 'Review the Game Vault Forum Privacy Policy: data protection practices, Google AdSense third-party cookie disclosures, CCPA, GDPR, and ad opt-out controls.',
          canonicalPath: '/privacy',
          breadcrumbs: [{ name: 'Privacy Policy', path: '/privacy' }]
        });
        break;
      case 'terms':
        updatePageSeo({
          title: 'Terms of Service & Advertising Standards | Game Vault Forum',
          description: 'Review the Game Vault Forum Terms of Service: community rules, content ownership, advertising standards, and platform terms of use.',
          canonicalPath: '/terms',
          breadcrumbs: [{ name: 'Terms of Service', path: '/terms' }]
        });
        break;
      case 'cookies':
        updatePageSeo({
          title: 'Cookie Policy & Advertising Technology Disclosures | Game Vault Forum',
          description: 'Learn how Game Vault Forum utilizes browser local storage, essential cookies, and Google AdSense advertising cookies with full user consent controls.',
          canonicalPath: '/cookies',
          breadcrumbs: [{ name: 'Cookie Policy', path: '/cookies' }]
        });
        break;
      case 'contact':
        updatePageSeo({
          title: 'Contact Editorial Desk & Publisher | Game Vault Forum',
          description: 'Contact Game Vault Forum: inquiries regarding editorial coverage, Google AdSense advertising, review copies, fact corrections, and DMCA notices.',
          canonicalPath: '/contact',
          breadcrumbs: [{ name: 'Contact Us', path: '/contact' }]
        });
        break;
      case 'about':
        updatePageSeo({
          title: 'About Game Vault Forum | Founded by Joel Ayuba',
          description: 'Learn about the mission, history, and editorial standards behind Game Vault Forum.',
          canonicalPath: '/about',
          breadcrumbs: [{ name: 'About', path: '/about' }]
        });
        break;
      case 'pc-requirements':
        updatePageSeo({
          title: 'Can My PC Run This Game? | PC Game Requirements Checker | Game Vault Forum',
          description: 'Check whether your PC meets the minimum and recommended requirements for your favorite games. Accurate component comparison without synthetic claims.',
          canonicalPath: '/tools/pc-game-requirements-checker',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'PC Game Requirements Checker', path: '/tools/pc-game-requirements-checker' }
          ]
        });
        break;
      case 'fps-calculator':
        updatePageSeo({
          title: '🎮 FPS / Performance Calculator | PC Gaming Benchmark & Bottleneck Estimator | Game Vault Forum',
          description: "Estimate your PC's real-world gaming FPS before playing. Check hardware bottlenecks, optimal resolution and graphics presets, and realistic performance ranges with Game Vault Forum.",
          canonicalPath: route.gameSlug ? `/tools/fps-calculator/${route.gameSlug}` : '/tools/fps-calculator',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'FPS / Performance Calculator', path: '/tools/fps-calculator' }
          ]
        });
        break;
      case 'gaming-username-generator':
        updatePageSeo({
          title: 'Gaming Username Generator | Create Unique Gamer Names | Game Vault Forum',
          description: 'Create a gaming name that actually feels like you. Generate unique, aesthetic, competitive, and lore-inspired usernames with safety filters.',
          canonicalPath: '/tools/gaming-username-generator',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'Gaming Username Generator', path: '/tools/gaming-username-generator' }
          ]
        });
        break;
      case 'gaming-pc-builder':
        updatePageSeo({
          title: 'Gaming PC Builder | Custom Balanced Hardware Optimizer | Game Vault Forum',
          description: 'Build a gaming PC around your budget and the games you actually play. Verified hardware compatibility, balance scoring, and real-world gameplay targets.',
          canonicalPath: '/tools/gaming-pc-builder',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'Gaming PC Builder', path: '/tools/gaming-pc-builder' }
          ]
        });
        break;
      case 'game-avatar-generator':
        updatePageSeo({
          title: 'Game Avatar Generator — Create Your Gaming Avatar | Game Vault Forum',
          description: 'Create a unique gaming avatar with the Game Vault Forum Avatar Generator. Customize your character, outfit, colors, accessories and gaming style.',
          canonicalPath: '/game-avatar-generator',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'Game Avatar Generator', path: '/game-avatar-generator' }
          ]
        });
        break;
      case 'game-picker-wheel':
        updatePageSeo({
          title: '🎮 Game Picker Wheel | Random Game Chooser | Game Vault Forum',
          description: "Can't decide what to play? Add your games, spin the wheel, and let Game Vault Forum choose for you! Features physics animations, sound effects, AI suggestions, and wheel saving.",
          canonicalPath: '/game-picker-wheel',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'Game Picker Wheel', path: '/game-picker-wheel' }
          ]
        });
        break;
      case 'tools':
        updatePageSeo({
          title: 'Gaming Tools & Hardware Utilities | Game Vault Forum',
          description: 'Free community-tested tools built for gamers: Gaming Username Generator, Custom PC Builder, and System Requirements Checker.',
          canonicalPath: '/tools',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' }
          ]
        });
        break;
      case 'vault-ai':
        updatePageSeo({
          title: 'Meet Vault AI | Flagship AI Gaming Assistant | Game Vault Forum',
          description: 'Your intelligent gaming companion for recommendations, game information, PC advice, troubleshooting, and gaming questions.',
          canonicalPath: '/tools/vault-ai',
          breadcrumbs: [
            { name: 'Tools', path: '/tools' },
            { name: 'Vault AI', path: '/tools/vault-ai' }
          ]
        });
        break;
      case 'sitemap':
        updatePageSeo({
          title: 'Website Sitemap & Navigation Index | Game Vault Forum',
          description: 'Complete directory and sitemap indexing all games, tactical guides, hardware benchmarks, AI tools, and forum topics on Game Vault Forum.',
          canonicalPath: '/sitemap',
          breadcrumbs: [
            { name: 'Sitemap', path: '/sitemap' }
          ]
        });
        break;
      case 'login':
      case 'register':
      case 'profile':
        updatePageSeo({
          title: 'User Portal | Game Vault Forum',
          description: 'Authenticate and manage your Game Vault profile.',
          canonicalPath: '/profile',
          noIndex: true
        });
        break;
      default:
        break;
    }
  }, [route.type]);

  // Determine which primary tab is active for Header styling
  const getActiveTab = (): PageTab => {
    switch (route.type) {
      case 'videos':
      case 'video':
        return 'videos';
      case 'games':
      case 'game':
        return 'games';
      case 'articles':
      case 'article':
      case 'author':
        return 'articles';
      case 'reviews':
      case 'review':
        return 'reviews';
      case 'guides':
      case 'guide':
        return 'guides';
      case 'forum':
      case 'topic':
      case 'new-topic':
        return 'forum';
      case 'pc-requirements':
        return 'pc-requirements';
      case 'fps-calculator':
        return 'fps-calculator';
      case 'game-avatar-generator':
        return 'game-avatar-generator';
      case 'gaming-username-generator':
        return 'gaming-username-generator';
      case 'gaming-pc-builder':
        return 'gaming-pc-builder';
      case 'game-picker-wheel':
        return 'game-picker-wheel';
      case 'vault-ai':
        return 'vault-ai';
      case 'tools':
        return 'tools';
      case 'sitemap':
        return 'sitemap';
      case 'about':
        return 'about';
      case 'play-games':
      case 'play-games-category':
      case 'play-game':
        return 'play-games';
      default:
        return 'home';
    }
  };

  // Initial Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-4 text-white font-sans">
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
          <div className="w-8 h-8 rounded-full bg-purple-600/20 backdrop-blur-md flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          </div>
        </div>
        <p className="text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 font-bold">
          Connecting to Game Vault Systems...
        </p>
      </div>
    );
  }

  // Full-page Login / Register View if user navigated directly to /login or /register
  if (route.type === 'login' || route.type === 'register') {
    return (
      <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col relative selection:bg-purple-600 selection:text-white">
        <Suspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Loading Secure Portal...</p>
            </div>
          }
        >
          <AuthGate
            initialMode={route.type === 'register' ? 'register' : 'signin'}
            onSuccess={() => {
              addToast('Authenticated successfully!', 'success');
              navigate('/');
            }}
          />
        </Suspense>
        <Toast toasts={toasts} onCloseToast={removeToast} />
      </div>
    );
  }

  // Unified tab navigation helper
  const handleNavigateTab = (tab: PageTab) => {
    if (tab === 'home') navigate('/');
    else if (tab === 'play-games') navigate('/play-games');
    else if (tab === 'vault-ai') navigate('/tools/vault-ai');
    else if (tab === 'game-avatar-generator') navigate('/game-avatar-generator');
    else if (tab === 'pc-requirements') navigate('/tools/pc-game-requirements-checker');
    else if (tab === 'fps-calculator') navigate('/tools/fps-calculator');
    else if (tab === 'gaming-username-generator') navigate('/tools/gaming-username-generator');
    else if (tab === 'gaming-pc-builder') navigate('/tools/gaming-pc-builder');
    else if (tab === 'game-picker-wheel') navigate('/game-picker-wheel');
    else if (tab === 'tools') navigate('/tools');
    else if (tab === 'sitemap') navigate('/sitemap');
    else navigate(`/${tab}`);
  };

  // Render content depending on route
  const renderCurrentPage = () => {
    switch (route.type) {
      // 1. Dedicated Article Page View with Unique SEO URL
      case 'article': {
        const article = findItemBySlugOrId(MOCK_ARTICLES, route.id);
        if (!article) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Article Not Found</h2>
              <p className="text-sm text-gray-400">The requested article could not be located in the vault.</p>
              <button
                onClick={() => navigate('/articles')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider rounded-xl"
              >
                Back to Articles
              </button>
            </div>
          );
        }

        const articleSlug = getSeoSlug(article);
        const isLiked = isItemLiked(article.id);
        const likeCount = getLikeCount(article.id, 0);
        const isBookmarked = user.bookmarks.articles.includes(article.id);
        const articleComments = commentsMap[article.id] || [];

        return (
          <ArticlePageView
            article={article}
            articles={MOCK_ARTICLES}
            onSelectArticle={(a) => navigate(`/articles/${getSeoSlug(a)}`)}
            isLiked={isLiked}
            likeCount={likeCount}
            isBookmarked={isBookmarked}
            onToggleLike={() => handleToggleLike(article.id, article.title, 0)}
            onToggleBookmark={() => handleToggleBookmark('articles', article.id, article.title)}
            onShare={() => handleShare(article.title, `/articles/${articleSlug}`)}
            comments={articleComments}
            onAddComment={(text, options) => handleAddPostComment(article.id, text, { ...options, postTitle: article.title })}
            onToggleCommentLike={handleToggleCommentLike}
            isCommentLiked={isItemLiked}
            getCommentLikeCount={(cId) => getLikeCount(cId, 0)}
            currentUser={user}
            isSignedIn={!!firebaseUser}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to like and comment on Game Vault articles.');
              setIsAuthModalOpen(true);
            }}
            onBack={() => navigate('/articles')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onViewUserProfile={handleViewUserProfile}
          />
        );
      }

      // 2. Dedicated Video Page View with Unique SEO URL
      case 'video': {
        const video = findItemBySlugOrId(MOCK_VIDEOS, route.id);
        if (!video) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Video Briefing Not Found</h2>
              <p className="text-sm text-gray-400">The requested tactical video could not be located in the vault archive.</p>
              <button
                onClick={() => navigate('/videos')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider rounded-xl"
              >
                Back to Videos
              </button>
            </div>
          );
        }

        const videoSlug = getSeoSlug(video);
        const isLiked = isItemLiked(video.id);
        const likeCount = getLikeCount(video.id, 0);
        const isBookmarked = user.bookmarks.videos.includes(video.id);
        const videoComments = commentsMap[video.id] || [];

        return (
          <VideoPageView
            video={video}
            isLiked={isLiked}
            likeCount={likeCount}
            isBookmarked={isBookmarked}
            onToggleLike={() => handleToggleLike(video.id, video.title, 0)}
            onToggleBookmark={() => handleToggleBookmark('videos', video.id, video.title)}
            onShare={() => handleShare(video.title, `/videos/${videoSlug}`)}
            comments={videoComments}
            onAddComment={(text, options) => handleAddPostComment(video.id, text, { ...options, postTitle: video.title })}
            onToggleCommentLike={handleToggleCommentLike}
            isCommentLiked={isItemLiked}
            getCommentLikeCount={(cId) => getLikeCount(cId, 0)}
            currentUser={user}
            isSignedIn={!!firebaseUser}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to like and discuss Game Vault video briefings.');
              setIsAuthModalOpen(true);
            }}
            onBack={() => navigate('/videos')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onViewUserProfile={handleViewUserProfile}
          />
        );
      }

      // 3. Dedicated Game Page View with Unique SEO URL
      case 'game': {
        const game = findItemBySlugOrId(MOCK_GAMES, route.id);
        if (!game) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Game Dossier Not Found</h2>
              <p className="text-sm text-gray-400">The requested game file could not be found in the vault catalog.</p>
              <button
                onClick={() => navigate('/games')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider rounded-xl"
              >
                Back to Games
              </button>
            </div>
          );
        }

        const gameSlug = getSeoSlug(game);
        const isBookmarked = user.bookmarks.games.includes(game.id);

        return (
          <GamePageView
            game={game}
            allGames={MOCK_GAMES}
            allGuides={MOCK_GUIDES}
            allVideos={MOCK_VIDEOS}
            allReviews={MOCK_REVIEWS}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => handleToggleBookmark('games', game.id, game.title)}
            onShare={() => handleShare(game.title, `/games/${gameSlug}`)}
            onFilterForumByGame={() => navigate('/forum')}
            onSelectGame={(g) => navigate(`/games/${getSeoSlug(g)}`)}
            onSelectGuide={(gd) => navigate(`/guides/${getSeoSlug(gd)}`)}
            onSelectVideo={(v) => navigate(`/videos/${getSeoSlug(v)}`)}
            onBack={() => navigate('/games')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
          />
        );
      }

      // 4. Dedicated Review Page View with Unique SEO URL
      case 'review': {
        const review = findItemBySlugOrId(
          MOCK_REVIEWS.map((r) => ({ ...r, title: `${r.gameTitle} review` })),
          route.id
        );
        if (!review) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Review Not Found</h2>
              <p className="text-sm text-gray-400">The requested game review could not be located.</p>
              <button
                onClick={() => navigate('/reviews')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider rounded-xl"
              >
                Back to Reviews
              </button>
            </div>
          );
        }

        const reviewSlug = getSeoSlug({ id: review.id, title: `${review.gameTitle} review` });
        const isBookmarked = user.bookmarks.reviews.includes(review.id);

        return (
          <ReviewPageView
            review={review}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => handleToggleBookmark('reviews', review.id, review.gameTitle)}
            onShare={() => handleShare(review.gameTitle, `/reviews/${reviewSlug}`)}
            onBack={() => navigate('/reviews')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onViewUserProfile={handleViewUserProfile}
          />
        );
      }

      // 5. Dedicated Guide Page View with Unique SEO URL
      case 'guide': {
        const guide = findItemBySlugOrId(MOCK_GUIDES, route.id);
        if (!guide) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Guide Not Found</h2>
              <p className="text-sm text-gray-400">The requested tactical guide could not be located.</p>
              <button
                onClick={() => navigate('/guides')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider rounded-xl"
              >
                Back to Guides
              </button>
            </div>
          );
        }

        const guideSlug = getSeoSlug(guide);
        const isBookmarked = user.bookmarks.guides.includes(guide.id);

        return (
          <GuidePageView
            guide={guide}
            allGuides={MOCK_GUIDES}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => handleToggleBookmark('guides', guide.id, guide.title)}
            onShare={() => handleShare(guide.title, `/guides/${guideSlug}`)}
            onSelectGuide={(g) => navigate(`/guides/${getSeoSlug(g)}`)}
            onFilterForumByGame={() => navigate('/forum')}
            onBack={() => navigate('/guides')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onViewUserProfile={handleViewUserProfile}
          />
        );
      }

      // 6. Dedicated Forum Topic Discussion Page View with Unique SEO URL
      case 'topic': {
        const topic = findItemBySlugOrId(topics, route.id);
        if (!topic) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Discussion Topic Not Found</h2>
              <p className="text-sm text-gray-400">The requested forum thread could not be located.</p>
              <button
                onClick={() => navigate('/forum')}
                className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold font-['Rajdhani'] uppercase tracking-wider rounded-xl"
              >
                Back to Forum
              </button>
            </div>
          );
        }

        const topicSlug = getSeoSlug(topic);
        const isTopicLiked = isItemLiked(topic.id);
        const topicLikeCount = getLikeCount(topic.id, 0);

        return (
          <TopicPageView
            topic={topic}
            isTopicLiked={isTopicLiked}
            topicLikeCount={topicLikeCount}
            onToggleTopicLike={() => handleToggleLike(topic.id, topic.title, 0)}
            isReplyLiked={isItemLiked}
            getReplyLikeCount={(replyId) => getLikeCount(replyId, 0)}
            onToggleReplyLike={(replyId) => handleToggleLike(replyId, 'Reply', 0)}
            onAddReply={(replyText, options) => handleAddReply(topic.id, replyText, options)}
            currentUser={user}
            isSignedIn={!!firebaseUser}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to like posts and participate in forum discussions.');
              setIsAuthModalOpen(true);
            }}
            onShare={() => handleShare(topic.title, `/forum/${topicSlug}`)}
            onBack={() => navigate('/forum')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onViewUserProfile={handleViewUserProfile}
          />
        );
      }

      // 7. Dedicated New Topic Creation Page View with Unique URL
      case 'new-topic': {
        return (
          <NewTopicPageView
            currentUser={user}
            isSignedIn={!!firebaseUser}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to initiate new forum discussions.');
              setIsAuthModalOpen(true);
            }}
            onCreateTopic={handleCreateTopic}
            onBack={() => navigate('/forum')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
          />
        );
      }

      // 8. Guidelines Page View with Unique URL
      case 'guidelines': {
        return (
          <GuidelinesPageView
            onBack={() => navigate('/forum')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onNavigateLegal={(page) => navigate(page === 'guidelines' ? '/guidelines' : `/${page}`)}
          />
        );
      }

      // 9. Privacy Policy Page View with Unique URL
      case 'privacy': {
        return (
          <PrivacyPolicyView
            onBack={() => navigate('/')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onNavigateLegal={(page) => navigate(page === 'guidelines' ? '/guidelines' : `/${page}`)}
          />
        );
      }

      // 10. Terms of Service Page View with Unique URL
      case 'terms': {
        return (
          <TermsOfServiceView
            onBack={() => navigate('/')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onNavigateLegal={(page) => navigate(page === 'guidelines' ? '/guidelines' : `/${page}`)}
          />
        );
      }

      // 11. Cookie Policy Page View with Unique URL
      case 'cookies': {
        return (
          <CookiePolicyView
            onBack={() => navigate('/')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onNavigateLegal={(page) => navigate(page === 'guidelines' ? '/guidelines' : `/${page}`)}
          />
        );
      }

      // 12. Contact Us & Editorial Desk View with Unique URL
      case 'contact': {
        return (
          <ContactPageView
            onBack={() => navigate('/')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
            onNavigateLegal={(page) => navigate(page === 'guidelines' ? '/guidelines' : `/${page}`)}
            onShowToast={(msg, type) => addToast(msg, type)}
          />
        );
      }

      // 13. Online Gaming Section (/play-games, /play-games/:category, /play-games/:category/:game)
      case 'play-games':
      case 'play-games-category':
      case 'play-game':
        return (
          <GamingSectionView
            route={route}
            onNavigate={navigate}
            currentUser={firebaseUser}
            userAccount={user}
            onOpenSignIn={(promptMessage) => {
              setAuthPromptMessage(promptMessage || 'Sign in or register to duel players and save gaming stats.');
              setIsAuthModalOpen(true);
            }}
            onShowToast={(msg, type) => addToast(msg, type)}
          />
        );

      // 14. Standard Hub Views with Unique SEO URLs
      case 'videos':
        return (
          <VideosView
            videos={MOCK_VIDEOS}
            initialCategory={route.category}
            onSelectVideo={(v) => navigate(`/videos/${getSeoSlug(v)}`)}
          />
        );

      case 'games':
        return (
          <GamesView
            games={MOCK_GAMES}
            initialGenre={route.genre}
            onSelectGame={(g) => navigate(`/games/${getSeoSlug(g)}`)}
          />
        );

      case 'articles':
        return (
          <ArticlesView
            articles={MOCK_ARTICLES}
            initialCategory={route.category}
            onSelectArticle={(a) => navigate(`/articles/${getSeoSlug(a)}`)}
          />
        );

      case 'reviews':
        return (
          <ReviewsView
            reviews={MOCK_REVIEWS}
            onSelectReview={(r) => navigate(`/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}`)}
          />
        );

      case 'guides':
        return (
          <GuidesView
            guides={MOCK_GUIDES}
            initialCategory={route.category}
            onSelectGuide={(g) => navigate(`/guides/${getSeoSlug(g)}`)}
          />
        );

      case 'forum':
        return (
          <ForumView
            topics={topics}
            initialCategory={route.category}
            onSelectTopic={(t) => navigate(`/forum/${getSeoSlug(t)}`)}
            onOpenNewTopic={() => navigate('/forum/new')}
            onOpenGuidelines={() => navigate('/guidelines')}
            onViewUserProfile={handleViewUserProfile}
          />
        );

      case 'author':
        return (
          <AuthorPageView
            authorSlug={route.slug || 'joel-ayuba'}
            onBack={() => navigate('/articles')}
            onSelectArticle={(a) => navigate(`/articles/${getSeoSlug(a)}`)}
            onNavigateTab={handleNavigateTab}
            onShare={handleShare}
          />
        );

      case 'about':
        return (
          <AboutView
            onNavigateTab={(tab) => navigate(tab === 'home' ? '/' : tab === 'pc-requirements' ? '/tools/pc-game-requirements-checker' : `/${tab}`)}
          />
        );

      case 'pc-requirements':
        return (
          <PcRequirementsView
            initialGameSlug={route.gameSlug}
            currentUser={user}
            isSignedIn={Boolean(firebaseUser)}
            onOpenSignIn={() => {
              setAuthPromptMessage('Only registered and signed in users can save custom PC configurations. Sign in or register to join!');
              setIsAuthModalOpen(true);
            }}
            onNavigateTab={(tab) => navigate(tab === 'home' ? '/' : tab === 'pc-requirements' ? '/tools/pc-game-requirements-checker' : `/${tab}`)}
            onOpenVideo={(gameTitle) => {
              const matched = MOCK_VIDEOS.find((v) => v.game.toLowerCase() === gameTitle.toLowerCase()) || MOCK_VIDEOS[0];
              navigate(`/videos/${getSeoSlug(matched)}`);
            }}
            onOpenArticle={(gameTitle) => {
              const matched = MOCK_ARTICLES.find(
                (a) => a.title.toLowerCase().includes(gameTitle.toLowerCase()) ||
                       a.tags.some((t) => t.toLowerCase().includes(gameTitle.toLowerCase()))
              ) || MOCK_ARTICLES[0];
              navigate(`/articles/${getSeoSlug(matched)}`);
            }}
            onOpenForum={() => {
              navigate('/forum');
            }}
          />
        );

      case 'fps-calculator':
        return (
          <FpsCalculatorView
            initialGameSlug={route.gameSlug}
            currentUser={user}
            isSignedIn={Boolean(firebaseUser)}
            onOpenSignIn={() => {
              setAuthPromptMessage('Only registered and signed-in members can save custom hardware configurations to the cloud. Sign in or register to get started!');
              setIsAuthModalOpen(true);
            }}
            onNavigateTab={handleNavigateTab}
            onShowToast={(msg, type) => addToast(msg, type)}
            onShare={handleShare}
          />
        );

      case 'tools':
        return <ToolsHubView onNavigateTab={handleNavigateTab} />;

      case 'game-avatar-generator':
        return (
          <AvatarGeneratorView
            onNavigate={(tab, path) => navigate(path || (tab === 'home' ? '/' : `/${tab}`))}
            currentUser={firebaseUser}
            onOpenSignIn={() => {
              setAuthPromptMessage('Only registered and signed in users can save generated avatars to their profile. Please sign in or register below!');
              setIsAuthModalOpen(true);
            }}
          />
        );

      case 'gaming-username-generator':
        return (
          <UsernameGeneratorView
            currentUser={user}
            onNavigateTab={handleNavigateTab}
            onShowToast={(msg, type) => addToast(msg, type)}
          />
        );

      case 'gaming-pc-builder':
        return (
          <PcBuilderView
            currentUser={user}
            initialBuildId={route.buildId}
            isSignedIn={Boolean(firebaseUser)}
            onOpenSignIn={() => {
              setAuthPromptMessage('Only registered and signed in users can save custom PC builds. Sign in or register to join!');
              setIsAuthModalOpen(true);
            }}
            onNavigateTab={handleNavigateTab}
            onShowToast={(msg, type) => addToast(msg, type)}
            onShare={handleShare}
          />
        );

      case 'vault-ai':
        return (
          <VaultAiView
            onNavigateTab={handleNavigateTab}
            user={user}
            isSignedIn={Boolean(firebaseUser)}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to save conversations and get unlimited queries.');
              setIsAuthModalOpen(true);
            }}
            initialPrompt={route.type === 'vault-ai' ? route.initialPrompt : undefined}
          />
        );

      case 'game-picker-wheel':
        return (
          <GamePickerWheelView
            currentUser={user}
            isSignedIn={Boolean(firebaseUser)}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to save your custom wheels to the cloud.');
              setIsAuthModalOpen(true);
            }}
            onNavigateTab={handleNavigateTab}
            onShowToast={(msg, type) => addToast(msg, type === 'error' ? 'info' : type)}
            initialSharedGames={route.type === 'game-picker-wheel' ? route.games : undefined}
          />
        );

      case 'sitemap':
        return <SitemapView onNavigate={navigate} />;

      case 'profile':
      case 'home':
      default:
        return (
          <HomeView
            videos={MOCK_VIDEOS}
            games={MOCK_GAMES}
            articles={MOCK_ARTICLES}
            reviews={MOCK_REVIEWS}
            guides={MOCK_GUIDES}
            topics={topics}
            onSelectVideo={(v) => navigate(`/videos/${getSeoSlug(v)}`)}
            onSelectGame={(g) => navigate(`/games/${getSeoSlug(g)}`)}
            onSelectArticle={(a) => navigate(`/articles/${getSeoSlug(a)}`)}
            onSelectReview={(r) => navigate(`/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}`)}
            onSelectGuide={(g) => navigate(`/guides/${getSeoSlug(g)}`)}
            onSelectTopic={(t) => navigate(`/forum/${getSeoSlug(t)}`)}
            onNavigateTab={handleNavigateTab}
            onOpenNewTopic={() => navigate('/forum/new')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col selection:bg-purple-600 selection:text-white font-['Inter'] relative">
      {/* Frosted Glass Ambient Atmospheric Lighting - Contained in fixed viewport layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] lg:w-[45%] h-[500px] lg:h-[45%] bg-purple-900/30 blur-[130px] rounded-full animate-vault-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] lg:w-[45%] h-[500px] lg:h-[45%] bg-blue-900/20 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] right-[15%] w-[350px] lg:w-[30%] h-[350px] lg:h-[30%] bg-purple-950/20 blur-[140px] rounded-full" />
      </div>

      {/* Sticky Vault Header */}
      <Header
        currentTab={getActiveTab()}
        onSelectTab={handleNavigateTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => {
          setProfileInitialTab('profile');
          setIsProfileOpen(true);
        }}
        user={user}
        isSignedIn={!!firebaseUser}
        onOpenSignIn={() => {
          setAuthPromptMessage('Sign in or register to like and comment on Game Vault.');
          setIsAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* Main Routed Content Area with horizontal overflow containment */}
      <main className="flex-1 w-full overflow-x-clip">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 animate-pulse">
                Accessing Vault Data...
              </p>
            </div>
          }
        >
          {renderCurrentPage()}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleNavigateTab}
        onSubscribeNewsletter={handleSubscribeNewsletter}
        onOpenGuidelines={() => navigate('/guidelines')}
        onOpenPrivacy={() => navigate('/privacy')}
        onOpenTerms={() => navigate('/terms')}
        onOpenCookies={() => navigate('/cookies')}
        onOpenContact={() => navigate('/contact')}
        onOpenSitemap={() => navigate('/sitemap')}
      />

      {/* Global Search Modal */}
      <Suspense fallback={null}>
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          videos={MOCK_VIDEOS}
          games={MOCK_GAMES}
          articles={MOCK_ARTICLES}
          reviews={MOCK_REVIEWS}
          guides={MOCK_GUIDES}
          topics={topics}
          onSelectVideo={(v) => {
            setIsSearchOpen(false);
            navigate(`/videos/${getSeoSlug(v)}`);
          }}
          onSelectGame={(g) => {
            setIsSearchOpen(false);
            navigate(`/games/${getSeoSlug(g)}`);
          }}
          onSelectArticle={(a) => {
            setIsSearchOpen(false);
            navigate(`/articles/${getSeoSlug(a)}`);
          }}
          onSelectReview={(r) => {
            setIsSearchOpen(false);
            navigate(`/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}`);
          }}
          onSelectGuide={(g) => {
            setIsSearchOpen(false);
            navigate(`/guides/${getSeoSlug(g)}`);
          }}
          onSelectTopic={(t) => {
            setIsSearchOpen(false);
            navigate(`/forum/${getSeoSlug(t)}`);
          }}
        />
      </Suspense>

      {/* Community Profile & Bookmarks Modal */}
      <Suspense fallback={null}>
        <AuthProfileModal
          isOpen={isProfileOpen || route.type === 'profile'}
          onClose={() => {
            setIsProfileOpen(false);
            if (route.type === 'profile') {
              navigate('/');
            }
          }}
          user={user}
          videos={MOCK_VIDEOS}
          games={MOCK_GAMES}
          articles={MOCK_ARTICLES}
          reviews={MOCK_REVIEWS}
          guides={MOCK_GUIDES}
          onSelectVideo={(v) => {
            setIsProfileOpen(false);
            navigate(`/videos/${getSeoSlug(v)}`);
          }}
          onSelectGame={(g) => {
            setIsProfileOpen(false);
            navigate(`/games/${getSeoSlug(g)}`);
          }}
          onSelectArticle={(a) => {
            setIsProfileOpen(false);
            navigate(`/articles/${getSeoSlug(a)}`);
          }}
          onSelectReview={(r) => {
            setIsProfileOpen(false);
            navigate(`/reviews/${getSeoSlug({ id: r.id, title: `${r.gameTitle} review` })}`);
          }}
          onSelectGuide={(g) => {
            setIsProfileOpen(false);
            navigate(`/guides/${getSeoSlug(g)}`);
          }}
          onSignOut={handleSignOut}
          onUpdateProfile={handleUpdateProfile}
          initialTab={profileInitialTab}
          onNavigateToAvatarGenerator={() => {
            setIsProfileOpen(false);
            navigate('/game-avatar-generator');
          }}
        />
      </Suspense>

      {/* Auth Modal: Prompted when guest attempts to like/comment, or after 60s timed visitor prompt */}
      {isAuthModalOpen && (
        <Suspense fallback={null}>
          <AuthGate
            isModal={true}
            promptMessage={authPromptMessage}
            onClose={handleCloseAuthModal}
            onSuccess={() => {
              setIsAuthModalOpen(false);
              sessionStorage.setItem('gv_auth_popup_closed', 'true');
              addToast('Authentication verified! Welcome to the Vault.', 'success');
            }}
          />
        </Suspense>
      )}

      {/* Timed Email Subscription Popup: Displays after ~10 seconds for visitors */}
      <Suspense fallback={null}>
        <EmailSubscribeModal
          isOpen={isSubscribeModalOpen}
          onClose={handleCloseSubscribeModal}
          onSubscribed={handleNewsletterSubscribed}
        />
      </Suspense>

      {/* Share Modal: Standard social network sharing & copy link modal */}
      <Suspense fallback={null}>
        <ShareModal
          isOpen={shareState.isOpen}
          onClose={() => setShareState((prev) => ({ ...prev, isOpen: false }))}
          title={shareState.title}
          url={shareState.url}
          description={shareState.description}
          onCopiedToast={(msg) => addToast(msg, 'success')}
        />
      </Suspense>

      {/* Public User Profile Modal (Dossier Popup when any visitor/user clicks an author/user profile) */}
      <Suspense fallback={null}>
        <PublicUserProfileModal
          isOpen={publicProfileModal.isOpen}
          onClose={() => setPublicProfileModal({ isOpen: false, profile: null })}
          profile={publicProfileModal.profile}
        />
      </Suspense>

      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onCloseToast={removeToast} />

      {/* GDPR / CCPA / Google EU User Consent Cookie Banner */}
      <CookieConsentBanner
        onOpenCookiePolicy={() => navigate('/cookies')}
        onOpenPrivacyPolicy={() => navigate('/privacy')}
      />

      {/* Persistent Floating Vault AI Button */}
      <VaultAiFloatingButton
        currentTab={getActiveTab()}
        user={user}
        isSignedIn={Boolean(firebaseUser)}
        onOpenSignIn={() => {
          setAuthPromptMessage('Sign in or register to get unlimited queries and unlock full community perks.');
          setIsAuthModalOpen(true);
        }}
        activeGameTitle={
          route.type === 'game' 
            ? findItemBySlugOrId(MOCK_GAMES, route.id || route.slug)?.title 
            : undefined
        }
        onNavigateToVaultAi={() => navigate('/tools/vault-ai')}
      />
    </div>
  );
}
