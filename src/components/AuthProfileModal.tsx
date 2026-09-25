import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Bookmark, 
  Award, 
  Shield, 
  Film, 
  Gamepad2, 
  BookOpen, 
  Star, 
  Compass, 
  ExternalLink, 
  LogOut, 
  Mail,
  Heart,
  MessageSquare,
  PenSquare,
  Inbox,
  Users,
  RefreshCw,
  CheckCircle,
  Clock,
  Send,
  Edit3,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Bell,
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle2,
  BookmarkCheck,
  Play,
  BellRing
} from 'lucide-react';
import { UserAccount, Video, Game, Article, Review, Guide, ContactSubmission, NewsletterSubscriber, ContactSubmissionStatus } from '../types';
import { GameRelease } from '../types/releaseCalendar';
import { GAME_RELEASES_DATABASE } from '../data/gameReleasesData';
import { 
  triggerTestDeviceNotification, 
  getReminderTimingLabel, 
  getNotificationPermission 
} from '../utils/notificationService';
import { SavedAvatar } from '../types/avatar';
import { 
  getContactSubmissionsFromFirestore, 
  getSubscribersFromFirestore, 
  updateContactSubmissionStatus,
  getUserSavedAvatarsFromFirestore
} from '../lib/firebase';

const AVATAR_PRESETS = [
  { id: 'av1', label: 'Tactical Ops', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Cyber Assassin', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Stealth Scout', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Vanguard Ranger', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Tech Specialist', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Shadowblade', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' },
  { id: 'av7', label: 'Mech Pilot', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 'av8', label: 'Cyber Pulse', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' }
];

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  videos: Video[];
  games: Game[];
  articles: Article[];
  reviews: Review[];
  guides: Guide[];
  onSelectVideo: (v: Video) => void;
  onSelectGame: (g: Game) => void;
  onSelectArticle: (a: Article) => void;
  onSelectReview: (r: Review) => void;
  onSelectGuide: (g: Guide) => void;
  onSignOut?: () => void;
  onUpdateProfile?: (updated: { name: string; username: string; avatar: string; bio?: string }) => Promise<void>;
  initialTab?: 'profile' | 'guidelines' | 'admin';
  onNavigateToAvatarGenerator?: () => void;
  onNavigateToCalendar?: (gameSlug?: string) => void;
  onRemoveFromWatchlist?: (releaseId: string) => void;
  onRemoveReminder?: (releaseId: string) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'alert') => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  videos,
  games,
  articles,
  reviews,
  guides,
  onSelectVideo,
  onSelectGame,
  onSelectArticle,
  onSelectReview,
  onSelectGuide,
  onSignOut,
  onUpdateProfile,
  initialTab = 'profile',
  onNavigateToAvatarGenerator,
  onNavigateToCalendar,
  onRemoveFromWatchlist,
  onRemoveReminder,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'guidelines' | 'admin'>(initialTab);
  const isAdmin = user.email === 'contact@gamevault.forum' || user.email === 'joelotis40@gmail.com' || user.role === 'admin';

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedAvatars, setSavedAvatars] = useState<SavedAvatar[]>([]);

  // Load user saved avatars from local storage and Firestore when modal opens
  useEffect(() => {
    if (isOpen) {
      let localList: SavedAvatar[] = [];
      try {
        const stored = localStorage.getItem('gamevault_saved_avatars');
        if (stored) localList = JSON.parse(stored);
      } catch (err) {
        console.warn('Local saved avatars error:', err);
      }
      setSavedAvatars(localList);

      if (user.id) {
        getUserSavedAvatarsFromFirestore(user.id).then((cloudAvatars) => {
          if (cloudAvatars && cloudAvatars.length > 0) {
            setSavedAvatars((prev) => {
              const map = new Map<string, SavedAvatar>();
              [...cloudAvatars, ...prev].forEach(a => map.set(a.id, a));
              return Array.from(map.values());
            });
          }
        }).catch((err) => {
          console.warn('Cloud saved avatars note:', err);
        });
      }
    }
  }, [isOpen, user.id]);

  // Sync edits when user prop changes
  useEffect(() => {
    setEditName(user.name);
    setEditUsername(user.username);
    setEditAvatar(user.avatar);
    setEditBio(user.bio || '');
  }, [user]);

  // Admin Firestore state
  const [adminView, setAdminView] = useState<'inquiries' | 'subscribers'>('inquiries');
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  useEffect(() => {
    if (isAdmin && activeTab === 'admin' && isOpen) {
      loadAdminFirestoreData();
    }
  }, [isAdmin, activeTab, isOpen]);

  const loadAdminFirestoreData = async () => {
    setLoadingAdminData(true);
    try {
      const [submissions, subs] = await Promise.all([
        getContactSubmissionsFromFirestore(),
        getSubscribersFromFirestore()
      ]);
      setContactSubmissions(submissions);
      setSubscribers(subs);
    } catch (err) {
      console.warn('Admin data load note:', err);
    } finally {
      setLoadingAdminData(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ContactSubmissionStatus) => {
    try {
      await updateContactSubmissionStatus(id, newStatus);
      setContactSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub)
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Profile Image Upload / Resize
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize onto offscreen canvas to keep doc size compact & fast
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEditAvatar(compressedDataUrl);
          setSaveError(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = editName.trim();
    let cleanUsername = editUsername.trim();
    if (!cleanUsername) cleanUsername = user.username;
    if (!cleanUsername.startsWith('@')) cleanUsername = `@${cleanUsername}`;
    const cleanAvatar = editAvatar.trim() || user.avatar;
    const cleanBio = editBio.trim();

    if (cleanName.length < 2) {
      setSaveError('Display name must be at least 2 characters.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (onUpdateProfile) {
        await onUpdateProfile({
          name: cleanName,
          username: cleanUsername,
          avatar: cleanAvatar,
          bio: cleanBio
        });
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1200);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setSaveError(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const bookmarkedVideos = videos.filter((v) => user.bookmarks.videos.includes(v.id));
  const bookmarkedGames = games.filter((g) => user.bookmarks.games.includes(g.id));
  const bookmarkedArticles = articles.filter((a) => user.bookmarks.articles.includes(a.id));
  const bookmarkedReviews = reviews.filter((r) => user.bookmarks.reviews.includes(r.id));
  const bookmarkedGuides = guides.filter((gd) => user.bookmarks.guides.includes(gd.id));

  const totalSaved =
    bookmarkedVideos.length +
    bookmarkedGames.length +
    bookmarkedArticles.length +
    bookmarkedReviews.length +
    bookmarkedGuides.length;

  const userLikes = user.stats?.likesCount ?? user.likedIds?.length ?? 0;
  const userComments = user.stats?.commentsCount ?? 0;
  const userSaves = user.stats?.savesCount ?? totalSaved;
  const userTopics = user.stats?.topicsCount ?? 0;
  const userRep = user.reputation ?? 0;

  // Release Watchlist & Reminders
  const watchlistedIds = user.releaseWatchlist || [];
  const watchlistedGames = GAME_RELEASES_DATABASE.filter((r) => watchlistedIds.includes(r.id));

  const reminderMap = user.releaseReminders || {};
  const remindedEntries = Object.entries(reminderMap).map(([id, timing]) => {
    const game = GAME_RELEASES_DATABASE.find((r) => r.id === id);
    return {
      id,
      timing: timing as 'day_of' | 'day_before' | 'week_before',
      game
    };
  }).filter((e): e is { id: string; timing: 'day_of' | 'day_before' | 'week_before'; game: GameRelease } => e.game != null);

  const totalReleasesTracked = watchlistedGames.length + remindedEntries.length;

  const [testingNotificationId, setTestingNotificationId] = useState<string | null>(null);

  const handleTestNotification = (release: GameRelease, timing: 'day_of' | 'day_before' | 'week_before') => {
    setTestingNotificationId(release.id);
    const success = triggerTestDeviceNotification(release, timing);
    if (success) {
      if (onShowToast) {
        onShowToast(`Dispatched test device notification for ${release.title}!`, 'success');
      }
    } else {
      if (onShowToast) {
        onShowToast('Device notifications are not granted or blocked in browser settings.', 'alert');
      }
    }
    setTimeout(() => setTestingNotificationId(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2438] bg-[#121524]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vault Identity & Activity
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors ${
                activeTab === 'guidelines'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Community Guidelines
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Admin Desk</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#1a1d2e] hover:bg-[#23273e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'profile' ? (
            <>
              {/* User Identity Card / Profile Editor */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="p-5 rounded-2xl bg-[#131625] border border-purple-500/30 space-y-5 shadow-lg shadow-purple-950/20">
                  <div className="flex items-center justify-between border-b border-[#232942] pb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-['Space_Grotesk'] font-bold text-white uppercase tracking-wider">
                        Edit Operative Profile
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                      Syncs with Firestore Database
                    </span>
                  </div>

                  {/* Profile Picture Section */}
                  <div className="space-y-3">
                    <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      Profile Picture / Operative Avatar
                    </label>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Avatar Preview */}
                      <div className="relative group shrink-0">
                        <img
                          src={editAvatar || user.avatar}
                          alt={editName || 'Preview'}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500 shadow-lg shadow-purple-950/60 bg-black/40"
                          onError={(e) => {
                            // Fallback if broken URL entered
                            (e.target as HTMLImageElement).src = user.avatar;
                          }}
                        />
                        <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Avatar Selection Controls */}
                      <div className="flex-1 w-full space-y-3">
                        {/* Quick Presets */}
                        <div>
                          <p className="text-[11px] text-slate-400 mb-1.5">Select from Tactical Presets:</p>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {AVATAR_PRESETS.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setEditAvatar(preset.url);
                                  setSaveError(null);
                                }}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer hover:scale-105 ${
                                  editAvatar === preset.url
                                    ? 'border-purple-400 ring-2 ring-purple-500/40'
                                    : 'border-white/10 hover:border-white/30'
                                }`}
                                title={preset.label}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  className="w-full h-10 object-cover rounded-lg"
                                />
                                {editAvatar === preset.url && (
                                  <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Saved Avatars from Game Avatar Generator */}
                        <div className="pt-2 border-t border-[#232942]">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>From Your Game Avatar Generator ({savedAvatars.length}):</span>
                            </p>
                            {onNavigateToAvatarGenerator && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onNavigateToAvatarGenerator();
                                }}
                                className="text-[10px] text-cyan-300 hover:text-white underline cursor-pointer flex items-center gap-1 transition-colors"
                              >
                                Create / Edit in Generator &rarr;
                              </button>
                            )}
                          </div>

                          {savedAvatars.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1.5 bg-[#090b14] rounded-xl border border-cyan-500/20">
                              {savedAvatars.map((saved) => {
                                const isSelected = editAvatar === saved.previewDataUrl;
                                return (
                                  <button
                                    key={saved.id}
                                    type="button"
                                    onClick={() => {
                                      setEditAvatar(saved.previewDataUrl);
                                      setSaveError(null);
                                    }}
                                    className={`group relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer hover:scale-105 flex flex-col items-center bg-[#131625] ${
                                      isSelected
                                        ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-md shadow-cyan-500/20'
                                        : 'border-white/10 hover:border-cyan-400/40'
                                    }`}
                                    title={`Use "${saved.name}" as profile photo`}
                                  >
                                    <img
                                      src={saved.previewDataUrl}
                                      alt={saved.name}
                                      className="w-full h-12 object-cover rounded-lg bg-slate-900"
                                    />
                                    <span className="text-[9px] text-slate-300 group-hover:text-cyan-300 truncate w-full px-1 text-center font-mono mt-0.5">
                                      {saved.name}
                                    </span>
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-cyan-600/40 flex items-center justify-center rounded-lg">
                                        <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-slate-400">
                                No generated avatars saved yet. Customize a character in the Game Avatar Generator!
                              </span>
                              {onNavigateToAvatarGenerator && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onNavigateToAvatarGenerator();
                                  }}
                                  className="text-[10px] px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold uppercase transition-colors shrink-0 cursor-pointer"
                                >
                                  Open Generator
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Custom URL & Upload */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                          <input
                            type="url"
                            value={editAvatar}
                            onChange={(e) => setEditAvatar(e.target.value)}
                            placeholder="Paste custom image URL (https://...)"
                            className="w-full text-xs px-3 py-2 bg-[#090b14] border border-[#232942] focus:border-purple-500 rounded-lg text-slate-200 outline-none transition-colors"
                          />
                          <label className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-lg text-xs text-slate-200 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5 text-purple-400" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name & Username Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                        Display Name <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Your full or display name"
                        maxLength={40}
                        required
                        className="w-full text-xs px-3 py-2.5 bg-[#090b14] border border-[#232942] focus:border-purple-500 rounded-lg text-white outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                        Operative Handle / Username
                      </label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        placeholder="@username"
                        maxLength={30}
                        required
                        className="w-full text-xs px-3 py-2.5 bg-[#090b14] border border-[#232942] focus:border-purple-500 rounded-lg text-white font-mono outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Bio Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                        Operative Bio & Tactical Tagline
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        {editBio.length}/160
                      </span>
                    </div>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value.slice(0, 160))}
                      placeholder="Share your favorite gaming platforms, tactical roles, or vault goals..."
                      rows={2}
                      className="w-full text-xs px-3 py-2 bg-[#090b14] border border-[#232942] focus:border-purple-500 rounded-lg text-slate-200 outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Error & Success Messages */}
                  {saveError && (
                    <div className="flex items-center gap-2 p-2.5 bg-red-900/30 border border-red-500/40 rounded-lg text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{saveError}</span>
                    </div>
                  )}

                  {saveSuccess && (
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-900/30 border border-emerald-500/40 rounded-lg text-xs text-emerald-300">
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Profile saved and synchronized to Firestore!</span>
                    </div>
                  )}

                  {/* Form Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#232942]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(user.name);
                        setEditUsername(user.username);
                        setEditAvatar(user.avatar);
                        setEditBio(user.bio || '');
                        setSaveError(null);
                      }}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/40 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Firestore...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-[#131625] border border-[#232942]">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-purple-500/60 shadow-lg shadow-purple-950/50"
                  />
                  <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-xl font-['Space_Grotesk'] font-bold text-white truncate">
                        {user.name}
                      </h2>
                      <span className="text-xs font-mono text-purple-400 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-800/40 w-fit mx-auto sm:mx-0">
                        {user.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono truncate">{user.username} • Joined {user.joinDate}</p>
                    {user.bio && (
                      <p className="text-xs text-slate-300 italic pt-0.5 pb-0.5 max-w-lg leading-relaxed break-words">
                        "{user.bio}"
                      </p>
                    )}
                    {user.email && (
                      <p className="text-xs text-purple-300 font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                        <Mail className="w-3.5 h-3.5 text-purple-400" />
                        {user.email}
                      </p>
                    )}

                    <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-2 text-xs text-slate-300 flex-wrap">
                      <span className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-amber-300">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <strong>{userRep}</strong> Reputation
                      </span>

                      {/* Edit Profile Trigger */}
                      <button
                        id="open-profile-edit-btn"
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit profile name, username, and picture"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        Edit Profile
                      </button>

                      {onSignOut && (
                        <button
                          onClick={() => {
                            onClose();
                            onSignOut();
                          }}
                          className="ml-auto px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Activity Statistics (Zero Base, increases only on action) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Operative Activity Statistics
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">Live User Counters</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-rose-400 gap-1.5 text-xs font-semibold">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Likes</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold font-mono text-white">{userLikes}</p>
                    <p className="text-[10px] text-slate-400">Posts Liked</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-blue-400 gap-1.5 text-xs font-semibold">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Comments</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold font-mono text-white">{userComments}</p>
                    <p className="text-[10px] text-slate-400">Replies & Posts</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-cyan-400 gap-1.5 text-xs font-semibold">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Saves</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold font-mono text-white">{userSaves}</p>
                    <p className="text-[10px] text-slate-400">Vault Entries</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-purple-400 gap-1.5 text-xs font-semibold">
                      <PenSquare className="w-3.5 h-3.5" />
                      <span>Topics</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold font-mono text-white">{userTopics}</p>
                    <p className="text-[10px] text-slate-400">Discussions</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-amber-500/30 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1 bg-gradient-to-b from-amber-500/5 to-transparent">
                    <div className="flex items-center justify-center text-amber-400 gap-1.5 text-xs font-semibold">
                      <Bell className="w-3.5 h-3.5" />
                      <span>Launches</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold font-mono text-amber-300">{totalReleasesTracked}</p>
                    <p className="text-[10px] text-slate-400">Tracked Games</p>
                  </div>
                </div>
              </div>

              {/* Bookmarked Items Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Your Saved Vault Entries ({userSaves})
                </h3>

                {totalSaved === 0 ? (
                  <div className="text-center py-6 bg-[#111422] rounded-xl border border-[#1f2438] text-slate-500 text-xs">
                    You haven't bookmarked any videos, games, or articles yet. Click the bookmark icon on any card to save it here!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookmarkedVideos.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => {
                          onClose();
                          onSelectVideo(v);
                        }}
                        className="flex items-center justify-between p-2.5 bg-[#141725] hover:bg-[#1a1f33] border border-[#232840] rounded-xl cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Film className="w-4 h-4 text-red-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {v.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Video</span>
                      </div>
                    ))}

                    {bookmarkedGames.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          onClose();
                          onSelectGame(g);
                        }}
                        className="flex items-center justify-between p-2.5 bg-[#141725] hover:bg-[#1a1f33] border border-[#232840] rounded-xl cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {g.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Game</span>
                      </div>
                    ))}

                    {bookmarkedArticles.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onClose();
                          onSelectArticle(a);
                        }}
                        className="flex items-center justify-between p-2.5 bg-[#141725] hover:bg-[#1a1f33] border border-[#232840] rounded-xl cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {a.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Article</span>
                      </div>
                    ))}

                    {bookmarkedReviews.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onClose();
                          onSelectReview(r);
                        }}
                        className="flex items-center justify-between p-2.5 bg-[#141725] hover:bg-[#1a1f33] border border-[#232840] rounded-xl cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Star className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {r.gameTitle} Review
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Review</span>
                      </div>
                    ))}

                    {bookmarkedGuides.map((gd) => (
                      <div
                        key={gd.id}
                        onClick={() => {
                          onClose();
                          onSelectGuide(gd);
                        }}
                        className="flex items-center justify-between p-2.5 bg-[#141725] hover:bg-[#1a1f33] border border-[#232840] rounded-xl cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {gd.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Guide</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Release Watchlist & Device Launch Reminders Section */}
              <div className="space-y-4 pt-2 border-t border-[#1f2438]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Release Watchlist & Launch Reminders ({totalReleasesTracked})</span>
                  </h3>
                  
                  {/* Browser Notification Status Indicator */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    {getNotificationPermission() === 'granted' ? (
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Device Notifications Active</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Browser Notifications Inactive</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-Section 1: Active Scheduled Device Reminders */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <BellRing className="w-3.5 h-3.5 text-amber-400" />
                      Scheduled Device Launch Alerts ({remindedEntries.length})
                    </span>
                    {onNavigateToCalendar && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToCalendar();
                        }}
                        className="text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold lowercase cursor-pointer"
                      >
                        open release calendar →
                      </button>
                    )}
                  </div>

                  {remindedEntries.length === 0 ? (
                    <div className="p-3.5 bg-[#111422] rounded-xl border border-[#1f2438] text-slate-500 text-xs">
                      No game launch reminders scheduled. Click the "Remind" bell icon on any game in the Release Calendar to receive device browser notifications!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {remindedEntries.map(({ id, timing, game }) => (
                        <div
                          key={id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#141725] hover:bg-[#181d2e] border border-amber-500/20 rounded-xl gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={game.cover}
                              alt={game.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                                {game.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                                <span className="text-purple-300 font-medium">{game.releaseDateDisplay}</span>
                                {game.releaseTime && (
                                  <span className="text-slate-500">({game.releaseTime})</span>
                                )}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  🔔 {getReminderTimingLabel(timing)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* Live Notification Test Button */}
                            <button
                              type="button"
                              onClick={() => handleTestNotification(game, timing)}
                              disabled={testingNotificationId === game.id}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                              title="Test sending a browser notification to your device now"
                            >
                              <Bell className="w-3 h-3" />
                              <span>{testingNotificationId === game.id ? 'Testing...' : 'Test Alert'}</span>
                            </button>

                            {/* View in Calendar */}
                            {onNavigateToCalendar && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onNavigateToCalendar(game.slug);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                                title="View in Release Calendar"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Details</span>
                              </button>
                            )}

                            {/* Remove Reminder */}
                            {onRemoveReminder && (
                              <button
                                type="button"
                                onClick={() => onRemoveReminder(id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                                title="Cancel launch reminder"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub-Section 2: Release Watchlist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
                      Game Release Watchlist ({watchlistedGames.length})
                    </span>
                  </div>

                  {watchlistedGames.length === 0 ? (
                    <div className="p-3.5 bg-[#111422] rounded-xl border border-[#1f2438] text-slate-500 text-xs">
                      Your release watchlist is empty. Bookmark upcoming releases in the Game Release Calendar to track launch dates here!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {watchlistedGames.map((game) => (
                        <div
                          key={game.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#141725] hover:bg-[#181d2e] border border-[#232840] rounded-xl gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={game.cover}
                              alt={game.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold font-['Space_Grotesk'] text-white truncate">
                                {game.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span className="text-purple-300 font-medium">{game.releaseDateDisplay}</span>
                                <span>•</span>
                                <span className="text-slate-500">{game.platforms.slice(0, 3).join(', ')}</span>
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30">
                                  {game.status}
                                </span>
                                <span className="text-[10px] text-slate-500">{game.genre}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {onNavigateToCalendar && (
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onNavigateToCalendar(game.slug);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View Calendar</span>
                              </button>
                            )}

                            {onRemoveFromWatchlist && (
                              <button
                                type="button"
                                onClick={() => onRemoveFromWatchlist(game.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                                title="Remove from watchlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : activeTab === 'guidelines' ? (
            /* Community Guidelines View */
            <div className="space-y-4 text-sm text-slate-300 font-['Inter']">
              <div className="flex items-center gap-2 text-purple-400 font-['Rajdhani'] font-bold uppercase tracking-wider text-base">
                <Shield className="w-5 h-5" />
                Game Vault Forum Community Code
              </div>

              <div className="space-y-3 p-4 bg-[#131625] border border-[#232942] rounded-xl text-xs sm:text-sm leading-relaxed">
                <div>
                  <strong className="text-white block mb-0.5">1. Civil Discourse & Respect</strong>
                  Disagree with gameplay opinions, build mechanics, or hardware assessments constructively. Personal attacks, harassment, and gatekeeping are strictly prohibited.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">2. No Spoiler Spills</strong>
                  Always mark spoilers clearly in forum thread titles and wrap story revelations with spoiler warnings.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">3. Quality Over Noise</strong>
                  When starting discussion topics, provide genuine context, analysis, or specific questions rather than one-word memes or rage-bait.
                </div>
                <div>
                  <strong className="text-white block mb-0.5">4. Honest Hardware & Gameplay Testing</strong>
                  Game Vault Forum is built on transparent evaluation without sponsored deception.
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Operated under Vault Protocol 2026. Violations result in reputation loss or temporary forum lock.
              </p>
            </div>
          ) : (
            /* Admin Desk View (contact@gamevault.forum only) */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#131625] border border-[#232942] rounded-xl">
                <div>
                  <h3 className="text-sm font-['Space_Grotesk'] font-bold text-white flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-purple-400" />
                    <span>Firestore Database Dispatch & CRM</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live records stored securely in Firestore collections: <code className="text-purple-300 font-mono">Subscriber</code> & <code className="text-purple-300 font-mono">contact_us</code> (<code className="text-purple-300 font-mono">contact_submissions</code>)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadAdminFirestoreData}
                  disabled={loadingAdminData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAdminData ? 'animate-spin text-purple-400' : ''}`} />
                  <span>Refresh Firestore</span>
                </button>
              </div>

              {/* Sub tabs */}
              <div className="flex items-center gap-2 border-b border-[#232942] pb-2">
                <button
                  type="button"
                  onClick={() => setAdminView('inquiries')}
                  className={`px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
                    adminView === 'inquiries'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Inquiries ({contactSubmissions.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminView('subscribers')}
                  className={`px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 ${
                    adminView === 'subscribers'
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Subscribers ({subscribers.length})</span>
                </button>
              </div>

              {/* View Content */}
              {adminView === 'inquiries' ? (
                <div className="space-y-3">
                  {loadingAdminData && contactSubmissions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-mono">
                      Querying Firestore contact_submissions...
                    </div>
                  ) : contactSubmissions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 bg-[#131625] rounded-xl border border-dashed border-[#232942] p-4">
                      No contact inquiries submitted yet. Submissions from <span className="text-purple-300">/contact</span> will securely appear here.
                    </div>
                  ) : (
                    contactSubmissions.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-[#131625] border border-[#232942] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{item.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40 uppercase">
                                {item.category}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                                item.status === 'new' 
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' 
                                  : item.status === 'replied'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <a href={`mailto:${item.email}`} className="text-xs text-purple-400 hover:underline">
                              {item.email}
                            </a>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {item.subject && (
                          <div className="text-xs font-semibold text-slate-200">
                            Subject: {item.subject}
                          </div>
                        )}

                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {item.message}
                        </div>

                        {/* Status update controls */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500 font-mono">Doc ID: {item.id}</span>
                          <div className="flex items-center gap-1.5">
                            {(['new', 'read', 'replied', 'archived'] as ContactSubmissionStatus[]).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(item.id, st)}
                                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded transition-colors ${
                                  item.status === st
                                    ? 'bg-purple-600 text-white font-bold'
                                    : 'bg-white/5 text-slate-400 hover:text-white'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {loadingAdminData && subscribers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-mono">
                      Querying Firestore subscribers...
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 bg-[#131625] rounded-xl border border-dashed border-[#232942] p-4">
                      No subscribers registered yet. Submissions from the footer newsletter form will appear here.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 bg-[#131625] rounded-xl border border-[#232942] overflow-hidden">
                      {subscribers.map((sub) => (
                        <div key={sub.id || sub.email} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-900/40 text-purple-300 flex items-center justify-center text-xs font-bold">
                              @
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">{sub.email}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                Source: {sub.source || 'footer'} • Status: {sub.status}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
