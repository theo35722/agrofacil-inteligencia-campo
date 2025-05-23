
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner';
import { toast } from 'sonner';

// Register Service Worker with enhanced update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Force update by unregistering any existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      
      // Register the service worker again
      const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      console.log('Service Worker registered with scope:', registration.scope);
      
      // Check for updates on page load
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed but waiting
              toast.info('Nova atualização disponível!', {
                description: 'Recarregue a página para ver as novidades.',
                action: {
                  label: 'Atualizar agora',
                  onClick: () => {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                },
                duration: 10000
              });
            }
          });
        }
      });
      
      // Handle controller change (when skipWaiting is called)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster position="top-right" closeButton />
  </>
);
