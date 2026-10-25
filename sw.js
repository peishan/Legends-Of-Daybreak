// Legends of Daybreak service worker.
// Bump CACHE_VERSION when shipping changes so installed copies drop the old cache.
const CACHE_VERSION = 'daybreak-v1';

// App shell: network-first so updates land on the next open; falls back to cache offline.
const SHELL = ['./', './index.html', './styles.css', './game.js', './sync.js', './act2-data.js', './act3-data.js', './manifest.json'];
// Small assets that rarely change are precached; a missing one must not break install.
const PRECACHE = ['./icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then(async (cache) => {
    await cache.addAll(SHELL);
    await Promise.all(PRECACHE.map((u) => cache.add(u).catch(() => {})));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // fonts, GitHub API: straight to the network
  if (/\.mp3$/i.test(url.pathname) || req.headers.has('range')) return; // audio streams use range requests; don't cache

  const isShell = req.mode === 'navigate' || SHELL.some((s) => url.pathname.endsWith(s.replace('./', '/')) || url.pathname.endsWith('/'));
  if (isShell) {
    event.respondWith(fetch(req).then((res) => {
      if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html'))));
    return;
  }
  // Boss art, portraits, icons: cache-first, filled as they are first seen.
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_VERSION).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => undefined)));
});
