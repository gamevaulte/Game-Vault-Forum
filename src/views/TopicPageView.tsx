import React, { useState, useEffect, useMemo } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft, 
  Pin, 
  MessageSquare, 
  Eye, 
  Clock, 
  ThumbsUp, 
  Share2, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  LogIn,
  Tag,
  CornerDownRight,
  Calendar
} from 'lucide-react';
import { ForumTopic, UserAccount, PageTab } from '../types';
import { formatTopicDate, formatCommentDateTime, getTimestampMs } from '../lib/forumUtils';

interface TopicPageViewProps {
  topic: ForumTopic;
  isTopicLiked: boolean;
  topicLikeCount: number;
  onToggleTopicLike: () => void;
  isReplyLiked: (replyId: string) => boolean;
  getReplyLikeCount: (replyId: string) => number;
  onToggleReplyLike: (replyId: string) => void;
  onAddReply: (replyText: string, options?: { replyToAuthor?: string; guestAuthorName?: string }) => void;
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onShare: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onViewUserProfile?: (author: { id?: string; name: string; username?: string; avatar: string; role?: string; badge?: string }) => void;
}

export const TopicPageView: React.FC<TopicPageViewProps> = ({
  topic,
  isTopicLiked,
  topicLikeCount,
  onToggleTopicLike,
  isReplyLiked,
  getReplyLikeCount,
  onToggleReplyLike,
  onAddReply,
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onShare,
  onBack,
  onNavigateTab,
  onViewUserProfile
}) => {
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);
  const [subReplyText, setSubReplyText] = useState('');

  // Chronological sorting by time and date posted (ascending order)
  const sortedReplies = useMemo(() => {
    if (!topic.replies || !Array.isArray(topic.replies)) return [];
    return [...topic.replies].sort((a, b) => {
      const timeA = getTimestampMs(a.createdAt, a.timestamp);
      const timeB = getTimestampMs(b.createdAt, b.timestamp);
      return timeA - timeB;
    });
  }, [topic.replies]);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    if (!replyText.trim()) return;
    onAddReply(replyText.trim());
    setReplyText('');
  };

  const topicSlug = getSeoSlug(topic);

  useEffect(() => {
    updatePageSeo({
      title: `${topic.title} - ${topic.category}`,
      description: topic.initialPost ? topic.initialPost.slice(0, 160) : 'Join the discussion on Game Vault Forum.',
      canonicalPath: `/forum/${topicSlug}`,
      ogType: 'article',
      breadcrumbs: [
        { name: 'Forum', path: '/forum' },
        { name: topic.category, path: '/forum' },
        { name: topic.title, path: `/forum/${topicSlug}` }
      ],
      schemaType: 'DiscussionForumPosting',
      schemaData: {
        headline: topic.title,
        articleBody: topic.initialPost,
        articleSection: topic.category,
        author: {
          '@type': 'Person',
          name: topic.author.name
        },
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'CommentAction' },
          userInteractionCount: topic.replies ? topic.replies.length : 0
        }
      }
    });
  }, [topic.title, topic.category, topic.initialPost, topic.author.name, topic.replies, topicSlug]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Forum Discussions</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /forum/{topicSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {topic.category}
          </span>
        </div>
      </div>

      {/* Topic Title Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {topic.isPinned && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-red-600/20 text-red-300 rounded-lg border border-red-500/30">
                <Pin className="w-3 h-3 rotate-45 text-red-400" />
                Pinned Announcement
              </span>
            )}
            <span className="px-2.5 py-1 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded-lg border border-purple-700/40">
              {topic.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
            {topic.title}
          </h1>

          {/* Prominent Author Name & Date pairing for every discussion title */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm pt-1">
            <span className="text-gray-400 font-normal">Discussion opened by</span>
            <button
              type="button"
              onClick={() => onViewUserProfile?.({
                name: topic.author.name,
                avatar: topic.author.avatar,
                role: topic.author.isStaff ? 'Vault Staff Specialist' : (topic.author.badge || 'Forum Operative'),
                badge: topic.author.badge
              })}
              className="text-white hover:text-purple-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title={`View ${topic.author.name}'s profile`}
            >
              <img
                src={topic.author.avatar}
                alt={topic.author.name}
                loading="lazy"
                decoding="async"
                className="w-5 h-5 rounded-full object-cover border border-purple-400/40"
              />
              <span>{topic.author.name}</span>
            </button>
            {topic.author.isStaff && (
              <span className="text-[10px] text-red-300 bg-red-600/20 px-2 py-0.5 rounded-full border border-red-500/30 font-['Rajdhani'] font-bold uppercase">
                Staff
              </span>
            )}
            {topic.author.badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/40">
                {topic.author.badge}
              </span>
            )}
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5 text-gray-300 font-mono text-xs">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Posted on {formatTopicDate(topic)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-white/10 pt-4 font-mono">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              {topic.views} views
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              {(() => {
                const count = Array.isArray(topic.replies) ? topic.replies.length : 0;
                return `${count} ${count === 1 ? 'reply' : 'replies'}`;
              })()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {topic.timestamp}
            </span>
          </div>
        </div>

        {/* Original Post */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
          {/* Author Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <button
              type="button"
              onClick={() => onViewUserProfile?.({
                name: topic.author.name,
                avatar: topic.author.avatar,
                role: topic.author.isStaff ? 'Vault Staff Specialist' : (topic.author.badge || 'Forum Operative'),
                badge: topic.author.badge
              })}
              className="flex items-center gap-3.5 text-left group cursor-pointer hover:opacity-90 transition-opacity"
              title={`View ${topic.author.name}'s profile`}
            >
              <img
                src={topic.author.avatar}
                alt={topic.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50 shadow-md shadow-purple-950/50 group-hover:border-purple-400 transition-colors"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-['Space_Grotesk'] group-hover:text-purple-300 transition-colors">
                    {topic.author.name}
                  </span>
                  {topic.author.isStaff && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-red-600/30 text-red-300 border border-red-500/40 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-red-400" />
                      Staff
                    </span>
                  )}
                  {topic.author.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-purple-900/60 text-purple-300 border border-purple-500/30 rounded-full">
                      {topic.author.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-0.5 block group-hover:text-gray-300 transition-colors">
                  Original Poster • {topic.timestamp} • View Dossier
                </span>
              </div>
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Post Content */}
          <div className="text-base text-gray-200 leading-relaxed font-['Inter'] whitespace-pre-line space-y-4">
            {topic.initialPost}
          </div>

          {/* Tags */}
          {topic.tags && topic.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              {topic.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs bg-white/5 text-gray-300 border border-white/10 rounded-lg font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Topic Like Action */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              id={`like-topic-${topic.id}`}
              onClick={isSignedIn ? onToggleTopicLike : onOpenSignIn}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isTopicLiked
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/40 hover:bg-white/10 hover:text-white'
              }`}
              title={isTopicLiked ? 'Unlike topic' : 'Like topic'}
            >
              <ThumbsUp className={`w-4 h-4 ${isTopicLiked ? 'fill-current' : ''}`} />
              <span>{topicLikeCount} {topicLikeCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            <span className="text-xs text-gray-500 font-mono">
              Post likes start from 0 and update live
            </span>
          </div>
        </div>
      </div>

      {/* Discussion Thread Replies */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0c0e18] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Discussion Replies ({sortedReplies.length})
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {isSignedIn ? 'Signed in as ' + currentUser.name : 'Sign in to reply'}
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
                Visitors can interact with forum topics, replies, and community discussions only when registered and signed in. Sign in or register your operative profile to participate.
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
          /* Reply Box for signed-in members */
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
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
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Contribute to this discussion with civil, tactical insight..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-['Inter']"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Reply</span>
              </button>
            </div>
          </form>
        )}

        {/* Replies List: Chronologically Ordered */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {sortedReplies.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl space-y-2">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-sm font-bold font-['Space_Grotesk'] text-gray-300">No replies recorded yet</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Be the first vault operative to contribute tactical perspectives to this discussion thread.
              </p>
            </div>
          ) : (
            sortedReplies.map((reply) => {
              const userHasLiked = isReplyLiked(reply.id);
              const rLikes = getReplyLikeCount(reply.id);
              return (
                <div
                  key={reply.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 transition-colors hover:border-white/10"
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
                      className="flex items-center gap-3 text-left group cursor-pointer hover:opacity-90 transition-opacity"
                      title={`View ${reply.author.name}'s profile`}
                    >
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-purple-500/40 group-hover:border-purple-400 transition-colors"
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
                    <div className="pl-11">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                        <CornerDownRight className="w-2.5 h-2.5" />
                        <span>Replying to @{reply.replyToAuthor}</span>
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pl-11">
                    {reply.content}
                  </p>

                  <div className="flex items-center gap-4 pl-11 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isSignedIn) {
                          onOpenSignIn();
                          return;
                        }
                        onToggleReplyLike(reply.id);
                      }}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        userHasLiked
                          ? 'text-purple-400 font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={userHasLiked ? 'Unlike reply' : 'Like reply'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-current' : ''}`} />
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
                      title="Reply to this user"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-purple-400" />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Inline Reply-to-Reply Form */}
                  {replyingTo?.id === reply.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isSignedIn) {
                          onOpenSignIn();
                          return;
                        }
                        if (!subReplyText.trim()) return;
                        onAddReply(subReplyText.trim(), {
                          replyToAuthor: reply.author.name
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
            })
          )}
        </div>
      </section>
    </div>
  );
};
