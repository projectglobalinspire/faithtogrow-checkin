/* Service worker: cache app shell agar halaman tetap terbuka saat offline.
   Data tetap dari Supabase (network); saat offline, check-in masuk antrean
   localStorage (lihat hadir.html) dan terkirim otomatis saat online. */

const CACHE = "fbf-shell-v1";
const SHELL = [
  "hadir.html",
  "login.html",
  "style.css",
  "data.js",
  "auth.js",
  "icon.svg",
  "manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* network-first: selalu coba versi terbaru, jatuh ke cache saat offline */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
