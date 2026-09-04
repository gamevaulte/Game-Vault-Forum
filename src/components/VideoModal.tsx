import React from 'react';
import { X, Youtube, ThumbsUp, Bookmark, Share2, Calendar, Clock, Eye, Gamepad2, Check } from 'lucide-react';
import { Video } from '../types';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleLike: (id: string) => void;
  onShare: (title: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  onClose,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onShare
}) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#07080d]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30">
              {video.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium font-['Space_Grotesk']">
              <Gamepad2 className="w-3.5 h-3.5" />
              {video.game}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full bg-black aspect-video shrink-0 border-b border-white/10">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Details Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <h2 className="text-xl sm:text-2xl font-['Space_Grotesk'] font-bold text-white leading-snug">
                {video.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  {video.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {video.uploadDate}
                </span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleLike(video.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isLiked
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{video.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(video.id)}
                className={`p-2 rounded-xl text-xs border transition-all ${
                  isBookmarked
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
                title={isBookmarked ? 'Saved in Vault' : 'Save to Vault'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onShare(video.title)}
                className="p-2 rounded-xl text-xs bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                title="Share video"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-950/40"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Description Block */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-gray-300 leading-relaxed space-y-2 backdrop-blur-md">
            <p className="font-semibold text-white font-['Space_Grotesk']">Video Overview:</p>
            <p>{video.description}</p>
          </div>

          {/* Subscribe Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-950/60 border border-white/20">
                <Youtube className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                  Game Vault Forum YouTube Channel
                </p>
                <p className="text-xs text-gray-400">
                  Subscribe for high-production gaming essays, deep lore, and hardware breakdowns.
                </p>
              </div>
            </div>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shrink-0 transition-all shadow-md shadow-red-950/40"
            >
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
