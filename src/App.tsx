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

// Firebase Auth
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';

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

  // Comments Map for Articles & Videos: itemId -> PostComment[]
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>(() => {
    const saved = localStorage.getItem('gv_post_comments_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse comments map', e);
      }
    }
    return {
      'art-wows': [
        {
          id: 'c-init-1',
          author: {
            name: 'Cmdr_Vanguard',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            badge: 'Fleet Veteran'
          },
          content: 'This analysis captures the psychological pacing of high-tier engagements perfectly. The distinction between raw damage and map pressure is spot-on.',
          timestamp: '2 days ago',
          likes: 0
        }
      ],
      'vid-1': [
        {
          id: 'c-init-2',
          author: {
            name: 'TarnishedScholar',
            avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
            badge: 'Lore Archivist'
          },
          content: 'The architectural breakdowns of Belurat and Enir-Ilim give such clear insight into FromSoftware’s level design evolution.',
          timestamp: '3 days ago',
          likes: 0
        }
      ]
    };
  });

  // Modals & UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'guidelines'>('profile');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      const isPasswordUser = fbUser?.providerData.some((p) => p.providerId === 'password');
      if (fbUser && isPasswordUser && !fbUser.emailVerified) {
        setFirebaseUser(null);
        setAuthLoading(false);
        setUserLikedSet(new Set());
        return;
      }

      setFirebaseUser(fbUser);
      setAuthLoading(false);

      if (fbUser) {
        setUser((prev) => ({
          ...prev,
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Vault Operative',
          username: `@${(fbUser.displayName || fbUser.email?.split('@')[0] || 'operative').toLowerCase().replace(/\s+/g, '_')}`,
          email: fbUser.email || undefined,
          avatar: fbUser.photoURL || prev.avatar || DEFAULT_USER.avatar
        }));

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

      return {
        ...prev,
        bookmarks: {
          ...prev.bookmarks,
          [type]: updatedList
        }
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
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            lastActivity: 'Just now',
            replies: [...t.replies, newReply]
          };
        }
        return t;
      })
    );

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
    addToast(`Discussion "${fullTopic.title}" opened in ${fullTopic.category}!`, 'success');
    navigate(`/forum/${newId}`);
  };

  const handleSubscribeNewsletter = (email: string) => {
    addToast(`Access granted! ${email} has been registered to the Vault Dispatch.`, 'success');
  };

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
      // 1. Dedicated Article Page View with Unique URL
      case 'article': {
        const article = MOCK_ARTICLES.find((a) => a.id === route.id);
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

        const isLiked = isItemLiked(article.id);
        const likeCount = getLikeCount(article.id, 0);
        const isBookmarked = user.bookmarks.articles.includes(article.id);
        const articleComments = commentsMap[article.id] || [];

        return (
          <ArticlePageView
            article={article}
            isLiked={isLiked}
            likeCount={likeCount}
            isBookmarked={isBookmarked}
            onToggleLike={() => handleToggleLike(article.id, article.title, 0)}
            onToggleBookmark={() => handleToggleBookmark('articles', article.id, article.title)}
            onShare={() => handleShare(article.title, `/articles/${article.id}`)}
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

      // 2. Dedicated Video Page View with Unique URL
      case 'video': {
        const video = MOCK_VIDEOS.find((v) => v.id === route.id);
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
            onShare={() => handleShare(video.title, `/videos/${video.id}`)}
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

      // 3. Dedicated Game Page View with Unique URL
      case 'game': {
        const game = MOCK_GAMES.find((g) => g.id === route.id);
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

        const isBookmarked = user.bookmarks.games.includes(game.id);

        return (
          <GamePageView
            game={game}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => handleToggleBookmark('games', game.id, game.title)}
            onShare={() => handleShare(game.title, `/games/${game.id}`)}
            onFilterForumByGame={() => navigate('/forum')}
            onBack={() => navigate('/games')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
          />
        );
      }

      // 4. Dedicated Review Page View with Unique URL
      case 'review': {
        const review = MOCK_REVIEWS.find((r) => r.id === route.id);
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

        const isBookmarked = user.bookmarks.reviews.includes(review.id);

        return (
          <ReviewPageView
            review={review}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => handleToggleBookmark('reviews', review.id, review.gameTitle)}
            onShare={() => handleShare(review.gameTitle, `/reviews/${review.id}`)}
            onBack={() => navigate('/reviews')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
          />
        );
      }

      // 5. Dedicated Guide Page View with Unique URL
      case 'guide': {
        const guide = MOCK_GUIDES.find((g) => g.id === route.id);
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

        const isBookmarked = user.bookmarks.guides.includes(guide.id);

        return (
          <GuidePageView
            guide={guide}
            isBookmarked={isBookmarked}
            onToggleBookmark={() => handleToggleBookmark('guides', guide.id, guide.title)}
            onShare={() => handleShare(guide.title, `/guides/${guide.id}`)}
            onBack={() => navigate('/guides')}
            onNavigateTab={(t) => navigate(t === 'home' ? '/' : `/${t}`)}
          />
        );
      }

      // 6. Dedicated Forum Topic Discussion Page View with Unique URL
      case 'topic': {
        const topic = topics.find((t) => t.id === route.id);
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
            onShare={() => handleShare(topic.title, `/forum/${topic.id}`)}
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
          />
        );
      }

      // 9. Standard Hub Views with Unique URLs
      case 'videos':
        return (
          <VideosView
            videos={MOCK_VIDEOS}
            onSelectVideo={(v) => navigate(`/videos/${v.id}`)}
          />
        );

      case 'games':
        return (
          <GamesView
            games={MOCK_GAMES}
            onSelectGame={(g) => navigate(`/games/${g.id}`)}
          />
        );

      case 'articles':
        return (
          <ArticlesView
            articles={MOCK_ARTICLES}
            onSelectArticle={(a) => navigate(`/articles/${a.id}`)}
          />
        );

      case 'reviews':
        return (
          <ReviewsView
            reviews={MOCK_REVIEWS}
            onSelectReview={(r) => navigate(`/reviews/${r.id}`)}
          />
        );

      case 'guides':
        return (
          <GuidesView
            guides={MOCK_GUIDES}
            onSelectGuide={(g) => navigate(`/guides/${g.id}`)}
          />
        );

      case 'forum':
        return (
          <ForumView
            topics={topics}
            onSelectTopic={(t) => navigate(`/forum/${t.id}`)}
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
            onSelectVideo={(v) => navigate(`/videos/${v.id}`)}
            onSelectGame={(g) => navigate(`/games/${g.id}`)}
            onSelectArticle={(a) => navigate(`/articles/${a.id}`)}
            onSelectReview={(r) => navigate(`/reviews/${r.id}`)}
            onSelectGuide={(g) => navigate(`/guides/${g.id}`)}
            onSelectTopic={(t) => navigate(`/forum/${t.id}`)}
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
          navigate(`/videos/${v.id}`);
        }}
        onSelectGame={(g) => {
          setIsSearchOpen(false);
          navigate(`/games/${g.id}`);
        }}
        onSelectArticle={(a) => {
          setIsSearchOpen(false);
          navigate(`/articles/${a.id}`);
        }}
        onSelectReview={(r) => {
          setIsSearchOpen(false);
          navigate(`/reviews/${r.id}`);
        }}
        onSelectGuide={(g) => {
          setIsSearchOpen(false);
          navigate(`/guides/${g.id}`);
        }}
        onSelectTopic={(t) => {
          setIsSearchOpen(false);
          navigate(`/forum/${t.id}`);
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
          navigate(`/videos/${v.id}`);
        }}
        onSelectGame={(g) => {
          setIsProfileOpen(false);
          navigate(`/games/${g.id}`);
        }}
        onSelectArticle={(a) => {
          setIsProfileOpen(false);
          navigate(`/articles/${a.id}`);
        }}
        onSelectReview={(r) => {
          setIsProfileOpen(false);
          navigate(`/reviews/${r.id}`);
        }}
        onSelectGuide={(g) => {
          setIsProfileOpen(false);
          navigate(`/guides/${g.id}`);
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
    </div>
  );
}
