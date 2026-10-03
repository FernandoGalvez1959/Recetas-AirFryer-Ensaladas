// Guarda la app en el dispositivo para usarla sin conexión y gestiona las actualizaciones.
// Al publicar una versión nueva, cambia el número de VERSION: eso basta para que
// ordenadores y móviles detecten el cambio y se ofrezcan a actualizarse.
const VERSION = '4.2';
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
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
