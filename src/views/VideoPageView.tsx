import React, { useState, useEffect, useMemo } from 'react';
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
  LogIn,
  Youtube,
  ListChecks,
  PlayCircle,
  Layers,
  Film,
  CornerDownRight,
  ShieldCheck
} from 'lucide-react';
import { Video, PostComment, UserAccount, PageTab } from '../types';
import { YOUTUBE_CHANNEL } from '../lib/constants';
import { formatCommentDateTime, getTimestampMs } from '../lib/forumUtils';

interface VideoPageViewProps {
  video: Video;
  isLiked: boolean;
  likeCount: number;
  isBookmarked: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
  comments: PostComment[];
  onAddComment: (text: string, options?: { replyToId?: string; replyToAuthor?: string; guestAuthorName?: string }) => void;
  onToggleCommentLike: (commentId: string) => void;
  isCommentLiked: (commentId: string) => boolean;
  getCommentLikeCount: (commentId: string) => number;
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onViewUserProfile?: (author: { id?: string; name: string; username?: string; avatar: string; role?: string; badge?: string }) => void;
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
  onNavigateTab,
  onViewUserProfile
}) => {
  const [commentText, setCommentText] = useState('');
  const [guestCallsign, setGuestCallsign] = useState(() => {
    return localStorage.getItem('gv_guest_callsign') || 'Guest Operative';
  });
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [subReplyText, setSubReplyText] = useState('');

  // Chronological grouping and sorting by time and date posted (ascending order)
  const threadedComments = useMemo(() => {
    if (!comments || !Array.isArray(comments)) return [];

    const sortedAll = [...comments].sort((a, b) => {
      const timeA = getTimestampMs(a.createdAt, a.timestamp);
      const timeB = getTimestampMs(b.createdAt, b.timestamp);
      return timeA - timeB;
    });

    const commentMap = new Map<string, PostComment>();
    sortedAll.forEach((c) => commentMap.set(c.id, c));

    // Find root parent for replies
    const getRootId = (targetId: string, visited = new Set<string>()): string => {
      if (visited.has(targetId)) return targetId;
      visited.add(targetId);
      const item = commentMap.get(targetId);
      if (item && item.replyToId && commentMap.has(item.replyToId)) {
        return getRootId(item.replyToId, visited);
      }
      return targetId;
    };

    const threadReplies = new Map<string, PostComment[]>();
    const roots: PostComment[] = [];

    sortedAll.forEach((c) => {
      if (c.replyToId && commentMap.has(c.replyToId)) {
        const rootId = getRootId(c.replyToId);
        const list = threadReplies.get(rootId) || [];
        list.push(c);
        threadReplies.set(rootId, list);
      } else {
        roots.push(c);
      }
    });

    return roots.map((root) => ({
      root,
      replies: (threadReplies.get(root.id) || []).sort((a, b) => {
        const timeA = getTimestampMs(a.createdAt, a.timestamp);
        const timeB = getTimestampMs(b.createdAt, b.timestamp);
        return timeA - timeB;
      })
    }));
  }, [comments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    if (!commentText.trim()) return;
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
              onClick={isSignedIn ? onToggleLike : onOpenSignIn}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50 scale-[1.02]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/40 hover:bg-white/10 hover:text-white'
              }`}
              title={isLiked ? 'Unlike video' : 'Like video'}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <button
              onClick={isSignedIn ? onToggleBookmark : onOpenSignIn}
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
              href={video.youtubeUrl || `https://youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40 border border-red-500/40 transition-all cursor-pointer"
              title="Watch on YouTube"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Watch on YouTube</span>
            </a>
          </div>
        </div>

        {/* Video Synopsis */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <h3 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400" />
            <span>Tactical Synopsis</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
            {video.description}
          </p>
        </div>

        {/* Comprehensive Video Summary & Analysis */}
        {video.summary && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/20 via-black/40 to-[#0e101a] border border-purple-500/30 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
                  <PlayCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
                    Video Summary & Tactical Breakdown
                  </h3>
                  <p className="text-xs text-purple-300/80 font-mono">
                    Direct briefing summarizing official video analysis
                  </p>
                </div>
              </div>

              {video.youtubeUrl && (
                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white font-mono hover:underline"
                >
                  <span>Link: {video.youtubeUrl.replace('https://', '')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* In-depth summary text */}
            <div className="text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter'] whitespace-pre-line space-y-4">
              {video.summary}
            </div>

            {/* Key Takeaways */}
            {video.keyTakeaways && video.keyTakeaways.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-cyan-400" />
                  <span>Key Strategic Takeaways</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {video.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-300 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            {video.chapters && video.chapters.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold font-['Rajdhani'] uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Video Chapters & Topics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {video.chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300"
                    >
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[11px] font-bold border border-purple-800/40">
                        {ch.timestamp}
                      </span>
                      <span className="truncate font-medium">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subscribe Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/60 border border-white/20">
              <Youtube className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider flex items-center gap-1.5">
                <span>{YOUTUBE_CHANNEL.name}</span>
                <span className="text-red-400 font-mono text-xs font-normal">({YOUTUBE_CHANNEL.handle})</span>
              </p>
              <p className="text-xs text-gray-400">
                Subscribe on YouTube for full-length gaming documentaries, tactical analyses, and hardware tests.
              </p>
            </div>
          </div>
          <a
            href={YOUTUBE_CHANNEL.subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shrink-0 transition-all shadow-md shadow-red-950/40"
          >
            Subscribe on YouTube
          </a>
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

        {/* Auth prompt for non-authenticated visitors */}
        {!isSignedIn ? (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-black border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                <h4 className="text-sm sm:text-base font-bold font-['Space_Grotesk'] text-white">
                  Member Sign In & Registration Required
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Visitors can comment, reply, and like video discussions only when registered and signed in. Sign in or register your operative profile to participate.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSignIn}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </div>
        ) : (
          /* Comment Input for signed-in members */
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
              />
              <span className="text-xs font-semibold text-white font-['Space_Grotesk']">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-purple-300 font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
                Verified Operative
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
        )}

        {/* Comments List: Chronologically Ordered Threads & Replies */}
        <div className="space-y-6 pt-4 border-t border-white/10">
          {threadedComments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs font-mono">
              No comments yet on this video briefing. Be the first to share your thoughts!
            </div>
          ) : (
            threadedComments.map(({ root: comment, replies }) => {
              const userHasLiked = isCommentLiked(comment.id);
              const cLikes = getCommentLikeCount(comment.id);
              return (
                <div key={comment.id} className="space-y-3">
                  {/* Root Comment Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5 transition-colors hover:border-white/10">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onViewUserProfile?.({
                          id: comment.author.id,
                          name: comment.author.name,
                          username: comment.author.username,
                          avatar: comment.author.avatar,
                          role: comment.author.role || comment.author.badge || 'Recruit Operative',
                          badge: comment.author.badge
                        })}
                        className="flex items-center gap-3 text-left group cursor-pointer hover:opacity-90 transition-opacity"
                        title={`View ${comment.author.name}'s profile`}
                      >
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-purple-500/40 group-hover:border-purple-400 transition-colors"
                        />
                        <div>
                          <span className="text-xs font-bold text-white font-['Space_Grotesk'] block group-hover:text-purple-300 transition-colors">
                            {comment.author.name}
                          </span>
                          {comment.author.badge && (
                            <span className="text-[10px] text-purple-300 font-mono">
                              {comment.author.badge}
                            </span>
                          )}
                        </div>
                      </button>
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                        <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{formatCommentDateTime(comment.createdAt, comment.timestamp)}</span>
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pl-11">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 pl-11 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isSignedIn) {
                            onOpenSignIn();
                            return;
                          }
                          onToggleCommentLike(comment.id);
                        }}
                        className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                          userHasLiked
                            ? 'text-purple-400 font-bold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        title={userHasLiked ? 'Unlike comment' : 'Like comment'}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-current' : ''}`} />
                        <span>{cLikes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!isSignedIn) {
                            onOpenSignIn();
                            return;
                          }
                          if (replyingTo?.id === comment.id) {
                            setReplyingTo(null);
                            setSubReplyText('');
                          } else {
                            setReplyingTo({ id: comment.id, authorName: comment.author.name });
                            setSubReplyText(`@${comment.author.name} `);
                          }
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
                        title="Reply to this operative"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 text-purple-400" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Inline Reply-to-Comment Form */}
                    {replyingTo?.id === comment.id && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!isSignedIn) {
                            onOpenSignIn();
                            return;
                          }
                          if (!subReplyText.trim()) return;
                          onAddComment(subReplyText.trim(), {
                            replyToId: comment.id,
                            replyToAuthor: comment.author.name
                          });
                          setSubReplyText('');
                          setReplyingTo(null);
                        }}
                        className="mt-3 pl-11 space-y-2 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center justify-between text-[11px] text-purple-300 font-mono">
                          <span>Replying to <span className="font-bold">@{replyingTo.authorName}</span>:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null);
                              setSubReplyText('');
                            }}
                            className="text-gray-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={subReplyText}
                            onChange={(e) => setSubReplyText(e.target.value)}
                            placeholder={`Reply to ${comment.author.name}...`}
                            className="flex-1 px-3 py-2 bg-black/40 border border-purple-500/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                            autoFocus
                          />
                          <button
                            type="submit"
                            disabled={!subReplyText.trim()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-purple-900/40"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Threaded Nested Replies */}
                  {replies.length > 0 && (
                    <div className="ml-4 sm:ml-8 pl-3 sm:pl-4 border-l-2 border-purple-500/30 space-y-3">
                      {replies.map((reply) => {
                        const replyLiked = isCommentLiked(reply.id);
                        const rLikes = getCommentLikeCount(reply.id);
                        return (
                          <div
                            key={reply.id}
                            className="p-3.5 sm:p-4 rounded-xl bg-purple-950/10 border border-purple-500/10 space-y-2 hover:border-purple-500/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => onViewUserProfile?.({
                                  id: reply.author.id,
                                  name: reply.author.name,
                                  username: reply.author.username,
                                  avatar: reply.author.avatar,
                                  role: reply.author.role || reply.author.badge || 'Recruit Operative',
                                  badge: reply.author.badge
                                })}
                                className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-90 transition-opacity"
                                title={`View ${reply.author.name}'s profile`}
                              >
                                <img
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover border border-purple-500/40 group-hover:border-purple-400 transition-colors"
                                />
                                <div>
                                  <span className="text-xs font-bold text-white font-['Space_Grotesk'] block group-hover:text-purple-300 transition-colors">
                                    {reply.author.name}
                                  </span>
                                  {reply.author.badge && (
                                    <span className="text-[10px] text-purple-300 font-mono">
                                      {reply.author.badge}
                                    </span>
                                  )}
                                </div>
                              </button>
                              <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                                <Clock className="w-3 h-3 text-purple-400 shrink-0" />
                                <span>{formatCommentDateTime(reply.createdAt, reply.timestamp)}</span>
                              </span>
                            </div>

                            {reply.replyToAuthor && (
                              <div className="pl-9">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                                  <CornerDownRight className="w-2.5 h-2.5" />
                                  <span>Replying to @{reply.replyToAuthor}</span>
                                </span>
                              </div>
                            )}

                            <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pl-9">
                              {reply.content}
                            </p>

                            <div className="flex items-center gap-4 pl-9 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!isSignedIn) {
                                    onOpenSignIn();
                                    return;
                                  }
                                  onToggleCommentLike(reply.id);
                                }}
                                className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                                  replyLiked
                                    ? 'text-purple-400 font-bold'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                                title={replyLiked ? 'Unlike reply' : 'Like reply'}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${replyLiked ? 'fill-current' : ''}`} />
                                <span>{rLikes}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (!isSignedIn) {
                                    onOpenSignIn();
                                    return;
                                  }
                                  if (replyingTo?.id === reply.id) {
                                    setReplyingTo(null);
                                    setSubReplyText('');
                                  } else {
                                    setReplyingTo({ id: reply.id, authorName: reply.author.name });
                                    setSubReplyText(`@${reply.author.name} `);
                                  }
                                }}
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
                                title="Reply to this response"
                              >
                                <CornerDownRight className="w-3.5 h-3.5 text-purple-400" />
                                <span>Reply</span>
                              </button>
                            </div>

                            {/* Inline Reply-to-Nested-Reply Form */}
                            {replyingTo?.id === reply.id && (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!isSignedIn) {
                                    onOpenSignIn();
                                    return;
                                  }
                                  if (!subReplyText.trim()) return;
                                  onAddComment(subReplyText.trim(), {
                                    replyToId: reply.id,
                                    replyToAuthor: reply.author.name
                                  });
                                  setSubReplyText('');
                                  setReplyingTo(null);
                                }}
                                className="mt-3 pl-9 space-y-2 animate-in fade-in duration-150"
                              >
                                <div className="flex items-center justify-between text-[11px] text-purple-300 font-mono">
                                  <span>Replying to <span className="font-bold">@{replyingTo.authorName}</span>:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setSubReplyText('');
                                    }}
                                    className="text-gray-400 hover:text-white cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={subReplyText}
                                    onChange={(e) => setSubReplyText(e.target.value)}
                                    placeholder={`Reply to ${reply.author.name}...`}
                                    className="flex-1 px-3 py-2 bg-black/40 border border-purple-500/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                                    autoFocus
                                  />
                                  <button
                                    type="submit"
                                    disabled={!subReplyText.trim()}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-purple-900/40"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
