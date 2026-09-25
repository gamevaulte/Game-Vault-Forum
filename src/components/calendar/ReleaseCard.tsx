import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Share2, 
  Bell, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Monitor, 
  Dices, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  ChevronDown
} from 'lucide-react';
import { GameRelease, ReleaseStatus } from '../../types/releaseCalendar';
import { downloadIcsFile, getGoogleCalendarUrl } from '../../utils/calendarExport';

interface ReleaseCardProps {
  release: GameRelease;
  onOpenDetails: (release: GameRelease) => void;
  onCheckSpecs?: (gameTitle: string) => void;
  onAddToWheel?: (gameTitle: string) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (release: GameRelease) => void;
  hasReminder?: boolean;
  onOpenReminderModal?: (release: GameRelease) => void;
  onShare?: (release: GameRelease) => void;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({
  release,
  onOpenDetails,
  onCheckSpecs,
  onAddToWheel,
  isWatchlisted = false,
  onToggleWatchlist,
  hasReminder = false,
  onOpenReminderModal,
  onShare
}) => {
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);

  // Status badge styling and accessible indicator
  const getStatusBadge = (status: ReleaseStatus) => {
    switch (status) {
      case 'Releasing Today':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-400 animate-pulse',
          label: '🟢 Releasing Today'
        };
      case 'Released':
        return {
          bg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
          dot: 'bg-teal-400',
          label: 'Released'
        };
      case 'Upcoming':
        return {
          bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          dot: 'bg-purple-400',
          label: 'Upcoming'
        };
      case 'Early Access':
        return {
          bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
          dot: 'bg-cyan-400',
          label: '🔵 Early Access'
        };
      case 'Delayed':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400',
          label: '🔴 Delayed'
        };
      case 'TBA':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          label: '🟡 TBA'
        };
      default:
        return {
          bg: 'bg-slate-500/15 border-slate-500/30 text-slate-300',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  const statusInfo = getStatusBadge(release.status);

  // Calculate days relative to current date
  const getRelativeDaysText = () => {
    if (release.status === 'TBA') return 'Date TBA';
    
    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).getTime();
    const relDate = new Date(`${release.releaseDate}T00:00:00Z`).getTime();
    if (isNaN(relDate)) return release.releaseDateDisplay;

    const diffDays = Math.round((relDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Out Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 30) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -30) return `${Math.abs(diffDays)} days ago`;
    return release.releaseDateDisplay;
  };

  const relativeText = getRelativeDaysText();

  return (
    <div className="group relative rounded-2xl bg-[#0e1120] border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-purple-950/30 hover:-translate-y-0.5">
      {/* Cover Artwork & Overlays */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={release.cover}
          alt={release.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1120] via-black/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-['Space_Grotesk'] border backdrop-blur-md ${statusInfo.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>

          {/* Quick Actions (Watchlist / Share) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onToggleWatchlist && (
              <button
                type="button"
                onClick={() => onToggleWatchlist(release)}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                className={`p-1.5 rounded-lg border backdrop-blur-md transition-colors ${
                  isWatchlisted
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-black/60 border-white/15 text-slate-300 hover:text-white hover:bg-black/80'
                }`}
                aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {isWatchlisted ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>
            )}

            {onShare && (
              <button
                type="button"
                onClick={() => onShare(release)}
                title="Share Release"
                className="p-1.5 rounded-lg bg-black/60 border border-white/15 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-colors"
                aria-label="Share Release"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Relative Timing Pill bottom-left of artwork */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/75 border border-white/10 text-[10px] font-mono text-purple-300 backdrop-blur-md">
          <Clock className="w-3 h-3 text-purple-400" />
          <span>{relativeText}</span>
        </div>

        {/* Genre Pill bottom-right */}
        <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
          {release.genre}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Release Date Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-['Space_Grotesk'] font-semibold text-purple-400 flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {release.releaseDateDisplay}
            </span>
            {release.developer && (
              <span className="text-[11px] truncate max-w-[140px] text-slate-400 font-['Inter']">
                {release.developer}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(release)}
            className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white hover:text-purple-300 cursor-pointer transition-colors line-clamp-1 mb-2"
          >
            {release.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3 font-['Inter']">
            {release.shortDescription}
          </p>

          {/* Delayed Note if present */}
          {release.status === 'Delayed' && release.previousReleaseDate && (
            <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Was: {release.previousReleaseDate}.</span> {release.delayReason || 'Release date rescheduled.'}
              </div>
            </div>
          )}

          {/* Platforms Tag Row */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {release.platforms.map((plat) => (
              <span 
                key={plat} 
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300"
              >
                {plat}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Details Primary Button */}
            <button
              type="button"
              onClick={() => onOpenDetails(release)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
            >
              View Game
            </button>

            {/* Remind Me Button */}
            {onOpenReminderModal && (
              <button
                type="button"
                onClick={() => onOpenReminderModal(release)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                  hasReminder
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Set Release Reminder"
              >
                <Bell className="w-3 h-3" />
                <span>{hasReminder ? 'Reminded' : 'Remind'}</span>
              </button>
            )}

            {/* Add to Calendar Dropdown */}
            {release.releaseDate !== 'TBA' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCalendarMenuOpen(prev => !prev)}
                  className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
                  title="Export to Calendar"
                  aria-label="Export to Calendar"
                >
                  <CalendarIcon className="w-3 h-3 text-purple-400" />
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>

                {calendarMenuOpen && (
                  <div 
                    className="absolute bottom-full mb-1 left-0 z-20 w-44 rounded-xl bg-[#141829] border border-white/15 p-1.5 shadow-xl text-[11px] font-['Space_Grotesk'] text-slate-200"
                    onMouseLeave={() => setCalendarMenuOpen(false)}
                  >
                    <a
                      href={getGoogleCalendarUrl(release)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setCalendarMenuOpen(false)}
                      className="block px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between"
                    >
                      <span>Google Calendar</span>
                      <ExternalLink className="w-3 h-3 text-purple-400" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        downloadIcsFile(release);
                        setCalendarMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>iCal / .ics File</span>
                      <Download className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Cross-Tool Shortcuts */}
          <div className="flex items-center gap-1.5 text-slate-400">
            {release.platforms.includes('PC') && onCheckSpecs && (
              <button
                type="button"
                onClick={() => onCheckSpecs(release.title)}
                title="Check PC Requirements"
                className="p-1 rounded-md hover:text-amber-400 hover:bg-white/5 transition-colors"
                aria-label="Check PC Requirements"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            )}

            {onAddToWheel && (
              <button
                type="button"
                onClick={() => onAddToWheel(release.title)}
                title="Add to Game Picker Wheel"
                className="p-1 rounded-md hover:text-purple-400 hover:bg-white/5 transition-colors"
                aria-label="Add to Game Picker Wheel"
              >
                <Dices className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
