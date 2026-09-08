import React, { useState, useEffect } from 'react';
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

// Router
import { useRouter, routeToUrl, Route } from './lib/router';
import { getSeoSlug, findItemBySlugOrId, updatePageSeo } from './lib/seo';

// UI Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthProfileModal } from './components/AuthProfileModal';
import { AuthGate } from './components/AuthGate';

// Views
import { HomeView } from './views/HomeView';
import { VideosView } from './views/VideosView';
import { GamesView } from './views/GamesView';
import { ArticlesView } from './views/ArticlesView';
import { ReviewsView } from './views/ReviewsView';
import { GuidesView } from './views/GuidesView';
import { ForumView } from './views/ForumView';
import { AboutView } from './views/AboutView';

// Dedicated Page Views with Unique URLs
import { ArticlePageView } from './views/ArticlePageView';
import { VideoPageView } from './views/VideoPageView';
import { GamePageView } from './views/GamePageView';
import { ReviewPageView } from './views/ReviewPageView';
import { GuidePageView } from './views/GuidePageView';
import { TopicPageView } from './views/TopicPageView';
import { NewTopicPageView } from './views/NewTopicPageView';
import { GuidelinesPageView } from './views/GuidelinesPageView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsOfServiceView } from './views/TermsOfServiceView';
import { CookiePolicyView } from './views/CookiePolicyView';
import { ContactPageView } from './views/ContactPageView';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AdBanner } from './components/AdBanner';

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
  saveNewsletterSubscriber 
} from './lib/firebase';

