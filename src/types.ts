export type PageTab = 'home' | 'videos' | 'games' | 'articles' | 'reviews' | 'guides' | 'forum' | 'about';

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
  category: 'Gameplay' | 'Deep Dive' | 'Review' | 'Guide' | 'Tech';
  isFeatured?: boolean;
  thumbnail: string;
  likes: number;
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
  title: string;
  excerpt: string;
  content: string;
  category: 'Gaming News' | 'Opinions' | 'Gaming Culture' | 'Industry' | 'Tips' | 'Features' | 'Gaming Stories';
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publicationDate: string;
  readingTime: string;
  featuredImage: string;
  tags: string[];
  views: string;
  likes: number;
}

export type ScoreLabel = 'Masterpiece' | 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Not Recommended';

export interface Review {
  id: string;
  gameTitle: string;
  artwork: string;
  score: number; // 0 - 10, e.g. 8.5
  scoreLabel: ScoreLabel;
  genre: string;
  platform: string;
  shortVerdict: string;
  fullReview: string;
  author: string;
  publishDate: string;
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
    avatar: string;
    badge: string;
    isStaff?: boolean;
  };
  category: string;
  repliesCount: number;
  views: number;
  lastActivity: string;
  timestamp: string;
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
  initialPost: string;
  replies: ForumReply[];
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  avatar: string;
  badge: string;
  reputation: number;
  joinDate: string;
  bookmarks: {
    videos: string[];
    games: string[];
    articles: string[];
    reviews: string[];
    guides: string[];
    topics: string[];
  };
  likedIds: string[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topicCount: number;
}
