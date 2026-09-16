import React from 'react';
import { 
  X, 
  Shield, 
  Calendar, 
  Award, 
  ThumbsUp, 
  MessageSquare, 
  Bookmark, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  ExternalLink,
  Edit3
} from 'lucide-react';
import { UserAccount } from '../types';

export interface PublicUserProfileData {
  id?: string;
  name: string;
  username?: string;
  avatar: string;
  role?: string;
  badge?: string;
  bio?: string;
  reputation?: number;
  joinDate?: string;
  createdAt?: string;
  stats?: {
    likesCount: number;
    commentsCount: number;
    savesCount: number;
    topicsCount: number;
  };
  isSelf?: boolean;
}

interface PublicUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PublicUserProfileData | null;
  onEditOwnProfile?: () => void;
}

export const PublicUserProfileModal: React.FC<PublicUserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onEditOwnProfile
}) => {
  if (!isOpen || !profile) return null;

  // Format username with leading @
  const rawUsername = profile.username || profile.name.toLowerCase().replace(/\s+/g, '_');
  const formattedUsername = rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`;

  // Role and badge
  const roleName = profile.role || profile.badge || 'Recruit Operative';
  const badgeName = profile.badge || 'Vault Pioneer';
  const reputation = typeof profile.reputation === 'number' ? profile.reputation : 120;
  const joinDate = profile.joinDate || 'Jan 2025';

  // Stats
  const likesCount = profile.stats?.likesCount ?? 0;
  const commentsCount = profile.stats?.commentsCount ?? 0;
  const savesCount = profile.stats?.savesCount ?? 0;
  const topicsCount = profile.stats?.topicsCount ?? 0;

  // Bio
  const bioText = profile.bio || 'Active vault operative participating in tactical briefings, hardware evaluations, and strategic gaming discussions.';

  // Role style colors
  const getRoleBadgeStyle = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin') || r.includes('founder') || r.includes('editor')) {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-950/30';
    }
    if (r.includes('elite') || r.includes('veteran') || r.includes('lead')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-950/30';
    }
    if (r.includes('tactical') || r.includes('specialist')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-950/30';
    }
    return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-emerald-950/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        id="public-user-profile-modal"
        className="relative w-full max-w-lg bg-[#0c0e18] border border-white/10 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 text-white font-['Space_Grotesk']"
      >
        {/* Banner Decorative Header */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-purple-950 via-[#161330] to-cyan-950 border-b border-white/10 overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top Control Bar */}
          <div className="relative z-10 flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-widest text-gray-300">
                Operative Dossier
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Close profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 pb-6 pt-0 relative space-y-6">
          {/* Avatar and Primary Identity Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            {/* Avatar with Status Frame */}
            <div className="relative shrink-0">
              <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl p-1 bg-[#0c0e18] border-2 border-purple-500/60 shadow-xl shadow-purple-950/60 overflow-hidden">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#0c0e18] rounded-full border border-purple-500/40">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
            </div>

            {/* If the current user is viewing their OWN profile, provide quick option to switch to edit modal */}
            {profile.isSelf && onEditOwnProfile && (
              <button
                onClick={() => {
                  onClose();
                  onEditOwnProfile();
                }}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit My Profile</span>
              </button>
            )}
          </div>

          {/* User Names & Tactical Role */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="text-xs text-purple-300 font-mono">
                {formattedUsername}
              </span>
            </div>

            {/* Roles and Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border shadow-sm ${getRoleBadgeStyle(roleName)}`}>
                <Shield className="w-3.5 h-3.5" />
                <span>{roleName}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-['Rajdhani'] font-semibold bg-white/5 text-gray-300 border border-white/10">
                <Award className="w-3 h-3 text-purple-400" />
                <span>{badgeName}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-['Rajdhani'] font-semibold bg-white/5 text-gray-400 border border-white/10 font-mono">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>Joined {joinDate}</span>
              </span>
            </div>
          </div>

          {/* Reputation Highlight Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-cyan-950/30 border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-widest text-purple-300">
                  Community Standing
                </p>
                <p className="text-xs text-gray-300">
                  Tactical Community Contributor
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold font-['Rajdhani'] text-purple-400">
                {reputation}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-mono ml-1">
                REP
              </span>
            </div>
          </div>

          {/* 4 Community Engagement Metric Cards: Likes, Comments, Saves, Discussions */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-widest text-gray-400">
              Engagement & Activity Stats
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Likes Count */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-center">
                <div className="w-7 h-7 mx-auto rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </div>
                <div className="text-base font-bold font-['Rajdhani'] text-white">
                  {likesCount}
                </div>
                <div className="text-[10px] font-['Rajdhani'] uppercase tracking-wider text-gray-400">
                  Likes
                </div>
              </div>

              {/* Comment Counts */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-center">
                <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-base font-bold font-['Rajdhani'] text-white">
                  {commentsCount}
                </div>
                <div className="text-[10px] font-['Rajdhani'] uppercase tracking-wider text-gray-400">
                  Comments
                </div>
              </div>

              {/* Saves Counts */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-center">
                <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Bookmark className="w-3.5 h-3.5" />
                </div>
                <div className="text-base font-bold font-['Rajdhani'] text-white">
                  {savesCount}
                </div>
                <div className="text-[10px] font-['Rajdhani'] uppercase tracking-wider text-gray-400">
                  Saves
                </div>
              </div>

              {/* Discussions Counts */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1 text-center">
                <div className="w-7 h-7 mx-auto rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="text-base font-bold font-['Rajdhani'] text-white">
                  {topicsCount}
                </div>
                <div className="text-[10px] font-['Rajdhani'] uppercase tracking-wider text-gray-400">
                  Discussions
                </div>
              </div>
            </div>
          </div>

          {/* Bio Information Section */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-widest text-gray-400">
              Operative Bio
            </h4>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-gray-300 leading-relaxed font-['Inter']">
              {bioText}
            </div>
          </div>

          {/* Privacy Footnote */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span>Security: Read-Only Public Record</span>
            <span>Game Vault Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
