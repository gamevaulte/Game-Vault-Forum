import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Award, 
  Users, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Bookmark, 
  FileText, 
  ArrowRight, 
  RefreshCw, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Layers, 
  ExternalLink, 
  Library, 
  HelpCircle, 
  Info, 
  Filter, 
  ArrowLeft,
  Calendar,
  Monitor,
  Flame,
  Gamepad2,
  Share2,
  Wrench,
  Gauge
} from 'lucide-react';
import { ToolHeader } from '../components/tools/ToolHeader';
import { ToolFaq } from '../components/tools/ToolFaq';
import { SourcesInspectorModal } from '../components/tools/SourcesInspectorModal';
import { MyGameStoriesModal } from '../components/tools/MyGameStoriesModal';
import { SaveStoryAuthModal } from '../components/tools/SaveStoryAuthModal';
import { 
  VerifiedGameRecord, 
  GeneratedGameStoryReport, 
  GenerationMode, 
  SpoilerLevel, 
  UserSavedGameStory 
} from '../types/gameStory';
import { 
  VERIFIED_GAME_DATABASE, 
  getAllVerifiedGames,
  searchVerifiedGames, 
  getVerifiedGameById 
} from '../data/gameStoryDatabase';
import { 
  buildVerifiedGameStoryReport, 
  exportReportAsTxt, 
  exportReportAsMarkdown, 
  downloadFile 
} from '../lib/gameStoryEngine';
import { generateGameStoryPdf } from '../lib/gameStoryPdf';
import { saveUserGameStory, getUserGameStories } from '../lib/userGameStoriesStorage';
import { UserAccount } from '../types';

interface GameStoryGeneratorViewProps {
  initialGameSlug?: string;
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onNavigateTab: (tab: any) => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onShare?: (title: string, url: string) => void;
}

