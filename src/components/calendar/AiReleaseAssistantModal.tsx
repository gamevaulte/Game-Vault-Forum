import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  Search, 
  Globe, 
  ExternalLink, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { GameRelease } from '../../types/releaseCalendar';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  groundingSources?: Array<{ title: string; url: string }>;
  suggestedAction?: string;
  timestamp: string;
}

interface AiReleaseAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  allReleases: GameRelease[];
  onSelectGameTitle?: (title: string) => void;
}

const DEFAULT_QUESTIONS = [
  'What RPG games are releasing this month?',
  'What horror games are coming next?',
  'What PC games are releasing this week?',
  'What games are releasing on PlayStation next month?',
  'Show me upcoming strategy games',
  'What is the confirmed release status for GTA VI?'
];

export const AiReleaseAssistantModal: React.FC<AiReleaseAssistantModalProps> = ({
  isOpen,
  onClose,
  allReleases,
  onSelectGameTitle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **Game Vault Release Assistant**, powered by Gemini with live Google Search Grounding.\n\nI can help you explore upcoming releases across PC, PlayStation, Xbox, and Nintendo, track official release schedules, and answer questions about release delays and launch windows.\n\nHow can I help you today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || isLoading) return;

    setInput('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build lightweight release database summary for prompt context
      const releaseContext = allReleases.slice(0, 30).map(r => ({
        title: r.title,
        releaseDate: r.releaseDateDisplay,
        status: r.status,
        platforms: r.platforms.join(', '),
        genre: r.genre,
        developer: r.developer,
        delayed: r.status === 'Delayed' ? `Was ${r.previousReleaseDate}: ${r.delayReason}` : undefined
      }));

      const res = await fetch('/api/release-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          calendarContext: releaseContext
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the release schedule from the database.',
        groundingSources: data.sources || [],
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('AI Assistant error, executing local fallback matching:', err);
      // Smart local fallback matching
      const lower = q.toLowerCase();
      const matched = allReleases.filter(r => 
        r.title.toLowerCase().includes(lower) || 
        r.genre.toLowerCase().includes(lower) ||
        r.platforms.some(p => p.toLowerCase().includes(lower))
      ).slice(0, 5);

      let fallbackText = `Here is what I found in the Game Vault Release Database for **"${q}"**:\n\n`;
      if (matched.length > 0) {
        matched.forEach(m => {
          fallbackText += `• **${m.title}** — ${m.releaseDateDisplay} (${m.status})\n  Platforms: ${m.platforms.join(', ')} | Genre: ${m.genre}\n`;
        });
      } else {
        fallbackText += `No exact matching releases were found for your query. You can browse the complete monthly calendar or filter by platform above!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl h-[620px] max-h-[90vh] rounded-2xl bg-[#0c0f1e] border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-[#0e1224] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="ai-assistant-modal-title" className="text-base font-bold font-['Space_Grotesk'] text-white">
                  AI Release Assistant
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  Search Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded in the Game Vault database & verified web sources
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-['Inter'] text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-400/40 flex items-center justify-center shrink-0 mt-0.5 text-purple-300">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white font-medium rounded-br-none'
                    : 'bg-[#14182e] border border-white/10 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line text-xs sm:text-sm font-['Inter']">
                  {msg.text}
                </div>

                {/* Grounding sources chips if present */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-purple-400 block mb-1">
                      Verified Grounded Sources
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingSources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-[10px] text-purple-300 flex items-center gap-1 transition-colors"
                        >
                          <span className="truncate max-w-[150px]">{src.title || 'Verified source'}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5 text-purple-200">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-400/40 flex items-center justify-center shrink-0 text-purple-300 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#14182e] border border-white/10">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span>Searching release database & verified web sources...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 bg-[#0a0d18] border-t border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[10px] font-['Rajdhani'] uppercase tracking-wider text-slate-500 font-bold shrink-0">
            Quick Prompts:
          </span>
          {DEFAULT_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="shrink-0 px-2.5 py-1 rounded-full text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[#0e1224] border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about releases, delays, genres, platforms, or launch dates..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#090b14] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
