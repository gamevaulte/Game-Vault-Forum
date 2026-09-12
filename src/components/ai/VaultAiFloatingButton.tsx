import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Maximize2, 
  Send, 
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTab, UserAccount, VaultAiMessage, VaultAiAction } from '../../types';
import { 
  sendVaultAiMessage, 
  getStoredConversations, 
  saveAllConversations,
  getGuestDailyUsage,
  incrementGuestDailyUsage,
  GUEST_DAILY_LIMIT
} from '../../services/vaultAiService';
import { VaultAiMessageBubble } from './VaultAiMessageBubble';
import { navigateTo } from '../../lib/router';

interface VaultAiFloatingButtonProps {
  currentTab: PageTab;
  user?: UserAccount;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  activeGameTitle?: string;
  onNavigateToVaultAi?: () => void;
}

export const VaultAiFloatingButton: React.FC<VaultAiFloatingButtonProps> = ({
  currentTab,
  user,
  isSignedIn = false,
  onOpenSignIn,
  activeGameTitle,
  onNavigateToVaultAi
}) => {
  // If user is already on the dedicated /tools/vault-ai page, hide the floating button
  if (currentTab === 'vault-ai') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<VaultAiMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle action click from bubble inside drawer
  const handleExecuteAction = (action: VaultAiAction) => {
    if (action.type === 'auth') {
      setIsOpen(false);
      onOpenSignIn?.();
      return;
    }

    if (action.type === 'quick_task') {
      handleSend(action.target);
      return;
    }

    setIsOpen(false);
    if (action.type === 'navigate') {
      navigateTo(action.target);
    } else if (action.type === 'requirements') {
      navigateTo(`/tools/pc-game-requirements-checker/${action.target}`);
    } else if (action.type === 'pc_build') {
      navigateTo('/tools/gaming-pc-builder');
    } else if (action.type === 'topic') {
      navigateTo('/forum/new');
    } else if (action.type === 'generate_tag') {
      navigateTo('/tools/gaming-username-generator');
    } else if (action.type === 'search') {
      navigateTo('/forum');
    } else if (action.target.startsWith('/')) {
      navigateTo(action.target);
    }
  };

  // Derive context label based on current route
  let contextLabel = 'Ask Vault AI';
  let contextPlaceholder = 'Ask Vault AI anything about gaming...';

  if (activeGameTitle) {
    contextLabel = `Ask Vault AI about ${activeGameTitle}`;
    contextPlaceholder = `Ask anything about ${activeGameTitle}...`;
  } else if (currentTab === 'gaming-pc-builder') {
    contextLabel = 'Build with Vault AI';
    contextPlaceholder = 'Ask Vault AI for PC build recommendations...';
  } else if (currentTab === 'pc-requirements') {
    contextLabel = 'Ask Vault AI about my PC';
    contextPlaceholder = 'Ask if your PC meets the specs...';
  } else if (currentTab === 'gaming-username-generator') {
    contextLabel = 'Generate Names with AI';
    contextPlaceholder = 'Ask for creative gamer tags...';
  } else if (currentTab === 'games') {
    contextLabel = 'Find Games with AI';
    contextPlaceholder = 'Describe the kind of game you want to play...';
  }

  // Load initial welcome messages on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const convs = getStoredConversations();
      if (convs.length > 0 && convs[0].messages.length > 0) {
        setMessages(convs[0].messages.slice(-4));
      } else {
        setMessages([
          {
            id: 'float-welcome',
            role: 'assistant',
            content: `Hello operative! I am **Vault AI**, your gaming assistant. How can I help you today?`,
            timestamp: new Date().toISOString(),
          }
        ]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    // Check guest usage
    const isGuest = !isSignedIn;
    const currentUsage = getGuestDailyUsage();
    if (isGuest && currentUsage.count >= GUEST_DAILY_LIMIT) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_limit_${Date.now()}`,
          role: 'assistant',
          content: `### 🛡️ Guest Limit Reached (${GUEST_DAILY_LIMIT}/${GUEST_DAILY_LIMIT} Queries)\n\nYou have used your daily free guest queries. Register or sign in for unlimited queries and full forum privileges!`,
          timestamp: new Date().toISOString(),
          actions: [
            { id: 'fl-lim-auth', type: 'auth', label: 'Sign In / Register Free', target: 'open' },
            { id: 'fl-lim-tools', type: 'navigate', label: 'Open Tools Hub', target: '/tools' }
          ]
        }
      ]);
      return;
    }

    const userMessage: VaultAiMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    if (isGuest) {
      incrementGuestDailyUsage();
    }

    try {
      const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const response = await sendVaultAiMessage({
        message: text,
        history,
        context: {
          currentPage: currentTab,
          selectedGame: activeGameTitle,
          isGuest,
          isSignedIn,
          userName: isSignedIn ? (user?.name || user?.username) : undefined,
        }
      });

      const aiMessage: VaultAiMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        sources: response.sources,
        cardIds: response.cardIds,
        actions: response.actions,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Also persist to current active conversation
      const convs = getStoredConversations();
      if (convs.length > 0) {
        convs[0].messages.push(userMessage, aiMessage);
        convs[0].updatedAt = new Date().toISOString();
        saveAllConversations(convs);
      }
    } catch (err) {
      console.warn('Floating chat error', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Vault AI is temporarily unavailable. Please try again shortly.',
          timestamp: new Date().toISOString(),
          isError: true,
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenFullPage = () => {
    setIsOpen(false);
    if (onNavigateToVaultAi) {
      onNavigateToVaultAi();
    } else {
      navigateTo('/tools/vault-ai');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh] mb-3 rounded-2xl bg-[#0e111d]/95 backdrop-blur-2xl border border-purple-500/30 shadow-2xl shadow-purple-950/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 bg-zinc-900/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px]">
                  <div className="w-full h-full rounded-[7px] bg-[#0c0f1d] flex items-center justify-center text-purple-300">
                    <Bot className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">Vault AI</h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Copilot
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                    {contextLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  onClick={handleOpenFullPage}
                  className="p-1.5 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Open Full Page"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <VaultAiMessageBubble
                  key={msg.id || i}
                  message={msg}
                  isLastAssistant={!isGenerating && i === messages.length - 1 && msg.role === 'assistant'}
                  userAvatar={user?.avatar}
                  onExecuteAction={handleExecuteAction}
                />
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-purple-300 py-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  </div>
                  <span>Vault AI is analyzing and assisting...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Assistive Prompt Suggestions */}
            {messages.length < 3 && (
              <div className="px-3 py-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto scrollbar-none text-xs">
                <button
                  onClick={() => handleSend('Can my PC run Elden Ring and Cyberpunk 2077?')}
                  className="px-2.5 py-1 rounded-lg bg-blue-900/30 hover:bg-blue-900/60 text-blue-200 border border-blue-500/30 whitespace-nowrap text-[11px] transition-colors"
                >
                  🖥️ Test PC Specs
                </button>
                <button
                  onClick={() => handleSend('Configure a balanced $1,200 gaming PC rig with specs.')}
                  className="px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 whitespace-nowrap text-[11px] transition-colors"
                >
                  💻 Build $1,200 PC
                </button>
                <button
                  onClick={() => handleSend('How do I fix micro-stutters and low FPS in games?')}
                  className="px-2.5 py-1 rounded-lg bg-amber-900/30 hover:bg-amber-900/60 text-amber-200 border border-amber-500/30 whitespace-nowrap text-[11px] transition-colors"
                >
                  🔧 Fix Low FPS
                </button>
                <button
                  onClick={() => handleSend('Generate 5 creative gamer usernames.')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10 whitespace-nowrap text-[11px] transition-colors"
                >
                  🏷️ Gamertags
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-zinc-900/90 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={contextPlaceholder}
                disabled={isGenerating}
                className="flex-1 bg-black/40 border border-white/10 focus:border-purple-500/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center disabled:opacity-40 transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-medium text-xs shadow-xl shadow-purple-900/40 border border-purple-400/40 hover:border-purple-300 transition-all cursor-pointer"
      >
        {/* Glow effect */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 opacity-40 blur group-hover:opacity-75 transition-opacity" />

        <div className="relative flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="tracking-wide">{contextLabel}</span>
          <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
        </div>
      </motion.button>
    </div>
  );
};
