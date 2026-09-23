import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Youtube, 
  Compass, 
  ArrowRight, 
  Star, 
  Clock, 
  Eye, 
  Gamepad2, 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  Shield, 
  ChevronRight,
  Flame,
  Pin,
  Check,
  Filter,
  Monitor,
  Calendar
} from 'lucide-react';
import { 
  Video, 
  Game, 
  Article, 
  Review, 
  Guide, 
  ForumTopic, 
  GameGenre, 
  Platform,
  PageTab
} from '../types';
import { YOUTUBE_CHANNEL } from '../lib/constants';
import { AdBanner } from '../components/AdBanner';
import { formatTopicDate } from '../lib/forumUtils';

interface HomeViewProps {
  videos: Video[];
  games: Game[];
  articles: Article[];
  reviews: Review[];
  guides: Guide[];
  topics: ForumTopic[];
  onSelectVideo: (v: Video) => void;
  onSelectGame: (g: Game) => void;
  onSelectArticle: (a: Article) => void;
  onSelectReview: (r: Review) => void;
  onSelectGuide: (g: Guide) => void;
  onSelectTopic: (t: ForumTopic) => void;
  onNavigateTab: (tab: PageTab) => void;
  onOpenNewTopic: () => void;
}

const HomeViewComponent: React.FC<HomeViewProps> = ({
  videos,
  games,
  articles,
  reviews,
  guides,
  topics,
  onSelectVideo,
  onSelectGame,
  onSelectArticle,
  onSelectReview,
  onSelectGuide,
  onSelectTopic,
  onNavigateTab,
  onOpenNewTopic
}) => {
  // Game filtering state on Homepage
  const [selectedGenre, setSelectedGenre] = useState<GameGenre>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('All');
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const genres: GameGenre[] = ['All', 'RPG', 'Action', 'Simulation', 'Multiplayer', 'Racing', 'Adventure'];
  const platforms: Platform[] = ['All', 'PC', 'PS5', 'Xbox', 'Switch'];

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const genreMatch = selectedGenre === 'All' || g.genre === selectedGenre;
      const platformMatch = selectedPlatform === 'All' || g.platforms.includes(selectedPlatform);
      return genreMatch && platformMatch;
    });
  }, [games, selectedGenre, selectedPlatform]);

  const featuredVideo = useMemo(() => {
    return videos.find((v) => v.isFeatured) || videos[0];
  }, [videos]);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-12 pb-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-vault-grid">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-900/25 blur-[130px] rounded-full pointer-events-none animate-vault-glow" />
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[260px] bg-blue-900/20 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Subtle Vault Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-['Rajdhani'] font-bold tracking-wider uppercase text-gray-200">
              Official Hub & Community
            </span>
            <span className="text-gray-500">•</span>
            <span className="font-mono text-purple-400">gamevault.forum</span>
          </div>

          {/* Main Brand Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase font-['Rajdhani'] text-white">
            Game Vault <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Forum</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-2xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-cyan-300 font-['Space_Grotesk']">
            Watch. Play. Discuss. Discover.
          </p>

          {/* Short Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-['Inter'] leading-relaxed">
            Welcome to Game Vault Forum — your vault for exclusive reviews, deep gameplay breakdowns, professional guides, and industry-leading gaming media.
          </p>

          {/* Action CTAs in Frosted Glass styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="hero-play-games"
              onClick={() => onNavigateTab('play-games')}
              className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Rajdhani'] font-bold text-sm tracking-wider uppercase rounded-full shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Gamepad2 className="w-4 h-4 text-purple-200" />
              <span>Play Browser Games</span>
            </button>

            <a
              id="hero-watch-youtube"
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-gray-100 text-black font-['Rajdhani'] font-bold text-sm tracking-wider uppercase rounded-full shadow-xl shadow-white/10 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Youtube className="w-4 h-4 fill-current text-red-600" />
              <span>Watch on YouTube ({YOUTUBE_CHANNEL.handle})</span>
            </a>

            <button
              id="hero-explore-vault"
              onClick={() => onNavigateTab('games')}
              className="w-full sm:w-auto px-7 py-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-['Rajdhani'] font-bold text-sm tracking-wider uppercase rounded-full flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Explore the Vault</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED YOUTUBE VIDEO SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-4">
            <Flame className="w-4 h-4 text-purple-400" />
            Spotlight Production • Game Vault Channel
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Thumbnail / Video trigger or Inline Embedded YouTube Player */}
            <div className="lg:col-span-7 relative group rounded-xl overflow-hidden border border-white/10 aspect-video shadow-2xl bg-black">
              {isPlayingInline ? (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}?autoplay=1&rel=0`}
                  title={featuredVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={() => setIsPlayingInline(true)}
                  className="w-full h-full relative cursor-pointer group"
                >
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    width={1280}
                    height={720}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

                  {/* Glowing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-900/60 transition-all duration-300 transform group-hover:scale-110 border border-white/20">
                      <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-xs font-mono text-white border border-white/10">
                    {featuredVideo.duration}
                  </div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600/90 backdrop-blur-md rounded-full text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-white border border-white/20 flex items-center gap-1.5 shadow-lg">
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Now</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content text */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 rounded-full border border-red-500/30 flex items-center gap-1">
                  <Youtube className="w-3 h-3 fill-current" />
                  Latest Channel Upload
                </span>
                <span className="text-xs text-cyan-400 font-medium">{featuredVideo.game}</span>
              </div>

              <h2
                onClick={() => onSelectVideo(featuredVideo)}
                className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white hover:text-purple-300 cursor-pointer transition-colors leading-snug"
              >
                {featuredVideo.title}
              </h2>

              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 font-['Inter']">
                {featuredVideo.shortDescription}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {featuredVideo.views} views
                </span>
                <span>•</span>
                <span>{featuredVideo.uploadDate}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {isPlayingInline ? (
                  <button
                    onClick={() => setIsPlayingInline(false)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all border border-white/20"
                  >
                    Close Player
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPlayingInline(true)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-900/30 flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play on Homepage
                  </button>
                )}

                <button
                  onClick={() => onSelectVideo(featuredVideo)}
                  className="px-4 py-2.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30 flex items-center gap-1.5"
                >
                  <span>Full Video Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white rounded-full text-xs font-semibold border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5"
                >
                  <Youtube className="w-4 h-4 text-red-500 fill-current" />
                  YouTube Link
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LATEST FROM GAME VAULT FORUM (YouTube Videos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-red-400 block mb-1">
              YouTube Channel Productions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
              Latest From Game Vault Forum
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('videos')}
            className="flex items-center gap-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span>View All Videos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col"
            >
              {/* Thumbnail with hover zoom and dark overlay */}
              <div className="relative aspect-video overflow-hidden bg-black shrink-0 border-b border-white/5">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Play button appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 border border-white/20">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration badge */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[11px] font-mono bg-black/80 backdrop-blur-md text-white rounded border border-white/10">
                  {vid.duration}
                </span>

                {/* Game badge */}
                <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-semibold bg-black/70 text-cyan-300 backdrop-blur-md rounded-full border border-white/10">
                  {vid.game}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-2.5">
                <div>
                  <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 mt-1.5 font-['Inter']">
                    {vid.shortDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
                  <span>{vid.views} views</span>
                  <span>{vid.uploadDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORE THE GAME VAULT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-4 gap-4">
          <div>
            <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-cyan-400 block mb-1">
              Curated Gaming Archives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
              Explore the Game Vault
            </h2>
          </div>

          {/* Genre and Platform Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {genres.slice(0, 5).map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    selectedGenre === genre
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40 border border-cyan-400/40'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('games')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-2"
            >
              All Filters →
            </button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.slice(0, 4).map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-black shrink-0 border-b border-white/5">
                <img
                  src={game.artwork}
                  alt={game.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Rating Pill */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded-full text-xs font-mono text-cyan-300 font-bold">
                  ★ {game.rating}
                </div>

                <span className="absolute bottom-2 left-2.5 px-2.5 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-200 backdrop-blur-md rounded-full border border-purple-500/30">
                  {game.genre}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors truncate">
                    {game.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 font-['Inter']">
                    {game.shortDescription}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Platforms:</span>
                    <span className="text-cyan-300 font-medium truncate">{game.platforms.join(', ')}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectGame(game);
                    }}
                    className="w-full py-2 px-3 bg-white/5 hover:bg-cyan-600 text-gray-200 hover:text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-cyan-500 backdrop-blur-md transition-all text-center"
                  >
                    Explore Game
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PC GAME REQUIREMENTS CHECKER FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-r from-[#141226] via-[#101328] to-[#0c142c] p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-widest">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Official Gaming Utility</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
                Can My PC Run This Game?
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-['Inter']">
                Check whether your PC meets the minimum and recommended hardware requirements for your favorite games. Accurate component comparison based strictly on official developer specifications.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="/tools/pc-game-requirements-checker"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTab('pc-requirements');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-['Rajdhani'] font-bold text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-purple-950/60 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Launch Requirements Checker</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GAMING ARTICLES ("From the Vault") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-purple-400 block mb-1">
              Editorial & Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
              From the Vault
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('articles')}
            className="flex items-center gap-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span>All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-black shrink-0 border-b border-white/5">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  width={600}
                  height={350}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-purple-300 rounded-full border border-purple-500/30">
                  {art.category}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 font-['Inter']">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{art.author.name}</span>
                  <span>{art.readingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GAME REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Honest Scoring & Critical Verdicts
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
              Featured Reviews
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('reviews')}
            className="flex items-center gap-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span>All Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              onClick={() => onSelectReview(rev)}
              className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <img
                    src={rev.artwork}
                    alt={rev.gameTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-14 h-16 object-cover rounded-xl border border-white/10"
                  />
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-extrabold font-mono text-amber-400">
                      {rev.score}
                    </span>
                    <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-300/80">
                      {rev.scoreLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-amber-300 transition-colors">
                    {rev.gameTitle}
                  </h3>
                  <span className="text-[11px] text-gray-400">{rev.genre} • {rev.platform}</span>
                  <p className="text-xs text-gray-300 line-clamp-2 mt-2 italic font-['Space_Grotesk']">
                    "{rev.shortVerdict}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400">Read Review</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google AdSense Responsive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="home-mid-banner" format="horizontal" />
      </section>

      {/* 7. GAMING GUIDES & TIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
              Walkthroughs, Builds & Strategies
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
              Gaming Guides & Tips
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('guides')}
            className="flex items-center gap-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span>All Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((gd) => (
            <div
              key={gd.id}
              onClick={() => onSelectGuide(gd)}
              className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-40 overflow-hidden bg-black shrink-0 border-b border-white/5">
                <img
                  src={gd.image}
                  alt={gd.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-emerald-300 rounded-full border border-emerald-500/30">
                  {gd.difficulty}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-mono bg-black/80 backdrop-blur-md text-gray-300 rounded border border-white/10">
                  {gd.estimatedReadingTime}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-400 block mb-1">
                    {gd.game} • {gd.category}
                  </span>
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {gd.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 font-['Inter']">
                    {gd.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs font-semibold text-gray-400 group-hover:text-emerald-300 flex items-center justify-between transition-colors">
                  <span>View Full Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. COMMUNITY / FORUM SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-1">
                <MessageSquare className="w-4 h-4" />
                Civil Gaming Community
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
                The Game Vault Forum
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenNewTopic}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30"
              >
                Start a Discussion
              </button>
              <button
                onClick={() => onNavigateTab('forum')}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 backdrop-blur-md transition-all"
              >
                Browse All Forums →
              </button>
            </div>
          </div>

          {/* Active Topics List */}
          <div className="space-y-3">
            {topics.slice(0, 3).map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 rounded-xl cursor-pointer transition-all gap-3 group backdrop-blur-md"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <img
                    src={topic.author.avatar}
                    alt={topic.author.name}
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 rounded-full object-cover border border-purple-500/40 shrink-0 mt-0.5 sm:mt-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono uppercase bg-white/5 text-purple-300 px-2.5 py-0.5 rounded-full border border-white/10">
                        {topic.category}
                      </span>
                      {topic.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors mt-1">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-300 flex-wrap">
                      <span className="text-gray-400 font-normal">By</span>
                      <span className="text-white font-semibold">{topic.author.name}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-purple-300 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        {formatTopicDate(topic)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0 self-end sm:self-center">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    {(() => {
                      const count = Array.isArray(topic.replies) ? topic.replies.length : 0;
                      return `${count} ${count === 1 ? 'reply' : 'replies'}`;
                    })()}
                  </span>
                  <span>{topic.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. LARGE YOUTUBE SUBSCRIBE CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950/40 via-purple-950/30 to-black/60 backdrop-blur-xl border border-white/10 p-8 sm:p-12 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mx-auto shadow-xl shadow-red-950/80 border border-white/20">
              <Youtube className="w-9 h-9 fill-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
              Subscribe to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">{YOUTUBE_CHANNEL.handle}</span> on YouTube
            </h2>

            <p className="text-gray-300 text-sm sm:text-base font-['Inter'] leading-relaxed">
              Don't miss our latest gameplay showcases, deep mechanical breakdowns, hardware optimization guides, and honest critiques on our official channel <strong className="text-white">{YOUTUBE_CHANNEL.handle}</strong>. Join thousands of gamers exploring the digital vault.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-100 text-black font-['Rajdhani'] font-bold text-sm uppercase tracking-wider rounded-full shadow-xl shadow-white/10 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Youtube className="w-4 h-4 fill-current text-red-600" />
                <span>Visit {YOUTUBE_CHANNEL.handle}</span>
              </a>

              <button
                onClick={() => onNavigateTab('videos')}
                className="w-full sm:w-auto px-7 py-3 bg-white/10 hover:bg-white/15 text-white font-['Rajdhani'] font-bold text-sm uppercase tracking-wider rounded-full border border-white/20 backdrop-blur-md transition-all"
              >
                Browse Video Catalog
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const HomeView = React.memo(HomeViewComponent);
