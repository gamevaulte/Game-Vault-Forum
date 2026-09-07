import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell, FileText, ExternalLink, Megaphone, CheckCircle2, HelpCircle } from 'lucide-react';
import { PageTab } from '../types';

interface PrivacyPolicyViewProps {
  onBack: () => void;
  onNavigateTab: (tab: PageTab) => void;
  onNavigateLegal?: (page: 'guidelines' | 'privacy' | 'terms' | 'cookies' | 'contact') => void;
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
          <button
            onClick={() => onNavigateLegal?.('contact') || onNavigateTab('contact')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Main Privacy Card */}
      <div className="rounded-3xl bg-[#0e101a] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-white/10 pb-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-['Rajdhani'] font-bold uppercase tracking-wider">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Privacy, Advertising & Data Protection Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Game Vault Privacy Policy
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
            <span>Last Updated: September 7, 2026</span>
            <span>•</span>
            <span>Policy Status: Active & AdSense Compliant</span>
            <span>•</span>
            <span>Publisher: Joel Ayuba (Game Vault Forum)</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-['Inter'] pt-2">
            At Game Vault Forum (accessible from <span className="text-purple-300 font-mono">https://www.gamevault.forum</span>), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of personal information that is received and collected by Game Vault Forum and how it is used, including disclosures concerning third-party advertising partners such as Google AdSense.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-sm sm:text-base text-gray-300 leading-relaxed font-['Inter']">
          {/* Section 1: Information We Collect */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-gray-300">
              We collect information to provide and improve our gaming media services, authenticate community accounts, and maintain platform security:
            </p>
            <ul className="space-y-2.5 list-none pl-1 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">User-Provided Account Details:</strong> When you register an account, we collect your display name, username, email address, and voluntary profile bio or avatar. If authenticating via Google Sign-In, Firebase Auth securely transmits authentication tokens in accordance with your Google permission settings.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">Public Community Contributions:</strong> Discussion threads created in the forum, tactical replies, guide comments, and user likes are published openly with your chosen username and timestamp.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-white font-medium">Direct Inquiries:</strong> When submitting an editorial pitch, advertising question, or support request through our Contact page, we receive your name, email address, and message contents to respond to your inquiry.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2: Log Files */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              <span>2. Log Files & Automated Data</span>
            </h2>
            <p className="text-gray-300">
              Like many standard web platforms, Game Vault Forum makes use of log files. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and the number of clicks. This information is used to analyze trends, administer the site, prevent malicious automated spam or Denial of Service attacks, track user movement around the site, and gather broad demographic information. IP addresses and other such information are not linked to any personally identifiable information in these diagnostic logs.
            </p>
          </section>

          {/* Section 3: Google AdSense & Third-Party Advertising Partners (MANDATORY GOOGLE REQUIREMENT) */}
          <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" />
                <span>3. Google AdSense & Third-Party Advertising Partners</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Official Disclosure
              </span>
            </div>

            <p className="text-gray-300">
              We may display advertisements served by Google AdSense and third-party advertising vendors on Game Vault Forum to support our independent gaming coverage and community infrastructure.
            </p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Google AdSense Cookies & The DoubleClick DART Cookie
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-300 list-disc pl-5">
                  <li>
                    Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                  </li>
                  <li>
                    Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Game Vault Forum and/or other sites on the Internet.
                  </li>
                  <li>
                    Google may use the DoubleClick DART cookie or newer privacy-preserving ad tokens to serve personalized ads according to user interests and general geographic region.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <h4 className="font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  How You Can Opt Out of Personalized Advertising
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Users may opt out of personalized advertising at any time through the following official controls:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-purple-300 hover:text-white transition-colors group"
                  >
                    <span>Google Ad Settings (Ads Preference Manager)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-cyan-300 hover:text-white transition-colors group"
                  >
                    <span>AboutAds.info Opt-Out Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href="https://optout.networkadvertising.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-emerald-300 hover:text-white transition-colors group"
                  >
                    <span>Network Advertising Initiative (NAI)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href="https://www.youronlinechoices.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-xs text-amber-300 hover:text-white transition-colors group"
                  >
                    <span>Your Online Choices (EDAA for EU/EEA)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  For more detailed information regarding Google's advertising practices and how Google uses data when you visit partner sites, visit <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google Advertising Technologies & Policies</a>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: CCPA & CPRA Privacy Rights */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>4. California Privacy Rights (CCPA / CPRA)</span>
            </h2>
            <p className="text-gray-300">
              Under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), California residents have specific rights regarding their personal information:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-sm text-gray-300">
              <li>
                <strong className="text-white">Right to Know:</strong> You may request that a business disclose the categories and specific pieces of personal data collected about you.
              </li>
              <li>
                <strong className="text-white">Right to Delete:</strong> You may request that a business delete any personal data collected from you.
              </li>
              <li>
                <strong className="text-white">Right to Opt-Out of Sale or Sharing:</strong> Game Vault Forum does not sell your personal information to third parties for monetary compensation. We honor Global Privacy Control (GPC) signals and provide cookie preference controls.
              </li>
              <li>
                <strong className="text-white">Right to Non-Discrimination:</strong> We will never deny services, charge different prices, or provide a lesser quality of service for exercising your privacy rights.
              </li>
            </ul>
          </section>

          {/* Section 5: GDPR Data Protection Rights */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>5. GDPR & UK Data Protection Rights</span>
            </h2>
            <p className="text-gray-300">
              For users located in the European Union (EU) or United Kingdom (UK), our processing of personal data is governed by the General Data Protection Regulation (GDPR). You possess the following statutory rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-1">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-white font-['Rajdhani'] uppercase">Right of Access</span>
                <p className="text-gray-400">Request copies of your personal data stored in our databases.</p>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-white font-['Rajdhani'] uppercase">Right to Rectification</span>
                <p className="text-gray-400">Request correction of inaccurate or incomplete profile records.</p>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-white font-['Rajdhani'] uppercase">Right to Erasure</span>
                <p className="text-gray-400">Request deletion of your account and associated comments.</p>
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                <span className="font-bold text-white font-['Rajdhani'] uppercase">Right to Restrict Processing</span>
                <p className="text-gray-400">Request restriction of data processing under certain statutory circumstances.</p>
              </div>
            </div>
          </section>

          {/* Section 6: COPPA (Children's Privacy) */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>6. Children's Online Privacy Protection (COPPA)</span>
            </h2>
            <p className="text-gray-300">
              Protecting the online privacy of young children is especially critical. Game Vault Forum does not knowingly collect any Personally Identifiable Information from children under the age of 13. Our content is curated for general gaming audiences and adult enthusiasts.
            </p>
            <p className="text-sm text-gray-400">
              If a parent or guardian believes that Game Vault Forum has in its database the personal information of a child under 13, please contact us immediately at <span className="text-purple-300 font-mono">joelotis40@gmail.com</span>, and we will utilize our best efforts to promptly remove such information from our records.
            </p>
          </section>

          {/* Section 7: Security & Infrastructure */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>7. Security Infrastructure & Hosting</span>
            </h2>
            <p className="text-gray-300">
              Game Vault Forum utilizes Google Cloud Platform and Firebase enterprise-grade infrastructure. All data in transit is encrypted using modern TLS 1.3 cryptographic protocols, and databases are encrypted at rest with AES-256 standards. Access to administrative systems is restricted with multi-factor authentication.
            </p>
          </section>

          {/* Section 8: Contact Information */}
          <section className="space-y-3 p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h2 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <span>8. Contact Information & Privacy Inquiries</span>
            </h2>
            <p className="text-gray-300">
              If you have additional questions, wish to exercise any statutory privacy rights, or require more information about our Privacy Policy or advertising partnerships, do not hesitate to contact us:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm space-y-1.5 font-mono text-gray-300">
              <p className="text-white font-bold font-['Rajdhani'] uppercase tracking-wider">Game Vault Editorial & Privacy Office</p>
              <p>Publisher & Lead Creator: Joel Ayuba</p>
              <p>Official Email: <a href="mailto:joelotis40@gmail.com" className="text-purple-400 hover:underline">joelotis40@gmail.com</a></p>
              <p>Online Desk: <button onClick={() => onNavigateLegal?.('contact') || onNavigateTab('contact')} className="text-cyan-400 hover:underline cursor-pointer">Official Contact Desk (/contact)</button></p>
              <p>Platform: Game Vault Forum (youtube.com/@GameVaultForum)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
