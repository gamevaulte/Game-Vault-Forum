import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const PcRequirementsFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How do I check if my PC meets a game\'s requirements?',
      answer:
        'Select any game from the library above and select your processor (CPU), graphics card (GPU), system RAM, and free storage. The Game Vault Forum checker compares your hardware against the official specifications published by the game\'s developer and studio, giving you an immediate component-by-component verdict.'
    },
    {
      question: 'What is the difference between Minimum and Recommended requirements?',
      answer:
        'Minimum requirements represent the baseline hardware needed to launch and play the game, typically targeting 720p or 1080p at 30 FPS on low settings. Recommended requirements indicate hardware capable of delivering 1080p or 1440p at 60+ FPS on high visual presets with smooth frame pacing.'
    },
    {
      question: 'Does having more RAM automatically make games run faster?',
      answer:
        'Having more RAM only improves performance if your current capacity is insufficient. For instance, upgrading from 8 GB to 16 GB eliminates heavy paging and stuttering in modern games like Cyberpunk 2077 or Baldur\'s Gate 3. However, upgrading from 32 GB to 64 GB will typically not yield higher FPS unless you run memory-intensive workloads like modded simulation servers or video rendering in the background.'
    },
    {
      question: 'Does my Graphics Card (GPU) matter more than my Processor (CPU)?',
      answer:
        'Both are essential, but their impact depends on the game and resolution. At higher resolutions like 1440p and 4K, games are usually GPU-bound. Fast-paced competitive multiplayer games (like Counter-Strike 2, Valorant, or Call of Duty: Warzone) and simulation games (like World of Warships or Grand Theft Auto V) rely heavily on CPU single-core IPC and thread scheduling.'
    },
    {
      question: 'Why doesn\'t the checker give me an exact, guaranteed FPS number?',
      answer:
        'In keeping with Game Vault Forum\'s commitment to authentic data integrity, we never invent fabricated FPS numbers. Real-world frame rates depend on dynamic variables including driver version, thermal throttling, resolution scaling, Windows background services, and monitor refresh rate synchronization (G-Sync/FreeSync).'
    },
    {
      question: 'What should I upgrade first if my PC falls below minimum requirements?',
      answer:
        'If your storage is an older mechanical HDD, moving your game installations to a fast NVMe SSD delivers the most noticeable reduction in hitching and loading times. If your system has 8 GB RAM or less, upgrading to a 16 GB dual-channel kit is the most cost-effective performance boost. For visual fidelity and resolution, upgrading your graphics card offers the highest raw graphical benefit.'
    }
  ];

  return (
    <div className="w-full bg-[#121422]/90 border border-purple-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-5 h-5 text-purple-400" />
        <h3 className="font-['Rajdhani'] font-bold text-2xl text-white uppercase tracking-wider">
          PC Requirements Frequently Asked Questions
        </h3>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Practical hardware guidance from the Game Vault Forum editorial and benchmarking team.
      </p>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-white/5 rounded-xl overflow-hidden bg-black/30 transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left font-['Rajdhani'] font-bold text-white text-base sm:text-lg uppercase tracking-wide hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform shrink-0 ml-3 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-sm text-gray-300 leading-relaxed border-t border-white/5 font-normal">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
