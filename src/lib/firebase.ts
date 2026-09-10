import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  initializeFirestore,
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  updateDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { ForumTopic, PostComment, UserAccount, ContactSubmission, NewsletterSubscriber, ContactSubmissionStatus } from "../types";

// Initialize Firebase App
export { firebaseConfig };
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firebase Analytics if supported in the environment (browser window context)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized.");
    }
  }).catch((err) => {
    console.debug("Firebase Analytics not supported in current environment:", err);
  });
}

// Initialize Firestore with long-polling transport to prevent proxy/iframe stream buffering timeouts
try {
  initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  // If already initialized in hot-reload or sub-context, fallback cleanly
}

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */

// Validate connection to Firestore on initialization per Firebase Integration Skill
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Standard Firestore Error Handling Types & Helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

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
    topics?: string[];
  };
  stats?: {
    likesCount: number;
    commentsCount: number;
    savesCount: number;
    topicsCount: number;
  };
}

/**
 * Adds or synchronizes newly registered users into the Firestore collection called 'Users'.
 * Fulfills prompt requirement: "When new users register, add them to the Firestore called Users"
 * Every user starts with 0 counts for likes, comments, saves, and reputation!
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
  const lowerEmail = cleanEmail.toLowerCase();
  const isAdmin = lowerEmail === 'contact@gamevault.forum';
  const rawName = userData.displayName?.trim() || cleanEmail.split('@')[0] || 'Vault Operative';
  const cleanUsername = `@${rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_')}`;

  const defaultAvatar = userData.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
  const nowIso = new Date().toISOString();

  // Document reference in collection 'Users'
  const userDocRef = doc(db, 'Users', userData.uid);

  try {
    const existingSnap = await getDoc(userDocRef);

    if (existingSnap.exists()) {
      // User already has a document; update lastLoginAt and preserve real stats
      const existingData = existingSnap.data() as Partial<FirestoreUserRecord>;
      const existingBookmarks = existingData.bookmarks || {
        videos: [],
        games: [],
        articles: [],
        reviews: [],
        guides: [],
        topics: []
      };
      const totalSaves = 
        (existingBookmarks.videos?.length || 0) +
        (existingBookmarks.games?.length || 0) +
        (existingBookmarks.articles?.length || 0) +
        (existingBookmarks.reviews?.length || 0) +
        (existingBookmarks.guides?.length || 0) +
        (existingBookmarks.topics?.length || 0);

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
        reputation: existingData.reputation ?? 0,
        emailVerified: userData.emailVerified ?? existingData.emailVerified ?? false,
        createdAt: existingData.createdAt || nowIso,
        updatedAt: nowIso,
        lastLoginAt: nowIso,
        bookmarks: existingBookmarks,
        stats: {
          likesCount: existingData.stats?.likesCount ?? 0,
          commentsCount: existingData.stats?.commentsCount ?? 0,
          savesCount: existingData.stats?.savesCount ?? totalSaves,
          topicsCount: existingData.stats?.topicsCount ?? 0
        }
      };

      await setDoc(userDocRef, mergedRecord, { merge: true });

      // Also mirror to lowercase collection for compatibility
      try {
        await setDoc(doc(db, 'users', userData.uid), mergedRecord, { merge: true });
      } catch (_) {}

      return mergedRecord;
    } else {
      // Brand new registration: create the document in 'Users' with zero counts!
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
        reputation: 0,
        emailVerified: userData.emailVerified || false,
        createdAt: nowIso,
        updatedAt: nowIso,
        lastLoginAt: nowIso,
        bookmarks: {
          videos: [],
          games: [],
          articles: [],
          reviews: [],
          guides: [],
          topics: []
        },
        stats: {
          likesCount: 0,
          commentsCount: 0,
          savesCount: 0,
          topicsCount: 0
        }
      };

      await setDoc(userDocRef, newRecord);

      // Also mirror to lowercase collection for compatibility
      try {
        await setDoc(doc(db, 'users', userData.uid), newRecord);
      } catch (_) {}

      console.log(`Successfully registered user ${userData.uid} (${cleanEmail}) to Firestore collection 'Users' with 0 initial statistics.`);
      return newRecord;
    }
  } catch (error) {
    console.warn('Firestore addRegisteredUserToFirestore warning:', error);
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
      reputation: 0,
      emailVerified: userData.emailVerified || false,
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: nowIso,
      bookmarks: {
        videos: [],
        games: [],
        articles: [],
        reviews: [],
        guides: [],
        topics: []
      },
      stats: {
        likesCount: 0,
        commentsCount: 0,
        savesCount: 0,
        topicsCount: 0
      }
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
 * Save newsletter subscriber into Firestore subscribers collection
 */
