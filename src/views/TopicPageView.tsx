import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { ForumTopic, UserAccount, PageTab } from '../types';

interface TopicPageViewProps {
  topic: ForumTopic;
  isTopicLiked: boolean;
  topicLikeCount: number;
  onToggleTopicLike: () => void;
  isReplyLiked: (replyId: string) => boolean;
  getReplyLikeCount: (replyId: string) => number;
  onToggleReplyLike: (replyId: string) => void;
  onAddReply: (replyText: string) => void;
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onShare: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
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
  onNavigateTab
}) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    onAddReply(replyText.trim());
    setReplyText('');
  };

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
          <span className="hidden sm:inline">URL: /forum/{topic.id}</span>
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

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-white/10 pt-4 font-mono">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              {topic.views} views
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              {topic.repliesCount} replies
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
            <div className="flex items-center gap-3.5">
              <img
                src={topic.author.avatar}
                alt={topic.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50 shadow-md shadow-purple-950/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-['Space_Grotesk']">
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
                <span className="text-xs text-gray-400 mt-0.5 block">
                  Original Poster • {topic.timestamp}
                </span>
              </div>
            </div>

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
              onClick={onToggleTopicLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isTopicLiked
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/40 hover:bg-white/10 hover:text-white'
              }`}
              title={isSignedIn ? (isTopicLiked ? 'Unlike topic' : 'Like topic') : 'Sign in to like'}
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
              Discussion Replies ({topic.replies.length})
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {isSignedIn ? 'Signed in as ' + currentUser.name : 'Sign in to reply'}
          </span>
        </div>

        {/* Reply Box or Sign In Warning */}
        {isSignedIn ? (
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

        {/* Replies List */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {topic.replies.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs font-mono">
              No replies yet. Be the first registered operative to share your thoughts!
            </div>
          ) : (
            topic.replies.map((reply) => {
              const userHasLiked = isReplyLiked(reply.id);
              const rLikes = getReplyLikeCount(reply.id);
              return (
                <div
                  key={reply.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 transition-colors hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                      />
                      <div>
                        <span className="text-xs font-bold text-white font-['Space_Grotesk'] block">
                          {reply.author.name}
                        </span>
                        {reply.author.badge && (
                          <span className="text-[10px] text-purple-300 font-mono">
                            {reply.author.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">{reply.timestamp}</span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pl-11">
                    {reply.content}
                  </p>

                  <div className="flex items-center gap-3 pl-11 pt-1">
                    <button
                      onClick={() => onToggleReplyLike(reply.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        userHasLiked
                          ? 'text-purple-400 font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={isSignedIn ? 'Like reply' : 'Sign in to like'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-current' : ''}`} />
                      <span>{rLikes}</span>
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
