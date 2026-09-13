import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both getter and setter in all browser/iframe contexts
if (typeof window !== 'undefined') {
  try {
    const isFetchGetterError = (msg: unknown) =>
      typeof msg === 'string' && msg.includes('fetch') && msg.includes('getter');

    window.addEventListener(
      'error',
      (event) => {
        if (event && (isFetchGetterError(event.message) || (event.error && isFetchGetterError(event.error.message)))) {
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
          return true;
        }
      },
      true,
    );

    let activeFetch: typeof window.fetch | undefined = window.fetch ? window.fetch.bind(window) : undefined;
    const getFetch = () => activeFetch;
    const setFetch = (fn: any) => {
      activeFetch = fn;
    };

    const targets: any[] = [window];
    if (typeof Window !== 'undefined' && Window.prototype) {
      targets.push(Window.prototype);
    }
    let proto = Object.getPrototypeOf(window);
    while (proto && proto !== Object.prototype) {
      if (!targets.includes(proto)) {
        targets.push(proto);
      }
      proto = Object.getPrototypeOf(proto);
    }

    for (const t of targets) {
      try {
        Object.defineProperty(t, 'fetch', {
          get: getFetch,
          set: setFetch,
          configurable: true,
          enumerable: true,
        });
      } catch {
        // Target may be non-configurable, continue to next target
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
