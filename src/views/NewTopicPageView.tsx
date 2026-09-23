import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ShieldAlert, 
  LogIn 
} from 'lucide-react';
import { MOCK_FORUM_CATEGORIES } from '../data/mockData';
import { ForumTopic, UserAccount, PageTab } from '../types';

interface NewTopicPageViewProps {
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onCreateTopic: (newTopic: Partial<ForumTopic>) => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const NewTopicPageView: React.FC<NewTopicPageViewProps> = ({
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onCreateTopic,
  onBack,
  onNavigateTab
}) => {
  const [category, setCategory] = useState('General Gaming');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onCreateTopic({
      title: title.trim(),
      category,
      tags: parsedTags.length > 0 ? parsedTags : ['Discussion'],
      initialPost: content.trim(),
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        badge: currentUser.badge || 'Verified Operative',
        isStaff: currentUser.isStaff || false
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Forum Discussions</span>
        </button>

        <div className="text-xs text-gray-500 font-mono">
          URL: /forum/new
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="border-b border-white/10 pb-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Game Vault Community Forum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Start a New Tactical Discussion
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Share technical mechanics, balance critiques, lore discoveries, or strategic guides with the Game Vault community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Author Badge or Sign-in Required Banner */}
          {isSignedIn ? (
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
              />
              <div>
                <span className="text-xs font-semibold text-white font-['Space_Grotesk'] block">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-purple-300 font-mono">
                  Verified Operative ({currentUser.badge || 'Recruit'})
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-black border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0" />
                  <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    Member Registration Required to Post Discussions
                  </h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Visitors can interact with forum discussions and post new topics only when registered and signed in. Sign in or register to publish your topic.
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
          )}

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300">
              Forum Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              {MOCK_FORUM_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name} className="bg-[#0e101a] text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

            {/* Topic Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300">
                Discussion Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Tactical breakdown of upcoming patch changes..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-['Space_Grotesk']"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., Guides, Strategy, PatchNotes"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300">
                Opening Post Content
              </label>
              <textarea
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your detailed analysis, questions, or perspectives here..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-['Inter']"
              />
            </div>

            {/* Guidelines Reminder */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs text-gray-400">
              <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Remember to uphold civil discourse. Disagree with ideas with tactical civility, not with players. All posts are bound by the Game Vault Guidelines.
              </span>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Discussion</span>
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};
