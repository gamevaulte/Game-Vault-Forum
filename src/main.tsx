import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both getter and setter in all browser/iframe contexts
if (typeof window !== 'undefined') {
  try {
    let target: any = window;
    let desc: PropertyDescriptor | undefined;
    while (target) {
      desc = Object.getOwnPropertyDescriptor(target, 'fetch');
      if (desc) break;
      target = Object.getPrototypeOf(target);
    }
    if (desc && desc.get && !desc.set) {
      let activeFetch = window.fetch ? window.fetch.bind(window) : undefined;
      Object.defineProperty(window, 'fetch', {
        get() {
          return activeFetch;
        },
        set(fn) {
          activeFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch (e) {
    // Graceful fallback
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
);
