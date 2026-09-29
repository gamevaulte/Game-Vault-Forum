export type GenerationMode = 'quick' | 'standard' | 'deep';

export type SpoilerLevel = 'none' | 'light' | 'full' | 'ending';

export type SourceTier = 1 | 2 | 3 | 4;

export interface GameSourceCitation {
  sourceName: string;
  pageTitle: string;
  url: string;
  tier: SourceTier;
  tierLabel: 'Tier 1 — Primary Source' | 'Tier 2 — High-Quality Reference' | 'Tier 3 — Structured Database' | 'Tier 4 — Verified Community';
  informationUsed: string;
  accessedDate?: string;
  isVerified: boolean;
}

export interface GameCharacter {
  name: string;
  role: string;
  affiliation?: string;
  relationship?: string;
  storyImportance: string;
  characterSlug?: string;
}

export interface GameFaction {
  name: string;
  description: string;
  alignment: 'Friendly' | 'Hostile' | 'Neutral' | 'Dynamic';
  storyRole: string;
}

export interface StoryTimelineEvent {
  order: number;
  stage: 'Beginning' | 'Inciting Event' | 'Major Development' | 'Major Conflict' | 'Climax' | 'Ending';
  title: string;
  description: string;
}

export interface GameVersionComparison {
  versionType: 'Original' | 'Remake' | 'Remaster' | 'Definitive Edition' | 'Expansion' | 'DLC';
  title: string;
  releaseYear: number | string;
  platforms: string[];
  keyDifferences: string[];
}

export interface GameDisambiguationOption {
  id: string;
  title: string;
  editionLabel: string;
  releaseYear: number;
  developer: string;
  platforms: string[];
  coverImage: string;
}

export interface VerifiedGameRecord {
  id: string;
  slug: string;
  title: string;
  aliases?: string[];
  editionLabel?: string; // e.g. "Original 2005 Release", "2023 RE Engine Remake"
  releaseDate: string;
  releaseYear: number;
  developer: string;
  publisher: string;
  platforms: string[];
  genres: string[];
  gameModes: string[];
  engine?: string;
  franchise?: string;
  seriesPosition?: string;
  coverImage: string;
  verifiedArtworkUrl?: string;
  shortOverview: string;
  setting: string;
  storyPremise: string;
  characters: GameCharacter[];
  factions?: GameFaction[];
  mainStorySummary: {
    noSpoilers: string;
    lightSpoilers: string;
    fullStory: string;
    endingExplained: string;
  };
  gameplayOverview: string;
  worldEnvironment?: string;
  storyThemes: string[];
  timeline?: StoryTimelineEvent[];
  franchiseContext?: string;
  interpretiveAnalysis?: string;
  sources: GameSourceCitation[];
  versions?: GameVersionComparison[];
  relatedGameIds: string[];
  confidenceLevel: 'High confidence' | 'Good source coverage' | 'Limited verified information';
  confidenceNote: string;
  lastVerifiedDate: string;
  hasDisambiguation?: boolean;
  disambiguationPrompt?: string;
  siblingVersions?: GameDisambiguationOption[];
}

export interface GeneratedGameStoryReport {
  id: string;
  gameId: string;
  gameTitle: string;
  gameSlug: string;
  coverImage: string;
  generationMode: GenerationMode;
  spoilerLevel: SpoilerLevel;
  strictAccuracyMode: boolean;
  confidenceLevel: 'High confidence' | 'Good source coverage' | 'Limited verified information';
  confidenceNote: string;
  
  // Structured Output
  quickOverview: string;
  gameInfo: {
    developer: string;
    publisher: string;
    releaseDate: string;
    releaseYear: number;
    platforms: string[];
    genre: string;
    gameModes: string[];
    engine?: string;
    franchise?: string;
    seriesPosition?: string;
  };
  setting: string;
  storyPremise: string;
  characters: GameCharacter[];
  factions?: GameFaction[];
  mainStory: string;
  gameplayOverview: string;
  worldEnvironment?: string;
  storyThemes: string[];
  timeline?: StoryTimelineEvent[];
  ending?: string;
  franchiseContext?: string;
  interpretiveAnalysis?: string; // Clearly separated when deep analysis is selected
  finalOverview: string;
  sources: GameSourceCitation[];
  versions?: GameVersionComparison[];
  relatedGames: Array<{
    id: string;
    title: string;
    slug: string;
    reason: string;
    coverImage?: string;
  }>;

  // Metadata
  generatedAt: string;
  reportVersion: number;
  userNotes?: string;
  customUserTitle?: string;
  disclaimer: string;
}

export interface UserSavedGameStory {
  id: string;
  userId: string;
  gameId: string;
  gameTitle: string;
  gameSlug: string;
  coverImage: string;
  report: GeneratedGameStoryReport;
  generationMode: GenerationMode;
  spoilerLevel: SpoilerLevel;
  customTitle?: string;
  notes?: string;
  version: number;
  versionsHistory?: Array<{
    version: number;
    updatedAt: string;
    generationMode: GenerationMode;
    spoilerLevel: SpoilerLevel;
    report: GeneratedGameStoryReport;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GameSearchFilter {
  query: string;
  genre?: string;
  platform?: string;
  year?: string;
}

export interface GeneratorAdminStats {
  totalGenerated: number;
  totalSaved: number;
  popularSearches: Array<{ query: string; count: number }>;
  sourceCoverageStats: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    tier4Count: number;
  };
  unsupportedClaimsCaught: number;
  cacheHitRatio: string;
  strictAccuracyEnforcedCount: number;
}
