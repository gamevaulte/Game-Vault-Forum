import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { ForumTopic, PostComment, UserAccount } from "../types";

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with configured databaseId per Firebase Integration Skill
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export interface FirestoreUserRecord {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL: string | null;
  role: 'user' | 'admin' | 'moderator';
  bio: string;
  badge: string;
  level: number;
  reputation: number;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  bookmarks?: {
    videos: string[];
    games: string[];
    articles: string[];
    reviews: string[];
    guides: string[];
  };
}

/**
 * Adds or synchronizes newly registered users into the Firestore collection called 'Users'.
 * Fulfills prompt requirement: "When new users register, add them to the Firestore called Users"
 */
export async function addRegisteredUserToFirestore(userData: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  bio?: string;
  emailVerified?: boolean;
}): Promise<FirestoreUserRecord> {
  const cleanEmail = (userData.email || '').trim();
  const isAdmin = cleanEmail.toLowerCase() === 'joelotis40@gmail.com';
  const rawName = userData.displayName?.trim() || cleanEmail.split('@')[0] || 'Vault Operative';
  const cleanUsername = `@${rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_')}`;

  const defaultAvatar = userData.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
  const nowIso = new Date().toISOString();

  // Document reference in collection 'Users'
  const userDocRef = doc(db, 'Users', userData.uid);

  try {
    const existingSnap = await getDoc(userDocRef);

    if (existingSnap.exists()) {
      // User already has a document; update lastLoginAt and any fresh fields
      const existingData = existingSnap.data() as Partial<FirestoreUserRecord>;
      const mergedRecord: FirestoreUserRecord = {
        uid: userData.uid,
        email: cleanEmail || existingData.email || '',
        displayName: rawName || existingData.displayName || 'Vault Operative',
        username: existingData.username || cleanUsername,
        photoURL: userData.photoURL || existingData.photoURL || defaultAvatar,
        role: isAdmin ? 'admin' : (existingData.role || 'user'),
        bio: existingData.bio || 'Gaming operative and tactical strategist.',
        badge: isAdmin ? 'Vault Overseer' : (existingData.badge || 'Vault Operative'),
        level: existingData.level || 1,
        reputation: existingData.reputation || 100,
        emailVerified: userData.emailVerified ?? existingData.emailVerified ?? false,
        createdAt: existingData.createdAt || nowIso,
        updatedAt: nowIso,
        lastLoginAt: nowIso,
        bookmarks: existingData.bookmarks || {
          videos: [],
          games: [],
          articles: [],
          reviews: [],
          guides: []
        }
      };

      await setDoc(userDocRef, mergedRecord, { merge: true });

      // Also mirror to lowercase collection for compatibility
      try {
        await setDoc(doc(db, 'users', userData.uid), mergedRecord, { merge: true });
      } catch (_) {}

      return mergedRecord;
    } else {
      // Brand new registration: create the document in 'Users'
      const newRecord: FirestoreUserRecord = {
        uid: userData.uid,
        email: cleanEmail,
        displayName: rawName,
        username: cleanUsername,
        photoURL: userData.photoURL || defaultAvatar,
        role: isAdmin ? 'admin' : 'user',
        bio: userData.bio || 'Gaming operative ready for tactical critique and vault analysis.',
        badge: isAdmin ? 'Vault Overseer' : 'Recruit Operative',
        level: 1,
        reputation: 100,
        emailVerified: userData.emailVerified || false,
        createdAt: nowIso,
        updatedAt: nowIso,
        lastLoginAt: nowIso,
        bookmarks: {
          videos: [],
          games: [],
          articles: [],
          reviews: [],
          guides: []
        }
      };

      await setDoc(userDocRef, newRecord);

      // Also mirror to lowercase collection for compatibility
      try {
        await setDoc(doc(db, 'users', userData.uid), newRecord);
      } catch (_) {}

      console.log(`Successfully registered user ${userData.uid} (${cleanEmail}) to Firestore collection 'Users'`);
      return newRecord;
    }
  } catch (error) {
    console.warn('Firestore addRegisteredUserToFirestore warning:', error);
    // Return constructed record even if offline or permission constrained
    return {
      uid: userData.uid,
      email: cleanEmail,
      displayName: rawName,
      username: cleanUsername,
      photoURL: userData.photoURL || defaultAvatar,
      role: isAdmin ? 'admin' : 'user',
      bio: userData.bio || 'Gaming operative ready for tactical critique and vault analysis.',
      badge: isAdmin ? 'Vault Overseer' : 'Recruit Operative',
      level: 1,
      reputation: 100,
      emailVerified: userData.emailVerified || false,
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: nowIso
    };
  }
}

/**
 * Retrieves an operative profile from the 'Users' Firestore collection
 */
export async function getUserFromFirestore(uid: string): Promise<FirestoreUserRecord | null> {
  try {
    const snap = await getDoc(doc(db, 'Users', uid));
    if (snap.exists()) {
      return snap.data() as FirestoreUserRecord;
    }
    // Fallback check in lowercase collection
    const altSnap = await getDoc(doc(db, 'users', uid));
    if (altSnap.exists()) {
      return altSnap.data() as FirestoreUserRecord;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch user from Firestore Users collection:', err);
    return null;
  }
}

/**
 * Updates an operative profile in Firestore collection 'Users'
 */
export async function updateUserInFirestore(uid: string, updates: Partial<FirestoreUserRecord>): Promise<void> {
  const updatePayload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  try {
    await updateDoc(doc(db, 'Users', uid), updatePayload);
  } catch (err) {
    // Attempt setDoc merge if document didn't exist yet
    try {
      await setDoc(doc(db, 'Users', uid), updatePayload, { merge: true });
    } catch (setErr) {
      console.warn('Failed to update user in Firestore Users collection:', setErr);
    }
  }
}

/**
 * Save new forum topic to Firestore
 */
export async function saveTopicToFirestore(topic: ForumTopic): Promise<void> {
  try {
    await setDoc(doc(db, 'topics', topic.id), topic, { merge: true });
  } catch (err) {
    console.warn('Firestore saveTopic warning:', err);
  }
}

/**
 * Save new article/video comment to Firestore
 */
export async function saveCommentToFirestore(postId: string, comment: PostComment): Promise<void> {
  try {
    await setDoc(doc(db, 'comments', comment.id), {
      ...comment,
      postId,
      savedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveComment warning:', err);
  }
}

/**
 * Record post like in Firestore
 */
export async function syncLikeToFirestore(itemId: string, count: number, userUid?: string, hasLiked?: boolean): Promise<void> {
  try {
    await setDoc(doc(db, 'likes', itemId), {
      itemId,
      count,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (userUid && hasLiked !== undefined) {
      await setDoc(doc(db, 'likes', `${itemId}_${userUid}`), {
        itemId,
        userUid,
        liked: hasLiked,
        timestamp: new Date().toISOString()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore syncLike warning:', err);
  }
}

/**
 * Save newsletter subscriber in Firestore
 */
export async function saveNewsletterSubscriber(email: string): Promise<void> {
  try {
    const clean = email.trim().toLowerCase();
    const subId = clean.replace(/[^a-z0-9]/g, '_');
    await setDoc(doc(db, 'subscribers', subId), {
      email: clean,
      subscribedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore subscriber warning:', err);
  }
}
