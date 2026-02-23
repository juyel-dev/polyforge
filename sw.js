const CACHE = 'polyforge-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/style.css',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0/min/vs/editor.main.js',
  'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
