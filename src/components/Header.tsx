import React, { useState } from 'react';
import { Search, Youtube, User, Menu, X, Bookmark, Sparkles, LogOut } from 'lucide-react';
import { PageTab, UserAccount } from '../types';
import { VaultLogo } from './VaultLogo';
import { YOUTUBE_CHANNEL } from '../lib/constants';

interface HeaderProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  user: UserAccount;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenProfile,
  user,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'videos', label: 'Videos' },
    { id: 'games', label: 'Games' },
    { id: 'articles', label: 'Articles' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'guides', label: 'Guides' },
    { id: 'forum', label: 'Forum' },
    { id: 'about', label: 'About' }
  ];

  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/30 backdrop-blur-xl border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div onClick={() => handleNavClick('home')} className="cursor-pointer">
          <VaultLogo size="md" showTagline={true} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 font-['Rajdhani'] font-semibold tracking-wider text-base uppercase">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-lg shadow-purple-900/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Indicator Pill from Frosted Glass theme */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-200">Live</span>
          </div>

          {/* Global Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg hover:text-white backdrop-blur-md transition-all group"
            title="Search the Vault (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            <span className="hidden sm:inline text-gray-300 font-medium font-['Space_Grotesk']">Search Vault</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 text-gray-300 rounded border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* YouTube Channel Button */}
          <a
            id="header-youtube-btn"
            href={YOUTUBE_CHANNEL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-lg shadow-lg shadow-red-950/40 border border-red-500/30 transition-all transform hover:scale-[1.02]"
            title={`Game Vault Forum on YouTube (${YOUTUBE_CHANNEL.handle})`}
          >
            <Youtube className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">YouTube</span>
          </a>

          {/* User Account / Profile */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-gray-200 backdrop-blur-md transition-all"
            title="Community Profile & Bookmarks"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-md object-cover border border-purple-500/50"
            />
            <span className="hidden md:inline font-['Space_Grotesk'] font-medium text-gray-300">
              {user.name}
            </span>
          </button>

          {/* Sign Out Action */}
          {onSignOut && (
            <button
              id="header-signout-btn"
              onClick={onSignOut}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-lg backdrop-blur-md transition-all"
              title="Sign Out of Game Vault"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wider">
                Exit
              </span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white bg-white/5 border border-white/10 rounded-lg backdrop-blur-md transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#07080d]/95 backdrop-blur-2xl px-4 py-5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-xl text-left font-['Rajdhani'] font-bold text-base tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/25 shadow-lg'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 text-gray-200 rounded-xl text-sm font-medium border border-white/10 backdrop-blur-md"
            >
              <Search className="w-4 h-4 text-purple-400" />
              Search Vault Database
            </button>
            <a
              href={YOUTUBE_CHANNEL.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold font-['Rajdhani'] uppercase tracking-wider shadow-md shadow-red-950/50"
            >
              <Youtube className="w-4 h-4 fill-white" />
              Watch @gamevaultforum on YouTube
            </a>
            {onSignOut && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-300 rounded-xl text-sm font-bold font-['Rajdhani'] uppercase tracking-wider border border-white/10 hover:border-red-500/30 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Sign Out of Vault
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
