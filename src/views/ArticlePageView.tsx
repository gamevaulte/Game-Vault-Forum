import React, { useState, useEffect } from 'react';
import { getSeoSlug, updatePageSeo } from '../lib/seo';
import { 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar, 
  Clock, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  Tag, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  LogIn,
  UserCheck,
  CheckCircle2,
  Cpu,
  Monitor,
  CheckSquare,
  Wrench,
  HelpCircle,
  ExternalLink,
  BarChart2,
  Activity,
  TrendingUp,
  Zap,
  Flame,
  Info
} from 'lucide-react';
import { Article, PostComment, UserAccount, PageTab } from '../types';
import { AdBanner } from '../components/AdBanner';

interface ArticlePageViewProps {
  article: Article;
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
  isLiked: boolean;
  likeCount: number;
  isBookmarked: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
  comments: PostComment[];
  onAddComment: (text: string) => void;
  onToggleCommentLike: (commentId: string) => void;
  isCommentLiked: (commentId: string) => boolean;
  getCommentLikeCount: (commentId: string) => number;
  currentUser: UserAccount;
  isSignedIn: boolean;
  onOpenSignIn: () => void;
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
}

export const ArticlePageView: React.FC<ArticlePageViewProps> = ({
  article,
  articles,
  onSelectArticle,
  isLiked,
  likeCount,
  isBookmarked,
  onToggleLike,
  onToggleBookmark,
  onShare,
  comments,
  onAddComment,
  onToggleCommentLike,
  isCommentLiked,
  getCommentLikeCount,
  currentUser,
  isSignedIn,
  onOpenSignIn,
  onBack,
  onNavigateTab
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const articleSlug = getSeoSlug(article);

  // Resolve closely related article for internal linking structure
  const relatedArticle = (articles && article.relatedArticleId
    ? articles.find((a) => a.id === article.relatedArticleId)
    : null) || articles?.find((a) => a.id !== article.id);
  const relatedArticleSlug = relatedArticle ? getSeoSlug(relatedArticle) : '';

  const renderBoldText = (text: string, keyPrefix: string) => {
    // Strip all asterisks around words and phrases
    const cleanText = text.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '');
    return [cleanText];
  };

  const renderFormattedText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, linkText, url] = match;
      const startIndex = match.index;

      if (startIndex > lastIndex) {
        parts.push(renderBoldText(text.substring(lastIndex, startIndex), `t-${startIndex}`));
      }

      const normalizedText = linkText.trim().toLowerCase();
      const isInternalArticle = url.startsWith('/articles/') || url.includes('gamevault.forum/articles/');
      const isPcBuilder = url.includes('gaming-pc-builder') || url === '#pc-builder' || normalizedText.includes('gaming pc builder') || normalizedText.includes('pc builder');
      const isRequirementsChecker = 
        url.includes('pc-game-requirements-checker') || 
        url.includes('pc-requirements') || 
        url === '#requirements' || 
        normalizedText.includes('pc game requirements checker') ||
        normalizedText.includes('requirements checker');
      const isVaultAi = url.includes('vault-ai') || normalizedText.includes('vault ai');
      const isForum = url === '/forum' || url.startsWith('/forum/') || url.includes('gamevault.forum/forum') || normalizedText.includes('game vault forum') || normalizedText.includes('community forum');

      // Canonical external/direct URL for requirements checker
      const resolvedHref = isRequirementsChecker 
        ? 'https://www.gamevault.forum/tools/pc-game-requirements-checker'
        : isPcBuilder
        ? 'https://www.gamevault.forum/tools/gaming-pc-builder'
        : isForum
        ? 'https://www.gamevault.forum/forum'
        : url;

      parts.push(
        <a
          key={`link-${startIndex}`}
          href={resolvedHref}
          onClick={(e) => {
            if (isRequirementsChecker && onNavigateTab) {
              e.preventDefault();
              onNavigateTab('pc-requirements');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (isPcBuilder && onNavigateTab) {
              e.preventDefault();
              onNavigateTab('gaming-pc-builder');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (isVaultAi && onNavigateTab) {
              e.preventDefault();
              onNavigateTab('vault-ai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (isForum && onNavigateTab) {
              e.preventDefault();
              onNavigateTab('forum');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (isInternalArticle && onSelectArticle && articles) {
              e.preventDefault();
              const slug = url.replace(/^.*\/articles\//, '').replace(/\/$/, '');
              const target = articles.find(
                (a) => a.id.toLowerCase() === slug.toLowerCase() || getSeoSlug(a).toLowerCase() === slug.toLowerCase()
              );
              if (target) {
                onSelectArticle(target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = url;
              }
            }
          }}
          className="inline-flex items-baseline gap-1 font-semibold text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/60 underline-offset-4 transition-colors hover:decoration-cyan-300"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-3.5 h-3.5 inline-block self-center opacity-80 shrink-0" />
        </a>
      );

      lastIndex = startIndex + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldText(text.substring(lastIndex), `end-${lastIndex}`));
    }

    return parts;
  };

  const renderMarkdownTable = (tableText: string, key: string | number) => {
    const lines = tableText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return null;

    const parseRow = (line: string) => {
      return line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim());
    };

    const headerRow = parseRow(lines[0]);
    const isDivider = (line: string) => /^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)*\|?$/.test(line);
    const dataRows = lines.slice(1).filter(l => !isDivider(l)).map(parseRow);

    return (
      <div key={key} className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e1c]/90 shadow-2xl shadow-black/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-slate-200">
                {headerRow.map((h, i) => (
                  <th key={i} className="px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-['Space_Grotesk'] font-bold text-slate-200">
                    {renderFormattedText(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {dataRows.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className={`transition-colors hover:bg-white/[0.03] ${rIdx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}
                >
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 sm:px-5 py-3.5 text-gray-300 font-['Inter'] align-top">
                      {renderFormattedText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderChartBlock = (chartText: string, key: string | number) => {
    const rawContent = chartText
      .replace(/^:::chart\s*/, '')
      .replace(/:::$/, '')
      .trim();
    const lines = rawContent.split('\n');
    let title = 'Performance & Benchmark Metrics';
    let badge = 'Comparative Data';
    let note = '';
    const dataItems: {
      label: string;
      valueStr: string;
      num: number;
      color: string;
      subtext?: string;
    }[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      if (trimmedLine.toLowerCase().startsWith('title:')) {
        title = trimmedLine.substring(6).trim();
      } else if (trimmedLine.toLowerCase().startsWith('badge:')) {
        badge = trimmedLine.substring(6).trim();
      } else if (trimmedLine.toLowerCase().startsWith('note:')) {
        note = trimmedLine.substring(5).trim();
      } else if (trimmedLine.includes(':')) {
        const colonIdx = trimmedLine.indexOf(':');
        const label = trimmedLine.substring(0, colonIdx).trim();
        const rightPart = trimmedLine.substring(colonIdx + 1).trim();
        const parts = rightPart.split('|').map((p) => p.trim());
        const valueStr = parts[0] || '';
        const numVal = parseFloat(parts[1] || valueStr.replace(/[^0-9.]/g, '')) || 0;
        const color = parts[2] || 'cyan';
        const subtext = parts[3] || '';
        dataItems.push({ label, valueStr, num: numVal, color, subtext });
      }
    }

    const maxVal = Math.max(...dataItems.map((d) => d.num), 1);

    const colorGradients: Record<string, { bar: string; text: string; badge: string }> = {
      emerald: {
        bar: 'from-emerald-500 to-teal-400',
        text: 'text-emerald-400',
        badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
      },
      cyan: {
        bar: 'from-cyan-500 to-blue-500',
        text: 'text-cyan-400',
        badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
      },
      indigo: {
        bar: 'from-indigo-500 to-purple-500',
        text: 'text-indigo-400',
        badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
      },
      purple: {
        bar: 'from-purple-500 to-fuchsia-500',
        text: 'text-purple-400',
        badge: 'bg-purple-950/60 text-purple-300 border-purple-500/30'
      },
      amber: {
        bar: 'from-amber-500 to-yellow-400',
        text: 'text-amber-400',
        badge: 'bg-amber-950/60 text-amber-300 border-amber-500/30'
      },
      rose: {
        bar: 'from-rose-500 to-red-500',
        text: 'text-rose-400',
        badge: 'bg-rose-950/60 text-rose-300 border-rose-500/30'
      },
      red: {
        bar: 'from-red-500 to-rose-600',
        text: 'text-red-400',
        badge: 'bg-red-950/60 text-red-300 border-red-500/30'
      }
    };

    return (
      <div
        key={key}
        className="my-8 p-5 sm:p-7 rounded-2xl border border-white/10 bg-[#0d1020]/95 backdrop-blur-xl shadow-2xl shadow-black/80 relative overflow-hidden space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
                {title}
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Interactive Hardware & Data Benchmark</p>
            </div>
          </div>
          <span className="self-start sm:self-center px-3 py-1 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider rounded-full bg-white/10 border border-white/15 text-cyan-300">
            {badge}
          </span>
        </div>

        <div className="space-y-4 pt-1">
          {dataItems.map((item, dIdx) => {
            const pct = Math.min(Math.max((item.num / maxVal) * 100, 4), 100);
            const style = colorGradients[item.color] || colorGradients.cyan;

            return (
              <div key={dIdx} className="space-y-1.5 group">
                <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    {item.subtext && (
                      <span className="hidden md:inline text-[11px] text-gray-500 font-['Inter']">
                        ({item.subtext})
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded border shrink-0 ${style.badge}`}
                  >
                    {item.valueStr}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 sm:h-3.5 bg-black/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700 shadow-sm`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {item.subtext && (
                  <p className="md:hidden text-[11px] text-gray-500 font-['Inter'] pt-0.5">
                    {item.subtext}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {note && (
          <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-gray-400 font-['Inter']">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{note}</span>
          </div>
        )}
      </div>
    );
  };

  const renderDisplayCard = (cardText: string, key: string | number) => {
    const rawContent = cardText
      .replace(/^:::[a-zA-Z0-9_\-]*\s*/, '')
      .replace(/:::$/, '')
      .trim();
    const lines = rawContent.split('\n');
    let title = '';
    let badge = 'Vault Insight';
    let type: 'checklist' | 'highlight' | 'tool' | 'card' | 'takeaway' | 'proscons' = 'card';
    const contentLines: string[] = [];

    if (cardText.startsWith(':::checklist')) type = 'checklist';
    else if (cardText.startsWith(':::highlight')) type = 'highlight';
    else if (cardText.startsWith(':::tool')) type = 'tool';
    else if (cardText.startsWith(':::takeaway')) type = 'takeaway';
    else if (cardText.startsWith(':::proscons')) type = 'proscons';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith('title:')) {
        title = trimmedLine.substring(6).trim();
      } else if (trimmedLine.toLowerCase().startsWith('badge:')) {
        badge = trimmedLine.substring(6).trim();
      } else {
        contentLines.push(line);
      }
    }

    const borderColors = {
      checklist: 'border-emerald-500/40 bg-emerald-950/15 text-emerald-300',
      highlight: 'border-cyan-500/40 bg-cyan-950/15 text-cyan-300',
      takeaway: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      proscons: 'border-amber-500/40 bg-amber-950/15 text-amber-300',
      tool: 'border-white/15 bg-white/[0.03] text-slate-300',
      card: 'border-white/15 bg-[#0d1020]/90 text-slate-300',
    };

    const icons = {
      checklist: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      highlight: <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
      takeaway: <Zap className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />,
      proscons: <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      tool: <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
      card: <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
    };

    return (
      <div
        key={key}
        className={`my-8 p-5 sm:p-6 rounded-2xl border ${borderColors[type]} backdrop-blur-md shadow-2xl relative overflow-hidden`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            {icons[type]}
            <h4 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white">
              {title || 'Key Takeaway'}
            </h4>
          </div>
          <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-white/10 border border-white/10 text-slate-300">
            {badge}
          </span>
        </div>
        <div className="space-y-3 text-sm sm:text-base font-['Inter'] text-gray-200">
          {contentLines.map((cLine, i) => {
            const t = cLine.trim();
            if (!t) return null;
            if (t.startsWith('•') || t.startsWith('-') || t.startsWith('*')) {
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-sm" />
                  <span>{renderFormattedText(t.replace(/^[•\-*]\s*/, ''))}</span>
                </div>
              );
            }
            if (/^\d+\.\s+/.test(t)) {
              const num = t.match(/^(\d+)\./)?.[1] || `${i + 1}`;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-white/10 border border-white/15 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-slate-200">
                    {num}
                  </span>
                  <span>{renderFormattedText(t.replace(/^\d+\.\s+/, ''))}</span>
                </div>
              );
            }
            return <p key={i} className="leading-relaxed">{renderFormattedText(t)}</p>;
          })}
        </div>
      </div>
    );
  };

  const renderInArticleImage = (block: string, key: string | number) => {
    const match = block.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
    if (!match) return null;
    const [, alt, src] = match;

    return (
      <figure key={key} className="my-8 rounded-2xl overflow-hidden border border-purple-500/25 bg-[#0a0c16] shadow-2xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        </div>
        {alt && (
          <figcaption className="px-4 py-2.5 text-center text-xs font-['Rajdhani'] uppercase tracking-wider text-purple-300/90 bg-[#0d0f1c] border-t border-white/5 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>{alt}</span>
          </figcaption>
        )}
      </figure>
    );
  };

  useEffect(() => {
    const articleImg = article.image || article.featuredImage;
    const pageTitle = article.seoTitle || article.title;
    const pageDesc = article.metaDescription || article.excerpt;
    updatePageSeo({
      title: pageTitle,
      description: pageDesc,
      canonicalPath: `/articles/${articleSlug}`,
      ogType: 'article',
      imageUrl: articleImg,
      breadcrumbs: [
        { name: 'Articles', path: '/articles' },
        { name: article.title, path: `/articles/${articleSlug}` }
      ],
      schemaType: 'Article',
      schemaData: {
        headline: article.title,
        description: pageDesc,
        image: [articleImg],
        datePublished: '2026-09-13T04:00:00+00:00',
        dateModified: '2026-09-13T10:00:00+00:00',
        author: {
          '@type': 'Person',
          name: article.author.name
        },
        articleSection: article.category,
        wordCount: article.content ? article.content.split(/\s+/).length : 500,
        keywords: article.tags ? article.tags.join(', ') : undefined
      }
    });
  }, [article.title, article.seoTitle, article.metaDescription, article.excerpt, articleSlug, article.image, article.featuredImage, article.author.name, article.category, article.content, article.tags]);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Back Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="hidden sm:inline">URL: /articles/{articleSlug}</span>
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
            {article.category}
          </span>
        </div>
      </div>

      {/* Article Header Header */}
      <header className="space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Author bar & Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 bg-white/[0.01] px-4 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/50 shadow-md shadow-purple-950/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white font-['Space_Grotesk']">{article.author.name}</p>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-500/30 font-mono">
                  {article.author.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Official Game Vault Editorial Contributor</p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              {article.readingTime} read
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              {article.publicationDate}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="w-full h-72 sm:h-96 lg:h-[440px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-950/30 relative">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-60" />
      </div>

      {/* Excerpt Callout */}
      <div className="p-6 rounded-2xl bg-purple-950/20 border-l-4 border-purple-500 border border-purple-500/20 shadow-inner">
        <p className="text-base sm:text-lg text-purple-200 font-medium leading-relaxed font-['Space_Grotesk'] italic">
          "{article.excerpt}"
        </p>
      </div>

      {/* Structured Article Markdown Body */}
      <div className="space-y-6 text-base sm:text-lg leading-relaxed font-['Inter'] text-gray-300">
        {article.content.split('\n\n').map((block, idx) => {
          const trimmed = block.trim();
          if (!trimmed) return null;

          // In-article images
          if (trimmed.startsWith('![') && trimmed.endsWith(')')) {
            return renderInArticleImage(trimmed, idx);
          }

          // In-article charts & benchmarks
          if (trimmed.startsWith(':::chart')) {
            return renderChartBlock(trimmed, idx);
          }

          // In-article display cards
          if (trimmed.startsWith(':::')) {
            return renderDisplayCard(trimmed, idx);
          }

          // In-article markdown tables
          if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
            return renderMarkdownTable(trimmed, idx);
          }

          // Horizontal dividers
          if (trimmed === '---' || trimmed === '***') {
            return <hr key={idx} className="border-t border-white/10 my-8" />;
          }

          if (trimmed.startsWith('## ')) {
            const lines = trimmed.split('\n');
            const headingText = lines[0].replace(/^##\s*/, '').replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '');
            const extraLines = lines.slice(1).join('\n').trim();
            return (
              <div key={idx} className="space-y-4 pt-6 pb-1">
                <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white pb-2 border-b border-white/10 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-lg bg-red-500 shadow-red-500/50" />
                  <span>{headingText}</span>
                </h2>
                {extraLines && (
                  <p className="leading-relaxed text-gray-300">
                    {renderFormattedText(extraLines)}
                  </p>
                )}
              </div>
            );
          }

          if (trimmed.startsWith('### ')) {
            const lines = trimmed.split('\n');
            const headingText = lines[0].replace(/^###\s*/, '').replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '');
            const extraLines = lines.slice(1).join('\n').trim();
            return (
              <div key={idx} className="space-y-3 pt-4 pb-1">
                <h3 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-slate-100">
                  {headingText}
                </h3>
                {extraLines && (
                  <p className="leading-relaxed text-gray-300">
                    {renderFormattedText(extraLines)}
                  </p>
                )}
              </div>
            );
          }

          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="my-5 pl-4 py-2.5 border-l-2 border-cyan-500/70 bg-white/[0.03] rounded-r-xl italic text-slate-200 font-['Inter']"
              >
                {renderFormattedText(trimmed.replace(/^>\s*/, ''))}
              </blockquote>
            );
          }

          // Check if block has intro text followed by bullet points
          const blockLines = trimmed.split('\n');
          const firstBulletIdx = blockLines.findIndex(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
          if (firstBulletIdx > 0 && blockLines.slice(firstBulletIdx).every(l => l.trim().startsWith('•') || l.trim().startsWith('-') || !l.trim())) {
            const intro = blockLines.slice(0, firstBulletIdx).join('\n').trim();
            const bullets = blockLines.slice(firstBulletIdx).filter(l => l.trim());
            return (
              <div key={idx} className="space-y-3 my-4">
                {intro && <p className="leading-relaxed text-gray-300">{renderFormattedText(intro)}</p>}
                <ul className="space-y-2.5 pl-2">
                  {bullets.map((bLine, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0 shadow-sm shadow-cyan-500/40" />
                      <span>{renderFormattedText(bLine.trim().replace(/^[•\-]\s*/, ''))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          // Check if block has intro text followed by numbered points
          const firstNumIdx = blockLines.findIndex(l => /^\d+\.\s+/.test(l.trim()));
          if (firstNumIdx > 0 && blockLines.slice(firstNumIdx).every(l => /^\d+\.\s+/.test(l.trim()) || !l.trim())) {
            const intro = blockLines.slice(0, firstNumIdx).join('\n').trim();
            const nums = blockLines.slice(firstNumIdx).filter(l => l.trim());
            return (
              <div key={idx} className="space-y-3 my-4">
                {intro && <p className="leading-relaxed text-gray-300">{renderFormattedText(intro)}</p>}
                <ol className="space-y-3 pl-1">
                  {nums.map((nLine, nIdx) => {
                    const match = nLine.trim().match(/^(\d+)\.\s+(.*)$/);
                    const num = match ? match[1] : `${nIdx + 1}`;
                    const body = match ? match[2] : nLine.trim();
                    return (
                      <li key={nIdx} className="flex items-start gap-3 text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {num}
                        </span>
                        <span>{renderFormattedText(body)}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          }

          if (trimmed.split('\n').every((line) => /^\d+\.\s+/.test(line.trim()))) {
            return (
              <ol key={idx} className="space-y-3 my-4 pl-1">
                {trimmed.split('\n').map((line, lIdx) => {
                  const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                  const num = match ? match[1] : `${lIdx + 1}`;
                  const body = match ? match[2] : line.trim();
                  return (
                    <li key={lIdx} className="flex items-start gap-3 text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        {num}
                      </span>
                      <span>{renderFormattedText(body)}</span>
                    </li>
                  );
                })}
              </ol>
            );
          }

          if (trimmed.split('\n').every((line) => line.trim().startsWith('•') || line.trim().startsWith('-'))) {
            return (
              <ul key={idx} className="space-y-2.5 my-4 pl-2">
                {trimmed.split('\n').map((line, lIdx) => (
                  <li key={lIdx} className="flex items-start gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2.5 shrink-0 shadow-sm shadow-cyan-500/40" />
                    <span>{renderFormattedText(line.trim().replace(/^[•\-]\s*/, ''))}</span>
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={idx} className="leading-relaxed whitespace-pre-line text-gray-300">
              {renderFormattedText(trimmed)}
            </p>
          );
        })}
      </div>

      {/* Google AdSense In-Article Ad Placement */}
      <div className="my-8">
        <AdBanner slot="article-mid-banner" format="horizontal" />
      </div>

      {/* Internal Linking Structure: Suggested Next Read Card */}
      {relatedArticle && (
        <section
          id={`suggested-article-${relatedArticle.id}`}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/35 via-[#0d1020] to-[#07080f] border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6 my-10"
        >
          {/* Ambient Glow Effects */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md shadow-purple-600/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-widest text-purple-400 block">
                  Game Vault Internal Linking • Editorial Suggestion
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
                  Suggested Next Read
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 text-xs font-semibold font-['Rajdhani'] uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-full self-start sm:self-auto flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Closely Related Topic
            </span>
          </div>

          {/* Contextual Recommendation Prompt */}
          <div className="relative z-10 p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <p className="text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-400">
              Why You Should Check This Out Next:
            </p>
            <p className="text-sm sm:text-base text-gray-200 font-['Inter'] leading-relaxed italic">
              "{article.relatedArticlePrompt || 'Continue your exploration with this companion analysis exploring video game design, community longevity, and player mastery.'}"
            </p>
          </div>

          {/* Interactive Recommended Article Card */}
          <a
            href={`/articles/${relatedArticleSlug}`}
            onClick={(e) => {
              if (onSelectArticle) {
                e.preventDefault();
                onSelectArticle(relatedArticle);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="group block relative z-10 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/50 p-4 sm:p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/40 cursor-pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Featured Image */}
              <div className="md:col-span-4 relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-white/10">
                <img
                  src={relatedArticle.featuredImage}
                  alt={relatedArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 text-[10px] font-bold font-['Rajdhani'] uppercase tracking-wider bg-black/80 backdrop-blur-md text-cyan-300 rounded border border-white/15">
                  {relatedArticle.category}
                </span>
              </div>

              {/* Text Information */}
              <div className="md:col-span-8 space-y-2.5">
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {relatedArticle.publicationDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {relatedArticle.readingTime}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {relatedArticle.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed font-['Inter']">
                  {relatedArticle.excerpt}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <img
                      src={relatedArticle.author.avatar}
                      alt={relatedArticle.author.name}
                      className="w-5 h-5 rounded-full object-cover border border-purple-500/40"
                    />
                    <span className="text-xs text-gray-300 font-medium">By {relatedArticle.author.name}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/25 group-hover:bg-purple-600 text-purple-300 group-hover:text-white border border-purple-500/30 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all duration-200">
                    <span>Check Out Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </section>
      )}

      {/* Article Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/10">
        <Tag className="w-4 h-4 text-purple-400" />
        {article.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs bg-white/5 text-gray-300 border border-white/10 rounded-xl font-medium font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Interactive Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e101a] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            id={`like-article-${article.id}`}
            onClick={onToggleLike}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isLiked
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/50 scale-[1.02]'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-purple-500/40 hover:bg-white/10 hover:text-white'
            }`}
            title={isSignedIn ? (isLiked ? 'Unlike article' : 'Like article') : 'Sign in to like'}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-900/40'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-cyan-500/40 hover:bg-white/10 hover:text-white'
            }`}
            title={isBookmarked ? 'Saved to Vault' : 'Save to Vault'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider border border-white/10 hover:border-white/20 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Share Article Link</span>
        </button>
      </div>

      {/* Comments & Discussion Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#0c0e18] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
              Discussion & Comments ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {isSignedIn ? 'Signed in as ' + currentUser.name : 'Sign in to comment'}
          </span>
        </div>

        {/* Comment Form or Sign-in Prompt */}
        {isSignedIn ? (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
              />
              <span className="text-xs font-semibold text-white font-['Space_Grotesk']">
                {currentUser.name}
              </span>
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the discussion... Share your thoughts on this tactical editorial."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-['Inter']"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Only registered and signed in users can like, comment, and save content across the website
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sign in or create an account in seconds to join the community discussion.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSignIn}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shadow-md shadow-purple-900/50 border border-purple-400/30 transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs font-mono">
              No comments yet on this article. Be the first registered operative to share your perspective!
            </div>
          ) : (
            comments.map((comment) => {
              const userHasLiked = isCommentLiked(comment.id);
              const cLikes = getCommentLikeCount(comment.id);
              return (
                <div
                  key={comment.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5 transition-colors hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                      />
                      <div>
                        <span className="text-xs font-bold text-white font-['Space_Grotesk'] block">
                          {comment.author.name}
                        </span>
                        {comment.author.badge && (
                          <span className="text-[10px] text-purple-300 font-mono">
                            {comment.author.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">{comment.timestamp}</span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pl-11">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-3 pl-11 pt-1">
                    <button
                      onClick={() => onToggleCommentLike(comment.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        userHasLiked
                          ? 'text-purple-400 font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      title={isSignedIn ? 'Like comment' : 'Sign in to like'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-current' : ''}`} />
                      <span>{cLikes}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </article>
  );
};
