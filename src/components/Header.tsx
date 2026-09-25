import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Youtube, 
  Menu, 
  X, 
  Sparkles, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  Wrench, 
  Monitor, 
  Bot, 
  Dices, 
  Gauge,
  Gamepad2,
  FileText,
  Star,
  BookOpen,
  Info,
  Mail,
  Flame,
  User,
  Calendar
} from 'lucide-react';
import { PageTab, UserAccount } from '../types';
import { VaultLogo } from './VaultLogo';
import { YOUTUBE_CHANNEL } from '../lib/constants';

interface HeaderProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  user: UserAccount;
  isSignedIn?: boolean;
  onOpenSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenProfile,
  user,
  isSignedIn = true,
  onOpenSignIn,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection with cross-browser support (handles window, documentElement, body)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollPos > 6);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Click outside and ESC key detection to close dropdown menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setToolsDropdownOpen(false);
        setMoreDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Primary navigation tabs organized into 3 core pillars
  // Pillar 1: Games & Play
  const gamesNavItems: { id: PageTab; label: string; href: string; badge?: string; icon?: React.ElementType }[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'games', label: 'Games', href: '/games' },
    { id: 'play-games', label: 'Play Games', href: '/play-games', badge: 'Free', icon: Gamepad2 }
  ];

  // Pillar 2: Media & Editorial
  const videosNavItem = { id: 'videos' as PageTab, label: 'Videos', href: '/videos' };

  const editorialNavItems: { id: PageTab; label: string; href: string; desc: string; icon: React.ElementType }[] = [
    { id: 'articles', label: 'Articles', href: '/articles', desc: 'Gaming news, features & editorials', icon: FileText },
    { id: 'reviews', label: 'Reviews', href: '/reviews', desc: 'Hardware & video game review scores', icon: Star },
    { id: 'guides', label: 'Guides', href: '/guides', desc: 'Walkthroughs, tips & PC setup guides', icon: BookOpen }
  ];

  // Pillar 3: Community
  const forumNavItem = { id: 'forum' as PageTab, label: 'Forum', href: '/forum' };

  // Full unified order for drawer and site map
  const allNavItems = [
    { id: 'home' as PageTab, label: 'Home', href: '/' },
    { id: 'games' as PageTab, label: 'Games', href: '/games' },
    { id: 'play-games' as PageTab, label: 'Play Games', href: '/play-games', badge: 'Play Free', icon: Gamepad2 },
    { id: 'videos' as PageTab, label: 'Videos', href: '/videos' },
    { id: 'articles' as PageTab, label: 'Articles', href: '/articles' },
    { id: 'reviews' as PageTab, label: 'Reviews', href: '/reviews' },
    { id: 'guides' as PageTab, label: 'Guides', href: '/guides' },
    { id: 'forum' as PageTab, label: 'Forum', href: '/forum' }
  ];

  const toolsItems = [
    {
      id: 'game-release-calendar' as PageTab,
      label: 'Game Release Calendar',
      desc: 'Track launch dates, countdowns & delays',
      href: '/tools/game-release-calendar',
      icon: Calendar,
      badge: 'New'
    },
    {
      id: 'fps-calculator' as PageTab,
      label: 'FPS / Performance Calculator',
      desc: 'Estimate PC gaming FPS & bottlenecks',
      href: '/tools/fps-calculator',
      icon: Gauge,
      badge: 'Featured'
    },
    {
      id: 'vault-ai' as PageTab,
      label: 'Vault AI Assistant',
      desc: 'Ask, discover, compare & troubleshoot',
      href: '/tools/vault-ai',
      icon: Bot,
      badge: 'Flagship AI'
    },
    {
      id: 'pc-requirements' as PageTab,
      label: 'PC Requirements Checker',
      desc: 'Can My PC Run This Game?',
      href: '/tools/pc-game-requirements-checker',
      icon: Monitor
    },
    {
      id: 'gaming-pc-builder' as PageTab,
      label: 'Gaming PC Builder',
      desc: 'Build around your budget & games',
      href: '/tools/gaming-pc-builder',
      icon: Wrench
    },
    {
      id: 'gaming-username-generator' as PageTab,
      label: 'Username Generator',
      desc: 'Create unique gaming names',
      href: '/tools/gaming-username-generator',
      icon: Sparkles
    },
    {
      id: 'game-avatar-generator' as PageTab,
      label: 'Game Avatar Generator',
      desc: 'Create unique gaming profile avatars',
      href: '/game-avatar-generator',
      icon: Sparkles,
      badge: 'New'
    },
    {
      id: 'game-picker-wheel' as PageTab,
      label: 'Game Picker Wheel',
      desc: "Can't decide what to play? Spin the wheel!",
      href: '/game-picker-wheel',
      icon: Dices,
      badge: 'Popular'
    }
  ];

  const isToolsActive =
    currentTab === 'tools' ||
    currentTab === 'fps-calculator' ||
    currentTab === 'vault-ai' ||
    currentTab === 'game-avatar-generator' ||
    currentTab === 'gaming-username-generator' ||
    currentTab === 'gaming-pc-builder' ||
    currentTab === 'pc-requirements' ||
    currentTab === 'game-picker-wheel' ||
    currentTab === 'game-release-calendar';

  const isEditorialActive =
    currentTab === 'articles' ||
    currentTab === 'reviews' ||
    currentTab === 'guides' ||
    currentTab === 'about' ||
    currentTab === 'contact';

  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    setMoreDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-navigation-header"
      className={`vault-sticky-header sticky top-0 z-50 w-full transition-all duration-200 pt-[env(safe-area-inset-top,0px)] ${
        isScrolled
          ? 'bg-[#070913]/95 backdrop-blur-2xl border-b border-purple-500/30 shadow-2xl shadow-black/80 supports-[backdrop-filter]:bg-[#070913]/90'
          : 'bg-[#070913]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 supports-[backdrop-filter]:bg-[#070913]/75'
      }`}
      style={{ position: 'sticky', top: 0 }}
    >
      {/* Container with guaranteed minimum edge margins across all devices */}
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-5 md:px-6 lg:px-8 h-15 sm:h-16 lg:h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo - shrink-0 to prevent compression */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="cursor-pointer shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
          aria-label="Game Vault Forum Home"
        >
          <VaultLogo size="md" showTagline={false} />
        </a>

        {/* Desktop & Laptop Navigation: Grouped into 3 logical pillars with clean dividers */}
        <nav 
          className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 font-['Rajdhani'] font-bold tracking-wider text-xs xl:text-[13px] 2xl:text-sm uppercase shrink"
          aria-label="Primary Desktop Navigation"
        >
          {/* Pillar 1: Games & Play (Home, Games, Play Games) */}
          <div className="flex items-center space-x-0.5 xl:space-x-1">
            {gamesNavItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  id={`nav-${item.id}`}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={`relative px-2 xl:px-2.5 py-1.5 rounded-lg xl:rounded-xl transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-purple-900/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && (
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-purple-400'}`} />
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="hidden xl:inline-block px-1 py-0.2 text-[9px] font-mono font-bold bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded tracking-normal normal-case">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Micro-divider between Games and Media */}
          <div className="h-4 w-px bg-white/15 mx-1 xl:mx-1.5 shrink-0 select-none" aria-hidden="true" />

          {/* Pillar 2: Media & Editorial (Videos, plus inline on XL or Editorial ▾ dropdown on Laptop) */}
          <div className="flex items-center space-x-0.5 xl:space-x-1">
            {/* Videos */}
            <a
              id={`nav-${videosNavItem.id}`}
              href={videosNavItem.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(videosNavItem.id);
              }}
              className={`relative px-2 xl:px-2.5 py-1.5 rounded-lg xl:rounded-xl transition-all duration-150 whitespace-nowrap ${
                currentTab === videosNavItem.id
                  ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-purple-900/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{videosNavItem.label}</span>
              {currentTab === videosNavItem.id && (
                <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 rounded-full" />
              )}
            </a>

            {/* Desktop (XL+): Articles, Reviews, Guides inline */}
            <div className="hidden xl:flex items-center space-x-1">
              {editorialNavItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <a
                    key={item.id}
                    id={`nav-${item.id}`}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`relative px-2 xl:px-2.5 py-1.5 rounded-lg xl:rounded-xl transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-purple-900/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 rounded-full" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Laptop (1024px - 1279px): Editorial ▾ Dropdown Menu */}
            <div className="relative xl:hidden" ref={moreMenuRef}>
              <button
                type="button"
                id="nav-editorial-dropdown"
                onClick={() => {
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setToolsDropdownOpen(false);
                }}
                className={`relative px-2.5 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isEditorialActive
                    ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-purple-900/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
              >
                <span>Editorial</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-gray-400'}`} />
                {isEditorialActive && (
                  <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 rounded-full" />
                )}
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#0e101d]/98 backdrop-blur-2xl border border-purple-500/30 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider border-b border-white/5 mb-1 flex items-center justify-between">
                    <span>Editorial & Coverage</span>
                    <span className="text-[9px] text-cyan-400">3 Sections</span>
                  </div>
                  <div className="space-y-1">
                    {editorialNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.id);
                          }}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                            isActive 
                              ? 'bg-purple-950/60 border border-purple-500/40 text-white' 
                              : 'hover:bg-purple-950/30 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-white/5 text-purple-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold font-['Space_Grotesk'] text-white">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-1 text-[11px] font-['Rajdhani'] uppercase font-bold text-center">
                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick('about');
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick('contact');
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Micro-divider between Media and Community/Tools */}
          <div className="h-4 w-px bg-white/15 mx-1 xl:mx-1.5 shrink-0 select-none" aria-hidden="true" />

          {/* Pillar 3: Community & Tools (Forum, Tools ▾) */}
          <div className="flex items-center space-x-0.5 xl:space-x-1">
            {/* Forum */}
            <a
              id={`nav-${forumNavItem.id}`}
              href={forumNavItem.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(forumNavItem.id);
              }}
              className={`relative px-2 xl:px-2.5 py-1.5 rounded-lg xl:rounded-xl transition-all duration-150 whitespace-nowrap ${
                currentTab === forumNavItem.id
                  ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-purple-900/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{forumNavItem.label}</span>
              {currentTab === forumNavItem.id && (
                <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 rounded-full" />
              )}
            </a>

            {/* Tools Dropdown Menu */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                type="button"
                id="nav-tools-dropdown"
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setMoreDropdownOpen(false);
                }}
                className={`relative px-2 xl:px-2.5 py-1.5 rounded-lg xl:rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isToolsActive
                    ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-md shadow-purple-900/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={toolsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Tools</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-gray-400'}`} />
                {isToolsActive && (
                  <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 rounded-full" />
                )}
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0e101d]/98 backdrop-blur-2xl border border-purple-500/30 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider border-b border-white/5 mb-1 flex items-center justify-between">
                    <span>Gaming Utilities & AI</span>
                    <span className="text-[9px] text-cyan-400">8 Tools</span>
                  </div>
                  <div className="space-y-1">
                    {toolsItems.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = currentTab === tool.id;
                      return (
                        <a
                          key={tool.id}
                          href={tool.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(tool.id);
                          }}
                          className={`flex items-start gap-3 p-2 rounded-xl transition-colors group cursor-pointer ${
                            isActive
                              ? 'bg-purple-950/60 border border-purple-500/40 text-white'
                              : 'hover:bg-purple-950/40 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-purple-950/70 border border-purple-500/30 text-purple-400 group-hover:text-cyan-400 shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold font-['Space_Grotesk'] text-white flex items-center justify-between">
                              <span>{tool.label}</span>
                              {tool.badge && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/20">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-['Inter'] truncate">
                              {tool.desc}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5">
                    <a
                      href="/tools"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick('tools' as any);
                      }}
                      className="block text-center py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      View All Tools Hub
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Right Action Bar: Responsive, cleanly spaced, zero edge overflow */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Global Search Trigger */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 h-9 sm:h-9.5 px-2.5 sm:px-3 text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg hover:text-white backdrop-blur-md transition-all group shrink-0"
            title="Search the Vault (Ctrl+K)"
            aria-label="Search Game Vault"
          >
            <Search className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors shrink-0" />
            <span className="hidden md:inline text-gray-300 font-medium font-['Space_Grotesk']">Search</span>
            <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 text-gray-400 rounded border border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* YouTube Channel CTA - Solely renders as an icon button without text label across all desktop & laptop devices */}
          <a
            id="header-youtube-btn"
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 sm:w-9.5 h-9 sm:h-9.5 text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-lg shadow-md shadow-red-950/40 border border-red-500/30 transition-all duration-150 shrink-0 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070913]"
            title={`Game Vault on YouTube (${YOUTUBE_CHANNEL.handle})`}
            aria-label={`Game Vault on YouTube (${YOUTUBE_CHANNEL.handle})`}
          >
            <Youtube className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white shrink-0" aria-hidden="true" />
            <span className="sr-only">Game Vault on YouTube</span>
          </a>

          {/* User Account / Profile or Sign In */}
          {isSignedIn ? (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                id="header-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center justify-center h-9 sm:h-9.5 w-9 sm:w-9.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-gray-200 backdrop-blur-md transition-all cursor-pointer shrink-0"
                title={`Your Vault Profile (${user.name})`}
                aria-label={`Your Vault Profile (${user.name})`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-md object-cover border border-purple-500/50 shrink-0"
                  />
                ) : (
                  <User className="w-4 h-4 text-purple-400 shrink-0" />
                )}
              </button>

              {/* Sign Out (Desktop only, available in mobile drawer) */}
              {onSignOut && (
                <button
                  id="header-signout-btn"
                  onClick={onSignOut}
                  className="hidden lg:flex items-center justify-center h-9 sm:h-9.5 w-9 text-gray-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg backdrop-blur-md transition-all cursor-pointer shrink-0"
                  title="Sign Out of Game Vault"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              id="header-signin-btn"
              onClick={onOpenSignIn}
              className="flex items-center gap-1.5 h-9 sm:h-9.5 px-2.5 sm:px-3 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md shadow-purple-900/40 border border-purple-400/40 transition-all cursor-pointer shrink-0"
              title="Sign In / Register to Game Vault"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Sign In</span>
            </button>
          )}

          {/* Mobile/Tablet Menu Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-9 w-9 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg backdrop-blur-md transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 top-[60px] sm:top-[64px] bg-black/75 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer contents */}
          <div className="fixed top-[60px] sm:top-[64px] left-0 right-0 max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto bg-[#090b16]/98 border-b border-purple-500/30 backdrop-blur-2xl shadow-2xl z-50 p-4 sm:p-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] animate-in slide-in-from-top-2 duration-150 lg:hidden">
            
            {/* Quick Action Banner on Mobile */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-medium border border-white/10"
              >
                <Search className="w-3.5 h-3.5 text-purple-400" />
                Search Database
              </button>
              <a
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 py-2 px-3 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider shrink-0"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                YouTube
              </a>
            </div>

            {/* Section 1: Main Arena & Community */}
            <div className="mb-4">
              <div className="px-1 text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span>Explore Game Vault</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allNavItems.map((item) => {
                  const isActive = currentTab === item.id;
                  const Icon = item.icon;
                  const isPlayGames = item.id === 'play-games';
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                      className={`px-3 py-2.5 rounded-xl font-['Rajdhani'] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-purple-900/40 text-white border border-purple-500/50 shadow-md shadow-purple-900/30'
                          : isPlayGames
                          ? 'bg-purple-950/30 text-purple-300 border border-purple-500/20 hover:bg-purple-950/50 hover:text-white'
                          : 'text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Gaming Tools & Utilities */}
            <div className="pt-3 border-t border-white/10 mb-4">
              <div className="px-1 text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Gaming Utilities & AI</span>
                <span className="text-[9px] text-purple-400">7 Tools</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {toolsItems.map((tool) => {
                  const Icon = tool.icon;
                  const isSelected = currentTab === tool.id;
                  return (
                    <a
                      key={tool.id}
                      href={tool.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(tool.id);
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-500 text-white'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-purple-950/70 border border-purple-500/30 text-purple-400 shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate flex items-center justify-between">
                          <span>{tool.label}</span>
                          {tool.badge && (
                            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-purple-500/30 text-purple-300">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {tool.desc}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Information & Helpdesk */}
            <div className="pt-3 border-t border-white/10 mb-4">
              <div className="px-1 text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-2">
                Vault Desk
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('about');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left font-['Rajdhani'] font-bold text-xs tracking-wider uppercase transition-all ${
                    currentTab === 'about'
                      ? 'bg-white/15 text-white border border-white/25'
                      : 'text-gray-300 bg-white/5 hover:text-white'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>About Vault</span>
                </a>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('contact');
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left font-['Rajdhani'] font-bold text-xs tracking-wider uppercase transition-all ${
                    currentTab === 'contact'
                      ? 'bg-white/15 text-white border border-white/25'
                      : 'text-gray-300 bg-white/5 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Contact Us</span>
                </a>
              </div>
            </div>

            {/* Section 4: User Profile & Auth */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {isSignedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 text-gray-200 rounded-xl text-xs font-medium border border-white/10 cursor-pointer"
                  >
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-md object-cover border border-purple-500/50" />
                    <span>{user.name} (Vault Profile)</span>
                  </button>
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-950/20 hover:bg-red-900/30 text-red-300 rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider border border-red-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      Sign Out of Vault
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenSignIn) onOpenSignIn();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-['Rajdhani'] uppercase tracking-wider shadow-md shadow-purple-950/50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
