import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Layers, 
  Grid, 
  List, 
  Sparkles, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Bookmark, 
  BookmarkCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Monitor, 
  Gamepad2, 
  SlidersHorizontal,
  Flame,
  Globe,
  Share2
} from 'lucide-react';
import { ToolHeader } from '../components/tools/ToolHeader';
import { PageTab, UserAccount } from '../types';
import { 
  GameRelease, 
  CalendarPlatform, 
  ReleaseGenre, 
  ReleaseStatus, 
  CalendarViewType, 
  ReleaseFilterState 
} from '../types/releaseCalendar';
import { 
  GAME_RELEASES_DATABASE, 
  ALL_PLATFORMS, 
  ALL_GENRES, 
  getReleasesToday, 
  getReleasesThisWeek 
} from '../data/gameReleasesData';
import { 
  auditCalendarDatabase, 
  validateGameRelease, 
  DatabaseAuditReport 
} from '../utils/factCheck';
import { 
  requestDeviceNotificationPermission, 
  saveScheduledReminder, 
  triggerTestDeviceNotification, 
  checkAndDispatchPendingReminders,
  getReminderTimingLabel 
} from '../utils/notificationService';
import { ReleaseCard } from '../components/calendar/ReleaseCard';
import { MonthCalendarView } from '../components/calendar/MonthCalendarView';
import { ReleaseListView } from '../components/calendar/ReleaseListView';
import { ReleaseDetailsModal } from '../components/calendar/ReleaseDetailsModal';
import { AiReleaseAssistantModal } from '../components/calendar/AiReleaseAssistantModal';
import { FactCheckAuditModal } from '../components/calendar/FactCheckAuditModal';
import { CalendarEducationalFaq } from '../components/calendar/CalendarEducationalFaq';

interface GameReleaseCalendarViewProps {
  onNavigateTab: (tab: PageTab) => void;
  currentUser?: UserAccount;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'alert') => void;
  onCheckPcSpecs?: (gameTitle: string) => void;
  onCalculateFps?: (gameTitle: string) => void;
  onAddToWheel?: (gameTitle: string) => void;
  onAskVaultAi?: (gameTitle: string) => void;
  initialGameSlug?: string;
  onUpdateWatchlist?: (updated: string[]) => void;
  onUpdateReminders?: (updated: Record<string, string>) => void;
}

