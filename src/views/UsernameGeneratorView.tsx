import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Sliders, 
  Heart, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  Info, 
  Smile, 
  Flame, 
  Moon, 
  Trophy,
  Filter,
  CheckCircle2,
  Gamepad2
} from 'lucide-react';
import { 
  UsernameStyle, 
  GamingTheme, 
  GeneratorPreferences, 
  GeneratedUsername, 
  UsernameLengthPreference 
} from '../types/usernameGenerator';
import { 
  generateBatchUsernames, 
  generateSingleUsername 
} from '../lib/usernameGenerator';
import { UsernameCard } from '../components/usernameGenerator/UsernameCard';
import { AdminUsernameModal } from '../components/usernameGenerator/AdminUsernameModal';
import { ToolHeader } from '../components/tools/ToolHeader';
import { ToolFaq, FaqItem } from '../components/tools/ToolFaq';
import { UserAccount, PageTab } from '../types';

interface UsernameGeneratorViewProps {
  currentUser?: UserAccount | null;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info') => void;
}

const STYLES_LIST: UsernameStyle[] = [
  'Cool', 'Funny', 'Competitive', 'Pro Gamer', 'Dark', 'Mysterious',
  'Fantasy', 'Futuristic', 'Minimal', 'Cute', 'Savage', 'Creative', 'Random'
];

const THEMES_LIST: GamingTheme[] = [
  'Military', 'Space', 'Cyberpunk', 'Fantasy', 'Animals', 'Fire',
  'Ice', 'Technology', 'Mythology', 'Horror', 'Adventure', 'Random'
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is a gaming username generator?',
    answer: 'A gaming username generator is a specialized tool engineered to synthesize unique, memorable handle ideas for games, Discord, Twitch, YouTube, and esports rosters by intelligently blending styles, themes, and gaming terminology.'
  },
  {
    question: 'Can I use these usernames on any game?',
    answer: 'Yes! Generated usernames are suitable for Steam, PlayStation Network, Xbox Live, Nintendo Switch, Riot Games (Valorant, LoL), Epic Games, Discord, and mobile titles like PUBG Mobile and Call of Duty.'
  },
  {
    question: 'Are generated usernames unique?',
    answer: 'While our algorithm dynamically combines hundreds of roots and prefixes, availability depends on the specific platform you intend to register on. Platforms manage independent handle namespaces, and millions of accounts already exist.'
  },
  {
    question: 'Can I use my real name as part of a username?',
    answer: 'Yes. You can enter your first name or nickname into the Optional Keyword field. The generator will harmonize your name with tactical, fantasy, or competitive styling.'
  },
  {
    question: 'Can I generate funny gaming names?',
    answer: 'Absolutely. Select the "Funny" style to generate lighthearted, comedic names incorporating tongue-in-cheek gaming tropes and playful descriptors.'
  },
  {
    question: 'Can I generate short gaming usernames?',
    answer: 'Yes. Switch the Length toggle to "Short" or use the quick "Short Names" button to produce punchy 3 to 7 character handles with minimal clutter.'
  }
];

const STORAGE_FAVORITES_KEY = 'gvf_saved_fav_usernames_v1';