export async function saveNewsletterSubscriber(email: string, source: string = 'footer'): Promise<NewsletterSubscriber> {
  const clean = (email || '').trim().toLowerCase().slice(0, 120);
  if (!clean || !clean.includes('@') || clean.length < 3) {
    throw new Error('Please enter a valid email address.');
  }

  // Safe valid Firestore document ID
  const subId = clean.replace(/[^a-z0-9]/g, '_').slice(0, 120);
  const nowIso = new Date().toISOString();

  const subscriberRecord: NewsletterSubscriber = {
    id: subId,
    email: clean,
    subscribedAt: nowIso,
    status: 'active',
    source: (source || 'footer').slice(0, 50)
  };

  try {
    await setDoc(doc(db, 'subscribers', subId), {
      id: subscriberRecord.id,
      email: subscriberRecord.email,
      subscribedAt: subscriberRecord.subscribedAt,
      status: subscriberRecord.status,
      source: subscriberRecord.source
    }, { merge: true });
    
    return subscriberRecord;
  } catch (error) {
    console.error('Failed to save subscriber to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, `subscribers/${subId}`);
    return subscriberRecord;
  }
}

/**
 * Save user inquiry into Firestore contact_submissions collection
 */
export async function saveContactSubmission(input: {
  name: string;
  email: string;
  category: string;
  subject?: string;
  message: string;
  userId?: string | null;
}): Promise<ContactSubmission> {
  const cleanName = (input.name || '').trim().slice(0, 100);
  const cleanEmail = (input.email || '').trim().toLowerCase().slice(0, 120);
  const cleanCategory = (input.category || 'editorial').trim().slice(0, 50);
  const cleanSubject = (input.subject || '').trim().slice(0, 200);
  const cleanMessage = (input.message || '').trim().slice(0, 3000);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 150) : 'Web Client';

  if (!cleanName || cleanName.length < 1) {
    throw new Error('Please provide your name.');
  }
  if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 3) {
    throw new Error('Please provide a valid email address.');
  }
  if (!cleanMessage || cleanMessage.length < 5) {
    throw new Error('Message details must be at least 5 characters.');
  }

  // Generate safe valid Firestore document ID
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const submissionId = `contact_${timestamp}_${randomSuffix}`;
  const nowIso = new Date().toISOString();

  const submissionDoc: ContactSubmission = {
    id: submissionId,
    name: cleanName,
    email: cleanEmail,
    category: cleanCategory,
    subject: cleanSubject || undefined,
    message: cleanMessage,
    createdAt: nowIso,
    status: 'new',
    userId: input.userId || auth.currentUser?.uid || null,
    userAgent
  };

  // Clean data structure matching Firestore rules
  const firestoreData: Record<string, any> = {
    id: submissionDoc.id,
    name: submissionDoc.name,
    email: submissionDoc.email,
    category: submissionDoc.category,
    message: submissionDoc.message,
    createdAt: submissionDoc.createdAt,
    status: submissionDoc.status
  };

  if (submissionDoc.subject) {
    firestoreData.subject = submissionDoc.subject;
  }
  if (submissionDoc.userId) {
    firestoreData.userId = submissionDoc.userId;
  }
  if (submissionDoc.userAgent) {
    firestoreData.userAgent = submissionDoc.userAgent;
  }

  try {
    await setDoc(doc(db, 'contact_submissions', submissionId), firestoreData);
    return submissionDoc;
  } catch (error) {
    console.error('Failed to save contact submission to Firestore:', error);
    handleFirestoreError(error, OperationType.CREATE, `contact_submissions/${submissionId}`);
    return submissionDoc;
  }
}

/**
 * Fetch contact submissions for authorized administrative accounts
 */
export async function getContactSubmissionsFromFirestore(): Promise<ContactSubmission[]> {
  try {
    const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ContactSubmission);
  } catch (error) {
    console.warn('Could not load contact submissions:', error);
    return [];
  }
}

/**
 * Fetch newsletter subscriber list for authorized administrative accounts
 */
export async function getSubscribersFromFirestore(): Promise<NewsletterSubscriber[]> {
  try {
    const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as NewsletterSubscriber);
  } catch (error) {
    console.warn('Could not load newsletter subscribers:', error);
    return [];
  }
}

/**
 * Update contact submission review status (admin only)
 */
export async function updateContactSubmissionStatus(
  submissionId: string, 
  status: ContactSubmissionStatus
): Promise<void> {
  try {
    const docRef = doc(db, 'contact_submissions', submissionId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Failed to update contact submission status:', error);
    handleFirestoreError(error, OperationType.UPDATE, `contact_submissions/${submissionId}`);
  }
}

/**
 * Initialize baseline official verified documents in Firestore
 */
export async function ensureInitialFirestoreDocuments(): Promise<void> {
  try {
    // Only verify baseline records if current user is authorized or on boot
    const officialSubId = 'contact_gamevault_forum';
    const subRef = doc(db, 'subscribers', officialSubId);
    await setDoc(subRef, {
      id: officialSubId,
      email: 'contact@gamevault.forum',
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source: 'system_official'
    }, { merge: true });

    const officialContactId = 'submission_official_registry';
    const contactRef = doc(db, 'contact_submissions', officialContactId);
    await setDoc(contactRef, {
      id: officialContactId,
      name: 'Game Vault Editorial Desk',
      email: 'contact@gamevault.forum',
      category: 'editorial',
      subject: 'Official Communications Registry Initialized',
      message: 'Official communications registry initialized for Game Vault Forum editorial, reviews, corrections, and reader inquiries.',
      createdAt: new Date().toISOString(),
      status: 'read',
      userId: 'system',
      userAgent: 'Game Vault Core Protocol'
    }, { merge: true });
  } catch (err) {
    // Suppress if non-admin or offline
    console.debug('Initial Firestore documents verification note:', err);
  }
}

