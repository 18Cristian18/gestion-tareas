const CACHE_NAME = 'gestion-tareas-v3';

const ARCHIVOS_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-512.png',
  '/favicon.ico',
  '/assets/index-DLK-V5s6.css',
  '/assets/index-DCkf1rL9.js'
];

// Instalar y guardar los archivos necesarios
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ARCHIVOS_CACHE))
  );

  self.skipWaiting();
});

// Activar y eliminar caches anteriores
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) => {
      return Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      );
    })
  );

  self.clients.claim();
});

// Recuperar primero los archivos guardados
self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') {
    return;
  }

  const url = new URL(evento.request.url);

  // No interceptar solicitudes de otros servidores, como la API
  if (url.origin !== self.location.origin) {
    return;
  }

  evento.respondWith(
    caches.match(evento.request, {
  ignoreSearch: true,
  ignoreVary: true
})
      .then((recursoGuardado) => {
        if (recursoGuardado) {
          return recursoGuardado;
        }

        return fetch(evento.request)
          .then((respuesta) => {
            if (respuesta.ok) {
              const copia = respuesta.clone();

              caches.open(CACHE_NAME).then((cache) => {
                cache.put(evento.request, copia);
              });
            }

            return respuesta;
          })
          .catch(async () => {
            if (evento.request.mode === 'navigate') {
              const pagina = await caches.match('/index.html');
              if (pagina) return pagina;
            }

            return new Response('Recurso no disponible sin conexion', {
              status: 503,
              headers: {
                'Content-Type': 'text/plain; charset=utf-8'
              }
            });
          });
      })
  );
});
