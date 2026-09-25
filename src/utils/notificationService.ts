import { GameRelease } from '../types/releaseCalendar';

export type ReminderTiming = 'day_of' | 'day_before' | 'week_before';

export interface StoredGameReminder {
  gameId: string;
  gameTitle: string;
  releaseDate: string;
  releaseDateDisplay: string;
  releaseTime?: string;
  reminderType: ReminderTiming;
  scheduledAt: string;
  notified: boolean;
}

const STORAGE_KEY = 'gv_release_reminders_queue';

/**
 * Checks if browser Notification API is available in the current client
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission state
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Requests device permission from the browser to send push/desktop notifications
 */
export async function requestDeviceNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    console.warn('Device notifications are not supported by this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return Notification.permission || 'denied';
  }
}

/**
 * Dispatches an instant native browser notification to the user's device
 */
export function sendDeviceNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }

  try {
    const defaultIcon = 'https://images.unsplash.com/photo-1612287233207-681b4f4945d8?w=128&auto=format&fit=crop&q=80';
    const notif = new Notification(title, {
      icon: defaultIcon,
      badge: defaultIcon,
      ...options
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    return notif;
  } catch (err) {
    console.error('Failed to trigger native device notification:', err);
    return null;
  }
}

/**
 * Returns human-readable label for reminder timing
 */
export function getReminderTimingLabel(timing: ReminderTiming): string {
  switch (timing) {
    case 'day_of':
      return 'on launch day';
    case 'day_before':
      return '1 day before launch';
    case 'week_before':
      return '1 week before launch';
    default:
      return 'on launch';
  }
}

/**
 * Adds or updates a scheduled game reminder in local device queue
 */
export function saveScheduledReminder(
  release: GameRelease,
  reminderType: ReminderTiming
): StoredGameReminder[] {
  const current = getScheduledReminders();
  const filtered = current.filter(r => r.gameId !== release.id);
  const newReminder: StoredGameReminder = {
    gameId: release.id,
    gameTitle: release.title,
    releaseDate: release.releaseDate,
    releaseDateDisplay: release.releaseDateDisplay,
    releaseTime: release.releaseTime,
    reminderType,
    scheduledAt: new Date().toISOString(),
    notified: false
  };

  const updated = [...filtered, newReminder];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

/**
 * Retrieves all scheduled reminders from device storage
 */
export function getScheduledReminders(): StoredGameReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Removes a reminder from local device queue
 */
export function removeScheduledReminder(gameId: string): StoredGameReminder[] {
  const current = getScheduledReminders();
  const updated = current.filter(r => r.gameId !== gameId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

/**
 * Triggers a live test browser notification so user can verify device alerts immediately
 */
export function triggerTestDeviceNotification(release: GameRelease, reminderType: ReminderTiming): boolean {
  if (getNotificationPermission() !== 'granted') {
    return false;
  }

  const timingText = getReminderTimingLabel(reminderType);
  const timeInfo = release.releaseTime ? ` (${release.releaseTime})` : '';

  sendDeviceNotification(`[Game Vault] Launch Alert: ${release.title}`, {
    body: `Device test alert verified! You will be reminded ${timingText} for ${release.releaseDateDisplay}${timeInfo}.`,
    tag: `vault-test-${release.id}`
  });

  return true;
}

/**
 * Background checker to evaluate pending game reminders against current date
 * Anchor date: September 24, 2026 (or live date if past)
 */
export function checkAndDispatchPendingReminders(releases: GameRelease[]): void {
  if (getNotificationPermission() !== 'granted') return;

  const reminders = getScheduledReminders();
  if (reminders.length === 0) return;

  // Reference calendar anchor is 2026-09-24
  const currentDateStr = '2026-09-24';
  let hasChanges = false;

  const updated = reminders.map(r => {
    if (r.notified) return r;

    const matchedRelease = releases.find(rel => rel.id === r.gameId);
    const releaseDate = matchedRelease ? matchedRelease.releaseDate : r.releaseDate;

    let shouldTrigger = false;

    if (r.reminderType === 'day_of' && releaseDate === currentDateStr) {
      shouldTrigger = true;
    } else if (r.reminderType === 'day_before') {
      // 1 day before: if release is 2026-09-25, then on 2026-09-24 it triggers
      if (releaseDate === '2026-09-25') shouldTrigger = true;
    } else if (r.reminderType === 'week_before') {
      // 1 week before: if release is 2026-10-01, then on 2026-09-24 it triggers
      if (releaseDate === '2026-10-01') shouldTrigger = true;
    }

    if (shouldTrigger) {
      sendDeviceNotification(`Launch Day Alert: ${r.gameTitle}!`, {
        body: `${r.gameTitle} launches ${r.releaseDateDisplay}${r.releaseTime ? ` at ${r.releaseTime}` : ''}! Check out system requirements and discussion on Game Vault.`,
        tag: `vault-launch-${r.gameId}`
      });
      hasChanges = true;
      return { ...r, notified: true };
    }

    return r;
  });

  if (hasChanges) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}
