import { GameRelease } from '../types/releaseCalendar';

/**
 * Calendar export utilities supporting:
 * 1. .ics iCalendar file generation & download (works with Apple Calendar, Google Calendar, Outlook, Thunderbird)
 * 2. Google Calendar direct web URL
 * 3. Outlook / Office 365 web URL
 */

function formatDateForIcs(dateStr: string): string {
  // If dateStr is YYYY-MM-DD
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}${month}${day}`;
  }
  // Fallback to today
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function getNextDayForIcs(dateStr: string): string {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const d = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  }
  return formatDateForIcs(dateStr);
}

export function downloadIcsFile(release: GameRelease) {
  if (typeof window === 'undefined') return;
  if (!release.isConfirmed || release.releaseDate === 'TBA' || !release.releaseDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
    console.warn('Cannot export unconfirmed or TBA release to calendar.');
    return;
  }

  const startDate = formatDateForIcs(release.releaseDate);
  const endDate = getNextDayForIcs(release.releaseDate);
  const nowStr = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const platformsStr = release.platforms.join(', ');
  const summary = `Game Release: ${release.title} (${platformsStr})`;
  const description = `${release.title} launches on ${release.releaseDateDisplay} for ${platformsStr}. Genre: ${release.genre}. Developer: ${release.developer}. Discovered on Game Vault Forum: https://www.gamevault.forum/game-release-calendar`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Game Vault Forum//Game Release Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:release-${release.id}-${startDate}@gamevault.forum`,
    `DTSTAMP:${nowStr}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `URL:https://www.gamevault.forum/game-release-calendar`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${release.slug || release.id}-release.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(release: GameRelease): string {
  if (!release.isConfirmed || release.releaseDate === 'TBA' || !release.releaseDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
    return '#';
  }
  const startDate = formatDateForIcs(release.releaseDate);
  const endDate = getNextDayForIcs(release.releaseDate);
  const platformsStr = release.platforms.join(', ');

  const title = encodeURIComponent(`${release.title} - Game Release`);
  const details = encodeURIComponent(
    `${release.title} is releasing today!\n\nPlatforms: ${platformsStr}\nGenre: ${release.genre}\nDeveloper: ${release.developer}\nPublisher: ${release.publisher}\n\nTracked via Game Vault Forum:\nhttps://www.gamevault.forum/game-release-calendar`
  );
  const location = encodeURIComponent(platformsStr);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
}

export function getOutlookCalendarUrl(release: GameRelease): string {
  if (!release.isConfirmed || release.releaseDate === 'TBA' || !release.releaseDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
    return '#';
  }
  const startDate = formatDateForIcs(release.releaseDate);
  const endDate = getNextDayForIcs(release.releaseDate);
  const platformsStr = release.platforms.join(', ');

  const subject = encodeURIComponent(`${release.title} - Video Game Release`);
  const body = encodeURIComponent(
    `${release.title} launches for ${platformsStr}.\nGenre: ${release.genre}.\nTracked via Game Vault Forum.`
  );

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${startDate}&enddt=${endDate}&body=${body}&allday=true`;
}
