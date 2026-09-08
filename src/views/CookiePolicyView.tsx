import React from 'react';
import { ArrowLeft, Cookie, Info, ToggleLeft, Database, Sliders, ShieldCheck, CheckCircle2, Megaphone, ExternalLink } from 'lucide-react';
import { PageTab } from '../types';

interface CookiePolicyViewProps {
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onNavigateLegal?: (page: 'guidelines' | 'privacy' | 'terms' | 'cookies' | 'contact') => void;
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
          <button
            onClick={() => onNavigateLegal?.('contact') || onNavigateTab('contact')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Main Cookie Policy Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-white/10 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <Cookie className="w-5 h-5 text-purple-400" />
            <span>Browser Storage, Advertising Cookies & User Consent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Game Vault Cookie Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
            <span>Last Updated: September 7, 2026</span>
            <span>•</span>
            <span>Policy Status: Active & AdSense Compliant</span>
            <span>•</span>
            <span>Operator: Game Vault Forum</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pt-2">
            This Cookie Policy clarifies how Game Vault Forum utilizes HTTP cookies, browser local storage (<code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 text-xs font-mono">localStorage</code>), and third-party advertising cookies including Google AdSense. We believe in transparency and providing clear user controls over personal data and tracking technologies.
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
              Cookies are small text files placed on your computer or mobile device when you visit a website. Local storage (<code className="px-1.5 py-0.5 rounded bg-white/10 text-purple-300 text-xs font-mono">localStorage</code>) and session storage are modern HTML5 web technologies that store data directly within your browser client. These technologies allow websites to maintain your signed-in session, remember your interface preferences, ensure fast loading, and support authorized digital advertising services.
            </p>
          </section>

          {/* Section 2: Essential and Functional Storage */}
          <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>2. Essential & Functional Storage Technologies</span>
            </h2>
            <p className="text-gray-300">
              We utilize essential first-party storage to provide core services and authentication:
            </p>

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
                    <td className="py-3 px-4 font-bold text-purple-300">gv_cookie_consent_choice</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Essential</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Records your cookie preferences and consent choice to comply with GDPR & ePrivacy regulations.</td>
                    <td className="py-3 px-4">Persistent (1 year)</td>
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
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Google AdSense & Third-Party Advertising Cookies (OFFICIAL AD SENSE COMPLIANCE) */}
          <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-400" />
              <span>3. Google AdSense & Third-Party Advertising Cookies</span>
            </h2>
            <p className="text-gray-300">
              Game Vault Forum partners with Google AdSense and third-party advertising networks to display relevant advertisements. When you browse our platform, Google and its advertising partners may place cookies on your device to serve ads, frequency cap identical advertisements, and detect automated click fraud.
            </p>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-white/5 text-gray-300 uppercase font-['Rajdhani'] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Cookie Name</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Purpose & Function</th>
                    <th className="py-3 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-mono text-xs">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">__gads</td>
                    <td className="py-3 px-4 text-gray-400">Google AdSense</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Used by Google to serve advertisements, measure ad interactions, and prevent malicious click activity.</td>
                    <td className="py-3 px-4">13 months</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">__gpi</td>
                    <td className="py-3 px-4 text-gray-400">Google AdSense</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Google Publisher Tag identifier used to measure impressions and report delivery performance.</td>
                    <td className="py-3 px-4">13 months</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">IDE</td>
                    <td className="py-3 px-4 text-gray-400">DoubleClick (Google)</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Used to measure the efficacy of advertisements and present targeted ads to users across websites.</td>
                    <td className="py-3 px-4">1 year</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-300">test_cookie</td>
                    <td className="py-3 px-4 text-gray-400">DoubleClick</td>
                    <td className="py-3 px-4 font-sans text-gray-300">Transient session check to determine whether the user's browser supports cookies.</td>
                    <td className="py-3 px-4">15 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our visitors based on their visits to Game Vault Forum and other sites across the internet.
            </p>
          </section>

          {/* Section 4: Managing Cookie Preferences */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>4. Managing Your Cookie Choices & Opt-Out Options</span>
            </h2>
            <p className="text-gray-300">
              You possess complete control over your browser storage and advertising cookies:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Google Ads Settings</h4>
                <p className="text-gray-400">Personalize or disable interest-based ads via <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google Ads Settings</a>.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Digital Advertising Alliance</h4>
                <p className="text-gray-400">Opt out of third-party behavioral advertising at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">aboutads.info/choices</a>.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">European Interactive Ad Alliance</h4>
                <p className="text-gray-400">For EEA/UK residents, manage ad consent via <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">youronlinechoices.eu</a>.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase">Browser Settings</h4>
                <p className="text-gray-400">Block or clear third-party cookies directly via your browser's Privacy & Security settings.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Inquiries & Contact */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" />
              <span>5. Inquiries & Technical Contact</span>
            </h2>
            <p className="text-gray-300">
              For any questions regarding our storage practices, cookie policies, or advertising compliance:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm space-y-1 font-mono text-gray-300">
              <p className="text-white font-bold font-['Rajdhani'] uppercase tracking-wider">Game Vault Technical & Editorial Desk</p>
              <p>Publisher: Joel Ayuba</p>
              <p>Direct Email: <a href="mailto:contact@gamevault.forum" className="text-purple-400 hover:underline">contact@gamevault.forum</a></p>
              <p>Online Form: <button onClick={() => onNavigateLegal?.('contact') || onNavigateTab('contact')} className="text-cyan-400 hover:underline cursor-pointer">Official Contact Desk (/contact)</button></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
