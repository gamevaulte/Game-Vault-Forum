import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import { GeneratedGameStoryReport, UserSavedGameStory, GenerationMode, SpoilerLevel } from '../types/gameStory';

const LOCAL_STORAGE_KEY = 'gv_user_game_stories';

function getLocalStories(userId: string): UserSavedGameStory[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setLocalStories(userId: string, stories: UserSavedGameStory[]) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${userId}`, JSON.stringify(stories));
  } catch (e) {
    console.warn('LocalStorage save warning:', e);
  }
}

/**
 * Saves or updates a generated game story report in the user's personal library.
 * Supports report versioning (Version 1, Version 2, etc.) without silently overwriting.
 */
export async function saveUserGameStory(
  userId: string,
  report: GeneratedGameStoryReport,
  options?: { customTitle?: string; notes?: string; incrementVersion?: boolean }
): Promise<UserSavedGameStory> {
  const existingStories = await getUserGameStories(userId);
  const existing = existingStories.find(s => s.gameId === report.gameId);

  let version = 1;
  let versionsHistory: UserSavedGameStory['versionsHistory'] = [];

  if (existing) {
    version = (existing.version || 1) + 1;
    versionsHistory = [
      ...(existing.versionsHistory || []),
      {
        version: existing.version || 1,
        updatedAt: existing.updatedAt || existing.createdAt,
        generationMode: existing.generationMode,
        spoilerLevel: existing.spoilerLevel,
        report: existing.report
      }
    ];
  }

  const updatedReport: GeneratedGameStoryReport = {
    ...report,
    reportVersion: version,
    userNotes: options?.notes || existing?.notes || '',
    customUserTitle: options?.customTitle || existing?.customTitle || `${report.gameTitle} — ${report.generationMode.toUpperCase()} Story`
  };

  const storyRecord: UserSavedGameStory = {
    id: existing?.id || `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    gameId: report.gameId,
    gameTitle: report.gameTitle,
    gameSlug: report.gameSlug,
    coverImage: report.coverImage,
    report: updatedReport,
    generationMode: report.generationMode,
    spoilerLevel: report.spoilerLevel,
    customTitle: updatedReport.customUserTitle,
    notes: updatedReport.userNotes,
    version,
    versionsHistory,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Save to Local Storage immediately for snappy responsiveness
  const currentLocal = getLocalStories(userId);
  const filtered = currentLocal.filter(s => s.id !== storyRecord.id);
  setLocalStories(userId, [storyRecord, ...filtered]);

  // 2. Persist to Firestore if online & authenticated
  if (db && userId) {
    try {
      const docRef = doc(db, 'user_game_stories', storyRecord.id);
      await setDoc(docRef, storyRecord, { merge: true });
    } catch (err) {
      console.warn('[User Stories Firestore Warning]: Failed to sync to cloud, stored locally:', err);
    }
  }

  return storyRecord;
}

/**
 * Retrieves all saved game stories belonging to a user.
 */
export async function getUserGameStories(userId: string): Promise<UserSavedGameStory[]> {
  if (!userId) return [];

  // Start with local cache
  const localList = getLocalStories(userId);

  // If Firestore is available, fetch remote documents
  if (db) {
    try {
      const q = query(collection(db, 'user_game_stories'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const cloudStories: UserSavedGameStory[] = [];
        snapshot.forEach(docSnap => {
          cloudStories.push(docSnap.data() as UserSavedGameStory);
        });

        // Merge cloud and local
        const map = new Map<string, UserSavedGameStory>();
        localList.forEach(s => map.set(s.id, s));
        cloudStories.forEach(s => map.set(s.id, s));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setLocalStories(userId, merged);
        return merged;
      }
    } catch (err) {
      console.warn('[User Stories Firestore Warning]: Could not fetch remote stories, using local:', err);
    }
  }

  return localList;
}

/**
 * Deletes a game story report from the user's library.
 */
export async function deleteUserGameStory(userId: string, storyId: string): Promise<boolean> {
  const local = getLocalStories(userId);
  const updated = local.filter(s => s.id !== storyId);
  setLocalStories(userId, updated);

  if (db && userId) {
    try {
      await deleteDoc(doc(db, 'user_game_stories', storyId));
    } catch (err) {
      console.warn('[User Stories Delete Warning]:', err);
    }
  }

  return true;
}

/**
 * Updates title or notes on an existing saved report.
 */
export async function updateUserStoryMetadata(
  userId: string, 
  storyId: string, 
  updates: { customTitle?: string; notes?: string }
): Promise<UserSavedGameStory | null> {
  const stories = await getUserGameStories(userId);
  const target = stories.find(s => s.id === storyId);
  if (!target) return null;

  const updated: UserSavedGameStory = {
    ...target,
    customTitle: updates.customTitle !== undefined ? updates.customTitle : target.customTitle,
    notes: updates.notes !== undefined ? updates.notes : target.notes,
    updatedAt: new Date().toISOString()
  };

  const filtered = stories.filter(s => s.id !== storyId);
  setLocalStories(userId, [updated, ...filtered]);

  if (db) {
    try {
      await setDoc(doc(db, 'user_game_stories', storyId), updated, { merge: true });
    } catch (err) {
      console.warn('[User Stories Metadata Update Warning]:', err);
    }
  }

  return updated;
}
