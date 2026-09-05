import React from 'react';
import { ArrowLeft, Cookie, Info, ToggleLeft, Database, Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PageTab } from '../types';

interface CookiePolicyViewProps {
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onNavigateLegal?: (page: 'guidelines' | 'privacy' | 'terms' | 'cookies') => void;
}

export const CookiePolicyView: React.FC<CookiePolicyViewProps> = ({
  onBack,
  onNavigateTab,
  onNavigateLegal
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-['Rajdhani'] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Vault</span>
        </button>

        {/* Legal Hub Navigation Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-['Rajdhani'] uppercase tracking-wider font-semibold">
          <button
            onClick={() => onNavigateLegal?.('guidelines') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Guidelines
          </button>
          <button
            onClick={() => onNavigateLegal?.('privacy') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigateLegal?.('terms') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30">
            Cookie Policy
          </span>
        </div>
      </div>

      {/* Main Cookie Policy Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-white/10 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <Cookie className="w-5 h-5 text-purple-400" />
            <span>Browser Storage & Cookie Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Game Vault Cookie Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
            <span>Last Updated: September 5, 2026</span>
            <span>•</span>
            <span>Policy Status: Active</span>
            <span>•</span>
            <span>Operator: Game Vault Forum</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pt-2">
            This Cookie Policy clarifies how Game Vault Forum utilizes HTTP cookies, browser local storage (<code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 text-xs font-mono">localStorage</code>), and session mechanisms. We adhere to transparent, privacy-first design principles: we do not utilize invasive advertising trackers.
          </p>
        </div>

        {/* Cookie Policy Content */}
        <div className="space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
          {/* Section 1 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              <span>1. What Are Cookies and Local Storage?</span>
            </h2>
            <p className="text-gray-300">
              Cookies are small data files placed on your device by websites you visit. Similar technologies include web storage (<code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 text-xs font-mono">localStorage</code> and <code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 text-xs font-mono">sessionStorage</code>), which allow client-side web applications to remember your state, authentication status, and interaction preferences across visits without server lag.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>2. Storage Keys & Categories We Utilize</span>
            </h2>
            <p className="text-gray-300">
              Below is the comprehensive list of client-side storage technologies utilized on Game Vault Forum:
            </p>

            {/* Storage Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/5 text-gray-300 uppercase font-['Rajdhani'] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Identifier / Key</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Function / Purpose</th>
                    <th className="py-3 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-mono text-xs">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">firebase:authUser</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Essential</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Stores secure Firebase authentication credentials so you remain safely signed in across browser reloads.</td>
                    <td className="py-3 px-4">Persistent (until sign-out)</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">gv_user_liked_*</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">Functional</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Tracks which articles, videos, guides, and forum topics you have endorsed with a like.</td>
                    <td className="py-3 px-4">Persistent</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">gv_forum_user_v2</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">Functional</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Preserves your local profile avatar selection, bio, and reading list bookmarks across sessions.</td>
                    <td className="py-3 px-4">Persistent</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">gv_forum_topics_v2</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">Functional</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Caches recently authored tactical threads and active replies locally for instant zero-latency loading.</td>
                    <td className="py-3 px-4">Persistent</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">gv_post_comments_v2</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">Functional</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Stores real-time operative commentary published on articles and video dossiers.</td>
                    <td className="py-3 px-4">Persistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>3. Zero Third-Party Tracking Pixels</span>
            </h2>
            <p className="text-gray-300">
              Unlike mainstream gaming portals cluttered with surveillance advertising networks, <strong className="text-white">Game Vault Forum operates without third-party behavioral advertising cookies, affiliate ad beacons, or cross-site tracking pixels</strong>.
            </p>
            <p className="text-sm text-gray-400">
              When video dossiers are embedded from YouTube, we utilize privacy-enhanced mode parameters (<code className="px-1 py-0.5 rounded bg-white/10 text-cyan-300 text-xs">youtube-nocookie.com</code>) to restrict external profiling.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>4. How to Manage or Clear Browser Storage</span>
            </h2>
            <p className="text-gray-300">
              You retain full authority over your device storage. You can manage or clear cookies and local storage through your browser settings:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Google Chrome & Brave</h4>
                <p className="text-gray-400">Settings &gt; Privacy and Security &gt; Third-party cookies &gt; Clear site data.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Mozilla Firefox</h4>
                <p className="text-gray-400">Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data &gt; Clear Data.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Apple Safari</h4>
                <p className="text-gray-400">Preferences &gt; Privacy &gt; Manage Website Data &gt; Remove.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Microsoft Edge</h4>
                <p className="text-gray-400">Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</p>
              </div>
            </div>
            <p className="text-xs text-amber-300/80 pt-1">
              *Note: Clearing essential local storage will log you out of your operative profile and reset your local bookmark cache until you sign in again.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" />
              <span>5. Inquiries & Technical Contact</span>
            </h2>
            <p className="text-gray-300">
              For any questions regarding our storage practices or data protocols:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm space-y-1 font-mono text-gray-300">
              <p className="text-white font-bold font-['Rajdhani'] uppercase tracking-wider">Game Vault Technical Architecture</p>
              <p>Contact: Joel Ayuba • Lead Developer & Creator</p>
              <p>Email: <span className="text-purple-400">joelotis40@gmail.com</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
