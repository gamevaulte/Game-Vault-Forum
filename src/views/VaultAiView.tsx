import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Send, 
  Square, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Wrench, 
  Monitor, 
  Gamepad2, 
  HelpCircle, 
  Settings, 
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  Cpu
} from 'lucide-react';
import { PageTab, UserAccount, VaultAiConversation, VaultAiMessage, VaultAiAction } from '../types';
import { 
  getStoredConversations, 
  saveAllConversations, 
  createNewConversation,
  sendVaultAiMessage,
  getGuestDailyUsage,
  incrementGuestDailyUsage,
  GUEST_DAILY_LIMIT,
  SMART_SUGGESTION_PROMPTS
} from '../services/vaultAiService';
import { VaultAiMessageBubble } from '../components/ai/VaultAiMessageBubble';
import { ToolHeader } from '../components/tools/ToolHeader';
import { navigateTo } from '../lib/router';

interface VaultAiViewProps {
  onNavigateTab: (tab: PageTab) => void;
  user: UserAccount;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  initialPrompt?: string;
}

export const VaultAiView: React.FC<VaultAiViewProps> = ({
  onNavigateTab,
  user,
  isSignedIn = false,
  onOpenSignIn,
  initialPrompt
}) => {
  // Conversation state
  const [conversations, setConversations] = useState<VaultAiConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminStatus, setAdminStatus] = useState<any>(null);
  const [dailyUsage, setDailyUsage] = useState(getGuestDailyUsage());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize conversations
  useEffect(() => {
    const loaded = getStoredConversations();
    setConversations(loaded);
    if (loaded.length > 0) {
      setActiveConvId(loaded[0].id);
    }
  }, []);

  // Handle initial prompt if passed via router
  useEffect(() => {
    if (initialPrompt && conversations.length > 0 && !isGenerating) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Current active conversation
  const activeConversation = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isGenerating]);

  // Handle Auto-Resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handleNewConversation = () => {
    const newConv = createNewConversation(`Chat #${conversations.length + 1}`);
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConvId(newConv.id);
    saveAllConversations(updated);
    setInputMessage('');
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      // Clear messages instead of deleting the only one
      const reset = createNewConversation('New Conversation');
      setConversations([reset]);
      setActiveConvId(reset.id);
      saveAllConversations([reset]);
      return;
    }

    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeConvId === id) {
      setActiveConvId(filtered[0].id);
    }
    saveAllConversations(filtered);
  };

  const handleStartEditTitle = (conv: VaultAiConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(conv.id);
    setEditTitleText(conv.title);
  };

  const handleSaveTitle = (id: string) => {
    if (!editTitleText.trim()) {
      setEditingTitleId(null);
      return;
    }
    const updated = conversations.map(c => 
      c.id === id ? { ...c, title: editTitleText.trim() } : c
    );
    setConversations(updated);
    saveAllConversations(updated);
    setEditingTitleId(null);
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isGenerating) return;

    // Check guest usage
    const isGuest = !isSignedIn;
    if (isGuest && dailyUsage.count >= GUEST_DAILY_LIMIT) {
      if (activeConversation) {
        const limitMsg: VaultAiMessage = {
          id: `limit_${Date.now()}`,
          role: 'assistant',
          content: `You have reached your daily guest query limit of **${GUEST_DAILY_LIMIT} queries**. Please sign in or register to unlock unlimited, priority Vault AI access!`,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        const updated = conversations.map(c => 
          c.id === activeConversation.id 
            ? { ...c, messages: [...c.messages, limitMsg] }
            : c
        );
        setConversations(updated);
        saveAllConversations(updated);
      }
      return;
    }

    // User Message
    const userMsg: VaultAiMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    let targetConvId = activeConvId;
    let targetConversations = [...conversations];

    if (!activeConversation) {
      const created = createNewConversation(text.slice(0, 32));
      targetConvId = created.id;
      targetConversations = [created, ...targetConversations];
    }

    // Update conversation state with user message
    const withUserMsg = targetConversations.map(c => {
      if (c.id === targetConvId) {
        const isFirst = c.messages.length === 0;
        return {
          ...c,
          title: isFirst ? text.slice(0, 28) : c.title,
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, userMsg],
        };
      }
      return c;
    });

    setConversations(withUserMsg);
    setActiveConvId(targetConvId);
    setInputMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsGenerating(true);

    if (isGuest) {
      const newUsage = incrementGuestDailyUsage();
      setDailyUsage(newUsage);
    }

    try {
      const activeOne = withUserMsg.find(c => c.id === targetConvId);
      const history = (activeOne?.messages || []).slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendVaultAiMessage({
        message: text,
        history,
        context: {
          currentPage: 'vault-ai',
        },
      });

      const aiMsg: VaultAiMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        sources: res.sources,
        cardIds: res.cardIds,
        actions: res.actions,
        timestamp: new Date().toISOString(),
      };

      const withAiMsg = withUserMsg.map(c => 
        c.id === targetConvId 
          ? { ...c, updatedAt: new Date().toISOString(), messages: [...c.messages, aiMsg] }
          : c
      );

      setConversations(withAiMsg);
      saveAllConversations(withAiMsg);
    } catch (err) {
      console.error('Vault AI Chat Error', err);
      const errorMsg: VaultAiMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'Vault AI is temporarily unavailable. Please try again shortly.',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      const withError = withUserMsg.map(c => 
        c.id === targetConvId 
          ? { ...c, messages: [...c.messages, errorMsg] }
          : c
      );
      setConversations(withError);
      saveAllConversations(withError);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecuteAction = (action: VaultAiAction) => {
    if (action.type === 'quick_task') {
      handleSendMessage(action.target);
      return;
    }

    if (action.type === 'navigate') {
      if (action.target.startsWith('/')) {
        navigateTo(action.target);
      } else {
        onNavigateTab(action.target as any);
      }
    } else if (action.type === 'requirements') {
      if (action.target) {
        navigateTo(`/tools/pc-game-requirements-checker/${action.target}`);
      } else {
        onNavigateTab('pc-requirements');
      }
    } else if (action.type === 'pc_build') {
      navigateTo('/tools/gaming-pc-builder');
    } else if (action.type === 'generate_tag') {
      navigateTo('/tools/gaming-username-generator');
    } else if (action.type === 'topic') {
      navigateTo('/forum/new');
    } else if (action.type === 'search') {
      onNavigateTab('forum');
    } else if (action.target.startsWith('/')) {
      navigateTo(action.target);
    }
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length < 2) return;
    const lastUserIndex = [...activeConversation.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;
    const realIndex = activeConversation.messages.length - 1 - lastUserIndex;
    const lastUserMsg = activeConversation.messages[realIndex];

    // Remove any assistant responses after this user message
    const trimmed = activeConversation.messages.slice(0, realIndex);
    const updated = conversations.map(c => 
      c.id === activeConversation.id ? { ...c, messages: trimmed } : c
    );
    setConversations(updated);
    saveAllConversations(updated);

    handleSendMessage(lastUserMsg.content);
  };

  const handleFetchAdminStatus = async () => {
    try {
      const res = await fetch('/api/vault-ai/admin-status');
      const data = await res.json();
      setAdminStatus(data);
      setShowAdminModal(true);
    } catch (e) {
      console.warn('Failed to fetch admin status', e);
      setAdminStatus({
        status: 'online',
        assistantName: 'Vault AI',
        primaryModel: 'gemini-3.8-flash',
        fallbackModel: 'gemini-3.1-flash-lite',
        knowledgeBase: { gamesIndexed: 8, articlesIndexed: 7, hardwareComponents: 32 },
      });
      setShowAdminModal(true);
    }
  };

  // Example assistive task starter queries
  const ASSISTIVE_STARTER_PROMPTS = [
    {
      title: 'Can My PC Run It?',
      desc: 'Check CPU & GPU hardware compatibility for Cyberpunk 2077 or Elden Ring',
      prompt: 'Check if my PC can run Cyberpunk 2077. What are the minimum and recommended specs, and what hardware do I need for smooth 60 FPS?'
    },
    {
      title: 'Build Gaming PC ($1,200)',
      desc: 'Formulate an optimized 1440p gaming setup with parts and wattage check',
      prompt: 'Help me plan a balanced 1440p gaming PC build under $1,200 / ₦1,800,000. Recommend exact CPU, GPU, RAM, and PSU pairings.'
    },
    {
      title: 'Diagnose Low FPS & Stutter',
      desc: 'Run through the 12-point PC performance and frame pacing checklist',
      prompt: 'My game is experiencing frame drops and micro-stuttering. Help me diagnose the bottleneck using the 12-point checklist.'
    },
    {
      title: 'Recommend Top Games',
      desc: 'Curate titles matching your genre, gameplay style, and playtime budget',
      prompt: 'Recommend 3 top games from the Game Vault catalog based on rich storytelling, tactical gameplay, and verified ratings.'
    },
    {
      title: 'World of Warships Tactics',
      desc: 'Get tactical armor angling, artillery penetration, and positioning tips',
      prompt: 'Give me the top armor angling and penetration tactics for battleships in World of Warships.'
    },
    {
      title: 'Generate Gamer Tags',
      desc: 'Create unique, badass gaming usernames and squad aliases',
      prompt: 'Generate 6 badass cyberpunk and tactical gamer usernames for my profile.'
    },
    {
      title: 'Draft Forum Topic',
      desc: 'Create an engaging discussion thread for Game Vault Forum',
      prompt: 'Draft an engaging forum discussion post comparing mid-range GPUs (RTX 4070 vs RX 7800 XT) for 1440p gaming.'
    },
    {
      title: 'Explore Site & Tools',
      desc: 'Navigate Game Vault guides, calculators, and reviews',
      prompt: 'What tools, guides, and directories are available on Game Vault Forum? Give me an assistive overview with quick action links.'
    },
  ];

  // 9 Transparent FAQs
  const FAQ_ITEMS = [
    {
      q: 'What is Vault AI?',
      a: 'Vault AI is the official AI gaming assistant built natively for Game Vault Forum. It combines large language model intelligence with Game Vault\'s verified database of game reviews, PC hardware compatibility specifications, YouTube video guides, and community discussions.'
    },
    {
      q: 'What can Vault AI help me with?',
      a: 'Vault AI can recommend games tailored to your preferences, analyze system requirements, configure custom PC builds within your budget, troubleshoot low FPS and stuttering, break down complex gameplay mechanics, compare titles side-by-side, and direct you to relevant Game Vault articles and videos.'
    },
    {
      q: 'Can Vault AI recommend games?',
      a: 'Yes! Vault AI recommends games based on platform, genre, budget, multiplayer or single-player preference, narrative depth, difficulty, and playtime. Whenever possible, it recommends titles directly indexed with verified ratings from the Game Vault catalog.'
    },
    {
      q: 'Can Vault AI check if my PC can run a game?',
      a: 'Yes. Vault AI is connected to Game Vault\'s PC Game Requirements Checker database. You can provide your CPU, GPU, and RAM, and it will analyze minimum and recommended benchmarks, highlighting potential hardware bottlenecks.'
    },
    {
      q: 'Can Vault AI help build a gaming PC?',
      a: 'Yes. Vault AI integrates directly with Game Vault\'s Gaming PC Builder tool. It balances CPU and GPU pairings, verifies socket and power compatibility, and recommends optimized parts in USD ($) and Nigerian Naira (₦).'
    },
    {
      q: 'Can Vault AI troubleshoot low FPS?',
      a: 'Yes. Vault AI uses a structured 12-point diagnostic checklist covering render resolution, heavy graphics presets, GPU utilization, CPU thread bottlenecks, RAM single-channel penalties, VRAM overflow, and thermal throttling.'
    },
    {
      q: 'Does Vault AI know everything about every game?',
      a: 'While Vault AI possesses expansive gaming industry knowledge, it adheres to strict accuracy standards. If reliable data for a very niche or unreleased title is not verified, it will transparently state that reliable information is not yet available rather than hallucinating.'
    },
    {
      q: 'Where does Vault AI get its information?',
      a: 'Vault AI retrieves verified data from Game Vault Forum\'s games database, editorial reviews, technical guides, video channel library, and PC hardware compatibility engines, augmented by server-side Gemini AI intelligence.'
    },
    {
      q: 'Is Vault AI free to use?',
      a: 'Yes! Vault AI is free for all visitors with a daily quota of 20 queries. Registered Game Vault Forum operatives receive unlimited queries, persistent conversation syncing, and custom hardware profiling.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <ToolHeader
        title="Meet Vault AI"
        subtitle="Your intelligent gaming companion for recommendations, game information, PC advice, troubleshooting, and gaming questions."
        breadcrumbs={[{ label: 'Gaming Tools', href: '/tools' }, { label: 'Vault AI' }]}
        icon={<Bot className="w-6 h-6 text-purple-400" />}
      />

      {/* Sub-tagline Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 -mt-4 mb-8 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-300" /> Flagship Assistant
          </span>
          <span className="text-xs text-zinc-300 font-medium">
            Ask. Discover. Compare. Troubleshoot. Play smarter.
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleFetchAdminStatus}
            className="flex items-center gap-1 text-zinc-400 hover:text-purple-300 transition-colors"
            title="System & AI Model Telemetry"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>AI Status</span>
          </button>

          <div className="h-3 w-px bg-white/10" />

          {isSignedIn ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Operative Access: Unlimited
            </span>
          ) : (
            <span className="text-zinc-400">
              Guest Quota:{' '}
              <strong className="text-purple-300">
                {Math.max(0, GUEST_DAILY_LIMIT - dailyUsage.count)}/{GUEST_DAILY_LIMIT}
              </strong>{' '}
              left today
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar + Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 items-start">
        {/* Left Sidebar (Conversations & Shortcuts) */}
        <div className="lg:col-span-3 space-y-4">
          {/* New Chat Button */}
          <button
            onClick={handleNewConversation}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 border border-purple-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Conversations List Card */}
          <div className="rounded-2xl bg-black/40 border border-white/10 p-3 space-y-1.5 backdrop-blur-xl">
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Saved Chats</span>
              <span className="text-zinc-500 font-mono text-[10px]">{conversations.length}</span>
            </div>

            <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
              {conversations.map(conv => {
                const isActive = conv.id === activeConvId;
                const isEditing = editingTitleId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`group relative flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-purple-900/30 text-white border border-purple-500/40 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitleText}
                          onChange={e => setEditTitleText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveTitle(conv.id);
                            if (e.key === 'Escape') setEditingTitleId(null);
                          }}
                          className="bg-black/60 border border-purple-500 rounded px-1.5 py-0.5 text-xs text-white outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveTitle(conv.id)}
                          className="text-emerald-400 hover:text-emerald-300 p-0.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <Bot className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                          <span className="truncate">{conv.title || 'Untitled Conversation'}</span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={e => handleStartEditTitle(conv, e)}
                            className="p-1 hover:text-purple-300 transition-colors"
                            title="Rename"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={e => handleDeleteConversation(conv.id, e)}
                            className="p-1 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Hardware & Tools Shortcuts */}
          <div className="rounded-2xl bg-black/40 border border-white/10 p-3 space-y-2 backdrop-blur-xl">
            <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Connected Tools
            </div>

            <button
              onClick={() => onNavigateTab('pc-requirements')}
              className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 text-xs text-zinc-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-400" />
                <span>PC Requirements Checker</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('gaming-pc-builder')}
              className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 text-xs text-zinc-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-purple-400" />
                <span>Gaming PC Builder</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('gaming-username-generator')}
              className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 text-xs text-zinc-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Username Generator</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('games')}
              className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 text-xs text-zinc-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span>Game Catalog & Reviews</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>

            <button
              onClick={() => onNavigateTab('sitemap')}
              className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 text-xs text-zinc-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Site Directory & Map</span>
              </div>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>
          </div>

          {/* Guest Limit Prompt if not signed in */}
          {!isSignedIn && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-950/40 to-indigo-950/40 border border-purple-500/30 text-xs text-zinc-300 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Unlock Unlimited Queries</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Sign in to save your conversation history across devices and remove the {GUEST_DAILY_LIMIT} query limit.
              </p>
              {onOpenSignIn && (
                <button
                  onClick={onOpenSignIn}
                  className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] transition-colors"
                >
                  Sign In / Register Free
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Chat Interface */}
        <div className="lg:col-span-9 flex flex-col rounded-2xl bg-[#0b0e1a]/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[640px]">
          {/* Chat Header */}
          <div className="p-4 bg-zinc-900/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px]">
                <div className="w-full h-full rounded-[11px] bg-[#0c0f1d] flex items-center justify-center text-purple-300">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">
                    {activeConversation?.title || 'Vault AI Chat'}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Online
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Powered by Gemini 3.8 Flash & Game Vault Verified RAG
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeConversation) {
                    const cleared = conversations.map(c => 
                      c.id === activeConversation.id ? { ...c, messages: [] } : c
                    );
                    setConversations(cleared);
                    saveAllConversations(cleared);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                title="Clear current messages"
              >
                Clear Messages
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[580px]">
            {/* Welcome view when no messages */}
            {(!activeConversation || activeConversation.messages.length === 0) && (
              <div className="py-8 px-4 text-center max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-[1px] mx-auto shadow-xl shadow-purple-900/40">
                  <div className="w-full h-full rounded-[15px] bg-[#0c0f1d] flex items-center justify-center text-purple-300">
                    <Bot className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    How can Vault AI assist your gaming today?
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Ask anything about PC hardware balancing, game recommendations, frame rate fixes, or game lore.
                  </p>
                </div>

                {/* Assistive Task Query Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                  {ASSISTIVE_STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3.5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-purple-950/40 hover:to-indigo-950/30 border border-white/5 hover:border-purple-500/40 text-left group transition-all cursor-pointer shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                          <span>{item.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render conversation messages */}
            {activeConversation?.messages.map((msg, idx) => (
              <VaultAiMessageBubble
                key={msg.id || idx}
                message={msg}
                isLastAssistant={!isGenerating && idx === activeConversation.messages.length - 1 && msg.role === 'assistant'}
                onRegenerate={handleRegenerate}
                userAvatar={user.avatar}
                onExecuteAction={handleExecuteAction}
              />
            ))}

            {/* Generating indicator */}
            {isGenerating && (
              <div className="flex items-center gap-3 my-4">
                <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div className="rounded-2xl px-5 py-3.5 bg-[#121526] border border-purple-500/20 text-xs text-purple-200 flex items-center gap-3 shadow-lg">
                  <span>Vault AI is analyzing game database and synthesizing advice...</span>
                  <button
                    onClick={handleStopGenerating}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] flex items-center gap-1 border border-white/10 transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current text-red-400" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Smart Suggestion Quick Buttons */}
          <div className="px-4 py-2 bg-black/30 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-none">
            {SMART_SUGGESTION_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-purple-900/40 text-zinc-300 hover:text-purple-200 border border-white/5 hover:border-purple-500/30 text-xs whitespace-nowrap flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-zinc-900/90 border-t border-white/10">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2 bg-black/50 border border-white/10 focus-within:border-purple-500/60 rounded-2xl p-2 transition-all"
            >
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleTextareaChange}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask Vault AI anything about gaming..."
                disabled={isGenerating}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 px-3 py-2 outline-none resize-none min-h-[44px] max-h-[180px] disabled:opacity-50"
              />

              <div className="flex items-center gap-1.5 pb-1 pr-1 flex-shrink-0">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="w-9 h-9 rounded-xl bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                    title="Stop Generating"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isGenerating}
                    className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center disabled:opacity-30 disabled:hover:bg-purple-600 transition-all shadow-md shadow-purple-900/30 cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 px-1">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">Shift+Enter</kbd> for newline</span>
              <span>Vault AI checks verified Game Vault database records</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9 Transparent FAQs Section (Section 34 of prompt) */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
          <p className="text-sm text-zinc-400">
            Everything you need to know about Vault AI's capabilities, data grounding, and privacy.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-zinc-900/50 border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-zinc-200 hover:text-white"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Status Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0e1222] border border-purple-500/30 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Vault AI Diagnostic & Telemetry</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-zinc-400">Assistant Status</div>
                  <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Operational
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-zinc-400">Primary AI Model</div>
                  <div className="text-white font-mono font-bold mt-1">gemini-3.8-flash</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="font-semibold text-purple-300">Connected Knowledge Base Sources</div>
                <div className="grid grid-cols-2 gap-2 text-zinc-300">
                  <div>• Games Catalog: <strong>8 titles</strong></div>
                  <div>• Guides & Articles: <strong>7 documents</strong></div>
                  <div>• YouTube Channel: <strong>5 videos</strong></div>
                  <div>• PC Components: <strong>32 verified parts</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="font-semibold text-zinc-300">System Instruction & Safeguards</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Grounds responses in Game Vault data. Enforces anti-hallucination protocols, refuses cheating/hacks, and formats rich interactive cards for Games, Hardware, Articles, and Videos.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
