
const CACHE_NAME = 'gestion-tareas-v4';

const ARCHIVOS_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// Instalar y guardar los archivos principales
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

// Gestionar las solicitudes
self.addEventListener('fetch', (evento) => {
  const solicitud = evento.request;

  if (solicitud.method !== 'GET') {
    return;
  }

  const url = new URL(solicitud.url);

  // No almacenar solicitudes externas, API ni Socket.IO
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/socket.io/')
  ) {
    return;
  }

  // Navegación: primero intentar obtener la versión actual
  if (solicitud.mode === 'navigate') {
    evento.respondWith(
      fetch(solicitud)
        .then((respuesta) => respuesta)
        .catch(async () => {
          const pagina = await caches.match('/index.html');

          return pagina || new Response(
            'Aplicación no disponible sin conexión',
            { status: 503 }
          );
        })
    );

    return;
  }

  // Archivos estáticos: utilizar caché cuando estén disponibles
  const esArchivoEstatico =
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname.startsWith('/icon-') ||
    url.pathname === '/favicon.ico';

  if (!esArchivoEstatico) {
    return;
  }

  evento.respondWith(
    caches.match(solicitud).then((recursoGuardado) => {
      if (recursoGuardado) {
        return recursoGuardado;
      }

      return fetch(solicitud).then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(solicitud, copia);
          });
        }

        return respuesta;
      });
    })
  );
});
