import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell, FileText, ExternalLink } from 'lucide-react';
import { PageTab } from '../types';

interface PrivacyPolicyViewProps {
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onNavigateLegal?: (page: 'guidelines' | 'privacy' | 'terms' | 'cookies') => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
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
          <span className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30">
            Privacy Policy
          </span>
          <button
            onClick={() => onNavigateLegal?.('terms') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Terms of Service
          </button>
          <button
            onClick={() => onNavigateLegal?.('cookies') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Cookie Policy
          </button>
        </div>
      </div>

      {/* Main Privacy Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-white/10 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Privacy & Data Protection Protocols</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Game Vault Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
            <span>Effective Date: September 5, 2026</span>
            <span>•</span>
            <span>Version 2.4</span>
            <span>•</span>
            <span>Founder & Data Controller: Joel Ayuba</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pt-2">
            At Game Vault Forum, accessible from our digital vault platforms, your privacy is paramount. We believe in strict data minimization: we collect only what is essential to provide high-quality tactical gaming analysis, maintain authenticated community discussions, and protect our platform from automated abuse.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
          {/* Section 1 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-gray-300">
              We collect information to ensure seamless authentication and meaningful interaction across the vault:
            </p>
            <ul className="space-y-2.5 list-none pl-1 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">Account Credentials:</strong> When you register an operative profile, we collect your display name, username, email address, and optional avatar image. If you authenticate via Google Sign-In, we receive verification tokens and your public profile handle as permitted by your Google account settings.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">Community Contributions:</strong> When you author forum threads, tactical replies, article comments, game dossiers ratings, or guide insights, this content is published publicly under your username.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">Saved Preferences & Bookmarks:</strong> We store your reading list bookmarks (articles, guides, reviews, videos) and like interactions locally and in your encrypted user profile to provide persistent cross-session continuity.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">Newsletter Subscriptions:</strong> If you voluntarily subscribe to the Vault Dispatch, we store your email address solely to deliver curated tactical recaps and breaking gaming essays.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>2. How We Use Your Information</span>
            </h2>
            <p className="text-gray-300">
              Your data is utilized strictly for direct operational services and community integrity:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h3 className="font-bold font-['Rajdhani'] uppercase text-purple-300 tracking-wider">Account Operations</h3>
                <p className="text-xs text-gray-400">Authenticating sessions, managing profile avatars, and enabling like and comment privileges for verified operatives.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h3 className="font-bold font-['Rajdhani'] uppercase text-cyan-300 tracking-wider">Toxicity & Spam Defense</h3>
                <p className="text-xs text-gray-400">Preventing automated bot campaigns, brigading, unflagged spoilers, and malicious conduct across forum threads.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h3 className="font-bold font-['Rajdhani'] uppercase text-emerald-300 tracking-wider">Tactical Communications</h3>
                <p className="text-xs text-gray-400">Delivering essential account notifications, security alerts, and requested weekly gaming briefings.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <h3 className="font-bold font-['Rajdhani'] uppercase text-amber-300 tracking-wider">Platform Optimization</h3>
                <p className="text-xs text-gray-400">Evaluating technical performance, responsive layout fidelity, and reading speeds without intrusive fingerprinting.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>3. Zero Sale of Personal Data</span>
            </h2>
            <p className="text-gray-300">
              We stand firmly against predatory data broker ecosystems. <strong className="text-white">Game Vault Forum has never sold, rented, leased, or traded user personal data</strong> to third-party advertisers, data aggregators, or behavioral marketing syndicates, and will never do so in the future.
            </p>
            <p className="text-sm text-gray-400">
              Any telemetry or aggregated reading stats shared internally are strictly anonymized and used only to evaluate which editorial formats—such as longform analytical retrospectives or tactical weapon guides—most effectively serve our community.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>4. Your Data Rights & Control</span>
            </h2>
            <p className="text-gray-300">
              Regardless of your geographic jurisdiction (including GDPR in the EU/UK and CCPA/CPRA in California), Game Vault extends comprehensive rights to all operatives:
            </p>
            <ul className="space-y-2 list-none pl-1 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Right of Access:</strong> You can inspect your operative dossier, bookmarks, liked content, and comment history at any time via your user profile modal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Right to Rectification:</strong> You can edit your profile display name, avatar, and authored forum content directly through the interface.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Right of Erasure ("Right to be Forgotten"):</strong> You may request complete deletion of your account and disassociation of all forum contributions by submitting a deletion inquiry.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span><strong className="text-white">Unsubscribe Anytime:</strong> Every newsletter dispatch includes an instant, one-click opt-out link that immediately expunges your email from subsequent dispatches.</span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>5. Security Infrastructure & Hosting</span>
            </h2>
            <p className="text-gray-300">
              Game Vault Forum utilizes Google Cloud Platform and Firebase enterprise-grade infrastructure. All data in transit is encrypted using modern TLS 1.3 cryptographic protocols, and databases are encrypted at rest with AES-256 standards. Access to administrative systems is restricted with multi-factor authentication.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <span>6. Contact Information & Privacy Queries</span>
            </h2>
            <p className="text-gray-300">
              For any questions, data subject requests, or privacy clarifications, you may reach our team directly:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm space-y-1.5 font-mono text-gray-300">
              <p className="text-white font-bold font-['Rajdhani'] uppercase tracking-wider">Game Vault Privacy Office</p>
              <p>Attn: Joel Ayuba, Lead Creator & Data Protection Officer</p>
              <p>Email: <span className="text-purple-400">joelotis40@gmail.com</span></p>
              <p>Platform: Game Vault Forum (youtube.com/@GameVaultForum)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
