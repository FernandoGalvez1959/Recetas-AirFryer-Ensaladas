// Guarda la app en el dispositivo para usarla sin conexión y gestiona las actualizaciones.
// Al publicar una versión nueva, cambia el número de VERSION: eso basta para que
// ordenadores y móviles detecten el cambio y se ofrezcan a actualizarse.
const VERSION = '6.3';
const CACHE = 'recetario-' + VERSION;
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  // No se activa sola: espera a que el usuario pulse Actualizar.
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(claves =>
      Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// La app pide activar la versión nueva.
self.addEventListener('message', e => {
  if (e.data && e.data.tipo === 'saltar') self.skipWaiting();
});

// Primero la red, para recibir cambios; si no hay conexión, la copia guardada.
// GitHub guarda una copia de la página durante unos minutos: para la página y el
// manifiesto pedimos siempre la versión fresca, saltándonos esa copia.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const esPagina = e.request.mode === 'navigate'
    || url.pathname.endsWith('/')
    || /\.(html|webmanifest|js)$/.test(url.pathname);
  const peticion = esPagina ? fetch(e.request, {cache: 'reload'}) : fetch(e.request);
  e.respondWith(
    peticion
      .then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
