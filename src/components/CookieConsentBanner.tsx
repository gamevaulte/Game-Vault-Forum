import React, { useState, useEffect } from 'react';
import { Cookie, Shield, X, Check, Settings, ExternalLink } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenCookiePolicy: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenCookiePolicy,
  onOpenPrivacyPolicy
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [adsConsent, setAdsConsent] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('gv_cookie_consent_choice');
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // If local storage is disabled
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('gv_cookie_consent_choice', 'accepted_all');
      localStorage.setItem('gv_cookie_consent_date', new Date().toISOString());
    } catch (e) {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('gv_cookie_consent_choice', 'essential_only');
      localStorage.setItem('gv_cookie_consent_date', new Date().toISOString());
    } catch (e) {}
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem(
        'gv_cookie_consent_choice',
        adsConsent ? 'accepted_all' : 'essential_only'
      );
      localStorage.setItem('gv_cookie_consent_date', new Date().toISOString());
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-5 rounded-2xl bg-[#0e101c]/95 border border-purple-500/30 shadow-2xl backdrop-blur-xl text-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-['Space_Grotesk'] text-white">
                Privacy & Cookie Consent
              </h4>
              <span className="text-[11px] font-mono text-purple-300">
                Google AdSense & Essential Cookies
              </span>
            </div>
          </div>
          <button
            onClick={handleEssentialOnly}
            className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close and continue with essential cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!showPreferences ? (
          <>
            <p className="text-xs text-gray-300 leading-relaxed font-['Inter']">
              Game Vault Forum and our advertising partner Google use cookies and local storage to provide secure authentication, measure readership, and display personalized or contextual advertisements.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
              <button
                onClick={onOpenCookiePolicy}
                className="text-purple-400 hover:underline cursor-pointer"
              >
                Cookie Policy
              </button>
              <span>•</span>
              <button
                onClick={onOpenPrivacyPolicy}
                className="text-purple-400 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-300 inline-flex items-center gap-0.5"
              >
                <span>Google Ad Terms</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-900/30 transition-colors cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={handleEssentialOnly}
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                title="Customize preferences"
                aria-label="Customize cookie preferences"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <strong className="text-white block font-medium">Strictly Essential</strong>
                  <span className="text-[11px] text-gray-400">Authentication & security state</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">Always Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <strong className="text-white block font-medium">Advertising & Analytics</strong>
                  <span className="text-[11px] text-gray-400">Google AdSense ad delivery & metrics</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adsConsent}
                    onChange={(e) => setAdsConsent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowPreferences(false)}
                className="py-2 px-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-['Rajdhani'] font-bold uppercase rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
