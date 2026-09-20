import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Users, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { MultiplayerSession } from '../../types/gaming';
import { createMultiplayerSession, subscribeToSession, cancelSession } from '../../lib/multiplayer';

interface MultiplayerInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameSlug: string;
  gameTitle: string;
  currentUser: FirebaseUser | null;
  onOpenSignIn: () => void;
  onSessionReady: (session: MultiplayerSession) => void;
}

export const MultiplayerInviteModal: React.FC<MultiplayerInviteModalProps> = ({
  isOpen,
  onClose,
  gameSlug,
  gameTitle,
  currentUser,
  onOpenSignIn,
  onSessionReady
}) => {
  const [session, setSession] = useState<MultiplayerSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session when modal opens and user is logged in
  useEffect(() => {
    if (!isOpen) {
      setSession(null);
      setError(null);
      return;
    }

    if (!currentUser) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    createMultiplayerSession({
      gameId: gameSlug,
      gameSlug,
      gameTitle,
      hostUser: {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Vault Commander',
        username: currentUser.email ? `@${currentUser.email.split('@')[0]}` : '@operative',
        avatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      }
    })
      .then((newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error creating multiplayer session:', err);
        setError('Unable to initialize game session. Please check your connection and try again.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUser, gameSlug, gameTitle]);

  // Subscribe to real-time session updates to detect when a player joins
  useEffect(() => {
    if (!session || !session.id) return;

    const unsubscribe = subscribeToSession(session.id, (updatedSession) => {
      setSession(updatedSession);
      // When guest has accepted and joined, automatically begin match
      if (updatedSession.status === 'in_progress' && updatedSession.guestId) {
        onSessionReady(updatedSession);
        onClose();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [session?.id, onSessionReady, onClose]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gamevault.forum';
  const inviteUrl = session 
    ? `${origin}/play-games/multiplayer-games/${gameSlug}/invite/${session.inviteCode}`
    : '';

  const handleCopyLink = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = inviteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && inviteUrl) {
      try {
        await navigator.share({
          title: `Play ${gameTitle} on Game Vault`,
          text: `I challenge you to a live online match of ${gameTitle} on Game Vault Forum! Click to accept:`,
          url: inviteUrl
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCancel = async () => {
    if (session) {
      await cancelSession(session.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        id="multiplayer-invite-card"
        className="relative w-full max-w-lg bg-[#0F0F17] border border-purple-500/30 rounded-2xl p-6 md:p-8 text-white shadow-2xl shadow-purple-950/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Invite a Friend
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                  Live Multiplayer
                </span>
              </h3>
              <p className="text-xs text-white/60">Challenge another player to {gameTitle}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest / Unauthenticated State */}
        {!currentUser ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-400">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">Sign In Required</h4>
              <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                To create and host live multiplayer duels with unique invitation tokens, you must be signed in to your Game Vault account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSignIn();
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-semibold text-white shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Sign In or Create Account
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium transition"
              >
                Play Against AI Instead
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm text-white/70 font-medium">Generating encrypted multiplayer room...</p>
          </div>
        ) : error ? (
          <div className="py-6 space-y-4 text-center">
            <div className="flex items-center justify-center text-rose-400 gap-2 text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleCancel}
              className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition"
            >
              Close
            </button>
          </div>
        ) : session ? (
          <div className="space-y-6">
            {/* Invite Token Showcase */}
            <div className="p-4 rounded-xl bg-black/40 border border-purple-500/20 text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                Your Unique Invite Code
              </span>
              <div className="text-3xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                {session.inviteCode}
              </div>
              <p className="text-xs text-white/50">
                Share this link or code with a friend. Once they open it and join, the duel starts immediately!
              </p>
            </div>

            {/* Invitation Link Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/70">Unique Game Invitation Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white/90 font-mono focus:outline-none focus:border-purple-500 truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition whitespace-nowrap ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied Link!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Waiting Radar Status Indicator */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full bg-purple-500/40 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              </div>
              <div className="text-xs text-white/80">
                <span className="font-semibold text-white">Lobby Active: </span>
                Waiting for friend to accept invitation...
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleNativeShare}
                className="flex-1 py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" />
                Share Invitation
              </button>
              <button
                onClick={handleCancel}
                className="py-3 px-5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-sm transition"
              >
                Cancel Session
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
