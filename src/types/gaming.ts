export type GamingCategoryId =
  | 'arcade-games'
  | 'puzzle-games'
  | 'sports-games'
  | 'strategy-games'
  | 'multiplayer-games'
  | 'card-and-board-games';

export interface GamingCategory {
  id: GamingCategoryId;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  bannerImage: string;
  gameCount: number;
}

export interface PlayableGameControl {
  key: string;
  action: string;
}

export type PlayableGame = PlayableGameMeta;

export interface PlayableGameMeta {
  id: string;
  slug: string;
  title: string;
  categoryId: GamingCategoryId;
  categoryName: string;
  categorySlug: string;
  tagline: string;
  description: string;
  howToPlay: string[];
  controls: PlayableGameControl[];
  thumbnail: string;
  supportsMultiplayer: boolean;
  difficulty: 'Casual' | 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  playUrl: string;
  features: string[];
}

export type MultiplayerSessionStatus =
  | 'waiting'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export interface MultiplayerPlayer {
  uid: string;
  displayName: string;
  username: string;
  avatar: string;
  role: string;
  score?: number;
  isReady?: boolean;
}

export interface MultiplayerSession {
  id: string;
  gameId: string;
  gameSlug: string;
  gameTitle: string;
  inviteCode: string;
  hostId: string;
  host: MultiplayerPlayer;
  guestId: string | null;
  guest: MultiplayerPlayer | null;
  status: MultiplayerSessionStatus;
  playerRoles: {
    hostRole: string; // e.g., 'red' | 'X'
    guestRole: string; // e.g., 'yellow' | 'O'
  };
  currentTurn: 'host' | 'guest';
  gameState: any; // Board, moves, game-specific data
  winner: 'host' | 'guest' | 'draw' | null;
  winningLine?: number[] | [number, number][];
  moveCount: number;
  moveHistory?: Array<{
    player: 'host' | 'guest';
    move: any;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  lastActivityAt: string;
}

export interface ValidateMoveRequest {
  sessionId: string;
  gameSlug: string;
  playerId: string;
  playerRole: 'host' | 'guest';
  move: any;
}

export interface ValidateMoveResponse {
  valid: boolean;
  error?: string;
  nextState?: any;
  nextTurn?: 'host' | 'guest';
  winner?: 'host' | 'guest' | 'draw' | null;
  winningLine?: any;
  isGameOver?: boolean;
}
