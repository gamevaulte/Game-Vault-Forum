import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both getter and setter in all browser/iframe contexts without throwing
if (typeof window !== 'undefined') {
  try {
    const isFetchGetterError = (msg: unknown) =>
      typeof msg === 'string' && msg.includes('fetch') && msg.includes('getter');

    const isHarmlessThirdPartyNoise = (msg: unknown) => {
      if (typeof msg !== 'string') return false;
      return (
        isFetchGetterError(msg) ||
        msg.includes('adsbygoogle') ||
        msg.includes('ResizeObserver') ||
        msg.includes('Non-Error promise rejection') ||
        msg.includes('chrome-extension://') ||
        msg.includes('moz-extension://') ||
        msg.includes('safari-extension://')
      );
    };

    window.addEventListener(
      'error',
      (event) => {
        if (
          event &&
          (isFetchGetterError(event.message) ||
            (event.error && isFetchGetterError(event.error.message)) ||
            isHarmlessThirdPartyNoise(event.message))
        ) {
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return true;
        }
      },
      true,
    );

    window.addEventListener(
      'unhandledrejection',
      (event) => {
        if (event && event.reason && isHarmlessThirdPartyNoise(String(event.reason))) {
          if (event.preventDefault) event.preventDefault();
          return true;
        }
      },
      true,
    );

    // Filter console.error from repetitive browser extension/iframe noise
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const firstArg = args[0];
      if (typeof firstArg === 'string' && isHarmlessThirdPartyNoise(firstArg)) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Safely check if window.fetch already has a setter or is non-writable
    let activeFetch = window.fetch ? window.fetch.bind(window) : undefined;
    const currentDescriptor = Object.getOwnPropertyDescriptor(window, 'fetch') ||
      (typeof Window !== 'undefined' ? Object.getOwnPropertyDescriptor(Window.prototype, 'fetch') : null);

    if (currentDescriptor && currentDescriptor.get && !currentDescriptor.set && currentDescriptor.configurable) {
      try {
        Object.defineProperty(window, 'fetch', {
          get() {
            return activeFetch;
          },
          set(fn: any) {
            activeFetch = fn;
          },
          configurable: true,
          enumerable: true
        });
      } catch {
        // Continue safely if host environment restricts definition
      }
    }
  } catch {
    // Graceful fallback
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
);
