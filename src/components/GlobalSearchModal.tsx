import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Film, Gamepad2, BookOpen, Star, Compass, MessageSquare, ArrowRight } from 'lucide-react';
import { Video, Game, Article, Review, Guide, ForumTopic } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  games: Game[];
  articles: Article[];
  reviews: Review[];
  guides: Guide[];
  topics: ForumTopic[];
  onSelectVideo: (v: Video) => void;
  onSelectGame: (g: Game) => void;
  onSelectArticle: (a: Article) => void;
  onSelectReview: (r: Review) => void;
  onSelectGuide: (g: Guide) => void;
  onSelectTopic: (t: ForumTopic) => void;
}

type SearchFilter = 'all' | 'videos' | 'games' | 'articles' | 'reviews' | 'guides' | 'forum';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  videos,
  games,
  articles,
  reviews,
  guides,
  topics,
  onSelectVideo,
  onSelectGame,
  onSelectArticle,
  onSelectReview,
  onSelectGuide,
  onSelectTopic
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedVideos = (activeFilter === 'all' || activeFilter === 'videos')
      ? videos.filter(v => v.title.toLowerCase().includes(q) || v.game.toLowerCase().includes(q) || v.shortDescription.toLowerCase().includes(q))
      : [];

    const matchedGames = (activeFilter === 'all' || activeFilter === 'games')
      ? games.filter(g => g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q) || g.platforms.some(p => p.toLowerCase().includes(q)))
      : [];

    const matchedArticles = (activeFilter === 'all' || activeFilter === 'articles')
      ? articles.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
      : [];

    const matchedReviews = (activeFilter === 'all' || activeFilter === 'reviews')
      ? reviews.filter(r => r.gameTitle.toLowerCase().includes(q) || r.shortVerdict.toLowerCase().includes(q))
      : [];

    const matchedGuides = (activeFilter === 'all' || activeFilter === 'guides')
      ? guides.filter(gd => gd.title.toLowerCase().includes(q) || gd.game.toLowerCase().includes(q) || gd.category.toLowerCase().includes(q))
      : [];

    const matchedTopics = (activeFilter === 'all' || activeFilter === 'forum')
      ? topics.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.initialPost.toLowerCase().includes(q))
      : [];

    const totalCount = matchedVideos.length + matchedGames.length + matchedArticles.length + matchedReviews.length + matchedGuides.length + matchedTopics.length;

    return {
      videos: matchedVideos,
      games: matchedGames,
      articles: matchedArticles,
      reviews: matchedReviews,
      guides: matchedGuides,
      topics: matchedTopics,
      totalCount
    };
  }, [query, activeFilter, videos, games, articles, reviews, guides, topics]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#07080d]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden mt-6 sm:mt-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search games, videos, reviews, guides, articles, forum..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-500 font-['Space_Grotesk'] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-gray-300 hover:text-white bg-white/10 rounded-lg border border-white/10 backdrop-blur-md"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-white/[0.02] border-b border-white/5 overflow-x-auto text-xs scrollbar-none font-['Rajdhani'] font-bold uppercase tracking-wider">
          {(
            [
              { id: 'all', label: 'All Vault' },
              { id: 'videos', label: 'Videos' },
              { id: 'games', label: 'Games' },
              { id: 'articles', label: 'Articles' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'guides', label: 'Guides' },
              { id: 'forum', label: 'Forum Topics' }
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`px-3.5 py-1 rounded-full transition-all whitespace-nowrap ${
                activeFilter === item.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {!query ? (
            <div className="text-center py-10 space-y-2">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-medium font-['Rajdhani'] text-lg uppercase tracking-wider">
                Explore the Game Vault Database
              </p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Type any game title (e.g. "Elden Ring", "Cyberpunk", "Warships"), guide topic, or discussion keyword.
              </p>
            </div>
          ) : results && results.totalCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-base">No vault entries matched "{query}"</p>
              <p className="text-slate-600 text-xs mt-1">Try another keyword or change your filter category.</p>
            </div>
          ) : (
            results && (
              <div className="space-y-6">
                {/* Videos */}
                {results.videos.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold text-red-400 uppercase tracking-wider mb-2.5">
                      <Film className="w-3.5 h-3.5" /> Videos ({results.videos.length})
                    </h4>
                    <div className="space-y-2">
                      {results.videos.map((vid) => (
                        <div
                          key={vid.id}
                          onClick={() => {
                            onClose();
                            onSelectVideo(vid);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#141725] hover:bg-[#1a1e32] border border-[#21263c] hover:border-purple-500/40 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={vid.thumbnail}
                              alt={vid.title}
                              className="w-16 h-10 object-cover rounded-md border border-[#282d46]"
                            />
                            <div>
                              <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                                {vid.title}
                              </p>
                              <span className="text-xs text-slate-400">
                                {vid.game} • {vid.duration} • {vid.views} views
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Games */}
                {results.games.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold text-cyan-400 uppercase tracking-wider mb-2.5">
                      <Gamepad2 className="w-3.5 h-3.5" /> Games ({results.games.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {results.games.map((game) => (
                        <div
                          key={game.id}
                          onClick={() => {
                            onClose();
                            onSelectGame(game);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-[#141725] hover:bg-[#1a1e32] border border-[#21263c] hover:border-cyan-500/40 cursor-pointer transition-all group"
                        >
                          <img
                            src={game.artwork}
                            alt={game.title}
                            className="w-12 h-14 object-cover rounded-md border border-[#282d46]"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-cyan-300 truncate">
                              {game.title}
                            </p>
                            <p className="text-xs text-slate-400">{game.genre} • {game.platforms.join(', ')}</p>
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] bg-cyan-950 text-cyan-300 rounded font-mono">
                              ★ {game.rating}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {results.articles.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold text-purple-400 uppercase tracking-wider mb-2.5">
                      <BookOpen className="w-3.5 h-3.5" /> Articles ({results.articles.length})
                    </h4>
                    <div className="space-y-2">
                      {results.articles.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => {
                            onClose();
                            onSelectArticle(art);
                          }}
                          className="p-3 rounded-xl bg-[#141725] hover:bg-[#1a1e32] border border-[#21263c] hover:border-purple-500/40 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                              {art.category}
                            </span>
                            <span className="text-[11px] text-slate-500">{art.readingTime}</span>
                          </div>
                          <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors mt-0.5">
                            {art.title}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-1">{art.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {results.reviews.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold text-amber-400 uppercase tracking-wider mb-2.5">
                      <Star className="w-3.5 h-3.5" /> Reviews ({results.reviews.length})
                    </h4>
                    <div className="space-y-2">
                      {results.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          onClick={() => {
                            onClose();
                            onSelectReview(rev);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#141725] hover:bg-[#1a1e32] border border-[#21263c] hover:border-amber-500/40 cursor-pointer transition-all group"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                              {rev.gameTitle}
                            </p>
                            <p className="text-xs text-slate-400">{rev.shortVerdict}</p>
                          </div>
                          <span className="px-2.5 py-1 text-xs font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800/40 rounded-lg">
                            {rev.score}/10
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guides */}
                {results.guides.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
                      <Compass className="w-3.5 h-3.5" /> Guides ({results.guides.length})
                    </h4>
                    <div className="space-y-2">
                      {results.guides.map((gd) => (
                        <div
                          key={gd.id}
                          onClick={() => {
                            onClose();
                            onSelectGuide(gd);
                          }}
                          className="p-2.5 rounded-xl bg-[#141725] hover:bg-[#1a1e32] border border-[#21263c] hover:border-emerald-500/40 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-medium">{gd.game} • {gd.category}</span>
                            <span className="text-slate-500">{gd.estimatedReadingTime}</span>
                          </div>
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-300 mt-1">
                            {gd.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Forum Topics */}
                {results.topics.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Forum Discussions ({results.topics.length})
                    </h4>
                    <div className="space-y-2">
                      {results.topics.map((top) => (
                        <div
                          key={top.id}
                          onClick={() => {
                            onClose();
                            onSelectTopic(top);
                          }}
                          className="p-3 rounded-xl bg-[#141725] hover:bg-[#1a1e32] border border-[#21263c] hover:border-indigo-500/40 cursor-pointer transition-all group"
                        >
                          <span className="text-[10px] font-mono uppercase bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40">
                            {top.category}
                          </span>
                          <p className="text-sm font-semibold text-white group-hover:text-indigo-300 mt-1">
                            {top.title}
                          </p>
                          <span className="text-xs text-slate-500 mt-1 inline-block">
                            by {top.author.name} • {(() => {
                              const count = Array.isArray(top.replies) ? top.replies.length : 0;
                              return `${count} ${count === 1 ? 'reply' : 'replies'}`;
                            })()} • {top.lastActivity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
