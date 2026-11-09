// Cache offline: app + pdf.js. O PDF da norma fica no IndexedDB do aparelho, não aqui.
const V = "nbr8160-v8";
const ARQ = ["./", "index.html", "versao.js", "dados.js", "app.js", "visual.js", "quiz.js", "guia.js", "manifest.json", "icone.svg", "icone-192.png", "icone-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"];
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(ARQ)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
