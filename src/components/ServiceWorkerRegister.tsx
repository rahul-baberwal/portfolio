'use client';

import { useEffect } from 'react';

/**
 * Registers /sw.js as a service worker.
 * Rendered in the root layout so it runs on every page.
 * Must be a Client Component because it uses useEffect.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[SW] Registered, scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });
    }
  }, []);

  return null; // renders nothing — side-effect only
}