export const GameReleaseCalendarView: React.FC<GameReleaseCalendarViewProps> = ({
  onNavigateTab,
  currentUser,
  isSignedIn = false,
  onOpenSignIn,
  onShowToast,
  onCheckPcSpecs,
  onCalculateFps,
  onAddToWheel,
  onAskVaultAi,
  initialGameSlug,
  onUpdateWatchlist,
  onUpdateReminders
}) => {
  // Navigation & View Type
  const [viewType, setViewType] = useState<CalendarViewType>('grid');

  // Dynamic Calendar Month State based on real calendar date and verified releases
  const [currentYear, setCurrentYear] = useState<number>(() => {
    const now = new Date();
    const y = now.getFullYear();
    // Default to active release calendar year (2025 or current year)
    return y >= 2024 && y <= 2026 ? y : 2025;
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const now = new Date();
    return now.getMonth() + 1; // 1-12
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Active Selected Release Modal
  const [selectedRelease, setSelectedRelease] = useState<GameRelease | null>(null);

  // AI Assistant Modal State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Factual Integrity Audit Modal State & Audit Cache
  const [isFactCheckModalOpen, setIsFactCheckModalOpen] = useState(false);
  const databaseAudit = useMemo(() => auditCalendarDatabase(GAME_RELEASES_DATABASE), []);

  // User Watchlist State (loaded from currentUser or localStorage)
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    if (currentUser?.releaseWatchlist && Array.isArray(currentUser.releaseWatchlist)) {
      return currentUser.releaseWatchlist;
    }
    try {
      const saved = localStorage.getItem('gv_release_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Reminders State (loaded from currentUser or localStorage)
  const [reminderMap, setReminderMap] = useState<Record<string, string>>(() => {
    if (currentUser?.releaseReminders && typeof currentUser.releaseReminders === 'object') {
      return currentUser.releaseReminders;
    }
    try {
      const saved = localStorage.getItem('gv_release_reminders');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Keep state synced with currentUser updates
  useEffect(() => {
    if (currentUser?.releaseWatchlist) {
      setWatchlistIds(currentUser.releaseWatchlist);
    }
  }, [currentUser?.releaseWatchlist]);

  useEffect(() => {
    if (currentUser?.releaseReminders) {
      setReminderMap(currentUser.releaseReminders);
    }
  }, [currentUser?.releaseReminders]);

  // Periodic device reminder checker
  useEffect(() => {
    checkAndDispatchPendingReminders(GAME_RELEASES_DATABASE);
    const interval = setInterval(() => {
      checkAndDispatchPendingReminders(GAME_RELEASES_DATABASE);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<CalendarPlatform[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'popularity' | 'title_asc'>('date_asc');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Detect user local timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // Handle deep-link to initial game slug if provided in URL
  useEffect(() => {
    if (initialGameSlug) {
      const matched = GAME_RELEASES_DATABASE.find(
        r => r.slug.toLowerCase() === initialGameSlug.toLowerCase() || r.id.toLowerCase() === initialGameSlug.toLowerCase()
      );
      if (matched) {
        setSelectedRelease(matched);
      }
    }
  }, [initialGameSlug]);

  // Sync Watchlist handler: strict authentication check
  const handleToggleWatchlist = (release: GameRelease) => {
    if (!isSignedIn) {
      if (onOpenSignIn) onOpenSignIn();
      if (onShowToast) {
        onShowToast('Sign in or register to add games to your release watchlist and sync across devices.', 'alert');
      }
      return;
    }

    const exists = watchlistIds.includes(release.id);
    const next = exists ? watchlistIds.filter(id => id !== release.id) : [...watchlistIds, release.id];
    setWatchlistIds(next);
    try {
      localStorage.setItem('gv_release_watchlist', JSON.stringify(next));
    } catch {}

    if (onUpdateWatchlist) {
      onUpdateWatchlist(next);
    }

    if (onShowToast) {
      onShowToast(
        exists ? `Removed ${release.title} from watchlist.` : `Added ${release.title} to your release watchlist!`,
        exists ? 'info' : 'success'
      );
    }
  };

  // Set Reminder handler: strict authentication check + device notification permission request
  const handleSetReminder = async (release: GameRelease, type: 'day_of' | 'day_before' | 'week_before') => {
    if (!isSignedIn) {
      if (onOpenSignIn) onOpenSignIn();
      if (onShowToast) {
        onShowToast('Sign in or register to set launch reminders on your device.', 'alert');
      }
      return;
    }

    // Prompt user to give device permissions to send notifications to their devices
    const perm = await requestDeviceNotificationPermission();

    const next = { ...reminderMap, [release.id]: type };
    setReminderMap(next);
    try {
      localStorage.setItem('gv_release_reminders', JSON.stringify(next));
    } catch {}

    saveScheduledReminder(release, type);

    if (onUpdateReminders) {
      onUpdateReminders(next);
    }

    const label = getReminderTimingLabel(type);

    if (perm === 'granted') {
      triggerTestDeviceNotification(release, type);
      if (onShowToast) {
        onShowToast(`Launch reminder set! Device notifications enabled for ${release.title} (${label}).`, 'success');
      }
    } else if (perm === 'denied') {
      if (onShowToast) {
        onShowToast(`Reminder saved in your profile for ${release.title} (${label}). Note: Browser notifications are currently blocked in your browser settings.`, 'alert');
      }
    } else {
      if (onShowToast) {
        onShowToast(`Reminder saved in your profile for ${release.title} (${label}).`, 'success');
      }
    }
  };

  // Share handler
  const handleShareRelease = (release: GameRelease) => {
    const text = `${release.title} releases on ${release.releaseDateDisplay} for ${release.platforms.join(', ')} — via Game Vault Forum`;
    const url = `${window.location.origin}/game-release-calendar?game=${release.slug}`;
    if (navigator.share) {
      navigator.share({ title: release.title, text, url }).catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(`${text}\n${url}`)
        .then(() => {
          if (onShowToast) {
            onShowToast(`Copied release details and link for ${release.title}!`, 'success');
          }
        })
        .catch(() => {
          if (onShowToast) {
            onShowToast(`Share link: ${url}`, 'info');
          }
        });
    } else {
      if (onShowToast) {
        onShowToast(`Share link: ${url}`, 'info');
      }
    }
  };

  // Quick Platform Toggle
  const togglePlatform = (plat: CalendarPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatforms([]);
    setSelectedGenre('all');
    setSelectedStatus('all');
    setDatePreset('all');
    setSortBy('date_asc');
    setOnlyWatchlist(false);
    setSelectedCalendarDate(null);
  };

  // Filtered & Sorted Releases
  const filteredReleases = useMemo(() => {
    let result = [...GAME_RELEASES_DATABASE];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.developer.toLowerCase().includes(q) ||
        r.publisher.toLowerCase().includes(q) ||
        r.genre.toLowerCase().includes(q) ||
        r.platforms.some(p => p.toLowerCase().includes(q))
      );
    }

    // 2. Platforms
    if (selectedPlatforms.length > 0) {
      result = result.filter(r => 
        selectedPlatforms.some(sp => r.platforms.includes(sp))
      );
    }

    // 3. Genre
    if (selectedGenre !== 'all') {
      result = result.filter(r => r.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    // 4. Status
    if (selectedStatus !== 'all') {
      result = result.filter(r => r.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // 5. Watchlist Only
    if (onlyWatchlist) {
      result = result.filter(r => watchlistIds.includes(r.id));
    }

    // 6. Selected Calendar Day
    if (selectedCalendarDate) {
      result = result.filter(r => r.releaseDate === selectedCalendarDate);
    }

    // 7. Date Presets (Dynamic relative to real calendar date)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const thisMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const nextMonthObj = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthPrefix = `${nextMonthObj.getFullYear()}-${String(nextMonthObj.getMonth() + 1).padStart(2, '0')}`;
    const next90Obj = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const next90Str = next90Obj.toISOString().split('T')[0];

    if (datePreset === 'today') {
      result = result.filter(r => r.isConfirmed && r.releaseDate === todayStr);
    } else if (datePreset === 'this_week') {
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + mondayOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const startStr = monday.toISOString().split('T')[0];
      const endStr = sunday.toISOString().split('T')[0];
      result = result.filter(r => r.isConfirmed && r.releaseDate >= startStr && r.releaseDate <= endStr);
    } else if (datePreset === 'this_month') {
      result = result.filter(r => r.isConfirmed && r.releaseDate.startsWith(thisMonthPrefix));
    } else if (datePreset === 'next_month') {
      result = result.filter(r => r.isConfirmed && r.releaseDate.startsWith(nextMonthPrefix));
    } else if (datePreset === 'next_3_months') {
      result = result.filter(r => r.isConfirmed && r.releaseDate >= todayStr && r.releaseDate <= next90Str);
    } else if (datePreset === 'upcoming') {
      result = result.filter(r => (r.status === 'Upcoming' && r.isConfirmed && r.releaseDate >= todayStr) || r.status === 'TBA');
    } else if (datePreset === 'year_2025') {
      result = result.filter(r => r.releaseDate.startsWith('2025') || r.releaseDateDisplay.includes('2025'));
    } else if (datePreset === 'year_2024') {
      result = result.filter(r => r.releaseDate.startsWith('2024') || r.releaseDateDisplay.includes('2024'));
    } else if (datePreset === 'released') {
      result = result.filter(r => r.status === 'Released');
    } else if (datePreset === 'delayed') {
      result = result.filter(r => r.status === 'Delayed');
    } else if (datePreset === 'tba') {
      result = result.filter(r => r.status === 'TBA' || !r.isConfirmed);
    }

    // 8. Sorting
    result.sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.hypeScore || 50) - (a.hypeScore || 50);
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'date_desc') {
        if (a.releaseDate === 'TBA') return 1;
        if (b.releaseDate === 'TBA') return -1;
        return b.releaseDate.localeCompare(a.releaseDate);
      }
      // date_asc default
      if (a.releaseDate === 'TBA') return 1;
      if (b.releaseDate === 'TBA') return -1;
      return a.releaseDate.localeCompare(b.releaseDate);
    });

    return result;
  }, [
    searchQuery, 
    selectedPlatforms, 
    selectedGenre, 
    selectedStatus, 
    onlyWatchlist, 
    watchlistIds, 
    selectedCalendarDate, 
    datePreset, 
    sortBy
  ]);

  // Today's Scheduled Releases
  const releasesToday = useMemo(() => getReleasesToday(), []);

  // This Week's Releases
  const releasesThisWeek = useMemo(() => getReleasesThisWeek(), []);

  // Dynamic Current Week Label (e.g. Feb 24 – Mar 2)
  const currentWeekLabel = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, []);

  // Month's Top Highlights
  const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const monthlyHighlights = useMemo(() => {
    const inMonth = GAME_RELEASES_DATABASE.filter(r => r.releaseDate.startsWith(currentMonthStr));
    if (inMonth.length > 0) {
      return inMonth.sort((a, b) => (b.hypeScore || 0) - (a.hypeScore || 0)).slice(0, 4);
    }
    return GAME_RELEASES_DATABASE.filter(r => r.isMajorHighlight)
      .sort((a, b) => (b.hypeScore || 0) - (a.hypeScore || 0))
      .slice(0, 4);
  }, [currentMonthStr]);

  // Next Upcoming Countdowns
  const upcomingNext = useMemo(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    const upcoming = GAME_RELEASES_DATABASE.filter(r => r.status === 'Upcoming' && r.releaseDate >= todayIso);
    if (upcoming.length > 0) {
      return upcoming.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)).slice(0, 4);
    }
    return GAME_RELEASES_DATABASE.filter(r => r.status === 'Upcoming' || r.status === 'TBA')
      .sort((a, b) => (b.hypeScore || 0) - (a.hypeScore || 0))
      .slice(0, 4);
  }, []);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedCalendarDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedCalendarDate(null);
  };

  const handleTodayMonth = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    setSelectedCalendarDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  };

  return (
    <div className="min-h-screen bg-[#060812] text-slate-100 font-sans pb-24 selection:bg-purple-600 selection:text-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb Header */}
        <ToolHeader
          title="Game Release Calendar"
          subtitle="Discover upcoming video game releases by date, platform, genre, and more across PC, PlayStation, Xbox, and Nintendo."
          badgeText="Verified Gaming Release Database"
          breadcrumbs={[
            { label: 'Utilities Hub', onClick: () => onNavigateTab('tools') },
            { label: 'Game Release Calendar' }
          ]}
          icon={<CalendarIcon className="w-5 h-5 text-purple-400" />}
        />

        {/* Factual Integrity & Verified Database Banner */}
        <div className="mb-6 rounded-2xl bg-[#090d1f] border border-emerald-500/30 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-md shadow-emerald-950/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold font-['Space_Grotesk'] text-white">
                  100% Fact-Checked & Verified Game Releases
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Zero Hallucinations Guarantee
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-['Inter']">
                Strictly validated against official publisher press releases and storefronts. Placeholder dates and rumors are strictly prohibited.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFactCheckModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>View Verification Audit ({databaseAudit.report.totalGames} Games)</span>
          </button>
        </div>

        {/* AI Release Assistant Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#10142b] to-indigo-950/60 border border-purple-500/30 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center shrink-0 text-purple-300 shadow-md shadow-purple-900/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white">
                  AI Release Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-['Inter']">
                Query our release database with Gemini 3.5 Flash and verified live web grounding. Ask about upcoming RPGs, delay reasons, platform roadmaps, or PC requirements.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAiAssistantOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Release AI</span>
          </button>
        </div>

        {/* Section 1: RELEASING TODAY */}
        <section className="mb-10" aria-labelledby="today-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 id="today-heading" className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                Releasing Today
              </h2>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Local Timezone: {userTimezone}
            </span>
          </div>

          {releasesToday.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {releasesToday.map((rel) => (
                <ReleaseCard
                  key={rel.id}
                  release={rel}
                  onOpenDetails={(r) => setSelectedRelease(r)}
                  onCheckSpecs={onCheckPcSpecs}
                  onAddToWheel={onAddToWheel}
                  isWatchlisted={watchlistIds.includes(rel.id)}
                  onToggleWatchlist={handleToggleWatchlist}
                  hasReminder={Boolean(reminderMap[rel.id])}
                  onOpenReminderModal={(r) => handleSetReminder(r, 'day_of')}
                  onShare={handleShareRelease}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#0c0e1b] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    No Major AAA Video Games Launching Today
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Explore confirmed 2025 blockbusters (Monster Hunter Wilds, Civilization VII, Kingdom Come Deliverance II, Avowed) or browse recent launches.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDatePreset('upcoming');
                  setViewType('grid');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-md shadow-purple-900/30"
              >
                View Confirmed Upcoming
              </button>
            </div>
          )}
        </section>

        {/* Section 2: THIS WEEK & WHAT'S COMING NEXT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* This Week's Game Releases (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0b0e1b] border border-white/10 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  This Week's Game Releases
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">{currentWeekLabel}</span>
            </div>

            {releasesThisWeek.length > 0 ? (
              <div className="space-y-3">
                {releasesThisWeek.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedRelease(rel)}
                    className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={rel.cover}
                        alt={rel.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-purple-400">{rel.releaseDateDisplay}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 truncate">{rel.genre}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 truncate font-['Space_Grotesk']">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {rel.platforms.join(' • ')}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-purple-600/30 group-hover:bg-purple-600 text-white font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors">
                      View
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-slate-400 font-medium">No major games launching this calendar week.</p>
                <button
                  type="button"
                  onClick={() => {
                    setDatePreset('upcoming');
                    setViewType('grid');
                  }}
                  className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-bold font-['Rajdhani'] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Browse Confirmed 2025 Schedule →
                </button>
              </div>
            )}
          </div>

          {/* What's Coming Next Countdown (1 Col) */}
          <div className="rounded-2xl bg-[#0b0e1b] border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  What's Coming Next?
                </h3>
              </div>

              <div className="space-y-3">
                {upcomingNext.map((rel) => {
                  const hasExactDate = rel.isConfirmed && rel.releaseDate !== 'TBA' && Boolean(rel.releaseDate.match(/^\d{4}-\d{2}-\d{2}$/));
                  const now = new Date();
                  const todayTime = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).getTime();
                  const targetTime = hasExactDate ? new Date(`${rel.releaseDate}T00:00:00Z`).getTime() : NaN;
                  const diffDays = isNaN(targetTime) ? null : Math.round((targetTime - todayTime) / (1000 * 60 * 60 * 24));
                  const isFuture = diffDays !== null && diffDays > 0;

                  return (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedRelease(rel)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-amber-400 font-bold font-mono">
                          {!hasExactDate 
                            ? 'Window TBA' 
                            : isFuture 
                            ? `In ${diffDays} ${diffDays === 1 ? 'day' : 'days'}` 
                            : diffDays === 0
                            ? 'Out Today'
                            : 'Available Now'}
                        </span>
                        <span className="text-slate-400">{rel.releaseDateDisplay}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate font-['Space_Grotesk']">
                        {rel.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {rel.platforms.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDatePreset('this_month');
                setViewType('grid');
              }}
              className="mt-4 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-300 hover:text-white transition-colors cursor-pointer text-center"
            >
              Explore Full Release Schedule
            </button>
          </div>
        </div>

        {/* Section 3: SEARCH, FILTER & PLATFORM TOOLBAR */}
        <section className="mb-8 rounded-2xl bg-[#0b0e1b] border border-white/10 p-5 shadow-xl space-y-4">
          {/* Top Row: Search Input + View Mode Buttons + Advanced Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search game title, developer, publisher, or genre..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060812] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle (Month / List / Grid) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060812] border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setViewType('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewType === 'month'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Monthly Calendar View"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => setViewType('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewType === 'grid'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewType('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewType === 'list'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Chronological List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(prev => !prev)}
              className={`px-3 py-2 rounded-xl border text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                showAdvancedFilters || selectedPlatforms.length > 0 || selectedGenre !== 'all' || selectedStatus !== 'all' || datePreset !== 'all'
                  ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(selectedPlatforms.length > 0 || selectedGenre !== 'all' || selectedStatus !== 'all' || datePreset !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              )}
            </button>
          </div>

          {/* Quick Platform Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-['Rajdhani'] uppercase tracking-wider text-slate-400 font-bold shrink-0 mr-1">
              Platforms:
            </span>
            <button
              type="button"
              onClick={() => setSelectedPlatforms([])}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedPlatforms.length === 0
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            {ALL_PLATFORMS.map((plat) => {
              const active = selectedPlatforms.includes(plat);
              return (
                <button
                  key={plat}
                  type="button"
                  onClick={() => togglePlatform(plat)}
                  className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{plat}</span>
                  {active && <span className="text-[10px]">✕</span>}
                </button>
              );
            })}
          </div>

          {/* Quick Date Presets Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-['Rajdhani'] uppercase tracking-wider text-slate-400 font-bold shrink-0 mr-1">
              Timeframe:
            </span>
            {[
              { id: 'all', label: 'All Verified Releases' },
              { id: 'upcoming', label: 'Confirmed Upcoming' },
              { id: 'year_2025', label: '2025 Roadmap' },
              { id: 'year_2024', label: '2024 Blockbusters' },
              { id: 'this_month', label: 'This Month' },
              { id: 'next_3_months', label: 'Next 90 Days' },
              { id: 'tba', label: 'TBA / In Development' },
              { id: 'released', label: 'Released Archive' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDatePreset(preset.id)}
                className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-colors cursor-pointer ${
                  datePreset === preset.id
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-400 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}

            {/* Watchlist Quick Filter */}
            <button
              type="button"
              onClick={() => setOnlyWatchlist(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                onlyWatchlist
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Watchlist ({watchlistIds.length})</span>
            </button>
          </div>

          {/* Advanced Filter Drawers (Genre, Status, Sort) */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in text-xs font-['Inter']">
              {/* Genre Filter */}
              <div>
                <label className="block text-[11px] font-['Rajdhani'] uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060812] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Genres</option>
                  {ALL_GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Release Status */}
              <div>
                <label className="block text-[11px] font-['Rajdhani'] uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Release Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060812] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Releasing Today">Releasing Today</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Released">Released</option>
                  <option value="Early Access">Early Access</option>
                  <option value="Delayed">Delayed</option>
                  <option value="TBA">TBA</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[11px] font-['Rajdhani'] uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Sort Releases
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060812] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="date_asc">Release Date (Earliest First)</option>
                  <option value="date_desc">Release Date (Latest First)</option>
                  <option value="popularity">Most Anticipated (Hype Score)</option>
                  <option value="title_asc">Title (A to Z)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-purple-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 4: RELEASE STATISTICS SUMMARY BAR */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-white">
              Showing {filteredReleases.length} {filteredReleases.length === 1 ? 'game release' : 'game releases'}
            </span>
            <span>•</span>
            <span>{filteredReleases.filter(r => r.platforms.includes('PC')).length} PC</span>
            <span>•</span>
            <span>{filteredReleases.filter(r => r.platforms.includes('PlayStation 5')).length} PS5</span>
            <span>•</span>
            <span>{filteredReleases.filter(r => r.platforms.includes('Xbox Series X/S')).length} Xbox</span>
            <span>•</span>
            <span>{filteredReleases.filter(r => r.platforms.includes('Nintendo Switch') || r.platforms.includes('Nintendo Switch 2')).length} Switch</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedCalendarDate && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[11px] font-semibold">
                Date: {selectedCalendarDate}
              </span>
            )}
            {onlyWatchlist && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
                Watchlist View Active
              </span>
            )}
          </div>
        </div>

        {/* Section 5: MAIN VIEW DISPLAY (Month / Grid / List) */}
        <section className="mb-14" aria-label="Game Releases View">
          {viewType === 'month' && (
            <MonthCalendarView
              currentYear={currentYear}
              currentMonth={currentMonth}
              releases={filteredReleases}
              selectedDate={selectedCalendarDate}
              onSelectDate={(date) => setSelectedCalendarDate(date)}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleTodayMonth}
              onOpenRelease={(r) => setSelectedRelease(r)}
            />
          )}

          {viewType === 'list' && (
            <ReleaseListView
              releases={filteredReleases}
              onOpenDetails={(r) => setSelectedRelease(r)}
              onOpenReminderModal={(r) => handleSetReminder(r, 'day_of')}
              watchlistIds={watchlistIds}
              onToggleWatchlist={handleToggleWatchlist}
            />
          )}

          {viewType === 'grid' && (
            <div>
              {filteredReleases.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredReleases.map((release) => (
                    <ReleaseCard
                      key={release.id}
                      release={release}
                      onOpenDetails={(r) => setSelectedRelease(r)}
                      onCheckSpecs={onCheckPcSpecs}
                      onAddToWheel={onAddToWheel}
                      isWatchlisted={watchlistIds.includes(release.id)}
                      onToggleWatchlist={handleToggleWatchlist}
                      hasReminder={Boolean(reminderMap[release.id])}
                      onOpenReminderModal={(r) => handleSetReminder(r, 'day_of')}
                      onShare={handleShareRelease}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center rounded-2xl bg-[#0c0f1e] border border-white/5 p-8">
                  <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    No Game Releases Match Current Criteria
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                    Try adjusting your platform, genre, or timeframe filters to discover more releases.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 6: MONTH'S BIGGEST RELEASES SPOTLIGHT */}
        <section className="mb-14 rounded-2xl bg-gradient-to-br from-[#0c0f20] via-[#090b14] to-[#141226] border border-white/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Month's Most Anticipated Releases
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-2xl font-['Inter']">
            Ranked by community wishlist velocity, pre-order metrics, and historical franchise engagement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthlyHighlights.map((rel, idx) => (
              <div
                key={rel.id}
                onClick={() => setSelectedRelease(rel)}
                className="group relative rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 p-3.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-slate-900">
                    <img
                      src={rel.cover}
                      alt={rel.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-amber-300 border border-white/15">
                      #{idx + 1} Hype
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-purple-400 block mb-0.5">
                    {rel.releaseDateDisplay}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 line-clamp-1 font-['Space_Grotesk']">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {rel.shortDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">{rel.genre}</span>
                  <span className="text-purple-400 font-semibold group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: EDUCATIONAL KNOWLEDGE BASE & FAQ */}
        <CalendarEducationalFaq />
      </div>

      {/* Release Details Full Modal */}
      <ReleaseDetailsModal
        release={selectedRelease}
        onClose={() => setSelectedRelease(null)}
        onCheckSpecs={onCheckPcSpecs}
        onCalculateFps={onCalculateFps}
        onAddToWheel={onAddToWheel}
        onAskVaultAi={onAskVaultAi}
        isWatchlisted={selectedRelease ? watchlistIds.includes(selectedRelease.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        hasReminder={selectedRelease ? Boolean(reminderMap[selectedRelease.id]) : false}
        onSetReminder={handleSetReminder}
        onShare={handleShareRelease}
      />

      {/* AI Release Assistant Modal */}
      <AiReleaseAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        allReleases={GAME_RELEASES_DATABASE}
        onSelectGameTitle={(title) => {
          setIsAiAssistantOpen(false);
          setSearchQuery(title);
        }}
      />

      {/* Fact-Check Audit Modal */}
      <FactCheckAuditModal
        isOpen={isFactCheckModalOpen}
        onClose={() => setIsFactCheckModalOpen(false)}
        auditReport={databaseAudit.report}
        onSelectGame={(title) => setSearchQuery(title)}
      />
    </div>
  );
};
