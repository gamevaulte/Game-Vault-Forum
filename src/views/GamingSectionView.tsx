import React, { useState, useEffect } from 'react';
import { Route } from '../lib/router';
import { User as FirebaseUser } from 'firebase/auth';
import { UserAccount } from '../types';
import {
  GAMING_CATEGORIES,
  PLAYABLE_GAMES,
  getCategoryBySlug,
  getGameBySlug
} from '../data/gamingData';
import { MultiplayerSession } from '../types/gaming';
import {
  getSessionByInviteCode,
  subscribeToSession
} from '../lib/multiplayer';
import { GamingHubView } from '../components/games/GamingHubView';
import { CategoryPageView } from '../components/games/CategoryPageView';
import { GamePlayerContainer } from '../components/games/GamePlayerContainer';
import { MultiplayerInviteModal } from '../components/games/MultiplayerInviteModal';
import { MultiplayerAcceptCard } from '../components/games/MultiplayerAcceptCard';
import { updatePageSeo } from '../lib/seo';
import { ShieldAlert } from 'lucide-react';

interface GamingSectionViewProps {
  route: Extract<Route, { type: 'play-games' | 'play-games-category' | 'play-game' }>;
  onNavigate: (url: string) => void;
  currentUser: FirebaseUser | null;
  userAccount: UserAccount;
  onOpenSignIn: (promptMessage?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GamingSectionView: React.FC<GamingSectionViewProps> = ({
  route,
  onNavigate,
  currentUser,
  userAccount,
  onOpenSignIn,
  onShowToast
}) => {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<MultiplayerSession | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Determine current active category and game based on route
  const currentCategorySlug = route.type === 'play-games' ? null : route.categorySlug;
  const currentGameSlug = route.type === 'play-game' ? route.gameSlug : null;
  const inviteCode = route.type === 'play-game' ? route.inviteCode : null;

  const currentCategory = currentCategorySlug ? getCategoryBySlug(currentCategorySlug) : null;
  const currentGame = currentGameSlug ? getGameBySlug(currentGameSlug) : null;

  // SEO Updates
  useEffect(() => {
    if (currentGame && currentCategory) {
      updatePageSeo({
        title: `${currentGame.title} - Play Free Online | Game Vault`,
        description: `${currentGame.description} Play instantly in browser with keyboard and touch support.`,
        canonicalPath: `/play-games/${currentCategory.slug}/${currentGame.slug}`,
        ogType: 'website'
      });
    } else if (currentCategory) {
      updatePageSeo({
        title: `${currentCategory.title} - Free Online Browser Games | Game Vault`,
        description: `${currentCategory.description} Browse and play ${currentCategory.title} directly in your browser.`,
        canonicalPath: `/play-games/${currentCategory.slug}`,
        ogType: 'website'
      });
    } else {
      updatePageSeo({
        title: 'Play Free Online Browser Games - Arcade, Puzzle & Multiplayer | Game Vault',
        description: 'Explore the Game Vault gaming arena. Free browser games including Arcade, Puzzle, Sports, Strategy, Card, and Head-to-Head Multiplayer duels.',
        canonicalPath: '/play-games',
        ogType: 'website'
      });
    }
  }, [route, currentGame, currentCategory]);

  // Handle invite code resolution & real-time subscription
  useEffect(() => {
    if (!inviteCode) {
      setActiveSession(null);
      return;
    }

    let isMounted = true;
    setInviteError(null);

    async function loadInvite() {
      const session = await getSessionByInviteCode(inviteCode!);
      if (!isMounted) return;

      if (!session) {
        setInviteError('Game invitation not found or has expired.');
        return;
      }

      setActiveSession(session);

      // Listen to real-time session changes
      const unsubscribe = subscribeToSession(session.id, (updated) => {
        if (isMounted) {
          setActiveSession(updated);
        }
      });

      return () => unsubscribe();
    }

    loadInvite();

    return () => {
      isMounted = false;
    };
  }, [inviteCode]);

  return (
    <div className="min-h-screen bg-[#07080E] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* If resolving an invite code and guest has not yet joined */}
        {inviteCode && currentGame && (!activeSession || activeSession.status === 'waiting') && activeSession?.hostId !== currentUser?.uid && (
          <MultiplayerAcceptCard
            inviteCode={inviteCode}
            gameSlug={currentGame.slug}
            gameTitle={currentGame.title}
            currentUser={currentUser}
            onOpenSignIn={() => onOpenSignIn('Sign in or register to accept this game challenge.')}
            onJoined={(joinedSession) => {
              setActiveSession(joinedSession);
              onShowToast('Challenge accepted! Entering battle arena...', 'success');
            }}
            onDecline={() => onNavigate(`/play-games/${currentCategory?.slug || 'multiplayer-games'}/${currentGame.slug}`)}
          />
        )}

        {inviteError && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>{inviteError}</span>
            </div>
            <button
              onClick={() => onNavigate('/play-games')}
              className="py-1 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            >
              Browse Games
            </button>
          </div>
        )}

        {/* View Routing */}
        {route.type === 'play-games' && (
          <GamingHubView
            onSelectCategory={(slug) => onNavigate(`/play-games/${slug}`)}
            onSelectGame={(catSlug, gameSlug) => onNavigate(`/play-games/${catSlug}/${gameSlug}`)}
          />
        )}

        {route.type === 'play-games-category' && currentCategory && (
          <CategoryPageView
            category={currentCategory}
            games={PLAYABLE_GAMES.filter((g) => g.categoryId === currentCategory.id || g.categorySlug === currentCategory.slug)}
            onSelectGame={(gameSlug) => onNavigate(`/play-games/${currentCategory.slug}/${gameSlug}`)}
            onSelectCategory={(catSlug) => onNavigate(`/play-games/${catSlug}`)}
            onBackToHub={() => onNavigate('/play-games')}
          />
        )}

        {route.type === 'play-game' && currentGame && currentCategory && (
          <GamePlayerContainer
            game={currentGame}
            category={currentCategory}
            currentUser={currentUser}
            session={activeSession}
            onOpenInviteModal={() => setInviteModalOpen(true)}
            onOpenSignIn={() => onOpenSignIn('Sign in to invite and duel players online!')}
            onBackToCategory={() => onNavigate(`/play-games/${currentCategory.slug}`)}
            onSelectGame={(slug) => onNavigate(`/play-games/${currentCategory.slug}/${slug}`)}
          />
        )}

        {/* 404 Fallback if invalid category or game slug */}
        {((route.type === 'play-games-category' && !currentCategory) ||
          (route.type === 'play-game' && (!currentGame || !currentCategory))) && (
          <div className="max-w-xl mx-auto text-center py-20 space-y-4">
            <h2 className="text-3xl font-black text-white">Title or Category Not Found</h2>
            <p className="text-sm text-white/60">
              The requested game or category could not be located in the Vault archives.
            </p>
            <button
              onClick={() => onNavigate('/play-games')}
              className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs uppercase tracking-wider transition"
            >
              Return to Vault Games
            </button>
          </div>
        )}

        {/* Multiplayer Invite Modal */}
        {inviteModalOpen && currentGame && (
          <MultiplayerInviteModal
            isOpen={inviteModalOpen}
            onClose={() => setInviteModalOpen(false)}
            gameSlug={currentGame.slug}
            gameTitle={currentGame.title}
            currentUser={currentUser}
            onOpenSignIn={() => onOpenSignIn('Sign in to create invite challenge links.')}
            onSessionReady={(createdSession) => {
              setActiveSession(createdSession);
              setInviteModalOpen(false);
              onShowToast('Multiplayer room ready! Waiting for opponent...', 'success');
            }}
          />
        )}
      </div>
    </div>
  );
};
