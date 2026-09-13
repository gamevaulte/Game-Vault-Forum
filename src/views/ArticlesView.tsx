import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Article } from '../types';

interface ArticlesViewProps {
  articles: Article[];
  onSelectArticle: (a: Article) => void;
}

const ArticlesViewComponent: React.FC<ArticlesViewProps> = ({ articles, onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Hardware Guides',
    'Tactical Analysis',
    'Gaming Culture',
    'Opinions',
    'Tips',
    'Features',
    'Gaming News',
    'Industry',
    'Gaming Stories'
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (selectedCategory === 'All') return true;
      return a.category === selectedCategory;
    });
  }, [articles, selectedCategory]);

  const leadArticle = useMemo(() => articles[0], [articles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/40 border border-purple-800/40 text-purple-400 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Editorial Magazine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          From the Vault • Gaming Articles
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl font-['Inter']">
          Deep dives, gaming philosophy, design critiques, and timeless gaming stories written by experienced journalists and passionate community players.
        </p>
      </div>

      {/* Lead Article Hero Card */}
      {leadArticle && (
        <div
          onClick={() => onSelectArticle(leadArticle)}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#141224] via-[#0f111c] to-[#121626] border border-purple-500/30 p-6 sm:p-8 shadow-2xl cursor-pointer group hover:border-purple-400/60 transition-all"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 relative aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-[#252a42]">
              <img
                src={leadArticle.featuredImage}
                alt={leadArticle.title}
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-purple-300 rounded border border-purple-500/30">
                {leadArticle.category}
              </span>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {leadArticle.readingTime}
                </span>
                <span>•</span>
                <span>{leadArticle.publicationDate}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors leading-tight">
                {leadArticle.title}
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed font-['Inter']">
                {leadArticle.excerpt}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={leadArticle.author.avatar}
                  alt={leadArticle.author.name}
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
                />
                <div>
                  <p className="text-xs font-bold text-white">{leadArticle.author.name}</p>
                  <p className="text-[10px] text-purple-400">{leadArticle.author.role}</p>
                </div>
              </div>

              <div className="pt-2">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-md shadow-purple-950/50 group-hover:from-purple-500 group-hover:to-indigo-500 transition-all">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1c2032]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#121524] text-slate-400 hover:text-white border border-[#21263c]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => onSelectArticle(art)}
            className="group bg-[#10121d] border border-[#1e2335] hover:border-purple-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-purple-950/20 flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-black shrink-0">
              <img
                src={art.featuredImage}
                alt={art.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-purple-300 rounded border border-purple-500/30">
                {art.category}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mt-2 font-['Inter'] leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1a1f30] flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={art.author.avatar}
                    alt={art.author.name}
                    loading="lazy"
                    decoding="async"
                    className="w-6 h-6 rounded-full object-cover border border-purple-500/40"
                  />
                  <span>{art.author.name}</span>
                </div>
                <span>{art.readingTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ArticlesView = React.memo(ArticlesViewComponent);
