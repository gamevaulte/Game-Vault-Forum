import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, CheckCircle2, X, ArrowRight, ShieldCheck, Gamepad2, Bell } from 'lucide-react';
import { VaultLogo } from './VaultLogo';
import { saveNewsletterSubscriber } from '../lib/firebase';

interface EmailSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed?: (email: string) => void;
}

export const EmailSubscribeModal: React.FC<EmailSubscribeModalProps> = ({
  isOpen,
  onClose,
  onSubscribed
}) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 3) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Store in Firebase Subscribers and Subscriber collections
      await saveNewsletterSubscriber(cleanEmail, 'visitor_popup_10s');
      setSubmitting(false);
      setSuccess(true);
      if (onSubscribed) {
        onSubscribed(cleanEmail);
      }
      // Auto dismiss after 3.5 seconds
      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err: any) {
      setSubmitting(false);
      const msg = err?.message || 'Unable to subscribe at this moment. Please check your connection.';
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-purple-900/20 blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[300px] bg-cyan-900/15 blur-[90px] rounded-full pointer-events-none" />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscribe-modal-title"
        className="relative w-full max-w-lg bg-[#0d0f1a]/95 backdrop-blur-2xl border border-purple-500/25 rounded-3xl shadow-2xl shadow-black/90 p-6 sm:p-8 overflow-hidden z-10 animate-in zoom-in-95 duration-300"
      >
        {/* Close Icon Button */}
        <button
          id="close-email-subscribe-modal-btn"
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer group"
          aria-label="Close subscription form"
        >
          <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-['Rajdhani'] text-white tracking-wide">
                You're Locked Into The Vault!
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
                Your email <span className="text-purple-300 font-semibold">{email}</span> has been securely saved to our Subscriber registry. Get ready for curated gaming intel and updates.
              </p>
            </div>

            <div className="pt-3">
              <button
                id="close-email-subscribe-success-btn"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-sm transition-all cursor-pointer border border-white/10"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Badge & Title */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-['Rajdhani'] font-semibold uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Vault Dispatch · Stay in the Know</span>
              </div>

              <div className="flex justify-center my-2">
                <VaultLogo size="md" showTagline={false} />
              </div>

              <h2 
                id="subscribe-modal-title"
                className="text-2xl sm:text-3xl font-black font-['Rajdhani'] uppercase tracking-wider text-white"
              >
                Never Miss a Game Drop
              </h2>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                Join our community of passionate gamers. Get honest reviews, hardware benchmark breakdowns, PC requirements, and tactical guides delivered straight to your inbox.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <Gamepad2 className="w-4 h-4 text-purple-400 mx-auto" />
                <p className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wide text-gray-300">Reviews & News</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <Sparkles className="w-4 h-4 text-cyan-400 mx-auto" />
                <p className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wide text-gray-300">PC Benchmarks</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                <p className="text-[11px] font-['Rajdhani'] font-bold uppercase tracking-wide text-gray-300">No Spam Ever</p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="subscriber-popup-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  disabled={submitting}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <button
                id="submit-subscriber-popup-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Subscriber Registry...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe to Stay in the Know</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[11px] text-gray-500">
              By subscribing, you agree to our privacy policy. One-click unsubscribe at any time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