export const UsernameGeneratorView: React.FC<UsernameGeneratorViewProps> = ({
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onNavigateTab,
  onShowToast
}) => {
  // Preferences state
  const [selectedStyles, setSelectedStyles] = useState<UsernameStyle[]>(['Cool', 'Competitive']);
  const [selectedTheme, setSelectedTheme] = useState<GamingTheme>('Cyberpunk');
  const [keyword, setKeyword] = useState('');
  const [lengthPreference, setLengthPreference] = useState<UsernameLengthPreference>('medium');
  const [maxChars, setMaxChars] = useState(14);
  const [addNumbers, setAddNumbers] = useState(false);
  const [addSymbols, setAddSymbols] = useState(false);
  const [useCapitalLetters, setUseCapitalLetters] = useState(true);
  const [batchSize, setBatchSize] = useState<5 | 10>(10);

  // Results state
  const [generatedList, setGeneratedList] = useState<GeneratedUsername[]>([]);
  const [filterStyle, setFilterStyle] = useState<string>('All');
  const [copyAllStatus, setCopyAllStatus] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<GeneratedUsername[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // Check if current user is admin
  const isAdmin = currentUser?.email === 'contact@gamevault.forum';

  // Trigger initial generation on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const toast = (msg: string, type: 'success' | 'info' = 'success') => {
    if (onShowToast) onShowToast(msg, type);
  };

  const getPreferences = (): GeneratorPreferences => ({
    selectedStyles: selectedStyles.length > 0 ? selectedStyles : ['Cool'],
    selectedTheme,
    keyword,
    lengthPreference,
    maxCharacters: maxChars,
    addNumbers,
    addSymbols,
    useCapitalLetters,
    batchSize
  });

  const handleGenerate = () => {
    const prefs = getPreferences();
    const batch = generateBatchUsernames(prefs);
    setGeneratedList(batch);
  };

  const handleRegenerateSingle = (id: string) => {
    const prefs = getPreferences();
    const newOne = generateSingleUsername(prefs);
    setGeneratedList(prev => prev.map(item => (item.id === id ? newOne : item)));
  };

  const handleToggleStyle = (style: UsernameStyle) => {
    if (style === 'Random') {
      setSelectedStyles(['Random']);
      return;
    }
    setSelectedStyles(prev => {
      const withoutRandom = prev.filter(s => s !== 'Random');
      if (withoutRandom.includes(style)) {
        const next = withoutRandom.filter(s => s !== style);
        return next.length === 0 ? ['Cool'] : next;
      }
      return [...withoutRandom, style];
    });
  };

  const handleCopySingle = (name: string) => {
    navigator.clipboard.writeText(name);
    toast(`Copied "${name}" to clipboard!`);
  };

  const handleCopyAll = () => {
    if (generatedList.length === 0) return;
    const text = generatedList.map(item => item.name).join(', ');
    navigator.clipboard.writeText(text);
    setCopyAllStatus(true);
    toast(`Copied all ${generatedList.length} usernames!`);
    setTimeout(() => setCopyAllStatus(false), 2500);
  };

  const handleToggleFavorite = (username: GeneratedUsername) => {
    if (!isSignedIn) {
      if (onOpenSignIn) {
        onOpenSignIn();
      } else {
        toast('Sign in or register to save usernames to your favorites collection.', 'info');
      }
      return;
    }
    setFavorites(prev => {
      const exists = prev.some(f => f.name === username.name);
      let updated: GeneratedUsername[];
      if (exists) {
        updated = prev.filter(f => f.name !== username.name);
        toast(`Removed "${username.name}" from favorites.`, 'info');
      } else {
        updated = [username, ...prev];
        toast(`Saved "${username.name}" to favorites!`, 'success');
      }
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleRestart = () => {
    setSelectedStyles(['Cool']);
    setSelectedTheme('Random');
    setKeyword('');
    setLengthPreference('medium');
    setAddNumbers(false);
    setAddSymbols(false);
    setUseCapitalLetters(true);
    setBatchSize(10);
    const prefs: GeneratorPreferences = {
      selectedStyles: ['Cool'],
      selectedTheme: 'Random',
      keyword: '',
      lengthPreference: 'medium',
      addNumbers: false,
      addSymbols: false,
      useCapitalLetters: true,
      batchSize: 10
    };
    setGeneratedList(generateBatchUsernames(prefs));
    toast('Generator reset to standard default settings.', 'info');
  };

  // Quick Action Tweak Handlers
  const handleSurpriseMe = () => {
    const randomTheme = THEMES_LIST[Math.floor(Math.random() * THEMES_LIST.length)];
    const randomStyle = STYLES_LIST[Math.floor(Math.random() * STYLES_LIST.length)];
    setSelectedTheme(randomTheme);
    setSelectedStyles([randomStyle]);
    const prefs: GeneratorPreferences = {
      selectedStyles: [randomStyle],
      selectedTheme: randomTheme,
      keyword: '',
      lengthPreference: 'medium',
      addNumbers: Math.random() > 0.6,
      addSymbols: Math.random() > 0.7,
      useCapitalLetters: true,
      batchSize
    };
    setGeneratedList(generateBatchUsernames(prefs));
    toast(`Surprise batch created (${randomStyle} + ${randomTheme})!`);
  };

  const handleShortNames = () => {
    setLengthPreference('short');
    const prefs = { ...getPreferences(), lengthPreference: 'short' as const };
    setGeneratedList(generateBatchUsernames(prefs));
    toast('Switched to short, punchy username formats.');
  };

  const handleRemoveNumbers = () => {
    setAddNumbers(false);
    setGeneratedList(prev => prev.map(item => ({
      ...item,
      name: item.name.replace(/[0-9]/g, ''),
      hasNumbers: false
    })));
    toast('Stripped numerical suffixes from results.');
  };

  const handleMakeMoreCompetitive = () => {
    setSelectedStyles(['Competitive', 'Pro Gamer']);
    const prefs: GeneratorPreferences = {
      ...getPreferences(),
      selectedStyles: ['Competitive', 'Pro Gamer']
    };
    setGeneratedList(generateBatchUsernames(prefs));
    toast('Applied esports, clutch & competitive vocabulary.');
  };

  const handleMakeMoreFunny = () => {
    setSelectedStyles(['Funny']);
    const prefs: GeneratorPreferences = {
      ...getPreferences(),
      selectedStyles: ['Funny']
    };
    setGeneratedList(generateBatchUsernames(prefs));
    toast('Applied comedic & meme-tier gaming vocabulary.');
  };

  const handleMakeMoreDark = () => {
    setSelectedStyles(['Dark', 'Mysterious']);
    setSelectedTheme('Horror');
    const prefs: GeneratorPreferences = {
      ...getPreferences(),
      selectedStyles: ['Dark', 'Mysterious'],
      selectedTheme: 'Horror'
    };
    setGeneratedList(generateBatchUsernames(prefs));
    toast('Applied dark, void & grim phantom vocabulary.');
  };

  // Filter results
  const displayedUsernames = generatedList.filter(item => {
    if (filterStyle === 'All') return true;
    return item.style === filterStyle;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <ToolHeader
        title="Gaming Username Generator"
        subtitle="Create a gaming name that actually feels like you. Generate unique, memorable handles for Steam, Discord, Twitch, YouTube, and esports profiles."
        breadcrumbs={[
          { label: 'Gaming Tools', onClick: () => onNavigateTab('tools' as any) },
          { label: 'Gaming Username Generator' }
        ]}
        icon={<Sparkles className="w-6 h-6" />}
      />

      {/* Admin Moderation Desk Trigger (contact@gamevault.forum only) */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-purple-300">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Admin Desk: Moderator privileges active for word filtering and policy.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Word Filter Moderation
          </button>
        </div>
      )}

      {/* Main Grid: Left Configuration Form, Right Results & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Generator Controls (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f111e] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold font-['Space_Grotesk'] text-white uppercase tracking-wider">
                Generator Tuning
              </h2>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset preferences"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. Username Style */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-2">
              1. Username Style (Pick One or More)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STYLES_LIST.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleToggleStyle(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-['Rajdhani'] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 border border-purple-400/40'
                        : 'bg-[#151829] text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Gaming Theme */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-2">
              2. Gaming Theme
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {THEMES_LIST.map((theme) => {
                const isSelected = selectedTheme === theme;
                return (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-['Rajdhani'] font-semibold text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 shadow-md shadow-cyan-950/40'
                        : 'bg-[#151829] text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Optional Keyword */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              3. Enter a word or nickname (optional)
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Shadow, Joel, Titan"
              maxLength={20}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* 4. Username Length Preference */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-2">
              4. Username Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['short', 'medium', 'long'] as UsernameLengthPreference[]).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setLengthPreference(len)}
                  className={`py-2 px-3 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    lengthPreference === len
                      ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60'
                      : 'bg-[#151829] text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>

            {/* Character length slider */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Max character boundary:</span>
              <span className="font-mono text-purple-300 font-bold">{maxChars} chars</span>
            </div>
            <input
              type="range"
              min={6}
              max={24}
              value={maxChars}
              onChange={(e) => setMaxChars(Number(e.target.value))}
              className="w-full mt-1 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* 5. Numbers, Symbols & Casing Toggles */}
          <div>
            <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-slate-300 mb-2">
              5. Numbers, Symbols & Casing
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#151829] border border-white/5 cursor-pointer text-xs">
                <span className="text-slate-200">Add Numbers</span>
                <input
                  type="checkbox"
                  checked={addNumbers}
                  onChange={(e) => setAddNumbers(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#151829] border border-white/5 cursor-pointer text-xs">
                <span className="text-slate-200">Add Symbols (e.g. _, -, .)</span>
                <input
                  type="checkbox"
                  checked={addSymbols}
                  onChange={(e) => setAddSymbols(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#151829] border border-white/5 cursor-pointer text-xs">
                <span className="text-slate-200">Use Capital Letters (PascalCase)</span>
                <input
                  type="checkbox"
                  checked={useCapitalLetters}
                  onChange={(e) => setUseCapitalLetters(e.target.checked)}
                  className="accent-purple-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Batch quantity toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Usernames per batch:</span>
            <div className="flex items-center gap-1.5">
              {[5, 10].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBatchSize(size as 5 | 10)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    batchSize === size
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Rajdhani'] font-bold text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-purple-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01]"
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
            <span>GENERATE USERNAMES</span>
          </button>
        </div>

        {/* Right Section: Results, Quick Buttons, Favorites (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Modifier Action Buttons Bar */}
          <div className="p-4 rounded-2xl bg-[#0f111e] border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Generator Modifiers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Surprise Me</span>
              </button>
              <button
                type="button"
                onClick={handleShortNames}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Short Names</span>
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveNumbers}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Remove Numbers</span>
              </button>
              <button
                type="button"
                onClick={handleMakeMoreCompetitive}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trophy className="w-3 h-3 text-purple-400" />
                <span>Make It More Competitive</span>
              </button>
              <button
                type="button"
                onClick={handleMakeMoreFunny}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Smile className="w-3 h-3 text-emerald-400" />
                <span>Make It More Funny</span>
              </button>
              <button
                type="button"
                onClick={handleMakeMoreDark}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Make It More Dark</span>
              </button>
            </div>
          </div>

          {/* Results Action Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-['Space_Grotesk'] text-white">
                Generated Names ({displayedUsernames.length})
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Batch {batchSize}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Style filter */}
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={filterStyle}
                  onChange={(e) => setFilterStyle(e.target.value)}
                  className="bg-[#141729] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Styles</option>
                  {selectedStyles.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Copy all button */}
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copyAllStatus ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Usernames Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {displayedUsernames.map((item) => (
              <UsernameCard
                key={item.id}
                username={item}
                onCopy={handleCopySingle}
                onRegenerate={handleRegenerateSingle}
                onToggleFavorite={handleToggleFavorite}
                isFavorited={favorites.some(f => f.name === item.name)}
              />
            ))}
          </div>

          {/* Mandatory Availability Disclaimer */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-start gap-2.5 text-xs text-purple-200/90 font-['Inter']">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Availability Note:</strong> Availability depends on the platform you want to use this name on. Different games, launchers, and social networks have independent handle databases and character rules.
            </div>
          </div>

          {/* Favorites Drawer / Panel if any */}
          {favorites.length > 0 && (
            <div className="mt-8 p-5 rounded-2xl bg-[#0f111e] border border-rose-500/20 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                    Saved Favorites ({favorites.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFavorites([]);
                    localStorage.removeItem(STORAGE_FAVORITES_KEY);
                    toast('Cleared favorites collection.', 'info');
                  }}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-200 hover:border-purple-500/40"
                  >
                    <span>{fav.name}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(fav.name)}
                      className="text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(fav)}
                      className="text-rose-400 hover:text-rose-300"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational SEO Content: What Makes a Good Gaming Username? */}
      <section className="mt-16 pt-10 border-t border-white/10 font-['Inter']">
        <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white mb-3">
          What Makes a Good Gaming Username?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mb-8">
          Your gaming handle is your digital calling card across voice chats, leaderboards, stream overlays, and tournament kill feeds. Choosing a distinctive moniker creates recognition and consistency across your gaming journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3 font-bold">
              1
            </div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5">
              Keep It Easy to Remember
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Short, punchy names with clear pronunciation allow teammates to call you out quickly during high-stress teamfights without tongue-twisting.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3 font-bold">
              2
            </div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5">
              Avoid Unnecessary Numbers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adding "12345" or "999" dilutes the originality of your identity. Strive for word combinations or stylized prefixes rather than excessive digits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3 font-bold">
              3
            </div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5">
              Match Your Personality & Playstyle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whether you are an aggressive front-line duelist, a calculated sniper, or a relaxed party gamer, let the tone reflect how you interact in the lobby.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3 font-bold">
              4
            </div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5">
              Avoid Copying Famous Gamers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Imitating pro players like Shroud, Faker, or Ninja makes your profile look like a clone or fan account. Build an identity that belongs purely to you.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3 font-bold">
              5
            </div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5">
              Think Multi-Platform Early
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check if your desired handle is claimable across Twitch, YouTube, Discord, and Steam so your community can effortlessly follow you everywhere.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f111e] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center mb-3 font-bold">
              6
            </div>
            <h3 className="text-sm font-bold font-['Space_Grotesk'] text-white mb-1.5">
              Test in Voice Chat
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Say the handle aloud three times: "Nice shot, [Name]!" If it feels natural and clear in Discord voice comms, it will serve you well for years.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <ToolFaq
        title="Frequently Asked Questions"
        subtitle="Common questions regarding gaming handle generation, character limits, and trademark safety."
        items={FAQ_ITEMS}
      />

      {/* Admin Modal */}
      {isAdmin && (
        <AdminUsernameModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onShowToast={toast}
        />
      )}
    </div>
  );
};
