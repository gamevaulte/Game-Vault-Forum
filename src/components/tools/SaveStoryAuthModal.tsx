import React from 'react';
import { ShieldCheck, BookOpen, Download, Bookmark, X, Sparkles, UserPlus, LogIn } from 'lucide-react';

interface SaveStoryAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  onOpenSignIn: () => void;
  pendingAction?: 'save' | 'download' | null;
}

export const SaveStoryAuthModal: React.FC<SaveStoryAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
  onOpenSignIn,
  pendingAction = 'save'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg p-6 sm:p-8 bg-[#0b0d17] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/50 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
            {pendingAction === 'download' ? (
              <Download className="w-6 h-6 text-cyan-400" />
            ) : (
              <Bookmark className="w-6 h-6 text-purple-400" />
            )}
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Member Privilege
            </span>
            <div className="text-xs text-slate-400 mt-0.5">Free Registration • Instant Access</div>
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight mb-2">
          Save Your Game Story
        </h2>
        
        <p className="text-sm text-slate-300 font-['Inter'] leading-relaxed mb-6">
          Create a free Game Vault Forum account to save and download your generated game stories and overviews. Build a personal narrative library, compare report versions, export high-resolution PDFs, and access your saved research from any device.
        </p>

        {/* Perks list */}
        <div className="space-y-2.5 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Private Library:</strong> Your saved stories are strictly private to your account.</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>Multi-Format Exports:</strong> Download in PDF, DOCX, Markdown, and TXT.</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
            <span><strong>Version History:</strong> Regenerate stories with newer information without losing older drafts.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up Free
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenSignIn();
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4 text-slate-300" />
              Sign In
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Continue Browsing Without Saving
          </button>
        </div>
      </div>
    </div>
  );
};
