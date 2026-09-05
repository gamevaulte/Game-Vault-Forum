import React, { useState, useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Tag, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  LogIn,
  UserCheck
} from 'lucide-react';
import { Article, PostComment, UserAccount, PageTab } from '../types';

interface ArticlePageViewProps {
  article: Article;
  isLiked: boolean;
  likeCount: number;
  isBookmarked: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
  comments: PostComment[];
  onAddComment: (text: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  isCommentLiked: (commentId: string) => boolean;
  getCommentLikeCount: (commentId: string) => number;
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const ArticlePageView: React.FC<ArticlePageViewProps> = ({
  article,
  isLiked,
  likeCount,
  isBookmarked,
  onToggleLike,
  onToggleBookmark,
  onShare,
  comments,
  onAddComment,
  onToggleCommentLike,
  isCommentLiked,
  getCommentLikeCount,
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onBack,
  onNavigateTab
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const articleSlug = getSeoSlug(article);

  useEffect(() => {
    updatePageSeo({
      title: article.title,
      description: article.excerpt,
      canonicalPath: `/articles/${articleSlug}`,
      ogType: 'article'
    });
  }, [article.title, article.excerpt, articleSlug]);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /articles/{articleSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {article.category}
          </span>
        </div>
      </div>

      {/* Article Header Header */}
      <header className="space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Author bar & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 bg-white/[0.01] px-4 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50 shadow-md shadow-purple-950/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white font-['Space_Grotesk']">{article.author.name}</p>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30 font-mono">
                  {article.author.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Official Game Vault Editorial Contributor</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              {article.readingTime} read
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              {article.publicationDate}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="w-full h-72 sm:h-96 lg:h-[440px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-950/30 relative">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-60" />
      </div>

      {/* Excerpt Callout */}
      <div className="p-6 rounded-2xl bg-purple-950/20 border-l-4 border-purple-500 border border-purple-500/20 shadow-inner">
        <p className="text-base sm:text-lg text-purple-200 font-medium leading-relaxed font-['Space_Grotesk'] italic">
          "{article.excerpt}"
        </p>
      </div>

      {/* Structured Article Markdown Body */}
      <div className="space-y-6 text-base sm:text-lg leading-relaxed font-['Inter'] text-gray-300">
        {article.content.split('\n\n').map((block, idx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="text-2xl sm:text-3xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white pt-8 pb-2 border-b border-white/10 flex items-center gap-3"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shrink-0 shadow-lg shadow-red-500/50" />
                <span>{trimmed.replace(/^##\s*/, '')}</span>
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300 pt-4 pb-1"
              >
                {trimmed.replace(/^###\s*/, '')}
              </h3>
            );
          }
          return (
            <p key={idx} className="leading-relaxed whitespace-pre-line text-gray-300">
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* Article Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/10">
        <Tag className="w-4 h-4 text-purple-400" />
        {article.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs bg-white/5 text-gray-300 border border-white/10 rounded-xl font-medium font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Interactive Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e101a] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            id={`like-article-${article.id}`}
            onClick={onToggleLike}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isLiked
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50 scale-[1.02]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/40 hover:bg-white/10 hover:text-white'
            }`}
            title={isSignedIn ? (isLiked ? 'Unlike article' : 'Like article') : 'Sign in to like'}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-cyan-500/40 hover:bg-white/10 hover:text-white'
            }`}
            title={isBookmarked ? 'Saved to Vault' : 'Save to Vault'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Share Article Link</span>
        </button>
      </div>

      {/* Comments & Discussion Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0c0e18] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Discussion & Comments ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {isSignedIn ? 'Signed in as ' + currentUser.name : 'Sign in to comment'}
          </span>
        </div>

        {/* Comment Form or Sign-in Prompt */}
        {isSignedIn ? (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
              />
              <span className="text-xs font-semibold text-white font-['Space_Grotesk']">
                {currentUser.name}
              </span>
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the discussion... Share your thoughts on this tactical editorial."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-['Inter']"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Only registered and signed in users can comment and like
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sign in or create an account in seconds to join the community discussion.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSignIn}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-md shadow-purple-900/50 border border-purple-400/30 transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs font-mono">
              No comments yet on this article. Be the first registered operative to share your perspective!
            </div>
          ) : (
            comments.map((comment) => {
              const userHasLiked = isCommentLiked(comment.id);
              const cLikes = getCommentLikeCount(comment.id);
              return (
                <div
                  key={comment.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5 transition-colors hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                      />
                      <div>
                        <span className="text-xs font-bold text-white font-['Space_Grotesk'] block">
                          {comment.author.name}
                        </span>
                        {comment.author.badge && (
                          <span className="text-[10px] text-purple-300 font-mono">
                            {comment.author.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">{comment.timestamp}</span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pl-11">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-3 pl-11 pt-1">
                    <button
                      onClick={() => onToggleCommentLike(comment.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        userHasLiked
                          ? 'text-purple-400 font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={isSignedIn ? 'Like comment' : 'Sign in to like'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-current' : ''}`} />
                      <span>{cLikes}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </article>
  );
};