export default function App() {
  const { route, path, navigate } = useRouter();

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth Modal State (pops up when guest attempts to like or comment)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string>('');

  // Interactive Content Lists with Persistence
  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('gv_forum_topics_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved forum topics', e);
      }
    }
    return MOCK_FORUM_TOPICS;
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

  // Set of post IDs liked by the current user
  const [userLikedSet, setUserLikedSet] = useState<Set<string>>(new Set());

  // Comments Map for Articles & Videos: itemId -> PostComment[] (starts empty, only user action comments)
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>(() => {
    const saved = localStorage.getItem('gv_post_comments_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse comments map', e);
      }
    }
    return {};
  });

  // Modals & UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'guidelines'>('profile');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
        setUserLikedSet(new Set());
      }
    });

    return () => unsubscribe();
  }, []);

  // Persist topics, user, likes, comments
  useEffect(() => {
    localStorage.setItem('gv_forum_topics_v2', JSON.stringify(topics));
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

  // Toast Helpers
  const addToast = (text: string, type: 'success' | 'info' = 'info') => {
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

  // Helper to check if current user liked item
  const isItemLiked = (itemId: string): boolean => {
    if (!firebaseUser) return false;
    return userLikedSet.has(itemId);
  };

  // Like Toggle Handler: Restricts likes to registered & signed in users only!
  const handleToggleLike = (itemId: string, itemTitle?: string, defaultBase: number = 0) => {
    if (!firebaseUser) {
      setAuthPromptMessage('Only registered and signed in users can like a post. Sign in or register to join!');
      setIsAuthModalOpen(true);
      return;
    }

    const alreadyLiked = userLikedSet.has(itemId);
    const currentCount = getLikeCount(itemId, defaultBase);
    const newCount = alreadyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    // Update global like count
    setLikesMap((prev) => {
      const updated = { ...prev, [itemId]: newCount };
      localStorage.setItem('gv_post_likes_v2', JSON.stringify(updated));
      return updated;
    });

    // Update user liked set
    setUserLikedSet((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      localStorage.setItem(`gv_user_liked_${firebaseUser.uid}`, JSON.stringify(Array.from(next)));
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

      if (firebaseUser) {
        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
      }
      return updatedUser;
    });

    // Synchronize like to Firebase Firestore backend
    syncLikeToFirestore(itemId, newCount, firebaseUser.uid, !alreadyLiked);

    if (alreadyLiked) {
      addToast(itemTitle ? `Unliked "${itemTitle}".` : 'Unliked post.', 'info');
    } else {
      addToast(itemTitle ? `Liked "${itemTitle}"!` : 'Liked post!', 'success');
    }
  };

  // Comment Handlers for Articles & Videos: Restricts commenting to registered & signed in users!
  const handleAddPostComment = (postId: string, content: string, postTitle?: string) => {
    if (!firebaseUser) {
      setAuthPromptMessage('Only registered and signed in users can comment on a post. Sign in or register to join!');
      setIsAuthModalOpen(true);
      return;
    }

    const newComment: PostComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: {
        name: user.name,
        avatar: user.avatar,
        badge: user.badge
      },
      content,
      timestamp: 'Just now',
      likes: 0
    };

    setCommentsMap((prev) => {
      const existing = prev[postId] || [];
      const updated = { ...prev, [postId]: [newComment, ...existing] };
      localStorage.setItem('gv_post_comments_v2', JSON.stringify(updated));
      return updated;
    });

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

      if (firebaseUser) {
        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
      }
      return updatedUser;
    });

    // Synchronize comment to Firebase Firestore backend
    saveCommentToFirestore(postId, newComment);

    addToast(postTitle ? `Published comment on "${postTitle}"!` : 'Comment published!', 'success');
  };

  // Comment Like Handler: Restricts comment likes to registered & signed in users!
  const handleToggleCommentLike = (commentId: string) => {
    if (!firebaseUser) {
      setAuthPromptMessage('Only registered and signed in users can like comments. Sign in or register to join!');
      setIsAuthModalOpen(true);
      return;
    }

    handleToggleLike(commentId, 'Comment', 0);
  };

  // Bookmark Toggle
  const handleToggleBookmark = (
    type: 'videos' | 'games' | 'articles' | 'reviews' | 'guides',
    id: string,
    itemName: string
  ) => {
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

  // Share Handler (copies unique URL to clipboard)
  const handleShare = (title: string, customPath?: string) => {
    const fullUrl = customPath
      ? `${window.location.origin}${customPath}`
      : window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      addToast(`Copied unique link for "${title}" to clipboard!`, 'success');
    } else {
      addToast(`Shared "${title}"!`, 'info');
    }
  };

  // Forum Reply Handler: Restricts replies to registered & signed in users!
  const handleAddReply = (topicId: string, replyText: string) => {
    if (!firebaseUser) {
      setAuthPromptMessage('Only registered and signed in users can participate in discussions. Sign in or register to join!');
      setIsAuthModalOpen(true);
      return;
    }

    const newReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: {
        name: user.name,
        avatar: user.avatar,
        badge: user.badge
      },
      content: replyText,
      timestamp: 'Just now',
      likes: 0
    };

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const updatedTopic = {
            ...t,
            repliesCount: t.repliesCount + 1,
            lastActivity: 'Just now',
            replies: [...t.replies, newReply]
          };
          // Persist updated topic thread to Firestore
          saveTopicToFirestore(updatedTopic);
          return updatedTopic;
        }
        return t;
      })
    );

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

      if (firebaseUser) {
        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
      }
      return updatedUser;
    });

    addToast('Your response has been published to the discussion!', 'success');
  };

  // Create Forum Topic: Restricts topic creation to registered & signed in users!
  const handleCreateTopic = (newTopicData: Partial<ForumTopic>) => {
    if (!firebaseUser) {
      setAuthPromptMessage('Only registered and signed in users can create discussion topics. Sign in or register to participate!');
      setIsAuthModalOpen(true);
      return;
    }

    const newId = `topic-${Date.now()}`;
    const fullTopic: ForumTopic = {
      id: newId,
      title: newTopicData.title || 'Untitled Discussion',
      category: newTopicData.category || 'General Gaming',
      tags: newTopicData.tags || ['Discussion'],
      author: newTopicData.author || {
        name: user.name,
        avatar: user.avatar,
        badge: user.badge
      },
      repliesCount: 0,
      views: 1,
      lastActivity: 'Just now',
      timestamp: 'Just now',
      isPinned: false,
      initialPost: newTopicData.initialPost || '',
      replies: [],
      likes: 0
    };

    setTopics((prev) => [fullTopic, ...prev]);
    // Persist new topic to Firebase Firestore backend
    saveTopicToFirestore(fullTopic);

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

      if (firebaseUser) {
        updateUserInFirestore(firebaseUser.uid, {
          stats: updatedStats,
          reputation: updatedReputation
        });
      }
      return updatedUser;
    });

    addToast(`Discussion "${fullTopic.title}" opened in ${fullTopic.category}!`, 'success');
    navigate(`/forum/${getSeoSlug(fullTopic)}`);
  };

  const handleSubscribeNewsletter = (email: string) => {
    saveNewsletterSubscriber(email);
    addToast(`Access granted! ${email} has been registered to the Vault Dispatch.`, 'success');
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
      case 'about':
        return 'about';
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
        <AuthGate
          initialMode={route.type === 'register' ? 'register' : 'signin'}
          onSuccess={() => {
            addToast('Authenticated successfully!', 'success');
            navigate('/');
          }}
        />
        <Toast toasts={toasts} onCloseToast={removeToast} />
      </div>
    );
  }

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
            onAddComment={(text) => handleAddPostComment(article.id, text, article.title)}
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
            onAddComment={(text) => handleAddPostComment(video.id, text, video.title)}
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
            onAddReply={(replyText) => handleAddReply(topic.id, replyText)}
            currentUser={user}
            isSignedIn={!!firebaseUser}
            onOpenSignIn={() => {
              setAuthPromptMessage('Sign in or register to like posts and participate in forum discussions.');
              setIsAuthModalOpen(true);
            }}
            onShare={() => handleShare(topic.title, `/forum/${topicSlug}`)}
            onBack={() => navigate('/forum')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
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

      // 12. Standard Hub Views with Unique SEO URLs
      case 'videos':
        return (
          <VideosView
            videos={MOCK_VIDEOS}
            onSelectVideo={(v) => navigate(`/videos/${getSeoSlug(v)}`)}
          />
        );

      case 'games':
        return (
          <GamesView
            games={MOCK_GAMES}
            onSelectGame={(g) => navigate(`/games/${getSeoSlug(g)}`)}
          />
        );

      case 'articles':
        return (
          <ArticlesView
            articles={MOCK_ARTICLES}
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
            onSelectGuide={(g) => navigate(`/guides/${getSeoSlug(g)}`)}
          />
        );

      case 'forum':
        return (
          <ForumView
            topics={topics}
            onSelectTopic={(t) => navigate(`/forum/${getSeoSlug(t)}`)}
            onOpenNewTopic={() => navigate('/forum/new')}
            onOpenGuidelines={() => navigate('/guidelines')}
          />
        );

      case 'about':
        return (
          <AboutView
            onNavigateTab={(tab) => navigate(tab === 'home' ? '/' : `/${tab}`)}
          />
        );

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
            onNavigateTab={(tab) => navigate(tab === 'home' ? '/' : `/${tab}`)}
            onOpenNewTopic={() => navigate('/forum/new')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col selection:bg-purple-600 selection:text-white font-['Inter'] relative overflow-x-hidden">
      {/* Frosted Glass Ambient Atmospheric Lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] lg:w-[45%] h-[500px] lg:h-[45%] bg-purple-900/30 blur-[130px] rounded-full pointer-events-none -z-10 animate-vault-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] lg:w-[45%] h-[500px] lg:h-[45%] bg-blue-900/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[15%] w-[350px] lg:w-[30%] h-[350px] lg:h-[30%] bg-purple-950/20 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Sticky Vault Header */}
      <Header
        currentTab={getActiveTab()}
        onSelectTab={(tab) => navigate(tab === 'home' ? '/' : `/${tab}`)}
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

      {/* Main Routed Content Area */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => navigate(tab === 'home' ? '/' : `/${tab}`)}
        onSubscribeNewsletter={handleSubscribeNewsletter}
        onOpenGuidelines={() => navigate('/guidelines')}
        onOpenPrivacy={() => navigate('/privacy')}
        onOpenTerms={() => navigate('/terms')}
        onOpenCookies={() => navigate('/cookies')}
        onOpenContact={() => navigate('/contact')}
      />

      {/* Global Search Modal */}
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

      {/* Community Profile & Bookmarks Modal */}
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
        initialTab={profileInitialTab}
      />

      {/* Auth Modal: Prompted when user attempts to comment or like without signing in */}
      {isAuthModalOpen && (
        <AuthGate
          isModal={true}
          promptMessage={authPromptMessage}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            addToast('Authentication verified! You can now like and comment.', 'success');
          }}
        />
      )}

      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onCloseToast={removeToast} />

      {/* GDPR / CCPA / Google EU User Consent Cookie Banner */}
      <CookieConsentBanner
        onOpenCookiePolicy={() => navigate('/cookies')}
        onOpenPrivacyPolicy={() => navigate('/privacy')}
      />
    </div>
  );
}
