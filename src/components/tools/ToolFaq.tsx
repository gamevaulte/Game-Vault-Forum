import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface ToolFaqProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}

export const ToolFaq: React.FC<ToolFaqProps> = ({
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about this tool, accuracy, and best practices.',
  items
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="mt-14 pt-10 border-t border-white/10" aria-labelledby="faq-heading">
      <div className="flex items-center gap-2 text-purple-400 font-['Rajdhani'] font-bold uppercase tracking-wider text-xs mb-1">
        <HelpCircle className="w-4 h-4" />
        <span>Knowledge Base</span>
      </div>
      <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6 max-w-2xl">
        {subtitle}
      </p>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'bg-[#121524] border-purple-500/40 shadow-lg shadow-purple-950/20' 
                  : 'bg-[#0e101c] border-white/5 hover:border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold font-['Space_Grotesk'] text-slate-100">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-purple-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-purple-300' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-['Inter'] border-t border-white/5">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
