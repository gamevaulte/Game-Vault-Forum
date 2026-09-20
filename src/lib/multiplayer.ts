import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { MultiplayerSession, MultiplayerPlayer, MultiplayerSessionStatus } from '../types/gaming';

/**
 * Generate a clean, distinctive, alphanumeric 6-character invitation code
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Initial game state generator for supported multiplayer games
 */
export function getInitialGameState(gameSlug: string): any {
  if (gameSlug === 'connect-four') {
    // 6 rows x 7 columns grid (0 = empty, 1 = host/red, 2 = guest/yellow)
    const grid: number[][] = Array(6).fill(null).map(() => Array(7).fill(0));
    return {
      grid,
      lastMove: null
    };
  }
  if (gameSlug === 'tic-tac-toe') {
    // 3x3 board (null = empty, 'X' = host, 'O' = guest)
    return {
      board: Array(9).fill(null),
      gridSize: 3,
      winningLine: null
    };
  }
  if (gameSlug === 'naval-duel') {
    // 8x8 ocean grid for both players
    return {
      hostGrid: Array(64).fill(0), // 0=empty, 1=ship, 2=hit, 3=miss
      guestGrid: Array(64).fill(0),
      hostShipsPlaced: true, // auto or manual
      guestShipsPlaced: false,
      hostFleetRemaining: 5,
      guestFleetRemaining: 5
    };
  }
  return {
    board: null
  };
}

/**
 * Create a new multiplayer session in Firestore
 */
export async function createMultiplayerSession(params: {
  gameId: string;
  gameSlug: string;
  gameTitle: string;
  hostUser: {
    uid: string;
    displayName: string;
    username: string;
    avatar: string;
  };
}): Promise<MultiplayerSession> {
  const inviteCode = generateInviteCode();
  const sessionId = `session_${Date.now()}_${inviteCode.toLowerCase()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours expiry
  const nowIso = now.toISOString();

  const hostPlayer: MultiplayerPlayer = {
    uid: params.hostUser.uid,
    displayName: params.hostUser.displayName || 'Vault Operative',
    username: params.hostUser.username || '@operative',
    avatar: params.hostUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'host',
    score: 0,
    isReady: true
  };

  const initialRoles = params.gameSlug === 'tic-tac-toe' 
    ? { hostRole: 'X', guestRole: 'O' }
    : { hostRole: 'red', guestRole: 'yellow' };

  const session: MultiplayerSession = {
    id: sessionId,
    gameId: params.gameId,
    gameSlug: params.gameSlug,
    gameTitle: params.gameTitle,
    inviteCode,
    hostId: params.hostUser.uid,
    host: hostPlayer,
    guestId: null,
    guest: null,
    status: 'waiting',
    playerRoles: initialRoles,
    currentTurn: 'host',
    gameState: getInitialGameState(params.gameSlug),
    winner: null,
    moveCount: 0,
    moveHistory: [],
    createdAt: nowIso,
    updatedAt: nowIso,
    expiresAt,
    lastActivityAt: nowIso
  };

  const path = `game_sessions/${sessionId}`;
  try {
    await setDoc(doc(db, 'game_sessions', sessionId), session);
    // Cache locally for instant resilience
    try {
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify(session));
      localStorage.setItem(`gv_session_code_${inviteCode}`, sessionId);
    } catch {}
    return session;
  } catch (error) {
    console.warn('Firestore session create fallback:', error);
    try {
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify(session));
      localStorage.setItem(`gv_session_code_${inviteCode}`, sessionId);
    } catch {}
    return session;
  }
}

/**
 * Fetch a session by its unique invitation code
 */
export async function getSessionByInviteCode(inviteCode: string): Promise<MultiplayerSession | null> {
  const cleanCode = inviteCode.trim().toUpperCase();
  try {
    const q = query(collection(db, 'game_sessions'), where('inviteCode', '==', cleanCode));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as MultiplayerSession;
    }
  } catch (error) {
    console.warn('Error querying session by invite code:', error);
  }

  // Check local cache fallback
  try {
    const cachedId = localStorage.getItem(`gv_session_code_${cleanCode}`);
    if (cachedId) {
      const raw = localStorage.getItem(`gv_session_${cachedId}`);
      if (raw) return JSON.parse(raw);
    }
  } catch {}

  return null;
}

/**
 * Fetch a session by ID
 */
export async function getSessionById(sessionId: string): Promise<MultiplayerSession | null> {
  try {
    const snap = await getDoc(doc(db, 'game_sessions', sessionId));
    if (snap.exists()) {
      return snap.data() as MultiplayerSession;
    }
  } catch (error) {
    console.warn('Error fetching session by ID:', error);
  }

  try {
    const raw = localStorage.getItem(`gv_session_${sessionId}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  return null;
}

/**
 * Subscribe to real-time updates for a multiplayer session
 */
export function subscribeToSession(
  sessionId: string,
  onUpdate: (session: MultiplayerSession) => void,
  onError?: (err: any) => void
): () => void {
  const path = `game_sessions/${sessionId}`;
  try {
    const docRef = doc(db, 'game_sessions', sessionId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as MultiplayerSession;
          onUpdate(data);
          try {
            localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify(data));
          } catch {}
        }
      },
      (error) => {
        console.warn('Session onSnapshot listener note:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach session listener:', err);
    return () => {};
  }
}

/**
 * Accept an invitation as guest
 */
