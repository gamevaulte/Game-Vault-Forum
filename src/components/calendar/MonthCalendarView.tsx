import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { GameRelease } from '../../types/releaseCalendar';

interface MonthCalendarViewProps {
  currentYear: number;
  currentMonth: number; // 1-12
  releases: GameRelease[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenRelease: (release: GameRelease) => void;
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({
  currentYear,
  currentMonth,
  releases,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenRelease
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Days in current month
  const numDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // First day of month (0 = Sun, 1 = Mon, etc.)
  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
  // Adjust so Monday is 0
  const startOffset = (firstDayIndex + 6) % 7;

  // Build release map by day string "YYYY-MM-DD" strictly for confirmed exact dates
  const releasesByDate: Record<string, GameRelease[]> = {};
  releases.forEach((r) => {
    if (r.isConfirmed && r.releaseDate && r.releaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      if (!releasesByDate[r.releaseDate]) {
        releasesByDate[r.releaseDate] = [];
      }
      releasesByDate[r.releaseDate].push(r);
    }
  });

  // Collect announced window releases for this year where exact day is TBA
  const windowReleasesThisYear = releases.filter(
    (r) => (!r.isConfirmed || r.releaseDate === 'TBA') && r.releaseDateDisplay.includes(String(currentYear))
  );

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Days array
  const calendarCells = [];
  // Empty slots for offset
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= numDaysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({
      day,
      dateStr,
      releases: releasesByDate[dateStr] || [],
      isToday: dateStr === todayStr,
      isSelected: selectedDate === dateStr
    });
  }

  return (
    <div className="rounded-2xl bg-[#0b0e1b] border border-white/10 p-4 sm:p-6 shadow-xl">
      {/* Month Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
            {monthNames[currentMonth - 1]} {currentYear}
          </h3>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 transition-colors cursor-pointer"
          >
            Today ({todayFormatted})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarCells.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square sm:aspect-auto sm:min-h-[105px] rounded-xl bg-white/[0.01] border border-transparent"
              />
            );
          }

          const hasReleases = cell.releases.length > 0;

          return (
            <div
              key={cell.dateStr}
              onClick={() => onSelectDate(cell.isSelected ? null : cell.dateStr)}
              className={`group relative aspect-square sm:aspect-auto sm:min-h-[105px] p-1.5 sm:p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                cell.isSelected
                  ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-950/40 ring-1 ring-purple-400'
                  : cell.isToday
                  ? 'bg-emerald-950/20 border-emerald-500/50 hover:border-emerald-400'
                  : hasReleases
                  ? 'bg-[#12162a] border-white/10 hover:border-purple-500/40 hover:bg-[#161a33]'
                  : 'bg-[#090b14] border-white/5 hover:border-white/15'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-bold font-['Space_Grotesk'] ${
                    cell.isToday
                      ? 'text-emerald-400 font-extrabold'
                      : cell.isSelected
                      ? 'text-purple-300'
                      : 'text-slate-300'
                  }`}
                >
                  {cell.day}
                </span>

                {cell.isToday && (
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                    Today
                  </span>
                )}

                {hasReleases && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-600/30 border border-purple-500/40 text-purple-300">
                    {cell.releases.length}
                  </span>
                )}
              </div>

              {/* Release Thumbnails / Titles for desktop */}
              <div className="hidden sm:flex flex-col gap-1 mt-1 overflow-hidden">
                {cell.releases.slice(0, 2).map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRelease(rel);
                    }}
                    className="w-full text-left truncate px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 hover:bg-purple-600 hover:text-white text-slate-300 transition-colors"
                    title={rel.title}
                  >
                    {rel.title}
                  </button>
                ))}
                {cell.releases.length > 2 && (
                  <span className="text-[10px] text-purple-400 font-semibold pl-1">
                    +{cell.releases.length - 2} more
                  </span>
                )}
              </div>

              {/* Mobile indicator dot */}
              <div className="sm:hidden flex items-center justify-center">
                {hasReleases && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Expanded Drawer / Highlight */}
      {selectedDate && (
        <div className="mt-6 pt-5 border-t border-white/10 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-purple-400" />
              <span>Releases for {selectedDate}</span>
            </h4>
            <button
              type="button"
              onClick={() => onSelectDate(null)}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Clear selection
            </button>
          </div>

          {releasesByDate[selectedDate]?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {releasesByDate[selectedDate].map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onOpenRelease(rel)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={rel.cover}
                    alt={rel.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-sm font-bold text-white truncate font-['Space_Grotesk']">
                      {rel.title}
                    </h5>
                    <p className="text-xs text-purple-300 truncate">
                      {rel.platforms.join(' • ')}
                    </p>
                    <span className="text-[10px] text-slate-400">{rel.genre}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-400 italic">
              No releases scheduled in the Game Vault database for this date.
            </p>
          )}
        </div>
      )}
      {/* Announced Window Releases for this Year (Exact Day TBA) */}
      {windowReleasesThisYear.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Announced for {currentYear} (Official Window — Exact Day TBA by Studio)</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              {windowReleasesThisYear.length} {windowReleasesThisYear.length === 1 ? 'title' : 'titles'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {windowReleasesThisYear.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onOpenRelease(rel)}
                className="p-2.5 rounded-xl bg-amber-950/10 hover:bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/40 transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <img
                  src={rel.cover}
                  alt={rel.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate font-['Space_Grotesk']">
                    {rel.title}
                  </h5>
                  <p className="text-[10px] text-amber-300 font-mono truncate">
                    {rel.releaseDateDisplay}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
