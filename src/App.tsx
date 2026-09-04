import React, { useState, useEffect } from 'react';
import { PageTab, Video, Game, Article, Review, Guide, ForumTopic, UserAccount } from './types';
import {
  MOCK_VIDEOS,
  MOCK_GAMES,
  MOCK_ARTICLES,
  MOCK_REVIEWS,
  MOCK_GUIDES,
  MOCK_FORUM_TOPICS,
  DEFAULT_USER
} from './data/mockData';

// UI Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VideoModal } from './components/VideoModal';
import { GameModal } from './components/GameModal';
import { ArticleModal } from './components/ArticleModal';
import { ReviewModal } from './components/ReviewModal';
import { GuideModal } from './components/GuideModal';
import { ForumTopicModal } from './components/ForumTopicModal';
import { NewTopicModal } from './components/NewTopicModal';
import { AuthProfileModal } from './components/AuthProfileModal';

// Views
import { HomeView } from './views/HomeView';
import { VideosView } from './views/VideosView';
import { GamesView } from './views/GamesView';
import { ArticlesView } from './views/ArticlesView';
import { ReviewsView } from './views/ReviewsView';
import { GuidesView } from './views/GuidesView';
import { ForumView } from './views/ForumView';
import { AboutView } from './views/AboutView';

export default function App() {
  // Navigation Routing State
  const [currentTab, setCurrentTab] = useState<PageTab>('home');

  // Interactive Content Lists with Persistence
  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('gv_forum_topics');
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
    const saved = localStorage.getItem('gv_forum_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return DEFAULT_USER;
  });

  // Modal State
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'guidelines'>('profile');

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist topics
  useEffect(() => {
    localStorage.setItem('gv_forum_topics', JSON.stringify(topics));
  }, [topics]);

  // Persist user
  useEffect(() => {
    localStorage.setItem('gv_forum_user', JSON.stringify(user));
  }, [user]);

  const addToast = (text: string, type: 'success' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(`Copied link to "${title}" to clipboard!`, 'success');
    } else {
      addToast(`Shared "${title}"!`, 'info');
    }
  };

  // Bookmark Handlers
  const handleToggleBookmark = (
    type: 'videos' | 'games' | 'articles' | 'reviews' | 'guides',
    id: string,
    itemName: string
  ) => {
    setUser((prev) => {
      const currentList = prev.bookmarks[type];
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

  // Add Reply to Forum Topic
  const handleAddReply = (topicId: string, replyText: string) => {
    const newReply = {
      id: `r-${Date.now()}`,
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

    // Update the currently viewed modal topic as well
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic((prev) =>
        prev
          ? {
              ...prev,
              repliesCount: prev.repliesCount + 1,
              lastActivity: 'Just now',
              replies: [...prev.replies, newReply]
            }
          : null
      );
    }

    addToast('Your response has been published to the discussion!', 'success');
  };

  // Create New Forum Topic
  const handleCreateTopic = (newTopicData: Partial<ForumTopic>) => {
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
      replies: []
    };

    setTopics((prev) => [fullTopic, ...prev]);
    addToast(`Discussion "${fullTopic.title}" opened in ${fullTopic.category}!`, 'success');
  };

  const handleSubscribeNewsletter = (email: string) => {
    addToast(`Access granted! ${email} has been registered to the Vault Dispatch.`, 'success');
  };

  const handleOpenGuidelines = () => {
    setProfileInitialTab('guidelines');
    setIsProfileOpen(true);
  };

  const handleOpenProfile = () => {
    setProfileInitialTab('profile');
    setIsProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 flex flex-col selection:bg-purple-600 selection:text-white font-['Inter'] relative overflow-x-hidden">
      {/* Frosted Glass Ambient Atmospheric Lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] lg:w-[45%] h-[500px] lg:h-[45%] bg-purple-900/30 blur-[130px] rounded-full pointer-events-none -z-10 animate-vault-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] lg:w-[45%] h-[500px] lg:h-[45%] bg-blue-900/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[15%] w-[350px] lg:w-[30%] h-[350px] lg:h-[30%] bg-purple-950/20 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Sticky Vault Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={handleOpenProfile}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomeView
            videos={MOCK_VIDEOS}
            games={MOCK_GAMES}
            articles={MOCK_ARTICLES}
            reviews={MOCK_REVIEWS}
            guides={MOCK_GUIDES}
            topics={topics}
            onSelectVideo={setSelectedVideo}
            onSelectGame={setSelectedGame}
            onSelectArticle={setSelectedArticle}
            onSelectReview={setSelectedReview}
            onSelectGuide={setSelectedGuide}
            onSelectTopic={setSelectedTopic}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNewTopic={() => setIsNewTopicOpen(true)}
          />
        )}

        {currentTab === 'videos' && (
          <VideosView
            videos={MOCK_VIDEOS}
            onSelectVideo={setSelectedVideo}
          />
        )}

        {currentTab === 'games' && (
          <GamesView
            games={MOCK_GAMES}
            onSelectGame={setSelectedGame}
          />
        )}

        {currentTab === 'articles' && (
          <ArticlesView
            articles={MOCK_ARTICLES}
            onSelectArticle={setSelectedArticle}
          />
        )}

        {currentTab === 'reviews' && (
          <ReviewsView
            reviews={MOCK_REVIEWS}
            onSelectReview={setSelectedReview}
          />
        )}

        {currentTab === 'guides' && (
          <GuidesView
            guides={MOCK_GUIDES}
            onSelectGuide={setSelectedGuide}
          />
        )}

        {currentTab === 'forum' && (
          <ForumView
            topics={topics}
            onSelectTopic={setSelectedTopic}
            onOpenNewTopic={() => setIsNewTopicOpen(true)}
            onOpenGuidelines={handleOpenGuidelines}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSubscribeNewsletter={handleSubscribeNewsletter}
        onOpenGuidelines={handleOpenGuidelines}
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
        onSelectVideo={setSelectedVideo}
        onSelectGame={setSelectedGame}
        onSelectArticle={setSelectedArticle}
        onSelectReview={setSelectedReview}
        onSelectGuide={setSelectedGuide}
        onSelectTopic={setSelectedTopic}
      />

      {/* Detail Modals */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        isBookmarked={selectedVideo ? user.bookmarks.videos.includes(selectedVideo.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark('videos', id, selectedVideo?.title || 'Video')}
        onShare={handleShare}
      />

      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        isBookmarked={selectedGame ? user.bookmarks.games.includes(selectedGame.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark('games', id, selectedGame?.title || 'Game')}
        onShare={handleShare}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? user.bookmarks.articles.includes(selectedArticle.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark('articles', id, selectedArticle?.title || 'Article')}
        onShare={handleShare}
      />

      <ReviewModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        isBookmarked={selectedReview ? user.bookmarks.reviews.includes(selectedReview.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark('reviews', id, `${selectedReview?.gameTitle} Review`)}
        onShare={handleShare}
      />

      <GuideModal
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
        isBookmarked={selectedGuide ? user.bookmarks.guides.includes(selectedGuide.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark('guides', id, selectedGuide?.title || 'Guide')}
        onShare={handleShare}
      />

      <ForumTopicModal
        topic={selectedTopic}
        onClose={() => setSelectedTopic(null)}
        currentUser={user}
        onAddReply={handleAddReply}
      />

      <NewTopicModal
        isOpen={isNewTopicOpen}
        onClose={() => setIsNewTopicOpen(false)}
        currentUser={user}
        onCreateTopic={handleCreateTopic}
      />

      <AuthProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        videos={MOCK_VIDEOS}
        games={MOCK_GAMES}
        articles={MOCK_ARTICLES}
        reviews={MOCK_REVIEWS}
        guides={MOCK_GUIDES}
        onSelectVideo={setSelectedVideo}
        onSelectGame={setSelectedGame}
        onSelectArticle={setSelectedArticle}
        onSelectReview={setSelectedReview}
        onSelectGuide={setSelectedGuide}
        initialTab={profileInitialTab}
      />

      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onCloseToast={removeToast} />
    </div>
  );
}
