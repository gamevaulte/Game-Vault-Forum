import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Database } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Vault ErrorBoundary caught an unhandled render error:', error, errorInfo);

    // Auto-heal chunk load failures after deployment or dormant tab awakenings
    const msg = error?.message || '';
    const isChunkLoadError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('error loading dynamically imported module') ||
      msg.includes('Loading chunk') ||
      msg.includes('Importing a module script failed');

    if (isChunkLoadError && typeof window !== 'undefined') {
      try {
        const lastRetry = sessionStorage.getItem('gv_chunk_retry_ts');
        const now = Date.now();
        if (!lastRetry || now - parseInt(lastRetry, 10) > 15000) {
          sessionStorage.setItem('gv_chunk_retry_ts', String(now));
          console.warn('Auto-reloading page to fetch fresh application bundles...');
          window.location.reload();
          return;
        }
      } catch (_) {}
    }

    this.setState({ errorInfo });
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private handleClearCacheAndReload = () => {
    if (typeof window !== 'undefined') {
      try {
        // Clear potential corrupted local storage keys while preserving auth
        const keysToRemove = [
          'gv_forum_user_v2',
          'gv_post_likes_v2',
          'gv_post_comments_v2',
          'gv_forum_topics_v3',
          'gv_visitor_likes_v1',
          'gv_chunk_retry_ts'
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (_) {}
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
          <div className="w-full max-w-lg bg-[#0e101d] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                {this.props.fallbackTitle || 'Game Vault Operational Recovery'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-['Inter']">
                A temporary rendering interruption was safely contained. Your account, progress, and saved data remain protected.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-left font-mono text-[11px] text-amber-300/90 break-words max-h-24 overflow-y-auto">
                <span className="text-slate-500 uppercase text-[9px] block mb-1">Status Code:</span>
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-['Rajdhani'] font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-['Rajdhani'] font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Vault Home</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={this.handleClearCacheAndReload}
                className="text-[11px] text-slate-500 hover:text-purple-300 font-mono underline transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
              >
                <Database className="w-3 h-3" />
                <span>Reset Local Cache & Re-enter</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
