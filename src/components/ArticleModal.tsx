import React from 'react';
import { X, Calendar, Clock, ThumbsUp, Bookmark, Share2, Tag, BookOpen, Sparkles, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  isLiked: boolean;
  onToggleBookmark: (id: string) => void;
  onToggleLike: (id: string) => void;
  onShare: (title: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  isLiked,
  onToggleBookmark,
  onToggleLike,
  onShare
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0e101a] border border-[#262c45] rounded-2xl shadow-2xl shadow-purple-950/40 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2438] bg-[#121524]">
          <span className="px-2.5 py-0.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider bg-purple-900/60 text-purple-300 rounded border border-purple-700/40">
            {article.category}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-[#1a1d2e] hover:bg-[#23273e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Body Container */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-['Space_Grotesk'] font-bold text-white leading-tight">
              {article.title}
            </h1>

            {/* Author bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#1f2438]">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/50"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{article.author.name}</p>
                  <p className="text-xs text-purple-400">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {article.readingTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.publicationDate}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-[#22273e]">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt Lead */}
          <p className="text-base sm:text-lg text-purple-200/90 font-medium leading-relaxed font-['Space_Grotesk'] italic pl-4 border-l-2 border-purple-500">
            {article.excerpt}
          </p>

          {/* Full content */}
          <div className="space-y-4 text-sm sm:text-base leading-relaxed font-['Inter']">
            {article.content.split('\n\n').map((block, idx) => {
              const trimmed = block.trim();
              if (!trimmed) return null;

              // Images
              if (trimmed.startsWith('![') && trimmed.endsWith(')')) {
                const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (match) {
                  const [, alt, src] = match;
                  return (
                    <figure key={idx} className="my-5 rounded-xl overflow-hidden border border-[#252a42]">
                      <img src={src} alt={alt} className="w-full aspect-video object-cover" />
                      {alt && (
                        <figcaption className="p-2 text-center text-xs text-slate-400 bg-[#101322]">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
              }

              // Display cards
              if (trimmed.startsWith(':::')) {
                const rawContent = trimmed.replace(/^:::[a-zA-Z0-9_\-]*\s*/, '').replace(/:::$/, '').trim();
                const lines = rawContent.split('\n');
                let title = 'Key Insight';
                let badge = 'Vault Note';
                const bodyLines: string[] = [];
                for (const l of lines) {
                  const cleanL = l.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '').trim();
                  if (cleanL.toLowerCase().startsWith('title:')) title = cleanL.substring(6).trim();
                  else if (cleanL.toLowerCase().startsWith('badge:')) badge = cleanL.substring(6).trim();
                  else bodyLines.push(cleanL);
                }
                return (
                  <div key={idx} className="my-5 p-4 sm:p-5 rounded-xl border border-white/10 bg-[#0c0e1a] shadow-lg">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
                      <h4 className="font-bold text-white font-['Space_Grotesk'] text-sm sm:text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        {title}
                      </h4>
                      <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-300 bg-white/10 rounded-full border border-white/10">
                        {badge}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {bodyLines.map((bl, bi) => {
                        const t = bl.trim();
                        if (!t) return null;
                        if (t.startsWith('•') || t.startsWith('-') || t.startsWith('*')) {
                          return (
                            <div key={bi} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              <span>{t.replace(/^[•\-*]\s*/, '')}</span>
                            </div>
                          );
                        }
                        return <p key={bi} className="leading-relaxed">{t}</p>;
                      })}
                    </div>
                  </div>
                );
              }

              // Horizontal dividers
              if (trimmed === '---' || trimmed === '***') {
                return <hr key={idx} className="border-t border-white/10 my-6" />;
              }

              // Markdown tables
              if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
                const lines = trimmed.split('\n').filter(Boolean);
                const parse = (l: string) =>
                  l
                    .replace(/^\|/, '')
                    .replace(/\|$/, '')
                    .split('|')
                    .map((c) => c.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '').trim());
                const header = parse(lines[0]);
                const rows = lines.slice(1).filter(l => !/^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)*\|?$/.test(l)).map(parse);
                return (
                  <div key={idx} className="my-5 overflow-x-auto rounded-xl border border-[#252a42] bg-[#0c0e1a]">
                    <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-white/5 border-b border-[#252a42] text-slate-200">
                          {header.map((h, hi) => (
                            <th key={hi} className="p-2.5 font-bold font-['Space_Grotesk'] text-slate-200">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {rows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-white/[0.02]">
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-2.5 text-slate-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (trimmed.startsWith('## ')) {
                const lines = trimmed.split('\n');
                const headingText = lines[0].replace(/^##\s*/, '').replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '');
                const extraLines = lines.slice(1).join('\n').trim();
                return (
                  <div key={idx} className="space-y-3 pt-5 pb-1">
                    <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white pb-2 border-b border-[#252a42] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0"></span>
                      <span>{headingText}</span>
                    </h2>
                    {extraLines && (
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {extraLines.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}
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
                  <div key={idx} className="space-y-2 pt-3 pb-1">
                    <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-slate-100">
                      {headingText}
                    </h3>
                    {extraLines && (
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {extraLines.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}
                      </p>
                    )}
                  </div>
                );
              }

              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={idx}
                    className="my-4 pl-3.5 py-2 border-l-2 border-cyan-500/70 bg-white/[0.03] rounded-r-lg italic text-slate-200 text-sm sm:text-base font-['Inter']"
                  >
                    {trimmed.replace(/^>\s*/, '').replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}
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
                  <div key={idx} className="space-y-2.5 my-3">
                    {intro && (
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {intro.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}
                      </p>
                    )}
                    <ul className="space-y-2 pl-2">
                      {bullets.map((bLine, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span>{bLine.trim().replace(/^[•\-]\s*/, '').replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}</span>
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
                  <div key={idx} className="space-y-2.5 my-3">
                    {intro && (
                      <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        {intro.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}
                      </p>
                    )}
                    <ol className="space-y-2 pl-1">
                      {nums.map((nLine, nIdx) => {
                        const match = nLine.trim().match(/^(\d+)\.\s+(.*)$/);
                        const num = match ? match[1] : `${nIdx + 1}`;
                        const body = match ? match[2] : nLine.trim();
                        return (
                          <li key={nIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                              {num}
                            </span>
                            <span>{body.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              }

              if (trimmed.split('\n').every((line) => /^\d+\.\s+/.test(line.trim()))) {
                return (
                  <ol key={idx} className="space-y-2.5 my-3 pl-1">
                    {trimmed.split('\n').map((line, lIdx) => {
                      const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                      const num = match ? match[1] : `${lIdx + 1}`;
                      const body = match ? match[2] : line.trim();
                      return (
                        <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <span className="w-4 h-4 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                            {num}
                          </span>
                          <span>{body.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}</span>
                        </li>
                      );
                    })}
                  </ol>
                );
              }

              if (trimmed.split('\n').every((line) => line.trim().startsWith('•') || line.trim().startsWith('-'))) {
                return (
                  <ul key={idx} className="space-y-2 my-3 pl-2">
                    {trimmed.split('\n').map((line, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{line.trim().replace(/^[•\-]\s*/, '').replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              const cleanText = trimmed.replace(/\*+([^*]+)\*+/g, '$1').replace(/\*/g, '');
              return (
                <p key={idx} className="text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {cleanText}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#1f2438]">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs bg-[#141727] text-slate-300 border border-[#242942] rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1f2438]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLike(article.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  isLiked
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
                    : 'bg-[#141725] text-slate-300 border-[#262c45] hover:border-purple-500/40 hover:text-white'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{article.likes + (isLiked ? 1 : 0)} Likes</span>
              </button>

              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`p-2 rounded-lg text-xs border transition-all ${
                  isBookmarked
                    ? 'bg-cyan-600 text-white border-cyan-500'
                    : 'bg-[#141725] text-slate-300 border-[#262c45] hover:border-cyan-500/40 hover:text-white'
                }`}
                title={isBookmarked ? 'Saved in Vault' : 'Save to Vault'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => onShare(article.title)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#141725] hover:bg-[#1a1f33] text-slate-200 rounded-lg text-xs font-medium border border-[#262c45] transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
