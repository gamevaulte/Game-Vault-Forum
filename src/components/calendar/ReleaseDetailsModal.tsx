import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  Share2, 
  Bell, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Monitor, 
  Cpu, 
  HardDrive, 
  Layers, 
  Dices, 
  Bot, 
  Download, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { GameRelease } from '../../types/releaseCalendar';
import { downloadIcsFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from '../../utils/calendarExport';
import { validateGameRelease } from '../../utils/factCheck';

interface ReleaseDetailsModalProps {
  release: GameRelease | null;
  onClose: () => void;
  onCheckSpecs?: (gameTitle: string) => void;
  onCalculateFps?: (gameTitle: string) => void;
  onAddToWheel?: (gameTitle: string) => void;
  onAskVaultAi?: (gameTitle: string) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (release: GameRelease) => void;
  hasReminder?: boolean;
  onSetReminder?: (release: GameRelease, type: 'day_of' | 'day_before' | 'week_before') => void;
  onShare?: (release: GameRelease) => void;
}

export const ReleaseDetailsModal: React.FC<ReleaseDetailsModalProps> = ({
  release,
  onClose,
  onCheckSpecs,
  onCalculateFps,
  onAddToWheel,
  onAskVaultAi,
  isWatchlisted = false,
  onToggleWatchlist,
  hasReminder = false,
  onSetReminder,
  onShare
}) => {
  if (!release) return null;

  const [reminderSelected, setReminderSelected] = useState<'day_of' | 'day_before' | 'week_before'>('day_of');
  const [copiedLink, setCopiedLink] = useState(false);

  // Detect local timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const factCheck = validateGameRelease(release);

  const handleShareClick = () => {
    if (onShare) {
      onShare(release);
    } else {
      const url = `${window.location.origin}/game-release-calendar?game=${release.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-modal-title"
    >
      <div 
        className="relative w-full max-w-3xl my-8 rounded-2xl bg-[#0c0e1a] border border-white/15 shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Backdrop Banner */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900">
          <img
            src={release.cover}
            alt={release.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e1a] via-[#0c0e1a]/60 to-transparent" />

          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 border border-white/20 text-slate-300 hover:text-white hover:bg-black/90 transition-colors z-10"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Pill Bar */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-['Space_Grotesk'] bg-purple-600/80 border border-purple-400 text-white backdrop-blur-md">
              {release.status}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 border border-white/20 text-slate-200 backdrop-blur-md">
              {release.genre}
            </span>
            {release.hypeScore && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-md">
                🔥 {release.hypeScore}% Hype Score
              </span>
            )}
          </div>

          {/* Bottom Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 id="release-modal-title" className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
              {release.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-purple-300 font-medium mt-1">
              <span>Dev: {release.developer}</span>
              <span>•</span>
              <span>Pub: {release.publisher}</span>
              {release.releaseRegion && (
                <>
                  <span>•</span>
                  <span>Region: {release.releaseRegion}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[calc(85vh-200px)] overflow-y-auto">
          {/* Release Date & Time Card with Factual Integrity */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-['Rajdhani'] uppercase tracking-wider text-purple-400 font-bold block">
                  {factCheck.dateClassification === 'exact_day_confirmed'
                    ? 'Confirmed Official Launch Date'
                    : factCheck.dateClassification === 'window_announced'
                    ? 'Official Announced Release Window'
                    : 'Active Development — Release Date TBA'}
                </span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold border ${
                  factCheck.dateClassification === 'exact_day_confirmed'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : factCheck.dateClassification === 'window_announced'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-500/20 border-slate-500/40 text-slate-300'
                }`}>
                  {factCheck.dateClassification === 'exact_day_confirmed' ? '✓ Verified Exact Day' : 'Window / TBA Only'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                <span>{factCheck.verifiedReleaseDisplay}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {factCheck.dateClassification === 'exact_day_confirmed' && release.releaseTime
                    ? `${release.releaseTime} (${userTimezone})`
                    : 'Exact launch hour not scheduled / TBA'}
                </span>
              </div>
            </div>

            {/* Quick Watchlist & Remind Buttons */}
            <div className="flex items-center gap-2">
              {onToggleWatchlist && (
                <button
                  type="button"
                  onClick={() => onToggleWatchlist(release)}
                  className={`px-3 py-2 rounded-xl border text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isWatchlisted
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShareClick}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Factual Integrity & Source Verification Box */}
          <div className="p-3.5 rounded-xl bg-[#090c1a] border border-white/10 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 text-slate-300 font-['Inter']">
              <div className="flex items-center gap-2 flex-wrap font-semibold text-white">
                <span>Verified Source:</span>
                <span className="text-purple-300">{factCheck.officialSource}</span>
                {factCheck.officialSourceUrl && (
                  <a
                    href={factCheck.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5 text-[11px]"
                  >
                    <span>View Official Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {factCheck.verificationNotes}
              </p>
            </div>
          </div>

          {/* Delay Notice Banner if applicable */}
          {release.status === 'Delayed' && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200">
              <div className="flex items-center gap-2 font-bold font-['Space_Grotesk'] text-rose-400 text-sm mb-1">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Official Release Delay Notice</span>
              </div>
              <p className="text-xs text-rose-300 leading-relaxed">
                {release.delayReason || 'This game was officially rescheduled.'}
              </p>
              {release.previousReleaseDate && (
                <p className="text-xs text-rose-400/80 mt-1 font-mono">
                  Original target date: {release.previousReleaseDate} → New date: {release.releaseDateDisplay}
                </p>
              )}
            </div>
          )}

          {/* Platforms */}
          <div>
            <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Available Platforms
            </h4>
            <div className="flex flex-wrap gap-2">
              {release.platforms.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-purple-300"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Game Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-['Inter']">
              {release.fullDescription || release.shortDescription}
            </p>
          </div>

          {/* System Requirements (if PC available) */}
          {release.systemRequirements && (
            <div className="rounded-xl border border-white/10 bg-[#080a14] p-4">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" />
                  <span>PC System Requirements</span>
                </h4>
                {onCheckSpecs && (
                  <button
                    type="button"
                    onClick={() => onCheckSpecs(release.title)}
                    className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test your PC hardware</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-['Inter']">
                <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider font-['Rajdhani']">
                    Minimum Requirements
                  </span>
                  <p><span className="text-slate-400">CPU:</span> {release.systemRequirements.minCpu || 'Standard Multi-Core CPU'}</p>
                  <p><span className="text-slate-400">GPU:</span> {release.systemRequirements.minGpu || 'DirectX 12 Compatible'}</p>
                  <p><span className="text-slate-400">RAM:</span> {release.systemRequirements.minRam || '8 GB'}</p>
                  <p><span className="text-slate-400">Storage:</span> {release.systemRequirements.storage || 'SSD'}</p>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-bold text-purple-300 block text-[11px] uppercase tracking-wider font-['Rajdhani']">
                    Recommended Requirements
                  </span>
                  <p><span className="text-slate-400">CPU:</span> {release.systemRequirements.recCpu || 'High-Performance 8-Core CPU'}</p>
                  <p><span className="text-slate-400">GPU:</span> {release.systemRequirements.recGpu || 'RTX 2060 / RX 6600 or higher'}</p>
                  <p><span className="text-slate-400">RAM:</span> {release.systemRequirements.recRam || '16 GB'}</p>
                  <p><span className="text-slate-400">Storage:</span> {release.systemRequirements.storage || 'Fast NVMe SSD'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Export to Calendar Section */}
          {release.releaseDate !== 'TBA' && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-purple-400" />
                <span>Export Release Event to Calendar</span>
              </h4>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={getGoogleCalendarUrl(release)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-['Space_Grotesk'] font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
                </a>

                <a
                  href={getOutlookCalendarUrl(release)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-xs font-['Space_Grotesk'] font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Outlook Live</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
                </a>

                <button
                  type="button"
                  onClick={() => downloadIcsFile(release)}
                  className="px-3.5 py-2 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-xs font-['Space_Grotesk'] font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-teal-300" />
                  <span>Download .ICS File</span>
                </button>
              </div>
            </div>
          )}

          {/* Remind Me Selector */}
          {onSetReminder && release.releaseDate !== 'TBA' && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  <span>Set Launch Day Reminder</span>
                </h4>
                {hasReminder && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reminder Active</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'day_of', label: 'On Release Day' },
                  { id: 'day_before', label: '1 Day Before' },
                  { id: 'week_before', label: '1 Week Before' }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setReminderSelected(option.id as any);
                      onSetReminder(release, option.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-['Space_Grotesk'] font-semibold border transition-colors cursor-pointer ${
                      reminderSelected === option.id && hasReminder
                        ? 'bg-amber-500 border-amber-400 text-black font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Store & Official Links */}
          {release.storeLinks && release.storeLinks.length > 0 && (
            <div>
              <h4 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Official Store & Publisher Links
              </h4>
              <div className="flex flex-wrap gap-2">
                {release.storeLinks.map((store, idx) => (
                  <a
                    key={idx}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-purple-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>{store.store}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))}
                {release.officialWebsite && (
                  <a
                    href={release.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>Official Website</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Game Vault Utilities Hub Integration */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] font-['Rajdhani'] uppercase tracking-wider text-slate-400 font-bold block mb-2">
              Connected Game Vault Forum Tools
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {onCheckSpecs && release.platforms.includes('PC') && (
                <button
                  type="button"
                  onClick={() => onCheckSpecs(release.title)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-['Space_Grotesk'] mb-0.5">
                    <Monitor className="w-4 h-4" />
                    <span>PC Spec Checker</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Test if your hardware meets requirements</p>
                </button>
              )}

              {onCalculateFps && release.platforms.includes('PC') && (
                <button
                  type="button"
                  onClick={() => onCalculateFps(release.title)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-['Space_Grotesk'] mb-0.5">
                    <Cpu className="w-4 h-4" />
                    <span>FPS Calculator</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Estimate 1080p, 1440p, and 4K frame rates</p>
                </button>
              )}

              {onAddToWheel && (
                <button
                  type="button"
                  onClick={() => onAddToWheel(release.title)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-['Space_Grotesk'] mb-0.5">
                    <Dices className="w-4 h-4" />
                    <span>Game Picker Wheel</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Add to wheel to solve gaming backlog</p>
                </button>
              )}

              {onAskVaultAi && (
                <button
                  type="button"
                  onClick={() => onAskVaultAi(release.title)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group sm:col-span-3"
                >
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-['Space_Grotesk'] mb-0.5">
                    <Bot className="w-4 h-4" />
                    <span>Ask Vault AI Copilot</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Get instant tactical breakdowns, gameplay lore, and hardware recommendations for {release.title}
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#080a14] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Data source: {release.dataSource || 'Game Vault Verified Database'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
