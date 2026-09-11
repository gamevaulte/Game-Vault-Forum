import { VaultAiConversation, VaultAiMessage, VaultAiContext, VaultAiAction } from '../types';

const STORAGE_KEY_CONVERSATIONS = 'gv_vault_ai_conversations_v1';
const STORAGE_KEY_ACTIVE_ID = 'gv_vault_ai_active_id_v1';
const STORAGE_KEY_USAGE = 'gv_vault_ai_usage_v1';

export const GUEST_DAILY_LIMIT = 20;

export interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getGuestDailyUsage(): DailyUsage {
  if (typeof window === 'undefined') return { date: getTodayDateString(), count: 0 };
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USAGE);
    if (raw) {
      const parsed: DailyUsage = JSON.parse(raw);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse Vault AI usage', e);
  }
  return { date: today, count: 0 };
}

export function incrementGuestDailyUsage(): DailyUsage {
  const usage = getGuestDailyUsage();
  usage.count += 1;
  try {
    localStorage.setItem(STORAGE_KEY_USAGE, JSON.stringify(usage));
  } catch (e) {
    console.warn('Failed to save Vault AI usage', e);
  }
  return usage;
}

export function getStoredConversations(): VaultAiConversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load Vault AI conversations', e);
  }

  // Initial starter conversation
  const initial = createNewConversation('Welcome to Vault AI');
  initial.messages.push({
    id: 'msg-welcome-01',
    role: 'assistant',
    content: `### Meet Vault AI — Your Intelligent Gaming Companion

Welcome to **Vault AI**, built specifically for **Game Vault Forum**! I am here to help you discover great games, compare titles, troubleshoot hardware & frame drops, configure PC builds, and navigate the Game Vault ecosystem.

**What can I help you with today?**
- 🎮 **Game Discovery**: Ask for recommendations based on your favorite genre, platform, or playtime.
- 🖥️ **PC Hardware**: Ask for component advice, 1080p/1440p/4K builds, or GPU comparisons.
- 🔧 **FPS & Performance Diagnostics**: Walk through our 12-point low FPS troubleshooting checklist.
- ⚔️ **Game Guides & Lore**: Ask for tactics, boss progression, or armor angling tips in World of Warships.
- 📺 **Channel Content**: Search official Game Vault video deep dives and published reviews.

*Select one of the quick suggestions below or type your gaming question!*`,
    timestamp: new Date().toISOString(),
    sources: [
      { title: 'Game Vault Forum — Gaming Tools Hub', url: '/tools' },
      { title: 'Game Vault Forum — PC Requirements Checker', url: '/tools/pc-game-requirements-checker' },
    ],
  });

  saveAllConversations([initial]);
  return [initial];
}

export function saveAllConversations(conversations: VaultAiConversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
  } catch (e) {
    console.warn('Failed to save Vault AI conversations', e);
  }
}

export function getActiveConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
}

export function setActiveConversationId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
}

export function createNewConversation(title = 'New Conversation'): VaultAiConversation {
  const newConv: VaultAiConversation = {
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
  return newConv;
}

export async function sendVaultAiMessage(params: {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: VaultAiContext;
}): Promise<{
  reply: string;
  sources: Array<{ title: string; url: string; category?: string }>;
  cardIds: {
    games?: string[];
    articles?: string[];
    videos?: string[];
    hardware?: string[];
  };
  actions?: VaultAiAction[];
  modelUsed?: string;
}> {
  try {
    const res = await fetch('/api/vault-ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: params.message,
        history: params.history || [],
        context: params.context || {},
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || 'Vault AI did not return a response.',
      sources: data.sources || [],
      cardIds: data.cardIds || { games: [], articles: [], videos: [], hardware: [] },
      actions: data.actions || [],
      modelUsed: data.modelUsed,
    };
  } catch (err) {
    console.warn('Vault AI API request failed, using local fallback:', err);
    // Return friendly resilient response with assistive actions
    return {
      reply: `### Vault AI Notification

Vault AI is currently operating in offline resilience mode. 

*Tip*: You can explore our verified database tools directly on Game Vault Forum:
- [PC Game Requirements Checker](/tools/pc-game-requirements-checker)
- [Gaming PC Builder](/tools/gaming-pc-builder)
- [Gaming Username Generator](/tools/gaming-username-generator)
- [Game Catalog & Reviews](/games)`,
      sources: [
        { title: 'Game Vault Forum — Tools Hub', url: '/tools' },
      ],
      cardIds: { games: ['elden-ring', 'world-of-warships'], articles: ['art-1'], videos: ['vid-1'], hardware: [] },
      actions: [
        { id: 'act-fall-1', type: 'requirements', label: 'Check PC Game Requirements', target: 'elden-ring' },
        { id: 'act-fall-2', type: 'navigate', label: 'Open Gaming PC Builder', target: '/tools/gaming-pc-builder' },
        { id: 'act-fall-3', type: 'navigate', label: 'Generate Gamer Tag', target: '/tools/gaming-username-generator' }
      ],
      modelUsed: 'client-offline-fallback',
    };
  }
}

export const SMART_SUGGESTION_PROMPTS = [
  { label: 'Check Can I Run It', icon: '🖥️', prompt: 'Can my PC run Elden Ring and Cyberpunk 2077? What GPU/CPU specs do I need for solid 60 FPS?' },
  { label: 'Build PC Rig ($1,200)', icon: '💻', prompt: 'Configure a balanced 1440p gaming PC for $1,200 / ₦1,800,000. Recommend exact parts and power supply.' },
  { label: 'Fix Low FPS & Stutter', icon: '🔧', prompt: 'My game is running at low FPS with micro-stuttering. Guide me through the 12-point troubleshooting checklist.' },
  { label: 'Find Best Game For Me', icon: '🎮', prompt: 'Recommend 3 awesome games from the Game Vault catalog based on rich story, tactical depth, and high reviews.' },
  { label: 'Generate Gamertags', icon: '🏷️', prompt: 'Generate 6 badass cyberpunk and tactical gaming usernames for my new profile.' },
  { label: 'World of Warships Tactics', icon: '⚔️', prompt: 'Give me the top armor angling and artillery penetration tips for battleships in World of Warships.' },
  { label: 'Draft a Forum Topic', icon: '📝', prompt: 'Help me draft an engaging discussion topic for the Game Vault Forum asking about GPU upgrade paths for 2026.' },
  { label: 'Explore Site Map & Tools', icon: '🗺️', prompt: 'What tools and directories are available on Game Vault Forum? Give me an assistive overview with links.' },
];
