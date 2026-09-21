import React, { useState, useMemo, useEffect } from 'react';
import { Compass, Clock, Lightbulb, ChevronRight, Gamepad2, Filter } from 'lucide-react';
import { Guide } from '../types';

interface GuidesViewProps {
  guides: Guide[];
  onSelectGuide: (g: Guide) => void;
  initialCategory?: string;
}

const GuidesViewComponent: React.FC<GuidesViewProps> = ({ guides, onSelectGuide, initialCategory }) => {
  const categories = [
    'All',
    'Beginner Guides',
    'Strategy',
    'Builds',
    'Walkthroughs',
    'Tips & Tricks',
    'Settings',
    'Game Mechanics'
  ];

  const normalizeCat = (raw?: string) => {
    if (!raw) return 'All';
    const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = categories.find((c) => c.toLowerCase().replace(/[^a-z0-9]/g, '') === clean);
    return found || 'All';
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(() => normalizeCat(initialCategory));
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(normalizeCat(initialCategory));
    }
  }, [initialCategory]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredGuides = useMemo(() => {
    return guides.filter((gd) => {
      const matchCat = selectedCategory === 'All' || gd.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'All' || gd.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [guides, selectedCategory, selectedDifficulty]);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      case 'Intermediate':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Advanced':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
      default:
        return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 rounded-full text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          Tactical Guides & Game Mechanics
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-['Rajdhani'] tracking-wide text-white">
          Gaming Guides, Builds & Settings
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl font-['Inter']">
          Step-by-step masterclasses, optimal hardware configurations, Scadutree routes, build guides, and hidden game mechanics tested by the Game Vault crew.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="p-5 rounded-2xl bg-[#0e101a] border border-[#20253b] space-y-3">
        {/* Category filters */}
        <div className="space-y-2">
          <span className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 block">
            Category:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[#141726] text-slate-400 hover:text-white border border-[#232840]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filters */}
        <div className="space-y-2 pt-2 border-t border-[#1a1f33]">
          <span className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-400 block">
            Difficulty Tier:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[#141726] text-slate-400 hover:text-white border border-[#232840]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => onSelectGuide(guide)}
            className="group bg-[#10121d] border border-[#1e2335] hover:border-emerald-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-black shrink-0">
                <img
                  src={guide.image}
                  alt={guide.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider rounded border ${getDifficultyBadge(guide.difficulty)}`}>
                  {guide.difficulty}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-mono bg-black/80 backdrop-blur-sm text-slate-300 rounded">
                  {guide.estimatedReadingTime} read
                </span>
              </div>

              <div className="p-5 space-y-3">
                <span className="text-xs font-semibold text-emerald-400 block">
                  {guide.game} • {guide.category}
                </span>

                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {guide.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 font-['Inter'] leading-relaxed">
                  {guide.shortDescription}
                </p>

                {/* Pro tip preview */}
                {guide.sections[0]?.tip && (
                  <div className="p-2.5 rounded-lg bg-[#121927] border border-cyan-900/40 text-[11px] text-cyan-300 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{guide.sections[0].tip}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-[#1a1f30] flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-emerald-300 transition-colors">
              <span>Read Step-by-Step Guide</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GuidesView = React.memo(GuidesViewComponent);
