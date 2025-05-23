
const CACHE_NAME = 'agrofacil-v9';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/lovable-uploads/f17b5b81-0cf8-4c9f-aa66-13879da10181.png',
  '/screenshots/screen1.png',
  '/screenshots/screen2.png',
  '/offline.html'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Força ativação em todas as abas
});

// Fetch event - serve from cache when possible, use network as fallback
self.addEventListener('fetch', event => {
  // Verifica se a requisição é feita para o mesmo domínio ou utiliza HTTPS
  if (
    event.request.url.startsWith(self.location.origin) || 
    event.request.url.startsWith('https://')
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if found
          if (response) {
            return response;
          }
          
          // Clone the request to use it for cache and also for fetch
          const fetchRequest = event.request.clone();
          
          return fetch(fetchRequest)
            .then(response => {
              // Don't cache if not a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response as it can only be consumed once
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // Se falhar ao buscar e for um documento HTML, 
              // tenta retornar a página offline
              if (event.request.headers.get('accept')?.includes('text/html')) {
                return caches.match('/offline.html');
              }
            });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Para que o Service Worker conquiste o controle das páginas imediatamente
      return self.clients.claim();
    })
  );
});

// Ouvir mensagem para pular o cache forçadamente 
// (útil quando o usuário solicita atualização explicitamente)
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
