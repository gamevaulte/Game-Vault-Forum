export type PageTab = 
  | 'home' 
  | 'videos' 
  | 'games' 
  | 'articles' 
  | 'reviews' 
  | 'guides' 
  | 'forum' 
  | 'about' 
  | 'contact' 
  | 'pc-requirements'
  | 'tools'
  | 'gaming-username-generator'
  | 'gaming-pc-builder'
  | 'vault-ai'
  | 'sitemap'
  | 'new-topic'
  | 'profile'
  | 'guidelines'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'login'
  | 'register';

export interface VaultAiAction {
  id: string;
  type: 'navigate' | 'requirements' | 'pc_build' | 'search' | 'video' | 'review' | 'guide' | 'topic' | 'generate_tag' | 'quick_task' | 'auth';
  label: string;
  target: string;
  payload?: any;
}

export interface VaultAiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{ title: string; url: string; category?: string }>;
  cardIds?: {
    games?: string[];
    articles?: string[];
    videos?: string[];
    hardware?: string[];
  };
  actions?: VaultAiAction[];
  isError?: boolean;
}

export interface VaultAiConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: VaultAiMessage[];
}

export interface VaultAiContext {
  currentPage?: string;
  selectedGame?: string;
  userPcSpec?: any;
  builderBudget?: string;
  assistiveTask?: string;
  isGuest?: boolean;
  isSignedIn?: boolean;
  userName?: string;
}

export type GameGenre = 
  | 'All'
  | 'Action'
  | 'Adventure'
  | 'RPG'
  | 'Strategy'
  | 'Simulation'
  | 'Multiplayer'
  | 'FPS'
  | 'Sports'
  | 'Racing';

export type Platform = 'All' | 'PC' | 'PS5' | 'Xbox' | 'Switch' | 'Mobile';

export interface Video {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  game: string;
  uploadDate: string;
  views: string;
  duration: string;
  youtubeId: string;
  youtubeUrl?: string;
  summary?: string;
  keyTakeaways?: string[];
  chapters?: { timestamp: string; title: string }[];
  category: 'Gameplay' | 'Deep Dive' | 'Review' | 'Guide' | 'Tech';
  isFeatured?: boolean;
  thumbnail: string;
  likes: number;
  comments?: PostComment[];
}

export interface Game {
  id: string;
  title: string;
  genre: GameGenre;
  platforms: string[];
  shortDescription: string;
  fullDescription: string;
  releaseYear: string;
  developer: string;
  publisher: string;
  rating: number; // 0-10
  artwork: string;
  tags: string[];
  featured?: boolean;
}

export interface Article {
  id: string;
  slug?: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  category: 'Gaming News' | 'Opinions' | 'Gaming Culture' | 'Industry' | 'Tips' | 'Features' | 'Gaming Stories' | 'Tactical Analysis' | 'Hardware Guides' | 'Hardware';
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publicationDate: string;
  readingTime: string;
  featuredImage: string;
  image?: string; // alias for featuredImage
  tags: string[];
  views: string;
  likes: number;
  comments?: ArticleComment[];
  relatedArticleId?: string;
  relatedArticlePrompt?: string;
}

export interface PostComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export type ArticleComment = PostComment;
export type VideoComment = PostComment;

export type ScoreLabel = 'Masterpiece' | 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Not Recommended';

export interface Review {
  id: string;
  gameTitle: string;
  name?: string; // alias for gameTitle
  artwork: string;
  thumbnail?: string; // alias for artwork
  score: number; // 0 - 10, e.g. 8.5
  scoreLabel: ScoreLabel;
  genre: string;
  platform: string;
  shortVerdict: string;
  verdict?: string; // alias for shortVerdict
  fullReview: string;
  content?: string; // alias for fullReview
  author: string;
  reviewer?: string; // alias for author
  publishDate: string;
  date?: string; // alias for publishDate
  pros: string[];
  cons: string[];
}

export interface Guide {
  id: string;
  title: string;
  game: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedReadingTime: string;
  shortDescription: string;
  category: 'Beginner Guides' | 'Strategy' | 'Builds' | 'Walkthroughs' | 'Tips & Tricks' | 'Settings' | 'Game Mechanics';
  image: string;
  sections: {
    heading: string;
    content: string;
    tip?: string;
  }[];
}

export interface ForumReply {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    isStaff?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: {
    name: string;
    username?: string;
    avatar: string;
    badge: string;
    isStaff?: boolean;
  };
  category: string;
  repliesCount: number;
  replyCount?: number;
  views: number;
  lastActivity: string;
  timestamp: string;
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
  initialPost: string;
  likes: number;
  replies: ForumReply[];
}

export interface UserStats {
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  topicsCount: number;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio?: string;
  badge: string;
  level?: number | string;
  role?: string;
  reputation: number;
  joinDate: string;
  bookmarks: {
    videos: string[];
    games: string[];
    articles: string[];
    reviews: string[];
    guides: string[];
    topics?: string[];
  };
  likedIds: string[];
  stats: UserStats;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topicCount: number;
}

export type ContactCategory = 
  | 'editorial'
  | 'advertising'
  | 'reviews'
  | 'corrections'
  | 'dmca'
  | 'technical'
  | 'general';

export type ContactSubmissionStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  category: ContactCategory | string;
  subject?: string;
  message: string;
  createdAt: string;
  status: ContactSubmissionStatus;
  userId?: string | null;
  userAgent?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source?: string;
}
