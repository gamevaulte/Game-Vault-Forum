import React, { useState } from 'react';
import { Youtube, Play, Eye, Clock, Calendar, Filter, Sparkles } from 'lucide-react';
import { Video } from '../types';

interface VideosViewProps {
  videos: Video[];
  onSelectVideo: (v: Video) => void;
}

export const VideosView: React.FC<VideosViewProps> = ({ videos, onSelectVideo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Deep Dive', 'Gameplay', 'Review', 'Guide', 'Tech'];

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory === 'All') return true;
    return v.category === selectedCategory;
  });

  const featured = videos.find((v) => v.isFeatured) || videos[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-800/40 text-red-400 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
          <Youtube className="w-3.5 h-3.5 fill-current" />
          Game Vault Forum YouTube Hub
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          Vault Video Library & Gameplay Analyses
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl font-['Inter']">
          Watch our in-depth mechanical breakdowns, game analyses, tactical fleet guides, and PC performance benchmarks. Produced with care for discerning gamers.
        </p>
      </div>

      {/* Featured Video Player Spotlight */}
      <div className="relative rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div
            onClick={() => onSelectVideo(featured)}
            className="lg:col-span-7 relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-white/10"
          >
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-950/80 transition-all transform group-hover:scale-110 border border-white/20">
                <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
              </div>
            </div>
            <span className="absolute bottom-3 right-3 px-2 py-0.5 text-xs font-mono bg-black/80 backdrop-blur-md text-white rounded border border-white/10">
              {featured.duration}
            </span>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-red-600/20 text-red-300 rounded-full border border-red-500/30">
                Featured Production
              </span>
              <span className="text-xs text-cyan-400 font-medium">{featured.game}</span>
            </div>

            <h2
              onClick={() => onSelectVideo(featured)}
              className="text-2xl font-['Space_Grotesk'] font-bold text-white hover:text-red-300 cursor-pointer transition-colors"
            >
              {featured.title}
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed font-['Inter']">
              {featured.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{featured.views} views</span>
              <span>•</span>
              <span>{featured.uploadDate}</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onSelectVideo(featured)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-950/50 flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play Featured Video
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white rounded-full text-xs font-semibold border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                <Youtube className="w-4 h-4 text-red-500 fill-current" />
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40 border border-red-400/40'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 font-mono">
          Showing {filteredVideos.length} Videos
        </span>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => onSelectVideo(vid)}
            className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden bg-black shrink-0 border-b border-white/5">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-950/60 border border-white/20">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[11px] font-mono bg-black/80 backdrop-blur-md text-white rounded border border-white/10">
                {vid.duration}
              </span>
              <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-semibold bg-black/70 text-cyan-300 backdrop-blur-md rounded-full border border-white/10">
                {vid.game}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between space-y-2.5">
              <div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-red-300 transition-colors line-clamp-2">
                  {vid.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 font-['Inter']">
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
    </div>
  );
};
