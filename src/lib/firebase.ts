import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, updateProfile, signInAnonymously } from "firebase/auth";
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
import { ForumTopic, PostComment, UserAccount, ContactSubmission, NewsletterSubscriber, ContactSubmissionStatus, PublicUserProfileData } from "../types";
import { SavedAvatar } from "../types/avatar";
import { INITIAL_ARTICLE_COMMENTS } from "../data/initialCommunityData";

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

/**
 * Detects search engine crawlers, automated URL inspection bots, and synthetic testing agents
 * to prevent them from unnecessarily initiating persistent real-time streaming listeners.
 */
export function isSearchCrawler(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  return (
    ua.includes('googlebot') ||
    ua.includes('google-inspectiontool') ||
    ua.includes('mediapartners-google') ||
    ua.includes('adsbot-google') ||
    ua.includes('bingbot') ||
    ua.includes('baiduspider') ||
    ua.includes('yandex') ||
    ua.includes('duckduckbot') ||
    ua.includes('slurp') ||
    ua.includes('headlesschrome') ||
    ua.includes('lighthouse') ||
    ua.includes('chrome-lighthouse')
  );
}

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
  name?: string;
  username: string;
  photoURL: string | null;
  avatar?: string;
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
  releaseWatchlist?: string[];
  releaseReminders?: Record<string, string>;
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
        releaseWatchlist: existingData.releaseWatchlist || [],
        releaseReminders: existingData.releaseReminders || {},
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
        releaseWatchlist: [],
        releaseReminders: {},
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
 * Updates an operative profile in Firestore collection 'Users' and synchronizes with Firebase Auth
 */
export async function updateUserInFirestore(uid: string, updates: Partial<FirestoreUserRecord>): Promise<void> {
  const updatePayload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // Synchronize Firebase Auth currentUser profile if available
  if (auth.currentUser && auth.currentUser.uid === uid) {
    try {
      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (updates.displayName) authUpdates.displayName = updates.displayName;
      if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(auth.currentUser, authUpdates);
      }
    } catch (authErr) {
      console.warn('Firebase Auth updateProfile warning:', authErr);
    }
  }

  // Update Firestore collections 'Users' and 'users'
  await Promise.allSettled([
    setDoc(doc(db, 'Users', uid), updatePayload, { merge: true }),
    setDoc(doc(db, 'users', uid), updatePayload, { merge: true })
  ]);
}

/**
 * Ensure anonymous guest session for visitors when needed
 */
export async function ensureGuestAuth(): Promise<void> {
  if (auth.currentUser) return;
  try {
    await signInAnonymously(auth);
  } catch (err) {
    console.debug('Firebase anonymous auth notice:', err);
  }
}

/**
 * Save or update forum topic in Firestore
 */
