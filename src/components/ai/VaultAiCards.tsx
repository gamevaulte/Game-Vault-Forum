import React from 'react';
import { 
  Gamepad2, 
  ExternalLink, 
  Star, 
  Cpu, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { Game, Article, Review, Guide, Video } from '../../types';
import { PcComponent } from '../../types/pcBuilder';
import { MOCK_GAMES, MOCK_ARTICLES, MOCK_REVIEWS, MOCK_GUIDES, MOCK_VIDEOS } from '../../data/mockData';
import { INITIAL_COMPONENTS } from '../../data/pcComponentsData';
import { navigateTo } from '../../lib/router';

// Helper to resolve games by ID or slug
export function resolveGame(idOrSlug: string): Game | undefined {
  const norm = idOrSlug.toLowerCase().trim();
  return MOCK_GAMES.find(g => 
    g.id.toLowerCase() === norm ||
    g.title.toLowerCase().includes(norm) ||
    norm.includes(g.id.toLowerCase()) ||
    (norm.includes('elden') && g.id === 'game-1') ||
    (norm.includes('cyberpunk') && g.id === 'game-2') ||
    (norm.includes('baldurs') && g.id === 'game-3') ||
    (norm.includes('warships') && g.id === 'game-4') ||
    (norm.includes('helldivers') && g.id === 'game-5') ||
    (norm.includes('forza') && g.id === 'game-6') ||
    (norm.includes('hollow') && g.id === 'game-7') ||
    (norm.includes('starfield') && g.id === 'game-8') ||
    (norm.includes('pubg') && g.id === 'game-pubg-mobile')
  );
}

// Helper to resolve articles, reviews, or guides
export function resolveArticleOrGuide(idOrSlug: string): { 
  item: Article | Review | Guide; 
  title: string;
  description: string;
  type: 'article' | 'review' | 'guide'; 
  url: string 
} | undefined {
  const norm = idOrSlug.toLowerCase().trim();

  const art = MOCK_ARTICLES.find(a => a.id.toLowerCase() === norm || a.title.toLowerCase().includes(norm));
  if (art) return { item: art, title: art.title, description: art.excerpt || '', type: 'article', url: `/articles/${art.id}` };

  const rev = MOCK_REVIEWS.find(r => r.id.toLowerCase() === norm || r.gameTitle.toLowerCase().includes(norm));
  if (rev) return { item: rev, title: `${rev.gameTitle} Review`, description: rev.shortVerdict || '', type: 'review', url: `/reviews/${rev.id}` };

  const gui = MOCK_GUIDES.find(g => g.id.toLowerCase() === norm || g.title.toLowerCase().includes(norm));
  if (gui) return { item: gui, title: gui.title, description: gui.shortDescription || '', type: 'guide', url: `/guides/${gui.id}` };

  return undefined;
}

// Helper to resolve hardware
export function resolveHardware(idOrSlug: string): PcComponent | undefined {
  const norm = idOrSlug.toLowerCase().trim();
  return INITIAL_COMPONENTS.find(c => 
    c.id.toLowerCase() === norm ||
    c.model.toLowerCase().includes(norm) ||
    norm.includes(c.id.toLowerCase()) ||
    (norm.includes('4070') && c.id === 'gpu-rtx-4070-super') ||
    (norm.includes('7800x3d') && c.id === 'cpu-r7-7800x3d') ||
    (norm.includes('7600x') && c.id === 'cpu-r5-7600x') ||
    (norm.includes('7800xt') && c.id === 'gpu-rx-7800xt')
  );
}

// Helper to resolve video
export function resolveVideo(idOrSlug: string): Video | undefined {
  const norm = idOrSlug.toLowerCase().trim();
  return MOCK_VIDEOS.find(v => 
    v.id.toLowerCase() === norm ||
    v.youtubeId === norm ||
    v.title.toLowerCase().includes(norm) ||
    (norm.includes('pubg') && v.id === 'vid-pubg-morning') ||
    (norm.includes('warships') && v.id === 'vid-2') ||
    (norm.includes('erdtree') && v.id === 'vid-1')
  );
}

export const VaultAiGameCard: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-900/25 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-white/10 flex-shrink-0 overflow-hidden relative">
          <img 
            src={game.artwork} 
            alt={game.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1">
            <span className="text-[10px] font-bold text-yellow-400 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-current" /> {game.rating}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {game.genre}
            </span>
            <span className="text-xs text-zinc-400 truncate">
              {game.platforms.slice(0, 3).join(', ')}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate mt-1">
            {game.title}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
            {game.shortDescription}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          onClick={() => navigateTo(`/games/${game.id}`)}
          className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <span>View Game</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const VaultAiHardwareCard: React.FC<{ component: PcComponent }> = ({ component }) => {
  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-900/25 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400">
          <Cpu className="w-6 h-6" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {component.category}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ${component.priceUsd} USD
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate mt-1">
            {component.manufacturer} {component.model}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
            {component.specifications}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          onClick={() => navigateTo('/tools/gaming-pc-builder')}
          className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Open PC Builder</span>
        </button>
      </div>
    </div>
  );
};

export const VaultAiArticleCard: React.FC<{ 
  item: Article | Review | Guide; 
  type: 'article' | 'review' | 'guide';
  url: string;
  title?: string;
  description?: string;
}> = ({ item, type, url, title, description }) => {
  const displayTitle = title || ('title' in item ? item.title : `${(item as Review).gameTitle} Review`);
  const displayDesc = description || ('shortDescription' in item ? item.shortDescription : ('excerpt' in item ? item.excerpt : (item as Review).shortVerdict));

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-purple-500/40 hover:bg-zinc-900/90 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-white/5 flex-shrink-0 flex items-center justify-center text-purple-400">
          <BookOpen className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-zinc-800 text-zinc-300 border border-white/10">
              {type}
            </span>
            <span className="text-xs text-zinc-400">
              Verified Game Vault Content
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate mt-1">
            {displayTitle}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
            {displayDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          onClick={() => navigateTo(url)}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <span>Read {type}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const VaultAiVideoCard: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-950/20 border border-red-500/20 hover:border-red-500/50 hover:bg-red-900/25 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-16 h-12 rounded-lg bg-zinc-900 border border-red-500/20 flex-shrink-0 overflow-hidden relative">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-current" />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
              YouTube Deep Dive
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {video.duration}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors truncate mt-1">
            {video.title}
          </h4>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
            {video.game} • Official Game Vault Channel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <button
          onClick={() => navigateTo(`/videos/${video.id}`)}
          className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch Video</span>
        </button>
      </div>
    </div>
  );
};
