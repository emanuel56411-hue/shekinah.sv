const CACHE_VERSION = "shekinah-pwa-v20";

const PRECACHE_URLS = [
  "./",
  "index.html",
  "styles.css?v=20",
  "script.js?v=20",
  "manifest.json",
  "offline.html",
  "assets/logo-shekinah.png",
  "assets/iglesia-shekinah-interior.png",
  "assets/fotos/equipo-alabanza.webp",
  "assets/fotos/ministerio-ninos.webp",
  "assets/fotos/aniversario-shekinah.webp",
  "assets/fotos/liderazgo-pastoral.webp",
  "assets/fotos/congregacion-culto.webp",
  "assets/fotos/predicacion-shekinah.webp",
  "assets/fotos/predicacion-horarios.webp",
  "assets/fotos/presentacion-ninos.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_VERSION);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cachedPage = (await cache.match(request)) || (await cache.match("index.html"));
    return cachedPage || cache.match("offline.html");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

