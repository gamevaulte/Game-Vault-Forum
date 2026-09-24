export type ReleaseStatus = 
  | 'Upcoming' 
  | 'Releasing Today' 
  | 'Released' 
  | 'Early Access' 
  | 'Delayed' 
  | 'TBA' 
  | 'Cancelled' 
  | 'Announced';

export type CalendarPlatform = 
  | 'PC' 
  | 'PlayStation 5' 
  | 'PlayStation 4' 
  | 'Xbox Series X/S' 
  | 'Xbox One' 
  | 'Nintendo Switch' 
  | 'Nintendo Switch 2' 
  | 'iOS' 
  | 'Android' 
  | 'Steam Deck' 
  | 'Cloud Gaming';

export type ReleaseGenre = 
  | 'Action' 
  | 'Adventure' 
  | 'RPG' 
  | 'Strategy' 
  | 'Simulation' 
  | 'Sports' 
  | 'Racing' 
  | 'Horror' 
  | 'Fighting' 
  | 'Shooter' 
  | 'Puzzle' 
  | 'Platformer' 
  | 'Survival' 
  | 'MMO' 
  | 'Indie';

export interface GameRelease {
  id: string;
  title: string;
  slug: string;
  releaseDate: string; // YYYY-MM-DD or YYYY-MM or YYYY or TBA
  releaseDateDisplay: string; // e.g. "September 24, 2026" or "Q1 2027" or "TBA"
  releaseTime?: string; // e.g. "16:00 UTC"
  releaseRegion?: string; // e.g. "Worldwide"
  platforms: CalendarPlatform[];
  genre: ReleaseGenre;
  developer: string;
  publisher: string;
  cover: string;
  screenshots?: string[];
  shortDescription: string;
  fullDescription: string;
  status: ReleaseStatus;
  isConfirmed: boolean;
  isEstimated?: boolean;
  previousReleaseDate?: string;
  delayReason?: string;
  dateChanged?: string;
  earlyAccessDate?: string;
  fullReleaseDate?: string;
  officialWebsite?: string;
  trailerUrl?: string;
  storeLinks?: Array<{
    store: 'Steam' | 'PlayStation Store' | 'Xbox Store' | 'Nintendo eShop' | 'Epic Games' | 'GOG';
    url: string;
  }>;
  systemRequirements?: {
    minCpu?: string;
    recCpu?: string;
    minGpu?: string;
    recGpu?: string;
    minRam?: string;
    recRam?: string;
    storage?: string;
  };
  hypeScore?: number; // 1-100
  dataSource?: string;
  lastUpdated?: string;
  relatedGameId?: string; // Links to MOCK_GAMES if present
  relatedArticleSlug?: string;
  relatedVideoId?: string;
  isMajorHighlight?: boolean;
}

export type CalendarViewType = 'month' | 'list' | 'grid';

export interface ReleaseReminder {
  gameId: string;
  gameTitle: string;
  reminderType: 'day_of' | 'day_before' | 'week_before';
  createdAt: string;
}

export interface ReleaseFilterState {
  searchQuery: string;
  platforms: CalendarPlatform[];
  genres: ReleaseGenre[];
  statuses: ReleaseStatus[];
  developer?: string;
  publisher?: string;
  datePreset: 'all' | 'today' | 'this_week' | 'this_month' | 'next_month' | 'next_3_months' | 'next_6_months' | 'this_year' | 'delayed' | 'tba' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  sortBy: 'date_asc' | 'date_desc' | 'popularity' | 'title_asc';
  onlyWatchlist: boolean;
  onlyMajorHighlights: boolean;
}
