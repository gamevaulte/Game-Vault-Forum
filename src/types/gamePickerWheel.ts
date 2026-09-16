export interface WheelGameEntry {
  id: string;
  name: string;
  color?: string;
  weight?: number;
  addedAt?: number;
}

export interface WheelPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  games: string[];
  iconName?: string;
}

export interface SpinHistoryItem {
  id: string;
  gameName: string;
  timestamp: number;
  formattedTime: string;
}

export interface WheelSettings {
  spinDuration: 'short' | 'normal' | 'long'; // 3s, 5s, 8s
  removeWinnerAfterSpin: boolean;
  soundEffects: boolean; // default false per requirement 10
  celebrationAnimation: boolean;
}

export interface SavedWheel {
  id: string;
  name: string;
  games: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isCloudSynced?: boolean;
}

export interface AiGameSuggestion {
  title: string;
  genre?: string;
  reason?: string;
  isVerified?: boolean;
}
