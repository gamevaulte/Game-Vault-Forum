import React, { useState } from 'react';
import { X, ShieldAlert, Plus, Trash2, Check, Save } from 'lucide-react';
import { BANNED_WORDS } from '../../data/usernameWordsData';

interface AdminUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AdminUsernameModal: React.FC<AdminUsernameModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [bannedList, setBannedList] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gvf_admin_banned_words_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return BANNED_WORDS;
  });

  const [newBannedWord, setNewBannedWord] = useState('');
  const [activeTab, setActiveTab] = useState<'blacklist' | 'rules' | 'metrics'>('blacklist');

  if (!isOpen) return null;

  const handleAddBanned = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newBannedWord.trim().toLowerCase();
    if (!clean || bannedList.includes(clean)) return;

    const updated = [...bannedList, clean];
    setBannedList(updated);
    setNewBannedWord('');
    localStorage.setItem('gvf_admin_banned_words_v1', JSON.stringify(updated));
    onShowToast(`Word "${clean}" added to generator blacklist.`, 'success');
  };

  const handleRemoveBanned = (word: string) => {
    const updated = bannedList.filter(w => w !== word);
    setBannedList(updated);
    localStorage.setItem('gvf_admin_banned_words_v1', JSON.stringify(updated));
    onShowToast(`Word "${word}" removed from blacklist.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0f111d] border border-purple-500/40 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Username Generator Policy & Word Moderation
              </h3>
              <p className="text-xs text-slate-400">
                Manage blacklists, safety filters, and generation rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('blacklist')}
            className={`px-3 py-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === 'blacklist' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Banned Terms Filter ({bannedList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === 'rules' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety Constraints & Policy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeTab === 'blacklist' ? (
            <div className="space-y-4">
              <form onSubmit={handleAddBanned} className="flex gap-2">
                <input
                  type="text"
                  value={newBannedWord}
                  onChange={(e) => setNewBannedWord(e.target.value)}
                  placeholder="Enter word to block from generation..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Block Term</span>
                </button>
              </form>

              <div className="p-3 bg-black/30 rounded-xl border border-white/5 max-h-60 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {bannedList.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/50 border border-red-800/40 text-red-300 text-xs font-mono"
                    >
                      <span>{word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBanned(word)}
                        className="text-red-400 hover:text-white cursor-pointer"
                        title="Remove block"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-slate-300 font-['Inter'] leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
              <h4 className="font-bold text-white text-sm font-['Space_Grotesk'] mb-2">
                Active Content Safeguards
              </h4>
              <p>
                1. <strong>Profanity Prevention</strong>: All prefixes, roots, and suffixes undergo string-level substring and leetspeak parsing before rendering to the client.
              </p>
              <p>
                2. <strong>Keyword Sanitization</strong>: User-submitted keywords are stripped of non-alphanumeric special characters and checked against the banned lexicon.
              </p>
              <p>
                3. <strong>Availability Transparency</strong>: The tool strictly prevents synthetic claims of platform availability, adhering to the disclaimer mandate: <em>"Availability depends on the platform you want to use this name on."</em>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
