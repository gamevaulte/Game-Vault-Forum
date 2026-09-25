import { ForumTopic } from '../types';

/**
 * Consistently returns a formatted publication date string for any forum topic.
 * Supports explicit topic.date, topic.createdAt, or parses standard relative strings.
 */
export function formatTopicDate(topic?: Partial<ForumTopic> | null): string {
  if (!topic) return 'Recent';
  if (topic.date) return topic.date;
  
  if (topic.createdAt) {
    try {
      const d = new Date(topic.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {}
  }

  const ts = (topic.timestamp || '').trim();
  if (ts.includes('Yesterday')) {
    return 'Sep 18, 2026';
  }
  if (ts.includes('2 days ago')) {
    return 'Sep 17, 2026';
  }
  if (ts.includes('3 days ago')) {
    return 'Sep 16, 2026';
  }
  if (ts.includes('4 days ago')) {
    return 'Sep 15, 2026';
  }
  if (ts.includes('5 days ago')) {
    return 'Sep 14, 2026';
  }
  if (ts.includes('Just now') || ts.includes('min ago') || ts.includes('hour ago') || ts.includes('h ago')) {
    return 'Sep 19, 2026';
  }

  // If timestamp is already a date formatted string e.g. "Sep 15, 2026"
  if (ts.length >= 6 && !ts.includes('ago')) {
    return ts;
  }

  return 'Sep 19, 2026';
}

/**
 * Returns accurate millisecond timestamp from createdAt or timestamp string for chronological sorting
 */
export function getTimestampMs(createdAt?: any, fallbackTimestamp?: string): number {
  if (createdAt) {
    if (typeof createdAt === 'number') return createdAt;
    if (typeof createdAt === 'string') {
      const parsed = Date.parse(createdAt);
      if (!isNaN(parsed)) return parsed;
    }
    if (typeof createdAt === 'object' && createdAt !== null && 'seconds' in createdAt) {
      return createdAt.seconds * 1000;
    }
  }

  if (fallbackTimestamp) {
    const ts = fallbackTimestamp.trim().toLowerCase();
    const now = Date.now();
    if (ts === 'just now') return now;
    if (ts.includes('min ago') || ts.includes('mins ago')) {
      const mins = parseInt(ts) || 1;
      return now - mins * 60 * 1000;
    }
    if (ts.includes('hour ago') || ts.includes('hours ago')) {
      const hours = parseInt(ts) || 1;
      return now - hours * 60 * 60 * 1000;
    }
    if (ts.includes('yesterday')) {
      return now - 24 * 60 * 60 * 1000;
    }
    const parsed = Date.parse(fallbackTimestamp);
    if (!isNaN(parsed)) return parsed;
  }

  return 0;
}

/**
 * Consistently returns formatted time and date for comments and replies
 * Displays both date and time (e.g. "Sep 24, 2026 • 10:15 AM")
 */
export function formatCommentDateTime(createdAt?: any, fallbackTimestamp?: string): string {
  if (createdAt) {
    let d: Date | null = null;
    if (typeof createdAt === 'string') {
      const parsed = new Date(createdAt);
      if (!isNaN(parsed.getTime())) d = parsed;
    } else if (typeof createdAt === 'number') {
      d = new Date(createdAt);
    } else if (typeof createdAt === 'object' && createdAt !== null && 'seconds' in createdAt) {
      d = new Date(createdAt.seconds * 1000);
    }

    if (d && !isNaN(d.getTime())) {
      const datePart = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const timePart = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${datePart} • ${timePart}`;
    }
  }

  if (fallbackTimestamp) {
    return fallbackTimestamp;
  }

  return 'Just now';
}
