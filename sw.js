// Service worker: aplicația merge offline după prima încărcare.
const VERSIUNE = 'gqc-v1.1.0';
const NUCLEU = [
  './', 'index.html', 'manifest.json', 'css/style.css',
  'js/app.js', 'js/engine.js', 'js/exercises.js', 'js/harta.js', 'js/expeditie.js', 'js/clasa.js', 'js/profesor.js', 'js/storage.js', 'js/normalize.js', 'js/ui.js',
  'data/lectii.json', 'data/intrebari_teste.json', 'data/intrebari_extra.json', 'data/harta.json', 'data/insigne.json',
  'assets/harta.webp', 'assets/harta.png', 'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSIUNE).then(c => c.addAll(NUCLEU)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSIUNE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // rețea mai întâi (conținut proaspăt), cache la nevoie – inclusiv fonturile Google
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') { const copie = r.clone(); caches.open(VERSIUNE).then(c => c.put(e.request, copie)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
