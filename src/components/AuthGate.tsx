import React, { useState, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider, addRegisteredUserToFirestore, updateUserInFirestore, firebaseConfig } from '../lib/firebase';
import { VaultLogo } from './VaultLogo';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Upload,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Camera,
  X,
  RefreshCw,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  Globe
} from 'lucide-react';

interface AuthGateProps {
  onSuccess?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  initialMode?: 'signin' | 'register';
  promptMessage?: string;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onSuccess,
  onClose,
  isModal = false,
  initialMode = 'signin',
  promptMessage
}) => {
  const [activeMode, setActiveMode] = useState<'signin' | 'register' | 'verification' | 'forgot-password'>(initialMode);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRepeatPassword, setRegRepeatPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegRepeatPassword, setShowRegRepeatPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [regError, setRegError] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showDomainHelp, setShowDomainHelp] = useState(false);
  const [copiedType, setCopiedType] = useState<'wildcard' | 'exact' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Profile Photo Upload with automatic Canvas compression
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setRegError('Image must be under 10MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (readerEvt) => {
        const rawResult = readerEvt.target?.result as string;
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const size = 128;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const minDim = Math.min(img.width, img.height);
              const sx = (img.width - minDim) / 2;
              const sy = (img.height - minDim) / 2;
              ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
              const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
              setAvatarPreview(compressedUrl);
            } else {
              setAvatarPreview(rawResult);
            }
          } catch {
            setAvatarPreview(rawResult);
          }
        };
        img.onerror = () => {
          setAvatarPreview(rawResult);
        };
        img.src = rawResult;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open Forgot Password View (passes email from sign-in form if entered)
  const handleOpenForgotPassword = () => {
    setResetEmail(loginEmail.trim());
    setResetError(null);
    setResetSent(false);
    setActiveMode('forgot-password');
  };

  // Trigger Password Reset Email via Firebase Authentication
  const handleGetResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const emailToReset = resetEmail.trim();
    if (!emailToReset) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, emailToReset);
      setResetSent(true);
    } catch (err: any) {
      console.warn('Firebase password reset error:', err?.code, err?.message);
      if (err?.code === 'auth/user-not-found') {
        setResetError('No account found with this email address.');
      } else if (err?.code === 'auth/invalid-email') {
        setResetError('Please enter a valid email address.');
      } else {
        setResetError(err?.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Sign In with Email & Password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const email = loginEmail.trim().toLowerCase();
    if (!email || !loginPassword) {
      setLoginError('incorrect login details');
      return;
    }

    setLoginLoading(true);
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, loginPassword);
      } catch (signInErr: any) {
        // If designated administrator credentials are used, auto-create in Firebase Auth if not already existing
        if (
          email === 'contact@gamevault.forum' &&
          loginPassword === 'Freaky777@' &&
          (signInErr?.code === 'auth/user-not-found' ||
           signInErr?.code === 'auth/invalid-credential' ||
           signInErr?.code === 'auth/invalid-login-credentials')
        ) {
          userCredential = await createUserWithEmailAndPassword(auth, email, loginPassword);
          try {
            await updateProfile(userCredential.user, {
              displayName: 'Vault Administrator',
              photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
            });
          } catch (_) {}
        } else {
          throw signInErr;
        }
      }
      
      // Ensure user document exists in Firestore 'Users' and refresh lastLoginAt
      if (userCredential && userCredential.user) {
        try {
          await addRegisteredUserToFirestore({
            uid: userCredential.user.uid,
            email: userCredential.user.email || email,
            displayName: userCredential.user.displayName || 'Vault Administrator',
            photoURL: userCredential.user.photoURL,
            emailVerified: userCredential.user.emailVerified
          });
        } catch (syncErr) {
          console.warn('Firestore user synchronization on sign in warning:', syncErr);
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.warn('Firebase login error:', err?.code, err?.message);
      // User requirement: If login credentials are incorrect display "incorrect login details" in the ui
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/invalid-login-credentials'
      ) {
        setLoginError('incorrect login details');
      } else if (err?.code === 'auth/invalid-email') {
        setLoginError('Please enter a valid email address.');
      } else if (err?.code === 'auth/user-disabled') {
        setLoginError('This user account has been disabled. Please contact support.');
      } else if (err?.code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Access temporarily restricted. Try again later or reset password.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setLoginError('Email/Password provider is not enabled in Firebase Console. Please enable Email/Password in Authentication settings.');
      } else if (err?.code === 'auth/network-request-failed') {
        setLoginError('Network connection error. Please check your internet connection.');
      } else {
        setLoginError('incorrect login details');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Register with Email & Password
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const name = regName.trim();
    const email = regEmail.trim().toLowerCase();

    if (!name) {
      setRegError('Please provide your operative name');
      return;
    }

    if (!email) {
      setRegError('Please provide a valid email address');
      return;
    }

    if (!regPassword) {
      setRegError('Please provide a password');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }

    if (regPassword !== regRepeatPassword) {
      setRegError('Passwords do not match');
      return;
    }

    setRegLoading(true);
    try {
      // 1. Authenticate new operative user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        regPassword
      );

      // 2. Attach profile name and avatar to Firebase user profile
      try {
        await updateProfile(userCredential.user, {
          displayName: name || undefined,
          photoURL: avatarPreview && avatarPreview.length < 2048 ? avatarPreview : undefined
        });
      } catch (profileErr) {
        console.warn('Profile update warning:', profileErr);
      }

      // 3. Store necessary fields during registration into Firestore database 'Users'
      await addRegisteredUserToFirestore({
        uid: userCredential.user.uid,
        email: email,
        displayName: name || 'Vault Operative',
        photoURL: avatarPreview || null,
        emailVerified: userCredential.user.emailVerified
      });

      // 4. Optionally dispatch email verification notice in background
      try {
        await sendEmailVerification(userCredential.user);
      } catch (verErr) {
        console.warn('Email verification dispatch notice:', verErr);
      }

      // 5. Complete registration and activate session
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.warn('Firebase registration error:', err?.code, err?.message);
      // User requirement: If a user is with those credentials already exists display "user already exist. Sign in"
      if (
        err?.code === 'auth/email-already-in-use' ||
        err?.code === 'auth/credential-already-in-use' ||
        err?.message?.toLowerCase().includes('already in use') ||
        err?.message?.toLowerCase().includes('already exists')
      ) {
        setRegError('user already exist. Sign in');
      } else if (err?.code === 'auth/invalid-email') {
        setRegError('Please provide a valid email address.');
      } else if (err?.code === 'auth/weak-password') {
        setRegError('Password must be at least 6 characters.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setRegError('Email/Password provider is not enabled in Firebase Console. Please enable Email/Password in Authentication settings.');
      } else if (err?.code === 'auth/network-request-failed') {
        setRegError('Network connection error. Please check your internet connection.');
      } else {
        setRegError(err?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setRegLoading(false);
    }
  };

  // Google Authentication
  const handleGoogleAuth = async () => {
    setLoginError(null);
    setRegError(null);
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Add or synchronize Google user to Firestore collection 'Users'
      if (result.user) {
        try {
          await addRegisteredUserToFirestore({
            uid: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || 'Vault Operative',
            photoURL: result.user.photoURL || null,
            emailVerified: result.user.emailVerified || true
          });
        } catch (dbErr) {
          console.warn('Firestore Google Users collection write error:', dbErr);
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.warn('Google sign in error:', err?.code, err?.message);
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        // User closed or canceled the popup dialog; silently reset state
        return;
      }

      let errorMsg = 'Could not authenticate with Google. Please try again.';
      if (err?.code === 'auth/popup-blocked') {
        errorMsg = 'Pop-up window was blocked by your browser. Please allow popups for this site or open the app in a new tab to complete Google sign-in.';
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        errorMsg = 'An account already exists with this email address. Please sign in with your email and password.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        setShowDomainHelp(true);
        errorMsg = 'Current preview domain is not authorized in Firebase Auth. Please authenticate using email/password or follow the 30-second guide below to add the domain to Firebase Console.';
      } else if (err?.code === 'auth/network-request-failed') {
        errorMsg = 'Network connection error contacting Google authentication services. Please check your connection and retry.';
      } else if (err?.message) {
        errorMsg = err.message;
      }

      if (activeMode === 'signin') {
        setLoginError(errorMsg);
      } else {
        setRegError(errorMsg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseSettingsUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`;

  const copyToClipboard = async (text: string, type: 'wildcard' | 'exact') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const renderDomainAuthGuide = () => (
    <div 
      id="firebase-domain-auth-guide"
      className="p-4 sm:p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left space-y-3.5 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-sm font-['Rajdhani'] uppercase tracking-wider">
          <Globe className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Firebase Domain Authorization Required</span>
        </div>
        <button
          type="button"
          onClick={() => setShowDomainHelp(false)}
          className="text-gray-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
          title="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-amber-100/90 leading-relaxed">
        Google OAuth security requires domains hosting your application to be authorized in your Firebase project (<code className="text-amber-200 font-mono font-semibold">{firebaseConfig.projectId}</code>). Adding <strong className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/30">run.app</strong> takes 30 seconds and authorizes all Cloud Run preview and production links.
      </p>

      {/* Copy domain boxes */}
      <div className="space-y-2">
        <div className="p-2.5 bg-black/50 border border-amber-500/25 rounded-xl flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
              Recommended (Authorizes All Previews):
            </span>
            <span className="font-mono text-xs text-white font-bold truncate block select-all">
              run.app
            </span>
          </div>
          <button
            type="button"
            id="copy-runapp-btn"
            onClick={() => copyToClipboard('run.app', 'wildcard')}
            className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copiedType === 'wildcard' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy "run.app"</span>
              </>
            )}
          </button>
        </div>

        {currentHostname && currentHostname !== 'localhost' && (
          <div className="p-2.5 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-400">
                Exact Hostname:
              </span>
              <span className="font-mono text-xs text-gray-200 truncate block select-all">
                {currentHostname}
              </span>
            </div>
            <button
              type="button"
              id="copy-exact-hostname-btn"
              onClick={() => copyToClipboard(currentHostname, 'exact')}
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-gray-200 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copiedType === 'exact' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Exact</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Direct Action Link */}
      <a
        href={firebaseSettingsUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="open-firebase-console-link"
        className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-xs font-['Rajdhani'] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950/40 cursor-pointer"
      >
        <span>Open Firebase Console: Authorized Domains</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      {/* 4 Steps Checklist */}
      <div className="text-[11px] text-gray-300 space-y-1 pt-1">
        <p className="font-semibold text-white text-xs">Steps to Authorize:</p>
        <p>1. Click <strong className="text-amber-300">Open Firebase Console</strong> above.</p>
        <p>2. Under the <strong className="text-white">Authorized domains</strong> section, click <strong className="text-amber-300">Add domain</strong>.</p>
        <p>3. Paste <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">run.app</code> and click <strong className="text-amber-300">Add</strong>.</p>
        <p>4. Return to this screen and click <strong className="text-white">Retry Google Sign-In</strong> below.</p>
      </div>

      {/* Retry Button */}
      <button
        type="button"
        id="retry-google-auth-btn"
        disabled={googleLoading}
        onClick={handleGoogleAuth}
        className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Connecting to Google...</span>
          </span>
        ) : (
          <>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Google Sign-In</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className={`${isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto' : 'min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans'}`}>
      {/* Modal Backdrop */}
      {isModal && (
        <div 
          className="fixed inset-0 bg-[#05060a]/85 backdrop-blur-md transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-900/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[350px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Frosted Glass Card */}
      <div className="relative w-full max-w-xl bg-[#0d0f1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto">
        {/* Modal Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-md transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Decorative Header */}
        <div className="p-6 sm:p-8 text-center border-b border-white/10 bg-white/[0.02]">
          <div className="flex justify-center mb-3">
            <VaultLogo size="lg" showTagline={false} />
          </div>
          <p className="text-purple-300 font-['Space_Grotesk'] text-sm tracking-wide font-medium">
            "Watch. Play. Discuss. Discover."
          </p>
          <h2 className="text-xl sm:text-2xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white mt-1">
            Vault Operative Access
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Sign in or create an account to like posts, publish comments, and join civil community discussions.
          </p>

          {/* Prompt Message Banner */}
          {promptMessage && (
            <div className="mt-4 p-3 rounded-2xl bg-purple-950/50 border border-purple-500/40 flex items-center justify-center gap-2.5 text-xs text-purple-200 shadow-inner">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
              <span className="font-medium font-['Space_Grotesk']">{promptMessage}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md">
            <button
              type="button"
              id="tab-signin"
              onClick={() => {
                setActiveMode('signin');
                setLoginError(null);
                setRegError(null);
                setResetError(null);
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeMode === 'signin' || activeMode === 'forgot-password'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-register"
              onClick={() => {
                setActiveMode('register');
                setLoginError(null);
                setRegError(null);
                setResetError(null);
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeMode === 'register'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {/* ================= EMAIL VERIFICATION SCREEN ================= */}
          {activeMode === 'verification' ? (
            <div id="verification-screen" className="space-y-6 text-center py-2 animate-in fade-in duration-200">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-xl shadow-purple-950/50 backdrop-blur-md">
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center backdrop-blur-md">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
                  Email Verification Required
                </h3>
                <p
                  id="verification-message"
                  className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                >
                  we have sent you a verification email to <span className="text-purple-400 font-semibold">{verificationEmail}</span>. Verify it and log in
                </p>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs text-gray-400 text-left space-y-2 backdrop-blur-md">
                <div className="flex items-center gap-2 text-gray-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Next Steps</span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  1. Check your email at <strong className="text-white font-mono">{verificationEmail}</strong> (including spam/junk folders).
                  <br />
                  2. Click the verification link from Firebase to verify your email.
                  <br />
                  3. Click the <strong className="text-white">Login</strong> button below to access your account.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  id="verification-login-btn"
                  onClick={() => {
                    setActiveMode('signin');
                    setLoginEmail(verificationEmail);
                    setLoginPassword('');
                    setLoginError(null);
                  }}
                  className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('register');
                      setRegError(null);
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Change registration email
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('signin');
                      setLoginEmail(verificationEmail);
                      setLoginError(null);
                    }}
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : activeMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Error Notification */}
              {loginError && (
                <div
                  id="signin-error-banner"
                  className="p-3.5 bg-red-600/20 border border-red-500/40 rounded-2xl flex items-center gap-3 text-red-200 text-xs backdrop-blur-md animate-in fade-in duration-150"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-medium tracking-wide">{loginError}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="operative@gamevault.forum"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    id="forgot-password-prompt"
                    onClick={handleOpenForgotPassword}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={loginLoading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0b0d17] px-3 text-[11px] uppercase tracking-widest text-gray-400 font-mono">
                  OR
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                id="google-signin-btn"
                disabled={googleLoading || loginLoading}
                onClick={handleGoogleAuth}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="flex items-center gap-2 text-purple-300">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Domain Authorization Guide / Toggle */}
              {showDomainHelp ? (
                renderDomainAuthGuide()
              ) : (
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowDomainHelp(true)}
                    className="text-[11px] text-gray-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-3 h-3 text-amber-400/80" />
                    <span>Domain authorization guide for Google Sign-In</span>
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 pt-2">
                Need a new operative account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('register');
                    setLoginError(null);
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : activeMode === 'forgot-password' ? (
            /* ================= FORGOT PASSWORD MODE ================= */
            resetSent ? (
              /* Success Screen */
              <div id="forgot-password-success-screen" className="space-y-6 text-center py-2 animate-in fade-in duration-200">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-xl shadow-purple-950/50 backdrop-blur-md">
                      <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
                    Password Reset Sent
                  </h3>
                  <p
                    id="forgot-password-success-message"
                    className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                  >
                    We sent you a password reset link to <span className="text-purple-400 font-semibold">{resetEmail}</span>.
                  </p>
                </div>

                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs text-gray-400 text-left space-y-2 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-gray-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Next Steps</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    1. Check your email inbox at <strong className="text-white font-mono">{resetEmail}</strong> (including spam/junk folder).
                    <br />
                    2. Click the Firebase password reset link to create your new password.
                    <br />
                    3. Return and use the <strong className="text-white">Sign in</strong> button below to log in.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    id="forgot-password-signin-btn"
                    onClick={() => {
                      setActiveMode('signin');
                      setLoginEmail(resetEmail);
                      setResetSent(false);
                      setLoginError(null);
                    }}
                    className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Reset Request Form */
              <form onSubmit={handleGetResetLink} className="space-y-4 animate-in fade-in duration-200">
                <div className="text-center mb-4">
                  <div className="inline-flex p-3 rounded-2xl bg-purple-600/15 border border-purple-500/30 text-purple-400 mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-['Rajdhani'] uppercase tracking-wider text-white">
                    Reset Vault Password
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Enter your email or verify the email passed from the sign-in form to receive your reset link.
                  </p>
                </div>

                {/* Error Notification */}
                {resetError && (
                  <div
                    id="reset-error-banner"
                    className="p-3.5 bg-red-600/20 border border-red-500/40 rounded-2xl flex items-center gap-3 text-red-200 text-xs backdrop-blur-md animate-in fade-in duration-150"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-medium tracking-wide">{resetError}</span>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      placeholder="operative@gamevault.forum"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                    />
                  </div>
                </div>

                {/* Get Reset Link Button */}
                <button
                  type="submit"
                  id="get-reset-link-btn"
                  disabled={resetLoading}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    <>
                      <span>Get reset link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('signin');
                      setResetError(null);
                    }}
                    className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )
          ) : (
            /* ================= REGISTER MODE ================= */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Error Notification */}
              {regError && (
                <div
                  id="register-error-banner"
                  className="p-3.5 bg-red-600/20 border border-red-500/40 rounded-2xl flex items-center justify-between gap-2 text-red-200 text-xs backdrop-blur-md animate-in fade-in duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-medium tracking-wide">{regError}</span>
                  </div>
                  {regError === 'user already exist. Sign in' && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode('signin');
                        setLoginEmail(regEmail);
                        setLoginError(null);
                      }}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-['Rajdhani'] font-bold uppercase tracking-wider shrink-0 transition-colors"
                    >
                      Sign In Now
                    </button>
                  )}
                </div>
              )}

              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/20 flex items-center justify-center shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-7 h-7 text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="register-avatar-upload"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold border border-white/15 backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-purple-400" />
                        <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>

                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 rounded-xl border border-white/10 transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">PNG, JPG or WebP up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-name"
                  className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                >
                  Full Name / Operative Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="register-name"
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-email"
                  className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="register-email"
                    type="email"
                    required
                    placeholder="operative@gamevault.forum"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                >
                  Password (6+ characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="register-password"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Repeat Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-repeat-password"
                  className="block text-xs font-['Rajdhani'] font-bold uppercase tracking-wider text-gray-300"
                >
                  Repeat Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="register-repeat-password"
                    type={showRegRepeatPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={regRepeatPassword}
                    onChange={(e) => setRegRepeatPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 backdrop-blur-md transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegRepeatPassword(!showRegRepeatPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showRegRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                id="register-submit-btn"
                disabled={regLoading}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
              >
                {regLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Account...
                  </span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0b0d17] px-3 text-[11px] uppercase tracking-widest text-gray-400 font-mono">
                  OR
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>

              {/* Google Sign In in Register */}
              <button
                type="button"
                id="google-signup-btn"
                disabled={googleLoading || regLoading}
                onClick={handleGoogleAuth}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <div className="flex items-center gap-2 text-purple-300">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign up with Google</span>
                  </>
                )}
              </button>

              {/* Domain Authorization Guide / Toggle */}
              {showDomainHelp ? (
                renderDomainAuthGuide()
              ) : (
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowDomainHelp(true)}
                    className="text-[11px] text-gray-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-3 h-3 text-amber-400/80" />
                    <span>Domain authorization guide for Google Sign-In</span>
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 pt-2">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('signin');
                    setRegError(null);
                  }}
                  className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Firebase Auth Protected
            </span>
            <span>Game Vault Protocol v2.6</span>
          </div>
        </div>
      </div>
    </div>
  );
};
