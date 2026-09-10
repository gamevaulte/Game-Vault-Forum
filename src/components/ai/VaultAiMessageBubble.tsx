import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { VaultAiMessage } from '../../types';
import { 
  VaultAiGameCard, 
  VaultAiHardwareCard, 
  VaultAiArticleCard, 
  VaultAiVideoCard,
  resolveGame,
  resolveHardware,
  resolveArticleOrGuide,
  resolveVideo
} from './VaultAiCards';
import { navigateTo } from '../../lib/router';

interface VaultAiMessageBubbleProps {
  message: VaultAiMessage;
  isLastAssistant?: boolean;
  onRegenerate?: () => void;
  userAvatar?: string;
}

export const VaultAiMessageBubble: React.FC<VaultAiMessageBubbleProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
  userAvatar
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy', e);
    }
  };

  // Resolve structured cards
  const games = (message.cardIds?.games || [])
    .map(resolveGame)
    .filter(Boolean);

  const hardware = (message.cardIds?.hardware || [])
    .map(resolveHardware)
    .filter(Boolean);

  const articles = (message.cardIds?.articles || [])
    .map(resolveArticleOrGuide)
    .filter(Boolean);

  const videos = (message.cardIds?.videos || [])
    .map(resolveVideo)
    .filter(Boolean);

  const hasCards = games.length > 0 || hardware.length > 0 || articles.length > 0 || videos.length > 0;

  return (
    <div className={`flex items-start gap-3.5 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-200 overflow-hidden shadow-sm">
            {userAvatar ? (
              <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full rounded-[11px] bg-[#0c0f1d] flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Author Label */}
        <div className="flex items-center gap-2 mb-1 px-1 text-xs">
          <span className="font-semibold text-zinc-300">
            {isUser ? 'You' : 'Vault AI'}
          </span>
          {!isUser && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Gaming Assistant
            </span>
          )}
          <span className="text-[11px] text-zinc-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Message Body */}
        <div
          className={`rounded-2xl px-5 py-4 text-sm leading-relaxed border transition-colors ${
            isUser
              ? 'bg-purple-900/30 border-purple-500/30 text-purple-100 rounded-tr-none shadow-md'
              : 'bg-[#121526]/90 border-white/10 text-zinc-200 rounded-tl-none shadow-xl'
          }`}
        >
          {/* Markdown Output */}
          <div className="vault-markdown prose prose-invert max-w-none prose-p:my-2 prose-headings:text-white prose-headings:font-bold prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1 prose-h4:text-sm prose-ul:my-2 prose-li:my-0.5 prose-strong:text-purple-300 prose-table:border-collapse prose-table:my-3 prose-th:border prose-th:border-white/10 prose-th:bg-zinc-800/80 prose-th:p-2 prose-td:border prose-td:border-white/10 prose-td:p-2 prose-code:text-purple-300 prose-code:bg-purple-950/40 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            <Markdown>{message.content}</Markdown>
          </div>

          {/* Interactive Structured Cards */}
          {hasCards && (
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Featured Game Vault References</span>
              </div>

              {games.map((game, idx) => (
                <VaultAiGameCard key={game!.id || idx} game={game!} />
              ))}

              {hardware.map((comp, idx) => (
                <VaultAiHardwareCard key={comp!.id || idx} component={comp!} />
              ))}

              {articles.map((item, idx) => (
                <VaultAiArticleCard 
                  key={item!.item.id || idx} 
                  item={item!.item} 
                  type={item!.type} 
                  url={item!.url} 
                />
              ))}

              {videos.map((vid, idx) => (
                <VaultAiVideoCard key={vid!.id || idx} video={vid!} />
              ))}
            </div>
          )}

          {/* Sources and Attributions */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Sources:
              </span>
              {message.sources.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(s.url)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-purple-500/20 text-zinc-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/40 text-[11px] transition-all"
                  title={s.url}
                >
                  <span className="truncate max-w-[200px]">{s.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Actions (AI only) */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 px-2 text-zinc-400 text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors p-1"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>

            {isLastAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 hover:text-purple-300 transition-colors p-1 ml-2"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
