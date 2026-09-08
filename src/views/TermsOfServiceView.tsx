import React from 'react';
import { ArrowLeft, Scale, ShieldAlert, Users, MessageSquare, AlertCircle, Award, CheckCircle2, Megaphone, ExternalLink } from 'lucide-react';
import { PageTab } from '../types';

interface TermsOfServiceViewProps {
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onNavigateLegal?: (page: 'guidelines' | 'privacy' | 'terms' | 'cookies' | 'contact') => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({
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
          <span className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30">
            Terms of Service
          </span>
          <button
            onClick={() => onNavigateLegal?.('cookies') || onNavigateTab('forum')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Cookie Policy
          </button>
          <button
            onClick={() => onNavigateLegal?.('contact') || onNavigateTab('contact')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Main Terms Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-white/10 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <Scale className="w-5 h-5 text-purple-400" />
            <span>Community Agreement & Legal Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Game Vault Terms of Service
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
            <span>Last Modified: September 7, 2026</span>
            <span>•</span>
            <span>Version 3.2</span>
            <span>•</span>
            <span>Governing Platform: Game Vault Forum</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pt-2">
            Welcome to Game Vault Forum. By creating an operative account, browsing our curated game dossiers, reading tactical guides, or participating in forum discussions, you agree to comply with and be legally bound by these Terms of Service.
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
          {/* Section 1 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>1. Account Registration & Operative Eligibility</span>
            </h2>
            <p className="text-gray-300">
              To participate in community discourse, post new tactical threads, comment on analysis articles, or cast likes on community contributions, you must register a verified user account.
            </p>
            <ul className="space-y-2 list-none pl-1 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Minimum Age:</strong> You must be at least 13 years of age (or the minimum legal age for digital consent in your jurisdiction) to register an account.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">Verification & Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your username.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span><strong className="text-white">One Person, One Handle:</strong> Impersonation of other players, professional esports competitors, studio developers, or Game Vault moderators is strictly prohibited.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>2. User-Generated Content & Standards of Conduct</span>
            </h2>
            <p className="text-gray-300">
              When publishing tactical guides, forum threads, responses, or game dossier impressions, you retain ownership of your original words while granting Game Vault Forum a worldwide, non-exclusive, royalty-free license to host, display, index, and distribute your content across our platform.
            </p>
            <p className="text-sm text-gray-400">
              All content must comply with our <button onClick={() => onNavigateLegal?.('guidelines') || onNavigateTab('forum')} className="text-cyan-400 hover:underline">Community Guidelines</button>. You may not publish unlawful harassment, hate speech, malware, pirated software keys, or automated spam.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>3. Intellectual Property & Transformative Fair Use</span>
            </h2>
            <p className="text-gray-300">
              All video game trademarks, logos, screenshots, and artwork (including titles from Nintendo, Rockstar Games, Mojang, Activision, FromSoftware, Sony, Microsoft, Valve, and others) are the property of their respective publishers and developers. Their inclusion on Game Vault Forum constitutes transformative fair use for educational analysis, commentary, reviews, and news reporting under international copyright frameworks.
            </p>
            <p className="text-sm text-gray-300">
              All original editorial essays, tactical guides, site branding, and software architecture are protected under international copyright law as intellectual property of Game Vault Forum.
            </p>
          </section>

          {/* Section 4: Third-Party Advertisements, Google AdSense & External Links */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-400" />
              <span>4. Third-Party Advertisements & Google AdSense</span>
            </h2>
            <p className="text-gray-300">
              Game Vault Forum displays third-party advertisements served by Google AdSense and authorized digital advertising vendors. 
            </p>
            <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
              <li>
                Advertisements are labeled "Advertisement" or "Sponsored" to clearly distinguish them from original editorial journalism and forum content.
              </li>
              <li>
                Clicking on an advertisement routes you to third-party web domains operated by independent advertisers. Game Vault Forum does not endorse, guarantee, or assume liability for the products, software, or services offered by third-party advertisers.
              </li>
              <li>
                Any automated bot activity, artificial click inflation, or fraudulent engagement with advertisements is strictly prohibited and constitutes a violation of these Terms.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>5. Disclaimers & Limitation of Liability</span>
            </h2>
            <p className="text-gray-300">
              Game Vault Forum is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
            </p>
            <p className="text-sm text-gray-400">
              We do not warrant that the platform will be error-free, uninterrupted, or completely resilient against malicious third-party attacks. Under no circumstances shall Game Vault Forum, founder Joel Ayuba, or site contributors be liable for any indirect, incidental, special, or consequential damages arising from your access to or inability to access the platform.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              <span>6. Modifications & Governing Law</span>
            </h2>
            <p className="text-gray-300">
              We reserve the right to revise or replace these Terms at any time. When substantial changes are made, we will update the version number and effective date at the top of this document.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm space-y-1 font-mono text-gray-300">
              <p className="text-white font-bold font-['Rajdhani'] uppercase tracking-wider">Legal Inquiries & Notice</p>
              <p>Game Vault Operations • Joel Ayuba</p>
              <p>Contact: <a href="mailto:contact@gamevault.forum" className="text-purple-400 hover:underline">contact@gamevault.forum</a></p>
              <p>Direct Desk: <button onClick={() => onNavigateLegal?.('contact') || onNavigateTab('contact')} className="text-cyan-400 hover:underline cursor-pointer">Official Contact Desk (/contact)</button></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
