import React from 'react';
import { ToolFaq, FaqItem } from '../tools/ToolFaq';

const CALENDAR_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is a Game Release Calendar and how does Game Vault ensure accuracy?',
    answer: 'A Game Release Calendar is a verified chronological tracking schedule of upcoming, current, and delayed video game launches across PC, PlayStation, Xbox, and Nintendo platforms. At Game Vault Forum, all dates are corroborated directly from official publisher press releases, platform showcases (PlayStation State of Play, Xbox Showcase, Nintendo Direct), and developer roadmap announcements. If an exact date is unannounced, it is clearly designated as TBA rather than speculative estimation.'
  },
  {
    question: 'What does TBA mean in video game releases?',
    answer: 'TBA stands for "To Be Announced". In video game publishing, TBA signifies that an intellectual property or sequel has been officially confirmed by its developer or publisher (such as The Elder Scrolls VI or The Witcher 4), but no precise launch day, month, or quarter has been locked into the public marketing schedule. We never invent arbitrary release dates for TBA titles.'
  },
  {
    question: 'What is the difference between Early Access and a Full Release?',
    answer: 'Early Access (common on PC via Steam and consoles) allows players to purchase and play an evolving build of a title while the developers continue to refine combat, balancing, performance, and narrative content based on real community feedback. A Full Release (often designated 1.0) represents the completed commercial launch with full narrative arcs, optimization, achievements, and cross-platform feature parity.'
  },
  {
    question: 'Why do video games get delayed, and how does the calendar handle them?',
    answer: 'Modern video games are complex software feats involving hundreds of developers across graphics engineering, physics, motion capture, network netcode, and voice acting. Delays commonly occur to squash critical stability bugs, improve multi-platform optimization, polish gameplay mechanics, or avoid crowded release windows. Game Vault Forum preserves release delay history, showing original target dates alongside official publisher reasoning.'
  },
  {
    question: 'How do I export game releases to my personal calendar or set reminders?',
    answer: 'Every game release card in the Game Vault Release Calendar includes an "Export" option supporting direct Google Calendar events, Outlook Live deep links, and universal .ics calendar files compatible with Apple Calendar and mobile devices. You can also click "Remind Me" to save notifications for Release Day, 1 Day Before, or 1 Week Before directly in your browser or member account.'
  },
  {
    question: 'Can I check if my PC can run upcoming games before they release?',
    answer: 'Yes! Every release card featuring a PC launch includes a direct hardware shortcut to our PC Game Requirements Checker and FPS Calculator. You can benchmark your CPU, GPU, and RAM against the game’s official minimum and recommended system requirements with a single click.'
  }
];

export const CalendarEducationalFaq: React.FC = () => {
  return (
    <ToolFaq
      title="Game Release Calendar Knowledge Base & Guide"
      subtitle="Learn how release schedules work, understand platform timelines, and discover tactical planning tips."
      items={CALENDAR_FAQ_ITEMS}
    />
  );
};
