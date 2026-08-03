
const CACHE = "oms-v1";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js"
];

self.addEventListener("install", e => {

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

});

self.addEventListener("fetch", e => {

    if (e.request.method !== "GET") return;

    e.respondWith(

        caches.match(e.request).then(r => {

            return (
                r ||
                fetch(e.request).then(network => {

                    if (
                        network &&
                        network.status === 200 &&
                        network.type === "basic"
                    ) {
                        const copy = network.clone();

                        caches.open(CACHE)
                            .then(cache => cache.put(e.request, copy));
                    }

                    return network;

                })

            );

        })

    );

});
