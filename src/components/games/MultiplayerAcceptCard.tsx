import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Swords, Users, Clock, AlertTriangle, CheckCircle, ArrowRight, ShieldAlert, Sparkles, LogIn } from 'lucide-react';
import { MultiplayerSession } from '../../types/gaming';
import { getSessionByInviteCode, acceptInvitation } from '../../lib/multiplayer';

interface MultiplayerAcceptCardProps {
  inviteCode: string;
  gameSlug: string;
  gameTitle: string;
  currentUser: FirebaseUser | null;
  onOpenSignIn: () => void;
  onJoined: (session: MultiplayerSession) => void;
  onDecline: () => void;
}

export const MultiplayerAcceptCard: React.FC<MultiplayerAcceptCardProps> = ({
  inviteCode,
  gameSlug,
  gameTitle,
  currentUser,
  onOpenSignIn,
  onJoined,
  onDecline
}) => {
  const [session, setSession] = useState<MultiplayerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMessage(null);

    getSessionByInviteCode(inviteCode)
      .then((found) => {
        if (!isMounted) return;
        if (!found) {
          setErrorMessage('Invitation not found. The code may be invalid or expired.');
        } else {
          setSession(found);
          // Check expiration
          if (new Date(found.expiresAt) < new Date()) {
            setErrorMessage('This game invitation has expired (valid for 24 hours).');
          } else if (found.status === 'cancelled') {
            setErrorMessage('The host has cancelled this game session.');
          } else if (found.status === 'completed') {
            setErrorMessage('This game session has already finished.');
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching invitation:', err);
        setErrorMessage('Failed to load invitation. Please check your connection.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [inviteCode]);

  const handleAccept = async () => {
    if (!session) return;
    if (!currentUser) {
      onOpenSignIn();
      return;
    }

    // Check if host is attempting to accept their own invite
    if (session.hostId === currentUser.uid) {
      // Host re-entering their own game
      onJoined(session);
      return;
    }

    setJoining(true);
    const res = await acceptInvitation(session.id, {
      uid: currentUser.uid,
      displayName: currentUser.displayName || 'Vault Challenger',
      username: currentUser.email ? `@${currentUser.email.split('@')[0]}` : '@operative',
      avatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    });

    setJoining(false);
    if (res.success && res.session) {
      onJoined(res.session);
    } else {
      setErrorMessage(res.error || 'Could not join session.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-[#0F0F17] border border-purple-500/20 text-center text-white space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-white/70">Connecting to Game Vault matchmaking server...</p>
      </div>
    );
  }

  if (errorMessage || !session) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-[#0F0F17] border border-rose-500/30 text-center text-white space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Invalid or Expired Invitation</h3>
          <p className="text-sm text-white/70 max-w-md mx-auto">{errorMessage}</p>
        </div>
        <div className="pt-2">
          <button
            onClick={onDecline}
            className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition"
          >
            Return to Gaming Hub
          </button>
        </div>
      </div>
    );
  }

  const isHost = currentUser && session.hostId === currentUser.uid;
  const isAlreadyFull = session.guestId && (!currentUser || session.guestId !== currentUser.uid);

  return (
    <div className="max-w-xl mx-auto my-8 p-6 md:p-8 rounded-2xl bg-[#0F0F17] border border-purple-500/30 text-white shadow-2xl shadow-purple-950/50 space-y-6">
      {/* Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
              Live Duel Invitation
            </span>
            <h3 className="text-xl font-bold text-white">{session.gameTitle || gameTitle}</h3>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-300">
          Code: {session.inviteCode}
        </span>
      </div>

      {/* Host Information Card */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-4">
        <img
          src={session.host.avatar}
          alt={session.host.displayName}
          className="w-14 h-14 rounded-full border-2 border-purple-500 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-purple-300 font-medium">Challenged by</div>
          <div className="text-base font-bold text-white truncate">{session.host.displayName}</div>
          <div className="text-xs text-white/50">{session.host.username}</div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-white/40 block">Created</span>
          <span className="text-xs text-white/70 font-medium">
            {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Game Details Summary */}
      <div className="text-sm text-white/80 leading-relaxed bg-purple-950/20 p-4 rounded-xl border border-purple-500/20">
        <p>
          You have been invited to an authenticated head-to-head match of <strong className="text-purple-300">{session.gameTitle}</strong>.
          Moves and turns are synchronized in real-time.
        </p>
      </div>

      {/* State notices */}
      {isHost ? (
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2.5">
          <Users className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong>You are the host of this session.</strong> If you want to enter the lobby or resume your game, click Enter Session below.
          </div>
        </div>
      ) : isAlreadyFull ? (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Session Full.</strong> Another player has already accepted this invitation.
          </div>
        </div>
      ) : !currentUser ? (
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2.5">
          <LogIn className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong>Sign-in Required:</strong> Please log in or sign up to accept this multiplayer invitation and record match stats.
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!currentUser ? (
          <button
            onClick={onOpenSignIn}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            Sign In to Accept Duel
          </button>
        ) : isAlreadyFull ? (
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition"
          >
            Return to Games
          </button>
        ) : (
          <button
            onClick={handleAccept}
            disabled={joining}
            className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {joining ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Joining Duel...
              </span>
            ) : isHost ? (
              <>
                <span>Enter Game Room</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                <span>Accept Challenge & Play</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onDecline}
          className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium text-sm transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
