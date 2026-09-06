import React, { useState } from 'react';
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
  PenSquare
} from 'lucide-react';
import { UserAccount, Video, Game, Article, Review, Guide } from '../types';

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
  initialTab?: 'profile' | 'guidelines';
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
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'guidelines'>(initialTab);

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
              {/* User Identity Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-[#131625] border border-[#232942]">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-purple-500/60 shadow-lg shadow-purple-950/50"
                />
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h2 className="text-xl font-['Space_Grotesk'] font-bold text-white">
                      {user.name}
                    </h2>
                    <span className="text-xs font-mono text-purple-400 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-800/40 w-fit mx-auto sm:mx-0">
                      {user.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{user.username} • Joined {user.joinDate}</p>
                  {user.email && (
                    <p className="text-xs text-purple-300 font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      {user.email}
                    </p>
                  )}

                  <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-amber-300">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <strong>{userRep}</strong> Reputation
                    </span>

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

              {/* Verified Activity Statistics (Zero Base, increases only on action) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    Operative Activity Statistics
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">Live User Counters</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-rose-400 gap-1.5 text-xs font-semibold">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Likes</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-white">{userLikes}</p>
                    <p className="text-[10px] text-slate-400">Posts Liked</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-blue-400 gap-1.5 text-xs font-semibold">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Comments</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-white">{userComments}</p>
                    <p className="text-[10px] text-slate-400">Replies & Comments</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-cyan-400 gap-1.5 text-xs font-semibold">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Saves</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-white">{userSaves}</p>
                    <p className="text-[10px] text-slate-400">Bookmarked Items</p>
                  </div>

                  <div className="p-3 bg-[#131625] border border-[#232942] rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center text-purple-400 gap-1.5 text-xs font-semibold">
                      <PenSquare className="w-3.5 h-3.5" />
                      <span>Discussions</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-white">{userTopics}</p>
                    <p className="text-[10px] text-slate-400">Topics Started</p>
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
            </>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