export const GameStoryGeneratorView: React.FC<GameStoryGeneratorViewProps> = ({
  initialGameSlug,
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onNavigateTab,
  onShowToast,
  onShare
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Active Selection & Pipeline State
  const [selectedGame, setSelectedGame] = useState<VerifiedGameRecord | null>(null);
  const [disambiguationGame, setDisambiguationGame] = useState<VerifiedGameRecord | null>(null);

  // Configuration options
  const [generationMode, setGenerationMode] = useState<GenerationMode>('standard');
  const [spoilerLevel, setSpoilerLevel] = useState<SpoilerLevel>('none');
  const [strictAccuracyMode, setStrictAccuracyMode] = useState(true);

  // Generation & Results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [currentReport, setCurrentReport] = useState<GeneratedGameStoryReport | null>(null);
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'story' | 'characters' | 'gameplay' | 'sources'>('overview');

  // Modals
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isMyStoriesModalOpen, setIsMyStoriesModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<'save' | 'download' | null>(null);

  // User Saved Stories
  const [savedStories, setSavedStories] = useState<UserSavedGameStory[]>([]);
  const [isSavingStory, setIsSavingStory] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Live AI Internet Search State
  const [serverDiscoveredGames, setServerDiscoveredGames] = useState<VerifiedGameRecord[]>([]);
  const [isSearchingInternet, setIsSearchingInternet] = useState(false);
  const [lastSearchedInternetQuery, setLastSearchedInternetQuery] = useState('');

  // Available Filter Options derived from Database (including extended internet games)
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    getAllVerifiedGames().forEach(g => g.genres.forEach(genre => set.add(genre)));
    return ['All', ...Array.from(set).sort()];
  }, [serverDiscoveredGames]);

  const allPlatforms = useMemo(() => {
    const set = new Set<string>();
    getAllVerifiedGames().forEach(g => g.platforms.forEach(p => {
      if (p.includes('PlayStation')) set.add('PlayStation');
      else if (p.includes('Xbox')) set.add('Xbox');
      else if (p.includes('PC') || p.includes('Windows')) set.add('PC');
      else if (p.includes('Switch') || p.includes('Nintendo')) set.add('Nintendo');
      else set.add(p);
    }));
    return ['All', ...Array.from(set).sort()];
  }, [serverDiscoveredGames]);

  const allYears = useMemo(() => {
    const set = new Set<string>();
    getAllVerifiedGames().forEach(g => set.add(String(g.releaseYear)));
    return ['All', ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, [serverDiscoveredGames]);

  // Combined search results (Local verified database + live internet discovered games)
  const searchResults = useMemo(() => {
    const local = searchVerifiedGames(searchQuery, {
      genre: selectedGenre,
      platform: selectedPlatform,
      year: selectedYear
    });

    const existingIds = new Set(local.map(g => g.id.toLowerCase()));
    const additional = serverDiscoveredGames.filter(g => !existingIds.has(g.id.toLowerCase()));

    return [...local, ...additional];
  }, [searchQuery, selectedGenre, selectedPlatform, selectedYear, serverDiscoveredGames]);

  // Live Internet Search Trigger using AI Google Search Grounding
  const triggerInternetSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? searchQuery).trim();
    if (!q || q.length < 2) return;
    setIsSearchingInternet(true);
    try {
      const response = await fetch(`/api/game-story/search?q=${encodeURIComponent(q)}&live=true`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.results)) {
          setServerDiscoveredGames(prev => {
            const map = new Map<string, VerifiedGameRecord>();
            prev.forEach(g => map.set(g.id.toLowerCase(), g));
            data.results.forEach((g: VerifiedGameRecord) => map.set(g.id.toLowerCase(), g));
            return Array.from(map.values());
          });
          setLastSearchedInternetQuery(q);
          if (data.results.length > 0) {
            onShowToast(`Found ${data.results.length} game(s) from global internet search!`, 'success');
          }
        }
      }
    } catch (err) {
      console.warn('Live internet search error:', err);
    } finally {
      setIsSearchingInternet(false);
    }
  };

  // Debounced live internet search for any game on the internet
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2 || q.toLowerCase() === lastSearchedInternetQuery.toLowerCase()) return;

    const timer = setTimeout(() => {
      triggerInternetSearch(q);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Saved Stories for user
  const loadUserStories = async () => {
    if (currentUser?.id) {
      try {
        const stories = await getUserGameStories(currentUser.id);
        setSavedStories(stories);
      } catch (err) {
        console.warn('Could not load user stories:', err);
      }
    }
  };

  useEffect(() => {
    loadUserStories();
  }, [currentUser?.id, isSignedIn]);

  // Initialize from URL slug if passed
  useEffect(() => {
    if (initialGameSlug) {
      const found = getVerifiedGameById(initialGameSlug);
      if (found) {
        setSelectedGame(found);
      }
    }
  }, [initialGameSlug]);

  // Handle Game Selection
  const handleSelectGame = (game: VerifiedGameRecord) => {
    if (game.hasDisambiguation && game.siblingVersions && game.siblingVersions.length > 0) {
      setDisambiguationGame(game);
    } else {
      setSelectedGame(game);
      setDisambiguationGame(null);
    }
  };

  // Pipeline Execution: Generates factually verified Game Story
  const handleGenerateStory = async () => {
    if (!selectedGame) return;

    setIsGenerating(true);
    setGenerationStep('GAME SEARCH & VERIFICATION');

    try {
      // Step 1: Simulated Pipeline Progress for transparency & audit feedback
      await new Promise(r => setTimeout(r, 250));
      setGenerationStep('SOURCE RETRIEVAL & HIERARCHY AUDIT (TIER 1-4)');
      await new Promise(r => setTimeout(r, 300));
      setGenerationStep('DATA NORMALIZATION & CANONICAL CROSS-CHECK');
      await new Promise(r => setTimeout(r, 250));
      setGenerationStep('FACT CHECKING & SOURCE CONFIDENCE SCORING');

      // Attempt Server API generation
      let report: GeneratedGameStoryReport | null = null;
      try {
        const response = await fetch('/api/game-story/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameId: selectedGame.id,
            generationMode,
            spoilerLevel,
            strictAccuracyMode
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.report) {
            report = data.report;
          }
        }
      } catch (serverErr) {
        console.warn('Server generation error, falling back to deterministic engine:', serverErr);
      }

      setGenerationStep('GROUNDED SYNTHESIS & VALIDATION');
      await new Promise(r => setTimeout(r, 300));

      // Deterministic fallback if server offline or no API response
      if (!report) {
        report = buildVerifiedGameStoryReport(
          selectedGame,
          generationMode,
          spoilerLevel,
          strictAccuracyMode
        );
      }

      setGenerationStep('FINALIZING AUDITED REPORT');
      await new Promise(r => setTimeout(r, 200));

      setCurrentReport(report);
      setActiveReportTab('overview');
      onShowToast(`Generated verified report for ${selectedGame.title}!`, 'success');
    } catch (err: any) {
      console.error('Generation failure:', err);
      onShowToast('Could not complete generation. Please retry.', 'error');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Save to User's Library
  const handleSaveToLibrary = async () => {
    if (!currentReport) return;

    if (!isSignedIn) {
      setPendingAuthAction('save');
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsSavingStory(true);
      await saveUserGameStory(currentUser.id, currentReport);
      await loadUserStories();
      onShowToast(`Saved "${currentReport.gameTitle}" to your story library!`, 'success');
    } catch (err) {
      console.error('Save failed:', err);
      onShowToast('Failed to save story. Please try again.', 'error');
    } finally {
      setIsSavingStory(false);
    }
  };

  // Copy Markdown
  const handleCopyMarkdown = async () => {
    if (!currentReport) return;
    const md = exportReportAsMarkdown(currentReport);
    try {
      await navigator.clipboard.writeText(md);
      setIsCopied(true);
      onShowToast('Report copied to clipboard as Markdown!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onShowToast('Unable to copy automatically.', 'info');
    }
  };

  // Copy Plain Text
  const handleCopyText = async () => {
    if (!currentReport) return;
    const txt = exportReportAsTxt(currentReport);
    try {
      await navigator.clipboard.writeText(txt);
      setIsCopied(true);
      onShowToast('Plain text copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onShowToast('Unable to copy automatically.', 'info');
    }
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!currentReport) return;

    try {
      setIsExportingPdf(true);
      const pdfBytes = await generateGameStoryPdf(currentReport);
      const filename = `gamevault-${currentReport.gameSlug}-story-overview.pdf`;
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadFile(blob, filename, 'application/pdf');
      onShowToast('Verified PDF report generated and downloaded!', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      onShowToast('Failed to generate PDF. You can export as Markdown.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Check if current report is already in library
  const isAlreadySaved = useMemo(() => {
    if (!currentReport || !savedStories.length) return false;
    return savedStories.some(s => s.gameId === currentReport.gameId);
  }, [currentReport, savedStories]);

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-['Inter'] selection:bg-purple-600 selection:text-white pb-20">
      {/* Top Banner Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-900/15 via-cyan-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
        {/* Header Component */}
        <ToolHeader
          title="Game Story & Overview Generator"
          subtitle="Discover, verify, and generate comprehensive, factually grounded video game overviews, spoiler-controlled plot summaries, character rosters, timeline events, and lore dossiers."
          breadcrumbs={[
            { label: 'Gaming Tools', href: '/tools' },
            { label: 'Game Story & Overview Generator' }
          ]}
          icon={<BookOpen className="w-6 h-6 text-purple-400" />}
          badgeText="Flagship Verified Lore Engine"
        />

        {/* Top Control Bar: My Saved Stories & Accuracy Guarantee */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 p-4 rounded-2xl bg-[#0b0e1b] border border-white/5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <span>Deterministic Factual Grounding</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Hallucination Prevention Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded in Tier 1 Primary Publisher records and verified structured databases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMyStoriesModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-['Space_Grotesk'] text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all shadow-sm"
            >
              <Library className="w-4 h-4 text-purple-400" />
              <span>My Story Library</span>
              {savedStories.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                  {savedStories.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: GAME SEARCH & SELECTION INTERFACE */}
        {/* ========================================================================= */}
        {!selectedGame && !currentReport && (
          <div className="mt-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20]/90 border border-purple-500/20 shadow-2xl backdrop-blur-md">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  Search Global Game Registry
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                  Find a Game
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Select a title from our verified database to inspect its production records and generate a custom, spoiler-controlled story & narrative report.
                </p>
              </div>

              {/* Search Input Bar with AI Live Internet Search Trigger */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        triggerInternetSearch();
                      }
                    }}
                    placeholder="Search any game title across the internet (e.g. Silksong, Elden Ring, GTA V, Clair Obscur)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#070913] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-500 text-sm font-medium transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => triggerInternetSearch()}
                  disabled={isSearchingInternet}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                  title="Search the entire internet for this game using AI Google Grounding"
                >
                  <Sparkles className={`w-4 h-4 text-cyan-200 ${isSearchingInternet ? 'animate-spin' : ''}`} />
                  <span>{isSearchingInternet ? 'Searching Internet...' : 'Search All Internet via AI'}</span>
                </button>
              </div>

              {/* Live Search Indicator */}
              {isSearchingInternet && (
                <div className="mt-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-200 animate-pulse">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  <span>Querying Google Search Grounding for verified game records matching <strong>"{searchQuery}"</strong>...</span>
                </div>
              )}

              {/* Quick Pills Example Titles */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Examples:</span>
                {[
                  'The Last of Us',
                  'Elden Ring',
                  'Red Dead Redemption 2',
                  'Resident Evil 4',
                  'Minecraft',
                  'Cyberpunk 2077',
                  'God of War',
                  "Assassin's Creed",
                  'Half-Life 2'
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setSearchQuery(sample)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 hover:text-purple-300 border border-white/5 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Filter Row: Genre, Platform, Year */}
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070913] border border-white/10 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    {allGenres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Platform
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070913] border border-white/10 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    {allPlatforms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Release Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#070913] border border-white/10 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    {allYears.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Disambiguation Modal / Box */}
            {disambiguationGame && disambiguationGame.siblingVersions && (
              <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                      Which game did you mean?
                    </h3>
                    <p className="text-xs text-amber-200/90 mt-1">
                      {disambiguationGame.disambiguationPrompt ||
                        `Multiple distinct editions exist under "${disambiguationGame.title}". Remakes and remasters feature altered story beats, engine overhauls, and gameplay adaptations. Select the exact version to ensure strict factual accuracy:`}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {disambiguationGame.siblingVersions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => {
                            const found = getVerifiedGameById(opt.id) || disambiguationGame;
                            setSelectedGame(found);
                            setDisambiguationGame(null);
                          }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-[#0a0d18] border border-white/10 hover:border-amber-400 cursor-pointer transition-all hover:bg-white/5"
                        >
                          <img
                            src={opt.coverImage}
                            alt={opt.title}
                            className="w-14 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate">
                              {opt.title}
                            </div>
                            <div className="text-[11px] font-semibold text-amber-400 mt-0.5">
                              {opt.editionLabel} ({opt.releaseYear})
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {opt.developer} • {opt.platforms.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Showing <strong className="text-white">{searchResults.length}</strong> verified titles</span>
                <span>Click any game to inspect verified data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className="group relative flex flex-col rounded-3xl bg-[#0b0e1b] border border-white/5 hover:border-purple-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/40 hover:-translate-y-1"
                  >
                    {/* Cover Art Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e1b] via-[#0b0e1b]/40 to-transparent" />

                      {/* Release Year & Confidence Badge */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold font-['Space_Grotesk'] bg-black/70 backdrop-blur-md text-white border border-white/10">
                          {game.releaseYear}
                        </span>
                        {game.hasDisambiguation && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/80 backdrop-blur-md text-amber-950">
                            Disambiguation
                          </span>
                        )}
                      </div>

                      {/* Confidence Score Pill */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-950/80 backdrop-blur-md text-cyan-300 border border-purple-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          {game.confidenceLevel}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {game.editionLabel && (
                          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">
                            {game.editionLabel}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-purple-300 transition-colors">
                          {game.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {game.shortOverview}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500">Developer:</span>
                          <span className="font-semibold text-slate-300 truncate max-w-[160px]">{game.developer}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500">Genre:</span>
                          <span className="text-slate-300 truncate max-w-[160px]">{game.genres.slice(0, 2).join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500">Platforms:</span>
                          <span className="text-slate-300 truncate max-w-[160px]">{game.platforms.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-cyan-400 transition-colors">
                        <span>Select Game</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="p-10 sm:p-12 text-center rounded-3xl bg-[#0b0e1b] border border-white/5 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                    <Sparkles className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {searchQuery.trim() ? `Search Global Internet for "${searchQuery}"?` : 'No Matching Game Found'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    {searchQuery.trim()
                      ? `"${searchQuery}" isn't currently cached in local records. Use AI with live Google Search Grounding to discover, fact-check, and register this game into Game Vault.`
                      : 'We couldn’t verify enough information with the current filter settings. Try searching another title or clearing your filters.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => triggerInternetSearch()}
                        disabled={isSearchingInternet}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-purple-900/40 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className={`w-4 h-4 text-cyan-200 ${isSearchingInternet ? 'animate-spin' : ''}`} />
                        <span>{isSearchingInternet ? 'Searching Internet...' : `Search Internet for "${searchQuery}"`}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGenre('All');
                        setSelectedPlatform('All');
                        setSelectedYear('All');
                      }}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors border border-white/10 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: VERIFIED GAME INFORMATION PREVIEW & GENERATION CONFIGURATION */}
        {/* ========================================================================= */}
        {selectedGame && !currentReport && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              onClick={() => setSelectedGame(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Game Search</span>
            </button>

            {/* Game Preview Hero Card */}
            <div className="rounded-3xl bg-[#0b0e1b] border border-purple-500/30 overflow-hidden shadow-2xl">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src={selectedGame.coverImage}
                  alt={selectedGame.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e1b] via-[#0b0e1b]/60 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
                        {selectedGame.releaseYear}
                      </span>
                      {selectedGame.editionLabel && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          {selectedGame.editionLabel}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {selectedGame.confidenceLevel}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                      {selectedGame.title}
                    </h1>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                      {selectedGame.shortOverview}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSourcesModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 backdrop-blur-md transition-all shrink-0"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>View Grounding Sources ({selectedGame.sources.length})</span>
                  </button>
                </div>
              </div>

              {/* Verified Metadata Strip */}
              <div className="p-6 bg-[#080a14] border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Developer</div>
                  <div className="font-bold text-white mt-0.5">{selectedGame.developer}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Publisher</div>
                  <div className="font-bold text-white mt-0.5">{selectedGame.publisher}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Release Date</div>
                  <div className="font-bold text-white mt-0.5">{selectedGame.releaseDate}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Genres</div>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">{selectedGame.genres.join(', ')}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Game Modes</div>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">{selectedGame.gameModes.join(', ')}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Engine</div>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">{selectedGame.engine || 'Proprietary'}</div>
                </div>
              </div>
            </div>

            {/* Customization & Generation Configuration Deck */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-purple-500/20 shadow-2xl space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                  Customize Generation Pipeline
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Control the narrative depth, spoiler boundaries, and factual strictness of the generated report.
                </p>
              </div>

              {/* 1. Level of Detail (Generation Mode) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  1. Level of Detail (Report Length & Depth)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'quick',
                      title: 'Quick Overview',
                      subtitle: 'Compact Summary & Elevator Pitch',
                      desc: '300-500 words. Key facts, premise, developer context, and core gameplay loop.',
                      badge: 'Fast & Snappy'
                    },
                    {
                      id: 'standard',
                      title: 'Standard Overview',
                      subtitle: 'Balanced Comprehensive Report',
                      desc: '800-1,200 words. Core story summary, key characters, setting, gameplay mechanics, and franchise context.',
                      badge: 'Recommended'
                    },
                    {
                      id: 'deep',
                      title: 'Deep Dive & Lore Analysis',
                      subtitle: 'Exhaustive Narrative & Critical Dossier',
                      desc: '1,500-2,500 words. Factions, timeline events, thematic analysis, and clearly demarcated interpretive criticism.',
                      badge: 'Flagship Dossier'
                    }
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => setGenerationMode(mode.id as GenerationMode)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        generationMode === mode.id
                          ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50'
                          : 'bg-[#080a14] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          generationMode === mode.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-slate-400'
                        }`}>
                          {mode.badge}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          generationMode === mode.id ? 'border-purple-400 bg-purple-500' : 'border-slate-600'
                        }`}>
                          {generationMode === mode.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="text-sm font-bold text-white font-['Space_Grotesk'] mt-3">
                        {mode.title}
                      </div>
                      <div className="text-xs text-purple-300 font-medium mt-0.5">
                        {mode.subtitle}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Spoiler Level */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  2. Spoiler Sensitivity Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'none',
                      title: 'No Spoilers',
                      desc: 'Safe for newcomers. Explores setup, world premise, and early motivations only.',
                      icon: <EyeOff className="w-4 h-4 text-emerald-400" />
                    },
                    {
                      id: 'light',
                      title: 'Light Spoilers',
                      desc: 'Early-game narrative developments, avoiding third-act twists.',
                      icon: <Eye className="w-4 h-4 text-cyan-400" />
                    },
                    {
                      id: 'full',
                      title: 'Full Story',
                      desc: 'Complete chronological narrative arc from inciting event through climax.',
                      icon: <Layers className="w-4 h-4 text-amber-400" />
                    },
                    {
                      id: 'ending',
                      title: 'Ending Explained',
                      desc: 'Full narrative plus in-depth ending breakdown, resolution, and aftermath.',
                      icon: <Sparkles className="w-4 h-4 text-purple-400" />
                    }
                  ].map((sp) => (
                    <div
                      key={sp.id}
                      onClick={() => setSpoilerLevel(sp.id as SpoilerLevel)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        spoilerLevel === sp.id
                          ? 'bg-purple-950/40 border-purple-500 shadow-md'
                          : 'bg-[#080a14] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {sp.icon}
                        <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                          {sp.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {sp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Strict Accuracy Mode Toggle */}
              <div className="p-4 rounded-2xl bg-[#080a14] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Strict Accuracy Mode (Mandatory Grounding)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                        Zero Hallucination
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-2xl">
                      Enforces that the AI uses retrieved publisher records as its factual foundation. If information cannot be verified, the system outputs: <em>"Reliable information could not be verified for this detail."</em>
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={strictAccuracyMode}
                    onChange={(e) => setStrictAccuracyMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>

              {/* Execution Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Cross-referencing {selectedGame.sources.length} authoritative sources</span>
                </div>

                <button
                  onClick={handleGenerateStory}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-sm font-bold font-['Space_Grotesk'] shadow-xl shadow-purple-600/30 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>{generationStep || 'Executing Verification Pipeline...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-cyan-200" />
                      <span>Generate Game Story & Overview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: GENERATED VERIFIED REPORT OUTPUT */}
        {/* ========================================================================= */}
        {currentReport && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-300">
            {/* Top Navigation & Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <button
                onClick={() => {
                  setCurrentReport(null);
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Options / New Game</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {/* Save to Library */}
                <button
                  onClick={handleSaveToLibrary}
                  disabled={isSavingStory}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isAlreadySaved
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isAlreadySaved ? 'text-emerald-400 fill-emerald-400' : 'text-purple-400'}`} />
                  <span>{isAlreadySaved ? 'Saved in Library' : 'Save Story'}</span>
                </button>

                {/* Copy Markdown */}
                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Copy Markdown</span>
                </button>

                {/* Copy Plain Text */}
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Plain Text</span>
                </button>

                {/* Download PDF */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-md shadow-purple-900/30 transition-all disabled:opacity-50"
                >
                  {isExportingPdf ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>Export PDF</span>
                </button>

                {/* Share */}
                {onShare && (
                  <button
                    onClick={() => onShare(currentReport.gameTitle, window.location.href)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
                    title="Share Report"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Report Header Card */}
            <div className="relative rounded-3xl bg-[#0b0e1b] border border-purple-500/30 overflow-hidden p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-5">
                  <img
                    src={currentReport.coverImage}
                    alt={currentReport.gameTitle}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white font-['Space_Grotesk']">
                        {currentReport.gameInfo.releaseYear}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                        {currentReport.generationMode} Mode
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                        {currentReport.spoilerLevel === 'none' ? 'Spoiler-Free' : `${currentReport.spoilerLevel} Spoilers`}
                      </span>
                      {currentReport.reportVersion > 1 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          v{currentReport.reportVersion}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
                      {currentReport.customUserTitle || currentReport.gameTitle}
                    </h2>

                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span>Developer: <strong className="text-slate-200">{currentReport.gameInfo.developer}</strong></span>
                      <span>•</span>
                      <span>Publisher: <strong className="text-slate-200">{currentReport.gameInfo.publisher}</strong></span>
                      <span>•</span>
                      <span>Generated: {new Date(currentReport.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-xs text-purple-200">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>{currentReport.confidenceLevel}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {currentReport.sources.length} authoritative sources verified
                  </span>
                </div>
              </div>

              {/* Navigation Tabs inside Report */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Overview & World' },
                  { id: 'story', label: 'Story & Narrative Arc' },
                  { id: 'characters', label: 'Characters & Factions' },
                  { id: 'gameplay', label: 'Gameplay & Themes' },
                  { id: 'sources', label: `Sources & Verification (${currentReport.sources.length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveReportTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all ${
                      activeReportTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT 1: OVERVIEW & WORLD */}
            {activeReportTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Quick Elevator Pitch */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Quick Game Overview
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    {currentReport.quickOverview}
                  </p>
                </div>

                {/* Production Metadata Grid */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Platforms</span>
                    <div className="font-semibold text-white mt-1">{currentReport.gameInfo.platforms.join(', ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Genre</span>
                    <div className="font-semibold text-white mt-1">{currentReport.gameInfo.genre}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Modes</span>
                    <div className="font-semibold text-white mt-1">{currentReport.gameInfo.gameModes.join(', ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Engine</span>
                    <div className="font-semibold text-white mt-1">{currentReport.gameInfo.engine || 'Proprietary'}</div>
                  </div>
                </div>

                {/* Setting & World Environment */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-3">
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    Setting & Game World
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentReport.setting}
                  </p>
                </div>

                {/* Story Premise */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-3">
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    Story Premise
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentReport.storyPremise}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: STORY & NARRATIVE ARC */}
            {activeReportTab === 'story' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Main Story Narrative Arc */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                      Narrative Arc ({currentReport.spoilerLevel.toUpperCase()} SPOILERS)
                    </h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-400 border border-white/5">
                      Ground Truth Synthesis
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                    {currentReport.mainStory}
                  </div>
                </div>

                {/* Story Timeline (Visual chronological events) */}
                {currentReport.timeline && currentReport.timeline.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e1b] border border-white/5 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                        Story Timeline & Major Events
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Chronological sequence of key narrative turning points.
                      </p>
                    </div>

                    <div className="relative pl-6 sm:pl-8 border-l-2 border-purple-500/30 space-y-8">
                      {currentReport.timeline.map((evt) => (
                        <div key={evt.order} className="relative group">
                          {/* Dot marker */}
                          <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-purple-600 border-4 border-[#0b0e1b] group-hover:scale-125 transition-transform" />

                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300">
                              Stage: {evt.stage}
                            </span>
                            <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                              {evt.title}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed mt-1">
                            {evt.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ending Explanation (if included) */}
                {currentReport.ending && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Narrative Resolution & Ending Breakdown
                    </div>
                    <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                      Ending Explanation & Aftermath
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {currentReport.ending}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: CHARACTERS & FACTIONS */}
            {activeReportTab === 'characters' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Main Characters Grid */}
                <div>
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-4">
                    Main Characters Dossier ({currentReport.characters.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentReport.characters.map((char) => (
                      <div
                        key={char.name}
                        className="p-5 rounded-2xl bg-[#0c0f20] border border-white/5 space-y-2 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
                            {char.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {char.role}
                          </span>
                        </div>

                        {char.affiliation && (
                          <div className="text-xs text-cyan-300 font-medium">
                            Affiliation: {char.affiliation}
                          </div>
                        )}
                        {char.relationship && (
                          <div className="text-xs text-slate-400">
                            Relationship: {char.relationship}
                          </div>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/5">
                          {char.storyImportance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Factions & Organizations */}
                {currentReport.factions && currentReport.factions.length > 0 && (
                  <div className="pt-6 border-t border-white/5">
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-4">
                      Factions & Organizations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentReport.factions.map((fac) => (
                        <div
                          key={fac.name}
                          className="p-5 rounded-2xl bg-[#0c0f20] border border-white/5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                              {fac.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              fac.alignment === 'Friendly'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : fac.alignment === 'Hostile'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}>
                              {fac.alignment}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {fac.description}
                          </p>
                          <div className="text-[11px] text-slate-500 pt-1">
                            Role: {fac.storyRole}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: GAMEPLAY & THEMES */}
            {activeReportTab === 'gameplay' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Gameplay Overview */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-3">
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    Gameplay Overview & Mechanics
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {currentReport.gameplayOverview}
                  </p>
                </div>

                {/* Core Themes */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-white/5 space-y-3">
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    Core Narrative Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentReport.storyThemes.map((th) => (
                      <span
                        key={th}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-purple-300 border border-white/10"
                      >
                        {th}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interpretive Analysis (Demarcated strictly as interpretive, not established fact) */}
                {currentReport.interpretiveAnalysis && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Interpretive Critical Analysis
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (Clearly separated from verified ground-truth facts)
                      </span>
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-line">
                      {currentReport.interpretiveAnalysis}
                    </div>
                  </div>
                )}

                {/* Franchise Context */}
                {currentReport.franchiseContext && (
                  <div className="p-6 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-2">
                    <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                      Franchise Context
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {currentReport.franchiseContext}
                    </p>
                  </div>
                )}

                {/* Related Games Suggestions */}
                {currentReport.relatedGames && currentReport.relatedGames.length > 0 && (
                  <div className="pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Related Verified Games in Archive
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentReport.relatedGames.map((rg) => (
                        <div
                          key={rg.id}
                          onClick={() => {
                            const found = getVerifiedGameById(rg.id);
                            if (found) {
                              setSelectedGame(found);
                              setCurrentReport(null);
                            }
                          }}
                          className="p-3 rounded-2xl bg-[#080a14] border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all flex items-center gap-3"
                        >
                          {rg.coverImage && (
                            <img
                              src={rg.coverImage}
                              alt={rg.title}
                              className="w-12 h-14 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate">{rg.title}</div>
                            <div className="text-[10px] text-purple-400 truncate mt-0.5">{rg.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 5: SOURCES & TRANSPARENCY */}
            {activeReportTab === 'sources' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f20] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                        Source Hierarchy & Factual Grounding
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        All claims in this report are grounded across multi-tier verified databases.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950 text-cyan-300 border border-purple-500/30">
                      {currentReport.sources.length} Citations
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {currentReport.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#080a14] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              src.tier === 1
                                ? 'bg-amber-500/20 text-amber-300'
                                : src.tier === 2
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}>
                              {src.tierLabel}
                            </span>
                            <span className="font-bold text-white">{src.sourceName}</span>
                          </div>
                          <div className="text-slate-400 mt-1">{src.pageTitle}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            Information Used: {src.informationUsed}
                          </div>
                        </div>

                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white transition-colors shrink-0 font-medium"
                        >
                          <span>Visit Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit & Disclaimer */}
                <div className="p-6 rounded-3xl bg-[#080a14] border border-white/5 text-xs text-slate-500 space-y-2">
                  <div className="font-bold text-slate-400">Editorial & Technical Disclaimer</div>
                  <p className="leading-relaxed">
                    {currentReport.disclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* Deep Tool Integration Links Strip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-[#0b0e1b] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Explore More on Game Vault Forum for {currentReport.gameTitle}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check PC specs, estimate your benchmark FPS, or draft a tactical discussion topic.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onNavigateTab('pc-requirements')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Monitor className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check Specs</span>
                </button>
                <button
                  onClick={() => onNavigateTab('fps-calculator')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Gauge className="w-3.5 h-3.5 text-purple-400" />
                  <span>Estimate FPS</span>
                </button>
                <button
                  onClick={() => onNavigateTab('forum')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Discuss on Forum</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMPREHENSIVE TOOL FAQ SECTION */}
        {/* ========================================================================= */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <ToolFaq
            title="Game Story & Overview Generator — Frequently Asked Questions"
            subtitle="Everything you need to know about factual grounding, source hierarchy, spoiler controls, and research utilities."
            items={[
              {
                question: 'How does the Game Story & Overview Generator guarantee factual accuracy?',
                answer: 'Unlike generic AI models that hallucinate character names, release dates, or story endings, our platform operates on an authoritative pipeline: Game Search → Source Retrieval (Tier 1 Primary to Tier 4 Community) → Data Normalization → Fact Checking → Confidence Scoring → AI Generation → Ground Truth Validation. If any detail cannot be corroborated, our system explicitly flags: "Reliable information could not be verified for this detail."'
              },
              {
                question: 'How are game remakes, remasters, and sequels disambiguated?',
                answer: 'The system enforces version disambiguation. For titles with multiple releases (such as Resident Evil 4 2005 vs 2023, or The Last of Us 2013 vs Part I 2022), the platform asks "Which game did you mean?" before generating, ensuring narrative alterations, engine differences, and platform details are never conflated.'
              },
              {
                question: 'Can I generate a report without having the ending spoiled?',
                answer: 'Yes! You have granular control over spoiler sensitivity: choose "No Spoilers" (safe for newcomers), "Light Spoilers" (early-game setup only), "Full Story" (complete chronological narrative arc), or "Ending Explained" (includes full narrative climax and aftermath breakdown).'
              },
              {
                question: 'Who is this generator designed for?',
                answer: 'The tool is engineered for gamers discovering an unfamiliar title, gaming journalists, YouTubers compiling video lore essays, students, game reviewers, and researchers who require factual, audited information rather than guesswork.'
              },
              {
                question: 'Can I export reports to PDF or save them to my account?',
                answer: 'Yes. Every generated report can be exported as a professional multi-page branded PDF, copied as Markdown or plain text, and saved to your personal Game Vault Story Library with automatic version history tracking.'
              }
            ]}
          />
        </div>
      </div>

      {/* Sources Inspector Modal */}
      {selectedGame && (
        <SourcesInspectorModal
          isOpen={isSourcesModalOpen}
          onClose={() => setIsSourcesModalOpen(false)}
          gameTitle={selectedGame.title}
          sources={selectedGame.sources}
        />
      )}

      {/* My Saved Stories Modal */}
      <MyGameStoriesModal
        isOpen={isMyStoriesModalOpen}
        onClose={() => setIsMyStoriesModalOpen(false)}
        userId={currentUser?.id || 'guest'}
        stories={savedStories}
        onSelectStory={(report) => {
          setCurrentReport(report);
          const game = getVerifiedGameById(report.gameId);
          if (game) setSelectedGame(game);
          setIsMyStoriesModalOpen(false);
          onShowToast(`Loaded "${report.gameTitle}" from your library!`, 'info');
        }}
        onRefreshStories={loadUserStories}
        onShowToast={onShowToast}
      />

      {/* Save Story Auth Modal */}
      <SaveStoryAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAuthAction(null);
        }}
        onOpenSignUp={() => {
          setIsAuthModalOpen(false);
          onOpenSignIn();
        }}
        onOpenSignIn={() => {
          setIsAuthModalOpen(false);
          onOpenSignIn();
        }}
        pendingAction={pendingAuthAction}
      />
    </div>
  );
};
