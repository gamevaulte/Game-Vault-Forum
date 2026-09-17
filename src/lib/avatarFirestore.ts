import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  limit, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { AvatarPreset, SavedAvatar } from '../types/avatar';

const PRESETS_COLLECTION = 'avatar_presets';
const AVATARS_COLLECTION = 'avatars';

/**
 * Loads all avatar presets from Firestore database.
 * If empty or unreachable, falls back to in-memory presets.
 */
export async function loadAvatarPresetsFromDb(fallbackPresets: AvatarPreset[]): Promise<AvatarPreset[]> {
  try {
    const colRef = collection(db, PRESETS_COLLECTION);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const presets: AvatarPreset[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        presets.push({
          id: docSnap.id,
          name: data.name || 'Unnamed Preset',
          genre: data.genre || 'all',
          tagline: data.tagline || '',
          description: data.description || '',
          badge: data.badge || 'Popular',
          config: data.config
        });
      });
      return presets;
    }

    // If database collection is empty, automatically seed it with all available genres!
    await seedAvatarPresetsToDb(fallbackPresets);
    return fallbackPresets;
  } catch (err) {
    console.debug('Firestore presets load warning (using robust local fallback):', err);
    return fallbackPresets;
  }
}

/**
 * Seeds the Firestore database with avatars from all gaming genres.
 */
export async function seedAvatarPresetsToDb(presets: AvatarPreset[]): Promise<void> {
  try {
    const promises = presets.map((preset) => {
      const docRef = doc(db, PRESETS_COLLECTION, preset.id);
      return setDoc(docRef, {
        id: preset.id,
        name: preset.name,
        genre: preset.genre || 'all',
        tagline: preset.tagline,
        description: preset.description,
        badge: preset.badge,
        config: preset.config,
        createdAt: new Date().toISOString()
      }, { merge: true });
    });
    await Promise.all(promises);
    console.log(`Successfully populated database with ${presets.length} avatar presets across all genres.`);
  } catch (err) {
    console.debug('Failed to seed avatar presets into Firestore:', err);
  }
}

/**
 * Saves a user-generated avatar to the Firestore database.
 */
export async function saveAvatarToDb(avatar: SavedAvatar): Promise<boolean> {
  try {
    const docRef = doc(db, AVATARS_COLLECTION, avatar.id);
    await setDoc(docRef, {
      id: avatar.id,
      name: avatar.name,
      genre: avatar.genre || 'custom',
      config: avatar.config,
      previewDataUrl: avatar.previewDataUrl || null,
      createdAt: avatar.createdAt || new Date().toISOString(),
      userId: avatar.userId || 'anonymous',
      authorName: avatar.authorName || 'Game Vault Operative'
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save avatar to Firestore:', err);
    return false;
  }
}

/**
 * Loads community & recent saved avatars from Firestore database.
 */
export async function loadCommunityAvatarsFromDb(maxResults = 20): Promise<SavedAvatar[]> {
  try {
    const colRef = collection(db, AVATARS_COLLECTION);
    const q = query(colRef, limit(maxResults));
    const snap = await getDocs(q);

    const list: SavedAvatar[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        name: data.name,
        genre: data.genre,
        config: data.config,
        previewDataUrl: data.previewDataUrl,
        createdAt: data.createdAt,
        userId: data.userId,
        authorName: data.authorName
      });
    });
    return list;
  } catch (err) {
    console.debug('Failed to load community avatars from Firestore:', err);
    return [];
  }
}

/**
 * Deletes a user saved avatar from Firestore database.
 */
export async function deleteAvatarFromDb(avatarId: string): Promise<boolean> {
  try {
    const docRef = doc(db, AVATARS_COLLECTION, avatarId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Failed to delete avatar from Firestore:', err);
    return false;
  }
}
