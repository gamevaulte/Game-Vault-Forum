import React, { useState } from 'react';
import { 
  MessageSquare, 
  Pin, 
  Search, 
  PlusCircle, 
  Eye, 
  ShieldCheck, 
  Tag, 
  Flame, 
  HelpCircle, 
  Compass, 
  Users 
} from 'lucide-react';
import { ForumTopic, ForumCategory } from '../types';
import { MOCK_FORUM_CATEGORIES } from '../data/mockData';

interface ForumViewProps {
  topics: ForumTopic[];
  onSelectTopic: (t: ForumTopic) => void;
  onOpenNewTopic: () => void;
  onOpenGuidelines: () => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  topics,
  onSelectTopic,
  onOpenNewTopic,
  onOpenGuidelines
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTopics = topics.filter((t) => {
    const matchCategory =
      selectedCategory === 'all' ||
      t.category.toLowerCase().includes(
        MOCK_FORUM_CATEGORIES.find((c) => c.id === selectedCategory)?.name.toLowerCase() || ''
      ) ||
      (selectedCategory === 'help' && t.category.includes('Help')) ||
      (selectedCategory === 'community' && t.category.includes('Community'));

    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return topics.length;
    return topics.filter(t => 
      t.category.toLowerCase().includes(
        MOCK_FORUM_CATEGORIES.find(c => c.id === catId)?.name.toLowerCase() || ''
      ) ||
      (catId === 'help' && t.category.includes('Help')) ||
      (catId === 'community' && t.category.includes('Community'))
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-purple-300 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider backdrop-blur-md">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            Game Vault Community Discussions
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
            The Game Vault Forum
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl font-['Inter']">
            A place where gamers come to discuss, debate, help each other with tricky bosses, share hardware setups, and connect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGuidelines}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full text-xs font-semibold border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            Guidelines
          </button>

          <button
            id="forum-start-discussion"
            onClick={onOpenNewTopic}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Start a Discussion
          </button>
        </div>
      </div>

      {/* Forum Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
        <input
          type="text"
          placeholder="Search discussions by topic, keywords, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
        />
      </div>

      {/* Main Forum Grid: Categories on Left / Topics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Selector Side Menu */}
        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-xl">
          <span className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-400 px-2 block mb-2">
            Forum Categories
          </span>

          <div className="space-y-1">
            {MOCK_FORUM_CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="font-['Space_Grotesk']">{cat.name}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    selectedCategory === cat.id ? 'bg-purple-800 text-white' : 'bg-white/5 text-gray-400 border border-white/5'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Community Card */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-2 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold font-['Rajdhani'] uppercase">
              <Users className="w-4 h-4" />
              Community Status
            </div>
            <p className="leading-relaxed">
              <strong>{topics.length}</strong> active community {topics.length === 1 ? 'discussion' : 'discussions'} in the vault.
            </p>
          </div>
        </div>

        {/* Discussion Threads List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 pb-2 px-1">
            <span>
              Showing {filteredTopics.length} discussion {filteredTopics.length === 1 ? 'thread' : 'threads'}
            </span>
            <span className="text-purple-400">Ordered by recent activity</span>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.03] rounded-2xl border border-white/10 space-y-3 backdrop-blur-xl">
              <MessageSquare className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-gray-300 font-bold font-['Space_Grotesk'] text-lg">No topics found</p>
              <p className="text-gray-500 text-xs">Be the first to open a discussion in this category!</p>
              <button
                onClick={onOpenNewTopic}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md shadow-purple-900/30"
              >
                <PlusCircle className="w-4 h-4" />
                Start Discussion
              </button>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl cursor-pointer transition-all duration-200 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <img
                    src={topic.author.avatar}
                    alt={topic.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono uppercase bg-white/5 text-purple-300 px-2.5 py-0.5 rounded-full border border-white/10">
                        {topic.category}
                      </span>
                      {topic.isPinned && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                      {topic.author.isStaff && (
                        <span className="flex items-center gap-1 text-[10px] text-red-300 bg-red-600/20 px-2 py-0.5 rounded-full border border-red-500/30 font-['Rajdhani'] font-bold uppercase">
                          <ShieldCheck className="w-3 h-3" /> Staff
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {topic.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap pt-0.5">
                      <span className="text-gray-300 font-semibold">{topic.author.name}</span>
                      <span>•</span>
                      <span>{topic.timestamp}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-gray-500" />
                        {topic.tags.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right metrics */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 text-xs text-gray-400 gap-1.5">
                  <div className="flex items-center gap-1 text-gray-200 font-mono font-semibold">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>{topic.repliesCount} replies</span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Active {topic.lastActivity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
