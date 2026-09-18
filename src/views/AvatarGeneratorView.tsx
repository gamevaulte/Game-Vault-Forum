import React, { useState, useRef, useEffect } from 'react';
import { 
  AvatarConfig, 
  AvatarPreset, 
  SavedAvatar 
} from '../types/avatar';
import { 
  DEFAULT_AVATAR_CONFIG, 
  AVATAR_PRESETS, 
  generateRandomAvatarConfig,
  interpretNaturalLanguageAvatarPrompt
} from '../data/avatarData';
import { AvatarRenderer, AvatarRendererRef } from '../components/avatar/AvatarRenderer';
import { AvatarEditorControls } from '../components/avatar/AvatarEditorControls';
import { updatePageSeo, CANONICAL_BASE_URL } from '../lib/seo';
import { saveUserAvatarToFirestore, getUserSavedAvatarsFromFirestore } from '../lib/firebase';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Dice5, 
  RotateCcw, 
  Save, 
  Bot, 
  Check, 
  Copy, 
  Trash2, 
  Bookmark, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Gamepad2, 
  Compass, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface AvatarGeneratorViewProps {
  onNavigate: (tab: string, path?: string) => void;
  currentUser?: any;
  onOpenSignIn?: () => void;
}

export const AvatarGeneratorView: React.FC<AvatarGeneratorViewProps> = ({
  onNavigate,
  currentUser,
  onOpenSignIn
}) => {
  const [config, setConfig] = useState<AvatarConfig>(() => {
    // Check if URL has shared parameters or config
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encoded = urlParams.get('avatar') || urlParams.get('config');
        if (encoded) {
          const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded))));
          return { ...DEFAULT_AVATAR_CONFIG, ...parsed };
        }
        const presetId = urlParams.get('preset');
        if (presetId) {
          const found = AVATAR_PRESETS.find(p => p.id === presetId);
          if (found) return { ...found.config };
        }
      } catch (err) {
        console.debug('Failed to decode avatar from URL parameter:', err);
      }
    }
    return { ...DEFAULT_AVATAR_CONFIG };
  });

  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [avatarNameInput, setAvatarNameInput] = useState('');
  const [savedAvatars, setSavedAvatars] = useState<SavedAvatar[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gamevault_saved_avatars');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  });

  // AI Prompt Mode State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuccessNote, setAiSuccessNote] = useState('');

  const rendererRef = useRef<AvatarRendererRef | null>(null);

  // Set Page SEO & WebApplication Schema
  useEffect(() => {
    updatePageSeo({
      title: 'Game Avatar Generator — Create Your Gaming Avatar',
      description: 'Create a unique gaming avatar with the Game Vault Forum Avatar Generator. Customize your character, outfit, colors, accessories and gaming style.',
      canonicalPath: '/game-avatar-generator',
      schemaType: 'WebPage',
      schemaData: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Game Vault Forum Avatar Generator',
        url: `${CANONICAL_BASE_URL}/game-avatar-generator`,
        description: 'Interactive gaming avatar generator with customizable hairstyles, cyberpunk armor, tactical headsets, dynamic backgrounds, and high-resolution PNG/WebP exports.',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript and HTML5 Canvas',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      },
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Gaming Tools', path: '/tools' },
        { name: 'Game Avatar Generator', path: '/game-avatar-generator' }
      ]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save to local storage whenever savedAvatars change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gamevault_saved_avatars', JSON.stringify(savedAvatars));
      } catch {
        // ignore
      }
    }
  }, [savedAvatars]);

  // Sync cloud-saved avatars for registered user
  useEffect(() => {
    const userUid = currentUser?.uid || currentUser?.id;
    if (userUid) {
      getUserSavedAvatarsFromFirestore(userUid).then((cloudAvatars) => {
        if (cloudAvatars && cloudAvatars.length > 0) {
          setSavedAvatars(prev => {
            const map = new Map<string, SavedAvatar>();
            [...cloudAvatars, ...prev].forEach(a => map.set(a.id, a));
            return Array.from(map.values());
          });
        }
      }).catch(err => console.warn('Cloud avatars sync note:', err));
    }
  }, [currentUser]);

  const handleConfigChange = (updated: Partial<AvatarConfig>) => {
    setConfig(prev => ({ ...prev, ...updated }));
  };

  const handleRandomize = () => {
    const randomized = generateRandomAvatarConfig();
    setConfig(randomized);
  };

  const handleReset = () => {
    setConfig({ ...DEFAULT_AVATAR_CONFIG });
  };

  const handleSelectPreset = (preset: AvatarPreset) => {
    setConfig({ ...preset.config });
  };

  // Export Download
  const handleDownload = async () => {
    if (!rendererRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await rendererRef.current.exportAvatar(
        downloadFormat, 
        downloadSize, 
        config.isTransparentBg
      );

      const link = document.createElement('a');
      const ext = downloadFormat === 'jpeg' ? 'jpg' : downloadFormat;
      const cleanName = (config.name || 'game-avatar').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.download = `${cleanName}-${downloadSize}x${downloadSize}.${ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Avatar export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Share Link
  const handleCopyShareLink = () => {
    try {
      const serializableConfig = { ...config };
      delete serializableConfig.id;
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(serializableConfig))));
      const shareUrl = `${CANONICAL_BASE_URL}/game-avatar-generator?avatar=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Failed to generate share link:', err);
    }
  };

  // Save Avatar to History & Profile - Restricted to Registered/Signed In Users
  const handleSaveAvatar = async () => {
    if (!currentUser) {
      if (onOpenSignIn) {
        onOpenSignIn();
      }
      return;
    }

    if (!rendererRef.current) return;
    const avatarName = avatarNameInput.trim() || `Gamer Avatar #${savedAvatars.length + 1}`;
    try {
      const previewDataUrl = await rendererRef.current.exportAvatar('png', 256, false);
      const userUid = currentUser.uid || currentUser.id || 'user';
      const newSaved: SavedAvatar = {
        id: `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: avatarName,
        config: { ...config, name: avatarName },
        previewDataUrl,
        createdAt: new Date().toISOString(),
        userId: userUid,
        authorName: currentUser.displayName || currentUser.name || 'Operative'
      };

      setSavedAvatars(prev => [newSaved, ...prev]);
      setAvatarNameInput('');
      setShowSavedModal(true);

      // Persist to user's saved avatars in Firestore
      try {
        await saveUserAvatarToFirestore(userUid, newSaved);
      } catch (err) {
        console.warn('Firestore saveUserAvatar note:', err);
      }
    } catch (err) {
      console.error('Failed to save avatar:', err);
    }
  };

  const handleDeleteSavedAvatar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAvatars(prev => prev.filter(a => a.id !== id));
  };

  const handleLoadSavedAvatar = (saved: SavedAvatar) => {
    setConfig({ ...saved.config });
    setShowSavedModal(false);
  };

  // AI Prompt Generation Flow
  const handleGenerateFromAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiGenerating(true);
    setAiSuccessNote('');

    try {
      // First try server-side AI interpretation endpoint
      const response = await fetch('/api/avatar/ai-interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config }));
          setAiSuccessNote(data.message || 'Original gaming character generated successfully!');
          setIsAiGenerating(false);
          return;
        }
      }

      // If server endpoint unavailable or offline, use smart client-side natural language parser
      const parsedConfig = interpretNaturalLanguageAvatarPrompt(aiPrompt);
      setConfig(parsedConfig);
      setAiSuccessNote('Original character synthesized based on your description.');
    } catch (err) {
      console.debug('AI generation server note, applying client parser:', err);
      const parsedConfig = interpretNaturalLanguageAvatarPrompt(aiPrompt);
      setConfig(parsedConfig);
      setAiSuccessNote('Original character synthesized based on your description.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 pb-20">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumbs" className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-400">
          <button 
            type="button"
            onClick={() => onNavigate('home', '/')}
            className="hover:text-cyan-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button 
            type="button"
            onClick={() => onNavigate('tools', '/tools')}
            className="hover:text-cyan-400 transition-colors"
          >
            Gaming Tools
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-400 font-medium">Game Avatar Generator</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 flex flex-col gap-10">
        {/* Header Section */}
        <header className="flex flex-col gap-3 text-center sm:text-left border-b border-slate-800/80 pb-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Game Utility Hub
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider border border-purple-500/20">
              No Account Required
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Game Avatar Generator
          </h1>
          <p className="text-base sm:text-lg text-cyan-400 font-medium">
            Create your own unique gaming avatar.
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Customize your gaming avatar by choosing your character style, appearance, outfit, colors, accessories, background and gaming personality. Download high-resolution PNG, JPG, or WebP profile images ready for Discord, Steam, YouTube, and Game Vault Forum.
          </p>
        </header>

        {/* Core Generator Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Preview & Action Deck */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky lg:top-28">
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden">
              {/* Ready Badge */}
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Your Gaming Avatar Is Ready!
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowSavedModal(true)}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>My Avatars ({savedAvatars.length})</span>
                  </button>
                </div>
              </div>

              {/* Avatar Live Renderer Frame */}
              <div className="p-2 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                <AvatarRenderer
                  ref={rendererRef}
                  config={config}
                  size={320}
                  className="shadow-2xl"
                />
              </div>

              {/* Quick Preset Badges under avatar */}
              <div className="w-full flex items-center justify-between text-xs px-2 text-slate-400">
                <span className="capitalize font-medium text-slate-300">
                  {config.style} Style • {config.outfit.replace('-', ' ')}
                </span>
                <span className="capitalize text-cyan-400">
                  {config.gamingPersonality.replace('-', ' ')}
                </span>
              </div>

              {/* Quick Actions Row */}
              <div className="w-full grid grid-cols-2 gap-2.5 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-98 border border-slate-700"
                >
                  <Dice5 className="w-4 h-4 text-cyan-400" />
                  <span>Randomize Style</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all active:scale-98 border border-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Download & Export Configuration Section */}
              <div className="w-full flex flex-col gap-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Export Settings
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {downloadSize} × {downloadSize} px
                  </span>
                </div>

                {/* Resolution & Format Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                    {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setDownloadFormat(fmt)}
                        className={`flex-1 py-1 text-xs uppercase font-bold rounded-md transition-all ${
                          downloadFormat === fmt
                            ? 'bg-cyan-500 text-slate-950'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {fmt === 'jpeg' ? 'JPG' : fmt}
                      </button>
                    ))}
                  </div>

                  <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                    {([512, 1024] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDownloadSize(s)}
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                          downloadSize === s
                            ? 'bg-cyan-500 text-slate-950'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {s}p
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Generating Image...' : 'Download Avatar'}</span>
                </button>

                {/* Share Link & Save Deck */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAvatar}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5 text-purple-400" />
                    <span>Save to History</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feeling Random Callout Box */}
            <div className="w-full bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
                  Feeling Random?
                </span>
                <span className="text-[11px] text-slate-400">
                  Let the Gaming Randomizer choose your avatar style.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRandomize}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all active:scale-95"
              >
                Roll Avatar
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <AvatarEditorControls
              config={config}
              onChange={handleConfigChange}
              onRandomize={handleRandomize}
              onSelectPreset={handleSelectPreset}
              onOpenAiMode={() => setShowAiModal(true)}
            />
          </div>
        </div>

        {/* Educational Content & Guides Section */}
        <section className="border-t border-slate-800/80 pt-12 flex flex-col gap-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Gaming Avatar Guide & Platform Best Practices
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to know about customizing, formatting, and using your gaming avatar across communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guide Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">What Is a Gaming Avatar?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A gaming avatar is your digital persona and visual identity across multiplayer games, esports leaderboards, streaming channels, and gaming forums. A distinctive avatar communicates your playstyle, favorite genres, and community status at a single glance.
              </p>
            </div>

            {/* Guide Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">How to Create a Gaming Avatar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Start by picking an aesthetic like Cyberpunk, Fantasy, or Esports. Select facial traits and your preferred skin tone, equip tactical headsets or neon shades, fine-tune RGB lighting conduits, and choose an immersive gaming room or space station background.
              </p>
            </div>

            {/* Guide Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Where Can I Use My Gaming Avatar?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our exports are formatted at 512×512 and 1024×1024 to fit Discord profiles, Steam avatars, Twitch streamer icons, YouTube gaming channel branding, Game Vault Forum member profiles, and social media handles seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Related Gaming Tools Section */}
        <section className="border-t border-slate-800/80 pt-10 pb-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-white">Explore More Gaming Utilities</h3>
              <p className="text-xs text-slate-400">Enhance your gaming setup and decision-making on Game Vault Forum.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tools', '/tools')}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <span>View All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => onNavigate('game-picker-wheel', '/game-picker-wheel')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">Game Picker Wheel</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Wheel</span>
              </div>
              <p className="text-xs text-slate-400">Spin the wheel to decide what game to play next from your backlog.</p>
            </div>

            <div 
              onClick={() => onNavigate('tools', '/tools/gaming-username-generator')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">Username Generator</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Gamertags</span>
              </div>
              <p className="text-xs text-slate-400">Generate creative handles and gamertags tailored to your gaming genre.</p>
            </div>

            <div 
              onClick={() => onNavigate('tools', '/tools/gaming-pc-builder')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">Gaming PC Builder</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">Hardware</span>
              </div>
              <p className="text-xs text-slate-400">Interactive custom rig builder with socket compatibility and dual pricing.</p>
            </div>

            <div 
              onClick={() => onNavigate('tools', '/tools/vault-ai')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">Vault AI Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">AI Copilot</span>
              </div>
              <p className="text-xs text-slate-400">Ask hardware, gameplay strategy, and performance questions in real time.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Saved Avatars Modal Drawer */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">My Saved Avatars</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {savedAvatars.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            {savedAvatars.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                <p className="text-sm text-slate-400">No saved avatars yet.</p>
                <p className="text-xs text-slate-500">Click &quot;Save to History&quot; on the editor to store your custom designs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1">
                {savedAvatars.map((saved) => (
                  <div
                    key={saved.id}
                    onClick={() => handleLoadSavedAvatar(saved)}
                    className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col items-center gap-2 relative group text-center"
                  >
                    {saved.previewDataUrl ? (
                      <img 
                        src={saved.previewDataUrl} 
                        alt={saved.name} 
                        className="w-24 h-24 rounded-xl object-cover shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                        <Gamepad2 className="w-8 h-8" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-200 truncate w-full">
                      {saved.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {saved.config.style}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSavedAvatar(saved.id, e)}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-opacity"
                      title="Delete Saved Avatar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Avatar Mode Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">AI Avatar Creator</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Original Characters
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your desired avatar in natural language. Our AI engine safely interprets your prompt into an original character with matched gear, style, and lighting.
            </p>

            <form onSubmit={handleGenerateFromAiPrompt} className="flex flex-col gap-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., I want a futuristic cyberpunk hacker with a black tech hoodie, blue neon lighting and glowing cyber visor in a neon city..."
                rows={4}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none text-xs text-slate-200 placeholder-slate-500 resize-none"
              />

              {aiSuccessNote && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{aiSuccessNote}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60"
                >
                  Done
                </button>
                <button
                  type="submit"
                  disabled={isAiGenerating || !aiPrompt.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {isAiGenerating ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                  <span>{isAiGenerating ? 'Creating Avatar...' : 'Generate Avatar'}</span>
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generates original characters. Avoids copying copyrighted figures or real likenesses.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
