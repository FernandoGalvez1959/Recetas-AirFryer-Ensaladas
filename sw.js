// Guarda la app en el dispositivo para usarla sin conexión y gestiona las actualizaciones.
// Al publicar una versión nueva, cambia el número de VERSION.
const VERSION = '6.5';
const CACHE = 'recetario-' + VERSION;
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).catch(() => {}));
  self.skipWaiting();            // la versión nueva entra en cuanto está lista
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.tipo === 'saltar') self.skipWaiting();
});

// Primero la red, para recibir los cambios; si no hay conexión, la copia guardada.
// GitHub guarda una copia de la página unos minutos: para la página pedimos la
// versión fresca por su dirección, que es la forma que sí admiten los navegadores.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  let peticion;
  try {
    const url = new URL(e.request.url);
    const esPagina = e.request.mode === 'navigate'
      || url.pathname.endsWith('/')
      || /\.(html|webmanifest)$/.test(url.pathname);
    peticion = esPagina
      ? fetch(url.href, { cache: 'reload', credentials: 'same-origin' })
      : fetch(e.request);
  } catch (err) {
    peticion = fetch(e.request);
  }

  e.respondWith(
    peticion
      .then(r => {
        if (r && r.ok) {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
        }
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
