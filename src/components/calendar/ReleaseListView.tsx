import React from 'react';
import { Calendar as CalendarIcon, Clock, Bell, Bookmark, ExternalLink } from 'lucide-react';
import { GameRelease } from '../../types/releaseCalendar';

interface ReleaseListViewProps {
  releases: GameRelease[];
  onOpenDetails: (release: GameRelease) => void;
  onOpenReminderModal?: (release: GameRelease) => void;
  watchlistIds?: string[];
  onToggleWatchlist?: (release: GameRelease) => void;
}

export const ReleaseListView: React.FC<ReleaseListViewProps> = ({
  releases,
  onOpenDetails,
  onOpenReminderModal,
  watchlistIds = [],
  onToggleWatchlist
}) => {
  if (releases.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl bg-[#0c0f1c] border border-white/5 p-8">
        <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white">No Game Releases Found</h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          No releases match your active filters or search terms. Try loosening your platform, genre, or date filters.
        </p>
      </div>
    );
  }

  // Group by date string or releaseDateDisplay
  const grouped: Record<string, GameRelease[]> = {};
  releases.forEach((r) => {
    const key = r.releaseDateDisplay || r.releaseDate;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(r);
  });

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateLabel, games]) => (
        <div key={dateLabel} className="space-y-3">
          {/* Date Header */}
          <div className="flex items-center gap-2.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 pb-1.5 border-b border-white/10">
            <CalendarIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>{dateLabel}</span>
            <span className="text-slate-500 font-normal">({games.length} {games.length === 1 ? 'game' : 'games'})</span>
          </div>

          {/* Games for this date */}
          <div className="space-y-2.5">
            {games.map((rel) => {
              const isWatchlisted = watchlistIds.includes(rel.id);
              return (
                <div
                  key={rel.id}
                  onClick={() => onOpenDetails(rel)}
                  className="group p-3.5 sm:p-4 rounded-xl bg-[#0e1122] hover:bg-[#13172e] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-purple-950/20"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={rel.cover}
                      alt={rel.title}
                      loading="lazy"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-white/10"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rel.status === 'Releasing Today'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : rel.status === 'Released'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                            : rel.status === 'Delayed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : rel.status === 'TBA'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}>
                          {rel.status}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {rel.genre}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors truncate">
                        {rel.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-['Inter'] flex-wrap">
                        <span className="text-purple-300 font-medium">
                          {rel.platforms.join(' • ')}
                        </span>
                        {rel.developer && (
                          <>
                            <span>|</span>
                            <span>{rel.developer}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div 
                    className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t border-white/5 sm:border-0 w-full sm:w-auto justify-between sm:justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onToggleWatchlist && (
                      <button
                        type="button"
                        onClick={() => onToggleWatchlist(rel)}
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          isWatchlisted
                            ? 'bg-purple-600 border-purple-400 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onOpenReminderModal && rel.releaseDate !== 'TBA' && (
                      <button
                        type="button"
                        onClick={() => onOpenReminderModal(rel)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <Bell className="w-3 h-3 text-amber-400" />
                        <span>Remind</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenDetails(rel)}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors"
                    >
                      View Game
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