export async function saveTopicToFirestore(topic: ForumTopic): Promise<void> {
  try {
    await ensureGuestAuth();
    await setDoc(doc(db, 'topics', topic.id), {
      ...topic,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveTopic warning:', err);
  }
}

/**
 * Save new article/video comment or reply to Firestore
 */
export async function saveCommentToFirestore(postId: string, comment: PostComment): Promise<void> {
  try {
    await ensureGuestAuth();
    await setDoc(doc(db, 'comments', comment.id), {
      id: comment.id,
      postId,
      author: comment.author,
      content: comment.content,
      timestamp: comment.timestamp || 'Just now',
      likes: typeof comment.likes === 'number' ? comment.likes : 0,
      replyToAuthor: comment.replyToAuthor || null,
      replyToId: comment.replyToId || null,
      parentId: comment.parentId || null,
      createdAt: comment.createdAt || new Date().toISOString(),
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
    await ensureGuestAuth();
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
 * Real-time listener for all comments on content across the site.
 * Ensures every visitor and user sees newly posted comments and replies live.
 */
export function subscribeToComments(
  onCommentsUpdated: (commentsMap: Record<string, PostComment[]>) => void
): () => void {
  if (isSearchCrawler()) {
    return () => {};
  }
  try {
    const commentsCol = collection(db, 'comments');
    return onSnapshot(
      commentsCol,
      (snapshot) => {
        // Pre-populate with baseline authentic comments
        const map: Record<string, PostComment[]> = {};
        Object.keys(INITIAL_ARTICLE_COMMENTS).forEach((pid) => {
          map[pid] = [...INITIAL_ARTICLE_COMMENTS[pid]];
        });

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const postId = data.postId;
          if (!postId) return;
          if (!map[postId]) {
            map[postId] = [];
          }
          const commentObj: PostComment = {
            id: docSnap.id,
            author: {
              id: data.author?.id || data.authorId || '',
              name: data.author?.name || 'Vault Operative',
              username: data.author?.username || (data.author?.name ? `@${data.author.name.toLowerCase().replace(/\s+/g, '_')}` : '@operative'),
              avatar: data.author?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
              badge: data.author?.badge || 'Recruit Operative',
              role: data.author?.role || data.author?.badge || 'Recruit Operative'
            },
            content: data.content || '',
            timestamp: data.timestamp || (data.savedAt ? new Date(data.savedAt).toLocaleDateString() : 'Recently'),
            likes: typeof data.likes === 'number' ? data.likes : 0,
            replyToAuthor: data.replyToAuthor || undefined,
            replyToId: data.replyToId || undefined,
            parentId: data.parentId || undefined,
            createdAt: data.createdAt || data.savedAt || new Date().toISOString()
          };

          const existingIdx = map[postId].findIndex((c) => c.id === docSnap.id);
          if (existingIdx >= 0) {
            map[postId][existingIdx] = commentObj;
          } else {
            map[postId].push(commentObj);
          }
        });
        onCommentsUpdated(map);
      },
      (error) => {
        console.warn('Firestore comments subscription note:', error);
      }
    );
  } catch (err) {
    console.warn('subscribeToComments error:', err);
    return () => {};
  }
}

/**
 * Real-time listener for forum topics and replies.
 * Ensures every visitor and user sees new discussions, answers, and interactions live.
 */
export function subscribeToTopics(
  onTopicsUpdated: (topics: ForumTopic[]) => void
): () => void {
  if (isSearchCrawler()) {
    return () => {};
  }
  try {
    const topicsCol = collection(db, 'topics');
    return onSnapshot(
      topicsCol,
      (snapshot) => {
        const topicsList: ForumTopic[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const rawReplies = Array.isArray(data.replies) ? data.replies : [];
          const cleanReplies = rawReplies.map((r: any) => ({
            id: r.id || `reply-${Math.random().toString(36).substring(2, 7)}`,
            author: {
              id: r.author?.id || '',
              name: r.author?.name || 'Vault Operative',
              username: r.author?.username || '@operative',
              avatar: r.author?.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
              badge: r.author?.badge || 'Recruit Operative',
              role: r.author?.role || r.author?.badge || 'Recruit Operative',
              isStaff: Boolean(r.author?.isStaff)
            },
            content: r.content || '',
            timestamp: r.timestamp || 'Recently',
            likes: typeof r.likes === 'number' ? r.likes : 0,
            replyToAuthor: r.replyToAuthor || undefined,
            createdAt: r.createdAt || undefined
          }));

          topicsList.push({
            id: docSnap.id,
            title: data.title || 'Untitled Discussion',
            author: data.author || {
              id: '',
              name: 'Vault Operative',
              username: '@operative',
              avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
              badge: 'Recruit Operative',
              role: 'Recruit Operative'
            },
            category: data.category || 'General Gaming',
            repliesCount: typeof data.repliesCount === 'number' ? data.repliesCount : cleanReplies.length,
            views: typeof data.views === 'number' ? data.views : 1,
            lastActivity: data.lastActivity || 'Recently',
            timestamp: data.timestamp || 'Recently',
            isPinned: Boolean(data.isPinned),
            isLocked: Boolean(data.isLocked),
            tags: Array.isArray(data.tags) ? data.tags : ['Discussion'],
            initialPost: data.initialPost || '',
            likes: typeof data.likes === 'number' ? data.likes : 0,
            replies: cleanReplies
          });
        });
        if (topicsList.length > 0) {
          onTopicsUpdated(topicsList);
        }
      },
      (error) => {
        console.warn('Firestore topics subscription note:', error);
      }
    );
  } catch (err) {
    console.warn('subscribeToTopics error:', err);
    return () => {};
  }
}

/**
 * Save user generated avatar to Firestore
 */
export async function saveUserAvatarToFirestore(userId: string, avatar: SavedAvatar): Promise<void> {
  try {
    const avatarDocId = avatar.id || `avatar_${Date.now()}`;
    await setDoc(doc(db, 'avatars', avatarDocId), {
      ...avatar,
      userId,
      savedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserAvatar warning:', err);
  }
}

/**
 * Fetch saved avatars for a registered user from Firestore
 */
export async function getUserSavedAvatarsFromFirestore(userId: string): Promise<SavedAvatar[]> {
  try {
    const avatarsQuery = query(collection(db, 'avatars'));
    const snapshot = await getDocs(avatarsQuery);
    const userAvatars: SavedAvatar[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.userId === userId) {
        userAvatars.push({
          id: docSnap.id,
          name: data.name || 'Gamer Avatar',
          config: data.config,
          previewDataUrl: data.previewDataUrl || '',
          createdAt: data.createdAt || data.savedAt || new Date().toISOString(),
          userId: data.userId,
          authorName: data.authorName
        });
      }
    });
    return userAvatars;
  } catch (err) {
    console.warn('Firestore getUserSavedAvatars warning:', err);
    return [];
  }
}

/**
 * Real-time listener for like counts across all content.
 * Ensures every visitor and user sees current like counts made by others.
 */
export function subscribeToLikes(
  onLikesUpdated: (likesMap: Record<string, number>) => void
): () => void {
  if (isSearchCrawler()) {
    return () => {};
  }
  try {
    const likesCol = collection(db, 'likes');
    return onSnapshot(
      likesCol,
      (snapshot) => {
        const map: Record<string, number> = {};
        snapshot.forEach((docSnap) => {
          // Aggregate count documents do NOT contain an underscore (individual user likes have itemId_userId format)
          if (!docSnap.id.includes('_')) {
            const data = docSnap.data();
            if (typeof data.count === 'number') {
              map[docSnap.id] = data.count;
            }
          }
        });
        onLikesUpdated(map);
      },
      (error) => {
        console.warn('Firestore likes subscription note:', error);
      }
    );
  } catch (err) {
    console.warn('subscribeToLikes error:', err);
    return () => {};
  }
}

/**
 * Fetch a user profile from Firestore by UID or username.
 * Strictly sanitizes output so EMAIL IS NEVER EXPOSED to visitors or other users.
 */
export async function getPublicUserProfile(identifier?: string, fallbackName?: string): Promise<PublicUserProfileData | null> {
  const targetId = identifier || '';
  if (!targetId && !fallbackName) return null;

  try {
    // 1. Direct document lookup by UID in Users collection
    if (targetId) {
      const docSnap = await getDoc(doc(db, 'Users', targetId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const cleanName = data.displayName || data.name || fallbackName || 'Vault Operative';
        const cleanUsername = data.username 
          ? (data.username.startsWith('@') ? data.username : `@${data.username}`)
          : `@${cleanName.toLowerCase().replace(/\s+/g, '_')}`;

        return {
          id: docSnap.id,
          name: cleanName,
          username: cleanUsername,
          avatar: data.photoURL || data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          bio: data.bio || 'Active vault operative participating in tactical briefings, hardware evaluations, and strategic gaming discussions.',
          badge: data.badge || 'Recruit Operative',
          role: data.role || data.badge || 'Recruit Operative',
          reputation: typeof data.reputation === 'number' ? data.reputation : 120,
          joinDate: data.joinDate || (data.createdAt ? new Date(data.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Jan 2025'),
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Vault Operative',
          stats: {
            likesCount: data.stats?.likesCount ?? (data.likesCount || 0),
            commentsCount: data.stats?.commentsCount ?? (data.commentsCount || 0),
            savesCount: data.stats?.savesCount ?? (data.savesCount || 0),
            topicsCount: data.stats?.topicsCount ?? (data.topicsCount || 0)
          }
          // Note: NEVER include email field here to protect privacy!
        };
      }
    }
  } catch (err) {
    console.warn('Error fetching public user profile:', err);
  }
  return null;
}

/**
 * Save newsletter subscriber into Firestore Subscriber and subscribers collections
 */
export async function saveNewsletterSubscriber(email: string, source: string = 'website'): Promise<NewsletterSubscriber> {
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
    source: (source || 'website').slice(0, 50)
  };

  const payload = {
    id: subscriberRecord.id,
    email: subscriberRecord.email,
    subscribedAt: subscriberRecord.subscribedAt,
    status: subscriberRecord.status,
    source: subscriberRecord.source,
    createdAt: subscriberRecord.subscribedAt
  };

  try {
    // Primary collection in Firestore is 'subscribers'
    try {
      await setDoc(doc(db, 'subscribers', subId), payload, { merge: true });
    } catch (primaryErr: any) {
      console.warn('Primary subscribers collection write note:', primaryErr);
    }

    // Best-effort write to alias collections (Subscribers, Subscriber) without rejecting
    await Promise.allSettled([
      setDoc(doc(db, 'Subscribers', subId), payload, { merge: true }),
      setDoc(doc(db, 'Subscriber', subId), payload, { merge: true })
    ]);

    // Persist locally in browser for offline and session tracking
    try {
      const existingRaw = localStorage.getItem('gv_all_subscribers') || '[]';
      const list = JSON.parse(existingRaw);
      if (!list.some((s: any) => s.email === clean)) {
        list.push(subscriberRecord);
        localStorage.setItem('gv_all_subscribers', JSON.stringify(list));
      }
    } catch {
      // ignore local storage errors
    }

    return subscriberRecord;
  } catch (error) {
    console.warn('Subscription fallback used:', error);
    try {
      const existingRaw = localStorage.getItem('gv_all_subscribers') || '[]';
      const list = JSON.parse(existingRaw);
      if (!list.some((s: any) => s.email === clean)) {
        list.push(subscriberRecord);
        localStorage.setItem('gv_all_subscribers', JSON.stringify(list));
      }
    } catch {}
    return subscriberRecord;
  }
}

/**
 * Save user inquiry into Firestore Contact Us collections (Contact Us, ContactUs, contact_us, contact_submissions)
 * All fields entered in the contact form are stored in the document.
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

  // Clean data structure matching Firestore rules and storing all entered fields
  const firestoreData: Record<string, any> = {
    id: submissionDoc.id,
    name: submissionDoc.name,
    email: submissionDoc.email,
    category: submissionDoc.category,
    message: submissionDoc.message,
    createdAt: submissionDoc.createdAt,
    status: submissionDoc.status,
    source: 'contact_page'
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
    // Primary write directly to Firestore 'Contact Us' collection as requested by user
    const contactUsPromise = setDoc(doc(db, 'Contact Us', submissionId), firestoreData, { merge: true });

    // Also mirror to 'ContactUs' and 'contact_submissions' to guarantee maximum compatibility
    const mirrorPromises = [
      setDoc(doc(db, 'ContactUs', submissionId), firestoreData, { merge: true }).catch(() => {}),
      setDoc(doc(db, 'contact_submissions', submissionId), firestoreData, { merge: true }).catch(() => {})
    ];

    // Also send to /api/contact as server-side persistence backup
    if (typeof window !== 'undefined') {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreData)
      }).catch(() => {});
    }

    // Always record in localStorage for instant offline access and admin triage
    try {
      const existingRaw = localStorage.getItem('gv_all_inquiries') || '[]';
      const list = JSON.parse(existingRaw);
      list.unshift(submissionDoc);
      localStorage.setItem('gv_all_inquiries', JSON.stringify(list.slice(0, 100)));
      localStorage.setItem('gv_contact_submissions', JSON.stringify(list.slice(0, 100)));
    } catch {
      // Non-critical local storage fallback
    }

    // Wait up to 3 seconds for Firestore to acknowledge receipt over network
    await Promise.race([
      contactUsPromise,
      new Promise((resolve) => setTimeout(resolve, 3000))
    ]);

    return submissionDoc;
  } catch (error) {
    console.warn('Firestore write note, persisting locally and in server backup:', error);
    // Guarantee submission persistence in local storage so user data is never lost
    try {
      const existingRaw = localStorage.getItem('gv_all_inquiries') || '[]';
      const list = JSON.parse(existingRaw);
      list.unshift(submissionDoc);
      localStorage.setItem('gv_all_inquiries', JSON.stringify(list.slice(0, 100)));
      localStorage.setItem('gv_contact_submissions', JSON.stringify(list.slice(0, 100)));
    } catch {}
    return submissionDoc;
  }
}

/**
 * Fetch contact submissions for authorized administrative accounts
 */
export async function getContactSubmissionsFromFirestore(): Promise<ContactSubmission[]> {
  const submissionsMap = new Map<string, ContactSubmission>();

  // 1. Try fetching from Contact Us collections
  for (const col of ['Contact Us', 'contact_us', 'contact_submissions', 'ContactUs']) {
    try {
      const q = query(collection(db, col), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      snapshot.forEach(d => {
        const data = d.data() as ContactSubmission;
        if (data && data.name && data.email) {
          submissionsMap.set(data.id || d.id, { ...data, id: data.id || d.id });
        }
      });
    } catch {
      // Ignore individual collection errors
    }
  }

  // 2. Fetch contact submissions registered in subscribers collection
  try {
    const qSub = query(collection(db, 'subscribers'), orderBy('createdAt', 'desc'), limit(50));
    const snapSub = await getDocs(qSub);
    snapSub.forEach(d => {
      const data = d.data() as any;
      if (data && (data.type === 'contact_submission' || data.collection === 'Contact Us') && data.name && data.email) {
        submissionsMap.set(data.id || d.id, {
          id: data.id || d.id,
          name: data.name,
          email: data.email,
          category: data.category || 'editorial',
          subject: data.subject,
          message: data.message || '',
          createdAt: data.createdAt || new Date().toISOString(),
          status: data.status || 'new',
          userId: data.userId || null,
          userAgent: data.userAgent
        });
      }
    });
  } catch {
    // Non-blocking
  }

  // 3. Fallback to localStorage
  try {
    const raw = localStorage.getItem('gv_all_inquiries') || localStorage.getItem('gv_contact_submissions');
    if (raw) {
      const localList: ContactSubmission[] = JSON.parse(raw);
      localList.forEach(item => {
        if (item && item.id && !submissionsMap.has(item.id)) {
          submissionsMap.set(item.id, item);
        }
      });
    }
  } catch {}

  const result = Array.from(submissionsMap.values());
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}

/**
 * Fetch newsletter subscriber list for authorized administrative accounts
 */
export async function getSubscribersFromFirestore(): Promise<NewsletterSubscriber[]> {
  for (const col of ['subscribers', 'Subscribers', 'Subscriber']) {
    try {
      const q = query(collection(db, col), orderBy('subscribedAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(doc => doc.data() as NewsletterSubscriber);
      }
    } catch {
      // try next collection
    }
  }

  // Local storage fallback for offline/preview
  try {
    const raw = localStorage.getItem('gv_all_subscribers');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

/**
 * Update contact submission review status (admin only)
 */
export async function updateContactSubmissionStatus(
  submissionId: string, 
  status: ContactSubmissionStatus
): Promise<void> {
  try {
    await Promise.allSettled([
      updateDoc(doc(db, 'subscribers', submissionId), { status }),
      updateDoc(doc(db, 'Contact Us', submissionId), { status }),
      updateDoc(doc(db, 'ContactUs', submissionId), { status }),
      updateDoc(doc(db, 'contact_us', submissionId), { status }),
      updateDoc(doc(db, 'contact_submissions', submissionId), { status })
    ]);
    try {
      const raw = localStorage.getItem('gv_all_inquiries');
      if (raw) {
        const list: ContactSubmission[] = JSON.parse(raw);
        const updated = list.map(item => item.id === submissionId ? { ...item, status } : item);
        localStorage.setItem('gv_all_inquiries', JSON.stringify(updated));
        localStorage.setItem('gv_contact_submissions', JSON.stringify(updated));
      }
    } catch {}
  } catch (error) {
    console.error('Failed to update contact submission status:', error);
  }
}

/**
 * Initialize baseline official verified documents in Firestore
 */
export async function ensureInitialFirestoreDocuments(): Promise<void> {
  try {
    // Only verify baseline records if current user is authorized or on boot
    const officialSubId = 'contact_gamevault_forum';
    const subPayload = {
      id: officialSubId,
      email: 'contact@gamevault.forum',
      subscribedAt: new Date().toISOString(),
      status: 'active' as const,
      source: 'system_official',
      createdAt: new Date().toISOString()
    };
    await Promise.allSettled([
      setDoc(doc(db, 'Subscribers', officialSubId), subPayload, { merge: true }),
      setDoc(doc(db, 'Subscriber', officialSubId), subPayload, { merge: true }),
      setDoc(doc(db, 'subscribers', officialSubId), subPayload, { merge: true })
    ]);

    const officialContactId = 'submission_official_registry';
    const contactPayload = {
      id: officialContactId,
      name: 'Game Vault Editorial Desk',
      email: 'contact@gamevault.forum',
      category: 'editorial',
      subject: 'Official Communications Registry Initialized',
      message: 'Official communications registry initialized for Game Vault Forum editorial, reviews, corrections, and reader inquiries.',
      createdAt: new Date().toISOString(),
      status: 'read' as const,
      userId: 'system',
      userAgent: 'Game Vault Core Protocol',
      source: 'contact_page'
    };
    await Promise.allSettled([
      setDoc(doc(db, 'Contact Us', officialContactId), contactPayload, { merge: true }),
      setDoc(doc(db, 'ContactUs', officialContactId), contactPayload, { merge: true }),
      setDoc(doc(db, 'contact_us', officialContactId), contactPayload, { merge: true }),
      setDoc(doc(db, 'contact_submissions', officialContactId), contactPayload, { merge: true })
    ]);
  } catch (err) {
    // Suppress if non-admin or offline
    console.debug('Initial Firestore documents verification note:', err);
  }
}

