type UpdateCallback = (registration: ServiceWorkerRegistration) => void;

let updateListeners: UpdateCallback[] = [];

export const onServiceWorkerUpdate = (callback: UpdateCallback) => {
  updateListeners.push(callback);
  return () => {
    updateListeners = updateListeners.filter((fn) => fn !== callback);
  };
};

// Force clear all caches and unregister service workers
export const clearAppCacheAndReload = async () => {
  try {
    // 1. Clear caches API
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }

    // 2. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    }

    // 3. Clear session storage
    sessionStorage.clear();

    // 4. Force reload without cache
    window.location.reload();
  } catch (err) {
    console.error('Error clearing cache:', err);
    window.location.reload();
  }
};

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

      // Check for updates on load
      registration.update().catch(() => {});

      // Periodically check for updates every 15 minutes
      setInterval(() => {
        registration.update().catch(() => {});
      }, 15 * 60 * 1000);

      // Check if there is already a waiting worker
      if (registration.waiting) {
        updateListeners.forEach((fn) => fn(registration));
      }

      // Listen for new service worker installation
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available; notify user
              console.log('[SW] New version detected');
              updateListeners.forEach((fn) => fn(registration));
            } else {
              // Content is cached for offline use
              console.log('[SW] Content cached for offline use.');
            }
          }
        });
      });

      // Reload page automatically when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    } catch (err) {
      // Offline support is progressive
      console.warn('[SW] Registration skipped or failed:', err);
    }
  }, { once: true });
};
