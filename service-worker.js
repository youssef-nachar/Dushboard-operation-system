const CACHE = "oms-v2";

const FILES = [
  "/Dushboard-operation-system/",
  "/Dushboard-operation-system/index.html",
  "/Dushboard-operation-system/style.css",
  "/Dushboard-operation-system/script.js",
  "/Dushboard-operation-system/manifest.json",
  "/Dushboard-operation-system/icons/icon-192.png",
  "/Dushboard-operation-system/icons/icon-512.png"
];

self.addEventListener("install", e => {
    self.skipWaiting();

    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("activate", e => {

    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== CACHE)
                    .map(k => caches.delete(k))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", e => {

    if (e.request.method !== "GET") return;

    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
