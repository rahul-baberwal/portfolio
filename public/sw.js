/**
 * Service Worker — Rahul Baberwal Portfolio
 * Strategy: Cache-first for static assets, network-first for pages.
 */

const CACHE_NAME = 'rb-portfolio-v1';

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/vendor/fa/css/all.min.css',
  '/vendor/fa/webfonts/fa-solid-900.woff2',
  '/vendor/fa/webfonts/fa-brands-400.woff2',
  '/vendor/fa/webfonts/fa-regular-400.woff2',
  '/vendor/devicon/devicon.min.css',
  '/vendor/devicon/fonts/devicon.woff',
  '/favicon.svg',
  '/maskable-icon.svg',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate immediately, don't wait for old tabs to close
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests and GET
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Skip Next.js internal routes (HMR, data fetching, RSC)
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // Cache-first for fonts and vendor assets (long-lived)
  if (
    url.pathname.startsWith('/vendor/') ||
    url.pathname.match(/\.(woff2?|ttf|eot|svg|png|jpg|webp|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
      )
    );
    return;
  }

  // Network-first for HTML pages (always fresh content)
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        return res;
      })
      .catch(() => caches.match(request))
  );
});
