import React, { useState, useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  Eye, 
  Clock, 
  Calendar, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  ExternalLink,
  MessageSquare,
  Send,
  Sparkles,
  LogIn
} from 'lucide-react';
import { Video, PostComment, UserAccount, PageTab } from '../types';
import { YOUTUBE_CHANNEL } from '../lib/constants';

interface VideoPageViewProps {
  video: Video;
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

export const VideoPageView: React.FC<VideoPageViewProps> = ({
  video,
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

  const videoSlug = getSeoSlug(video);

  useEffect(() => {
    updatePageSeo({
      title: video.title,
      description: video.shortDescription,
      canonicalPath: `/videos/${videoSlug}`,
      ogType: 'video.other',
      imageUrl: video.thumbnail,
      breadcrumbs: [
        { name: 'Videos', path: '/videos' },
        { name: video.title, path: `/videos/${videoSlug}` }
      ],
      schemaType: 'VideoObject',
      schemaData: {
        name: video.title,
        description: video.description || video.shortDescription,
        thumbnailUrl: [video.thumbnail],
        uploadDate: '2025-01-10T12:00:00+00:00',
        duration: video.duration ? `PT${video.duration.replace(':', 'M')}S` : 'PT10M',
        embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
        contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: video.views ? parseInt(video.views.replace(/,/g, ''), 10) || 0 : 0
        }
      }
    });
  }, [video.title, video.shortDescription, video.description, video.thumbnail, video.youtubeId, video.duration, video.views, videoSlug]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Videos</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /videos/{videoSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {video.category}
          </span>
        </div>
      </div>

      {/* Video Player Theater */}
      <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-950/40 bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Video Metadata & Actions */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
              <span className="text-purple-300 font-semibold">{video.game}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                {video.views} views
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {video.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {video.uploadDate}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id={`like-video-${video.id}`}
              onClick={onToggleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50 scale-[1.02]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/40 hover:bg-white/10 hover:text-white'
              }`}
              title={isSignedIn ? (isLiked ? 'Unlike video' : 'Like video') : 'Sign in to like'}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

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

            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Share</span>
            </button>

            <a
              href={`https://youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 transition-all"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Video Synopsis */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300">
            About This Tactical Briefing
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
            {video.description}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0c0e18] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Video Discussion ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {isSignedIn ? 'Signed in as ' + currentUser.name : 'Sign in to comment'}
          </span>
        </div>

        {/* Comment Input */}
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
              placeholder="Leave a comment on this video analysis..."
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
              No comments yet on this video briefing. Be the first to share your thoughts!
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
    </div>
  );
};
