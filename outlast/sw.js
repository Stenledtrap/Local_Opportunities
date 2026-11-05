/* Outlast offline support: keep a copy of every page file so guides open without signal. */
const VERSION = "outlast-v2";
const FILES = ["./", "index.html", "css/outlast.css", "js/diagrams.js", "js/guides.js", "js/content.js", "js/forum-seed.js", "js/games.js", "js/ui.js", "js/chat.js", "js/app.js", "assets/logo.svg", "manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Serve from the cache straight away, refresh it in the background (fonts included).
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const hit = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then((res) => { if (res && (res.ok || res.type === "opaque")) cache.put(e.request, res.clone()); return res; }).catch(() => hit);
    return hit || fresh;
  }));
});