export async function acceptInvitation(
  sessionId: string,
  guestUser: {
    uid: string;
    displayName: string;
    username: string;
    avatar: string;
  }
): Promise<{ success: boolean; error?: string; session?: MultiplayerSession }> {
  const session = await getSessionById(sessionId);
  if (!session) {
    return { success: false, error: 'The game invitation could not be found or has expired.' };
  }

  if (session.status === 'cancelled') {
    return { success: false, error: 'This game invitation was cancelled by the host.' };
  }

  if (session.status === 'completed') {
    return { success: false, error: 'This game has already been completed.' };
  }

  if (new Date(session.expiresAt) < new Date()) {
    return { success: false, error: 'This game invitation link has expired.' };
  }

  if (session.hostId === guestUser.uid) {
    return { success: false, error: 'You cannot accept your own invitation.' };
  }

  if (session.guestId && session.guestId !== guestUser.uid) {
    return { success: false, error: 'This game session is already full with two players.' };
  }

  const guestPlayer: MultiplayerPlayer = {
    uid: guestUser.uid,
    displayName: guestUser.displayName || 'Vault Challenger',
    username: guestUser.username || '@challenger',
    avatar: guestUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    role: 'guest',
    score: 0,
    isReady: true
  };

  const updates: Partial<MultiplayerSession> = {
    guestId: guestUser.uid,
    guest: guestPlayer,
    status: 'in_progress',
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString()
  };

  try {
    await updateDoc(doc(db, 'game_sessions', sessionId), updates);
    const updatedSession = { ...session, ...updates };
    try {
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify(updatedSession));
    } catch {}
    return { success: true, session: updatedSession };
  } catch (err) {
    console.warn('Update error on accepting invite:', err);
    // Fallback for offline/preview
    const updatedSession = { ...session, ...updates };
    try {
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify(updatedSession));
    } catch {}
    return { success: true, session: updatedSession };
  }
}

/**
 * Cancel a session (host only)
 */
export async function cancelSession(sessionId: string): Promise<void> {
  const updates: Partial<MultiplayerSession> = {
    status: 'cancelled',
    updatedAt: new Date().toISOString()
  };
  try {
    await updateDoc(doc(db, 'game_sessions', sessionId), updates);
  } catch {}
  try {
    const raw = localStorage.getItem(`gv_session_${sessionId}`);
    if (raw) {
      const s = JSON.parse(raw);
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify({ ...s, ...updates }));
    }
  } catch {}
}

/**
 * Make a turn move in a session
 */
export async function submitTurnMove(
  sessionId: string,
  player: 'host' | 'guest',
  newGameState: any,
  nextTurn: 'host' | 'guest',
  winner: 'host' | 'guest' | 'draw' | null = null,
  winningLine?: any
): Promise<void> {
  const isCompleted = winner !== null;
  const updates: any = {
    gameState: newGameState,
    currentTurn: isCompleted ? 'host' : nextTurn,
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString()
  };

  if (isCompleted) {
    updates.winner = winner;
    updates.status = 'completed';
    if (winningLine) updates.winningLine = winningLine;
  }

  try {
    await updateDoc(doc(db, 'game_sessions', sessionId), updates);
  } catch (err) {
    console.warn('submitTurnMove Firestore update note:', err);
  }

  try {
    const raw = localStorage.getItem(`gv_session_${sessionId}`);
    if (raw) {
      const s = JSON.parse(raw);
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify({ ...s, ...updates }));
    }
  } catch {}
}

/**
 * Convenient wrapper for accepting a game challenge
 */
export async function acceptGameInvitation(
  sessionId: string,
  guestUid: string,
  guestDisplayName: string,
  guestUsername?: string,
  guestAvatar?: string
): Promise<{ success: boolean; error?: string; session?: MultiplayerSession }> {
  return acceptInvitation(sessionId, {
    uid: guestUid,
    displayName: guestDisplayName,
    username: guestUsername || `@${guestDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    avatar: guestAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
  });
}

/**
 * Make an authoritative move in an active multiplayer session
 */
export async function makeSessionMove(
  sessionId: string,
  playerId: string,
  move: any
): Promise<{ success: boolean; error?: string; session?: MultiplayerSession }> {
  const session = await getSessionById(sessionId);
  if (!session) {
    return { success: false, error: 'Game session not found.' };
  }

  const isHost = session.hostId === playerId;
  const isGuest = session.guestId === playerId;

  if (!isHost && !isGuest) {
    return { success: false, error: 'You are not a registered player in this duel.' };
  }

  const role: 'host' | 'guest' = isHost ? 'host' : 'guest';
  if (session.currentTurn !== role) {
    return { success: false, error: "Wait for your opponent's turn to finish." };
  }

  // Call authoritative backend validation
  try {
    const res = await fetch('/api/games/validate-move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameSlug: session.gameSlug,
        gameState: session.gameState,
        playerRole: role,
        move
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Move rejected by server.' };
    }

    const validation = await res.json();
    if (!validation.valid) {
      return { success: false, error: validation.error || 'Invalid move according to rules.' };
    }

    const isCompleted = validation.winner !== null && validation.winner !== undefined;
    const updates: Partial<MultiplayerSession> = {
      gameState: validation.nextState ?? session.gameState,
      currentTurn: isCompleted ? 'host' : (validation.nextTurn || (role === 'host' ? 'guest' : 'host')),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      moveCount: (session.moveCount || 0) + 1
    };

    if (isCompleted) {
      updates.winner = validation.winner;
      updates.status = 'completed';
      if (validation.winningLine) {
        updates.winningLine = validation.winningLine;
      }
    }

    try {
      await updateDoc(doc(db, 'game_sessions', sessionId), updates);
    } catch {}

    const updated = { ...session, ...updates };
    try {
      localStorage.setItem(`gv_session_${sessionId}`, JSON.stringify(updated));
    } catch {}

    return { success: true, session: updated };
  } catch (err: any) {
    console.warn('makeSessionMove error:', err);
    return { success: false, error: err?.message || 'Failed to submit move.' };
  }
}
