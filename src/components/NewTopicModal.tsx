import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { MOCK_FORUM_CATEGORIES } from '../data/mockData';
import { ForumTopic, UserAccount } from '../types';

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  onCreateTopic: (newTopic: Partial<ForumTopic>) => void;
}

export const NewTopicModal: React.FC<NewTopicModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isSignedIn = false,
  onOpenSignIn,
  onCreateTopic
}) => {
  const [category, setCategory] = useState('General Gaming');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [guestCallsign, setGuestCallsign] = useState(() => {
    return localStorage.getItem('gv_guest_callsign') || 'Guest Operative';
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const authorName = isSignedIn ? currentUser.name : (guestCallsign.trim() || 'Guest Operative');
    const authorAvatar = isSignedIn
      ? currentUser.avatar
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    const authorBadge = isSignedIn ? currentUser.badge : 'Guest Operative';

    onCreateTopic({
      title: title.trim(),
      category,
      tags: parsedTags.length > 0 ? parsedTags : ['Discussion'],
      initialPost: content.trim(),
      author: {
        name: authorName,
        avatar: authorAvatar,
        badge: authorBadge,
        isStaff: false
      }
    });

    setTitle('');
    setTagsInput('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2438] bg-[#121524]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-white">
              Start a New Forum Topic
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#1a1d2e] hover:bg-[#23273e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Forum Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#121524] border border-[#232840] rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
            >
              {MOCK_FORUM_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Topic Title
            </label>
            <input
              type="text"
              placeholder="e.g., Best weapons for Scadutree avatars in Elden Ring DLC?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#121524] border border-[#232840] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Elden Ring, Build, Tips, Boss"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#121524] border border-[#232840] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Topic Body Content */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Topic Discussion & Details
            </label>
            <textarea
              rows={5}
              placeholder="Write your question, analysis, or conversation starter..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3.5 bg-[#121524] border border-[#232840] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-['Inter']"
            />
          </div>

          {/* User info note */}
          {isSignedIn ? (
            <div className="flex items-center gap-2 p-3 bg-[#131728] border border-[#222944] rounded-xl text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                Posting publicly as <strong className="text-white">{currentUser.name}</strong> ({currentUser.badge}). Respect the Game Vault community rules.
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#131728] border border-[#222944] rounded-xl text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-purple-300 font-bold uppercase tracking-wider font-['Rajdhani']">Callsign:</span>
                <input
                  type="text"
                  value={guestCallsign}
                  onChange={(e) => {
                    setGuestCallsign(e.target.value);
                    try { localStorage.setItem('gv_guest_callsign', e.target.value); } catch {}
                  }}
                  className="px-2.5 py-1 bg-black/40 border border-purple-500/30 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
              {onOpenSignIn && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSignIn();
                  }}
                  className="text-purple-300 hover:text-white underline cursor-pointer text-[11px]"
                >
                  Sign in for Verified Badge
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-md shadow-purple-900/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Topic</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
