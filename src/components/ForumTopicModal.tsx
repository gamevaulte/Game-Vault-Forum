import React, { useState } from 'react';
import { X, Pin, MessageSquare, ThumbsUp, Send, User, Clock, ShieldCheck, Tag, Calendar } from 'lucide-react';
import { ForumTopic, UserAccount } from '../types';
import { formatTopicDate } from '../lib/forumUtils';

interface ForumTopicModalProps {
  topic: ForumTopic | null;
  onClose: () => void;
  currentUser: UserAccount;
  onAddReply: (topicId: string, replyText: string) => void;
}

export const ForumTopicModal: React.FC<ForumTopicModalProps> = ({
  topic,
  onClose,
  currentUser,
  onAddReply
}) => {
  const [replyText, setReplyText] = useState('');

  if (!topic) return null;

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(topic.id, replyText);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2438] bg-[#121524]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-mono uppercase bg-indigo-950/60 text-indigo-300 rounded border border-indigo-800/40">
              {topic.category}
            </span>
            {topic.isPinned && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-amber-950/70 text-amber-300 rounded border border-amber-800/40">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#1a1d2e] hover:bg-[#23273e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thread Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Thread Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-white leading-snug">
              {topic.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-purple-200 mt-2">
              <span className="text-slate-400 font-normal">By</span>
              <span className="text-white font-bold">{topic.author.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-purple-400" />
                {formatTopicDate(topic)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{topic.timestamp}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{topic.views} Views</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">
                {(() => {
                  const count = Array.isArray(topic.replies) ? topic.replies.length : 0;
                  return `${count} ${count === 1 ? 'Reply' : 'Replies'}`;
                })()}
              </span>
            </div>
          </div>

          {/* Original Post Card */}
          <div className="p-5 rounded-2xl bg-[#131625] border border-[#22273e] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2438] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={topic.author.avatar}
                  alt={topic.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/50"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{topic.author.name}</span>
                    {topic.author.isStaff && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] bg-red-950 text-red-300 rounded border border-red-800/50 font-['Rajdhani'] font-bold uppercase">
                        <ShieldCheck className="w-3 h-3" /> Staff
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-purple-400 font-mono">{topic.author.badge}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500">{topic.timestamp}</span>
            </div>

            <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-['Inter']">
              {topic.initialPost}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <Tag className="w-3 h-3 text-slate-500" />
              {topic.tags.map((tg, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#171b2d] text-slate-400 border border-[#262c45]">
                  #{tg}
                </span>
              ))}
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Community Discussion ({Array.isArray(topic.replies) ? topic.replies.length : 0} {(Array.isArray(topic.replies) && topic.replies.length === 1) ? 'reply' : 'replies'})
            </h3>

            {(!topic.replies || topic.replies.length === 0) ? (
              <div className="text-center py-8 rounded-xl bg-[#111320] border border-[#1d2235] text-slate-400 text-sm">
                No replies recorded yet. Be the first vault operative to share your thoughts!
              </div>
            ) : (
              <div className="space-y-3">
                {topic.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 rounded-xl bg-[#111422] border border-[#1f2438] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                        />
                        <span className="text-xs font-bold text-white">{reply.author.name}</span>
                        <span className="text-[10px] text-slate-400 bg-[#161a2c] px-1.5 py-0.5 rounded font-mono">
                          {reply.author.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{reply.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-['Inter']">
                      {reply.content}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                      <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmitReply} className="pt-4 border-t border-[#1f2438] space-y-3">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-md object-cover border border-purple-500/40"
              />
              <span className="text-xs font-semibold text-slate-300">
                Reply as <strong className="text-white">{currentUser.name}</strong>
              </span>
            </div>

            <textarea
              rows={3}
              placeholder="Join the discussion... Share your tactics, experience, or opinion respectfully."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-3.5 bg-[#121524] border border-[#232840] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-['Inter']"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-md shadow-purple-900/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Reply</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
